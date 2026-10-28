---
id: task-062-software-s-and-methodology-scrum-s-readmes-init-s-custom-workflows-removed-at-adoption-bug-008-s-effect-the-tech-lead-holder-bug-007-bug-008-plan-052
type: task
title: "software's and methodology/scrum's READMEs: init's custom/ workflows removed at adoption, bug-008's effect, the tech-lead holder (bug-007, bug-008, plan-052)"
status: pending
pack: "pack-methodology-scrum"
depends_on: []
tags: ["packs","software","scrum","readme"]
---

## Context

plan-052's step 5 (rulings 2 and 5): the part of bug-007 and bug-008 in `software` and
`methodology/scrum`, both unpublished: fixed before their 1.0.0, with no release of their own
(plan-050's task-055 touched both packs under `pack-methodology-scrum`, the precedent for one
task). `wingfoil init` (0.3.0, 0.3.1) writes under `workflows/custom/` the workflows
`sw-life-cycle`, `adr-ingest` and `bug-ingest`, named as `software`'s, and a delivery workflow
(`scrum-delivery` or `kanban-delivery`) that the methodology's `delivery` replaces; both READMEs'
step 3 keeps and re-includes them: `E_WORKFLOW_DUPLICATE_NAME` (bug-007). `software`'s step 4
names "WingFoil 0.3.0's `init`", which 0.3.1 also is. `methodology/scrum` iterates `base`'s
`retrospective` per Sprint (bug-008, option (ii)). The composed DNA gives `tech-lead` to no one,
and `software`'s agent keeps `executes_as: [developer, reviewer, qa, architect]` (ruling 5).

A project's own `custom/` workflows, in this task, are those the project wrote itself, not those
`wingfoil init` scaffolded (`sw-life-cycle`, `bug-ingest`, `decision-log-ingest`, `adr-ingest` and
`scrum-delivery` or `kanban-delivery`); task-061 and task-062 use the same words.

## Acceptance

1. **`packs/software/README.md`, "Install and update":** step 3 keeps and re-includes only the
   project's own `custom/` workflows; step 4 removes, besides the `determinism` stub, the
   workflows `init` wrote under `workflows/custom/` with the names of `software`'s (`sw-life-cycle`,
   `adr-ingest`, `bug-ingest`), with their `include` entries, and names WingFoil's `init` with no
   release.
2. **`software`'s `tech-lead` holder** (ruling 5), in a hand-written part of its README: the
   `tech-lead` phases (`release-submit` › `enter-releasing`; `release-publishing` ›
   `release-commit`, `tag`, `publish`, `mark-released`; `end-of-life` › `deprecate`, `archive`;
   `bug-ingest` › `triage`) need a holder: the project gives `tech-lead` to a member in its
   `dna.yaml`, or adds it to its agent's `executes_as`. No DNA change.
3. **`packs/methodology/scrum/README.md`, "Install and update":** step 3 keeps and re-includes
   only the project's own `custom/` workflows; a step removes `init`'s delivery workflow
   (`scrum-delivery` or `kanban-delivery`) with its `include` entry, the methodology's `delivery`
   replacing it; and bug-008's effect, in a hand-written part: a closed Sprint's
   `retrospective.approve` step is listed again while a later Sprint's retrospective decision-log
   is `in-discussion`, one approval clearing both.
   The text adds no level-1 or level-2 heading (spec-002 §2.1, CB-1), is not in the first
   paragraph of "When to use it" (the index's `excerpt`, §3.3), and names the approval
   (`memory.approve`, one approval), not a command (§2.3).
4. **`pack-methodology-scrum`:** an Execution Note: open point 2 resolved in part by `base` 2.0.0
   (bug-006's trailing `/` fixed; the weak evidence, `explore` complete for every later Sprint once
   a file is there, stays a known limit of `base`), open point 3's Sprint state names fixed by
   1.0.0; the body as approved.
5. **No other file under `packs/` changes** but the two READMEs' hand-written parts; the generated
   sections stay byte-identical (`npm run index -- --check`).
6. **Checks:** as task-061's 5, and the steps of 1 and 3 applied by hand on projects initialised
   by `wingfoil init --template Scrum` and `--template Kanban` on 0.3.0 and 0.3.1, with `base`,
   `software` and `methodology/scrum` composed from the README example `scrum/defaults`:
   `workflow list` and `workflow next` exit 0, no diagnostic, recorded.
7. **After the later of task-061's and task-062's merges:** bug-007's and bug-008's Execution Notes
   record the fix ("fixed on `main` by the merges of task-061 and task-062; released in `base`
   2.0.1, `software` 1.0.0, `methodology/scrum` 1.0.0", completed at publication).

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->

- 2026-10-28: independent review (with task-060, task-061 and task-062): approve after amendments
  (open point 2 resolved in part; the bug notes after the later merge; the README constraints). Applied.
- 2026-10-28: re-review: approve. Submitted.
