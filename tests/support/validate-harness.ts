// The helpers of the validate tests, shared by their files (task-089): each test file runs in
// its own process, so each has its own stubs, disposed at its end by the hooks below.
import { strict as assert } from 'node:assert';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after } from 'node:test';

import { loadCompat } from '../../src/compat';
import { EXEMPTION } from '../../src/examples';
import { runIndex } from '../../src/index';
import { runValidate } from '../../src/validate';
import type { ValidateOptions, ValidateResult } from '../../src/validate';

import { FIXTURES } from './paths';
import { FORMAT_WARNING, StubWingfoil } from './stub-wingfoil';
import type { StubCommand } from './stub-wingfoil';

export const TREE = join(FIXTURES, 'compose', 'tree');
export const ENTRIES = ['methodology/kanban', 'phase/inception/lean', 'blueprint/web-service',
  'team-mode/agent-first', 'stage/production'];
export const NAME = ['--param', 'project_name=Golden'];
/** The examples of the golden tree's packs, in path order (task-022). */
export const GOLDEN_EXAMPLES = ['agent-first/agent-team', 'base/core-only', 'base/kanban-team',
  'flow/core-team', 'flow/delivery-team', 'kanban/small-board', 'lean/new-product',
  'production/live-service', 'software/delivery-team', 'web-service/orders-api']
  .map((example) => `tests/fixtures/examples/${example}/example.yaml`);
/** The compositions of the golden tree: flow's examples with their other leg (task-032). */
export const GOLDEN_LEGS = GOLDEN_EXAMPLES.flatMap((example) => [example,
  ...example.includes('/flow/core-team/') ? [`${example}[+software]`] : [],
  ...example.includes('/flow/delivery-team/') ? [`${example}[-software]`] : []]);

/** WingFoil 0.2.2 as the tests see it: exit 0, one format warning per command (W-01). */
export function stubbed(command: StubCommand): StubWingfoil {
  return new StubWingfoil({ commands: Object.fromEntries(
    ['workflow list', 'dna show', 'directives list'].map((line) => [line, command])) });
}
export const WINGFOIL = stubbed({ stderr: [FORMAT_WARNING] });
after(() => WINGFOIL.dispose());

/** JSON with nothing to report, as every release from 0.3.0 on prints it (task-036, task-079). */
export const CLEAN_JSON = { stdout: [JSON.stringify({ workflows: [], diagnostics: [], entries: [],
  warnings: [] })] };
/** A release from 0.3.0 on as the tests see it: its version line, JSON with nothing to report but
 * the given diagnostics (task-036, task-059, task-074; task-079: one for every release). */
export function stubbedClean(release: string, diagnostics: unknown[] = []): StubWingfoil {
  return new StubWingfoil({ version: `${release} (0000000)`, commands: {
    'workflow list': { stdout: [JSON.stringify({ workflows: [], diagnostics })] },
    'dna show': CLEAN_JSON, 'directives list': CLEAN_JSON } }, release);
}

/** The newest release the golden tree's compat.yaml lists, which equals this repository's
 * (dl-010, checked by compat.test.ts): read from the fixture, so that task-045's rule holds. */
export const NEWEST = (() => {
  const releases = loadCompat(join(FIXTURES, 'compose', 'tree', 'compat.yaml')).releases;
  const last = releases[releases.length - 1];
  assert.ok(last !== undefined);
  return last.wingfoil;
})();

/** Strict `X.Y.Z`: the versions the factory below answers. */
export const STRICT = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/;
/** A default stub per release, made when first asked for and removed at the end. */
export const DEFAULTS = new Map<string, StubWingfoil>();
after(() => { for (const stub of DEFAULTS.values()) stub.dispose(); });

/**
 * The stub of each release a `compat.yaml` lists: `wingfoil-<version>` is never installed in the
 * tests. 0.2.2 has its format warning; any other strict `X.Y.Z` a clean stub (task-079), unless
 * `overrides` gives one; anything else is an error.
 */
export function byRelease(overrides: Record<string, StubWingfoil> = {}):
  (version: string) => string {
  return (version) => {
    const given = overrides[version] ?? (version === '0.2.2' ? WINGFOIL : undefined);
    if (given !== undefined) return given.cli;
    if (!STRICT.test(version)) throw new Error(`no stub for wingfoil@${version}`);
    let stub = DEFAULTS.get(version);
    if (stub === undefined) {
      stub = stubbedClean(version);
      DEFAULTS.set(version, stub);
    }
    return stub.cli;
  };
}

/** `validate` never installs a release in the tests: a stub stands for each release. */
export function validate(argv: string[], options: Partial<ValidateOptions> = {}): ValidateResult {
  return runValidate(argv, { mode: 'self-test', install: byRelease(), ...options });
}

