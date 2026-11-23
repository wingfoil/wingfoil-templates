// `npm run check:texts -- [--base <ref> | --range <a>..<b>]` (task-102, dl-046): the 100-character
// rule on the lines a diff adds to this repository's Markdown files. It reads one diff (the staged
// one, the lines a branch adds since its merge base, or a range), never whole files, so the long
// lines already in a file stay as they are (dl-046 P3). A line's length is its count of Unicode
// code points without its line ending; the exemptions (dl-046 P1) are read from the whole file as
// the diff's side holds it.
import { GitError, readBlobs, resolveCommit, runGit } from './git';
import { MARKER, scanMarkdown } from './markdown-lines';

export const LIMIT = 100;

export interface TextsResult {
  code: number;
  /** Standard output: one line per breach, then the count; empty when nothing breaches. */
  out: string[];
  /** Standard error: one line on a usage error or a git failure. */
  err: string[];
}

type Mode = { kind: 'staged' } | { kind: 'base'; ref: string } | { kind: 'range'; a: string;
  b: string };

const USAGE = 'usage: npm run check:texts [-- --base <ref> | -- --range <a>..<b>]';
const ZEROS = /^0{40}$|^0{64}$/;

class UsageError extends Error {}

/** The mode the arguments name, or a usage error. */
export function parseArgs(args: string[]): Mode {
  if (args.length === 0) return { kind: 'staged' };
  const [flag, value, ...rest] = args;
  if (rest.length > 0 || value === undefined || value === '' || value.startsWith('-')) {
    throw new UsageError(`check:texts: ${JSON.stringify(args.join(' '))}: ${USAGE}`);
  }
  if (flag === '--base') return { kind: 'base', ref: value };
  if (flag !== '--range') throw new UsageError(`check:texts: unknown argument ${flag}: ${USAGE}`);
  const ends = value.split('..');
  const [a, b] = ends;
  if (value.includes('...') || ends.length !== 2 || a === undefined || a === ''
    || b === undefined || b === '') {
    throw new UsageError(`check:texts: the range ${value} is not <a>..<b>: ${USAGE}`);
  }
  if (ZEROS.test(a)) {
    throw new UsageError(`check:texts: the range starts at ${a}, no commit (a new or force-pushed `
      + 'branch): the approver reads the push');
  }
  return { kind: 'range', a, b };
}

function resolve(repo: string, ref: string): string {
  try {
    return resolveCommit(repo, ref);
  } catch (error) {
    throw new UsageError(`check:texts: ${(error as Error).message}`);
  }
}

/** The arguments of the `git diff` the mode reads. */
function diffArgs(repo: string, mode: Mode): string[] {
  const options = ['diff', '-M', '-U0', '--full-index', '--no-color', '--no-ext-diff',
    '--no-textconv', '--no-relative', '--src-prefix=a/', '--dst-prefix=b/'];
  if (mode.kind === 'staged') return [...options, '--cached'];
  if (mode.kind === 'base') {
    const ref = resolve(repo, mode.ref);
    const head = resolve(repo, 'HEAD');
    const base = runGit(repo, ['merge-base', ref, head]).toString('utf8').trim();
    return [...options, base, head];
  }
  return [...options, resolve(repo, mode.a), resolve(repo, mode.b)];
}

/** A file's added lines in a diff: its path and blob on the new side, the added line numbers. */
export interface AddedLines {
  path: string;
  blob: string;
  lines: number[];
}

const OCTAL = /^[0-7]{3}$/;
const ESCAPES: Record<string, number> = { a: 7, b: 8, t: 9, n: 10, v: 11, f: 12, r: 13, '"': 34,
  '\\': 92 };

/** A path as git prints it: C-quoted, with octal bytes, when it holds a special character. */
export function unquotePath(text: string): string {
  if (!text.startsWith('"') || !text.endsWith('"') || text.length < 2) return text;
  const bytes: number[] = [];
  const body = text.slice(1, -1);
  for (let i = 0; i < body.length; i += 1) {
    const char = body.charAt(i);
    if (char !== '\\') {
      bytes.push(...Buffer.from(char, 'utf8'));
      continue;
    }
    const octal = body.slice(i + 1, i + 4);
    if (OCTAL.test(octal)) {
      bytes.push(parseInt(octal, 8));
      i += 3;
      continue;
    }
    const next = body.charAt(i + 1);
    bytes.push(ESCAPES[next] ?? next.charCodeAt(0));
    i += 1;
  }
  return Buffer.from(bytes).toString('utf8');
}

const INDEX = /^index [0-9a-f]+\.\.([0-9a-f]+)(?: \d+)?$/;
const HUNK = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/;

/**
 * The added lines of a `git diff -U0 --full-index` patch. With no context lines every hunk's new
 * side is added lines only, so their numbers come from the hunk headers. A deleted file and a
 * section with no hunk (a pure rename, a binary file) give nothing.
 */
