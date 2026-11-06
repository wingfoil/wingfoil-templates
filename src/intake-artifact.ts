// The prepared diff as an artifact (task-081, plan-065 task C, dl-042 I1): `collectArtifact` copies
// the allowlisted files a prepared tree changed, with each file's sha256 and the base commit;
// `applyArtifact` writes them back into a tree, for `intake.yml`'s verify job and for the intake,
// only after every check: the sha256s, the allowlist, no symbolic link, a clean and unmoved base.
// Every refusal comes before the first write and writes nothing.
import { createHash } from 'node:crypto';
import {
  existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync,
} from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

import { runGit } from './git';
import { byBytes } from './index-data';
import { GOLDEN_COMPAT, STRICT } from './intake-prepare';

export interface Outcome { code: 0 | 1; lines: string[] }

/** task-080's files for a version, in byte order: the only paths an artifact may hold. */
export function allowlist(version: string): string[] {
  const pin = `src/matrix/wingfoil-${version}`;
  return ['CATALOG.md', 'catalog-index.json', 'catalog.yaml', 'compat.yaml',
    `${pin}/package-lock.json`, `${pin}/package.json`, GOLDEN_COMPAT].sort(byBytes);
}

class Refusal extends Error {}

const SUM_LINE = /^([0-9a-f]{64}) {2}(.+)$/;
const COMMIT = /^[0-9a-f]{40}$/;

function sha256(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function git(tree: string, args: string[]): string {
  return runGit(tree, args).toString('utf8');
}

function checkVersion(version: string): void {
  if (!STRICT.test(version)) throw new Refusal(`${JSON.stringify(version)}: not a strict X.Y.Z`);
}

/** The tree's top level (git's), so that every path below is the repository's. */
function topLevel(tree: string): string {
  let top: string;
  try {
    top = git(tree, ['rev-parse', '--show-toplevel']).trim();
  } catch {
    throw new Refusal(`${tree}: not a git repository`);
  }
  if (realpathSync(top) !== realpathSync(tree)) {
    throw new Refusal(`${tree}: not the repository's top level`);
  }
  return top;
}

/** The paths `git status` names: changed, staged, untracked; a quoted or renamed path as is. */
function statusPaths(tree: string): string[] {
  const output = git(tree, ['status', '--porcelain', '--untracked-files=all']);
  return output.split('\n').filter((line) => line !== '').map((line) => line.slice(3));
}

/** The real path of a path that may not exist yet: its nearest existing parent's, resolved. */
function realOrParent(path: string): string {
  let current = resolve(path);
  const rest: string[] = [];
  while (!lstatExists(current) && dirname(current) !== current) {
    rest.unshift(basename(current));
    current = dirname(current);
  }
  return join(realpathSync(current), ...rest);
}

function isInside(path: string, dir: string): boolean {
  const rel = relative(realpathSync(dir), realOrParent(path));
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

function headText(tree: string, path: string): Buffer | undefined {
  try {
    return runGit(tree, ['show', `HEAD:${path}`]);
  } catch {
    return undefined;
  }
}

function collectPlan(tree: string, version: string, out: string): Map<string, Buffer> {
  checkVersion(version);
  topLevel(tree);
  if (isInside(out, tree)) throw new Refusal(`--out ${out} is inside the tree`);
  if (existsSync(out) && (!lstatSync(out).isDirectory() || readdirSync(out).length > 0)) {
    throw new Refusal(`--out ${out} exists and is not an empty directory`);
  }
  const allowed = allowlist(version);
  const outside = statusPaths(tree).filter((path) => !allowed.includes(path));
  if (outside.length > 0) {
    throw new Refusal(`paths outside the allowlist changed: ${outside.sort(byBytes).join(', ')}`);
  }
  const pin = `src/matrix/wingfoil-${version}/`;
  const files = new Map<string, Buffer>();
  for (const path of allowed) {
    const full = join(tree, path);
    if (!existsSync(full) || !lstatSync(full).isFile()) {
      throw new Refusal(`${path} is missing or not a regular file`);
    }
    const bytes = readFileSync(full);
    const head = headText(tree, path);
    if (path.startsWith(pin) || head === undefined || !head.equals(bytes)) files.set(path, bytes);
  }
  return files;
}

/** The changed allowlisted files to `<out>/files/`, `<out>/SHA256SUMS` and `<out>/BASE`. */
export function collectArtifact(tree: string, version: string, out: string): Outcome {
  let files: Map<string, Buffer>;
  let base: string;
  try {
    files = collectPlan(tree, version, out);
    base = git(tree, ['rev-parse', 'HEAD']).trim();
  } catch (error) {
    return { code: 1, lines: [`intake:collect: ${message(error)}, nothing written`] };
  }
  const sums = [...files].map(([path, bytes]) => `${sha256(bytes)}  ${path}`);
  for (const [path, bytes] of files) {
    mkdirSync(dirname(join(out, 'files', path)), { recursive: true });
    writeFileSync(join(out, 'files', path), bytes);
  }
  writeFileSync(join(out, 'SHA256SUMS'), `${sums.join('\n')}\n`);
  writeFileSync(join(out, 'BASE'), `${base}\n`);
  return { code: 0, lines: sums };
}

/** Every file under a directory, relative with `/`, symbolic links refused. */
function listFiles(dir: string): string[] {
  const found: string[] = [];
  const walk = (current: string): void => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const full = join(current, entry.name);
      if (entry.isSymbolicLink()) {
        throw new Refusal(`${relative(dir, full)}: a symbolic link in the artifact`);
      }
      if (entry.isDirectory()) walk(full);
      else found.push(relative(dir, full).split(sep).join('/'));
    }
  };
  walk(dir);
  return found.sort(byBytes);
}

