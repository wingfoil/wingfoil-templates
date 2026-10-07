---
id: task-006-fragment-merge-add-or-tighten-and-parameters
type: task
title: "Fragment merge (add or tighten) and parameters"
status: backlog
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-005-eslint-set-up-type-aware-and-determinism-rules"]
tags: ["tooling","W5","F3.2","F1.2"]
---

## Context

Task 5 of plan-015 (`sw-life-cycle` › `tooling`, wave W5, F3.2; it implements F1.2). Tooling task,
no pack. It is the high-uncertainty part of the composer (sequencer W5).

It comes from:
- **spec-001 §7.2:** the general merge rules: mappings by key, new keys appended in the incoming
  order; equal scalars; sets and keyed lists; nothing removed; set items are scalars compared by
  YAML type and value; keyed-list items need a unique `name`; a kind mismatch fails; an undeclared
  list is a scalar; anything else fails. Every fragment declares `format:`, one format per kind;
  the composed file carries it and `version: 1`;
- **spec-001 §7.3** (`dna.yaml` keys and rules, `approval_authority` always `false`), **§7.4**
  (`roles.yaml`: `assignments.<role>` and `global` are sets; every directive id is shipped by a pack
  of the composition or is a WingFoil built-in), **§7.5** (`memory.yaml`: defining and tightening,
  the effective machine, `defaults` and the types that derive from it, the sequence merge, gates,
  its two examples and its list of failing cases);
- **spec-001 §8:** parameter declaration (name, five types, no `{{` in any value, required without
  a default, description), the flat namespace (one declaring pack per name, scope = own and
  transitively required packs), validation of every value, substitution of `{{name}}` before
  parsing, `{{` followed by anything else left as is, single-brace WingFoil tokens untouched (§8.3);
- **adr-001:** "each example of the merge rules is a test fixture".

Scope: from the resolved packs of task-004 and the given parameter values, the substituted text of
every fragment, workflow, directive, Memory template and agents section, and the three merged
documents (`dna`, `roles`, `memory`) as data, in composition order. The parameter scope is computed
from the resolved packs (their transitive `requires`).

