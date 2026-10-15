import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { appendFileSync, chmodSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, describe, it } from 'node:test';
import { parse, stringify } from 'yaml';

import { runCheckPacks } from '../src/check-packs';
import { runPublish } from '../src/publish';
import type { PublishResult } from '../src/publish';
import { runValidate } from '../src/validate';
import type { TestRepo } from './support/git-repo';
import { DELIVERY, FOUNDATION_COMPOSABLE as FOUNDATION, KANBAN } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { REPO_ROOT } from './support/paths';
import { runIndex } from '../src/index';
import { STUB_RELEASE, treeRepo, writeIndex } from './support/published-repo';
import { StubWingfoil } from './support/stub-wingfoil';

type Doc = Record<string, unknown>;

/** The fictional release with format_key: true, as a stub CLI that prints no warning. */
const RELEASE = new StubWingfoil({}, STUB_RELEASE);
after(() => RELEASE.dispose());
const INSTALL = (): string => RELEASE.cli;

/** The files of a catalog commit (task-020): the catalog and the index it changes. */
const INDEXED = ['CATALOG.md', 'catalog-index.json', 'catalog.yaml'];

const DATES = { GIT_AUTHOR_DATE: '2026-10-10T12:00:00Z', GIT_COMMITTER_DATE: '2026-10-10T12:00:00Z' };
const WITH_KANBAN = ['methodology/kanban'];

/** A repository whose packs carry a CHANGELOG entry for 1.0.0, committed. */
function repository(specs: PackSpec[] = [...FOUNDATION, KANBAN],
  release = STUB_RELEASE, examples = true): TestRepo {
  const repo = treeRepo(specs, release, { examples });
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

function withRepository(body: (repo: TestRepo) => void, specs?: PackSpec[],
  release?: string, examples = true): void {
  const repo = repository(specs, release, examples);
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
      assert.deepEqual(repo.git(['diff', '--name-only', 'HEAD~1', 'HEAD']).trim().split('\n'),
        INDEXED);
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
      assert.ok(!result.lines.some((line) => line.includes('not regenerated')));
      assert.equal(repo.git(['status', '--porcelain']).trim(), '');
      // The published repository passes the lint, tag rules included, and the publication run.
      const lint = runCheckPacks(repo.dir);
      assert.equal(lint.code, 0, lint.lines.join('\n'));
      const validation = runValidate(['--tree', repo.dir, ...WITH_KANBAN],
        { mode: 'publication', install: INSTALL });
      assert.equal(validation.code, 0, validation.lines.join('\n'));
      assert.ok(validation.lines.some((line) => /^index: checked \d+ files, 0 not up to date$/
        .test(line)), validation.lines.join('\n'));
    });
  });

  it('copies a conditional part\'s with into the version entry, and nothing without one', () => {
    const flow: PackSpec = { id: 'methodology/flow', workflows: ['board'],
      manifest: { conditional: [{ with: 'software@^1', contents: { workflows: ['delivery'] } }] },
      extraFiles: { 'workflows/delivery.yaml': DELIVERY } };
    withRepository((repo) => {
      for (const pack of ['base', 'software', 'methodology/kanban', 'methodology/flow']) {
        const result = publish(repo, ['--pack', pack, pack]);
        assert.equal(result.code, 0, `${pack}: ${result.lines.join('\n')}`);
      }
      const versionOf = (id: string): Doc => ((catalogOf(repo).find((entry) => entry['id'] === id)
        ?.['versions'] as Doc[])[0] ?? {});
      assert.deepEqual(versionOf('methodology/flow')['conditional'], [{ with: 'software@^1' }]);
      assert.ok(!Object.hasOwn(versionOf('methodology/kanban'), 'conditional'));
      const lint = runCheckPacks(repo.dir);
      assert.equal(lint.code, 0, lint.lines.join('\n'));
    }, [...FOUNDATION, KANBAN, flow]);
  });

  it('counts an example that contains the pack as a composition (task-022)', () => {
    withRepository((repo) => {
      const result = publish(repo, ['--pack', 'base']);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(result.lines.some((line) => line.startsWith(
        'composition tests/fixtures/examples/base/basic/example.yaml: composed twice')));
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
    }, [...FOUNDATION, KANBAN, { id: 'stage/mvp' }, { id: 'stage/production' }]);
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
      // With no example, kanban is in no composition of the validation (task-022).
      }, undefined, undefined, false);
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
          assert.match(result.lines.join('\n'), /the tag was removed and the branch reset/);
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

