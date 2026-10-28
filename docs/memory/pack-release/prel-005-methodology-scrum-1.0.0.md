---
id: prel-005-methodology-scrum-1.0.0
type: pack-release
title: "methodology/scrum 1.0.0"
status: validating
pack: "pack-methodology-scrum"            # the pack element id (pack-<axis>-<name>)
version: "1.0.0"         # the semver being published
bump: "major"            # major | minor | patch (pack-semver directive)
wingfoil: ">=0.3.0 <=0.3.1"        # COMPUTED from compat.yaml (formats + capabilities), e.g. ">=0.4.0 <0.6.0"; never chosen by hand (dl-002)
line: "current"            # the maintained line: current, or <major>.x for an N-1 maintenance line (dl-002)
tags: ["packs","scrum","methodology"]
---

## Changes

The first version of `methodology/scrum` (plan-050's `author`, plan-052's `first-release`),
shipping:
- task-055: the pack (the `sprint` type, `delivery`, `sprint` and `backlog-item`, the `scrum` and
  `definition-of-done` directives, `sprint_length`), its README and the examples `defaults` and
  `release-folders-lean`;
- task-056: the exit criterion, `tests/fixtures/scrum-exit`;
- task-057: the run of `sw-life-cycle` through two Sprints and two releases on WingFoil 0.3.0, rerun
  identical on 0.3.1 (plan-051), and its two text findings;
- task-062 (plan-052): the README's adoption step for bug-007 and bug-008's effect per Sprint.

Requires `base@^2` and `software@^1`, so it is published after `software` (plan-052 step 10). The
Sprint machine's names (`planned`, `active`, `done`) are fixed with this version (charter open
point 3).

**Class: `major`**: a first version (`pack-semver`, plan-044 ruling F). `CHANGELOG.md` reads
`1.0.0: first version.`, `pack.yaml` `version: 1.0.0`, both unchanged.

`pack.yaml`'s `formats`, `requires` and `requires_capabilities: [workflow-engine]` give the range
computed from `compat.yaml`: `>=0.3.0 <=0.3.1`, the releases that read every format and provide
`workflow-engine` (confirmed by `publish:pack`'s dry run at `validate`). The README's "Install and
update" keeps spec-002 §2.3's temporary mark: no release in `compat.yaml` provides `pack-install`
(CB-3).

## Validation

<!-- The compatibility matrix: every WingFoil version tested, every preset composed, the
     determinism double-run, with the commands and their exit codes. -->

## Publication

<!-- The tag (<catalog pack id>@<version>, dl-004), the commit, the catalog.yaml digest. -->

## Execution Notes

- 2026-10-28, `prepare` (plan-052 step 7): added by `memory add`; `pack`, `version`, `bump`,
  `wingfoil` and `line` filled by editing the draft (W-02); Changes written; the README's "Install
  and update" checked against `compat.yaml` (CB-3: the temporary mark kept, no release provides
  `pack-install`).
