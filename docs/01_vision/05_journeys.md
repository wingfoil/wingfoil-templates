# User Journeys — WingFoil-Templates

**Version:** 1.1
**Date:** 2026-10-06
**Status:** Draft
**Traces to:** [04_personas.md](04_personas.md), [03_is-isnot.md](03_is-isnot.md)

---

Each journey lists:
- the steps a persona goes through;
- what each step touches;
- the pain or opportunity at that step.

The opportunities feed the feature brainstorm (`06_features.md`). The commands of the WingFoil CLI
named here are WingFoil's to design (`init --preset`, `pack add`, `upgrade`, `stage set`). A journey
states only what the packs must make possible.

| ID | Journey | Persona | Priority |
|---|---|---|---|
| J1 | Author and publish a pack | Pack author | now: nothing exists without it |
| J2 | Adopt `base` by hand | Governed-repository maintainer | now (primary, until v0.4) |
| J3 | Bundle packs into a WingFoil release | WingFoil maintainer | now (primary, until v0.4) |
| J4 | Record a WingFoil release | WingFoil maintainer | now: keeps compatibility true |
| J5 | Work a phase under a composed configuration | Agent | now, in the governed repositories |
| J6 | Start a project from a preset | Adopter | v0.4 (primary from then) |
| J7 | Add a pack, upgrade | Adopter | v0.4 |
| J8 | Move to the next stage | Adopter | when WingFoil runs transitions |
| J9 | Contribute a change or a community pack | Community contributor | deferred |

---

## J1 — Author and publish a pack (Pack author)

**Trigger:** the sequencer schedules the pack, or a bug or decision changes one.

| # | Step | Touchpoint | Pain / opportunity |
|---|---|---|---|
| 1 | Charters the pack | `pack` element (`proposed`, the approver accepts it) | Scope, axis, slot, requires and conflicts are decided before any content. |
| 2 | Plans the work | `task` elements accepted into the backlog | Small tasks with acceptance criteria the validator can check. |
| 3 | Writes the content | branch `task/<id>`, `packs/<axis>/…`, a template for a new pack | Schemas in the editor; the authoring rules as a checklist; parameters instead of project values. |
| 4 | Validates locally | one command: schema, composition, matrix, determinism | One command covers everything. Each WingFoil release in the matrix runs from a pinned install, never a global one. |
| 5 | Gets a review | a session other than the author's | The reviewer reruns the same command and gets the same result. |
| 6 | Prepares the release | `pack-release` element, `CHANGELOG.md`, bump class | The bump class follows from the change list (`pack-semver`); the WingFoil range is computed. |
| 7 | Publishes | the approver's gate, tag, `catalog.yaml` entry with its digest | Tag, catalog entry and digest come out of one deterministic step; a feedback note is written if WingFoil bundles the pack. |

**Ends well when:** the pack is tagged and listed, its `pack-release` holds the validation evidence,
and nobody had to fix it after publication.

---

## J2 — Adopt `base` by hand (Governed-repository maintainer)

**Trigger:** a `base` version is published, and the repository is between two of its own releases.

| # | Step | Touchpoint | Pain / opportunity |
|---|---|---|---|
| 1 | Reads what changes | `base` README and CHANGELOG | What the repository gains, what it must rename, which parameters it sets. |
| 2 | Sets the parameters | its own paths, id conventions, agent name | WingFoil2 and UI keep their path per type (`design/dls`, …) without forking `base`. |
| 3 | Applies the files | `.wingfoil/` of the repository | Only `built-in/` is touched; the repository's `custom/` overrides stay. |
| 4 | Writes the `AGENTS.md` section | the marked region | Markers in place from the start, so the later export finds them. |
| 5 | Validates | the pinned WingFoil CLI of that repository | Zero errors with the WingFoil version the repository actually runs. |
| 6 | Records the adoption | a decision-log or task in that repository, the adopted version | The version is recorded, so the next `base` release has a known starting point. |

**Ends well when:** the repository validates with `base`, records the version, and its own domain
parts are unchanged.

---

## J3 — Bundle packs into a WingFoil release (WingFoil maintainer)

**Trigger:** WingFoil's release planning reaches its advance-bundled-packs step (notes D3, T3).

| # | Step | Touchpoint | Pain / opportunity |
|---|---|---|---|
| 1 | Finds what to advance | `catalog.yaml`: newest compatible version of each bundled pack | One query instead of reading changelogs; feedback notes list what was published since. |
| 2 | Verifies | digest of each version | What is vendored is exactly what was published. |
| 3 | Vendors | WingFoil's bundled packs and their lock | One commit that touches only the vendored packs and their lock. |
| 4 | Tests | WingFoil's test suite on the new packs | A failure here is a pack defect: it comes back here as a bug, not as a patch in WingFoil. |

