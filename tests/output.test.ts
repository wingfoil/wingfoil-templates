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

/** A workflow file's text. */
function workflow(name: string, kind = 'sub', extra = ''): string {
  return `format: 1\nname: ${name}\nkind: ${kind}\n${extra}`;
}

/** A pack shipping exactly the given files, listed in its contents. */
/** A directive file's text. */
function directive(id: string, format = 1): string {
  return `---\nid: ${id}\nformat: ${format}\n---\n`;
}

function shipping(
  id: string,
  lists: Partial<PackSpec>,
  files: Record<string, string> = {},
): PackSpec {
  return { id, ...lists, extraFiles: files };
}

/** The memory fragment defining type `note`, with the given template file. */
function noteType(templateFile: string): string {
  return 'format: 1\ntypes:\n  note:\n    path: docs/{id}.md\n    id_pattern: "note-{n}"\n'
    + `    template: { file: ${templateFile} }\n`;
}

/** A pack defining Memory type `note` and shipping its template. */
const NOTES: PackSpec = shipping('governance/notes',
  { fragments: ['memory'], memoryTemplates: ['note'] },
  { 'fragments/memory.yaml': noteType('memory/templates/built-in/note.md') });
const WITH_NOTES = ['methodology/kanban', 'governance/notes'];
const WITH_X = ['methodology/kanban', 'blueprint/x'];

describe('output: assets (spec-001 §7.6)', () => {
  it('writes each asset to its built-in folder, copied whole', () => {
    const text = `# kept comment\n${workflow('w', 'sub', 'version: 7\n')}`;
    const files = plan([BASE, KANBAN, NOTES,
      shipping('blueprint/x', { directives: ['d'], workflows: ['w'] },
        { 'workflows/w.yaml': text })],
    [...WITH_NOTES, 'blueprint/x']);
    assert.equal(files.get('.wingfoil/workflows/built-in/w.yaml'), text);
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
        [...WITH_X, 'blueprint/y'], /blueprint\/x.*blueprint\/y/);
    });
  }

  it('fails on two packs shipping one Memory template', () => {
    fails([BASE, KANBAN, NOTES, { id: 'blueprint/y', memoryTemplates: ['note'] }],
      [...WITH_NOTES, 'blueprint/y'], /note/);
  });

  it('replaces base default slot workflow by the phase pack file, at its position', () => {
    const base: PackSpec = {
      ...BASE,
      workflows: ['sw-life-cycle', 'retrospective', 'inception'],
      extraFiles: {
        ...BASE.extraFiles,
        'workflows/inception.yaml': workflow('inception', 'sub', '# base\n'),
      },
    };
    const lean = shipping('phase/inception/lean', { workflows: ['inception'] },
      { 'workflows/inception.yaml': workflow('inception', 'sub', '# lean\n') });
    const files = plan([base, KANBAN, lean], ['methodology/kanban', 'phase/inception/lean']);
    assert.match(files.get('.wingfoil/workflows/built-in/inception.yaml') ?? '', /# lean/);
    assert.equal(files.get('.wingfoil/workflows.yaml'), [
      'format: 1', 'version: 1', 'include:',
      '  - workflows/built-in/sw-life-cycle.yaml', '  - workflows/built-in/retrospective.yaml',
      '  - workflows/built-in/delivery.yaml', '  - workflows/built-in/inception.yaml', '',
    ].join('\n'));
  });

  it('fails on a slot workflow whose kind is not sub', () => {
    fails([BASE, KANBAN, shipping('phase/release/r', { workflows: ['release'] },
      { 'workflows/release.yaml': workflow('release', 'main') })],
    ['methodology/kanban', 'phase/release/r'], /phase\/release\/r.*release.*kind.*sub/);
  });

  it('fails on a Memory template shipped by a pack that does not define its type', () => {
    fails([BASE, KANBAN, NOTES, { id: 'blueprint/y', memoryTemplates: ['other'] }],
      [...WITH_NOTES, 'blueprint/y'], /blueprint\/y.*other/);
  });

  it('fails on a template.file other than the built-in path, while the pack ships it', () => {
    const notes = { ...NOTES, extraFiles: { 'fragments/memory.yaml': noteType('tpl/note.md') } };
    fails([BASE, KANBAN, notes], WITH_NOTES, /note.*template\.file/);
  });

  it('fails on a built-in template.file that no pack ships (derived)', () => {
    fails([BASE, KANBAN, { ...NOTES, memoryTemplates: [] }], WITH_NOTES,
      /memory\/templates\/built-in\/note\.md/);
  });

  it('fails on a directive id equal to a WingFoil built-in', () => {
    fails([BASE, KANBAN, { id: 'blueprint/x', directives: ['security'] }], WITH_X,
      /blueprint\/x.*security.*built-in/);
  });

  it('fails on a composition without a dna, roles or memory fragment (derived)', () => {
    const files = { ...BASE.extraFiles };
    delete files['fragments/memory.yaml'];
    const base = { ...BASE, fragments: ['dna', 'roles'], extraFiles: files };
    fails([base, KANBAN], ['methodology/kanban'], /ships a memory fragment/);
  });
});

