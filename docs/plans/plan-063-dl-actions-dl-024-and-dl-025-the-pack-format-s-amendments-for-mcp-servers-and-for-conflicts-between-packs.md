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
- **spec-001:** dl-024's `mcp` kind (§2, §5, §6.1, §6.2 `formats`, §6.4, a new §7.x for D2's merge,
  §12 and `compat.yaml`'s `kinds` and `reads`, §17's composition notice, §18's lint, the
  restriction notice not a refusal); dl-025's `tensions` key (§6.2), §6.5's conditional part
  generalised (several entries, `with` naming any pack composed earlier, the "Who" rule, isolation
  per entry, dl-026's "same part" rule per entry) and every place the part reaches (§6.3, §6.4,
  §7.7, §8.1, §11, §12, §15, §17, §18), D2's precedence table in §10's guidance for `base`'s
  section; finding 1 (ii): the target stage's pre-swap step reads the exit-check directives the
  conditional entries ship;
- **spec-002:** a pasted server entry kept in section 3 until WingFoil reads the kind (§2.3, CB-3);
  the "Combines with care" section and its index field; the Composition section per conditional
  entry;
- **`schema/`:** `pack.schema.json` (`contents.fragments`, `tensions`, `conditional`) and a new
  fragment schema for `mcp`, with the feedback note `wingfoil-cli` rule 8 requires;
- **`pack-authoring`:** dl-024 D1's rules; dl-025 D1's directive rule, D2's first-line class and
  the named law or standard; finding 5 (a `custom/` directive never reuses a pack directive's id);
- **the F3.5 lint and the composer:** dl-024 D2's rules and merge; dl-025 D1's heuristic (finding 6:
  bridges exempt), D3's notice and D6's coverage (each conditional entry composed with and without
  its `with` pack);
- **dl-025 D5:** escalation to a `custom/` directive through `governance-evolution` (finding 3).

**spec-001 and spec-002 are approved.** These are not errata (dl-020 R1 … R3 fold back what a wave
finds wrong); they are approved decisions that change the format, as dl-022, dl-026 and dl-027
were, each applied by amending spec-001 in place, the decision-log's approval and the merge OK
approving the text (spec-001 › Execution Notes, 2026-10-26). No erratum of either is open: spec-002's
of W14 were folded back by plan-031, spec-001's of 2026-10-13 and 2026-10-14 by their amendments.

**What changed since they were written:** four packs are published (`base`, `software`,
`methodology/scrum`, `methodology/kanban`), and spec-001 §5 says that from the first publication a
backward-incompatible change of `pack.yaml` bumps its format; §6.2 allows "at most one entry in
format 1" in `conditional`. No WingFoil release reads an `mcp` kind (dl-024 D2: no pack can ship
it), and no pack or stage overlay declares a tension yet (`stage/*` are W12).

**`main`'s CI before this plan** (dl-038 C3): plan-062's last push, `b3e7fcb` (its close and
`active → done`), CI run 42059337106, read here when it completes.

