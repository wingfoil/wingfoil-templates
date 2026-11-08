---
id: plan-066-tooling-change-format-2-of-pack.yaml-catalog.yaml-and-the-index-the-conditional-part-per-entry-and-tensions
type: plan
title: "tooling-change: format 2 of pack.yaml, catalog.yaml and the index, the conditional part per entry and tensions"
status: active
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

**What the amended texts ask of the tooling** (spec-001 §5, §6.2, §6.3, §6.4, §6.5, §7.1, §7.7,
§8.1, §9, §11, §12, §15, §17, §18; spec-002 §2.1, §3.2, §3.3):
- **Schemas:** `pack.yaml` and `catalog.yaml` at format 2 (`tensions`; a conditional part of
  several entries whose `with` names any pack composed earlier; `mcp` in `contents.fragments` and
  `formats`; a version entry's `pack_format`, absent reading as 1); format 1's schemas frozen as
  `schema/pack.v1.schema.json` and `schema/catalog.v1.schema.json`; `catalog-index.json` at format
  2, `index/catalog-index.v1.schema.json` frozen; the `$comment` texts; the schema note
  (`wingfoil-cli` rule 8, the `schema-note` lint).
- **Reading by format:** the composer, the lint and `check:schemas` pick the schema by the file's
  `format`, and a format-1 file keeps format 1's rules.
- **The composer:** each entry active when the composition holds its `with` pack (an unsatisfied
  range an error and a `with` never adding a pack, §6.5), its parameter scope its own, its files
  after the pack's own in written order; §7.1's order; the tensions' notices of §17 step 8, which
  never fail the composition.
- **The lint (F3.5, §18):** the conditional rules by format and per entry (isolation, inventory,
  `formats` counting every entry's files (§12), scope, `delivery`'s same part and the slots (§9),
  one owner); `tensions`' rules; dl-025 D1's waiver heuristic with bridges exempt; D6's coverage
  (§15: each conditional pack with every entry's pack and with each left out in turn, a `tensions`
  pack with each pack it names, every pack with each `stage/*`).
- **The catalog:** `publish` writes `pack_format`, `check:packs` compares it with the tagged file.
- **The index and the generators:** `conditional_parts`, `tensions`, `pack_format`, the Summary's
  marks per entry and "Combines with care" (`CATALOG.md`, the site, `llms.txt`), the README's
  Composition per entry and its What it adds per entry (each line "only with `<pack>`", spec-002
  §2.1).
- **`pack-compatibility`'s bullet** on a conditional part (today "with and without `software`"),
  with the code it describes (plan-063's note of 2026-11-05, confirmed by the approver).

**What exists** (`main`; mapped on 2026-11-07): one schema per file kind, compiled from a fixed
list (`src/schemas.ts`), nothing chooses by `format`; `conditional` read as one entry with
`software` in the resolver (`conditionalActive`), the composer and output, the parameter scopes,
the lint (`pack-rules`, `pack-files`, `workflow-rules`, `overlay-rules`) and `validate`'s legs
(`[+software]`, `[-software]`, plan-039 R6); `compose` writes its messages to stderr and has no
notices; no warning tier in `check:packs`; directives' `tags` parsed nowhere; `publish` already
copies every entry's `with` and refuses an empty range; the index's model, render and README
generator read `conditional[0]`. The golden trees (`tests/fixtures/compose/tree`,
`tests/fixtures/index/expected`) and the root's `catalog-index.json`, `CATALOG.md` and `llms.txt`
change with the index. No pack, fixture or tree has two entries or a tension; no `stage/*` pack
exists (W12).

**Not in this plan:** the `mcp` kind's tooling (its fragment schema, merge, §18's `mcp` rules, §17
step 8's restriction notice, `compat.yaml`'s `kinds` and `reads`; its own row, plan-063 ruling 4);
any published pack moved to format 2 (plan-063 ruling 3); the packs' `Precedence:` lines (their
rows, at each pack's next minor); dl-025 D7's halves in the stage charters (W12); dl-011
(`pending`).

**`main`'s CI before this plan** (dl-038 C3): plan-065's close, `775f445`, run 42365575072, read
in the Execution Notes before `submit`.

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation; points 4 and 6 are departures the approver rules as such.

1. **Tasks, in order, WIP 1** (`tooling-delivery` v3 each: body review, acceptance, design with its
   red steps, build test first, build review, dl-039's checks on the frozen commit, the approver's
   approval, `--no-ff` merge, `main`'s CI read). Recommended, each added after the one before is
   done (W-14), each needing the ones before it as noted:
   - **(A) The schemas at format 2:** `pack`, `catalog` and the index's schema at format 2, the
     three v1 copies frozen, the `$comment` texts; validation by `format` for every caller and for
     `check:schemas`; the test fixtures split by format; the schema note written in the same task
     (`npm run feedback:note -- --schema --from <task>`, the next free F number).
   - **(B) The catalog** (needs (A)): `publish` writes `pack_format`, `check:packs` compares it
     (absent read as 1); the root `catalog.yaml` moves to `format: 2` (point 3).
   - **(C) The composer per entry** (needs (A)): the active entries, their order and parameter
     scopes, §7.1's check of a `with` pointing later, the notices (point 5), the `mcp` refusal
     (point 6).
   - **(D) The lint per entry** (needs (A), (C)): §18's conditional rules by format, `tensions`'
     rules, inventory and `formats`, isolation, scopes, `delivery`'s same part, slots and one owner
     per entry, the `mcp` refusal (point 6); its design may split it in two tasks (the manifest's
     rules, the cross-file rules), named (D1) and (D2), the later letters kept.
   - **(E) The waiver heuristic** (needs (D); point 4).
   - **(F) D6's coverage** (needs (B), (C), (D)): `validate`'s legs and the overlay lint per entry
     (each `with` pack present, each left out in turn, a `tensions` pack with each pack it names,
     every pack with each `stage/*`), the publication check rewritten from plan-039 R6,
     `pack-compatibility`'s bullet in the same task.
   - **(G) The index at format 2 and the generators** (needs (A), (B)): model, render, site,
     `llms.txt`, README Composition, What it adds and "Combines with care", the golden trees and
     the root's generated files.
2. **The evidence: fixture packs only.** No published pack moves to format 2 (plan-063 ruling 3)
   and no `stage/*` pack exists, so the tests use fixture packs under `tests/fixtures/` at format 2:
   an overlay with two entries, one of them a bridge, and a pack declaring a tension. Format 1's
   refusals are tested too: a format-1 pack with two entries, with `tensions` or with a `with`
   other than `software`; a format-2 pack requiring `software` with an entry naming another pack
   (§6.5's "Who"); a `with` range not satisfied; a `with` pointing at a later pack (§7.1).
   Recommended: these, plus the four published packs unchanged and green (`check:packs`,
   `validate`, the golden tree, the exit overlays), are the exit's evidence; no adoption run and no
   matrix row added, since format 2 is this repository's format, not WingFoil's (spec-001 §5 item
   2); the fixture compositions go through `validate`'s WingFoil commands as any composition does.
3. **The root `catalog.yaml` at format 2 with (B).** Its schema validates format 2 after (A), and
   `catalog.v1` keeps today's file valid until then. Recommended: `format: 2` in (B)'s commit with
   the code that writes `pack_format`, no published entry edited (§11); the next version published
   carries `pack_format: 1` for a format-1 pack. The note of (A) covers the bump. Alternative: when
   the first format-2 pack is published.
4. **The waiver heuristic's judgement** (a departure: §18 reports wording "about something the pack
   does not ship", which code cannot tell). Recommended: a keyword match ("skip", "not required",
   "optional", "ignore") on the text of an overlay's or a `stage/*` pack's directives, a bridge's
   directives exempt, printed by `check:packs` as a review list with its exit unchanged (§18: a
   heuristic, not a refusal); whether a hit concerns something the pack does not ship is the
   reviewer's to judge. Read at `pack-release-cycle` › `prepare`, where the `pack-release`
   element's review records each hit with its verdict; (E) adds that sentence to `pack-authoring`.
   Alternative: a failure with a waiver list in the pack.
5. **The notices** (§17 step 8): printed on stderr by `compose`, one line per tension the
   composition holds (`notice: <pack> and <pack>: <resolution>`), in composition order and then in
   `tensions`' order, exit unchanged; `validate` prints them with its legs, its tests reading them
   from its output. Recommended as written.
6. **An `mcp` fragment refused until its row** (a departure: §18's `mcp` rules wait for their row,
   plan-063 ruling 4). Format 2's schemas admit `mcp` in `contents.fragments` and `formats` (the
   pack's, the catalog's and the index's), but the composer cannot merge it; `publish` already
   refuses its empty range (§12). Recommended: the lint and the composer refuse a pack shipping
   `mcp` too, for unpublished packs and fixtures ("read by no WingFoil release", spec-001 §7.8,
   plan-063 ruling 4), the refusal lifted by the `mcp` tooling's row. Alternative: accepted and
   ignored, which a composed tree would not show.
7. **Open points left to the first stage charter** (W12), a choice plan-063's notes allowed
   ("the `tooling-change` plan or the first stage charter"), each in a row (owner approver,
   trigger the first `stage/*` charter): with several stricter packs, whether the check before the
   swap fails when one of them has no `exit-check` directive (it needs directives' `tags` parsed
   and a mapping by `with`); a bridge whose `with` is a common pack the stricter packs require,
   which §18's exemption misses. Recommended: neither implemented here, since no stage pack exists
   to decide them on.
8. **The missing row of spec-001 §5's exception.** §5 says a new pack is written at format 1 until
   the reference composer reads format 2, "a temporary exception, `docs/owed-items.md`", but no
   row records it: a slip of plan-063 against dl-036 R2. Recommended: the row added in the commit
   that records the rulings, settled at (G)'s merge, the last task, when a format-2 pack can be
   composed, checked, published and indexed.
9. **Checks, branches and pushes:** dl-039's checks on each task's frozen commit; each task on
   `task/<id>`; `main` pushed at `submit`, at each merge and at the close, never while its CI runs;
   the CI's duration read at each merge (none over 25 minutes, G12), the coverage of (F) the likely
   growth.

## The approver's rulings

Given by the approver on 2026-11-07: every point of the outline as recommended, the departures of
points 4 and 6 included.
1. **Point 1:** tasks (A) … (G) in the order and with the dependencies written; (D) split as (D1)
   and (D2) if its design finds it too large.
2. **Point 2:** fixture packs only, format 1's refusals tested; no adoption run, no matrix row.
3. **Point 3:** the root `catalog.yaml` at format 2 with (B), no published entry edited.
4. **Point 4:** the waiver heuristic a review list, exit unchanged, read at `pack-release-cycle` ›
   `prepare`.
5. **Point 5:** the tensions' notices on stderr, in a fixed order, never failing.
6. **Point 6:** an `mcp` fragment refused by the lint and the composer until its row.
7. **Point 7:** both open points left to the first `stage/*` charter, each in a row.
8. **Point 8:** spec-001 §5's exception in a row, settled at (G)'s merge.
9. **Point 9:** dl-039's checks, a branch per task, `main` never pushed while its CI runs.

## Steps

1. **This plan:** independent review and re-review (dl-017); the outline shown to the approver and
   ruled; the rulings committed with the rows of points 7 and 8 (dl-036 R2); `submit`
   (`draft → active`); `main` pushed; its CI read.
2. **Tasks (A) … (G)**, in order (point 1), each `memory add` on `main` when the one before is done
   (W-14), its loop as point 1 says, the register's rows with their notes.
3. **Wave close:** per tech-spec, the errata and rulings of the wave, and the element the approver
   names to fold them back, or the ruling that none is needed (dl-020).
4. **Close:** point 8's row and this plan's row moved to Closed;
   `main`'s CI on the last merge read; `active → done`.

## Handoff

- **claude (facilitator, developer):** the tasks and the close, except the approvals and the merge
  OKs. It never runs `memory approve` or `memory reject`: it gives the approver the command, with
  `cd` and `--reason`. No pull request. Files staged by name.
- **Reviewers (subagents):** this plan; each task's body and build; re-reviews when a fix changes a
  decision (dl-017).
- **Approver:** the outline (before `submit`), with the departures of points 4 and 6; each task's
  gates; the merge OKs; the wave close's ruling on errata.
- Done when tasks (A) … (G) are done and merged into `main` (eight if (D) is split); the wave close
  ruled; point 8's row and this plan's row Closed; `main`'s CI on the last merge read `success`,
  both jobs' durations recorded and none over 25 minutes (dl-039 R3, G12); the run of the close's
  push left to the next plan (dl-038 C3).

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-07: written as asked by the approver on 2026-11-07, after plan-065's close; `workflow`
  and `phase` filled by editing the draft (W-02). Next free numbers when written: plan-067,
  task-082, dl-043, bug-016, prel-007, F-047.
- 2026-11-07: independent review: approve after amendments, two blocking (the README's What it
  adds per entry missing; point 4's review list with no place); applied with the others: the task
  order by dependency ((A), then the catalog as (B), the composer, the lint, the heuristic, the
  coverage, the index), format 1's refusals in the evidence, §6.3, §9 and §12 in the coverage,
  the `mcp` notice and rules named as out, `publish`'s empty-range refusal, the notices' order,
  point 7's rows' owner and trigger, point 8 as plan-063's slip settled at the last merge, the
  Handoff's measurable criteria.
- 2026-11-07: re-review: approve, nothing blocking; applied: the rows of point 7 with the rulings'
  commit (dl-036 R2), the composer's `mcp` refusal in (C), §6.5 cited for a `with`'s range, a
  split of (D) named (D1) and (D2).
- 2026-11-07: `main`'s CI before this plan (dl-038 C3), on plan-065's close (`775f445`), run
  42365575072, `success` (22.12.0 16 min 25 s, 22.21.0 18 min 8 s), no annotation. The approver
  ruled every point as recommended; the rulings recorded with the rows of points 7 and 8 in
  `docs/owed-items.md` (dl-036 R2).
- 2026-11-07: `main`'s CI on this plan's `submit` (`83a78bc`), run 42402980192, `success`
  (22.12.0 20 min 35 s, 22.21.0 13 min 16 s); the Pages run 42402980279 `success`. Task (A),
  task-082, added, reviewed, re-reviewed, submitted and approved to `backlog` on 2026-11-07.
- 2026-11-08: task (A), task-082, approved by the approver, merged `--no-ff` (`68e5fbc`) and done;
  its branch CI run 42420441902 `success` (22.12.0 19 min 56 s, 22.21.0 13 min 21 s); F-047
  written. `main`'s CI on the merge read in the next note.
- 2026-11-08: `main`'s CI on task-082's merge (pushed with this plan's note, `1eb2187`), run
  42458531818, `success` (22.12.0 19 min 49 s, 22.21.0 16 min 56 s), under 25 minutes (G12).
  Task (B), task-083, added, reviewed, re-reviewed, submitted and approved to `backlog`.
