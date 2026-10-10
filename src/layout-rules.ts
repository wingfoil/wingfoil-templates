// The layout of spec-001 §6.1 (task-012): `packs/<catalog pack id>/` holding pack.yaml, README.md,
// CHANGELOG.md and the inventory folders, nothing else; ASCII path segments; no symbolic link and
// no submodule (§13). Entries are read with lstat, so a link is reported, never followed.
import { lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { isCatalogPackId } from './digest';
import { INVENTORY_FOLDERS } from './pack-rules';
import type { Problem } from './problems';

const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const PACK_FILES = ['pack.yaml', 'README.md', 'CHANGELOG.md'];
const REQUIRED_FILES = PACK_FILES;

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

interface Seen {
  name: string;
  rel: string;
  kind: 'file' | 'directory' | 'link' | 'other';
}

function entries(tree: string, rel: string): Seen[] {
  return readdirSync(join(tree, rel)).sort(byBytes).map((name) => {
    const stat = lstatSync(join(tree, rel, name));
    const kind = stat.isSymbolicLink() ? 'link' : stat.isDirectory() ? 'directory'
      : stat.isFile() ? 'file' : 'other';
    return { name, rel: `${rel}/${name}`, kind };
  });
}

/** Problems of one entry whatever its place: a link, a submodule, a segment out of the grammar. */
function entryProblems(entry: Seen): Problem[] {
  if (entry.kind === 'link') {
    return [{ file: entry.rel, rule: 'symlink',
      message: `${entry.rel} is a symbolic link; packs hold none (spec-001 §6.1, §13)` }];
  }
  if (entry.name === '.git') {
    return [{ file: entry.rel, rule: 'submodule',
      message: `${entry.rel}: a git submodule or repository inside packs/ (spec-001 §6.1, §13)` }];
  }
  if (entry.kind === 'other') {
    return [{ file: entry.rel, rule: 'layout', message: `${entry.rel} is not a regular file` }];
  }
  if (!SEGMENT.test(entry.name)) {
    return [{ file: entry.rel, rule: 'layout', message: `${entry.rel}: the segment `
      + `${JSON.stringify(entry.name)} breaks ^[A-Za-z0-9][A-Za-z0-9._-]*$ (spec-001 §6.1)` }];
  }
  return [];
}

/** Every entry under a directory, recursively, links and submodules reported and not entered. */
function walk(tree: string, rel: string, problems: Problem[]): void {
  for (const entry of entries(tree, rel)) {
    const found = entryProblems(entry);
    problems.push(...found);
    if (found.length === 0 && entry.kind === 'directory') walk(tree, entry.rel, problems);
  }
}

/** One pack directory: its required files, nothing outside §6.1, and every entry below it. */
export function packLayoutProblems(tree: string, pack: { id: string; path: string }): Problem[] {
  const problems: Problem[] = [];
  const top = entries(tree, pack.path);
  for (const required of REQUIRED_FILES) {
    if (!top.some((entry) => entry.name === required && entry.kind === 'file')) {
      problems.push({ file: `${pack.path}/${required}`, rule: 'layout',
        message: `${pack.id}: ${required} is missing (spec-001 §6.1)` });
    }
  }
  for (const entry of top) {
    const found = entryProblems(entry);
    problems.push(...found);
    if (found.length > 0) continue;
    const allowed = entry.kind === 'file' ? PACK_FILES.includes(entry.name)
      : INVENTORY_FOLDERS.includes(entry.name);
    if (!allowed) {
      problems.push({ file: entry.rel, rule: 'layout',
        message: `${pack.id}: ${entry.name} is not part of a pack's layout (spec-001 §6.1)` });
    } else if (entry.kind === 'directory') {
      walk(tree, entry.rel, problems);
    }
  }
  return problems;
}

export interface TreeLayout {
  /** The catalog pack ids of the directories holding a pack.yaml, in byte order. */
  packs: string[];
  problems: Problem[];
}

/**
 * The directories under packs/ that hold a pack.yaml are packs; every other file under packs/
 * lies outside a pack directory. A pack directory must name a catalog pack id.
 */
export function treeLayout(tree: string): TreeLayout {
  const packs: string[] = [];
  const problems: Problem[] = [];
  const visit = (rel: string): void => {
    const here = entries(tree, rel);
    if (here.some((entry) => entry.name === 'pack.yaml' && entry.kind === 'file')) {
      const id = rel.slice('packs/'.length);
      if (rel !== 'packs' && isCatalogPackId(id)) {
        packs.push(id);
        return;
      }
      problems.push({ file: `${rel}/pack.yaml`, rule: 'layout', message: `${rel}/pack.yaml: `
        + `${rel === 'packs' ? 'packs/ itself' : id} is not a catalog pack id (spec-001 §4, §6.1)` });
    }
    for (const entry of here) {
      if (entry.name === 'pack.yaml') continue;
      const found = entryProblems(entry);
      problems.push(...found);
      if (found.length > 0) continue;
      if (entry.kind === 'directory') {
        visit(entry.rel);
      } else {
        problems.push({ file: entry.rel, rule: 'layout',
          message: `${entry.rel} lies outside every pack directory (spec-001 §6.1)` });
      }
    }
  };
  try {
    if (lstatSync(join(tree, 'packs')).isDirectory()) visit('packs');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
  }
  return { packs: packs.sort(byBytes), problems };
}
