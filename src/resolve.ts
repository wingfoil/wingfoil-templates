// Pack resolution, the composer's first stage (spec-001 §17 steps 1, 3 and 4): find the requested
// packs and everything they require, check ranges, conflicts, cardinalities, slots and
// inventories, and put the packs in composition order (§7.1). Packs are read from a directory
// tree, one version per pack, at packs/<catalog pack id>/.
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { AxisSpec, Catalog } from './catalog';
import { isCatalogPackId } from './digest';
import { packLayoutProblems } from './layout-rules';
import {
  formatKindsProblems, inventoryProblems, manifestProblems, slotProblems,
} from './pack-rules';
import type { Problem } from './problems';
import { parseEntry, satisfies } from './requirements';
import { repositorySchemas } from './schemas';
import type { SchemaSet } from './schemas';
import { YamlError, loadYamlFile } from './yaml-load';
import type { LoadedYaml } from './yaml-load';

export { listedFiles } from './pack-rules';

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

/** The composer refuses what the lint rejects (spec-001 §17, §18): the first problem, as an error. */
function throwFirst(problems: Problem[]): void {
  const [first] = problems;
  if (first !== undefined) throw new ResolveError(first.message);
}

/**
 * Symbolic links and the rest of the layout of spec-001 §6.1 are the lint's (task-012, over the
 * whole tree); here a pack is whatever packs/<id>/pack.yaml leads to.
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
  const manifest = loaded.data as PackManifest;
  const pack: ResolvedPack = { id, version: manifest.version, path, manifest, requiredIds: [],
    source: loaded };
  throwFirst(manifestProblems(pack));
  return pack;
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
    for (const entry of pack.manifest.requires ?? []) {
      // manifestProblems has refused a pack requiring itself or one id twice.
      const required = attempt(() => parseEntry(entry, 'requires'));
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
  for (const pack of byId) throwFirst(slotProblems(catalog, pack));
  for (const pack of byId) {
    throwFirst(inventoryProblems(tree, pack));
    throwFirst(formatKindsProblems(pack));
    throwFirst(packLayoutProblems(tree, pack));
  }
  return order(catalog, packs);
}
