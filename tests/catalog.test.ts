import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { parse } from 'yaml';

import { loadCatalog } from '../src/catalog';
import { FIXTURE_CATALOG, REPO_ROOT } from './support/paths';

/**
 * The catalog with its `packs`, `transitions` and `presets` blocks emptied: each key's line and the
 * lines under it, up to the next top-level key, become `<key>: []`.
 */
function unpublished(text: string): string {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const out: string[] = [];
  let skipping = false;
  for (const line of lines) {
    const key = /^(packs|transitions|presets):/.exec(line)?.[1];
    if (key !== undefined) {
      out.push(`${key}: []`);
      skipping = true;
    } else if (skipping && (line.startsWith(' ') || line.startsWith('-'))) {
      continue;
    } else {
      skipping = false;
      out.push(line);
    }
  }
  return out.join('\n');
}

/** The `catalog.yaml` example of spec-001 §11, parsed from the specification. */
function specExample(): { axes: unknown; slots: unknown } {
  const dir = join(REPO_ROOT, 'docs', 'memory', 'tech-spec');
  const spec = readdirSync(dir).find((name) => name.startsWith('spec-001-'));
  assert.ok(spec !== undefined);
  // Line endings normalized: a checkout with core.autocrlf gives CRLF.
  const text = readFileSync(join(dir, spec), 'utf8').replace(/\r\n/g, '\n');
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

  it('loads although foundation names packs not yet listed (dl-010)', () => {
    assert.deepEqual(catalog.foundation, ['base', 'software']);
    assert.deepEqual(catalog.raw['packs'], []);
  });

  it('requires the methodology axis only with software, the slots defaulting to software', () => {
    const methodology = catalog.axes.find((axis) => axis.name === 'methodology');
    assert.equal(methodology?.required, false);
    assert.equal(methodology?.requiredWith, 'software');
    for (const axis of catalog.axes.filter((candidate) => candidate.name !== 'methodology')) {
      assert.equal(axis.required, false, axis.name);
      assert.equal(axis.requiredWith, undefined, axis.name);
    }
    assert.deepEqual(catalog.slots.map((slot) => [slot.name, slot.default]), [
      ['inception', 'software'], ['specification', 'software'], ['delivery', undefined],
      ['release', 'software'], ['end-of-life', 'software'],
    ]);
  });

  it('keeps the axes in file order, the composition order of §7.1', () => {
    assert.deepEqual(catalog.axes.map((axis) => axis.name),
      ['methodology', 'phase', 'blueprint', 'governance', 'team-mode', 'stage']);
    assert.deepEqual(catalog.axes.find((axis) => axis.name === 'phase')?.slots,
      ['inception', 'specification', 'release', 'end-of-life']);
  });
});

describe('the fixture catalog (task-040)', () => {
  it('is the real catalog.yaml with no published pack, byte for byte', () => {
    assert.equal(readFileSync(FIXTURE_CATALOG, 'utf8'),
      unpublished(readFileSync(join(REPO_ROOT, 'catalog.yaml'), 'utf8')));
  });

  it('empties a published packs block and keeps every other line', () => {
    const published = 'format: 1\npacks:\n  - id: base\n    versions:\n      - version: 1.0.0\n'
      + 'transitions: []\npresets: []\n';
    assert.equal(unpublished(published), 'format: 1\npacks: []\ntransitions: []\npresets: []\n');
  });
});
