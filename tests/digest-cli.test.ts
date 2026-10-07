import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { revParseArgs } from '../src/git';
import { REPO_ROOT } from './support/paths';
import { withRepo } from './support/git-repo';
import type { TestRepo } from './support/git-repo';

const CLI = join(REPO_ROOT, 'dist', 'src', 'digest-cli.js');

function run(
  args: string[],
  env?: NodeJS.ProcessEnv,
): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [CLI, ...args], { encoding: 'utf8', env });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

/** spec-001 §13 reference command, run in a checkout of the ref. */
function reference(repo: TestRepo, id: string): string {
  const script = 'git ls-files -s | awk \'$1 !~ /^100(644|755)$/ {bad=1} END {exit bad}\' && '
    + 'git ls-files | LC_ALL=C sort | while IFS= read -r f; do sha256sum "$f"; done | sha256sum';
  const result = spawnSync('sh', ['-c', script], {
    cwd: join(repo.dir, 'packs', id), env: repo.env, encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr);
  return `sha256:${result.stdout.split(' ')[0] ?? ''}`;
}

function examplePack(repo: TestRepo): void {
  repo.write('packs/phase/inception/lean/pack.yaml', 'format: 1\n');
  repo.write('packs/phase/inception/lean/workflows/inception.yaml', 'name: inception\n');
  repo.write('packs/phase/inception/lean/README.md', 'Lean.\n');
  repo.commitAll('lean');
  repo.tag('phase/inception/lean@1.0.0');
}

describe('npm run digest', () => {
  it('prints the digest the spec-001 §13 reference command gives', () => {
    withRepo((repo) => {
      examplePack(repo);
      const id = 'phase/inception/lean';
      const result = run(['--repo', repo.dir, `${id}@1.0.0`, id], repo.env);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout, `${reference(repo, 'phase/inception/lean')}\n`);
    });
  });

  it('exits 1 on a digest rule failure', () => {
    withRepo((repo) => {
      repo.addBlob('packs/base/a b.md', Buffer.from('x\n'));
      repo.commitIndex('bad path');
      assert.equal(run(['--repo', repo.dir, 'HEAD', 'base']).status, 1);
    });
  });

  it('resolves a ref after --end-of-options, so it is never an option', () => {
    const args = revParseArgs('--all');
    assert.ok(args.indexOf('--end-of-options') < args.indexOf('--all^{commit}'), args.join(' '));
  });

  it('exits 2 on a missing ref, also one that looks like an option', () => {
    withRepo((repo) => {
      examplePack(repo);
      assert.equal(run(['--repo', repo.dir, 'nope', 'base']).status, 2);
      assert.equal(run(['--repo', repo.dir, '--', '--output=x', 'base']).status, 2);
    });
  });

  it('exits 3 on bad usage', () => {
    withRepo((repo) => {
      examplePack(repo);
      assert.equal(run([]).status, 3);
      assert.equal(run(['--repo', repo.dir, 'HEAD']).status, 3);
      assert.equal(run(['--repo', repo.dir, 'HEAD', 'phase/inception']).status, 3);
      assert.equal(run(['--repo', repo.dir, 'HEAD', '../x']).status, 3);
      assert.equal(run(['--unknown', 'HEAD', 'base']).status, 3);
    });
  });
});
