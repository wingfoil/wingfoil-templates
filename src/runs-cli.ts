// `npm run check:runs -- [--tree <dir>] [--cache <dir>] [<scenario file>...]` (task-053): see
// runs.ts.
import { runRuns } from './runs';

const result = runRuns(process.argv.slice(2));
for (const line of result.lines) process.stdout.write(`${line}\n`);
process.exitCode = result.code;
