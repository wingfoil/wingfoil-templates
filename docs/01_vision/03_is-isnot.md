# Is / Is Not / Does / Does Not — WingFoil-Templates

**Version:** 1.5
**Date:** 2026-10-15
**Status:** Approved
**Traces to:** [01_product-brief.md](01_product-brief.md), [02_product-vision.md](02_product-vision.md)

Items marked *(pack-model)* depend on proposals ruled in the pack-model phase.

---

## IS

- The official, public **catalog of WingFoil process packs**: methodologies, team-mode overlays,
  phase methods, project blueprints, lifecycle stages, and the transitions between stages
  *(pack-model)*. The catalog is curated.
- Later, also a broader **community catalog**: packs suggested, created and maintained by external
  contributors, kept distinct from the official ones (vision review).
- The **pack format** and its JSON Schemas. They are the contract with the WingFoil CLI (spec-001).
- An **index** that the CLI reads (`catalog.yaml`): packs, published versions and their digests. It
  comes with a **compatibility table** (`compat.yaml`) that maps each WingFoil release to what it
  reads and provides *(pack-model)*.
- A **browsable index for people and agents** (`CATALOG.md`, `catalog-index.json`), generated from
  the catalog (dl-014).
- The **source WingFoil installs packs from**: a project pins it as a `remote` source and vendors
  what it installs, so no pack is bundled in WingFoil's npm package (dl-021 R1, WingFoil dl-138).
- The **tooling that validates** packs: composition, schema checks, the compatibility matrix,
  determinism.
- A **WingFoil-managed project** that adopts its own packs.

## IS NOT

- The WingFoil CLI. It contains no resolver, installer or upgrade logic: those belong to WingFoil.
- A place to change WingFoil. WingFoil's defects and gaps found here become notes for WingFoil's own
  process.
- A scaffolder of application code. A blueprint shapes the process configuration (paths, modules,
  domain directives, Memory types, checks). It does not generate source code.
- A registry of other pack sources. Which sources the CLI trusts is WingFoil's decision
  (dl-138 Q4). Where community packs live is still open (vision review).
- A collection of project-specific configurations. A pack carries no project's names, paths, people
  or versions; those are parameters.
- Open to code pull requests from outside, for now. Contributions open later as Memory elements
  (brief §5).
- Translated. Pack content is in English, the bridge language. Text quoted from a regulation may
  stay in its original language. Packs are localized by geographic area, as `governance` packs for
  an area's regulations, never by language (vision review).
- A manual. Hand-adoption steps exist only until the WingFoil CLI installs packs. After that, at
  most a generic procedure stays in the user docs (vision review).

## DOES

- **Versions every pack on its own** (semver) and records every published version in a
  `pack-release` element. The validation evidence is part of that element.
- **Validates before publishing.** Every preset and documented combination that contains the pack is
  composed with the oldest and the newest compatible WingFoil release. Each must validate with exit 0
  and no warning, and two compositions must be byte-identical (`pack-compatibility`).
- **Ships files at kind-relative paths**, which land where WingFoil's `pack-install` maps them, in
  dl-138's `remote` class; `built-in/` stays WingFoil's own (spec-001 O12, format 1's mapping
  applying until dl-138's tech-spec fixes the folder), and a pack never writes `custom/`, so a
  project's overrides survive an upgrade (dl-021 R3, `pack-authoring`).
- **Declares what each pack requires and conflicts with**, and has overlays only add or tighten,
  never remove (`pack-authoring`).
- **Keeps older versions resolvable.** A published tag is never moved or deleted (`pack-semver`).
- **Records its decisions in Memory**, and every pack, task and release traces back to them
  (`traceability`).
- **Reports to WingFoil** every schema change, as a note in this repository's feedback inbox
  (`docs/wingfoil-feedback/`, `wingfoil-cli`); no
  pack is bundled, so a publication needs no note of its own (dl-021 R1).

## DOES NOT

- Publish a pack against an unreleased WingFoil build (`pack-compatibility`).
- Write a WingFoil version range by hand *(pack-model)*.
- Publish the foundation packs, `base` and `software`, before WingFoil2 v0.3 has finished its format
  changes (approver's constraint).
- Ship `AGENTS.md` or any agent file at the repository root as a pack file. Packs contribute a
  section, and WingFoil generates the file *(pack-model)*.
- Let an overlay remove what a methodology ships (`pack-authoring`).
- Depend on wall-clock time, randomness or filesystem ordering in pack content or tooling
  (`determinism`).

---

## Review decisions

- **1.1, vision review (2026-10-06).** The approver ruled three points:
  - two catalogs, a curated official one and a broader community one;
  - hand adoption only until the CLI installs packs;
  - English only.

  Source: [02_product-vision.md](02_product-vision.md), "Decisions from the vision review".
- **1.2, vision review (2026-10-06).** Localization is by geographic area (regulatory `governance`
  packs), not by language. English is the bridge language, and regulatory quotes may stay in their
  original language.
