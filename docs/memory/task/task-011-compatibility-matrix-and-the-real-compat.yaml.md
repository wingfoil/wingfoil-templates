---
id: task-011-compatibility-matrix-and-the-real-compat.yaml
type: task
title: "Compatibility matrix and the real compat.yaml"
status: in-progress
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-008-determinism-check-and-the-one-validation-command"]
tags: ["tooling","W6","F3.3"]
---

## Context

Task 8 of plan-015 (`sw-life-cycle` › `tooling`, wave W6, F3.3). Tooling task, no pack. It opens
wave W6, whose exit criterion is "a fixture validates against pinned WingFoil releases, in CI"
(`07_sequencer.md`); CI is plan-015 task 10. Below, "plan-015 task N" names a step of that plan,
not a Memory element.

It comes from:
- **F3.3 and the `pack-compatibility` directive:** each composition is validated with the oldest
  and the newest compatible WingFoil release, each installed pinned and in isolation; validation
  means `workflow list`, `dna show` and `directives list`, with exit 0 and no warning;
- **dl-009, option (c):** the matrix has a publication mode and a self-test mode, fixed by the
  caller, never by the data. Only self-test mode may run a release that `compat.yaml` marks
  `format_key: false`, and then tolerates exactly the lines
  `Warning: <file>: unknown field(s) ignored: format` whose `<file>` resolves inside the composed
  `.wingfoil/`; its output says that the tolerance was applied and for which release. Publication
  mode fails on an empty compatible set: "a publication run that runs nothing is not a pass";
- **dl-010, option (a):** the real `compat.yaml` is written by this task: `format: 1`, the seven
  kinds, the capability vocabulary of spec-001 §12, and one release, 0.2.2, with
  `format_key: false`. Fixtures carry their own compat files under `tests/fixtures/`;
- **spec-001 §12:** compatibility of a pack version with a release (four conditions), on which the
  matrix's release selection rests;
- **the `determinism` directive:** every tool used in validation is pinned to an exact version.
  WingFoil 0.2.2 declares caret ranges for its own dependencies, so an exact `wingfoil@<version>`
  alone does not pin the install: each release gets a committed lockfile;
- **F3.1 and task-008:** the matrix joins `npm run validate`, which already composes every preset
  of the tree and the given entries; its report lines stay stable, since the `pack-release`
  evidence of plan-015 task 11 reads them;
- **`wingfoil-cli` W-01, W-10 and W-12:** the `format` warning of 0.2.2; WingFoil runs only at the
  root of a git repository; the rules of the files WingFoil reads live only in its loaders, so the
  matrix runs the real CLI. WingFoil 0.2.2 prints `<file>` as an absolute path.

Scope: the real `compat.yaml` and the fixture's; the release selection; the pinned, isolated
install of each selected release; the three commands on each composition; the two modes and the
tolerance; the matrix inside `validate`. Not in scope: the lint rules of spec-001 §18 (plan-015
task 9), except the two compat checks the selection needs (acceptance 2), which task 9 reuses; CI
and which mode each CI trigger runs (plan-015 task 10); the `pack-release` evidence writer, which
refuses self-test results (plan-015 task 11); an unreleased WingFoil build (dl-009 option (a), not
chosen). WingFoil 0.2.1 is on npm but is not added: `compat.yaml` starts from 0.2.2, as dl-010
rules, and later releases arrive through `wingfoil-release-intake`, which from now on also commits
the release's lockfile (acceptance 4).

Configuration follow-ups, applied through their own element after this task: `wingfoil-cli` W-12
names the matrix's releases (each pinned by its own lockfile) rather than the governance pin; the
`record` phase of `wingfoil-release-intake` adds the release's lockfile.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins` and
   `npm run check:schemas` exit 0; no runtime dependency is added. `npm test` needs no network and
   never installs a release.
2. **`compat.yaml`** at the repository root is the example of spec-001 §12, the `notes` line
   included; `tests/fixtures/compose/tree/compat.yaml` is identical to it. `check:schemas` checks
   both against `schema/compat.schema.json`. Beyond the schema, the compat loader refuses releases
   out of ascending order or repeated, and a release capability outside `capabilities` (spec-001
   §18), reusing `src/range.ts`; each with a test (exit 1, naming the entry). A tree that has
   compositions and no `compat.yaml` fails (exit 1).
3. **Release selection,** for one composition, from the tree's `compat.yaml`: the releases that
   satisfy spec-001 §12 for every resolved pack of the composition (`base` and every `requires`
   included).
   - Publication mode applies all four conditions of §12, `format_key: true` included.
   - Self-test mode applies the other three, so it may also select a release marked
     `format_key: false`.
   - Of the selected releases the matrix runs the oldest and the newest, once if they are the same.
   - An empty selection fails (exit 1) in both modes, reported as `no compatible release`.
   - Tests on stub data: three releases with a gap, only one compatible, none compatible, one
     marked `format_key: false` in each mode.
