import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { runCheckPacks } from '../src/check-packs';
import { runIndex } from '../src/index';
import { GOLDEN_COMPAT, prepareIntake } from '../src/intake-prepare';
import { removeNewest } from '../src/intake-rehearsal';
import type { TestRepo } from './support/git-repo';
import { NEXT, consistentRepo, fakeResolver, read, status } from './support/intake-tree';
import { FROZEN_COMPAT, STUB_RELEASE } from './support/published-repo';
import { REPO_ROOT } from './support/paths';

const CLI = join(REPO_ROOT, 'dist', 'src', 'intake-rehearsal-cli.js');
const PIN = `src/matrix/wingfoil-${NEXT}`;
const TRACKED = ['CATALOG.md', 'catalog-index.json', 'catalog.yaml', 'compat.yaml', GOLDEN_COMPAT];

/** The tree before and after NEXT is recorded (prepared and committed). */
function recordedRepo(body: (repo: TestRepo, before: Map<string, string>) => void): void {
  consistentRepo((repo) => {
    const before = new Map(TRACKED.map((path) => [path, read(repo, path)]));
    const result = prepareIntake(repo.dir, NEXT, fakeResolver());
    assert.equal(result.code, 0, result.lines.join('\n'));
    repo.commitAll(`record ${NEXT}`);
    body(repo, before);
  });
}

describe('intake:rehearse (task-081)', () => {
  it('removes the newest release: the tree as it stood before its record', () => {
    recordedRepo((repo, before) => {
      const result = removeNewest(repo.dir);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.equal(result.version, NEXT);
      assert.deepEqual(result.lines, [
        'wrote CATALOG.md', 'wrote catalog-index.json', 'wrote catalog.yaml', 'wrote compat.yaml',
        `removed ${PIN}/package-lock.json`, `removed ${PIN}/package.json`,
        `wrote ${GOLDEN_COMPAT}`,
      ]);
      // The fixture's plain `wingfoil: 9.0.0` comes back double-quoted, as task-080 writes a range.
      for (const [path, text] of before) {
        const expected = path === 'catalog.yaml'
          ? text.replace(`wingfoil: ${STUB_RELEASE}\n`, `wingfoil: "${STUB_RELEASE}"\n`) : text;
        assert.equal(read(repo, path), expected, path);
      }
      assert.ok(!existsSync(join(repo.dir, PIN)), 'the pin folder removed');
      assert.equal(runIndex(['--tree', repo.dir, '--check']).code, 0);
      const packs = runCheckPacks(repo.dir);
      assert.equal(packs.code, 0, packs.lines.join('\n'));
    });
  });

  it('leaves a tree intake:prepare prepares again, giving back the row and the ranges', () => {
    recordedRepo((repo) => {
      const recorded = new Map(TRACKED.map((path) => [path, read(repo, path)]));
      assert.equal(removeNewest(repo.dir).code, 0);
      const result = prepareIntake(repo.dir, NEXT, fakeResolver());
      assert.equal(result.code, 0, result.lines.join('\n'));
      for (const [path, text] of recorded) assert.equal(read(repo, path), text, path);
      assert.equal(status(repo), '');
    });
  });

  it('removes a release with no pin folder, and keeps every other byte of compat.yaml', () => {
    recordedRepo((repo) => {
      rmSync(join(repo.dir, PIN), { recursive: true });
      repo.commitAll('no pin folder');
      const compat = read(repo, 'compat.yaml');
      const result = removeNewest(repo.dir);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.equal(result.version, NEXT);
      assert.ok(result.lines.every((line) => line.startsWith('wrote ')));
      const kept = read(repo, 'compat.yaml');
      assert.ok(compat.startsWith(kept));
      assert.match(compat.slice(kept.length), new RegExp(`^ {2}- wingfoil: ${NEXT}\\n`));
      assert.equal(read(repo, GOLDEN_COMPAT), kept);
      assert.equal(runIndex(['--tree', repo.dir, '--check']).code, 0);
    });
  });

  const refusals: [string, (repo: TestRepo) => void][] = [
    ['a compat.yaml with fewer than two releases', (repo) => {
      for (const path of ['compat.yaml', GOLDEN_COMPAT]) repo.write(path, FROZEN_COMPAT);
      repo.commitAll('one release');
    }],
    ['a removal that leaves a range no release meets', (repo) => {
      assert.equal(removeNewest(repo.dir).code, 0);
      repo.commitAll(`${NEXT} removed`);
    }],
    ['a golden fixture not byte-equal', (repo) => {
      repo.write(GOLDEN_COMPAT, `${read(repo, GOLDEN_COMPAT)}# drift\n`);
      repo.commitAll('drift');
    }],
    ['text after the last release row', (repo) => {
      for (const path of ['compat.yaml', GOLDEN_COMPAT]) {
        repo.write(path, `${read(repo, path)}# trailing\n`);
      }
      repo.commitAll('trailing');
    }],
    ['a range that does not recompute', (repo) => {
      repo.write('catalog.yaml', read(repo, 'catalog.yaml').replace(/wingfoil: ([^\n]+)\n/,
        'wingfoil: ">=0.0.1"\n'));
      repo.commitAll('a range');
    }],
    ['an index not up to date', (repo) => {
      repo.write('CATALOG.md', `${read(repo, 'CATALOG.md')}\nstale\n`);
      repo.commitAll('stale');
    }],
  ];
  for (const [label, setup] of refusals) {
    it(`refuses ${label}, writing nothing`, () => {
      recordedRepo((repo) => {
        setup(repo);
        const before = status(repo);
        const texts = TRACKED.map((path) => read(repo, path));
        const result = removeNewest(repo.dir);
        assert.equal(result.code, 1, label);
        assert.match(result.lines.join('\n'), /^intake:rehearse: .*, nothing written$/);
        assert.equal(status(repo), before);
        assert.deepEqual(TRACKED.map((path) => read(repo, path)), texts);
      });
    });
  }

  it('refuses a tree that is not its repository\'s top level', () => {
    recordedRepo((repo) => {
      const result = removeNewest(join(repo.dir, 'packs'));
      assert.equal(result.code, 1);
      assert.match(result.lines.join('\n'), /not the top level/);
    });
  });
});

describe('the intake:rehearse command (task-081)', () => {
  it('exits 0 with its lines, 1 on a refusal, 2 on a wrong command line', () => {
    recordedRepo((repo) => {
      const run = (args: string[]): { status: number | null; stdout: string; stderr: string } => {
        const result = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
        return { status: result.status, stdout: result.stdout, stderr: result.stderr };
      };
      const ok = run(['--tree', repo.dir]);
      assert.equal(ok.status, 0, ok.stderr);
      assert.match(ok.stdout, /^wrote CATALOG\.md\n/);
      rmSync(join(repo.dir, 'catalog.yaml'));
      const refused = run(['--tree', repo.dir]);
      assert.equal(refused.status, 1);
      assert.match(refused.stderr, /^intake:rehearse: /);
      assert.equal(refused.stdout, '');
      for (const args of [['9.0.1'], ['--bad'], ['--tree']]) {
        const bad = run(args);
        assert.equal(bad.status, 2, args.join(' '));
        assert.match(bad.stderr, /usage: intake:rehearse/);
      }
      assert.ok(readFileSync(join(repo.dir, 'compat.yaml'), 'utf8').length > 0);
    });
  });
});
