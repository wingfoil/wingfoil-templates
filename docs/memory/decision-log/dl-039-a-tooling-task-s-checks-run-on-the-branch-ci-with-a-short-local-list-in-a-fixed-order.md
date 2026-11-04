---
id: dl-039-a-tooling-task-s-checks-run-on-the-branch-ci-with-a-short-local-list-in-a-fixed-order
type: decision-log
title: "A tooling task's checks run on the branch CI, with a short local list, in a fixed order"
status: draft
tags: ["process","ci","tooling"]
---

## Context

A tooling task (`tooling-delivery` v2) and a pack task (`kanban-delivery`) are checked, before
`in-review`, from clean clones of the branch on Node.js 22.21.0 and 22.12.0, one after the other:
`npm ci`, `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
`validate`, the golden step, the overlays, `workflow list`, `check:runs`, `validate:publication`,
`npm audit` in the root and in every matrix folder (plan-051 step 2, plan-060 step 2). The rule
lives in plans' steps, not in the workflows. In plan-060 three rounds took about fifteen hours on
a loaded machine, and a review fix during a round made it run again; the branch CI ran nearly the
same checks on both Node.js versions and caught bug-010 on its own (inventory of 2026-11-04 §2,
§5). The approver set an order on 2026-11-03 (plan-060 › Execution Notes): the build review and
its amendments first, the clean clones once on the frozen commit, documentation-only commits after
them needing no new run, no heavy reviewer run beside them; and asked to read the branch CI in place
of the clones, keeping locally `validate:publication`, the golden tree in publication mode,
`index -- --check` and `workflow list`, linked to G12 (the suite's duration against the CI's
30-minute timeout; the period's maximum 22 min 47 s). `tooling-delivery`, `kanban-delivery` and
`repository-practice` are this repository's own, so W10 does not fix it (inventory §7). Candidates
GOV-1 and GOV-2 of the retrospective dl-038 (C1), joined at the checkpoint (P1).

## Options

1. **Keep the clean clones**, with the order written down. Rejected: they repeat what the branch
   CI runs, at hours of cost.
2. **The branch CI in place of the clones, a short local list for what the CI does not run on a
   branch.** The CI's publication step runs on tags only, and it runs no `workflow list`.
3. **Option 2, and the CI runs the publication checks on branches too.** Rejected for now: it adds
   about two minutes per job to a job already at 76 % of its timeout (G12).

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **R1 — Option 2.** A task's checks before `in-review` are: the branch CI's conclusion `success`
  on the task's frozen commit, its run id and the two jobs' durations recorded in the notes; and,
  from the working tree on that commit, `npm run validate:publication`, the golden tree in
  publication mode (`npm run validate:publication -- --tree tests/fixtures/compose/tree --param
  project_name=Golden`) and `npm run -s wingfoil -- workflow list`, each exit 0 (`index -- --check`
  runs in the CI inside `validate`). A clean clone remains for what the CI cannot show (a check
  that depends on a fresh install outside the CI's cache, or the approver's request).
- **R2 — The order** (the approver's of 2026-11-03): the build review and its amendments first;
  then R1's checks once, on the commit where the code is frozen; a documentation-only commit after
  them (`docs/memory`, `docs/plans`) needs no new run, said in the task's notes; a reviewer runs only
  targeted tests while R1's local checks run. A red branch CI is a finding of the build, fixed and
  checked again.
- **R3 — G12:** every task's notes record its branch CI's job durations (R1), and the closing plan
  records `main`'s; a job over 25 minutes goes to the approver when it is read. G12's row moves to
  Closed when this decision is applied; a CI change that adds steps (option 3) is a decision of its
  own.
- **R4 — Where:** `tooling-delivery` v2 → v3 and `kanban-delivery` in the same change (the two
  files are checked against each other), their `review` phase naming R1 and R2; an Execution Note
  on dl-017 (R2's order beside its re-review rule). Applied after approval by the dl actions plan of
  dl-035 … dl-037 (dl-038 D3), beside dl-035 A4's change to `ci.yml`.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-04: written under plan-061 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-038.
