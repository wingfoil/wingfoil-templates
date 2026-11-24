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
- **The CI**: the longest job of `main`'s run 45388134981 (on the merge `93a74b6f`) took
  15 min 7 s, against a 30-minute timeout and dl-039 R3's 25-minute line.
- **The catalog**: `catalog.yaml` gains the pack only at its publication (`first-release`), as
  `governance/feedback`'s author tasks left it.

## Proposed outline (ruled by the approver before `submit`)

Each point has a recommendation.

1. **Two tasks, not the charter's four.** The charter's proposed tasks split the pack into the
   CLI directive, the channel, the scenario and the README; the layout and the README rules
   (Reads) make any pack task before the README's fail the branch's lint. *Recommended:*
   - **task-104, the pack** (`kanban-delivery`, `pack: pack-governance-wingfoil-dogfood`):
     `pack.yaml`, both directives, `fragments/roles.yaml`, README with the install steps and the
     examples as fixtures, CHANGELOG, and the tests of WD-2 and WD-3 (the charter's tasks 1, 2
     and 4; WD-1, WD-2, WD-3, WD-6, WD-7);
   - **task-105, the route and its evidence** (`kanban-delivery`, same `pack`; a developer change
     under `tests/` inside a pack task, as task-097's): the `check:runs` scenario through
     `wingfoil-channel`, the note's checks, and the adoption run prepared (the charter's task 3;
     WD-4, WD-5).

   *Alternative:* the charter's four, task 1 writing a README that passes the rules with
   placeholder examples, rewritten by task 4. It costs a README written twice and a merge whose
   pack is not the one adopters read. The charter's tasks are "proposed", so the split is this
   plan's ruling, recorded on the charter as an Execution Note at close.

