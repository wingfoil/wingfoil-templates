---
id: F-032
title: "No way to suspend a workflow instance and resume it later"
kind: request
status: open
wingfoil_version: 0.3.0
answered_by: []
---

New note (task-041). From this repository's plan-045 (ruling H) and dl-023 D1, which dropped a
`parked` state from the `base` pack's `plan` because WingFoil 0.3.0 cannot suspend an instance.

## Observed

WingFoil 0.3.0 from npm, in a scratch project (`git init`, `wingfoil init --template Kanban`, one
commit). The scaffold's `plan` is `sequence: [draft, active, done]`, `waiting: [active]`:

```
$ wingfoil workflow start sw-life-cycle --set scope=demo
started sw-life-cycle as sw-life-cycle-1-plan (active)                          # exit 0
$ wingfoil memory park sw-life-cycle-1-plan --reason "waiting for a decision"
error: illegal transition active -> (none) for type 'plan'
  docs/memory/plan/demo/sw-life-cycle-1-plan.md: illegal `park` from "active": not a `returns`
  state — `park` is only legal from a state that declares a return edge          # exit 1
```

Declaring a suspended state with a `returns` edge, committed:

```yaml
  plan:
    states:
      sequence: [ draft, parked, active, done ]
      waiting: [ active ]
      returns: { active: parked }
```

suspends and resumes an open instance:

```
$ wingfoil memory park sw-life-cycle-1-plan --reason "waiting for a decision"
{ "from": "active", "to": "parked", ... }                                        # exit 0
$ wingfoil workflow status
no open workflows                                                                # exit 0
$ wingfoil memory submit sw-life-cycle-1-plan
{ "from": "parked", "to": "active" }                                             # exit 0
$ wingfoil workflow status
open workflows: 1
* sw-life-cycle-1-plan (sw-life-cycle) — active                                 # exit 0
```

but every new plan now passes `parked`, so `workflow start` no longer starts an instance:

```
$ wingfoil workflow start sw-life-cycle --set scope=demo2
error: workflow is not open: sw-life-cycle-1-2-plan                              # exit 1
```

The command still commits `wf(plan): add` and `wf(plan): submit` for the new plan, which is left
`parked`. Placing `parked` after `active` instead puts it on every plan's path to `done`. `memory
park` follows a `returns` edge back to an earlier state of the sequence; it is not a suspension,
and no other verb suspends an instance.

## Expected

A designed way to suspend an open workflow instance and resume it later (for example a state the
type declares as a suspension, which `workflow start` and `workflow end` skip, entered and left by
dedicated verbs), with `workflow status` listing suspended instances apart from open ones. A pack
could then offer `parked` plans to the projects that use them (WingFoil-Templates dl-023 D1: "once
WingFoil's engine can suspend an instance").
