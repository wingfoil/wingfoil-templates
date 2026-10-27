// `npm run check:runs -- [--tree <dir>] [--cache <dir>] [<scenario file>...]` (task-053, plan-049):
// a pack's workflows run on a real WingFoil release, which the matrix's three read-only commands
// do not do. Each scenario file names a folder of compositions (preset-format example.yaml files)
// and the runs to make on each: a `main` started, then its steps. Every run gets its own scratch
// repository holding the composed output, committed; its git identity is set in that repository
// only, never taken from the environment (task-045): the scenario's agent for every command, the
// composition's approver for an approval. Those commits and approvals are fixture data. Each run
// is made on every release the composition's matrix selects in self-test mode (the oldest and the
// newest, task-058), each installed as the matrix installs it. A failed step ends its run; the
// next run goes on. Exit 0 every run passed, 1 a run
// failed or a composition could not be composed, 2 an I/O error, 3 bad usage or a scenario it
// cannot read.
import { spawnSync } from 'node:child_process';
import {
  copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync,
  realpathSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, relative, resolve as resolvePath } from 'node:path';
import { parseArgs } from 'node:util';

import { loadCatalog } from './catalog';
import { readFrontmatter } from './frontmatter';
import { loadCompat } from './compat';
import { runCompose } from './compose-cli';
import { GitError, gitEnvironment, runGit } from './git';
import {
  DEFAULT_CACHE, MATRIX_PINS, MatrixIoError, installRelease, selectReleases,
} from './matrix';
import { resolve } from './resolve';
import type { ResolvedPack } from './resolve';
import { YamlError, loadYamlFile } from './yaml-load';

export interface WingfoilOutput {
  status: number | null;
  stdout: string;
  stderr: string;
}

/** Runs the WingFoil CLI entry `cli` with `args` in `cwd`. */
export type Exec = (cli: string, args: string[], cwd: string, env: NodeJS.ProcessEnv) =>
WingfoilOutput;

export interface Composed {
  /** Every parameter of the composition's packs, as text: the given values, then the defaults. */
  params: Record<string, string>;
  /** The releases to run on: those the matrix selects, in compat.yaml order. */
  releases: string[];
}

/** Composes `entries` of `tree` with `params` into the empty directory `out`. */
export type Compose = (tree: string, entries: string[], params: Record<string, string>,
  out: string) => Composed;

export interface RunsOptions {
  compose?: Compose;
  install?: (version: string, cache: string) => string;
  exec?: Exec;
}

export interface RunsResult {
  code: number;
  lines: string[];
}

const USAGE = 'usage: check:runs [--tree <dir>] [--cache <dir>] [<scenario file>...]';
const SCENARIOS = 'tests/fixtures/runs';
const COMMAND_TIMEOUT_MS = 120_000;
const APPROVAL_REASON = 'check:runs scenario approval';
const INVENTORY = 'inventory.md';

class UsageError extends Error {}

/** A scenario that cannot be read: exit 3, or 2 when the file cannot be read at all. */
class ScenarioError extends Error {
  constructor(message: string, readonly code: number) {
    super(message);
  }
}

/** A problem at a key of a scenario: the file's label is added by loadScenario. */
class KeyProblem extends Error {
  constructor(readonly where: string, readonly what: string) {
    super(`${where}: ${what}`);
  }
}

/** Throws a KeyProblem for every key of `value` outside `allowed`. */
function onlyKeys(value: Record<string, unknown>, allowed: string[], where: string): void {
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      throw new KeyProblem(where === '' ? key : `${where}.${key}`, 'unknown key');
    }
  }
}

/** A relative path that stays inside the repository. */
function inside(path: string): boolean {
  const parts = path.split('/');
  return !isAbsolute(path) && !path.startsWith('\\') && !parts.includes('..');
}

interface Identity {
  name: string;
  email: string;
}

type Step =
  | { kind: 'start' }
  | { kind: 'end' }
  | { kind: 'next'; key: string }
  | { kind: 'finalize'; key: string }
  | { kind: 'commit_inside'; parameter: string }
  | { kind: 'commit_copy'; from: string; to: string }
  | { kind: 'add'; type: string; title: string; step: string }
  | { kind: 'submit' }
  | { kind: 'approve' };

interface Run {
  main: string;
  steps: Step[];
}