**Not in this plan:** WingFoil UI's feedback (row 43); the packs' own changes that the rules ask of
published content (point 6); WingFoil's side (F-035, already on `main`); amending any approved body
(each change is an Execution Note).

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **One plan or two.** Recommended: two. This plan writes the texts, on one branch, one commit per
   row: spec-001 and spec-002 amended in place, `pack-authoring`, the frozen and new schemas' text
   only where a spec defines them, the notes; a separate `tooling-change` plan, after this one
   closes, implements them in tasks (`tooling-delivery` v3, red first, dl-039's checks): `schema/`,
   the composer, the F3.5 lint, the index and README generators, the coverage. Reasons: the specs
   are the contract the tooling is checked against, so they are approved first (as spec-001 before
   the `tooling` phase); the tooling is several tasks under WIP 1, which a `tooling-change` plan
   hosts (its `deliver` iterates tasks); one branch holding both would carry weeks of work under one
   merge.
2. **The amendment's mechanism.** Recommended: in place, as dl-022, dl-026 and dl-027: an
   independent review of the amended text against the decision-logs and findings (dl-017), a
   re-review when a fix changes a rule, the merge OK approving it; each spec's Execution Notes
   record the amendment with its sources. dl-020 does not apply (no erratum); its R3 applies to the
   `tooling-change` plan, which names spec-001 and spec-002 and their state in its Context.
3. **`pack.yaml` format 2.** Recommended: yes, for the conditional part (several entries, `with`
   naming any pack composed earlier): a format-1 reader refuses a second entry and a `with` other
   than `software`, so the change is backward-incompatible (§5, dl-149's rule). `tensions` is an
   optional key, compatible, and enters with format 2 in the same bump. The published packs stay at
   format 1, and the composer reads both formats; `schema/pack.v1.schema.json` is the frozen copy
   (§5); a feedback note (point 7). Alternative: no bump, read as a format-1 extension (rejected:
   §5's rule applies since the first publication).
4. **The `mcp` kind: specified now, implemented when a WingFoil release reads it.** Recommended:
   spec-001 and spec-002 state the kind, its merge, its lint and the interim (dl-024 D5) now, with
   the name provisional as D2 says; the tooling task for the kind (schema, merge, lint) waits for a
   released WingFoil that reads it, a row of `docs/owed-items.md` (owner approver, trigger: a
   WingFoil release whose CHANGELOG names it, dl-024 D3), since no pack can ship it before then and
   WingFoil names the kind. Alternative: implement it now in the `tooling-change` plan (dl-024 D6
   read literally), code no pack can use and a name that may change.
5. **The review findings' places.** Recommended, as ruled on 2026-11-03: dl-024's findings 1 (the
   custom adapter's name, in spec-002 §2.3's interim and `pack-authoring`), 2 (D6's missing spec-001
   places), 3 (an adapter with `mcp.via: args`, in the spec's WingFoil-side paragraph), 4 (the
   extension of §6.3's list, not an exception) and 5 (D3 5 "a pack install or update"); dl-025's
   findings 1 (ii), 2 (D7's missing places), 3 (`governance-evolution`), 4 (dl-026's rule per
   entry), 5 (`custom/` ids) and 6 (the nits), each in the row whose file it touches.
6. **The packs' own changes.** dl-025 D2 asks every directive to state its class on its first line,
   and `base`'s AGENTS.md section to state the table: published content, so a release of each pack.
   Recommended: not in this plan nor in the `tooling-change` plan; one row of `docs/owed-items.md`
   per pack (owner approver, trigger the next minor release of that pack), with the lint of the
   first line enabled only for a pack at format 2. Alternative: four pack releases now.
7. **The feedback note.** Recommended: one note (the next free F number) for the `schema/` change
   (`wingfoil-cli` rule 8): `pack.yaml` format 2 (`tensions`, the conditional part), written by a
   content-only task (`tooling-delivery`, dl-039 R1) hosted on this plan's branch, with its ledger
   row; the `mcp` fragment schema's note at its own task (point 4). F-035 already asks WingFoil for
   the MCP side.
8. **Branch, checks and pushes.** Recommended: this plan on `main`; the work on
   `dl/dl-024-dl-025-actions`; after each commit `workflow list` and `npm run lint` exit 0; the
   checks once on the frozen head (the branch CI and dl-039's local list, by plan-062 ruling 4's
   reading); `main` pushed at `submit`, at the merge and once at the close.
9. **The order with WingFoil UI's feedback** (row 43, whose trigger is this plan). Recommended: the
   `tooling-change` plan of point 1 after WingFoil UI's feedback plan, which is capture only and has
   waited since 2026-11-02; the order is the approver's (dl-038 D1 placed only this plan).

## The approver's rulings

<!-- Filled when the approver rules the outline. -->

## Steps

<!-- Written after the rulings: one row per file (spec-001 by section groups, spec-002,
     pack-authoring, the note's task, the notes on dl-024 and dl-025, the register), as plan-062. -->

## Handoff

- **claude (facilitator):** every row and the branch close, except the approvals and the merge OK.
  It never runs `memory approve` or `memory reject`: it gives the approver the command, with `cd`
  and `--reason`. No pull request. Files staged by name. Repository texts follow
  `repository-practice`.
- **Reviewers (subagents):** this plan; the amended specs and directive; the note's task; the
  branch; each re-review a fix that changes a decision needs (dl-017).
- **Approver:** the outline (before `submit`); the note task's gates; the merge OK, which approves
  the amended specs.
- Done when the texts are on `main`, reviewed, with their checks, dl-024 and dl-025 record their
  actions applied or owed, and the register's row is Closed, its remainder in rows of their own.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written as asked by the approver on 2026-11-04, after plan-062's close; `workflow`
  and `phase` filled by editing the draft (W-02). Next free numbers when written: plan-064,
  task-077, dl-041, bug-011, prel-007, F-043.
