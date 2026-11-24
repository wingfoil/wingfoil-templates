---
id: plan-083-pack-ingest-rule-governance-wingfoil-dogfood
type: plan
title: "pack-ingest rule: governance/wingfoil-dogfood"
status: done
workflow: "pack-ingest"
phase: "rule"
tags: ["dogfood","pack","governance","pack-ingest"]
---

## Context

The `rule` phase of `pack-ingest` for dl-051, the request for `governance/wingfoil-dogfood`
captured by plan-082. The approver approved dl-051 on 2026-11-24 (`bf29bbf2`, `pending →
approved`): D1 … D5 are rulings. This plan records the ruling and applies what D2 and D3 ask at
approval; `hand-off` follows in its own plan.

**`main`'s CI before this plan** (`repository-practice` rule 3): plan-081's close push,
`80d42ae1`, run 45356585730 `success`, its jobs (22.12.0, 1) 12 min 24 s, (22.21.0, 1)
15 min 47 s, (22.12.0, 2) 6 min 19 s, (22.21.0, 2) 6 min 58 s, read here (plan-081 point 11).

## Steps

1. An Execution Note on dl-003 and one on dl-012 (dl-051 D2): "the known behaviours of the pinned
   CLI" read as the mechanism the pack ships, the entries staying with each project's pin, rules 3
   and 5 pointing at the project's entries file; the bodies stay as approved.
2. An Execution Note on dl-051: the ruling, and `vision` skipped (D3: F4.2 already has its row and
   its place in W10; the pinned WingFoil has no skip).
3. `check:texts` and the privacy check of the staged diff (`repository-practice` rules 2, 5), one
   commit; then this plan's close.

## Handoff

- **Agent:** steps 1 … 3; the notes are records of a ruling already given, reviewed with the
  hand-off plan's review (dl-017).
- **Done when:** the notes are committed and the plan of `hand-off` is named here.

## Execution Notes

- 2026-11-24: steps 1 … 3 done: the notes on dl-003, dl-012 and dl-051 committed with this plan's
  body.
- 2026-11-24 — closed: rule done; plan-084 carries `hand-off`.
