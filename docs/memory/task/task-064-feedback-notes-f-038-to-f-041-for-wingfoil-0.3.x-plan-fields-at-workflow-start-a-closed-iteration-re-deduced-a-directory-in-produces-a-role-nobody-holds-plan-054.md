---
id: task-064-feedback-notes-f-038-to-f-041-for-wingfoil-0.3.x-plan-fields-at-workflow-start-a-closed-iteration-re-deduced-a-directory-in-produces-a-role-nobody-holds-plan-054
type: task
title: "Feedback notes F-038 to F-041 for WingFoil 0.3.x: plan fields at workflow start, a closed iteration re-deduced, a directory in produces, a role nobody holds (plan-054)"
status: in-progress
pack: ""            # tooling task (pack-cycle › retrospective, plan-054 step 4)
depends_on: []
tags: ["tooling","feedback"]
---

## Context

plan-054 step 4 (`capture`), and dl-028 W1 … W4 (proposed): the WingFoil-side points of the
retrospective of 2026-10-28 (inventory §6). They are written by a task, hosted by plan-054, because
the inbox test requires a note's first line to name a task or a pack-release
(`tests/support/inbox.ts`, `assertOpenings`), as task-026 did for plan-025 and task-063 for
plan-053. The build starts at the approver's backlog acceptance, under plan-054's decision 3 and
step 4; if dl-028's ruling changes W1 or W2 before the build ends, the change goes to the approver
(dl-019). The notes must be on `main` before 2026-11-06, when WingFoil's v0.4 planning may start
(plan-054 › Context, dl-028 › Context; dl-006 R3 sets the obligation).

Four notes, numbered contiguously after F-037 (`assertNumbering`):
- **F-038 (`request`): `workflow start` fills a plan's `workflow` and `phase` only from the tokens
  its type's `id_pattern` or `path` declares.** Without them the plan is committed `draft` with both
  empty, a type that requires them fails the automatic submit, and `--set workflow=…` is refused at
  start (only `phase` and `scope` may be set); with a declared `{phase}` token, `phase` gets the
  instance number `1`. Owed by plan-049 (bug-005, which calls it "not a defect of WingFoil's");
  unchanged on 0.3.1 (plan-051 › recheck). Distinct from F-011 (`memory add --set`, another verb).
- **F-039 (`request`): under an iterated sub, a step whose `where` has no relation to the scope is
  deduced again for a closed iteration** (`base`'s `retrospective` `approve`: Sprint 1's step
  returns to the frontier once Sprint 2's decision-log is `in-discussion`, and `pending approvals`
  counts one element twice). Ask: a `where` key skipped when no element is in scope, or no
  re-deduction of a closed iteration's steps. bug-008's option (iii) (plan-052 ruling 2); distinct
  from F-018, F-034 and F-037.
- **F-040 (`gap`): a directory in `produces` without a trailing `/` is read as a file and never
  satisfied**, with no diagnostic at load; `workflow finalize --step` and `workflow end` refuse
  (bug-006). No earlier note covers it.
- **F-041 (`gap`): a phase role declared in the DNA but held by no member and named in no agent's
  `executes_as` is accepted** at load and at run time (`software`'s `tech-lead`; plan-051 ›
  recheck, plan-052 ruling 5). Distinct from F-020 (`executes_as` must name declared roles) and
  F-026 (one role per phase).

