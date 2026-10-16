// The memory.yaml merge of spec-001 §7.5, "add or tighten": a type is defined by the first pack
// that declares it; later packs may only tighten it, and nothing is ever removed. A type defined
// without `states` derives from `defaults`, and every tightening of `defaults` reaches it.
import { CompositionError } from './composition-error';

type Doc = Record<string, unknown>;

export interface MemoryFragment {
  pack: string;
  /** The fragment without its `format:` key. */
  data: Doc;
}

interface Machine {
  sequence: string[];
  /** state -> reject target, in insertion order. */
  gates: Map<string, string>;
  /** The states that wait (a set, in insertion order). */
  waiting: string[];
  /** state -> an earlier state it returns to; declared by the defining pack only. */
  returns: Map<string, string> | undefined;
  /** state -> its limit, a positive integer; merged by the minimum. */
  limits: Map<string, number>;
}

interface TypeState {
  definedBy: string;
  /** The keys of the definition and of its template, in the defining fragment's order (§7.2). */
  keys: string[];
  templateKeys: string[];
  path: unknown;
  idPattern: unknown;
  templateFile: unknown;
  /** The set-once keys the defining pack gave (`name`, `description`, …), compared by value. */
  setOnce: Map<string, unknown>;
  /** The frontmatter's keys in the defining fragment's order, later ones appended. */
  frontmatterKeys: string[];
  required: string[] | undefined;
  notApplicable: string[] | undefined;
  lists: string[] | undefined;
  /** Defined without `states`: follows `defaults` until a tightening detaches it. */
  derives: boolean;
  /** The type's own machine; absent while it follows `defaults`. */
  machine: Machine | undefined;
  /** The sequence a tightening must keep (§7.5 step 1). */
  reference: string[];
}

const TOP_KEYS = ['defaults', 'types'];
/** Set by the defining pack only; a later pack's value must be equal (§7.5, plan-038 ruling 2). */
const SET_ONCE_KEYS = ['name', 'description', 'tags', 'amendable', 'fields'];
const DEFINITION_KEYS = [...SET_ONCE_KEYS, 'path', 'id_pattern', 'template', 'states'];
const TEMPLATE_KEYS = ['file', 'frontmatter'];
const FRONTMATTER_KEYS = ['required', 'not_applicable_allowed', 'lists'];
const FIELD_SETS: [string, 'notApplicable' | 'lists'][] = [
  ['not_applicable_allowed', 'notApplicable'], ['lists', 'lists'],
];
const STATES_KEYS = ['sequence', 'gates', 'waiting', 'returns', 'limits'];

function isDoc(value: unknown): value is Doc {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function fail(subject: string, pack: string, message: string): never {
  throw new CompositionError(`memory.yaml, ${subject}, from ${pack}: ${message}`);
}

function checkKeys(
  value: Doc,
  allowed: string[],
  subject: string,
  pack: string,
  prefix = '',
): void {
  const extra = Object.keys(value).find((key) => !allowed.includes(key));
  if (extra !== undefined) fail(subject, pack, `${prefix}${extra} is not allowed here`);
}

/** A YAML value as text that ignores a mapping's key order and keeps a list's (§7.2). */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (isDoc(value)) {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:`
      + canonical(value[key])).join(',')}}`;
  }
  return JSON.stringify(value) ?? 'undefined';
}

function names(value: unknown, subject: string, pack: string, label: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    fail(subject, pack, `${label} must be a list of names`);
  }
  return value.filter((item, index) => value.indexOf(item) === index);
}

function readSequence(value: unknown, subject: string, pack: string): string[] {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    fail(subject, pack, 'states.sequence must be a list of state names');
  }
  const sequence = value;
  const duplicate = sequence.find((state, index) => sequence.indexOf(state) !== index);
  if (duplicate !== undefined) fail(subject, pack, `duplicate state ${duplicate}`);
  return sequence;
}

