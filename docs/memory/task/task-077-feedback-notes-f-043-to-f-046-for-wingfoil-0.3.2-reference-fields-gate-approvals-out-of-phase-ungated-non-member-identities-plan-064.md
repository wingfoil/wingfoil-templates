---
id: task-077-feedback-notes-f-043-to-f-046-for-wingfoil-0.3.2-reference-fields-gate-approvals-out-of-phase-ungated-non-member-identities-plan-064
type: task
title: "Feedback notes F-043 to F-046 for WingFoil 0.3.2: reference fields, gate approvals out of phase, ungated, non-member identities (plan-064)"
status: in-review
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
  type; a `sprint` naming no Sprint is accepted at `memory submit`. The consequence for a `where` on
  that field (the element never selected) is bug-015's, cited outside `## Observed`. A check keeps a
  type's not-applicable value (`n/a — <reason>`, 0.3.2's `not_applicable_allowed`) where the type
  allows it. Distinct from F-018 (`where` on `iterate_over`).
- **F-044** (`request`): an element that a later phase of an open instance will select is offered
  for approval before that phase: `workflow status` lists it among the elements no open workflow
  carries (WingFoil spec-017 §5.1 defines that list), and `memory approve` moves it at once
  (REQ-SEC-03 limits only who approves). The request: not offered before its phase. dl-041 G1 waits
  on it. Distinct from F-039 (an approval step that returns) and F-025; names F-045.
- **F-045** (`request`): the same list is headed "ungated elements", meaning "not carried by a
  workflow", though each element is waiting at a gate (spec-017 §5.1); the request: a heading that
  says so (for example "elements waiting at a gate outside any workflow"). Names F-044.
- **F-046** (`request`): an identity that is not a member of `dna.yaml` › `team` starts a workflow
  and finalizes a non-approval step, each committed under its name; WingFoil requires an identity
  and checks roles for approvals only (REQ-SEC-01, REQ-SEC-03), so this is a request: membership
  checked for every step that commits. Distinct from F-041 (a role no member holds).

## Acceptance

`npm run build` precedes the commands.

