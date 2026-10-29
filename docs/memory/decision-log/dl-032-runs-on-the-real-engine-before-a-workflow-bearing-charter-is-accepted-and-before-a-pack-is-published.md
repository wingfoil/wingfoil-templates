---
id: dl-032-runs-on-the-real-engine-before-a-workflow-bearing-charter-is-accepted-and-before-a-pack-is-published
type: decision-log
title: "Runs on the real engine before a workflow-bearing charter is accepted and before a pack is published"
status: draft
tags: ["process","packs","validation"]
---

## Context

Three defects of the period reached a published version, or an accepted contract, because no
check ran the engine on the pack (inventory of 2026-10-28, §1 … §3):
- `base@1.0.0` shipped bug-005 and bug-006. Its matrix ran only `workflow list`, `dna show` and
  `directives list` (prel-001 › Validation), as the `pack-compatibility` directive requires; the
  defects were found by the scrum charter's run of `sw-life-cycle` four days after the tag.
- `software`'s exit criterion (task-049) validated four compositions, while its `delivery` contract
  stopped a release after `enter-releasing` at run time (dl-027); the parallel scrum run found it.
- The README's adoption steps were never run on a project made by `wingfoil init`: bug-007 (major)
  was in `base@1.0.0` and `base@2.0.0`, found by plan-051's `recheck`.

The guards that followed exist but no rule requires them: `npm run check:runs` (task-053, task-058:
starts of `sw-life-cycle` on every selected release) and the adoption run of `init` (task-060) run
in CI and are cited in each pack-release's evidence since prel-002, the adoption run since prel-003.
Where a run came first, it paid off: plan-047 ran the method by hand on WingFoil 0.3.0 before the
scrum charter was accepted, which led to dl-026 and dl-027 and found bug-005 and bug-006; task-057's
full run found two charter errors after its reviews (§3).

Candidates G4 and G10 of the retrospective dl-028 (C4).

## Options

1. **Leave it to each plan**, as today. Rejected: it was skipped for `base` and `software`.
2. **A run before publication only** (`pack-compatibility`, `pack-release-cycle` › `validate`). It
   catches bug-005/006 and bug-007 before a tag, but finds a contract defect such as dl-027's only
   after the pack is authored.
3. **Option 2, a run before a charter is accepted** (`pack-cycle` › `charter`, as plan-047 did),
   **and a run in the exit criterion** (`pack-cycle` › `author`). Its cost, as plan-047 shows: a
   long plan (about 3,950 words), a ruling superseded mid-plan, a scratch run to rebuild after a
   restart (§3).

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **E1 — Option 3.**
- **E2 — Before a charter is accepted.** A charter of a pack that ships workflows, or fills a slot
  of a required pack's workflow, records in its plan a run on the newest WingFoil release that
  `compat.yaml` lists: the pack's draft composed with the packs it requires and, for a slot they
  leave open, a fixture pack (as task-046's overlay), driven with WingFoil's `workflow` and `memory`
  commands through every phase it adds, at least once around each loop: an `iterate_over` with two
  candidates, each driven through every state its `where` selects, and one that spans two
  iterations of the enclosing loop where the pack has one. By hand or with `check:runs`, recorded
  with commands and exit codes (`pack-compatibility`'s evidence rule); a script is not required,
  because the scripted full run is itself owed (plan-050 ruling 3). The run's findings go to the
  charter while it is `proposed`.
- **E3 — Before a version is published.** `pack-compatibility` adds to the three load commands:
  `npm run check:runs` exits 0 on the oldest and the newest WingFoil release that `compat.yaml`
  lists as compatible (the releases the matrix selects), with a scenario that starts every `main`
  the pack ships (for a pack that ships none, a `main` of the composition that reaches its
  workflows where the tooling can); and, for a pack whose README carries install steps, the
  adoption run on a composition that holds the pack, once per `init` template (Scrum and Kanban
  today). `pack-release-cycle` › `validate` cites both in the Validation section.
- **E4 — A pack's exit criterion** (`pack-cycle` › `author`) includes a run of its workflows, not
  only their validation: for a pack that ships a `release` workflow or fills `delivery`, a run
  through `release` to `released` at least once, with its methodology or the overlay's fixture
  methodology; by hand where `check:runs` cannot drive it.
- **E5 — Applied after approval** by the dl actions plan after plan-054: `pack-compatibility` (its
  load-commands bullet extended; the directive carries no version line); `pack-cycle.yaml` v5 → v6
  (`charter`'s and `author`'s descriptions), one bump together with dl-033 O4 if both land in the
  same plan; `pack-release-cycle.yaml` v7 → v8 (`validate`'s description and its `checks.post`
  line). The scripted full scrum run (task-057's; plan-050 ruling 3, owed in dl-031's register) is
  a tooling task of its own, not a condition of this element.

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-028.
- 2026-10-29: independent review: approve after amendments, nothing blocking; applied: E3 on the
  oldest and newest releases as the matrix selects, the scenarios and the adoption run as the
  tooling has them, E5's concrete bumps (the directive has no version), E2's loop that crosses its
  `where` states and a fixture for an open slot, by hand allowed, E4 in the options and precise,
  wording.
