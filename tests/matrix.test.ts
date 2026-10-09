import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import {
  MatrixIoError, installRelease, runRelease, selectReleases,
} from '../src/matrix';
import type { MatrixMode, ReleaseRun } from '../src/matrix';
import type { CompatRelease, VersionRequirements } from '../src/range';
import { FORMAT_WARNING, StubWingfoil, composedOutput } from './support/stub-wingfoil';
import type { StubBehaviour, StubCommand } from './support/stub-wingfoil';

const READS_ALL: CompatRelease['reads'] = {
  dna: [1], memory: [1], roles: [1], workflows: [1], workflow: [1], directive: [1],
  'memory-template': [1],
};

function release(wingfoil: string, changes: Partial<CompatRelease> = {}): CompatRelease {
  return { wingfoil, format_key: true, reads: READS_ALL, capabilities: [], ...changes };
}

const BASE: VersionRequirements = { formats: { dna: 1, roles: 1 }, requires_capabilities: [] };
const NEEDS_INSTALL: VersionRequirements = {
  formats: { workflow: 1 }, requires_capabilities: ['pack-install'],
};

const COMMANDS = ['workflow list', 'dna show', 'directives list'];

function versions(selected: CompatRelease[]): string[] {
  return selected.map((selectedRelease) => selectedRelease.wingfoil);
}

describe('selectReleases', () => {
  const releases = [
    release('0.2.2', { format_key: false }),
    release('0.3.0', { reads: { ...READS_ALL, roles: [2] } }),
    release('0.4.0'),
    release('0.5.0', { capabilities: ['pack-install'] }),
    release('0.6.0', { capabilities: ['pack-install'] }),
  ];

  it('runs the oldest and the newest release compatible with every pack, across a gap', () => {
    assert.deepEqual(versions(selectReleases([BASE], releases, 'publication')), ['0.4.0', '0.6.0']);
  });

  it('applies every pack: one requiring a capability narrows the set', () => {
    assert.deepEqual(versions(selectReleases([BASE, NEEDS_INSTALL], releases, 'publication')),
      ['0.5.0', '0.6.0']);
  });

  it('runs a single compatible release once', () => {
    assert.deepEqual(versions(selectReleases([BASE], releases.slice(0, 3), 'publication')),
      ['0.4.0']);
  });

  it('selects nothing when no release is compatible', () => {
    assert.deepEqual(selectReleases([BASE, NEEDS_INSTALL], releases.slice(0, 3), 'publication'),
      []);
  });

  it('selects a release marked format_key: false in self-test mode only (dl-009)', () => {
    const only = [release('0.2.2', { format_key: false })];
    assert.deepEqual(versions(selectReleases([BASE], only, 'self-test')), ['0.2.2']);
    assert.deepEqual(selectReleases([BASE], only, 'publication'), []);
    assert.deepEqual(versions(selectReleases([BASE], releases, 'self-test')), ['0.2.2', '0.6.0']);
  });

  it('needs the composed workflows.yaml format even for a composition of no pack', () => {
    const noWorkflows = [release('0.4.0', { reads: { ...READS_ALL, workflows: [2] } })];
    assert.deepEqual(selectReleases([], noWorkflows, 'publication'), []);
  });
});

function run(commands: Record<string, StubCommand>, options: {
  mode?: MatrixMode;
  target?: CompatRelease;
  behaviour?: StubBehaviour;
} = {}): ReleaseRun {
  const target = options.target ?? release('0.2.2', { format_key: false });
  const stub = new StubWingfoil({ commands, ...options.behaviour }, target.wingfoil);
  const composed = composedOutput();
  try {
    return runRelease(stub.cli, composed.dir, target, options.mode ?? 'self-test');
  } finally {
    stub.dispose();
    composed.dispose();
  }
}

function everyCommand(command: StubCommand): Record<string, StubCommand> {
  return Object.fromEntries(COMMANDS.map((line) => [line, command]));
}

function failureOf(result: ReleaseRun, command = 'dna show'): string {
  const outcome = result.outcomes.find((candidate) => candidate.command === command);
  assert.ok(outcome !== undefined, `no outcome for ${command}`);
  assert.equal(outcome.pass, false, `${command} passed`);
  return outcome.reason;
}

