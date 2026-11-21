---
id: task-101-feedback-note-f-052-for-wingfoil-0.3.2-a-directive-no-role-binds-and-no-step-names-raises-no-warning-plan-078-task-101
type: task
title: "Feedback note F-052 for WingFoil 0.3.2: a directive no role binds and no step names raises no warning (plan-078 task-101)"
status: in-progress
pack: ""            # content-only task (tooling-delivery v4, dl-039 R1), plan-078 task-101
depends_on: []
tags: ["feedback","wingfoil"]
---

## Context

plan-078 (point 6 of its outline, ruled on 2026-11-21) hosts this task, a content-only task under
`tooling-delivery` v4 (dl-039 R1), as task-092 was. It writes the one WingFoil-side point that
plan-078's `explore` kept and the approver confirmed at `additional-points`: WF-1 of the inventory
`docs/retrospectives/2026-11-21-pack-governance-feedback-friction-inventory.md` (2026-11-21, §6),
W1 of the retrospective's decision-log dl-043. The inventory, dl-043 and the approver's ruling on
this task's base are on plan-078's branch until its close (dl-040 D2). It settles the row "A
`custom/` directive no role binds" of `docs/owed-items.md` (task-099 › Execution Notes, criterion
7), whose trigger is this retrospective.

- **F-052** (`request`): `directives list` reports a custom directive that no role binds and that
  is not `global` as `"assignment": "unassigned"`, and still returns `"warnings": []`;
  `workflow list` returns `"diagnostics": []`, and `workflow next` `"directiveWarnings": []`. No
  step lists such a directive (spec-017 §6.2: the role's entry in `roles.yaml` and `global`), as
  F-051's Observed shows. It builds on the warning 0.3.2 already gives for the reverse case: a
  binding in `roles.yaml` with no directive file (`directive '<id>' bound to role '<role>' has no
  directive file`, absent in 0.3.0); and on the step's warning for a role with no directive (`no
  directives assigned to role '<role>'`, task-099 › criterion 7).
- **The request:** a warning in `directives list`'s `warnings`, beside the dangling binding's, for
  a directive that no role binds, that is not `global` and that no workflow action names;
  `workflow list`'s `diagnostics` as the alternative. None for a directive an
  `agent.execute(directive: <id>)` action names, unassigned by design (plan-074 › Execution Notes,
  step 2, Listing; spec-001 §6.5; spec-003 §7.1, §7.2). That exemption asks WingFoil for something
  new: 0.3.0 and 0.3.2 print `agent.execute`'s `directive:` argument as a built-in token's text,
  its binding does not carry it and an unknown id is accepted (spec-003 §7.2; F-051, F-034). A
  fresh `init` of the `Kanban` template has no unassigned directive, so the warning would not fire
  on a new project.
- **Distinct from** F-051 (a phase cannot bind a directive), which asks for a binding, not for a
  warning on a missing one; from F-041 (a phase role that no member holds is accepted silently),
  its neighbour for roles; names F-034 (the action's binding drops its arguments).

**Timing.** WingFoil's v0.4 release planning started on 2026-11-03 (dl-040 › Context) and no
source in this repository records it closed. The approver ruled on 2026-11-21 (plan-078 ›
Execution Notes, on its branch) that this task starts from `main`, on a branch of its own, and
merges into `main` alone on the approver's OK (dl-040 D2), `--no-ff`, not from plan-078's branch.
Deviation from D2: this task was added on `main` (`711761db`), not on its branch; no other task was
added meanwhile (W-14). No notice (plan-078 ruling 6): the inbox is synced at this repository's
adoption (W10).

The note names no pack beyond what WingFoil alone shows: the reproduction uses WingFoil's own
`Kanban` template and configuration written by hand, never this repository's packs or the
fixtures of task-099.

## Acceptance

`npm run build` precedes the commands.

1. **One note**, in `docs/wingfoil-feedback/`,
   `F-052-a-directive-that-no-role-binds-and-no-step-names-raises-no-warning.md`, titled "A
   directive that no role binds and no step names raises no warning", in the inbox format (README
   › Rules, WingFoil dl-163 R4): the six fields in order (`id`, `title`, `kind: request`,
   `status: open`, `wingfoil_version: 0.3.2`, `answered_by: []`; `wingfoil_version` written by
   hand, the governance pin being 0.2.2); a body opening with `New note (task-101).`, its origin
   in this repository (public element ids: task-099, plan-078), the WingFoil behaviour it builds
   on (spec-017 §6.2; `directives list`'s `assignment` and its dangling-binding warning; the
   step's `directiveWarnings`; `workflow list`'s `diagnostics`), the command that should warn
   (Context) and the notes it is distinct from or names (F-051, F-041, F-034);
   then `## Observed` with the version and commit of 0.3.0 (`cc31d7a8`) and 0.3.2 (`6de2e13c`),
   the configuration, the commands, their output (excerpts marked) and exit codes, and what 0.3.2
   does instead; then `## Expected`; no `## Replies`. Before writing it, the inbox is searched for
   a note on the same point (Context's list checked by the body's review).
2. **Reproduced with WingFoil alone** on 0.3.0 and 0.3.2, each from a scratch project outside the
   repository (`git init`, WingFoil installed with `npm ci` from `src/matrix/wingfoil-<v>/`,
   `wingfoil init --template Kanban --no-interactive`, a fictional `.example` identity), as Design
   lists; if the point does not reproduce so on either version, it goes to the approver (dl-019)
   before the note is written.
3. **No private content:** no local or scratch path, non-public repository, private project, the
   maintainer's name or email, or an intermediary session (`repository-practice` rules 1, 2);
   WingFoil references are public ids, tags or commits.
4. **The ledger** in `docs/wingfoil-feedback/README.md` gains one row (cells equal to the
   frontmatter, `answered_by` empty); `Last sync` unchanged. No `wingfoil-cli` entry (rule 5 at
   the pin bump): the behaviour is 0.3.x's, the pin 0.2.2.
5. **The owed row** "A `custom/` directive no role binds" moves from Open to Closed in
   `docs/owed-items.md`, settled by "F-052 (task-101)", in this task's close.
6. **Checks** (`tooling-delivery` v4 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, its run id and every job's
   duration recorded (a job over 25 minutes goes to the approver, dl-039 R3), and dl-039's local
   list on Node.js 22.21.0 from a clean working tree after `npm ci` and `npm run build`
   (`validate:publication`, the golden tree in publication mode, `workflow list`);
   `node --test dist/tests/wingfoil-feedback.test.js dist/tests/feedback-note.test.js` and
   `npm run lint` exit 0 locally. No file changes outside `docs/wingfoil-feedback/`,
   `docs/owed-items.md` and this task's file.
7. **Delivery:** the branch `task/task-101-feedback-note` from `main`, in a worktree, merged
   `--no-ff` into `main` alone on the approver's OK (Context, Timing); `main`'s CI after the push
   read, its run id and every job's duration recorded here, and in plan-078's notes on its own
   branch, outside this task's diff (as task-092 left it to plan-075); the close records the
   privacy check of the branch's diff and messages.

## Design

Branch `task/task-101-feedback-note` from `main` at this task's `backlog`. Red steps: none of code
(dl-018 R2's exception, as task-092); the inbox tests checked by mutation instead, on a scratch
copy, each mutation reverted after its run: a gap in the numbering (`assertNumbering`), a ledger
cell changed (`assertLedger`), the opening line changed (`assertOpenings`), two fields swapped
(`assertFields`), `## Expected` removed (`assertSections`), each failing; and `New note
(task-101).` counted once in the note.

The reproduction, on 0.3.0 and on 0.3.2, each in a scratch project of its own (a fictional
`.example` identity as the git identity and, with `dna add team.members`, as a member holding
`approver` and `developer`):
- `wingfoil directive create --name route-rules` (the command commits it); `wingfoil directives
  list --format json`: the entry of `route-rules` (`"roles": []`, `"global": false`,
  `"assignment": "unassigned"`) and `"warnings": []`; `wingfoil workflow list --format json`:
  `"diagnostics": []`; both exit 0.
- `wingfoil workflow next --format json` on a main workflow written by hand (`format: 1`, no
  `element`, one phase of role `developer` with the action `'memory.add(type: bug)'`), started:
  its directives without `route-rules` and `"directiveWarnings": []`.
- The reverse case: `ghost` bound to `developer` in `roles.yaml` with no file, committed;
  `directives list`'s `warnings`: on 0.3.2 the dangling-binding warning, on 0.3.0 `[]`; then
  removed and committed.
- The contrast case, the one the Expected keeps silent: the same phase with
  `'agent.execute(directive: route-rules)'` before `memory.add`, committed; `workflow next` prints
  it as action text only, its binding without the id; with `no-such-directive` instead, the same
  output with that id and `workflow list`'s `"diagnostics": []`, so neither release reads the
  argument.

One commit for the note with its ledger row. Then the build review, the checks and the notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-21: written under plan-078 (step 4, point 6), added on `main` (`711761db`), no other
  task added meanwhile (W-14).
- 2026-11-21: independent review of the body: approve after amendments; no blocker, five
  should-fix and five nits, all applied: the contrast case corrected (0.3.2 prints
  `agent.execute`'s argument as text and accepts an unknown id, so the exemption asks for
  something new; F-034 named); the dangling-binding warning of 0.3.2 and the step's
  `directiveWarnings` as what the request builds on, `directives list` as the command that warns;
  the inventory cited by path and date, dl-043 and the base ruling on plan-078's branch; plan-078's
  record outside this task's diff; the reason for no `wingfoil-cli` entry; nits: the note's title
  and a long line, plan-074's source, the command that commits itself, F-051's Observed, D2's
  added-there clause as a deviation. A re-review follows: the request's command changed.
- 2026-11-21: re-review of the amendments: approve after amendments; no blocker, one should-fix
  (spec-001 §6.5 for a directive an entry ships, not spec-003 §6.5; spec-003 §7.1 added) and three
  nits (both releases print the argument as text, the contrast's id, the reverse case's removal
  committed), all applied. No third review: the fixes change citations and wording, not the
  request.
- 2026-11-21: the approver accepted the task into the backlog (`23c0fcb5`); `main` pushed. Started
  (backlog → in-progress, `5ec22c31`) on `task/task-101-feedback-note` from `main` at `23c0fcb5`.
  Reproduced with WingFoil 0.3.0 (`cc31d7a8`) and 0.3.2 (`6de2e13c`) alone, each in a scratch
  project of its own (`init --template Kanban --no-interactive`, a fictional `.example` member
  added with `dna add team.members`), as Design lists; every point held on both, the reverse case
  warning on 0.3.2 only. Deviation from Design: none. The note and its ledger row in one commit
  (`e1add631`). Red by mutation (dl-018 R2's exception, as task-092), each reverted after its run:
  a gap in the numbering 2 failing, a ledger cell changed 2, the opening line changed 2, two
  fields swapped 2, `## Expected` renamed 2; `New note (task-101).` once in the note; unmutated,
  `node --test dist/tests/wingfoil-feedback.test.js dist/tests/feedback-note.test.js` 13 passing,
  `npm run lint` exit 0.
- 2026-11-21: independent build review of `72c3f158`: approve after amendments, nothing blocking; it
  reproduced the note on 0.3.0 and 0.3.2. One should-fix, applied: on 0.3.0 too the step warns on a
  binding with no file (`workflow next`'s `directiveWarnings`), only `directives list` does not; so
  Context's "absent in 0.3.0" and the note above's "on 0.3.2 only" hold for `directives list` alone,
  both left as written (dl-019), and the note says it and shows the step's warning on both releases.
  Nits, applied: F-034's and F-041's descriptions as their titles; the workflow's YAML shown; the
  mutation of `## Expected` was a rename, standing in for Design's removal (both fail
  `assertSections`). No re-review: the request is unchanged, the amendments correct one fact and
  wording.
- 2026-11-21: checks (dl-039 R1, R2), once, on the frozen commit `e4263873`: the branch CI, run
  44929993996, `success`, jobs `validate (22.12.0, 1)` 16 min 3 s, `(22.12.0, 2)` 3 min 47 s,
  `(22.21.0, 1)` 11 min 3 s, `(22.21.0, 2)` 3 min 56 s (none over 25 minutes); from a clean
  working tree on Node.js 22.21.0 after `npm ci` and `npm run build`: `npm run
  validate:publication`, the golden tree in publication mode and `npm run -s wingfoil -- workflow
  list` exit 0, `directives list --format json` with `"warnings": []`, the inbox tests 13 passing,
  `npm run lint` exit 0, the tree still clean. This commit changes only `docs/memory`: no new run.
  Privacy check of the branch's diff and messages: no local or scratch path, no maintainer name or
  email, no private project, no intermediary session. `main`'s CI on `23c0fcb5` (the backlog
  approval) read: run 44928960692 `success`, longest job 13 min 24 s.