function readGates(value: unknown, subject: string, pack: string): Map<string, string> {
  const gates = new Map<string, string>();
  if (value === undefined) return gates;
  if (!isDoc(value)) fail(subject, pack, 'states.gates must be a mapping');
  for (const [state, gate] of Object.entries(value)) {
    if (!isDoc(gate) || typeof gate['reject'] !== 'string' || Object.keys(gate).length !== 1) {
      fail(subject, pack, `gate ${state} must be { reject: <state> }`);
    }
    gates.set(state, gate['reject']);
  }
  return gates;
}

function readReturns(value: unknown, subject: string, pack: string): Map<string, string> {
  if (!isDoc(value) || !Object.values(value).every((target) => typeof target === 'string')) {
    fail(subject, pack, 'states.returns must map a state to a state');
  }
  return new Map(Object.entries(value) as [string, string][]);
}

function readLimits(value: unknown, subject: string, pack: string): Map<string, number> {
  if (!isDoc(value)) fail(subject, pack, 'states.limits must be a mapping');
  const limits = new Map<string, number>();
  for (const [state, limit] of Object.entries(value)) {
    if (typeof limit !== 'number' || !Number.isInteger(limit) || limit < 1) {
      fail(subject, pack, `states.limits.${state} must be a positive integer`);
    }
    limits.set(state, limit);
  }
  return limits;
}

interface IncomingStates {
  sequence: string[] | undefined;
  gates: Map<string, string>;
  waiting: string[] | undefined;
  returns: Map<string, string> | undefined;
  limits: Map<string, number> | undefined;
}

function readStates(value: unknown, subject: string, pack: string): IncomingStates {
  if (!isDoc(value)) fail(subject, pack, 'states must be a mapping');
  checkKeys(value, STATES_KEYS, subject, pack, 'states.');
  return {
    sequence: value['sequence'] === undefined
      ? undefined
      : readSequence(value['sequence'], subject, pack),
    gates: readGates(value['gates'], subject, pack),
    waiting: value['waiting'] === undefined
      ? undefined
      : names(value['waiting'], subject, pack, 'states.waiting'),
    returns: value['returns'] === undefined
      ? undefined
      : readReturns(value['returns'], subject, pack),
    limits: value['limits'] === undefined ? undefined : readLimits(value['limits'], subject, pack),
  };
}

function isSubsequence(part: string[], whole: string[]): boolean {
  let index = 0;
  for (const state of whole) if (state === part[index]) index += 1;
  return index === part.length;
}

/** §7.5 "Gates", "Waiting, returns and limits": every name a state of the merged sequence. */
function checkMachine(machine: Machine, subject: string, pack: string): void {
  const { sequence } = machine;
  for (const [state, reject] of machine.gates) {
    if (!sequence.includes(state)) {
      fail(subject, pack, `gate on ${state}, not a state of the sequence`);
    }
    if (!sequence.includes(reject)) {
      fail(subject, pack, `gate ${state} rejects to ${reject}, not a state of the sequence`);
    }
    if (reject === state) fail(subject, pack, `gate ${state} rejects to itself`);
  }
  for (const state of machine.waiting) {
    if (!sequence.includes(state)) {
      fail(subject, pack, `waiting ${state}, not a state of the sequence`);
    }
  }
  for (const [state, target] of machine.returns ?? []) {
    if (!sequence.includes(state) || !sequence.includes(target)
      || sequence.indexOf(target) >= sequence.indexOf(state)) {
      fail(subject, pack, `returns ${state} to ${target}: two states of the sequence, the `
        + 'second earlier');
    }
  }
  for (const state of machine.limits.keys()) {
    if (!sequence.includes(state)) {
      fail(subject, pack, `limits ${state}, not a state of the sequence`);
    }
  }
}

