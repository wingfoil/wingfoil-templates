// The fixture-element checks (dl-012 D8, spec-003 §11 [E], task-094): generic functions reading a
// composed fixture project's Memory elements. They name no pack, type or field: WingFoil 0.3.2's
// memory.yaml declares neither allowed values nor references (spec-003 §3.1, F-043, F-050), so the
// caller passes the bindings. Each check returns its problems as `<file>: <message>`, sorted.
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { readFrontmatter } from '../../src/frontmatter';
import { listItems } from '../../src/parameters';
import { YamlError, loadYamlFile } from '../../src/yaml-load';

export { listItems };

/** A Memory element of a composed project. */
export interface FixtureElement {
  type: string;
  id: string;
  status: string;
  /** Relative to the project. */
  file: string;
  fields: Record<string, unknown>;
  body: string;
}

export interface AllowedBinding { type: string; field: string; allowed: string[] }

export type ReferenceKind = 'element' | 'file' | 'workflow-phase' | 'version' | 'commit';

export interface ReferenceBinding {
  type: string;
  field: string;
  kinds: ReferenceKind[];
  /** The value's comma-separated parts are the candidates, not the whole value. */
  split?: boolean;
  /** `every` candidate resolves, or `some` (at least one) does. */
  mode: 'every' | 'some';
}

export interface ReferenceContext {
  /** Each declared workflow with its phases. */
  workflows?: Record<string, string[]>;
  versions?: string[];
}

export interface BackBinding { type: string; field: string; through: string }

export interface StateBinding { type: string; status: string; fields: string[] }

export interface RefusedBinding { parameter: string; item: string }

type Doc = Record<string, unknown>;

interface TypeEntry {
  path: string;
  states?: { sequence?: string[] };
  template?: {
    file?: string;
    frontmatter?: {
      required?: string[];
      not_applicable_allowed?: string[];
      lists?: string[];
      exempt?: Record<string, string[]>;
    };
  };
}

interface MemoryYaml {
  defaults?: { states?: { sequence?: string[] } };
  types: Record<string, TypeEntry>;
}

function isDoc(value: unknown): value is Doc {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function byBytes(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function memoryOf(project: string): MemoryYaml {
  const data = loadYamlFile(join(project, '.wingfoil', 'memory.yaml'),
    '.wingfoil/memory.yaml').data;
  const types = isDoc(data) && isDoc(data['types']) ? data['types'] : {};
  return { ...(isDoc(data) ? data : {}), types: types as Record<string, TypeEntry> };
}

/** WingFoil 0.3.2's `staticDirPrefix`: up to the last `/` before the first `{`. */
function staticDirPrefix(pattern: string): string {
  const brace = pattern.indexOf('{');
  const fixed = brace === -1 ? pattern : pattern.slice(0, brace);
  const slash = fixed.lastIndexOf('/');
  return slash === -1 ? '' : fixed.slice(0, slash);
}

/** WingFoil 0.3.2's `computeMemoryContentRoots`: each type's prefix, nested roots dropped. */
function contentRoots(memory: MemoryYaml): string[] {
  const all = [...new Set(Object.values(memory.types).map((type) => staticDirPrefix(type.path))
    .filter((dir) => dir !== ''))].sort(byBytes);
  return all.filter((dir) => !all.some((other) => other !== dir && dir.startsWith(`${other}/`)));
}

function markdownUnder(dir: string): string[] {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return [];
  if (existsSync(join(dir, '.git'))) return [];
  return readdirSync(dir).sort(byBytes).flatMap((name) => {
    const path = join(dir, name);
    if (lstatSync(path).isSymbolicLink()) return [];
    if (statSync(path).isDirectory()) return markdownUnder(path);
    return name.endsWith('.md') ? [path] : [];
  });
}

/** A scalar's text; anything else is no text. */
function scalarText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? String(value) : '';
}

function relativeTo(project: string, path: string): string {
  return relative(project, path).split(sep).join('/');
}

function bodyOf(text: string): string {
  const match = /^\uFEFF?---\r?\n(?:[\s\S]*?\r?\n)?---\r?(?:\n|$)/.exec(text);
  return match === null ? text : text.slice(match[0].length);
}

/** Every Memory element of a composed project, found as WingFoil 0.3.2 finds them (criterion 1). */
export function readElements(project: string): { elements: FixtureElement[]; problems: string[] } {
  const memory = memoryOf(project);
  const elements: FixtureElement[] = [];
  const problems: string[] = [];
  const files = [...new Set(contentRoots(memory).flatMap((root) =>
    markdownUnder(join(project, root))))].sort(byBytes);
  for (const path of files) {
    const file = relativeTo(project, path);
    const text = readFileSync(path, 'utf8');
    let fields: unknown;
    try {
      fields = readFrontmatter(text, file)?.data;
    } catch (error) {
      if (!(error instanceof YamlError)) throw error;
      problems.push(`${file}: its frontmatter does not parse: ${error.message}`);
      continue;
    }
    if (!isDoc(fields) || typeof fields['type'] !== 'string') continue;
    const type = fields['type'];
    if (!Object.hasOwn(memory.types, type)) {
      problems.push(`${file}: type ${type} is not declared in .wingfoil/memory.yaml`);
      continue;
    }
    elements.push({ type, id: scalarText(fields['id']), status: scalarText(fields['status']),
      file, fields, body: bodyOf(text) });
  }
  return { elements, problems: problems.sort(byBytes) };
}

/** WingFoil 0.3.2's `isEmptyValue`: absent, null, blank, a mapping, a list off `lists`. */
function isEmpty(value: unknown, listField: boolean): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return !listField;
  if (value instanceof Date) return false;
  return typeof value === 'object';
}

