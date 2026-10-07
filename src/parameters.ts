// Parameters (spec-001 §8): declared in pack.yaml, one flat namespace, every value checked against
// its type, then `{{name}}` substituted as text before anything is merged or copied. The type rules
// are the pack schema's, so a default and a given value obey the same grammar.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020';
import type { ValidateFunction } from 'ajv';
import { isScalar } from 'yaml';

import { CompositionError } from './composition-error';
import type { ResolvedPack } from './resolve';
import { SCHEMA_DIR } from './schemas';

export type ParameterValue = string | number | boolean;

export interface Parameter {
  name: string;
  pack: string;
  type: string;
  value: ParameterValue;
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

/** Why a value does not fit a parameter type, or undefined when it does. */
export function checkValue(type: string, value: unknown): string | undefined {
  const validate = validatorFor(type);
  if (validate === undefined) return `unknown parameter type ${type}`;
  if (validate(value)) return undefined;
  const [error] = validate.errors ?? [];
  return `${JSON.stringify(value)} is not a valid ${type}: ${error?.message ?? 'invalid'}`;
}

/** The source text of a default, as written in pack.yaml. */
function defaultSource(pack: ResolvedPack, name: string): string | undefined {
  const node = pack.source.document.getIn(['parameters', name, 'default'], true);
  return isScalar(node) ? node.source : undefined;
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
      if (declaration.default !== undefined) {
        const problem = checkValue(declaration.type, declaration.default);
        if (problem !== undefined) fail(`parameter ${name} of ${pack.id}: default ${problem}`);
        const source = defaultSource(pack, name);
        const integer = declaration.type === 'integer' && source !== undefined;
        if (integer && !INTEGER_SOURCE.test(source)) {
          fail(`parameter ${name} of ${pack.id}: default ${source} is not a base-10 integer`);
        }
      }
      const raw = Object.hasOwn(given, name) ? given[name] : declaration.default;
      const value = options.givenAsText === true && Object.hasOwn(given, name)
        ? fromText(declaration.type, String(raw))
        : raw;
      if (value === undefined) {
        fail(`parameter ${name} of ${pack.id} is required and has no value`);
      }
      const problem = checkValue(declaration.type, value);
      if (problem !== undefined) fail(`parameter ${name} of ${pack.id}: ${problem}`);
      parameters.set(name, {
        name, pack: pack.id, type: declaration.type, value: value as ParameterValue,
      });
    }
  }
  const unknown = Object.keys(given).filter((name) => !parameters.has(name)).sort();
  if (unknown.length > 0) {
    fail(`no pack of the composition declares the parameter(s) ${unknown.join(', ')}`);
  }
  return parameters;
}

/** Per pack, the parameters it may use: its own and those of the packs it transitively requires. */
export function parameterScopes(
  packs: ResolvedPack[],
  parameters: Map<string, Parameter>,
): Map<string, Set<string>> {
  const byId = new Map(packs.map((pack) => [pack.id, pack]));
  const scopes = new Map<string, Set<string>>();
  for (const pack of packs) {
    const reachable = new Set<string>([pack.id]);
    const queue = [...pack.requiredIds];
    for (let id = queue.shift(); id !== undefined; id = queue.shift()) {
      if (reachable.has(id)) continue;
      reachable.add(id);
      queue.push(...(byId.get(id)?.requiredIds ?? []));
    }
    scopes.set(pack.id, new Set([...parameters.values()]
      .filter((parameter) => reachable.has(parameter.pack))
      .map((parameter) => parameter.name)));
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
