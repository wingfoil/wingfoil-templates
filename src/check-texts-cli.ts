// `npm run check:texts -- [--base <ref> | --range <a>..<b>]` (task-102, dl-046): see
// check-texts.ts. Exit 1 means a breach only: an unexpected failure is exit 2.
import { checkTexts } from './check-texts';

try {
  const result = checkTexts(process.cwd(), process.argv.slice(2));
  for (const line of result.out) process.stdout.write(`${line}\n`);
  for (const line of result.err) process.stderr.write(`${line}\n`);
  process.exitCode = result.code;
} catch (error) {
  process.stderr.write(`check:texts: ${String(error)}\n`);
  process.exitCode = 2;
}
