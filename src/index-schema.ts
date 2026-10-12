// The schema of catalog-index.json (spec-002 §3.3, task-019), outside schema/: it is not part of
// the contract with the WingFoil CLI (spec-002 §4). Compiled once with Ajv2020 as adr-003 fixes it.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Ajv2020 from 'ajv/dist/2020';
import type { ValidateFunction } from 'ajv';

/** index/ at the repository root, from the compiled module under dist/src/. */
export const INDEX_SCHEMA = join(__dirname, '..', '..', 'index', 'catalog-index.schema.json');

let compiled: { validate: ValidateFunction; warnings: string[] } | undefined;
let document: Record<string, unknown> | undefined;

/** The schema as data, for what it declares (the site reads its axis order, task-024). */
export function indexSchemaDocument(): Record<string, unknown> {
  document ??= JSON.parse(readFileSync(INDEX_SCHEMA, 'utf8')) as Record<string, unknown>;
  return document;
}

export function indexSchema(): { validate: ValidateFunction; warnings: string[] } {
  if (compiled === undefined) {
    const warnings: string[] = [];
    const record = (...args: unknown[]): void => {
      warnings.push(args.map(String).join(' '));
    };
    const ajv = new Ajv2020({ strict: true, allowUnionTypes: true, allErrors: true,
      logger: { log: () => undefined, warn: record, error: record } });
    const schema = JSON.parse(readFileSync(INDEX_SCHEMA, 'utf8')) as object;
    compiled = { validate: ajv.compile(schema), warnings };
  }
  return compiled;
}

/** The schema errors of an index, as `<pointer> <message>` lines; none when it is valid. */
export function indexSchemaErrors(data: unknown): string[] {
  const { validate } = indexSchema();
  if (validate(data)) return [];
  return (validate.errors ?? []).map((error) =>
    `${error.instancePath === '' ? '/' : error.instancePath} ${error.message ?? error.keyword}`);
}
