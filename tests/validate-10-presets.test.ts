// A preset's required parameters with no default: the validation's stand-in values (task-090,
// plan-070 point 2, spec-001 §15); the helpers in tests/support/validate-harness.ts.
import { strict as assert } from 'node:assert';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { before, describe, it } from 'node:test';

import { compareTrees } from '../src/compare-trees';
import { runCompose } from '../src/compose-cli';
import type { ValidateResult } from '../src/validate';

import { writePack } from './support/pack-tree';
import { NAME, TREE, validate, withTree, replaceIn } from './support/validate-harness';

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

/** The stand-in for project_name, the fixture base's one required parameter (the Design). */
const STAND_IN = 'Preset Check';

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
    }, (tree) => {
      runOn(tree, 'bare', []);
      runOn(tree, 'publication', [], 'publication');
      runOn(tree, 'named', NAME);
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

  it('gives no stand-in to an example', () => {
    assert.ok(run('bare').result.lines.some((line) => line.startsWith('composition '
      + 'tests/fixtures/examples/') && line.includes('project_name')
      && line.includes('is required and has no value')), report('bare'));
  });

  it('gives a preset\'s leg its stand-ins, and still skips a leg whose added pack has an unset '
    + 'parameter (plan-066 ruling 4)', () => {
    assert.ok(composed('bare', 'presets/with-software.yaml[-software]'), report('bare'));
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
