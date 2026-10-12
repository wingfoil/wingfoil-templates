---
id: dl-020-errata-of-an-approved-specification-are-folded-back-at-wave-close
type: decision-log
title: "Errata of an approved specification are folded back at wave close"
status: pending
tags: ["process","retrospective"]
---

## Context

The periodic retrospective of 2026-10-12 (dl-016; inventory §4) found that the errata of an approved
specification stay in its Execution Notes and in the tasks that found them. spec-002 §3.1: the tag
is derived as `<catalog pack id>@<version>` (task-019); §2.4: the CB-2 exemption holds only while
the tree holds no methodology (task-022); the rulings on P1–P3. All are recorded in spec-002's
Execution Notes (`b000e9d`); its body still says otherwise.

A reader, a reviewer or the author of a later wave reads the body of an approved specification
first. Nothing triggers folding the errata back: plan-024 closed W14 listing "an amendment of
spec-002" as owed, with no owner. A wave closes in its plan (plan-015's phase gate, plan-024's wave
close); no workflow names that step.

## Options

1. **No change.** Rejected for the reason above.
2. **Amend at once.** Each erratum is folded into the specification when it is found. Rejected: an
   amendment of an approved element is an element of its own, with its review and approval; one per
   erratum costs more than it serves inside a wave.
3. **At the close of the plan that runs the wave**, and checked when the next plan opens.

## Decision

**Proposed: option 3.** The approver rules at `memory approve`. It applies to tech-specs; an
approved decision-log or ADR found wrong is superseded or amended by an element of its own, as
today.

- **R1 —** An erratum of an approved tech-spec, found during a wave, is recorded in the tech-spec's
  Execution Notes with the element that found it, as today.
- **R2 —** The plan that closes a wave (its phase gate or wave-close note) lists, per tech-spec, the
  errata and rulings recorded in the wave, and the approver names the element that will fold them
  back, or rules that none is needed.
- **R3 —** The plan that opens a wave names, in its Context, the tech-specs its work builds on and
  their errata not yet folded back; the wave starts after their amendment, or after the approver
  rules that it may start without it.
- **Transition.** W14 closed before this rule. From its approval, R3 applies to spec-002 at the
  next wave that builds on it; this decision does not open spec-002's amendment, which stays a
  separate item for the approver.

Configuration changes this decision implies, applied after approval through their own element:
- the `traceability` directive gets R1;
- the plan template: R2 in its Execution Notes comment, R3 in its Context comment;
- the description of `sw-life-cycle` › `tooling` and of `tooling-change` › `deliver`, where a wave
  closes, names R2.

## Execution Notes
