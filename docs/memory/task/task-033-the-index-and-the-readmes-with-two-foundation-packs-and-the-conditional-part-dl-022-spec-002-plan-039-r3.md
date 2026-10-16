---
id: task-033-the-index-and-the-readmes-with-two-foundation-packs-and-the-conditional-part-dl-022-spec-002-plan-039-r3
type: task
title: "The index and the READMEs with two foundation packs and the conditional part (dl-022, spec-002, plan-039 R3)"
status: in-review
pack: ""            # tooling task (tooling-change › deliver, plan-039)
depends_on: []
tags: ["tooling","base","index"]
---

## Context

plan-039's third task: the generated index and the READMEs' generated sections with the two
foundation packs and the conditional part (spec-002 §2.1, §2.2, §3.2, §3.3 as amended by plan-038
on 2026-10-15; plan-039 R3). It runs on `task/task-033-index`, its Design is committed on `main`,
and its `deliver` is that branch's `--no-ff` merge, then `done` on `main` (tooling-delivery v2). No
pack. It changes neither `catalog.yaml` nor `schema/` (spec-002 CB-8).

The text it implements:
- spec-002 §2.1 section 1: the foundation packs, `base` and `software`, write `Axis: foundation`;
- §2.1 section 4: for every pack but `base`, what it declares, over the foundation it requires;
  for a pack with a conditional part, that part's workflows and directives marked as present only
  with `software`; §2.2: the generated sections read only the pack's own files;
- §3.2: one section for the foundation packs, `base` then `software`, then one per axis;
- §3.3: `axis` and `slot` `null` for both foundation packs;
- plan-039 R3: each version object copies `conditional` as the catalog version entry does (its
  `with` only); each pack object gains `conditional_workflows` and `conditional_directives`, and
  its `workflows` and `directives` keep what is always composed; in `CATALOG.md`, the Summary cell
  of such a pack ends with ` (… only with software)` naming the part's workflows (its directives
  when it has no workflow); `catalog-index.json` stays at `format: 1`; R3 is recorded in
  spec-002's Execution Notes (dl-020 R1), to be folded back at the wave's close;
- plan-039 R8 (the approver, 2026-10-15): section 5 lists the conditional part's workflows and
  directives too, marked as present only with `software`.

What exists, at `main` `d52fb91` (task-031 and task-032 done):
- `axisAndSlot` (`src/index-model.ts:97`, the literal on line 98) returns `null` only for
  `base`; it serves the index and `readme-generate.ts` (`titleSection`), so `software` gets
  `Axis: software` and an `axis` of `software` in the index, which
  `index/catalog-index.schema.json` refuses (its `packId` pattern, line 21, names `base` alone;
  its `axis` enum, line 71, is `null` and the axes): task-031 and task-032 left `software`
  unpublished in every test for that reason;
- `compositionSection` (`src/readme-generate.ts:83`) writes "Declares" for every pack whose id is
  not the literal `base` (line 92), from the pack's own files; `readPack`
  (`readme-generate.ts:37`) and `packOf` (`index-model.ts:191`) read `contents` only, so a
  conditional part's workflows appear nowhere in a README or in the index;
- `packOf` (`src/index-model.ts:180`) fills `workflows` and `directives` from `contents`, and a
  version object (`versionOf`) copies `formats`, `requires_capabilities`, `requires`, `conflicts`;
- `renderCatalog` (`src/index-render.ts`) writes the foundation section from the packs with a
  `null` axis, in the index's byte order of ids (which `base`, `software` already follows);
- `src/site.ts` builds its axis filter from the schema's `axis` enum (lines 70–77) and writes the
  no-JavaScript table's Summary as the description's first sentence (line 89), as `CATALOG.md`
  does today (spec-002 §5);
- the fixtures: the golden tree's `software` and `flow` READMEs (task-031's interim `Axis:
  software`; flow's sections without its part), `tests/support/index-catalog.ts` (`software` in the
  tree, unpublished) and `tests/fixtures/index/expected/`.

