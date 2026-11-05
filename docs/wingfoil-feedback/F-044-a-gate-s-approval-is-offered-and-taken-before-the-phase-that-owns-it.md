---
id: F-044
title: "A gate's approval is offered, and taken, before the phase that owns it"
kind: request
status: open
wingfoil_version: 0.3.2
answered_by: []
---

New note (task-077). From this repository's plan-064 and dl-041: WingFoil UI, adopting this
repository's `software` pack with a local gate on `release` at `releasing`, saw the release's
approval listed as soon as it entered `releasing`, before the phase that decides it; dl-041 keeps
`software`'s releases ungated until this is settled, since approving early would skip the
publication steps. It builds on WingFoil's spec-017 §5.1, which defines the "ungated elements" as
those in a gated state that no pending approval of any open instance carries, and REQ-SEC-03, which
limits who decides, not when. The request is about an element that a later phase of an open instance
will select. Distinct from F-039 (an approval step that returns) and F-025; F-045 is about the same
list's heading.

## Observed

WingFoil 0.3.2 (`6de2e13c`), installed from npm, pinned by the lockfile
`src/matrix/wingfoil-0.3.2/`, in a scratch project: `git init`, `wingfoil init --template Kanban
--no-interactive`, then `wingfoil dna add team.members --value "Tester" --entry-email
tester@notes.example --entry-roles approver,developer` (a fictional identity, also the git identity
unless said otherwise).

A custom workflow, written by hand, included in `workflows.yaml` and committed (`workflow list
--format json`: `"diagnostics":[]`):

```yaml
name: late-gate
kind: main
element: decision-log          # defaults: draft → pending (gate) → approved
phases:
  - name: enter
    role: developer
    actions: [memory.submit]
  - name: work
    role: developer
    produces: ["docs/notes/work.md"]
  - name: decide
    role: approver
    actions: [memory.approve]
    approval: { by_role: approver }
```

```
$ wingfoil memory add --type decision-log --title "A decision"
$ wingfoil workflow start late-gate --element decision-log:dl-001-a-decision
$ wingfoil memory submit dl-001-a-decision              # draft → pending, exit 0
$ wingfoil workflow status
* late-gate-dl-001-a-decision-plan (late-gate) — active
    element: decision-log:dl-001-a-decision (pending)
    phases: enter complete, work current, decide pending
ungated elements: 1
  human needed: approve or reject dl-001-a-decision (decision-log, pending; no open workflow
  carries it) — routed to Tester <tester@notes.example>
$ wingfoil memory approve dl-001-a-decision --reason "approved before its phase"
{ … "from": "pending", "to": "approved" }              # exit 0, with work still current
$ git commit docs/notes/work.md …                        # work's evidence
$ wingfoil workflow status
* late-gate-dl-001-a-decision-plan (late-gate) — active, complete
    phases: enter complete, work complete, decide complete
```

The early approval completes `decide` when the instance reaches it: the decision was taken before
the work it was meant to follow.

## Expected

An element that a pending phase of an open instance selects is listed as carried by that instance,
not as "no open workflow carries it", and is not offered for approval before that phase is current:
`workflow status` names the instance and the phase it waits for, and `memory approve` before it is
refused with a message naming them (for example `error: dl-001-a-decision is decided by
late-gate.decide, which is not current yet`), or, if WingFoil keeps the move allowed, warns. A gate
then belongs to the phase that owns it.
