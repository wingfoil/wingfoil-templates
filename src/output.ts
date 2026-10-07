// From a composition to files (spec-001 §7.6, §7.7, §9, §10, §17 step 6): the asset checks, the
// generated workflows.yaml, the AGENTS.md generated region, and the bytes of every file.
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { isScalar } from 'yaml';

import type { Catalog } from './catalog';
import type { ComposedDocuments, ComposedFile } from './compose-documents';
import { CompositionError } from './composition-error';
import { checkFormat } from './formats';
import { readFrontmatter } from './frontmatter';
import type { ResolvedPack } from './resolve';
import { BUILTIN_DIRECTIVE_IDS } from './wingfoil-builtins';
import type { LoadedYaml } from './yaml-load';
import { toYaml } from './yaml-write';

type Doc = Record<string, unknown>;

export interface OutputFile {
  /** Relative to the output directory. */
  path: string;
  text: string;
}

/** The output directory cannot be written: it exists and is not empty, or a write failed. */
export class OutputError extends Error {}

/** The provisional markers of spec-001 §10 (feedback notes T14). */
export const REGION_BEGIN = '<!-- wingfoil:generated:begin -->';
export const REGION_END = '<!-- wingfoil:generated:end -->';

const TEMPLATES_FOLDER = 'memory/templates/built-in/';

/** §17 step 6: UTF-8 without a byte order mark, LF line endings, a final newline. */
export function normalizeText(text: string): string {
  const lf = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  return lf.endsWith('\n') ? lf : `${lf}\n`;
}

function stemOf(path: string): string {
  const name = path.slice(path.lastIndexOf('/') + 1);
  return name.slice(0, name.lastIndexOf('.'));
}

