// The per-pack rules of spec-001 §18 (task-012). The lint applies them to every pack of the tree;
// the resolver applies them to the packs it composes and throws the first problem, with the
// messages it has always given (§17: the composer refuses what the lint rejects).
import { lt, valid } from 'semver';

import { corePack, softwarePack } from './catalog';
import type { Catalog } from './catalog';
import { listSorted } from './listing';
import { parseEntry } from './requirements';
import type { PackContents, PackManifest } from './resolve';
import type { Problem } from './problems';
import type { LoadedYaml } from './yaml-load';

/** What a rule needs of a pack: its directory id, its path under the tree, its manifest. */
export interface PackLike {
  /** The catalog pack id its directory names. */
  id: string;
  /** `packs/<id>`. */
  path: string;
  manifest: PackManifest;
  source: LoadedYaml;
}

/** Workflows only the core foundation pack, base, may ship (spec-001 §9, dl-022 S2). */
export const BASE_ONLY_WORKFLOWS = ['retrospective', 'governance-evolution'];
/** Workflows only the software layer may ship; the slot defaults are its too (§9, dl-022 S3). */
export const SOFTWARE_ONLY_WORKFLOWS = ['sw-life-cycle'];
const FRAGMENT_ORDER = ['dna', 'roles', 'memory'];
export const INVENTORY_FOLDERS = ['fragments', 'directives', 'workflows', 'memory-templates',
  'agents'];

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function at(pack: PackLike, pointer: string, rule: string, message: string): Problem {
  const { line, column } = pack.source.positionOf(pointer);
  return { file: `${pack.path}/pack.yaml`, line, column, rule, message };
}

/** The id of a requires or conflicts entry, or undefined when it does not parse. */
function entryId(entry: string, field: 'requires' | 'conflicts'): string | undefined {
  try {
    return parseEntry(entry, field).id;
  } catch {
    return undefined;
  }
}

/** §4, §6.2, §6.3, §12: what pack.yaml itself must hold beyond its schema. */
export function manifestProblems(pack: PackLike): Problem[] {
  const { manifest } = pack;
  const problems: Problem[] = [];
  if (manifest.id !== pack.id) {
    problems.push(at(pack, '/id', 'pack-id',
      `${pack.path}: pack.yaml declares the id ${manifest.id}`));
  }
  const last = manifest.id.slice(manifest.id.lastIndexOf('/') + 1);
  if (manifest.name !== last) {
    problems.push(at(pack, '/name', 'pack-name',
      `${pack.id}: name ${manifest.name} must equal the last segment of its id, ${last}`));
  }
  if (valid(manifest.version) !== null && lt(manifest.version, '1.0.0')) {
    problems.push(at(pack, '/version', 'pack-version',
      `${pack.id}: version ${manifest.version} must be 1.0.0 or later (spec-001 §4)`));
  }
  const seen = new Set<string>();
  (manifest.requires ?? []).forEach((entry, index) => {
    const id = entryId(entry, 'requires');
    if (id === undefined) return;
    if (id === pack.id) {
      problems.push(at(pack, `/requires/${index}`, 'requires-self', `${pack.id} requires itself`));
    } else if (seen.has(id)) {
      problems.push(at(pack, `/requires/${index}`, 'requires-twice',
        `${pack.id} requires ${id} twice`));
    }
    seen.add(id);
  });
  (manifest.conflicts ?? []).forEach((entry, index) => {
    if (entryId(entry, 'conflicts') === pack.id) {
      problems.push(at(pack, `/conflicts/${index}`, 'conflicts-self',
        `${pack.id} conflicts with itself`));
    }
  });
  const capabilities = manifest.requires_capabilities ?? [];
  if (capabilities.some((name, index) => index > 0
    && byBytes(capabilities[index - 1] ?? '', name) >= 0)) {
    problems.push(at(pack, '/requires_capabilities', 'capabilities-sorted',
      `${pack.id}: requires_capabilities must be sorted and unique`));
  }
  return problems;
}

