// The composer per conditional entry at format 2 (spec-001 §6.5, §7.1, §7.7, §8.1, §17; task-084):
// the active entries, their order and parameter scopes, the rules the composer applies per entry,
// the tensions' notices and the mcp refusal. Fixture packs only (plan-066 ruling 2).
import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';

import { loadCatalog } from '../src/catalog';
import { composeDocuments } from '../src/compose-documents';
import { planOutput } from '../src/output';
import { ResolveError, resolve } from '../src/resolve';
import {
  BASE_COMPOSABLE, DELIVERY, KANBAN, SOFTWARE_COMPOSABLE, withPackTree,
} from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { FIXTURE_CATALOG } from './support/paths';

const CATALOG = loadCatalog(FIXTURE_CATALOG);

function workflow(name: string, extra = ''): string {
  return `format: 1\nname: ${name}\nkind: sub\n${extra}`;
}

/** software with a parameter of its own. */
const SW: PackSpec = { ...SOFTWARE_COMPOSABLE, manifest: { parameters: {
  sw_param: { type: 'string', default: 'swx', description: 'software parameter' } } } };

/** A governance pack with a role, a directive and a parameter, unrelated to software. */
const GOV: PackSpec = {
  id: 'governance/g', fragments: ['dna'], directives: ['g-rule'],
  manifest: { parameters: { g_param: { type: 'string', default: 'gx', description: 'g' } } },
  extraFiles: { 'fragments/dna.yaml':
    'format: 1\nteam:\n  roles:\n    - { name: auditor, description: "Audits." }\n' },
};

/** A format-2 stage: an entry with software, then one with governance/g. */
function stage(files: Record<string, string> = {}, extra: Partial<PackSpec> = {}): PackSpec {
  return {
    id: 'stage/s', format: 2, workflows: ['s-board'],
    conditional: [
      { with: 'software@^1', workflows: ['s-sw-flow'], directives: ['s-sw'] },
      { with: 'governance/g@^1', workflows: ['s-gov'] },
    ],
    ...extra,
    extraFiles: {
      'workflows/s-sw-flow.yaml': workflow('s-sw-flow', 'description: "{{sw_param}}"\n'),
      'workflows/s-gov.yaml': workflow('s-gov',
        'phases:\n  - { name: a, role: auditor, actions: [memory.submit] }\n'),
      ...files, ...extra.extraFiles,
    },
  };
}

const PACKS = (s: PackSpec = stage(), gov: PackSpec = GOV): PackSpec[] =>
  [BASE_COMPOSABLE, SW, KANBAN, gov, s];

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
    assert.throws(() => planOutput(composeDocuments(root, CATALOG, request, {}), CATALOG),
      (error: unknown) => {
        assert.ok(error instanceof Error, String(error));
        assert.match(error.message, pattern);
        return true;
      });
  });
}

function resolveFails(specs: PackSpec[], request: string[], pattern: RegExp): void {
  withPackTree(specs, (root) => {
    assert.throws(() => resolve(root, CATALOG, request), (error: unknown) => {
      assert.ok(error instanceof ResolveError, String(error));
      assert.match(error.message, pattern);
      return true;
    });
  });
}

function include(files: Map<string, string>): string[] {
  return (files.get('.wingfoil/workflows.yaml') ?? '').split('\n')
    .filter((line) => line.startsWith('  - '))
    .map((line) => line.slice('  - workflows/built-in/'.length, -'.yaml'.length));
}

const WITH_SOFTWARE = ['software', 'methodology/kanban'];

describe('compose per entry: the active entries (spec-001 §6.5, §17 step 1)', () => {
  it('composes each entry only with its pack, in written order after the pack\'s own', () => {
    const both = plan(PACKS(), [...WITH_SOFTWARE, 'governance/g', 'stage/s']);
    assert.deepEqual(include(both), ['retrospective', 'sw-life-cycle', 'delivery', 's-board',
      's-sw-flow', 's-gov']);
    assert.ok(both.has('.wingfoil/directives/built-in/s-sw.md'));
    const software = plan(PACKS(), [...WITH_SOFTWARE, 'stage/s']);
    assert.deepEqual(include(software), ['retrospective', 'sw-life-cycle', 'delivery', 's-board',
      's-sw-flow']);
    const governance = plan(PACKS(), ['governance/g', 'stage/s']);
    assert.deepEqual(include(governance), ['retrospective', 's-board', 's-gov']);
    assert.ok(!governance.has('.wingfoil/directives/built-in/s-sw.md'));
    assert.ok(!governance.has('.wingfoil/workflows/built-in/s-sw-flow.yaml'));
    const neither = plan(PACKS(), ['stage/s']);
    assert.deepEqual(include(neither), ['retrospective', 's-board']);
    assert.ok(!neither.has('.wingfoil/workflows/built-in/s-gov.yaml'));
  });

  it('never adds the pack an entry names', () => {
    withPackTree(PACKS(), (root) => {
      assert.deepEqual(resolve(root, CATALOG, ['stage/s']).map((pack) => pack.id),
        ['base', 'stage/s']);
    });
  });

  it('fails on an entry\'s pack present outside its range, naming the entry', () => {
    const later = { ...GOV, version: '2.0.0' };
    resolveFails(PACKS(stage(), later), ['governance/g', 'stage/s'],
      /governance\/g 2\.0\.0 does not satisfy \^1, asked by stage\/s for its conditional entry with governance\/g@\^1/);
    withPackTree(PACKS(stage(), later), (root) => {
      assert.ok(resolve(root, CATALOG, ['stage/s']).length > 0);
    });
  });
});

