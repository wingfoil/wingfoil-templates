// The lint's reading of a pack's files (task-012), with no composition: every `{{name}}` in the
// pack's parameter scope (its own and its transitive requires', spec-001 §8.1) is replaced by the
// parameter's default, or by a placeholder of its type, so that the YAML can be parsed and the
// checks the composer makes on assets and fragments can run on every pack of the tree.
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isScalar } from 'yaml';

import { formatMessage } from './formats';
import { readFrontmatter } from './frontmatter';
import { assetIdMessage, slotKindMessage } from './output';
import { kindOf, listedFiles } from './pack-rules';
import type { PackLike } from './pack-rules';
import { defaultMessage, referencesIn } from './parameters';
import type { ParameterValue } from './parameters';
import type { Problem } from './problems';
import type { ParameterDeclaration } from './resolve';
import { YamlError, parseYaml } from './yaml-load';
import type { LoadedYaml } from './yaml-load';

export interface LintPack extends PackLike {
  /** The ids its `requires` names, in order. */
  requiredIds: string[];
}

export interface PackFile {
  /** Relative to the pack. */
  path: string;
  /** Relative to the tree. */
  file: string;
  /** After substitution. */
  text: string;
  /** The YAML file, or the frontmatter of a Markdown asset; undefined when it does not parse. */
  yaml?: LoadedYaml;
  /** Line of the YAML's first line in the file: 1 for YAML, 2 for a frontmatter. */
  firstLine: number;
}

type Doc = Record<string, unknown>;

function isDoc(value: unknown): value is Doc {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** The placeholder of a required parameter's type: `x`, `0` or `false` (acceptance 10). */
export function placeholderOf(type: string): ParameterValue {
  if (type === 'integer') return 0;
  if (type === 'boolean') return false;
  return 'x';
}

/** The ids a pack reaches through `requires`, itself included. */
export function reachable(pack: LintPack, packs: Map<string, LintPack>): string[] {
  const seen = new Set<string>([pack.id]);
  const queue = [...pack.requiredIds];
  for (let id = queue.shift(); id !== undefined; id = queue.shift()) {
    if (seen.has(id)) continue;
    seen.add(id);
    queue.push(...(packs.get(id)?.requiredIds ?? []));
  }
  return [...seen];
}

/** The parameters in a pack's scope, each with the pack declaring it. */
function scopeOf(pack: LintPack, packs: Map<string, LintPack>):
Map<string, ParameterDeclaration> {
  const scope = new Map<string, ParameterDeclaration>();
  for (const id of reachable(pack, packs)) {
    for (const [name, declaration] of Object.entries(packs.get(id)?.manifest.parameters ?? {})) {
      if (!scope.has(name)) scope.set(name, declaration);
    }
  }
  return scope;
}

function lineOf(text: string, offset: number): { line: number; column: number } {
  const before = text.slice(0, offset).split('\n');
  return { line: before.length, column: (before[before.length - 1] ?? '').length + 1 };
}

function located(file: PackFile, pointer: string): { line: number; column: number } {
  const position = file.yaml?.positionOf(pointer) ?? { line: 1, column: 1 };
  return { line: position.line + file.firstLine - 1, column: position.column };
}

/** The format and identifier checks the composer makes, on one file (§5, §6.1, §9). */
function assetProblems(pack: LintPack, file: PackFile, slots: Set<string>): Problem[] {
  const kind = kindOf(file.path);
  if (kind === undefined) return [];
  const label = `${pack.id}: ${file.path}`;
  if (file.yaml === undefined) {
    return [{ file: file.file, rule: 'formats', message: `${label} has no frontmatter` }];
  }
  const fields = file.yaml.data;
  if (!isDoc(fields)) {
    return [{ file: file.file, rule: 'parse', message: `${label}: its header must be a mapping` }];
  }
  const problems: Problem[] = [];
  const node = file.yaml.document.get('format', true);
  const format = formatMessage({ label, kind, declared: fields['format'],
    source: isScalar(node) ? node.source : undefined, expected: pack.manifest.formats[kind] });
  if (format !== undefined) {
    problems.push({ file: file.file, ...located(file, '/format'), rule: 'formats', message: format });
  }
  const stem = file.path.slice(file.path.lastIndexOf('/') + 1, file.path.lastIndexOf('.'));
  const idKey = kind === 'workflow' ? 'name' : kind === 'directive' ? 'id'
    : kind === 'memory-template' ? 'type' : undefined;
  if (idKey !== undefined) {
    const id = assetIdMessage(label, idKey, fields[idKey], stem);
    if (id !== undefined) {
      problems.push({ file: file.file, ...located(file, `/${idKey}`), rule: 'asset-id',
        message: id });
    }
  }
  if (kind === 'workflow' && slots.has(stem)) {
    const slot = slotKindMessage(label, stem, fields['kind']);
    if (slot !== undefined) {
      problems.push({ file: file.file, ...located(file, '/kind'), rule: 'slot', message: slot });
    }
  }
  return problems;
}

/**
 * Reads every listed file of a pack that exists (a missing one is the inventory rule's), with its
 * parameters substituted, and checks parameter defaults, references, formats and identifiers.
 */
export function readPackFiles(
  tree: string,
  pack: LintPack,
  packs: Map<string, LintPack>,
  slots: Set<string>,
): { files: PackFile[]; problems: Problem[] } {
  const problems: Problem[] = [];
  for (const [name, declaration] of Object.entries(pack.manifest.parameters ?? {})) {
    const message = defaultMessage(pack, name, declaration);
    if (message !== undefined) {
      const { line, column } = pack.source.positionOf(`/parameters/${name}/default`);
      problems.push({ file: `${pack.path}/pack.yaml`, line, column, rule: 'parameter-default',
        message });
    }
  }
  const scope = scopeOf(pack, packs);
  const files: PackFile[] = [];
  for (const path of listedFiles(pack.manifest.contents)) {
    const file = `${pack.path}/${path}`;
    // A missing file, or a directory in its place, is the inventory rule's problem.
    if (!existsSync(join(tree, file)) || !lstatSync(join(tree, file)).isFile()) continue;
    const raw = readFileSync(join(tree, file), 'utf8');
    for (const reference of referencesIn(raw)) {
      if (!scope.has(reference.name)) {
        problems.push({ file, ...lineOf(raw, reference.offset), rule: 'parameter-scope',
          message: `${file}: {{${reference.name}}} names no parameter in the scope of ${pack.id}` });
      }
    }
    const text = raw.replace(/\{\{([a-z][a-z0-9_]*)\}\}/g, (_match, name: string) => {
      const declaration = scope.get(name);
      if (declaration === undefined) return 'x';
      // The schema has typed the default: a string, an integer or a boolean.
      const value = (declaration.default ?? placeholderOf(declaration.type)) as ParameterValue;
      return String(value);
    });
    const packFile: PackFile = { path, file, text, firstLine: path.endsWith('.md') ? 2 : 1 };
    try {
      if (path.endsWith('.yaml')) {
        packFile.yaml = parseYaml(text, file);
      } else if (kindOf(path) !== undefined) {
        const frontmatter = readFrontmatter(text, file);
        if (frontmatter !== undefined) packFile.yaml = frontmatter;
      }
    } catch (error) {
      if (!(error instanceof YamlError)) throw error;
      problems.push({ file, rule: 'parse', message: error.message });
      files.push(packFile);
      continue;
    }
    files.push(packFile);
    problems.push(...assetProblems(pack, packFile, slots));
  }
  return { files, problems };
}
