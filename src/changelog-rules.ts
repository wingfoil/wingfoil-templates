// The changelog rule of spec-001 §18 (task-107, dl-028 D1): a pack's CHANGELOG.md opens with an
// entry for its version, whose first line `publish:pack` reads alone into the tag annotation
// (`changelogEntry`). The lint's only: the composer never reads a CHANGELOG. A missing file, a
// link or a directory is the layout rule's problem, not this one's.
import { lstatSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Problem } from './problems';

/** What the rule needs of a pack: its id, its path under the tree and its manifest's version. */
export interface ChangelogPack {
  id: string;
  /** `packs/<id>`. */
  path: string;
  manifest: { version?: unknown };
}

/** The first line's limit, in code points, the `- ` included (as check:texts counts, dl-046). */
const MAX_FIRST_LINE = 100;
const ENTRY = /^- (\S+?)(?::| |$)/;

function isFile(path: string): boolean {
  try {
    return lstatSync(path).isFile();
  } catch {
    return false;
  }
}

export function changelogProblems(tree: string, pack: ChangelogPack): Problem[] {
  const file = `${pack.path}/CHANGELOG.md`;
  const absolute = join(tree, file);
  if (!isFile(absolute)) return [];
  const version = String(pack.manifest.version);
  const lines = readFileSync(absolute, 'utf8').split(/\r?\n/);
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  const problem = (index: number, message: string): Problem =>
    ({ file, line: index + 1, rule: 'changelog', message: `${pack.id}: ${message} (dl-028 D1)` });

  let first = -1;
  for (const [index, line] of lines.entries()) {
    if (line.startsWith('- ')) {
      first = index;
      break;
    }
    if (line.trim() !== '' && !line.startsWith('#')) {
      return [problem(index, 'CHANGELOG.md has text before its first entry; only blank lines and '
        + 'headings may precede it')];
    }
  }
  if (first < 0) {
    return [problem(0, `CHANGELOG.md has no entry: its first entry is a line starting `
      + `"- ${version}"`)];
  }

  const problems: Problem[] = [];
  const head = lines[first] ?? '';
  const named = ENTRY.exec(head)?.[1] ?? '';
  if (named !== version) {
    problems.push(problem(first, `CHANGELOG.md's first entry names ${named}, pack.yaml's version `
      + `is ${version}`));
  }
  const trimmed = head.trimEnd();
  if (!trimmed.endsWith('.') || [...trimmed].length > MAX_FIRST_LINE) {
    problems.push(problem(first, 'CHANGELOG.md\'s first line becomes the tag annotation: a whole '
      + `sentence ending with ".", at most ${String(MAX_FIRST_LINE)} characters`));
  }
  for (let index = first + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    if (line.startsWith('- ')) break;
    if (line.trim() !== '' && !line.startsWith('  ')) {
      problems.push(problem(index, 'CHANGELOG.md\'s first entry has a line not indented by two '
        + 'spaces'));
      break;
    }
  }
  return problems;
}
