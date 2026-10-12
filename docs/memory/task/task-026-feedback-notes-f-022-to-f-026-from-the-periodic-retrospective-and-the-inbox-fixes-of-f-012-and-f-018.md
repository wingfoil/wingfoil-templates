---
id: task-026-feedback-notes-f-022-to-f-026-from-the-periodic-retrospective-and-the-inbox-fixes-of-f-012-and-f-018
type: task
title: "Feedback notes F-022 to F-026 from the periodic retrospective, and the inbox fixes of F-012 and F-018"
status: done
pack: ""            # no pack: the feedback inbox (hosted by plan-025, tooling-delivery)
depends_on: []
tags: ["feedback","retrospective"]
---

## Context

The WingFoil-side points of the periodic retrospective of 2026-10-12 (plan-025, phase `capture`;
dl-016 W1–W4; inventory `docs/retrospectives/2026-10-12-periodic-friction-inventory.md` §7). A
WingFoil defect or gap is a feedback note, not a decision (dl-006 R2). The inbox's rule, checked by
`tests/support/inbox.ts`, is that a new note opens with "New note (task-NNN)." naming the element it
comes from; the approver chose, on 2026-10-12, a task of its own for the notes rather than a change
of that rule. Hosted by plan-025 as task-025 was hosted by plan-024. No pack.

**Branch and delivery.** The approver's rule for the retrospective puts all its work on the branch
`retro/2026-10-12-periodic`; this task runs there, not on `task/<id>`. Its `deliver` is the merge of
that branch at plan-025 step 5, after the approver's OK: the task's `done` commit lands on the
branch, then the branch is merged `--no-ff` into `main` and pushed.

It comes from:
- the `wingfoil-cli` directive's known behaviours with no note: W-04, W-05, W-06, W-07 (dl-003 D3);
- bug-001 › fix options: "A phase has one role in WingFoil 0.2.2", with no note and no
  `wingfoil-cli` entry (rule 3: a missing behaviour gets an entry);
- two defects of existing notes, found by the inventory: the title of F-012 reads as truncated
  ("Format key distinct from version:"; the split of task-010 dropped the code span of
  "`version:`", as it did in every title, where the others still read whole); F-018 states its
  evidence in prose, with no output block (WingFoil dl-163 R4: command, output, version);
- dl-006 R3 (the WingFoil-side points reach the feedback notes before WingFoil's release
  planning) and plan-025's completion criterion (on `main`, pushed); WingFoil v0.3 is expected
  around 2026-10-20 and its retrospective reads this inbox (`svc-018`).

Kinds: F-022 is a `defect` (a change is committed under a subject that does not describe it);
F-024 and F-025 are `gap`s (missing guidance, a state with no way out); F-023 and F-026 are
`request`s for a capability, as F-021 is: rule 3 asks a note for a defect or gap, and a request is
written for the same reason, so that WingFoil's planning sees the workaround's cost.

Not in scope: rule 7 of `wingfoil-cli` (dl-016 A1); the sync and every status other than `open`
(rule 6); CB-8: `catalog.yaml`, `compat.yaml` and `schema/` do not change.

## Acceptance

Run from a clean clone of `retro/2026-10-12-periodic`; Node.js 22.21 and the floor 22.12.0 as in
task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added.
2. **CB-8.** `git diff --exit-code origin/main...HEAD -- catalog.yaml compat.yaml schema/` exits 0.
3. **Five new notes,** files `F-022-<slug>.md` … `F-026-<slug>.md`, numbered without gaps, in the
   inbox format (README › Rules, WingFoil dl-163 R4): `status: open`, `wingfoil_version: 0.2.2`,
   `answered_by: []`; the first line "New note (task-026)."; an `## Observed` with the commands,
   their output and exit codes, reproduced with WingFoil 0.2.2 from npm alone in a scratch project
   (`git init`, then `wingfoil init --template Kanban`, W-10), any path shown as a neutral one
   (`/tmp/x`, as F-021) or elided; an `## Expected`.
   - F-022 (defect): `memory submit` commits uncommitted body edits in its transition commit (W-04);
   - F-023 (request): the `submit` commit subject does not name the transition (W-05);
   - F-024 (gap): the illegal-transition error does not name the expected verb or state (W-06);
   - F-025 (gap): no verb leaves a `waiting` state except `deprecate` (W-07);
   - F-026 (request): a phase has one role, so the role cannot depend on the element (bug-001); the
     observed output is what 0.2.2 does with a list `role:`.
4. **Ledger and directive.** The README ledger has a row per new note, as the note says. In
   `wingfoil-cli`: the Note column of W-04 … W-07 names F-022 … F-025; W-07's behaviour reads "No
   verb leaves a `waiting` state except `deprecate`."; a new entry W-13 (a phase has one `role`;
   the workaround `tooling-delivery` beside `kanban-delivery`, bug-001) with Note `F-026` and an
   empty WingFoil element. The directive's version goes 1.1 → 1.2, dated 2026-10-12 (a convention,
   as in `ffed728`); *Checked against* stays `wingfoil@0.2.2` and the heading "Known behaviours
   (0.2.2)" stays.
5. **Fixes.** F-012's title is "Format key distinct from `version:`" in the note and in the ledger;
   its other fields stay, `wingfoil_version: 0.2.2-1778-g30f06016` included. F-018 gains an output
   block reproduced with WingFoil 0.2.2 from npm, with a lead-in line; its title, fields and prose
   otherwise stay. Both keep their first line.
6. **Nothing else changes.** The Execution Notes list the task's commits; `git diff --name-only`
   over them lists only this element, `docs/wingfoil-feedback/` and
   `.wingfoil/directives/custom/wingfoil-cli.md`.