Readings, stated so that the approver sees them at the gate:
- a README's generated sections read only the pack's own files (§2.2): a `pack.yaml` with no
  `axis` is a foundation pack (`Axis: foundation`), and one with no `axis` and no `requires` is the
  core, `base` (no "Declares"), as `pack.schema.json`'s foundation branch makes certain; the name
  of the layer a conditional part needs comes from its `with` entry;
- the index's new keys: `conditional` after `conflicts` in a version object, present only for a
  pack that carries one (as in the catalog version entry), read from the tag's `pack.yaml` as
  `requires` is; `conditional_workflows` right after `workflows`, `conditional_directives` right
  after `directives` in a pack object, both always present;
- the mark, in `CATALOG.md`'s and the search page's Summary cell (the same helper, §5's
  no-JavaScript table shows `CATALOG.md`'s content), and in a README's sections 4 and 5:
  `` Golden fixture pack methodology/flow. (`delivery`, `flow-delivery` only with `software`) ``,
  the names in code spans (a reading of R3's plain form), the layer's name from the part's
  `with`; in sections 4 and 5, on each line the part adds, for example
  `` - `delivery` (sub), only with `software` ``.

Not in scope: `schema/`, `catalog.yaml`, `compat.yaml`; the `memory.yaml` keys (task-034); a pack
of `packs/` (W8).

## Acceptance

Run from a clean clone of `task/task-033-index`, on Node.js 22.21 and the floor 22.12.0.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check`, `npm run validate`
   and `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden` (whose
   `index --check` covers the golden tree's READMEs and index) exit 0; `npm run site -- --out
   <tmp>` exits 0; no dependency is added.
2. **READMEs** (tests in `tests/readme-generate.test.ts`): `software`'s title line reads
   `Axis: foundation`, as `base`'s does, read from its `pack.yaml` having no `axis`; section 4
   writes "Declares" for `software` and not for `base`; for a pack with a conditional part,
   sections 4 and 5 list that part's workflows and directives with the mark (R8); the golden
   tree's READMEs are regenerated and reviewed by diff, the interims of task-031 and task-032
   gone.
3. **The index** (tests in `tests/index-model.test.ts`, `tests/index-render.test.ts`): `axis` and
   `slot` `null` for `base` and `software`, read from `catalog.yaml`'s `foundation`; a version
   object of a pack with a conditional part carries `conditional: [{ with }]`, and one of a pack
   without it carries none; a pack object carries `conditional_workflows` and
   `conditional_directives` (sorted; empty without a part), its `workflows` and `directives`
   leaving the part out, each key at the place the readings above give; `CATALOG.md`'s foundation
   section lists `base` then `software` in `catalog.yaml`'s order, `software`'s row carrying the
   `pack-software` anchor and its README link at its tag; a pack with a part has its Summary cell
   marked (R3), naming its workflows, or its directives when it has no workflow.
4. **The index schema** (`index/catalog-index.schema.json`) admits `software` in its `packId`
   pattern, the version object's optional `conditional` (its `with` only) and the pack object's two
   new required lists; its `axis` enum stays `null` and the axes, so the search page gains no
   `software` filter; `catalog-index.json` and the schema stay `format: 1`; an index of a tree
   that publishes `software` and a pack with a conditional part validates against it.
5. **The index fixtures:** `tests/support/index-catalog.ts` publishes `software`, a second
   methodology whose conditional part holds workflows and a directive, and a `governance` pack
   whose part holds directives only, requiring `base` alone (kanban requires `software`, so it
   carries none); `tests/fixtures/index/
   expected/` is regenerated with `REFRESH_INDEX_EXPECTED=1` and reviewed by diff, its `llms.txt`
   unchanged; the site's no-JavaScript Summary cell carries the same mark as `CATALOG.md`'s, tested;
   the counts of `tests/site.test.ts` and `tests/agent-path.test.ts` that the new published packs
   change are updated, each listed in the Execution Notes, `software` under the foundation filter;
   `index/vendor/search.js` and its sha256 unchanged.
6. **No foundation literal:** `git grep -nE "['\"\`](base|software)(['\"\`@/]|$)" -- src/` gives
   no hit.
7. **spec-002's Execution Notes** record R3 and R8 (dl-020 R1), as plan-024 recorded W14's
   rulings; no other line of spec-002 changes.
8. **Nothing else changes:** `git diff --name-only` over the task's commits shows only `src/`,
   `tests/`, `index/catalog-index.schema.json`, spec-002 (Execution Notes) and this element;
   `schema/`, the root `catalog.yaml`, `compat.yaml`, `CATALOG.md`, `catalog-index.json` and
   `llms.txt` at the root unchanged (no pack is published).
9. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
   `in-review`.

## Design

On `task/task-033-index`, through `tooling-delivery` v2 as `developer` (`code-quality`, `testing`,
`determinism`). Two red steps (dl-018 R3), each a test commit run red and counted, then the code
commit that makes it green, then the note in spec-002.

**Step 1: the two foundation packs in the index and the READMEs.**
- Tests, red: `tests/readme-generate.test.ts` (`software`'s `Axis: foundation`, read from its
  `pack.yaml`; "Declares" for `software`, not for `base`: a characterization);
  `tests/index-model.test.ts` (`axis` and `slot` `null` for `software`, from `catalog.yaml`);
  `tests/index-render.test.ts` (the foundation section in `catalog.yaml`'s order, `software`'s
  anchor and README link; the order is a characterization, byte order agreeing);
  `tests/support/index-catalog.ts` publishing `software`; the schema accepting it.
- Code, green: `axisAndSlot` reading the foundation list; `readme-generate.ts` reading the axis and
  the core from the pack's own `pack.yaml`; `index-render.ts` ordering the foundation section;
  `index/catalog-index.schema.json`'s `packId`; the golden tree's READMEs and
  `tests/fixtures/index/expected/` regenerated and reviewed by diff; the site and agent-path counts
  adapted.

**Step 2: the conditional part (R3, R8).**
- Tests, red: the README's sections 4 and 5 marked; the index's `conditional`,
  `conditional_workflows`, `conditional_directives` at their places; the Summary mark in
  `CATALOG.md` and on the search page (workflows, or directives when the part has none); the
  fixtures: a second methodology with workflows and a directive in its part, a `governance` pack
  with directives only, both published in `tests/support/index-catalog.ts`.
- Code, green: `readme-generate.ts`, `index-model.ts`, `index-render.ts`, `site.ts` (one helper for
  the mark), the schema's new keys; the fixtures regenerated and reviewed by diff.

**spec-002's Execution Notes** (Acceptance 7): R3 and R8, one commit, content (dl-018 R2).

Then: the grep of Acceptance 6; the checks of Acceptance 1 from clean clones on both Node.js
versions; the independent review; the push and the CI run.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-15: written under plan-039; independent review of the body: approve after amendments
  ("What exists" corrected; the `axis` enum unchanged; the search page's Summary marked as
  `CATALOG.md`'s; the readings on how a README tells the core from its own files, the index keys'
  places and source, the mark's format; fixtures with a directive in a part and a directives-only
  part; the site and agent-path counts; `llms.txt` and the vendored script unchanged). Section 5's
  marking was ruled by the approver (plan-039 R8). Size: the Design splits the red in two steps
  (the foundation packs, then R3 and R8); the assertions already green (the "Declares" of
  `software`, the foundation order) are characterizations.
- 2026-10-15: re-review: approve; its low findings (plan-039's task-033 row, the mark's form in
  sections 4 and 5, the directives-only pack's axis) amended without changing a rule.

- 2026-10-16, design written and committed on `main`; task started (backlog → in-progress);
  branch `task/task-033-index` from `2a613b0`.
- 2026-10-16, **step 1**, red on `e3b11bf`: `npx tsc -p tsconfig.json`: 5 errors (exit 2); then
  `node --test` over `index-model`, `readme-generate`, `index`, `site`, `agent-path`: 74 tests, the
  index build failing on `software` (the schema's `packId`), so most suites fail. Green in
  `222be7e`. Characterizations: "Declares" for `software` (it was never the literal `base`); the
  foundation section's order for `[base, software]`, byte order agreeing (the test also gives the
  reversed list, which is red).
- 2026-10-16, **step 2**, red on `5dd685e`: `npx tsc`: 7 errors; `index-model`,
  `readme-generate`, `site`: 51 tests, 6 fail. Green in `2d9430e`. spec-002's note in `0407068`
  (content, dl-018 R2).
- **Adapted tests and fixtures:** `renderCatalog` takes the foundation list (`index-render`
  tests); `axisAndSlot` takes it too (`index-model` tests); the resolve and merge fixtures'
  `software` READMEs read `Axis: foundation` (task-031's interim gone); a test that found kanban
  as `packs[1]` finds it by id; counts and lists of the new published packs: `site.test.ts`
  (rows 5 → 6 → 8, `found('')` 5 → 6 → 8, the foundation filter `base`, `software`),
  `agent-path.test.ts` (the methodologies `flow`, `kanban`), `index-model.test.ts` (the published
  ids).
- **Acceptance 6:** `git grep -nE "['\"\`](base|software)(['\"\`@/]|$)" -- src/` gives no hit.
- **Checks:** `llms.txt` of the expected outputs unchanged; `index/vendor/search.js` and its
  sha256 unchanged; the root `CATALOG.md`, `catalog-index.json` and `llms.txt` unchanged.
- 2026-10-16, **build review** (independent subagent): approve with minor amendments, nothing
  blocking. Fixed red first: the tests in `d686a40` (`readme-generate`, `index-render`: 19 tests, 3
  fail: section 4 split into workflows and directives lines; the directive marks of sections 4 and
  5; no Summary mark for a part that adds nothing; `software`'s "Declares", a characterization),
  the code in `c52bcf1` (one `conditionalPart` helper for the index and the READMEs; `index.ts`
  reads `catalog.yaml` once; the index schema's `with` mirrors the pack schema's pattern; comments
  on a part's directive roles and on the site's foundation order, which follows the index's byte
  order and agrees with `catalog.yaml`'s since the site reads the index only; the import order).
  Acceptance 3's foundation-order and Summary-mark tests sit in `tests/index-model.test.ts`, which
  builds the fixture index, rather than in `tests/index-render.test.ts`. Re-review requested
  (dl-017 R2).
- 2026-10-16, **re-review** (dl-017 R2): approve; findings 1–10 fixed or recorded. Two low
  findings (a comment placed after a `return`; the part read twice in `packOf`) fixed in
  `83f5d89`, a refactor that changes no behaviour.
- 2026-10-16, **Acceptance** from clean clones at `83f5d89` (the later commits change these notes
  only), on Node.js 22.21.0 and 22.12.0: `npm ci`, `build`, `test`, `lint`, `check:pins`,
  `check:schemas`, `check:packs`, `index -- --check`, `validate`, `validate -- --tree
  tests/fixtures/compose/tree --param project_name=Golden` and `site -- --out <tmp>` exit 0. No
  dependency added; `schema/`, the root `catalog.yaml`, `compat.yaml`, `CATALOG.md`,
  `catalog-index.json` and `llms.txt` unchanged.
- 2026-10-16, **CI** (Acceptance 9): run 38859419074 on `703773b`, conclusion `success`
  (`validate (22.12.0)` and `validate (22.21.0)` both `success`). Submitted `in-review`.
