// `npm run publish:pack` (task-014, pack-release-cycle › publish, after the approval gate): checks the
// version, re-validates in publication mode at HEAD as a guard, tags `<catalog pack id>@<version>`,
// then adds the catalog entry in a later commit (spec-001 §11), with the digest (§13), the computed
// range (§12) and, for a stage pack, its transitions' digests (§14). It never pushes. Until
// `npm run index` exists (wave W14), CATALOG.md and catalog-index.json are left unchanged (plan-023).
// With --dry-run it works in a temporary clone and leaves the repository as it was.
import { existsSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync }
  from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { gt, valid } from 'semver';

import { addVersion } from './catalog-edit';
import { CatalogError, loadCatalog } from './catalog';
import type { Catalog } from './catalog';
import { findFiles } from './check-schemas';
import { CompatError, loadCompat } from './compat';
import { DigestError, isCatalogPackId, packDigest, transitionDigest } from './digest';
import { GitError, callerIdentity, resolveCommit, runGit } from './git';
import { computeRange } from './range';
import { ResolveError, resolve } from './resolve';
import type { PackManifest } from './resolve';
import { runValidate } from './validate';
import { YamlError, loadYamlFile, parseYaml } from './yaml-load';

export interface PublishOptions {
  /** Replaces the install of a release: the tests' stub WingFoil (task-011); no CLI option. */
  install?: (version: string) => string;
  /** The caller's environment, from which the git identity is read; process.env by default. */
  env?: NodeJS.ProcessEnv;
}

export interface PublishResult {
  code: number;
  lines: string[];
}

type Doc = Record<string, unknown>;

/** A failure with its exit code: 1 a check, 2 an I/O or git error, 3 bad usage. */
class PublishError extends Error {
  constructor(readonly code: number, message: string, readonly before: string[] = []) {
    super(message);
  }
}

interface Args {
  pack: string;
  tree: string;
  params: string[];
  entries: string[];
  dryRun: boolean;
}

function parse(argv: string[]): Args {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      options: {
        pack: { type: 'string' },
        tree: { type: 'string' },
        param: { type: 'string', multiple: true },
        'dry-run': { type: 'boolean' },
      },
      allowPositionals: true,
      strict: true,
    });
  } catch (error) {
    throw new PublishError(3, error instanceof Error ? error.message : String(error));
  }
  const { values, positionals } = parsed;
  if (values.pack === undefined || !isCatalogPackId(values.pack)) {
    throw new PublishError(3, '--pack <catalog pack id> is required (spec-001 §4)');
  }
  return { pack: values.pack, tree: values.tree ?? process.cwd(), params: values.param ?? [],
    entries: positionals, dryRun: values['dry-run'] ?? false };
}

function git(tree: string, args: string[], extra?: NodeJS.ProcessEnv): string {
  return runGit(tree, args, undefined, extra).toString('utf8').trim();
}

/** The tree must be the top level of a git repository, with a clean working tree. */
function checkRepository(tree: string): void {
  let top: string;
  try {
    top = git(tree, ['rev-parse', '--show-toplevel']);
  } catch {
    throw new PublishError(3, `${tree} is not a git repository`);
  }
  if (realpathSync(top) !== realpathSync(tree)) {
    throw new PublishError(3, `${tree} is not the top level of its git repository (${top})`);
  }
  const status = git(tree, ['status', '--porcelain', '--untracked-files=normal']);
  if (status !== '') {
    throw new PublishError(1, `the working tree is not clean:\n${status}`);
  }
}

