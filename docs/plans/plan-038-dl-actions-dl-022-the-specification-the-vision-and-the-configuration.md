---
id: plan-038-dl-actions-dl-022-the-specification-the-vision-and-the-configuration
type: plan
title: "dl actions: dl-022, the specification, the vision and the configuration"
status: draft
workflow: "decision-log-ingest"
phase: "rule"
tags: ["spec","base","process"]
---

## Context

The document and configuration actions of dl-022 (the scope of `base`, `approved` on 2026-10-14),
opened on the approver's request in chat on 2026-10-15, before wave W8 (milestone M2). dl-020
starts a wave only after the tech-specs its work builds on are amended: W8 builds on spec-001 and
spec-002, so this plan amends both first. As for plan-033, plan-034 and plan-036, no workflow phase
hosts this work: it is filed under `decision-log-ingest` › `rule`. spec-001 and spec-002 are
amended **in place**, as plan-032 and plan-031 did: the body edited under this plan, its Execution
Notes listing the changes, the approver's merge OK as the approval of the edited text.

W8's gate is met: WingFoil's batch B7 merge `bd55f70e` is public in `wingfoil/wingfoil@ffa9bf6b`,
and the approver confirmed in chat that the v0.3 formats are final:
- `memory.yaml` 3.5 adds the optional key `template.frontmatter.exempt`, a map from a required field
  to the ids of the elements that do not carry it;
- adapter manifests gain `mcp.via: config-arg` and the `{mcp_config}` placeholder, and the
  `claude-code` and `codex-cli` adapters are built in;
- every file kind stays at format 1: optional additive keys do not bump a format (WingFoil dl-149);
- workflow files and adapter manifests refuse unknown keys; `dna`, `memory`, `roles` and directives
  accept them.

Read again at `ffa9bf6b` on 2026-10-15: no v0.3 release is tagged (the last is `v0.2.2`), so O10
stands; WingFoil dl-137 and dl-138 are `ready` and dl-138's Action 2 tech-spec does not exist yet,
so O2, O5, O12 and O13 keep their owners; dl-177 and dl-178 are `in-discussion`.

The approver ruled in chat on 2026-10-15, on this plan's proposal:
1. **§11's example and `catalog.yaml` change together.** `tests/catalog.test.ts` holds the real
   `catalog.yaml`'s `axes` and `slots` equal to §11's example. This plan writes §11's rules in prose
   and leaves the example block as it is; the tooling task of the next plan (`tooling-change` ›
   `deliver`) changes the example, `catalog.yaml` and its schema in one commit, as task-028 did for
   §12. Until then §11's prose and its example differ, which this plan's Execution Notes record.
2. **§7.5 admits more of WingFoil's `memory.yaml` keys.** `name`, `description`, `tags`,
   `amendable` and `fields` are set once by the defining pack (an incoming value must be equal);
   `template.frontmatter.not_applicable_allowed` and `template.frontmatter.lists` are sets a later
   pack may add to. Outside format 1 of a pack: `template.frontmatter.exempt`, which names element
   ids and is therefore a project value, and `waiting` and `returns`, whose merge with an inserted
   state §7.5 does not define. `base`'s types therefore have no `waiting` state, as dl-022 S4 already
   says of `governance-evolution`.
3. **`retrospective` › `capture` before W9.** The phase lists a change of governance as a point,
   ruled by `governance-evolution`; until this repository adopts `base` (W9), by a dl actions plan
   under `decision-log-ingest`.
4. **spec-002 §2.4 is not changed.** Without `software` a composition needs no methodology, so
   `base` could compose an example alone; the exemption still holds while the tree holds no
   methodology, and `base`'s examples are due with W10. A note in spec-002's Execution Notes says so.

The shape row 4 proposes for S3's conditional `delivery`, for the approver to confirm at the merge:
an optional `conditional` list in `pack.yaml`, with at most one entry in format 1:

```yaml
requires: [base@^1]
conditional:
  - with: software              # format 1 allows only `software`
    requires: [software@^1]     # must hold software@^<major>
    contents:
      workflows: [delivery, kanban-delivery]
```

- The entry's `requires` and `contents` count only in a composition that holds `with`; elsewhere
  the composer ignores them.
- Its `contents` may list `workflows` and `directives` only. A file is listed in one place, the
  pack's `contents` or the entry's, and §6.4's check that `contents` matches the files present
  covers both together.
- Fragments and the AGENTS.md section are always composed, so they use nothing from `software`
  (a §18 check); the section may name `delivery` as present only with `software`.
- A catalog version entry copies `conditional` (its `with` and `requires`), as it copies
  `requires`, so a resolver needs no fetch.