const NOT_APPLICABLE_SHAPE = /^n\/a(?!\w)/i;
const NOT_APPLICABLE_WITH_REASON = /^n\/a\s*—\s*\S/i;
const NOT_APPLICABLE_WITHOUT_REASON = /^n\/a\s*(?:—\s*)?$/i;

function isNotApplicable(value: unknown): value is string {
  return typeof value === 'string' && NOT_APPLICABLE_SHAPE.test(value.trim());
}

/** Whether a field may hold a not-applicable value and this one has the accepted form. */
function acceptedNotApplicable(memory: MemoryYaml, type: string, field: string,
  value: unknown): boolean {
  const allowed = memory.types[type]?.template?.frontmatter?.not_applicable_allowed ?? [];
  return isNotApplicable(value) && field !== 'title' && allowed.includes(field)
    && NOT_APPLICABLE_WITH_REASON.test(value.trim());
}

function filled(memory: MemoryYaml, element: FixtureElement, field: string): boolean {
  const lists = memory.types[element.type]?.template?.frontmatter?.lists ?? [];
  const value = Object.hasOwn(element.fields, field) ? element.fields[field] : undefined;
  return !isEmpty(value, field !== 'title' && lists.includes(field));
}

/** The type's initial state: its `states.sequence[0]`, else the defaults'. */
function initialState(memory: MemoryYaml, type: string): string | undefined {
  return memory.types[type]?.states?.sequence?.[0] ?? memory.defaults?.states?.sequence?.[0];
}

