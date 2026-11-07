import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { allowlist, applyArtifact, collectArtifact } from '../src/intake-artifact';
import { GOLDEN_COMPAT, prepareIntake } from '../src/intake-prepare';
import type { TestRepo } from './support/git-repo';
import { NEXT, consistentRepo, fakeResolver, read, status } from './support/intake-tree';
import { REPO_ROOT } from './support/paths';

const CLI = join(REPO_ROOT, 'dist', 'src', 'intake-artifact-cli.js');
const PIN = `src/matrix/wingfoil-${NEXT}`;
const ALLOWED = [
  'CATALOG.md', 'catalog-index.json', 'catalog.yaml', 'compat.yaml',
  `${PIN}/package-lock.json`, `${PIN}/package.json`, GOLDEN_COMPAT,
];

function sha256(text: string | Buffer): string {
  return createHash('sha256').update(text).digest('hex');
}

/** A scratch directory outside every tree, removed by the caller's `finally`. */
function scratch(): string {
  return mkdtempSync(join(tmpdir(), 'intake-artifact-test-'));
}

/** The repository with NEXT prepared and not committed. */
function preparedRepo(body: (repo: TestRepo) => void): void {
  consistentRepo((repo) => {
    const result = prepareIntake(repo.dir, NEXT, fakeResolver());
    assert.equal(result.code, 0, result.lines.join('\n'));
    body(repo);
  });
}

/** Every file under a directory, relative, sorted. */
function files(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => !entry.isDirectory())
    .map((entry) => join(entry.parentPath, entry.name).slice(dir.length + 1)).sort();
}

/** The prepared files' texts, then the tree put back to HEAD. */
function collected(repo: TestRepo, out: string): Map<string, string> {
  const result = collectArtifact(repo.dir, NEXT, out);
  assert.equal(result.code, 0, result.lines.join('\n'));
  const texts = new Map(ALLOWED.map((path) => [path, read(repo, path)]));
  repo.git(['checkout', '--', '.']);
  repo.git(['clean', '-fdq']);
  assert.equal(status(repo), '');
  return texts;
}

function cli(args: string[]): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe('the allowlist (task-081)', () => {
  it('is task-080\'s seven files for the version, in byte order', () => {
    assert.deepEqual(allowlist(NEXT), ALLOWED);
  });
});

describe('intake:collect (task-081)', () => {
  it('copies the changed allowlisted files, their sha256s in byte order, and the base', () => {
    preparedRepo((repo) => {
      const out = scratch();
      try {
        const result = collectArtifact(repo.dir, NEXT, join(out, 'intake'));
        assert.equal(result.code, 0, result.lines.join('\n'));
        const sums = ALLOWED.map((path) => `${sha256(read(repo, path))}  ${path}`);
        assert.deepEqual(result.lines, sums);
        assert.equal(readFileSync(join(out, 'intake', 'SHA256SUMS'), 'utf8'),
          `${sums.join('\n')}\n`);
        assert.equal(readFileSync(join(out, 'intake', 'BASE'), 'utf8'),
          `${repo.git(['rev-parse', 'HEAD']).trim()}\n`);
        for (const path of ALLOWED) {
          assert.equal(readFileSync(join(out, 'intake', 'files', path), 'utf8'), read(repo, path));
        }
        assert.deepEqual(files(join(out, 'intake')),
          ['BASE', 'SHA256SUMS', ...ALLOWED.map((path) => join('files', path))].sort());
      } finally {
        rmSync(out, { recursive: true, force: true });
      }
    });
  });

  it('always copies the pin\'s two files, and only the files that differ from HEAD', () => {
    preparedRepo((repo) => {
      repo.commitAll('prepared');
      const out = scratch();
      try {
        const result = collectArtifact(repo.dir, NEXT, join(out, 'intake'));
        assert.equal(result.code, 0, result.lines.join('\n'));
        assert.deepEqual(result.lines.map((line) => line.slice(66)),
          [`${PIN}/package-lock.json`, `${PIN}/package.json`]);
      } finally {
        rmSync(out, { recursive: true, force: true });
      }
    });
  });

  const refusals: [string, (repo: TestRepo, out: string) => [string, string]][] = [
    ['a version not strict', (_repo, out) => ['v9.0.1', out]],
    ['an --out inside the tree', (repo) => [NEXT, join(repo.dir, 'out')]],
    ['an --out through a link into the tree', (repo, out) => {
      symlinkSync(repo.dir, out);
      return [NEXT, join(out, 'new')];
    }],
    ['an --out existing and not empty', (_repo, out) => {
      mkdirSync(out);
      writeFileSync(join(out, 'x'), 'x');
      return [NEXT, out];
    }],
    ['a changed path outside the allowlist', (repo, out) => {
      repo.write('README.md', 'changed\n');
      return [NEXT, out];
    }],
    ['an untracked path outside the allowlist', (repo, out) => {
      repo.write('src/matrix/wingfoil-9.0.2/package.json', '{}\n');
      return [NEXT, out];
    }],
    ['a missing allowlisted file', (repo, out) => {
      rmSync(join(repo.dir, 'CATALOG.md'));
      return [NEXT, out];
    }],
  ];
  for (const [label, setup] of refusals) {
    it(`refuses ${label}, writing nothing under --out`, () => {
      preparedRepo((repo) => {
        const base = scratch();
        try {
          const [version, out] = setup(repo, join(base, 'intake'));
          const before = files(out);
          const result = collectArtifact(repo.dir, version, out);
          assert.equal(result.code, 1, label);
          assert.match(result.lines.join('\n'), /^intake:collect: .*, nothing written$/);
          assert.deepEqual(files(out), before);
        } finally {
          rmSync(base, { recursive: true, force: true });
        }
      });
    });
  }
});

