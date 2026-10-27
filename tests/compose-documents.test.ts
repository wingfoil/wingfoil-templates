import { strict as assert } from 'node:assert';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { loadCatalog } from '../src/catalog';
import { composeDocuments } from '../src/compose-documents';
import type { ParameterValues } from '../src/compose-documents';
import {
  BASE, DELIVERY, KANBAN, RELEASE_TEMPLATE, RELEASE_TYPE, SOFTWARE, subWorkflow, withPackTree,
} from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { FIXTURES, FIXTURE_CATALOG } from './support/paths';
import { conformingReadme } from './support/readme';

const CATALOG = loadCatalog(FIXTURE_CATALOG);
type Doc = Record<string, unknown>;

function compose(specs: PackSpec[], request: string[], values: ParameterValues = {}) {
  let result: ReturnType<typeof composeDocuments> | undefined;
  withPackTree(specs, (root) => {
    result = composeDocuments(root, CATALOG, request, values);
  });
  assert.ok(result !== undefined);
  return result;
}

function fails(
  specs: PackSpec[],
  request: string[],
  pattern: RegExp,
  values: ParameterValues = {},
): void {
  withPackTree(specs, (root) => {
    assert.throws(() => composeDocuments(root, CATALOG, request, values), pattern);
  });
}

const MEMORY_BASE = `format: 1
defaults:
  states:
    sequence: [draft, pending, approved]
    gates:
      pending: { reject: draft }
types:
  adr:
    path: docs/memory/adr/{id}.md
    id_pattern: "adr-{n}-{slug}"
    template: { file: memory/templates/built-in/adr.md, frontmatter: { required: [] } }
`;

const BASE_M: PackSpec = { ...BASE, fragments: ['dna', 'roles', 'memory'], extraFiles: {
  'fragments/dna.yaml': 'format: 1\nproject:\n  name: "{{project_name}}"\n',
  'fragments/roles.yaml': 'format: 1\nglobal: [security]\n',
  'fragments/memory.yaml': MEMORY_BASE,
}, manifest: { parameters: { project_name: { type: 'string', description: 'project name' } } } };

const NAME = { project_name: 'Demo' };

function fixture(name: string): string {
  return join(FIXTURES, 'merge', name);
}

describe('composeDocuments: the spec-001 §7.5 fixtures', () => {
  it('composes example 1 into the documented task machine', () => {
    const result = composeDocuments(fixture('example-1'), CATALOG,
      ['methodology/kanban', 'team-mode/agent-first', 'stage/production'], {});
    const task = ((result.memory['types'] as Doc)['task'] as Doc)['states'] as Doc;
    assert.deepEqual(task['sequence'], ['draft', 'pending', 'backlog', 'ready', 'in-progress',
      'in-review', 'qa', 'approved', 'done']);
    assert.deepEqual(Object.keys(task['gates'] as Doc), ['pending', 'in-review', 'ready']);
  });

  it('composes example 2: defaults reach adr and every type deriving from them', () => {
    const result = composeDocuments(fixture('example-2'), CATALOG,
      ['methodology/kanban', 'team-mode/agent-first', 'stage/production'], {});
    const types = result.memory['types'] as Record<string, Doc>;
    assert.deepEqual((types['adr']?.['states'] as Doc)['sequence'],
      ['draft', 'pending', 'ai-review', 'approved', 'archived']);
    assert.equal(types['bug']?.['states'], undefined);
    assert.deepEqual(((result.memory['defaults'] as Doc)['states'] as Doc)['sequence'],
      ['draft', 'pending', 'approved', 'archived']);
  });
});

