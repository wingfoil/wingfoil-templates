import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import {
  cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { indexOutputs, runIndex } from '../src/index';
import { indexSchema, indexSchemaErrors } from '../src/index-schema';
import type { TestRepo } from './support/git-repo';
import { indexCatalog } from './support/index-catalog';
import { FIXTURES, REPO_ROOT } from './support/paths';

const CLI = join(REPO_ROOT, 'dist', 'src', 'index-cli.js');
const TREE = join(FIXTURES, 'compose', 'tree');
/**
 * The outputs of the fixture catalog (acceptance 12). Refresh them, never in a normal run, with:
 * REFRESH_INDEX_EXPECTED=1 node --test dist/tests/index.test.js
 */
const EXPECTED = join(FIXTURES, 'index', 'expected');

function withCopy(body: (tree: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'index-'));
  try {
    cpSync(TREE, join(dir, 'tree'), { recursive: true });
    body(join(dir, 'tree'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('npm run index (acceptance 3)', () => {
  it('is up to date in this repository and in the golden tree', () => {
    for (const tree of [REPO_ROOT, TREE]) {
      const result = runIndex(['--tree', tree, '--check']);
      assert.equal(result.code, 0, result.lines.join('\n'));
    }
    assert.deepEqual(runIndex(['--tree', REPO_ROOT, '--check']).lines,
      ['index: checked 3 files, 0 not up to date']);
  });

  it('writes the outputs, then reports them unchanged; two runs are byte-identical', () => {
    withCopy((tree) => {
      rmSync(join(tree, 'CATALOG.md'));
      writeFileSync(join(tree, 'llms.txt'), 'stale\n');
      assert.deepEqual(runIndex(['--tree', tree]).lines, ['index: wrote 2 files, 7 unchanged']);
      const first = indexOutputs(tree);
      assert.deepEqual(runIndex(['--tree', tree]).lines, ['index: wrote 0 files, 9 unchanged']);
      assert.deepEqual(indexOutputs(tree), first);
    });
  });

  it('--check names a missing and a differing output, sorted, and writes nothing', () => {
    withCopy((tree) => {
      rmSync(join(tree, 'catalog-index.json'));
      const readme = join(tree, 'packs', 'base', 'README.md');
      writeFileSync(readme, readFileSync(readme, 'utf8').replace('Axis: foundation', 'Axis: x'));
      const result = runIndex(['--tree', tree, '--check']);
      assert.equal(result.code, 1);
      assert.deepEqual(result.lines, ['index: checked 9 files, 2 not up to date',
        'catalog-index.json: not up to date: run npm run index',
        'packs/base/README.md: not up to date: run npm run index']);
      assert.equal(existsSync(join(tree, 'catalog-index.json')), false);
    });
  });

  it('writes nothing when a README breaks the README rules', () => {
    withCopy((tree) => {
      const readme = join(tree, 'packs', 'base', 'README.md');
      const broken = readFileSync(readme, 'utf8').replace('## Examples', '## Samples');
      writeFileSync(readme, broken);
      rmSync(join(tree, 'llms.txt'));
      const result = runIndex(['--tree', tree]);
      assert.equal(result.code, 1);
      assert.match(result.lines[0] ?? '', /^index: \d+ README problems?, nothing written$/);
      assert.ok(result.lines.some((line) => /packs\/base\/README\.md:\d+:1: readme-heading/
        .test(line)), result.lines.join('\n'));
      assert.equal(existsSync(join(tree, 'llms.txt')), false);
      assert.equal(readFileSync(readme, 'utf8'), broken);
    });
  });

  it('exits 3 on bad usage and 2 on a tree that is not a directory', () => {
    assert.equal(runIndex(['--nope']).code, 3);
    assert.equal(runIndex(['positional']).code, 3);
    assert.equal(runIndex(['--tree', join(REPO_ROOT, 'package.json')]).code, 2);
  });

  it('runs as a command, with its exit code', () => {
    const result = spawnSync(process.execPath, [CLI, '--tree', TREE, '--check'],
      { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stdout);
    assert.match(result.stdout, /^index: checked 9 files, 0 not up to date\n$/);
  });
});

describe('index/catalog-index.schema.json (acceptance 7)', () => {
  it('compiles under Ajv 2020 in strict mode with no warning', () => {
    assert.deepEqual(indexSchema().warnings, []);
  });

  it('accepts the committed index of this repository and refuses an extra key', () => {
    const data = JSON.parse(readFileSync(join(REPO_ROOT, 'catalog-index.json'), 'utf8')) as object;
    assert.deepEqual(indexSchemaErrors(data), []);
    assert.notDeepEqual(indexSchemaErrors({ ...data, date: 'x' }), []);
  });
});

describe('the fixture catalog with tagged versions (acceptance 12, 13)', () => {
  let repo: TestRepo;
  before(() => {
    repo = indexCatalog();
  });
  after(() => repo.dispose());

  it('matches the committed expected outputs, byte for byte', () => {
    const outputs = indexOutputs(repo.dir);
    if (process.env['REFRESH_INDEX_EXPECTED'] === '1') {
      rmSync(EXPECTED, { recursive: true, force: true });
      for (const [path, text] of outputs) {
        mkdirSync(dirname(join(EXPECTED, path)), { recursive: true });
        writeFileSync(join(EXPECTED, path), text);
      }
    }
    for (const [path, text] of outputs) {
      assert.equal(readFileSync(join(EXPECTED, path), 'utf8'), text, path);
    }
    assert.deepEqual(indexSchemaErrors(JSON.parse(outputs.get('catalog-index.json') ?? '{}')), []);
  });

  it('writes the working tree\'s values into the README generated sections', () => {
    const readme = indexOutputs(repo.dir).get('packs/methodology/kanban/README.md') ?? '';
    assert.ok(readme.includes('# Kanban (unreleased)'), readme);
    const index = indexOutputs(repo.dir).get('catalog-index.json') ?? '';
    assert.ok(!index.includes('unreleased'));
  });
});
