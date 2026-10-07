// The determinism check (F3.4, pack-compatibility: "compose twice from a clean state"): the same
// composition made by two separate processes, one after the other, the second in a changed
// environment, then compared byte for byte.
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve as resolvePath } from 'node:path';

import { compareTrees, listTree } from './compare-trees';

export interface CompositionRequest {
  tree: string;
  entries: string[];
  /** Parameter values as text, read by their declared type (task-007). */
  params: Record<string, string>;
}

export interface DeterminismResult {
  /** 0 composed and identical, 1 a composition or determinism failure, 2 an I/O failure. */
  code: number;
  files: number;
  message: string;
}

export type Compare = (first: string, second: string) => string[];

/** Runs the compose command in a child process with the given umask (task-007 runCompose). */
const RUNNER = [
  'const [cli, umask, ...args] = process.argv.slice(1);',
  'process.umask(parseInt(umask, 8));',
  'const outcome = require(cli).runCompose(args);',
  'if (outcome.message !== undefined) process.stderr.write(outcome.message + "\\n");',
  'process.exitCode = outcome.code;',
].join('\n');

const CLI = join(__dirname, 'compose-cli.js');

interface Run {
  cwd: string;
  out: string;
  umask: string;
  env: NodeJS.ProcessEnv;
}

function composeOnce(request: CompositionRequest, run: Run): { status: number; stderr: string } {
  const params = Object.entries(request.params).flatMap(([name, value]) => ['--param',
    `${name}=${value}`]);
  // The tree is absolute: the second run works from another directory on purpose.
  const args = ['-e', RUNNER, CLI, run.umask, '--tree', resolvePath(request.tree),
    '--out', run.out, ...params, ...request.entries];
  const result = spawnSync(process.execPath, args, {
    cwd: run.cwd, env: run.env, encoding: 'utf8',
  });
  return { status: result.status ?? 2, stderr: result.stderr.trim() };
}

export function composeTwice(request: CompositionRequest, compare: Compare = compareTrees):
DeterminismResult {
  const root = mkdtempSync(join(tmpdir(), 'determinism-'));
  try {
    const home = join(root, 'home');
    const elsewhere = join(root, 'elsewhere');
    mkdirSync(home);
    mkdirSync(elsewhere);
    const first = join(root, 'first');
    const runs: Run[] = [
      { cwd: process.cwd(), out: first, umask: '022', env: process.env },
      {
        cwd: elsewhere,
        out: join('..', 'second'),
        umask: '077',
        env: { ...process.env, TZ: 'Pacific/Kiritimati', LC_ALL: 'C', HOME: home },
      },
    ];
    for (const run of runs) {
      const result = composeOnce(request, run);
      if (result.status !== 0) {
        return { code: result.status === 2 ? 2 : 1, files: 0, message: result.stderr };
      }
    }
    const second = join(root, 'second');
    const differences = compare(first, second);
    if (differences.length > 0) {
      return { code: 1, files: 0, message: `not deterministic: ${differences.join('; ')}` };
    }
    return { code: 0, files: listTree(first).length, message: 'byte-identical' };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