/** Required fields, as WingFoil 0.3.2's `memory submit` checks them (criterion 2, FA-3). */
export function requiredFieldProblems(project: string, elements: FixtureElement[]): string[] {
  const memory = memoryOf(project);
  const problems: string[] = [];
  for (const element of elements) {
    if (element.status === initialState(memory, element.type)) continue;
    const template = memory.types[element.type]?.template?.frontmatter;
    const exempt = template?.exempt ?? {};
    const required = [...new Set(['title', ...(template?.required ?? [])])].filter((field) =>
      !(Object.hasOwn(exempt, field) && (exempt[field] ?? []).includes(element.id)));
    const missing = required.filter((field) => !filled(memory, element, field));
    if (missing.length > 0) {
      problems.push(`${element.file}: missing required field: ${missing.join(', ')}`);
    }
    const refused = required.filter((field) => isNotApplicable(element.fields[field])
      && !acceptedNotApplicable(memory, element.type, field, element.fields[field]));
    for (const field of refused) {
      const value = scalarText(element.fields[field]).trim();
      const reason = !(template?.not_applicable_allowed ?? []).includes(field) || field === 'title'
        ? 'does not accept a not-applicable value'
        : NOT_APPLICABLE_WITHOUT_REASON.test(value) ? 'needs a reason, "n/a — <reason>"'
          : 'must be written "n/a — <reason>", with an em dash';
      problems.push(`${element.file}: ${field} ${reason}`);
    }
  }
  return problems.sort(byBytes);
}

/** A field's values: a string, or each item of a list. */
function valuesOf(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(scalarText).filter((item) => item !== '');
  const text = scalarText(value);
  return text === '' ? [] : [text];
}

/** Allowed values (criterion 3, FA-4). */
export function allowedValueProblems(project: string, elements: FixtureElement[],
  bindings: AllowedBinding[]): string[] {
  const memory = memoryOf(project);
  const problems: string[] = [];
  for (const binding of bindings) {
    for (const element of elements.filter((each) => each.type === binding.type)) {
      const value = element.fields[binding.field];
      if (acceptedNotApplicable(memory, element.type, binding.field, value)) continue;
      for (const item of valuesOf(value).filter((each) => !binding.allowed.includes(each))) {
        problems.push(`${element.file}: ${binding.field} holds ${item}, not one of `
          + binding.allowed.join(', '));
      }
    }
  }
  return problems.sort(byBytes);
}

/** The element an id or a project-relative path names. */
function elementNamed(elements: FixtureElement[], reference: string): FixtureElement | undefined {
  return elements.find((each) => each.id === reference || each.file === reference);
}

function isProjectFile(project: string, reference: string): boolean {
  if (reference === '' || reference.startsWith('/') || reference.split('/').includes('..')) {
    return false;
  }
  const path = join(project, reference);
  return existsSync(path) && statSync(path).isFile();
}

