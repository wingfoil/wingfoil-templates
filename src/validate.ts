// `npm run validate`: the one validation command (F3.1). In one pass: the schema checks of the
// tree's files, then every preset and the given entries, each composed twice and compared (F3.4),
// then run through the compatibility matrix (F3.3, task-011) in the mode the caller fixes. The
// report lines are stable: the release evidence of plan-015 task 11 reads them. With --overlay
// (task-046, plan-046 ruling 1), the packs and compositions of a directory under tests/fixtures/
// are composed with this tree's packs, on a merged temporary tree; never in publication mode.
import {
  cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync,
  rmSync, statSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, sep } from 'node:path';
import { parseArgs } from 'node:util';

import { CatalogError, loadCatalog, softwarePack } from './catalog';
import type { Catalog } from './catalog';
import { findFiles, runCheckSchemas } from './check-schemas';
import { lintContext, runCheckPacks } from './check-packs';
import { CompatError, loadCompat } from './compat';
import type { Compat } from './compat';
import { composeTwice, type DeterminismOptions } from './determinism';
import { exampleFiles } from './examples';
import { runIndex } from './index';
import { packLayoutProblems, treeLayout } from './layout-rules';
import {
  DEFAULT_CACHE, MATRIX_PINS, MatrixIoError, installRelease, runRelease, selectReleases,
} from './matrix';
import type { MatrixMode } from './matrix';
import { formatProblem, sortProblems } from './problems';
import type { Problem } from './problems';
import type { VersionRequirements } from './range';
import { ResolveError, resolve } from './resolve';
import type { ResolvedPack } from './resolve';
import { repositorySchemas } from './schemas';
import { secretProblems } from './secret-rules';
import { presetChecks } from './tree-rules';
import { YamlError, loadYamlFile } from './yaml-load';
import { yamlProblems } from './yaml-rules';

export interface ValidateOptions extends Omit<DeterminismOptions, 'use'> {
  /** Fixed by the entry point, never by argv or the data (dl-009); no default. */
  mode: MatrixMode;
  /** Replaces the install of a release: tests give a stub CLI and never reach the network. */
  install?: (version: string) => string;
}

export interface ValidateResult {
  code: number;
  lines: string[];
  mode: MatrixMode;
  /** The releases for which the self-test tolerance was applied; empty for a clean run. */
  tolerated: string[];
}

class UsageError extends Error {}

interface Composition {
  /** `presets/<id>.yaml`, an example's `tests/fixtures/examples/…/example.yaml`, or `entries`. */
  label: string;
  entries: string[];
  /** Values the preset sets, as text. */
  preset: Record<string, string>;
  /** The lint reports it: its line says so in its place, and it is not composed. */
  skip?: boolean;
  /** A leg without software: the preset's values it dropped (plan-039 R5). */
  dropped?: string[];
  /** The skip line's reason, when not the lint's. */
  skipReason?: string;
  /** Resolved and composed on the overlay's merged tree (task-046). */
  overlay?: boolean;
  /** One of the overlay's compositions or its leg: its packs count as reached (criterion 3). */
  reaches?: boolean;
}

/** The overlay of a run (task-046): the directory, its path in the tree, and the merged tree. */
interface Overlay {
  dir: string;
  /** Relative to the tree, with `/` separators. */
  rel: string;
  /** Its pack paths under packs/, in byte order. */
  packs: string[];
  /** The temporary directory holding the merged tree; removed when the run ends. */
  root: string;
  merged: string;
}

/** The line of plan-046 ruling 1: an overlay never reaches a publication. */
export const OVERLAY_PUBLICATION =
  '--overlay: an overlay is never publishable (plan-046 ruling 1)';

function parseParams(raw: string[]): Map<string, string> {
  const values = new Map<string, string>();
  for (const entry of raw) {
    const at = entry.indexOf('=');
    if (at <= 0) throw new UsageError(`--param ${JSON.stringify(entry)} is not <name>=<value>`);
    const name = entry.slice(0, at);
    if (values.has(name)) throw new UsageError(`--param ${name} is given twice`);
    values.set(name, entry.slice(at + 1));
  }
  return values;
}

