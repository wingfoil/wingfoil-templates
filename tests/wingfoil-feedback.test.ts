import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { readFrontmatter } from '../src/frontmatter';
import { REPO_ROOT } from './support/paths';

/** The feedback inbox (WingFoil dl-163 R1, R4) and the wingfoil-cli directive that governs it. */
const INBOX = join(REPO_ROOT, 'docs', 'wingfoil-feedback');
const DIRECTIVE = join(REPO_ROOT, '.wingfoil', 'directives', 'custom', 'wingfoil-cli.md');
const FIELDS = ['id', 'title', 'kind', 'status', 'wingfoil_version', 'answered_by'];
const KINDS = ['defect', 'gap', 'request'];
const STATUSES = ['open', 'needs-info', 'captured', 'resolved', 'declined', 'duplicate'];

interface Note {
  file: string;
  fields: Record<string, unknown>;
  body: string;
}

function notes(): Note[] {
  return readdirSync(INBOX).filter((name) => /^F-\d{3}-.+\.md$/.test(name)).sort()
    .map((file) => {
      const text = readFileSync(join(INBOX, file), 'utf8');
      const fields = readFrontmatter(text, file)?.data as Record<string, unknown> | undefined;
      assert.ok(fields !== undefined, `${file} has no frontmatter`);
      return { file, fields, body: text.slice(text.indexOf('\n---\n', 4) + 5) };
    });
}

/** Rows of the first Markdown table after a heading (header and rule skipped), as cells. */
function tableAfter(text: string, heading: string): string[][] {
  const start = text.indexOf(heading);
  assert.ok(start >= 0, `no ${heading}`);
  const lines = text.slice(start).split('\n');
  const first = lines.findIndex((line) => line.startsWith('|'));
  const end = lines.findIndex((line, index) => index > first && !line.startsWith('|'));
  return lines.slice(first + 2, end < 0 ? undefined : end)
    // Cells are split on unescaped pipes: a title may hold `\|`.
    .map((line) => line.slice(1, -1).split(/(?<!\\)\|/).map((cell) => cell.trim()));
}

describe('the WingFoil feedback inbox (dl-163)', () => {
  const all = notes();

  it('has notes numbered from F-001 without gaps, each named after its id', () => {
    assert.ok(all.length > 0);
    all.forEach((note, index) => {
      const id = `F-${String(index + 1).padStart(3, '0')}`;
      assert.equal(note.fields['id'], id, note.file);
      assert.ok(note.file.startsWith(`${id}-`), note.file);
    });
  });

  it('gives every note exactly the six fields of dl-163 R4, with allowed values', () => {
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
  });

  it('states what was observed and what was expected', () => {
    for (const note of all) {
      assert.match(note.body, /\n## Observed\n[\s\S]+\n## Expected\n/, note.file);
      assert.doesNotMatch(note.body, /\n## Replies\n/, note.file);
    }
  });

  it('lists every note in the README ledger as the note says', () => {
    const readme = readFileSync(join(INBOX, 'README.md'), 'utf8');
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
  });

  it('links every known behaviour of wingfoil-cli to existing notes', () => {
    const ids = new Set(all.map((note) => String(note.fields['id'])));
    const rows = tableAfter(readFileSync(DIRECTIVE, 'utf8'), '## Known behaviours');
    assert.ok(rows.length > 0);
    for (const row of rows) {
      const refs = (row[3] ?? '').split(',').map((ref) => ref.trim()).filter((ref) => ref !== '');
      for (const ref of refs) assert.ok(ids.has(ref), `${row[0] ?? ''}: ${ref}`);
    }
  });
});
