// `intake:prepare` (task-080, plan-065 task B): the mechanical part of a WingFoil release's record
// in `wingfoil-release-intake`, written by a deterministic script: the pin folder and its lockfile,
// the compat.yaml row (and the golden fixture's, dl-010), the catalog ranges and the index's root
// outputs. Every check and every file's new text come before the first write: a refusal or a failed
// step writes nothing. The lockfile comes from an injected resolver, the only step outside the
// process; the CLI's runs npm (intake-prepare-cli.ts).
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { gt } from 'semver';
import { isMap, isScalar, isSeq, parse, parseDocument } from 'yaml';
import type { Node, Scalar, YAMLMap } from 'yaml';

type YamlMap = YAMLMap<unknown, unknown>;

import { checkPins } from './check-pins';
import { compatFrom } from './compat';
import type { Compat } from './compat';
import { indexOutputs, rootOutputs } from './index';
import { byBytes, isDoc } from './index-data';
import { checkRepositoryTop, overlay, workingTree } from './index-source';
import { computeRange } from './range';
import type { CompatRelease } from './range';

/** The golden fixture's compat.yaml, equal to the root's (dl-010). */
export const GOLDEN_COMPAT = 'tests/fixtures/compose/tree/compat.yaml';
/** The fixed notes of a prepared row, which the intake replaces (dl-042 I3); greppable. */
export const NOTES_PLACEHOLDER = 'Prepared by intake:prepare; the intake writes this sentence '
  + '(dl-042 I3).';

/** The pin's package.json text → its package-lock.json text; throws when it cannot resolve. */
export type Resolver = (manifest: string) => string;

export interface PrepareResult { code: 0 | 1; lines: string[] }

export const STRICT = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

type Doc = Record<string, unknown>;

/** A refusal or a failed step, before any write. */
export class Refusal extends Error {}

/** The tree must be its git repository's top level: the index reads the tags. */
export function checkTop(tree: string): void {
  try {
    checkRepositoryTop(tree);
  } catch (error) {
    throw new Refusal(error instanceof Error ? error.message : String(error));
  }
}

export function text(tree: string, path: string): string | undefined {
  return workingTree(tree).read(path);
}

export function required(tree: string, path: string): string {
  const content = text(tree, path);
  if (content === undefined) throw new Refusal(`${path} is missing`);
  return content;
}

