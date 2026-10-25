// `npm run check:packs`: the lint rules of spec-001 §18 and F3.5 over the whole tree (task-012).
// The schema checks run first, silently: a file that fails its schema is not linted again, and a
// pack whose pack.yaml fails it is skipped as a whole. Every rule returns all its problems.
import { existsSync, lstatSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { CatalogError, loadCatalog, softwarePack } from './catalog';
import { exampleProblems } from './example-rules';
import { EXAMPLES } from './examples';
import type { Catalog } from './catalog';
import { runCheckSchemas } from './check-schemas';
import { packLayoutProblems, treeLayout } from './layout-rules';
import { reachable, readPackFiles } from './pack-files';
import type { LintPack, PackFile } from './pack-files';
import {
  formatKindsProblems, foundationProblems, inventoryProblems, manifestProblems, slotProblems,
} from './pack-rules';
import { installListed, readmeProblems } from './readme-rules';
import { parseEntry } from './requirements';
import { formatProblem, sortProblems } from './problems';
import type { Problem } from './problems';
import type { PackManifest } from './resolve';
import { repositorySchemas } from './schemas';
import { secretProblems } from './secret-rules';
import { overlayProblems } from './overlay-rules';
import { hasInbox, newestSchemaRecord, readNotes } from './feedback-inbox';
import { schemaListing } from './schema-digest';
import { tagProblems } from './tag-rules';
import { treeProblems } from './tree-rules';
import { workflowProblems } from './workflow-rules';
import { YamlError, loadYamlFile } from './yaml-load';

export interface CheckPacksResult {
  /** 0 no problem, 1 a rule failed, 2 an I/O error. */
  code: number;
  /** The files the lint covers (acceptance 2). */
  checked: number;
  problems: Problem[];
  /** The report: the summary line, then one line per problem. */
  lines: string[];
}

/** What every rule group gets: the tree, its catalog, its packs and their files. */
export interface LintContext {
  tree: string;
  catalog: Catalog | undefined;
  packs: Map<string, LintPack>;
  files: Map<string, PackFile[]>;
  /** Files that failed their schema, relative to the tree. */
  broken: Set<string>;
}

/** The folders whose every file the lint covers: pack content, and the examples (task-022). */
const FOLDERS = ['packs', 'presets', 'transitions', EXAMPLES];

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? '' : 's'}`;
}

function checkedFiles(tree: string): number {
  let total = 0;
  for (const root of ['catalog.yaml', 'compat.yaml']) {
    if (existsSync(join(tree, root)) && lstatSync(join(tree, root)).isFile()) total += 1;
  }
  for (const folder of FOLDERS) total += filesUnder(tree, folder).length;
  return total;
}

function requiredIdsOf(manifest: PackManifest): string[] {
  return (manifest.requires ?? []).flatMap((entry) => {
    try {
      return [parseEntry(entry, 'requires').id];
    } catch {
      return [];
    }
  });
}

/** The packs of the tree whose pack.yaml loads and passes its schema. */
function loadPacks(tree: string, ids: string[], problems: Problem[]): Map<string, LintPack> {
  const schemas = repositorySchemas();
  const packs = new Map<string, LintPack>();
  for (const id of ids) {
    const path = `packs/${id}`;
    const file = `${path}/pack.yaml`;
    let source;
    try {
      source = loadYamlFile(join(tree, file), file);
    } catch (error) {
      if (!(error instanceof YamlError) || error.reason === 'io') throw error;
      problems.push({ file, rule: 'parse', message: error.message });
      continue;
    }
    if (schemas.validate('pack', source.data).length > 0) continue;
    const manifest = source.data as PackManifest;
    packs.set(id, { id, path, manifest, source, requiredIds: requiredIdsOf(manifest) });
  }
  return packs;
}

function packProblems(context: LintContext): Problem[] {
  const problems: Problem[] = [];
  const slots = new Set(context.catalog?.slots.map((slot) => slot.name) ?? []);
  const listed = installListed(context.tree);
  for (const pack of context.packs.values()) {
    problems.push(...manifestProblems(pack), ...inventoryProblems(context.tree, pack),
      ...formatKindsProblems(pack), ...packLayoutProblems(context.tree, pack),
      ...readmeProblems(context.tree, pack, listed));
    if (context.catalog !== undefined) {
      const reached = reachable(pack, context.packs);
      problems.push(...foundationProblems(context.catalog, pack, reached),
        ...slotProblems(context.catalog, pack, reached));
    }
    const read = readPackFiles(context.tree, pack, context.packs, slots,
      context.catalog === undefined ? undefined : softwarePack(context.catalog));
    context.files.set(pack.id, read.files);
    problems.push(...read.problems);
  }
  return problems;
}

function workflowGroup(context: LintContext): Problem[] {
  return [...context.packs.values()].flatMap((pack) =>
    workflowProblems(context.catalog, pack, context.packs, context.files));
}

/** wingfoil-cli rule 8 (task-015): schema/ is as the newest schema feedback note records it. */
function schemaNoteGroup(context: LintContext): Problem[] {
  const current = schemaListing(context.tree);
  if (current === undefined || !hasInbox(context.tree)) return [];
  const recorded = newestSchemaRecord(readNotes(context.tree));
  if (recorded?.digest === current.digest) return [];
  return [{ file: 'schema', rule: 'schema-note', message: `schema/ is ${current.digest}, and no `
    + 'feedback note records it: run npm run feedback:note -- --schema (wingfoil-cli rule 8)' }];
}

/** Every regular file under a folder, relative to the tree, links and other entries not entered. */
function filesUnder(tree: string, rel: string): string[] {
  if (!existsSync(join(tree, rel)) || !lstatSync(join(tree, rel)).isDirectory()) return [];
  return readdirSync(join(tree, rel)).sort().flatMap((name) => {
    const stat = lstatSync(join(tree, rel, name));
    if (stat.isDirectory()) return filesUnder(tree, `${rel}/${name}`);
    return stat.isFile() ? [`${rel}/${name}`] : [];
  });
}

function secretGroup(context: LintContext): Problem[] {
  return FOLDERS.flatMap((folder) => filesUnder(context.tree, folder))
    .flatMap((file) => secretProblems(file, readFileSync(join(context.tree, file), 'utf8')));
}

/** The rule groups, in order; each sees the context and the problems the ones before it found. */
const GROUPS: readonly ((context: LintContext, earlier: Problem[]) => Problem[])[] = [
  packProblems, treeProblems, exampleProblems, tagProblems, workflowGroup, overlayProblems, secretGroup,
  schemaNoteGroup,
];

/**
 * The context the rule groups read: the tree's layout (its problems added to `problems`), its
 * catalog when it loads, and the packs whose pack.yaml loads and passes its schema. `validate`
 * builds one on its merged tree for an overlay's compositions (task-046).
 */
export function lintContext(tree: string, broken: Set<string>, problems: Problem[]): LintContext {
  const layout = treeLayout(tree);
  problems.push(...layout.problems);
  let catalog: Catalog | undefined;
  if (existsSync(join(tree, 'catalog.yaml')) && !broken.has('catalog.yaml')) {
    try {
      catalog = loadCatalog(join(tree, 'catalog.yaml'));
    } catch (error) {
      if (!(error instanceof CatalogError) && !(error instanceof YamlError)) throw error;
    }
  }
  return { tree, catalog, broken, files: new Map(),
    packs: loadPacks(tree, layout.packs, problems) };
}

export interface CheckPacksOptions {
  /**
   * Report each file that failed its schema as a `schema` problem, so that the command alone
   * never passes such a tree; `validate`, which prints the schema check, turns it off.
   */
  schemaProblems?: boolean;
}

export function runCheckPacks(tree: string, options: CheckPacksOptions = {}): CheckPacksResult {
  if (!existsSync(tree) || !statSync(tree).isDirectory()) {
    return { code: 2, checked: 0, problems: [], lines: [`${tree}: not a directory`] };
  }
  try {
    const schemas = runCheckSchemas(tree);
    const broken = new Set(schemas.messages.map((message) => message.slice(0, message.indexOf(':'))));
    const problems: Problem[] = [];
    if (options.schemaProblems !== false) {
      for (const file of [...broken].sort()) {
        problems.push({ file, rule: 'schema',
          message: `${file} fails its schema; npm run check:schemas names the problems` });
      }
    }
    const context = lintContext(tree, broken, problems);
    for (const group of GROUPS) problems.push(...group(context, problems));
    const sorted = sortProblems(problems);
    const checked = checkedFiles(tree);
    return {
      code: sorted.length > 0 ? 1 : 0,
      checked,
      problems: sorted,
      lines: [`lint: checked ${count(checked, 'file')}, ${count(sorted.length, 'problem')}`,
        ...sorted.map(formatProblem)],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { code: 2, checked: 0, problems: [], lines: [`lint: ${message}`] };
  }
}
