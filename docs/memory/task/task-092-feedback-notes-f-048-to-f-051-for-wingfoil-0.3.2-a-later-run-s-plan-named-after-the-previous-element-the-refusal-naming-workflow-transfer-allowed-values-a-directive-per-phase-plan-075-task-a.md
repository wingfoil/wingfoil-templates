---
id: task-092-feedback-notes-f-048-to-f-051-for-wingfoil-0.3.2-a-later-run-s-plan-named-after-the-previous-element-the-refusal-naming-workflow-transfer-allowed-values-a-directive-per-phase-plan-075-task-a
type: task
title: "Feedback notes F-048 to F-051 for WingFoil 0.3.2: a later run's plan named after the previous element, the refusal naming workflow transfer, allowed values, a directive per phase (plan-075 task A)"
status: approved
pack: ""            # content-only task (tooling-delivery v4, dl-039 R1), plan-075 task (A)
depends_on: []
tags: ["feedback","wingfoil"]
---

## Context

plan-075 (task (A) of its outline, point 3) hosts this task, a content-only task under
`tooling-delivery` v4 (dl-039 R1), as task-077 was. It settles the row "Two feedback notes to
WingFoil" of `docs/owed-items.md` (plan-073 ruling 5, step 2; plan-074 rulings, point 10): the two
WingFoil findings that plan-073's run of the `governance/feedback` workflows on WingFoil 0.3.2
found (plan-073 › Execution Notes, step 2), with the two requests that spec-003 leaves to WingFoil
(spec-003 S3-O1, S3-O2):

