// The compatibility matrix (F3.3, pack-compatibility, dl-009): each composition is run with the
// oldest and the newest compatible WingFoil release, each installed pinned (its own committed
// lockfile) and in isolation (its own directory, never the repository's node_modules). The composed
// .wingfoil/ is committed in a scratch repository, since WingFoil 0.3.0 reads what is committed at
// HEAD (task-035). It passes when `workflow list`, `dna show` and `directives list`, run with
// `--format json`, exit 0 and report no warning: no stderr line, no stdout line starting
// `Warning:`, no `workflow list` diagnostic of severity warning or error, no `directives list`
// warning (the approver's rulings L and M, plan-042). Self-test mode only, and only for a release
// marked `format_key: false`, tolerates the exact `format` warning of WingFoil 0.2.2 (W-01).
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve as resolvePath, sep } from 'node:path';

import { gitEnvironment, runGit } from './git';
import { isCompatible } from './range';
import type { CompatRelease, VersionRequirements } from './range';

/** Fixed by the caller, never by the data (dl-009). */
export type MatrixMode = 'self-test' | 'publication';

/** The validation of `pack-compatibility`, in this order: the report's label, then the arguments. */
export const COMMANDS: readonly { label: string; args: readonly string[] }[] = [
  ['workflow', 'list'], ['dna', 'show'], ['directives', 'list'],
].map((words) => ({ label: words.join(' '), args: [...words, '--format', 'json'] }));

/** The identity of the scratch commit: the matrix's git environment carries none (git.ts). */
const SCRATCH_IDENTITY = ['-c', 'user.name=wingfoil-templates-matrix',
  '-c', 'user.email=matrix@wingfoil-templates.invalid'];

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Whether `--version` printed this release: the version alone (0.2.2), or the version, one space
 * and a parenthesised commit or `unknown` (0.3.0's `<semver> (<commit>)`).
 */
export function versionMatches(printed: string, version: string): boolean {
  return printed === version || new RegExp(
    `^${escapeRegExp(version)} \\((?:[0-9a-f]{7,64}(?:-dirty)?|unknown)\\)$`).test(printed);
}

/** The committed manifest and lockfile of each release: `wingfoil-<version>/`. */
export const MATRIX_PINS = join(__dirname, '..', '..', 'src', 'matrix');

/** Relative to the working directory, ignored by git. */
export const DEFAULT_CACHE = join('.cache', 'wingfoil-matrix');

/** A release could not be installed or run: an I/O error (exit 2), never a pass. */
export class MatrixIoError extends Error {}

const NO_REQUIREMENTS: VersionRequirements = { formats: {}, requires_capabilities: [] };

/**
 * The releases compatible with every resolved pack of a composition (spec-001 §12), in
 * compat.yaml order; then the oldest and the newest of them, one when they coincide.
 */
export function selectReleases(
  packs: VersionRequirements[],
  releases: CompatRelease[],
  mode: MatrixMode,
): CompatRelease[] {
  const options = { formatKey: mode === 'publication' };
  const compatible = releases.filter((release) => [NO_REQUIREMENTS, ...packs]
    .every((pack) => isCompatible(pack, release, options)));
  const oldest = compatible[0];
  const newest = compatible[compatible.length - 1];
  if (oldest === undefined || newest === undefined) return [];
  return oldest === newest ? [oldest] : [oldest, newest];
}

export interface InstallOptions {
  /** The folder holding `wingfoil-<version>/package.json` and `package-lock.json`. */
  pins: string;
  /** The cache; each release gets `<cache>/<version>/`. */
  cache: string;
}

const STAMP = '.lockfile-sha256';
const INSTALL_TIMEOUT_MS = 600_000;
const COMMAND_TIMEOUT_MS = 120_000;

function lastLine(text: string): string {
  const lines = text.trim().split(/\r?\n/);
  return lines[lines.length - 1] ?? '';
}

/** npm itself: the one running this command when there is one, else `npm` from the PATH. */
function runNpm(args: string[], cwd: string): ReturnType<typeof spawnSync> {
  const npmCli = process.env['npm_execpath'];
  const options = { cwd, encoding: 'utf8' as const, timeout: INSTALL_TIMEOUT_MS };
  return npmCli !== undefined && npmCli.endsWith('.js')
    ? spawnSync(process.execPath, [npmCli, ...args], options)
    : spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, options);
}

