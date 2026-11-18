---
id: task-097-the-feedback-exit-overlay-the-feedback-scenarios-and-the-fixture-upstream-pack-plan-076-task-097
type: task
title: "The feedback-exit overlay, the feedback scenarios and the fixture upstream pack (plan-076 task-097)"
status: approved
pack: "pack-governance-feedback"
depends_on: ["task-095", "task-096"]
tags: ["packs","feedback","governance"]
---

## Context

plan-076 (`pack-cycle › author` of `pack-governance-feedback`), point 4 and its ruling. This task
writes what the charter's exit criterion (dl-032 E4) and FA-1, FA-6 [V] and FA-8 [V] ask of the
tree and of `check:runs`:
- the exit overlay `tests/fixtures/feedback-exit/`, with its compositions and fixture packs;
- the scenarios `feedback.yaml`, `feedback-upstream.yaml` and `adoption-feedback.yaml`;
- the CI step and the guard tests that pin them.

It builds on task-095 (the route steps of `check:runs`, its `only:` filter and its `overlay:` key)
and task-096 (the pack and its three README examples). It is a developer change under `tests/` and
`.github/` inside a pack task, as task-068's was.

The fixture upstream pack `governance/feedback-upstream` comes from the untracked draft under
`tests/fixtures/feedback-draft/`, and is reviewed here as new content: the draft's README describes
another pack, its CHANGELOG says only "Draft.", and its channel directive does not yet say what
spec-003 §5.1 asks. The draft stays untracked; plan-076 step 3 deletes it after this task's merge.

task-098 (the fixture projects and the bindings, FA-8's note asserts on the fixture's file among
them) and task-099 (the run by hand) build on this task.

## Acceptance

