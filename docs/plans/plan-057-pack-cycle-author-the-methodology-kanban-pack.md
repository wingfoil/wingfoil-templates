---
id: plan-057-pack-cycle-author-the-methodology-kanban-pack
type: plan
title: "pack-cycle author: the methodology/kanban pack"
status: active
workflow: "pack-cycle"
phase: "author"
tags: ["packs","kanban","methodology","W10"]
---

## Context

The `author` phase of `pack-cycle` (v6) for `pack-methodology-kanban`, accepted on 2026-10-30 under
plan-056 (rulings 1 … 13, `delivery`'s filter `[in-development, releasing]`, open points 1 … 4 as
written). Asked by the approver on 2026-10-30. This plan writes `packs/methodology/kanban` from the
charter, its README examples, its exit criterion (dl-032 E4) and the run on the engine the
criterion asks for. Publication is `first-release`, the next plan; this repository's adoption, the
presets and `governance/wingfoil-dogfood` are later W10 plans.

**Preconditions, met.**
- The charter is `accepted` on `main` (`c6ed1a0`, plan-056 › step 6); `software`'s `delivery`
  contract as dl-026 and dl-027 amend it, checked by the lint `life-cycle-includes` (task-051).
- `base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0 are published (plan-052); the pack
  composes with them as they are on `main`.
- plan-056 › step 2 and step 4 drove the draft on WingFoil 0.3.1 (three releases, two live at once,
  a task spanning two releases, a limit refusing, a reject past a full limit, a release already
  `released` left out, three retrospectives); the draft validated on 0.3.0 and 0.3.1 with no
  WingFoil diagnostic (16 runs). The draft is untracked, kept out of the repository, a reference
  only.
- The tooling the exit criterion uses exists: `validate --overlay` (task-046), `check:runs` on
  every selected release (task-053, task-058) and its adoption run (task-060).

**The model** is plan-050 (`scrum`'s `author`): one task for the pack and the README examples now
due, one for the exit criterion's compositions and their CI step, one for the run by hand; each
through `kanban-delivery` (`pack: pack-methodology-kanban`), on its own branch from `main`, one
after the other.

**Reads made for this outline** (2026-10-30, `main` at `e3cfc8d`, CI run 41077923343 `success`):
- The draft's pack copied into a scratch copy of the tree (`packs/methodology/kanban`):
  `check:packs` reports only section 7 of its README (no examples, spec-002 §2.4), as expected.
- The draft as an overlay of this tree, with one more composition of its own giving the integer
  parameters as YAML integers (`wip_in_progress: 1`, removed after the read): 9 compositions,
  18 runs, 0 failed, tolerance none, on 0.3.0 and 0.3.1 (the draft alone: 16 runs).
- The Node.js warning of plan-056 ruling 13 ("Keys with collection values will be stringified",
  `"{ wip_in_progress }"`) comes from the secret rules, which the lint and the composer both run on
  a pack's raw files: `--trace-warnings` shows `parseYaml` called by `yamlStrings` in
  `src/secret-rules.ts`, the only YAML parse made before substitution (the composer and the lint
  substitute, then parse). It is printed by `check:packs`, `validate`, `compose`, `check:runs` and
  the publication, so once `packs/methodology/kanban` is on `main` every CI log carries it. The
  owed row names the composer; the task that settles it corrects the cause.

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **`base@^2` and `software@^1` as they are.** Recommended: yes. The pack needs nothing from them
   that the charter does not already adapt to: a task's `release` is written by editing the draft
   (`base`'s template has no `release` field, F-034); the scope token is `{release.version}`
   (`software`'s `release` template declares no `id`; open point 3); bug-008 and `explore`'s weak
   evidence are stated, not fixed (open point 4). A `software` minor declaring `id` in `release`'s
   template, or a `base` change to the retrospective, would be a pack release of its own, not this
   plan's. Alternative: ask for one of them first, which delays `kanban`.
2. **The tooling task for the warning (ruling 13's row): in this plan, first.** Decided by claude,
   as allowed by the approver on 2026-10-30 (who left to claude whether a tooling task closes the
   row in this plan); stated here for the record, not for a ruling. task-066, `tooling-delivery`,
   `pack: ""` (as task-046 under plan-046): `secretProblems` parses a pack's raw YAML with no
   warning printed for a `{{name}}` used as a plain scalar. The fix is limited to
   `src/secret-rules.ts`: a change to the shared `parseYaml` of `src/yaml-load.ts` would also
   silence a real collection-valued key in `catalog.yaml`, `pack.yaml` and the other files it reads.
   Red first (dl-018): a test of `secretProblems`, catching the warning in-process with
   `process.on('warning')`, and one of the lint's CLI, spawned on a tree holding an unquoted integer
   parameter, asserting nothing on stderr. The row moves to Closed with the cause corrected. Why
   now: it is small, and without it every check of the next three tasks, and every CI log after
   them, carries a warning that the exit criterion ("no warning") would have to explain.
3. **task-067, the pack and its README examples** (`kanban-delivery`). `packs/methodology/kanban`
   as the charter fixes it, from the draft's `pack.yaml`, fragments and workflows (the ones run on
   the engine), with what the draft left as placeholders written from the charter: the directives
   `kanban` and `definition-of-workflow`, `agents/section.md` (`## Kanban`), the README per
   spec-002 §2, `CHANGELOG.md`. Points fixed here:
   - `pack.yaml`'s description says "the Product Owner", not "the approver" (plan-056's nit N2);
   - "Sources and adaptations": the Kanban Guide v2025.5 and the charter's eight adaptations, the
     bug-008 bullet being the charter's (Adaptations, the retrospective's bullet; plan-056
     ruling 12);
   - section 3: the charter's Adoption for any project, the hand steps marked temporary, no
     WingFoil CLI command in code (CB-3), the removal of `init`'s `custom/` `kanban-delivery`
     (bug-007); it also says which "own entries" a project re-adds for the Memory types and roles
     `init` scaffolded, the owed row "README step 3 'own entries'" (trigger: the next README pass)
     answered for `kanban`; the row stays open for `base`'s, `software`'s and `scrum`'s READMEs,
     which this plan does not change, with a note citing task-067;
   - **the examples** (spec-002 §2.4, fictional projects, `.example` addresses), under
     `tests/fixtures/examples/kanban/`: `defaults` (every parameter on its default) and
     `team-limits` (recommended values: `wip_in_progress: 4`, `wip_in_review: 2`,
     `service_level_expectation: "85% of work items finish within 7 days"`, paths on their
     defaults). Each gives its `Fixture:` line, a situation, what the project gets and how one
     phase runs;
   - the counts the tooling tests take on this repository move, each stated (dl-018), as
     task-055's: lint 61 → 74 files (11 pack files and 2 examples), index 6 → 7, schemas 5 → 6, `validate` 7 → 9 compositions
     (14 → 18 runs), the overlays `software-exit` and `scrum-exit` 11 → 13 compositions (22 → 26
     runs each), the publication run 14 → 18; the final numbers are those the task measures.
   No file under `src/` or `.wingfoil/` changes; `base`'s, `software`'s and `scrum`'s READMEs do
   not change (their examples compose no `kanban`).
