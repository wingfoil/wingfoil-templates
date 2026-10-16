import { strict as assert } from 'node:assert';
import { cpSync, mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import { parse, stringify } from 'yaml';

import { axisAndSlot, buildIndex, excerptOf } from '../src/index-model';
import { renderCatalog } from '../src/index-render';
import type { CatalogIndex, IndexPack } from '../src/index-model';
import { IndexError } from '../src/index-source';
import type { TestRepo } from './support/git-repo';
import { indexCatalog } from './support/index-catalog';
import { conformingReadme } from './support/readme';

type Doc = Record<string, unknown>;

const RAW = 'https://raw.githubusercontent.com/wingfoil/wingfoil-templates';

function withSection2(text: string): string {
  return conformingReadme({ id: 'base', title: 'base', description: 'Base.' })
    .replace('A test fixture of the tooling; never adopted.\n', text);
}

describe('axisAndSlot', () => {
  it('derives null axis and slot for base, a slot only for a phase pack', () => {
    const foundation = ['base', 'software'];
    assert.deepEqual(axisAndSlot('base', foundation), { axis: null, slot: null });
    assert.deepEqual(axisAndSlot('software', foundation), { axis: null, slot: null });
    assert.deepEqual(axisAndSlot('methodology/kanban', foundation),
      { axis: 'methodology', slot: null });
    assert.deepEqual(axisAndSlot('phase/inception/lean', foundation),
      { axis: 'phase', slot: 'inception' });
  });
});

describe('excerptOf (acceptance 7)', () => {
  it('takes the first paragraph of section 2, its lines joined by one space', () => {
    assert.equal(excerptOf(withSection2('First line,\nsecond `line`.\n\nNext paragraph.\n')),
      'First line, second `line`.');
  });

  it('skips a list, a quote and code before the first paragraph', () => {
    assert.equal(excerptOf(withSection2('- item\n\n> quote\n\n    code\n\nThe paragraph.\n')),
      'The paragraph.');
  });

  it('is empty without a paragraph in section 2, or without a README', () => {
    assert.equal(excerptOf(withSection2('- only a list\n')), '');
    assert.equal(excerptOf(undefined), '');
  });

  it('cuts above 500 code points at the last whitespace, dropping it, and ends with …', () => {
    const words = Array.from({ length: 120 }, (_, i) => `w${i % 10}xy`).join(' ');
    // 120 words of 4 code points and their spaces: the last whitespace before point 500 is
    // point 495 (index 494), so 494 points are kept and `…` makes 495.
    const excerpt = excerptOf(withSection2(`${words}\n`));
    assert.equal(Array.from(excerpt).length, 495);
    assert.equal(excerpt, `${words.slice(0, 494)}…`);
  });

  it('keeps exactly 500 code points uncut', () => {
    const text = `${'a'.repeat(250)} ${'b'.repeat(249)}`;
    assert.equal(excerptOf(withSection2(`${text}\n`)), text);
  });

  it('ends a paragraph at a thematic break or a table line', () => {
    assert.equal(excerptOf(withSection2('Para one\n***\nnext\n')), 'Para one');
    assert.equal(excerptOf(withSection2('Para one\n| a | b |\n')), 'Para one');
  });

  it('cuts hard at 499 code points when there is no whitespace, counting code points', () => {
    const excerpt = excerptOf(withSection2(`${'é'.repeat(300)}${'😀'.repeat(300)}\n`));
    assert.equal(Array.from(excerpt).length, 500);
    assert.equal(Array.from(excerpt)[499], '…');
  });
});

describe('buildIndex on the fixture catalog (CB-4)', () => {
  let repo: TestRepo;
  let index: CatalogIndex;
  before(() => {
    repo = indexCatalog();
    index = buildIndex(repo.dir);
  });
  after(() => repo.dispose());

  const pack = (id: string): IndexPack => {
    const found = index.packs.find((entry) => entry.id === id);
    assert.ok(found !== undefined, id);
    return found;
  };

  it('has the top-level keys of §3.3, in order, and format 1', () => {
    assert.deepEqual(Object.keys(index),
      ['format', 'repository', 'install', 'packs', 'presets', 'transitions']);
    assert.equal(index.format, 1);
    assert.equal(index.repository, 'wingfoil/wingfoil-templates');
    assert.deepEqual(index.install, []);
  });

  it('lists the published packs in byte order, and no unpublished one', () => {
    assert.deepEqual(index.packs.map((entry) => entry.id), ['base', 'governance/notes',
      'methodology/flow', 'methodology/kanban', 'phase/inception/lean', 'software', 'stage/mvp',
      'stage/production']);
  });

  it('builds pack and version objects in the key order of §3.3', () => {
    const kanban = pack('methodology/kanban');
    assert.deepEqual(Object.keys(kanban), ['id', 'catalog', 'status', 'axis', 'slot', 'latest',
      'versions', 'title', 'description', 'workflows', 'conditional_workflows', 'memory_types',
      'directives', 'conditional_directives', 'parameters', 'excerpt', 'profiles']);
    assert.deepEqual(Object.keys(pack('methodology/flow').versions[0] ?? {}), ['version', 'tag',
      'wingfoil', 'formats', 'requires_capabilities', 'requires', 'conflicts', 'conditional',
      'readme_url', 'manifest_url']);
    assert.deepEqual(Object.keys(kanban.versions[0] ?? {}), ['version', 'tag', 'wingfoil',
      'formats', 'requires_capabilities', 'requires', 'conflicts', 'readme_url',
      'manifest_url']);
    assert.deepEqual(Object.keys(kanban.parameters[0] ?? {}),
      ['name', 'type', 'default', 'description']);
  });

  it('reads per-version fields at each tag', () => {
    const kanban = pack('methodology/kanban');
    assert.deepEqual(kanban.versions.map((version) => [version.version, version.tag,
      version.requires, version.conflicts]), [
      ['1.0.0', 'methodology/kanban@1.0.0', ['base@^1', 'software@^1'], []],
      ['1.1.0', 'methodology/kanban@1.1.0', ['base@^1.0.0', 'software@^1'], ['blueprint/web']]]);
    assert.equal(kanban.versions[1]?.readme_url,
      `${RAW}/refs/tags/methodology/kanban@1.1.0/packs/methodology/kanban/README.md`);
    assert.equal(kanban.versions[1]?.manifest_url,
      `${RAW}/refs/tags/methodology/kanban@1.1.0/packs/methodology/kanban/pack.yaml`);
  });

  it('reads latest-version fields at the latest tag, not in the working tree', () => {
    const kanban = pack('methodology/kanban');
    assert.equal(kanban.latest, '1.1.0');
    assert.equal(kanban.title, 'Kanban flow');
    assert.deepEqual(kanban.parameters, [{ name: 'wip_limit', type: 'integer', default: 3,
      description: 'The WIP limit.' }]);
    assert.equal(kanban.excerpt,
      'A team that pulls work through a board with WIP limits, and limits its flow.');
    assert.deepEqual(kanban.workflows, ['delivery']);
  });

  it('carries a conditional part apart from what is always composed (plan-039 R3)', () => {
    const flow = pack('methodology/flow');
    assert.deepEqual(flow.versions[0]?.conditional, [{ with: 'software@^1' }]);
    assert.deepEqual([flow.workflows, flow.conditional_workflows, flow.directives,
      flow.conditional_directives], [['flow-board'], ['delivery', 'flow-delivery'], [],
      ['flow-limits']]);
    const notes = pack('governance/notes');
    assert.deepEqual([notes.conditional_workflows, notes.conditional_directives],
      [[], ['notes-rules']]);
    const kanban = pack('methodology/kanban');
    assert.ok(!Object.hasOwn(kanban.versions[0] ?? {}, 'conditional'));
    assert.deepEqual([kanban.conditional_workflows, kanban.conditional_directives], [[], []]);
  });

  it('marks the Summary of a pack with a conditional part (plan-039 R3)', () => {
    const text = renderCatalog(index, ['methodology', 'phase', 'blueprint', 'governance',
      'team-mode', 'stage'], ['base', 'software']);
    const row = (id: string): string =>
      text.split('\n').find((line) => line.includes(`\`${id}\` |`)) ?? '';
    assert.ok(row('methodology/flow').includes(
      '(`delivery`, `flow-delivery` only with `software`) |'), row('methodology/flow'));
    assert.ok(row('governance/notes').includes('(`notes-rules` only with `software`) |'),
      row('governance/notes'));
    assert.ok(!row('methodology/kanban').includes('only with'));
  });

  it('writes the foundation section in catalog.yaml\'s order, each row anchored (§3.2)', () => {
    const AXES = ['methodology', 'phase', 'blueprint', 'governance', 'team-mode', 'stage'];
    const section = (foundation: string[]): string[] => {
      const lines = renderCatalog(index, AXES, foundation).split('\n');
      const start = lines.indexOf('## Foundation');
      return lines.slice(start, lines.indexOf('## Methodology')).filter((line) =>
        line.startsWith('| <a id='));
    };
    const rows = section(['base', 'software']);
    assert.equal(rows.length, 2);
    assert.ok(rows[0]?.startsWith('| <a id="pack-base"></a>`base` |'), rows[0]);
    assert.ok(rows[1]?.startsWith('| <a id="pack-software"></a>`software` |'), rows[1]);
    assert.ok(rows[1]?.includes('/blob/software@1.0.0/packs/software/README.md'), rows[1]);
    // The order is catalog.yaml's, not the ids' byte order.
    assert.ok(section(['software', 'base'])[0]?.includes('`software`'));
  });

  it('derives axis and slot, and the profiles of the presets naming the pack', () => {
    assert.deepEqual([pack('base').axis, pack('base').slot], [null, null]);
    assert.deepEqual([pack('software').axis, pack('software').slot], [null, null]);
    assert.deepEqual([pack('phase/inception/lean').axis, pack('phase/inception/lean').slot],
      ['phase', 'inception']);
    assert.deepEqual(pack('methodology/kanban').profiles, ['small teams']);
    assert.deepEqual(pack('phase/inception/lean').profiles, ['small teams']);
    assert.deepEqual(pack('base').profiles, []);
    assert.deepEqual(pack('base').memory_types, []);
  });

  it('lists presets from their files, profile null when absent, packs as written', () => {
    assert.deepEqual(index.presets.map((preset) => [preset.id, preset.profile, preset.packs]), [
      ['minimal', null, ['methodology/kanban@^1']],
      ['small-team', 'small teams', ['methodology/kanban@^1', 'phase/inception/lean@^1']]]);
    assert.equal(index.presets[0]?.url, `${RAW}/main/presets/minimal.yaml`);
    assert.deepEqual(Object.keys(index.presets[0] ?? {}),
      ['id', 'title', 'description', 'profile', 'packs', 'url']);
  });

  it('lists transitions from their catalog entries', () => {
    assert.deepEqual(index.transitions, [{ id: 'mvp-to-production', from: 'stage/mvp',
      to: 'stage/production', formats: {}, requires_capabilities: [],
      url: `${RAW}/main/transitions/mvp-to-production.yaml` }]);
  });

  it('holds no date, commit or digest', () => {
    const text = JSON.stringify(index);
    assert.doesNotMatch(text, /"(commit|digest|date)"/);
    assert.doesNotMatch(text, /[0-9a-f]{40}|sha256:/);
  });

  it('keeps the tag\'s values when catalog.yaml is altered after the publication', () => {
    const file = join(repo.dir, 'catalog.yaml');
    const original = readFileSync(file, 'utf8');
    try {
      const catalog = parse(original) as Doc;
      const kanban = (catalog['packs'] as Doc[]).find((entry) =>
        entry['id'] === 'methodology/kanban');
      ((kanban?.['versions'] as Doc[])[1] as Doc)['requires'] = ['base@^1'];
      writeFileSync(file, stringify(catalog));
      assert.deepEqual(buildIndex(repo.dir).packs.find((entry) => entry.id === 'methodology/kanban')
        ?.versions[1]?.requires, ['base@^1.0.0',
        'software@^1']);
    } finally {
      writeFileSync(file, original);
    }
  });

  it('fails on a tag that catalog.yaml names and the repository lacks', () => {
    const commit = repo.git(['rev-list', '-n', '1', 'stage/mvp@1.0.0']).trim();
    repo.git(['tag', '-d', 'stage/mvp@1.0.0']);
    try {
      assert.throws(() => buildIndex(repo.dir), (error: unknown) => error instanceof IndexError
        && /tag stage\/mvp@1\.0\.0/.test(error.message));
    } finally {
      repo.git(['tag', '-a', 'stage/mvp@1.0.0', '-m', 'stage/mvp@1.0.0', commit]);
    }
  });

  it('fails on a tree with published versions below the top level of its repository', () => {
    const nested = join(repo.dir, 'nested');
    cpSync(join(repo.dir, 'catalog.yaml'), join(nested, 'catalog.yaml'));
    try {
      assert.throws(() => buildIndex(nested), (error: unknown) => error instanceof IndexError
        && /not the top level/.test(error.message));
    } finally {
      rmSync(nested, { recursive: true, force: true });
    }
  });

  it('fails on a tree with published versions that is not a git repository', () => {
    const dir = mkdtempSync(join(tmpdir(), 'index-copy-'));
    try {
      cpSync(repo.dir, join(dir, 'tree'), { recursive: true,
        filter: (source) => !source.endsWith('/.git') });
      assert.throws(() => buildIndex(join(dir, 'tree')), (error: unknown) =>
        error instanceof IndexError && /not a git repository/.test(error.message));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
