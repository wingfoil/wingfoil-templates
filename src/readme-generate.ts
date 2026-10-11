// The generated sections of a pack README (spec-002 §2.1, §2.2; task-019 acceptance 10): written
// from the pack's own files in the working tree only, and put between the markers that
// `readmeOutline` finds, every other byte of the README unchanged.
import { parse as parseYaml } from 'yaml';

import { axisAndSlot } from './index-model';
import { workingTree } from './index-source';
import type { TreeSource } from './index-source';
import { cell } from './index-render';
import { readmeOutline } from './readme';

type Doc = Record<string, unknown>;

export interface GeneratedSections {
  title: string[];
  composition: string[];
  'what-it-adds': string[];
  parameters: string[];
}

function isDoc(value: unknown): value is Doc {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** A scalar as text; anything else as JSON, so that a malformed file never prints [object]. */
function text(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return `${value}`;
  return JSON.stringify(value) ?? '';
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function strings(value: unknown): string[] {
  return list(value).map(String);
}

function byBytes(a: string, b: string): number {
  return Buffer.compare(Buffer.from(a), Buffer.from(b));
}

function sorted(names: string[]): string[] {
  return [...new Set(names)].sort(byBytes);
}

function code(text: string): string {
  return `\`${text}\``;
}

function codes(names: string[], none = 'none'): string {
  return names.length === 0 ? none : names.map(code).join(', ');
}

function yamlOf(source: TreeSource, path: string): Doc {
  const text = source.read(path);
  if (text === undefined) return {};
  const data: unknown = parseYaml(text);
  return isDoc(data) ? data : {};
}

interface PackFiles {
  id: string;
  manifest: Doc;
  contents: Doc;
  dna: Doc;
  roles: Doc;
  memory: Doc;
  workflows: Doc[];
}

function readPack(source: TreeSource, id: string): PackFiles {
  const dir = `packs/${id}`;
  const manifest = yamlOf(source, `${dir}/pack.yaml`);
  const contents = isDoc(manifest['contents']) ? manifest['contents'] : {};
  const fragments = strings(contents['fragments']);
  const fragment = (kind: string): Doc => fragments.includes(kind)
    ? yamlOf(source, `${dir}/fragments/${kind}.yaml`) : {};
  return {
    id, manifest, contents,
    dna: fragment('dna'), roles: fragment('roles'), memory: fragment('memory'),
    workflows: sorted(strings(contents['workflows']))
      .map((name) => ({ name, ...yamlOf(source, `${dir}/workflows/${name}.yaml`) })),
  };
}

function memoryTypes(pack: PackFiles): [string, Doc][] {
  const types = isDoc(pack.memory['types']) ? pack.memory['types'] : {};
  return Object.keys(types).sort(byBytes).map((name) => [name,
    isDoc(types[name]) ? types[name] : {}]);
}

function statesOf(type: Doc): Doc | undefined {
  return isDoc(type['states']) ? type['states'] : undefined;
}

function declaredStates(pack: PackFiles): string[] {
  const defaults = isDoc(pack.memory['defaults']) ? statesOf(pack.memory['defaults']) : undefined;
  return sorted([defaults, ...memoryTypes(pack).map(([, type]) => statesOf(type))]
    .flatMap((states) => strings(states?.['sequence'])));
}

function rolesOf(pack: PackFiles): string[] {
  const team = isDoc(pack.dna['team']) ? pack.dna['team'] : {};
  return sorted(list(team['roles']).filter(isDoc).map((role) => text(role['name'])));
}

function titleSection(pack: PackFiles): string[] {
  const { axis, slot } = axisAndSlot(pack.id);
  const axisLine = axis === null ? 'Axis: foundation'
    : `Axis: ${axis}${slot === null ? '' : ` · Slot: ${slot}`}`;
  return [`# ${text(pack.manifest['title'])}`, '', text(pack.manifest['description']), '',
    axisLine];
}

function compositionSection(pack: PackFiles): string[] {
  const formats = isDoc(pack.manifest['formats']) ? pack.manifest['formats'] : {};
  const lines = [
    '## Composition',
    '',
    `- **Requires:** ${codes(strings(pack.manifest['requires']))}`,
    `- **Conflicts:** ${codes(strings(pack.manifest['conflicts']))}`,
    `- **Formats:** ${Object.keys(formats).length === 0 ? 'none' : Object.keys(formats)
      .sort(byBytes).map((kind) => `${code(kind)} ${text(formats[kind])}`).join(', ')}`,
    `- **Requires capabilities:** ${codes(strings(pack.manifest['requires_capabilities']))}`,
  ];
  if (pack.id !== 'base') {
    lines.push('- **Declares:**',
      `  - Memory types: ${codes(memoryTypes(pack).map(([name]) => name))}`,
      `  - roles: ${codes(rolesOf(pack))}`,
      `  - states: ${codes(declaredStates(pack))}`,
      `  - workflows: ${codes(pack.workflows.map((workflow) => text(workflow['name'])))}`);
  }
  return lines;
}

function phaseLine(phase: Doc): string {
  const parts = [code(text(phase['name']))];
  if (phase['role'] !== undefined) parts.push(`role ${code(text(phase['role']))}`);
  const approval = isDoc(phase['approval']) ? phase['approval'] : undefined;
  if (approval?.['by_role'] !== undefined) parts.push(`gate ${code(text(approval['by_role']))}`);
  if (phase['include'] !== undefined) parts.push(`includes ${code(text(phase['include']))}`);
  return `  - ${parts.join(', ')}`;
}

function workflowLines(pack: PackFiles): string[] {
  return pack.workflows.flatMap((workflow) => [
    `- ${code(text(workflow['name']))} (${text(workflow['kind'] ?? 'unknown')})`,
    ...list(workflow['phases']).filter(isDoc).map(phaseLine),
  ]);
}

function gatesOf(states: Doc): string {
  const gates = isDoc(states['gates']) ? states['gates'] : {};
  const names = Object.keys(gates).sort(byBytes);
  return names.length === 0 ? '' : `; gates ${names.map((name) => {
    const gate = isDoc(gates[name]) ? gates[name] : {};
    return gate['reject'] === undefined ? code(name)
      : `${code(name)} (reject → ${code(text(gate['reject']))})`;
  }).join(', ')}`;
}

function sequenceOf(states: Doc): string {
  return strings(states['sequence']).map(code).join(' → ');
}

function memoryLines(pack: PackFiles): string[] {
  const defaults = isDoc(pack.memory['defaults']) ? statesOf(pack.memory['defaults']) : undefined;
  return memoryTypes(pack).map(([name, type]) => {
    const own = statesOf(type);
    if (own !== undefined) return `- ${code(name)}: ${sequenceOf(own)}${gatesOf(own)}`;
    if (defaults !== undefined) {
      return `- ${code(name)}: defaults, ${sequenceOf(defaults)}${gatesOf(defaults)}`;
    }
    return `- ${code(name)}: —`;
  });
}

function directiveLines(pack: PackFiles): string[] {
  const assignments = isDoc(pack.roles['assignments']) ? pack.roles['assignments'] : {};
  const global = strings(pack.roles['global']);
  return sorted(strings(pack.contents['directives'])).map((id) => {
    const roles = Object.keys(assignments).sort(byBytes)
      .filter((role) => strings(assignments[role]).includes(id)).map(code);
    if (global.includes(id)) roles.push('global');
    return `- ${code(id)}: ${roles.length === 0 ? '—' : roles.join(', ')}`;
  });
}

function bullets(names: string[]): string[] {
  return names.map((name) => `- ${code(name)}`);
}

function subsection(heading: string, lines: string[]): string[] {
  return [`### ${heading}`, '', ...(lines.length === 0 ? ['None.'] : lines)];
}

function whatItAddsSection(pack: PackFiles): string[] {
  const fragments = strings(pack.contents['fragments']).filter((kind) => kind !== 'memory');
  return [
    '## What it adds', '',
    ...subsection('Workflows', workflowLines(pack)), '',
    ...subsection('Memory types', memoryLines(pack)), '',
    ...subsection('Directives', directiveLines(pack)), '',
    ...subsection('Fragments', bullets(sorted(fragments))), '',
    ...subsection('Memory templates', bullets(sorted(strings(pack.contents['memory_templates'])))),
  ];
}

function defaultOf(spec: Doc): string {
  if (!Object.hasOwn(spec, 'default')) return 'required';
  const value = spec['default'];
  return code(typeof value === 'string' ? value : JSON.stringify(value));
}

function parametersSection(pack: PackFiles): string[] {
  const raw = isDoc(pack.manifest['parameters']) ? pack.manifest['parameters'] : {};
  const names = Object.keys(raw).sort(byBytes);
  if (names.length === 0) return ['## Parameters', '', 'None.'];
  return ['## Parameters', '', '| Name | Type | Default | Description |', '|---|---|---|---|',
    ...names.map((name) => {
      const spec = isDoc(raw[name]) ? raw[name] : {};
      return `| ${code(name)} | ${text(spec['type'])} | ${cell(defaultOf(spec))} | `
        + `${cell(text(spec['description']))} |`;
    })];
}

/** The four generated sections of a pack, each starting with its heading. */
export function generatedSections(tree: string, packId: string): GeneratedSections {
  const pack = readPack(workingTree(tree), packId);
  return {
    title: titleSection(pack),
    composition: compositionSection(pack),
    'what-it-adds': whatItAddsSection(pack),
    parameters: parametersSection(pack),
  };
}

/**
 * The README with the lines strictly between each pair of markers replaced by its section; the
 * caller has checked the README with the README rules (task-018).
 */
export function rewriteReadme(text: string, sections: GeneratedSections): string {
  const outline = readmeOutline(text);
  const lines = text.split('\n');
  const trailing = lines[lines.length - 1] === '' ? lines.pop() : undefined;
  const begins = new Map<number, string>();
  const ends = new Set<number>();
  let open: { name: string; line: number } | undefined;
  for (const marker of outline.markers) {
    if (marker.verb === 'begin') open = { name: marker.name, line: marker.line };
    else if (open?.name === marker.name) {
      begins.set(open.line, marker.name);
      ends.add(marker.line);
      open = undefined;
    }
  }
  const out: string[] = [];
  let skipping = false;
  lines.forEach((line, index) => {
    const number = index + 1;
    if (ends.has(number)) skipping = false;
    if (!skipping) out.push(line);
    const name = begins.get(number) as keyof GeneratedSections | undefined;
    if (name !== undefined) {
      out.push(...sections[name]);
      skipping = true;
    }
  });
  if (trailing !== undefined) out.push(trailing);
  return out.join('\n');
}
