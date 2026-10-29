---
id: task-064-feedback-notes-f-038-to-f-041-for-wingfoil-0.3.x-plan-fields-at-workflow-start-a-closed-iteration-re-deduced-a-directory-in-produces-a-role-nobody-holds-plan-054
type: task
title: "Feedback notes F-038 to F-041 for WingFoil 0.3.x: plan fields at workflow start, a closed iteration re-deduced, a directory in produces, a role nobody holds (plan-054)"
status: draft
pack: ""            # tooling task (pack-cycle › retrospective, plan-054 step 4)
depends_on: []
tags: ["tooling","feedback"]
---

## Context

plan-054 step 4 (`capture`), and dl-028 W1 … W4: the WingFoil-side points of the retrospective of
2026-10-28 (inventory §6), written as feedback notes because the inbox test requires a note's
first line to name a task or a pack-release (`tests/support/inbox.ts`, `assertOpenings`), as
task-026 did for plan-025 and task-063 for plan-053. They must be on `main` before 2026-11-06,
when WingFoil's v0.4 planning may start (dl-006 R3).

Four notes, numbered contiguously after F-037 (`assertNumbering`):
- **F-038 (`request`): `workflow start` fills a plan's `workflow` and `phase` only from the tokens
  its type's `id_pattern` or `path` declares.** Without them the plan is committed `draft` with both
  empty, a type that requires them fails the automatic submit, and `--set workflow=…` is refused at
  start; `phase` gets the instance number `1`. Owed by plan-049 (bug-005); unchanged on 0.3.1
  (plan-051 › recheck). Same family as F-011 (`memory add --set`), another verb.
- **F-039 (`request`): under an iterated sub, a step whose `where` has no relation to the scope is
  deduced again for a closed iteration** (`base`'s `retrospective` `approve`: Sprint 1's step
  returns to the frontier once Sprint 2's decision-log is `in-discussion`, and `pending approvals`
  counts one element twice). Ask: a `where` key skipped when no element is in scope, or no
  re-deduction of a closed iteration's steps. bug-008's option (iii) (plan-052 ruling 2); distinct
  from F-018, F-034 and F-037.
- **F-040 (`gap`): a directory in `produces` without a trailing `/` is read as a file and never
  satisfied**, with no diagnostic at load; `workflow finalize --step` and `workflow end` refuse
  (bug-006).
- **F-041 (`gap`): a phase role that no member or agent holds is accepted** by `workflow list` and
  at run time (`software`'s `tech-lead` in a composition whose DNA gives it to no one; plan-051 ›
  recheck, plan-052 ruling 5).

dl-028 W2: the inventory's three `?` rows (a candidate that leaves the `where` before any of its
phases completes; the `{sprint.id}` warning `W_PHASE_TOKEN_OUT_OF_SCOPE`; 0.3.1 refusing `init`'s
software workflows with `base` alone while 0.3.0 accepts them) become notes F-042 onward only if
this task's reproduction shows a defect, not a documented behaviour; otherwise the Execution Notes
say why not, and the approver rules. dl-028 W3: no note for W-14 (fixed in 0.3.0 and 0.3.1) or for
`init`'s `custom/` workflows (F-007).

## Acceptance

`npm run build` precedes the commands.

1. **Four notes**, `docs/wingfoil-feedback/F-038-…md` … `F-041-…md`, each in the inbox format
   (README › Rules, WingFoil dl-163 R4): the six fields in order (`id`, `title`, `kind`, `status:
   open`, `wingfoil_version: 0.3.1`, `answered_by: []`), a body opening with `New note (task-064).`
   and its origin in this repository (element ids, public), `## Observed` with the commands, their
   output (excerpts marked) and exit codes, and `## Expected`; no `## Replies`. Kinds as in Context.
2. **Reproduced with WingFoil alone**: each `## Observed` comes from a scratch project outside the
   repository (`git init`, WingFoil installed with `npm ci` from `src/matrix/wingfoil-0.3.1/`,
   `wingfoil init --template Kanban --no-interactive` or `Scrum`, a minimal hand-written
   configuration, never this repository's packs); the same commands on
   `src/matrix/wingfoil-0.3.0/` give the same result, recorded in the Execution Notes, a difference
   going to the approver (dl-019) before the note says anything about it.
3. **The `?` rows** (dl-028 W2): each reproduced the same way; the Execution Notes record, for each,
   note or no note and why; a note is written only after the approver's ruling, numbered F-042
   onward.
4. **No private content:** no note names or describes a private project, a local path, a non-public
   repository or an intermediary session (dl-030 P1, P2); WingFoil references are public ids, tags
   or commits.
5. **The ledger** in `docs/wingfoil-feedback/README.md` gains one row per note, in order (5 cells
   equal to the frontmatter, `answered_by` empty); `Last sync` unchanged. No `wingfoil-cli` entry:
   the notes record 0.3.x behaviours, recorded there when the governance pin moves (rule 5), as
   task-041 and task-063.
6. **Tests and checks:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`
   (the inbox checks included, numbering contiguous from F-001), `npm run lint`, `check:pins`,
   `check:schemas`, `check:packs`, `validate`, `index -- --check`, `check:runs` and
   `npm run -s wingfoil -- workflow list` exit 0. No file changes outside `docs/wingfoil-feedback/`
   and this task's file. The CI run on the branch is `success` and recorded.

## Design

- **Red steps:** none of code. The change is content (notes and ledger rows), dl-018 R2's named
  exception; the inbox test already covers it, checked by mutation: a note numbered F-039 twice, a
  ledger row with a wrong cell, an opening not in the form (`New note task-064.`), each making
  `npm test` fail, listed in the Execution Notes and reverted.
- **The scratch projects**, outside the repository and never committed: one per WingFoil version
  and per note, as Acceptance 2. F-038: a plan type without `{workflow}`/`{phase}` tokens and
  `required` naming them, `workflow start` of a main, then `workflow start --set workflow=x`.
  F-039: a main iterating a sub over a type, the sub's last phase an `approve` selected by a `where`
  on a tag; two elements, the first iteration closed, the second's decision-log `in-discussion`,
  `workflow status`. F-040: a phase whose `produces` names a directory without `/`, the directory
  created and committed, `workflow finalize --step` and `workflow end`. F-041: a phase whose `role`
  no member or agent holds, `workflow list` and a run through the phase.
- **The notes** written from the outputs, the ledger rows appended in one commit with them.
- **Privacy:** a grep of the notes for local paths (`/home/`, `/tmp/`) and session names, and a read
  for private project or repository names.
- **Commits** on `task/task-064-feedback-notes`, from plan-054's branch: the notes and the ledger
  (one commit), then this task's notes.

## Execution Notes

- 2026-10-29: written under plan-054 step 4, from dl-028 W1 … W4.
