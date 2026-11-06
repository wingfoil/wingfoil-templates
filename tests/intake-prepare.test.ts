import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import {
  appendFileSync, chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { describe, it } from 'node:test';

import { checkPins } from '../src/check-pins';
import { rootOutputs, runIndex } from '../src/index';
import { workingTree } from '../src/index-source';
import { GOLDEN_COMPAT, NOTES_PLACEHOLDER, prepareIntake } from '../src/intake-prepare';
import type { Resolver } from '../src/intake-prepare';
import { withRepo } from './support/git-repo';
import type { TestRepo } from './support/git-repo';
import { STUB_RELEASE, publishByHand, treeRepo } from './support/published-repo';
import { REPO_ROOT } from './support/paths';

const CLI = join(REPO_ROOT, 'dist', 'src', 'intake-prepare-cli.js');
/** The next patch after the fixture's fictional release, STUB_RELEASE (9.0.0). */
const NEXT = '9.0.1';
const READS = '{ dna: [1], memory: [1], roles: [1], workflows: [1], workflow: [1], directive: [1], '
  + 'memory-template: [1] }';

/** A lockfile as npm writes one for a matrix pin, at `version`. */
function lockfile(version: string, wingfoil = version): string {
  const name = `wingfoil-matrix-${version}`;
  return `${JSON.stringify({
    name, lockfileVersion: 3, requires: true,
    packages: {
      '': { name, dependencies: { wingfoil } },
      'node_modules/wingfoil': { version: wingfoil,
        resolved: `https://registry.npmjs.org/wingfoil/-/wingfoil-${wingfoil}.tgz`,
        integrity: 'sha512-AAAA' },
    },
  }, null, 2)}\n`;
}

/** The resolver tests inject: no npm runs; the manifests it was given are kept. */
function fakeResolver(version = NEXT): Resolver & { manifests: string[] } {
  const manifests: string[] = [];
  const resolve = ((manifest: string): string => {
    manifests.push(manifest);
    return lockfile(version);
  }) as Resolver & { manifests: string[] };
  resolve.manifests = manifests;
  return resolve;
}

/**
 * A consistent tree: the fixture packs with base published (its range computed from the fixture
 * compat.yaml, FROZEN_COMPAT plus STUB_RELEASE), the golden fixture's compat.yaml equal to the
 * root's, the index up to date, all committed. Never this repository's compat.yaml or catalog.yaml.
 */
function consistentRepo(body: (repo: TestRepo) => void): void {
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

function read(repo: TestRepo, path: string): string {
  return readFileSync(join(repo.dir, path), 'utf8');
}

function status(repo: TestRepo): string {
  return repo.git(['status', '--porcelain', '--untracked-files=all']);
}

const ROW = `  - wingfoil: ${NEXT}
    format_key: true
    reads: ${READS}
    capabilities: []
    notes: "${NOTES_PLACEHOLDER}"
