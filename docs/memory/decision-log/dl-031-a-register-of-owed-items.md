---
id: dl-031-a-register-of-owed-items
type: decision-log
title: "A register of owed items"
status: draft
tags: ["process","backlog"]
---

## Context

Owed items — work a plan or a task defers to a later element, with or without a trigger — live only
in the closing notes and Execution Notes of the element that found them. The retrospective of
2026-10-28 rebuilt them by reading every close of the period: 22 items (one of them moot), most with
no owner (inventory §8). Two of them, `pack-delivery`'s selection over `accepted` packs (plan-041)
and `--param` applying to an `entries` composition only (plan-043), fell out of every later closing
list; the second was hit again at prel-003. plan-052's close lists seven groups of owed items in its
closing note; most name a trigger, few an owner, and none sits in a list a later element reads.

Number reservations between parallel lines of work had the same shape (§4.4), but they follow
from WingFoil 0.2.2's numbering by count (W-14); 0.3.0 and 0.3.1 number after the highest id and do
not reuse a number taken on another branch, so reused numbers end once the pin moves (W10); a
number promised in prose before `memory add` runs is another matter (R5).

Candidate G2 of the retrospective dl-028 (C3), with plan-054's decision 4 (the debts table approved
as a backlog by the retrospective, the phenomenon itself a candidate change).

## Options

1. **Keep owed items in closing notes**, and let each retrospective rebuild them. Rejected: items
   are lost between retrospectives, and owners are missing.
2. **One Memory element per item** (a task in `backlog`, or a new type). Rejected for now: a task
   commits to an Acceptance before the work is understood, a new type is a Memory change best made
   with the adoption (W10), and most items are small. An external tracker (issues) is rejected too:
   it is outside the repository's history and traceability, and agents read the repository.
3. **One register file** outside every Memory path, as the feedback inbox's ledger is:
   `docs/owed-items.md`, outside the retrospectives' directory (at W10, `base`'s `retrospective` ›
   `explore` is satisfied by any file in `docs/retrospectives/`), a table with the item, its source
   (element and section), its owner and its trigger, and a closed section with the element that
   settled each. A living file edited by many closes: rows sorted by source id, so parallel closes
   rarely touch the same lines.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **R1 — Option 3.** `docs/owed-items.md` holds every open owed item, one row each:
  item, source, owner, trigger. An item without an owner names the approver; an item without a
  trigger takes "the next retrospective".
- **R2 — Who writes it.** A plan or a task adds the row in the same commit as the note that leaves
  the item; for a pack, a pack-release, a bug or a decision-log, at the latest by the close of the
  plan that hosts it. The note, or for a row added later the hosting plan's note, cites the row. The
  element that settles an item moves its row to the closed section, with its own id.
- **R3 — Who reads it.** Every retrospective reads the register in `explore` and proposes, for each
  row, keep, assign or drop; the retrospective's decision-log rules them.
- **R4 — First content.** The table of §8 of the inventory of 2026-10-28, with the rows dl-028 D1
  and D2 add (G7, G8, G9, G11, G12 with the trigger "W10"; the tag-annotation check; the "known
  defects" question; D2's two risks until the adoption's plan exists), once dl-028 is approved; rows
  settled by plan-054 (F-038, F-039, the note on 0.3.0's `finalize --dry-run`) go straight to the
  closed section.
- **R5 — Number reservations.** None registered. Until the pin moves, a reservation is written in
  the reserving plan and the `wingfoil-cli` W-14 workaround applies. After the pin bump no number
  is reserved in prose: a plan names a future element by its purpose, and its number is the one
  `memory add` gives. The inbox's contiguous numbering is this repository's own test (G9, trigger
  W10), not a WingFoil behaviour.
- **R6 — Where the rules live, so that they survive the adoption.** R1 … R3 and R5's rule after the
  pin bump are written in the directive `repository-practice` (dl-030), read by every role, the
  directive's version raised (1.0 → 1.1) and its date: `base`'s `retrospective` and templates
  replace this repository's at W10, its directives do not. With them: the file, `docs/owed-items.md`
  added to `dna.yaml` › `paths.governance`, and a line in the templates' Execution Notes comment
  (plan, task, pack, pack-release, bug, decision-log) while they are this repository's. Applied
  after approval by the dl actions plan after plan-054, once task-065 has created the directive.
  Whether the register becomes a Memory type is reconsidered at the adoption (W10).

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-028.
- 2026-10-29: independent review: approve after amendments, nothing blocking; applied: plan-052's
  close described as it is, R2 widened to every element's notes, a default trigger, R5 on
  reservations in prose after the pin bump, R6 in dl-030's directive so the rules survive W10, the
  file under `docs/retrospectives/`, the register's precedent and cost, settled rows closed at once.
- 2026-10-29: re-review: approve after amendments, nothing blocking; applied: the register moved to
  `docs/owed-items.md` (at W10 any file in `docs/retrospectives/` satisfies `explore`) and added to
  `paths.governance`, R2's two clauses made one rule, the directive's version raised, R4 lists every
  row dl-028 D1 and D2 add.
- 2026-10-29: final re-review: approve after amendments, nothing blocking; applied: R5's rule after
  the pin bump also in the directive, who cites a row added later.
