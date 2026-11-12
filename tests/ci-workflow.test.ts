import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { describe, it } from 'node:test';

import { loadYamlFile } from '../src/yaml-load';
import { REPO_ROOT } from './support/paths';

type Doc = Record<string, unknown>;

interface Step {
  name?: string;
  uses?: string;
  run?: string;
  if?: string;
  with?: Doc;
  env?: Doc;
}

const FILE = '.github/workflows/ci.yml';
const workflow = loadYamlFile(join(REPO_ROOT, FILE), FILE).data as Doc;
const jobs = workflow['jobs'] as Record<string, Doc>;
const [job] = Object.values(jobs);
assert.ok(job !== undefined, 'one job');
const steps = job['steps'] as Step[];

/** Every check but the shard's tests runs once per Node.js version, in shard 1 (task-089). */
const SHARD_ONE = 'matrix.shard == 1';

function stepRunning(command: string): Step | undefined {
  return steps.find((step) => step.run?.split('\n').some((line) => line.trim() === command));
}

describe('the CI workflow (task-013)', () => {
  it('runs on every pushed branch, on release tags and on pull requests (F3.6, no PR in the flow)',
    () => {
      const on = workflow['on'] as Doc;
      assert.deepEqual(on['push'], { branches: ['**'], tags: ['**@*'] },
        '`*` does not match `/`, and pack ids such as methodology/kanban contain one');
      assert.equal(on['pull_request'], null, 'pull_request on any branch, with no filter');
      assert.ok(!Object.hasOwn(on, 'pull_request_target'), 'never pull_request_target');
    });

  it('reads the repository and nothing more', () => {
    assert.deepEqual(workflow['permissions'], { 'contents': 'read' });
    assert.ok(!JSON.stringify(workflow).includes('secrets.'), 'no secret is read');
  });

  it('cancels a superseded branch run, never a tag run', () => {
    assert.deepEqual(workflow['concurrency'], {
      group: 'ci-${{ github.ref }}',
      'cancel-in-progress': '${{ github.ref_type != \'tag\' }}',
    });
  });

  it('runs on a pinned runner, on the Node.js floor and the newest 22.x, with a timeout', () => {
    assert.equal(job['runs-on'], 'ubuntu-24.04');
    assert.deepEqual((job['strategy'] as Doc)['matrix'],
      { node: ['22.12.0', '22.21.0'], shard: [1, 2] }, 'two shards per version (task-089)');
    assert.equal(typeof job['timeout-minutes'], 'number');
  });

  it('pins every action to a full commit SHA', () => {
    const actions = steps.filter((step) => step.uses !== undefined);
    assert.ok(actions.length >= 3);
    for (const step of actions) {
      assert.match(step.uses ?? '', /^[a-z0-9-]+\/[a-z0-9-]+@[0-9a-f]{40}$/, step.uses);
    }
  });

  it('checks out every tag and the full history, without persisting credentials (spec-002 §3.1)',
    () => {
      const checkout = steps.find((step) => step.uses?.startsWith('actions/checkout@'));
      assert.deepEqual(checkout?.with, { 'fetch-depth': 0, 'fetch-tags': true,
        'persist-credentials': false });
      const node = steps.find((step) => step.uses?.startsWith('actions/setup-node@'));
      assert.deepEqual(node?.with, { 'node-version': '${{ matrix.node }}', 'check-latest': false });
    });

  it('caches the matrix releases by runner, Node.js version and the release lockfiles', () => {
    const cache = steps.find((step) => step.uses?.startsWith('actions/cache@'));
    assert.equal(cache?.with?.['path'], '.cache/wingfoil-matrix');
    assert.equal(cache?.if, SHARD_ONE, 'only shard 1 runs the matrix (task-089)');
    const key = String(cache?.with?.['key']);
    for (const part of ['runner.os', 'matrix.node',
      "hashFiles('src/matrix/wingfoil-*/package-lock.json')"]) {
      assert.ok(key.includes(part), `${part} in ${key}`);
    }
  });

  it('runs install, build and the shard\'s tests in every job (task-089)', () => {
    for (const command of ['npm ci', 'npm run build']) {
      const step = stepRunning(command);
      assert.ok(step !== undefined, command);
      assert.equal(step.if, undefined, `${command} runs in every job`);
    }
    const test = stepRunning('npm run test:shard');
    assert.ok(test !== undefined, 'the shard\'s tests');
    assert.equal(test.if, undefined, 'the shard\'s tests run in every job');
    assert.deepEqual(test.env, { SHARD: '${{ matrix.shard }}' });
    assert.equal(stepRunning('npm test'), undefined, 'the whole suite runs in no job');
  });

  it('runs every other check in shard 1 only, on every path (task-089)', () => {
    for (const command of ['npm run lint', 'npm run check:pins', 'npm run check:schemas',
      'npm run check:packs', 'npm audit --omit=dev',
      'npm run site -- --out "$RUNNER_TEMP/site"']) {
      const step = stepRunning(command);
      assert.ok(step !== undefined, command);
      assert.equal(step.if, SHARD_ONE, `${command} in shard 1, on every path`);
    }
    const matrixAudit = steps.find((step) => step.run?.includes('src/matrix/'));
    assert.equal(matrixAudit?.run,
      'for dir in src/matrix/wingfoil-*/; do\n  (cd "$dir" && npm audit)\ndone\n',
      'npm audit in every release folder, a failure failing the step');
    assert.equal(matrixAudit?.if, SHARD_ONE);
    const everyJob = new Set(['npm ci', 'npm run build', 'npm run test:shard']);
    for (const step of steps) {
      if (step.uses !== undefined && !step.uses.startsWith('actions/cache@')) continue;
      if (step.run !== undefined && everyJob.has(step.run.trim())) continue;
      assert.ok(step.if === SHARD_ONE || step.if?.startsWith(`${SHARD_ONE} && `),
        `${step.name ?? step.run ?? step.uses} in shard 1 only`);
    }
    assert.ok(steps.every((step) => !Object.hasOwn(step, 'continue-on-error')));
  });

  it('runs self-test mode on branches and publication mode on tags, never both (dl-009)', () => {
    const branch = `${SHARD_ONE} && github.ref_type != 'tag'`;
    const tag = `${SHARD_ONE} && github.ref_type == 'tag'`;
    for (const command of ['npm run validate',
      'npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden',
      'npm run validate -- --overlay tests/fixtures/software-exit',
      'npm run validate -- --overlay tests/fixtures/scrum-exit',
      'npm run validate -- --overlay tests/fixtures/kanban-exit', 'npm run check:runs']) {
      assert.equal(stepRunning(command)?.if, branch, command);
    }
    assert.equal(stepRunning('npm run validate:publication')?.if, tag);
    const onTag = steps.filter((step) => step.if === tag);
    assert.ok(onTag.every((step) => !/npm run validate(\s|$)/.test(step.run ?? '')),
      'no self-test step on the tag path');
  });

  it('runs the packs\' workflows on WingFoil after the overlay (task-053)', () => {
    const runs = stepRunning('npm run check:runs');
    const overlay = stepRunning('npm run validate -- --overlay tests/fixtures/software-exit');
    assert.ok(runs !== undefined && overlay !== undefined);
    assert.ok(steps.indexOf(runs) > steps.indexOf(overlay), 'after the overlay step');
  });

  it('validates kanban-exit after scrum-exit and before the runs (task-068)', () => {
    const [scrum, kanban, runs] = ['npm run validate -- --overlay tests/fixtures/scrum-exit',
      'npm run validate -- --overlay tests/fixtures/kanban-exit', 'npm run check:runs']
      .map((command) => {
        const step = stepRunning(command);
        assert.ok(step !== undefined, command);
        return steps.indexOf(step);
      });
    assert.ok(scrum !== undefined && kanban !== undefined && runs !== undefined);
    assert.ok(scrum < kanban && kanban < runs, `${scrum} < ${kanban} < ${runs}`);
  });

  it('audits the root\'s runtime tree as a gate, and the whole tree only to warn (dl-035)', () => {
    const blocking = steps.find((step) => step.name === 'Audit the root lockfile');
    assert.equal(blocking?.run?.trim(), 'npm audit --omit=dev', 'the gate on the runtime tree');
    assert.equal(blocking?.if, SHARD_ONE, 'on branches and tags, in shard 1 (task-089)');
    const warning = steps.find((step) => step.name === WARNING_STEP);
    assert.ok(warning !== undefined, WARNING_STEP);
    assert.equal(steps.indexOf(warning), steps.indexOf(blocking) + 1, 'right after the gate');
    assert.equal(warning.if, SHARD_ONE, 'on branches and tags, in shard 1 (task-089)');
    assert.ok(!Object.hasOwn(warning, 'continue-on-error'));
  });
});

