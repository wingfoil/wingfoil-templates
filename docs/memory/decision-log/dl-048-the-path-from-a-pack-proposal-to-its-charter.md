---
id: dl-048-the-path-from-a-pack-proposal-to-its-charter
type: decision-log
title: "The path from a pack proposal to its charter"
status: pending
tags: ["process","packs","workflow"]
---

## Context

Asked by the approver at plan-078's `additional-points` (2026-11-21): is there an ingest workflow
for new packs? There is none (the inventory of 2026-11-21, P3). The ingest workflows are
`adr-ingest`, `bug-ingest` and `decision-log-ingest`; `pack-cycle` › `charter` starts at
`memory.add(type: pack)`, the charter itself. The packs of the later waves entered by a path no
text writes down: a decision-log captured under `decision-log-ingest` (dl-011, dl-012 and dl-013,
plan-020), a vision amendment placing the feature in a wave (plan-071: F4.9 in W10), then
`pack-cycle` › `charter` (plan-073). Nothing says how a pack proposed from outside (a contributor,
an adopter, a feedback item `governance/feedback` routes) reaches a charter. Related: the open row
"`pack-delivery`'s selection over `accepted` packs (`charter` creates a `draft` pack)". Neither
`base` nor `software` ships a pack ingest, so the adoption (W10) does not fix it. Candidate GOV-6
of dl-043 (C5).

## Options

1. **As today:** unwritten. Rejected: the approver could not find it.
2. **A rule naming the path:** a pack proposal, from inside or outside, is captured as a
   decision-log under `decision-log-ingest` (an outside one first as a feedback item routed to
   `decision-log`, once this repository adopts `governance/feedback`); its approval places the pack
   in a wave by a vision amendment; the wave's plan starts `pack-cycle` › `charter` by hand, as
   plan-073 did. Written in `pack-cycle` › `charter`'s description and in `sw-life-cycle`'s
   header.
3. **A workflow `pack-ingest`:** a main with `capture` (a proposal element: the need, the axis, the
   slot, the requires, who proposes it), `triage` (the approver: accept into a wave, defer or
   refuse) and `route` (a decision-log and the vision amendment, or a refusal recorded); a Memory
   type for the proposal. More to keep: a type, a workflow and its tests, for a step taken a few
   times a year.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **P1 — Option 2**, unless the approver rules option 3: the path written as above; a proposal
  refused or deferred is recorded in its decision-log's ruling.
- **P2 — Applied after approval** by a dl actions plan: `pack-cycle` 7 → 8 (`charter`'s
  description; shared with dl-044's bump if both are approved) and `sw-life-cycle` 5 → 6 (its
  header: today a wave's plan starts `charter` by hand, `pack-delivery` iterating `accepted` packs
  only). The row "`pack-delivery`'s selection over `accepted` packs" stays with its owner (W10,
  trigger the adoption). Under option 3, a tooling task for the type and the workflow, with
  `check:runs` scenarios.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-21: written under plan-078 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-043, as the approver kept it at the checkpoint (the inventory of 2026-11-21, P2, P3).
- 2026-11-21: independent review: approve after amendments; one should-fix (the path written in
  `pack-cycle` › `charter` and `sw-life-cycle`'s header, not `pack-authoring`; the row left to its
  owner) and two nits (the bumps named; the outside route through `governance/feedback`), applied.
- 2026-11-21: re-review: approve; one nit (the shared bumps), covered by dl-043 D3.
