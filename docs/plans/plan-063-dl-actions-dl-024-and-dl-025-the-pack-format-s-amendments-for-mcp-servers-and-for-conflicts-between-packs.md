---
id: plan-063-dl-actions-dl-024-and-dl-025-the-pack-format-s-amendments-for-mcp-servers-and-for-conflicts-between-packs
type: plan
title: "dl actions: dl-024 and dl-025, the pack format's amendments for MCP servers and for conflicts between packs"
status: active
workflow: "decision-log-ingest"
phase: "rule"
tags: ["process","dl-actions","format","packs"]
---

## Context

The `rule` phase of `decision-log-ingest` for dl-024 (MCP servers declared by packs, option (b)
with (a) as the interim) and dl-025 (conflicts between packs: stricter wins, declared tensions,
directive precedence, option (c)), both approved on 2026-11-03 with the review findings of
2026-10-28 accepted as written and applied by their dl actions (plan-060 ruling 7; dl-025 finding
1: option (ii)). It is the row "The dl actions of dl-024 and dl-025" of `docs/owed-items.md`,
placed by dl-038 D1 after plan-062 and before WingFoil UI's feedback. Asked by the approver on
2026-11-04.

What they imply (dl-024 D6, dl-025 D7, with the findings):
- **spec-001, dl-024:** the `mcp` kind in §2 (the term "fragment"), §5, §6.1, §6.2 (`formats`), §6.3
  (finding 4: a `phases` entry naming another pack's workflow extends §6.3's list of what a pack
  must `require`; a restricted server is not added to it), §6.4, a new §7.x for D2's merge (one
  owner per server, `restrictions` as growing sets), §12 and `compat.yaml` (`kinds`, each release's
  `reads`; the capability `mcp-servers` added only when a release's CHANGELOG names the feature, a
  pack shipping `mcp` declaring it in `requires_capabilities`, D3), §17 (the composition notice) and
  §18 (the lint; the restriction notice is not a refusal); the WingFoil side (D3; finding 3: an
  adapter with `mcp.via: args` has no template, so only a merge WingFoil performs reaches it;
  finding 5: D3 5 reads "a pack install or update");
