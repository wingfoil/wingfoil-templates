// `npm run feedback:note -- --schema --from <task-nnn | prel-nnn>
// [--tree <dir>]` (task-015).
import { runFeedbackNote } from './feedback-note';

const result = runFeedbackNote(process.argv.slice(2));
for (const line of result.lines) process.stdout.write(`${line}\n`);
process.exitCode = result.code;