4. **task-068, the exit criterion's compositions and scenarios** (`kanban-delivery`; a developer
   change under `tests/` and `.github/` inside a pack task, as task-056's):
   - the overlay `tests/fixtures/kanban-exit/` with compositions only, the four sets of
     `tests/fixtures/software-exit/compositions/` (task-049: this repository, Benchmark, WingFoil,
     UI) with `methodology/kanban@^1`; **recommended:** `flat-releases` (Benchmark's set) carries
     `wip_in_progress: 1` and `wip_in_review: 1`, its rule as the charter's Adoption reads it, and
     the other three keep `kanban`'s defaults (this repository's per-pack rule is its adoption's;
     WingFoil and UI do not run Kanban); alternative: all four on the defaults, as `scrum-exit`;
   - `npm run validate -- --overlay tests/fixtures/kanban-exit`, no failed run and no warning
     (`tolerance applied: none`): `compositions: 13` (the tree's nine examples and the four sets),
     `matrix: self-test, 26 runs, 0 failed`; its CI step after `scrum-exit`'s;
     `tests/ci-workflow.test.ts` and a case of `tests/validate.test.ts` pinning those counts, red
     first (dl-018);
   - `tests/fixtures/runs/kanban.yaml`: `sw-life-cycle`'s start on `kanban`'s README examples,
     on every selected release (as task-058's `scrum.yaml`), with the guard test of
     `tests/runs.test.ts` extended, red first;
   - **the adoption run prepared** (dl-032 E3 is `first-release`'s; the charter says `author`
     prepares it). Recommended: this task adds `tests/fixtures/runs/adoption-kanban.yaml`, the
     adoption of `base`, `software` and `kanban` by a project `wingfoil init --template` wrote,
     once per template (Scrum, Kanban), on `kanban`'s examples, as `adoption.yaml` does for
     `scrum`, with a guard test in `tests/runs.test.ts` as `adoption.yaml`'s (its compositions
     folder, both templates, bug-007's removal list), red first; it then runs in CI from this task
     on, and `first-release` cites its result. Alternative: write the scenario in `first-release`.
   `check:runs` grows by 12 runs (2 starts and 4 adoptions per release, on 0.3.0 and 0.3.1:
   34 → 46). The CI job ran about 19 minutes of its 30-minute timeout on `main`'s last run
   (41077923343, `npm test` about 15); the task records the suite's and the CI's durations against
   `timeout-minutes: 30`, and a job within 5 minutes of it goes to the approver (dl-019) before
   `in-review`, the owed row G12 cited.
5. **task-069, the run by hand** (the charter's Acceptance, dl-032 E4): a scratch repository,
   `base`, `software` and `kanban` composed from `main` at a commit the notes name, fictional
   values, `.wingfoil/` committed, WingFoil 0.3.1 (the newest release `compat.yaml` lists; 0.3.2
   if listed by then) driving `sw-life-cycle` through `delivery`: two releases to `released`, one
   task spanning both, a limit refusing a move, a reject past a full limit, a release already
   `released` before the start left out, two retrospectives; nothing `late`. Commands, exit codes
   and the commit composed recorded in the task's Execution Notes, nothing committed but them.
   **Recommended:** on 0.3.1 only; 0.3.0 is covered by the matrix and `check:runs`'s starts and
   adoptions, and plan-056 found no difference between the two; the charter's note at close says
   so. Alternative: the same run on 0.3.0 too. A finding
   that the charter's shape does not hold goes to the approver when found (dl-019); a defect of the
   pack is fixed in task-069 if small, otherwise through this plan's gate.
6. **The scripted full run stays owed.** `check:runs` cannot set a field, park, reject or expect a
   refusal: the row "`check:runs` scenario of the full scrum run" (plan-050 ruling 3) is widened at
   this plan's close to `scrum`'s and `kanban`'s full runs, still a tooling task of its own.
   Recommended: not in this plan. Alternative: a tooling task here extending `runs.ts` (new step
   kinds), which would make task-069 scripted.

## The approver's rulings

Given on 2026-10-30, in chat: every point of the outline as recommended.
1. **Point 1:** `base@^2` and `software@^1` as they are.
2. **Point 3:** task-067 as written, with the examples `defaults` and `team-limits`.
3. **Point 4:** task-068 as written; `flat-releases` carries `wip_in_progress: 1` and
   `wip_in_review: 1`; `adoption-kanban.yaml` written in this task.
4. **Point 5:** task-069 on WingFoil 0.3.1 only.
5. **Point 6:** the scripted full run stays owed, its row widened to `kanban`.

Point 2 (task-066 first) was decided by claude under the approver's allowance and stands.

Given on 2026-10-31, in chat, on a finding of task-067 (dl-019):

6. **The README generator's warning:** a tooling task of its own, task-070 (`tooling-delivery`),
   before task-067 merges: `npm run index`, also run inside `validate`, reads a pack's fragments
   before substitution (`src/readme-generate.ts`, through `yamlIn` of `src/index-data.ts`) and
   prints the same Node.js warning for `kanban`'s unquoted limits, a second site that task-066's
   reads and review missed. task-067 waits on its branch and resumes from `main` after it.

**Ids** (agreed before this plan): plan-057; task-066 … task-069; dl-034, bug-009 and F-042
reserved for a ruling, a defect or a note this plan finds; prel-006 is `first-release`'s.

## Steps

This plan and the four task bodies are committed on `main` (the plan document as plan-056's; the
bodies as `memory add` and `submit` commit them); each task's work on its own branch
`task/<task id>` from `main`, one after the other. `kanban-delivery` and `tooling-delivery` each
keep their own WIP limit by hand on the 0.2.2 pin, so this plan's order, not the limits, puts
task-066 first.
Before every commit, the privacy check (`repository-practice` rule 2); after every push to `main`,
its CI read (rule 3).

1. **This plan:** an independent review (dl-017), amended; the outline ruled by the approver;
   submitted (`draft → active`).
2. **The tasks' bodies**, task-066 … task-069, each written from the rulings, reviewed
   independently, re-reviewed when a fix changes a decision, submitted (`draft → pending`); the
   approver accepts each into the backlog.
3. **task-066 … task-069**, in that order (task-068 and task-069 depend on task-067): Design,
   red first where dl-018 asks, build, an independent review of the build, clean clones on Node.js
   22.21.0 and 22.12.0 one after the other (`npm ci`, `npm test`, `lint`, `check:packs`,
   `validate`, the overlays, `index -- --check`, `check:runs`, `workflow list`), the branch's CI
   read, `in-review`; the approver's `approve` and merge OK; `--no-ff` merge into `main`, `main`'s
   CI read, `approved → done`.
4. **Close:** the account per tech-spec (dl-020): none amended unless a task amends spec-001 or
   spec-002; the charter's Execution Notes: the pack written, the exit criterion's results,
   task-069's summary and composed commit, the 0.3.0 coverage (point 5), and, after task-066, the
   warning's cause (the secret rules, not the composer: the charter's Ships and Acceptance name the
   composer) with the exit criterion then read as "no warning" with no exception; `kanban`'s README
   repeats none of it. The owed rows: ruling 13's moved to Closed by task-066, the scripted-run row
   widened, the "own entries" row's note, any new one. The privacy check of each task branch's diff
   recorded in its task, and of this plan's commits in this plan (`repository-practice` rule 2).
   The untracked draft under `tests/fixtures/kanban-draft/` deleted once task-067 is merged (with
   the pack in `packs/`, an overlay run on it would hold two `methodology/kanban`). The plan
   `active → done`.

**Not in this plan:** `first-release` (the publication, CB-6's live part, the citation of the
adoption run, prel-006); the charter's open point 1 (the Service Level Expectation's default
becomes fixed with the first version) and open point 2 (stated in the README by task-067, nothing
in the pack can change it); the presets (F2.6), `governance/wingfoil-dogfood` (F4.2), this
repository's adoption, pin and inbox sync, with the owed rows of trigger W10; dl-013, dl-024 and
dl-025 (`pending`).

## Handoff

- **claude:** drafts for the product-owner (this plan, the task bodies); pack-author of task-067 …
  task-069 and developer of task-066 and of the changes under `src/`, `tests/` and `.github/`. It
  never runs `memory approve` or `memory reject`: it hands the approver the command. No pull
  request; files staged by name; the draft under `tests/fixtures/kanban-draft/` and the run logs
  under `.cache/` are never committed.
- **Reviewer:** an independent subagent for every element created and every build (dl-017).
- **Approver:** this outline; each task's backlog acceptance, its `approve` and its merge OK.
- Done when task-066 … task-069 are `done` on `main` (or the ones the rulings keep), pushed, with
  `main`'s CI `success`, the charter's notes, the privacy checks and the owed rows recorded.

## Execution Notes

- 2026-10-30: written as asked by the approver on 2026-10-30, after plan-056's close; `workflow`
  and `phase` filled by editing the draft (W-02). `main` at `e3cfc8d`, CI run 41077923343
  `success`.
- 2026-10-30: independent review: approve after amendments; one blocking finding (the lint count,
  61 → 74, not 72), eight should-fix, six nits. Applied: point 2 recorded as decided under the
  approver's allowance, its fix limited to `src/secret-rules.ts` and its red tests named; the
  warning's scope (lint and composer alike); `kanban-exit`'s counts; the adoption scenario's guard;
  the CI timeout budget; the "own entries" row; the privacy checks at close; the charter's note on
  the warning's cause; "Not in this plan"; the reads made precise; the draft's deletion; the 0.3.0
  coverage; where the bodies are committed and how the two delivery loops are sequenced.
- 2026-10-30: the approver ruled the outline (every point as recommended); submitted
  (`draft → active`).
- 2026-10-30, step 2: task-066 … task-069 written, reviewed (approve after amendments; one blocking
  finding in task-066, its in-process test), amended, re-reviewed (approve), submitted
  (`draft → pending`); the approver accepted the four into the backlog.
- 2026-10-31: task-067's checks found the warning printed by `npm run index` and every `validate`,
  from the README generator's parse of a pack's raw fragments (dl-019); the approver ruled 6.
