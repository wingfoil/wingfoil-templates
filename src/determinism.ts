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

/** The compose command of task-007; tests give another module exporting runCompose. */
const COMPOSE_CLI = join(__dirname, 'compose-cli.js');

export interface DeterminismOptions {
  compare?: Compare;
  /** A module exporting `runCompose(argv)`, run in each child process. */
  cli?: string;
}

interface Run {
  cwd: string;
  out: string;
  umask: string;
  env: NodeJS.ProcessEnv;
}

interface Once {
  code: number;
  message: string;
}

function composeOnce(request: CompositionRequest, run: Run, cli: string): Once {
  const params = Object.entries(request.params).flatMap(([name, value]) => ['--param',
    `${name}=${value}`]);
  // The tree is absolute: the second run works from another directory on purpose.
  const args = ['-e', RUNNER, cli, run.umask, '--tree', resolvePath(request.tree),
    '--out', run.out, ...params, ...request.entries];
  const result = spawnSync(process.execPath, args, {
    cwd: run.cwd, env: run.env, encoding: 'utf8',
  });
  if (result.error !== undefined) {
    return { code: 2, message: `cannot run: ${result.error.message}` };
  }
  if (result.signal !== null) return { code: 2, message: `killed by ${result.signal}` };
  const message = (result.stderr ?? '').trim();
  return { code: result.status === 0 ? 0 : result.status === 2 ? 2 : 1, message };
}

/**
 * Composes twice, one run after the other, and compares. The second run changes every input a
 * composer must not read: clock zone, locale, home, temporary directory, umask, working directory,
 * and the output path, given relative.
 */
export function composeTwice(
  request: CompositionRequest,
  options: DeterminismOptions = {},
): DeterminismResult {
  const compare = options.compare ?? compareTrees;
  let root: string | undefined;
  try {
    root = mkdtempSync(join(tmpdir(), 'determinism-'));
    for (const dir of ['home', 'elsewhere', 'tmp']) mkdirSync(join(root, dir));
    const first = join(root, 'first');
    const runs: Run[] = [
      { cwd: process.cwd(), out: first, umask: '022', env: process.env },
      {
        cwd: join(root, 'elsewhere'),
        out: join('..', 'second'),
        umask: '077',
        env: {
          ...process.env,
          TZ: 'Pacific/Kiritimati',
          LC_ALL: 'tr_TR.UTF-8',
          LANG: 'tr_TR.UTF-8',
          HOME: join(root, 'home'),
          TMPDIR: join(root, 'tmp'),
        },
      },
    ];
    for (const run of runs) {
      const result = composeOnce(request, run, options.cli ?? COMPOSE_CLI);
      if (result.code !== 0) {
        return { code: result.code, files: 0, message: result.message.split(root).join('<tmp>') };
      }
    }
    const differences = compare(first, join(root, 'second'));
    if (differences.length > 0) {
      return { code: 1, files: 0, message: `not deterministic: ${differences.join('; ')}` };
    }
    return { code: 0, files: listTree(first).length, message: 'byte-identical' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const shown = root === undefined ? message : message.split(root).join('<tmp>');
    return { code: 2, files: 0, message: shown };
  } finally {
    if (root !== undefined) rmSync(root, { recursive: true, force: true });
  }
}
