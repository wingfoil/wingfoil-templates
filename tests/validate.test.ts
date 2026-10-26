import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import {
  chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { after, describe, it } from 'node:test';

import { EXEMPTION } from '../src/examples';
import { MatrixIoError } from '../src/matrix';
import { runIndex } from '../src/index';
import { runPublish } from '../src/publish';
import { runSite } from '../src/site';
import { mapOverlayPaths, runValidate } from '../src/validate';
import type { ValidateOptions, ValidateResult } from '../src/validate';
import { writePack } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { FIXTURES, REPO_ROOT } from './support/paths';
import { FROZEN_COMPAT, publishByHand, treeRepo } from './support/published-repo';
import { FORMAT_WARNING, StubWingfoil } from './support/stub-wingfoil';
import type { StubCommand } from './support/stub-wingfoil';

const TREE = join(FIXTURES, 'compose', 'tree');
const ENTRIES = ['methodology/kanban', 'phase/inception/lean', 'blueprint/web-service',
  'team-mode/agent-first', 'stage/production'];
const NAME = ['--param', 'project_name=Golden'];
/** The examples of the golden tree's packs, in path order (task-022). */
const GOLDEN_EXAMPLES = ['agent-first/agent-team', 'base/core-only', 'base/kanban-team',
  'flow/core-team', 'flow/delivery-team', 'kanban/small-board', 'lean/new-product',
  'production/live-service', 'software/delivery-team', 'web-service/orders-api']
  .map((example) => `tests/fixtures/examples/${example}/example.yaml`);
/** The compositions of the golden tree: flow's examples with their other leg (task-032). */
const GOLDEN_LEGS = GOLDEN_EXAMPLES.flatMap((example) => [example,
  ...example.includes('/flow/core-team/') ? [`${example}[+software]`] : [],
  ...example.includes('/flow/delivery-team/') ? [`${example}[-software]`] : []]);

/** WingFoil 0.2.2 as the tests see it: exit 0, one format warning per command (W-01). */
function stubbed(command: StubCommand): StubWingfoil {
  return new StubWingfoil({ commands: Object.fromEntries(
    ['workflow list', 'dna show', 'directives list'].map((line) => [line, command])) });
}
const WINGFOIL = stubbed({ stderr: [FORMAT_WARNING] });
after(() => WINGFOIL.dispose());

/** WingFoil 0.3.0 as the tests see it: its version line, JSON with nothing to report (task-036). */
const CLEAN_JSON = { stdout: [JSON.stringify({ workflows: [], diagnostics: [], entries: [],
  warnings: [] })] };
function stubbed030(diagnostics: unknown[] = []): StubWingfoil {
  return new StubWingfoil({ version: '0.3.0 (cc31d7a8)', commands: {
    'workflow list': { stdout: [JSON.stringify({ workflows: [], diagnostics })] },
    'dna show': CLEAN_JSON, 'directives list': CLEAN_JSON } }, '0.3.0');
}
const WINGFOIL_030 = stubbed030();
after(() => WINGFOIL_030.dispose());

/**
 * The stub of each release `compat.yaml` lists: `wingfoil-<version>` is never installed in the
 * tests, and a release with no stub is an error.
 */
function byRelease(release022: StubWingfoil = WINGFOIL, release030: StubWingfoil = WINGFOIL_030):
(version: string) => string {
  const stubs: Record<string, StubWingfoil> = { '0.2.2': release022, '0.3.0': release030 };
  return (version) => {
    const stub = stubs[version];
    if (stub === undefined) throw new Error(`no stub for wingfoil@${version}`);
    return stub.cli;
  };
}

/** `validate` never installs a release in the tests: a stub stands for each release. */
function validate(argv: string[], options: Partial<ValidateOptions> = {}): ValidateResult {
  return runValidate(argv, { mode: 'self-test', install: byRelease(), ...options });
}

function withTree(edit: (tree: string) => void, body: (tree: string) => void,
  expectIndexRefusal = false): void {
  const dir = mkdtempSync(join(tmpdir(), 'validate-'));
  try {
    const tree = join(dir, 'tree');
    cpSync(TREE, tree, { recursive: true });
    edit(tree);
    // The edit is the test's; the index outputs follow it (task-019), when the tree allows.
    const index = runIndex(['--tree', tree]);
    assert.ok(index.code === 0 || expectIndexRefusal, index.lines.join('\n'));
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
    const result = validate(['--tree', TREE, ...NAME]);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.ok(result.lines.some((line) => /^schemas: checked 11 files, 0 problems$/.test(line)),
      result.lines.join('\n'));
    assert.ok(result.lines.some((line) =>
      /^composition presets\/golden\.yaml: composed twice, 19 files, byte-identical$/.test(line)),
    result.lines.join('\n'));
    // The golden preset, the ten examples of its packs, and flow's two other legs (task-032).
    assert.ok(result.lines.includes('compositions: 13'));
  });

  it('runs the golden preset against wingfoil@0.2.2 and 0.3.0 in self-test mode (task-036)',
    () => {
      const result = validate(['--tree', TREE, ...NAME]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      // The golden preset, then its packs' examples in path order (task-022); per composition,
      // the oldest then the newest compatible release.
      assert.deepEqual(result.lines.filter((line) => line.startsWith('matrix')), [
        ...['presets/golden.yaml', ...GOLDEN_LEGS].flatMap((label) => [
          ...['workflow list', 'dna show', 'directives list'].map((command) =>
            `matrix ${label} wingfoil@0.2.2 ${command}: pass (self-test, tolerated 1)`),
          ...['workflow list', 'dna show', 'directives list'].map((command) =>
            `matrix ${label} wingfoil@0.3.0 ${command}: pass (self-test)`)]),
        'matrix: self-test, 26 runs, 0 failed, tolerance applied: 0.2.2',
      ]);
      assert.equal(result.mode, 'self-test');
      assert.deepEqual(result.tolerated, ['0.2.2']);
    });

  it('fails a 0.3.0 warning diagnostic on the runs of 0.3.0 only, 0.2.2 tolerated (task-036)',
    () => {
      const warned = stubbed030([{ code: 'W_SAMPLE', severity: 'warning', file: 'f', path: 'p',
        message: 'sample' }]);
      try {
        const result = validate(['--tree', TREE, ...NAME],
          { install: byRelease(WINGFOIL, warned) });
        assert.equal(result.code, 1, result.lines.join('\n'));
        assert.ok(result.lines.some((line) => line.startsWith(
          'matrix presets/golden.yaml wingfoil@0.3.0 workflow list: fail (self-test)')),
        result.lines.join('\n'));
        assert.ok(result.lines.includes(
          'matrix: self-test, 26 runs, 13 failed, tolerance applied: 0.2.2'),
        result.lines.join('\n'));
      } finally {
        warned.dispose();
      }
    });

  it('in publication mode, runs the golden preset against 0.3.0 alone (dl-009, task-036)', () => {
    const result = validate(['--tree', TREE, ...NAME], { mode: 'publication' });
    assert.equal(result.code, 0, result.lines.join('\n'));
    const matrix = result.lines.filter((line) => line.startsWith('matrix'));
    assert.ok(matrix.every((line) => !line.includes('wingfoil@0.2.2')), matrix.join('\n'));
    assert.ok(matrix.includes(
      'matrix presets/golden.yaml wingfoil@0.3.0 workflow list: pass (publication)'),
    matrix.join('\n'));
    assert.ok(result.lines.includes(
      'matrix: publication, 13 runs, 0 failed, tolerance applied: none'), result.lines.join('\n'));
    assert.equal(result.mode, 'publication');
    assert.deepEqual(result.tolerated, []);
  });

  it('in publication mode, finds no compatible release when compat.yaml lists 0.2.2 alone',
    () => {
      withTree((tree) => { writeFileSync(join(tree, 'compat.yaml'), FROZEN_COMPAT); }, (tree) => {
        const result = validate(['--tree', tree, ...NAME], { mode: 'publication' });
        assert.equal(result.code, 1, result.lines.join('\n'));
        assert.ok(result.lines.includes(
          'matrix presets/golden.yaml: no compatible release (publication)'),
        result.lines.join('\n'));
        assert.ok(result.lines.includes(
          'matrix: publication, 0 runs, 0 failed, tolerance applied: none'),
        result.lines.join('\n'));
      });
    });

  it('fails a composition that fails the matrix, naming release and command', () => {
    const noisy = stubbed({ stderr: ['Warning: something else'] });
    try {
      const result = validate(['--tree', TREE, ...NAME], { install: byRelease(noisy) });
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => line.startsWith(
        'matrix presets/golden.yaml wingfoil@0.2.2 workflow list: fail (self-test)')),
      result.lines.join('\n'));
      assert.ok(result.lines.includes(
        'matrix: self-test, 26 runs, 13 failed, tolerance applied: none'),
      result.lines.join('\n'));
    } finally {
      noisy.dispose();
    }
  });

  it('exits 2 when a release cannot be installed, never passing', () => {
    const result = validate(['--tree', TREE, ...NAME], {
      install: (version) => { throw new MatrixIoError(`wingfoil@${version}: npm ci failed`); },
    });
    assert.equal(result.code, 2);
    assert.ok(result.lines.some((line) => /wingfoil@0\.2\.2: npm ci failed/.test(line)),
      result.lines.join('\n'));
    assert.ok(result.lines.some((line) => /wingfoil@0\.3\.0: npm ci failed/.test(line)),
      result.lines.join('\n'));
    assert.ok(result.lines.includes(
      'matrix: self-test, 26 runs, 26 failed, tolerance applied: none'),
    result.lines.join('\n'));
  });

  it('exits 1 on a tree with compositions and no compat.yaml', () => {
    withTree((tree) => rmSync(join(tree, 'compat.yaml')), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => /^compat\.yaml: /.test(line)), result.lines.join('\n'));
      assert.ok(result.lines.includes('matrix presets/golden.yaml: skipped'));
    });
  });

  it('exits 1 on a compat.yaml the loader refuses, beyond the schema', () => {
    withTree((tree) => replaceIn(join(tree, 'compat.yaml'), 'capabilities: []',
      'capabilities: [time-travel]'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1);
      assert.equal(result.lines.filter((line) => /time-travel/.test(line)).length, 1,
        `reported once, by the lint: ${result.lines.join('\n')}`);
      assert.ok(result.lines.some((line) => /^compat\.yaml:\d+:\d+: compat: /.test(line)));
    });
  });

  it('runs the lint after the schema checks, on the golden tree', () => {
    const result = validate(['--tree', TREE, ...NAME]);
    assert.equal(result.lines[1], 'lint: checked 70 files, 0 problems', result.lines.join('\n'));
  });

  it('exits 1 on a lint problem, and composes no preset the lint rejects', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'wip_limit: 2',
      'wip_limit: "2"'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) => /presets\/golden\.yaml:\d+:\d+: preset-value: /
        .test(line)), result.lines.join('\n'));
      assert.ok(result.lines.includes('composition presets/golden.yaml: skipped, the lint '
        + 'reports it'));
      assert.ok(result.lines.includes('matrix presets/golden.yaml: skipped'));
    });
  });

  it('fixes the mode by the caller: --mode is not an option', () => {
    assert.equal(validate(['--mode', 'publication']).code, 3);
    assert.equal(validate(['--mode=self-test']).code, 3);
  });

  it('accepts a tree given as a relative path', () => {
    const result = validate(['--tree', relative(process.cwd(), TREE), ...NAME]);
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('reports the preset and the given entries', () => {
    const result = validate(['--tree', TREE, '--param', 'project_name=Golden',
      '--param', 'wip_limit=4', ...ENTRIES]);
    assert.equal(result.code, 1, 'wip_limit is set by the preset');
    const entries = validate(['--tree', TREE, ...NAME, ...ENTRIES]);
    assert.equal(entries.code, 0, entries.lines.join('\n'));
    assert.ok(entries.lines.includes('compositions: 14'));
    assert.ok(entries.lines.some((line) => line.startsWith('composition entries: composed twice')));
  });

  it('validates this repository: the base and software packs, base\'s three examples, three runs '
    + '(task-039, task-047)', () => {
      const result = validate(['--tree', REPO_ROOT]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(result.lines.includes('schemas: checked 4 files, 0 problems'));
      assert.ok(result.lines.includes('lint: checked 45 files, 0 problems'));
      assert.ok(result.lines.includes('compositions: 3'));
      assert.ok(result.lines.includes(
        'matrix: self-test, 3 runs, 0 failed, tolerance applied: none'), result.lines.join('\n'));
    });

  it('validates software through its fixture methodology: the four governed repositories\' '
    + 'parameter sets (task-047, task-049)', () => {
    const result = validate(['--tree', REPO_ROOT, '--overlay', 'tests/fixtures/software-exit']);
    assert.equal(result.code, 0, result.lines.join('\n'));
    for (const id of ['defaults', 'flat-releases', 'release-folders', 'release-folders-lean']) {
      assert.ok(result.lines.some((line) => line.startsWith('composition '
        + `tests/fixtures/software-exit/compositions/${id}/example.yaml: composed twice, `)), id);
    }
    assert.ok(result.lines.includes('compositions: 7'), result.lines.join('\n'));
    assert.ok(result.lines.includes(
      'matrix: self-test, 7 runs, 0 failed, tolerance applied: none'), result.lines.join('\n'));
  });

  it('passes a publication run of this repository: the three examples of base on 0.3.0 (task-039)',
    () => {
      const result = validate(['--tree', REPO_ROOT], { mode: 'publication' });
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(result.lines.includes(
        'matrix: publication, 3 runs, 0 failed, tolerance applied: none'),
      result.lines.join('\n'));
    });

  it('exits 1 on a schema error, and does not compose the failing preset', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'format: 1', 'format: 2'),
      (tree) => {
        const result = validate(['--tree', tree, ...NAME]);
        assert.equal(result.code, 1);
        assert.ok(result.lines.some((line) => line.startsWith('presets/golden.yaml:')));
        // The examples still compose (task-022); the failing preset does not.
        assert.ok(result.lines.includes('compositions: 12'), result.lines.join('\n'));
      });
  });

  it('exits 1 on a composition error, naming it', () => {
    withTree((tree) => replaceIn(join(tree, 'packs', 'methodology', 'kanban', 'fragments',
      'roles.yaml'), 'format: 1', 'format: 1\nversion: 2'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => /presets\/golden\.yaml.*version/.test(line)),
        result.lines.join('\n'));
    });
  });

  it('runs index --check after the lint and before the compositions (task-019)', () => {
    const result = validate(['--tree', TREE, ...NAME]);
    const at = (pattern: RegExp): number => result.lines.findIndex((line) => pattern.test(line));
    assert.ok(at(/^lint: /) < at(/^index: checked 11 files, 0 not up to date$/));
    assert.ok(at(/^index: checked/) < at(/^composition /), result.lines.join('\n'));
  });

  it('exits 2 when the index cannot read a tag that catalog.yaml names (task-019)', () => {
    const repo = treeRepo();
    try {
      publishByHand(repo, 'base');
      repo.git(['tag', '-d', 'base@1.0.0']);
      const result = validate(['--tree', repo.dir, 'methodology/kanban']);
      assert.equal(result.code, 2, result.lines.join('\n'));
      assert.ok(result.lines.includes('index: tag base@1.0.0 is named by catalog.yaml and missing '
        + 'from the repository'), result.lines.join('\n'));
    } finally {
      repo.dispose();
    }
  });

  it('skips the index when the lint reports a file that does not parse (task-019)', () => {
    withTree((tree) => {
      const workflow = join(tree, 'packs', 'methodology', 'kanban', 'workflows',
        'replenishment.yaml');
      writeFileSync(workflow, `${readFileSync(workflow, 'utf8')}name: [unclosed\n`);
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.includes('index: skipped, the lint reports files that do not parse'));
    }, true);
  });

  it('fails when a pack.yaml, a fragment, a workflow or catalog.yaml changes without the index '
    + '(CB-5)', () => {
    const edits: [string[], string, string][] = [
      [['packs', 'methodology', 'kanban', 'pack.yaml'], 'WIP limit of', 'The WIP limit of'],
      [['packs', 'base', 'fragments', 'roles.yaml'], 'developer: [base-rules, testing]',
        'developer: [testing, base-rules]\n  reviewer: [base-rules]'],
      [['packs', 'methodology', 'kanban', 'workflows', 'replenishment.yaml'], 'name: pick',
        'name: choose'],
      [['catalog.yaml'], 'presets:\n  - { id: golden, path: presets/golden.yaml }\n',
        'presets: []\n'],
    ];
    for (const [path, from, to] of edits) {
      const dir = mkdtempSync(join(tmpdir(), 'validate-index-'));
      try {
        const tree = join(dir, 'tree');
        cpSync(TREE, tree, { recursive: true });
        replaceIn(join(tree, ...path), from, to);
        const stale = validate(['--tree', tree, ...NAME]);
        assert.equal(stale.code, 1, path.join('/'));
        assert.ok(stale.lines.some((line) => /^compositions: /.test(line)), 'later steps run');
        assert.ok(stale.lines.some((line) => / not up to date: run npm run index$/.test(line)),
          stale.lines.join('\n'));
        assert.equal(runIndex(['--tree', tree]).code, 0);
        const fresh = validate(['--tree', tree, ...NAME]);
        assert.equal(fresh.code, 0, `${path.join('/')}\n${fresh.lines.join('\n')}`);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  it('skips an example the lint reports, and composes the others (task-022)', () => {
    withTree((tree) => replaceIn(join(tree, 'tests', 'fixtures', 'examples', 'kanban',
      'small-board', 'example.yaml'), 'id: small-board', 'id: other'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.includes('composition tests/fixtures/examples/kanban/small-board/'
        + 'example.yaml: skipped, the lint reports it'), result.lines.join('\n'));
      assert.ok(result.lines.includes('matrix tests/fixtures/examples/kanban/small-board/'
        + 'example.yaml: skipped'));
      assert.ok(result.lines.includes('compositions: 12'));
    });
  });

  it('skips an orphan example, in path order after the presets (task-022)', () => {
    withTree((tree) => {
      for (const dir of ['ghost/x', 'kanban/y']) {
        const file = join(tree, 'tests', 'fixtures', 'examples', ...dir.split('/'), 'example.yaml');
        mkdirSync(join(file, '..'), { recursive: true });
        writeFileSync(file, readFileSync(join(tree, 'tests', 'fixtures', 'examples', 'kanban',
          'small-board', 'example.yaml'), 'utf8').replace('id: small-board',
          `id: ${dir.split('/')[1] ?? ''}`));
      }
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      const compositions = result.lines.filter((line) => line.startsWith('composition '));
      assert.deepEqual(compositions.map((line) => line.slice(0, line.indexOf(':'))), [
        'composition presets/golden.yaml',
        ...['agent-first/agent-team', 'base/core-only', 'base/kanban-team', 'flow/core-team',
          'flow/delivery-team', 'ghost/x', 'kanban/small-board', 'kanban/y', 'lean/new-product',
          'production/live-service', 'software/delivery-team', 'web-service/orders-api']
          .map((example) => `composition tests/fixtures/examples/${example}/example.yaml`)
          .flatMap((label) => [label,
            ...label.includes('/flow/core-team/') ? [`${label}[+software]`] : [],
            ...label.includes('/flow/delivery-team/') ? [`${label}[-software]`] : []]),
      ]);
      for (const orphan of ['ghost/x', 'kanban/y']) {
        assert.ok(result.lines.includes(`composition tests/fixtures/examples/${orphan}/`
          + 'example.yaml: skipped, the lint reports it'), result.lines.join('\n'));
      }
      assert.ok(result.lines.includes('compositions: 13'));
    }, true);
  });

  it('skips the examples of a pack whose pack.yaml fails its schema (task-022)', () => {
    withTree((tree) => replaceIn(join(tree, 'packs', 'methodology', 'kanban', 'pack.yaml'),
      'format: 1', 'format: 99'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.includes('composition tests/fixtures/examples/kanban/small-board/'
        + 'example.yaml: skipped, the lint reports it'), result.lines.join('\n'));
    }, true);
  });

  it('exits 1 on a preset whose packs do not resolve', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'stage/production@^1',
      'stage/production@^2'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => /presets\/golden\.yaml.*stage\/production/.test(line)));
    });
  });

  it('exits 1 on a determinism mismatch, through the report', () => {
    const result = validate(['--tree', TREE, ...NAME],
      { compare: () => ['.wingfoil/dna.yaml: the bytes differ'] });
    assert.equal(result.code, 1);
    assert.ok(result.lines.some((line) =>
      /presets\/golden\.yaml: not deterministic: \.wingfoil\/dna\.yaml: the bytes differ/
        .test(line)));
    assert.ok(result.lines.includes('matrix presets/golden.yaml: skipped'), result.lines.join('\n'));
  });

  it('exits 1 on a --param no composition declares', () => {
    const result = validate(['--tree', TREE, ...NAME, '--param', 'nope=1']);
    assert.equal(result.code, 1);
    assert.ok(result.lines.some((line) => /nope/.test(line)));
  });

  it('exits 2 on a tree that does not exist', () => {
    assert.equal(validate(['--tree', join(TREE, 'nope')]).code, 2);
  });

  it('does not claim a --param is undeclared when a composition could not be read', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'stage/production@^1',
      'stage/production@^2'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.ok(!result.lines.some((line) => line.includes('no composition declares')),
        result.lines.join('\n'));
    });
  });

  it('passes the preset values to the composition', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'wip_limit: 2',
      'wip_limit: two'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => /presets\/golden\.yaml.*wip_limit/.test(line)),
        result.lines.join('\n'));
    });
  });

  it('gives each composition only the --param names its packs declare', () => {
    withTree((tree) => {
      replaceIn(join(tree, 'packs', 'blueprint', 'web-service', 'pack.yaml'), 'contents:',
        'parameters:\n  api_prefix: { type: string, default: "/api", description: "x" }\n'
          + 'contents:');
      writeFileSync(join(tree, 'presets', 'small.yaml'), 'format: 1\nid: small\ntitle: "Small"\n'
        + 'description: "Kanban only."\npacks:\n  - methodology/kanban@^1\n');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--param', 'api_prefix=/v2']);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(result.lines.includes('compositions: 14'));
    });
  });

  it('exits with the highest code reached', (context) => {
    if (process.getuid?.() === 0) {
      context.skip('permissions do not apply to root');
      return;
    }
    withTree(() => undefined, (tree) => {
      const stage = join(tree, 'packs', 'stage');
      chmodSync(stage, 0o000);
      try {
        const result = validate(['--tree', tree, ...NAME]);
        assert.equal(result.code, 2, result.lines.join('\n'));
        assert.ok(result.lines.some((line) =>
          /presets\/golden\.yaml.*stage\/production/.test(line)));
      } finally {
        chmodSync(stage, 0o755);
      }
    });
  });

  it('exits 3 on bad usage', () => {
    assert.equal(validate(['--unknown']).code, 3);
    assert.equal(validate(['--param', 'novalue']).code, 3);
  });
});

