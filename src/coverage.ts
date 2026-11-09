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
  const targets: Target[] = [];
  const seen = new Set<string>();
  const keep = (target: Target): void => {
    if (target.added.length === 0 && target.removed.length === 0) return;
    const key = `${target.added.map((pack) => pack.id).sort().join(' ')}|`
      + target.removed.slice().sort().join(' ');
    if (seen.has(key)) return;
    seen.add(key);
    targets.push(target);
  };
  for (const pack of conditional) {
    // A repeated id counts once, its first entry kept.
    const withs = pack.withs.filter((each, index) =>
      pack.withs.findIndex((other) => other.id === each.id) === index);
    const added = withs.filter((each) => !held(each.id));
    keep({ added, removed: [] });
    for (const left of withs) {
      keep(held(left.id)
        ? { added, removed: [left.id] }
        : { added: added.filter((each) => each.id !== left.id), removed: [] });
    }
  }
  return targets;
}

/** The label suffix: `[+<id>]` per added pack, then `[-<id>]` per removed pack. */
export function targetLabel(target: Target): string {
  return target.added.map((pack) => `[+${pack.id}]`).join('')
    + target.removed.map((id) => `[-${id}]`).join('');
}
