---
id: task-041-feedback-notes-f-032-f-033-f-034-for-wingfoil-0.3.0-suspending-an-instance-closing-a-plan-that-is-not-an-instance-an-action-s-arguments-plan-045
type: task
title: "Feedback notes F-032, F-033, F-034 for WingFoil 0.3.0: suspending an instance, closing a plan that is not an instance, an action's arguments (plan-045)"
status: draft
pack: ""            # tooling task (tooling-change › deliver, plan-045 ruling H)
depends_on: []
tags: ["tooling","feedback"]
---

## Context

plan-045's ruling H (the approver, 2026-10-22): three feedback notes for WingFoil, owed since
plan-043 (task-038's review, ruling S) and dl-023, each with one `kind` (WingFoil dl-163 R4).
WingFoil's v0.3 retrospective (`19a66000`) covers none of them.
- **F-032 (`request`): suspending a workflow instance.** dl-023 D1 dropped `base`'s `parked` plan
  state, because 0.3.0's engine has no way to suspend an instance: `memory park` follows a
  `returns` edge back to an earlier state, and a parked plan is no open instance (dl-023 option
  (b)). The request: a designed suspend and resume of an instance.
- **F-033 (`gap`): closing a plan that is not an instance.** 0.3.0's `workflow end` leaves the
  `waiting` state `active` only for an instance started by `workflow start`; a phase plan, which
  carries `parent`, has no verb to close it, and `base` documents a hand-written `finalize` commit
  (its charter, its README step 6). It continues F-025 (0.2.2: no verb leaves `waiting` but
  `deprecate`), with what 0.3.0 changed.
- **F-034 (`gap`): an action's arguments.** The command WingFoil 0.3.0 offers for a phase action
  `memory.add(type: T, tags: [...])` reads only `type`, so `base`'s `retrospective` › `capture`
  asks the facilitator to pass `--tags retrospective` by hand (task-038, ruling S). Distinct from
  F-011 (`memory add --set` fills only id tokens).

## Acceptance

`npm run build` precedes the commands.

1. **Three notes**, `docs/wingfoil-feedback/F-032-<slug>.md`, `F-033-<slug>.md` and
   `F-034-<slug>.md`, each with the six fields in order (`id`, `title`, `kind`, `status: open`,
   `wingfoil_version: 0.3.0`, `answered_by: []`), a body opening with `New note (task-041).`, and
   `## Observed` and `## Expected` sections; no `## Replies`.
2. **Reproducible with WingFoil 0.3.0 alone**, in a scratch project (`git init`, WingFoil 0.3.0
   installed from npm or from `src/matrix/wingfoil-0.3.0/`), each `## Observed` giving the commands,
   their output and exit codes, and the minimal `memory.yaml` or workflow it uses; no command,
   path or file of this repository's tooling is needed to reproduce it. `wingfoil_version` is
   written by hand: this repository's governance pin is 0.2.2.
3. **Told apart:** F-032 cites dl-023 and says why `memory park` does not suspend an instance;
   F-033 cites F-025 and what 0.3.0 changed; F-034 cites F-011 and the difference.
4. **The ledger** in `docs/wingfoil-feedback/README.md` gains one row per note, in order (5 cells,
   any `|` in a title escaped); `Last sync` is unchanged.
5. **Tests:** `npm test` passes, `tests/feedback-note.test.ts` and the inbox checks of
   `tests/support/inbox.ts` included (numbering contiguous from F-001). No file under `src/`,
   `tests/`, `schema/`, `packs/` or `.github/` changes. The CI run on the branch is `success` and
   recorded.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
