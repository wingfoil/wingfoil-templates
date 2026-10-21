import { join } from 'node:path';

/** The repository root, from the compiled test under dist/tests/. */
export const REPO_ROOT = join(__dirname, '..', '..', '..');
export const FIXTURES = join(REPO_ROOT, 'tests', 'fixtures');
/** This repository's catalog.yaml with no published pack, for the tests' trees (task-040). */
export const FIXTURE_CATALOG = join(FIXTURES, 'catalog', 'catalog.yaml');