- **spec-001, dl-025:** `tensions` in §6.2; §6.5's conditional part generalised (several entries,
  `with` naming any pack composed earlier, the "Who" rule, isolation per entry, dl-026's "same part"
  rule per entry, finding 4) and every place the part reaches (finding 2: §6.3's last bullet, §6.4,
  §7.7, §8.1, §10's sentence on `delivery`, §11, §12, §15, §17, §18; §7.1 and §16 O14 checked);
  D2's precedence table for `base`'s section (§10); finding 1 (ii): the target stage's pre-swap step
  reads the exit-check directives the conditional entries ship (§14);
- **`catalog.yaml` and the index:** §11 copies `conditional` with its `with` into each version
  entry, and `schema/catalog.schema.json` allows one entry whose `with` is `software@^…`;
  `catalog-index.json` (spec-002 §3.3, `index/catalog-index.schema.json`) copies a list of one
  `{ with }`;
- **spec-002:** a pasted server entry kept in section 3 until WingFoil reads the kind (§2.3, CB-3;
  dl-024 finding 1: a custom adapter cannot reuse a built-in adapter's name, so the project copies
  one under a name of its own and selects it in `dna.yaml` › `team.agents` › `adapter`); the
  "Combines with care" section and its index field; the Composition section per conditional entry;
- **`schema/`:** `pack.schema.json` (`contents.fragments`, `tensions`, `conditional`),
  `catalog.schema.json`, the index's schema, and a fragment schema for `mcp`, with the feedback note
  `wingfoil-cli` rule 8 requires. `schema/` holds no fragment schema today (catalog, compat, pack,
  preset, transition): an `mcp` one would be the first, for a kind whose name is WingFoil's (D2);
- **`pack-authoring`:** dl-024 D1's rules and D4's catalog rule (only servers published by the
  resource's vendor or by a maintained open-source project); dl-025 D1's directive rule, D2's
  first-line class and the named law or standard; finding 5 (a `custom/` directive never reuses a
  pack directive's id) and finding 6's wording;
- **the F3.5 lint and the composer:** dl-024 D2's rules and merge; dl-025 D1's heuristic (finding 6:
  bridges exempt), D3's notice and D6's coverage (each conditional entry composed with and without
  its `with` pack);
- **dl-025 D5:** escalation to a `custom/` directive through `governance-evolution` (finding 3);
- **dl-025 D7's last bullet:** the two halves in the charters of `stage/prototype`,
  `stage/production` and each stricter pack, when opened (W12): owed, not in this plan.

**spec-001 and spec-002 are approved.** These are not errata (dl-020 R1 … R3 fold back what a wave
finds wrong); they are approved decisions that change the format, as dl-022 (plan-038), dl-026 and
dl-027 were, each applied by amending spec-001 in place, the decision-log's approval and the merge
OK approving the text (spec-001 › Execution Notes, 2026-10-26). No erratum of either is open:
spec-002's of W14 were folded back by plan-031 and its R3 and R8 by plan-040; spec-001's of
2026-10-13 and 2026-10-14 by plan-032 and plan-038.

**What changed since they were written:** four packs are published, all `active` in `catalog.yaml`
(`base`, `software`, `methodology/scrum`, `methodology/kanban`), and spec-001 §5 applies its
format rule from the first publication on; §6.2 allows "at most one entry in format 1" in
`conditional`, and dl-025 D4 says the same. No release in `compat.yaml` reads an `mcp` kind (dl-024
D2: no pack can ship it), and no pack or stage overlay declares a tension yet (`stage/*` are W12).

**`main`'s CI before this plan** (dl-038 C3): plan-062's last push, `b3e7fcb` (its close and
`active → done`), CI run 42059337106
`success` (jobs Node.js 22.21.0 13 min 17 s, 22.12.0 13 min 41 s), no warning annotation, read here.

**Not in this plan:** WingFoil UI's feedback (row 43); the packs' own changes that the rules ask of
published content (point 6); WingFoil's side (F-035, on `main`, which still reads "proposed, not yet
ruled": its status is the sync's to set, at W10); dl-011 (`pending`; dl-025 D3's question at
initialization stays out of spec-002 until it is ruled, point 10); amending any approved body (each
change is an Execution Note).

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation; points 4, 7 and 9 are departures the approver rules as such.

1. **One plan or two.** Recommended: two. This plan writes the texts, on one branch, one commit per
   row: spec-001 and spec-002 amended in place, `pack-authoring`, the notes; **no file under
   `schema/`, `index/` or `src/` changes here**. A `tooling-change` plan, after this one closes,
   implements them in tasks (`tooling-delivery` v3, red first, dl-039's checks): the schemas (and
   their frozen copies), the composer, the F3.5 lint, the index and README generators, the coverage.
   Reasons: the specs are the contract the tooling is checked against, so they are approved first
   (as spec-001 before the `tooling` phase); the tooling is several tasks under WIP 1, which a
   `tooling-change` plan hosts; one branch holding both would carry weeks of work under one merge.
   The feedback note (point 7) then precedes the schema change, as F-035 preceded dl-024's ruling.
2. **The amendment's mechanism.** Recommended: in place, as dl-022, dl-026 and dl-027: an
   independent review of the amended text against the decision-logs and findings (dl-017), a
   re-review when a fix changes a rule, the merge OK approving it; each spec's Execution Notes
   record the amendment with its sources. dl-020 does not apply (no erratum); the `tooling-change`
   plan applies its R3 by analogy, naming spec-001 and spec-002 and their state in its Context.
3. **One format bump, for readers.** The reason: a reader (the composer, a resolver, a future
   `pack-install`) must tell a manifest it cannot read from one it can, and §6.2 and dl-025 D4
   already name format 1's limit. Validation alone does not decide it: every format-1 file stays
   valid under the widened rules, and format 1's schema (`additionalProperties: false`) refuses
   `tensions` as much as a second entry. Recommended:
   - `pack.yaml` format 2: `tensions`, several conditional entries, any earlier `with`, and the
     `mcp` fragment kind (point 4), one bump; the published packs stay at format 1, and the composer
     and the lint pick the schema by `format`; `schema/pack.v1.schema.json` the frozen copy (§5);
   - `catalog.yaml` format 2, since a version entry copies `conditional` (§11), with its frozen
     `catalog.v1`; a format-2 version entry also records its `pack.yaml` format, so that a resolver
     decides from the catalog alone (§11); the field is absent in format 1 and an absent field reads
     as 1, so no published entry is edited (§11: an entry is never edited after publication, except
     its `wingfoil` field); `tensions` is not copied into version entries (the index reads it from
     the tags);
   - `catalog-index.json` format 2 (spec-002 §3.3), with its schema's frozen copy; spec-002 CB-8
     (`catalog.yaml`, `compat.yaml` and `schema/` unchanged by spec-002's tasks) still holds, since
     the catalog's changes are spec-001's;
   - `pack-semver`: moving a pack's `pack.yaml` to a new format is **major** (a reader of the old
     format cannot read the new version; "in doubt, take the higher"), so a pack moves only when it
     needs format 2's keys; a major of `base` breaks every `requires: base@^2`, so every dependent
     pack would need a release, which is why the four published packs stay at format 1; a pack whose
     first version needs format 2 (the `stage/*` packs) is born at format 2, so dl-025 D7's later
     minor releases of each stage stay minor; the class is the approver's.
4. **The `mcp` kind: specified now, its tooling when a WingFoil release reads it** (a departure from
   dl-024 D6, which lists `schema/`'s fragment schema and the F3.5 lint's D2 rules among the changes
   after approval). Recommended: spec-001 and spec-002 state the kind, its merge, its lint and the
   interim (dl-024 D5) now, the name provisional (D2); format 2's `pack.yaml` schema admits `mcp` in
   `contents.fragments` and `formats` (so a later reader needs no format 3, if WingFoil keeps the
   name), unshippable through §12's empty range; the fragment schema, the merge, the lint and
   `compat.yaml`'s `kinds` and `reads` (whose schema, `additionalProperties: false`, refuses a new
   kind) wait for a released WingFoil that reads the kind and names it, with that task's format bump
   or ruling and its note (rule 8). Recorded in dl-024's notes; the register's row split, the
   remainder a row of its own (owner approver, trigger: a WingFoil release whose CHANGELOG names the
   feature, dl-024 D3). Alternative: all of it in the `tooling-change` plan (D6 as written): a first
   fragment schema and code no pack can use, under a name that may change.
5. **The review findings' places**, as ruled on 2026-11-03, each in the row whose file it touches:
   dl-024's 1 (spec-002 §2.3 and `pack-authoring`), 2 (spec-001's places above), 3 (spec-001's
   WingFoil-side paragraph), 4 (§6.3), 5 (spec-001, D3 5's wording); dl-025's 1 (ii) (§14), 2 (the
   places above), 3 (escalation through `governance-evolution`: in `pack-authoring` and in §10's new
   "Precedence" subsection, point 10 (i), as the agent's rule), 4 (§6.5, §9, §18), 5
   (`pack-authoring`), 6 (the nits: the waiver heuristic's exemption in §18 and `pack-authoring`;
   gap 3's wording, "the highest class among the S directives", "by pack or axis" in
   `pack-authoring`; the other three in point 10). Bodies stay as approved.
6. **The packs' own changes.** dl-025 D2 asks every directive to state its class on its first line,
   and `base`'s AGENTS.md section to state the table: published content, a release of each pack.
   Recommended: one row of `docs/owed-items.md` per pack (owner approver, trigger the next minor
   release of that pack, the change classed **minor**: content added, not wording only), the check
   in `pack-authoring`'s review list for any version prepared after this amendment (not gated on
   format 2, which these packs need not take; no workflow changes); `pack-authoring` defines the
   first line's place (the line after the `# ` title, `Precedence: <class>` or `Precedence: law
   (<act>)`); WingFoil's built-in directives cannot carry it and rely on `base`'s table. D7 itself
   lists only `pack-authoring`. Alternative: four pack releases now.
7. **The feedback note** (a departure from `tooling-delivery` › `deliver`, as plan-062 ruling 3).
   Recommended: one note, the next free F number, for the `schema/` change (`wingfoil-cli` rule 8):
   `pack.yaml` and `catalog.yaml` at format 2 (point 3), `catalog-index.json`'s bump as information
   only (spec-002 §3.3: its schema is not part of the contract with WingFoil); written by a
   content-only task (dl-039 R1) on its own branch from this plan's, merged into it (task-064's
   precedent), with its ledger row, naming the `tooling-change` task that makes the change; the
   `mcp` fragment schema's note with its own task (point 4). F-035 already asks WingFoil for the MCP
   side.
8. **Branch, checks and pushes.** Recommended: this plan on `main`; the work on
   `dl/dl-024-dl-025-actions`; after each commit `workflow list` and `npm run lint` exit 0; the
   checks once on the frozen head (the branch CI and dl-039's local list, plan-062 ruling 4's
   reading); `main` pushed at `submit`, at the merge and once at the close.
9. **The `tooling-change` plan after WingFoil UI's feedback** (a departure from dl-038 D1, which
   placed the whole row 5, tooling included, before row 43). Recommended: this plan, then WingFoil
   UI's feedback plan (capture only, waiting since 2026-11-02), then the `tooling-change` plan; the
   register's row split at this plan's close, its tooling remainder a row of its own (trigger: the
   close of WingFoil UI's feedback plan), and row 43's trigger reading "this plan's close".
   Alternative: dl-038 D1 as written, the `tooling-change` plan before WingFoil UI's feedback.
10. **dl-025 finding 6's open questions.** Recommended:
    - (i) D2's table in a new subsection of spec-001 §10 ("Precedence"), which says what `base`'s
      section states (§10 has no content guidance today; D7 names §10);
    - (ii) `tensions[].pack` takes §6.3's syntax with an optional `@<range>`, absent meaning every
      version, as `conflicts`;
    - (iii) dl-011 is `pending`: spec-002 states the "Combines with care" section and its index
      field only; the question at initialization goes to an Execution Note on dl-011;
    - (iv) §10 states that the table reaches an agent only once the project pastes the AGENTS.md
      region (§10's rule today), a known limit, no change.

## The approver's rulings

Given by the approver on 2026-11-05: every point of the outline as recommended, the departures of
points 4, 7 and 9 included.
1. **Point 1:** two plans; this one writes the texts only, no file under `schema/`, `index/` or
   `src/`; a `tooling-change` plan implements them.
2. **Point 2:** spec-001 and spec-002 amended in place, the merge OK approving the text.
3. **Point 3:** `pack.yaml`, `catalog.yaml` and `catalog-index.json` at format 2, the published packs
   at format 1, the catalog's new field absent in format 1; moving a pack to a new `pack.yaml` format
   is major.
4. **Point 4:** the `mcp` kind specified now, its tooling when a WingFoil release reads it.
5. **Point 5:** each finding in the row of the file it touches.
6. **Point 6:** one row per pack for the first-line class, at its next minor; the check in
   `pack-authoring`.
7. **Point 7:** one note by a content-only task on its own branch, merged into this plan's.
   Corrected by the approver on 2026-11-05: no note here; the `schema-note` lint (task-015) asks
   for the note generated with the schema change, so the `tooling-change` plan's schema task writes
   it (`npm run feedback:note -- --schema`); row 6 dropped.
8. **Point 8:** `dl/dl-024-dl-025-actions`; dl-039's checks once on the frozen head.
9. **Point 9:** this plan, then WingFoil UI's feedback plan, then the `tooling-change` plan.
10. **Point 10:** (i) … (iv) as written.

## Steps

On the branch `dl/dl-024-dl-025-actions`, from `main` at the commit that submits this plan; one
commit per row. Before every commit, the privacy check of `repository-practice` rule 2; after every
commit under `.wingfoil/` or `docs/memory/`, `npm run -s wingfoil -- workflow list` and
`npm run lint` exit 0.

| # | File | Change | Source |
|---|---|---|---|
| 1 | spec-001, the conditional part and `tensions` | §5 (`pack.yaml` and `catalog.yaml` at format 2, their frozen schemas named, the published packs at format 1, a reader picking the schema by `format`); §6.2 (`tensions` with §6.3's syntax and an optional range; the table's `conditional` row for format 2); §6.3's last bullet, §6.4, §6.5 generalised (several entries, `with` naming any pack composed earlier, the "Who" rule, isolation per entry, dl-026's "same part" rule per entry); §7.7, §8.1, §9, §10's sentence on `delivery`, §11 (format 2; the version entry's `pack.yaml` format, absent in format 1 reading as 1; `tensions` not copied), §12, §14 (the pre-swap step reads the exit-check directives of the conditional entries), §15, §17 (the tensions' notice), §18 (the lint per entry, D1's waiver heuristic with bridges exempt, D6's coverage); §7.1 and §16 O14 checked; the Execution Notes record the amendment | dl-025 D3, D4, D6, D7; findings 1 (ii), 2, 4, 6; points 3, 10 (ii) |
| 2 | spec-001, the `mcp` kind | §2, §5, §6.1, §6.2 (`formats`), §6.3 (a `phases` entry naming another pack's workflow extends the list of what a pack requires), §6.4 (`contents.fragments` admits `mcp` at format 2), a new §7.x (one owner per server, `restrictions`), §12 and `compat.yaml` (`mcp-servers` only when a release names the feature; `kinds` and `reads` with the deferred task), §17, §18 (the restriction notice not a refusal); the WingFoil side (D3, an adapter with `mcp.via: args`, D3 5 "a pack install or update"); the kind provisional and unshippable before a release reads it; the Execution Notes record the amendment and the deferral | dl-024 D1 … D6; findings 2 … 5; point 4 |
| 3 | spec-001 §10, "Precedence" | a new subsection: D2's table, the tie-break rule, classes by subject (1 … 3) and by pack or axis, a bridge's class, project `custom/` directives (never classes 1 … 3, never a pack directive's id), the escalation through `governance-evolution`, and that the table reaches an agent only once the project pastes the AGENTS.md region | dl-025 D2, D5; findings 3, 5, 6; point 10 (i), (iv) |
| 4 | spec-002 | §2.3 (the pasted server entry stays in section 3 until WingFoil reads the kind; a custom adapter under a name of its own, selected in `dna.yaml` › `team.agents` › `adapter`; CB-3); the "Combines with care" section and its index field (§2.1, §3.2, §3.3); the Composition section per conditional entry; `catalog-index.json` format 2 (§3.3); CB-8 unchanged; the Execution Notes record the amendment | dl-024 D5, D6, finding 1; dl-025 D3, D7, finding 2; points 3, 10 (iii) |
| 5 | `.wingfoil/directives/custom/pack-authoring.md` | dl-024 D1's rules and D4's catalog rule; dl-025 D1 (a directive only adds or tightens), D2 (the first line `Precedence: <class>` or `Precedence: law (<act>)` after the `# ` title, a class-1 or class-2 directive naming its law or standard), finding 5, finding 6's wording; the review list: the first line checked for any pack version prepared after this amendment | dl-024 D1, D4, finding 1; dl-025 D1, D2, D5, findings 3, 5, 6; point 6 |
| 6 | the feedback note | a content-only task, on its own branch from this one and merged into it: the note (the next free F number) on `pack.yaml` and `catalog.yaml` at format 2, the index's bump as information, naming the `tooling-change` plan's task, with its ledger row | `wingfoil-cli` rule 8; point 7 |
| 7 | dl-024, dl-025, dl-011; `docs/owed-items.md` | Execution Notes: dl-024 and dl-025 their actions applied or owed, with the commits, and dl-024's deferral of the `mcp` tooling (point 4); dl-011 the question at initialization that dl-025 D3 asks (point 10 (iii)). Rows: the `mcp` tooling (trigger a WingFoil release whose CHANGELOG names the feature); the `tooling-change` plan (trigger the close of WingFoil UI's feedback plan); the first-line class for `base`, `software`, `methodology/scrum`, `methodology/kanban` (trigger the next minor of each); dl-025 D7's halves (trigger the charters of `stage/prototype` and `stage/production`, W12); row 43's trigger to this plan's close | points 4, 6, 9, 10 (iii); dl-025 D7 |