export function addedLines(patch: string): AddedLines[] {
  const files: AddedLines[] = [];
  let current: AddedLines | undefined;
  let blob: string | undefined;
  let inHunks = false;
  for (const line of patch.split('\n')) {
    if (line.startsWith('diff --git ')) {
      current = undefined;
      blob = undefined;
      inHunks = false;
      continue;
    }
    if (!inHunks) {
      const index = INDEX.exec(line);
      if (index !== null) blob = index[1];
      if (line.startsWith('+++ ')) {
        // git ends the line with a tab when the name holds a space (for patch(1)).
        const path = unquotePath(line.slice(4).replace(/\t$/, ''));
        if (path.startsWith('b/') && blob !== undefined) {
          current = { path: path.slice(2), blob, lines: [] };
          files.push(current);
        }
      }
    }
    const hunk = HUNK.exec(line);
    if (hunk === null) continue;
    inHunks = true;
    const start = Number(hunk[1]);
    const count = hunk[2] === undefined ? 1 : Number(hunk[2]);
    for (let n = start; n < start + count; n += 1) current?.lines.push(n);
  }
  return files.filter((file) => file.lines.length > 0);
}

/** A Markdown file the rule reads (dl-046 P1): out of it the fixtures and the catalog. */
export function inScope(path: string): boolean {
  return path.endsWith('.md') && !path.startsWith('tests/fixtures/') && path !== 'CATALOG.md';
}

/** The file's lines, without their endings; the empty piece after a trailing newline dropped. */
export function splitLines(text: string): string[] {
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.map((line) => line.replace(/\r$/, ''));
}

const TABLE_ROW = /^[ \t]*(?:>[ \t]*)*\|/;
const LINK_REFERENCE = /^ {0,3}\[[^\]]+\]:[ \t]*\S/;

/** The 1-based numbers of the lines dl-046 P1 exempts, read from the whole file. */
export function exemptLines(lines: string[]): Set<number> {
  const exempt = new Set<number>();
  let frontmatter = 0;
  if (lines[0] === '---') {
    const close = lines.indexOf('---', 1);
    if (close > 0) frontmatter = close + 1;
  }
  for (let n = 1; n <= frontmatter; n += 1) exempt.add(n);
  lines.forEach((line, i) => {
    if (TABLE_ROW.test(line) || LINK_REFERENCE.test(line)) exempt.add(i + 1);
  });
  // Fenced code, the frontmatter blanked first. A `code` line counts as fenced only while a fence
  // opened by a `fence` line is open, in the same container: an indented code block is not exempt.
  const blanked = lines.map((line, i) => (i < frontmatter ? '' : line));
  let open: string | undefined;
  for (const line of scanMarkdown(blanked.join('\n')).lines) {
    if (open !== undefined && line.container !== open) open = undefined;
    if (line.kind === 'fence') {
      exempt.add(line.line);
      open = open === undefined ? line.container : undefined;
    } else if (line.kind === 'code' && open !== undefined) {
      exempt.add(line.line);
    } else {
      open = undefined;
    }
  }
  let region: string | undefined;
  lines.forEach((line, i) => {
    const marker = MARKER.exec(line);
    if (region === undefined && marker?.[1] === 'begin') region = marker[2];
    if (region !== undefined) exempt.add(i + 1);
    if (marker?.[1] === 'end' && marker[2] === region) region = undefined;
  });
  return exempt;
}

interface Breach {
  path: string;
  line: number;
  length: number;
}

/** The breaches of one file: its added lines over the limit and not exempt. */
export function fileBreaches(path: string, text: string, added: number[]): Breach[] {
  const lines = splitLines(text);
  const exempt = exemptLines(lines);
  const breaches: Breach[] = [];
  for (const n of added) {
    const line = lines[n - 1];
    if (line === undefined || exempt.has(n)) continue;
    const length = [...line].length;
    if (length > LIMIT) breaches.push({ path, line: n, length });
  }
  return breaches;
}

function compare(a: Breach, b: Breach): number {
  if (a.path !== b.path) return a.path < b.path ? -1 : 1;
  return a.line - b.line;
}

/** Runs the check on the repository at `repo`. */
export function checkTexts(repo: string, args: string[]): TextsResult {
  try {
    const mode = parseArgs(args);
    const patch = runGit(repo, diffArgs(repo, mode)).toString('utf8');
    const files = addedLines(patch).filter((file) => inScope(file.path));
    const blobs = readBlobs(repo, files.map((file) => file.blob));
    const breaches = files.flatMap((file, i) =>
      fileBreaches(file.path, blobs[i]?.toString('utf8') ?? '', file.lines)).sort(compare);
    if (breaches.length === 0) return { code: 0, out: [], err: [] };
    const out = breaches.map((breach) =>
      `${breach.path}:${breach.line}: ${breach.length} characters (at most ${LIMIT}, dl-046)`);
    out.push(`check:texts: ${breaches.length} lines over ${LIMIT} characters`);
    return { code: 1, out, err: [] };
  } catch (error) {
    if (error instanceof UsageError || error instanceof GitError) {
      return { code: 2, out: [], err: [error.message.replace(/\s*\n\s*/g, ' ')] };
    }
    throw error;
  }
}