1. **The compositions of `tests/fixtures/feedback-exit/compositions/`**, eight, each with
   fictional values and `.example` addresses, and each composing `governance/feedback@^1`:
   - **task-049's four sets**, their parameters as `kanban-exit` has them, on the two published
     methodologies (FA-1):
     - `defaults` and `release-folders` with `software@^1` and `methodology/scrum@^1`;
     - `flat-releases` and `release-folders-lean` with `software@^1` and `methodology/kanban@^1`
       (`flat-releases` keeps `kanban-exit`'s `wip_in_progress` and `wip_in_review`);
   - `alone`: `base@^2` and the pack, without `software`;
   - `team-mode`: `software@^1`, `methodology/scrum@^1`, the pack and the fixture
     `team-mode/agent-first`;
   - `blueprint`: `software@^1`, `methodology/kanban@^1`, the pack and the fixture blueprint;
   - `upstream`: `software@^1`, `methodology/kanban@^1`, the pack and
     `governance/feedback-upstream@^1`, with `upstream:plover-vendor` added to `feedback_targets`
     (spec-003 §5.3).
2. **The fixture packs of `tests/fixtures/feedback-exit/packs/`**, each stating in its
   `description` that it is a test fixture, never published, with a `README.md` following
   spec-002 §2 and a `CHANGELOG.md` of its own, and no text left from another pack:
   - `team-mode/agent-first` and a `blueprint/fixture`, each requiring `base@^2`, standing in for
     the packs W11 and W12 publish (FA-1);
   - `governance/feedback-upstream`, requiring `base@^2` and `governance/feedback@^1`. Its channel
     directive `plover-vendor-channel`, tagged `feedback-channel` and bound to `facilitator`,
     holds what spec-003 §5.1 asks:
     - the line ``Serves the target `upstream:plover-vendor`.``, on its own;
     - where a note is written: `docs/upstream/plover/<feedback id>.md`, one file per item;
     - the note's format, dl-163's subset:
       - the six frontmatter fields, in this order: `id`, `title`, `kind` (`defect`, `gap` or
         `request`), `status` (`open`, `needs-info`, `captured`, `resolved`, `declined` or
         `duplicate`), `wingfoil_version` (a version) and `answered_by` (a list of ids);
       - the sections `## Observed` and `## Expected`, and no `## Replies`;
     - the mapping of kinds: `defect`, `gap` and `request` one to one, `observation` becoming
       `request`;
     - that the note cites the feedback id in its body.
3. **The validation.** `npm run validate -- --overlay tests/fixtures/feedback-exit` exits 0 with
   every composition composed twice, no warning, no failed run and `tolerance applied: none`, on
   each selected release:
   - a CI step runs it after `kanban-exit`'s and before `check:runs`, on the same condition;
   - `tests/ci-workflow.test.ts` pins the step, its condition and its order;
   - a case of `tests/validate-2-run.test.ts` pins the eight compositions and the totals, which
     the task measures (expected: 22 compositions and 44 runs);
   - WingFoil 0.3.1, which the matrix does not select, is read by hand on the eight compositions,
     as task-096's criterion 9 did: `workflow list`, `dna show` and `directives list`, each exit 0
     with no diagnostic, the commands and results recorded in the Execution Notes.
4. **`tests/fixtures/runs/feedback.yaml`**, with `compositions: tests/fixtures/examples/feedback`,
   on every selected release:
   - **The starts:** `feedback-ingest` and `feedback-review` on each of the three examples, and
     `feedback-bug-route` only on `with-software` and `added-outcome` (`only:`).
   - **The routes**, each a named run whose item is captured through `feedback-ingest`, submitted,
     approved, routed, and closed by a `submit` from `triaged` to `closed`, with `resulting`
     written and the routed element citing the item (`route-declined` routes to no element: its
     `resulting` holds the reason):

     | Run | Composition | Outcome | Routed to |
     |---|---|---|---|
     | `route-decision-log` | `added-outcome` | `decision-log` | a decision-log through `decision-log-ingest` |
     | `route-task` | `added-outcome` | `task` | a `task` in `draft`, added outside the step |
     | `route-declined` | `added-outcome` | `declined` | `resulting` reading `n/a — <reason>` |
     | `route-added-outcome` | `added-outcome` | `deferred` | a decision-log naming the outcome |
     | `route-bug` | `with-software` | `bug` | a bug through `bug-ingest`, closed by `feedback-bug-route` |
     | `route-would-be-bug` | `defaults` | `decision-log` | a decision-log naming the would-be bug, which the item's body names too |

     `duplicate` shares `declined`'s row of the routing table and is driven by hand in task-099, as
     are `decision-log` through `governance-evolution` and the routes plan-076 point 6 lists.
5. **`tests/fixtures/runs/feedback-upstream.yaml`**, with `overlay: tests/fixtures/feedback-exit`,
   its compositions folder that overlay's and `only: [upstream]` on its run: the route
   `route-upstream-note`, outcome `upstream-note` and target `upstream:plover-vendor`, driven to
   `closed`. The note is written at the path the channel directive states, in the format it
   states, its body citing the item's id, and `resulting` names that path.
6. **`tests/fixtures/runs/adoption-feedback.yaml`**, prepared for `first-release` (dl-032 E3) as
   `adoption-kanban.yaml` was: one adopt run per `init` template (`Scrum`, `Kanban`), with bug-007's
   removal list, `only: [with-software, added-outcome]`, since an `init` template writes a software
   project. It runs in CI from this task on.
7. **The empty frontiers.** Before the scenarios are written, the Design records a probe on WingFoil
   0.3.0 and 0.3.2: what `workflow start` of `feedback-review` and of `feedback-bug-route` does on a
   repository with no triaged item, and which steps the scenarios need because of it. A start that
   no scenario can express goes to the approver (criterion 11).
8. **The guard tests** in `tests/runs.test.ts`, as the other scenarios have them:
   - `feedback.yaml`: its compositions folder, the three mains, the filter on `feedback-bug-route`
     and, for each row of criterion 4's table, its name, its `only:`, the outcome written, the mains
     of its chain, the `resulting` written and the routed element's citation of `$item.id`
     (for `route-declined`, `n/a — <reason>` in `resulting` and no citation). WingFoil checks
     neither `resulting` nor the citation, so a run passes without them;
   - `feedback-upstream.yaml`: its overlay, its filter, the run's name, the mains of its chain, the
     outcome and the target written, `resulting` equal to the note's path, and the note: its path
     equal to the one the channel directive states, its body citing `$item.id`, and its text
     passing `assertFields` and `assertSections` of `tests/support/inbox.ts`;
   - the channel directive, which the lint reads only in the tree's own packs: the tag
     `feedback-channel`, the "Serves the target" line, the `facilitator` binding, and the pack's
     `requires` naming `governance/feedback@^1`;
   - `adoption-feedback.yaml`: the two templates, the removal list and the filter.

   Red first (dl-018): the tests of criteria 3 and 8 run before the overlay, the CI step and the
   scenarios exist, and fail. The red run's command and failing count are recorded.
9. **The runs.** `npm run check:runs` exits 0 on every selected release, its number of runs stated
   before and after (expected growth: 19 per release: 8 starts, 7 routes, 4 adoptions). The task
   measures the final number.
10. **What does not change:** no file under `src/`, `packs/` or `.wingfoil/`; `catalog.yaml`,
    `CATALOG.md`, `catalog-index.json` and `llms.txt`. The overlays `software-exit`, `scrum-exit`
    and `kanban-exit` and the golden tree pass with 0 failed. Any other count that moves is named
    with the test it changes. `intake.yml`'s `verify` job and `src/intake-report.ts`'s `CHECK_IDS`
    keep their list without `feedback-exit`: the owed row "`feedback-exit` in the intake's `verify`
    job" holds it until the pack's `first-release`.
11. **A criterion that cannot hold as written**, a defect of the pack or a step `check:runs` lacks
    goes to the approver when found (dl-019), and the work on it waits.
12. **Checks** (`kanban-delivery` › `review`, dl-039):
    - first, the build review and its amendments;
    - then, once, on the frozen commit: the branch CI `success`, its run id and every job's
      duration recorded (a job over 25 minutes goes to the approver, R3);
    - dl-039's local list on Node.js 22.21.0, from a clean working tree after `npm ci` and
      `npm run build`: `npm run validate:publication`, the golden tree in publication mode and
      `npm run -s wingfoil -- workflow list`, each exit 0.
13. **Delivery:**
    - the branch `task/task-097-feedback-exit` from `main`, in a worktree of its own;
    - the untracked draft is never staged;
    - after `approve`, a `--no-ff` merge on the approver's OK, `main` pushed, its CI read, and
      `approved → done`;
    - the privacy check of the branch's diff recorded (`repository-practice` rule 2).

## Design

Branch `task/task-097-feedback-exit` from `main` at `8f68c465`, in a worktree of its own.

- **The empty frontiers (criterion 7), probed on WingFoil 0.3.0 and 0.3.2** on `with-software`'s
  composition, committed, with no feedback item. `workflow start` of `feedback-review` and of
  `feedback-bug-route` exits 0 with the plan `active` and no next step; `workflow next` exits 0
  with `complete: true` and no diagnostic; `workflow end` exits 0. So a bare `steps: [start]` is
  enough, as the other scenarios' starts are, and no scenario needs a step for it.
- **The overlay** (`tests/fixtures/feedback-exit/`):
  - the four sets copy `kanban-exit`'s parameters, with `governance/feedback@^1` added and
    `methodology/scrum@^1` on `defaults` and `release-folders`;
  - `alone`, `team-mode`, `blueprint` and `upstream` use fictional projects of their own;
  - `team-mode/agent-first` and `blueprint/fixture` are the smallest packs the lint accepts, with
    no contents: FA-1 asks that the pack composes beside those axes;
  - `governance/feedback-upstream` comes from the draft: `pack.yaml` and `fragments/roles.yaml`
    with the description rewritten, and the channel directive, `README.md` and `CHANGELOG.md`
    written again.
- **The scenarios:**
  - each route is a `chain` named after criterion 4's table: `feedback-ingest` captures, submits
    and approves the item, the target is added by its own main or outside the step, and the
    reviewing main writes `resulting`, finalizes the route step and closes the item;
  - `feedback.yaml` and `feedback-upstream.yaml` give every field the `feedback` type requires;
  - the note of `route-upstream-note` holds dl-163's six fields and two sections, its body citing
    `$item.id`.
- **The guard tests** read each scenario with `yaml` and pin criterion 8's facts per run. The
  upstream note is parsed from the scenario's text into a `Note`, and `assertFields` and
  `assertSections` run on it.
- **Commits:** the tests (red); the overlay; the scenarios; the CI step; the notes.
- **Checks, in order:** the new tests; `validate --overlay` on `feedback-exit` and on the three
  other overlays; the golden tree; `check:runs`, before and after; 0.3.1 by hand; lint; `npm test`.

## Execution Notes

- 2026-11-18, **the red run** (dl-018), on `6d69139d`, before the overlay, the CI step and the
  scenarios existed: `node --test dist/tests/runs.test.js dist/tests/ci-workflow.test.js` gave 14
  failing of 102, and `node --test --test-name-pattern='fixture packs'
  dist/tests/validate-2-run.test.js` 1 failing of 1. Seven of the guards then failed for a defect of
  their own helper, which read a step kind a step did not have; the helper was fixed in the build
  commit.
- 2026-11-18, **the empty frontiers** (criterion 7): the probe is in the Design. A first attempt
  named a repository that did not exist, so its commands ran in this task's worktree: WingFoil
  refused each one on that configuration's own errors, and nothing changed.
- 2026-11-18, **the counts:**
  - `validate --overlay tests/fixtures/feedback-exit`: 22 compositions, 44 runs, 0 failed,
    `tolerance applied: none`, pinned in `tests/validate-2-run.test.ts`;
  - `check:runs`: 46 runs before, 84 after, 0 failed: 19 more per selected release (8 starts, 7
    routes, 4 adoptions);
  - no other count moved.
- 2026-11-18, **WingFoil 0.3.1** (criterion 3), which the matrix does not select: each of the eight
  compositions composed on a copy of the tree holding the overlay's packs, committed, then
  `workflow list`, `dna show` and `directives list` with `--format json`: every command exit 0, no
  diagnostic, no warning, nothing on stderr.
- 2026-11-18, **the build review** (dl-017): approve after amendments; no blocker, seven should-fix
  and two nits, all applied. The mutations that survived its guards are now pinned.
  - **Scenarios:** `route-declined` writes its reason in the body too; `route-added-outcome` and
    `route-would-be-bug` go through `decision-log-ingest`, as the `feedback` directive's routes say.
  - **Guards:** per row, the routed element's type, its step, what it names, and what is submitted
    and approved; `route-declined` adds no element; the composition allows the upstream target;
    the note's kind; the channel directive's kinds, citation and format lines.
  - **The fixture's README** says to add `upstream:plover-vendor` to `feedback_targets`.
- 2026-11-18, **the re-review of the build**: approve after amendments; one should-fix and two
  nits, all applied. The guard now pins the channel directive's whole statement of the note, each
  line of which a mutation could drop unnoticed. **A deviation from the Design:** the overlay, the
  scenarios and the CI step went into one build commit, not three.
- 2026-11-18, **the privacy check** of the branch's diff (`repository-practice` rule 2): no local or
  scratch path, no private project, no session.
- 2026-11-18, **dl-039's checks**, once, on the frozen commit `a43224ad`:
  - **the branch CI**, run 44274431167, `success`: jobs `validate (22.12.0, 1)` 16 min 46 s,
    `(22.12.0, 2)` 7 min 28 s, `(22.21.0, 1)` 12 min 40 s, `(22.21.0, 2)` 6 min 14 s; none over 25
    minutes;
  - **the local list** on Node.js 22.21.0, from a clean working tree after `npm ci` and
    `npm run build`: `npm run validate:publication` (28 runs, 0 failed, `tolerance applied: none`),
    the golden tree in publication mode (26 runs, 0 failed, `tolerance applied: none`) and
    `npm run -s wingfoil -- workflow list`, each exit 0; `directives list` with no warning;
    `npm test` 1394 passed, 0 failed; the lint exit 0; `check:runs` 84 runs, 0 failed.
