---
id: task-088-the-index-at-format-2-and-the-generators-conditional-parts-tensions-pack-format-the-summary-the-readme-per-entry-plan-066-task-g
type: task
title: "The index at format 2 and the generators: conditional_parts, tensions, pack_format, the Summary, the README per entry (plan-066 task G)"
status: approved
pack: ""            # tooling task (tooling-delivery v3), plan-066 task (G)
depends_on: ["task-087-d6-s-coverage-validate-s-legs-per-entry-the-overlay-lint-s-pairs-the-publication-check-per-entry-plan-066-task-f"]
tags: ["tooling","index"]
---

## Context

plan-066 (point 1, task (G)), its seventh and last task, after task-087 (D6's coverage); it needs
task-082 (the schemas at format 2: `index/catalog-index.schema.json` at format 2, format 1's
frozen as `index/catalog-index.v1.schema.json`, the index read against the schema its `format`
names) and task-083 (the catalog: `publish` writes `pack_format`, `check:packs` compares it with
the tagged file, absent reading as 1). plan-066 point 1: "model, render, site, `llms.txt`, README
Composition, What it adds and "Combines with care", the golden trees and the root's generated
files". What the amended texts ask (spec-002 §2.1, §3.2, §3.3; spec-001 §6.2, §6.5, §11):
- **`catalog-index.json` at format 2** (§3.3): `format: 2`; in each version, `conditional` "a list
  of `{ with }`, one per entry, copied as the catalog version entry copies it", and
  `pack_format`, "the tagged `pack.yaml`'s format (`1` when the catalog entry has none, spec-001
  §11)"; in each pack, after `conditional_directives`, `conditional_parts` ("one object per entry,
  in order: `with`, `workflows`, `directives`, each list sorted; empty without one") and
  `tensions` ("one object per entry: `pack`, `resolution`; empty without one"); the two
  `conditional_` lists "the union of the conditional entries'".
- **`CATALOG.md`'s Summary** (§3.2), and the search page's, which renders the same Summary
  (§5): after the first sentence, "for each entry in order, by the entry's workflows, or its
  directives when it has none, sorted and in code spans, and the pack its latest version's `with`
  names", and "for a pack whose latest version declares `tensions`, by `` Combines with care:
  `<pack>`, … `` with the packs sorted".
