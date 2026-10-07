---
id: task-008-determinism-check-and-the-one-validation-command
type: task
title: "Determinism check and the one validation command"
status: pending
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-007-composer-output-assets-workflows.yaml-agents-region-compose-command"]
tags: ["tooling","W5","F3.1","F3.4"]
---

## Context

Task 7 of plan-015 (`sw-life-cycle` › `tooling`, wave W5, F3.4 and F3.1). Tooling task, no pack.
It closes wave W5, whose exit criterion is "a fixture pack composes twice into byte-identical
files, through one command" (`07_sequencer.md`).

It comes from:
- **F3.4 and the `pack-compatibility` directive:** "compose twice from a clean state: the two
  outputs must be byte-identical"; the `determinism` directive (no clock, randomness or filesystem
  order) and the `dna.yaml` north star;
- **F3.1:** one validation command, run locally and in CI, that runs the schema checks, the
  composition, the compatibility matrix and the determinism check in one pass. The matrix is task 8
  (W6): this task builds the command with the other three and a place for the matrix;
- **spec-001 §15:** every preset is part of the validation of the packs it contains; a preset sets
  only generic values, so the values a required parameter needs (a project name) are given to the
  command;
- **spec-001 §13:** the determinism check compares composed trees; it is recorded in
  `pack-release` (task 11), not in the catalog.

Scope: the determinism check, the `validate` command over a tree (the repository by default), and a
preset in the golden tree. Not in scope: running WingFoil (the matrix, task 8), the lint rules
(task 9), CI (task 10), release evidence (task 11).

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins` and
   `npm run check:schemas` exit 0; no dependency is added.
2. **Determinism check:** a composition is made twice, each in its own child process from a clean
   output directory, the second with a different `TZ`, `LC_ALL` and working directory; the two trees
   are compared byte for byte, file list included. Tests of the comparison: equal trees pass; a
   differing byte, a missing file and an extra file each fail, naming the path.
3. **`npm run validate -- [--tree <dir>] [--param <name>=<value>]… [<entry>…]`**, in one pass:
   - the schema checks of the tree's files (task-002);
   - every preset of the tree (`presets/*.yaml`: its `packs` and `parameters`, then the `--param`
     values), and the composition given by `<entry>…` if any, each composed and checked for
     determinism;
   - a report: one line per step and per composition, with its result and the number of files
     composed; a closing line names the matrix as not yet part of the command (task 8).

   Exit 0 when every step passes; 1 when a check fails (schema, composition, determinism); 2 on an
   I/O error; 3 on bad usage.
4. **W5 exit criterion:** the golden tree gains a preset; `npm run validate -- --tree
   tests/fixtures/compose/tree --param project_name=Golden` exits 0, reporting the preset composed
   twice into byte-identical files; with the golden entries as well, both compositions are reported.
5. **On this repository:** `npm run validate` exits 0: one file schema-checked (`catalog.yaml`), no
   preset, no composition.
6. **Failure paths,** each with a test: a schema error in the tree, a composition error, a preset
   whose packs do not resolve, and a determinism mismatch (through the comparison's tests) give
   exit 1 and name what failed; unknown options give exit 3.
7. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
