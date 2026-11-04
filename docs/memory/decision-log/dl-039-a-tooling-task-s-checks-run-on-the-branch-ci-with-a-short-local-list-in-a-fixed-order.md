---
id: dl-039-a-tooling-task-s-checks-run-on-the-branch-ci-with-a-short-local-list-in-a-fixed-order
type: decision-log
title: "A tooling task's checks run on the branch CI, with a short local list, in a fixed order"
status: pending
tags: ["process","ci","tooling"]
---

## Context

A tooling task (`tooling-delivery` v2) and a pack task (`kanban-delivery`) are checked, before
`in-review`, from clean clones of the branch on Node.js 22.21.0 and 22.12.0, one after the other:
`npm ci`, `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
`validate`, the golden step, the overlays, `workflow list`, `check:runs`, `validate:publication`,
`npm audit` in the root and in every matrix folder (plan-051 step 2, plan-060 step 2). The rule
lives in plans' steps, not in the workflows. In plan-060 three rounds took about fifteen hours on a
loaded machine, and a review fix during a round made it run again; the branch CI ran nearly the same
checks on both Node.js versions and caught bug-010 on its own (inventory of 2026-11-04 §2, §5).
Asked by the approver on 2026-11-03 (plan-060 › Execution Notes): an order of checks (the build
review and its amendments first, the clean clones once on the frozen commit, documentation-only
commits after them needing no new run, no heavy reviewer run beside them), and a candidate to read:
the branch CI in place of the clones, keeping locally `validate:publication`, the golden tree in
publication mode, `index -- --check` and `workflow list`, linked to G12 (the suite's duration
against the CI's 30-minute timeout; the period's maximum 22 min 47 s). `tooling-delivery`,
`kanban-delivery` and `repository-practice` are this repository's own, so W10 does not fix it
(inventory §7). Candidates GOV-1 and GOV-2 of the retrospective dl-038 (C1), joined at the
checkpoint (P1).

## Options

1. **Keep the clean clones**, with the order written down. Rejected: they repeat what the branch
   CI runs, at hours of cost.
2. **The branch CI in place of the clones, a short local list for what the CI does not run on a
   branch.** The CI runs on both Node.js versions every check of the clones (`npm ci` with no
   dependency cache, `npm test`, `lint`, the pins, schemas and packs checks, every `npm audit`,
   `validate` with the index check inside it, the golden step, the three overlays, `check:runs`);
   on a branch it runs no `validate:publication` (tags only) and no `workflow list`.
3. **Option 2, and the CI runs the publication checks on branches too.** Rejected for now: about one
   minute more per job (`validate:publication` 19–22 s on the tag run 41452326966, the golden tree
   in publication about 25–35 s), on a job already at 76 % of its timeout (G12); the margin is the
   argument, a small one.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **R1 — Option 2**, for a tooling task (`tooling-delivery`) and a pack task (`kanban-delivery`),
  a content-only task (a feedback note) included, whose clean clones it replaces. Before
  `in-review` the checks are:
  - the branch CI's conclusion `success` on the task's frozen commit; or, when a later push
    cancelled that run (`ci.yml`'s `concurrency` cancels a branch's earlier run), the `success` of a
    later head whose diff from the frozen commit is documentation-only (as R2); each run id and its
    two jobs' durations recorded in the notes;
  - from a clean working tree on the frozen commit, on Node.js 22.21.0, after `npm ci` and
    `npm run build`:
    `npm run validate:publication`, the golden tree in publication mode
    (`npm run validate:publication -- --tree tests/fixtures/compose/tree --param
    project_name=Golden`) and `npm run -s wingfoil -- workflow list`, each exit 0. The approver's
    list of 2026-11-03 also names `index -- --check`; it is left out because the CI runs it inside
    `validate` (`src/validate.ts`), a departure the approver rules with this element.
  - A clean clone with an empty `.cache` remains for a change to how the matrix installs or
    initialises a release (`src/matrix.ts`) with unchanged lockfiles, since the CI's matrix cache
    is keyed by the matrix lockfiles (and the runner's OS and Node.js version), not by
    `src/matrix.ts`; or at the approver's request.
- **R2 — The order** (asked by the approver on 2026-11-03): the build review and its amendments
  first; then R1's checks once, on the commit where the code is frozen; a documentation-only commit
  after them (`docs/memory`, `docs/plans`) needs no new run, said in the task's notes; a reviewer
  runs only targeted tests while R1's local checks run. A red branch CI is a finding of the build,
  fixed and checked again.
- **R3 — G12's row (row 10):** every task's notes record its branch CI's job durations (R1), and the
  closing plan records `main`'s; a job over 25 minutes goes to the approver when it is read. The
  row moves to Closed when this decision is applied; a CI change that adds steps (option 3) is a
  decision of its own.
- **R4 — Where:** `tooling-delivery` v2 → v3 and `kanban-delivery` v4 → v5 in the same change (the
  two files are checked against each other), R1 and R2 in their `review` phase's description beside
  the re-review rule of dl-017; an Execution Note on dl-017 (R2's order beside its re-review rule).
  Applied after approval by the dl actions plan of dl-035 … dl-037 (dl-038 D3), beside dl-035 A4's
  change to `ci.yml`.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-04: written under plan-061 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-038.
- 2026-11-04: independent review: approve after amendments, nothing blocking; five should-fix and
  five nits, all applied: option 3's cost (about one minute per job); a cancelled run of the frozen
  commit; the cache case named for a clean clone; `kanban-delivery` v4 → v5 and the place beside
  dl-017's rule; content-only tasks; pack tasks named in R1 (the title kept, its id fixed); the
  approver's `index -- --check` as a departure to rule; the local list's Node.js version and build;
  the request's origin; G12's row named.
- 2026-11-04: re-review: approve; its three nits applied (R2's definition cited, `npm ci` before
  the build, the cache key). Submitted.
