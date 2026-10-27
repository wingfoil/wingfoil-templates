---
id: prel-002-base-2.0.0
type: pack-release
title: "base 2.0.0"
status: validating
pack: "pack-foundation-base"            # the pack element id (pack-<axis>-<name>)
version: "2.0.0"         # the semver being published
bump: "major"            # major | minor | patch (pack-semver directive)
wingfoil: "0.3.0"        # COMPUTED from compat.yaml (formats + capabilities), e.g. ">=0.4.0 <0.6.0"; never chosen by hand (dl-002)
line: "current"            # the maintained line: current, or <major>.x for an N-1 maintenance line (dl-002)
tags: ["packs","base"]
---

## Changes

The second version of `base`, fixing bug-005 and bug-006 (plan-049), both found on WingFoil 0.3.0:
- **bug-005** (task-054): `plan_id`'s default becomes `{workflow}-{phase}-plan`, WingFoil's and
  UI's convention, in place of `plan-{n}-{slug}` (dl-015 C7, plan-049 ruling 6). WingFoil 0.3.0's
  `workflow start` fills a started plan's `workflow` and `phase`, which `plan` requires, only from
  the tokens its id pattern or path declares: on the old default every start failed (exit 1).
  `plan` keeps requiring `[title, workflow, phase]`.
- **bug-006** (task-054): `retrospective_path`'s default becomes `docs/retrospectives/`, and
  `governance-evolution` › `apply` produces `.wingfoil/` (its `version` 1 → 2): WingFoil reads a
  `produces` path as a directory only with its trailing `/`, so `retrospective` › `explore` and
  `apply` never completed, and `workflow end` refused.
- The README: the parameters, the example prose, and "Updating from 1.0.0" in "Install and
  update"; the examples `release-folders` (`docs/09_retrospectives/`) and every example's
  `base@^2`.
- A check of the fix, in the tooling (task-053): `npm run check:runs` runs `base`'s three `main`
  workflows on WingFoil 0.3.0 on the README's examples, on every branch push: on 1.0.0's content
  7 of 9 runs fail as the two bugs say; on 2.0.0's, none.

**Class: `major`** (plan-049 ruling 2). Not a `patch`: the composed content changes. A project
composed on 1.0.0's defaults and composed again gets other ids for its new plans and another
evidence for `explore`, `pack-semver`'s major clause ("a project composed from the previous
version changes behaviour"); a `minor` could be argued (commitment 2: an adopter states its own
values; `apply` never completed, so nothing relied on it), the doubt the directive settles by the
higher class.

**Cascade** (plan-049 ruling 3), in the same commit as `version: 2.0.0`: `software` (`pack.yaml`
and its README's Requires line, regenerated) and the fixture methodology of
`tests/fixtures/software-exit` require `base@^2`; the README examples compose `base@^2`; the
charter `pack-foundation-software` records it. `software` is not published: no release of its own
follows. `methodology/scrum`, not on `main` yet, moves to `base@^2` when it lands (plan-050
ruling 1).

**Updating from 1.0.0** (the CHANGELOG and the README say it): a project that relied on a default
and keeps its values states them (`plan_id: plan-{n}-{slug}`); a `retrospective_path` naming a
directory gains its trailing `/`; a project that keeps a `plan_id` without `{workflow}` and
`{phase}` fills a started plan's `workflow` and `phase` by hand (the main's name and the instance
number, e.g. `1`) and submits it, or uses the new pattern for its new plans. Ids already given
never change; no file moves. 1.0.0 stays tagged and listed, frozen (`pack-semver`: one living line
before WingFoil 1.0).

`CHANGELOG.md`: the 2.0.0 entry. `pack.yaml`: `version: 2.0.0`; `formats`, `requires: []` and
`requires_capabilities: [workflow-engine]` unchanged, so the computed range is 1.0.0's: `0.3.0`,
the only release of `compat.yaml` that reads every format and provides `workflow-engine`
(confirmed by `publish:pack`'s dry run at `validate`). The README's "Install and update" keeps
spec-002 §2.3's temporary mark: no release in `compat.yaml` provides `pack-install` (CB-3).

## Validation

<!-- The compatibility matrix: every WingFoil version tested, every preset composed, the
     determinism double-run, with the commands and their exit codes. -->

## Publication

<!-- The tag (<catalog pack id>@<version>, dl-004), the commit, the catalog.yaml digest. -->

## Execution Notes
- 2026-10-27, `prepare`: added by `memory add`; `pack`, `version`, `bump`, `wingfoil` and `line`
  filled by editing the draft (W-02); the Changes above; `CHANGELOG.md`, `pack.yaml`'s `version`
  and the cascade in one commit; the README's "Install and update" checked against `compat.yaml`
  (CB-3). The session running plan-050 told first.
