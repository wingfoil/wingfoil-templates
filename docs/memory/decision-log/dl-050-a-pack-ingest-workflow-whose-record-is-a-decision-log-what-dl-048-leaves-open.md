---
id: dl-050-a-pack-ingest-workflow-whose-record-is-a-decision-log-what-dl-048-leaves-open
type: decision-log
title: "A pack-ingest workflow whose record is a decision-log: what dl-048 leaves open"
status: approved
tags: ["workflow","packs","ingest"]
---

## Context

Asked by the approver on 2026-11-23: propose a top-level workflow for the ingest of new packs.
dl-048 (pending, captured under plan-078) already states the problem: no written path from a pack
proposal to its charter (GOV-6 of dl-043), with its P1 (a rule naming the path) or its option 3 (a
workflow with a proposal type). This element does not restate dl-048. It records only what dl-048
leaves open, to be ruled with it. The approver's request of 2026-11-23 asks for the workflow, so
dl-048's option 3 is weighed again against P1; its cost (a type, a workflow and its tests) depends
on choices that dl-048 does not separate.

## Options

**Q1 — A workflow without a new Memory type.** dl-048's option 3 ties the workflow to a proposal
type.
- (a) The workflow's record is a decision-log, as dl-012's and dl-049's are: no new type, template
  or `memory.yaml` change. Its `capture` records the packs asked for (axis, name, purpose, requires
  and conflicts as far as known), how each meets the catalog's existing packs, the evidence each
  will need (preset, `check:runs`, examples) and the open questions.
- (b) As dl-048's option 3: a proposal type with its own machine.

**Q2 — Where the workflow stops.**
- (a) At the hand-off to `pack-cycle` › `charter`: `pack-cycle` is unchanged and stays the one
  place a pack is chartered, authored and released.
- (b) Including `pack-cycle`: a pack would then be run either by this main or by `sw-life-cycle`'s
  `pack-delivery`, two runs of one sub for one element, which the deduction cannot tell apart.

**Q3 — One request, several packs.** A request may ask for related packs (dl-049 asks for two):
one run per request, handing off one charter per pack in the order the ruling sets, or one run
per pack.

**Q4 — The vision step.** Always, or skipped when every pack already has its row (`F4.x`); and
whether the vision amendment has its own independent review (dl-017) and the approver's OK, as
plan-071's had.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **D1 — If the approver rules dl-048's option 3, as reshaped by Q1 (a) (no proposal type)**, the
  workflow takes Q1 (a), Q2 (a), Q3 one run per request and Q4 optional, reviewed and approved. Its
  phases:
  1. `capture` (facilitator): `memory.add(type: decision-log)` and `memory.submit` (`draft →
     pending`), with Q1 (a)'s contents; an independent review, amended while pending (dl-017). A
     proposal from outside enters here as a feedback item routed to `decision-log`, once this
     repository adopts `governance/feedback` (dl-048 option 2's route);
  2. `rule` (product-owner, approval by the approver): `memory.approve` (`pending → approved`),
     whose ruling also records a pack refused or deferred (dl-048 P1), so that only an accepted
     pack reaches `vision`; a reject back to `capture` is for a text that needs rework;
  3. `vision` (product-owner, approval by the approver; skipped when every pack already has its
     row): one row per pack in `docs/01_vision/06_features.md` and its place in
     `07_sequencer.md`, with their doc-versioning bumps; an independent review of the amendment
     before the approver's OK;
  4. `hand-off` (product-owner): one Execution Note on the decision-log naming, per pack, the
     `pack-cycle` charter plan that follows, in the order the ruling sets. `hand-off` does not
     settle the deviation that hosts a charter under `pack-delivery` (it selects `accepted` packs,
     while `charter` creates a `draft` one): the charter plan is hosted by the same deviation as
     plan-073 (and plan-041, plan-047, plan-056), until the owed item on `pack-delivery`'s selection
     over `accepted` packs is settled.
- **D2 — If the approver rules dl-048's P1**, Q3 and Q4 are written into the path as well: one
  decision-log per request, one charter per pack in the ruling's order, and the vision amendment
  reviewed and approved.
- **D3 — Application.** By the dl actions plan of dl-048 P2, under option 3 as reshaped by Q1 (a) in
  place of the tooling task it names, as plan-062 applied its decision-logs' workflow changes: the
  workflow file `.wingfoil/workflows/custom/pack-ingest.yaml`, its include in
  `.wingfoil/workflows.yaml` among the startable mains, `sw-life-cycle` 5 → 6 (its header naming
  `pack-ingest` as the entry of a new pack) and `pack-cycle` 7 → 8 (`charter`'s description naming
  it, the bump dl-048 P2 already names), with `workflow list` on the pinned CLI as the check
  (`wingfoil-cli` W-08: the includes checked by hand). With no type and no new mechanism, the
  workflow adds no `check:runs` scenario of its own: its phases are verbs the existing ingests
  already drive, and its first run (dl-049, D4) is recorded in its plan as pack-compatibility's
  evidence rule says for a run by hand. In the same commit, the owed item on the engine way of
  working names `pack-ingest` among the mains whose engine runs come first.
- **D4 — dl-049 is its first request.** dl-049 and plan-079 were captured through
  `decision-log-ingest` before the path was settled. Once it is (the workflow, or P1's written
  path), the remaining steps of dl-049 (rule, vision, hand-off) follow it: plan-079 closes with its
  `capture` done and records the move in its Execution Notes, and a new plan carries dl-049's ruling
  (under option 3 as reshaped by Q1 (a), a plan under `pack-ingest` › `rule`). Under option 3 the
  move is a mapping by hand, since the engine has no `workflow transfer` (the owed item on the
  engine way of working). Nothing already committed is rewritten.

## Execution Notes

- 2026-11-23 — captured in plan-080 (`decision-log-ingest`, `capture`), asked by the approver on
  2026-11-23. Prepared on another branch as a full proposal of the workflow, then reduced, before
  its import into main, to what dl-048 leaves open; the problem, the existing ingests and the path
  run by hand for `governance/feedback` are dl-048's. The findings of an independent review of the
  full proposal are carried into this text (the vision step's review and approval, the deviation
  `hand-off` leaves, a dl actions plan, the owed item of the engine way of working, how dl-049
  moves). An independent review of this text is owed before the approver's ruling (dl-017).
- 2026-11-23 — the independent review of this text (dl-017) done: approve after amendments, none a
  blocker; applied while pending: the refused or deferred pack recorded in the ruling, and the
  outside route (D1); option 3 named as reshaped by Q1 (a) (D1, D3, D4); the bumps named and why no
  `check:runs` scenario is added (D3); plan-073's hosting stated as the deviation (D1); the Context
  shortened to a pointer to dl-048.
- 2026-11-23 — renumbered on main: first imported as dl-044 (commits `ab3ac151` … `424c0575`), a
  number the retrospective's branch already held; the rewrite of those commits was refused by the
  repository's rules, so this element is dl-050 by a later commit that removes dl-044's file, and
  its text is reduced to what dl-048 leaves open. dl-044's `wf()` commits on main record that
  first id.
- 2026-11-23, plan-081: D1 and D3 applied: `pack-ingest` 1, its include in
  `.wingfoil/workflows.yaml` 4, `sw-life-cycle` 6 and `pack-cycle` 8, `workflow list` exit 0 with
  `pack-ingest` listed, and the row "The engine way of working" naming it among the mains whose
  engine runs come first (`0735c631`). D4: W10's order in the sequencer 1.8 (`620e3ed0`).
