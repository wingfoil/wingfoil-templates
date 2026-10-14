---
id: plan-033-dl-actions-dl-021-the-configuration-changes
type: plan
title: "dl actions: dl-021, the configuration changes"
status: draft
workflow: "decision-log-ingest"
phase: "rule"
tags: ["config","wingfoil"]
---

## Context

The configuration changes of dl-021 (`approved` 2026-10-13), requested by the approver in chat on
2026-10-14. As plan-026 and plan-027 host dl-016's actions, no workflow phase hosts this work: it
is filed under `decision-log-ingest` › `rule`.

Already applied: spec-001, dl-003's note and `compat.yaml`'s vocabulary (plan-032, task-028);
the feedback notes F-027 … F-029 (plan-030, task-027). Not in this plan: the removal of
`npm run publish:pack -- --bundled` and of the bundled-pack note of `src/feedback-note.ts`, a
tooling task of its own (dl-021 › Changes › Tooling); the vision and the amendments of dl-001,
dl-002 and dl-012. Until that tooling task, `--bundled` still exists in the tooling; after this
plan, no configuration asks for it.

The changes, from dl-021 › Changes › Configuration, each by file:

| # | File | Change | Source | Needed before |
|---|---|---|---|---|
| 1 | `pack-authoring` | A pack names no install folder: its asset paths are relative to each kind; `built-in/` is WingFoil's own; packs land in WingFoil's `remote` class through `pack-install`, as dl-138's Action 2 tech-spec fixes it; the reference composer's format-1 mapping stays spec-001 §7.6's, with O13 for the Memory template path | dl-021 R3, spec-001 §7.6, O12, O13 | W8 (`base`'s authoring) |
| 2 | `wingfoil-release-intake` (`version` 3 → 4) | `record`: the format versions a release reads come from its `format:` keys and its CHANGELOG, and a capability is recorded only when its CHANGELOG names the feature or command behind it; `wingfoil capabilities` and "notes T13" no longer named; a new format kind still enters `kinds` here, while a new capability enters the provisional vocabulary only as spec-001 §12 allows (WingFoil owns the final names, WingFoil dl-177); the header no longer says "after its advance-bundled-packs step" | dl-021 R1, R4; WingFoil's D4 proposal | the intake of WingFoil v0.3 (about 2026-10-20) |
| 3 | `wingfoil-cli` rule 8, still numbered 8 (cited by `src/feedback-note.ts`, `src/publish.ts` and their tests); version line `1.4 · 2026-10-14`, *Checked against* still `wingfoil@0.2.2` | a change to `schema/` produces a note; the "publication of a pack that WingFoil bundles" part goes, since no pack is bundled (the default set stays F-027's request; nothing about it enters the rule) | dl-021 R1 | W9 (first publication) |
| 4 | `pack-release-cycle` (`version` 6 → 7) | `publish`: the sentence on bundled packs and the `advance-bundled-packs` note goes | dl-021 R1 | W9 |
| 5 | `pack-release` template | `## Publication`: "Whether the pack is one WingFoil bundles…" goes | dl-021 R1 | W9 |
| 6 | `templates-inception` (`version` 2 → 3) | the personas phase no longer names "the WingFoil maintainers who bundle them" | dl-021 R1 | — |
| 7 | `dna.yaml` (`version` 7 → 8) | the project description, worded positively: WingFoil's `pack-install` installs packs from this repository as a source pinned by a lock, read offline from the vendored copy after a first fetch; the `transitions` module: "descriptive stage transitions, run as the target stage overlay's workflow on a pack update" | dl-021 R1, R2 and its Execution Notes; spec-001 §14 | — |

`pack-authoring` carries no version line; `wingfoil-cli` does (rule 5 asks a bump at a pin
advance; a bump at other changes follows the convention of `ffed728` and plan-026).

Not in this plan, found while reviewing it: the `presets` module of `dna.yaml` names
`wingfoil init --preset`, a verb WingFoil has not planned (its closest element is dl-164, in
discussion). dl-021 does not cover it; it goes to the next feedback note on `init` or to the next
retrospective, owner the approver.

## Steps

On the branch `config/dl-021-actions`, from `main` at `4b1f481`; one commit per row of the table.

1. **claude:** rows 1–7, in order.
2. **Checks:** `npm run -s wingfoil -- workflow list`, `dna show` and `directives list` exit 0
   with no warning; every `include` names a declared workflow, checked by a short YAML script as in
   plan-027 (`wingfoil-cli` W-08); `npm test` (the inbox tests read `wingfoil-cli`), `npm run
   lint`, `npm run check:packs` and `npm run validate` exit 0; a grep of `.wingfoil/` for `bundl`,
   `stage set`, `advance-bundled`, `stage-transitions`, `wingfoil capabilities`, `T13` and
   `built-in/ today` gives no hit.
3. **Review:** an independent review of the change (dl-017), its findings fixed, a re-review when
   a fix changes a rule.
4. **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
   `--no-ff` merge into `main`, push, the branch removed.

## Handoff

- **claude:** steps 1–4, except the merge OK. It never runs `memory approve` or `memory reject`.
- **Approver:** this plan before it is submitted; the merge OK.
- Done when the changes are on `main`, pushed. The plan then goes `active → done`.

## Execution Notes

- 2026-10-14: written; `workflow` and `phase` filled by editing the draft (W-02). Independent
  review: approve after amendments (`dna.yaml`'s version; rule 8 kept at number 8 and its version
  line; where `record` takes the formats; a complete grep; positive wording; the `--preset`
  module left out with an owner), amended.
