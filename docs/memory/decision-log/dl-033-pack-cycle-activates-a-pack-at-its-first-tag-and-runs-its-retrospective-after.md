---
id: dl-033-pack-cycle-activates-a-pack-at-its-first-tag-and-runs-its-retrospective-after
type: decision-log
title: "pack-cycle activates a pack at its first tag and runs its retrospective after"
status: draft
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
as approved"), not by a decision-log (inventory of 2026-10-28, §4.3). The reasons held each time: a
pack published but not `active` is listed in `catalog.yaml` while its charter says otherwise, and a
retrospective is worth more over a whole cycle, or over several, than as a gate before activation.

Candidate G6 of the retrospective dl-028 (C5).

## Options

1. **Keep the order and follow it.** Rejected: it holds activation back for a phase that changes
   nothing in the pack, and it was overruled three times out of three.
2. **Activate at the first tag; the retrospective after `activate`**, one per pack.
3. **Option 2, and a retrospective may cover several packs** whose cycles ran together, when the
   approver rules it in the plan that closes the last of them; it counts as each pack's
   `retrospective` phase.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **O1 — Option 3.** `pack-cycle`'s phases become `charter`, `design`, `author`, `first-release`,
  `activate`, `retrospective`. `activate` follows the first tag and `catalog.yaml` on origin/main,
  as today's checks say.
- **O2 — A shared retrospective.** One `retrospective` may cover several packs whose cycles ran
  together; the plan that runs it names them, and each pack's charter records it in an Execution
  Note. It also counts as the periodic retrospective when it closes inside dl-029's window.
- **O3 — dl-006 R1** reads with O1 and O2: an Execution Note on dl-006 says so, and replaces the
  notes of plan-044 and plan-052 as the reading of R1's order. The body stays as approved.
- **O4 — Applied after approval** by the dl actions plan after plan-054: `pack-cycle.yaml` v5 → v6
  (the phase order, `retrospective`'s description); the note on dl-006.

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-028.
