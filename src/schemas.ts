// The JSON Schemas of schema/ (spec-001 §5, §6, §11, §12, §14, §15): one per kind, plus format 1's
// frozen copies of pack and catalog, compiled once with Ajv2020 as adr-003 fixes it: strict, union
// types allowed, every error reported.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020';
import type { ErrorObject, ValidateFunction } from 'ajv';

export const SCHEMA_KINDS = ['pack', 'catalog', 'compat', 'preset', 'transition'] as const;
export type SchemaKind = (typeof SCHEMA_KINDS)[number];

/** The kinds whose format 1 is kept, frozen, as `<kind>.v1.schema.json` (spec-001 §5). */
export const FROZEN_KINDS = ['pack', 'catalog'] as const;

/**
 * spec-001 §5's rule, shared with the index's schema: a file whose `format` is 1 reads format 1's
 * frozen schema; any other value, absent included, reads the current one.
 */
export function readsFormatOne(data: unknown): boolean {
  return typeof data === 'object' && data !== null && !Array.isArray(data)
    && (data as Record<string, unknown>)['format'] === 1;
}

/** The file under schema/ that validates `data` of `kind`, by the rule of `readsFormatOne`. */
export function schemaFile(kind: SchemaKind, data: unknown): string {
  const frozen = (FROZEN_KINDS as readonly string[]).includes(kind) && readsFormatOne(data);
  return `${kind}${frozen ? '.v1' : ''}.schema.json`;
}

export interface SchemaError {
  keyword: string;
  /** JSON pointer of the offending value, or of the mapping for a key error; '' is the root. */
  instancePath: string;
  message: string;
}

export interface SchemaSet {
  /** What Ajv logged while compiling; strict mode makes any of it a defect of the schemas. */
  warnings: string[];
  validate(kind: SchemaKind, data: unknown): SchemaError[];
}

/** schema/ at the repository root, from the compiled module under dist/src/. */
export const SCHEMA_DIR = join(__dirname, '..', '..', 'schema');

function describe(error: ErrorObject): string {
  const params = error.params as Record<string, unknown>;
  // Ajv's `required` message names the key already; `additionalProperties` does not.
  const name = params['additionalProperty'];
  const message = error.message ?? error.keyword;
  return typeof name === 'string' ? `${message} (${name})` : message;
}

let shared: SchemaSet | undefined;

/** The schemas of this repository, compiled once per process. */
export function repositorySchemas(): SchemaSet {
  shared ??= loadSchemas();
  return shared;
}

export function loadSchemas(dir: string = SCHEMA_DIR): SchemaSet {
  const warnings: string[] = [];
  const record = (...args: unknown[]): void => {
    warnings.push(args.map(String).join(' '));
  };
  const ajv = new Ajv2020({
    strict: true,
    allowUnionTypes: true,
    allErrors: true,
    logger: { log: () => undefined, warn: record, error: record },
  });
  // Keyed by file name: a frozen kind has two, chosen per file by `schemaFile`.
  const validators = new Map<string, ValidateFunction>();
  const files = [...SCHEMA_KINDS.map((kind) => `${kind}.schema.json`),
    ...FROZEN_KINDS.map((kind) => `${kind}.v1.schema.json`)];
  for (const file of files) {
    const schema = JSON.parse(readFileSync(join(dir, file), 'utf8')) as object;
    validators.set(file, ajv.compile(schema));
  }
  return {
    warnings,
    validate(kind, data) {
      if (!(SCHEMA_KINDS as readonly string[]).includes(kind)) {
        throw new Error(`unknown schema kind: ${kind}`);
      }
      const validator = validators.get(schemaFile(kind, data));
      if (validator === undefined) throw new Error(`no compiled schema for ${kind}`);
      if (validator(data)) return [];
      // An `if` error only says that its `then` failed; that error is reported on its own.
      return (validator.errors ?? [])
        .filter((error) => error.keyword !== 'if')
        .map((error) => ({
          keyword: error.keyword,
          instancePath: error.instancePath,
          message: describe(error),
        }));
    },
  };
}