describe('intake:apply (task-081)', () => {
  it('writes every listed file byte for byte: collect then apply is a round trip', () => {
    preparedRepo((repo) => {
      const out = join(scratch(), 'intake');
      try {
        const texts = collected(repo, out);
        const result = applyArtifact(repo.dir, out, NEXT);
        assert.equal(result.code, 0, result.lines.join('\n'));
        assert.deepEqual(result.lines, ALLOWED.map((path) => `applied ${path}`));
        for (const path of ALLOWED) assert.equal(read(repo, path), texts.get(path), path);
      } finally {
        rmSync(join(out, '..'), { recursive: true, force: true });
      }
    });
  });

  it('applies on a moved base when no allowlisted path changed since', () => {
    preparedRepo((repo) => {
      const out = join(scratch(), 'intake');
      try {
        collected(repo, out);
        repo.write('NOTES.md', 'an unrelated commit\n');
        repo.commitAll('unrelated');
        // A change outside the allowlist does not count as an uncommitted change.
        repo.write('NOTES.md', 'an unrelated edit\n');
        repo.write('UNTRACKED.md', 'untracked\n');
        assert.equal(applyArtifact(repo.dir, out, NEXT).code, 0);
      } finally {
        rmSync(join(out, '..'), { recursive: true, force: true });
      }
    });
  });

  const sums = (out: string): string => readFileSync(join(out, 'SHA256SUMS'), 'utf8');
  const refusals: [string, (repo: TestRepo, out: string) => string, RegExp?][] = [
    ['a version not strict', () => '9.0'],
    ['the artifact of another version', () => '9.0.2'],
    ['a BASE not 40 hex', (_repo, out) => {
      writeFileSync(join(out, 'BASE'), 'HEAD\n');
      return NEXT;
    }],
    ['a BASE unknown to the tree', (_repo, out) => {
      writeFileSync(join(out, 'BASE'), `${'0'.repeat(40)}\n`);
      return NEXT;
    }],
    ['a malformed SHA256SUMS line', (_repo, out) => {
      writeFileSync(join(out, 'SHA256SUMS'), `${sums(out)}not a line\n`);
      return NEXT;
    }],
    ['a path outside the allowlist', (_repo, out) => {
      mkdirSync(join(out, 'files', 'docs'), { recursive: true });
      writeFileSync(join(out, 'files', 'docs', 'x.md'), 'x');
      writeFileSync(join(out, 'SHA256SUMS'), `${sums(out)}${sha256('x')}  docs/x.md\n`);
      return NEXT;
    }],
    ['a `..` path', (_repo, out) => {
      writeFileSync(join(out, 'SHA256SUMS'),
        `${sums(out)}${sha256('x')}  src/matrix/../../x\n`);
      return NEXT;
    }],
    ['an absolute path', (_repo, out) => {
      writeFileSync(join(out, 'SHA256SUMS'), `${sums(out)}${sha256('x')}  /etc/x\n`);
      return NEXT;
    }],
    ['a sha256 that differs', (_repo, out) => {
      writeFileSync(join(out, 'files', 'catalog.yaml'), 'tampered\n');
      return NEXT;
    }],
    ['a listed file missing', (_repo, out) => {
      rmSync(join(out, 'files', 'CATALOG.md'));
      return NEXT;
    }],
    ['the pin\'s two files not both listed', (_repo, out) => {
      writeFileSync(join(out, 'SHA256SUMS'), sums(out).split('\n')
        .filter((line) => !line.endsWith('/package.json')).join('\n'));
      rmSync(join(out, 'files', PIN, 'package.json'));
      return NEXT;
    }],
    ['a file under files/ not listed', (_repo, out) => {
      writeFileSync(join(out, 'files', 'extra.txt'), 'x');
      return NEXT;
    }],
    // The link's target holds the listed bytes, so only the link check refuses it.
    ['a symbolic link under files/', (_repo, out) => {
      const file = join(out, 'files', 'CATALOG.md');
      const target = join(out, '..', 'catalog-copy.md');
      writeFileSync(target, readFileSync(file));
      rmSync(file);
      symlinkSync(target, file);
      return NEXT;
    }, /symbolic link in the artifact/],
    // A committed link: the tree is clean, so only the link check refuses it.
    ['a symbolic link at a target path', (repo) => {
      rmSync(join(repo.dir, 'CATALOG.md'));
      symlinkSync('README.md', join(repo.dir, 'CATALOG.md'));
      repo.commitAll('a link');
      return NEXT;
    }, /CATALOG\.md: a symbolic link in the tree/],
    ['a staged rename of an allowlisted path', (repo) => {
      repo.git(['mv', 'catalog.yaml', 'catalog-moved.yaml']);
      return NEXT;
    }, /uncommitted changes/],
    ['an allowlisted path with uncommitted changes', (repo) => {
      repo.write('catalog.yaml', `${read(repo, 'catalog.yaml')}# local\n`);
      return NEXT;
    }],
    ['a moved base with an allowlisted path changed since', (repo) => {
      repo.write('catalog.yaml', `${read(repo, 'catalog.yaml')}# moved\n`);
      repo.commitAll('moved');
      return NEXT;
    }],
  ];
  for (const [label, setup, why] of refusals) {
    it(`refuses ${label}, writing nothing`, () => {
      preparedRepo((repo) => {
        const out = join(scratch(), 'intake');
        try {
          collected(repo, out);
          const version = setup(repo, out);
          const before = status(repo);
          const head = new Map(ALLOWED.map((path) => [path,
            existsSync(join(repo.dir, path)) ? readFileSync(join(repo.dir, path)) : undefined]));
          const result = applyArtifact(repo.dir, out, version);
          assert.equal(result.code, 1, label);
          assert.match(result.lines.join('\n'), /^intake:apply: .*, nothing written$/);
          if (why !== undefined) assert.match(result.lines.join('\n'), why);
          assert.equal(status(repo), before);
          for (const [path, bytes] of head) {
            const now = existsSync(join(repo.dir, path)) ? readFileSync(join(repo.dir, path))
              : undefined;
            assert.deepEqual(now, bytes, path);
          }
        } finally {
          rmSync(join(out, '..'), { recursive: true, force: true });
        }
      });
    });
  }
});

