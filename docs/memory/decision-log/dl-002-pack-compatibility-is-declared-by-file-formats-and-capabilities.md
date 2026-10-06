---
id: dl-002-pack-compatibility-is-declared-by-file-formats-and-capabilities
type: decision-log
title: "Pack compatibility is declared by file formats and capabilities"
status: approved
tags: ["compatibility","packs"]
---

## Context

WingFoil's file surface keeps changing. v0.3 brings the workflow engine, so the workflow format
changes, and more changes will follow up to and after 1.0.

The configuration confirmed on 2026-10-05 (the `pack-compatibility` and `pack-semver` directives)
gives every pack a hand-written `wingfoil` version range. Such a range is coarse:
- every WingFoil minor puts every pack in doubt, even when the files a pack ships did not change;
- it says nothing about how several compatible lines of one pack are maintained.

WingFoil has since adopted a format key distinct from `version:`:
- WingFoil **dl-149** is `ready`;
- **task-251** (v0.3) is `done`.

Both were checked in the WingFoil2 repository at `7f13f77f` on 2026-10-06. This proposal was raised
from here as feedback note T12.

## Options

1. **A WingFoil version range per pack version**, as npm `engines` does, with one maintenance branch
   per range.
2. **File formats and capabilities**, as Kubernetes `apiVersion` and the Compose file format do:
   - a pack declares the format version of each file kind it ships, and the WingFoil capabilities it
     needs;
   - a table maps each WingFoil release to what it reads and provides.
3. **One neutral source format, compiled per target format.** It needs a compiler to maintain, and
   pays off only with many long-lived parallel formats.
4. **Migrations owned by WingFoil.** `wingfoil migrate` takes files from format N to N+1. It
   complements option 1 or 2.

## Decision

Ruled by the approver, Roberto Pompermaier, on 2026-10-05: **options 2 + 4, with a line policy**.
The approver then confirmed "procedi con le modifiche".

- **No hand-written range.** `pack.yaml`, and every transition, declares `formats` (file kind →
  format version, per WingFoil dl-149) and `requires_capabilities`.
- **`compat.yaml` is the compatibility table.** It maps every WingFoil release to the formats it
  reads and the capabilities it provides.
  - The `wingfoil-release-intake` workflow updates it at each WingFoil release (journeys J4; brought
    back by the journeys review of 2026-10-06).
  - The WingFoil range in `catalog.yaml` is **computed** from it at publication. It is informational
    only: the resolver decides on formats and capabilities.
- **Bump classes.**
  - **Major:** moving content to a new format, or adding a required capability.
  - **Minor:** removing a required capability.
- **Line policy before WingFoil 1.0:** one living line per pack, written in the newest formats.
  Older versions stay tagged and resolvable, but are frozen.
- **Line policy from WingFoil 1.0:** lines N and N-1 are maintained for a declared window, of at
  least one WingFoil minor. N-1 gets fixes only. Its branch name is ruled in dl-004.
- **Publication needs a released WingFoil.** A pack is published only when `compat.yaml` lists a
  **released** WingFoil that reads its formats and provides its capabilities. It is never published
  against an unreleased build (`pack-compatibility`).
- **Validation matrix.** Each publication is validated with the oldest and the newest compatible
  release from `compat.yaml`.

Dependencies on WingFoil:
- **T12** became WingFoil dl-149 and task-251;
- **T13**, `wingfoil migrate` and `wingfoil capabilities`, is still a proposal.

Until WingFoil publishes its capability vocabulary, the names in `compat.yaml` are this repository's
proposal, and WingFoil owns the final names.

Configuration changes this decision implies. Each is applied after approval and bumps `version:`:
- `pack-compatibility`: formats and capabilities, the computed range, the oldest and newest
  compatible release;
- `pack-semver`: the bump classes above and the line policy;
- `pack-authoring`: `pack.yaml` declares `formats` and `requires_capabilities`;
- the `pack-release` template: the `wingfoil` field is documented as computed, and a new `line`
  field is added;
- `pack-release-cycle`: the prepare, validate and publish phases follow `compat.yaml`;
- `dna.yaml`: a `compat` module (`compat.yaml`), `compat.yaml` in `paths.sources`, the tech-lead
  description and the north star;
- `wingfoil-release-intake`: a new main workflow, included in `workflows.yaml`.

## Execution Notes

- The first attempt applied these changes on `archive/draft-2026-10-05`, commits `35e6788` and
  `de4e2d6`. They are a source to re-read. They are not cherry-picked, and none of them bumped
  `version:`.
