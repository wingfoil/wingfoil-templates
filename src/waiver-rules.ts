// spec-001 §18, dl-025 D1: the waiver heuristic (task-086). A directive of an overlay or a
// `stage/*` pack using waiver wording is listed for review, never refused; a bridge is exempt.
// Whether a hit is about something the pack does not ship is the reviewer's to judge.
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { LintContext } from './check-packs';
import { bodyStart } from './frontmatter';
import type { LintPack } from './pack-files';
import { conditionalEntries } from './pack-rules';
import type { ConditionalEntry } from './pack-rules';
import { sortProblems } from './problems';
import type { Problem } from './problems';
import { parseEntry } from './requirements';

/** §18's words and their inflections, whole words; `not required` on one line. */
const WORDS = ['skip', 'skips', 'skipped', 'skipping', 'optional', 'optionally', 'ignore',
  'ignores', 'ignored', 'ignoring', 'not[ \\t]+required'];
const WAIVER = new RegExp(`\\b(?:${WORDS.join('|')})\\b`, 'gi');

function idOf(entry: string, field: 'requires' | 'conflicts'): string | undefined {
  try {
    return parseEntry(entry, field).id;
  } catch {
    return undefined;
  }
}

/** An entry whose `with` pack declares a tension naming this pack is a bridge (§18). */
function isBridge(context: LintContext, pack: LintPack, entry: ConditionalEntry): boolean {
  const id = idOf(entry.with, 'requires');
  const other = id === undefined ? undefined : context.packs.get(id);
  return (other?.manifest.tensions ?? [])
    .some((tension) => idOf(tension.pack, 'conflicts') === pack.id);
}

/** One hit per body line holding a waiver word, at its first word. */
function hitsIn(pack: LintPack, path: string, raw: string): Problem[] {
  const lines = raw.replace(/^\uFEFF/, '').split(/\r\n?|\n/);
  const hits: Problem[] = [];
  for (let index = bodyStart(raw); index < lines.length; index += 1) {
    const matches = [...(lines[index] ?? '').matchAll(WAIVER)];
    const [first] = matches;
    if (first === undefined) continue;
    const words = [...new Set(matches.map((match) =>
      match[0].toLowerCase().replace(/[ \t]+/, ' ')))];
    hits.push({ file: `${pack.path}/${path}`, line: index + 1, column: first.index + 1,
      rule: 'waiver', message: `${pack.id}: ${path} uses waiver wording `
        + `(${words.map((word) => `"${word}"`).join(', ')}): review whether it waives a rule of a `
        + 'pack it does not ship (spec-001 §18, dl-025 D1)' });
  }
  return hits;
}

/** The hits of the heuristic, rule `waiver`, one per line of a directive's body. */
export function waiverReviews(context: LintContext): Problem[] {
  const overlays = new Set((context.catalog?.axes ?? [])
    .filter((axis) => axis.overlay).map((axis) => axis.name));
  const reviews: Problem[] = [];
  for (const pack of context.packs.values()) {
    const axis = pack.manifest.axis;
    if (!(axis !== undefined && overlays.has(axis)) && !pack.id.startsWith('stage/')) continue;
    // A directive only in bridge entries is exempt; one in any other part is read.
    const names = new Set(pack.manifest.contents.directives ?? []);
    for (const entry of conditionalEntries(pack.manifest)) {
      if (isBridge(context, pack, entry)) continue;
      for (const name of entry.contents.directives ?? []) names.add(name);
    }
    for (const name of names) {
      const path = `directives/${name}.md`;
      const file = join(context.tree, pack.path, path);
      // A missing listed file is the inventory rule's problem.
      if (!existsSync(file) || !lstatSync(file).isFile()) continue;
      reviews.push(...hitsIn(pack, path, readFileSync(file, 'utf8')));
    }
  }
  return sortProblems(reviews);
}
