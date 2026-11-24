---
id: plan-086-pack-cycle-author-the-governance-wingfoil-dogfood-pack
type: plan
title: "pack-cycle author: the governance/wingfoil-dogfood pack"
status: draft
workflow: "pack-cycle"
phase: "author"
tags: ["packs","dogfood","governance","W10"]
---

## Context

The `author` phase of `pack-cycle` (v8) for `pack-governance-wingfoil-dogfood`, feature F4.2, W10's
next step in the sequencer 1.8 after the charter. The charter was accepted under plan-085 on
2026-11-24, with no `design` phase (plan-085 point 5): this plan writes
`packs/governance/wingfoil-dogfood` from the charter, dl-051 and this repository's custom
`wingfoil-cli` (1.6), with the README's examples as fixtures and the `check:runs` evidence the
charter's Acceptance asks for. Later plans own the first release (`first-release`, with dl-032
E3's adoption run this plan prepares), the pack release round and this repository's adoption.

**Preconditions, met.**
- **The charter** is `accepted` on `main` (`93a74b6f`), its Open points 1 … 3 left to this
  phase.
- **The packs it composes with** are published: `base` 2.0.1, `software` 1.0.0,
  `methodology/scrum` 1.0.0, `methodology/kanban` 1.0.0, `governance/feedback` 1.0.0.
