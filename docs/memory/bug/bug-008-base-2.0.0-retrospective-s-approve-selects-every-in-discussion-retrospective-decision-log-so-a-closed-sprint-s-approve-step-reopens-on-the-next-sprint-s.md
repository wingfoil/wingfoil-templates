---
id: bug-008-base-2.0.0-retrospective-s-approve-selects-every-in-discussion-retrospective-decision-log-so-a-closed-sprint-s-approve-step-reopens-on-the-next-sprint-s
type: bug
title: "base 2.0.0: retrospective's approve selects every in-discussion retrospective decision-log, so a closed Sprint's approve step reopens on the next Sprint's"
status: draft
severity: "minor"        # critical | major | minor
pack: "pack-foundation-base"
tags: ["packs","base","workflow","scrum"]
---

## Observed

Found on 2026-10-27 by plan-051's `recheck` (task-057's run of `sw-life-cycle` with
`methodology/scrum`, two Sprints, rerun on WingFoil 0.3.1), and the same on 0.3.0: every commit of
the run gave byte-identical `workflow status` and `workflow next --format json` on both.

`methodology/scrum`'s `sprint` includes `base`'s `retrospective` once per Sprint (`iterate_over:
sprint`). Its `approve` phase selects `where: { type: decision-log, status: [in-discussion], tags:
[retrospective] }`, with no relation to the Sprint in scope. While Sprint 2's retrospective
decision-log (`dl-002`) is `in-discussion`, `workflow next` lists, beside
`retrospective.approve@sprint:sprint-002`, the step of Sprint 1, already `done`:

```
retrospective.approve@sprint:sprint-001 scope={sprint-001, done} role=approver
  awaiting approval of decision-log dl-002-sprint-2-retrospective (in-discussion)
```

(from `workflow next --format json`, reduced here), and `workflow status` reads
`pending approvals: 2` for the one decision-log. One `memory approve dl-002` clears both steps;
nothing is reported `late`, and one retrospective decision-log is pending at a time, as the charter
of `methodology/scrum` asks. The charter of `base` records that the selection is repository-wide
(its Execution Notes, task-038); this effect on an iterated retrospective is not recorded.

## Expected

A closed Sprint's retrospective step stays complete: the approve step of one iteration selects only
its own decision-log, or the composition says why it cannot on WingFoil 0.3.x. The options, for
the triage: the decision-log carries its scope (for example a `sprint` field or tag set by
`capture`) and `approve`'s `where` selects it, if WingFoil's `where` can bind the scope's id; or
`base`'s and `methodology/scrum`'s texts state the effect (a closed iteration's approve listed
again, cleared by the same approval); or a feedback note asking WingFoil that a `where` be bound to
the iteration's scope.

## Reproduction

1. Compose `base`, `software` and `methodology/scrum` (the README example `scrum/defaults`'s
   parameters), commit, and run `sw-life-cycle` to the end of Sprint 1, its retrospective's
   decision-log approved and Sprint 1 closed (`done`).
2. In Sprint 2, add the retrospective's decision-log at `capture` (`--tags retrospective`) and
   submit it to `in-discussion`.
3. `wingfoil workflow next --format json`: `retrospective.approve@sprint:sprint-001` is listed,
   awaiting the approval of Sprint 2's decision-log; `wingfoil workflow status`: `pending
   approvals: 2`.

## Execution Notes
