---
id: plan-039-tooling-change-deliver-the-two-foundation-packs-the-conditional-part-and-the-memory-keys-dl-022
type: plan
title: "tooling-change deliver: the two foundation packs, the conditional part and the memory keys (dl-022)"
status: active
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

**What the tooling builds on.** spec-001 §3, §4, §5, §6.2–§6.5, §7.1, §7.5–§7.7, §8.1, §9–§12,
§15, §17 and §18, and spec-002 §2.1, §2.2, §3.2 and §3.3, as amended on 2026-10-15. No erratum
of either is pending. An error found in their text during this plan is an erratum (dl-020): it goes
to the approver when found (dl-019), never corrected silently. The rulings recorded under this plan
(R3 and R7 at least) are named by W8's opening plan, which starts after their fold-back or after the
approver rules it may start without (dl-020 R3).

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
  requires it unconditionally. The second leg's report line names it. When the composition holds
  no methodology, the leg with `software` would break §3 (exactly one methodology with
  `software`): `validate` skips it with a report line that says so (for example
  `matrix presets/x.yaml +software: skipped, no methodology`), the lint composes the pack with
  `software` and the tree's first methodology, and a publication's leg with `software` comes from
  a documented combination that holds a methodology (the approver's ruling at the review, after
  dl-017's review found the gap). The lint's in-memory
  compositions (`overlay-rules`, the approver's ruling of 2026-10-09 under task-012) extend the
  same way (task-032), and also cover the overlays with no methodology, which a composition
  without `software` allows (task-031, which makes the methodology optional).
- **R3, the conditional part in the index.** Without a field, `catalog-index.json` would list a
  conditional `delivery` among a pack's workflows next to `requires: [base@^1]`, so a filter over
  the index would read it as always present. The index therefore carries it: each version object
  copies `conditional` as the catalog version entry does (its `with` only); each pack object gains
  `conditional_workflows` and `conditional_directives` beside `workflows` and `directives`, whose
  meaning narrows to what is always composed; in `CATALOG.md`, the Summary cell of such a pack
  ends with ` (… only with software)`, naming the part's workflows, so §3.2's columns stay as they
  are. This adds to spec-002 §3.2 and §3.3, which list their fields as closed: task-033 records it
  in spec-002's Execution Notes (dl-020 R1, as task-019 did for its erratum), and it is folded
  back into spec-002 at the wave's close (dl-020 R2). `catalog-index.json` stays at `format: 1`:
  nothing is published and nothing reads it as a contract yet (spec-002 §4).
  `index/catalog-index.schema.json` is outside `schema/`, so no feedback note follows from it.
- **R4, `pack-compatibility`.** The directive does not say yet that a pack with a conditional part
  is validated with and without `software`, although spec-001 §15 cites it. The sentence is added
  in a separate commit on task-032's branch, the task that implements it. Like `pack-authoring`,
  the directive carries no `version:` key.

Then, at task-032's body review, on 2026-10-15:
- **R5, a preset's values in the leg without `software`.** The `[-software]` leg drops the values
  a preset sets for parameters of packs absent from it, and its report line names them.
- **R6, publication needs the leg with `software`.** In publication mode, `validate` fails when a
  pack with a conditional part has no composition with `software` that ran.
- **R7, an empty conditional part is refused** by the lint, a rule the specification does not
  state: folded back into spec-001 at the wave's close with R3 (dl-020 R2).

**The tasks.** Four tooling tasks (`pack: ""`), split at proposal so that each has its own red
first and a reviewable diff (dl-018 R3):

| Task | Scope | Sources |
|---|---|---|
| task-031: the two foundation packs and the contract | **Schemas:** every change of `schema/` (R1): the `pack`, `catalog` and `preset` id, entry and path patterns with `software`; `pack.schema.json`'s foundation branch (no `axis`; `base` requires nothing, `software` only `base@^<major>`), its `conflicts` refusing both foundation packs, and `conditional`; `catalog.schema.json`'s `foundation: [base, software]`, `required_with: software`, the slots' `default: software`, and `conditional` (its `with` only) in a version entry. **Catalog:** `catalog.yaml` and §11's example (ruling 1); the loader (`foundation` a list, `required_with` in place of `required`). **Code reading the foundation as one id**, made to read its first or second entry: `resolve.ts` (`base` always; `software` when asked for or required unconditionally; the order `base`, `software`, the axes; the `methodology` axis required only with `software`), `memory-merge.ts` (`defaults` defined by `base` only), `output.ts` (§10: `software`'s section opens at level 2), `compose-documents.ts`, `tree-rules.ts`, `workflow-rules.ts` (`sw-life-cycle`'s includes, now `software`'s), `pack-rules.ts` (`BASE_ONLY_WORKFLOWS` split: `sw-life-cycle` and the slot defaults only from `software`, `retrospective` and `governance-evolution` only from `base`). **§18:** `software` requires `base` only; every phase pack requires `software`; the preset cardinalities on the resolved composition. **The lint's compositions** (`overlay-rules.ts`): the methodology optional, so `base` alone, `base` with each pack that does not need `software`, and the overlays with no methodology. `conditional` refused until task-032 (R1). **F-031**, with the ledger and the inbox README | spec-001 §3, §4, §6.2, §6.3, §7.1, §7.5 (`defaults`), §7.6, §9, §10, §11, §15, §18; R1 |
| task-032: the conditional part | `with` checked only with `software`, never adding a pack, and counted by §7.1's rule against requiring a later pack; the inventory of both parts, and `formats` counting the kinds of both (`formatKindsProblems`); the generated `include` and the copied files (the entry's after the pack's own, none without `software`); the isolation rules and the parameter scope per part; `delivery` in the entry or in `contents` (ruling 7); one owner and slots on the leg with `software`; the catalog version entry copying `with` at publication, and the tag rules; both legs of the matrix and of the lint's compositions (R2), in `validate` and `validate:publication`, the leg with `software` of a composition without a methodology skipped with its own report line, which the release evidence (`evidence.ts`) reads without counting it as a run; the lint's leg with `software` taking the first methodology the pack does not conflict with; `pack-compatibility` (R4), which says that a publication's leg with `software` comes from a documented combination (a README example or a preset) holding a methodology | spec-001 §5, §6.4, §6.5, §7.1, §7.7, §8.1, §9, §11, §12, §15, §17, §18; R2, R4–R7 |
| task-033: the index and the READMEs | spec-002 §2.1 section 1 (`Axis: foundation` for both) and section 4 (computed over the foundation a pack requires; a conditional part's files marked as present only with `software`); §3.2 (the foundation section, `base` then `software`, in `catalog.yaml`'s order); §3.3 (`axis` and `slot` `null` for both); R3, and its note in spec-002's Execution Notes; `index-model.ts` and `readme-generate.ts` reading the foundation from `catalog.yaml` instead of the literal `base`; the id pattern and the `axis` enum of `index/catalog-index.schema.json` | spec-002 §2.1, §2.2, §3.2, §3.3; R3 |
| task-034: the `memory.yaml` keys of §7.5 | the set-once keys (`name`, `description`, `tags`, `amendable`, `fields`); `states.waiting` (own states only), `returns` (equal), `limits` (the minimum of the two sides); `not_applicable_allowed` and `lists` only for fields the same fragment adds to `required`; `exempt` refused, in the merge and in the lint | spec-001 §7.5, §18; ruling 2 |

The tasks are numbered in run order, and each is created when the previous one has left
`in-progress` (tooling-delivery's WIP limits), as under plan-024. task-033 is apart from task-031
so that the tasks implementing spec-002 change neither `catalog.yaml` nor `schema/` (spec-002
CB-8). task-034 depends on no other; it comes last because only W8's charters need it. Each task's
Context lists what exists, and its Acceptance its fixtures and red-first tests.

**The fixtures.** No pack exists under `packs/`; every check runs on `tests/fixtures/` and on the
trees `tests/support/pack-tree.ts` builds. Today the fixtures' `base` ships `sw-life-cycle`, the
slot defaults and `adr`: task-031 splits them into `base` and `software` (the golden
`compose/tree` and its expected output, `resolve/full`, and the phase packs of
`tests/support/index-catalog.ts`, which now require `software`); task-032 adds a methodology with a
conditional part and the expected output of a composition without `software`; task-033 the index
fixtures. Until task-033, `software` is published in no index fixture, and the generated title of
its golden README reads `Axis: software`, against spec-002 §2.1: task-031's Execution Notes record
it and task-033 corrects it. dl-022 S6's generic non-software fixture validates `base`'s content and
belongs to W8. The fictitious release `9.0.0` (`format_key: true`) stays in the fixtures' compat
only (`tests/support/published-repo.ts`).

**Design choice.** The tooling reads from `catalog.yaml`'s `foundation` which pack is the core (the
first) and which the software layer (the second), as §3 asks the resolver to read the axes, rather
than writing `base` and `software` in the code; the schema fixes the list to `[base, software]`.

**A limit for W8.** `software` cannot be composed without a methodology (§3: exactly one with
`software`). A tree holding `base` and `software` and no methodology, as W8's will, can compose
`base` alone but not `software`: its lint composition and dl-022 S6's validation of `software`
need a methodology, in a fixture or a documented combination. This plan records it for W8's
opening plan; it changes no rule.

Not in this plan: the charters (W8, `pack-cycle`); dl-015 and §8.3's `{release}` note; O14 (a
conditional fragment); this repository's adoption of both packs (W9); spec-002 §2.4's exemption,
kept by plan-038's ruling 4.

## Steps

Each task runs through `tooling-delivery` (v2) as `developer`, on its own branch `task/<task id>`
from `main`, in the order task-031, task-032, task-033, task-034, one after the other.

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
      clean clone on Node.js 22.21 and the floor 22.12.0, and, for task-032, which edits a
      directive (R4), `workflow list` exit 0; no dependency added (adr-003);
   6. the branch pushed, the real CI run's conclusion recorded in the task's Execution Notes, then
      `in-progress → in-review`; the approver accepts it (`in-review → approved`) and gives the
      merge OK;
   7. `deliver`, as tooling-delivery v2 orders it and task-025 did: `--no-ff` merge of the branch
      into `main`, then `approved → done` on `main` with the task's delivery notes; `main` pushed,
      the branch removed remotely and locally; this plan's Execution Notes record the merge.
3. **Close:** dl-022's Execution Notes record the tooling actions applied; this plan's Execution
   Notes list, for spec-001 and spec-002, the errata and rulings recorded under it (R3 and R7 at least),
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
- 2026-10-15: independent review: approve after amendments, nothing blocking. Amended: the code
  paths that read the foundation as one id, named in task-031; the lint composing `base` alone and
  the overlays with no methodology, moved to task-031; the interim `Axis: software` until the
  index task; the tasks numbered in run order (the index task-033, the memory keys task-034); the
  kinds of both parts in `formats`; R3 made exact; `deliver` in tooling-delivery v2's order;
  `workflow list` for task-032; W8's limit on composing `software`. Its finding that R2's leg with
  `software` is undefined without a methodology changed a ruling: the approver ruled (a), the leg
  skipped with a report line. Re-review requested (dl-017 R2).
- 2026-10-15: re-review: approve; every finding of the first review resolved or ruled. Its new
  findings (the publication leg and the skip line in task-032's scope, the evidence reading it, the
  lint's choice of methodology, R3's format reason) are amended without changing a rule, so no
  further re-review. Plan submitted.
- 2026-10-15, task-031 (the two foundation packs and the contract): accepted into the backlog,
  designed, built red first in three steps, reviewed and re-reviewed, CI run 38747567111 on
  `be06b62` `success`; approved by the approver, merged `--no-ff` into `main` (`51094a8`), `done`.
  F-031 written (R1). Found at its acceptance run, for W8: WingFoil 0.2.2 refuses a composition
  with no `kind: main` workflow (`E_NO_MAIN_WORKFLOW`), so `base`'s charter keeps
  `governance-evolution` as a main workflow (dl-022 S4). Raised to the approver: Acceptance 3's
  golden-tree `catalog.yaml` in the red commit (dl-019).
