---
id: plan-066-tooling-change-format-2-of-pack.yaml-catalog.yaml-and-the-index-the-conditional-part-per-entry-and-tensions
type: plan
title: "tooling-change: format 2 of pack.yaml, catalog.yaml and the index, the conditional part per entry and tensions"
status: draft
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","format","packs","schema"]
---

## Context

The `deliver` phase of `tooling-change` for spec-001's and spec-002's amendments of 2026-11-05
(dl-024, dl-025, plan-063): the row "The `tooling-change` plan of spec-001's and spec-002's
amendments of 2026-11-05" of `docs/owed-items.md`, whose trigger, the close of the plan automating
`wingfoil-release-intake`, came with plan-065's close on 2026-11-07. plan-063 wrote the texts and
changed no file under `schema/`, `index/` or `src/` (its ruling 1); this plan implements them.

**The tech-specs this wave builds on** (dl-020, applied by analogy as plan-063 ruling 2 says):
spec-001 and spec-002, both `approved`, amended in place on 2026-11-05 (plan-063, merge
`89c633d`); no erratum of either is open. Errata and rulings found here are listed per tech-spec at
each wave close, with the element the approver names to fold them back.

**What the amended texts ask of the tooling** (spec-001 §5, §6.2, §6.4, §6.5, §7.1, §7.7, §8.1,
§11, §15, §17, §18; spec-002 §2.1, §3.2, §3.3):
- **Schemas:** `pack.yaml` and `catalog.yaml` at format 2 (`tensions`; a conditional part of
  several entries whose `with` names any pack composed earlier; `mcp` in `contents.fragments` and
  `formats`; a version entry's `pack_format`, absent reading as 1); format 1's schemas frozen as
  `schema/pack.v1.schema.json` and `schema/catalog.v1.schema.json`; `catalog-index.json` at format
  2, `index/catalog-index.v1.schema.json` frozen; the `$comment` texts; the schema note
  (`wingfoil-cli` rule 8, the `schema-note` lint).
- **Reading by format:** the composer, the lint and `check:schemas` pick the schema by the file's
  `format`, and a format-1 file keeps format 1's rules.
- **The composer:** each entry active when the composition holds its `with` pack, its parameter
  scope its own, its files after the pack's own in written order; the notices of §17 step 8, which
  never fail the composition.
- **The lint (F3.5, §18):** the conditional rules by format and per entry (isolation, inventory,
  scope, `delivery`'s same part, slots, one owner); `tensions`' rules; dl-025 D1's waiver heuristic
  with bridges exempt; D6's coverage (§15: each conditional pack with every entry's pack and with
  each left out in turn, a `tensions` pack with each pack it names, every pack with each `stage/*`).
- **The catalog:** `publish` writes `pack_format`, `check:packs` compares it with the tagged file.
- **The index and the generators:** `conditional_parts`, `tensions`, `pack_format`, the Summary's
  marks per entry and "Combines with care" (`CATALOG.md`, the site, `llms.txt`), the README's
  Composition per entry.
- **`pack-compatibility`'s bullet** on a conditional part (today "with and without `software`"),
  with the code it describes (plan-063's note of 2026-11-05, confirmed by the approver).

**What exists** (`main`; mapped on 2026-11-07): one schema per file kind, compiled from a fixed
list (`src/schemas.ts`), nothing chooses by `format`; `conditional` read as one entry with
`software` in the resolver (`conditionalActive`), the composer and output, the parameter scopes,
the lint (`pack-rules`, `pack-files`, `workflow-rules`, `overlay-rules`) and `validate`'s legs
(`[+software]`, `[-software]`, plan-039 R6); no notice channel in `compose`; no warning tier in
`check:packs`; directives' `tags` parsed nowhere; `publish` already copies every entry's `with`;
the index's model, render and README generator read `conditional[0]`. The golden trees
(`tests/fixtures/compose/tree`, `tests/fixtures/index/expected`) and the root's
`catalog-index.json`, `CATALOG.md` and `llms.txt` change with the index. No pack, fixture or tree has two entries or a
tension; no `stage/*` pack exists (W12).

**Not in this plan:** the `mcp` kind's tooling (its fragment schema, merge, lint, `compat.yaml`'s
`kinds` and `reads`; its own row, plan-063 ruling 4); any published pack moved to format 2
(plan-063 ruling 3); the packs' `Precedence:` lines (their rows, at each pack's next minor);
dl-025 D7's halves in the stage charters (W12); dl-011 (`pending`).

**`main`'s CI before this plan** (dl-038 C3): plan-065's close, `775f445`, run 42365575072, read
in the Execution Notes before `submit`.

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation; points 4 and 6 are departures the approver rules as such.

