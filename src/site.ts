// `npm run site -- [--tree <dir>] --out <dir>` (spec-002 §5, task-024): the search page, a static
// site built from the tree's catalog-index.json and llms.txt as they are. It escapes every text of
// the index, renders no Markdown, loads nothing from another origin, and copies the vendored
// script only when its sha256 is the one recorded. Deterministic: two builds are byte-identical.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { byBytes, isDoc } from './index-data';
import type { CatalogIndex, IndexPack } from './index-model';
import { axisHeading, firstSentence, profilePacks } from './index-render';
import { indexSchemaDocument, indexSchemaErrors } from './index-schema';
import { readmeOnGithub } from './index-urls';
import { packAnchor } from './readme';

/** index/vendor/ at the repository root, from the compiled module under dist/src/. */
export const VENDOR = join(__dirname, '..', '..', 'index', 'vendor');

export const CSP = 'default-src \'none\'; script-src \'self\'; style-src \'self\'; '
  + 'img-src \'self\'; base-uri \'none\'; form-action \'none\'';

export interface SiteResult {
  /** 0 written, 1 a check fails, 2 an I/O error, 3 bad usage. */
  code: number;
  lines: string[];
}

export interface SiteOptions {
  /** The folder of search.js and search.js.sha256; tests give a copy. */
  vendor?: string;
  /** The axes, in order, in place of the index schema's; tests give a short list. */
  axes?: string[];
}

class SiteError extends Error {
  constructor(readonly code: number, message: string) {
    super(message);
  }
}

/** Text for HTML: in a text node or in a double-quoted attribute value. */
export function html(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const CSS = `body { font-family: system-ui, sans-serif; margin: 0; color: #1d1d1f; background: #fff; }
main { max-width: 72rem; margin: 0 auto; padding: 1rem 1.5rem 3rem; }
h1 { font-size: 1.6rem; }
h2 { font-size: 1.2rem; margin-top: 2rem; }
table { border-collapse: collapse; width: 100%; font-size: 0.95rem; }
th, td { border-bottom: 1px solid #ddd; padding: 0.4rem 0.5rem; text-align: left; vertical-align: top; }
th { background: #f5f5f7; }
form { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 1rem 0; }
form[hidden] { display: none; }
label { display: flex; flex-direction: column; font-size: 0.85rem; gap: 0.2rem; }
input, select { font: inherit; padding: 0.3rem; }
code { font-family: ui-monospace, monospace; }
`;

function axisOf(pack: IndexPack): string {
  return pack.axis ?? 'foundation';
}

/**
 * The axes in the order of the index schema's `axis` enum (catalog.yaml's order, null being the
 * foundation): the site reads the index only, and the schema has checked every pack's axis.
 */
function axesOf(): string[] {
  const schema = indexSchemaDocument();
  const pack = isDoc(schema['$defs']) && isDoc(schema['$defs']['pack']) ? schema['$defs']['pack']
    : {};
  const axis = isDoc(pack['properties']) && isDoc(pack['properties']['axis'])
    ? pack['properties']['axis'] : {};
  const values = Array.isArray(axis['enum']) ? axis['enum'] : [];
  return values.map((value) => value === null ? 'foundation' : String(value));
}

function code(text: string): string {
  return `<code>${html(text)}</code>`;
}

function packRow(pack: IndexPack, withSlot: boolean): string {
  const latest = pack.versions.find((version) => version.version === pack.latest);
  const text = [pack.title, pack.description, pack.excerpt, ...pack.profiles].join(' ');
  const cells = [`<td id="${html(packAnchor(pack.id))}">${code(pack.id)}</td>`,
    `<td>${html(firstSentence(pack.description))}</td>`];
  if (withSlot) cells.push(`<td>${code(pack.slot ?? '')}</td>`);
  cells.push(`<td>${html(pack.status)}</td>`, `<td>${html(pack.latest)}</td>`,
    `<td>${html(latest?.wingfoil ?? '')}</td>`,
    `<td><a href="${html(readmeOnGithub(latest?.tag ?? '', pack.id))}">README</a></td>`);
  return `<tr data-pack="${html(pack.id)}" data-text="${html(text)}" data-axis="${html(axisOf(pack))}" `
    + `data-slot="${html(pack.slot ?? '')}" data-status="${html(pack.status)}" `
    + `data-profiles="${html(JSON.stringify(pack.profiles))}">${cells.join('')}</tr>`;
}

function table(header: string[], rows: string[]): string[] {
  return ['<table>', `<thead><tr>${header.map((cell) => `<th>${cell}</th>`).join('')}</tr></thead>`,
    '<tbody>', ...rows, '</tbody>', '</table>'];
}

function axisSection(index: CatalogIndex, axis: string): string[] {
  const packs = index.packs.filter((pack) => axisOf(pack) === axis);
  const withSlot = axis === 'phase';
  const header = ['Pack', 'Summary', ...(withSlot ? ['Slot'] : []), 'Status', 'Latest',
    'WingFoil', 'README'];
  return [`<h2>${html(axisHeading(axis === 'foundation' ? null : axis))}</h2>`,
    ...(packs.length === 0 ? ['<p>None published yet.</p>']
      : table(header, packs.map((pack) => packRow(pack, withSlot))))];
}

function select(id: string, label: string, values: string[]): string {
  const options = ['<option value="">All</option>',
    ...values.map((value) => `<option value="${html(value)}">${html(value)}</option>`)];
  return `<label>${label} <select id="${id}">${options.join('')}</select></label>`;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter((value) => value !== ''))].sort(byBytes);
}

