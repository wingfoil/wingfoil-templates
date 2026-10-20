---
id: plan-041-pack-cycle-charter-the-two-foundation-packs-base-and-software
type: plan
title: "pack-cycle charter: the two foundation packs, base and software"
status: active
workflow: "pack-cycle"
phase: "charter"
tags: ["packs","base","software","W8"]
---

## Context

Wave W8 (milestone M2) opens on the approver's request in chat on 2026-10-19: the `charter` phase of
`pack-cycle`, run once for each foundation pack of dl-022, `base` and `software`.

**Hosting, two deviations accepted by the approver (2026-10-20).** `sw-life-cycle` › `pack-delivery`
iterates over packs already `accepted`, while `charter` is the phase that creates and accepts a
pack; and one plan hosts both iterations, where WingFoil 0.3.0's model binds one plan to one
element. Both are acceptable here: no workflow engine runs this repository's plans (it pins
WingFoil 0.2.2), and the two charters share their rulings and are accepted together. The plan also
hosts dl-023 (below), whose capture would otherwise be a `decision-log-ingest` plan of its own,
because it only records what these charters need. A later configuration change fixes
`pack-delivery`'s selection (a charter before the iteration).

**Preconditions, met.**
- WingFoil 0.3.0 is released (tag `v0.3.0` on `wingfoil/wingfoil@cc31d7a8`, on npm as `latest`,
  2026-10-19), so the v0.3 formats are final and released.
- The tech-specs W8 builds on are amended (dl-020): spec-001 and spec-002 by plan-038 (dl-022), and
  plan-039's rulings R3 and R7–R10 folded back in place by plan-040. One item on spec-001 is still
  open and owned by this wave, folded back at its close (dl-020 R2): §8.3 cites a removed note for
  the `{release}` and `{scope}` tokens, and follows dl-015's ruling.
- The tooling implements both foundation packs, the conditional part and the memory keys of §7.5
  (plan-039, task-031 … task-034).

**What the charters take as inputs.**
- dl-022 (S1–S6), as dl-023 amends it, and dl-015 (`pending`), whose points C1–C11 split between
  the two charters as dl-022 says and are ruled with them.
- A re-reading of the governed repositories on 2026-10-16 (`wingfoil/wingfoil@92bec996`,
  `wingfoil/wingfoil-ui@cce3656`, `wingfoil/wingfoil-benchmark@8cf7ae4` and this repository at
  `070fdb4`), and of the three private, non-software projects for the `plan` type only. Findings
  that change dl-015's table: C8 (WingFoil also gives `traceability` to the facilitator), C9
  (WingFoil's agent has a name, an email and an `adapter`), C2 (Benchmark's `bug` is the default
  machine plus `fixed`), C10 (the release folder differs between WingFoil and UI), C3 (Benchmark's
  `decision-log-ingest` has one phase). The non-software projects' `plan` sequence
  `[draft, active, parked, done]` makes every plan pass `parked` before `done`. Step 2 reads
  WingFoil 0.3.0 again before any charter is written.
- WingFoil 0.3.0's engine, read at `v0.3.0`: `workflow start` adds a plan and submits it
  `draft → active`; `workflow end` moves it `active → done` along a `waiting` edge; an instance is
  open only while its plan is `draft` or `active`. The only `waiting` edges 0.3.0 drives are that
  finalize and `supersedes:` (`adr`, `tech-spec`); `submit` refuses to leave a `waiting` state.
  `memory park` takes a `returns` edge. WingFoil 0.2.2 knows `waiting` but not `returns`, `limits`,
  `exempt`, `not_applicable_allowed`, `amendable`, `lists`, `memory park` or the engine: packs that
  use them are compatible from 0.3.0 on, the oldest release of their matrix, and no workflow uses a
  key newer than it.
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
  - **R4:** every phase whose artefact is a file declares it in `produces` (`{ type, path }` for a
    Memory element, a path for a document).
