---
id: task-022-examples-as-fixtures-the-layout-the-lint-rule-and-the-validation-step-spec-002-2.4-cb-2
type: task
title: "Examples as fixtures: the layout, the lint rule and the validation step (spec-002 §2.4, CB-2)"
status: pending
pack: ""            # tooling task (tooling-change › deliver, tooling-delivery)
depends_on: ["task-021-the-agent-path-the-procedure-in-catalog.md-and-llms.txt-tested-offline-spec-002-4-cb-6"]
tags: ["tooling","W14","F2.8"]
---

## Context

Task 4 of plan-024 (`tooling-change` › `deliver`, wave W14, F2.8). Tooling task, no pack. Below,
"plan-024 task N" names a step of that plan, not a Memory element.

It comes from:
- **dl-014 D1 (section 7) and D7 T3:** every example of a README is a fixture that the validation
  command composes and validates, so an example cannot rot;
- **spec-002 §2.4** (section 7: one or more `### <example>` with a `Fixture:` line; the fixture's
  `example.yaml` in the preset format, `id` equal to the example, `packs` containing the pack and
  naming only packs of the tree; composed and validated as a preset; not indexed, no profile; the
  temporary exemption) and **§6 CB-2**;
- **the approver's ruling of 2026-10-10** (the temporary exemption) and **of 2026-10-11** on its
  reading: spec-002 says "while the tree holds no methodology" (§6 CB-2) and "until the first
  methodology is published" (§2.4); the approver chose the first, stricter reading: the exemption
  holds only while `packs/methodology/` holds no pack. So the first methodology ships with its
  examples. Recorded as a spec-002 erratum of §2.4 in the Execution Notes;
- **task-018:** the README outline and rules; section 7 holds today a placeholder line in every
  fixture README, which this task replaces;
- **task-012** (the lint of presets: schema, `id` equal to the file name, cardinalities, values)
  and **task-008** (`validate` composes every preset twice and runs the matrix).

Facts the Acceptance relies on:
- "the tree holds a methodology" means a directory under `packs/methodology/` whose `pack.yaml`
  passes its schema;
- the golden tree (`tests/fixtures/compose/tree`) holds `methodology/kanban`, so each of its six
  packs gets at least one real example, with its fixture under
  `tests/fixtures/compose/tree/tests/fixtures/examples/`; this repository holds no pack, so its
  `tests/fixtures/examples/` stays absent;
- the scratch trees of the tests (`tests/support/pack-tree.ts`, `published-repo.ts`) usually hold
  `methodology/kanban`, so the test support writes an example and its fixture for each pack;
- the rule is a rule of the tree, like the preset rules: the composer, which composes packs, not
  examples, does not apply it.

Not in scope: examples of real packs (each pack's own tasks); the root `README.md` (plan-024
task 5); the search page (task 6); CB-8: `catalog.yaml`, `compat.yaml` and `schema/` do not change
(the preset schema is reused as it is).

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network. `npm run validate` exits 0, and so does
   `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden`.
2. **CB-8.** `git diff --exit-code origin/main -- catalog.yaml compat.yaml schema/` exits 0 on the
   task branch.
3. **Section 7 (§2.4).** In a pack README, section 7 holds either one or more examples, or, while
   the tree holds no methodology, exactly the line `None yet: no methodology pack is published.`
   (with blank lines only around it). Every level-3 heading of section 7 is an example:
   `### <example>`, a name of spec-001 §4's grammar, unique in the README, whose first non-blank
   line is exactly `Fixture: tests/fixtures/examples/<pack name>/<example>/`, `<pack name>` the
   pack's `name`. Text may follow (the situation, the composition, what the project gets, how a
   phase runs); it is not checked.
4. **The fixture (§2.4, CB-2).** `<tree>/tests/fixtures/examples/<pack name>/<example>/` holds
   `example.yaml`, which: passes `schema/preset.schema.json`; has `id` equal to `<example>`; has no
   `profile`; has `packs` that contain the pack (an entry whose id, before `@`, is the pack's
   catalog id, `base` included) and name only packs of the tree; passes the preset rules of
   task-012 on its parameters and cardinalities.
5. **Both ways (CB-2).** An example whose fixture is missing fails; a directory under
   `<tree>/tests/fixtures/examples/` that no README example names fails, a `<pack name>` that is
   no pack of the tree included; the exemption line fails once the tree holds a methodology; a
   section 7 with neither examples nor the exemption line fails.
6. **The rules.** The lint (`check:packs`, `validate`, `validate:publication`) reports them under
   the rule ids `example-section` (acceptance 3, the exemption of acceptance 5) and
   `example-fixture` (acceptance 4, the rest of acceptance 5), each problem at a file and line.
7. **Validation (§2.4).** `npm run validate` and `npm run validate:publication` compose every
   example as they compose a preset: twice, compared byte for byte, then through the matrix, with
   the report line `composition tests/fixtures/examples/<pack name>/<example>/example.yaml: …`;
   an example the lint rejects is skipped with the line `… skipped, the lint reports it`, as a
   preset is. The compositions count (`compositions: <n>`) includes them.
8. **Not indexed (§2.4).** `catalog-index.json` and `CATALOG.md` do not list examples; the
   committed index outputs and `tests/fixtures/index/expected/` change only if a README's section 2
   changes (it does not).
9. **Fixtures.** Each of the golden tree's six packs has at least one example in its README and its
   fixture, composable; the golden tree's expected composition (`tests/fixtures/compose/expected`)
   is unchanged. The test support writes, for each pack it writes, one example and its fixture
   composable with `methodology/kanban`, unless a test opts out; no existing assertion is weakened.
10. **Tests,** red first: every rule of acceptance 3–6 with a passing and a failing case; the
    exemption on both sides of "the tree holds a methodology"; the composition, the skip and the
    count of acceptance 7.
11. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
    conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
