// `npm run check:release` (task-106, dl-054 P1): a stub before the build (red first, dl-018).

/** One command's result: its exit code, or the signal that ended it, and its two streams. */
export interface Outcome {
  code: number | null;
  signal: string | null;
  stdout: string;
  stderr: string;
}

export type Runner = (program: string, args: string[],
  options: { cwd: string; env: NodeJS.ProcessEnv }) => Promise<Outcome>;

export interface CheckReleaseOptions {
  runner?: Runner;
  write?: (path: string, text: string) => void;
  remove?: (dir: string) => void;
}

export interface CheckReleaseResult {
  code: number;
  lines: string[];
}

export function runCheckRelease(_argv: string[], _options: CheckReleaseOptions = {}):
  Promise<CheckReleaseResult> {
  return Promise.resolve({ code: 99, lines: [] });
}
