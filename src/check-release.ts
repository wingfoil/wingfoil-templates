// `npm run check:release -- --pack <id> --report <path> --node <bin> [--node <bin>]... [--tree <dir>]`
// (task-106, dl-054 P1, pack-release-cycle › validate): a pack-release's clean-clone checks run by
// one committed command. For each Node.js given, in order, a clone of the tree's HEAD outside the
// tree runs the list the records ran by hand (prel-007, prel-008 › Validation); on the first, the
// publication's evidence after the build and, in a clone of its own, the dry run of publish:pack.
// It stops at the first non-zero exit, writes its report outside the repository on a failure too,
// refuses a dirty tree, and leaves the tree as it was. Exit codes: 0 a pass, 1 a check, 2 an I/O
// or git error of the command itself, 3 bad usage.
import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync }
  from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join, resolve as resolvePath } from 'node:path';
import { parseArgs } from 'node:util';

import { GitError, runGit } from './git';
import { ReportPathError, checkReportPath } from './report-path';

/** One command's result: its exit code, or the signal that ended it, and its two streams. */
export interface Outcome {
  code: number | null;
  signal: string | null;
  stdout: string;
  stderr: string;
}

/** Runs one command in `cwd` with `env`; the default streams its output and keeps it. */
export type Runner = (program: string, args: string[],
  options: { cwd: string; env: NodeJS.ProcessEnv }) => Promise<Outcome>;

export interface CheckReleaseOptions {
  /** Replaces the commands' runs: the tests' injected runner. */
  runner?: Runner;
  /** Replaces the report's final write (the tests make it fail). */
  write?: (path: string, text: string) => void;
  /** Replaces a clone's removal (the tests make it fail). */
  remove?: (dir: string) => void;
}

export interface CheckReleaseResult {
  code: number;
  lines: string[];
}

/** A failure with its exit code and the lines before it. */
class CheckReleaseError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

/** The WingFoil matrix cache the records copied into each clone (prel-008 › Validation). */
const CACHE = join('.cache', 'wingfoil-matrix');

const OVERLAYS = ['software-exit', 'scrum-exit', 'kanban-exit', 'feedback-exit'];

interface Args {
  pack: string;
  report: string;
  nodes: string[];
  tree: string;
}

function once(values: string[] | undefined, name: string): string {
  if (values === undefined || values.length !== 1 || values[0] === '') {
    throw new CheckReleaseError(3, `--${name} takes one value, given once (dl-054)`);
  }
  return values[0] ?? '';
}

function parse(argv: string[]): Args {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options: {
        pack: { type: 'string', multiple: true },
        report: { type: 'string', multiple: true },
        node: { type: 'string', multiple: true },
        tree: { type: 'string', multiple: true },
      },
      allowPositionals: false,
      strict: true,
    });
  } catch (error) {
    throw new CheckReleaseError(3, error instanceof Error ? error.message : String(error));
  }
  const { values } = parsed;
  const nodes = values.node ?? [];
  if (nodes.length === 0 || nodes.some((node) => node === '')) {
    throw new CheckReleaseError(3, '--node <directory of node and npm> is required, once per leg');
  }
  // Resolved here: the clone and the legs run in other directories than the caller's.
  return { pack: once(values.pack, 'pack'), report: once(values.report, 'report'),
    nodes: nodes.map((node) => resolvePath(node)),
    tree: resolvePath(values.tree === undefined ? process.cwd() : once(values.tree, 'tree')) };
}

function git(tree: string, args: string[]): string {
  return runGit(tree, args).toString('utf8').trim();
}

/** The repository's top level; the tree must be it (a linked worktree's included). */
function topLevel(tree: string): string {
  let top: string;
  try {
    top = git(tree, ['rev-parse', '--show-toplevel']);
  } catch {
    throw new CheckReleaseError(3, `${tree} is not a git repository`);
  }
  if (realpathSync(top) !== realpathSync(tree)) {
    throw new CheckReleaseError(3, `${tree} is not the top level of its git repository (${top})`);
  }
  return top;
}