export function withTree(edit: (tree: string) => void, body: (tree: string) => void,
  expectIndexRefusal = false): void {
  const dir = mkdtempSync(join(tmpdir(), 'validate-'));
  try {
    const tree = join(dir, 'tree');
    cpSync(TREE, tree, { recursive: true });
    edit(tree);
    // The edit is the test's; the index outputs follow it (task-019), when the tree allows.
    const index = runIndex(['--tree', tree]);
    assert.ok(index.code === 0 || expectIndexRefusal, index.lines.join('\n'));
    body(tree);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

export function replaceIn(file: string, from: string, to: string): void {
  const text = readFileSync(file, 'utf8');
  assert.ok(text.includes(from), `${from} not in ${file}`);
  writeFileSync(file, text.replace(from, to));
}

// The overlay's fixtures and helpers (task-046), shared by its two files (task-089).
export const OVERLAY = 'tests/fixtures/overlay';
export const CORE = `${OVERLAY}/compositions/core-team/example.yaml`;
export const DELIVERY = `${OVERLAY}/compositions/delivery-team/example.yaml`;
export const PUBLICATION_LINE = '--overlay: an overlay is never publishable (plan-046 ruling 1)';

/** Moves a pack of the tree into the overlay. */
export function movePack(tree: string, path: string): void {
  cpSync(join(tree, 'packs', path), join(tree, OVERLAY, 'packs', path), { recursive: true });
  rmSync(join(tree, 'packs', path), { recursive: true });
}

/** Writes an overlay composition. */
export function writeComposition(tree: string, id: string, body: string): void {
  mkdirSync(join(tree, OVERLAY, 'compositions', id), { recursive: true });
  writeFileSync(join(tree, OVERLAY, 'compositions', id, 'example.yaml'), body);
}

/** methodology/flow and its two examples move from the golden tree into the overlay. */
export function moveFlow(tree: string): void {
  movePack(tree, 'methodology/flow');
  for (const id of ['core-team', 'delivery-team']) {
    writeComposition(tree, id, readFileSync(join(tree, 'tests', 'fixtures', 'examples', 'flow',
      id, 'example.yaml'), 'utf8'));
  }
  rmSync(join(tree, 'tests', 'fixtures', 'examples', 'flow'), { recursive: true });
}

/** Section 7 of a README keeps the named examples, or the exemption line when none is left. */
export function keepExamples(readme: string, keep: string[]): void {
  const text = readFileSync(readme, 'utf8');
  const start = text.indexOf('## Examples\n');
  const end = text.indexOf('\n## ', start + 1);
  assert.ok(start >= 0 && end > start, readme);
  const parts = text.slice(start, end).split('\n### ').slice(1)
    .filter((part) => keep.includes(part.slice(0, part.indexOf('\n'))));
  const body = parts.length === 0 ? `\n${EXEMPTION}\n`
    : parts.map((part) => `\n### ${part.trimEnd()}\n`).join('');
  writeFileSync(readme, `${text.slice(0, start)}## Examples\n${body}${text.slice(end)}`);
}

/** The golden tree with no methodology: criterion 6's tree; the overlay holds kanban. */
export function withoutMethodology(tree: string): void {
  movePack(tree, 'methodology/kanban');
  rmSync(join(tree, 'packs', 'methodology'), { recursive: true });
  rmSync(join(tree, 'presets'), { recursive: true });
  replaceIn(join(tree, 'catalog.yaml'),
    'presets:\n  - { id: golden, path: presets/golden.yaml }\n', 'presets: []\n');
  writeComposition(tree, 'delivery-team', readFileSync(join(tree, 'tests', 'fixtures',
    'examples', 'software', 'delivery-team', 'example.yaml'), 'utf8'));
  const examples = join(tree, 'tests', 'fixtures', 'examples');
  for (const pack of ['agent-first', 'flow', 'kanban', 'lean', 'production', 'software',
    'web-service']) {
    rmSync(join(examples, pack), { recursive: true });
  }
  rmSync(join(examples, 'base', 'kanban-team'), { recursive: true });
  keepExamples(join(tree, 'packs', 'base', 'README.md'), ['core-only']);
  for (const pack of ['team-mode/agent-first', 'phase/inception/lean', 'stage/production',
    'software', 'blueprint/web-service']) {
    keepExamples(join(tree, 'packs', pack, 'README.md'), []);
  }
}

export const treeLines = (result: ValidateResult): string[] => result.lines.filter((line) =>
  /^(schemas|lint|index):/.test(line)
  || (line.startsWith('composition ') && !line.startsWith(`composition ${OVERLAY}/`)));
