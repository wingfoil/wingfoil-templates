import { strict as assert } from 'node:assert';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { loadCatalog } from '../src/catalog';
import type { Catalog } from '../src/catalog';
import { sortEntries } from '../src/listing';
import { ResolveError, resolve } from '../src/resolve';
import { BASE, KANBAN, withPackTree } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';
import { FIXTURES, REPO_ROOT } from './support/paths';

const CATALOG = loadCatalog(join(REPO_ROOT, 'catalog.yaml'));

function ids(root: string, request: string[], catalog: Catalog = CATALOG): string[] {
  return resolve(root, catalog, request).map((pack) => pack.id);
}

function fails(specs: PackSpec[], request: string[], pattern: RegExp, catalog = CATALOG): void {
  withPackTree(specs, (root) => {
    assert.throws(() => resolve(root, catalog, request), (error: unknown) => {
      assert.ok(error instanceof ResolveError, String(error));
      assert.match(error.message, pattern);
      return true;
    });
  });
}

function passes(specs: PackSpec[], request: string[], expected: string[], catalog = CATALOG): void {
  withPackTree(specs, (root) => assert.deepEqual(ids(root, request, catalog), expected));
}

const WEB: PackSpec = { id: 'blueprint/web', requires: ['base@^1', 'blueprint/api@^1'] };
const API: PackSpec = { id: 'blueprint/api' };

describe('resolve: the complete fixture', () => {
  const full = join(FIXTURES, 'resolve', 'full');
  const order = [
    'base', 'methodology/kanban', 'phase/inception/lean', 'phase/release/semrel',
    'blueprint/api', 'blueprint/cli', 'blueprint/web', 'governance/dogfood',
    'team-mode/agent-first', 'stage/production',
  ];

  it('orders every axis as spec-001 §7.1 says, Kahn within blueprints', () => {
    const request = order.filter((id) => id !== 'base' && id !== 'blueprint/api');
    assert.deepEqual(ids(full, request), order);
  });

  it('places a blueprint after the one it requires, even when its id sorts first (Kahn)', () => {
    passes([BASE, KANBAN, { id: 'blueprint/a', requires: ['base@^1', 'blueprint/z@^1'] },
      { id: 'blueprint/m' }, { id: 'blueprint/z' }],
    ['methodology/kanban', 'blueprint/a', 'blueprint/m'],
    ['base', 'methodology/kanban', 'blueprint/m', 'blueprint/z', 'blueprint/a']);
  });

  it('gives the same order whatever the order of the request', () => {
    const request = order.slice(1);
    const permuted = [5, 2, 8, 0, 7, 3, 1, 6, 4].map((index) => request[index] ?? '');
    assert.deepEqual(ids(full, permuted), order);
  });

  it('returns versions and paths', () => {
    const [base] = resolve(full, CATALOG, ['methodology/kanban']);
    assert.equal(base?.id, 'base');
    assert.equal(base?.version, '1.0.0');
    assert.equal(base?.path, 'packs/base');
    assert.equal(base?.manifest.id, 'base');
  });
});

