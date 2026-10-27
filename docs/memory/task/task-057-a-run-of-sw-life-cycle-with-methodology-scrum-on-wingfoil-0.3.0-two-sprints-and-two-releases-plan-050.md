---
id: task-057-a-run-of-sw-life-cycle-with-methodology-scrum-on-wingfoil-0.3.0-two-sprints-and-two-releases-plan-050
type: task
title: "A run of sw-life-cycle with methodology/scrum on WingFoil 0.3.0: two Sprints and two releases (plan-050)"
status: in-review
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
- 2026-10-27, the run (WingFoil 0.3.0 `cc31d7a8`, the matrix's install), in a scratch repository
  outside this one, `base` (2.0.0 on `main`, its fixes of bug-005 and bug-006), `software` and
  `methodology/scrum` composed from `main` at `2987234` (`npm run compose`, fictional project Wren
  Atlas, `.example` addresses), `.wingfoil/` committed, `workflow list` with no diagnostic. No
  workaround: `workflow start sw-life-cycle` exits 0 with `sw-life-cycle-1-plan (active)`
  (bug-005's fix), and `retrospective` › `explore` completes on a file under
  `docs/retrospectives/` (bug-006's fix).
  - `inception` (the document committed, `approve` finalized), `specification` (a tech-spec added
    at its step, submitted, approved), then `delivery` › `plan-sprint`: `sprint-001` added at the
    step, its goal written by editing the draft, submitted to `planned`.
  - Three tasks: two with `sprint: "sprint-001"`, one with `sprint: "n/a — not planned yet"`,
    each submitted and approved to `backlog`; the `n/a` one is left out of `development`.
    `sprint-planning`: `memory submit sprint-001` → `active`.
  - Sprint 1: item A through `backlog-item` to `done`; item B started (`in-progress`), then
    `memory park` → `backlog` and its `sprint` rewritten to `sprint-002`: nothing `late`, and
    `plan-release` became current beside `sprint-review` only then (ruling 16 holds).
    R1 (`rel-1.0.0`, `--set version=1.0.0 --set release-line=v1`, its `sprint` by editing) added at
    `plan-release`, moved to `in-development` by two `memory submit`; `pre-release-checks`
    finalized; `wf(release): start rel-1.0.0 [in-development → releasing]`.
  - **Finding 1:** completing `sprint-review` with R1 still in Sprint 1 reported
    `late: release:rel-1.0.0 (releasing)`; rewriting R1's `sprint` to `sprint-002` removed it. An
    open release has to move before the Sprint Review completes, not at `close` as the pack's
    `close` description, the `scrum` directive and the charter say.
  - Retrospective: `explore` complete on `docs/retrospectives/sprint-001.md`,
    `additional-points` finalized, a decision-log tagged `retrospective` added at `capture`,
    submitted, approved to `ready`. `sprint-002` added by `memory add` outside a step, its goal
    written, submitted to `planned`, and joined the live `sprints` iteration
    (`sprint-planning@sprint:sprint-002` ready). **The limit:** `memory submit sprint-002` while
    `sprint-001` was `active` exited 1, `WIP limit reached for 'active' on type 'sprint' (limit 1):
    held by sprint-001`. `close`: `memory submit sprint-001` → `done`.
- Sprint 2: `sprint-002` → `active`; item B to `done`; then `plan-release`, R1's `approve-release`
    and `sprint-review` ready together. **Finding 2:** R1 resumed at `approve-release`: its
    `pre-release-checks` record and its `enter-releasing` move, made in Sprint 1, were not asked
    again, WingFoil keying a step's record by the release, not by the Sprint; the charter and the
    README say they are recorded again. R2 (`rel-1.1.0`) added at `plan-release` before R1 completed
    (once R1 is `released` and no other release is open, the `release` phase completes and would
    close `plan-release`; a release can still be added outside the step), both released through
    every phase of `release-submit` and `release-publishing` (`approve-release` of R1 in Sprint 2),
    each to `released` by `wf(release): finalize <id> [releasing → released]`.
  - Sprint 2's review, retrospective (`explore` complete at once on the directory, the known
    weak evidence of the charter's open point 2), its decision-log approved, `close`: `done`.
    `workflow status`: `delivery complete, end-of-life current`; no element was reported `late`
    at any boundary after Finding 1's move. One retrospective decision-log was pending at a time.
- 2026-10-27, more of the record: after R1's move, Sprint 1's `release` phase had no candidate
  left and completed with nothing `late` (`before-close`, `after-close-1`); R1 and item B had their
  `sprint` rewritten to `sprint-002` before `sprint-002` existed, and WingFoil 0.3.0 gave no
  diagnostic, so the next Sprint may be named before it is added; `workflow status` read
  `delivery current` at every Sprint boundary, with no `late` but Finding 1's, until
  `delivery complete, end-of-life current`.
- 2026-10-27: Findings 1 and 2 went to the approver when found (dl-019), who approved fixing them
  in this task (Acceptance 3): `b6dc551` amends `sprint.yaml` (`plan-release`, `sprint-review`,
  `close` descriptions), the `scrum` directive, the README's adaptation and, in place, the
  charter (its `release` and Releases bullets, its Adaptations, an Execution Note); no type, state,
  workflow or phase changes. Acceptance 2's "recorded again" is answered by Finding 2.
- 2026-10-27: independent review: approve after amendments; the notes above and the charter's
  Adaptations bullet ("resumes where it stopped", the next Sprint named before it is added) complete
  it. dl-026's Consequences still describe a carried release reported `late` until it completes,
  as before plan-047 ruling 15; the approved decision-log is left as it is, the charter's note
  records the change for `scrum`.
- 2026-10-27: the full suite in clean clones at `b6dc551` (the pack's text fixes; the later commits
  change only Memory documents): 1002 of 1002 on Node.js 22.21.0 and on the floor 22.12.0.
- 2026-10-27: branch CI run 40520606513 on `3ee57b2`, conclusion `success` (`validate (22.12.0)`
  and `validate (22.21.0)` both `success`). Privacy: no local path, private repository or private
  project in the diff. `in-progress → in-review`; the merge waits for `base@2.0.0`'s tag.
