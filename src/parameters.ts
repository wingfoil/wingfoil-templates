// Parameters (spec-001 §8): declared in pack.yaml, one flat namespace, every value checked against
// its type, then `{{name}}` substituted as text before anything is merged or copied. The type rules
// are the pack schema's, so a default and a given value obey the same grammar.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020';
import type { ValidateFunction } from 'ajv';
import { isScalar } from 'yaml';

import { CompositionError } from './composition-error';
import { parseEntry, reachableIds } from './requirements';
import type { ParameterDeclaration, ResolvedPack } from './resolve';
import { SCHEMA_DIR } from './schemas';

export type ParameterValue = string | number | boolean;

export interface Parameter {
  name: string;
  pack: string;
  type: string;
  value: ParameterValue;
  /** A list parameter (spec-003 §3.1). */
  list: boolean;
}

/** A parameter in a file's scope, as the placement rule reads it (spec-003 §3.1). */
export interface ScopedParameter {
  type: string;
  list: boolean;
  /** The pack declaring it. */
  pack: string;
}

/** A reference standing where spec-003 §3.1 does not allow it. */
export interface MisplacedReference {
  name: string;
  offset: number;
  /** Where it stands: plain, single-quoted, block scalar, comment, or a list's flow sequence. */
  placement: string;
}

/**
 * Every occurrence of `{{name}}` (§8.2), also next to other braces, as in a YAML flow mapping
 * `{k: {{name}}}`; any other `{{` is text.
 */
const REFERENCE = /\{\{([a-z][a-z0-9_]*)\}\}/g;
/** A base-10 integer as written in YAML (§8.1, §18): no fraction, no other base. */
const INTEGER_SOURCE = /^-?(?:0|[1-9][0-9]*)$/;

interface TypedDefault {
  if: { properties: { type: { const: string } } };
  then: { properties: { default: object } };
}

let validators: Map<string, ValidateFunction> | undefined;

/** The `default` subschema of each parameter type, from schema/pack.schema.json, compiled once. */
function validatorFor(type: string): ValidateFunction | undefined {
  if (validators === undefined) {
    const schema = JSON.parse(readFileSync(join(SCHEMA_DIR, 'pack.schema.json'), 'utf8')) as {
      properties?: { parameters?: { additionalProperties?: { allOf?: TypedDefault[] } } };
    };
    const rules = schema.properties?.parameters?.additionalProperties?.allOf;
    if (!Array.isArray(rules)) {
      throw new CompositionError('pack.schema.json: the parameter types are not where the '
        + 'composer reads them (properties.parameters.additionalProperties.allOf)');
    }
    const ajv = new Ajv2020({ strict: true, allowUnionTypes: true });
    validators = new Map(rules
      .map((rule) => [rule.if.properties.type.const, ajv.compile(rule.then.properties.default)]));
  }
  return validators.get(type);
}

/**
 * A value given as text, as on a command line, read by its declared type: an integer by the base-10
 * grammar, a boolean from `true` or `false`; anything else stays text, for the type check to judge.
 */
export function fromText(type: string, text: string): unknown {
  if (type === 'integer' && INTEGER_SOURCE.test(text)) return Number(text);
  if (type === 'boolean' && (text === 'true' || text === 'false')) return text === 'true';
  return text;
}

/** An item of a list parameter: a slug, optionally followed by `:` and a second slug (§3.2). */
const LIST_ITEM = /^[a-z][a-z0-9-]*(?::[a-z0-9-]+)?$/;
/** Words YAML 1.2's core schema or YAML 1.1 reads as other than a string (spec-003 §3.2). */
const YAML_WORDS = ['null', 'true', 'false', 'yes', 'no', 'on', 'off', 'y', 'n'];

/** A `string` parameter whose description begins with "List of" (spec-003 §3.1). */
export function isListParameter(declaration: { type: string; description: string }): boolean {
  return declaration.type === 'string' && declaration.description.startsWith('List of');
}

/** The item rule's first failure for a list parameter's value, or undefined (spec-003 §3.2). */
export function listItemProblem(value: string): string | undefined {
  if (value.trim() === '') return 'it has no item';
  const seen = new Set<string>();
  for (const item of value.split(',').map((part) => part.trim())) {
    if (item === '') return 'it holds an empty item';
    if (!LIST_ITEM.test(item)) return `item "${item}" is not a slug, or two slugs joined by ":"`;
    if (YAML_WORDS.includes(item)) return `item "${item}" reads as other than a string in YAML`;
    if (seen.has(item)) return `item "${item}" is listed twice`;
    seen.add(item);
  }
  return undefined;
}

