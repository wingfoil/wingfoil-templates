---
id: plan-032-spec-001-amendment-and-dl-003-notes-the-alignment-with-wingfoil-s-plans-of-dl-021
type: plan
title: "spec-001 amendment and dl-003 notes: the alignment with WingFoil's plans of dl-021"
status: active
workflow: "sw-life-cycle"
phase: "specification"
tags: ["spec","wingfoil","base"]
---

## Context

The changes of dl-021 (`approved` 2026-10-13) that fix how `base` is written, applied before wave W8
on the approver's request in chat on 2026-10-14: spec-001's amendment and dl-003's notes. Hosted by
`sw-life-cycle` › `specification`, which reopens for this amendment only, as for spec-002
(plan-031).

WingFoil recorded dl-021's requests on its public `main` after dl-021's approval (verified by this
repository on 2026-10-13): **WingFoil dl-177**, the capabilities query (added in `b34f827f`, the
proposal of dl-149 Action 3), and **WingFoil dl-178**, a stage change as a pack update (added in
`4d4c3221`, amended with F-028 in `662f6a4c`); dl-138 amended in `dc35cabf` and `ce8ad4ce`. The
text below cites them where dl-021 cites "dl-149 Action 3" and "dl-164's mechanism".

The approver ruled on 2026-10-14:
- **the `transition` kind stays**, descriptive (dl-021's open point):
  `transitions/<from>-to-<to>.yaml`, its schema, `catalog.yaml` › `transitions` and the index keep
  their form; a transition is no longer run by a `stage set` verb but by the workflow of the target
  `stage/*` overlay, when the project replaces the overlay through a pack update (dl-021 R2,
  WingFoil dl-178); no schema change, so no note under `wingfoil-cli` rule 8;
- **spec-001 is amended in place**, as spec-002 was (option (b) of plan-031): the body edited under
  this plan, its Execution Notes listing the changes, the approver's merge OK as the approval;
- **dl-003 is not edited**: an Execution Note records that D7's second sentence ("`base` is
  bundled in WingFoil's npm package") is superseded by dl-021 R1, the rest of D7 standing (the first
  scope gains `base` and `governance/wingfoil-dogfood`), and that the install-folder line of its
  configuration changes is settled by dl-021 R3.

spec-001's changes, from dl-021 › Changes (spec-001):

| Section | Change | Source |
|---|---|---|
| §4, §18 | the `0.x` sentence states the rule directly, without the circular citation of `pack-semver`; §18's "once this specification is approved" dropped | spec-001's erratum of 2026-10-13 (plan-028) |
| §6.2 | `pack.yaml` has no `bundled` field because no pack is bundled in WingFoil's npm package; the "dl-001 D4, D6" citation dropped | dl-021 R1 |
| §7.6 | packs name no install folder, paths are relative to each kind; the table is the reference composer's format-1 mapping; `pack-install` maps packs into WingFoil's `remote` class once dl-138's tech-spec fixes it; `built-in/` is WingFoil's own | dl-021 R3, F-029 |
| §7.6, §16 | the one path a pack writes that names a folder, `template.file` in a `memory.yaml` fragment: the format-1 rule (`memory/templates/built-in/<type>.md`) stays until it is settled, recorded as a new open point O13 owned by WingFoil dl-138's Action 2 tech-spec | dl-021 R3, F-029 (found while drafting) |
| §7.7 | the generated `include` entries follow §7.6's folder | dl-021 R3 |
| §11 | the transition of the example requires no capability | dl-021 R2, R4 |
| §12 | the provisional vocabulary (`pack-install`, `workflow-engine`), `stage-transitions` removed, and the CHANGELOG rule of the intake | dl-021 R4; **through task-028** |
| §14 | a transition runs as the target overlay's workflow on a pack update; no `stage set`; "feedback notes T8" becomes F-028; its example requires no capability; its executable form waits for WingFoil dl-178 | dl-021 R2, F-028 |
| §16 | O3 owned by WingFoil dl-177 with this repository's provisional vocabulary; O5 and O12 re-read with dl-138's `remote` class | dl-021 R3, R4 |

§12's example is the real `compat.yaml`, checked by `tests/compat.test.ts` against the file and the
compose fixture: §12, `compat.yaml`, `tests/fixtures/compose/tree/compat.yaml` and that test change
together, through **task-028**, a tooling task hosted by this plan.

Not in this plan: `pack-authoring` (kind-relative paths), the rest of dl-021's configuration and
tooling, the vision and the other decision-logs; the schema fixtures and the `TRANSITION` fixture of
`tests/check-packs.test.ts` that still name `stage-transitions` as a free capability string, which
stay valid (the `spec-11`, `spec-12` and `spec-14` schema fixtures and the two compat invalid
fixtures will no longer mirror the spec's examples).

## Steps

On the branch `spec/spec-001-dl-021`, from `main` at `b8786d6`.

1. **claude (architect):** spec-001's changes of the table except §12, and its Execution Note.
2. **task-028** through `tooling-delivery` v2: §12, `compat.yaml`, the compose fixture's
   `compat.yaml` and `tests/compat.test.ts`; body reviewed, accepted by the approver, built,
   reviewed, approved, `done` on this branch.
3. **claude:** dl-003's Execution Note.
4. **Checks:** `npm test`, `npm run lint`, `npm run check:pins`, `npm run check:schemas`,
   `npm run check:packs`, `npm run index -- --check` and
   `npm run validate` exit 0; `workflow list` exit 0.
5. **Review:** an independent review of steps 1 and 3 (dl-017), fixed, re-reviewed when a fix
   changes a rule.
6. **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
   `--no-ff` merge into `main`, push, the branch removed.

## Handoff

- **claude:** steps 1–6, except the approver's gates and the merge OK.
- **Approver:** the two rulings above (given 2026-10-14); task-028's gates; the merge OK, which
  approves spec-001's edited text.
- Done when the changes are on `main`, pushed. The plan then goes `active → done`.

## Execution Notes

- 2026-10-14: written; `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-14: plan-032 and task-028 reviewed independently (approve after amendments: WingFoil
  dl-177 and dl-178 sourced by their public commits; dl-003's note limited to D7's second
  sentence; O13 with the format-1 rule kept and its owner; the scope lists and task-028's
  Acceptance 6 made checkable), amended. Plan submitted `active`, task-028 `pending`.
