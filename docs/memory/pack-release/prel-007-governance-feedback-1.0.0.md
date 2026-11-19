---
id: prel-007-governance-feedback-1.0.0
type: pack-release
title: "governance/feedback 1.0.0"
status: releasing
pack: "pack-governance-feedback"            # the pack element id (pack-<axis>-<name>)
version: "1.0.0"         # the semver being published
bump: "major"            # major | minor | patch (pack-semver directive)
wingfoil: ">=0.3.0 <=0.3.2"        # COMPUTED from compat.yaml (formats + capabilities), e.g. ">=0.4.0 <0.6.0"; never chosen by hand (dl-002)
line: "current"            # the maintained line: current, or <major>.x for an N-1 maintenance line (dl-002)
tags: ["packs","feedback","governance"]
---

## Changes

The first version of `governance/feedback` (plan-073's `charter`, plan-074's `design` with
spec-003, plan-075's tooling, plan-076's `author`, plan-077's `first-release`), shipping:
- task-096: the pack: the `feedback` Memory type and its template, the roles fragment, the
  directive `feedback`, the workflows `feedback-ingest`, `feedback-review` and `feedback-item`,
  the AGENTS.md section, the parameters (`feedback_path`, `feedback_id` and the value lists
  `feedback_kinds`, `feedback_targets` and `feedback_outcomes`), and the conditional entry
  `with: software@^1` (the workflows `feedback-bug-route` and `feedback-bug-item`, the directive
  `feedback-bug-route`); its README and the examples `defaults`, `with-software` and
  `added-outcome`;
- task-097: the exit criterion, `tests/fixtures/feedback-exit` and its CI step, the `check:runs`
  scenarios `feedback.yaml`, `feedback-upstream.yaml` and `adoption-feedback.yaml` (the adoption
  once per `init` template, dl-032 E3), and the fixture upstream pack;
- task-098: the fixture projects of `governance/feedback` and the bindings of the fixture-element
  checks (FA-3 … FA-6);
- task-099: the run by hand on WingFoil 0.3.2, with and without `software` (dl-032 E4),
  composed from `52d125c2`, with nothing to fix in the pack.

It depends on four tooling tasks, which ship nothing in the pack: plan-075's task-093 (spec-003's
composer and lint checks) and task-094 (the fixture-element checks), plan-076's task-095
(`check:runs` driving a route) and plan-077's task-100 (`feedback-exit` in the intake's `verify`
job). It ships no bug fix.

