---
id: task-051-the-lint-life-cycle-includes-after-dl-026-and-dl-027-and-methodology-fixture-s-where-plan-048
type: task
title: "The lint life-cycle-includes after dl-026 and dl-027, and methodology/fixture's where (plan-048)"
status: backlog
pack: ""            # tooling task (tooling-change › deliver, plan-048)
depends_on: []
tags: ["tooling","lint"]
---

## Context

dl-026 and dl-027 (approved 2026-10-26, plan-047) amend `software`'s `delivery` contract and
spec-001 §9 and §18:
- a methodology's `delivery` includes `release` and `retrospective` directly or through
  sub-workflows the same methodology ships, at any depth, each shipped in the same part as
  `delivery` (`contents` or the conditional part, spec-001 §6.5); a sub may be included by several
  phases, and `release` need not be reached on every path (dl-026 D1);
- every phase that includes `release` iterates over `release` with a `where` whose `status` is
  `[in-development, releasing]`; any other key of that `where` is a frontmatter field the
  composed `release` type declares, the methodology's own tightening included; key values are not
  checked (dl-027 D1, D3).

`life-cycle-includes` (`src/workflow-rules.ts`, `lifeCycleProblems`) checks today only that
`workflows/delivery.yaml` itself includes `release` and `retrospective` by name; it reads no
`where`. The composer applies the same rules, so it refuses `scrum`'s accepted shape, whose `sprint`
sub includes both. dl-026 D3 and dl-027 D3 name this task; dl-027 D5 moves `methodology/fixture`'s
`where` here, agreed with plan-046's session, which owned the fixture.

## Acceptance

`npm run build` precedes the commands.

1. **Reach.** For a methodology's `delivery`, the rule follows `include` names only into
   workflows the pack itself ships, with a visited set (an include cycle neither loops nor
   errors); it reports `life-cycle-includes` when `release` or `retrospective` is reached from
   `delivery` by no path; it reports nothing when either is reached through one of the pack's
   subs, at any depth, or by several phases.
2. **Part.** A workflow of the pack reached from `delivery` that the pack ships in another part
   than `delivery` (`contents` against the conditional part) is reported under
   `life-cycle-includes` (spec-001 §18, dl-026 D1), where `isolation` does not already report it.
3. **`where`.** Every phase, in `delivery` or in a workflow it reaches, whose `include` is
   `release` is reported unless it has `iterate_over: release` and a `where` whose `status` is
   exactly `[in-development, releasing]` (any order). A further key is reported unless it is a
   field of the composed `release`: `software`'s `release` (its `template.frontmatter.required` and
   its memory template's frontmatter keys), whether or not the methodology requires `software`,
   plus the methodology's own `memory.yaml` tightening; the keys every element carries (`id`,
   `type`, `title`, `status`, `tags`) count as fields. A key's value is not checked. A phase that
   includes `release` in a pack workflow `delivery` does not reach is not checked, as today.
4. **Messages** name the rule as amended (spec-001 §9, dl-026, dl-027) and the phase or the
   workflow they concern; `software`'s `sw-life-cycle` check is unchanged.
5. **The composer** applies the same rule (`checkWorkflows`, shared `workflowProblems`): a test of
   the composition accepts a methodology whose `release` and `retrospective` are reached through a
   sub, and refuses a wrong `where` and a reached sub in the other part.
6. **Fixtures.** Every fixture methodology whose `delivery` includes `release` follows the rule;
   dl-026's consequence that the golden `methodology/kanban` "stays valid" is superseded by dl-026
   D3 and dl-027 D3 for these fixtures:
   - `tests/fixtures/software-exit/packs/methodology/fixture/workflows/delivery.yaml` moves to
     `status: [in-development, releasing]` (dl-027 D5);
   - the golden tree (`tests/fixtures/compose/tree/`, `methodology/kanban` and `methodology/flow`)
     and the merge examples (`tests/fixtures/merge/`), whose `software` declares no `release`
     type, gain one as the Design decides, with their `contents`, templates and READMEs;
   - the test constants `DELIVERY` (`tests/support/pack-tree.ts`), `SOFTWARE` and
     `SOFTWARE_COMPOSABLE` follow;
   - the expected outputs (`tests/fixtures/compose/expected*`, `tests/fixtures/index/expected`)
     are regenerated with the repository's commands (`npm run compose -- --tree
     tests/fixtures/compose/tree --out <dir> …` for each set, `npm run index`), never by hand.
   A fixture that cannot follow the rule goes to the approver (dl-019).
7. **Validation.** `npm run validate` passes; `npm run validate -- --tree
   tests/fixtures/compose/tree --param project_name=Golden` passes; `npm run validate --
   --overlay tests/fixtures/software-exit` passes with 7 matrix runs and 0 failed; the fixture
   README's generated sections stay in step (`tests/readme-generate.test.ts`).
8. **Red first** (dl-018 R1): each test the change makes pass is written first and is red on
   `main`'s lint, each red run recorded in the Execution Notes (command and failing count); a test
   already green there (a `release` reached by no path, a `contents` workflow including a
   conditional one) is named as characterization (`testing` directive); the counts the change
   moves are stated.
9. **Tests:** `npm test` passes on Node.js 22.21 and on the floor 22.12.0, in clean clones; the CI
   run on the branch is `success` and recorded. No file under `packs/` or `.wingfoil/` changes; no
   new dependency.

## Design

<!-- The red steps, written at design (dl-018): what is tested first and how. -->

## Execution Notes

- 2026-10-26: written under plan-048 (step 1).
- 2026-10-26: reviewed with plan-048 (approve after amendments, then approve).