function installedCli(target: string): string | undefined {
  const manifestPath = join(target, 'node_modules', 'wingfoil', 'package.json');
  if (!existsSync(manifestPath)) return undefined;
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    bin?: string | Record<string, string>;
  };
  const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.['wingfoil'];
  return bin === undefined ? undefined : join(target, 'node_modules', 'wingfoil', bin);
}

/**
 * Installs a release from its committed lockfile with `npm ci --ignore-scripts`, into its own
 * cache directory, and returns its CLI entry. A cached install is reused only while it is complete
 * and the manifest and lockfile it was made from are unchanged.
 */
export function installRelease(version: string, options: InstallOptions): string {
  const source = join(options.pins, `wingfoil-${version}`);
  const lockfile = join(source, 'package-lock.json');
  if (!existsSync(lockfile) || !existsSync(join(source, 'package.json'))) {
    throw new MatrixIoError(`wingfoil@${version}: no committed lockfile `
      + `(src/matrix/wingfoil-${version}/)`);
  }
  const sha = createHash('sha256').update(readFileSync(join(source, 'package.json')))
    .update(readFileSync(lockfile)).digest('hex');
  const target = join(resolvePath(options.cache), version);
  const stamp = join(target, STAMP);
  // npm ci writes node_modules/.package-lock.json only once the install is complete.
  const complete = existsSync(join(target, 'node_modules', '.package-lock.json'));
  if (complete && existsSync(stamp) && readFileSync(stamp, 'utf8') === sha) {
    const cli = installedCli(target);
    if (cli !== undefined) return cli;
  }
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  copyFileSync(join(source, 'package.json'), join(target, 'package.json'));
  copyFileSync(lockfile, join(target, 'package-lock.json'));
  const result = runNpm(['ci', '--ignore-scripts', '--no-audit', '--no-fund'], target);
  if (result.error !== undefined || result.status !== 0) {
    const why = result.error?.message ?? lastLine(String(result.stderr));
    throw new MatrixIoError(`wingfoil@${version}: npm ci failed: ${why}`);
  }
  const cli = installedCli(target);
  if (cli === undefined) {
    throw new MatrixIoError(`wingfoil@${version}: npm ci installed no wingfoil CLI`);
  }
  writeFileSync(stamp, sha);
  return cli;
}

export interface CommandOutcome {
  /** `workflow list`, `dna show` or `directives list`. */
  command: string;
  pass: boolean;
  /** Lines removed by the self-test tolerance. */
  tolerated: number;
  /** Why it failed; empty when it passed. */
  reason: string;
}

export interface ReleaseRun {
  /** 0 every command passed, 1 a command or the version check failed, 2 an I/O failure. */
  code: number;
  outcomes: CommandOutcome[];
  /** Set when the run stopped before the commands. */
  message?: string;
}

interface Output {
  status: number | null;
  stdout: string;
  stderr: string;
  /** Set when the command was stopped for running longer than COMMAND_TIMEOUT_MS. */
  timedOut?: boolean;
}

const TOLERATED = /^Warning: (.+): unknown field\(s\) ignored: format$/;

function isInside(file: string, dir: string): boolean {
  try {
    const real = realpathSync(file);
    return real.startsWith(`${dir}${sep}`);
  } catch {
    return false;
  }
}

function lines(text: string): string[] {
  return text.split(/\r?\n/).filter((line) => line !== '');
}

/**
 * The warnings a command reports as data on stdout (rulings L, M): `workflow list`'s diagnostics of
 * severity warning or error, `directives list`'s warnings. A stdout that is not JSON, or JSON
 * without those arrays (WingFoil 0.2.2's), reports none.
 */
function dataWarnings(label: string, stdout: string): string[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdout.trim());
  } catch {
    return [];
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return [];
  const data = parsed as Record<string, unknown>;
  if (label === 'workflow list' && Array.isArray(data['diagnostics'])) {
    return data['diagnostics'].flatMap((item: unknown) => {
      const entry = (item ?? {}) as Record<string, unknown>;
      return entry['severity'] === 'warning' || entry['severity'] === 'error'
        ? [`diagnostic ${String(entry['code'])}: ${String(entry['message'])}`] : [];
    });
  }
  if (label === 'directives list' && Array.isArray(data['warnings'])) {
    return data['warnings'].map((item: unknown) =>
      `warning: ${typeof item === 'string' ? item : JSON.stringify(item)}`);
  }
  return [];
}

/**
 * Judges one command: exit 0, nothing on stderr, no stdout line starting with `Warning:`, and no
 * warning reported as data (`dataWarnings`). With `tolerate`, the exact format warnings about a
 * file inside `wingfoilDir` are removed first.
 */
