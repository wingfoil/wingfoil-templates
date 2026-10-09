// `npm run validate`: the one validation command (F3.1). In one pass: the schema checks of the
// tree's files, then every preset and the given entries, each composed twice and compared (F3.4),
// then run through the compatibility matrix (F3.3, task-011) in the mode the caller fixes. The
// report lines are stable: the release evidence of plan-015 task 11 reads them.
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { CatalogError, loadCatalog } from './catalog';
import type { Catalog } from './catalog';
import { findFiles, runCheckSchemas } from './check-schemas';
import { CompatError, loadCompat } from './compat';
import type { Compat } from './compat';
import { composeTwice, type DeterminismOptions } from './determinism';
import {
  DEFAULT_CACHE, MATRIX_PINS, MatrixIoError, installRelease, runRelease, selectReleases,
} from './matrix';
import type { MatrixMode } from './matrix';
import type { VersionRequirements } from './range';
import { ResolveError, resolve } from './resolve';
import { YamlError, loadYamlFile } from './yaml-load';

export interface ValidateOptions extends Omit<DeterminismOptions, 'use'> {
  /** Fixed by the entry point, never by argv or the data (dl-009); self-test by default. */
  mode?: MatrixMode;
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
  /** `presets/<id>.yaml`, or `entries`. */
  label: string;
  entries: string[];
  /** Values the preset sets, as text. */
  preset: Record<string, string>;
}

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
}

function parse(argv: string[]): Args {
  try {
    const { values, positionals } = parseArgs({
      args: argv,
      options: {
        tree: { type: 'string' },
        param: { type: 'string', multiple: true },
        cache: { type: 'string' },
      },
      allowPositionals: true,
      strict: true,
    });
    return { tree: values.tree ?? process.cwd(), params: parseParams(values.param ?? []),
      entries: positionals, cache: values.cache ?? DEFAULT_CACHE };
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
{ declared: Set<string>; requirements: VersionRequirements[] } {
  const packs = resolve(tree, catalog, entries);
  return {
    declared: new Set(packs.flatMap((pack) => Object.keys(pack.manifest.parameters ?? {}))),
    requirements: packs.map((pack) => ({
      formats: pack.manifest.formats,
      requires_capabilities: pack.manifest.requires_capabilities ?? [],
    })),
  };
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

export function runValidate(argv: string[], options: ValidateOptions = {}): ValidateResult {
  const mode = options.mode ?? 'self-test';
  const lines: string[] = [];
  let code = 0;
  const fail = (level: number, line: string): void => {
    code = Math.max(code, level);
    lines.push(line);
  };
  let args: Args;
  try {
    args = parse(argv);
  } catch (error) {
    return { code: 3, lines: [messageOf(error)], mode, tolerated: [] };
  }
  if (!existsSync(args.tree) || !statSync(args.tree).isDirectory()) {
    return { code: 2, lines: [`${args.tree}: not a directory`], mode, tolerated: [] };
  }
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

  // compat.yaml, when present, is checked beyond its schema even with no composition to run.
  let compat: Compat | undefined;
  const compatPath = join(args.tree, 'compat.yaml');
  if (existsSync(compatPath) && !broken.has('compat.yaml')) {
    try {
      compat = loadCompat(compatPath);
    } catch (error) {
      const invalid = error instanceof CompatError
        || (error instanceof YamlError && error.reason === 'syntax');
      fail(invalid ? 1 : 2, `compat.yaml: ${messageOf(error)}`);
    }
  }

  const compositions: Composition[] = [];
  // A composition whose packs could not be read leaves its --param names unjudged.
  let unjudged = broken.size > 0;
  for (const { file } of findFiles(args.tree).filter((found) => found.kind === 'preset')) {
    if (broken.has(file)) continue;
    try {
      compositions.push(presetComposition(args.tree, file));
    } catch (error) {
      unjudged = true;
      fail(error instanceof YamlError && error.reason !== 'syntax' ? 2 : 1, messageOf(error));
    }
  }
  if (args.entries.length > 0) {
    compositions.push({ label: 'entries', entries: args.entries, preset: {} });
  }

  const used = new Set<string>();
  let catalog: Catalog | undefined;
  if (compositions.length > 0 && !existsSync(compatPath)) {
    fail(1, 'compat.yaml: missing, so the matrix cannot select a release');
  }
  if (compositions.length > 0) {
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
  for (const composition of catalog === undefined ? [] : compositions) {
    const label = `composition ${composition.label}`;
    const skipped = (): void => { matrixLines.push(`matrix ${composition.label}: skipped`); };
    let params: Record<string, string>;
    let requirements: VersionRequirements[];
    try {
      const { declared, requirements: needs } = packsOf(args.tree, catalog as Catalog,
        composition.entries);
      requirements = needs;
      params = { ...composition.preset };
      for (const [name, value] of args.params) {
        if (!declared.has(name)) continue;
        used.add(name);
        if (Object.hasOwn(composition.preset, name)) {
          throw new ResolveError(`--param ${name} overrides the value the preset sets`);
        }
        params[name] = value;
      }
    } catch (error) {
      unjudged = true;
      fail(1, `${label}: ${messageOf(error)}`);
      skipped();
      continue;
    }
    // The matrix runs inside the determinism check, on its first output.
    let ran = false;
    const result = composeTwice({ tree: args.tree, entries: composition.entries, params }, {
      ...options,
      use: (output) => {
        if (compat === undefined) return;
        ran = true;
        matrix.run(composition.label, output, compat, requirements);
      },
    });
    if (result.code !== 0) {
      fail(result.code, `${label}: ${result.message}`);
      skipped();
      continue;
    }
    composed += 1;
    lines.push(`${label}: composed twice, ${count(result.files, 'file')}, ${result.message}`);
    if (!ran) skipped();
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
