---
id: prel-006-methodology-kanban-1.0.0
type: pack-release
title: "methodology/kanban 1.0.0"
status: validating
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

- Commit: `9586f1cbee66f879870dde6f0350403a0f933ab9`
- Command: `npm run validate:publication -- --evidence`
- Mode: publication
- Exit code: 0
- WingFoil releases: 0.3.0, 0.3.1
- Compositions: tests/fixtures/examples/base/core-records/example.yaml, tests/fixtures/examples/base/release-folders-lean/example.yaml, tests/fixtures/examples/base/release-folders/example.yaml, tests/fixtures/examples/kanban/defaults/example.yaml, tests/fixtures/examples/kanban/team-limits/example.yaml, tests/fixtures/examples/scrum/defaults/example.yaml, tests/fixtures/examples/scrum/release-folders-lean/example.yaml, tests/fixtures/examples/software/defaults/example.yaml, tests/fixtures/examples/software/release-folders-lean/example.yaml

Report:

```text
schemas: checked 6 files, 0 problems
lint: checked 74 files, 0 problems
index: checked 7 files, 0 not up to date
composition tests/fixtures/examples/base/core-records/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/base/release-folders-lean/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/base/release-folders/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/kanban/defaults/example.yaml: composed twice, 36 files, byte-identical
composition tests/fixtures/examples/kanban/team-limits/example.yaml: composed twice, 36 files, byte-identical
composition tests/fixtures/examples/scrum/defaults/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/scrum/release-folders-lean/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/software/defaults/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/software/release-folders-lean/example.yaml: composed twice, 37 files, byte-identical
compositions: 9
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
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.1 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.1 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.1 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.1 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.1 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.1 directives list: pass (publication)
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
matrix: publication, 18 runs, 0 failed, tolerance applied: none
```

The evidence above ran in the Node.js 22.21.0 clean clone below.

Also, at `validate` (plan-058 step 4, point 4):
- Presets: none (`catalog.yaml` `presets: []`); the documented combinations are the nine README
  examples above, each composed twice, byte-identical; no conditional part (spec-001 §6.5).
- `npm run check:runs` on 0.3.0 and 0.3.1 (dl-032 E3, `pack-compatibility`): 46 runs, 0 failed,
  exit 0. `methodology/kanban`'s twelve: `tests/fixtures/runs/kanban.yaml`, `sw-life-cycle` started
  on `defaults` and `team-limits` (4 runs), and `tests/fixtures/runs/adoption-kanban.yaml`, the
  adoption of `base`, `software` and `kanban` by a project `wingfoil init --template Scrum` and
  `--template Kanban` wrote, on each example (8 runs), each `pass`. `kanban` ships no `main`: the
  scenario is the composition's `main` that reaches its workflows, `software`'s `sw-life-cycle`,
  which includes `delivery`; `check:runs` only starts it and cannot drive into `delivery` (the
  owed row of the scripted full run), so the workflows are covered by the run by hand below.
- The run by hand (dl-032 E4, the charter's Acceptance): task-069's run of `sw-life-cycle` through
  `delivery` on WingFoil 0.3.1, `base`, `software` and `kanban` composed from `main` at `6d260b9`
  (task-069's Execution Notes), cited, not rerun: `git diff --stat 6d260b9 -- packs/` at the
  submitted head shows only `packs/methodology/kanban/README.md` (one line, task-072's generated
  `Memory types` line).
- The overlays (self-test): `software-exit`, `scrum-exit` and `kanban-exit`, 26 runs each, 0 failed,
  tolerance none; the golden step (`npm run validate -- --tree tests/fixtures/compose/tree --param
  project_name=Golden`), 26 runs, 0 failed, the
  0.2.2 tolerance of its own (dl-009).
- `npm run publish:pack -- --pack methodology/kanban --dry-run` in a temporary clone of `9586f1c`
  with its own `npm ci` (Node.js 22.21.0): exit 0; the tag `methodology/kanban@1.0.0` at `9586f1c`, the range
  `>=0.3.0 <=0.3.1`, the digest
  `sha256:44f5a854af4170ac61eb214f4efe47fdd777836f2a97c00ef89177a9f90979fa` (as plan-058's
  rehearsal); the clone left clean, no tag added. A first dry run exited 1 on the working tree not
  clean: the checking script had linked `node_modules` into its clone, an untracked entry
  `publish:pack` refuses; redone as above. The tag goes on the approval's commit, where
  `publish:pack` validates again.
- Checks from clean clones of `main` at `9586f1c` on Node.js 22.21.0, then 22.12.0, one after the
  other: `npm ci`, `npm run build`, `npm test` 1043 of 1043, `lint`, `check:pins`, `check:schemas` (6 files),
  `check:packs` (74 files, 0 problems), `index -- --check` (7 files, 0 not up to date), `validate`
  (9 compositions, 18 runs, 0 failed), the golden step, the three overlays, `workflow list`,
  `check:runs` (46 runs, 0 failed), `npm audit` in the root and in the three matrix folders
  (0 vulnerabilities): every command exit 0 on both.
- `main`'s CI on `9586f1c`, run 41410811662: `success`.
- No private check: `kanban` requires `software` and composes in no non-software project.
- The privacy check of this element and of the pack's files: no local path, no private
  repository, no private project, no intermediary session.

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
- 2026-11-02, `validate` (plan-058 step 4): the evidence, the dry run and the clean-clone checks on
  `9586f1c`, recorded above.
- 2026-11-02: independent review of the Validation: approve; three nits applied (the golden step's
  command, `npm run build`, the Node.js release of the evidence and of the dry run). `validating →
  releasing`.
