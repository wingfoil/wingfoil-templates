// `intake:rehearse` (task-081, plan-065 task C): the newest release removed from the tree, so that
// `intake:prepare` prepares it again and `intake.yml` verifies it, a rehearsal never for intake
// (dl-042 I1). Its row leaves compat.yaml and the golden fixture's (dl-010), its pin folder goes,
// the catalog ranges and the index's root outputs are recomputed; every check and every new text
// come before the first write, task-080's consistency checks included.
import { existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

import { byBytes } from './index-data';
import {
  GOLDEN_COMPAT, Refusal, checkIndex, checkRanges, checkTop, lastRow, loadCompatText,
  rangeSlots, recomputedCatalog, required, rootIndex, text,
} from './intake-prepare';

export interface RehearsalResult { code: 0 | 1; lines: string[]; version?: string }

interface Plan { version: string; files: Map<string, string>; removed: string[] }

function plan(tree: string): Plan {
  checkTop(tree);
  const compatText = required(tree, 'compat.yaml');
  if (compatText.includes('\r')) throw new Refusal('compat.yaml: not LF line endings');
  const compat = loadCompatText(compatText, 'compat.yaml');
  if (compat.releases.length < 2) {
    throw new Refusal('compat.yaml records fewer than two releases');
  }
  if (text(tree, GOLDEN_COMPAT) !== compatText) {
    throw new Refusal(`${GOLDEN_COMPAT} is not byte-equal to compat.yaml (dl-010)`);
  }
  const { start } = lastRow(compatText);
  const catalogText = required(tree, 'catalog.yaml');
  const slots = rangeSlots(catalogText);
  checkRanges(slots, compat.releases);
  checkIndex(tree);

  const version = compat.releases[compat.releases.length - 1]?.wingfoil ?? '';
  const newCompat = compatText.slice(0, start);
  const releases = loadCompatText(newCompat, 'the reduced compat.yaml').releases;
  const newCatalog = recomputedCatalog(catalogText, slots, releases);
  const index = rootIndex(tree, newCatalog, newCompat);
  const pin = `src/matrix/wingfoil-${version}`;
  const removed = existsSync(join(tree, pin))
    ? readdirSync(join(tree, pin), { recursive: true, withFileTypes: true })
      .filter((entry) => !entry.isDirectory())
      .map((entry) => relative(tree, join(entry.parentPath, entry.name)).split(sep).join('/'))
      .sort(byBytes)
    : [];
  return {
    version,
    files: new Map([...index, ['catalog.yaml', newCatalog], ['compat.yaml', newCompat],
      [GOLDEN_COMPAT, newCompat]]),
    removed,
  };
}

export function removeNewest(tree: string): RehearsalResult {
  let planned: Plan;
  let changed: string[];
  try {
    planned = plan(tree);
    changed = [...planned.files.keys()]
      .filter((path) => text(tree, path) !== planned.files.get(path));
  } catch (error) {
    const why = error instanceof Error ? error.message : String(error);
    return { code: 1, lines: [`intake:rehearse: ${why}, nothing written`] };
  }
  const entries = [...changed.map((path) => ({ path, line: `wrote ${path}` })),
    ...planned.removed.map((path) => ({ path, line: `removed ${path}` }))]
    .sort((a, b) => byBytes(a.path, b.path));
  try {
    for (const path of changed) writeFileSync(join(tree, path), planned.files.get(path) ?? '');
    rmSync(join(tree, `src/matrix/wingfoil-${planned.version}`), { recursive: true, force: true });
  } catch (error) {
    // The one exception to "nothing written": an I/O error during the writes.
    const why = error instanceof Error ? error.message : String(error);
    return { code: 1, lines: [`intake:rehearse: writing: ${why}; the tree is partly written`] };
  }
  return { code: 0, lines: entries.map((entry) => entry.line), version: planned.version };
}
