---
id: dl-018-red-first-with-named-exceptions-and-a-task-too-large-for-it-is-split-at-design
type: decision-log
title: "Red first with named exceptions, and a task too large for it is split at design"
status: approved
tags: ["process","retrospective"]
---

## Context

The periodic retrospective of 2026-10-12 (dl-016; inventory §2) found red-first kept on most tasks,
with the failure count of the red run recorded (task-001 … task-004, task-006, task-008, task-013,
task-018, task-022, task-024), and broken on others:
- task-019, the largest task of W14, "drafted before its tests, a departure from red first; the red
  was then shown by mutation" (task-019 › Execution Notes);
- tests written after configuration or content: task-005 (ESLint), task-007 (the AGENTS region),
  task-010 (the inbox); tests written with each module: task-014, task-020;
- task-011, task-012, task-015 and task-016 plan "Tests, red first" in their Design, and their notes
  do not record a red run; task-021 and task-023 ran red against stubs that were never committed,
  which no reviewer can check.

The `testing` directive (WingFoil built-in, not editable here) says: "red-first when the behaviour
is new, characterization when the behaviour already exists and the test is expected to pass on its
first run". It does not cover new configuration or content, whose natural test describes what the
change adds and passes once the change exists, and it asks for no evidence. The `build` phase of
`tooling-delivery` says "test-first" with no more detail.

## Options

1. **No change.** Rejected: the departures are recorded, but each one is decided alone during the
   build.
2. **Strict red-first, no exception.** Rejected: for configuration of a third-party tool and for
   content (a feedback note, a directive), a red run against a missing file proves little.
3. **Red first by default, with named exceptions, evidence, and red steps planned at design.**

## Decision

**Proposed: option 3**, for tooling tasks. The approver rules at `memory approve`.

- **R1 — Default.** Code is written after a test that fails for the right reason. The Execution
  Notes record the red run: the command and its failing-count line as printed; the run is made on
  a commit of the task branch, or the stub it ran against is quoted in the notes.
- **R2 — Named exceptions.** Beyond the `testing` directive's characterization of existing
  behaviour, a test written after the change is accepted only for configuration of a third-party
  tool and for content (notes, directives, documents). Each such test is checked by mutation: the
  notes list the mutations and that each one made the test fail.
- **R3 — Red steps at design.** The Design lists the red steps of the work. A Design that cannot
  list them (a single change whose tests need most of the code first) proposes a split; the new
  task goes through `plan` and the approver's gate, before `in-progress`. task-019, split only at
  its body review and then drafted before its tests, is the case this rule targets.
- **R4 — Review.** The build review checks R1–R3 and reports a departure as a finding.
- **Pack tasks.** A pack's content is checked by the lint, the composition and its examples
  (spec-001, spec-002 CB-2), not by red-first tests: this decision changes `tooling-delivery`
  only, and `kanban-delivery` keeps its descriptions (bug-001 allows them to differ).

Configuration changes this decision implies, applied after approval through their own element:
- `tooling-delivery`: R3 in `design`, R1 and R2 in `build`, R4 in `review`. The adaptation goes in
  the workflow, not in a custom `testing` directive that would shadow the built-in;
- the task template's Execution Notes comment names the red run.

The configuration changes of dl-017, dl-018 and dl-019 touch the same phase descriptions of
`tooling-delivery` and `kanban-delivery`; they are applied together, with one `version` bump per
file (dl-016 A2).

## Execution Notes
