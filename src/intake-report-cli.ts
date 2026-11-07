// `npm run intake:report -- <version> --class <class> --prepare <result> --verify <result>
// [--artifact <dir>] [--checks <file>]... [--rehearsal] --summary <file> [--tree <dir>]`
// (task-081): reads the release's CHANGELOG at WingFoil's tag, appends the report to the summary
// (the job's $GITHUB_STEP_SUMMARY) and prints one ::notice (verified) or ::warning (guided) line,
// built from fixed text and the validated version only. Exit 0 with either verdict; 1 when the
// summary cannot be written; 2 on a wrong command line or a version not strict.
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { parse } from 'yaml';

import { compatFrom } from './compat';
import { isDoc } from './index-data';
import { STRICT } from './intake-prepare';
import { fetchChangelog, parseChecks, report } from './intake-report';
import type { CheckLeg } from './intake-report';

const USAGE = 'usage: intake:report <version> --class <class> --prepare <result> --verify <result> '
  + '[--artifact <dir>] [--checks <file>]... [--rehearsal] --summary <file> [--tree <dir>]';
const TITLE = 'title=WingFoil intake report';

export interface Outcome { code: number; stdout: string[]; stderr: string[] }

interface Args {
  version: string; class: string; prepare: string; verify: string; artifact?: string | undefined;
  checks: string[]; rehearsal: boolean; summary: string; tree: string;
}

function parsed(argv: string[], cwd: string): Args {
  const { values, positionals } = parseArgs({ args: argv, allowPositionals: true, strict: true,
    options: {
      class: { type: 'string' }, prepare: { type: 'string' }, verify: { type: 'string' },
      artifact: { type: 'string' }, checks: { type: 'string', multiple: true },
      rehearsal: { type: 'boolean' }, summary: { type: 'string' }, tree: { type: 'string' },
    } });
  if (positionals.length !== 1) throw new Error('one version expected');
  const version = positionals[0] ?? '';
  if (!STRICT.test(version)) throw new Error('the version is not a strict X.Y.Z');
  for (const name of ['class', 'prepare', 'verify', 'summary'] as const) {
    if (values[name] === undefined) throw new Error(`--${name} is required`);
  }
  return { version, class: values.class ?? '', prepare: values.prepare ?? '',
    verify: values.verify ?? '', artifact: values.artifact, checks: values.checks ?? [],
    rehearsal: values.rehearsal === true, summary: values.summary ?? '',
    tree: values.tree ?? cwd };
}

function optionalText(path: string): string | undefined {
  try {
    return existsSync(path) ? readFileSync(path, 'utf8') : undefined;
  } catch {
    return undefined;
  }
}

/** The packs whose versions declare each kind in `formats`, from catalog.yaml. */
function packsByKind(catalogText: string | undefined): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  let data: unknown;
  try {
    data = parse(catalogText ?? '') as unknown;
  } catch {
    return result;
  }
  const packs = isDoc(data) && Array.isArray(data['packs']) ? data['packs'] : [];
  for (const pack of packs) {
    if (!isDoc(pack) || !Array.isArray(pack['versions'])) continue;
    for (const version of pack['versions']) {
      if (!isDoc(version) || !isDoc(version['formats'])) continue;
      for (const kind of Object.keys(version['formats'])) {
        const list = result[kind] ?? [];
        const id = String(pack['id']);
        if (!list.includes(id)) list.push(id);
        result[kind] = list;
      }
    }
  }
  return result;
}

export async function runIntakeReport(argv: string[], cwd: string,
  fetchImpl: typeof fetch = fetch): Promise<Outcome> {
  let args: Args;
  try {
    args = parsed(argv, cwd);
  } catch (error) {
    return { code: 2, stdout: [],
      stderr: [error instanceof Error ? error.message : String(error), USAGE] };
  }
  let kinds: Record<string, string>;
  try {
    kinds = compatFrom(parse(readFileSync(join(args.tree, 'compat.yaml'), 'utf8')) as unknown)
      .kinds;
  } catch {
    kinds = {};
  }
  const legs = args.checks.map((file) => parseChecks(optionalText(file) ?? ''))
    .filter((leg): leg is CheckLeg => leg !== undefined);
  const base = args.artifact === undefined ? undefined
    : optionalText(join(args.artifact, 'BASE'))?.trim();
  const sums = args.artifact === undefined ? undefined
    : optionalText(join(args.artifact, 'SHA256SUMS'))?.split('\n').filter((line) => line !== '');
  const changelog = await fetchChangelog(args.version, fetchImpl);
  const result = report({
    version: args.version, class: args.class, prepare: args.prepare, verify: args.verify,
    rehearsal: args.rehearsal, base: base !== undefined && /^[0-9a-f]{40}$/.test(base) ? base
      : undefined,
    sums: sums?.every((line) => /^[0-9a-f]{64} {2}[\w./-]+$/.test(line)) === true ? sums
      : undefined,
    legs, changelog, kinds, packsByKind: packsByKind(optionalText(join(args.tree,
      'catalog.yaml'))),
  });
  try {
    appendFileSync(args.summary, result.markdown);
  } catch (error) {
    return { code: 1, stdout: [], stderr: [`intake:report: the summary cannot be written: ${
      error instanceof Error ? error.message : String(error)}`] };
  }
  const label = `${args.rehearsal ? 'rehearsal of ' : ''}${args.version}`;
  const count = result.reasons.length;
  const reasons = `${String(count)} ${count === 1 ? 'reason' : 'reasons'}`;
  return { code: 0, stdout: [result.verdict === 'verified' ? `::notice ${TITLE}::${label} verified`
    : `::warning ${TITLE}::${label} guided: ${reasons}`], stderr: [] };
}

if (require.main === module) {
  void runIntakeReport(process.argv.slice(2), process.cwd()).then((outcome) => {
    for (const line of outcome.stdout) process.stdout.write(`${line}\n`);
    for (const line of outcome.stderr) process.stderr.write(`${line}\n`);
    process.exitCode = outcome.code;
  });
}
