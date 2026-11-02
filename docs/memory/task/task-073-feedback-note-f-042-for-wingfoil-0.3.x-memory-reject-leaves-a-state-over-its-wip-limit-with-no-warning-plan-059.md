---
id: task-073-feedback-note-f-042-for-wingfoil-0.3.x-memory-reject-leaves-a-state-over-its-wip-limit-with-no-warning-plan-059
type: task
title: "Feedback note F-042 for WingFoil 0.3.x: memory reject leaves a state over its WIP limit with no warning (plan-059)"
status: pending
pack: ""            # tooling task (pack-cycle › retrospective, plan-059 step 4)
depends_on: []
tags: ["tooling","feedback"]
---

## Context

plan-059 step 4 (`capture`) and point 6, and dl-034 W1 (proposed): the WingFoil-side point the
approver kept at the checkpoint (the inventory of 2026-11-02, §6 WF-1, P1). It is written by a task,
hosted by plan-059, because the inbox test requires a note's first line to name a task or a
pack-release (`tests/support/inbox.ts`, `assertOpenings`), as task-064 was by plan-054. The note
must be on `main` before WingFoil's v0.4 release planning, not before 2026-11-06 (WingFoil's timing
as of 2026-10-28); if plan-059's branch cannot close by 2026-11-05, this task's merge goes to `main`
on its own, on the approver's OK, `--no-ff` (plan-059 point 6).

One note, numbered after F-041 (`assertNumbering`):
- **F-042 (`request`): `memory reject` leaves a state over its WIP limit with no word about it.**
  With `limits` declared on a state, `memory submit` into a full state is refused (`CONFLICT`,
  "WIP limit reached …"), but `memory reject` back into it exits 0 and leaves more holders than the
  limit, silently (plan-056 › step 4; task-069; observed on 0.3.1). WingFoil exempts `reject` and
  `park` by design (its dl-156 Q2 (i), stated in the module `memory-transition` of 0.3.0 and 0.3.1,
  "the approver's verdict and a scheduling step are not capped by a capacity rule", and in its
  schema's comment on `limits`; WingFoil's README names WIP limits only), so the ask is
  not a refusal: a warning on the successful `reject`, naming the state, its limit and its holders,
  through the channel a success already uses for an undercounted limit. This repository's
  `methodology/kanban` keeps a rule for the case by hand (its `kanban` directive). No earlier note
  covers WIP limits.

## Acceptance

`npm run build` precedes the commands.

1. **One note**, `docs/wingfoil-feedback/F-042-…md`, in the inbox format (README › Rules, WingFoil
   dl-163 R4): the six fields in order (`id`, `title`, `kind: request`, `status: open`,
   `wingfoil_version: 0.3.1`, `answered_by: []`; `wingfoil_version` written by hand, the governance
   pin being 0.2.2), a body opening with `New note (task-073).`, its origin in this repository
   (public element ids) and WingFoil's own ruling it builds on (dl-156 Q2 (i)); then `## Observed`
   with the WingFoil version and commit for 0.3.1 (`870bd440`) and 0.3.0 (`cc31d7a8`), the
   configuration, the commands, their output (excerpts marked) and exit codes, and a statement that
   both releases give the same result; then `## Expected`; no `## Replies`.
