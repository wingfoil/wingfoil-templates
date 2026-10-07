// Directory listings in byte order of the names: nothing the tooling produces may depend on the
// order the filesystem returns (determinism directive).
import { readdirSync } from 'node:fs';

export interface Entry {
  name: string;
  isDirectory: boolean;
}

export function sortEntries<T extends Entry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => Buffer.compare(Buffer.from(a.name), Buffer.from(b.name)));
}

/** The entries of a directory, sorted; none when it does not exist. */
export function listSorted(dir: string): Entry[] {
  let names;
  try {
    names = readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === 'ENOENT' || code === 'ENOTDIR') return [];
    throw error;
  }
  return sortEntries(names.map((entry) => ({
    name: entry.name,
    isDirectory: entry.isDirectory(),
  })));
}
