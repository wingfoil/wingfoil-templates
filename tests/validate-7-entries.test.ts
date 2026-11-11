// Split from tests/validate.test.ts (task-089); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { before, describe, it } from 'node:test';

import type { ValidateResult } from '../src/validate';

import { writePack } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { NAME, GOLDEN_LEGS, validate, withTree, replaceIn } from './support/validate-harness';

describe('npm run validate: the legs per entry (spec-001 §15, dl-025 D6, task-087)', () => {
  /** blueprint/api: a tension naming stage/mvp, so stage/mvp's entry with it is a bridge. */
  const API: PackSpec = { id: 'blueprint/api', format: 2, directives: ['api'],
    tensions: [{ pack: 'stage/mvp@^1', resolution: 'Keep the API frozen.' }],
    manifest: { parameters: { api_style: { type: 'string', default: 'rest',
      description: 'The API style.' } } } };
  /** stage/mvp: two entries, with blueprint/api (a bridge) and with team-mode/agent-first. */
  const MVP: PackSpec = { id: 'stage/mvp', format: 2, directives: ['mvp'],
    conditional: [{ with: 'blueprint/api@^1', directives: ['mvp-api'] },
      { with: 'team-mode/agent-first@^1', directives: ['mvp-team'] }] };
  /** A stage pack with one entry with the given pack. */
  const stageWith = (id: string, entry: string): PackSpec => ({ id, format: 2,
    directives: [id.slice(id.indexOf('/') + 1)],
    conditional: [{ with: entry, directives: [`${id.slice(id.indexOf('/') + 1)}-with`] }] });
  /** A governance pack with an entry per given pack, in that order. */
  const governing = (id: string, withs: string[]): PackSpec => ({ id, format: 2,
    conditional: withs.map((entry, index) => ({ with: entry,
      directives: [`${id.slice(id.indexOf('/') + 1)}-${index}`] })) });
  const KANBAN_ENTRY = 'methodology/kanban@^1';
  /** Each case a preset of one tree, so that one run per mode covers them all (G12). */
  const PRESETS: [string, string[], string][] = [
    ['d6-neither', [KANBAN_ENTRY, 'stage/mvp@^1'], '{}'],
    ['d6-one', [KANBAN_ENTRY, 'blueprint/api@^1', 'stage/mvp@^1'], '{}'],
    ['d6-both', [KANBAN_ENTRY, 'blueprint/api@^1', 'team-mode/agent-first@^1', 'stage/mvp@^1'],
      '\n  api_style: graphql'],
    ['d6-lean', ['stage/lean-aware@^1'], '{}'],
    ['d6-required', [KANBAN_ENTRY, 'governance/needs-api@^1', 'team-mode/agent-first@^1',
      'stage/mvp@^1'], '{}'],
    ['d6-range', [KANBAN_ENTRY, 'stage/far@^1'], '{}'],
    ['d6-orders', [KANBAN_ENTRY, 'governance/g1@^1', 'governance/g2@^1'], '{}'],
    ['d6-methods', [KANBAN_ENTRY, 'stage/two-methods@^1'], '{}'],
    ['d6-keyed', [KANBAN_ENTRY, 'stage/keyed@^1'], '{}'],
  ];
  function d6Tree(tree: string): void {
    for (const spec of [API, MVP, stageWith('stage/lean-aware', 'phase/inception/lean@^1'),
      { id: 'governance/needs-api', requires: ['base@^1', 'blueprint/api@^1'],
        directives: ['needs-api'] },
      stageWith('stage/far', 'team-mode/agent-first@^2'),
      governing('governance/g1', ['blueprint/api@^1', 'blueprint/web-service@^1']),
      governing('governance/g2', ['blueprint/web-service@^1', 'blueprint/api@^1']),
      stageWith('stage/two-methods', 'methodology/flow@^1'),
      { id: 'blueprint/keyed', directives: ['keyed'], manifest: { parameters: {
        api_key: { type: 'string', description: 'The key.' } } } },
      stageWith('stage/keyed', 'blueprint/keyed@^1')]) writePack(tree, spec);
    for (const [id, packs, parameters] of PRESETS) {
      writeFileSync(join(tree, 'presets', `${id}.yaml`), `format: 1\nid: ${id}\n`
        + `title: "${id}"\ndescription: "D6's coverage."\npacks:\n`
        + packs.map((pack) => `  - ${pack}\n`).join('') + `parameters: ${parameters}\n`);
      replaceIn(join(tree, 'catalog.yaml'), 'presets:\n',
        `presets:\n  - { id: ${id}, path: presets/${id}.yaml }\n`);
    }
  }
  let selfTest: ValidateResult | undefined;
  let publication: ValidateResult | undefined;
  before(() => {
    withTree(d6Tree, (tree) => {
      selfTest = validate(['--tree', tree, ...NAME]);
      publication = validate(['--tree', tree, ...NAME], { mode: 'publication' });
    }, true);
  });
  const run = (mode: 'self-test' | 'publication' = 'self-test'): ValidateResult => {
    const result = mode === 'self-test' ? selfTest : publication;
    assert.ok(result !== undefined);
    return result;
  };
  const report = (): string => run().lines.join('\n');
  /** The composition labels of one preset, in their order, from `composition <label>: …`. */
  const composed = (prefix: string, result = run()): string[] => result.lines
    .filter((line) => line.startsWith(`composition ${prefix}`))
    .map((line) => line.slice('composition '.length, line.indexOf(': ')));
  const preset = (id: string): string => `presets/${id}.yaml`;

  it('derives the full target, then each entry\'s pack left out in turn, by label and order',
    () => {
      assert.deepEqual(['d6-both', 'd6-neither', 'd6-one'].flatMap((id) => composed(preset(id))), [
        'presets/d6-both.yaml', 'presets/d6-both.yaml[-blueprint/api]',
        'presets/d6-both.yaml[-team-mode/agent-first]',
        'presets/d6-neither.yaml',
        'presets/d6-neither.yaml[+blueprint/api][+team-mode/agent-first]',
        'presets/d6-neither.yaml[+team-mode/agent-first]',
        'presets/d6-neither.yaml[+blueprint/api]',
        'presets/d6-one.yaml', 'presets/d6-one.yaml[+team-mode/agent-first]',
        'presets/d6-one.yaml[+team-mode/agent-first][-blueprint/api]',
      ], report());
      for (const id of ['d6-both', 'd6-neither', 'd6-one']) {
        for (const line of run().lines.filter((each) =>
          each.startsWith(`composition ${preset(id)}`))) {
          assert.match(line, /: composed twice, /, line);
        }
      }
      assert.ok(run().lines.some((line) => line.startsWith(
        'composition presets/d6-both.yaml[-blueprint/api]: composed twice, ')
        && line.endsWith(', dropped api_style')), report());
      // The golden tree's own legs are today's (task-032).
      assert.deepEqual(composed('tests/fixtures/examples/'), GOLDEN_LEGS);
    });

  it('skips a leg adding a pack that needs software when it holds no methodology', () => {
    assert.ok(run().lines.includes(
      'matrix presets/d6-lean.yaml[+phase/inception/lean]: skipped, no methodology'), report());
    assert.deepEqual(composed(preset('d6-lean')), [preset('d6-lean')], report());
  });

  it('derives no leg leaving out a pack another pack requires unconditionally', () => {
    assert.deepEqual(composed(preset('d6-required')), [preset('d6-required'),
      `${preset('d6-required')}[-team-mode/agent-first]`], report());
  });

  it('fails a leg whose added pack does not satisfy its entry\'s range (spec-001 §6.5)', () => {
    assert.equal(run().code, 1, report());
    assert.ok(run().lines.some((line) =>
      line.startsWith(`composition ${preset('d6-range')}[+team-mode/agent-first]: `)
      && line.includes('does not satisfy ^2')), report());
  });

  it('runs one leg per target when two packs name the same packs in opposite orders', () => {
    const orders = preset('d6-orders');
    assert.deepEqual(composed(orders), [orders,
      `${orders}[+blueprint/api][+blueprint/web-service]`, `${orders}[+blueprint/web-service]`,
      `${orders}[+blueprint/api]`], report());
  });

  it('skips a target the format forbids, with the resolver\'s reason (ruling point 3)', () => {
    const line = run().lines.find((each) =>
      each.startsWith(`matrix ${preset('d6-methods')}[+methodology/flow]: skipped, `));
    assert.ok(line !== undefined && line.includes('takes one pack'), report());
    assert.deepEqual(composed(preset('d6-methods')), [preset('d6-methods')], report());
  });

  it('skips a leg adding a pack whose parameter has no default and no value (ruling point 4)',
    () => {
      assert.ok(run().lines.includes(
        `matrix ${preset('d6-keyed')}[+blueprint/keyed]: skipped, api_key has no value`),
      report());
    });

  it('fails a publication where an entry\'s pack is held by no composition that ran (R6), and '
    + 'passes a pack whose entries\' packs are held', () => {
    const lines = run('publication').lines;
    assert.ok(lines.includes('matrix: stage/two-methods\'s entry with methodology/flow has no '
      + 'composition holding methodology/flow that ran (plan-039 R6, spec-001 §15)'),
    lines.join('\n'));
    assert.ok(!lines.some((line) => line.startsWith('matrix: stage/mvp')), lines.join('\n'));
  });
});
