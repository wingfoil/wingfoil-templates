// The WingFoil feedback inbox (WingFoil dl-163, task-010) as the tooling writes it (task-015): one
// file per note, `F-<nnn>-<slug>.md`, and a row in the README's ledger. The tooling only adds notes;
// it never edits one, and writes `open` (wingfoil-cli rules 2 and 6).
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const INBOX = join('docs', 'wingfoil-feedback');
const NOTE_FILE = /^F-(\d{3,})-.+\.md$/;
const DIGEST_LINE = /^Schema digest: (sha256:[0-9a-f]{64})$/m;
/** The listing a schema note records: a ```text fence after the digest line, blank lines between. */
const LISTING_BLOCK = /^Schema digest: sha256:[0-9a-f]{64}\n+```text\n([\s\S]*?)```$/m;

/** The inbox is missing or malformed: an I/O error for the commands (exit 2). */
export class InboxError extends Error {}

export interface NoteFile {
  number: number;
  file: string;
  text: string;
}

export interface SchemaRecord {
  number: number;
  digest: string;
  listing: string;
}

export interface NewNote {
  title: string;
  slug: string;
  /** The element the note comes from: `task-<nnn>` or `prel-<nnn>`. */
  from: string;
  wingfoilVersion: string;
  observed: string;
  expected: string;
}

export function hasInbox(tree: string): boolean {
  return existsSync(join(tree, INBOX, 'README.md'));
}

export function readNotes(tree: string): NoteFile[] {
  const dir = join(tree, INBOX);
  if (!existsSync(dir)) throw new InboxError(`${INBOX} does not exist`);
  return readdirSync(dir).sort().flatMap((file) => {
    const match = NOTE_FILE.exec(file);
    return match?.[1] === undefined ? []
      : [{ number: Number(match[1]), file, text: readFileSync(join(dir, file), 'utf8') }];
  });
}

/** The newest note with a `Schema digest:` line, with the listing recorded under it. */
export function newestSchemaRecord(notes: NoteFile[]): SchemaRecord | undefined {
  for (const note of [...notes].sort((a, b) => b.number - a.number)) {
    const digest = DIGEST_LINE.exec(note.text)?.[1];
    if (digest !== undefined) {
      return { number: note.number, digest, listing: LISTING_BLOCK.exec(note.text)?.[1] ?? '' };
    }
  }
  return undefined;
}

function pad(number: number): string {
  return String(number).padStart(3, '0');
}

/** A ledger cell: a `|` escaped, as the inbox test reads it. */
function cell(text: string): string {
  return text.replace(/\|/g, '\\|');
}

/** Writes the next note and its ledger row; returns its id. */
export function writeNote(tree: string, note: NewNote): string {
  const notes = readNotes(tree);
  const number = Math.max(0, ...notes.map((existing) => existing.number)) + 1;
  const id = `F-${pad(number)}`;
  const file = `${id}-${note.slug}.md`;
  const readmePath = join(tree, INBOX, 'README.md');
  if (!existsSync(readmePath)) throw new InboxError(`${INBOX}/README.md does not exist`);
  const readme = readFileSync(readmePath, 'utf8');
  const lines = readme.split('\n');
  let last = -1;
  lines.forEach((line, index) => {
    if (line.startsWith('| [F-')) last = index;
  });
  if (last < 0) throw new InboxError(`${INBOX}/README.md has no ledger row`);
  const text = [
    '---', `id: ${id}`, `title: ${JSON.stringify(note.title)}`, 'kind: request', 'status: open',
    `wingfoil_version: ${note.wingfoilVersion}`, 'answered_by: []', '---', '',
    `New note (${note.from}).`, '', '## Observed', '', note.observed.trimEnd(), '', '## Expected', '',
    note.expected.trimEnd(), '',
  ].join('\n');
  writeFileSync(join(tree, INBOX, file), text);
  lines.splice(last + 1, 0, `| [${id}](${file}) | ${cell(note.title)} | request | open | |`);
  writeFileSync(readmePath, lines.join('\n'));
  return id;
}
