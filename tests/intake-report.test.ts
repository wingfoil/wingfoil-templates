import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { runIntakeReport } from '../src/intake-report-cli';
import {
  CHECK_IDS, changelogUrl, fetchChangelog, parseChecks, report,
} from '../src/intake-report';
import type { CheckLeg, ReportInput } from '../src/intake-report';
import { FIXTURES, REPO_ROOT } from './support/paths';
import { FROZEN_COMPAT } from './support/published-repo';

const CLI = join(REPO_ROOT, 'dist', 'src', 'intake-report-cli.js');
const CHANGELOG = readFileSync(join(FIXTURES, 'intake', 'report', 'CHANGELOG.md'), 'utf8');
const VERSION = '9.0.1';
const KINDS: Record<string, string> = {
  dna: '.wingfoil/dna.yaml', memory: '.wingfoil/memory.yaml', roles: '.wingfoil/roles.yaml',
  workflows: '.wingfoil/workflows.yaml', workflow: 'a workflow file', directive: 'a directive file',
  'memory-template': 'a Memory template',
};
const SUMS = [`${'a'.repeat(64)}  compat.yaml`];

function leg(node: string, outcome = 'success'): CheckLeg {
  return { node, checks: Object.fromEntries(CHECK_IDS.map((id) => [id, outcome])) };
}

function input(overrides: Partial<ReportInput> = {}): ReportInput {
  return {
    version: VERSION, class: 'patch', prepare: 'success', verify: 'success', rehearsal: false,
    base: 'b'.repeat(40), sums: SUMS, legs: [leg('22.12.0'), leg('22.21.0')],
    changelog: { ok: true, text: CHANGELOG }, kinds: KINDS,
    packsByKind: { directive: ['base', 'software'], dna: ['base'] },
    ...overrides,
  };
}

/** The fixture's 9.0.1 section with `extra` lines added at its end. */
function withLines(...extra: string[]): ReportInput {
  const text = CHANGELOG.replace('## [9.0.0]', `${extra.join('\n')}\n\n## [9.0.0]`);
  return input({ changelog: { ok: true, text } });
}

function guidedBy(value: ReportInput, pattern: RegExp): void {
  const result = report(value);
  assert.equal(result.verdict, 'guided');
  assert.ok(result.reasons.some((reason) => pattern.test(reason)),
    `${String(pattern)} in ${JSON.stringify(result.reasons)}`);
}

describe('the bar of "verified" (task-081, plan-065 ruling 2)', () => {
  it('is verified for a patch with fixes only, green checks and a readable section', () => {
    const result = report(input());
    assert.equal(result.verdict, 'verified', JSON.stringify(result.reasons));
    assert.deepEqual(result.reasons, []);
  });

  it('is guided for a prepare or verify result other than success, and a class not patch', () => {
    guidedBy(input({ prepare: 'failure' }), /prepare/);
    guidedBy(input({ verify: 'failure' }), /verify/);
    guidedBy(input({ verify: 'skipped' }), /verify/);
    guidedBy(input({ class: 'minor' }), /class/);
    guidedBy(input({ class: 'major' }), /class/);
  });

  it('is guided when the CHANGELOG was not read, or has no section for the version', () => {
    guidedBy(input({ changelog: { ok: false, why: 'HTTP 404' } }), /CHANGELOG could not be read/);
    guidedBy(input({ version: '9.0.3' }), /no section/);
    // The version's dots are matched literally.
    guidedBy(input({ changelog: { ok: true, text: CHANGELOG.replace('## [9.0.1]',
      '## [9x0x1]') } }), /no section/);
  });

  it('is guided by a Removed, Security, Deprecated or unknown heading, or a Breaking one', () => {
    for (const heading of ['### Removed', '### Security', '### Deprecated', '### Notes',
      '### Breaking changes', '#### Breaking: a flag']) {
      guidedBy(withLines(heading, '', '- something.'), /heading/);
    }
  });

  it('accepts Upgrading from with any text, and For contributors', () => {
    const result = report(withLines('### Upgrading from 9.0.x', '', 'Nothing.'));
    assert.equal(result.verdict, 'verified', JSON.stringify(result.reasons));
  });

  it('is guided by any Added or Changed entry, under a sub-heading too', () => {
    guidedBy(withLines('### Added', '', '- A small thing.'), /`Added` or `Changed`/);
    guidedBy(withLines('### Changed', '', '- A message reads better.'), /`Added` or `Changed`/);
    guidedBy(withLines('### Added', '', '#### Memory', '', '- A thing.'),
      /`Added` or `Changed`/);
  });

  it('is guided by the word format or formats on any line', () => {
    for (const line of ['- Refuses an unknown format: key.', '- Reads two formats.',
      '- `--format json` prints less.', 'The FORMAT of a file.']) {
      guidedBy(withLines(line), /format/);
    }
    assert.equal(report(withLines('- A malformed file is refused.')).verdict, 'verified');
  });

  it('is guided by a kind: its key in backticks, its file name, or its description', () => {
    guidedBy(withLines('- `dna` is read again.'), /`dna`/);
    guidedBy(withLines('- A broken roles.yaml is named.'), /`roles`/);
    guidedBy(withLines('- The directive files are listed.'), /`directive`/);
    guidedBy(withLines('- The Memory templates of a type.'), /`memory-template`/);
    guidedBy(withLines('- A workflow file with a tab.'), /`workflow`/);
    // A key inside a longer span is a command, not a kind.
    assert.equal(report(withLines('- `memory history` is faster.')).verdict, 'verified');
    assert.equal(report(withLines('- `wingfoil workflow start` is faster.')).verdict,
      'verified');
  });

  it('gives each reason with the line numbers and never the CHANGELOG\'s text', () => {
    const value = withLines('### Changed', '', '- Secret-looking words: zebra.');
    const result = report(value);
    const text = value.changelog.ok ? value.changelog.text : '';
    const line = text.split('\n').findIndex((one) => one.includes('zebra')) + 1;
    assert.ok(line > 0);
    assert.ok(result.reasons.some((reason) => reason.includes(String(line))),
      JSON.stringify(result.reasons));
    assert.ok(result.reasons.every((reason) => !reason.includes('zebra')));
  });

  it('ends the section at the next release heading', () => {
    // 9.0.0's Added entry is not 9.0.1's.
    assert.equal(report(input()).verdict, 'verified');
    guidedBy(input({ version: '9.0.0' }), /`Added` or `Changed`/);
  });
});

