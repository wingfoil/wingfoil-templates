// task-053 (plan-049): the scripted run of a pack's workflows on a real WingFoil release. These
// tests stand a fake WingFoil and a fake composer in for the real ones: the real release runs only
// in `npm run check:runs` and the CI.
import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import {
  cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';

import { parse as parseYaml } from 'yaml';

import { assertFields, assertSections } from './support/inbox';
import { FIXTURES, REPO_ROOT } from './support/paths';

import { readFrontmatter } from '../src/frontmatter';
import { MatrixIoError } from '../src/matrix';
import { treeLayout } from '../src/layout-rules';
import { mergeOverlay, openOverlay } from '../src/overlay-tree';
import { realCompose, runRuns, selectedReleases, setFields } from '../src/runs';
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
        'runs compositions/defaults/example.yaml wingfoil@0.3.1: npm ci failed: offline',
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

describe('tests/fixtures/runs/software.yaml, scrum.yaml and kanban.yaml (task-058, task-068)',
  () => {
  const scenarios = [['software', 'software'], ['scrum', 'scrum'], ['kanban', 'kanban']] as const;
  for (const [file, folder] of scenarios) {
    it(`starts sw-life-cycle on the README examples of ${folder}`, () => {
      const text = readFileSync(join(FIXTURES, 'runs', `${file}.yaml`), 'utf8');
      assert.match(text, new RegExp(`^compositions: tests/fixtures/examples/${folder}$`, 'm'));
      assert.match(text, /- main: sw-life-cycle$/m);
      assert.match(text, /steps: \[start\]/);
    });
  }
});

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

// task-060 (plan-052): an adoption run. A project initialised by `wingfoil init --template` takes
// the composed `.wingfoil/` as the READMEs' "Install and update" steps say (bug-007).
const INIT_WORKFLOWS = ['sw-life-cycle', 'bug-ingest', 'decision-log-ingest', 'adr-ingest'];
const INIT_STUBS = ['traceability', 'doc-versioning', 'security-secrets', 'determinism'];
/** What the READMEs' "Install and update" steps remove, in both adoption scenarios (bug-007). */
const ADOPTION_REMOVE = { workflows: ['decision-log-ingest', 'sw-life-cycle', 'adr-ingest',
  'bug-ingest', 'scrum-delivery', 'kanban-delivery'], directives: INIT_STUBS };

function adoptionScenario(adopt: string[]): string {
  return [
    'format: 1',
    'compositions: compositions',
    'identities:',
    '  agent: { name: "Runs Agent", email: "agent@runs.invalid" }',
    'runs:',
    ...adopt,
    '',
  ].join('\n');
}

const FULL_REMOVAL = [
  '  - adopt:',
  '      template: Scrum',
  '      remove:',
  '        workflows: [decision-log-ingest, sw-life-cycle, adr-ingest, bug-ingest, scrum-delivery,',
  '          kanban-delivery]',
  '        directives: [traceability, doc-versioning, security-secrets, determinism]',
];

function includesOf(repo: string): string[] {
  const text = readFileSync(join(repo, '.wingfoil', 'workflows.yaml'), 'utf8');
  return text.split('\n').filter((line) => line.startsWith('  - ')).map((line) => line.slice(4)
    .replace(/^"|"$/g, ''));
}

/**
 * A fake `init` and a `workflow list` that refuses an included `custom/` workflow named as a
 * composed one, as WingFoil 0.3.0 and 0.3.1 do (E_WORKFLOW_DUPLICATE_NAME).
 */
class FakeAdoption extends FakeWingfoil {
  repos: string[] = [];
  initEmails: string[] = [];
  listDiagnostics: unknown[] = [];
  nextStderr = '';

  readonly adoptExec: Exec = (cli, args, cwd, env) => {
    const [group, verb] = args;
    if (group === 'init') {
      this.calls.push({ args, email: gitEmail(cwd, env), cwd, env });
      this.initEmails.push(gitEmail(cwd, env));
      this.repos.push(cwd);
      const template = args[2] ?? '';
      const custom = join(cwd, '.wingfoil', 'workflows', 'custom');
      mkdirSync(custom, { recursive: true });
      const names = [...INIT_WORKFLOWS, `${template.toLowerCase()}-delivery`];
      for (const name of names) writeFileSync(join(custom, `${name}.yaml`), `name: ${name}\n`);
      const directives = join(cwd, '.wingfoil', 'directives', 'custom');
      mkdirSync(directives, { recursive: true });
      for (const id of INIT_STUBS) writeFileSync(join(directives, `${id}.md`), `# ${id}\n`);
      writeFileSync(join(cwd, '.wingfoil', 'workflows.yaml'), ['version: 1', 'include:',
        ...names.map((name) => `  - workflows/custom/${name}.yaml`), ''].join('\n'));
      return ok({});
    }
    if (group === 'workflow' && verb === 'list') {
      this.calls.push({ args, email: gitEmail(cwd, env), cwd, env });
      const included = includesOf(cwd);
      for (const entry of included.filter((e) => e.startsWith('workflows/custom/'))) {
        const name = entry.slice('workflows/custom/'.length, -'.yaml'.length);
        if (included.includes(`workflows/built-in/${name}.yaml`)) {
          return { status: 1, stdout: '', stderr: `${JSON.stringify({
            error: `E_WORKFLOW_DUPLICATE_NAME name (${entry}): duplicate workflow name '${name}'`,
            details: [{ detail: 'E_WORKFLOW_DUPLICATE_NAME another' }] })}\n` };
        }
      }
      return ok({ manifest: {}, workflows: [], diagnostics: this.listDiagnostics });
    }
    if (group === 'workflow' && verb === 'next' && args.length === 4) {
      this.calls.push({ args, email: gitEmail(cwd, env), cwd, env });
      return { status: 0, stdout: JSON.stringify({ next: null }), stderr: this.nextStderr };
    }
    return this.exec(cli, args, cwd, env);
  };
}

/** The composer's output for an adoption: two pack workflows, included as built-in. */
const adoptionCompose = (extraInclude: string[] = [], includeBlock?: string[]): Compose =>
  (_tree, _entries, params, out) => {
  const workflows = join(out, '.wingfoil', 'workflows', 'built-in');
  mkdirSync(workflows, { recursive: true });
  for (const name of ['sw-life-cycle', 'decision-log-ingest']) {
    writeFileSync(join(workflows, `${name}.yaml`), `name: ${name}\n`);
  }
  writeFileSync(join(out, '.wingfoil', 'workflows.yaml'), ['version: 1', ...(includeBlock ?? [
    'include:', '  - workflows/built-in/sw-life-cycle.yaml',
    '  - workflows/built-in/decision-log-ingest.yaml',
    ...extraInclude.map((entry) => `  - ${entry}`)]), ''].join('\n'));
  writeFileSync(join(out, '.wingfoil', 'dna.yaml'), 'project: {}\n');
  return { params: { ...params }, releases: ['0.3.0'] };
};

describe('check:runs: an adoption run (task-060)', () => {
  let tree: string;
  let wingfoil: FakeAdoption;
  let kept: string[];

  const write = (rel: string, text: string): void => {
    mkdirSync(join(tree, rel, '..'), { recursive: true });
    writeFileSync(join(tree, rel), text);
  };
  const run = (adopt: string[], compose: Compose = adoptionCompose()): ReturnType<typeof runRuns> => {
    write('tests/fixtures/runs/adoption.yaml', adoptionScenario(adopt));
    return runRuns(['--tree', tree, join(tree, 'tests/fixtures/runs/adoption.yaml')], {
      compose, install: () => '/fake/wingfoil.js',
      // Keeps a copy of each scratch repository's .wingfoil before the run removes it.
      exec: (cli, args, cwd, env) => {
        const out = wingfoil.adoptExec(cli, args, cwd, env);
        if (args[0] === 'workflow' && args[1] === 'list') {
          const copy = mkdtempSync(join(tmpdir(), 'adoption-kept-'));
          cpSync(join(cwd, '.wingfoil'), join(copy, '.wingfoil'), { recursive: true });
          kept.push(copy);
        }
        return out;
      },
    });
  };

  beforeEach(() => {
    tree = mkdtempSync(join(tmpdir(), 'runs-tree-'));
    write('compositions/defaults/example.yaml', ['format: 1', 'id: defaults', 'title: "d"',
      'description: "A fixture."', 'packs:', '  - base@^2', 'parameters:',
      '  project_name: "Demo"', '  approver_name: "Demo Lead"',
      '  approver_email: "lead@demo.invalid"', '  agent_name: "Demo Agent"', ''].join('\n'));
    wingfoil = new FakeAdoption();
    kept = [];
  });
  afterEach(() => {
    rmSync(tree, { recursive: true, force: true });
    for (const dir of kept) rmSync(dir, { recursive: true, force: true });
  });

  it('adopts the composition on a project init wrote, and passes', () => {
    const result = run(FULL_REMOVAL);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.deepEqual(result.lines, [
      'runs compositions/defaults/example.yaml adopt:Scrum wingfoil@0.3.0: pass',
      'runs: 1 run, 0 failed',
    ]);
    const commands = wingfoil.calls.map((call) => call.args.join(' '));
    assert.deepEqual(commands, ['init --template Scrum', 'workflow list --format json',
      'workflow next --format json']);
    const repo = kept[0] ?? '';
    assert.deepEqual(includesOf(repo), ['workflows/built-in/sw-life-cycle.yaml',
      'workflows/built-in/decision-log-ingest.yaml']);
    for (const id of INIT_STUBS) {
      assert.equal(existsSync(join(repo, '.wingfoil', 'directives', 'custom', `${id}.md`)), false);
    }
  });

  it('sets the scenario\'s agent in the repository before init, which commits', () => {
    const result = run(FULL_REMOVAL);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.deepEqual(wingfoil.initEmails, ['agent@runs.invalid']);
  });

  it('re-includes, after the composed entries, the custom/ workflows left (the project\'s own)',
    () => {
      const result = run([
        '  - adopt:',
        '      template: Kanban',
        '      remove:',
        '        workflows: [decision-log-ingest, sw-life-cycle]',
        '        directives: []',
      ]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.deepEqual(includesOf(kept[0] ?? ''), ['workflows/built-in/sw-life-cycle.yaml',
        'workflows/built-in/decision-log-ingest.yaml', 'workflows/custom/adr-ingest.yaml',
        'workflows/custom/bug-ingest.yaml', 'workflows/custom/kanban-delivery.yaml']);
    });

  it('fails at list when init\'s workflows are kept and re-included (the steps before bug-007)',
    () => {
      const result = run([
        '  - adopt:',
        '      template: Scrum',
        '      remove:',
        '        workflows: []',
        '        directives: [traceability, doc-versioning, security-secrets, determinism]',
      ]);
      assert.equal(result.code, 1);
      assert.equal(result.lines[0], 'runs compositions/defaults/example.yaml adopt:Scrum '
        + 'wingfoil@0.3.0: fail at list: wingfoil workflow list --format json exit 1: '
        + 'E_WORKFLOW_DUPLICATE_NAME name (workflows/custom/decision-log-ingest.yaml): duplicate '
        + "workflow name 'decision-log-ingest' (+1 more)");
      assert.equal(result.lines.at(-1), 'runs: 1 run, 1 failed');
    });

  it('fails at list on a diagnostic, and at next on a stderr line', () => {
    wingfoil.listDiagnostics = [{ code: 'W_SOMETHING', severity: 'warning', message: 'm' }];
    const listed = run(FULL_REMOVAL);
    assert.equal(listed.code, 1);
    assert.match(listed.lines[0] ?? '', /fail at list: WingFoil reports 1 diagnostic: W_SOMETHING/);
    wingfoil.listDiagnostics = [];
    wingfoil.nextStderr = 'Warning: something\n';
    const next = run(FULL_REMOVAL);
    assert.equal(next.code, 1);
    assert.match(next.lines[0] ?? '', /fail at next: wingfoil workflow next --format json wrote to stderr: Warning: something/);
  });

  it('fails its own check when a removed workflow is still included', () => {
    const result = run(FULL_REMOVAL, adoptionCompose(['workflows/custom/scrum-delivery.yaml']));
    assert.equal(result.code, 1);
    assert.match(result.lines[0] ?? '',
      /fail at check: workflows\.yaml still includes workflows\/custom\/scrum-delivery\.yaml/);
  });

  it('writes an include list when the composed workflows.yaml has none', () => {
    const result = run([
      '  - adopt:',
      '      template: Scrum',
      '      remove:',
      '        workflows: [decision-log-ingest, sw-life-cycle, adr-ingest, scrum-delivery]',
      '        directives: []',
    ], adoptionCompose([], []));
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.deepEqual(includesOf(kept[0] ?? ''), ['workflows/custom/bug-ingest.yaml']);
  });

  it('writes an include list when the composed include has no value (the null branch)', () => {
    const result = run(FULL_REMOVAL, adoptionCompose([], ['include:']));
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.deepEqual(includesOf(kept[0] ?? ''), []);
  });

  it('fails at include when the composed include is not a list', () => {
    const result = run(FULL_REMOVAL, adoptionCompose([], ['include: workflows/built-in/x.yaml']));
    assert.equal(result.code, 1);
    assert.match(result.lines[0] ?? '', /fail at include: workflows\.yaml: include is not a list$/);
  });

  it('leaves no scratch repository behind', () => {
    const before = readdirTmp().filter((name) => name.startsWith('runs-scratch-'));
    const result = run(FULL_REMOVAL);
    assert.equal(result.code, 0, result.lines.join('\n'));
    const after = readdirTmp().filter((name) => name.startsWith('runs-scratch-'));
    assert.deepEqual(after, before);
  });

  for (const [what, adopt, problem] of [
    ['both main and adopt', ['  - main: x', '    adopt: { template: Scrum, remove: { workflows: [], '
      + 'directives: [] } }'], 'runs[0].main: unknown key'],
    ['an unknown key', ['  - adopt: { template: Scrum, remove: { workflows: [], directives: [] }, '
      + 'extra: 1 }'], 'runs[0].adopt.extra: unknown key'],
    ['an empty template', ['  - adopt: { template: "", remove: { workflows: [], directives: [] } }'],
      'runs[0].adopt.template: a non-empty string is required'],
    ['a missing remove', ['  - adopt: { template: Scrum }'],
      'runs[0].adopt.remove: a mapping is required'],
    ['an id with a slash', ['  - adopt: { template: Scrum, remove: { workflows: [a/b], directives: '
      + '[] } }'], 'runs[0].adopt.remove.workflows[0]: a plain id is required'],
    ['a list that is not one', ['  - adopt: { template: Scrum, remove: { workflows: x, directives: '
      + '[] } }'], 'runs[0].adopt.remove.workflows: a list is required'],
    ['a missing directives list', ['  - adopt: { template: Scrum, remove: { workflows: [] } }'],
      'runs[0].adopt.remove.directives: a list is required'],
  ] as const) {
    it(`exits 3 on ${what}`, () => {
      const result = run([...adopt]);
      assert.equal(result.code, 3, result.lines.join('\n'));
      assert.equal(result.lines[0], `tests/fixtures/runs/adoption.yaml: ${problem}`);
    });
  }
});

describe('tests/fixtures/runs/adoption.yaml (task-060)', () => {
  it('adopts the README examples of methodology/scrum with bug-007\'s removal list', () => {
    const data = parseYaml(readFileSync(join(FIXTURES, 'runs', 'adoption.yaml'), 'utf8')) as {
      compositions: string; runs: { adopt: unknown }[] };
    assert.equal(data.compositions, 'tests/fixtures/examples/scrum');
    const remove = ADOPTION_REMOVE;
    assert.deepEqual(data.runs, [{ adopt: { template: 'Scrum', remove } },
      { adopt: { template: 'Kanban', remove } }]);
  });
});

describe('tests/fixtures/runs/adoption-kanban.yaml (task-068)', () => {
  it('adopts the README examples of methodology/kanban with bug-007\'s removal list', () => {
    const data = parseYaml(readFileSync(join(FIXTURES, 'runs', 'adoption-kanban.yaml'), 'utf8')) as
      { compositions: string; runs: { adopt: unknown }[] };
    assert.equal(data.compositions, 'tests/fixtures/examples/kanban');
    const remove = ADOPTION_REMOVE;
    assert.deepEqual(data.runs, [{ adopt: { template: 'Scrum', remove } },
      { adopt: { template: 'Kanban', remove } }]);
  });
});

// task-095 (plan-076 point 2): the steps that drive a route of governance/feedback.

/** A fake WingFoil for the routes: `memory add` writes an element with a commented template. */
class RouteWingfoil {
  readonly calls: Call[] = [];
  breaks: ((args: string[], cwd: string) => WingfoilOutput | undefined)[] = [];
  private readonly counts = new Map<string, number>();

  readonly exec: Exec = (_cli, args, cwd, env) => {
    this.calls.push({ args, email: gitEmail(cwd, env), cwd, env });
    for (const brk of this.breaks) {
      const out = brk(args, cwd);
      if (out !== undefined) return out;
    }
    const [group, verb] = args;
    if (group === 'workflow' && verb === 'start') {
      const main = args[2] ?? '';
      const id = `${main}-1-plan`;
      mkdirSync(join(cwd, 'docs', 'plans'), { recursive: true });
      writeFileSync(join(cwd, 'docs', 'plans', `${id}.md`),
        `---\nid: ${id}\ntype: plan\nstatus: active\nworkflow: "${main}"\nphase: "1"\n---\n`);
      return ok({ instance: { id, workflow: main, planStatus: 'active' } });
    }
    if (group === 'memory' && verb === 'search') {
      const dir = join(cwd, 'docs', 'plans');
      const ids = existsSync(dir) ? readdirSync(dir).map((name) => name.slice(0, -3)) : [];
      return ok({ matches: ids.map((id) => ({ id, path: `docs/plans/${id}.md`, type: 'plan',
        status: 'active' })) });
    }
    if (group === 'memory' && verb === 'add') {
      const type = args[args.indexOf('--type') + 1] ?? '';
      const n = (this.counts.get(type) ?? 0) + 1;
      this.counts.set(type, n);
      const id = `${type}-00${n}-item`;
      const path = `docs/memory/${type}/${id}.md`;
      mkdirSync(join(cwd, 'docs', 'memory', type), { recursive: true });
      writeFileSync(join(cwd, path), ['---', `id: ${id}`, `type: ${type}`, 'status: draft',
        '# who or what produced it', 'source: ""', 'tags: ["a"]', '---', '', '## Body', '']
        .join('\n'));
      return ok({ id, path });
    }
    return ok({});
  };
}

const routeCompose: Compose = (_tree, _entries, params, out) => {
  mkdirSync(join(out, '.wingfoil'), { recursive: true });
  writeFileSync(join(out, '.wingfoil', 'dna.yaml'), 'project: {}\n');
  writeFileSync(join(out, '.wingfoil', 'workflows.yaml'), 'version: 1\ninclude: []\n');
  return { params: { ...params }, releases: ['0.3.0'] };
};

const ROUTE_HEAD = ['format: 1', 'compositions: compositions', 'identities:',
  '  agent: { name: "Runs Agent", email: "agent@runs.invalid" }', 'runs:'];

const BUG_ROUTE = [
  '  - chain:',
  '      - main: feedback-ingest',
  '        steps:',
  '          - start',
  '          - add: { type: feedback, title: "A crash", step: feedback-ingest.capture, '
    + 'label: item }',
  '          - set: { element: item, fields: { kind: defect, outcome: bug } }',
  '          - submit: item',
  '          - approve: item',
  '          - end',
  '      - main: bug-ingest',
  '        steps:',
  '          - start',
  '          - add: { type: bug, title: "A crash", step: bug-ingest.capture, label: bug }',
  '          - set: { element: bug, body: "Reported by $item.id." }',
  '          - submit: bug',
  '      - main: feedback-bug-route',
  '        steps:',
  '          - start',
  '          - set: { element: item, fields: { resulting: $bug.id } }',
  '          - finalize: feedback-bug-item.bug@feedback:$item.id',
  '          - submit: item',
  '          - end',
];

describe('check:runs: the steps of a route (task-095)', () => {
  let tree: string;
  let wingfoil: RouteWingfoil;
  let options: RunsOptions;
  /** Each element file's text when `memory submit` names it, and each repository's tracked files. */
  let seen: Map<string, string>;

  const write = (rel: string, text: string): void => {
    mkdirSync(join(tree, rel, '..'), { recursive: true });
    writeFileSync(join(tree, rel), text);
  };
  const composition = (id: string): void => {
    write(`compositions/${id}/example.yaml`, ['format: 1', `id: ${id}`, `title: "${id}"`,
      'description: "A fixture."', 'packs:', '  - base@^2', 'parameters:',
      '  project_name: "Demo"', '  approver_name: "Demo Lead"',
      '  approver_email: "lead@demo.invalid"', '  agent_name: "Demo Agent"', ''].join('\n'));
  };
  const scenario = (runs: string[], head: string[] = ROUTE_HEAD): string => {
    write('tests/fixtures/runs/routes.yaml', [...head, ...runs, ''].join('\n'));
    return join(tree, 'tests/fixtures/runs/routes.yaml');
  };
  const run = (runs: string[], extra: Partial<RunsOptions> = {}): ReturnType<typeof runRuns> =>
    runRuns(['--tree', tree, scenario(runs)], { ...options, ...extra });
  const commands = (): string[] => wingfoil.calls.map((call) => call.args.join(' '));
  const refused = (runs: string[], pattern: RegExp): void => {
    wingfoil.calls.length = 0;
    const result = run(runs);
    assert.equal(result.code, 3, result.lines.join('\n'));
    assert.match(result.lines.join('\n'), pattern);
    assert.deepEqual(commands(), [], 'nothing runs');
  };

  beforeEach(() => {
    tree = mkdtempSync(join(tmpdir(), 'runs-tree-'));
    composition('defaults');
    wingfoil = new RouteWingfoil();
    seen = new Map();
    wingfoil.breaks.push((args, cwd) => {
      if (args[0] === 'memory' && args[1] === 'submit') {
        const dir = join(cwd, 'docs', 'memory');
        for (const type of existsSync(dir) ? readdirSync(dir) : []) {
          for (const name of readdirSync(join(dir, type))) {
            seen.set(name.slice(0, -3), readFileSync(join(dir, type, name), 'utf8'));
          }
        }
        const note = join(cwd, 'notes', 'feedback-001-item.md');
        if (existsSync(note)) seen.set('note', readFileSync(note, 'utf8'));
        seen.set('tracked', execFileSync('git', ['-C', cwd, 'ls-files'], { encoding: 'utf8' }));
        seen.set('status', execFileSync('git', ['-C', cwd, 'status', '--porcelain'],
          { encoding: 'utf8' }));
      }
      return undefined;
    });
    options = { compose: routeCompose, install: () => '/fake/wingfoil.js', exec: wingfoil.exec };
  });
  afterEach(() => rmSync(tree, { recursive: true, force: true }));

  it('runs a chain of three mains in one repository, as the bug route (criteria 1, 2, 6)', () => {
    const result = run(BUG_ROUTE);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.deepEqual(result.lines, [
      'runs compositions/defaults/example.yaml feedback-ingest+bug-ingest+feedback-bug-route '
        + 'wingfoil@0.3.0: pass',
      'runs: 1 run, 0 failed',
    ]);
    assert.deepEqual(commands().filter((c) => !c.startsWith('memory search')), [
      'workflow start feedback-ingest --format json',
      'memory add --type feedback --title A crash --workflow feedback-ingest-1-plan --step '
        + 'feedback-ingest.capture',
      'memory submit feedback-001-item',
      'memory approve feedback-001-item --reason check:runs scenario approval',
      'workflow end feedback-ingest-1-plan',
      'workflow start bug-ingest --format json',
      'memory add --type bug --title A crash --workflow bug-ingest-1-plan --step '
        + 'bug-ingest.capture',
      'memory submit bug-001-item',
      'workflow start feedback-bug-route --format json',
      'workflow finalize feedback-bug-route-1-plan --step '
        + 'feedback-bug-item.bug@feedback:feedback-001-item',
      'memory submit feedback-001-item',
      'workflow end feedback-bug-route-1-plan',
    ]);
    assert.equal(new Set(wingfoil.calls.map((call) => call.cwd)).size, 1, 'one repository');
    const approver = wingfoil.calls.find((call) => call.args[1] === 'approve');
    assert.equal(approver?.email, 'lead@demo.invalid');
    assert.match(seen.get('bug-001-item') ?? '', /\nReported by feedback-001-item\.\n$/);
    assert.match(seen.get('feedback-001-item') ?? '', /\nresulting: bug-001-item\n/);
    assert.equal(seen.get('status'), '', 'every write committed');
  });

  it('names a run by its name, and a chain\'s failing link by its position (criterion 1)', () => {
    wingfoil.breaks.push((args) => (args[0] === 'workflow' && args[1] === 'end'
      && args[2] === 'feedback-ingest-1-plan' ? failed('not complete') : undefined));
    const chained = run(['  - name: second', ...BUG_ROUTE.slice(0, 1).map((l) => l.replace(
      '  - chain:', '    chain:')), ...BUG_ROUTE.slice(1)]);
    assert.equal(chained.code, 1);
    assert.equal(chained.lines[0], 'runs compositions/defaults/example.yaml second '
      + 'wingfoil@0.3.0: fail at feedback-ingest[1].end: wingfoil workflow end '
      + 'feedback-ingest-1-plan exit 1: error: not complete');
    const single = run(['  - main: feedback-ingest', '    steps: [start, end]']);
    assert.match(single.lines[0] ?? '', /feedback-ingest wingfoil@0\.3\.0: fail at end: /);
  });

  it('adds an element outside a step, and submits it by its label (criteria 2, 3)', () => {
    const result = run(['  - main: feedback-review', '    steps:', '      - start',
      '      - add: { type: decision-log, title: "Route it", label: dl }',
      '      - add: { type: task, title: "Another", label: other }',
      '      - submit: dl', '      - approve: added']);
    assert.equal(result.code, 0, result.lines.join('\n'));
    const issued = commands();
    assert.ok(issued.includes('memory add --type decision-log --title Route it'), issued.join('\n'));
    assert.ok(issued.includes('memory submit decision-log-001-item'), issued.join('\n'));
    assert.ok(issued.includes('memory approve task-001-item --reason check:runs scenario approval'),
      issued.join('\n'));
  });

  it('writes fields that parse back as given, keeping every other line (criterion 4)', () => {
    const result = run(['  - main: feedback-ingest', '    steps:', '      - start',
      '      - add: { type: feedback, title: "T", step: feedback-ingest.capture, label: item }',
      '      - set:', '          element: item', '          fields:',
      '            source: "true"', '            kind: "42"', '            target: "#x"',
      '            context: "a: b"', '            tags: [one, "null"]',
      '          body: "A line."', '      - submit: item']);
    assert.equal(result.code, 0, result.lines.join('\n'));
    const text = seen.get('feedback-001-item') ?? '';
    const [, front = ''] = text.split('---\n');
    assert.deepEqual(parseYaml(front), { id: 'feedback-001-item', type: 'feedback',
      status: 'draft', source: 'true', tags: ['one', 'null'], kind: '42', target: '#x',
      context: 'a: b' });
    for (const kept of ['---\nid: feedback-001-item\ntype: feedback\nstatus: draft\n'
      + '# who or what produced it\n', '\n## Body\n']) assert.ok(text.includes(kept), text);
    assert.ok(text.endsWith('\n## Body\nA line.\n'), text);
    assert.equal(seen.get('status'), '', 'committed');
  });

  it('writes a file whose path and text name a label\'s id, and leaves other $ text (5, 6)', () => {
    const result = run(['  - main: feedback-review', '    steps:', '      - start',
      '      - add: { type: feedback, title: "T", label: item }',
      '      - write: { path: notes/$item.id.md, text: "Cites $item.id, not $item.idx or $5." }',
      '      - submit: item']);
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.match(seen.get('tracked') ?? '', /^notes\/feedback-001-item\.md$/m);
    assert.equal(seen.get('note'), 'Cites feedback-001-item, not $item.idx or $5.');
    assert.equal(seen.get('status'), '', 'committed');
  });

  it('fails a set on a frontmatter that does not parse, writing nothing', () => {
    wingfoil.breaks.push((args, cwd) => {
      if (args[0] === 'memory' && args[1] === 'add') {
        mkdirSync(join(cwd, 'docs'), { recursive: true });
        writeFileSync(join(cwd, 'docs', 'bad.md'), '---\nid: bad\nkind: [open\n---\n');
        return ok({ id: 'bad', path: 'docs/bad.md' });
      }
      return undefined;
    });
    const result = run(['  - main: feedback-review', '    steps:', '      - start',
      '      - add: { type: feedback, title: "T", label: item }',
      '      - set: { element: item, fields: { source: x } }']);
    assert.equal(result.code, 1);
    assert.match(result.lines[0] ?? '', /fail at set: docs\/bad\.md: the frontmatter does not parse/);
  });

  it('removes each overlay\'s merged tree once its scenario is done (criterion 8)', () => {
    write('packs/base/pack.yaml', 'id: base\n');
    for (const name of ['one', 'two']) {
      write(`tests/fixtures/${name}/packs/governance/${name}/pack.yaml`, `id: governance/${name}\n`);
      write(`tests/fixtures/${name}/compositions/c/example.yaml`, 'format: 1\npacks: []\n');
      write(`tests/fixtures/runs/${name}.yaml`, ['format: 1', `overlay: tests/fixtures/${name}`,
        `compositions: tests/fixtures/${name}/compositions`, ...ROUTE_HEAD.slice(2),
        '  - main: a', '    steps: [start]', ''].join('\n'));
    }
    const trees: string[] = [];
    const result = runRuns(['--tree', tree, join(tree, 'tests/fixtures/runs/one.yaml'),
      join(tree, 'tests/fixtures/runs/two.yaml')], { ...options, compose: (t, e, p, o) => {
      for (const earlier of trees) assert.ok(!existsSync(earlier), `${earlier} removed`);
      trees.push(t);
      return routeCompose(t, e, p, o);
    } });
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.equal(trees.length, 2);
  });

  it('fails a write whose path, once its tokens expand, is under .git/', () => {
    wingfoil.breaks.push((args) => (args[0] === 'memory' && args[1] === 'add'
      ? ok({ id: '.git', path: 'docs/x.md' }) : undefined));
    const result = run(['  - main: feedback-review', '    steps:', '      - start',
      '      - add: { type: feedback, title: "T", label: item }',
      '      - write: { path: $item.id/hooks/x, text: "x" }']);
    assert.equal(result.code, 1);
    assert.match(result.lines[0] ?? '', /fail at write: \.git\/hooks\/x is under \.git\/$/);
  });

  it('fails a set whose element file is missing', () => {
    wingfoil.breaks.push((args, cwd) => {
      if (args[0] === 'memory' && args[1] === 'add') {
        assert.ok(existsSync(cwd));
        return ok({ id: 'feedback-009-gone', path: 'docs/memory/feedback/gone.md' });
      }
      return undefined;
    });
    const result = run(['  - main: feedback-review', '    steps:', '      - start',
      '      - add: { type: feedback, title: "T", label: item }',
      '      - set: { element: item, body: "x" }']);
    assert.equal(result.code, 1);
    assert.match(result.lines[0] ?? '', /fail at set: docs\/memory\/feedback\/gone\.md: no element file$/);
  });

  it('refuses a scenario that misuses labels, tokens or instance steps (criteria 1, 2, 6)', () => {
    const steps = (lines: string[]): string[] => ['  - main: feedback-review', '    steps:',
      ...lines.map((line) => `      - ${line}`)];
    refused(steps(['start', 'submit: item', 'add: { type: task, title: "T", label: item }']),
      /routes\.yaml: runs\[0\]\.steps\[1\]\.submit: label item before its add/);
    refused(steps(['start', 'submit: item']), /runs\[0\]\.steps\[1\]\.submit: unknown label item/);
    refused(steps(['start', 'submit: added']), /runs\[0\]\.steps\[1\]\.submit: no element added before/);
    refused(steps(['start', 'add: { type: task, title: "T" }',
      'set: { element: added, body: "$item.id" }', 'add: { type: task, title: "U", label: item }']),
    /runs\[0\]\.steps\[2\]\.set: label item before its add/);
    refused(steps(['start', 'add: { type: task, title: "T", label: item }',
      'add: { type: task, title: "U", label: item }']), /runs\[0\]\.steps\[2\]\.add\.label: label item added twice/);
    refused(steps(['start', 'add: { type: task, title: "T", label: added }']), /add\.label: "added" names the last element added/);
    refused(steps(['start', 'add: { type: task, title: "T", label: Bad_Id }']), /add\.label: a plain id is required/);
    refused(steps(['next: x', 'start']), /runs\[0\]\.steps\[0\]\.next: before the link's start/);
    refused(['  - chain:', '      - main: a', '        steps: [start]', '      - main: b',
      '        steps: [end]'], /runs\[0\]\.chain\[1\]\.steps\[0\]\.end: before the link's start/);
    refused(['  - chain: []'], /runs\[0\]\.chain: a non-empty list is required/);
    refused(steps(['add: { type: task, title: "T", step: s.capture }', 'start']),
      /runs\[0\]\.steps\[0\]\.add: before the link's start/);
    refused(['  - name: one', '    main: a', '    steps: [start]', '  - name: one', '    main: b',
      '    steps: [start]'], /runs\[0\]\.name: one also names runs\[1\]/);
    refused(['  - name: a', '    main: b', '    steps: [start]', '  - main: a',
      '    steps: [start]'], /runs\[0\]\.name: a also names runs\[1\]/);
    refused(['  - name: Not_Plain', '    main: a', '    steps: [start]'], /runs\[0\]\.name: a plain id is required/);
    refused(steps(['start', 'add: { type: task, title: "T" }', 'finalize: k@$nobody.id']), /finalize: unknown label nobody/);
  });

  it('refuses a set or a write it cannot make (criteria 4, 5)', () => {
    const steps = (line: string): string[] => ['  - main: feedback-review', '    steps:',
      '      - start', '      - add: { type: task, title: "T", label: item }', `      - ${line}`];
    refused(steps('set: { element: item }'), /set: fields or body is required/);
    refused(steps('set: { element: item, fields: {} }'), /set\.fields: a non-empty mapping is required/);
    refused(steps('set: { element: item, fields: { kind: 1 } }'), /set\.fields\.kind: a string or a list of strings is required/);
    refused(steps('set: { element: item, fields: { status: closed } }'), /set\.fields\.status: never written/);
    refused(steps('set: { element: item, fields: { id: x } }'), /set\.fields\.id: never written/);
    refused(steps('write: { path: ../x.md, text: "x" }'), /write\.path: must stay inside the repository/);
    refused(steps('write: { path: .git/hooks/x, text: "x" }'), /write\.path: never under \.git\//);
    refused(steps('write: { path: ./.git/config, text: "x" }'), /write\.path: never under \.git\//);
  });

  it('runs a run only on the compositions its only lists, composing no other (criterion 7)', () => {
    composition('other');
    composition('third');
    const composed: string[] = [];
    const result = run(['  - main: feedback-ingest', '    only: [other]', '    steps: [start]',
      '  - main: feedback-review', '    steps: [start]',
      '  - adopt: { template: Scrum, remove: { workflows: [], directives: [] } }',
      '    only: [other]'], { compose: (t, e, p, o) => {
      composed.push(o);
      return routeCompose(t, e, p, o);
    } });
    const lines = result.lines.filter((line) => !line.includes(' adopt:'));
    assert.deepEqual(lines, [
      'runs compositions/defaults/example.yaml feedback-review wingfoil@0.3.0: pass',
      'runs compositions/other/example.yaml feedback-ingest wingfoil@0.3.0: pass',
      'runs compositions/other/example.yaml feedback-review wingfoil@0.3.0: pass',
      'runs compositions/third/example.yaml feedback-review wingfoil@0.3.0: pass',
      'runs: 5 runs, 0 failed',
    ]);
    assert.equal(result.lines.filter((line) => line.includes(' adopt:Scrum ')).length, 1);
    wingfoil.calls.length = 0;
    composed.length = 0;
    const narrow = run(['  - main: feedback-ingest', '    only: [other]', '    steps: [start]'],
      { compose: (t, e, p, o) => {
        composed.push(o);
        return routeCompose(t, e, p, o);
      } });
    assert.equal(narrow.lines.at(-1), 'runs: 1 run, 0 failed');
    assert.equal(composed.length, 1, 'only the composition a run selects is composed');
    refused(['  - main: a', '    only: [nowhere]', '    steps: [start]'], /runs\[0\]\.only\[0\]: no composition nowhere under compositions/);
    refused(['  - main: a', '    only: []', '    steps: [start]'], /runs\[0\]\.only: a non-empty list is required/);
    refused(['  - main: a', '    only: [other, other]', '    steps: [start]'], /runs\[0\]\.only\[1\]: other given twice/);
  });

  describe('an overlay (criterion 8)', () => {
    const overlayHead = (dir: string): string[] => ['format: 1', `overlay: ${dir}`,
      `compositions: ${dir}/compositions`, ...ROUTE_HEAD.slice(2)];
    const overlayRun = (dir: string, extra: Partial<RunsOptions> = {}):
    ReturnType<typeof runRuns> => runRuns(['--tree', tree,
      scenario(['  - main: feedback-ingest', '    steps: [start]'], overlayHead(dir))],
    { ...options, ...extra });

    beforeEach(() => {
      write('packs/base/pack.yaml', 'id: base\n');
      write('catalog.yaml', 'format: 1\n');
      write('compat.yaml', 'format: 1\n');
      write('tests/fixtures/up/packs/governance/up/pack.yaml', 'id: governance/up\n');
      write('tests/fixtures/up/compositions/up/example.yaml', ['format: 1', 'id: up',
        'title: "up"', 'description: "A fixture."', 'packs:', '  - governance/up@^1',
        'parameters:', '  approver_email: "lead@demo.invalid"', ''].join('\n'));
    });

    it('composes on a merged tree holding both trees\' packs, removed afterwards', () => {
      const trees: string[] = [];
      const result = overlayRun('tests/fixtures/up', { compose: (t, e, p, o) => {
        trees.push(t);
        assert.ok(existsSync(join(t, 'packs', 'base', 'pack.yaml')), 'the tree\'s pack');
        assert.ok(existsSync(join(t, 'packs', 'governance', 'up', 'pack.yaml')), 'the overlay\'s');
        assert.ok(existsSync(join(t, 'catalog.yaml')) && existsSync(join(t, 'compat.yaml')));
        return routeCompose(t, e, p, o);
      } });
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.deepEqual(result.lines, [
        'runs tests/fixtures/up/compositions/up/example.yaml feedback-ingest wingfoil@0.3.0: pass',
        'runs: 1 run, 0 failed',
      ]);
      assert.equal(trees.length, 1);
      assert.notEqual(trees[0], tree);
      assert.ok(!existsSync(trees[0] ?? ''), 'the merged tree removed');
    });

    it('shows no scratch path when a composition on the merged tree fails', () => {
      let merged = '';
      const result = overlayRun('tests/fixtures/up', { compose: (t) => {
        merged = t;
        throw new Error(`${t}/packs/governance/up/pack.yaml: broken, and ${t}/catalog.yaml`);
      } });
      assert.equal(result.code, 1);
      const line = result.lines[0] ?? '';
      assert.ok(merged !== '' && !line.includes(merged), line);
      assert.ok(!line.includes(tmpdir()) && !line.includes('validate-overlay-'), line);
      assert.match(line, /tests\/fixtures\/up\/packs\/governance\/up\/pack\.yaml: broken/);
      assert.ok(!existsSync(merged));
    });

    it('refuses an overlay outside tests/fixtures/, under examples/, missing, or shadowing', () => {
      write('elsewhere/packs/x/pack.yaml', 'id: x\n');
      write('tests/fixtures/examples/o/packs/y/pack.yaml', 'id: y\n');
      write('tests/fixtures/shadow/packs/base/pack.yaml', 'id: base\n');
      write('tests/fixtures/shadow/compositions/s/example.yaml', 'format: 1\n');
      write('elsewhere/compositions/e/example.yaml', 'format: 1\n');
      write('tests/fixtures/examples/o/compositions/e/example.yaml', 'format: 1\n');
      const outside = overlayRun('elsewhere');
      assert.equal(outside.code, 3, outside.lines.join('\n'));
      assert.match(outside.lines[0] ?? '', /routes\.yaml: overlay: not under tests\/fixtures\//);
      const examples = overlayRun('tests/fixtures/examples/o');
      assert.equal(examples.code, 3);
      assert.match(examples.lines[0] ?? '', /routes\.yaml: overlay: under tests\/fixtures\/examples\//);
      const missing = overlayRun('tests/fixtures/none');
      assert.equal(missing.code, 2);
      assert.match(missing.lines[0] ?? '', /routes\.yaml: overlay: not a directory/);
      const shadow = overlayRun('tests/fixtures/shadow');
      assert.equal(shadow.code, 3);
      assert.match(shadow.lines[0] ?? '', /routes\.yaml: overlay: packs\/base shadows the tree's packs\/base/);
      assert.deepEqual(commands(), []);
    });
  });
});

describe('realCompose on an overlay\'s merged tree (task-095 criterion 9)', () => {
  it('composes an overlay pack and selects its releases on the merged tree', () => {
    const dir = mkdtempSync(join(tmpdir(), 'runs-overlay-test-'));
    try {
      const tree = join(dir, 'tree');
      cpSync(join(FIXTURES, 'compose', 'tree'), tree, { recursive: true });
      const flow = join(tree, 'packs', 'methodology', 'flow');
      const target = join(tree, 'tests', 'fixtures', 'flow-overlay', 'packs', 'methodology',
        'flow');
      cpSync(flow, target, { recursive: true });
      rmSync(flow, { recursive: true });
      const overlay = openOverlay(tree, 'tests/fixtures/flow-overlay');
      assert.ok('merged' in overlay, JSON.stringify(overlay));
      overlay.packs = treeLayout(overlay.dir).packs;
      try {
        assert.deepEqual(mergeOverlay(tree, overlay), []);
        const out = join(dir, 'out');
        const composed = realCompose(overlay.merged, ['methodology/flow@^1'],
          { project_name: 'Demo' }, out);
        assert.ok(composed.releases.length > 0);
        assert.ok(existsSync(join(out, '.wingfoil', 'workflows', 'built-in', 'flow-board.yaml')));
      } finally {
        rmSync(overlay.root, { recursive: true, force: true });
      }
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('setFields (task-095 criterion 4)', () => {
  const file = (front: string[], body = '\nBody.\n'): string => ['---', ...front, '---'].join('\n')
    + `\n${body}`;

  it('replaces a block list and a block scalar with a blank line, keeping a comment', () => {
    const text = file(['id: x', 'tags:', '  - a', '- b', '# kept', 'note: |', '  one', '',
      '  two', 'tag: t']);
    const out = setFields(text, [['tags', ['c']], ['note', 'line\nother']], undefined, 'x.md');
    assert.equal(out, file(['id: x', 'tags:', '  - c', '# kept', 'note: |-', '  line', '  other',
      'tag: t']));
  });

  it('tells a key from one it is a prefix of, and adds a new key after the last one', () => {
    const text = file(['tags: [a]', 'tag: t', '# trailing']);
    const out = setFields(text, [['tag', 'u'], ['kind', 'defect']], 'A line.', 'x.md');
    assert.equal(out, file(['tags: [a]', 'tag: u', 'kind: defect', '# trailing'],
      '\nBody.\nA line.\n'));
  });

  it('refuses a file with no frontmatter, a BOM or CRLF line endings', () => {
    assert.throws(() => setFields('# Title\n', [['a', 'b']], undefined, 'x.md'), /x\.md: no frontmatter/);
    assert.throws(() => setFields('\uFEFF---\na: b\n---\n', [['a', 'c']], undefined, 'x.md'),
      /a BOM or CRLF/);
    assert.throws(() => setFields('---\r\na: b\r\n---\r\n', [['a', 'c']], undefined, 'x.md'),
      /a BOM or CRLF/);
  });
});

// task-097 (plan-076 point 4): the scenarios of governance/feedback. WingFoil checks neither
// `resulting` nor a citation, so a route that drops them still passes on the real release.
type ScenarioStep = Record<string, Record<string, unknown> | string>;
interface ScenarioLink { main: string; steps: (ScenarioStep | string)[] }
interface ScenarioRun {
  name?: string; main?: string; only?: string[]; steps?: unknown[]; chain?: ScenarioLink[];
  adopt?: unknown;
}
interface FeedbackScenario { compositions: string; overlay?: string; runs: ScenarioRun[] }

const feedbackScenario = (file: string): FeedbackScenario =>
  parseYaml(readFileSync(join(FIXTURES, 'runs', file), 'utf8')) as FeedbackScenario;

/** The values of one kind of step in a run's chain, in order. */
function stepsOf(run: ScenarioRun | undefined, kind: string): Record<string, unknown>[] {
  return (run?.chain ?? []).flatMap((link) => link.steps).flatMap((step) => {
    const value = typeof step === 'string' ? undefined : step[kind];
    return typeof value === 'object' ? [value] : [];
  });
}

/** The elements one kind of step names in a run's chain (`submit`, `approve`), in order. */
function namedBy(run: ScenarioRun, kind: string): unknown[] {
  return (run.chain ?? []).flatMap((link) => link.steps).flatMap((step) =>
    (typeof step === 'string' || step[kind] === undefined ? [] : [step[kind]]));
}

/** The `set` steps of a run on one label, in order. */
function setsOn(run: ScenarioRun, label: string): Record<string, unknown>[] {
  return stepsOf(run, 'set').filter((set) => set['element'] === label);
}

/** The fields a run writes on one label, merged. */
function fieldsOn(run: ScenarioRun, label: string): Record<string, unknown> {
  return Object.assign({}, ...setsOn(run, label).map((set) => set['fields'] ?? {})) as
    Record<string, unknown>;
}

const bodiesOn = (run: ScenarioRun, label: string): string[] =>
  setsOn(run, label).flatMap((set) => (typeof set['body'] === 'string' ? [set['body']] : []));

/** The route's closing steps: the route step finalized, the item submitted, the run ended. */
function assertCloses(run: ScenarioRun, key: string): void {
  const last = run.chain?.at(-1)?.steps ?? [];
  assert.deepEqual(last.slice(-3), [{ finalize: key }, { submit: 'item' }, 'end'], run.name);
}

const ITEM_ROUTE = 'feedback-item.route@feedback:$item.id';
const INGEST = 'feedback-ingest';
const REVIEW = 'feedback-review';
const DL_INGEST = 'decision-log-ingest';
const DL_CAPTURE = 'decision-log-ingest.capture';

describe('tests/fixtures/runs/feedback.yaml (task-097)', () => {
  const scenario = (): FeedbackScenario => feedbackScenario('feedback.yaml');
  const route = (name: string): ScenarioRun => {
    const found = scenario().runs.find((run) => run.name === name);
    assert.ok(found !== undefined, name);
    return found;
  };

  it('starts every main the pack ships on the README examples', () => {
    assert.equal(scenario().compositions, 'tests/fixtures/examples/feedback');
    const starts = scenario().runs.filter((run) => run.main !== undefined);
    assert.deepEqual(starts, [
      { main: INGEST, steps: ['start'] },
      { main: REVIEW, steps: ['start'] },
      { main: 'feedback-bug-route', only: ['with-software', 'added-outcome'], steps: ['start'] },
    ]);
  });

  const ROUTES = [
    { name: 'route-decision-log', only: 'added-outcome', outcome: 'decision-log',
      mains: [INGEST, DL_INGEST, REVIEW], target: 'dl', type: 'decision-log', step: DL_CAPTURE,
      moved: true, names: 'the feedback item' },
    { name: 'route-task', only: 'added-outcome', outcome: 'task', mains: [INGEST, REVIEW],
      target: 'routed', type: 'task', step: undefined, moved: false, names: 'the feedback item' },
    { name: 'route-added-outcome', only: 'added-outcome', outcome: 'deferred',
      mains: [INGEST, DL_INGEST, REVIEW], target: 'dl', type: 'decision-log', step: DL_CAPTURE,
      moved: true, names: 'deferred' },
    { name: 'route-bug', only: 'with-software', outcome: 'bug',
      mains: [INGEST, 'bug-ingest', 'feedback-bug-route'], target: 'bug', type: 'bug',
      step: 'bug-ingest.capture', moved: true, names: 'the feedback item' },
    { name: 'route-would-be-bug', only: 'defaults', outcome: 'decision-log',
      mains: [INGEST, DL_INGEST, REVIEW], target: 'dl', type: 'decision-log', step: DL_CAPTURE,
      moved: true, names: 'would-be bug' },
  ];

  for (const row of ROUTES) {
    it(`${row.name}: the item routed to its element, which cites it, and closed`, () => {
      const run = route(row.name);
      assert.deepEqual(run.only, [row.only]);
      assert.deepEqual(run.chain?.map((link) => link.main), row.mains);
      const fields = fieldsOn(run, 'item');
      assert.equal(fields['outcome'], row.outcome);
      for (const key of ['kind', 'target', 'source', 'context']) {
        assert.ok(typeof fields[key] === 'string' && fields[key] !== '', key);
      }
      assert.equal(fields['resulting'], `$${row.target}.id`);
      assert.ok(bodiesOn(run, row.target).some((body) => body.includes('$item.id')),
        'the routed element cites the item');
      const added = stepsOf(run, 'add').find((add) => add['label'] === row.target);
      assert.equal(added?.['type'], row.type);
      assert.equal(added?.['step'], row.step, 'added by its own main, or outside a step');
      assert.ok(bodiesOn(run, row.target).some((body) => body.includes(row.names)), row.names);
      // The routed element moves through its own main; a task stays in draft.
      assert.deepEqual(namedBy(run, 'submit'),
        row.moved ? ['item', row.target, 'item'] : ['item', 'item']);
      assert.deepEqual(namedBy(run, 'approve'), row.moved ? ['item', row.target] : ['item']);
      assertCloses(run, row.name === 'route-bug'
        ? 'feedback-bug-item.bug@feedback:$item.id' : ITEM_ROUTE);
    });
  }

  it('route-declined: no routed element, the reason in resulting', () => {
    const run = route('route-declined');
    assert.deepEqual(run.only, ['added-outcome']);
    assert.deepEqual(run.chain?.map((link) => link.main), [INGEST, REVIEW]);
    const fields = fieldsOn(run, 'item');
    assert.equal(fields['outcome'], 'declined');
    assert.match(String(fields['resulting']), /^n\/a — \S/);
    assert.ok(bodiesOn(run, 'item').some((body) => body.startsWith('Declined: ')),
      'the reason in the body too');
    assert.deepEqual(stepsOf(run, 'add').map((add) => add['label']), ['item']);
    assertCloses(run, ITEM_ROUTE);
  });

  it('route-would-be-bug: the item and the decision-log both name the would-be bug', () => {
    const run = route('route-would-be-bug');
    for (const label of ['item', 'dl']) {
      assert.ok(bodiesOn(run, label).some((body) => /would-be bug/.test(body)), label);
    }
  });
});

/** What the channel directive states of a note, whole: spec-003 §5.1 and dl-163's subset. */
const NOTE_FORMAT = [
  '- **Where:** `docs/upstream/plover/<feedback id>.md`, one file per item.',
  '- **Frontmatter:** these six fields, in this order:',
  '  - `id`, the note\'s id;',
  '  - `title`, what the note is about;',
  '  - `kind`: `defect`, `gap` or `request`;',
  '  - `status`: `open`, `needs-info`, `captured`, `resolved`, `declined` or `duplicate`;',
  '  - `wingfoil_version`, the version the note was observed on;',
  '  - `answered_by`, a list of ids, empty until the upstream answers.',
  '- **Body:** the sections `## Observed` and `## Expected`, and no `## Replies`.',
  '- **Kinds:** `defect`, `gap` and `request` map one to one; `observation` becomes `request`.',
  '- **Citation:** the note\'s body cites the feedback id, and the item\'s `resulting` names the '
    + 'note\'s',
  '  path.',
  '',
].join('\n');

describe('tests/fixtures/runs/feedback-upstream.yaml (task-097, FA-8)', () => {
  const scenario = (): FeedbackScenario => feedbackScenario('feedback-upstream.yaml');
  const PACK = join(FIXTURES, 'feedback-exit', 'packs', 'governance', 'feedback-upstream');
  const directive = (): string =>
    readFileSync(join(PACK, 'directives', 'plover-vendor-channel.md'), 'utf8');
  const noteStep = (): { path: string; text: string } => {
    const [found] = stepsOf(scenario().runs[0], 'write');
    assert.ok(found !== undefined, 'the note is written');
    return found as unknown as { path: string; text: string };
  };

  it('drives route-upstream-note on the upstream composition of feedback-exit', () => {
    const { overlay, compositions, runs } = scenario();
    assert.equal(overlay, 'tests/fixtures/feedback-exit');
    assert.equal(compositions, 'tests/fixtures/feedback-exit/compositions');
    assert.equal(runs.length, 1);
    const [run] = runs;
    assert.ok(run !== undefined);
    assert.equal(run.name, 'route-upstream-note');
    assert.deepEqual(run.only, ['upstream']);
    assert.deepEqual(run.chain?.map((link) => link.main), [INGEST, REVIEW]);
    const fields = fieldsOn(run, 'item');
    assert.equal(fields['outcome'], 'upstream-note');
    assert.equal(fields['target'], 'upstream:plover-vendor');
    assert.equal(fields['resulting'], noteStep().path);
    assertCloses(run, ITEM_ROUTE);
    const composition = parseYaml(readFileSync(join(FIXTURES, 'feedback-exit', 'compositions',
      'upstream', 'example.yaml'), 'utf8')) as { parameters: Record<string, string> };
    assert.ok(composition.parameters['feedback_targets']?.split(', ')
      .includes('upstream:plover-vendor'), 'the composition allows the target (spec-003 §5.3)');
  });

  it('writes the note where the channel directive says, in its format, citing the item', () => {
    const { path, text } = noteStep();
    assert.equal(path, 'docs/upstream/plover/$item.id.md');
    assert.ok(directive().includes('`docs/upstream/plover/<feedback id>.md`'), 'the stated path');
    const fields = readFrontmatter(text, path)?.data as Record<string, unknown> | undefined;
    assert.ok(fields !== undefined, 'the note has a frontmatter');
    const body = text.slice(text.indexOf('\n---\n', 4) + 5);
    const notes = [{ file: path, fields, body }];
    assertFields(notes);
    assertSections(notes);
    assert.ok(body.includes('$item.id'), 'the body cites the item');
    assert.equal(fields['kind'], fieldsOn(scenario().runs[0] as ScenarioRun, 'item')['kind'],
      'a gap maps one to one');
  });

  it('ships the channel as spec-003 §5.1 asks, which the lint reads only in the tree\'s packs',
    () => {
      const text = directive();
      const data = readFrontmatter(text, 'plover-vendor-channel.md')?.data as
        { tags?: string[] } | undefined;
      assert.deepEqual(data?.tags, ['feedback-channel']);
      assert.ok(text.split('\n').includes('Serves the target `upstream:plover-vendor`.'));
      assert.equal(text.slice(text.indexOf('- **Where:**')), NOTE_FORMAT);
      const roles = parseYaml(readFileSync(join(PACK, 'fragments', 'roles.yaml'), 'utf8')) as
        { assignments: Record<string, string[]> };
      assert.deepEqual(roles.assignments['facilitator'], ['plover-vendor-channel']);
      const pack = parseYaml(readFileSync(join(PACK, 'pack.yaml'), 'utf8')) as
        { requires: string[] };
      assert.ok(pack.requires.includes('governance/feedback@^1'));
    });
});

describe('tests/fixtures/runs/adoption-feedback.yaml (task-097)', () => {
  it('adopts the examples that compose software, once per init template', () => {
    const data = feedbackScenario('adoption-feedback.yaml');
    assert.equal(data.compositions, 'tests/fixtures/examples/feedback');
    const only = ['with-software', 'added-outcome'];
    const remove = ADOPTION_REMOVE;
    assert.deepEqual(data.runs, [{ only, adopt: { template: 'Scrum', remove } },
      { only, adopt: { template: 'Kanban', remove } }]);
  });
});

// task-105 (plan-086 point 3): governance/wingfoil-dogfood's route through its channel, composed
// from the tree's packs with no overlay (WD-4), the note's format (WD-5), and the adoption run
// prepared for the pack's first release (dl-032 E3).
describe('tests/fixtures/runs/wingfoil-dogfood.yaml (task-105, WD-4, WD-5)', () => {
  const scenario = (): FeedbackScenario => feedbackScenario('wingfoil-dogfood.yaml');
  const EXAMPLES = join(FIXTURES, 'examples', 'wingfoil-dogfood');
  const PACK = join(REPO_ROOT, 'packs', 'governance', 'wingfoil-dogfood');
  const channel = (): string =>
    readFileSync(join(PACK, 'directives', 'wingfoil-channel.md'), 'utf8');
  const parameters = (id: string): Record<string, string> =>
    (parseYaml(readFileSync(join(EXAMPLES, id, 'example.yaml'), 'utf8')) as
      { parameters: Record<string, string> }).parameters;
  /** The example's inbox path: its parameter, else the pack's default. */
  const inbox = (id: string): string => {
    const given = parameters(id)['wingfoil_inbox_path'];
    if (given !== undefined) return given;
    const pack = parseYaml(readFileSync(join(PACK, 'pack.yaml'), 'utf8')) as
      { parameters: Record<string, { default?: string }> };
    const declared = pack.parameters['wingfoil_inbox_path']?.default;
    assert.ok(declared !== undefined, 'the pack declares a default inbox path');
    return declared;
  };
  const ROUTES = [
    { name: 'route-upstream-wingfoil-defaults', id: 'defaults', kind: 'defect',
      noteKind: 'defect' },
    { name: 'route-upstream-wingfoil-with-software', id: 'with-software', kind: 'observation',
      noteKind: 'request' },
  ];

  it('drives one route per README example, from the tree\'s packs with no overlay', () => {
    const { overlay, compositions, runs } = scenario();
    assert.equal(overlay, undefined);
    assert.equal(compositions, 'tests/fixtures/examples/wingfoil-dogfood');
    assert.deepEqual(runs.map((run) => [run.name, run.only]),
      ROUTES.map((row) => [row.name, [row.id]]));
  });

  for (const row of ROUTES) {
    describe(row.name, () => {
      const run = (): ScenarioRun => {
        const found = scenario().runs.find((each) => each.name === row.name);
        assert.ok(found !== undefined, row.name);
        return found;
      };
      const noteStep = (): { path: string; text: string } => {
        const [found] = stepsOf(run(), 'write');
        assert.ok(found !== undefined, 'the note is written');
        return found as unknown as { path: string; text: string };
      };

      it('routes the item to upstream:wingfoil and closes it, resulting naming the note', () => {
        assert.deepEqual(run().chain?.map((link) => link.main), [INGEST, REVIEW]);
        const fields = fieldsOn(run(), 'item');
        assert.equal(fields['target'], 'upstream:wingfoil');
        assert.equal(fields['outcome'], 'upstream-note');
        assert.equal(fields['kind'], row.kind);
        for (const key of ['source', 'context']) {
          assert.ok(typeof fields[key] === 'string' && fields[key] !== '', key);
        }
        assert.equal(fields['resulting'], noteStep().path);
        assertCloses(run(), ITEM_ROUTE);
        assert.ok(parameters(row.id)['feedback_targets']?.split(', ')
          .includes('upstream:wingfoil'), 'the example allows the target (spec-003 §5.3)');
      });

      it('writes the note in the example\'s inbox, in dl-163\'s format, citing the item', () => {
        const { path, text } = noteStep();
        assert.ok(path.startsWith(`${inbox(row.id)}/`), `${path} is in ${inbox(row.id)}`);
        assert.match(path.slice(inbox(row.id).length + 1), /^F-\d{3}-[a-z0-9-]+\.md$/);
        const fields = readFrontmatter(text, path)?.data as Record<string, unknown> | undefined;
        assert.ok(fields !== undefined, 'the note has a frontmatter');
        const body = text.slice(text.indexOf('\n---\n', 4) + 5);
        const notes = [{ file: path, fields, body }];
        assertFields(notes);
        assertSections(notes);
        assert.ok(body.includes('$item.id'), 'the body cites the item');
        assert.equal(fields['kind'], row.noteKind, 'the kind mapped as the channel says');
      });
    });
  }

  it('relies on the channel as the pack ships it: the path form and the kinds\' mapping', () => {
    const text = channel();
    assert.ok(text.split('\n').includes('Serves the target `upstream:wingfoil`.'));
    assert.ok(text.includes('`{{wingfoil_inbox_path}}/F-<nnn>-<slug>.md`'), 'the path form');
    assert.ok(text.includes('`observation` becomes `request`'), 'the mapping');
  });
});

describe('tests/fixtures/runs/adoption-wingfoil-dogfood.yaml (task-105)', () => {
  it('adopts the example that composes software, once per init template', () => {
    const data = feedbackScenario('adoption-wingfoil-dogfood.yaml');
    assert.equal(data.compositions, 'tests/fixtures/examples/wingfoil-dogfood');
    const only = ['with-software'];
    const remove = ADOPTION_REMOVE;
    assert.deepEqual(data.runs, [{ only, adopt: { template: 'Scrum', remove } },
      { only, adopt: { template: 'Kanban', remove } }]);
  });
});