7. **CI.** The pushed branch runs `.github/workflows/ci.yml`; the real run's conclusion, for both
   Node.js versions, is recorded in the Execution Notes before `in-review`.
8. **On time.** The task is `done` on the branch, and the branch merged into `main` and pushed,
   before 2026-10-20.

## Design

On `retro/2026-10-12-periodic` (Context), through `tooling-delivery` as `developer`
(`documentation`, `wingfoil-cli`). Content only: no code, no new test. The checks are the existing
`tests/wingfoil-feedback.test.ts` and `tests/support/inbox.ts` (numbering, first line, sections,
ledger as the note says, directive Note column linking existing notes), unchanged.

Red steps (dl-018 R1, ahead of its configuration change):
1. The ledger rows and the directive's Note cells for F-022 … F-026 first, without the notes:
   `tests/wingfoil-feedback.test.ts` fails on the ledger and on the directive's links (red,
   counted in the notes).
2. The five notes, from reproductions run with WingFoil 0.2.2 from npm (`node_modules/.bin`, the
   governance pin) in a scratch `git init` + `wingfoil init --template Kanban` project outside the
   repository; outputs copied with neutral paths: green.
3. F-012's title in the note and the ledger together; F-018's output block from a reproduction
   (`workflow list` accepts `where:`; `memory search --help` has no field filter): stays green; a
   mutation (ledger title left truncated) shows the ledger test guards the title.

Commits: one for steps 1–2 (notes, ledger, directive), one for step 3; the Execution Notes list
them.

## Execution Notes
- 2026-10-12, design: written (`git log` "task-026 design"), task started (backlog → in-progress).
- 2026-10-12, build, red: with the ledger rows and the directive's Note cells for F-022 … F-026 but
  no notes, `node --test dist/tests/wingfoil-feedback.test.js` gave 6 tests, 4 pass, 2 fail ("lists
  every note in the README ledger as the note says", "links every known behaviour of wingfoil-cli
  to existing notes"). Green after the notes (6 of 6). Every note was reproduced again with
  WingFoil 0.2.2 from npm in a scratch project outside the repository (`git init`, then
  `wingfoil init --template Kanban`); paths shown as `/tmp/x`. A first draft of the notes, written
  before the task existed, had been lost with a session restart (plan-025 › Execution Notes).
- 2026-10-12, F-012 and F-018: mutation, the ledger left at the truncated title while the note has
  the restored one: the ledger test fails (1 of 6), so it guards the title. F-018's output block
  is from a reproduction: `workflow list` exit 0 with no warning and the `where` clause echoed;
  `memory search` has no field filter (`--pack` exit 2) and prints no `pack`.
- 2026-10-12, **Acceptance 1 against 6, raised when found (dl-019 R1).** In a clean clone at
  `c966e12`, `npm test` gave 803 tests, 3 failing, on both Node.js versions, and CI run
  38284275227 on `c966e12` ended in `failure`: `tests/feedback-note.test.ts` (task-015) pins the
  next note's number to `F-022`. Acceptance 1 (`npm test` exits 0) and 6 (nothing outside the
  inbox and the directive changes) could not both hold. The approver ruled on 2026-10-12: capture
  the defect as **bug-002** and fix it in this task; Acceptance 6 therefore also admits
  `tests/feedback-note.test.ts` and bug-002's element. The Acceptance text stays as approved
  (dl-019 R2).
- 2026-10-12, bug-002 fix: the tests derive the next number as the tool does (the highest note
  number plus one, `src/feedback-inbox.ts`), red already shown by the three failures above; a
  mutation (plus two instead of one) fails the same three tests. bug-002 reviewed independently
  (approve after amendments: "highest plus one", not "count plus one"; a minimal reproduction)
  and amended, then submitted `pending`.
- Task commits: `31c6f78` (notes, ledger, directive), `c966e12` (F-012, F-018), `a6bfcd3` and
  `76372e2` (bug-002 fix), `4c6fd64` (note wording after the build review); with this element's own
  commits and bug-002's (`5f976ad` add, `de41b71` body, `f5d8177` amendments, `633aeee` submit).
- 2026-10-12, Acceptance from a clean clone at `633aeee`, on Node.js 22.21.0 and 22.12.0: `npm ci`,
  `build`, `test` (803 tests, 803 pass), `lint`, `check:pins`, `check:schemas`, `check:packs` exit
  0; CB-8 `git diff --exit-code origin/main...HEAD -- catalog.yaml compat.yaml schema/` exits 0.
- 2026-10-12, build review (independent subagent): approve after amendments, 0 blocking, 2
  should-fix, 3 nits. It re-ran the reproductions of F-022 … F-026 and F-018 with WingFoil 0.2.2
  and found them exact; the test fix matches `src/feedback-inbox.ts` and weakens nothing. Fixed:
  the commit list above (should-fix), F-023's count dated before this task and `deprecate`
  subjects, the omitted JSON output marked in F-022 and F-024 (`4c6fd64`). Not fixed, nit: `NEXT`
  is computed from this repository's inbox rather than from the copied tree, equivalent while the
  tree is a straight copy. Not re-reviewed (dl-017 R2): the fixes change wording only, no behaviour,
  test or Acceptance command.
- 2026-10-12, CI (Acceptance 7): run 38287775681 on `da2843e`, conclusion `success` for both
  `validate (22.21.0)` and `validate (22.12.0)`; the earlier run 38287205946 on `f834b0a` was
  `success` too, and 38284275227 on `c966e12` the `failure` that bug-002 explains. Submitted
  `in-review`.
