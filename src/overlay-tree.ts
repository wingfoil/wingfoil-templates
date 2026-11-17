// Red stub of task-095: the overlay's merged tree, shared by validate and check:runs.

/** The overlay of a run (task-046): the directory, its path in the tree, and the merged tree. */
export interface Overlay {
  dir: string;
  /** Relative to the tree, with `/` separators. */
  rel: string;
  /** Its pack paths under packs/, in byte order. */
  packs: string[];
  /** The temporary directory holding the merged tree; removed when the run ends. */
  root: string;
  merged: string;
}

export function openOverlay(_tree: string, _given: string):
Overlay | { code: number; line: string; reason: string } {
  return { code: 3, line: 'not implemented', reason: 'not implemented' };
}

export function mergeOverlay(_tree: string, _overlay: Overlay): { pack: string; other: string }[] {
  return [];
}