1. **Tasks, in order, WIP 1** (`tooling-delivery` v3 each: body review, acceptance, design with its
   red steps, build test first, build review, dl-039's checks on the frozen commit, the approver's
   approval, `--no-ff` merge, `main`'s CI read). Recommended, each added after the one before is
   done (W-14):
   - **(A) The schemas at format 2:** `pack`, `catalog` and the index's schema at format 2, the
     three v1 copies frozen, the `$comment` texts; validation by `format` for every caller and for
     `check:schemas`; the test fixtures split by format; the schema note written in the same task
     (`npm run feedback:note -- --schema --from <task>`, the next free F number).
   - **(B) The composer per entry:** the active entries, their order and parameter scopes, §7.1's
     check of a `with` pointing later, the notices (point 5).
   - **(C) The lint per entry:** §18's conditional rules by format, `tensions`' rules, inventory,
     isolation, scopes, `delivery`'s same part, slots and one owner per entry; the build may split
     it in two tasks (the manifest's rules, the cross-file rules) if its design finds it too large.
   - **(D) The waiver heuristic** (point 4).
   - **(E) D6's coverage:** `validate`'s legs and the overlay lint per entry (each `with` pack
     present, each left out in turn, a `tensions` pack with each pack it names, every pack with
     each `stage/*`), the publication check rewritten from plan-039 R6, `pack-compatibility`'s
     bullet in the same task.
   - **(F) The catalog:** `publish` writes `pack_format`, `check:packs` compares it (absent read as
     1); the root `catalog.yaml` moves to `format: 2` (point 3).
   - **(G) The index at format 2 and the generators:** model, render, site, `llms.txt`, README
     Composition and "Combines with care", the golden trees and the root's generated files.
2. **The evidence: fixture packs only.** No published pack moves to format 2 (plan-063 ruling 3)
   and no `stage/*` pack exists, so the tests use fixture packs under `tests/fixtures/` at format 2:
   an overlay with two entries, one of them a bridge, and a pack declaring a tension. Recommended:
   these, plus the four published packs unchanged and green (`check:packs`, `validate`, the golden
   tree, the exit overlays), are the exit's evidence; no WingFoil run is added, since format 2 is
   this repository's format, not WingFoil's (spec-001 §5 item 2).
3. **The root `catalog.yaml` at format 2 with (F).** Its schema validates format 2 after (A), and
   `catalog.v1` keeps today's file valid until then. Recommended: `format: 2` in (F)'s commit with
   the code that writes `pack_format`, no published entry edited (§11); the next version published
   carries `pack_format: 1` for a format-1 pack. The note of (A) covers the bump. Alternative: when
   the first format-2 pack is published.
4. **The waiver heuristic's tier** (a departure: §18 says "reported for review"; `check:packs` has
   no warning tier). Recommended: a keyword match ("skip", "not required", "optional", "ignore") on
   the text of an overlay's or a `stage/*` pack's directives, a bridge's directives exempt; printed
   as a review list by `check:packs`, exit unchanged; "about something the pack does not ship" is
   the reviewer's to judge, and `pack-authoring`'s review list records each hit with its verdict.
   Alternative: a failure with a waiver list in the pack.
5. **The notices** (§17 step 8): printed on stderr by `compose`, one line per tension the
   composition holds (`notice: <pack> and <pack>: <resolution>`), exit unchanged; `validate`
   shows them with its legs. Recommended as written.
6. **An `mcp` fragment refused until its row** (a departure: §18's `mcp` rules wait for their row,
   plan-063 ruling 4). Format 2's schemas admit `mcp` in `contents.fragments` and `formats` (the
   pack's, the catalog's and the index's), but the composer cannot merge it. Recommended: the lint
   and the composer refuse a pack shipping `mcp` ("read by no WingFoil release", spec-001 §7.8,
   §12), the refusal lifted by the `mcp` tooling's row. Alternative: accepted and ignored, which a
   composed tree would not show.
7. **Open points left to the first stage charter** (W12), each in a row: with several stricter
   packs, whether the check before the swap fails when one of them has no `exit-check` directive
   (plan-063's note; it needs directives' `tags` parsed and a mapping by `with`); a bridge whose
   `with` is a common pack the stricter packs require, which §18's exemption misses (plan-063's
   note). Recommended: neither implemented here, since no stage pack exists to decide them on.
8. **The missing row of spec-001 §5's exception.** §5 says a new pack is written at format 1 until
   the reference composer reads format 2, "a temporary exception, `docs/owed-items.md`", but no
   row records it (dl-036 R2). Recommended: the row added with this plan's `submit`, settled by
   (C)'s merge, when the composer and the lint read format 2.
9. **Checks, branches and pushes:** dl-039's checks on each task's frozen commit; each task on
   `task/<id>`; `main` pushed at `submit`, at each merge and at the close, never while its CI runs;
   the CI's duration read at each merge (none over 25 minutes, G12), the coverage of (E) the likely
   growth.

## Steps

1. **This plan:** independent review and re-review (dl-017); the outline shown to the approver and
   ruled; `submit` (`draft → active`) with the row of point 8; `main` pushed; its CI read.
2. **Tasks (A) … (G)**, in order (point 1), each `memory add` on `main` when the one before is done
   (W-14), its loop as point 1 says, the register's rows with their notes.
3. **Wave close:** per tech-spec, the errata and rulings of the wave, and the element the approver
   names to fold them back, or the ruling that none is needed (dl-020).
4. **Close:** the rows of point 7; point 8's row and this plan's row moved to Closed; `main`'s CI on
   the last merge read; `active → done`.

## Handoff

- **claude (facilitator, developer):** the tasks and the close, except the approvals and the merge
  OKs. It never runs `memory approve` or `memory reject`: it gives the approver the command, with
  `cd` and `--reason`. No pull request. Files staged by name.
- **Reviewers (subagents):** this plan; each task's body and build; re-reviews when a fix changes a
  decision (dl-017).
- **Approver:** the outline (before `submit`), with the departures of points 4 and 6; each task's
  gates; the merge OKs; the wave close's ruling on errata.
- Done when the tasks are done and merged into `main`, the wave close ruled, the register's rows
  of point 7 written and this plan's row Closed, and `main`'s CI read.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-07: written as asked by the approver on 2026-11-07, after plan-065's close; `workflow`
  and `phase` filled by editing the draft (W-02). Next free numbers when written: plan-067,
  task-082, dl-043, bug-016, prel-007, F-047.
