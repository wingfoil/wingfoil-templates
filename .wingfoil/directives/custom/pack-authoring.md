---
id: pack-authoring
name: pack-authoring
type: directive
kind: custom
title: "Pack authoring"
tags: [packs]
---

# Pack authoring

Applies to every role that writes or reviews pack content under `packs/`.

- Pack names are unique across the whole catalog, whatever the axis or slot, because the `pack`
  Memory element id is `pack-{axis}-{name}` (dl-004). The foundation packs `base` and `software` are
  the elements `pack-foundation-base` and `pack-foundation-software`: `foundation` is the value of
  their element's `axis` field, while in `pack.yaml` and `catalog.yaml` both stay outside the axes
  (dl-022).
- Every pack lives in `packs/<axis>/[<slot>/]<name>/` and has a `pack.yaml`, a `README.md` and a
  `CHANGELOG.md`. Its `pack.yaml` validates against `schema/pack.schema.json`.
- A pack's `README.md` follows spec-002 §2 (dl-014 D1): its nine sections, in order. The generated
  ones (title, composition, what it adds, parameters) are written by `npm run index` from the pack's
  own files, never by hand. It holds no WingFoil CLI command; while no release listed in
  `compat.yaml` provides `pack-install`, its "Install and update" section gives the hand steps,
  marked temporary.
- Every example in a README is a fixture, `tests/fixtures/examples/<pack name>/<example>/`, that the
  validation command composes and validates, about a clearly fictional project (spec-002 §2.4,
  dl-014 CB-2). Its fictional names are not project values.
- A pack names no install folder: its asset paths are relative to each kind (directives,
  workflows, Memory templates); `pack-install` will map them into WingFoil's `remote` class once
  WingFoil dl-138's Action 2 tech-spec fixes it (dl-021 R3, spec-001 §7.6, O12). `built-in/` is
  WingFoil's own. Until then the reference composer maps packs as spec-001 §7.6 states for format
  1, and a Memory template's `template.file` keeps its format-1 path (spec-001 O13). A pack never
  writes `custom/`: that is where projects override it, and an update must be able to replace pack
  files without touching theirs.
- `pack.yaml` declares the `formats` of every file kind the pack ships and the WingFoil
  `requires_capabilities` it relies on, from the `compat.yaml` vocabulary (dl-002). Content uses
  only what those formats and capabilities provide.
- No project-specific values: names, paths, people and versions of the target project are
  parameters, declared in `pack.yaml` with a type, and a default unless the parameter is required
  (spec-001 §8.1).
- Composition is deterministic: no timestamps, no randomness, no ordering that depends on the
  filesystem. Lists in fragments are written in the order they must appear.
- A workflow includes another workflow by **name**, never by path (WingFoil bug-144). Every
  `include`, every role, every Memory type and every directive id a pack references is shipped by the
  pack itself or by a pack it `requires`.
- A pack declares what it `requires` and what it `conflicts` with; one methodology and one pack per
  phase slot per project.
- Every workflow phase that should create or move an element says so with `actions` and `produces`:
  a phase that parses but declares none of `include`, `actions`, `produces` and `approval` is a
  defect (WingFoil benchmark note N1); a phase with an `approval` alone is a checkpoint, a gate.
- Every pack except `base` requires `base` (`requires: [base@^<major>]`) and only adds to it or
  tightens it (dl-003 D1). `software` requires `base` only. Every phase pack requires `software`,
  and so does every pack that uses a Memory type, a workflow, a directive or a parameter of
  `software` outside a conditional part (spec-001 §3, §6.3; dl-022 S3). Overlays (`team-mode`,
  `stage`) only add or tighten relative to everything else; they never remove what a methodology
  ships. In a Memory state machine, adding a state or a gate is allowed; removing either is not.
- A pack that does not require `software`, and whose content only makes sense with it (a
  methodology's `delivery`), declares that content in a `conditional` entry,
  `with: software@^<major>` (spec-001 §6.5): it counts only in a composition holding `software`,
  and nothing outside it uses that content or anything of `software`'s. A pack that requires
  `software` ships everything in `contents`.
- Slots (dl-003 D4, D11). They exist only with `software`. `sw-life-cycle` and the slot defaults
  belong to `software`, `retrospective` and `governance-evolution` to `base` (dl-022).
  `sw-life-cycle` includes `inception`, `specification`, `delivery` and `end-of-life` by name; the
  methodology's `delivery` includes `release` and `retrospective` by name, at its own cadence,
  directly or through sub-workflows the methodology ships in the same part (dl-026), and every
  phase that includes `release` iterates over `release` with `status: [in-development,
  releasing]`, any other `where` key being a field of the composed `release` (dl-027). A
  phase pack fills one of the slots `inception`, `specification`, `release`, `end-of-life` by
  shipping a workflow with the slot's name; this is the one case where a pack file replaces another
  pack's file. `delivery` is filled by the methodology, never by a phase pack: in its conditional
  entry, or in `contents` when the methodology requires `software`.
- `AGENTS.md` and every agent file at the repository root are never pack files (dl-003 R1). A pack
  contributes at most one section (`agents_section`), and WingFoil generates the file (WingFoil
  dl-137).
