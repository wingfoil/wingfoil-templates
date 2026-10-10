// F3.5 on a pack's workflows and fragments (task-012, `pack-authoring`, spec-001 §6.3, §9): no
// empty phase; includes by bare name, of a workflow the pack or a pack it requires ships, or of a
// slot; the life cycle's includes; every role, Memory type and directive id a pack references is
// declared by the pack or by a pack it requires directly. The lint applies them to every pack of
// the tree; the composer, to every pack it composes.
import type { Catalog } from './catalog';
import { BUILTIN_DIRECTIVE_IDS } from './wingfoil-builtins';
import type { Problem } from './problems';
import type { PackManifest } from './resolve';
import type { LoadedYaml } from './yaml-load';

/** A file as both the lint and the composer have it. */
export interface RuleFile {
  /** Relative to the pack. */
  path: string;
  /** Relative to the tree. */
  file: string;
  yaml?: LoadedYaml;
}

export interface RulePack {
  id: string;
  manifest: PackManifest;
  /** The ids its `requires` names. */
  requiredIds: string[];
}

type Doc = Record<string, unknown>;

const BARE_NAME = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
/** Included by every methodology's delivery, besides the slots it includes (spec-001 §9). */
const DELIVERY_ALSO_INCLUDES = ['retrospective'];

