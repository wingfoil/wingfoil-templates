---
id: task-022-examples-as-fixtures-the-layout-the-lint-rule-and-the-validation-step-spec-002-2.4-cb-2
type: task
title: "Examples as fixtures: the layout, the lint rule and the validation step (spec-002 §2.4, CB-2)"
status: in-progress
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
  examples. Recorded as a spec-002 erratum of §2.4 in this task's Execution Notes, for the next
  element that amends spec-002. Its cost, for the record: a README is in its pack's digest, so when
  the first methodology enters the tree, every published pack whose section 7 holds the exemption
  line fails the lint; `base` (W9) then needs a new version with examples in the same wave as the
  first methodology (W10);
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
- the rules are rules of the tree, like the preset rules: they run in the lint's tree group, outside
  `readmeProblems`, so the composer (which applies `readmeProblems` to the packs it composes, and
  composes packs, not examples) does not apply them;
- a composition request accepts `base@^1` explicitly (the resolver deduplicates it against the
  foundation).

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
   with blank lines only around it. Only blank lines precede the first level-3 heading. Every
   level-3 heading of section 7 is an example: `### <example>`, a name of spec-001 §4's grammar,
   unique in the README, whose first non-blank line is exactly
   `Fixture: tests/fixtures/examples/<pack name>/<example>/`, `<pack name>` the pack's `name` (a
   tightening of §2.4's "followed by"). Text may follow (the situation, the composition, what the
   project gets, how a phase runs); it is not checked.
4. **The fixture (§2.4, CB-2).** `<tree>/tests/fixtures/examples/<pack name>/<example>/` holds
   exactly `example.yaml`, which: passes `schema/preset.schema.json`; has `id` equal to
   `<example>`; has no `profile`; has `packs` that contain the pack (an entry whose id, before
   `@`, is the pack's id `packs/<id>`, `base` included) and name only packs of the tree; passes
   the preset checks of task-012 on its cardinalities and parameter values. `preset-name` does not
   apply (it is replaced by `id` = `<example>`). The YAML rules (integers, no `.nan`/`.inf`) and the
   secret rules of task-012 cover `tests/fixtures/examples/` too, and the lint's `checked <n> files`
   counts its files; `check:schemas` and its finder are unchanged.
5. **Layout and both ways (CB-2).** Every entry under `<tree>/tests/fixtures/examples/` is a
   directory `<pack name>/` of a pack of the tree, and every entry under it a directory
   `<example>/` that a README example of that pack names; any other entry fails. An example whose
   fixture is missing fails at the README's `Fixture:` line; the exemption line fails once the tree
   holds a methodology; a section 7 with neither examples nor the exemption line fails.
   A missing fixture is an `example-fixture` problem at the README's `Fixture:` line.
6. **The rules.** The lint (`check:packs`, `validate`, `validate:publication`) reports them in its
   tree group under the rule ids `example-section` (acceptance 3, the section 7 cases of acceptance
   5), at the README's line, and `example-fixture` (acceptance 4, the layout cases of acceptance
   5), at the `example.yaml` line or, for an entry with no file, at its path with no line. The
   task-012 checks applied to `example.yaml` report under `example-fixture`.
