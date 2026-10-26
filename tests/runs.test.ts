// task-053 (plan-049): the scripted run of a pack's workflows on a real WingFoil release. These
// tests stand a fake WingFoil and a fake composer in for the real ones: the real release runs only
// in `npm run check:runs` and the CI.
import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import {
  existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { MatrixIoError } from '../src/matrix';
import { runRuns } from '../src/runs';
import type { Compose, Exec, RunsOptions, WingfoilOutput } from '../src/runs';

const SCENARIO = [
  'format: 1',
  'compositions: compositions',
  'identities:',
  '  agent: { name: "Runs Agent", email: "agent@runs.invalid" }',
  'runs:',
  '  - main: decision-log-ingest',
  '    steps: [start]',
  '  - main: retrospective-periodic',
  '    steps:',
  '      - start',
  '      - commit_inside: retrospective_path',
  '      - next: retrospective.additional-points',
  '  - main: governance-evolution',
  '    steps:',
  '      - start',
  '      - finalize: governance-evolution.assess',
  '      - add: { type: decision-log, title: "Change who approves", '
    + 'step: governance-evolution.propose }',
  '      - submit: added',
  '      - approve: added',
  '      - commit_copy: { from: AGENTS.region.md, to: AGENTS.md }',
  '      - end',
  '',
].join('\n');

interface Call {
  args: string[];
  email: string;
}

function ok(stdout: unknown = {}): WingfoilOutput {
  return { status: 0, stdout: JSON.stringify(stdout), stderr: '' };
}

function failed(message: string): WingfoilOutput {
  return { status: 1, stdout: '', stderr: `error: ${message}\n` };
}

function gitEmail(cwd: string, env: NodeJS.ProcessEnv): string {
  return execFileSync('git', ['-C', cwd, 'config', 'user.email'], { env, encoding: 'utf8' })
    .trim();
}

/**
 * A fake WingFoil 0.3.0: `workflow start` writes the plan with the fields its id pattern fills,
 * `workflow next` reads what the scratch repository holds. `breaks` makes one command fail.
 */
class FakeWingfoil {
  readonly calls: Call[] = [];
  /** The plan's workflow and phase are left empty, as bug-005. */
  emptyPlan = false;
  /** `explore` is complete only when this path exists (relative to the repository). */
  exploreEvidence = 'docs/retrospectives/';
  breaks: ((args: string[]) => WingfoilOutput | undefined)[] = [];

  readonly exec: Exec = (_cli, args, cwd, env) => {
    this.calls.push({ args, email: gitEmail(cwd, env) });
    for (const brk of this.breaks) {
      const out = brk(args);
      if (out !== undefined) return out;
    }
    const [group, verb] = args;
    if (group === 'workflow' && verb === 'start') {
      const main = args[2] ?? '';
      const id = `${main}-1-plan`;
      mkdirSync(join(cwd, 'docs', 'plans'), { recursive: true });
      const fields = this.emptyPlan ? 'workflow: ""\nphase: ""' : `workflow: "${main}"\nphase: "1"`;
      writeFileSync(join(cwd, 'docs', 'plans', `${id}.md`),
        `---\nid: ${id}\ntype: plan\nstatus: ${this.emptyPlan ? 'draft' : 'active'}\n${fields}\n---\n`);
      if (this.emptyPlan) return failed(`plan ${id} was added but not submitted`);
      return ok({ instance: { id, workflow: main, planStatus: 'active' } });
    }
    if (group === 'memory' && verb === 'search') {
      const dir = join(cwd, 'docs', 'plans');
      const files = existsSync(dir) ? ['decision-log-ingest', 'retrospective-periodic',
        'governance-evolution'].map((main) => `${main}-1-plan`)
        .filter((id) => existsSync(join(dir, `${id}.md`))) : [];
      return ok({ matches: files.map((id) => ({ id, path: `docs/plans/${id}.md`, type: 'plan',
        status: this.emptyPlan ? 'draft' : 'active' })) });
    }
    if (group === 'workflow' && verb === 'next') {
      const evidence = join(cwd, this.exploreEvidence);
      const done = this.exploreEvidence.endsWith('/')
        ? existsSync(evidence) && execFileSync('git', ['-C', cwd, 'ls-files', this.exploreEvidence],
          { env, encoding: 'utf8' }).trim() !== ''
        : existsSync(evidence);
      return ok({ next: { key: done ? 'retrospective.additional-points'
        : 'retrospective.explore' } });
    }
    if (group === 'memory' && verb === 'add') {
      return ok({ id: 'dl-001-change-who-approves',
        path: 'docs/memory/decision-log/dl-001-change-who-approves.md' });
    }
    return ok({});
  };
}

const fakeCompose: Compose = (_tree, _entries, params, out) => {
  mkdirSync(join(out, '.wingfoil'), { recursive: true });
  writeFileSync(join(out, '.wingfoil', 'dna.yaml'), 'project: {}\n');
  writeFileSync(join(out, 'AGENTS.region.md'), '# region\n');
  return {
    params: { retrospective_path: 'docs/retrospectives/', ...params },
    release: '0.3.0',
  };
};

describe('check:runs (task-053)', () => {
  let tree: string;
  let wingfoil: FakeWingfoil;
  let options: RunsOptions;

  const write = (rel: string, text: string): void => {
    mkdirSync(join(tree, rel, '..'), { recursive: true });
    writeFileSync(join(tree, rel), text);
  };
  const composition = (id: string, parameters: Record<string, string>): void => {
    write(`compositions/${id}/example.yaml`, [
      'format: 1', `id: ${id}`, `title: "${id}"`, 'description: "A fixture."', 'packs:',
      '  - base@^1', 'parameters:', '  project_name: "Demo"', '  approver_name: "Demo Lead"',
      '  approver_email: "lead@demo.invalid"', '  agent_name: "Demo Agent"',
      ...Object.entries(parameters).map(([name, value]) => `  ${name}: "${value}"`), ''].join('\n'));
  };

  beforeEach(() => {
    tree = mkdtempSync(join(tmpdir(), 'runs-tree-'));
    write('tests/fixtures/runs/base.yaml', SCENARIO);
    composition('defaults', {});
    wingfoil = new FakeWingfoil();
    options = { compose: fakeCompose, install: () => '/fake/wingfoil.js', exec: wingfoil.exec };
  });
  afterEach(() => rmSync(tree, { recursive: true, force: true }));

  it('runs every scenario on every composition and passes', () => {
    composition('other', { retrospective_path: 'docs/retros/' });
    wingfoil.exploreEvidence = 'docs/retrospectives/';
    const result = runRuns(['--tree', tree, join(tree, 'tests/fixtures/runs/base.yaml')],
      { ...options, compose: (t, e, p, o) => ({ ...fakeCompose(t, e, p, o),
        params: { retrospective_path: 'docs/retrospectives/' } }) });
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.deepEqual(result.lines, [
      'runs compositions/defaults/example.yaml decision-log-ingest wingfoil@0.3.0: pass',
      'runs compositions/defaults/example.yaml retrospective-periodic wingfoil@0.3.0: pass',
      'runs compositions/defaults/example.yaml governance-evolution wingfoil@0.3.0: pass',
      'runs compositions/other/example.yaml decision-log-ingest wingfoil@0.3.0: pass',
      'runs compositions/other/example.yaml retrospective-periodic wingfoil@0.3.0: pass',
      'runs compositions/other/example.yaml governance-evolution wingfoil@0.3.0: pass',
      'runs: 6 runs, 0 failed',
    ]);
  });

  it('reads tests/fixtures/runs/*.yaml of the tree when no file is given', () => {
    const result = runRuns(['--tree', tree], options);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.equal(result.lines.at(-1), 'runs: 3 runs, 0 failed');
  });

  it('issues each step\'s command, the instance named by its id', () => {
    const result = runRuns(['--tree', tree], options);
    assert.equal(result.code, 0, result.lines.join('\n'));
    const commands = wingfoil.calls.map((call) => call.args.join(' '));
    for (const expected of [
      'workflow start decision-log-ingest --format json',
      'workflow next retrospective-periodic-1-plan --format json',
      'workflow finalize governance-evolution-1-plan --step governance-evolution.assess',
      'memory add --type decision-log --title Change who approves --workflow '
        + 'governance-evolution-1-plan --step governance-evolution.propose',
      'memory submit dl-001-change-who-approves',
      'memory approve dl-001-change-who-approves --reason check:runs scenario approval',
      'workflow end governance-evolution-1-plan',
    ]) assert.ok(commands.includes(expected), `${expected} in\n${commands.join('\n')}`);
  });

  it('commits a file inside the parameter\'s directory, even when it has no trailing slash', () => {
    wingfoil.exploreEvidence = 'docs/retrospectives/';
    const noSlash = runRuns(['--tree', tree], { ...options, compose: (t, e, p, o) => ({
      ...fakeCompose(t, e, p, o), params: { retrospective_path: 'docs/retrospectives' } }) });
    // The file is inside the directory either way: what WingFoil then reads decides the outcome.
    assert.equal(noSlash.code, 0, noSlash.lines.join('\n'));
  });

  it('fails a run whose next step is not the expected one, and goes on with the next run', () => {
    wingfoil.exploreEvidence = 'docs/elsewhere/';
    const result = runRuns(['--tree', tree], options);
    assert.equal(result.code, 1);
    assert.deepEqual(result.lines, [
      'runs compositions/defaults/example.yaml decision-log-ingest wingfoil@0.3.0: pass',
      'runs compositions/defaults/example.yaml retrospective-periodic wingfoil@0.3.0: fail at '
        + 'next: expected retrospective.additional-points, WingFoil names retrospective.explore',
      'runs compositions/defaults/example.yaml governance-evolution wingfoil@0.3.0: pass',
      'runs: 3 runs, 1 failed',
    ]);
  });

  it('fails a start that exits non-zero or leaves the plan\'s workflow or phase empty (bug-005)',
    () => {
      wingfoil.emptyPlan = true;
      const result = runRuns(['--tree', tree], options);
      assert.equal(result.code, 1);
      assert.equal(result.lines[0],
        'runs compositions/defaults/example.yaml decision-log-ingest wingfoil@0.3.0: fail at '
        + 'start: wingfoil workflow start decision-log-ingest --format json exit 1: '
        + 'error: plan decision-log-ingest-1-plan was added but not submitted');
      assert.equal(result.lines.at(-1), 'runs: 3 runs, 3 failed');
    });

  it('fails an end WingFoil refuses (bug-006, apply)', () => {
    wingfoil.breaks.push((args) => (args[0] === 'workflow' && args[1] === 'end'
      ? failed("workflow 'governance-evolution' is not complete") : undefined));
    const result = runRuns(['--tree', tree], options);
    assert.equal(result.code, 1);
    assert.equal(result.lines[2],
      'runs compositions/defaults/example.yaml governance-evolution wingfoil@0.3.0: fail at end: '
      + 'wingfoil workflow end governance-evolution-1-plan exit 1: '
      + "error: workflow 'governance-evolution' is not complete");
  });

  it('approves as the composition\'s approver and runs every other command as the agent', () => {
    runRuns(['--tree', tree], options);
    for (const call of wingfoil.calls) {
      const approving = call.args[0] === 'memory' && call.args[1] === 'approve';
      assert.equal(call.email, approving ? 'lead@demo.invalid' : 'agent@runs.invalid',
        call.args.join(' '));
    }
  });

  it('never shows a scratch path in its report', () => {
    wingfoil.breaks.push((args) => (args[1] === 'end'
      ? { status: 1, stdout: '', stderr: `error: ${process.cwd()} and ${tmpdir()}/runs-x/y\n` }
      : undefined));
    const result = runRuns(['--tree', tree], options);
    assert.ok(result.lines.every((line) => !line.includes(`${tmpdir()}/runs-`)),
      result.lines.join('\n'));
  });

  it('exits 2 when a release cannot be installed', () => {
    const result = runRuns(['--tree', tree], { ...options, install: () => {
      throw new MatrixIoError('wingfoil@0.3.0: npm ci failed: offline');
    } });
    assert.equal(result.code, 2);
    assert.ok(result.lines.some((line) => line.includes('npm ci failed: offline')));
  });

  it('exits 2 when a scenario file cannot be read', () => {
    const result = runRuns(['--tree', tree, join(tree, 'missing.yaml')], options);
    assert.equal(result.code, 2);
  });

  it('exits 3 on bad usage', () => {
    assert.equal(runRuns(['--bogus'], options).code, 3);
    assert.equal(runRuns(['--tree'], options).code, 3);
  });

  it('exits 3 on a scenario it cannot read, naming the file and the key', () => {
    write('tests/fixtures/runs/base.yaml', SCENARIO.replace('- start\n      - commit_inside',
      '- launch\n      - commit_inside'));
    const unknown = runRuns(['--tree', tree], options);
    assert.equal(unknown.code, 3);
    assert.match(unknown.lines.join('\n'), /tests\/fixtures\/runs\/base\.yaml: runs\[1\]\.steps\[0\]: unknown step "launch"/);
    write('tests/fixtures/runs/base.yaml', SCENARIO.replace('identities:\n  agent: { name: "Runs Agent", email: "agent@runs.invalid" }\n', ''));
    const missing = runRuns(['--tree', tree], options);
    assert.equal(missing.code, 3);
    assert.match(missing.lines.join('\n'), /base\.yaml: identities: required/);
  });

  it('leaves no scratch repository behind', () => {
    const before = new Set(readdirTmp());
    runRuns(['--tree', tree], options);
    const left = readdirTmp().filter((name) => !before.has(name) && name.startsWith('runs-'));
    assert.deepEqual(left.filter((name) => !name.startsWith('runs-tree-')), []);
  });
});

function readdirTmp(): string[] {
  return execFileSync('ls', ['-1', tmpdir()], { encoding: 'utf8' }).split('\n').filter(Boolean);
}

// The fixture of the real run (task-053): the README examples of base, the three mains.
describe('tests/fixtures/runs/base.yaml', () => {
  it('runs base\'s three mains on base\'s README examples', () => {
    const text = readFileSync(join(__dirname, '..', '..', 'tests', 'fixtures', 'runs', 'base.yaml'),
      'utf8');
    assert.match(text, /^compositions: tests\/fixtures\/examples\/base$/m);
    for (const main of ['decision-log-ingest', 'retrospective-periodic', 'governance-evolution']) {
      assert.match(text, new RegExp(`- main: ${main}$`, 'm'));
    }
  });
});
