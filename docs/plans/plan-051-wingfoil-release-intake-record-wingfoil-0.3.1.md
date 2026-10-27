---
id: plan-051-wingfoil-release-intake-record-wingfoil-0.3.1
type: plan
title: "wingfoil-release-intake record: WingFoil 0.3.1"
status: draft
workflow: "wingfoil-release-intake"
phase: "record"
tags: ["wingfoil","intake"]
---

## Context

WingFoil 0.3.1 was released on 2026-10-27: tag `v0.3.1` on `wingfoil/wingfoil@870bd440`, on npm
as `latest`. `wingfoil-release-intake` records it, on the approver's request in chat on
2026-10-27, before the first release of `software` and `methodology/scrum` (W9): recorded first,
both are validated on 0.3.0 and 0.3.1 before they are published, and a defect 0.3.1 shows in them
is fixed before their 1.0.0. `compat.yaml` lists 0.2.2 and 0.3.0; `base` 1.0.0 and 2.0.0 are
published with the range `0.3.0`.

The plan is filed under `record`, the phase that carries the work; it also records the outcome of
`recheck` and `plan-migrations`. Its roles (tech-lead, reviewer, product-owner) are run by claude;
`record`'s `approval: { by_role: approver }` is the approver's acceptance of the tasks and the
merge OK.

**What 0.3.1 provides**, read in its CHANGELOG (`[0.3.1]`) and to be checked by running it: a
patch of the 0.3 line, "nothing breaks" from 0.3.0. Added: `workflow adopt`, `workflow rekey`,
a check bound `manual: true` in `workflows/bindings.yaml` (0.3.0 refuses it). Changed: every
command that writes a configuration file raises its `version:`. Fixed: `init`'s scaffold
guidable by the engine, `workflow finalize --dry-run`, a `cadence` key's message under zod 4.6.
No format version is named; `reads` and `format_key` are verified by running it, as for 0.3.0.

**Already run** (2026-10-27, outside the repository, 0.3.1 installed in a scratch folder: 0
vulnerabilities; `--version` prints `0.3.1 (870bd440…)`, the form the matrix accepts):
- the matrix's three commands on the seven README examples (`base` 3, `software` 2,
  `methodology/scrum` 2), composed from `main` at `1039c23`: each pass, no warning;
- `check:runs`' scenario of `base` on 0.3.1: 9 runs, 0 failed;
- a scenario starting `sw-life-cycle` on the README examples of `software` and of
  `methodology/scrum`: 4 runs, 0 failed on 0.3.0 and on 0.3.1.

**The approver's rulings** (2026-10-27, in chat, as recommended):
1. **Two tasks**, through `tooling-delivery` as `developer`, red first (dl-018), in order:
   - **task-058 — `check:runs` on every selected release:** today it takes the newest compatible
     release only, so with 0.3.1 listed it would leave 0.3.0; it runs each scenario on every
     release the matrix selects (the oldest and the newest), its report naming each. Two scenario
     files join `tests/fixtures/runs/`: `software.yaml` and `scrum.yaml`, starting
     `sw-life-cycle` on each README example (the existing `start` step).
   - **task-059 — record 0.3.1:** the pin `src/matrix/wingfoil-0.3.1/` (`package.json`, the
     lockfile, `npm audit` 0, `check:pins`); `compat.yaml`'s release 0.3.1 (`format_key`, `reads`,
     `capabilities: [workflow-engine]`, `notes`), as verified by running it; spec-001 §12's example
     and the golden fixture's `compat.yaml` equal to the real file (dl-010), amended in place as
     task-036 did; the tests that count matrix runs; `catalog.yaml`'s `wingfoil` field recomputed
     for `base` 1.0.0 and 2.0.0 (spec-001 §12), `CATALOG.md` and `catalog-index.json` regenerated
     by `npm run index`.
2. **No new capability** for `workflow adopt`, `workflow rekey` or the manual checks: no pack
   requires them, and the vocabulary records a capability a pack needs (dl-021 R4).
3. **The run of `sw-life-cycle` with `methodology/scrum` on 0.3.1** (task-057's, two Sprints and
   two releases) is run again by hand in a scratch repository outside this one, its outcome in
   this plan's notes; making it a `check:runs` scenario needs step kinds the command lacks
   (`memory park`, a field rewritten, `set_state`), proposed for W9.
4. **Not in this plan:** this repository's own WingFoil (`devDependencies.wingfoil: 0.2.2`), which
   belongs to its adoption of the packs (W9); the feedback note F-038.

**Numbers.** plan-050 closed without task-058, task-059 and dl-029, which it held for a split; this
plan takes task-058 and task-059.

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`). A finding that changes a ruling goes to the approver.
2. **Each task**, task-058 then task-059, through `tooling-delivery` v2: its body reviewed and
   accepted into the backlog, its Design on `main`, the build on `task/<task id>`, red first, an
   independent review, the checks from clean clones on Node.js 22.21 and 22.12.0 (`npm ci`,
   `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
   `validate`, the overlays `software-exit` and `scrum-exit`, the golden step, `workflow list`,
   `check:runs`), the branch CI's conclusion in its notes, `in-review`, the approver's acceptance
   and merge OK, a `--no-ff` merge, `main`'s CI read, `done`.
3. **`recheck`** (reviewer), after task-059 on `main`: the matrix of the active pack, `base`, on
   0.3.0 and 0.3.1 (`npm run validate:publication` on the tree); the tree's self-test, the
   overlays and `check:runs` on both releases; bug-005's and bug-006's reproductions on 0.3.1,
   which pass with `base` 2.0.0 and fail with 1.0.0 (0.3.1 kept the behaviour behind both); and
   ruling 3's run. A defect of `software` or `methodology/scrum` it finds is a bug and a task,
   fixed before W9.
4. **`plan-migrations`:** recorded as empty unless `recheck` finds a format 0.3.1 reads
   differently.
5. **Close:** the coordinating session is told the intake's outcome; this plan goes
   `active → done`; W9 can start.

## Handoff

- **claude:** every step but the approver's gates.
- **Approver:** each task's backlog acceptance, its acceptance after the build and its merge OK.
- Done when `compat.yaml` lists 0.3.1, `base`'s published versions carry the recomputed range,
  `check:runs` runs on 0.3.0 and 0.3.1 with `software`'s and `methodology/scrum`'s starts, the
  recheck and ruling 3's run recorded, and `main`'s CI `success`.

## Execution Notes

- 2026-10-27: written. The approver gave the OK to the outline in chat; rulings 1–4 as
  recommended (decisions A–D). The session running plan-050 is archived; the numbers were read
  from `main`. `workflow` and `phase` filled by editing the draft (W-02).