- Facts found by plan-039 for this wave: WingFoil 0.2.2 refuses a composition with no `kind: main`
  workflow, so `governance-evolution` stays `main`; `software` cannot be composed without a
  methodology (spec-001 §3); a `waiting` state that a tightening of `defaults` adds reaches a type
  already detached that had inserted it.
- A by-hand test relayed on 2026-10-15: an agent other than Claude read a composed AGENTS.md region
  and honoured its rules, and the provisional markers caused no trouble; a WIP rule is checkable
  only when the `task` type has an `in-progress` state.

**The approver's rulings in chat** (2026-10-18 to 2026-10-20), recorded here because no element
holds them yet; dl-023 records those that amend dl-022:
1. **`waiting`, per type:** only where WingFoil 0.3.0 drives the edge for every adopter: `plan`
   `[active]` (`workflow end`), `adr` `[accepted]` and `tech-spec` `[approved]` (`supersedes:`).
   `task`, `bug`, `release` and `release-line` have none: their edges move with `submit` or
   `approve`. `returns`, `limits` and the set-once keys of spec-001 §7.5 are used where the rulings
   below say; `exempt` is never in a pack.
2. **The default `release`** (dl-015 C5, R3): a thin `release` sub-workflow, the slot, that
   includes two sub-workflows with WingFoil's names and phases, `release-submit` and
   `release-publishing`, the eight phases above; `staging-rehearsal` described generically
   (rehearse the publication without making it public). Both are part of `software`'s `release`
   contract: owned by `software` only (spec-001 §7.6), reusable by a phase pack's `release`, and
   composed even when a phase pack's `release` does not include them.
3. **Release tokens and ids** (C6): the token `{release-line}`, the release's field of that name as
   WingFoil defines it; a path parameter each for `release` and `release-line`, and the two id
   patterns as parameters with defaults `rl-{version}` and `rel-{version}`. dl-015's `{line}` is
   dropped. A release path that names the line's folder as `rl-{release-line}` repeats the `rl-`
   prefix of the release-line id's default; the charter says so.
4. **Machines.** `software`'s `bug` (C2): WingFoil's states, each of `open`, `triaged` and `planned`
   gated with a reject to `closed`, `in-review` and `resolved` gated with a reject to `in-progress`,
   no `waiting`, and `returns: {in-progress: planned}`. Its cost: `triaged → planned` and
   `planned → in-progress`, and a resume after a park, become `approve` edges that only the human
   approver can take (the agent has no approval authority); O15 is the way back. `software`'s
   `release` and `release-line`: WingFoil's states and gates, no `waiting` (`release-line`'s
   `active → done` has no 0.3.0 driver). `base`'s `task`: WingFoil's states with `in-progress`,
   gates `pending` (reject to `draft`) and `in-review` (reject to `in-progress`), no `waiting`, and
   `returns: {in-progress: backlog}`. A later pack cannot add `returns` (spec-001 §7.5), so the
   foundation declares them.
5. **The agent** (C9): `agent_name` required, with no default. No `agent_email` parameter: a
   parameter is optional only with a default (spec-001 §8.1), and WingFoil 0.3.0 refuses an empty
   or reserved address; `base`'s DNA fragment writes no email, and a project whose agent has an
   `adapter` adds it to its own `dna.yaml` (dl-023).
6. **Directives:** `traceability` (generic), `doc-versioning`, `security-secrets` and
   `claim-sources` (the generic rule on the sources of claims) in `base`; `determinism` in
   `software`. None equals a WingFoil built-in id.
7. **`plan`:** WingFoil 0.3.0's machine, `[draft, active, done]` with `waiting: [active]`, and no
   `parked` (dl-023). `submit` cannot leave `active`: a plan that is an instance started by
   `workflow start` is closed by `workflow end` once its workflow is complete; a phase plan, which
   is no complete instance, by a hand-written `wf(plan): finalize <id> [active → done]` commit, as
   WingFoil does. Adopting `base` therefore needs WingFoil 0.3.0 or later, the oldest release of its
   matrix (W9). `parked` returns in a later version of `base` once WingFoil's engine can suspend an
   instance off the `submit` path; a feedback note asks WingFoil for it, and for a verb that closes
   a plan that is not an instance.
