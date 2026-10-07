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
}

interface TypeState {
  definedBy: string;
  /** The keys of the definition and of its template, in the defining fragment's order (§7.2). */
  keys: string[];
  templateKeys: string[];
  path: unknown;
  idPattern: unknown;
  templateFile: unknown;
  required: unknown[] | undefined;
  /** Defined without `states`: follows `defaults` until a tightening detaches it. */
  derives: boolean;
  /** The type's own machine; absent while it follows `defaults`. */
  machine: Machine | undefined;
  /** The sequence a tightening must keep (§7.5 step 1). */
  reference: string[];
}

const TOP_KEYS = ['defaults', 'types'];
const DEFINITION_KEYS = ['path', 'id_pattern', 'template', 'states'];
const TEMPLATE_KEYS = ['file', 'frontmatter'];
const FRONTMATTER_KEYS = ['required'];
const STATES_KEYS = ['sequence', 'gates'];

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

interface IncomingStates {
  sequence: string[] | undefined;
  gates: Map<string, string>;
}

function readStates(value: unknown, subject: string, pack: string): IncomingStates {
  if (!isDoc(value)) fail(subject, pack, 'states must be a mapping');
  checkKeys(value, STATES_KEYS, subject, pack, 'states.');
  return {
    sequence: value['sequence'] === undefined
      ? undefined
      : readSequence(value['sequence'], subject, pack),
    gates: readGates(value['gates'], subject, pack),
  };
}

function isSubsequence(part: string[], whole: string[]): boolean {
  let index = 0;
  for (const state of whole) if (state === part[index]) index += 1;
  return index === part.length;
}

/** §7.5 "Sequences" and "Gates": merge an incoming states block into machine A. */
export function mergeMachine(
  current: Machine,
  incoming: IncomingStates,
  reference: string[],
  subject: string,
  pack: string,
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
  for (const [state, reject] of gates) {
    if (!merged.includes(state)) {
      fail(subject, pack, `gate on ${state}, not a state of the sequence`);
    }
    if (!merged.includes(reject)) {
      fail(subject, pack, `gate ${state} rejects to ${reject}, not a state of the sequence`);
    }
    if (reject === state) fail(subject, pack, `gate ${state} rejects to itself`);
  }
  return { sequence: merged, gates };
}

function cloneMachine(machine: Machine): Machine {
  return { sequence: [...machine.sequence], gates: new Map(machine.gates) };
}

function machineOut(machine: Machine): Doc {
  const out: Doc = { sequence: [...machine.sequence] };
  if (machine.gates.size > 0) {
    const gates = [...machine.gates].map(([state, reject]) => [state, { reject }]);
    out['gates'] = Object.fromEntries(gates);
  }
  return out;
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
      if (incoming.sequence === undefined) fail('defaults', pack, 'states needs a sequence');
      this.defaults = mergeMachine({ sequence: incoming.sequence, gates: new Map() }, incoming,
        incoming.sequence, 'defaults', pack);
      this.defaultsReference = [...incoming.sequence];
      return;
    }
    this.defaults = mergeMachine(this.defaults, incoming, this.defaultsReference, 'defaults', pack);
    // Every tightening of defaults reaches the types that derive from it and already detached.
    for (const [name, type] of this.types) {
      if (type.derives && type.machine !== undefined) {
        type.machine = mergeMachine(type.machine, incoming, this.defaultsReference, `type ${name}`,
          pack);
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
    const required = this.readRequired(template, subject, pack);
    let machine: Machine | undefined;
    if (body['states'] === undefined && this.defaults === undefined) {
      fail(subject, pack, 'a type without states follows defaults, and no pack defined defaults');
    }
    if (body['states'] !== undefined) {
      const incoming = readStates(body['states'], subject, pack);
      if (incoming.sequence === undefined) fail(subject, pack, 'states needs a sequence');
      machine = mergeMachine({ sequence: incoming.sequence, gates: new Map() }, incoming,
        incoming.sequence, subject, pack);
    }
    this.types.set(name, {
      definedBy: pack,
      keys: Object.keys(body),
      templateKeys: Object.keys(template),
      path: body['path'],
      idPattern: body['id_pattern'],
      templateFile: template['file'],
      required,
      derives: machine === undefined,
      machine,
      reference: machine === undefined ? [] : [...machine.sequence],
    });
  }

  private readRequired(template: Doc, subject: string, pack: string): unknown[] | undefined {
    const frontmatter = template['frontmatter'];
    if (frontmatter === undefined) return undefined;
    if (!isDoc(frontmatter)) fail(subject, pack, 'template.frontmatter must be a mapping');
    checkKeys(frontmatter, FRONTMATTER_KEYS, subject, pack, 'template.frontmatter.');
    const required = frontmatter['required'];
    if (required === undefined) return undefined;
    if (!Array.isArray(required) || !required.every((field) => typeof field === 'string')) {
      fail(subject, pack, 'template.frontmatter.required must be a list of field names');
    }
    return required.filter((field, index) => required.indexOf(field) === index);
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
    const template = body['template'];
    if (template !== undefined) {
      if (!isDoc(template)) fail(subject, pack, 'template must be a mapping');
      checkKeys(template, TEMPLATE_KEYS, subject, pack, 'template.');
      same('template.file', template['file'], type.templateFile);
      const required = this.readRequired(template, subject, pack);
      if (required !== undefined) {
        const base = type.required ?? [];
        type.required = [...base, ...required.filter((field) => !base.includes(field))];
      }
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

  /** A type as composed, its keys in the defining fragment's order, later ones appended. */
  private typeOut(type: TypeState): Doc {
    const template: Doc = {};
    const templateKeys = [...type.templateKeys];
    if (type.required !== undefined && !templateKeys.includes('frontmatter')) {
      templateKeys.push('frontmatter');
    }
    for (const key of templateKeys) {
      if (key === 'file') template['file'] = type.templateFile;
      if (key === 'frontmatter') {
        template['frontmatter'] = type.required === undefined
          ? {}
          : { required: [...type.required] };
      }
    }
    const values: Doc = { path: type.path, id_pattern: type.idPattern, template };
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
