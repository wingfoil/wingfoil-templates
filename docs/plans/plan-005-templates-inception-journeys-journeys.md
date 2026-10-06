---
id: plan-005-templates-inception-journeys-journeys
type: plan
title: "templates-inception journeys: journeys"
status: done
workflow: "templates-inception"
phase: "journeys"
tags: ["inception"]
---

## Context

Fourth sub-phase of `templates-inception`, under plan-001. Its input is the accepted personas
document (plan-004), with these review decisions:
- primary personas until WingFoil v0.4: 3 and 2; from v0.4: 1;
- the agent stays a persona.

It produces `docs/01_vision/05_journeys.md`, structured like WingFoil2-Benchmark's journeys: one
table of steps per journey (touchpoint, pain or opportunity), feeding the feature brainstorm.

## Steps

1. (facilitator) List the journeys with persona and priority. The priority follows the horizon of
   the personas review.
2. (facilitator) Write each journey's trigger, steps and "ends well when". Commands of the WingFoil
   CLI (`init --preset`, `pack add`, `upgrade`, `stage set`) are WingFoil's to design. A journey
   only states what the packs must make possible.
3. Commit by hand and show the document to the approver with the open questions.
4. Record the review answers in the document, then plan `active → done`.

## Handoff

- **Approver:** reviews the document and answers the open questions.
- **claude:** writes and corrects it.
- No Memory gate. The approver's acceptance is recorded in the Execution Notes.

## Execution Notes
- 2026-10-06: journeys written (`eca9521`).
- 2026-10-06: journeys review answered by the approver:
  - priorities as listed;
  - J4 is in the MVP, so `wingfoil-release-intake` returns to the configuration after the
    pack-model rulings;
  - each governed repository records its `base` adoption in its own Memory, with no list here.

  The document is accepted as input to the features.
