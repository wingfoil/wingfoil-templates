---
id: task-008-determinism-check-and-the-one-validation-command
type: task
title: "Determinism check and the one validation command"
status: backlog
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
- **spec-001 §15:** "every preset is part of the compatibility matrix of every pack it contains";
  a preset sets only generic values, so the values a required parameter needs (a project name) are
  given to the command;
- **spec-001 §13:** the determinism check compares composed trees; it is recorded in
  `pack-release` (task 11), not in the catalog.

Scope: the determinism check, the `validate` command over a tree (the working directory by
default, as `check:schemas`), and a preset in the golden tree. `validate` produces no `pack-release`
evidence: dl-009 allows evidence only from the matrix's publication mode, written by task 11, which
reads this command's report; its lines are kept stable for that. Not in scope: running WingFoil (the
matrix and its modes, task 8), the lint rules (task 9; among them, a preset's `id` equal to its
file name), CI (task 10), release evidence (task 11).

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins` and
   `npm run check:schemas` exit 0; no dependency is added.
2. **Determinism check:** a composition is made twice, one run after the other, each in its own
   child process from a clean output directory. The second run differs in `TZ`, `LC_ALL`, `HOME`,
   `umask`, working directory and the output path (given relative in one run, absolute in the
   other), so that a leaked clock, locale, home or path shows. The two trees are compared byte for
   byte, file list included; modes are not compared, since they follow the umask. Tests of the
   comparison: equal trees pass; a differing byte, a missing file and an extra file each fail,
   naming the path.
3. **`npm run validate -- [--tree <dir>] [--param <name>=<value>]… [<entry>…]`**, in one pass:
   - the schema checks of the tree's files (task-002); a preset that fails them is not composed;
   - every preset of the tree (`presets/*.yaml`: its `packs` and typed `parameters`), and the
     composition given by `<entry>…` if any, each composed and checked for determinism;
   - `--param` values are text, read by each parameter's declared type; a composition takes only
     the `--param` names its packs declare; a `--param` that no composition declares, or that names
     a parameter a preset sets, fails (exit 1);
   - a report: one line per step and per composition, with its result and the number of files
     composed; a closing line names the matrix as not yet part of the command (task 8).

   Exit 0 when every step passes; otherwise the highest code reached, as `check:schemas`: 1 when a
   check fails (schema, composition, determinism), 2 on an I/O error, 3 on bad usage. The codes are
   those of `compose` and `digest`.
4. **W5 exit criterion:** the golden tree gains a preset that sets an integer parameter, listed in
   its `catalog.yaml` `presets[]`; `npm run validate -- --tree tests/fixtures/compose/tree --param
   project_name=Golden` exits 0, reporting the preset composed twice into byte-identical files; with
   the golden entries as well, both compositions are reported.
5. **On this repository:** `npm run validate` exits 0 and reports one file schema-checked
   (`catalog.yaml`) and 0 compositions, so the run cannot be read as evidence of a composition.
6. **Failure paths,** each with a test through `validate`: a schema error in the tree, a composition
   error, a preset whose packs do not resolve, a determinism mismatch (the comparison is injectable,
   so a mismatch is shown to reach the report and the exit code), a `--param` no composition
   declares, a `--param` overriding a preset's value: exit 1, naming what failed; unknown options:
   exit 3.
7. `npm audit` reports 0 vulnerabilities.

## Design

Branch `task/task-008-validate`, run through `tooling-delivery` as `developer` (`code-quality`,
`testing`, `determinism`), under `npm run lint`.

- **`src/compare-trees.ts`:** `listTree(dir)` (relative paths in byte order) and
  `compareTrees(a, b)`, which returns one message per difference: bytes, only in the first, only in
  the second.
- **`src/determinism.ts`:** `composeTwice(request, compare)` runs the compose command of task-007 in
  two sequential child processes through a small runner (`node -e`) that sets the umask and calls
  `runCompose`; the first with the caller's environment, the second with `TZ`, `LC_ALL`, `HOME`,
  `umask`, working directory and a relative output path changed. Each output goes into its own
  fresh temporary directory, removed afterwards.
- **`src/validate.ts`:** `runValidate(argv, options)`: schema checks; then the compositions (each
  preset passing its schema, then the entries), each resolved first to know which `--param` names
  it declares; preset values passed as text, as `--param` values are, and read back by declared type;
  then `composeTwice`. A report line per step; the exit code is the highest reached.
  `options.compare` replaces the tree comparison in tests.
- **`src/validate-cli.ts`:** `npm run validate`.
- **Golden tree:** `presets/golden.yaml` (the golden packs with ranges, `wip_limit: 2`) and its
  `catalog.yaml` `presets[]` entry.
- **Tests,** red first: `tests/compare-trees.test.ts`, `tests/validate.test.ts`.

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review:
  `--param` scoped per composition and never overriding a preset; text versus typed values; the
  environments varied between the two runs, modes excluded; the highest exit code; a mismatch shown
  through `validate`; the §15 quote; the preset listed in the golden catalog; "0 compositions" on
  the repository; no evidence from `validate`.
