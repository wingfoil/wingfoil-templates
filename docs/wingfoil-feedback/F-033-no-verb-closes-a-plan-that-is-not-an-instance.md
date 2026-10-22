---
id: F-033
title: "No verb closes a plan that is not a workflow instance"
kind: gap
status: open
wingfoil_version: 0.3.0
answered_by: []
---

New note (task-041). From this repository's plan-045 (ruling H) and dl-023 D1; it continues F-025,
which observed on 0.2.2 that no verb leaves a `waiting` state except `deprecate`.

## Observed

WingFoil 0.3.0 from npm, in a scratch project (`git init`, `wingfoil init --template Kanban`, one
commit). The scaffold's `plan` is `sequence: [draft, active, done]`, `waiting: [active]`. A phase
plan, added by hand for one phase of a running life cycle, its `parent` set by editing the draft
(`memory add --set` fills only id tokens, F-011):

```
$ wingfoil memory add --type plan --title "Inception phase" --set workflow=sw-life-cycle \
    --set phase=inception --set scope=demo                                       # exit 0
$ # parent: "sw-life-cycle.inception", committed
$ wingfoil memory submit sw-life-cycle-inception-plan
{ "from": "draft", "to": "active" }                                              # exit 0
$ wingfoil memory submit sw-life-cycle-inception-plan
error: illegal transition active -> (none) for type 'plan'
  ...: illegal `submit` from "active": a `waiting` state — its forward edge fires only via a
  Workflow action, not `submit`                                                  # exit 1
$ wingfoil memory approve sw-life-cycle-inception-plan --reason done
error: illegal transition active -> (none) for type 'plan'
  ...: illegal `approve` from "active": not a `gates` state — `approve` is only legal from a
  gate                                                                           # exit 1
$ wingfoil workflow end sw-life-cycle-inception-plan
error: unknown workflow: sw-life-cycle-inception-plan                            # exit 1
$ wingfoil workflow finalize sw-life-cycle-inception-plan
error: unknown workflow: sw-life-cycle-inception-plan                            # exit 1
```

Without `parent`, the same plan is taken for an instance of `sw-life-cycle`, and `workflow end`
refuses it: `error: workflow 'sw-life-cycle' is not complete: current step sw-life-cycle.inception`,
with the hint `wingfoil memory deprecate … abandons it` (exit 1).

What 0.3.0 changed since F-025: `submit` now says why it refuses a `waiting` state (its forward
edge "fires only via a Workflow action"), `workflow end` closes a plan that `workflow start`
started, and `workflow finalize` records a completed step of an open workflow. None of them closes
a plan that is not an open instance: the only verb that leaves `active` is `memory deprecate`,
which abandons it. A project that keeps one plan per phase therefore closes it with a hand-written
commit (WingFoil-Templates' `base` pack documents `wf(plan): finalize <id> [active → done]`).

## Expected

A designed verb that closes a plan that is not a workflow instance (a phase plan carrying
`parent`, or a plan added by `memory add`) along its `waiting` edge, recorded in its history like
`workflow end`; or `workflow end` accepting such a plan when its `parent`'s step is recorded
complete.
