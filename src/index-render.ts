// The three root files of the index (spec-002 §3.2–§3.4, task-019): CATALOG.md for people,
// catalog-index.json for agents and llms.txt, their entry point. Pure functions of the index.
import { byBytes, code } from './index-data';
import type { CatalogIndex, IndexPack } from './index-model';
import { entryId } from './index-model';
import { githubMain, pagesUrl, rawAtTag, rawMain, readmeOnGithub } from './index-urls';
import { packAnchor } from './readme';

export const SPEC_001 = 'docs/memory/tech-spec/'
  + 'spec-001-the-pack-format-manifest-fragments-composition-catalog-compatibility-and-digest.md';
export const SPEC_002 = 'docs/memory/tech-spec/spec-002-pack-readme-and-catalog-index.md';

const TAG = '<catalog pack id>@<version>';
const PACK = '<catalog pack id>';

/** The URL patterns of spec-002 §4, as CATALOG.md and llms.txt list them. */
export const URL_PATTERNS: readonly { label: string; url: string }[] = [
  { label: 'the index', url: rawMain('catalog-index.json') },
  { label: 'a published version\'s README', url: rawAtTag(TAG, `packs/${PACK}/README.md`) },
  { label: 'a published version\'s manifest', url: rawAtTag(TAG, `packs/${PACK}/pack.yaml`) },
  { label: 'resolution', url: rawMain('catalog.yaml') },
  { label: 'compatibility', url: rawMain('compat.yaml') },
  { label: 'a preset', url: rawMain('presets/<id>.yaml') },
  { label: 'a transition', url: rawMain('transitions/<id>.yaml') },
];

/** The search page and the index files it serves (spec-002 §4, task-024), main only. */
export const PAGES_URLS: readonly { label: string; url: string }[] = [
  { label: 'the search page', url: pagesUrl('') },
  { label: 'the index, on the search page', url: pagesUrl('catalog-index.json') },
  { label: 'llms.txt, on the search page', url: pagesUrl('llms.txt') },
];

const PAGES_NOTE = 'The search page serves `main` only, with no file pinned to a tag.';

/** The agent path of spec-002 §4 (task-021), as CATALOG.md and llms.txt give it. */
export const AGENT_STEPS: readonly string[] = [
  `Fetch the index at main: ${code(rawMain('catalog-index.json'))}.`,
  'Filter its `packs` locally by `axis`, `slot`, `profiles`, `status`, or text over `title`, '
    + '`description` and `excerpt` (a case-insensitive substring match is enough).',
  'Take the chosen pack\'s `latest`, the entry of `versions` whose `version` equals it, and that '
    + 'entry\'s `readme_url` and `manifest_url`.',
  'Fetch them: they are pinned to the version\'s tag and never change.',
  'For resolution and compatibility, fetch `catalog.yaml` and `compat.yaml` at main; a preset or a '
    + 'transition at its `url` field.',
];

export const AGENT_NOTES = 'Every file is anonymous and CORS-enabled and may be up to 5 minutes stale; no '
  + 'server, REST API or code search is needed. A tag is written as is in a URL (`/` and `@` '
  + 'included).';

function agentSteps(): string[] {
  return [...AGENT_STEPS.map((step, i) => `${i + 1}. ${step}`), '', AGENT_NOTES];
}

/** A table cell: `|` escaped, line breaks folded into one space. */
export function cell(text: string): string {
  return text.replace(/\s*\r?\n\s*/g, ' ').replaceAll('|', '\\|');
}

/** Up to and including the first `.`, `!` or `?` followed by whitespace or the end. */
export function firstSentence(text: string): string {
  const match = /^([\s\S]*?[.!?])(?=\s|$)/.exec(text);
  return match?.[1] ?? text;
}

function row(cells: string[]): string {
  return `| ${cells.join(' | ')} |`;
}

function table(header: string[], rows: string[][]): string[] {
  return [row(header), row(header.map(() => '---')), ...rows.map(row)];
}

