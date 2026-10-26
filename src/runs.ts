// task-053 (plan-049): red-first stub; the implementation follows.
export interface WingfoilOutput { status: number | null; stdout: string; stderr: string }
export type Exec = (cli: string, args: string[], cwd: string, env: NodeJS.ProcessEnv) =>
  WingfoilOutput;
export interface Composed { params: Record<string, string>; release: string }
export type Compose = (tree: string, entries: string[], params: Record<string, string>,
  out: string) => Composed;
export interface RunsOptions { compose?: Compose; install?: (version: string) => string;
  exec?: Exec }
export function runRuns(_argv: string[], _options: RunsOptions = {}):
{ code: number; lines: string[] } {
  return { code: 99, lines: ['not implemented'] };
}