function isDoc(value: unknown): value is Doc {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sourceOf(yaml: LoadedYaml | undefined, key: string): string | undefined {
  const node = yaml?.document.get(key, true);
  return isScalar(node) ? node.source : undefined;
}

interface Asset {
  file: ComposedFile;
  pack: ResolvedPack;
  label: string;
  stem: string;
  /** The parsed YAML of a workflow, or the frontmatter of a Markdown asset. */
  yaml: LoadedYaml;
  fields: Doc;
}

/** Reads one asset's header and checks its format and identifier (§5, §6.1). */
function readAsset(file: ComposedFile, pack: ResolvedPack, kind: string, idKey: string): Asset {
  const label = `${pack.id}: ${file.path}`;
  const yaml = file.path.endsWith('.yaml') ? file.yaml : readFrontmatter(file.text, label);
  if (yaml === undefined) throw new CompositionError(`${label} has no frontmatter`);
  const fields = yaml.data;
  if (!isDoc(fields)) throw new CompositionError(`${label}: its header must be a mapping`);
  checkFormat({
    label, kind, declared: fields['format'], source: sourceOf(yaml, 'format'),
    expected: pack.manifest.formats[kind],
  });
  const stem = stemOf(file.path);
  if (fields[idKey] !== stem) {
    throw new CompositionError(`${label}: ${idKey} ${JSON.stringify(fields[idKey])} must equal `
      + `its file stem ${stem} (spec-001 §6.1)`);
  }
  return { file, pack, label, stem, yaml, fields };
}

interface Plan {
  /** Target path under .wingfoil/ -> the asset written there. */
  targets: Map<string, Asset>;
}

function place(plan: Plan, target: string, asset: Asset, catalog: Catalog): void {
  const existing = plan.targets.get(target);
  if (existing !== undefined) {
    const slot = catalog.slots.find((candidate) => candidate.name === asset.stem);
    const replacesDefault = target.startsWith('workflows/') && slot !== undefined
      && existing.pack.id === slot.default && asset.pack.id !== slot.default;
    if (!replacesDefault) {
      throw new CompositionError(`${target} is shipped by ${existing.pack.id} and by `
        + `${asset.pack.id}: one owner per file (spec-001 §7.6)`);
    }
  }
  plan.targets.set(target, asset);
}

function assetsOf(composed: ComposedDocuments, catalog: Catalog): Plan {
  const plan: Plan = { targets: new Map() };
  const packs = new Map(composed.packs.map((pack) => [pack.id, pack]));
  const slotNames = new Set(catalog.slots.map((slot) => slot.name));
  for (const file of composed.files) {
    const pack = packs.get(file.pack);
    if (pack === undefined) continue;
    if (file.path.startsWith('workflows/')) {
      const asset = readAsset(file, pack, 'workflow', 'name');
      if (slotNames.has(asset.stem) && asset.fields['kind'] !== 'sub') {
        throw new CompositionError(`${asset.label}: slot workflow ${asset.stem} must have `
          + 'kind: sub (spec-001 §9)');
      }
      place(plan, `workflows/built-in/${asset.stem}.yaml`, asset, catalog);
    } else if (file.path.startsWith('directives/')) {
      const asset = readAsset(file, pack, 'directive', 'id');
      if (BUILTIN_DIRECTIVE_IDS.includes(asset.stem)) {
        throw new CompositionError(`${asset.label}: ${asset.stem} is a WingFoil built-in `
          + 'directive id (spec-001 §7.6, O5)');
      }
      place(plan, `directives/built-in/${asset.stem}.md`, asset, catalog);
    } else if (file.path.startsWith('memory-templates/')) {
      const asset = readAsset(file, pack, 'memory-template', 'type');
      place(plan, `${TEMPLATES_FOLDER}${asset.stem}.md`, asset, catalog);
    }
  }
  return plan;
}

/** §7.6: a template is shipped by the pack defining its type, at its type's template.file. */
function checkTemplates(composed: ComposedDocuments, plan: Plan): void {
  const types = isDoc(composed.memory['types']) ? composed.memory['types'] : {};
  for (const [target, asset] of plan.targets) {
    if (!target.startsWith(TEMPLATES_FOLDER)) continue;
    const owner = composed.memoryTypes.get(asset.stem);
    if (owner !== asset.pack.id) {
      throw new CompositionError(`${asset.label}: Memory template ${asset.stem} is shipped by the `
        + `pack that defines its type, which is ${owner ?? 'no pack'} (spec-001 §7.6)`);
    }
    const type = types[asset.stem];
    const file = isDoc(type) && isDoc(type['template']) ? type['template']['file'] : undefined;
    if (file !== target) {
      throw new CompositionError(`type ${asset.stem}: template.file is ${JSON.stringify(file)}; `
        + `its pack ships the template, so it must be ${target} (spec-001 §7.6)`);
    }
  }
  for (const [name, type] of Object.entries(types)) {
    const file = isDoc(type) && isDoc(type['template']) ? type['template']['file'] : undefined;
    if (typeof file === 'string' && file.startsWith(TEMPLATES_FOLDER) && !plan.targets.has(file)) {
      throw new CompositionError(`type ${name}: template.file ${file} is in the packs' folder, `
        + 'and no pack of the composition ships it');
    }
  }
}

/** §7.7: one include per composed workflow, in composition then contents order. */
function workflowsYaml(composed: ComposedDocuments, plan: Plan): Doc {
  const include: string[] = [];
  for (const pack of composed.packs) {
    for (const name of pack.manifest.contents.workflows ?? []) {
      const target = `workflows/built-in/${name}.yaml`;
      if (plan.targets.get(target)?.pack.id === pack.id) include.push(target);
    }
  }
  return { format: 1, version: 1, include };
}

/** Lines outside fenced code blocks, so that a `#` inside code is not a heading. */
function proseLines(text: string): string[] {
  const lines: string[] = [];
  let fenced = false;
  for (const line of text.split('\n')) {
    if (/^\s*(?:```|~~~)/.test(line)) {
      fenced = !fenced;
      lines.push('');
      continue;
    }
    lines.push(fenced ? '' : line);
  }
  return lines;
}

/** §10: the generated region, from the agents sections in composition order. */
export function agentsRegion(
  sections: { pack: string; text: string }[],
  foundation: string,
): string {
  const bodies = sections.map(({ pack, text }) => {
    // Blank lines around a section are dropped: sections are separated by one blank line.
    const body = normalizeText(text).replace(/^\n+/, '').replace(/\n+$/, '');
    if (body.includes(REGION_BEGIN) || body.includes(REGION_END)) {
      throw new CompositionError(`${pack}: agents/section.md contains a generated-region marker`);
    }
    const lines = body.split('\n');
    const first = lines.find((line) => line.trim() !== '') ?? '';
    const prose = proseLines(body);
    const heading = pack === foundation ? /^# \S/ : /^## \S/;
    if (!heading.test(first) || prose[lines.indexOf(first)] !== first) {
      throw new CompositionError(`${pack}: agents/section.md must open with a level-`
        + `${pack === foundation ? '1' : '2'} heading (spec-001 §10)`);
    }
    if (pack !== foundation && prose.some((line) => /^# /.test(line))) {
      throw new CompositionError(`${pack}: agents/section.md contains a level-1 heading; only `
        + `${foundation}'s section has one (spec-001 §10)`);
    }
    return body;
  });
  return bodies.length === 0
    ? `${REGION_BEGIN}\n${REGION_END}\n`
    : `${REGION_BEGIN}\n${bodies.join('\n\n')}\n${REGION_END}\n`;
}

function generated(name: string, doc: Doc): OutputFile {
  if (Object.keys(doc).length === 0) {
    throw new CompositionError(`no pack of the composition ships a ${name} fragment; WingFoil `
      + `reads .wingfoil/${name}.yaml`);
  }
  return { path: `.wingfoil/${name}.yaml`, text: toYaml(doc) };
}

/** Every file of the output, checked, with its final bytes, in path order. */
export function planOutput(composed: ComposedDocuments, catalog: Catalog): OutputFile[] {
  const files = [
    generated('dna', composed.dna),
    generated('roles', composed.roles),
    generated('memory', composed.memory),
  ];
  const plan = assetsOf(composed, catalog);
  checkTemplates(composed, plan);
  files.push({ path: '.wingfoil/workflows.yaml', text: toYaml(workflowsYaml(composed, plan)) });
  for (const [target, asset] of plan.targets) {
    files.push({ path: `.wingfoil/${target}`, text: normalizeText(asset.file.text) });
  }
  const sections = composed.files.filter((file) => file.path === 'agents/section.md');
  files.push({ path: 'AGENTS.region.md', text: agentsRegion(sections, catalog.foundation) });
  return files.sort((a, b) => Buffer.compare(Buffer.from(a.path), Buffer.from(b.path)));
}

/** Writes the files under `out`, which must not exist or be empty (§17: no project file). */
export function writeOutput(out: string, files: OutputFile[]): void {
  if (existsSync(out) && (!statSync(out).isDirectory() || readdirSync(out).length > 0)) {
    throw new OutputError(`${out} exists and is not an empty directory`);
  }
  try {
    for (const file of files) {
      const path = join(out, file.path);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, file.text, 'utf8');
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new OutputError(`cannot write ${out}: ${reason}`);
  }
}