function checkNodes(nodes: string[]): void {
  for (const node of nodes) {
    for (const program of ['node', 'npm']) {
      if (!existsSync(join(node, program))) {
        throw new CheckReleaseError(3, `--node ${node}: no ${program} in it`);
      }
    }
  }
}

function reportPath(report: string, top: string, tree: string): string {
  try {
    return checkReportPath(report, top, tree);
  } catch (error) {
    if (!(error instanceof ReportPathError)) throw error;
    const why = error.kind === 'dangling' ? 'a symbolic link to a path that does not exist'
      : `inside the repository ${top}`;
    throw new CheckReleaseError(3, `--report ${report}: ${why}; the report goes to a file outside `
      + 'the tree (dl-044, dl-054)');
  }
}

function checkTree(tree: string): void {
  const status = runGit(tree, ['status', '--porcelain', '--untracked-files=normal'])
    .toString('utf8').trimEnd();
  if (status !== '') {
    // The entries first, so that the report ends with the refusal's own line.
    const entries = lines(status);
    throw new CheckReleaseError(1, `${status}\nthe working tree is not clean (${entries.length} `
      + `${entries.length === 1 ? 'entry' : 'entries'})`);
  }
  if (!existsSync(join(tree, CACHE))) {
    throw new CheckReleaseError(1, `no ${CACHE} in ${tree}: the records always copied it; without `
      + 'it the matrix would install the releases from the network');
  }
}

function currentBranch(tree: string): string {
  try {
    return git(tree, ['symbolic-ref', '--quiet', '--short', 'HEAD']);
  } catch {
    return '';
  }
}

/** A clone of the tree at its HEAD, on its branch, with a local main, every tag, no remote. */
function cloneAt(tree: string, dir: string): void {
  const head = git(tree, ['rev-parse', 'HEAD']);
  const branch = currentBranch(tree);
  runGit(tree, ['clone', '--quiet', '--no-local', ...(branch === '' ? [] : ['--branch', branch]),
    tree, dir]);
  if (branch === '') git(dir, ['checkout', '--quiet', '--detach', head]);
  const cloned = git(dir, ['rev-parse', 'HEAD']);
  if (cloned !== head) throw new GitError(`the clone's HEAD ${cloned} is not the tree's ${head}`);
  try {
    git(dir, ['rev-parse', '--verify', '--quiet', 'refs/heads/main']);
  } catch {
    try {
      git(dir, ['branch', '--quiet', 'main', 'refs/remotes/origin/main']);
    } catch {
      // No main to read from: publish:pack's dry run then says what it needs.
    }
  }
  git(dir, ['remote', 'remove', 'origin']);
  cpSync(join(tree, CACHE), join(dir, CACHE), { recursive: true });
}

interface Step {
  args: string[];
  /** The directory, relative to the clone; '' for its root. */
  where: string;
}

const npm = (...args: string[]): Step => ({ args, where: '' });

/** The list of one leg (dl-054 › Context), the evidence right after the build on the first. */
function legSteps(clone: string, first: boolean): Step[] {
  const matrix = join(clone, 'src', 'matrix');
  const releases = existsSync(matrix) ? readdirSync(matrix).filter((name) => name
    .startsWith('wingfoil-') && statSync(join(matrix, name)).isDirectory()).sort() : [];
  return [
    npm('ci'), npm('run', 'build'),
    ...(first ? [npm('run', 'validate:publication', '--', '--evidence')] : []),
    npm('test'), npm('run', 'lint'), npm('run', 'check:pins'), npm('run', 'check:schemas'),
    npm('run', 'check:packs'), npm('run', 'index', '--', '--check'), npm('run', 'validate'),
    npm('run', 'validate', '--', '--tree', 'tests/fixtures/compose/tree', '--param',
      'project_name=Golden'),
    ...OVERLAYS.map((overlay) => npm('run', 'validate', '--', '--overlay',
      `tests/fixtures/${overlay}`)),
    npm('run', '-s', 'wingfoil', '--', 'workflow', 'list'), npm('run', 'check:runs'),
    npm('audit', '--omit=dev'),
    ...releases.map((release) => ({ args: ['audit'], where: join('src', 'matrix', release) })),
  ];
}

