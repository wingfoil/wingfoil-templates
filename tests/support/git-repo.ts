import { execFileSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/** Git configuration a test repository runs with: no system file, and this global file only. */
export function isolatedGitEnv(globalConfig: string): NodeJS.ProcessEnv {
  return { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: globalConfig };
}

const CONFIG = [
  '[user]', '\tname = Test', '\temail = test@example.invalid',
  '[init]', '\tdefaultBranch = main',
  '[commit]', '\tgpgSign = false',
  '[tag]', '\tgpgSign = false',
  '',
].join('\n');

/** A temporary git repository with its own configuration, for tests that read git trees. */
export class TestRepo {
  readonly dir: string;
  readonly home: string;
  readonly env: NodeJS.ProcessEnv;

  constructor() {
    this.home = mkdtempSync(join(tmpdir(), 'test-repo-'));
    this.dir = join(this.home, 'repo');
    mkdirSync(this.dir);
    const config = join(this.home, 'gitconfig');
    writeFileSync(config, CONFIG);
    this.env = isolatedGitEnv(config);
    this.git(['init', '--quiet']);
  }

  git(args: string[], input?: Buffer): string {
    return execFileSync('git', args, { cwd: this.dir, env: this.env, input }).toString('utf8');
  }

  write(path: string, content: string | Buffer, mode?: number): void {
    const full = join(this.dir, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content);
    if (mode !== undefined) chmodSync(full, mode);
  }

  commitAll(message: string): string {
    this.git(['add', '-A']);
    return this.commitIndex(message);
  }

  /** Commits the index as it is, without adding the working tree. */
  commitIndex(message: string): string {
    this.git(['commit', '--quiet', '--allow-empty', '-m', message]);
    return this.git(['rev-parse', 'HEAD']).trim();
  }

  /** An annotated tag (spec-001 §4). */
  tag(name: string): void {
    this.git(['tag', '-a', name, '-m', name]);
  }

  /** Puts exact bytes in the index, bypassing every filter (a CRLF blob stays CRLF). */
  addBlob(path: string, bytes: Buffer, mode = '100644'): void {
    const sha = this.git(['hash-object', '-w', '--no-filters', '--stdin'], bytes).trim();
    this.git(['update-index', '--add', '--cacheinfo', `${mode},${sha},${path}`]);
  }

  /** A submodule entry (gitlink, mode 160000) pointing at a commit. */
  addGitlink(path: string, commit: string): void {
    this.git(['update-index', '--add', '--cacheinfo', `160000,${commit},${path}`]);
  }

  dispose(): void {
    rmSync(this.home, { recursive: true, force: true });
  }
}

export function withRepo(body: (repo: TestRepo) => void): void {
  const repo = new TestRepo();
  try {
    body(repo);
  } finally {
    repo.dispose();
  }
}
