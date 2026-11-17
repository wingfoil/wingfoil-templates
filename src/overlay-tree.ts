// An overlay's merged tree (task-046), shared by `validate --overlay` and `check:runs`'s
// `overlay:` key (task-095): the overlay's directory rules, the merged tree of the tree's packs and
// the overlay's, and how a line from the merged tree names its paths.
import { cpSync, existsSync, mkdirSync, mkdtempSync, realpathSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, sep } from 'node:path';

import { treeLayout } from './layout-rules';

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

/** A refused overlay: its exit code, `validate`'s line, and the reason alone. */
export interface OverlayRefusal {
  code: number;
  line: string;
  reason: string;
}

function posix(path: string): string {
  return path.split(sep).join('/');
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * A line from the merged tree, as this tree names it: the merged tree's own path becomes the
 * tree's, and `packs/<p>` of an overlay pack `<p>` becomes `<overlay>/packs/<p>`.
 */
export function mapOverlayPaths(text: string, tree: string,
  overlay: Pick<Overlay, 'merged' | 'packs' | 'rel'>): string {
  const packs = [...overlay.packs].sort((a, b) => b.length - a.length);
  // A path ends at a separator, a quote, a closing mark, or a sentence's last full stop.
  const end = '(?=$|[/\\s\'"`):,;]|\\.(?=$|\\s))';
  let mapped = text;
  for (const pack of packs) {
    mapped = mapped.replace(new RegExp(`${escapeRegExp(`${overlay.merged}/packs/${pack}`)}${end}`,
      'g'), () => `${tree}/${overlay.rel}/packs/${pack}`);
  }
  mapped = mapped.split(overlay.merged).join(tree);
  for (const pack of packs) {
    const pattern = new RegExp(`(^|[\\s'"\`(])packs/${escapeRegExp(pack)}${end}`, 'g');
    mapped = mapped.replace(pattern, (_match, lead: string) =>
      `${lead}${overlay.rel}/packs/${pack}`);
  }
  return mapped;
}

/** The overlay `given` names, or the exit code and line that refuse it (task-046 criterion 1). */
export function openOverlay(tree: string, given: string): Overlay | OverlayRefusal {
  const dir = isAbsolute(given) ? given : join(tree, given);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    return { code: 2, line: `${given}: not a directory`, reason: 'not a directory' };
  }
  const real = realpathSync(dir);
  const base = realpathSync(tree);
  const declared = join(base, 'tests', 'fixtures');
  const fixtures = existsSync(declared) ? realpathSync(declared) : declared;
  if (!real.startsWith(`${fixtures}${sep}`)) {
    const reason = 'not under tests/fixtures/';
    return { code: 3, line: `--overlay ${given}: ${reason}`, reason };
  }
  if (`${real}${sep}`.startsWith(`${join(fixtures, 'examples')}${sep}`)) {
    const reason = 'under tests/fixtures/examples/, which the tree\'s lint covers';
    return { code: 3, line: `--overlay ${given}: ${reason}`, reason };
  }
  const root = mkdtempSync(join(tmpdir(), 'validate-overlay-'));
  return { dir: real, rel: posix(relative(base, real)), packs: [], root,
    merged: join(root, 'tree') };
}

/**
 * Builds the merged tree: this tree's packs/, catalog.yaml and compat.yaml, then the overlay's
 * packs (`overlay.packs`) that shadow none of the tree's. Returns each overlay pack that shadows
 * one of the tree's, with the tree's pack it shadows, in the overlay's pack order.
 */
export function mergeOverlay(tree: string, overlay: Overlay): { pack: string; other: string }[] {
  const held = treeLayout(tree).packs;
  const shadowing: { pack: string; other: string }[] = [];
  mkdirSync(overlay.merged);
  if (existsSync(join(tree, 'packs'))) {
    cpSync(join(tree, 'packs'), join(overlay.merged, 'packs'), { recursive: true });
  }
  for (const file of ['catalog.yaml', 'compat.yaml']) {
    if (existsSync(join(tree, file))) cpSync(join(tree, file), join(overlay.merged, file));
  }
  for (const pack of overlay.packs) {
    const shadows = held.filter((other) => other === pack || pack.startsWith(`${other}/`)
      || other.startsWith(`${pack}/`));
    shadowing.push(...shadows.map((other) => ({ pack, other })));
    if (shadows.length > 0) continue;
    cpSync(join(overlay.dir, 'packs', pack), join(overlay.merged, 'packs', pack),
      { recursive: true });
  }
  return shadowing;
}