Then, in dl-039 R2's order:
- **Leftovers:** a grep of `.wingfoil/`, `docs/` (outside `docs/memory/` except
  `docs/memory/tech-spec/`, outside `docs/plans/` and `docs/retrospectives/`), the READMEs and
  `packs/` for "at most one entry", "`software@^`", "format 1" and "conditional": every hit that
  contradicts the amended text goes to the approver, not edited here.
- **Review:** an independent review of the branch (dl-017), each row checked against its
  decision-log and findings; a re-review when a fix changes a rule.
- **Checks**, once, on the frozen head: its CI `success` (both jobs, run id and durations) and
  dl-039's local list on Node.js 22.21.0; `directives list --format json` with `"warnings": []`.
- **Branch close:** push; the privacy check of the branch's diff recorded; on the approver's OK,
  `--no-ff` merge into `main`, push, `main`'s CI on the merge read with its jobs' durations; the
  branches removed; the register's row "The dl actions of dl-024 and dl-025" to Closed at the close.

## Handoff

- **claude (facilitator):** every row and the branch close, except the approvals and the merge OK.
  It never runs `memory approve` or `memory reject`: it gives the approver the command, with `cd`
  and `--reason`. No pull request. Files staged by name; `docs/notes/` and `.idea/` stay untracked.
  Repository texts follow `repository-practice`.