export function judge(output: Output, tolerate: boolean, wingfoilDir: string, label = ''):
Omit<CommandOutcome, 'command'> {
  let tolerated = 0;
  const remaining: string[] = [];
  for (const line of lines(output.stderr)) {
    const match = tolerate ? TOLERATED.exec(line) : null;
    if (match?.[1] !== undefined && isInside(match[1], wingfoilDir)) {
      tolerated += 1;
    } else {
      remaining.push(line);
    }
  }
  const reasons: string[] = [];
  if (output.timedOut === true) {
    reasons.push(`timed out after ${COMMAND_TIMEOUT_MS / 1000} s`);
  } else if (output.status !== 0) {
    reasons.push(`exit ${output.status ?? 'none'}`);
  }
  for (const line of remaining) reasons.push(`stderr: ${line}`);
  for (const line of lines(output.stdout).filter((text) => text.startsWith('Warning:'))) {
    reasons.push(`stdout: ${line}`);
  }
  for (const warning of dataWarnings(label, output.stdout)) reasons.push(`stdout: ${warning}`);
  return { pass: reasons.length === 0, tolerated, reason: reasons.join('; ') };
}

/** The CLI's environment: no GIT_* variable (git.ts), and no NODE_PATH to resolve modules from. */
function cliEnvironment(): NodeJS.ProcessEnv {
  const env = gitEnvironment();
  delete env['NODE_PATH'];
  return env;
}

function execute(cli: string, args: readonly string[], cwd: string): Output {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd, env: cliEnvironment(), encoding: 'utf8', timeout: COMMAND_TIMEOUT_MS,
  });
  const code = (result.error as NodeJS.ErrnoException | undefined)?.code;
  if (code === 'ETIMEDOUT') {
    return { status: result.status, stdout: result.stdout, stderr: result.stderr, timedOut: true };
  }
  if (result.error !== undefined) {
    throw new MatrixIoError(`cannot run ${args.join(' ')}: ${result.error.message}`);
  }
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

/** Paths of the scratch directory never reach the report. */
function hideScratch(text: string, scratch: string, realScratch: string): string {
  return text.split(realScratch).join('<scratch>').split(scratch).join('<scratch>');
}

/**
 * Runs the three commands of `pack-compatibility` with one installed release, on a copy of the
 * composed `.wingfoil/` committed at the root of a fresh git repository (W-10, task-035), after
 * checking that the CLI is that release.
 */
export function runRelease(
  cli: string,
  composed: string,
  release: CompatRelease,
  mode: MatrixMode,
): ReleaseRun {
  const tolerate = mode === 'self-test' && !release.format_key;
  let scratch: string | undefined;
  try {
    scratch = mkdtempSync(join(tmpdir(), 'matrix-'));
    const realScratch = realpathSync(scratch);
    cpSync(join(composed, '.wingfoil'), join(scratch, '.wingfoil'), { recursive: true });
    runGit(scratch, ['init', '--quiet']);
    runGit(scratch, ['add', '--force', '--', '.wingfoil']);
    runGit(scratch, [...SCRATCH_IDENTITY, 'commit', '--quiet', '--no-gpg-sign',
      '-m', 'composed .wingfoil']);
    const version = execute(cli, ['--version'], scratch);
    const printed = version.stdout.trim();
    if (version.timedOut === true || version.status !== 0) {
      const why = version.timedOut === true ? `timed out after ${COMMAND_TIMEOUT_MS / 1000} s`
        : `exit ${version.status ?? 'none'}: ${lastLine(version.stderr)}`;
      return { code: 1, outcomes: [],
        message: hideScratch(`--version ${why}`, scratch, realScratch) };
    }
    if (!versionMatches(printed, release.wingfoil)) {
      return { code: 1, outcomes: [], message: `--version printed ${JSON.stringify(printed)}, `
        + `not ${release.wingfoil}` };
    }
    const wingfoilDir = join(realScratch, '.wingfoil');
    const outcomes = COMMANDS.map(({ label, args }) => {
      const verdict = judge(execute(cli, args, scratch as string), tolerate, wingfoilDir, label);
      return { command: label, ...verdict,
        reason: hideScratch(verdict.reason, scratch as string, realScratch) };
    });
    return { code: outcomes.every((outcome) => outcome.pass) ? 0 : 1, outcomes };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { code: 2, outcomes: [],
      message: scratch === undefined ? message : message.split(scratch).join('<scratch>') };
  } finally {
    if (scratch !== undefined) rmSync(scratch, { recursive: true, force: true });
  }
}
