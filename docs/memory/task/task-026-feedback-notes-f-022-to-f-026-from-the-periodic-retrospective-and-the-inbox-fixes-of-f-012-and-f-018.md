---
id: task-026-feedback-notes-f-022-to-f-026-from-the-periodic-retrospective-and-the-inbox-fixes-of-f-012-and-f-018
type: task
title: "Feedback notes F-022 to F-026 from the periodic retrospective, and the inbox fixes of F-012 and F-018"
status: draft
pack: ""            # no pack: the feedback inbox (hosted by plan-025, tooling-delivery)
depends_on: []
tags: ["feedback","retrospective"]
---

## Context

The WingFoil-side points of the periodic retrospective of 2026-10-12 (plan-025, phase `capture`;
dl-016 W1–W3; inventory `docs/retrospectives/2026-10-12-periodic-friction-inventory.md` §7). A
WingFoil defect or gap is a feedback note, not a decision (dl-006 R2). The inbox's rule, checked by
`tests/support/inbox.ts`, is that a new note opens with "New note (task-NNN)." naming the element it
comes from; the approver chose, on 2026-10-12, a task of its own for the notes rather than a change
of that rule. Hosted by plan-025 as task-025 was hosted by plan-024. No pack.

It comes from:
- the `wingfoil-cli` directive's known behaviours with no note: W-04, W-05, W-06, W-07;
- bug-001 › fix options: "A phase has one role in WingFoil 0.2.2", with no note and no
  `wingfoil-cli` entry;
- two defects of existing notes, found by the inventory: the title of F-012 lost its code span in
  the split of task-010 ("Format key distinct from version:", originally "Format key distinct from
  `version:`"); F-018 states its evidence in prose, with no output block (WingFoil dl-163 R4:
  command, output, version);
- dl-006 R3: the notes reach `main` before WingFoil's release planning; WingFoil v0.3 is expected
  around 2026-10-20 and its retrospective reads this inbox (`svc-018`).

Not in scope: rule 7 of `wingfoil-cli` (dl-016 A1); the sync and every status other than `open`
(rule 6); CB-8: `catalog.yaml`, `compat.yaml` and `schema/` do not change.

## Acceptance

Run from a clean clone of the branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added.
2. **CB-8.** `git diff --exit-code origin/main...HEAD -- catalog.yaml compat.yaml schema/` exits 0.
3. **Five new notes,** in the inbox format (README › Rules, WingFoil dl-163 R4): `status: open`,
   `wingfoil_version: 0.2.2`, `answered_by: []`; the first line "New note (task-026)."; an
   `## Observed` with the commands, their output and exit codes, reproduced with WingFoil 0.2.2 from
   npm alone in a scratch project made by `wingfoil init`; an `## Expected`; no local path.
   - F-022 (defect): `memory submit` commits uncommitted body edits in its transition commit (W-04);
   - F-023 (request): the `submit` commit subject does not name the transition (W-05);
   - F-024 (gap): the illegal-transition error does not name the expected verb or state (W-06);
   - F-025 (gap): no verb leaves a `waiting` state except `deprecate` (W-07);
   - F-026 (request): a phase has one role, so the role cannot depend on the element (bug-001).
4. **Ledger and directive.** The README ledger has a row per new note, as the note says. In
   `wingfoil-cli`, the Note column of W-04 … W-07 names F-022 … F-025; a new entry W-13 (a phase
   has one `role`; the workaround `tooling-delivery` beside `kanban-delivery`) names F-026; the
   directive's version goes 1.1 → 1.2, dated 2026-10-12.
5. **Fixes.** F-012's title is "Format key distinct from `version:`" in the note and in the ledger;
   F-018 gains an output block reproduced with WingFoil 0.2.2, its prose otherwise unchanged. Both
   keep their first line.
6. **Nothing else changes:** besides this element, `git diff --name-only` of the task's commits
   lists only `docs/wingfoil-feedback/` and `.wingfoil/directives/custom/wingfoil-cli.md`.
7. **CI.** The pushed branch runs `.github/workflows/ci.yml`; the real run's conclusion is recorded
   in the Execution Notes before `in-review`.
8. **On time.** The task is `done` and on `main`, pushed, before 2026-10-20.

## Design

Filled at the start of the work.

## Execution Notes
