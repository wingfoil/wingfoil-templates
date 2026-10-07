// Plumbing access to this repository's git (spec-001 §17: the tooling reads git tags and trees).
// git runs with an argument list, never through a shell, and only plumbing whose output does not
// depend on the user's configuration.
import { execFileSync } from 'node:child_process';

export class GitError extends Error {}

export function runGit(repo: string, args: string[], input?: Buffer): Buffer {
  try {
    return execFileSync('git', ['-C', repo, ...args], {
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

/** The commit a ref names; a ref that looks like an option is still only a ref. */
export function resolveCommit(repo: string, ref: string): string {
  try {
    return runGit(repo, ['rev-parse', '--verify', '--quiet', '--end-of-options', `${ref}^{commit}`])
      .toString('utf8')
      .trim();
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
    const header = output.subarray(offset, end).toString('utf8').split(' ');
    if (header[0] !== sha || header[1] !== 'blob' || header[2] === undefined) {
      throw new GitError(`git cat-file: unexpected header for ${sha}: ${header.join(' ')}`);
    }
    const size = Number(header[2]);
    blobs.push(output.subarray(end + 1, end + 1 + size));
    offset = end + 1 + size + 1;
  }
  return blobs;
}
