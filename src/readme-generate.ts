// The generated sections of a pack README (spec-002 §2.1, §2.2; task-019 acceptance 10): written
// from the pack's own files in the working tree only, and put between the markers that
// `readmeOutline` finds, every other byte of the README unchanged.
import { byBytes, code, isDoc, list, sorted, strings, text, yamlIn } from './index-data';
import type { Doc } from './index-data';
import { workingTree } from './index-source';
import type { TreeSource } from './index-source';
import { entryId } from './index-model';
import { cell } from './index-render';
import { GENERATED_SECTIONS, readmeOutline } from './readme';

export interface GeneratedSections {
  title: string[];
  composition: string[];
  'what-it-adds': string[];
  parameters: string[];
}

function codes(names: string[], none = 'none'): string {
  return names.length === 0 ? none : names.map(code).join(', ');
}

function yamlOrEmpty(source: TreeSource, path: string): Doc {
  return yamlIn(source, path) ?? {};
}

interface PackFiles {
  id: string;
  manifest: Doc;
  contents: Doc;
  dna: Doc;
  roles: Doc;
  memory: Doc;
  workflows: Doc[];
  /** The conditional part (spec-001 §6.5): its workflows, directives and the layer it needs. */
  part: { workflows: Doc[]; directives: string[]; layer: string } | undefined;
}

function partOf(source: TreeSource, dir: string, manifest: Doc): PackFiles['part'] {
  const [entry] = list(manifest['conditional']).filter(isDoc);
  if (entry === undefined) return undefined;
  const contents = isDoc(entry['contents']) ? entry['contents'] : {};
  return {
    workflows: sorted(strings(contents['workflows']))
      .map((name) => ({ name, ...yamlOrEmpty(source, `${dir}/workflows/${name}.yaml`) })),
    directives: sorted(strings(contents['directives'])),
    layer: entryId(text(entry['with'])),
  };
}

function readPack(source: TreeSource, id: string): PackFiles {
  const dir = `packs/${id}`;
  const manifest = yamlOrEmpty(source, `${dir}/pack.yaml`);
  const contents = isDoc(manifest['contents']) ? manifest['contents'] : {};
  const fragments = strings(contents['fragments']);
  const fragment = (kind: string): Doc => fragments.includes(kind)
    ? yamlOrEmpty(source, `${dir}/fragments/${kind}.yaml`) : {};
  return {
    id, manifest, contents,
    dna: fragment('dna'), roles: fragment('roles'), memory: fragment('memory'),
    workflows: sorted(strings(contents['workflows']))
      .map((name) => ({ name, ...yamlOrEmpty(source, `${dir}/workflows/${name}.yaml`) })),
    part: partOf(source, dir, manifest),
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
  // Read from the pack's own pack.yaml (§2.2): a foundation pack has no axis (spec-001 §6.2).
  const axis = pack.manifest['axis'];
  const slot = pack.manifest['slot'];
  const axisLine = typeof axis !== 'string' ? 'Axis: foundation'
    : `Axis: ${axis}${typeof slot === 'string' ? ` · Slot: ${slot}` : ''}`;
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
  // base, the core, has no axis and requires nothing (spec-001 §6.2); every other pack declares
  // what it adds over the foundation it requires (spec-002 §2.1).
  if (pack.manifest['axis'] !== undefined || strings(pack.manifest['requires']).length > 0) {
    lines.push('- **Declares:**',
      `  - Memory types: ${codes(memoryTypes(pack).map(([name]) => name))}`,
      `  - roles: ${codes(rolesOf(pack))}`,
      `  - states: ${codes(declaredStates(pack))}`,
      `  - workflows: ${codes(pack.workflows.map((workflow) => text(workflow['name'])))}`);
    if (pack.part !== undefined) {
      // spec-002 §2.1: a conditional part's files, present only with its layer (plan-039 R8).
      lines.push(`  - only with ${code(pack.part.layer)}: ${codes([
        ...pack.part.workflows.map((workflow) => text(workflow['name'])),
        ...pack.part.directives])}`);
    }
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

/** The mark of a line the conditional part adds (plan-039 R8). */
function onlyWith(pack: PackFiles): string {
  return pack.part === undefined ? '' : `, only with ${code(pack.part.layer)}`;
}

function workflowLines(pack: PackFiles): string[] {
  const lines = (workflows: Doc[], mark: string): string[] => workflows.flatMap((workflow) => [
    `- ${code(text(workflow['name']))} (${text(workflow['kind'] ?? 'unknown')})${mark}`,
    ...list(workflow['phases']).filter(isDoc).map(phaseLine),
  ]);
  return [...lines(pack.workflows, ''), ...lines(pack.part?.workflows ?? [], onlyWith(pack))];
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
  }).concat((pack.part?.directives ?? []).map((id) => `- ${code(id)}: —${onlyWith(pack)}`));
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
      return `| ${code(name)} | ${cell(text(spec['type']))} | ${cell(defaultOf(spec))} | `
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
  for (const marker of outline.markers.filter((entry) => GENERATED_SECTIONS.has(entry.name))) {
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
