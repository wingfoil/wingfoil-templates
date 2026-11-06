---
id: task-079-the-release-pinned-parts-derived-from-compat.yaml-the-tests-release-stubs-spec-001-12-pointing-to-compat.yaml-plan-065-task-d-dl-042-i2-i3
type: task
title: "The release-pinned parts derived from compat.yaml: the tests' release stubs, spec-001 §12 pointing to compat.yaml (plan-065 task D, dl-042 I2, I3)"
status: done
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
per release from this task on; I2, the `releases[]` › `capabilities` sub-bullet of §12, for a
verified patch. Today task-059 and task-074 each changed `tests/compat.test.ts` (the spec-001 §12
example equal to `compat.yaml`, and the list of the real file's releases) and
`tests/validate.test.ts` (a stub per real release, keyed by its version) by hand. task-045's rule
stays: only `tests/compat.test.ts` and `compat-fixture.test.ts` read this repository's `compat.yaml`
as such; every other test takes `FROZEN_COMPAT`. dl-009 is not touched here: its last note is
plan-065's dl actions row (dl-042 I5).

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018), on a local-only scratch tree (a `git clone` of this repository, its tags
   kept, then `npm ci` and `npm run build` there, run alone, no other suite at the same time): task
   (B)'s allowlist applied by hand except the pin folder, a `0.3.3` row as 0.3.2's (`capabilities:
   [workflow-engine]`, `notes` a placeholder) in `compat.yaml` and in the golden fixture's, the six
   `catalog.yaml` ranges recomputed by `computeRange` (as `src/tag-rules.ts` checks them) to
   `>=0.3.0 <=0.3.3`, and `npm run index`; `src/matrix/wingfoil-0.3.3/` left out, since no test
   installs a release (stubs stand in) and `check:pins` is not in `npm test`; the tree is never
   pushed (the CI's matrix would try to install a wingfoil 0.3.3 that does not exist). `npm test`
   there fails today: the failing tests recorded with their command and count (at least the spec-001
   §12 equality, the release list, the range from the real file, the ascending list, the newest
   release's matrix lines of `tests/validate.test.ts`, the missing stub for 0.3.3); after the
   change, the same tree passes `npm test`.
2. **`tests/compat.test.ts`**: the dl-010 equality keeps its fixture half (the golden fixture's
   `compat.yaml` equal to this repository's) and drops its spec half; the real file's releases
   checked as a growing list (the recorded rows of 0.2.2 … 0.3.2 as today, as a prefix; every later
   row ascending, `format_key: true`, its `capabilities` from the vocabulary, its `reads` covering
   every kind); the computed range from the real file checked as `>=0.3.0 <=<newest>` while every
   later row carries `workflow-engine`; the ascending test expecting the file's versions plus the
   one it appends, `SECOND_RELEASE` a version no intake will record (`99.0.0`).
3. **`tests/validate.test.ts`**: the release stubs from a factory that answers any strict `X.Y.Z`
   with a default stub, 0.2.2 with its format-warning stub, explicit stubs kept only where a test
   needs a release's own behaviour; it reads no file (task-045's rule unchanged); no test of the
   file names 0.3.2 or a later release to pass.
4. **spec-001 §12, amended in place** (approved by this task's merge OK, as task-059 and task-074
   did for §12): the example replaced by a pointer to `compat.yaml` and its schema; kept: the
   introduction, the kinds, the vocabulary bullet, the rules of `releases[]`,
   "`wingfoil-release-intake` appends one entry per WingFoil release (dl-002)", 0.2.2's paragraph
   (it explains `format_key: false`), the `V.formats` paragraph, the compatibility rule and the
   computed range; the `releases[]` › `capabilities` sub-bullet reading with dl-042 I2 for a
   verified patch (its predecessor's capabilities unless the bar flags a change or a check that
   exercises one is red; one no check exercises only when the predecessor has it and the bar flags
   nothing; a new one only from a CHANGELOG entry naming it, the report then guided), dl-021 R4's
   sentence kept for every other intake; the paragraphs of 0.3.0, 0.3.1 and 0.3.2 (their checks,
   dates and commits) moved verbatim to an Execution Note of spec-001 dated this task's merge, as
   history (dl-042 I3); nothing else of spec-001 changes. `compat.yaml`'s recorded rows are not
   rewritten.
5. **No other test reads the real `compat.yaml`** (`compat-fixture.test.ts` passes), and no file
   outside `tests/compat.test.ts`, `tests/validate.test.ts`,
   `tests/fixtures/schema/compat/valid/spec-12.yaml`'s header comment (it names the example that
   leaves), the spec, this task and `docs/owed-items.md` changes.
6. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success` (both jobs, run id and durations)
   and dl-039's local list on Node.js 22.21.0; `npm run lint` exits 0; Acceptance 1's tree, with the
   frozen commit's changed files copied in and rebuilt, passes `npm test`. The privacy check of the
   branch's diff recorded.

## Design

Branch `task/task-079-release-pinned-parts` from `main` at this task's add. Red steps: (1) the
scratch tree of Acceptance 1, built by a script in the task's notes (not committed): red, the
failures listed; (2) `tests/compat.test.ts` (the spec half dropped, the rest derived) and
`tests/validate.test.ts` (the stub factory) changed: the repository's `npm test` green and the
scratch tree, with the change copied in, green; (3) spec-001 §12 amended, a documentation change
with no red of its own (dl-018 allows it), and the schema fixture's header comment.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-06: written under plan-065 (task (D)), added on `main` after task-078 was done, no
  other task added on any branch meanwhile (W-14).
- 2026-11-06: independent review of the body: approve after amendments, one blocking finding (the
  red tree smaller than task (B)'s diff); applied with the others: the whole allowlist but the pin
  folder, local-only, a clone with its tags; the range and ascending tests; the stub factory reading
  no file; §12's `capabilities` sub-bullet with I2 in full; 0.2.2's paragraph kept and what stays
  listed; the Design's steps; dl-009 untouched here; the schema fixture's comment.
- 2026-11-06: re-review: approve; its two nits applied.
- 2026-11-06: started (backlog → in-progress) on `task/task-079-release-pinned-parts`. Red (dl-018)
  on a local-only scratch tree, by a script run outside the repository: `git clone` of this
  repository at the task's head, a `0.3.3` row (as 0.3.2's, `capabilities: [workflow-engine]`,
  `notes` a placeholder) appended to `compat.yaml` and to the golden fixture's, the six
  `catalog.yaml` ranges set to `>=0.3.0 <=0.3.3` (`npm run check:packs` then reports `0
  problems`, so they equal `computeRange`'s), `npm ci`, `npm run build`, `npm run index`, `npm
  test`: 1080 tests, 46 failing: `compat.test.ts` (the §12 equality, the release list, the range,
  the ascending list) and the `validate` tests, through the missing stub for 0.3.3 and the newest
  release's matrix lines (golden preset, publication, this repository, the overlays, the legs).
- 2026-11-06: green: `0052a32` (`tests/compat.test.ts`, `tests/validate.test.ts`), `e6ecdd4`
  (spec-001 §12 amended in place; the schema fixture's header comment). Deviation (dl-019), for the
  approver at `in-review`: Acceptance 3 says the stub factory "reads no file"; it reads none, but
  `NEWEST`, the newest release the tests expect, is read from the golden fixture's `compat.yaml`
  (equal to this repository's by dl-010, which `compat.test.ts` checks), not from the real file:
  task-045's rule holds in its letter (`compat-fixture.test.ts`) and its reason (an intake moves
  the fixture with the real file). Proposed reading: a fixture, not this repository's file.
- 2026-11-06: independent build review of `e6ecdd4`: approve after amendments, nothing blocking;
  should-fix: the deviation above (recorded here), the repeated-release test repeating the newest
  release; nits: I2's "otherwise the report is guided", a comment, a title, an import's order;
  applied in `3fd5c07`. Re-review: approve. The scratch tree on `3fd5c07` gave 1080 tests, 1
  failing (an install failure's assertion naming 0.3.2 as a regex, missed by the first search);
  fixed in `c699e15`, the frozen commit; on it the scratch tree passes `npm test`, 1080 tests, 0
  failing. No re-review for that fix: one assertion's version derived as the others were.
- 2026-11-06: checks (dl-039 R1, R2), once, on `c699e15`: the branch CI, run 42185547938,
  `success`, jobs Node.js 22.12.0 20 min 10 s and 22.21.0 20 min 0 s (none over 25 minutes); from a
  clean working tree on Node.js 22.21.0 after `npm ci` and `npm run build`: `npm run
  validate:publication`, the golden tree in publication mode and `npm run -s wingfoil -- workflow
  list` exit 0, `directives list --format json` with `"warnings": []`; `npm run lint` exits 0;
  Acceptance 1's tree passes `npm test` (above). This commit changes only `docs/memory`: no new
  run. Privacy check of the branch's diff and messages: no local or scratch path, no maintainer
  name or email, no private project, no intermediary session.
