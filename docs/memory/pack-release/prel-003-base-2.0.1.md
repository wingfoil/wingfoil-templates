---
id: prel-003-base-2.0.1
type: pack-release
title: "base 2.0.1"
status: draft
pack: "pack-foundation-base"            # the pack element id (pack-<axis>-<name>)
version: "2.0.1"         # the semver being published
bump: "patch"            # major | minor | patch (pack-semver directive)
wingfoil: ">=0.3.0 <=0.3.1"        # COMPUTED from compat.yaml (formats + capabilities), e.g. ">=0.4.0 <0.6.0"; never chosen by hand (dl-002)
line: "current"            # the maintained line: current, or <major>.x for an N-1 maintenance line (dl-002)
tags: ["packs","base"]
---

## Changes

The third version of `base`, fixing its README for bug-007 and bug-008 (plan-052, task-061):
- **bug-007** (patch, the pack's own README): "Install and update" step 3 re-includes only the
  `custom/` workflows the project wrote itself, and step 4 removes, each with its `include` entry,
  every workflow `wingfoil init` (0.3.0, 0.3.1) scaffolds under `workflows/custom/`:
  `decision-log-ingest`, which `base` ships, and `sw-life-cycle`, `adr-ingest`, `bug-ingest` and
  `scrum-delivery` or `kanban-delivery`, which need `software` and a methodology. Before, a project
  `init` wrote that followed the steps failed every `workflow` command with
  `E_WORKFLOW_DUPLICATE_NAME` (and, adopting `base` alone on 0.3.1, with `E_PHASE_ROLE_UNKNOWN`).
  "Updating from 2.0.0" says what an adopter does.
- **bug-008** (patch, the pack's own README): "Sources and adaptations" says that `retrospective`'s
  approval is not bound to an iteration: under a methodology that includes it in an iterated sub, a
  closed iteration's `approve` step is listed again while a later one's decision-log is
  `in-discussion`, and one approval clears both. The behaviour is unchanged (plan-052 ruling 2).

**Class: `patch`** (plan-052 ruling 1, `pack-semver`: "the pack's own README"): nothing a composed
project contains changes; under `packs/base/` only `README.md`, `CHANGELOG.md` and `pack.yaml`'s
`version` change. The charter's `retrospective` row is corrected by an Execution Note, outside the
pack. A check of the fix, in the tooling (task-060): `check:runs`' adoption run, on every branch
push.

**Updating from 2.0.0** (the CHANGELOG and the README say it): nothing to recompose; a project that
kept and re-included the workflows `init` scaffolded removes them with their `include` entries.
2.0.0 and 1.0.0 stay tagged and listed, frozen (`pack-semver`: one living line before WingFoil 1.0).

`CHANGELOG.md`: the 2.0.1 entry, whose first line, the tag's annotation, is a complete summary.
`pack.yaml`: `version: 2.0.1`.

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
