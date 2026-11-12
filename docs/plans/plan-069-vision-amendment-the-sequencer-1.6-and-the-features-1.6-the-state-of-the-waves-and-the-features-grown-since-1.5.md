---
id: plan-069-vision-amendment-the-sequencer-1.6-and-the-features-1.6-the-state-of-the-waves-and-the-features-grown-since-1.5
type: plan
title: "Vision amendment: the sequencer 1.6 and the features 1.6, the state of the waves and the features grown since 1.5"
status: draft
workflow: "sw-life-cycle"
phase: "inception"
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
plan-040 and plan-067 reopened `specification`; plan-038 and plan-052 amended the vision documents
from their own hosts (`decision-log-ingest` › `rule`, `pack-cycle` › `first-release`).

**How:** both documents edited in place, their version raised to 1.6 with the date of the merge,
a line in each one's decisions section listing the amendment. The approver's OK on the tables
below and the merge OK approve the text. Text only: no code, test, configuration or generated
file changes.

**The sequencer, 1.6:**

| Section | Change | Source |
|---|---|---|
| a new section "State of the waves" (after "Milestones at a glance") | one line per wave, with its state on the merge's date and the element that closed it: W1 … W4 done (plan-012), W5 … W7 done (plan-015), W14 done (plan-024), W8 done (plan-046, closing plan-041 … plan-047), W9 done (plan-052; prel-003 … prel-005), W10 in progress (`methodology/kanban` done, plan-058, prel-006; presets, `governance/wingfoil-dogfood`, the adoption, the pin raised from 0.2.2 and the first inbox sync not started; dl-012, `pending`, would place F4.9 in W10, at its three-feature limit, left to dl-012's ruling), W11 … W13 not started; M0, M1 and M2 reached, M3 open. The releases outside a wave's close: `base` 1.0.0 within W8 (plan-044, prel-001) and `base` 2.0.0 between W8 and W9 (plan-049, prel-002) | the elements named |
| the same section | the work outside the waves, as amendments of features already sequenced and not new waves: the format 2 (`tensions`, the conditional part per entry, the `mcp` kind provisional; dl-024, dl-025, plan-063, plan-066, plan-067) amending F1.1, F1.2, F1.5, F1.6, F2.1, F2.8 and F3.5; the `delivery` contract of a methodology (dl-026, dl-027, plan-047, plan-048) amending F1.4 and F3.5; the intake automated (plan-065) amending F5.2; the CI sharded (plan-068) under F3.6 | the plans named |
| Notes, a new bullet | W8 holds four features (F4.1, F4.8, F6.2, F1.6), one over the rule of three: `software` joined W8 with dl-022 (sequencer 1.4, plan-038), and W8 closed so (plan-046); kept as a recorded exception, not split after the fact | the row "Sequencer: W8 has four features" (plan-052 › step 2) |
| Notes, "The first publication …" | "so nothing is published before W9" corrected: `base` 1.0.0 was published within W8 (plan-044) and 2.0.0 after it (plan-049), the first publication of `software` and a methodology staying W9's | prel-001, prel-002 |
| Notes, "Tooling tasks have no workflow host" | the bullet replaced by its answer: the `tooling` phase of `sw-life-cycle` and `tooling-change`, as the sequencer review decided (2026-10-06, decision 2) | the sequencer's decisions, 2 |
| Notes, a new bullet | W10's order after this amendment, as the approver set it on 2026-11-12: W10's remaining features, then a pack release round (bug-011 … bug-015's fixes, the `Precedence:` lines, the Memory templates' optional fields, the CHANGELOG's first line checked), then the periodic retrospective | the approver, 2026-11-12 |
| Decisions | "Amendment 1.6 (2026-11-12)", one line, the first amendment recorded there (1.1 … 1.5 are in the git history) | this plan |

**The features, 1.6:**

| Feature | Change | Source |
|---|---|---|
| F1.1 | at format 2 the manifest gains `tensions` and the conditional part per entry, each entry with its `with` | spec-001 §6.2, §6.5 (plan-063, plan-066) |
| F1.2 | the fragments gain the `mcp` kind, provisional until a released WingFoil reads it (its tooling owed) | spec-001 §7.8, O16; dl-024 |
| F1.4 | a methodology's `delivery` includes both `release` and `retrospective`, directly or through its own sub-workflows, and the phase including `release` iterates over the releases in development or releasing | dl-026 D1, D2; dl-027 D1 (plan-047, plan-048) |
| F1.5 | `pack.yaml` and `catalog.yaml` at format 2, the v1 schemas frozen, the schema chosen by the file's `format` | spec-001 §5 (plan-063, plan-066) |
| F1.6 | `base`'s section states the precedence of the directives' classes, and each directive's first line its class | spec-001 §10.1; dl-025 D2 (plan-063) |
| F2.1 | `catalog.yaml` at format 2: a version entry records `pack_format` and copies the conditional entries | spec-001 §11 (plan-066) |
| F2.8 | the index and the READMEs at format 2: `conditional_parts`, `tensions`, `pack_format`, "Combines with care" | spec-002 §2.1, §3.2, §3.3 (plan-066, plan-067) |
| F3.3 | `check:runs`, with a scenario for every `main`, and the adoption run once per `init` template for a pack with install steps (dl-032 E3), beside `workflow list`, `dna show` and `directives list` | the row "`06_features.md` 1.5 → 1.6" |
| F3.5 | the lint per entry and by format, the declared tensions' coverage, the waiver wording as a review list, a methodology's `delivery` includes (`life-cycle-includes`) | spec-001 §18; dl-025 D1, D6; dl-026 D3; plan-066 ruling 4 |
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
4. **Checks** on the frozen commit, for a text-only change: the branch CI, its job durations
   recorded (dl-039 R3, G12); `git diff main --stat` naming only the two documents; the privacy
   check of the branch's diff (repository-practice rule 2: no local or scratch path, no private
   project, no session). dl-039 R1's local list is for tooling and pack tasks and is not run.
