---
id: task-079-the-release-pinned-parts-derived-from-compat.yaml-the-tests-release-stubs-spec-001-12-pointing-to-compat.yaml-plan-065-task-d-dl-042-i2-i3
type: task
title: "The release-pinned parts derived from compat.yaml: the tests' release stubs, spec-001 §12 pointing to compat.yaml (plan-065 task D, dl-042 I2, I3)"
status: draft
pack: ""            # tooling task (tooling-delivery v3), plan-065 task (D)
depends_on: []
tags: ["tooling","intake","spec"]
---

## Context

plan-065's task (D) (rulings 1 and 4), second after task-078: the parts of an intake that are
written by hand today and pinned to real releases, derived from `compat.yaml`, so that the prepared
diff of task (B) passes `npm test` without hand edits. dl-042 (approved 2026-11-05) rules it: I3,
the facts of each release in its `notes`, spec-001 §12 pointing to `compat.yaml`, §12's prose per
release for 0.3.0 … 0.3.2 kept as history in spec-001's Execution Notes, no Execution Note on dl-009
per release from this task on; I2, §12's `capabilities` bullet read as a carry-forward for a patch.
Today task-059 and task-074 each changed `tests/compat.test.ts` (the spec-001 §12 example equal to
`compat.yaml`, and the list of the real file's releases) and `tests/validate.test.ts` (a stub per
real release, keyed by its version) by hand. task-045's rule stays: only `tests/compat.test.ts` and
`compat-fixture.test.ts` read this repository's `compat.yaml` as such; every other test takes
`FROZEN_COMPAT`.

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): a scratch copy of the tree with one more release appended to
   `compat.yaml` and to the golden fixture's (`0.3.3`, as task (B) would write it), on which `npm
   test` fails today (the spec-001 §12 equality, the list of releases, the missing stub): the
   failing tests recorded with their command and count; after the change, the same appended tree
   passes.
2. **`tests/compat.test.ts`**: the dl-010 equality keeps its fixture half (the golden fixture's
   `compat.yaml` equal to this repository's) and drops its spec half; the real file's releases are
   checked as a growing list: the recorded rows of 0.2.2 … 0.3.2 as today, as a prefix, and every
   later row ascending, `format_key: true`, its `capabilities` from the vocabulary, its `reads`
   covering every kind.
3. **`tests/validate.test.ts`**: the stub of each release `compat.yaml` lists derived from the file
   (a default stub per version, the 0.2.2 one with its format warning), the explicit stubs kept only
   where a test needs a release's own behaviour; no test of the file names 0.3.2 or a later release
   to pass.
4. **spec-001 §12, amended in place** (approved by this task's merge OK, as task-059 and task-074
   did for §12): the example replaced by a pointer to `compat.yaml` and its schema; the vocabulary,
   the kinds, the rules of `releases[]` and the compatibility rule kept; the `capabilities` bullet
   reading with dl-042 I2 (a patch carries its predecessor's capabilities unless the report flags a
   change); the prose per release (0.2.2's, 0.3.0's, 0.3.1's and 0.3.2's checks, with their dates
   and commits) moved verbatim to an Execution Note of spec-001 dated this task's merge, as history;
   nothing else of spec-001 changes. `compat.yaml`'s recorded rows are not rewritten.
5. **No other test reads the real `compat.yaml`** (`compat-fixture.test.ts` passes), and no file
   outside `tests/compat.test.ts`, `tests/validate.test.ts`, the spec, this task and
   `docs/owed-items.md` changes.
6. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success` (both jobs, run id and durations),
   and dl-039's local list on Node.js 22.21.0; `npm run lint` exits 0; Acceptance 1's appended tree
   passes `npm test` locally. The privacy check of the branch's diff recorded.

## Design

Branch `task/task-079-…` from `main` at this task's add. Red steps: (1) a script in the task's notes
(not committed) that copies the tree to a temporary directory, appends a `0.3.3` row (as 0.3.2's,
`notes` a placeholder) to both `compat.yaml` files, and runs `npm test` there: red, the failures
listed; (2) `tests/compat.test.ts` and `tests/validate.test.ts` changed (the appended tree green
except the spec equality); (3) spec-001 §12 amended (all green). A pure helper in `tests/support/`
builds the default stubs from a `compat.yaml` path.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-06: written under plan-065 (task (D)), added on `main` after task-078 was done, no
  other task added on any branch meanwhile (W-14).
