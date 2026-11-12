---
id: plan-069-vision-amendment-the-sequencer-1.6-and-the-features-1.6-the-state-of-the-waves-and-the-features-grown-since-1.5
type: plan
title: "Vision amendment: the sequencer 1.6 and the features 1.6, the state of the waves and the features grown since 1.5"
status: draft
workflow: ""
phase: ""
tags: ["vision","sequencer"]
---

## Context

The sequencer (`docs/01_vision/07_sequencer.md`) is at 1.5 of 2026-10-28 and the features
(`docs/01_vision/06_features.md`) at 1.5 of 2026-10-15. Since then W9 closed (plan-052), W10
started (`methodology/kanban` 1.0.0, plan-058, prel-006) and seven plans grew the format and the
tooling (plan-062 … plan-068), but neither file says so: the sequencer gives no wave's state, and
the features still describe the format, the lint and the intake as 1.5 wrote them. Two rows of
`docs/owed-items.md` wait for this: "Sequencer: W8 has four features" (trigger "the sequencer's
next review") and "`docs/01_vision/06_features.md` 1.5 → 1.6" (trigger "the next plan that
changes the documentation"). The approver asked on 2026-11-12 for this amendment before W10
goes on, and set the order after it: W10, then the pack release round, then the periodic
retrospective. Hosted by `sw-life-cycle` › `inception`, which produces the vision documents
(`templates-inception` › `features` and `sequencer`), reopened for this amendment only, as
plan-038 and plan-052 did.

**How:** both documents edited in place, their version raised to 1.6 with the date of the merge,
a line in each one's decisions section listing the amendment. The approver's OK on the tables
below and the merge OK approve the text. Text only: no code, test, configuration or generated
file changes.

**The sequencer, 1.6:**

| Section | Change | Source |
|---|---|---|
| a new section "State of the waves" (after "Milestones at a glance") | one line per wave, with its state on the merge's date and the element that closed it: W1 … W4 done (plan-012), W5 … W7 done (plan-015), W14 done (plan-024), W8 done (plan-046; prel-001, prel-002), W9 done (plan-052; prel-003 … prel-005), W10 in progress (`methodology/kanban` done, plan-058, prel-006; presets, `governance/wingfoil-dogfood`, the adoption, the pin raised from 0.2.2 and the first inbox sync not started), W11 … W13 not started; M0, M1 and M2 reached, M3 open | the elements named |
| the same section | the work outside the waves, as amendments of features already sequenced and not new waves: the format 2 (`tensions`, the conditional part per entry, the `mcp` kind provisional; dl-024, dl-025, plan-063, plan-066, plan-067) amending F1.1, F1.2, F2.8 and F3.5; the intake automated (plan-065) amending F5.2; the CI sharded (plan-068) under F3.6 | the plans named |
| Notes, a new bullet | W8 holds four features (F4.1, F4.8, F6.2, F1.6), one over the rule of three: `software` joined W8 with dl-022 (sequencer 1.4, plan-038), and W8 closed so (plan-046); kept as a recorded exception, not split after the fact | the row "Sequencer: W8 has four features" (plan-052 › step 2) |
| Notes, a new bullet | W10's order after this amendment, as the approver set it on 2026-11-12: W10's remaining features, then a pack release round (bug-011 … bug-015's fixes, the `Precedence:` lines, the Memory templates' optional fields, the CHANGELOG's first line checked), then the periodic retrospective | the approver, 2026-11-12 |
| Decisions | "Amendment 1.6 (2026-11-12)", one line | this plan |

**The features, 1.6:**

| Feature | Change | Source |
|---|---|---|
| F1.1 | the manifest gains its `format` (1 or 2) and, at format 2, `tensions` and the conditional part per entry, each entry with its `with` | spec-001 §5, §6.2, §6.5 (plan-063, plan-066) |
| F1.2 | the fragments gain the `mcp` kind, provisional until a released WingFoil reads it (its tooling owed) | spec-001 §7.8, O16; dl-024 |
| F2.8 | the index and the READMEs at format 2: `conditional_parts`, `tensions`, `pack_format`, "Combines with care" | spec-002 §2.1, §3.2, §3.3 (plan-066, plan-067) |
| F3.3 | `check:runs`, with a scenario for every `main`, and the adoption run once per `init` template for a pack with install steps (dl-032 E3), beside `workflow list`, `dna show` and `directives list` | the row "`06_features.md` 1.5 → 1.6" |
| F3.5 | the lint per entry and by format, the declared tensions' coverage, the waiver wording as a review list | spec-001 §18; dl-025 D1, D6; plan-066 ruling 4 |
| F5.2 | `wingfoil-release-intake` starts the periodic retrospective at its close (`retrospective-start`, dl-029); a daily detection (`intake.yml`), a prepared patch (`intake:prepare`) and a verified or guided report | the row "`06_features.md` 1.5 → 1.6"; dl-042, plan-065 |
| Decisions | "Amendment 1.6 (2026-11-12)", one line | this plan |

Not in this plan: the order or content of W10's remaining features (presets, `governance/
wingfoil-dogfood`, the adoption), which their own plans set; a feature's Value, Effort or
Uncertainty; any other vision document; any code, test or generated file.

**`main`'s CI before this plan** (dl-038 C3): plan-068's close (`738c8c0e`, `a53aaaea`), the owed
row on dl-024 and dl-025 Closed (`236134f6`) and task-089's `submit` (`e6cda007`), pushed with
this plan's body, their run read in the Execution Notes before `submit`.

## Steps

1. **This plan:** an independent review and a re-review if a fix changes a row (dl-017); the tables
   shown to the approver; the approver's OK; `submit` (`draft → active`). Role: product-owner.
2. **The amendment** on the branch `vision/plan-069-sequencer-features-1.6`, from `main` at this
   plan's `submit`: the sequencer 1.6, then the features 1.6, one commit each, every claim of the
   "State of the waves" checked against the element it cites. Role: product-owner.
3. **The branch's review:** an independent review of the diff against the tables above; its
   amendments, re-reviewed if they change a row.
4. **Checks** on the frozen commit (dl-039): the branch CI and the local list (`validate:
   publication`, the golden tree in publication mode, `workflow list`) on Node 22.21.0.
5. **The approver's merge OK;** merged `--no-ff`, pushed, `main`'s CI read; the two rows to
   Closed; `active → done`.

## Handoff

- **The approver:** the OK on the two tables (step 1), including the W8 exception kept rather than
  split; the merge OK (step 5).
- **Alone:** the reviews, the edits, the checks, the rows, the notes.
- **Done when:** both documents at 1.6 on `main`, every change of the tables applied and no other,
  `main`'s CI green, the two rows Closed.

## Execution Notes

