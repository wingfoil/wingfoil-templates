// The schema of catalog-index.json (spec-002 §3.3, task-019), outside schema/: it is not part of
// the contract with the WingFoil CLI (spec-002 §4). Compiled once with Ajv2020 as adr-003 fixes it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020';
import type { ValidateFunction } from 'ajv';

import { readsFormatOne } from './schemas';

/** index/ at the repository root, from the compiled module under dist/src/. */
export const INDEX_SCHEMA = join(__dirname, '..', '..', 'index', 'catalog-index.schema.json');
/** Format 1's schema, frozen (spec-002 §3.3). */
export const INDEX_SCHEMA_V1 = join(__dirname, '..', '..', 'index', 'catalog-index.v1.schema.json');

/** The index schema file, relative to the root, chosen by `readsFormatOne`. */
export function indexSchemaFile(data: unknown): string {
  return readsFormatOne(data) ? 'index/catalog-index.v1.schema.json'
    : 'index/catalog-index.schema.json';
}

/** Both schemas of the index, compiled together; `warnings` covers both. */
export interface IndexSchemas {
  current: ValidateFunction;
  v1: ValidateFunction;
  warnings: string[];
}

let compiled: IndexSchemas | undefined;
let document: Record<string, unknown> | undefined;

/** The schema as data, for what it declares (the site reads its axis order, task-024). */
export function indexSchemaDocument(): Record<string, unknown> {
  document ??= JSON.parse(readFileSync(INDEX_SCHEMA, 'utf8')) as Record<string, unknown>;
  return document;
}

export function indexSchema(): IndexSchemas {
  if (compiled === undefined) {
    const warnings: string[] = [];
    const record = (...args: unknown[]): void => {
      warnings.push(args.map(String).join(' '));
    };
    const ajv = new Ajv2020({ strict: true, allowUnionTypes: true, allErrors: true,
      logger: { log: () => undefined, warn: record, error: record } });
    const read = (file: string): object => JSON.parse(readFileSync(file, 'utf8')) as object;
    compiled = { current: ajv.compile(read(INDEX_SCHEMA)), v1: ajv.compile(read(INDEX_SCHEMA_V1)),
      warnings };
  }
  return compiled;
}

/**
 * The schema errors of an index, as `<pointer> <message>` lines, against the schema its format
 * chooses (`indexSchemaFile`); none when it is valid.
 */
export function indexSchemaErrors(data: unknown): string[] {
  const schemas = indexSchema();
  // The same choice as `indexSchemaFile`, so that the site's text names the schema used here.
  const validate = indexSchemaFile(data) === 'index/catalog-index.v1.schema.json' ? schemas.v1
    : schemas.current;
  if (validate(data)) return [];
  return (validate.errors ?? []).map((error) =>
    `${error.instancePath === '' ? '/' : error.instancePath} ${error.message ?? error.keyword}`);
}
