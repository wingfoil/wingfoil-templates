// Split from tests/validate.test.ts (task-089); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { cpSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { runIndex } from '../src/index';
import { runPublish } from '../src/publish';
import { runSite } from '../src/site';
import { mapOverlayPaths } from '../src/validate';

import { REPO_ROOT } from './support/paths';
import {
  TREE, NAME, validate, withTree, replaceIn, OVERLAY, CORE, PUBLICATION_LINE, moveFlow,
} from './support/validate-harness';

describe('npm run validate --overlay (task-046, plan-046 ruling 1)', () => {
  it('runs the secret rules over the overlay\'s files', () => {
    withTree((tree) => {
      moveFlow(tree);
      writeFileSync(join(tree, OVERLAY, 'packs', 'methodology', 'flow', 'CHANGELOG.md'),
        `# Changelog\n\nkey: ${['AK', 'IA', 'ABCDEFGH23456789'].join('')}\n`);
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) =>
        line.startsWith(`${OVERLAY}/packs/methodology/flow/CHANGELOG.md`)),
      result.lines.join('\n'));
    });
  });

  it('names an overlay pack by its path in the tree, never the temporary tree\'s', () => {
    withTree((tree) => {
      moveFlow(tree);
      writeFileSync(join(tree, OVERLAY, 'packs', 'methodology', 'flow', 'workflows',
        'flow-board.yaml'), 'format: 1\nname: [flow-board\n');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) => line.startsWith(`composition ${CORE}: `)
        && line.includes(`${OVERLAY}/packs/methodology/flow`)), result.lines.join('\n'));
      assert.ok(!result.lines.some((line) => line.includes(tmpdir()) && !line.includes(tree)),
        result.lines.join('\n'));
    });
  });

  it('reports a schema failure of an overlay pack.yaml or example.yaml, and skips it', () => {
    const cases: [(tree: string) => void, string][] = [
      [(tree) => replaceIn(join(tree, OVERLAY, 'packs', 'methodology', 'flow', 'pack.yaml'),
        'version: 1.0.0', 'version: 1.0.0\nbogus: 1'),
      `${OVERLAY}/packs/methodology/flow/pack.yaml:`],
      [(tree) => replaceIn(join(tree, CORE), 'title: "Core team"\n', ''), `${CORE}:`],
    ];
    for (const [edit, named] of cases) {
      withTree((tree) => { moveFlow(tree); edit(tree); }, (tree) => {
        const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
        assert.equal(result.code, 1, `${named} ${result.lines.join('\n')}`);
        assert.ok(result.lines.some((line) => line.startsWith(named)
          && line.includes(': schema: ')), `${named} ${result.lines.join('\n')}`);
      });
    }
    withTree((tree) => {
      moveFlow(tree);
      replaceIn(join(tree, CORE), 'title: "Core team"\n', '');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.ok(result.lines.some((line) => line.startsWith(`composition ${CORE}: skipped, `)),
        result.lines.join('\n'));
    });
  });

  it('applies --param to the overlay compositions as to an example', () => {
    withTree((tree) => {
      moveFlow(tree);
      replaceIn(join(tree, CORE), 'packs:', 'parameters:\n  project_name: "Core"\npacks:');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.includes(`composition ${CORE}: --param project_name overrides the `
        + 'value the preset sets'), result.lines.join('\n'));
    });
    withTree((tree) => {
      moveFlow(tree);
      replaceIn(join(tree, OVERLAY, 'packs', 'methodology', 'flow', 'pack.yaml'), 'contents:',
        'parameters:\n  board_name: { type: string, default: "Board", description: "The board" }\n'
        + 'contents:');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--param', 'board_name=Main',
        '--overlay', OVERLAY]);
      assert.ok(!result.lines.some((line) => line.startsWith('--param board_name')),
        result.lines.join('\n'));
    });
  });

  // Catalog pack ids do not nest, so an overlay pack around a tree's pack fails its layout first.
  it('refuses an overlay pack that would hold a pack of the tree', () => {
    withTree((tree) => {
      moveFlow(tree);
      cpSync(join(tree, OVERLAY, 'packs', 'methodology', 'flow'),
        join(tree, OVERLAY, 'packs', 'phase', 'inception'), { recursive: true });
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) =>
        line.startsWith(`${OVERLAY}/packs/phase/inception/pack.yaml: layout: `)
        && line.includes('phase/inception is not a catalog pack id')), result.lines.join('\n'));
    });
  });

  it('counts only the overlay\'s compositions as reaching its packs, not given entries', () => {
    withTree((tree) => {
      moveFlow(tree);
      rmSync(join(tree, OVERLAY, 'compositions', 'delivery-team'), { recursive: true });
      replaceIn(join(tree, CORE), 'methodology/flow@^1', 'base@^1');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY,
        'methodology/flow']);
      assert.ok(result.lines.some((line) => line.startsWith(`${OVERLAY}/packs/methodology/flow`)
        && line.includes('no overlay composition reaches it')), result.lines.join('\n'));
    });
  });

  it('is refused by npm run validate:publication, with or without --evidence', () => {
    const cli = join(REPO_ROOT, 'dist', 'src', 'validate-publication-cli.js');
    for (const extra of [[], ['--evidence']]) {
      const result = spawnSync(process.execPath, [cli, '--tree', TREE, '--overlay', OVERLAY,
        ...extra], { encoding: 'utf8' });
      assert.equal(result.status, 3, result.stderr);
      assert.equal(result.stdout, `${PUBLICATION_LINE}\n`);
    }
  });

  it('maps an overlay pack\'s paths to the overlay, and no other pack\'s', () => {
    const overlay = { merged: '/tmp/m/tree', rel: OVERLAY, packs: ['methodology/flow'] };
    assert.equal(mapOverlayPaths('/tmp/m/tree/packs/methodology/flow/a.yaml: x; '
      + '/tmp/m/tree/packs/methodology/flow-x/b.yaml: y', '/repo', overlay),
    `/repo/${OVERLAY}/packs/methodology/flow/a.yaml: x; /repo/packs/methodology/flow-x/b.yaml: y`);
    assert.equal(mapOverlayPaths('see packs/methodology/flow. And packs/methodology/flow-x.',
      '/repo', overlay),
    `see ${OVERLAY}/packs/methodology/flow. And packs/methodology/flow-x.`);
  });

  it('leaves --overlay to validate alone: publish:pack, index and site refuse it', () => {
    assert.equal(runPublish(['--pack', 'base', '--overlay', OVERLAY]).code, 3);
    assert.equal(runIndex(['--overlay', OVERLAY]).code, 3);
    assert.equal(runSite(['--overlay', OVERLAY]).code, 3);
  });
});