`;

const WRITTEN = [
  'CATALOG.md', 'catalog-index.json', 'catalog.yaml', 'compat.yaml',
  `src/matrix/wingfoil-${NEXT}/package-lock.json`, `src/matrix/wingfoil-${NEXT}/package.json`,
  GOLDEN_COMPAT,
];

describe('intake:prepare (task-080)', () => {
  it('writes the pin, the compat.yaml rows, the ranges and the index, in byte order', () => {
    consistentRepo((repo) => {
      const compat = read(repo, 'compat.yaml');
      const catalog = read(repo, 'catalog.yaml');
      const resolve = fakeResolver();
      const result = prepareIntake(repo.dir, NEXT, resolve);
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.deepEqual(result.lines, WRITTEN.map((path) => `wrote ${path}`));
      // The row appended, every other byte kept; the golden fixture's the same (dl-010).
      assert.equal(read(repo, 'compat.yaml'), `${compat}${ROW}`);
      assert.equal(read(repo, GOLDEN_COMPAT), `${compat}${ROW}`);
      // Only the range scalar changes, double-quoted: a plain `>=…` would be a block scalar.
      assert.equal(read(repo, 'catalog.yaml'),
        catalog.replace(`wingfoil: ${STUB_RELEASE}\n`,
          `wingfoil: ">=${STUB_RELEASE} <=${NEXT}"\n`));
      assert.notEqual(read(repo, 'catalog.yaml'), catalog);
      // The index's root outputs as npm run index computes them; --check passes.
      for (const [path, text] of rootOutputs(repo.dir, workingTree(repo.dir))) {
        assert.equal(read(repo, path), text, path);
      }
      assert.equal(runIndex(['--tree', repo.dir, '--check']).code, 0);
      // The pin: the fixed manifest given to the resolver, its lockfile written byte for byte.
      const manifest = `${JSON.stringify({ name: `wingfoil-matrix-${NEXT}`, private: true,
        description: `WingFoil ${NEXT} as the compatibility matrix installs it: exact pin, `
          + 'committed lockfile',
        dependencies: { wingfoil: NEXT } }, null, 2)}\n`;
      assert.deepEqual(resolve.manifests, [manifest]);
      const pin = `src/matrix/wingfoil-${NEXT}`;
      assert.equal(read(repo, `${pin}/package.json`), manifest);
      assert.equal(read(repo, `${pin}/package-lock.json`), lockfile(NEXT));
      assert.deepEqual(checkPins(JSON.parse(manifest), JSON.parse(lockfile(NEXT))), []);
      // Nothing else of the tree changes.
      const changed = status(repo).split('\n').filter((line) => line !== '')
        .map((line) => line.slice(3)).sort();
      assert.deepEqual(changed, [...WRITTEN].sort());
    });
  });

  it('carries reads and capabilities forward from the newest recorded release (dl-042 I2)', () => {
    consistentRepo((repo) => {
      const reads = '{ dna: [1], memory: [1], roles: [1], workflows: [1], workflow: [1], '
        + 'directive: [1], memory-template: [1, 2] }';
      for (const path of ['compat.yaml', GOLDEN_COMPAT]) {
        const text = read(repo, path).replace(/( {4}reads: )\{[^}]*\}(\n {4}capabilities: )\[\]\n$/,
          `$1${reads}$2[workflow-engine]\n`);
        repo.write(path, text);
      }
      // The changed row moves no range: base's formats and capabilities still match it.
      repo.commitAll('the newest release reads more');
      const result = prepareIntake(repo.dir, NEXT, fakeResolver());
      assert.equal(result.code, 0, result.lines.join('\n'));
      assert.ok(read(repo, 'compat.yaml').endsWith(`  - wingfoil: ${NEXT}\n    format_key: true\n`
        + `    reads: ${reads}\n    capabilities: [workflow-engine]\n`
        + `    notes: "${NOTES_PLACEHOLDER}"\n`));
    });
  });

  it('is deterministic: two runs on one tree with one resolver are byte-identical', () => {
    consistentRepo((repo) => {
      assert.equal(prepareIntake(repo.dir, NEXT, fakeResolver()).code, 0);
      const first = WRITTEN.map((path) => read(repo, path));
      repo.git(['reset', '--hard', '--quiet']);
      repo.git(['clean', '-fdq']);
      assert.equal(status(repo), '');
      assert.equal(prepareIntake(repo.dir, NEXT, fakeResolver()).code, 0);
      assert.deepEqual(WRITTEN.map((path) => read(repo, path)), first);
    });
  });

  it('prepares a minor and a major too: classing is task (C)\'s', () => {
    for (const version of ['9.1.0', '10.0.0']) {
      consistentRepo((repo) => {
        const result = prepareIntake(repo.dir, version, fakeResolver(version));
        assert.equal(result.code, 0, result.lines.join('\n'));
        assert.ok(existsSync(join(repo.dir, `src/matrix/wingfoil-${version}/package-lock.json`)));
      });
    }
  });

  it('keeps a range\'s quotes: double-quoted stays double-quoted, single-quoted single', () => {
    for (const [quoted, expected] of [[`"${STUB_RELEASE}"`, `">=${STUB_RELEASE} <=${NEXT}"`],
      [`'${STUB_RELEASE}'`, `'>=${STUB_RELEASE} <=${NEXT}'`]] as const) {
      consistentRepo((repo) => {
        repo.write('catalog.yaml', read(repo, 'catalog.yaml')
          .replace(`wingfoil: ${STUB_RELEASE}\n`, `wingfoil: ${quoted}\n`));
        repo.commitAll('a quoted range');
        const result = prepareIntake(repo.dir, NEXT, fakeResolver());
        assert.equal(result.code, 0, result.lines.join('\n'));
        assert.ok(read(repo, 'catalog.yaml').includes(`wingfoil: ${expected}\n`));
      });
    }
  });

  it('keeps a catalog.yaml comment and every byte outside the range scalars', () => {
    consistentRepo((repo) => {
      repo.write('catalog.yaml', `# a comment kept\n${read(repo, 'catalog.yaml')}`);
      repo.commitAll('a comment');
      assert.equal(prepareIntake(repo.dir, NEXT, fakeResolver()).code, 0);
      assert.ok(read(repo, 'catalog.yaml').startsWith('# a comment kept\n'));
    });
  });

  /** A refusal: exit 1, its reason named, nothing written; the resolver never asked. */
  function refuses(version: string, reason: RegExp, change?: (repo: TestRepo) => void,
    resolve?: Resolver): void {
    consistentRepo((repo) => {
      if (change !== undefined) {
        change(repo);
        repo.commitAll('the change');
      }
      const result = prepareIntake(repo.dir, version, resolve ?? fakeResolver(version));
      assert.equal(result.code, 1);
      assert.match(result.lines.join('\n'), reason);
      assert.match(result.lines.join('\n'), /nothing written/);
      assert.equal(status(repo), '');
    });
  }

  it('refuses a version that is not a strict X.Y.Z', () => {
    for (const version of ['9.0', 'v9.0.1', '9.0.01', '9.0.1-rc.1', '9.0.1 ', '']) {
      refuses(version, /not a strict X\.Y\.Z/);
    }
  });

  it('refuses a version already recorded, and one not greater than the newest (a backport)', () => {
    refuses(STUB_RELEASE, /already recorded/);
    refuses('0.2.2', /already recorded/);
    refuses('0.3.0', /not greater than the newest recorded release, 9\.0\.0/);
  });

  it('refuses a golden fixture compat.yaml that differs from the root\'s (dl-010)', () => {
    refuses(NEXT, /tests\/fixtures\/compose\/tree\/compat\.yaml is not byte-equal to compat\.yaml/,
      (repo) => appendFileSync(join(repo.dir, GOLDEN_COMPAT), '# drift\n'));
  });

  it('refuses a pin folder already present', () => {
    refuses(NEXT, /src\/matrix\/wingfoil-9\.0\.1 already exists/,
      (repo) => repo.write(`src/matrix/wingfoil-${NEXT}/package.json`, '{}\n'));
  });

  it('refuses text after the last release row of compat.yaml', () => {
    refuses(NEXT, /text follows the last release row/, (repo) => {
      for (const path of ['compat.yaml', GOLDEN_COMPAT]) {
        appendFileSync(join(repo.dir, path), '# trailing\n');
      }
    });
  });

  it('refuses an indented comment after the last row, and CRLF line endings', () => {
    refuses(NEXT, /text follows the last release row/, (repo) => {
      for (const path of ['compat.yaml', GOLDEN_COMPAT]) {
        appendFileSync(join(repo.dir, path), '    # a planned row\n');
      }
    });
    refuses(NEXT, /compat\.yaml: not LF line endings/, (repo) => {
      for (const path of ['compat.yaml', GOLDEN_COMPAT]) {
        repo.write(path, read(repo, path).replace(/\n/g, '\r\n'));
      }
    });
  });

  it('refuses a catalog.yaml that is not valid YAML, or whose range is an alias', () => {
    refuses(NEXT, /catalog\.yaml: not valid YAML/,
      (repo) => appendFileSync(join(repo.dir, 'catalog.yaml'), 'packs: [\n'));
    refuses(NEXT, /base@1\.0\.0: the range is not a plain or quoted scalar/, (repo) => {
      repo.write('catalog.yaml', read(repo, 'catalog.yaml')
        .replace(`wingfoil: ${STUB_RELEASE}\n`, 'wingfoil: *range\n')
        .replace(/^packs:/m, `x-range: &range "${STUB_RELEASE}"\npacks:`));
    });
  });

  it('refuses a catalog.yaml range that does not recompute from the current compat.yaml', () => {
    const recomputes = /base@1\.0\.0: the range .* recomputes from compat\.yaml to "9\.0\.0"/;
    refuses(NEXT, recomputes, (repo) => {
      repo.write('catalog.yaml', read(repo, 'catalog.yaml')
        .replace(`wingfoil: ${STUB_RELEASE}\n`, 'wingfoil: ">=0.2.2 <=9.0.0"\n'));
      for (const [path, text] of rootOutputs(repo.dir, workingTree(repo.dir))) {
        repo.write(path, text);
      }
    });
  });

  it('refuses an index not up to date: every file npm run index -- --check compares', () => {
    refuses(NEXT, /the index is not up to date: CATALOG\.md/,
      (repo) => appendFileSync(join(repo.dir, 'CATALOG.md'), 'stale\n'));
    refuses(NEXT, /the index is not up to date: llms\.txt/,
      (repo) => appendFileSync(join(repo.dir, 'llms.txt'), 'stale\n'));
  });

  it('refuses when the lockfile cannot be resolved, naming the step', () => {
    refuses(NEXT, /the lockfile: npm install exited 1/, undefined, () => {
      throw new Error('npm install exited 1');
    });
  });

  it('refuses a lockfile that does not pin the version, or has no packages map', () => {
    refuses(NEXT, /the lockfile: .*package-lock\.json has wingfoil@9\.0\.0/, undefined,
      () => lockfile(NEXT, STUB_RELEASE));
    refuses(NEXT, /the lockfile: no `packages` map \(lockfileVersion < 2\)/, undefined,
      () => `${JSON.stringify({ name: 'x', lockfileVersion: 1, dependencies: {} }, null, 2)}\n`);
    refuses(NEXT, /the lockfile: not JSON/, undefined, () => 'not json');
    refuses(NEXT, /the lockfile: no `packages` map \(lockfileVersion < 2\)/, undefined, () => {
      const lock = JSON.parse(lockfile(NEXT)) as Record<string, unknown>;
      return `${JSON.stringify({ ...lock, lockfileVersion: 1 }, null, 2)}\n`;
    });
  });

  it('names the files already written when a write fails (the one exception)', (t) => {
    if (process.getuid?.() === 0) {
      t.skip('root ignores a read-only directory');
      return;
    }
    consistentRepo((repo) => {
      mkdirSync(join(repo.dir, 'src', 'matrix'), { recursive: true });
      chmodSync(join(repo.dir, 'src', 'matrix'), 0o555);
      try {
        const result = prepareIntake(repo.dir, NEXT, fakeResolver());
        assert.equal(result.code, 1);
        assert.deepEqual(result.lines.slice(0, 4),
          WRITTEN.slice(0, 4).map((path) => `wrote ${path}`));
        assert.match(result.lines[4] ?? '', new RegExp('writing src/matrix/wingfoil-9\\.0\\.1/'
          + 'package-lock\\.json: .*; the files above were written'));
      } finally {
        chmodSync(join(repo.dir, 'src', 'matrix'), 0o755);
      }
    });
  });

  it('refuses a tree that is not the top level of a git repository', () => {
    consistentRepo((repo) => {
      mkdirSync(join(repo.dir, 'sub'));
      const result = prepareIntake(join(repo.dir, 'sub'), NEXT, fakeResolver());
      assert.equal(result.code, 1);
      assert.match(result.lines.join('\n'), /not the top level of its git repository/);
      assert.equal(status(repo), '');
    });
  });
});