- An optional key is additive, so `pack.yaml` stays at format 1 (§5, dl-149's rule).
- A methodology ships `delivery` in its `conditional` entry, never in `contents`.

Errata to fold back in this amendment: spec-001 §15's `wingfoil init --preset` (task-030, F-030).
§4's `0.x` erratum was folded back by plan-032.

Not in this plan: the schemas, `catalog.yaml`, the composer and the lint rules, and the feedback
note on the schema change (the next plan, `tooling-change` › `deliver`); the charters of
`pack-foundation-base` and `pack-foundation-software` (W8, `pack-cycle`); dl-015, which stays
`pending` and is ruled with both charters; the move of this repository's dl actions plans to
`governance-evolution` (W9, dl-003 D10).

## Steps

All work happens on branch `dl/dl-022-actions`, from `main` at `b296a40`, one commit per row.

| # | File | Change | Source |
|---|---|---|---|
| 1 | spec-001 §1–§4, §6.2, §6.3 | dl-022 among the applied decisions; two foundation packs, `base` and `software`, outside the axes; the catalog pack id `software` and the Memory element `pack-foundation-software`; `axis` absent on both; `base` requires nothing, `software` requires `base@^<major>`; every phase pack, and every pack that uses `software`'s types, workflows, directives or parameters, requires `software` | S1–S3, dl-004 1(a) as amended |
| 2 | spec-001 §7.1, §7.5, §9, §10 | the order `base`, `software`, then the axes; `defaults` still `base`'s only; the keys of ruling 2; the slot defaults, `sw-life-cycle` and the life-cycle workflows shipped by `software`; `retrospective` and `governance-evolution` by `base`; `software`'s AGENTS.md section opens with a level-2 heading | S2–S4, ruling 2 |
| 3 | spec-001 §11, §15, §18 | `foundation` names both packs; the `methodology` axis required only with `software`; the slots' `default` names `software` (prose only, ruling 1); presets may omit both foundation packs, and a preset without `software` holds no methodology; §15's erratum (F-030); §18: `sw-life-cycle` and the slot defaults only from `software`, `retrospective` and `governance-evolution` only from `base`, the requirement rules of row 1, the preset cardinalities with and without `software` | S3, dl-020 |
| 4 | spec-001 §6.3, §6.4, §7.7, §10, §15, §18 | a methodology's `delivery` exists only in a composition with `software`: how a pack declares the conditional part (its requirement on `software`, its `contents`, the catalog entries that copy `requires`), the generated `include` without `delivery`, the lint check that the rest of a methodology uses nothing from `software`, the matrix with and without `software`, the AGENTS.md section that names `delivery` | S3's open points |
| 5 | spec-001 §5, §7.5, §12, §16, Execution Notes | the v0.3 formats: format 1 for every kind, additive optional keys do not bump it (dl-149); `exempt` is not a pack key (ruling 2, a §18 check); adapter manifests are not a kind a pack ships, so `config-arg` leaves the pack format unchanged; workflow files refuse unknown keys, so a pack's workflows use no key newer than the oldest release of its matrix; O4, O10, O12 and O13 read again at `ffa9bf6b`; the Execution Note of this amendment | the v0.3 gate |
| 6 | spec-002 §2, §3, Execution Notes | `Axis: foundation` for both foundation packs; section 4 of `software`'s README lists what it adds or tightens over `base`; the index's foundation section lists both, `base` first; the note of ruling 4 | dl-022 › spec-002 |
| 7 | `06_features.md` (1.4 → 1.5) | F4.1 rewritten as dl-022 S2; a new F4.8 for `software` (S3); F6.1 the hand-adoption steps of both packs; F6.2 the parameters of both packs for every governed project, software or not; the review note's dependency list | S1–S3, S6 |
| 8 | `07_sequencer.md` (1.3 → 1.4) | the M2 row (both foundation packs and `governance/wingfoil-dogfood`); W8 (both packs; S6's criterion); W9 (this repository adopts both); the note "The first publication is `base`" | S6, dl-003 D10 as amended |
| 9 | `pack-authoring`; `.wingfoil/memory.yaml` (4 → 5), the `pack` type's comment; `retrospective.yaml` (2 → 3), its `capture` phase and header comment | `foundation` is the axis value of both foundation packs' elements; every pack requires `base`, and the packs listed in row 1 require `software`; the slot rule names `software`; `capture` as ruling 3 | dl-004 1(a), dl-006 R2 as amended |
| 10 | dl-001, dl-003, dl-004, dl-006 | an Execution Note each, for the amendment dl-022 makes: dl-001 D5, dl-003 D1/D2/D4/D5/D10/D11, dl-004 1(a), dl-006 R2. The bodies stay as approved | dl-022 › Amendments |

Then:
- **Checks:** `npm test`, `npm run lint`, `npm run check:pins`, `npm run check:schemas`,
  `npm run check:packs`, `npm run index -- --check` and `npm run validate` exit 0; `workflow list`
  exit 0. A grep of `docs/01_vision/` for `base` and `sw-life-cycle`: every hit that contradicts
  dl-022 outside rows 7 and 8 is reported to the approver, not edited by this plan.
- **Review:** an independent review of the branch by a subagent (dl-017), its findings fixed, a
  re-review when a fix changes a rule.
- **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
  `--no-ff` merge into `main`, push, the branch removed; dl-022's Execution Notes record the actions
  applied.

## Handoff

- **claude:** the rows above, the checks, the review hand-off, the merge once approved.
- **Approver:** the four rulings above (given 2026-10-15); a reading of S3's conditional `delivery`
  (row 4) that differs from the text; the merge OK, which approves spec-001's and spec-002's edited
  text.
- Done when the branch is merged and pushed, and dl-022 cites the result. The plan then goes
  `active → done`, and the next plan (`tooling-change` › `deliver`) can start.

## Execution Notes

- 2026-10-15: written; `workflow` and `phase` filled by editing the draft (W-02).
