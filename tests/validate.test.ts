import { strict as assert } from 'node:assert';
import { chmodSync, cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { after, describe, it } from 'node:test';

import { MatrixIoError } from '../src/matrix';
import { runValidate } from '../src/validate';
import type { ValidateOptions, ValidateResult } from '../src/validate';
import { FIXTURES, REPO_ROOT } from './support/paths';
import { FORMAT_WARNING, StubWingfoil } from './support/stub-wingfoil';
import type { StubCommand } from './support/stub-wingfoil';

const TREE = join(FIXTURES, 'compose', 'tree');
const ENTRIES = ['methodology/kanban', 'phase/inception/lean', 'blueprint/web-service',
  'team-mode/agent-first', 'stage/production'];
const NAME = ['--param', 'project_name=Golden'];

/** WingFoil 0.2.2 as the tests see it: exit 0, one format warning per command (W-01). */
function stubbed(command: StubCommand): StubWingfoil {
  return new StubWingfoil({ commands: Object.fromEntries(
    ['workflow list', 'dna show', 'directives list'].map((line) => [line, command])) });
}
const WINGFOIL = stubbed({ stderr: [FORMAT_WARNING] });
after(() => WINGFOIL.dispose());

/** `validate` never installs a release in the tests: the stub stands for every release. */
function validate(argv: string[], options: Partial<ValidateOptions> = {}): ValidateResult {
  return runValidate(argv, { mode: 'self-test', install: () => WINGFOIL.cli, ...options });
}

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
    const result = validate(['--tree', TREE, ...NAME]);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.ok(result.lines.some((line) => /^schemas: checked 9 files, 0 problems$/.test(line)),
      result.lines.join('\n'));
    assert.ok(result.lines.some((line) =>
      /^composition presets\/golden\.yaml: composed twice, 18 files, byte-identical$/.test(line)),
    result.lines.join('\n'));
    assert.ok(result.lines.includes('compositions: 1'));
  });

  it('runs the golden preset against wingfoil@0.2.2 in self-test mode, reporting the tolerance',
    () => {
      const result = validate(['--tree', TREE, ...NAME]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.deepEqual(result.lines.filter((line) => line.startsWith('matrix')), [
        'matrix presets/golden.yaml wingfoil@0.2.2 workflow list: pass (self-test, tolerated 1)',
        'matrix presets/golden.yaml wingfoil@0.2.2 dna show: pass (self-test, tolerated 1)',
        'matrix presets/golden.yaml wingfoil@0.2.2 directives list: pass (self-test, tolerated 1)',
        'matrix: self-test, 1 run, 0 failed, tolerance applied: 0.2.2',
      ]);
      assert.equal(result.mode, 'self-test');
      assert.deepEqual(result.tolerated, ['0.2.2']);
    });

  it('in publication mode, finds no compatible release for the golden preset (dl-009)', () => {
    const result = validate(['--tree', TREE, ...NAME], { mode: 'publication' });
    assert.equal(result.code, 1, result.lines.join('\n'));
    assert.ok(result.lines.includes(
      'matrix presets/golden.yaml: no compatible release (publication)'), result.lines.join('\n'));
    assert.ok(result.lines.includes('matrix: publication, 0 runs, 0 failed, tolerance applied: none'));
    assert.equal(result.mode, 'publication');
    assert.deepEqual(result.tolerated, []);
  });

  it('fails a composition that fails the matrix, naming release and command', () => {
    const noisy = stubbed({ stderr: ['Warning: something else'] });
    try {
      const result = validate(['--tree', TREE, ...NAME], { install: () => noisy.cli });
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => line.startsWith(
        'matrix presets/golden.yaml wingfoil@0.2.2 workflow list: fail (self-test)')),
      result.lines.join('\n'));
      assert.ok(result.lines.includes('matrix: self-test, 1 run, 1 failed, tolerance applied: none'));
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
    assert.ok(result.lines.includes('matrix: self-test, 1 run, 1 failed, tolerance applied: none'));
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
    assert.equal(result.lines[1], 'lint: checked 48 files, 0 problems', result.lines.join('\n'));
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
    assert.ok(entries.lines.includes('compositions: 2'));
    assert.ok(entries.lines.some((line) => line.startsWith('composition entries: composed twice')));
  });

  it('validates this repository: two files, no composition, no matrix run', () => {
    const result = validate(['--tree', REPO_ROOT]);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.ok(result.lines.includes('schemas: checked 2 files, 0 problems'));
    assert.ok(result.lines.includes('lint: checked 2 files, 0 problems'));
    assert.ok(result.lines.includes('compositions: 0'));
    assert.ok(result.lines.includes('matrix: self-test, 0 runs, 0 failed, tolerance applied: none'));
  });

  it('fails a publication run of this repository: it runs nothing', () => {
    const result = validate(['--tree', REPO_ROOT], { mode: 'publication' });
    assert.equal(result.code, 1, result.lines.join('\n'));
    assert.ok(result.lines.some((line) => /no composition/.test(line)), result.lines.join('\n'));
  });

  it('exits 1 on a schema error, and does not compose the failing preset', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'format: 1', 'format: 2'),
      (tree) => {
        const result = validate(['--tree', tree, ...NAME]);
        assert.equal(result.code, 1);
        assert.ok(result.lines.some((line) => line.startsWith('presets/golden.yaml:')));
        assert.ok(result.lines.includes('compositions: 0'));
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
      assert.ok(result.lines.includes('compositions: 2'));
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
