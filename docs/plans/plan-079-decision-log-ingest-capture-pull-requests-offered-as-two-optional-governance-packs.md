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

The `capture` phase of `decision-log-ingest` for one decision-log: dl-049, pull requests offered as
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
5. An independent review of dl-049 (dl-017), amended while pending.
6. Hand the approver the command, with the full id (the pinned 0.2.2 resolves no short reference):

   ```bash
   npm run -s wingfoil -- memory approve dl-049-pull-requests-offered-as-two-optional-governance-packs-the-merge-through-a-pull-request-and-the-pull-request-as-a-conversation-with-the-agents --reason "…"
   ```

   or `memory reject` back to `capture`.

## Handoff

- **Agent:** steps 1–5. **Approver:** the ruling (step 6), including the options Q1–Q8.
- **After approval:** a vision amendment (D9), then `pack-cycle` for `governance/pull-request-merge`
  (its charter), then for `governance/pull-request-conversation` (D8). Each is its own plan.
- **If dl-048 and dl-050 are ruled first:** this plan closes with its `capture` done, and dl-049's
  ruling, vision and hand-off move to a new plan on the path they settle (dl-050 D4).
- **Done when:** dl-049 is `approved` and its follow-up plans are named here, or the move of dl-050
  D4 is recorded here.

## Execution Notes

- 2026-11-20 — steps 1–4 done in one session; the independent review (step 5) is still owed.
- 2026-11-23 — Prepared on a branch of another session and imported into main as new documents on
  2026-11-23; the branch was then deleted. On that branch this plan was numbered plan-078, a number
  `main` had given meanwhile to another plan, and its decision-log dl-043, a number held by the
  retrospective's decision-logs (dl-043 … dl-048): they are plan-079 and dl-049 here, and dl-049 and
  dl-050 cite them so.
  The details of the approver's discussion not written on the branch were added to dl-049's body
  while pending (its Execution Notes say which).
- 2026-11-23 — step 5 done: the independent review of dl-049 (dl-017), its findings amended while
  pending (dl-049's Execution Notes list them); step 6 gives the full id, the Handoff the move of
  dl-050 D4.
- 2026-11-23 — its decision-log renumbered on main from dl-043 to dl-049 by a later commit (the
  rewrite of the import's commits was refused by the repository's rules); this text cites dl-049.
- 2026-11-23, plan-081: the next step of this plan: after the `wingfoil-release-intake` that
  raises this repository's pin (W10, the sequencer 1.8, `620e3ed0`), it closes with its `capture`
  done and records the move of dl-049's remaining steps to `pack-ingest` (dl-050 D4, the workflow
  in `0735c631`); a new plan then carries dl-049's `rule`.
