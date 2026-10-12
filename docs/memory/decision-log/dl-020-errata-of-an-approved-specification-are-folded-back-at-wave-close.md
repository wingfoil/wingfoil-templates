---
id: dl-020-errata-of-an-approved-specification-are-folded-back-at-wave-close
type: decision-log
title: "Errata of an approved specification are folded back at wave close"
status: draft
tags: ["process","retrospective"]
---

## Context

The periodic retrospective of 2026-10-12 (dl-016; inventory §4) found that the errata of an approved
specification stay in its Execution Notes and in the tasks that found them:
- spec-002 §3.1, the tag is derived as `<catalog pack id>@<version>` (task-019); §2.4, the CB-2
  exemption holds only while the tree holds no methodology (task-022); the rulings on P1–P3. All are
  recorded in spec-002's Execution Notes (`b000e9d`); its body still says otherwise.

A reader, a reviewer or the pack author of a later wave reads the body of an approved spec first.
Nothing triggers folding the errata back: plan-024 closed W14 listing "an amendment of spec-002" as
owed, with no owner.

## Options

1. **No change.** Rejected for the reason above.
2. **Amend at once.** Each erratum is folded into the spec when it is found. Rejected: an amendment
   of an approved element is an element of its own, with its review and approval; one per erratum
   costs more than it serves inside a wave.
3. **At wave close.** The plan that closes a wave lists the errata recorded in the wave, for each
   approved specification, and the approver decides then when the amendment is made, before the
   next wave that builds on that specification.

## Decision

**Proposed: option 3.** The approver rules at `memory approve`.

- **R1 —** An erratum of an approved specification, found during a wave, is recorded in the
  specification's Execution Notes with the element that found it, as today.
- **R2 —** At wave close, the plan's Execution Notes list, per specification, the errata and
  rulings recorded in the wave, and the approver names the element that will fold them back
  (or rules that none is needed).
- **R3 —** A wave whose work builds on a specification with errata not folded back starts only
  after its amendment, or after the approver rules that it may start without it.
- This decision does not open the amendment of spec-002: that stays a separate item, for the
  approver.

Configuration changes this decision implies, applied after approval through their own element: the
`traceability` directive gets R1–R3; the plan template's Execution Notes comment names R2.

## Execution Notes
