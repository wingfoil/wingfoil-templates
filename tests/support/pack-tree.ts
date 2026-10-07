import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { stringify } from 'yaml';

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
  for (const fragment of spec.fragments ?? []) formats[fragment] = 1;
  if ((spec.workflows ?? []).length > 0) formats['workflow'] = 1;
  if ((spec.directives ?? []).length > 0) formats['directive'] = 1;
  if ((spec.memoryTemplates ?? []).length > 0) formats['memory-template'] = 1;
  return formats;
}

/** Placeholder content: YAML files hold a minimal valid document. */
function placeholder(file: string): string {
  if (file.startsWith('fragments/')) return 'format: 1\n';
  if (file.startsWith('workflows/')) {
    return `format: 1\nname: ${file.slice('workflows/'.length, -'.yaml'.length)}\n`;
  }
  return `# ${file}\n`;
}

export function manifestFor(spec: PackSpec): Record<string, unknown> {
  const segments = spec.id.split('/');
  const isBase = spec.id === 'base';
  const manifest: Record<string, unknown> = { format: 1, id: spec.id };
  if (!isBase) manifest['axis'] = segments[0];
  manifest['name'] = segments[segments.length - 1];
  if (segments[0] === 'phase') manifest['slot'] = segments[1];
  Object.assign(manifest, {
    title: spec.id,
    description: `Test pack ${spec.id}.`,
    version: spec.version ?? '1.0.0',
    formats: formatsFor(spec),
    requires_capabilities: [],
  });
  if (!isBase) manifest['requires'] = spec.requires ?? ['base@^1'];
  if (spec.conflicts !== undefined) manifest['conflicts'] = spec.conflicts;
  manifest['contents'] = {
    fragments: spec.fragments ?? [],
    directives: spec.directives ?? [],
    workflows: spec.workflows ?? [],
    memory_templates: spec.memoryTemplates ?? [],
    agents_section: spec.agentsSection ?? false,
  };
  return { ...manifest, ...spec.manifest };
}

function contentFiles(spec: PackSpec): string[] {
  return [
    ...(spec.fragments ?? []).map((name) => `fragments/${name}.yaml`),
    ...(spec.directives ?? []).map((name) => `directives/${name}.md`),
    ...(spec.workflows ?? []).map((name) => `workflows/${name}.yaml`),
    ...(spec.memoryTemplates ?? []).map((name) => `memory-templates/${name}.md`),
    ...(spec.agentsSection === true ? ['agents/section.md'] : []),
  ];
}

export function writePack(root: string, spec: PackSpec): void {
  const dir = join(root, 'packs', spec.id);
  const write = (path: string, text: string): void => {
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), text);
  };
  write('pack.yaml', stringify(manifestFor(spec)));
  for (const file of contentFiles(spec)) {
    if (!(spec.omitFiles ?? []).includes(file)) write(file, placeholder(file));
  }
  for (const [path, text] of Object.entries(spec.extraFiles ?? {})) write(path, text);
}

/** A temporary tree holding packs/ with the given packs. */
export function withPackTree(specs: PackSpec[], body: (root: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), 'pack-tree-'));
  try {
    for (const spec of specs) writePack(root, spec);
    body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

/** The packs every valid composition needs: base, and a methodology shipping delivery. */
export const BASE: PackSpec = { id: 'base', workflows: ['sw-life-cycle', 'retrospective'] };
export const KANBAN: PackSpec = { id: 'methodology/kanban', workflows: ['delivery'] };
