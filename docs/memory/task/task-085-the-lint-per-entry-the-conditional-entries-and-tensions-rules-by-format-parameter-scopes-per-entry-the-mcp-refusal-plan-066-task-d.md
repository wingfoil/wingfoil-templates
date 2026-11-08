---
id: task-085-the-lint-per-entry-the-conditional-entries-and-tensions-rules-by-format-parameter-scopes-per-entry-the-mcp-refusal-plan-066-task-d
type: task
title: "The lint per entry: the conditional entries' and tensions' rules by format, parameter scopes per entry, the mcp refusal (plan-066 task D)"
status: draft
pack: ""            # tooling task (tooling-delivery v3), plan-066 task (D)
depends_on: ["task-084-the-composer-per-entry-active-entries-their-order-and-parameter-scopes-the-notices-of-tensions-the-mcp-refusal-plan-066-task-c"]
tags: ["tooling","format","lint"]
---

## Context

plan-066 (rulings 1, 2, 6 and 9), its fourth task, after task-084 (the composer per entry).
spec-001 §18 at format 2: `conditional` by the file's format, in format 2 each `with` naming a
catalog pack composed earlier (§7.1), at most one entry per pack id, no `with` naming a pack of
`requires` or `conflicts`; `tensions` naming a catalog pack id other than the pack, at most once,
not in `conflicts`, a format-1 `pack.yaml` having none; every `{{name}}` in its part's scope, each
entry its own (§6.5, §8.1). Ruling 6: a pack shipping `mcp` refused by the lint too.

What task-084 left here (its Context and notes): the composer, and so the lint, already reads per
entry and by format the inventory, `formats`, slots, `delivery`'s part, the foundation rule and
`workflowProblems` (isolation, known names per entry). What the lint does not check yet:
- the manifest's rules on `with` beyond `software` and on `tensions` (format 1's limits are the
  v1 schema's; format 2's schema leaves these to the lint, its `$comment` says so);
- the parameter scopes of `src/pack-files.ts` (`readPackFiles`, `scopeOf`): every entry's files get
  `software`'s scope, whatever their `with`;
- the `mcp` refusal: `mcpProblems` (`src/pack-rules.ts`) is called by the resolver only.

Not here: §7.6's one owner and §9's slots on the compositions with an entry's pack left out in
turn, and the overlay lint's legs per entry, both D6's coverage, task (F); the waiver heuristic,
task (E); the `mcp` kind's own rules (its row). No published pack moves to format 2 (plan-063
ruling 3): fixture packs only (ruling 2).

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 2 … 5 committed before the code, so that the
   build passes and they fail by assertion, except any already green on `main` (recorded as such);
   the failing run recorded with its command and count.
2. **`conditional` at format 2** (`check:packs`, rule `conditional`, each problem at
   `/conditional/<index>/with`): an entry's `with` names a pack of the tree (`packs/<id>`); the
   pack itself; a pack of its `requires` or `conflicts`; a pack id named by an earlier entry; a pack
   not composed earlier, read statically from §7.1: a foundation pack is earlier than every
   non-foundation pack, `base` earlier than `software`, and a non-foundation pack earlier when its
   axis comes earlier in `catalog.yaml`'s order; a `with` naming a pack of the pack's own axis is
   refused (§7.1 orders that axis by `requires`, which a `with` is not, so no order is guaranteed).
   Each a problem naming the pack, the entry's `with` and the rule. Format 1's limits stay the v1
   schema's (one entry, `software@^<major>`), unchanged.
3. **`tensions`** (rule `tensions`, at `/tensions/<index>/pack`): an entry naming the pack itself,
   a pack id named by an earlier entry, a pack of `conflicts`, or no pack of the tree is a problem
   naming the pack and the entry; a format-1 `pack.yaml` with `tensions` stays the v1 schema's
   refusal.
4. **Parameter scopes per entry** (rule `parameter-scope`, §8.1, §6.5): an entry's files may use
   the parameters of the pack, of the packs it reaches through `requires`, and of the entry's
   `with` pack with the packs that one reaches, and no other entry's `with` pack's; a format-1
   pack's entry keeps `software`'s scope, as today.
5. **The `mcp` refusal** (rule `mcp`): `check:packs` reports a pack whose `contents.fragments` or
   `formats` holds `mcp`, with the resolver's message (plan-066 ruling 6), until the row of the
   `mcp` kind's tooling.
6. **The tests** (`tests/check-packs.test.ts`, offline): a format-2 fixture tree (written by
   `tests/support/pack-tree.ts`) for each refusal of Acceptance 2 … 5 and for a pack passing all of
   them (two entries, one naming `software`, one naming a pack of an earlier axis, a tension naming
   a pack of the tree), each refusal asserted by rule, file and message.
7. **Nothing else moves:** the four published packs, the golden trees, `validate`, `check:packs`,
   `check:schemas` and the generated root files unchanged; `npm test` and `npm run lint` exit 0. No
   schema change, so no schema note.
8. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations
   (G12's 25 minutes), and dl-039's local list on Node.js 22.21.0. The privacy check of the
   branch's diff recorded.

## Design

Branch `task/task-085-lint-per-entry` from `main` at this task's add. A new function in
`src/pack-rules.ts`, `entryProblems(catalog, pack, packs)` (the manifest's `with` and `tensions`
rules, by format), called by `check-packs`' `packProblems` with `mcpProblems`; the composer keeps
calling only what it called (the lint's rules on `with` and `tensions` need the tree's packs, which
the resolver does not load). `scopeOf` in `src/pack-files.ts` takes the entry's `with` id, and
`readPackFiles` reads each entry's files with its own scope (`conditionalEntries`, `entryFiles`).
Red steps: (1) the tests of Acceptance 2 … 6 in `tests/check-packs.test.ts`, with
`entryProblems`' signature and no body (it throws), uncalled; (2) the code, committed. No new
dependency.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-08: written as plan-066 task (D), after task-084's merge; `pack` and `depends_on` filled
  by editing the draft (W-02). Not split in (D1) and (D2) (ruling 1 allowed it): task-084 took the
  rules the composer applies, so what is left is one manifest function, the lint's scopes and one
  call.
