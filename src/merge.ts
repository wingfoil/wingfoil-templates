// The general merge of spec-001 §7.2, with the list rules of dna.yaml (§7.3) and roles.yaml (§7.4).
// Fragments merge one pack at a time, in composition order: mappings by key, scalars must agree,
// lists follow the rule their key declares, and nothing is ever removed. Anything else fails.
import { CompositionError } from './composition-error';
import { BUILTIN_DIRECTIVE_IDS } from './wingfoil-builtins';

type Doc = Record<string, unknown>;

export type FragmentKind = 'dna' | 'roles';

export interface Fragment {
  pack: string;
  /** The fragment without its `format:` key. */
  data: Doc;
}

type ListRule = 'set' | 'keyed';

/** A path pattern: `*` matches any key, `[]` an item of a list. */
const RULES: Record<FragmentKind, [string[], ListRule][]> = {
  dna: [
    [['modules'], 'keyed'],
    [['stacks', 'technologies'], 'keyed'],
    [['stacks', 'methodologies'], 'keyed'],
    [['team', 'members'], 'keyed'],
    [['team', 'agents'], 'keyed'],
    [['team', 'roles'], 'keyed'],
    [['team', '*', '[]', 'roles'], 'set'],
    [['team', '*', '[]', 'executes_as'], 'set'],
    [['paths', '*'], 'set'],
  ],
  roles: [
    [['assignments', '*'], 'set'],
    [['global'], 'set'],
  ],
};

type Kind = 'mapping' | 'list' | 'scalar';

function kindOf(value: unknown): Kind {
  if (Array.isArray(value)) return 'list';
  if (typeof value === 'object' && value !== null) return 'mapping';
  return 'scalar';
}

/** Two scalars are equal when they have the same YAML type and value (§7.2). */
function sameScalar(a: unknown, b: unknown): boolean {
  return typeof a === typeof b && a === b;
}

function deepEqual(a: unknown, b: unknown): boolean {
  const kind = kindOf(a);
  if (kind !== kindOf(b)) return false;
  if (kind === 'scalar') return sameScalar(a, b);
  if (kind === 'list') {
    const left = a as unknown[];
    const right = b as unknown[];
    return left.length === right.length
      && left.every((item, index) => deepEqual(item, right[index]));
  }
  const left = Object.entries(a as Doc);
  const right = b as Doc;
  return left.length === Object.keys(right).length
    && left.every(([key, value]) => Object.hasOwn(right, key) && deepEqual(value, right[key]));
}

class Merger {
  constructor(private readonly kind: FragmentKind, private readonly pack: string) {}

  private fail(path: string[], message: string): never {
    const where = path.length > 0 ? path.join('.').replace(/\.\[\]/g, '[]') : '/';
    throw new CompositionError(`${this.kind}.yaml, ${where}, from ${this.pack}: ${message}`);
  }

  private ruleFor(path: string[]): ListRule | undefined {
    const match = RULES[this.kind].find(([pattern]) => pattern.length === path.length
      && pattern.every((segment, index) => segment === '*' || segment === path[index]));
    return match?.[1];
  }

  /** Checks an incoming value whose key the base side does not have, and copies it. */
  normalize(value: unknown, path: string[]): unknown {
    const kind = kindOf(value);
    this.checkListRule(kind, path);
    if (kind === 'scalar') return value;
    if (kind === 'mapping') {
      return Object.fromEntries(Object.entries(value as Doc)
        .map(([key, child]) => [key, this.normalize(child, [...path, key])]));
    }
    const items = value as unknown[];
    const rule = this.ruleFor(path);
    if (rule === 'set') {
      this.checkSetItems(items, path);
      return items.filter((item, index) =>
        items.findIndex((other) => sameScalar(other, item)) === index);
    }
    if (rule === 'keyed') {
      this.keyedNames(items, path);
      return items.map((item) => this.normalize(item, [...path, '[]']));
    }
    return structuredClone(items);
  }

  /** A key whose rule is a set or a keyed list holds a list, nothing else (§7.2). */
  private checkListRule(kind: Kind, path: string[]): void {
    const rule = this.ruleFor(path);
    if (rule !== undefined && kind !== 'list') {
      this.fail(path, `a ${rule === 'set' ? 'set' : 'keyed list'} must be a list, not a ${kind}`);
    }
  }

  private checkSetItems(items: unknown[], path: string[]): void {
    if (items.some((item) => kindOf(item) !== 'scalar')) {
      this.fail(path, 'a set holds scalars only');
    }
  }

