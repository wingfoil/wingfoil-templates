---
id: task-069-a-run-of-sw-life-cycle-with-methodology-kanban-on-wingfoil-0.3.1-two-releases-a-task-spanning-both-the-limits-plan-057
type: task
title: "A run of sw-life-cycle with methodology/kanban on WingFoil 0.3.1: two releases, a task spanning both, the limits (plan-057)"
status: backlog
pack: "pack-methodology-kanban"
depends_on: ["task-067", "task-068"]
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
   compose`), on `kanban`'s defaults (`wip_in_progress: 2`, `wip_in_review: 1`) and fictional values
   (`.example` addresses), `.wingfoil/` committed; WingFoil 0.3.1 from the matrix's lockfile (0.3.2
   instead if `compat.yaml` lists it by then), every command run with that install's CLI (this
   repository's `npm run wingfoil` is pinned to 0.2.2); `workflow list` with no diagnostic.
2. **The run:** `workflow start sw-life-cycle`, `inception` and `specification`, then `delivery`:
   - a release R0 (its `version` and `release-line` given with `--set` or by editing the draft)
     moved to `released` by four `memory submit` before `workflow start`, never selected by
     `releases` (no step of `release-flow` bound to it at any point);
   - R1 added at `plan-release`, moved to `in-development`; at least four tasks A, B, C, D with
     `release` naming R1 and one with `release: "n/a — <reason>"`, approved to `backlog`: the R1
     tasks join `work`, the `n/a` one stays out;
   - **a limit refusing**, in this order: A and C started, C submitted to `in-review`, B started
     (two `in-progress`); D's `memory submit` to `in-progress` exits 1 with WingFoil's WIP message
     (limit 2); A's `submit` to `in-review` exits 1 (limit 1);
   - **a reject past a full limit:** C rejected (`memory reject`, exit 0), leaving A, B and C
     `in-progress`; the `kanban` directive's rule applied before anything else moves in: one of them
     parked (`memory park`) or finished, which may be the park-and-restart item below;
   - **a task spanning both releases:** R2 added outside a step and moved to `in-development`; a
     task started under R1 has its `release` rewritten to R2's version (a commit) before R1 moves to
     `releasing`; R1 driven through `release-submit` and `release-publishing` to `released` while
     that task is `in-progress` under R2; the task then finished under R2;
   - a task parked (`memory park`) and restarted (`start` offered again);
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
   check of the branch's diff recorded; the branch CI `success`, recorded. If a fix changes a file
   of the pack, the checks of plan-057 step 3 run from clean clones on Node.js 22.21.0 then 22.12.0
   (`npm run index` first, the three overlays and `check:runs` included) before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-30: written under plan-057 (step 2).
- 2026-10-30: independent review: approve after amendments, nothing blocking; applied: four tasks
  and the order of the limit and reject moves, the checks after a fix of the pack, task-068 as a
  dependency, the 0.3.1 CLI, R0's fields, the park.
- 2026-10-30: focused re-review: approve; its nits applied. Submitted.
