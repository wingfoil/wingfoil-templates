// `npm run check:schemas`: every file of a known kind in the repository against its schema
// (spec-001 §17 step 2, F3.1). Files are found in sorted order and messages are sorted, so the
// output never depends on the filesystem.
import { readdirSync } from 'node:fs';
import type { Dirent } from 'node:fs';
import { join } from 'node:path';

import { repositorySchemas } from './schemas';
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

interface Entry {
  name: string;
  isDirectory: boolean;
}

/** Directories that exist but cannot be listed, relative to the root, each with its reason. */
export type Unreadable = { dir: string; reason: string }[];

/**
 * A directory's entries, sorted by name. A directory that does not exist has none; one that exists
 * but cannot be listed is recorded in `unreadable`, so that it is never skipped silently.
 */
function sortedEntries(root: string, dir: string, unreadable: Unreadable): Entry[] {
  let entries: Dirent[];
  try {
    entries = readdirSync(join(root, dir), { withFileTypes: true });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT' && code !== 'ENOTDIR') {
      unreadable.push({ dir: dir === '' ? '.' : dir, reason: code ?? String(error) });
    }
    return [];
  }
  return entries
    .map((entry) => ({ name: entry.name, isDirectory: entry.isDirectory() }))
    .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

// Every pack.yaml under packs/, not descending into a pack: packs never nest (spec-001 §4, §6.1).
function packManifests(root: string, dir: string, unreadable: Unreadable): string[] {
  const entries = sortedEntries(root, dir, unreadable);
  if (entries.some((entry) => !entry.isDirectory && entry.name === 'pack.yaml')) {
    return [`${dir}/pack.yaml`];
  }
  return entries
    .filter((entry) => entry.isDirectory)
    .flatMap((entry) => packManifests(root, `${dir}/${entry.name}`, unreadable));
}

function yamlFilesIn(root: string, dir: string, unreadable: Unreadable): string[] {
  return sortedEntries(root, dir, unreadable)
    .filter((entry) => !entry.isDirectory && entry.name.endsWith('.yaml'))
    .map((entry) => `${dir}/${entry.name}`);
}

export function findFiles(root: string, unreadable: Unreadable = []): FoundFile[] {
  const rootNames = new Set(sortedEntries(root, '', unreadable).map((entry) => entry.name));
  const found: FoundFile[] = [];
  for (const kind of ['catalog', 'compat'] as const) {
    if (rootNames.has(`${kind}.yaml`)) found.push({ file: `${kind}.yaml`, kind });
  }
  for (const file of packManifests(root, 'packs', unreadable)) found.push({ file, kind: 'pack' });
  for (const file of yamlFilesIn(root, 'presets', unreadable)) found.push({ file, kind: 'preset' });
  for (const file of yamlFilesIn(root, 'transitions', unreadable)) {
    found.push({ file, kind: 'transition' });
  }
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
  schemas: SchemaSet = repositorySchemas(),
): SchemaCheckResult {
  const unreadable: Unreadable = [];
  const files = findFiles(root, unreadable);
  let code = unreadable.length > 0 ? 2 : 0;
  const messages: Message[] = unreadable.map(({ dir, reason }) => ({
    file: dir,
    position: { line: 1, column: 1 },
    text: `cannot list directory: ${reason}`,
  }));
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
  try {
    const result = runCheckSchemas(process.cwd());
    for (const message of result.messages) process.stderr.write(`${message}\n`);
    process.stdout.write(`checked ${result.checked} files\n`);
    process.exitCode = result.code;
  } catch (error) {
    // The schemas themselves cannot be read or compiled: not a verdict on any file.
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`check:schemas: ${message}\n`);
    process.exitCode = 2;
  }
}
