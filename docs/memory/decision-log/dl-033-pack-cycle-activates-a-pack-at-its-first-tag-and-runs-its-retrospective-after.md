---
id: dl-033-pack-cycle-activates-a-pack-at-its-first-tag-and-runs-its-retrospective-after
type: decision-log
title: "pack-cycle activates a pack at its first tag and runs its retrospective after"
status: approved
tags: ["process","packs","retrospective"]
---

## Context

`pack-cycle` v5 places `retrospective` after `first-release` and before `activate` (dl-006 R1).
None of the three pack cycles followed that order:
- `base` was activated at its first tag, and its retrospective deferred to run once for both
  foundation packs after `software`'s `first-release` (plan-044's ruling B, dl-006's note);
- `software` and `methodology/scrum` were activated at their first tag, and one retrospective ran
  for the three cycles in its own plan, plan-054 (plan-052's ruling 6, dl-006's note).

Each time, the approved order was changed by a ruling recorded as a note on dl-006 ("The body stays
as approved"), not by a decision-log (inventory of 2026-10-28, §4.3). The reasons recorded: a pack
published but not `active` is listed in `catalog.yaml` while its charter says otherwise (plan-044's
ruling B; `memory.yaml`'s `pack` comment: active means at least one version is published), and the
foundation charters ran in one plan, plan-041, so one retrospective covered both (ruling B). This
element adds its own argument: a retrospective over a whole cycle, or over several, sees more than a
gate before activation.

Candidate G6 of the retrospective dl-028 (C5).

## Options

1. **Keep the order and follow it.** Rejected: it holds activation back for a phase that changes
   nothing in the published version, and no pack followed it (three packs out of three, by two
   rulings).
2. **Activate at the first tag; the retrospective after `activate`**, one per pack.
3. **Option 2, and a retrospective may cover several packs** whose cycles ran together.
4. **Drop `retrospective` from `pack-cycle`** and rely on `retrospective-periodic` (dl-029).
   Rejected for dl-006 Option 4's reason: the end of a pack's first cycle would depend on someone
   remembering it.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **O1 — Option 3.** `pack-cycle`'s phases become `charter`, `design`, `author`, `first-release`,
  `activate`, `retrospective`. `activate` follows the first tag and `catalog.yaml` on origin/main,
  as today's checks say. The pack stays in the iteration after `activate`: on WingFoil 0.2.2 the
  `where` of `pack-delivery` is not evaluated (F-018) and the iteration is followed by hand; on
  0.3.x a candidate that has progressed stays in the iteration when it leaves the filter (dl-027's
  Context). `pack-delivery`'s `where: { status: [accepted] }` is not widened: it would select the
  packs already active, which never ran this workflow. Its selection gap (`charter` creates a
  `draft` pack) stays out of scope, in dl-031's register.
- **O2 — A shared retrospective.** One `retrospective` may cover several packs whose cycles ran
  together: the approver rules it in the plan that closes the last of them, and the plan that runs
  it names them; each pack's charter records it in one Execution Note, added when that
  retrospective's decision-log is approved. In `pack-cycle` v6 the `retrospective` phase stays
  required; a pack covered by a shared retrospective completes it with that note, which cites the
  approved decision-log. It may also be the periodic retrospective (dl-029).
- **O3 — dl-006 R1** reads with O1 and O2: an Execution Note on dl-006 says so, and supersedes the
  notes of plan-044 (ruling B) and plan-052 (ruling 6) as the reading of R1's order; those notes
  stay, and the body stays as approved.
- **O4 — Applied after approval** by the dl actions plan after plan-054: `pack-cycle.yaml` v5 → v6,
  one bump with dl-032 E5 (the phase order, `retrospective`'s description naming the shared case and
  citing dl-033 O2); `retrospective.yaml`'s header comment ("after a pack's first release" → "after
  its activation"); the note on dl-006. Unchanged: `sw-life-cycle.yaml` (its `pack-delivery`
  selection and its header stay true) and the three charters (their notes already record the order
  the packs followed). No run on 0.3.x is owed for v6 now: it is this repository's own workflow,
  followed by hand on the 0.2.2 pin; its reordered phases, and whether a covered pack can complete
  `retrospective` by reference (O2), are checked on the engine at the pin bump (a row in dl-031's
  register, trigger W10).

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-028.
- 2026-10-29: independent review: approve after amendments, nothing blocking; applied: the count
  (two rulings, three packs), the recorded reasons and this element's own argument, why the pack
  stays in the iteration, `optional` for the shared case, who rules and who names it, "supersedes"
  with the notes kept, the full change list, a fourth option.
- 2026-10-29: re-review: approve after amendments, nothing blocking; applied: `retrospective` stays
  required and a covered pack completes it by reference (not `optional`, which would weaken dl-006
  R1 for every pack), the engine check at the pin bump, O3's rulings named, the shared bump.
- 2026-10-29: final re-review: approve after amendments, nothing blocking; applied while `pending`:
  one charter note per pack, the engine check covers completion by reference, the description cites
  O2.
- 2026-10-29, plan-055: actions applied (O4): `pack-cycle` v6, the phase order and
  `retrospective`'s description (`f3fb891`); `retrospective` v5, its header comment (`9ec6f48`);
  dl-006's note (O3); the engine check of v6 at the pin bump, a row of `docs/owed-items.md`
  (`383d79a`).
