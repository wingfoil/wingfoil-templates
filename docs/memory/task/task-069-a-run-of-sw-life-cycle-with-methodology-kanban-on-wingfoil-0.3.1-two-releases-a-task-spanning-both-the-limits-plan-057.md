---
id: task-069-a-run-of-sw-life-cycle-with-methodology-kanban-on-wingfoil-0.3.1-two-releases-a-task-spanning-both-the-limits-plan-057
type: task
title: "A run of sw-life-cycle with methodology/kanban on WingFoil 0.3.1: two releases, a task spanning both, the limits (plan-057)"
status: draft
pack: "pack-methodology-kanban"
depends_on: [task-067]
tags: ["packs","kanban","methodology"]
---

## Context

`pack-methodology-kanban`'s Acceptance (dl-032 E4) and plan-057 point 5 with ruling 4: a run of
`sw-life-cycle` through `delivery`, by hand where `check:runs` cannot drive it (it cannot set a
field, park, reject or expect a refusal; the scripted full run stays owed, plan-057 ruling 5),
takes two releases to `released`, one task spanning both, a limit refusing a move, a reject past a
full limit, a release already `released` before the start left out, and two retrospectives, on
WingFoil 0.3.1 only (0.3.0 being covered by the matrix and `check:runs`'s starts and adoptions).
plan-056's runs proved the shape on the draft; this task runs the pack as written on `main`, as
task-057 did for `scrum`.

## Acceptance

1. **The setup**, outside the repository and never committed: a scratch repository; `base`,
   `software` and `methodology/kanban` composed from `main` at a commit the notes name (`npm run
   compose`), on `kanban`'s defaults (`wip_in_progress: 2`, `wip_in_review: 1`) and fictional
   values (`.example` addresses), `.wingfoil/` committed; WingFoil 0.3.1 from the matrix's lockfile
   (0.3.2 instead if `compat.yaml` lists it by then); `workflow list` with no diagnostic.
2. **The run:** `workflow start sw-life-cycle`, `inception` and `specification`, then `delivery`:
   - a release R0 moved to `released` by `memory submit` before `workflow start`, never selected by
     `releases` (no step of `release-flow` bound to it at any point);
   - R1 added at `plan-release`, moved to `in-development`; tasks with `release` naming R1 and one
     with `release: "n/a — <reason>"`, approved to `backlog`: the R1 tasks join `work`, the `n/a`
     one stays out;
   - **a limit refusing:** with two tasks `in-progress`, `memory submit` of a third exits 1 with
     WingFoil's WIP message; with one task `in-review`, a second's `submit` to `in-review` exits 1;
   - **a reject past a full limit:** with two tasks `in-progress` and one `in-review`, `memory
     reject` of the third exits 0 and leaves three `in-progress`; the `kanban` directive's rule
     applied (one finished or parked) before anything else moves in;
   - **a task spanning both releases:** R2 added outside a step and moved to `in-development`; a
     task started under R1 has its `release` rewritten to R2's version (a commit) before R1 moves
     to `releasing`; R1 driven through `release-submit` and `release-publishing` to `released`
     while that task is `in-progress` under R2; the task then finished under R2;
   - a task parked (`memory park`) and restarted;
   - **two retrospectives:** R1's and R2's, each with its own file under the retrospective path and
     a decision-log tagged `retrospective`, approved; bug-008's re-listing observed and recorded
     (`pending approvals`);
   - R2 to `released`; with no release open, `delivery` complete and `end-of-life` current.
   Each state move uses the verb or the commit form WingFoil 0.3.1 expects; no element is reported
   `late` at any point (`workflow status` at each release boundary).
3. **The record:** the Execution Notes give the composed commit, WingFoil's `--version` line, the
   commands in condensed form with their exit codes and the outputs that show each item of 2, and
   state that nothing was reported `late`. No local or scratch path in them. A finding that the
   charter's shape does not hold goes to the approver when found (dl-019); a defect of the pack is
   fixed in this task if small, with the approver's OK, otherwise through plan-057's gate.
4. No file of the repository changes but this task's (and a fix the run finds, by 3); the privacy
   check of the branch's diff recorded; the branch CI `success`, recorded.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-30: written under plan-057 (step 2).
