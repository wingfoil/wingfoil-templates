// `npm run intake:detect -- [--registry <file>] [--compat <file>] [--github]
// [--github-output <file> [--rehearsal]]` (task-078, task-081): the `wingfoil` versions on npm
// missing from compat.yaml. Exit 0 (none), 1 (one or more), 2 (a usage error, a refused answer, or
// `npm view` failing). With --github each finding is also a workflow `::error` line, built from
// validated versions and fixed text only. With --github-output the job's outputs `version` and
// `class` are appended to that file: the lowest missing version above the newest recorded and its
// class (`patch`, `minor`, `major`), empty when none is; with --rehearsal, the newest recorded
// release and its class against its predecessor. The lines and exit codes are the same.
import { spawnSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import semver from 'semver';

import { loadCompat } from './compat';
import { detectMissing } from './intake-detect';

const USAGE = 'usage: intake:detect [--registry <file>] [--compat <file>] [--github] '
  + '[--github-output <file> [--rehearsal]]';
const FAILED = '::error title=WingFoil release check failed::';

interface Outcome { code: number; stdout: string[]; stderr: string[] }

function registryAnswer(file: string | undefined): unknown {
  if (file !== undefined) return JSON.parse(readFileSync(file, 'utf8')) as unknown;
  const result = spawnSync('npm', ['view', 'wingfoil', 'versions', 'time', '--json'],
    { encoding: 'utf8', shell: false });
  if (result.error !== undefined) {
    const code = (result.error as NodeJS.ErrnoException).code;
    throw new NpmFailure(code ?? 'with an error');
  }
  if (result.status !== 0) {
    throw new NpmFailure(result.status === null ? `signal ${result.signal ?? 'unknown'}`
      : String(result.status));
  }
  return JSON.parse(result.stdout) as unknown;
}

class NpmFailure extends Error {}

interface Next { version: string; class: string }

/** The job's class: detect's `minor, breaking in 0.x` is a minor. */
function jobClass(text: string): string {
  return text.startsWith('minor') ? 'minor' : text;
}

/** The first line naming a version above the newest recorded: the lowest one, lines in order. */
function toPrepare(lines: string[]): Next | undefined {
  for (const line of lines) {
    const match = /^(\d+\.\d+\.\d+) (patch|minor|major)\b/.exec(line);
    if (match !== null) return { version: match[1] ?? '', class: jobClass(match[2] ?? '') };
  }
  return undefined;
}

/** The newest recorded release and its class against its predecessor, for a rehearsal. */
function newest(recorded: string[]): Next | undefined {
  const sorted = [...recorded].sort(semver.compare);
  const [last, before] = [sorted[sorted.length - 1], sorted[sorted.length - 2]];
  if (last === undefined || before === undefined) return undefined;
  const kind = semver.major(last) !== semver.major(before) ? 'major'
    : semver.minor(last) !== semver.minor(before) ? 'minor' : 'patch';
  return { version: last, class: kind };
}

export function runIntakeDetect(argv: string[], cwd: string): Outcome {
  let values: { registry?: string; compat?: string; github?: boolean; 'github-output'?: string;
    rehearsal?: boolean };
  try {
    ({ values } = parseArgs({ args: argv, allowPositionals: false, strict: true, options: {
      registry: { type: 'string' }, compat: { type: 'string' }, github: { type: 'boolean' },
      'github-output': { type: 'string' }, rehearsal: { type: 'boolean' } } }));
    if (values.rehearsal === true && values['github-output'] === undefined) {
      throw new Error('--rehearsal needs --github-output');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { code: 2, stdout: [], stderr: [message, USAGE] };
  }
  const github = values.github === true;
  let answer: unknown;
  try {
    answer = registryAnswer(values.registry);
  } catch (error) {
    if (error instanceof NpmFailure) {
      const why = `npm view exited ${error.message}`;
      return { code: 2, stdout: github ? [`${FAILED}${why}`] : [], stderr: [why] };
    }
    const why = error instanceof SyntaxError ? 'the registry answer is not JSON'
      : `cannot read the registry file: ${error instanceof Error ? error.message : String(error)}`;
    return { code: 2, stdout: github ? [`${FAILED}the registry answer is refused`] : [],
      stderr: [why] };
  }
  let recorded: string[];
  try {
    recorded = loadCompat(values.compat ?? join(cwd, 'compat.yaml')).releases
      .map((release) => release.wingfoil);
  } catch (error) {
    return { code: 2, stdout: github ? [`${FAILED}compat.yaml is not valid`] : [],
      stderr: [error instanceof Error ? error.message : String(error)] };
  }
  const report = detectMissing(answer, recorded);
  if (report.code === 2) {
    return { code: 2, stdout: github ? [`${FAILED}the registry answer is refused`] : [],
      stderr: report.errors };
  }
  const output = values['github-output'];
  if (output !== undefined) {
    const next = values.rehearsal === true ? newest(recorded) : toPrepare(report.lines);
    try {
      appendFileSync(output, `version=${next?.version ?? ''}\nclass=${next?.class ?? ''}\n`);
    } catch (error) {
      return { code: 2, stdout: [], stderr: [`cannot write the job outputs: ${
        error instanceof Error ? error.message : String(error)}`] };
    }
  }
  const stdout = [...report.lines];
  if (github && report.code === 1) {
    for (const line of report.lines) {
      stdout.push(`::error title=WingFoil release not recorded::${line}`);
    }
  }
  return { code: report.code, stdout, stderr: [] };
}

if (require.main === module) {
  const outcome = runIntakeDetect(process.argv.slice(2), process.cwd());
  for (const line of outcome.stdout) process.stdout.write(`${line}\n`);
  for (const line of outcome.stderr) process.stderr.write(`${line}\n`);
  process.exitCode = outcome.code;
}
