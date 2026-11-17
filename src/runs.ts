// `npm run check:runs -- [--tree <dir>] [--cache <dir>] [<scenario file>...]` (task-053, plan-049):
// a pack's workflows run on a real WingFoil release, which the matrix's three read-only commands
// do not do. Each scenario file names a folder of compositions (preset-format example.yaml files)
// and the runs to make on each: a `main` started, then its steps. Every run gets its own scratch
// repository holding the composed output, committed; its git identity is set in that repository
// only, never taken from the environment (task-045): the scenario's agent for every command, the
// composition's approver for an approval. Those commits and approvals are fixture data. Each run
// is made on every release the composition's matrix selects in self-test mode (the oldest and the
// newest, task-058), each installed as the matrix installs it. A failed step ends its run; the
// next run goes on. An adoption run (task-060, bug-007) starts instead from a project `wingfoil
// init --template` wrote and takes the composed `.wingfoil/` as the packs' READMEs say: copied over
// the project's, `custom/` kept, the `custom/` workflows and directives it names removed, the
// `custom/` workflows left re-included, committed; then `workflow list` and `workflow next` exit
// 0 with no diagnostic and no stderr line. The steps that drive a route (task-095, plan-076): a
// run may be a `chain` of mains run in order in one repository, each link's `start` making the
// instance its steps act on; `add` may name no step and may set a `label`; `submit`, `approve` and
// `set` name `added` or a label; `set` writes frontmatter fields and a body line of an element,
// `write` a file, each committed; `$<label>.id` stands for a labelled element's id in those
// texts and in the keys of `next` and `finalize`; a run's `only` lists the compositions it runs
// on, and its `name` names it in the report; a scenario's `overlay` composes on the merged tree
// `validate --overlay` builds (src/overlay-tree.ts). Exit 0 every run passed, 1 a run
// failed or a composition could not be composed, 2 an I/O error, 3 bad usage or a scenario it
// cannot read.
import { spawnSync } from 'node:child_process';
import {
  copyFileSync, cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync,
  realpathSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, isAbsolute, join, posix, relative, resolve as resolvePath } from 'node:path';
import { parseArgs } from 'node:util';

import {
  YAMLSeq, isScalar, isSeq, parse as parseYaml, parseDocument, stringify as stringifyYaml,
} from 'yaml';
import type { Document } from 'yaml';

import { loadCatalog } from './catalog';
import { readFrontmatter } from './frontmatter';
import { loadCompat } from './compat';
import { runCompose } from './compose-cli';
import { GitError, gitEnvironment, runGit } from './git';
import {
  DEFAULT_CACHE, MATRIX_PINS, MatrixIoError, installRelease, selectReleases,
} from './matrix';
import { treeLayout } from './layout-rules';
import { mapOverlayPaths, mergeOverlay, openOverlay } from './overlay-tree';
import type { Overlay } from './overlay-tree';
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
  | { kind: 'add'; type: string; title: string; step?: string; label?: string }
  | { kind: 'submit'; element: string }
  | { kind: 'approve'; element: string }
  | { kind: 'set'; element: string; fields: [string, string | string[]][]; body?: string }
  | { kind: 'write'; path: string; text: string };

/** One main of a run: its `start` makes the instance its other steps act on (task-095). */
interface Link {
  main: string;
  steps: Step[];
}

/** A run of one main (`single`) or a chain of mains in one repository (task-095). */
interface MainRun {
  kind: 'main';
  name?: string;
  only?: string[];
  links: Link[];
  single: boolean;
}

/** An adoption (task-060): `init --template`, then the composed `.wingfoil/` adopted. */
interface AdoptRun {
  kind: 'adopt';
  name?: string;
  only?: string[];
  template: string;
  workflows: string[];
  directives: string[];
}

type Run = MainRun | AdoptRun;

/** The run's name in the report: its `name`, its mains joined by `+`, or `adopt:<template>`. */
function runName(run: Run): string {
  if (run.name !== undefined) return run.name;
  return run.kind === 'main' ? run.links.map((link) => link.main).join('+')
    : `adopt:${run.template}`;
}

