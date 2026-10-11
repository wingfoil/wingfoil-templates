// `npm run index -- [--tree <dir>] [--check]` (spec-002 §3.1, task-019); `validate` runs --check.
import { runIndex } from './index';

const result = runIndex(process.argv.slice(2));
for (const line of result.lines) process.stdout.write(`${line}\n`);
process.exitCode = result.code;
