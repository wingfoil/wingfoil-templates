// `npm run feedback:note` (task-015, F5.4, wingfoil-cli rule 8): the feedback note a change of
// schema/ produces, so that WingFoil's release planning sees it. WingFoil installs packs from
// this repository, not from its npm package, so a publication writes no note (dl-021 R1,
// task-029).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { InboxError, newestSchemaRecord, readNotes, writeNote } from './feedback-inbox';
import { schemaListing } from './schema-digest';

export class FeedbackNoteError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

/** An element id, `task-<nnn>` or `prel-<nnn>`, alone or with its slug. */
const FROM = /^((?:task|prel)-\d{3})(?:-[a-z0-9.-]+)?$/;

/** The element a note comes from, as the note's first line names it: `task-<nnn>` or `prel-<nnn>`. */
export function fromElement(value: string | undefined): string {
  const id = value === undefined ? undefined : FROM.exec(value)?.[1];
  if (id === undefined) {
    throw new FeedbackNoteError(3, '--from <task-<nnn> | prel-<nnn>> is required');
  }
  return id;
}

/** The governance pin of package.json, the WingFoil build this repository runs. */
function governancePin(tree: string): string {
  const manifest = JSON.parse(readFileSync(join(tree, 'package.json'), 'utf8')) as {
    devDependencies?: Record<string, string>;
  };
  return manifest.devDependencies?.['wingfoil'] ?? '0.0.0';
}

function changedFiles(previous: string, current: string): string[] {
  const parse = (listing: string): Map<string, string> => new Map(listing.split('\n')
    .filter((line) => line !== '').map((line) => [line.slice(66), line.slice(0, 64)]));
  const before = parse(previous);
  const after = parse(current);
  const changes: string[] = [];
  for (const [path, sha] of after) {
    if (!before.has(path)) changes.push(`- added: \`schema/${path}\``);
    else if (before.get(path) !== sha) changes.push(`- changed: \`schema/${path}\``);
  }
  for (const path of before.keys()) {
    if (!after.has(path)) changes.push(`- removed: \`schema/${path}\``);
  }
  return changes;
}

/** The note of a schema change; its id, or undefined when schema/ is as recorded. */
export function writeSchemaNote(tree: string, from: string): string | undefined {
  const current = schemaListing(tree);
  if (current === undefined) throw new FeedbackNoteError(1, 'the tree has no schema/');
  const recorded = newestSchemaRecord(readNotes(tree));
  if (recorded?.digest === current.digest) return undefined;
  const short = current.digest.slice('sha256:'.length, 'sha256:'.length + 12);
  const since = recorded === undefined ? ['- every file: no schema note records a digest yet.']
    : [`Changed since F-${String(recorded.number).padStart(3, '0')}:`, '',
      ...changedFiles(recorded.listing, current.listing)];
  return writeNote(tree, {
    title: `The pack schemas changed (sha256:${short})`,
    slug: `schema-${short}`,
    from,
    wingfoilVersion: governancePin(tree),
    observed: [
      'The pack schemas under `schema/`, the contract with the WingFoil CLI (spec-001), changed.',
      '', `Schema digest: ${current.digest}`, '', '```text', current.listing.trimEnd(), '```', '',
      ...since,
    ].join('\n'),
    expected: 'WingFoil reads the new contract at its release planning (`wingfoil-cli` rule 8): '
      + '`schema/` is the machine-readable half of the pack format.',
  });
}

export interface FeedbackNoteResult {
  code: number;
  lines: string[];
}

export function runFeedbackNote(argv: string[]): FeedbackNoteResult {
  try {
    let values;
    try {
      values = parseArgs({ args: argv, options: {
        schema: { type: 'boolean' }, from: { type: 'string' }, tree: { type: 'string' } },
      strict: true, allowPositionals: false }).values;
    } catch (error) {
      throw new FeedbackNoteError(3, error instanceof Error ? error.message : String(error));
    }
    if (values.schema !== true) throw new FeedbackNoteError(3, '--schema is required');
    const from = fromElement(values.from);
    const tree = values.tree ?? process.cwd();
    const id = writeSchemaNote(tree, from);
    return { code: 0, lines: [id === undefined
      ? 'schema/ is as the newest schema note records: no note written' : `${id} written`] };
  } catch (error) {
    if (error instanceof FeedbackNoteError) return { code: error.code, lines: [error.message] };
    if (error instanceof InboxError) return { code: 2, lines: [error.message] };
    if ((error as NodeJS.ErrnoException).code !== undefined) {
      return { code: 2, lines: [error instanceof Error ? error.message : String(error)] };
    }
    throw error;
  }
}
