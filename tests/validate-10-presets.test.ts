// A preset's required parameters with no default: the validation's stand-in values (task-090,
// plan-070 point 2, spec-001 §15); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { before, describe, it } from 'node:test';

import { compareTrees } from '../src/compare-trees';
import { runCompose } from '../src/compose-cli';
import { STAND_INS } from '../src/preset-stand-ins';
import type { ValidateResult } from '../src/validate';

import { writePack } from './support/pack-tree';
import { NAME, OVERLAY, TREE, validate, withTree, replaceIn, writeComposition }
  from './support/validate-harness';

/** Every `dna.yaml` under a composed output. */
function dnaFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return dnaFiles(path);
    return name === 'dna.yaml' ? [path] : [];
  });
}

/** Writes a preset and its index entry. */
function writePreset(tree: string, id: string, packs: string[], parameters = '{}'): void {
  writeFileSync(join(tree, 'presets', `${id}.yaml`), `format: 1\nid: ${id}\ntitle: "${id}"\n`
    + `description: "Stand-ins."\npacks:\n${packs.map((pack) => `  - ${pack}\n`).join('')}`
    + `parameters: ${parameters}\n`);
  replaceIn(join(tree, 'catalog.yaml'), 'presets:\n',
    `presets:\n  - { id: ${id}, path: presets/${id}.yaml }\n`);
}

/** The fixture base's one required parameter is project_name, so its stand-in is the one read. */
const STAND_IN = STAND_INS['project_name'] ?? '';

describe('npm run validate: stand-in values for a preset\'s required parameters (task-090)', () => {
  /** The composed dna.yaml texts of a run, through the determinism check's compare. */
  interface Run { result: ValidateResult; dna: string[] }
  const runs = new Map<string, Run>();
  const runOn = (tree: string, key: string, argv: string[],
    mode: 'self-test' | 'publication' = 'self-test'): void => {
    const dna: string[] = [];
    const result = validate(['--tree', tree, ...argv], {
      mode,
      compare: (first, second) => {
        for (const file of dnaFiles(first)) dna.push(readFileSync(file, 'utf8'));
        return compareTrees(first, second);
      },
    });
    runs.set(key, { result, dna });
  };
  const run = (key: string): Run => {
    const found = runs.get(key);
    assert.ok(found !== undefined, key);
    return found;
  };
  const report = (key: string): string => run(key).result.lines.join('\n');
  const composed = (key: string, label: string): boolean => run(key).result.lines.some((line) =>
    line.startsWith(`composition ${label}: composed twice, `));

  before(() => {
    withTree((tree) => {
      writePack(tree, { id: 'blueprint/keyed', directives: ['keyed'], manifest: { parameters: {
        api_key: { type: 'string', description: 'The key.' } } } });
      writePack(tree, { id: 'stage/locked', format: 2, directives: ['locked'],
        conditional: [{ with: 'blueprint/keyed@^1', directives: ['locked-with'] }] });
      writePreset(tree, 'own-name', ['methodology/kanban@^1'], '\n  project_name: "Own Name"');
      writePreset(tree, 'with-software', ['software@^1', 'methodology/flow@^1']);
      writePreset(tree, 'keyed', ['methodology/kanban@^1', 'stage/locked@^1']);
      writeComposition(tree, 'bare', 'format: 1\nid: bare\ntitle: "Bare"\n'
        + 'description: "No values."\npacks:\n  - methodology/kanban@^1\nparameters: {}\n');
    }, (tree) => {
      runOn(tree, 'bare', []);
      runOn(tree, 'publication', [], 'publication');
      runOn(tree, 'named', NAME);
      runOn(tree, 'overlay', ['--overlay', OVERLAY]);
    }, true);
  });

  it('composes a preset that sets no required parameter, with the stand-ins in dna.yaml', () => {
    assert.ok(composed('bare', 'presets/golden.yaml'), report('bare'));
    assert.ok(composed('publication', 'presets/golden.yaml'), report('publication'));
    assert.ok(run('bare').dna.some((text) => text.includes(STAND_IN)),
      report('bare'));
  });

  it('keeps the value a preset sets, and the value --param gives, over a stand-in', () => {
    assert.ok(composed('bare', 'presets/own-name.yaml'), report('bare'));
    assert.ok(run('bare').dna.some((text) => text.includes('Own Name')), report('bare'));
    assert.ok(composed('named', 'presets/golden.yaml'), report('named'));
    assert.ok(!run('named').dna.some((text) => text.includes(STAND_IN)),
      report('named'));
  });

  it('refuses a --param overriding a value the preset sets, as before', () => {
    assert.ok(run('named').result.lines.some((line) => line.startsWith(
      'composition presets/own-name.yaml: ') && line.includes(
      '--param project_name overrides the value the preset sets')), report('named'));
  });

  it('gives no stand-in to an example or to an overlay\'s composition', () => {
    const failsUnset = (key: string, prefix: string): boolean => run(key).result.lines.some(
      (line) => line.startsWith(`composition ${prefix}`) && line.includes('project_name')
        && line.includes('is required and has no value'));
    assert.ok(failsUnset('bare', 'tests/fixtures/examples/'), report('bare'));
    assert.ok(failsUnset('overlay', `${OVERLAY}/compositions/bare/example.yaml`),
      report('overlay'));
  });

  it('gives a preset\'s leg its stand-ins, and still skips a leg whose added pack has an unset '
    + 'parameter (plan-066 ruling 4)', () => {
    assert.ok(composed('bare', 'presets/with-software.yaml[-software]'), report('bare'));
    assert.ok(!run('bare').result.lines.some((line) => /, dropped .*project_name/.test(line)),
      report('bare'));
    assert.ok(run('bare').result.lines.includes(
      'matrix presets/keyed.yaml[+blueprint/keyed]: skipped, api_key has no value'),
    report('bare'));
  });

  it('leaves npm run compose unchanged: no value, no composition', () => {
    const out = mkdtempSync(join(tmpdir(), 'stand-ins-'));
    try {
      const outcome = runCompose(['--tree', TREE, '--out', join(out, 'tree'),
        'methodology/kanban@^1']);
      assert.notEqual(outcome.code, 0);
      assert.match(outcome.message ?? '', /project_name .* is required and has no value/);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });
});
