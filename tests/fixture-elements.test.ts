// The fixture-element checks (task-094, spec-003 §11 [E]): each check on a fixture this test
// writes, with a type, field and list of its own; no published pack is read.
import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

import {
  allowedValueProblems, backReferenceProblems, readElements, referenceProblems,
  refusedItemProblems, requiredFieldProblems, stateFieldProblems,
} from './support/fixture-elements';
import type { FixtureElement } from './support/fixture-elements';

const MEMORY = `format: 1
version: 1
defaults:
  states:
    sequence: [draft, pending, open, closed]
types:
  note:
    path: docs/notes/{id}.md
    id_pattern: "note-{n}-{slug}"
    template:
      file: memory/templates/note.md
      frontmatter:
        required: [id, type, title, status, colour, source]
        not_applicable_allowed: [source]
        lists: [links]
        exempt: { colour: [note-009-old] }
  record:
    path: docs/notes/records/{scope}/{id}.md
    template:
      file: memory/templates/record.md
      frontmatter:
        required: [id, type, title, status]
  plan:
    path: docs/plan-{id}.md
    template:
      file: memory/templates/plan.md
      frontmatter:
        required: [id, type, title, status]
`;

const TEMPLATES: Record<string, string> = {
  '.wingfoil/memory/templates/note.md': '---\nid: ""\ntype: note\ntitle: ""\nstatus: draft\n---\n',
  '.wingfoil/memory/templates/record.md': '---\nid: ""\ntype: record\ntitle: ""\nstatus: draft\n'
    + 'reported_by: []\n---\n',
  '.wingfoil/memory/templates/plan.md': '---\nid: ""\ntype: plan\ntitle: ""\nstatus: draft\n---\n',
};

/** A Memory element's text: its frontmatter fields, in order, then a body. */
function element(fields: Record<string, unknown>, body = 'Body.\n'): string {
  const lines = Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  return `---\n${lines.join('\n')}\n---\n\n${body}`;
}

const NOTE = (id: string, extra: Record<string, unknown> = {}, body?: string): string => element({
  id, type: 'note', title: `Note ${id}`, status: 'open', colour: 'red', source: 'a reader',
  ...extra }, body);

const RECORD = (id: string, extra: Record<string, unknown> = {}, body?: string): string =>
  element({ id, type: 'record', title: `Record ${id}`, status: 'open', ...extra }, body);