2. **Reproduced with WingFoil alone**: `## Observed` comes from a scratch project outside the
   repository (`git init`, WingFoil installed with `npm ci` from `src/matrix/wingfoil-0.3.1/`,
   `wingfoil init --template Kanban --no-interactive`, a `states:` block with `limits` written by
   hand on `task`, `init`'s `defaults` left as written, a fictional approver identity, never this
   repository's packs); the same commands on `src/matrix/wingfoil-0.3.0/` give the same
   result, recorded in the Execution Notes; a difference goes to the approver (dl-019) before the
   note says anything about it.
3. **No private content:** no local path, non-public repository, private project, the maintainer's
   names or email (the scratch commits use a fictional `.example` identity) or an intermediary
   session (`repository-practice` rules 1, 2); WingFoil references are
   public ids, tags or commits.
4. **The ledger** in `docs/wingfoil-feedback/README.md` gains one row (5 cells equal to the
   frontmatter, `answered_by` empty); `Last sync` unchanged. No `wingfoil-cli` entry: the note
   records a 0.3.x behaviour, recorded there when the governance pin moves (rule 5), as task-064.
5. **Tests and checks:** from clean clones on Node.js 22.21.0, then 22.12.0, one after the other,
   `npm ci`, `npm test` (the inbox checks included, numbering contiguous from F-001), `npm run lint`,
   `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check`, `check:runs` and
   `npm run -s wingfoil -- workflow list` exit 0. No file changes outside `docs/wingfoil-feedback/`
   and this task's file. The CI run on the branch is `success` and recorded. If plan-059's branch
   cannot close by 2026-11-05, this task's merge goes to `main` on its own, on the approver's OK,
   `--no-ff` (plan-059 point 6).

## Design

- **Red steps:** none of code. The change is content (a note and a ledger row), dl-018 R2's named
  exception, as task-064; the inbox test already covers it, checked by mutation, each making
  `npm test` fail and reverted: the note numbered F-041 (`assertNumbering`), a ledger cell changed
  (`assertLedger`), the opening `New note task-073.` (`assertOpenings`), two fields swapped
  (`assertFields`), `## Expected` removed (`assertSections`); listed in the Execution Notes. The
  opening's task number, which the test does not check, by a grep counting `New note (task-073).`
  once.
- **The scratch projects**, outside the repository and never committed, one per WingFoil version:
  `init --template Kanban`, whose `task` runs on `defaults.states` (`draft → pending → approved`, no
  limit; the template only points to `limits:`, in its commented `bug` example); a git identity
  `Tester <tester@plover.example>` and a matching `team.members` entry with the role `approver` in
  `dna.yaml` (`reject` and `approve` require an approver; `init` writes `members: []`); on `task` a
  `states:` block written by hand, `sequence: [draft, backlog, in-progress, in-review, done]`,
  `gates: { in-review: { reject: in-progress } }`, `limits: { in-progress: 1 }`, committed and
  checked by the first `memory add` and `submit` that read it (a `workflow list` warning on `init`'s
  `kanban-delivery`, whose `review` phase selects `status: pending`, is recorded in the Execution
  Notes and kept out of the note) before the moves. Tasks A and B added and moved to `backlog` and A
  to `in-progress` by `memory submit`; B refused into `in-progress` (`memory submit`, exit 1,
  `CONFLICT`); A to `in-review` (`memory submit`), then B to `in-progress` (`memory submit`); A
  rejected back to `in-progress` (`memory reject --reason "…"`, exit 0, its output showing no
  warning); then a third task C refused into `in-progress`, its message naming both holders over the
  limit of 1: WingFoil's own output shows the state over its limit. The verbs of each move follow
  the machine as written (a gate state is left forward by `approve`, also checked against the
  limit); the `states:` block, the `dna.yaml` edit and every command recorded in `## Observed`.
- **The note** written from the outputs, with its ledger row, in one commit.
- **Privacy:** a grep of the note for local paths (`/home/`, `/tmp/`), the maintainer's names and
  email, session names, and a read for private project or repository names; the scratch identity
  is fictional.
- **Commits** on `task/task-073-feedback-note-f-042`, from plan-059's branch: the note and the
  ledger, then this task's notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-02: written under plan-059 step 4, from dl-034 W1 (proposed) and the inventory's P1.
- 2026-11-02: independent review of the body: changes needed, one blocking finding (`init`'s
  `task` has no `in-progress` state and no machine to hold `limits`: a `states:` block is written by
  hand), two should-fix (an approver identity in `dna.yaml` for `reject`; the wording of the
  configuration), three nits (the schema's comment and the README cited; the 2026-11-05 fallback in
  Acceptance; a third submit's refusal naming both holders); all applied. A re-review follows (the
  reproduction changed).
- 2026-11-02: re-review: approve, three nits applied (the identity's `.example` domain, `--reason`
  on the reject, the machine checked by the first verbs, any `workflow list` warning kept out of the
  note).