interface Args {
  tree: string;
  params: Map<string, string>;
  entries: string[];
  cache: string;
  overlay: string | undefined;
}

function parse(argv: string[]): Args {
  try {
    const { values, positionals } = parseArgs({
      args: argv,
      options: {
        tree: { type: 'string' },
        param: { type: 'string', multiple: true },
        cache: { type: 'string' },
        overlay: { type: 'string', multiple: true },
      },
      allowPositionals: true,
      strict: true,
    });
    const overlays = values.overlay ?? [];
    if (overlays.length > 1) throw new UsageError('--overlay is given more than once');
    return { tree: values.tree ?? process.cwd(), params: parseParams(values.param ?? []),
      entries: positionals, cache: values.cache ?? DEFAULT_CACHE, overlay: overlays[0] };
  } catch (error) {
    if (error instanceof UsageError) throw error;
    throw new UsageError(error instanceof Error ? error.message : String(error));
  }
}

function presetComposition(tree: string, file: string): Composition {
  const data = loadYamlFile(join(tree, file), file).data as {
    packs: string[];
    parameters?: Record<string, string | number | boolean>;
  };
  const preset = Object.fromEntries(Object.entries(data.parameters ?? {})
    .map(([name, value]) => [name, String(value)]));
  return { label: file, entries: data.packs, preset };
}

/** The parameters a composition's packs declare, and what each pack needs of a release. */
function packsOf(tree: string, catalog: Catalog, entries: string[]):
{ packs: ResolvedPack[]; declared: Set<string>; requirements: VersionRequirements[] } {
  const packs = resolve(tree, catalog, entries);
  return {
    packs,
    declared: new Set(packs.flatMap((pack) => Object.keys(pack.manifest.parameters ?? {}))),
    requirements: packs.map((pack) => ({
      formats: pack.manifest.formats,
      requires_capabilities: pack.manifest.requires_capabilities ?? [],
    })),
  };
}

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? '' : 's'}`;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** The matrix of one validate run: releases installed once each, results counted. */
class Matrix {
  runs = 0;
  failed = 0;
  readonly tolerated = new Set<string>();
  private readonly installed = new Map<string, string | MatrixIoError>();

  constructor(
    readonly mode: MatrixMode,
    private readonly install: (version: string) => string,
    private readonly fail: (level: number, line: string) => void,
    private readonly report: (line: string) => void,
  ) {}

  private cli(version: string): string | MatrixIoError {
    let cli = this.installed.get(version);
    if (cli === undefined) {
      try {
        cli = this.install(version);
      } catch (error) {
        cli = error instanceof MatrixIoError ? error : new MatrixIoError(messageOf(error));
      }
      this.installed.set(version, cli);
    }
    return cli;
  }

  run(label: string, composed: string, compat: Compat, requirements: VersionRequirements[]):
  void {
    const releases = selectReleases(requirements, compat.releases, this.mode);
    if (releases.length === 0) {
      this.fail(1, `matrix ${label}: no compatible release (${this.mode})`);
      return;
    }
    for (const release of releases) {
      this.runs += 1;
      const head = `matrix ${label} wingfoil@${release.wingfoil}`;
      const cli = this.cli(release.wingfoil);
      if (cli instanceof MatrixIoError) {
        this.failed += 1;
        this.fail(2, `${head}: ${cli.message}`);
        continue;
      }
      const result = runRelease(cli, composed, release, this.mode);
      if (result.message !== undefined) {
        this.failed += 1;
        this.fail(result.code, `${head}: ${result.message}`);
        continue;
      }
      for (const outcome of result.outcomes) {
        if (outcome.pass) {
          const tolerated = outcome.tolerated > 0 ? `, tolerated ${outcome.tolerated}` : '';
          if (outcome.tolerated > 0) this.tolerated.add(release.wingfoil);
          this.report(`${head} ${outcome.command}: pass (${this.mode}${tolerated})`);
        } else {
          this.fail(1, `${head} ${outcome.command}: fail (${this.mode}): ${outcome.reason}`);
        }
      }
      if (result.code !== 0) this.failed += 1;
    }
  }

  summary(): string {
    const tolerated = [...this.tolerated];
    return `matrix: ${this.mode}, ${count(this.runs, 'run')}, ${this.failed} failed, `
      + `tolerance applied: ${tolerated.length > 0 ? tolerated.join(', ') : 'none'}`;
  }
}

function posix(path: string): string {
  return path.split(sep).join('/');
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * A line from the merged tree, as this tree names it: the merged tree's own path becomes the
 * tree's, and `packs/<p>` of an overlay pack `<p>` becomes `<overlay>/packs/<p>`.
 */
function mapOverlayPaths(text: string, tree: string, overlay: Overlay): string {
  const packs = [...overlay.packs].sort((a, b) => b.length - a.length);
  let mapped = text;
  for (const pack of packs) {
    mapped = mapped.split(`${overlay.merged}/packs/${pack}`)
      .join(`${tree}/${overlay.rel}/packs/${pack}`);
  }
  mapped = mapped.split(overlay.merged).join(tree);
  for (const pack of packs) {
    const pattern = new RegExp(`(^|[\\s'"\`(])packs/${escapeRegExp(pack)}`
      + '(?=$|[/\\s\'"`):,;]|\\.(?=$|\\s))', 'g');
    mapped = mapped.replace(pattern, (_match, lead: string) =>
      `${lead}${overlay.rel}/packs/${pack}`);
  }
  return mapped;
}

