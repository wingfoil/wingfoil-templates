// The notices of spec-001 §17 step 8 (task-084): each tension the composition holds, with its
// resolution (§6.2), in composition order of the declaring pack and then in its `tensions` order.
// A notice never fails the composition.
import { parseEntry, satisfies } from './requirements';
import type { ResolvedPack } from './resolve';

/** One `notice: <pack> and <other>: <resolution>` line per tension the composition holds. */
export function tensionNotices(packs: ResolvedPack[]): string[] {
  const byId = new Map(packs.map((pack) => [pack.id, pack]));
  const notices: string[] = [];
  for (const pack of packs) {
    for (const tension of pack.manifest.tensions ?? []) {
      // The schema has checked the entry's syntax (§6.3); an absent range means every version.
      const { id, range } = parseEntry(tension.pack, 'conflicts');
      const other = byId.get(id);
      if (other === undefined) continue;
      if (range !== undefined && !satisfies(other.version, range)) continue;
      // One line per tension: the resolution's line breaks folded to single spaces.
      const resolution = tension.resolution.trim().replace(/\s*\n\s*/g, ' ');
      notices.push(`notice: ${pack.id} and ${other.id}: ${resolution}`);
    }
  }
  return notices;
}
