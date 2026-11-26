import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync }
  from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, delimiter, join, relative } from 'node:path';
import { describe, it } from 'node:test';

import { runCheckRelease } from '../src/check-release';
import type { CheckReleaseOptions, CheckReleaseResult, Outcome } from '../src/check-release';
import { TestRepo } from './support/git-repo';

/** The commands of one leg after the versions, as the report shows them (dl-054 › Context). */
function legCommands(first: boolean): string[] {
  return [
    'npm ci', 'npm run build',
    ...(first ? ['npm run validate:publication -- --evidence'] : []),
    'npm test', 'npm run lint', 'npm run check:pins', 'npm run check:schemas',
    'npm run check:packs', 'npm run index -- --check', 'npm run validate',
    'npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden',
    'npm run validate -- --overlay tests/fixtures/software-exit',
    'npm run validate -- --overlay tests/fixtures/scrum-exit',
    'npm run validate -- --overlay tests/fixtures/kanban-exit',
    'npm run validate -- --overlay tests/fixtures/feedback-exit',
    'npm run -s wingfoil -- workflow list', 'npm run check:runs', 'npm audit --omit=dev',
    'npm audit (src/matrix/wingfoil-0.3.0)', 'npm audit (src/matrix/wingfoil-0.3.2)',
  ];
}

const VERSIONS = ['node --version', 'npm --version'];
const DRY_RUN = ['npm ci', 'npm run build', 'npm run publish:pack -- --pack base --dry-run'];

interface Call {
  shown: string;
  cwd: string;
  env: NodeJS.ProcessEnv;
}

/** A test repository on `main` with a tag, the matrix lockfiles, an ignored cache and a branch. */
class ReleaseRepo extends TestRepo {
  readonly outside: string;
  readonly bins: string[];

  constructor() {
    super();
    this.write('.gitignore', '.cache/\n');
    this.write('README.md', 'tree\n');
    this.write('src/matrix/wingfoil-0.3.0/package-lock.json', '{}\n');
    this.write('src/matrix/wingfoil-0.3.2/package-lock.json', '{}\n');
    this.write('src/matrix/README.md', 'not a release\n');
    this.commitAll('tree');
    this.tag('base@1.0.0');
    this.git(['branch', 'other']);
    this.write('.cache/wingfoil-matrix/0.3.0/marker', 'cache\n');
    this.outside = mkdtempSync(join(tmpdir(), 'check-release-out-'));
    this.bins = ['a', 'b'].map((name) => {
      const bin = join(this.outside, `node-${name}`);
      mkdirSync(bin);
      writeFileSync(join(bin, 'node'), '');
      writeFileSync(join(bin, 'npm'), '');
      return bin;
    });
  }

  state(): string {
    return [this.git(['rev-parse', 'HEAD']), this.git(['tag', '-l']), this.git(['branch', '-a']),
      this.git(['status', '--porcelain', '--ignored']), this.git(['remote', '-v'])].join('|');
  }

  override dispose(): void {
    rmSync(this.outside, { recursive: true, force: true });
    super.dispose();
  }
}

function withRepo(body: (repo: ReleaseRepo) => Promise<void>): () => Promise<void> {
  return async () => {
    const repo = new ReleaseRepo();
    try {
      await body(repo);
    } finally {
      repo.dispose();
    }
  };
}

type Reply = Partial<Outcome> | undefined;

/** A runner that records every command and answers `reply(shown)`, by default exit 0. */
function recorder(reply: (shown: string, cwd: string) => Reply = () => undefined):
  { calls: Call[]; runner: NonNullable<CheckReleaseOptions['runner']> } {
  const calls: Call[] = [];
  const runner = (program: string, args: string[], options: { cwd: string;
    env: NodeJS.ProcessEnv }): Promise<Outcome> => {
    const base = basename(program);
    const shown = `${base} ${args.join(' ')}`;
    calls.push({ shown, cwd: options.cwd, env: options.env });
    const answer = reply(shown, options.cwd) ?? {};
    return Promise.resolve({ code: 0, signal: null, stdout: `${shown}: done\n`, stderr: '',
      ...answer });
  };
  return { calls, runner };
}

function argv(repo: ReleaseRepo, report: string, bins = repo.bins): string[] {
  return ['--tree', repo.dir, '--pack', 'base', '--report', report,
    ...bins.flatMap((bin) => ['--node', bin])];
}

function printed(result: CheckReleaseResult): string {
  return result.lines.map((line) => `${line}\n`).join('');
}

/** A call's shown form with its directory relative to its clone, as the report writes it. */
function relativeShown(call: Call, clone: string): string {
  const where = relative(clone, call.cwd);
  return where === '' ? call.shown : `${call.shown} (${where})`;
}

