// The intake report (task-081, plan-065 task C, ruling 2, dl-042): a prepared release reported
// **verified** or **guided**. Verified only when prepare and verify succeeded, the class is a
// patch, and the release's CHANGELOG section (read at WingFoil's tag) has fixes only: no heading
// outside the known ones, no `Breaking`, no `Added` or `Changed` entry, no line naming `format` or
// a kind of compat.yaml. Each reason is fixed text with line numbers, never the CHANGELOG's text;
// the section is shown in a fence it cannot close, as the guided intake's checklist. `report` is
// pure; the fetch is injected.
import { STRICT } from './intake-prepare';

/** The checks of `intake.yml`'s verify job, in its order: ci.yml's self-test. */
export const CHECK_IDS = ['test', 'lint', 'pins', 'schemas', 'packs', 'site', 'audit-root',
  'audit-pins', 'validate', 'golden', 'software-exit', 'scrum-exit', 'kanban-exit', 'runs',
  'publication'] as const;
/** The Node.js versions verify runs on: the floor (adr-002) and the newest 22.x checked. */
export const NODES = ['22.12.0', '22.21.0'] as const;
const OUTCOMES = ['success', 'failure', 'cancelled', 'skipped'];

export const CHANGELOG_TIMEOUT_MS = 30_000;
export const CHANGELOG_MAX_BYTES = 1 << 20;

export interface CheckLeg { node: string; checks: Record<string, string> }
export type Fetched = { ok: true; text: string } | { ok: false; why: string };
export interface ReportInput {
  version: string; class: string; prepare: string; verify: string; rehearsal: boolean;
  base?: string | undefined; sums?: string[] | undefined; legs: CheckLeg[]; changelog: Fetched;
  kinds: Record<string, string>; packsByKind: Record<string, string[]>;
}
export interface Report { verdict: 'verified' | 'guided'; reasons: string[]; markdown: string }

/** The CHANGELOG at WingFoil's tag: the owner, the repository and the path fixed in code. */
export function changelogUrl(version: string): string {
  if (!STRICT.test(version)) throw new Error('not a strict X.Y.Z');
  return `https://raw.githubusercontent.com/wingfoil/wingfoil/v${version}/CHANGELOG.md`;
}

/** A verify leg's checks.json, or undefined when it is not one. */
export function parseChecks(text: string): CheckLeg | undefined {
  let data: unknown;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return undefined;
  const { node, checks } = data as { node?: unknown; checks?: unknown };
  if (typeof node !== 'string' || !(NODES as readonly string[]).includes(node)) return undefined;
  if (typeof checks !== 'object' || checks === null || Array.isArray(checks)) return undefined;
  const entries = Object.entries(checks as Record<string, unknown>);
  for (const [id, outcome] of entries) {
    if (!(CHECK_IDS as readonly string[]).includes(id)) return undefined;
    if (typeof outcome !== 'string' || !OUTCOMES.includes(outcome)) return undefined;
  }
  return { node, checks: Object.fromEntries(entries) as Record<string, string> };
}

/** The CHANGELOG over HTTPS, no token, no redirect, a timeout and a size bound. */
export async function fetchChangelog(version: string, fetchImpl: typeof fetch,
  options: { timeoutMs?: number; maxBytes?: number } = {}): Promise<Fetched> {
  const maxBytes = options.maxBytes ?? CHANGELOG_MAX_BYTES;
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, options.timeoutMs ?? CHANGELOG_TIMEOUT_MS);
  try {
    const response = await fetchImpl(changelogUrl(version),
      { redirect: 'error', signal: controller.signal });
    if (response.status !== 200) {
      await response.body?.cancel();
      return { ok: false, why: `HTTP ${String(response.status)}` };
    }
    const chunks: Buffer[] = [];
    let size = 0;
    if (response.body !== null) {
      for await (const value of response.body as AsyncIterable<Uint8Array>) {
        size += value.byteLength;
        if (size > maxBytes) {
          controller.abort();
          return { ok: false, why: 'over the size bound' };
        }
        chunks.push(Buffer.from(value));
      }
    }
    return { ok: true, text: new TextDecoder().decode(Buffer.concat(chunks)) };
  } catch {
    return { ok: false, why: timedOut ? 'a timeout' : 'a network error or a redirect' };
  } finally {
    clearTimeout(timer);
  }
}

/** CRLF made LF, every control character but tab and newline removed. */
function clean(text: string): string {
  return text.replace(/\r\n/g, '\n')
    // eslint-disable-next-line no-control-regex -- the control characters are what is removed
    .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '');
}

interface Section { lines: string[]; first: number }

/** The lines from `## [<version>]` to the next `## ` line; `first` is its line number. */
function sectionOf(text: string, version: string): Section | undefined {
  const lines = clean(text).split('\n');
  const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));
  if (start < 0) return undefined;
  const after = lines.slice(start + 1).findIndex((line) => line.startsWith('## '));
  const end = after < 0 ? lines.length : start + 1 + after;
  return { lines: lines.slice(start, end), first: start + 1 };
}

const KNOWN = [/^Added$/i, /^Changed$/i, /^Fixed$/i, /^Upgrading from\b/i, /^For contributors$/i];
const NAMED = ['Removed', 'Security', 'Deprecated'];

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** The rules a kind's value gives: its key in backticks, then its file name or description. */
function kindPatterns(key: string, value: string): RegExp[] {
  const patterns = [new RegExp(`\`${escapeRegExp(key)}\``, 'i')];
  if (value.endsWith('.yaml')) {
    const name = value.split('/').pop() ?? value;
    patterns.push(new RegExp(`(?<![\\w.-])${escapeRegExp(name)}(?![\\w-])`, 'i'));
  } else {
    patterns.push(new RegExp(escapeRegExp(value.replace(/^(a|an|the) /i, '')), 'i'));
  }
  return patterns;
}

