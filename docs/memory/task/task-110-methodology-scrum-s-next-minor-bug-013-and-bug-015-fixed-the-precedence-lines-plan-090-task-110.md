---
id: task-110-methodology-scrum-s-next-minor-bug-013-and-bug-015-fixed-the-precedence-lines-plan-090-task-110
type: task
title: "methodology/scrum's next minor: bug-013 and bug-015 fixed, the Precedence lines (plan-090 task-110)"
status: draft
pack: "pack-methodology-scrum"
depends_on: []
tags: ["packs","scrum"]
---

## Context

plan-090 hosts this task (its Steps 3; points 3 and 4 of its outline, ruled on 2026-11-27): the
content of `methodology/scrum`'s next minor, 1.1.0 (`prel-011`, prepared after this task and
task-111). A pack task under `kanban-delivery` v7, pack-author, charter `pack-methodology-scrum`;
the CHANGELOG entry, the version and the range are `prepare`'s, not this task's. It follows
task-108 (`base`) and task-109 (`software`, merged at `f5172ad0`), whose shapes it reuses.

**What it fixes**, the register's Open rows (`docs/owed-items.md`):
- **bug-013's fix** (`approved`, `minor`): `scrum`'s AGENTS.md section states by value
  "**Roles:** the Product Owner is `product-owner`, the Scrum Master `facilitator`, the Developers
  `developer` with `architect`, `reviewer`, `qa` and `tech-lead`." The mapping lives in the
  workflows' phase `role:` fields and in the roles `dna.yaml` declares (`roles.yaml` binds
  directives to roles and holds no mapping); a project that changes them gets a region that
  contradicts its configuration, as bug-012 for `software`. Expected (bug-013): the section names
  the mapping as `scrum`'s default and points to the workflows' roles and `dna.yaml` › `team` for
  the project's own, or takes it from parameters with defaults (spec-001 §8). The `scrum`
  directive's **Accountabilities** bullet states the same mapping by value; it is a rule, not the
  generated region, and bug-013 does not name it, but a project that changes its roles meets the
  same contradiction there: this task gives it the same reading (criterion 1).
- **bug-015's fix** (`approved`, `minor`): a task's or a release's `sprint` naming no Sprint is
  accepted at `memory submit`, and the element is never selected by `sprint` › `development` or
  `release` (their `where` match `sprint: "{sprint.id}"`), with no message. The field is written by
  editing (`sprint-planning` into the tasks, `plan-release` into the release's draft); WingFoil
  0.3.2 checks no reference and a pack cannot add a check (spec-001 O4). Expected (bug-015):
  `sprint-planning` and `plan-release` name the risk and ask that the field be checked against the
  Sprint's id when written, and the `scrum` directive (the register's row) or `backlog-item`'s
  description says that an element whose `sprint` names no Sprint is never selected. WingFoil's
  side is F-043, not this task's.
- **The `Precedence:` lines** (dl-025 D2, spec-001 §10.1, `pack-authoring`): `definition-of-done`
  and `scrum` `Precedence: method` (plan-090 point 4).
- **README step 3 "own entries"** (plan-052 › close, task-067; trigger the next README pass,
  plan-090 point 3): `scrum`'s step 3 re-adds "its own entries" without saying that `init`'s
  scaffolded Memory types, roles and workflows are not among them; `methodology/kanban`'s step 3,
  and from their next minors `base`'s and `software`'s, answer it.

**What exists today** (`main` at `f574a1d0`, `methodology/scrum` 1.0.0 tagged):
`packs/methodology/scrum/directives/` (`definition-of-done`, `scrum`, neither with a `Precedence:`
line), `agents/section.md` (the "Roles" bullet above), `workflows/sprint.yaml` (`version: 1`; its
`sprint-planning` and `plan-release` descriptions name no risk), `workflows/backlog-item.yaml`,
`workflows/delivery.yaml`, `fragments/roles.yaml`, `memory-templates/sprint.md`, and a `README.md`
with no "Updating from" paragraph. `scrum` has no Memory template that WingFoil 0.3.2's `init`
gives optional fields (plan-090 point 5 names none for it).

## Acceptance