describe('resolve: requires and conflicts', () => {
  it('adds base and required packs transitively, base once', () => {
    passes([BASE, KANBAN, WEB, API], ['methodology/kanban', 'blueprint/web'],
      ['base', 'methodology/kanban', 'blueprint/api', 'blueprint/web']);
  });

  it('fails on a requested pack missing from the tree', () => {
    fails([BASE, KANBAN], ['methodology/kanban', 'blueprint/web'], /blueprint\/web.*not found/);
  });

  it('fails on a required pack missing from the tree', () => {
    fails([BASE, KANBAN, WEB], ['methodology/kanban', 'blueprint/web'],
      /blueprint\/api.*not found.*required by blueprint\/web/);
  });

  it('reports the same range error whatever the order of the request', () => {
    const errors = [['methodology/kanban@^2', 'methodology/kanban@^3'],
      ['methodology/kanban@^3', 'methodology/kanban@^2']].map((request) => {
      let message = '';
      withPackTree([BASE, KANBAN], (root) => {
        try {
          resolve(root, CATALOG, request);
        } catch (error) {
          message = String(error);
        }
      });
      return message;
    });
    assert.notEqual(errors[0], '');
    assert.equal(errors[0], errors[1]);
  });

  it('refuses a catalog foundation that is not a catalog pack id', () => {
    fails([BASE, KANBAN], ['methodology/kanban'], /foundation/, { ...CATALOG, foundation: '../x' });
  });

  it('fails on a requested range the tree does not satisfy', () => {
    fails([BASE, KANBAN], ['methodology/kanban@^2'], /methodology\/kanban 1\.0\.0.*\^2.*request/);
  });

  it('fails on a required range the tree does not satisfy', () => {
    fails([BASE, KANBAN, { ...WEB, requires: ['base@^1', 'blueprint/api@^2'] }, API],
      ['methodology/kanban', 'blueprint/web'], /blueprint\/api 1\.0\.0.*\^2.*blueprint\/web/);
  });

  it('fails on an empty intersection', () => {
    fails([BASE, KANBAN, { ...WEB, requires: ['base@^1', 'blueprint/api@>=2.0.0 <1.0.0'] }, API],
      ['methodology/kanban', 'blueprint/web'], /blueprint\/api/);
  });

  for (const conflict of ['blueprint/api', 'blueprint/api@^1']) {
    it(`fails on a conflict with a present pack (${conflict})`, () => {
      fails([BASE, KANBAN, API, { id: 'blueprint/cli', conflicts: [conflict] }],
        ['methodology/kanban', 'blueprint/api', 'blueprint/cli'],
        /blueprint\/cli.*conflicts with blueprint\/api/);
    });
  }

  it('passes a conflict whose range the present version does not satisfy', () => {
    passes([BASE, KANBAN, API, { id: 'blueprint/cli', conflicts: ['blueprint/api@^2'] }],
      ['methodology/kanban', 'blueprint/api', 'blueprint/cli'],
      ['base', 'methodology/kanban', 'blueprint/api', 'blueprint/cli']);
  });

  it('passes a conflict with a pack absent from the composition', () => {
    passes([BASE, KANBAN, { id: 'blueprint/cli', conflicts: ['blueprint/api'] }],
      ['methodology/kanban', 'blueprint/cli'], ['base', 'methodology/kanban', 'blueprint/cli']);
  });

  it('fails on a pack that requires itself', () => {
    fails([BASE, KANBAN, { id: 'blueprint/cli', requires: ['base@^1', 'blueprint/cli@^1'] }],
      ['methodology/kanban', 'blueprint/cli'], /blueprint\/cli requires itself/);
  });

  it('fails on a pack that requires one id twice', () => {
    const twice = ['base@^1', 'blueprint/api@^1', 'blueprint/api@^1.2'];
    fails([BASE, KANBAN, API, { ...WEB, requires: twice }],
      ['methodology/kanban', 'blueprint/web'], /blueprint\/web requires blueprint\/api twice/);
  });

  it('fails on a manifest whose id is not its directory', () => {
    const other = { id: 'blueprint/other', name: 'other' };
    fails([BASE, KANBAN, { id: 'blueprint/cli', manifest: other }],
      ['methodology/kanban', 'blueprint/cli'], /packs\/blueprint\/cli.*blueprint\/other/);
  });

  it('fails on a phase manifest whose slot is not the middle of its id', () => {
    fails([BASE, KANBAN, { id: 'phase/inception/lean', workflows: ['inception'],
      manifest: { slot: 'release' } }], ['methodology/kanban', 'phase/inception/lean'],
    /packs\/phase\/inception\/lean\/pack\.yaml:\d+:\d+: \/id pattern/);
  });

  it('fails on a manifest that is not schema-valid, naming its file', () => {
    fails([BASE, KANBAN, { id: 'blueprint/cli', manifest: { version: '1.0' } }],
      ['methodology/kanban', 'blueprint/cli'], /packs\/blueprint\/cli\/pack\.yaml/);
  });
});