Requires `base@^2`, published as 2.0.1, and `requires_capabilities: [workflow-engine]`; its
conditional entry names `software@^1`, published as 1.0.0. It is the first version published from
a `pack.yaml` at format 2 (spec-003 §9), and the first published pack that carries a conditional
part (`pack-compatibility`). The defaults of its five parameters become fixed with this version,
the convention for new projects (the charter's Commitments to adopters).

**Class: `major`**: a first version (`pack-semver`; plan-077 ruling 1). `pack.yaml` reads
`version: 1.0.0` and `CHANGELOG.md` holds its `1.0.0` entry, both unchanged. The entry's first
line, `- 1.0.0: first version: feedback captured, triaged by the approver and routed into the
governance.`, is the tag's annotation (`publish:pack` takes that line only; plan-077 ruling 3).

`pack.yaml`'s `formats`, `requires` and `requires_capabilities` give the range computed from
`compat.yaml`: `>=0.3.0 <=0.3.2`, the releases that read every format and provide
`workflow-engine`; 0.2.2 provides no `workflow-engine` (plan-077's rehearsal; to be confirmed by
the dry run at `validate`). The README's "Install and update" keeps spec-002 §2.3's temporary
mark: no release in `compat.yaml` provides `pack-install` (CB-3).

No private projects' check (plan-077 ruling 6): the pack is optional, no private project composes
it, and its release changes nothing they compose; the owed row "The private projects' check
scripted" stays untriggered. No notice at this tag (plan-077 ruling 11).

At `publish`, `publish:pack` adds `governance/feedback` with its first version in `catalog.yaml`
and regenerates `CATALOG.md` and `catalog-index.json`; the approver runs it and the atomic push
(plan-077 ruling 7). CB-6's live check then reads `latest: 1.0.0` and the pack's README and
`pack.yaml` at `refs/tags/governance/feedback@1.0.0` (plan-077 point 8).

## Validation

- Commit: `f64436c4db8a8847fdcb134b9fe8922e6a385b2c`
- Command: `npm run validate:publication -- --evidence`
- Mode: publication
- Exit code: 0
- WingFoil releases: 0.3.0, 0.3.2
- Compositions: presets/classic-kanban.yaml, presets/classic-scrum.yaml, tests/fixtures/examples/base/core-records/example.yaml, tests/fixtures/examples/base/release-folders-lean/example.yaml, tests/fixtures/examples/base/release-folders/example.yaml, tests/fixtures/examples/feedback/added-outcome/example.yaml, tests/fixtures/examples/feedback/defaults/example.yaml, tests/fixtures/examples/feedback/with-software/example.yaml, tests/fixtures/examples/kanban/defaults/example.yaml, tests/fixtures/examples/kanban/team-limits/example.yaml, tests/fixtures/examples/scrum/defaults/example.yaml, tests/fixtures/examples/scrum/release-folders-lean/example.yaml, tests/fixtures/examples/software/defaults/example.yaml, tests/fixtures/examples/software/release-folders-lean/example.yaml

Report:

```text
schemas: checked 9 files, 0 problems
lint: checked 93 files, 0 problems
index: checked 8 files, 0 not up to date
composition presets/classic-kanban.yaml: composed twice, 36 files, byte-identical
composition presets/classic-scrum.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/base/core-records/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/base/release-folders-lean/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/base/release-folders/example.yaml: composed twice, 16 files, byte-identical
composition tests/fixtures/examples/feedback/added-outcome/example.yaml: composed twice, 44 files, byte-identical
composition tests/fixtures/examples/feedback/defaults/example.yaml: composed twice, 21 files, byte-identical
composition tests/fixtures/examples/feedback/with-software/example.yaml: composed twice, 45 files, byte-identical
composition tests/fixtures/examples/kanban/defaults/example.yaml: composed twice, 36 files, byte-identical
composition tests/fixtures/examples/kanban/team-limits/example.yaml: composed twice, 36 files, byte-identical
composition tests/fixtures/examples/scrum/defaults/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/scrum/release-folders-lean/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/software/defaults/example.yaml: composed twice, 37 files, byte-identical
composition tests/fixtures/examples/software/release-folders-lean/example.yaml: composed twice, 37 files, byte-identical
compositions: 14
matrix presets/classic-kanban.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix presets/classic-kanban.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix presets/classic-kanban.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix presets/classic-kanban.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix presets/classic-kanban.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix presets/classic-kanban.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix presets/classic-scrum.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/base/core-records/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders-lean/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/base/release-folders/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/added-outcome/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/defaults/example.yaml[+software]: skipped, no methodology
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/feedback/with-software/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/defaults/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/kanban/team-limits/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/defaults/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/scrum/release-folders-lean/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/software/defaults/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 workflow list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 dna show: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.0 directives list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.2 workflow list: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.2 dna show: pass (publication)
matrix tests/fixtures/examples/software/release-folders-lean/example.yaml wingfoil@0.3.2 directives list: pass (publication)
matrix: publication, 28 runs, 0 failed, tolerance applied: none
```

The evidence above ran in the Node.js 22.21.0 clean clone below.

Also, at `validate` (plan-077 step 5, point 5):
- Presets: `presets/classic-kanban.yaml` and `presets/classic-scrum.yaml`, neither holding
  `governance/feedback`; the pack's documented combinations are its three README examples above,
  each composed twice, byte-identical.
- The conditional part (`pack-compatibility`), the first a published pack carries: `with-software`
  (with `methodology/scrum`) and `added-outcome` (with `methodology/kanban`) compose the entry
  `with: software@^1`, and `defaults` leaves it out. The line `matrix
  tests/fixtures/examples/feedback/defaults/example.yaml[+software]: skipped, no methodology` is
  the coverage leg that adds `software` to `defaults`: `software` requires a methodology and
  `defaults` holds none, so the format forbids that request and the leg is skipped, not failed
  (spec-001 §3 and §15; task-087 ruling 3, plan-066 task F; `src/resolve.ts` › `forbiddenBy`).
  Both legs with `software`
  run in the matrix above on 0.3.0 and 0.3.2.
- `npm run check:runs` on 0.3.0 and 0.3.2 (dl-032 E3): 84 runs, 0 failed, exit 0.
  `governance/feedback`'s 38, each `pass`: `tests/fixtures/runs/feedback.yaml` (28 runs:
  `feedback-ingest` and `feedback-review` on the three examples, `feedback-bug-route` on
  `with-software` and `added-outcome`, and the routes `route-decision-log`, `route-task`,
  `route-declined`, `route-added-outcome`, `route-bug` and `route-would-be-bug`);
  `tests/fixtures/runs/feedback-upstream.yaml` (2 runs: `route-upstream-note` on the overlay's
  `upstream` composition); `tests/fixtures/runs/adoption-feedback.yaml` (8 runs: the adoption on
  `with-software` and `added-outcome` by a project `wingfoil init --template Scrum` and
  `--template Kanban` wrote).
