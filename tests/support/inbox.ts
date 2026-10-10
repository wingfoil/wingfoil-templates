import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { readFrontmatter } from '../../src/frontmatter';

/** The six fields of WingFoil dl-163 R4, and their allowed values. */
const FIELDS = ['id', 'title', 'kind', 'status', 'wingfoil_version', 'answered_by'];
const KINDS = ['defect', 'gap', 'request'];
const STATUSES = ['open', 'needs-info', 'captured', 'resolved', 'declined', 'duplicate'];

export interface Note {
  file: string;
  fields: Record<string, unknown>;
  body: string;
}

export function notesOf(inbox: string): Note[] {
  return readdirSync(inbox).filter((name) => /^F-\d{3}-.+\.md$/.test(name)).sort()
    .map((file) => {
      const text = readFileSync(join(inbox, file), 'utf8');
      const fields = readFrontmatter(text, file)?.data as Record<string, unknown> | undefined;
      assert.ok(fields !== undefined, `${file} has no frontmatter`);
      return { file, fields, body: text.slice(text.indexOf('\n---\n', 4) + 5) };
    });
}

/** Rows of the first Markdown table after a heading (header and rule skipped), as cells. */
export function tableAfter(text: string, heading: string): string[][] {
  const start = text.indexOf(heading);
  assert.ok(start >= 0, `no ${heading}`);
  const lines = text.slice(start).split('\n');
  const first = lines.findIndex((line) => line.startsWith('|'));
  const end = lines.findIndex((line, index) => index > first && !line.startsWith('|'));
  return lines.slice(first + 2, end < 0 ? undefined : end)
    // Cells are split on unescaped pipes: a title may hold `\|`.
    .map((line) => line.slice(1, -1).split(/(?<!\\)\|/).map((cell) => cell.trim()));
}

export function assertNumbering(all: Note[]): void {
  assert.ok(all.length > 0);
  all.forEach((note, index) => {
    const id = `F-${String(index + 1).padStart(3, '0')}`;
    assert.equal(note.fields['id'], id, note.file);
    assert.ok(note.file.startsWith(`${id}-`), note.file);
  });
}

export function assertFields(all: Note[]): void {
  for (const note of all) {
    assert.deepEqual(Object.keys(note.fields), FIELDS, note.file);
    assert.ok(typeof note.fields['title'] === 'string' && note.fields['title'] !== '', note.file);
    assert.ok(KINDS.includes(String(note.fields['kind'])), note.file);
    assert.ok(STATUSES.includes(String(note.fields['status'])), note.file);
    assert.match(String(note.fields['wingfoil_version']), /^\d+\.\d+\.\d+/, note.file);
    const answered = note.fields['answered_by'];
    const strings = Array.isArray(answered) && answered.every((id) => typeof id === 'string');
    assert.ok(strings, note.file);
  }
}

/** Migrated notes say what they were; new ones name the task or pack-release (task-015). */
export function assertOpenings(all: Note[]): void {
  for (const note of all) {
    assert.match(note.body, /^\n(?:Formerly T\d+\.|New note \((?:task|prel)-\d+\)\.)/, note.file);
  }
}

export function assertSections(all: Note[]): void {
  for (const note of all) {
    assert.match(note.body, /\n## Observed\n[\s\S]+\n## Expected\n/, note.file);
    assert.doesNotMatch(note.body, /\n## Replies\n/, note.file);
  }
}

export function assertLedger(inbox: string, all: Note[]): void {
  const readme = readFileSync(join(inbox, 'README.md'), 'utf8');
  assert.match(readme, /\*\*Source key:\*\*/);
  assert.match(readme, /\*\*Last sync:\*\*/);
  const rows = tableAfter(readme, '## Ledger');
  assert.deepEqual(rows.map((row) => row.length), all.map(() => 5));
  all.forEach((note, index) => {
    const [link, title, kind, status, answered] = rows[index] ?? [];
    assert.equal(link, `[${String(note.fields['id'])}](${note.file})`);
    assert.equal(title, String(note.fields['title']).replace(/\|/g, '\\|'));
    assert.equal(kind, note.fields['kind']);
    assert.equal(status, note.fields['status']);
    assert.equal(answered, (note.fields['answered_by'] as string[]).join(', '));
  });
}

/** Every check of the inbox test, on any inbox (a scratch tree's, for task-015's tests). */
export function assertInbox(inbox: string): void {
  const all = notesOf(inbox);
  assertNumbering(all);
  assertFields(all);
  assertOpenings(all);
  assertSections(all);
  assertLedger(inbox, all);
}