/** Why a value does not fit a declaration: its type (§8.1), then a list's item rule. */
export function valueProblem(declaration: { type: string; description: string },
  value: unknown): string | undefined {
  const problem = checkValue(declaration.type, value);
  if (problem !== undefined || !isListParameter(declaration) || typeof value !== 'string') {
    return problem;
  }
  const item = listItemProblem(value);
  return item === undefined ? undefined
    : `${JSON.stringify(value)} is not a valid list: ${item} (spec-003 §3.2)`;
}

/** Why a value does not fit a parameter type, or undefined when it does. */
export function checkValue(type: string, value: unknown): string | undefined {
  const validate = validatorFor(type);
  if (validate === undefined) return `unknown parameter type ${type}`;
  if (validate(value)) return undefined;
  const [error] = validate.errors ?? [];
  return `${JSON.stringify(value)} is not a valid ${type}: ${error?.message ?? 'invalid'}`;
}

/** The source text of a default, as written in pack.yaml. */
function defaultSource(pack: Pick<ResolvedPack, 'source'>, name: string): string | undefined {
  const node = pack.source.document.getIn(['parameters', name, 'default'], true);
  return isScalar(node) ? node.source : undefined;
}

/**
 * Why a declared default does not pass its type (§8, §18), or undefined; shared by the composer
 * and the lint (task-012).
 */
export function defaultMessage(
  pack: Pick<ResolvedPack, 'id' | 'source'>,
  name: string,
  declaration: ParameterDeclaration,
): string | undefined {
  if (declaration.default === undefined) return undefined;
  const problem = valueProblem(declaration, declaration.default);
  if (problem !== undefined) return `parameter ${name} of ${pack.id}: default ${problem}`;
  const source = defaultSource(pack, name);
  if (declaration.type === 'integer' && source !== undefined && !INTEGER_SOURCE.test(source)) {
    return `parameter ${name} of ${pack.id}: default ${source} is not a base-10 integer`;
  }
  return undefined;
}

/** The parameter names a text references as `{{name}}`, in order of appearance (§8.2). */
export function referencesIn(text: string): { name: string; offset: number }[] {
  return [...text.matchAll(REFERENCE)].map((match) => ({
    name: match[1] ?? '', offset: match.index,
  }));
}

type Span = { start: number; end: number; kind: string };

