// `npm run intake:collect -- <version> --out <dir> [--tree <dir>]` and `npm run intake:apply --
// <dir> --version <v> [--tree <dir>]` (task-081): the prepared diff as an artifact and back
// (intake-artifact.ts). Exit 0 with one line per file; 1, writing nothing, on a refusal; 2 on a
// wrong command line. `--tree` defaults to the current directory.
import { parseArgs } from 'node:util';

import { applyArtifact, collectArtifact } from './intake-artifact';

const USAGE = ['usage: intake:collect <version> --out <dir> [--tree <dir>]',
  'usage: intake:apply <dir> --version <v> [--tree <dir>]'];

export interface Outcome { code: number; stdout: string[]; stderr: string[] }

export function runIntakeArtifact(argv: string[], cwd: string): Outcome {
  const [command, ...rest] = argv;
  let result;
  try {
    if (command === 'collect') {
      const { values, positionals } = parseArgs({ args: rest, allowPositionals: true,
        strict: true, options: { out: { type: 'string' }, tree: { type: 'string' } } });
      if (positionals.length !== 1) throw new Error('one version expected');
      if (values.out === undefined) throw new Error('--out is required');
      result = collectArtifact(values.tree ?? cwd, positionals[0] ?? '', values.out);
    } else if (command === 'apply') {
      const { values, positionals } = parseArgs({ args: rest, allowPositionals: true,
        strict: true, options: { version: { type: 'string' }, tree: { type: 'string' } } });
      if (positionals.length !== 1) throw new Error('one artifact directory expected');
      if (values.version === undefined) throw new Error('--version is required');
      result = applyArtifact(values.tree ?? cwd, positionals[0] ?? '', values.version);
    } else {
      throw new Error('collect or apply expected');
    }
  } catch (error) {
    return { code: 2, stdout: [],
      stderr: [error instanceof Error ? error.message : String(error), ...USAGE] };
  }
  return result.code === 0 ? { code: 0, stdout: result.lines, stderr: [] }
    : { code: 1, stdout: [], stderr: result.lines };
}

if (require.main === module) {
  const outcome = runIntakeArtifact(process.argv.slice(2), process.cwd());
  for (const line of outcome.stdout) process.stdout.write(`${line}\n`);
  for (const line of outcome.stderr) process.stderr.write(`${line}\n`);
  process.exitCode = outcome.code;
}