**Ends well when:** the release ships the newest compatible packs and no pack file was edited inside
WingFoil.

---

## J4 — Record a WingFoil release (WingFoil maintainer, as tech-lead here)

**Trigger:** WingFoil publishes a release.

| # | Step | Touchpoint | Pain / opportunity |
|---|---|---|---|
| 1 | Records it | `compat.yaml`: the formats the release reads, the capabilities it provides | Read from WingFoil's own declaration (notes T13) rather than inferred from its changelog. |
| 2 | Rechecks the active packs | the compatibility matrix | Which packs the release can read, and which it no longer can. |
| 3 | Plans migrations | tasks for the packs that must move to a new format | Before WingFoil 1.0 the living line moves; after 1.0 the previous line becomes N-1. |

**Ends well when:** `compat.yaml` is true for the new release, and every pack it affects has a task.

---

## J5 — Work a phase under a composed configuration (Agent)

**Trigger:** the approver or a workflow starts a phase in a project composed from packs.

| # | Step | Touchpoint | Pain / opportunity |
|---|---|---|---|
| 1 | Loads its rules | `directives list --role <role>`, `AGENTS.md` | Directives are actionable and checkable; none is a stub. |
| 2 | Reads the phase | `workflow list`: role, actions, produces, approval | Every phase says what it creates and moves (no empty phases, WingFoil benchmark note N1). |
| 3 | Does the work | Memory elements, files | No two composed rules contradict each other; overlays only add or tighten. |
| 4 | Stops at the gate | the approver | The gate is where the workflow says, and the agent never holds approval authority. |

**Ends well when:** the phase completes with no correction from the approver on the process itself.

---

## J6 — Start a project from a preset (Adopter)

**Trigger:** a new project, or an existing one that adopts WingFoil.

| # | Step | Touchpoint | Pain / opportunity |
|---|---|---|---|
| 1 | Picks a preset or one pack per axis | the catalog, browsed through the CLI | Presets named after recognizable situations; adoption profiles (personas §2) as a filter; official and community packs told apart. |
| 2 | Sets the parameters | project name, paths, people | Every parameter has a default, so `init` can run without questions. |
| 3 | Composes | the CLI resolves versions from the catalog | WingFoil resolves the newest version it can read, by formats and capabilities. |
| 4 | Validates and commits | `.wingfoil/`, the lock | Valid on the first `init`; the lock records packs, versions and parameters. |

**Ends well when:** the project validates on the first `init` and the lock records how it was made.

---

## J7 — Add a pack, upgrade (Adopter)

**Trigger:** the project needs a new concern, such as a blueprint or a governance pack, or a newer
pack version is published.

| # | Step | Touchpoint | Pain / opportunity |
|---|---|---|---|
| 1 | Sees what is available | catalog, the project's lock | What changed since the version in the lock, with the bump class. |
| 2 | Previews | a diff of the composed result | A major bump says what breaks; the project's `custom/` overrides are never in the diff. |
| 3 | Applies | `.wingfoil/built-in/`, the lock | Conflicts and missing requirements are refused before anything is written. |

**Ends well when:** the project validates after the change and keeps every override of its own.

---

## J8 — Move to the next stage (Adopter)

**Trigger:** the project moves from prototype to production.

| # | Step | Touchpoint | Pain / opportunity |
|---|---|---|---|
| 1 | Checks readiness | the transition's pre-checks | An approver exists; no open critical bug. |
| 2 | Moves | the stage overlay is swapped, gates are enabled | The stricter process appears in one step, not by hand-editing. |
| 3 | Records | a decision-log written by the transition, one commit | The move is traceable in Memory like every other mutation. |

**Ends well when:** the project runs under the new stage's rules, and the move is recorded.

---

## J9 — Contribute a change or a community pack (Community contributor) — deferred

Opens when contributions open (brief §5), following WingFoil's contribution model. Its journey will be
written then. Two paths are already known:
- a change to an official pack, proposed as a Memory element;
- a community pack, published and maintained by its author.

---

## Decisions from the journeys review

Approver, 2026-10-06:

1. **Priorities as listed.**
   - J1–J5: now.
   - J6–J7: with WingFoil v0.4.
   - J8: when WingFoil runs transitions.
2. **J4 is in the MVP.** The `wingfoil-release-intake` workflow returns to the configuration. It
   comes after the pack-model rulings, as one of the configuration changes they imply.
3. **Adoption register.** Each governed repository records its `base` adoption in its own Memory.
   This repository keeps no list of adopters.
