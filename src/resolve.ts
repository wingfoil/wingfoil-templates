// Pack resolution, the composer's first stage (spec-001 §17 steps 1, 3 and 4): find the requested
// packs and everything they require, check ranges, conflicts, cardinalities, slots and
// inventories, and put the packs in composition order (§7.1). Packs are read from a directory
// tree, one version per pack, at packs/<catalog pack id>/.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { AxisSpec, Catalog } from './catalog';
import { isCatalogPackId } from './digest';
import { listSorted } from './listing';
import { parseEntry, satisfies } from './requirements';
import { repositorySchemas } from './schemas';
import type { SchemaSet } from './schemas';
import { YamlError, loadYamlFile } from './yaml-load';
import type { LoadedYaml } from './yaml-load';

/** A composition cannot be resolved; the message names the packs involved. */
export class ResolveError extends Error {}

export interface PackContents {
  fragments?: string[];
  directives?: string[];
  workflows?: string[];
  memory_templates?: string[];
  agents_section?: boolean;
}

/** A parameter declaration (spec-001 §8.1). */
export interface ParameterDeclaration {
  type: 'string' | 'integer' | 'boolean' | 'path' | 'pattern';
  default?: unknown;
  description: string;
}

/** The fields of pack.yaml the composer reads (spec-001 §6.2); the schema has checked them. */
export interface PackManifest {
  id: string;
  axis?: string;
  name: string;
  slot?: string;
  version: string;
  formats: Record<string, number>;
  /** What the compatibility matrix needs a release to provide (spec-001 §12). */
  requires_capabilities?: string[];
  requires?: string[];
  conflicts?: string[];
  parameters?: Record<string, ParameterDeclaration>;
  contents: PackContents;
}

export interface ResolvedPack {
  id: string;
  version: string;
  /** The pack directory, relative to the tree. */
  path: string;
  manifest: PackManifest;
  /** The ids of `requires`, parsed once (spec-001 §6.3). */
  requiredIds: string[];
  /** pack.yaml as loaded, with the source text of each value (spec-001 §18). */
  source: LoadedYaml;
}

/** Workflows only base may ship (spec-001 §9). */
const BASE_ONLY_WORKFLOWS = ['sw-life-cycle', 'retrospective'];
const FRAGMENT_ORDER = ['dna', 'roles', 'memory'];

interface Constraint {
  id: string;
  range: string;
  /** `the request`, or the id of the pack that requires it. */
  from: string;
}

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function attempt<T>(fn: () => T): T {
  try {
    return fn();
  } catch (error) {
    if (error instanceof ResolveError) throw error;
    throw new ResolveError(error instanceof Error ? error.message : String(error));
  }
}

/**
 * Symbolic links and the rest of the layout of spec-001 §6.1 are the lint's (task 9); here a pack
 * is whatever packs/<id>/pack.yaml leads to.
 */
function loadPack(tree: string, id: string, schemas: SchemaSet, requiredBy: string): ResolvedPack {
  const path = `packs/${id}`;
  const file = `${path}/pack.yaml`;
  if (!existsSync(join(tree, file))) {
    throw new ResolveError(`${id}: not found at ${file}, ${requiredBy}`);
  }
  let loaded;
  try {
    loaded = loadYamlFile(join(tree, file), file);
  } catch (error) {
    if (error instanceof YamlError) throw new ResolveError(error.message);
    throw error;
  }
  const [schemaError] = schemas.validate('pack', loaded.data);
  if (schemaError !== undefined) {
    const { line, column } = loaded.positionOf(schemaError.instancePath);
    throw new ResolveError(`${file}:${line}:${column}: ${schemaError.instancePath || '/'} `
      + `${schemaError.keyword}: ${schemaError.message}`);
  }
  // The schema already ties axis, slot and name to the id (spec-001 §6.2); the directory is ours.
  const manifest = loaded.data as PackManifest;
  if (manifest.id !== id) {
    throw new ResolveError(`${path}: pack.yaml declares the id ${manifest.id}`);
  }
  return { id, version: manifest.version, path, manifest, requiredIds: [], source: loaded };
}