describe('compose per entry: parameter scopes (spec-001 §8.1, §6.5)', () => {
  it('lets an entry use its own with pack\'s parameters, and no other entry\'s', () => {
    const files = plan(PACKS(), [...WITH_SOFTWARE, 'governance/g', 'stage/s']);
    assert.match(files.get('.wingfoil/workflows/built-in/s-sw-flow.yaml') ?? '', /swx/);
    fails(PACKS(stage({ 'workflows/s-gov.yaml': workflow('s-gov', 'description: "{{sw_param}}"\n') })),
      [...WITH_SOFTWARE, 'governance/g', 'stage/s'], /s-gov\.yaml.*sw_param/);
  });
});

describe('compose per entry: §7.1 and the shapes the resolver applies (spec-001 §6.5)', () => {
  const B: PackSpec = { id: 'blueprint/b', format: 2, directives: ['b'],
    conditional: [{ with: 'stage/s@^1', directives: ['b-stage'] }] };

  it('fails on an entry naming a later pack, in a composition holding it', () => {
    resolveFails([...PACKS(), B], ['blueprint/b', 'stage/s'],
      /blueprint\/b: its entry with stage\/s@\^1 names stage\/s, later in the composition order \(spec-001 §7\.1\)/);
    withPackTree([...PACKS(), B], (root) => {
      assert.ok(resolve(root, CATALOG, ['blueprint/b']).length > 0);
    });
  });

  it('composes a format-2 pack requiring software with an entry naming another pack', () => {
    const c: PackSpec = { id: 'blueprint/c', format: 2, requires: ['base@^1', 'software@^1'],
      directives: ['c'], conditional: [{ with: 'governance/g@^1', directives: ['c-g'] }] };
    assert.ok(plan([...PACKS(), c], [...WITH_SOFTWARE, 'governance/g', 'blueprint/c'])
      .has('.wingfoil/directives/built-in/c-g.md'));
  });

  it('refuses a format-2 pack requiring software with an entry naming it', () => {
    const c: PackSpec = { id: 'blueprint/c', format: 2, requires: ['base@^1', 'software@^1'],
      directives: ['c'], conditional: [{ with: 'software@^1', directives: ['c-sw'] }] };
    resolveFails([...PACKS(), c], ['methodology/kanban', 'blueprint/c'],
      /blueprint\/c: requires software, so it carries no conditional entry with software/);
  });

  it('refuses format 1\'s shapes by its schema (already green before task-084)', () => {
    const one = (manifest: Record<string, unknown>): PackSpec => ({ id: 'blueprint/d',
      directives: ['d'], manifest });
    const entry = { with: 'software@^1', contents: { directives: ['d'] } };
    resolveFails([...PACKS(), one({ conditional: [entry, { ...entry, contents: {} }] })],
      ['blueprint/d'],
      /blueprint\/d\/pack\.yaml.*conditional/);
    resolveFails([...PACKS(), one({ tensions: [{ pack: 'stage/s', resolution: 'x' }] })],
      ['blueprint/d'], /blueprint\/d\/pack\.yaml/);
    resolveFails([...PACKS(), one({ conditional: [{ ...entry, with: 'governance/g@^1' }] })],
      ['blueprint/d'], /blueprint\/d\/pack\.yaml.*conditional\/0\/with/);
  });

  it('refuses a file listed in two entries, or in contents and an entry', () => {
    const twice = stage({}, { conditional: [
      { with: 'software@^1', workflows: ['s-sw-flow'], directives: ['s-sw'] },
      { with: 'governance/g@^1', workflows: ['s-gov'], directives: ['s-sw'] }] });
    resolveFails(PACKS(twice), ['stage/s'], /stage\/s: directives\/s-sw\.md is listed in two conditional entries/);
    const both = stage({}, { directives: ['s-gov-d'], conditional: [
      { with: 'software@^1', workflows: ['s-sw-flow'], directives: ['s-sw'] },
      { with: 'governance/g@^1', workflows: ['s-gov'], directives: ['s-gov-d'] }] });
    resolveFails(PACKS(both), ['stage/s'],
      /stage\/s: directives\/s-gov-d\.md is listed in contents and in the conditional part/);
  });

  it('counts the second entry\'s files for formats', () => {
    const gov = stage({}, { conditional: [
      { with: 'software@^1', workflows: ['s-sw-flow'] },
      { with: 'governance/g@^1', workflows: ['s-gov'], directives: ['s-g'] }] });
    withPackTree(PACKS(gov), (root) => {
      assert.ok(resolve(root, CATALOG, ['stage/s']).length > 0);
    });
  });
});

