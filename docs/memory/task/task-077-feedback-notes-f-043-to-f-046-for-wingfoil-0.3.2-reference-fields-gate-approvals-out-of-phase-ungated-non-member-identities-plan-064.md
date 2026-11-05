---
id: task-077-feedback-notes-f-043-to-f-046-for-wingfoil-0.3.2-reference-fields-gate-approvals-out-of-phase-ungated-non-member-identities-plan-064
type: task
title: "Feedback notes F-043 to F-046 for WingFoil 0.3.2: reference fields, gate approvals out of phase, ungated, non-member identities (plan-064)"
status: draft
pack: ""            # content-only task (tooling-delivery v3, dl-039 R1), plan-064
depends_on: []
tags: ["feedback","wingfoil"]
---

## Context

plan-064 (rulings 1, 3 and 4) hosts this task, a content-only task under `tooling-delivery` v3
(dl-039 R1), on its own branch from the plan's and merged into it (task-064's precedent, plan-064
ruling 1). It writes the feedback notes of WingFoil UI's adoption feedback of 2026-11-02 that
WingFoil UI does not send to WingFoil itself and that held when reproduced on WingFoil 0.3.2
(plan-064 › Execution Notes, step 1):

- **F-043** (`request`): a frontmatter field cannot be declared as a reference to an element of a
  type; a `sprint` naming no Sprint is accepted at `memory submit`, and the element is never
  selected by a `where` on that field (bug-015). The check accepts a type's not-applicable value
  where the type allows it.
- **F-044** (`defect`): a gate's approval is offered before the phase that owns it: `workflow
  status` lists it as carried by no open workflow while the owning phase is pending, and `memory
  approve` moves the element at once (dl-041 G1 waits on it).
- **F-045** (`defect`): `workflow status` heads the elements waiting at a gate "ungated elements".
- **F-046** (`gap`): an identity that is not a member of `dna.yaml` › `team` starts a workflow and
  finalizes a non-approval step, each committed under its name.

## Acceptance

`npm run build` precedes the commands.

1. **Four notes**, `docs/wingfoil-feedback/F-043-…md` … `F-046-…md`, in the inbox format (README ›
   Rules, WingFoil dl-163 R4): the six fields in order (`id`, `title`, `kind` as listed in Context,
   `status: open`, `wingfoil_version: 0.3.2`, `answered_by: []`; `wingfoil_version` written by hand,
   the governance pin being 0.2.2); a body opening with `New note (task-077).`, its origin in this
   repository (public element ids: plan-064, the bug or decision-log it serves) and that WingFoil UI
   reported it on adopting this repository's packs; then `## Observed` with WingFoil 0.3.2's version
   and commit (`6de2e13c`), the configuration, the commands, their output (excerpts marked) and exit
   codes; then `## Expected`; no `## Replies`. Before writing each, the inbox is searched for a note
   on the same point (none expected).
2. **Reproduced with WingFoil alone**: each `## Observed` comes from a scratch project outside the
   repository (`git init`, WingFoil 0.3.2 installed with `npm ci` from `src/matrix/wingfoil-0.3.2/`,
   `wingfoil init --template Scrum` or `Kanban --no-interactive`, a fictional `.example` approver
   identity, configuration written by hand where a note needs one, never this repository's packs); a
   point that does not reproduce so goes to the approver (dl-019) before its note is written.
3. **No private content:** no local path, non-public repository, private project, the maintainer's
   name or email, or an intermediary session (`repository-practice` rules 1, 2); WingFoil UI named
   by project; WingFoil references are public ids, tags or commits.
4. **The ledger** in `docs/wingfoil-feedback/README.md` gains four rows (cells equal to the
   frontmatter, `answered_by` empty); `Last sync` unchanged (the first sync stays at W10, plan-062's
   note). No `wingfoil-cli` entry (rule 5 at the pin bump).
5. **Checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments first;
   then once on the frozen commit the branch CI `success`, both jobs, run id and durations recorded,
   and dl-039's local list on Node.js 22.21.0 after `npm ci` and `npm run build`; `node --test
   dist/tests/wingfoil-feedback.test.js dist/tests/feedback-note.test.js` and `npm run lint` exit 0
   locally. No file changes outside `docs/wingfoil-feedback/` and this task's file.
6. **Delivery:** `--no-ff` merge into `bug/ui-feedback-2026-11-02`, plan-064's branch, not `main`
   (plan-064 ruling 1, task-064's precedent).

## Design

Branch `task/task-077-feedback-notes-ui` from `bug/ui-feedback-2026-11-02` at this task's add. One
commit per note with its ledger row; the notes from the reproductions of Acceptance 2, in a scratch
project per note (or one with a fresh element per note); the notes' wording reviewed against
WingFoil's public ids. Then the checks and the notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written under plan-064 (step 4), added on its branch, no other task added on any
  branch meanwhile (W-14).
