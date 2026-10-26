---
id: dl-026-a-methodology-s-delivery-may-include-release-and-retrospective-through-its-own-sub-workflows
type: decision-log
title: "A methodology's delivery may include release and retrospective through its own sub-workflows"
status: approved
tags: ["packs","software","methodology","scrum","W8"]
---

## Context

`software`'s `delivery` contract (`pack-foundation-software`, R2 and R-11, accepted under
plan-041) says the methodology's `delivery` includes `release`, with `iterate_over: release` and
`where: { status: [in-development] }`, and `base`'s `retrospective`, by name at its own cadence.
spec-001 §9 says `delivery` includes `release` and `retrospective` by name, and the lint
`life-cycle-includes` checks it on the file `workflows/delivery.yaml` alone: each must be the
`include` of one of its phases.

plan-047, the charter of `methodology/scrum`, follows the Scrum Guide (November 2020): Sprints are
fixed-length, sequential and repeated; an Increment may be released before a Sprint ends, and the
Sprint Review is never a gate to releasing it. Its rulings 1 and 2 make the Sprint a Memory type of
its own, separate from `release`, and put the Sprints and the releases side by side as phases of
`delivery`.

A run on WingFoil 0.3.0 (plan-047 steps 2–3, 2026-10-26) showed that shape cannot work. WingFoil
evaluates a workflow's phases in order; a phase that completes other than vacuously closes every
earlier `iterate_over` phase, whose new candidates are then reported `late` and never run. Once
Sprint 1's retrospective or one release completed, a new Sprint was `late`. `sw-life-cycle`
includes `delivery` once, so under the contract as written a project gets one Sprint in its whole
life. `optional: true` does not change it.

The same run showed a shape that works: one `iterate_over: sprint` phase, whose `sprint` sub
(bound to `element: sprint`) holds the Sprint's planning, an optional phase that adds a release,
its backlog items, an optional `release` phase (`iterate_over: release`, `where: { status:
[in-development] }`, `include: release`), the Sprint Review and `retrospective`. The optional
phases run side by side with the review; Sprint n+1, added by `memory add`, joins the live
iteration; with no Sprint open, `delivery` completes. In that shape `release` and `retrospective`
are included by the methodology's sub, not by `delivery` itself. One point the run left open, for
`scrum`'s charter review with `software`'s fixture as the reference: a release that left
`in-development` dropped from the frontier, since WingFoil skips a candidate outside the `where`
status that has not progressed. The closing rule applies to every live query, a leaf phase with a
selection included, not only to `iterate_over` phases.

The question needs an answer before `scrum`'s charter is written, because the charter must state a
`delivery` that the contract, spec-001 and the lint accept.

## Options

1. **Widen the contract:** `delivery` includes `release` and `retrospective` directly or through a
   sub-workflow the methodology ships; spec-001 §9 and the lint follow.
2. **Keep the contract as written:** `scrum` runs one Sprint per project on WingFoil 0.3.0, which
   is not Scrum.
3. **Wait for WingFoil:** ask for an `iterate_over` phase that stays open to new candidates, and
   leave `scrum` unchartered until a release provides it.

## Decision

Ruled by the approver, Roberto Pompermaier, in chat on 2026-10-26 (plan-047 ruling 13): **option
1, with option 3's feedback note.** The points below take effect when this element is approved.

- **D1 — The contract.** A methodology's `delivery` includes `release` and `retrospective`
  directly or through sub-workflows the same methodology ships, at any depth, each of those
  workflows shipped in the same part (`contents` or the conditional part, spec-001 §6.5).
  Where `release` is included, the including phase iterates over `release` with
  `where: { status: [in-development] }`, and the methodology creates its releases and moves them to
  `in-development`, as before. Everything else of the contract stands: the name `delivery`,
  `kind: sub`, no `element`, `sw-life-cycle` including it without iterating. A sub-workflow may be
  included by several phases, and `release` need not be reached on every path. dl-003 D4 and D11,
  as dl-022 reads them, are read with D1: "includes" means directly or through the methodology's
  own sub-workflows; those elements are not edited.
- **D2 — spec-001** says the same: §9 of `delivery`, in place of "includes `release` and
  `retrospective` by name"; the §2 term "slot" and the `release` row of §9's table; §11, that a
  slot's `included_by` names the root that reaches it (`catalog.yaml`'s data is unchanged); §18,
  that every workflow `delivery` reaches is shipped in the same part. An Execution Note records the
  amendment (dl-020 does not apply: this is a ruling, not an erratum).
- **D3 — The lint** `life-cycle-includes` checks D1 for a methodology's `delivery`: following
  `include` names only into workflows the pack itself ships (never `software`'s or `base`'s), with
  a visited set against cycles, `release` and `retrospective` are each included by `delivery` or
  by a workflow it reaches; every reached workflow is shipped in the same part as `delivery`
  (spec-001 §6.5); every phase that includes `release` has `iterate_over: release` and
  `where: { status: [in-development] }`. Its messages name the rule as amended. A tooling task, red
  first (dl-018), task-051; `validate --overlay tests/fixtures/software-exit` stays
  green, `methodology/fixture` including both directly.
- **D4 — `pack-foundation-software`'s charter**, accepted, is amended in place: its `delivery`
  contract states D1, with an Execution Note citing this element. The approval of this element and
  the merge OK approve the text, as plan-041 did for spec-001's O15. The Commitments to adopters
  are untouched: no type, state, workflow or phase of `software` is renamed.
- **D5 — The feedback note** F-037 asks WingFoil for an `iterate_over` phase that stays open to
  new candidates after later phases progress, so that a methodology could run two repeating
  streams, Sprints and releases, as phases of one workflow. Written in a task of its own
  (`wingfoil-cli` rule 3), task-052.

Consequences: each Sprint's `release` phase is one pass over the releases then `in-development`; it
closes once the Sprint Review completes, and a release still open is picked up by the next Sprint,
reported `late` under the closed one until it completes. `scrum`'s charter states it as an
adaptation. A methodology that includes both directly, as `methodology/fixture` and the golden
tree's `methodology/kanban` do, stays valid.

## Execution Notes

- 2026-10-26: captured under plan-047 (step 3a), on the approver's ruling in chat.
- 2026-10-26: independent review: approve after amendments, nothing blocking but a wrap in
  spec-001. Amended: D3 checks all of D1 (the part, the `where`, cycles, the pack's own workflows);
  D2 also covers spec-001 §2, §9's table, §11 and §18; dl-003 D4 and D11 read with D1; the
  consequence for releases spanning Sprints; the open point on a release leaving `in-development`;
  the charter's note says the text awaits approval.
- 2026-10-26: focused re-review: approve; two wordings applied (§18's "of its own", the charter's
  bullet states all of D1) and a wrap. Submitted.