1. **Four notes**, `docs/wingfoil-feedback/F-043-…md` … `F-046-…md`, in the inbox format (README ›
   Rules, WingFoil dl-163 R4): the six fields in order (`id`, `title`, `kind: request`, `status:
   open`, `wingfoil_version: 0.3.2`, `answered_by: []`; `wingfoil_version` written by hand, the
   governance pin being 0.2.2); a body opening with `New note (task-077).`, its origin in this
   repository (public element ids: plan-064, the bug or decision-log it serves), that WingFoil UI
   reported it on adopting this repository's packs, the WingFoil rule it builds on, where one
   applies (spec-017 §5.1, REQ-SEC-01, REQ-SEC-03; for F-043, 0.3.2's `not_applicable_allowed`) and
   the notes it is distinct from (Context); then `## Observed` with WingFoil 0.3.2's version and
   commit (`6de2e13c`), the configuration, the commands, their output (excerpts marked) and exit
   codes; then `## Expected` (for F-043, where the check runs, at `memory submit` as the
   required-fields check does, its error, and a reference to a `deprecated` element); no `##
   Replies`. Before writing each, the inbox is searched for a note on the same point (none found by
   the body's review).
2. **Reproduced with WingFoil alone**, each `## Observed` from a scratch project outside the
   repository (`git init`, WingFoil 0.3.2 installed with `npm ci` from `src/matrix/wingfoil-0.3.2/`,
   `wingfoil init --template <Scrum|Kanban> --no-interactive`, fictional `.example` identities,
   configuration written by hand where a note needs one, never this repository's packs), as Design
   lists per note; a point that does not reproduce so goes to the approver (dl-019) before its note
   is written.
3. **No private content:** no local path, non-public repository, private project, the maintainer's
   name or email, or an intermediary session (`repository-practice` rules 1, 2); WingFoil UI named
   by project; WingFoil references are public ids, tags or commits.
4. **The ledger** in `docs/wingfoil-feedback/README.md` gains four rows (cells equal to the
   frontmatter, `answered_by` empty, any `|` in a title escaped); `Last sync` unchanged (the first
   sync stays at W10, plan-062's note). No `wingfoil-cli` entry (rule 5 at the pin bump).
5. **Checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments first;
   then once on the frozen commit the branch CI `success`, both jobs, run id and durations recorded,
   and dl-039's local list on Node.js 22.21.0 after `npm ci` and `npm run build`
   (`validate:publication`, the golden tree in publication mode, `workflow list`); `node --test
   dist/tests/wingfoil-feedback.test.js dist/tests/feedback-note.test.js` and `npm run lint` exit 0
   locally. No file changes outside `docs/wingfoil-feedback/` and this task's file.
6. **Delivery:** `--no-ff` merge into `bug/ui-feedback-2026-11-02`, plan-064's branch, not `main`
   (plan-064 ruling 1, task-064's precedent).

## Design

Branch `task/task-077-feedback-notes-ui` from `bug/ui-feedback-2026-11-02` at this task's add. Red
steps: none of code (dl-018 R2's exception, as task-064 and task-073); the inbox tests checked by
mutation instead, on a scratch copy: a gap in the numbering (`assertNumbering`), a ledger cell
changed (`assertLedger`), the opening line changed (`assertOpenings`), two fields swapped
(`assertFields`), `## Expected` removed (`assertSections`), each failing, and a count of `New note
(task-077).` once per note. The reproduction per note, each in a scratch project:
- F-043: a `sprint` type written by hand, `task.template.frontmatter.required: [sprint]` with
  `not_applicable_allowed: [sprint]`; a task whose `sprint` names no Sprint, `memory submit` exit 0;
  a task with `n/a — <reason>`, accepted (what a check keeps).
- F-044: a three-phase custom workflow on `defaults` (enter the `pending` gate, work, decide with
  `memory.approve` and `approval`); with `work` current, `workflow status` and `memory approve`
  (`pending → approved`, exit 0); then what the instance does once `decide` is reached (`workflow
  next`, `workflow status`): whether the step closes or waits.
- F-045: one element in `pending`, `workflow status`.
- F-046: a member holding `approver` and a second git identity in no `team` entry; with the second,
  `workflow start bug-ingest` and `workflow finalize` of `capture`; `git log --format='%an <%ae>'`.

One commit per note with its ledger row. Then the build review, the checks and the notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written under plan-064 (step 4), added on its branch, no other task added on any
  branch meanwhile (W-14).
- 2026-11-05: independent review of the body: approve after amendments, nothing blocking; applied:
  every note `request` (F-044 and F-045 follow spec-017 §5.1, F-046 REQ-SEC-01 and REQ-SEC-03),
  F-044 and F-045 naming each other, the reproduction per note, the notes each is distinct from, the
  red steps by mutation of the inbox tests, F-043's consequence outside `## Observed` and its
  Expected's place, error and `deprecated` case, the second identity, the nits.
- 2026-11-05: re-review: approve; its small findings applied (the ledger's escaped `|`, dl-039's
  local list named, F-043's rule).
- 2026-11-05: started (backlog → in-progress, `0e601ba`) on `task/task-077-feedback-notes-ui` from
  `bug/ui-feedback-2026-11-02` at `299c065`. Each note reproduced with WingFoil 0.3.2 alone in a
  scratch project of its own (`init --template Kanban --no-interactive`, a fictional `.example`
  approver added with `dna add team.members`), as Design lists; every point held. Deviation from
  Design, F-046: `bug-ingest`'s `capture` completed from its evidence (the bug added and submitted
  by the outside identity), so no `workflow finalize` was needed; the note records what ran. Notes:
  F-043 `f5e69ed`, F-044 `628b8b2`, F-045 `c4861ba`, F-046 `eac4f47`, one commit each with its
  ledger row. Red by mutation (dl-018 R2's exception, as task-064 and task-073), each mutation
  reverted after its run: a gap in the numbering 3 failing, a ledger cell changed 2, the opening
  line changed 2, two fields swapped 2, `## Expected` renamed 2; `New note (task-077).` once in each
  of the four notes; unmutated, `node --test dist/tests/wingfoil-feedback.test.js
  dist/tests/feedback-note.test.js` 13 passing, `npm run lint` and `check:packs` exit 0.
- 2026-11-05: independent build review of `eac4f47`: approve after amendments, nothing blocking; it
  reproduced the four notes on 0.3.2 and checked their WingFoil claims in the shipped `dist`;
  applied in `97345d7`: excerpts marked (`…`, wrapped lines said), exit codes stated, F-046's
  opening, F-043's lesser request marked as such; this note records the mutations and F-046's
  deviation. No re-review: the amendments change wording, not a request.
- 2026-11-05: checks (dl-039 R1, R2), once, on the frozen commit `97345d7`: the branch CI, run
  42101480186, `success`, jobs Node.js 22.21.0 12 min 28 s and 22.12.0 20 min 27 s (none over 25
  minutes); from a clean working tree on Node.js 22.21.0 after `npm ci` and `npm run build`:
  `npm run validate:publication`, the golden tree in publication mode and `npm run -s wingfoil --
  workflow list` exit 0, `directives list --format json` with `"warnings": []`. This commit
  changes only `docs/memory`: no new run. Privacy check of the branch's diff and messages: no local
  or scratch path, no maintainer name or email, no private project, no intermediary session.
