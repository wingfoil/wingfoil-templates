---
id: plan-027-dl-actions-dl-016-a2-the-configuration-changes-of-dl-017-to-dl-020
type: plan
title: "dl actions: dl-016 A2, the configuration changes of dl-017 to dl-020"
status: active
workflow: "decision-log-ingest"
phase: "rule"
tags: ["config","retrospective"]
---

## Context

Action A2 of dl-016 (the periodic retrospective of 2026-10-12, `approved`): one
configuration-actions plan for the changes dl-017 … dl-020 imply, all four `approved` on
2026-10-12. Applied on the approver's request in chat on 2026-10-12. Like plan-011, no workflow
phase hosts this work: the changes are actions of approved elements.

Sources, each with the changes it lists:
- **dl-017** (independent review, build re-review): R1 in `tooling-delivery` and `kanban-delivery`
  › `plan` (the body) and › `review` (the build), R2 and R3 in › `review`; R1 in the phase before
  the approval, or in the gated phase itself where the approval sits inside it, of
  `decision-log-ingest`, `adr-ingest`, `bug-ingest`, `pack-cycle` (charter), `pack-release-cycle`
  and `sw-life-cycle` (its phase gates: inception, specification, sunset); the plan template's
  Handoff comment names R1;
- **dl-018** (red first, `tooling-delivery` only): R3 in › `design`, R1 and R2 in › `build`, R4 in
  › `review`; the task template's Execution Notes comment names the red run;
- **dl-019** (an unsatisfiable Acceptance goes to the approver): R1 in `tooling-delivery` and
  `kanban-delivery` › `design` and › `build`, R3 in › `review`; R2 in the task template's Execution
  Notes comment;
- **dl-020** (tech-spec errata folded back at wave close): R1 in the `traceability` directive; R2
  in the plan template's Execution Notes comment and R3 in its Context comment; R2 named by
  `sw-life-cycle` › `tooling` and `tooling-change` › `deliver`, where a wave closes.

The changes of dl-017 … dl-019 to the two delivery loops go together, one `version` bump per file
(dl-016 A2). `tooling-delivery` and `kanban-delivery` still differ only in roles and descriptions
(bug-001): dl-018's rules make one more description differ, as dl-018 allows.

Wording: each description states the rule briefly and cites the decision-log (for example "an
independent review, re-reviewed after any fix that changes behaviour, a test or an Acceptance
command (dl-017)"), so the descriptions stay short and the decision-log stays the source.

Not in this plan: dl-016 A1 (plan-026); gated phases dl-017's list does not name
(`retrospective`, `wingfoil-release-intake` › `record`, `pack-deprecation`, `templates-inception`,
`pack-cycle` › `design`), although R1 covers their elements: the plan applies the list as
approved; any change of tooling or code; WingFoil's built-in
`testing` directive, which is not edited (dl-018).

## Steps

On the branch `config/dl-016-actions`, shared with plan-026; one commit per step.

1. **Delivery loops.** `tooling-delivery` (`version` 1 → 2): `plan` (dl-017 R1), `design` (dl-018
   R3, dl-019 R1), `build` (dl-018 R1–R2, dl-019 R1), `review` (dl-017 R1–R3, dl-018 R4, dl-019
   R3). `kanban-delivery` (3 → 4): the same without dl-018.
2. **Capture and gate phases** (dl-017 R1): `decision-log-ingest` (1 → 2) › `capture`,
   `adr-ingest` (1 → 2) › `capture`, `bug-ingest` (2 → 3) › `capture`, `pack-cycle` (2 → 3) ›
   `charter`, `pack-release-cycle` (5 → 6) › `validate`, `sw-life-cycle` (4 → 5) › `inception`,
   `specification` and `sunset`.
3. **Wave close** (dl-020 R2): `sw-life-cycle` › `tooling` (in the same version bump as step 2)
   and `tooling-change` (2 → 3) › `deliver`.
4. **Templates:** `.wingfoil/memory/templates/plan.md` (Context: dl-020 R3; Handoff: dl-017 R1;
   Execution Notes: dl-020 R2) and `.wingfoil/memory/templates/task.md` (Execution Notes: dl-018
   R1, dl-019 R2).
5. **Directive:** `traceability` gets dl-020 R1; it has no version line, so none is bumped.
6. **Checks:** `npm run -s wingfoil -- workflow list`, `dna show` and `directives list` exit 0 with
   no warning; the includes checked by hand (`wingfoil-cli` W-08); `tooling-delivery` and
   `kanban-delivery` parsed as YAML, with `name`, `version`, every `role` and every `description`
   removed, give equal trees (bug-001); `npm test`,
   `npm run lint`, `npm run check:packs` and `npm run validate` exit 0.
7. **Review:** an independent review of the whole change (dl-017 R1), its findings fixed; a
   re-review when a fix changes a rule (dl-017 R2 applied to configuration).
8. **Branch close,** with plan-026: push, the real CI run's conclusion recorded here; on the
   approver's OK, `--no-ff` merge into `main`, push, the branch removed.

## Handoff

- **claude:** steps 1–8, except the merge OK. It never runs `memory approve` or `memory reject`.
- **Approver:** this plan before it is submitted; the merge OK.
- Done when the changes are on `main`, pushed. The plan then goes `active → done`.

## Execution Notes
- 2026-10-12: independent review (approve after amendments: `pack-cycle` › `design` dropped as not
  in dl-017's list; `sunset` added; a concrete comparison of the two loops), amended. Presented to
  the approver, who approved it in chat and asked to proceed.
- 2026-10-12, steps 1–5: `920ea72` (delivery loops: `tooling-delivery` v2, `kanban-delivery` v4),
  `76bef1c` (steps 2 and 3 in one commit, since `sw-life-cycle` carries both in one version bump:
  `decision-log-ingest` v2, `adr-ingest` v2, `bug-ingest` v3, `pack-cycle` v3,
  `pack-release-cycle` v6, `sw-life-cycle` v5, `tooling-change` v3), `dff8bac` and `7629f22`
  (templates), `4df2a1a` (`traceability`).
- 2026-10-12, step 6: `workflow list`, `dna show` and `directives list` exit 0 with empty stderr;
  every `include` names a declared workflow (checked by script, W-08); the two loops, parsed as
  YAML without `name`, `version`, roles and descriptions, are equal; `npm test` 803 of 803, `lint`,
  `check:packs` and `validate` exit 0.
- 2026-10-12, step 7: independent review: approve after amendments, 0 blocking, 3 should-fix (the
  text was stronger than dl-020: "folded back" for "listed", and the approver's "none is needed"
  missing in three places), 4 nits (dl-019's wait in `build`, dl-018 R2's characterization
  exception, dl-018 R4's wording, the task template scoped to tooling tasks). All fixed
  (`93be5c1`); re-review (dl-017 R2): approve, no finding.
- 2026-10-13, branch close: CI run 38314131196 on `93be5c1`, conclusion `success` for
  `validate (22.21.0)` and `validate (22.12.0)`. Waiting for the approver's merge OK.
