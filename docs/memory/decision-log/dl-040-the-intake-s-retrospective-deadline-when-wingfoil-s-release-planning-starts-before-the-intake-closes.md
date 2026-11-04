---
id: dl-040-the-intake-s-retrospective-deadline-when-wingfoil-s-release-planning-starts-before-the-intake-closes
type: decision-log
title: "The intake's retrospective deadline when WingFoil's release planning starts before the intake closes"
status: draft
tags: ["process","retrospective","wingfoil"]
---

## Context

dl-029 T2 sets the deadline of the periodic retrospective an intake starts: before WingFoil's next
release planning, or within seven days of the intake's close when the date is not known. In
WingFoil 0.3.2's intake (plan-060) the date was not announced, and the approver reported on
2026-11-03 that v0.4's planning had started that day, before the intake closed: "before the
planning" could no longer be met, a case T2 does not cover. The approver ruled the deadline in
the intake's plan (plan-060 ruling 6): the WingFoil-side notes on `main` as soon as possible while
the planning runs, the retrospective closed within seven days of the intake's close; the gap has
a row of `docs/owed-items.md` (row 39). `wingfoil-release-intake` is this repository's own and
survives W10 (dl-029 T3), so W10 does not fix it (inventory of 2026-11-04 §1, §7). Candidate GOV-3
of the retrospective dl-038 (C2).

## Options

1. **Leave each case to the intake's plan.** Rejected: it cost a ruling and a row.
2. **Plan-060 ruling 6 made general.**
3. **No retrospective when the planning has already started.** Rejected: the period's points would
   reach WingFoil only after a whole release.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **D1 — Option 2.** When WingFoil's next release planning has started before the intake closes,
  the intake's plan records its start date as announced or reported, and the retrospective's
  deadline is: its WingFoil-side notes on `main` as soon as possible while the planning runs, the
  notes task merging into `main` alone, ahead of the retrospective's branch; the retrospective
  closed within seven days of the intake's close. When the planning has already ended, the notes go
  to WingFoil at the next sync, and the seven days hold.
- **D2 — Where:** `wingfoil-release-intake` v5 → v6, `retrospective-start`'s description; an
  Execution Note on dl-029 (T2 reads with D1). Applied after approval by the dl actions plan of
  dl-035 … dl-037 (dl-038 D3); row 39 moves to Closed then.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-04: written under plan-061 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-038.
