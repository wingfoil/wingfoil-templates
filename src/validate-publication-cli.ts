// `npm run validate:publication -- [--evidence] [--tree <dir>] [--cache <dir>]
// [--param <name>=<value>]... [<entry>...]`: the validation in the matrix's publication mode
// (dl-009), for `pack-release-cycle` › `validate` and CI on release tags. No option selects another
// mode. With `--evidence`, the `## Validation` section of the pack-release element follows the
// report (F5.1, task-014); it is refused for a run that did not pass.
import { EvidenceError, writeEvidence } from './evidence';
import { GitError, resolveCommit } from './git';
import { runValidate } from './validate';

/** The tree an argument list names, as runValidate reads it. */
function treeOf(argv: string[]): string {
  const index = argv.indexOf('--tree');
  const inline = argv.find((arg) => arg.startsWith('--tree='));
  return inline?.slice('--tree='.length) ?? (index >= 0 ? argv[index + 1] : undefined)
    ?? process.cwd();
}

function main(argv: string[]): number {
  const evidence = argv.includes('--evidence');
  const args = argv.filter((arg) => arg !== '--evidence');
  const result = runValidate(args, { mode: 'publication' });
  for (const line of result.lines) process.stdout.write(`${line}\n`);
  if (!evidence) return result.code;
  let commit: string;
  try {
    commit = resolveCommit(treeOf(args), 'HEAD');
  } catch (error) {
    if (!(error instanceof GitError)) throw error;
    process.stderr.write(`no evidence: ${error.message}\n`);
    return Math.max(result.code, 2);
  }
  try {
    const command = ['npm run validate:publication --', ...argv].join(' ');
    process.stdout.write(`\n${writeEvidence(result, { commit, command })}`);
  } catch (error) {
    if (!(error instanceof EvidenceError)) throw error;
    process.stderr.write(`no evidence: ${error.message}\n`);
    return Math.max(result.code, 1);
  }
  return result.code;
}

process.exitCode = main(process.argv.slice(2));
