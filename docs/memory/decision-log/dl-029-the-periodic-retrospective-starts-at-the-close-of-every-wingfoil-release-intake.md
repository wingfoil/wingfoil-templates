---
id: dl-029-the-periodic-retrospective-starts-at-the-close-of-every-wingfoil-release-intake
type: decision-log
title: "The periodic retrospective starts at the close of every WingFoil release intake"
status: draft
tags: ["process","retrospective","wingfoil"]
---

## Context

dl-006 R3 asks for a periodic retrospective "at least once between two WingFoil releases, before
WingFoil's release planning", so that the WingFoil-side points reach the feedback inbox in time
(dl-001 D6). Nothing starts it: `retrospective-periodic.yaml` v1 carries the cadence in its header
comment only, and `wingfoil-release-intake.yaml` v4 (`record`, `recheck`, `plan-migrations`) has no
phase that points to it.

Between WingFoil 0.3.0 (released 2026-10-19, intake plan-042 closed 2026-10-21) and 0.3.1 (released
and taken in by plan-051 on 2026-10-27) no periodic retrospective ran, and neither intake close
mentions one (inventory of 2026-10-28, §4.6). The next one, plan-054, ran only because it was asked
for after the third pack cycle. The inbox sync has the same shape: `wingfoil-cli` rule 7 ties it to
WingFoil's release planning or a pin bump, neither of which this repository sees, and "Last sync" is
still "none" (§4.7).

Candidate G1 of the retrospective dl-028 (C1), asked by the approver on 2026-10-28 with plan-054's
proposal (decision 5).

## Options

1. **Keep R3 as a cadence and rely on memory.** Rejected: it was missed between 0.3.0 and 0.3.1,
   the first window after plan-025.
2. **A calendar trigger** (a scheduled reminder). Rejected: WingFoil's releases are not periodic,
   and R3 is defined by them.
3. **The intake's close starts it.** Every WingFoil release this repository takes in already starts
   `wingfoil-release-intake`; its close is the event R3 needs. A `pack-cycle` retrospective counts
   as the periodic one when its inventory covers the whole period since the previous periodic one
   (scope `periodic`, as plan-054 does).
4. **Option 3, and the inbox sync at the same event** (plan-026's option (b)). Rejected for now:
   the first sync and the pin move are set at W10 (plan-052 ruling 7) and are outside plan-054's
   scope; moving the sync from WingFoil's planning to its release changes rule 7's cadence
   (plan-026, dl-016 A1) and is reconsidered there. Its cost: "Last sync" stays "none" until W10
   (inventory §4.7).

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **T1 — Option 3.** At the close of every `wingfoil-release-intake` run, the intake's plan records
  WingFoil's next release planning date as announced, or "not known", and starts a periodic
  retrospective, unless a periodic retrospective, or one that counts as periodic (Option 3), has
  closed since the release this intake takes in. On the 0.2.2 pin, which has no workflow engine,
  "starts" means that the facilitator adds the retrospective's plan (`workflow:
  retrospective-periodic`, filled by hand, W-02).
- **T2 — Its deadline.** The retrospective closes before WingFoil's next release planning. When the
  date is not known, it closes within seven days of the intake's close: weaker than R3, which the
  approver may tighten in the intake's plan. For a release that WingFoil plans no retrospective or
  planning of its own for (a patch such as 0.3.2), the approver may rule in the intake's plan that
  the next retrospective, before the next planning, covers the window.
- **T3 — Where it is written:**
  - `wingfoil-release-intake.yaml` v4 → v5: a last phase `retrospective-start` (role facilitator,
    no actions, as `recheck`) that applies T1 and T2, and records in the intake's plan the
    retrospective that covers the window;
  - in the same version, not part of R3: `recheck`'s wording aligned with `record`, which
    recomputes the ranges at intake (an owed item of plan-051 and plan-052);
  - `retrospective-periodic.yaml`'s header comment names T1's trigger, `version: 1 → 2`;
  - an Execution Note on dl-006 records that R3's trigger is T1.
  At W10, `base`'s `retrospective-periodic` replaces this repository's file and its comment; T1
  lives on in `wingfoil-release-intake` v5, which is this repository's own, and in dl-006's note.
- **T4 — The inbox sync is not tied here** (Option 4 rejected); it stays with `wingfoil-cli` rule 7
  and is reconsidered at W10, with the first sync and the pin move.
- **T5 — Applied after approval** by a dl actions plan after plan-054, with the other governance
  decision-logs of dl-028 that are approved by then. Until it is applied, the intake plan's close
  says whether a periodic retrospective is due.

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-028.
- 2026-10-29: independent review: approve after amendments, one blocking finding: the skip
  condition read against the release this intake takes in, with "closed" in both places. Applied
  with it: the planning date recorded at the intake's close and a seven-day bound when it is not
  known, a `pack-cycle` retrospective counting only with a `periodic` inventory, "starts" on the
  0.2.2 pin and no `agent.execute`, the version bump of `retrospective-periodic`, what survives W10,
  Option 4's reason, the patch-release case.
