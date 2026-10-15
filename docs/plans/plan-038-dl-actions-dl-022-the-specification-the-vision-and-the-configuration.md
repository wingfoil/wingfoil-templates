---
id: plan-038-dl-actions-dl-022-the-specification-the-vision-and-the-configuration
type: plan
title: "dl actions: dl-022, the specification, the vision and the configuration"
status: active
workflow: "decision-log-ingest"
phase: "rule"
tags: ["spec","base","process"]
---

## Context

The document and configuration actions of dl-022 (the scope of `base`, `approved` on 2026-10-14),
opened on the approver's request in chat on 2026-10-15, before wave W8 (milestone M2). dl-020
starts a wave only after the tech-specs its work builds on are amended: W8 builds on spec-001 and
spec-002, so this plan amends both first.

**Host.** plan-031 and plan-032 hosted spec amendments under `sw-life-cycle` › `specification`;
plan-033, plan-034 and plan-036 hosted dl actions under `decision-log-ingest` › `rule`. The approver
chose on 2026-10-15 one plan for the whole of dl-022's document and configuration actions, filed
under `decision-log-ingest` › `rule`. spec-001 and spec-002 are amended **in place**, as plan-032
and plan-031 did: the body edited under this plan, its Execution Notes listing the changes, the
approver's merge OK as the approval of the edited text.

**The v0.3 formats.** W8's gate is met: WingFoil's W3 B7 gate merge `6e454f40` is public in
`wingfoil/wingfoil@ffa9bf6b`, and the approver confirmed in chat that the v0.3 formats are final.
Read at `ffa9bf6b` on 2026-10-15:
- `memory.yaml` 3.5 adds the optional key `template.frontmatter.exempt`, a map from a required field
  to the ids of the elements that do not carry it (task-279);
- adapter manifests gain `mcp.via: config-arg` and the `{mcp_config}` placeholder, and the
  `claude-code` and `codex-cli` adapters are built in;
- every file kind stays at format 1: optional additive keys do not bump a format (WingFoil dl-149);
- adapter manifests and a workflow phase's `cadence` refuse unknown keys; every other node of a
  workflow, `dna`, `memory`, `roles` and directives accept them with the warning `unknown field(s)
  ignored`, which the compatibility matrix does not allow (`pack-compatibility`);
- `workflows/bindings.yaml` and adapter manifests are dl-149 kinds at format 1 (WingFoil dl-153);
  packs ship neither;
- no v0.3 release is tagged (the last is `v0.2.2`), so O10 stands; WingFoil dl-137 and dl-138 are
  `ready` and dl-138's Action 2 tech-spec does not exist yet, so O2, O5, O12 and O13 keep their
  owners; dl-177 and dl-178 are `in-discussion`.

**The approver's rulings** in chat on 2026-10-15, on this plan's proposal and its review:
1. **§11's example and `catalog.yaml` change together.** `tests/catalog.test.ts` holds the real
   `catalog.yaml`'s `axes` and `slots` equal to §11's example. This plan writes §11's rules in prose
   and leaves the example block as it is; the tooling task of the next plan (`tooling-change` ›
   `deliver`) changes the example, `catalog.yaml` and its schema in one commit, as task-028 did for
   §12. Until then §11's prose and its example differ, which this plan's Execution Notes record.
