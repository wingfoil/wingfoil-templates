import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { parse } from 'yaml';

import { CompositionError } from '../src/composition-error';
import { mergeMemory } from '../src/memory-merge';

const BASE = `
defaults:
  states:
    sequence: [draft, pending, approved]
    gates:
      pending: { reject: draft }
types:
  task:
    path: docs/memory/task/{id}.md
    id_pattern: "task-{n}-{slug}"
    template: { file: memory/templates/built-in/task.md }
    states:
      sequence: [draft, pending, backlog, in-progress, in-review, approved, done]
      gates:
        pending: { reject: draft }
        in-review: { reject: in-progress }
  adr:
    path: docs/memory/adr/{id}.md
    id_pattern: "adr-{n}-{slug}"
    template: { file: memory/templates/built-in/adr.md }
  bug:
    path: docs/memory/bug/{id}.md
    id_pattern: "bug-{n}-{slug}"
    template:
      file: memory/templates/built-in/bug.md
      frontmatter: { required: [id, severity] }
`;

type Doc = Record<string, unknown>;

function compose(...fragments: [string, string][]): Doc {
  const all: [string, string][] = [['base', BASE], ...fragments];
  return mergeMemory(all.map(([pack, text]) => ({ pack, data: parse(text) as Doc })), 'base');
}

function states(doc: Doc, type: string): unknown {
  return ((doc['types'] as Record<string, Doc>)[type] ?? {})['states'];
}

function defaults(doc: Doc): unknown {
  return (doc['defaults'] as Doc)['states'];
}

/** A fragment tightening task with one gate line. */
function taskGate(gate: string): [string, string] {
  return ['stage/x', `types:\n  task:\n    states:\n      gates:\n        ${gate}\n`];
}

const ARCHIVED: [string, string] = ['stage/x',
  'defaults:\n  states:\n    sequence: [draft, pending, approved, archived]\n'];

function fails(pattern: RegExp, ...fragments: [string, string][]): void {
  assert.throws(() => compose(...fragments), (error: unknown) => {
    assert.ok(error instanceof CompositionError, String(error));
    assert.match(error.message, pattern);
    return true;
  });
}

const AGENT_FIRST: [string, string] = ['team-mode/agent-first', `
types:
  task:
    states:
      sequence: [draft, pending, backlog, ready, in-progress, in-review, approved, done]
      gates:
        ready: { reject: backlog }
`];

const PRODUCTION: [string, string] = ['stage/production', `
types:
  task:
    states:
      sequence: [draft, pending, backlog, in-progress, in-review, qa, approved, done]
`];