function tagExists(tree: string, tag: string): boolean {
  try {
    git(tree, ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}`]);
    return true;
  } catch {
    return false;
  }
}

function load<T>(read: () => T, file: string): T {
  try {
    return read();
  } catch (error) {
    if (error instanceof CatalogError || error instanceof CompatError
      || (error instanceof YamlError && error.reason !== 'io')) {
      throw new PublishError(1, `${file}: ${error.message}`);
    }
    if (error instanceof YamlError) throw new PublishError(2, error.message);
    throw error;
  }
}

/** The compositions the validation covers that contain the pack: presets, then the entries. */
function compositionsWith(tree: string, catalog: Catalog, pack: string, entries: string[]):
string[] {
  const requests: [string, string[]][] = [];
  for (const { file } of findFiles(tree).filter((found) => found.kind === 'preset')) {
    const data = loadYamlFile(join(tree, file), file).data as Doc;
    requests.push([file, (Array.isArray(data['packs']) ? data['packs'] : []).map(String)]);
  }
  if (entries.length > 0) requests.push(['entries', entries]);
  return requests.filter(([, request]) => {
    try {
      return resolve(tree, catalog, request).some((resolved) => resolved.id === pack);
    } catch (error) {
      if (error instanceof ResolveError) return false;
      throw error;
    }
  }).map(([label]) => label);
}

/** The CHANGELOG.md line of the version: `- <version>: …`. */
function changelogEntry(tree: string, pack: string, version: string): string {
  const file = join(tree, 'packs', pack, 'CHANGELOG.md');
  const text = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const line = text.split('\n').find((candidate) => candidate.startsWith(`- ${version}:`));
  if (line === undefined) {
    throw new PublishError(1, `packs/${pack}/CHANGELOG.md has no entry "- ${version}: …"`);
  }
  return line;
}

/** For a stage pack, the transitions that lead to it (§14), as `transitions/<id>.yaml` files. */
function transitionsTo(tree: string, pack: string): string[] {
  if (!pack.startsWith('stage/') || !existsSync(join(tree, 'transitions'))) return [];
  return readdirSync(join(tree, 'transitions')).filter((name) => name.endsWith('.yaml')).sort()
    .map((name) => `transitions/${name}`)
    .filter((file) => (parseYaml(readFileSync(join(tree, file), 'utf8'), file).data as Doc)['to']
      === pack);
}

function publishIn(tree: string, args: Args, options: PublishOptions, cache: string | undefined,
  identity: NodeJS.ProcessEnv): string[] {
  const lines: string[] = [];
  const pack = args.pack;
  const manifestFile = `packs/${pack}/pack.yaml`;
  if (!existsSync(join(tree, manifestFile))) {
    throw new PublishError(1, `${manifestFile} does not exist`);
  }
  const manifest = load(() => loadYamlFile(join(tree, manifestFile), manifestFile).data,
    manifestFile) as PackManifest;
  const version = manifest.version;
  const tag = `${pack}@${version}`;
  const catalog = load(() => loadCatalog(join(tree, 'catalog.yaml')), 'catalog.yaml');
  const catalogText = readFileSync(join(tree, 'catalog.yaml'), 'utf8');
  const published = ((catalog.raw['packs'] as Doc[] | undefined) ?? [])
    .find((entry) => entry['id'] === pack);
  for (const entry of (published?.['versions'] as Doc[] | undefined) ?? []) {
    const previous = String(entry['version']);
    if (valid(previous) !== null && !gt(version, previous)) {
      throw new PublishError(1, `${pack} ${version} is not above the published ${previous} (one `
        + 'living line before WingFoil 1.0; maintenance lines are plan-015 task 13)');
    }
  }
  if (tagExists(tree, tag)) throw new PublishError(1, `the tag ${tag} already exists`);
  const changelog = changelogEntry(tree, pack, version);
  if (compositionsWith(tree, catalog, pack, args.entries).length === 0) {
    throw new PublishError(1, `no composition of the validation contains ${pack}: give a preset or `
      + 'a documented combination that contains it (pack-compatibility)');
  }
  const compat = load(() => loadCompat(join(tree, 'compat.yaml')), 'compat.yaml');
  const range = computeRange({ formats: manifest.formats,
    requires_capabilities: manifest.requires_capabilities ?? [] }, compat.releases);
  if (range === '') {
    throw new PublishError(1, `${tag}: no release of compat.yaml is compatible (an empty range, `
      + 'spec-001 §12)');
  }

  // The guard: the publication validation again, at HEAD (dl-009).
  const validateArgs = ['--tree', tree, ...args.params.flatMap((param) => ['--param', param]),
    ...(cache === undefined ? [] : ['--cache', cache]), ...args.entries];
  const validation = runValidate(validateArgs,
    { mode: 'publication', ...(options.install === undefined ? {} : { install: options.install }) });
  lines.push(...validation.lines);
  if (validation.code !== 0) {
    throw new PublishError(validation.code, `${tag}: the publication validation failed; no tag`,
      validation.lines);
  }

  git(tree, ['-c', 'tag.gpgSign=false', 'tag', '-a', tag, '-m', `${tag}\n\n${changelog}`],
    identity);
  const ref = `refs/tags/${tag}`;
  const commit = resolveCommit(tree, ref);
  const entry: Doc = {
    version, commit, digest: packDigest(tree, ref, pack).digest, formats: manifest.formats,
    requires_capabilities: manifest.requires_capabilities ?? [], requires: manifest.requires ?? [],
    conflicts: manifest.conflicts ?? [], wingfoil: range,
  };
  const transitions = transitionsTo(tree, pack);
  if (transitions.length > 0) {
    entry['transitions'] = Object.fromEntries(transitions.map((file) => [
      file.slice('transitions/'.length, -'.yaml'.length), transitionDigest(tree, ref, file).digest,
    ]));
  }
  writeFileSync(join(tree, 'catalog.yaml'), addVersion(catalogText, pack, entry));
  git(tree, ['add', '--', 'catalog.yaml']);
  git(tree, ['commit', '--quiet', '--no-verify', '--no-gpg-sign', '-m', `catalog: ${tag}`],
    identity);
  lines.push('', 'CATALOG.md and catalog-index.json not regenerated: npm run index does not exist '
    + 'yet (wave W14); record it in the pack-release Execution Notes (plan-023).');
  lines.push('', '## Publication', '', `- Tag: \`${tag}\` (annotated), at \`${commit}\``,
    `- Catalog commit: \`${git(tree, ['rev-parse', 'HEAD'])}\``,
    `- Digest: \`${String(entry['digest'])}\``, `- WingFoil range: \`${range}\``);
  for (const [id, digest] of Object.entries((entry['transitions'] as Doc | undefined) ?? {})) {
    lines.push(`- Transition ${id}: \`${String(digest)}\``);
  }
  lines.push('- Not pushed: push the tag and the commit by hand (pack-release-cycle › publish).');
  return lines;
}

export function runPublish(argv: string[], options: PublishOptions = {}): PublishResult {
  let scratch: string | undefined;
  try {
    const args = parse(argv);
    checkRepository(args.tree);
    // The caller's identity, from the repository itself, before any clone (task-014).
    const identity = callerIdentity(args.tree, options.env ?? process.env);
    if (!args.dryRun) {
      return { code: 0, lines: publishIn(args.tree, args, options, undefined, identity) };
    }
    scratch = mkdtempSync(join(tmpdir(), 'publish-dry-run-'));
    const clone = join(scratch, 'repo');
    runGit(scratch, ['clone', '--quiet', '--no-local', args.tree, clone]);
    const lines = publishIn(clone, args, options, join(clone, '.cache', 'wingfoil-matrix'),
      identity);
    return { code: 0, lines: ['Dry run: done in a temporary clone, removed afterwards; the '
      + 'repository is unchanged.', ...lines] };
  } catch (error) {
    if (error instanceof PublishError) {
      return { code: error.code, lines: [...error.before, error.message] };
    }
    if (error instanceof GitError || error instanceof DigestError) {
      return { code: 2, lines: [error.message] };
    }
    throw error;
  } finally {
    if (scratch !== undefined) rmSync(scratch, { recursive: true, force: true });
  }
}