describe('composeDocuments: formats (spec-001 §5, §7.2)', () => {
  it('puts format and version: 1 first in every composed document', () => {
    const result = compose([BASE_M, SOFTWARE, KANBAN], ['methodology/kanban'], NAME);
    for (const doc of [result.dna, result.roles, result.memory]) {
      assert.deepEqual(Object.keys(doc).slice(0, 2), ['format', 'version']);
      assert.equal(doc['format'], 1);
      assert.equal(doc['version'], 1);
    }
  });

  const broken: [string, string, RegExp][] = [
    ['without format', 'project: { license: MIT }\n', /blueprint\/x.*fragments\/dna\.yaml.*format/],
    ['with version', 'format: 1\nversion: 2\n', /blueprint\/x.*fragments\/dna\.yaml.*version/],
    ['with a format its pack does not declare', 'format: 2\n', /blueprint\/x.*dna.*format 2.*1/],
  ];
  for (const [name, text, pattern] of broken) {
    it(`fails on a fragment ${name}`, () => {
      fails([BASE_M, SOFTWARE, KANBAN, { id: 'blueprint/x', fragments: ['dna'],
        extraFiles: { 'fragments/dna.yaml': text } }],
      ['methodology/kanban', 'blueprint/x'], pattern, NAME);
    });
  }

  it('fails on a fragment whose format is written 1.0 (spec-001 §18)', () => {
    fails([BASE_M, SOFTWARE, KANBAN, { id: 'blueprint/x', fragments: ['dna'],
      extraFiles: { 'fragments/dna.yaml': 'format: 1.0\n' } }],
    ['methodology/kanban', 'blueprint/x'], /blueprint\/x.*fragments\/dna\.yaml.*1\.0/, NAME);
  });

  it('fails on two fragments of one kind in different formats', () => {
    const other: PackSpec = { id: 'blueprint/x', fragments: ['dna'],
      manifest: { formats: { dna: 2 } }, extraFiles: { 'fragments/dna.yaml': 'format: 2\n' } };
    fails([BASE_M, SOFTWARE, KANBAN, other], ['methodology/kanban', 'blueprint/x'],
      /dna.*format 1.*format 2/,
      NAME);
  });
});

describe('composeDocuments: dna and roles checks', () => {
  it('fails on an agent with approval authority', () => {
    fails([BASE_M, SOFTWARE, KANBAN, { id: 'team-mode/x', fragments: ['dna'], extraFiles: {
      'fragments/dna.yaml': 'format: 1\nteam:\n  agents:\n'
        + '    - { name: c, approval_authority: true }\n',
    } }], ['methodology/kanban', 'team-mode/x'], /team-mode\/x.*approval_authority/, NAME);
  });

  it('accepts a directive shipped by a pack, and refuses an unknown one', () => {
    const shipping = { id: 'governance/x', fragments: ['roles'], directives: ['wip-limits'],
      extraFiles: { 'fragments/roles.yaml': 'format: 1\nglobal: [wip-limits]\n' } };
    compose([BASE_M, SOFTWARE, KANBAN, shipping], ['methodology/kanban', 'governance/x'], NAME);
    fails([BASE_M, SOFTWARE, KANBAN, { ...shipping, directives: [] }], ['methodology/kanban',
      'governance/x'],
      /wip-limits/, NAME);
  });
});

