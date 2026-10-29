---
id: dl-031-a-register-of-owed-items
type: decision-log
title: "A register of owed items"
status: draft
tags: ["process","backlog"]
---

## Context

Owed items — work a plan or a task defers to a later element, with or without a trigger — live
only in the closing notes and Execution Notes of the element that found them. The retrospective of
2026-10-28 rebuilt them by reading every close of the period: 22 open items, most with no owner
(inventory §8). Two of them, `pack-delivery`'s selection over `accepted` packs (plan-041) and
`--param` applying to an `entries` composition only (plan-043), fell out of every later closing
list; the second was hit again at prel-003. plan-052's close lists twelve groups of owed items,
none with an owner.

Number reservations between parallel lines of work had the same shape (§4.4), but they follow
from WingFoil 0.2.2's numbering by count (W-14); 0.3.0 and 0.3.1 number after the highest id and do
not reuse a number taken on another branch, so they need no register once the pin moves (W10).

Candidate G2 of the retrospective dl-028 (C3), with plan-054's decision 4 (the debts table approved
as a backlog by the retrospective, the phenomenon itself a candidate change).

## Options

1. **Keep owed items in closing notes**, and let each retrospective rebuild them. Rejected: items
   are lost between retrospectives, and owners are missing.
2. **One Memory element per item** (a task in `backlog`, or a new type). Rejected for now: a task
   commits to an Acceptance before the work is understood, a new type is a Memory change best made
   with the adoption (W10), and most items are small.
3. **One register file** outside every Memory path, `docs/owed-items.md`: a table with the item, its
   source (element and section), its owner (an element, a wave or the approver) and its trigger,
   and a closed section with the element that settled each. Each close adds its items there; each
   retrospective reads and prunes it.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **R1 — Option 3.** `docs/owed-items.md` holds every open owed item, one row each: item, source,
  owner, trigger. An item without an owner names the approver.
- **R2 — Who writes it.** The close of a plan or a task that leaves an owed item adds its row in the
  same commit as the closing note, and the closing note cites the row. The element that settles an
  item moves its row to the closed section, with its own id.
- **R3 — Who reads it.** Every retrospective reads the register in `explore` and proposes, for each
  row, keep, assign or drop; the periodic retrospective's decision-log rules them.
- **R4 — First content.** The table of §8 of the inventory of 2026-10-28, with the rows dl-028 D1
  adds (G7, G8, G9, G11, G12 with the trigger "W10"), as approved by dl-028.
- **R5 — Number reservations.** None registered: until the pin moves, a reservation is written in
  the reserving plan, and the `wingfoil-cli` W-14 workaround applies; at the pin bump to 0.3.x it is
  no longer needed.
- **R6 — Applied after approval** by the dl actions plan after plan-054: the file, a line in the
  plan and task templates' Execution Notes comment, and the retrospective's `explore` description.
  Whether it becomes a Memory type is reconsidered at the adoption (W10).

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-028.
