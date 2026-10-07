import { strict as assert } from 'node:assert';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

import { findFiles, runCheckSchemas } from '../src/check-schemas';
import { REPO_ROOT } from './support/paths';

const PRESET = 'format: 1\nid: p\ntitle: "P"\ndescription: "d"\nprofile: "x"\n'
  + 'packs:\n  - methodology/kanban@^1\nparameters: {}\n';

function withTree(files: Record<string, string>, body: (root: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), 'check-schemas-'));
  try {
    for (const [path, text] of Object.entries(files)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), text);
    }
    body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe('findFiles', () => {
  it('finds every file of a known kind, in sorted order, and nothing else', () => {
    withTree({
      'transitions/b-to-c.yaml': '', 'transitions/a-to-b.yaml': '',
      'packs/stage/prod/pack.yaml': '', 'packs/base/pack.yaml': '',
      'packs/base/fragments/dna.yaml': '', 'packs/base/fragments/pack.yaml': '',
      'packs/methodology/kanban/nested/pack.yaml': '', 'packs/methodology/kanban/pack.yaml': '',
      'presets/README.md': '', 'presets/x.yaml': '', 'presets/dir.yaml/keep': '',
      'catalog.yaml': '', 'compat.yaml': '', 'other.yaml': '',
    }, (root) => {
      assert.deepEqual(findFiles(root), [
        { file: 'catalog.yaml', kind: 'catalog' },
        { file: 'compat.yaml', kind: 'compat' },
        { file: 'packs/base/pack.yaml', kind: 'pack' },
        { file: 'packs/methodology/kanban/pack.yaml', kind: 'pack' },
        { file: 'packs/stage/prod/pack.yaml', kind: 'pack' },
        { file: 'presets/x.yaml', kind: 'preset' },
        { file: 'transitions/a-to-b.yaml', kind: 'transition' },
        { file: 'transitions/b-to-c.yaml', kind: 'transition' },
      ]);
    });
  });
});

describe('runCheckSchemas', () => {
  it('passes on this repository', () => {
    const result = runCheckSchemas(REPO_ROOT);
    assert.equal(result.code, 0, result.messages.join('\n'));
  });

  it('passes on valid files and counts them', () => {
    withTree({ 'presets/a.yaml': PRESET, 'presets/b.yaml': PRESET }, (root) => {
      assert.deepEqual(runCheckSchemas(root), { code: 0, checked: 2, messages: [] });
    });
  });

  it('exits 1 with a positioned message on a schema error', () => {
    withTree({ 'presets/a.yaml': PRESET.replace('id: p', 'id: P!') }, (root) => {
      const result = runCheckSchemas(root);
      assert.equal(result.code, 1);
      assert.deepEqual(result.messages, ['presets/a.yaml:2:5: /id pattern: must match pattern '
        + '"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$"']);
    });
  });

  it('positions a missing key at its mapping, and a root error at 1:1', () => {
    withTree({
      'presets/a.yaml': `# A preset.\n\n${PRESET.replace('format: 1\n', '')}`,
      'compat.yaml': 'format: 1\nkinds: {}\ncapabilities: {}\nreleases:\n  - wingfoil: 0.2.2\n',
    }, (root) => {
      const result = runCheckSchemas(root);
      assert.equal(result.code, 1);
      assert.ok(result.messages.includes(
        "presets/a.yaml:1:1: / required: must have required property 'format'",
      ), result.messages.join('\n'));
      assert.ok(result.messages.some((message) => message.startsWith(
        "compat.yaml:5:5: /releases/0 required: must have required property 'format_key'",
      )), result.messages.join('\n'));
    });
  });

  it('exits 2 on a directory it cannot list, rather than skipping it', (context) => {
    if (process.getuid?.() === 0) {
      context.skip('permissions do not apply to root');
      return;
    }
    withTree({ 'packs/x/pack.yaml': '', 'presets/a.yaml': PRESET }, (root) => {
      chmodSync(join(root, 'packs', 'x'), 0o000);
      try {
        const result = runCheckSchemas(root);
        assert.equal(result.code, 2);
        assert.match(result.messages[0] ?? '', /^packs\/x:1:1: cannot list directory: EACCES$/);
      } finally {
        chmodSync(join(root, 'packs', 'x'), 0o755);
      }
    });
  });

  it('exits 1 on a YAML error', () => {
    withTree({ 'presets/a.yaml': 'format: 1\nformat: 1\n' }, (root) => {
      const result = runCheckSchemas(root);
      assert.equal(result.code, 1);
      assert.match(result.messages[0] ?? '', /^presets\/a\.yaml:2:1: /);
    });
  });

  it('exits 2 when a file cannot be read, and still reports the others', () => {
    withTree({ 'catalog.yaml/keep': '', 'presets/a.yaml': PRESET.replace('id: p', 'id: P') },
      (root) => {
        const result = runCheckSchemas(root);
        assert.equal(result.code, 2);
        assert.equal(result.messages.length, 2);
        assert.match(result.messages[0] ?? '', /^catalog\.yaml:1:1: /);
      });
  });

  it('sorts messages by file, line and column', () => {
    withTree({
      'presets/b.yaml': PRESET.replace('id: p', 'id: P'),
      'presets/a.yaml': PRESET.replace('id: p', 'id: P').replace('title: "P"', 'title: ""'),
    }, (root) => {
      const files = runCheckSchemas(root).messages.map((message) => message.split(': ')[0]);
      assert.deepEqual(files, ['presets/a.yaml:2:5', 'presets/a.yaml:3:8', 'presets/b.yaml:2:5']);
    });
  });
});