function parseRequest(request: string[]): Constraint[] {
  return request.map((entry) => attempt(() => {
    if (entry.includes('@')) {
      const parsed = parseEntry(entry, 'requires');
      return { id: parsed.id, range: parsed.range ?? '', from: 'the request' };
    }
    if (!isCatalogPackId(entry)) {
      throw new ResolveError(`${JSON.stringify(entry)} is not a catalog pack id (spec-001 §4)`);
    }
    return { id: entry, range: '', from: 'the request' };
  }));
}

/** Loads the requested packs and, transitively, the packs they require. */
function collect(tree: string, catalog: Catalog, requested: Constraint[], schemas: SchemaSet): {
  packs: Map<string, ResolvedPack>;
  constraints: Constraint[];
} {
  if (!isCatalogPackId(catalog.foundation)) {
    throw new ResolveError(`catalog foundation ${JSON.stringify(catalog.foundation)} is not a `
      + 'catalog pack id');
  }
  const packs = new Map<string, ResolvedPack>();
  const constraints = requested.filter((constraint) => constraint.range !== '');
  const queue: { id: string; requiredBy: string }[] = [
    { id: catalog.foundation, requiredBy: 'the foundation of every composition' },
    ...[...new Set(requested.map((constraint) => constraint.id))].sort(byBytes)
      .map((id) => ({ id, requiredBy: 'requested' })),
  ];
  for (let next = queue.shift(); next !== undefined; next = queue.shift()) {
    if (packs.has(next.id)) continue;
    const pack = loadPack(tree, next.id, schemas, next.requiredBy);
    packs.set(pack.id, pack);
    const seen = new Set<string>();
    for (const entry of pack.manifest.requires ?? []) {
      const required = attempt(() => parseEntry(entry, 'requires'));
      if (required.id === pack.id) throw new ResolveError(`${pack.id} requires itself`);
      if (seen.has(required.id)) {
        throw new ResolveError(`${pack.id} requires ${required.id} twice`);
      }
      seen.add(required.id);
      pack.requiredIds.push(required.id);
      constraints.push({ id: required.id, range: required.range ?? '', from: pack.id });
      queue.push({ id: required.id, requiredBy: `required by ${pack.id}` });
    }
  }
  return { packs, constraints };
}

function checkRanges(packs: Map<string, ResolvedPack>, constraints: Constraint[]): void {
  // Sorted, so that the error reported does not depend on the order of the request.
  const sorted = [...constraints].sort((a, b) =>
    byBytes(a.id, b.id) || byBytes(a.from, b.from) || byBytes(a.range, b.range));
  for (const constraint of sorted) {
    const pack = packs.get(constraint.id);
    if (pack !== undefined && !satisfies(pack.version, constraint.range)) {
      throw new ResolveError(`${pack.id} ${pack.version} does not satisfy ${constraint.range}, `
        + `asked by ${constraint.from}`);
    }
  }
}

function checkConflicts(ordered: ResolvedPack[], packs: Map<string, ResolvedPack>): void {
  for (const pack of ordered) {
    for (const entry of pack.manifest.conflicts ?? []) {
      const conflict = attempt(() => parseEntry(entry, 'conflicts'));
      const other = packs.get(conflict.id);
      if (other !== undefined
        && (conflict.range === undefined || satisfies(other.version, conflict.range))) {
        throw new ResolveError(`${pack.id} conflicts with ${entry}, present at ${other.version}`);
      }
    }
  }
}

function membersOf(axis: AxisSpec, ordered: ResolvedPack[]): ResolvedPack[] {
  return ordered.filter((pack) => pack.manifest.axis === axis.name);
}

