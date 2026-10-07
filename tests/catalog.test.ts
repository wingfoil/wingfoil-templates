import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { parse } from 'yaml';

import { loadCatalog } from '../src/catalog';
import { REPO_ROOT } from './support/paths';

/** The `catalog.yaml` example of spec-001 §11, parsed from the specification. */
function specExample(): { axes: unknown; slots: unknown } {
  const dir = join(REPO_ROOT, 'docs', 'memory', 'tech-spec');
  const spec = readdirSync(dir).find((name) => name.startsWith('spec-001-'));
  assert.ok(spec !== undefined);
  const text = readFileSync(join(dir, spec), 'utf8');
  const section = text.slice(text.indexOf('## 11. `catalog.yaml`'));
  const block = /```yaml\n([\s\S]*?)```/.exec(section)?.[1];
  assert.ok(block !== undefined);
  const yaml = block.replace('sha256:…', `sha256:${'0'.repeat(64)}`);
  return parse(yaml) as { axes: unknown; slots: unknown };
}

describe('the real catalog.yaml', () => {
  const catalog = loadCatalog(join(REPO_ROOT, 'catalog.yaml'));

  it('has the axes and slots of spec-001 §11 verbatim', () => {
    const example = specExample();
    assert.deepEqual(catalog.raw['axes'], example.axes);
    assert.deepEqual(catalog.raw['slots'], example.slots);
  });

  it('loads although foundation names a pack not yet listed (dl-010)', () => {
    assert.equal(catalog.foundation, 'base');
    assert.deepEqual(catalog.raw['packs'], []);
  });

  it('keeps the axes in file order, the composition order of §7.1', () => {
    assert.deepEqual(catalog.axes.map((axis) => axis.name),
      ['methodology', 'phase', 'blueprint', 'governance', 'team-mode', 'stage']);
    assert.deepEqual(catalog.axes.find((axis) => axis.name === 'phase')?.slots,
      ['inception', 'specification', 'release', 'end-of-life']);
  });
});
