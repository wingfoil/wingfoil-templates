---
id: prel-004-software-1.0.0
type: pack-release
title: "software 1.0.0"
status: draft
pack: "pack-foundation-software"            # the pack element id (pack-<axis>-<name>)
version: "1.0.0"         # the semver being published
bump: "major"            # major | minor | patch (pack-semver directive)
wingfoil: ">=0.3.0 <=0.3.1"        # COMPUTED from compat.yaml (formats + capabilities), e.g. ">=0.4.0 <0.6.0"; never chosen by hand (dl-002)
line: "current"            # the maintained line: current, or <major>.x for an N-1 maintenance line (dl-002)
tags: ["packs","software"]
---

## Changes

The first version of `software` (plan-046's `author`, plan-052's `first-release`), shipping:
- task-047: the five Memory types (`adr`, `tech-spec`, `bug`, `release`, `release-line`), their
  templates, the software roles and DNA, the `determinism` directive, `sw-life-cycle` with its slots
  and their defaults (`inception`, `specification`, `release`, `end-of-life`), `release-submit` and
  `release-publishing`;
- task-048: `adr-ingest`, `bug-ingest` and the AGENTS.md section;
- task-049: the exit criterion, through the fixture methodology (`tests/fixtures/software-exit`);
- task-055 (plan-050): the README examples `defaults` and `release-folders-lean`, composed with
  `methodology/scrum`;
- task-062 (plan-052): the README's adoption steps for bug-007 and who holds `tech-lead` (ruling 5).

Requires `base@^2`. Its `delivery` contract (dl-026, dl-027) is filled by a methodology; it is
published with `methodology/scrum`, the first one (plan-046 ruling 6).

**Class: `major`**: a first version (`pack-semver`, plan-044 ruling F). `CHANGELOG.md` reads
`1.0.0: first version.`, `pack.yaml` `version: 1.0.0`, both unchanged.

`pack.yaml`'s `formats`, `requires` and `requires_capabilities: [workflow-engine]` give the range
computed from `compat.yaml`: `>=0.3.0 <=0.3.1`, the releases that read every format and provide
`workflow-engine` (confirmed by `publish:pack`'s dry run at `validate`). The README's "Install and
update" keeps spec-002 §2.3's temporary mark: no release in `compat.yaml` provides `pack-install`
(CB-3).

Owed at the tag: WingFoil is told of the new step `end-of-life.approve` with the key mapping
(`pack-foundation-software`'s notes, plan-052 step 12).

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
