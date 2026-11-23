---
id: plan-080-decision-log-ingest-capture-a-top-level-pack-ingest-workflow
type: plan
title: "decision-log-ingest capture: a top-level pack-ingest workflow"
status: draft
workflow: "decision-log-ingest"
phase: "capture"
tags: ["decision-log","workflow","pack"]
---

## Context

The `capture` phase of `decision-log-ingest` for dl-044: a top-level `pack-ingest` workflow, the
entry of a request for a new pack. Asked by the approver on 2026-11-23. The `rule` phase that
follows is the approver's.

## Steps

1. `npm run -s wingfoil -- memory add --type decision-log --title "…" --tags …`: the draft.
2. Write Context, Options (Q1–Q4) and the proposed Decision (D1–D5); commit the body by hand with
   the Co-Authored-By trailer, before `submit` (`wingfoil-cli` W-04).
3. The privacy check of the staged diff (`repository-practice` rule 2).
4. `npm run -s wingfoil -- memory submit <id>`: `draft → pending`.
5. An independent review of dl-044 (dl-017), amended while pending.
6. Hand the approver the command: `npm run -s wingfoil -- memory approve dl-044 --reason "…"`, or
   `memory reject`.

## Handoff

- **Agent:** steps 1–5. **Approver:** the ruling (step 6).
- **After approval:** a `tooling-change` run writes the workflow (D4); dl-043 continues under it
  (D5).
- **Done when:** dl-044 is `approved` and the `tooling-change` plan that applies it is named here.

## Execution Notes

- 2026-11-23 — steps 1–4 done; the independent review (step 5) is still owed.
- 2026-11-23 — Prepared on a branch of another session and imported into main as new documents on
  2026-11-23; the branch was then deleted. On that branch this plan was numbered plan-079, a number
  `main` has given to dl-043's capture plan: it is plan-080 here, and dl-044 cites it so.