- The overlays (self-test): `software-exit`, `scrum-exit` and `kanban-exit` 36 runs each,
  `feedback-exit` (its eight compositions) 44 runs, each 0 failed, tolerance none; the golden step
  (`npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden`), 26 runs,
  0 failed, the 0.2.2 tolerance of its own (dl-009).
- The run by hand (dl-032 E4, the charter's Acceptance): task-099's run on WingFoil 0.3.2, with
  and without `software`, composed from `52d125c2`, cited, not rerun: `git diff 52d125c2
  f64436c4 -- packs/ tests/fixtures/feedback-exit tests/fixtures/examples/feedback` is empty.
- `npm run publish:pack -- --pack governance/feedback --dry-run` in the Node.js 22.21.0 clean
  clone of `f64436c4`, its remote removed: exit 0; its publication matrix 28 runs, 0 failed,
  tolerance none; the tag `governance/feedback@1.0.0` at `f64436c4`, the range `>=0.3.0
  <=0.3.2`, the digest `sha256:6a43f01564c217f4ae1a31df162c262b81d7ca721155409ce7e5f8d42bd4a1f4`
  (as the outline's dry run and plan-077's rehearsal); the clone left clean, no tag added. The
  tag goes on the approval's commit, where `publish:pack` validates again.
- Checks from clean clones of `main` at `f64436c4` on Node.js 22.21.0, then 22.12.0, one after
  the other: `npm ci`, `npm run build`, `npm test` 1432 of 1432, `lint`, `check:pins`,
  `check:schemas` (9 files), `check:packs` (93 files, 0 problems), `index -- --check` (8 files,
  0 not up to date), `validate` (14 compositions, 28 runs, 0 failed), the golden step, the four
  overlays, `workflow list`, `check:runs` (84 runs, 0 failed), `npm audit --omit=dev` in the
  root and `npm audit` in the four matrix folders (0 vulnerabilities): every command exit 0 on
  both, each tree left clean; the WingFoil matrix cache copied from the checkout after `npm ci`.
- `main`'s CI on `f64436c4`, run 44505683283: `success` (`validate (22.12.0, 1)` 13 min 54 s,
  `(22.12.0, 2)` 4 min 3 s, `(22.21.0, 1)` 11 min 3 s, `(22.21.0, 2)` 6 min 10 s).
- No private projects' check (plan-077 ruling 6), as Changes says.
- The privacy check of this element and of the pack's files: no local path, no private
  repository, no private project, no intermediary session.

## Publication

Recorded at `publish` (plan-077 step 7).

## Execution Notes

- 2026-11-19, `prepare` (plan-077 step 4): added by `memory add`; `pack`, `version`, `bump`,
  `wingfoil` and `line` filled by editing the draft (W-02); Changes written; the CHANGELOG entry
  as task-096 wrote it, unchanged (plan-077 ruling 3); the README's "Install and update" checked
  against `compat.yaml` (CB-3: the temporary mark kept, no release provides `pack-install`).
- 2026-11-19: independent review (dl-017): approve after amendments; no blocker, one should-fix
  and three nits, all applied: the private projects' check stated (ruling 6); the tooling tasks'
  plans named; why 0.2.2 is out of the range; no notice (ruling 11). Submitted
  (`draft → validating`).
- 2026-11-19, `validate` (plan-077 step 5): the evidence of point 5 on `f64436c4`, recorded
  above. Independent review (dl-017): approve after amendments; no blocker, one should-fix (the
  skip rule is task-087's ruling 3, not plan-066's) and three nits (`feedback-exit`'s eight
  compositions, `npm audit --omit=dev` in the root, the matrix cache copied), all applied.
  Submitted (`validating → releasing`).
