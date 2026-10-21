---
id: task-039-the-base-pack-s-exit-criterion-readme-examples-for-every-governed-project-s-parameters-and-the-private-projects-check-plan-043
type: task
title: "The base pack's exit criterion: README examples for every governed project's parameters, and the private projects' check (plan-043)"
status: in-progress
pack: "pack-foundation-base"
depends_on: ["task-038-the-base-pack-s-other-workflows-and-its-agents.md-section-decision-log-ingest-retrospective-retrospective-periodic-plan-043"]
tags: ["packs","base","W8"]
---

## Context

The last of plan-043's three tasks: `base`'s exit criterion (dl-022 S6, the charter's Acceptance),
through the README's examples (plan-043 ruling 3, P): every governed project's parameters compose
and validate on WingFoil 0.3.0 with no warning, by `npm run validate` and the CI on every push; the
three private, non-software projects are checked outside this repository, their outcome recorded
alone.

**The parameter sets**, read from the public repositories (`wingfoil/wingfoil@19a66000`,
`wingfoil/wingfoil-ui@6a5ad5c7`, `wingfoil/wingfoil-benchmark@190847c7`, this repository at
`d9e5fbf2`) for the parameters `base` declares:
- **the defaults** (`docs/memory/decision-log/{id}.md`, `docs/memory/task/{id}.md`,
  `docs/plans/{id}.md`, `plan-{n}-{slug}`, `docs/retrospectives`): this repository uses them,
  and WingFoil-Benchmark too, with no retrospective folder;
- **release folders** (`docs/04_memory/design/dls/{id}.md`, `docs/04_memory/{release}/{id}.md`,
  `docs/05_plans/{scope}/{id}.md`, `{workflow}-{phase}-plan`, `docs/09_retrospectives`): WingFoil;
- **release folders without a retrospective folder**: WingFoil-UI, as WingFoil's with the default
  `retrospective_path`.

plan-043 lists five examples (a generic non-software project and one per public repository);
Benchmark's and this repository's sets equal the defaults, and UI's differs from WingFoil's only by
the retrospective folder, so three examples, one per distinct set, carry the four public
repositories and the generic non-software project; the approver confirms this at the backlog
acceptance. The Execution Notes record which public repository each example matches. Every example
names a fictional project (spec-002 §2.4, `pack-authoring`) and fictional approver and agent
identities (`*.example` addresses, which WingFoil 0.3.0 accepts for a member, task-037).

Three examples change what `npm run validate` does on this repository: 3 compositions, 3 matrix
runs instead of 0, and 3 more files for the lint (20 → 23); a publication run of this repository
now composes them and passes, so at W9's tag `validate:publication` really runs `base`. The tests
that assert this repository's counts move under dl-018 R1–R3.

**`--param` and the examples.** `npm run validate` refuses a `--param` that a composition's preset
already sets (`runOne`, `src/validate.ts`), and all three examples set the four identity
parameters: from this task on, `validate -- base --param …` on this repository exits 1, so a check
with other values runs on a scratch tree outside it (criterion 5).

## Acceptance

1. **Three examples**, each `tests/fixtures/examples/base/<example>/example.yaml` in the preset
   format (spec-001 §15): `format: 1`, `id` equal to its directory, `title`, `description` naming
   a fictional project, `packs: [base@^1]`, `parameters` with `project_name`, `approver_name`,
   `approver_email` (`*.example`), `agent_name`, and the set's path and id values:
   - a fictional non-software project on the defaults (only the four identity parameters set);
   - a fictional software project keeping its records in release folders (WingFoil's set: the four
     path and id parameters and `retrospective_path`);
   - a fictional software project with release folders and no retrospective folder (UI's set: the
     four path and id parameters, `retrospective_path` left unset).
   The two release-folder examples show `base`'s parameters alone: a task's `release` value is
   given when the task is added, nothing in `base` fills it; their README paragraphs run a phase
   that needs no task (`decision-log-ingest` or `governance-evolution`).
2. **README section 7**: the exemption line replaced by one `### <example>` per fixture, each
   followed by `Fixture: tests/fixtures/examples/base/<example>/` and a paragraph: the fictional
   situation, the parameters it sets, what the project gets, how one phase runs (spec-002 §2.4).
   Each example and its README entry land in the same commit (CB-2).
3. **The tests** that assert this repository's validation counts follow, red first (dl-018 R1):
   `tests/validate.test.ts` ("validates this repository": compositions 3, matrix `3 runs`, lint 23;
   "fails a publication run of this repository": now a publication run that composes the three
   examples and passes, 3 runs) and `tests/check-packs.test.ts` (lint 23); their titles say what
   they count.
4. **`npm run validate`** on this repository, after `npm run build`, exits 0: 3 compositions (no
   ±software legs: `base` has no conditional part), the three examples composed twice
   byte-identical and run on WingFoil 0.3.0 alone, `matrix: self-test, 3 runs,
   0 failed, tolerance applied: none`; recorded in the Execution Notes. The CI's
   "Validate this repository" step runs the same on every push.
5. **The private projects' check**, run by claude outside this repository: for each of the three
   private, non-software projects, a scratch tree outside the repository holding `packs/base`,
   `catalog.yaml`, `compat.yaml` and one preset with that project's current path and id values
   (read from its own configuration) and fictional identities, validated with
   `npm run validate -- --tree <scratch>` on WingFoil 0.3.0; the scratch tree and its outputs are
   removed afterwards. The
   Execution Notes record only: the date, `base`'s commit, the WingFoil version, the number of
   projects (3), the command with its values redacted, each exit code and the warning count; no
   name, path or value. A failure goes to the approver (dl-019).
6. **The mapping**: the Execution Notes record which public repository each example's set matches
   (WingFoil, UI, Benchmark, this repository), and that WingFoil's inventory, a per-release file
   with typed tokens, is reduced to its directory. Nothing about the private projects but criterion
   5's outcome fields.
7. **The charter** `pack-foundation-base`: an Execution Note recording the exit criterion met, with
   the commit and the CI run.
8. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm test`, `npm run lint`,
   `npm run check:pins`, `npm run check:schemas`, `npm run check:packs`,
   `npm run index -- --check`, `npm run validate` exit 0; the CI run on the pushed branch concludes
   `success`. Privacy: no local path, no private project's name or value, no real name, no address
   but `*.example` in the diff.

## Design

Written 2026-10-21, before the build. Branch `task/task-039-base-examples` from `main`.

1. **Red** (dl-018 R1), tests only: `tests/validate.test.ts` ("validates this repository": its
   three examples, 3 compositions, `3 runs`, lint 23; the publication run of this repository
   composes them and passes, `3 runs`) and `tests/check-packs.test.ts` (lint 23), with titles that
   say what they count; red until the examples exist.
2. **Green:** `tests/fixtures/examples/base/{core-records,release-folders,release-folders-lean}/
   example.yaml` and README section 7 in one commit (CB-2): a fictional non-software project on
   the defaults; a fictional software project on release folders with a retrospective folder; one
   without it. Identities `*.example`; values as the Context's sets.
3. **The evidence:** `npm run validate` on this repository with WingFoil 0.3.0 (3 runs, no
   warning); the private check on a scratch tree outside the repository, outcome fields only.
4. **The charter's and this task's notes:** the mapping, the outcome, the exit criterion met.


## Execution Notes
- 2026-10-21: independent review of the body: approve after amendments. Applied: the private check
  on a scratch tree (a `--param` cannot override an example's value); the publication test that
  now passes; nothing recorded about the private projects' values; Benchmark's retrospective
  folder; the release-folder examples show `base` alone; three examples for five, to be confirmed
  by the approver at the backlog acceptance.
- 2026-10-21, build on `task/task-039-base-examples`:
  - red (`a75b41d`): three failing: `tests/check-packs.test.ts` (lint, 23 files) and
    `tests/validate.test.ts` (3 compositions, `3 runs`; a publication run of this repository that
    composes the examples and passes); green with `6c68f08` (the three examples and README section
    7, one commit, CB-2): `tests/check-packs.test.ts` 94 of 94, and the two "this repository"
    tests of `tests/validate.test.ts` 2 of 2.
  - criterion 4, WingFoil 0.3.0 for real: `npm run validate` exit 0, the three examples
    `composed twice, 16 files, byte-identical`, `compositions: 3`, every matrix line
    `pass (self-test)`, `matrix: self-test, 3 runs, 0 failed, tolerance applied: none`;
    `npm run validate:publication` exit 0, `matrix: publication, 3 runs, 0 failed, tolerance
    applied: none`.
  - criterion 5, the private projects' check, 2026-10-21, `base` at `6c68f08`, WingFoil 0.3.0:
    3 projects, each on a scratch tree outside this repository (`packs/base`, `catalog.yaml`,
    `compat.yaml` and the index outputs; README section 7 reduced to the exemption line, since the
    scratch holds no example), `npm run validate -- --tree <scratch> base --param …` with the
    project's path and id values (redacted; given as `--param` rather than a preset file, the same
    composition) and fictional identities: 3 of 3 exit 0, each
    `matrix: self-test, 1 run, 0 failed, tolerance applied: none`, 0 warnings. A first run exited 1
    on the scratch tree alone (its index outputs were missing), not on the projects. The scratch
    trees and logs were removed.
  - criterion 6, the mapping: `core-records` carries the defaults, those of this repository and of
    WingFoil-Benchmark (which has no retrospective folder); `release-folders` carries WingFoil's
    set, its inventory (a per-release file with typed tokens) reduced to its directory;
    `release-folders-lean` carries WingFoil-UI's.
  - privacy: no local path, private name or value, real name, or address but `*.example` in the
    diff.
- 2026-10-21: independent review of the branch: approve after amendments, nothing blocking.
  Applied: the lean example runs `decision-log-ingest` (its retrospective would write under the
  default folder) and states its composition; the release-folder examples say what the project
  gets; the scratch check's `--param` noted; the test counts named per file; a fictional name no
  longer shared with another fixture; a long line.
- 2026-10-21: CI run 39628882756 on `ccb32f9`: `failure`, one test. `tests/evidence.test.ts`'s
  "writes no evidence for a publication run that fails" used this repository as a publication that
  fails; with `base`'s examples it passes. The build missed it by running only the two changed test
  files, not the whole suite. The test now runs on a fixture tree whose `compat.yaml` lists no
  compatible release; its assertions are unchanged (exit 1, no `## Validation`, `no evidence` on
  stderr). Not red first: the test was already red in CI, and its premise, not its claim, changed
  (dl-018 R3). The whole suite: 937 of 937.
