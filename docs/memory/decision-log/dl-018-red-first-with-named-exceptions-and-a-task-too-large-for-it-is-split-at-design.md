---
id: dl-018-red-first-with-named-exceptions-and-a-task-too-large-for-it-is-split-at-design
type: decision-log
title: "Red first with named exceptions, and a task too large for it is split at design"
status: draft
tags: ["process","retrospective"]
---

## Context

The periodic retrospective of 2026-10-12 (dl-016; inventory §2) found red-first kept on most tasks,
with the failure count of the red run recorded (task-001 … task-004, task-006, task-008, task-013,
task-018, task-022, task-024), and broken on others:
- task-019, the largest task of W14, "drafted before its tests, a departure from red first; the red
  was then shown by mutation" (task-019 › Execution Notes);
- characterization tests written after configuration or content: task-005 (ESLint), task-007 (the
  AGENTS region), task-010 (the inbox), and tests written with each module in task-014 and
  task-020;
- task-011, task-012, task-015 and task-016 plan "Tests, red first" in their Design, and their notes
  do not record a red run.

The `testing` directive (WingFoil built-in) asks for test-first work, and the `build` phase of
`tooling-delivery` and `kanban-delivery` says "test-first". Nothing says when a characterization
test, checked by mutation, may replace a red run, or what the notes record.

## Options

1. **No change.** Rejected: the departures are recorded, but each one is decided alone during the
   build.
2. **Strict red-first, no exception.** Rejected: for configuration and content (an ESLint set-up,
   a feedback note, a directive), the natural test describes what exists, and a red run against a
   missing file proves little.
3. **Red first by default, with named exceptions and a split at design.**

## Decision

**Proposed: option 3.** The approver rules at `memory approve`.

- **R1 — Default.** Code is written after a test that fails for the right reason. The Execution
  Notes record the red run: the command, the number of failing tests, the commit or stub it ran
  against (stubs need not be committed).
- **R2 — Named exceptions.** A characterization test written after the work is accepted only for:
  configuration of a third-party tool, content (notes, directives, documents), and a test added to
  cover existing behaviour. Each such test is checked by mutation: the notes list the mutations and
  that each one made the test fail.
- **R3 — Size.** When the Design shows that the work cannot go red-first in steps (a single change
  whose tests need most of the code to exist), the task is split at design, before `in-progress`,
  as task 2b was split from task 2 (plan-024).
- **R4 — Review.** The build review checks R1–R3 and reports a departure as a finding.

Configuration changes this decision implies, applied after approval through their own element:
- `tooling-delivery` and `kanban-delivery` › `build`: R1 and R2 in the description; › `design`: R3;
  `version` bumped (bug-001: the two files stay in step);
- the task template's Execution Notes comment names the red run.

## Execution Notes