function editManifest(repo: TestRepo, pack: string, change: (manifest: Doc) => void): void {
  const file = join(repo.dir, 'packs', pack, 'pack.yaml');
  const manifest = parse(readFileSync(file, 'utf8')) as Doc;
  change(manifest);
  writeFileSync(file, stringify(manifest));
}

/**
 * Sets base's version in pack.yaml (and its formats, when given), with a CHANGELOG entry; kanban
 * follows base's major, as a methodology requires base@^<major>. It runs the index, as an author
 * does before a release commit: the README sections follow pack.yaml.
 */
function bump(repo: TestRepo, version: string, formats?: Record<string, number>): void {
  editManifest(repo, 'base', (manifest) => {
    manifest['version'] = version;
    if (formats !== undefined) manifest['formats'] = formats;
  });
  // Every pack that requires base follows its major: software, and kanban, which requires both.
  const major = version.split('.')[0] ?? '';
  editManifest(repo, 'software', (manifest) => { manifest['requires'] = [`base@^${major}`]; });
  editManifest(repo, 'methodology/kanban', (manifest) => {
    manifest['requires'] = [`base@^${major}`, 'software@^1'];
  });
  appendFileSync(join(repo.dir, 'packs', 'base', 'CHANGELOG.md'), `- ${version}: next.\n`);
  // base's example follows its major, as an author's does (task-022).
  const example = join(repo.dir, 'tests', 'fixtures', 'examples', 'base', 'basic', 'example.yaml');
  if (existsSync(example)) {
    writeFileSync(example, readFileSync(example, 'utf8').replace(/base@\^\d+/,
      `base@^${major}`));
  }
  writeIndex(repo);
  repo.commitAll(`base ${version}`);
}

function versionsOn(repo: TestRepo, ref: string): string[] {
  const catalog = parse(repo.git(['show', `${ref}:catalog.yaml`])) as { packs: Doc[] };
  const base = catalog.packs.find((pack) => pack['id'] === 'base');
  return ((base?.['versions'] as Doc[] | undefined) ?? []).map((entry) => String(entry['version']));
}

function published(repo: TestRepo, args: string[], install = INSTALL): PublishResult {
  const result = publish(repo, args, install);
  assert.equal(result.code, 0, result.lines.join('\n'));
  return result;
}

function refused(repo: TestRepo, pattern: RegExp, code = 1, args: string[] = []): void {
  const before = state(repo);
  const main = repo.git(['rev-parse', 'main']);
  const result = publish(repo, ['--pack', 'base', ...args, ...WITH_KANBAN], () => {
    throw new Error('the line is decided before the validation');
  });
  assert.equal(result.code, code, result.lines.join('\n'));
  assert.match(result.lines.join('\n'), pattern);
  assert.equal(state(repo), before);
  assert.equal(repo.git(['rev-parse', 'main']), main);
}

/** base 1.0.0 then 2.0.0 published on main, and maint/base/1.x cut from base@1.0.0. */
function withTwoMajors(body: (repo: TestRepo) => void): void {
  withRepository((repo) => {
    published(repo, ['--pack', 'base', ...WITH_KANBAN]);
    bump(repo, '2.0.0');
    published(repo, ['--pack', 'base', ...WITH_KANBAN]);
    repo.git(['checkout', '--quiet', '-b', 'maint/base/1.x', 'base@1.0.0']);
    body(repo);
  });
}

