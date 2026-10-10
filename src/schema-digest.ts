// The digest of schema/ (task-015, wingfoil-cli rule 8): spec-001 §13 steps 3–6 applied to the
// regular files under schema/ in the working tree, paths relative to it. A schema feedback note
// records it, and the `schema-note` lint rule compares it with the tree's.
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { digestOfListing, listingOf } from './digest';
import type { DigestResult, ListedFile } from './digest';

function filesUnder(root: string, rel: string): ListedFile[] {
  return readdirSync(join(root, rel)).flatMap((name) => {
    const path = rel === '' ? name : `${rel}/${name}`;
    const stat = lstatSync(join(root, path));
    if (stat.isDirectory()) return filesUnder(root, path);
    return stat.isFile() ? [{ path, bytes: readFileSync(join(root, path)) }] : [];
  });
}

/** The listing and digest of `schema/`, or undefined when the tree has none. */
export function schemaListing(tree: string): DigestResult | undefined {
  const root = join(tree, 'schema');
  if (!existsSync(root) || !lstatSync(root).isDirectory()) return undefined;
  const listing = listingOf(filesUnder(root, ''));
  return { listing, digest: digestOfListing(listing) };
}
