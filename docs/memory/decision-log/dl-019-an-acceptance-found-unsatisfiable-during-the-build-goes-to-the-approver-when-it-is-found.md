---
id: dl-019-an-acceptance-found-unsatisfiable-during-the-build-goes-to-the-approver-when-it-is-found
type: decision-log
title: "An Acceptance found unsatisfiable during the build goes to the approver when it is found"
status: draft
tags: ["process","retrospective"]
---

## Context

The periodic retrospective of 2026-10-12 (dl-016; inventory §3) found Acceptance criteria that
could not hold as written, recorded as deviations after the build and accepted by the build review:
- task-020: Acceptance 8 ("exactly the same three files") "cannot hold as written" on an N-1 line;
  Acceptance 3 said a test file stays unmodified, and it changes in one line;
- task-022: Acceptance 9 said the expected files stay unchanged, and the fixture READMEs changed;
- before W14, the same pattern in task-012, task-014, task-015 and task-016.

The Acceptance is fixed when the approver accepts the task into the backlog, before the Design meets
the code. When it turns out unsatisfiable, the build reviewer accepts the deviation, and the
approver learns of it at the `in-review` gate, among the build's notes. The approver's acceptance
criterion was changed by someone other than the approver.

## Options

1. **No change.** Rejected for the reason above.
2. **Reject the task and write it again.** `in-progress` has no gate to go back to `pending`, and
   rewriting a task for one criterion is out of proportion.
3. **Raise it when found.** The developer stops on the criterion, records the finding and a
   proposed reading in the Execution Notes, and asks the approver in chat; the approver's ruling is
   recorded before the build goes on.

## Decision

**Proposed: option 3.** The approver rules at `memory approve`.

- **R1 —** A criterion of the Acceptance that cannot hold as written is raised to the approver when
  it is found, during design or build, not left to the build review.
- **R2 —** The Execution Notes record the criterion, why it cannot hold, the proposed reading and
  the approver's ruling with its date. The Acceptance text stays as approved; the ruling is the
  record.
- **R3 —** The build review reports as a finding any deviation from the Acceptance that has no
  ruling.
- **R4 —** A departure from the Design is not an Acceptance deviation: it is recorded as today,
  without a ruling, unless it changes a criterion.

Configuration changes this decision implies, applied after approval through their own element:
`tooling-delivery` and `kanban-delivery` › `build` and `review` descriptions (R1, R3), `version`
bumped; the task template's Execution Notes comment (R2).

## Execution Notes
