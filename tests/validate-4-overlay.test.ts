// Split from tests/validate.test.ts (task-089); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { cpSync, mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import {
  TREE, NAME, NEWEST, validate, withTree, replaceIn, OVERLAY, CORE, DELIVERY, PUBLICATION_LINE,
  writeComposition, moveFlow, withoutMethodology, treeLines,
} from './support/validate-harness';

describe('npm run validate --overlay (task-046, plan-046 ruling 1)', () => {
  it('composes the overlay\'s compositions after the tree\'s, in id order, with their legs', () => {
    withTree(moveFlow, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      const composed = result.lines.filter((line) => line.startsWith('composition '));
      const labels = [CORE, `${CORE}[+software]`, DELIVERY, `${DELIVERY}[-software]`];
      assert.deepEqual(composed.slice(-4).map((line) => line.slice('composition '.length,
        line.indexOf(': '))), labels, result.lines.join('\n'));
      for (const line of composed.slice(-4)) assert.match(line, /: composed twice, /);
      // The golden preset and its eight examples left, then the overlay's four.
      assert.ok(result.lines.includes('compositions: 13'), result.lines.join('\n'));
      for (const label of labels) {
        assert.ok(result.lines.includes(
          `matrix ${label} wingfoil@${NEWEST} workflow list: pass (self-test)`), label);
      }
      const index = result.lines.findIndex((line) => line.startsWith('index:'));
      const overlay = result.lines.findIndex((line) => line.startsWith('overlay: '));
      assert.ok(index >= 0 && overlay === index + 1, result.lines.join('\n'));
      assert.match(result.lines[overlay] ?? '', /^overlay: checked \d+ files, 0 problems$/);
    });
  });

  it('leaves the tree\'s lines as a run without the overlay has them', () => {
    withTree(moveFlow, (tree) => {
      const without = validate(['--tree', tree, ...NAME]);
      const withOverlay = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(without.code, 0, without.lines.join('\n'));
      assert.deepEqual(treeLines(withOverlay), treeLines(without));
    });
  });

  it('keeps the exemption line of a tree with no methodology, whose overlay holds one', () => {
    withTree(withoutMethodology, (tree) => {
      const without = validate(['--tree', tree, ...NAME]);
      assert.equal(without.code, 0, without.lines.join('\n'));
      assert.ok(without.lines.some((line) => /^lint: checked \d+ files, 0 problems$/.test(line)),
        without.lines.join('\n'));
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.deepEqual(treeLines(result), treeLines(without));
      assert.ok(result.lines.some((line) => line.startsWith(`composition ${DELIVERY}: composed `
        + 'twice, ')), result.lines.join('\n'));
    });
  });

  it('refuses an overlay in publication mode, before any check', () => {
    for (const argv of [['--overlay', OVERLAY], ['--overlay', 'missing', '--tree', TREE]]) {
      const result = validate(argv, { mode: 'publication' });
      assert.equal(result.code, 3);
      assert.deepEqual(result.lines, [PUBLICATION_LINE]);
    }
  });

  it('takes one overlay, under tests/fixtures/ and outside tests/fixtures/examples/', () => {
    withTree(moveFlow, (tree) => {
      const outside = mkdtempSync(join(tmpdir(), 'overlay-outside-'));
      try {
        mkdirSync(join(tree, 'elsewhere'));
        symlinkSync(outside, join(tree, 'tests', 'fixtures', 'link'));
        const usage: [string[], RegExp][] = [
          [['--overlay', OVERLAY, '--overlay', OVERLAY], /^--overlay is given more than once$/],
          [['--overlay', 'elsewhere'], /^--overlay elsewhere: not under tests\/fixtures\/$/],
          [['--overlay', 'tests/fixtures/examples/base'],
            /^--overlay tests\/fixtures\/examples\/base: under tests\/fixtures\/examples\//],
          [['--overlay', 'tests/fixtures/link'],
            /^--overlay tests\/fixtures\/link: not under tests\/fixtures\/$/],
        ];
        for (const [argv, line] of usage) {
          const result = validate(['--tree', tree, ...NAME, ...argv]);
          assert.equal(result.code, 3, `${argv.join(' ')}: ${result.lines.join('\n')}`);
          assert.match(result.lines.join('\n'), line);
        }
        const missing = validate(['--tree', tree, ...NAME, '--overlay', 'tests/fixtures/none']);
        assert.equal(missing.code, 2);
        assert.deepEqual(missing.lines, ['tests/fixtures/none: not a directory']);
        const absolute = validate(['--tree', tree, ...NAME, '--overlay', join(tree, OVERLAY)]);
        assert.equal(absolute.code, 0, absolute.lines.join('\n'));
      } finally {
        rmSync(outside, { recursive: true, force: true });
      }
    });
  });

  it('reports what the overlay\'s layout does not allow', () => {
    const cases: [(tree: string) => void, string][] = [
      [(tree) => writeFileSync(join(tree, OVERLAY, 'notes.md'), 'x\n'), `${OVERLAY}/notes.md`],
      [(tree) => writeFileSync(join(tree, OVERLAY, 'packs', 'stray.txt'), 'x\n'),
        `${OVERLAY}/packs/stray.txt`],
      [(tree) => writeFileSync(join(tree, OVERLAY, 'compositions', 'x.yaml'), 'x: 1\n'),
        `${OVERLAY}/compositions/x.yaml`],
      [(tree) => writeFileSync(join(tree, OVERLAY, 'compositions', 'core-team', 'extra.md'), 'x\n'),
        `${OVERLAY}/compositions/core-team/extra.md`],
      [(tree) => replaceIn(join(tree, CORE), 'id: core-team', 'id: other-team'), CORE],
      [(tree) => replaceIn(join(tree, CORE), 'packs:', 'profile: "a profile"\npacks:'), CORE],
    ];
    for (const [edit, named] of cases) {
      withTree((tree) => { moveFlow(tree); edit(tree); }, (tree) => {
        const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
        assert.equal(result.code, 1, `${named}: ${result.lines.join('\n')}`);
        assert.ok(result.lines.some((line) => line.startsWith(named)), `${named}: `
          + result.lines.join('\n'));
      });
    }
  });

  it('never lets an overlay pack shadow a pack of the tree', () => {
    withTree((tree) => {
      moveFlow(tree);
      cpSync(join(tree, 'packs', 'methodology', 'kanban'),
        join(tree, OVERLAY, 'packs', 'methodology', 'kanban'), { recursive: true });
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) => line.startsWith(`${OVERLAY}/packs/methodology/kanban`)
        && line.includes(' packs/methodology/kanban')), result.lines.join('\n'));
    });
  });

  it('reports an overlay pack no composition reaches, and an overlay with no composition', () => {
    withTree((tree) => {
      moveFlow(tree);
      rmSync(join(tree, OVERLAY, 'compositions', 'delivery-team'), { recursive: true });
      replaceIn(join(tree, CORE), 'methodology/flow@^1', 'base@^1');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.some((line) => line.startsWith(`${OVERLAY}/packs/methodology/flow`)
        && line.includes('no overlay composition reaches it')), result.lines.join('\n'));
    });
    withTree((tree) => {
      moveFlow(tree);
      rmSync(join(tree, OVERLAY, 'compositions'), { recursive: true });
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--overlay', OVERLAY]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.includes('overlay: no composition'), result.lines.join('\n'));
    });
  });

  it('checks the overlay compositions\' values and skips the ones it reports', () => {
    const cases: [string, string][] = [
      ['an undeclared parameter', 'parameters:\n  no_such_parameter: "x"\n'],
      ['a value of the wrong YAML type', 'parameters:\n  wip_limit: "3"\n'],
    ];
    for (const [what, parameters] of cases) {
      withTree((tree) => {
        moveFlow(tree);
        // kanban stays in the tree: an overlay composition may name the tree's packs.
        writeComposition(tree, 'core-team', 'format: 1\nid: core-team\ntitle: "Core team"\n'
          + 'description: "A fictional team on a board."\npacks:\n  - methodology/kanban@^1\n'
          + parameters);
      }, (tree) => {
        const result = validate(['--tree', tree, ...NAME, '--param', 'unknown_name=1',
          '--overlay', OVERLAY]);
        assert.equal(result.code, 1, `${what}: ${result.lines.join('\n')}`);
        assert.ok(result.lines.some((line) => line.startsWith(`${CORE}:`)), what);
        assert.ok(result.lines.some((line) => line.startsWith(`composition ${CORE}: skipped, `)),
          `${what}: ${result.lines.join('\n')}`);
        assert.ok(result.lines.includes(`matrix ${CORE}: skipped`), what);
        assert.ok(!result.lines.some((line) => line.startsWith('--param unknown_name')),
          `${what}: the --param names stay unjudged`);
      });
    }
  });
});
