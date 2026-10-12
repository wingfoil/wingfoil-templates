import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { loadYamlFile } from '../src/yaml-load';
import { REPO_ROOT } from './support/paths';

type Doc = Record<string, unknown>;

interface Step {
  name?: string;
  id?: string;
  uses?: string;
  run?: string;
  with?: Doc;
}

const FILE = '.github/workflows/pages.yml';
const workflow = loadYamlFile(join(REPO_ROOT, FILE), FILE).data as Doc;
const jobs = workflow['jobs'] as Record<string, Doc>;
const steps = (job: string): Step[] => (jobs[job]?.['steps'] ?? []) as Step[];
const text = readFileSync(join(REPO_ROOT, FILE), 'utf8');

describe('the Pages workflow (task-024, dl-014 D4, spec-002 §5)', () => {
  it('runs on every push to main and by hand, never on pull requests', () => {
    assert.deepEqual(workflow['on'], { push: { branches: ['main'] }, workflow_dispatch: null });
  });

  it('grants nothing at the top, and reads no secret', () => {
    assert.deepEqual(workflow['permissions'], {});
    assert.ok(!text.includes('secrets.'));
    assert.ok(!text.includes('github.token'));
  });

  it('never cancels a running deployment', () => {
    assert.deepEqual(workflow['concurrency'], { group: 'pages', 'cancel-in-progress': false });
  });

  it('builds with contents: read only, the index checked before the site', () => {
    const build = jobs['build'] ?? {};
    assert.deepEqual(build['permissions'], { contents: 'read' });
    assert.equal(build['runs-on'], 'ubuntu-24.04');
    assert.equal(typeof build['timeout-minutes'], 'number');
    const runs = steps('build').flatMap((step) => step.run === undefined ? [] : [step.run.trim()]);
    assert.deepEqual(runs, ['npm ci', 'npm run build', 'npm run index -- --check',
      'npm run site -- --out _site']);
    const checkout = steps('build').find((step) => step.uses?.startsWith('actions/checkout@'));
    assert.deepEqual(checkout?.with, { 'fetch-depth': 0, 'fetch-tags': true,
      'persist-credentials': false });
    const node = steps('build').find((step) => step.uses?.startsWith('actions/setup-node@'));
    assert.deepEqual(node?.with, { 'node-version': '22.21.0', 'check-latest': false });
    const upload = steps('build').find((step) =>
      step.uses?.startsWith('actions/upload-pages-artifact@'));
    assert.deepEqual(upload?.with, { path: '_site' });
  });

  it('deploys from main only, with pages: write and id-token: write only', () => {
    const deploy = jobs['deploy'] ?? {};
    assert.equal(deploy['needs'], 'build');
    assert.equal(deploy['if'], "github.ref == 'refs/heads/main'");
    assert.deepEqual(deploy['permissions'], { pages: 'write', 'id-token': 'write' });
    assert.deepEqual(deploy['environment'], { name: 'github-pages',
      url: '${{ steps.deployment.outputs.page_url }}' });
    assert.equal(steps('deploy').length, 1, 'the deploy action only, no checkout');
    const action = steps('deploy').find((step) => step.uses?.startsWith('actions/deploy-pages@'));
    assert.equal(action?.id, 'deployment');
  });

  it('pins every action to a full commit SHA, its release tag in a comment', () => {
    const uses = [...steps('build'), ...steps('deploy')].flatMap((step) =>
      step.uses === undefined ? [] : [step.uses]);
    assert.ok(uses.length >= 4);
    for (const use of uses) {
      assert.match(use, /^[a-z0-9-]+\/[a-z0-9-]+@[0-9a-f]{40}$/, use);
      assert.match(text, new RegExp(`${use.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')} # v\\d`), use);
    }
  });
});
