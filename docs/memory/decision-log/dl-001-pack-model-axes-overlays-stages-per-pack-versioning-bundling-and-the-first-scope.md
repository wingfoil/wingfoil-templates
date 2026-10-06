---
id: dl-001-pack-model-axes-overlays-stages-per-pack-versioning-bundling-and-the-first-scope
type: decision-log
title: "Pack model: axes, overlays, stages, per-pack versioning, bundling and the first scope"
status: draft
tags: ["founding","packs"]
---

## Context

WingFoil-Templates is the official, public catalog of the process packs that the WingFoil CLI
downloads (`docs/01_vision/01_product-brief.md`, `02_product-vision.md`). Before any format is
specified (spec-001) or any pack is chartered, the pack model must be fixed: how a configuration is
composed, versioned and distributed, and what the first catalog contains.

Today WingFoil's templates are TypeScript strings compiled into the CLI (Scrum, Kanban). One template
per combination of methodology, team, project type and stage grows combinatorially (feedback notes
T1, T2). The rulings below come from:
- the design discussion of 2026-10-01..05: the approver's answers to five questions, recorded as D1–D5
  in the feedback notes;
- the inception of 2026-10-06: the vision, features and sequencer reviews.

The first attempt drafted them as dl-001 on `archive/draft-2026-10-05`. That draft was never approved,
and this element replaces it.

## Options

- **Model.**
  - (a) One monolithic template per combination, as `--template Scrum|Kanban` today.
  - (b) Packs composed along orthogonal axes.
- **AI-agent variants.**
  - (a) Separate methodology packs, such as `agentic-scrum`.
  - (b) One overlay applicable to any methodology.
- **Stage scale.**
  - (a) A short scale: `demo`, `pre-release`, `post-release`.
  - (b) The full scale.
- **Versioning.**
  - (a) One repository-wide version.
  - (b) One semver per pack.
- **Fallback.**
  - (a) Remote packs only.
  - (b) The base packs also bundled in WingFoil's npm package.
- **Catalogs.**
  - (a) One catalog.
  - (b) A curated official catalog plus a broader community catalog.

## Decision

Ruled by the approver, Roberto Pompermaier.

- **D1 — Model** (2026-10-05). Packs are composed along axes, one pack per concern:

  | Axis | Cardinality | Kind |
  |---|---|---|
  | `methodology` | exactly one | |
  | `team-mode` | at most one | overlay |
  | `phase/<slot>` | one per slot: `inception`, `specification`, `release`, `operations` | |
  | `blueprint` | any number | |
  | `stage` | at most one | overlay |

  The `governance` axis is added by dl-003. Overlays only add or tighten; they never remove what a
  methodology ships. **Presets** name curated combinations. **Transitions** move a project from one
  stage to another.
- **D2 — AI-agent variants are an overlay**, `team-mode/agent-first` (2026-10-05). They are not
  separate methodology packs. A variant that turns out to be structurally different is promoted to a
  methodology of its own.
- **D3 — Full stage scale** (2026-10-05): `prototype` → `mvp` → `production` → `maintenance` →
  `sunset`.
- **D4 — One semver per pack**, with no repository-wide version (2026-10-05). The base packs stay
  bundled in WingFoil's npm package as offline fallback. Before every WingFoil release, WingFoil
  advances its bundled packs to the newest compatible version published here. That release step
  belongs to WingFoil (D6).
- **D5 — First scope** (2026-10-05):
  - `methodology/scrum`, `methodology/kanban`;
  - `team-mode/agent-first`;
  - `phase/inception/lean-inception`, `phase/specification/bdd-sbe`;
  - `blueprint/web-service`, `blueprint/cli-library`;
  - `stage/prototype`, `stage/production`, and the transition `prototype-to-production`.

  dl-003 adds `base` and `governance/wingfoil-dogfood`. The order is the sequencer's
  (`docs/01_vision/07_sequencer.md`).
- **D6 — WingFoil-side changes go through WingFoil's own process** (2026-10-05). They are notes in
  `docs/wingfoil-feedback/`, read at WingFoil's retrospective and release planning. This repository
  never edits WingFoil.
- **D7 — Two catalogs** (vision review, 2026-10-06).
  - The **official catalog** is curated: few packs, validated and maintained. A pack enters only if
    its line will be maintained.
  - A broader **community catalog** holds packs suggested, created and maintained by external
    contributors. It opens together with external contributions (dl-005).
- **D8 — English is the bridge language** (vision review, 2026-10-06). All pack content is in
  English. Packs are localized by **geographic area**, never translated: `governance` packs carry an
  area's regulations. Text quoted from a regulation may stay in its original language.

Consequences:
- spec-001 specifies the axes, cardinalities, overlays, slots, presets and transitions;
- `catalog.yaml` records the axes;
- the `pack-semver` directive already states D4's per-pack semver.

## Execution Notes

- Still open, and not ruled here:
  - which packs WingFoil bundles: D5's methodologies, or a smaller set. This is WingFoil's question
    (feedback notes, open question 3);
  - where community packs live, how they are told apart from official packs, and how they relate to
    WingFoil's third-party sources (WingFoil dl-138 Q4). For the features phase of M4.
- The candidate axis `stack` (feedback notes T2) is not in the model yet.
