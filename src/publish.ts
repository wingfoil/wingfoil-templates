// `npm run publish:pack` (task-014, pack-release-cycle › publish, after the approval gate): checks the
// version, re-validates in publication mode at HEAD as a guard, tags `<catalog pack id>@<version>`,
// then adds the catalog entry in a later commit (spec-001 §11), with the digest (§13), the computed
// range (§12) and, for a stage pack, its transitions' digests (§14). It never pushes. Until
// `npm run index` exists (wave W14), CATALOG.md and catalog-index.json are left unchanged (plan-023).
// The line is decided first (task-016): from a maint/<id>/<major>.x branch, after WingFoil 1.0, the
// tag goes on that branch and the catalog commit on main. With --dry-run it works in a temporary
// clone and leaves the repository as it was.
import { existsSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync }
  from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { gte, valid } from 'semver';

import { CatalogEditError, addVersion } from './catalog-edit';
import { INBOX } from './feedback-inbox';
import { FeedbackNoteError, fromElement, writePublishedNote } from './feedback-note';
import { CatalogError, loadCatalog } from './catalog';
import type { Catalog } from './catalog';
import { findFiles } from './check-schemas';
import { CompatError, loadCompat } from './compat';
import { DigestError, isCatalogPackId, packDigest, transitionDigest } from './digest';
import { GitError, callerIdentity, resolveCommit, runGit } from './git';
import { LineError, decideLine, isMaintenanceBranch, lineName } from './lines';
import type { Line, LineInput, PublishedVersion } from './lines';
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
  /** The approver states that WingFoil bundles the pack (dl-001): a feedback note follows. */
  bundled: boolean;
  /** The pack-release element the note comes from (`prel-<nnn>`), with --bundled. */
  from: string | undefined;
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
        bundled: { type: 'boolean' },
        from: { type: 'string' },
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
  const bundled = values.bundled ?? false;
  let from: string | undefined;
  if (bundled) {
    try {
      from = fromElement(values.from, 'prel');
    } catch (error) {
      if (error instanceof FeedbackNoteError) throw new PublishError(3, `--bundled: ${error.message}`);
      throw error;
    }
  }
  return { pack: values.pack, tree: values.tree ?? process.cwd(), params: values.param ?? [],
    entries: positionals, dryRun: values['dry-run'] ?? false, bundled, from };
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

