// A problem the lint reports (spec-001 §18, F3.5, task-012). Every check returns all the problems
// it finds; the composer, which applies the same checks to the packs it composes, throws the first.

export interface Problem {
  /** Relative to the tree, with `/` separators. */
  file: string;
  line?: number;
  column?: number;
  /** A fixed rule id, so that tests and readers can match it. */
  rule: string;
  message: string;
}

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

/** `<file>[:<line>:<col>]: <rule>: <message>`. */
export function formatProblem(problem: Problem): string {
  const where = problem.line === undefined ? problem.file
    : `${problem.file}:${problem.line}:${problem.column ?? 1}`;
  return `${where}: ${problem.rule}: ${problem.message}`;
}

/** In byte order of their report lines, duplicates removed. */
export function sortProblems(problems: Problem[]): Problem[] {
  const seen = new Set<string>();
  return [...problems].sort((a, b) => byBytes(formatProblem(a), formatProblem(b)))
    .filter((problem) => {
      const line = formatProblem(problem);
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    });
}
