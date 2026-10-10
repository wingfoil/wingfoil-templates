// The catalog.yaml rules of spec-001 §18 that need a git tag (task-014, moved from task-012): every
// published version's tag exists and is annotated, its entry names the tag's commit, its digest
// recomputes (§13), it copies the tagged pack.yaml, its wingfoil range recomputes from compat.yaml
// (§12), and a stage version's transition digests recompute at its tag (§14).
import { existsSync, realpathSync } from 'node:fs';
import { join } from 'node:path';

import type { LintContext } from './check-packs';
import { CompatError, loadCompat } from './compat';
import { DigestError, packDigest, transitionDigest } from './digest';
import { GitError, resolveCommit, runGit } from './git';
import type { Problem } from './problems';
import { computeRange } from './range';
import type { CompatRelease } from './range';
import { YamlError, loadYamlFile, parseYaml } from './yaml-load';
import type { LoadedYaml } from './yaml-load';

type Doc = Record<string, unknown>;

function isDoc(value: unknown): value is Doc {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function same(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/** The tag of a published version, as a full ref, so that `@` and `/` are never misread. */
export function tagRef(packId: string, version: string): string {
  return `refs/tags/${packId}@${version}`;
}

/** The type of the object a ref names (`tag` for an annotated tag), or undefined when absent. */
function objectType(tree: string, ref: string): string | undefined {
  try {
    return runGit(tree, ['cat-file', '-t', ref]).toString('utf8').trim();
  } catch (error) {
    if (error instanceof GitError) return undefined;
    throw error;
  }
}

function taggedManifest(tree: string, ref: string, packId: string): Doc | undefined {
  try {
    const text = runGit(tree, ['show', `${ref}:packs/${packId}/pack.yaml`]).toString('utf8');
    const data = parseYaml(text, `${packId}/pack.yaml`).data;
    return isDoc(data) ? data : undefined;
  } catch (error) {
    if (error instanceof GitError || error instanceof YamlError) return undefined;
    throw error;
  }
}

function releasesOf(tree: string): CompatRelease[] | undefined {
  const path = join(tree, 'compat.yaml');
  if (!existsSync(path)) return undefined;
  try {
    return loadCompat(path).releases;
  } catch (error) {
    if (error instanceof CompatError || error instanceof YamlError) return undefined;
    throw error;
  }
}

function versionProblems(tree: string, catalog: LoadedYaml, packId: string, entry: Doc,
  pointer: string, releases: CompatRelease[] | undefined): Problem[] {
  const at = (where: string, rule: string, message: string): Problem => {
    const { line, column } = catalog.positionOf(`${pointer}${where}`);
    return { file: 'catalog.yaml', line, column, rule, message };
  };
  const version = String(entry['version']);
  const tag = `${packId}@${version}`;
  const ref = tagRef(packId, version);
  const type = objectType(tree, ref);
  if (type === undefined) return [at('', 'catalog-tag', `${tag}: the tag does not exist`)];
  const problems: Problem[] = [];
  if (type !== 'tag') {
    problems.push(at('', 'catalog-tag', `${tag}: the tag is not annotated (dl-004)`));
  }
  const commit = resolveCommit(tree, ref);
  if (entry['commit'] !== commit) {
    problems.push(at('/commit', 'catalog-commit', `${tag}: commit ${String(entry['commit'])} is `
      + `not the tag's target, ${commit}`));
  }
  try {
    const digest = packDigest(tree, ref, packId).digest;
    if (entry['digest'] !== digest) {
      problems.push(at('/digest', 'catalog-digest', `${tag}: the digest recomputes to ${digest}`));
    }
  } catch (error) {
    if (!(error instanceof DigestError)) throw error;
    problems.push(at('/digest', 'catalog-digest', `${tag}: ${error.message}`));
  }
  const manifest = taggedManifest(tree, ref, packId);
  for (const field of ['version', 'formats', 'requires_capabilities', 'requires', 'conflicts']) {
    const tagged = manifest?.[field] ?? (field === 'requires' || field === 'conflicts' ? [] : undefined);
    if (manifest === undefined || !same(entry[field], tagged)) {
      problems.push(at(`/${field}`, 'catalog-manifest', `${tag}: ${field} differs from the tagged `
        + 'pack.yaml'));
    }
  }
  if (releases !== undefined) {
    const range = computeRange({
      formats: isDoc(entry['formats']) ? entry['formats'] as Record<string, number> : {},
      requires_capabilities: list(entry['requires_capabilities']).map(String),
    }, releases);
    if (entry['wingfoil'] !== range) {
      problems.push(at('/wingfoil', 'catalog-range', `${tag}: the range recomputes from `
        + `compat.yaml to ${JSON.stringify(range)}`));
    }
  }
  const transitions = entry['transitions'];
  for (const [id, digest] of Object.entries(isDoc(transitions) ? transitions : {})) {
    try {
      const recomputed = transitionDigest(tree, ref, `transitions/${id}.yaml`).digest;
      if (digest !== recomputed) {
        problems.push(at(`/transitions/${id}`, 'catalog-transition-digest', `${tag}: transition `
          + `${id} recomputes to ${recomputed}`));
      }
    } catch (error) {
      if (!(error instanceof DigestError) && !(error instanceof GitError)) throw error;
      problems.push(at(`/transitions/${id}`, 'catalog-transition-digest',
        `${tag}: transition ${id}: ${error.message}`));
    }
  }
  return problems;
}

/** The rule group of this module, for check-packs.ts. */
export function tagProblems(context: LintContext): Problem[] {
  const path = join(context.tree, 'catalog.yaml');
  if (context.broken.has('catalog.yaml') || !existsSync(path)) return [];
  const catalog = loadYamlFile(path, 'catalog.yaml');
  const packs = list((catalog.data as Doc)['packs']);
  if (!packs.some((pack) => isDoc(pack) && list(pack['versions']).length > 0)) return [];
  // Published versions are read from the tree's own git repository, whose top level it must be;
  // otherwise no tag can be read, and the catalog is reported once (the lint never passes it).
  let top: string | undefined;
  try {
    top = runGit(context.tree, ['rev-parse', '--show-toplevel']).toString('utf8').trim();
  } catch (error) {
    if (!(error instanceof GitError)) throw error;
  }
  if (top === undefined || realpathSync(top) !== realpathSync(context.tree)) {
    const { line, column } = catalog.positionOf('/packs');
    return [{ file: 'catalog.yaml', line, column, rule: 'catalog-tag', message: 'published '
      + 'versions are read from their tags, and the tree is not the top level of a git '
      + 'repository' }];
  }
  const releases = releasesOf(context.tree);
  return packs.flatMap((pack, index) => {
    if (!isDoc(pack)) return [];
    return list(pack['versions']).flatMap((entry, position) => isDoc(entry)
      ? versionProblems(context.tree, catalog, String(pack['id']), entry,
        `/packs/${index}/versions/${position}`, releases)
      : []);
  });
}