interface Scenario {
  label: string;
  compositions: string;
  overlay?: string;
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

/** A list of plain ids (no `/`), possibly empty. */
function idList(value: unknown, where: string): string[] {
  if (!Array.isArray(value)) throw new KeyProblem(where, 'a list is required');
  return value.map((item: unknown, n) => {
    const id = text(item, `${where}[${n}]`);
    if (id.includes('/') || id.includes('\\') || id === '.' || id === '..') {
      throw new KeyProblem(`${where}[${n}]`, 'a plain id is required');
    }
    return id;
  });
}

/** A label, a run's name or a composition id: a plain id (task-095). */
const PLAIN_ID = /^[a-z][a-z0-9-]*$/;
/** A labelled element's id at run time (task-095 criterion 6). */
const TOKEN = /\$([a-z][a-z0-9-]*)\.id(?![a-z0-9-])/g;
/** The element a step names when it names none: the last one added. */
const ADDED = 'added';

function plainId(value: unknown, where: string): string {
  const id = text(value, where);
  if (!PLAIN_ID.test(id)) throw new KeyProblem(where, 'a plain id is required');
  return id;
}

/** `only`: a non-empty list of composition ids, each given once. */
function readOnly(value: unknown, where: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new KeyProblem(where, 'a non-empty list is required');
  }
  const seen = new Set<string>();
  return value.map((item: unknown, n) => {
    const id = plainId(item, `${where}[${n}]`);
    if (seen.has(id)) throw new KeyProblem(`${where}[${n}]`, `${id} given twice`);
    seen.add(id);
    return id;
  });
}

function readAdopt(raw: unknown, where: string): Omit<AdoptRun, 'name' | 'only'> {
  if (!isRecord(raw)) throw new KeyProblem(where, 'a mapping is required');
  onlyKeys(raw, ['template', 'remove'], where);
  const template = text(raw['template'], `${where}.template`);
  const remove = raw['remove'];
  if (!isRecord(remove)) throw new KeyProblem(`${where}.remove`, 'a mapping is required');
  onlyKeys(remove, ['workflows', 'directives'], `${where}.remove`);
  return { kind: 'adopt', template,
    workflows: idList(remove['workflows'], `${where}.remove.workflows`),
    directives: idList(remove['directives'], `${where}.remove.directives`) };
}

/** `added` or a label. */
function elementRef(value: unknown, where: string): string {
  return value === ADDED ? ADDED : plainId(value, where);
}

/** A field's value for `set`: a string, or a list of strings. */
function fieldValue(value: unknown, where: string): string | string[] {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value;
  }
  throw new KeyProblem(where, 'a string or a list of strings is required');
}

function readSet(value: unknown, where: string): Step {
  if (!isRecord(value)) throw new KeyProblem(where, 'a mapping is required');
  onlyKeys(value, ['element', 'fields', 'body'], where);
  const element = elementRef(value['element'], `${where}.element`);
  if (value['fields'] === undefined && value['body'] === undefined) {
    throw new KeyProblem(where, 'fields or body is required');
  }
  const fields: [string, string | string[]][] = [];
  if (value['fields'] !== undefined) {
    const given = value['fields'];
    if (!isRecord(given) || Object.keys(given).length === 0) {
      throw new KeyProblem(`${where}.fields`, 'a non-empty mapping is required');
    }
    for (const [key, field] of Object.entries(given)) {
      if (key === 'id' || key === 'status') {
        throw new KeyProblem(`${where}.fields.${key}`,
          'never written: a state changes only through WingFoil\'s commands');
      }
      fields.push([key, fieldValue(field, `${where}.fields.${key}`)]);
    }
  }
  const body = value['body'] === undefined ? undefined : text(value['body'], `${where}.body`);
  return { kind: 'set', element, fields, ...body === undefined ? {} : { body } };
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
      return { kind: name, element: elementRef(value, `${where}.${name}`) };
    case 'commit_copy': {
      const copy = isRecord(value) ? value : {};
      onlyKeys(copy, ['from', 'to'], `${where}.${name}`);
      return { kind: name, from: repoPath(copy['from'], `${where}.${name}.from`),
        to: repoPath(copy['to'], `${where}.${name}.to`) };
    }
    case 'add': {
      const add = isRecord(value) ? value : {};
      onlyKeys(add, ['type', 'title', 'step', 'label'], `${where}.add`);
      const step = add['step'] === undefined ? undefined : text(add['step'], `${where}.add.step`);
      let label: string | undefined;
      if (add['label'] !== undefined) {
        if (add['label'] === ADDED) {
          throw new KeyProblem(`${where}.add.label`, '"added" names the last element added');
        }
        label = plainId(add['label'], `${where}.add.label`);
      }
      return { kind: name, type: text(add['type'], `${where}.add.type`),
        title: text(add['title'], `${where}.add.title`),
        ...step === undefined ? {} : { step }, ...label === undefined ? {} : { label } };
    }
    case 'set':
      return readSet(value, `${where}.set`);
    case 'write': {
      const write = isRecord(value) ? value : {};
      onlyKeys(write, ['path', 'text'], `${where}.write`);
      const path = repoPath(write['path'], `${where}.write.path`);
      if (underGit(path)) {
        throw new KeyProblem(`${where}.write.path`, 'never under .git/');
      }
      return { kind: name, path, text: text(write['text'], `${where}.write.text`) };
    }
    default:
      throw new KeyProblem(where, `unknown step ${JSON.stringify(name)}`);
  }
}