8. **This repository's adoption** (W9): its `tooling` and `pack-delivery` phases stay custom
   workflows of this repository, outside both packs.
9. **The install folder:** the format-1 `built-in/` mapping (spec-001 §7.6), provisional until
   WingFoil dl-138's tech-spec (O12, O13).
10. **AGENTS.md markers:** WingFoil task-252's, provisional until WingFoil dl-137 (b) (spec-001
    §10, O2).
11. **R2's shape** (a): `software`'s charter fixes the contract of the `delivery` slot (its name,
    `kind: sub`, `release` and `retrospective` included by name). A composition with `software`
    holds a methodology (spec-001 §3); a project that adopts by hand, as WingFoil will, and fills
    `delivery` with its own `custom/` workflows does so outside the composer's contract, until a
    methodology modelled on its loop exists (weighed in M3). WingFoil's `sunset` maps to
    `end-of-life`.
12. **Validating `software`** (dl-022 S6): a methodology that exists only as a test fixture, on the
    model of the golden tree's `methodology/flow`, never published.
13. **The approver in DNA** (dl-022 S2): two required parameters with no default, `approver_name`
    and `approver_email`, for the member holding the `approver` role (dl-023). WingFoil 0.3.0 grants
    approval by matching the git user's email to a member's `email`, so a member without one
    approves nothing. `base` declares the roles its workflows use; `software` adds those of its
    own.
14. **A later pack may add `waiting` to an existing state** when it ships the workflow that drives
    the edge, which would let a methodology restore WingFoil's "no manual verb" edges for the
    projects that run it: recorded as open point O15 of spec-001 by this plan (ruling 1's way
    back).

Then, at the charters' review, on 2026-10-20:
15. **Ruling H.** A `release` edge may also move by a workflow action naming its target state,
    `element.set_state(<state>)`, as WingFoil's `enter-releasing` and `mark-released` do; it needs
    no `waiting`, so ruling 1 holds.
16. **Ruling I** (dl-015 C2): Benchmark's `bug` migrates `draft → draft`, `pending → open`,
    `approved → planned`, `fixed → resolved` (`closed` if Benchmark reads "fixed" as closed).
17. **Ruling J.** Both packs declare `requires_capabilities: [workflow-engine]`, as dl-003 D3 asks
    of a `base` with `waiting` states; the intake of WingFoil 0.3.0 records whether 0.3.0 provides
    it: under dl-021 R4 the commands its CHANGELOG names (`workflow start`, `end`, `next`,
    `finalize`) are what records it, although the CHANGELOG uses no capability names (step 2's
    note). D3 stands: `base`'s first version is 1.0.0, the later major D3 allows.

Not in this plan: WingFoil 0.3.0's intake into `compat.yaml` (`wingfoil-release-intake`, the next
plan, run by this session after this one); the feedback note asking WingFoil to suspend an
instance (its own task, after this plan); the `author` phase, whose tasks write the packs (a plan
per pack once its charter is `accepted`); `first-release`, the publication and this repository's
adoption (W9); the fix of `pack-delivery`'s selection.

## Steps

On branch `pack/foundation-charters`, from `main` at `070fdb4`.

