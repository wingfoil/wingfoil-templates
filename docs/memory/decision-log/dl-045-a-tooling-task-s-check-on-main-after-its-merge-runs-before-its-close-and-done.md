---
id: dl-045-a-tooling-task-s-check-on-main-after-its-merge-runs-before-its-close-and-done
type: decision-log
title: "A tooling task's check on main after its merge runs before its close and done"
status: pending
tags: ["process","tooling","workflow"]
---

## Context

`tooling-delivery` v4's `deliver` phase reads "Merge task/<id> into main with --no-ff, then approved
→ done". task-100 needed a check on `main` after its merge: the rehearsal of `intake.yml`, which
runs only from a pushed ref. plan-077 step 2 named `done` before that rehearsal; task-100's
criterion 9 put it before the close commit and `done`, so a red rehearsal leaves the task
`approved`, sends the finding to the approver and opens a fix through a reserved task or bug
(task-100 › Acceptance 9; plan-077 › Execution Notes, step 2). `kanban-delivery`, the same loop for
pack tasks, has the same `deliver`. Candidate GOV-2 of dl-043 (C2); the inventory of 2026-11-21,
§4. The row "The engine way of working" says nothing of it.

## Options

1. **As today:** each task's Acceptance says it. Rejected: the workflow's own text then contradicts
   the task, and a plan reads the workflow's order, as plan-077 step 2 did.
2. **`deliver` names the check after the merge:** a check the task's Acceptance names on `main`
   (a workflow dispatched on `main`, a CI run, a live read) runs after the merge is pushed and
   before the close commit and `approved → done`; a red check stops the close.
3. **A phase of its own after `deliver`.** Rejected: one more phase for a step most tasks do not
   have.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **P1 — Option 2**, in `tooling-delivery` and `kanban-delivery` alike: `deliver` reads "Merge
  task/<id> into main with --no-ff and push; `main`'s CI read; if the task's Acceptance names a
  check on `main`, it runs and is read; then the close commit and approved → done. A red check stops
  the close: the task stays approved, the finding goes to the approver, and its fix is a task or
  a bug of its own."
- **P2 — Applied after approval** by a dl actions plan: `tooling-delivery` 4 → 5 and
  `kanban-delivery` 6 → 7 together, their headers' "differ only in roles and descriptions" kept
  true, `npm run -s wingfoil -- workflow list` and `check:runs` exit 0; the bumps shared with
  dl-047's (dl-043 D3).

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-21: written under plan-078 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-043, as the approver kept it at the checkpoint (the inventory of 2026-11-21, P2, P3).
- 2026-11-21: independent review: approve after amendments; one should-fix (the check only if the
  task names one) and one nit (the headers quoted, the bumps named), applied.
- 2026-11-21: re-review: approve; two nits (a wrap; the shared bumps), applied.
