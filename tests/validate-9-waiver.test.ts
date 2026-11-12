// Split from tests/validate.test.ts (task-089); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { runCheckPacks } from '../src/check-packs';
import type { ValidateResult } from '../src/validate';

import { writePack } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { NAME, validate, withTree } from './support/validate-harness';

describe('npm run validate: the waiver heuristic\'s review list left out (task-086)', () => {
  const W = (body: string): PackSpec => ({ id: 'stage/w', directives: ['w-rule'],
    extraFiles: { 'directives/w-rule.md': `---\nid: w-rule\nformat: 1\n---\n# w\n${body}\n` } });
  const run = (body: string, hits: number): ValidateResult => {
    let result: ValidateResult | undefined;
    // stage/w has no example and no index entry, so the index may refuse the tree: both runs alike.
    withTree((tree) => writePack(tree, W(body)), (tree) => {
      assert.equal(runCheckPacks(tree).reviews.length, hits, 'the tree holds the hits it should');
      result = validate(['--tree', tree, ...NAME]);
    }, true);
    assert.ok(result !== undefined);
    return result;
  };

  it('gives the same result with and without a hit, and no review line', () => {
    const plain = run('Keep the log.', 0);
    const hit = run('Skip the log.', 1);
    assert.equal(hit.code, plain.code);
    assert.deepEqual(hit.lines, plain.lines);
    assert.ok(!hit.lines.some((line) => line.includes('review:')), hit.lines.join('\n'));
  });
});
