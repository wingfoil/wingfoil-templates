---
id: plan-013-decision-log-ingest-capture-the-operations-slot
type: plan
title: "decision-log-ingest capture: the operations slot"
status: active
workflow: "decision-log-ingest"
phase: "capture"
tags: ["process","decision-log"]
---

## Context

The `capture` phase of `decision-log-ingest`, run from step 2 of plan-012 (`sw-life-cycle` ›
`specification`). dl-003 D11 left dl-001's `operations` slot open: it has to be ruled before spec-001
fixes the slot list.

The approver ruled in chat on 2026-10-06, choosing option (b): the functions of operations belong to
the stage overlays `stage/production` and `stage/maintenance`, and there is no `operations` slot in
0.x. The decision-log records the options and that ruling. The `rule` phase that follows is the
approver's `memory approve`, or `memory reject` back to `capture`.

## Steps

1. `npx wingfoil memory add --type decision-log --title "…"`, which creates dl-008 as `draft`.
2. Write Context, Options, Decision and Execution Notes, citing dl-001 D1, dl-003 D4/D11 and the
   feedback notes T2.
3. Commit the body by hand, with the Co-Authored-By trailer, before `submit` (notes N13).
4. `npx wingfoil memory submit <id>` (`draft → pending`).

Then hand the approver the `memory approve` command.

## Handoff

- **claude:** steps 1–4.
- **Approver:** the `rule` phase. spec-001 fixes the slot list only after it.
- A rejected decision-log comes back to `draft`, is corrected under this plan and submitted again.
  The plan stays `active` until the decision-log is approved.

## Execution Notes

- 2026-10-06: dl-008 was added (step 1) right after this plan, before this plan was filled and
  moved to `active`. The order has no effect on either element.
