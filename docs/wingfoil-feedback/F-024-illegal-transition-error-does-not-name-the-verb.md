---
id: F-024
title: "The illegal-transition error does not say which verb or state is expected"
kind: gap
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-026). From the periodic retrospective of 2026-10-12 (plan-025; `wingfoil-cli` W-06).

## Observed

WingFoil 0.2.2 from npm, in a scratch project (`git init`, then `wingfoil init --template
Kanban`), default state machine `draft → pending (gate) → approved`:

```
$ wingfoil memory add --type decision-log --title "D"
$ wingfoil memory approve dl-001-d --reason x
error: illegal transition draft -> approved for type 'decision-log'          # exit 1
$ wingfoil memory submit dl-001-d                           # draft -> pending, exit 0
$ wingfoil memory submit dl-001-d
error: illegal transition pending -> (none) for type 'decision-log'           # exit 1
```

The second error is printed when the element sits in a gated state: the next step is `approve`,
but the message says the state has no target (`(none)`). The first does not say that `approve`
only passes a gate and that the next step from `draft` is `submit`.

## Expected

The error names the current state, the verb that moves it forward (for a gated state: `approve`,
or `reject`) and the state that verb reaches; `(none)` is not printed for a state that has a gate.