/** A repository path under `.git/`, however it is spelt (`./.git/config`, `a/../.git`). */
function underGit(path: string): boolean {
  const normal = posix.normalize(path);
  return normal === '.git' || normal.startsWith('.git/');
}

/** The texts of a step that may hold a token. */
function tokenTexts(step: Step): string[] {
  switch (step.kind) {
    case 'next':
    case 'finalize':
      return [step.key];
    case 'set':
      return [...step.fields.flatMap(([, value]) => (Array.isArray(value) ? value : [value])),
        ...step.body === undefined ? [] : [step.body]];
    case 'write':
      return [step.path, step.text];
    default:
      return [];
  }
}

/** The step needs its link's instance (task-095 criterion 1). */
function needsInstance(step: Step): boolean {
  return step.kind === 'next' || step.kind === 'finalize' || step.kind === 'end'
    || (step.kind === 'add' && step.step !== undefined);
}

/**
 * The static checks of a main run (task-095 criteria 1, 2, 6): in step order, an instance step
 * before its link's start, a label or token before its add or never added, a label added twice.
 */
function checkLinks(links: Link[], at: (link: number, step: number) => string): void {
  const all = new Set(links.flatMap((link) => link.steps)
    .flatMap((step) => (step.kind === 'add' && step.label !== undefined ? [step.label] : [])));
  const added = new Set<string>();
  let any = false;
  const named = (label: string, where: string): void => {
    if (!all.has(label)) throw new KeyProblem(where, `unknown label ${label}`);
    if (!added.has(label)) throw new KeyProblem(where, `label ${label} before its add`);
  };
  links.forEach((link, l) => {
    let started = false;
    link.steps.forEach((step, n) => {
      const where = `${at(l, n)}.${step.kind}`;
      if (needsInstance(step) && !started) throw new KeyProblem(where, 'before the link\'s start');
      if (step.kind === 'start') started = true;
      if (step.kind === 'submit' || step.kind === 'approve' || step.kind === 'set') {
        if (step.element === ADDED) {
          if (!any) throw new KeyProblem(where, 'no element added before');
        } else {
          named(step.element, where);
        }
      }
      for (const value of tokenTexts(step)) {
        for (const match of value.matchAll(TOKEN)) named(match[1] ?? '', where);
      }
      if (step.kind === 'add') {
        if (step.label !== undefined) {
          if (added.has(step.label)) {
            throw new KeyProblem(`${where}.label`, `label ${step.label} added twice`);
          }
          added.add(step.label);
        }
        any = true;
      }
    });
  });
}

function readSteps(value: unknown, where: string): Step[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new KeyProblem(where, 'a non-empty list is required');
  }
  return value.map((step: unknown, n) => readStep(step, `${where}[${n}]`));
}