2. **task-104, what it fixes.**
   - **`pack.yaml` format 2:** `version: 1.0.0` (as `governance/feedback`'s before its
     publication), `requires: [base@^2, governance/feedback@^1]`, `conflicts: []`,
     `requires_capabilities: []`, `formats: { roles: 1, directive: 1 }`, the parameters with their
     descriptions (the charter's table, less point 2's ruling on the source key), no entry;
     `CHANGELOG.md` with its `- 1.0.0` entry.
   - **The parameter names** (Open point 1): *Recommended:* the charter's, kept. Checked for this
     outline: no clash in `packs/`, `tests/fixtures/` or `presets/`; the Design re-checks them
     (a clash renames the new one, recorded on the charter).
   - **`wingfoil-cli`** as `governance/feedback`'s directives are written (frontmatter `kind`,
     `format`, tags; no version line, the directive's version being the pack's): rules 1 … 7 as
     WD-6 says, the known behaviours' form and rule 5's re-check, its bump the entries file's
     *Checked against*; the entries file named by `{{wingfoil_known_behaviours_path}}`.
   - **The source key** (Open point 2). A parameter substituted into rule 7 reads badly when
     empty (a code span renders as a bare pair of backticks, plain text leaves a dangling
     clause), the README generator prints the empty default as a bare pair of backticks
     (`readme-generate.ts`), and the key would have two sources, the parameter and the inbox's
     **Source key** line. *Recommended:* (b), no `wingfoil_source_key`: the inbox's **Source
     key** line is the one source, rule 7 reading "sync … under the source key on the inbox's
     **Source key** line; while it is empty, WingFoil has not registered the project and there
     is nothing to sync"; the README's install step says to fill the line once WingFoil
     registers the project. Nothing parses the line's value today: `assertLedger`
     (`tests/support/inbox.ts`) asserts only that the line is present. (b) departs from an
     approved decision and from the accepted charter, so the ruling names each place it changes:
     - dl-051 Q3 (a), which lists the source key among the parameters (ruled by its D2);
     - on the charter: Ships' "the source key (rule 7)" among the parameters; the parameters
       table; the descriptions sentence ("empty: no source key"); the Adaptations, which gain a
       fourth, rule 7's key read from the inbox's line; WD-6's closed list of differences, which
       gains rule 7's wording (the approver rules whether WD-6 reads it as allowed); Open point
       2's second half, moot.

     The record is an Execution Note on dl-051 and on the charter at this plan's close (step 4),
     as dl-051 D2 recorded Q2's refinement; the accepted charter's body is unchanged.
     *Alternative:* (a), the parameter kept: it follows dl-051 Q3 (a) and WD-6 to the letter and
     needs no record. Its costs remain: the value in plain text in a sentence of its own still
     dangles when empty ("This project's source key: ."), the key keeps two sources, and the
     generated table's bare backticks are accepted or fixed by a tooling task of its own
     (point 4).
   - **`wingfoil-channel`** as the charter's Ships says, its "Serves the target" line verbatim.
   - **The examples** (spec-002 §2.4, fictional projects, `.example` addresses) under
     `tests/fixtures/examples/wingfoil-dogfood/`. *Recommended:* two, which are also WD-2's two
     parameter sets:
     - `defaults`: `base`, `governance/feedback` and the pack; the pack's parameters on their
       defaults but `wingfoil_command`, which has none; `base`'s four and `feedback_targets`
       (with `upstream:wingfoil`) set, as every example sets them;
     - `with-software`: `software` and `methodology/kanban` added, its own inbox and entries
       paths.

     Each with its `Fixture:` line, a situation, what the project gets, and how one route runs.
   - **The README** (spec-002 §2), as the charter's Ships and Adoption say: the install steps
     with, as text, the inbox skeleton at the inbox path (Rules naming the pack's `wingfoil-cli`,
     Ledger, Context, the **Source key** and **Last sync** lines), the empty entries file,
     `upstream:wingfoil` added to `feedback_targets`, the CLI command (and, under (a), the source
     key) to set; "Sources and adaptations" with the charter's three adaptations (under (b), a
     fourth: rule 7's key read from the inbox's line); the adoption
     procedure, a project's own `wingfoil-cli` removed in the same change.
   - **The CLI command in the README** (Open point 3). *Recommended:* the install step describes
     the value with no code span holding a command; the examples' `example.yaml` set it (fixture
     data, not README text). No preset change and no stand-in.
   - **The tests** (under `tests/`, as task-096's): WD-2's, that `wingfoil_command` has no
     default and that no default and no directive text holds `svc-018` or a WingFoil command as
     `isCliCommand` (`src/readme-rules.ts`) reads one, so rule 1's bare `wingfoil` passes (no
     lint rule checks a default's value); WD-3's, that the lint reads the pack's channel as
     serving `upstream:wingfoil` and reports nothing on the examples. Red first where dl-018
     asks; WD-3's is green when written, since the channel lands in the same task (the generic
     negatives stay task-093's).
   - **The counts** that the tooling tests take on this repository move (lint files, index
     packs, `validate` compositions and runs): each stated as task-096 stated them (dl-018),
     measured by the task.
   - **What does not change:** no file under `src/`, `.wingfoil/` or `presets/`; `catalog.yaml`
     unchanged; the other packs' READMEs unchanged.

3. **task-105, what it fixes.**
   - **WD-4:** `tests/fixtures/runs/wingfoil-dogfood.yaml`, on the examples, on each selected
     release, no overlay: an item with `target: "upstream:wingfoil"` and `outcome:
     upstream-note` driven to `closed`, the note written as `F-001-<slug>.md` citing the item,
     `resulting` naming it. `write` substitutes only `$<label>.id`, not a parameter
     (`src/runs.ts`), and the examples' inbox paths differ: two runs, `only: [defaults]` and
     `only: [with-software]`, each writing at its example's literal path. The ledger's row is the
     channel's text and not WD-4's: the scenario does not write it. Guard tests in
     `tests/runs.test.ts` (the examples' `feedback_targets` holding `upstream:wingfoil`, as
     FA-8's), red first.
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
   | WD-1 [V] | the examples validate on 0.3.0 and 0.3.2 (the matrix's oldest and newest; 0.3.1 by range) with no warning; `requires`, `conflicts` read by the lint | 104 |
   | WD-2 [V] | the two examples' parameter sets compose and validate; the F3.5 lint; a test that no default or directive text holds a project value | 104 |
   | WD-3 [V] | the lint on the real pack and its examples, a test | 104 |
   | WD-4 [V] | `wingfoil-dogfood.yaml` to `closed` on 0.3.0 and 0.3.2 | 105 |
   | WD-5 [V] | `assertFields`, `assertSections` on the scenario's note | 105 |
   | WD-6 [A] | the rules read against custom 1.6 at task-104's review and `approve` | 104 |
   | WD-7 [V] | `presets/` unchanged; `npm run validate` on the presets | 104 |
   | Exit criterion | WD-1 … WD-7; the examples as fixtures; CB-1 … CB-3, CB-6 left to the first tag | 104, 105 |

7. **No feedback note** to WingFoil (dl-021 R1).

## The approver's rulings

Given on 2026-11-24, in chat: "tutti come raccomandato". Points 1 … 7 stand as recommended:
- two tasks, task-104 (the pack, WD-2's and WD-3's tests with it) and task-105 (the route and its
  evidence), the split recorded on the charter at close (point 1);
- the charter's parameter names; the source key's option (b), no `wingfoil_source_key`, the
  inbox's **Source key** line the one source, WD-6 reading rule 7's new wording as allowed, the
  departures recorded on dl-051 and on the charter at close (point 2);
- the examples `defaults` and `with-software`, the CLI command described in the README and set
  by the examples (point 2);
- the adoption run prepared in task-105 (point 3);
- no run by hand, a change under `src/` a tooling task of its own (point 4);
- the order task-104 → task-105, WIP 1 (point 5).

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
- 2026-11-24: independent review of the outline (dl-017, `97d440de`): approve after amendments;
  no blocker, seven should-fix (rule 7's empty source key and its two sources, now point 2's
  option (b) with (a) as the alternative; the generated table's bare backticks stated; no
  version line in a pack directive; WD-3's test moved to task-104, green when written; WD-2's
  project-value check given a test; `write` taking no parameter, so two route runs; the README's
  contents listed) and seven nits (the matrix's two releases in WD-1 and WD-4; the `defaults`
  example's wording; run 45388134981's commit; the names check's result; `version: 1.0.0` and
  the CHANGELOG entry; the rulings section; the ledger row outside the scenario), all applied in
  the commit that records this note. The review verified the Reads' claims and found no change
  under `src/` needed.
- 2026-11-24: re-review of the amendments (`f34ba616`): approve after amendments; no blocker, two
  should-fix (option (b) departs from dl-051 Q3 (a) too, and its record named; every place on
  the charter it changes listed, a fourth adaptation among them, WD-6's reading left to the
  approver) and two nits (option (a)'s residual costs and its advantages stated; WD-2's test
  reading a WingFoil command as `isCliCommand` does), all applied in the commit that records
  this note. No further re-review: the fixes state what the ruling changes, not a new
  recommendation.
- 2026-11-24: `main`'s CI before `submit`: the push of `52cc6bea` (plan-085's close), run
  45391534375 `success`, its jobs (22.12.0, 1) 11 min 48 s, (22.21.0, 1) 9 min 50 s, (22.12.0,
  2) 5 min 39 s, (22.21.0, 2) 6 min 8 s, the step "Texts, the lines this push adds to main"
  `success`.
