// The catalog index of spec-002 §3.3 (task-019): built from catalog.yaml, compat.yaml and the
// presets of the working tree, and from each published version's tag. Every object is built key
// by key in the order §3.3 gives, so that the JSON is written as it is built.
import { join } from 'node:path';

import { compare as semverCompare, rcompare } from 'semver';

import { CompatError, loadCompat } from './compat';
import { byBytes, IndexInputError, isDoc, list, sorted, strings, yamlAt } from './index-data';
import type { Doc } from './index-data';
import { atTag, checkRepositoryTop, IndexError, workingTree } from './index-source';
import type { TreeSource } from './index-source';
import { REPOSITORY, rawAtTag, rawMain } from './index-urls';
import { readmeOutline, sectionNumber } from './readme';
import { repositorySchemas } from './schemas';
import { YamlError } from './yaml-load';

export interface IndexParameter {
  name: string;
  type: string;
  default?: unknown;
  description: string;
}

export interface IndexVersion {
  version: string;
  tag: string;
  wingfoil: string;
  formats: Record<string, number>;
  requires_capabilities: string[];
  requires: string[];
  conflicts: string[];
  readme_url: string;
  manifest_url: string;
}

export interface IndexPack {
  id: string;
  catalog: string;
  status: string;
  axis: string | null;
  slot: string | null;
  latest: string;
  versions: IndexVersion[];
  title: string;
  description: string;
  workflows: string[];
  memory_types: string[];
  directives: string[];
  parameters: IndexParameter[];
  excerpt: string;
  profiles: string[];
}

export interface IndexPreset {
  id: string;
  title: string;
  description: string;
  profile: string | null;
  packs: string[];
  url: string;
}

export interface IndexTransition {
  id: string;
  from: string;
  to: string;
  formats: Record<string, number>;
  requires_capabilities: string[];
  url: string;
}

export interface CatalogIndex {
  format: 1;
  repository: string;
  install: string[];
  packs: IndexPack[];
  presets: IndexPreset[];
  transitions: IndexTransition[];
}

/** The longest excerpt, in Unicode code points (spec-002 §3.3). */
export const EXCERPT_LIMIT = 500;

/** File kinds → formats, in ascending byte order of the kinds, so that YAML order never shows. */
function formatsOf(value: unknown): Record<string, number> {
  const formats = isDoc(value) ? value : {};
  return Object.fromEntries(Object.keys(formats).sort(byBytes)
    .map((kind) => [kind, Number(formats[kind])]));
}

/** The pack id before `@` of a §6.3 entry. */
export function entryId(entry: string): string {
  const at = entry.indexOf('@');
  return at < 0 ? entry : entry.slice(0, at);
}

/** `axis` and `slot` from a catalog pack id (spec-001 §4). */
export function axisAndSlot(id: string): { axis: string | null; slot: string | null } {
  if (id === 'base') return { axis: null, slot: null };
  const segments = id.split('/');
  return { axis: segments[0] ?? null, slot: segments[0] === 'phase' ? segments[1] ?? null : null };
}

/** The first paragraph of section 2, joined and cut (task-019 acceptance 7). */
export function excerptOf(readme: string | undefined): string {
  if (readme === undefined) return '';
  const outline = readmeOutline(readme);
  const section = outline.sections.find((entry) => sectionNumber(entry.heading) === 2);
  if (section === undefined) return '';
  const headingLines = new Set(outline.scan.headings.flatMap((heading) =>
    Array.from({ length: heading.endLine - heading.line + 1 }, (_, i) => heading.line + i)));
  // Paragraph text only: no heading, thematic break or table line.
  const qualifies = (line: { line: number; raw: string; kind: string; container: string }):
  boolean => line.kind === 'text' && line.container === 'top' && !headingLines.has(line.line)
    && !/^ {0,3}([-*_])(?: *\1){2,} *$/.test(line.raw) && !line.raw.trimStart().startsWith('|');
  const lines = outline.scan.lines.filter((line) => line.line > section.heading.endLine
    && line.line <= section.last);
  const start = lines.findIndex(qualifies);
  if (start < 0) return '';
  const end = lines.findIndex((line, index) => index > start && !qualifies(line));
  const paragraph = lines.slice(start, end < 0 ? undefined : end)
    .map((line) => line.raw.trim()).join(' ');
  return cut(paragraph);
}

function cut(text: string): string {
  const points = Array.from(text);
  if (points.length <= EXCERPT_LIMIT) return text;
  const head = points.slice(0, EXCERPT_LIMIT - 1);
  let space = -1;
  head.forEach((point, index) => {
    if (/\s/u.test(point)) space = index;
  });
  const kept = space > 0 ? head.slice(0, space).join('').trimEnd() : head.join('');
  return `${kept}…`;
}

function parametersOf(manifest: Doc): IndexParameter[] {
  const raw = isDoc(manifest['parameters']) ? manifest['parameters'] : {};
  return Object.keys(raw).sort(byBytes).map((name) => {
    const spec = isDoc(raw[name]) ? raw[name] : {};
    // Key order of §3.3: default only when there is one, before the description.
    return {
      name,
      type: String(spec['type']),
      ...(Object.hasOwn(spec, 'default') ? { default: spec['default'] } : {}),
      description: String(spec['description']),
    };
  });
}

