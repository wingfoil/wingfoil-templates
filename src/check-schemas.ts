// `npm run check:schemas`: every file of a known kind in the repository against its schema
// (spec-001 §17 step 2, F3.1). Files are found in sorted order and messages are sorted, so the
// output never depends on the filesystem.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { loadSchemas } from './schemas';
import type { SchemaKind, SchemaSet } from './schemas';
import { YamlError, loadYamlFile } from './yaml-load';
import type { Position } from './yaml-load';

export interface FoundFile {
  /** Relative to the root, with `/` separators. */
  file: string;
  kind: SchemaKind;
}

export interface SchemaCheckResult {
  /** 0: every file passes; 1: a YAML or schema error; 2: a file cannot be read or decoded. */
  code: number;
  checked: number;
  messages: string[];
}

interface Message {
  file: string;
  position: Position;
  text: string;
}

function sortedEntries(dir: string): { name: string; isDirectory: boolean }[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .map((entry) => ({ name: entry.name, isDirectory: entry.isDirectory() }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

function packManifests(root: string, dir: string): string[] {
  const found: string[] = [];
  for (const entry of sortedEntries(join(root, dir))) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory) found.push(...packManifests(root, path));
    else if (entry.name === 'pack.yaml') found.push(path);
  }
  return found;
}

function yamlFilesIn(root: string, dir: string): string[] {
  return sortedEntries(join(root, dir))
    .filter((entry) => entry.name.endsWith('.yaml'))
    .map((entry) => `${dir}/${entry.name}`);
}

export function findFiles(root: string): FoundFile[] {
  const rootNames = new Set(sortedEntries(root).map((entry) => entry.name));
  const found: FoundFile[] = [];
  for (const kind of ['catalog', 'compat'] as const) {
    if (rootNames.has(`${kind}.yaml`)) found.push({ file: `${kind}.yaml`, kind });
  }
  found.push(...packManifests(root, 'packs').map((file) => ({ file, kind: 'pack' as const })));
  found.push(...yamlFilesIn(root, 'presets').map((file) => ({ file, kind: 'preset' as const })));
  found.push(
    ...yamlFilesIn(root, 'transitions').map((file) => ({ file, kind: 'transition' as const })),
  );
  return found;
}

function compareMessages(a: Message, b: Message): number {
  if (a.file !== b.file) return a.file < b.file ? -1 : 1;
  if (a.position.line !== b.position.line) return a.position.line - b.position.line;
  if (a.position.column !== b.position.column) return a.position.column - b.position.column;
  return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
}

function checkFile(
  root: string,
  found: FoundFile,
  schemas: SchemaSet,
): { code: number; messages: Message[] } {
  try {
    const loaded = loadYamlFile(join(root, found.file), found.file);
    const messages = schemas.validate(found.kind, loaded.data).map((error) => ({
      file: found.file,
      position: loaded.positionOf(error.instancePath),
      text: `${error.instancePath || '/'} ${error.keyword}: ${error.message}`,
    }));
    return { code: messages.length > 0 ? 1 : 0, messages };
  } catch (error) {
    if (!(error instanceof YamlError)) throw error;
    const code = error.reason === 'syntax' ? 1 : 2;
    return { code, messages: [{ file: error.file, position: error.position, text: error.detail }] };
  }
}

export function runCheckSchemas(
  root: string,
  schemas: SchemaSet = loadSchemas(),
): SchemaCheckResult {
  const files = findFiles(root);
  let code = 0;
  const messages: Message[] = [];
  for (const found of files) {
    const result = checkFile(root, found, schemas);
    code = Math.max(code, result.code);
    messages.push(...result.messages);
  }
  return {
    code,
    checked: files.length,
    messages: messages
      .sort(compareMessages)
      .map((m) => `${m.file}:${m.position.line}:${m.position.column}: ${m.text}`),
  };
}

if (require.main === module) {
  const result = runCheckSchemas(process.cwd());
  for (const message of result.messages) process.stderr.write(`${message}\n`);
  process.stdout.write(`checked ${result.checked} files\n`);
  process.exitCode = result.code;
}
