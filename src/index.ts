// `npm run index` (spec-002 §3, task-019): CATALOG.md, catalog-index.json and llms.txt at the
// tree's root, and the generated sections of every pack README, computed in memory and then
// written, or compared with `--check`. Deterministic: the outputs depend on the tree's files and
// tags only.
import { existsSync, lstatSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

import { CatalogError, loadCatalog } from './catalog';
import { GitError } from './git';
import { byBytes, IndexInputError } from './index-data';
import { buildIndex } from './index-model';
import { IndexError } from './index-source';
import { renderCatalog, renderJson, renderLlms } from './index-render';
import { indexSchemaErrors } from './index-schema';
import { treeLayout } from './layout-rules';
import { formatProblem, sortProblems } from './problems';
import { generatedSections, rewriteReadme } from './readme-generate';
import { installListed, readmeProblems } from './readme-rules';
import { repositorySchemas } from './schemas';
import { YamlError, loadYamlFile } from './yaml-load';

export interface IndexResult {
  /** 0 done or up to date, 1 a check fails, 2 an I/O or git error, 3 bad usage. */
  code: number;
  lines: string[];
}

function count(n: number, noun: string): string {
  return `${n} ${noun}${n === 1 ? '' : 's'}`;
}

/** The packs whose pack.yaml passes its schema and that have a README.md file. */
function readmePacks(tree: string): string[] {
  return treeLayout(tree).packs.filter((id) => {
    const readme = join(tree, 'packs', id, 'README.md');
    if (!existsSync(readme) || !lstatSync(readme).isFile()) return false;
    try {
      const manifest = loadYamlFile(join(tree, 'packs', id, 'pack.yaml'), `packs/${id}/pack.yaml`);
      return repositorySchemas().validate('pack', manifest.data).length === 0;
    } catch (error) {
      if (error instanceof YamlError) return false;
      throw error;
    }
  }).sort(byBytes);
}

/** Every output, path relative to the tree → content. */
export function indexOutputs(tree: string): Map<string, string> {
  const index = buildIndex(tree);
  const errors = indexSchemaErrors(index);
  if (errors.length > 0) {
    throw new IndexError(`catalog-index.json would break its schema: ${errors.join('; ')}`);
  }
  const axes = loadCatalog(join(tree, 'catalog.yaml')).axes.map((axis) => axis.name);
  const outputs = new Map<string, string>([
    ['CATALOG.md', renderCatalog(index, axes)],
    ['catalog-index.json', renderJson(index)],
    ['llms.txt', renderLlms()],
  ]);
  for (const id of readmePacks(tree)) {
    const path = `packs/${id}/README.md`;
    outputs.set(path, rewriteReadme(readFileSync(join(tree, path), 'utf8'),
      generatedSections(tree, id)));
  }
  return outputs;
}

function current(tree: string, path: string): string | undefined {
  const full = join(tree, path);
  return existsSync(full) && lstatSync(full).isFile() ? readFileSync(full, 'utf8') : undefined;
}

function check(tree: string, outputs: Map<string, string>): IndexResult {
  const stale = [...outputs].filter(([path, text]) => current(tree, path) !== text)
    .map(([path]) => path).sort(byBytes);
  return {
    code: stale.length > 0 ? 1 : 0,
    lines: [`index: checked ${count(outputs.size, 'file')}, ${stale.length} not up to date`,
      ...stale.map((path) => `${path}: not up to date: run npm run index`)],
  };
}

/** The README rules of task-018 over the READMEs the index rewrites; undefined when none fails. */
function readmeRefusal(tree: string): IndexResult | undefined {
  const listed = installListed(tree);
  const problems = sortProblems(readmePacks(tree).flatMap((id) =>
    readmeProblems(tree, { id, path: `packs/${id}` }, listed)));
  if (problems.length === 0) return undefined;
  return { code: 1, lines: [`index: ${count(problems.length, 'README problem')}, nothing written`,
    ...problems.map(formatProblem)] };
}

function write(tree: string, outputs: Map<string, string>): IndexResult {
  let wrote = 0;
  for (const [path, text] of outputs) {
    if (current(tree, path) === text) continue;
    writeFileSync(join(tree, path), text);
    wrote += 1;
  }
  return { code: 0, lines: [`index: wrote ${count(wrote, 'file')}, ${outputs.size - wrote} `
    + 'unchanged'] };
}

export function runIndex(argv: string[]): IndexResult {
  let tree: string;
  let checking: boolean;
  try {
    const { values } = parseArgs({ args: argv, options: { tree: { type: 'string' },
      check: { type: 'boolean' } }, allowPositionals: false, strict: true });
    tree = values.tree ?? process.cwd();
    checking = values.check === true;
  } catch (error) {
    return { code: 3, lines: [error instanceof Error ? error.message : String(error)] };
  }
  if (!existsSync(tree) || !statSync(tree).isDirectory()) {
    return { code: 2, lines: [`${tree}: not a directory`] };
  }
  try {
    if (!checking) {
      const refusal = readmeRefusal(tree);
      if (refusal !== undefined) return refusal;
    }
    const outputs = indexOutputs(tree);
    return checking ? check(tree, outputs) : write(tree, outputs);
  } catch (error) {
    // One report line: a message's first line only (a YAML error quotes the source below it).
    const first = (message: string): string => `index: ${message.split('\n')[0] ?? ''}`;
    if (error instanceof IndexInputError) return { code: 1, lines: [first(error.message)] };
    // A system error (EACCES, ENOENT, ENOSPC…) is an I/O error too; any other is a defect.
    const system = error instanceof Error
      && typeof (error as NodeJS.ErrnoException).code === 'string';
    if (system || error instanceof IndexError || error instanceof GitError
      || error instanceof YamlError || error instanceof CatalogError) {
      return { code: 2, lines: [first(error.message)] };
    }
    throw error;
  }
}
