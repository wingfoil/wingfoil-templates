---
id: prel-006-methodology-kanban-1.0.0
type: pack-release
title: "methodology/kanban 1.0.0"
status: draft
pack: "pack-methodology-kanban"            # the pack element id (pack-<axis>-<name>)
version: "1.0.0"         # the semver being published
bump: "major"            # major | minor | patch (pack-semver directive)
wingfoil: ">=0.3.0 <=0.3.1"        # COMPUTED from compat.yaml (formats + capabilities), e.g. ">=0.4.0 <0.6.0"; never chosen by hand (dl-002)
line: "current"            # the maintained line: current, or <major>.x for an N-1 maintenance line (dl-002)
tags: ["packs","kanban","methodology"]
---

## Changes

The first version of `methodology/kanban` (plan-057's `author`, plan-058's `first-release`),
shipping:
- task-067: the pack (`task` tightened with the WIP limits `wip_in_progress` and `wip_in_review`
  and a required `release`; `delivery`, `release-flow` and `work-item`; the directives `kanban` and
  `definition-of-workflow`; the AGENTS.md section `## Kanban`; the parameters, with
  `service_level_expectation`), its README and the examples `defaults` and `team-limits`;
- task-068: the exit criterion, `tests/fixtures/kanban-exit`, its CI step, and the `check:runs`
  scenarios `kanban.yaml` (`sw-life-cycle`'s start on the README examples) and
  `adoption-kanban.yaml` (the adoption once per `init` template, dl-032 E3);
- task-069: the run of `sw-life-cycle` through `delivery` by hand on WingFoil 0.3.1 (dl-032 E4),
  with nothing to fix;
- task-072: the README's generated `Memory types` line of `task`, `—` (`limits` with no sequence).

It depends on two tooling tasks of plan-057, which ship nothing in the pack: task-066 and task-070
(no Node.js warning on its unquoted integer parameters, in the secret rules and in the README
generator and index). It ships no bug fix: its README applies
bug-007's removal list from its first version.

Requires `base@^2` and `software@^1` (the charter; plan-057 ruling 1), both published (`base` 2.0.1 and
`software` 1.0.0, plan-052).
The defaults of its parameters, `wip_in_progress: 2`, `wip_in_review: 1` and
`service_level_expectation: "85% of work items finish within 10 days"`, become fixed with this
version, the convention for new projects (the charter's Commitments to adopters, R1; its open
point 1); the charter's open points 2 … 4 stay as written, stated in the README.

**Class: `major`**: a first version (`pack-semver`, plan-044 ruling F). `pack.yaml` reads
`version: 1.0.0` and `CHANGELOG.md` holds its `1.0.0` entry, both unchanged. The entry's first
line, `- 1.0.0: first version: a flow of work items under two WIP limits, carried by releases.`, is
the tag's annotation (`publish:pack` takes that line only; plan-058 ruling 2).

`pack.yaml`'s `formats`, `requires` and `requires_capabilities: [workflow-engine]` give the range
computed from `compat.yaml`: `>=0.3.0 <=0.3.1`, the releases that read every format and provide
`workflow-engine` (plan-058's rehearsal; confirmed by the dry run at `validate`). The README's
"Install and update" keeps spec-002 §2.3's temporary mark: no release in `compat.yaml` provides
`pack-install` (CB-3).

At `publish`, `publish:pack` adds `methodology/kanban` with its first version in `catalog.yaml` and
regenerates `CATALOG.md` and `catalog-index.json`; CB-6's live check then reads `latest: 1.0.0` and
the pack's README and `pack.yaml` at `refs/tags/methodology/kanban@1.0.0` (plan-058 point 6).

## Validation

Recorded at `validate` (plan-058 step 4).

## Publication

Recorded at `publish` (plan-058 step 6).

## Execution Notes

- 2026-11-02, `prepare` (plan-058 step 3): added by `memory add`; `pack`, `version`, `bump`,
  `wingfoil` and `line` filled by editing the draft (W-02); Changes written; the CHANGELOG entry as
  task-067 wrote it, unchanged (plan-058 ruling 2); the README's "Install
  and update" checked against `compat.yaml` (CB-3: the temporary mark kept, no release provides
  `pack-install`).
- 2026-11-02: independent review: approve; its three nits applied (the two tooling tasks' sites, the
  published versions named, the CHANGELOG entry unchanged). Submitted (`draft → validating`).
