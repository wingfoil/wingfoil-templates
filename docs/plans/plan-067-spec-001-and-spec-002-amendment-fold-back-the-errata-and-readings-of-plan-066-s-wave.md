---
id: plan-067-spec-001-and-spec-002-amendment-fold-back-the-errata-and-readings-of-plan-066-s-wave
type: plan
title: "spec-001 and spec-002 amendment: fold back the errata and readings of plan-066's wave"
status: draft
workflow: "sw-life-cycle"
phase: "specification"
tags: ["spec","format-2"]
---

## Context

The element plan-066's wave close named (dl-020, the approver's ruling of 2026-11-11): it folds
back into spec-001's and spec-002's bodies the erratum and the readings of plan-066's wave, which
their Execution Notes record (2026-11-11), and the stale parenthetical on the format-1 exception
that task-088 settled (plan-066's close). The row "A plan amending spec-001 and spec-002 in place
with plan-066's wave close" of `docs/owed-items.md`, trigger "after plan-066's close", which came
on 2026-11-11. Hosted by `sw-life-cycle` › `specification`, which produces tech-specs, reopened
for this amendment only, as plan-031 and plan-032 did.

**How:** both tech-specs keep their ids and `approved`, their bodies edited in place under this
plan (option (b), as plan-031, plan-032 and plan-063); the approver's OK on the table below and
the merge OK approve the text, and each tech-spec's Execution Notes list the changes. Text only:
the tooling already follows every row (task-083 … task-088), so no code, test or generated file
changes.

**The changes** (each from a ruling or an erratum already recorded):

| Element | Section | Change | Source |
|---|---|---|---|
| spec-001 | §5 | "A new pack is written at format 2 once the reference composer reads it (until then at format 1, a temporary exception, `docs/owed-items.md`)" becomes "A new pack is written at format 2, which the reference composer reads (plan-066)" | plan-066 ruling 8, close; task-088 |
| spec-001 | §6.5, `with` | "composed earlier than the pack (§7.1)" read statically, as the lint checks it: `software` is earlier than every non-foundation pack; a pack of another axis when its axis comes earlier in `catalog.yaml`'s `axes`; within `phase`, a pack of an earlier slot; a pack of the pack's own axis is refused (of an axis of cardinality one, or of the same slot, it never composes with the pack; of an axis of cardinality many, Kahn's order guarantees no order) | task-085 ruling 1 |
| spec-001 | §6.5, one owner; §15 | a composition of §15's coverage that §3's cardinalities or §6.3's conflicts forbid (two methodologies, two packs of an axis taking one or of one slot, a conflict either way) is skipped with its line, not failed; an entry whose pack cannot join a given composition is covered by a documented composition (a preset or a README example) holding the pack and the entry's pack (plan-039 R6) | task-087 ruling 3 |
| spec-001 | §18, `conditional` | "each `with` naming a catalog pack composed earlier (§7.1)" becomes "each `with` naming a pack directory of the tree (`packs/<id>/`) composed earlier, read as §6.5 says", since `catalog.yaml` lists only published packs | task-085 Acceptance 2 |
| spec-001 | §18, waiver wording | the four phrases matched as whole words with their inflections, on the directive's body, one hit per line; printed by `npm run check:packs` as a review list, its exit unchanged, read at `pack-release-cycle` › `prepare` | plan-066 ruling 4; task-086 rulings 1, 2 |
| spec-002 | §3.3, `pack_format` | "(`1` when the catalog entry has none, spec-001 §11)" becomes "(`1` when it has no `format`, spec-001 §5; `npm run check:packs` keeps the catalog version entry's `pack_format` equal to it, spec-001 §11)" | task-088 ruling 1 (erratum) |
| spec-002 | §3.2, Summary | the marks of several entries in one parenthesis, joined by `; `; "Combines with care" after it, one space before, each pack by its id without its range, sorted and once, with no full stop after the last | task-088 rulings 2, 4 |
| spec-002 | §2.1, Composition | "a line `Combines with care:`" becomes the list's last bullet, after **Declares** (or after **Requires capabilities** for a pack with no **Declares**), its items nested, each resolution on one line | task-088 ruling 3 |
| `pack-authoring` | format 2 | "(until then at format 1, spec-001 §5)" dropped, as spec-001 §5's row | plan-066 close |

Not in this plan: any code, test or generated file; the `mcp` kind's tooling (its row); the rows of
plan-066 point 7 (the first `stage/*` charter); the CI's margin under G12's 25 minutes (its row).

**`main`'s CI before this plan** (dl-038 C3): plan-066's close, `ed9b22b0`, its run read in the
Execution Notes before `submit`.

## Steps

On the branch `spec/plan-066-wave-amendment`, from `main` at this plan's `submit`.

1. **claude (architect):** the rows of the table in spec-001's and spec-002's bodies, nothing else;
   an Execution Note in each listing its changes, with this plan, its sources and the approver's
   OK. One commit per tech-spec (`docs(spec)`).
2. **claude:** `pack-authoring`'s row, its own commit (`wf(config)`).
3. **claude:** checks: `npm test` (`tests/root-readme.test.ts` links both tech-specs by path),
   `npm run lint`, `npm run index -- --check`, `npm run validate` and `npm run -s wingfoil --
   directives list --format json` (`warnings []`) exit 0; `git diff main` limited to the table's
   sections and the Execution Notes.
4. **claude:** an independent review of the amendment against each source (dl-017), its findings
   fixed, a re-review when a fix changes a rule.
5. **Branch close:** push, the branch CI's run and both jobs' durations recorded here (G12); on the
   approver's OK, `--no-ff` merge into `main`, push, `main`'s CI read, the branch removed; the row
   moved to Closed in the same commit as the close note; `active → done`.

## Handoff

- **claude:** steps 1 … 5, except the approvals and the merge OK. It never runs `memory approve`
  or `memory reject`. No pull request. Files staged by name.
- **Reviewers (subagents):** this plan, before `submit`; the amendment (step 4).
- **Approver:** the table, before `submit`; the merge OK, which approves the edited texts.
- Done when the amended texts are on `main`, pushed, `main`'s CI on the merge read `success`, and
  the row Closed. The run of the close's push is left to the next plan (dl-038 C3).

## Execution Notes

<!-- Filled while the plan runs: deviations, blockers, decisions taken, WingFoil friction
     (also recorded in docs/wingfoil-feedback/). At wave close: per tech-spec, the errata and
     rulings recorded in the wave, and the element the approver names to fold them back, or the
     ruling that none is needed (dl-020).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-11: written; `workflow` and `phase` filled by editing the draft (W-02).
