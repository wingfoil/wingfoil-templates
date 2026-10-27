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

**Cascade** (plan-049 ruling 3), in the same commit as `version: 2.0.0`: `software` (`pack.yaml` and
its README's Requires line, regenerated) and the fixture methodology of
`tests/fixtures/software-exit` require `base@^2`; the README examples compose `base@^2`; the charter
`pack-foundation-software` records it. `software` is not published: no release of its own follows.
`methodology/scrum` landed on `base@^2` with plan-050's task-055 (`2d13c49`, ruling 1); not
published.

**Updating from 1.0.0** (the CHANGELOG and the README say it): a project that relied on a default
and keeps its values states them (`plan_id: plan-{n}-{slug}`); a `retrospective_path` naming a
directory gains its trailing `/`; a project that keeps a `plan_id` without `{workflow}` and
`{phase}` fills a started plan's `workflow` and `phase` by hand (the main's name and the instance
number, e.g. `1`) and submits it, or uses the new pattern for its new plans; then it recomposes
`base` and copies the `.wingfoil/` files. Ids already given never change; no file moves. 1.0.0 stays
tagged and listed, frozen (`pack-semver`: one living line before WingFoil 1.0).

`CHANGELOG.md`: the 2.0.0 entry. `pack.yaml`: `version: 2.0.0`; `formats`, `requires: []` and
`requires_capabilities: [workflow-engine]` unchanged, so the computed range is 1.0.0's: `0.3.0`,
the only release of `compat.yaml` that reads every format and provides `workflow-engine`
(confirmed by `publish:pack`'s dry run at `validate`). The README's "Install and update" keeps
spec-002 §2.3's temporary mark: no release in `compat.yaml` provides `pack-install` (CB-3).

At `publish`, `publish:pack` adds 2.0.0 beside 1.0.0 under `base`'s `versions` in `catalog.yaml`
and regenerates `CATALOG.md` and `catalog-index.json`; CB-6's live check then reads `latest:
2.0.0` with both versions listed, and `base`'s README and `pack.yaml` at `refs/tags/base@2.0.0`
(plan-049 step 7). The notices to WingFoil UI's session and to the coordinating session follow
the tag (step 8). The tag's annotation carries the CHANGELOG entry's first line, which is a
complete summary.

## Validation

- Commit: `298723491ca8e54316b8e8e20922ae833c1593d4`
- Command: `npm run validate:publication -- --evidence`
- Mode: publication
- Exit code: 0
- WingFoil releases: 0.3.0
- Compositions: tests/fixtures/examples/base/core-records/example.yaml, tests/fixtures/examples/base/release-folders-lean/example.yaml, tests/fixtures/examples/base/release-folders/example.yaml, tests/fixtures/examples/scrum/defaults/example.yaml, tests/fixtures/examples/scrum/release-folders-lean/example.yaml, tests/fixtures/examples/software/defaults/example.yaml, tests/fixtures/examples/software/release-folders-lean/example.yaml

Report:

```text
schemas: checked 5 files, 0 problems
lint: checked 61 files, 0 problems
index: checked 6 files, 0 not up to date
composition tests/fixtures/examples/base/core-records/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/base/release-folders-lean/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/base/release-folders/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/scrum/defaults/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/scrum/release-folders-lean/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/software/defaults/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/software/release-folders-lean/example.yaml: composed twice, 37 files, byte-identical
compositions: 7
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix: publication, 7 runs, 0 failed, tolerance applied: none
```

- Presets: none (`catalog.yaml` `presets: []`). The documented combinations holding `base` are the
  README examples of `base` (3), and, since plan-050's task-055 (`2987234`), of `software` (2) and
  `methodology/scrum` (2), which compose `base` through `software`'s `requires`; each composed
  twice and byte-identical. No conditional part (spec-001 §6.5).

Also on `2987234`:
- from clean clones on Node.js 22.21.0 and 22.12.0: `npm ci`, `npm test` (1002 of 1002), `lint`,
  `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate` (7 runs, 0 failed),
  the overlay `software-exit` (11 runs, 0 failed: 7 → 11 with task-055's four examples), the golden step (26 runs, 0 failed, tolerance
  0.2.2), `workflow list` and `check:runs` (9 runs, 0 failed: `base`'s three `main` workflows on
  WingFoil 0.3.0, task-053), each exit 0. `main`'s CI run 40502555770 on `2987234`: `success`;
  on `274af0c` (`prepare`), run 40488843601: `success`, and the clean clones there likewise green;
- `npm run publish:pack -- --pack base --dry-run`: exit 0, in a temporary clone; the tag
  `base@2.0.0` at `2987234`, the range `0.3.0`, the digest
  `sha256:bc90f531eccffac9cf91b5c09113a03edd4bbbd78e02e84bdf84e6a6d0427f2f`; the clone left as it
  was. The tag goes on the approval's commit, where `publish:pack` validates again;
- the check against the three private, non-software projects, run outside this repository on
  2026-10-27, `base` at `274af0c`, WingFoil 0.3.0: 3 projects, each on a scratch tree (`packs/base`,
  `catalog.yaml`, `compat.yaml`, the index outputs, the tag `base@1.0.0`; README section 7 reduced
  to the exemption line), `npm run validate -- --tree <scratch> base --param …` with the project's
  path and id values (redacted) and fictional identities: 3 of 3 exit 0, each
  `matrix: self-test, 1 run, 0 failed, tolerance applied: none`, 0 warnings. A first run exited 2
  on the scratch tree alone (not a git repository, so the published version's tag was missing),
  not on the projects. The scratch trees and logs were removed;
- the privacy check of this element and of `packs/base/`: no local path, no private repository,
  nothing on the private projects beyond their number.

## Publication

<!-- The tag (<catalog pack id>@<version>, dl-004), the commit, the catalog.yaml digest. -->

## Execution Notes
- 2026-10-27, `prepare`: added by `memory add`; `pack`, `version`, `bump`, `wingfoil` and `line`
  filled by editing the draft (W-02); the Changes above; `CHANGELOG.md`, `pack.yaml`'s `version`
  and the cascade in one commit; the README's "Install and update" checked against `compat.yaml`
  (CB-3). The session running plan-050 told first.
- 2026-10-27, `validate`: the evidence on `2987234` (`main` after plan-050's task-055, so seven
  compositions), the clean clones on both Node.js versions, the dry run and the private check
  above.
