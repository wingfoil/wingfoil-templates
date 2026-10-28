---
id: task-061-base-s-readme-init-s-custom-workflows-removed-at-adoption-bug-008-s-effect-stated-the-update-from-2.0.0-bug-007-bug-008-plan-052
type: task
title: "base's README: init's custom/ workflows removed at adoption, bug-008's effect stated, the update from 2.0.0 (bug-007, bug-008, plan-052)"
status: in-progress
pack: "pack-foundation-base"
depends_on: []
tags: ["packs","base","readme"]
---

## Context

plan-052's step 4 (rulings 1 and 2): the part of bug-007 and bug-008 in `base`, published as 2.0.0
(`base@2.0.0`). Its README's "Install and update" step 3 tells an adopter to re-add "the `include`
entries of its `custom/` workflows", which re-includes the `decision-log-ingest` that
`wingfoil init` (0.3.0, 0.3.1) wrote under `workflows/custom/`: `E_WORKFLOW_DUPLICATE_NAME`
(bug-007). `retrospective` › `approve`, iterated by a methodology's sub (`methodology/scrum`'s
Sprint), lists a closed iteration's step again while a later iteration's retrospective
decision-log is `in-discussion` (bug-008); `pack-foundation-base`'s `retrospective` row says the
tag binds the approve "in a sub to the retrospective's decision-log only". Ruling 2 takes
bug-008's option (ii): the texts say it.

Only the pack's README changes in `packs/base/`: the release is a patch, 2.0.1 (ruling 1,
`pack-semver`); `version`, the CHANGELOG and the range belong to `prepare` (plan-052 step 7). The
charter's row is corrected by an Execution Note, the body as approved (ruling 2), which is what
plan-052 step 4's "the charter's `retrospective` row corrected" means.

A project's own `custom/` workflows, in this task, are those the project wrote itself, not those
`wingfoil init` scaffolded (`sw-life-cycle`, `bug-ingest`, `decision-log-ingest`, `adr-ingest` and
`scrum-delivery` or `kanban-delivery`); task-061 and task-062 use the same words.

`base`'s step 4 removes every workflow `init` scaffolded, not only `decision-log-ingest`: bug-007's
Expected keeps only the project's own `custom/` workflows, and the review found that a project
adopting `base` alone and keeping `init`'s other workflows fails on WingFoil 0.3.1 (exit 1,
`E_PHASE_ROLE_UNKNOWN` for `tech-lead`, `developer`, `architect`, `reviewer` and
`E_WORKFLOW_ELEMENT_TYPE_UNKNOWN` for `bug`, `adr`, which `base` alone does not define), while 0.3.0
accepts it.

## Acceptance

1. **`packs/base/README.md`, "Install and update":** step 3 keeps and re-includes only the project's
   own `custom/` workflows; step 4 also removes, with their `include` entries, every workflow `init`
   scaffolded under `workflows/custom/`: `decision-log-ingest`, which `base` ships, and
   `sw-life-cycle`, `adr-ingest`, `bug-ingest` and the delivery workflow, which need `software` and
   a methodology (whose packs ship or replace them), as it removes the directive stubs; an "Updating
   from 2.0.0" paragraph: nothing to recompose; a project that re-included `init`'s `custom/`
   workflows removes them with their `include` entries. No version, date or range of 2.0.1 in the
   README.
