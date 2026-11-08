import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { stringify } from 'yaml';

import { writeExamples } from './examples';
import { conformingReadme } from './readme';

/** What a test says about a pack; the helper fills the rest of a schema-valid manifest. */
export interface PackSpec {
  id: string;
  version?: string;
  requires?: string[];
  conflicts?: string[];
  workflows?: string[];
  directives?: string[];
  fragments?: string[];
  memoryTemplates?: string[];
  agentsSection?: boolean;
  /** pack.yaml's format; 1 when absent (spec-001 §5). */
  format?: number;
  /** Conditional entries (spec-001 §6.5), their files written as the contents' are. */
  conditional?: { with: string; workflows?: string[]; directives?: string[] }[];
  /** Format 2's tensions (spec-001 §6.2), written as they are. */
  tensions?: { pack: string; resolution: string }[];
  /** Overrides written into pack.yaml as they are. */
  manifest?: Record<string, unknown>;
  /** Files written under the pack directory, besides those the contents list. */
  extraFiles?: Record<string, string>;
  /** Listed files not written, to test a missing file. */
  omitFiles?: string[];
}

/** Format 1 for every file kind the pack ships (spec-001 §5). */
function formatsFor(spec: PackSpec): Record<string, number> {
  const formats: Record<string, number> = {};
  const entries = spec.conditional ?? [];
  for (const fragment of spec.fragments ?? []) formats[fragment] = 1;
  if ([spec.workflows, ...entries.map((entry) => entry.workflows)]
    .some((names) => (names ?? []).length > 0)) formats['workflow'] = 1;
  if ([spec.directives, ...entries.map((entry) => entry.directives)]
    .some((names) => (names ?? []).length > 0)) formats['directive'] = 1;
  if ((spec.memoryTemplates ?? []).length > 0) formats['memory-template'] = 1;
  return formats;
}

function stem(file: string): string {
  const name = file.slice(file.lastIndexOf('/') + 1);
  return name.slice(0, name.lastIndexOf('.'));
}

/** Phases including each name, as the life cycle's workflows must (spec-001 §9). */
function including(names: string[]): string {
  return `phases:\n${names.map((name) => `  - { name: ${name}, include: ${name} }\n`).join('')}`;
}

/** software's life cycle and a methodology's delivery, including their slots (spec-001 §9). */
export const SW_LIFE_CYCLE = 'format: 1\nname: sw-life-cycle\nkind: main\n'
  + including(['inception', 'specification', 'delivery', 'end-of-life']);
export const DELIVERY = 'format: 1\nname: delivery\nkind: sub\nphases:\n'
  + '  - { name: release, iterate_over: release, where: { status: [in-development, releasing] }, '
  + 'include: release }\n  - { name: retrospective, include: retrospective }\n';
/** software's release type: a methodology's delivery iterates over it (dl-027 D1). */
export const RELEASE_TYPE = 'format: 1\ntypes:\n  release:\n    path: "docs/release/{id}.md"\n'
  + '    id_pattern: "rel-{n}"\n    template: { file: memory/templates/built-in/release.md,\n'
  + '      frontmatter: { required: [] } }\n';
export const RELEASE_TEMPLATE = '---\ntype: release\nformat: 1\n---\n';
/** A sub-workflow with the given flow-style phases. */
export function subWorkflow(name: string, phases: string[]): string {
  return `format: 1\nname: ${name}\nkind: sub\nphases:\n${phases.map((phase) => `  - ${phase}\n`)
    .join('')}`;
}

/** Placeholder content: each file a minimal valid asset of its kind (spec-001 §5, §6.1). */
function placeholder(file: string): string {
  if (file.startsWith('fragments/')) return 'format: 1\n';
  if (file === 'workflows/sw-life-cycle.yaml') return SW_LIFE_CYCLE;
  if (file === 'workflows/delivery.yaml') return DELIVERY;
  if (file.startsWith('workflows/')) return `format: 1\nname: ${stem(file)}\nkind: sub\n`;
  if (file.startsWith('directives/')) {
    return `---\nid: ${stem(file)}\nformat: 1\n---\n# ${stem(file)}\n`;
  }
  if (file.startsWith('memory-templates/')) return `---\ntype: ${stem(file)}\nformat: 1\n---\n`;
  return `## ${file}\n`;
}

