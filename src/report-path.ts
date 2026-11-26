// The rule of a report's path (dl-044 P1, dl-054 P1): a report goes to a file outside the
// repository, so that writing it leaves the tree clean. Shared by `publish:pack --report`
// (task-103) and `check:release --report` (task-106); each command words its own refusal.
import { existsSync, lstatSync, realpathSync } from 'node:fs';
import { basename, dirname, join, resolve as resolvePath, sep } from 'node:path';

/** Why a path is refused: inside the repository, or a symbolic link to nothing. */
export type ReportPathKind = 'inside' | 'dangling';

export class ReportPathError extends Error {
  constructor(readonly kind: ReportPathKind, readonly path: string) {
    super(`${path}: ${kind === 'inside' ? 'inside the repository' : 'a dangling symbolic link'}`);
  }
}

export function within(path: string, roots: string[]): boolean {
  return roots.some((root) => path === root || path.startsWith(root.endsWith(sep) ? root
    : `${root}${sep}`));
}

/**
 * The report's path, resolved against the working directory, refused when it is inside the
 * repository: as written, or with symbolic links resolved (the path itself when it exists, else
 * its parent when that exists); a dangling symbolic link is refused too. The path is normalised
 * before the filesystem reads it (a trailing `/` dropped, `..` removed lexically), and the check
 * and the writes use that same path. The real paths are the system's (`realpathSync.native`), so
 * that a case-insensitive filesystem gives them one spelling.
 */
export function checkReportPath(report: string, top: string, tree: string): string {
  const path = resolvePath(report);
  const real = realpathSync.native;
  const roots = [...new Set([top, resolvePath(tree), real(top), real(tree)])];
  if (within(path, roots)) throw new ReportPathError('inside', report);
  let link = false;
  try {
    link = lstatSync(path).isSymbolicLink();
  } catch {
    // No such path: its parent is read below.
  }
  if (link && !existsSync(path)) throw new ReportPathError('dangling', report);
  let resolved: string | undefined;
  if (existsSync(path)) resolved = real(path);
  else if (existsSync(dirname(path))) resolved = join(real(dirname(path)), basename(path));
  if (resolved !== undefined && within(resolved, roots)) throw new ReportPathError('inside', report);
  return path;
}
