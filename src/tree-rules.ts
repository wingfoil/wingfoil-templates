// spec-001 §18 beyond the packs (task-012): catalog.yaml (the rules that need no git tag; the
// others are plan-015 task 11's), compat.yaml, presets, transitions, pack names unique across the
// tree and the catalog, and the integer rule over every YAML file.
import { existsSync, lstatSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gt, valid } from 'semver';

import type { LintContext } from './check-packs';
import { compatMessages } from './compat';
import type { Compat } from './compat';
import { reachable } from './pack-files';
import type { LintPack } from './pack-files';
import { checkValue } from './parameters';
import type { Problem } from './problems';
import { parseEntry } from './requirements';
import { axesMessages } from './resolve';
import { repositorySchemas } from './schemas';
import type { SchemaKind } from './schemas';
import { YamlError, loadYamlFile } from './yaml-load';
import type { LoadedYaml } from './yaml-load';
import { yamlProblems } from './yaml-rules';

type Doc = Record<string, unknown>;

function isDoc(value: unknown): value is Doc {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function lastSegment(id: string): string {
  return id.slice(id.lastIndexOf('/') + 1);
}

function at(yaml: LoadedYaml, pointer: string, rule: string, message: string): Problem {
  const { line, column } = yaml.positionOf(pointer);
  return { file: yaml.file, line, column, rule, message };
}

/** A YAML file of the tree that loads and passes its schema, or undefined. */
function loadValid(context: LintContext, file: string, kind: SchemaKind): LoadedYaml | undefined {
  if (context.broken.has(file) || !existsSync(join(context.tree, file))) return undefined;
  try {
    const yaml = loadYamlFile(join(context.tree, file), file);
    return repositorySchemas().validate(kind, yaml.data).length === 0 ? yaml : undefined;
  } catch (error) {
    if (error instanceof YamlError && error.reason !== 'io') return undefined;
    throw error;
  }
}

/** The YAML files of a folder (presets/, transitions/), and the entries that are not files. */
function folder(context: LintContext, name: string): { files: string[]; problems: Problem[] } {
  const dir = join(context.tree, name);
  if (!existsSync(dir)) return { files: [], problems: [] };
  if (!lstatSync(dir).isDirectory()) {
    return { files: [], problems: [{ file: name, rule: 'layout',
      message: `${name} must be a directory of YAML files (spec-001 §14, §15)` }] };
  }
  const files: string[] = [];
  const problems: Problem[] = [];
  for (const entry of readdirSync(dir).sort(byBytes)) {
    const file = `${name}/${entry}`;
    const isFile = lstatSync(join(dir, entry)).isFile();
    if (entry.endsWith('.yaml') && isFile) {
      files.push(file);
    } else if (entry.endsWith('.yaml')) {
      problems.push({ file, rule: name === 'presets' ? 'preset-directory' : 'transition-name',
        message: `${file} is not a file; ${name}/ holds one YAML file per entry (spec-001 §15, §14)` });
    } else {
      problems.push({ file, rule: 'layout',
        message: `${file}: ${name}/ holds only <id>.yaml files (spec-001 §14, §15)` });
    }
  }
  return { files, problems };
}

function catalogProblems(context: LintContext, yaml: LoadedYaml): Problem[] {
  const problems: Problem[] = [];
  const raw = yaml.data as Doc;
  const seen = new Set<string>();
  list(raw['packs']).forEach((entry, index) => {
    if (!isDoc(entry)) return;
    const id = String(entry['id']);
    if (entry['path'] !== `packs/${id}`) {
      problems.push(at(yaml, `/packs/${index}/path`, 'catalog-path',
        `packs[${index}] ${id}: path must be packs/${id}`));
    }
    if (seen.has(id)) {
      problems.push(at(yaml, `/packs/${index}/id`, 'catalog-id', `pack id ${id} is listed twice`));
    }
    seen.add(id);
    const versions = list(entry['versions']);
    versions.forEach((version, position) => {
      if (!isDoc(version)) return;
      const pointer = `/packs/${index}/versions/${position}`;
      const previous = versions[position - 1];
      const current = String(version['version']);
      const before = isDoc(previous) ? String(previous['version']) : undefined;
      if (before !== undefined && valid(before) !== null && valid(current) !== null
        && !gt(current, before)) {
        problems.push(at(yaml, `${pointer}/version`, 'catalog-versions',
          `${id}: versions must ascend with no repeat, and ${current} follows ${before}`));
      }
      if (version['transitions'] !== undefined && !id.startsWith('stage/')) {
        problems.push(at(yaml, `${pointer}/transitions`, 'catalog-transitions',
          `${id}@${current}: only a stage pack's version lists transitions (spec-001 §14)`));
      }
    });
  });
  const index = (kind: 'transitions' | 'presets', fields: string[]): void => {
    list(raw[kind]).forEach((entry, position) => {
      if (!isDoc(entry)) return;
      const id = String(entry['id']);
      const pointer = `/${kind}/${position}`;
      const expected = `${kind}/${id}.yaml`;
      if (entry['path'] !== expected) {
        problems.push(at(yaml, `${pointer}/path`, 'catalog-index',
          `${kind}[${position}] ${id}: path must be ${expected}`));
        return;
      }
      const file = loadValid(context, expected, kind === 'presets' ? 'preset' : 'transition');
      if (file === undefined) {
        if (!existsSync(join(context.tree, expected))) {
          problems.push(at(yaml, pointer, 'catalog-index', `${kind}[${position}] ${id}: `
            + `${expected} does not exist`));
        }
        return;
      }
      const data = file.data as Doc;
      for (const field of fields) {
        if (JSON.stringify(data[field]) !== JSON.stringify(entry[field])) {
          problems.push(at(yaml, `${pointer}/${field}`, 'catalog-index', `${kind}[${position}] `
            + `${id}: ${field} differs from ${expected}`));
        }
      }
    });
  };
  index('transitions', ['id', 'from', 'to', 'formats', 'requires_capabilities']);
  index('presets', ['id']);
  return problems;
}

function presetProblems(context: LintContext, yaml: LoadedYaml): Problem[] {
  const problems: Problem[] = [];
  const data = yaml.data as Doc;
  const id = String(data['id']);
  const stem = yaml.file.slice('presets/'.length, -'.yaml'.length);
  if (id !== stem) {
    problems.push(at(yaml, '/id', 'preset-name', `${yaml.file}: id ${id} must equal the file `
      + `name, ${stem}.yaml (spec-001 §15)`));
  }
  if (context.catalog === undefined) return problems;
  const members = new Map<string, LintPack>();
  const add = (pack: LintPack): void => {
    for (const reached of reachable(pack, context.packs)) {
      const found = context.packs.get(reached);
      if (found !== undefined) members.set(found.id, found);
    }
  };
  const foundation = context.packs.get(context.catalog.foundation);
  if (foundation !== undefined) add(foundation);
  list(data['packs']).forEach((entry, index) => {
    let packId: string;
    try {
      packId = parseEntry(String(entry), 'requires').id;
    } catch {
      return;
    }
    const pack = context.packs.get(packId);
    if (pack === undefined) {
      problems.push(at(yaml, `/packs/${index}`, 'preset-cardinality',
        `${yaml.file}: ${packId} is not a pack of the tree`));
    } else {
      add(pack);
    }
  });
  const ordered = [...members.values()].sort((a, b) => byBytes(a.id, b.id));
  for (const message of axesMessages(context.catalog, ordered)) {
    problems.push(at(yaml, '/packs', 'preset-cardinality', `${yaml.file}: ${message}`));
  }
  const declared = new Map(ordered.flatMap((pack) =>
    Object.entries(pack.manifest.parameters ?? {})));
  for (const [name, value] of Object.entries(isDoc(data['parameters']) ? data['parameters'] : {})) {
    const declaration = declared.get(name);
    const problem = declaration === undefined ? 'no pack of the preset declares it'
      : checkValue(declaration.type, value);
    if (problem !== undefined) {
      problems.push(at(yaml, `/parameters/${name}`, 'preset-value',
        `${yaml.file}: parameter ${name}: ${problem}`));
    }
  }
  return problems;
}

function transitionProblems(context: LintContext, yaml: LoadedYaml): Problem[] {
  const problems: Problem[] = [];
  const data = yaml.data as Doc;
  const id = String(data['id']);
  const from = String(data['from']);
  const to = String(data['to']);
  const stem = yaml.file.slice('transitions/'.length, -'.yaml'.length);
  if (id !== stem) {
    problems.push(at(yaml, '/id', 'transition-name', `${yaml.file}: id ${id} must equal the file `
      + `name, ${stem}.yaml (spec-001 §14)`));
  }
  const expected = `${lastSegment(from)}-to-${lastSegment(to)}`;
  if (id !== expected) {
    problems.push(at(yaml, '/id', 'transition-id', `${yaml.file}: id must be ${expected}`));
  }
  // A stage pack of the catalog, published, or of the tree: a transition is published with the
  // first release of its target stage (§14), before that stage is in catalog.yaml (task-014).
  const stages = new Set([
    ...list((context.catalog?.raw['packs'])).filter(isDoc).map((entry) => String(entry['id'])),
    ...context.packs.keys(),
  ].filter((packId) => packId.startsWith('stage/')));
  if (from === to) {
    problems.push(at(yaml, '/to', 'transition-stages', `${yaml.file}: from and to are the same`));
  }
  for (const [field, value] of [['from', from], ['to', to]] as const) {
    if (!stages.has(value)) {
      problems.push(at(yaml, `/${field}`, 'transition-stages',
        `${yaml.file}: ${field} ${value} is not a stage pack of the catalog or of the tree`));
    }
  }
  return problems;
}

function compatProblems(yaml: LoadedYaml): Problem[] {
  return compatMessages(yaml.data as Compat).map(({ release, message }) =>
    at(yaml, `/releases/${release}`, 'compat', message));
}

/** Pack names unique across the packs of the tree and the catalog's packs (dl-004 1(a)). */
function uniqueNames(context: LintContext, catalog: LoadedYaml | undefined): Problem[] {
  const problems: Problem[] = [];
  const owners = new Map<string, string>();
  list(catalog === undefined ? [] : (catalog.data as Doc)['packs']).forEach((entry, index) => {
    if (!isDoc(entry)) return;
    const id = String(entry['id']);
    const owner = owners.get(lastSegment(id));
    if (owner !== undefined && owner !== id && catalog !== undefined) {
      problems.push(at(catalog, `/packs/${index}/id`, 'pack-name-unique', `catalog.yaml: the `
        + `name ${lastSegment(id)} of ${id} is already ${owner}'s (dl-004 1(a))`));
    }
    owners.set(lastSegment(id), owner ?? id);
  });
  for (const pack of [...context.packs.values()].sort((a, b) => byBytes(a.id, b.id))) {
    const owner = owners.get(pack.manifest.name);
    if (owner !== undefined && owner !== pack.id) {
      problems.push(at(pack.source, '/name', 'pack-name-unique', `${pack.id}: the name `
        + `${pack.manifest.name} is already ${owner}'s (dl-004 1(a))`));
    }
    owners.set(pack.manifest.name, owner ?? pack.id);
  }
  return problems;
}

/** The rule group of this module, for check-packs.ts. */
export function treeProblems(context: LintContext): Problem[] {
  const problems: Problem[] = [];
  const catalog = loadValid(context, 'catalog.yaml', 'catalog');
  if (catalog !== undefined) {
    problems.push(...yamlProblems(catalog.file, catalog), ...catalogProblems(context, catalog));
  }
  const compat = loadValid(context, 'compat.yaml', 'compat');
  if (compat !== undefined) problems.push(...yamlProblems(compat.file, compat),
    ...compatProblems(compat));
  for (const [name, kind, rules] of [
    ['presets', 'preset', presetProblems],
    ['transitions', 'transition', transitionProblems],
  ] as const) {
    const found = folder(context, name);
    problems.push(...found.problems);
    for (const file of found.files) {
      const yaml = loadValid(context, file, kind);
      if (yaml !== undefined) problems.push(...yamlProblems(file, yaml), ...rules(context, yaml));
    }
  }
  for (const pack of context.packs.values()) {
    problems.push(...yamlProblems(pack.source.file, pack.source));
    for (const file of context.files.get(pack.id) ?? []) {
      if (file.yaml !== undefined) problems.push(...yamlProblems(file.file, file.yaml,
        file.firstLine));
    }
  }
  problems.push(...uniqueNames(context, catalog));
  return problems;
}