- **The tooling** it needs is on `main`: spec-003 §11's `feedback-channel` checks in the lint
  (task-093); `check:runs` with chains of mains, labels, `set`, `write`, `only` and the
  `$<label>.id` substitution (task-095); the dl-163 asserts of `tests/support/inbox.ts`; the
  `adopt` runs (as `adoption-feedback.yaml`'s). No row of `docs/owed-items.md` is due before
  this pack's `author`.
- **`compat.yaml`** lists 0.2.2 … 0.3.2; `governance/feedback` requires `workflow-engine`, so
  the matrix of any composition holding this pack is 0.3.0, 0.3.1 and 0.3.2.

**The tech-specs this phase builds on** (dl-020): spec-001, spec-002 and spec-003, on `main`, no
erratum waiting.

**`main`'s CI before this plan** (`repository-practice` rule 3): the push of `52cc6bea`
(plan-085's close), read and recorded in the Execution Notes before `submit`.

**Reads made for this outline** (2026-11-24, `main` at `52cc6bea`):
- **The layout** (`src/layout-rules.ts`, spec-001 §6.1) requires `pack.yaml`, `README.md` and
  `CHANGELOG.md` in every pack directory, and the README rules (`src/readme-rules.ts`,
  `src/example-rules.ts`) judge the README's sections and its examples against
  `tests/fixtures/examples/<pack>/`. A pack directory merged without its README fails `npm run
  lint` on that branch.
- **The README rules** refuse a code span holding a WingFoil command (`readme-rules.ts`'s
  `COMMANDS`, spec-002 §2.3), the reason `wingfoil_command` has no default.
- **The stand-ins** (`src/preset-stand-ins.ts`) fill only `base`'s four required parameters,
  and only for presets; no preset holds this pack (WD-7), so every composition that holds it
  sets `wingfoil_command` itself. `publish:pack` composes the presets and the examples that hold
  the pack, and the pack has no conditional entry.
- **`check:runs`** resolves the tree's own `packs/`, so a scenario on the examples composes the
  real pack with no overlay, as `tests/fixtures/runs/feedback.yaml` did before
  `governance/feedback`'s publication. `feedback-upstream.yaml` is the model of the route:
  `feedback-ingest` › capture, `set`, `submit`, `approve`; then `feedback-review`, `write` of the
  note, `set` of `resulting`, `finalize`, `submit`. `tests/runs.test.ts` checks its note with
  `assertFields` and `assertSections`.
- **The CI**: the longest job of `main`'s run 45388134981 took 15 min 7 s, against a 30-minute
  timeout and dl-039 R3's 25-minute line.
- **The catalog**: `catalog.yaml` gains the pack only at its publication (`first-release`), as
  `governance/feedback`'s author tasks left it.

## Proposed outline (ruled by the approver before `submit`)

Each point has a recommendation.

1. **Two tasks, not the charter's four.** The charter's proposed tasks split the pack into the
   CLI directive, the channel, the scenario and the README; the layout and the README rules
   (Reads) make any pack task before the README's fail the branch's lint. *Recommended:*
   - **task-104, the pack** (`kanban-delivery`, `pack: pack-governance-wingfoil-dogfood`):
     `pack.yaml`, both directives, `fragments/roles.yaml`, README with the install steps and the
     examples as fixtures, CHANGELOG (the charter's tasks 1, 2 and 4; WD-1, WD-2, WD-6, WD-7);
   - **task-105, the route and its evidence** (`kanban-delivery`, same `pack`; a developer change
     under `tests/` inside a pack task, as task-097's): the §11 lint's test on the real pack, the
     `check:runs` scenario through `wingfoil-channel`, the note's checks, and the adoption run
     prepared (the charter's task 3; WD-3, WD-4, WD-5).

   *Alternative:* the charter's four, task 1 writing a README that passes the rules with
   placeholder examples, rewritten by task 4. It costs a README written twice and a merge whose
   pack is not the one adopters read. The charter's tasks are "proposed", so the split is this
   plan's ruling, recorded on the charter as an Execution Note at close.

2. **task-104, what it fixes.**
   - **`pack.yaml` format 2:** `requires: [base@^2, governance/feedback@^1]`, `conflicts: []`,
     `requires_capabilities: []`, `formats: { roles: 1, directive: 1 }`, the four parameters
     with their descriptions (the charter's table), no entry.
   - **The parameter names** (Open point 1): *Recommended:* the charter's four, kept, after the
     Design's check against the parameters of `base`, `software`, both methodologies and
     `governance/feedback` and the fixtures' (a clash renames the new one, recorded on the
     charter).
   - **`wingfoil-cli`**: rules 1 … 7 as WD-6 says, the known behaviours' form and rule 5's
     re-check; the entries file named by `{{wingfoil_known_behaviours_path}}`; the version line
     without *Checked against* (it moves to the entries file).
   - **Rule 7 with an empty source key** (Open point 2). *Recommended:* the rule names the key
     in a clause that reads whole when it is empty: "sync … the notes WingFoil published under
     the source key in the inbox's **Source key** line (this project's:
     `{{wingfoil_source_key}}`; none until WingFoil registers the project, and no sync until
     then)"; the README's generated table prints the empty default as the generator does, the
     description saying "empty: no source key" (the charter). *Alternative:* the parameter
     dropped and the key read only from the inbox's line, which changes the charter's table: a
     ruling recorded on the charter.
   - **`wingfoil-channel`** as the charter's Ships says, its "Serves the target" line verbatim.
   - **The examples** (spec-002 §2.4, fictional projects, `.example` addresses) under
     `tests/fixtures/examples/wingfoil-dogfood/`. *Recommended:* two, which are also WD-2's two
     parameter sets:
     - `defaults`: `base`, `governance/feedback` and the pack; every parameter on its default but
       `wingfoil_command`; `feedback_targets` with `upstream:wingfoil`;
     - `with-software`: `software` and `methodology/kanban` added, its own inbox and entries
       paths, a fictional source key.

     Each with its `Fixture:` line, a situation, what the project gets, and how one route runs.
   - **The CLI command in the README** (Open point 3). *Recommended:* the install step describes
     the value with no code span holding a command; the examples' `example.yaml` set it (fixture
     data, not README text). No preset change and no stand-in.
   - **The counts** that the tooling tests take on this repository move (lint files, index
     packs, `validate` compositions and runs): each stated as task-096 stated them (dl-018),
     measured by the task.
   - **What does not change:** no file under `src/`, `.wingfoil/` or `presets/`; `catalog.yaml`
     unchanged; the other packs' READMEs unchanged.

3. **task-105, what it fixes.**
   - **WD-3:** a test that the lint reads the pack's channel as serving `upstream:wingfoil` and
     reports nothing on the examples, red first; the generic negatives stay task-093's.
   - **WD-4:** `tests/fixtures/runs/wingfoil-dogfood.yaml`, on the examples, on every selected
     release, no overlay: on each example, an item with `target: "upstream:wingfoil"` and
     `outcome: upstream-note` driven to `closed`, the note written at the example's inbox path
     as `F-001-<slug>.md`, citing the item, `resulting` naming it. Guard tests in
     `tests/runs.test.ts`, red first.
   - **WD-5:** the note read with `assertFields` and `assertSections`, as FA-8's is.
   - **The adoption run, prepared** (dl-032 E3, `first-release`'s):
     `tests/fixtures/runs/adoption-wingfoil-dogfood.yaml`, once per `init` template on
     `with-software` (`only`), the removal list as `adoption-feedback.yaml`'s, with its guard
     test. *Alternative:* left to `first-release`, as the charter allows ("`author` prepares
     it" read as optional); recommended here because it runs in CI from this task on.
   - `check:runs` grows by about 2 route runs and 2 adoption runs per selected release; the task
     measures the number and the CI's job durations (a job over 25 minutes goes to the approver,
     dl-039 R3).

4. **No run by hand** (charter: no dl-032 E4, no `release` or `delivery`). A finding that the
   charter's shape does not hold goes to the approver when found (dl-019); a change under `src/`
   found needed (a stand-in, a `check:runs` step) stops the task and goes to the approver as a
   tooling task of its own.

5. **Order.** WIP 1, task-104 → task-105 (task-105 composes task-104's examples). Each task is
   added on `main` once the one before is `done`, on its own `task/<id>-<slug>` branch, merged
   `--no-ff` on the approver's OK, with `main`'s CI read after each merge.

6. **Each criterion and its check:**

   | Criterion | Check | Task |
   |---|---|---|
   | WD-1 [V] | the examples validate on every release with no warning; `requires`, `conflicts` read by the lint | 104 |
   | WD-2 [V] | the two examples' parameter sets compose and validate; the F3.5 lint; no default holds a project value | 104 |
   | WD-3 [V] | the lint on the real pack and its examples, a test | 105 |
   | WD-4 [V] | `wingfoil-dogfood.yaml` to `closed` on 0.3.0 … 0.3.2 | 105 |
   | WD-5 [V] | `assertFields`, `assertSections` on the scenario's note | 105 |
   | WD-6 [A] | the rules read against custom 1.6 at task-104's review and `approve` | 104 |
   | WD-7 [V] | `presets/` unchanged; `npm run validate` on the presets | 104 |
   | Exit criterion | WD-1 … WD-7; the examples as fixtures; CB-1 … CB-3, CB-6 left to the first tag | 104, 105 |

7. **No feedback note** to WingFoil (dl-021 R1).

## Steps

The plan and the task bodies are committed on `main`, as plan-076's were; each task's work
happens on its own branch. Before every commit, the privacy check and `check:texts`
(`repository-practice` rules 2, 5).

1. **The outline's review** (dl-017), amended, its record; then the approver's rulings, recorded
   before `submit` (`draft → active`).
2. **task-104** through `kanban-delivery`: added on `main`, its Design, its build on
   `task/task-104-<slug>`, its review, the approver's gates; merged, `main`'s CI read.
3. **task-105**, the same way, once task-104 is `done`.
4. **Close.** The charter's Execution Note of the author phase (the task split, the Open points'
   answers, the exit criterion's evidence); any item left owed added to `docs/owed-items.md`
   (rule 4); `active → done`; the close's CI left to the next plan.

**Not in this plan:** the first release and its adoption run's citation, the catalog's entry,
the pack release round, this repository's adoption and pin, the sequencer's stale W10 state row
(its owed row).

## Handoff

- **Agent:** the outline, the tasks' Design, build and evidence, the reviews (dl-017, with their
  R3 records). **Approver:** the outline's rulings, each task's gates, each merge's OK and the
  push of `main`.
- **Done when:** task-104 and task-105 are `done`, merged into `main` with its CI green, and
  this plan is `done`.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
