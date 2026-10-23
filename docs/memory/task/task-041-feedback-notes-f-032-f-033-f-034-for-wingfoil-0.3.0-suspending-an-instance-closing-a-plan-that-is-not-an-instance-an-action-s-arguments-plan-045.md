---
id: task-041-feedback-notes-f-032-f-033-f-034-for-wingfoil-0.3.0-suspending-an-instance-closing-a-plan-that-is-not-an-instance-an-action-s-arguments-plan-045
type: task
title: "Feedback notes F-032, F-033, F-034 for WingFoil 0.3.0: suspending an instance, closing a plan that is not an instance, an action's arguments (plan-045)"
status: in-review
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
  `deprecate`), with what 0.3.0 changed: `workflow end` closes a plan only if `workflow start`
  started it (`workflow is not open` otherwise); `submit` on a `waiting` state now says its
  forward edge "fires only via a Workflow action"; `approve` is refused outside a gate. 0.3.0's
  `workflow finalize` records a step of an open workflow and does not close the plan either.
- **F-034 (`gap`): an action's arguments.** The command WingFoil 0.3.0 offers for a phase action
  `memory.add(type: T, tags: [...])` reads only `type`, so `base`'s `retrospective` › `capture`
  asks the facilitator to pass `--tags retrospective` by hand (task-038, ruling S). Distinct from
  F-011 (`memory add --set` fills only id tokens).

## Acceptance

`npm run build` precedes the commands.

1. **Three notes**, `docs/wingfoil-feedback/F-032-<slug>.md`, `F-033-<slug>.md` and
   `F-034-<slug>.md`, each with the six fields in order (`id`, `title`, `kind`, `status: open`,
   `wingfoil_version: 0.3.0`, `answered_by: []`), a body opening with `New note (task-041).`, and
   `## Observed` and `## Expected` sections; no `## Replies`. The opening line is followed by the
   provenance (plan-045 ruling H; dl-023, or task-038's ruling S).
2. **Reproducible with WingFoil 0.3.0 alone**, in a scratch project (`git init`, WingFoil 0.3.0
   installed from npm or from `src/matrix/wingfoil-0.3.0/`, then `wingfoil init --template
   Kanban`), each `## Observed` giving the commands,
   their output and exit codes, and the minimal `memory.yaml` or workflow it uses; no command,
   path or file of this repository's tooling is needed to reproduce it. `wingfoil_version` is
   written by hand: this repository's governance pin is 0.2.2. F-034 shows the command that
   `workflow next` offers for a custom phase action `memory.add(type: …, tags: [...])`.
3. **Told apart:** F-032 cites dl-023 and says why `memory park` does not suspend an instance;
   F-033 cites F-025 and what 0.3.0 changed, and shows why `workflow finalize` and `workflow end`
   do not close the plan (exit codes and output); F-034 cites F-011 and the difference.
4. **No private content:** no note names or describes a private project, a local path or a
   non-public repository; WingFoil references are public ids, tags or commits.
5. **The ledger** in `docs/wingfoil-feedback/README.md` gains one row per note, in order (5 cells
   equal to the frontmatter, `answered_by` empty, any `|` in a title escaped); `Last sync` is
   unchanged. No `wingfoil-cli` W-entry: the behaviours are 0.3.0's, recorded when the governance
   pin moves to 0.3.0 (its rule 5); `.wingfoil/` is unchanged.
6. **Tests:** `npm test` passes, `tests/feedback-note.test.ts` and the inbox checks of
   `tests/support/inbox.ts` included (numbering contiguous from F-001). No file under `src/`,
   `tests/`, `schema/`, `packs/` or `.github/` changes. The CI run on the branch is `success` and
   recorded.

## Design

- **The scratch project**, in the scratchpad and never committed: `git init`, WingFoil 0.3.0
  installed with `npm ci` from `src/matrix/wingfoil-0.3.0/`, `wingfoil init --template Kanban`, a
  commit; each note's minimal change to the scaffold (F-032: the `plan` type with option (b)'s
  `parked` and `returns`; F-033: a plan added without `workflow start`; F-034: a custom `main`
  workflow whose phase action is `memory.add(type: task, tags: [demo])`) and the commands run
  there, their output and exit codes copied into `## Observed`.
- **The notes**, written by hand in F-031's layout (the six fields, the opening line and its
  provenance, `## Observed`, `## Expected`), titles without `|`; the ledger rows appended.
- **Checks:** `npm test` (the inbox test), the privacy grep on the three notes, no change outside
  `docs/wingfoil-feedback/` and this task's file.
- **Commits** on `task/task-041-feedback-notes`: the three notes and the ledger (one commit), then
  the notes of this task.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-22: independent review of the body: approve after amendments. Applied: what 0.3.0
  changed for F-033, and `workflow finalize` told apart; a privacy criterion; no `wingfoil-cli`
  W-entry; the scratch project's setup and F-034's `workflow next`; the ledger's cells and the
  opening's provenance. (plan-043 and task-038 called the three topics one note, F-032; ruling H
  split them.)
- 2026-10-22: the three notes reproduced with WingFoil 0.3.0 alone in scratch projects (`npm ci`
  from `src/matrix/wingfoil-0.3.0/`, `wingfoil init --template Kanban`). A plan without `parent`
  is taken for an instance of `sw-life-cycle`, so F-033's case needs `parent`, set by editing the
  draft. Independent review of the branch: approve after amendments, the reviewer re-running every
  command on 0.3.0. Applied (`2dc8c3f`): F-033's Expected narrowed to a plan carrying `parent`;
  the scaffold's own commit; `--set` fills id and path tokens; F-034's title, in its ledger row
  too. Seen by the reviewer, outside these notes: `workflow finalize --dry-run` fails in 0.3.0
  (`Cannot read properties of undefined`), a possible later note.
- 2026-10-23, `2dc8c3f`: from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`
  (941 of 941), `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`,
  `index -- --check` and `workflow list` exit 0. A local run of the suite gave 11 failures in the
  `publish:pack` and `validate` tests, which spawn `dist/`: `dist/` was rebuilt during that run.
  CI run 39850352899: `failure`, in "Audit the root lockfile" on both jobs, for a reason outside
  this task: advisory GHSA-rxp7-6hxx-x8q5 (moderate) on `ip-address` 10.7.3, a transitive
  development dependency (`wingfoil@0.2.2` → `@modelcontextprotocol/sdk` → `express-rate-limit`),
  published after `main`'s last green run; `src/matrix/wingfoil-0.2.2/`'s lockfile has it too. The
  approver ruled (2026-10-23): bug-003 and a tooling task fix the lockfiles first; `main` is then
  merged into this branch and the CI run again.
- 2026-10-23: `main` merged into this branch (`a743b36`) after task-042 fixed bug-003; the branch's
  own changes are unchanged (the three notes, the ledger, this file). CI run 39974980600 on
  `a743b36`: `success`, both jobs.