2. **§7.5 admits more of WingFoil's `memory.yaml` keys**, with add-or-tighten rules:
   - `name`, `description`, `tags`, `amendable`, and `fields` (an authoring key WingFoil passes
     through) are set by the defining pack only; a later pack's value must be equal (§7.2), and is
     refused when the defining pack left the key out;
   - `states.waiting`, `states.returns` and `states.limits` are declared by the defining pack. A
     pack that gives a type deriving from `defaults` its own machine is tightening it, not defining
     it. A later pack (§7.5's merge):
     - may add to `waiting` only its own states, those not on the base side at that point of the
       composition; repeating an entry already present is a no-op; a tightening of `defaults` that
       does so reaches every type deriving from `defaults`;
     - may add a `limits` entry on a state that has none, or lower one: `limits.<state>` merges as
       the minimum of the two sides, its key a state of the merged sequence, its value a positive
       integer;
     - leaves `returns` as it is: an incoming `states` without `returns` keeps it, one with
       `returns` must equal the base side;
     - may still add a gate on a state in `waiting`, as §7.5 allows for any state without a gate;
   - `template.frontmatter.not_applicable_allowed` and `template.frontmatter.lists` are sets a later
     pack may add to only for fields the same fragment adds to `required`, so an earlier pack's
     required field is never loosened;
   - `template.frontmatter.exempt` is not allowed in a pack's `memory.yaml` fragment in format 1:
     it names element ids, which are project values; §7.5's failures and §18 both list it.
3. **`retrospective` › `capture` before W9.** The phase lists a change of governance as a point,
   ruled by `governance-evolution`; until this repository adopts `base` (W9), by a decision-log
   under `decision-log-ingest`, applied by a dl actions plan.
4. **spec-002 §2.4 is not changed.** Its premise, that every composition needs a methodology, no
   longer holds without `software`, so `base` could compose an example alone; the exemption is kept
   by this ruling while the tree holds no methodology, and `base`'s examples are due with W10. A
   note in spec-002's Execution Notes says so.
5. **The conditional `delivery`** (dl-022 S3) takes the shape below, confirmed before the text is
   written.
6. **The formats of this repository's own files.** `pack.yaml` and `catalog.yaml` stay at format 1
   although their schemas change (`conditional`; `foundation` from one pack to two): nothing is
   published and no reader of them exists, and the specification is amended in place before the
   first publication. §5's rule applies from the first publication.

Then, at the branch review, on 2026-10-15:
7. **A methodology that requires `software`** ships `delivery` in `contents`; only a pack that does
   not require `software` carries a conditional part (spec-001 §6.5, §9, §18). dl-022 S3 lets a
   methodology require `software` or not.
8. **The `pack` template and `dna.yaml`** (row 9b) name both foundation packs, so that W8 creates
   `pack-foundation-software` from a template that allows it.
9. **The other vision documents** (row 11) name both foundation packs, so the vision is coherent
   before W8.

**The conditional part of a pack** (ruling 5). An optional `conditional` list in `pack.yaml`, with
at most one entry in format 1:

```yaml
requires: [base@^1]
conditional:
  - with: software@^1           # format 1 allows only software@^<major>
    contents:
      workflows: [delivery, kanban-delivery]
      directives: []
```

- Only a non-foundation pack may carry it. A pack that requires `software` gains nothing from it.
- `with` is an entry of §6.3's syntax. It is a requirement that counts only when the composition
  holds that pack: it never adds a pack, so resolution stays one pass; a `software` version outside
  its range is an unsatisfied requirement, an error, not a reason to drop the part. `with` must not
  repeat an id of the pack's `requires`, and the pack must not `conflict` with it. It counts as a
  requirement for §7.1's rule against requiring a later pack.
- The entry's `contents` may list `workflows` and `directives` only. A file is listed in one place,
  the pack's `contents` or the entry's, and §6.4's check that `contents` matches the files present
  covers both together. Without `software` the composer leaves those files out, and the generated
  `include` with them (§7.7). With `software`, the entry's workflows follow the pack's own in
  `include` and in the copied files, each list in its written order; directives likewise (§6.4,
  §7.7).
- Nothing outside the entry references the entry's workflows or directives (fragments, unconditional
  workflows, the roles fragment's assignments); `software`'s parameters, types, workflows and
  directives are used only inside the entry (§8.1's scope, checked per part). The AGENTS.md section
  is always composed, and may name `delivery` as present only with `software`. These are §18 checks.
- Fragments are never conditional, so no methodology can tighten `software`'s types (for example
  `bug` or `release`); a new open point **O14** records it.
- A catalog version entry copies `conditional` (its `with`), as it copies `requires`, so a resolver
  needs no fetch.
- The one-owner rule (§7.6) and the slot rule (§9) are checked on the composition with `software`,
  the matrix's leg with `software` (§15). No phase pack carries the entry, since it requires
  `software` (§9 says so).
- A methodology that does not require `software` ships `delivery` in its conditional entry, never
  in `contents`; one that requires `software` ships it in `contents` and carries no conditional
  part (ruling 7). A composition with `software` holds exactly one methodology; a composition
  without it holds at most one, which contributes no `delivery`.

Errata to fold back in this amendment: spec-001 §15's `wingfoil init --preset` (task-030, F-030).
§4's `0.x` erratum was folded back by plan-032.

Not in this plan: the schemas, `catalog.yaml`, `compat.yaml`, the composer and the lint rules, and
the feedback note on the schema change (the next plan, `tooling-change` › `deliver`); the charters
of `pack-foundation-base` and `pack-foundation-software` (W8, `pack-cycle`); dl-015, which stays
`pending` and is ruled with both charters, and §8.3's `{release}` note, which follows its ruling;
the move of this repository's dl actions plans to `governance-evolution` (W9, dl-003 D10).

## Steps

All work happens on branch `dl/dl-022-actions`, from `main` at `b296a40`, one commit per row.

| # | File | Change | Source |
|---|---|---|---|
| 1 | spec-001 §1–§4, §6.2, §6.3 | dl-022 among the applied decisions; §2's rows (catalog pack id, pack name, axis: two foundation packs outside the axes); §3's table (`base` and `software`; `methodology` at most one, exactly one with `software`, filling `delivery` only with it); the catalog pack id `software` and the Memory element `pack-foundation-software`; `axis` absent on both; `base` requires nothing, `software` requires `base@^<major>`; every phase pack, and every pack that uses `software`'s types, workflows, directives or parameters outside a conditional part, requires `software` | S1–S3, dl-004 1(a) as amended |
| 2 | spec-001 §7.1, §7.3, §7.5, §8.1, §9, §10 | the order `base`, `software`, then the axes; §7.3's and §8.1's examples read with two foundation packs; `defaults` still `base`'s only; the keys of ruling 2; the slot defaults and `sw-life-cycle` shipped by `software`, `retrospective` and `governance-evolution` by `base`; `delivery` required only with `software`; `software`'s AGENTS.md section opens with a level-2 heading | S2–S4, ruling 2 |
| 3 | spec-001 §11, §15, §18 | `foundation` names both packs; the `methodology` axis required only with `software` (prose only, ruling 1, its data form named for the next plan's schema); the slots' `default` names `software`; presets: the foundation packs may be omitted, `software` only when a listed pack requires it unconditionally, and the methodology cardinality judged on the resolved composition; §15's erratum (F-030); §18: `sw-life-cycle` and the slot defaults only from `software`, `retrospective` and `governance-evolution` only from `base`, the requirement rules of row 1, the preset checks, `exempt` refused in a fragment | S3, ruling 2, dl-020 |
| 4 | spec-001 §5, §6.2, §6.3, §6.4, §7.7, §9, §10, §11, §15, §16, §17, §18 | the conditional part (ruling 5): §6.2's field table and example, the rules above, the catalog version entry, the matrix with and without `software` (§15, `pack-compatibility`), the composer's steps 1, 3 and 5 (§17), the §18 checks, O14; ruling 6 in §5 | S3's open points, rulings 5–6 |
| 5 | spec-001 §5, §12, §16, Execution Notes | the v0.3 formats: format 1 for every kind (dl-149); adapter manifests and `bindings.yaml` are kinds a pack does not ship, so `config-arg` leaves the pack format unchanged and `compat.yaml`'s `kinds` stays as it is; a pack uses no key unknown to a release its computed range claims, enforced by the zero-warning matrix and, once one exists, a capability; §12's `kinds` described as the seven dl-149 kinds a composition involves; O4 settled (a kind at format 1, not shipped by packs in format 1), O10, O12 and O13 read again at `ffa9bf6b`; the Execution Note of this amendment | the v0.3 gate |
| 6 | spec-002 §2, §3, §3.3, Execution Notes | `Axis: foundation` for both foundation packs; section 4 of `software`'s README lists what it adds or tightens over `base`; the index's foundation section lists both, `base` first; §3.3's derived `axis` `null` for both; the note of ruling 4 | dl-022 › spec-002 |
| 7 | `06_features.md` (Version 1.4 → 1.5, Date set) | F4.1 rewritten as dl-022 S2; a new F4.8 for `software` (S3); F6.1 the hand-adoption steps of both packs; F6.2 the parameters of both packs for every governed project, software or not; the review note's dependency list | S1–S3, S6 |
| 8 | `07_sequencer.md` (Version 1.3 → 1.4, Date set) | the M2 row (both foundation packs and `governance/wingfoil-dogfood`); W8 (both packs; S6's criterion); W9 (this repository adopts both); the note "The first publication is `base`" | S6, dl-003 D10 as amended |
| 9 | `pack-authoring`; `.wingfoil/memory.yaml` (4 → 5), the `pack` type's comment; `retrospective.yaml` (2 → 3), its `capture` phase and header comment | `foundation` is the axis value of both foundation packs' elements; every pack requires `base`, and the packs of row 1 require `software`; the conditional part; the slot rule names `software`; `capture` as ruling 3 | dl-004 1(a), dl-006 R2 as amended, rulings 3, 5 |
| 9b | `.wingfoil/memory/templates/pack.md`; `.wingfoil/dna.yaml` (9 → 10) | `axis`: `foundation` for `base` and `software`; `pack_path` and `requires` comments; the `packs` path's description | ruling 8 |
| 10 | dl-001, dl-003, dl-004, dl-006, dl-015 | an Execution Note each, for the amendment dl-022 makes: dl-001 D5, dl-003 D1/D2/D4/D5/D10/D11, dl-004 1(a), dl-006 R2; dl-015 (`pending`): the split of C1–C11 between the two charters. The bodies stay as written | dl-022 › Amendments |
| 11 | `01_product-brief.md` (1.1 → 1.2), `02_product-vision.md` (1.3 → 1.4), `03_is-isnot.md` (1.4 → 1.5), `04_personas.md` (1.2 → 1.3), `05_journeys.md` (1.2 → 1.3), `08_mvp-canvas.md` (1.2 → 1.3), each Version bumped once and Date set | purpose 3, the first scope and the constraints; the composition and the maintainer's value; the publication constraint; the governed-repository maintainer; J2 adopts the foundation packs; the canvas's scope, results, metric and dependencies | S1–S3, S6, ruling 9 |

Then:
- **Checks:** `npm test`, `npm run lint`, `npm run check:pins`, `npm run check:schemas`,
  `npm run check:packs`, `npm run index -- --check` and `npm run validate` exit 0; `workflow list`
  exit 0.
- **Leftovers:** a grep of `docs/01_vision/`, spec-001, spec-002 and `.wingfoil/` for `base`,
  `sw-life-cycle` and `foundation`: every hit that contradicts dl-022 outside the rows above is
  reported to the approver, not edited by this plan.
- **Privacy:** the branch's diff names no non-software project, and no local path or private
  repository (dl-022 S6).
- **Review:** an independent review of the branch by a subagent (dl-017), its findings fixed, a
  re-review when a fix changes a rule.
- **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
  `--no-ff` merge into `main`, push, the branch removed; dl-022's Execution Notes record the actions
  applied.

## Handoff

- **claude:** the rows above, the checks, the review hand-off, the merge once approved.
- **Approver:** the rulings above (given 2026-10-15); the merge OK, which approves spec-001's and
  spec-002's edited text.
- Done when the branch is merged and pushed, and dl-022 cites the result. The plan then goes
  `active → done`, and the next plan (`tooling-change` › `deliver`) can start.

## Execution Notes

- 2026-10-15: written; `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-15: independent review: approve after amendments (the preset rule contradicted dl-022
  S3; the conditional part's gaps; the format reasoning of this repository's files; workflow files
  warn on unknown keys rather than refuse them; ruling 2 loosened required fields and left out
  `waiting`, `returns` and `limits`; the host's precedent; the sections of rows 1–4; dl-015's note;
  the B7 citation). The approver ruled on the points that change a decision (rulings 2, 5, 6 and the
  host); amended.
- 2026-10-15: re-review: approve after amendments, nothing blocking; every finding of the first
  review resolved or ruled. Its new findings (the merge of `waiting`, `limits` and `returns`; the
  set-once keys under §7.2; the order of the conditional part's files; `with` under §7.1, §6.3, §7.6
  and §9; §12's kinds; §3.3's `null`) make the rulings exact without changing them, so no further
  re-review; amended. Plan submitted.
- 2026-10-15, rows 1–10: applied (`d366e4f` … `8f67161`, wraps in `110ebb1`). Checks on Node.js
  22.21.0 at `8f67161`: 802 of 802 tests, `lint`, `check:pins`, `check:schemas`, `check:packs`,
  `validate`, `index -- --check` and `workflow list` exit 0. Leftovers grep: the other vision
  documents, the `pack` template and `dna.yaml` still named `base` alone; put to the approver.
- 2026-10-15: independent review of the branch: approve after amendments. Wording, the namespace of
  a conditional part (§8.1), `retrospective` without `software` left to `base`'s charter (§9), the
  Execution Notes completed, wraps (`b797ce7`). Its finding that a methodology requiring `software`
  could not ship `delivery` changed a rule: the approver ruled 7, and 8 and 9 on the leftovers;
  applied (rows 9b and 11, `b01240b`). Re-review requested.
- 2026-10-15: re-review: request changes, one blocker: a reflow had merged J2 of `05_journeys.md`
  into one paragraph; the file rebuilt from `b296a40` with row 11's wording. `pack-authoring`'s
  conditional bullet aligned with ruling 7; wraps. The fixes change no rule: no further re-review.
