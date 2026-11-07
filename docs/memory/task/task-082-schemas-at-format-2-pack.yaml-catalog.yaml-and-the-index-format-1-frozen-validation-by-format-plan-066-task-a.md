---
id: task-082-schemas-at-format-2-pack.yaml-catalog.yaml-and-the-index-format-1-frozen-validation-by-format-plan-066-task-a
type: task
title: "Schemas at format 2: pack.yaml, catalog.yaml and the index, format 1 frozen, validation by format (plan-066 task A)"
status: draft
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

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 2 … 6 committed before the schemas and the code,
   with the v1 files absent and the dispatch not written, so that the build passes and the tests
   fail by assertion; the failing run recorded with its command and count.
2. **Format 1 frozen:** `schema/pack.v1.schema.json`, `schema/catalog.v1.schema.json` and
   `index/catalog-index.v1.schema.json` equal the files `schema/pack.schema.json`,
   `schema/catalog.schema.json` and `index/catalog-index.schema.json` at this task's base commit,
   except their `$id` (`….v1.schema.json`) and their `$comment` or `description` (format 1,
   frozen, spec-001 §5 / spec-002 §3.3); a test compares them with the base commit's files
   (`git show`), key by key.
3. **`schema/pack.schema.json` at format 2** (spec-001 §5, §6.2, §6.4, §6.5): `format` `const` 2;
   `tensions`, a list of `{ pack, resolution }` with no other key, `pack` in `conflicts`' syntax
   (§6.3, the range optional), `resolution` a non-empty string; `conditional` one or more entries,
   `with` in `requires`' syntax (§6.3: any pack id, a range required), `contents` with
   `workflows` and `directives` only and at least one of them non-empty; `conditional` still
   refused on `base` and `software`; `contents.fragments` and the `formats` keys admitting `mcp`;
   every other rule as format 1; its `$comment` names format 2, spec-001 §5, and the rules left
   to the lint (one entry per pack id, `with` earlier in the order, the order of `fragments`,
   `tensions`' uniqueness and `conflicts`, §18).
4. **`schema/catalog.schema.json` at format 2** (spec-001 §11): `format` `const` 2; a version
   entry's `conditional` one or more `{ with }` in `requires`' syntax; an optional `pack_format`,
   `1` or `2`; `formats` keys admitting `mcp`; every other rule as format 1. **The index's schema
   at format 2** (spec-002 §3.3): `format` `const` 2; a version's `conditional` one or more
   `{ with }` in `requires`' syntax and a required `pack_format` (`1` or `2`); a pack's required
   `conditional_parts` (`with`, `workflows`, `directives`) and `tensions` (`pack`, `resolution`),
   in §3.3's key order; `formats` keys admitting `mcp`.
5. **Validation by `format`:** `SchemaSet.validate('pack' | 'catalog', data)` and the index's
   validation choose the schema by the data's `format`: `1` the v1 schema, any other value
   (absent included) the current one, so that a missing or unknown format is reported against
   the current schema's `const`. Every caller (the resolver, `check:packs`, `check:schemas`,
   `validate`, `publish`, the index and the site) reads through it unchanged. The strict
   compilation of all eight schemas logs nothing (`warnings` empty). The schemas' grammar reads
   (`src/digest.ts`, `src/requirements.ts`, `src/parameters.ts`) keep reading
   `schema/pack.schema.json`, whose `$defs` they use stay the same.
6. **The tests** (`tests/schemas.test.ts`, `tests/index-schema.test.ts` or the existing ones),
   offline: under `tests/fixtures/schema/`, the fixtures of both formats, each read through the
   dispatch, and each schema file also compiled on its own. At least: the format-1 fixtures as
   today (`conditional-two-entries`, `conditional-with-other-pack`, catalog
   `version-conditional-two` stay invalid: format 1's refusals); at format 2, valid: two entries,
   a `with` other than `software`, `tensions` with and without a range, `mcp` in `fragments` and
   `formats`, a catalog entry with `pack_format` and with none; invalid: `tensions` at format 1,
   a `tensions` entry with an empty `resolution` or an extra key, a `with` without a range, an
   entry with neither `workflows` nor `directives` or with another key, `conditional` on `base`,
   `pack_format: 3`, a format-1 file with `mcp`, `format: 3`. Each invalid fixture asserted with
   its keyword and pointer. The index: the generated root `catalog-index.json` (format 1) valid
   through the dispatch; a format-2 fixture index valid; one with a version missing `pack_format`
   invalid.
7. **The schema note** (`wingfoil-cli` rule 8; plan-066 point 1): `npm run feedback:note --
   --schema --from <this task's id>` writes the next free note (F-047 when written), its listing
   naming the two v1 files added and the two schemas changed; the `schema-note` rule of
   `check:packs` is red before it and green after; the index's bump is information only (spec-002
   §3.3, §4), named in the note's text if the generator allows, else in this task's notes.
8. **Nothing else moves:** `check:packs`, `check:schemas`, `validate`, the golden trees and the
   generated root files unchanged (format 1 everywhere); `npm test` and `npm run lint` exit 0.
9. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations,
   and dl-039's local list on Node.js 22.21.0. The privacy check of the branch's diff recorded.

## Design

Branch `task/task-082-schemas-format-2` from `main` at this task's add. Red steps: (1) the tests
and fixtures of Acceptance 2 … 6 (red by assertion: the v1 files absent, the format-2 fixtures
refused by today's schemas, the dispatch absent); (2) the v1 copies and the dispatch in
`src/schemas.ts` (a kind with versions maps `format` 1 to `<kind>.v1.schema.json`) and in
`src/index-schema.ts` (green for the format-1 half); (3) the format-2 schemas and their
`$comment` texts (green); (4) the schema note, `schema-note` green. No new dependency.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
