---
id: task-098-the-fixture-projects-of-governance-feedback-and-the-bindings-of-the-fixture-element-checks-plan-076-task-098
type: task
title: "The fixture projects of governance/feedback and the bindings of the fixture-element checks (plan-076 task-098)"
status: in-progress
pack: "pack-governance-feedback"
depends_on: ["task-096", "task-097"]
tags: ["packs","feedback","governance"]
---

## Context

plan-076 (`pack-cycle › author` of `pack-governance-feedback`), point 5 and its ruling. This task
writes what the charter's [E] criteria ask (FA-3 … FA-8): fixture projects holding Memory elements
written by hand, and the bindings that run the generic checks of `tests/support/fixture-elements.ts`
(task-094) on them. It closes the owed row "The bindings of the fixture-element checks to
`governance/feedback`". It is a developer change under `tests/` inside a pack task, as task-097's
was.

The approver's rulings on point 5: `context` is split on `,` and read in mode `every`, and a commit
counts as a reference for FA-5. Plan-076 step 4 records that reading on the charter at the plan's
close.

**`resulting` on a declined item, the approver's ruling of 2026-11-18 (dl-019).** The charter and
the `feedback` directive close a `declined` or `duplicate` item with `resulting: n/a — <reason>` and
the reason in its body. The type declares no `not_applicable_allowed`, so the generic checks read
that value as an unresolved reference and as an empty field. The type cannot declare it: spec-001
§18 allows it only on a `required` field, and spec-003 §4.4 keeps `resulting` optional. The approver
ruled that the bindings of FA-6 leave those two outcomes out, and that a check of this task asserts
the value's form and the reason in the body (criterion 5). The pack, the specifications and the
generic checks do not change.

## Acceptance