export function axisHeading(axis: string | null): string {
  if (axis === null) return 'Foundation';
  const words = axis.replaceAll('-', ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function packRow(pack: IndexPack, withSlot: boolean): string[] {
  const latest = pack.versions.find((version) => version.version === pack.latest);
  const cells = [`<a id="${packAnchor(pack.id)}"></a>${code(pack.id)}`,
    cell(firstSentence(pack.description))];
  if (withSlot) cells.push(code(pack.slot ?? ''));
  cells.push(pack.status, pack.latest, cell(latest?.wingfoil ?? ''),
    `[README](${readmeOnGithub(latest?.tag ?? '', pack.id)})`);
  return cells;
}

function axisSection(index: CatalogIndex, axis: string | null, foundation: string[]): string[] {
  // The foundation packs in catalog.yaml's order (§3.2); an axis's packs in byte order of ids.
  const members = index.packs.filter((pack) => pack.axis === axis);
  const packs = axis !== null ? members
    : [...members].sort((a, b) => foundation.indexOf(a.id) - foundation.indexOf(b.id));
  const withSlot = axis === 'phase';
  const header = ['Pack', 'Summary', ...(withSlot ? ['Slot'] : []), 'Status', 'Latest', 'WingFoil',
    'README'];
  return [`## ${axisHeading(axis)}`, '', ...(packs.length === 0 ? ['None published yet.']
    : table(header, packs.map((pack) => packRow(pack, withSlot)))), ''];
}

function orNone(rows: string[][], header: string[]): string[] {
  return rows.length === 0 ? ['None yet.'] : table(header, rows);
}

function installSection(index: CatalogIndex): string[] {
  const text = index.install.length === 0
    ? 'No released WingFoil installs packs yet: section "Install and update" of each pack README '
      + 'gives the temporary hand steps.'
    : `The WingFoil releases that install packs from this catalog: ${index.install.map(code)
      .join(', ')}.`;
  return ['<a id="install"></a>', '', '## Install', '', text, ''];
}

/** Each profile a preset names, in byte order, with the packs of those presets, in byte order. */
export function profilePacks(index: CatalogIndex): Map<string, string[]> {
  const profiles = new Map<string, Set<string>>();
  for (const preset of index.presets) {
    if (preset.profile === null) continue;
    const packs = profiles.get(preset.profile) ?? new Set<string>();
    for (const entry of preset.packs) packs.add(entryId(entry));
    profiles.set(preset.profile, packs);
  }
  return new Map([...profiles.keys()].sort(byBytes).map((profile) => [profile,
    [...(profiles.get(profile) ?? [])].sort(byBytes)]));
}

function profilesOf(index: CatalogIndex): string[][] {
  return [...profilePacks(index)].map(([profile, packs]) => [cell(profile),
    packs.map(code).join(', ')]);
}

/** CATALOG.md (spec-002 §3.2), for the axes of catalog.yaml in their order. */
export function renderCatalog(index: CatalogIndex, axes: string[], foundation: string[]): string {
  const lines = [
    '# WingFoil template catalog',
    '',
    'The packs of the official WingFoil template catalog, by axis, with their presets, transitions',
    'and the adoption profiles they serve. This file is generated by `npm run index` from',
    '`catalog.yaml`, `compat.yaml`, the presets and each published version\'s tag: do not edit it',
    'by hand.',
    '',
    ...installSection(index),
    ...[null, ...axes].flatMap((axis) => axisSection(index, axis, foundation)),
    '## Presets', '',
    ...orNone(index.presets.map((preset) => [code(preset.id), cell(preset.title),
      cell(preset.profile ?? '—'), preset.packs.map(code).join(', ')]),
    ['Preset', 'Title', 'Profile', 'Packs']), '',
    '## Transitions', '',
    ...orNone(index.transitions.map((transition) => [code(transition.id), code(transition.from),
      code(transition.to)]), ['Transition', 'From', 'To']), '',
    '## Profiles', '',
    ...orNone(profilesOf(index), ['Profile', 'Packs']), '',
    '## For agents', '',
    'Agents read the catalog with no server, through anonymous URLs; [llms.txt](llms.txt) is their',
    'entry point.',
    '',
    ...agentSteps(),
    '',
    'The URL patterns:',
    '',
    ...URL_PATTERNS.map((pattern) => `- ${pattern.label}: ${code(pattern.url)}`),
    '',
    ...PAGES_URLS.map((pattern) => `- ${pattern.label}: ${code(pattern.url)}`),
    '',
    PAGES_NOTE,
  ];
  return `${lines.join('\n')}\n`;
}

/** catalog-index.json: the index as built, two-space indented, with a final newline. */
export function renderJson(index: CatalogIndex): string {
  return `${JSON.stringify(index, null, 2)}\n`;
}

/** llms.txt (spec-002 §3.4); it does not depend on the catalog's content. */
export function renderLlms(): string {
  const lines = [
    '# WingFoil template catalog',
    '',
    '> The official WingFoil template packs, indexed for agents, each published version pinned to its tag.',
    '',
    ...agentSteps(),
    '',
    '## Index',
    '',
    `- [catalog-index.json](${rawMain('catalog-index.json')}): every published pack, preset and `
      + 'transition (format 1); search is a local filter over it',
    `- [CATALOG.md](${rawMain('CATALOG.md')}): the same index for people`,
    '',
    '## Specifications',
    '',
    `- [spec-001](${githubMain(SPEC_001)}): the pack format`,
    `- [spec-002](${githubMain(SPEC_002)}): the pack README and the catalog index`,
    '',
    '## Reading a pack',
    '',
    ...URL_PATTERNS.map((pattern) => `- ${pattern.label}: ${code(pattern.url)}`),
    '',
    ...PAGES_URLS.map((pattern) => `- ${pattern.label}: ${code(pattern.url)}`),
    '',
    PAGES_NOTE,
  ];
  return `${lines.join('\n')}\n`;
}
