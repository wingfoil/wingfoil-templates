---
id: task-092-feedback-notes-f-048-to-f-051-for-wingfoil-0.3.2-a-later-run-s-plan-named-after-the-previous-element-the-refusal-naming-workflow-transfer-allowed-values-a-directive-per-phase-plan-075-task-a
type: task
title: "Feedback notes F-048 to F-051 for WingFoil 0.3.2: a later run's plan named after the previous element, the refusal naming workflow transfer, allowed values, a directive per phase (plan-075 task A)"
status: draft
pack: ""            # content-only task (tooling-delivery v4, dl-039 R1), plan-075 task (A)
depends_on: []
tags: ["feedback","wingfoil"]
---

## Context

plan-075 (task (A) of its outline, point 3) hosts this task, a content-only task under
`tooling-delivery` v4 (dl-039 R1), as task-077 was. It settles the row "Two feedback notes to
WingFoil" of `docs/owed-items.md` (plan-073 ruling 5, step 2; plan-074 rulings, point 10): the two
WingFoil defects that plan-073's run of the `governance/feedback` workflows on WingFoil 0.3.2
found (plan-073 › Execution Notes, step 2), with the two requests that spec-003 leaves to WingFoil
(spec-003 S3-O1, S3-O2):

- **F-048** (`defect`): a later run of a main workflow over a type whose `id_pattern` takes the
  element's id gets a plan named after the previous run's element: id, `phase` and `element` name
  the first element, while `workflow status` shows the run's own. Distinct from F-038 (which
  fields `workflow start` fills at all).
- **F-049** (`defect`): `workflow adopt --element` on an element that another run owns is refused
  with a message telling the user to "move it with workflow transfer", a command 0.3.2 does not
  have; nothing else moves the element. Distinct from F-036 (no verb restructures memory) and
  F-032 (no suspend).
- **F-050** (`request`): an allowed-values key for a frontmatter field in `memory.yaml`, so that a
  value outside its list is refused at `memory submit`, as the required-fields check refuses an
  empty field; once a release has it, a pack may declare its list there from a list parameter
  (spec-003 §3.3, S3-O1). Distinct from F-043 (a field as a reference to an element of a type) and
  F-018, which F-043 cites (`where` on `iterate_over`); names F-043.
- **F-051** (`request`): a directive bound to a workflow phase, so that the agent at that phase's
  step reads it without an `agent.execute` action naming it in its text; once a release has it, a
  conditional entry's workflow may bind its directive and spec-003 §7.2's first path may become
  optional (S3-O2). Distinct from F-016 (a phase cannot declare its method) and F-026 (a phase has
  one role, directives per role); names both.

The notes name no pack beyond what WingFoil alone shows: the reproduction uses WingFoil's own
templates and configuration written by hand, never this repository's packs.

## Acceptance

`npm run build` precedes the commands.

1. **Four notes**, `docs/wingfoil-feedback/F-048-…md` … `F-051-…md`, in the inbox format (README ›
   Rules, WingFoil dl-163 R4): the six fields in order (`id`, `title`, `kind` as Context says,
   `status: open`, `wingfoil_version: 0.3.2`, `answered_by: []`; `wingfoil_version` written by
   hand, the governance pin being 0.2.2); a body opening with `New note (task-092).`, its origin in
   this repository (public element ids: plan-073 for F-048 and F-049, spec-003 for F-050 and
   F-051), the WingFoil rule or command it builds on and the notes it is distinct from or names
   (Context); then `## Observed` with WingFoil 0.3.2's version and commit (`6de2e13c`), the
   configuration, the commands, their output (excerpts marked) and exit codes, and, for a request,
   what 0.3.2 does instead; then `## Expected`; no `## Replies`. Before writing each, the inbox is
   searched for a note on the same point (Context's list checked by the body's review).
2. **Reproduced with WingFoil alone**, each `## Observed` from a scratch project outside the
   repository (`git init`, WingFoil 0.3.2 installed with `npm ci` from `src/matrix/wingfoil-0.3.2/`,
   `wingfoil init --template <Scrum|Kanban> --no-interactive`, fictional `.example` identities,
   configuration written by hand where a note needs one, never this repository's packs), as Design
   lists per note; a point that does not reproduce so goes to the approver (dl-019) before its note
   is written.
3. **No private content:** no local or scratch path, non-public repository, private project, the
   maintainer's name or email, or an intermediary session (`repository-practice` rules 1, 2);
   WingFoil references are public ids, tags or commits.
4. **The ledger** in `docs/wingfoil-feedback/README.md` gains four rows (cells equal to the
   frontmatter, `answered_by` empty, any `|` in a title escaped); `Last sync` unchanged (the first
   sync stays at W10). No `wingfoil-cli` entry (rule 5 at the pin bump).
5. **The owed row** "Two feedback notes to WingFoil" moves from Open to Closed in
   `docs/owed-items.md`, settled by "F-048 … F-051 (task-092)", in this task's close.
6. **Checks** (`tooling-delivery` v4 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, its run id and every job's
   duration recorded, and dl-039's local list on Node.js 22.21.0 from a clean working tree after
   `npm ci` and `npm run build` (`validate:publication`, the golden tree in publication mode,
   `workflow list`); `node --test dist/tests/wingfoil-feedback.test.js
   dist/tests/feedback-note.test.js` and `npm run lint` exit 0 locally. No file changes outside
   `docs/wingfoil-feedback/`, `docs/owed-items.md` and this task's file.
7. **Delivery:** branch `task/task-092-feedback-notes`, merged `--no-ff` into `main` on the
   approver's OK (plan-075 point 2); `main`'s CI read after the merge, its run id and every job's
   duration recorded; the close records the privacy check of the branch's diff and messages.

## Design

Branch `task/task-092-feedback-notes` from `main` at this task's `backlog`. Red steps: none of
code (dl-018 R2's exception, as task-077); the inbox tests checked by mutation instead, on a scratch
copy: a gap in the numbering (`assertNumbering`), a ledger cell changed (`assertLedger`), the
opening line changed (`assertOpenings`), two fields swapped (`assertFields`), `## Expected` removed
(`assertSections`), each failing, and a count of `New note (task-092).` once per note. The
reproduction per note, each in a scratch project of its own (a fictional `.example` approver added
with `dna add team.members`):
- F-048: a main workflow written by hand over a type whose `id_pattern` takes the element's id
  (as `bug-ingest`'s plan does); two elements; a first run started, its element captured and
  the run completed; a second run started for the second element: the plan's id, `phase` and
  `element` read from the file, and `workflow status`.
- F-049: a main workflow whose step adds an element (`memory add --workflow … --step …`); then
  `workflow adopt <other-run> --element <type>:<id>` from a second run: the exit code and message;
  `wingfoil --help` and `wingfoil workflow --help`, showing no `transfer`.
- F-050: a field with a fixed set of values written in `memory.yaml` (required); an element with a
  value outside the set, `memory submit` exit 0; `wingfoil --help` or the schema showing no key for
  allowed values (what 0.3.2 does instead).
- F-051: a directive written by hand and a workflow whose phase does not name it in an action;
  `workflow next` at that step, the directive not listed for the agent; the same with an
  `agent.execute` action naming it, listed (what 0.3.2 offers instead).

One commit per note with its ledger row. Then the build review, the checks and the notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-16: written under plan-075 (step 2), added on `main` (`5c6ab739`), no other task added
  meanwhile (W-14).
