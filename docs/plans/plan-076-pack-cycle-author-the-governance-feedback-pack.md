---
id: plan-076-pack-cycle-author-the-governance-feedback-pack
type: plan
title: "pack-cycle author: the governance/feedback pack"
status: active
workflow: "pack-cycle"
phase: "author"
tags: ["packs","feedback","governance","W10"]
---

## Context

This plan runs the `author` phase of `pack-cycle` (v7) for `pack-governance-feedback`. The
charter was accepted under plan-073. The `design` phase (plan-074) produced spec-003, which is
approved. plan-075 delivered the tooling that both rows of `docs/owed-items.md` due "before
`governance/feedback`'s first `author` task" asked for. The approver asked for this plan on
2026-11-17, after plan-075's close.

This plan writes `packs/governance/feedback` from three sources: the charter, spec-003 and the
untracked draft that plan-073 step 2 and plan-074 step 2 ran on the engine. It also writes the
README examples, the exit criterion's compositions and scenarios (dl-032 E4), the fixture
projects that the charter's [E] criteria need, and the run by hand that the exit criterion asks
for. Later plans own:
- publication (`first-release`);
- `governance/wingfoil-dogfood`;
- the next minor releases of `base` and `software`, which bring `reported_by`;
- this repository's adoption.

**Preconditions, met.**
- **The charter** is `accepted` on `main`. Its Execution Note of plan-074 points each Open point
  to spec-003 and records that `pack.yaml` moves to format 2 (spec-003 §9).
- **spec-003** is `approved`, and spec-001's and `pack-authoring`'s fold-back is merged
  (plan-074).
- **The tooling of spec-003 §11** is on `main` (plan-075):
  - list parameters, the item rule, the placement rule, `entry-directive-scope` and the
    `feedback-channel` checks, in the composer and the lint (task-093);
  - the generic fixture-element checks in `tests/support/fixture-elements.ts` (task-094).

  Every published pack passes them unchanged.
- **The packs it composes with** are published: `base` 2.0.1, `software` 1.0.0,
  `methodology/scrum` 1.0.0 and `methodology/kanban` 1.0.0.
- **The draft** passed `validate --overlay` on WingFoil 0.3.0 and 0.3.2 (plan-074 step 2:
  15 compositions, 30 runs, tolerance none). It was then driven on 0.3.2 through three routes to
  `closed`: an added outcome (`deferred`) to its decision-log fallback, `upstream-note` through
  a fixture channel, and `bug` with `software` through `bug-ingest`; plan-074 left `task` on
  the frontier. plan-073 had driven, on its format-1 draft, `decision-log` (the target added
  outside the step), `task`, `declined`, `duplicate`, `bug` with `software` through
  `bug-ingest`, and the would-be `bug` without `software`. Driven by neither: `decision-log`
  through `decision-log-ingest` or `governance-evolution`. It sits untracked under
  `tests/fixtures/feedback-draft/`, as a reference only. It holds:
  - the pack at format 2, with the three list parameters;
  - a fixture upstream pack, `governance/feedback-upstream`;
  - four compositions: `alone`, `kanban`, `scrum` and `upstream`.

**The tech-specs this wave builds on** (dl-020): spec-001, spec-002 and spec-003, all on `main`.
No erratum is waiting to be folded back.

**`main`'s CI before this plan** (dl-038 C3): run 44089866197 on `c770844e` (plan-075's close
and submit), `success`.

**Reads made for this outline** (2026-11-17, `main` at `c770844e`):
- **`compat.yaml`** lists 0.2.2 … 0.3.2. The pack requires `workflow-engine`, so its matrix is
  0.3.0, 0.3.1 and 0.3.2: the oldest release is 0.3.0, the newest 0.3.2.
