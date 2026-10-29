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

1. **Keep R3 as a cadence and rely on memory.** Rejected: it was missed once in its first window.
2. **A calendar trigger** (a scheduled reminder). Rejected: WingFoil's releases are not periodic,
   and R3 is defined by them.
3. **The intake's close starts it.** Every WingFoil release this repository takes in already starts
   `wingfoil-release-intake`; its close is the event R3 needs. The retrospective must be closed
   before WingFoil's next release planning; a `pack-cycle` retrospective closed inside the window
   counts as the periodic one.
4. **Option 3, and the inbox sync at the same event** (plan-026's option (b)). Rejected for now:
   the sync needs the pin bump and WingFoil's reading of the inbox (rule 7), which W10 changes;
   tying it here would bind a rule that the adoption rewrites.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **T1 — Option 3.** The close of every `wingfoil-release-intake` run starts a periodic
  retrospective (`retrospective-periodic`), unless one has already run since the previous WingFoil
  release. It is closed before WingFoil's next release planning; when that date is not known, before
  the next intake starts. A `pack-cycle` retrospective closed inside the window counts as the
  periodic one (as plan-054 does).
- **T2 — Where it is written:**
  - `wingfoil-release-intake.yaml` v4 → v5: a last phase `retrospective-start` (role facilitator,
    `agent.execute`) that checks the window and starts `retrospective-periodic`, or records in the
    intake's plan which retrospective covers the window;
  - in the same version, `recheck`'s wording aligned with `record`, which recomputes the ranges at
    intake (an owed item of plan-051 and plan-052);
  - `retrospective-periodic.yaml`'s header comment names T1's trigger;
  - an Execution Note on dl-006 records that R3's trigger is T1.
- **T3 — The inbox sync is not tied here** (option 4 rejected); it stays with `wingfoil-cli` rule 7
  and is reconsidered at W10, when the pin moves and the first sync runs.
- **T4 — Applied after approval** by a dl actions plan after plan-054, with the other governance
  decision-logs of dl-028 that are approved by then. Until it is applied, the intake plan's close
  says whether a periodic retrospective is due.

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-028.