function lines(text: string): string[] {
  return text.split(/\r?\n/);
}

/** The counts' lines a command's output gives the report (task-106 criterion 4). */
function countsOf(args: string[], outcome: Outcome): string[] {
  const shown = args.join(' ');
  if (shown === 'test') {
    // TAP's lines (Node.js 22, its output not a terminal); the spec reporter's of a later Node.js.
    const counts = lines(outcome.stdout).filter((line) => /^(#|ℹ) (tests|pass|fail) /.test(line));
    if (counts.length > 0) return counts;
  }
  if (shown === 'run validate:publication -- --evidence') {
    const out = lines(outcome.stdout);
    const start = out.indexOf('## Validation');
    if (start >= 0) {
      const section = out.slice(start);
      while (section.length > 0 && section[section.length - 1] === '') section.pop();
      return section;
    }
  }
  const last = (text: string): string | undefined => lines(text).map((line) => line.trimEnd())
    .filter((line) => line.trim() !== '' && !line.startsWith('> ')
      && !/^npm (warn|notice)\b/i.test(line)).pop();
  return [last(outcome.stdout) ?? last(outcome.stderr) ?? '(no output)'];
}

/** The default runner: the command's output streamed to the terminal and kept in full. */
const spawnRunner: Runner = (program, args, options) => new Promise((resolve, reject) => {
  const child = spawn(program, args, { cwd: options.cwd, env: options.env,
    stdio: ['ignore', 'pipe', 'pipe'] });
  const out: Buffer[] = [];
  const err: Buffer[] = [];
  child.stdout.on('data', (chunk: Buffer) => {
    out.push(chunk);
    process.stdout.write(chunk);
  });
  child.stderr.on('data', (chunk: Buffer) => {
    err.push(chunk);
    process.stderr.write(chunk);
  });
  child.on('error', reject);
  child.on('close', (code, signal) => resolve({ code, signal,
    stdout: Buffer.concat(out).toString('utf8'), stderr: Buffer.concat(err).toString('utf8') }));
});

/** How a command ended, as the report writes it. */
function ended(outcome: Outcome): string {
  return outcome.code === null ? `signal ${outcome.signal ?? '?'}` : `exit ${outcome.code}`;
}

class Run {
  readonly lines: string[] = [];
  failed: string | undefined;

  constructor(private readonly runner: Runner) {}

  /**
   * Runs one command; its line and its counts' lines go to the report, a version's only when it
   * fails (`quiet`); undefined when it failed, the failure named.
   */
  private async step(label: string, program: string, args: string[], cwd: string,
    env: NodeJS.ProcessEnv, quiet = false): Promise<Outcome | undefined> {
    let outcome: Outcome;
    try {
      outcome = await this.runner(program, args, { cwd, env });
    } catch (error) {
      this.lines.push(`- ${label}: could not start: ${message(error)}`);
      throw error;
    }
    const failed = outcome.code !== 0;
    if (failed || !quiet) {
      this.lines.push(`- ${label}: ${ended(outcome)}`);
      for (const line of countsOf(args, outcome)) this.lines.push(`  ${line}`);
    }
    if (!failed) return outcome;
    this.failed = `${label} (${ended(outcome)})`;
    return undefined;
  }

  /** Runs the steps in the clone with the leg's Node.js; false at the first failure. */
  async leg(name: string, bin: string, clone: string, steps: Step[]): Promise<boolean> {
    const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${bin}${delimiter}`
      + `${process.env['PATH'] ?? ''}`, npm_config_update_notifier: 'false' };
    const versions: string[] = [];
    for (const program of ['node', 'npm']) {
      const outcome = await this.step(`${name}: ${program} --version`, join(bin, program),
        ['--version'], clone, env, true);
      if (outcome === undefined) return false;
      versions.push(outcome.stdout.trim());
    }
    this.lines.push(`${name}: node ${versions[0] ?? ''}, npm ${versions[1] ?? ''}`);
    for (const step of steps) {
      const shown = `npm ${step.args.join(' ')}`;
      const label = step.where === '' ? shown : `${shown} (${step.where})`;
      const cwd = step.where === '' ? clone : join(clone, step.where);
      if (await this.step(label, join(bin, 'npm'), step.args, cwd, env) === undefined) return false;
    }
    return true;
  }

  status(name: string, clone: string): void {
    const status = git(clone, ['status', '--short']);
    this.lines.push(`${name}: git status --short, ${status === '' ? 0 : lines(status).length} lines`);
  }
}

async function runLegs(args: Args, run: Run, clones: string[], scratch: string): Promise<void> {
  const make = (name: string): string => {
    const dir = join(scratch, name);
    clones.push(dir);
    cloneAt(args.tree, dir);
    return dir;
  };
  for (const [index, bin] of args.nodes.entries()) {
    const name = `leg ${index + 1}`;
    const clone = make(`leg-${index + 1}`);
    if (!await run.leg(name, bin, clone, legSteps(clone, index === 0))) return;
    run.status(name, clone);
    if (index === 0) {
      const dry = make('dry-run');
      if (!await run.leg('dry run', bin, dry, [npm('ci'), npm('run', 'build'),
        npm('run', 'publish:pack', '--', '--pack', args.pack, '--dry-run')])) return;
    }
  }
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function runCheckRelease(argv: string[], options: CheckReleaseOptions = {}):
  Promise<CheckReleaseResult> {
  let args: Args;
  let report: string;
  try {
    args = parse(argv);
    const top = topLevel(args.tree);
    checkNodes(args.nodes);
    report = reportPath(args.report, top, args.tree);
  } catch (error) {
    if (error instanceof CheckReleaseError) return { code: error.code, lines: [error.message] };
    throw error;
  }
  try {
    writeFileSync(report, '');
  } catch (error) {
    return { code: 2, lines: [`--report ${args.report}: ${message(error)}`] };
  }
  const run = new Run(options.runner ?? spawnRunner);
  let code = 0;
  const clones: string[] = [];
  let scratch: string | undefined;
  try {
    run.lines.push(`check:release (dl-054): commit ${git(args.tree, ['rev-parse', 'HEAD'])}, `
      + `pack ${args.pack}`);
    checkTree(args.tree);
    scratch = mkdtempSync(join(tmpdir(), 'check-release-'));
    await runLegs(args, run, clones, scratch);
    if (run.failed === undefined) run.lines.push('check:release: pass');
    else {
      code = 1;
      run.lines.push(`check:release: fail at ${run.failed}`);
    }
  } catch (error) {
    if (error instanceof CheckReleaseError) {
      code = error.code;
      run.lines.push(...lines(error.message));
    } else if (error instanceof GitError) {
      code = 2;
      run.lines.push(...lines(error.message));
    } else {
      code = 2;
      run.lines.push(`check:release: ${message(error)}`);
    }
  }
  const remove = options.remove ?? ((dir: string): void => rmSync(dir, { recursive: true,
    force: true }));
  for (const clone of clones) {
    try {
      remove(clone);
    } catch (error) {
      run.lines.push(`check:release: the clone ${clone} could not be removed: ${message(error)}`);
      if (code === 0) code = 2;
    }
  }
  if (scratch !== undefined) {
    try {
      rmSync(scratch, { recursive: true, force: true });
    } catch (error) {
      run.lines.push(`check:release: ${scratch} could not be removed: ${message(error)}`);
      if (code === 0) code = 2;
    }
  }
  const write = options.write ?? ((path: string, text: string): void => writeFileSync(path, text));
  try {
    write(report, run.lines.map((line) => `${line}\n`).join(''));
  } catch (error) {
    run.lines.push(`--report ${args.report}: the report could not be written: ${message(error)}`);
    if (code === 0) code = 2;
  }
  return { code, lines: run.lines };
}