- **F-048** (`gap`): a second run of a self-creating main workflow (one that declares no
  `element` and creates its element at a step, spec-017 §3.4), started while the first run is
  still open, takes the first run's element as its context element (spec-017 §3.5: the active
  instance's element), so its plan's id (`{phase}` of the plan type's `id_pattern`), `phase` and
  `element` name the first run's element, while `workflow status` shows the element the second run
  is bound to (spec-017 §7.1). A gap, not a defect: 0.3.2 follows its rule (§3.5 applies to every
  workflow that declares no element), but the rule does not tell a self-creating run, whose bound
  element arrives later, from one that creates none, so it names that run's plan after an
  unrelated element. Distinct from F-038 (which fields `workflow start` fills at all).
- **F-049** (`defect`): `workflow adopt --element` on an element that another open run owns is
  refused with a message telling the user to "move it with workflow transfer", a command 0.3.2
  does not have; no verb moves the element while its owner stays open (only ending or
  abandoning the owning run releases it). `workflow adopt` implements WingFoil dl-187, titled
  "adopt, rekey, transfer" (spec-017 §7.11), so the message names a verb that 0.3.2 does not
  ship. Distinct from F-036 (no verb restructures
  memory), which already points to dl-187 for a transfer: F-049 is the refusal's message in the
  shipped release; and from F-032 (no suspend).
- **F-050** (`request`): an allowed-values key for a frontmatter field in `memory.yaml`, so that a
  value outside its list is refused at `memory submit`, as the required-fields check refuses an
  empty field; once a release has it, a pack may declare its list there from a list parameter
  (spec-003 §3.3, S3-O1). It builds on the required-fields check at `memory submit` and on
  `template.frontmatter`'s keys (`required`, `not_applicable_allowed`, `lists`, `exempt`).
  Distinct from F-043 (a field as a reference to an element of a type) and
  F-018, which F-043 cites (`where` on `iterate_over`); names F-043.
- **F-051** (`request`): a directive bound to a workflow phase, so that the agent at that phase's
  step reads it without an `agent.execute` action naming it in its text; once a release has it, a
  conditional entry's workflow may bind its directive and spec-003 §7.2's first path may become
  optional (S3-O2). Today `workflow next` lists a step's directives from `roles.yaml` only (the
  role's entry and `global`, spec-017 §6.2); an `agent.execute` naming a directive is printed as
  action text.
  Distinct from F-016 (a phase cannot declare its method) and F-026 (a phase has
  one role, directives per role); names both.

The notes name no pack beyond what WingFoil alone shows: the reproduction uses WingFoil's own
templates and, where a note needs it, configuration written by hand, never this repository's packs
or the element ids of plan-073's run.

## Acceptance

`npm run build` precedes the commands.

1. **Four notes**, `docs/wingfoil-feedback/F-048-…md` … `F-051-…md`, in the inbox format (README ›
   Rules, WingFoil dl-163 R4): the six fields in order (`id`, `title`, `kind` as Context says,
   `status: open`, `wingfoil_version: 0.3.2`, `answered_by: []`; `wingfoil_version` written by
   hand, the governance pin being 0.2.2); a body opening with `New note (task-092).`, its origin in
   this repository (public element ids: plan-073 for F-048 and F-049, spec-003 for F-050 and
   F-051), the WingFoil rule or command it builds on (F-048: spec-017 §3.4, §3.5, §7.1; F-049:
   spec-017 §7.11, WingFoil dl-187; F-050: the required-fields check, `template.frontmatter`'s
   keys; F-051: spec-017 §6.2) and the notes it is distinct from or names (Context); then
   `## Observed` with WingFoil 0.3.2's version and commit (`6de2e13c`), the configuration, the
   commands, their output (excerpts marked) and exit codes, and, for a request, what 0.3.2 does
   instead; then `## Expected`; no `## Replies`. Before writing each, the inbox is searched for a
   note on the same point (Context's list checked by the body's review).
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
- F-048: WingFoil's own `bug-ingest` (self-creating, no `element`, the plan type's default
  `{workflow}-{phase}-plan`), no configuration written: `workflow start bug-ingest`, a bug
  captured with `memory add --type bug --workflow <plan> --step <capture>` (the links that bind
  the run to it), submitted and approved, no `workflow end`; `workflow start bug-ingest` again,
  the new plan's id, `phase` and `element` read from its file, a second bug captured the same way,
  `workflow status`; for contrast, the same after `workflow end` of the first run (no `element`,
  `phase` not the first bug's).
- F-049: `workflow start bug-ingest` first (its `capture` on the frontier, no created element); then
  a main workflow written by hand whose step adds a bug, started, its bug added with `memory add
  --workflow … --step …` and left open; then `workflow adopt <bug-ingest plan> --element bug:<id>
  --reason "…"`: exit 1 and the message; `wingfoil workflow --help`, showing no `transfer`; the same
  `adopt` after the owning run is ended or deprecated, passing that check. (Started the other way
  round, `bug-ingest`'s plan would be named after the other run's bug, F-048.)
- F-050: a required field and a would-be key written in `memory.yaml` (for example
  `template.frontmatter.allowed: {<field>: [a, b]}`), loaded since `template.frontmatter` passes
  unknown keys through, with whatever warning the load prints recorded; an element with a value
  outside the list, `memory submit` exit 0 (what 0.3.2 does instead); the shipped schema's keys
  cited.
- F-051: a directive written by hand and a workflow whose phase names it in no action; `workflow
  next` at that step, its `directives:` line from `roles.yaml` (the role's entry and `global`),
  without it; the same with `'agent.execute(directive: <id>)'`: the action text printed with its
  binding `wingfoil agent execute`, the `directives:` line unchanged (what 0.3.2 offers instead:
  that action text, or a `roles.yaml` binding per role, F-026's point).

One commit per note with its ledger row. Then the build review, the checks and the notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-16: written under plan-075 (step 2), added on `main` (`5c6ab739`), no other task added
  meanwhile (W-14).
- 2026-11-16: independent review of the body: approve after amendments, nothing blocking; six
  should-fix and two nits, applied in the commit that records this note: F-048's mechanism (a
  self-creating workflow, the open first run, spec-017 §3.5's context element) and its `defect`
  argued, reproduced with WingFoil's own `bug-ingest`; F-049's command (`--reason`, the frontier
  step, the owner left open) and WingFoil dl-187; F-050's would-be key passed through; F-051's
  `directives:` line from `roles.yaml` only; the WingFoil rule per note; nits: no hand-written
  configuration for F-048, no plan-073 ids in `## Observed`. The untracked fixture draft is moved
  aside before the local checks (Acceptance 6's clean tree). A re-review follows (F-048's kind).
- 2026-11-16: re-review of the amendments: approve after amendments, nothing blocking; three
  should-fix and four nits. Applied in the commit that records this note: F-048's bugs captured
  with `--workflow` and `--step` (the links that bind the run), the contrast's reading; F-049's
  owner released only by ending or abandoning its run, dl-187 cited by its title; nits: F-050's
  load warning recorded, F-051's `roles.yaml` (the role's entry and `global`) and the action's
  binding. Not applied: F-048's `kind`. The re-review reads 0.3.2's `§3.5` as applying to every
  workflow that declares no element, by design (the plan's `element` holds the context element's
  id), and recommends `gap`; plan-075 point 3, as ruled, says `defect`, so the kind goes to the
  approver before `submit`.
- 2026-11-16: the approver ruled F-048's `kind`: `gap`, as the re-review recommended (plan-075
  point 3 said `defect`; the change listed at plan-075's close).
- 2026-11-16: started (backlog → in-progress, `f1aaad11`) on `task/task-092-feedback-notes` from
  `main` at `3b75c055`. Each note reproduced with WingFoil 0.3.2 (`6de2e13c`) alone, in a scratch
  project of its own (`init --template Kanban --no-interactive`, a fictional `.example` approver
  added with `dna add team.members`), as Design lists; every point held. Deviation from Design and
  Context, F-049: the owner is not released by ending or deprecating its run; after `workflow end`
  of the owning run, and on a copy after `memory deprecate` of its plan, `adopt` gives the same
  refusal (exit 1), so nothing moves the element (the first wording of Context, which the
  re-review's amendment had narrowed); the note records what ran. F-051: the `agent.execute`
  action's binding carries no directive (F-034 cited). F-050: no command printed a warning for the
  would-be key. Notes: F-048 `68e6aa80`, F-049 `5babb242`, F-050 `f5bf5605`, F-051 `ff917ccb`, one
  commit each with its ledger row. Red by mutation (dl-018 R2's exception, as task-077), each
  mutation reverted after its run: a gap in the numbering 3 failing, a ledger cell changed 2, the
  opening line changed 2, two fields swapped 2, `## Expected` renamed 2; `New note (task-092).`
  once in each of the four notes; unmutated, `node --test dist/tests/wingfoil-feedback.test.js
  dist/tests/feedback-note.test.js` 13 passing, `npm run lint` exit 0.
- 2026-11-16: independent build review of `f003ae18`: approve after amendments, nothing blocking;
  it reproduced the four notes on 0.3.2, F-049's deviation included. Applied in the commit that
  records this note: F-048's commit id in the note above (`68e6aa80`, the amended one); nits: the
  excerpt headers say a command's output may be left out, F-049's "no verb 0.3.2 lists", F-051's
  directive not `global`. No re-review: the amendments change wording, not a request. F-049's
  deviation from Design (ending or deprecating the owner does not release the element, which the
  note observes and its Expected asks) goes to the approver (dl-019, Acceptance 2).
- 2026-11-16: the approver ruled F-049's deviation: the note kept as written (the refusal after
  `workflow end` and `memory deprecate` observed, and its Expected asking that such an element be
  adoptable or movable).
- 2026-11-16: checks (dl-039 R1, R2), once, on the frozen commit `53ed49c7`: the branch CI, run
  43909214128, `success`, jobs `validate (22.12.0, 1)` 7 min 39 s, `(22.12.0, 2)` 6 min 1 s,
  `(22.21.0, 1)` 11 min 27 s, `(22.21.0, 2)` 5 min 10 s (none over 25 minutes); from a clean
  working tree on Node.js 22.21.0 after `npm ci` and `npm run build`: `npm run
  validate:publication`, the golden tree in publication mode and `npm run -s wingfoil -- workflow
  list` exit 0, `directives list --format json` with `"warnings": []`, the tree still clean. This
  commit changes only `docs/memory`: no new run. Privacy check of the branch's diff and messages:
  no local or scratch path, no maintainer name or email, no private project, no intermediary
  session.
