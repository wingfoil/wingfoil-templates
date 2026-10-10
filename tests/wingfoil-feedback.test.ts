import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import {
  assertFields, assertLedger, assertNumbering, assertOpenings, assertSections, notesOf, tableAfter,
} from './support/inbox';
import { REPO_ROOT } from './support/paths';

/** The feedback inbox (WingFoil dl-163 R1, R4) and the wingfoil-cli directive that governs it. */
const INBOX = join(REPO_ROOT, 'docs', 'wingfoil-feedback');
const DIRECTIVE = join(REPO_ROOT, '.wingfoil', 'directives', 'custom', 'wingfoil-cli.md');

describe('the WingFoil feedback inbox (dl-163)', () => {
  const all = notesOf(INBOX);

  it('has notes numbered from F-001 without gaps, each named after its id', () => {
    assertNumbering(all);
  });

  it('gives every note exactly the six fields of dl-163 R4, with allowed values', () => {
    assertFields(all);
  });

  it('opens with the note it was migrated from, or names the element it is new from', () => {
    assertOpenings(all);
  });

  it('states what was observed and what was expected', () => {
    assertSections(all);
  });

  it('lists every note in the README ledger as the note says', () => {
    assertLedger(INBOX, all);
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
