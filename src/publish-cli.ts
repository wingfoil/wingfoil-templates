// `npm run publish:pack -- --pack <catalog pack id> [--tree <dir>] [--param <name>=<value>]...
// [--dry-run] [<entry>...]` (task-014). npm reads a `--dry-run` typed without `--` as its own
// option and never passes it on: the command would then make a real tag and commit, so it refuses.
import { runPublish } from './publish';

function main(argv: string[]): number {
  const npmDryRun = process.env['npm_config_dry_run'];
  if (npmDryRun !== undefined && npmDryRun !== '' && npmDryRun !== 'false'
    && !argv.includes('--dry-run')) {
    process.stderr.write('npm took --dry-run for itself; write: npm run publish:pack -- --dry-run …\n');
    return 3;
  }
  const result = runPublish(argv);
  for (const line of result.lines) process.stdout.write(`${line}\n`);
  return result.code;
}

process.exitCode = main(process.argv.slice(2));
