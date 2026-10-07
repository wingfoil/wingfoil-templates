// The five JSON Schemas of schema/ (spec-001 §5, §6, §11, §12, §14, §15), compiled once with
// Ajv2020 as adr-003 fixes it: strict, union types allowed, every error reported.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020';
import type { ErrorObject, ValidateFunction } from 'ajv';

export const SCHEMA_KINDS = ['pack', 'catalog', 'compat', 'preset', 'transition'] as const;
export type SchemaKind = (typeof SCHEMA_KINDS)[number];

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
  const validators = new Map<SchemaKind, ValidateFunction>();
  for (const kind of SCHEMA_KINDS) {
    const schema = JSON.parse(readFileSync(join(dir, `${kind}.schema.json`), 'utf8')) as object;
    validators.set(kind, ajv.compile(schema));
  }
  return {
    warnings,
    validate(kind, data) {
      const validator = validators.get(kind);
      if (validator === undefined) throw new Error(`unknown schema kind: ${kind}`);
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