- **Reviewers (subagents):** this plan; the amended specs and directive; the note's task; the
  branch; each re-review a fix that changes a decision needs (dl-017).
- **Approver:** the outline (before `submit`), with the departures of points 4, 7 and 9; the note
  task's gates; the merge OK, which approves the amended specs.
- Done when the texts are on `main`, reviewed, the branch CI and `main`'s run read `success`,
  dl-024 and dl-025 record their actions applied or owed, the register's row "The dl actions of
  dl-024 and dl-025" is Closed and its remainders (points 4, 6, 9 and dl-025 D7's last bullet) are
  rows of their own.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written as asked by the approver on 2026-11-04, after plan-062's close; `workflow`
  and `phase` filled by editing the draft (W-02). Next free numbers when written: plan-064,
  task-077, dl-041, bug-011, prel-007, F-043.
- 2026-11-05: independent review: approve after amendments, one blocking finding (point 3's reason
  and `catalog.yaml` and the index missing); applied with the others: one reason for the bump, the
  catalog, the index and `pack-semver`'s class (point 3); the Context's missing places (§6.3, the
  capability, D4's catalog rule, D7's last bullet, the catalog and index schemas); points 4, 7 and 9
  stated as departures; point 6's lint not gated on format 2, its class and the line's place; no
  file under `schema/` on this branch; point 10 for finding 6's open questions; dl-020 R3 by
  analogy; the Handoff.