4. **Pinned, isolated install:** each release has a committed `package.json` and
   `package-lock.json` under `src/matrix/wingfoil-<version>/`, with `wingfoil` at exactly that
   version; `check:pins` checks them as it checks the root manifest. A selected release is
   installed with `npm ci --ignore-scripts` from that lockfile into its own directory of a cache
   outside the tree: `.cache/wingfoil-matrix/<version>/` by default (ignored by git), or the
   directory given by `--cache <dir>`, relative to the working directory. A cached install is
   reused only when its lockfile is unchanged and the installed CLI's `--version` equals the
   release. The repository's root `package.json`, `package-lock.json` and `node_modules/` are not
   changed, and the governance pin `wingfoil` (devDependency) is never used by the matrix. A
   `--version` mismatch fails the run (exit 1); a release with no committed lockfile, or an install
   that cannot complete, is an I/O error (exit 2), never a pass.
5. **The run:** each composition's `.wingfoil/` is copied into a scratch directory made with
   `mkdtemp` under the operating system's temporary directory, never inside the tree; the scratch
   directory is the root of a fresh git repository (W-10) and is removed afterwards. `workflow
   list`, `dna show` and `directives list` run there with the installed CLI. A command passes when
   it exits 0, prints nothing on stderr and no stdout line starts with `Warning:`. In self-test
   mode, for a release marked `format_key: false`, the tolerated lines of dl-009 are removed from
   stderr first and counted; `<file>` is compared after `realpath`. A line that lists `format`
   together with another field, a tolerated line whose `<file>` lies outside the composed
   `.wingfoil/`, any other stderr line and any non-zero exit fail. No report line contains a
   scratch path. A composition that fails composition or determinism is not run in the matrix; it
   is reported as `skipped`, and `validate` already exits 1 for it.
6. **Modes fixed by the caller:** `npm run validate` runs self-test mode;
   `npm run validate:publication` runs publication mode. Neither accepts an option that changes the
   mode (`npm run validate -- --mode publication` exits 3), and `compat.yaml` never selects it. In
   publication mode a run with no composition at all also fails (exit 1): this extends dl-009's
   empty compatible set to its stated reason, that a publication run that runs nothing is not a
   pass.
7. **Report,** with these exact forms, in a stable order (composition, then release ascending, then
   the three commands in the order above):
   - `matrix <composition> wingfoil@<version> <command>: pass (<mode>)`, with
     `, tolerated <n>` before the closing parenthesis when lines were tolerated, or
     `: fail (<mode>)` followed by the reason;
   - `matrix <composition>: no compatible release (<mode>)` or `matrix <composition>: skipped`;
   - closing line `matrix: <mode>, <r> runs, <f> failed, tolerance applied: <versions or none>`,
     replacing task-008's "matrix: not yet part of validate".

   `<composition>` is the preset path relative to the tree, or the given entries. The result object
   exposes the mode and whether any tolerance was applied, for plan-015 task 11.
8. **Stub CLI tests** (no network): the zero-warning path passes; each failure of acceptance 5
   fails, naming the composition, release and command; the tolerance is not applied to a release
   marked `format_key: true`, nor in publication mode; a `--version` mismatch fails; a missing
   lockfile and a failed install give exit 2.
9. **Real runs** (need the npm registry; the W6 exit criterion except CI):
   - `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden` exits 0,
     reports `schemas: checked 9 files, 0 problems`, and `presets/golden.yaml` runs against
     `wingfoil@0.2.2` in self-test mode, with the tolerance reported;
   - `npm run validate:publication -- --tree tests/fixtures/compose/tree --param
     project_name=Golden` exits 1, reporting `no compatible release`;
   - on this repository, `npm run validate` exits 0 and reports `schemas: checked 2 files,
     0 problems`, 0 compositions and 0 matrix runs; `npm run validate:publication` exits 1.
10. Exit codes as `compose`, `digest` and `validate`: 1 when a check fails, 2 on an I/O error, 3 on
    bad usage, each with a test.
11. `npm audit` reports 0 vulnerabilities, on the root lockfile and on each release lockfile.

## Design

Branch `task/task-011-matrix`, run through `tooling-delivery` as `developer` (`code-quality`,
`testing`, `determinism`), under `npm run lint`.

- **`compat.yaml`** (root) and **`tests/fixtures/compose/tree/compat.yaml`:** spec-001 §12's
  example, byte-identical; a test compares the two.
