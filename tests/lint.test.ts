import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { ESLint } from 'eslint';

import { REPO_ROOT } from './support/paths';

/** Probe paths, linted from text: the project service accepts them though they are not on disk. */
const PROBES = ['src/probe.ts', 'tests/probe.ts', 'tests/probe.test.ts'];
const DETERMINISM_RULES = new Set([
  'no-restricted-properties', 'no-restricted-syntax', 'no-restricted-imports',
]);

/** One form per line, after the imports; `marker` names the line. */
const FORMS = [
  'Date.now()', 'new Date()', 'Date()', 'Math.random()', 'performance.now()', 'process.hrtime()',
  'process.hrtime.bigint()', 'crypto.randomUUID()', 'crypto.randomBytes(4)',
];
const IMPORTS = [
  "import * as crypto from 'node:crypto';",
  "import { randomUUID, randomBytes, createHash } from 'node:crypto';",
  "import { hrtime } from 'node:process';",
  "import { performance as perf } from 'node:perf_hooks';",
  "import { randomUUID as bareRandomUUID } from 'crypto';",
];
/** Allowed values, and the imported names used so that only their imports are reported. */
const ALLOWED = [
  'new Date(0)', "createHash('sha256')", 'randomUUID', 'randomBytes', 'hrtime', 'perf',
  'bareRandomUUID',
];
const PROBE = [
  ...IMPORTS,
  'export function probe(): unknown[] {',
  '  return [',
  ...FORMS.map((form) => `    ${form},`),
  ...ALLOWED.map((form) => `    ${form},`),
  '  ];',
  '}',
  '',
].join('\n');

function lint(text: string, path: string): Promise<ESLint.LintResult[]> {
  const eslint = new ESLint({
    cwd: REPO_ROOT,
    overrideConfig: {
      languageOptions: { parserOptions: { projectService: { allowDefaultProject: PROBES } } },
    },
  });
  return eslint.lintText(text, { filePath: join(REPO_ROOT, path) });
}

async function messages(text: string, path: string): Promise<ESLint.LintResult['messages']> {
  const [result] = await lint(text, path);
  assert.ok(result !== undefined);
  return result.messages;
}

describe('lint: determinism rules (adr-004)', () => {
  it('reports every clock and randomness form under src/, and nothing else', async () => {
    const found = await messages(PROBE, 'src/probe.ts');
    const lines = PROBE.split('\n');
    const lineOf = (text: string): number => lines.findIndex((line) => line.includes(text)) + 1;
    const errors = found.filter((message) =>
      message.severity === 2 && DETERMINISM_RULES.has(message.ruleId ?? ''));
    const flagged = new Set(errors.map((message) => message.line));
    for (const form of FORMS) assert.ok(flagged.has(lineOf(`    ${form},`)), form);
    for (const line of IMPORTS.slice(1)) assert.ok(flagged.has(lineOf(line)), line);
    assert.ok(!flagged.has(lineOf('    new Date(0),')), 'new Date(0) is allowed');
    assert.ok(!flagged.has(lineOf("    createHash('sha256'),")), 'createHash is allowed');
    const others = found.filter((message) => !DETERMINISM_RULES.has(message.ruleId ?? ''));
    assert.deepEqual(others, []);
  });

  it('leaves tests/ outside the determinism rules', async () => {
    const found = await messages(PROBE, 'tests/probe.ts');
    assert.deepEqual(found.filter((message) => DETERMINISM_RULES.has(message.ruleId ?? '')), []);
  });
});

describe('lint: node:test known-safe calls', () => {
  it('lets describe and it float, and nothing else', async () => {
    const text = [
      "import { describe, it } from 'node:test';",
      "describe('x', () => { it('y', () => undefined); });",
      'async function pending(): Promise<void> { await Promise.resolve(); }',
      'pending();',
      '',
    ].join('\n');
    const found = await messages(text, 'tests/probe.test.ts');
    const floating = found.filter((message) =>
      message.ruleId === '@typescript-eslint/no-floating-promises');
    assert.deepEqual(floating.map((message) => message.line), [4]);
  });
});

function lintScript(): string {
  const manifest = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>;
  };
  return manifest.scripts['lint'] ?? '';
}

describe('lint: the script', () => {
  it('is eslint --max-warnings 0 .', () => {
    assert.equal(lintScript(), 'eslint --max-warnings 0 .');
  });

  it('lints its own configuration file cleanly', async () => {
    const [result] = await new ESLint({ cwd: REPO_ROOT }).lintFiles(['eslint.config.mjs']);
    assert.deepEqual(result?.messages, []);
  });

  it('fails on a warning', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lint-warning-'));
    try {
      writeFileSync(join(dir, 'eslint.config.mjs'),
        "export default [{ files: ['**/*.js'], rules: { 'no-console': 'warn' } }];\n");
      writeFileSync(join(dir, 'probe.js'), "console.log('only a warning');\n");
      const [command, ...args] = lintScript().split(' ');
      assert.equal(command, 'eslint');
      const bin = join(REPO_ROOT, 'node_modules', 'eslint', 'bin', 'eslint.js');
      const result = spawnSync(process.execPath, [bin, ...args], {
        cwd: dir, encoding: 'utf8',
      });
      assert.match(result.stdout, /0 errors, 1 warning/);
      assert.equal(result.status, 1);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
