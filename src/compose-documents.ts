// The composer up to the merged documents (spec-001 §17 steps 1–5, without writing files): resolve
// the packs, settle the parameters, read and substitute every listed file, parse the YAML ones,
// and merge the dna, roles and memory fragments in composition order.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Catalog } from './catalog';
import { CompositionError } from './composition-error';
import { checkFormat } from './formats';
import { checkDnaFragment, checkRoleDirectives, mergeFragments } from './merge';
import type { Fragment } from './merge';
import { mergeMemoryWithOwners } from './memory-merge';
import { parameterScopes, resolveParameters, substitute } from './parameters';
import { listedFiles, resolve } from './resolve';
import type { ResolvedPack } from './resolve';
import { secretProblems } from './secret-rules';
import { workflowProblems } from './workflow-rules';
import type { RuleFile } from './workflow-rules';
import { YamlError, parseYaml } from './yaml-load';
import type { LoadedYaml } from './yaml-load';
import { isScalar } from 'yaml';

type Doc = Record<string, unknown>;

export type ParameterValues = Record<string, unknown>;

/** A file a pack ships, after substitution. */
export interface ComposedFile {
  pack: string;
  /** Relative to the pack directory: `fragments/dna.yaml`, `workflows/delivery.yaml`, … */
  path: string;
  text: string;
  /** The parsed document, for YAML files. */
  data?: unknown;
  /** The YAML file as loaded, with the source text of each value. */
  yaml?: LoadedYaml;
}

export interface ComposedDocuments {
  packs: ResolvedPack[];
  files: ComposedFile[];
  dna: Doc;
  roles: Doc;
  memory: Doc;
  /** Memory type -> the pack that defined it. */
  memoryTypes: Map<string, string>;
}

type FragmentKind = 'dna' | 'roles' | 'memory';

function readFiles(
  tree: string,
  packs: ResolvedPack[],
  values: Map<string, string | number | boolean>,
  scopes: Map<string, Set<string>>,
): ComposedFile[] {
  const files: ComposedFile[] = [];
  for (const pack of packs) {
    for (const path of listedFiles(pack.manifest.contents)) {
      const label = `${pack.path}/${path}`;
      const raw = readFileSync(join(tree, pack.path, path), 'utf8');
      const text = substitute(raw, values, scopes.get(pack.id) ?? new Set(), label, pack.id);
      const file: ComposedFile = { pack: pack.id, path, text };
      if (path.endsWith('.yaml')) {
        try {
          file.yaml = parseYaml(text, label);
          file.data = file.yaml.data;
        } catch (error) {
          if (error instanceof YamlError) {
            throw new CompositionError(
              `${pack.id}: ${error.message}, after parameter substitution`,
            );
          }
          throw error;
        }
      }
      files.push(file);
    }
  }
  return files;
}

/** §5 and §7.2: each fragment declares its pack's format and no version; one format per kind. */
function fragmentsOf(kind: FragmentKind, packs: ResolvedPack[], files: ComposedFile[]): {
  format: number | undefined;
  fragments: Fragment[];
} {
  let format: { value: number; pack: string } | undefined;
  const fragments: Fragment[] = [];
  for (const file of files.filter((candidate) => candidate.path === `fragments/${kind}.yaml`)) {
    const label = `${file.pack}: ${file.path}`;
    const data = file.data;
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new CompositionError(`${label} must be a mapping`);
    }
    const { format: rawFormat, ...rest } = data as Doc;
    const node = file.yaml?.document.get('format', true);
    const declared = checkFormat({
      label,
      kind,
      declared: rawFormat,
      source: isScalar(node) ? node.source : undefined,
      expected: packs.find((candidate) => candidate.id === file.pack)?.manifest.formats[kind],
    });
    if (Object.hasOwn(rest, 'version')) {
      throw new CompositionError(`${label}: a fragment carries no version: (spec-001 §7.2)`);
    }
    if (format !== undefined && format.value !== declared) {
      throw new CompositionError(`${kind} fragments disagree: ${format.pack} is format `
        + `${format.value}, ${file.pack} is format ${declared}`);
    }
    format ??= { value: declared, pack: file.pack };
    fragments.push({ pack: file.pack, data: rest });
  }
  return { format: format?.value, fragments };
}

/** F3.5 on the packs composed (task-012): the composer refuses what the lint rejects (§18). */
function checkWorkflows(tree: string, catalog: Catalog, packs: ResolvedPack[],
  files: ComposedFile[]): void {
  const byPack = new Map<string, RuleFile[]>();
  for (const file of files) {
    const pack = packs.find((candidate) => candidate.id === file.pack);
    const ruleFile: RuleFile = { path: file.path, file: `${pack?.path ?? file.pack}/${file.path}` };
    if (file.yaml !== undefined) ruleFile.yaml = file.yaml;
    byPack.set(file.pack, [...(byPack.get(file.pack) ?? []), ruleFile]);
  }
  const byId = new Map(packs.map((pack) => [pack.id, pack]));
  for (const pack of packs) {
    const [first] = workflowProblems(catalog, pack, byId, byPack);
    if (first !== undefined) throw new CompositionError(first.message);
  }
  // The files as written, before substitution: a value given with --param is the user's, not
  // the pack's, and the lint scans the files as written too.
  for (const file of files) {
    const path = `${byId.get(file.pack)?.path ?? file.pack}/${file.path}`;
    const [secret] = secretProblems(path, readFileSync(join(tree, path), 'utf8'));
    if (secret !== undefined) throw new CompositionError(secret.message);
  }
}

/** The composed document: `format` and `version: 1` first, then the merged keys (§7.2). */
function composed(format: number | undefined, merged: Doc): Doc {
  return format === undefined ? {} : { format, version: 1, ...merged };
}

export function composeDocuments(
  tree: string,
  catalog: Catalog,
  request: string[],
  given: ParameterValues,
  options: { givenAsText?: boolean } = {},
): ComposedDocuments {
  const packs = resolve(tree, catalog, request);
  const parameters = resolveParameters(packs, given, options);
  const values = new Map([...parameters.values()]
    .map((parameter) => [parameter.name, parameter.value]));
  const files = readFiles(tree, packs, values, parameterScopes(packs, parameters));
  checkWorkflows(tree, catalog, packs, files);

  const dna = fragmentsOf('dna', packs, files);
  for (const fragment of dna.fragments) checkDnaFragment(fragment.pack, fragment.data);
  const roles = fragmentsOf('roles', packs, files);
  const mergedRoles = mergeFragments('roles', roles.fragments);
  const shipped = new Set(packs.flatMap((pack) => pack.manifest.contents.directives ?? []));
  checkRoleDirectives(mergedRoles, shipped);
  const memory = fragmentsOf('memory', packs, files);
  const mergedMemory = mergeMemoryWithOwners(memory.fragments, catalog.foundation);

  return {
    packs,
    files,
    dna: composed(dna.format, mergeFragments('dna', dna.fragments)),
    roles: composed(roles.format, mergedRoles),
    memory: composed(memory.format, mergedMemory.doc),
    memoryTypes: mergedMemory.definedBy,
  };
}
