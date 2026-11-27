import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { changelogProblems } from '../src/changelog-rules';
import type { Problem } from '../src/problems';

/** The problems of one pack whose CHANGELOG.md holds `text` (none written when undefined). */
function problemsOf(text: string | undefined, version = '1.2.0'): Problem[] {
  const root = mkdtempSync(join(tmpdir(), 'changelog-rules-'));
  try {
    const path = 'packs/methodology/flow';
    mkdirSync(join(root, path), { recursive: true });
    if (text !== undefined) writeFileSync(join(root, path, 'CHANGELOG.md'), text);
    return changelogProblems(root, { id: 'methodology/flow', path, manifest: { version } });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

/** `<line>: <message>` of each problem, every one checked for its rule and file. */
function shown(problems: Problem[]): string[] {
  for (const problem of problems) {
    assert.equal(problem.rule, 'changelog');
    assert.equal(problem.file, 'packs/methodology/flow/CHANGELOG.md');
  }
  return problems.map((problem) => `${String(problem.line)}: ${problem.message}`);
}

const SENTENCE = '- 1.2.0: a sentence that ends here.\n';

describe('the changelog rule (task-107, dl-028 D1)', () => {
  it('passes a first entry naming the version, its first line a sentence, with or without a '
    + 'heading, its later lines indented or blank', () => {
    assert.deepEqual(problemsOf(SENTENCE), []);
    assert.deepEqual(problemsOf(`# Changelog\n\n${SENTENCE}`), []);
    assert.deepEqual(problemsOf(`${SENTENCE}  More of it, indented.\n\n  And more.\n`
      + '- 1.1.0: an older entry\nnot checked\n'), []);
    assert.deepEqual(problemsOf('- 1.2.0 (minor): a sentence.\r\n'), []);
  });

  it('reports nothing for a missing file, the layout rule\'s problem', () => {
    assert.deepEqual(problemsOf(undefined), []);
  });

  it('reports a first entry that names another version', () => {
    assert.deepEqual(shown(problemsOf('# Changelog\n\n- 1.1.0: an older sentence.\n')), [
      '3: methodology/flow: CHANGELOG.md\'s first entry names 1.1.0, pack.yaml\'s version is '
        + '1.2.0 (dl-028 D1)']);
  });

  it('reports a first line that is not a whole sentence: no final period, or over 100 '
    + 'characters counted in code points', () => {
    const wrapped = shown(problemsOf('- 1.2.0: first version: the channel that turns a\n'
      + '  feedback item into a note.\n'));
    assert.equal(wrapped.length, 1);
    assert.match(wrapped[0] ?? '',
      /^1: methodology\/flow: CHANGELOG\.md's first line .*tag annotation/);
    assert.deepEqual(problemsOf(`- 1.2.0: ${'é'.repeat(90)}.\n`), [],
      '100 code points, the "- " included');
    assert.equal(shown(problemsOf(`- 1.2.0: ${'é'.repeat(91)}.\n`)).length, 1);
  });

  it('reports a bare version as not a sentence, and an entry naming no version', () => {
    assert.deepEqual(shown(problemsOf('- 1.2.0\n')), [
      '1: methodology/flow: CHANGELOG.md\'s first line is 7 characters, ending with "0"; it '
        + 'becomes the tag annotation: a whole sentence ending with ".", at most 100 characters '
        + '(dl-028 D1)']);
    assert.ok(shown(problemsOf('- \n')).some((line) => /names no version, pack\.yaml/.test(line)));
  });

  it('ignores a byte order mark, and leaves a linked CHANGELOG.md to the layout rule', () => {
    assert.deepEqual(problemsOf(`\uFEFF# Changelog\n\n${SENTENCE}`), []);
    const root = mkdtempSync(join(tmpdir(), 'changelog-rules-'));
    try {
      const path = 'packs/methodology/flow';
      mkdirSync(join(root, path), { recursive: true });
      writeFileSync(join(root, 'elsewhere.md'), '# nothing\n');
      symlinkSync(join(root, 'elsewhere.md'), join(root, path, 'CHANGELOG.md'));
      assert.deepEqual(changelogProblems(root, { id: 'methodology/flow', path,
        manifest: { version: '1.2.0' } }), []);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('reports an empty file and a heading only on line 1', () => {
    for (const text of ['', '# Changelog\n']) {
      assert.deepEqual(shown(problemsOf(text)), [
        '1: methodology/flow: CHANGELOG.md has no entry: its first entry is a line starting '
          + '"- 1.2.0" (dl-028 D1)']);
    }
  });

  it('reports text before the first entry, other than blank lines and headings', () => {
    assert.deepEqual(shown(problemsOf(`# Changelog\n\nSome prose.\n${SENTENCE}`)), [
      '3: methodology/flow: CHANGELOG.md has text before its first entry; only blank lines and '
        + 'headings may precede it (dl-028 D1)']);
  });

  it('reports a later line of the first entry that is not indented', () => {
    assert.deepEqual(shown(problemsOf(`${SENTENCE}  indented.\n not enough.\n`)), [
      '3: methodology/flow: CHANGELOG.md\'s first entry has a line not indented by two spaces: '
        + '" not enough." (dl-028 D1)']);
  });
});
