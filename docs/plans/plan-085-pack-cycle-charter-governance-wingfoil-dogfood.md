---
id: plan-085-pack-cycle-charter-governance-wingfoil-dogfood
type: plan
title: "pack-cycle charter: governance/wingfoil-dogfood"
status: draft
workflow: "pack-cycle"
phase: "charter"
tags: ["packs","dogfood","governance","W10"]
---

## Context

The `charter` phase of `pack-cycle` (v8) for `governance/wingfoil-dogfood`, feature F4.2, the
next of W10's features in the sequencer 1.8 ("W10's order": the presets, `governance/feedback`,
this pack, a pack release round, this repository's adoption, the periodic retrospective). The
request was captured and ruled through `pack-ingest`: dl-051 (approved on 2026-11-24, plan-082 …
plan-084), whose D1 … D5 are this charter's scope; dl-012 D3 and D7 make it an upstream pack of
`governance/feedback`, written as such.

**Why now.** `governance/feedback` 1.0.0 is published and its charter `active` (plan-077), its
retrospective done (plan-078, dl-043 … dl-048 applied by plan-081); dl-051 hands this plan off
(plan-084); no row of `docs/owed-items.md` blocks a charter.

**What this plan produces:** the charter `pack-governance-wingfoil-dogfood`, `accepted`, with
dl-051 D2 as its scope and Q5 as its evidence, and the open questions of dl-051 Q6 answered or
listed in its Open points. **No run on the engine before acceptance** (dl-032 E2): under dl-051
Q1 (a) the pack ships directives, fragments and a README skeleton, no workflow, and fills no slot
of a required pack's workflow (`governance/feedback` reads the channel by its tag, spec-003 §5.2),
as dl-051 Q5 records.

**Hosting,** the two deviations of plan-073 (dl-051 D4): `sw-life-cycle` › `pack-delivery`
iterates over packs already `accepted`, while `charter` creates and accepts one (the row
"`pack-delivery`'s selection over `accepted` packs"); and no workflow engine runs this
repository's plans (it pins WingFoil 0.2.2 until the adoption). The plan runs on branch
`pack/governance-wingfoil-dogfood-charter`, from `main` at the commit that submits it.

**Preconditions, met.** `base` 2.0.1 and `governance/feedback` 1.0.0 published, their charters
`active`; spec-003 §5 and §11 (the channel, its lint) and FA-8's fixture upstream pack
(`tests/fixtures/feedback-exit/`) with its `check:runs` scenario
(`tests/fixtures/runs/feedback-upstream.yaml`); `compat.yaml` listing WingFoil 0.3.0 … 0.3.2.

**`main`'s CI before this plan** (`repository-practice` rule 3): the push of `ae80bc73`
(plan-082's steps), run 45362469745, `success` (plan-084's note); the push that carries plan-083,
plan-084 and this plan's draft, read and recorded in the Execution Notes before `submit`.

**Inputs read first.**
- dl-051 (Context, Options, D1 … D5, its Execution Notes); dl-012 D3, D6, D7 and its note of
  2026-11-24; dl-003 D6 and its note of 2026-11-24; dl-022 S5; dl-001 D7; dl-032 E2 … E4, dl-037.
- spec-003 §5 (the channel, the targets, the lookup by tag), §11 (the lint); spec-001 §6.3, §7.1,
  §7.4, §8; spec-002 §2 (README, CB-1 … CB-6, examples §2.4).
- The model charter `pack-governance-feedback` (its sections, Adoption, Acceptance, Open points)
  and plan-073 … plan-077; FA-8's fixture channel directive.
- This repository's `wingfoil-cli` (custom, 1.6) and `docs/wingfoil-feedback/README.md` (Rules,
  Ledger, Context, the **Source key** and **Last sync** lines): the source of what the pack ships.
