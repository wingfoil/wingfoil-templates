// D6's coverage per entry (spec-001 §15, §18, dl-025 D6, task-087): the targets of a composition
// holding packs with a conditional part, shared by `validate`'s legs and the overlay lint. The
// full target holds every entry's pack; then each entry's pack is left out in turn. Whether a
// removed pack is still resolved, the methodology rule and the format's skips are the callers'.

/** A conditional pack of a composition: its id and its entries' packs, in written order. */
export interface ConditionalPack {
  id: string;
  /** Each entry's `with` pack id and the entry as the pack writes it (its range kept). */
  withs: { id: string; entry: string }[];
}

/** A target: the packs added to and removed from the composition. */
export interface Target {
  /** In entry order: each added pack's id and the `with` entry that adds it. */
  added: { id: string; entry: string }[];
  /** In entry order: the ids of the packs the composition holds and the target leaves out. */
  removed: string[];
}

/**
 * The targets that differ from the composition, P by P, the full target first, then each
 * left-out target in entry order; a target with the same added and removed ids as an earlier one
 * is left out, the first kept.
 */
export function entryTargets(conditional: ConditionalPack[], held: (id: string) => boolean):
Target[] {
  void conditional;
  void held;
  throw new Error('entryTargets: not implemented (task-087)');
}

/** The label suffix: `[+<id>]` per added pack, then `[-<id>]` per removed pack. */
export function targetLabel(target: Target): string {
  void target;
  throw new Error('targetLabel: not implemented (task-087)');
}
