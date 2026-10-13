---
id: task-027-feedback-notes-f-027-to-f-029-from-dl-021-and-update-lines-on-f-003-and-f-005
type: task
title: "Feedback notes F-027 to F-029 from dl-021, and update lines on F-003 and F-005"
status: in-progress
pack: ""            # no pack: the feedback inbox (hosted by plan-030, tooling-delivery)
depends_on: []
tags: ["feedback","wingfoil"]
---

## Context

The feedback-inbox actions of dl-021 (`approved` 2026-10-13), hosted by plan-030. No pack.

It comes from:
- dl-021 R1: no bundled packs; packs installed from this repository by WingFoil's `pack-install`
  as a `remote` source pinned by its lock; the "default set" filed as a request, input to WingFoil
  dl-138's Action 2 tech-spec and dl-164. dl-021 › Execution Notes: WingFoil's approver ruled
  (2026-10-13, to be recorded in WingFoil dl-138) that offline use comes from vendoring and the
  lock, and recommends (b): each WingFoil release pins a commit of this repository's catalog that
  names the default set, with a forward-only advance step on its side; the note proposes (b);
- dl-021 R2: a stage is an overlay; changing it is a pack update of the `stage/*` overlay, a
  transition a workflow the project runs; no `stage set` verb; WingFoil may open a DL through
  dl-164's governance-change mechanism;
- dl-021 R3: `built-in/` stays WingFoil's own; packs use kind-relative paths and land where
  `pack-install` maps them in the `remote/` class (WingFoil dl-138 Q3), with dl-138's lock;
- dl-021's requests to WingFoil, pending its v0.4 release-planning, not commitments;
- the approver's choice (i) of 2026-10-13: F-003 and F-005 get an update line pointing to D1 and
  to the new notes; status, title and body otherwise unchanged (`wingfoil-cli` rule 6).

**Branch and delivery.** As task-026, this task runs on its plan's branch, `feedback/dl-021-notes`,
not on `task/<id>`; its `done` commit lands on that branch, and its `deliver` is the branch's
`--no-ff` merge into `main` at plan-030 step 2, after the approver's OK.

Not in scope: the other changes of dl-021; F-001, F-007 and F-008 stay untouched (the new notes
name them); the sync; CB-8: `catalog.yaml`, `compat.yaml` and `schema/` do not change.

## Acceptance

Run from a clean clone of `feedback/dl-021-notes`; Node.js 22.21 and the floor 22.12.0.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added.
2. **CB-8.** `git diff --exit-code origin/main...HEAD -- catalog.yaml compat.yaml schema/` exits 0.
3. **Three new notes,** `F-027-<slug>.md` … `F-029-<slug>.md`, numbered without gaps, in the inbox
   format (README › Rules, WingFoil dl-163 R4): `kind: request`, `status: open`,
   `wingfoil_version: 0.2.2`, `answered_by: []`; the first line "New note (task-027)." followed by
   the decision it comes from (dl-021 R1, R2 or R3) and the earlier notes it supersedes; an
   `## Observed` holding only WingFoil 0.2.2's command output, reproduced from npm in a scratch
   project (`git init`, then `wingfoil init --template Kanban`; paths shown neutral or elided);
   an `## Expected` stating the request, with WingFoil's plans and the elements it is input for
   (WingFoil dl-138, dl-164, dl-149), which WingFoil alone cannot reproduce:
   - F-027, the pinned default set at `init`, option (b) (R1; supersedes F-001's bundled copy,
     F-003's `advance-bundled-packs`, F-005's `--offline`). Observed: `wingfoil init --help` has
     no source, version or offline option. Expected also says that the first `init` needs the
     network, that this repository commits to a default-set catalog commit never rewritten, and
     that WingFoil's default-set ruling is as relayed, not yet recorded in WingFoil dl-138;
   - F-028, stage changes as pack updates of `stage/*` overlays (R2; supersedes F-008's
     `stage set`). Observed: `wingfoil --help` has no `stage` or `pack` command;
   - F-029, packs landing in `remote/` with dl-138's lock, mapped by `pack-install` (R3; supersedes
     F-005's lock and F-007's `built-in/`). Observed: after `init`, `ls .wingfoil/directives`
     shows `built-in` and `custom` only.
