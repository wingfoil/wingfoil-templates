# Is / Is Not / Does / Does Not — WingFoil-Templates

**Version:** 1.0
**Date:** 2026-10-06
**Status:** Draft
**Traces to:** [01_product-brief.md](01_product-brief.md), [02_product-vision.md](02_product-vision.md)

Items marked *(pack-model)* depend on proposals ruled in the pack-model phase.

---

## IS

- The official, public **catalog of WingFoil process packs**: methodologies, team-mode overlays,
  phase methods, project blueprints, lifecycle stages, and the transitions between stages
  *(pack-model)*.
- The **pack format** and its JSON Schemas. They are the contract with the WingFoil CLI (spec-001).
- An **index** that the CLI reads (`catalog.yaml`): packs, published versions and their digests. It
  comes with a **compatibility table** (`compat.yaml`) that maps each WingFoil release to what it
  reads and provides *(pack-model)*.
- The **source of the packs WingFoil bundles** as offline fallback.
- The **tooling that validates** packs: composition, schema checks, the compatibility matrix,
  determinism.
- A **WingFoil-managed project** that adopts its own packs.

## IS NOT

- The WingFoil CLI. It contains no resolver, installer or upgrade logic: those belong to WingFoil.
- A place to change WingFoil. WingFoil's defects and gaps found here become notes for WingFoil's own
  process.
- A scaffolder of application code. A blueprint shapes the process configuration (paths, modules,
  domain directives, Memory types, checks). It does not generate source code.
- A registry of third-party packs. Other sources are WingFoil's decision (dl-138 Q4).
- A collection of project-specific configurations. A pack carries no project's names, paths, people
  or versions; those are parameters.
- Open to code pull requests from outside, for now. Contributions open later as Memory elements
  (brief §5).

## DOES

- **Versions every pack on its own** (semver) and records every published version in a
  `pack-release` element. The validation evidence is part of that element.
- **Validates before publishing.** Every preset and documented combination that contains the pack is
  composed with the oldest and the newest compatible WingFoil release. Each must validate with exit 0
  and no warning, and two compositions must be byte-identical (`pack-compatibility`).
- **Writes into WingFoil-managed folders only** (`built-in/`). It never writes `custom/`, so a
  project's overrides survive an upgrade (`pack-authoring`).
- **Declares what each pack requires and conflicts with**, and has overlays only add or tighten,
  never remove (`pack-authoring`).
- **Keeps older versions resolvable.** A published tag is never moved or deleted (`pack-semver`).
- **Records its decisions in Memory**, and every pack, task and release traces back to them
  (`traceability`).
- **Reports to WingFoil** every schema change and every publication of a bundled pack, as a note
  (`wingfoil-feedback`).

## DOES NOT

- Publish a pack against an unreleased WingFoil build (`pack-compatibility`).
- Write a WingFoil version range by hand *(pack-model)*.
- Publish `base` before WingFoil2 v0.3 has finished its format changes (approver's constraint).
- Ship `AGENTS.md` or any agent file at the repository root as a pack file. Packs contribute a
  section, and WingFoil generates the file *(pack-model)*.
- Let an overlay remove what a methodology ships (`pack-authoring`).
- Depend on wall-clock time, randomness or filesystem ordering in pack content or tooling
  (`determinism`).
