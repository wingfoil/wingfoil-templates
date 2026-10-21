// No test reads this repository's catalog.yaml but the one that checks it (task-040): a tree built
// from it fails once a pack is published, since its tags are not there. The tests take the fixture
// catalog (tests/support/paths.ts FIXTURE_CATALOG).
import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, it } from 'node:test';

import { REPO_ROOT } from './support/paths';

const TESTS = join(REPO_ROOT, 'tests');
const ALLOWED = ['tests/catalog.test.ts', 'tests/catalog-fixture.test.ts'];
/** A path to this repository's catalog.yaml, however it is quoted or spaced. */
const READ = /REPO_ROOT\s*,\s*['"`]catalog\.yaml['"`]/;

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'fixtures' ? [] : sources(path);
    return entry.name.endsWith('.ts') ? [path] : [];
  });
}

describe('the tests and this repository\'s catalog.yaml (task-040)', () => {
  it('reads it only where it is checked; every other test takes the fixture catalog', () => {
    const readers = sources(TESTS).map((path) => relative(REPO_ROOT, path).split('\\').join('/'))
      .filter((path) => !ALLOWED.includes(path))
      .filter((path) => READ.test(readFileSync(join(REPO_ROOT, path), 'utf8')));
    assert.deepEqual(readers, []);
  });
});