| # | Who | Step | Produces |
|---|---|---|---|
| 1 | claude | This plan: written, independently reviewed, amended, submitted (`draft → active`); then the start of W8 reported to the coordinating session, as agreed with WingFoil | this plan |
| 2 | claude | A re-read at `wingfoil/wingfoil@v0.3.0` (source, CHANGELOG, `init`'s scaffold) and at UI's and Benchmark's heads: what changed since `92bec996` in the values the charters use; recorded in this plan's Execution Notes | — |
| 3 | claude, drafting for the approver | dl-023: `memory add --type decision-log`; it amends dl-022 S2 (`plan` without `parked`, no `agent_email` parameter, `approver_name` and `approver_email`); reviewed, amended while `draft`, submitted (`draft → pending`) | dl-023 |
| 4 | claude, drafting for the product-owner | `pack-foundation-base`: `memory add --type pack --title Base --set axis=foundation --set name=base`, `pack_path` filled by hand; written from dl-022 S1, S2, S4, S5, dl-023, dl-015 C1 (decision-log), C3, C4, C7, C8, C9, C10 (decision-log, task, plan), C11 and the rulings above | `docs/memory/pack/pack-foundation-base.md` |
| 5 | claude, drafting for the product-owner | `pack-foundation-software`: likewise (`--title Software --set name=software`), from dl-022 S3, S5, dl-015 C1 (adr, tech-spec), C2, C5, C6, C10 (adr, tech-spec, bug, release, release-line) and the rulings above, with the mapping of the eight release phases and the `delivery` contract | `docs/memory/pack/pack-foundation-software.md` |
| 6 | claude | an independent review of each charter (dl-017), amended while `draft`, re-reviewed when a fix changes a ruling; each submitted (`draft → proposed`) | — |
| 7 | claude | spec-001 §16: open point O15 (ruling 14), with an Execution Note; the merge OK approves the text | spec-001 |
| 8 | claude | dl-022's Execution Note (amended by dl-023). dl-015's Execution Note: how the charters rule each of C1–C11, superseding its Proposal column point by point, with the corrections of 2026-10-16; independently reviewed | dl-022, dl-015 |
| 9 | claude | push; the real CI run's conclusion recorded here | — |
| 10 | approver | approves dl-023 and dl-015, accepts each charter (`proposed → accepted`), from the commands claude gives | — |
| 11 | claude | on the approver's OK, `--no-ff` merge into `main`, push, the branch removed; the charters' approval reported to the coordinating session | — |

What each charter must hold, besides its types, machines, workflows, directives and parameters:
- `pack_path` (`packs/base`, `packs/software`); `requires` (`base`: none; `software`:
  `base@^1`); `formats` and `requires_capabilities` from the provisional vocabulary (dl-002,
  dl-021 R4, spec-001 O3); the WingFoil range computed, never written;
- its Memory paths per type, as parameters with this repository's form as default, the `{release}`
  and `{scope}` tokens passing through (spec-001 §8.3);
- its roles, and `base`'s DNA fragment: the approver member, the agent without approval authority;
- R1's four points, R4, and the `produces` of every phase whose artefact is a file;
- `base`: dl-022 S4's rules around `governance-evolution` (the retrospective signals points, one
  plan per point, the boundary with `decision-log-ingest`), the `capture` of dl-006 R2 as amended,
  and what runs `retrospective` in a composition without `software` (spec-001 §9);
- its "Out of scope", with dl-022 S5;
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

- **claude:** steps 1–9 and 11, except the approver's gates.
- **Approver:** the rulings above (given); step 10; the merge OK, which also approves spec-001's
  O15.
- Done when dl-023 and dl-015 are `approved` and both charters `accepted`, on `main`, pushed. The
  plan then goes `active → done`, and the intake of WingFoil 0.3.0 starts.

## Execution Notes