export function manifestFor(spec: PackSpec): Record<string, unknown> {
  const segments = spec.id.split('/');
  const isBase = spec.id === 'base';
  const isFoundation = isBase || spec.id === 'software';
  const manifest: Record<string, unknown> = { format: spec.format ?? 1, id: spec.id };
  if (!isFoundation) manifest['axis'] = segments[0];
  manifest['name'] = segments[segments.length - 1];
  if (segments[0] === 'phase') manifest['slot'] = segments[1];
  Object.assign(manifest, {
    title: spec.id,
    description: `Test pack ${spec.id}.`,
    version: spec.version ?? '1.0.0',
    formats: formatsFor(spec),
    requires_capabilities: [],
  });
  // A phase pack requires software (spec-001 §3); every other pack but base requires base.
  if (!isBase) {
    manifest['requires'] = spec.requires
      ?? (segments[0] === 'phase' ? ['base@^1', 'software@^1'] : ['base@^1']);
  }
  if (spec.conflicts !== undefined) manifest['conflicts'] = spec.conflicts;
  manifest['contents'] = {
    fragments: spec.fragments ?? [],
    directives: spec.directives ?? [],
    workflows: spec.workflows ?? [],
    memory_templates: spec.memoryTemplates ?? [],
    agents_section: spec.agentsSection ?? false,
  };
  if (spec.conditional !== undefined) {
    manifest['conditional'] = spec.conditional.map((entry) => ({ with: entry.with, contents: {
      ...(entry.workflows === undefined ? {} : { workflows: entry.workflows }),
      ...(entry.directives === undefined ? {} : { directives: entry.directives }) } }));
  }
  if (spec.tensions !== undefined) manifest['tensions'] = spec.tensions;
  return { ...manifest, ...spec.manifest };
}

function contentFiles(spec: PackSpec): string[] {
  return [
    ...(spec.fragments ?? []).map((name) => `fragments/${name}.yaml`),
    ...(spec.directives ?? []).map((name) => `directives/${name}.md`),
    ...(spec.workflows ?? []).map((name) => `workflows/${name}.yaml`),
    ...(spec.memoryTemplates ?? []).map((name) => `memory-templates/${name}.md`),
    ...(spec.agentsSection === true ? ['agents/section.md'] : []),
    ...(spec.conditional ?? []).flatMap((entry) => [
      ...(entry.directives ?? []).map((name) => `directives/${name}.md`),
      ...(entry.workflows ?? []).map((name) => `workflows/${name}.yaml`)]),
  ];
}

export function writePack(root: string, spec: PackSpec): void {
  const dir = join(root, 'packs', spec.id);
  const write = (path: string, text: string): void => {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), text);
  };
  write('pack.yaml', stringify(manifestFor(spec)));
  write('README.md', conformingReadme({ id: spec.id, title: spec.id,
    description: `Test pack ${spec.id}.` }));
  write('CHANGELOG.md', `# ${spec.id}\n`);
  for (const file of contentFiles(spec)) {
    if (!(spec.omitFiles ?? []).includes(file)) write(file, placeholder(file));
  }
  for (const [path, text] of Object.entries(spec.extraFiles ?? {})) write(path, text);
}

/**
 * A temporary tree holding packs/ with the given packs and, unless `examples` is false, an example
 * of each when it holds methodology/kanban (task-022).
 */
export function withPackTree(specs: PackSpec[], body: (root: string) => void,
  { examples = true } = {}): void {
  const root = mkdtempSync(join(tmpdir(), 'pack-tree-'));
  try {
    for (const spec of specs) writePack(root, spec);
    if (examples) writeExamples(root, specs);
    body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

/**
 * The foundation packs (spec-001 §3, §9): base ships retrospective, software the life cycle; a
 * methodology that requires software ships delivery in contents (plan-038 ruling 7).
 */
export const BASE: PackSpec = { id: 'base', workflows: ['retrospective'] };
export const SOFTWARE: PackSpec = { id: 'software', workflows: ['sw-life-cycle'],
  fragments: ['memory'], memoryTemplates: ['release'],
  extraFiles: { 'fragments/memory.yaml': RELEASE_TYPE,
    'memory-templates/release.md': RELEASE_TEMPLATE } };
export const FOUNDATION: PackSpec[] = [BASE, SOFTWARE];
export const KANBAN: PackSpec = {
  id: 'methodology/kanban', requires: ['base@^1', 'software@^1'], workflows: ['delivery'],
};

/** base with the three fragments every composition needs. */
export const BASE_COMPOSABLE: PackSpec = {
  id: 'base',
  workflows: ['retrospective'],
  fragments: ['dna', 'roles', 'memory'],
  extraFiles: {
    'fragments/dna.yaml': 'format: 1\nproject:\n  name: test\n',
    'fragments/roles.yaml': 'format: 1\nglobal: [security]\n',
    'fragments/memory.yaml': 'format: 1\ndefaults:\n  states:\n    sequence: [draft, done]\n',
  },
};

/** software with its life cycle; with BASE_COMPOSABLE, the foundation of a composition. */
export const SOFTWARE_COMPOSABLE: PackSpec = {
  id: 'software',
  workflows: ['sw-life-cycle'],
  fragments: ['memory'],
  memoryTemplates: ['release'],
  extraFiles: { 'workflows/sw-life-cycle.yaml': SW_LIFE_CYCLE,
    'fragments/memory.yaml': RELEASE_TYPE, 'memory-templates/release.md': RELEASE_TEMPLATE },
};
export const FOUNDATION_COMPOSABLE: PackSpec[] = [BASE_COMPOSABLE, SOFTWARE_COMPOSABLE];