describe('compose per entry: the workflow rules the composer applies (spec-001 §6.5, §9)', () => {
  it('lets a workflow of the second entry use a role of its with pack', () => {
    const files = plan(PACKS(), [...WITH_SOFTWARE, 'governance/g', 'stage/s']);
    assert.match(files.get('.wingfoil/workflows/built-in/s-gov.yaml') ?? '', /auditor/);
  });

  it('refuses an always-composed workflow including a workflow of the second entry', () => {
    fails(PACKS(stage({ 'workflows/s-board.yaml': workflow('s-board',
      'phases:\n  - { name: a, include: s-gov }\n') })), ['governance/g', 'stage/s'],
    /s-board\.yaml.*s-gov.*conditional part.*governance\/g/);
  });

  it('refuses a roles fragment assigning a directive of the second entry', () => {
    const s = stage({ 'fragments/roles.yaml': 'format: 1\nglobal: [s-g]\n' }, {
      fragments: ['roles'], conditional: [
        { with: 'software@^1', workflows: ['s-sw-flow'] },
        { with: 'governance/g@^1', workflows: ['s-gov'], directives: ['s-g'] }] });
    fails(PACKS(s), ['governance/g', 'stage/s'], /roles\.yaml.*s-g.*conditional part/);
  });

  it('composes a methodology with delivery in its software entry at the second position', () => {
    // An entry naming base is a shape (D)'s lint refuses; only base and software precede a
    // methodology, so it is the one way to put the software entry second (task-084 notes).
    const flow: PackSpec = { id: 'methodology/flow', format: 2, workflows: ['board'],
      conditional: [{ with: 'base@^1', directives: ['f-base'] },
        { with: 'software@^1', workflows: ['delivery'] }],
      extraFiles: { 'workflows/delivery.yaml': DELIVERY } };
    const files = plan([BASE_COMPOSABLE, SW, flow], ['software', 'methodology/flow']);
    assert.deepEqual(include(files), ['retrospective', 'sw-life-cycle', 'board', 'delivery']);
  });
});

describe('compose per entry: the tensions\' notices (spec-001 §6.2, §17 step 8)', () => {
  const tense = (tensions: { pack: string; resolution: string }[]): PackSpec[] => [
    BASE_COMPOSABLE, SW, KANBAN, GOV,
    { id: 'governance/h', format: 2, directives: ['h'], tensions },
    { id: 'team-mode/t', directives: ['t'] }, stage(),
  ];
  const notices = (specs: PackSpec[], request: string[]): unknown => {
    let result: unknown;
    withPackTree(specs, (root) => {
      result = (composeDocuments(root, CATALOG, request, {}) as { notices?: unknown }).notices;
    });
    return result;
  };

  it('returns one notice per tension held, in composition then tensions order', () => {
    const specs = tense([
      { pack: 'stage/s@^1', resolution: 'Explore only\nin the exploration scope.' },
      { pack: 'governance/g', resolution: 'Audit first.' },
      { pack: 'team-mode/t@^2', resolution: 'Never shown: outside the range.' },
    ]);
    assert.deepEqual(notices(specs, ['governance/g', 'governance/h', 'team-mode/t', 'stage/s']), [
      'notice: governance/h and stage/s: Explore only in the exploration scope.',
      'notice: governance/h and governance/g: Audit first.',
    ]);
    assert.deepEqual(notices(specs, ['governance/h']), []);
  });
});

describe('compose per entry: the mcp refusal (plan-066 ruling 6)', () => {
  it('refuses a pack shipping mcp before the inventory and formats checks', () => {
    const mcp: PackSpec = { id: 'blueprint/m', format: 2, directives: ['m'],
      manifest: { formats: { directive: 1, mcp: 1 },
        contents: { fragments: ['mcp'], directives: ['m'] } } };
    resolveFails([...PACKS(), mcp], ['blueprint/m'],
      /blueprint\/m: ships the mcp kind, which no WingFoil release reads yet \(spec-001 §7\.8\)/);
  });
});
