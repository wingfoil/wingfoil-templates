// `npm run validate:publication -- [--tree <dir>] [--cache <dir>] [--param <name>=<value>]...
// [<entry>...]`: the validation in the matrix's publication mode (dl-009), for
// `pack-release-cycle` › `validate` and CI on release tags. No option selects another mode.
import { runValidate } from './validate';

const result = runValidate(process.argv.slice(2), { mode: 'publication' });
for (const line of result.lines) process.stdout.write(`${line}\n`);
process.exitCode = result.code;