function memoryTypes(source: TreeSource, packId: string, manifest: Doc): string[] {
  const contents = isDoc(manifest['contents']) ? manifest['contents'] : {};
  if (!strings(contents['fragments']).includes('memory')) return [];
  const fragment = yamlAt(source, `packs/${packId}/fragments/memory.yaml`);
  return sorted(Object.keys(isDoc(fragment['types']) ? fragment['types'] : {}));
}

function versionOf(tree: string, packId: string, entry: Doc): { version: IndexVersion;
  source: TreeSource; manifest: Doc } {
  const version = String(entry['version']);
  const tag = `${packId}@${version}`;
  const source = atTag(tree, tag);
  const manifest = yamlAt(source, `packs/${packId}/pack.yaml`);
  return {
    source,
    manifest,
    version: {
      version,
      tag,
      wingfoil: String(entry['wingfoil']),
      formats: formatsOf(manifest['formats']),
      requires_capabilities: strings(manifest['requires_capabilities']),
      requires: strings(manifest['requires']),
      conflicts: strings(manifest['conflicts']),
      readme_url: rawAtTag(tag, `packs/${packId}/README.md`),
      manifest_url: rawAtTag(tag, `packs/${packId}/pack.yaml`),
    },
  };
}

function packOf(tree: string, entry: Doc, presets: IndexPreset[]): IndexPack | undefined {
  const id = String(entry['id']);
  const published = list(entry['versions']).filter(isDoc)
    .sort((a, b) => semverCompare(String(a['version']), String(b['version'])));
  if (published.length === 0) return undefined;
  const versions = published.map((version) => versionOf(tree, id, version));
  const latest = [...versions].sort((a, b) => rcompare(a.version.version, b.version.version))[0];
  if (latest === undefined) return undefined;
  const contents = isDoc(latest.manifest['contents']) ? latest.manifest['contents'] : {};
  const { axis, slot } = axisAndSlot(id);
  return {
    id,
    catalog: String(entry['catalog']),
    status: String(entry['status']),
    axis,
    slot,
    latest: latest.version.version,
    versions: versions.map((version) => version.version),
    title: String(latest.manifest['title']),
    description: String(latest.manifest['description']),
    workflows: sorted(strings(contents['workflows'])),
    memory_types: memoryTypes(latest.source, id, latest.manifest),
    directives: sorted(strings(contents['directives'])),
    parameters: parametersOf(latest.manifest),
    excerpt: excerptOf(latest.source.read(`packs/${id}/README.md`)),
    profiles: sorted(presets.filter((preset) => preset.profile !== null
      && preset.packs.some((pack) => entryId(pack) === id))
      .map((preset) => preset.profile ?? '')),
  };
}

function presetOf(tree: TreeSource, entry: Doc): IndexPreset {
  const id = String(entry['id']);
  const preset = yamlAt(tree, `presets/${id}.yaml`);
  return {
    id,
    title: String(preset['title']),
    description: String(preset['description']),
    profile: typeof preset['profile'] === 'string' ? preset['profile'] : null,
    packs: strings(preset['packs']),
    url: rawMain(`presets/${id}.yaml`),
  };
}

function transitionOf(entry: Doc): IndexTransition {
  const id = String(entry['id']);
  return {
    id,
    from: String(entry['from']),
    to: String(entry['to']),
    formats: formatsOf(entry['formats']),
    requires_capabilities: strings(entry['requires_capabilities']),
    url: rawMain(`transitions/${id}.yaml`),
  };
}

/** The versions of the compat.yaml releases that provide pack-install, ascending. */
function installReleases(tree: string): string[] {
  try {
    return loadCompat(join(tree, 'compat.yaml')).releases
      .filter((release) => release.capabilities.includes('pack-install'))
      .map((release) => release.wingfoil).sort(semverCompare);
  } catch (error) {
    if (error instanceof CompatError || error instanceof YamlError) return [];
    throw error;
  }
}

function byId<T extends { id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => byBytes(a.id, b.id));
}

/** The index of a tree (spec-002 §3.3); an IndexError when a file or a tag cannot be read. */
export function buildIndex(tree: string): CatalogIndex {
  const working = workingTree(tree);
  if (working.read('catalog.yaml') === undefined) throw new IndexError(`${tree}: no catalog.yaml`);
  const catalog = yamlAt(working, 'catalog.yaml');
  if (repositorySchemas().validate('catalog', catalog).length > 0) {
    throw new IndexInputError('catalog.yaml fails its schema; npm run check:schemas names the '
      + 'problems');
  }
  const entries = list(catalog['packs']).filter(isDoc);
  if (entries.some((entry) => list(entry['versions']).length > 0)) checkRepositoryTop(tree);
  const presets = byId(list(catalog['presets']).filter(isDoc).map((entry) => presetOf(working,
    entry)));
  const packs = byId(entries.flatMap((entry) => packOf(tree, entry, presets) ?? []));
  return {
    format: 1,
    repository: REPOSITORY,
    install: installReleases(tree),
    packs,
    presets,
    transitions: byId(list(catalog['transitions']).filter(isDoc).map(transitionOf)),
  };
}
