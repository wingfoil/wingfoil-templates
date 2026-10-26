---
id: task-053-a-scripted-run-of-base-s-workflows-on-wingfoil-0.3.0-every-main-starts-explore-and-apply-complete-bug-005-bug-006-plan-049
type: task
title: "A scripted run of base's workflows on WingFoil 0.3.0: every main starts, explore and apply complete (bug-005, bug-006, plan-049)"
status: backlog
pack: ""            # tooling task (pack-release › release, plan-049 step 2, ruling 4)
depends_on: []
tags: ["packs","base","tooling"]
---

## Context

plan-049's step 2 (ruling 4: the tooling half of the fix of bug-005 and bug-006, through
`tooling-delivery`). Neither defect of `base` 1.0.0 is seen by this repository's checks: the
matrix runs `workflow list`, `dna show` and `directives list` (`pack-compatibility`, `COMMANDS`
in `src/matrix.ts`), which load the composed configuration but drive no workflow, and `npm test`
runs WingFoil's stub. Both defects appear only when WingFoil 0.3.0 runs a workflow:
- bug-005: `workflow start <main>` on `base`'s defaults exits 1, the instance's plan left `draft`
  with `workflow` and `phase` empty;
- bug-006: `retrospective` › `explore` is never complete when `retrospective_path` names a
  directory without a trailing slash, and `governance-evolution` › `apply` never is (`.wingfoil`),
  so `workflow end` refuses.

This task adds a scripted run that drives them, as plan-049's reproductions did by hand. It is
written red against `base` 1.0.0's content and turns green with task-054's fixes; it stays as a
regression check on every push. It changes no file under `packs/`, no matrix command, and not
`pack-compatibility`: the run is its own check beside the matrix.

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **A command.** A new npm script (its name fixed at Design, e.g. `check:runs`) runs, for each
   composition it is given, a scenario on the newest WingFoil release the composition's matrix
   selects (0.3.0 today), installed and cached as the matrix installs it (`.cache/wingfoil-matrix`,
   the pinned lockfile; never the repository's own `wingfoil` 0.2.2). It takes `--tree <dir>`
   (default: this repository), as `index` and `validate` do, so that it runs against another
   checkout's tree. By default it runs the README examples of `base`
   (`tests/fixtures/examples/base/*`; `core-records` is `base` on its defaults, so no separate
   defaults run). Each composition is composed from the tree and committed in a scratch
   repository of its own per `main` started (or one per composition with every instance named
   by its id: the Design chooses). Exit 0 when every scenario passes, 1 when one fails (each
   failure printed with the composition, the step, the command, its exit code and its output),
   2 on an I/O error (an install that fails, a missing release), 3 on bad usage, as the
   repository's other commands.
2. **The scenario** (`base`'s workflows, as plan-049's reproductions):
   - every `main` of `base` (`decision-log-ingest`, `governance-evolution`,
     `retrospective-periodic`) is started with `workflow start`: exit 0, and the instance's plan
     is `active` with `workflow` and `phase` non-empty;
   - in `retrospective-periodic`, a file committed inside the composition's `retrospective_path`
     (`<the path without its trailing slash>/<file>`; a composition whose value is a fixed file
     says so in the scenario's data, and none does today) makes `retrospective.explore`
     complete: `workflow next` names `retrospective.additional-points`;
   - `governance-evolution` is run to its end: `assess` finalized, a decision-log added under
     `propose`, submitted and approved by the approver (and the approver's
     `workflow finalize --reason` of `approve` if the deduction asks for a record), an
     `AGENTS.md` committed (the composer writes the region only), then `workflow end` exits 0.
     Since `.wingfoil/` always holds files, `apply` turning complete shows only that its
     `produces` is read as a directory (the weak evidence bug-006 records).
   A failed step stops that `main`'s scenario and the run goes on with the next one, so that one
   run reports every failure. The scratch repository's identities are set in its own git
   configuration, never taken from the environment (the matrix clears the global configuration
   and every `GIT_*`; task-045): a fixed fictional agent identity for every command, switched to
   the composition's `approver_email` for `memory approve` and an approval's finalize, then back.
   Their commits and approvals there are fixture data, not a governance act of this repository.
   The scenario is data the Design fixes (a file beside the command or in `tests/fixtures/`), so
   a later pack adds its own.
3. **CI.** A step in `.github/workflows/ci.yml` runs the command on every branch push (self-test
   mode, not on tags), after the overlay step, with no `continue-on-error`;
   `tests/ci-workflow.test.ts` asserts it, its self-test-versus-tag assertion included.
4. **Unit tests** of the command's logic (arguments, `--tree`, the scenario's reading, the
   report, the exit codes 0 to 3) under `npm test`, with a fake runner or WingFoil's stub, never
   the real release.
5. **Red first** (dl-018 R1–R3), the red runs recorded in the Execution Notes: the unit tests red
   before the code; then the command, on this branch with `base` 1.0.0's content, fails as
   follows, and in no other way:
   - `core-records` (the defaults): each of the three starts exits 1, its plan left `draft` with
     `workflow` and `phase` empty (bug-005);
   - `release-folders`: `explore` incomplete (`docs/09_retrospectives`) and `apply` incomplete,
     `workflow end` refused (`.wingfoil`) (bug-006);
   - `release-folders-lean`: `explore` incomplete (the default `docs/retrospectives`) and `apply`
     incomplete (bug-006);
   - if the Design adds it, `sw-life-cycle`'s start on `software-exit`'s `defaults` exits 1
     (bug-005).
   The branch's CI is red by design on this step while `main` holds 1.0.0's content.
6. **Green:** after task-054's merge, `main` is merged into this branch; the command exits 0 on
   every composition; from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`,
   `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`,
   `validate -- --overlay tests/fixtures/software-exit` (7 runs, 0 failed), the golden step,
   `workflow list` and the new command exit 0; the branch CI `success`, recorded; only then
   `in-review`. In the task's own diff against `main`, no file under `packs/` and not
   `src/matrix.ts`'s `COMMANDS`.
7. **WIP** (`tooling-delivery`): `in-progress` only once plan-048's task-051 has left
   `in-progress`, and not `in-review` while task-051 is; task-053 then holds the tooling
   `in-progress` place until task-054's merge lets it reach `in-review`, which the other
   session is told.

Optional, the Design decides: a start of `sw-life-cycle` on the overlay `software-exit`'s
`defaults` composition, so that `software`'s first release (W9) inherits the check.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->

- 2026-10-26: independent review: approve after amendments, two blocking findings in task-053's
  Acceptance (the inventory's file committed inside the path, not at it, or `explore` reads as
  complete on 1.0.0; the expected red listed per composition), with the non-blocking ones applied
  to both bodies. Re-review: approve; its three wording points applied.
