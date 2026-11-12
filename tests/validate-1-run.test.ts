// Split from tests/validate.test.ts (task-089); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { MatrixIoError } from '../src/matrix';

import { FROZEN_COMPAT } from './support/published-repo';
import { StubWingfoil } from './support/stub-wingfoil';
import {
  TREE, NAME, GOLDEN_LEGS, stubbed, stubbedClean, NEWEST, byRelease, validate, withTree, replaceIn,
} from './support/validate-harness';

describe('npm run validate', () => {
  it('composes the golden preset twice into byte-identical files (W5 exit criterion)', () => {
    const result = validate(['--tree', TREE, ...NAME]);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.ok(result.lines.some((line) => /^schemas: checked 11 files, 0 problems$/.test(line)),
      result.lines.join('\n'));
    assert.ok(result.lines.some((line) =>
      /^composition presets\/golden\.yaml: composed twice, 20 files, byte-identical$/.test(line)),
    result.lines.join('\n'));
    // The golden preset, the ten examples of its packs, and flow's two other legs (task-032).
    assert.ok(result.lines.includes('compositions: 13'));
  });

  it('runs the golden preset against wingfoil@0.2.2 and the newest release in self-test mode, the '
    + 'oldest and the newest (task-036, task-059, task-074, task-079)',
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
            `matrix ${label} wingfoil@${NEWEST} ${command}: pass (self-test)`)]),
        'matrix: self-test, 26 runs, 0 failed, tolerance applied: 0.2.2',
      ]);
      assert.equal(result.mode, 'self-test');
      assert.deepEqual(result.tolerated, ['0.2.2']);
    });

  it('fails a warning diagnostic of the newest release on its runs only, 0.2.2 tolerated '
    + '(task-036, task-059, task-074, task-079)', () => {
      const warned = stubbedClean(NEWEST, [{ code: 'W_SAMPLE', severity: 'warning', file: 'f',
        path: 'p', message: 'sample' }]);
      try {
        const result = validate(['--tree', TREE, ...NAME],
          { install: byRelease({ [NEWEST]: warned }) });
        assert.equal(result.code, 1, result.lines.join('\n'));
        assert.ok(result.lines.some((line) => line.startsWith(
          `matrix presets/golden.yaml wingfoil@${NEWEST} workflow list: fail (self-test)`)),
        result.lines.join('\n'));
        assert.ok(result.lines.includes(
          'matrix: self-test, 26 runs, 13 failed, tolerance applied: 0.2.2'),
        result.lines.join('\n'));
      } finally {
        warned.dispose();
      }
    });

  it('in publication mode, runs the golden preset against 0.3.0 and the newest release (dl-009, '
    + 'task-036, task-059, task-074, task-079)', () => {
    const result = validate(['--tree', TREE, ...NAME], { mode: 'publication' });
    assert.equal(result.code, 0, result.lines.join('\n'));
    const matrix = result.lines.filter((line) => line.startsWith('matrix'));
    assert.ok(matrix.every((line) => !line.includes('wingfoil@0.2.2')), matrix.join('\n'));
    for (const version of ['0.3.0', NEWEST]) {
      assert.ok(matrix.includes(
        `matrix presets/golden.yaml wingfoil@${version} workflow list: pass (publication)`),
      matrix.join('\n'));
    }
    assert.ok(result.lines.includes(
      'matrix: publication, 26 runs, 0 failed, tolerance applied: none'), result.lines.join('\n'));
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
      const result = validate(['--tree', TREE, ...NAME],
        { install: byRelease({ '0.2.2': noisy }) });
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
    assert.ok(result.lines.some((line) => line.includes(`wingfoil@${NEWEST}: npm ci failed`)),
      result.lines.join('\n'));
    assert.ok(result.lines.includes(
      'matrix: self-test, 26 runs, 26 failed, tolerance applied: none'),
    result.lines.join('\n'));
  });

  it('seeds the built-in directive files it is given into every run (bug-010, task-075)', () => {
    const seed = mkdtempSync(join(tmpdir(), 'seed-'));
    writeFileSync(join(seed, 'security.md'), 'seeded\n');
    const checkers = new Map<string, StubWingfoil>();
    const checker = (version: string): StubWingfoil => {
      let stub = checkers.get(version);
      if (stub === undefined) {
        stub = new StubWingfoil({}, version);
        writeFileSync(stub.cli, [
          "const { execFileSync } = require('node:child_process');",
          `if (process.argv[2] === '--version') { process.stdout.write('${version}\\n'); return; }`,
          'let shown = null;',
          'try { shown = execFileSync(\'git\', [\'show\',',
          "  'HEAD:.wingfoil/directives/built-in/security.md'], { encoding: 'utf8' }); }",
          'catch { shown = null; }',
          "process.exitCode = shown === 'seeded\\n' ? 0 : 1;",
          '',
        ].join('\n'));
        checkers.set(version, stub);
      }
      return stub;
    };
    try {
      const result = validate(['--tree', TREE, ...NAME], {
        install: (version) => checker(version).cli, builtins: () => seed });
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(result.lines.includes(
        'matrix: self-test, 26 runs, 0 failed, tolerance applied: none'),
      result.lines.join('\n'));
    } finally {
      for (const stub of checkers.values()) stub.dispose();
      rmSync(seed, { recursive: true, force: true });
    }
  });

  it('makes a release whose built-in directives cannot be read an I/O failure (bug-010, '
    + 'task-075)', () => {
    const result = validate(['--tree', TREE, ...NAME], { builtins: (version) => {
      if (version === '0.2.2') throw new MatrixIoError('wingfoil@0.2.2: init exit 1: x');
      return undefined;
    } });
    assert.equal(result.code, 2, result.lines.join('\n'));
    assert.ok(result.lines.some((line) => /wingfoil@0\.2\.2: init exit 1: x/.test(line)),
      result.lines.join('\n'));
    assert.ok(result.lines.includes(
      'matrix: self-test, 26 runs, 13 failed, tolerance applied: none'),
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
    assert.equal(result.lines[1], 'lint: checked 71 files, 0 problems', result.lines.join('\n'));
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
});
