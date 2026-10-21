---
id: prel-001-base-1.0.0
type: pack-release
title: "base 1.0.0"
status: releasing
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
(spec-001 §12); WingFoil 0.3.1 enters it when its intake adds it to `compat.yaml` with those
formats and `workflow-engine`, and recomputes the range. The README's "Install and update" keeps
spec-002 §2.3's temporary mark, since no release in `compat.yaml` provides `pack-install` (CB-3).

## Validation

- Commit: `90cc766403206840966280fc161ff6e8c185ca8d`
- Command: `npm run validate:publication -- --evidence`
- Mode: publication
- Exit code: 0
- WingFoil releases: 0.3.0
- Compositions: tests/fixtures/examples/base/core-records/example.yaml, tests/fixtures/examples/base/release-folders-lean/example.yaml, tests/fixtures/examples/base/release-folders/example.yaml

Report:

```text
schemas: checked 3 files, 0 problems
lint: checked 23 files, 0 problems
index: checked 4 files, 0 not up to date
composition tests/fixtures/examples/base/core-records/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/base/release-folders-lean/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/base/release-folders/example.yaml: composed twice, 16 files, byte-identical
compositions: 3
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix: publication, 3 runs, 0 failed, tolerance applied: none
```

- Presets: none (`catalog.yaml` `presets: []`); the documented combinations are the README's three
  examples. No conditional part (spec-001 §6.5): no leg with `software`.

Also on `90cc766`:
- from clean clones on Node.js 22.21.0 and 22.12.0: `npm ci`, `npm test` (941 of 941), `lint`,
  `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check` and
  `workflow list`, each exit 0;
- `npm run publish:pack -- --pack base --dry-run`: exit 0, in a temporary clone; the tag at
  `90cc766`, the range `0.3.0`, the digest
  `sha256:ff23044b700fcf85c04250b1e44761248950187f5ac3d6e89bcda62b4b4e70be`; the repository left
  as it was;
- the privacy check of this element and of `packs/base/`: no local path, no private repository,
  nothing on the private projects beyond their number.

`publish:pack` validates again in publication mode at the release commit before it tags.

## Publication

<!-- The tag (<catalog pack id>@<version>, dl-004), the commit, the catalog.yaml digest. -->

## Execution Notes

- 2026-10-21, `prepare`: added by `memory add`; `pack`, `version`, `bump` (ruling F), `wingfoil`
  and `line` filled by editing the draft (W-02); `CHANGELOG.md`, `pack.yaml` and the README's
  "Install and update" checked; `.idea/` listed in `.git/info/exclude` (ruling A); submitted
  (`draft → validating`).
- 2026-10-21, `validate`: the evidence, the clean-clone checks and the dry run at `90cc766`.
  Independent review: approve after amendments. Applied: the presets and the conditional part
  stated; the condition for 0.3.1 to enter the range. Submitted (`validating → releasing`).