describe('composeDocuments: parameters (spec-001 §8)', () => {
  const declaring = (parameters: Doc): PackSpec => ({
    id: 'blueprint/p', manifest: { parameters },
  });

  it('substitutes values, and defaults when no value is given', () => {
    const result = compose([BASE_M, SOFTWARE, KANBAN], ['methodology/kanban'], NAME);
    assert.equal((result.dna['project'] as Doc)['name'], 'Demo');
  });

  const invalid: [string, Doc, RegExp][] = [
    ['a name breaking ^[a-z][a-z0-9_]*$',
      { Bad: { type: 'string', description: 'x', default: 'a' } },
      /blueprint\/p.*Bad|Bad.*blueprint\/p|parameters/],
    ['a declaration without description', { wip: { type: 'integer', default: 3 } },
      /blueprint\/p.*description|description/],
    ['a default that breaks its type', { dir: { type: 'path', description: 'x', default: '/etc' } },
      /blueprint\/p/],
  ];
  for (const [name, parameters, pattern] of invalid) {
    it(`fails on ${name}`, () => {
      fails([BASE_M, SOFTWARE, KANBAN, declaring(parameters)], ['methodology/kanban',
        'blueprint/p'], pattern,
        NAME);
    });
  }

  it('fails on a required parameter without a value, naming it and its pack', () => {
    fails([BASE_M, SOFTWARE, KANBAN], ['methodology/kanban'], /project_name.*base/);
  });

  it('reports a required parameter named like an Object.prototype member as missing', () => {
    const p = declaring({ constructor: { type: 'string', description: 'x' } });
    fails([BASE_M, SOFTWARE, KANBAN, p], ['methodology/kanban', 'blueprint/p'],
      /constructor.*required/,
      NAME);
  });

  it('fails on a given value that no pack declares', () => {
    fails([BASE_M, SOFTWARE, KANBAN], ['methodology/kanban'], /nope/, { ...NAME, nope: 1 });
  });

  it('fails on a name declared by two packs', () => {
    const twice = { project_name: { type: 'string', description: 'x', default: 'a' } };
    fails([BASE_M, SOFTWARE, KANBAN, declaring(twice)],
      ['methodology/kanban', 'blueprint/p'], /project_name.*base.*blueprint\/p/, NAME);
  });

  it('fails on an integer default written 1.0 or 0x10 (spec-001 §18)', () => {
    for (const source of ['1.0', '0x10']) {
      const wip = { wip: { type: 'integer', description: 'x', default: 1 } };
      withPackTree([BASE_M, SOFTWARE, KANBAN, declaring(wip)], (root) => {
        const file = join(root, 'packs', 'blueprint', 'p', 'pack.yaml');
        writeFileSync(file, readFileSync(file, 'utf8').replace('default: 1', `default: ${source}`));
        const request = ['methodology/kanban', 'blueprint/p'];
        assert.throws(() => composeDocuments(root, CATALOG, request, NAME),
          new RegExp(`wip.*${source.replace('.', '\\.')}`));
      });
    }
  });

  it('fails on a given value of the wrong type', () => {
    fails([BASE_M, SOFTWARE, KANBAN], ['methodology/kanban'], /project_name/,
      { project_name: 'a "b"' });
  });

  it('fails on a parameter used outside its pack scope, in a fragment and in an asset', () => {
    const user = (files: Record<string, string>, lists: Partial<PackSpec>): PackSpec => ({
      id: 'governance/u', ...lists, extraFiles: files,
    });
    const p = declaring({ wip: { type: 'integer', description: 'x', default: 3 } });
    fails([BASE_M, SOFTWARE, KANBAN, p, user({ 'fragments/dna.yaml': 'format: 1\nx: {{wip}}\n' },
      { fragments: ['dna'] })], ['methodology/kanban', 'blueprint/p', 'governance/u'],
    /governance\/u.*fragments\/dna\.yaml.*\{\{wip\}\}/, NAME);
    fails([BASE_M, SOFTWARE, KANBAN, p, user({ 'directives/d.md': 'WIP {{wip}}\n' },
      { directives: ['d'] })],
      ['methodology/kanban', 'blueprint/p', 'governance/u'],
      /governance\/u.*directives\/d\.md.*\{\{wip\}\}/, NAME);
  });

  it('lets a pack use a parameter of a pack it requires transitively', () => {
    const p = declaring({ wip: { type: 'integer', description: 'x', default: 3 } });
    const mid: PackSpec = { id: 'blueprint/q', requires: ['base@^1', 'blueprint/p@^1'] };
    const user: PackSpec = { id: 'governance/u', requires: ['base@^1', 'blueprint/q@^1'],
      directives: ['d'], extraFiles: { 'directives/d.md': 'WIP {{wip}} for {{project_name}}\n' } };
    const request = ['methodology/kanban', 'governance/u'];
    const result = compose([BASE_M, SOFTWARE, KANBAN, p, mid, user], request, NAME);
    const directive = result.files.find((file) => file.path === 'directives/d.md');
    assert.equal(directive?.text, 'WIP 3 for Demo\n');
  });

  it('substitutes Memory templates and the agents section', () => {
    const result = compose([BASE_M, SOFTWARE, KANBAN, { id: 'governance/t',
      memoryTemplates: ['note'],
      agentsSection: true, extraFiles: {
        'memory-templates/note.md': 'For {{project_name}}\n',
        'agents/section.md': '## {{project_name}}\n',
      } }], ['methodology/kanban', 'governance/t'], NAME);
    const text = (path: string): string | undefined =>
      result.files.find((file) => file.path === path)?.text;
    assert.equal(text('memory-templates/note.md'), 'For Demo\n');
    assert.equal(text('agents/section.md'), '## Demo\n');
  });

  it('does not substitute pack.yaml, README.md or CHANGELOG.md', () => {
    compose([BASE_M, SOFTWARE, KANBAN, { id: 'blueprint/r', extraFiles: {
      'README.md': `${conformingReadme({ id: 'blueprint/r', title: 'r', description: 'R.' })}\n`
        + '{{nobody}}\n',
      'CHANGELOG.md': '{{nobody}}\n',
    }, manifest: { description: 'Uses {{nobody}} in text.' } }],
    ['methodology/kanban', 'blueprint/r'], NAME);
  });

  it('fails on a fragment or a workflow that no longer parses after substitution', () => {
    const p = declaring({ s: { type: 'string', description: 'x', default: 'a: b' } });
    fails([BASE_M, SOFTWARE, KANBAN, { ...p, fragments: ['dna'],
      extraFiles: { 'fragments/dna.yaml': 'format: 1\nx: {{s}}\n' } }],
    ['methodology/kanban', 'blueprint/p'], /blueprint\/p.*fragments\/dna\.yaml/, NAME);
    fails([BASE_M, SOFTWARE, KANBAN, { ...p, workflows: ['w'],
      extraFiles: { 'workflows/w.yaml': 'format: 1\nname: w\nd: {{s}}\n' } }],
    ['methodology/kanban', 'blueprint/p'], /blueprint\/p.*workflows\/w\.yaml/, NAME);
  });
});

