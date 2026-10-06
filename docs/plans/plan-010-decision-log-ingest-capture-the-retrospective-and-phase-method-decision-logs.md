---
id: plan-010-decision-log-ingest-capture-the-retrospective-and-phase-method-decision-logs
type: plan
title: "decision-log-ingest capture: the retrospective and phase-method decision-logs"
status: active
workflow: "decision-log-ingest"
phase: "capture"
tags: ["process","decision-log"]
---

## Context

The `capture` phase of `decision-log-ingest`, run once for a batch of two decision-logs that the
approver asked for on 2026-10-06 ("apri dl-006 per la retrospective ed un altro per
l'implementazione delle metodologie"). Both come from the session that compared the phases of the
four governed repositories and found which phases follow a named method:
- **dl-006:** this repository's life cycle has no retrospective; WingFoil2, UI and Benchmark have one.
- **dl-007:** how packs declare and implement the method each phase follows. It builds on dl-003 D11
  (the `release` slot) and on feedback note T16 (a per-phase `method` key in WingFoil's format).

The `rule` phase that follows is the approver's: `memory approve`, or `memory reject` back to
`capture`.

## Steps

For each of the two decision-logs, in order (retrospective, phase methods):

1. `npx wingfoil memory add --type decision-log --title "…" --tags …`, which creates the `draft`.
2. Write Context, Options, Decision, Execution Notes. Points the approver has not ruled yet are
   marked *proposed*: they become rulings when the element is approved.
3. Commit the body by hand, with the Co-Authored-By trailer, before `submit` (notes N13).
4. `npx wingfoil memory submit <id>`, which moves the element `draft → pending`.

Then hand the approver the list of `memory approve` commands.

## Handoff

- **claude:** steps 1–4.
- **Approver:** the `rule` phase.
- The configuration changes the two decision-logs imply (a `retrospective` workflow, the
  `pack-authoring` method rule) are applied only after approval, each bumping its `version:`.
- A rejected decision-log comes back to `draft`. It is corrected and submitted again under this
  plan, and the plan stays `active` until both are approved.

## Execution Notes
