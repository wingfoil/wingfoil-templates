import { strict as assert } from 'node:assert';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { parse, stringify } from 'yaml';

import { runCheckPacks } from '../src/check-packs';
import { transitionDigest } from '../src/digest';
import type { CheckPacksResult } from '../src/check-packs';
import type { TestRepo } from './support/git-repo';
import { FIXTURES } from './support/paths';
import { BASE_COMPOSABLE, KANBAN } from './support/pack-tree';
import { publishByHand, treeRepo } from './support/published-repo';

type Doc = Record<string, unknown>;

const TRANSITION = ['format: 1', 'id: mvp-to-production', 'from: stage/mvp', 'to: stage/production',
  'formats: {}', 'requires_capabilities: []', 'pre_checks: []',
  'actions:', '  - { id: swap-stage-overlay, description: "Swap the stage overlay." }', ''].join('\n');

function rules(result: CheckPacksResult): string[] {
  return [...new Set(result.problems.map((problem) => problem.rule))].sort();
}

/** base published by hand, then the catalog entry edited, committed, and the tree linted. */
function linted(edit: (entry: Doc, repo: TestRepo) => void = () => undefined): CheckPacksResult {
  const repo = treeRepo();
  try {
    publishByHand(repo, 'base');
    const file = join(repo.dir, 'catalog.yaml');
    const catalog = parse(readFileSync(file, 'utf8')) as Doc;
    const entry = ((catalog['packs'] as Doc[])[0]?.['versions'] as Doc[])[0] as Doc;
    edit(entry, repo);
    writeFileSync(file, stringify(catalog));
    repo.commitAll('edited');
    return runCheckPacks(repo.dir);
  } finally {
    repo.dispose();
  }
}

describe('tag-dependent catalog rules (spec-001 §18, task-014)', () => {
  it('pass on a version published in the order of spec-001 §11', () => {
    const result = linted();
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('catalog-tag: the version has no tag, or a lightweight one', () => {
    assert.deepEqual(rules(linted((entry) => { entry['version'] = '1.0.1'; })), ['catalog-tag'],
      'no tag: nothing else of the version can be checked');
    assert.deepEqual(rules(linted((_entry, repo) => {
      repo.git(['tag', '-d', 'base@1.0.0']);
      repo.git(['tag', 'base@1.0.0', 'HEAD~1']);
    })), ['catalog-tag']);
  });

  it('catalog-commit: the entry names another commit', () => {
    assert.deepEqual(rules(linted((entry) => { entry['commit'] = '0'.repeat(40); })),
      ['catalog-commit']);
  });

  it('catalog-digest: the digest does not recompute', () => {
    assert.deepEqual(rules(linted((entry) => { entry['digest'] = `sha256:${'0'.repeat(64)}`; })),
      ['catalog-digest']);
  });

  it('catalog-manifest: a copied field differs from the tagged pack.yaml', () => {
    assert.deepEqual(rules(linted((entry) => { entry['requires_capabilities'] = ['pack-install']; })),
      ['catalog-manifest', 'catalog-range'], 'the range follows the copied capabilities');
    assert.deepEqual(rules(linted((entry) => { entry['conflicts'] = ['blueprint/x']; })),
      ['catalog-manifest']);
  });

  it('catalog-range: the range does not recompute from compat.yaml', () => {
    assert.deepEqual(rules(linted((entry) => { entry['wingfoil'] = '0.2.2'; })), ['catalog-range']);
  });

  it('catalog-transition-digest: a stage version\'s transition digest must recompute at its tag',
    () => {
      const repo = treeRepo([BASE_COMPOSABLE, KANBAN, { id: 'stage/mvp' },
        { id: 'stage/production' }]);
      try {
        repo.write('transitions/mvp-to-production.yaml', TRANSITION);
        repo.commitAll('a transition');
        publishByHand(repo, 'stage/mvp');
        const entry = publishByHand(repo, 'stage/production');
        const digest = transitionDigest(repo.dir, 'refs/tags/stage/production@1.0.0',
          'transitions/mvp-to-production.yaml').digest;
        const file = join(repo.dir, 'catalog.yaml');
        const setDigest = (value: string): void => {
          const catalog = parse(readFileSync(file, 'utf8')) as Doc;
          const production = (catalog['packs'] as Doc[]).find((pack) =>
            pack['id'] === 'stage/production');
          ((production?.['versions'] as Doc[])[0] as Doc)['transitions'] =
            { 'mvp-to-production': value };
          writeFileSync(file, stringify(catalog));
          repo.commitAll('transitions');
        };
        assert.equal(entry['version'], '1.0.0');
        setDigest(digest);
        assert.equal(runCheckPacks(repo.dir).code, 0, runCheckPacks(repo.dir).lines.join('\n'));
        setDigest(`sha256:${'0'.repeat(64)}`);
        assert.deepEqual(rules(runCheckPacks(repo.dir)), ['catalog-transition-digest']);
      } finally {
        repo.dispose();
      }
    });

  it('report the catalog once on a tree with published versions that is not a git repository',
    () => {
      const repo = treeRepo();
      const copy = mkdtempSync(join(tmpdir(), 'not-a-repo-'));
      try {
        publishByHand(repo, 'base');
        cpSync(repo.dir, copy, { recursive: true, filter: (path) => !path.includes('/.git') });
        const result = runCheckPacks(copy);
        assert.equal(result.code, 1);
        assert.deepEqual(rules(result), ['catalog-tag']);
      } finally {
        repo.dispose();
        rmSync(copy, { recursive: true, force: true });
      }
    });

  it('find nothing on a tree with no published version, git repository or not', () => {
    assert.equal(runCheckPacks(join(FIXTURES, 'compose', 'tree')).code, 0);
  });
});
