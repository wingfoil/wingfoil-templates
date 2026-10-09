// `npm run validate -- [--tree <dir>] [--cache <dir>] [--param <name>=<value>]... [<entry>...]`
// (F3.1): the validation in the matrix's self-test mode (dl-009), for local runs and CI on pull
// requests. No option selects another mode: publication is `npm run validate:publication`.
import { runValidate } from './validate';

const result = runValidate(process.argv.slice(2), { mode: 'self-test' });
for (const line of result.lines) process.stdout.write(`${line}\n`);
process.exitCode = result.code;
