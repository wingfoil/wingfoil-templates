// `npm run site -- [--tree <dir>] --out <dir>` (spec-002 §5, task-024); pages.yml deploys its output.
import { runSite } from './site';

const result = runSite(process.argv.slice(2));
for (const line of result.lines) process.stdout.write(`${line}\n`);
process.exitCode = result.code;
