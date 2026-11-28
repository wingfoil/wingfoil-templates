---
id: task-111-methodology-kanban-s-next-minor-the-precedence-lines-plan-090-task-111
type: task
title: "methodology/kanban's next minor: the Precedence lines (plan-090 task-111)"
status: draft
pack: "pack-methodology-kanban"
depends_on: []
tags: ["packs","kanban"]
---

## Context

plan-090 hosts this task (its Steps 3; points 3 and 4 of its outline, ruled on 2026-11-27): the
content of `methodology/kanban`'s next minor, 1.1.0 (`prel-012`, prepared after this task), the
last of the round's four pack tasks. A pack task under `kanban-delivery` v7, pack-author, charter
`pack-methodology-kanban`; the CHANGELOG entry, the version and the range are `prepare`'s.

**What it adds**, the register's Open row (`docs/owed-items.md`): "`methodology/kanban`'s
directives' `Precedence:` line" (dl-025 D2, spec-001 §10.1, `pack-authoring`; plan-063 ruling 6:
the packs published before 2026-11-05 carry it from their next minor): `definition-of-workflow`
and `kanban` `Precedence: method` (plan-090 point 4). No bug of the round names `kanban`; its
AGENTS.md section names no role mapping or gate by value (bug-012's and bug-013's pattern), so no
section change is owed. Its README's step 3 already answers the row "README step 3 'own entries'"
(task-067), and plan-090 point 3 asks each pack task's README for an "Updating from 1.0.0"
paragraph: recompose, regenerate the AGENTS.md region and paste it again.

**What exists today** (`main` at `e5694420`, `methodology/kanban` 1.0.0 tagged):
`packs/methodology/kanban/directives/` (`definition-of-workflow`, `kanban`, neither with a
`Precedence:` line), `agents/section.md`, `workflows/` (`delivery`, `release-flow`, `work-item`),
and a `README.md` whose "Install and update" ends at step 8, with no "Updating from" paragraph.
The AGENTS.md region does not change with this task (no section or fragment changes): the region a
1.0.0 project pasted stays valid, and only the directives' copy matters.

## Acceptance

1. **The `Precedence:` lines:** `definition-of-workflow` and `kanban` `Precedence: method`, each
   after the `# ` title and a blank line, followed by a blank line, as `base`'s
   `security-secrets.md`; the rest of each directive unchanged. No lint checks it (plan-090 point
   4): the Design lists each, and the build review reads them.
2. **The README:** after step 8, in "Install and update", as `software`'s and `scrum`'s, an
   **"Updating from 1.0.0."** paragraph: the project recomposes `methodology/kanban` and copies the
   `.wingfoil/` files as in steps 2 and 3; the directives' `Precedence:` lines reach it only by
   that copy; the AGENTS.md region is unchanged by this version (`base`'s and `software`'s next
   minors change theirs, regenerated with them); nothing in its elements changes. Step 3 and the
   rest of the README unchanged; the generated regions are not expected to change (`npm run index
   -- --check`).
3. **Not this task's:** the CHANGELOG entry, `pack.yaml`'s `version` and the range (`prepare`);
   the note on the charter `pack-methodology-kanban`, plan-090 point 11's; no file under `src/`,
   `.wingfoil/`, `presets/` or another pack changes, and no workflow, fragment, section or template
   of `kanban`; a change found needed there stops the task and goes to the approver (dl-019).
4. **Validation:** `npm test`, `npm run lint`, `npm run check:texts -- --base main`, `npm run
   check:packs`, `npm run index -- --check` and `npm run validate` pass with no warning,
   `tolerance applied: none`; the overlays `software-exit`, `scrum-exit`, `kanban-exit` and
   `feedback-exit` and the golden tree pass; `npm run check:runs` passes, its runs unchanged.
   `catalog.yaml`, `CATALOG.md`, `catalog-index.json` and `llms.txt` unchanged until `prepare`.
5. **The counts** the tooling tests take on this repository: each that moves stated in the
   Execution Notes with the test it changes, measured, not assumed (none is expected).
6. **Checks** (`kanban-delivery` › `review`, dl-039): the build review and its amendments; then,
   once, on the frozen commit, the branch CI `success`, its run id and every job's duration (a job
   over 25 minutes goes to the approver); dl-039's local list on Node.js 22.21.0 from a clean tree
   after `npm ci` and `npm run build`, as task-110 ran it.
7. **Delivery:** the branch `task/task-111-…` from `main`, in a worktree; after `approve`, a
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
