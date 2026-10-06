# Sequencer — WingFoil-Templates

**Version:** 1.0
**Date:** 2026-10-06
**Status:** Draft
**Traces to:** [06_features.md](06_features.md), [05_journeys.md](05_journeys.md), [04_personas.md](04_personas.md)

---

## Rules

The sequencer follows the Lean Inception rules:

- a **wave** holds at most **3 features**;
- a wave holds at most **one high-uncertainty** feature;
- each wave builds on the previous ones, and ends in something that can be run or checked.

This repository has no repository-wide releases, because every pack is versioned on its own.
Waves are therefore grouped into **milestones**. A milestone ends in something a persona can use.
Wave ids (`W1`…) belong to this repository and are unrelated to WingFoil's own waves.

---

## Milestones at a glance

| Milestone | Goal | Waits for | Serves | Features |
|---|---|---|---|---|
| **M0 — Contract** | spec-001 and its schemas approved: the format, the catalog, compatibility. `wingfoil-release-intake` back in the configuration. | the pack-model rulings | Pack author, WingFoil maintainer | 12 |
| **M1 — Tooling** | one command composes and validates any pack against every compatible WingFoil release; the release process records its evidence. | M0 | Pack author, Agent | 9 |
| **M2 — Foundation** | `base` and `governance/wingfoil-dogfood` published. Templates adopts them first; Benchmark and UI follow between their own releases. | the WingFoil v0.3 formats, M1 | Governed-repository maintainer (primary), WingFoil maintainer (primary) | 5 |
| **M3 — First catalog (MVP)** | the first official catalog, published and validated, ready when WingFoil v0.4 installs packs. | M2, WingFoil v0.4 for J6–J7 | Adopter (primary from v0.4) | 6 |
| **M4 — Community** | community catalog, contributions, download traffic. | M3, WingFoil dl-138 Q4 | Community contributor | 3 |

Every feature of `06_features.md` is assigned to exactly one wave. F2.7 was dropped in the features
review and is not sequenced.

---

## M0 — Contract (specification phase)

| Wave | Features | High unc. | Ends with |
|---|---|---|---|
| W1 — Manifest | F1.1 `pack.yaml` · F1.3 parameters · F1.7 JSON Schemas | — | a pack manifest that validates against its schema |
| W2 — Composition rules | F1.2 fragments and merge · F1.4 slots · F1.5 `format:` key | F1.2 | the merge order and the add-or-tighten rule written in spec-001, with examples |
| W3 — Catalog | F2.1 `catalog.yaml` · F2.2 tags · F2.3 digest | — | a catalog entry whose digest can be recomputed from the tag |
| W4 — Compatibility | F2.4 `compat.yaml` · F2.5 computed range · F5.2 `wingfoil-release-intake` | F2.4 | `compat.yaml` lists WingFoil 0.2.2 and the range of a pack can be computed |

## M1 — Tooling

Tooling work that waits for nothing in WingFoil.

| Wave | Features | High unc. | Ends with |
|---|---|---|---|
| W5 — Composer | F3.2 reference composer · F3.4 determinism check · F3.1 one validation command | F3.2 | a fixture pack composes twice into byte-identical files, through one command |
| W6 — Matrix and lint | F3.3 compatibility matrix · F3.5 lint rules · F3.6 CI | — | a fixture validates against pinned WingFoil releases, in CI |
| W7 — Release process | F5.1 evidence in `pack-release` · F5.4 feedback notes on publication · F5.3 line policy | — | a dry-run publication of a fixture pack produces tag, catalog entry, digest and note |

## M2 — Foundation

Starts when the approver confirms that the v0.3 formats are final.

| Wave | Features | High unc. | Ends with |
|---|---|---|---|
| W8 — `base` | F4.1 `base` · F6.2 parameters for the governed repositories · F1.6 AGENTS.md section | F1.6 | `base` validates with the parameters of each of the four repositories |
| W9 — Dogfood and adoption | F4.2 `governance/wingfoil-dogfood` · F6.1 hand-adoption steps | — | **`base` published; this repository adopts it first** |

## M3 — First catalog (MVP)

| Wave | Features | High unc. | Ends with |
|---|---|---|---|
| W10 — Methodologies | F4.3 `scrum`, `kanban` · F2.6 presets | — | the bundled methodologies published, with a first preset each |
| W11 — Phases and blueprints | F4.5 `lean-inception`, `bdd-sbe` · F4.6 `web-service`, `cli-library` | — | every slot and blueprint of the first scope published |
| W12 — Stages and agent mode | F4.7 `prototype`, `production`, transition · F4.4 `agent-first` | F4.4 | **first catalog complete** |

## M4 — Community (later)

| Wave | Features | High unc. | Ends with |
|---|---|---|---|
| W13 — Community | F7.1 community catalog · F7.2 contribution model · F7.3 traffic metrics | F7.1 | a first community pack listed, with its contributor credited |

---

## Notes

- **The first publication is `base`.** Every pack requires `base` (pack-model), so nothing is
  published before W9.
- **`base` also needs a released WingFoil.** The `pack-compatibility` directive forbids publishing
  against an unreleased build. `base`, written in the v0.3 formats, can therefore be published only
  after WingFoil v0.3 is **released**, not merely when its formats are final. Authoring (W8) can
  start when the formats are final.
- **Tooling tasks have no workflow host.** `sw-life-cycle` runs `kanban-delivery` only inside
  `pack-cycle`, which iterates over packs. The tooling of M1 belongs to no pack. See open question 2.

## Open questions for the sequencer review

1. **Order.** M0 → M1 → M2 → M3. The tooling (M1) comes before `base`, so that `base` is the first
   pack validated by the real command rather than by hand. Confirm?
2. **Where tooling tasks run.** The options:
   - **(a)** a `tooling` phase in `sw-life-cycle`, between specification and pack-delivery, that
     includes `kanban-delivery` for tasks with no pack;
   - **(b)** treat the tooling as a pseudo-pack charter.

   I recommend (a). It is a configuration change: one more pack-model ruling, then the change with a
   `version:` bump.
3. **`base` publication gate.** Confirm that `base` is published only after WingFoil v0.3 is
   released, as the `pack-compatibility` directive requires?

## Decisions from the sequencer review
