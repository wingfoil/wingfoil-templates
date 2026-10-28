---
id: prel-005-methodology-scrum-1.0.0
type: pack-release
title: "methodology/scrum 1.0.0"
status: released
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
  identical on 0.3.1 (plan-051), and the fixes of its two findings (`sprint.yaml`'s
  descriptions, the `scrum` directive, the README; `b6dc551`);
- task-062 (plan-052): the README's adoption step for bug-007 and bug-008's effect per Sprint.

Requires `base@^2` (`2d13c49`, plan-050 ruling 1) and `software@^1`, so it is published after
`software` (plan-052 step 10). The Sprint machine's names (`planned`, `active`, `done`) are fixed
with this version (charter open point 3).

**Class: `major`**: a first version (`pack-semver`, plan-044 ruling F). `CHANGELOG.md` reads
`1.0.0: first version.`, `pack.yaml` `version: 1.0.0`, both unchanged.

`pack.yaml`'s `formats`, `requires` and `requires_capabilities: [workflow-engine]` give the range
computed from `compat.yaml`: `>=0.3.0 <=0.3.1`, the releases that read every format and provide
`workflow-engine` (confirmed by `publish:pack`'s dry run at `validate`). The README's "Install and
update" keeps spec-002 §2.3's temporary mark: no release in `compat.yaml` provides `pack-install`
(CB-3).

At `publish`, `publish:pack` adds `methodology/scrum` with its first version in `catalog.yaml` and
regenerates `CATALOG.md` and `catalog-index.json`; CB-6's live check then reads `latest: 1.0.0` and
the pack's README and `pack.yaml` at `refs/tags/methodology/scrum@1.0.0` (plan-052 step 10). The
notices to WingFoil UI's session and to the coordinating session follow the tags (step 12).

## Validation

- Commit: `f6e42fc97b5b4fb23a37e00ae5abcea356de7276`
- Command: `npm run validate:publication -- --evidence`
- Mode: publication
- Exit code: 0
- WingFoil releases: 0.3.0, 0.3.1
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
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.1 workflow list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.1 dna show: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.1 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.1 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.1 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.1 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.1 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.1 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.1 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.1 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.1 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.1 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.1 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.1 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.1 directives list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.1 workflow list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.1 dna show: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.1 directives list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.1 workflow list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.1 dna show: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.1 directives list: pass (publication)
matrix: publication, 14 runs, 0 failed, tolerance applied: none
```

Also, at `validate` (plan-052 step 8):
- Presets: none (`catalog.yaml` `presets: []`); the documented combinations are the seven README
  examples above, each composed twice, byte-identical; no conditional part (spec-001 §6.5).
- `npm run publish:pack -- --pack methodology/scrum --dry-run`, one of three separate dry runs, each
  in its own temporary clone of `f6e42fc` against the current catalog (the chained order, `base`,
  `software`, `methodology/scrum`, was rehearsed at plan-052 step 3): exit 0; the tag
  `methodology/scrum@1.0.0` at `f6e42fc`, the range `>=0.3.0 <=0.3.1`, the digest
  `sha256:532f103ba59ce39afb2db8b7d6a98d57ee92581d012d78eacd18f8341838534f`; the clone left clean,
  no tag added. The tag goes on the approval's commit, where `publish:pack` validates again.
- The clean-clone checks on Node.js 22.21.0 and 22.12.0, the overlays `software-exit` and
  `scrum-exit`, `check:runs` with task-060's adoption run, and `main`'s CI: recorded in the
  Execution Notes once run on the submitted head.
- The privacy check of this element and of the pack's files: no local path, no private repository,
  nothing on the private projects beyond their number.

## Publication

- Date: 2026-10-28. Line: current.
- Tag: `methodology/scrum@1.0.0` (annotated), at `63732824a6893fbc666eb2e7484b5004c7f6d384`
  (`software@1.0.0`'s catalog commit, as above). Annotation: the tag's name, then the CHANGELOG entry `- 1.0.0: first version.`
- Catalog commit: `bd388bfb094e4011ff31bea4cda94e442f721fc8` (the new `methodology/scrum` entry,
  `CATALOG.md`, `catalog-index.json`), by `npm run publish:pack -- --pack methodology/scrum`, exit
  0.
- Digest: `sha256:532f103ba59ce39afb2db8b7d6a98d57ee92581d012d78eacd18f8341838534f` (as the dry
  run).
- WingFoil range: `>=0.3.0 <=0.3.1`.
- Pushed together: `git push --atomic origin base@2.0.1 software@1.0.0 methodology/scrum@1.0.0 main`
  (`main` at `bd388bf`).
- CI on the tag, run 40697577767 (publication mode): `success`. CI on `main` at `bd388bf`, run
  40697576737: `success`. Pages, run 40697576861: `success`.
- CB-6, live (spec-002 §6), anonymous, following `llms.txt`'s steps:
  - `https://wingfoil.github.io/wingfoil-templates/llms.txt`: 200;
  - `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/main/catalog-index.json`: 200;
    filtered locally to `id: methodology/scrum`, `status: active`, `latest: 1.0.0`, versions
    `1.0.0`, its `wingfoil` `>=0.3.0 <=0.3.1`;
  - the version's `readme_url`,
    `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/refs/tags/methodology/scrum@1.0.0/packs/methodology/scrum/README.md`:
    200, the title `# Scrum`;
  - the version's `manifest_url`,
    `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/refs/tags/methodology/scrum@1.0.0/packs/methodology/scrum/pack.yaml`:
    200, `id: methodology/scrum`, `version: 1.0.0`;
  - `https://wingfoil.github.io/wingfoil-templates/catalog-index.json`: 200, `latest: 1.0.0`.

## Execution Notes

- 2026-10-28, `prepare` (plan-052 step 7): added by `memory add`; `pack`, `version`, `bump`,
  `wingfoil` and `line` filled by editing the draft (W-02); Changes written; the README's "Install
  and update" checked against `compat.yaml` (CB-3: the temporary mark kept, no release provides
  `pack-install`).
