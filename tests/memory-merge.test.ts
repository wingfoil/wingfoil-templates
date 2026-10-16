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

describe('memory: review cases', () => {
  it('dedupes required fields, at definition and when tightening', () => {
    const doc = compose(['blueprint/x', `
types:
  service:
    template:
      file: memory/templates/built-in/service.md
      frontmatter: { required: [id, id] }
    path: docs/{id}.md
    id_pattern: "s-{n}"
`], ['stage/x',
      'types:\n  service:\n    template:\n      frontmatter: { required: [id, owner, owner] }\n']);
    const service = (doc['types'] as Record<string, Doc>)['service'] as Doc;
    const frontmatter = (service['template'] as Doc)['frontmatter'] as Doc;
    assert.deepEqual(frontmatter['required'], ['id', 'owner']);
  });

  it('keeps the defining fragment key order, and an empty frontmatter', () => {
    const doc = compose(['blueprint/x', `
types:
  service:
    template: { frontmatter: {}, file: memory/templates/built-in/service.md }
    id_pattern: "s-{n}"
    path: docs/{id}.md
`]);
    const service = (doc['types'] as Record<string, Doc>)['service'] as Doc;
    assert.deepEqual(Object.keys(service), ['template', 'id_pattern', 'path']);
    assert.deepEqual(service['template'], {
      frontmatter: {}, file: 'memory/templates/built-in/service.md',
    });
  });

  it('refuses a type without states when no pack defined defaults', () => {
    assert.throws(() => mergeMemory([{ pack: 'base', data: parse(`
types:
  adr:
    path: docs/{id}.md
    id_pattern: "a-{n}"
    template: { file: memory/templates/built-in/adr.md }
`) as Doc }], 'base'), /adr.*defaults/);
  });
});

