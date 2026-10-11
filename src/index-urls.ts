// The URLs the index emits (spec-002 §4, task-019 acceptance 9): built here only, so that the
// agent path's tests (plan-024 task 3) check one pattern per use. A tag is written as is, `/` and
// `@` included.
export const REPOSITORY = 'wingfoil/wingfoil-templates';
const RAW = `https://raw.githubusercontent.com/${REPOSITORY}`;
const GITHUB = `https://github.com/${REPOSITORY}`;

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
  form: 'raw-main' | 'raw-tag' | 'readme-github' | 'github-main';
  tag?: string;
  path: string;
}

/** A tag and the path after it: the tag ends at the first `/` after its `@`. */
function splitTag(rest: string): { tag: string; path: string } | undefined {
  const at = rest.indexOf('@');
  const slash = at < 0 ? -1 : rest.indexOf('/', at);
  if (slash < 0) return undefined;
  return { tag: rest.slice(0, slash), path: rest.slice(slash + 1) };
}

/** The pack id of a tag, which a README or pack.yaml path must name too. */
function sameTagPack(tag: string, path: string): boolean {
  const id = tag.slice(0, tag.indexOf('@'));
  return !/^packs\//.test(path) || path.startsWith(`packs/${id}/`) && path.split('/').length === id
    .split('/').length + 2;
}

function parsed(form: ParsedUrl['form'], path: string, tag?: string): ParsedUrl {
  return tag === undefined ? { form, path } : { form, tag, path };
}

/** The form, tag and path of a URL the index emits, or undefined for any other URL. */
export function parseUrl(url: string): ParsedUrl | undefined {
  let result: ParsedUrl | undefined;
  if (url.startsWith(`${RAW}/main/`)) {
    result = parsed('raw-main', url.slice(`${RAW}/main/`.length));
  } else if (url.startsWith(`${RAW}/refs/tags/`)) {
    const split = splitTag(url.slice(`${RAW}/refs/tags/`.length));
    if (split !== undefined && sameTagPack(split.tag, split.path)) {
      result = parsed('raw-tag', split.path, split.tag);
    }
  } else if (url.startsWith(`${GITHUB}/blob/main/`)) {
    result = parsed('github-main', url.slice(`${GITHUB}/blob/main/`.length));
  } else if (url.startsWith(`${GITHUB}/blob/`)) {
    const split = splitTag(url.slice(`${GITHUB}/blob/`.length));
    if (split !== undefined && split.path.endsWith('/README.md')
      && sameTagPack(split.tag, split.path)) {
      result = parsed('readme-github', split.path, split.tag);
    }
  }
  return result !== undefined && result.path !== '' && buildUrl(result) === url ? result
    : undefined;
}

/** The URL of a parsed form, through its builder. */
export function buildUrl(url: ParsedUrl): string {
  switch (url.form) {
    case 'raw-main': return rawMain(url.path);
    case 'raw-tag': return rawAtTag(url.tag ?? '', url.path);
    case 'github-main': return githubMain(url.path);
    case 'readme-github': {
      const tag = url.tag ?? '';
      return readmeOnGithub(tag, tag.slice(0, tag.indexOf('@')));
    }
  }
}
