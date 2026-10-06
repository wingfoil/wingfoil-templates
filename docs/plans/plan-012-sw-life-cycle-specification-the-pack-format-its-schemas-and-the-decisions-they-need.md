---
id: plan-012-sw-life-cycle-specification-the-pack-format-its-schemas-and-the-decisions-they-need
type: plan
title: "sw-life-cycle specification: the pack format, its schemas and the decisions they need"
status: done
workflow: "sw-life-cycle"
phase: "specification"
tags: ["spec"]
---

## Context

Second phase of `sw-life-cycle`, run as architect. The approver approved the inception phase on
2026-10-06 (plan-001), together with dl-001…dl-006. The configuration those decision-logs imply is
on `main` (`db616ef`, plan-011).

The phase produces, as `sw-life-cycle` declares:
- `docs/memory/tech-spec/spec-001-*.md`, the pack format;
- `schema/*.schema.json`, the contract with the WingFoil CLI.

A change to `schema/` produces a feedback note to WingFoil (`wingfoil-feedback` directive). The
approver closes the phase (`approval: { by_role: approver }`).

Inputs:
- `docs/01_vision/06_features.md` F1–F3 and `07_sequencer.md` M0, waves W1–W4;
- dl-001 (pack model), dl-002 (formats and capabilities), dl-003 (`base`, slots D4/D11, the
  `governance` axis, AGENTS.md R1–R4), dl-004 (1a, 2a, 3b, 4a), dl-005, dl-006;
- WingFoil dl-149 (`format:` key, `ready`) and task-251 (`done`), read in WingFoil2 at `7f13f77f`;
- the uncommitted notes: `docs/wingfoil-feedback/X_wingfoil-templates-notes.md` (T1–T16) and
  `docs/notes/base-regeneration-inputs.md` §1–§2;
- the drafts on `archive/draft-2026-10-05` (`schema/`, `catalog.yaml`, `compat.yaml`, `packs/`,
  `transitions/`): source material to re-read, never cherry-picked.

Out of scope:
- dl-007 (phase methods) is `pending` on purpose, deferred by the approver until WingFoil supports
  templates. spec-001 has no `method` entry. plan-010 stays `active`.
- The tooling (sequencer M1) is the next phase. `base` waits for the approver's gate on the final
  WingFoil v0.3 formats, and is published only after v0.3 is released.

Ruled by the approver on 2026-10-06, when this plan was presented:
- the `operations` slot: option (b), its functions belong to `stage/production` and
  `stage/maintenance`; recorded through dl-008;
- two ADRs, one per architecture choice of the features review;
- the work runs on branch `spec/spec-001`, merged into `main` with `--no-ff`;
- dl-004's Decision section is corrected to record the ruling;
- in `pack.yaml`, `version:` stays the pack's semver (its content revision, coherent with dl-149)
  and `format:` is a separate counter; `catalog.yaml`, `compat.yaml`, presets and transitions carry
  `format:` only.

## Steps

1. **Correct dl-004** (architect, claude). Its Decision section still reads as a proposal. It
   records the approver's ruling of 2026-10-06 (approve commit `a66be1d`: 1(a), 2(a), 3(b), 4(a)),
   with an Execution Note naming this plan. Status unchanged.
2. **The `operations` slot** (facilitator, claude), through `decision-log-ingest` › `capture` with
   its own plan: dl-008 records options (a) a later slot and (b) stage overlays, and the
   approver's ruling (b). Committed, then `submit` (→ `pending`). spec-001 fixes the slot list only
   after the approver's `approve`.
3. **Two ADRs** (architect, claude), through `adr-ingest` › `capture` with its own plan:
   - a reference composer in this repository, proposed to WingFoil as its implementation (features
     review, option c; notes T15);
   - the tooling in TypeScript on Node.js ≥ 22.12.

   Each committed, then `submit` (→ `pending`). T15 gets the ADR's id.
4. **spec-001** (architect, claude): `memory add --type tech-spec`. The body covers:
   - the axes, their cardinalities, overlays and slots (dl-001, dl-003, dl-008);
   - `pack.yaml`: id, axis, slot, name, version, `format`, `formats`, `requires_capabilities`,
     `requires` and `conflicts` with semver ranges, contents, parameters;
   - the fragments of `dna`, `roles`, `memory` and `workflows`: merge order, and the
     add-or-tighten rule for Memory state machines, with examples;
   - parameters `{{name}}`, typed with defaults; the composer substitutes only double braces, so
     WingFoil's tokens (`{id}`, `{n}`, `{slug}`, and the project's `{release}`, `{scope}`) pass
     through;
   - the slots of dl-003 D4/D11, with `release` and `retrospective` included by the methodology's
     `delivery`;
   - `agents_section`, with provisional markers (notes T14);
   - `catalog.yaml`, which tells official packs from community packs (dl-001 D7; where community
     packs live stays open);
   - `compat.yaml` and the computed WingFoil range;
   - presets and transitions;
   - tags `<catalog pack id>@<version>` and branches `maint/<catalog pack id>/<major>.x`;
   - the digest procedure of dl-004 4(a): listing format, path normalization, sort order;
   - the `format:` key on every file a pack ships and on this repository's own files;
   - what the reference composer must do.

   Committed, then `submit` (→ `pending`).
