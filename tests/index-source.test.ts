import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { overlay } from '../src/index-source';
import type { TreeSource } from '../src/index-source';

const BASE: TreeSource = {
  label: 'main',
  tag: 'base@1.0.0',
  read: (path) => ({ 'catalog.yaml': 'old\n', 'compat.yaml': 'compat\n' } as Record<string,
    string>)[path],
};

describe('overlay (task-020)', () => {
  it('reads the overlaid files from them and every other file from the source', () => {
    const view = overlay(BASE, { 'catalog.yaml': 'edited\n', 'CATALOG.md': 'new\n' });
    assert.equal(view.read('catalog.yaml'), 'edited\n');
    assert.equal(view.read('CATALOG.md'), 'new\n');
    assert.equal(view.read('compat.yaml'), 'compat\n');
    assert.equal(view.read('missing.yaml'), undefined);
  });

  it('keeps the source\'s label and tag', () => {
    const view = overlay(BASE, {});
    assert.equal(view.label, 'main');
    assert.equal(view.tag, 'base@1.0.0');
  });
});