1. **bug-013:** `agents/section.md`'s "Roles" bullet names the mapping as `scrum`'s default (the
   Product Owner `product-owner`, the Scrum Master `facilitator`, the Developers `developer` with
   `architect`, `reviewer`, `qa` and `tech-lead`) and says a project's own mapping is the roles
   its workflows' phases name and `dna.yaml` › `team` gives; no parameter is added (bug-013's other
   option: a reference follows the project's own files with nothing to set). The `scrum`
   directive's Accountabilities bullet reads the mapping the same way (by default, the project's
   workflows and `dna.yaml` deciding); the rest of that bullet unchanged.
2. **bug-015:** `sprint.yaml` › `sprint-planning`'s description asks that the Sprint's id written
   in a task's `sprint` field be checked against the Sprint's id, and says that a task whose
   `sprint` names no Sprint is never selected and WingFoil gives no message; `plan-release`'s
   description says the same of the release's `sprint`; the `scrum` directive gains a bullet: an
   element whose `sprint` names no Sprint (misspelt, or a Sprint never created) is never selected
   by any Sprint and no command says so, so its writer checks it against the Sprint's id. The
   workflow's `version` moves by one (`2`), as `base`'s `governance-evolution` did in task-108;
   its phases, roles, actions and `where` unchanged.
3. **The `Precedence:` lines:** `definition-of-done` and `scrum` `Precedence: method`, each after
   the `# ` title and a blank line, followed by a blank line, as `base`'s `security-secrets.md`; no
   lint checks it (plan-090 point 4): the Design lists each, and the build review reads them.
4. **The README:** step 3 re-adds only what the project wrote itself (among them the `include`
   entries of the `custom/` workflows it wrote), never the Memory types, roles or workflows
   WingFoil's `init` scaffolded, as `methodology/kanban`'s; the rest of step 3 (the delivery
   workflow `init` scaffolded removed) unchanged; an **"Updating from 1.0.0."** paragraph:
   recompose and copy the `.wingfoil/` files as in steps 2 and 3, regenerate the AGENTS.md region
   and paste it again (bug-013 changes it); the changed directives and `sprint` reach the project
   only by that copy; nothing in its elements changes, but a task or a release whose `sprint`
   names no Sprint is worth checking once. The generated regions are not expected to change;
   `npm run index -- --check` says so.
5. **Not this task's:** the CHANGELOG entry, `pack.yaml`'s `version` and the range (`prepare`);
   the notes on the charter `pack-methodology-scrum`, on bug-013 and on bug-015, which are plan-090
   point 11's, after the tag; F-043 (WingFoil's side); no file under `src/`, `.wingfoil/`,
   `presets/` or another pack changes; a change found needed there stops the task and goes to the
   approver (dl-019).
6. **Validation:** `npm test`, `npm run lint`, `npm run check:texts -- --base main`, `npm run
   check:packs`, `npm run index -- --check` and `npm run validate` pass with no warning,
   `tolerance applied: none`; the overlays `software-exit`, `scrum-exit`, `kanban-exit` and
   `feedback-exit` and the golden tree pass; `npm run check:runs` passes, its runs unchanged (no
   template changes, so no run is added). `catalog.yaml`, `CATALOG.md`, `catalog-index.json` and
   `llms.txt` unchanged until `prepare`. Tests and fixtures that read `scrum`'s files (the
   `scrum-exit` overlay among them) updated where their expectations change.
7. **The counts** the tooling tests take on this repository (the lint's files, the index's, the
   compositions and runs): each that moves stated in the Execution Notes with the test it changes,
   measured, not assumed.
8. **Checks** (`kanban-delivery` › `review`, dl-039): the build review and its amendments; then,
   once, on the frozen commit, the branch CI `success`, its run id and every job's duration (a job
   over 25 minutes goes to the approver); dl-039's local list on Node.js 22.21.0 from a clean tree
   after `npm ci` and `npm run build`, as task-109 ran it.
9. **Delivery:** the branch `task/task-110-…` from `main`, in a worktree; after `approve`, a
   `--no-ff` merge on the approver's OK, `main` pushed by the approver (plan-090 ruling 13), its CI
   read, and `approved → done`; the privacy check of the branch's diff recorded
   (`repository-practice` rule 2).

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
