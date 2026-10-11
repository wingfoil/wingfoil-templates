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
