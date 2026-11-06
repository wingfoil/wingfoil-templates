// `npm run intake:prepare -- <version> [--tree <dir>]` (task-080): writes the mechanical part of a
// release's record (intake-prepare.ts). Exit 0 with one `wrote <path>` line per file changed; 1,
// writing nothing, on a refusal or a failed step (an I/O error during the writes excepted, the
// files already written then named); 2 on a wrong command line. The lockfile is resolved by
// `npm install --package-lock-only --ignore-scripts` in a temporary directory outside the tree.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { prepareIntake } from './intake-prepare';

const USAGE = 'usage: intake:prepare <version> [--tree <dir>]';

interface Outcome { code: number; stdout: string[]; stderr: string[] }

/** The pin's lockfile, by npm with the Node.js and npm that run this script; no --before. */
function npmResolve(manifest: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'intake-prepare-'));
  try {
    writeFileSync(join(dir, 'package.json'), manifest);
    const result = spawnSync('npm', ['install', '--package-lock-only', '--ignore-scripts'],
      { cwd: dir, encoding: 'utf8', shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
    if (result.error !== undefined) {
      const code = (result.error as NodeJS.ErrnoException).code;
      throw new Error(`npm install could not run: ${code ?? 'an error'}`);
    }
    if (result.status !== 0) {
      // npm's last stderr line names the cause in a CI log.
      const last = result.stderr.trim().split('\n').slice(-1)[0] ?? '';
      throw new Error(`npm install exited ${result.status === null
        ? `on signal ${result.signal ?? 'unknown'}` : String(result.status)}`
        + (last === '' ? '' : ` (${last})`));
    }
    return readFileSync(join(dir, 'package-lock.json'), 'utf8');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function runIntakePrepare(argv: string[], cwd: string): Outcome {
  let tree: string;
  let version: string;
  try {
    const { values, positionals } = parseArgs({ args: argv, allowPositionals: true, strict: true,
      options: { tree: { type: 'string' } } });
    if (positionals.length !== 1) throw new Error('one version expected');
    version = positionals[0] ?? '';
    tree = values.tree ?? cwd;
  } catch (error) {
    return { code: 2, stdout: [],
      stderr: [error instanceof Error ? error.message : String(error), USAGE] };
  }
  const result = prepareIntake(tree, version, npmResolve);
  return result.code === 0 ? { code: 0, stdout: result.lines, stderr: [] }
    : { code: 1, stdout: [], stderr: result.lines };
}

if (require.main === module) {
  const outcome = runIntakePrepare(process.argv.slice(2), process.cwd());
  for (const line of outcome.stdout) process.stdout.write(`${line}\n`);
  for (const line of outcome.stderr) process.stderr.write(`${line}\n`);
  process.exitCode = outcome.code;
}
