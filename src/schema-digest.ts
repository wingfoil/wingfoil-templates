// The digest of schema/ (task-015, wingfoil-cli rule 8): spec-001 §13 steps 3–6 applied to the
// files under schema/ in the working tree, paths relative to it: in a git repository the files git
// tracks, so that an editor's swap file never changes it; elsewhere every regular file. A schema
// feedback note records it, and the `schema-note` lint rule compares it with the tree's.
import { existsSync, lstatSync, readFileSync, readdirSync, realpathSync } from 'node:fs';
import { join } from 'node:path';

import { digestOfListing, listingOf } from './digest';
import type { DigestResult, ListedFile } from './digest';
import { GitError, runGit } from './git';

function filesUnder(root: string, rel: string): ListedFile[] {
  return readdirSync(join(root, rel)).flatMap((name) => {
    const path = rel === '' ? name : `${rel}/${name}`;
    const stat = lstatSync(join(root, path));
    if (stat.isDirectory()) return filesUnder(root, path);
    return stat.isFile() ? [{ path, bytes: readFileSync(join(root, path)) }] : [];
  });
}

/** The files git tracks under schema/, read from the working tree; undefined outside a repo. */
function trackedFiles(tree: string): ListedFile[] | undefined {
  try {
    const top = runGit(tree, ['rev-parse', '--show-toplevel']).toString('utf8').trim();
    if (realpathSync(top) !== realpathSync(tree)) return undefined;
    return runGit(tree, ['ls-files', '-z', '--', 'schema']).toString('utf8').split('\0')
      .filter((path) => path !== '' && existsSync(join(tree, path)))
      .map((path) => ({ path: path.slice('schema/'.length), bytes: readFileSync(join(tree, path)) }));
  } catch (error) {
    if (error instanceof GitError) return undefined;
    throw error;
  }
}

/** The listing and digest of `schema/`, or undefined when the tree has none. */
export function schemaListing(tree: string): DigestResult | undefined {
  const root = join(tree, 'schema');
  if (!existsSync(root) || !lstatSync(root).isDirectory()) return undefined;
  const listing = listingOf(trackedFiles(tree) ?? filesUnder(root, ''));
  return { listing, digest: digestOfListing(listing) };
}
