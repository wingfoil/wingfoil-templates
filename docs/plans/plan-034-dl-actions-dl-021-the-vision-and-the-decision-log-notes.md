---
id: plan-034-dl-actions-dl-021-the-vision-and-the-decision-log-notes
type: plan
title: "dl actions: dl-021, the vision and the decision-log notes"
status: draft
workflow: "decision-log-ingest"
phase: "rule"
tags: ["vision","wingfoil"]
---

## Context

The vision and decision-log actions of dl-021 (the alignment with WingFoil's plans, `approved` on
2026-10-13), opened on the approver's request in chat on 2026-10-14, while the repository waits for
WingFoil v0.3. As plan-030 hosts dl-021's feedback notes, no workflow phase hosts this work: it is
filed under `decision-log-ingest` › `rule`.

Already applied: spec-001 and dl-003's note (plan-032), `compat.yaml`'s vocabulary (task-028), the
feedback notes F-027 … F-029 (plan-030, task-027). In progress elsewhere: the configuration changes
(plan-033) and the removal of `publish:pack --bundled` (its own tooling task). This plan touches
none of their files.

dl-021's rulings, as this plan reads them:
- **R1:** no pack is bundled in WingFoil's npm package; `base` and every pack are installed from
  this repository by WingFoil's `pack-install` (WingFoil dl-138, planned for v0.4) as a pinned
  `remote` source; offline use comes from the vendored copy. Which versions `init` installs (the
  "default set") is an open question of dl-138's Action 2 tech-spec; this repository proposed
  WingFoil's option (b): each WingFoil release pins a commit of this catalog that names the default
  set (F-027);
- **R2:** a stage is an overlay; changing a stage is a pack update of the `stage/*` overlay, and the
  transition is run by the target stage's workflow (WingFoil dl-178, F-028); nothing depends on a
  `stage set` verb. The `transition` kind stays, descriptive (plan-032, the approver's ruling);
- **R3:** `built-in/` stays WingFoil's own; packs use kind-relative paths and land where
  `pack-install` maps them (dl-138's `remote` class, F-029);
- **R4:** the capability vocabulary is provisional, `pack-install` and `workflow-engine`; a release
  is recorded as providing a capability only when its CHANGELOG names the feature or command behind
  it (WingFoil dl-177 is the capabilities query, not planned yet).

Approved documents are edited in place, each **Version** line bumped once and its **Date** set
(`doc-versioning`), each change citing dl-021; as plan-021 did for dl-014. Approved decision-logs
are not edited: an Execution Note records what dl-021 supersedes, as plan-032 did for dl-003.

## Steps

All work happens on branch `dl/dl-021-vision`, from `main` at `4b1f481` through `7498b41` (the
commit that adds plan-033, so that this plan takes the next number), one commit per row.

| # | File | Change | Source |
|---|---|---|---|
| 1 | `01_product-brief.md` (1.0 → 1.1) | §1: no npm bundle, packs installed from here as a pinned source; §3 purpose 2 "downloads and bundles" → "installs"; §4: until v0.4 WingFoil reads the catalog and, if it adopts option (b), pins a catalog commit; from v0.4 the adopter's commands are `init`, `pack add` and `upgrade` (no `stage set`); §8 the first signal becomes "a WingFoil release installs packs published here"; §10 the journey "WingFoil advances its bundled packs" becomes "a WingFoil release pins this catalog" | R1, R2 |
| 2 | `02_product-vision.md` (1.2 → 1.3) | Value by Audience, WingFoil maintainer: a versioned, validated source of the packs WingFoil installs | R1 |
| 3 | `03_is-isnot.md` (1.3 → 1.4) | IS: "the source of the packs WingFoil bundles as offline fallback" → "the source WingFoil installs packs from, a pinned `remote` source"; DOES: "writes into WingFoil-managed folders only (`built-in/`)" → kind-relative paths, landing where `pack-install` maps them, never `built-in/` or `custom/`; DOES: the feedback notes for schema changes only, through `wingfoil-cli` (the directive's current name) | R1, R3 |
| 4 | `04_personas.md` (1.1 → 1.2) | the persona list, Kai (`stage set` → a pack update of the stage overlay), the WingFoil maintainer (goal, needs and success: a release installs and pins packs from here, no bundle) | R1, R2 |
| 5 | `05_journeys.md` (1.1 → 1.2) | the commands named (no `stage set`); J1 step 7 (no bundling note); J2 step 3 and J7 step 3 (the install folder of R3, never `custom/`); **J3** becomes "Pin this catalog in a WingFoil release", its steps following option (b), noted as proposed and open in dl-138's tech-spec; J4 step 1 (the CHANGELOG rule of R4); **J8** "Move to the next stage" as a pack update of the stage overlay, its priority "when WingFoil installs pack updates (v0.4)"; the review decisions' J8 line | R1–R4 |
| 6 | `06_features.md` (1.3 → 1.4) | F2.4 (the provisional vocabulary of R4, WingFoil dl-177); F4.7 (a transition run by the target stage's workflow through a pack update); F5.4 (a note for every schema change; no bundled-pack note) | R2, R4 |
| 7 | `07_sequencer.md` (1.2 → 1.3) | W7's "Ends with" (the note is the schema note); W10 "the bundled methodologies" → "the first methodologies"; W12's transition as R2 reads it | R1, R2 |
| 8 | `08_mvp-canvas.md` (1.1 → 1.2) | the WingFoil maintainer persona (versioned packs to install and pin); J3's new title; the expected result and the metric "a WingFoil release that installs packs from here"; W4's open point (the provisional vocabulary) | R1, R4 |
| 9 | dl-001, dl-002, dl-012 | an Execution Note each: dl-001 D1 (stages: transitions run by the stage's workflow), D4 (no bundle, no advance step) and D5 (the transition kept, descriptive); dl-002 (the provisional vocabulary of R4, `stage-transitions` gone); dl-012 (no bundling of the feedback pack). The bodies stay as approved; dl-012 stays `pending` | R1, R2, R4 |

Then:
- **Checks:** a grep of `docs/01_vision/` for `bundl`, `stage set`, `advance`, `offline fallback`,
  `T13` and `wingfoil-feedback` gives no hit, except where a passage states what dl-021 superseded;
  every changed document's **Version** and **Date** bumped once; `npm test` (`tests/root-readme`,
  the inbox tests) and `npm run lint` exit 0.
- **Review:** an independent review of the branch by a subagent (dl-017), its findings fixed, a
  re-review when a fix changes a decision's reading.
- **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
  `--no-ff` merge into `main`, push, the branch and the worktree removed; dl-021's Execution Notes
  record the actions applied.

## Handoff

- **claude:** the rows above, the checks, the review hand-off, the merge once approved.
- **Approver:** the merge of `dl/dl-021-vision`, in chat; a reading of J3 or J8 that differs from
  the rows above.
- Done when the branch is merged and pushed, and dl-021 cites the result.

## Execution Notes

<!-- Filled while the plan runs. -->
