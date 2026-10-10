import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { parse } from 'yaml';

import { CatalogEditError, addVersion } from '../src/catalog-edit';
import { REPO_ROOT } from './support/paths';

const CATALOG = readFileSync(join(REPO_ROOT, 'catalog.yaml'), 'utf8');

function version(v: string): Record<string, unknown> {
  return { version: v, commit: '0'.repeat(40), digest: `sha256:${'a'.repeat(64)}`, formats: {},
    requires_capabilities: [], requires: [], conflicts: [], wingfoil: '9.0.0' };
}

describe('addVersion (spec-001 §11)', () => {
  it('rewrites only the packs block; every other byte, comments included, is kept', () => {
    const [before, after] = CATALOG.split('packs: []');
    const edited = addVersion(CATALOG, 'base', version('1.0.0'));
    assert.ok(before !== undefined && after !== undefined);
    assert.ok(edited.startsWith(before) && edited.endsWith(after), edited);
  });

  it('adds the pack entry the first time, then appends versions', () => {
    const twice = addVersion(addVersion(CATALOG, 'base', version('1.0.0')), 'base',
      version('1.1.0'));
    const packs = (parse(twice) as { packs: Record<string, unknown>[] }).packs;
    assert.deepEqual(packs.map((pack) => [pack['id'], pack['path'], pack['catalog'],
      pack['status']]), [['base', 'packs/base', 'official', 'active']]);
    assert.deepEqual((packs[0]?.['versions'] as { version: string }[]).map((v) => v.version),
      ['1.0.0', '1.1.0']);
    assert.ok(twice.endsWith(CATALOG.split('packs: []')[1] ?? '?'));
  });

  it('refuses a comment inside the packs block rather than drop it', () => {
    for (const commented of [CATALOG.replace('packs: []', 'packs: [] # none yet'),
      CATALOG.replace('packs: []', 'packs:\n  # the first pack\n  - id: base\n    path: packs/base\n'
        + '    catalog: official\n    status: planned\n    versions: []')]) {
      assert.throws(() => addVersion(commented, 'base', version('1.0.0')), CatalogEditError);
    }
  });

  it('turns a planned pack active with its first version', () => {
    const planned = CATALOG.replace('packs: []', 'packs:\n  - id: base\n    path: packs/base\n'
      + '    catalog: official\n    status: planned\n    versions: []');
    const packs = (parse(addVersion(planned, 'base', version('1.0.0'))) as
      { packs: Record<string, unknown>[] }).packs;
    assert.equal(packs[0]?.['status'], 'active');
  });
});
