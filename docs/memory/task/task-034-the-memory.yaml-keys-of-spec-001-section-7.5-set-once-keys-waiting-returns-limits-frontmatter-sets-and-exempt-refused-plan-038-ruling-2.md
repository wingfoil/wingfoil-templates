---
id: task-034-the-memory.yaml-keys-of-spec-001-section-7.5-set-once-keys-waiting-returns-limits-frontmatter-sets-and-exempt-refused-plan-038-ruling-2
type: task
title: "The memory.yaml keys of spec-001 section 7.5: set-once keys, waiting, returns, limits, frontmatter sets and exempt refused (plan-038 ruling 2)"
status: draft
pack: ""            # tooling task (tooling-change › deliver, plan-039)
depends_on: []
tags: ["tooling","base","spec"]
---

## Context

plan-039's fourth and last task: the merge of WingFoil's other `memory.yaml` keys, spec-001 §7.5
as amended by plan-038 on 2026-10-15 (plan-038 ruling 2), and the §18 checks on a fragment. It
runs on `task/task-034-memory-keys`, its Design is committed on `main`, and its `deliver` is that
branch's `--no-ff` merge, then `done` on `main` (tooling-delivery v2). No pack. W8's charters need
it: `base`'s types carry WingFoil2's states, `plan` a `parked` state (dl-022 S2).

The text it implements (§7.5's table and rules):
- a type is defined by the first pack that declares it, with `path`, `id_pattern`, `template` and
  optionally `name`, `description`, `tags`, `amendable`, `fields` (an authoring key WingFoil
  passes through) and `states`, whose keys are `sequence`, `gates`, `waiting`, `returns` and
  `limits`; `defaults.states` takes the same keys;
- `name`, `description`, `tags`, `amendable`, `fields`: a later pack's value must equal the
  defining pack's (§7.2), and a value for a key the defining pack left out fails;
- `states.waiting`: a set of states of the merged sequence; a later pack adds only its own states,
  those of its incoming sequence not on the base side at that point; repeating an entry already
  present changes nothing; a tightening of `defaults` that adds one reaches every type deriving
  from `defaults`;
- `states.returns`: maps a state to an earlier state, both of the merged sequence; a later pack's
  `states` without `returns` keeps it, one with `returns` must equal the base side;
- `states.limits`: maps a state of the merged sequence to a positive integer; a limit on a state
  without one is added; on a state with one, the smaller value wins;
- `states.gates` may gate a state in `waiting`, as any state without a gate (unchanged);
- `template.frontmatter.not_applicable_allowed` and `template.frontmatter.lists`: sets; a later
  pack adds to them only fields the same fragment adds to `required`, never a field an earlier
  pack made required;
- `template.frontmatter.exempt`: never in a pack's fragment, defining or tightening;
- §18: no fragment holds `exempt`, and `not_applicable_allowed` and `lists` name only fields the
  same fragment's `required` lists; the composer refuses what the lint rejects (§17).

What exists, at `main` `9d8a5f7` (task-031 … task-033 done), in `src/memory-merge.ts`:
- `DEFINITION_KEYS` is `path`, `id_pattern`, `template`, `states`; `TEMPLATE_KEYS` `file`,
  `frontmatter`; `FRONTMATTER_KEYS` `required`; `STATES_KEYS` `sequence`, `gates`: every other key,
  `name`, `waiting` or `exempt` among them, fails as "not allowed here", so a fragment of `base`
  with WingFoil2's `waiting` or a type's `description` cannot compose today;
- `mergeMachine` merges `sequence` and `gates`; `machineOut` writes them; `typeOut` writes `path`,
  `id_pattern`, `template` (`file`, `frontmatter.required`) and `states`, in the defining
  fragment's key order;
- the lint reaches a fragment only through the compositions of `overlay-rules.ts` (rule
  `compose`); no per-fragment rule reads `memory.yaml`;
- the §7.5 tests: `tests/memory-merge.test.ts` and the fixtures `tests/fixtures/merge/`.

Readings, stated so that the approver sees them at the gate:
- "the same fragment adds to `required`" is read as: listed in the incoming fragment's
  `required`, and not required on the base side before it; at a type's definition, the two sets
  name fields of its own `required`;
- set-once values are compared as YAML values (deep equality, key order of a mapping ignored);
- `returns` and `limits` are validated against the merged sequence after each merge (a state of
  it, `returns` pointing to an earlier state, a limit a positive integer);
- the composed `memory.yaml` writes the new keys in the defining fragment's key order, a key a
  later pack adds (`waiting`, `limits`, `not_applicable_allowed`, `lists`) appended, as §7.2 does.

Not in scope: `schema/` (a fragment has no schema of its own), any pack of `packs/` (W8), the
index and the READMEs (task-033 is done; section 5 already lists a type's states).

## Acceptance

Run from a clean clone of `task/task-034-memory-keys`, on Node.js 22.21 and the floor 22.12.0.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check`, `npm run validate`
   and `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden` exit 0;
   no dependency is added.
2. **The merge** (`tests/memory-merge.test.ts`), a test for each row of §7.5's table and each of
   its failures: a definition with every key, written back in its order; each set-once key equal
   (passes), different (fails), or set where the defining pack left it out (fails); `waiting`
   added for an own state (passes), for a state on the base side (fails), repeated (no change),
   added by a tightening of `defaults` and reaching a type that derives from it, including one
   already detached; `returns` kept when absent, equal (passes), different or added (fails), a
   target not earlier (fails); `limits` added, lowered, kept at the smaller value when raised,
   not a positive integer (fails), on a state not in the sequence (fails); a gate on a `waiting`
   state (passes); `not_applicable_allowed` and `lists` for a field the fragment adds to
   `required` (passes), for a field an earlier pack required or the fragment does not list
   (fails); `exempt` at a definition and at a tightening (fails).
3. **The composition** (`tests/compose-documents.test.ts`): a type with these keys, defined by
   `base` and tightened by an overlay, composes into the expected `memory.yaml`; the golden
   tree's composition is unchanged byte for byte (its fragments use none of the new keys).
4. **§18** (`tests/check-packs.test.ts`): `exempt` in a fragment, and `not_applicable_allowed` or
   `lists` naming a field the fragment's own `required` does not list, are reported by the lint
   (a rule of their own on the pack's fragment, so a pack no composition reaches is judged too)
   and refused by the composer, a test each.
5. **Nothing else changes:** `git diff --name-only` over the task's commits shows only `src/`,
   `tests/` and this element; `schema/`, `catalog.yaml`, `compat.yaml` and `index/` unchanged;
   `tests/fixtures/compose/expected*` unchanged.
6. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
   `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
