import { strict as assert } from 'node:assert';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { parse } from 'yaml';

import { CompatError, compatFrom, loadCompat } from '../src/compat';
import { FIXTURES, REPO_ROOT } from './support/paths';
import { FROZEN_COMPAT } from './support/published-repo';

const REAL = join(REPO_ROOT, 'compat.yaml');

function withCompat(edit: (text: string) => string, body: (path: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'compat-'));
  try {
    const path = join(dir, 'compat.yaml');
    writeFileSync(path, edit(readFileSync(REAL, 'utf8')));
    body(path);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const SECOND_RELEASE = [
  '  - wingfoil: 0.3.0',
  '    format_key: true',
  '    reads: { dna: [1], memory: [1], roles: [1], workflows: [1], workflow: [1], directive: [1], '
    + 'memory-template: [1] }',
  '    capabilities: [pack-install]',
  '',
].join('\n');

describe('compat.yaml', () => {
  it('is the example of spec-001 §12, and the fixture tree carries the same file (dl-010)', () => {
    const spec = readFileSync(join(REPO_ROOT, 'docs', 'memory', 'tech-spec',
      'spec-001-the-pack-format-manifest-fragments-composition-catalog-compatibility-and-digest.md'),
    'utf8');
    const section = spec.slice(spec.indexOf('## 12. '), spec.indexOf('## 13. '));
    const example = /```yaml\n([\s\S]*?)```/.exec(section)?.[1];
    assert.ok(example !== undefined);
    const real = readFileSync(REAL, 'utf8');
    assert.equal(real, example);
    assert.equal(readFileSync(join(FIXTURES, 'compose', 'tree', 'compat.yaml'), 'utf8'), real);
  });

  it('starts with the frozen 0.2.2-only header the fixture compat files build on (task-035)',
    () => {
      assert.ok(readFileSync(REAL, 'utf8').startsWith(FROZEN_COMPAT));
    });

  it('loads the releases of the real file', () => {
    const compat = loadCompat(REAL);
    assert.deepEqual(compat.releases.map((release) => [release.wingfoil, release.format_key]),
      [['0.2.2', false]]);
    assert.deepEqual(Object.keys(compat.capabilities),
      ['pack-install', 'workflow-engine']);
  });

  it('loads releases in ascending order', () => {
    withCompat((text) => `${text}${SECOND_RELEASE}`, (path) => {
      assert.deepEqual(loadCompat(path).releases.map((release) => release.wingfoil),
        ['0.2.2', '0.3.0']);
    });
  });

  it('refuses releases out of ascending order, naming the release', () => {
    withCompat((text) => text.replace('releases:\n', `releases:\n${SECOND_RELEASE}`), (path) => {
      assert.throws(() => loadCompat(path),
        (error: unknown) => error instanceof CompatError && /0\.2\.2/.test(error.message)
          && /ascending/.test(error.message));
    });
  });

  it('refuses a repeated release', () => {
    withCompat((text) => `${text}${SECOND_RELEASE.replace('0.3.0', '0.2.2')}`, (path) => {
      assert.throws(() => loadCompat(path),
        (error: unknown) => error instanceof CompatError && /0\.2\.2/.test(error.message));
    });
  });

  it('refuses a release capability outside the vocabulary, naming the release', () => {
    withCompat((text) => text.replace('capabilities: []', 'capabilities: [time-travel]'),
      (path) => {
        assert.throws(() => loadCompat(path),
          (error: unknown) => error instanceof CompatError && /0\.2\.2/.test(error.message)
            && /time-travel/.test(error.message));
      });
  });

  it('refuses a file that breaks the schema', () => {
    withCompat((text) => text.replace('format_key: false', 'format_key: maybe'), (path) => {
      assert.throws(() => loadCompat(path), CompatError);
    });
  });
});

describe('compatFrom (task-020)', () => {
  it('checks data as loadCompat checks the file', () => {
    const data: unknown = parse(readFileSync(REAL, 'utf8'));
    assert.deepEqual(compatFrom(data), loadCompat(REAL));
    assert.throws(() => compatFrom({ format: 1 }), CompatError);
  });
});
