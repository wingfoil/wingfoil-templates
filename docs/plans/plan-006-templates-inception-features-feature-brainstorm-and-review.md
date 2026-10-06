---
id: plan-006-templates-inception-features-feature-brainstorm-and-review
type: plan
title: "templates-inception features: feature brainstorm and review"
status: active
workflow: "templates-inception"
phase: "features"
tags: ["inception"]
---

## Context

Fifth sub-phase of `templates-inception`, under plan-001, run as architect. Its input is the
accepted journeys document (plan-005), with these review decisions:
- J1–J5 now, J6–J7 with v0.4, J8 with transitions;
- `wingfoil-release-intake` returns after the pack-model rulings;
- no adopters list here.

It produces `docs/01_vision/06_features.md`, structured like WingFoil2-Benchmark's features: ids
`F<area>.<n>`, the journey step each feature traces to, and the technical/business review (value,
effort, uncertainty).

## Steps

1. (architect) Brainstorm the features from the journeys' pain and opportunity columns, grouped by
   area: format, catalog and distribution, validation tooling, pack content, release process,
   adoption, community.
2. (architect) Rate each feature: value, effort, uncertainty. A high uncertainty names the decision
   or spike it needs.
3. (architect) Answer the brief's open feasibility point: download metrics on GitHub.
4. Commit by hand and show the document to the approver with the open questions.
5. Record the review answers, then plan `active → done`.

## Handoff

- **Approver:** reviews the ratings and answers the open questions.
- **claude:** writes and corrects the document.
- No Memory gate. The approver's acceptance is recorded in the Execution Notes.

## Execution Notes
- 2026-10-06: features written (`a5f306e`).
- 2026-10-06: features review answered by the approver:
  - reference composer (c): written here and proposed to WingFoil. Recorded as note T15 in the
    uncommitted feedback inbox;
  - tooling in TypeScript on Node;
  - no release assets (F2.7 dropped), so the download signal is clone traffic only.

  The document is accepted as input to the sequencer.