Ownership of the `formats` checks (spec-001 §5, §18): this task checks fragments (each declares
`format:`, equal to its pack's `formats.<kind>`, one format per kind in the composition); task 6
checks directives, workflows and Memory templates; the lint of task 9 reuses both, as it reuses the
resolver's checks.

Not in scope: writing files, the asset copy and its one-owner rule, `template.file` paths,
`workflows.yaml` and the AGENTS region (task 6); the determinism check and the validation command
(task 7); parameter values set by presets (with presets, after M1; a value is given here as the
composition's input).

The WingFoil built-in directive ids are those of the pinned WingFoil 0.2.2
(`node_modules/wingfoil/dist/storage/builtin-directives.js`): `architecture`, `code-quality`,
`code-review`, `documentation`, `security`, `testing`. They are held as data in one module, with
that source named, which task 6 reuses. Holding a copy works around a missing WingFoil interface,
so a feedback note is due (`wingfoil-feedback`); the approver asked on 2026-10-07 that feedback
notes stay untouched until wave W5 closes, when the agreed feedback mechanism is applied, so the
note is written then and this task's Execution Notes say so. spec-001 O5 and O12 stay open.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins` and
   `npm run check:schemas` exit 0; no dependency is added.
2. **Spec examples as fixtures** (adr-001), under `tests/fixtures/merge/`:
   - §7.5 first example: `base`'s `task` machine tightened by `team-mode/agent-first` then
     `stage/production` gives `[draft, pending, backlog, ready, in-progress, in-review, qa,
     approved, done]` with gates on `pending`, `ready`, `in-review`; and the spec's counterfactual:
     a stage state inserted between `backlog` and `in-progress` comes after `ready`;
   - §7.5 second example: `adr` deriving from `defaults` gets `[draft, pending, ai-review,
     approved, archived]`, and every other type deriving from `defaults` gains `archived`;
   - §7.5 "These fail composition": a sequence dropping `in-review`, a swap of two existing states,
     a changed `reject` target, a redefined `path`/`id_pattern`/`template.file`, and a `states` that
     replaces the machine each fail, naming the type and the pack. "Removing a gate" and "removing a
     required frontmatter field" have no fragment syntax (§7.2: nothing is ever removed): a later
     fragment that leaves them out merges, and the result keeps them.
3. **General rules (§5, §7.2),** each with a passing and a failing test: new keys appended in
   incoming order; unequal scalars; a set keeps base items then appends new ones, and refuses a
   mapping item; `1` and `"1"` are different set items; a keyed list merges by `name`, refuses an
   item without `name` and a duplicate `name` in one fragment; a kind mismatch; an undeclared list
   equal and unequal; a fragment without `format:`; a fragment with `version:`; a fragment whose
   `format` differs from its pack's `formats.<kind>`; two fragments of one kind with different
   `format:`; the composed documents carry the fragments' `format` and `version: 1`.
4. **`dna` (§7.3) and `roles` (§7.4):** `project.*` set once; `modules`, `stacks.*`, `team.*` keyed
   by `name`, with `roles` and `executes_as` merged as sets inside an item; `paths.<category>` sets;
   `approval_authority: true` fails in any pack; a directive id in `roles` that no pack ships and
   that is no WingFoil built-in fails.
5. **`memory` (§7.5),** each with a test:
   - definition: a top-level key other than `format`, `defaults`, `types` fails; a type defined
     without all of `path`, `id_pattern`, `template` fails; a type defined with `states` and no
     `sequence` fails; `defaults` defined by a pack other than `base` fails;
   - tightening: a key outside §7.5's table fails; redefining `path`, `id_pattern` or
     `template.file` fails, an equal value passes; `template.frontmatter.required` gains fields,
     also when the defining pack declared none;
   - sequences: a duplicate state fails; an incoming sequence without the reference sequence fails;
     two common states in opposite order fail (step 2); own states placed between, before the
     first and after the last common state, base side first (step 3); an incoming `states` without
     `sequence` adds only gates;
   - gates: a new gate on a gated state with another `reject` target fails, the same target
     passes; a gate whose state or target is not in the merged sequence fails, and one rejecting to
     itself;
   - `defaults`: a gate added to `defaults` reaches a type that already detached, and a conflicting
     `reject` on it fails; a type that detaches after `defaults` was tightened merges against the
     current `defaults` with `base`'s sequence as reference, so leaving out the state added
     earlier passes and keeps it; a type defined with its own `states` is untouched by a tightening
     of `defaults`.
6. **Parameters (§8),** each with a test:
   - declaration: a name breaking `^[a-z][a-z0-9_]*$`; a missing description; a name declared by
     two packs;
   - types, on defaults and on given values: `string` with a control character, `"` or `\` fails;
     `path` with a leading `/`, a `..` segment or a backslash fails, `a..b` and a WingFoil token
     pass; `pattern` with `/` or whitespace fails; `integer` `0x10`, `1.0` and `"3"` fail;
     `boolean` `"true"` and `yes` fail; any value containing `{{` fails;
   - values: a required parameter without a value fails, naming it and its pack; a given value
     that no pack of the composition declares fails;
   - scope: a `{{name}}` declared by a pack outside the using pack's transitive `requires` fails,
     in a fragment and in an asset; a pack may use a parameter of a pack it requires transitively;
   - substitution: `{{ name }}` with spaces and `{{other` are left as they are; `{id}`, `{n}`,
     `{slug}`, `{release}` are left as they are; it is single-pass (with `a = "{"`, `{{a}}{b}}`
     becomes `{{b}}` and stays so); `pack.yaml`, `README.md` and `CHANGELOG.md` are not
     substituted; a fragment and a workflow that no longer parse after substitution fail, naming
     the file.
7. **Determinism:** the merged documents depend only on the composition order: the same packs given
   in another request order produce deeply equal data, with equal key order.
8. `npm audit` reports 0 vulnerabilities.

## Design

Branch `task/task-006-merge`, run through `tooling-delivery` as `developer` (`code-quality`,
`testing`, `determinism`), under `npm run lint`.

- **`src/resolve.ts` (extended):** `PackManifest` gains `formats` and `parameters`; a resolved pack
  keeps its loaded `pack.yaml` (`source`), for the source text of integer defaults (§18).
- **`src/wingfoil-builtins.ts`:** the six built-in directive ids of WingFoil 0.2.2, with their
  source file named.
- **`src/parameters.ts`:**
  - `collectParameters(packs)`: one declaring pack per name;
  - value checks from the pack schema itself: the `then.properties.default` subschema of each
    parameter type, compiled once, so a given value and a default obey one grammar; plus the
    source-text check of integer defaults;
  - `parameterScopes(packs)`: per pack, its own parameters and those of its transitive `requires`;
  - `substitute(text, scope, file)`: one `replace` over `{{name}}` with names matching
    `^[a-z][a-z0-9_]*$`, so a replacement is never scanned again; a name outside the scope fails.
- **`src/merge.ts`:** the general rules of §7.2 over plain data, driven by a rule table per document
  (`set` or `keyed` per path, `[]` standing for a list item); `dna` and `roles` tables from §7.3
  and §7.4; the `approval_authority` and directive-id checks.
- **`src/memory-merge.ts`:** §7.5 as a small state machine: types (defined by, path, id_pattern,
  template, derives from `defaults` or not, own machine), `defaults` and `base`'s reference
  sequence; `mergeMachine(A, incoming, reference)` implements the three sequence steps and the gate
  rules; a tightening of `defaults` is applied to `defaults` and to every detached type that
  derives from it.
- **`src/compose-documents.ts`:** `composeDocuments(tree, catalog, request, values)`: resolve,
  parameters, read and substitute every listed file, parse YAML files, check each fragment's
  `format:` and absence of `version:`, merge in composition order. Returns the packs, the
  substituted texts by output-relevant path, and `{ dna, roles, memory }`, each starting with
  `format` and `version: 1`. Errors are `CompositionError`, naming the pack and the file.
- **Tests,** red first: `tests/parameters.test.ts`, `tests/merge.test.ts`,
  `tests/memory-merge.test.ts`, `tests/compose-documents.test.ts`; the §7.5 examples as fixture
  trees under `tests/fixtures/merge/`, written by the pack-tree helper extended with fragments'
  content and parameters.

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review:
  the two §7.5 cases that have no syntax are tested as "leaving out keeps"; the `formats` checks
  are owned (fragments here, assets in task 6, reused by task 9); fragments without `format:` or
  with `version:`; merge steps 2 and 3 and the reach of `defaults` tested directly; the missing
  definition cases; one case per §8.1 type rule; a real single-pass test; workflows parsed after
  substitution; presets deferred; the built-in directive ids' source and the deferred feedback note.
