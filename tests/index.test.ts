import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import {
  chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { indexOutputs, runIndex } from '../src/index';
import { indexSchema, indexSchemaErrors } from '../src/index-schema';
import { runCheckPacks } from '../src/check-packs';
import { withRepo } from './support/git-repo';
import type { TestRepo } from './support/git-repo';
import { indexCatalog } from './support/index-catalog';
import { BASE_COMPOSABLE, writePack } from './support/pack-tree';
import { fixtureCompat, publishByHand } from './support/published-repo';
import { FIXTURES, FIXTURE_CATALOG, REPO_ROOT } from './support/paths';
import { appendFileSync } from 'node:fs';

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
      ['index: checked 6 files, 0 not up to date']);
  });

  it('writes the outputs, then reports them unchanged; two runs are byte-identical', () => {
    withCopy((tree) => {
      rmSync(join(tree, 'CATALOG.md'));
      writeFileSync(join(tree, 'llms.txt'), 'stale\n');
      assert.deepEqual(runIndex(['--tree', tree]).lines, ['index: wrote 2 files, 9 unchanged']);
      const first = indexOutputs(tree);
      assert.deepEqual(runIndex(['--tree', tree]).lines, ['index: wrote 0 files, 11 unchanged']);
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
      assert.deepEqual(result.lines, ['index: checked 11 files, 2 not up to date',
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

  it('reports a README with an unknown marker pair, in both modes, without crashing', () => {
    withCopy((tree) => {
      const readme = join(tree, 'packs', 'base', 'README.md');
      writeFileSync(readme, readFileSync(readme, 'utf8').replace('## When to use it',
        '<!-- generated:begin foo -->\nx\n<!-- generated:end foo -->\n\n## When to use it'));
      const written = runIndex(['--tree', tree]);
      assert.equal(written.code, 1, written.lines.join('\n'));
      assert.ok(written.lines.some((line) => / readme-marker: /.test(line)));
      const checked = runIndex(['--tree', tree, '--check']);
      assert.equal(checked.code, 0, checked.lines.join('\n'));
    });
  });

  it('reports a pack file that does not parse on one line, exit 1', () => {
    withCopy((tree) => {
      const workflow = join(tree, 'packs', 'methodology', 'kanban', 'workflows', 'replenishment.yaml');
      writeFileSync(workflow, `${readFileSync(workflow, 'utf8')}name: [unclosed\n`);
      const result = runIndex(['--tree', tree, '--check']);
      assert.equal(result.code, 1);
      assert.deepEqual(result.lines, [`index: ${tree}: packs/methodology/kanban/workflows/`
        + 'replenishment.yaml does not parse; the lint reports it']);
    });
  });

  it('skips a pack with no README.md: the layout rule reports it', () => {
    withCopy((tree) => {
      rmSync(join(tree, 'packs', 'stage', 'production', 'README.md'));
      assert.ok(!indexOutputs(tree).has('packs/stage/production/README.md'));
      assert.equal(runIndex(['--tree', tree, '--check']).code, 0);
    });
  });

  it('exits 2 when the index would break its own schema', () => {
    withRepo((repo) => {
      writePack(repo.dir, BASE_COMPOSABLE);
      repo.write('catalog.yaml', readFileSync(FIXTURE_CATALOG, 'utf8'));
      repo.write('compat.yaml', fixtureCompat());
      // A tagged pack.yaml no schema check reads: its parameter type is outside the enum.
      const manifest = join(repo.dir, 'packs', 'base', 'pack.yaml');
      writeFileSync(manifest, `${readFileSync(manifest, 'utf8')}parameters:\n  p: { type: weird, `
        + 'description: "x" }\n');
      repo.commitAll('base');
      publishByHand(repo, 'base', { index: false });
      const result = runIndex(['--tree', repo.dir, '--check']);
      assert.equal(result.code, 2, result.lines.join('\n'));
      assert.match(result.lines[0] ?? '', /would break its schema/);
    });
  });

  it('exits 2 on an I/O error: a README it cannot read, a tree it cannot write', (context) => {
    if (process.getuid?.() === 0) {
      context.skip('permissions do not apply to root');
      return;
    }
    withCopy((tree) => {
      const readme = join(tree, 'packs', 'base', 'README.md');
      chmodSync(readme, 0o000);
      try {
        const unreadable = runIndex(['--tree', tree, '--check']);
        assert.equal(unreadable.code, 2, unreadable.lines.join('\n'));
        assert.equal(unreadable.lines.length, 1);
      } finally {
        chmodSync(readme, 0o644);
      }
      writeFileSync(join(tree, 'CATALOG.md'), 'stale\n');
      chmodSync(tree, 0o555);
      chmodSync(join(tree, 'CATALOG.md'), 0o444);
      try {
        const unwritable = runIndex(['--tree', tree]);
        assert.equal(unwritable.code, 2, unwritable.lines.join('\n'));
      } finally {
        chmodSync(tree, 0o755);
        chmodSync(join(tree, 'CATALOG.md'), 0o644);
      }
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
    assert.match(result.stdout, /^index: checked 11 files, 0 not up to date\n$/);
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

  it('passes the lint, tag rules included', () => {
    const lint = runCheckPacks(repo.dir);
    assert.equal(lint.code, 0, lint.lines.join('\n'));
  });

  it('writes the working tree\'s values into the README generated sections', () => {
    const readme = indexOutputs(repo.dir).get('packs/methodology/kanban/README.md') ?? '';
    assert.ok(readme.includes('# Kanban (unreleased)'), readme);
    const index = indexOutputs(repo.dir).get('catalog-index.json') ?? '';
    assert.ok(!index.includes('unreleased'));
  });
});

describe('a pack\'s raw fragments (task-070, plan-057)', () => {
  it('the index\'s command prints nothing on stderr for an unquoted {{name}} limit', () => {
    withCopy((tree) => {
      appendFileSync(join(tree, 'packs', 'software', 'fragments', 'memory.yaml'),
        // On release, the last type: no new type, so the generated sections do not move.
        '    states:\n      limits:\n        draft: {{x}}\n');
      const result = spawnSync(process.execPath, [CLI, '--tree', tree, '--check'],
        { encoding: 'utf8' });
      assert.equal(result.stderr, '');
      assert.equal(result.status, 0, result.stdout);
    });
  });
});