function checkAxes(catalog: Catalog, ordered: ResolvedPack[]): void {
  const known = new Set(catalog.axes.map((axis) => axis.name));
  for (const pack of ordered) {
    if (pack.id !== catalog.foundation && !known.has(pack.manifest.axis ?? '')) {
      const axis = String(pack.manifest.axis);
      throw new ResolveError(`${pack.id}: axis ${axis} is not in the catalog`);
    }
  }
  for (const axis of catalog.axes) {
    const members = membersOf(axis, ordered);
    const names = (packs: ResolvedPack[]): string => packs.map((pack) => pack.id).join(', ');
    if (axis.required && members.length === 0) {
      throw new ResolveError(`axis ${axis.name} is required, and no pack of it is given`);
    }
    if (axis.cardinality === 'one' && members.length > 1) {
      throw new ResolveError(`axis ${axis.name} takes one pack: ${names(members)}`);
    }
    if (axis.cardinality === 'one-per-slot') {
      const slots = axis.slots ?? [];
      const unknown = members.find((pack) => !slots.includes(pack.manifest.slot ?? ''));
      if (unknown !== undefined) {
        throw new ResolveError(`${unknown.id}: slot ${String(unknown.manifest.slot)} is not a slot `
          + `of axis ${axis.name}`);
      }
      for (const slot of axis.slots ?? []) {
        const filling = members.filter((pack) => pack.manifest.slot === slot);
        if (filling.length > 1) {
          throw new ResolveError(`slot ${slot} takes one pack: ${names(filling)}`);
        }
      }
    }
  }
}

function workflowsOf(pack: ResolvedPack): string[] {
  return pack.manifest.contents.workflows ?? [];
}

/** The slots of spec-001 §9, read from the catalog. */
function checkSlots(catalog: Catalog, ordered: ResolvedPack[]): void {
  for (const slot of catalog.slots) {
    const axis = catalog.axes.find((candidate) => candidate.name === slot.filledBy);
    const fillers = ordered.filter((pack) => pack.manifest.axis === slot.filledBy
      && (axis?.slots === undefined || pack.manifest.slot === slot.name));
    for (const filler of fillers) {
      if (!workflowsOf(filler).includes(slot.name)) {
        throw new ResolveError(`${filler.id}: fills slot ${slot.name} but ships no `
          + `workflows/${slot.name}.yaml`);
      }
    }
    for (const pack of ordered) {
      if (workflowsOf(pack).includes(slot.name) && !fillers.includes(pack)
        && pack.id !== slot.default) {
        throw new ResolveError(`${pack.id}: ships workflow ${slot.name} but does not fill `
          + `slot ${slot.name}`);
      }
    }
  }
  for (const pack of ordered) {
    if (pack.id === catalog.foundation) continue;
    const reserved = workflowsOf(pack).find((name) => BASE_ONLY_WORKFLOWS.includes(name));
    if (reserved !== undefined) {
      throw new ResolveError(`${pack.id}: ships ${reserved}, which only ${catalog.foundation} `
        + 'may ship (spec-001 §9)');
    }
  }
}

/** Files under a pack directory's inventory folders, relative to the pack; no subdirectory. */
function presentFiles(tree: string, pack: ResolvedPack): string[] {
  const dir = join(tree, pack.path);
  const files: string[] = [];
  for (const folder of ['fragments', 'directives', 'workflows', 'memory-templates', 'agents']) {
    for (const entry of listSorted(join(dir, folder))) {
      if (entry.isDirectory) {
        throw new ResolveError(`${pack.id}: ${folder}/${entry.name} is a directory; `
          + `${folder}/ holds files only (spec-001 §6.1)`);
      }
      files.push(`${folder}/${entry.name}`);
    }
  }
  return files;
}

/** The files a pack's inventory lists, relative to the pack (spec-001 §6.4). */
export function listedFiles(contents: PackContents): string[] {
  return [
    ...(contents.fragments ?? []).map((name) => `fragments/${name}.yaml`),
    ...(contents.directives ?? []).map((name) => `directives/${name}.md`),
    ...(contents.workflows ?? []).map((name) => `workflows/${name}.yaml`),
    ...(contents.memory_templates ?? []).map((name) => `memory-templates/${name}.md`),
    ...(contents.agents_section === true ? ['agents/section.md'] : []),
  ];
}

