import { strict as assert } from 'node:assert';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { loadCatalog } from '../src/catalog';
import { composeDocuments } from '../src/compose-documents';
import { normalizeText, planOutput } from '../src/output';
import { BASE_COMPOSABLE, KANBAN, withPackTree } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { REPO_ROOT } from './support/paths';

const CATALOG = loadCatalog(join(REPO_ROOT, 'catalog.yaml'));
const BASE = BASE_COMPOSABLE;

function plan(specs: PackSpec[], request: string[]): Map<string, string> {
  let files = new Map<string, string>();
  withPackTree(specs, (root) => {
    const composed = composeDocuments(root, CATALOG, request, {});
    files = new Map(planOutput(composed, CATALOG).map((file) => [file.path, file.text]));
  });
  return files;
}

function fails(specs: PackSpec[], request: string[], pattern: RegExp): void {
  withPackTree(specs, (root) => {
    assert.throws(() => planOutput(composeDocuments(root, CATALOG, request, {}), CATALOG), pattern);
  });
}

/** A pack defining Memory type `note` and shipping its template. */
const NOTES: PackSpec = {
  id: 'governance/notes', fragments: ['memory'], memoryTemplates: ['note'],
  extraFiles: { 'fragments/memory.yaml': 'format: 1\ntypes:\n  note:\n    path: docs/{id}.md\n'
    + '    id_pattern: "note-{n}"\n    template: { file: memory/templates/built-in/note.md }\n' },
};

