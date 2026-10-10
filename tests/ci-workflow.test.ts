import { strict as assert } from 'node:assert';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { loadYamlFile } from '../src/yaml-load';
import { REPO_ROOT } from './support/paths';

type Doc = Record<string, unknown>;

interface Step {
  name?: string;
  uses?: string;
  run?: string;
  if?: string;
  with?: Doc;
}

const FILE = '.github/workflows/ci.yml';
const workflow = loadYamlFile(join(REPO_ROOT, FILE), FILE).data as Doc;
const jobs = workflow['jobs'] as Record<string, Doc>;
const [job] = Object.values(jobs);
assert.ok(job !== undefined, 'one job');
const steps = job['steps'] as Step[];

function stepRunning(command: string): Step | undefined {
  return steps.find((step) => step.run?.split('\n').some((line) => line.trim() === command));
}

describe('the CI workflow (task-013)', () => {
  it('runs on every pushed branch, on release tags and on pull requests (F3.6, no PR in the flow)',
    () => {
      const on = workflow['on'] as Doc;
      assert.deepEqual(on['push'], { branches: ['**'], tags: ['**@*'] },
        '`*` does not match `/`, and pack ids such as methodology/kanban contain one');
      assert.equal(on['pull_request'], null, 'pull_request on any branch, with no filter');
      assert.ok(!Object.hasOwn(on, 'pull_request_target'), 'never pull_request_target');
    });

  it('reads the repository and nothing more', () => {
    assert.deepEqual(workflow['permissions'], { 'contents': 'read' });
    assert.ok(!JSON.stringify(workflow).includes('secrets.'), 'no secret is read');
  });

  it('cancels a superseded branch run, never a tag run', () => {
    assert.deepEqual(workflow['concurrency'], {
      group: 'ci-${{ github.ref }}',
      'cancel-in-progress': '${{ github.ref_type != \'tag\' }}',
    });
  });

  it('runs on a pinned runner, on the Node.js floor and the newest 22.x, with a timeout', () => {
    assert.equal(job['runs-on'], 'ubuntu-24.04');
    assert.deepEqual((job['strategy'] as Doc)['matrix'], { node: ['22.12.0', '22.21.0'] });
    assert.equal(typeof job['timeout-minutes'], 'number');
  });

  it('pins every action to a full commit SHA', () => {
    const actions = steps.filter((step) => step.uses !== undefined);
    assert.ok(actions.length >= 3);
    for (const step of actions) {
      assert.match(step.uses ?? '', /^[a-z0-9-]+\/[a-z0-9-]+@[0-9a-f]{40}$/, step.uses);
    }
  });

  it('checks out every tag and the full history, without persisting credentials (spec-002 §3.1)',
    () => {
      const checkout = steps.find((step) => step.uses?.startsWith('actions/checkout@'));
      assert.deepEqual(checkout?.with, { 'fetch-depth': 0, 'fetch-tags': true,
        'persist-credentials': false });
      const node = steps.find((step) => step.uses?.startsWith('actions/setup-node@'));
      assert.deepEqual(node?.with, { 'node-version': '${{ matrix.node }}', 'check-latest': false });
    });

  it('caches the matrix releases by runner, Node.js version and the release lockfiles', () => {
    const cache = steps.find((step) => step.uses?.startsWith('actions/cache@'));
    assert.equal(cache?.with?.['path'], '.cache/wingfoil-matrix');
    const key = String(cache?.with?.['key']);
    for (const part of ['runner.os', 'matrix.node',
      "hashFiles('src/matrix/wingfoil-*/package-lock.json')"]) {
      assert.ok(key.includes(part), `${part} in ${key}`);
    }
  });

  it('runs every check, on every path', () => {
    for (const command of ['npm ci', 'npm run build', 'npm test', 'npm run lint',
      'npm run check:pins', 'npm run check:schemas', 'npm run check:packs', 'npm audit']) {
      const step = stepRunning(command);
      assert.ok(step !== undefined, command);
      assert.equal(step.if, undefined, `${command} runs on every path`);
    }
    const matrixAudit = steps.find((step) => step.run?.includes('src/matrix/'));
    assert.equal(matrixAudit?.run,
      'for dir in src/matrix/wingfoil-*/; do\n  (cd "$dir" && npm audit)\ndone\n',
      'npm audit in every release folder, a failure failing the step');
    assert.ok(steps.every((step) => !Object.hasOwn(step, 'continue-on-error')));
  });

  it('runs self-test mode on branches and publication mode on tags, never both (dl-009)', () => {
    const branch = "github.ref_type != 'tag'";
    const tag = "github.ref_type == 'tag'";
    for (const command of ['npm run validate',
      'npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden']) {
      assert.equal(stepRunning(command)?.if, branch, command);
    }
    assert.equal(stepRunning('npm run validate:publication')?.if, tag);
    const onTag = steps.filter((step) => step.if === tag);
    assert.ok(onTag.every((step) => !/npm run validate(\s|$)/.test(step.run ?? '')),
      'no self-test step on the tag path');
  });
});
