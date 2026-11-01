// The index's reader of a pack's files as written, before substitution (task-070, plan-057).
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { IndexInputError, packYamlIn } from '../src/index-data';
import type { TreeSource } from '../src/index-source';
import { warningsOf } from './support/warnings';

function source(files: Record<string, string>): TreeSource {
  return { label: 'tree', read: (path) => files[path] };
}

const UNQUOTED = 'format: 1\ntypes:\n  task:\n    states:\n      limits:\n        in-progress: {{x}}\n';

describe('packYamlIn (task-070)', () => {
  it('reads an unquoted {{name}} limit with no Node.js warning, its value as before', async () => {
    let data: unknown;
    const warnings = await warningsOf(() => {
      data = packYamlIn(source({ 'f.yaml': UNQUOTED }), 'f.yaml');
    });
    assert.deepEqual(warnings, []);
    assert.deepEqual(data, { format: 1, types: { task: { states: { limits:
      { 'in-progress': { '{ x }': null } } } } } });
  });

  it('refuses a file that does not parse, and one that is not a mapping, as before', () => {
    const files = source({ 'bad.yaml': 'a: [\n', 'list.yaml': '- a\n' });
    assert.throws(() => packYamlIn(files, 'bad.yaml'),
      (error: unknown) => error instanceof IndexInputError && /does not parse/.test(error.message));
    assert.throws(() => packYamlIn(files, 'list.yaml'),
      (error: unknown) => error instanceof IndexInputError
        && /is not a mapping/.test(error.message));
    assert.equal(packYamlIn(files, 'missing.yaml'), undefined);
  });
});
