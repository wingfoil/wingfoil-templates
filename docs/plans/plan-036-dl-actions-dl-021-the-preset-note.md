---
id: plan-036-dl-actions-dl-021-the-preset-note
type: plan
title: "dl actions: dl-021, the preset note"
status: done
workflow: "decision-log-ingest"
phase: "rule"
tags: ["feedback","wingfoil"]
---

## Context

A point found while reviewing plan-033 (dl-021's configuration changes) and left out of it: the
`presets` module of `.wingfoil/dna.yaml` describes presets as "selectable with `wingfoil init
--preset`", a verb WingFoil has not planned (its closest element is dl-164, in discussion). F-006
already asks for `wingfoil init --preset <name>`, written before dl-021. The approver ruled on
2026-10-14: a feedback note that refines F-006's request in the light of dl-021 R1 and F-027 (a
preset selected at `init` and resolved like the default set, an explicit preset replacing the
default set, as presented to the approver), and the `presets` module reworded so that it does not
present the verb as existing. spec-001 §15 also names `wingfoil init --preset <id>`: an erratum
recorded in spec-001's Execution Notes (dl-020 R1), folded back by its next amendment.

As plan-030 hosts dl-021's first notes, no workflow phase hosts this work: it is filed under
`decision-log-ingest` › `rule`. A new note opens with "New note (task-NNN)."
(`tests/support/inbox.ts`), so it is written by a task, task-030, hosted by this plan.

## Steps

On the branch `feedback/f-030-preset`, from `main` at `fa51e0f`.

1. **task-030** through `tooling-delivery` v2: body reviewed independently (dl-017), accepted into
   the backlog by the approver, built, reviewed, approved, `done` on this branch; its `deliver` is
   this branch's merge.
2. **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
   `--no-ff` merge into `main`, push, the branch removed; then WingFoil gets the note's number and
   the merge commit, as for F-027 … F-029.

## Handoff

- **claude:** steps 1–2, except the approver's gates and the merge OK. It never runs
  `memory approve` or `memory reject`.
- **Approver:** the ruling above (given 2026-10-14); task-030's two gates; the merge OK.
- Done when task-030 is `done` and on `main`. The plan then goes `active → done`.

## Execution Notes

- 2026-10-14: written; `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-14: plan-036 and task-030 reviewed independently (approve after amendments: the
  "explicit preset replaces the default set" recorded as presented to the approver; the exact
  0.2.2 output; spec-001 §15's `init --preset` recorded as an erratum by the task; plan-036's
  commits excluded from the task's file check), amended. Plan submitted `active`, task-030
  `pending`.
- 2026-10-14: task-030 built, reviewed (approve after amendments, wording fixed), approved by the
  approver and `done`. CI run 38630873854 on `f20b61f`, conclusion `success`. The approver gave
  the merge OK in chat; `--no-ff` merge into `main`, push, branch removed; then WingFoil gets
  F-030's number and the merge commit. This plan goes `active → done`.
