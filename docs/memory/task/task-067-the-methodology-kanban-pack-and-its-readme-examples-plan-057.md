---
id: task-067-the-methodology-kanban-pack-and-its-readme-examples-plan-057
type: task
title: "The methodology/kanban pack and its README examples (plan-057)"
status: approved
pack: "pack-methodology-kanban"
depends_on: ["task-066"]
tags: ["packs","kanban","methodology"]
---

## Context

plan-057 (`pack-cycle › author` of `pack-methodology-kanban`, accepted under plan-056), point 3 and
ruling 2. This task writes `packs/methodology/kanban` as the charter fixes it (Ships, Adaptations,
the AGENTS.md section), on the shape plan-056's runs proved on WingFoil 0.3.1 and validated on
0.3.0 and 0.3.1: the untracked draft of plan-056 step 2 is the source of `pack.yaml`, the fragments
and the workflows; its directives, AGENTS.md section and README are placeholders, written here from
the charter. Since every README example is a fixture (spec-002 §2.4, CB-2), the examples come in
the same change. It follows task-066, so that the pack's checks print no warning.

## Acceptance

1. **`packs/methodology/kanban/pack.yaml`**: `format: 1`, `id: methodology/kanban`, `axis:
   methodology`, `name: kanban`, `title: "Kanban"`, a `description` naming the Kanban Guide (May
   2025), the flow under WIP limits and releases decided by **the Product Owner** (not "the
   approver", plan-056's nit N2), `version: 1.0.0`, `formats` exactly for the kinds shipped
   (`roles`, `memory`, `workflow`, `directive`, all 1), `requires: [base@^2, software@^1]` (plan-057
   ruling 1), `requires_capabilities: [workflow-engine]`, no `conflicts`, no `conditional`; the
   parameters `wip_in_progress` (integer, default 2), `wip_in_review` (integer, default 1),
   `service_level_expectation` (string, default `"85% of work items finish within 10 days"`), each
   with a description; `contents` lists every file below and nothing else.
2. **`fragments/memory.yaml`** (`format: 1`): `task` tightened with `template.frontmatter.required:
   [release]`, `template.frontmatter.not_applicable_allowed: [release]` and `states.limits` with
   `in-progress: {{wip_in_progress}}` and `in-review: {{wip_in_review}}`, a block mapping as the
   draft writes it, the parameters unquoted: a limit is a positive integer (spec-001 §7.5), and any
   allowed value of an integer parameter keeps the file valid (§8.2's rule; its advice to quote
   holds for strings); nothing else.
3. **`fragments/roles.yaml`** (`format: 1`): `assignments`: `product-owner: [kanban]`, `facilitator:
   [kanban]`, `developer: [kanban, definition-of-workflow]`, `reviewer: [definition-of-workflow]`,
   `qa: [definition-of-workflow]`. No `dna.yaml` fragment.
4. **The workflows**, as the charter's table states them, each `format: 1`, no key newer than
   WingFoil 0.3.0, every phase with its role or an include, each phase's `description` saying what
   the role does, including what a step cannot bind (a task's `release`, a release's `version` and
   `release-line`, written by editing the draft or with `--set`, F-034):
   - `delivery` (`kind: sub`, no `element`): `plan-release` (product-owner; `memory.add(type:
     release)`, `memory.submit`, `memory.submit`; produces `{ type: release, path:
     "{{release_path}}" }`; its description says later releases are added outside a step and keeping
     one release open) → `releases` (`iterate_over: release`, `where: { status: [in-development,
     releasing] }`, `include: release-flow`);
   - `release-flow` (`kind: sub`, `element: release`): `work` (`iterate_over: task`, `where: {
     status: [backlog, in-progress, in-review, approved], release: "{release.version}" }`, `include:
     work-item`) → `release` (`iterate_over: release`, `where: { status: [in-development,
     releasing], version: "{release.version}" }`, `include: release`) → `retrospective` (`include:
     retrospective`); `release`'s description states the rule that a release moves to `releasing`
     only once its tasks are done or moved (plan-056 ruling 11);
   - `work-item` (`kind: sub`, `element: task`): `start` (developer; `memory.submit`, within the
     limit) → `build` (developer; `agent.execute`) → `review` (reviewer; `memory.submit`, within the
     limit) → `approve` (approver; `memory.approve`, `approval: { by_role: approver }`, `fallback: {
     step: build }`) → `done` (developer; `memory.submit`). No `element.set_state`: WingFoil checks
     a limit inside its verbs.
5. **The directives** `directives/kanban.md` and `directives/definition-of-workflow.md`, with
   WingFoil 0.3.0's directive frontmatter (`id`, `name`, `type: directive`, `kind: built-in`,
   `title`, `format: 1`), written as rules from the charter's Directives paragraph: `kanban` (the
   Guide's three practices; pull within the limits, never past them, and a state a reject pushed
   over its limit brought back within it before anything else moves into it; the four flow measures
   read from the tasks' history in Memory; the Service Level Expectation,
   `{{service_level_expectation}}`, an item older than it handled first; one release kept open, a
   release moved to `releasing` only once its tasks are done or moved; the workflow improved at each
   release's retrospective; releases decided by the Product Owner; the agent never approving);
   `definition-of-workflow` (generic: units of value, started and finished points, the states, the
   limits `{{wip_in_progress}}` and `{{wip_in_review}}`, each state's policies, the Service Level
   Expectation; overridden by a project in `custom/` with the same id). No word "replenishment", no
   Definition of Done, no estimation technique. Neither id equals a WingFoil 0.3.0 or 0.3.1 built-in
   directive id (`directives list` with no warning, `pack-compatibility`). No workflow name the pack
   ships (`release-flow`, `work-item`) equals a WingFoil 0.3.1 built-in or a `custom/` file `init
   --template Kanban` or `--template Scrum` writes: checked by listing them in this task and, from
   task-068 on, by its adoption run (`E_WORKFLOW_DUPLICATE_NAME`).