/** A frontmatter as src/frontmatter.ts reads it, on the raw text: a BOM and CRLF allowed. */
const RAW_FRONTMATTER = /^(\uFEFF?---\r?\n)([\s\S]*?\r?\n)?---\r?(?:\n|$)/;
/** Before a quoted scalar or a block indicator: a line's start, after its sequence dashes. */
const NODE_START = /^[ \t]*(?:-[ \t]+)*(?:\?[ \t]+)?$/;
/** Before a quoted scalar or a block indicator: a value indicator. */
const VALUE_START = /:[ \t]+$/;
/** Inside a flow collection, also: an opening bracket, a comma, a quoted key's `:`. */
const FLOW_START = /(?:[[{,][ \t]*|["'][ \t]*:[ \t]*)$/;

/** The YAML a placement is read in: a `.yaml` file but pack.yaml, a `.md` file's frontmatter. */
function yamlRegion(text: string, path: string): { start: number; end: number } | undefined {
  const name = path.slice(path.lastIndexOf('/') + 1);
  if (name === 'pack.yaml') return undefined;
  if (path.endsWith('.yaml')) return { start: 0, end: text.length };
  if (!path.endsWith('.md')) return undefined;
  const match = RAW_FRONTMATTER.exec(text);
  if (match === null) return undefined;
  const start = (match[1] ?? '').length;
  return { start, end: start + (match[2] ?? '').length };
}

/** The column a block scalar's content must exceed: its key's, or its sequence dash's. */
function blockParentOf(prefix: string): number {
  const dashes = /^[ \t]*(?:-[ \t]+)*/.exec(prefix)?.[0] ?? '';
  if (dashes.length === prefix.length && /-[ \t]+$/.test(prefix)) {
    return prefix.trimEnd().length - 1;
  }
  return dashes.length;
}

/**
 * The quoted scalars, comments and block scalars of a YAML text, by a token scan: an unquoted
 * `{{name}}` can make the raw text unparseable, so no parser reads it (spec-003 §11). A quote
 * opens a scalar, and `|` or `>` a block scalar, only where a node starts; `[`, `{` and `,` start
 * one only inside a flow collection. A plain scalar's continuation line that begins with a quote
 * is read as a quoted scalar: a known limit, as contrived as it is rare.
 */
function yamlSpans(text: string, start: number, end: number): Span[] {
  const spans: Span[] = [];
  const lineEndOf = (at: number): number => {
    const next = text.indexOf('\n', at);
    return next === -1 ? end : Math.min(next, end);
  };
  let state: 'plain' | 'double' | 'single' = 'plain';
  let open = start;
  let lineStart = start;
  let blockParent: number | undefined;
  let flowDepth = 0;
  let i = start;
  while (i < end) {
    if (i === start || text[i - 1] === '\n') {
      lineStart = i;
      const lineEnd = lineEndOf(i);
      const line = text.slice(i, lineEnd);
      if (blockParent !== undefined) {
        if (line.trim() === '' || line.length - line.trimStart().length > blockParent) {
          spans.push({ start: i, end: lineEnd, kind: 'block scalar' });
          i = lineEnd + 1;
          continue;
        }
        blockParent = undefined;
      }
    }
    const c = text[i];
    const before = i === start ? '\n' : text[i - 1] ?? '\n';
    const prefix = text.slice(lineStart, i);
    // A tag or an anchor before a node leaves it a node start: `a: !!str "x"`.
    const bare = prefix.replace(/(?:[!&][^\s]*[ \t]+)+$/, '');
    const nodeStart = state === 'plain' && (NODE_START.test(bare) || VALUE_START.test(bare)
      || (flowDepth > 0 && FLOW_START.test(bare)));
    if (state === 'double') {
      if (c === '\\') {
        i += 1;
      } else if (c === '"') {
        spans.push({ start: open, end: i + 1, kind: 'double' });
        state = 'plain';
      }
    } else if (state === 'single') {
      if (c === "'" && text[i + 1] === "'") {
        i += 1;
      } else if (c === "'") {
        spans.push({ start: open, end: i + 1, kind: 'single-quoted' });
        state = 'plain';
      }
    } else if ((c === '[' || c === '{') && (nodeStart || flowDepth > 0)) {
      flowDepth += 1;
    } else if ((c === ']' || c === '}') && flowDepth > 0) {
      flowDepth -= 1;
    } else if (c === '"' && nodeStart) {
      state = 'double';
      open = i;
    } else if (c === "'" && nodeStart) {
      state = 'single';
      open = i;
    } else if (c === '#' && /\s/.test(before)) {
      const lineEnd = lineEndOf(i);
      spans.push({ start: i, end: lineEnd, kind: 'comment' });
      i = lineEnd;
      continue;
    } else if ((c === '|' || c === '>') && nodeStart) {
      const lineEnd = lineEndOf(i);
      if (/^[|>][-+0-9]*\s*(?:#.*)?$/.test(text.slice(i, lineEnd))) {
        blockParent = blockParentOf(bare);
        i = lineEnd + 1;
        continue;
      }
    }
    i += 1;
  }
  return spans;
}

/**
 * Every reference of a parameter in scope, other than an `integer` or a `boolean`, standing
 * outside a double-quoted scalar, save a list parameter of `ownPack` as a whole flow sequence
 * (spec-003 §3.1). A reference outside the scope is `substitute`'s and the scope rule's.
 */
export function misplacedReferences(
  text: string,
  path: string,
  scope: Map<string, ScopedParameter>,
  ownPack: string,
): MisplacedReference[] {
  const region = yamlRegion(text, path);
  if (region === undefined) return [];
  const spans = yamlSpans(text, region.start, region.end);
  const misplaced: MisplacedReference[] = [];
  for (const reference of referencesIn(text)) {
    if (reference.offset < region.start || reference.offset >= region.end) continue;
    const parameter = scope.get(reference.name);
    if (parameter === undefined || parameter.type === 'integer' || parameter.type === 'boolean') {
      continue;
    }
    const kind = spans.find((span) => span.start <= reference.offset
      && reference.offset < span.end)?.kind ?? 'plain';
    if (kind === 'double') continue;
    const after = reference.offset + reference.name.length + 4;
    const alone = /\[\s*$/.test(text.slice(region.start, reference.offset))
      && /^\s*\]/.test(text.slice(after, region.end));
    if (kind === 'plain' && parameter.list && alone) {
      if (parameter.pack === ownPack) continue;
      misplaced.push({ ...reference,
        placement: 'flow sequence outside the pack that declares it' });
      continue;
    }
    misplaced.push({ ...reference, placement: kind });
  }
  return misplaced;
}

/** The message of a misplaced reference, for the lint and the composer. */
export function placementMessage(file: string, reference: MisplacedReference): string {
  const where = reference.placement === 'plain' ? 'unquoted' : `in a ${reference.placement}`;
  return `${file}: {{${reference.name}}} stands ${where}; a parameter other than an integer or a `
    + 'boolean stands inside a double-quoted scalar, or a list parameter of the pack declaring it '
    + 'as a whole flow sequence (spec-003 §3.1)';
}

function fail(message: string): never {
  throw new CompositionError(message);
}

/**
 * Every parameter of the composition with its value: the given one, else the default. Fails on a
 * name declared twice, a value that breaks its type, a required parameter without a value, and a
 * given value no pack declares.
 */
export function resolveParameters(
  packs: ResolvedPack[],
  given: Record<string, unknown>,
  options: { givenAsText?: boolean } = {},
): Map<string, Parameter> {
  const parameters = new Map<string, Parameter>();
  for (const pack of packs) {
    for (const [name, declaration] of Object.entries(pack.manifest.parameters ?? {})) {
      const other = parameters.get(name);
      if (other !== undefined) {
        fail(`parameter ${name} is declared by ${other.pack} and by ${pack.id}`);
      }
      const defaultProblem = defaultMessage(pack, name, declaration);
      if (defaultProblem !== undefined) fail(defaultProblem);
      const raw = Object.hasOwn(given, name) ? given[name] : declaration.default;
      const value = options.givenAsText === true && Object.hasOwn(given, name)
        ? fromText(declaration.type, String(raw))
        : raw;
      if (value === undefined) {
        fail(`parameter ${name} of ${pack.id} is required and has no value`);
      }
      const problem = valueProblem(declaration, value);
      if (problem !== undefined) fail(`parameter ${name} of ${pack.id}: ${problem}`);
      parameters.set(name, {
        name, pack: pack.id, type: declaration.type, value: value as ParameterValue,
        list: isListParameter(declaration),
      });
    }
  }
  const unknown = Object.keys(given).filter((name) => !parameters.has(name)).sort();
  if (unknown.length > 0) {
    fail(`no pack of the composition declares the parameter(s) ${unknown.join(', ')}`);
  }
  return parameters;
}

/** The parameters a pack's files may use, per part (spec-001 §8.1, §6.5). */
export interface PackScopes {
  /** Its own, and those of the packs it transitively requires. */
  always: Set<string>;
  /** Per conditional entry, by index: those, and its `with` pack's with the packs it requires. */
  entries: Set<string>[];
}

/** Per pack, the parameters each part may use (§8.1, §6.5). */
export function parameterScopes(
  packs: ResolvedPack[],
  parameters: Map<string, Parameter>,
): Map<string, PackScopes> {
  const byId = new Map(packs.map((pack) => [pack.id, pack]));
  const reach = (start: string[]): Set<string> =>
    new Set(reachableIds(start, (id) => byId.get(id)?.requiredIds));
  const names = (reachable: Set<string>): Set<string> => new Set([...parameters.values()]
    .filter((parameter) => reachable.has(parameter.pack)).map((parameter) => parameter.name));
  const scopes = new Map<string, PackScopes>();
  for (const pack of packs) {
    scopes.set(pack.id, { always: names(reach([pack.id])),
      entries: (pack.manifest.conditional ?? []).map((entry) =>
        names(reach([pack.id, parseEntry(entry.with, 'requires').id]))) });
  }
  return scopes;
}

/** Replaces every `{{name}}` in one pass; a name outside the pack's scope fails (§8.2). */
export function substitute(
  text: string,
  values: Map<string, ParameterValue>,
  scope: Set<string>,
  file: string,
  pack: string,
): string {
  return text.replace(REFERENCE, (_match, name: string) => {
    const value = values.get(name);
    if (!scope.has(name) || value === undefined) {
      fail(`${file}: {{${name}}} names no parameter in the scope of ${pack}`);
    }
    return String(value);
  });
}
