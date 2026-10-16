---
id: plan-040-spec-amendment-fold-back-plan-039-s-rulings-into-spec-001-and-spec-002
type: plan
title: "spec amendment: fold back plan-039's rulings into spec-001 and spec-002"
status: draft
workflow: "sw-life-cycle"
phase: "specification"
tags: ["spec","base"]
---

## Context

The element plan-039 named at its close (the approver's option (a), 2026-10-16, dl-020 R2): it
folds back into spec-001's and spec-002's bodies the rulings recorded under plan-039, before wave
W8, which builds on both (dl-020 R3). Opened on the approver's request in chat on 2026-10-16.
Hosted by `sw-life-cycle` › `specification`, the phase that produces tech-specs, as plan-031 was;
the phase reopens only for this amendment.

**How.** As plan-031 and plan-038: spec-001 and spec-002 are amended **in place**, the body edited
under this plan, their Execution Notes listing the changes, the approver's merge OK the approval of
the edited text. No code, test or generated file changes: the tooling (task-031 … task-034)
already implements the text this plan writes. No errata were found under plan-039.

The rulings it folds back (plan-039's Context, each given by the approver in chat):
- **R3** (2026-10-15): the conditional part in the index (spec-002 §3.3), and the Summary mark in
  `CATALOG.md` (§3.2) and on the search page (§5); recorded in spec-002's Execution Notes on
  2026-10-16;
- **R7** (2026-10-15): an empty conditional part is refused (spec-001 §6.5, §18);
- **R8** (2026-10-15): sections 4 and 5 of a pack's README mark the conditional part's files
  (spec-002 §2.1); recorded in spec-002's Execution Notes with R3;
- **R9** (2026-10-16): a repeated entry of `not_applicable_allowed` or `lists` changes nothing
  (spec-001 §7.5);
- **R10** (2026-10-16): a later pack may introduce `waiting` or `limits` on a type whose defining
  pack declared none, under the same rules (spec-001 §7.5).

The approver also ruled on 2026-10-16, on this plan's proposal: the host above; and plan-039's R6
(a publication fails without a leg with `software` that ran) is not written into spec-001 §15,
which already defers to `pack-compatibility`, where it is stated.

Not in this plan: the readings recorded in task-031 … task-034 (the `[+software]` label, deep
equality, key orders, the propagation through `defaults`), which stay in those elements; R2, R5
and R6, which concern `npm run validate` and `pack-compatibility`; wave W8 (another session, on
the approver's OK).

## Steps

All work happens on branch `spec/plan-040-fold-back`, from `main`, one commit per row.

| # | File | Change | Source |
|---|---|---|---|
| 1 | spec-001 §6.5, §18 | the conditional part's `contents` lists at least one workflow or directive; §18's `conditional` check refuses an empty one | R7 |
| 2 | spec-001 §7.5 | the row of `not_applicable_allowed` and `lists`, and the failure list: a repeat of an entry already in the set, with the field in the fragment's `required`, changes nothing | R9 |
| 3 | spec-001 §7.5 | the rows of `waiting` and `limits`, and "Waiting, returns and limits": a later pack may introduce them on a type whose defining pack declared none, under the same rules | R10 |
| 4 | spec-002 §3.3 | a version object's `conditional` (after `conflicts`, its `with` only, only for a pack that carries one); a pack object's `conditional_workflows` and `conditional_directives` (right after `workflows` and `directives`, always present); `workflows` and `directives` are what is always composed | R3 |
| 5 | spec-002 §3.2, §5 | the Summary of a pack with a conditional part ends with the part's workflows, or its directives when it has none, marked as present only with the layer its `with` names; the search page's table shows the same | R3 |
| 6 | spec-002 §2.1 | sections 4 and 5 list the conditional part's workflows and directives, each marked as present only with that layer, section 4 on one line for workflows and one for directives | R8 |
| 7 | spec-001, spec-002 Execution Notes | the note of this amendment; spec-002's note of R3 and R8 marked as folded back | dl-020 R2 |

Then:
- **Checks:** `npm test`, `npm run lint`, `npm run check:pins`, `npm run check:schemas`,
  `npm run check:packs`, `npm run index -- --check` and `npm run validate` exit 0
  (`tests/catalog.test.ts` included: §11 does not change).
- **Coherence:** a read of the amended sections against the tooling (`src/pack-rules.ts`,
  `src/memory-merge.ts`, `src/index-model.ts`, `src/index-render.ts`, `src/readme-generate.ts`):
  any difference is reported to the approver, not edited silently.
- **Review:** an independent review of the branch by a subagent (dl-017), its findings fixed, a
  re-review when a fix changes a rule.
- **Branch close:** push, the real CI run's conclusion recorded here; on the approver's merge OK,
  `--no-ff` merge into `main`, push, the branch removed; plan-039's Execution Notes record the
  fold-back.

## Handoff

- **claude:** the rows above, the checks, the review hand-off, the merge once approved.
- **Approver:** the merge OK, which approves spec-001's and spec-002's edited text.
- Done when the branch is merged and pushed. The plan then goes `active → done`, and W8's opening
  plan (another session) can start.

## Execution Notes

- 2026-10-16: written; `workflow` and `phase` filled by editing the draft (W-02). The approver
  approved the proposal in chat, with the host and R6 left out of spec-001.
