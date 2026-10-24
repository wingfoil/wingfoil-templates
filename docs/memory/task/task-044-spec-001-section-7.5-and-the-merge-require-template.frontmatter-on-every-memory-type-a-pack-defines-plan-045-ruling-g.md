---
id: task-044-spec-001-section-7.5-and-the-merge-require-template.frontmatter-on-every-memory-type-a-pack-defines-plan-045-ruling-g
type: task
title: "spec-001 section 7.5 and the merge require template.frontmatter on every Memory type a pack defines (plan-045 ruling G)"
status: draft
pack: ""            # tooling task (tooling-change › deliver, plan-045 ruling G)
depends_on: []
tags: ["tooling","spec","memory"]
---

## Context

plan-045's ruling G (the approver, 2026-10-22): WingFoil 0.3.0 refuses a Memory type without
`template.frontmatter` (found at plan-042, ruling Q), while spec-001 §7.5 lets the pack that defines
a type declare none (its table: `template.frontmatter.required` "add fields (set), including when
the defining pack declared none"). `base` declares it on its three types; nothing stops another
pack from omitting it, and only the matrix would find it. This task makes spec-001 require it and
the tooling enforce it, so that the lint stops such a pack before the matrix does.

The rule lives where a type's definition is known: the merge (`src/memory-merge.ts`, beside its
`template.frontmatter.exempt` refusal). A later pack may restate an equal `path`, `id_pattern` and
`template.file` (spec-001 §7.5, `tests/memory-merge.test.ts` "accepts equal path, id_pattern and
template file"); that is not a definition, and the rule does not apply to it. The lint reports the
refusal through the compositions it already runs (spec-001 §18: the composer refuses what the lint
rejects).

## Acceptance

`npm run build` precedes the commands; tests run by `npm test` unless named.

1. **What 0.3.0 accepts, recorded first.** In a scratch project with WingFoil 0.3.0 (`npm ci` from
   `src/matrix/wingfoil-0.3.0/`, `wingfoil init --template Kanban`), a custom Memory type declared
   with no `template.frontmatter`, with `frontmatter: {}`, with `required: []`, and with a
   non-empty `required`; for each, `wingfoil workflow list --format json` and
   `memory add --type <it>` with their exit codes and messages. The rule and the amendment require
   the least form that 0.3.0 accepts, named in the Execution Notes; if 0.3.0's refusal differs from
   plan-042's record, it goes to the approver (dl-019).
2. **spec-001, amended in place** (approved by this task's merge OK, as task-036's): §7.5's table
   row drops "including when the defining pack declared none" and says the defining pack declares
   that form; §7.5's "These fail composition" list gains the type's first definition without it;
   §18 gains the bullet for the refusal; an Execution Note on spec-001 lists the change and its
   approval.
3. **The merge** refuses a type's first definition without that form, naming the type, the pack and
   spec-001 §7.5; a later pack restating `path`, `id_pattern` or `template.file`, or adding
   `required` fields to an existing type, is unaffected.
4. **Red first** (dl-018): the tests come before the code and fail on it, their red run recorded:
   - `tests/memory-merge.test.ts`: the refusal (no `template.frontmatter`, and each form 0.3.0
     refuses); "adds required fields, also when the defining pack declared none" becomes the
     refusal; a restatement by a later pack still accepted;
   - `tests/check-packs.test.ts`: a pack whose type lacks it is reported by the lint, with the
     merge's message.
5. **The fixtures and tests that move**, listed in the Execution Notes with what each gains:
   `tests/fixtures/merge/example-1` and `example-2` (spec-001 §7.5's examples, so §7.5's example
   text moves with them if it shows a type without it), and the inline trees of
   `tests/check-packs.test.ts`, `tests/compose-documents.test.ts`, `tests/memory-merge.test.ts`,
   `tests/output.test.ts` and `tests/readme-generate.test.ts`. `tests/fixtures/compose/expected*/`,
   `tests/fixtures/index/expected/` and `packs/base/` stay byte-identical.
6. **Green:** the whole suite passes; from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`,
   `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`,
   `index -- --check` and `workflow list` exit 0; the CI run on the branch is `success` and
   recorded; after the merge, `main`'s CI too.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
