---
id: plan-039-tooling-change-deliver-the-two-foundation-packs-the-conditional-part-and-the-memory-keys-dl-022
type: plan
title: "tooling-change deliver: the two foundation packs, the conditional part and the memory keys (dl-022)"
status: draft
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","base","spec"]
---

## Context

The tooling actions of dl-022 (`approved` 2026-10-14), the second step of milestone M2 before wave
W8. plan-038 (`done`, merge `99ea8f0`) amended spec-001 and spec-002 in place; this plan makes the
tooling implement their amended text. dl-022's Execution Notes list what is still to apply: the
schemas, `catalog.yaml`, the composer, the lint rules, the index and the feedback note. The
charters of `pack-foundation-base` and `pack-foundation-software` (W8) and this repository's
adoption (W9) come after this plan. Opened on the approver's request in chat on 2026-10-15, with
`main` at `31bf931`, whose CI run 38718041542 concluded `success`.

**What the tooling builds on.** spec-001 §3, §4, §5, §6.2–§6.5, §7.1, §7.5, §7.7, §9, §11, §12,
§15, §17 and §18, and spec-002 §2.1, §3.2 and §3.3, as amended on 2026-10-15. No erratum of either
is pending. An error found in their text during this plan is an erratum (dl-020): it goes to the
approver when found (dl-019), never corrected silently.

**The rulings this plan applies.** plan-038's rulings 1–9 hold here, in particular:
- ruling 1: §11's example block, `catalog.yaml` and `schema/catalog.schema.json` change in one
  commit, because `tests/catalog.test.ts` holds `catalog.yaml`'s `axes` and `slots` equal to the
  example (as task-028 did for §12); the same commit drops §11's bullet saying the example still
  shows the old form, the one edit of spec-001's text this plan makes;
- ruling 2: §7.5's add-or-tighten rules for WingFoil's other `memory.yaml` keys;
- ruling 5: the conditional part (spec-001 §6.5);
- ruling 6: `pack.yaml` and `catalog.yaml` stay at format 1 through the schema changes. Hence **no
  previous schema is frozen** as `schema/<kind>.v1.schema.json`: §5's freeze applies to a format
  bump, and there is none;
- ruling 7: a methodology that requires `software` ships `delivery` in `contents`, with no
  conditional part.

And the approver's rulings in chat on 2026-10-15, on this plan's proposal:
- **R1, one feedback note.** Every change of `schema/` is made by the first task (task-031),
  `conditional` included, and one note, F-031, reports the whole contract change to WingFoil
  (`wingfoil-cli` rule 8; the `schema-note` lint rule). Until task-032, a pack carrying
  `conditional` passes the schema and is refused by the lint and the composer, with a message that
  says §6.5 is not implemented yet; no pack of the tree carries one.
