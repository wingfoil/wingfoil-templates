---
id: task-105-the-route-through-wingfoil-channel-in-check-runs-and-the-adoption-run-prepared-plan-086-task-105
type: task
title: "The route through wingfoil-channel in check:runs and the adoption run prepared (plan-086 task-105)"
status: pending
pack: "pack-governance-wingfoil-dogfood"
depends_on: ["task-104"]
tags: ["packs","dogfood","governance"]
---

## Context

plan-086 (`pack-cycle › author` of `pack-governance-wingfoil-dogfood`), point 3 and its ruling of
2026-11-24. task-104 (`done`, merged at `704901f3`) shipped `packs/governance/wingfoil-dogfood`
and its examples `defaults` and `with-software` under `tests/fixtures/examples/wingfoil-dogfood/`.
This task writes the charter's `check:runs` evidence on those examples, as a developer change
under `tests/` inside a pack task, as task-097's was:
- **WD-4:** `feedback-ingest` → `feedback-review` driven through `wingfoil-channel` to `closed`,
  on the oldest and the newest selected release (dl-032 E3's `check:runs` evidence);
- **WD-5:** the note's format checked by the dl-163 asserts of `tests/support/inbox.ts`;
- **the adoption run, prepared** (dl-032 E3, `first-release`'s): once per `init` template.

The scenario writes the note itself: it shows that the route closes and the directives compose,
not that an agent follows them (charter WD-4). The model is `tests/fixtures/runs/
feedback-upstream.yaml` and its guard tests in `tests/runs.test.ts`; the one difference is that
the channel is the real pack's, composed from the tree's `packs/` with no overlay.

## Acceptance

1. **`tests/fixtures/runs/wingfoil-dogfood.yaml`**, `format: 1`, `compositions:
   tests/fixtures/examples/wingfoil-dogfood`, `identities.agent` as the models', no `overlay`, a
   header comment naming task-105, plan-086 and WD-4. Two runs, since `write` substitutes only
   `$<label>.id`, not a parameter (`src/runs.ts`), and the examples' inbox paths differ:
   - `route-upstream-wingfoil-defaults`, `only: [defaults]`: an item with `kind: defect`;
   - `route-upstream-wingfoil-with-software`, `only: [with-software]`: an item with `kind:
     observation`, its note's `kind: request` (the channel's mapping).

   Each run's chain, as `feedback-upstream.yaml`'s: `feedback-ingest` (`start`; `add` of a
   `feedback` element at `feedback-ingest.capture`, label `item`; `set` of `kind`, `target:
   "upstream:wingfoil"`, `source`, `context`, `outcome: upstream-note`; `submit`; `approve`;
   `end`), then `feedback-review` (`start`; `write` of the note; `set` of `resulting` to the
   note's path; `finalize: feedback-item.route@feedback:$item.id`; `submit` of the item; `end`).
2. **The note** each run writes: at the example's inbox path (`docs/wingfoil-feedback/` for
   `defaults`, the pack's default; `docs/upstream/wingfoil/` for `with-software`, its parameter),
   named `F-001-<slug>.md`; dl-163 R4's six fields in order (`id: F-001`, `title`, `kind`, `status:
   open`, `wingfoil_version`, `answered_by: []`); a body citing `$item.id`, with `## Observed` and
   `## Expected` and no `## Replies`; `## Observed` holds a short evidence line (command, output,
   version, commit) as the channel asks. The evidence and the `wingfoil_version` value are fixture
   data, one literal on both releases, which WD-5 does not check. The inbox's ledger row is the
   channel's text and not WD-4's: the scenario does not write it (plan-086 point 3).
3. **`tests/fixtures/runs/adoption-wingfoil-dogfood.yaml`**, `format: 1`, `identities.agent` as
   the models', `compositions:
   tests/fixtures/examples/wingfoil-dogfood`: two `adopt` runs, `template: Scrum` and `template:
   Kanban`, each `only: [with-software]` (an `init` template writes a software project), the
   removal list `adoption-feedback.yaml`'s, a header comment naming dl-032 E3 and the pack's first
   release, which cites its result.
4. **Guard tests** in `tests/runs.test.ts`, red first (dl-018), the red run's command and failing
   count recorded:
   - `wingfoil-dogfood.yaml`: the compositions folder, no overlay, the two runs' names and `only`,
     the chain's mains `[feedback-ingest, feedback-review]`, the item's `target` and `outcome`,
     `resulting` equal to the written path, the closing steps (`assertCloses`), and each example's
     `feedback_targets` holding `upstream:wingfoil` (spec-003 §5.3);
   - the note (WD-5): the written path starts with the example's resolved `wingfoil_inbox_path`
     (its parameter, else the pack's default) and ends in `F-<nnn>-<slug>.md`; `assertFields` and
     `assertSections` on it; its body cites `$item.id`; its `kind` is the item's mapped as the
     channel says (`defect` → `defect`, `observation` → `request`);
   - the channel as the scenario relies on it: `wingfoil-channel.md`'s text states the path form
     `{{wingfoil_inbox_path}}/F-<nnn>-<slug>.md` and the mapping `observation` becomes `request`;
   - `adoption-wingfoil-dogfood.yaml`: its compositions folder and its two runs, deep-equal, as
     `adoption-feedback.yaml`'s test.
5. **The runs pass:** `npm run check:runs` exit 0, its count 84 → 92 (the two route runs and the
   two adoption runs, each on 0.3.0 and 0.3.2), measured and stated in the Execution Notes, with
   any count test it moves (dl-018).
6. **What does not change:** no file under `src/`, `.wingfoil/`, `presets/`, `packs/` or
   `tests/fixtures/examples/` (task-104's examples are the README's fixtures; a change needed there
   goes to the approver, dl-019);
   `catalog.yaml` and the index outputs unchanged. A finding in the pack goes to the approver when
   found (dl-019); a change under `src/` found needed stops the task (plan-086 point 4).
7. **Checks** (`kanban-delivery` › `review`, dl-039): the build review and its amendments; then,
   once, on the frozen commit, the branch CI (`ci.yml`) `success`, its run id and every job's
   duration recorded (a job over 25 minutes goes to the approver, R3; `check:runs` grows);
   dl-039's local list on Node.js 22.21.0, from a clean working tree after `npm ci` and `npm run
   build`: `npm run validate:publication`, the golden tree in publication mode and `npm run -s
   wingfoil -- workflow list`, each exit 0.
8. **Delivery:** the branch `task/task-105-wingfoil-dogfood-route` from `main`, in a worktree of
   its own; after `approve`, a `--no-ff` merge on the approver's OK, `main` pushed by the
   approver, its CI read, and `approved → done`; the privacy check of the branch's diff recorded
   (`repository-practice` rule 2).

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-24: independent review of the body (dl-017, `db731c14`): approve after amendments; no
  blocker, one should-fix (task-104's examples protected in criterion 6) and three nits
  (`format: 1` and `identities.agent` named in criteria 1 and 3; the note's evidence line and
  version stated as fixture data; the durations named as `ci.yml`'s), all applied in the commit
  that records this note. The review verified 84 → 92, the per-example `write` with `only`, the
  note's fields against `assertFields`, and the adoption on `with-software` with no clash. No
  re-review: the fixes add an exclusion and name inputs, no criterion's intent changes.
