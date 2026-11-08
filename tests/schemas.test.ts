import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import Ajv2020 from 'ajv/dist/2020';

import {
  FROZEN_KINDS, SCHEMA_KINDS, loadSchemas, readsFormatOne, schemaFile,
} from '../src/schemas';
import { parseYaml } from '../src/yaml-load';
import { FIXTURES, REPO_ROOT } from './support/paths';

/** task-082's base commit: the schemas of format 1, as they were before format 2 (Acceptance 2). */
const BASE = '493651fe3d57e40e23523ad01350c453085ab949';
const ID_ROOT = 'https://github.com/wingfoil/wingfoil-templates/';

/** The nine schema files, relative to the root (task-082 Acceptance 5). */
const SCHEMA_FILES = [
  'schema/catalog.schema.json', 'schema/catalog.v1.schema.json', 'schema/compat.schema.json',
  'schema/pack.schema.json', 'schema/pack.v1.schema.json', 'schema/preset.schema.json',
  'schema/transition.schema.json',
  'index/catalog-index.schema.json', 'index/catalog-index.v1.schema.json',
];

/** Each frozen copy and the file it was copied from at the base commit. */
const FROZEN = [
  ['schema/pack.v1.schema.json', 'schema/pack.schema.json', 'spec-001 §5'],
  ['schema/catalog.v1.schema.json', 'schema/catalog.schema.json', 'spec-001 §5'],
  ['index/catalog-index.v1.schema.json', 'index/catalog-index.schema.json', 'spec-002 §3.3'],
] as const;

const schemas = loadSchemas();

function fixtures(kind: string, group: 'valid' | 'invalid'): string[] {
  const dir = join(FIXTURES, 'schema', kind, group);
  return readdirSync(dir).sort().map((name) => join(dir, name));
}

/** `# expect: <keyword> <instance path>`, the first line of an invalid fixture. */
function expectation(text: string): { keyword: string; instancePath: string } {
  const match = /^# expect: (.+) (\/\S*)\n/.exec(text);
  assert.ok(match, 'invalid fixture without an expect line');
  const [, keyword = '', path = ''] = match;
  return { keyword, instancePath: path === '/' ? '' : path };
}

describe('loadSchemas', () => {
  it('compiles the five schemas in strict mode with no warning', () => {
    const kinds = [...SCHEMA_KINDS].sort();
    assert.deepEqual(kinds, ['catalog', 'compat', 'pack', 'preset', 'transition']);
    assert.deepEqual(schemas.warnings, []);
  });

  it('compiles each of the nine schema files on its own, in strict mode, with no warning', () => {
    const listed = readdirSync(join(REPO_ROOT, 'schema')).filter((name) => name.endsWith('.json'))
      .map((name) => `schema/${name}`).sort();
    assert.deepEqual(listed, SCHEMA_FILES.filter((file) => file.startsWith('schema/')));
    for (const file of SCHEMA_FILES) {
      assert.ok(existsSync(join(REPO_ROOT, file)), `${file} exists`);
      const warnings: string[] = [];
      const record = (...args: unknown[]): void => {
        warnings.push(args.map(String).join(' '));
      };
      const ajv = new Ajv2020({ strict: true, allowUnionTypes: true, allErrors: true,
        logger: { log: () => undefined, warn: record, error: record } });
      ajv.compile(JSON.parse(readFileSync(join(REPO_ROOT, file), 'utf8')) as object);
      assert.deepEqual(warnings, [], file);
    }
  });

  it('drops the if meta-errors and keeps the then error', () => {
    const errors = schemas.validate('pack', {
      format: 1, id: 'base', axis: 'methodology', name: 'base', title: 'B', description: 'd',
      version: '1.0.0', formats: {}, requires_capabilities: [], contents: {},
    });
    assert.ok(errors.length > 0);
    assert.ok(errors.every((error) => error.keyword !== 'if'), JSON.stringify(errors));
  });

  it('names the missing or extra key, at the mapping that holds it', () => {
    const data = { kinds: {}, capabilities: {}, releases: [], extra: 1 };
    const errors = schemas.validate('compat', data);
    const required = errors.find((error) => error.keyword === 'required');
    const additional = errors.find((error) => error.keyword === 'additionalProperties');
    assert.equal(required?.instancePath, '');
    assert.match(required?.message ?? '', /'format'/);
    assert.equal(additional?.instancePath, '');
    assert.match(additional?.message ?? '', /\(extra\)$/);
  });
});

