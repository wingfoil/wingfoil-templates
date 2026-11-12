---
id: plan-071-vision-amendment-dl-011-dl-012-and-dl-013-s-follow-up-features-1.7-journeys-1.4-sequencer-1.7-and-the-mvp-canvas-1.5
type: plan
title: "Vision amendment: dl-011, dl-012 and dl-013's follow-up, features 1.7, journeys 1.4, sequencer 1.7 and the MVP canvas 1.5"
status: draft
workflow: "sw-life-cycle"
phase: "inception"
tags: ["vision","sequencer"]
---

## Context

The follow-up plan of plan-020 (its Handoff): dl-011, dl-012 and dl-013, approved on 2026-11-12
(`3d1abacc`, `d46da723`, `e7c1a9a5`), each list the amendments their approval implies (dl-012
D6, dl-011 D8, dl-013 D10), applied "under the follow-up plan of plan-020, each document bumped
per `doc-versioning`". The row "The follow-up plan of plan-020" of `docs/owed-items.md` (trigger
"before `governance/feedback`'s charter (W10), after plan-070") and the row "dl-012's F4.9
placement" wait for it. Hosted by `sw-life-cycle` › `inception`, which produces the vision
documents, reopened as plan-069 did.

**How:** the vision documents edited in place, each version raised with the merge's date and a
line in its decisions section; Execution Notes on dl-001 and dl-003 (both stay as approved). The
approver's three approvals approve the content; the OK on the table below and the merge OK
approve the text. Text only: no code, test, configuration or generated file changes.

**The changes** (each from the dl it cites):

| Document | Change | Source |
|---|---|---|
| `06_features.md` 1.6 → 1.7 | F4.9 "`governance/feedback`: installable, configurable feedback capture, triage and routing into the governance" (J5, J10; H, M, **H**); F4.10 "`governance/guided-init`: one guided workflow from intent to a reconfigured WingFoil, for any governed project, with the `bootstrap` preset" (J10; H, M, **H**); F4.11 "`methodology/directive-first`: directives drive methodology, workflows, agents and verification" (J5, J6, J10; H, H, **H**); F4.2 gains "built on F4.9"; the review notes' high-uncertainty list gains the three; a decisions line | dl-012 D6, dl-011 D8, dl-013 D10 |
| `05_journeys.md` 1.3 → 1.4 | J10 "Bootstrap a project from intent" (Adopter, also the non-technical manager's profile; priority: when WingFoil provides `pack-install`), next to J6, its steps from dl-011's guided workflow (D1, D2); a decisions line | dl-011 D8 |
| `07_sequencer.md` 1.6 → 1.7 | W10 gains F4.9 before F4.2: four features with one of high uncertainty, an exception recorded as W8's; W10's "Ends with" gains `governance/feedback` published; the M3 row's count 7 → 8; the state of the waves' W10 row; a new milestone M5 "Guided and directive-first adoption" (its row as dl-011 D8 gives it), ordered between M3 and M4, with W15 (F4.11, waits for M3) and W16 (F4.10, waits for the WingFoil release providing `pack-install`, no work before it); the Notes' W8 exception bullet extended to W10, W10's order (presets, `governance/feedback`, `governance/wingfoil-dogfood`, then the pack release round, then the periodic retrospective, the adoption last); "Every feature … exactly one wave" kept; a decisions line | dl-012 D6, dl-011 D8, dl-013 D10; the approver, 2026-11-12 |
| `08_mvp-canvas.md` 1.4 → 1.5 | the content gains `governance/feedback`; "The 35 features" → 36; the main-uncertainty list gains W10 (`governance/feedback`'s design); neither F4.10 nor F4.11 (outside M3); a decisions line | dl-012 D6; dl-011 D8, dl-013 D10 (unchanged by them) |
| dl-001, dl-003 | an Execution Note each: the first scope gains `governance/feedback` (dl-001 D5, dl-003 D7), dl-003 D6 refined (the WingFoil channel in `governance/wingfoil-dogfood`, which requires `governance/feedback` and ships `wingfoil-cli`); `governance/guided-init` and `methodology/directive-first` planned after the first catalog, the first scope unchanged by them | dl-012 D6, dl-011 D8, dl-013 D10 |
| `docs/owed-items.md` | the rows "dl-012's F4.9 placement" and "The follow-up plan of plan-020" to Closed | this plan |

Not in this plan: the feedback notes the three name (written when each charter is accepted); the
charters and their tasks (when `pack-delivery` reaches each pack); `.wingfoil/` (none of the
three changes it); the adoption's knock-ons (dl-012 D6, the adoption plan).

**`main`'s CI before this plan** (dl-038 C3): task-090's merge (`d9946a9d`), read at plan-070's
close, cited in the Execution Notes before `submit`.

## Steps

1. **This plan:** an independent review and a re-review if a fix changes a row (dl-017); the table
   shown to the approver; the approver's OK; `submit` (`draft → active`).
2. **The amendment** on the branch `vision/plan-071-follow-up-plan-020`, from `main` at this
   plan's `submit`: one commit per document, then the dl notes.
3. **The branch's review:** an independent review of the diff against the table; its amendments,
   re-reviewed if they change a row.
4. **Checks** on the frozen commit, as plan-069's: the branch CI and its job durations (dl-039 R3,
   G12); `git diff main --stat` naming only the files of the table and this plan; the privacy
   check of the branch's diff.
5. **The approver's merge OK;** merged `--no-ff`, pushed, `main`'s CI read; the two rows to
   Closed; `active → done`.

## Handoff

- **The approver:** the OK on the table (step 1); the merge OK (step 5).
- **Alone:** the edits, the checks, the rows, the notes; the reviews by an independent reviewer (a
  subagent with no part in the text). No `memory approve`, no pull request; files staged by name.
- **Done when:** the four documents at their new versions and the two notes on `main`, every row
  applied and no other change, `main`'s CI green, the two rows Closed.

## Execution Notes

