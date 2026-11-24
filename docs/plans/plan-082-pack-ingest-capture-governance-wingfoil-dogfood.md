---
id: plan-082-pack-ingest-capture-governance-wingfoil-dogfood
type: plan
title: "pack-ingest capture: governance/wingfoil-dogfood"
status: active
workflow: "pack-ingest"
phase: "capture"
tags: ["dogfood","pack","governance","pack-ingest"]
---

## Context

The `capture` phase of `pack-ingest` (version 1, plan-081) for one request: the pack
`governance/wingfoil-dogfood` (F4.2), the next step of W10 in the sequencer 1.8. Asked by the
approver on 2026-11-24. The request is recorded as dl-051 (dl-050 Q1 (a)). This is the first run
started under `pack-ingest`; since the workflow adds no `check:runs` scenario of its own, this plan
and the next ones record the run by hand as pack-compatibility's evidence rule says (dl-050 D3).

The `rule` phase that follows is the approver's (`memory approve` or `memory reject` back to
`capture`), carried by its own plan. `vision` is expected to be skipped (F4.2 already has its row
and its place in W10, dl-051 D3); `hand-off` names the charter plan.

## Steps

1. `npm run -s wingfoil -- memory add --type decision-log`: the draft dl-051 (facilitator).
2. Write Context, Options (the pack asked for, how it meets the catalog, Q1 … Q6) and the proposed
   Decision (D1 … D5); commit the body by hand with the Co-Authored-By trailer, before `submit`
   (`wingfoil-cli` W-04), after `check:texts` and the privacy check (`repository-practice` rules 2,
   5).
3. `npm run -s wingfoil -- memory submit <id>`: `draft → pending`.
4. An independent review of dl-051 (dl-017), amended while pending; its record (dl-017 R3) in
   dl-051's Execution Notes.
5. Hand the approver the command, with the full id (the pinned 0.2.2 resolves no short reference):

   ```bash
   npm run -s wingfoil -- memory approve dl-051-governance-wingfoil-dogfood-the-wingfoil-upstream-pack-its-scope-and-its-charter --reason "…"
   ```

   or `memory reject`, in the plan of `rule`.

## Handoff

- **Agent:** steps 1 … 4. **Approver:** the ruling (step 5), in the plan of `rule`.
- **Done when:** dl-051 is `pending` with its review recorded, and this plan names the plan that
  carries `rule`.

## Execution Notes

<!-- Filled while the plan runs: deviations, blockers, decisions taken, WingFoil friction
     (also recorded in docs/wingfoil-feedback/). An owed item gets its row in docs/owed-items.md
     (repository-practice rule 4). -->
- 2026-11-24: steps 1 … 3 done: dl-051 added (`abebce42`), its body and this plan's committed
  (`52701fdb`), this plan `draft → active` (`9d5ec56f`), dl-051 `draft → pending` (`5e5d0da0`).
- 2026-11-24: step 4 done: the independent review of dl-051 (dl-017), approve after amendments, no
  blocker, five should-fix and seven nits, applied while pending but the sequencer's stale W10
  state row, which gets its row in `docs/owed-items.md` (dl-051's Execution Notes record it).
- 2026-11-24: re-review of dl-051's amendments: approve after one should-fix and two nits, applied
  while pending (dl-051's Execution Notes). Step 5 is the approver's.
- 2026-11-24 — closed: capture done, dl-051 approved by the approver on 2026-11-24 (`bf29bbf2`);
  plan-083 carries `rule` (the ruling's record and D2's notes), `vision` skipped there (dl-051 D3).
