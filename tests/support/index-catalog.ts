// The fixture catalog of task-019 acceptance 13: a scratch git repository with tags, whose index
// outputs are committed under tests/fixtures/index/expected/ so that a reader can browse them.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, stringify } from 'yaml';

import { transitionDigest } from '../../src/digest';
import type { TestRepo } from './git-repo';
import { BASE_COMPOSABLE, KANBAN, SOFTWARE_COMPOSABLE, writePack } from './pack-tree';
import type { PackSpec } from './pack-tree';
import { publishByHand, reindex, treeRepo } from './published-repo';
import { exampleSection } from './examples';
import { conformingReadme } from './readme';

type Doc = Record<string, unknown>;

const TRANSITION = ['format: 1', 'id: mvp-to-production', 'from: stage/mvp', 'to: stage/production',
  'formats: {}', 'requires_capabilities: []', 'pre_checks: []',
  'actions:', '  - { id: swap-stage-overlay, description: "Swap the stage overlay." }', ''].join('\n');

const PRESETS: Record<string, string> = {
  'small-team': 'format: 1\nid: small-team\ntitle: "Small team"\n'
    + 'description: "Kanban with Lean Inception, for a small team."\nprofile: "small teams"\n'
    + 'packs:\n  - methodology/kanban@^1\n  - phase/inception/lean@^1\n',
  minimal: 'format: 1\nid: minimal\ntitle: "Minimal"\ndescription: "Kanban alone."\n'
    + 'packs:\n  - methodology/kanban@^1\n',
};

function kanban(version: string, title: string, extra: Doc): PackSpec {
  return { ...KANBAN, version, manifest: { title, description: `Kanban, ${version}. A pull `
    + 'system with WIP limits.', ...extra } };
}

function readmeFor(id: string, title: string, situation: string): string {
  return conformingReadme({ id, title, description: `${title}.` },
    exampleSection(id.slice(id.lastIndexOf('/') + 1)))
    .replace('A test fixture of the tooling; never adopted.', situation);
}

function editCatalog(repo: TestRepo, edit: (catalog: Doc) => void): void {
  const file = join(repo.dir, 'catalog.yaml');
  const catalog = parse(readFileSync(file, 'utf8')) as Doc;
  edit(catalog);
  writeFileSync(file, stringify(catalog));
}

/**
 * base, software (never published until task-033), a methodology with two versions (1.1.0
 * changes its requires, adds a conflict, a parameter and a new title), a phase pack, two stage
 * packs and their transition, one pack never published, two presets (one with a profile); after
 * the last tag, an unreleased title and section 2 in the working tree.
 */
export function indexCatalog(): TestRepo {
  const v1 = kanban('1.0.0', 'Kanban', {});
  const lean: PackSpec = { id: 'phase/inception/lean', workflows: ['inception'] };
  const repo = treeRepo([BASE_COMPOSABLE, SOFTWARE_COMPOSABLE, v1, lean, { id: 'stage/mvp' },
    { id: 'stage/production' }, { id: 'blueprint/web' }]);
  repo.write('packs/methodology/kanban/README.md', readmeFor('methodology/kanban', 'Kanban',
    'A team that pulls work through a board with WIP limits.'));
  repo.write('transitions/mvp-to-production.yaml', TRANSITION);
  for (const [id, text] of Object.entries(PRESETS)) repo.write(`presets/${id}.yaml`, text);
  editCatalog(repo, (catalog) => {
    catalog['presets'] = Object.keys(PRESETS).sort().map((id) => ({ id,
      path: `presets/${id}.yaml` }));
    catalog['transitions'] = [{ id: 'mvp-to-production',
      path: 'transitions/mvp-to-production.yaml', from: 'stage/mvp', to: 'stage/production',
      formats: {}, requires_capabilities: [] }];
  });
  reindex(repo, 'presets and transition');
  for (const id of ['base', 'methodology/kanban', 'phase/inception/lean', 'stage/mvp']) {
    publishByHand(repo, id);
  }
  publishByHand(repo, 'stage/production');
  const digest = transitionDigest(repo.dir, 'refs/tags/stage/production@1.0.0',
    'transitions/mvp-to-production.yaml').digest;
  editCatalog(repo, (catalog) => {
    const production = (catalog['packs'] as Doc[]).find((pack) => pack['id'] === 'stage/production');
    ((production?.['versions'] as Doc[])[0] as Doc)['transitions'] = { 'mvp-to-production': digest };
  });
  reindex(repo, 'transition digests');
  writePack(repo.dir, kanban('1.1.0', 'Kanban flow', {
    requires: ['base@^1.0.0', 'software@^1'],
    conflicts: ['blueprint/web'],
    parameters: { wip_limit: { type: 'integer', default: 3, description: 'The WIP limit.' } },
  }));
  repo.write('packs/methodology/kanban/README.md', readmeFor('methodology/kanban', 'Kanban flow',
    'A team that pulls work through a board with WIP limits, and limits its flow.'));
  reindex(repo, 'kanban 1.1.0');
  publishByHand(repo, 'methodology/kanban');
  writePack(repo.dir, kanban('1.2.0', 'Kanban (unreleased)', {}));
  repo.write('packs/methodology/kanban/README.md', readmeFor('methodology/kanban',
    'Kanban (unreleased)', 'Not released yet.'));
  reindex(repo, 'unreleased');
  return repo;
}
