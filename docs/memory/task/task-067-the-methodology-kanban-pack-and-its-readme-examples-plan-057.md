---
id: task-067-the-methodology-kanban-pack-and-its-readme-examples-plan-057
type: task
title: "The methodology/kanban pack and its README examples (plan-057)"
status: draft
pack: "pack-methodology-kanban"
depends_on: [task-066]
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

1. **`packs/methodology/kanban/pack.yaml`**: `format: 1`, `id: methodology/kanban`,
   `axis: methodology`, `name: kanban`, `title: "Kanban"`, a `description` naming the Kanban Guide
   (May 2025), the flow under WIP limits and releases decided by **the Product Owner** (not "the
   approver", plan-056's nit N2), `version: 1.0.0`, `formats` exactly for the kinds shipped
   (`roles`, `memory`, `workflow`, `directive`, all 1), `requires: [base@^2, software@^1]`
   (plan-057 ruling 1), `requires_capabilities: [workflow-engine]`, no `conflicts`, no
   `conditional`; the parameters `wip_in_progress` (integer, default 2), `wip_in_review` (integer,
   default 1), `service_level_expectation` (string, default `"85% of work items finish within 10
   days"`), each with a description; `contents` lists every file below and nothing else.
2. **`fragments/memory.yaml`** (`format: 1`): `task` tightened with
   `template.frontmatter.required: [release]`, `template.frontmatter.not_applicable_allowed:
   [release]` and `states.limits: { in-progress: {{wip_in_progress}}, in-review: {{wip_in_review}} }`,
   the parameters unquoted (spec-001 §7.5, §8.2); nothing else.
3. **`fragments/roles.yaml`** (`format: 1`): `assignments`: `product-owner: [kanban]`,
   `facilitator: [kanban]`, `developer: [kanban, definition-of-workflow]`,
   `reviewer: [definition-of-workflow]`, `qa: [definition-of-workflow]`. No `dna.yaml` fragment.
4. **The workflows**, as the charter's table states them, each `format: 1`, no key newer than
   WingFoil 0.3.0, every phase with its role or an include, each phase's `description` saying what
   the role does, including what a step cannot bind (a task's `release`, a release's `version` and
   `release-line`, written by editing the draft or with `--set`, F-034):
   - `delivery` (`kind: sub`, no `element`): `plan-release` (product-owner;
     `memory.add(type: release)`, `memory.submit`, `memory.submit`; produces
     `{ type: release, path: "{{release_path}}" }`; its description says later releases are added
     outside a step and keeping one release open) → `releases` (`iterate_over: release`,
     `where: { status: [in-development, releasing] }`, `include: release-flow`);
   - `release-flow` (`kind: sub`, `element: release`): `work` (`iterate_over: task`,
     `where: { status: [backlog, in-progress, in-review, approved], release: "{release.version}" }`,
     `include: work-item`) → `release` (`iterate_over: release`, `where: { status:
     [in-development, releasing], version: "{release.version}" }`, `include: release`) →
     `retrospective` (`include: retrospective`); `release`'s description states the rule that a
     release moves to `releasing` only once its tasks are done or moved (plan-056 ruling 11);
   - `work-item` (`kind: sub`, `element: task`): `start` (developer; `memory.submit`, within the
     limit) → `build` (developer; `agent.execute`) → `review` (reviewer; `memory.submit`, within the
     limit) → `approve` (approver; `memory.approve`, `approval: { by_role: approver }`,
     `fallback: { step: build }`) → `done` (developer; `memory.submit`). No `element.set_state`:
     WingFoil checks a limit inside its verbs.
5. **The directives** `directives/kanban.md` and `directives/definition-of-workflow.md`, with
   WingFoil 0.3.0's directive frontmatter (`id`, `name`, `type: directive`, `kind: built-in`,
   `title`, `format: 1`), written as rules from the charter's Directives paragraph: `kanban` (the
   Guide's three practices; pull within the limits, never past them, and a state a reject pushed
   over its limit brought back within it before anything else moves into it; the four flow
   measures read from the tasks' history in Memory; the Service Level Expectation,
   `{{service_level_expectation}}`, an item older than it handled first; one release kept open, a
   release moved to `releasing` only once its tasks are done or moved; the workflow improved at
   each release's retrospective; releases decided by the Product Owner; the agent never
   approving); `definition-of-workflow` (generic: units of value, started and finished points, the
   states, the limits `{{wip_in_progress}}` and `{{wip_in_review}}`, each state's policies, the
   Service Level Expectation; overridden by a project in `custom/` with the same id). No word
   "replenishment", no Definition of Done, no estimation technique. Neither id equals a WingFoil
   0.3.0 or 0.3.1 built-in directive id (`directives list` with no warning, `pack-compatibility`).
