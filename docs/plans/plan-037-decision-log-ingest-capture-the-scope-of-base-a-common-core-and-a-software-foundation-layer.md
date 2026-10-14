---
id: plan-037-decision-log-ingest-capture-the-scope-of-base-a-common-core-and-a-software-foundation-layer
type: plan
title: "decision-log-ingest capture: the scope of base, a common core and a software foundation layer"
status: active
workflow: "decision-log-ingest"
phase: "capture"
tags: ["process","decision-log","base"]
---

## Context

The `capture` phase of `decision-log-ingest`, started on 2026-10-14 on the approver's request in
chat, before `base`'s charter (wave W8, milestone M2).

While the charter's inputs were prepared, the approver observed that they came only from the four
governed software repositories (dl-003), while WingFoil also governs projects that are not
software. On 2026-10-14 this repository's session compared, at the approver's request:
- the `.wingfoil/` configurations of three private, non-software projects governed by WingFoil
  0.2.2 with what dl-003 D2 puts in `base`;
- how each governed repository changes its own governance (its `.wingfoil/`, directives, roles and
  Memory types).

The approver ruled in chat on 2026-10-14 on the proposal built from the two comparisons ("come
consigli ma muovi adr e adr-ingest nel livello software"; `governance-evolution` in `base`; "come
consigli, prepara dl-022"), and then on two open points of the proposal: a methodology does not
always require the software layer, and the `methodology` axis is not required without it; then
that a methodology's `delivery` exists only in a composition with the software layer.

It produces dl-022, which records the comparison, the options and the rulings. It decides nothing
beyond them: each change it implies is applied later through its own element. `base`'s charter
(`pack-foundation-base`) is not created under this plan.

## Steps

On the branch `dl/dl-022-base-scope`, from `main` at `52f8221`.

1. **claude (facilitator):** dl-022 (`memory add`, body committed by hand): the comparison, the
   options, the approver's rulings, the amendments of dl-003, dl-004 and dl-015 they imply, and the
   changes to apply later.
2. **claude:** an independent review of dl-022 and of this plan (dl-017), amended while still
   `draft`, with a re-review when a fix changes a ruling; checks: `npm run -s wingfoil -- workflow
   list` exit 0 and `npm run lint` exit 0; then `submit` (`draft → pending`).
3. **Approver (`rule`, the next phase, under this same plan):** `memory approve` of dl-022, from the
   command claude hands over.
4. **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
   `--no-ff` merge into `main`, push, the branch removed.

## Handoff

- **claude:** steps 1, 2 and 4, except the merge OK. It never runs `memory approve` or
  `memory reject`.
- **Approver:** the rulings (given in chat on 2026-10-14); the approval of dl-022; the merge OK.
- Done when dl-022 is `approved` and on `main`. The plan then goes `active → done`.

## Execution Notes

- 2026-10-14, inputs for the charters, found while preparing them and not ruled here (they go to
  dl-015's ruling with the charters): WingFoil2's `memory.yaml` (at `wingfoil/wingfoil@32d8871b`)
  uses keys spec-001 §7.5 does not model (`waiting`, `returns`, `amendable`, `fields`, `name`,
  `description`, `tags`); WingFoil2 now names the phases of its release workflows (dl-015 C5); the
  `{line}` token of C6 appears in no governed configuration; the governed repositories name the
  agent differently, and WingFoil2 also records its email (C9).
- 2026-10-14: dl-022 and this plan written (`2409349`), reviewed independently (approve after
  amendments: S3's open points against dl-003 D4 and spec-001 §6.3, dl-001 D5 and dl-006 R2
  amendments, the implied changes to spec-001, spec-002, the schemas and the vision, facts on
  `claim-evidence` and WingFoil2-Benchmark, public-repo hygiene), amended (`52f18e4`) with the
  approver's two rulings on S3; re-reviewed (no must-fix; schemas, the M2 row, hygiene), amended
  with the approver's ruling on `delivery` (`c8c92a9`); re-reviewed (one line too long, and the
  open points of the conditional `delivery` for the spec-001 amendment), amended. Checks:
  `workflow list` and `npm run lint` exit 0.
