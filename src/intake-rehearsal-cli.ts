// `npm run intake:rehearse -- [--tree <dir>]` (task-081): the newest release removed from the tree
// for a rehearsal (intake-rehearsal.ts). Exit 0 with one line per file written or removed; 1,
// writing nothing, on a refusal; 2 on a wrong command line. `--tree` defaults to the current
// directory.
import { parseArgs } from 'node:util';

import { removeNewest } from './intake-rehearsal';

const USAGE = 'usage: intake:rehearse [--tree <dir>]';

export interface Outcome { code: number; stdout: string[]; stderr: string[] }

export function runIntakeRehearse(argv: string[], cwd: string): Outcome {
  let tree: string;
  try {
    const { values } = parseArgs({ args: argv, allowPositionals: false, strict: true,
      options: { tree: { type: 'string' } } });
    tree = values.tree ?? cwd;
  } catch (error) {
    return { code: 2, stdout: [],
      stderr: [error instanceof Error ? error.message : String(error), USAGE] };
  }
  const result = removeNewest(tree);
  return result.code === 0 ? { code: 0, stdout: result.lines, stderr: [] }
    : { code: 1, stdout: [], stderr: result.lines };
}

if (require.main === module) {
  const outcome = runIntakeRehearse(process.argv.slice(2), process.cwd());
  for (const line of outcome.stdout) process.stdout.write(`${line}\n`);
  for (const line of outcome.stderr) process.stderr.write(`${line}\n`);
  process.exitCode = outcome.code;
}