4. **Ledger:** a row per new note, as the note says.
5. **Update lines:** F-003 and F-005 gain, after their first line and a blank line, one paragraph:
   F-003 "Update 2026-10-13: superseded by this repository's dl-021 R1 (WingFoil dl-138 Action 3);
   see F-027."; F-005 "Update 2026-10-13: superseded by this repository's dl-021 R1 and R3
   (WingFoil dl-138); see F-027 (`--offline`) and F-029 (the lock)." `git diff origin/main --
   docs/wingfoil-feedback/F-003-*.md docs/wingfoil-feedback/F-005-*.md` shows added lines only.
6. **README:** the Context's decision D3 (a table row, kept a single row) and its open question on
   bundled packs gain a pointer to dl-021 and F-027; no other paragraph changes.
7. **Nothing else changes:** besides this element and plan-030's own commits, the task's commits
   touch only `docs/wingfoil-feedback/`; the Execution Notes list them.
8. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded in the
   Execution Notes before `in-review`.

## Design

On `feedback/dl-021-notes` (Context), through `tooling-delivery` v2 as `developer`
(`documentation`, `wingfoil-cli`). Content only, no code and no new test: the checks are the
existing `tests/wingfoil-feedback.test.ts` and `tests/support/inbox.ts`, unchanged.

Red steps (dl-018 R1):
1. The three ledger rows first, without the notes: the inbox test "lists every note in the README
   ledger as the note says" fails (red, counted in the notes).
2. The three notes, from outputs of WingFoil 0.2.2 from npm in a scratch project outside the
   repository (`git init`, `wingfoil init --template Kanban`): green.
3. The update lines on F-003 and F-005 and the README pointers: content checked by
   characterization (dl-018 R2): the inbox tests stay green, and a mutation (an update line placed
   before "Formerly T3.") fails the opening rule, so the tests guard the first line.

Commits: one for steps 1–2, one for step 3; the Execution Notes list them.

## Execution Notes
- 2026-10-13, design written, task started (backlog → in-progress).
- 2026-10-13, build, red: with the three ledger rows and no notes, the inbox tests gave 6, 5 pass,
  1 fail ("lists every note in the README ledger as the note says"); green (6 of 6) after F-027,
  F-028 and F-029, written from WingFoil 0.2.2's output in a scratch project outside the
  repository (`init --help`, `pack add`, `stage set`, `upgrade` exit 2; `.wingfoil/directives` and
  `.wingfoil/workflows` hold `built-in` and `custom` only). Step 3 (update lines, README pointers)
  checked by characterization: tests 6 of 6; a mutation, an update line placed before
  "Formerly T3.", fails the opening rule (1 of 6). `git diff origin/main` on F-003 and F-005 shows
  added lines only (3 each).
- 2026-10-13, build review (independent subagent): approve after amendments, 0 blocking, 6 minor
  or nits, all applied (`ddc7784`): three phrases taken from WingFoil's relayed statements of
  2026-10-13 attributed to them (dl-138 Q2 (i), dl-164's origin template-update, "same version and
  same answers"); the `--help` outputs marked as excerpts, with `wingfoil --help` in F-028 as
  Acceptance 3 asks; F-027's and F-028's requests marked not commitments. Not re-reviewed
  (dl-017 R2): wording only.
- 2026-10-13, Acceptance from a clean clone at `250f7e3`, on Node.js 22.21.0 and 22.12.0: `npm ci`,
  `build`, `test` (803 of 803), `lint`, `check:pins`, `check:schemas`, `check:packs` exit 0; CB-8
  exits 0; besides this element and plan-030, only `docs/wingfoil-feedback/` changes.
- Task commits: `00bb6f9` (F-027 … F-029, ledger), `250f7e3` (update lines, README), `ddc7784`
  (wording after the review).
- 2026-10-13, CI (Acceptance 8): run 38398003590 on `ddc7784`, conclusion `success` for
  `validate (22.21.0)` and `validate (22.12.0)`. Submitted `in-review`.