- **`check:runs`** (`src/runs.ts`) has these step kinds: `start`, `end`, `next`, `finalize`,
  `commit_inside`, `commit_copy`, `add`, `submit` and `approve`. It has one main per scenario
  run and one scratch repository per run. Every run of a scenario is made on every
  composition of its one `compositions` folder. `add` always names the run's step, and
  `submit` and `approve` act on the last element added. No step writes an element's field, or
  given text at a given path. It has no overlay: it resolves only the tree's own
  `catalog.yaml` and `packs/` (`src/resolve.ts`).
  - A `feedback` item's `submit` needs `kind`, `target`, `source` and `context`, and its routing
    needs `outcome`. So today `check:runs` can start each main, but cannot capture an item past
    `draft` or drive a route.
  - The charter asks for both things. Its exit criterion asks for scenarios *starting* every
    main. FA-6 [V] reads "`check:runs` drives each route".
  - The owed row "`check:runs` scenarios of the full scrum and kanban runs" (trigger: the next
    tooling task on `runs.ts`) asks for a rewritten field among other step kinds.
- **The exit overlays** `software-exit`, `scrum-exit` and `kanban-exit` each hold the four sets of
  task-049. Each has a CI step in the job before `check:runs`. Fixture packs exist for:
  - a methodology (`software-exit/packs/methodology/fixture`);
  - `team-mode/agent-first` (`tests/fixtures/merge/`, for the merge tests only).

  No fixture blueprint pack exists.
- **The CI**: the longest job of task-094's `main` run (44076357546) took 14 m 9 s, against a
  30-minute timeout and dl-039 R3's 25-minute line.

## Proposed outline (ruled by the approver before `submit`)

Each point has a recommendation.

1. **`base@^2` and `software@^1` as they are.** *Recommended:* yes.
   - The routed elements cite the item in their body until `base` and `software` ship
     `reported_by` (spec-003 §8). That shipping is the owed row "The packs' Memory templates"
     (trigger: their next minor release), not this plan.
   - The fixture-element checks read the back-reference through the field where the template
     has it, and through the body otherwise.
   - *Alternative:* a minor release of `base` and `software` first. That would be a pack release
     round of its own, and it would delay this pack.

2. **A tooling task first, for the routes in `check:runs`** (FA-6 [V]). *Recommended:* task-095,
   through `tooling-delivery` v4 with `pack: ""`, before the pack's tasks, as task-066 was under
   plan-057. A route touches up to three mains and two elements: the item, added by
   `feedback-ingest`; the target, added outside a step (a decision-log, a task) or by its own
   main (`bug-ingest` for a bug); and, for `upstream-note`, a note file. So `src/runs.ts` gains:
   - **several mains in sequence** in one run's scratch repository, each with its own
     `start` … `end` (for `bug`: `feedback-ingest`, then `bug-ingest`, then
     `feedback-bug-route`);
   - **an element label:** `add` sets a label, and the field write, `submit` and `approve`
     name the element by its label, not only the last one added;
   - **`add` with no step**, for a target the charter adds outside a step;
   - **a field write:** frontmatter fields of a labelled element (the item's `kind`, `target`,
     `source`, `context`, `outcome`, `resulting`), and a body line, committed;
   - **a file write:** a file with given text at a path inside the repository, committed (the
     upstream note);
   - **a per-run composition filter** (`only: [<composition>, …]`), on main runs and adopt runs
     alike, so a run is made only on the compositions that hold what it needs
     (`feedback-bug-route` only where `software` is composed);
   - **a labelled element's id at run time** (`<label>.id`) in a field value, a body line, a
     file's text and the step keys of `next` and `finalize` (`feedback-item.route@<id>`), so
     `resulting` names the target, the target cites the item, and the note cites the item;
   - **an overlay** (a scenario key `overlay: <dir>`), resolved on the merged tree as
     `validate --overlay` does (task-046), so a scenario can compose a fixture pack (the
     upstream one).

   Red first (dl-018): a test of each new step kind on the stub, and the guard tests of
   `tests/runs.test.ts`. The row of the full scrum and kanban runs meets its trigger: task-095
   also takes its `include:` null-branch test, and the row is narrowed at close to `memory
   park`, `memory reject`, `set_state` and an expected refusal, the field write settled.

   *Alternative:* `check:runs` only starts the three mains, as the exit criterion's own sentence
   reads, and the routes are driven by the run by hand alone. That reads FA-6 [V] below its text
   and needs the approver's reading recorded on the charter (dl-020).

