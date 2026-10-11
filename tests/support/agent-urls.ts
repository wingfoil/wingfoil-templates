// The agent path offline (task-021): the URLs the index files emit, and a resolver that stands for
// the network, reading the working tree for main and git for a tag.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { CatalogIndex } from '../../src/index-model';
import { parseUrl } from '../../src/index-urls';
import { scanMarkdown } from '../../src/markdown-lines';
import type { TestRepo } from './git-repo';

function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (typeof value === 'object' && value !== null) return Object.values(value).flatMap(strings);
  return [];
}

/** The URLs of a file: JSON strings, or Markdown link targets and code spans, starting https://. */
export function urlsOf(file: string, text: string): string[] {
  if (file.endsWith('.json')) {
    return strings(JSON.parse(text)).filter((value) => value.startsWith('https://'));
  }
  const scan = scanMarkdown(text);
  return [...scan.links.map((link) => link.target), ...scan.codeSpans.map((span) => span.text)]
    .filter((value) => value.startsWith('https://'));
}

/** The relative link targets of a Markdown file. */
export function relativeLinks(text: string): string[] {
  return scanMarkdown(text).links.map((link) => link.target)
    .filter((target) => !/^[a-z]+:/.test(target) && !target.startsWith('#'));
}

/** A placeholder URL filled with every pack version, preset or transition of an index. */
export function filled(url: string, index: CatalogIndex): string[] {
  if (url.includes('<catalog pack id>')) {
    return index.packs.flatMap((pack) => pack.versions.map((version) => url
      .replaceAll('<catalog pack id>', pack.id).replaceAll('<version>', version.version)));
  }
  if (url.includes('presets/<id>')) return index.presets.map((preset) => url.replace('<id>', preset.id));
  if (url.includes('transitions/<id>')) {
    return index.transitions.map((transition) => url.replace('<id>', transition.id));
  }
  return [url];
}

/**
 * The bytes a URL serves, offline: at main from the working tree of `tree` (the github.com links
 * at main from this repository's), at a tag from `git show`; undefined when there is none.
 */
export function resolveOffline(url: string, tree: string, repository: string,
  repo?: TestRepo): string | undefined {
  const parsed = parseUrl(url);
  if (parsed === undefined) return undefined;
  if (parsed.form === 'raw-main' || parsed.form === 'github-main') {
    const root = parsed.form === 'github-main' ? repository : tree;
    const file = join(root, parsed.path);
    return existsSync(file) ? readFileSync(file, 'utf8') : undefined;
  }
  try {
    const git = (args: string[]): string => repo !== undefined ? repo.git(args)
      : execFileSync('git', args, { cwd: tree, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return git(['show', `refs/tags/${parsed.tag ?? ''}:${parsed.path}`]);
  } catch {
    return undefined;
  }
}
