---
id: plan-007-templates-inception-sequencer-sequencer-and-mvp-canvas
type: plan
title: "templates-inception sequencer: sequencer and MVP canvas"
status: draft
workflow: "templates-inception"
phase: "sequencer"
tags: ["inception"]
---

## Context

Sixth sub-phase of `templates-inception`, under plan-001. Its role is product-owner: the approver
owns it, and claude drafts. Its input is the accepted features document (plan-006), with these
review decisions:
- composer option (c);
- tooling in TypeScript;
- no release assets.

It produces:
- `docs/01_vision/07_sequencer.md`: waves of at most 3 features, at most one high-uncertainty
  feature per wave, grouped into milestones;
- `docs/01_vision/08_mvp-canvas.md`.

Both are structured like WingFoil2-Benchmark's documents. This repository has no repository-wide
releases (packs are versioned one by one), so waves are grouped into milestones, not releases.

## Steps

1. (claude, drafting for the product-owner) Order every feature of `06_features.md` into waves and
   milestones. The order respects the WingFoil dependencies and the approver's constraints:
   - `base` waits for the v0.3 formats;
   - the MVP is ready with WingFoil v0.4.
2. (claude, drafting) Write the MVP canvas: proposal, personas, journeys, features, expected result,
   validation metrics, schedule.
3. Commit by hand and show both documents to the approver with the open questions.
4. The approver rules the order. Record the answers, then plan `active → done`.

## Handoff

- **Approver:** owns the sequencer as product-owner, and rules the order and the MVP.
- **claude:** drafts and corrects the documents.
- No Memory gate. The approver's ruling is recorded in the Execution Notes.

## Execution Notes
