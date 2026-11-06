import { strict as assert } from 'node:assert';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { CHECK_IDS } from '../src/intake-report';
import { loadYamlFile } from '../src/yaml-load';
import { REPO_ROOT } from './support/paths';

type Doc = Record<string, unknown>;
interface Step {
  name?: string; id?: string; uses?: string; run?: string; if?: string; with?: Doc; env?: Doc;
  'continue-on-error'?: boolean;
}
interface Job extends Doc { steps: Step[] }

const FILE = '.github/workflows/intake.yml';
const SHA = /^[a-z0-9-]+\/[a-z0-9-]+(\/[a-z0-9-]+)?@[0-9a-f]{40}$/;

/** The workflow, read in each test so that its absence fails an assertion, not the file's load. */
function intake(): { workflow: Doc; jobs: Record<string, Job>; text: string } {
  const path = join(REPO_ROOT, FILE);
  assert.ok(existsSync(path), `${FILE} exists`);
  const workflow = loadYamlFile(path, FILE).data as Doc;
  return { workflow, jobs: workflow['jobs'] as Record<string, Job>,
    text: readFileSync(path, 'utf8') };
}

function job(name: string): Job {
  const found = intake().jobs[name];
  assert.ok(found !== undefined, `the ${name} job`);
  return found;
}

function runs(name: string): string[] {
  return job(name).steps.map((step) => step.run?.trim()).filter((run) => run !== undefined);
}

describe('the intake workflow (task-078, task-081, plan-065)', () => {
  it('runs daily and by hand, with one boolean rehearsal input, and on nothing else', () => {
    const on = intake().workflow['on'] as Doc;
    assert.deepEqual(Object.keys(on).sort(), ['schedule', 'workflow_dispatch']);
    const schedule = on['schedule'] as { cron?: string }[];
    assert.equal(schedule.length, 1);
    assert.match(schedule[0]?.cron ?? '', /^\d+ \d+ \* \* \*$/, 'once a day');
    const inputs = (on['workflow_dispatch'] as Doc)['inputs'] as Record<string, Doc>;
    assert.deepEqual(Object.keys(inputs), ['rehearsal']);
    assert.equal(inputs['rehearsal']?.['type'], 'boolean');
    assert.equal(inputs['rehearsal']?.['default'], false);
  });

  it('has four jobs: detect, prepare, verify, report', () => {
    assert.deepEqual(Object.keys(intake().jobs), ['detect', 'prepare', 'verify', 'report']);
  });

  it('reads the repository and nothing more, with no token, no cache and no push', () => {
    const { workflow, jobs, text } = intake();
    assert.deepEqual(workflow['permissions'], { contents: 'read' });
    for (const [name, each] of Object.entries(jobs)) {
      assert.ok(!Object.hasOwn(each, 'permissions'), `${name}: no job-level permissions`);
      assert.ok(each.steps.every((step) => !step.uses?.startsWith('actions/cache')),
        `${name}: no actions/cache`);
    }
    for (const word of ['secrets.', 'github.token', 'GITHUB_TOKEN', 'pull_request_target',
      'git push', 'gh pr', 'gh issue', 'gh api']) {
      assert.ok(!text.includes(word), word);
    }
  });

  it('never cancels a running check, one group per ref', () => {
    assert.deepEqual(intake().workflow['concurrency'],
      { group: 'intake-${{ github.ref }}', 'cancel-in-progress': false });
  });

  it('runs each job on a pinned runner with a timeout, actions pinned to full commit SHAs', () => {
    const timeouts: Record<string, number> = { detect: 10, prepare: 15, verify: 40, report: 10 };
    for (const [name, each] of Object.entries(intake().jobs)) {
      assert.equal(each['runs-on'], 'ubuntu-24.04', name);
      assert.equal(each['timeout-minutes'], timeouts[name], name);
      for (const step of each.steps.filter((one) => one.uses !== undefined)) {
        assert.match(step.uses ?? '', SHA, step.uses);
      }
      const checkout = each.steps.find((step) => step.uses?.startsWith('actions/checkout@'));
      assert.equal(checkout?.with?.['persist-credentials'], false, name);
    }
  });

  it('checks out prepare and verify with every tag, the index reading them', () => {
    for (const name of ['prepare', 'verify']) {
      const checkout = job(name).steps.find((step) => step.uses?.startsWith('actions/checkout@'));
      assert.equal(checkout?.with?.['fetch-depth'], 0, name);
      assert.equal(checkout?.with?.['fetch-tags'], true, name);
    }
  });

  it('passes an output or an input to a run only through env', () => {
    for (const [name, each] of Object.entries(intake().jobs)) {
      for (const step of each.steps) {
        assert.ok(!(step.run ?? '').includes('${{'), `${name}: ${step.name ?? step.id ?? ''}`);
      }
    }
  });
});

