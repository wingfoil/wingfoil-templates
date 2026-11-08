---
id: task-085-the-lint-per-entry-the-conditional-entries-and-tensions-rules-by-format-parameter-scopes-per-entry-the-mcp-refusal-plan-066-task-d
type: task
title: "The lint per entry: the conditional entries' and tensions' rules by format, parameter scopes per entry, the mcp refusal (plan-066 task D)"
status: done
pack: ""            # tooling task (tooling-delivery v3), plan-066 task (D)
depends_on: ["task-084-the-composer-per-entry-active-entries-their-order-and-parameter-scopes-the-notices-of-tensions-the-mcp-refusal-plan-066-task-c"]
tags: ["tooling","format","lint"]
---

## Context

plan-066 (rulings 1, 2, 6 and 9), its fourth task, after task-084 (the composer per entry). spec-001
§18 at format 2: `conditional` by the file's format, in format 2 each `with` naming a catalog pack
composed earlier (§7.1), at most one entry per pack id, no `with` naming a pack of `requires` or
`conflicts`; `tensions` naming a catalog pack id other than the pack, at most once, not in
`conflicts`, a format-1 `pack.yaml` having none; `contents.fragments` in the order `dna`, `roles`,
`memory`, then `mcp` in format 2 (§6.4); every `{{name}}` in its part's scope, each entry its own
(§6.5, §8.1). Ruling 6: a pack shipping `mcp` refused by the lint too.

What task-084 left here (its Context and notes): the composer, and so the lint, already reads per
entry and by format the inventory, `formats`, slots, `delivery`'s part, the foundation rule (no
entry naming `software` on a pack requiring it) and `workflowProblems`, whose isolation messages
already name the entry's `with`. The schema checks "on a non-foundation pack" and an entry's
`contents` (workflows and directives only, at least one). What the lint does not check yet:
- the manifest's rules on `with` beyond `software` and on `tensions` (format 1's limits are the v1
  schema's; format 2's schema leaves these to the lint, its `$comment` says so);
- the fragments' order with `mcp`: `FRAGMENT_ORDER` (`src/pack-rules.ts`) has no `mcp`, so a
  format-2 pack listing it would get a false `fragment-order` problem;
- the parameter scopes of `src/pack-files.ts` (`readPackFiles`, `scopeOf`): every entry's files get
  `software`'s scope, whatever their `with`;
- the `mcp` refusal under its own rule: `mcpProblems` is called by the resolver only, so today
  `check:packs` reports such a pack only through the overlay lint's compositions (rule `compose`).