6. **`agents/section.md`**: a level-2 section `## Kanban`, no level-1 heading, no markers, as the
   charter's paragraph states it (the limits, one item's flow through `work-item`, the Service Level
   Expectation, a task's `release` field, releases decided by the Product Owner and moved to
   `releasing` only once their tasks are done or moved, `{{agent_name}}` never approving); it names
   `delivery`.
7. **`CHANGELOG.md`** with `- 1.0.0: …` naming what the first version holds, and **`README.md`** per
   spec-002 §2: generated sections by `npm run index`; section 2 ("When to use it") with the
   problem, the profiles it serves and when not to use it (a timeboxed team takes `scrum`; limits
   per team or per column are not expressible, a limit counting the whole repository); section 3
   opening with §2.3's temporary mark, linking
   `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install`, with the charter's
   Adoption for any project (the first open release, a `release` on every open task, releases
   already `released` left out, a project over a limit moving tasks out first, the `custom/`
   `kanban-delivery` `init` writes removed, bug-007), no WingFoil CLI command in code (CB-3); step 3
   states that the "own entries" a project re-adds are those it wrote itself, not the Memory types,
   roles or workflows `init` scaffolded (the owed row "README step 3 'own entries'", answered for
   `kanban`); "Sources and adaptations" citing the Kanban Guide, May 2025 edition (v2025.5,
   kanbanguides.org), and the charter's eight adaptations, the retrospective's bullet being the
   charter's (bug-008's effect and `explore`'s weak evidence, plan-056 ruling 12); the limits' count
   over every branch WingFoil sees (the charter's open point 2) stated; the Service Level
   Expectation's default stated as a convention for new projects, not the Guide's (the charter's
   Parameters, open point 1); section 7 linking its examples; section 9 linking the CHANGELOG and
   the catalog entry, as `scrum`'s. The README names no real adopter.
8. **The examples** (spec-002 §2.4, fictional projects only, `.example` addresses, `packs` naming
   `software@^1` and `methodology/kanban@^1`): `tests/fixtures/examples/kanban/defaults/` (every
   parameter on its default) and `tests/fixtures/examples/kanban/team-limits/` (`wip_in_progress:
   4`, `wip_in_review: 2`, `service_level_expectation: "85% of work items finish within 7 days"`,
   paths on their defaults), each described in section 7 with its `Fixture:` line, a fictional
   situation, what the project gets and how one phase runs; each composes and validates. `base`'s,
   `software`'s and `scrum`'s READMEs and examples unchanged.
9. **Validation:** `npm run check:packs`, `npm run index -- --check` and `npm run validate` pass
   with no warning; every new composition passes WingFoil 0.3.0's and 0.3.1's matrix (`tolerance
   applied: none`); the overlays `software-exit` and `scrum-exit` pass with 0 failed; the golden
   tree's `validate` passes; `npm run check:runs` passes (its count unchanged: no scenario names
   `kanban`'s examples before task-068). `catalog.yaml`, `CATALOG.md`, `catalog-index.json` and
   `llms.txt` unchanged (an unpublished pack, spec-002 §3.1).
10. **Tests:** the counts the tooling tests take on this repository move, each stated in the
    Execution Notes with the test it changes (dl-018): `tests/check-packs.test.ts` and
    `tests/validate.test.ts` lint 61 → 74 files (11 pack files and 2 examples);
    `tests/index.test.ts` 6 → 7 files; `tests/validate.test.ts` schemas 5 → 6, `validate` 7 → 9
    compositions and 14 → 18 runs, the overlays `software-exit` and `scrum-exit` 11 → 13
    compositions and 22 → 26 runs each, the publication run 14 → 18; the numbers measured, not
    assumed, and any other moved count named. `npm test` passes on Node.js 22.21.0 and on the floor
    22.12.0 in clean clones, one after the other; the branch CI `success`, recorded. No file under
    `src/` or `.wingfoil/` changes. The privacy check of the branch's diff recorded
    (`repository-practice` rule 2).

## Design

Branch `task/task-067-kanban-pack` from `main` (`074fa07`, with task-066).

**The pack** (`packs/methodology/kanban/`), from the charter: `pack.yaml`, the two fragments and
the three workflows taken from the untracked draft of plan-056 (the files run on the engine), their
descriptions rewritten as Acceptance 4 asks; `directives/{kanban,definition-of-workflow}.md`,
`agents/section.md`, `CHANGELOG.md` and `README.md` written from the charter, as `scrum`'s are
built (hand-written sections; the generated ones by `npm run index`).

**The examples**, fictional, `.example` addresses: `tests/fixtures/examples/kanban/defaults/`
(Plover Board, the draft's fictional project) and `tests/fixtures/examples/kanban/team-limits/`
(another fictional project, the limits 4 and 2 and its Service Level Expectation).

**Names:** the WingFoil 0.3.1 built-in workflows and directives and the `custom/` files of
`init --template Kanban` and `--template Scrum`, listed in a scratch project, against `kanban`,
`definition-of-workflow`, `delivery`, `release-flow` and `work-item`.

**Checks**, in order: `npm run index`, then `index -- --check`; `check:packs`; `validate`; the
overlays and the golden tree; `check:runs`; then the tests that take the counts, run first to see
which move, each moved count stated; the full suite in clean clones on both Node.js versions.

**Commits:** the pack; the examples; the moved counts; the notes. The untracked draft stays out of
every commit and is deleted after the merge (plan-057's close).

## Execution Notes

- 2026-10-30: written under plan-057 (step 2).
- 2026-10-30: independent review: approve after amendments, nothing blocking; applied: section 2 and
  section 9 of the README, the workflow names checked, the citation of spec-001 §8.2, the limits as
  a block mapping, the Service Level Expectation as a convention.
- 2026-10-30: focused re-review: approve; its nits applied. Submitted.
- 2026-10-31: Design written; `backlog → in-progress`.
- 2026-10-31: the names (Acceptance 5): in scratch projects made by WingFoil 0.3.1's `init
  --template Kanban` and `--template Scrum`, `workflows/built-in/` is empty, `workflows/custom/`
  holds `adr-ingest`, `bug-ingest`, `decision-log-ingest`, `sw-life-cycle` and `kanban-delivery`
  or `scrum-delivery`, `directives/built-in/` holds `architecture`, `code-quality`, `code-review`,
  `documentation`, `security` and `testing`, and `directives/custom/` holds `determinism`,
  `doc-versioning`, `security-secrets` and `traceability`: none is `delivery`, `release-flow`,
  `work-item`, `kanban` or `definition-of-workflow`.
- 2026-10-31: the pack and the examples (`9508437`): `pack.yaml`, the two fragments and the three
  workflows from the untracked draft of plan-056 (the workflows' descriptions rewritten), the
  directives, the AGENTS.md section, the CHANGELOG and the README written from the charter; the
  generated sections by `npm run index`. Its checks found the Node.js warning still printed by
  `npm run index` and every `validate` (the README generator's parse of a pack's raw fragments), a
  finding taken to the approver (dl-019): plan-057 ruling 6, task-070; and the CI's root audit red
  (bug-009, ruling 7, task-071). The task waited on its branch for both.
- 2026-11-01: `main` merged into the branch after task-070 and task-071 (`499395a`). Checks, with
  nothing on stderr: `index -- --check` (7 files), `check:packs` (74 files, 0 problems),
  `validate` (schemas 6, lint 74, 9 compositions, 18 runs, 0 failed, tolerance none),
  `validate:publication` (18 runs, 0 failed), the overlays `software-exit` and `scrum-exit` (13
  compositions, 26 runs each, 0 failed), the golden tree (26 runs, 0 failed) and `check:runs` (34
  runs, 0 failed). `CATALOG.md`, `catalog-index.json`, `llms.txt` and `catalog.yaml` unchanged.
- 2026-11-01, the counts moved (Acceptance 10, one commit): `tests/check-packs.test.ts` lint
  61 → 74 files; `tests/index.test.ts` 6 → 7 files; `tests/validate.test.ts` schemas 5 → 6, lint
  61 → 74, `validate` 7 → 9 compositions and 14 → 18 runs, the overlays `software-exit` and
  `scrum-exit` 11 → 13 compositions and 22 → 26 runs each, the publication run 14 → 18; their
  titles say so. No other count moved (the three test files 178 of 178).
- 2026-11-01: independent review of the build: approve after amendments, nothing blocking; it
  found the shipped workflows and fragments structurally identical to the draft run on the engine,
  and composed `base`, `software` and `kanban` on WingFoil 0.3.1 with no warning. Applied: the
  CHANGELOG's first line a whole sentence (it becomes the tag annotation); open points 2 and 3
  stated with the charter's hedges and remedy; `review`'s description the reviewer's act; the
  README's adoption steps in the charter's order and the own `kanban-delivery` wording; the
  `in-progress` policy; "reported late"; the defaults example's description. Owed: the README
  generator writes an empty `Memory types` line for `task`, whose `states` hold only `limits`, a
  change under `src/`, outside this task: a row of `docs/owed-items.md` (trigger: before
  `kanban`'s first tag).
- 2026-11-01, checks at `8cab3f6` (Acceptance 9, 10), from clean clones on Node.js 22.21.0 then
  22.12.0, one after the other: `npm ci`, `npm audit` (0), `npm test` (1035 of 1035), `lint`,
  `check:pins`, `check:schemas`, `check:packs` (74 files, 0 problems), `validate` (18 runs, 0
  failed, tolerance none), `validate:publication` (18 runs, 0 failed), the overlays
  `software-exit` and `scrum-exit` (26 runs each, 0 failed), `index -- --check` (7 files),
  `check:runs` (34 runs, 0 failed) and `workflow list`, each exit 0, no Node.js warning in either
  log. Branch CI run 41325925866 on `8cab3f6`: `success`. No file under `src/` or `.wingfoil/`
  changed. Privacy check of the branch's diff against `main`: no local or scratch path, no private
  repository or project, no real adopter in the README or the examples, no intermediary session.
  `in-progress → in-review`.
- 2026-11-01: approved by the approver (`in-review → approved`, `93dfdb9`) with the merge OK;
  merged into `main` with `--no-ff` (`88468b2`); on the merged tree `index -- --check` (7 files),
  `check:packs` (74 files, 0 problems) and the `validate`, `check-packs` and `index` tests (178 of
  178). `approved → done`.
