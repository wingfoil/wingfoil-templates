---
id: prel-001-base-1.0.0
type: pack-release
title: "base 1.0.0"
status: draft
pack: "pack-foundation-base"            # the pack element id (pack-<axis>-<name>)
version: "1.0.0"         # the semver being published
bump: "major"            # major | minor | patch (pack-semver directive)
wingfoil: "0.3.0"        # COMPUTED from compat.yaml (formats + capabilities), e.g. ">=0.4.0 <0.6.0"; never chosen by hand (dl-002)
line: "current"            # the maintained line: current, or <major>.x for an N-1 maintenance line (dl-002)
tags: ["packs","base"]
---

## Changes

The first version of `base` (`major`: the first public version; `pack-semver` has no rule for a
first version, and the highest class is taken, plan-044 ruling F). It ships what the charter
`pack-foundation-base` lists, as plan-043 wrote it:
- task-037: the smallest valid `base`: `pack.yaml`, the DNA, roles and Memory fragments (the
  `decision-log`, `task` and `plan` types with their templates), the four directives
  (`traceability`, `doc-versioning`, `security-secrets`, `claim-sources`) and
  `governance-evolution`;
- task-038: `decision-log-ingest`, `retrospective`, `retrospective-periodic` and the AGENTS.md
  section;
- task-039: the README's three examples, one per governed parameter set, composed and validated on
  every push.

`CHANGELOG.md`: `1.0.0: first version.` `pack.yaml`: `version: 1.0.0`, `requires: []`,
`requires_capabilities: [workflow-engine]`. The `wingfoil` range is computed from `compat.yaml`:
0.3.0 is the only release that reads every format `base` ships and provides `workflow-engine`
(spec-001 §12); WingFoil 0.3.1 enters it when its intake adds it to `compat.yaml`. The README's
"Install and update" keeps spec-002 §2.3's temporary mark, since no release in `compat.yaml`
provides `pack-install` (CB-3).

## Validation

<!-- The compatibility matrix: every WingFoil version tested, every preset composed, the
     determinism double-run, with the commands and their exit codes. -->

## Publication

<!-- The tag (<catalog pack id>@<version>, dl-004), the commit, the catalog.yaml digest. -->

## Execution Notes
