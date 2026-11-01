---
id: task-069-a-run-of-sw-life-cycle-with-methodology-kanban-on-wingfoil-0.3.1-two-releases-a-task-spanning-both-the-limits-plan-057
type: task
title: "A run of sw-life-cycle with methodology/kanban on WingFoil 0.3.1: two releases, a task spanning both, the limits (plan-057)"
status: done
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

Branch `task/task-069-kanban-run` from `main` (`6d260b9`, with task-067 and task-068).

**The scratch repository**, outside this one, never committed here: `git init`; `base`, `software`
and `methodology/kanban` composed from `main` with `npm run compose` on `kanban`'s defaults and a
fictional project (Plover Board, `.example` addresses: an approver member and an agent); the
composed `.wingfoil/` and an `AGENTS.md` committed; the scratch repository's git identity is the
fictional approver's (fixture data). WingFoil 0.3.1 from the matrix's install
(`.cache/wingfoil-matrix/0.3.1`), on the `PATH` ahead of everything else.

**The run**, a script of guarded steps (it stops if the scratch directory is missing), each command
logged with its output and exit code: R0 (`version` and `release-line` by `--set`) to `released` by
four `memory submit`; `workflow start sw-life-cycle`; `inception` and `specification` (a document
committed, a tech-spec added at its step, submitted, approved); then `delivery` as Acceptance 2
orders it, each state move by `memory submit`, `memory approve`, `memory reject`, `memory park`,
a `release` field rewritten by editing the task and committing it, or the commit form `workflow
next` prints for an `element.set_state`; each record by `workflow finalize --step <key>`;
`workflow status` at each release boundary.

**The record**: the Execution Notes carry the composed commit, WingFoil's `--version` line, the
commands in condensed form with their exit codes and the outputs that show each item of
Acceptance 2, with no local or scratch path. **Commits**: the notes only.

## Execution Notes

- 2026-10-30: written under plan-057 (step 2).
- 2026-10-30: independent review: approve after amendments, nothing blocking; applied: four tasks
  and the order of the limit and reject moves, the checks after a fix of the pack, task-068 as a
  dependency, the 0.3.1 CLI, R0's fields, the park.
