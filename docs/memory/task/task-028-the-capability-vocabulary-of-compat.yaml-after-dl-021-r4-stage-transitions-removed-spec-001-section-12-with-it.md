---
id: task-028-the-capability-vocabulary-of-compat.yaml-after-dl-021-r4-stage-transitions-removed-spec-001-section-12-with-it
type: task
title: "The capability vocabulary of compat.yaml after dl-021 R4: stage-transitions removed, spec-001 section 12 with it"
status: draft
pack: ""            # tooling task (hosted by plan-032, tooling-delivery)
depends_on: []
tags: ["tooling","compat","wingfoil"]
---

## Context

dl-021 R4 (`approved` 2026-10-13): `requires_capabilities` and `compat.yaml` › `capabilities` stay,
with a provisional vocabulary of `pack-install` and `workflow-engine` until WingFoil publishes one
(WingFoil dl-177, added in `b34f827f` after dl-021 as the proposal of its dl-149 Action 3);
`stage-transitions` leaves it (R2: no `stage set` verb); at
`wingfoil-release-intake` a release is recorded as providing a capability only when its CHANGELOG
names the feature or command behind it. Hosted by plan-032. As task-026 and task-027, on the
approver's rule that a plan's work stays on its branch, it runs on `spec/spec-001-dl-021`, not on
`task/<id>`: its `done` commit lands there and its `deliver` is that branch's merge. No pack.

spec-001 §12's example is the real `compat.yaml` (dl-010), and `tests/compat.test.ts` checks that
the file equals the example, that `tests/fixtures/compose/tree/compat.yaml` equals the file, and
that the vocabulary is `pack-install`, `workflow-engine`, `stage-transitions`. The four change
together. spec-001's other changes are plan-032's step 1.

Not in scope: `wingfoil-release-intake`'s own text (dl-021's configuration changes); the schema
fixtures and the `TRANSITION` fixture of `tests/check-packs.test.ts` that name
`stage-transitions` as a free capability string; CB-8 does not apply (this is not a spec-002 task),
and `schema/` does not change.

## Acceptance

Run from a clean clone of `spec/spec-001-dl-021`; Node.js 22.21 and the floor 22.12.0.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check` and
   `npm run validate` exit 0; no dependency is added.
2. **spec-001 §12:** the example drops the `stage-transitions` line; the bullet on `capabilities`
   says the vocabulary is provisional (dl-021 R4) until WingFoil's capabilities query (WingFoil
   dl-177); the `releases[]` › `capabilities` bullet says that `wingfoil-release-intake` records a
   capability for a release only when its CHANGELOG names the feature or command behind it (dl-021
   R4's intake rule, placed here on purpose, where §12 describes the field it fills). Nothing else
   in §12 changes.
3. **`compat.yaml`** equals §12's example; `tests/fixtures/compose/tree/compat.yaml` equals it.
4. **`tests/compat.test.ts`** expects the vocabulary `pack-install`, `workflow-engine`; it fails
   (red) before the files change.
5. `git diff --exit-code origin/main...HEAD -- schema/` exits 0.
6. **Nothing else changes:** `git diff --name-only` over the task's commits (listed in the
   Execution Notes) shows only this element, spec-001, `compat.yaml`,
   `tests/fixtures/compose/tree/compat.yaml` and `tests/compat.test.ts`.
7. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
   `in-review`.

## Design

Filled at the start of the work.

## Execution Notes
