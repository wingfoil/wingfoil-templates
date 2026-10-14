---
id: plan-035-tooling-change-deliver-remove-the-bundled-pack-note-from-the-publication-tooling
type: plan
title: "tooling-change deliver: remove the bundled-pack note from the publication tooling"
status: done
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","wingfoil"]
---

## Context

The tooling change of dl-021 (`approved` 2026-10-13) › Changes › Tooling: `npm run publish:pack --
--bundled`, the bundled-pack note of `src/feedback-note.ts` and their tests, removed. dl-021 R1: no
pack is bundled in WingFoil's npm package. The configuration no longer asks for the note
(plan-033: `wingfoil-cli` rule 8 at 1.4, `pack-release-cycle` v7, the `pack-release` template), and
the sequencer's W7 exit criterion is now "a dry-run publication of a fixture pack produces tag,
catalog entry and digest, and a feedback note when it changes a schema" (plan-034). Requested by
the approver in chat on 2026-10-14; opened after plan-034's merge (the approver's choice, to avoid
a plan-034 collision).

The work runs through `tooling-change` › `deliver`: one `tooling-delivery` iteration (v2) for one
tooling task, task-029.

Not in this plan: `feedback:note --schema` and the `schema-note` lint rule, which stay (rule 8);
approved elements that mention `--bundled` (task-014 … task-016, task-020, bug-002), which stay as
approved.

## Steps

On the branch `tooling/task-029-no-bundled`, from `main` at `0a1139c`.

1. **task-029** through `tooling-delivery` v2: body reviewed independently (dl-017), accepted into
   the backlog by the approver, built red first (dl-018), reviewed and re-reviewed as dl-017 R2
   asks, approved, `done` on this branch; its `deliver` is this branch's merge.
2. **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
   `--no-ff` merge into `main`, push, the branch removed.

## Handoff

- **claude:** steps 1–2, except the approver's gates and the merge OK. It never runs
  `memory approve` or `memory reject`.
- **Approver:** task-029's two gates; the merge OK.
- Done when task-029 is `done` and on `main`. The plan then goes `active → done`.

## Execution Notes

- 2026-10-14: written; `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-14: plan-035 and task-029 reviewed independently: plan-035 approve; task-029 approve
  after amendments (the W7 test is a publication in a fixture repository, not a dry run; the note
  committed before it passes; dead code named; the branch wording of the precedents), amended.
  Plan submitted `active`, task-029 `pending`.
- 2026-10-14: task-029 built, reviewed (approve after amendments, re-reviewed: approve), approved
  by the approver and `done`; the approver ruled the reading of its Acceptance 6 (no occurrence
  outside the refusal tests). CI run 38621778153 on `2eea798`, conclusion `success`. The approver
  gave the merge OK in chat; `--no-ff` merge into `main`, push, branch removed. This plan goes
  `active → done`.
