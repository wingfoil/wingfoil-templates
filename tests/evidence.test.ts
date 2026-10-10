import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { EvidenceError, writeEvidence } from '../src/evidence';
import type { ValidateResult } from '../src/validate';
import { REPO_ROOT } from './support/paths';

const COMMIT = '0123456789abcdef0123456789abcdef01234567';
const COMMAND = 'npm run validate:publication -- --evidence';

const PASSED: ValidateResult = {
  code: 0,
  mode: 'publication',
  tolerated: [],
  lines: [
    'schemas: checked 9 files, 0 problems',
    'lint: checked 48 files, 0 problems',
    'composition presets/golden.yaml: composed twice, 18 files, byte-identical',
    'compositions: 1',
    'matrix presets/golden.yaml wingfoil@9.0.0 workflow list: pass (publication)',
    'matrix presets/golden.yaml wingfoil@9.0.0 dna show: pass (publication)',
    'matrix presets/golden.yaml wingfoil@9.0.0 directives list: pass (publication)',
    'matrix: publication, 1 run, 0 failed, tolerance applied: none',
  ],
};

describe('writeEvidence (F5.1, dl-009)', () => {
  it('writes the Validation section of a publication run that passed', () => {
    const section = writeEvidence(PASSED, { commit: COMMIT, command: COMMAND });
    assert.ok(section.startsWith('## Validation\n'), section);
    for (const expected of [`Commit: \`${COMMIT}\``, `Command: \`${COMMAND}\``,
      'Mode: publication', 'Exit code: 0', 'WingFoil releases: 9.0.0',
      'Compositions: presets/golden.yaml',
      'matrix presets/golden.yaml wingfoil@9.0.0 dna show: pass (publication)']) {
      assert.ok(section.includes(expected), `${expected} in\n${section}`);
    }
  });

  it('refuses a self-test result', () => {
    assert.throws(() => writeEvidence({ ...PASSED, mode: 'self-test' },
      { commit: COMMIT, command: COMMAND }), EvidenceError);
  });

  it('refuses a result that applied a tolerance', () => {
    assert.throws(() => writeEvidence({ ...PASSED, tolerated: ['0.2.2'] },
      { commit: COMMIT, command: COMMAND }), EvidenceError);
  });

  it('refuses a run that failed', () => {
    assert.throws(() => writeEvidence({ ...PASSED, code: 1 }, { commit: COMMIT, command: COMMAND }),
      EvidenceError);
  });
});

describe('npm run validate:publication -- --evidence', () => {
  it('writes no evidence for a publication run that fails, and exits 1', () => {
    const run = spawnSync(process.execPath,
      [join(REPO_ROOT, 'dist', 'src', 'validate-publication-cli.js'), '--evidence'],
      { cwd: REPO_ROOT, encoding: 'utf8' });
    assert.equal(run.status, 1, run.stdout + run.stderr);
    assert.ok(!run.stdout.includes('## Validation'), run.stdout);
    assert.match(run.stderr, /no evidence/);
  });

  it('is not an option of npm run validate (self-test)', () => {
    const run = spawnSync(process.execPath,
      [join(REPO_ROOT, 'dist', 'src', 'validate-cli.js'), '--evidence'],
      { cwd: REPO_ROOT, encoding: 'utf8' });
    assert.equal(run.status, 3, run.stdout + run.stderr);
  });
});
