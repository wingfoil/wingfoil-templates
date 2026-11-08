// The notices of spec-001 §17 step 8 (task-084): each tension the composition holds, with its
// resolution (§6.2), in composition order of the declaring pack and then in its `tensions` order.
// A notice never fails the composition.
import type { ResolvedPack } from './resolve';

/** One `notice: <pack> and <other>: <resolution>` line per tension the composition holds. */
export function tensionNotices(packs: ResolvedPack[]): string[] {
  throw new Error(`tensionNotices: not implemented (task-084), ${packs.length} packs`);
}
