---
id: plan-041-pack-cycle-charter-the-two-foundation-packs-base-and-software
type: plan
title: "pack-cycle charter: the two foundation packs, base and software"
status: draft
workflow: "pack-cycle"
phase: "charter"
tags: ["packs","base","software","W8"]
---

## Context

Wave W8 (milestone M2) opens on the approver's request in chat on 2026-10-19: the `charter` phase of
`pack-cycle`, run once for each foundation pack of dl-022, `base` and `software`. One plan hosts
both iterations, because `software` requires `base` and the two charters share their rulings.

**Preconditions, met.**
- WingFoil 0.3.0 is released (tag `v0.3.0` on `wingfoil/wingfoil@cc31d7a8`, on npm as `latest`,
  2026-10-19), so the v0.3 formats are final and released.
- The tech-specs W8 builds on are amended (dl-020): spec-001 and spec-002 by plan-038 (dl-022), and
  plan-039's rulings R3 and R7–R10 folded back in place by plan-040. No erratum is open on either.
- The tooling implements both foundation packs, the conditional part and the memory keys of §7.5
  (plan-039, task-031 … task-034).

**What the charters take as inputs.**
- dl-022 (S1–S6), and dl-015 (`pending`), whose points C1–C11 split between the two charters as
  dl-022 says and are ruled with them.
- A re-reading of the governed repositories on 2026-10-16 (`wingfoil/wingfoil@92bec996`,
  `wingfoil/wingfoil-ui@cce3656`, `wingfoil/wingfoil-benchmark@8cf7ae4` and this repository at
  `070fdb4`), and of the three private, non-software projects for the `plan` type only. Findings
  that change dl-015's table: C8 (WingFoil also gives `traceability` to the facilitator), C9
  (WingFoil's agent has a name, an email and an `adapter`), C2 (Benchmark's `bug` is the default
  machine plus `fixed`), C10 (the release folder differs between WingFoil and UI), C3 (Benchmark's
  `decision-log-ingest` has one phase). The non-software projects' `plan` sequence
  `[draft, active, parked, done]` makes every plan pass `parked` before `done`.
- WingFoil's request for the charters (relayed on 2026-10-18), answered by this repository with
  the approver's ruling and confirmed by WingFoil's maintainer on 2026-10-18:
  - **R1, not taken as asked.** Memory paths, the plan id, the release and release-line ids and the
    agent name stay pack parameters (dl-022 S2). The charters state instead: the parameters'
    defaults are the convention for new projects; existing adopters set their current values and
    move nothing; ids are immutable, a new id pattern applying to new elements only; Memory types,
    state names, workflow names and phase names are fixed, and a pack update that renames or
    restructures any of them ships an old → new key mapping (WingFoil dl-187).
  - **R2:** `software`'s charter states how WingFoil's two-level delivery loop fits.
  - **R3:** `software`'s charter maps WingFoil's eight release phases: `release-submit`
    (`pre-release-checks`, `enter-releasing`, `approve-release`) and `release-publishing`
    (`release-commit`, `staging-rehearsal`, `tag`, `publish`, `mark-released`).
  - **R4:** every phase whose artefact is a file declares it in `produces`.
- Facts found by plan-039 for this wave: WingFoil 0.2.2 refuses a composition with no `kind: main`
  workflow, so `governance-evolution` stays `main`; `software` cannot be composed without a
  methodology (spec-001 §3); a `waiting` state that a tightening of `defaults` adds reaches a type
  already detached that had inserted it.
- WingFoil 0.2.2 knows `waiting` but not `returns`, `limits`, `exempt`, `not_applicable_allowed`,
  `amendable`, `lists` or `memory park`, which arrive with 0.3.0. Packs that use them are
  compatible from 0.3.0 on, the oldest release of their matrix; no workflow uses a key newer than
  that release.
- A by-hand test relayed on 2026-10-15: an agent other than Claude read a composed AGENTS.md region
  and honoured its rules, and the provisional markers caused no trouble; a WIP rule is checkable
  only when the `task` type has an `in-progress` state.

**The approver's rulings in chat** (2026-10-18 and 2026-10-19), recorded here because no element
holds them yet:
1. The memory keys of spec-001 §7.5 (plan-038's ruling 2): `waiting`, `returns`, `limits` and the
   set-once keys are used where WingFoil uses them; `exempt` is never in a pack.
2. **The default `release`** (dl-015 C5, R3): a thin `release` sub-workflow, the slot, that
   includes two sub-workflows with WingFoil's names and phases, `release-submit` and
   `release-publishing`, the eight phases above; `staging-rehearsal` described generically
   (rehearse the publication without making it public). A phase pack that fills the slot replaces
   `release` only.
3. **Release tokens and ids** (C6): the token `{release-line}`, the release's field of that name as
   WingFoil defines it; a path parameter each for `release` and `release-line`, and the two id
   patterns as parameters with defaults `rl-{version}` and `rel-{version}`. dl-015's `{line}` is
   dropped.
4. **Machines** (C2): WingFoil's `bug` (`triaged` and `planned` waiting, each gated with a reject to
   `closed`, `returns: {in-progress: planned}`) and WingFoil's `task` (with `in-progress` and
   `returns: {in-progress: backlog}`), since a later pack cannot add `returns`.
