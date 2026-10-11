import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, stringify } from 'yaml';

import { packDigest } from '../../src/digest';
import { runIndex } from '../../src/index';
import { TestRepo } from './git-repo';
import { BASE_COMPOSABLE, KANBAN, writePack } from './pack-tree';
import type { PackSpec } from './pack-tree';
import { REPO_ROOT } from './paths';

type Doc = Record<string, unknown>;

/** A fictional WingFoil release with format_key: true, in fixture compat files only (task-014). */
export const STUB_RELEASE = '9.0.0';

/**
 * This repository's compat.yaml with a fictional release appended: by default STUB_RELEASE, from
 * WingFoil 1.0 on; a release below 1.0.0 keeps the tree before it (the line policy, task-016).
 */
export function fixtureCompat(release = STUB_RELEASE): string {
  return `${readFileSync(join(REPO_ROOT, 'compat.yaml'), 'utf8')}  - wingfoil: ${release}
    format_key: true
    reads: { dna: [1], memory: [1], roles: [1], workflows: [1], workflow: [1], directive: [1], memory-template: [1] }
    capabilities: []
`;
}

/** A scratch repository holding packs, this repository's catalog and the fixture compat file. */
export function treeRepo(specs: PackSpec[] = [BASE_COMPOSABLE, KANBAN],
  release = STUB_RELEASE): TestRepo {
  const repo = new TestRepo();
  for (const spec of specs) writePack(repo.dir, spec);
  repo.write('catalog.yaml', readFileSync(join(REPO_ROOT, 'catalog.yaml'), 'utf8'));
  repo.write('compat.yaml', fixtureCompat(release));
  repo.write('.gitignore', '.cache/\nnode_modules/\n');
  // The index outputs belong to the tree, as in this repository (task-019).
  writeIndex(repo);
  repo.commitAll('the tree');
  return repo;
}

/** Publishes one pack version by hand, as spec-001 §11 orders it: tag, then the catalog commit. */
export function publishByHand(repo: TestRepo, packId: string): Doc {
  const manifest = parse(readFileSync(join(repo.dir, 'packs', packId, 'pack.yaml'), 'utf8')) as Doc;
  const version = String(manifest['version']);
  repo.tag(`${packId}@${version}`);
  const commit = repo.git(['rev-parse', 'HEAD']).trim();
  const entry: Doc = {
    version, commit, digest: packDigest(repo.dir, `refs/tags/${packId}@${version}`, packId).digest,
    formats: manifest['formats'], requires_capabilities: manifest['requires_capabilities'],
    requires: manifest['requires'] ?? [], conflicts: manifest['conflicts'] ?? [],
    wingfoil: STUB_RELEASE,
  };
  const catalog = parse(readFileSync(join(repo.dir, 'catalog.yaml'), 'utf8')) as Doc;
  const packs = catalog['packs'] as Doc[];
  const existing = packs.find((pack) => pack['id'] === packId);
  if (existing === undefined) {
    packs.push({ id: packId, path: `packs/${packId}`, catalog: 'official', status: 'active',
      versions: [entry] });
  } else {
    (existing['versions'] as Doc[]).push(entry);
  }
  repo.write('catalog.yaml', stringify(catalog));
  repo.commitAll(`catalog: ${packId}@${version}`);
  return entry;
}

/** Runs npm run index on the repository's working tree (task-019), without committing. */
export function writeIndex(repo: TestRepo): void {
  const result = runIndex(['--tree', repo.dir]);
  if (result.code !== 0) throw new Error(result.lines.join('\n'));
}

/**
 * Runs the index and commits its outputs. After a publication it refreshes the CATALOG.md and
 * catalog-index.json that publish:pack leaves stale until plan-024 task 2b, which removes those
 * calls.
 */
export function reindex(repo: TestRepo, message = 'index'): void {
  writeIndex(repo);
  repo.commitAll(message);
}