/** A machine as its defining pack declares it. */
function newMachine(incoming: IncomingStates, subject: string, pack: string): Machine {
  if (incoming.sequence === undefined) fail(subject, pack, 'states needs a sequence');
  const machine: Machine = {
    sequence: [...incoming.sequence],
    gates: new Map(incoming.gates),
    waiting: [...incoming.waiting ?? []],
    returns: incoming.returns === undefined ? undefined : new Map(incoming.returns),
    limits: new Map(incoming.limits ?? []),
  };
  checkMachine(machine, subject, pack);
  return machine;
}

/**
 * §7.5: merge an incoming states block into machine A. `ownBase` is the sequence a new `waiting`
 * entry is judged against (A's, or `defaults`' for a tightening of `defaults` reaching a type).
 */
function mergeMachine(
  current: Machine,
  incoming: IncomingStates,
  reference: string[],
  subject: string,
  pack: string,
  ownBase: string[] = current.sequence,
): Machine {
  const a = current.sequence;
  const b = incoming.sequence ?? a;
  if (!isSubsequence(reference, b)) {
    fail(subject, pack, `the sequence must keep [${reference.join(', ')}] in this order`);
  }
  const common = a.filter((state) => b.includes(state));
  const commonInB = b.filter((state) => a.includes(state));
  if (common.some((state, index) => commonInB[index] !== state)) {
    fail(subject, pack, `states common to both sides are in a different order: `
      + `[${common.join(', ')}] and [${commonInB.join(', ')}]`);
  }
  // Step 3: in each gap around the common states, the base side's own states, then the incoming.
  const merged: string[] = [];
  const gap = (side: string[], from: number, to: number): string[] =>
    side.slice(from, to).filter((state) => !common.includes(state));
  let aFrom = 0;
  let bFrom = 0;
  for (const state of [...common, undefined]) {
    const aTo = state === undefined ? a.length : a.indexOf(state);
    const bTo = state === undefined ? b.length : b.indexOf(state);
    merged.push(...gap(a, aFrom, aTo), ...gap(b, bFrom, bTo));
    if (state !== undefined) merged.push(state);
    aFrom = aTo + 1;
    bFrom = bTo + 1;
  }
  const gates = new Map(current.gates);
  for (const [state, reject] of incoming.gates) {
    const existing = gates.get(state);
    if (existing !== undefined && existing !== reject) {
      fail(subject, pack, `gate ${state} rejects to ${existing}; it cannot change to ${reject}`);
    }
    gates.set(state, reject);
  }
  // A later pack adds to `waiting` only its own states; a repeat changes nothing (R10 too).
  const waiting = [...current.waiting];
  for (const state of incoming.waiting ?? []) {
    if (waiting.includes(state)) continue;
    if (!b.includes(state)) fail(subject, pack, `waiting ${state}, not a state of the sequence`);
    if (ownBase.includes(state)) {
      fail(subject, pack, `waiting ${state}: only a state this pack inserts may wait`);
    }
    waiting.push(state);
  }
  // `returns` is the defining pack's: an incoming one must equal it.
  const asDoc = (returns: Map<string, string> | undefined): unknown =>
    returns === undefined ? undefined : Object.fromEntries(returns);
  if (incoming.returns !== undefined
    && canonical(asDoc(incoming.returns)) !== canonical(asDoc(current.returns))) {
    fail(subject, pack, 'states.returns is the defining pack\'s; it cannot change');
  }
  // `limits` merge by the minimum (R10: also on a state, or a type, that had none).
  const limits = new Map(current.limits);
  for (const [state, limit] of incoming.limits ?? []) {
    limits.set(state, Math.min(limit, limits.get(state) ?? limit));
  }
  const machine = { sequence: merged, gates, waiting, returns: current.returns, limits };
  checkMachine(machine, subject, pack);
  return machine;
}

function cloneMachine(machine: Machine): Machine {
  return {
    sequence: [...machine.sequence],
    gates: new Map(machine.gates),
    waiting: [...machine.waiting],
    returns: machine.returns === undefined ? undefined : new Map(machine.returns),
    limits: new Map(machine.limits),
  };
}