1. **The fixtures,** under `tests/fixtures/feedback-elements/`, hold only hand-written files, with
   fictional values and no composed output. `tests/feedback-elements.test.ts` composes each project
   when it runs, on `FIXTURE_CATALOG` (`tests/catalog-fixture.test.ts` forbids reading this
   repository's catalog), into a directory of its own. It copies the output and the project's
   elements into a scratch git repository (`tests/support/git-repo.ts`, fixed identity) and commits
   them. A reference to a commit is a token in the fixture, replaced by the hash the test reads
   after the first commit. The versions a `context` may name are the tags the test makes in that
   repository, read back from git.

   | Project | Composed from |
   |---|---|
   | `defaults` | the README example `defaults` |
   | `with-software` | the README example `with-software` |
   | `added-outcome` | the README example `added-outcome` |
   | `upstream` | `feedback-exit`'s composition `upstream`, on the merged tree |
2. **The valid elements.** `readElements` reports no problem on any project, each project passes
   the element checks of criterion 4 and criterion 5, and together the projects hold:
   - an item in each of the states `draft`, `pending`, `triaged` and `closed`;
   - a `context` of each reference kind: an element id, a workflow and phase (`<workflow>.<phase>`),
     a version and a commit, and one `context` holding several of them;
   - a closed item for each of `decision-log`, `task`, `declined`, `duplicate` and `upstream-note`,
     for `bug` in `with-software`, and for the added outcome `deferred` in `added-outcome`, routed
     to a decision-log naming the outcome (spec-003 §4.3).

   Every item, a `draft` one included, holds a non-empty `context` (FA-5: the generic checks skip an
   empty one), and a reference of the workflow kind names a phase, which the test asserts.
3. **The invalid elements,** one file per case under `invalid/`. The test adds each alone to a valid
   project and asserts that the named check reports it, naming that file, and that no other check
   reports anything. The element named by the `closed` case with no `outcome` cites that case's id
   in advance, so that only the missing `outcome` is reported; the element named by the
   back-reference case cites nothing:

   | Criterion | Case | Check |
   |---|---|---|
   | FA-3 | a `pending` item missing `kind`; `target`; `source`; `context` (four files) | `requiredFieldProblems` |
   | FA-4 | `kind`, `target` or `outcome` outside its list (three files) | `allowedValueProblems` |
   | FA-4 | `outcome: bug` in `defaults`, which composes no `software` | `allowedValueProblems` |
   | FA-5 | a `context` that resolves to nothing; one reference resolving beside one that does not | `referenceProblems` |
   | FA-6 | a `closed` item with no `resulting`; with no `outcome` | `stateFieldProblems` |
   | FA-6 | `resulting` naming an element that does not cite the item; naming nothing that exists | `backReferenceProblems` |
   | FA-6 | a `declined` item closed with a bare `n/a`; with no reason in its body | criterion 5's check |
4. **The bindings,** in the test, through `tests/support/fixture-elements.ts`, with each list read
   from the composition's parameter, else from the pack's default:
   - **FA-3:** `requiredFieldProblems`, on the composed type's required fields;
   - **FA-4:** `kind` → `feedback_kinds`, `target` → `feedback_targets`, and `outcome` →
     `feedback_outcomes`, plus `bug` only where the composition holds `software`;
   - **FA-5:** `context`, split on `,`, mode `every`, kinds `element`, `workflow-phase`, `version`
     and `commit`, the workflows and phases read from the composed workflows;
   - **FA-6:** `resulting` and the back-reference through `reported_by` or the body, and `outcome`
     and `resulting` required on `closed`, for every outcome but `declined` and `duplicate`;
   - **`bug` refused:** `refusedItemProblems` reports nothing on this repository's presets and
     examples, and reports a scratch tree whose example adds `bug` to `feedback_outcomes`.
5. **A declined item:** every `closed` item whose `outcome` is `declined` or `duplicate` holds a
   `resulting` of the form `n/a — <reason>`, and its body states that reason.
6. **FA-7, both paths, shown by the fixtures and asserted by the test:**
   - **governance evolution, in `defaults`:** an item whose `resulting` names a decision-log that
     cites it and names `governance-evolution.propose`, and a hand-written file for
     `.wingfoil/directives/custom/` citing that decision-log. The test commits the file with a
     message read from the fixture, and asserts through `git log` that the commit touching the file
     cites the decision-log;
   - **product evolution, in `with-software`:** an item whose `resulting` names a `bug` that cites
     it;
   - **without `software`, in `defaults`:** an item whose `resulting` names a decision-log, the item
     and the decision-log both naming the would-be bug.

   FA-7 [A] is the approver's, at this task's `approve`: the request names these fixture files.
7. **FA-8:** in `upstream`, a `closed` item with outcome `upstream-note` and target
   `upstream:plover-vendor`, whose `resulting` is the path the channel directive states. The note at
   that path passes `assertFields` and `assertSections` of `tests/support/inbox.ts`, on a `Note`
   built from the file, and cites the item through the back-reference check.
8. **Red first** (dl-018): the test runs before the fixtures exist and fails. The red run's command
   and failing count are recorded.
9. **The owed row** "The bindings of the fixture-element checks to `governance/feedback`" moves to
   Closed, settled by this task and, for FA-5's reading on the charter, by plan-076 step 4, in the
   commit that closes this task (`repository-practice` rule 4).
10. **What does not change:** no file under `src/`, `packs/`, `.github/` or `.wingfoil/`,
    `tests/support/fixture-elements.ts`, `catalog.yaml`, `CATALOG.md`, `catalog-index.json` or
    `llms.txt`. `npm run check:runs` and the four exit overlays keep their counts.
11. **A criterion that cannot hold as written**, or a defect of the pack or of the generic checks,
    goes to the approver when found (dl-019), and the work on it waits.
12. **Checks** (`kanban-delivery` › `review`, dl-039):
    - first, the build review and its amendments;
    - then, once, on the frozen commit: the branch CI `success`, its run id and every job's
      duration recorded (a job over 25 minutes goes to the approver, R3);
    - dl-039's local list on Node.js 22.21.0, from a clean working tree after `npm ci` and
      `npm run build`: `npm run validate:publication`, the golden tree in publication mode and
      `npm run -s wingfoil -- workflow list`, each exit 0.
13. **Delivery:**
    - the branch `task/task-098-feedback-elements` from `main`, in a worktree of its own;
    - after `approve`, a `--no-ff` merge on the approver's OK, `main` pushed, its CI read, and
      `approved → done`;
    - the privacy check of the branch's diff recorded (`repository-practice` rule 2).

## Design

Branch `task/task-098-feedback-elements` from `main` at `b2f96119`, in a worktree of its own.

- **The layout** of `tests/fixtures/feedback-elements/`: `<project>/` mirrors the paths each element
  has in the composed project; `invalid/` holds criterion 3's cases; `defaults/custom/` holds
  criterion 6's directive and commit message, which are not copied with the elements.
- **The test** (`tests/feedback-elements.test.ts`):
  - composes with `composeDocuments` on `FIXTURE_CATALOG`, `upstream` on the tree `mergeOverlay`
    builds, writes the output to a directory of its own and copies it into a `TestRepo`;
  - after the first commit, tags `v1.0.0`, replaces the commit token in the elements and commits
    again;
  - runs the named checks as one map from a check's name to its problems, so that a case can assert
    one check reports it and the others nothing.
- **The cases** are all added to `defaults`, which holds the two decision-logs the FA-6 cases name:
  one citing the `closed` case with no `outcome` in advance, one citing nothing.
- **Commits:** the test (red); the fixtures; the owed row and the notes.

## Execution Notes

- 2026-11-18, **the red run** (dl-018), on `6418f3c9`, before the fixtures existed: `node --test
  dist/tests/feedback-elements.test.js` gave 27 failing of 29. Before the build review the test
  changed once: its walker of a fixture directory returned wrong paths, fixed in the fixtures'
  commit.
- 2026-11-18, **the counts:** `npm test` grew by this task's tests alone; `check:runs` stays at 84
  runs, and the overlays `software-exit`, `scrum-exit`, `kanban-exit` and `feedback-exit` at 36, 36,
  36 and 44 runs, 0 failed.
- 2026-11-18, **the build review** (dl-017): approve after amendments; no blocker, five should-fix
  and three nits, all applied. The mutations that survived and were worth pinning are now pinned.
  - **Each case states its reason:** a case fails for the defect its name says, not for another
    inside the same check.
  - **Three more cases,** beyond criterion 3's table, for criterion 5's form: a `duplicate` with a
    bare `n/a`, a hyphen for the dash, and an empty reason.
  - **FA-6's exclusion is pinned:** only the declined and the duplicate items are left out.
  - **FA-8's path** is read from the composed channel directive; the note's kind is the item's.
  - **FA-7 and the routes:** the governance item's outcome and target, and each closed route's
    target type.
- 2026-11-18, **the re-review of the build**: approve after amendments; one should-fix and one nit,
  applied. A case whose name a defect of another kind would still satisfy now also states the text
  that makes it that case.
- 2026-11-18, **the privacy check** of the branch's diff (`repository-practice` rule 2): no local or
  scratch path, no private project, no session.
- 2026-11-18, **dl-039's checks**, once, on the frozen commit `0d5ca621`:
  - **the branch CI**, run 44302537490, `success`: jobs `validate (22.12.0, 1)` 12 min 23 s,
    `(22.12.0, 2)` 4 min 52 s, `(22.21.0, 1)` 12 min 3 s, `(22.21.0, 2)` 4 min 43 s; none over 25
    minutes;
  - **the local list** on Node.js 22.21.0, from a clean working tree after `npm ci` and
    `npm run build`: `npm run validate:publication` (28 runs, 0 failed, `tolerance applied: none`),
    the golden tree in publication mode (26 runs, 0 failed, `tolerance applied: none`) and
    `npm run -s wingfoil -- workflow list`, each exit 0; `directives list` with no warning;
    `npm test` 1428 passed, 0 failed; the lint exit 0; `check:runs` 84 runs, 0 failed.