Not here: §7.6's one owner and §9's slots on the compositions with an entry's pack left out in turn,
and the overlay lint's legs per entry: task-084's Context gave them to (D), but they are
compositions, and plan-066 (F) owns the legs (D6's coverage), so this task reads them as (F)'s. The
waiver heuristic is task (E); the `mcp` kind's own rules wait for their row. An overlay tree
(`validate --overlay`) gets no `packProblems`, so its fixture packs are (F)'s too. No published pack
moves to format 2 (plan-063 ruling 3): fixture packs only (ruling 2).

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 2 … 7 committed before the code, so that the
   build passes and they fail by assertion, except any already green on `main` (recorded as such);
   the failing run recorded with its command and count.
2. **`conditional` at format 2** (`check:packs`, rule `conditional`, each problem at
   `/conditional/<index>/with`), a problem when an entry's `with`: names no pack directory of the
   tree (`packs/<id>/pack.yaml` present, whether or not it passes its schema); names the pack
   itself; names a pack of its `requires` or `conflicts`; names a pack id an earlier entry names; or
   names a pack not always composed earlier, read statically from §7.1 (the approver's ruling, point
   1 below): `software` is earlier than every non-foundation pack; a pack of another axis is earlier
   when its axis comes earlier in `catalog.yaml`'s `axes`; within `phase`, a pack of an earlier slot
   (the axis's `slots` order) is earlier; any other pack of the pack's own axis is refused: of an
   axis of cardinality one, or of the same slot, since the two never compose together and the entry
   could never be active (§3's cardinalities are conflicts, §6.3, §6.5), with the message
   `<pack>: its entry with <with> names <id>, which never composes with it (spec-001 §3, §6.5)`; of
   an axis of cardinality many, since Kahn's order counts only `requires` (§7.1), so no order is
   guaranteed, with the message
   `<pack>: its entry with <with> names <id>, not always composed earlier (spec-001 §7.1)`. The axis
   and slot are read from the named id's segments (§4). §18's "catalog pack" is read as a pack
   directory of the tree, since `catalog.yaml` lists only published packs. Each other problem names
   the pack, the entry's `with` and the rule. Format 1's limits stay the v1 schema's (one entry,
   `software@^<major>`), unchanged. The order rule needs `catalog.yaml` and is skipped when it does
   not load, as `foundationProblems` is.
3. **`tensions`** (rule `tensions`, at `/tensions/<index>/pack`): an entry naming the pack itself, a
   pack id an earlier entry names, a pack of `conflicts`, or no pack directory of the tree is a
   problem naming the pack and the entry, checked whether or not `catalog.yaml` loads; a format-1
   `pack.yaml` with `tensions` stays the v1 schema's refusal.
4. **The fragments' order** (rule `fragment-order`, §6.4): `contents.fragments` keeps `dna`,
   `roles`, `memory`, then `mcp` in format 2, so a format-2 pack listing `mcp` last gets no
   `fragment-order` problem, and `mcp` before another fragment is one; a format-1 pack listing `mcp`
   stays the v1 schema's refusal.
5. **Parameter scopes per entry** (rule `parameter-scope`, §8.1, §6.5): an entry's files may use the
   parameters of the pack, of the packs it reaches through `requires`, and of the entry's `with`
   pack with the packs that one reaches, and no other entry's `with` pack's; the message names the
   entry (`… in the scope of <pack>'s entry with <with>`); a format-1 pack's entry keeps
   `software`'s scope, as today.
6. **The `mcp` refusal** (rule `mcp`): `check:packs` reports a pack whose `contents.fragments` or
   `formats` holds `mcp`, with the resolver's message (plan-066 ruling 6), until the row of the
   `mcp` kind's tooling; and no `compose` problem for it (the pack is then left out of the overlay
   lint's compositions, its own rule having reported it).
7. **The tests** (`tests/check-packs.test.ts`, offline): a format-2 fixture tree (written by
   `tests/support/pack-tree.ts`) for each refusal of Acceptance 2 … 6 and for a pack passing all of
   them (two entries, one naming `software`, one naming a pack of an earlier axis, a phase pack
   naming a pack of an earlier slot, a tension naming a pack of the tree), each refusal asserted by
   rule, file and message.
8. **Nothing else moves:** the four published packs, the golden trees, `validate`, `check:packs`,
   `check:schemas` and the generated root files unchanged; `npm test` and `npm run lint` exit 0. No
   schema change, so no schema note.
9. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations
   (G12's 25 minutes), and dl-039's local list on Node.js 22.21.0. The privacy check of the branch's
   diff recorded.

**For the approver's ruling before `backlog`:**
1. **The static reading of §18's "composed earlier"** (Acceptance 2): spec-001 gives no lint-time
   reading of it; this task reads it as Acceptance 2 writes it, refusing a `with` within an axis of
   cardinality many. Recommended as written; listed at the wave close for spec-001 (plan-066 Steps
   3). Alternative: accept a same-axis `with` of an axis of cardinality many, leaving its order to
   the composer's §7.1 check at composition.
2. **The left-out compositions given to (F)** (Context): plan-066 point 1 lists "slots and one owner
   per entry" under (D); they are compositions, so this task leaves §7.6's one owner and §9's slots
   on the compositions with an entry's pack left out to (F), which owns the legs (D6's coverage) and
   inherits them. Recommended as written. Alternative: a lint composition per entry here, ahead of
   (F)'s legs.

## Design

Branch `task/task-085-lint-per-entry` from `main` at this task's add. A new function in
`src/pack-rules.ts`, `conditionalProblems(catalog: Catalog | undefined, pack, packDirs)` (the
manifest's `with` and `tensions` rules, by format; `packDirs` the ids with a `packs/<id>/pack.yaml`,
from the layout's listing, which `LintContext` gains as a field), called by `check-packs`'
`packProblems` with `mcpProblems`; the composer keeps calling only what it called (the lint's rules
on `with` and `tensions` need the tree's packs, which the resolver does not load). `FRAGMENT_ORDER`
gains `mcp` last, read by `inventoryProblems` for every format (format 1's schema refuses `mcp`
before it). `scopeOf` in `src/pack-files.ts` takes the entry's `with` id, and `readPackFiles` reads
each entry's files with its own scope (`conditionalEntries`, `entryFiles`). Red steps: (1) the tests
of Acceptance 2 … 7 in `tests/check-packs.test.ts`, with `conditionalProblems`' signature and no
body (it throws), uncalled; (2) the code, committed. No new dependency.

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
- 2026-11-08: independent review: approve after amendments, three blocking (the static reading of
  "composed earlier" too strict for `phase`'s slots, now read by slot, and put to the approver as a
  ruling; Acceptance 2's first case read backwards; the fragments' order with `mcp` missing, now
  Acceptance 4); applied with the others: "a pack of the tree" read as a pack directory, whatever
  its schema says, and overlay trees named as (F)'s; the left-out compositions named as a reading
  that differs from task-084's Context; the rules already the schema's or `foundationProblems`'
  named; the `mcp` refusal asserted with no `compose` problem; the scope message naming the entry;
  the function named `conditionalProblems` (`layout-rules` has an `entryProblems`); `tensions`
  checked without `catalog.yaml`; the order message fixed.
- 2026-11-08: re-review: approve after amendments, one blocking (Acceptance 1's range after the
  renumbering, now 2 … 7); applied: the same-axis cases of cardinality one given their own message
  (an entry never active), the left-out compositions put to the approver as ruling point 2,
  `conditionalProblems` taking an absent catalog, Acceptance 4's claim narrowed, ruling point 1's
  wording, §18's "catalog pack" read as a pack directory. The message of a misordered format-1
  pack's fragments will name `mcp` too (its test asserts the rule only), left as is.
- 2026-11-08: red (dl-018), commit 183986b: the tests of Acceptance 2 … 7, `conditionalProblems`'
  signature with no body, uncalled. `npm run build && node --test dist/tests/check-packs.test.js`:
  113 tests, 9 failing by assertion; one green already, the order rule skipped when `catalog.yaml`
  does not load (no rule reported any `conditional` problem there yet).
- 2026-11-08: after the red commit, one fixture fixed: the cases of a `with` naming no pack
  directory or the pack itself kept `s-gov`'s `{{g_param}}`, outside the scope of an entry no
  longer naming `governance/g`; `s-gov` is now plain there.
- 2026-11-08: green, readings taken: a foundation pack is always composed earlier (§7.1's steps 1
  and 2), though an entry naming `base`, which every non-foundation pack requires, is refused as
  naming a pack of `requires`; an entry naming `software`, which the pack requires, stays
  `foundationProblems`' (one problem, not two); a file listed in two parts, already the inventory
  rule's problem, is read once, with its first part's scope; a format-1 entry keeps `software`'s
  scope, its message now naming the entry as every entry's does, and gets it from its `with` when
  `catalog.yaml` does not load (before, its own scope only: a false `parameter-scope` problem);
  `readPackFiles` loses its `software` argument.
- 2026-11-08: build review: approve, five non-blocking findings, applied: the `compose` assertion
  of the formats-only `mcp` case dropped (that pack already had a `formats` problem; the `mcp`-last
  case, with `mcp` its only rule, proves it); the misordered fragments asserted by file and
  message; the scope reading without `catalog.yaml` recorded above (the format-1 entry using
  `software`'s parameters keeps its test, "the entry may use software's types, workflows and
  parameters"); a test of an entry naming `base`, first written so that the schema refused its
  pack (no `base` in `requires`), now asserting the `requires` refusal; comments in `orderOf` on
  foundation ids and on ids outside the catalog's axes.
- 2026-11-08: the checks (Acceptance 9), on the frozen commit 9a58fb2: branch CI run 42503733888
  `success`, `validate (22.21.0)` 22:08 and `validate (22.12.0)` 23:39 (G12's 25 minutes held,
  the margin narrow, as on main); dl-039's local list on Node.js 22.21.0 from a clean worktree:
  `npm ci`, `npm run build`, `npm run validate:publication` (18 runs, 0 failed), the same on the
  golden tree with `--param project_name=Golden` (26 runs, 0 failed), `workflow list`,
  `directives list --format json` (`warnings []`), `npm run lint`, each exit 0. Before them, on
  the green commit: `npm test` 1252 of 1252, `validate`, `check:packs` (74 files, 0 problems),
  `check:schemas`, `check:pins` and the index check exit 0. The privacy check of the branch's
  diff: no local path, no private project, no session.