describe('format 1, frozen (task-082 Acceptance 2)', () => {
  for (const [copy, source, section] of FROZEN) {
    it(`${copy} equals ${source} at the base commit but its $id and $comment`, () => {
      assert.ok(existsSync(join(REPO_ROOT, copy)), `${copy} exists`);
      const frozen = JSON.parse(readFileSync(join(REPO_ROOT, copy), 'utf8')) as
        Record<string, unknown>;
      const before = JSON.parse(execFileSync('git', ['show', `${BASE}:${source}`],
        { cwd: REPO_ROOT, encoding: 'utf8' })) as Record<string, unknown>;
      assert.equal(frozen['$id'], `${ID_ROOT}${copy}`);
      assert.ok(String(frozen['$comment']).startsWith(`Format 1, frozen (${section})`), copy);
      const rest = (schema: Record<string, unknown>): string[] => Object.keys(schema)
        .filter((key) => key !== '$id' && key !== '$comment');
      assert.deepEqual(rest(frozen), rest(before), 'the same keys, in the same order');
      for (const key of rest(before)) assert.deepEqual(frozen[key], before[key], key);
    });
  }
});

describe('the schema by format (task-082 Acceptance 5)', () => {
  it('reads format 1 only from a format of 1', () => {
    assert.equal(readsFormatOne({ format: 1 }), true);
    for (const data of [{ format: 2 }, { format: 3 }, {}, { format: '1' }, null, [], 1]) {
      assert.equal(readsFormatOne(data), false, JSON.stringify(data));
    }
  });

  it('names the v1 file of a frozen kind for format 1, the current one otherwise', () => {
    assert.deepEqual([...FROZEN_KINDS], ['pack', 'catalog']);
    assert.equal(schemaFile('pack', { format: 1 }), 'pack.v1.schema.json');
    assert.equal(schemaFile('catalog', { format: 1 }), 'catalog.v1.schema.json');
    assert.equal(schemaFile('pack', { format: 2 }), 'pack.schema.json');
    assert.equal(schemaFile('catalog', {}), 'catalog.schema.json');
    assert.equal(schemaFile('compat', { format: 1 }), 'compat.schema.json');
  });

  it('reports a missing or unknown format against the current schema', () => {
    assert.equal(schemaFile('pack', { format: 3 }), 'pack.schema.json');
    const errors = schemas.validate('pack', { format: 3 });
    assert.ok(errors.some((error) => error.keyword === 'const' && error.instancePath === '/format'),
      JSON.stringify(errors));
  });
});

for (const kind of SCHEMA_KINDS) {
  describe(`schema ${kind}`, () => {
    for (const file of fixtures(kind, 'valid')) {
      it(`accepts ${file.slice(FIXTURES.length + 1)}`, () => {
        const data = parseYaml(readFileSync(file, 'utf8'), file).data;
        assert.deepEqual(schemas.validate(kind, data), []);
      });
    }
    for (const file of fixtures(kind, 'invalid')) {
      it(`rejects ${file.slice(FIXTURES.length + 1)}`, () => {
        const text = readFileSync(file, 'utf8');
        const errors = schemas.validate(kind, parseYaml(text, file).data);
        const expected = expectation(text);
        assert.ok(
          errors.some((error) => error.keyword === expected.keyword
            && error.instancePath === expected.instancePath),
          `expected ${JSON.stringify(expected)} among ${JSON.stringify(errors)}`,
        );
      });
    }
  });
}