describe('output: formats and identifiers (spec-001 §5, §6.1)', () => {
  const broken: [string, PackSpec, RegExp][] = [
    ['a workflow without format', shipping('blueprint/x', { workflows: ['w'] },
      { 'workflows/w.yaml': 'name: w\nkind: sub\n' }), /workflows\/w\.yaml.*format/],
    ['a directive without format', shipping('blueprint/x', { directives: ['d'] },
      { 'directives/d.md': '---\nid: d\n---\n' }), /directives\/d\.md.*format/],
    ['a directive without frontmatter', shipping('blueprint/x', { directives: ['d'] },
      { 'directives/d.md': '# d\n' }), /directives\/d\.md/],
    ['a workflow in another format than its pack', shipping('blueprint/x', { workflows: ['w'] },
      { 'workflows/w.yaml': 'format: 2\nname: w\nkind: sub\n' }), /format 2.*workflow is 1/],
    ['a workflow named other than its stem', shipping('blueprint/x', { workflows: ['w'] },
      { 'workflows/w.yaml': workflow('v') }), /workflows\/w\.yaml.*name/],
    ['a directive whose id is not its stem', shipping('blueprint/x', { directives: ['d'] },
      { 'directives/d.md': '---\nid: e\nformat: 1\n---\n' }), /directives\/d\.md.*id/],
  ];
  for (const [name, spec, pattern] of broken) {
    it(`fails on ${name}`, () => fails([BASE, KANBAN, spec], WITH_X, pattern));
  }

  it('fails on a Memory template without type, or with another type', () => {
    for (const text of ['---\nformat: 1\n---\n', '---\ntype: other\nformat: 1\n---\n']) {
      const files = { ...NOTES.extraFiles, 'memory-templates/note.md': text };
      const notes = { ...NOTES, extraFiles: files };
      fails([BASE, KANBAN, notes], WITH_NOTES, /memory-templates\/note\.md.*type/);
    }
  });

  it('fails on two files of one kind in one pack in different formats', () => {
    fails([BASE, KANBAN, shipping('blueprint/x', { directives: ['a', 'b'] },
      { 'directives/a.md': directive('a'), 'directives/b.md': directive('b', 2) })],
    WITH_X, /directives\/b\.md.*format 2/);
  });

  it('accepts two packs shipping one kind in two formats', () => {
    const second: PackSpec = {
      ...shipping('blueprint/y', { directives: ['b'] }, { 'directives/b.md': directive('b', 2) }),
      manifest: { formats: { directive: 2 } },
    };
    plan([BASE, KANBAN, { id: 'blueprint/x', directives: ['a'] }, second],
      [...WITH_X, 'blueprint/y']);
  });
});

describe('output: workflows.yaml (spec-001 §7.7)', () => {
  it('lists workflows in composition order, then each pack contents order', () => {
    const files = plan([BASE, KANBAN, { id: 'blueprint/b', workflows: ['z', 'y'] },
      { id: 'blueprint/a', workflows: ['x', 'w'] }],
    ['methodology/kanban', 'blueprint/b', 'blueprint/a']);
    const prefix = '  - workflows/built-in/';
    const include = (files.get('.wingfoil/workflows.yaml') ?? '').split('\n')
      .filter((line) => line.startsWith(prefix)).map((line) => line.slice(prefix.length));
    assert.deepEqual(include, ['sw-life-cycle.yaml', 'retrospective.yaml', 'delivery.yaml',
      'x.yaml', 'w.yaml', 'z.yaml', 'y.yaml']);
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
    assert.equal(normalizeText('﻿a\r\nb'), 'a\nb\n');
    assert.equal(normalizeText('a\n\n'), 'a\n\n');
    assert.equal(normalizeText(''), '\n');
  });

  it('writes an asset with a byte order mark without it', () => {
    const files = plan([BASE, KANBAN, shipping('blueprint/x', { directives: ['d'] },
      { 'directives/d.md': `\uFEFF${directive('d')}text\n` })], WITH_X);
    assert.equal(files.get('.wingfoil/directives/built-in/d.md'), `${directive('d')}text\n`);
  });

  it('writes a CRLF asset with LF', () => {
    const files = plan([BASE, KANBAN, shipping('blueprint/x', { directives: ['d'] },
      { 'directives/d.md': '---\r\nid: d\r\nformat: 1\r\n---\r\ntext' })], WITH_X);
    assert.equal(files.get('.wingfoil/directives/built-in/d.md'), `${directive('d')}text\n`);
  });
});
