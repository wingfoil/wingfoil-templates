---
id: plan-079-decision-log-ingest-capture-pull-requests-offered-as-two-optional-governance-packs
type: plan
title: "decision-log-ingest capture: pull requests offered as two optional governance packs"
status: active
workflow: "decision-log-ingest"
phase: "capture"
tags: ["decision-log","governance","pull-request"]
---

## Context

The `capture` phase of `decision-log-ingest` for one decision-log: dl-043, pull requests offered as
two optional governance packs (the merge through a pull request; the pull request as a conversation
with the agents), with their examples and tests. Asked by the approver on 2026-11-20, with the
instruction that neither this repository nor WingFoil adopts the packs now: they are an offer of the
catalog. The `rule` phase that follows is the approver's.

## Steps

1. `npm run -s wingfoil -- memory add --type decision-log --title "…" --tags …` (pack-author /
   facilitator): the draft.
2. Write Context, Options (Q1–Q8) and the proposed Decision (D1–D10), and commit the body by hand
   with the Co-Authored-By trailer, before `submit` (`wingfoil-cli` W-04).
3. The privacy check of the staged diff (`repository-practice` rule 2).
4. `npm run -s wingfoil -- memory submit <id>`: `draft → pending`.
5. An independent review of dl-043 (dl-017), amended while pending.
6. Hand the approver the command: `npm run -s wingfoil -- memory approve dl-043 --reason "…"`, or
   `memory reject` back to `capture`.

## Handoff

- **Agent:** steps 1–5. **Approver:** the ruling (step 6), including the options Q1–Q8.
- **After approval:** a vision amendment (D9), then `pack-cycle` for `governance/pull-request-merge`
  (its charter), then for `governance/pull-request-conversation` (D8). Each is its own plan.
- **Done when:** dl-043 is `approved` and its follow-up plans are named here.

## Execution Notes

- 2026-11-20 — steps 1–4 done in one session; the independent review (step 5) is still owed.
- 2026-11-23 — Prepared on a branch of another session and imported into main as new documents on
  2026-11-23; the branch was then deleted. On that branch this plan was numbered plan-078, a number
  `main` had given meanwhile to another plan: it is plan-079 here, and dl-043 and dl-044 cite it so.
  The details of the approver's discussion not written on the branch were added to dl-043's body
  while pending (its Execution Notes say which).