- **`src/compat.ts`:** `loadCompat(path)` returns the releases; beyond the schema it refuses a
  repeated or descending release (the check `range.ts` already makes, exported and shared) and a
  release capability outside `capabilities`, with a `CompatError` naming the entry.
- **`src/range.ts`:** `isCompatible(version, release, { formatKey })`: the four §12 conditions,
  the first only when `formatKey` is true (publication); `computeRange` keeps calling it with all
  four, so the computed range is unchanged.
- **`src/matrix.ts`:**
  - `selectReleases(packs, releases, mode)`: the releases compatible with every resolved pack's
    `formats` and `requires_capabilities`, in `compat.yaml` order; returns the oldest and the
    newest, one when they coincide, none when the set is empty;
  - `installRelease(version, { pins, cache })`: copies `src/matrix/wingfoil-<version>/package.json`
    and `package-lock.json` into `<cache>/<version>/`, runs `npm ci --ignore-scripts --no-audit
    --no-fund` there, and writes the lockfile's sha256 beside it; a cached install whose sha256
    matches is reused. Returns the CLI entry, read from the installed `wingfoil` package's `bin`,
    run with `process.execPath`. Then `--version` is checked against the release;
  - `runRelease(cli, composed, release, mode)`: `mkdtemp` under `os.tmpdir()`, copy of the
    composed `.wingfoil/`, `git init -q` with `gitEnvironment()` of `src/git.ts`, then the three
    commands in order with `spawnSync` (argument list, no shell, a timeout); the scratch directory
    is removed in `finally`;
  - `judge(stdout, stderr, status, tolerate, wingfoilDir)`: drops the tolerated lines (exact
    pattern, `<file>` after `realpath` inside the scratch `.wingfoil/`) only when `tolerate`, then
    fails on any stderr line, any stdout line starting with `Warning:` and a non-zero exit. Paths
    in a failure reason are shown relative to the scratch root, never absolute;
  - `MatrixOptions`: `install` and `exec` can be replaced, so that tests run a stub CLI and never
    reach the network.
- **`src/determinism.ts`:** `composeTwice` gains an optional `use(composed)` callback, called on
  the first output before the temporary directory is removed, so that the matrix runs on the
  composition the determinism check already made, and a composition that failed is never run
  (reported `skipped`).
- **`src/validate.ts`:** `runValidate(argv, { mode, ... })`: the mode comes from the options, never
  from `argv`; `--cache <dir>` is added; with compositions, `compat.yaml` is loaded (missing: exit
  1); the matrix lines and the closing line of acceptance 7 replace the task-008 placeholder. In
  publication mode, no composition is a failure. The result gains `mode` and `tolerated`
  (the versions for which the tolerance was applied).
- **`src/validate-cli.ts`** (`npm run validate`, self-test) and **`src/validate-publication-cli.ts`**
  (`npm run validate:publication`): each fixes its mode; `--mode` is an unknown option (exit 3).
- **`src/check-pins.ts`:** also checks every `src/matrix/wingfoil-*/` manifest and lockfile; each
  must pin `wingfoil` to the version in its folder name.
- **`src/matrix/wingfoil-0.2.2/`:** `package.json` (private, `wingfoil: 0.2.2`) and its
  `package-lock.json`, made once with `npm install --package-lock-only --ignore-scripts`.
- **Tests,** red first: `tests/compat.test.ts`, `tests/matrix.test.ts` (stub CLI written to a
  temporary directory, its behaviour chosen per case: clean, tolerated lines, a line with
  `format` and another field, a file outside `.wingfoil/`, another warning, a stdout warning, a
  non-zero exit, a wrong `--version`; a failing installer for exit 2), additions to
  `tests/range.test.ts`, `tests/validate.test.ts` and `tests/check-pins.test.ts`. The real runs of
  acceptance 9 are run by hand and recorded in the Execution Notes, since they need the registry.

## Execution Notes

- 2026-10-09: amended while `pending`, before the approver's review, after an independent review
  (a subagent with its own context): the fixture tree gains its own `compat.yaml`; each release is
  installed from a committed lockfile, since 0.2.2's own dependencies use caret ranges; "plan-015
  task N" spelled out; the compat checks reduced to the two the selection needs, reusing
  `range.ts`, the unreachable `reads` check dropped; resolved packs, and an empty selection failing
  in both modes; the scratch directory, `realpath` and stdout warnings; network needs and the cache
  option; the configuration follow-ups for `wingfoil-cli` W-12 and `wingfoil-release-intake`; the
  exact report lines; a run with no composition in publication mode named as an extension of
  dl-009; skipped compositions.
