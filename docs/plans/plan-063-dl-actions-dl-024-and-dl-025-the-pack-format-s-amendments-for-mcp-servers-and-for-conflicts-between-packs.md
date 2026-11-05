---
id: plan-063-dl-actions-dl-024-and-dl-025-the-pack-format-s-amendments-for-mcp-servers-and-for-conflicts-between-packs
type: plan
title: "dl actions: dl-024 and dl-025, the pack format's amendments for MCP servers and for conflicts between packs"
status: draft
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
`active → done`), CI run 42059337106, read and recorded here before `submit`.

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
     `catalog.v1`; each version entry also records its `pack.yaml` format, so that a resolver
     decides from the catalog alone (§11);
   - `catalog-index.json` format 2 (spec-002 §3.3), with its schema's frozen copy;
   - `pack-semver`: moving a pack's `pack.yaml` to a new format is **major** (a reader of the old
     format cannot read the new version; "in doubt, take the higher"), so a pack moves only when it
     needs format 2's keys; the class is the approver's.
4. **The `mcp` kind: specified now, its tooling when a WingFoil release reads it** (a departure from
   dl-024 D6, which lists `schema/`'s fragment schema and the F3.5 lint's D2 rules among the changes
   after approval). Recommended: spec-001 and spec-002 state the kind, its merge, its lint and the
   interim (dl-024 D5) now, the name provisional (D2); format 2's `pack.yaml` schema admits `mcp` in
   `contents.fragments` and `formats` (so a later reader needs no format 3), unshippable through
   §12's empty range; the fragment schema, the merge and the lint wait for a released WingFoil that
   reads the kind and names it. Recorded in dl-024's notes; the register's row split, the remainder
   a row of its own (owner approver, trigger: a WingFoil release whose CHANGELOG names the feature,
   dl-024 D3). Alternative: all of it in the `tooling-change` plan (D6 as written): a first fragment
   schema and code no pack can use, under a name that may change.
5. **The review findings' places**, as ruled on 2026-11-03, each in the row whose file it touches:
   dl-024's 1 (spec-002 §2.3 and `pack-authoring`), 2 (spec-001's places above), 3 (spec-001's
   WingFoil-side paragraph), 4 (§6.3), 5 (spec-001, D3 5's wording); dl-025's 1 (ii) (§14), 2 (the
   places above), 3 (`pack-authoring` and spec-001 §10: escalation through `governance-evolution`),
   4 (§6.5, §9, §18), 5 (`pack-authoring`), 6 (the nits: the waiver heuristic's exemption in §18 and
   `pack-authoring`; gap 3's wording, "the highest class among the S directives", "by pack or axis"
   in `pack-authoring`; the other three in point 10). Bodies stay as approved.
6. **The packs' own changes.** dl-025 D2 asks every directive to state its class on its first line,
   and `base`'s AGENTS.md section to state the table: published content, a release of each pack.
   Recommended: one row of `docs/owed-items.md` per pack (owner approver, trigger the next minor
   release of that pack, the change classed **minor**: content added, not wording only), the check
   part of `pack-release-cycle` › `prepare` for any version prepared after this amendment (not gated
   on format 2, which these packs need not take); `pack-authoring` defines the first line's place
   (the line after the `# ` title, `Precedence: <class>` or `Precedence: law (<act>)`); WingFoil's
   built-in directives cannot carry it and rely on `base`'s table. D7 itself lists only
   `pack-authoring`. Alternative: four pack releases now.
7. **The feedback note** (a departure from `tooling-delivery` › `deliver`, as plan-062 ruling 3).
   Recommended: one note, the next free F number, for the `schema/` change (`wingfoil-cli` rule 8):
   `pack.yaml`, `catalog.yaml` and `catalog-index.json` at format 2 (point 3); written by a
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

<!-- Filled when the approver rules the outline. -->

## Steps

<!-- Written after the rulings: one row per file (spec-001 by section groups, spec-002,
     pack-authoring, the note's task, the notes on dl-024 and dl-025, the register), as plan-062.
     -->

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