function dnaPack(id: string, text: string): PackSpec {
  return { id, fragments: ['dna'], extraFiles: { 'fragments/dna.yaml': text } };
}

describe('composeDocuments: determinism', () => {
  it('gives the same documents, key order included, whatever the request order', () => {
    const specs: PackSpec[] = [BASE_M, SOFTWARE, KANBAN,
      dnaPack('blueprint/a', 'format: 1\na: 1\n'), dnaPack('blueprint/b', 'format: 1\nb: 1\n')];
    const one = compose(specs, ['methodology/kanban', 'blueprint/a', 'blueprint/b'], NAME);
    const two = compose(specs, ['blueprint/b', 'blueprint/a', 'methodology/kanban'], NAME);
    assert.equal(JSON.stringify([one.dna, one.roles, one.memory]),
      JSON.stringify([two.dna, two.roles, two.memory]));
  });
});

describe('composeDocuments: the conditional part\'s rules (spec-001 §6.5, §17, §18)', () => {
  const directive = (id: string): string => `---\nid: ${id}\nformat: 1\n---\n# ${id}\n`;
  const flow = (entry: Record<string, string[]>, files: Record<string, string>,
    extra: Partial<PackSpec> = {}): PackSpec => ({ id: 'methodology/flow', workflows: ['board'],
    ...extra, manifest: { formats: { workflow: 1 },
      conditional: [{ with: 'software@^1', contents: entry }], ...extra.manifest },
    extraFiles: { ...files, ...extra.extraFiles } });
  const DELIVERING = { workflows: ['delivery'] };
  const DELIVERY_FILE = { 'workflows/delivery.yaml': DELIVERY };
  const board = (phase: string): Partial<PackSpec> => ({ extraFiles: { 'workflows/board.yaml':
    `format: 1\nname: board\nkind: sub\nphases:\n  - { name: a, ${phase} }\n` } });

  it('refuses an always-composed workflow including a slot, without software', () => {
    fails([BASE_M, SOFTWARE, flow(DELIVERING, DELIVERY_FILE, board('include: release'))],
      ['methodology/flow'], /board\.yaml.*slot release/, NAME);
  });

  it('refuses an always-composed workflow including a workflow of the part', () => {
    fails([BASE_M, SOFTWARE, flow({ workflows: ['delivery', 'side'] }, { ...DELIVERY_FILE,
      'workflows/side.yaml': 'format: 1\nname: side\nkind: sub\n' }, board('include: side'))],
    ['software', 'methodology/flow'], /board\.yaml.*side.*conditional part/, NAME);
  });

  it('refuses a roles fragment assigning a directive of the part', () => {
    fails([BASE_M, SOFTWARE, flow({ workflows: ['delivery'], directives: ['d'] },
      { ...DELIVERY_FILE, 'directives/d.md': directive('d') }, { fragments: ['roles'],
        manifest: { formats: { roles: 1, workflow: 1, directive: 1 } },
        extraFiles: { 'fragments/roles.yaml': 'format: 1\nglobal: [d]\n' } })],
    ['software', 'methodology/flow'], /roles\.yaml.*d.*conditional part/, NAME);
  });

  it('refuses a file listed in both parts, or in neither', () => {
    fails([BASE_M, SOFTWARE, flow({ workflows: ['delivery'], directives: ['d'] },
      { ...DELIVERY_FILE, 'directives/d.md': directive('d') }, { directives: ['d'],
        manifest: { formats: { workflow: 1, directive: 1 } } })],
    ['methodology/flow'], /directives\/d\.md is listed in contents and in the conditional/, NAME);
    fails([BASE_M, SOFTWARE, flow(DELIVERING, { ...DELIVERY_FILE,
      'workflows/extra.yaml': 'format: 1\nname: extra\nkind: sub\n' })],
    ['methodology/flow'], /extra\.yaml is present but not listed/, NAME);
  });

  it('refuses delivery placed against whether the methodology requires software', () => {
    fails([BASE_M, SOFTWARE, { id: 'methodology/flow', workflows: ['delivery'] }],
      ['methodology/flow'], /does not require software.*conditional part/, NAME);
  });

  it('refuses a reserved name in the part', () => {
    const reserved = 'workflows/sw-life-cycle.yaml';
    fails([BASE_M, SOFTWARE, KANBAN, { id: 'blueprint/x', workflows: ['x'],
      manifest: { conditional: [{ with: 'software@^1',
        contents: { workflows: ['sw-life-cycle'] } }] },
      extraFiles: { [reserved]: 'format: 1\nname: sw-life-cycle\nkind: main\n' } }],
    ['methodology/kanban', 'blueprint/x'], /blueprint\/x.*sw-life-cycle.*only software/, NAME);
  });
});