- The names in use: WingFoil 0.3.2's built-in directives and workflows, this repository's
  `custom/` files, the catalog's packs.

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **Identity and compatibility.** Catalog id `governance/wingfoil-dogfood`, `axis: governance`,
   `name: wingfoil-dogfood`, `pack_path: packs/governance/wingfoil-dogfood`, element
   `pack-governance-wingfoil-dogfood` (dl-051 D1; the name kept, Q6); `requires: [base@^2,
   governance/feedback@^1]`, `conflicts: []` (dl-051 Q4 (a)); `requires_capabilities: []`, the pack
   adding no workflow (the engine `governance/feedback` needs is its own requirement); **`pack.yaml`
   format 1**, with no conditional entry. The v0.3 formats by kind, 0.3.0 the oldest release of the
   matrix, the range computed from `compat.yaml`. The pack enters the official catalog with a
   maintained line (dl-001 D7, dl-051 Q6): the approver confirms the commitment here.
2. **Scope: dl-051 D2.** It ships:
   - the directive `wingfoil-cli`, rules 1 … 7 with their content unchanged, their project-bound
     values as parameters (point 4), rules 3 and 5 pointing at the project's entries file
     (point 3); rule 8 stays in this repository's custom directive (dl-051 Q3 (a));
   - the channel directive, proposed `wingfoil-channel`, tagged as spec-003 §5.1 asks, "Serves the
     target `upstream:wingfoil`": the mapping of a routed item onto WingFoil's dl-163 kinds
     (`defect`, `gap`, `request`; `observation` to `request`, or not routed: dl-012 D3), the note's
     location and format (`F-<nnn>-<slug>.md` in the inbox, dl-163 R4's fields), the feedback id
     cited in the note's body and the ledger row;
   - a `roles.yaml` fragment binding both directives to `facilitator` (spec-003 §5.1; `wingfoil-cli`
     global as today, the binding to be checked in step 1 against spec-001 §7.4);
   - the inbox README skeleton (Rules, Ledger, Context, the **Source key** and **Last sync** lines),
     as a file the pack ships or as the README's install step (step 1 reads which spec-001 allows
     for a file outside `.wingfoil/`);
   - README and CHANGELOG. No workflow, no Memory type, no executable logic.
   Every name it ships is checked in step 1 against the names in use. **The id `wingfoil-cli`**
   (dl-051 Q6): recommended kept, since a project adopting the pack removes its own custom copy
   in the same change (this repository at its adoption, dl-012 D6); the alternative, a new id,
   breaks the references the agents and this repository's texts already make.
3. **The known behaviours** (dl-051 Q2 (a)). The pack ships the table's form (`#`, Behaviour, How
   to work with it, Note, WingFoil element) and rule 5's re-check at every pin bump, with *Checked
   against* on the entries. Recommended: the entries in a project file whose path is a parameter,
   default `docs/wingfoil-feedback/known-behaviours.md`, beside the inbox, which the README's
   install step creates empty; the alternative, a project directive in `custom/`, keeps them in
   front of agents as today but splits one rule set across two directives.
4. **Parameters** (dl-051 Q3 (a)), each with a default and its description: the CLI command
   (`npm run -s wingfoil --`), the inbox path (`docs/wingfoil-feedback`), the known-behaviours path
   (point 3), and the service's source key (no default: the README's install step asks for the
   `svc-NNN` id WingFoil assigns). The note format stays WingFoil's dl-163 (dl-012 D3).
5. **The design phase: not needed**, recommended (dl-051 Q6): the channel follows spec-003 §5 as
   FA-8's fixture does, the parameters are of existing types (spec-001 §8), and nothing is a new
   mechanism. If step 1 finds one (the inbox skeleton outside `.wingfoil/`, the binding of a global
   directive), it goes to the approver before the charter is submitted.
