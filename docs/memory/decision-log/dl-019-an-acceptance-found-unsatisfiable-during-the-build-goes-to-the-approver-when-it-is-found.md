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
approver learns of it at the `in-review` gate, among the build's notes: the approver's acceptance
criterion is changed by someone other than the approver.

## Options

1. **No change.** Rejected for the reason above.
2. **Amend the Acceptance in place.** The criterion is rewritten, with a dated note, once the
   approver rules. Rejected: the approver accepted the text at `backlog`, and an in-place rewrite
   makes the approved text unreadable without the history; a task is short-lived and closes at
   `done`, so the ruling beside it in the notes is read with it.
3. **Raise it when found.** The developer stops on the criterion, records the finding and a
   proposed reading, and asks the approver in chat; the ruling is recorded before the work on that
   criterion goes on. (Going back to `pending` is not available: from `in-progress` the only way
   back is the `in-review` gate's rejection.)

## Decision

**Proposed: option 3.** The approver rules at `memory approve`.

- **R1 —** A criterion of the Acceptance that cannot hold as written is raised to the approver when
  it is found, during design or build. The work on that criterion waits for the ruling; the rest of
  the task may go on.
- **R2 —** The Execution Notes record the criterion, why it cannot hold, the proposed reading and
  the approver's ruling with its date. The Acceptance text stays as approved.
- **R3 —** The build review reports as a blocking finding any deviation from the Acceptance that
  has no ruling.
- **R4 —** A departure from the Design is not an Acceptance deviation: it is recorded as today,
  without a ruling, unless it changes a criterion.
- **R5 —** When a criterion cannot hold because an approved specification is wrong, the ruling is
  also an erratum of that specification, recorded there as dl-020 R1 asks.

Configuration changes this decision implies, applied after approval through their own element:
`tooling-delivery` and `kanban-delivery` › `design`, `build` (R1) and `review` (R3); the task
template's Execution Notes comment (R2).

The configuration changes of dl-017, dl-018 and dl-019 touch the same phase descriptions of
`tooling-delivery` and `kanban-delivery`; they are applied together, with one `version` bump per
file (dl-016 A2).

## Execution Notes