describe('npm run publish:pack, the lines (task-016, F5.3)', () => {
  it('before WingFoil 1.0, refuses a maint/ branch before any validation', () => {
    const early = new StubWingfoil({}, '0.9.0');
    try {
      withRepository((repo) => {
        repo.git(['checkout', '--quiet', '-b', 'maint/base/1.x']);
        refused(repo, /maintenance lines start with WingFoil 1\.0/);
        repo.git(['checkout', '--quiet', 'main']);
        const result = published(repo, ['--pack', 'base', ...WITH_KANBAN], () => early.cli);
        assert.ok(result.lines.includes('- Line: current'), result.lines.join('\n'));
        assert.match(publish(repo, ['--pack', 'base', ...WITH_KANBAN], () => early.cli).lines
          .join('\n'), /one living line before WingFoil 1\.0/);
      }, undefined, '0.9.0');
    } finally {
      early.dispose();
    }
  });

  it('from WingFoil 1.0, publishes N-1 fixes on maint/base/1.x, cataloged on main', () => {
    withTwoMajors((repo) => {
      const branchCatalog = readFileSync(join(repo.dir, 'catalog.yaml'), 'utf8');
      for (const version of ['1.0.1', '1.1.0']) {
        bump(repo, version);
        const head = repo.git(['rev-parse', 'HEAD']).trim();
        const result = published(repo, ['--pack', 'base', ...WITH_KANBAN]);
        assert.ok(result.lines.includes('- Line: 1.x'), result.lines.join('\n'));
        assert.equal(repo.git(['rev-parse', `refs/tags/base@${version}^{commit}`]).trim(), head);
        // The branch is untouched: its head, its catalog.yaml, a clean working tree.
        assert.equal(repo.git(['rev-parse', 'HEAD']).trim(), head);
        assert.equal(readFileSync(join(repo.dir, 'catalog.yaml'), 'utf8'), branchCatalog);
        assert.equal(repo.git(['status', '--porcelain']).trim(), '');
        assert.equal(repo.git(['log', '-1', '--format=%s', 'main']).trim(),
          `catalog: base@${version}`);
      }
      assert.deepEqual(versionsOn(repo, 'main'), ['1.0.0', '1.0.1', '1.1.0', '2.0.0']);
      const entry = (parse(repo.git(['show', 'main:catalog.yaml'])) as { packs: Doc[] }).packs
        .find((pack) => pack['id'] === 'base');
      assert.equal((entry?.['versions'] as Doc[])[2]?.['commit'],
        repo.git(['rev-parse', 'refs/tags/base@1.1.0^{commit}']).trim());
      // main passes the lint, the tag rules included, with tags reachable only from the branch.
      repo.git(['checkout', '--quiet', 'main']);
      const lint = runCheckPacks(repo.dir);
      assert.equal(lint.code, 0, lint.lines.join('\n'));
    });
  });

  it('refuses N-1 from main, another branch, N-2, another major, a format move, no descent', () => {
    withTwoMajors((repo) => {
      repo.git(['checkout', '--quiet', 'main']);
      bump(repo, '1.0.1');
      refused(repo, /not above the published 2\.0\.0/);
      repo.git(['checkout', '--quiet', '-b', 'maint/base/2.x']);
      refused(repo, /not on the line 2\.x/);
      repo.git(['checkout', '--quiet', '-b', 'maint/methodology/kanban/1.x']);
      refused(repo, /not of base/);
      repo.git(['checkout', '--quiet', 'maint/base/1.x']);
      bump(repo, '2.0.0');
      refused(repo, /not on the line 1\.x/);
      repo.git(['reset', '--quiet', '--hard', 'HEAD~1']);
      bump(repo, '1.0.1', { dna: 1, roles: 1, memory: 1, workflow: 2 });
      refused(repo, /format move/);
      repo.git(['reset', '--quiet', '--hard', 'HEAD~1']);
      repo.git(['checkout', '--quiet', '-b', 'maint/base/1.x-old', 'base@1.0.0~1']);
      repo.git(['branch', '--quiet', '-D', 'maint/base/1.x']);
      repo.git(['checkout', '--quiet', '-b', 'maint/base/1.x']);
      bump(repo, '1.0.1');
      refused(repo, /does not descend from base@1\.0\.0/);
    });
    withTwoMajors((repo) => {
      repo.git(['checkout', '--quiet', 'main']);
      bump(repo, '3.0.0');
      published(repo, ['--pack', 'base', ...WITH_KANBAN]);
      repo.git(['checkout', '--quiet', 'maint/base/1.x']);
      bump(repo, '1.0.1');
      refused(repo, /N-1 is 2\.x/);
    });
  });

  it('--dry-run on a maintenance line leaves the branch and main as they were', () => {
    withTwoMajors((repo) => {
      bump(repo, '1.0.1');
      const before = [state(repo), repo.git(['rev-parse', 'main'])];
      const result = published(repo, ['--pack', 'base', '--dry-run', ...WITH_KANBAN]);
      assert.ok(result.lines.includes('- Line: 1.x'), result.lines.join('\n'));
      assert.deepEqual([state(repo), repo.git(['rev-parse', 'main'])], before);
    });
  });

  it('counts the working tree\'s versions too on the current line, and works without main', () => {
    withRepository((repo) => {
      repo.git(['checkout', '--quiet', '-b', 'task/x']);
      published(repo, ['--pack', 'base', ...WITH_KANBAN]);
      bump(repo, '1.1.0');
      published(repo, ['--pack', 'base', ...WITH_KANBAN]);
      bump(repo, '1.0.5');
      refused(repo, /not above the published 1\.1\.0/);
    });
    withRepository((repo) => {
      repo.git(['branch', '--quiet', '-m', 'main', 'trunk']);
      const result = published(repo, ['--pack', 'base', ...WITH_KANBAN]);
      assert.ok(result.lines.includes('- Line: current'), result.lines.join('\n'));
      repo.git(['checkout', '--quiet', '-b', 'maint/base/1.x']);
      bump(repo, '1.0.1');
      const refusal = publish(repo, ['--pack', 'base', ...WITH_KANBAN]);
      assert.equal(refusal.code, 1);
      assert.match(refusal.lines.join('\n'), /no main branch with a catalog\.yaml/);
    });
  });

  it('publishes from a detached HEAD on the current line', () => {
    withRepository((repo) => {
      repo.git(['checkout', '--quiet', '--detach']);
      const result = published(repo, ['--pack', 'base', ...WITH_KANBAN]);
      assert.ok(result.lines.includes('- Line: current'), result.lines.join('\n'));
    });
  });
});