describe('resolve: cardinalities and slots', () => {
  it('fails without a methodology', () => {
    fails([BASE, API], ['blueprint/api'], /methodology.*required/);
  });

  it('fails on two methodologies', () => {
    fails([BASE, KANBAN, { id: 'methodology/scrum', workflows: ['delivery'] }],
      ['methodology/kanban', 'methodology/scrum'], /methodology\/kanban.*methodology\/scrum/);
  });

  it('fails on two packs of one phase slot', () => {
    fails([BASE, KANBAN, { id: 'phase/inception/a', workflows: ['inception'] },
      { id: 'phase/inception/b', workflows: ['inception'] }],
    ['methodology/kanban', 'phase/inception/a', 'phase/inception/b'], /slot inception/);
  });

  for (const axis of ['team-mode', 'stage']) {
    it(`fails on two ${axis} packs`, () => {
      fails([BASE, KANBAN, { id: `${axis}/a` }, { id: `${axis}/b` }],
        ['methodology/kanban', `${axis}/a`, `${axis}/b`], new RegExp(`${axis}/a.*${axis}/b`));
    });
  }

  it('passes any number of blueprints and governance packs', () => {
    const many = [{ id: 'blueprint/cli' }, { id: 'governance/a' }, { id: 'governance/b' }];
    passes([BASE, KANBAN, API, ...many],
      ['governance/b', 'blueprint/cli', 'governance/a', 'blueprint/api', 'methodology/kanban'],
      ['base', 'methodology/kanban', 'blueprint/api', 'blueprint/cli', 'governance/a',
        'governance/b']);
  });

  it('fails on a phase pack without its slot workflow', () => {
    fails([BASE, KANBAN, { id: 'phase/release/semrel' }],
      ['methodology/kanban', 'phase/release/semrel'],
      /phase\/release\/semrel.*workflows\/release\.yaml/);
  });

  it('fails on a methodology without delivery', () => {
    fails([BASE, { id: 'methodology/kanban' }], ['methodology/kanban'],
      /methodology\/kanban.*delivery/);
  });

  it('fails on a pack shipping a slot it does not fill', () => {
    fails([BASE, KANBAN, { id: 'blueprint/web', workflows: ['inception'] }],
      ['methodology/kanban', 'blueprint/web'], /blueprint\/web.*slot inception/);
  });

  for (const name of ['sw-life-cycle', 'retrospective']) {
    it(`fails on a pack other than base shipping ${name}`, () => {
      fails([BASE, KANBAN, { id: 'governance/x', workflows: [name] }],
        ['methodology/kanban', 'governance/x'], new RegExp(`governance/x.*${name}`));
    });
  }

  it('fails on a phase pack whose slot the catalog does not list', () => {
    const catalog: Catalog = {
      ...CATALOG,
      axes: CATALOG.axes.map((axis) => (axis.name === 'phase'
        ? { ...axis, slots: ['inception', 'specification', 'end-of-life'] }
        : axis)),
    };
    fails([BASE, KANBAN, { id: 'phase/release/semrel', workflows: ['release'] }],
      ['methodology/kanban', 'phase/release/semrel'],
      /phase\/release\/semrel: slot release is not a slot of axis phase/, catalog);
  });

  it('reads cardinality and required from the catalog', () => {
    const catalog: Catalog = {
      ...CATALOG,
      axes: CATALOG.axes.map((axis) => {
        if (axis.name === 'blueprint') return { ...axis, cardinality: 'one' as const };
        if (axis.name === 'governance') return { ...axis, required: true };
        return axis;
      }),
    };
    fails([BASE, KANBAN, API, { id: 'blueprint/cli' }, { id: 'governance/a' }],
      ['methodology/kanban', 'blueprint/api', 'blueprint/cli', 'governance/a'],
      /blueprint\/api.*blueprint\/cli/, catalog);
    fails([BASE, KANBAN], ['methodology/kanban'], /governance.*required/, catalog);
  });
});

