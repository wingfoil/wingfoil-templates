---
id: plan-001-sw-life-cycle-inception-frame-the-repository-and-fix-the-pack-model
type: plan
title: "sw-life-cycle inception: frame the repository and fix the pack model"
status: active
workflow: "sw-life-cycle"
phase: "inception"
tags: ["inception"]
---

## Context

First phase of `sw-life-cycle` on the restarted `main` (configuration commit `539e943`). The phase
includes `templates-inception`: a compact Lean Inception modelled on WingFoil2-Benchmark's
`benchmark-inception`, without its GQM experiment design (approver, 2026-10-06).

The first attempt, kept on `archive/draft-2026-10-05`, skipped this phase. Its drafts are source
material to re-read, never to cherry-pick:
- the decision-log drafts dl-001 (founding rulings D0–D5), dl-002 (compatibility by formats and
  capabilities), dl-003 (the `base` foundation pack, the `governance` axis, the AGENTS.md rules R1–R4);
- the conventions that reached only commits: pack id pattern, tag format, catalog digest.

Other sources, kept out of git by the approver's ruling of 2026-10-05:
- `docs/wingfoil-feedback/X_wingfoil-templates-notes.md` (notes T1–T14, decisions D1–D6);
- `docs/notes/base-regeneration-inputs.md`.

Constraints from the approver, in force for the whole phase:
- `base` is not published before WingFoil2 v0.3 finishes its format changes (dl-149 `format:` key,
  task-180, bindings.yaml, dev-loop 1.5/1.6, Memory templates; expected end of wave 3).
- Benchmark and UI adopt `base` only between their own releases.
- The repository will be public at `wingfoil/wingfoil-templates` (relayed by the session "Stato
  progetti wingfoil"; to be confirmed in the pack-model rulings).

Produces (through the sub-phases): `docs/01_vision/01…08`, the pack-model decision-logs, one plan per
sub-phase.

## Steps

One plan per sub-phase, created when the sub-phase starts, `draft → active → done`.

1. **brief** (facilitator, claude): questions to the approver, then
   `docs/01_vision/01_product-brief.md`.
2. **vision** (facilitator, claude): `02_product-vision.md`, `03_is-isnot.md`.
3. **personas** (facilitator, claude): `04_personas.md`. Projects that adopt packs, pack authors,
   WingFoil maintainers who bundle packs.
4. **journeys** (facilitator, claude): `05_journeys.md`. Init from a preset, add a pack, upgrade,
   move stage, author a pack, publish a version.
5. **features** (architect, claude): `06_features.md`, with the technical/business review.
6. **sequencer** (product-owner, the approver; claude drafts): `07_sequencer.md`,
   `08_mvp-canvas.md`. The order of the pack charters and the first publishable set.
7. **pack-model** (product-owner, the approver; claude captures as facilitator through
   `decision-log-ingest`). The proposed split, each element taken to `pending`:
   - dl-001: pack model, versioning and distribution (draft D0–D5, notes D1–D5);
   - dl-002: compatibility by formats and capabilities, line policy (D6, WingFoil dl-149 / task-251);
   - dl-003: the `base` foundation pack, the `governance` axis, AGENTS.md R1–R4;
   - dl-004: identifiers and addressing. These are proposals, never discussed with the approver:
     - the pack id pattern (slot of phase packs, axis of `base`);
     - the tag `<pack id>@<version>` and its overlap with maintenance branch names;
     - the direction of the catalog digest; the byte-level procedure belongs to spec-001;
   - dl-005: repository governance. The `.wingfoil/` configuration fits the project, the restart
     from the configuration commit, the notes stay out of git, the public repository, the approver
     email in `dna.yaml`.

   Rulings relayed by other sessions are marked "relayed by …". They become rulings only when the
   approver approves the element.

## Handoff

- **Approver:**
  - answers the brief questions;
  - owns the sequencer and the pack-model rulings;
  - approves each decision-log (`npx wingfoil memory approve <id>`);
  - approves the phase.
- **claude:**
  - writes the vision documents and the plans;
  - captures the decision-logs;
  - moves plans with `memory submit`;
  - never approves or rejects.
- Body edits are committed by hand before every `submit` (CLI note N13).
- Files are staged by name.
- Checkpoints: the end of each sub-phase (the approver reads the document), then the gate on the
  decision-logs.
- The plan is done when:
  - every `produces` of `templates-inception` exists on `main`;
  - every pack-model decision-log is approved;
  - the approver has approved the phase.

## Execution Notes

- 2026-10-06: before the phase started, the approver had the configuration commit amended
  (`ff5d49f` → `539e943`) rather than opening bugs or a decision-log. The amend:
  - adds `templates-inception`;
  - sets the pack id pattern to `pack-{axis}-{name}` (the CLI's `--set` fills only id tokens,
    notes T11);
  - aligns `dl-1`/`spec-1` to the CLI's padded ids;
  - drops the uncommitted feedback notes from the phase outputs.
- `workflow` and `phase` are not id tokens, so `memory add --set` cannot fill them (notes T11).
  They were filled by editing the draft.