5. **`schema/*.schema.json`** (architect, claude): `pack`, `catalog`, `compat`, `preset`,
   `transition`, rewritten from the archive drafts and aligned with spec-001. Each schema is checked
   to compile, and to validate a sample of each file kind. The schema change produces feedback note
   T17, which stays uncommitted (dl-005 G3).
6. **Phase gate.** An independent review by another session is offered. Then the approver gets one
   chained command with the pending `approve`s, and approves the phase in chat. The branch is merged
   into `main` with `--no-ff`, and this plan goes `active → done`.

## Handoff

- **claude:** steps 1–5, and the handoff of step 6. It never runs `memory approve` or
  `memory reject`.
- **Approver:**
  - after step 2, `approve` dl-008. spec-001 does not fix the slot list before it;
  - at step 6, `approve` the ADRs and spec-001, the phase gate in chat, and the merge.
- A rejected element goes back to `draft`, is corrected under its plan and submitted again.
- Done when spec-001 and both ADRs are `approved`, `schema/` is on `main`, and the approver has
  approved the phase.

## Execution Notes
- 2026-10-06: plan-012 went `draft → active` (`60dc019`) on branch `spec/spec-001`.
- Step 1: dl-004's Decision section records the ruling (`09318c5`). Its status is unchanged.
- Step 2: plan-013 captured dl-008. The approver ruled option (b) in chat and approved it
  (`68723d4`). plan-013 is `done`.
- Step 3: plan-014 captured adr-001 (reference composer) and adr-002 (TypeScript on Node.js
  ≥ 22.12). Both are `pending` (`694437d`, `ecd29e8`), for the approver at the phase gate. Feedback
  note T15 names them.
- Steps 4–5, one deviation: the schemas were written before spec-001 was submitted, not after, so
  that the spec was corrected while still `draft` and not amended while `pending`. spec-001 is
  `f555ebe` (body) and `9fe7474` (submit); the schemas are `fe55755`. Feedback note T17 reports the
  contract.
- Found while specifying, and recorded in spec-001 rather than worked around:
  - WingFoil 0.2.2 warns on `format:` (`format_key`, O10);
  - Memory templates go under `memory/templates/built-in/`, checked to work on 0.2.2.
- Next: step 6, the phase gate.
- 2026-10-06, step 6: an independent review ran in a separate context (a subagent of the
  authoring session, with its own context). Its verdict was **request changes**:
  - one blocking finding, B1: a type following `defaults` could have its machine replaced;
  - seven should-fix findings, S1–S7, and nine nits.

  Everything else checked out: the digest vector, the five schemas, commit hygiene, no `.wingfoil/`
  change, no dl-007 `method`, and valid ref names.
- The approver ruled the two deviations the review raised (S4): no `workflows.yaml` fragment, and
  required parameters without a default. The approver had spec-001 amended while `pending`, with
  every finding fixed: `88e02b9` (spec) and `5939b9b` (schemas).
- **Follow-ups for a later configuration change,** each from an approved element, with a `version:`
  bump:
  - `pack-authoring`: parameters "with a type and a default" → "with a type, and a default unless
    required" (S4b);
  - `pack-semver`: its example tag `base@0.1.0` predates the rule that the first published version is
    ≥ 1.0.0 (review N2);
  - `dna.yaml`: the `packs` module does not name the `governance` axis (already open);
  - the feature text of F1.2 and F1.3 stays as approved; spec-001 §1 records the deviations.
- **Milestone M0 (review N9):** M0 closes with spec-001 and `schema/` approved. The real
  `catalog.yaml` and `compat.yaml` are written with the tooling (M1) and with `base` (M2). The W3
  and W4 exit criteria are therefore met as a specification and its schemas, not as committed files.
- 2026-10-06: the same reviewer re-reviewed the amendment and found nothing blocking. It raised two
  should-fix points in §7.5 and five nits, all fixed in a second amendment (89d535f).
  The validators agree on 34 samples.
- 2026-10-06: the approver approved adr-001 (`fa3de60`), adr-002 (`a2d5171`) and spec-001
  (`212ea0d`), then approved the specification phase in chat ("approvo la fase"). The branch
  `spec/spec-001` is merged into `main` with `--no-ff`, and this plan is done.
- Next: the `tooling` phase (sequencer M1), one `kanban-delivery` iteration per task with no pack.
  `base` waits for the approver's gate on the final WingFoil v0.3 formats, and is published only
  after v0.3 is released.