5. **The agent** (C9): `agent_name` required with no default; `agent_email` optional, needed when
   the agent has an `adapter` (WingFoil's schema).
6. **Directives:** `traceability` (generic), `doc-versioning`, `security-secrets` and `claim-sources`
   (the generic rule on the sources of claims) in `base`; `determinism` in `software`. None equals a
   WingFoil built-in id.
7. **`parked`** in `plan`: `[draft, parked, active, done]` with `returns: {active: parked}`: a plan
   is parked with `memory park` and resumed with `submit`, and reaches `done` without passing
   `parked`; `parked` reads "not running: queued or suspended".
8. **This repository's adoption** (W9): its `tooling` and `pack-delivery` phases stay custom
   workflows of this repository, outside both packs.
9. **The install folder:** the format-1 `built-in/` mapping (spec-001 §7.6), provisional until
   WingFoil dl-138's tech-spec (O12, O13).
10. **AGENTS.md markers:** task-252's, provisional until WingFoil dl-137 (b) (spec-001 §10, O2).
11. **R2's shape** (a): `software`'s charter fixes the contract of the `delivery` slot (its name,
    `kind: sub`, `release` and `retrospective` included by name); a project with no methodology
    pack, such as WingFoil adopting by hand, fills it with its own workflows; WingFoil's `sunset`
    maps to `end-of-life`. A methodology modelled on WingFoil's loop is weighed in M3.
12. **Validating `software`** (dl-022 S6): a methodology that exists only as a test fixture, on the
    model of the golden tree's `methodology/flow`, never published.

Errata to name at the wave's opening (dl-020 R3): none open; plan-039's R3 and R7–R10 are folded
back by plan-040.

Not in this plan: WingFoil 0.3.0's intake into `compat.yaml` (`wingfoil-release-intake`, the next
plan, run by this session after this one); the `author` phase, whose tasks write the packs (a plan
per pack once its charter is `accepted`); `first-release`, the publication and this repository's
adoption (W9).

## Steps

On branch `pack/foundation-charters`, from `main` at `070fdb4`.

| # | Who | Step | Produces |
|---|---|---|---|
| 1 | claude | This plan: written, independently reviewed, amended, submitted (`draft → active`); then the start of W8 reported to the coordinating session, as agreed with WingFoil | this plan |
| 2 | claude (product-owner) | `pack-foundation-base`: `memory add --type pack --set axis=foundation --set name=base`; the charter written from dl-022 S2/S4, dl-015 C1 (decision-log), C3, C4, C7, C8, C9, C11 and the rulings above | `docs/memory/pack/pack-foundation-base.md` |
| 3 | claude (product-owner) | `pack-foundation-software`: likewise, from dl-022 S3, dl-015 C1 (adr, tech-spec), C2, C5, C6, C10 (adr, tech-spec, bug) and the rulings above, with the mapping of the eight release phases and the `delivery` contract | `docs/memory/pack/pack-foundation-software.md` |
| 4 | claude | an independent review of each charter (dl-017), amended while `draft`, re-reviewed when a fix changes a ruling; each submitted (`draft → proposed`) | — |
| 5 | claude | a re-check at `wingfoil/wingfoil@v0.3.0` (and UI's and Benchmark's heads): what changed since `92bec996` in the values the charters use, and 0.3.0's CHANGELOG (keys, formats, capabilities); the charters amended while `proposed`, re-reviewed when a ruling changes | the charters' Execution Notes |
| 6 | claude | dl-015's Execution Note: how the charters rule each of C1–C11, with the corrections found on 2026-10-16 | dl-015 |
| 7 | approver | accepts each charter (`proposed → accepted`) and approves dl-015, from the commands claude gives | — |
| 8 | claude | push, the real CI run's conclusion recorded here; on the approver's OK, `--no-ff` merge into `main`, push, the branch removed; the charters' approval reported to the coordinating session | — |

What each charter must hold, besides its types, workflows, directives and parameters:
- R1's four points, R4, and the `produces` of every phase whose artefact is a file;
- its AGENTS.md section (`base`'s opens with the file's level-1 heading), with the provisional
  markers;
- the provisional install mapping and lock (ruling 9);
- its compatibility: the formats it is written in, 0.3.0 the oldest release of its matrix, no
  workflow key newer than it;
- spec-002's CB-1 and CB-2 (its exemption while the tree holds no methodology), and CB-6 live at the
  first tag (plan-024);
- `base`'s examples due with W10;
- its exit criterion (dl-022 S6): `base` with the parameters of every governed project, the
  non-software ones through a generic fixture and a check outside this repository that records
  only its outcome; `software` with those of the four governed software repositories, through the
  fixture methodology of ruling 12.

## Handoff

- **claude:** steps 1–6 and 8, except the approver's gates.
- **Approver:** the rulings above (given); the acceptance of each charter and dl-015's approval
  (step 7); the merge OK.
- Done when both charters are `accepted` and dl-015 is `approved`, on `main`, pushed. The plan then
  goes `active → done`, and the intake of WingFoil 0.3.0 starts.

## Execution Notes

- 2026-10-19: written; `workflow` and `phase` filled by editing the draft (W-02).
