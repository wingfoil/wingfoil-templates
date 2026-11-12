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
| `06_features.md` 1.6 → 1.7 | F4.9 "`governance/feedback`: installable, configurable feedback capture, triage and routing into the governance" (J5, J10; H, M, **H**); F4.10 "`governance/guided-init`: one guided workflow from intent to a reconfigured WingFoil, for any governed project, with the `bootstrap` preset" (J10; H, M, **H**); F4.11 "`methodology/directive-first`: directives drive methodology, workflows, agents and verification" (J5, J6, J10; H, H, **H**); F4.2 gains "built on F4.9"; the review notes' high-uncertainty list gains F4.9 (the design questions of dl-012 D8), F4.10 (the adaptive method and the reconfiguration, dl-011 D8) and F4.11 (the plan's own reason: the directive-driven dispatch and the type map's extension, dl-013 D5, D11); the "Dependency on WingFoil" list gains F4.10 (a WingFoil release providing `pack-install`), F4.11 not added (related to F-009, not waiting on it); a decisions line | dl-012 D6, dl-011 D8, dl-013 D10 |
| `05_journeys.md` 1.3 → 1.4 | J10 "Bootstrap a project from intent" (Adopter, also the non-technical manager's profile, personas §2; priority: when WingFoil provides `pack-install`): a row in the journeys table after J6's and a section after J6's, before J7's; its steps (the plan's own, for the approver's OK) from dl-011's guided workflow (D1, D2); a decisions line, the first amendment recorded there | dl-011 D8 |
| `07_sequencer.md` 1.6 → 1.7 | W10 gains F4.9 before F4.2: four features, its High-unc. cell "—" → F4.9, an exception recorded as W8's; W10's "Ends with" gains `governance/feedback` published; M3's Goal gains `governance/feedback` and its count 7 → 8; the state of the waves at 1.7 (its header's date), W10's row naming F4.9, and W15 and W16 not started; a new milestone **M5 — Guided and directive-first adoption**, its row as dl-011 D8 gives it, ordered between M3 and M4 (its id after M4's, as W14 within M1), and an M5 section with its wave table, the wave names and "Ends with" the plan's own for the approver's OK: **W15 — Directive First** (F4.11 `methodology/directive-first` with the `directive-first` preset; High-unc. F4.11; waits for M3, following W10's `governance/feedback`, which the preset holds; ends with the pack and its `directive-first` preset published, validated across the compatibility matrix and run on the real engine, dl-032 E2–E4) and **W16 — Guided initialization** (F4.10 `governance/guided-init` with the `bootstrap` preset; High-unc. F4.10; starts when `compat.yaml` records a released WingFoil providing `pack-install`, no work before it; ends with the pack and its `bootstrap` preset published, dl-032 E2 and the matrix run on that release); the Notes' W8 exception bullet extended to W10; W10's order bullet: the presets, `governance/feedback`, `governance/wingfoil-dogfood`, then the pack release round, then this repository's adoption, then the periodic retrospective (the adoption's place before the retrospective for the approver to confirm); "Every feature … exactly one wave" kept; a decisions line | dl-012 D6, dl-011 D8, dl-013 D10; the approver, 2026-11-12 |
| `08_mvp-canvas.md` 1.4 → 1.5 | the proposal's content list and the Features list gain `governance/feedback`; "The 35 features" → 36; the main-uncertainty list gains W10 (`governance/feedback`'s design); "12 waves" corrected to 13 (W1–W12 and W14, already one short at 1.4); neither F4.10 nor F4.11 (outside M3); a decisions section opened, the first amendment recorded there | dl-012 D6; dl-011 D8, dl-013 D10 (unchanged by them) |
| dl-001, dl-003 | an Execution Note each: the first scope gains `governance/feedback` (dl-001 D5, dl-003 D7) and dl-003 D6 refined (the WingFoil channel in `governance/wingfoil-dogfood`, which requires `governance/feedback` and ships `wingfoil-cli`), as dl-012 D6 records; `governance/guided-init` and `methodology/directive-first` planned after the first catalog, the first scope unchanged by them. The three dls differ on these notes (dl-011 D8 asks for one on dl-001; dl-012 D6 records its change in itself, dl-001 and dl-003 "as approved"; dl-013 D10 "not changed"): the notes point to the dls, changing neither text | dl-011 D8, dl-012 D6, dl-013 D10; plan-020 › Execution Notes 2026-11-12 |
| `docs/owed-items.md` | the row "dl-012's F4.9 placement" (dl-012 D6 says it "closes with this ruling"; it closes at this plan's merge, with the amendment) and the row beginning "The follow-up plan of plan-020" to Closed, at the close on `main` | this plan |

Not in this plan: the feedback notes the three name (written when each charter is accepted); the
charters and their tasks (when `pack-delivery` reaches each pack); `.wingfoil/` (none of the
three changes it); the adoption's knock-ons (dl-012 D6, the adoption plan).

**`main`'s CI before this plan** (dl-038 C3): plan-070's close commits, pushed with this plan's
body, their run read in the Execution Notes before `submit`; this plan is submitted after plan-070
is `done`.

## Steps

1. **This plan:** an independent review and a re-review if a fix changes a row (dl-017); the table
   shown to the approver; the approver's OK; `submit` (`draft → active`). Role: product-owner.
2. **The amendment** on the branch `vision/plan-071-follow-up-plan-020`, from `main` at this
   plan's `submit`: one commit per document, then the dl notes. Role: product-owner.
3. **The branch's review:** an independent review of the diff against the table; its amendments,
   re-reviewed if they change a row.
4. **Checks** on the frozen commit, for a text-only change, as plan-069's: the branch CI, its job
   durations recorded (dl-039 R3, G12); `git diff main --stat` naming only the four documents,
   dl-001, dl-003 and this plan (`docs/owed-items.md` changes at step 5, on `main`); the privacy
   check of the branch's diff (repository-practice rule 2: no local or scratch path, no private
   project, no session). dl-039 R1's local list is for tooling and pack tasks and is not run.
5. **The approver's merge OK;** merged `--no-ff`, pushed, `main`'s CI read; the two rows to
   Closed; `active → done`.

## Handoff

- **The approver:** the OK on the table (step 1), including the plan's own texts (J10's steps,
  W15's and W16's names and "Ends with", F4.11's uncertainty reason) and the adoption's place
  before the periodic retrospective; the merge OK (step 5).
- **Alone:** the edits, the checks, the rows, the notes; the reviews by an independent reviewer (a
  subagent with no part in the text). No `memory approve`, no pull request; files staged by name.
- **Done when:** the four documents at their new versions and the two notes on `main`, every row
  applied and no other change, `main`'s CI green, the two rows Closed.

## Execution Notes

- 2026-11-12: review: approve after amendments, three blocking, applied: the dl-038 C3 sentence
  (plan-070's close commits, this plan submitted after plan-070 is `done`); the sequencer row
  completed (W10's High-unc. cell, M3's Goal, the state of the waves' rows, an M5 section with
  W15's and W16's tables, their texts the plan's own); the features row with the "Dependency on
  WingFoil" list and each uncertainty's reason. With the nits: the three dls' differing asks on
  the dl-001/dl-003 notes recorded; J10's steps marked as the plan's own, its two places; the
  adoption's place for the approver; the canvas's two lines and "12 waves" → 13; the journeys'
  first decisions line; the owed rows named exactly; the roles, the checks spelled out.
- 2026-11-12: re-review: approve after one amendment, applied: W15's "Ends with" across the matrix
  and on the real engine (dl-013 D9, dl-032 E2–E4), W16's the same on its release; with the nits:
  the canvas's decisions section opened, W15 following W10's `governance/feedback`.