5. **The approver's merge OK;** merged `--no-ff`, pushed, `main`'s CI read; the two rows to
   Closed; `active → done`.

## Handoff

- **The approver:** the OK on the two tables (step 1), including the W8 exception kept rather than
  split; the merge OK (step 5).
- **Alone:** the edits, the checks, the rows, the notes; the reviews of steps 1 and 3 by an
  independent reviewer (a subagent with no part in the text). No `memory approve`, no pull
  request; files staged by name.
- **Done when:** both documents at 1.6 on `main`, every change of the tables applied and no other,
  `main`'s CI green, the two rows Closed.

## Execution Notes

- 2026-11-12: review: approve after amendments, three blocking, applied: W8 closed by plan-046
  alone, `base` 1.0.0 published within W8 (plan-044) and 2.0.0 between W8 and W9 (plan-049), the
  sequencer's note corrected; the features table with F1.4, F1.5, F1.6 and F2.1 and F3.5's
  `delivery` includes; the precedent plan-040 and plan-067; with the nits: the checks of a
  text-only change, the Decisions line the first recorded, dl-012 named in W10's state, the stale
  note on tooling's host replaced, the reviewers in the Handoff.
- 2026-11-12: re-review: approve, two nits, applied: the features rows in F-number order, F1.4
  "directly or through its own sub-workflows" (dl-026 D1).
- 2026-11-12: the approver's OK on both tables as written, the W8 exception kept rather than split.
- 2026-11-12: `main`'s CI before this plan (dl-038 C3), on `69f6bfea` (plan-068's close, the owed
  row on dl-024 and dl-025 Closed, task-089's `submit` and this plan's body), run 43230493794,
  `success`: `validate (22.12.0, 1)` 6 min 41 s, `(22.12.0, 2)` 6 min 4 s, `(22.21.0, 1)` 7 min
  41 s, `(22.21.0, 2)` 8 min 38 s.