/** The machine as composed: `sequence` and `gates` first, then `waiting`, `returns`, `limits`. */
function machineOut(machine: Machine): Doc {
  const out: Doc = { sequence: [...machine.sequence] };
  if (machine.gates.size > 0) {
    const gates = [...machine.gates].map(([state, reject]) => [state, { reject }]);
    out['gates'] = Object.fromEntries(gates);
  }
  if (machine.waiting.length > 0) out['waiting'] = [...machine.waiting];
  if (machine.returns !== undefined) out['returns'] = Object.fromEntries(machine.returns);
  if (machine.limits.size > 0) out['limits'] = Object.fromEntries(machine.limits);
  return out;
}

interface Frontmatter {
  keys: string[];
  required: string[] | undefined;
  notApplicable: string[] | undefined;
  lists: string[] | undefined;
}

class MemoryMerge {
  private readonly types = new Map<string, TypeState>();
  private defaults: Machine | undefined;
  private defaultsReference: string[] = [];

  constructor(private readonly foundation: string) {}

  apply(fragment: MemoryFragment): void {
    checkKeys(fragment.data, TOP_KEYS, 'the fragment', fragment.pack);
    const defaults = fragment.data['defaults'];
    if (defaults !== undefined) this.applyDefaults(fragment.pack, defaults);
    const types = fragment.data['types'];
    if (types === undefined) return;
    if (!isDoc(types)) fail('types', fragment.pack, 'types must be a mapping');
    for (const [name, body] of Object.entries(types)) {
      if (!isDoc(body)) fail(`type ${name}`, fragment.pack, 'a type must be a mapping');
      if (this.types.has(name)) this.tighten(name, fragment.pack, body);
      else this.define(name, fragment.pack, body);
    }
  }

  private applyDefaults(pack: string, value: unknown): void {
    if (!isDoc(value)) fail('defaults', pack, 'defaults must be a mapping');
    checkKeys(value, ['states'], 'defaults', pack);
    const incoming = readStates(value['states'], 'defaults', pack);
    if (this.defaults === undefined) {
      if (pack !== this.foundation) {
        fail('defaults', pack, `defaults are defined by ${this.foundation} only`);
      }
      this.defaults = newMachine(incoming, 'defaults', pack);
      this.defaultsReference = [...this.defaults.sequence];
      return;
    }
    const before = this.defaults.sequence;
    this.defaults = mergeMachine(this.defaults, incoming, this.defaultsReference, 'defaults', pack);
    // Every tightening of defaults reaches the types that derive from it and already detached;
    // its `waiting` entries were judged own against defaults' base side.
    for (const [name, type] of this.types) {
      if (type.derives && type.machine !== undefined) {
        type.machine = mergeMachine(type.machine, incoming, this.defaultsReference, `type ${name}`,
          pack, before);
      }
    }
  }

  private define(name: string, pack: string, body: Doc): void {
    const subject = `type ${name}`;
    checkKeys(body, DEFINITION_KEYS, subject, pack);
    for (const key of ['path', 'id_pattern', 'template']) {
      if (body[key] === undefined) fail(subject, pack, `a new type needs ${key}`);
    }
    const template = body['template'];
    if (!isDoc(template) || template['file'] === undefined) {
      fail(subject, pack, 'template needs a file');
    }
    checkKeys(template, TEMPLATE_KEYS, subject, pack, 'template.');
    const frontmatter = this.readFrontmatter(template, subject, pack);
    // At a definition, the two sets name fields of the type's own `required`.
    for (const [key, field] of FIELD_SETS) {
      const outside = (frontmatter[field] ?? []).find((name) =>
        !(frontmatter.required ?? []).includes(name));
      if (outside !== undefined) {
        fail(subject, pack, `template.frontmatter.${key} names ${outside}, which required does `
          + 'not list');
      }
    }
    let machine: Machine | undefined;
    if (body['states'] === undefined && this.defaults === undefined) {
      fail(subject, pack, 'a type without states follows defaults, and no pack defined defaults');
    }
    if (body['states'] !== undefined) {
      machine = newMachine(readStates(body['states'], subject, pack), subject, pack);
    }
    this.types.set(name, {
      definedBy: pack,
      keys: Object.keys(body),
      templateKeys: Object.keys(template),
      path: body['path'],
      idPattern: body['id_pattern'],
      templateFile: template['file'],
      setOnce: new Map(SET_ONCE_KEYS.filter((key) => body[key] !== undefined)
        .map((key) => [key, body[key]])),
      frontmatterKeys: frontmatter.keys,
      required: frontmatter.required,
      notApplicable: frontmatter.notApplicable,
      lists: frontmatter.lists,
      derives: machine === undefined,
      machine,
      reference: machine === undefined ? [] : [...machine.sequence],
    });
  }

