import { strict as assert } from 'node:assert';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { parse } from 'yaml';

import { CompatError, compatFrom, loadCompat } from '../src/compat';
import { computeRange } from '../src/range';
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
  '  - wingfoil: 99.0.0',
  '    format_key: true',
  '    reads: { dna: [1], memory: [1], roles: [1], workflows: [1], workflow: [1], directive: [1], '
    + 'memory-template: [1] }',
  '    capabilities: [pack-install]',
  '',
].join('\n');

describe('compat.yaml', () => {
  it('is carried by the fixture tree as it is (dl-010; spec-001 §12 points to it, task-079)', () => {
    assert.equal(readFileSync(join(FIXTURES, 'compose', 'tree', 'compat.yaml'), 'utf8'),
      readFileSync(REAL, 'utf8'));
  });

  it('starts with the frozen 0.2.2-only header the fixture compat files build on (task-035)',
    () => {
      assert.ok(readFileSync(REAL, 'utf8').startsWith(FROZEN_COMPAT));
    });

  it('loads the releases of the real file: 0.2.2, then 0.3.0, 0.3.1 and 0.3.2 with '
    + 'workflow-engine, and every later release as an intake writes it (task-036, task-059, '
    + 'task-074, task-079)', () => {
      const compat = loadCompat(REAL);
      assert.deepEqual(compat.releases.slice(0, 4).map((release) => [release.wingfoil,
        release.format_key, release.capabilities]), [['0.2.2', false, []],
        ['0.3.0', true, ['workflow-engine']], ['0.3.1', true, ['workflow-engine']],
        ['0.3.2', true, ['workflow-engine']]]);
      const kinds = Object.keys(compat.kinds).sort();
      for (const release of compat.releases.slice(1)) {
        assert.deepEqual(Object.keys(release.reads).sort(), kinds, release.wingfoil);
      }
      for (const release of compat.releases.slice(4)) {
        assert.equal(release.format_key, true, release.wingfoil);
        for (const capability of release.capabilities) {
          assert.ok(Object.hasOwn(compat.capabilities, capability), capability);
        }
      }
      assert.deepEqual(Object.keys(compat.capabilities),
        ['pack-install', 'workflow-engine']);
    });

  it('gives a version requiring workflow-engine the range from 0.3.0 to the newest release of the '
    + 'real file, while every later release carries it (task-036, task-059, task-074, task-079)',
    () => {
      const releases = loadCompat(REAL).releases;
      const newest = releases[releases.length - 1];
      assert.ok(newest !== undefined);
      assert.ok(releases.slice(1).every((release) =>
        release.capabilities.includes('workflow-engine')));
      const formats = { dna: 1, memory: 1, roles: 1, workflow: 1, directive: 1 };
      assert.equal(computeRange({ formats, requires_capabilities: ['workflow-engine'] },
        releases), `>=0.3.0 <=${newest.wingfoil}`);
    });

  it('loads releases in ascending order', () => {
    withCompat((text) => `${text}${SECOND_RELEASE}`, (path) => {
      assert.deepEqual(loadCompat(path).releases.map((release) => release.wingfoil),
        [...loadCompat(REAL).releases.map((release) => release.wingfoil), '99.0.0']);
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
    withCompat((text) => `${text}${SECOND_RELEASE.replace('99.0.0', '0.3.2')}`, (path) => {
      assert.throws(() => loadCompat(path),
        (error: unknown) => error instanceof CompatError && /0\.3\.2/.test(error.message));
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
