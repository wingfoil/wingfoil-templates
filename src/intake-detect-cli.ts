// `npm run intake:detect -- [--registry <file>] [--compat <file>] [--github]` (task-078): the
// `wingfoil` versions on npm missing from compat.yaml. Exit 0 (none), 1 (one or more), 2 (a usage
// error, a refused answer, or `npm view` failing). With --github each finding is also a workflow
// `::error` line, built from validated versions and fixed text only.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { loadCompat } from './compat';
import { detectMissing } from './intake-detect';

const USAGE = 'usage: intake:detect [--registry <file>] [--compat <file>] [--github]';

interface Outcome { code: number; stdout: string[]; stderr: string[] }

function registryAnswer(file: string | undefined): unknown {
  if (file !== undefined) return JSON.parse(readFileSync(file, 'utf8')) as unknown;
  const result = spawnSync('npm', ['view', 'wingfoil', 'versions', 'time', '--json'],
    { encoding: 'utf8', shell: false });
  if (result.status !== 0) {
    throw new NpmFailure(result.status === null ? `signal ${result.signal ?? 'unknown'}`
      : String(result.status));
  }
  return JSON.parse(result.stdout) as unknown;
}

class NpmFailure extends Error {}

export function runIntakeDetect(argv: string[], cwd: string): Outcome {
  let values: { registry?: string; compat?: string; github?: boolean };
  try {
    ({ values } = parseArgs({ args: argv, allowPositionals: false, strict: true, options: {
      registry: { type: 'string' }, compat: { type: 'string' }, github: { type: 'boolean' } } }));
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
      return { code: 2, stdout: github ? [`::error title=WingFoil release check failed::${why}`]
        : [], stderr: [why] };
    }
    return { code: 2, stdout: [], stderr: ['the registry answer is not JSON'] };
  }
  const compat = loadCompat(values.compat ?? join(cwd, 'compat.yaml'));
  const report = detectMissing(answer, compat.releases.map((release) => release.wingfoil));
  if (report.code === 2) return { code: 2, stdout: [], stderr: report.errors };
  const stdout = [...report.lines];
  if (github && report.code === 1) {
    for (const line of report.lines) stdout.push(`::error title=WingFoil release not recorded::${line}`);
  }
  return { code: report.code, stdout, stderr: [] };
}

if (require.main === module) {
  const outcome = runIntakeDetect(process.argv.slice(2), process.cwd());
  for (const line of outcome.stdout) process.stdout.write(`${line}\n`);
  for (const line of outcome.stderr) process.stderr.write(`${line}\n`);
  process.exitCode = outcome.code;
}
