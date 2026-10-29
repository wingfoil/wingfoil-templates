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
in CI and are cited in each pack-release's evidence. Where a run came first, it paid off: plan-047
ran the method by hand on WingFoil 0.3.0 before the scrum charter was accepted and found dl-026,
dl-027, bug-005 and bug-006; task-057's full run found two charter errors after every review (§3).

Candidates G4 and G10 of the retrospective dl-028 (C4).

## Options

1. **Leave it to each plan**, as today. Rejected: it was skipped for `base` and `software`.
2. **A run before publication only** (`pack-compatibility`, `pack-release` › `validate`). It catches
   bug-005/006 and bug-007 before a tag, but finds a contract defect such as dl-027's only after the
   pack is authored.
3. **Option 2, and a run before a workflow-bearing charter is accepted** (`pack-cycle` ›
   `charter`), as plan-047 did.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **E1 — Option 3.**
- **E2 — Before a charter is accepted.** A charter whose pack ships or changes workflows records, in
  its plan, a run on the newest WingFoil release that `compat.yaml` lists: the pack's draft
  composed with the packs it requires, driven with WingFoil's `workflow` and `memory` commands
  through every phase it adds, at least once around each loop (an `iterate_over` with two
  candidates). The run's findings go to the charter while it is `proposed`.
- **E3 — Before a version is published.** `pack-compatibility` adds to the three load commands:
  `npm run check:runs` exits 0 on every release `compat.yaml` lists as compatible, with a scenario
  for each workflow-bearing pack of the composition; and, for a pack whose README carries install
  steps, the adoption run from a project made by `wingfoil init` (each template) exits 0.
  `pack-release-cycle` › `validate` cites both in the Validation section.
- **E4 — A pack's exit criterion** (`pack-cycle` › `author`) includes a run of its workflows, not
  only their validation: for `software`-like packs, through `release` to `released` at least once.
- **E5 — Applied after approval** by the dl actions plan after plan-054: `pack-compatibility`
  (version bump), `pack-cycle` (`charter`'s and `author`'s descriptions, version bump),
  `pack-release-cycle` (`validate`'s description and check, version bump). A scenario that
  `check:runs` cannot drive yet (the full scrum run of plan-052's owed items) is a tooling task of
  its own, not a condition of this element.

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-028.