describe('output: assets (spec-001 §7.6)', () => {
  it('writes each asset to its built-in folder, copied whole', () => {
    const files = plan([BASE, KANBAN, NOTES, { id: 'blueprint/x', directives: ['d'], workflows: ['w'],
      extraFiles: { 'workflows/w.yaml': '# kept comment\nformat: 1\nname: w\nkind: sub\nversion: 7\n' } }],
    ['methodology/kanban', 'governance/notes', 'blueprint/x']);
    assert.equal(files.get('.wingfoil/workflows/built-in/w.yaml'),
      '# kept comment\nformat: 1\nname: w\nkind: sub\nversion: 7\n');
    assert.ok(files.has('.wingfoil/directives/built-in/d.md'));
    assert.ok(files.has('.wingfoil/memory/templates/built-in/note.md'));
    assert.ok(files.has('.wingfoil/workflows/built-in/delivery.yaml'));
  });

  const twice: [string, PackSpec][] = [
    ['directive id', { id: 'blueprint/y', directives: ['d'] }],
    ['workflow name', { id: 'blueprint/y', workflows: ['w'] }],
  ];
  for (const [what, other] of twice) {
    it(`fails on two packs shipping one ${what}`, () => {
      fails([BASE, KANBAN, { id: 'blueprint/x', directives: ['d'], workflows: ['w'] }, other],
        ['methodology/kanban', 'blueprint/x', 'blueprint/y'], /blueprint\/x.*blueprint\/y/);
    });
  }

  it('fails on two packs shipping one Memory template', () => {
    fails([BASE, KANBAN, NOTES, { id: 'blueprint/y', memoryTemplates: ['note'] }],
      ['methodology/kanban', 'governance/notes', 'blueprint/y'], /note/);
  });

  it('replaces base default slot workflow by the phase pack file, at its position', () => {
    const base = { ...BASE, workflows: ['sw-life-cycle', 'retrospective', 'inception'], extraFiles: {
      ...BASE.extraFiles, 'workflows/inception.yaml': 'format: 1\nname: inception\nkind: sub\n# base\n',
    } };
    const files = plan([base, KANBAN, { id: 'phase/inception/lean', workflows: ['inception'],
      extraFiles: { 'workflows/inception.yaml': 'format: 1\nname: inception\nkind: sub\n# lean\n' } }],
    ['methodology/kanban', 'phase/inception/lean']);
    assert.match(files.get('.wingfoil/workflows/built-in/inception.yaml') ?? '', /# lean/);
    assert.equal(files.get('.wingfoil/workflows.yaml'), [
      'format: 1', 'version: 1', 'include:',
      '  - workflows/built-in/sw-life-cycle.yaml', '  - workflows/built-in/retrospective.yaml',
      '  - workflows/built-in/delivery.yaml', '  - workflows/built-in/inception.yaml', '',
    ].join('\n'));
  });

  it('fails on a slot workflow whose kind is not sub', () => {
    fails([BASE, KANBAN, { id: 'phase/release/r', workflows: ['release'],
      extraFiles: { 'workflows/release.yaml': 'format: 1\nname: release\nkind: main\n' } }],
    ['methodology/kanban', 'phase/release/r'], /phase\/release\/r.*release.*kind.*sub/);
  });

  it('fails on a Memory template shipped by a pack that does not define its type', () => {
    fails([BASE, KANBAN, NOTES, { id: 'blueprint/y', memoryTemplates: ['other'] }],
      ['methodology/kanban', 'governance/notes', 'blueprint/y'], /blueprint\/y.*other/);
  });

  it('fails on a type whose template.file is not its built-in path, while its pack ships it', () => {
    const notes = { ...NOTES, extraFiles: { 'fragments/memory.yaml': 'format: 1\ntypes:\n  note:\n'
      + '    path: docs/{id}.md\n    id_pattern: "note-{n}"\n    template: { file: tpl/note.md }\n' } };
    fails([BASE, KANBAN, notes], ['methodology/kanban', 'governance/notes'], /note.*template\.file/);
  });

  it('fails on a built-in template.file that no pack ships (derived)', () => {
    fails([BASE, KANBAN, { ...NOTES, memoryTemplates: [] }], ['methodology/kanban', 'governance/notes'],
      /memory\/templates\/built-in\/note\.md/);
  });

  it('fails on a directive id equal to a WingFoil built-in', () => {
    fails([BASE, KANBAN, { id: 'blueprint/x', directives: ['security'] }],
      ['methodology/kanban', 'blueprint/x'], /blueprint\/x.*security.*built-in/);
  });

  it('fails on a composition without a dna, roles or memory fragment (derived)', () => {
    fails([{ ...BASE, fragments: ['dna', 'roles'] }, KANBAN], ['methodology/kanban'], /memory/);
  });
});

describe('output: formats and identifiers (spec-001 §5, §6.1)', () => {
  const broken: [string, PackSpec, RegExp][] = [
    ['a workflow without format', { id: 'blueprint/x', workflows: ['w'],
      extraFiles: { 'workflows/w.yaml': 'name: w\nkind: sub\n' } }, /workflows\/w\.yaml.*format/],
    ['a directive without format', { id: 'blueprint/x', directives: ['d'],
      extraFiles: { 'directives/d.md': '---\nid: d\n---\n' } }, /directives\/d\.md.*format/],
    ['a directive without frontmatter', { id: 'blueprint/x', directives: ['d'],
      extraFiles: { 'directives/d.md': '# d\n' } }, /directives\/d\.md/],
    ['a workflow in another format than its pack', { id: 'blueprint/x', workflows: ['w'],
      extraFiles: { 'workflows/w.yaml': 'format: 2\nname: w\nkind: sub\n' } }, /format 2.*workflow is 1/],
    ['a workflow named other than its stem', { id: 'blueprint/x', workflows: ['w'],
      extraFiles: { 'workflows/w.yaml': 'format: 1\nname: v\nkind: sub\n' } }, /workflows\/w\.yaml.*name/],
    ['a directive whose id is not its stem', { id: 'blueprint/x', directives: ['d'],
      extraFiles: { 'directives/d.md': '---\nid: e\nformat: 1\n---\n' } }, /directives\/d\.md.*id/],
  ];
  for (const [name, spec, pattern] of broken) {
    it(`fails on ${name}`, () => {
      fails([BASE, KANBAN, spec], ['methodology/kanban', 'blueprint/x'], pattern);
    });
  }

  it('fails on a Memory template without type, or with another type', () => {
    for (const text of ['---\nformat: 1\n---\n', '---\ntype: other\nformat: 1\n---\n']) {
      fails([BASE, KANBAN, { ...NOTES, extraFiles: { ...NOTES.extraFiles, 'memory-templates/note.md': text } }],
        ['methodology/kanban', 'governance/notes'], /memory-templates\/note\.md.*type/);
    }
  });

  it('fails on two files of one kind in one pack in different formats', () => {
    fails([BASE, KANBAN, { id: 'blueprint/x', directives: ['a', 'b'],
      extraFiles: { 'directives/b.md': '---\nid: b\nformat: 2\n---\n' } }],
    ['methodology/kanban', 'blueprint/x'], /directives\/b\.md.*format 2/);
  });

  it('accepts two packs shipping one kind in two formats', () => {
    plan([BASE, KANBAN, { id: 'blueprint/x', directives: ['a'] }, { id: 'blueprint/y', directives: ['b'],
      manifest: { formats: { directive: 2 } }, extraFiles: { 'directives/b.md': '---\nid: b\nformat: 2\n---\n' } }],
    ['methodology/kanban', 'blueprint/x', 'blueprint/y']);
  });
});

describe('output: workflows.yaml (spec-001 §7.7)', () => {
  it('lists workflows in composition order, then each pack contents order', () => {
    const files = plan([BASE, KANBAN, { id: 'blueprint/b', workflows: ['z', 'y'] },
      { id: 'blueprint/a', workflows: ['x', 'w'] }], ['methodology/kanban', 'blueprint/b', 'blueprint/a']);
    const include = (files.get('.wingfoil/workflows.yaml') ?? '').split('\n')
      .filter((line) => line.startsWith('  - ')).map((line) => line.slice('  - workflows/built-in/'.length));
    assert.deepEqual(include, ['sw-life-cycle.yaml', 'retrospective.yaml', 'delivery.yaml', 'x.yaml',
      'w.yaml', 'z.yaml', 'y.yaml']);
  });

  it('writes format and version first in every generated file', () => {
    const files = plan([BASE, KANBAN], ['methodology/kanban']);
    for (const name of ['dna', 'roles', 'memory', 'workflows']) {
      assert.match(files.get(`.wingfoil/${name}.yaml`) ?? '', /^format: 1\nversion: 1\n/, name);
    }
  });
});

describe('output: bytes (spec-001 §17)', () => {
  it('normalizes line endings, the byte order mark and the final newline', () => {
    assert.equal(normalizeText('\uFEFFa\r\nb'), 'a\nb\n');
    assert.equal(normalizeText('a\n\n'), 'a\n\n');
    assert.equal(normalizeText(''), '\n');
  });

  it('writes a CRLF asset with LF', () => {
    const files = plan([BASE, KANBAN, { id: 'blueprint/x', directives: ['d'],
      extraFiles: { 'directives/d.md': '---\r\nid: d\r\nformat: 1\r\n---\r\ntext' } }],
    ['methodology/kanban', 'blueprint/x']);
    assert.equal(files.get('.wingfoil/directives/built-in/d.md'), '---\nid: d\nformat: 1\n---\ntext\n');
  });
});