const WARNING_STEP = 'Audit the whole root tree, warning only (dl-035)';

interface AuditRun { status: number | null; warnings: string[]; args: string }

/** Runs the warning step's script under `bash -e`, as GitHub does, with a stub `npm` first on the
 * PATH that prints `output` and exits with `code`. */
function runWarningStep(output: string, code: number): AuditRun {
  const run = steps.find((step) => step.name === WARNING_STEP)?.run;
  assert.ok(run !== undefined, WARNING_STEP);
  const dir = mkdtempSync(join(tmpdir(), 'ci-audit-'));
  try {
    const bin = join(dir, 'bin');
    const runnerTemp = join(dir, 'runner-temp');
    mkdirSync(bin);
    mkdirSync(runnerTemp);
    writeFileSync(join(dir, 'output'), output);
    const stub = join(bin, 'npm');
    writeFileSync(stub, ['#!/usr/bin/env bash', `printf '%s' "$*" > '${join(dir, 'args')}'`,
      `cat '${join(dir, 'output')}'`, `exit ${code}`, ''].join('\n'));
    chmodSync(stub, 0o755);
    const result = spawnSync('bash', ['-e', '-c', run], {
      encoding: 'utf8',
      env: { ...process.env, PATH: `${bin}${delimiter}${process.env['PATH'] ?? ''}`,
        RUNNER_TEMP: runnerTemp },
    });
    const warnings = result.stdout.split('\n').filter((line) => line.startsWith('::warning'));
    return { status: result.status, warnings, args: readFileSync(join(dir, 'args'), 'utf8') };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const REPORT = JSON.stringify({
  auditReportVersion: 2,
  vulnerabilities: {
    minimatch: { name: 'minimatch', severity: 'moderate', isDirect: false, via: [], range: '<11' },
    eslint: { name: 'eslint', severity: 'high', isDirect: true, via: ['minimatch'], range: '*' },
  },
  metadata: { vulnerabilities: { moderate: 1, high: 1, total: 2 } },
});

describe('the whole root tree\'s audit step (dl-035 A1, plan-062 ruling 3)', () => {
  it('names every advisory in one warning and exits 0', () => {
    const run = runWarningStep(REPORT, 1);
    assert.equal(run.status, 0);
    assert.equal(run.args, 'audit --json', 'the whole tree, no --omit');
    assert.equal(run.warnings.length, 1, run.warnings.join('\n'));
    for (const part of ['minimatch (moderate)', 'eslint (high)', 'dl-035']) {
      assert.ok(run.warnings[0]?.includes(part), `${part} in ${run.warnings[0]}`);
    }
  });

  const noReport: [string, string][] = [
    ['an error object', JSON.stringify({ error: { code: 'ENOTFOUND',
      summary: 'request to the registry failed' } })],
    ['no output', ''],
  ];
  for (const [what, output] of noReport) {
    it(`warns that the audit could not run on ${what}, and exits 0`, () => {
      const run = runWarningStep(output, 1);
      assert.equal(run.status, 0);
      assert.equal(run.args, 'audit --json');
      assert.equal(run.warnings.length, 1, run.warnings.join('\n'));
      assert.match(run.warnings[0] ?? '', /could not run/);
    });
  }

  it('writes no warning when the audit is clean', () => {
    const run = runWarningStep(JSON.stringify({ auditReportVersion: 2, vulnerabilities: {} }), 0);
    assert.equal(run.status, 0);
    assert.equal(run.args, 'audit --json');
    assert.deepEqual(run.warnings, []);
  });
});

describe('the shard script (task-089)', () => {
  const scripts = (JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8')) as
    { scripts: Record<string, string> }).scripts;
  const GLOB = '"dist/tests/**/*.test.js"';

  it('keeps npm test the whole suite, built first', () => {
    assert.equal(scripts['test'], `npm run build && node --test ${GLOB}`);
  });

  it('runs one shard of the same files, the option before the glob, without a build', () => {
    assert.equal(scripts['test:shard'], `node --test --test-shard=$SHARD/2 ${GLOB}`,
      'node --test ignores an option after the glob');
  });
});