- 2026-10-28, `validate` (plan-052 step 8): the evidence on `7ab9cd0`, three dry runs, `base`'s
  private check. Independent review of the three elements: `base` request changes (two blocking
  findings: the CHANGELOG's first line, the tag's annotation, named only bug-007; the clean clones
  not recorded), `software` and `methodology/scrum` approve after amendments (the same record).
  Applied (`f6e42fc`): the first line names both fixes; the evidence and the three dry runs redone
  on `f6e42fc` (`base`'s digest changes with its CHANGELOG, the other two do not); the presets
  line; "three separate dry runs"; the publication paragraph; the sources of `base@^2`; task-057's
  fixes named. The clean-clone checks run on the submitted head; re-review requested.
- 2026-10-28, checks from clean clones of `main` at `ba1e46a` (this element's content as reviewed)
  on Node.js 22.21.0 and 22.12.0: `npm ci` (0 vulnerabilities), `npm test` 1027 of 1027, `lint`,
  `check:pins`, `check:schemas`, `check:packs` (61 files, 0 problems), `index -- --check` (6 files,
  0 not up to date), `validate` (14 runs, 0 failed), the golden step (26 runs, 0 failed), the
  overlays `software-exit` and `scrum-exit` (22 runs each, 0 failed), `workflow list`,
  `check:runs` with task-060's adoption run (34 runs, 0 failed), `npm audit` in the root and in
  the three matrix folders (0 vulnerabilities): every command exit 0 on both. `main`'s CI on
  `ba1e46a`: run 40673992563, `success`. The re-review's condition met: `validating → releasing`.
- 2026-10-28, `approve-publication`: approved by the approver (`releasing → released`), which
  authorized the publication (plan-044 ruling C).
- 2026-10-28, `publish`: published as above; the three tags and `main` pushed atomically, the CI and
  Pages read, CB-6's live check passed (the first live fetch of a tag holding a slash).
