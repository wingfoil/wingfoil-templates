// Split from tests/validate.test.ts (task-089); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { writePack } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { ENTRIES, NAME, validate, withTree } from './support/validate-harness';

describe('npm run validate: the tensions\' notices (spec-001 §17 step 8, task-084)', () => {
  const CAREFUL: PackSpec = { id: 'governance/careful', format: 2, directives: ['careful'],
    tensions: [{ pack: 'stage/production@^1', resolution: 'Release only\nafter the review.' }] };

  it('prints each notice after the composition\'s line, and none without a tension', () => {
    withTree((tree) => writePack(tree, CAREFUL), (tree) => {
      const result = validate(['--tree', tree, ...NAME, ...ENTRIES, 'governance/careful']);
      const at = result.lines.findIndex((line) =>
        line.startsWith('composition entries: composed twice, '));
      assert.ok(at >= 0, result.lines.join('\n'));
      assert.equal(result.lines[at + 1],
        '  notice: governance/careful and stage/production: Release only after the review.');
      assert.ok(!result.lines.some((line, index) => index !== at + 1
        && line.includes('notice:')), result.lines.join('\n'));
    }, true);
  });
});
