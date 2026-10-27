---
id: task-057-a-run-of-sw-life-cycle-with-methodology-scrum-on-wingfoil-0.3.0-two-sprints-and-two-releases-plan-050
type: task
title: "A run of sw-life-cycle with methodology/scrum on WingFoil 0.3.0: two Sprints and two releases (plan-050)"
status: in-progress
pack: "pack-methodology-scrum"
depends_on: ["task-055"]
tags: ["packs","scrum"]
---

## Context

`pack-methodology-scrum`'s Acceptance: a by-hand run, recorded in the `author`'s Execution Notes,
takes `sw-life-cycle` through two Sprints and two releases on WingFoil 0.3.0, one of them spanning
both Sprints, which completes in Sprint 2 only after its Sprint Backlog is done or moved, with no
`late` element (plan-050 ruling 3). plan-047's runs proved the shape on a draft; this task runs the
pack as written on `main`.

## Acceptance

1. **The setup**, outside the repository and never committed: a scratch repository; `base`,
   `software` and `methodology/scrum` composed from `main` at a commit the notes name (`npm run
   compose`), on fictional values (`.example` addresses), `.wingfoil/` committed; WingFoil 0.3.0
   from the matrix's lockfile. `base` from `main` carries the fixes of bug-005 and bug-006; the
   workarounds are used only if the run composes the tag `base@1.0.0`.
2. **The run**: `workflow start sw-life-cycle`, then `inception` and `specification`, then in
   `delivery`: Sprint 1 (planning, a backlog item through `backlog-item`, a release R1 added and
   moved to `in-development` in `plan-release`, R1 through `release-submit` to `releasing`, the
   Sprint Review, the retrospective, `close` with R1 still open and its `sprint` rewritten to
   Sprint 2), the limit refusing Sprint 2's start while Sprint 1 is `active`; Sprint 2 (an item,
   R1 completing to `released` after the Sprint Backlog is done, a release R2 added and released,
   review, retrospective, `close`); then `delivery` complete and `end-of-life` current. Each state
   move uses the verb or the commit form WingFoil 0.3.0 expects. Sprint 1 also holds a second item
   left unfinished, moved to Sprint 2 with `memory park` and its `sprint` rewritten before
   `close` completes.
   The run shows: in which Sprint R1's `approve-release` happens; Sprint 1's `release` phase
   closing with R1 not `late`; R1's record-based steps (`pre-release-checks`, `release-commit`,
   `staging-rehearsal`, `tag`) recorded again under Sprint 2; Sprint 2 added by `memory add`
   outside a step and joining the live `sprints` iteration; one retrospective decision-log pending
   at a time.
3. **The record**: the Execution Notes give the commands, their output and exit codes (`workflow
   next`, `workflow status` at each Sprint's boundaries), the commit composed, and state that no
   element was reported `late`. A finding that the charter's shape does not hold goes to the
   approver when found (dl-019); a defect of the pack is fixed in this task if small, otherwise in
   task-058 through plan-050's gate.
4. No file of the repository changes but this task's (and a fix the run finds, by 3).

## Design

**The scratch repository**, in the session's scratchpad, never committed: `git init`; `base`,
`software` and `methodology/scrum` composed from `main` at this branch's base commit with `npm run
compose -- --tree <worktree> --out <dir>` and fictional values (`.example` addresses, an approver
member and an agent); `.wingfoil/` copied and committed; WingFoil 0.3.0 from the matrix's cache
(`.cache/wingfoil-matrix/0.3.0`, the lockfile's install). Each command is run by a guarded script
(it stops if the scratch directory is missing), its output and exit code kept.

**The run**, step by step as Acceptance 2 lists it, each state move by `memory submit`, `memory
approve`, `memory park` or the commit form `workflow next` prints for an `element.set_state`, each
record by `workflow finalize --step <key>`; `workflow next` and `workflow status` captured at each
Sprint's boundaries and after each release move.

**The record**: the Execution Notes carry the composed commit, the commands with their output and
exit codes in condensed form, and the answers Acceptance 2 asks for.

**Commits** on `task/task-057-scrum-run`: the notes only.

## Execution Notes

- 2026-10-27: written under plan-050 (step 4).
- 2026-10-27: independent review (approve after amendments), amended, re-reviewed (approve);
  submitted.
- 2026-10-27: Design written; `backlog → in-progress`.
