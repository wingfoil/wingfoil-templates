// The URLs the index emits (spec-002 §4, task-019 acceptance 9): built here only, so that the
// agent path's tests (plan-024 task 3) check one pattern per use. A tag is written as is, `/` and
// `@` included.
export const REPOSITORY = 'wingfoil/wingfoil-templates';
const RAW = `https://raw.githubusercontent.com/${REPOSITORY}`;
const GITHUB = `https://github.com/${REPOSITORY}`;
/** The search page on GitHub Pages (task-024); it serves main only. */
const PAGES = 'https://wingfoil.github.io/wingfoil-templates';
/** The files of main the search page serves besides itself. */
const PAGES_FILES = new Set(['catalog-index.json', 'llms.txt']);

/** A file the search page serves, or the page itself for ''. */
export function pagesUrl(path: string): string {
  return `${PAGES}/${path}`;
}

/** A file of the repository at main, raw. */
export function rawMain(path: string): string {
  return `${RAW}/main/${path}`;
}

/** A file of a published version, raw, pinned to its tag. */
export function rawAtTag(tag: string, path: string): string {
  return `${RAW}/refs/tags/${tag}/${path}`;
}

/** A pack's README rendered on github.com at a tag, for people (CATALOG.md). */
export function readmeOnGithub(tag: string, packId: string): string {
  return `${GITHUB}/blob/${tag}/packs/${packId}/README.md`;
}

/** A file of the repository rendered on github.com at main. */
export function githubMain(path: string): string {
  return `${GITHUB}/blob/main/${path}`;
}

/** The forms of the URLs the index emits (task-021): each one has its builder above. */
export interface ParsedUrl {
  form: 'raw-main' | 'raw-tag' | 'readme-github' | 'github-main' | 'pages';
  tag?: string;
  path: string;
}

/** A path segment of an id or a file name, or a placeholder such as `<catalog pack id>`. */
const SEGMENT = /^(?:[a-z0-9][a-z0-9._-]*|<[a-z ]+>)$/;
/** The files of main the index names (task-019 acceptance 8, 9). */
const ROOT_FILES = new Set(['catalog-index.json', 'CATALOG.md', 'catalog.yaml', 'compat.yaml']);

function isId(id: string): boolean {
  return id !== '' && id.split('/').every((segment) => SEGMENT.test(segment)
    && segment !== '.' && segment !== '..');
}

/** `<catalog pack id>@<version>`, and the path after it: the tag ends at the first `/` after `@`. */
function splitTag(rest: string): { tag: string; id: string; path: string } | undefined {
  const at = rest.indexOf('@');
  const slash = at < 0 ? -1 : rest.indexOf('/', at);
  if (slash < 0) return undefined;
  const id = rest.slice(0, at);
  const version = rest.slice(at + 1, slash);
  if (!isId(id) || !/^(?:\d+\.\d+\.\d+|<version>)$/.test(version)) return undefined;
  return { tag: rest.slice(0, slash), id, path: rest.slice(slash + 1) };
}

/** A file of main the index emits: a root file, a preset or a transition. */
function isMainFile(path: string): boolean {
  const match = /^(?:presets|transitions)\/([^/]+)\.yaml$/.exec(path);
  return ROOT_FILES.has(path) || match !== null && SEGMENT.test(match[1] ?? '');
}

function parsed(form: ParsedUrl['form'], path: string, tag?: string): ParsedUrl {
  return tag === undefined ? { form, path } : { form, tag, path };
}

function atTagForm(form: 'raw-tag' | 'readme-github', rest: string,
  files: string[]): ParsedUrl | undefined {
  const split = splitTag(rest);
  if (split === undefined) return undefined;
  return files.some((file) => split.path === `packs/${split.id}/${file}`)
    ? parsed(form, split.path, split.tag) : undefined;
}

/** The form, tag and path of a URL the index emits, or undefined for any other URL. */
export function parseUrl(url: string): ParsedUrl | undefined {
  let result: ParsedUrl | undefined;
  if (url.startsWith(`${PAGES}/`)) {
    const path = url.slice(`${PAGES}/`.length);
    if (path === '' || PAGES_FILES.has(path)) return { form: 'pages', path };
    return undefined;
  }
  if (url.startsWith(`${RAW}/main/`)) {
    const path = url.slice(`${RAW}/main/`.length);
    if (isMainFile(path)) result = parsed('raw-main', path);
  } else if (url.startsWith(`${RAW}/refs/tags/`)) {
    result = atTagForm('raw-tag', url.slice(`${RAW}/refs/tags/`.length),
      ['README.md', 'pack.yaml']);
  } else if (url.startsWith(`${GITHUB}/blob/main/`)) {
    const path = url.slice(`${GITHUB}/blob/main/`.length);
    if (/^docs\/memory\/tech-spec\/[a-z0-9][a-z0-9.-]*\.md$/.test(path)) {
      result = parsed('github-main', path);
    }
  } else if (url.startsWith(`${GITHUB}/blob/`)) {
    result = atTagForm('readme-github', url.slice(`${GITHUB}/blob/`.length), ['README.md']);
  }
  return result !== undefined && buildUrl(result) === url ? result : undefined;
}

/** The URL of a parsed form, through its builder. */
export function buildUrl(url: ParsedUrl): string {
  switch (url.form) {
    case 'pages': return pagesUrl(url.path);
    case 'raw-main': return rawMain(url.path);
    case 'raw-tag': return rawAtTag(url.tag ?? '', url.path);
    case 'github-main': return githubMain(url.path);
    case 'readme-github': {
      const tag = url.tag ?? '';
      return readmeOnGithub(tag, tag.slice(0, tag.indexOf('@')));
    }
  }
}