- 2026-10-19: written; `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-20: independent review: request changes. Two blocking findings, from WingFoil 0.3.0's
  engine (verified at `v0.3.0`): the `plan` machine with `parked` breaks `workflow start` and `end`,
  and `waiting` as WingFoil uses it strands the adopters without its driving workflows. The
  approver ruled 1, 4, 5, 7 again and 13, 14 and the hosting deviations (2026-10-20); the re-read
  of 0.3.0 moved before the charters; the open §8.3 item named; dl-015's note reviewed; CI before
  the gates; the charters' contents completed. Re-review requested.
- 2026-10-20: re-review: request changes, one blocking finding: WingFoil 0.3.0 grants approval by
  the member's email, so `approver_name` alone leaves no one able to approve. The approver ruled
  `approver_email` (13) and how a plan closes under `waiting: [active]` (7). Also applied:
  `release-line` without `waiting`, the cost of ruling 4, dl-022's note, `task`'s gates, wraps.
- 2026-10-20: focused re-review: approve after amendments, nothing blocking; ruling 7's reason for
  leaving 0.2.2 corrected (0.3.0 is the oldest release of the matrix), wraps. Plan submitted.
- 2026-10-20, step 2 (re-read at `wingfoil/wingfoil@v0.3.0` = `cc31d7a8`, `origin/main` at
  `1b686151`; `wingfoil/wingfoil-ui@b4496d4`; `wingfoil/wingfoil-benchmark@8cf7ae4`):
  - unchanged since `92bec996`: `memory.yaml` 3.5 (types, machines, keys), `dna.yaml`, `roles.yaml`,
    the schemas, the state machine, the format constants (all 1), the built-in directive ids, and
    `init`'s scaffold. No phase name changed. UI and Benchmark: no change in `.wingfoil/`; UI still
    pins 0.2.2, Benchmark a pre-0.2 build;
  - every claim of this plan's Context on the engine is confirmed. Corrections: WingFoil's
    `release` has no gate (`[draft, planning, in-development, releasing, released]`, all three
    middle states `waiting`), so with ruling 1 every release edge is a `submit` and the approval is
    the `approve-release` phase's; its id pattern is `{kind}-{version}`, `rel-{version}` being
    ruling 3's generic default;
  - new: WingFoil's agent file is `AGENTS.md`, with the same provisional markers as spec-001 §10
    (ruling 10 holds); `release-publishing` 1.9 tags on an integration branch (`main` for a minor,
    `release/X.Y` for a patch), which a generic default leaves to the project;
  - for the charters, from 0.3.0: a phase plan needs a non-empty `parent` (`<workflow>.<phase>`), or
    it is deduced as an instance; a `{ type, path }` in `produces` needs a `memory.add(type: T)`
    action in the same phase, and only elements added with `--workflow`/`--step` count as a step's
    evidence; `init` 0.3.0 writes `custom/` directives with the ids `traceability`,
    `doc-versioning`, `security-secrets` and `determinism`, which win over a pack's of the same id,
    so an adopter removes those stubs; ruling 1 changes WingFoil's verbs on edges (states stay
    identical), which `software`'s charter says to WingFoil; WingFoil's bug-400: `init` 0.3.0's
    workflows declare no `role`, `actions` or `produces`, so the packs would be the first
    configuration the engine can drive;
  - 0.3.0's CHANGELOG names no capability: neither `pack-install` nor a workflow engine; template
    installation is v0.4 (WingFoil dl-138). No ruling changes.
- 2026-10-20, steps 3–4: dl-023 written, reviewed (approve after amendments), amended and
  submitted (`pending`). Both charters written and reviewed; `base`'s: request changes (two
  textual blockers: a `*` in a `produces` path, `modules`/`stacks` missing from the DNA);
  `software`'s: request changes (the thin `release` must be element-bound; `submit` misfires on
  the release phases after a reject; the exit criterion's fixture). The approver ruled H and I
  (15, 16) and asked whether adoption applies to other projects: the charters' Adoption sections
  now open with the procedure for any project. Amended; focused re-reviews requested.
- 2026-10-20, steps 6–8: both charters re-reviewed (approve after amendments), amended and
  submitted (`proposed`); spec-001's O15 written; dl-022's and dl-015's notes written, reviewed
  (approve after amendments), amended. The review found dl-003 D3 (a `base` with `waiting` requires
  `workflow-engine`) unaddressed: the approver ruled J (17).
- 2026-10-20: ruling J checked (approve after amendments): publication waits for the intake,
  ruling 17's reading of the CHANGELOG under dl-021 R4, wording and wraps.
- 2026-10-20, step 9: branch pushed; CI run 39435669505 on `f6a674a`, conclusion `success`
  (`validate (22.12.0)` and `validate (22.21.0)` both `success`), the full suite on both Node.js
  versions. Privacy: the diff names no non-software project, no local path and no private
  repository. Waiting for the approver's gates (step 10) and the merge OK.
- 2026-10-20, step 10: the approver approved dl-023 and dl-015 and accepted `pack-foundation-base`
  and `pack-foundation-software` (`proposed → accepted`), with their open points as written; the
  merge OK in chat approves spec-001's O15.