function isDoc(value: unknown): value is Doc {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function dataOf(files: RuleFile[], path: string): Doc {
  const data = files.find((file) => file.path === path)?.yaml?.data;
  return isDoc(data) ? data : {};
}

/** What the pack and its direct requires declare: workflows, roles, Memory types, directives. */
function declared(pack: RulePack, packs: Map<string, RulePack>, files: Map<string, RuleFile[]>): {
  workflows: Set<string>; roles: Set<string>; types: Set<string>; directives: Set<string>;
} {
  const sets = { workflows: new Set<string>(), roles: new Set<string>(), types: new Set<string>(),
    directives: new Set<string>() };
  for (const id of [pack.id, ...pack.requiredIds]) {
    const owner = packs.get(id);
    if (owner === undefined) continue;
    const own = files.get(id) ?? [];
    for (const name of owner.manifest.contents.workflows ?? []) sets.workflows.add(name);
    for (const name of owner.manifest.contents.directives ?? []) sets.directives.add(name);
    const team = dataOf(own, 'fragments/dna.yaml')['team'];
    for (const role of list(isDoc(team) ? team['roles'] : undefined)) {
      if (isDoc(role) && typeof role['name'] === 'string') sets.roles.add(role['name']);
    }
    const types = dataOf(own, 'fragments/memory.yaml')['types'];
    for (const name of Object.keys(isDoc(types) ? types : {})) sets.types.add(name);
  }
  return sets;
}

function problemAt(file: RuleFile, pointer: string, rule: string, message: string): Problem {
  const position = file.yaml?.positionOf(pointer) ?? { line: 1, column: 1 };
  return { file: file.file, line: position.line, column: position.column, rule, message };
}

/** Every F3.5 problem of one pack's workflows and roles fragment. */
export function workflowProblems(
  catalog: Catalog | undefined,
  pack: RulePack,
  packs: Map<string, RulePack>,
  files: Map<string, RuleFile[]>,
): Problem[] {
  const problems: Problem[] = [];
  const own = files.get(pack.id) ?? [];
  const known = declared(pack, packs, files);
  const slots = new Set(catalog?.slots.map((slot) => slot.name) ?? []);
  for (const file of own.filter((candidate) => candidate.path.startsWith('workflows/'))) {
    const data = file.yaml?.data;
    if (!isDoc(data)) continue;
    const label = `${pack.id}: ${file.path}`;
    const element = data['element'];
    if (typeof element === 'string' && !known.types.has(element)) {
      problems.push(problemAt(file, '/element', 'memory-type', `${label}: element ${element} is `
        + 'not a Memory type of the pack or of a pack it requires'));
    }
    const includes: string[] = [];
    list(data['phases']).forEach((phase, index) => {
      if (!isDoc(phase)) return;
      const pointer = `/phases/${index}`;
      const name = String(phase['name']);
      if (!['include', 'actions', 'produces'].some((key) => phase[key] !== undefined)) {
        problems.push(problemAt(file, pointer, 'empty-phase', `${label}: phase ${name} declares `
          + 'none of include, actions and produces (pack-authoring, WingFoil benchmark note N1)'));
      }
      const include = phase['include'];
      if (include !== undefined) {
        includes.push(typeof include === 'string' ? include : JSON.stringify(include));
        if (typeof include !== 'string' || !BARE_NAME.test(include)) {
          problems.push(problemAt(file, `${pointer}/include`, 'include', `${label}: phase ${name} `
            + `includes ${JSON.stringify(include)}; a workflow is included by its bare name, never `
            + 'by path (pack-authoring, WingFoil bug-144)'));
        } else if (!known.workflows.has(include) && !slots.has(include)) {
          problems.push(problemAt(file, `${pointer}/include`, 'include', `${label}: phase ${name} `
            + `includes ${include}, which neither the pack nor a pack it requires ships, and `
            + 'which is no slot (spec-001 §9)'));
        }
      }
      const roles: [string, unknown][] = [[`${pointer}/role`, phase['role']]];
      const approval = phase['approval'];
      if (isDoc(approval)) roles.push([`${pointer}/approval/by_role`, approval['by_role']]);
      for (const [where, role] of roles) {
        if (typeof role === 'string' && !known.roles.has(role)) {
          problems.push(problemAt(file, where, 'role', `${label}: phase ${name}: role ${role} is `
            + 'not in team.roles of the pack or of a pack it requires'));
        }
      }
      const iterated = phase['iterate_over'];
      if (typeof iterated === 'string' && !known.types.has(iterated)) {
        problems.push(problemAt(file, `${pointer}/iterate_over`, 'memory-type', `${label}: phase `
          + `${name} iterates over ${iterated}, which is not a Memory type of the pack or of a `
          + 'pack it requires'));
      }
    });
    problems.push(...lifeCycleProblems(catalog, pack, file, includes));
  }
  const roles = own.find((file) => file.path === 'fragments/roles.yaml');
  if (roles?.yaml !== undefined && isDoc(roles.yaml.data)) {
    const data = roles.yaml.data;
    const lists: [string, unknown][] = [['/global', data['global']]];
    const assignments = data['assignments'];
    for (const [role, ids] of Object.entries(isDoc(assignments) ? assignments : {})) {
      lists.push([`/assignments/${role}`, ids]);
    }
    for (const [pointer, ids] of lists) {
      list(ids).forEach((id, index) => {
        if (typeof id === 'string' && (known.directives.has(id)
          || BUILTIN_DIRECTIVE_IDS.includes(id))) return;
        problems.push(problemAt(roles, `${pointer}/${index}`, 'directive', `${pack.id}: roles.yaml `
          + `${pointer.slice(1)}: directive ${JSON.stringify(id)} is neither shipped by the pack `
          + 'or a pack it requires, nor built into WingFoil'));
      });
    }
  }
  return problems;
}

/** §9: base's sw-life-cycle includes its slots; a methodology's delivery includes its own. */
function lifeCycleProblems(catalog: Catalog | undefined, pack: RulePack, file: RuleFile,
  includes: string[]): Problem[] {
  if (catalog === undefined) return [];
  const stem = file.path.slice('workflows/'.length, -'.yaml'.length);
  let expected: string[] = [];
  if (pack.id === catalog.foundation && stem === 'sw-life-cycle') {
    expected = catalog.slots.filter((slot) => slot.includedBy === 'sw-life-cycle')
      .map((slot) => slot.name);
  } else if (pack.manifest.axis === 'methodology' && stem === 'delivery') {
    expected = [...catalog.slots.filter((slot) => slot.includedBy === 'delivery')
      .map((slot) => slot.name), ...DELIVERY_ALSO_INCLUDES];
  }
  return expected.filter((name) => !includes.includes(name)).map((name) =>
    problemAt(file, '/phases', 'life-cycle-includes', `${pack.id}: ${file.path} must include `
      + `${name} by name (spec-001 §9)`));
}
