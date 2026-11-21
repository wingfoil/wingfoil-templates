---
id: dl-047-a-review-s-record-its-counts-and-what-was-applied-and-a-claim-found-false-corrected-by-a-note
type: decision-log
title: "A review's record: its counts and what was applied, and a claim found false corrected by a note"
status: draft
tags: ["process","review"]
---

## Context

dl-017 R3, "What the notes record", already requires of each review and re-review its verdict, the
number of blocking, should-fix and nit findings, and the commit that fixed them. dl-017 placed R3
in the `review` phase of `tooling-delivery` and `kanban-delivery` only (its configuration list),
and those phases restate it; their `plan` phase, the body's review, does not, nor do the other
phases that hold a review before a gate (the ingest workflows, `pack-cycle` › `charter`,
`pack-release-cycle`). In the cycle of `governance/feedback` the plans and task-093 … task-096
recorded each round; task-097 … task-099's body reviews recorded none (their commits say only
"body, reviewed"): the lapse fell where R3 is not restated. A second gap is not R3's: task-099's
notes grew by replacement, two claims later found false ("no refusal, no warning", "no command
assigns one") rewritten by a final check with no note saying so, the history in the commits only
(`8c31df80`, `345d0dd8`, `a46d70e6`). The inventory of 2026-11-21, §3, §5.1, §5.2; candidate GOV-4
of dl-043 (C4). The row "The engine way of working" names dl-017's reviewer as the checker before
every gate, which says nothing of the record.

## Options

1. **As today.** Rejected: R3 lapsed where no phase restates it.
2. **R3 restated in every phase that holds a review before a gate**, with "what was applied, or
   not and why" added to its record: `plan` of both delivery loops, the phase before the approval
   of `decision-log-ingest`, `adr-ingest` and `bug-ingest`, `pack-cycle` › `charter`,
   `pack-release-cycle` › `prepare` and `validate`.
3. **A correction-note rule**: a claim of an Execution Note found false is corrected by a new
   dated note naming the claim and the correction, the earlier note left as written.
4. **R3 written a second time in `repository-practice`.** Rejected: two homes for one rule.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **P1 — Options 2 and 3 together.** R3 restated in the phases option 2 lists, its record
  extended with what was applied or not and why; the correction-note rule as a new rule of
  `repository-practice`, applying from its version's date; the notes already on `main` stay as
  written.
- **P2 — Applied after approval** by a dl actions plan: the workflows option 2 lists, each bumped
  once (shared with dl-044's, dl-045's and dl-048's bumps of the same files when approved);
  `repository-practice` 1.2 → 1.3 with the correction-note rule, in one bump with dl-046's rule;
  an Execution Note on dl-017 recording R3's wider placement.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-21: written under plan-078 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-043, as the approver kept it at the checkpoint (the inventory of 2026-11-21, P2, P3).
- 2026-11-21: independent review: reject, one blocker: dl-017 R3 already requires each review's
  verdict, counts and fixing commit, placed in `review` only. Reworked: R3 restated in every phase
  with a review, its record extended; the correction-note rule as the only new rule.
