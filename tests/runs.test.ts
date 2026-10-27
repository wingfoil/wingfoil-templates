// task-053 (plan-049): the scripted run of a pack's workflows on a real WingFoil release. These
// tests stand a fake WingFoil and a fake composer in for the real ones: the real release runs only
// in `npm run check:runs` and the CI.
import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import {
  cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { FIXTURES } from './support/paths';

import { MatrixIoError } from '../src/matrix';
import { runRuns, selectedReleases } from '../src/runs';
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
  cwd: string;
  env: NodeJS.ProcessEnv;
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
  /** `workflow start` exits 0 but leaves the plan's workflow empty, or not active. */
  startQuirk: 'none' | 'empty-workflow' | 'not-active' = 'none';
  /** `explore` is complete only when this path exists (relative to the repository). */
  exploreEvidence = 'docs/retrospectives/';
  breaks: ((args: string[]) => WingfoilOutput | undefined)[] = [];

  readonly exec: Exec = (_cli, args, cwd, env) => {
    this.calls.push({ args, email: gitEmail(cwd, env), cwd, env });
    for (const brk of this.breaks) {
      const out = brk(args);
      if (out !== undefined) return out;
    }
    const [group, verb] = args;
    if (group === 'workflow' && verb === 'start') {
      const main = args[2] ?? '';
      const id = `${main}-1-plan`;
      mkdirSync(join(cwd, 'docs', 'plans'), { recursive: true });
      const fields = this.emptyPlan ? 'workflow: ""\nphase: ""'
        : this.startQuirk === 'empty-workflow' ? "workflow: ''\nphase: \"1\""
          : `workflow: "${main}"\nphase: "1"`;
      writeFileSync(join(cwd, 'docs', 'plans', `${id}.md`),
        `---\nid: ${id}\ntype: plan\nstatus: ${this.emptyPlan ? 'draft' : 'active'}\n${fields}\n---\n`);
      if (this.emptyPlan) return failed(`plan ${id} was added but not submitted`);
      return ok({ instance: { id, workflow: main,
        planStatus: this.startQuirk === 'not-active' ? 'draft' : 'active' } });
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
    releases: ['0.3.0'],
  };
};

describe('check:runs (task-053)', () => {
  let tree: string;
  let wingfoil: FakeWingfoil;
  let options: RunsOptions;
  let installed: { version: string; cache: string }[];

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
    installed = [];
  });
  afterEach(() => rmSync(tree, { recursive: true, force: true }));

  it('runs every scenario on every composition and passes', () => {
    composition('other', { retrospective_path: 'docs/retros/' });
    wingfoil.exploreEvidence = 'docs/retrospectives/';
    const result = runRuns(['--tree', tree, join(tree, 'tests/fixtures/runs/base.yaml')],
      { ...options, compose: (t, e, p, o) => {
        const composed = fakeCompose(t, e, p, o);
        return { ...composed, params: { ...composed.params,
          retrospective_path: 'docs/retrospectives/' } };
      } });
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
    const noSlash = runRuns(['--tree', tree], { ...options, compose: (t, e, p, o) => {
      const composed = fakeCompose(t, e, p, o);
      return { ...composed, params: { ...composed.params,
        retrospective_path: 'docs/retrospectives' } };
    } });
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
        + 'next: wingfoil workflow next retrospective-periodic-1-plan --format json: expected '
        + 'retrospective.additional-points, WingFoil names retrospective.explore',
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
    const result = runRuns(['--tree', tree], options);
    assert.equal(result.code, 0, result.lines.join('\n'));
    const approvals = wingfoil.calls.filter((call) => call.args[1] === 'approve');
    assert.equal(approvals.length, 1);
    const after = wingfoil.calls.slice(wingfoil.calls.indexOf(approvals[0] as Call) + 1);
    assert.ok(after.length > 0 && after.every((call) => call.email === 'agent@runs.invalid'),
      'the agent again after the approval');
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
    const line = result.lines.find((entry) => entry.includes(' governance-evolution '));
    assert.match(line ?? '', /fail at end: .*<scratch>/);
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

  it('runs each main in its own scratch repository and leaves none behind, failing or not', () => {
    const before = new Set(readdirTmp());
    for (const quirk of [false, true]) {
      wingfoil.calls.length = 0;
      wingfoil.exploreEvidence = quirk ? 'docs/elsewhere/' : 'docs/retrospectives/';
      runRuns(['--tree', tree], options);
      const dirs = [...new Set(wingfoil.calls.map((call) => call.cwd))];
      assert.equal(dirs.length, 3, dirs.join('\n'));
      for (const dir of dirs) {
        assert.ok(dir.startsWith(join(tmpdir(), 'runs-scratch-')), dir);
        assert.ok(!existsSync(dir), `${dir} removed`);
      }
    }
    assert.deepEqual(readdirTmp().filter((name) => !before.has(name)
      && (name.startsWith('runs-scratch-') || name.startsWith('runs-compose-'))), []);
  });

  it('never passes an inherited GIT_* variable to WingFoil', () => {
    const saved = { ...process.env };
    process.env['GIT_AUTHOR_EMAIL'] = 'intruder@example.invalid';
    process.env['GIT_COMMITTER_EMAIL'] = 'intruder@example.invalid';
    try {
      const result = runRuns(['--tree', tree], options);
      assert.equal(result.code, 0, result.lines.join('\n'));
    } finally {
      for (const name of ['GIT_AUTHOR_EMAIL', 'GIT_COMMITTER_EMAIL']) {
        if (saved[name] === undefined) delete process.env[name];
        else process.env[name] = saved[name];
      }
    }
    for (const call of wingfoil.calls) {
      assert.ok(Object.keys(call.env).every((name) => !name.startsWith('GIT_')
        || ['GIT_CONFIG_NOSYSTEM', 'GIT_CONFIG_GLOBAL', 'GIT_NO_REPLACE_OBJECTS'].includes(name)),
      call.args.join(' '));
    }
  });

  it('fails a start that exits 0 with an empty workflow, or a plan not active (bug-005)', () => {
    wingfoil.startQuirk = 'empty-workflow';
    const empty = runRuns(['--tree', tree], options);
    assert.equal(empty.code, 1);
    assert.match(empty.lines[0] ?? '', /fail at start: plan decision-log-ingest-1-plan has an empty workflow$/);
    wingfoil.startQuirk = 'not-active';
    const draft = runRuns(['--tree', tree], options);
    assert.equal(draft.code, 1);
    assert.match(draft.lines[0] ?? '', /fail at start: plan decision-log-ingest-1-plan is draft, not active$/);
  });

  it('reads the plans with --format json', () => {
    runRuns(['--tree', tree], options);
    assert.ok(wingfoil.calls.some((call) => call.args.join(' ')
      === 'memory search --type plan --format json'));
  });

  it('names the command of a next that is not the expected one', () => {
    wingfoil.exploreEvidence = 'docs/elsewhere/';
    const result = runRuns(['--tree', tree], options);
    assert.match(result.lines[1] ?? '', /fail at next: wingfoil workflow next retrospective-periodic-1-plan --format json: expected retrospective\.additional-points, WingFoil names retrospective\.explore$/);
  });

  it('passes the composition\'s parameters to the composer, and --cache to the install', () => {
    composition('other', { retrospective_path: 'docs/retros/' });
    const seen: Record<string, string>[] = [];
    const result = runRuns(['--tree', tree, '--cache', '/some/cache'], { ...options,
      install: (version, cache) => {
        installed.push({ version, cache });
        return '/fake/wingfoil.js';
      },
      compose: (t, e, p, o) => {
        seen.push(p);
        return fakeCompose(t, e, p, o);
      } });
    // The fake completes explore under docs/retrospectives/ only: `other` fails there, by design.
    assert.equal(result.lines.at(-1), 'runs: 6 runs, 1 failed');
    assert.equal(seen[1]?.['retrospective_path'], 'docs/retros/');
    assert.equal(seen[0]?.['approver_email'], 'lead@demo.invalid');
    assert.deepEqual(installed, [{ version: '0.3.0', cache: '/some/cache' },
      { version: '0.3.0', cache: '/some/cache' }], 'once per release per composition');
  });

  it('exits 1 when a composition does not compose, 2 on an I/O error or no release', () => {
    const refused = runRuns(['--tree', tree], { ...options, compose: () => {
      throw new Error('composition: base: unknown parameter');
    } });
    assert.equal(refused.code, 1);
    assert.match(refused.lines[0] ?? '', /^runs compositions\/defaults\/example\.yaml: composition: /);
    const io = runRuns(['--tree', tree], { ...options, compose: () => {
      throw Object.assign(new Error('ENOENT: no such file'), { code: 'ENOENT' });
    } });
    assert.equal(io.code, 2);
    const none = runRuns(['--tree', tree], { ...options, compose: (t, e, p, o) => ({
      ...fakeCompose(t, e, p, o), releases: [] }) });
    assert.equal(none.code, 2);
  });

  it('exits 3 when there is nothing to run', () => {
    rmSync(join(tree, 'compositions'), { recursive: true });
    const noCompositions = runRuns(['--tree', tree], options);
    assert.equal(noCompositions.code, 3);
    assert.match(noCompositions.lines.join('\n'), /base\.yaml: compositions: no example\.yaml under compositions/);
    rmSync(join(tree, 'tests'), { recursive: true });
    const noScenario = runRuns(['--tree', tree], options);
    assert.equal(noScenario.code, 3);
    assert.match(noScenario.lines.join('\n'), /no scenario file under tests\/fixtures\/runs/);
  });

  it('exits 3 on an unknown key, and on a path that leaves the repository', () => {
    write('tests/fixtures/runs/base.yaml', SCENARIO.replace('format: 1', 'format: 1\nextra: 1'));
    const unknown = runRuns(['--tree', tree], options);
    assert.equal(unknown.code, 3);
    assert.match(unknown.lines.join('\n'), /base\.yaml: extra: unknown key/);
    write('tests/fixtures/runs/base.yaml', SCENARIO.replace('to: AGENTS.md', 'to: ../AGENTS.md'));
    const escape = runRuns(['--tree', tree], options);
    assert.equal(escape.code, 3);
    assert.match(escape.lines.join('\n'), /commit_copy\.to: must stay inside the repository/);
  });

  describe('on every release the matrix selects (task-058)', () => {
    const two: Compose = (t, e, p, o) => ({ ...fakeCompose(t, e, p, o),
      releases: ['0.3.0', '0.3.1'] });
    const byVersion = (version: string): string => `/fake/wingfoil-${version}.js`;

    it('runs every run on each release, in compat.yaml order', () => {
      const result = runRuns(['--tree', tree], { ...options, compose: two,
        install: (version) => byVersion(version) });
      assert.equal(result.code, 0, result.lines.join('\n'));
      const head = 'runs compositions/defaults/example.yaml';
      assert.deepEqual(result.lines, [
        `${head} decision-log-ingest wingfoil@0.3.0: pass`,
        `${head} retrospective-periodic wingfoil@0.3.0: pass`,
        `${head} governance-evolution wingfoil@0.3.0: pass`,
        `${head} decision-log-ingest wingfoil@0.3.1: pass`,
        `${head} retrospective-periodic wingfoil@0.3.1: pass`,
        `${head} governance-evolution wingfoil@0.3.1: pass`,
        'runs: 6 runs, 0 failed',
      ]);
    });

    it('installs each release once per composition, with the cache', () => {
      const calls: string[] = [];
      runRuns(['--tree', tree, '--cache', '/c'], { ...options, compose: two,
        install: (version, cache) => {
          calls.push(`${version} ${cache}`);
          return byVersion(version);
        } });
      assert.deepEqual(calls, ['0.3.0 /c', '0.3.1 /c']);
    });

    it('fails a run on one release only', () => {
      const exec: Exec = (cli, args, cwd, env) => (cli.includes('0.3.1') && args[1] === 'end'
        ? failed('not complete') : wingfoil.exec(cli, args, cwd, env));
      const result = runRuns(['--tree', tree], { ...options, compose: two,
        install: (version) => byVersion(version), exec });
      assert.equal(result.code, 1);
      assert.match(result.lines[2] ?? '', /governance-evolution wingfoil@0\.3\.0: pass$/);
      assert.match(result.lines[5] ?? '', /governance-evolution wingfoil@0\.3\.1: fail at end: /);
      assert.equal(result.lines.at(-1), 'runs: 6 runs, 1 failed');
    });

    it('reports a release that cannot be installed and runs the other one', () => {
      const result = runRuns(['--tree', tree], { ...options, compose: two,
        install: (version) => {
          if (version === '0.3.1') throw new MatrixIoError('wingfoil@0.3.1: npm ci failed: offline');
          return byVersion(version);
        } });
      assert.equal(result.code, 2);
      assert.deepEqual(result.lines.slice(3), [
        'runs compositions/defaults/example.yaml wingfoil@0.3.1: '
          + 'wingfoil@0.3.1: npm ci failed: offline',
        'runs: 3 runs, 0 failed',
      ]);
      assert.ok(result.lines.slice(0, 3).every((line) => line.endsWith('wingfoil@0.3.0: pass')));
    });

    it('selects the oldest and the newest compatible release (selectedReleases)', () => {
      const golden = join(FIXTURES, 'compose', 'tree');
      const copy = mkdtempSync(join(tmpdir(), 'runs-select-'));
      try {
        cpSync(golden, copy, { recursive: true });
        const release = (version: string): string => [`  - wingfoil: ${version}`,
          '    format_key: true',
          '    reads: { dna: [1], memory: [1], roles: [1], workflows: [1], workflow: [1], '
            + 'directive: [1], memory-template: [1] }',
          '    capabilities: [workflow-engine]'].join('\n');
        const compat = readFileSync(join(golden, 'compat.yaml'), 'utf8');
        writeFileSync(join(copy, 'compat.yaml'), `${compat.slice(0, compat.indexOf('releases:'))}`
          + `releases:\n${['7.0.0', '7.1.0', '7.2.0'].map(release).join('\n')}\n`);
        assert.deepEqual(selectedReleases(copy, ['base']), ['7.0.0', '7.2.0']);
      } finally {
        rmSync(copy, { recursive: true, force: true });
      }
    });
  });

  it('fails a commit_inside whose parameter leaves the repository', () => {
    const result = runRuns(['--tree', tree], { ...options, compose: (t, e, p, o) => {
      const composed = fakeCompose(t, e, p, o);
      return { ...composed, params: { ...composed.params, retrospective_path: '../outside/' } };
    } });
    assert.equal(result.code, 1);
    assert.match(result.lines[1] ?? '', /fail at commit_inside: retrospective_path leaves the repository/);
  });
});

function readdirTmp(): string[] {
  return execFileSync('ls', ['-1', tmpdir()], { encoding: 'utf8' }).split('\n').filter(Boolean);
}

// The fixture of the real run (task-053): the README examples of base, the three mains.
describe('tests/fixtures/runs/software.yaml and scrum.yaml (task-058)', () => {
  for (const [file, folder] of [['software', 'software'], ['scrum', 'scrum']] as const) {
    it(`starts sw-life-cycle on the README examples of ${folder}`, () => {
      const text = readFileSync(join(FIXTURES, 'runs', `${file}.yaml`), 'utf8');
      assert.match(text, new RegExp(`^compositions: tests/fixtures/examples/${folder}$`, 'm'));
      assert.match(text, /- main: sw-life-cycle$/m);
      assert.match(text, /steps: \[start\]/);
    });
  }
});

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
