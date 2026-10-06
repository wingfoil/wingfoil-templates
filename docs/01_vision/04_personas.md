# Personas — WingFoil-Templates

**Version:** 1.1
**Date:** 2026-10-06
**Status:** Draft
**Traces to:** [01_product-brief.md](01_product-brief.md) §3–§5, [02_product-vision.md](02_product-vision.md) "Value by Audience"

---

This document describes two different sets of people, and they must not be confused:

- **Personas** (§1): the people, and the agent, who *use this repository*. They adopt packs, bundle
  them, write them, contribute to them, or work under them. They drive this repository's features.
- **Adoption profiles** (§2): the kinds of WingFoil user a project can have. The catalog and the
  presets are organized by them, so that an adopter can find "packs for teams like mine". They are a
  dimension of the catalog, not users of this repository.

---

## 1. Personas

### Persona 1 — Kai, the Adopter

- **Who:** a tech lead or a solo developer who starts a project with WingFoil, or brings WingFoil
  into an existing project.
- **Real from:** WingFoil v0.4, when the CLI installs packs.
- **Goal:** a working process in one `init` that fits the team and the project. Kai wants to change
  it later, through `pack add`, `upgrade` and `stage set`, without rewriting it.
- **Pain today:** `init` offers Scrum or Kanban, and everything else is hand-editing `.wingfoil/`.
  After that, nothing updates the configuration, and nothing says what produced it.
- **Needs from the packs:**
  - presets named after recognizable situations;
  - one pack per concern, with what it requires and conflicts with stated up front;
  - a README per pack that says what it adds to a project;
  - upgrades that leave Kai's own overrides in `custom/` alone;
  - a clear line between official and community packs.
- **Success:** Kai's project validates on the first `init`. Kai moves from prototype to production
  with one `stage set`.
- **Serves purpose:** 1.

### Persona 2 — The WingFoil Maintainer

- **Who:** WingFoil's maintainer, who is also the approver of this repository.
- **Real from:** now.
- **Goal:** replace the templates compiled into the CLI with packs published here. Before each
  WingFoil release, advance the bundled packs to the newest compatible version.
- **Pain today:** templates are TypeScript strings with no version, and each format change in
  WingFoil means rewriting them by hand.
- **Needs from the packs:**
  - a catalog with versions, digests and a computed WingFoil range;
  - `compat.yaml`, kept true at each WingFoil release;
  - a feedback note for every schema change and every published bundled pack;
  - packs that never assume an unreleased WingFoil.
- **Success:** a WingFoil release bundles packs from here, with one commit that touches only the
  vendored packs and their lock.
- **Serves purpose:** 2.

### Persona 3 — The Governed-Repository Maintainer

- **Who:** whoever maintains WingFoil2, WingFoil2-Benchmark or WingFoil-UI: the approver, with the
  agents that work there.
- **Real from:** now, by hand adoption. It becomes the CLI path from v0.4.
- **Goal:** share one foundation (`base`) across the four repositories and keep each project's own
  domain parts.
- **Pain today:** the four configurations differ on things unrelated to what the projects are: state
  names, capture-workflow phases, feedback channels, stub directives.
- **Needs from the packs:**
  - `base` with parameters for each repository's paths and id conventions;
  - adoption steps that can be followed between two releases;
  - a version number to record in each repository.
- **Success:** each of the four repositories declares the `base` version it adopted. A later `base`
  release reaches all four the same way.
- **Serves purpose:** 3.

### Persona 4 — The Pack Author

- **Who:** today the approver, with AI agents as `pack-author`. Later, community authors too
  (Persona 5).
- **Real from:** now.
- **Goal:** write or change a pack and know, before publishing, that it composes, validates and is
  deterministic.
- **Pain today:** there is no format, no schema and no validator. The first attempt wrote content
  before the format was specified.
- **Needs from the packs:**
  - spec-001 and its schemas;
  - the authoring rules (`pack-authoring`, `pack-semver`, `pack-compatibility`);
  - a local command that composes and validates a pack against every compatible WingFoil release;
  - a template for a new pack.
- **Success:** a new pack passes validation the first time it reaches review. Its `pack-release`
  element carries the evidence.
- **Serves purposes:** 1 and 2.

### Persona 5 — Robin, the Community Contributor

- **Who:** a WingFoil user from outside, often with domain knowledge such as a methodology, a stack
  or a region's regulations.
- **Real from:** later, when contributions open (brief §5).
- **Goal:** propose a change to an official pack, or publish and maintain a pack in the community
  catalog. A regulatory `governance` pack for their area is a typical example.
- **Pain today:** no way in, and no credit.
- **Needs from the packs:**
  - WingFoil's contribution model: Memory elements through ingest workflows, with `contributor:`
    and `credit:`;
  - the same format and validator as official packs;
  - a visible place for community packs, distinct from the official ones.
- **Success:** Robin's pack is listed and installable, and Robin is credited on it.
- **Serves purpose:** 1.

### Persona 6 — The Agent Under a Composed Configuration

- **Who:** an AI agent that works in a project whose `.wingfoil/` was composed from packs. It reads
  the directives of its role, follows the workflows and moves Memory elements.
- **Real from:** now, in the four governed repositories. For everyone, from v0.4.
- **Goal:** know what to do in each phase, and what not to do, without asking.
- **Pain today:** stub directives, phases that declare nothing (WingFoil benchmark note N1), and
  rules that contradict each other across overlays.
- **Needs from the packs:**
  - directives that can be acted on and checked;
  - every phase declaring its `actions` and `produces`;
  - no contradictions after composition;
  - a short `AGENTS.md` section.
- **Success:** an agent completes a phase in a freshly composed project with no correction from the
  approver on the process itself.
- **Serves purposes:** 1 and 3, indirectly. It is the reader that pack content is actually written
  for.

---

## 2. Adoption profiles (catalog dimension)

The catalog and the presets are organized by the kind of WingFoil user. The profiles are the user
types of WingFoil's own vision (`docs/01_vision/04_personas.md` in the WingFoil repository),
referred to by **profile** rather than by name.

| Profile | Axes that matter most |
|---|---|
| Solo developer | `methodology` (Kanban), `team-mode` (agent-first), `stage` |
| Code reviewer | `stage` (gates), `governance` |
| Team developer | `methodology`, `phase` |
| Tech lead | `methodology`, `team-mode`, `stage`, `blueprint` |
| Non-technical manager | `phase/inception`, `phase/specification`, `governance` |
| Architect | `blueprint`, `phase/specification`, `governance` |

---

## Decisions from the personas review

Approver, 2026-10-06:

1. **Primary persona per horizon.**
   - Until WingFoil v0.4: Persona 3 (governed repositories) and Persona 2 (WingFoil maintainer).
   - From v0.4: Persona 1 (adopter).
2. **The agent stays a persona.** Pack content is written for an agent reader: it must be
   actionable, checkable, and free of contradictions after composition.
3. **No persona yet for the reader of regulatory packs.** One is added later, together with the
   community catalog. Naming it now, for example "compliance officer", would cause confusion.
4. **Adoption profiles:** WingFoil's six user types are reused, as in §2.
