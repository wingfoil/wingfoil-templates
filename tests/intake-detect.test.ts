import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { describe, it } from 'node:test';

import { detectMissing } from '../src/intake-detect';
import { FIXTURES, REPO_ROOT } from './support/paths';

const CLI = join(REPO_ROOT, 'dist', 'src', 'intake-detect-cli.js');
const COMPAT = join(FIXTURES, 'intake', 'compat.yaml');
/** The releases the fixture compat.yaml records: 0.2.2 (the floor), 0.3.0, 0.3.2. */
const RECORDED = ['0.2.2', '0.3.0', '0.3.2'];

function answer(versions: unknown, extraTime: Record<string, string> = {}): unknown {
  const time: Record<string, string> = { created: '2026-01-01T00:00:00Z',
    modified: '2026-11-01T00:00:00Z', ...extraTime };
  if (Array.isArray(versions)) for (const v of versions) time[String(v)] = '2026-10-01T00:00:00Z';
  return { versions, time };
}

const PUBLISHED = ['0.2.1', '0.2.2', '0.3.0', '0.3.1', '0.3.2'];

interface Run { status: number | null; stdout: string; stderr: string }

function cli(args: string[], env: NodeJS.ProcessEnv = process.env): Run {
  const result = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8', env });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function withFile<T>(content: string, use: (file: string) => T): T {
  const dir = mkdtempSync(join(tmpdir(), 'intake-detect-'));
  try {
    const file = join(dir, 'registry.json');
    writeFileSync(file, content);
    return use(file);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

describe('intake detection, the report (task-078)', () => {
  it('reports nothing when every published version in the window is recorded', () => {
    const report = detectMissing(answer(['0.2.1', '0.2.2', '0.3.0', '0.3.2']), RECORDED);
    assert.deepEqual(report, { code: 0, lines: ['no missing version'], errors: [] });
  });

  it('ignores a version below the floor (0.2.1, on npm and not recorded by choice)', () => {
    assert.equal(detectMissing(answer(['0.2.1', '0.2.2', '0.3.0', '0.3.2']), RECORDED).code, 0);
  });

  it('classes a patch against its predecessor', () => {
    const report = detectMissing(answer([...PUBLISHED, '0.3.3'].filter((v) => v !== '0.3.1')),
      RECORDED);
    assert.deepEqual(report.lines, ['0.3.3 patch (against 0.3.2)']);
    assert.equal(report.code, 1);
  });

  it('classes a 0.x minor as breaking, a 1.x minor as minor, and an X change as major', () => {
    assert.deepEqual(detectMissing(answer(['0.2.2', '0.3.0', '0.3.2', '0.4.0']), RECORDED).lines,
      ['0.4.0 minor, breaking in 0.x (against 0.3.2)']);
    assert.deepEqual(detectMissing(answer(['0.2.2', '0.3.0', '0.3.2', '1.0.0']), RECORDED).lines,
      ['1.0.0 major (against 0.3.2)']);
    assert.deepEqual(detectMissing(answer(['0.2.2', '0.3.0', '0.3.2', '1.0.0', '1.1.0']),
      [...RECORDED, '1.0.0']).lines, ['1.1.0 minor (against 1.0.0)']);
    assert.deepEqual(detectMissing(answer(['0.2.2', '0.3.0', '0.3.2', '1.0.0', '2.0.0']),
      [...RECORDED, '1.0.0']).lines, ['2.0.0 major (against 1.0.0)']);
  });

  it('reports a missing version between the oldest and the newest recorded as a backport', () => {
    const report = detectMissing(answer(PUBLISHED), RECORDED);
    assert.deepEqual(report.lines, ['0.3.1 backport (below 0.3.2)']);
    assert.equal(report.code, 1);
  });

  it('classes two missing versions in semver order, the second against the first', () => {
    const report = detectMissing(answer(['0.2.2', '0.3.0', '0.3.2', '0.3.4', '0.3.3']), RECORDED);
    assert.deepEqual(report.lines, ['0.3.3 patch (against 0.3.2)', '0.3.4 patch (against 0.3.3)']);
  });

  it('orders by semver, not by text', () => {
    const report = detectMissing(answer(['0.2.2', '0.3.0', '0.3.2', '0.10.0', '0.9.0']), RECORDED);
    assert.deepEqual(report.lines, ['0.9.0 minor, breaking in 0.x (against 0.3.2)',
      '0.10.0 minor, breaking in 0.x (against 0.9.0)']);
  });

  it('ignores a pre-release and a version only in time (unpublished)', () => {
    const report = detectMissing(answer(['0.2.2', '0.3.0', '0.3.2', '0.4.0-rc.1'],
      { '0.3.3': '2026-11-02T00:00:00Z' }), RECORDED);
    assert.deepEqual(report, { code: 0, lines: ['no missing version'], errors: [] });
  });

  it('reads a bare-string versions as a one-element list', () => {
    assert.deepEqual(detectMissing(answer('0.3.2'), RECORDED).lines, ['no missing version']);
  });

  it('refuses a malformed entry and an answer without versions, never echoing them', () => {
    const bad = detectMissing(answer(['0.2.2', '0.3.0', '0.3.2', '0.3.3::error::x']), RECORDED);
    assert.equal(bad.code, 2);
    assert.deepEqual(bad.lines, []);
    assert.ok(bad.errors.every((line) => !line.includes('::error::x')), bad.errors.join('\n'));
    assert.match(bad.errors.join('\n'), /1 entry/);
    assert.equal(detectMissing({ time: { unpublished: {} } }, RECORDED).code, 2);
    assert.equal(detectMissing('not an object', RECORDED).code, 2);
  });
});

describe('intake detection, the command (task-078)', () => {
  it('exits 0 with no missing version, from a registry file and a compat file', () => {
    const run = withFile(JSON.stringify(answer(['0.2.1', '0.2.2', '0.3.0', '0.3.2'])),
      (file) => cli(['--registry', file, '--compat', COMPAT]));
    assert.equal(run.status, 0, run.stderr);
    assert.equal(run.stdout, 'no missing version\n');
  });

  it('exits 1 with a missing version, and writes ::error lines with --github', () => {
    const run = withFile(JSON.stringify(answer(['0.2.2', '0.3.0', '0.3.2', '0.3.3'])),
      (file) => cli(['--registry', file, '--compat', COMPAT, '--github']));
    assert.equal(run.status, 1);
    assert.equal(run.stdout, '0.3.3 patch (against 0.3.2)\n'
      + '::error title=WingFoil release not recorded::0.3.3 patch (against 0.3.2)\n');
  });

  it('exits 2 for an unparsable answer and for a bad usage', () => {
    assert.equal(withFile('{', (file) => cli(['--registry', file, '--compat', COMPAT])).status, 2);
    assert.equal(cli(['--nonsense']).status, 2);
  });

  it('spawns npm view with exactly its arguments, and exits 2 when npm fails', () => {
    const dir = mkdtempSync(join(tmpdir(), 'intake-npm-'));
    try {
      const args = join(dir, 'args');
      const out = join(dir, 'out.json');
      writeFileSync(out, JSON.stringify(answer(['0.2.2', '0.3.0', '0.3.2'])));
      const stub = join(dir, 'npm');
      writeFileSync(stub, ['#!/usr/bin/env bash', `printf '%s' "$*" > '${args}'`,
        `if [ -f '${join(dir, 'fail')}' ]; then exit 7; fi`, `cat '${out}'`, ''].join('\n'));
      chmodSync(stub, 0o755);
      const env = { ...process.env, PATH: `${dir}${delimiter}${process.env['PATH'] ?? ''}` };
      const ok = cli(['--compat', COMPAT], env);
      assert.equal(ok.status, 0, ok.stderr);
      assert.equal(readFileSync(args, 'utf8'), 'view wingfoil versions time --json');
      writeFileSync(join(dir, 'fail'), '');
      const failed = cli(['--compat', COMPAT, '--github'], env);
      assert.equal(failed.status, 2);
      assert.equal(failed.stdout,
        '::error title=WingFoil release check failed::npm view exited 7\n');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

/** A stub npm on PATH, its body given; returns the environment and a cleanup. */
function stubNpm(body: string[]): { env: NodeJS.ProcessEnv; dispose: () => void } {
  const dir = mkdtempSync(join(tmpdir(), 'intake-npm-'));
  const stub = join(dir, 'npm');
  writeFileSync(stub, ['#!/usr/bin/env bash', ...body, ''].join('\n'));
  chmodSync(stub, 0o755);
  return { env: { ...process.env, PATH: `${dir}${delimiter}${process.env['PATH'] ?? ''}` },
    dispose: () => { rmSync(dir, { recursive: true, force: true }); } };
}

describe('intake detection, the command\'s refusals (task-078 build review)', () => {
  const FAILED = '::error title=WingFoil release check failed::';

  it('exits 2 with a fixed annotation for an invalid or missing compat file', () => {
    const run = withFile('format: 1\n', (file) => withFile(JSON.stringify(answer(['0.3.2'])),
      (registry) => cli(['--registry', registry, '--compat', file, '--github'])));
    assert.equal(run.status, 2);
    assert.equal(run.stdout, `${FAILED}compat.yaml is not valid\n`);
    const missing = withFile(JSON.stringify(answer(['0.3.2'])),
      (registry) => cli(['--registry', registry, '--compat', join(FIXTURES, 'intake', 'none.yaml')]));
    assert.equal(missing.status, 2);
    assert.equal(missing.stdout, '');
  });

  it('exits 2 for a refused or unparsable answer, never echoing its entries', () => {
    for (const content of ['{', JSON.stringify(answer(['0.2.2', '0.3.3::error::x'])),
      JSON.stringify({ time: {} })]) {
      const run = withFile(content, (file) => cli(['--registry', file, '--compat', COMPAT,
        '--github']));
      assert.equal(run.status, 2, content);
      assert.equal(run.stdout, `${FAILED}the registry answer is refused\n`, content);
      assert.ok(!run.stderr.includes('::error::x'), run.stderr);
    }
  });

  it('exits 2 for a bad usage, with the usage on stderr and nothing on stdout', () => {
    const run = cli(['--nonsense']);
    assert.equal(run.status, 2);
    assert.equal(run.stdout, '');
    assert.match(run.stderr, /usage: intake:detect/);
  });

  it('exits 2 naming the signal when npm is killed, and the cause when npm cannot start', () => {
    const killed = stubNpm(['kill -TERM $$']);
    try {
      const run = cli(['--compat', COMPAT, '--github'], killed.env);
      assert.equal(run.status, 2);
      assert.equal(run.stdout, `${FAILED}npm view exited signal SIGTERM\n`);
    } finally {
      killed.dispose();
    }
    const run = cli(['--compat', COMPAT, '--github'], { ...process.env, PATH: '/nonexistent' });
    assert.equal(run.status, 2);
    assert.equal(run.stdout, `${FAILED}npm view exited ENOENT\n`);
  });

  it('reads no network with --registry: a failing npm on PATH is never run', () => {
    const failing = stubNpm(['exit 9']);
    try {
      const run = withFile(JSON.stringify(answer(['0.2.2', '0.3.0', '0.3.2'])),
        (file) => cli(['--registry', file, '--compat', COMPAT], failing.env));
      assert.equal(run.status, 0, run.stderr);
      assert.equal(run.stdout, 'no missing version\n');
    } finally {
      failing.dispose();
    }
  });
});