  private readFrontmatter(template: Doc, subject: string, pack: string): Frontmatter {
    const frontmatter = template['frontmatter'];
    const none: Frontmatter = { keys: [], required: undefined, notApplicable: undefined,
      lists: undefined };
    if (frontmatter === undefined) return none;
    if (!isDoc(frontmatter)) fail(subject, pack, 'template.frontmatter must be a mapping');
    if (frontmatter['exempt'] !== undefined) {
      fail(subject, pack, 'template.frontmatter.exempt names element ids, which are project '
        + 'values: it is never in a pack (spec-001 §7.5)');
    }
    checkKeys(frontmatter, FRONTMATTER_KEYS, subject, pack, 'template.frontmatter.');
    const read = (key: string): string[] | undefined => frontmatter[key] === undefined
      ? undefined : names(frontmatter[key], subject, pack, `template.frontmatter.${key}`);
    return { keys: Object.keys(frontmatter), required: read('required'),
      notApplicable: read('not_applicable_allowed'), lists: read('lists') };
  }

  private tighten(name: string, pack: string, body: Doc): void {
    const subject = `type ${name}`;
    const type = this.types.get(name);
    if (type === undefined) return;
    checkKeys(body, DEFINITION_KEYS, subject, pack);
    const same = (key: string, incoming: unknown, defined: unknown): void => {
      if (incoming !== undefined && incoming !== defined) {
        fail(subject, pack, `${key} is ${JSON.stringify(defined)}, set by ${type.definedBy}; it `
          + `cannot change to ${JSON.stringify(incoming)}`);
      }
    };
    same('path', body['path'], type.path);
    same('id_pattern', body['id_pattern'], type.idPattern);
    for (const key of SET_ONCE_KEYS) {
      if (body[key] === undefined) continue;
      if (!type.setOnce.has(key)) {
        fail(subject, pack, `${key} is set by the defining pack, ${type.definedBy}, which left it `
          + 'out');
      }
      if (canonical(body[key]) !== canonical(type.setOnce.get(key))) {
        fail(subject, pack, `${key} is set by ${type.definedBy}; it cannot change`);
      }
    }
    const template = body['template'];
    if (template !== undefined) {
      if (!isDoc(template)) fail(subject, pack, 'template must be a mapping');
      checkKeys(template, TEMPLATE_KEYS, subject, pack, 'template.');
      same('template.file', template['file'], type.templateFile);
      this.tightenFrontmatter(type, this.readFrontmatter(template, subject, pack), subject, pack);
    }
    if (body['states'] === undefined) return;
    const incoming = readStates(body['states'], subject, pack);
    if (type.machine === undefined) {
      // Detaching from defaults: the incoming states tighten defaults as they stand now.
      const current = this.defaults;
      if (current === undefined) fail(subject, pack, `no defaults to derive from`);
      type.machine = mergeMachine(cloneMachine(current), incoming, this.defaultsReference, subject,
        pack);
      return;
    }
    const reference = type.derives ? this.defaultsReference : type.reference;
    type.machine = mergeMachine(type.machine, incoming, reference, subject, pack);
  }