function readRun(raw: unknown, r: number): Run {
  const where = `runs[${r}]`;
  if (!isRecord(raw)) throw new KeyProblem(where, 'a mapping is required');
  const common = {
    ...raw['name'] === undefined ? {} : { name: plainId(raw['name'], `${where}.name`) },
    ...raw['only'] === undefined ? {} : { only: readOnly(raw['only'], `${where}.only`) },
  };
  if ('adopt' in raw) {
    onlyKeys(raw, ['adopt', 'name', 'only'], where);
    return { ...readAdopt(raw['adopt'], `${where}.adopt`), ...common };
  }
  if ('chain' in raw) {
    onlyKeys(raw, ['chain', 'name', 'only'], where);
    const chain = raw['chain'];
    if (!Array.isArray(chain) || chain.length === 0) {
      throw new KeyProblem(`${where}.chain`, 'a non-empty list is required');
    }
    const links = chain.map((item: unknown, l): Link => {
      const at = `${where}.chain[${l}]`;
      if (!isRecord(item)) throw new KeyProblem(at, 'a mapping is required');
      onlyKeys(item, ['main', 'steps'], at);
      return { main: text(item['main'], `${at}.main`),
        steps: readSteps(item['steps'], `${at}.steps`) };
    });
    checkLinks(links, (l, n) => `${where}.chain[${l}].steps[${n}]`);
    return { kind: 'main', ...common, links, single: false };
  }
  onlyKeys(raw, ['main', 'steps', 'name', 'only'], where);
  const links = [{ main: text(raw['main'], `${where}.main`),
    steps: readSteps(raw['steps'], `${where}.steps`) }];
  checkLinks(links, (_l, n) => `${where}.steps[${n}]`);
  return { kind: 'main', ...common, links, single: true };
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
    onlyKeys(data, ['format', 'compositions', 'overlay', 'identities', 'runs'], '');
    if (data['format'] !== 1) throw new KeyProblem('format', 'must be 1');
    const compositions = repoPath(data['compositions'], 'compositions');
    const overlay = data['overlay'] === undefined ? undefined
      : repoPath(data['overlay'], 'overlay');
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
    const runs = runsRaw.map((raw: unknown, r) => readRun(raw, r));
    runs.forEach((run, r) => {
      if (run.name === undefined) return;
      const other = runs.findIndex((each, n) => n !== r && runName(each) === run.name);
      if (other >= 0) {
        throw new KeyProblem(`runs[${r}].name`, `${run.name} also names runs[${other}]`);
      }
    });
    return { label, compositions, ...overlay === undefined ? {} : { overlay }, agent, runs };
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

/** Hides every scratch directory of this command: `<tmpdir>/runs-…`, `<tmpdir>/validate-overlay-…`
 * (an overlay's merged tree, task-095) and their real paths. */
function hideScratch(line: string): string {
  let out = line;
  for (const base of new Set([tmpdir(), realpathSync(tmpdir())])) {
    for (const prefix of ['runs-', 'validate-overlay-']) {
      out = out.split(`${base}/${prefix}`).join(`<scratch>/${prefix}`)
        .replace(new RegExp(`<scratch>/${prefix}[^\\s/'"]*`, 'g'), '<scratch>');
    }
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
  let current = 'setup';
  const wingfoil = (args: string[]): WingfoilOutput => {
    const output = execute(cli, args, repo, env);
    if (output.status !== 0) {
      const text = output.stderr.trim() !== '' ? output.stderr : output.stdout;
      const why = text.split(/\r?\n/).find((line) => line.startsWith('error:'))
        ?? errorLine(lastLine(text));
      throw new StepFailure(`wingfoil ${args.join(' ')} exit ${output.status ?? 'none'}: ${why}`);
    }
    return output;
  };
  try {
    if (run.kind === 'adopt') {
      adopt(run, composed, repo, git, as, agent, commitAll, wingfoil, (stage) => {
        current = stage;
      });
      return undefined;
    }
    cpSync(composed, repo, { recursive: true });
    git(['init', '--quiet']);
    git(['config', 'commit.gpgSign', 'false']);
    as(agent);
    commitAll('composed output');
    const elements = new Map<string, { id: string; path: string }>();
    const element = (ref: string): { id: string; path: string } => {
      const found = elements.get(ref);
      // The static checks of loadScenario make this unreachable.
      if (found === undefined) throw new StepFailure(`no element ${ref}`);
      return found;
    };
    const expand = (value: string): string => value.replace(TOKEN,
      (_match, label: string) => element(label).id);
    for (const [l, link] of run.links.entries()) {
      instance = '';
      for (const step of link.steps) {
        current = run.single ? step.kind : `${link.main}[${l + 1}].${step.kind}`;
        switch (step.kind) {
          case 'start': {
            const data = parseJson(wingfoil(['workflow', 'start', link.main, '--format', 'json']),
              'start');
            const found = isRecord(data['instance']) ? data['instance'] : {};
            instance = typeof found['id'] === 'string' ? found['id'] : '';
            if (instance === '') throw new StepFailure('WingFoil named no instance');
            if (found['planStatus'] !== 'active') {
              throw new StepFailure(`plan ${instance} is ${String(found['planStatus'])}, `
                + 'not active');
            }
            const search = parseJson(wingfoil(['memory', 'search', '--type', 'plan', '--format',
              'json']), 'search');
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
            const key = next !== undefined && typeof next['key'] === 'string' ? next['key']
              : 'none';
            const expected = expand(step.key);
            if (key !== expected) {
              throw new StepFailure(`wingfoil ${nextArgs.join(' ')}: expected ${expected}, `
                + `WingFoil names ${key}`);
            }
            break;
          }
          case 'finalize':
            wingfoil(['workflow', 'finalize', instance, '--step', expand(step.key)]);
            break;
          case 'add': {
            const data = parseJson(wingfoil(['memory', 'add', '--type', step.type, '--title',
              step.title, ...step.step === undefined ? [] : ['--workflow', instance, '--step',
                step.step]]), 'add');
            const id = typeof data['id'] === 'string' ? data['id'] : '';
            if (id === '') throw new StepFailure('WingFoil named no element');
            const path = typeof data['path'] === 'string' ? data['path'] : '';
            elements.set(ADDED, { id, path });
            if (step.label !== undefined) elements.set(step.label, { id, path });
            break;
          }
          case 'submit':
            wingfoil(['memory', 'submit', element(step.element).id]);
            break;
          case 'approve': {
            const approver = { name: params['approver_name'] ?? '', email: params['approver_email']
              ?? '' };
            if (approver.email === '') throw new StepFailure('no approver_email');
            as(approver);
            // A failure ends the run, whose repository is its own: the agent is restored on
            // success.
            wingfoil(['memory', 'approve', element(step.element).id, '--reason', APPROVAL_REASON]);
            as(agent);
            break;
          }
          case 'set': {
            const { id, path } = element(step.element);
            const file = join(repo, path);
            if (path === '' || !inside(path) || !existsSync(file)) {
              throw new StepFailure(`${path === '' ? id : path}: no element file`);
            }
            const fields = step.fields.map(([key, value]): [string, string | string[]] =>
              [key, Array.isArray(value) ? value.map(expand) : expand(value)]);
            writeFileSync(file, setFields(readFileSync(file, 'utf8'), fields,
              step.body === undefined ? undefined : expand(step.body), path));
            commitAll(`set ${id}`);
            break;
          }
          case 'write': {
            const path = expand(step.path);
            if (!inside(path)) throw new StepFailure(`${path} leaves the repository`);
            if (underGit(path)) throw new StepFailure(`${path} is under .git/`);
            mkdirSync(dirname(join(repo, path)), { recursive: true });
            writeFileSync(join(repo, path), expand(step.text));
            commitAll(`write ${path}`);
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

/** A frontmatter's top-level key line. */
function keyLine(line: string, key: string): boolean {
  return line.startsWith(`${key}:`) && /^\s|^$/.test(line.slice(key.length + 1));
}

/**
 * `set` (task-095 criterion 4): each field's block in the frontmatter replaced, or added after
 * the last key, every other line byte-identical; the body line appended. The frontmatter must
 * parse back to the values given.
 */
export function setFields(text: string, fields: [string, string | string[]][],
  body: string | undefined, path: string): string {
  if (text.startsWith('\uFEFF') || text.includes('\r\n')) {
    throw new StepFailure(`${path}: a BOM or CRLF line endings, which set does not write`);
  }
  const all = text.split('\n');
  const close = all[0] === '---' ? all.indexOf('---', 1) : -1;
  if (close < 0) throw new StepFailure(`${path}: no frontmatter`);
  const lines = all.slice(1, close);
  for (const [key, value] of fields) {
    const rendered = stringifyYaml({ [key]: value }, { lineWidth: 0 }).trimEnd().split('\n');
    const at = lines.findIndex((line) => keyLine(line, key));
    if (at < 0) {
      let last = lines.length - 1;
      while (last >= 0 && ((lines[last] ?? '').trim() === '' || (lines[last] ?? '').startsWith('#'))) {
        last -= 1;
      }
      lines.splice(last + 1, 0, ...rendered);
      continue;
    }
    // The key's block: its indented or `- ` lines, blank lines kept while one of those follows.
    let end = at + 1;
    for (let next = at + 1; next < lines.length; next += 1) {
      const line = lines[next] ?? '';
      if (line.trim() === '') continue;
      if (!/^(\s|- )/.test(line)) break;
      end = next + 1;
    }
    lines.splice(at, end - at, ...rendered);
  }
  const front = lines.join('\n');
  let parsed: unknown;
  try {
    parsed = parseYaml(front);
  } catch (error) {
    throw new StepFailure(`${path}: the frontmatter does not parse: ${messageOf(error)}`);
  }
  for (const [key, value] of fields) {
    const got = isRecord(parsed) ? parsed[key] : undefined;
    if (JSON.stringify(got) !== JSON.stringify(value)) {
      throw new StepFailure(`${path}: ${key} does not parse back as given`);
    }
  }
  let out = ['---', ...lines, ...all.slice(close)].join('\n');
  if (body !== undefined) out = `${out}${out.endsWith('\n') ? '' : '\n'}${body}\n`;
  return out;
}

const WORKFLOWS_FILE = join('.wingfoil', 'workflows.yaml');
const CUSTOM_WORKFLOWS = 'workflows/custom/';

/** The `include` list of a parsed `workflows.yaml`: a new empty one when absent or null. */
function includeList(document: Document): YAMLSeq {
  const include = document.get('include');
  if (isSeq(include)) return include;
  if (include === undefined || include === null) {
    const created = new YAMLSeq();
    document.set('include', created);
    return created;
  }
  throw new StepFailure('workflows.yaml: include is not a list');
}

/** The entries of an `include` list, as written. */
function entriesOf(include: YAMLSeq): string[] {
  return include.items.map((item) => (isScalar(item) ? String(item.value) : String(item)));
}

/** WingFoil's error line: a JSON `error` when it printed one, with how many details follow. */
function errorLine(text: string): string {
  try {
    const data = JSON.parse(text.trim()) as unknown;
    if (isRecord(data) && typeof data['error'] === 'string') {
      const more = Array.isArray(data['details']) ? data['details'].length : 0;
      return more > 0 ? `${data['error']} (+${more} more)` : data['error'];
    }
  } catch {
    // not JSON: the caller's line stands
  }
  return text;
}

/**
 * The adoption run (task-060): the README's steps 3 and 4 on a project `init` wrote. `stage`
 * names the stage for a failure's line.
 */
function adopt(run: AdoptRun, composed: string, repo: string, git: (args: string[]) => void,
  as: (who: Identity) => void, agent: Identity, commitAll: (message: string) => void,
  wingfoil: (args: string[]) => WingfoilOutput, stage: (name: string) => void): void {
  stage('init');
  mkdirSync(repo, { recursive: true });
  git(['init', '--quiet']);
  git(['config', 'commit.gpgSign', 'false']);
  as(agent);
  wingfoil(['init', '--template', run.template]);
  stage('copy');
  cpSync(composed, repo, { recursive: true });
  stage('remove');
  for (const id of run.workflows) {
    rmSync(join(repo, '.wingfoil', 'workflows', 'custom', `${id}.yaml`), { force: true });
  }
  for (const id of run.directives) {
    rmSync(join(repo, '.wingfoil', 'directives', 'custom', `${id}.md`), { force: true });
  }
  stage('include');
  const file = join(repo, WORKFLOWS_FILE);
  const document = parseDocument(readFileSync(file, 'utf8'));
  const include = includeList(document);
  const present = new Set(entriesOf(include));
  const customDir = join(repo, '.wingfoil', 'workflows', 'custom');
  const own = existsSync(customDir) ? readdirSync(customDir)
    .filter((name) => name.endsWith('.yaml')).sort(byBytes)
    .map((name) => `${CUSTOM_WORKFLOWS}${name}`) : [];
  for (const entry of own) {
    if (!present.has(entry)) include.add(document.createNode(entry));
  }
  writeFileSync(file, document.toString());
  stage('commit');
  commitAll('adopted the composition');
  stage('list');
  const list = wingfoil(['workflow', 'list', '--format', 'json']);
  quiet(list, 'workflow list --format json');
  const data = parseJson(list, 'list');
  const diagnostics: unknown[] = Array.isArray(data['diagnostics']) ? data['diagnostics'] : [];
  if (diagnostics.length > 0) {
    const codes = diagnostics.map((d) => (isRecord(d) && typeof d['code'] === 'string'
      ? d['code'] : JSON.stringify(d)));
    throw new StepFailure(`WingFoil reports ${diagnostics.length} diagnostic`
      + `${diagnostics.length === 1 ? '' : 's'}: ${codes.join(', ')}`);
  }
  stage('next');
  quiet(wingfoil(['workflow', 'next', '--format', 'json']), 'workflow next --format json');
  stage('check');
  const included = entriesOf(includeList(parseDocument(readFileSync(file, 'utf8'))));
  for (const id of run.workflows) {
    const entry = `${CUSTOM_WORKFLOWS}${id}.yaml`;
    if (included.includes(entry)) throw new StepFailure(`workflows.yaml still includes ${entry}`);
    if (existsSync(join(repo, '.wingfoil', entry))) throw new StepFailure(`${entry} remains`);
  }
  for (const id of run.directives) {
    const entry = `directives/custom/${id}.md`;
    if (existsSync(join(repo, '.wingfoil', entry))) throw new StepFailure(`${entry} remains`);
  }
}

/** A command that exited 0 but wrote to stderr fails its stage. */
function quiet(output: WingfoilOutput, command: string): void {
  const line = output.stderr.trim();
  if (line !== '') {
    throw new StepFailure(`wingfoil ${command} wrote to stderr: ${lastLine(line)}`);
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

/** The composition id of `<folder>/<id>/example.yaml`. */
function compositionId(file: string): string {
  const parts = file.split('/');
  return parts[parts.length - 2] ?? '';
}

/** A scenario read, with its compositions and the overlay its compositions resolve on. */
interface Loaded {
  scenario: Scenario;
  compositions: string[];
  overlay?: Overlay;
}

/** Opens and merges a scenario's overlay (task-095 criterion 8), or throws its ScenarioError. */
function scenarioOverlay(tree: string, scenario: Scenario, opened: Overlay[]): Overlay | undefined {
  if (scenario.overlay === undefined) return undefined;
  const overlay = openOverlay(tree, scenario.overlay);
  if (!('merged' in overlay)) {
    throw new ScenarioError(`${scenario.label}: overlay: ${overlay.reason}`, overlay.code);
  }
  opened.push(overlay);
  overlay.packs = treeLayout(overlay.dir).packs;
  const [shadow] = mergeOverlay(tree, overlay);
  if (shadow !== undefined) {
    throw new ScenarioError(`${scenario.label}: overlay: packs/${shadow.pack} shadows the tree's `
      + `packs/${shadow.other}`, 3);
  }
  return overlay;
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
  const opened: Overlay[] = [];
  try {
    return runScenarios(args, options, opened);
  } finally {
    for (const overlay of opened) rmSync(overlay.root, { recursive: true, force: true });
  }
}

function runScenarios(args: ReturnType<typeof parse>, options: RunsOptions, opened: Overlay[]):
RunsResult {
  const { tree } = args;
  const compose = options.compose ?? realCompose;
  const install = options.install
    ?? ((version: string, cache: string) => installRelease(version, { pins: MATRIX_PINS, cache }));
  const execute = options.exec ?? realExec;

  const files = args.files.length > 0 ? args.files : scenarioFiles(tree);
  if (files.length === 0) return { code: 3, lines: [`no scenario file under ${SCENARIOS}`] };
  let scenarios: Loaded[];
  try {
    scenarios = files.map((file): Loaded => {
      const scenario = loadScenario(file, labelOf(tree, file));
      const overlay = scenarioOverlay(tree, scenario, opened);
      const compositions = compositionFiles(tree, scenario.compositions);
      if (compositions.length === 0) {
        throw new ScenarioError(`${scenario.label}: compositions: no example.yaml under `
          + `${scenario.compositions}`, 3);
      }
      const ids = new Set(compositions.map(compositionId));
      scenario.runs.forEach((run, r) => {
        run.only?.forEach((id, n) => {
          if (!ids.has(id)) {
            throw new ScenarioError(`${scenario.label}: runs[${r}].only[${n}]: no composition `
              + `${id} under ${scenario.compositions}`, 3);
          }
        });
      });
      return { scenario, compositions, ...overlay === undefined ? {} : { overlay } };
    });
  } catch (error) {
    return { code: error instanceof ScenarioError ? error.code : 2,
      lines: [hideScratch(messageOf(error))] };
  }

  const lines: string[] = [];
  let code = 0;
  let total = 0;
  let failed = 0;
  for (const { scenario, compositions, overlay } of scenarios) {
    try {
      ({ code, total, failed } = runScenario(scenario, compositions, overlay, args, lines,
        { code, total, failed }, { compose, install, execute }));
    } finally {
      // Each merged tree goes once its scenario is done (criterion 8).
      if (overlay !== undefined) rmSync(overlay.root, { recursive: true, force: true });
    }
  }
  lines.push(`runs: ${total} ${total === 1 ? 'run' : 'runs'}, ${failed} failed`);
  return { code, lines };
}

interface Counts {
  code: number;
  total: number;
  failed: number;
}

/** The runs of one scenario on its compositions; its lines appended, the counts carried on. */
function runScenario(scenario: Scenario, compositions: string[], overlay: Overlay | undefined,
  args: ReturnType<typeof parse>, lines: string[], counts: Counts,
  tools: { compose: Compose; install: (version: string, cache: string) => string; execute: Exec }):
Counts {
  const { tree } = args;
  const { compose, install, execute } = tools;
  let { code, total, failed } = counts;
  const composeTree = overlay?.merged ?? tree;
  const shown = (line: string): string => hideScratch(overlay === undefined ? line
    : mapOverlayPaths(line, tree, overlay));
  for (const file of compositions) {
    const id = compositionId(file);
    const runs = scenario.runs.filter((run) => run.only === undefined || run.only.includes(id));
    if (runs.length === 0) continue;
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
      const composed = compose(composeTree, data.packs ?? [], given, output);
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
          lines.push(shown(`runs ${file} wingfoil@${release}: ${message}`));
          continue;
        }
        for (const run of runs) {
          total += 1;
          const failure = runOne(run, output, composed.params, scenario.agent, cli, execute);
          const head = `runs ${file} ${runName(run)} wingfoil@${release}`;
          if (failure === undefined) {
            lines.push(`${head}: pass`);
          } else {
            failed += 1;
            code = Math.max(code, 1);
            lines.push(shown(`${head}: ${failure}`));
          }
        }
      }
    } catch (error) {
      code = Math.max(code, isIoError(error) ? 2 : 1);
      lines.push(shown(`runs ${file}: ${messageOf(error)}`));
    } finally {
      if (out !== undefined) rmSync(out, { recursive: true, force: true });
    }
  }
  return { code, total, failed };
}

/** The scenario files of the tree: tests/fixtures/runs/*.yaml, in byte order. */
function scenarioFiles(tree: string): string[] {
  const dir = join(tree, SCENARIOS);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => name.endsWith('.yaml')).sort(byBytes)
    .map((name) => join(dir, name));
}