describe('the detect job (task-078, task-081)', () => {
  it('writes its outputs from a step that may fail, then stays red while one is missing', () => {
    const detect = job('detect');
    assert.deepEqual(detect['outputs'], { version: '${{ steps.detect.outputs.version }}',
      class: '${{ steps.detect.outputs.class }}' });
    const step = detect.steps.find((one) => one.id === 'detect');
    assert.equal(step?.['continue-on-error'], true);
    assert.deepEqual(step?.env, { REHEARSAL: '${{ inputs.rehearsal }}' });
    assert.match(step?.run ?? '', /if \[ "\$REHEARSAL" = "true" \]/);
    assert.ok((step?.run ?? '').includes(
      'npm run -s intake:detect -- --github --github-output "$GITHUB_OUTPUT" --rehearsal'));
    const last = detect.steps[detect.steps.length - 1];
    assert.deepEqual(last?.env, { OUTCOME: '${{ steps.detect.outcome }}' });
    assert.equal(last?.run?.trim(), 'test "$OUTCOME" = success');
    assert.deepEqual(runs('detect').slice(0, 2), ['npm ci', 'npm run build']);
  });
});

describe('the prepare job (task-081)', () => {
  it('runs after a red detect when a version is to be prepared', () => {
    const prepare = job('prepare');
    assert.equal(prepare['needs'], 'detect');
    assert.equal(prepare['if'], "${{ !cancelled() && needs.detect.outputs.version != '' }}");
  });

  it('rehearses only on the input, prepares, collects and uploads with a retention', () => {
    const prepare = job('prepare');
    assert.deepEqual(runs('prepare'), ['npm ci', 'npm run build', 'npm run -s intake:rehearse',
      'npm run -s intake:prepare -- "$VERSION"',
      'npm run -s intake:collect -- "$VERSION" --out "$RUNNER_TEMP/intake"']);
    const rehearse = prepare.steps.find((step) => step.run === 'npm run -s intake:rehearse');
    assert.equal(rehearse?.if, '${{ inputs.rehearsal == true }}');
    const node = prepare.steps.find((step) => step.uses?.startsWith('actions/setup-node@'));
    assert.equal(node?.with?.['node-version'], '22.21.0');
    const upload = prepare.steps.find((step) => step.uses?.startsWith('actions/upload-artifact@'));
    assert.deepEqual(upload?.with, { name: 'intake-${{ needs.detect.outputs.version }}',
      path: '${{ runner.temp }}/intake', 'retention-days': 14, 'if-no-files-found': 'error' });
  });
});

