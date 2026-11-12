// Split from tests/validate.test.ts (task-089); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { writePack } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { TREE, NAME, validate, withTree } from './support/validate-harness';

describe('npm run validate: both legs of a conditional part (spec-001 §15, plan-039 R2, R5, R6)',
  () => {
    const FLOW_CORE = 'tests/fixtures/examples/flow/core-team/example.yaml';
    const FLOW_DELIVERY = 'tests/fixtures/examples/flow/delivery-team/example.yaml';
    /** governance/x: a conditional part, and no methodology to give its leg with software. */
    const GOVERNANCE: PackSpec = { id: 'governance/x', workflows: ['x'],
      manifest: { conditional: [{ with: 'software@^1', contents: { workflows: ['x-ship'] } }] },
      extraFiles: { 'workflows/x-ship.yaml': 'format: 1\nname: x-ship\nkind: sub\n' } };

    it('composes the other leg of each composition holding a conditional part', () => {
      const result = validate(['--tree', TREE, ...NAME]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      for (const label of [`${FLOW_CORE}[+software]`, `${FLOW_DELIVERY}[-software]`]) {
        assert.ok(result.lines.some((line) => line.startsWith(`composition ${label}: composed `
          + 'twice, ')), `${label}: ${result.lines.join('\n')}`);
        assert.ok(result.lines.some((line) =>
          line.startsWith(`matrix ${label} wingfoil@0.2.2 workflow list: pass`)), label);
      }
      assert.ok(!result.lines.some((line) => /golden\.yaml\[/.test(line)),
        'the golden preset holds no conditional part');
    });

    it('skips the leg with software of a composition without a methodology', () => {
      withTree((tree) => writePack(tree, GOVERNANCE), (tree) => {
        const result = validate(['--tree', tree, ...NAME, 'governance/x']);
        assert.ok(result.lines.includes('matrix entries[+software]: skipped, no methodology'),
          result.lines.join('\n'));
      }, true);
    });

    it('drops, in the leg without software, the values a preset sets for absent packs (R5)', () => {
      withTree((tree) => {
        writeFileSync(join(tree, 'presets', 'with-software.yaml'), 'format: 1\nid: with-software\n'
          + 'title: "With software"\ndescription: "Flow with the life cycle."\npacks:\n'
          + '  - software@^1\n  - methodology/flow@^1\nparameters:\n'
          + '  adr_path: "docs/adr/{id}.md"\n');
        const catalog = join(tree, 'catalog.yaml');
        writeFileSync(catalog, readFileSync(catalog, 'utf8').replace('presets:\n',
          'presets:\n  - { id: with-software, path: presets/with-software.yaml }\n'));
      }, (tree) => {
        const result = validate(['--tree', tree, ...NAME]);
        assert.equal(result.code, 0, result.lines.join('\n'));
        assert.ok(result.lines.some((line) => line.startsWith('composition '
          + 'presets/with-software.yaml[-software]: composed twice, ')
          && line.endsWith(', dropped adr_path')), result.lines.join('\n'));
      });
    });

    it('fails a publication run where a conditional part has no leg with software that ran (R6)',
      () => {
        withTree((tree) => writePack(tree, GOVERNANCE), (tree) => {
          const result = validate(['--tree', tree, ...NAME, 'governance/x'],
            { mode: 'publication' });
          assert.equal(result.code, 1, result.lines.join('\n'));
          assert.ok(result.lines.includes('matrix: governance/x\'s entry with software has no '
            + 'composition holding software that ran (plan-039 R6, spec-001 §15)'),
          result.lines.join('\n'));
        }, true);
      });
  });
