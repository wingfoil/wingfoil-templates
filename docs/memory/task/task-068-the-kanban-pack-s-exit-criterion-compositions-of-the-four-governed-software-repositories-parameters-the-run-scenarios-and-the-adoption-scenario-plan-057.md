---
id: task-068-the-kanban-pack-s-exit-criterion-compositions-of-the-four-governed-software-repositories-parameters-the-run-scenarios-and-the-adoption-scenario-plan-057
type: task
title: "The kanban pack's exit criterion: compositions of the four governed software repositories' parameters, the run scenarios and the adoption scenario (plan-057)"
status: backlog
pack: "pack-methodology-kanban"
depends_on: ["task-067"]
tags: ["packs","kanban","methodology"]
---

## Context

`pack-methodology-kanban`'s Acceptance (the exit criterion, dl-032 E4) and plan-057 point 4 with
ruling 3: task-049's compositions of the four governed software repositories' parameter sets,
redone with `methodology/kanban`, compose and validate with no WingFoil diagnostic on every release
`compat.yaml` lists as compatible; `check:runs` scenarios start `sw-life-cycle` with `kanban` on
every selected release, as task-058 does for `scrum`; and the adoption run of dl-032 E3, which is
`first-release`'s, is prepared here so that it runs in CI from this task on and `first-release`
cites its result. A developer change under `tests/` and `.github/` inside a pack task, as
task-056's. The run by hand is task-069's.

## Acceptance

1. **The compositions**: `tests/fixtures/kanban-exit/compositions/<set>/example.yaml` for the four
   sets of `tests/fixtures/software-exit/compositions/` (task-049): `defaults`, `flat-releases`,
   `release-folders`, `release-folders-lean`, the same parameter values and fictional identities,
   `packs: [software@^1, methodology/kanban@^1]`; `flat-releases` (Benchmark's set) adds
   `wip_in_progress: 1` and `wip_in_review: 1`, its rule as the charter's Adoption reads it
   (plan-057 ruling 3); the other three keep `kanban`'s parameters on their defaults. No `packs/`
   folder. The Execution Notes state which repository each matches, from task-049's.
2. **Validation:** `npm run validate -- --overlay tests/fixtures/kanban-exit` passes, every
   composition composed twice byte-identical and run on WingFoil 0.3.0 and 0.3.1 with no failed run
   and no warning on stdout or stderr: `compositions: 13` (the tree's nine examples and the four
   sets) and `matrix: self-test, 26 runs, 0 failed, tolerance applied: none`. A case in
   `tests/validate.test.ts`, as task-056's, pins the four `composed twice` lines and those counts.
3. **CI:** a step in `.github/workflows/ci.yml` running that command off tags, after the
   `scrum-exit` step and before `check:runs`, named for task-068; `tests/ci-workflow.test.ts`'s list
   of branch-only commands gains it.
4. **The start scenario:** `tests/fixtures/runs/kanban.yaml` (`compositions:
   tests/fixtures/examples/kanban`), with one run, `main: sw-life-cycle`, `steps: [start]`, the
   agent identity of `base.yaml`, and a header as `scrum.yaml`'s; the guard test of
   `tests/runs.test.ts` (task-058's for `software.yaml` and `scrum.yaml`) extended to it.
5. **The adoption scenario:** `tests/fixtures/runs/adoption-kanban.yaml` (`compositions:
   tests/fixtures/examples/kanban`), one `adopt` run per `init` template (`Scrum`, `Kanban`), with
   `adoption.yaml`'s removal list (bug-007), which is what the "Install and update" steps of
   `base`'s, `software`'s and `kanban`'s READMEs remove (task-067's section 3), and a header as
   `adoption.yaml`'s saying so, naming dl-032 E3 and `first-release`'s citation; a guard in
   `tests/runs.test.ts` as `adoption.yaml`'s (its compositions folder, both templates, the same
   removal list as `adoption.yaml`'s).
6. **Red first** (dl-018), the red runs recorded with their command and failing count: the
   `ci-workflow` case, the `validate` case and the two guards are written first and red (no step;
   `validate` exiting non-zero on the missing overlay, as task-056's red run; no scenario files),
   then the files.
7. **`check:runs`:** `npm run check:runs` exits 0, its summary `runs: 46 runs, 0 failed` (34 today,
   plus per release 2 starts and 4 adoptions on 0.3.0 and 0.3.1); the lines of the 12 new runs
   recorded.
8. **Durations:** before the push, the full `npm test`, the three overlays and `check:runs` timed
   locally; then the branch CI job's duration, both recorded against the job's `timeout-minutes: 30`
   (the owed row G12). A local estimate or a CI job within 5 minutes of it goes to the approver
   (dl-019), before the push for the local one, before `in-review` for the CI's.
9. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other: `npm ci`, `npm
   test`, `lint`, `check:packs`, `validate`, the overlays `software-exit`, `scrum-exit` and
   `kanban-exit`, `index -- --check`, `check:runs` and `workflow list` exit 0; the branch CI
   `success`, the new step included, recorded; the privacy check of the branch's diff recorded. No
   file under `packs/`, `src/` or `.wingfoil/` changes.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-30: written under plan-057 (step 2).
- 2026-10-30: independent review: approve after amendments, nothing blocking; applied: the removal
  list tied to the READMEs, a local timing before the push, the red `validate` case, the summary
  line quoted.
- 2026-10-30: focused re-review: approve; its nits applied. Submitted.
