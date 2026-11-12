// Split from tests/validate.test.ts (task-089); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import {
  chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { runIndex } from '../src/index';
import { TREE, NAME, validate, withTree, replaceIn } from './support/validate-harness';

describe('npm run validate', () => {
  it('fails when a pack.yaml, a fragment, a workflow or catalog.yaml changes without the index '
    + '(CB-5)', () => {
    const edits: [string[], string, string][] = [
      [['packs', 'methodology', 'kanban', 'pack.yaml'], 'WIP limit of', 'The WIP limit of'],
      [['packs', 'base', 'fragments', 'roles.yaml'], 'developer: [base-rules, testing]',
        'developer: [testing, base-rules]\n  reviewer: [base-rules]'],
      [['packs', 'methodology', 'kanban', 'workflows', 'replenishment.yaml'], 'name: pick',
        'name: choose'],
      [['catalog.yaml'], 'presets:\n  - { id: golden, path: presets/golden.yaml }\n',
        'presets: []\n'],
    ];
    for (const [path, from, to] of edits) {
      const dir = mkdtempSync(join(tmpdir(), 'validate-index-'));
      try {
        const tree = join(dir, 'tree');
        cpSync(TREE, tree, { recursive: true });
        replaceIn(join(tree, ...path), from, to);
        const stale = validate(['--tree', tree, ...NAME]);
        assert.equal(stale.code, 1, path.join('/'));
        assert.ok(stale.lines.some((line) => /^compositions: /.test(line)), 'later steps run');
        assert.ok(stale.lines.some((line) => / not up to date: run npm run index$/.test(line)),
          stale.lines.join('\n'));
        assert.equal(runIndex(['--tree', tree]).code, 0);
        const fresh = validate(['--tree', tree, ...NAME]);
        assert.equal(fresh.code, 0, `${path.join('/')}\n${fresh.lines.join('\n')}`);
      } finally {
        rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  it('skips an example the lint reports, and composes the others (task-022)', () => {
    withTree((tree) => replaceIn(join(tree, 'tests', 'fixtures', 'examples', 'kanban',
      'small-board', 'example.yaml'), 'id: small-board', 'id: other'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.includes('composition tests/fixtures/examples/kanban/small-board/'
        + 'example.yaml: skipped, the lint reports it'), result.lines.join('\n'));
      assert.ok(result.lines.includes('matrix tests/fixtures/examples/kanban/small-board/'
        + 'example.yaml: skipped'));
      assert.ok(result.lines.includes('compositions: 12'));
    });
  });

  it('skips an orphan example, in path order after the presets (task-022)', () => {
    withTree((tree) => {
      for (const dir of ['ghost/x', 'kanban/y']) {
        const file = join(tree, 'tests', 'fixtures', 'examples', ...dir.split('/'), 'example.yaml');
        mkdirSync(join(file, '..'), { recursive: true });
        writeFileSync(file, readFileSync(join(tree, 'tests', 'fixtures', 'examples', 'kanban',
          'small-board', 'example.yaml'), 'utf8').replace('id: small-board',
          `id: ${dir.split('/')[1] ?? ''}`));
      }
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      const compositions = result.lines.filter((line) => line.startsWith('composition '));
      assert.deepEqual(compositions.map((line) => line.slice(0, line.indexOf(':'))), [
        'composition presets/golden.yaml',
        ...['agent-first/agent-team', 'base/core-only', 'base/kanban-team', 'flow/core-team',
          'flow/delivery-team', 'ghost/x', 'kanban/small-board', 'kanban/y', 'lean/new-product',
          'production/live-service', 'software/delivery-team', 'web-service/orders-api']
          .map((example) => `composition tests/fixtures/examples/${example}/example.yaml`)
          .flatMap((label) => [label,
            ...label.includes('/flow/core-team/') ? [`${label}[+software]`] : [],
            ...label.includes('/flow/delivery-team/') ? [`${label}[-software]`] : []]),
      ]);
      for (const orphan of ['ghost/x', 'kanban/y']) {
        assert.ok(result.lines.includes(`composition tests/fixtures/examples/${orphan}/`
          + 'example.yaml: skipped, the lint reports it'), result.lines.join('\n'));
      }
      assert.ok(result.lines.includes('compositions: 13'));
    }, true);
  });

  it('skips the examples of a pack whose pack.yaml fails its schema (task-022)', () => {
    withTree((tree) => replaceIn(join(tree, 'packs', 'methodology', 'kanban', 'pack.yaml'),
      'format: 1', 'format: 99'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.ok(result.lines.includes('composition tests/fixtures/examples/kanban/small-board/'
        + 'example.yaml: skipped, the lint reports it'), result.lines.join('\n'));
    }, true);
  });

  it('exits 1 on a preset whose packs do not resolve', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'stage/production@^1',
      'stage/production@^2'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => /presets\/golden\.yaml.*stage\/production/.test(line)));
    });
  });

  it('exits 1 on a determinism mismatch, through the report', () => {
    const result = validate(['--tree', TREE, ...NAME],
      { compare: () => ['.wingfoil/dna.yaml: the bytes differ'] });
    assert.equal(result.code, 1);
    assert.ok(result.lines.some((line) =>
      /presets\/golden\.yaml: not deterministic: \.wingfoil\/dna\.yaml: the bytes differ/
        .test(line)));
    assert.ok(result.lines.includes('matrix presets/golden.yaml: skipped'), result.lines.join('\n'));
  });

  it('exits 1 on a --param no composition declares', () => {
    const result = validate(['--tree', TREE, ...NAME, '--param', 'nope=1']);
    assert.equal(result.code, 1);
    assert.ok(result.lines.some((line) => /nope/.test(line)));
  });

  it('exits 2 on a tree that does not exist', () => {
    assert.equal(validate(['--tree', join(TREE, 'nope')]).code, 2);
  });

  it('does not claim a --param is undeclared when a composition could not be read', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'stage/production@^1',
      'stage/production@^2'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.ok(!result.lines.some((line) => line.includes('no composition declares')),
        result.lines.join('\n'));
    });
  });

  it('passes the preset values to the composition', () => {
    withTree((tree) => replaceIn(join(tree, 'presets', 'golden.yaml'), 'wip_limit: 2',
      'wip_limit: two'), (tree) => {
      const result = validate(['--tree', tree, ...NAME]);
      assert.equal(result.code, 1);
      assert.ok(result.lines.some((line) => /presets\/golden\.yaml.*wip_limit/.test(line)),
        result.lines.join('\n'));
    });
  });

  it('gives each composition only the --param names its packs declare', () => {
    withTree((tree) => {
      replaceIn(join(tree, 'packs', 'blueprint', 'web-service', 'pack.yaml'), 'contents:',
        'parameters:\n  api_prefix: { type: string, default: "/api", description: "x" }\n'
          + 'contents:');
      writeFileSync(join(tree, 'presets', 'small.yaml'), 'format: 1\nid: small\ntitle: "Small"\n'
        + 'description: "Kanban only."\npacks:\n  - methodology/kanban@^1\n');
    }, (tree) => {
      const result = validate(['--tree', tree, ...NAME, '--param', 'api_prefix=/v2']);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(result.lines.includes('compositions: 14'));
    });
  });

  it('exits with the highest code reached', (context) => {
    if (process.getuid?.() === 0) {
      context.skip('permissions do not apply to root');
      return;
    }
    withTree(() => undefined, (tree) => {
      const stage = join(tree, 'packs', 'stage');
      chmodSync(stage, 0o000);
      try {
        const result = validate(['--tree', tree, ...NAME]);
        assert.equal(result.code, 2, result.lines.join('\n'));
        assert.ok(result.lines.some((line) =>
          /presets\/golden\.yaml.*stage\/production/.test(line)));
      } finally {
        chmodSync(stage, 0o755);
      }
    });
  });

  it('exits 3 on bad usage', () => {
    assert.equal(validate(['--unknown']).code, 3);
    assert.equal(validate(['--param', 'novalue']).code, 3);
  });
});
