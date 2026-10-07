import { strict as assert } from 'node:assert';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

import { compareTrees, listTree } from '../src/compare-trees';

function withTrees(a: Record<string, string>, b: Record<string, string>,
  body: (left: string, right: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), 'compare-'));
  try {
    for (const [side, files] of [['a', a], ['b', b]] as const) {
      for (const [path, text] of Object.entries(files)) {
        mkdirSync(dirname(join(root, side, path)), { recursive: true });
        writeFileSync(join(root, side, path), text);
      }
    }
    body(join(root, 'a'), join(root, 'b'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const TREE = {
  '.wingfoil/dna.yaml': 'a\n',
  '.wingfoil/workflows/built-in/x.yaml': 'x\n',
  'AGENTS.region.md': 'r\n',
};

describe('compareTrees', () => {
  it('lists every file, relative, in byte order', () => {
    withTrees(TREE, {}, (a) => {
      assert.deepEqual(listTree(a), ['.wingfoil/dna.yaml', '.wingfoil/workflows/built-in/x.yaml',
        'AGENTS.region.md']);
    });
  });

  it('finds no difference between equal trees', () => {
    withTrees(TREE, TREE, (a, b) => assert.deepEqual(compareTrees(a, b), []));
  });

  it('names a differing byte, a missing file and an extra file', () => {
    const changed = { ...TREE, '.wingfoil/dna.yaml': 'b\n' };
    withTrees(TREE, changed, (a, b) => {
      assert.deepEqual(compareTrees(a, b), ['.wingfoil/dna.yaml: the bytes differ']);
    });
    const missing: Record<string, string> = { ...TREE };
    delete missing['AGENTS.region.md'];
    withTrees(TREE, missing, (a, b) => {
      assert.deepEqual(compareTrees(a, b), ['AGENTS.region.md: only in the first composition']);
    });
    withTrees(missing, TREE, (a, b) => {
      assert.deepEqual(compareTrees(a, b), ['AGENTS.region.md: only in the second composition']);
    });
  });
});
