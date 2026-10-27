---
id: task-051-the-lint-life-cycle-includes-after-dl-026-and-dl-027-and-methodology-fixture-s-where-plan-048
type: task
title: "The lint life-cycle-includes after dl-026 and dl-027, and methodology/fixture's where (plan-048)"
status: done
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

**The rule** (`src/workflow-rules.ts`). `lifeCycleProblems` keeps `sw-life-cycle`'s check; for a
methodology's `delivery` it gets the pack's own workflow documents and walks the includes:
- a breadth-first walk from `delivery` over `include` names that are workflows the pack ships, with
  a visited set; `release` and `retrospective` are reached when a visited workflow includes them;
- **part:** a visited workflow of the pack in the other part than `delivery` (`contents` against
  `conditional[0].contents.workflows`) is reported under `life-cycle-includes`, unless the
  existing `isolation` rule already reports that include (a `contents` workflow including a
  conditional one);
- **`where`:** every phase of a visited workflow whose `include` is `release` needs
  `iterate_over: release` and `where.status` equal, as a set, to `[in-development, releasing]`;
  each other `where` key must be in the composed `release`'s fields: the
  `template.frontmatter.required` of `release` in the `memory.yaml` fragments of the catalog's
  `software` pack and of the methodology, the frontmatter keys of the `release` Memory template
  shipped by either, and `id`, `type`, `title`, `status`, `tags`. The software pack is read from
  `packs` whether or not the methodology requires it (`flow`'s conditional `delivery`).
- messages cite spec-001 §9, dl-026 and dl-027 and name the workflow and the phase.

**The fixtures.**
- Test constants (`tests/support/pack-tree.ts`): `DELIVERY` becomes a `release` phase with
  `iterate_over: release` and `where: { status: [in-development, releasing] }`, then a
  `retrospective` phase; `SOFTWARE` and `SOFTWARE_COMPOSABLE` gain a `memory` fragment declaring a
  `release` type (path, id pattern, template, `frontmatter.required: []`) so the existing
  `memory-type` rule accepts the `iterate_over`.
- Golden tree (`tests/fixtures/compose/tree/`): `software` gains a `release` type in its memory
  fragment and a `release` Memory template; `methodology/kanban` and `methodology/flow` move their
  `release` phase to the iterating form. Merge examples (`tests/fixtures/merge/example-1`,
  `example-2`): the same in their `software` and `kanban`. `tests/compose-documents.test.ts`'s
  inline `include: release` follows.
- `tests/fixtures/software-exit/.../fixture/workflows/delivery.yaml`: `status: [in-development,
  releasing]`.
- Regenerated, never by hand: `tests/fixtures/compose/expected*` with `npm run compose -- --tree
  tests/fixtures/compose/tree --out <dir>` and each set's existing parameters and entries (read
  from the tests that compare them), the golden READMEs and `tests/fixtures/index/expected` with
  the index command the tests use; the merge examples' expected outputs with their own command.