/** The contents of a pack's conditional part, or an empty one (spec-001 §6.5). */
export function conditionalContents(manifest: PackManifest): PackContents {
  return manifest.conditional?.[0]?.contents ?? {};
}

/** The files of a pack's conditional part, relative to the pack (spec-001 §6.5). */
export function conditionalFiles(manifest: PackManifest): string[] {
  return listedFiles(conditionalContents(manifest));
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

/** spec-001 §6.4: the fragment order; every listed file exists, every file present is listed. */
export function inventoryProblems(tree: string, pack: PackLike): Problem[] {
  const problems: Problem[] = [];
  const fragments = pack.manifest.contents.fragments ?? [];
  const positions = fragments.map((name) => FRAGMENT_ORDER.indexOf(name));
  if (positions.some((position, index) => index > 0 && position < (positions[index - 1] ?? -1))) {
    problems.push(at(pack, '/contents/fragments', 'fragment-order',
      `${pack.id}: contents.fragments must keep the order ${FRAGMENT_ORDER.join(', ')}`));
  }
  const present: string[] = [];
  for (const folder of INVENTORY_FOLDERS) {
    for (const entry of listSorted(`${tree}/${pack.path}/${folder}`)) {
      if (entry.isDirectory) {
        problems.push({ file: `${pack.path}/${folder}/${entry.name}`, rule: 'layout',
          message: `${pack.id}: ${folder}/${entry.name} is a directory; ${folder}/ holds files `
            + 'only (spec-001 §6.1)' });
      } else {
        present.push(`${folder}/${entry.name}`);
      }
    }
  }
  const always = listedFiles(pack.manifest.contents);
  const entry = conditionalFiles(pack.manifest);
  // The two parts together match the files present, each file listed once (§6.4, §6.5).
  for (const twice of always.filter((file) => entry.includes(file))) {
    problems.push(at(pack, '/conditional/0/contents', 'contents',
      `${pack.id}: ${twice} is listed in contents and in the conditional part`));
  }
  const listed = [...always, ...entry];
  for (const missing of listed.filter((file) => !present.includes(file)).sort(byBytes)) {
    problems.push(at(pack, '/contents', 'contents',
      `${pack.id}: ${missing} is listed in contents but missing`));
  }
  for (const unlisted of present.filter((file) => !listed.includes(file))) {
    problems.push({ file: `${pack.path}/${unlisted}`, rule: 'contents',
      message: `${pack.id}: ${unlisted} is present but not listed in contents` });
  }
  return problems;
}

/** spec-001 §9: slot workflows, read from the catalog, and the workflows of each foundation pack. */
export function slotProblems(catalog: Catalog, pack: PackLike, reached?: string[]): Problem[] {
  const problems: Problem[] = [];
  const always = pack.manifest.contents.workflows ?? [];
  const entry = conditionalContents(pack.manifest).workflows ?? [];
  const workflows = [...always, ...entry];
  for (const slot of catalog.slots) {
    const axis = catalog.axes.find((candidate) => candidate.name === slot.filledBy);
    const fills = pack.manifest.axis === slot.filledBy
      && (axis?.slots === undefined || pack.manifest.slot === slot.name);
    if (fills && !workflows.includes(slot.name)) {
      problems.push(at(pack, '/contents', 'slot',
        `${pack.id}: fills slot ${slot.name} but ships no workflows/${slot.name}.yaml`));
    } else if (fills && pack.manifest.axis === 'methodology') {
      // A methodology ships delivery in contents when it requires software, in its conditional
      // part when it does not (spec-001 §6.5, §9; plan-038 ruling 7).
      const requires = requiresSoftware(catalog, pack, reached);
      if (requires && !always.includes(slot.name)) {
        problems.push(at(pack, '/contents', 'slot', `${pack.id}: requires `
          + `${softwarePack(catalog)}, so it ships ${slot.name} in contents (spec-001 §6.5)`));
      } else if (!requires && !entry.includes(slot.name)) {
        problems.push(at(pack, '/contents', 'slot', `${pack.id}: does not require `
          + `${softwarePack(catalog)}, so it ships ${slot.name} in its conditional part `
          + '(spec-001 §6.5)'));
      }
    }
    if (!fills && workflows.includes(slot.name) && pack.id !== slot.default) {
      problems.push(at(pack, '/contents/workflows', 'slot',
        `${pack.id}: ships workflow ${slot.name} but does not fill slot ${slot.name}`));
    }
  }
  const owners: [string, string[], string][] = [
    [corePack(catalog), BASE_ONLY_WORKFLOWS, 'base-only'],
    [softwarePack(catalog), SOFTWARE_ONLY_WORKFLOWS, 'software-only'],
  ];
  for (const [owner, names, rule] of owners) {
    if (pack.id === owner) continue;
    const reserved = workflows.find((name) => names.includes(name));
    if (reserved !== undefined) {
      problems.push(at(pack, '/contents/workflows', rule,
        `${pack.id}: ships ${reserved}, which only ${owner} may ship (spec-001 §9)`));
    }
  }
  return problems;
}

/**
 * spec-001 §3, §6.5, §18: every phase pack requires the software layer; a conditional part is
 * refused until its rules are implemented (plan-039 R1, task-032).
 */
export function foundationProblems(catalog: Catalog, pack: PackLike, reached?: string[]):
Problem[] {
  const problems: Problem[] = [];
  const software = softwarePack(catalog);
  if (pack.manifest.axis === 'phase' && !requiresSoftware(catalog, pack, reached)) {
    problems.push(at(pack, '/requires', 'requires-software',
      `${pack.id}: a phase pack must require ${software} (spec-001 §3)`));
  }
  if (pack.manifest.conditional !== undefined) {
    if (requiresSoftware(catalog, pack, reached)) {
      problems.push(at(pack, '/conditional', 'conditional', `${pack.id}: requires ${software}, `
        + 'so it ships everything in contents and carries no conditional part (spec-001 §6.5)'));
    }
    if (conditionalFiles(pack.manifest).length === 0) {
      problems.push(at(pack, '/conditional/0/contents', 'conditional', `${pack.id}: its `
        + 'conditional part lists no workflow and no directive (plan-039 R7)'));
    }
  }
  return problems;
}

/**
 * Whether a pack requires the software layer: through its own `requires`, or, when the caller
 * gives the ids the pack reaches through `requires`, transitively (spec-001 §3, §6.5).
 */
export function requiresSoftware(catalog: Catalog, pack: PackLike, reached?: string[]): boolean {
  const ids = reached ?? (pack.manifest.requires ?? []).map((entry) => entryId(entry, 'requires'));
  return ids.includes(softwarePack(catalog));
}

/** The file kind of spec-001 §12 of a listed file, or undefined for the agents section. */
export function kindOf(path: string): string | undefined {
  if (path.startsWith('fragments/')) return path.slice('fragments/'.length, -'.yaml'.length);
  if (path.startsWith('workflows/')) return 'workflow';
  if (path.startsWith('directives/')) return 'directive';
  if (path.startsWith('memory-templates/')) return 'memory-template';
  return undefined;
}

/** §5: `formats` lists exactly the kinds the pack ships; a kind it does not ship is a problem. */
export function formatKindsProblems(pack: PackLike): Problem[] {
  const shipped = new Set([...listedFiles(pack.manifest.contents),
    ...conditionalFiles(pack.manifest)].map(kindOf)
    .filter((kind) => kind !== undefined));
  return Object.keys(pack.manifest.formats).filter((kind) => !shipped.has(kind)).sort(byBytes)
    .map((kind) => at(pack, `/formats/${kind}`, 'formats',
      `${pack.id}: formats.${kind} is declared, but the pack ships no ${kind} file (spec-001 §5)`));
}
