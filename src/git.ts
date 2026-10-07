// Plumbing access to this repository's git (spec-001 §17: the tooling reads git tags and trees).
// git runs with an argument list, never through a shell, in an environment of its own: no GIT_*
// variable of the caller (GIT_DIR from a hook, pathspec magic), no system or global configuration,
// no replace objects. Only the repository's own objects decide the result.
import { execFileSync } from 'node:child_process';
import { devNull } from 'node:os';

export class GitError extends Error {}

/** The caller's environment without GIT_* variables, with git's configuration sources closed. */
export function gitEnvironment(base: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {};
  for (const [name, value] of Object.entries(base)) {
    if (!name.startsWith('GIT_')) env[name] = value;
  }
  env['GIT_CONFIG_NOSYSTEM'] = '1';
  env['GIT_CONFIG_GLOBAL'] = devNull;
  env['GIT_NO_REPLACE_OBJECTS'] = '1';
  return env;
}

export function runGit(repo: string, args: string[], input?: Buffer): Buffer {
  try {
    return execFileSync('git', ['--no-replace-objects', '-C', repo, ...args], {
      env: gitEnvironment(),
      input,
      maxBuffer: 1 << 30,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (error) {
    const stderr = (error as { stderr?: Buffer }).stderr?.toString('utf8').trim();
    const reason = stderr !== undefined && stderr !== '' ? stderr : String(error);
    throw new GitError(`git ${args[0] ?? ''}: ${reason}`);
  }
}

/** `rev-parse` arguments for a ref: after `--end-of-options`, a ref is never read as an option. */
export function revParseArgs(ref: string): string[] {
  return ['rev-parse', '--verify', '--quiet', '--end-of-options', `${ref}^{commit}`];
}

/** The commit a ref names. */
export function resolveCommit(repo: string, ref: string): string {
  try {
    return runGit(repo, revParseArgs(ref)).toString('utf8').trim();
  } catch {
    throw new GitError(`no commit for ref ${JSON.stringify(ref)}`);
  }
}

/** The bytes of each blob, in the order asked, from one `git cat-file --batch`. */
export function readBlobs(repo: string, shas: string[]): Buffer[] {
  if (shas.length === 0) return [];
  const input = Buffer.from(shas.map((sha) => `${sha}\n`).join(''));
  const output = runGit(repo, ['cat-file', '--batch'], input);
  const blobs: Buffer[] = [];
  let offset = 0;
  for (const sha of shas) {
    const end = output.indexOf(0x0a, offset);
    if (end < 0) throw new GitError(`git cat-file: no header for ${sha}`);
    const header = output.subarray(offset, end).toString('utf8').split(' ');
    const size = Number(header[2]);
    if (header[0] !== sha || header[1] !== 'blob' || !Number.isSafeInteger(size) || size < 0) {
      throw new GitError(`git cat-file: unexpected header for ${sha}: ${header.join(' ')}`);
    }
    const stop = end + 1 + size;
    if (stop >= output.length || output[stop] !== 0x0a) {
      throw new GitError(`git cat-file: truncated output for ${sha}`);
    }
    blobs.push(output.subarray(end + 1, stop));
    offset = stop + 1;
  }
  if (offset !== output.length) throw new GitError('git cat-file: unexpected trailing output');
  return blobs;
}
