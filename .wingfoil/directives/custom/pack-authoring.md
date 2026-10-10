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
  Memory element id is `pack-{axis}-{name}` (dl-004). `base` is the element `pack-foundation-base`:
  `foundation` is reserved for it in the element's `axis` field, while in `catalog.yaml` `base` stays
  outside the axes.
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
- A pack only ever writes into the WingFoil-managed asset folders of a project: `built-in/` today
  (`directives/built-in/`, `workflows/built-in/`, Memory templates), or a `remote/` class if
  WingFoil's dl-138 Q3 ratifies one (dl-003). It never writes `custom/`: that is where projects
  override it, and an update must be able to replace pack files without touching theirs.
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
  a phase that parses but declares nothing is a defect (WingFoil benchmark note N1).
- Every pack except `base` requires the foundation pack (`requires: [base@^<major>]`) and only adds to it or
  tightens it (dl-003 D1). Overlays (`team-mode`, `stage`) only add or tighten relative to everything
  else; they never remove what a methodology ships. In a Memory state machine, adding a state or a
  gate is allowed; removing either is not.
- Slots (dl-003 D4, D11). `sw-life-cycle` belongs to `base` and includes `inception`,
  `specification`, `delivery` and `end-of-life` by name; the methodology's `delivery` includes
  `release` and `retrospective` by name, at its own cadence. A phase pack fills one of the slots
  `inception`, `specification`, `release`, `end-of-life` by shipping a workflow with the slot's
  name; this is the one case where a pack file replaces another pack's file. `delivery` is filled by
  the methodology, never by a phase pack.
- `AGENTS.md` and every agent file at the repository root are never pack files (dl-003 R1). A pack
  contributes at most one section (`agents_section`), and WingFoil generates the file (WingFoil
  dl-137).
