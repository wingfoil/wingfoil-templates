---
id: plan-016-decision-log-ingest-capture-matrix-validation-before-v0.3-and-the-first-real-catalog-and-compat-files
type: plan
title: "decision-log-ingest capture: matrix validation before v0.3 and the first real catalog and compat files"
status: active
workflow: "decision-log-ingest"
phase: "capture"
tags: ["process","decision-log","tooling"]
---

## Context

The `capture` phase of `decision-log-ingest`, run from step 1 of plan-015 (`sw-life-cycle` ›
`tooling`). Two decisions are needed before the tooling tasks that depend on them:
- **dl-009, spec-001 O10.** No released WingFoil accepts the `format:` key without a warning: 0.2.2
  prints `unknown field(s) ignored: format`, so `compat.yaml` marks it `format_key: false`. Fixtures
  that follow spec-001 §5 cannot pass the zero-warning matrix (`pack-compatibility`) on any released
  WingFoil. spec-001 gives the decision to the tooling phase. Blocks task 8 (F3.3).
- **dl-010, the first real `catalog.yaml` and `compat.yaml`.** M0 closed with spec-001 and the
  schemas, not with committed files (plan-012, review N9). They arrive with the tooling or with
  `base`. Blocks task 4 (the resolver reads the axes and slots from `catalog.yaml`, spec-001 §3) and
  task 8.

The approver agreed on 2026-10-06 that both are captured with the recommendations presented with
plan-015 as proposals, the options staying recorded for the ruling. The `rule` phase that follows
is the approver's `memory approve`, or `memory reject` back to `capture`.

## Steps

For each decision-log, in order (dl-009, then dl-010):

1. `npx wingfoil memory add --type decision-log --title "…"`, which creates the `draft`.
2. Write Context, Options (each with what speaks for and against it), Decision (the proposal, ruled
   at `approve`) and the configuration changes it implies.
3. Commit the body by hand, with the Co-Authored-By trailer, before `submit` (notes N13).
4. `npx wingfoil memory submit <id>` (`draft → pending`).

## Handoff

- **claude:** steps 1–4.
- **Approver:** the `rule` phase, in the chained command handed with plan-015 step 1.
- A rejected decision-log comes back to `draft`, is corrected under this plan and submitted again.
  The plan stays `active` until both are approved.

## Execution Notes
- 2026-10-06: dl-009 (`e1dab70`, `5820a36`) and dl-010 (`467c8e3`, `db1e51d`) filled and submitted,
  both `pending`, each with its proposal in the Decision section.
