---
id: task-105-the-route-through-wingfoil-channel-in-check-runs-and-the-adoption-run-prepared-plan-086-task-105
type: task
title: "The route through wingfoil-channel in check:runs and the adoption run prepared (plan-086 task-105)"
status: done
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

Branch `task/task-105-wingfoil-dogfood-route` from `main` at `e4690bb3` (the approve), in a
worktree of its own.

**Files:**
- `tests/fixtures/runs/wingfoil-dogfood.yaml`: the two route runs of criterion 1, written from
  `feedback-upstream.yaml`; the notes at `docs/wingfoil-feedback/F-001-a-flag-refused.md`
  (`defaults`, a `defect`) and `docs/upstream/wingfoil/F-001-an-unexpected-listing-order.md`
  (`with-software`, an `observation` sent as a `request`), each body citing `$item.id`;
- `tests/fixtures/runs/adoption-wingfoil-dogfood.yaml`: criterion 3's two `adopt` runs,
  `adoption-feedback.yaml`'s removal list;
- `tests/runs.test.ts`: a `describe` per scenario after the `adoption-feedback.yaml` one, reusing
  the helpers there (`feedbackScenario`, `stepsOf`, `fieldsOn`, `assertCloses`, `ITEM_ROUTE`,
  `INGEST`, `REVIEW`, `ADOPTION_REMOVE`), and the pack's default inbox path read from its
  `pack.yaml`.

**Order and red (dl-018):** the guard tests first, run before the two scenario files exist (a
read error), the red run's command and failing count recorded; then the scenarios; then
`npm run check:runs` and the count.

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
- 2026-11-24: red (dl-018, `23bfc97c`): `node --test --test-name-pattern=task-105
  dist/tests/runs.test.js` before the two scenario files existed, 7 tests, 6 failing (a read
  error); the seventh, on the channel's text, passed, since task-104 shipped the channel.
- 2026-11-24: build (`4e0a76ad`): the two scenarios; the guards 7 of 7. `npm run check:runs` 92
  runs, 0 failed (84 → 92: `route-upstream-wingfoil-defaults` and `-with-software`, `adopt:Scrum`
  and `adopt:Kanban` on `with-software`, each on 0.3.0 and 0.3.2); the full suite 1504 tests, 0
  failing (1497 + 7); no count test moved. Nothing under `src/`, `.wingfoil/`, `presets/`, `packs/`
  or `tests/fixtures/examples/` changed.
- 2026-11-24: build review (dl-017, `652da57d`): approve after amendments; no blocker, one
  should-fix (each note's `## Observed` now holds its evidence line, command, output, version
  and commit, as the channel asks, in place of a false pointer to the item's context) and two
  nits (the guard maps the kind through the channel's table, `KIND_MAP`, and asserts the
  evidence line; a route on every README example folder), all applied in `d8c3a4cc`. Guards 7 of 7,
  `npm run check:runs` 92 runs, 0 failed, after the fixes. No re-review: the fixes tighten the
  fixture's text and the guards, no criterion changes.
- 2026-11-24: dl-039's checks (R2), after the build review and its amendments, on the frozen head
  `36b8a566` (the code frozen at `d8c3a4cc`, the later commit documentation only): branch CI
  (`ci.yml`) run 45451729569 `success`, its jobs (22.12.0, 1) 10 min 52 s, (22.21.0, 1) 16 min
  50 s, (22.12.0, 2) 8 min 54 s, (22.21.0, 2) 5 min 49 s, none over 25 minutes, the step "Texts,
  the lines this branch adds" `success`; locally on Node.js 22.21.0, from a clean working tree
  after `npm ci` and `npm run build`: `npm run validate:publication` exit 0 (32 runs, 0 failed,
  `tolerance applied: none`), the golden tree in publication mode exit 0 (26 runs, 0 failed) and
  `npm run -s wingfoil -- workflow list` exit 0. The privacy check of the branch's diff is clean
  (`repository-practice` rule 2). This note is documentation only: no new run.
- 2026-11-24: delivered: the approver's OK, the `--no-ff` merge into `main` (`641d279a`), the push
  by the approver; `main`'s CI run 45477886787 `success`, its jobs (22.12.0, 1) 17 min 6 s,
  (22.21.0, 1) 10 min 42 s, (22.12.0, 2) 8 min 1 s, (22.21.0, 2) 5 min 37 s, the step "Texts, the
  lines this push adds to main" `success`; the branch and its worktree removed. `approved → done`.
