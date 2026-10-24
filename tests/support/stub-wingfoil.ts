import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** What the stub prints for one command line (`workflow list`, `dna show`, `directives list`). */
export interface StubCommand {
  /** `{cwd}` is replaced by the stub's working directory. */
  stderr?: string[];
  stdout?: string[];
  status?: number;
}

export interface StubBehaviour {
  /** What `--version` prints; the release by default. */
  version?: string;
  /** Looked up by the exact arguments, then without a trailing `--format json` (task-035). */
  commands?: Record<string, StubCommand>;
  /**
   * At each command, append `{ args, tree, status }` to `snapshot.json` in the stub's directory:
   * `git ls-tree -r --name-only HEAD` and `git status --porcelain` of its working directory.
   */
  snapshot?: boolean;
}

const STUB = [
  "const fs = require('node:fs');",
  "const path = require('node:path');",
  "const { execFileSync } = require('node:child_process');",
  "const b = JSON.parse(fs.readFileSync(path.join(__dirname, 'behaviour.json'), 'utf8'));",
  "const args = process.argv.slice(2).join(' ');",
  "const bare = args.replace(/ --format json$/, '');",
  "const sub = (line) => line.split('{cwd}').join(process.cwd());",
  // None of the caller's GIT_* variables (GIT_DIR from a hook) reaches the stub's git (task-045).
  "const env = Object.fromEntries(Object.entries(process.env)",
  "  .filter(([k]) => !k.startsWith('GIT_')));",
  "const git = (a) => { try { return execFileSync('git', a, { encoding: 'utf8', env }); }",
  "  catch { return null; } };",
  "if (args === '--version') {",
  "  process.stdout.write(`${b.version}\\n`);",
  '} else {',
  '  if (b.snapshot) {',
  "    const file = path.join(__dirname, 'snapshot.json');",
  "    const seen = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];",
  "    seen.push({ args, tree: git(['ls-tree', '-r', '--name-only', 'HEAD']),",
  "      status: git(['status', '--porcelain']) });",
  '    fs.writeFileSync(file, JSON.stringify(seen));',
  '  }',
  '  const all = b.commands || {};',
  '  const c = all[args] || all[bare] || {};',
  "  for (const line of c.stderr || []) process.stderr.write(`${sub(line)}\\n`);",
  "  for (const line of c.stdout || ['ok']) process.stdout.write(`${sub(line)}\\n`);",
  '  process.exitCode = c.status || 0;',
  '}',
  '',
].join('\n');

/** A fake WingFoil CLI in a temporary directory; `dispose` removes it. */
export class StubWingfoil {
  readonly dir: string;
  readonly cli: string;

  constructor(behaviour: StubBehaviour, version = '0.2.2') {
    this.dir = mkdtempSync(join(tmpdir(), 'stub-wingfoil-'));
    this.cli = join(this.dir, 'cli.js');
    writeFileSync(this.cli, STUB);
    writeFileSync(join(this.dir, 'behaviour.json'),
      JSON.stringify({ version, ...behaviour }));
  }

  dispose(): void {
    rmSync(this.dir, { recursive: true, force: true });
  }
}

/** A composed output with a `.wingfoil/` of one file, as the matrix copies it. */
export function composedOutput(): { dir: string; dispose: () => void } {
  const dir = mkdtempSync(join(tmpdir(), 'composed-'));
  mkdirSync(join(dir, '.wingfoil'));
  writeFileSync(join(dir, '.wingfoil', 'dna.yaml'), 'format: 1\n');
  writeFileSync(join(dir, 'AGENTS.region.md'), 'region\n');
  return { dir, dispose: () => rmSync(dir, { recursive: true, force: true }) };
}

export const FORMAT_WARNING = 'Warning: {cwd}/.wingfoil/dna.yaml: unknown field(s) ignored: format';