/** The clone each call ran in: the directory under the run's temporary one. */
function cloneOf(call: Call): string {
  const parts = call.cwd.split('/');
  const index = parts.findIndex((part) => /^(leg-\d+|dry-run)$/.test(part));
  return parts.slice(0, index + 1).join('/');
}

describe('npm run check:release (task-106, dl-054 P1)', () => {
  it('runs the list in its order on each leg, the evidence and the dry run on the first',
    withRepo(async (repo) => {
      const { calls, runner } = recorder();
      const report = join(repo.outside, 'report.txt');
      const result = await runCheckRelease(argv(repo, report), { runner });
      assert.equal(result.code, 0, result.lines.join('\n'));
      const shown = calls.map((call) => relativeShown(call, cloneOf(call)));
      assert.deepEqual(shown, [...VERSIONS, ...legCommands(true), ...VERSIONS, ...DRY_RUN,
        ...VERSIONS, ...legCommands(false)]);
      const clones = [...new Set(calls.map(cloneOf))];
      assert.deepEqual(clones.map((clone) => basename(clone)), ['leg-1', 'dry-run', 'leg-2']);
    }));

  it('runs each leg with its own directory first on PATH and the update notifier off',
    withRepo(async (repo) => {
      const { calls, runner } = recorder();
      const result = await runCheckRelease(argv(repo, join(repo.outside, 'r.txt')), { runner });
      assert.equal(result.code, 0, result.lines.join('\n'));
      for (const call of calls) {
        const bin = basename(cloneOf(call)) === 'leg-2' ? repo.bins[1] : repo.bins[0];
        assert.ok((call.env['PATH'] ?? '').startsWith(`${bin}${delimiter}`), call.shown);
        assert.equal(call.env['npm_config_update_notifier'], 'false', call.shown);
      }
    }));

  it('clones the tree at its HEAD, on its branch, with a local main, every tag, no remote and the '
    + 'cache', withRepo(async (repo) => {
    repo.git(['checkout', '--quiet', '-b', 'scratch']);
    repo.write('README.md', 'scratch\n');
    const head = repo.commitAll('scratch commit').trim();
    const seen = new Map<string, string>();
    const { runner } = recorder((_shown, cwd) => {
      const clone = cloneOf({ shown: '', cwd, env: {} });
      if (!seen.has(clone)) {
        const git = (args: string[]): string => execFileSync('git', args, { cwd: clone,
          env: repo.env }).toString('utf8').trim();
        seen.set(clone, [git(['rev-parse', 'HEAD']), git(['symbolic-ref', '--short', 'HEAD']),
          git(['tag', '-l']), git(['remote']),
          git(['rev-parse', '--verify', '--quiet', 'refs/heads/main']) === '' ? 'no main' : 'main',
          existsSync(join(clone, '.cache', 'wingfoil-matrix', '0.3.0', 'marker')) ? 'cache'
            : 'no cache'].join('|'));
      }
      return undefined;
    });
    const result = await runCheckRelease(argv(repo, join(repo.outside, 'r.txt')), { runner });
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.equal(seen.size, 3);
    for (const value of seen.values()) {
      assert.equal(value, [head, 'scratch', 'base@1.0.0', '', 'main', 'cache'].join('|'));
    }
  }));

  it('writes the report on a pass with its fields and counts\' lines, as it prints them',
    withRepo(async (repo) => {
      const { runner } = recorder((shown) => {
        if (shown === 'node --version') return { stdout: 'v22.21.0\n' };
        if (shown === 'npm --version') return { stdout: '10.9.4\n' };
        if (shown === 'npm test') {
          return { stdout: 'TAP version 13\nok 1 - a\n# tests 3\n# suites 1\n# pass 3\n# fail 0\n' };
        }
        if (shown === 'npm run validate:publication -- --evidence') {
          return { stdout: 'checking\n## Validation\n\n- one: 0\n- two: 0\n' };
        }
        if (shown === 'npm run lint') return { stdout: '\n> pkg@1.0.0 lint\n> eslint .\n\n' };
        if (shown === 'npm run check:pins') return { stdout: '', stderr: '' };
        if (shown === 'npm run -s wingfoil -- workflow list') {
          return { stdout: 'pack-cycle\n12 workflows\n' };
        }
        if (shown === 'npm run check:runs') {
          return { stdout: '', stderr: 'scenario a\nall scenarios passed\nnpm notice New major\n' };
        }
        if (shown === 'npm ci') {
          return { stdout: 'added 300 packages\n', stderr: 'npm warn deprecated x\n' };
        }
        return undefined;
      });
      const report = join(repo.outside, 'report.txt');
      const result = await runCheckRelease(argv(repo, report), { runner });
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.equal(readFileSync(report, 'utf8'), printed(result));
      const text = result.lines.join('\n');
      const head = repo.git(['rev-parse', 'HEAD']).trim();
      assert.match(result.lines[0] ?? '', new RegExp(`commit ${head}.*pack base`));
      assert.match(text, /leg 1: node v22\.21\.0, npm 10\.9\.4/);
      assert.match(text, /- npm test: exit 0\n {2}# tests 3\n {2}# pass 3\n {2}# fail 0\n/);
      assert.match(text,
        /- npm run validate:publication -- --evidence: exit 0\n {2}## Validation\n {2}\n {2}- one: 0\n {2}- two: 0\n/);
      assert.match(text, /- npm run lint: exit 0\n {2}\(no output\)\n/);
      assert.match(text, /- npm run check:pins: exit 0\n {2}\(no output\)\n/);
      assert.match(text, /- npm run -s wingfoil -- workflow list: exit 0\n {2}12 workflows\n/);
      assert.match(text, /- npm run check:runs: exit 0\n {2}all scenarios passed\n/);
      assert.match(text, /- npm ci: exit 0\n {2}added 300 packages\n/);
      assert.match(text, /- npm audit \(src\/matrix\/wingfoil-0\.3\.2\): exit 0\n/);
      assert.match(text, /leg 1: git status --short, 0 lines/);
      assert.match(text, /dry run: node v22\.21\.0, npm 10\.9\.4/);
      assert.match(text, /leg 2: git status --short, 0 lines/);
      assert.equal(result.lines[result.lines.length - 1], 'check:release: pass');
    }));

  it('stops at the first non-zero exit, names it and writes the report', withRepo(async (repo) => {
    const { calls, runner } = recorder((shown) => (shown === 'npm run check:packs'
      ? { code: 1, stdout: 'a pack is wrong\n' } : undefined));
    const report = join(repo.outside, 'report.txt');
    const before = repo.state();
    const result = await runCheckRelease(argv(repo, report), { runner });
    assert.equal(result.code, 1);
    assert.equal(calls[calls.length - 1]?.shown, 'npm run check:packs');
    assert.match(result.lines.join('\n'), /- npm run check:packs: exit 1\n {2}a pack is wrong/);
    assert.equal(result.lines[result.lines.length - 1],
      'check:release: fail at npm run check:packs (exit 1)');
    assert.equal(readFileSync(report, 'utf8'), printed(result));
    assert.equal(repo.state(), before);
    for (const clone of new Set(calls.map(cloneOf))) assert.ok(!existsSync(clone), clone);
  }));

  it('stops at a command ended by a signal, exit 1', withRepo(async (repo) => {
    const { calls, runner } = recorder((shown) => (shown === 'npm test'
      ? { code: null, signal: 'SIGKILL', stdout: '' } : undefined));
    const result = await runCheckRelease(argv(repo, join(repo.outside, 'r.txt')), { runner });
    assert.equal(result.code, 1);
    assert.equal(calls[calls.length - 1]?.shown, 'npm test');
    assert.equal(result.lines[result.lines.length - 1],
      'check:release: fail at npm test (signal SIGKILL)');
  }));

  it('removes its clones and leaves the tree as it was after a pass', withRepo(async (repo) => {
    const { calls, runner } = recorder();
    const before = repo.state();
    const result = await runCheckRelease(argv(repo, join(repo.outside, 'r.txt')), { runner });
    assert.equal(result.code, 0, result.lines.join('\n'));
    assert.equal(repo.state(), before);
    for (const clone of new Set(calls.map(cloneOf))) assert.ok(!existsSync(clone), clone);
  }));

  it('refuses bad usage before anything runs, exit 3, no report', withRepo(async (repo) => {
    const report = join(repo.outside, 'r.txt');
    const node = repo.bins.flatMap((bin) => ['--node', bin]);
    const cases = [
      ['--tree', repo.dir, '--report', report, ...node],
      ['--tree', repo.dir, '--pack', '', '--report', report, ...node],
      ['--tree', repo.dir, '--pack', 'base', '--pack', 'base', '--report', report, ...node],
      ['--tree', repo.dir, '--pack', 'base', ...node],
      ['--tree', repo.dir, '--pack', 'base', '--report', '', ...node],
      ['--tree', repo.dir, '--pack', 'base', '--report', report, '--report', report, ...node],
      ['--tree', repo.dir, '--pack', 'base', '--report', report],
      [...argv(repo, report), '--keep'],
      ['--tree', join(repo.dir, 'src'), '--pack', 'base', '--report', report, ...node],
    ];
    const { calls, runner } = recorder();
    for (const args of cases) {
      const result = await runCheckRelease(args, { runner });
      assert.equal(result.code, 3, `${args.join(' ')}: ${result.lines.join('\n')}`);
      assert.ok(!existsSync(report), args.join(' '));
    }
    assert.equal(calls.length, 0);
  }));

  it('refuses a --node directory with no node or no npm, exit 3, no report',
    withRepo(async (repo) => {
      const report = join(repo.outside, 'r.txt');
      const { calls, runner } = recorder();
      for (const missing of ['node', 'npm']) {
        const bin = join(repo.outside, `no-${missing}`);
        mkdirSync(bin);
        writeFileSync(join(bin, missing === 'node' ? 'npm' : 'node'), '');
        const result = await runCheckRelease(argv(repo, report, [repo.bins[0] ?? '', bin]),
          { runner });
        assert.equal(result.code, 3, result.lines.join('\n'));
        assert.match(result.lines.join('\n'), new RegExp(`no ${missing}`));
        assert.ok(!existsSync(report));
      }
      assert.equal(calls.length, 0);
    }));

  it('refuses a report path inside the repository, however it is given, exit 3, no report',
    withRepo(async (repo) => {
      symlinkSync(join(repo.dir, 'src'), join(repo.outside, 'to-src'));
      symlinkSync(join(repo.dir, 'nothing.txt'), join(repo.outside, 'dangling'));
      const { calls, runner } = recorder();
      const before = repo.state();
      for (const path of [relative(process.cwd(), join(repo.dir, 'r.txt')), join(repo.dir, 'r.txt'),
        join(repo.dir, 'src', '..', 'r.txt'), join(repo.dir, '.cache', 'r.txt'),
        join(repo.outside, 'to-src', 'r.txt'), join(repo.outside, 'dangling')]) {
        const result = await runCheckRelease(argv(repo, path), { runner });
        assert.equal(result.code, 3, `${path}: ${result.lines.join('\n')}`);
        assert.equal(result.lines.length, 1, path);
        assert.match(result.lines[0] ?? '', /dl-044.*dl-054|dl-054.*dl-044/);
        assert.equal(repo.state(), before, path);
      }
      assert.ok(!existsSync(join(repo.dir, 'r.txt')));
      assert.ok(!existsSync(join(repo.dir, 'nothing.txt')));
      assert.equal(calls.length, 0);
    }));

  it('refuses a dirty tree and a missing cache, exit 1, the report written', withRepo(async (repo) => {
    const report = join(repo.outside, 'r.txt');
    const { calls, runner } = recorder();
    repo.write('README.md', 'changed\n');
    const dirty = await runCheckRelease(argv(repo, report), { runner });
    assert.equal(dirty.code, 1);
    assert.match(dirty.lines.join('\n'), /not clean/);
    assert.equal(readFileSync(report, 'utf8'), printed(dirty));
    repo.git(['checkout', '--quiet', '--', 'README.md']);
    rmSync(join(repo.dir, '.cache'), { recursive: true, force: true });
    const missing = await runCheckRelease(argv(repo, report), { runner });
    assert.equal(missing.code, 1);
    assert.match(missing.lines.join('\n'), /\.cache\/wingfoil-matrix/);
    assert.equal(readFileSync(report, 'utf8'), printed(missing));
    assert.equal(calls.length, 0);
  }));

  it('stops with exit 2 when the report cannot be created, no report', withRepo(async (repo) => {
    const report = join(repo.outside, 'missing', 'r.txt');
    const { calls, runner } = recorder();
    const result = await runCheckRelease(argv(repo, report), { runner });
    assert.equal(result.code, 2, result.lines.join('\n'));
    assert.equal(result.lines.length, 1);
    assert.ok(!existsSync(report));
    assert.equal(calls.length, 0);
  }));

  it('makes a pass a 2 when the final write fails, a failure stays a 1', withRepo(async (repo) => {
    const report = join(repo.outside, 'r.txt');
    const write = (): void => {
      throw new Error('disk full');
    };
    const pass = await runCheckRelease(argv(repo, report), { runner: recorder().runner, write });
    assert.equal(pass.code, 2);
    assert.match(pass.lines[pass.lines.length - 1] ?? '', /could not be written: disk full/);
    const failing = recorder((shown) => (shown === 'npm ci' ? { code: 1 } : undefined));
    const fail = await runCheckRelease(argv(repo, report), { runner: failing.runner, write });
    assert.equal(fail.code, 1);
    assert.match(fail.lines[fail.lines.length - 1] ?? '', /could not be written: disk full/);
  }));

  it('makes a pass a 2 when a clone cannot be removed, the clone named', withRepo(async (repo) => {
    const removed: string[] = [];
    const remove = (dir: string): void => {
      removed.push(dir);
      rmSync(dir, { recursive: true, force: true });
      throw new Error('busy');
    };
    const report = join(repo.outside, 'r.txt');
    const result = await runCheckRelease(argv(repo, report), { runner: recorder().runner, remove });
    assert.equal(result.code, 2, result.lines.join('\n'));
    assert.ok(removed.length > 0);
    assert.match(result.lines.join('\n'), /could not be removed: busy/);
    assert.equal(readFileSync(report, 'utf8'), printed(result));
  }));
});
