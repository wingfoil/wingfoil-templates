// `npm run check:release -- --pack <catalog pack id> --report <path outside the repository>
// --node <directory of node and npm> [--node <directory>]... [--tree <dir>]` (task-106, dl-054 P1):
// a pack-release's clean-clone checks, one leg per --node in order, the evidence and the dry run
// of publish:pack on the first; each command's output streamed as it runs, the report's lines
// printed at the end and written to --report, whatever the exit code once the file exists.
import { runCheckRelease } from './check-release';

async function main(argv: string[]): Promise<number> {
  const result = await runCheckRelease(argv);
  for (const line of result.lines) process.stdout.write(`${line}\n`);
  return result.code;
}

main(process.argv.slice(2)).then((code) => {
  process.exitCode = code;
}, (error: unknown) => {
  process.stderr.write(`check:release: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 2;
});
