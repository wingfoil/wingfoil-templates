---
id: task-052-feedback-note-f-037-for-wingfoil-0.3.0-an-iterate-over-phase-closed-to-new-candidates-plan-048
type: task
title: "Feedback note F-037 for WingFoil 0.3.0: an iterate_over phase closed to new candidates (plan-048)"
status: approved
pack: ""            # tooling task (tooling-change › deliver, plan-048)
depends_on: []
tags: ["tooling","feedback"]
---

## Context

dl-026 D5 (approved 2026-10-26, plan-047): a feedback note asks WingFoil for an `iterate_over`
phase that stays open to new candidates. On WingFoil 0.3.0 a phase that completes other than
vacuously closes every earlier live phase: an earlier `iterate_over` phase is then reported
complete, and a candidate added afterwards is reported `late` and never run. plan-047's runs found
it with `methodology/scrum`'s draft: a new Sprint, or a release completing inside a Sprint, closes
the earlier phases; dl-026 nests releases and retrospectives in the Sprint and plan-047's ruling 16
orders the release after the Sprint Backlog to live with it. The request: a way for a methodology
to run two repeating streams (Sprints and releases) as phases of one workflow, for example a phase
that is not closed by later ones, or a `late` candidate that can still run. The number F-037 is
agreed with plan-046's session (F-035 and F-036 are reserved for the coordinating session's
request).

## Acceptance

`npm run build` precedes the commands.

1. **The note** `docs/wingfoil-feedback/F-037-<slug>.md`, with the six fields in order (`id`,
   `title`, `kind: request`, `status: open`, `wingfoil_version: 0.3.0`, `answered_by: []`), a body
   opening with `New note (task-052).` followed by its provenance (dl-026 D5, plan-047), and
   `## Observed` and `## Expected` sections; no `## Replies`.
2. **Reproducible with WingFoil 0.3.0 alone,** in a scratch project (`git init`, WingFoil 0.3.0
   installed from npm or from `src/matrix/wingfoil-0.3.0/`, `wingfoil init --template Kanban`);
   `## Observed` gives the minimal workflows (a `main` with an `iterate_over: task` phase and a
   later phase with a `produces`, and the iterated sub), the commands, their output and exit
   codes, showing a task added after the later phase completed reported `late` and the workflow
   reported complete. No command, path or file of this repository's tooling is needed to
   reproduce it. `wingfoil_version` is written by hand: this repository's governance pin is 0.2.2.
3. **Told apart** from F-032 (suspending an instance), F-033 (closing a plan that is not an
   instance) and F-018 (a `where` on `iterate_over` that nothing evaluated, in 0.2.2): it is about
   one instance's phases closing on 0.3.0, not its plan nor the filter.
4. **No private content:** no local path, private repository or private project; WingFoil
   references are public ids, tags or commits.
5. **The ledger** in `docs/wingfoil-feedback/README.md` gains its row (5 cells equal to the
   frontmatter, `answered_by` empty, any `|` in the title escaped); `Last sync` is unchanged; no
   `wingfoil-cli` W-entry and no change under `.wingfoil/` (the behaviour is 0.3.0's, recorded when
   the governance pin moves, its rule 5).
6. **Tests:** `npm test` passes, the inbox checks included. `assertNumbering`
   (`tests/support/inbox.ts`) requires the notes numbered from F-001 with no gap, and F-035 and
   F-036 are reserved for the coordinating session's request (dl-024, dl-025), not yet written: the
   note lands only once both exist: this task's build waits for them, under the plan that writes
   them or the next `tooling-change` plan after it (plan-048 ruling 2). No file under `src/`,
   `tests/`, `schema/`, `packs/` or `.github/` changes. The CI run on the branch is `success` and
   recorded.

## Design

- **Red steps:** none of code. The note is content, dl-018 R2's named exception; the inbox test
  covers it, checked by mutation: the note numbered F-038, its ledger row with a wrong `kind`, its
  opening not in the form (`New note task-052.`), each making the inbox tests fail.
- **The scratch project**, in the session's scratchpad and never committed: `git init`, WingFoil
  0.3.0 installed with `npm ci` from `src/matrix/wingfoil-0.3.0/`, `wingfoil init --template Kanban
  --no-interactive`; two custom workflows included in `workflows.yaml` and committed: `stream`
  (`main`), a phase `items` with `iterate_over: task` and `include: item`, then a phase `report`
  with `produces: ["docs/report.md"]`; `item` (`sub`, `element: task`), one phase whose action is
  `memory.submit`. Then: a task added, `workflow start stream`, the task submitted, `workflow
  next` (the report is next), the report committed, `workflow next` (complete), a second task
  added, `workflow next` and `workflow status` (the second task `late`, the workflow complete),
  output and exit codes copied into `## Observed`. The same run on `src/matrix/wingfoil-0.3.1/`,
  its result in the Execution Notes (not an Acceptance criterion: plan-053 step 5).
- **The note**, by hand in F-034's layout, its `## Expected` the request of dl-026 D5: a phase not
  closed by later ones, or a `late` candidate that can still run, so that a methodology runs two
  repeating streams (Sprints and releases) in one workflow; told apart from F-018, F-032 and
  F-033. Its ledger row appended.
- **Checks:** the privacy grep (`/home/`, `/tmp/`, the maintainer's names); from clean clones on
  Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`, `check:pins`, `check:schemas`,
  `check:packs`, `validate`, `index -- --check`, `check:runs` and `workflow list`; no file changed
  outside `docs/wingfoil-feedback/` and this task's file.
- **Commits** on `task/task-052-feedback-note-f-037`, from plan-053's branch: the note and its
  ledger row (one commit), then this task's notes.

## Execution Notes

- 2026-10-26: written under plan-048 (step 1).
- 2026-10-26: reviewed with plan-048 (approve after amendments, then approve); accepted under
  plan-048, its build taken over as plan-048 ruling 2 says.
- 2026-10-28, design and build (plan-053 step 5; `backlog → in-progress`): Design written; F-035
  and F-036 on plan-053's branch, so the numbering has no gap. Scratch project on 0.3.0
  (`cc31d7a8`, `npm ci` from `src/matrix/wingfoil-0.3.0/`, `init --template Kanban
  --no-interactive`), the two workflows of the note committed: the run gives the note's output,
  every exit code 0; the second task `late` and the workflow complete. The same run on 0.3.1
  (`870bd440`): the same result. The note and its ledger row (`71aab05`).
- Mutations (dl-018 R2), the two inbox test files, 13 of 13 unmutated: the note's `id` F-038 → 3
  fail; the ledger row's `kind` → 2 fail; the opening `New note task-052.` → 2 fail. Privacy grep:
  no match.
- Independent build review: approve after amendments, nothing blocking, the run reproduced on 0.3.0
  and 0.3.1. Applied (`f7781d8`, wording only): the methodology sentence now says what dl-026 and
  plan-047 found (a Sprint's retrospective or a release completing closes the Sprint phase, the
  next Sprint `late`; a release inside a Sprint leaves its open items `late`); trimmed outputs
  marked `# excerpt` or given their first line; "one open instance's phases close each other"
  narrowed; the commit step's exit code.
- Clean clones: Node.js 22.21.0 on `71aab05`, 22.12.0 on `f7781d8`: `npm ci`, `npm test` 1027 of
  1027, `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check`,
  `check:runs` and `workflow list` exit 0. CI run 40732702383 on `71aab05`: `success`. Files
  changed: the note, the ledger, this file.
- 2026-10-28: CI run 40737119884 on `eff09d4` (with `f7781d8`): `success`. Submitted for review.