- **R2, both legs of the matrix are derived.** `npm run validate` composes, for every composition
  (preset, example or entries) that holds a pack with a conditional part, the other leg too: with
  `software` added when it is absent; without it when it is present and no pack of the composition
  requires it unconditionally. The second leg's report line names it. The lint's in-memory
  compositions (`overlay-rules`, the approver's ruling of 2026-10-09 under task-012) extend the
  same way, and also cover the overlays with no methodology, which a composition without
  `software` allows.
- **R3, the conditional part in the index.** Without a field, `catalog-index.json` would list a
  conditional `delivery` among a pack's workflows next to `requires: [base@^1]`, so a filter over
  the index would read it as always present. The index therefore carries it: each version object
  copies `conditional` as the catalog version entry does (its `with` only); each pack object gains
  `conditional_workflows` and `conditional_directives` beside `workflows` and `directives`, which
  keep only what is always composed; `CATALOG.md` marks such a pack in its axis table. This adds
  to spec-002 §3.2 and §3.3, which list their fields as closed: it is a ruling recorded here and
  folded back into spec-002 at the wave's close (dl-020 R2). `index/catalog-index.schema.json` is
  outside `schema/` and not part of the contract with WingFoil (spec-002 §4), so no feedback note
  follows from it.
- **R4, `pack-compatibility`.** The directive does not say yet that a pack with a conditional part
  is validated with and without `software`, although spec-001 §15 cites it. The sentence is added
  in a separate commit on task-032's branch, the task that implements it. Like `pack-authoring`,
  the directive carries no `version:` key.

**The tasks.** Four tooling tasks (`pack: ""`), split at proposal so that each has its own red
first and a reviewable diff (dl-018 R3):

| Task | Scope | Sources |
|---|---|---|
| task-031: the two foundation packs and the contract | `schema/pack`, `catalog` and `preset` schemas (ids, entries and paths with `software`; the foundation branch; `conditional`; `foundation: [base, software]`; `required_with: software`; the slots' `default: software`); `catalog.yaml` and §11's example (ruling 1); the catalog loader; the resolver (`base` always, `software` when asked for or required unconditionally, the order `base`, `software`, the axes; the `methodology` axis required only with `software`); the §18 foundation rules (`software` requires `base` only; every phase pack requires `software`; `sw-life-cycle` and the slot defaults only from `software`, `retrospective` and `governance-evolution` only from `base`; no conflict with a foundation pack); the preset cardinalities on the resolved composition; `conditional` refused until task-032 (R1); F-031 with the ledger and the inbox README | spec-001 §3, §4, §6.2, §6.3, §7.1, §9, §11, §15, §18; R1 |
| task-032: the conditional part | `with` checked only with `software`, never adding a pack, and counted by §7.1's rule against requiring a later pack; the inventory of both parts; the generated `include` and the copied files (the entry's after the pack's own, none without `software`); the isolation rules and the parameter scope per part; `delivery` in the entry or in `contents` (ruling 7); one owner and slots on the leg with `software`; the catalog version entry copying `with` at publication, and the tag rules; both legs of the matrix and of the lint's compositions (R2); `pack-compatibility` (R4) | spec-001 §6.4, §6.5, §7.1, §7.7, §8.1, §9, §11, §12, §15, §17, §18; R2, R4 |
| task-034: the index and the READMEs | spec-002 §2.1 section 1 (`Axis: foundation` for both) and section 4 (computed over the foundation a pack requires; a conditional part's files marked as present only with `software`); §3.2 (the foundation section, `base` then `software`, in `catalog.yaml`'s order); §3.3 (`axis` and `slot` `null` for both); R3; the id pattern of `index/catalog-index.schema.json` | spec-002 §2.1, §3.2, §3.3; R3 |
| task-033: the `memory.yaml` keys of §7.5 | the set-once keys (`name`, `description`, `tags`, `amendable`, `fields`); `states.waiting` (own states only), `returns` (equal), `limits` (the minimum of the two sides); `not_applicable_allowed` and `lists` only for fields the same fragment adds to `required`; `exempt` refused, in the merge and in the lint | spec-001 §7.5, §18; ruling 2 |

task-034 is apart from task-031 so that the tasks implementing spec-002 change neither
`catalog.yaml` nor `schema/` (spec-002 CB-8). task-033 depends on no other; it comes last because
only W8's charters need it. Each task's Context lists what exists, and its Acceptance its fixtures
and red-first tests.

**The fixtures.** No pack exists under `packs/`; every check runs on `tests/fixtures/` and on the
trees `tests/support/pack-tree.ts` builds. Today the fixtures' `base` ships `sw-life-cycle`, the
slot defaults and `adr`: task-031 splits them into `base` and `software` (the golden
`compose/tree` and its expected output, `resolve/full`), task-032 adds a methodology with a
conditional part and the expected output of a composition without `software`, task-034 the index
fixtures. dl-022 S6's generic non-software fixture validates `base`'s content and belongs to W8.
The fictitious release `9.0.0` (`format_key: true`) stays in the fixtures' compat only
(`tests/support/published-repo.ts`).

**Design choice.** The tooling reads from `catalog.yaml`'s `foundation` which pack is the core (the
first) and which the software layer (the second), as §3 asks the resolver to read the axes, rather
than writing `base` and `software` in the code; the schema fixes the list to `[base, software]`.

Not in this plan: the charters (W8, `pack-cycle`); dl-015 and §8.3's `{release}` note; O14 (a
conditional fragment); this repository's adoption of both packs (W9); spec-002 §2.4's exemption,
kept by plan-038's ruling 4.

## Steps

Each task runs through `tooling-delivery` as `developer`, on its own branch `task/<task id>` from
`main`, in the order task-031, task-032, task-034, task-033, one after the other.

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`). A finding that changes a ruling goes to the approver, and the plan is
   reviewed again.
2. **Each task**, in order:
   1. its body (Context, Acceptance), reviewed independently and amended while `pending`; the
      approver accepts it into the backlog;
   2. its Design committed on `main`, then `backlog → in-progress`;
   3. the build on `task/<task id>`, red first (dl-018), every test written before the code it
      checks, the red counted in the Execution Notes;
   4. an independent review of the branch; its findings fixed, and a re-review when a fix changes
      behaviour (dl-017 R2);
   5. the checks: `npm test`, `npm run lint`, `npm run check:pins`, `npm run check:schemas`,
      `npm run check:packs`, `npm run index -- --check` and `npm run validate` exit 0, from a
      clean clone on Node.js 22.21 and the floor 22.12.0; no dependency added (adr-003);
   6. the branch pushed, the real CI run's conclusion recorded in the task's Execution Notes, then
      `in-review`; the approver accepts it;
   7. `done`; on the approver's merge OK, `--no-ff` merge into `main`, `main` pushed, the branch
      removed remotely and locally; this plan's Execution Notes record the merge.
3. **Close:** dl-022's Execution Notes record the tooling actions applied; this plan's Execution
   Notes list, for spec-001 and spec-002, the errata and rulings recorded under it (R3 at least),
   and the element the approver names to fold them back. The plan goes `active → done`.

## Handoff

- **claude:** the steps above, except the approver's gates and the merge OKs. It never runs
  `memory approve` or `memory reject`: it hands the approver the command.
- **Approver:** each task's two gates (`pending`, `in-review`); each merge OK; any erratum or
  unsatisfiable acceptance raised during a build (dl-019, dl-020).
- Done when task-031 … task-034 are `done` and merged into `main`, and dl-022 cites them. Then the
  third step of M2 (W8, the two charters through `pack-cycle`) can start, on the approver's OK.

## Execution Notes

- 2026-10-15: written; `workflow` and `phase` filled by editing the draft (W-02). The approver
  chose the four tasks, their order, and R1–R4 in chat.
