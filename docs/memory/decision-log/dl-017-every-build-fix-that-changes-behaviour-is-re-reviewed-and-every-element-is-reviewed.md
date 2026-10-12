---
id: dl-017-every-build-fix-that-changes-behaviour-is-re-reviewed-and-every-element-is-reviewed
type: decision-log
title: "Every build fix that changes behaviour is re-reviewed, and every element is reviewed"
status: draft
tags: ["process","retrospective"]
---

## Context

The periodic retrospective of 2026-10-12 (dl-016; inventory
`docs/retrospectives/2026-10-12-periodic-friction-inventory.md` §1) found that the independent
reviews are the practice that worked best in M1: they found blocking defects that the tests had
missed (task-002, task-003, task-004, task-007, task-012, task-016, task-019) and no element was
rejected at the approver's gate. Two gaps:
- **The re-review of a build is skipped without a criterion.** task-020, task-021 and task-023
  were not re-reviewed after their build fixes ("cleanups only"), while re-reviews elsewhere found
  new defects, among them a regression a review fix had introduced (task-006, `c77a6f3`; task-019,
  `758c779`).
- **The practice is written nowhere in the configuration.** It comes from the approver's
  instructions, repeated in each plan (plan-015 step 1, plan-024 step 1). An element outside a
  plan's list can miss it: task-017 records no review; dl-015 and plan-022 record no independent
  one.

## Options

1. **No change.** The plans keep restating the practice. Rejected: the gaps above happened with
   the plans in place.
2. **Always re-review.** Every build fix is re-reviewed. Simple, but a line-wrap commit costs a
   review.
3. **Re-review by kind of fix, and the review written into the workflows.** A fix that changes
   behaviour or a test is re-reviewed; a fix that changes neither may skip it, and the skip is
   recorded with that reason.

## Decision

**Proposed: option 3.** The approver rules at `memory approve`.

- **R1 — Who is reviewed.** Every Memory element this repository creates is reviewed by an
  independent subagent (its own context, read-only) before the approver's gate: a task's body
  before `backlog` and its build before `in-review`; a decision-log, ADR, tech-spec or bug before
  its approval; a plan before it is submitted `active`. An element hosted outside a plan's backlog
  is no exception.
- **R2 — When a build fix is re-reviewed.** After the review's findings are fixed, the build is
  re-reviewed when a fix changes behaviour, a test or an Acceptance command. A fix that changes
  neither (comments, wording, line wraps, renames with no effect) may skip the re-review; the
  Execution Notes say so and why. A re-review that finds something starts the rule again.
- **R3 — What the notes record.** Each review and re-review: its verdict, the number of blocking,
  should-fix and nit findings, and the commit that fixed them.

Configuration changes this decision implies, applied after approval through their own element:
- `tooling-delivery` and `kanban-delivery` › `review`: R1 and R2 in the description, `version`
  bumped; the two files stay identical apart from roles and descriptions (bug-001);
- the plan template's Handoff comment names R1 for the elements the plan creates.

## Execution Notes