function isCommit(project: string, reference: string): boolean {
  if (!/^[0-9a-f]{7,40}$/.test(reference)) return false;
  try {
    execFileSync('git', ['-C', project, 'cat-file', '-e', `${reference}^{commit}`],
      { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function resolves(project: string, elements: FixtureElement[], kinds: ReferenceKind[],
  context: ReferenceContext, reference: string): boolean {
  return kinds.some((kind) => {
    switch (kind) {
      case 'element': return elementNamed(elements, reference) !== undefined;
      case 'file': return isProjectFile(project, reference);
      case 'version': return (context.versions ?? []).includes(reference);
      case 'commit': return isCommit(project, reference);
      default: {
        const [workflow = '', phase] = reference.split('.');
        const phases = context.workflows?.[workflow];
        return phases !== undefined && (phase === undefined || phases.includes(phase));
      }
    }
  });
}

/** References that resolve (criterion 4, FA-5, F-043). */
export function referenceProblems(project: string, elements: FixtureElement[],
  bindings: ReferenceBinding[], context: ReferenceContext = {}): string[] {
  const memory = memoryOf(project);
  const problems: string[] = [];
  for (const binding of bindings) {
    for (const element of elements.filter((each) => each.type === binding.type)) {
      const value = element.fields[binding.field];
      if (acceptedNotApplicable(memory, element.type, binding.field, value)) continue;
      const candidates = valuesOf(value).flatMap((each) =>
        binding.split === true ? listItems(each) : [each.trim()]).filter((each) => each !== '');
      if (candidates.length === 0) continue;
      const unresolved = candidates.filter((each) =>
        !resolves(project, elements, binding.kinds, context, each));
      const failed = binding.mode === 'some' ? unresolved.length === candidates.length
        : unresolved.length > 0;
      if (failed) {
        problems.push(`${element.file}: ${binding.field}: ${unresolved.join(', ')} does not `
          + `resolve as ${binding.kinds.join(' or ')}`
          + (binding.mode === 'some' ? ' (none of its references does)' : ''));
      }
    }
  }
  return problems.sort(byBytes);
}

/** The field names a type's composed template declares in its frontmatter. */
function templateFields(project: string, memory: MemoryYaml, type: string): Set<string> {
  const file = memory.types[type]?.template?.file;
  if (file === undefined) return new Set();
  const path = join(project, '.wingfoil', file);
  if (!existsSync(path)) return new Set();
  const data = readFrontmatter(readFileSync(path, 'utf8'), file)?.data;
  return new Set(isDoc(data) ? Object.keys(data) : []);
}

/** Back-references (criterion 5, FA-6, spec-003 §8). */
export function backReferenceProblems(project: string, elements: FixtureElement[],
  bindings: BackBinding[]): string[] {
  const memory = memoryOf(project);
  const problems: string[] = [];
  for (const binding of bindings) {
    for (const element of elements.filter((each) => each.type === binding.type)) {
      const names = [element.id, element.file];
      for (const reference of valuesOf(element.fields[binding.field]).map((each) => each.trim())) {
        const target = elementNamed(elements, reference);
        if (target !== undefined) {
          if (templateFields(project, memory, target.type).has(binding.through)) {
            if (!valuesOf(target.fields[binding.through]).some((each) => names.includes(each))) {
              problems.push(`${element.file}: ${target.file} does not cite it back in `
                + binding.through);
            }
          } else if (!names.some((name) => target.body.includes(name))) {
            problems.push(`${element.file}: ${target.file} does not cite it back in its body`);
          }
        } else if (isProjectFile(project, reference)) {
          const text = readFileSync(join(project, reference), 'utf8');
          if (!names.some((name) => text.includes(name))) {
            problems.push(`${element.file}: ${reference} does not cite it back`);
          }
        } else {
          problems.push(`${element.file}: ${binding.field} names ${reference}, which is neither `
            + 'an element nor a file of the project');
        }
      }
    }
  }
  return problems.sort(byBytes);
}

/** The fields a state requires (criterion 6). */
export function stateFieldProblems(project: string, elements: FixtureElement[],
  bindings: StateBinding[]): string[] {
  const memory = memoryOf(project);
  const problems: string[] = [];
  for (const binding of bindings) {
    for (const element of elements.filter((each) => each.type === binding.type
      && each.status === binding.status)) {
      const missing = binding.fields.filter((field) => !filled(memory, element, field));
      if (missing.length > 0) {
        problems.push(`${element.file}: ${binding.status} requires ${missing.join(', ')}`);
      }
    }
  }
  return problems.sort(byBytes);
}

function exampleFiles(dir: string): string[] {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return [];
  return readdirSync(dir).sort(byBytes).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return exampleFiles(path);
    return name === 'example.yaml' ? [path] : [];
  });
}

/** A refused item in a list parameter of every preset and README example (criterion 7). */
export function refusedItemProblems(tree: string, bindings: RefusedBinding[]): string[] {
  const presets = join(tree, 'presets');
  const files = [
    ...(existsSync(presets) ? readdirSync(presets).filter((name) => name.endsWith('.yaml'))
      .map((name) => join(presets, name)) : []),
    ...exampleFiles(join(tree, 'tests', 'fixtures', 'examples')),
  ];
  const problems: string[] = [];
  for (const path of files) {
    const file = relativeTo(tree, path);
    const data = loadYamlFile(path, file).data;
    const parameters = isDoc(data) && isDoc(data['parameters']) ? data['parameters'] : {};
    for (const binding of bindings) {
      const value = parameters[binding.parameter];
      if (typeof value === 'string' && listItems(value).includes(binding.item)) {
        problems.push(`${file}: parameter ${binding.parameter} holds ${binding.item}, which is `
          + 'refused');
      }
    }
  }
  return problems.sort(byBytes);
}