6. **Acceptance and exit criterion** (dl-051 Q5). Proposed criteria, each with its checker ([V]
   the validation command or a test, [E] an element check, [A] the approver):
   the pack composes with `base` and `governance/feedback`, with and without `software` and a
   methodology, with no warning on every compatible release [V]; the lint of spec-003 §11 (the
   "Serves the target" line, one channel per target, the channel from a pack that requires
   `governance/feedback`) [V]; the `feedback-ingest` → `feedback-review` scenario through the
   pack's channel to `closed`, on the oldest and the newest selected release, as dl-032 E3's
   `check:runs` evidence and `author`'s exit criterion [V]; a routed item's note in dl-163 R4's
   format, citing the feedback id [V]; the adoption run once per `init` template (dl-032 E3),
   `first-release`'s, prepared by `author` [V]; the README's examples as fixtures under
   `tests/fixtures/examples/wingfoil-dogfood/`, one without `software`, one with `software` and a
   methodology (spec-002 §2.4) [V]; CB-1 … CB-6 at the first tag [A]. The scenario writes the
   note itself: it shows the route closes and the directives compose, not that an agent follows
   them (dl-051 Q5).
7. **Tasks** (`author`), proposed: (1) the `wingfoil-cli` directive, its parameters and the
   known-behaviours form; (2) the channel directive and the `roles.yaml` fragment, with the §11
   lint's fixtures; (3) the `check:runs` scenario through the channel; (4) the README with the
   install steps, the inbox skeleton and the examples as fixtures; one `kanban-delivery` iteration
   each.
8. **Adoption:** the procedure for any WingFoil project (add `upstream:wingfoil` to
   `feedback_targets`, the source key, the inbox and the entries file, a custom `wingfoil-cli`
   removed); this repository's is W10's adoption plan with dl-012 D6's knock-ons (rule 8 kept in
   `custom/`, the lint's and `tests/wingfoil-feedback.test.ts`'s paths, dl-051 Q6), not this
   charter's.
9. **No feedback note** to WingFoil for this charter or the publication (dl-021 R1).

## Steps

On branch `pack/governance-wingfoil-dogfood-charter`; one commit per step that writes. Before
every commit, the privacy check and `check:texts` (`repository-practice` rules 2, 5).

1. **Reads** (product-owner). The inputs above; the names check of point 2; the two questions of
   point 5. Findings that change a point go to the approver before step 2.
2. **The charter** (product-owner). `npm run -s wingfoil -- memory add --type pack --title
   "WingFoil dogfood" --set axis=governance --set name=wingfoil-dogfood` (check the printed id:
   `pack-governance-wingfoil-dogfood`); `pack_path` filled by editing the draft (W-02), the body
   committed before `submit` (W-04). Its sections as `pack-governance-feedback`'s.
3. **Independent review** of the charter (dl-017), amended while `draft`, its record (dl-017 R3);
   a re-review when a fix changes behaviour or a ruling. Then `memory submit` (`draft →
   proposed`).
4. **The approver's gate.** The approver accepts the charter (`proposed → accepted`) with the
   command handed over in full, or sends it back.
5. **Branch close.** Text-only (the charter, this plan's notes): its CI on the frozen commit, the
   job durations recorded (dl-039 R3); `workflow list` exit 0; `git diff main --stat` naming only
   the charter and this plan. On the approver's OK, `--no-ff` merge into `main`, the push by the
   approver, `main`'s CI read; the branch removed; any item left owed added to
   `docs/owed-items.md` (rule 4). `active → done`; the close's CI left to the next plan.

**Not in this plan:** the pack's tasks (`author`), its first release, the pack release round, this
repository's adoption and pin, dl-049's path, the sequencer's stale W10 state row (its owed row).

## Handoff

- **Agent:** steps 1 … 3 and 5's checks. **Approver:** the outline's rulings (before `submit`),
  the charter's acceptance (step 4), the merge's OK and the push of `main`.
- **Done when:** the charter is `accepted` on `main` and this plan is `done`.

## Execution Notes

