---
id: task-011-compatibility-matrix-and-the-real-compat.yaml
type: task
title: "Compatibility matrix and the real compat.yaml"
status: pending
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-008-determinism-check-and-the-one-validation-command"]
tags: ["tooling","W6","F3.3"]
---

## Context

Task 8 of plan-015 (`sw-life-cycle` › `tooling`, wave W6, F3.3). Tooling task, no pack. It opens
wave W6, whose exit criterion is "a fixture validates against pinned WingFoil releases, in CI"
(`07_sequencer.md`); CI is task 10.

It comes from:
- **F3.3 and the `pack-compatibility` directive:** each composition is validated with the oldest
  and the newest compatible WingFoil release, each installed pinned and in isolation; validation
  means `workflow list`, `dna show` and `directives list`, with exit 0 and no warning;
- **dl-009, option (c):** the matrix has a publication mode and a self-test mode, fixed by the
  caller, never by the data. Only self-test mode may run a release that `compat.yaml` marks
  `format_key: false`, and then tolerates exactly the lines
  `Warning: <file>: unknown field(s) ignored: format` whose `<file>` resolves inside the composed
  `.wingfoil/`; its output says that the tolerance was applied and for which release. Publication
  mode fails on an empty compatible set;
- **dl-010, option (a):** the real `compat.yaml` is written by this task: `format: 1`, the seven
  kinds, the capability vocabulary of spec-001 §12, and one release, 0.2.2, with
  `format_key: false`;
- **spec-001 §12:** compatibility of a pack version with a release (four conditions), on which the
  matrix's release selection rests;
- **F3.1 and task-008:** the matrix joins `npm run validate`, which already composes every preset
  of the tree and the given entries; its report lines stay stable, since the release evidence of
  task 11 reads them;
- **`wingfoil-cli` W-10 and W-12:** WingFoil runs only at the root of a git repository, and the
  rules of the files WingFoil reads live only in its loaders, so the matrix runs the real CLI.

Scope: the real `compat.yaml`; the release selection; the pinned, isolated install of each selected
release; the three commands on each composition; the two modes and the tolerance; the matrix inside
`validate`. Not in scope: the lint rules (task 9), CI and the choice of which mode each CI trigger
runs (task 10), the `pack-release` evidence writer, which refuses self-test results (task 11), an
unreleased WingFoil build (dl-009 option (a), not chosen). WingFoil 0.2.1 is on npm but is not
added: `compat.yaml` starts from 0.2.2, as dl-010 rules, and later releases arrive through
`wingfoil-release-intake`.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins` and
   `npm run check:schemas` exit 0; no runtime dependency is added.
2. **`compat.yaml`** at the repository root is the example of spec-001 §12, the `notes` line
   included. `check:schemas` checks it against `schema/compat.schema.json`; beyond the schema, the
   loader refuses releases out of ascending order, a `reads` kind not in `kinds` and a capability
   not in `capabilities`, each with a test (exit 1, naming the entry).
3. **Release selection,** for one composition, from the tree's `compat.yaml`: the releases that
   satisfy spec-001 §12 for every pack of the composition, and that read format 1 of the composed
   `workflows.yaml`.
   - Publication mode applies all four conditions of §12, `format_key: true` included.
   - Self-test mode applies the other three, so it may also select a release marked
     `format_key: false`.
   - Of the selected releases the matrix runs the oldest and the newest, once if they are the same.
   - Tests on stub data: three releases with a gap, only one compatible, none compatible, one
     marked `format_key: false` in each mode.
4. **Pinned, isolated install:** each selected release is installed as exactly `wingfoil@<version>`,
   with install scripts disabled, into its own directory under a cache outside the tree
   (`.cache/wingfoil-matrix/<version>/` by default, ignored by git). The repository's
   `package.json`, `package-lock.json` and `node_modules/` are not changed, and the governance pin
   `wingfoil` (devDependency) is never used by the matrix. Before a run, `--version` of the
   installed CLI must equal the release, otherwise the run fails. An install that cannot complete is
   an I/O error (exit 2), never a pass.
5. **The run:** each composition is copied into a scratch directory that is the root of a fresh git
   repository (W-10), and `workflow list`, `dna show` and `directives list` run there with the
   installed CLI. A command passes when it exits 0 and prints nothing on stderr; in self-test mode,
   for a release marked `format_key: false`, the tolerated lines of dl-009 are removed first and
   counted. A line that lists `format` together with another field, a tolerated line whose `<file>`
   lies outside the composed `.wingfoil/`, any other stderr line and any non-zero exit fail.
6. **Modes fixed by the caller:** `npm run validate` runs self-test mode;
   `npm run validate:publication` runs publication mode. Neither accepts an option that changes the
   mode, and `compat.yaml` never selects it. In publication mode an empty compatible set fails
   (exit 1), and so does a run with no composition at all, since a publication run that runs
   nothing is not a pass.
7. **Report:** one line per composition, release and command, with the mode, the result and, when
   the tolerance was applied, the release and the number of tolerated lines; the closing line of
   task-008 ("matrix: not yet part of validate") is replaced by a matrix summary line. The result
   object exposes the mode and whether any tolerance was applied, for task 11.
8. **Stub CLI tests** (no network): the zero-warning path passes; each failure of acceptance 5
   fails, naming the composition, release and command; the tolerance is not applied to a release
   marked `format_key: true`, nor in publication mode; a `--version` mismatch fails.
9. **Real run, W6 exit criterion except CI:**
   `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden` exits 0,
   with the golden compositions run against `wingfoil@0.2.2` in self-test mode and the tolerance
   reported. `npm run validate:publication -- --tree tests/fixtures/compose/tree --param
   project_name=Golden` exits 1, reporting an empty compatible set. On this repository,
   `npm run validate` exits 0, reports two files schema-checked (`catalog.yaml`, `compat.yaml`) and
   0 compositions.
10. Exit codes as `compose`, `digest` and `validate`: 1 when a check fails, 2 on an I/O error, 3 on
    bad usage, each with a test.
11. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