**Red steps** (dl-018 R1), tests first in `tests/check-packs.test.ts` and
`tests/compose-documents.test.ts`, run on `main`'s code with `npm run build && node --test
dist/tests/check-packs.test.js dist/tests/compose-documents.test.js`:
1. a `delivery` reaching `release` and `retrospective` through a sub (two levels, two phases
   including the same sub) passes; red on `main` (`life-cycle-includes` reported);
2. an include cycle among the pack's subs with both reached passes and terminates; red;
3. a conditional `delivery` reaching a `contents` workflow is reported; red (nothing on `main`);
4. a phase including `release` with no `iterate_over`, with `status: [in-development]`, and with a
   key that is no field of the composed `release` are each reported; red; a key declared by the
   methodology's tightening (`sprint`) passes;
5. the composer accepts the nested shape and refuses a wrong `where`; red;
6. characterization (green on `main`, named as such): `release` reached by no path is reported; a
   `contents` workflow including a conditional one stays `isolation`; a pack workflow not reached
   from `delivery` that includes `release` without iterating is not reported.
Then the rule (green), then the fixtures and their regeneration, then the full suite.

**Checks:** `npm test` on 22.21 and on the floor 22.12.0 in clean clones; `npm run validate`, the
golden-tree `validate`, the overlay `validate` (7 runs, 0 failed); `npm run lint`.

**Commits** on `task/task-051-lint-life-cycle-includes`: the red tests; the rule; the fixtures and
regenerated outputs; the task's notes.

## Execution Notes

- 2026-10-26: written under plan-048 (step 1).
- 2026-10-26: reviewed with plan-048 (approve after amendments, then approve).
- 2026-10-26: Design written; `backlog → in-progress`; branch
  `task/task-051-lint-life-cycle-includes`.
- 2026-10-26, red run (dl-018 R1), on `5db5935` (the tests only, `main`'s code): `npm run build &&
  node --test --test-name-pattern="task-051" dist/tests/check-packs.test.js
  dist/tests/compose-documents.test.js`: 8 tests, 6 fail (nested reach, the cycle, the `where`
  checks, the conditional part, the composer's acceptance and refusal), 2 pass: the
  characterization test (a `release` reached by no path reported; an unreached workflow not
  checked), and the methodology's tightening (`sprint` in the `where`), green on `main` because it
  checks no `where`, kept as the guard that the new rule accepts it. The conditional-part test also
  expects `isolation` and `memory-type`: the reached workflow is always composed, includes the slot
  `release` and iterates over a type only `software` declares.
- 2026-10-26, the rule (`595a99c`): `deliveryProblems` and `releasePhaseProblems` in
  `src/workflow-rules.ts`; the composer passes a Memory template's frontmatter to the rule
  (`src/compose-documents.ts`), as the lint already reads it. The task-051 tests green.
- 2026-10-26, the fixtures (`c51bc4a`). dl-026's consequence that the golden `methodology/kanban`
  "stays valid" is superseded by dl-026 D3 and dl-027 D3 for these fixtures:
  - `tests/support/pack-tree.ts`: `DELIVERY` iterates over `release`; `SOFTWARE` and
    `SOFTWARE_COMPOSABLE` ship a `memory` fragment with a `release` type and its template
    (`RELEASE_TYPE`);
  - golden tree: `software` gains the `release` type and template (`contents.memory_templates`
    `[adr, release]`); `kanban` and `flow` iterate; merge examples `example-1`, `example-2`: the
    same in their `software` and `kanban`; `software-exit`'s fixture `where` is
    `[in-development, releasing]`;
  - regenerated with the repository's commands: `node dist/src/index-cli.js --tree
    tests/fixtures/compose/tree` (the golden `software` README), `node dist/src/compose-cli.js
    --tree tests/fixtures/compose/tree --out <set>` with each set's parameters and entries
    (`expected`, `expected-base`, `expected-flow`, `expected-flow-software`; only `expected` and
    `expected-flow-software` changed), `REFRESH_INDEX_EXPECTED=1 node --test
    dist/tests/index.test.js`.
  - Counts and expectations moved: the clean lint tree checks 22 files, not 20 (two more of
    `software`); a `software` that fails its schema now gives `memory-type` with `schema`, in
    place of `compose` (kanban's delivery iterates over a type no loaded pack declares); a
    methodology without `software` shipping `delivery` in `contents` gives `memory-type` too; the
    old `life-cycle-includes` test keeps `software`'s files; `SOFTWARE_FULL` ships `release` too.
- 2026-10-26: `npm run lint` clean; `npm run validate` passes; the golden tree's `validate` passes
  (26 runs, 0 failed); `validate --overlay tests/fixtures/software-exit` passes with 7 runs and 0
  failed. `main` merged into the branch (`21c51a1`, plan-049's elements).
- 2026-10-26: independent review of the build: request changes, two blocking findings, both on the
  tests: the conditional-part test had been red on `main` for another reason (it expected
  `isolation` and `life-cycle-includes`, and `main` reported `memory-type` too; once corrected it
  passed on `main`, through "must include release by name"), so the part check had no red-first
  evidence and the note above miscounts it; and the composer's refusal of a reached sub in the
  other part was untested. Fixed: the part test isolated (`release` iterated in `delivery`,
  `shared` with no slot, one rule expected and the message asserted); a composer test of the
  refusal; a message asserted in the `where` test; the two tests green on `main` named as
  characterization (the tightening's key; a conditional `delivery` using a field of `software`'s
  `release` without requiring `software`); `subWorkflow` and `RELEASE_TEMPLATE` shared from
  `tests/support/pack-tree.ts`; the part check tests `contents` explicitly; a malformed Memory
  template frontmatter reaches the user as a `CompositionError`.
- 2026-10-26, red run again (dl-018 R1), the branch's tests on `main`'s
  `src/workflow-rules.ts` and `src/compose-documents.ts` (`6a58e13`), in a copy outside the
  repository: `npm run build && node --test --test-name-pattern="task-051"
  dist/tests/check-packs.test.js dist/tests/compose-documents.test.js`: 10 tests, 7 fail (the
  reach, the cycle, the `where`, the conditional part: `lint: checked 29 files, 0 problems`; the
  composer's acceptance, its `where` refusal, its part refusal: `Missing expected exception`),
  3 pass, the three characterization tests. On the branch: 10 of 10 pass.
- 2026-10-26: focused re-review: approve; two cosmetic notes left as they are (an alias of
  `subWorkflow` in the two test files, the `where` test linting twice), which change no behaviour.
- 2026-10-26: the full suite in clean clones at `60d90e4`: 977 tests, 4 failed on both Node.js
  versions, expectations the change moves that the targeted runs had not covered: the golden
  tree's lint counts 71 files, not 70 (`tests/validate.test.ts`), its preset composes 20 files, not
  19 (the `release` template); the example rules' tree counts 22, not 20
  (`tests/example-rules.test.ts`); the derived "no memory fragment" composition is now `base`
  alone, since `software` always ships one (`tests/output.test.ts`). Fixed; `output`,
  `example-rules` and `validate` tests pass (44 and 57).
- 2026-10-26: the full suite in clean clones at `c0d719c`: 977 of 977 on Node.js 22.21.0 and on
  the floor 22.12.0. Branch pushed; CI run 40406847268 on `c0d719c`, conclusion `success`
  (`validate (22.12.0)` and `validate (22.21.0)` both `success`). Privacy: no local path,
  private repository or private project in the diff. `in-progress → in-review`; waiting for the
  approver's `approve` and the merge OK.
- 2026-10-27: approved by the approver; `--no-ff` merge into `main` (`ac12de6`); `approved → done`.
