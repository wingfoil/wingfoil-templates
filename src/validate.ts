// `npm run validate`: the one validation command (F3.1). In one pass: the schema checks of the
// tree's files, then every preset and the given entries, each composed twice and compared (F3.4).
// The compatibility matrix joins it in plan-015 task 8. The report lines are stable: the release
// evidence of task 11 reads them.
import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { CatalogError, loadCatalog } from './catalog';
import type { Catalog } from './catalog';
import { findFiles, runCheckSchemas } from './check-schemas';
import { composeTwice, type DeterminismOptions } from './determinism';
import { ResolveError, resolve } from './resolve';
import { YamlError, loadYamlFile } from './yaml-load';

/** Replace the comparison or the compose command, so that tests can show a mismatch. */
export type ValidateOptions = DeterminismOptions;

export interface ValidateResult {
  code: number;
  lines: string[];
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

function parse(argv: string[]): { tree: string; params: Map<string, string>; entries: string[] } {
  try {
    const { values, positionals } = parseArgs({
      args: argv,
      options: { tree: { type: 'string' }, param: { type: 'string', multiple: true } },
      allowPositionals: true,
      strict: true,
    });
    return { tree: values.tree ?? process.cwd(), params: parseParams(values.param ?? []),
      entries: positionals };
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

/** The parameters a composition's packs declare. */
function declaredBy(tree: string, catalog: Catalog, entries: string[]): Set<string> {
  return new Set(resolve(tree, catalog, entries)
    .flatMap((pack) => Object.keys(pack.manifest.parameters ?? {})));
}

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? '' : 's'}`;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export function runValidate(argv: string[], options: ValidateOptions = {}): ValidateResult {
  const lines: string[] = [];
  let code = 0;
  const fail = (level: number, line: string): void => {
    code = Math.max(code, level);
    lines.push(line);
  };
  let args;
  try {
    args = parse(argv);
  } catch (error) {
    return { code: 3, lines: [messageOf(error)] };
  }
  if (!existsSync(args.tree) || !statSync(args.tree).isDirectory()) {
    return { code: 2, lines: [`${args.tree}: not a directory`] };
  }

  const schemas = runCheckSchemas(args.tree);
  lines.push(`schemas: checked ${count(schemas.checked, 'file')}, `
    + `${count(schemas.messages.length, 'problem')}`);
  for (const message of schemas.messages) fail(schemas.code, message);
  const broken = new Set(schemas.messages.map((message) => message.slice(0, message.indexOf(':'))));

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
    let params: Record<string, string>;
    try {
      const declared = declaredBy(args.tree, catalog as Catalog, composition.entries);
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
      continue;
    }
    const result = composeTwice({ tree: args.tree, entries: composition.entries, params },
      options);
    if (result.code !== 0) {
      fail(result.code, `${label}: ${result.message}`);
      continue;
    }
    composed += 1;
    lines.push(`${label}: composed twice, ${count(result.files, 'file')}, ${result.message}`);
  }
  for (const name of unjudged ? [] : args.params.keys()) {
    if (!used.has(name)) fail(1, `--param ${name}: no composition declares it`);
  }
  lines.push(`compositions: ${composed}`);
  lines.push('matrix: not yet part of validate (plan-015 task 8)');
  return { code, lines };
}