/** The index of the checked-out tree is what npm run index writes. */
function indexFresh(repo: TestRepo): void {
  const check = runIndex(['--tree', repo.dir, '--check']);
  assert.equal(check.code, 0, check.lines.join('\n'));
}

function diffNames(repo: TestRepo, from: string, to: string): string[] {
  return repo.git(['diff', '--name-only', from, to]).trim().split('\n');
}

const PRESET = (title: string): string => `format: 1\nid: small\ntitle: "${title}"\n`
  + 'description: "Kanban."\npacks:\n  - methodology/kanban@^1\n';

describe('npm run publish:pack, the index in the catalog commit (task-020)', () => {
  it('on the current line, commits the regenerated index with catalog.yaml (acceptance 4, 7)',
    () => {
      withRepository((repo) => {
        const result = published(repo, ['--pack', 'base', ...WITH_KANBAN]);
        assert.deepEqual(diffNames(repo, 'HEAD~1', 'HEAD'), INDEXED);
        indexFresh(repo);
        assert.equal(repo.git(['status', '--porcelain']).trim(), '');
        assert.ok(result.lines.includes('- Index: CATALOG.md, catalog-index.json'),
          result.lines.join('\n'));
        assert.match(readFileSync(join(repo.dir, 'CATALOG.md'), 'utf8'), /pack-base.*1\.0\.0/);
      });
    });

  it('changes no file under packs/, nor llms.txt (CB-5, acceptance 8)', () => {
    withRepository((repo) => {
      published(repo, ['--pack', 'base', ...WITH_KANBAN]);
      assert.deepEqual(diffNames(repo, 'base@1.0.0', 'HEAD'), INDEXED);
    });
  });

  it('on an N-1 line, computes the index from main\'s commit (acceptance 5, 8)', () => {
    withRepository((repo) => {
      // A preset both branches hold, with another title on main once the line is cut.
      repo.write('presets/small.yaml', PRESET('Small'));
      const catalog = parse(readFileSync(join(repo.dir, 'catalog.yaml'), 'utf8')) as Doc;
      catalog['presets'] = [{ id: 'small', path: 'presets/small.yaml' }];
      repo.write('catalog.yaml', stringify(catalog));
      writeIndex(repo);
      repo.commitAll('a preset');
      published(repo, ['--pack', 'base', ...WITH_KANBAN]);
      bump(repo, '2.0.0');
      published(repo, ['--pack', 'base', ...WITH_KANBAN]);
      repo.write('presets/small.yaml', PRESET('Small on main'));
      writeIndex(repo);
      repo.commitAll('the preset on main');
      repo.git(['checkout', '--quiet', '-b', 'maint/base/1.x', 'base@1.0.0']);
      bump(repo, '1.0.1');
      const head = repo.git(['rev-parse', 'HEAD']).trim();
      const result = published(repo, ['--pack', 'base', ...WITH_KANBAN]);
      assert.ok(result.lines.includes('- Index: CATALOG.md, catalog-index.json (on main)'),
        result.lines.join('\n'));
      assert.equal(repo.git(['rev-parse', 'HEAD']).trim(), head);
      assert.equal(repo.git(['status', '--porcelain']).trim(), '');
      // CATALOG.md shows the latest version, which an N-1 publication does not change.
      assert.deepEqual(diffNames(repo, 'main^', 'main'), ['catalog-index.json', 'catalog.yaml']);
      repo.git(['checkout', '--quiet', 'main']);
      indexFresh(repo);
      assert.match(readFileSync(join(repo.dir, 'CATALOG.md'), 'utf8'), /Small on main/);
      assert.match(readFileSync(join(repo.dir, 'catalog-index.json'), 'utf8'), /"1\.0\.1"/);
    });
  });

  it('--dry-run names the regenerated index on both lines (acceptance 6)', () => {
    withRepository((repo) => {
      const before = state(repo);
      const result = published(repo, ['--pack', 'base', '--dry-run', ...WITH_KANBAN]);
      assert.ok(result.lines.includes('- Index: CATALOG.md, catalog-index.json'));
      assert.equal(state(repo), before);
    });
    withTwoMajors((repo) => {
      bump(repo, '1.0.1');
      const before = [state(repo), repo.git(['rev-parse', 'main'])];
      const result = published(repo, ['--pack', 'base', '--dry-run', ...WITH_KANBAN]);
      assert.ok(result.lines.includes('- Index: CATALOG.md, catalog-index.json (on main)'),
        result.lines.join('\n'));
      assert.deepEqual([state(repo), repo.git(['rev-parse', 'main'])], before);
    });
  });

  it('rolls back when main\'s preset cannot be read after the tag: exit 1 (acceptance 7)', () => {
    withTwoMajors((repo) => {
      repo.git(['checkout', '--quiet', 'main']);
      repo.write('presets/broken.yaml', 'title: [\n');
      const catalog = parse(readFileSync(join(repo.dir, 'catalog.yaml'), 'utf8')) as Doc;
      catalog['presets'] = [{ id: 'broken', path: 'presets/broken.yaml' }];
      repo.write('catalog.yaml', stringify(catalog));
      repo.commitAll('a preset that does not parse, on main only');
      repo.git(['checkout', '--quiet', 'maint/base/1.x']);
      bump(repo, '1.0.1');
      const before = [state(repo), repo.git(['rev-parse', 'main'])];
      const result = publish(repo, ['--pack', 'base', ...WITH_KANBAN]);
      assert.equal(result.code, 1, result.lines.join('\n'));
      assert.match(result.lines.join('\n'), /presets\/broken\.yaml does not parse.*the tag was removed/);
      assert.deepEqual([state(repo), repo.git(['rev-parse', 'main'])], before);
    });
  });

  it('rolls back when a tag main\'s catalog names is missing after the tag: exit 2 (acceptance 7)',
    () => {
      withTwoMajors((repo) => {
        bump(repo, '1.0.1');
        repo.git(['tag', '-d', 'base@2.0.0']);
        const before = [state(repo), repo.git(['rev-parse', 'main'])];
        const result = publish(repo, ['--pack', 'base', ...WITH_KANBAN]);
        assert.equal(result.code, 2, result.lines.join('\n'));
        assert.match(result.lines.join('\n'), /tag base@2\.0\.0 .*missing.*the tag was removed/);
        assert.deepEqual([state(repo), repo.git(['rev-parse', 'main'])], before);
      });
    });
});