- 2026-11-05: re-review: approve after amendments, nothing blocking; applied: the catalog's new
  field absent in format 1 (no published entry edited), `compat.yaml` with the deferred `mcp` task,
  "if WingFoil keeps the name", point 6's check in `pack-authoring` (no workflow change), the major
  class's cascade and the `stage/*` packs born at format 2, the index as information in the note,
  `tensions` not in the catalog, CB-8, D5's escalation in §10's subsection.
- 2026-11-05: rulings recorded (`59b2166`); submitted (`a663618`), `main` pushed; `main`'s CI on
  plan-062's close (`b3e7fcb`), run 42059337106, `success`, read in the Context; on the submit, read
  before the close. Rows 1 … 5: `6df2e95`, `fa565ed`, `9b7162a`, `72f0e5c`, `196e21b`; after each,
  `workflow list` and `npm run lint` exit 0 and the privacy check found nothing. Row 6 dropped
  (ruling 7 as corrected by the approver on 2026-11-05: the `schema-note` lint ties the note to the
  schema change). Row 7: the notes on dl-024, dl-025 and dl-011, seven rows of `docs/owed-items.md`
  (the `mcp` tooling, the `tooling-change` plan, the four packs' first line, D7's halves) and row
  43's trigger (the rows of rulings 4, 6 and 9 added here, not with the rulings' commit `59b2166`, a
  slip against dl-036 R2; ruling 7's correction and its outcome in this same commit).
