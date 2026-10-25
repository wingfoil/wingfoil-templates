---
id: task-046-validate-overlay-this-tree-s-packs-composed-with-the-fixture-packs-and-compositions-of-a-directory-under-tests-fixtures-never-publishable-plan-046
type: task
title: "validate --overlay: this tree's packs composed with the fixture packs and compositions of a directory under tests/fixtures/, never publishable (plan-046)"
status: draft
pack: ""            # tooling task (pack-cycle › author, plan-046, ruling 1)
depends_on: []
tags: ["tooling","validate","software"]
---

## Context

plan-046's ruling 1 (the approver, 2026-10-24). `software` cannot be composed without a
methodology (spec-001 §3) and `packs/` holds none, so neither `software`'s smallest valid form
(task-047) nor its exit criterion (dl-022 S6, task-049) can be validated on WingFoil 0.3.0 by
`npm run validate` as it stands: it composes this tree's presets and README examples, and the
examples of `software` cannot live in this tree, where they would name a methodology it does not
hold (the charter's CB-2 exemption). `npm test` runs WingFoil's stub; the real 0.3.0 runs only in
`validate` and the CI. The methodology that validates `software` exists only as a test fixture,
never published (R-12, plan-041 ruling 12).

This task gives `validate` an option, `--overlay <dir>`, that composes this tree's packs together
with the packs and compositions of a directory under `tests/fixtures/`, and runs each composition
through the matrix as `validate` runs a preset. The overlay contributes packs to resolution and
compositions to the matrix, nothing else: the schema check, the tree-wide lint and the index run on
this tree alone, unchanged, so the CB-2 exemption of a README in this tree holds (spec-002 §2.4
speaks of "the tree"), and an overlay is never publishable. The word is the flag's alone,
unrelated to spec-001 §3's overlay axes (`team-mode`, `stage`) and to `src/overlay-rules.ts`.

No pack changes here: the overlay of `software` (its fixture methodology, its first composition and
the CI step) comes with task-047, when the pack exists. The tests use the golden tree
(`tests/fixtures/compose/tree`) and WingFoil's stub.

## Acceptance

Tests run by `npm test`; `npm run build` precedes the commands. "The overlay" is the directory
`--overlay` names. Every overlay file is named in report lines by its path relative to the tree
(for example `tests/fixtures/software-exit/compositions/defaults/example.yaml`), as examples are,
so that the evidence reader's patterns (`src/evidence.ts`) hold.

1. **The option.** `npm run validate -- [--tree <dir>] --overlay <dir> …` takes one overlay,
   relative to the tree or absolute. After resolving symlinks, it must lie under the tree's
   `tests/fixtures/` and outside `tests/fixtures/examples/` (which the tree's lint covers);
   otherwise, or when the option is given more than once, `validate` exits 3 with a usage line. A
   path that is not a directory exits 2 (`<dir>: not a directory`), as `--tree` does.
2. **The layout.** An overlay holds `packs/<pack path>/`, packs laid out as spec-001 §6.1 and
   §18's layout rules require of `packs/`, and `compositions/<id>/example.yaml`, each in the
   preset format (spec-001 §15, `schema/preset.schema.json`), its `id` equal to its directory's
   name, with no `profile`. They are not README examples (spec-002 §2.4 does not apply to them).
   Anything else at the overlay's top level, under `packs/` or under `compositions/` is reported
   (exit 1).
3. **Resolution.** A composition of the overlay, and its `[+software]`/`[-software]` legs,
   resolve their entries against this tree's packs and the overlay's together, with this tree's
   `catalog.yaml` and `compat.yaml`; positional entries given with `--overlay` resolve the same
   way. An overlay pack whose path this tree's `packs/` already holds is refused (exit 1, naming
   the path): an overlay never shadows a pack of the tree. The overlay's packs pass every check
   the composer applies to a pack it composes (`resolve`'s inventory, format, layout and README
   checks, the workflow rules, the merge). Every overlay pack is reached by at least one overlay
   composition; one that is not is reported (exit 1, naming it), so no overlay pack goes
   unchecked.
4. **Its own checks.** `validate` checks the overlay's files that the tree's checks do not see:
   each `pack.yaml` and `example.yaml` against its schema; each `example.yaml`'s `id` against its
   directory, and its values as the tree checks an example's (`presetChecks` and `yamlProblems`:
   a parameter its packs do not declare, a value of the wrong YAML type), against this tree's
   packs and the overlay's; and the secret rules (`src/secret-rules.ts`) over every overlay file.
   Their lines come after the `index:` line, one summary `overlay: checked <n> files, <m>
   problems` followed by one line per problem; a problem fails the run (exit 1, or 2 for an I/O
   error). A composition whose file fails one of these checks is not composed: its lines read
   `composition <label>: skipped, …` and `matrix <label>: skipped`, and the `--param` names stay
   unjudged, as for an example the lint reports.