3. **task-096, the pack and its README examples** (`kanban-delivery`,
   `pack: pack-governance-feedback`).
   - **Sources.** `packs/governance/feedback` comes from the draft, which was run on the engine,
     and from the charter and spec-003.
   - **What is fixed here:**
     - `pack.yaml` format 2: the five parameters and the entry `with: software@^1`;
       `requires: [base@^2]`; `requires_capabilities: [workflow-engine]`;
     - the `feedback` directive:
       - the value lists named by their parameters;
       - §4.3's triage rule, with the would-be `bug` exception;
       - the routing table, without `bug`;
       - the `feedback-route` reading duty (§7.2 path 1);
       - the `feedback-channel` lookup and its fallback (§5.1);
       - the body citation until `reported_by` exists (§8);
       - the trace both ways; who closes an item; how `feedback-review` is started and ended;
     - from the draft: `fragments/memory.yaml` and `memory-templates/feedback.md` (the four
       required fields); `fragments/roles.yaml` (`facilitator: [feedback]`); the five
       workflows, `feedback-review`'s `where` reading `outcome: [{{feedback_outcomes}}]` and
       `feedback-bug-route`'s `outcome: [bug]`;
     - `feedback-bug-route`, tagged `feedback-route`, and named in `feedback-bug-item` › `bug` as
       `'agent.execute(directive: feedback-bug-route)'`;
     - `agents/section.md` (`## Feedback`), naming the entry's directive as present only with
       `software` (§7.2 path 3);
     - the README after spec-002 §2: "Sources and adaptations" with the charter's four
       adaptations; the adoption procedure, a project's own `feedback` type or same-named
       workflow or directive renamed or mapped first (charter Adoption, F6.1); and the
       procedure to add `upstream:<name>` (§5.3);
     - `CHANGELOG.md`.
   - **The examples** (spec-002 §2.4: fictional projects, `.example` addresses) go under
     `tests/fixtures/examples/feedback/`. *Recommended:* three examples:
     - `defaults`: `base` and the pack alone, every parameter on its default;
     - `with-software`: `software` and `methodology/scrum`, so the `bug` route is present;
     - `added-outcome`: `software` and `methodology/kanban`, with their own `feedback_path` and
       `feedback_id`, and `deferred` added to `feedback_outcomes`. This is FA-2's second
       parameter set.

     Each example gives its `Fixture:` line, a situation, what the project gets, and how one
     phase runs.
   - **The counts** that the tooling tests take on this repository move (lint files, index
     packs, `validate` compositions and runs, the exit overlays, the publication run). Each is
     stated as task-067 stated them (dl-018). The task measures the final numbers.
   - **The tests of point 8's [V] rows** (a developer change under `tests/` inside a pack task,
     as task-068's): the four fields in the composed type's `template.frontmatter.required`
     (FA-3); `pending: { reject: draft }` and the triage phase's approval by the approver
     (FA-4); the `feedback` directive's routing table naming only `base`'s workflows (FA-6).
     Red first where dl-018 asks.
   - **What does not change:** no file under `src/` or `.wingfoil/`. The other packs' READMEs
     do not change, since their examples compose no `feedback`.