/** The overlay `--overlay` names, or the exit code and line that refuse it (criterion 1). */
function openOverlay(tree: string, given: string): Overlay | { code: number; line: string } {
  const dir = isAbsolute(given) ? given : join(tree, given);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    return { code: 2, line: `${given}: not a directory` };
  }
  const real = realpathSync(dir);
  const base = realpathSync(tree);
  const declared = join(base, 'tests', 'fixtures');
  const fixtures = existsSync(declared) ? realpathSync(declared) : declared;
  if (!real.startsWith(`${fixtures}${sep}`)) {
    return { code: 3, line: `--overlay ${given}: not under tests/fixtures/` };
  }
  if (`${real}${sep}`.startsWith(`${join(fixtures, 'examples')}${sep}`)) {
    return { code: 3, line: `--overlay ${given}: under tests/fixtures/examples/, which the tree's `
      + 'lint covers' };
  }
  const root = mkdtempSync(join(tmpdir(), 'validate-overlay-'));
  return { dir: real, rel: posix(relative(base, real)), packs: [], root,
    merged: join(root, 'tree') };
}

interface OverlayCheck {
  checked: number;
  problems: Problem[];
  /** Its compositions' example.yaml, relative to the tree, in the byte order of their ids. */
  files: string[];
  /** An overlay pack shadows a pack of the tree: no composition of the overlay runs. */
  shadowed: boolean;
}

/** Every regular file under a directory, relative to it, links not followed. */
function overlayFiles(dir: string, rel = ''): string[] {
  return readdirSync(join(dir, rel)).sort(byBytes).flatMap((name) => {
    const path = rel === '' ? name : `${rel}/${name}`;
    const stat = lstatSync(join(dir, path));
    if (stat.isDirectory()) return overlayFiles(dir, path);
    return stat.isFile() ? [path] : [];
  });
}

/**
 * The overlay's own checks (criteria 2–4), and the merged tree they leave: this tree's packs/,
 * catalog.yaml and compat.yaml, and the overlay's packs that shadow none of the tree's.
 */