function profilesSection(index: CatalogIndex): string[] {
  const rows = [...profilePacks(index)].map(([profile, packs]) => `<tr><td>${html(profile)}</td>`
    + `<td>${packs.map(code).join(', ')}</td></tr>`);
  return ['<h2>Profiles</h2>', ...(rows.length === 0 ? ['<p>None yet.</p>']
    : table(['Profile', 'Packs'], rows))];
}

/** index.html for an index, its axes in the order given. */
export function renderSite(index: CatalogIndex, axes: string[]): string {
  const presets = index.presets.map((preset) => `<tr><td>${code(preset.id)}</td>`
    + `<td>${html(preset.title)}</td><td>${html(preset.profile ?? '—')}</td>`
    + `<td>${preset.packs.map(code).join(', ')}</td></tr>`);
  const transitions = index.transitions.map((transition) => `<tr><td>${code(transition.id)}</td>`
    + `<td>${code(transition.from)}</td><td>${code(transition.to)}</td></tr>`);
  const lines = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    `<meta http-equiv="Content-Security-Policy" content="${CSP}">`,
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>WingFoil template catalog</title>',
    '<link rel="stylesheet" href="site.css">',
    '</head>',
    '<body>',
    '<main>',
    '<h1>WingFoil template catalog</h1>',
    '<p>The published packs of the official WingFoil template catalog, by axis. Agents start at '
      + '<a href="llms.txt">llms.txt</a>; the machine index is '
      + '<a href="catalog-index.json">catalog-index.json</a>.</p>',
    '<form id="search" hidden>',
    '<label>Search <input type="search" id="query" autocomplete="off"></label>',
    select('axis', 'Axis', uniqueSorted(index.packs.map(axisOf))),
    select('slot', 'Slot', uniqueSorted(index.packs.map((pack) => pack.slot ?? ''))),
    select('profile', 'Profile', uniqueSorted(index.packs.flatMap((pack) => pack.profiles))),
    select('status', 'Status', uniqueSorted(index.packs.map((pack) => pack.status))),
    '</form>',
    ...axes.flatMap((axis) => axisSection(index, axis)),
    '<h2>Presets</h2>',
    ...(presets.length === 0 ? ['<p>None yet.</p>']
      : table(['Preset', 'Title', 'Profile', 'Packs'], presets)),
    '<h2>Transitions</h2>',
    ...(transitions.length === 0 ? ['<p>None yet.</p>']
      : table(['Transition', 'From', 'To'], transitions)),
    ...profilesSection(index),
    '</main>',
    '<script src="search.js"></script>',
    '</body>',
    '</html>',
  ];
  return `${lines.join('\n')}\n`;
}

