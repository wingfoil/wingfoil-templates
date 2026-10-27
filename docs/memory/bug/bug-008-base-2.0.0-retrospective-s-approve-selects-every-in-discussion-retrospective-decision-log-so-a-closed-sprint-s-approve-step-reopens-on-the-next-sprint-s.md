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
the run gives identical `workflow status` and `workflow next --format json` on both.

`methodology/scrum`'s `delivery` iterates `sprint` over every Sprint (`iterate_over: sprint`), and
each `sprint` includes `base`'s `retrospective`. Its `approve` phase selects `where: { type: decision-log, status: [in-discussion], tags:
[retrospective] }`, with no relation to the Sprint in scope. Right after Sprint 2's retrospective
decision-log (`dl-002`) is submitted to `in-discussion`, Sprint 1 being `done`:

```
$ wingfoil workflow status
…
- retrospective.approve@sprint:sprint-001 (approver; missing: selection)
- retrospective.approve@sprint:sprint-002 (approver; missing: selection)
…
pending approvals: 2
```

(reduced); `workflow next --format json` gives the first step's scope as `{type: sprint, id:
sprint-001, status: done}`, awaiting `dl-002-sprint-2-retrospective`. One `memory approve` clears
both; nothing is reported `late`, and one retrospective decision-log is pending at a time.

The selection's reach is recorded: `pack-methodology-scrum`'s charter says `base`'s approve selects
any `in-discussion` decision-log tagged `retrospective`, so a later Sprint's (or
`retrospective-periodic`'s) can satisfy or hold Sprint n's step. What is not: (a) the visible effect,
a closed Sprint's step back on the frontier and the one decision-log counted once per step; (b)
`pack-foundation-base`'s workflow table, whose `retrospective` row says the tag lets WingFoil bind
the approve "in a sub to the retrospective's decision-log only", which an iterated sub contradicts;
(c) neither `base`'s nor `methodology/scrum`'s README states the effect.

## Expected

A closed Sprint's retrospective step stays off the frontier, or the texts say why it returns. The
options, for the triage:
- (i) `methodology/scrum` ships its own retrospective sub, under another name, whose `approve`
  selects on the Sprint: WingFoil 0.3.x resolves `{…}` tokens in a `where` (checked: with
  `tags: ["{id}"]` and the decision-log tagged with its Sprint, only that Sprint's step is listed,
  `pending approvals: 1`, on 0.3.0 and 0.3.1); `base`'s own `retrospective` cannot do it, since
  under `retrospective-periodic` no element is in scope and the token is unresolved
  (`W_UNRESOLVED_TOKEN`), and a list field matches on any shared value, so the scope needs a field
  of its own;
- (ii) the texts state the effect: `base`'s charter row corrected, a line in both READMEs;
- (iii) a feedback note to WingFoil for what 0.3.x lacks: a `where` key skipped when no element is
  in scope, or a closed iteration's steps not deduced again (binding a `where` to the scope exists
  already).

## Reproduction

1. Compose `base`, `software` and `methodology/scrum` (the README example `scrum/defaults`'s
   parameters), commit, and run `sw-life-cycle` to the end of Sprint 1, its retrospective's
   decision-log approved and Sprint 1 closed (`done`).
2. In Sprint 2, add the retrospective's decision-log at `capture` (`--tags retrospective`) and
   submit it to `in-discussion`.
3. Right after step 2's `memory submit`: `wingfoil workflow status` lists
   `retrospective.approve@sprint:sprint-001` and reads `pending approvals: 2`.

## Execution Notes
- 2026-10-27: independent review: request changes, two blocking findings: the effect's reach is
  already recorded in `pack-methodology-scrum`'s charter (the defect is the unstated effect and
  `base`'s charter row), and Expected's options restated after checking WingFoil's token
  resolution in `where` (option (i) works in a methodology's own sub, not in `base`'s). Applied,
  with the exact output and the reproduction's timing.
- 2026-10-27: re-review: approve; its wording nit applied. Submitted.