export function loadCompatText(content: string, label: string): Compat {
  try {
    return compatFrom(parse(content) as unknown);
  } catch (error) {
    throw new Refusal(`${label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** The source text of a node, which must be in flow style (`{ … }` or `[ … ]`). */
function flowText(content: string, node: unknown, what: string): string {
  if (!(isMap(node) || isSeq(node)) || node.flow !== true || node.range === undefined
    || node.range === null) {
    throw new Refusal(`compat.yaml: the newest release's ${what} is not in flow style`);
  }
  return content.slice(node.range[0], node.range[1]);
}

/** The last release row of compat.yaml and the offset of its line, refusing text after it. */
export function lastRow(content: string): { row: YamlMap; start: number } {
  const document = parseDocument(content);
  const root = document.contents;
  const last = isMap(root) ? root.items[root.items.length - 1] : undefined;
  const releases = last?.value;
  if (!isScalar(last?.key) || last.key.value !== 'releases' || !isSeq(releases)
    || releases.range === undefined || releases.range === null
    || content.slice(releases.range[2]).length > 0) {
    throw new Refusal('compat.yaml: text follows the last release row');
  }
  const newest = releases.items[releases.items.length - 1];
  if (!isMap(newest)) throw new Refusal('compat.yaml: the newest release is not a mapping');
  // An indented comment after the last row falls inside the sequence's range: refused too.
  const lastValue = newest.items[newest.items.length - 1]?.value as Node | null | undefined;
  const rowEnd = lastValue?.range?.[2] ?? releases.range[2];
  if (content.slice(rowEnd, releases.range[2]).trim().length > 0) {
    throw new Refusal('compat.yaml: text follows the last release row');
  }
  const at = newest.range?.[0] ?? 0;
  return { row: newest, start: content.lastIndexOf('\n', at) + 1 };
}

/** The row appended after the last one: reads and capabilities as the newest release's text. */
function preparedRow(content: string, version: string): string {
  const newest = lastRow(content).row;
  const field = (key: string): unknown =>
    newest.items.find((pair) => isScalar(pair.key) && pair.key.value === key)?.value;
  return `  - wingfoil: ${version}\n`
    + '    format_key: true\n'
    + `    reads: ${flowText(content, field('reads'), 'reads')}\n`
    + `    capabilities: ${flowText(content, field('capabilities'), 'capabilities')}\n`
    + `    notes: ${JSON.stringify(NOTES_PLACEHOLDER)}\n`;
}

/** The scalar styles a range is rewritten in, in place. */
const REWRITABLE = ['PLAIN', 'QUOTE_DOUBLE', 'QUOTE_SINGLE'];

export interface RangeSlot { label: string; scalar: Scalar; formats: Record<string, number>;
  capabilities: string[] }

/** Each version entry's `wingfoil` scalar in catalog.yaml, and what its range is computed from. */
export function rangeSlots(content: string): RangeSlot[] {
  const document = parseDocument(content);
  if (document.errors.length > 0) throw new Refusal('catalog.yaml: not valid YAML');
  const packs = document.get('packs', true) as Node | undefined;
  if (!isSeq(packs)) throw new Refusal('catalog.yaml has no packs list');
  const slots: RangeSlot[] = [];
  for (const pack of packs.items) {
    if (!isMap(pack)) continue;
    const id = String(pack.get('id'));
    const versions = pack.get('versions', true);
    if (!isSeq(versions)) continue;
    for (const entry of versions.items) {
      if (!isMap(entry)) continue;
      const scalar = entry.get('wingfoil', true);
      if (scalar === undefined) continue;
      // Only a plain or quoted scalar is rewritten in place; an alias or a block scalar is refused.
      const label = `${id}@${String(entry.get('version'))}`;
      if (!isScalar(scalar) || !REWRITABLE.includes(scalar.type ?? '')) {
        throw new Refusal(`catalog.yaml: ${label}: the range is not a plain or quoted scalar`);
      }
      const data = entry.toJSON() as Doc;
      const formats = isDoc(data['formats']) ? data['formats'] as Record<string, number> : {};
      const capabilities = Array.isArray(data['requires_capabilities'])
        ? data['requires_capabilities'].map(String) : [];
      slots.push({ label, scalar, formats, capabilities });
    }
  }
  return slots;
}

function range(slot: RangeSlot, releases: CompatRelease[]): string {
  return computeRange({ formats: slot.formats, requires_capabilities: slot.capabilities },
    releases);
}

/** catalog.yaml with every range recomputed: only the scalars that change, their quoting kept. */
export function recomputedCatalog(content: string, slots: RangeSlot[],
  releases: CompatRelease[]): string {
  let result = content;
  const edits = slots.map((slot) => ({ slot, value: range(slot, releases) }))
    .filter(({ slot, value }) => slot.scalar.value !== value)
    .sort((a, b) => (b.slot.scalar.range?.[0] ?? 0) - (a.slot.scalar.range?.[0] ?? 0));
  for (const { slot, value } of edits) {
    const [start, end] = slot.scalar.range ?? [0, 0];
    // A plain `>=…` would read as a block scalar: a plain or double-quoted scalar is written
    // double-quoted, a single-quoted one stays single-quoted.
    const quoted = slot.scalar.type === 'QUOTE_SINGLE' ? `'${value}'` : JSON.stringify(value);
    result = result.slice(0, start) + quoted + result.slice(end);
  }
  return result;
}

function manifestFor(version: string): string {
  return `${JSON.stringify({
    name: `wingfoil-matrix-${version}`,
    private: true,
    description: `WingFoil ${version} as the compatibility matrix installs it: exact pin, `
      + 'committed lockfile',
    dependencies: { wingfoil: version },
  }, null, 2)}\n`;
}

/** The resolver's lockfile, checked as check:pins checks a matrix release. */
function checkedLockfile(manifest: string, resolve: Resolver): string {
  let lockText: string;
  try {
    lockText = resolve(manifest);
  } catch (error) {
    throw new Refusal(`the lockfile: ${error instanceof Error ? error.message : String(error)}`);
  }
  let lockfile: unknown;
  try {
    lockfile = JSON.parse(lockText) as unknown;
  } catch {
    throw new Refusal('the lockfile: not JSON');
  }
  if (!isDoc(lockfile) || !isDoc(lockfile['packages'])
    || typeof lockfile['lockfileVersion'] !== 'number' || lockfile['lockfileVersion'] < 2) {
    throw new Refusal('the lockfile: no `packages` map (lockfileVersion < 2)');
  }
  // check-pins' matrix rule (wingfoil only, at the folder's version) holds by construction of
  // the manifest; the lockfile is checked as check:pins checks it.
  const problems = checkPins(JSON.parse(manifest) as unknown, lockfile);
  if (problems.length > 0) throw new Refusal(`the lockfile: ${problems.join('; ')}`);
  return lockText;
}

/** Every catalog.yaml range equal to computeRange from compat.yaml's releases. */
export function checkRanges(slots: RangeSlot[], releases: CompatRelease[]): void {
  for (const slot of slots) {
    const expected = range(slot, releases);
    if (slot.scalar.value !== expected) {
      throw new Refusal(`catalog.yaml: ${slot.label}: the range `
        + `${JSON.stringify(slot.scalar.value)} recomputes from compat.yaml to `
        + JSON.stringify(expected));
    }
  }
}

/** The index up to date on the tree as it stands. */
export function checkIndex(tree: string): void {
  let current: Map<string, string>;
  try {
    current = indexOutputs(tree);
  } catch (error) {
    throw new Refusal(`the index: ${error instanceof Error ? error.message : String(error)}`);
  }
  const stale = [...current].filter(([path, content]) => text(tree, path) !== content)
    .map(([path]) => path).sort(byBytes);
  if (stale.length > 0) throw new Refusal(`the index is not up to date: ${stale.join(', ')}`);
}

/** The index's root outputs over the tree with new catalog.yaml and compat.yaml texts. */
export function rootIndex(tree: string, catalog: string, compat: string): Map<string, string> {
  try {
    return rootOutputs(tree, overlay(workingTree(tree),
      { 'catalog.yaml': catalog, 'compat.yaml': compat }));
  } catch (error) {
    throw new Refusal(`the index: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/** Every file's new text, computed and checked before any write. */
function plan(tree: string, version: string, resolve: Resolver): Map<string, string> {
  if (!STRICT.test(version)) throw new Refusal(`${JSON.stringify(version)}: not a strict X.Y.Z`);
  checkTop(tree);
  const compatText = required(tree, 'compat.yaml');
  if (compatText.includes('\r')) throw new Refusal('compat.yaml: not LF line endings');
  const compat = loadCompatText(compatText, 'compat.yaml');
  const recorded = compat.releases.map((release) => release.wingfoil);
  if (recorded.includes(version)) {
    throw new Refusal(`${version} is already recorded in compat.yaml`);
  }
  const newest = recorded[recorded.length - 1];
  if (newest !== undefined && !gt(version, newest)) {
    throw new Refusal(`${version} is not greater than the newest recorded release, ${newest}`);
  }
  if (text(tree, GOLDEN_COMPAT) !== compatText) {
    throw new Refusal(`${GOLDEN_COMPAT} is not byte-equal to compat.yaml (dl-010)`);
  }
  const pin = `src/matrix/wingfoil-${version}`;
  if (existsSync(join(tree, pin))) throw new Refusal(`${pin} already exists`);
  const row = preparedRow(compatText, version);
  const catalogText = required(tree, 'catalog.yaml');
  const slots = rangeSlots(catalogText);
  checkRanges(slots, compat.releases);
  checkIndex(tree);

  const newCompat = `${compatText.endsWith('\n') ? compatText : `${compatText}\n`}${row}`;
  const releases = loadCompatText(newCompat, 'the prepared compat.yaml').releases;
  const newCatalog = recomputedCatalog(catalogText, slots, releases);
  const index = rootIndex(tree, newCatalog, newCompat);
  const manifest = manifestFor(version);
  const lockfile = checkedLockfile(manifest, resolve);
  return new Map([
    ...index,
    ['catalog.yaml', newCatalog],
    ['compat.yaml', newCompat],
    [GOLDEN_COMPAT, newCompat],
    [`${pin}/package.json`, manifest],
    [`${pin}/package-lock.json`, lockfile],
  ]);
}

export function prepareIntake(tree: string, version: string, resolve: Resolver): PrepareResult {
  let files: Map<string, string>;
  let changed: string[];
  try {
    files = plan(tree, version, resolve);
    changed = [...files.keys()].filter((path) => text(tree, path) !== files.get(path))
      .sort(byBytes);
  } catch (error) {
    // Every error before the first write is a refusal with its reason, never a stack trace.
    const why = error instanceof Error ? error.message : String(error);
    return { code: 1, lines: [`intake:prepare: ${why}, nothing written`] };
  }
  const lines: string[] = [];
  for (const path of changed) {
    try {
      mkdirSync(dirname(join(tree, path)), { recursive: true });
      writeFileSync(join(tree, path), files.get(path) ?? '');
    } catch (error) {
      // The one exception to "nothing written": an I/O error during the writes.
      const why = error instanceof Error ? error.message : String(error);
      return { code: 1, lines: [...lines,
        `intake:prepare: writing ${path}: ${why}; the files above were written`] };
    }
    lines.push(`wrote ${path}`);
  }
  return { code: 0, lines };
}