dl-028 W2: the inventory's three `?` rows (a candidate that leaves the `where` before any of its
phases completes is skipped; a token warning `W_PHASE_TOKEN_OUT_OF_SCOPE` when the template declares
no such field; 0.3.1 refusing a phase role that the DNA does not declare, `E_PHASE_ROLE_UNKNOWN`,
which 0.3.0 accepts, while 0.3.1's CHANGELOG says "nothing breaks") are reproduced; dl-028 W2's test
decides each (a defect, not a behaviour that WingFoil's specification or CHANGELOG documents), and
the approver rules on each before any note for it. dl-028 W3: no note for W-14 (fixed in 0.3.0 and
0.3.1) or for `init`'s `custom/` workflows (F-007).

## Acceptance

`npm run build` precedes the commands.

1. **Four notes**, `docs/wingfoil-feedback/F-038-…md` … `F-041-…md`, each in the inbox format
   (README › Rules, WingFoil dl-163 R4): the six fields in order (`id`, `title`, `kind`,
   `status: open`, `wingfoil_version: 0.3.1`, `answered_by: []`; `wingfoil_version` written by
   hand, the governance pin being 0.2.2), a body opening with `New note (task-064).`, its origin in
   this repository (public element ids) and the notes it is distinct from (as Context names them),
   then `## Observed` with the WingFoil version and commit for 0.3.1 (`870bd440`) and 0.3.0
   (`cc31d7a8`), the commands, their output (excerpts marked) and exit codes, and a statement that
   both releases give the same result; then `## Expected`; no `## Replies`. Kinds as in Context.
2. **Reproduced with WingFoil alone**: each `## Observed` comes from a scratch project outside the
   repository (`git init`, WingFoil installed with `npm ci` from `src/matrix/wingfoil-0.3.1/`,
   `wingfoil init --template Kanban --no-interactive` or `Scrum`, a minimal hand-written
   configuration, never this repository's packs); the same commands on
   `src/matrix/wingfoil-0.3.0/` give the same result, recorded in the Execution Notes; a difference
   goes to the approver (dl-019) before the note says anything about it.
3. **The `?` rows** (dl-028 W2): each reproduced the same way, in reduced form, and checked against
   W2's test: a defect, not a behaviour that WingFoil's specification or CHANGELOG documents; the
   reproduction and the reading go to the approver, who rules on each. F-038 … F-041 do not wait for
   these rulings: they are committed once reproduced. A note the approver rules is written as F-042
   onward, in its own commit after F-041, with its own ledger row, following Acceptance 1, except
   that the third row's `## Observed` records the difference between 0.3.0 and 0.3.1 instead of the
   same result. A row with no ruling by 2026-11-03 goes to a later task, a deviation from dl-028 W2
   recorded under dl-019, so that the review, approval and merge fit before 2026-11-05; the
   Execution Notes record, for each row, note or no note and why.
4. **No private content:** no note names or describes a private project, a local path, a non-public
   repository, the maintainer's names or an intermediary session (dl-030 P1, P2, applied since
   2026-10-28); WingFoil references are public ids, tags or commits.
5. **The ledger** in `docs/wingfoil-feedback/README.md` gains one row per note, in order (5 cells
   equal to the frontmatter, any `|` in a title escaped, `answered_by` empty); `Last sync`
   unchanged. No `wingfoil-cli` entry: the notes record 0.3.x behaviours, recorded there when the
   governance pin moves (rule 5), as task-041 and task-063.
6. **Tests and checks:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`
   (the inbox checks included, numbering contiguous from F-001), `npm run lint`, `check:pins`,
   `check:schemas`, `check:packs`, `validate`, `index -- --check`, `check:runs` and
   `npm run -s wingfoil -- workflow list` exit 0. No file changes outside `docs/wingfoil-feedback/`
   and this task's file. The CI run on the branch is `success` and recorded. If plan-054's branch
   cannot close by 2026-11-05, this task's merge goes to `main` on its own, on the approver's OK,
   `--no-ff` (plan-054 step 4).

## Design

- **Red steps:** none of code. The change is content (notes and ledger rows), dl-018 R2's named
  exception; the inbox test already covers it, checked by mutation, each making `npm test` fail and
  reverted: a note numbered F-039 twice (`assertNumbering`), a ledger row with a wrong cell
  (`assertLedger`), an opening not in the form, `New note task-064.` (`assertOpenings`), two fields
  swapped (`assertFields`), a missing `## Expected` (`assertSections`); listed in the Execution
  Notes. The opening's task number, which the test does not check, is checked by a grep counting
  `New note (task-064).` once in each new note.
- **The scratch projects**, outside the repository and never committed: one per WingFoil version
  and per note, as Acceptance 2.
  - F-038: a plan type without `{workflow}`/`{phase}` tokens and `required` naming them;
    `workflow start` of a main; `workflow start --set workflow=x` (refused) and `--set phase=y`
    (accepted); then a plan type with both tokens declared, to show `phase` set to `1`.
  - F-039: a main iterating a sub over a type, the sub's last phase an `approve` selected by a
    `where` on a tag; two elements, the first iteration closed, the second's decision-log
    `in-discussion`; `workflow status` and `workflow next`.
  - F-040: a phase whose `produces` names a directory without `/`; `workflow list` (exit 0, no
    warning); the directory created with a committed file inside it; `workflow next`,
    `workflow finalize --step` and `workflow end`.
  - F-041: a role declared in `team.roles`, held by no `team.members[]` entry and named in no
    agent's `executes_as`, given to a phase; `workflow list`, then `workflow next`,
    `workflow status` and the phase completed with no refusal.
  - `?` rows: (1) a candidate moved out of the `where` before any of its phases completes (dl-027 ›
    Context); (2) a `{<type>.id}` token on a template that declares no `id`; (3) a phase role not
    declared in `team.roles`, compared on 0.3.0 and 0.3.1 and read against 0.3.1's CHANGELOG.
- **The notes** written from the outputs, the ledger rows appended in one commit with them (F-038 …
  F-041); a ruled `?` note in its own commit after.
- **Privacy:** a grep of the notes for local paths (`/home/`, `/tmp/`), the maintainer's names and
  session names, and a read for private project or repository names.
- **Commits** on `task/task-064-feedback-notes`, from plan-054's branch: the notes and the ledger,
  then any ruled `?` note, then this task's notes.

## Execution Notes

- 2026-10-29: written under plan-054 step 4, from dl-028 W1 … W4 (proposed).
- 2026-10-29: independent body review: approve after amendments, one blocking finding: the `?` rows
  could change the task's scope and miss the deadline; now ruled by the approver before the notes'
  commit, a ruled note in its own commit, and a fallback at 2026-11-05. Applied with it: F-041's
  role declared but unheld (the undeclared role is the third `?` row), the `?` rows' scratch
  design, the opening's task number checked by grep, the notes each name what they are distinct
  from, version and commit in `## Observed`, F-040's and F-038's runs completed, mutations for every
  inbox assertion, privacy and ledger details, the Context's wording.
- 2026-10-29: re-review: approve after amendments, nothing blocking; applied: F-038 … F-041 no
  longer wait for the `?` rulings, which gate only F-042 onward, with a cut-off at 2026-11-03;
  dl-028 W2's test stated, a deferral recorded as a deviation, the third row's `## Observed` records
  the difference; the first row's outcome; F-040 has no earlier note.
- 2026-10-29, `build` (`backlog → in-progress`, `fe824dc`; plan-054's branch merged in, `c438172`):
  every note reproduced in its own scratch project outside the repository, WingFoil installed from
  `src/matrix/wingfoil-0.3.1/` and `src/matrix/wingfoil-0.3.0/` (`870bd440`, `cc31d7a8`); the two
  releases give the same result for each (they differ only in how `workflow next` prints a scaffold
  step and in the DNA `init` writes). Departures from the Design, none changing a note's claim:
  F-038's `--set phase=…` is refused too when the type declares no `{phase}` token (exit 1), not
  accepted as the Design said; F-039 needed a member holding `approver` in the scratch DNA before
  `memory approve` was accepted; F-041's scenario keeps the scaffold's empty `team.agents` and a
  member holding `[approver, developer]`. F-039 and F-040 cite spec-017 §4.7 and §4.3, which
  describe the behaviour each note asks to change.
- 2026-10-29, the `?` rows (dl-028 W2's test), each reproduced on both releases, all three found
  documented, so no note is proposed: (1) a candidate that leaves the entry filter before any phase
  of its sub completes is ignored and the phase is vacuously complete, as spec-017 §4.6 defines
  ("eligible", "entered", "otherwise ignored"); (2) `W_PHASE_TOKEN_OUT_OF_SCOPE` for a
  `{task.sprint}` token whose template declares no `sprint` field, a warning spec-003 lists; (3)
  `E_PHASE_ROLE_UNKNOWN` for a phase role `dna.yaml` does not declare: both 0.3.0 and 0.3.1 refuse
  it; the difference plan-052 met comes from 0.3.1's `init` scaffold, whose phases now name their
  roles (0.3.1's CHANGELOG, task-296). Put to the approver for the ruling (Acceptance 3).
- 2026-10-29: F-038 … F-041 and their ledger rows committed (`b5229e3`); the opening grep counts
  `New note (task-064).` once in each; privacy grep clean (the notes say "scratch project" as F-036
  does); the inbox tests pass 13 of 13 (`dist/tests/feedback-note.test.js`,
  `dist/tests/wingfoil-feedback.test.js`). Mutations, each reverted: F-040 numbered F-039 (3 fail),
  F-040's ledger kind changed (2), `New note task-064.` (2), F-038's `kind` and `status` swapped
  (2), F-039's `## Expected` renamed (2).
- 2026-10-29: the approver ruled no note for each of the three `?` rows (documented behaviours, as
  above); Acceptance 3 met with F-038 … F-041 alone.
- 2026-10-29: clean clones on Node.js 22.21.0 (at `b5229e3`) and 22.12.0 (at `ddfdb64`, which adds
  only this file's notes): `npm ci`, `npm test` (1027 of 1027), `lint`, `check:pins`,
  `check:schemas`, `check:packs`, `validate`, `index -- --check`, `check:runs` and `workflow list`
  exit 0.
- 2026-10-29: independent build review: approve after amendments, nothing blocking; every note
  reproduced again by the reviewer on both releases, matching. Applied: F-038's reading of spec-017
  §7.1 and of `phase`'s value, F-039's §4.7 wording, F-041's Expected (the JSON already reports
  `members: []`) and two excerpt marks. Inbox tests 13 of 13.
- 2026-10-29: CI run 40852678262 on `d0fb51b`, conclusion `success` (`validate (22.21.0)`, `validate
  (22.12.0)`); the earlier run on `d069122` was cancelled by that push. `in-progress → in-review`.