describe('npm run validate: both legs of a conditional part (spec-001 §15, plan-039 R2, R5, R6)',
  () => {
    const FLOW_CORE = 'tests/fixtures/examples/flow/core-team/example.yaml';
    const FLOW_DELIVERY = 'tests/fixtures/examples/flow/delivery-team/example.yaml';
    /** governance/x: a conditional part, and no methodology to give its leg with software. */
    const GOVERNANCE: PackSpec = { id: 'governance/x', workflows: ['x'],
      manifest: { conditional: [{ with: 'software@^1', contents: { workflows: ['x-ship'] } }] },
      extraFiles: { 'workflows/x-ship.yaml': 'format: 1\nname: x-ship\nkind: sub\n' } };

    it('composes the other leg of each composition holding a conditional part', () => {
      const result = validate(['--tree', TREE, ...NAME]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      for (const label of [`${FLOW_CORE}[+software]`, `${FLOW_DELIVERY}[-software]`]) {
        assert.ok(result.lines.some((line) => line.startsWith(`composition ${label}: composed `
          + 'twice, ')), `${label}: ${result.lines.join('\n')}`);
        assert.ok(result.lines.some((line) =>
          line.startsWith(`matrix ${label} wingfoil@0.2.2 workflow list: pass`)), label);
      }
      assert.ok(!result.lines.some((line) => /golden\.yaml\[/.test(line)),
        'the golden preset holds no conditional part');
    });

    it('skips the leg with software of a composition without a methodology', () => {
      withTree((tree) => writePack(tree, GOVERNANCE), (tree) => {
        const result = validate(['--tree', tree, ...NAME, 'governance/x']);
        assert.ok(result.lines.includes('matrix entries[+software]: skipped, no methodology'),
          result.lines.join('\n'));
      }, true);
    });

    it('drops, in the leg without software, the values a preset sets for absent packs (R5)', () => {
      withTree((tree) => {
        writeFileSync(join(tree, 'presets', 'with-software.yaml'), 'format: 1\nid: with-software\n'
          + 'title: "With software"\ndescription: "Flow with the life cycle."\npacks:\n'
          + '  - software@^1\n  - methodology/flow@^1\nparameters:\n'
          + '  adr_path: "docs/adr/{id}.md"\n');
        const catalog = join(tree, 'catalog.yaml');
        writeFileSync(catalog, readFileSync(catalog, 'utf8').replace('presets:\n',
          'presets:\n  - { id: with-software, path: presets/with-software.yaml }\n'));
      }, (tree) => {
        const result = validate(['--tree', tree, ...NAME]);
        assert.equal(result.code, 0, result.lines.join('\n'));
        assert.ok(result.lines.some((line) => line.startsWith('composition '
          + 'presets/with-software.yaml[-software]: composed twice, ')
          && line.endsWith(', dropped adr_path')), result.lines.join('\n'));
      });
    });

    it('fails a publication run where a conditional part has no leg with software that ran (R6)',
      () => {
        withTree((tree) => writePack(tree, GOVERNANCE), (tree) => {
          const result = validate(['--tree', tree, ...NAME, 'governance/x'],
            { mode: 'publication' });
          assert.equal(result.code, 1, result.lines.join('\n'));
          assert.ok(result.lines.includes('matrix: governance/x has a conditional part and no '
            + 'composition with software that ran (plan-039 R6)'), result.lines.join('\n'));
        }, true);
      });
  });

describe('npm run validate --overlay (task-046, plan-046 ruling 1)', () => {
  const OVERLAY = 'tests/fixtures/overlay';
  const CORE = `${OVERLAY}/compositions/core-team/example.yaml`;
  const DELIVERY = `${OVERLAY}/compositions/delivery-team/example.yaml`;
  const PUBLICATION_LINE = '--overlay: an overlay is never publishable (plan-046 ruling 1)';

  /** Moves a pack of the tree into the overlay. */
  function movePack(tree: string, path: string): void {
    cpSync(join(tree, 'packs', path), join(tree, OVERLAY, 'packs', path), { recursive: true });
    rmSync(join(tree, 'packs', path), { recursive: true });
  }

  /** Writes an overlay composition. */
  function writeComposition(tree: string, id: string, body: string): void {
    mkdirSync(join(tree, OVERLAY, 'compositions', id), { recursive: true });
    writeFileSync(join(tree, OVERLAY, 'compositions', id, 'example.yaml'), body);
  }

  /** methodology/flow and its two examples move from the golden tree into the overlay. */
  function moveFlow(tree: string): void {
    movePack(tree, 'methodology/flow');
    for (const id of ['core-team', 'delivery-team']) {
      writeComposition(tree, id, readFileSync(join(tree, 'tests', 'fixtures', 'examples', 'flow',
        id, 'example.yaml'), 'utf8'));
    }
    rmSync(join(tree, 'tests', 'fixtures', 'examples', 'flow'), { recursive: true });
  }

  /** Section 7 of a README keeps the named examples, or the exemption line when none is left. */
  function keepExamples(readme: string, keep: string[]): void {
    const text = readFileSync(readme, 'utf8');
    const start = text.indexOf('## Examples\n');
    const end = text.indexOf('\n## ', start + 1);
    assert.ok(start >= 0 && end > start, readme);
    const parts = text.slice(start, end).split('\n### ').slice(1)
      .filter((part) => keep.includes(part.slice(0, part.indexOf('\n'))));
    const body = parts.length === 0 ? `\n${EXEMPTION}\n`
      : parts.map((part) => `\n### ${part.trimEnd()}\n`).join('');
    writeFileSync(readme, `${text.slice(0, start)}## Examples\n${body}${text.slice(end)}`);
  }

  /** The golden tree with no methodology: criterion 6's tree; the overlay holds kanban. */
  function withoutMethodology(tree: string): void {
    movePack(tree, 'methodology/kanban');
    rmSync(join(tree, 'packs', 'methodology'), { recursive: true });
    rmSync(join(tree, 'presets'), { recursive: true });
    replaceIn(join(tree, 'catalog.yaml'),
      'presets:\n  - { id: golden, path: presets/golden.yaml }\n', 'presets: []\n');
    writeComposition(tree, 'delivery-team', readFileSync(join(tree, 'tests', 'fixtures',
      'examples', 'software', 'delivery-team', 'example.yaml'), 'utf8'));
    const examples = join(tree, 'tests', 'fixtures', 'examples');
    for (const pack of ['agent-first', 'flow', 'kanban', 'lean', 'production', 'software',
      'web-service']) {
      rmSync(join(examples, pack), { recursive: true });
    }
    rmSync(join(examples, 'base', 'kanban-team'), { recursive: true });
    keepExamples(join(tree, 'packs', 'base', 'README.md'), ['core-only']);
    for (const pack of ['team-mode/agent-first', 'phase/inception/lean', 'stage/production',
      'software', 'blueprint/web-service']) {
      keepExamples(join(tree, 'packs', pack, 'README.md'), []);
    }
  }

  const treeLines = (result: ValidateResult): string[] => result.lines.filter((line) =>
    /^(schemas|lint|index):/.test(line)
    || (line.startsWith('composition ') && !line.startsWith(`composition ${OVERLAY}/`)));

  it('composes the overlay\'s compositions after the tree\'s, in id order, with their legs', () => {
    withTree(moveFlow, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      const composed = result.lines.filter((line) => line.startsWith('composition '));
      const labels = [CORE, `${CORE}[+software]`, DELIVERY, `${DELIVERY}[-software]`];
      assert.deepEqual(composed.slice(-4).map((line) => line.slice('composition '.length,
        line.indexOf(': '))), labels, result.lines.join('\n'));
      for (const line of composed.slice(-4)) assert.match(line, /: composed twice, /);
      // The golden preset and its eight examples left, then the overlay's four.
      assert.ok(result.lines.includes('compositions: 13'), result.lines.join('\n'));
      for (const label of labels) {
        assert.ok(result.lines.includes(
          `matrix ${label} wingfoil@0.3.0 workflow list: pass (self-test)`), label);
      }
      const index = result.lines.findIndex((line) => line.startsWith('index:'));
      const overlay = result.lines.findIndex((line) => line.startsWith('overlay: '));
      assert.ok(index >= 0 && overlay === index + 1, result.lines.join('\n'));
      assert.match(result.lines[overlay] ?? '', /^overlay: checked \d+ files, 0 problems$/);
    });
  });

  it('leaves the tree\'s lines as a run without the overlay has them', () => {
    withTree(moveFlow, (tree) => {
      const without = validate(['--tree', tree, ...NAME]);
      const withOverlay = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(without.code, 0, without.lines.join('\n'));
      assert.deepEqual(treeLines(withOverlay), treeLines(without));
    });
  });

  it('keeps the exemption line of a tree with no methodology, whose overlay holds one', () => {
    withTree(withoutMethodology, (tree) => {
      const without = validate(['--tree', tree, ...NAME]);
      assert.equal(without.code, 0, without.lines.join('\n'));
      assert.ok(without.lines.some((line) => /^lint: checked \d+ files, 0 problems$/.test(line)),
        without.lines.join('\n'));
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.deepEqual(treeLines(result), treeLines(without));
      assert.ok(result.lines.some((line) => line.startsWith(`composition ${DELIVERY}: composed `
        + 'twice, ')), result.lines.join('\n'));
    });
  });

  it('refuses an overlay in publication mode, before any check', () => {
    for (const argv of [['--overlay', OVERLAY], ['--overlay', 'missing', '--tree', TREE]]) {
      const result = validate(argv, { mode: 'publication' });
      assert.equal(result.code, 3);
      assert.deepEqual(result.lines, [PUBLICATION_LINE]);
    }
  });

  it('takes one overlay, under tests/fixtures/ and outside tests/fixtures/examples/', () => {
    withTree(moveFlow, (tree) => {
      const outside = mkdtempSync(join(tmpdir(), 'overlay-outside-'));
      try {
        mkdirSync(join(tree, 'elsewhere'));
        symlinkSync(outside, join(tree, 'tests', 'fixtures', 'link'));
        const usage: [string[], RegExp][] = [
          [['--overlay', OVERLAY, '--overlay', OVERLAY], /^--overlay is given more than once$/],
          [['--overlay', 'elsewhere'], /^--overlay elsewhere: not under tests\/fixtures\/$/],
          [['--overlay', 'tests/fixtures/examples/base'],
            /^--overlay tests\/fixtures\/examples\/base: under tests\/fixtures\/examples\//],
          [['--overlay', 'tests/fixtures/link'],
            /^--overlay tests\/fixtures\/link: not under tests\/fixtures\/$/],
        ];
        for (const [argv, line] of usage) {
          const result = validate(['--tree', tree, ...NAME, ...argv]);
          assert.equal(result.code, 3, `${argv.join(' ')}: ${result.lines.join('\n')}`);
          assert.match(result.lines.join('\n'), line);
        }
        const missing = validate(['--tree', tree, ...NAME, '--overlay', 'tests/fixtures/none']);
        assert.equal(missing.code, 2);
        assert.deepEqual(missing.lines, ['tests/fixtures/none: not a directory']);
        const absolute = validate(['--tree', tree, ...NAME, '--overlay', join(tree, OVERLAY)]);
        assert.equal(absolute.code, 0, absolute.lines.join('\n'));
      } finally {
        rmSync(outside, { recursive: true, force: true });
      }
    });
  });

  it('reports what the overlay\'s layout does not allow', () => {
    const cases: [(tree: string) => void, string][] = [
      [(tree) => writeFileSync(join(tree, OVERLAY, 'notes.md'), 'x\n'), `${OVERLAY}/notes.md`],
      [(tree) => writeFileSync(join(tree, OVERLAY, 'packs', 'stray.txt'), 'x\n'),
        `${OVERLAY}/packs/stray.txt`],
      [(tree) => writeFileSync(join(tree, OVERLAY, 'compositions', 'x.yaml'), 'x: 1\n'),
        `${OVERLAY}/compositions/x.yaml`],
      [(tree) => writeFileSync(join(tree, OVERLAY, 'compositions', 'core-team', 'extra.md'), 'x\n'),
        `${OVERLAY}/compositions/core-team/extra.md`],
      [(tree) => replaceIn(join(tree, CORE), 'id: core-team', 'id: other-team'), CORE],
      [(tree) => replaceIn(join(tree, CORE), 'packs:', 'profile: "a profile"\npacks:'), CORE],
    ];
    for (const [edit, named] of cases) {
      withTree((tree) => { moveFlow(tree); edit(tree); }, (tree) => {
        const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
        assert.equal(result.code, 1, `${named}: ${result.lines.join('\n')}`);
        assert.ok(result.lines.some((line) => line.startsWith(named)), `${named}: `
          + result.lines.join('\n'));
      });
    }
  });

  it('never lets an overlay pack shadow a pack of the tree', () => {
    withTree((tree) => {
      moveFlow(tree);
      cpSync(join(tree, 'packs', 'methodology', 'kanban'),
        join(tree, OVERLAY, 'packs', 'methodology', 'kanban'), { recursive: true });
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) => line.startsWith(`${OVERLAY}/packs/methodology/kanban`)
        && line.includes(' packs/methodology/kanban')), result.lines.join('\n'));
    });
  });

  it('reports an overlay pack no composition reaches, and an overlay with no composition', () => {
    withTree((tree) => {
      moveFlow(tree);
      rmSync(join(tree, OVERLAY, 'compositions', 'delivery-team'), { recursive: true });
      replaceIn(join(tree, CORE), 'methodology/flow@^1', 'base@^1');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) => line.startsWith(`${OVERLAY}/packs/methodology/flow`)
        && line.includes('no overlay composition reaches it')), result.lines.join('\n'));
    });
    withTree((tree) => {
      moveFlow(tree);
      rmSync(join(tree, OVERLAY, 'compositions'), { recursive: true });
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.includes('overlay: no composition'), result.lines.join('\n'));
    });
  });

  it('checks the overlay compositions\' values and skips the ones it reports', () => {
    const cases: [string, string][] = [
      ['an undeclared parameter', 'parameters:\n  no_such_parameter: "x"\n'],
      ['a value of the wrong YAML type', 'parameters:\n  wip_limit: "3"\n'],
    ];
    for (const [what, parameters] of cases) {
      withTree((tree) => {
        moveFlow(tree);
        // kanban stays in the tree: an overlay composition may name the tree's packs.
        writeComposition(tree, 'core-team', 'format: 1\nid: core-team\ntitle: "Core team"\n'
          + 'description: "A fictional team on a board."\npacks:\n  - methodology/kanban@^1\n'
          + parameters);
      }, (tree) => {
        const result = validate(['--tree', tree, ...NAME, '--param', 'unknown_name=1',
          '--overlay', OVERLAY]);
        assert.equal(result.code, 1, `${what}: ${result.lines.join('\n')}`);
        assert.ok(result.lines.some((line) => line.startsWith(`${CORE}:`)), what);
        assert.ok(result.lines.some((line) => line.startsWith(`composition ${CORE}: skipped, `)),
          `${what}: ${result.lines.join('\n')}`);
        assert.ok(result.lines.includes(`matrix ${CORE}: skipped`), what);
        assert.ok(!result.lines.some((line) => line.startsWith('--param unknown_name')),
          `${what}: the --param names stay unjudged`);
      });
    }
  });

  it('runs the secret rules over the overlay\'s files', () => {
    withTree((tree) => {
      moveFlow(tree);
      writeFileSync(join(tree, OVERLAY, 'packs', 'methodology', 'flow', 'CHANGELOG.md'),
        `# Changelog\n\nkey: ${['AK', 'IA', 'ABCDEFGH23456789'].join('')}\n`);
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) =>
        line.startsWith(`${OVERLAY}/packs/methodology/flow/CHANGELOG.md`)),
      result.lines.join('\n'));
    });
  });

  it('names an overlay pack by its path in the tree, never the temporary tree\'s', () => {
    withTree((tree) => {
      moveFlow(tree);
      writeFileSync(join(tree, OVERLAY, 'packs', 'methodology', 'flow', 'workflows',
        'flow-board.yaml'), 'format: 1\nname: [flow-board\n');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) => line.startsWith(`composition ${CORE}: `)
        && line.includes(`${OVERLAY}/packs/methodology/flow`)), result.lines.join('\n'));
      assert.ok(!result.lines.some((line) => line.includes(tmpdir()) && !line.includes(tree)),
        result.lines.join('\n'));
    });
  });

  it('reports a schema failure of an overlay pack.yaml or example.yaml, and skips it', () => {
    const cases: [(tree: string) => void, string][] = [
      [(tree) => replaceIn(join(tree, OVERLAY, 'packs', 'methodology', 'flow', 'pack.yaml'),
        'version: 1.0.0', 'version: 1.0.0\nbogus: 1'),
      `${OVERLAY}/packs/methodology/flow/pack.yaml:`],
      [(tree) => replaceIn(join(tree, CORE), 'title: "Core team"\n', ''), `${CORE}:`],
    ];
    for (const [edit, named] of cases) {
      withTree((tree) => { moveFlow(tree); edit(tree); }, (tree) => {
        const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
        assert.equal(result.code, 1, `${named} ${result.lines.join('\n')}`);
        assert.ok(result.lines.some((line) => line.startsWith(named)
          && line.includes(': schema: ')), `${named} ${result.lines.join('\n')}`);
      });
    }
    withTree((tree) => {
      moveFlow(tree);
      replaceIn(join(tree, CORE), 'title: "Core team"\n', '');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.ok(result.lines.some((line) => line.startsWith(`composition ${CORE}: skipped, `)),
        result.lines.join('\n'));
    });
  });

  it('applies --param to the overlay compositions as to an example', () => {
    withTree((tree) => {
      moveFlow(tree);
      replaceIn(join(tree, CORE), 'packs:', 'parameters:\n  project_name: "Core"\npacks:');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.includes(`composition ${CORE}: --param project_name overrides the `
        + 'value the preset sets'), result.lines.join('\n'));
    });
    withTree((tree) => {
      moveFlow(tree);
      replaceIn(join(tree, OVERLAY, 'packs', 'methodology', 'flow', 'pack.yaml'), 'contents:',
        'parameters:\n  board_name: { type: string, default: "Board", description: "The board" }\n'
        + 'contents:');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--param', 'board_name=Main',
        '--overlay', OVERLAY]);
      assert.ok(!result.lines.some((line) => line.startsWith('--param board_name')),
        result.lines.join('\n'));
    });
  });

  // Catalog pack ids do not nest, so an overlay pack around a tree's pack fails its layout first.
  it('refuses an overlay pack that would hold a pack of the tree', () => {
    withTree((tree) => {
      moveFlow(tree);
      cpSync(join(tree, OVERLAY, 'packs', 'methodology', 'flow'),
        join(tree, OVERLAY, 'packs', 'phase', 'inception'), { recursive: true });
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) =>
        line.startsWith(`${OVERLAY}/packs/phase/inception/pack.yaml: layout: `)
        && line.includes('phase/inception is not a catalog pack id')), result.lines.join('\n'));
    });
  });

  it('counts only the overlay\'s compositions as reaching its packs, not given entries', () => {
    withTree((tree) => {
      moveFlow(tree);
      rmSync(join(tree, OVERLAY, 'compositions', 'delivery-team'), { recursive: true });
      replaceIn(join(tree, CORE), 'methodology/flow@^1', 'base@^1');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY,
        'methodology/flow']);
      assert.ok(result.lines.some((line) => line.startsWith(`${OVERLAY}/packs/methodology/flow`)
        && line.includes('no overlay composition reaches it')), result.lines.join('\n'));
    });
  });

  it('is refused by npm run validate:publication, with or without --evidence', () => {
    const cli = join(REPO_ROOT, 'dist', 'src', 'validate-publication-cli.js');
    for (const extra of [[], ['--evidence']]) {
      const result = spawnSync(process.execPath, [cli, '--tree', TREE, '--overlay', OVERLAY,
        ...extra], { encoding: 'utf8' });
      assert.equal(result.status, 3, result.stderr);
      assert.equal(result.stdout, `${PUBLICATION_LINE}\n`);
    }
  });

  it('maps an overlay pack\'s paths to the overlay, and no other pack\'s', () => {
    const overlay = { merged: '/tmp/m/tree', rel: OVERLAY, packs: ['methodology/flow'] };
    assert.equal(mapOverlayPaths('/tmp/m/tree/packs/methodology/flow/a.yaml: x; '
      + '/tmp/m/tree/packs/methodology/flow-x/b.yaml: y', '/repo', overlay),
    `/repo/${OVERLAY}/packs/methodology/flow/a.yaml: x; /repo/packs/methodology/flow-x/b.yaml: y`);
    assert.equal(mapOverlayPaths('see packs/methodology/flow. And packs/methodology/flow-x.',
      '/repo', overlay),
    `see ${OVERLAY}/packs/methodology/flow. And packs/methodology/flow-x.`);
  });

  it('leaves --overlay to validate alone: publish:pack, index and site refuse it', () => {
    assert.equal(runPublish(['--pack', 'base', '--overlay', OVERLAY]).code, 3);
    assert.equal(runIndex(['--overlay', OVERLAY]).code, 3);
    assert.equal(runSite(['--overlay', OVERLAY]).code, 3);
  });
});
