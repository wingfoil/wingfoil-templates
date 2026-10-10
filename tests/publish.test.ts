import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { appendFileSync, chmodSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';
import { parse } from 'yaml';

import { runCheckPacks } from '../src/check-packs';
import { runPublish } from '../src/publish';
import type { PublishResult } from '../src/publish';
import { runValidate } from '../src/validate';
import type { TestRepo } from './support/git-repo';
import { BASE_COMPOSABLE, KANBAN } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { REPO_ROOT } from './support/paths';
import { STUB_RELEASE, treeRepo } from './support/published-repo';
import { StubWingfoil } from './support/stub-wingfoil';

type Doc = Record<string, unknown>;

/** The fictional release with format_key: true, as a stub CLI that prints no warning. */
const RELEASE = new StubWingfoil({}, STUB_RELEASE);
after(() => RELEASE.dispose());
const INSTALL = (): string => RELEASE.cli;

const DATES = { GIT_AUTHOR_DATE: '2026-10-10T12:00:00Z', GIT_COMMITTER_DATE: '2026-10-10T12:00:00Z' };
const WITH_KANBAN = ['methodology/kanban'];

/** A repository whose packs carry a CHANGELOG entry for 1.0.0, committed. */
function repository(specs: PackSpec[] = [BASE_COMPOSABLE, KANBAN]): TestRepo {
  const repo = treeRepo(specs);
  for (const spec of specs) {
    appendFileSync(join(repo.dir, 'packs', spec.id, 'CHANGELOG.md'), '\n- 1.0.0: first version.\n');
  }
  repo.commitAll('changelogs');
  return repo;
}

function publish(repo: TestRepo, args: string[], install = INSTALL): PublishResult {
  return runPublish(['--tree', repo.dir, ...args], { install, env: { ...repo.env, ...DATES } });
}

function catalogOf(repo: TestRepo): Doc[] {
  return (parse(readFileSync(join(repo.dir, 'catalog.yaml'), 'utf8')) as { packs: Doc[] }).packs;
}

function state(repo: TestRepo): string {
  return [repo.git(['rev-parse', 'HEAD']), repo.git(['tag', '-l']), repo.git(['status',
    '--porcelain', '--ignored']), readFileSync(join(repo.dir, 'catalog.yaml'), 'utf8')].join('|');
}

function withRepository(body: (repo: TestRepo) => void, specs?: PackSpec[]): void {
  const repo = repository(specs);
  try {
    body(repo);
  } finally {
    repo.dispose();
  }
}

describe('npm run publish:pack (task-014, the dry run of W7)', () => {
  it('tags, then adds the catalog entry in a later commit (spec-001 §11)', () => {
    withRepository((repo) => {
      const release = repo.git(['rev-parse', 'HEAD']).trim();
      const result = publish(repo, ['--pack', 'base', ...WITH_KANBAN]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.equal(repo.git(['cat-file', '-t', 'refs/tags/base@1.0.0']).trim(), 'tag');
      assert.equal(repo.git(['rev-parse', 'refs/tags/base@1.0.0^{commit}']).trim(), release);
      assert.equal(repo.git(['log', '-1', '--format=%s']).trim(), 'catalog: base@1.0.0');
      assert.equal(repo.git(['diff', '--name-only', 'HEAD~1', 'HEAD']).trim(), 'catalog.yaml');
      assert.match(repo.git(['tag', '-l', '--format=%(contents)', 'base@1.0.0']),
        /- 1\.0\.0: first version\./);
      const [entry] = catalogOf(repo);
      assert.deepEqual([entry?.['id'], entry?.['status']], ['base', 'active']);
      const version = (entry?.['versions'] as Doc[])[0];
      assert.equal(version?.['commit'], release);
      assert.equal(version?.['wingfoil'], STUB_RELEASE);
      assert.match(String(version?.['digest']), /^sha256:[0-9a-f]{64}$/);
      for (const line of ['## Publication', `- WingFoil range: \`${STUB_RELEASE}\``]) {
        assert.ok(result.lines.includes(line), result.lines.join('\n'));
      }
      assert.ok(result.lines.some((line) => line.startsWith('CATALOG.md and catalog-index.json '
        + 'not regenerated')));
      assert.equal(repo.git(['status', '--porcelain']).trim(), '');
      // The published repository passes the lint, tag rules included, and the publication run.
      const lint = runCheckPacks(repo.dir);
      assert.equal(lint.code, 0, lint.lines.join('\n'));
      const validation = runValidate(['--tree', repo.dir, ...WITH_KANBAN],
        { mode: 'publication', install: INSTALL });
      assert.equal(validation.code, 0, validation.lines.join('\n'));
    });
  });

  it('writes a stage version\'s transition digests (§14)', () => {
    const transition = ['format: 1', 'id: mvp-to-production', 'from: stage/mvp',
      'to: stage/production', 'formats: {}', 'requires_capabilities: []', 'pre_checks: []',
      'actions:', '  - { id: swap, description: "Swap the stage overlay." }', ''].join('\n');
    withRepository((repo) => {
      repo.write('transitions/mvp-to-production.yaml', transition);
      repo.commitAll('a transition');
      const result = publish(repo, ['--pack', 'stage/production', ...WITH_KANBAN,
        'stage/production']);
      assert.equal(result.code, 0, result.lines.join('\n'));
      const entry = catalogOf(repo).find((pack) => pack['id'] === 'stage/production');
      const version = (entry?.['versions'] as Doc[])[0];
      assert.match(String((version?.['transitions'] as Doc)['mvp-to-production']),
        /^sha256:[0-9a-f]{64}$/);
      assert.equal(runCheckPacks(repo.dir).code, 0, runCheckPacks(repo.dir).lines.join('\n'));
    }, [BASE_COMPOSABLE, KANBAN, { id: 'stage/mvp' }, { id: 'stage/production' }]);
  });

  it('--dry-run does everything in a temporary clone and leaves the repository as it was', () => {
    withRepository((repo) => {
      const before = state(repo);
      const result = publish(repo, ['--pack', 'base', '--dry-run', ...WITH_KANBAN]);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(result.lines[0]?.startsWith('Dry run'));
      assert.ok(result.lines.includes('## Publication'));
      assert.equal(state(repo), before);
    });
  });

  it('refuses a dirty working tree, an existing tag, a version not above the catalog\'s', () => {
    withRepository((repo) => {
      writeFileSync(join(repo.dir, 'stray.txt'), 'x');
      assert.match(publish(repo, ['--pack', 'base', ...WITH_KANBAN]).lines.join('\n'), /not clean/);
    });
    withRepository((repo) => {
      assert.equal(publish(repo, ['--pack', 'base', ...WITH_KANBAN]).code, 0);
      const again = publish(repo, ['--pack', 'base', ...WITH_KANBAN]);
      assert.equal(again.code, 1);
      assert.match(again.lines.join('\n'), /not above the published 1\.0\.0/);
      repo.git(['reset', '--quiet', '--hard', 'HEAD~1']);
      const tagged = publish(repo, ['--pack', 'base', ...WITH_KANBAN]);
      assert.equal(tagged.code, 1);
      assert.match(tagged.lines.join('\n'), /already exists/);
    });
  });

  it('refuses a missing CHANGELOG entry, and a validation that contains no composition with the pack',
    () => {
      withRepository((repo) => {
        assert.match(publish(repo, ['--pack', 'methodology/kanban']).lines.join('\n'),
          /no composition/);
        writeFileSync(join(repo.dir, 'packs', 'base', 'CHANGELOG.md'), '# base\n');
        repo.commitAll('no entry');
        const result = publish(repo, ['--pack', 'base', ...WITH_KANBAN]);
        assert.equal(result.code, 1);
        assert.match(result.lines.join('\n'), /no entry "- 1\.0\.0"/);
      });
    });

  it('creates no tag when the publication validation fails', () => {
    const noisy = new StubWingfoil({ commands: { 'dna show': { stderr: ['Warning: x'] } } },
      STUB_RELEASE);
    try {
      withRepository((repo) => {
        const result = publish(repo, ['--pack', 'base', ...WITH_KANBAN], () => noisy.cli);
        assert.equal(result.code, 1);
        assert.match(result.lines.join('\n'), /publication validation failed; no tag/);
        assert.equal(repo.git(['tag', '-l']).trim(), '');
      });
    } finally {
      noisy.dispose();
    }
  });

  it('tags and commits as the caller, unsigned, with the dates the caller pins', () => {
    withRepository((repo) => {
      assert.equal(publish(repo, ['--pack', 'base', ...WITH_KANBAN]).code, 0);
      // Seconds since the epoch: git versions print an ISO date as Z or +00:00.
      const pinned = String(Date.parse(DATES.GIT_COMMITTER_DATE) / 1000);
      assert.equal(repo.git(['log', '-1', '--format=%an <%ae>|%cn|%ct']).trim(),
        `Test <test@example.invalid>|Test|${pinned}`);
      assert.equal(repo.git(['tag', '-l', '--format=%(taggername)|%(taggerdate:unix)',
        'base@1.0.0']).trim(), `Test|${pinned}`);
      assert.equal(repo.git(['cat-file', '-p', 'refs/tags/base@1.0.0']).includes('BEGIN PGP'),
        false);
    });
  });

  it('removes the tag and restores catalog.yaml when a step after the tag fails (exit 2)',
    (context) => {
      if (process.getuid?.() === 0) {
        context.skip('permissions do not apply to root');
        return;
      }
      withRepository((repo) => {
        const catalog = join(repo.dir, 'catalog.yaml');
        const before = readFileSync(catalog, 'utf8');
        chmodSync(catalog, 0o444);
        try {
          const result = publish(repo, ['--pack', 'base', ...WITH_KANBAN]);
          assert.equal(result.code, 2, result.lines.join('\n'));
          assert.match(result.lines.join('\n'), /the tag was removed and catalog\.yaml restored/);
          assert.equal(repo.git(['tag', '-l']).trim(), '');
          assert.equal(readFileSync(catalog, 'utf8'), before);
        } finally {
          chmodSync(catalog, 0o644);
        }
      });
    });

  it('exits 3 on bad usage and on a tree that is not the repository\'s top level', () => {
    withRepository((repo) => {
      assert.equal(publish(repo, []).code, 3);
      assert.equal(runPublish(['--tree', join(repo.dir, 'packs'), '--pack', 'base']).code, 3);
    });
  });

  it('refuses npm\'s swallowed --dry-run, from the command line', () => {
    const run = spawnSync(process.execPath, [join(REPO_ROOT, 'dist', 'src', 'publish-cli.js'),
      '--pack', 'base'], { cwd: REPO_ROOT, encoding: 'utf8',
      env: { ...process.env, npm_config_dry_run: 'true' } });
    assert.equal(run.status, 3, run.stderr);
    assert.match(run.stderr, /npm took --dry-run/);
  });
});
