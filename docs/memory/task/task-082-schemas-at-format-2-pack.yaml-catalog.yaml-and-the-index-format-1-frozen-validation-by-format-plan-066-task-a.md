---
id: task-082-schemas-at-format-2-pack.yaml-catalog.yaml-and-the-index-format-1-frozen-validation-by-format-plan-066-task-a
type: task
title: "Schemas at format 2: pack.yaml, catalog.yaml and the index, format 1 frozen, validation by format (plan-066 task A)"
status: in-progress
pack: ""            # tooling task (tooling-delivery v3), plan-066 task (A)
depends_on: []
tags: ["tooling","format","schema"]
---

## Context

plan-066 (rulings 1, 2, 6 and 9), its first task: the schemas of spec-001's and spec-002's format 2
(the amendments of 2026-11-05, dl-024, dl-025, plan-063), with format 1's schemas frozen and every
reader validating a file by its own `format`, so that tasks (B) … (G) build on them. Today
`src/schemas.ts` compiles one schema per kind from a fixed list, `src/index-schema.ts` one for the
index, and nothing chooses by `format`; the four published packs, the root `catalog.yaml`, every
fixture and the generated `catalog-index.json` are at format 1 and stay so here (the root catalog
moves in (B), ruling 3; the generated index in (G)). The `mcp` kind is admitted by the schemas and
refused by the lint and the composer in (C) and (D) (ruling 6); its own schema is not here
(plan-063 ruling 4).

Between this task and (C) and (D), a format-2 manifest with two entries passes the schema while
the resolver and the lint still read `conditional[0]` and format 1's rules; nothing in the
repository is at format 2 (Acceptance 8), so the gap is left to (C) and (D), which close it.

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 2 … 6 committed before the schemas and the code,
   with the v1 files absent and the rule not written, so that the build passes and the tests
   fail by assertion, not at load: a test reading a v1 file first asserts that it exists. The
   failing run recorded with its command and count.
