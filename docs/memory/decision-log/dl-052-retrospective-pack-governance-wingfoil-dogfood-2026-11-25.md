---
id: dl-052-retrospective-pack-governance-wingfoil-dogfood-2026-11-25
type: decision-log
title: "Retrospective pack-governance-wingfoil-dogfood 2026-11-25"
status: approved
tags: ["process","retrospective","wingfoil","dogfood"]
---

## Context

The `retrospective` phase of `pack-cycle` (v8) for `pack-governance-wingfoil-dogfood`, whose cycle
ran alone: `pack-ingest` (plan-082 … plan-084, dl-051), `charter` (plan-085), `author` (plan-086,
task-104, task-105), `first-release` and `activate` (plan-087, prel-008). It runs under plan-088,
as plan-087 ruling 9 asked. It is not the periodic retrospective: dl-029's trigger has not come
since 2026-11-04, and W10's stays at the end of the wave.

Its data is the friction inventory
`docs/retrospectives/2026-11-25-pack-governance-wingfoil-dogfood-friction-inventory.md`
(phase `explore`, `6d0510e6`, amended after an independent review of its citations in `fa66b26b`
and after a re-review in `eb1d9416`). At the `additional-points` checkpoint the approver added
P1 … P4 (`8a784b32`): every *(unrecorded)* candidate confirmed; GOV-1 and GOV-3 kept as
decision-logs; GOV-2, GOV-4 and GOV-5 as rows; no note to WingFoil. Section and point numbers
below (§1 … §9, GOV-1 … GOV-5, P1 … P4) are the inventory's.

## Options

A retrospective records what to keep and what to change; it has no alternatives of its own. Each
change of governance is a decision-log with its options, under `decision-log-ingest` until this
repository adopts `base` (dl-006 R2 as amended by dl-022). A WingFoil-side point is a feedback
note, not a decision.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.
Each change of governance takes effect only when its own decision-log is approved.

### Keep

- **K1 — `pack-ingest` v1 as it runs** (§1): capture to hand-off in 40 minutes, the request's
  decision-log reviewed, re-reviewed and approved inside it, each phase as dl-050 describes it.
- **K2 — Reviews before every gate they check, red first on every task with code, dl-039's order**
  (§3, §5.1): the cycle's one blocker found on text before acceptance; 47 should-fix points found
  before their gates; no CI job over 25 minutes.
- **K3 — The outline's Reads of the code a release depends on** (§4): reading `changelogEntry`
  found the truncated annotation before any element moved.
- **K4 — The publication rehearsal in a clone before `prepare`'s element moves, and dl-044 P1's
  report** (§4): one digest from the rehearsal through the dry run to the report, read into the
  record with no difference.
- **K5 — A first pass's errors recorded with the rerun** (§4): the Validation's note says what ran
  wrong and what ran again, not only the final exit 0.

### Change: governance, each by its own decision-log

- **C1 — dl-053** (GOV-1, P2): the approver pushes a pack-release's approval commit, and the agent
  reads `main`'s CI on it before it hands over the publication's commands; dl-044 P2 changed. It
  takes the row "dl-044 P2 … not applied at prel-008", which falls due here (plan-088 ruling 4).
- **C2 — dl-054** (GOV-3, P2): a pack-release's clean-clone checks run by one committed command,
  its output a report read into the Validation; its script a tooling task.

### Change: WingFoil-side points, as feedback notes

- **W1 —** None (§6, P4): no WingFoil-side candidate in the period; no task-106. Seen again,
  already noted: W-02 (F-011), W-04, W-05 (F-023).

### Debts

- **D1 —** The register's table of §8 is approved as a backlog: the nine rows the cycle touched
  with their proposals; the row of this pack's retrospective moves to Closed at plan-088's close;
  the 49 rows not touched kept with their owners and triggers.