interface Scenario {
  label: string;
  compositions: string;
  agent: Identity;
  runs: Run[];
}

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function lastLine(text: string): string {
  const lines = text.trim().split(/\r?\n/);
  return lines[lines.length - 1] ?? '';
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** A file's label: relative to the tree when inside it, as given otherwise. */
function labelOf(tree: string, file: string): string {
  const rel = relative(resolvePath(tree), resolvePath(file));
  return rel.startsWith('..') || isAbsolute(rel) ? file : rel.split('\\').join('/');
}

function text(value: unknown, where: string): string {
  if (typeof value !== 'string' || value === '') {
    throw new KeyProblem(where, 'a non-empty string is required');
  }
  return value;
}

function repoPath(value: unknown, where: string): string {
  const path = text(value, where);
  if (!inside(path)) throw new KeyProblem(where, 'must stay inside the repository');
  return path;
}

function readStep(raw: unknown, where: string): Step {
  if (raw === 'start' || raw === 'end') return { kind: raw };
  if (!isRecord(raw) || Object.keys(raw).length !== 1) {
    throw new KeyProblem(where, `unknown step ${JSON.stringify(raw)}`);
  }
  const [name, value] = Object.entries(raw)[0] as [string, unknown];
  switch (name) {
    case 'next':
    case 'finalize':
      return { kind: name, key: text(value, `${where}.${name}`) };
    case 'commit_inside':
      return { kind: name, parameter: text(value, `${where}.${name}`) };
    case 'submit':
    case 'approve':
      if (value !== 'added') throw new KeyProblem(`${where}.${name}`, 'only "added" is supported');
      return { kind: name };
    case 'commit_copy': {
      const copy = isRecord(value) ? value : {};
      onlyKeys(copy, ['from', 'to'], `${where}.${name}`);
      return { kind: name, from: repoPath(copy['from'], `${where}.${name}.from`),
        to: repoPath(copy['to'], `${where}.${name}.to`) };
    }
    case 'add': {
      const add = isRecord(value) ? value : {};
      onlyKeys(add, ['type', 'title', 'step'], `${where}.add`);
      return { kind: name, type: text(add['type'], `${where}.add.type`),
        title: text(add['title'], `${where}.add.title`),
        step: text(add['step'], `${where}.add.step`) };
    }
    default:
      throw new KeyProblem(where, `unknown step ${JSON.stringify(name)}`);
  }
}

function loadScenario(file: string, label: string): Scenario {
  let data: unknown;
  try {
    data = loadYamlFile(file, label).data;
  } catch (error) {
    const io = error instanceof YamlError && error.reason === 'io';
    throw new ScenarioError(`${label}: ${messageOf(error)}`, io ? 2 : 3);
  }
  try {
    if (!isRecord(data)) throw new KeyProblem('(root)', 'a mapping is required');
    onlyKeys(data, ['format', 'compositions', 'identities', 'runs'], '');
    if (data['format'] !== 1) throw new KeyProblem('format', 'must be 1');
    const compositions = repoPath(data['compositions'], 'compositions');
    const identities = data['identities'];
    if (identities === undefined) throw new KeyProblem('identities', 'required');
    if (!isRecord(identities)) throw new KeyProblem('identities', 'a mapping is required');
    onlyKeys(identities, ['agent'], 'identities');
    const agentData = identities['agent'];
    if (!isRecord(agentData)) {
      throw new KeyProblem('identities.agent', 'a mapping with name and email is required');
    }
    onlyKeys(agentData, ['name', 'email'], 'identities.agent');
    const agent = {
      name: text(agentData['name'], 'identities.agent.name'),
      email: text(agentData['email'], 'identities.agent.email'),
    };
    const runsRaw = data['runs'];
    if (!Array.isArray(runsRaw) || runsRaw.length === 0) {
      throw new KeyProblem('runs', 'a non-empty list is required');
    }
    const runs = runsRaw.map((raw: unknown, r) => {
      if (!isRecord(raw)) throw new KeyProblem(`runs[${r}]`, 'a mapping is required');
      onlyKeys(raw, ['main', 'steps'], `runs[${r}]`);
      const main = text(raw['main'], `runs[${r}].main`);
      const steps = raw['steps'];
      if (!Array.isArray(steps) || steps.length === 0) {
        throw new KeyProblem(`runs[${r}].steps`, 'a non-empty list is required');
      }
      return { main, steps: steps.map((step: unknown, n) => readStep(step, `runs[${r}].steps[${n}]`)) };
    });
    return { label, compositions, agent, runs };
  } catch (error) {
    if (error instanceof KeyProblem) throw new ScenarioError(`${label}: ${error.message}`, 3);
    throw error;
  }
}

/** The example.yaml files of a folder, `<folder>/<id>/example.yaml`, in byte order. */
function compositionFiles(tree: string, folder: string): string[] {
  const dir = join(tree, folder);
  if (!existsSync(dir) || !lstatSync(dir).isDirectory()) return [];
  return readdirSync(dir).sort(byBytes)
    .map((name) => `${folder}/${name}/example.yaml`)
    .filter((file) => existsSync(join(tree, file)) && lstatSync(join(tree, file)).isFile());
}

/** Every release a set of packs selects in self-test mode, in compat.yaml order (task-058). */
function releasesFor(tree: string, packs: ResolvedPack[]): string[] {
  const compat = loadCompat(join(tree, 'compat.yaml'));
  return selectReleases(packs.map((pack) => ({
    formats: pack.manifest.formats,
    requires_capabilities: pack.manifest.requires_capabilities ?? [],
  })), compat.releases, 'self-test').map((release) => release.wingfoil);
}

/** The releases a composition's packs select in self-test mode: the oldest and the newest. */
export function selectedReleases(tree: string, entries: string[]): string[] {
  return releasesFor(tree, resolve(tree, loadCatalog(join(tree, 'catalog.yaml')), entries));
}

/** The composer of task-007, in process, and every release the matrix selects (task-058). */
export const realCompose: Compose = (tree, entries, params, out) => {
  const catalog = loadCatalog(join(tree, 'catalog.yaml'));
  const packs = resolve(tree, catalog, entries);
  const all: Record<string, string> = {};
  for (const pack of packs) {
    for (const [name, declaration] of Object.entries(pack.manifest.parameters ?? {})) {
      const fallback = declaration.default;
      if (typeof fallback === 'string' || typeof fallback === 'number'
        || typeof fallback === 'boolean') all[name] = String(fallback);
    }
  }
  Object.assign(all, params);
  const releases = releasesFor(tree, packs);
  if (releases.length === 0) throw new NoReleaseError('no release in compat.yaml can run it');
  const outcome = runCompose(['--tree', tree, '--out', out,
    ...Object.entries(params).flatMap(([name, value]) => ['--param', `${name}=${value}`]),
    ...entries]);
  if (outcome.code !== 0) {
    const error = new Error(outcome.message ?? `compose exited ${outcome.code}`);
    (error as Error & { code?: number }).code = outcome.code;
    throw error;
  }
  return { params: all, releases };
};

export const realExec: Exec = (cli, args, cwd, env) => {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd, env, encoding: 'utf8', timeout: COMMAND_TIMEOUT_MS,
  });
  if (result.error !== undefined) {
    return { status: null, stdout: result.stdout ?? '', stderr: result.error.message };
  }
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
};

