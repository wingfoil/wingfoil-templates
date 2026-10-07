// `npm run validate -- [--tree <dir>] [--param <name>=<value>]... [<entry>...]` (F3.1).
import { runValidate } from './validate';

const result = runValidate(process.argv.slice(2));
for (const line of result.lines) process.stdout.write(`${line}\n`);
process.exitCode = result.code;
