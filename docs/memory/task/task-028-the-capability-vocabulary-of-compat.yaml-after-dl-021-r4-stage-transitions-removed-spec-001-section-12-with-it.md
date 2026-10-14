---
id: task-028-the-capability-vocabulary-of-compat.yaml-after-dl-021-r4-stage-transitions-removed-spec-001-section-12-with-it
type: task
title: "The capability vocabulary of compat.yaml after dl-021 R4: stage-transitions removed, spec-001 section 12 with it"
status: in-progress
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

On `spec/spec-001-dl-021` (Context), through `tooling-delivery` v2 as `developer`. Red steps
(dl-018 R1):
1. `tests/compat.test.ts` expects `pack-install`, `workflow-engine`: the vocabulary assertion fails
   against the current `compat.yaml` (red, counted).
2. spec-001 §12 (example and the two bullets), `compat.yaml` and the compose fixture's
   `compat.yaml` edited together: green, the equality checks of the same test included.

One commit for the whole change; the Execution Notes list it.

## Execution Notes
- 2026-10-14, design written, task started (backlog → in-progress).
- 2026-10-14, build, red: `tests/compat.test.ts` expecting `pack-install`, `workflow-engine` gave 8
  tests, 7 pass, 1 fail ("loads the releases of the real file"); green (8 of 8) after spec-001 §12,
  `compat.yaml` and the compose fixture's `compat.yaml` changed together.
- Task commit: `d0b873b` (spec-001 §12, `compat.yaml`, `tests/fixtures/compose/tree/compat.yaml`,
  `tests/compat.test.ts`), plus this element's own commits.
- 2026-10-14, Acceptance from a clean clone at `d0b873b`, on Node.js 22.21.0 and 22.12.0: `npm ci`,
  `build`, `test` (803 of 803), `lint`, `check:pins`, `check:schemas`, `check:packs`,
  `index -- --check`, `validate` exit 0; `schema/` unchanged.
- 2026-10-14, build review (independent subagent, with plan-032's steps 1 and 3): approve; nothing
  else in the repository depends on `stage-transitions` being in the real vocabulary.
- 2026-10-14, CI (Acceptance 7): run 38531987510 on `fe6c0cb`, conclusion `success` for both
  Node.js versions. Submitted `in-review`.