function lineList(numbers: number[]): string {
  return `${numbers.length === 1 ? 'line' : 'lines'} ${numbers.join(', ')}`;
}

/** The bar's reasons for a section, each with its CHANGELOG line numbers; and the kinds named. */
function sectionReasons(section: Section, kinds: Record<string, string>):
  { reasons: string[]; kindsNamed: string[] } {
  const reasons: string[] = [];
  const named = new Map<string, number[]>();
  const unknown: number[] = [];
  const breaking: number[] = [];
  const entries: number[] = [];
  const format: number[] = [];
  const hits = new Map<string, number[]>();
  let heading = '';
  section.lines.forEach((line, offset) => {
    const number = section.first + offset;
    const match = /^(#{3,4})\s+(.*)$/.exec(line);
    if (match !== null) {
      const [, hashes = '', title = ''] = match;
      if (/breaking/i.test(title)) breaking.push(number);
      if (hashes === '###') {
        heading = title.trim();
        const name = NAMED.find((one) => one.toLowerCase() === heading.toLowerCase());
        if (name !== undefined) named.set(name, [...(named.get(name) ?? []), number]);
        else if (!KNOWN.some((pattern) => pattern.test(heading))) unknown.push(number);
      }
    } else if (offset > 0 && line.trim() !== '' && /^(added|changed)$/i.test(heading)) {
      entries.push(number);
    }
    if (/\bformats?\b/i.test(line)) format.push(number);
    for (const [key, value] of Object.entries(kinds)) {
      if (kindPatterns(key, value).some((pattern) => pattern.test(line))) {
        hits.set(key, [...(hits.get(key) ?? []), number]);
      }
    }
  });
  for (const [name, numbers] of named) reasons.push(`${lineList(numbers)}: a \`${name}\` heading`);
  if (unknown.length > 0) reasons.push(`${lineList(unknown)}: a heading not in the known list`);
  if (breaking.length > 0) reasons.push(`${lineList(breaking)}: a heading containing Breaking`);
  if (entries.length > 0) reasons.push(`${lineList(entries)}: \`Added\` or \`Changed\` entries`);
  if (format.length > 0) reasons.push(`${lineList(format)}: the word format`);
  for (const [key, numbers] of hits) reasons.push(`${lineList(numbers)}: the kind \`${key}\``);
  return { reasons, kindsNamed: [...hits.keys()] };
}

function known(result: string): string {
  return OUTCOMES.includes(result) ? result : 'unknown';
}

/** A fence longer than any backtick run in the text, at least three. */
function fence(text: string): string {
  const longest = Math.max(0, ...[...text.matchAll(/`+/g)].map((run) => run[0].length));
  return '`'.repeat(Math.max(3, longest + 1));
}

export function report(input: ReportInput): Report {
  const reasons: string[] = [];
  if (input.prepare !== 'success') {
    reasons.push(`the prepare job's result is \`${known(input.prepare)}\``);
  }
  if (input.verify !== 'success') {
    reasons.push(`the verify job's result is \`${known(input.verify)}\``);
  }
  const kind = ['patch', 'minor', 'major'].includes(input.class) ? input.class : 'unknown';
  if (kind !== 'patch') reasons.push(`the class is \`${kind}\`, not \`patch\``);
  let section: Section | undefined;
  let kindsNamed: string[] = [];
  if (!input.changelog.ok) {
    reasons.push(`the CHANGELOG could not be read: ${input.changelog.why}`);
  } else {
    section = sectionOf(input.changelog.text, input.version);
    if (section === undefined) {
      reasons.push(`the CHANGELOG has no section for ${input.version}`);
    } else {
      const found = sectionReasons(section, input.kinds);
      reasons.push(...found.reasons);
      kindsNamed = found.kindsNamed;
    }
  }
  const verdict = reasons.length === 0 ? 'verified' : 'guided';
  const out: string[] = [];
  if (input.rehearsal) out.push(`Rehearsal of ${input.version}: never for intake (dl-042 I1)`, '');
  out.push(`## WingFoil ${input.version}: ${verdict}`, '',
    `- Class: ${kind}`,
    `- Base: ${input.base ?? 'unknown'}`,
    `- prepare: ${known(input.prepare)}`,
    `- verify: ${known(input.verify)}`);
  for (const node of NODES) {
    const leg = input.legs.find((one) => one.node === node);
    out.push(leg === undefined ? `- verify on Node.js ${node}: no checks`
      : `- verify on Node.js ${node}: ${Object.entries(leg.checks)
        .map(([id, outcome]) => `${id} ${outcome}`).join(', ')}`);
  }
  out.push('', '### Reasons', '');
  out.push(...(reasons.length === 0 ? ['- none'] : reasons.map((reason) => `- ${reason}`)));
  out.push('', '### Artifact', '');
  if (input.sums === undefined) out.push('no artifact');
  else out.push('```text', ...input.sums, '```');
  out.push('', '### Packs per kind named', '');
  if (kindsNamed.length === 0) out.push('- none');
  for (const kind of kindsNamed) {
    const packs = input.packsByKind[kind] ?? [];
    out.push(`- \`${kind}\`: ${packs.length === 0 ? 'no pack' : packs.join(', ')}`);
  }
  out.push('', '### The CHANGELOG section, a checklist for a guided intake', '');
  if (section === undefined) {
    out.push('not read');
  } else {
    const body = section.lines.join('\n');
    const marks = fence(body);
    out.push(marks, body, marks);
  }
  out.push('');
  return { verdict, reasons, markdown: out.join('\n') };
}