- 2026-11-05: a row asked by the approver outside any element (dl-036 R4), cited here as the plan
  active on `main`: the automation of `wingfoil-release-intake` where safe, asked by the approver on
  2026-11-02, its own plan placed by the approver on 2026-11-05 after WingFoil UI's feedback plan
  and before this plan's `tooling-change` plan, whose row's trigger moves after it.
- 2026-11-05: independent review of the branch (`408d87e`): approve after amendments, nothing
  blocking; applied: the check before the swap reads the target composition and passes without
  `exit-check` directives only when no pack declares a tension with the stage being left (§6.5,
  §14); §6.2's example at format 2; §3's and §9's single-part wording; finding 6's bridge class, gap
  3's wording (§15) and the waiver heuristic in `pack-authoring`; a new pack written at format 2
  (§5; in `pack-authoring`, once the tooling reads it); `pack-semver`'s major list gains the move of
  `pack.yaml` to a new format (ruling 3, which spec-001 §5 cites); the nits (§18's fragment order,
  §6.2's `formats` and §12's `mcp-servers`, §7.8's illustrative example and `access`, "left out in
  turn", dl-024's note, spec-002's note on "Combines with care", row 43's Source). Leftovers:
  `pack-compatibility`'s bullet on a conditional part ("with and without `software`") goes to the
  `tooling-change` plan's row with the code it describes, to be confirmed by the approver at the
  merge OK; the bridge exemption of §18 does not cover a bridge whose `with` is a common pack the
  stricter packs require (finding 6 as written), noted here.
- 2026-11-05: re-review: approve after one fix (§7.8's example's indentation), applied with the
  alignment of §5 and `pack-authoring` (a new pack at format 2 once the reference composer reads it,
  until then at format 1) and the nits (§14's pointer to §6.5, gap 3's axes, row 43's order). Open,
  for the `tooling-change` plan or the first stage charter: with several stricter packs, whether the
  check before the swap fails when one of them has no `exit-check` directive, which a tag alone
  cannot tell.
- 2026-11-05: checks (ruling 8, dl-039 R1 and R2), once, on the frozen head `c0b5067`: the branch
  CI, run 42066442833, `success`, jobs Node.js 22.12.0 20 min 38 s and 22.21.0 15 min 52 s (none
  over 25 minutes), no warning annotation; from a clean working tree of `c0b5067` on Node.js
  22.21.0: `npm ci`, `npm run build`, `npm run validate:publication`, the golden tree in
  publication mode and `npm run -s wingfoil -- workflow list` exit 0; `directives list --format
  json` exits 0 with `"warnings": []`. This commit changes only `docs/plans`, after the checks'
  head: no new run (dl-039 R2). Privacy check of the branch's diff (`a663618...c0b5067`) and
  messages: no local or scratch path, no private project, no intermediary session.
