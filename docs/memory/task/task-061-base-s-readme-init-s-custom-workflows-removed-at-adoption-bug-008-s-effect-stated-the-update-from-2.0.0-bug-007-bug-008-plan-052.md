---
id: task-061-base-s-readme-init-s-custom-workflows-removed-at-adoption-bug-008-s-effect-stated-the-update-from-2.0.0-bug-007-bug-008-plan-052
type: task
title: "base's README: init's custom/ workflows removed at adoption, bug-008's effect stated, the update from 2.0.0 (bug-007, bug-008, plan-052)"
status: draft
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
`pack-semver`); `version`, the CHANGELOG and the range belong to `prepare` (plan-052 step 7).

## Acceptance

1. **`packs/base/README.md`, "Install and update":** step 3 keeps and re-includes only the
   project's own `custom/` workflows; step 4 also removes the workflows `init` wrote under
   `workflows/custom/` with the name of one of `base`'s (`decision-log-ingest`), with their
   `include` entries, as it removes the directive stubs; an "Updating from 2.0.0" paragraph:
   nothing to recompose; a project that re-included `init`'s `custom/` workflows removes them with
   their `include` entries. No version, date or range of 2.0.1 in the README.
2. **bug-008's effect stated** in a hand-written part of the README (the Design picks the place):
   under a methodology that includes `retrospective` in an iterated sub, a closed iteration's
   `approve` step is listed again while a later iteration's retrospective decision-log is
   `in-discussion`, and one `memory approve` clears both; nothing is reported `late`.
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
   applied by hand on a project initialised by `wingfoil init --template Scrum` on 0.3.0 and
   0.3.1, with `base` alone: `workflow list` exit 0, no diagnostic, recorded.
6. bug-007's and bug-008's Execution Notes are written after task-062 (plan-052 step 5).

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
