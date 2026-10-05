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

- Every pack lives in `packs/<axis>/[<slot>/]<name>/` and has a `pack.yaml`, a `README.md` and a
  `CHANGELOG.md`. Its `pack.yaml` validates against `schema/pack.schema.json`.
- A pack only ever writes under `built-in/` in a project (`directives/built-in/`,
  `workflows/built-in/`, Memory templates). It never writes `custom/`: that is where projects
  override it, and `wingfoil upgrade` must be able to replace pack files without touching theirs.
- No project-specific values: names, paths, people and versions of the target project are
  parameters, declared in `pack.yaml` with a type and a default.
- Composition is deterministic: no timestamps, no randomness, no ordering that depends on the
  filesystem. Lists in fragments are written in the order they must appear.
- A workflow includes another workflow by **name**, never by path (WingFoil bug-144). Every
  `include`, every role, every Memory type and every directive id a pack references is shipped by the
  pack itself or by a pack it `requires`.
- A pack declares what it `requires` and what it `conflicts` with; one methodology and one pack per
  phase slot per project.
- Every workflow phase that should create or move an element says so with `actions` and `produces`:
  a phase that parses but declares nothing is a defect (WingFoil benchmark note N1).
- Overlays (`team-mode`, `stage`) only add or tighten; they never remove what a methodology ships.
