import { strict as assert } from 'node:assert';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { indexOutputs } from '../src/index';
import { generatedSections, rewriteReadme } from '../src/readme-generate';
import { withPackTree } from './support/pack-tree';
import { FIXTURES } from './support/paths';

const TREE = join(FIXTURES, 'compose', 'tree');

function withCopy(body: (tree: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), 'readme-generate-'));
  try {
    cpSync(TREE, join(dir, 'tree'), { recursive: true });
    body(join(dir, 'tree'));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function readmes(tree: string): Map<string, string> {
  return new Map([...indexOutputs(tree)].filter(([path]) => path.endsWith('README.md')));
}

describe('generatedSections (acceptance 10)', () => {
  it('writes the title, description and axis line, with the slot of a phase pack', () => {
    assert.deepEqual(generatedSections(TREE, 'phase/inception/lean').title,
      ['# lean', '', 'Golden fixture pack phase/inception/lean.', '',
        'Axis: phase · Slot: inception']);
    assert.equal(generatedSections(TREE, 'base').title.at(-1), 'Axis: foundation');
    // Read from software's own pack.yaml, which has no axis (spec-002 §2.1, §2.2).
    assert.equal(generatedSections(TREE, 'software').title.at(-1), 'Axis: foundation');
  });

  it('writes the composition, with what a pack declares except for base', () => {
    const kanban = generatedSections(TREE, 'methodology/kanban').composition;
    assert.ok(kanban.includes('- **Requires:** `base@^1`, `software@^1`'));
    assert.ok(kanban.includes('- **Formats:** `directive` 1, `roles` 1, `workflow` 1'));
    assert.ok(kanban.includes('  - workflows: `delivery`, `replenishment`'));
    assert.ok(!generatedSections(TREE, 'base').composition.includes('- **Declares:**'));
    assert.ok(generatedSections(TREE, 'software').composition.includes('- **Declares:**'));
    // A conditional part, marked as present only with software (spec-002 §2.1, plan-039 R8).
    const flow = generatedSections(TREE, 'methodology/flow');
    assert.ok(flow.composition.includes(
      '  - workflows only with `software`: `delivery`, `flow-delivery`'),
    flow.composition.join('\n'));
    assert.ok(!flow.composition.some((line) => line.startsWith('  - directives only with')),
      'no directive in flow\'s part: no line');
    assert.ok(flow['what-it-adds'].includes('- `delivery` (sub), only with `software`'),
      flow['what-it-adds'].join('\n'));
    assert.ok(flow['what-it-adds'].includes('- `flow-board` (sub)'));
    const agentFirst = generatedSections(TREE, 'team-mode/agent-first').composition;
    assert.ok(agentFirst.includes('  - roles: `reviewer`'), agentFirst.join('\n'));
  });

  it('marks a conditional part\'s directives in sections 4 and 5 (plan-039 R8)', () => {
    withPackTree([{ id: 'governance/notes', workflows: ['notes'],
      manifest: { formats: { workflow: 1, directive: 1 }, conditional: [{ with: 'software@^1',
        contents: { directives: ['notes-rules'] } }] },
      extraFiles: { 'directives/notes-rules.md': '---\nid: notes-rules\nformat: 1\n---\n' } }],
    (root) => {
      const notes = generatedSections(root, 'governance/notes');
      assert.ok(notes.composition.includes('  - directives only with `software`: `notes-rules`'),
        notes.composition.join('\n'));
      assert.ok(!notes.composition.some((line) => line.startsWith('  - workflows only with')));
      assert.ok(notes['what-it-adds'].includes('- `notes-rules`: —, only with `software`'),
        notes['what-it-adds'].join('\n'));
    }, { examples: false });
  });

  it('writes what a pack adds: workflow phases, Memory types, directives and their roles', () => {
    const base = generatedSections(TREE, 'base')['what-it-adds'];
    assert.ok(base.some((line) => line.startsWith('- `task`: `draft` → `pending`')), base.join('\n'));
    // adr is software's since task-031; its line reads only software's own fragments (spec-002 §2.2).
    const software = generatedSections(TREE, 'software')['what-it-adds'];
    assert.ok(software.includes('- `adr`: —'), software.join('\n'));
    assert.ok(!base.some((line) => line.startsWith('- `adr`:')), base.join('\n'));
    assert.ok(base.includes('- `base-rules`: `developer`'), base.join('\n'));
    const kanban = generatedSections(TREE, 'methodology/kanban')['what-it-adds'];
    assert.ok(kanban.includes('  - `release`, includes `release`'));
    assert.ok(kanban.includes('### Memory templates'));
  });

  it('writes phase roles, gates and includes, global directives, a type without states', () => {
    withPackTree([{ id: 'governance/review', fragments: ['dna', 'roles', 'memory'],
      directives: ['careful', 'loose', 'everywhere'], workflows: ['review'],
      extraFiles: {
        'fragments/dna.yaml': 'format: 1\nteam:\n  roles:\n    - { name: reviewer, '
          + 'description: "Reviews." }\n',
        'fragments/roles.yaml': 'format: 1\nassignments:\n  reviewer: [careful, other]\n'
          + 'global: [everywhere]\n',
        'fragments/memory.yaml': 'format: 1\ntypes:\n  note: { path: "docs/{id}.md" }\n',
        'workflows/review.yaml': 'format: 1\nname: review\nkind: main\nphases:\n'
          + '  - { name: check, role: reviewer, approval: { by_role: approver }, produces: [x] }\n'
          + '  - { name: more, include: delivery }\n',
      } }], (root) => {
      const adds = generatedSections(root, 'governance/review')['what-it-adds'];
      assert.ok(adds.includes('- `review` (main)'), adds.join('\n'));
      assert.ok(adds.includes('  - `check`, role `reviewer`, gate `approver`'));
      assert.ok(adds.includes('  - `more`, includes `delivery`'));
      assert.ok(adds.includes('- `careful`: `reviewer`'));
      assert.ok(adds.includes('- `everywhere`: global'));
      assert.ok(adds.includes('- `loose`: —'));
      assert.ok(!adds.some((line) => line.includes('`other`')));
      assert.ok(adds.includes('- `note`: —'));
      const composition = generatedSections(root, 'governance/review').composition;
      assert.ok(composition.includes('  - roles: `reviewer`'));
      assert.ok(composition.includes('  - Memory types: `note`'));
    });
  });

  it('writes a parameter table, or None.', () => {
    const kanban = generatedSections(TREE, 'methodology/kanban').parameters;
    assert.deepEqual(kanban.slice(2), ['| Name | Type | Default | Description |',
      '|---|---|---|---|', '| `wip_limit` | integer | `3` | WIP limit of the in-progress column |']);
    assert.deepEqual(generatedSections(TREE, 'stage/production').parameters,
      ['## Parameters', '', 'None.']);
  });
});

describe('rewriteReadme (acceptance 10)', () => {
  it('replaces only what lies between the markers', () => {
    const text = readFileSync(join(TREE, 'packs', 'methodology', 'kanban', 'README.md'), 'utf8');
    const out = rewriteReadme(text, { title: ['# T'], composition: ['## Composition', 'c'],
      'what-it-adds': ['## What it adds', 'w'], parameters: ['## Parameters', 'p'] });
    const strip = (readme: string): string => readme.replace(
      /(<!-- generated:begin (\S+) -->\n)[\s\S]*?(<!-- generated:end \2 -->)/g, '$1$3');
    assert.equal(strip(out), strip(text));
    assert.ok(out.includes('<!-- generated:begin title -->\n# T\n<!-- generated:end title -->'));
  });

  it('is unchanged by catalog.yaml, compat.yaml or another pack', () => {
    withCopy((tree) => {
      const before = readmes(tree);
      writeFileSync(join(tree, 'catalog.yaml'),
        readFileSync(join(tree, 'catalog.yaml'), 'utf8').replace(/presets:\n {2}- .*\n/,
          'presets: []\n'));
      const compat = join(tree, 'compat.yaml');
      writeFileSync(compat, readFileSync(compat, 'utf8').replace('capabilities: []',
        'capabilities: [pack-install]'));
      const other = join(tree, 'packs', 'base', 'pack.yaml');
      writeFileSync(other, readFileSync(other, 'utf8').replace(/^title: .*$/m, 'title: "Other"'));
      const after = readmes(tree);
      for (const [path, text] of before) {
        if (path !== 'packs/base/README.md') assert.equal(after.get(path), text, path);
      }
    });
  });
});