function sha256(bytes: Buffer): string {
  return createHash('sha256').update(bytes).digest('hex');
}

function read(path: string, what: string): Buffer {
  if (!existsSync(path)) throw new SiteError(2, `${what}: missing`);
  return readFileSync(path);
}

function build(tree: string, out: string, vendor: string, axes: string[]): string[] {
  if (existsSync(out) && (!statSync(out).isDirectory() || readdirSync(out).length > 0)) {
    throw new SiteError(2, `${out}: exists and is not an empty directory`);
  }
  const indexBytes = read(join(tree, 'catalog-index.json'), 'catalog-index.json');
  const llms = read(join(tree, 'llms.txt'), 'llms.txt');
  let index: unknown;
  try {
    index = JSON.parse(indexBytes.toString('utf8'));
  } catch {
    throw new SiteError(1, 'catalog-index.json: not JSON');
  }
  const errors = indexSchemaErrors(index);
  if (errors.length > 0) {
    throw new SiteError(1, `catalog-index.json: breaks index/catalog-index.schema.json: `
      + errors.join('; '));
  }
  for (const pack of (index as CatalogIndex).packs) {
    if (!axes.includes(axisOf(pack))) {
      throw new SiteError(1, `catalog-index.json: ${pack.id}: no section for its axis ${axisOf(pack)}`);
    }
    if (!pack.versions.some((version) => version.version === pack.latest)) {
      throw new SiteError(1, `catalog-index.json: ${pack.id}: latest ${pack.latest} is none of `
        + 'its versions');
    }
  }
  const script = read(join(vendor, 'search.js'), 'index/vendor/search.js');
  const recorded = read(join(vendor, 'search.js.sha256'), 'index/vendor/search.js.sha256')
    .toString('utf8');
  if (recorded !== `${sha256(script)}  search.js\n`) {
    throw new SiteError(1, 'index/vendor/search.js: its sha256 is not the one search.js.sha256 '
      + 'records');
  }
  const files = new Map<string, Buffer>([
    ['catalog-index.json', indexBytes],
    ['index.html', Buffer.from(renderSite(index as CatalogIndex, axes), 'utf8')],
    ['llms.txt', llms],
    ['search.js', script],
    ['site.css', Buffer.from(CSS, 'utf8')],
  ]);
  mkdirSync(out, { recursive: true });
  for (const [name, bytes] of files) writeFileSync(join(out, name), bytes);
  return [`site: wrote ${files.size} files`];
}

export function runSite(argv: string[], options: SiteOptions = {}): SiteResult {
  let tree: string;
  let out: string;
  try {
    const { values } = parseArgs({ args: argv, options: { tree: { type: 'string' },
      out: { type: 'string' } }, allowPositionals: false, strict: true });
    if (values.out === undefined) throw new Error('--out <dir> is required');
    tree = values.tree ?? process.cwd();
    out = values.out;
  } catch (error) {
    return { code: 3, lines: [error instanceof Error ? error.message : String(error)] };
  }
  try {
    return { code: 0, lines: build(tree, out, options.vendor ?? VENDOR, options.axes ?? axesOf()) };
  } catch (error) {
    if (error instanceof SiteError) return { code: error.code, lines: [`site: ${error.message}`] };
    const system = error instanceof Error
      && typeof (error as NodeJS.ErrnoException).code === 'string';
    if (system) return { code: 2, lines: [`site: ${error.message}`] };
    throw error;
  }
}