7. **Validation (§2.4).** `npm run validate` and `npm run validate:publication` compose every
   `example.yaml` found under `tests/fixtures/examples/` as they compose a preset: in the byte order
   of their path, after the presets and before the `entries`; twice, compared byte for byte, then
   through the matrix; with the report line
   `composition tests/fixtures/examples/<pack name>/<example>/example.yaml: …` and its matrix
   lines. An example is skipped, with `… skipped, the lint reports it`, when the lint reports a
   problem in its `example.yaml` or at its directory (an orphan's `example.yaml` too).
   `compositions: <n>` counts them.
   `--param` keeps its semantics (it may not override a value the composition sets).
8. **Publication.** `npm run publish:pack` counts an example that contains the pack as a
   composition of the validation, like a preset; the pack-release evidence lists examples among
   its Compositions. The publish test that relies on "no composition" builds its tree with the
   example opt-out.
9. **Not indexed (§2.4).** `catalog-index.json` and `CATALOG.md` do not list examples; the
   committed index outputs and `tests/fixtures/index/expected/` are unchanged (the index does not
   read section 7).
10. **Fixtures.**
    - Each of the golden tree's six packs has at least one example in its README and its fixture,
      composed and validated by `npm run validate -- --tree tests/fixtures/compose/tree --param
      project_name=Golden`; the examples do not set `project_name` (the run's `--param` gives it,
      as for `presets/golden.yaml`). The golden expected composition
      (`tests/fixtures/compose/expected`) is unchanged.
    - `withPackTree` and `treeRepo` write section 7 and the fixtures once all packs are written: if
      the tree holds `methodology/kanban`, one example `basic` per pack,
      `packs: [<pack>@^<its major>, methodology/kanban@^1]` (a methodology pack's own: itself
      only); otherwise the exemption line. A test whose tree cannot compose these (a non-composable
      `base`, conflicts, missing requires) opts out with `examples: false`. `tests/support/readme.ts` loses the placeholder line.
    - Tests that place content in section 7 move it into an example's free text or into section 8;
      their assertions are kept. Exact counts that now include the examples (`compositions: <n>`,
      matrix runs, evidence lines) are updated to the new counts, which is not weakening them.
11. **Tests,** red first: every rule of acceptance 3–6 with a passing and a failing case; the
    exemption on both sides of "the tree holds a methodology"; the composition, the order, the skip
    and the count of acceptance 7; acceptance 8.
12. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
    conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

Branch `task/task-022-examples`, run through `tooling-delivery` as `developer` (`code-quality`,
`testing`, `determinism`), under `npm run lint`. Tests first.

- **`src/examples.ts`:** `EXAMPLES = 'tests/fixtures/examples'`, the exemption line, and
  `exampleFiles(tree)`: every `<pack name>/<example>/example.yaml` under it, in byte order of
  their path (for `validate` and `publish:pack`).
- **`src/example-rules.ts`:** `exampleProblems(context)`, a rule group of `check-packs.ts` after
  `treeProblems`. Section 7 of each pack README is read with `readmeOutline` (task-018): its
  level-3 headings, their first non-blank line, the exemption line, the text before the first
  heading (`example-section`). The layout is walked with `lstat` (`example-fixture` for any other
  entry, an orphan, a pack name of no pack); each `example.yaml` is loaded, checked against the
  preset schema, for its `id`, its `profile`, the pack among its `packs`, and through the preset
  checks of task-012.
- **`src/tree-rules.ts`:** the cardinality and value checks of `presetProblems` move into
  `presetChecks(context, yaml, rule)`, which reports under the rule id it is given; presets keep
  `preset-cardinality` and `preset-value`, examples get `example-fixture`. The YAML rules run on
  each `example.yaml`.
- **`src/check-packs.ts`:** `checkedFiles` and the secret group cover `tests/fixtures/examples/`.
- **`src/validate.ts`:** after the presets, each file of `exampleFiles` is composed like a preset
  (its label is its path), or skipped when the lint reports a problem in it or at its directory.
- **`src/publish.ts`:** `compositionsWith` reads the example files as it reads the presets.
- **Fixtures:** `tests/support/readme.ts` › `conformingReadme` takes section 7 (examples or the
  exemption line); `tests/support/examples.ts` › `writeExamples(root, specs)` writes them once all
  packs are written, `withPackTree` and `treeRepo` call it unless `examples: false`. The golden
  tree's six READMEs get a real example each, with its fixture.
- **Tests:** `tests/example-rules.test.ts` (acceptance 3–6), `tests/validate.test.ts` and
  `tests/publish.test.ts` (acceptance 7–8); updated counts where examples add compositions.

## Execution Notes

- 2026-10-11: independent review of the body (a subagent with its own context): approve after
  amendments; two blocking points (publication and evidence left undecided for examples; an
  example setting `project_name` would break the golden `--param` run), nine should-fix (the test
  support per tree, README tests that fill section 7, rule ids of the preset checks, text before
  the first example, the layout and where an orphan is reported, the validation order and skip,
  where the rules live, the ruling's cost, updated counts) and nits, all applied while `pending`.
  It found no reason to split the task. Re-review: approve; its should-fix (the support's example
  packs follow the pack's major, with the opt-out for trees that cannot compose them) and two nits
  applied.
- 2026-10-11, **spec-002 erratum** (§2.4, the approver's ruling): §2.4 says the exemption holds
  "until the first methodology is published", §6 CB-2 "while the tree holds no methodology"; the
  approver chose the second. To be corrected by the next element that amends spec-002.
- 2026-10-11, build on `task/task-022-examples` (`c408daa`): the rule tests (8 failures) and the
  validation tests were written before the code; the review fixes too (two failing validate tests
  before the change).
- 2026-10-11, deviations, accepted by the review:
  - acceptance 9: the three index outputs and this repository's root are unchanged; the pack
    READMEs under `tests/fixtures/index/expected/` change in section 7, which the index does not
    generate;
  - `tests/check-packs.test.ts` › `rules()` ignores `example-*` rules: a pack broken on purpose
    there (its id, name or README) breaks its example too, and the example rules have their own
    suite; no other assertion changes;
  - the example rules skip the packs the lint skips (a `pack.yaml` that fails its schema) and the
    packs with no `README.md` (the layout rule's), so their fixtures are not reported as orphans;
    `validate` skips the examples of the first kind, and composes those of the second, whose
    composition fails on the missing README as a preset's does (exit 1);
  - `tests/publish.test.ts` › `bump()` moves `base`'s example to the new major, as an author does.
- 2026-10-11: independent review of the build (a subagent with its own context): approve after
  fixes; nothing blocking; three should-fix (an orphan pack-name directory's example was composed;
  skip lines printed before the presets; the examples of a schema-broken pack) and nits (a YAML
  error's line, layout messages, one source for the exemption line, README-line assertions, the
  golden fixtures' wording), applied in `b077fb5`. Re-review: approve.
- 2026-10-11: Acceptance 1–2 on Node.js 22.21.0 and 22.12.0: 771 tests pass; `lint`,
  `check:pins`, `check:schemas`, `check:packs`, `validate`, the golden `validate` (7 compositions)
  and `npm run index -- --check` exit 0; CB-8 holds; no dependency added; the golden expected
  composition is unchanged.
- 2026-10-11, CI (acceptance 12): run 38171213846 on `b077fb5`, conclusion `success` for
  `validate (22.12.0)` and `validate (22.21.0)`.