describe('runRelease', () => {
  it('passes the three commands, in order, when they exit 0 and print no warning', () => {
    const result = run(everyCommand({}));
    assert.equal(result.code, 0, JSON.stringify(result));
    assert.deepEqual(result.outcomes.map((outcome) => [outcome.command, outcome.pass,
      outcome.tolerated]), COMMANDS.map((command) => [command, true, 0]));
  });

  it('runs at the root of a git repository holding the composed .wingfoil/ only (W-10)', () => {
    const checker = new StubWingfoil({}, '0.2.2');
    const composed = composedOutput();
    try {
      writeFileSync(checker.cli, [
        "const fs = require('node:fs');",
        "if (process.argv[2] === '--version') { process.stdout.write('0.2.2\\n'); return; }",
        "const ok = fs.existsSync('.git') && fs.existsSync('.wingfoil/dna.yaml')",
        "  && !fs.existsSync('AGENTS.region.md');",
        'process.exitCode = ok ? 0 : 1;',
        '',
      ].join('\n'));
      const checked = runRelease(checker.cli, composed.dir, release('0.2.2'), 'publication');
      assert.equal(checked.code, 0, JSON.stringify(checked));
    } finally {
      checker.dispose();
      composed.dispose();
    }
  });

  it('tolerates the format warning in self-test mode for a release marked format_key: false', () => {
    const result = run(everyCommand({ stderr: [FORMAT_WARNING, FORMAT_WARNING] }));
    assert.equal(result.code, 0, JSON.stringify(result));
    assert.deepEqual(result.outcomes.map((outcome) => outcome.tolerated), [2, 2, 2]);
  });

  it('never tolerates it for a release marked format_key: true', () => {
    const result = run(everyCommand({ stderr: [FORMAT_WARNING] }), { target: release('0.3.0') });
    assert.equal(result.code, 1);
    assert.match(failureOf(result), /unknown field\(s\) ignored: format/);
  });

  it('never tolerates it in publication mode', () => {
    const result = run(everyCommand({ stderr: [FORMAT_WARNING] }), { mode: 'publication' });
    assert.equal(result.code, 1);
  });

  it('fails a line that lists format together with another field', () => {
    const line = 'Warning: {cwd}/.wingfoil/dna.yaml: unknown field(s) ignored: format, colour';
    const result = run({ 'dna show': { stderr: [line] } });
    assert.equal(result.code, 1);
    assert.match(failureOf(result), /colour/);
  });

  it('fails a tolerated line whose file lies outside the composed .wingfoil/', () => {
    writeFileSync(join(tmpdir(), 'matrix-outside.yaml'), 'format: 1\n');
    try {
      const outside = `Warning: ${join(tmpdir(), 'matrix-outside.yaml')}: unknown field(s) ignored: format`;
      const result = run({ 'dna show': { stderr: [outside] } });
      assert.equal(result.code, 1);
      const sibling = 'Warning: {cwd}/AGENTS.yaml: unknown field(s) ignored: format';
      assert.equal(run({ 'dna show': { stderr: [sibling] } }).code, 1);
    } finally {
      rmSync(join(tmpdir(), 'matrix-outside.yaml'), { force: true });
    }
  });

  it('fails any other stderr line', () => {
    const result = run({ 'directives list': { stderr: ['Warning: something else'] } });
    assert.equal(result.code, 1);
    assert.match(failureOf(result, 'directives list'), /something else/);
  });

  it('fails a warning printed on stdout', () => {
    const result = run({ 'workflow list': { stdout: ['Warning: on stdout'] } });
    assert.equal(result.code, 1);
    assert.match(failureOf(result, 'workflow list'), /on stdout/);
  });

  it('fails a non-zero exit, naming it', () => {
    const result = run({ 'dna show': { status: 3 } });
    assert.equal(result.code, 1);
    assert.match(failureOf(result), /exit 3/);
  });

  it('fails when --version is not the release', () => {
    const result = run(everyCommand({}), { behaviour: { version: '0.2.1' } });
    assert.equal(result.code, 1);
    assert.match(result.message ?? '', /0\.2\.1/);
  });

  it('shows no scratch path in a failure reason', () => {
    const line = 'Warning: {cwd}/.wingfoil/dna.yaml: unknown field(s) ignored: format, colour';
    const result = run({ 'dna show': { stderr: [line] } });
    const reason = failureOf(result);
    assert.ok(!reason.includes(tmpdir()), reason);
    assert.match(reason, /<scratch>\/\.wingfoil\/dna\.yaml/);
  });
});

function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

describe('installRelease', () => {
  function withDirs(body: (pins: string, cache: string) => void): void {
    const root = mkdtempSync(join(tmpdir(), 'install-'));
    try {
      const pins = join(root, 'pins');
      const cache = join(root, 'cache');
      mkdirSync(pins);
      body(pins, cache);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  function pin(pins: string, version: string, lock: string): void {
    const dir = join(pins, `wingfoil-${version}`);
    mkdirSync(dir);
    writeFileSync(join(dir, 'package.json'),
      JSON.stringify({ private: true, dependencies: { wingfoil: version } }));
    writeFileSync(join(dir, 'package-lock.json'), lock);
  }

  it('is an I/O error when the release has no committed lockfile', () => {
    withDirs((pins, cache) => {
      assert.throws(() => installRelease('9.9.9', { pins, cache }),
        (error: unknown) => error instanceof MatrixIoError && /9\.9\.9/.test(error.message)
          && /lockfile/.test(error.message));
    });
  });

  it('reuses a cached install only while its lockfile is unchanged', () => {
    withDirs((pins, cache) => {
      const lock = '{"lockfileVersion":3,"packages":{}}\n';
      pin(pins, '0.2.2', lock);
      const target = join(cache, '0.2.2');
      mkdirSync(join(target, 'node_modules', 'wingfoil'), { recursive: true });
      writeFileSync(join(target, 'node_modules', 'wingfoil', 'package.json'),
        JSON.stringify({ name: 'wingfoil', version: '0.2.2', bin: { wingfoil: 'dist/cli.js' } }));
      writeFileSync(join(target, '.lockfile-sha256'), sha256(lock));
      assert.equal(installRelease('0.2.2', { pins, cache }),
        join(target, 'node_modules', 'wingfoil', 'dist', 'cli.js'));
      writeFileSync(join(target, '.lockfile-sha256'), sha256('another lockfile'));
      assert.throws(() => installRelease('0.2.2', { pins, cache }), MatrixIoError,
        'a changed lockfile is installed again, and this one cannot be');
    });
  });

  it('is an I/O error when npm ci fails, never a pass', () => {
    withDirs((pins, cache) => {
      pin(pins, '0.2.2', 'not json');
      assert.throws(() => installRelease('0.2.2', { pins, cache }),
        (error: unknown) => error instanceof MatrixIoError && /npm ci/.test(error.message));
    });
  });
});
