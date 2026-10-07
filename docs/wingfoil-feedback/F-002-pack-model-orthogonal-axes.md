---
id: F-002
title: "Pack model: orthogonal axes instead of monolithic templates"
kind: request
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T2.

## Observed

With one template per combination (methodology × team × project type × stage) the number of
templates grows combinatorially. WingFoil's dl-009 lists "Scrum, Kanban, Lean Inception,
Trunk-Based" as four methodology templates; `docs/01_vision/X_cli-cmds.md:205` (`METHODOLOGY` enum)
has the same mix.

## Expected

Compose **one pack per axis**:

| Axis | Decides | Initial / candidate values |
|---|---|---|
| `methodology` | delivery cadence, delivery sub-workflow, roles, ceremonies | `scrum`, `kanban`; later `scrumban`, `shape-up`, `xp` |
| `team-mode` (overlay) | who executes and who approves | `human`, `hybrid`, `agent-first` |
| `phase/<slot>` | how each `sw-life-cycle` phase is run; one pack per slot | inception: `lean-inception`, `design-sprint`, `working-backwards`, `event-storming`. specification: `bdd-sbe`, `story-mapping`, `rfc-driven`. release: `trunk-based`, `gitflow`, `release-train` |
| `blueprint` | `paths`/`modules` skeleton, domain directives, extra Memory types, checks | `web-service`, `web-frontend`, `mobile-app`, `cli-library`, `iac`, `data-pipeline`, `embedded-iot` |
| `stage` (overlay) | how strict the process is | `prototype`, `mvp`, `production`, `maintenance`, `sunset` |
| `stack` (later) | per-language quality directives | `typescript-node`, `python`, `go`, `terraform` |
| `governance` | compliance / community obligations | `open-source`, `regulated`, `gdpr` |

**Presets** name curated combinations, for example `startup-mvp` = kanban + agent-first +
web-service + lean-inception + mvp. Each pack ships a `pack.yaml` (id, axis, semver, `formats` +
`requires_capabilities`, `requires`/`conflicts`, the slots it fills, its parameters), fragments
merged into `dna.yaml`, `roles.yaml` and `memory.yaml`, and directives, workflows and Memory
templates. Composition is **deterministic**: the same packs, versions and parameters produce
byte-identical files (the Determinism Index north star).

In this model only Scrum and Kanban are methodologies (dl-009 reclassified): Lean Inception fills
the `inception` slot, Trunk-Based the `release` slot. The P4.18–P4.20 features
(`docs/02_requirements/02_bdd/features/p4-workflow/`) should be re-read against the axes; P4.19
"expansion conflict" is the slot/conflict rule. This repository fixed the model in its dl-001 and
spec-001 (an `operations` slot was later dropped by its dl-008).

Suggested kind in WingFoil: decision-log (the axes and the composition rules), then a tech-spec.