- **D2 —** Rows changed at plan-088's close: "A check of the CHANGELOG's first line" given the
  trigger "the pack release round (the sequencer › W10's order)", where the check goes ruled by
  that round's plan, `check:packs` recommended (§7, GOV-2, P3), its Source extended with the
  inventory; "Recheck W-01 … W-14", its Source extended with the inventory (§8); "dl-044 P2 … not
  applied at prel-008" settled by dl-053 (rule 4): moved to Closed at dl-053's approval, within
  plan-088 (C1); if dl-053 is rejected, the row returns to plan-088's `capture`, where P2 is kept
  with the rejection's reason or another change is captured; if dl-053 is still `pending` at
  plan-088's close, the row stays open, its trigger dl-053's ruling.
- **D3 —** New rows at plan-088's close: the charter text drift of `governance/wingfoil-dogfood`
  (Ships and Parameters still list `wingfoil_source_key`; owner W10, trigger G7; GOV-4, P3);
  `pack-ingest` v1 read against its run (`vision`'s `optional` key; dl-050 D3's wording; owner
  approver, trigger the next change of `pack-ingest` or dl-049's `rule` at the adoption,
  whichever first; GOV-5, P3). §8's third candidate, GOV-3 as a row, is dropped: GOV-3 is a
  decision-log (P2).
- **D4 —** Two rows added at plan-088's close, one per decision-log, for its dl actions (owner
  approver, trigger its approval, a rejected one dropping out): their Sources dl-052 D4 with
  dl-053 P2 and dl-054 P2. One `version` bump per file across the approved ones:
  `pack-release-cycle` 9 → 10 (dl-053, dl-054).

### Observed, no change proposed

- **N1 —** The `rule` approval before its plan (§1), and three plans for one run's four phases:
  one case; dl-049's run at the adoption will show whether it repeats.
- **N2 —** The charter amended while `draft`, not while `proposed` (§2): the review came before
  the gate, as dl-017 asks; the workflow's wording, not its order.
- **N3 —** The approver's first `push --atomic` did not land (§4): one case, cause unknown; the
  read of the remote after the push found it, as `activate`'s pre-checks would have.
- **N4 —** Slips of the work, confirmed by the approver (P1): the machine restart; long lines
  after scripted edits, each stopped by `check:texts`; the CI watch written per run. dl-054 takes
  the clean-clone script; the rest are evidence, not a change.
- **N5 —** The approver's waits (§5.2): every push of `main` is the approver's since plan-087, so
  each commit on `main` waits for one; C1 makes the approval's push one of them, ruled.
- **N6 —** Departures recorded by notes, the bodies left as they were (§5.4): G7 (in-place
  amendment) is their rule; the charter's drift is D3's row.
- **N7 —** Points corrected at review or read by a note: plan-083's CI cited wrong (§1); plan-085
  point 8 given a reading (§2); the charter's four tasks made two at `author`'s Reads (§2);
  task-104 criterion 8 read, not met literally (§3); §5.1's two review gaps (Acceptance 6 missed,
  the departure's row added only at the close's review). Evidence of K2, not a change.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-25: written under plan-088 (`capture`), from the inventory and the approver's points
  P1 … P4.
- 2026-11-25: independent review (dl-017, `89390b99`): approve after amendments; no blocker,
  three should-fix (D2's CHANGELOG row leaving the place to the round's plan; the P2 row's one
  closing point, dl-053's approval, and its return on a rejection; N7 for the points corrected at
  review) and four nits (D4's sources; D3's "whichever first" and GOV-3's row dropped; the
  CHANGELOG row's Source; the two notes on dl-044, which dl-053 P2 now separates), all applied in
  the commit that records this note.
- 2026-11-25: re-review (dl-017, `327b6b4e`): approve after amendments; one should-fix (the P2
  row's case of dl-053 still `pending` at plan-088's close: the row stays open, its trigger
  dl-053's ruling) and one nit ("the rejection's reason"), applied in the commit that records
  this note.
