---
id: plan-008-templates-inception-pack-model-record-the-pack-model-rulings
type: plan
title: "templates-inception pack-model: record the pack-model rulings"
status: active
workflow: "templates-inception"
phase: "pack-model"
tags: ["inception"]
---

## Context

Last sub-phase of `templates-inception`, under plan-001. Its role is product-owner: the approver
owns the rulings, and claude captures them as facilitator through `decision-log-ingest` (plan-009).

Inputs:
- the accepted vision documents `docs/01_vision/01…08`;
- the first attempt's drafts dl-001…dl-003 on `archive/draft-2026-10-05`, as source material only;
- the uncommitted feedback notes (D1–D6, T1–T15) and `docs/notes/base-regeneration-inputs.md`;
- the answers of the session "WingFoil-Templates repository planning" (2026-10-05). According to
  them, the identifier conventions were never discussed with the approver.

Produces: `docs/memory/decision-log/{id}.md`, one element per ruling group, each taken to
`pending`.

## Steps

1. (facilitator) Capture five decision-logs, split as the approver confirmed on 2026-10-05:
   - **pack model:** axes, overlays, stages, versioning, bundling, first scope, two catalogs,
     language;
   - **compatibility:** formats and capabilities, `compat.yaml`, the line policy;
   - **foundation:** `base`, the `governance` axis, AGENTS.md R1–R4, adoption, publication;
   - **identifiers:** pack id pattern, tags, digest, maintenance branches. These are proposals with
     options, for the approver to rule;
   - **repository governance:** configuration, restart, notes, public repository, contributions,
     the tooling phase, release intake.
2. In every decision-log, mark each point by its source:
   - ruled by the approver in chat, with the date;
   - ruled in a vision review;
   - relayed by another session and never confirmed directly. A relayed point becomes a ruling only
     when the approver approves the element.
3. List in each decision-log the configuration changes it implies. They are applied after approval,
   each with a `version:` bump.
4. Hand off to the gate: one `memory approve` per decision-log, by the approver.
5. Plan `active → done` when every decision-log is approved. Then plan-001's phase gate follows.

## Handoff

- **Approver:** reads and approves (or rejects) each decision-log. claude never runs
  `approve`/`reject`.
- **claude:** captures the decision-logs, and corrects them on rejection.
- Architecture choices raised during inception (reference composer option c, TypeScript tooling)
  go to an ADR in the specification phase (`adr-ingest`), not into these decision-logs.

## Execution Notes
- 2026-10-06: dl-001…dl-005 captured and `pending` (plan-009).
- 2026-10-06: the session "Metodologie nelle fasi wingfoil" acted at the approver's request:
  - it amended dl-003 while `pending`: D4 and D11 add the `release` slot, and `operations` is left
    open;
  - it opened dl-006 (retrospective) and dl-007 (phase methods) under plan-010;
  - it added feedback note T16.

  Coherence check by this session:
  - dl-001 D1 now points to the slot list of dl-003 D11;
  - features F1.4 is aligned (1.2).
- The approver defers dl-007 until WingFoil supports templates and Benchmark can test them. The
  inception gate therefore covers dl-001…dl-006. dl-007 stays `pending` under plan-010, and
  spec-001 does not include its `method` entry until it is ruled.
- 2026-10-06: dl-001…dl-006 approved (`0b36176`…`a295ce6`). Every `produces` of
  `templates-inception` exists on `main`: `docs/01_vision/01…08` and the decision-logs. The
  sub-phase is complete, and the next step is the inception phase gate (plan-001).
