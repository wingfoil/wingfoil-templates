import { strict as assert } from 'node:assert';
import { execFileSync } from 'node:child_process';
import {
  copyFileSync, mkdirSync, readFileSync, rmSync, symlinkSync, writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { parse, stringify } from 'yaml';

import { runCheckPacks } from '../src/check-packs';
import { loadCatalog } from '../src/catalog';
import { composeDocuments } from '../src/compose-documents';
import type { CheckPacksResult } from '../src/check-packs';
import { FIXTURES, REPO_ROOT } from './support/paths';
import { BASE_COMPOSABLE as BASE, DELIVERY, KANBAN, withPackTree } from './support/pack-tree';
import type { PackSpec } from './support/pack-tree';

/** A tree with the given packs and this repository's catalog.yaml and compat.yaml. */
function lint(specs: PackSpec[], edit: (root: string) => void = () => undefined):
CheckPacksResult {
  let result: CheckPacksResult | undefined;
  withPackTree(specs, (root) => {
    copyFileSync(join(REPO_ROOT, 'catalog.yaml'), join(root, 'catalog.yaml'));
    copyFileSync(join(REPO_ROOT, 'compat.yaml'), join(root, 'compat.yaml'));
    edit(root);
    result = runCheckPacks(root);
  });
  assert.ok(result !== undefined);
  return result;
}

function rules(result: CheckPacksResult): string[] {
  return [...new Set(result.problems.map((problem) => problem.rule))].sort();
}

/** The lint fails the tree with exactly these rules (one, or a sorted list). */
function failsWith(rule: string | string[], specs: PackSpec[], edit?: (root: string) => void):
void {
  const result = lint(specs, edit);
  assert.equal(result.code, 1, result.lines.join('\n'));
  assert.deepEqual(rules(result), typeof rule === 'string' ? [rule] : rule,
    result.lines.join('\n'));
}

const CLEAN = [BASE, KANBAN];

describe('npm run check:packs', () => {
  it('passes a clean tree, counting every file it covers', () => {
    const result = lint(CLEAN);
    assert.equal(result.code, 0, result.lines.join('\n'));
    // catalog, compat, and each pack's pack.yaml, README.md, CHANGELOG.md, workflows, fragments.
    assert.equal(result.lines[0], 'lint: checked 14 files, 0 problems');
  });

  it('passes this repository: two files, no problem (acceptance 13)', () => {
    const result = runCheckPacks(REPO_ROOT);
    assert.deepEqual(result.lines, ['lint: checked 2 files, 0 problems']);
    assert.equal(result.code, 0);
  });

  it('passes the golden tree', () => {
    const result = runCheckPacks(join(FIXTURES, 'compose', 'tree'));
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('reports one sorted line per problem, with the rule id', () => {
    const result = lint([BASE, { ...KANBAN, version: '0.9.0',
      manifest: { requires_capabilities: ['workflow-engine', 'pack-install'] } }]);
    assert.equal(result.code, 1);
    assert.equal(result.lines[0], 'lint: checked 14 files, 2 problems');
    assert.deepEqual(result.lines.slice(1).map((line) => line.replace(/:\d+:\d+:/, ':L:C:')), [
      'packs/methodology/kanban/pack.yaml:L:C: capabilities-sorted: methodology/kanban: '
        + 'requires_capabilities must be sorted and unique',
      'packs/methodology/kanban/pack.yaml:L:C: pack-version: methodology/kanban: version 0.9.0 '
        + 'must be 1.0.0 or later (spec-001 §4)',
    ]);
  });

  it('skips a pack whose pack.yaml fails its schema: that is the schema check\'s', () => {
    const result = lint([BASE, { ...KANBAN, manifest: { version: 'one' } }]);
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('exits 2 on a tree that does not exist', () => {
    assert.equal(runCheckPacks(join(REPO_ROOT, 'no-such-tree')).code, 2);
  });

  it('exits 3 on bad usage, from the command line', () => {
    let status = 0;
    try {
      execFileSync(process.execPath, [join(REPO_ROOT, 'dist', 'src', 'check-packs-cli.js'),
        '--unknown'], { stdio: 'pipe' });
    } catch (error) {
      status = (error as { status: number }).status;
    }
    assert.equal(status, 3);
  });
});

describe('pack.yaml rules', () => {
  it('pack-id: the directory names another id (and so repeats a name)', () => {
    failsWith(['pack-id', 'pack-name-unique'], CLEAN, (root) => {
      mkdirSync(join(root, 'packs', 'methodology', 'scrum'), { recursive: true });
      for (const file of ['pack.yaml', 'README.md', 'CHANGELOG.md']) {
        copyFileSync(join(root, 'packs', 'methodology', 'kanban', file),
          join(root, 'packs', 'methodology', 'scrum', file));
      }
      mkdirSync(join(root, 'packs', 'methodology', 'scrum', 'workflows'));
      copyFileSync(join(root, 'packs', 'methodology', 'kanban', 'workflows', 'delivery.yaml'),
        join(root, 'packs', 'methodology', 'scrum', 'workflows', 'delivery.yaml'));
    });
  });

  it('pack-version: below 1.0.0', () => {
    failsWith('pack-version', [BASE, { ...KANBAN, version: '0.3.0' }]);
  });

  it('requires-self and requires-twice', () => {
    failsWith('requires-self', [BASE, { ...KANBAN, requires: ['base@^1', 'methodology/kanban@^1'] }]);
    failsWith('requires-twice', [BASE, { id: 'blueprint/api' }, { ...KANBAN,
      requires: ['base@^1', 'blueprint/api@^1', 'blueprint/api@^1.2'] }]);
  });

  it('conflicts-self', () => {
    failsWith('conflicts-self', [BASE, { ...KANBAN, conflicts: ['methodology/kanban'] }]);
  });

  it('capabilities-sorted', () => {
    failsWith('capabilities-sorted', [BASE, { ...KANBAN,
      manifest: { requires_capabilities: ['workflow-engine', 'pack-install'] } }]);
    assert.equal(lint([BASE, { ...KANBAN,
      manifest: { requires_capabilities: ['pack-install', 'workflow-engine'] } }]).code, 0);
  });
});

describe('inventory and formats rules', () => {
  it('fragment-order', () => {
    failsWith('fragment-order', [BASE, { ...KANBAN, fragments: ['memory', 'roles'] }]);
  });

  it('contents: a listed file missing, a present file unlisted', () => {
    failsWith('contents', [BASE, { ...KANBAN, omitFiles: ['workflows/delivery.yaml'] }]);
    failsWith('contents', [BASE, { ...KANBAN,
      extraFiles: { 'workflows/extra.yaml': 'format: 1\nname: extra\nkind: sub\n' } }]);
  });

  it('formats: a declared kind the pack does not ship, a file of another format', () => {
    failsWith('formats', [BASE, { ...KANBAN, manifest: { formats: { workflow: 1, dna: 1 } } }]);
    failsWith('formats', [BASE, { ...KANBAN,
      extraFiles: { 'workflows/delivery.yaml': DELIVERY.replace('format: 1', 'format: 2') } }]);
    failsWith(['formats', 'integer'], [BASE, { ...KANBAN,
      extraFiles: { 'workflows/delivery.yaml': DELIVERY.replace('format: 1', 'format: 1.0') } }]);
  });

  it('asset-id: an identifier other than the file stem', () => {
    failsWith('asset-id', [BASE, { ...KANBAN, directives: ['wip'],
      extraFiles: { 'directives/wip.md': '---\nid: limits\nformat: 1\n---\n# wip\n' } }]);
  });

  it('parse: a file that is not YAML', () => {
    failsWith('parse', [BASE, { ...KANBAN,
      extraFiles: { 'workflows/delivery.yaml': 'format: 1\nname: [delivery\n' } }]);
  });
});

describe('slot rules', () => {
  it('slot: a methodology without delivery, a pack shipping a slot it does not fill', () => {
    failsWith('slot', [BASE, { ...KANBAN, workflows: ['flow'] }]);
    failsWith('slot', [BASE, KANBAN, { id: 'blueprint/web', workflows: ['release'] }]);
  });

  it('slot: a slot workflow that is not kind: sub', () => {
    failsWith('slot', [BASE, { ...KANBAN,
      extraFiles: { 'workflows/delivery.yaml': DELIVERY.replace('kind: sub', 'kind: main') } }]);
  });

  it('base-only', () => {
    failsWith('base-only', [BASE, KANBAN, { id: 'blueprint/web', workflows: ['retrospective'] }]);
  });
});

describe('parameter rules', () => {
  const declares = (parameters: Record<string, unknown>): PackSpec => ({
    ...KANBAN, manifest: { parameters } });

  it('parameter-default: an integer default not written as a base-10 integer', () => {
    // A default of the wrong type is the schema's (pack.schema.json types the defaults).
    failsWith(['integer', 'parameter-default'], [BASE, { ...declares({
      wip: { type: 'integer', default: 3, description: 'x' } }) }], (root) => {
      const file = join(root, 'packs', 'methodology', 'kanban', 'pack.yaml');
      execFileSync('sed', ['-i', 's/default: 3/default: 3.0/', file]);
    });
  });

  it('parameter-scope: a reference outside the pack and its requires', () => {
    failsWith('parameter-scope', [BASE, { ...KANBAN,
      extraFiles: { 'workflows/delivery.yaml': `${DELIVERY}description: "{{wip}}"\n` } }]);
    const base = { ...BASE, manifest: { parameters: {
      wip: { type: 'integer', default: 2, description: 'x' } } } };
    assert.equal(lint([base, { ...KANBAN, extraFiles: { 'workflows/delivery.yaml':
      `${DELIVERY}limit: {{wip}}\n` } }]).code, 0,
    'a parameter of a required pack is in scope (spec-001 §8.1)');
  });
});

describe('layout rules', () => {
  const kanban = (root: string, ...path: string[]): string =>
    join(root, 'packs', 'methodology', 'kanban', ...path);

  it('layout: README.md missing, a file outside §6.1, a directory in an inventory folder', () => {
    failsWith('layout', CLEAN, (root) => rmSync(kanban(root, 'README.md')));
    failsWith('layout', CLEAN, (root) => writeFileSync(kanban(root, 'notes.txt'), 'x'));
    failsWith('layout', CLEAN, (root) => mkdirSync(kanban(root, 'workflows', 'old')));
  });

  it('layout: a file outside every pack directory, and packs/pack.yaml', () => {
    failsWith('layout', CLEAN, (root) => writeFileSync(join(root, 'packs', 'methodology',
      'README.md'), 'x'));
    failsWith('layout', CLEAN, (root) => writeFileSync(join(root, 'packs', 'pack.yaml'), 'x'));
  });

  it('layout: a path segment out of the grammar', () => {
    failsWith('layout', CLEAN, (root) => writeFileSync(kanban(root, '.hidden'), 'x'));
  });

  it('symlink: a link anywhere in a pack, never followed', () => {
    failsWith('symlink', CLEAN, (root) => symlinkSync(kanban(root, 'README.md'),
      kanban(root, 'NOTES.md')));
    failsWith('symlink', CLEAN, (root) => symlinkSync(join(root, 'packs', 'methodology'),
      join(root, 'packs', 'mirror')));
  });

  it('submodule: a .git entry inside packs/', () => {
    failsWith('submodule', CLEAN, (root) => writeFileSync(kanban(root, '.git'),
      'gitdir: ../.git/modules/x\n'));
  });
});

type Doc = Record<string, unknown>;

/** Edits the tree's catalog.yaml as data. */
function catalog(root: string, edit: (data: Doc) => void): void {
  const file = join(root, 'catalog.yaml');
  const data = parse(readFileSync(file, 'utf8')) as Doc;
  edit(data);
  writeFileSync(file, stringify(data));
}

const SHA = '0123456789abcdef0123456789abcdef01234567';
const DIGEST = `sha256:${'a'.repeat(64)}`;

function version(v: string, extra: Doc = {}): Doc {
  return { version: v, commit: SHA, digest: DIGEST, formats: {}, requires_capabilities: [],
    requires: [], conflicts: [], wingfoil: '0.2.2', ...extra };
}

function entry(id: string, versions: Doc[], extra: Doc = {}): Doc {
  return { id, path: `packs/${id}`, catalog: 'official', status: 'active', versions, ...extra };
}

function write(root: string, file: string, text: string): void {
  mkdirSync(join(root, file, '..'), { recursive: true });
  writeFileSync(join(root, file), text);
}

const GOLDEN_PRESET = 'format: 1\nid: small\ntitle: "Small"\ndescription: "Kanban."\n'
  + 'packs:\n  - methodology/kanban@^1\n';

const TRANSITION = (id: string, from: string, to: string): string => [
  'format: 1', `id: ${id}`, `from: ${from}`, `to: ${to}`, 'formats: {}',
  'requires_capabilities: [stage-transitions]', 'pre_checks: []',
  'actions:', '  - { id: swap-stage-overlay, description: "Swap the stage overlay." }', '']
  .join('\n');

describe('YAML rules, every file', () => {
  it('integer: a value written 2.0 in compat.yaml, a preset, a fragment', () => {
    failsWith('integer', CLEAN, (root) => {
      const file = join(root, 'compat.yaml');
      writeFileSync(file, readFileSync(file, 'utf8').replace('dna: [1]', 'dna: [1.0]'));
    });
    failsWith('integer', [BASE, { ...KANBAN, fragments: ['roles'],
      extraFiles: { 'fragments/roles.yaml': 'format: 1\nlimits: { wip: 2.0 }\n' } }]);
  });

  it('integer: leaves non-integer numbers and strings alone', () => {
    assert.equal(lint([BASE, { ...KANBAN, fragments: ['roles'],
      extraFiles: { 'fragments/roles.yaml': 'format: 1\nratio: 1.5\nlabel: "2.0"\n' } }]).code,
    0);
  });

  it('nan: .nan or .inf anywhere', () => {
    failsWith('nan', [BASE, { ...KANBAN, fragments: ['roles'],
      extraFiles: { 'fragments/roles.yaml': 'format: 1\nlimits: [.nan, .inf]\n' } }]);
  });
});

describe('catalog.yaml rules (no tag)', () => {
  it('catalog-path and catalog-id', () => {
    failsWith('catalog-path', CLEAN, (root) => catalog(root, (data) => {
      data['packs'] = [{ ...entry('methodology/kanban', [version('1.0.0')]),
        path: 'packs/methodology/scrum' }];
    }));
    failsWith('catalog-id', CLEAN, (root) => catalog(root, (data) => {
      data['packs'] = [entry('base', [version('1.0.0')]), entry('base', [version('1.0.0')])];
    }));
  });

  it('catalog-versions: ascending, no repeat', () => {
    failsWith('catalog-versions', CLEAN, (root) => catalog(root, (data) => {
      data['packs'] = [entry('base', [version('1.1.0'), version('1.0.0')])];
    }));
    failsWith('catalog-versions', CLEAN, (root) => catalog(root, (data) => {
      data['packs'] = [entry('base', [version('1.0.0'), version('1.0.0')])];
    }));
  });

  it('catalog-transitions: only on a stage pack\'s versions', () => {
    failsWith('catalog-transitions', CLEAN, (root) => catalog(root, (data) => {
      data['packs'] = [entry('base', [version('1.0.0',
        { transitions: { 'mvp-to-production': DIGEST } })])];
    }));
  });

  it('catalog-index: a preset or transition entry that does not match its file', () => {
    failsWith('catalog-index', CLEAN, (root) => catalog(root, (data) => {
      data['presets'] = [{ id: 'small', path: 'presets/small.yaml' }];
    }));
    failsWith('catalog-index', CLEAN, (root) => {
      write(root, 'presets/small.yaml', GOLDEN_PRESET);
      catalog(root, (data) => { data['presets'] = [{ id: 'small', path: 'presets/tiny.yaml' }]; });
    });
    failsWith('catalog-index', CLEAN, (root) => {
      write(root, 'transitions/mvp-to-production.yaml',
        TRANSITION('mvp-to-production', 'stage/mvp', 'stage/production'));
      catalog(root, (data) => {
        data['packs'] = [entry('stage/mvp', [version('1.0.0')]),
          entry('stage/production', [version('1.0.0')])];
        data['transitions'] = [{ id: 'mvp-to-production',
          path: 'transitions/mvp-to-production.yaml', from: 'stage/mvp', to: 'stage/production',
          formats: {}, requires_capabilities: [] }];
      });
    });
  });
});

describe('compat.yaml rules', () => {
  it('compat: a release out of order, a capability outside the vocabulary', () => {
    failsWith('compat', CLEAN, (root) => {
      const file = join(root, 'compat.yaml');
      writeFileSync(file, readFileSync(file, 'utf8').replace('capabilities: []',
        'capabilities: [time-travel]'));
    });
  });
});

describe('preset rules', () => {
  it('passes a preset that resolves', () => {
    const result = lint(CLEAN, (root) => write(root, 'presets/small.yaml', GOLDEN_PRESET));
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('preset-name: an id other than the file name', () => {
    failsWith('preset-name', CLEAN, (root) => write(root, 'presets/tiny.yaml', GOLDEN_PRESET));
  });

  it('preset-cardinality: two methodologies, or a pack the tree does not hold', () => {
    failsWith('preset-cardinality', [...CLEAN, { id: 'methodology/scrum', workflows: ['delivery'] }],
      (root) => write(root, 'presets/small.yaml',
        `${GOLDEN_PRESET}  - methodology/scrum@^1\n`));
    failsWith('preset-cardinality', CLEAN, (root) => write(root, 'presets/small.yaml',
      `${GOLDEN_PRESET}  - blueprint/web@^1\n`));
  });

  it('preset-value: a value of the wrong YAML type, or a parameter nobody declares', () => {
    const declaring = { ...KANBAN, manifest: { parameters: {
      wip: { type: 'integer', default: 2, description: 'x' } } } };
    failsWith('preset-value', [BASE, declaring], (root) => write(root, 'presets/small.yaml',
      `${GOLDEN_PRESET}parameters:\n  wip: "3"\n`));
    failsWith('preset-value', [BASE, declaring], (root) => write(root, 'presets/small.yaml',
      `${GOLDEN_PRESET}parameters:\n  colour: red\n`));
    assert.equal(lint([BASE, declaring], (root) => write(root, 'presets/small.yaml',
      `${GOLDEN_PRESET}parameters:\n  wip: 3\n`)).code, 0);
  });

  it('preset-directory: presets/<x>.yaml as a directory is reported', () => {
    failsWith('preset-directory', CLEAN, (root) => mkdirSync(join(root, 'presets', 'odd.yaml'),
      { recursive: true }));
  });
});

describe('transition rules', () => {
  const stages = (root: string): void => catalog(root, (data) => {
    data['packs'] = [entry('stage/mvp', [version('1.0.0')]),
      entry('stage/production', [version('1.0.0')])];
  });

  it('passes a transition between two stage packs of the catalog', () => {
    const result = lint(CLEAN, (root) => {
      stages(root);
      write(root, 'transitions/mvp-to-production.yaml',
        TRANSITION('mvp-to-production', 'stage/mvp', 'stage/production'));
    });
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('transition-name and transition-id', () => {
    failsWith('transition-name', CLEAN, (root) => {
      stages(root);
      write(root, 'transitions/mvp-to-prod.yaml',
        TRANSITION('mvp-to-production', 'stage/mvp', 'stage/production'));
    });
    failsWith('transition-id', CLEAN, (root) => {
      stages(root);
      write(root, 'transitions/mvp-to-live.yaml',
        TRANSITION('mvp-to-live', 'stage/mvp', 'stage/production'));
    });
  });

  it('transition-stages: from equals to, or a stage the catalog does not list', () => {
    failsWith('transition-stages', CLEAN, (root) => {
      stages(root);
      write(root, 'transitions/mvp-to-mvp.yaml', TRANSITION('mvp-to-mvp', 'stage/mvp',
        'stage/mvp'));
    });
    failsWith('transition-stages', CLEAN, (root) => {
      stages(root);
      write(root, 'transitions/mvp-to-sunset.yaml', TRANSITION('mvp-to-sunset', 'stage/mvp',
        'stage/sunset'));
    });
  });
});

describe('pack-name-unique', () => {
  it('two packs of the tree, or a tree pack and a catalog pack, with one name', () => {
    failsWith('pack-name-unique', [...CLEAN, { id: 'blueprint/kanban' }]);
    failsWith('pack-name-unique', [...CLEAN, { id: 'blueprint/web' }], (root) =>
      catalog(root, (data) => { data['packs'] = [entry('governance/web', [version('1.0.0')])]; }));
  });
});

/** KANBAN with one more workflow, written as given. */
function withWorkflow(name: string, text: string, extra: Partial<PackSpec> = {}): PackSpec {
  return { ...KANBAN, ...extra, workflows: ['delivery', name],
    extraFiles: { [`workflows/${name}.yaml`]: text, ...extra.extraFiles } };
}

const FLOW = (phases: string, head = ''): string =>
  `format: 1\nname: flow\nkind: sub\n${head}phases:\n${phases}`;

describe('F3.5 workflow rules', () => {
  it('passes phases that declare include, actions or produces', () => {
    const result = lint([BASE, withWorkflow('flow', FLOW('  - { name: a, actions: [memory.submit] }\n'
      + '  - { name: b, produces: [docs/b.md] }\n  - { name: c, include: retrospective }\n'))]);
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('empty-phase: a phase that declares none of include, actions and produces', () => {
    failsWith('empty-phase', [BASE, withWorkflow('flow', FLOW('  - { name: a, description: x }\n'))]);
  });

  it('include: a path, a file name, or a workflow neither shipped nor a slot', () => {
    failsWith('include', [BASE, withWorkflow('flow',
      FLOW('  - { name: a, include: workflows/built-in/retrospective.yaml }\n'))]);
    failsWith('include', [BASE, withWorkflow('flow', FLOW('  - { name: a, include: hotfix }\n'))]);
  });

  it('include: a workflow of a pack that is required only transitively is not enough', () => {
    const api = { id: 'blueprint/api', workflows: ['api-review'] };
    const web = { id: 'blueprint/web', requires: ['base@^1', 'blueprint/api@^1'] };
    const cli = { id: 'blueprint/cli', requires: ['base@^1', 'blueprint/web@^1'],
      workflows: ['ship'], extraFiles: { 'workflows/ship.yaml': 'format: 1\nname: ship\n'
        + 'kind: sub\nphases:\n  - { name: a, include: api-review }\n' } };
    failsWith('include', [BASE, KANBAN, api, web, cli]);
  });

  it('life-cycle-includes: base\'s sw-life-cycle and a methodology\'s delivery (§9)', () => {
    failsWith('life-cycle-includes', [{ ...BASE, extraFiles: { ...BASE.extraFiles,
      'workflows/sw-life-cycle.yaml': 'format: 1\nname: sw-life-cycle\nkind: main\nphases:\n'
        + '  - { name: delivery, include: delivery }\n' } }, KANBAN]);
    failsWith('life-cycle-includes', [BASE, { ...KANBAN, extraFiles: {
      'workflows/delivery.yaml': DELIVERY.replace(/ {2}- \{ name: retrospective[^\n]*\n/, '') } }]);
  });

  it('role: a phase role or approval.by_role not in team.roles', () => {
    const dna = 'format: 1\nproject:\n  name: test\nteam:\n  roles:\n    - { name: approver }\n';
    const base = { ...BASE, extraFiles: { ...BASE.extraFiles, 'fragments/dna.yaml': dna } };
    assert.equal(lint([base, withWorkflow('flow', FLOW('  - { name: a, produces: [x.md], '
      + 'approval: { by_role: approver } }\n'))]).code, 0);
    failsWith('role', [base, withWorkflow('flow',
      FLOW('  - { name: a, produces: [x.md], role: developer }\n'))]);
    failsWith('role', [base, withWorkflow('flow',
      FLOW('  - { name: a, produces: [x.md], approval: { by_role: owner } }\n'))]);
  });

  it('memory-type: an element or iterate_over that no memory fragment declares', () => {
    failsWith('memory-type', [BASE, withWorkflow('flow',
      FLOW('  - { name: a, produces: [x.md] }\n', 'element: ticket\n'))]);
    failsWith('memory-type', [BASE, withWorkflow('flow',
      FLOW('  - { name: a, iterate_over: ticket, include: retrospective }\n'))]);
  });

  it('directive: a roles fragment naming a directive nobody ships', () => {
    failsWith('directive', [BASE, { ...KANBAN, fragments: ['roles'],
      extraFiles: { 'fragments/roles.yaml': 'format: 1\nassignments:\n  developer: [tdd]\n' } }]);
    assert.equal(lint([BASE, { ...KANBAN, fragments: ['roles'], directives: ['tdd'],
      extraFiles: { 'fragments/roles.yaml': 'format: 1\nassignments:\n  developer: [tdd]\n' } }])
      .code, 0);
  });

  it('the composer refuses what these rules reject (spec-001 §17, §18)', () => {
    withPackTree([BASE, withWorkflow('flow', FLOW('  - { name: a, description: x }\n'))],
      (root) => {
        copyFileSync(join(REPO_ROOT, 'catalog.yaml'), join(root, 'catalog.yaml'));
        assert.throws(() => composeDocuments(root, loadCatalog(join(root, 'catalog.yaml')),
          ['methodology/kanban'], {}), /declares none of include, actions and produces/);
      });
  });
});

describe('F3.5 overlays and lone packs', () => {
  const directive = (id: string): Partial<PackSpec> => ({ directives: [id],
    extraFiles: { [`directives/${id}.md`]: `---\nid: ${id}\nformat: 1\n---\n# ${id}\n` } });
  const overlay = (id: string, extra: Partial<PackSpec> = {}): PackSpec => ({ id, ...extra });

  it('passes overlays that compose with every methodology', () => {
    const result = lint([BASE, KANBAN, overlay('team-mode/solo'), overlay('stage/mvp')]);
    assert.equal(result.code, 0, result.lines.join('\n'));
  });

  it('overlay: a team-mode and a stage that ship one directive (spec-001 §7.6)', () => {
    const result = lint([BASE, KANBAN, overlay('team-mode/solo', directive('review')),
      overlay('stage/mvp', directive('review'))]);
    assert.equal(result.code, 1, result.lines.join('\n'));
    assert.deepEqual(rules(result), ['overlay']);
    assert.ok(result.lines.some((line) => line.includes(
      'base + methodology/kanban + team-mode/solo + stage/mvp:')), result.lines.join('\n'));
  });

  it('compose: a pack no combination reaches is composed with base and a methodology', () => {
    failsWith('compose', [BASE, KANBAN, { id: 'blueprint/web', ...directive('security') }]);
  });
});
