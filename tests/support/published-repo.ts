import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, stringify } from 'yaml';

import { packDigest } from '../../src/digest';
import { TestRepo } from './git-repo';
import { BASE_COMPOSABLE, KANBAN, writePack } from './pack-tree';
import type { PackSpec } from './pack-tree';
import { REPO_ROOT } from './paths';

type Doc = Record<string, unknown>;

/** A fictional WingFoil release with format_key: true, in fixture compat files only (task-014). */
export const STUB_RELEASE = '9.0.0';

/** This repository's compat.yaml with the fictional release appended. */
export function fixtureCompat(): string {
  return `${readFileSync(join(REPO_ROOT, 'compat.yaml'), 'utf8')}  - wingfoil: ${STUB_RELEASE}
    format_key: true
    reads: { dna: [1], memory: [1], roles: [1], workflows: [1], workflow: [1], directive: [1], memory-template: [1] }
    capabilities: []
`;
}

/** A scratch repository holding packs, this repository's catalog and the fixture compat file. */
export function treeRepo(specs: PackSpec[] = [BASE_COMPOSABLE, KANBAN]): TestRepo {
  const repo = new TestRepo();
  for (const spec of specs) writePack(repo.dir, spec);
  repo.write('catalog.yaml', readFileSync(join(REPO_ROOT, 'catalog.yaml'), 'utf8'));
  repo.write('compat.yaml', fixtureCompat());
  repo.write('.gitignore', '.cache/\nnode_modules/\n');
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
