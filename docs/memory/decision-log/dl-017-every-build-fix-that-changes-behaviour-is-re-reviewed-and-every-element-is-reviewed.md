---
id: dl-017-every-build-fix-that-changes-behaviour-is-re-reviewed-and-every-element-is-reviewed
type: decision-log
title: "Every build fix that changes behaviour is re-reviewed, and every element is reviewed"
status: pending
tags: ["process","retrospective"]
---

## Context

The periodic retrospective of 2026-10-12 (dl-016; inventory
`docs/retrospectives/2026-10-12-periodic-friction-inventory.md` §1) found that the independent
reviews are the practice that worked best in M1: they found blocking defects that the tests had
missed (task-002, task-003, task-004, task-007, task-012, task-016, task-019) and no element was
rejected at the approver's gate. Two gaps:
- **The re-review of a build is skipped without a criterion.** After their build fixes, task-020
  was not re-reviewed ("cleanups only"), nor task-021 ("the fixes tighten the parser and the tests
  only") nor task-023 ("tighten the test and the wording only"), though the last two changed tests.
  Re-reviews elsewhere found new defects, among them a regression a review fix had introduced
  (task-006, caught and reverted in `c77a6f3`; task-019, fixed in `758c779`).
- **The practice is written nowhere in the configuration.** It comes from the approver's
  instructions, restated in plan-024 step 1 and recorded in plan-015's Execution Notes. An element
  outside a plan's list can miss it: task-017 records no review; dl-015 and plan-022 record no
  independent one.

## Options

1. **No change.** The plans keep restating the practice. Rejected: the gaps above happened with
   the plans in place.
2. **Always re-review.** Every build fix is re-reviewed. Simple, but a line-wrap commit costs a
   review.
3. **Re-review by kind of fix, and the review written into the workflows.** A fix that changes
   behaviour, a test or an Acceptance command is re-reviewed; a fix that changes none of them may
   skip it, and the skip is recorded with that reason.

## Decision

**Proposed: option 3.** The approver rules at `memory approve`.

- **R1 — Who is reviewed.** Before the approver's gate, an independent reviewer (a subagent with
  its own context, read-only, or another session) reviews:
  - a task's body before `backlog`, and its build before `in-review`;
  - a decision-log, an ADR, a tech-spec and a bug before their approval;
  - a pack charter and a pack-release before their gate;
  - a plan before it is submitted `active`, and a phase gate before the approver rules it.
  An element hosted outside a plan's backlog is no exception.
- **R2 — When a build fix is re-reviewed.** After the review's findings are fixed, the build is
  re-reviewed when a fix changes behaviour, a test or an Acceptance command. A fix that changes
  none of them (comments, wording, line wraps) may skip the re-review; the Execution Notes say so
  and why. A re-review that finds something starts the rule again.
- **R3 — What the notes record.** Each review and re-review: its verdict, the number of blocking,
  should-fix and nit findings, and the commit that fixed them.

Configuration changes this decision implies, applied after approval through their own element:
- `tooling-delivery` and `kanban-delivery`: R1 in `plan` (the body) and in `review` (the build), R2
  and R3 in `review`; the two files stay identical apart from roles and descriptions (bug-001);
- `decision-log-ingest`, `adr-ingest`, `bug-ingest`, `pack-cycle` (charter), `pack-release-cycle`
  and `sw-life-cycle` (phase gates): R1 in the description of the phase before the approval;
- the plan template's Handoff comment names R1.

The configuration changes of dl-017, dl-018 and dl-019 touch the same phase descriptions of
`tooling-delivery` and `kanban-delivery`; they are applied together, with one `version` bump per
file (dl-016 A2).

## Execution Notes
