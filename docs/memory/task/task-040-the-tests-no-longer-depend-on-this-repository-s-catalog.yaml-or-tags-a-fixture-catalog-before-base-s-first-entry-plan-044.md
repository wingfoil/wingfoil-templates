---
id: task-040-the-tests-no-longer-depend-on-this-repository-s-catalog.yaml-or-tags-a-fixture-catalog-before-base-s-first-entry-plan-044
type: task
title: "The tests no longer depend on this repository's catalog.yaml or tags: a fixture catalog before base's first entry (plan-044)"
status: draft
pack: ""            # tooling task (pack-cycle › first-release, plan-044, ruling E)
depends_on: []
tags: ["tooling","catalog","tests"]
---

## Context

plan-044's ruling E (the approver, 2026-10-21): `base`'s first publication writes its entry into
`catalog.yaml` and tags `base@1.0.0`, and the test suite does not survive it. On a scratch clone,
with the tag and the entry written as `npm run publish:pack` writes them (plan-044's review), 91
of 937 tests fail, in 14 files (`agent-path`, `catalog`, `catalog-edit`, `check-packs`,
`evidence`, `example-rules`, `feedback-note`, `index`, `index-model`, `publish`, `readme-rules`,
`site`, `tag-rules`, `validate`). The causes:
- tests copy this repository's `catalog.yaml` into a temporary tree or repository with no tags
  (`tests/support/published-repo.ts` `treeRepo`, `tests/check-packs.test.ts`,
  `tests/index.test.ts`), so the index refuses the missing tag
  (`index: tag base@1.0.0 is named by catalog.yaml and missing from the repository`, 42 times)
  and the lint refuses a published version in a tree that is not a git repository (`catalog-tag`,
  31 times);
- tests assert the real file's content that publication changes: `tests/catalog.test.ts` expects
  `packs: []`, `tests/catalog-edit.test.ts` splits on `'packs: []'`.

`publish:pack` runs no test and the tag's CI runs on a commit whose catalog still lists no pack,
so the failure would show only on `main` after the push. Every later publication would hit it
again. The tests take a fixture catalog instead: they test the tooling on fixtures, not on this
repository's published state (dl-010), which is checked by the lint, the index and the matrix.

## Acceptance

Tests run by `npm test`; `npm run build` precedes the commands.

1. **A fixture catalog.** `tests/fixtures/` holds a `catalog.yaml` with this repository's `format`,
   `foundation`, `axes` and `slots` and empty `packs`, `transitions` and `presets`; a test holds its
   `axes`, `slots` and `foundation` equal to the real file's, so that the two cannot drift.
2. **No test copies or asserts this repository's `packs`, `transitions` or `presets`.** Every test
   and helper that wrote `catalog.yaml` from this repository into a temporary tree or repository
   writes the fixture catalog. `tests/catalog.test.ts` checks the real file's `format`, `axes`,
   `slots` and `foundation` and that it loads, whatever its `packs`; `tests/catalog-edit.test.ts`
   edits the fixture catalog. Tests that read this repository as a whole (its lint, index and
   validate counts) keep doing so and pass whatever `packs` lists.
3. **Red first** (dl-018): the scenario becomes a test before the fix: a scratch clone of this
   repository where `base@1.0.0` is tagged and its catalog entry written by `npm run publish:pack`
   (not pushed), in which the suite is run; it fails before the fix. The red run and its failing
   count are recorded. If that test is too slow for `npm test`, the same check runs as a recorded
   manual run on a scratch clone, before and after the fix, and the Execution Notes say so.
4. **Green.** After the fix, the whole suite passes on `main` as it is (`packs: []`) and on the
   scratch clone with `base@1.0.0` published locally, on Node.js 22.21 and 22.12.0; `npm run lint`,
   `check:pins`, `check:schemas`, `check:packs`, `validate` and `index -- --check` exit 0 from a
   clean clone.
5. **Nothing else moves.** No file under `src/`, `packs/`, `schema/` or `.github/` changes, and
   `catalog.yaml`, `CATALOG.md` and `catalog-index.json` are unchanged; the CI run on the branch
   is `success` and recorded.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