2. **Format 1 frozen:** `schema/pack.v1.schema.json`, `schema/catalog.v1.schema.json` and
   `index/catalog-index.v1.schema.json` equal the files `schema/pack.schema.json`,
   `schema/catalog.schema.json` and `index/catalog-index.schema.json` at the branch's base commit,
   except the top-level `$id` (`….v1.schema.json`) and the top-level `$comment` (format 1, frozen,
   spec-001 §5 / spec-002 §3.3; the index's copy adds one, since its source has none); a test
   compares them with `git show <base>:<file>`, key by key, the base commit's SHA a constant of
   the test.
3. **`schema/pack.schema.json` at format 2** (spec-001 §5, §6.2, §6.4, §6.5): `format` `const` 2;
   `tensions`, a list of `{ pack, resolution }` with no other key, `pack` in `conflicts`' syntax
   (§6.3, the range optional), `resolution` a non-empty string; `conditional` one or more entries,
   `with` in `requires`' syntax (§6.3: any pack id, a range required), `contents` with
   `workflows` and `directives` only and at least one of them non-empty (a tightening at format 2
   by design: format 1 leaves that rule to the lint, which (D) keeps for both formats);
   `conditional` still refused on `base` and `software`; `contents.fragments` and the `formats`
   keys admitting `mcp`; every other rule as format 1. Its `$comment` names format 2, spec-001
   §5, and the rules left to the lint (§6.5, §18): one entry per pack id; a `with` earlier in the
   order, not the pack itself, not in `requires` or `conflicts`; a phase pack with no `with`
   naming `software`; isolation per entry; the order of `fragments`; `tensions` naming neither
   the pack itself nor a pack of `conflicts`, each pack at most once.
4. **`schema/catalog.schema.json` at format 2** (spec-001 §11): `format` `const` 2; a version
   entry's `conditional` one or more `{ with }` in `requires`' syntax; an optional `pack_format`,
   `1` or `2`; no `tensions` (not copied, §11); `formats` keys admitting `mcp`; every other rule
   as format 1. **`index/catalog-index.schema.json` at format 2** (spec-002 §3.3): `format`
   `const` 2; a version's `conditional` one or more `{ with }` in `requires`' syntax and a
   required `pack_format` (`1` or `2`), after `conditional` and before `readme_url` in the
   schema's `properties` and `required`; a pack's required `conditional_parts` (`with` in
   `requires`' syntax, `workflows`, `directives`) and `tensions` (`pack` in `conflicts`' syntax,
   `resolution` non-empty), after `conditional_directives` and before `parameters`; `formats`
   unchanged (it has no key list); `$defs.pack.properties.axis.enum`, which the site reads, kept.
   The order in the generated file is (G)'s.
5. **Validation by `format`**, one rule shared by `src/schemas.ts` and `src/index-schema.ts` (one
   helper): `format` `1` reads the v1 schema, any other value (absent included) the current one,
   so that a missing or unknown format is reported against the current schema's `const`.
   `SchemaSet.validate('pack' | 'catalog', data)` and the index's validation apply it; every
   caller (the resolver, `check:packs`, `check:schemas`, `validate`, `publish`, the index and the
   site) reads through it unchanged, and the site's error text (`src/site.ts`) names the schema
   the rule chose (`src/index.ts`'s text names none and stays). The strict compilation of all
   nine schemas (the seven of `schema/`: `catalog`, `catalog.v1`, `compat`, `pack`, `pack.v1`,
   `preset`, `transition`; the two of `index/`: `catalog-index`, `catalog-index.v1`) logs
   nothing, the index's `indexSchema()` (or its successor) exposing one `warnings` list covering
   both index schemas, asserted empty. The direct readers of `schema/pack.schema.json` keep their
   paths at format 2: `$defs.packId` (`src/digest.ts`), `$defs.requiresEntry` and
   `$defs.conflictsEntry` (`src/requirements.ts`), the parameter types under
   `properties.parameters` (`src/parameters.ts`); and of the index's, `indexSchemaDocument()`'s
   `$defs.pack.properties.axis.enum` (`src/site.ts`).
6. **The tests** (`tests/schemas.test.ts`, the index's tests), offline: under
   `tests/fixtures/schema/`, the fixtures of both formats, each read through the rule, and each
   schema file also compiled on its own. At least: the format-1 fixtures as today
   (`conditional-two-entries`, `conditional-with-other-pack`, catalog `version-conditional-two`
   stay invalid: format 1's refusals); at format 2, valid: two entries, a `with` other than
   `software`, `tensions` with and without a range, `mcp` in `fragments` and `formats`, a catalog
   entry with `pack_format` and with none; invalid: `tensions` at format 1, a `tensions` entry with
   an empty `resolution` or an extra key, a `with` without a range, an entry with neither
   `workflows` nor `directives` or with another key, `conditional` on `base`, `pack_format: 3`,
   `pack_format` in a format-1 catalog, `tensions` in a catalog version entry, a format-1 file with
   `mcp`, `format: 3`. Each invalid fixture asserted with its keyword and pointer. The index: the
   generated root `catalog-index.json` (format 1) valid through the rule; a format-2 fixture index
   valid; one with a version missing `pack_format` invalid.
7. **The schema note** (`wingfoil-cli` rule 8; plan-066 point 1): once the v1 files and the
   format-2 schemas are committed (the digest reads the files git tracks), `npm run feedback:note
   -- --schema --from <this task's id>` writes the next free note (F-047 when written), its
   listing naming `pack.v1.schema.json` and `catalog.v1.schema.json` added and `pack.schema.json`
   and `catalog.schema.json` changed; the generated note is not edited by hand. The `schema-note`
   rule of `check:packs` is red before it and green after. In the same commit,
   `tests/feedback-note.test.ts`'s expectation `Changed since F-031` becomes `Changed since F-047`,
   its comment to match. The index's bump, information only (spec-002 §3.3, §4; `index/` is
   outside the digest), is recorded in this task's Execution Notes.
8. **Nothing else moves:** `check:packs`, `check:schemas`, `validate`, the golden trees and the
   generated root files unchanged (format 1 everywhere); `npm test` and `npm run lint` exit 0.
9. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations,
   and dl-039's local list on Node.js 22.21.0. The privacy check of the branch's diff recorded.

## Design

Branch `task/task-082-schemas-format-2` from `main` at this task's add; the test's base-commit
SHA reads with `git show`, which needs full history (`ci.yml` checks out with `fetch-depth: 0`;
dl-039's clean clones are full clones). Red steps: (1) the tests and fixtures of Acceptance 2 … 6
(red by assertion: the v1 files absent, the format-2 fixtures refused by today's schemas, the
rule absent); (2) the v1 copies and the shared rule in `src/schemas.ts` and
`src/index-schema.ts` (green for the format-1 half), committed; (3) the format-2 schemas and their
`$comment` texts (green), committed; (4) the schema note from the committed tree, with
`tests/feedback-note.test.ts`'s expectation, `schema-note` green. No new dependency.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-07: started (`backlog → in-progress`) on `task/task-082-schemas-format-2` from `493651f`,
  the test's base commit. Red (dl-018), step (1): the tests and fixtures of Acceptance 2 … 6 with
  the signatures of `readsFormatOne`, `schemaFile` and `indexSchemaFile` and no body (the task-080
  precedent); `npm run build` and `npm run lint` exit 0; `npm test`: 1213 tests, 20 failing, all
  of them new (the v1 files absent, the format-2 fixtures refused, the rule unwritten, the site's
  text). The format-1 refusals of Acceptance 6 pass already, as format 1 refuses them today.
- 2026-11-07: steps (2) and (3) green, each committed: the v1 copies with the shared rule, then the
  format-2 schemas; `check:packs`'s `schema-note` red after (3), as Acceptance 7 expects. Step (4):
  F-047 written by `npm run feedback:note -- --schema --from <this task>` from the committed tree
  (`schema/` digest `sha256:2836141582da…`; `pack.v1` and `catalog.v1` added, `pack` and `catalog`
  changed, since F-031), not edited; `schema-note` green; `tests/feedback-note.test.ts` reads
  `Changed since F-047`. The index's bump, information only (spec-002 §3.3, §4; `index/` is
  outside the digest): `index/catalog-index.schema.json` at format 2 (`pack_format`,
  `conditional_parts`, `tensions`, a `with` in `requires`' syntax) and
  `index/catalog-index.v1.schema.json` frozen; the generated `catalog-index.json` stays at format 1
  until (G).
- 2026-11-07: `npm test` after step (4): 1213 tests, 1 failing: `compose-cli`'s "exits 1 on a
  catalog that breaks its schema" broke the catalog with `format: 2`, valid now; it breaks it with
  `format: 3` (Acceptance 8 read as: the test's intent kept, its means moved). `check:schemas`,
  `check:packs` and `validate` passed, the tree unchanged.
- 2026-11-07: independent build review: approve, nothing blocking; applied: four lines over 100
  characters, a fixture with an entry holding neither list (`f2-entry-no-lists`), the second
  error of `validate` worded apart, `indexSchemaErrors` choosing through `indexSchemaFile`, each
  frozen copy's `$comment` checked against its own section. No decision changed, so no
  re-review.
