---
id: task-044-spec-001-section-7.5-and-the-merge-require-template.frontmatter-on-every-memory-type-a-pack-defines-plan-045-ruling-g
type: task
title: "spec-001 section 7.5 and the merge require template.frontmatter on every Memory type a pack defines (plan-045 ruling G)"
status: approved
pack: ""            # tooling task (tooling-change › deliver, plan-045 ruling G)
depends_on: []
tags: ["tooling","spec","memory"]
---

## Context

plan-045's ruling G (the approver, 2026-10-22): WingFoil 0.3.0 refuses a Memory type without
`template.frontmatter` (found at plan-042, task-035's build; carried by plan-043's ruling Q), while
spec-001 §7.5 lets the pack that defines a type declare none (its table:
`template.frontmatter.required` "add fields (set), including when the defining pack declared none").
`base` declares it on its three types; nothing stops another pack from omitting it, and only the
matrix would find it. This task makes spec-001 require it and the tooling enforce it, so that the
lint stops such a pack before the matrix does.

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
   the least form that 0.3.0 accepts, named in the Execution Notes with 0.3.0's version line and
   the scratch commit; if 0.3.0's refusal differs from plan-042's record, it goes to the approver
   (dl-019). (The body's review ran the probe: the least form is `template.frontmatter.required`
   present, even empty; `{}` is refused.)
2. **spec-001, amended in place** (approved by this task's merge OK, as task-036's): §7.5's
   "Defining and tightening" bullet says a type's `template` carries that form; its table row's
   "including when the defining pack declared none" becomes "including when the defining pack's
   `required` is empty" (adjusted to the form Acceptance 1 finds); §7.5's "These fail
   composition" list gains the type's first definition without it;
   §18 gains the bullet for the refusal; an Execution Note on spec-001 lists the change and its
   approval.
3. **The merge** refuses a type's first definition without that form, naming the type, the pack and
   spec-001 §7.5; a later pack restating `path`, `id_pattern` or `template.file`, or adding
   `required` fields to an existing type, is unaffected.
4. **Red first** (dl-018): the tests come before the code and fail on it, their red run recorded:
   - `tests/memory-merge.test.ts`: the refusal (no `template.frontmatter`, and each form 0.3.0
     refuses, `{}` included); "adds required fields, also when the defining pack declared none"
     becomes the refusal, beside an accepting case on a type defined with the least form (for
     example `required: []`); a restatement by a later pack still accepted; "keeps the defining
     fragment key order, and an empty frontmatter" moves to the least form or becomes a refusal;
     "refuses a type without states when no pack defined defaults" keeps its own refusal (its type
     gains the form, or the check runs after the defaults check);
   - `tests/check-packs.test.ts`: a pack whose type lacks it is reported by the lint, with the
     merge's message.
5. **The fixtures and tests that move**, listed in the Execution Notes with what each gains:
   `tests/fixtures/merge/example-1` and `example-2` (`task`, `adr`, `bug`; §7.5's example text
   shows only tightening fragments and does not move), and the inline trees of
   `tests/check-packs.test.ts`, `tests/compose-documents.test.ts`, `tests/memory-merge.test.ts`
   and `tests/output.test.ts`. `tests/fixtures/compose/tree/`, `tests/fixtures/compose/expected*/`,
   `tests/fixtures/index/expected/` and `packs/base/` stay byte-identical.
