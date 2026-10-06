# Product Vision — WingFoil-Templates

**Version:** 1.1
**Date:** 2026-10-06
**Status:** Draft
**Traces to:** [01_product-brief.md](01_product-brief.md)

---

## Vision Statement

**For** teams and solo developers who run their projects with WingFoil, and for WingFoil itself,
**who** today get one of two monolithic templates compiled into the CLI and then hand-edit their
`.wingfoil/` with nothing to update it afterwards,
**WingFoil-Templates is** the official, public catalog of versioned process packs
**that** a project composes, one pack per concern, into a `.wingfoil/` that validates and that can
be upgraded as the packs evolve.
**Unlike** copying another project's configuration or starting from a generic scaffold,
**our product**:
- composes deterministically: the same packs, versions and parameters give byte-identical files;
- declares exactly which WingFoil releases can read each pack;
- is proven on WingFoil's own governed repositories before anyone else adopts it.

---

## Key Decisions

Already established. Sources: the brief, the configuration the approver confirmed, the approver's
constraints.

| Question | Decision |
|---|---|
| One vision or one per purpose? | **One vision.** The single source (purpose 2) and the alignment of the governed repositories (purpose 3) exist to make the catalog (purpose 1) trustworthy. |
| What is the product? | **The packs and their format**, not the tool that installs them. Resolving and installing packs belongs to the WingFoil CLI. This repository holds content, the format's schemas and the tooling that validates them. |
| Quality bar | **The north star:** every pack combination composes deterministically into a `.wingfoil/` that every compatible WingFoil release validates with zero errors. A pack that fails it is not published. |
| Versioning | **One semver per pack**, with no repository-wide version (`pack-semver` directive). |
| Where WingFoil changes happen | **In WingFoil, through its own process.** A WingFoil defect or gap found here becomes a note in `docs/wingfoil-feedback/`, never an edit to WingFoil (`wingfoil-feedback` directive). |
| Dogfooding | **This repository is a WingFoil project** and adopts its own packs. Its history is the first evidence that the packs work. |
| Timing | **The MVP is ready when WingFoil v0.4 installs packs** (WingFoil dl-138). `base` waits for the formats of v0.3. |
| Official and community packs | **Two catalogs** (vision review). The official one is curated; the community one is broader, written and maintained by external contributors, and opens later. |
| Language | **English only** (vision review). |

Proposed here and ruled in the **pack-model** phase. These come from the 2026-10-01..05 design
discussion and the first attempt; they are not yet approved elements.

| Question | Proposal |
|---|---|
| How is a configuration composed? | Packs along **orthogonal axes**: `methodology` (exactly one), `team-mode` (overlay), `phase/<slot>`, `blueprint`, `stage` (overlay), `governance`. They sit on top of a **foundation pack, `base`**, which every pack requires. |
| How is compatibility declared? | By the **file formats** a pack is written in and the **capabilities** it needs. A WingFoil version range is never written by hand: it is computed from `compat.yaml` (notes D6). |
| How is a version addressed and verified? | A **git tag per pack version**, plus a **digest** in `catalog.yaml`. The exact conventions are in the pack-model and spec-001. |

---

## Value by Audience

| Audience | What they get |
|---|---|
| Adopter | A working process in one `init`: methodology, team mode, phase methods, blueprint and stage. They can upgrade it later without losing their own overrides in `custom/`. |
| WingFoil maintainer | A versioned, validated source for the bundled packs, in place of templates compiled into the CLI. A compatibility table tells which release reads what. |
| Governed-repository maintainer | One shared foundation (`base`) for Memory types, life cycles, capture workflows and directives across the four repositories. The project-specific parts stay their own. |
| Pack author | A documented format with schemas, authoring rules and a validation that tells whether a pack is publishable. |
| External contributor (later) | A way to propose changes to official packs as Memory elements, with credit, on WingFoil's contribution model. A community catalog where they publish and maintain their own packs. |

---

## Decisions from the vision review

Approver, 2026-10-06:

1. **Two catalogs.**
   - **Official packs:** a curated catalog. Packs are few, validated and maintained, and a pack
     enters only if its line will be maintained.
   - **Community packs:** a broader catalog of packs suggested, created and maintained by external
     contributors. It opens together with external contributions (brief §5).

   Still open, for the features and pack-model phases:
   - where community packs live (this repository or their own repositories);
   - how a reader tells them apart from official packs;
   - how they relate to WingFoil's third-party sources and allowlist (dl-138 Q4).
2. **Hand adoption is temporary.** Packs carry hand-adoption steps only until the WingFoil CLI can
   install them. Then the steps are removed from the packs. At most, a generic procedure stays in one
   user-docs file.
3. **English only.** All pack content is in English. Translated packs are out of scope.