/** spec-001 §6.4: every listed file exists, every file present is listed. */
function checkInventory(tree: string, pack: ResolvedPack): void {
  const fragments = pack.manifest.contents.fragments ?? [];
  const positions = fragments.map((name) => FRAGMENT_ORDER.indexOf(name));
  if (positions.some((position, index) => index > 0 && position < (positions[index - 1] ?? -1))) {
    throw new ResolveError(`${pack.id}: contents.fragments must keep the order `
      + `${FRAGMENT_ORDER.join(', ')}`);
  }
  const listed = listedFiles(pack.manifest.contents);
  const present = presentFiles(tree, pack);
  const missing = listed.filter((file) => !present.includes(file)).sort(byBytes)[0];
  if (missing !== undefined) {
    throw new ResolveError(`${pack.id}: ${missing} is listed in contents but missing`);
  }
  const unlisted = present.filter((file) => !listed.includes(file))[0];
  if (unlisted !== undefined) {
    throw new ResolveError(`${pack.id}: ${unlisted} is present but not listed in contents`);
  }
}

/** Kahn's algorithm on the requires inside one axis; ties in byte order of the id (§7.1). */
function kahn(members: ResolvedPack[]): ResolvedPack[] {
  const inAxis = new Set(members.map((pack) => pack.id));
  const dependencies = new Map(members.map((pack) => [pack.id, new Set(
    pack.requiredIds.filter((id) => inAxis.has(id)),
  )]));
  const placed: ResolvedPack[] = [];
  let remaining = [...members].sort((a, b) => byBytes(a.id, b.id));
  while (remaining.length > 0) {
    const next = remaining.find((pack) =>
      [...(dependencies.get(pack.id) ?? [])].every((id) => placed.some((done) => done.id === id)));
    if (next === undefined) {
      throw new ResolveError(`requires cycle among ${remaining.map((pack) => pack.id).join(', ')}`);
    }
    placed.push(next);
    remaining = remaining.filter((pack) => pack !== next);
  }
  return placed;
}

/** spec-001 §7.1: base, then each catalog axis in order. */
function order(catalog: Catalog, packs: Map<string, ResolvedPack>): ResolvedPack[] {
  const all = [...packs.values()].sort((a, b) => byBytes(a.id, b.id));
  const foundation = packs.get(catalog.foundation);
  const ordered: ResolvedPack[] = foundation === undefined ? [] : [foundation];
  for (const axis of catalog.axes) {
    const members = membersOf(axis, all);
    if (axis.cardinality === 'many') {
      ordered.push(...kahn(members));
    } else {
      const slots = axis.slots ?? [];
      ordered.push(...[...members].sort((a, b) =>
        slots.indexOf(a.manifest.slot ?? '') - slots.indexOf(b.manifest.slot ?? '')
        || byBytes(a.id, b.id)));
    }
  }
  const position = new Map(ordered.map((pack, index) => [pack.id, index]));
  for (const pack of ordered) {
    for (const required of pack.requiredIds) {
      if ((position.get(required) ?? -1) > (position.get(pack.id) ?? -1)) {
        throw new ResolveError(`${pack.id} requires ${required}, which comes later in the `
          + 'composition order (spec-001 §7.1)');
      }
    }
  }
  return ordered;
}

/**
 * The packs of a composition in composition order. `request` holds catalog pack ids or §6.3
 * entries; the foundation is added, and so is every pack required, transitively.
 */
export function resolve(tree: string, catalog: Catalog, request: string[]): ResolvedPack[] {
  const schemas = repositorySchemas();
  const { packs, constraints } = collect(tree, catalog, parseRequest(request), schemas);
  checkRanges(packs, constraints);
  const byId = [...packs.values()].sort((a, b) => byBytes(a.id, b.id));
  checkConflicts(byId, packs);
  checkAxes(catalog, byId);
  checkSlots(catalog, byId);
  for (const pack of byId) checkInventory(tree, pack);
  return order(catalog, packs);
}