/** Hides every scratch directory of this command: `<tmpdir>/runs-…` and its real path. */
function hideScratch(line: string): string {
  let out = line;
  for (const base of new Set([tmpdir(), realpathSync(tmpdir())])) {
    out = out.split(`${base}/runs-`).join('<scratch>/runs-')
      .replace(/<scratch>\/runs-[^\s/'"]*/g, '<scratch>');
  }
  return out;
}

class StepFailure extends Error {}

/** No release of compat.yaml can run a composition: exit 2, as Acceptance 1 lists it. */
class NoReleaseError extends Error {}

/** A field of a Markdown file's frontmatter, when it is a non-empty string. */
function frontmatterString(file: string, field: string): string | undefined {
  const data = readFrontmatter(readFileSync(file, 'utf8'), file)?.data;
  const value = isRecord(data) ? data[field] : undefined;
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function parseJson(output: WingfoilOutput, what: string): Record<string, unknown> {
  try {
    const data = JSON.parse(output.stdout.trim()) as unknown;
    if (isRecord(data)) return data;
  } catch {
    // reported below
  }
  throw new StepFailure(`${what}: WingFoil printed no JSON object`);
}

/** One run in its own scratch repository; the failure's line, or undefined when it passed. */
function runOne(run: Run, composed: string, params: Record<string, string>, agent: Identity,
  cli: string, execute: Exec): string | undefined {
  const root = mkdtempSync(join(tmpdir(), 'runs-scratch-'));
  const repo = join(root, 'repo');
  const env = gitEnvironment();
  const git = (args: string[]): void => {
    runGit(repo, args);
  };
  const as = (who: Identity): void => {
    git(['config', 'user.name', who.name]);
    git(['config', 'user.email', who.email]);
  };
  const commitAll = (message: string): void => {
    git(['add', '--all', '--force']);
    git(['commit', '--quiet', '--no-gpg-sign', '--allow-empty', '-m', message]);
  };
  let instance = '';
  let added = '';
  let current = 'setup';
  const wingfoil = (args: string[]): WingfoilOutput => {
    const output = execute(cli, args, repo, env);
    if (output.status !== 0) {
      const text = output.stderr.trim() !== '' ? output.stderr : output.stdout;
      const why = text.split(/\r?\n/).find((line) => line.startsWith('error:')) ?? lastLine(text);
      throw new StepFailure(`wingfoil ${args.join(' ')} exit ${output.status ?? 'none'}: ${why}`);
    }
    return output;
  };
  try {
    cpSync(composed, repo, { recursive: true });
    git(['init', '--quiet']);
    git(['config', 'commit.gpgSign', 'false']);
    as(agent);
    commitAll('composed output');
    for (const step of run.steps) {
      current = step.kind;
      switch (step.kind) {
        case 'start': {
          const data = parseJson(wingfoil(['workflow', 'start', run.main, '--format', 'json']),
            'start');
          const found = isRecord(data['instance']) ? data['instance'] : {};
          instance = typeof found['id'] === 'string' ? found['id'] : '';
          if (instance === '') throw new StepFailure('WingFoil named no instance');
          if (found['planStatus'] !== 'active') {
            throw new StepFailure(`plan ${instance} is ${String(found['planStatus'])}, not active`);
          }
          const search = parseJson(wingfoil(['memory', 'search', '--type', 'plan', '--format', 'json']), 'search');
          const matches: unknown[] = Array.isArray(search['matches']) ? search['matches'] : [];
          const match = matches.find((entry) => isRecord(entry) && entry['id'] === instance);
          const path = isRecord(match) && typeof match['path'] === 'string' ? match['path'] : '';
          if (path === '') throw new StepFailure(`plan ${instance} not found`);
          for (const field of ['workflow', 'phase']) {
            if (frontmatterString(join(repo, path), field) === undefined) {
              throw new StepFailure(`plan ${instance} has an empty ${field}`);
            }
          }
          break;
        }
        case 'commit_inside': {
          const value = params[step.parameter];
          if (value === undefined || value === '') {
            throw new StepFailure(`no value for parameter ${step.parameter}`);
          }
          if (!inside(value)) throw new StepFailure(`${step.parameter} leaves the repository`);
          const file = join(repo, value.replace(/\/+$/, ''), INVENTORY);
          mkdirSync(dirname(file), { recursive: true });
          writeFileSync(file, '# Inventory\n\nWritten by check:runs.\n');
          commitAll(`inventory inside ${value}`);
          break;
        }
        case 'next': {
          const nextArgs = ['workflow', 'next', instance, '--format', 'json'];
          const data = parseJson(wingfoil(nextArgs), 'next');
          const next = isRecord(data['next']) ? data['next'] : undefined;
          const key = next !== undefined && typeof next['key'] === 'string' ? next['key'] : 'none';
          if (key !== step.key) {
            throw new StepFailure(`wingfoil ${nextArgs.join(' ')}: expected ${step.key}, `
              + `WingFoil names ${key}`);
          }
          break;
        }
        case 'finalize':
          wingfoil(['workflow', 'finalize', instance, '--step', step.key]);
          break;
        case 'add': {
          const data = parseJson(wingfoil(['memory', 'add', '--type', step.type, '--title',
            step.title, '--workflow', instance, '--step', step.step]), 'add');
          added = typeof data['id'] === 'string' ? data['id'] : '';
          if (added === '') throw new StepFailure('WingFoil named no element');
          break;
        }
        case 'submit':
          wingfoil(['memory', 'submit', added]);
          break;
        case 'approve': {
          const approver = { name: params['approver_name'] ?? '', email: params['approver_email']
            ?? '' };
          if (approver.email === '') throw new StepFailure('no approver_email');
          as(approver);
          // A failure ends the run, whose repository is its own: the agent is restored on success.
          wingfoil(['memory', 'approve', added, '--reason', APPROVAL_REASON]);
          as(agent);
          break;
        }
        case 'commit_copy':
          copyFileSync(join(repo, step.from), join(repo, step.to));
          commitAll(`${step.to} from ${step.from}`);
          break;
        case 'end':
          wingfoil(['workflow', 'end', instance]);
          break;
      }
    }
    return undefined;
  } catch (error) {
    if (error instanceof StepFailure || error instanceof GitError) {
      return `fail at ${current}: ${error.message}`;
    }
    return `fail at ${current}: ${messageOf(error)}`;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function parse(argv: string[]): { tree: string; cache: string; files: string[] } {
  let parsed: ReturnType<typeof parseArgs>;
  try {
    parsed = parseArgs({
      args: argv,
      options: { tree: { type: 'string' }, cache: { type: 'string' } },
      allowPositionals: true,
      strict: true,
    });
  } catch (error) {
    throw new UsageError(`${messageOf(error)}\n${USAGE}`);
  }
  const tree = parsed.values['tree'];
  const cache = parsed.values['cache'];
  return {
    tree: typeof tree === 'string' ? tree : '.',
    cache: typeof cache === 'string' ? cache : DEFAULT_CACHE,
    files: parsed.positionals,
  };
}

/** An I/O failure, exit 2: a release not installed or missing, a file or directory unreadable. */
function isIoError(error: unknown): boolean {
  if (error instanceof MatrixIoError || error instanceof NoReleaseError) return true;
  if (error instanceof YamlError) return error.reason === 'io';
  const code = (error as { code?: unknown }).code;
  return typeof code === 'string' || code === 2;
}

export function runRuns(argv: string[], options: RunsOptions = {}): RunsResult {
  let args: ReturnType<typeof parse>;
  try {
    args = parse(argv);
  } catch (error) {
    return { code: 3, lines: [messageOf(error)] };
  }
  const { tree } = args;
  if (!existsSync(tree) || !lstatSync(tree).isDirectory()) {
    return { code: 2, lines: [`${tree}: not a directory`] };
  }
  const compose = options.compose ?? realCompose;
  const install = options.install
    ?? ((version: string, cache: string) => installRelease(version, { pins: MATRIX_PINS, cache }));
  const execute = options.exec ?? realExec;

  const files = args.files.length > 0 ? args.files : scenarioFiles(tree);
  if (files.length === 0) return { code: 3, lines: [`no scenario file under ${SCENARIOS}`] };
  let scenarios: { scenario: Scenario; compositions: string[] }[];
  try {
    scenarios = files.map((file) => {
      const scenario = loadScenario(file, labelOf(tree, file));
      const compositions = compositionFiles(tree, scenario.compositions);
      if (compositions.length === 0) {
        throw new ScenarioError(`${scenario.label}: compositions: no example.yaml under `
          + `${scenario.compositions}`, 3);
      }
      return { scenario, compositions };
    });
  } catch (error) {
    return { code: error instanceof ScenarioError ? error.code : 2, lines: [messageOf(error)] };
  }

  const lines: string[] = [];
  let code = 0;
  let total = 0;
  let failed = 0;
  for (const { scenario, compositions } of scenarios) {
    for (const file of compositions) {
      let out: string | undefined;
      try {
        out = mkdtempSync(join(tmpdir(), 'runs-compose-'));
        const data = loadYamlFile(join(tree, file), file).data as {
          packs?: string[];
          parameters?: Record<string, string | number | boolean>;
        };
        const given = Object.fromEntries(Object.entries(data.parameters ?? {})
          .map(([name, value]) => [name, String(value)]));
        const output = join(out, 'output');
        const composed = compose(tree, data.packs ?? [], given, output);
        if (composed.releases.length === 0) {
          throw new NoReleaseError('no release in compat.yaml can run it');
        }
        for (const release of composed.releases) {
          let cli: string;
          try {
            cli = install(release, args.cache);
          } catch (error) {
            // One release that cannot be installed: its line, and the other releases go on.
            code = Math.max(code, isIoError(error) ? 2 : 1);
            // installRelease's messages already name the release: it is said once.
            const message = messageOf(error).replace(`wingfoil@${release}: `, '');
            lines.push(hideScratch(`runs ${file} wingfoil@${release}: ${message}`));
            continue;
          }
          for (const run of scenario.runs) {
            total += 1;
            const failure = runOne(run, output, composed.params, scenario.agent, cli, execute);
            const head = `runs ${file} ${run.main} wingfoil@${release}`;
            if (failure === undefined) {
              lines.push(`${head}: pass`);
            } else {
              failed += 1;
              code = Math.max(code, 1);
              lines.push(hideScratch(`${head}: ${failure}`));
            }
          }
        }
      } catch (error) {
        code = Math.max(code, isIoError(error) ? 2 : 1);
        lines.push(hideScratch(`runs ${file}: ${messageOf(error)}`));
      } finally {
        if (out !== undefined) rmSync(out, { recursive: true, force: true });
      }
    }
  }
  lines.push(`runs: ${total} ${total === 1 ? 'run' : 'runs'}, ${failed} failed`);
  return { code, lines };
}

/** The scenario files of the tree: tests/fixtures/runs/*.yaml, in byte order. */
function scenarioFiles(tree: string): string[] {
  const dir = join(tree, SCENARIOS);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => name.endsWith('.yaml')).sort(byBytes)
    .map((name) => join(dir, name));
}
