---
id: dl-047-a-review-s-record-its-counts-and-what-was-applied-and-a-claim-found-false-corrected-by-a-note
type: decision-log
title: "A review's record: its counts and what was applied, and a claim found false corrected by a note"
status: draft
tags: ["process","review"]
---

## Context

dl-017 requires an independent review of every element and a re-review of a fix that changes a
rule or behaviour; it says nothing of what the element records. In the cycle of
`governance/feedback`, task-093 … task-096 and the plans recorded each round's verdict and counts
(blockers, should-fix, nits) and what was applied; task-097 … task-099's body reviews recorded none
(their commits say only "body, reviewed"). task-099's notes grew by replacement: two claims later
found false ("no refusal, no warning", "no command assigns one") were rewritten by a final check
with no note saying so, the history in the commits only (`8c31df80`, `345d0dd8`, `a46d70e6`). The
inventory of 2026-11-21, §3, §5.1, §5.2; candidate GOV-4 of dl-043 (C4). The row "The engine way
of working" names dl-017's reviewer as the checker before every gate, which holds today and says
nothing of the record.

## Options

1. **As today:** each author's habit. Rejected: it lapsed within one plan.
2. **A rule in `repository-practice`:** every review and re-review leaves one Execution Note on the
   reviewed element (or its hosting plan, for a plan's own review) with its date, its kind, its
   verdict, its counts and what was applied or not and why; a claim of an Execution Note found
   false is corrected by a new dated note naming the claim and the correction, the earlier note
   left as written.
3. **The counts in the commit message.** Rejected: not where a reader of the element looks.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **P1 — Option 2**, as a rule of `repository-practice`, applying from its version's date; the
  notes already on `main` stay as written.
- **P2 — Applied after approval** by a dl actions plan, in the same bump of `repository-practice`
  as dl-046 if both are approved; an Execution Note on dl-017.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-21: written under plan-078 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-043, as the approver kept it at the checkpoint (the inventory of 2026-11-21, P2, P3).