describe('mergeMemory: the other keys (spec-001 §7.5, plan-038 ruling 2, R9, R10)', () => {
  const NOTE = `
types:
  note:
    name: Note
    description: A note.
    tags: [docs]
    amendable: true
    fields: { owner: { type: string, label: Owner } }
    path: docs/notes/{id}.md
    id_pattern: "note-{n}-{slug}"
    template:
      file: memory/templates/built-in/note.md
      frontmatter:
        required: [id, owner, topics]
        not_applicable_allowed: [owner]
        lists: [topics]
    states:
      sequence: [draft, active, parked, done]
      gates:
        active: { reject: draft }
      waiting: [parked]
      returns: { parked: active }
      limits: { active: 3 }
`;
  const DEFINED: [string, string] = ['governance/notes', NOTE];
  const type = (doc: Doc, name: string): Doc => (doc['types'] as Record<string, Doc>)[name] ?? {};
  const note = (text: string): [string, string] => ['stage/x', `types:\n  note:\n${text}`];
  const task = (text: string): [string, string] => ['stage/x', `types:\n  task:\n${text}`];

  it('defines a type with every key, written back in its order', () => {
    const doc = compose(DEFINED);
    assert.deepEqual(type(doc, 'note'), parse(NOTE).types.note);
    assert.deepEqual(Object.keys(type(doc, 'note')), ['name', 'description', 'tags', 'amendable',
      'fields', 'path', 'id_pattern', 'template', 'states']);
    assert.deepEqual(Object.keys(type(doc, 'note')['states'] as Doc),
      ['sequence', 'gates', 'waiting', 'returns', 'limits']);
  });

  it('keeps a set-once key a later pack repeats, compared as a YAML value', () => {
    const doc = compose(DEFINED, note('    name: Note\n    tags: [docs]\n'
      + '    fields: { owner: { label: Owner, type: string } }\n'));
    assert.equal(type(doc, 'note')['name'], 'Note');
  });

  it('refuses a set-once key changed, or set where the defining pack left it out', () => {
    fails(/note.*name/, DEFINED, note('    name: Other\n'));
    fails(/note.*tags/, DEFINED, note('    tags: [other]\n'));
    fails(/note.*amendable/, DEFINED, note('    amendable: "true"\n'));
    fails(/adr.*description/, DEFINED, ['stage/x', 'types:\n  adr:\n    description: An ADR.\n']);
  });

  it('adds a later pack\'s own waiting states; repeating one changes nothing', () => {
    const doc = compose(DEFINED, note('    states:\n      sequence: [draft, active, blocked, '
      + 'parked, done]\n      waiting: [blocked, parked]\n'));
    assert.deepEqual((type(doc, 'note')['states'] as Doc)['waiting'], ['parked', 'blocked']);
  });

  it('refuses a waiting entry on a state of the base side', () => {
    fails(/note.*waiting.*active/, DEFINED, note('    states:\n      waiting: [active]\n'));
  });

  it('lets a later pack introduce waiting and limits on a type that had none (R10)', () => {
    const doc = compose(task('    states:\n      sequence: [draft, pending, backlog, on-hold, '
      + 'in-progress, in-review, approved, done]\n      waiting: [on-hold]\n'
      + '      limits: { in-progress: 2 }\n'));
    const machine = states(doc, 'task') as Doc;
    assert.deepEqual(machine['waiting'], ['on-hold']);
    assert.deepEqual(machine['limits'], { 'in-progress': 2 });
  });

  it('carries a waiting entry of a tightening of defaults to every type deriving from it', () => {
    const detach: [string, string] = ['team-mode/x', 'types:\n  adr:\n    states:\n'
      + '      sequence: [draft, pending, ai-review, approved]\n'];
    const hold: [string, string] = ['stage/x', 'defaults:\n  states:\n'
      + '    sequence: [draft, pending, on-hold, approved]\n    waiting: [on-hold]\n'];
    const doc = compose(detach, hold);
    assert.deepEqual((defaults(doc) as Doc)['waiting'], ['on-hold']);
    assert.deepEqual((states(doc, 'adr') as Doc)['waiting'], ['on-hold']);
    assert.deepEqual((states(doc, 'adr') as Doc)['sequence'],
      ['draft', 'pending', 'ai-review', 'on-hold', 'approved']);
    assert.equal(states(doc, 'bug'), undefined, 'bug still follows defaults');
  });

  it('keeps returns when a later states has none, and refuses a different or added one', () => {
    const kept = compose(DEFINED, note('    states:\n      limits: { active: 2 }\n'));
    assert.deepEqual((type(kept, 'note')['states'] as Doc)['returns'], { parked: 'active' });
    assert.ok(compose(DEFINED, note('    states:\n      returns: { parked: active }\n')));
    fails(/note.*returns/, DEFINED, note('    states:\n      returns: { done: active }\n'));
    fails(/task.*returns/, task('    states:\n      returns: { done: approved }\n'));
  });

  it('merges limits by the minimum: added, lowered, never raised', () => {
    const lowered = compose(DEFINED, note('    states:\n      limits: { active: 2, parked: 5 }\n'));
    assert.deepEqual((type(lowered, 'note')['states'] as Doc)['limits'], { active: 2, parked: 5 });
    const raised = compose(DEFINED, note('    states:\n      limits: { active: 9 }\n'));
    assert.deepEqual((type(raised, 'note')['states'] as Doc)['limits'], { active: 3 });
  });

  it('refuses a limit that is not a positive integer, or on a state not in the sequence', () => {
    for (const value of ['0', '-1', '1.5', '"2"']) {
      fails(/note.*limits/, DEFINED, note(`    states:\n      limits: { active: ${value} }\n`));
    }
    fails(/note.*limits.*gone/, DEFINED, note('    states:\n      limits: { gone: 1 }\n'));
  });

  it('allows a gate on a waiting state', () => {
    const doc = compose(DEFINED,
      note('    states:\n      gates:\n        parked: { reject: active }\n'));
    assert.deepEqual(Object.keys((type(doc, 'note')['states'] as Doc)['gates'] as Doc),
      ['active', 'parked']);
  });

  it('refuses, at a definition, waiting, returns or limits outside the sequence, and returns '
    + 'to a state not earlier', () => {
    const define = (states: string): [string, string] => ['governance/x', 'types:\n  y:\n'
      + '    path: y/{id}.md\n    id_pattern: "y-{n}"\n    template: { file: memory/templates/'
      + `built-in/y.md }\n    states:\n      sequence: [a, b, c]\n${states}`];
    fails(/y.*waiting/, define('      waiting: [z]\n'));
    fails(/y.*returns/, define('      returns: { z: a }\n'));
    fails(/y.*returns/, define('      returns: { b: z }\n'));
    fails(/y.*returns/, define('      returns: { a: c }\n'));
    fails(/y.*limits/, define('      limits: { z: 1 }\n'));
    assert.ok(compose(define('      returns: { c: a }\n')));
  });

  it('adds to not_applicable_allowed and lists only fields the fragment adds to required', () => {
    const doc = compose(['stage/x', 'types:\n  bug:\n    template:\n      frontmatter:\n'
      + '        required: [reviewer]\n        not_applicable_allowed: [reviewer]\n'
      + '        lists: [reviewer]\n']);
    assert.deepEqual((type(doc, 'bug')['template'] as Doc)['frontmatter'], { required: ['id',
      'severity', 'reviewer'], not_applicable_allowed: ['reviewer'], lists: ['reviewer'] });
    fails(/bug.*not_applicable_allowed.*severity/, ['stage/x', 'types:\n  bug:\n    template:\n'
      + '      frontmatter:\n        required: [severity]\n        not_applicable_allowed: '
      + '[severity]\n']);
    fails(/bug.*lists.*x/, ['stage/x', 'types:\n  bug:\n    template:\n      frontmatter:\n'
      + '        lists: [x]\n']);
  });

  it('changes nothing on a repeated entry of not_applicable_allowed (R9)', () => {
    const doc = compose(DEFINED, note('    template:\n      frontmatter:\n'
      + '        required: [owner]\n        not_applicable_allowed: [owner]\n'));
    assert.deepEqual(((type(doc, 'note')['template'] as Doc)['frontmatter'] as Doc)
      ['not_applicable_allowed'], ['owner']);
  });

  it('refuses exempt, at a definition and at a tightening', () => {
    fails(/note.*exempt/, ['governance/notes', NOTE.replace('        lists: [topics]\n',
      '        lists: [topics]\n        exempt: { owner: [note-1] }\n')]);
    fails(/bug.*exempt/, ['stage/x', 'types:\n  bug:\n    template:\n      frontmatter:\n'
      + '        exempt: { severity: [bug-1] }\n']);
  });

  it('carries a limit of defaults to a detached type by the minimum, and returns of defaults to '
    + 'a type that detaches', () => {
    const base: [string, string] = ['base', 'defaults:\n  states:\n'
      + '    sequence: [draft, pending, approved]\n    returns: { approved: pending }\n'
      + '    limits: { pending: 4 }\ntypes:\n  adr:\n    path: a/{id}.md\n'
      + '    id_pattern: "adr-{n}"\n    template: { file: memory/templates/built-in/adr.md }\n'];
    const all = (...fragments: [string, string][]): Doc => mergeMemory(fragments.map(
      ([pack, text]) => ({ pack, data: parse(text) as Doc })), 'base');
    const doc = all(base, ['team-mode/x', 'types:\n  adr:\n    states:\n'
      + '      sequence: [draft, pending, ai-review, approved]\n      limits: { pending: 2 }\n'],
    ['stage/x', 'defaults:\n  states:\n    limits: { pending: 3 }\n']);
    const adr = states(doc, 'adr') as Doc;
    assert.deepEqual(adr['returns'], { approved: 'pending' });
    assert.deepEqual(adr['limits'], { pending: 2 });
    assert.deepEqual((defaults(doc) as Doc)['limits'], { pending: 3 });
  });
});
