// Small helpers the index modules share (task-019): reading loosely typed YAML data, byte order,
// and Markdown code spans.
import { parse as parseYaml } from 'yaml';

import type { TreeSource } from './index-source';

export type Doc = Record<string, unknown>;

/** A file the index reads does not parse or is not a mapping: the lint's to report (exit 1). */
export class IndexInputError extends Error {}

export function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

/** Unique, in ascending byte order. */
export function sorted(names: string[]): string[] {
  return [...new Set(names)].sort(byBytes);
}

export function isDoc(value: unknown): value is Doc {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** A scalar as text; anything else as JSON, so that a malformed file never prints [object]. */
export function text(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return `${value}`;
  return JSON.stringify(value) ?? '';
}

export function strings(value: unknown): string[] {
  return list(value).map(text);
}

/** A code span that holds any text: a fence longer than the longest run of backticks in it. */
export function code(value: string): string {
  const longest = Math.max(0, ...[...value.matchAll(/`+/g)].map((run) => run[0].length));
  const fence = '`'.repeat(longest + 1);
  const pad = longest > 0 ? ' ' : '';
  return `${fence}${pad}${value}${pad}${fence}`;
}

/** A YAML mapping of a view; undefined when the file is missing. */
export function yamlIn(source: TreeSource, path: string): Doc | undefined {
  const content = source.read(path);
  if (content === undefined) return undefined;
  let data: unknown;
  try {
    data = parseYaml(content);
  } catch {
    throw new IndexInputError(`${source.label}: ${path} does not parse; the lint reports it`);
  }
  if (!isDoc(data)) {
    throw new IndexInputError(`${source.label}: ${path} is not a mapping; the lint reports it`);
  }
  return data;
}

/** Like yamlIn, a missing file being an input error too. */
export function yamlAt(source: TreeSource, path: string): Doc {
  const data = yamlIn(source, path);
  if (data === undefined) {
    throw new IndexInputError(`${source.label}: ${path} is missing; the lint reports it`);
  }
  return data;
}
