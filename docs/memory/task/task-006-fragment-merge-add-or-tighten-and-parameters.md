---
id: task-006-fragment-merge-add-or-tighten-and-parameters
type: task
title: "Fragment merge (add or tighten) and parameters"
status: pending
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
every fragment and asset, and the three merged documents (`dna`, `roles`, `memory`) as data, in
composition order. Not in scope: writing files, the asset copy and its one-owner rule,
`template.file` paths, `workflows.yaml` and the AGENTS region (task 6); the determinism check and
the validation command (task 7). The WingFoil built-in directive ids are those of the pinned
WingFoil 0.2.2 (`architecture`, `code-quality`, `code-review`, `documentation`, `security`,
`testing`), held as data with that source named; spec-001 O5 and O12 keep the question open.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins` and
   `npm run check:schemas` exit 0; no dependency is added.
2. **Spec examples as fixtures** (adr-001), under `tests/fixtures/merge/`:
   - §7.5 first example: `base`'s `task` machine tightened by `team-mode/agent-first` then
     `stage/production` gives `[draft, pending, backlog, ready, in-progress, in-review, qa,
     approved, done]` with gates on `pending`, `ready`, `in-review`;
   - §7.5 second example: `adr` deriving from `defaults` gets `[draft, pending, ai-review,
     approved, archived]`, and every other type deriving from `defaults` gains `archived`;
   - §7.5 "These fail composition": each of the six cases fails, naming the type and the pack.
3. **General rules (§7.2),** each with a passing and a failing test: new keys appended in incoming
   order; unequal scalars; a set keeps base items then appends new ones, and refuses a mapping item;
   `1` and `"1"` are different set items; a keyed list merges by `name`, refuses an item without
   `name` and a duplicate `name` in one fragment; a kind mismatch; an undeclared list equal and
   unequal; two fragments of one kind with different `format:`; the composed documents carry the
   fragments' `format` and `version: 1`.
4. **`dna` (§7.3) and `roles` (§7.4):** `project.*` set once; `modules`, `stacks.*`, `team.*` keyed
   by `name`, with `roles` and `executes_as` merged as sets inside an item; `paths.<category>` sets;
   `approval_authority: true` fails in any pack; a directive id in `roles` that no pack ships and
   that is no WingFoil built-in fails.
5. **`memory` (§7.5):** a key other than `format`, `defaults`, `types` fails; redefining `path`,
   `id_pattern` or `template.file` fails, an equal value passes; `template.frontmatter.required`
   gains fields, also when the defining pack declared none; a type defined with `states` and no
   `sequence` fails; an incoming sequence that drops or swaps a reference state fails; a duplicate
   state fails; a new gate on a gated state with another `reject` target fails, the same target
   passes; a gate whose state or target is not in the merged sequence fails, and one rejecting to
   itself; an incoming `states` without `sequence` adds only gates; a type defined with its own
   `states` is untouched by a tightening of `defaults`.
6. **Parameters (§8):** each with a test: a name breaking `^[a-z][a-z0-9_]*$`; each of the five
   types with a valid and an invalid value (defaults, given values); a `{{` in any value; a
   required parameter without a value fails, naming it and its pack; a name declared by two packs;
   a `{{name}}` outside the pack's scope (declared by a pack it does not require) fails; a pack may
   use a parameter of a pack it requires transitively; `{{ name }}` with spaces and `{{other` are
   left as they are; `{id}`, `{n}`, `{slug}`, `{release}` are left as they are; substitution is
   single-pass (a value containing `{name}` is not expanded again); `pack.yaml`, `README.md` and
   `CHANGELOG.md` are not substituted; a YAML fragment that no longer parses after substitution
   fails, naming the file.
7. **Determinism:** the merged documents depend only on the composition order: the same packs given
   in another request order produce deeply equal data, with equal key order.
8. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
