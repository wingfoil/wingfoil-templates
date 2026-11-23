---
id: plan-080-decision-log-ingest-capture-a-top-level-pack-ingest-workflow
type: plan
title: "decision-log-ingest capture: a top-level pack-ingest workflow"
status: active
workflow: "decision-log-ingest"
phase: "capture"
tags: ["decision-log","workflow","pack"]
---

## Context

The `capture` phase of `decision-log-ingest` for dl-050: a `pack-ingest` workflow whose record is
a decision-log, reduced to what dl-048 (the path from a pack proposal to its charter) leaves open.
Asked by the approver on 2026-11-23. The `rule` phase that follows is the approver's, with
dl-048's.

## Steps

1. `npm run -s wingfoil -- memory add --type decision-log --title "…" --tags …`: the draft.
2. Write Context, Options (Q1–Q4) and the proposed Decision (D1–D4); commit the body by hand with
   the Co-Authored-By trailer, before `submit` (`wingfoil-cli` W-04).
3. The privacy check of the staged diff (`repository-practice` rule 2).
4. `npm run -s wingfoil -- memory submit <id>`: `draft → pending`.
5. An independent review of dl-050 (dl-017), amended while pending.
6. Hand the approver the command, with the full id (the pinned 0.2.2 resolves no short reference):

   ```bash
   npm run -s wingfoil -- memory approve dl-050-a-pack-ingest-workflow-whose-record-is-a-decision-log-what-dl-048-leaves-open --reason "…"
   ```

   or `memory reject`.

## Handoff

- **Agent:** steps 1–5. **Approver:** the ruling (step 6), together with dl-048's.
- **After approval:** dl-048 P2's dl actions plan applies it (D3); dl-049 follows the path settled
  (D4).
- **Done when:** dl-050 is `approved` and the dl actions plan that applies it is named here.

## Execution Notes

- 2026-11-23 — steps 1–4 done.
- 2026-11-23 — Prepared on a branch of another session and imported into main as new documents on
  2026-11-23; the branch was then deleted. On that branch this plan was numbered plan-079 and its
  decision-log dl-044, numbers held meanwhile here by dl-049's capture plan (plan-079) and by
  the retrospective's decision-logs (dl-043 … dl-048): they are plan-080 and dl-050 here. Before the
  import, the decision-log was reduced to what dl-048 leaves open. An independent review of the
  full proposal was done; one of the reduced text (step 5) is still owed.
- 2026-11-23 — step 5 done: the independent review of dl-050 (dl-017), approve after amendments,
  none a blocker; applied while pending (dl-050's Execution Notes list them).
- 2026-11-23 — its decision-log renumbered on main from dl-044 to dl-050 by a later commit (the
  rewrite of the import's commits was refused by the repository's rules), and reduced to what
  dl-048 leaves open; this plan keeps its first id and title, and its text cites dl-050.
- 2026-11-23 — closed: capture done, dl-050 approved by the approver on 2026-11-23 (`8ce834d0`),
  applied by plan-081. Closed now by the approver's ruling of 2026-11-23, which takes this close
  out of W10's order (plan-081 point 8); dl-049's path stays there.
