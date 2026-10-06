---
id: dl-008-operations-belongs-to-the-stage-overlays-not-to-a-phase-slot
type: decision-log
title: "Operations belongs to the stage overlays, not to a phase slot"
status: pending
tags: ["packs","slots"]
---

## Context

dl-001 D1 gave the `phase/<slot>` axis four slots: `inception`, `specification`, `release`,
`operations`. dl-003 D11 amended the list to `inception`, `specification`, `release`, `end-of-life`,
and left `operations` open: "either a later slot or part of `stage/production` and
`stage/maintenance`. To be ruled before spec-001 fixes the slot list."

`operations` means running the product after a release: incidents, support, maintenance. Today it
has:
- no default in `base`;
- no pack in the first scope (dl-001 D5, amended by dl-003 D7);
- no counterpart in any of the four governed repositories.

The candidates named in the feedback notes (T2), `sre-lite` and `incident-mgmt`, are ideas, not
charters.

spec-001 (plan-012) needs the slot list now.

## Options

- **(a) A later `operations` slot.** `base`'s `sw-life-cycle` includes an `operations` slot after
  `delivery`, with a minimal default, and a `phase/operations/…` pack can fill it.
  - For: it follows the slot model, where the method of a phase is interchangeable; a future
    operations pack has an obvious place.
  - Against: `base` would ship an empty default with no content behind it; a prototype would run
    an operations phase it does not need.
- **(b) The stage overlays.** No `operations` slot in 0.x. The workflows and Memory types that
  running a product needs (for example an `incident` type and its ingest workflow) are added by
  `stage/production` and `stage/maintenance`, when the project reaches that stage.
  - For: operations matters only once something runs in production, which is what the stage axis
    models; overlays already add and tighten (dl-001 D1); the slot list stays at four; `base` has
    no hole.
  - Against: the operations process is tied to the stage, not chosen as a pack of its own; two
    stages that want the same process must share it through a pack both require.

## Decision

Ruled by the approver, Roberto Pompermaier, on 2026-10-06 in chat ("b"), when plan-012 was
presented: **option (b)**.

- There is no `operations` slot in 0.x. The `phase/<slot>` axis has four slots: `inception`,
  `specification`, `release`, `end-of-life` (dl-003 D11). `delivery` stays the methodology's.
- The functions of operations (incidents, support, maintenance) belong to the stage overlays
  `stage/production` and `stage/maintenance`. They follow the overlay rule: they add or tighten,
  and never remove.
- **Reversible.** Should an operations method turn out to be a choice of its own, a later
  decision-log can add an `operations` slot to `base` with its default. That is additive, so a
  minor of `base` (`pack-semver`), and what the stages introduced can move into the slot's default.
- dl-001 D1 is amended accordingly: its `operations` slot is withdrawn.

Consequences:
- spec-001 and `schema/pack.schema.json` list four slots;
- the charters of `stage/production` and, later, `stage/maintenance` name operations in their
  scope.

Configuration changes this decision implies: none. The `pack-authoring` directive already lists the
four slots of dl-003 D11.

## Execution Notes
