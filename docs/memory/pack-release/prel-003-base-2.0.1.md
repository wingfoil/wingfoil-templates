---
id: prel-003-base-2.0.1
type: pack-release
title: "base 2.0.1"
status: released
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
  scaffolded by `init` that followed the steps failed every `workflow` command with
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

`CHANGELOG.md`: the 2.0.1 entry, whose first line, the tag's annotation, names both changes.
`pack.yaml`: `version: 2.0.1`.

`pack.yaml`'s `formats`, `requires` and `requires_capabilities: [workflow-engine]` give the range
computed from `compat.yaml`: `>=0.3.0 <=0.3.1`, the releases that read every format and provide
`workflow-engine` (confirmed by `publish:pack`'s dry run at `validate`). The README's "Install and
update" keeps spec-002 §2.3's temporary mark: no release in `compat.yaml` provides `pack-install`
(CB-3).

At `publish`, `publish:pack` adds 2.0.1 beside 1.0.0 and 2.0.0 under `base`'s `versions` in
`catalog.yaml` and regenerates `CATALOG.md` and `catalog-index.json`; CB-6's live check then reads
`latest: 2.0.1` with the three versions listed, and the pack's README and `pack.yaml` at
`refs/tags/base@2.0.1` (plan-052 step 10). The notices to WingFoil UI's session and to the
coordinating session follow the tags (step 12).

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
- `npm run publish:pack -- --pack base --dry-run`, one of three separate dry runs, each in its own
  temporary clone of `f6e42fc` against the current catalog (the chained order, `base`, `software`,
  `methodology/scrum`, was rehearsed at plan-052 step 3): exit 0; the tag `base@2.0.1` at `f6e42fc`,
  the range `>=0.3.0 <=0.3.1`, the digest
  `sha256:8e3e91d4be754f686daa346311d53dd0e4dccb7bd916b8f868c852105ff3961c`; the clone left clean,
  no tag added. The tag goes on the approval's commit, where `publish:pack` validates again.
- The check against the three private, non-software projects, run outside this repository on
  2026-10-28, `base` at `7ab9cd0` (at `f6e42fc` `packs/base` differs only in its CHANGELOG's 2.0.1
  entry, which the check does not compose), WingFoil 0.3.0 and 0.3.1: 3 projects, each on a scratch
  tree (a clone holding `packs/base` alone, its README's section 7 reduced to the exemption line),
  `npm run validate -- --tree <scratch> base --param …` with the projects' path and id values
  (redacted) and fictional identities: 3 of 3 exit 0, each `matrix: self-test, 2 runs, 0 failed,
  tolerance applied: none`, lint 0 problems, 0 warnings. A first run on this repository's own tree
  exited 1 only because `--param` overrides the README examples' values (every matrix run passed).
  The scratch tree and logs were removed.
- The composition of `base` from the tag `base@2.0.0` and from `f6e42fc`, with the same parameters:
  16 files each, byte-identical (the independent review), as a patch requires.
- The clean-clone checks on Node.js 22.21.0 and 22.12.0, the overlays `software-exit` and
  `scrum-exit`, `check:runs` with task-060's adoption run, and `main`'s CI: recorded in the
  Execution Notes once run on the submitted head.
- The privacy check of this element and of the pack's files: no local path, no private repository,
  nothing on the private projects beyond their number.

## Publication

- Date: 2026-10-28. Line: current.
- Tag: `base@2.0.1` (annotated), at `abc36c063de3d040cbe771f0fbd88035e45cecc4` (the last approval's
  commit; its `main` CI run 40694233245 `success` before the tag). Annotation: the tag's
  name, then the CHANGELOG entry's first line.
- Catalog commit: `8d4adb3038c48922713e9b6b777687c10234abae` (`base`'s entry with 2.0.1 beside 1.0.0
  and 2.0.0, `CATALOG.md`, `catalog-index.json`), by `npm run publish:pack -- --pack base`, exit 0.
- Digest: `sha256:8e3e91d4be754f686daa346311d53dd0e4dccb7bd916b8f868c852105ff3961c` (as the dry
  run).
- WingFoil range: `>=0.3.0 <=0.3.1`.
- Pushed together: `git push --atomic origin base@2.0.1 software@1.0.0 methodology/scrum@1.0.0 main`
  (`main` at `bd388bf`).
- CI on the tag, run 40697576894 (publication mode): `success`. CI on `main` at `bd388bf`, run
  40697576737: `success`. Pages, run 40697576861: `success`.
- CB-6, live (spec-002 §6), anonymous, following `llms.txt`'s steps:
  - `https://wingfoil.github.io/wingfoil-templates/llms.txt`: 200;
  - `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/main/catalog-index.json`: 200;
    filtered locally to `id: base`, `status: active`, `latest: 2.0.1`, versions `1.0.0`, `2.0.0` and
    `2.0.1`, 2.0.1's `wingfoil` `>=0.3.0 <=0.3.1`;
  - the version's `readme_url`,
    `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/refs/tags/base@2.0.1/packs/base/README.md`:
    200, the title `# Base`;
  - the version's `manifest_url`,
    `https://raw.githubusercontent.com/wingfoil/wingfoil-templates/refs/tags/base@2.0.1/packs/base/pack.yaml`:
    200, `id: base`, `version: 2.0.1`;
  - `https://wingfoil.github.io/wingfoil-templates/catalog-index.json`: 200, `latest: 2.0.1`.

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
  Pages read, CB-6's live check passed.