describe('the report (task-081)', () => {
  it('names the verdict, class, base, checks per Node.js, sums and packs', () => {
    const { markdown } = report(withLines('- A directive file is named.'));
    assert.match(markdown, /9\.0\.1: guided/);
    assert.match(markdown, /patch/);
    assert.ok(markdown.includes('b'.repeat(40)));
    assert.match(markdown, /Node\.js 22\.12\.0/);
    assert.match(markdown, /Node\.js 22\.21\.0/);
    assert.ok(markdown.includes(SUMS[0] ?? ''));
    assert.match(markdown, /`directive`: base, software/);
    assert.ok(!markdown.startsWith('Rehearsal'));
  });

  it('labels a rehearsal on its first line, never for intake', () => {
    const { markdown } = report(input({ rehearsal: true }));
    assert.equal(markdown.split('\n')[0], 'Rehearsal of 9.0.1: never for intake (dl-042 I1)');
  });

  it('writes unknown, no artifact and no checks when they are missing', () => {
    const { markdown } = report(input({ base: undefined, sums: undefined,
      legs: [leg('22.21.0')] }));
    assert.match(markdown, /unknown/);
    assert.match(markdown, /no artifact/);
    assert.match(markdown, /Node\.js 22\.12\.0: no checks/);
  });

  it('fences the section with a fence longer than any backtick run in it', () => {
    const { markdown } = report(withLines('- ```` four ```` and ``` three.'));
    assert.match(markdown, /\n`{5}\n[^]*\n`{5}\n/);
  });

  it('makes CRLF LF and removes control characters other than tab', () => {
    const text = CHANGELOG.replace('A patch with fixes only.',
      'A patch\r\nwith\u0007 fixes\u001b[31m only.\tTab.');
    const { markdown } = report(input({ changelog: { ok: true, text } }));
    assert.ok(markdown.includes('A patch\nwith fixes[31m only.\tTab.'));
    for (const character of ['\r', '\u0007', '\u001b']) {
      assert.ok(!markdown.includes(character), JSON.stringify(character));
    }
  });
});

describe('the checks of a verify leg (task-081)', () => {
  it('reads a valid checks.json', () => {
    assert.deepEqual(parseChecks(JSON.stringify(leg('22.12.0', 'failure'))),
      leg('22.12.0', 'failure'));
  });

  it('refuses a node not named, an id not of the fixed set, an outcome not known, not JSON', () => {
    const good = leg('22.12.0');
    for (const bad of [{ ...good, node: '20.0.0' },
      { ...good, checks: { ...good.checks, other: 'success' } },
      { ...good, checks: { ...good.checks, test: 'green' } }]) {
      assert.equal(parseChecks(JSON.stringify(bad)), undefined);
    }
    assert.equal(parseChecks('not json'), undefined);
    assert.equal(parseChecks('[]'), undefined);
  });
});

