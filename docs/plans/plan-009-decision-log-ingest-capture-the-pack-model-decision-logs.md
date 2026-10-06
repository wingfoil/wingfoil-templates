---
id: plan-009-decision-log-ingest-capture-the-pack-model-decision-logs
type: plan
title: "decision-log-ingest capture: the pack-model decision-logs"
status: active
workflow: "decision-log-ingest"
phase: "capture"
tags: ["inception","decision-log"]
---

## Context

The `capture` phase of `decision-log-ingest`, run once for the batch of five decision-logs of the
pack-model sub-phase (plan-008). The approver chose one plan per batch on 2026-10-05. The `rule`
phase that follows is the approver's: `memory approve`, or `memory reject` back to `capture`.

## Steps

For each of the five decision-logs, in order (pack model, compatibility, foundation, identifiers,
repository governance):

1. `npx wingfoil memory add --type decision-log --title "…" --tags …`, which creates the `draft`.
2. Write Context, Options, Decision, Execution Notes.
3. Commit the body by hand, with the Co-Authored-By trailer. This must happen before `submit`
   (notes N13: `submit` silently commits uncommitted body edits).
4. `npx wingfoil memory submit <id>`, which moves the element `draft → pending`.

Then hand the approver the list of `memory approve` commands.

## Handoff

- **claude:** steps 1–4.
- **Approver:** the `rule` phase.
- A rejected decision-log comes back to `draft`. It is corrected and submitted again under this
  plan, and the plan stays `active` until every element is approved.

## Execution Notes
