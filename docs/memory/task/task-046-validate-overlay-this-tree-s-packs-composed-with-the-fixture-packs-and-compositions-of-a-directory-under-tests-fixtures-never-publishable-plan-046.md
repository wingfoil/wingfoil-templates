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
`--overlay` names; paths in it are relative to it.

1. **The option.** `npm run validate -- [--tree <dir>] --overlay <dir> …` takes one overlay. Its
   path is resolved against the tree and must lie under the tree's `tests/fixtures/`; otherwise, or
   when given twice, `validate` exits 3 with a usage line. A path that is not a directory exits 2
   (`<dir>: not a directory`), as `--tree` does.
2. **The layout.** An overlay holds `packs/<pack path>/` (a pack as in `packs/`, spec-001 §6) and
   `compositions/<id>/example.yaml` (the example format of spec-002 §2.4, its `id` equal to its
   directory's name). Anything else at its top level is reported (exit 1).
3. **Resolution.** A composition of the overlay resolves its entries against this tree's packs
   and the overlay's together, with this tree's `catalog.yaml` and `compat.yaml`; positional
   entries given with `--overlay` resolve the same way. An overlay pack whose path this tree's
   `packs/` already holds is refused (exit 1, naming the path): an overlay never shadows a pack of
   the tree. The overlay's packs pass every check the composer applies to a pack it composes
   (`resolve`'s inventory, format, layout and README checks, the workflow rules, the merge).
4. **Its own checks.** `validate` checks the overlay's files that the tree's checks do not see:
   each `pack.yaml` and each `example.yaml` against its schema, an `example.yaml`'s `id` against
   its directory, and the secret rules (`src/secret-rules.ts`) over every file of the overlay.
   Their lines come after the tree's lint line, prefixed `overlay`, and a problem fails the run
   (exit 1, or 2 for an I/O error).
5. **Compositions.** Each overlay composition is composed twice and compared (F3.4) and run
   through the matrix, after the tree's presets, examples and entries, with its label
   `overlay compositions/<id>/example.yaml`; `--param` applies to it as to an example (a value
   the composition sets is not overridden). An overlay with no composition is reported and fails
   the run (exit 1): an overlay that composes nothing is not a pass.
6. **The tree unchanged.** With `--overlay`, the tree's `schemas:`, lint, `index:` lines and its own
   compositions are those of the same run without it. A test holds it on a tree with no
   methodology whose overlay holds one: the tree's pack README keeps the exemption line of
   spec-002 §2.4 with no lint problem, and the overlay's composition of that pack with the
   overlay's methodology runs.
7. **Never publishable.** `npm run validate:publication` refuses `--overlay` (exit 3, a usage
   line naming the option), with or without `--evidence`; `publish:pack`, `index`, `site` and the
   catalog edits take no overlay and read no file under one. No change to `src/publish.ts`,
   `src/index*.ts`, `src/catalog*.ts` or `src/site*.ts`.
8. **Red first** (dl-018): the tests of criteria 1–7 are committed first and fail for the right
   reason (an unknown option, or the behaviour missing), their failing count recorded in the
   Execution Notes; then the code.
9. **Green.** From a clean clone on Node.js 22.21 and 22.12.0: `npm ci`, `npm test`,
   `npm run lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
   `npm run validate` (this tree's output unchanged), the golden fixture's CI step, and
   `npm run -s wingfoil -- workflow list` exit 0 with no warning. The CI run on the branch is
   `success` and recorded.
10. **Nothing else moves.** No file under `packs/`, `schema/` or `.github/` changes; no new
    dependency (adr-003); `catalog.yaml`, `CATALOG.md`, `catalog-index.json`, `llms.txt` and the
    expected fixtures are unchanged. `src/validate-cli.ts`'s usage comment names the option.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
