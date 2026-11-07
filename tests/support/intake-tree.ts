// The trees the intake's tests build (task-080, task-081): the fixture packs with base published,
// the golden fixture's compat.yaml equal to the root's, the index up to date, all committed; never
// this repository's compat.yaml or catalog.yaml (task-045's rule).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { GOLDEN_COMPAT } from '../../src/intake-prepare';
import type { Resolver } from '../../src/intake-prepare';
import type { TestRepo } from './git-repo';
import { publishByHand, treeRepo } from './published-repo';

/** The next patch after the fixture's fictional release, STUB_RELEASE (9.0.0). */
export const NEXT = '9.0.1';

/** A lockfile as npm writes one for a matrix pin, at `version`. */
export function lockfile(version: string): string {
  const name = `wingfoil-matrix-${version}`;
  return `${JSON.stringify({
    name, lockfileVersion: 3, requires: true,
    packages: {
      '': { name, dependencies: { wingfoil: version } },
      'node_modules/wingfoil': { version,
        resolved: `https://registry.npmjs.org/wingfoil/-/wingfoil-${version}.tgz`,
        integrity: 'sha512-AAAA' },
    },
  }, null, 2)}\n`;
}

/** A resolver that runs no npm. */
export function fakeResolver(version = NEXT): Resolver {
  return () => lockfile(version);
}

export function consistentRepo(body: (repo: TestRepo) => void): void {
  const repo = treeRepo();
  try {
    publishByHand(repo, 'base');
    repo.write(GOLDEN_COMPAT, readFileSync(join(repo.dir, 'compat.yaml'), 'utf8'));
    repo.commitAll('the golden fixture');
    body(repo);
  } finally {
    repo.dispose();
  }
}

export function read(repo: TestRepo, path: string): string {
  return readFileSync(join(repo.dir, path), 'utf8');
}

export function status(repo: TestRepo): string {
  return repo.git(['status', '--porcelain', '--untracked-files=all']);
}