describe('memory: the spec-001 §7.5 examples', () => {
  it('merges two overlays that do not know each other', () => {
    assert.deepEqual(states(compose(AGENT_FIRST, PRODUCTION), 'task'), {
      sequence: ['draft', 'pending', 'backlog', 'ready', 'in-progress', 'in-review', 'qa',
        'approved', 'done'],
      gates: {
        pending: { reject: 'draft' }, 'in-review': { reject: 'in-progress' },
        ready: { reject: 'backlog' },
      },
    });
  });

  it('places the later pack after the earlier one in the same gap (the counterfactual)', () => {
    const doc = compose(AGENT_FIRST, ['stage/production', `
types:
  task:
    states:
      sequence: [draft, pending, backlog, triage, in-progress, in-review, approved, done]
`]);
    assert.deepEqual((states(doc, 'task') as Doc)['sequence'], ['draft', 'pending', 'backlog',
      'ready', 'triage', 'in-progress', 'in-review', 'approved', 'done']);
  });

  it('reaches types that derive from defaults, detached or not', () => {
    const doc = compose(['team-mode/agent-first', `
types:
  adr:
    states:
      sequence: [draft, pending, ai-review, approved]
`], ['stage/production', `
defaults:
  states:
    sequence: [draft, pending, approved, archived]
`]);
    assert.deepEqual((states(doc, 'adr') as Doc)['sequence'],
      ['draft', 'pending', 'ai-review', 'approved', 'archived']);
    assert.deepEqual((defaults(doc) as Doc)['sequence'],
      ['draft', 'pending', 'approved', 'archived']);
    assert.equal(states(doc, 'bug'), undefined, 'bug still follows defaults');
  });

  const failing: [string, RegExp, string][] = [
    ['a sequence dropping in-review', /task.*stage\/x/, `
types:
  task:
    states:
      sequence: [draft, pending, backlog, in-progress, approved, done]
`],
    ['a swap of two existing states', /task.*stage\/x/, `
types:
  task:
    states:
      sequence: [draft, pending, in-progress, backlog, in-review, approved, done]
`],
    ['a changed reject target', /task.*stage\/x.*in-review/, `
types:
  task:
    states:
      gates:
        in-review: { reject: backlog }
`],
    ['a redefined path', /task.*stage\/x.*path/, `
types:
  task:
    path: other/{id}.md
`],
    ['a redefined id_pattern', /task.*stage\/x.*id_pattern/, `
types:
  task:
    id_pattern: "t-{n}"
`],
    ['a redefined template file', /task.*stage\/x.*template\.file/, `
types:
  task:
    template: { file: memory/templates/built-in/other.md }
`],
    ['a states that replaces the machine', /task.*stage\/x/, `
types:
  task:
    states:
      sequence: [open, closed]
`],
  ];
  for (const [name, pattern, text] of failing) {
    it(`fails on ${name}`, () => fails(pattern, ['stage/x', text]));
  }

  it('keeps a gate that a later fragment leaves out', () => {
    const doc = compose(['stage/x', `
types:
  task:
    states:
      gates:
        done: { reject: approved }
`]);
    assert.deepEqual(Object.keys((states(doc, 'task') as Doc)['gates'] as Doc),
      ['pending', 'in-review', 'done']);
  });

  it('keeps a required frontmatter field that a later fragment leaves out', () => {
    const doc = compose(['stage/x', `
types:
  bug:
    template:
      frontmatter: { required: [id, owner] }
`]);
    const bug = (doc['types'] as Record<string, Doc>)['bug'] as Doc;
    assert.deepEqual(bug['template'], {
      file: 'memory/templates/built-in/bug.md',
      frontmatter: { required: ['id', 'severity', 'owner'] },
    });
  });
});

describe('memory: definition', () => {
  it('fails on a top-level key other than format, defaults, types', () => {
    fails(/blueprint\/x.*extra/, ['blueprint/x', 'extra: 1\n']);
  });

  it('fails on a type defined without path, id_pattern or template', () => {
    fails(/service.*blueprint\/x.*id_pattern/, ['blueprint/x', `
types:
  service:
    path: docs/{id}.md
    template: { file: memory/templates/built-in/service.md }
`]);
  });

  it('fails on a type defined with states and no sequence', () => {
    fails(/service.*sequence/, ['blueprint/x', `
types:
  service:
    path: docs/{id}.md
    id_pattern: "s-{n}"
    template: { file: memory/templates/built-in/service.md }
    states:
      gates: {}
`]);
  });

  it('fails on defaults defined by a pack other than base', () => {
    assert.throws(() => mergeMemory([{ pack: 'blueprint/x', data: parse(`
defaults:
  states:
    sequence: [draft, done]
`) as Doc }], 'base'), /defaults.*blueprint\/x.*base/);
  });

  it('defines a new type after base, following defaults', () => {
    const doc = compose(['blueprint/x', `
types:
  service:
    path: docs/{id}.md
    id_pattern: "s-{n}"
    template: { file: memory/templates/built-in/service.md }
`]);
    assert.deepEqual(Object.keys(doc['types'] as Doc), ['task', 'adr', 'bug', 'service']);
  });
});

