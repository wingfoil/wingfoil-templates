---
id: task-062-software-s-and-methodology-scrum-s-readmes-init-s-custom-workflows-removed-at-adoption-bug-008-s-effect-the-tech-lead-holder-bug-007-bug-008-plan-052
type: task
title: "software's and methodology/scrum's READMEs: init's custom/ workflows removed at adoption, bug-008's effect, the tech-lead holder (bug-007, bug-008, plan-052)"
status: approved
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

- **`software`, step 3:** the project's own entries re-added name, among them, the `include`
  entries of the `custom/` workflows the project wrote itself. **Step 4** becomes "remove what
  `init` scaffolded under `custom/` and the composition replaces": the `determinism` directive, as
  now, and the workflows `sw-life-cycle`, `adr-ingest`, `bug-ingest`, which `software` ships, each
  with its `include` entry (a workflow named as a pack's makes every `workflow` command fail);
  `base`'s step 4 covers the rest. WingFoil's `init` named with no release. No renumbering.
- **`software`'s `tech-lead` holder:** a paragraph after the steps, led by a bold phrase (no
  heading, spec-002 §2.1), naming the eight phases and the two ways (`dna.yaml`'s members, the
  agent's `executes_as`); not in "When to use it", whose first paragraph is the excerpt.
- **`methodology/scrum`, step 3:** the project's own entries as in `software`'s, and the delivery
  workflow `init` scaffolded (`scrum-delivery` or `kanban-delivery`) removed with its `include`
  entry, the methodology's `delivery` replacing it; `base`'s and `software`'s step 4 named for the
  other workflows. In step 3, so that no step is renumbered.
- **bug-008's sentence in `methodology/scrum`:** a new item of "Sources and adaptations" ›
  "Adaptations to the Guide": the Sprint Retrospective is `base`'s `retrospective`, whose approval
  is not bound to the Sprint; a closed Sprint's `approve` step is listed again while a later
  Sprint's retrospective decision-log is `in-discussion`, one approval clearing both.
- **The charter's note** (Acceptance 4) on this branch; the generated sections untouched
  (`npm run index -- --check`).
- **The by-hand check (Acceptance 6):** the same script as task-061's, outside the repository:
  `base`, `software` and `methodology/scrum` composed from the README example `scrum/defaults`,
  copied into projects initialised with both templates on 0.3.0 and 0.3.1, the three READMEs'
  steps applied together (the five scaffolded workflows and the four stubs removed), committed;
  `workflow list` and `workflow next`, exit codes and diagnostics recorded.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->

- 2026-10-28: independent review (with task-060, task-061 and task-062): approve after amendments
  (open point 2 resolved in part; the bug notes after the later merge; the README constraints).
  Applied.
- 2026-10-28: re-review: approve. Submitted.
- 2026-10-28: built (`5266070` the READMEs, `f9cf245` the charter's note, `ae9ae3b` the agent's
  whole `executes_as` named, read from a composed DNA). `npm run index -- --check` 6 files, 0 not
  up to date; `check:packs` 61 files, 0 problems. Acceptance 6, by hand outside the repository:
  `base`, `software` and `methodology/scrum` composed from `scrum/defaults`, copied into four
  projects initialised by `wingfoil init --template Scrum` and `--template Kanban` on WingFoil
  0.3.0 and 0.3.1, the three READMEs' steps applied together (the five scaffolded workflows and
  the four directive stubs removed), committed: `workflow list --format json` and
  `workflow next --format json` exit 0, no diagnostic, empty stderr, on all four.
- 2026-10-28: independent review: approve, nothing blocking; it reproduced Acceptance 6 on 0.3.0
  and 0.3.1 with both templates and checked the union of the three READMEs' removals is bug-007's
  list. Nits applied (`6f72b99`): "`tech-lead`'s phases", the paragraph rewrapped, the keys
  named (`team.members` › `roles`, `team.agents` › `executes_as`). Its merge-order note stands:
  task-061 merges first (step 4 of `base` removes `decision-log-ingest`), no publication between.
- 2026-10-28, checks from clean clones of `a5a1186` on Node.js 22.21.0 and 22.12.0: `npm ci` (0
  vulnerabilities), `npm test` 1010 of 1010, `lint`, `check:pins`, `check:schemas`, `check:packs`
  (61 files, 0 problems), `index -- --check` (6 files, 0 not up to date), `validate` (14 runs, 0
  failed), the golden step, the overlays `software-exit` and `scrum-exit` (22 runs each, 0 failed),
  `workflow list`, `check:runs` (26 runs, 0 failed), `npm audit` in the root and in the three
  matrix folders (0 vulnerabilities): every command exit 0 on both. Branch CI: run 40660532833 on
  `a5a1186`, conclusion `success`. task-061 is on `main` (`66b783f`), so the three READMEs agree
  there once this task merges. In review.
- 2026-10-28: approved by the approver (`f20376f`); merged into `main` (`eebfe21`). Delivered.