6. **`agents/section.md`**: a level-2 section `## Kanban`, no level-1 heading, no markers, as the
   charter's paragraph states it (the limits, one item's flow through `work-item`, the Service
   Level Expectation, a task's `release` field, releases decided by the Product Owner and moved to
   `releasing` only once their tasks are done or moved, `{{agent_name}}` never approving); it names
   `delivery`.
7. **`CHANGELOG.md`** with `- 1.0.0: …` naming what the first version holds, and **`README.md`**
   per spec-002 §2: generated sections by `npm run index`; section 3 opening with §2.3's temporary
   mark, linking `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install`,
   with the charter's Adoption for any project (the first open release, a `release` on every open
   task, releases already `released` left out, a project over a limit moving tasks out first, the
   `custom/` `kanban-delivery` `init` writes removed, bug-007), no WingFoil CLI command in code
   (CB-3); step 3 states that the "own entries" a project re-adds are those it wrote itself, not the
   Memory types, roles or workflows `init` scaffolded (the owed row "README step 3 'own entries'",
   answered for `kanban`); "Sources and adaptations" citing the Kanban Guide, May 2025 edition
   (v2025.5, kanbanguides.org), and the charter's eight adaptations, the retrospective's bullet
   being the charter's (bug-008's effect and `explore`'s weak evidence, plan-056 ruling 12); the
   limits' count over every branch WingFoil sees (the charter's open point 2) stated; section 7
   linking its examples. The README names no real adopter.
8. **The examples** (spec-002 §2.4, fictional projects only, `.example` addresses, `packs`
   naming `software@^1` and `methodology/kanban@^1`): `tests/fixtures/examples/kanban/defaults/`
   (every parameter on its default) and `tests/fixtures/examples/kanban/team-limits/`
   (`wip_in_progress: 4`, `wip_in_review: 2`, `service_level_expectation: "85% of work items finish
   within 7 days"`, paths on their defaults), each described in section 7 with its `Fixture:` line,
   a fictional situation, what the project gets and how one phase runs; each composes and
   validates. `base`'s, `software`'s and `scrum`'s READMEs and examples unchanged.
9. **Validation:** `npm run check:packs`, `npm run index -- --check` and `npm run validate` pass
   with no warning; every new composition passes WingFoil 0.3.0's and 0.3.1's matrix (`tolerance
   applied: none`); the overlays `software-exit` and `scrum-exit` pass with 0 failed; the golden
   tree's `validate` passes; `npm run check:runs` passes (its count unchanged: no scenario names
   `kanban`'s examples before task-068). `catalog.yaml`, `CATALOG.md`, `catalog-index.json` and
   `llms.txt` unchanged (an unpublished pack, spec-002 §3.1).
10. **Tests:** the counts the tooling tests take on this repository move, each stated in the
    Execution Notes with the test it changes (dl-018): `tests/check-packs.test.ts` and
    `tests/validate.test.ts` lint 61 → 74 files (11 pack files and 2 examples); `tests/index.test.ts`
    6 → 7 files; `tests/validate.test.ts` schemas 5 → 6, `validate` 7 → 9 compositions and 14 → 18
    runs, the overlays `software-exit` and `scrum-exit` 11 → 13 compositions and 22 → 26 runs each,
    the publication run 14 → 18; the numbers measured, not assumed, and any other moved count
    named. `npm test` passes on Node.js 22.21.0 and on the floor 22.12.0 in clean clones, one after
    the other; the branch CI `success`, recorded. No file under `src/` or `.wingfoil/` changes. The
    privacy check of the branch's diff recorded (`repository-practice` rule 2).

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-30: written under plan-057 (step 2).
