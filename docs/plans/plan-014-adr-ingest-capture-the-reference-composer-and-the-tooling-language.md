---
id: plan-014-adr-ingest-capture-the-reference-composer-and-the-tooling-language
type: plan
title: "adr-ingest capture: the reference composer and the tooling language"
status: draft
workflow: "adr-ingest"
phase: "capture"
tags: ["architecture","adr"]
---

## Context

The `capture` phase of `adr-ingest`, run as architect from step 3 of plan-012 (`sw-life-cycle` ›
`specification`). It covers one batch of two ADRs, one for each architecture choice of the features
review that the approver ruled on 2026-10-06 (`docs/01_vision/06_features.md`, "Decisions from the
features review" 1 and 2). dl-005's Execution Notes route both choices here rather than to a
decision-log. The approver asked on 2026-10-06 for two separate ADRs.

- **The reference composer** (F3.2, option c). This repository keeps a minimal composer for
  validation, and proposes it to WingFoil as its implementation (feedback notes T15).
- **The tooling language** (F3): TypeScript on Node.js ≥ 22.12, as WingFoil.

The `approve` phase that follows is the approver's: `memory approve`, or `memory reject` back to
`capture`. The batch is handed to the approver together with spec-001, at plan-012's phase gate.

## Steps

For each ADR, in order (composer, then language):

1. `npx wingfoil memory add --type adr --title "…"`, which creates the `draft`.
2. Write Context, Decision, Consequences and the requirements it implements (`architecture`
   directive), with Alternatives.
3. Commit the body by hand, with the Co-Authored-By trailer, before `submit` (notes N13).
4. `npx wingfoil memory submit <id>` (`draft → pending`).

Then add the composer ADR's id to feedback note T15, which stays uncommitted (dl-005 G3).

## Handoff

- **claude:** steps 1–4 and the T15 update.
- **Approver:** the `approve` phase, at plan-012's phase gate.
- A rejected ADR comes back to `draft`, is corrected under this plan and submitted again. The plan
  stays `active` until both ADRs are approved.

## Execution Notes