describe('memory: tightening', () => {
  it('fails on a key outside the table', () => {
    fails(/task.*stage\/x.*description/, ['stage/x', 'types:\n  task:\n    description: x\n']);
    fails(/task.*stage\/x.*template\.engine/, ['stage/x',
      'types:\n  task:\n    template: { engine: x }\n']);
  });

  it('accepts equal path, id_pattern and template file', () => {
    compose(['stage/x', `
types:
  task:
    path: docs/memory/task/{id}.md
    id_pattern: "task-{n}-{slug}"
    template: { file: memory/templates/built-in/task.md }
`]);
  });

  it('adds required fields, also when the defining pack declared none', () => {
    const text = 'types:\n  task:\n    template:\n      frontmatter: { required: [id] }\n';
    const doc = compose(['stage/x', text]);
    const task = (doc['types'] as Record<string, Doc>)['task'] as Doc;
    assert.deepEqual((task['template'] as Doc)['frontmatter'], { required: ['id'] });
  });
});

describe('memory: sequences', () => {
  it('fails on a duplicate state', () => {
    fails(/task.*duplicate.*backlog/, ['stage/x', `
types:
  task:
    states:
      sequence: [draft, pending, backlog, backlog, in-progress, in-review, approved, done]
`]);
  });

  it('fails on common states in opposite order (step 2)', () => {
    fails(/task.*stage\/production.*order/, AGENT_FIRST, ['stage/production', `
types:
  task:
    states:
      sequence: [draft, pending, backlog, in-progress, ready, in-review, approved, done]
`]);
  });

  it('places own states before the first and after the last common state (step 3)', () => {
    const doc = compose(['stage/x', `
types:
  task:
    states:
      sequence: [intake, draft, pending, backlog, in-progress, in-review, approved, done, archived]
`]);
    assert.deepEqual((states(doc, 'task') as Doc)['sequence'], ['intake', 'draft', 'pending',
      'backlog', 'in-progress', 'in-review', 'approved', 'done', 'archived']);
  });

  it('adds only gates from a states without sequence', () => {
    const doc = compose(taskGate('done: { reject: approved }'));
    assert.equal(((states(doc, 'task') as Doc)['sequence'] as string[]).length, 7);
  });
});

describe('memory: gates', () => {
  it('accepts a repeated gate with the same target', () => {
    compose(taskGate('pending: { reject: draft }'));
  });

  const bad: [string, string][] = [
    ['a gate on a state not in the sequence', 'nowhere: { reject: draft }'],
    ['a gate rejecting to a state not in the sequence', 'done: { reject: nowhere }'],
    ['a gate rejecting to itself', 'done: { reject: done }'],
  ];
  for (const [name, gate] of bad) {
    it(`fails on ${name}`, () => {
      fails(/task.*stage\/x/, taskGate(gate));
    });
  }
});

describe('memory: the reach of defaults', () => {
  const DETACH: [string, string] = ['team-mode/agent-first', `
types:
  adr:
    states:
      sequence: [draft, pending, ai-review, approved]
      gates:
        ai-review: { reject: draft }
`];

  it('adds a defaults gate to a type that already detached', () => {
    const gate = 'defaults:\n  states:\n    gates:\n      approved: { reject: pending }\n';
    const doc = compose(DETACH, ['stage/x', gate]);
    assert.deepEqual((states(doc, 'adr') as Doc)['gates'], {
      pending: { reject: 'draft' },
      'ai-review': { reject: 'draft' },
      approved: { reject: 'pending' },
    });
  });

  it('fails on a defaults gate that conflicts with a detached type', () => {
    const detached: [string, string] = ['team-mode/agent-first', `
types:
  adr:
    states:
      sequence: [draft, pending, ai-review, approved]
      gates:
        approved: { reject: ai-review }
`];
    fails(/type adr.*stage\/x.*approved/, detached, ['stage/x',
      'defaults:\n  states:\n    gates:\n      approved: { reject: pending }\n']);
  });

  it('detaches against the current defaults, with base defaults as reference', () => {
    const doc = compose(ARCHIVED, DETACH);
    assert.deepEqual((states(doc, 'adr') as Doc)['sequence'],
      ['draft', 'pending', 'ai-review', 'approved', 'archived']);
  });

  it('leaves a type with its own states untouched by a tightening of defaults', () => {
    const doc = compose(ARCHIVED);
    assert.deepEqual((states(doc, 'task') as Doc)['sequence'],
      ['draft', 'pending', 'backlog', 'in-progress', 'in-review', 'approved', 'done']);
  });
});