describe('resolve: inventories', () => {
  it('fails on a directory where a listed file is expected', () => {
    fails([BASE, KANBAN, { id: 'blueprint/x', directives: ['d'], omitFiles: ['directives/d.md'],
      extraFiles: { 'directives/d.md/inner': 'x\n' } }], ['methodology/kanban', 'blueprint/x'],
    /blueprint\/x: directives\/d\.md is a directory/);
  });

  const listed: [string, PackSpec][] = [
    ['fragments/dna.yaml', { id: 'blueprint/x', fragments: ['dna'] }],
    ['directives/d.md', { id: 'blueprint/x', directives: ['d'] }],
    ['workflows/w.yaml', { id: 'blueprint/x', workflows: ['w'] }],
    ['memory-templates/t.md', { id: 'blueprint/x', memoryTemplates: ['t'] }],
    ['agents/section.md', { id: 'blueprint/x', agentsSection: true }],
  ];
  for (const [file, spec] of listed) {
    it(`fails on a listed file missing: ${file}`, () => {
      fails([BASE, KANBAN, { ...spec, omitFiles: [file] }], ['methodology/kanban', 'blueprint/x'],
        new RegExp(`blueprint/x.*${file}.*missing`));
    });
    it(`fails on a file present but unlisted: ${file}`, () => {
      fails([BASE, KANBAN, { id: 'blueprint/x', extraFiles: { [file]: 'x\n' } }],
        ['methodology/kanban', 'blueprint/x'], new RegExp(`blueprint/x.*${file}.*not listed`));
    });
  }

  it('fails on fragments out of the order dna, roles, memory', () => {
    fails([BASE, KANBAN, { id: 'blueprint/x', fragments: ['roles', 'dna'] }],
      ['methodology/kanban', 'blueprint/x'], /blueprint\/x.*fragments.*order/);
  });
});

describe('resolve: order', () => {
  it('fails on a requires cycle among blueprints, naming both', () => {
    fails([BASE, KANBAN, { id: 'blueprint/a', requires: ['base@^1', 'blueprint/b@^1'] },
      { id: 'blueprint/b', requires: ['base@^1', 'blueprint/a@^1'] }],
    ['methodology/kanban', 'blueprint/a'], /cycle.*blueprint\/a.*blueprint\/b/);
  });

  const later: [string, PackSpec, PackSpec][] = [
    ['a blueprint requiring a stage', { id: 'blueprint/a', requires: ['base@^1', 'stage/s@^1'] },
      { id: 'stage/s' }],
    ['an inception pack requiring a release pack',
      {
        id: 'phase/inception/a',
        workflows: ['inception'],
        requires: ['base@^1', 'phase/release/b@^1'],
      },
      { id: 'phase/release/b', workflows: ['release'] }],
    ['a team-mode requiring a stage', { id: 'team-mode/a', requires: ['base@^1', 'stage/s@^1'] },
      { id: 'stage/s' }],
  ];
  for (const [name, from, to] of later) {
    it(`fails on ${name}`, () => {
      fails([BASE, KANBAN, from, to], ['methodology/kanban', from.id],
        new RegExp(`${from.id}.*requires ${to.id}.*later`));
    });
  }

  it('passes a stage requiring a team-mode', () => {
    const stage = { id: 'stage/s', requires: ['base@^1', 'team-mode/a@^1'] };
    passes([BASE, KANBAN, stage, { id: 'team-mode/a' }],
      ['methodology/kanban', 'stage/s'], ['base', 'methodology/kanban', 'team-mode/a', 'stage/s']);
  });
});

describe('sortEntries', () => {
  it('orders names by their bytes, whatever the listing order', () => {
    const entries = ['b', 'B', 'a-b', 'a', 'a0'].map((name) => ({ name, isDirectory: false }));
    assert.deepEqual(sortEntries(entries).map((entry) => entry.name), ['B', 'a', 'a-b', 'a0', 'b']);
  });
});