describe('the CHANGELOG fetch (task-081)', () => {
  const ok = (body: string, status = 200): typeof fetch =>
    async () => Promise.resolve(new Response(body, { status }));

  it('reads WingFoil\'s tag, at a URL fixed in code, refusing a redirect', async () => {
    assert.equal(changelogUrl('0.3.2'),
      'https://raw.githubusercontent.com/wingfoil/wingfoil/v0.3.2/CHANGELOG.md');
    const calls: [string, RequestInit | undefined][] = [];
    const fake = (async (url: string, init?: RequestInit) => {
      calls.push([url, init]);
      return Promise.resolve(new Response('text'));
    }) as typeof fetch;
    assert.deepEqual(await fetchChangelog('0.3.2', fake), { ok: true, text: 'text' });
    assert.equal(calls[0]?.[0], changelogUrl('0.3.2'));
    assert.equal(calls[0]?.[1]?.redirect, 'error');
  });

  it('is not read on a status but 200, a redirect, a timeout or over the size bound', async () => {
    assert.deepEqual(await fetchChangelog(VERSION, ok('missing', 404)),
      { ok: false, why: 'HTTP 404' });
    const redirect = (async () => Promise.reject(new TypeError('redirect'))) as typeof fetch;
    assert.equal((await fetchChangelog(VERSION, redirect)).ok, false);
    const hang = ((_url: string, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => { reject(new Error('aborted')); });
      })) as typeof fetch;
    assert.deepEqual(await fetchChangelog(VERSION, hang, { timeoutMs: 20 }),
      { ok: false, why: 'a timeout' });
    assert.deepEqual(await fetchChangelog(VERSION, ok('x'.repeat(2048)), { maxBytes: 1024 }),
      { ok: false, why: 'over the size bound' });
  });
});

describe('the intake:report command (task-081)', () => {
  function tree(): string {
    const dir = mkdtempSync(join(tmpdir(), 'intake-report-test-'));
    writeFileSync(join(dir, 'compat.yaml'), FROZEN_COMPAT);
    writeFileSync(join(dir, 'catalog.yaml'), 'format: 1\npacks:\n  - id: base\n    versions:\n'
      + '      - version: 1.0.0\n        formats: { dna: 1, directive: 1 }\n');
    mkdirSync(join(dir, 'intake'));
    writeFileSync(join(dir, 'intake', 'BASE'), `${'c'.repeat(40)}\n`);
    writeFileSync(join(dir, 'intake', 'SHA256SUMS'), `${SUMS.join('\n')}\n`);
    mkdirSync(join(dir, 'checks', 'verify-22.12.0'), { recursive: true });
    writeFileSync(join(dir, 'checks', 'verify-22.12.0', 'checks.json'),
      JSON.stringify(leg('22.12.0')));
    return dir;
  }
  const fake = (async () => Promise.resolve(new Response(CHANGELOG))) as typeof fetch;

  it('appends the report to the summary and prints one notice or warning line', async () => {
    const dir = tree();
    try {
      const summary = join(dir, 'summary.md');
      writeFileSync(summary, 'before\n');
      const args = [VERSION, '--class', 'patch', '--prepare', 'success', '--verify', 'success',
        '--artifact', join(dir, 'intake'), '--checks',
        join(dir, 'checks', 'verify-22.12.0', 'checks.json'), '--summary', summary,
        '--tree', dir];
      const verified = await runIntakeReport(args, dir, fake);
      assert.equal(verified.code, 0, verified.stderr.join('\n'));
      assert.deepEqual(verified.stdout,
        ['::notice title=WingFoil intake report::9.0.1 verified']);
      const text = readFileSync(summary, 'utf8');
      assert.ok(text.startsWith('before\n'));
      assert.ok(text.includes('c'.repeat(40)));
      assert.match(text, /Node\.js 22\.21\.0: no checks/);
      const guided = await runIntakeReport([...args.slice(0, 2), 'minor', ...args.slice(3),
        '--rehearsal'], dir, fake);
      assert.equal(guided.code, 0);
      assert.deepEqual(guided.stdout,
        ['::warning title=WingFoil intake report::rehearsal of 9.0.1 guided: 1 reason']);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('exits 1 when the summary cannot be written, 2 on a wrong command line', async () => {
    const dir = tree();
    try {
      const base = [VERSION, '--class', 'patch', '--prepare', 'success', '--verify', 'success',
        '--tree', dir];
      assert.equal((await runIntakeReport([...base, '--summary', join(dir, 'intake')], dir,
        fake)).code, 1);
      const never = (async () => Promise.reject(new Error('no fetch'))) as typeof fetch;
      for (const args of [['v9.0.1', ...base.slice(1)], base, [VERSION], ['--bad']]) {
        assert.equal((await runIntakeReport(args, dir, never)).code, 2, args.join(' '));
      }
      const run = spawnSync(process.execPath, [CLI, '9.0', '--class', 'patch'],
        { encoding: 'utf8' });
      assert.equal(run.status, 2);
      assert.match(run.stderr, /usage: intake:report/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