describe('the intake:collect and intake:apply commands (task-081)', () => {
  it('exit 0 with their lines, 1 on a refusal, 2 on a wrong command line', () => {
    preparedRepo((repo) => {
      const out = join(scratch(), 'intake');
      try {
        const collect = cli(['collect', NEXT, '--out', out, '--tree', repo.dir]);
        assert.equal(collect.status, 0, collect.stderr);
        assert.equal(collect.stdout.split('\n').filter((line) => line !== '').length, 7);
        assert.equal(cli(['collect', NEXT, '--out', out, '--tree', repo.dir]).status, 1);
        repo.git(['checkout', '--', '.']);
        repo.git(['clean', '-fdq']);
        const apply = cli(['apply', out, '--version', NEXT, '--tree', repo.dir]);
        assert.equal(apply.status, 0, apply.stderr);
        assert.match(apply.stdout, /^applied CATALOG\.md\n/);
        const again = cli(['apply', out, '--version', '9.0.2', '--tree', repo.dir]);
        assert.equal(again.status, 1);
        assert.match(again.stderr, /^intake:apply: /);
        for (const args of [['collect'], ['collect', NEXT], ['apply', out], ['apply'],
          ['other'], [], ['collect', NEXT, '--out', out, '--bad']]) {
          const run = cli(args);
          assert.equal(run.status, 2, args.join(' '));
          assert.match(run.stderr, /usage: intake:(collect|apply)/);
        }
      } finally {
        rmSync(join(out, '..'), { recursive: true, force: true });
      }
    });
  });
});