  /**
   * `required` gains fields; `not_applicable_allowed` and `lists` gain only fields the same
   * fragment adds to `required`, a repeated entry changing nothing (§7.5, R9).
   */
  private tightenFrontmatter(type: TypeState, incoming: Frontmatter, subject: string,
    pack: string): void {
    const before = type.required ?? [];
    const added = (incoming.required ?? []).filter((field) => !before.includes(field));
    for (const [key, field] of FIELD_SETS) {
      const current = type[field] ?? [];
      for (const name of incoming[field] ?? []) {
        if (current.includes(name) && (incoming.required ?? []).includes(name)) continue;
        if (!added.includes(name)) {
          fail(subject, pack, `template.frontmatter.${key} names ${name}, which this fragment `
            + 'does not add to required');
        }
      }
    }
    if (incoming.required !== undefined) type.required = [...before, ...added];
    for (const [, field] of FIELD_SETS) {
      const extra = (incoming[field] ?? []).filter((name) => !(type[field] ?? []).includes(name));
      if (incoming[field] !== undefined) type[field] = [...type[field] ?? [], ...extra];
    }
    for (const key of incoming.keys) {
      if (!type.frontmatterKeys.includes(key)) type.frontmatterKeys.push(key);
    }
  }

  /** A type as composed, its keys in the defining fragment's order, later ones appended. */
  private typeOut(type: TypeState): Doc {
    const frontmatter: Doc = {};
    for (const key of type.frontmatterKeys) {
      if (key === 'required' && type.required !== undefined) frontmatter[key] = [...type.required];
      if (key === 'not_applicable_allowed' && type.notApplicable !== undefined) {
        frontmatter[key] = [...type.notApplicable];
      }
      if (key === 'lists' && type.lists !== undefined) frontmatter[key] = [...type.lists];
    }
    const template: Doc = {};
    const templateKeys = [...type.templateKeys];
    if (type.frontmatterKeys.length > 0 && !templateKeys.includes('frontmatter')) {
      templateKeys.push('frontmatter');
    }
    for (const key of templateKeys) {
      if (key === 'file') template['file'] = type.templateFile;
      if (key === 'frontmatter') template['frontmatter'] = frontmatter;
    }
    const values: Doc = { ...Object.fromEntries(type.setOnce), path: type.path,
      id_pattern: type.idPattern, template };
    if (type.machine !== undefined) values['states'] = machineOut(type.machine);
    const keys = [...type.keys];
    if (type.machine !== undefined && !keys.includes('states')) keys.push('states');
    return Object.fromEntries(keys.filter((key) => Object.hasOwn(values, key))
      .map((key) => [key, values[key]]));
  }

  definers(): Map<string, string> {
    return new Map([...this.types].map(([name, type]) => [name, type.definedBy]));
  }

  result(): Doc {
    const out: Doc = {};
    if (this.defaults !== undefined) out['defaults'] = { states: machineOut(this.defaults) };
    const types: Doc = {};
    for (const [name, type] of this.types) {
      types[name] = this.typeOut(type);
    }
    out['types'] = types;
    return out;
  }
}

export interface MergedMemory {
  doc: Doc;
  /** Type name -> the pack that defined it (§7.5), for the Memory template rules (§7.6). */
  definedBy: Map<string, string>;
}

/** Merges memory fragments in composition order, and tells which pack defined each type. */
export function mergeMemoryWithOwners(
  fragments: MemoryFragment[],
  foundation: string,
): MergedMemory {
  const merge = new MemoryMerge(foundation);
  for (const fragment of fragments) merge.apply(fragment);
  return { doc: merge.result(), definedBy: merge.definers() };
}

/** Merges memory fragments in composition order; the first must define `defaults`, if any. */
export function mergeMemory(fragments: MemoryFragment[], foundation: string): Doc {
  return mergeMemoryWithOwners(fragments, foundation).doc;
}
