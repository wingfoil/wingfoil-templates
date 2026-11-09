// `npm run check:packs -- [--tree <dir>]`: the lint alone (task-012); `validate` runs it as a step.
import { parseArgs } from 'node:util';

import { runCheckPacks } from './check-packs';
import { formatProblem } from './problems';

function main(argv: string[]): number {
  let tree: string;
  try {
    const { values } = parseArgs({ args: argv, options: { tree: { type: 'string' } },
      allowPositionals: false, strict: true });
    tree = values.tree ?? process.cwd();
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    return 3;
  }
  const result = runCheckPacks(tree);
  for (const line of result.lines) process.stdout.write(`${line}\n`);
  // The waiver heuristic's hits, for review, the exit unchanged (spec-001 §18, task-086).
  for (const review of result.reviews) process.stdout.write(`review: ${formatProblem(review)}\n`);
  return result.code;
}

process.exitCode = main(process.argv.slice(2));