6. **Green:** the whole suite passes; from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`,
   `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`,
   `index -- --check` and `workflow list` exit 0; the CI run on the branch is `success` and
   recorded; after the merge, `main`'s CI too.

## Design

- **The probe** (Acceptance 1), in the scratchpad: WingFoil 0.3.0 from `src/matrix/wingfoil-0.3.0/`,
  `wingfoil init --template Kanban`, a custom `probe` type in four forms, one commit each; outputs
  copied into the Execution Notes.
- **The rule:** in `MemoryMerge.define` (`src/memory-merge.ts`), after `readFrontmatter`, a type
  whose `template.frontmatter.required` is absent fails through `fail()` (which names the type and
  the pack), citing spec-001 §7.5; `tighten`, which also reads the frontmatter, is unchanged. The
  check runs after `define`'s existing refusals, so their messages stay first.
- **Red first:** the new and rewritten cases of `tests/memory-merge.test.ts` and one case of
  `tests/check-packs.test.ts` (a pack whose type lacks the form, reported by the lint) committed
  before the code; the red run recorded.
- **The fixtures:** each type definition in the listed fixtures and inline trees gains
  `template: { frontmatter: { required: [...] } }` (an existing `template.file` keeps its place),
  with the fields its tests already assume, or `required: []` where none.
- **spec-001:** §7.5's "Defining and tightening" bullet, its table row, its "These fail
  composition" list, §18, and an Execution Note.
- **Commits** on `task/task-044-template-frontmatter`: the red tests; the rule with the fixtures;
  spec-001; the notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-24: independent review of the body: approve after amendments; no ruling changed. The
  reviewer ran Acceptance 1's probe on 0.3.0 (no frontmatter and `{}` refused, `required: []` and a
  non-empty `required` accepted) and a one-line patch of the merge's `define` (74 of 941 fail:
  `check-packs`, `compose-documents`, `memory-merge`, `output`; the golden tree and
  `readme-generate` pass). Applied: §7.5's wording follows the least form, not "declared none";
  an accepting case beside the refusal; two more moving tests; `readme-generate` dropped from the
  list and the golden tree added to the unchanged ones; the Context's source of the finding.
- 2026-10-24, the probe (Acceptance 1): WingFoil `0.3.0 (cc31d7a8ca3940c6ec96dca4e0ef77f32f52dfb1)`,
  from `src/matrix/wingfoil-0.3.0/`, `wingfoil init --template Kanban`, a custom `probe` type
  committed in four forms (scratch commits `b84f7ed`, `4d64e4e`, `ac67b6f`, `7c63fc6`):
  - no `template.frontmatter`: `workflow list --format json` exit 1, `E_VALIDATION
    types.probe.template.frontmatter … expected object, received undefined`; `memory add` exit 1,
    "cannot resolve the memory type registry";
  - `frontmatter: {}`: exit 1, `E_VALIDATION types.probe.template.frontmatter.required … expected
    array, received undefined`; `memory add` exit 1;
  - `required: []`: exit 0, `diagnostics: []`; `memory add` exit 0;
  - `required: [id, title]`: exit 0, `diagnostics: []`; `memory add` exit 0.
  The least form is `template.frontmatter.required` present, even empty; it agrees with plan-042's
  record, so nothing goes to the approver.
- 2026-10-24, red (`958e643`): the new tests before the rule: `memory-merge` and `check-packs`, 2
  failed of 149 (the two refusals; the accepting and restatement cases already pass).
- 2026-10-24, the rule and the fixtures (`6744fdf`): the rule alone failed 76 of 945 tests
  (`check-packs` 12, `compose-documents` 16, `memory-merge` 61, `output` 7, counting suites);
  every type definition of the fixtures and inline trees gained `frontmatter: { required: [] }`
  (`tests/fixtures/merge/example-1` and `example-2`, and `tests/check-packs.test.ts`
  `SOFTWARE_FULL`, `tests/compose-documents.test.ts`, `tests/memory-merge.test.ts`'s `BASE` and
  definition cases, `tests/output.test.ts`'s `noteType`); restatements stay bare. Moved:
  "keeps the defining fragment key order, and an empty required" (`{}` → `required: []`); "adds
  required fields, also when the defining pack's required is empty" (renamed; the refusal and the
  accepting case are the new describe); "refuses a type without states when no pack defined
  defaults" keeps its refusal (its type gained the form, and the rule runs after it).
  `tests/fixtures/compose/`, `tests/fixtures/index/expected/` and `packs/base/` unchanged.
- 2026-10-24, spec-001 (`eb9d251`): §7.5's definition bullet, its table row, its "These fail
  composition" list, §18, an Execution Note.
- 2026-10-24: independent review of the branch: approve after amendments (the reviewer reran the
  red against the old merge: 2 failures; the full suite 945 of 945). Applied (`a9b6af2`): a
  tightening case left bare; the lint test pins the message's `spec-001 §7.5`; spec-001's last
  line.
- 2026-10-24, `a9b6af2`: from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`
  (945 of 945), `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`,
  `index -- --check` and `workflow list` exit 0. CI run 40091343228: `success`.
- 2026-10-24: approved by the approver; merged into `main` (`97d1f59`), `approved → done`; the merge OK approves spec-001's amendment.

