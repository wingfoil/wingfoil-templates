// The pack digest of spec-001 §13 (dl-004 4(a)) and the transition digest of §14: a sha256sum-style
// listing of the files at a commit, in byte order of their paths, and the sha256 of that listing.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, posix } from 'node:path';

import { GitError, readBlobs, resolveCommit, runGit } from './git';
import { SCHEMA_DIR } from './schemas';

/** A rule of §13 is broken: the pack cannot have a digest. */
export class DigestError extends Error {}

export interface DigestResult {
  listing: string;
  digest: string;
}

export interface ListedFile {
  path: string;
  bytes: Buffer;
}

const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const REGULAR_MODES = new Set(['100644', '100755']);

function sha256(bytes: Buffer | string): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/** §13 steps 3–5: `<sha256>  <path>\n` per file, in byte order of the path. */
export function listingOf(files: ListedFile[]): string {
  return [...files]
    .sort((a, b) => Buffer.compare(Buffer.from(a.path, 'utf8'), Buffer.from(b.path, 'utf8')))
    .map((file) => `${sha256(file.bytes)}  ${file.path}\n`)
    .join('');
}

/** §13 step 6. */
export function digestOfListing(listing: string): string {
  return `sha256:${sha256(Buffer.from(listing, 'utf8'))}`;
}

let packIdPattern: RegExp | undefined;

/** spec-001 §4, from `$defs.packId` of schema/pack.schema.json: one grammar, the contract's. */
export function isCatalogPackId(id: string): boolean {
  if (packIdPattern === undefined) {
    const schema = JSON.parse(readFileSync(join(SCHEMA_DIR, 'pack.schema.json'), 'utf8')) as {
      $defs: { packId: { pattern: string } };
    };
    packIdPattern = new RegExp(schema.$defs.packId.pattern);
  }
  return packIdPattern.test(id);
}

interface TreeEntry {
  mode: string;
  sha: string;
  path: string;
}

/** `ls-tree -r -z --full-tree`: `<mode> <type> <sha>\t<path>\0` records, paths verbatim. */
function treeEntries(repo: string, commit: string, pathspec: string): TreeEntry[] {
  const output = runGit(repo, ['ls-tree', '-r', '-z', '--full-tree', commit, '--', pathspec]);
  return output
    .toString('utf8')
    .split('\0')
    .filter((record) => record !== '')
    .map((record) => {
      const tab = record.indexOf('\t');
      const [mode = '', , sha = ''] = record.slice(0, tab).split(' ');
      return { mode, sha, path: record.slice(tab + 1) };
    });
}

/** Regular files only (§13 step 1), each path checked segment by segment (§13 step 3). */
function filesAt(
  repo: string,
  entries: TreeEntry[],
  relative: (path: string) => string,
): ListedFile[] {
  for (const entry of entries) {
    if (!REGULAR_MODES.has(entry.mode)) {
      const kind = entry.mode === '120000' ? 'a symbolic link'
        : entry.mode === '160000' ? 'a submodule' : `mode ${entry.mode}`;
      throw new DigestError(
        `${JSON.stringify(entry.path)}: ${kind}, only regular files are allowed`,
      );
    }
    const path = relative(entry.path);
    if (!path.split('/').every((segment) => SEGMENT.test(segment))) {
      throw new DigestError(
        `${JSON.stringify(entry.path)}: path segment does not match ${SEGMENT.source}`,
      );
    }
  }
  const blobs = readBlobs(repo, entries.map((entry) => entry.sha));
  return entries.map((entry, index) => ({
    path: relative(entry.path),
    bytes: blobs[index] ?? Buffer.alloc(0),
  }));
}

function result(files: ListedFile[]): DigestResult {
  const listing = listingOf(files);
  return { listing, digest: digestOfListing(listing) };
}

/** The digest of `packs/<id>/` at a ref (§13). */
export function packDigest(repo: string, ref: string, packId: string): DigestResult {
  if (!isCatalogPackId(packId)) {
    throw new DigestError(`${JSON.stringify(packId)} is not a catalog pack id (spec-001 §4)`);
  }
  const commit = resolveCommit(repo, ref);
  const prefix = `packs/${packId}/`;
  const entries = treeEntries(repo, commit, prefix);
  if (entries.length === 0) throw new DigestError(`no file under ${prefix} at ${ref}`);
  const outside = entries.find((entry) => !entry.path.startsWith(prefix));
  if (outside !== undefined) {
    throw new GitError(`git ls-tree: ${JSON.stringify(outside.path)} is outside ${prefix}`);
  }
  return result(filesAt(repo, entries, (path) => path.slice(prefix.length)));
}

const TRANSITION_FILE = /^transitions\/[a-z][a-z0-9]*(?:-[a-z0-9]+)*\.yaml$/;

/** The digest of one transition file at a ref: §13 on a one-file listing of its base name (§14). */
export function transitionDigest(repo: string, ref: string, file: string): DigestResult {
  if (!TRANSITION_FILE.test(file)) {
    throw new DigestError(`${JSON.stringify(file)} is not a transitions/<id>.yaml file`);
  }
  const commit = resolveCommit(repo, ref);
  const entries = treeEntries(repo, commit, file).filter((entry) => entry.path === file);
  if (entries.length !== 1) throw new DigestError(`no file ${file} at ${ref}`);
  return result(filesAt(repo, entries, (path) => posix.basename(path)));
}