/** A composed-project layout with the given files, in a temporary directory. */
function withProject(files: Record<string, string>, body: (project: string) => void,
  git = false): void {
  const dir = mkdtempSync(join(tmpdir(), 'fixture-elements-'));
  try {
    const all = { '.wingfoil/memory.yaml': MEMORY, ...TEMPLATES, ...files };
    for (const [path, text] of Object.entries(all)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true });
      writeFileSync(join(dir, path), text);
    }
    if (git) {
      const run = (...args: string[]): void => {
        execFileSync('git', ['-C', dir, ...args], { stdio: 'ignore' });
      };
      run('init', '-q');
      run('-c', 'user.name=Tester', '-c', 'user.email=tester@notes.example', 'add', '-A');
      run('-c', 'user.name=Tester', '-c', 'user.email=tester@notes.example', 'commit', '-q',
        '-m', 'fixture');
    }
    body(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function elementsOf(project: string): FixtureElement[] {
  const read = readElements(project);
  assert.deepEqual(read.problems, []);
  return read.elements;
}

describe('fixture elements: readElements (task-094 criterion 1)', () => {
  it('finds every element by its type\'s static prefix, nested once, recursively', () => {
    withProject({
      'docs/notes/note-001-a.md': NOTE('note-001-a'),
      'docs/notes/records/x/record-001.md': RECORD('record-001'),
      'docs/plan-p1.md': element({ id: 'p1', type: 'plan', title: 'P', status: 'open' }),
      'docs/notes/README.md': '# Notes\n',
      'docs/notes/untyped.md': '---\ntitle: x\n---\n',
      'elsewhere/note-002.md': NOTE('note-002'),
    }, (project) => {
      const read = readElements(project);
      assert.deepEqual(read.problems, []);
      assert.deepEqual(read.elements.map((each) => `${each.type} ${each.id} ${each.file}`), [
        'note note-001-a docs/notes/note-001-a.md',
        'record record-001 docs/notes/records/x/record-001.md',
        'plan p1 docs/plan-p1.md',
      ]);
      const note = read.elements.find((each) => each.id === 'note-001-a');
      assert.equal(note?.status, 'open');
      assert.equal(note?.fields['colour'], 'red');
      assert.equal(note?.body.trim(), 'Body.');
    });
  });

  it('reports a frontmatter that does not parse and a type no one declares', () => {
    withProject({
      'docs/notes/bad.md': '---\nid: [x\n---\n',
      'docs/notes/odd.md': element({ id: 'o', type: 'oddity', title: 'O', status: 'open' }),
    }, (project) => {
      const { problems } = readElements(project);
      assert.equal(problems.length, 2, problems.join('\n'));
      assert.match(problems[0] ?? '', /^docs\/notes\/bad\.md: /);
      assert.match(problems[1] ?? '', /^docs\/notes\/odd\.md: .*oddity/);
    });
  });
});

describe('fixture elements: required fields (criterion 2, FA-3)', () => {
  it('passes complete elements, drafts, exempt ids, a not-applicable value with a reason', () => {
    withProject({
      'docs/notes/note-001.md': NOTE('note-001'),
      'docs/notes/note-002.md': NOTE('note-002', { source: 'N/A — no source' }),
      'docs/notes/note-003.md': element({ id: 'note-003', type: 'note', title: 'T',
        status: 'draft' }),
      'docs/notes/note-009-old.md': element({ id: 'note-009-old', type: 'note', title: 'T',
        status: 'open', source: 'x' }),
      'docs/notes/note-004.md': NOTE('note-004', { source: 'n/a—x' }),
    }, (project) => {
      assert.deepEqual(requiredFieldProblems(project, elementsOf(project)), []);
    });
  });

  it('reports a missing, empty, listed or not-applicable value that may not stand', () => {
    withProject({
      'docs/notes/a.md': element({ id: 'a', type: 'note', title: 'T', status: 'open',
        source: 'x' }),
      'docs/notes/b.md': NOTE('b', { colour: '  ' }),
      'docs/notes/c.md': NOTE('c', { colour: ['red'] }),
      'docs/notes/d.md': NOTE('d', { colour: 'n/a — none' }),
      'docs/notes/e.md': NOTE('e', { source: 'n/a' }),
      'docs/notes/f.md': NOTE('f', { source: 'n/a - dash' }),
      'docs/notes/g.md': element({ id: 'g', type: 'note', status: 'pending', colour: 'red',
        source: 'x' }),
    }, (project) => {
      const problems = requiredFieldProblems(project, elementsOf(project));
      assert.deepEqual(problems.map((line) => line.split(':')[0]), ['docs/notes/a.md',
        'docs/notes/b.md', 'docs/notes/c.md', 'docs/notes/d.md', 'docs/notes/e.md',
        'docs/notes/f.md', 'docs/notes/g.md'], problems.join('\n'));
      assert.match(problems[0] ?? '', /colour/);
      assert.match(problems[6] ?? '', /title/);
    });
  });
});

describe('fixture elements: allowed values (criterion 3, FA-4)', () => {
  const allowed = [{ type: 'note', field: 'colour', allowed: ['red', 'blue'] },
    { type: 'note', field: 'links', allowed: ['x', 'y'] }];

  it('passes values among the list, absent fields and an accepted not-applicable value', () => {
    withProject({
      'docs/notes/a.md': NOTE('a', { colour: 'blue', links: ['x', 'y'] }),
      'docs/notes/b.md': NOTE('b'),
    }, (project) => {
      assert.deepEqual(allowedValueProblems(project, elementsOf(project), allowed), []);
    });
  });

  it('reports a value, or a list item, outside the list', () => {
    withProject({
      'docs/notes/a.md': NOTE('a', { colour: 'green' }),
      'docs/notes/b.md': NOTE('b', { links: ['x', 'z'] }),
    }, (project) => {
      const problems = allowedValueProblems(project, elementsOf(project), allowed);
      assert.equal(problems.length, 2, problems.join('\n'));
      assert.match(problems[0] ?? '', /^docs\/notes\/a\.md: .*colour.*green/);
      assert.match(problems[1] ?? '', /^docs\/notes\/b\.md: .*links.*z/);
    });
  });
});

describe('fixture elements: references (criterion 4, FA-5)', () => {
  const context = { workflows: { intake: ['capture', 'triage'] }, versions: ['1.2.0'] };

  it('resolves each kind, and some or every candidate as the binding asks', () => {
    withProject({
      'docs/notes/a.md': NOTE('a', { source: 'b, intake.triage, 1.2.0' }),
      'docs/notes/b.md': NOTE('b', { source: 'docs/notes/a.md' }),
      'docs/notes/c.md': NOTE('c', { source: 'nothing, intake' }),
      'docs/notes/d.md': NOTE('d', { source: 'n/a — none' }),
      'README.md': '# R\n',
      'docs/notes/e.md': NOTE('e', { source: 'a', links: ['README.md', 'a'] }),
    }, (project) => {
      const elements = elementsOf(project);
      assert.deepEqual(referenceProblems(project, elements.filter((each) => each.id !== 'c'), [
        { type: 'note', field: 'source', kinds: ['element', 'workflow-phase', 'version'],
          split: true, mode: 'every' },
        { type: 'note', field: 'links', kinds: ['element', 'file'], mode: 'every' },
      ], context), []);
      assert.deepEqual(referenceProblems(project, elements, [{ type: 'note', field: 'source',
        kinds: ['element', 'workflow-phase', 'version'], split: true, mode: 'some' }], context),
      []);
    });
  });

  it('reports what does not resolve: an unknown id, phase or version, a file as an element', () => {
    withProject({
      'docs/notes/a.md': NOTE('a', { source: 'nobody' }),
      'docs/notes/b.md': NOTE('b', { source: 'intake.review' }),
      'docs/notes/c.md': NOTE('c', { source: '9.9.9' }),
      'README.md': '# R\n',
      'docs/notes/d.md': NOTE('d', { source: 'README.md' }),
      'docs/notes/e.md': NOTE('e', { source: 'a, nobody' }),
      'docs/notes/f.md': NOTE('f', { source: 'n/a' }),
    }, (project) => {
      const problems = referenceProblems(project, elementsOf(project), [{ type: 'note',
        field: 'source', kinds: ['element', 'workflow-phase', 'version'], split: true,
        mode: 'every' }], context);
      assert.deepEqual(problems.map((line) => line.split(':')[0]), ['docs/notes/a.md',
        'docs/notes/b.md', 'docs/notes/c.md', 'docs/notes/d.md', 'docs/notes/e.md',
        'docs/notes/f.md'], problems.join('\n'));
    });
  });

  it('resolves a commit by its sha only, never a ref name', () => {
    withProject({ 'docs/notes/a.md': NOTE('a') }, (project) => {
      const sha = execFileSync('git', ['-C', project, 'rev-parse', 'HEAD'], { encoding: 'utf8' })
        .trim();
      const write = (source: string): void => {
        writeFileSync(join(project, 'docs/notes/a.md'), NOTE('a', { source }));
      };
      const binding = [{ type: 'note', field: 'source', kinds: ['commit' as const],
        mode: 'every' as const }];
      write(sha.slice(0, 10));
      assert.deepEqual(referenceProblems(project, elementsOf(project), binding), []);
      for (const source of ['HEAD', 'main', '0000000000']) {
        write(source);
        assert.equal(referenceProblems(project, elementsOf(project), binding).length, 1, source);
      }
    }, true);
  });
});

describe('fixture elements: back-references (criterion 5, FA-6)', () => {
  const binding = [{ type: 'note', field: 'links', through: 'reported_by' }];

  it('passes a target citing back through the field its template declares, or its body', () => {
    withProject({
      'docs/notes/a.md': NOTE('a', { links: ['record-1', 'docs/plan-p.md', 'out/note.txt'] }),
      'docs/notes/records/x/record-1.md': RECORD('record-1', { reported_by: ['a'] }),
      'docs/plan-p.md': element({ id: 'p', type: 'plan', title: 'P', status: 'open' },
        'Answers docs/notes/a.md.\n'),
      'out/note.txt': 'Cites a.\n',
    }, (project) => {
      assert.deepEqual(backReferenceProblems(project, elementsOf(project), binding), []);
    });
  });

  it('reports a missing target, and a target that does not cite back where it should', () => {
    withProject({
      'docs/notes/a.md': NOTE('a', { links: ['nothing'] }),
      'docs/notes/b.md': NOTE('b', { links: ['record-1'] }),
      // The template declares reported_by: the body alone does not count.
      'docs/notes/records/x/record-1.md': RECORD('record-1', {}, 'Cites b.\n'),
      'docs/notes/c.md': NOTE('c', { links: ['p'] }),
      'docs/plan-p.md': element({ id: 'p', type: 'plan', title: 'P', status: 'open' }),
    }, (project) => {
      const problems = backReferenceProblems(project, elementsOf(project), binding);
      assert.deepEqual(problems.map((line) => line.split(':')[0]), ['docs/notes/a.md',
        'docs/notes/b.md', 'docs/notes/c.md'], problems.join('\n'));
    });
  });
});

describe('fixture elements: fields per state (criterion 6)', () => {
  it('reports an element of the state with a field not filled; other states pass', () => {
    withProject({
      'docs/notes/a.md': NOTE('a', { status: 'closed', links: ['x'], outcome: 'done' }),
      'docs/notes/b.md': NOTE('b', { status: 'closed', outcome: '' }),
      'docs/notes/c.md': NOTE('c', { status: 'open' }),
    }, (project) => {
      const problems = stateFieldProblems(project, elementsOf(project),
        [{ type: 'note', status: 'closed', fields: ['outcome', 'links'] }]);
      assert.equal(problems.length, 1, problems.join('\n'));
      assert.match(problems[0] ?? '', /^docs\/notes\/b\.md: .*outcome.*links/);
    });
  });
});

describe('fixture elements: a refused item (criterion 7)', () => {
  it('reports a preset or an example whose value holds the item', () => {
    const preset = (id: string, value: string): string =>
      `format: 1\nid: ${id}\ntitle: "T"\ndescription: "D."\npacks: []\n`
      + `parameters:\n  outcomes: "${value}"\n`;
    withProject({
      'presets/fine.yaml': preset('fine', 'task, declined'),
      'presets/bad.yaml': preset('bad', 'task, bug'),
      'tests/fixtures/examples/p/one/example.yaml': preset('one', ' bug '),
      'tests/fixtures/examples/p/two/example.yaml': preset('two', 'debug'),
    }, (tree) => {
      assert.deepEqual(refusedItemProblems(tree, [{ parameter: 'outcomes', item: 'bug' }]), [
        'presets/bad.yaml: parameter outcomes holds bug, which is refused',
        'tests/fixtures/examples/p/one/example.yaml: parameter outcomes holds bug, which is '
          + 'refused',
      ]);
    });
  });
});

// The build review's cases (task-094).
describe('fixture elements: the build review\'s cases', () => {
  it('readElements skips a nested .git directory and reports a symbolic link', () => {
    withProject({
      'docs/notes/a.md': NOTE('a'),
      'docs/notes/sub/.git/HEAD': 'ref: x\n',
      'docs/notes/sub/b.md': NOTE('b'),
    }, (project) => {
      symlinkSync(join(project, 'docs/notes/a.md'), join(project, 'docs/notes/link.md'));
      const read = readElements(project);
      assert.deepEqual(read.elements.map((each) => each.id), ['a']);
      assert.deepEqual(read.problems.map((line) => line.split(':')[0]), ['docs/notes/link.md']);
    });
  });

  it('exempt never exempts title, and only a string id', () => {
    withProject({
      '.wingfoil/memory.yaml': MEMORY.replace('exempt: { colour: [note-009-old] }',
        'exempt: { colour: [note-009-old, "7"], title: [note-010] }'),
      'docs/notes/note-010.md': element({ id: 'note-010', type: 'note', status: 'open',
        colour: 'red', source: 'x' }),
      'docs/notes/seven.md': element({ id: 7, type: 'note', title: 'T', status: 'open',
        source: 'x' }),
    }, (project) => {
      const problems = requiredFieldProblems(project, elementsOf(project));
      assert.deepEqual(problems.map((line) => line.split(':')[0]),
        ['docs/notes/note-010.md', 'docs/notes/seven.md'], problems.join('\n'));
    });
  });

  it('allowed values: an accepted not-applicable value passes, a Date is a value', () => {
    withProject({
      'docs/notes/a.md': NOTE('a', { source: 'n/a — none' }),
      'docs/notes/b.md': NOTE('b', { source: 'n/a' }),
    }, (project) => {
      const problems = allowedValueProblems(project, elementsOf(project),
        [{ type: 'note', field: 'source', allowed: ['reader'] }]);
      assert.deepEqual(problems.map((line) => line.split(':')[0]), ['docs/notes/b.md'],
        problems.join('\n'));
    });
  });

  it('references: some fails when none resolves; phases and files are strict', () => {
    withProject({
      'docs/notes/a.md': NOTE('a', { source: 'nothing, nobody' }),
      'docs/notes/b.md': NOTE('b', { source: 'intake.triage.extra' }),
      'docs/notes/c.md': NOTE('c', { source: 'constructor' }),
      'docs/notes/d.md': NOTE('d', { source: '../outside.md' }),
      'docs/notes/e.md': NOTE('e', { source: '/etc/hostname' }),
    }, (project) => {
      writeFileSync(join(project, '..', 'outside.md'), 'x\n');
      try {
        const problems = referenceProblems(project, elementsOf(project), [{ type: 'note',
          field: 'source', kinds: ['element', 'file', 'workflow-phase'], split: true,
          mode: 'some' }], { workflows: { intake: ['capture', 'triage'] } });
        assert.deepEqual(problems.map((line) => line.split(':')[0]), ['docs/notes/a.md',
          'docs/notes/b.md', 'docs/notes/c.md', 'docs/notes/d.md', 'docs/notes/e.md'],
        problems.join('\n'));
      } finally {
        rmSync(join(project, '..', 'outside.md'), { force: true });
      }
    });
  });

  it('back-references: an id-less element, a file that does not cite back, a word boundary', () => {
    withProject({
      'docs/notes/a.md': element({ type: 'note', title: 'T', status: 'open', links: ['p'] }),
      'docs/notes/b.md': NOTE('b', { links: ['out/note.txt'] }),
      'docs/notes/fb-1.md': NOTE('fb-1', { links: ['q'] }),
      'docs/plan-p.md': element({ id: 'p', type: 'plan', title: 'P', status: 'open' },
        'Answers docs/notes/x.md.\n'),
      'docs/plan-q.md': element({ id: 'q', type: 'plan', title: 'Q', status: 'open' },
        'Answers fb-10.\n'),
      'out/note.txt': 'Cites nothing.\n',
    }, (project) => {
      const problems = backReferenceProblems(project, elementsOf(project),
        [{ type: 'note', field: 'links', through: 'reported_by' }]);
      assert.deepEqual(problems.map((line) => line.split(':')[0]), ['docs/notes/a.md',
        'docs/notes/b.md', 'docs/notes/fb-1.md'], problems.join('\n'));
    });
  });

  it('fields per state: a not-applicable value that may not stand is not filled', () => {
    withProject({
      'docs/notes/a.md': NOTE('a', { status: 'closed', colour: 'n/a' }),
      'docs/notes/b.md': NOTE('b', { status: 'closed', source: 'n/a — none' }),
    }, (project) => {
      const problems = stateFieldProblems(project, elementsOf(project),
        [{ type: 'note', status: 'closed', fields: ['colour', 'source'] }]);
      assert.deepEqual(problems.map((line) => line.split(':')[0]), ['docs/notes/a.md'],
        problems.join('\n'));
    });
  });

  it('a refused item: a non-string value, and a tree with no presets or examples', () => {
    withProject({ 'presets/n.yaml': 'format: 1\nid: n\nparameters:\n  outcomes: 3\n' },
      (tree) => {
        assert.deepEqual(refusedItemProblems(tree, [{ parameter: 'outcomes', item: 'bug' }]), []);
      });
    withProject({}, (tree) => {
      assert.deepEqual(refusedItemProblems(tree, [{ parameter: 'outcomes', item: 'bug' }]), []);
    });
  });
});
