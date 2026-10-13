---
id: task-027-feedback-notes-f-027-to-f-029-from-dl-021-and-update-lines-on-f-003-and-f-005
type: task
title: "Feedback notes F-027 to F-029 from dl-021, and update lines on F-003 and F-005"
status: draft
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
   `## Observed` with WingFoil 0.2.2's current behaviour, reproduced from npm in a scratch project
   (`git init`, then `wingfoil init --template Kanban`; paths shown neutral or elided); an
   `## Expected` stating the request, with the WingFoil elements it is input for:
   - F-027, the pinned default set at `init`, option (b) (R1; supersedes F-001's bundled copy,
     F-003's `advance-bundled-packs`, F-005's `--offline`);
   - F-028, stage changes as pack updates of `stage/*` overlays (R2; supersedes F-008's
     `stage set`);
   - F-029, packs landing in `remote/` with dl-138's lock, mapped by `pack-install` (R3; supersedes
     F-005's lock and F-007's `built-in/`).
4. **Ledger:** a row per new note, as the note says.
5. **Update lines:** F-003 and F-005 gain, right after their first line, one line "Update
   2026-10-13: superseded by D1 (WingFoil dl-138; this repository's dl-021); see F-027…" naming
   the new notes that cover them; nothing else in either file changes.
6. **README:** the Context's decision D3 and its open question on bundled packs gain a pointer to
   dl-021 and F-027; no other paragraph changes.
7. **Nothing else changes:** besides this element, the task's commits touch only
   `docs/wingfoil-feedback/`; the Execution Notes list them.
8. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded in the
   Execution Notes before `in-review`.

## Design

Filled at the start of the work.

## Execution Notes