describe('composeDocuments: the other memory.yaml keys (spec-001 §7.5)', () => {
  it('composes a type defined by base with them and tightened by an overlay', () => {
    const memory = `${MEMORY_BASE}  plan:
    name: Plan
    description: An executable plan.
    path: docs/plans/{id}.md
    id_pattern: "plan-{n}-{slug}"
    template:
      file: memory/templates/built-in/plan.md
      frontmatter: { required: [id, phase], not_applicable_allowed: [phase] }
    states:
      sequence: [draft, active, parked, done]
      waiting: [parked]
      returns: { parked: active }
      limits: { active: 2 }
`;
    const base: PackSpec = { ...BASE_M, memoryTemplates: ['plan'],
      extraFiles: { ...BASE_M.extraFiles, 'fragments/memory.yaml': memory } };
    const stage: PackSpec = { id: 'stage/x', fragments: ['memory'], extraFiles: {
      'fragments/memory.yaml': 'format: 1\ntypes:\n  plan:\n    name: Plan\n    states:\n'
        + '      sequence: [draft, active, blocked, parked, done]\n      waiting: [blocked]\n'
        + '      limits: { active: 1 }\n' } };
    const result = compose([base, SOFTWARE, KANBAN, stage], ['methodology/kanban', 'stage/x'],
      NAME);
    assert.deepEqual((result.memory['types'] as Record<string, Doc>)['plan'], {
      name: 'Plan', description: 'An executable plan.', path: 'docs/plans/{id}.md',
      id_pattern: 'plan-{n}-{slug}',
      template: { file: 'memory/templates/built-in/plan.md',
        frontmatter: { required: ['id', 'phase'], not_applicable_allowed: ['phase'] } },
      states: { sequence: ['draft', 'active', 'blocked', 'parked', 'done'],
        waiting: ['parked', 'blocked'], returns: { parked: 'active' }, limits: { active: 1 } },
    });
  });
});

describe('composeDocuments: a methodology\'s delivery after dl-026 and dl-027 (task-051)', () => {
  const SOFTWARE_RELEASE: PackSpec = { ...SOFTWARE, extraFiles: {
    'fragments/memory.yaml': RELEASE_TYPE, 'memory-templates/release.md': RELEASE_TEMPLATE } };
  const sub = subWorkflow;
  const kanban = (status: string): PackSpec => ({ ...KANBAN, workflows: ['delivery', 'sprint'],
    extraFiles: {
      'workflows/delivery.yaml': sub('delivery', ['{ name: sprints, include: sprint }']),
      'workflows/sprint.yaml': sub('sprint', [`{ name: release, iterate_over: release, where: { `
        + `status: ${status} }, include: release }`, '{ name: retrospective, include: '
        + 'retrospective }']) } });

  it('accepts release and retrospective reached through the methodology\'s sub', () => {
    const result = compose([BASE_M, SOFTWARE_RELEASE, kanban('[in-development, releasing]')],
      ['methodology/kanban'], NAME);
    assert.ok(result.files.some((file) => file.path === 'workflows/sprint.yaml'));
  });

  it('refuses a phase including release with another status', () => {
    fails([BASE_M, SOFTWARE_RELEASE, kanban('[in-development]')], ['methodology/kanban'],
      /sprint\.yaml.*release.*in-development, releasing/, NAME);
  });

  it('refuses a conditional delivery reaching a workflow of contents (spec-001 §18)', () => {
    const flow: PackSpec = { id: 'methodology/flow', workflows: ['board', 'shared'],
      manifest: { formats: { workflow: 1 },
        conditional: [{ with: 'software@^1', contents: { workflows: ['delivery'] } }] },
      extraFiles: {
        'workflows/delivery.yaml': sub('delivery', ['{ name: r, iterate_over: release, where: { '
          + 'status: [in-development, releasing] }, include: release }',
        '{ name: a, include: shared }', '{ name: retrospective, include: retrospective }']),
        'workflows/shared.yaml': sub('shared', ['{ name: s, produces: [x.md] }']),
        'workflows/board.yaml': sub('board', ['{ name: b, produces: [y.md] }']) } };
    fails([BASE_M, SOFTWARE_RELEASE, flow], ['software', 'methodology/flow'],
      /phase a includes shared, which the pack ships in another part than delivery/, NAME);
  });
});
