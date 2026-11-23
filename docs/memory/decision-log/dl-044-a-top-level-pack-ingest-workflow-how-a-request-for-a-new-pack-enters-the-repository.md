---
id: dl-044-a-top-level-pack-ingest-workflow-how-a-request-for-a-new-pack-enters-the-repository
type: decision-log
title: "A top-level pack-ingest workflow: how a request for a new pack enters the repository"
status: draft
tags: ["workflow","packs","ingest"]
---

## Context

Asked by the approver on 2026-11-23: propose a top-level workflow for the ingest of new packs. Today
the repository has a startable main for capturing a decision-log (`decision-log-ingest`), an ADR
(`adr-ingest`) and a bug (`bug-ingest`), and two for the life of a pack that already exists
(`pack-release`, `pack-deprecation`). It has none for a request for a **new** pack. A new pack is
reached only through `pack-cycle`, a sub that `sw-life-cycle`'s `pack-delivery` phase iterates over
the `pack` elements; its first phase, `charter`, creates the `pack` element itself
(`memory.add(type: pack)`). So the step before the charter — someone asks for a pack, the approver
decides whether the catalog should have it, the vision gains its feature row — has no workflow: it
was run by hand for `governance/feedback` (dl-012, then the vision amendment of plan-071, then the
charter of plan-073), and it is being run by hand again for the pull-request packs (dl-043,
plan-079).

## Options

**Q1 — What the workflow covers.**
- (a) **The intake only**, up to the charter: capture the request, the approver's ruling, the vision
  amendment, then the hand-off to `pack-cycle`'s `charter`. `pack-cycle` is unchanged and stays the
  one place a pack is chartered, authored and released.
- (b) **The intake and the whole cycle**: a main that includes `pack-cycle` after the ruling. A pack
  would then be run either by this main or by `sw-life-cycle`'s `pack-delivery`, two runs of one sub
  for one element, which the deduction cannot tell apart.

**Q2 — What the request is recorded as.**
- (a) A `decision-log`, as dl-012 and dl-043 are: the question, the options, the proposed scope; no
  new type.
- (b) A new Memory type `pack-request` with its own machine: a precise record, but a new type, a
  template and a `memory.yaml` change for something the decision-log already holds.

**Q3 — One request, several packs.** A request may ask for related packs (dl-043 asks for two).
Whether one run covers the request and hands off one charter per pack, in the order the ruling sets,
or one run per pack.

**Q4 — The vision step.** Always, or optional when the features list already has the pack's row
(`F4.x`).

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **D1 — Scope (Q1 (a)).** A startable main `pack-ingest`, covering the intake only. Its phases:
  1. `capture` (facilitator): `memory.add(type: decision-log)` and `memory.submit` (`draft →
     pending`) — the request, the packs it asks for (axis, name, purpose, requires and conflicts as
     far as known), how each meets the catalog's existing packs, the evidence each will need
     (preset, `check:runs`, examples) and the open questions; an independent review, amended while
     pending (dl-017);
  2. `rule` (product-owner, approval by the approver): `memory.approve` (`pending → approved`), or a
     reject back to `capture`;
  3. `vision` (product-owner, optional when every pack already has its row, Q4): one row per pack in
     `docs/01_vision/06_features.md` and its place in `07_sequencer.md`, with their doc-versioning
     bumps;
  4. `hand-off` (product-owner): one Execution Note on the decision-log naming, per pack, the
     `pack-cycle` charter plan that follows, in the order the ruling sets; the charter then runs
     under `sw-life-cycle`'s `pack-delivery`, unchanged.
- **D2 — Record (Q2 (a)).** The request is a decision-log; no new Memory type.
- **D3 — Several packs (Q3).** One run per request; one charter per pack, in the ruling's order.
- **D4 — Applied by a `tooling-change` run**, once this element is approved: the workflow file
  `.wingfoil/workflows/custom/pack-ingest.yaml`, its include in `.wingfoil/workflows.yaml` among the
  startable mains, the comment of `sw-life-cycle.yaml` naming it as the entry of a new pack, and
  `workflow list` on the pinned CLI as the check (`wingfoil-cli` W-08: the includes checked by
  hand).
- **D5 — dl-043 is its first request.** dl-043 and plan-079 were captured through
  `decision-log-ingest` before this workflow existed; once `pack-ingest` exists, the remaining steps
  of dl-043 (rule, vision, hand-off) run under it, and plan-079 records the move in its Execution
  Notes. Nothing already committed is rewritten.

## Execution Notes

- 2026-11-23 — captured in plan-080 (`decision-log-ingest`, `capture`), asked by the approver on
  2026-11-23. An independent review is owed before the approver's ruling (dl-017).
- 2026-11-23 — prepared on another branch, where its capture plan was plan-079 and dl-043's was
  plan-078, and imported into main as a new document; the plans are plan-080 and plan-079 here, and
  this element cites them so.
