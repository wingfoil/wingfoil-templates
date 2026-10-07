import { strict as assert } from 'node:assert';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { describe, it } from 'node:test';

import { runValidate } from '../src/validate';
import { FIXTURES, REPO_ROOT } from './support/paths';

const TREE = join(FIXTURES, 'compose', 'tree');
const ENTRIES = ['methodology/kanban', 'phase/inception/lean', 'blueprint/web-service',
  'team-mode/agent-first', 'stage/production'];
const NAME = ['--param', 'project_name=Golden'];

function withTree(edit: (tree: string) => void, body: (tree: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'validate-'));
  try {
    const tree = join(dir, 'tree');
    cpSync(TREE, tree, { recursive: true });
    edit(tree);
    body(tree);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function replaceIn(file: string, from: string, to: string): void {
  const text = readFileSync(file, 'utf8');
  assert.ok(text.includes(from), `${from} not in ${file}`);
  writeFileSync(file, text.replace(from, to));
}

describe('npm run validate', () => {
  it('composes the golden preset twice into byte-identical files (W5 exit criterion)', () => {
    const result = runValidate(['--tree', TREE, ...NAME]);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.ok(result.lines.some((line) => /^schemas: checked 8 files, 0 problems$/.test(line)),
      result.lines.join('\n'));
    assert.ok(result.lines.some((line) =>
      /^composition presets\/golden\.yaml: composed twice, 18 files, byte-identical$/.test(line)),
    result.lines.join('\n'));
    assert.ok(result.lines.includes('compositions: 1'));
    assert.ok(result.lines.some((line) => line.startsWith('matrix: not yet part of validate')));
  });

  it('accepts a tree given as a relative path', () => {
    const result = runValidate(['--tree', relative(process.cwd(), TREE), ...NAME]);
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('reports the preset and the given entries', () => {
    const result = runValidate(['--tree', TREE, '--param', 'project_name=Golden',
      '--param', 'wip_limit=4', ...ENTRIES]);
    assert.equal(result.code, 1, 'wip_limit is set by the preset');
    const entries = runValidate(['--tree', TREE, ...NAME, ...ENTRIES]);
    assert.equal(entries.code, 0, entries.lines.join('\n'));
    assert.ok(entries.lines.includes('compositions: 2'));
    assert.ok(entries.lines.some((line) => line.startsWith('composition entries: composed twice')));
  });

  it('validates this repository: one file, no composition', () => {
    const result = runValidate(['--tree', REPO_ROOT]);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.ok(result.lines.includes('schemas: checked 1 files, 0 problems'));
    assert.ok(result.lines.includes('compositions: 0'));
  });

  it('exits 1 on a schema error, and does not compose the failing preset', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'format: 1', 'format: 2'),
      (tree) => {
        const result = runValidate(['--tree', tree, ...NAME]);
        assert.equal(result.code, 1);
        assert.ok(result.lines.some((line) => line.startsWith('presets/golden.yaml:')));
        assert.ok(result.lines.includes('compositions: 0'));
      });
  });

  it('exits 1 on a composition error, naming it', () => {
    withTree((tree) => replaceIn(join(tree, 'packs', 'methodology', 'kanban', 'fragments',
      'roles.yaml'), 'format: 1', 'format: 1\nversion: 2'), (tree) => {
      const result = runValidate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => /presets\/golden\.yaml.*version/.test(line)),
        result.lines.join('\n'));
    });
  });

  it('exits 1 on a preset whose packs do not resolve', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'stage/production@^1',
      'stage/production@^2'), (tree) => {
      const result = runValidate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => /presets\/golden\.yaml.*stage\/production/.test(line)));
    });
  });

  it('exits 1 on a determinism mismatch, through the report', () => {
    const result = runValidate(['--tree', TREE, ...NAME],
      { compare: () => ['.wingfoil/dna.yaml: the bytes differ'] });
    assert.equal(result.code, 1);
    assert.ok(result.lines.some((line) =>
      /presets\/golden\.yaml: not deterministic: \.wingfoil\/dna\.yaml: the bytes differ/
        .test(line)));
  });

  it('exits 1 on a --param no composition declares', () => {
    const result = runValidate(['--tree', TREE, ...NAME, '--param', 'nope=1']);
    assert.equal(result.code, 1);
    assert.ok(result.lines.some((line) => /nope/.test(line)));
  });

  it('exits 3 on bad usage', () => {
    assert.equal(runValidate(['--unknown']).code, 3);
    assert.equal(runValidate(['--param', 'novalue']).code, 3);
  });
});