5. **Compositions.** Each overlay composition is composed twice and compared (F3.4) and run
   through the matrix, after the tree's presets, examples and entries, in the byte order of its
   `<id>`, with the legs of a composition holding a conditional part as any composition has them
   (labels `<label>[+software]`, `<label>[-software]`, the `matrix <label>: skipped, no
   methodology` line kept). They count in `compositions: <n>`, and the names their packs declare
   count for `--param … no composition declares it`. `--param` applies to them as to an example:
   a value the composition sets fails that composition, as for a preset. An overlay with no
   composition is reported and fails the run (exit 1): an overlay that composes nothing is not a
   pass.
6. **The tree unchanged.** With `--overlay`, the tree's `schemas:`, lint and `index:` lines and
   its own compositions are those of the same run without it. A test holds it on a temporary tree
   derived from the golden tree: its methodology packs and the compositions naming them removed,
   its README's section 7 set to the exemption line (`EXEMPTION`, spec-002 §2.4), its index
   regenerated so that `index -- --check` passes; its overlay, built in the test's temporary
   directory, holds a methodology and a composition of the tree's `software` with it. The tree's
   lint reports no problem, and the overlay's composition runs on the stub.
7. **Never publishable.** `runValidate` refuses an overlay whenever its mode is `publication`,
   with its own line, `--overlay: an overlay is never publishable (plan-046 ruling 1)`, exit 3:
   so do `npm run validate:publication` (with or without `--evidence`) and `publish:pack`'s guard,
   whose arguments reach the same parse. `publish:pack`, `index` and `site` take no `--overlay`
   (their strict parsers refuse it, recorded as characterization tests, not red ones). No change to
   `src/publish.ts`, `src/index*.ts`, `src/catalog*.ts` or `src/site*.ts`.
8. **The composer's scope.** `composeTwice` and the composer read one tree (`--tree`), and
   `resolve`, `compose-documents`, `pack-files`, `layout-rules` and `readmeProblems` read files
   under it. The Design chooses how an overlay composition reaches them: a merged temporary tree
   built by `validate` (this tree's `packs/`, `catalog.yaml` and `compat.yaml` with the overlay's
   packs, never written inside the repository), or a second root taught to those modules; and it
   states which. `npm run compose` gains no option.
9. **Red first** (dl-018): the tests of criteria 1–7 are committed first and fail for the right
   reason (the behaviour or its own message missing; for criterion 7, the publication line), their
   failing count recorded in the Execution Notes; then the code.
10. **Green.** From a clean clone on Node.js 22.21 and 22.12.0: `npm ci`, `npm test`,
    `npm run lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
    `npm run validate` (this tree's output unchanged), the golden fixture's CI step, and
    `npm run -s wingfoil -- workflow list` exit 0 with no warning. The CI run on the branch is
    `success` and recorded; after the merge, `main`'s too.
11. **Nothing else moves.** No file under `packs/`, `schema/` or `.github/` changes; no new
    dependency (adr-003); `catalog.yaml`, `CATALOG.md`, `catalog-index.json`, `llms.txt` and the
    expected fixtures are unchanged, and no overlay fixture is committed (task-047 commits the
    first). `src/validate-cli.ts`'s usage comment names the option.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-25: independent review: request changes, four blocking findings, no ruling changed: the
  publication's refusal had no red step (strict parsing already refuses an unknown option); the
  conditional legs, order and counts of overlay compositions unstated; the value checks of an
  example missing; overlay packs no composition reaches left unchecked. Applied, with the
  non-blocking ones: tree-relative labels for the evidence reader, `--param`'s real behaviour,
  the preset format instead of spec-002 §2.4's, the composer's scope left to the Design, the
  option's path rules, the overlay lines' place and summary, the derived tree of criterion 6,
  `main`'s CI. Re-review requested.
