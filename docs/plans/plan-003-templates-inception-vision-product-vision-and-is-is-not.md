---
id: plan-003-templates-inception-vision-product-vision-and-is-is-not
type: plan
title: "templates-inception vision: product vision and is-is not"
status: done
workflow: "templates-inception"
phase: "vision"
tags: ["inception"]
---

## Context

Second sub-phase of `templates-inception`, under plan-001. Its input is the accepted product brief,
`docs/01_vision/01_product-brief.md` (plan-002). It produces:
- `docs/01_vision/02_product-vision.md`: the vision statement, the key decisions, the value by
  audience;
- `docs/01_vision/03_is-isnot.md`: Is / Is not / Does / Does not.

Both follow the structure of WingFoil2-Benchmark's documents.

## Steps

1. (facilitator) Write the vision statement and the key decisions. Every key decision must be either
   already established (brief, the notes' D1–D6, the approver's constraints) or marked as a question
   for the review. The vision proposes; the rulings on the pack model belong to the pack-model phase.
2. (facilitator) Write Is / Is not / Does / Does not, consistent with the vision and the brief.
3. Commit both by hand and show them to the approver with the open questions.
4. Record the review answers in "Decisions from the vision review", then plan `active → done`.

## Handoff

- **Approver:** reviews both documents and answers the open questions.
- **claude:** writes and corrects them.
- No Memory gate. The approver's acceptance is recorded in the Execution Notes.

## Execution Notes
- 2026-10-06: vision and is/is-not written (`bac739d`).
- 2026-10-06: vision review answered by the approver (`c8e68fa`, then 1.2):
  - two catalogs, a curated official one and a broader community one;
  - hand adoption only until the CLI installs packs;
  - English as the bridge language, with localization by geographic area (regulatory `governance`
    packs) and regulatory quotes in their original language.

  The documents are accepted as input to the personas.
- Open for the features and pack-model phases: where community packs live, how they are told apart
  from official packs, and how they relate to WingFoil's third-party sources (dl-138 Q4).
