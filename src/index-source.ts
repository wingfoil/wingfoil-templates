// A read-only view of a tree for the index (task-019): the working tree, or a git ref of the
// tree's repository. The index reads published data only at each version's tag (spec-002 §3.1);
// plan-024 task 2b adds the view of main's commit for an N-1 publication.
import { existsSync, lstatSync, readFileSync, realpathSync } from 'node:fs';
import { join } from 'node:path';

import { GitError, resolveCommit, runGit } from './git';

/** The index cannot read what it needs: exit 2 (spec-002 §3.1). */
export class IndexError extends Error {}

export interface TreeSource {
  /** What the view is, for messages: a directory or `<ref>`. */
  readonly label: string;
  /** The text of a file, or undefined when there is none. */
  read(path: string): string | undefined;
}

export function workingTree(dir: string): TreeSource {
  return {
    label: dir,
    read(path: string): string | undefined {
      const full = join(dir, path);
      return existsSync(full) && lstatSync(full).isFile() ? readFileSync(full, 'utf8') : undefined;
    },
  };
}

/** The tree must be the top level of a git repository to read its tags. */
export function checkRepositoryTop(tree: string): void {
  let top: string;
  try {
    top = runGit(tree, ['rev-parse', '--show-toplevel']).toString('utf8').trim();
  } catch (error) {
    if (!(error instanceof GitError)) throw error;
    throw new IndexError(`${tree}: published versions are read from their tags, and the tree is `
      + 'not a git repository');
  }
  if (realpathSync(top) !== realpathSync(tree)) {
    throw new IndexError(`${tree}: published versions are read from their tags, and the tree is `
      + 'not the top level of its git repository');
  }
}

/** The files of one commit of the tree's repository. */
export function atCommit(tree: string, commit: string, label: string): TreeSource {
  return {
    label,
    read(path: string): string | undefined {
      try {
        return runGit(tree, ['show', `${commit}:${path}`]).toString('utf8');
      } catch (error) {
        if (error instanceof GitError) return undefined;
        throw error;
      }
    },
  };
}

/** The files of a tag; a tag missing from the repository is an IndexError. */
export function atTag(tree: string, tag: string): TreeSource {
  let commit: string;
  try {
    commit = resolveCommit(tree, `refs/tags/${tag}`);
  } catch {
    throw new IndexError(`tag ${tag} is named by catalog.yaml and missing from the repository`);
  }
  return atCommit(tree, commit, tag);
}
