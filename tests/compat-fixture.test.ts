// No test copies this repository's compat.yaml into a tree but the one that checks it (task-045):
// an intake that appends a release would move what they lint. They take FROZEN_COMPAT
// (tests/support/published-repo.ts), whose prefix relation to the real file compat.test.ts holds.
import { strict as assert } from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, it } from 'node:test';

import { REPO_ROOT } from './support/paths';

const TESTS = join(REPO_ROOT, 'tests');
const ALLOWED = ['tests/compat.test.ts', 'tests/compat-fixture.test.ts'];
/** A path to this repository's compat.yaml, however it is quoted or spaced. */
const READ = /REPO_ROOT\s*,\s*['"`]compat\.yaml['"`]/;

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'fixtures' ? [] : sources(path);
    return entry.name.endsWith('.ts') ? [path] : [];
  });
}

describe('the tests and this repository\'s compat.yaml (task-045)', () => {
  it('reads it only where it is checked; every other test takes FROZEN_COMPAT', () => {
    const readers = sources(TESTS).map((path) => relative(REPO_ROOT, path).split('\\').join('/'))
      .filter((path) => !ALLOWED.includes(path))
      .filter((path) => READ.test(readFileSync(join(REPO_ROOT, path), 'utf8')));
    assert.deepEqual(readers, []);
  });
});