/** The CHANGELOG.md line of the version: `- <version>`, alone or followed by `:` or a space. */
function changelogEntry(tree: string, pack: string, version: string): string {
  const file = join(tree, 'packs', pack, 'CHANGELOG.md');
  const text = existsSync(file) ? readFileSync(file, 'utf8') : '';
  const entry = `- ${version}`;
  const line = text.split('\n').map((candidate) => candidate.trimEnd()).find((candidate) =>
    candidate === entry || candidate.startsWith(`${entry}:`) || candidate.startsWith(`${entry} `));
  if (line === undefined) {
    throw new PublishError(1, `packs/${pack}/CHANGELOG.md has no entry "- ${version}"`);
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

/** The checked-out branch, or '' when HEAD is detached. */
function currentBranch(tree: string): string {
  try {
    return git(tree, ['symbolic-ref', '--quiet', '--short', 'HEAD']);
  } catch {
    return '';
  }
}

/** Whether the repository has a main branch. */
function hasMain(tree: string): boolean {
  try {
    git(tree, ['rev-parse', '--verify', '--quiet', 'refs/heads/main']);
    return true;
  } catch {
    return false;
  }
}

/** catalog.yaml as committed on main, where the catalog lives (task-016), if there is one. */
function mainCatalog(tree: string): string | undefined {
  try {
    return runGit(tree, ['show', 'refs/heads/main:catalog.yaml']).toString('utf8');
  } catch {
    return undefined;
  }
}

/** The pack's published versions and their formats, from a catalog.yaml text. */
function publishedVersions(text: string, pack: string): PublishedVersion[] {
  const packs = (parseYaml(text, 'catalog.yaml').data as Doc)['packs'];
  const entry = (Array.isArray(packs) ? packs as Doc[] : []).find((candidate) =>
    candidate['id'] === pack);
  return ((entry?.['versions'] as Doc[] | undefined) ?? []).map((version) => ({
    version: String(version['version']),
    formats: (version['formats'] ?? {}) as Record<string, number>,
  }));
}

/** Whether HEAD descends from a tag. */
function descends(tree: string, tag: string): boolean {
  try {
    git(tree, ['merge-base', '--is-ancestor', `refs/tags/${tag}`, 'HEAD']);
    return true;
  } catch {
    return false;
  }
}

function decide(input: LineInput): Line {
  try {
    return decideLine(input);
  } catch (error) {
    if (error instanceof LineError) throw new PublishError(1, error.message);
    throw error;
  }
}

/**
 * A commit on main that sets catalog.yaml, made with plumbing and a temporary index, so that the
 * checked-out branch (a maintenance line) and its working tree are left as they are.
 */
function commitOnMain(tree: string, text: string, message: string,
  identity: NodeJS.ProcessEnv): string {
  const parent = git(tree, ['rev-parse', 'refs/heads/main']);
  const blob = runGit(tree, ['hash-object', '-w', '--stdin'], Buffer.from(text, 'utf8'))
    .toString('utf8').trim();
  const scratch = mkdtempSync(join(tmpdir(), 'publish-index-'));
  try {
    const env = { ...identity, GIT_INDEX_FILE: join(scratch, 'index') };
    git(tree, ['read-tree', parent], env);
    git(tree, ['update-index', '--add', '--cacheinfo', `100644,${blob},catalog.yaml`], env);
    const treeId = git(tree, ['write-tree'], env);
    const commit = git(tree, ['commit-tree', '--no-gpg-sign', treeId, '-p', parent, '-m', message],
      env);
    git(tree, ['update-ref', 'refs/heads/main', commit, parent]);
    return commit;
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
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
  if (valid(version) === null) {
    throw new PublishError(1, `${manifestFile}: version ${JSON.stringify(version)} is not semver`);
  }
  const tag = `${pack}@${version}`;
  const catalog = load(() => loadCatalog(join(tree, 'catalog.yaml')), 'catalog.yaml');
  const compat = load(() => loadCompat(join(tree, 'compat.yaml')), 'compat.yaml');
  // The line (F5.3, task-016), decided before anything runs: the published versions are main's
  // and, on the current line, the working tree's too (a version tagged on this branch counts).
  const branch = currentBranch(tree);
  const onMaintenance = isMaintenanceBranch(branch);
  const fromOne = compat.releases.some((release) =>
    valid(release.wingfoil) !== null && gte(release.wingfoil, '1.0.0'));
  const input = { pack, version, formats: manifest.formats, branch, fromOne,
    descends: (from: string) => descends(tree, from) };
  // Before WingFoil 1.0 a maint/ branch is refused as such, whatever main holds.
  if (onMaintenance && !fromOne) decide({ ...input, published: [] });
  const onMain = mainCatalog(tree);
  if (onMaintenance && onMain === undefined) {
    throw new PublishError(1, 'a maintenance line reads the published versions from main, and '
      + 'this repository has no main branch with a catalog.yaml');
  }
  const catalogText = onMaintenance ? onMain ?? ''
    : readFileSync(join(tree, 'catalog.yaml'), 'utf8');
  const published = publishedVersions(catalogText, pack);
  if (!onMaintenance && onMain !== undefined) {
    for (const entry of publishedVersions(onMain, pack)) {
      if (!published.some((known) => known.version === entry.version)) published.push(entry);
    }
  }
  const line = decide({ ...input, published });
  if (line.kind === 'maintenance' && args.bundled) {
    throw new PublishError(3, `--bundled on the line ${lineName(line)}: write the note on main `
      + 'with npm run feedback:note -- --published');
  }
  if (tagExists(tree, tag)) throw new PublishError(1, `the tag ${tag} already exists`);
  const changelog = changelogEntry(tree, pack, version);
  if (compositionsWith(tree, catalog, pack, args.entries).length === 0) {
    throw new PublishError(1, `no composition of the validation contains ${pack}: give a preset or `
      + 'a documented combination that contains it (pack-compatibility)');
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

  const range = computeRange({ formats: manifest.formats,
    requires_capabilities: manifest.requires_capabilities ?? [] }, compat.releases);
  if (range === '') {
    throw new PublishError(1, `${tag}: no release of compat.yaml is compatible (an empty range, `
      + 'spec-001 §12)', validation.lines);
  }

  const head = git(tree, ['rev-parse', 'HEAD']);
  const mainHead = onMaintenance ? git(tree, ['rev-parse', 'refs/heads/main']) : undefined;
  git(tree, ['-c', 'tag.gpgSign=false', 'tag', '-a', tag, '-m', `${tag}\n\n${changelog}`],
    identity);
  try {
    return [...lines, ...afterTag(tree, pack, tag, version, manifest, range, catalogText,
      identity, args, line)];
  } catch (error) {
    // Never half-published: the tag goes, and the branch returns to its head before the tag (the
    // working tree was clean), whatever commit was already made; on a maintenance line, main too.
    try {
      git(tree, ['tag', '-d', tag]);
      if (mainHead !== undefined) git(tree, ['update-ref', 'refs/heads/main', mainHead]);
      git(tree, ['reset', '--quiet', '--hard', head]);
      // A note written but not committed is untracked; the tree was clean before.
      git(tree, ['clean', '-fdq', '--', INBOX]);
    } catch {
      // The original failure is the one to report.
    }
    const message = error instanceof Error ? error.message : String(error);
    const code = error instanceof CatalogEditError || error instanceof FeedbackNoteError ? 1 : 2;
    throw new PublishError(code, `${tag}: ${message}; the tag was removed and the branch reset to `
      + 'its head before the tag', lines);
  }
}

/** The steps after the tag: the digest, the catalog commit and the Publication section. */
function afterTag(tree: string, pack: string, tag: string, version: string,
  manifest: PackManifest, range: string, catalogText: string, identity: NodeJS.ProcessEnv,
  args: Args, line: Line): string[] {
  const lines: string[] = [];
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
  const edited = addVersion(catalogText, pack, entry);
  let catalogCommit: string;
  if (line.kind === 'maintenance') {
    // The catalog lives on main: the commit goes there, the maintenance branch is untouched.
    catalogCommit = commitOnMain(tree, edited, `catalog: ${tag}`, identity);
  } else {
    writeFileSync(join(tree, 'catalog.yaml'), edited);
    git(tree, ['add', '--', 'catalog.yaml']);
    git(tree, ['commit', '--quiet', '--no-verify', '--no-gpg-sign', '-m', `catalog: ${tag}`],
      identity);
    catalogCommit = git(tree, ['rev-parse', 'HEAD']);
  }
  lines.push('', 'CATALOG.md and catalog-index.json not regenerated: npm run index does not exist '
    + 'yet (wave W14); record it in the pack-release Execution Notes (plan-023).');
  lines.push('', '## Publication', '', `- Line: ${lineName(line)}`,
    `- Tag: \`${tag}\` (annotated), at \`${commit}\``,
    `- Catalog commit: \`${catalogCommit}\`${line.kind === 'maintenance' ? ' (on main)' : ''}`,
    `- Digest: \`${String(entry['digest'])}\``, `- WingFoil range: \`${range}\``);
  for (const [id, digest] of Object.entries((entry['transitions'] as Doc | undefined) ?? {})) {
    lines.push(`- Transition ${id}: \`${String(digest)}\``);
  }
  if (args.bundled && args.from !== undefined) {
    // WingFoil bundles the pack: the note of F5.4, in a third commit (task-015).
    const note = writePublishedNote(tree, tag, args.from);
    git(tree, ['add', '--', INBOX]);
    git(tree, ['commit', '--quiet', '--no-verify', '--no-gpg-sign', '-m', `feedback: ${note} ${tag}`],
      identity);
    lines.push(`- Feedback note: ${note}`);
  }
  lines.push('- Not pushed: push the tag and the commits by hand (pack-release-cycle › publish).');
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
    const branch = currentBranch(args.tree);
    runGit(scratch, ['clone', '--quiet', '--no-local',
      ...(branch === '' ? [] : ['--branch', branch]), args.tree, clone]);
    // A maintenance line commits the catalog on main: the clone needs its own main.
    if (!hasMain(clone)) {
      try {
        git(clone, ['branch', '--quiet', 'main', 'refs/remotes/origin/main']);
      } catch {
        // No main to read from: a maintenance line then stops with its own message.
      }
    }
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