2. **bug-008's effect stated** in a hand-written part of the README (the Design picks the place):
   under a methodology that includes `retrospective` in an iterated sub, a closed iteration's
   `approve` step is listed again while a later iteration's retrospective decision-log is
   `in-discussion`, `pending approvals` counting the one decision-log once per step, and one
   approval clears both; nothing is reported `late`; a `retrospective-periodic` decision-log
   `in-discussion` has the same effect.
   The text adds no level-1 or level-2 heading (spec-002 §2.1, CB-1), is not in the first
   paragraph of "When to use it" (the index's `excerpt`, §3.3), and names the approval
   (`memory.approve`, one approval), not a command (§2.3).
3. **`pack-foundation-base`:** an Execution Note correcting the `retrospective` row's "in a sub to
   the retrospective's decision-log only" (bug-008), the body as approved.
4. **No other file under `packs/base/` changes**; `npm run index` regenerates nothing in it (the
   generated sections stay byte-identical) and `CATALOG.md`, `catalog-index.json` and `llms.txt`,
   built from the tagged manifests, do not move.
5. **Checks:** `npm run validate`, the overlays `software-exit` and `scrum-exit`, the golden step,
   `check:runs`; from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`,
   `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`, the overlays, the
   golden step, `workflow list`, `check:runs`, `npm audit` in the root and in every matrix folder:
   exit 0; the branch CI `success`, recorded; after the merge, `main`'s CI read. The steps of 1
   applied by hand on projects initialised by `wingfoil init --template Scrum` and
   `--template Kanban` on 0.3.0 and 0.3.1, with `base` alone: `workflow list` and `workflow next`
   exit 0, no diagnostic, recorded.
6. bug-007's and bug-008's Execution Notes are written after the later of task-061's and
   task-062's merges (plan-052 step 5).

## Design

- **Steps 3 and 4** of "Install and update" rewritten in place, no new step and no renumbering
  (step 5 onward unchanged). Step 3 keeps the `custom/` folders, then re-adds the project's own
  entries, the `include` entries of its own `custom/` workflows among them (the workflows the
  project wrote itself). Step 4 removes what `init` scaffolded and a composition replaces: the
  directive stubs with `base`'s ids, as now, and the five `init` workflows by name
  (`decision-log-ingest`, which `base` ships; `sw-life-cycle`, `adr-ingest`, `bug-ingest` and
  `scrum-delivery` or `kanban-delivery`, which need `software` and a methodology, whose packs ship
  or replace them), each with its `include` entry. The reason in one clause: a workflow named as a
  pack's makes every `workflow` command fail; the others need roles and types `base` alone lacks.
- **"Updating from 2.0.0"**: a paragraph after "Updating from 1.0.0", same form: nothing to
  recompose; a project that kept and re-included `init`'s `custom/` workflows removes them with
  their `include` entries, as step 4 says.
- **bug-008's sentence** goes in "Sources and adaptations", in the bullet on WingFoil's
  `retrospective` that already says the approval selects the decision-log by a tag: an existing
  hand-written H2 section, not the excerpt, no new heading; it names the approval, no command.
- **No other file under `packs/`**: the generated sections are untouched, `npm run index -- --check`
  proves it. The charter's Execution Note (Acceptance 3) on this branch.
- **The by-hand check (Acceptance 5)**: four scratch projects outside the repository (`init
  --template Scrum` and `--template Kanban`, WingFoil 0.3.0 and 0.3.1 from the matrix cache),
  `base` composed alone from the README example `core-records`, steps 3 and 4 applied as written,
  committed; `workflow list --format json` and `workflow next --format json`, exit codes and
  diagnostics recorded.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->

- 2026-10-28: independent review (with task-060, task-061 and task-062): approve after amendments
  (blocking: with `base` alone, keeping `init`'s software workflows fails on 0.3.1; step 4 now
  removes every workflow `init` scaffolded (bug-007's Expected)). Applied.
- 2026-10-28: re-review: approve. Submitted.
- 2026-10-28: built (`d48bc2e` the README, `f75eccb` the charter's note). `npm run index -- --check`
  6 files, 0 not up to date; `check:packs` 61 files, 0 problems. Acceptance 5, by hand outside the
  repository: `base` composed alone from `core-records`, copied into four projects initialised by
  `wingfoil init --template Scrum` and `--template Kanban` on WingFoil 0.3.0 and 0.3.1, steps 3
  and 4 applied as written (the five scaffolded workflows and the three directive stubs removed,
  the `include` entries left are `base`'s four), committed: `workflow list --format json` and
  `workflow next --format json` exit 0, no diagnostic, empty stderr, on all four. With the steps
  before this task (no workflow removed), on 0.3.0 and 0.3.1 (Scrum): both exit 1,
  `E_WORKFLOW_DUPLICATE_NAME` for `decision-log-ingest`.
- 2026-10-28: independent review: approve, nothing blocking; it reproduced Acceptance 5 on 0.3.0
  and 0.3.1 with both templates, and each `init` workflow re-added alone fails as step 4 says on
  0.3.1 (`decision-log-ingest` also on 0.3.0). Applied (`2121749`): step 4's wording, the `include`
  entry for every workflow. Noted, not changed (outside bug-007): step 3's "own entries" draws the
  "wrote itself" line only for workflows, so a literal reader might re-add `init`'s Memory types or
  roles; for a later README pass. The clean-clone checks rerun on the final commit.
- 2026-10-28, checks from clean clones (`2121749` on Node.js 22.21.0, `8ac7ff0` on 22.12.0, which
  adds only these notes): `npm ci` (0 vulnerabilities), `npm test` 1010 of 1010, `lint`,
  `check:pins`, `check:schemas`, `check:packs` (61 files, 0 problems), `index -- --check` (6 files,
  0 not up to date), `validate` (14 runs, 0 failed), the golden step (26 runs, 0 failed), the
  overlays `software-exit` and `scrum-exit` (22 runs each, 0 failed), `workflow list`,
  `check:runs` (26 runs, 0 failed), `npm audit` in the root and in the three matrix folders (0
  vulnerabilities): every command exit 0 on both. Branch CI: run 40660549898 on `8ac7ff0`,
  conclusion `success` (the two runs before it cancelled by the next push). In review.