function readText(path: string, label: string): string {
  if (!existsSync(path) || !lstatSync(path).isFile()) throw new Refusal(`${label} is missing`);
  return readFileSync(path, 'utf8');
}

function applyPlan(tree: string, dir: string, version: string): Map<string, Buffer> {
  checkVersion(version);
  topLevel(tree);
  const base = readText(join(dir, 'BASE'), 'BASE').trim();
  if (!COMMIT.test(base)) throw new Refusal('BASE is not a 40-hex commit');
  const allowed = allowlist(version);
  const listed = new Map<string, string>();
  const sumsText = readText(join(dir, 'SHA256SUMS'), 'SHA256SUMS');
  for (const line of sumsText.split('\n').filter((one) => one !== '')) {
    const match = SUM_LINE.exec(line);
    if (match === null) throw new Refusal('SHA256SUMS: a malformed line');
    const [, sum = '', path = ''] = match;
    if (isAbsolute(path) || path.split('/').includes('..')) {
      throw new Refusal('SHA256SUMS: an absolute path or a `..` segment');
    }
    if (!allowed.includes(path)) {
      throw new Refusal(`SHA256SUMS: ${path} is outside ${version}'s allowlist`);
    }
    if (listed.has(path)) throw new Refusal(`SHA256SUMS: ${path} listed twice`);
    listed.set(path, sum);
  }
  const pin = `src/matrix/wingfoil-${version}`;
  for (const path of [`${pin}/package-lock.json`, `${pin}/package.json`]) {
    if (!listed.has(path)) throw new Refusal(`SHA256SUMS does not list ${path}`);
  }
  const filesDir = join(dir, 'files');
  if (!existsSync(filesDir) || !lstatSync(filesDir).isDirectory()) {
    throw new Refusal('files/ is missing');
  }
  const present = listFiles(filesDir);
  const unlisted = present.filter((path) => !listed.has(path));
  if (unlisted.length > 0) {
    throw new Refusal(`files/ holds files SHA256SUMS does not list: ${unlisted.join(', ')}`);
  }
  const files = new Map<string, Buffer>();
  for (const [path, sum] of listed) {
    if (!present.includes(path)) throw new Refusal(`files/${path} is missing`);
    const bytes = readFileSync(join(filesDir, path));
    if (sha256(bytes) !== sum) throw new Refusal(`files/${path}: its sha256 differs`);
    files.set(path, bytes);
  }
  // No symbolic link at a target path, or on its way there.
  for (const path of files.keys()) {
    const parts = path.split('/');
    for (let depth = 1; depth <= parts.length; depth += 1) {
      const target = join(tree, ...parts.slice(0, depth));
      if (lstatExists(target) && lstatSync(target).isSymbolicLink()) {
        throw new Refusal(`${parts.slice(0, depth).join('/')}: a symbolic link in the tree`);
      }
    }
  }
  // With a pathspec a rename shows as its two sides, so a staged `git mv` is seen too.
  const dirty = git(tree, ['status', '--porcelain', '--untracked-files=all', '--', ...allowed])
    .split('\n').filter((line) => line !== '');
  if (dirty.length > 0) {
    throw new Refusal(`allowlisted paths have uncommitted changes: ${
      dirty.map((line) => line.slice(3)).join(', ')}`);
  }
  const head = git(tree, ['rev-parse', 'HEAD']).trim();
  if (base !== head) {
    try {
      git(tree, ['cat-file', '-e', `${base}^{commit}`]);
    } catch {
      throw new Refusal(`BASE ${base} is not a commit of the tree`);
    }
    const moved = git(tree, ['diff', '--name-only', base, head, '--', ...allowed])
      .split('\n').filter((line) => line !== '');
    if (moved.length > 0) {
      throw new Refusal(`allowlisted paths changed since BASE: ${moved.join(', ')}`);
    }
  }
  return files;
}

function lstatExists(path: string): boolean {
  try {
    lstatSync(path);
    return true;
  } catch {
    return false;
  }
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** The artifact's files written into the tree, byte for byte, after every check. */
export function applyArtifact(tree: string, dir: string, version: string): Outcome {
  let files: Map<string, Buffer>;
  try {
    files = applyPlan(tree, dir, version);
  } catch (error) {
    return { code: 1, lines: [`intake:apply: ${message(error)}, nothing written`] };
  }
  const lines: string[] = [];
  for (const [path, bytes] of files) {
    try {
      mkdirSync(dirname(join(tree, path)), { recursive: true });
      writeFileSync(join(tree, path), bytes);
    } catch (error) {
      return { code: 1, lines: [...lines,
        `intake:apply: writing ${path}: ${message(error)}; the files above were written`] };
    }
    lines.push(`applied ${path}`);
  }
  return { code: 0, lines };
}