- **The README** (§2.1): Composition, "for a pack with a conditional part, each entry's workflows
  and directives, one line each when non-empty, in the entries' order, marked as present only
  with the pack its `with` names", and "for a pack with `tensions`, a line `Combines with care:`
  followed by one item per entry, the pack (with its range when there is one) and its
  resolution"; What it adds, each conditional workflow's and directive's line ending `` , only
  with `<pack>` `` (the pack its entry's `with` names), a conditional directive's roles `—`.
- **`llms.txt`** (§3.4) holds no per-pack field: links and URL patterns only.

What exists (`main` at task-087's merge):
- **The model** (`src/index-model.ts`): `CatalogIndex.format` is `1`; `conditionalPart` reads
  `conditional[0]` only; a version's `conditional` is `[{ with }]` of that first entry; no
  `pack_format`, `conditional_parts` or `tensions`; `conditional_workflows` and
  `conditional_directives` are the first entry's.
- **The render** (`src/index-render.ts`): `conditionalMark` and `summaryOf` read the first entry
  of the latest version's `conditional` and the two `conditional_` lists, one mark `(<names> only
  with <layer>)`; `src/site.ts` calls `summaryOf`; `renderLlms` reads nothing of a pack, and its
  index line hardcodes "every published pack, preset and transition (format 1)".
- **The README generator** (`src/readme-generate.ts`): `partOf` reads `conditionalPart`, so one
  entry; the Composition's two lines `workflows only with` and `directives only with` and What
  it adds' `, only with <layer>` read that entry; no tensions line.
- **The outputs:** the root `catalog-index.json` is at format 1 (its four published packs at
  format 1, none with a conditional part or `tensions`); the fixture catalog
  (`tests/support/index-catalog.ts`, its outputs committed under `tests/fixtures/index/expected/`
  and compared byte for byte) holds two format-1 packs with one entry each (`methodology/flow`,
  `governance/notes`) and no format-2 pack; its `catalog.yaml` is at format 2 (task-083). The
  golden tree `tests/fixtures/compose/tree` commits its own `catalog-index.json` (`format: 1`,
  no packs), `CATALOG.md` and `llms.txt`, checked by `tests/index.test.ts` with `--check`. The
  frozen v1 schema's only test instance is the root index (`tests/index.test.ts`, "reads the root
  index, at format 1, through the frozen schema"); `tests/fixtures/schema/index/valid/` holds
  `format-2.json` only.
- The lint (task-085) admits a format-2 pack with several entries and `tensions`, and `publish`
  writes its `pack_format: 2` (task-083), so a format-2 pack can be published in a test repository
  today; only the index and the generators read one entry.

Not here: the `mcp` kind's tooling (its row, plan-063 ruling 4); any published pack moved to
format 2 (plan-063 ruling 3); plan-066 point 7's open points (their rows); point 8's row and
this plan's row, moved to Closed at the plan's close (plan-066 step 4), which this task's evidence
(a format-2 pack composed, checked, published and indexed, Acceptance 6) lets it do.

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 2 … 6 committed before the code, so that the
   build passes and they fail by assertion, except any already green on `main` (recorded as such);
   the failing run recorded with its command and count.
2. **`catalog-index.json` at format 2** (§3.3), built key by key in §3.3's order:
   - `format: 2`, so the index is validated against `index/catalog-index.schema.json`
     (task-082's choice by format); no output is at format 1 any more, the v1 schema staying for
     reading one;
   - **each version:** `conditional`, only for a version whose tagged `pack.yaml` has a
     conditional part, one `{ with }` per entry in written order, `with` as written, read from
     the tagged `pack.yaml` as today (task-083's `catalog-manifest` makes it equal to the catalog
     version entry's copy, which §3.3 names); then `pack_format`, after `conflicts` and
     `conditional` and before `readme_url`, the tagged `pack.yaml`'s `format`, `1` when it has
     none (the approver's ruling, point 1 below);
   - **each pack**, from the latest version's tag: `conditional_workflows` and
     `conditional_directives`, the union of every entry's, sorted, a name once; then, after
     `conditional_directives` and before `parameters`, `conditional_parts`, one object per entry
     in written order (`with` as written, `workflows` and `directives` each sorted), and
     `tensions`, one object per entry in written order (`pack` and `resolution` as written); both
     `[]` without one.
   Besides the top-level `format: 2`, a format-1 pack's object gains only `pack_format: 1` per
   version, `conditional_parts` (empty or its one entry) and `tensions: []`; the root
   `catalog-index.json` changes exactly so (four packs, none with a conditional part).
3. **The Summary** (§3.2), one function for `CATALOG.md` and the search page (`summaryOf`):
   - **the marks:** for each entry of the latest version's `conditional_parts`, in order, its
     workflows, or its directives when it has none (an entry with neither has no mark, as today),
     in code spans joined by `, `, then `only with` and the pack its `with` names (the id, no
     range); the marks of all entries in one parenthesis after the first sentence, joined by `; `
     (the approver's ruling, point 2 below); one entry gives today's text;
   - **the tensions:** for a pack whose latest version declares `tensions`, after the
     parenthesis (or the first sentence), one space and `` Combines with care: `<pack>`, … ``,
     the packs' ids without their ranges (the approver's ruling, point 4 below), sorted by bytes,
     a pack once, with no full stop after the last;
   - **the full text,** for example: `` First sentence. (`checks-flow` only with `software`;
     `checks-rule` only with `methodology/flow`) Combines with care: `stage/mvp` ``;
   - the search page shows the same Summary, escaped as today (`site.ts` unchanged but for what
     `summaryOf` returns).
4. **The README's generated sections** (§2.1), from the pack's own files (§2.2):
   - **Composition:** nested under **Declares**, as today, for each entry in written order,
     `` - workflows only with `<pack>`: … `` when its workflows are non-empty, then `` -
     directives only with `<pack>`: … `` when its directives are non-empty (`<pack>` the id its
     `with` names; names sorted); one entry gives today's lines; then, for a pack with `tensions`,
     a top-level bullet `- **Combines with care:**`, the list's last: after **Declares**, or after
     **Requires capabilities** where there is no **Declares** (the approver's ruling, point 3
     below), with one nested item per entry in written order, `` - `<pack as written>`:
     <resolution> ``, the range included when there is one, the resolution trimmed and
     its line breaks folded to single spaces (as `tensionNotices` does);
   - **What it adds:** the always-composed workflows and directives first, as today; then each
     entry's, in entry order, sorted within the entry, each line ending `` , only with `<pack>` ``
     with its own entry's pack; a conditional directive's roles `—`;
   - a README whose pack has no conditional part and no `tensions` is unchanged byte for byte
     (the four published packs' READMEs and every fixture's).
5. **`llms.txt`** (§3.4): no per-pack field; its one change is the index line's `(format 1)`
   becoming `(format 2)`, in the root, the fixture catalog's expected output and the golden tree;
   a test asserts that line.
6. **The fixture catalog and the evidence** (plan-066 points 2 and 8): `indexCatalog`
   (`tests/support/index-catalog.ts`) gains one format-2 pack, published with `publishByHand`: a
   `governance/` (or `blueprint/`) pack requiring `base` only (a pack requiring `software` cannot
   carry an entry naming it, and a `with` on its own axis is refused, task-085 ruling 1), whose
   entries are `software@^1` first (so that today's code, reading the first entry, keeps the v1
   schema's `software` pattern and the red run fails by assertion), then `methodology/flow@^1`;
   one entry with a workflow (not named `delivery`, including no slot) and one with a directive
   only; and a `tensions` entry naming another pack of the tree with a range, and its resolution.
   Its title, description and excerpt avoid the word "board" (`tests/site.test.ts`'s `board`
   search). Its outputs refreshed under `tests/fixtures/index/expected/`
   (`REFRESH_INDEX_EXPECTED=1`) and reviewed: the new pack's version with two `conditional`
   entries and `pack_format: 2`, its `conditional_parts` and `tensions`, its Summary with two
   marks and the tensions, its README's Composition and What it adds per entry; every other
   pack's lines changed only as Acceptance 2 says. The test "passes the lint, tag rules included"
   stays green on it (task-083's `catalog-manifest`, task-085's rules, task-087's targets and
   pairs), so a format-2 pack is composed, checked, published and indexed.
7. **The tests** (offline):
   - `tests/index-model.test.ts`: Acceptance 2 (two entries, the union and its order,
     `pack_format` from the tag and absent, `tensions`, a format-1 pack gaining only the new
     keys); its assertions on `format 1`, the pack ids and the version key orders updated;
   - `tests/index-render.test.ts`: Acceptance 3 (one and two entries, an entry with neither, the
     tensions sorted and once, both together, the full text) and 5 (the `llms.txt` line);
   - `tests/readme-generate.test.ts`: Acceptance 4 (two entries, a tension with and without a
     range, a multi-line resolution folded, a pack with neither unchanged);
   - `tests/site.test.ts`: the Summary on the page; its list of pack ids and its count of
     results (`found('')`) updated for the new pack;
   - `tests/index.test.ts`: Acceptance 6 and the outputs validated against format 2's schema; the
     test reading the root index through the frozen schema rewritten to read it at format 2, and
     a format-1 instance kept for the v1 schema, today's root `catalog-index.json` copied as
     `tests/fixtures/schema/index/valid/format-1.json`;
   - `npm test`'s duration before and after recorded (G12): the new pack adds the lint's
     compositions to each `indexCatalog` call (about 2.4 s each, four suites, measured by the
     body's review).
8. **The generated files** regenerated in the same commit as the code (`npm run index`, and
   `npm run index -- --tree tests/fixtures/compose/tree`), so `npm run index -- --check`, the
   golden tree's `--check` test and `validate`'s check pass: the root `catalog-index.json` changed
   as Acceptance 2 says and its `llms.txt` as Acceptance 5 says; the golden tree's
   `catalog-index.json` changed to `format: 2` only (it lists no pack) and its `llms.txt` as
   Acceptance 5 says; `CATALOG.md` and the READMEs of both unchanged. `check:schemas` exits 0. No
   schema change, so no schema note; `npm test` and `npm run lint` exit 0.
9. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations
   (G12's 25 minutes; the row "The CI's margin under G12's 25 minutes" of `docs/owed-items.md`
   read: this task adds no `validate` run, only Acceptance 7's seconds), and dl-039's local list
   on Node.js 22.21.0. The privacy check of the branch's diff recorded.

**For the approver's ruling before `backlog`:**
1. **Where `pack_format` is read** (Acceptance 2): §3.3 lists it among the fields "from the tag's
   `pack.yaml`" ("the tagged `pack.yaml`'s format"), as §3.1 says of every field taken from a
   `pack.yaml`, then adds "(`1` when the catalog entry has none, spec-001 §11)". Recommended: the
   tagged `pack.yaml`'s `format`, absent read as 1 (spec-001 §5), which needs no catalog field;
   the parenthetical recorded as an erratum candidate for the wave close. `check:packs` refuses
   an entry whose `pack_format` differs from the tagged file's (task-083), so both readings give
   the same value on every tree the lint passes. Alternative: the catalog version entry's
   `pack_format`, absent read as 1, as `version` and `wingfoil` come from `catalog.yaml`.
2. **The Summary's marks for several entries** (Acceptance 3): §3.2 gives one entry's example and
   no separator. Recommended: one parenthesis, the entries' marks joined by `; `, so that one entry
   reads as today and the tensions follow outside it. Alternative: one parenthesis per entry.
   Recorded as a reading for the wave close.
3. **Where "Combines with care" goes in the README** (Acceptance 4): §2.1 asks "a line `Combines
   with care:` followed by one item per entry" and no place. Recommended: a top-level bullet, the
   list's last (after **Declares**, or after **Requires capabilities** where there is none), its
   items nested, so it reads as the other Composition bullets. Alternative: a paragraph after
   the list. Recorded as a reading for the wave close.
4. **The tension's pack in the Summary** (Acceptance 3): §3.2 writes `` `<pack>` `` and says
   nothing of the range, while §2.1 keeps the range in the README. Recommended: the id without
   its range, as the marks name their `with` pack, the range being the README's and the index's
   (`tensions[].pack`). Alternative: the entry as written. Recorded as a reading for the wave
   close.

## Design

Branch `task/task-088-index-format-2` from `main` at this task's add. `src/index-model.ts`:
`conditionalPart` replaced by `conditionalParts(manifest)` (every entry: `with`, its id, its
contents), `tensionsOf(manifest)`; `IndexVersion` gains `pack_format`, `IndexPack` gains
`conditional_parts` and `tensions`, `CatalogIndex.format` becomes `2`; `versionOf` reads the
tagged `format`. `src/index-render.ts`: `conditionalMark` returns one mark per entry (read from
`conditional_parts`, which carries each entry's lists; the version's `conditional` stays the
copied `with`s), `summaryOf` joins them and appends the tensions; `renderLlms`' index line names
format 2. `src/readme-generate.ts`: `PackFiles['part']` becomes a list of entries, each with its
layer, its workflows and directives; `onlyWith` takes the entry; a `tensionsLines` after
**Declares**. The fixture pack of Acceptance 6 is written with `tests/support/pack-tree`'s
`PackSpec` (`format: 2`, `conditional` and `tensions`, as task-085's tests do); the body's review
composed such a pack (`governance/checks`, a tension on `stage/mvp@^1`) in a scratch copy of
`indexCatalog` with `check:packs` at 0 problems.
Red steps: (1) the tests of Acceptance 2 … 7, with the signatures of `conditionalParts` and
`tensionsOf` and no body (they throw), uncalled; in the red commit the new interface fields are
optional and `CatalogIndex.format` is `1 | 2`, so the tests compile and `packOf` still emits a
format-1 index; the fixture's expected outputs are left as today, so the byte-for-byte test fails
by assertion on the first differing output (`CATALOG.md`), a missing expected file (ENOENT)
recorded as such if reached;
(2) the code, the fields required, the expected outputs refreshed and reviewed, the generated
files regenerated. No new dependency.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-09: written as plan-066 task (G), after task-087's merge; `pack` and `depends_on` filled
  by editing the draft (W-02).
- 2026-11-09: independent review: approve with amendments, two blocking (`llms.txt` changes, its
  index line naming the format; the golden tree commits index outputs, so its `catalog-index.json`
  and `llms.txt` change); applied with the others: the frozen v1 schema keeps a test instance
  (`format-1.json`); the red step failing by assertion (the `software` entry first, the new
  fields optional, `format: 1 | 2`); the fixture pack's constraints; the assertions the fixture
  changes; the Summary's full text and ruling point 4 added; a multi-line resolution folded; the
  Composition lines nested under **Declares**; ruling 1 re-argued for the tag (a changed
  decision); Acceptance 2 reworded; the suite's added seconds stated.
- 2026-11-09: re-review: approve, three nits, applied: the red step's first failing output is
  `CATALOG.md`; "Combines with care" placed for a pack with no **Declares**; the Context's
  `llms.txt` bullet no longer credits §3.4 with the format.
- 2026-11-09: approved to `backlog` by the approver with rulings 1 … 4 as recommended
  (`pack_format` from the tagged `pack.yaml`; one parenthesis joined by `; `; "Combines with
  care" the Composition's last bullet; the tension's id without its range in the Summary).
  Branch `task/task-088-index-format-2`.
- 2026-11-09: red (`995948d`): `node --test dist/tests/index-model.test.js
  dist/tests/index-render.test.js dist/tests/readme-generate.test.js dist/tests/site.test.js
  dist/tests/index.test.js`, 102 tests, 18 failing: 16 by assertion, 2 by the throwing
  signatures (`conditionalParts`, `tensionsOf`, called by their own tests only); the
  byte-for-byte test failing by assertion on `CATALOG.md`. Already green, as Acceptance 1
  allows: the format-1 instance read through the frozen schema, the site's list of pack ids and
  its count of results (the new pack is published and listed by today's code), and "passes the
  lint, tag rules included" with the format-2 pack (`governance/checks`: `base@^1`, entries
  `software@^1` with the workflow `checks-flow` and `methodology/flow@^1` with the directive
  `checks-rule`, a tension on `stage/mvp@^1`).
- 2026-11-09: green (`285e9ea`): the code, the root's `catalog-index.json` and `llms.txt`, the
  golden tree's two files and the fixture catalog's expected outputs regenerated and reviewed (the
  new pack's version with two `conditional` entries and `pack_format: 2`, its `conditional_parts`,
  `tensions`, Summary and README sections; every other pack gaining only `pack_format: 1`,
  `conditional_parts` and `tensions`; the root's `CATALOG.md` and the four READMEs unchanged). One
  deviation from Acceptance 7's list: `tests/site.test.ts`' "names the schema the index was read
  against" read the fixture repository's index as a format-1 instance; it now reads
  `format-1.json` for the v1 case, in the green commit. `npm test` before that fix: 1286 tests,
  1285 pass, that one failing; after it, `tests/site.test.ts` 21 of 21 (1640 s locally, against
  1320 s at task-087's frozen commit; local timings vary by run, the branch CI's are G12's);
  `npm run lint` 0; `check:schemas` and both trees' `npm run index -- --check` 0.
- 2026-11-09: build review: approve with amendments, no blocking finding; applied (`5c4ad08`):
  two lines over 100 in `src/`; ruling 3's second case tested (a pack with `tensions` and no
  **Declares**); the union's "a name once" tested through an exported `unionOf`; the fixture
  pack's needless `export` and a ragged comment. Not applied: one shared helper for the
  resolution's fold, now in `src/notices.ts` and `src/readme-generate.ts` (optional, the two
  lines kept identical). The reviewer's note on the local duration (1640 s against 1320 s) is
  left to the branch CI's durations (Acceptance 9). After the amendments the five index test
  files pass, 104 of 104, and both trees' `npm run index -- --check` exit 0.
- 2026-11-09: checks on the frozen commit `04cab24`. Branch CI run 42629824600 `success`
  (22.12.0 24 min 57 s, 22.21.0 15 min 12 s), under G12's 25 minutes by 3 s on 22.12.0; read with
  the row "The CI's margin under G12's 25 minutes" of `docs/owed-items.md` (`main`'s last runs at
  21 … 23 min on 22.12.0; this task adds no `validate` run, only the fixture pack's lint
  compositions per `indexCatalog` call). dl-039's local list on Node.js 22.21.0 from a clean
  worktree at `04cab24`: `npm ci`, `npm run build`, `npm run validate:publication` (18 runs, 0
  failed), the same with `--tree tests/fixtures/compose/tree --param project_name=Golden` (26
  runs, 0 failed), `workflow list`, `directives list --format json` (`warnings []`), `npm run
  lint`, each exit 0. Privacy check of the branch's diff: no local or scratch path, no private
  project named.
