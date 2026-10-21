---
id: task-040-the-tests-no-longer-depend-on-this-repository-s-catalog.yaml-or-tags-a-fixture-catalog-before-base-s-first-entry-plan-044
type: task
title: "The tests no longer depend on this repository's catalog.yaml or tags: a fixture catalog before base's first entry (plan-044)"
status: backlog
pack: ""            # tooling task (pack-cycle › first-release, plan-044, ruling E)
depends_on: []
tags: ["tooling","catalog","tests"]
---

## Context

plan-044's ruling E (the approver, 2026-10-21): `base`'s first publication writes its entry into
`catalog.yaml` and tags `base@1.0.0`, and the test suite does not survive it. On a scratch clone,
with the tag and the entry written as `npm run publish:pack` writes them (plan-044's review), 91
of 937 tests fail, in 14 files. Two causes:
- **This repository's `catalog.yaml` copied where its tags are not.** Through `treeRepo`
  (`tests/support/published-repo.ts`) and `indexCatalog` (`tests/support/index-catalog.ts`), and
  in `tests/index.test.ts`, it is written into a test repository without the tag, and the index
  refuses it (`index: tag base@1.0.0 is named by catalog.yaml and missing from the repository`:
  38 tests and 4 `before` hooks). In `tests/check-packs.test.ts`, `tests/example-rules.test.ts`,
  `tests/readme-rules.test.ts` and `tests/feedback-note.test.ts` it is copied into a plain
  directory, and the lint refuses a published version outside a git repository (`catalog-tag`,
  31 tests).
- **Tests assert the real file's `packs`.** `tests/catalog.test.ts` expects `packs: []`, and
  `tests/catalog-edit.test.ts` splits and replaces on `'packs: []'`.

The 4 failed hooks cancelled 56 tests, which never ran: among them agent-path's check of this
repository's files, which resolves the real `CATALOG.md`, `llms.txt` and `catalog-index.json` at
the tag. The 91 is a lower bound; once the hooks pass, these tests run in a published state for the
first time and may expose other failures, which this task fixes too.

Both refusals are correct behaviour: no file under `src/` changes. `publish:pack` runs no test and
the tag's CI runs on a commit whose catalog still lists no pack, so the failure would show only on
`main` after the push, and again at every later publication. The tooling's behaviour is tested on
fixtures; the real files stay checked by the tests that read this repository as a whole, and by
`lint`, `index -- --check` and `validate` (dl-010 (a)).

## Acceptance

Tests run by `npm test`; `npm run build` precedes the commands.

1. **A fixture catalog.** `tests/fixtures/catalog/catalog.yaml` is a byte copy of this
   repository's `catalog.yaml` as it stands (`packs: []`, `transitions: []`, `presets: []`). A
   test holds that the real file, with its `packs`, `transitions` and `presets` blocks emptied,
   equals the fixture byte for byte, so the two cannot drift.
2. **No test copies or asserts this repository's `packs`, `transitions` or `presets`.**
   - `treeRepo`, `indexCatalog` and `tests/index.test.ts` write the fixture catalog into their
     test repositories;
   - `tests/check-packs.test.ts`, `tests/example-rules.test.ts`, `tests/readme-rules.test.ts` and
     `tests/feedback-note.test.ts` copy the fixture catalog into their directories;
   - `tests/catalog.test.ts` checks the real file's `format`, `foundation`, `axes` and `slots` and
     that it loads, whatever its `packs`; `tests/catalog-edit.test.ts` edits the fixture catalog;
   - `tests/compose-documents.test.ts` and `tests/output.test.ts`, which load the real catalog for
     its axes and slots, take the fixture catalog;
   - the tests that read this repository as a whole (its lint, index and validate counts) keep
     doing so and pass whatever `packs` lists.
3. **Red first** (dl-018):
   - **In the suite:** a test scans `tests/**/*.ts` and fails on a read of this repository's
     `catalog.yaml` (`join(REPO_ROOT, 'catalog.yaml')`) outside an allowlist
     (`tests/catalog.test.ts` and the fixture's drift test). It is red before the fix, listing the
     sites of criterion 2, and guards against new ones.
   - **The publication, as a recorded run:** a clone of the task branch's head, `npm ci`,
     `npm run build`, `.idea/`-free and clean, `npm run publish:pack -- --pack base` (nothing
     pushed), then `npm test`. Its failing count is recorded before the fix (on the red commit)
     and after it.
4. **Green.** After the fix, the whole suite passes on the branch as it is (`packs: []`) and in
   criterion 3's recorded run on the branch's head (0 failed), on Node.js 22.21 and 22.12.0;
   `npm run lint`, `check:pins`, `check:schemas`, `check:packs`, `validate` and `index -- --check`
   exit 0 from a clean clone. Any failure the cancelled tests expose is recorded with its cause.
5. **Nothing else moves.** No file under `src/`, `packs/`, `schema/` or `.github/` changes;
   `catalog.yaml`, `CATALOG.md`, `catalog-index.json`, `tests/fixtures/index/expected/` and
   `tests/fixtures/compose/expected*/` are unchanged. The CI run on the branch is `success` and
   recorded. Out of scope: `tests/check-packs.test.ts` also copies the real `compat.yaml`, a
   similar drift when a WingFoil release is added (a follow-up).

## Design

- **The fixture.** `tests/fixtures/catalog/catalog.yaml`, a byte copy of `catalog.yaml` today;
  `tests/support/paths.ts` exports its path as `FIXTURE_CATALOG`.
- **The sites.** Every `join(REPO_ROOT, 'catalog.yaml')` in `tests/` but `tests/catalog.test.ts`
  becomes `FIXTURE_CATALOG`: `tests/support/published-repo.ts` (`treeRepo`, which
  `indexCatalog` uses), `tests/index.test.ts`, `tests/check-packs.test.ts` (its `lint` helper and
  the four composition cases), `tests/example-rules.test.ts`, `tests/readme-rules.test.ts`,
  `tests/feedback-note.test.ts`, `tests/catalog-edit.test.ts`, `tests/compose-documents.test.ts`
  and `tests/output.test.ts`. Their assertions do not change.
- **`tests/catalog.test.ts`.** "The real catalog.yaml" keeps its axes, slots and foundation checks
  and drops `packs: []`; a new case, "the fixture catalog is the real one with no published pack",
  replaces in the real text each of the `packs`, `transitions` and `presets` blocks (the key's
  line and its indented or `- ` lines up to the next top-level key) by `<key>: []` and asserts
  byte equality with the fixture.
- **The guard** (the in-suite red): `tests/catalog-fixture.test.ts` reads every `.ts` file under
  `tests/` and lists those holding `REPO_ROOT, 'catalog.yaml'` outside the allowlist
  (`tests/catalog.test.ts`); it expects none. It is committed first with the fixture and the drift
  case, red on the sites above.
- **The publication run**, scripted in the scratchpad, never committed: clone of the branch's head
  (the red commit, then the green one), `npm ci`, `npm run build`, `npm run publish:pack -- --pack
  base` with a scratch git identity, `npm test`; the failing count is recorded each time.
- **Commits** on `task/task-040-tests-fixture-catalog`: the red (fixture, drift case, guard), then
  the fix (the sites), then the notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-21: independent review of the body: approve after amendments. Applied: every call site
  named and mapped to criterion 2; the 56 cancelled tests and the red count as a lower bound; the
  red first as an in-suite guard plus a recorded publication run on the branch's head; dl-010 (a)
  cited for what it decided; the fixture a byte copy with a drift test; no `src/` change, the
  expected fixtures unchanged; the real `compat.yaml` copy left as a follow-up.