describe('the verify job (task-081)', () => {
  it('runs when prepare succeeded, on both Node.js versions, never failing fast', () => {
    const verify = job('verify');
    assert.deepEqual(verify['needs'], ['detect', 'prepare']);
    assert.equal(verify['if'], "${{ !cancelled() && needs.prepare.result == 'success' }}");
    assert.deepEqual(verify['strategy'],
      { 'fail-fast': false, matrix: { node: ['22.12.0', '22.21.0'] } });
  });

  it('applies the artifact, then runs every check, each continuing on error', () => {
    const steps = job('verify').steps;
    const apply = steps.findIndex((step) => step.run?.startsWith('npm run -s intake:apply'));
    assert.equal(steps[apply]?.run?.trim(),
      'npm run -s intake:apply -- "$RUNNER_TEMP/intake" --version "$VERSION"');
    const download = steps.findIndex((step) => step.uses?.startsWith('actions/download-artifact@'));
    assert.ok(download >= 0 && download < apply);
    assert.deepEqual(steps[download]?.with, { name: 'intake-${{ needs.detect.outputs.version }}',
      path: '${{ runner.temp }}/intake' });
    const checks = steps.filter((step) => step['continue-on-error'] === true);
    assert.deepEqual(checks.map((step) => step.id), [...CHECK_IDS]);
    for (const step of steps.slice(0, apply + 1)) {
      assert.ok(step['continue-on-error'] !== true, step.name);
    }
    const run = (id: string): string => checks.find((step) => step.id === id)?.run?.trim() ?? '';
    assert.equal(run('test'), 'npm test');
    assert.equal(run('pins'), 'npm run check:pins');
    assert.equal(run('validate'), 'npm run validate');
    assert.equal(run('runs'), 'npm run check:runs');
    assert.equal(run('publication'), 'npm run validate:publication');
    assert.equal(run('audit-root'), 'npm audit --omit=dev');
  });

  it('writes the outcomes, uploads them, then fails on one not green: in that order', () => {
    const steps = job('verify').steps;
    const [write, upload, fail] = steps.slice(-3);
    assert.ok(write?.run?.includes('checks.json'));
    assert.ok(CHECK_IDS.every((id) => write?.run?.includes(`"${id}"`)), 'the fixed ids');
    assert.deepEqual(write?.env, { NODE_VERSION: '${{ matrix.node }}',
      STEPS: '${{ toJSON(steps) }}' });
    assert.ok(upload?.uses?.startsWith('actions/upload-artifact@'));
    assert.deepEqual(upload?.with, { name: 'verify-${{ matrix.node }}',
      path: '${{ runner.temp }}/checks.json', 'retention-days': 14, 'if-no-files-found': 'error' });
    assert.ok(fail?.run?.includes('process.exit'));
    for (const step of [write, upload, fail]) assert.equal(step?.if, undefined);
  });
});

describe('the report job (task-081)', () => {
  it('runs when a version was to be prepared, whatever prepare and verify gave', () => {
    const report = job('report');
    assert.deepEqual(report['needs'], ['detect', 'prepare', 'verify']);
    assert.equal(report['if'], "${{ !cancelled() && needs.detect.outputs.version != '' }}");
  });

  it('downloads the artifact only after a prepared diff, the checks by pattern', () => {
    const downloads = job('report').steps
      .filter((step) => step.uses?.startsWith('actions/download-artifact@'));
    assert.equal(downloads.length, 2);
    assert.equal(downloads[0]?.if, "${{ needs.prepare.result == 'success' }}");
    assert.deepEqual(downloads[1]?.with,
      { pattern: 'verify-*', path: '${{ runner.temp }}/checks' });
    assert.equal(downloads[1]?.['continue-on-error'], true);
  });

  it('runs intake:report with the jobs\' results through env, writing the job summary', () => {
    const report = job('report');
    assert.deepEqual(report['env'], {
      VERSION: '${{ needs.detect.outputs.version }}', CLASS: '${{ needs.detect.outputs.class }}',
      PREPARE: '${{ needs.prepare.result }}', VERIFY: '${{ needs.verify.result }}',
      REHEARSAL: '${{ inputs.rehearsal }}' });
    const last = runs('report').pop() ?? '';
    assert.match(last, /npm run -s intake:report -- "\$VERSION" --class "\$CLASS"/);
    assert.match(last, /--summary "\$GITHUB_STEP_SUMMARY"/);
    assert.match(last, /args\+=\(--rehearsal\)/);
  });
});