4. **task-097, the exit criterion's compositions and scenarios** (`kanban-delivery`; a developer
   change under `tests/` and `.github/` inside a pack task, as task-068 was).
   - **The overlay** `tests/fixtures/feedback-exit/` holds:
     - the four sets of task-049 (`defaults`, `flat-releases`, `release-folders`,
       `release-folders-lean`), each with `governance/feedback@^1`: two with
       `methodology/scrum` and two with `methodology/kanban`, so each published methodology
       composes with the pack (FA-1);
     - `alone` (`base` and the pack);
     - FA-1's fixture packs: a `team-mode/agent-first` pack and a blueprint pack, both
       fixtures until W11 and W12 publish them, each in a composition with the pack;
     - the fixture upstream pack `governance/feedback-upstream`, moved from the draft and
       reviewed as new content, in a composition adding `upstream:<name>` to
       `feedback_targets` (FA-8, §5.3).
   - **The validation.** `npm run validate -- --overlay tests/fixtures/feedback-exit` gives no
     failed run and no warning (`tolerance applied: none`). It gets a CI step after
     `kanban-exit`'s. `tests/ci-workflow.test.ts` and a case of the `validate` tests pin its
     counts, red first.
   - **`tests/fixtures/runs/feedback.yaml`**, on the README examples, on every selected
     release, as `kanban.yaml` does:
     - starts of `feedback-ingest` and `feedback-review` on every example, and of
       `feedback-bug-route` only on the examples that compose `software` (task-095's filter);
     - with task-095's steps, each route driven to `closed`: `decision-log`, `task`,
       `declined` and the added outcome on `added-outcome`; `bug` on `with-software`; the
       would-be `bug`, proposed as `decision-log` naming it, on `defaults`.
   - **`tests/fixtures/runs/feedback-upstream.yaml`**, with `overlay:
     tests/fixtures/feedback-exit`, on its compositions filtered to the upstream one: the
     `upstream-note` route to `closed`, the note written where the fixture channel says.
   - The guard tests of `tests/runs.test.ts` are extended, red first. `check:runs` grows by
     about 19 runs per selected release (8 starts, 7 routes, 4 adoptions); the task measures
     the final number.
   - **The adoption run, prepared.** dl-032 E3 belongs to `first-release`, and the charter says
     `author` prepares it. *Recommended:* this task adds
     `tests/fixtures/runs/adoption-feedback.yaml` with its guard test, as
     `adoption-kanban.yaml` did, once per `init` template, on the examples that compose
     `software`, through the filter (an `init` template writes a software project). It runs
     in CI from this task on.
   - **Empty frontiers.** A start of `feedback-review` or `feedback-bug-route` on a fresh
     repository has an empty frontier, and `start` requires the plan `active`: task-097's
     Design probes it on 0.3.0 and 0.3.2 before the scenarios are written.
   - **Durations.** The task records the CI jobs' durations. A job over 25 minutes goes to the
     approver (dl-039 R3).

5. **task-098, the fixture projects and the fixture-element bindings** (`kanban-delivery`; FA-3
   … FA-8 [E]; the owed row "The bindings of the fixture-element checks to
   `governance/feedback`").
   - **The fixture projects** sit under `tests/fixtures/feedback-elements/`, composed from the
     examples and from `feedback-exit`'s upstream composition, with Memory elements written by
     hand. The test copies each into a scratch git repository (`tests/support/git-repo.ts`,
     fixed identity) and commits it, so a commit reference resolves; a `context` or
     a citation naming a commit takes the hash the test reads after that commit. A fixture
     holds:
     - valid items in each state;
     - one invalid item per criterion: a missing required field (FA-3), a value outside the
       lists (FA-4), an unresolved `context` (FA-5), and a `closed` item without `resulting`
       or without a back-reference (FA-6);
     - FA-7's two paths: feedback → `governance-evolution`'s decision-log citing it → a
       `custom/` change whose commit cites the decision-log; and feedback → bug, with
       `software`, or → a decision-log naming the would-be bug, without it;
     - FA-8's upstream note, checked by the existing asserts of `tests/support/inbox.ts` that
       belong to dl-163, `assertFields` and `assertSections` (which refuses `## Replies`), on
       a `Note` built from the fixture's file; `assertOpenings` is this repository's opening,
       not dl-163's, and the inbox's numbering and ledger do not apply. The note's citation of
       the item is the back-reference check's.
   - **The bindings** use `tests/support/fixture-elements.ts`:
     - the type's required fields;
     - `kind` → `feedback_kinds`, `target` → `feedback_targets`, and `outcome` →
       `feedback_outcomes`, plus the entry's `bug` only where `software` is composed;
     - `context`'s reference kinds, split on `,`, mode `every`: each reference resolves, and
       at least one is required by the field's presence; *alternative:* mode `some`, as
       FA-5's "at least one … that resolves" reads literally, which lets an unresolved second
       reference pass;
     - `resulting` and the back-reference, through `reported_by` or the body;
     - `outcome` and `resulting` on `closed`;
     - `bug` refused in a preset's or an example's `feedback_outcomes`.

     The row moves to Closed with them.
   - **FA-5 and a commit.** The charter's Ships lists "a commit" among `context`'s references.
     So does spec-003 §4.4. FA-5 lists only "an existing element id, a declared workflow and
     phase, or a version".
     *Recommended:* a commit counts, resolving through the helper's `commit` kind. This is the
     erratum the row names: until in-place amendment exists (G7, W10), it is recorded as an
     Execution Note on the charter citing the approver's ruling (dl-020), and the charter's
     text is unchanged. *Alternative:* FA-5 as written, so a `context` that holds a commit fails
     (under mode `every`, even beside a reference that resolves).

6. **task-099, the run by hand** (the charter's exit criterion, dl-032 E4). Two scratch
   repositories, each composed from `main` at a commit the notes name, with fictional values
   and `.wingfoil/` committed:
   - **with `software`:** `base`, `software`, `methodology/kanban`, the pack and the fixture
     upstream pack, composed with `--tree` on a copy of `main` with `feedback-exit`'s packs
     merged in, `feedback_outcomes` holding the added outcome: `decision-log` through
     `decision-log-ingest`, a governance change through `governance-evolution` (FA-7's
     governance path), `task`, `declined`, `duplicate`, an added outcome, `bug` through
     `bug-ingest`, and `upstream-note`;
   - **without `software`:** `base` and the pack: `decision-log`, `task`, and the would-be
     `bug` proposed as `decision-log` naming it.

   WingFoil 0.3.2, the newest release `compat.yaml` lists, drives both. The task's Execution
   Notes record the commands, the exit codes and the commits composed; nothing else is
   committed. *Recommended:* 0.3.2 only. 0.3.0 is covered by the matrix and by `check:runs`,
   and plan-074 found no difference. *Alternative:* the same runs on 0.3.0 too.

   A finding that the charter's shape does not hold goes to the approver when found (dl-019).
   A small defect of the pack is fixed in task-099; a larger one goes through this plan's gate.

7. **Order.** WIP 1, in the order task-095 → task-096 → task-097 → task-098 → task-099.
   - task-097 needs task-095 and task-096. task-098 and task-099 need task-097, which brings
     the fixture upstream pack into `feedback-exit` before the draft is deleted.
   - Each task is added on `main` once the one before is `done`, on its own `task/<id>-<slug>`
     branch, merged `--no-ff` on the approver's OK, with `main`'s CI read after each merge.

8. **Each criterion and its check:**

   | Criterion | Check | Task |
   |---|---|---|
   | FA-1 [V] | `feedback-exit` and the examples validate on every release; `requires`, `conflicts` read by the lint | 096, 097 |
   | FA-2 [V] | two parameter sets (`defaults`, `added-outcome`) compose and validate; the lint | 096 |
   | FA-3 [V] | the four fields in the composed type's `template.frontmatter.required`, a test | 096 |
   | FA-3, FA-4, FA-5 [E] | the fixture-element bindings | 098 |
   | FA-4 [V] | `pending: { reject: draft }` and the triage phase's approval by the approver, a test | 096 |
   | FA-6 [V] | the routing table names only `base`'s workflows (a test on the directive); `bug-ingest` only in the entry's files (the isolation lint); `check:runs` drives each route | 096, 097 |
   | FA-6 [E] | `resulting` and the back-reference on `closed` | 098 |
   | FA-7 [E] | the two paths in the fixtures | 098 |
   | FA-7 [A] | the approver, at task-098's `approve` | 098 |
   | FA-8 [V][E] | the upstream composition validates; the note's asserts | 097, 098 |
   | Exit criterion | the run by hand; `check:runs`; no warning on every release | 097, 099 |

## The approver's rulings

Given on 2026-11-17, in chat: the outline is approved as recommended. Points 1 … 8 stand as
written:
- `base@^2` and `software@^1` as they are (point 1);
- task-095 first, with point 2's step list (point 2);
- task-096 with the examples `defaults`, `with-software` and `added-outcome` (point 3);
- task-097 with two sets on `methodology/scrum` and two on `methodology/kanban`, and
  `adoption-feedback.yaml` written in this task (point 4);
- `context`'s mode `every`, split on `,`, and a commit counting for FA-5, recorded as an
  Execution Note on the charter (point 5);
- task-099 on WingFoil 0.3.2 only (point 6);
- the order task-095 → task-096 → task-097 → task-098 → task-099 (point 7).

## Steps

The plan document and the task bodies are committed on `main`: the plan as plan-075's was, and
the bodies as `memory add` and `submit` commit them. Each task's work happens on its own branch.
Before every commit, the privacy check (`repository-practice` rule 2). After every push to
`main`, its CI is read (rule 3).

1. **This plan:**
   - an independent review (dl-017), amended;
   - the outline ruled by the approver;
   - submitted (`draft → active`).
2. **Each task, in point 7's order:**
   - its body written from the rulings, reviewed independently, re-reviewed when a fix changes
     a decision, and submitted (`draft → pending`);
   - the approver accepts it into the backlog;
   - Design, red first where dl-018 asks, build, and an independent review of the build;
   - dl-039's checks in its order: the branch CI with every job's duration, and the local list
     on Node.js 22.21.0 from a clean tree;
   - `in-review`, then the approver's `approve` and merge OK;
   - a `--no-ff` merge into `main`, `main`'s CI read, and `approved → done`.
3. **After task-097's merge, the untracked draft** under `tests/fixtures/feedback-draft/` is
   deleted: with the pack in `packs/`, an overlay run on the draft would hold two
   `governance/feedback`. task-097 has moved the fixture upstream pack into `feedback-exit`.
4. **Close:**
   - **The account per tech-spec** (dl-020): spec-001, spec-002 and spec-003, with each erratum
     or reading recorded in the wave.
   - **The charter's Execution Notes:**
     - the pack written;
     - the exit criterion's results;
     - task-099's summary and the commit it composed;
     - the 0.3.0 coverage;
     - FA-5's reading;
     - format 2 (spec-003 §9) confirmed by the published `pack.yaml`.
   - **The owed rows:**
     - the bindings row moved to Closed by task-098;
     - the full-runs row narrowed by task-095;
     - any new row, written in the commit that records the note or ruling it comes from
       (rule 4).
   - **The privacy check** of each task branch's diff, recorded in its task, and of this plan's
     commits, recorded here.
   - **The plan** goes `active → done`.

**Not in this plan:**
- `first-release`: the publication, CB-1, CB-2 and CB-6 at the first tag, the citation of the
  adoption run, and its `prel`;
- `governance/wingfoil-dogfood` (F4.2), whose channel follows spec-003 §5;
- `reported_by` in `base`'s and `software`'s templates (S3-O4);
- this repository's adoption, its pin and its inbox sync (the rows with trigger W10);
- WingFoil's answers to F-050 and F-051.

**Ids**, agreed before this plan:
- plan-076;
- task-095 … task-099;
- dl-043, bug-017 and F-052, reserved for a ruling, a defect or a note this plan finds.

## Handoff

- **claude** drafts for the product-owner (this plan and the task bodies). It acts as
  pack-author of task-096 … task-099, and as developer of task-095 and of the changes under
  `src/`, `tests/` and `.github/`.
  - It never runs `memory approve` or `memory reject`: it hands the approver the command.
  - No pull request; files are staged by name.
  - The draft under `tests/fixtures/feedback-draft/` and the run logs under `.cache/` are never
    committed.
- **Reviewer:** an independent subagent for every element created and every build (dl-017).
- **The approver** rules:
  - this outline: points 1, 2 (the step list), 3 (the examples), 4 (the methodologies of
    the four sets, the adoption scenario), 5 (`context`'s mode, FA-5's reading), 6 (the
    release) and 7;
  - each task's backlog acceptance, its `approve` and its merge OK;
  - any finding that changes a point (dl-019).
- **Done when** all of these hold:
  - task-095 … task-099 are `done` on `main` (or the ones the rulings keep), and pushed;
  - `main`'s CI is `success`;
  - the charter's notes, the privacy checks and the owed rows are recorded.

## Execution Notes

- 2026-11-17: written as the approver asked on 2026-11-17, after plan-075's close. `workflow`,
  `phase` and `tags` were filled by editing the draft (W-02). `main` was at `c770844e`. Next
  free numbers when written: plan-077, spec-004, task-095, bug-017, dl-043, F-052.
- 2026-11-17: independent review (dl-017): approve after amendments; two blockers, nine
  should-fix, five nits, all applied.
  - **Blockers.** Point 2's steps could not drive a route: the target is added outside a step
    or by its own main, the close acts on the item rather than on the last element added, the
    `bug` route needs three mains, and the upstream note is a file. Point 2 now lists several
    mains in sequence, labelled elements, `add` with no step, a field write and a file write.
    A scenario runs on every composition of its folder, so point 2 adds a per-run composition
    filter, and point 4 starts `feedback-bug-route` only where `software` is composed, with
    the upstream route in a scenario of its own on `feedback-exit`.
  - **Should-fix.** The Context's account of plan-074's run corrected (three routes driven;
    `task`, `decision-log-ingest`, `governance-evolution` and the would-be `bug` not). Point 6
    has two compositions, with and without `software`, and drives those routes. task-098 and
    task-099 need task-097, for the fixture upstream pack. The full-runs row's `set_state`
    kept owed, and its null-branch test taken by task-095. `context`'s mode (`every`) and split
    recommended, and FA-5's reading named as the row's erratum, recorded as a note until G7.
    The fixture projects committed into a scratch git repository so a commit resolves. FA-8
    reuses `tests/support/inbox.ts`'s asserts. A trace of each criterion to its check (point
    8). One line over 100 characters.
  - **Nits.** Step keys built at run time; the draft's files listed in point 3; the four sets'
    methodologies, the adoption's compositions and the growth of `check:runs`; format 2
    "confirmed"; the draft's deletion as a step of its own, the upstream pack re-reviewed.

  Points 2, 4, 5 and 6 change: re-review.
- 2026-11-17: re-review: approve after amendments; one blocker, six should-fix, five nits, all
  applied. **Blocker:** `check:runs` has no overlay, so the upstream scenario could not
  compose the fixture pack: point 2 adds an `overlay:` key. **Should-fix:** the run count
  (7 routes, 4 adoptions, about 19 per release) and the filter on adopt runs; FA-8 without
  `assertOpenings`, which is this repository's opening; plan-073's routes in the Context;
  `kind` and `target` bound to their lists; point 8's [V] tests listed in point 3;
  a labelled element's id in field values, body lines and file text.
  **Nits:** "and dates" dropped; "no step writes given text at a given path"; point 6's
  `--tree` and added outcome; spec-003 §4.4 cited and the alternative's reach under `every`;
  the empty-frontier probe in task-097's Design. The fixes complete the ruled scope of points
  2, 4, 5 and 6 with no new decision: a final check of the fixes.
- 2026-11-17: final check of the re-review's fixes: approve after one should-fix and one nit,
  both applied. **Should-fix:** the Context's account of plan-073's run completed (it drove
  `decision-log`, `task`, `declined`, `duplicate`, `bug` with `software` and the would-be
  `bug` without it, each target added outside the step); only `decision-log-ingest` and
  `governance-evolution` were driven by neither plan. **Nit:** a ragged wrap in point 6.
  Wording only: no further review.
- 2026-11-17: the plan submitted by the agent on the approver's request in chat (`draft →
  active`, `5fe29262`); `main` pushed at `5fe29262` on the approver's request, `main`'s CI on
  `c770844e` (run 44089866197) `success` beforehand.
- 2026-11-17, step 2, task-095 (`check:runs` drives a route): body reviewed and re-reviewed,
  accepted into the backlog by the approver; built on its branch, the build review and its
  re-review applied; dl-039's checks on `9f830594` (branch CI 44113757047 `success`, no job over
  25 minutes; the local list green); approved by the approver and merged `--no-ff` at
  `ce0bf8c8` on his OK, `done` at `cf9d49dd`. The row of the full scrum and kanban runs
  narrowed (task-095's close). `main`'s CI on `cf9d49dd`, run 44117803750, `success`: jobs
  `validate (22.12.0, 1)` 9 min 9 s, `(22.12.0, 2)` 3 min 36 s, `(22.21.0, 1)` 8 min 45 s,
  `(22.21.0, 2)` 5 min 31 s.
- 2026-11-17, step 2, task-096 (the pack and its README examples): body reviewed and
  re-reviewed, accepted into the backlog by the approver; built on its branch (the pack, the
  three examples, the [V] tests of FA-1, FA-3, FA-4 and FA-6, the moved counts), the build
  review and its re-review applied; dl-039's checks on `c5078638` (branch CI 44128847928
  `success`, no job over 25 minutes; the local list green); approved by the approver and merged
  `--no-ff` at `c0e482e8` on his OK, `done` at `3526b4be`. Criterion 9's WingFoil 0.3.1, which
  the matrix does not select, was read by hand (the task's notes). `main`'s CI on `3526b4be`,
  run 44131227403, `success`: jobs `validate (22.12.0, 1)` 12 min 10 s, `(22.12.0, 2)` 5 min
  28 s, `(22.21.0, 1)` 11 min 32 s, `(22.21.0, 2)` 5 min 31 s.
- 2026-11-18, step 2, task-097 (the exit overlay and the scenarios): body reviewed, re-reviewed and
  checked, accepted into the backlog by the approver; built on its branch (`feedback-exit`'s eight
  compositions and three fixture packs, `feedback.yaml`, `feedback-upstream.yaml`,
  `adoption-feedback.yaml`, the CI step and the guards), the build review and its re-review
  applied; dl-039's checks on `a43224ad` (branch CI 44274431167 `success`, no job over 25 minutes;
  the local list green); approved by the approver and merged `--no-ff` at `77e0140d` on his OK,
  `done` at `1a96ca08`. `check:runs` went from 46 to 84 runs. WingFoil 0.3.1, which the matrix does
  not select, was read by hand (the task's notes). A new owed row holds `feedback-exit` out of the
  intake's `verify` job until the pack's `first-release`. `main`'s CI on `1a96ca08`, run
  44277583919, `success`: jobs `validate (22.12.0, 1)` 13 min 39 s, `(22.12.0, 2)` 7 min 26 s,
  `(22.21.0, 1)` 13 min 19 s, `(22.21.0, 2)` 9 min 15 s.
- 2026-11-18, step 3: the untracked draft under `tests/fixtures/feedback-draft/` deleted after
  task-097's merge.