  private keyedNames(items: unknown[], path: string[]): string[] {
    const names: string[] = [];
    for (const item of items) {
      const name = kindOf(item) === 'mapping' ? (item as Doc)['name'] : undefined;
      if (typeof name !== 'string') this.fail(path, 'every item of a keyed list needs a name');
      if (names.includes(name)) this.fail(path, `duplicate name ${name} in one fragment`);
      names.push(name);
    }
    return names;
  }

  merge(base: unknown, incoming: unknown, path: string[]): unknown {
    const baseKind = kindOf(base);
    const incomingKind = kindOf(incoming);
    this.checkListRule(incomingKind, path);
    if (baseKind !== incomingKind) {
      this.fail(path, `a ${baseKind} cannot merge with a ${incomingKind}`);
    }
    if (baseKind === 'scalar') {
      if (!sameScalar(base, incoming)) {
        this.fail(path, `${JSON.stringify(base)} cannot change to ${JSON.stringify(incoming)}`);
      }
      return base;
    }
    if (baseKind === 'mapping') {
      const result: Doc = { ...(base as Doc) };
      for (const [key, value] of Object.entries(incoming as Doc)) {
        result[key] = Object.hasOwn(result, key)
          ? this.merge(result[key], value, [...path, key])
          : this.normalize(value, [...path, key]);
      }
      return result;
    }
    return this.mergeList(base as unknown[], incoming as unknown[], path);
  }

  private mergeList(base: unknown[], incoming: unknown[], path: string[]): unknown[] {
    const rule = this.ruleFor(path);
    if (rule === 'set') {
      this.checkSetItems(incoming, path);
      const result = [...base];
      for (const item of incoming) {
        if (!result.some((existing) => sameScalar(existing, item))) result.push(item);
      }
      return result;
    }
    if (rule === 'keyed') {
      const names = this.keyedNames(incoming, path);
      const result = [...base];
      incoming.forEach((item, index) => {
        const at = result.findIndex((existing) => (existing as Doc)['name'] === names[index]);
        result.splice(at < 0 ? result.length : at, at < 0 ? 0 : 1, at < 0
          ? this.normalize(item, [...path, '[]'])
          : this.merge(result[at], item, [...path, '[]']));
      });
      return result;
    }
    // A list under an undeclared key is a scalar: equal item by item, in order (§7.2).
    if (!deepEqual(base, incoming)) this.fail(path, 'this list must be equal on both sides');
    return base;
  }
}

/** Merges the fragments of one kind, in composition order. */
export function mergeFragments(kind: FragmentKind, fragments: Fragment[]): Doc {
  let result: Doc = {};
  for (const fragment of fragments) {
    const merger = new Merger(kind, fragment.pack);
    result = merger.merge(result, fragment.data, []) as Doc;
  }
  return result;
}

/** spec-001 §7.3: no agent of any pack holds approval authority (dl-005 G6). */
export function checkDnaFragment(pack: string, data: Doc): void {
  const team = data['team'];
  const agents = kindOf(team) === 'mapping' ? (team as Doc)['agents'] : undefined;
  if (!Array.isArray(agents)) return;
  for (const agent of agents) {
    if (kindOf(agent) !== 'mapping') continue;
    const fields = agent as Doc;
    if (fields['approval_authority'] !== undefined && fields['approval_authority'] !== false) {
      throw new CompositionError(`dna.yaml, team.agents, from ${pack}: agent `
        + `${String(fields['name'])} has approval_authority; it must be false`);
    }
  }
}

/** spec-001 §7.4: every directive id is shipped by a pack or built into WingFoil. */
export function checkRoleDirectives(roles: Doc, shipped: Set<string>): void {
  const assignments = kindOf(roles['assignments']) === 'mapping' ? roles['assignments'] as Doc : {};
  const lists: [string, unknown][] = [
    ...Object.entries(assignments)
      .map(([role, ids]): [string, unknown] => [`assignments.${role}`, ids]),
    ['global', roles['global'] ?? []],
  ];
  for (const [where, list] of lists) {
    for (const id of Array.isArray(list) ? list as unknown[] : []) {
      if (typeof id !== 'string' || (!shipped.has(id) && !BUILTIN_DIRECTIVE_IDS.includes(id))) {
        throw new CompositionError(`roles.yaml, ${where}: directive ${JSON.stringify(id)} is `
          + 'neither shipped by a pack of the composition nor built into WingFoil');
      }
    }
  }
}
