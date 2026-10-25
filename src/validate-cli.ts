// `npm run validate -- [--tree <dir>] [--cache <dir>] [--overlay <dir>] [--param <name>=<value>]...
// [<entry>...]` (F3.1): the validation in the matrix's self-test mode (dl-009), for local runs and
// CI on pull requests. No option selects another mode: publication is `npm run
// validate:publication`, which refuses `--overlay`: the packs and compositions of a directory
// under tests/fixtures/, composed with this tree's packs and never published (task-046).
import { runValidate } from './validate';

const result = runValidate(process.argv.slice(2), { mode: 'self-test' });
for (const line of result.lines) process.stdout.write(`${line}\n`);
process.exitCode = result.code;
