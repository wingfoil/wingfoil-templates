import { strict as assert } from 'node:assert';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { loadYamlFile } from '../src/yaml-load';
import { REPO_ROOT } from './support/paths';

type Doc = Record<string, unknown>;
interface Step { name?: string; uses?: string; run?: string; with?: Doc }

const FILE = '.github/workflows/intake.yml';

/** The workflow, read in each test so that its absence fails an assertion, not the file's load. */
function intake(): { workflow: Doc; job: Doc; steps: Step[]; text: string } {
  const path = join(REPO_ROOT, FILE);
  assert.ok(existsSync(path), `${FILE} exists`);
  const workflow = loadYamlFile(path, FILE).data as Doc;
  const jobs = workflow['jobs'] as Record<string, Doc>;
  const list = Object.values(jobs);
  assert.equal(list.length, 1, 'one job');
  const [job] = list;
  assert.ok(job !== undefined);
  return { workflow, job, steps: job['steps'] as Step[], text: JSON.stringify(workflow) };
}

describe('the intake workflow (task-078, plan-065)', () => {
  it('runs daily and by hand, and on nothing else', () => {
    const on = intake().workflow['on'] as Doc;
    assert.deepEqual(Object.keys(on).sort(), ['schedule', 'workflow_dispatch']);
    const schedule = on['schedule'] as { cron?: string }[];
    assert.equal(schedule.length, 1);
    assert.match(schedule[0]?.cron ?? '', /^\d+ \d+ \* \* \*$/, 'once a day');
  });

  it('reads the repository and nothing more, with no token and no cache', () => {
    const { workflow, job, steps, text } = intake();
    assert.deepEqual(workflow['permissions'], { contents: 'read' });
    assert.ok(!Object.hasOwn(job, 'permissions'), 'no job-level permissions');
    for (const word of ['secrets.', 'github.token', 'GITHUB_TOKEN', 'pull_request_target']) {
      assert.ok(!text.includes(word), word);
    }
    assert.ok(steps.every((step) => !step.uses?.startsWith('actions/cache')), 'no actions/cache');
  });

  it('never cancels a running check, one group per ref', () => {
    assert.deepEqual(intake().workflow['concurrency'],
      { group: 'intake-${{ github.ref }}', 'cancel-in-progress': false });
  });

  it('runs on a pinned runner with a timeout, actions pinned to full commit SHAs', () => {
    const { job, steps } = intake();
    assert.equal(job['runs-on'], 'ubuntu-24.04');
    assert.equal(typeof job['timeout-minutes'], 'number');
    const actions = steps.filter((step) => step.uses !== undefined);
    assert.ok(actions.length >= 2);
    for (const step of actions) {
      assert.match(step.uses ?? '', /^[a-z0-9-]+\/[a-z0-9-]+@[0-9a-f]{40}$/, step.uses);
    }
    const checkout = steps.find((step) => step.uses?.startsWith('actions/checkout@'));
    assert.equal(checkout?.with?.['persist-credentials'], false);
    const node = steps.find((step) => step.uses?.startsWith('actions/setup-node@'));
    assert.deepEqual(node?.with, { 'node-version': '22.21.0', 'check-latest': false });
  });

  it('installs, builds and runs the detection with --github', () => {
    const runs = intake().steps.map((step) => step.run?.trim()).filter((run) => run !== undefined);
    assert.deepEqual(runs, ['npm ci', 'npm run build', 'npm run -s intake:detect -- --github']);
  });
});