function checkOverlay(tree: string, overlay: Overlay): OverlayCheck {
  const problems: Problem[] = [];
  const inOverlay = (problem: Problem): Problem => ({ ...problem,
    file: `${overlay.rel}/${problem.file}`,
    message: problem.message.replace(/(^|[\s'"`(])packs\//g,
      (_match, lead: string) => `${lead}${overlay.rel}/packs/`) });
  for (const name of readdirSync(overlay.dir).sort(byBytes)) {
    const stat = lstatSync(join(overlay.dir, name));
    if ((name === 'packs' || name === 'compositions') && stat.isDirectory()) continue;
    problems.push({ file: `${overlay.rel}/${name}`, rule: 'overlay-layout',
      message: 'an overlay holds packs/ and compositions/ only (task-046)' });
  }
  const layout = treeLayout(overlay.dir);
  overlay.packs = layout.packs;
  problems.push(...layout.problems.map(inOverlay));
  for (const pack of layout.packs) {
    problems.push(...packLayoutProblems(overlay.dir, { id: pack, path: `packs/${pack}` })
      .map(inOverlay));
  }
  const held = treeLayout(tree).packs;
  let shadowed = false;
  mkdirSync(overlay.merged);
  if (existsSync(join(tree, 'packs'))) {
    cpSync(join(tree, 'packs'), join(overlay.merged, 'packs'), { recursive: true });
  }
  for (const file of ['catalog.yaml', 'compat.yaml']) {
    if (existsSync(join(tree, file))) cpSync(join(tree, file), join(overlay.merged, file));
  }
  for (const pack of layout.packs) {
    const shadows = held.filter((other) => other === pack || pack.startsWith(`${other}/`)
      || other.startsWith(`${pack}/`));
    for (const other of shadows) {
      problems.push({ file: `${overlay.rel}/packs/${pack}`, rule: 'overlay-shadow',
        message: `this tree's packs/ already holds packs/${other}: an overlay never shadows a `
          + 'pack of the tree (plan-046 ruling 1)' });
    }
    if (shadows.length > 0) {
      shadowed = true;
      continue;
    }
    cpSync(join(overlay.dir, 'packs', pack), join(overlay.merged, 'packs', pack),
      { recursive: true });
  }
  const schemas = repositorySchemas();
  const schemaProblems = (file: string, kind: 'pack' | 'preset', data: unknown,
    positionOf: (pointer: string) => { line: number; column: number }): Problem[] =>
    schemas.validate(kind, data).map((error) => ({ file, rule: 'schema',
      ...positionOf(error.instancePath),
      message: `${error.instancePath || '/'} ${error.keyword}: ${error.message ?? ''}` }));
  for (const pack of layout.packs) {
    const file = `${overlay.rel}/packs/${pack}/pack.yaml`;
    try {
      const yaml = loadYamlFile(join(overlay.dir, 'packs', pack, 'pack.yaml'), file);
      problems.push(...schemaProblems(file, 'pack', yaml.data, (pointer) =>
        yaml.positionOf(pointer)));
    } catch (error) {
      if (!(error instanceof YamlError) || error.reason === 'io') throw error;
      problems.push({ file, rule: 'parse', message: error.message });
    }
  }
  const files: string[] = [];
  const compositions = join(overlay.dir, 'compositions');
  if (existsSync(compositions) && lstatSync(compositions).isDirectory()) {
    for (const id of readdirSync(compositions).sort(byBytes)) {
      const rel = `${overlay.rel}/compositions/${id}`;
      const stat = lstatSync(join(compositions, id));
      if (!stat.isDirectory()) {
        problems.push({ file: rel, rule: 'overlay-layout',
          message: 'compositions/ holds one directory per composition (task-046)' });
        continue;
      }
      for (const name of readdirSync(join(compositions, id)).sort(byBytes)) {
        if (name === 'example.yaml') continue;
        problems.push({ file: `${rel}/${name}`, rule: 'overlay-layout',
          message: 'a composition\'s directory holds its example.yaml only (task-046)' });
      }
      const example = join(compositions, id, 'example.yaml');
      if (!existsSync(example) || !lstatSync(example).isFile()) {
        problems.push({ file: `${rel}/example.yaml`, rule: 'overlay-layout',
          message: 'missing: a composition is an example.yaml (task-046)' });
        continue;
      }
      files.push(`${rel}/example.yaml`);
    }
  }
  const context = lintContext(overlay.merged, new Set(), []);
  for (const file of files) {
    let yaml;
    try {
      yaml = loadYamlFile(join(tree, file), file);
    } catch (error) {
      if (!(error instanceof YamlError) || error.reason === 'io') throw error;
      problems.push({ file, rule: 'parse', message: error.message });
      continue;
    }
    const loaded = yaml;
    const invalid = schemaProblems(file, 'preset', loaded.data, (pointer) =>
      loaded.positionOf(pointer));
    problems.push(...invalid);
    if (invalid.length > 0) continue;
    const data = loaded.data as { id: string; profile?: unknown };
    const id = file.split('/').at(-2) ?? '';
    if (data.id !== id) {
      problems.push({ file, rule: 'overlay-composition',
        message: `id ${JSON.stringify(data.id)} is not its directory's name, ${id} (task-046)` });
    }
    if (data.profile !== undefined) {
      problems.push({ file, rule: 'overlay-composition',
        message: 'an overlay composition has no profile (task-046)' });
    }
    problems.push(...yamlProblems(file, loaded), ...presetChecks(context, loaded));
  }
  const all = overlayFiles(overlay.dir);
  for (const file of all) {
    problems.push(...secretProblems(`${overlay.rel}/${file}`,
      readFileSync(join(overlay.dir, file), 'utf8')));
  }
  return { checked: all.length, problems: sortProblems(problems), files, shadowed };
}

export function runValidate(argv: string[], options: ValidateOptions): ValidateResult {
  const mode = options.mode;
  let args: Args;
  try {
    args = parse(argv);
  } catch (error) {
    return { code: 3, lines: [messageOf(error)], mode, tolerated: [] };
  }
  // plan-046 ruling 1: an overlay never reaches a publication, whoever calls in this mode.
  if (args.overlay !== undefined && mode === 'publication') {
    return { code: 3, lines: [OVERLAY_PUBLICATION], mode, tolerated: [] };
  }
  if (!existsSync(args.tree) || !statSync(args.tree).isDirectory()) {
    return { code: 2, lines: [`${args.tree}: not a directory`], mode, tolerated: [] };
  }
  let overlay: Overlay | undefined;
  if (args.overlay !== undefined) {
    const opened = openOverlay(args.tree, args.overlay);
    if ('line' in opened) return { code: opened.code, lines: [opened.line], mode, tolerated: [] };
    overlay = opened;
  }
  try {
    return validateTree(args, options, overlay);
  } finally {
    if (overlay !== undefined) rmSync(overlay.root, { recursive: true, force: true });
  }
}

function validateTree(args: Args, options: ValidateOptions, overlay: Overlay | undefined):
ValidateResult {
  const mode = options.mode;
  const lines: string[] = [];
  let code = 0;
  const fail = (level: number, line: string): void => {
    code = Math.max(code, level);
    lines.push(line);
  };
  const cache = args.cache;
  // The matrix's lines come after the composition lines, in their own block.
  const matrixLines: string[] = [];
  const matrix = new Matrix(mode,
    options.install ?? ((version) => installRelease(version, { pins: MATRIX_PINS, cache })),
    (level, line) => {
      code = Math.max(code, level);
      matrixLines.push(line);
    },
    (line) => matrixLines.push(line));

  const schemas = runCheckSchemas(args.tree);
  lines.push(`schemas: checked ${count(schemas.checked, 'file')}, `
    + `${count(schemas.messages.length, 'problem')}`);
  for (const message of schemas.messages) fail(schemas.code, message);
  const broken = new Set(schemas.messages.map((message) => message.slice(0, message.indexOf(':'))));

  // The lint (task-012): spec-001 §18 and F3.5 over the whole tree, compat.yaml included.
  const lint = runCheckPacks(args.tree, { schemaProblems: false });
  if (lint.code === 2) {
    fail(2, lint.lines[0] ?? 'lint: I/O error');
  } else {
    lines.push(lint.lines[0] ?? '');
    for (const line of lint.lines.slice(1)) fail(1, line);
  }
  const linted = new Set(lint.problems.map((problem) => problem.file));

  // The index (task-019, spec-002 §3.1): the committed outputs are what npm run index writes.
  if (broken.size > 0) {
    lines.push('index: skipped, the schema check reports problems');
  } else if (lint.problems.some((problem) => problem.rule === 'parse')) {
    lines.push('index: skipped, the lint reports files that do not parse');
  } else {
    const index = runIndex(['--tree', args.tree, '--check']);
    if (index.code === 2) {
      fail(2, index.lines[0] ?? 'index: I/O error');
    } else {
      // An input the index refuses is reported on its summary line alone.
      if (index.code === 1 && index.lines.length === 1) fail(1, index.lines[0] ?? '');
      else lines.push(index.lines[0] ?? '');
      for (const line of index.lines.slice(1)) fail(1, line);
    }
  }

  // The overlay's own checks (task-046), after the tree's: its files, which the tree's do not see.
  let overlayCheck: OverlayCheck | undefined;
  if (overlay !== undefined) {
    try {
      overlayCheck = checkOverlay(args.tree, overlay);
      // The count is of these checks' problems; `overlay: no composition` and an unreached pack
      // (after the compositions) are reported on their own lines.
      lines.push(`overlay: checked ${count(overlayCheck.checked, 'file')}, `
        + `${count(overlayCheck.problems.length, 'problem')}`);
      for (const problem of overlayCheck.problems) fail(1, formatProblem(problem));
      if (overlayCheck.files.length === 0) fail(1, 'overlay: no composition');
    } catch (error) {
      fail(2, `overlay: ${messageOf(error)}`);
    }
  }

  // Loaded for the matrix; a compat.yaml the loader refuses is the lint's to report.
  let compat: Compat | undefined;
  const compatPath = join(args.tree, 'compat.yaml');
  if (existsSync(compatPath) && !broken.has('compat.yaml')) {
    try {
      compat = loadCompat(compatPath);
    } catch (error) {
      if (!(error instanceof CompatError) && !(error instanceof YamlError
        && error.reason === 'syntax')) fail(2, `compat.yaml: ${messageOf(error)}`);
    }
  }

  const compositions: Composition[] = [];
  // A composition whose packs could not be read leaves its --param names unjudged.
  let unjudged = broken.size > 0;
  for (const { file } of findFiles(args.tree).filter((found) => found.kind === 'preset')) {
    if (broken.has(file)) continue;
    // A preset the lint rejects (its values' YAML types among others) is not composed.
    if (linted.has(file)) {
      unjudged = true;
      compositions.push({ label: file, entries: [], preset: {}, skip: true });
      continue;
    }
    try {
      compositions.push(presetComposition(args.tree, file));
    } catch (error) {
      unjudged = true;
      fail(error instanceof YamlError && error.reason !== 'syntax' ? 2 : 1, messageOf(error));
    }
  }
  // The examples (task-022, spec-002 §2.4), composed as presets are, after them. One is skipped
  // when the lint reports it, its directory or an ancestor under tests/fixtures/examples/, or when
  // its pack is skipped by the lint (its pack.yaml fails its schema).
  const brokenNames = new Set([...broken].flatMap((file) => {
    const match = /^packs\/(?:.+\/)?([^/]+)\/pack\.yaml$/.exec(file);
    return match === null ? [] : [match[1] ?? ''];
  }));
  const reported = (file: string): boolean => {
    const dir = file.slice(0, file.lastIndexOf('/'));
    const packDir = dir.slice(0, dir.lastIndexOf('/'));
    return brokenNames.has(packDir.slice(packDir.lastIndexOf('/') + 1))
      || lint.problems.some((problem) => problem.file === file || problem.file === dir
        || problem.file === packDir || problem.file.startsWith(`${dir}/`));
  };
  for (const file of exampleFiles(args.tree)) {
    if (reported(file)) {
      unjudged = true;
      compositions.push({ label: file, entries: [], preset: {}, skip: true });
      continue;
    }
    try {
      compositions.push(presetComposition(args.tree, file));
    } catch (error) {
      unjudged = true;
      fail(error instanceof YamlError && error.reason !== 'syntax' ? 2 : 1, messageOf(error));
    }
  }
  if (args.entries.length > 0) {
    compositions.push({ label: 'entries', entries: args.entries, preset: {},
      overlay: overlay !== undefined });
  }
  // The overlay's compositions (task-046), after the tree's, in the byte order of their ids.
  if (overlayCheck !== undefined) {
    const check = overlayCheck;
    const reportedHere = (file: string): boolean => {
      const dir = file.slice(0, file.lastIndexOf('/'));
      return check.shadowed || check.problems.some((problem) => problem.file === file
        || problem.file === dir || problem.file.startsWith(`${dir}/`));
    };
    for (const file of check.files) {
      if (reportedHere(file)) {
        unjudged = true;
        compositions.push({ label: file, entries: [], preset: {}, skip: true, overlay: true,
          skipReason: 'the overlay\'s checks report it' });
        continue;
      }
      try {
        compositions.push({ ...presetComposition(args.tree, file), overlay: true, reaches: true });
      } catch (error) {
        unjudged = true;
        fail(error instanceof YamlError && error.reason !== 'syntax' ? 2 : 1, messageOf(error));
      }
    }
  }

  const used = new Set<string>();
  let catalog: Catalog | undefined;
  const active = compositions.filter((composition) => composition.skip !== true);
  if (active.length > 0 && !existsSync(compatPath)) {
    fail(1, 'compat.yaml: missing, so the matrix cannot select a release');
  }
  if (active.length > 0) {
    try {
      catalog = loadCatalog(join(args.tree, 'catalog.yaml'));
    } catch (error) {
      const invalid = error instanceof CatalogError
        || (error instanceof YamlError && error.reason === 'syntax');
      fail(invalid ? 1 : 2, `catalog.yaml: ${messageOf(error)}`);
      unjudged = true;
    }
  }
  let composed = 0;
  /** The pack paths the overlay's compositions resolved (task-046). */
  const reached = new Set<string>();
  const treeOf = (composition: Composition): string =>
    composition.overlay === true && overlay !== undefined ? overlay.merged : args.tree;
  const mapped = (composition: Composition, text: string): string =>
    composition.overlay === true && overlay !== undefined
      ? mapOverlayPaths(text, args.tree, overlay) : text;
  // plan-039 R6: the packs with a conditional part, and whether a composition with software ran.
  const parted = new Map<string, boolean>();
  /** Composes one composition twice and runs the matrix; its packs when they resolved. */
  const runOne = (composition: Composition): { packs?: ResolvedPack[]; ran: boolean } => {
    const label = `composition ${composition.label}`;
    const skipped = (): void => { matrixLines.push(`matrix ${composition.label}: skipped`); };
    if (composition.skip === true) {
      lines.push(`${label}: skipped, ${composition.skipReason ?? 'the lint reports it'}`);
      skipped();
      return { ran: false };
    }
    if (catalog === undefined) return { ran: false };
    let params: Record<string, string>;
    let requirements: VersionRequirements[];
    let packs: ResolvedPack[];
    try {
      const resolved = packsOf(treeOf(composition), catalog, composition.entries);
      packs = resolved.packs;
      if (composition.reaches === true) for (const pack of packs) reached.add(pack.path);
      requirements = resolved.requirements;
      params = { ...composition.preset };
      for (const [name, value] of args.params) {
        if (!resolved.declared.has(name)) continue;
        used.add(name);
        if (Object.hasOwn(composition.preset, name)) {
          throw new ResolveError(`--param ${name} overrides the value the preset sets`);
        }
        params[name] = value;
      }
    } catch (error) {
      unjudged = true;
      fail(1, `${label}: ${mapped(composition, messageOf(error))}`);
      skipped();
      return { ran: false };
    }
    // The matrix runs inside the determinism check, on its first output.
    let ran = false;
    const result = composeTwice({ tree: treeOf(composition), entries: composition.entries,
      params }, {
      ...options,
      use: (output) => {
        if (compat === undefined) return;
        ran = true;
        matrix.run(composition.label, output, compat, requirements);
      },
    });
    if (result.code !== 0) {
      fail(result.code, `${label}: ${mapped(composition, result.message)}`);
      skipped();
      return { packs, ran: false };
    }
    composed += 1;
    const dropped = composition.dropped === undefined || composition.dropped.length === 0 ? ''
      : `, dropped ${composition.dropped.join(', ')}`;
    lines.push(`${label}: composed twice, ${count(result.files, 'file')}, ${result.message}`
      + dropped);
    if (!ran) skipped();
    return { packs, ran };
  };
  for (const composition of compositions) {
    const { packs, ran } = runOne(composition);
    if (packs === undefined || catalog === undefined) continue;
    const software = softwarePack(catalog);
    const holdsSoftware = (resolved: ResolvedPack[]): boolean =>
      resolved.some((pack) => pack.id === software);
    const record = (resolved: ResolvedPack[] | undefined, ran: boolean): void => {
      for (const pack of resolved ?? []) {
        if (pack.manifest.conditional === undefined) continue;
        parted.set(pack.id, (parted.get(pack.id) ?? false)
          || (ran && holdsSoftware(resolved ?? [])));
      }
    };
    record(packs, ran);
    if (!packs.some((pack) => pack.manifest.conditional !== undefined)) continue;
    // The other leg (spec-001 §15, plan-039 R2): with software added, or without it.
    if (!holdsSoftware(packs)) {
      const label = `${composition.label}[+software]`;
      if (!packs.some((pack) => pack.manifest.axis === 'methodology')) {
        matrixLines.push(`matrix ${label}: skipped, no methodology`);
        continue;
      }
      const leg = runOne({ ...composition, label, entries: [...composition.entries, software] });
      record(leg.packs, leg.ran);
      continue;
    }
    const entries = composition.entries.filter((entry) =>
      entry !== software && !entry.startsWith(`${software}@`));
    const label = `${composition.label}[-software]`;
    let without: ResolvedPack[];
    try {
      without = resolve(treeOf(composition), catalog, entries);
    } catch (error) {
      fail(1, `composition ${label}: ${mapped(composition, messageOf(error))}`);
      matrixLines.push(`matrix ${label}: skipped`);
      continue;
    }
    // A pack requires software unconditionally: this composition has no leg without it.
    if (holdsSoftware(without)) continue;
    // plan-039 R5: the values a preset sets for parameters of absent packs are dropped.
    const declared = new Set(without.flatMap((pack) =>
      Object.keys(pack.manifest.parameters ?? {})));
    const dropped = Object.keys(composition.preset).filter((name) => !declared.has(name)).sort();
    const preset = Object.fromEntries(Object.entries(composition.preset)
      .filter(([name]) => declared.has(name)));
    const leg = runOne({ label, entries, preset, dropped,
      ...composition.overlay === true ? { overlay: true } : {},
      ...composition.reaches === true ? { reaches: true } : {} });
    record(leg.packs, leg.ran);
  }
  if (mode === 'publication') {
    for (const [id, ran] of [...parted].sort(([a], [b]) => byBytes(a, b))) {
      if (!ran) {
        fail(1, `matrix: ${id} has a conditional part and no composition with software that ran `
          + '(plan-039 R6)');
      }
    }
  }
  if (overlay !== undefined && overlayCheck !== undefined) {
    for (const pack of overlay.packs) {
      if (reached.has(`packs/${pack}`)) continue;
      fail(1, formatProblem({ file: `${overlay.rel}/packs/${pack}`, rule: 'overlay-unreached',
        message: 'no overlay composition reaches it (plan-046 ruling 1)' }));
    }
  }
  for (const name of unjudged ? [] : args.params.keys()) {
    if (!used.has(name)) fail(1, `--param ${name}: no composition declares it`);
  }
  lines.push(`compositions: ${composed}`);
  lines.push(...matrixLines);
  if (mode === 'publication' && composed === 0) {
    fail(1, 'matrix: publication mode with no composition: a publication run that runs nothing '
      + 'is not a pass');
  }
  lines.push(matrix.summary());
  return { code, lines, mode, tolerated: [...matrix.tolerated] };
}
