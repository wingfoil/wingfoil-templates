// YAML loading with positions (spec-001 §17 step 2, adr-003): one document per file, unique keys,
// and for every value its line, column and source text, which the schema check and the lint use.
import { readFileSync } from 'node:fs';
import { LineCounter, isMap, isScalar, isSeq, parseAllDocuments } from 'yaml';
import type { Document, Node } from 'yaml';

export interface Position {
  line: number;
  column: number;
}

export type YamlErrorReason = 'syntax' | 'encoding' | 'io';

export class YamlError extends Error {
  constructor(
    readonly file: string,
    readonly position: Position,
    readonly reason: YamlErrorReason,
    /** The message without its `<file>:<line>:<column>: ` prefix. */
    readonly detail: string,
  ) {
    super(`${file}:${position.line}:${position.column}: ${detail}`);
    this.name = 'YamlError';
  }
}

export interface LoadedYaml {
  file: string;
  data: unknown;
  document: Document;
  /**
   * Where the node at a JSON pointer starts, or 1:1 if the pointer leads nowhere. For an error
   * about a key (`required`, `additionalProperties`) the pointer names the mapping, so the
   * position is the mapping's.
   */
  positionOf(pointer: string): Position;
}

const START: Position = { line: 1, column: 1 };

function decodePointer(pointer: string): string[] {
  if (pointer === '') return [];
  return pointer.slice(1).split('/').map((part) => part.replace(/~1/g, '/').replace(/~0/g, '~'));
}

/** The node at a path, walking mappings by key and sequences by index; undefined if absent. */
function nodeAt(document: Document, path: string[]): Node | undefined {
  let node: unknown = document.contents;
  for (const part of path) {
    if (isMap(node)) {
      const pair = node.items.find((item) => isScalar(item.key) && String(item.key.value) === part);
      node = pair?.value;
    } else if (isSeq(node)) {
      node = /^\d+$/.test(part) ? node.items[Number(part)] : undefined;
    } else {
      return undefined;
    }
  }
  return (node ?? undefined) as Node | undefined;
}

export function parseYaml(text: string, file: string): LoadedYaml {
  const lineCounter = new LineCounter();
  const documents = [
    ...parseAllDocuments(text, { lineCounter, uniqueKeys: true, prettyErrors: false }),
  ];
  const at = (offset: number): Position => {
    const { line, col } = lineCounter.linePos(offset);
    return { line, column: col };
  };
  const [document, second] = documents;
  if (second !== undefined) {
    throw new YamlError(file, at(second.range[0]), 'syntax', 'more than one YAML document');
  }
  if (document === undefined) {
    throw new YamlError(file, START, 'syntax', 'no YAML document');
  }
  const [error] = [...document.errors].sort((a, b) => a.pos[0] - b.pos[0]);
  if (error !== undefined) {
    const detail = `${error.code}: ${firstLine(error.message)}`;
    throw new YamlError(file, at(error.pos[0]), 'syntax', detail);
  }
  let data: unknown;
  try {
    // No aliases: this repository's files never need them, and they allow expansion attacks.
    data = document.toJS({ maxAliasCount: 0 });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new YamlError(file, START, 'syntax', firstLine(message));
  }
  return {
    file,
    data,
    document,
    positionOf(pointer) {
      // The root is the file itself, wherever its first node starts after comments.
      if (pointer === '') return START;
      const range = nodeAt(document, decodePointer(pointer))?.range;
      return range ? at(range[0]) : START;
    },
  };
}

function firstLine(message: string): string {
  return message.split('\n')[0] ?? message;
}

export function loadYamlFile(path: string, file: string): LoadedYaml {
  let bytes: Buffer;
  try {
    bytes = readFileSync(path);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new YamlError(file, START, 'io', `cannot read: ${reason}`);
  }
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new YamlError(file, START, 'encoding', 'not valid UTF-8');
  }
  return parseYaml(text, file);
}
