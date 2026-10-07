// `npm run digest -- [--repo <dir>] <ref> <catalog pack id>`: the spec-001 §13 digest of a pack at
// a ref. Exit 0, 1 (a digest rule is broken), 2 (the ref or git fails), 3 (bad usage).
import { parseArgs } from 'node:util';

import { DigestError, isCatalogPackId, packDigest } from './digest';
import { GitError } from './git';

const USAGE = 'usage: digest [--repo <dir>] <ref> <catalog pack id>';

interface Outcome {
  code: number;
  stdout?: string;
  stderr?: string;
}

export function runDigest(argv: string[], cwd: string): Outcome {
  let repo: string;
  let ref: string;
  let id: string;
  try {
    const { values, positionals } = parseArgs({
      args: argv,
      options: { repo: { type: 'string' } },
      allowPositionals: true,
      strict: true,
    });
    if (positionals.length !== 2) return { code: 3, stderr: USAGE };
    [ref = '', id = ''] = positionals;
    repo = values.repo ?? cwd;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { code: 3, stderr: `${message}\n${USAGE}` };
  }
  if (!isCatalogPackId(id)) {
    return { code: 3, stderr: `${JSON.stringify(id)} is not a catalog pack id (spec-001 §4)` };
  }
  try {
    return { code: 0, stdout: packDigest(repo, ref, id).digest };
  } catch (error) {
    if (error instanceof DigestError) return { code: 1, stderr: error.message };
    if (error instanceof GitError) return { code: 2, stderr: error.message };
    throw error;
  }
}

if (require.main === module) {
  const outcome = runDigest(process.argv.slice(2), process.cwd());
  if (outcome.stdout !== undefined) process.stdout.write(`${outcome.stdout}\n`);
  if (outcome.stderr !== undefined) process.stderr.write(`${outcome.stderr}\n`);
  process.exitCode = outcome.code;
}
