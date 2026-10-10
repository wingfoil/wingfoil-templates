// `npm run feedback:note` (task-015, F5.4, wingfoil-cli rule 8): the feedback note a publication of a
// pack WingFoil bundles, or a change of schema/, produces, so that WingFoil's release planning sees
// it. Whether a pack is bundled is WingFoil's decision (dl-001), stated at each release.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { CatalogError, loadCatalog } from './catalog';
import { InboxError, newestSchemaRecord, readNotes, writeNote } from './feedback-inbox';
import { schemaListing } from './schema-digest';
import { YamlError } from './yaml-load';

type Doc = Record<string, unknown>;

export class FeedbackNoteError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

/** An element id, `task-<nnn>` or `prel-<nnn>`, alone or with its slug. */
const FROM = /^((?:task|prel)-\d{3})(?:-[a-z0-9.-]+)?$/;

/** The element a note comes from, as the note's first line names it: `task-<nnn>` or `prel-<nnn>`. */
export function fromElement(value: string | undefined, only?: 'prel'): string {
  const id = value === undefined ? undefined : FROM.exec(value)?.[1];
  if (id === undefined || (only !== undefined && !id.startsWith(`${only}-`))) {
    const expected = only === undefined ? '<task-<nnn> | prel-<nnn>>' : '<prel-<nnn>>';
    throw new FeedbackNoteError(3, `--from ${expected} is required`);
  }
  return id;
}

/** The governance pin of package.json, the WingFoil build this repository runs. */
function governancePin(tree: string): string {
  const manifest = JSON.parse(readFileSync(join(tree, 'package.json'), 'utf8')) as {
    devDependencies?: Record<string, string>;
  };
  return manifest.devDependencies?.['wingfoil'] ?? '0.0.0';
}

/** The note of a published pack that WingFoil bundles; its id. */
export function writePublishedNote(tree: string, release: string, from: string): string {
  const at = release.lastIndexOf('@');
  const packId = release.slice(0, at);
  const version = release.slice(at + 1);
  if (at <= 0 || version === '') {
    throw new FeedbackNoteError(3, `--published ${JSON.stringify(release)} is not <id>@<version>`);
  }
  let catalog;
  try {
    catalog = loadCatalog(join(tree, 'catalog.yaml'));
  } catch (error) {
    if (error instanceof CatalogError || error instanceof YamlError) {
      throw new FeedbackNoteError(2, `catalog.yaml: ${error.message}`);
    }
    throw error;
  }
  const pack = ((catalog.raw['packs'] as Doc[] | undefined) ?? []).find((entry) =>
    entry['id'] === packId);
  const entry = ((pack?.['versions'] as Doc[] | undefined) ?? []).find((candidate) =>
    candidate['version'] === version);
  if (entry === undefined) {
    throw new FeedbackNoteError(1, `catalog.yaml lists no version ${version} of ${packId}`);
  }
  for (const field of ['commit', 'digest', 'wingfoil']) {
    if (typeof entry[field] !== 'string') {
      throw new FeedbackNoteError(1, `catalog.yaml: ${release} has no ${field}`);
    }
  }
  return writeNote(tree, {
    title: `Pack \`${release}\` published, for the bundled copy`,
    slug: `pack-${packId.replace(/\//g, '-')}-${version}-published`,
    from,
    wingfoilVersion: governancePin(tree),
    observed: [
      `WingFoil-Templates published \`${release}\`:`,
      `- tag \`${release}\`, at commit \`${String(entry['commit'])}\`;`,
      `- digest \`${String(entry['digest'])}\`;`,
      `- computed WingFoil range \`${String(entry['wingfoil'])}\` (\`catalog.yaml\`).`,
    ].join('\n'),
    expected: 'WingFoil bundles this pack in its npm package (dl-001). Its advance-bundled-packs '
      + `release step considers \`${release}\` as the newest compatible version of the bundled `
      + 'copy.',
  });
}

function changedFiles(previous: string, current: string): string[] {
  const parse = (listing: string): Map<string, string> => new Map(listing.split('\n')
    .filter((line) => line !== '').map((line) => [line.slice(66), line.slice(0, 64)]));
  const before = parse(previous);
  const after = parse(current);
  const changes: string[] = [];
  for (const [path, sha] of after) {
    if (!before.has(path)) changes.push(`- added: \`schema/${path}\``);
    else if (before.get(path) !== sha) changes.push(`- changed: \`schema/${path}\``);
  }
  for (const path of before.keys()) {
    if (!after.has(path)) changes.push(`- removed: \`schema/${path}\``);
  }
  return changes;
}

/** The note of a schema change; its id, or undefined when schema/ is as recorded. */
export function writeSchemaNote(tree: string, from: string): string | undefined {
  const current = schemaListing(tree);
  if (current === undefined) throw new FeedbackNoteError(1, 'the tree has no schema/');
  const recorded = newestSchemaRecord(readNotes(tree));
  if (recorded?.digest === current.digest) return undefined;
  const short = current.digest.slice('sha256:'.length, 'sha256:'.length + 12);
  const since = recorded === undefined ? ['- every file: no schema note records a digest yet.']
    : [`Changed since F-${String(recorded.number).padStart(3, '0')}:`, '',
      ...changedFiles(recorded.listing, current.listing)];
  return writeNote(tree, {
    title: `The pack schemas changed (sha256:${short})`,
    slug: `schema-${short}`,
    from,
    wingfoilVersion: governancePin(tree),
    observed: [
      'The pack schemas under `schema/`, the contract with the WingFoil CLI (spec-001), changed.',
      '', `Schema digest: ${current.digest}`, '', '```text', current.listing.trimEnd(), '```', '',
      ...since,
    ].join('\n'),
    expected: 'WingFoil reads the new contract at its release planning (`wingfoil-cli` rule 8): '
      + '`schema/` is the machine-readable half of the pack format.',
  });
}

export interface FeedbackNoteResult {
  code: number;
  lines: string[];
}

export function runFeedbackNote(argv: string[]): FeedbackNoteResult {
  try {
    let values;
    try {
      values = parseArgs({ args: argv, options: { published: { type: 'string' },
        schema: { type: 'boolean' }, from: { type: 'string' }, tree: { type: 'string' } },
      strict: true, allowPositionals: false }).values;
    } catch (error) {
      throw new FeedbackNoteError(3, error instanceof Error ? error.message : String(error));
    }
    if ((values.published === undefined) === (values.schema !== true)) {
      throw new FeedbackNoteError(3, 'give exactly one of --published <id>@<version> and --schema');
    }
    const from = fromElement(values.from);
    const tree = values.tree ?? process.cwd();
    if (values.published !== undefined) {
      return { code: 0, lines: [`${writePublishedNote(tree, values.published, from)} written`] };
    }
    const id = writeSchemaNote(tree, from);
    return { code: 0, lines: [id === undefined
      ? 'schema/ is as the newest schema note records: no note written' : `${id} written`] };
  } catch (error) {
    if (error instanceof FeedbackNoteError) return { code: error.code, lines: [error.message] };
    if (error instanceof InboxError) return { code: 2, lines: [error.message] };
    if ((error as NodeJS.ErrnoException).code !== undefined) {
      return { code: 2, lines: [error instanceof Error ? error.message : String(error)] };
    }
    throw error;
  }
}