- 2026-10-30: focused re-review: approve; its nits applied. Submitted.
- 2026-11-01: Design written; `backlog → in-progress`.
- 2026-11-01, the run (Acceptance 1 … 3), in a scratch repository outside this one: `base`,
  `software` and `methodology/kanban` composed from `main` at `6d260b9` (`npm run compose`,
  `kanban`'s defaults, fictional project Plover Board, `.example` addresses), `.wingfoil/` and an
  `AGENTS.md` committed; the composed `task` with `limits: { in-progress: 2, in-review: 1 }`.
  WingFoil from the matrix's install, `--version`
  `0.3.1 (870bd4406f3b9bba5ecde7a5f8198b80c2a98583)`; `workflow list` exit 0, `"diagnostics": []`.
  118 logged steps (WingFoil commands, the commits of a `release` field or of a release's state,
  and three file commits, `docs/inception.md` and the two retrospective files, logged without an
  exit code): of the 115 with an exit code, each is 0 except the five named below. `workflow
  status` ran before R1 entered `releasing`, during R1's retrospective and twice at R2's.
  - **R0 left out:** `rel-0.5.0` (`--set version=0.5.0 --set release-line=v0`) moved to `released`
    by four `memory submit` before `workflow start sw-life-cycle`; no step was ever bound to it
    (`@release:rel-0.5.0` appears in no output).
  - `workflow start sw-life-cycle` exit 0 (`sw-life-cycle-1-plan (active)`); `inception`
    (`docs/inception.md` committed, `inception.approve` finalized) and `specification` (`spec-001`
    added at its step, submitted, approved).
  - **R1 and its tasks:** `rel-1.0.0` added at `delivery.plan-release`
    (`--set version=1.0.0 --set release-line=v1`), two `memory submit` → `in-development`. Five
    tasks added, their `release` written by editing the draft and committing it: A, B, C, D with
    `release: "1.0.0"`, E with `release: "n/a — not planned yet"`; each submitted and approved to
    `backlog`. A, B, C, D joined `work` (`work-item.start@task:…` on the frontier); E stayed out.
    Three of the five non-zero exits are a slip of the driving script, recorded: E's first edit
    failed (a `sed` on the `/` of `n/a`, nothing committed, exit 1), so `memory submit` of E
    exited 1 (`missing required field on submit: release`) and its `memory approve` exited 1
    (`illegal transition draft -> (none)`); the script's writer was replaced before E's second
    edit, and with the field written E went to `backlog`. The other two are the limits' refusals
    below.
  - **A limit refusing:** A and C started (`memory submit`, `→ in-progress`), C's `build`
    finalized and C submitted to `in-review`, B started. D's `memory submit` exit 1: `WIP limit
    reached for 'in-progress' on type 'task' (limit 2): held by task-001-alpha, task-002-beta`;
    after A's `build`, A's `memory submit` to `in-review` exit 1: `WIP limit reached for
    'in-review' on type 'task' (limit 1): held by task-003-gamma`.
  - **A reject past a full limit:** `memory reject task-003-gamma` exit 0 (`in-review →
    in-progress`), leaving A, B and C `in-progress` under a limit of 2; the `kanban` directive's
    rule applied: `memory park task-002-beta` exit 0 (`in-progress → backlog`), back to two;
    `work-item.start@task:task-002-beta` offered again and C's `build` re-entered (the fallback).
    A, then B (restarted), then D driven through `review`, `approve` and `done`.
  - **A task spanning both releases:** `rel-1.1.0` added outside a step
    (`--set version=1.1.0 --set release-line=v1`) and moved to `in-development` by two
    `memory submit`; before the rewrite, the frontier held C's `build` and no step of
    `rel-1.0.0`'s release. C's `release` rewritten to `1.1.0` (a commit) while C was `in-progress`.
    The frontier then held `release-submit.pre-release-checks@release:rel-1.0.0` beside
    `work-item.build@task:task-003-gamma`. `rel-1.0.0` driven through `release-submit` and
    `release-publishing` (records by `workflow finalize`, the moves by the commit forms `workflow
    next` printed: `wf(release): start rel-1.0.0 [in-development → releasing]`, `wf(release):
    finalize rel-1.0.0 [releasing → released]`) to `released` while C was `in-progress` under
    `rel-1.1.0`. C then built again, reviewed, approved and done; `rel-1.1.0` to `released` the
    same way.
  - **Two retrospectives:** `rel-1.0.0`'s: `docs/retrospectives/rel-1.0.0.md` committed,
    `explore` complete, `additional-points` finalized, `dl-001` tagged `retrospective` added at
    `capture`, submitted (`in-discussion`, `pending approvals: 1`), approved. `rel-1.1.0`'s:
    `explore` was already complete after `mark-released`, before its own file was committed
    (`base`'s known weak evidence, the charter's open point 4); `additional-points` finalized,
    `dl-002` added at `capture` and submitted: `retrospective.approve@release:rel-1.0.0` returned to
    the frontier beside `rel-1.1.0`'s, `pending approvals: 2`, one decision-log (bug-008, F-039);
    its one approval cleared both.
  - With no release open, `workflow status`: `delivery complete, end-of-life current`;
    `workflow next`: `end-of-life.announce`. Final states: three releases `released`, A … D
    `done`, E in `backlog`. No element was reported `late` at any point (the word appears in no
    output).
- 2026-11-01: nothing in the pack had to change: no finding for the approver (dl-019).
- 2026-11-01: independent review of the record: approve after amendments, nothing blocking; it
  checked every claim against the run's log and the scratch repository (91 commits, the final
  files). Applied: three of the five non-zero exits are the slip, not two; the steps logged without
  an exit code; the script's writer replaced; the frontier before the rewrite; where `workflow
  status` ran. No finding for the approver (dl-019): the weak `explore` evidence and bug-008's
  re-listing are the charter's open point 4.
- 2026-11-01, Acceptance 4: the branch's diff against `main` is this file only; privacy check: no
  local or scratch path, no private repository or project, no intermediary session. Branch CI run
  41351653544 on `3e6c46b`: `success`. `in-progress → in-review`.
- 2026-11-01: approved by the approver (`in-review → approved`) with the merge OK; merged into
  `main` with `--no-ff` (`eef6672`), this file only. `approved → done`.
