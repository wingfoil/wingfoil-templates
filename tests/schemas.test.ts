import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { SCHEMA_KINDS, loadSchemas } from '../src/schemas';
import { parseYaml } from '../src/yaml-load';
import { FIXTURES } from './support/paths';

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