interface Run { status: number | null; stdout: string; stderr: string }

function cli(args: string[], env: NodeJS.ProcessEnv = process.env): Run {
  const result = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8', env });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

/** A stub npm on PATH: records its arguments, its directory and the manifest it found there. */
function stubNpm(record: string, body: string[]): { env: NodeJS.ProcessEnv; dispose: () => void } {
  const dir = mkdtempSync(join(tmpdir(), 'intake-prepare-npm-'));
  const stub = join(dir, 'npm');
  writeFileSync(stub, ['#!/usr/bin/env bash',
    `printf '%s' "$*" > '${record}/args'`, `pwd > '${record}/cwd'`,
    `cp package.json '${record}/manifest' 2>/dev/null`, ...body, ''].join('\n'));
  chmodSync(stub, 0o755);
  return { env: { ...process.env, PATH: `${dir}${delimiter}${process.env['PATH'] ?? ''}` },
    dispose: () => rmSync(dir, { recursive: true, force: true }) };
}

describe('npm run intake:prepare (task-080)', () => {
  it('runs npm install --package-lock-only --ignore-scripts outside the tree', () => {
    consistentRepo((repo) => {
      const record = mkdtempSync(join(tmpdir(), 'intake-prepare-record-'));
      const source = join(record, 'lock.json');
      writeFileSync(source, lockfile(NEXT));
      const npm = stubNpm(record, [`cp '${source}' package-lock.json`]);
      try {
        const run = cli(['--tree', repo.dir, NEXT], npm.env);
        assert.equal(run.status, 0, run.stderr);
        assert.deepEqual(run.stdout.trim().split('\n'), WRITTEN.map((path) => `wrote ${path}`));
        assert.equal(readFileSync(join(record, 'args'), 'utf8'),
          'install --package-lock-only --ignore-scripts');
        const cwd = readFileSync(join(record, 'cwd'), 'utf8').trim();
        assert.ok(!cwd.startsWith(repo.home), cwd);
        assert.ok(!existsSync(cwd), 'the temporary directory is removed');
        assert.equal(readFileSync(join(record, 'manifest'), 'utf8'),
          read(repo, `src/matrix/wingfoil-${NEXT}/package.json`));
        assert.equal(read(repo, `src/matrix/wingfoil-${NEXT}/package-lock.json`), lockfile(NEXT));
      } finally {
        npm.dispose();
        rmSync(record, { recursive: true, force: true });
      }
    });
  });

  it('exits 1 naming the step when npm fails, and writes nothing', () => {
    consistentRepo((repo) => {
      const record = mkdtempSync(join(tmpdir(), 'intake-prepare-record-'));
      const npm = stubNpm(record, ['echo "npm error" >&2', 'echo "no registry" >&2', 'exit 3']);
      try {
        const run = cli(['--tree', repo.dir, NEXT], npm.env);
        assert.equal(run.status, 1);
        assert.match(run.stderr,
          /the lockfile: npm install exited 3 \(no registry\), nothing written/);
        assert.equal(run.stdout, '');
        assert.equal(status(repo), '');
        const cwd = readFileSync(join(record, 'cwd'), 'utf8').trim();
        assert.ok(!existsSync(cwd), 'the temporary directory is removed on a failure too');
      } finally {
        npm.dispose();
        rmSync(record, { recursive: true, force: true });
      }
    });
  });

  it('exits 2 on a wrong command line', () => {
    withRepo((repo) => {
      for (const args of [['--tree', repo.dir], ['--tree', repo.dir, '9.0.1', '9.0.2'],
        ['--tree', repo.dir, '--bogus', '9.0.1'], ['9.0.1', '--tree']]) {
        const run = cli(args);
        assert.equal(run.status, 2, `${args.join(' ')}: ${run.stderr}`);
        assert.match(run.stderr, /usage: intake:prepare <version> \[--tree <dir>\]/);
      }
    });
  });

  it('exits 1 on a refusal, naming it, and never runs npm', () => {
    consistentRepo((repo) => {
      const record = mkdtempSync(join(tmpdir(), 'intake-prepare-record-'));
      const npm = stubNpm(record, ['exit 9']);
      try {
        const run = cli(['--tree', repo.dir, STUB_RELEASE], npm.env);
        assert.equal(run.status, 1);
        assert.match(run.stderr, /9\.0\.0 is already recorded in compat\.yaml, nothing written/);
        assert.equal(status(repo), '');
        assert.ok(!existsSync(join(record, 'args')), 'npm never runs on a refusal');
      } finally {
        npm.dispose();
        rmSync(record, { recursive: true, force: true });
      }
    });
  });
});
