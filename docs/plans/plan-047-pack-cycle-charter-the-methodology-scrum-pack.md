---
id: plan-047-pack-cycle-charter-the-methodology-scrum-pack
type: plan
title: "pack-cycle charter: the methodology/scrum pack"
status: draft
workflow: "pack-cycle"
phase: "charter"
tags: ["packs","scrum","methodology","W8"]
---

## Context

The `charter` phase of `pack-cycle` for `methodology/scrum`, run in parallel with plan-046 (the
`author` of `software`), as plan-046 ruling 5 set. The approver chose `methodology/scrum` on
2026-10-22 as the methodology published with `software`; WingFoil UI adopts `base`, `software` and
`methodology/scrum` together.

**Why now.** `software` cannot be published alone: `publish:pack` refuses a pack that no
composition of the validation contains, an overlay does not count, and a composition with
`software` needs a methodology in `packs/` (spec-001 §3; plan-046 ruling 6). The fixture
methodology `methodology/fixture` is never publishable (plan-046 ruling 1). plan-046 ruling 6
recommends publishing `software` and `scrum` in the same wave, W9; this charter is the first step.

**Hosting**, the two deviations plan-041 accepted, for the same reasons: `sw-life-cycle` ›
`pack-delivery` iterates over packs already `accepted`, while `charter` creates and accepts one;
and no workflow engine runs this repository's plans (it pins WingFoil 0.2.2). The plan runs on
branch `pack/methodology-scrum-charter`, in a worktree of its own, because plan-046 runs on
`main`.

**Preconditions, met.**
- `pack-foundation-software` is `accepted` (plan-041); its `delivery` contract (R2, R-11) is all
  this charter depends on: `delivery` is the methodology's, `kind: sub`, no `element`; it includes
  `release` with `iterate_over: release` and `where: { status: [in-development] }`, and `base`'s
  `retrospective`, by name at its own cadence; it creates its releases and moves them to
  `in-development`. A methodology that requires `software` ships `delivery` in `contents`
  (spec-001 §6.5).
- How WingFoil 0.3.0 runs that contract is proven by the fixture methodology of task-047
  (`tests/fixtures/software-exit/packs/methodology/fixture/workflows/delivery.yaml`): one phase
  with `memory.add(type: release)` then `element.set_state(in-development)`, with `produces`;
  `version` and `release-line` given with `--set`, because 0.3.0 binds only `type` (F-034).
- `base` 1.0.0 is published (plan-044); its charter is `active`.

**What the charter takes as inputs.**
- spec-001 §3 (axes, cardinalities), §6.3, §6.5, §7.5 (memory keys, `template.frontmatter.required`
  on every type a pack defines, `not_applicable_allowed`, `limits`), §9 (slots), §10 (the AGENTS.md
  section, level 2), §12, §18; spec-002 §2 (README, CB-1 … CB-6).
- dl-001 (axes), dl-003, dl-015, dl-022 S5 (Scrum's rules belong to the methodology),
  dl-023, dl-017 … dl-020; the directives `pack-authoring`, `pack-semver`, `pack-compatibility`,
  `traceability`.
- The golden tree's `methodology/kanban` (`tests/fixtures/compose/tree/`) as the model of a
  methodology pack.
- **The method's source:** the Scrum Guide, November 2020 edition (scrumguides.org), cited with
  its edition in the README, as dl-007 M3 proposes; this plan does not depend on dl-007, which
  stays `pending`.
- **How the governed software repositories work today** (read at `wingfoil/wingfoil@eb582cc1`,
  `wingfoil/wingfoil-ui@6a5ad5c`, `wingfoil/wingfoil-benchmark@996e7ae5`): none runs Scrum.
  WingFoil and UI declare Lean Inception, User Story Mapping, Specification by Example, SARD and
  TDD; their delivery is WingFoil's release-line loop (`release-line-cycle` → `release-cycle` →
  `dev-loop`), with no timebox, a retrospective per release, and a `release-cycle` phase that
  mentions story points no phase estimates. Benchmark runs Kanban. WingFoil 0.3.0's `init`
  template "Scrum" only names the methodology in `dna.yaml` and writes a generic delivery.
- **Research on the method** (2026-10-26): the Scrum Guide 2020 makes Sprints sequential, fixed in
  length and at most one month; it lets an Increment be released before a Sprint ends, says the
  Sprint Review is never a gate to releasing value, and allows several Increments per Sprint; it
  prescribes no user stories, story points, burn-downs or estimation technique. Common software
  practice: two-week Sprints, releases decoupled from Sprints (continuous delivery), and AI agents
  treated as tools inside the Developers, never as a fourth accountability, which matches `base`'s
  agent without approval authority. A pack modelled on WingFoil's loop would therefore be neither
  Scrum nor reusable; the charter follows the Guide, and UI's way of working is one case it allows.

**The approver's rulings** (2026-10-26, in chat, the outline approved as recommended):
1. **The Sprint is its own Memory type, `sprint`, separate from `release`.** It carries the
   timebox and the Sprint Goal; its id pattern and path are parameters (default id
   `sprint-{n}`), with `template.frontmatter.required`. A `release` stays `software`'s and is
   released when the Product Owner decides: it may span several Sprints, or ship an Increment
   before a Sprint ends. A project may run one Sprint per release, as UI can. Rejected: one Sprint
   equal to one release (contrary to the Guide, and not reusable); a Sprint as the `plan` of a
   `main` workflow (it breaks the `delivery` contract).
2. **The shape of `delivery`.** A phase `sprint` (`iterate_over: sprint`, including a sub
   `sprint` bound to `element: sprint`: planning → the Sprint's tasks → review → `retrospective`)
   and a phase `release` (`iterate_over: release`, `where: { status: [in-development] }`,
   `include: release`) as the contract states, with a phase that creates the release and moves it
   to `in-development`. Two points are checked on WingFoil 0.3.0 before the charter is written
   (step 2, step 3): whether the engine's live deduction lets Sprints and releases advance without
   waiting on each other in a strict order, and whether `retrospective` included from the `sprint`
   sub meets the contract's "included by name, at its own cadence". If either fails, it goes to
   the approver when found (dl-019).
3. **Roles:** no new role. Product Owner → `product-owner`, Scrum Master → `facilitator` (`base`),
   Developers → `developer` with `software`'s `architect`, `reviewer`, `qa` and `tech-lead`. The
   `approver`'s gates are an adaptation the README declares. The agent works as a Developer and
   holds no Scrum accountability.
4. **Events:** Sprint Planning, Sprint Review and the Retrospective are phases of the `sprint` sub;
   the Daily Scrum is a rule of the `scrum` directive, with no phase, since it leaves no artefact;
   refinement is a rule too, not an event. The review's outcome is written in the sprint element's
   body: no new `produces`.
5. **Backlog and `task`:** the Product Backlog is the `task` elements in `backlog`; the Sprint
   Backlog is those whose `sprint` field names the Sprint. `scrum` tightens `task` with `sprint` in
   `template.frontmatter.required` and `not_applicable_allowed: [sprint]`, so an item not yet
   planned carries `n/a`. A task's link to a release stays the project's (WingFoil and UI already
   require `release` on `task`). `scrum` ships a thin `dev-loop` sub (`element: task`; `start` →
   `build` → `review` → `done`), named as WingFoil's and UI's; step 2 checks whether a project's
   `custom/` workflow of the same name wins over the pack's.
6. **`limits`:** `sprint` gets a limit of one on its active state (Sprints are sequential); no WIP
   limit on `task` (Kanban's), none on `release`.
7. **Directives:** `scrum` (events, timeboxes, artefacts and their commitments, the Daily Scrum,
   refinement) and `definition-of-done` (generic; a project overrides it in `custom/`), their ids
   checked against WingFoil's built-ins. Nothing of dl-013 (`pending`, another methodology, W15).
   No story points, user stories or burn-downs.
8. **Parameters:** `sprint_length` (string, default `"2 weeks"`; the text says at most one month),
   and the `sprint` type's path and id pattern; nothing else until needed.
9. **AGENTS.md section:** level 2, `## Scrum`: the role mapping, one Sprint at a time, the
   Definition of Done, releases decoupled from Sprints, the agent never approving; it names
   `delivery`, always present since `scrum` requires `software`.
10. **Examples and exit criterion:** when `packs/methodology/scrum` enters the tree, CB-2's
    exemption line falls, and the examples of `base`, `software` and `scrum` are due in the same
    change (spec-002 §2.4). The charter puts them in `scrum`'s `author`: an example on the
    parameters' defaults, one with UI's values, and the exit criterion: task-049's compositions
    redone with `scrum` in place of the fixture methodology, on WingFoil 0.3.0. `base`'s README
    then changes after 1.0.0 (likely a patch); the charter records it and W9's plan rules it.
11. **Adoption:** the procedure for any project, then one known adopter, UI: one Sprint per
    release if it wishes, its own phases (`user-docs`, `e2e-smoke`, its TDD `dev-loop`) kept as
    its own, its step keys mapped old → new (WingFoil dl-187). WingFoil keeps its `custom/`
    delivery (M3, `software`'s R-11); Benchmark and this repository do not adopt `scrum`.
12. **Sequencer:** F4.3 (`scrum`) sits in W10; its charter now runs in W8 and its publication in
    W9. No decision-log now: W9's plan amends `07_sequencer.md`.

**The pack's identity:** id `methodology/scrum`, `axis: methodology`, `name: scrum`,
`pack_path: packs/methodology/scrum`, Memory element `pack-methodology-scrum`;
`requires: [base@^1, software@^1]`, `conflicts: []`, `delivery` in `contents`,
`requires_capabilities: [workflow-engine]`; the formats of the kinds it ships.

**WingFoil 0.3.0 constraints the charter honours:** `template.frontmatter.required` on every type
the pack defines; `memory.add` binds only `type`; a phase plan carries `parent`; a
`produces { type, path }` needs `memory.add` in the same phase; `PATH_PATTERN`
`[A-Za-z0-9._/{}-]`; a phase with no artefact and no state action declares `agent.execute`; a
memory verb in a sub with no `element` and no earlier `memory.add` in the phase selects with a
`where` that has a `type` key. The matrix runs 0.3.0 only (0.2.2 has no `workflow-engine`).

Not in this plan: the `author` phase (tasks from task-051, after plan-046 closes); the
publication and the sequencer amendment (W9); WingFoil 0.3.1's intake.

## Steps

On branch `pack/methodology-scrum-charter`, from `main` at `ca1a19e`.

| # | Who | Step | Produces |
|---|---|---|---|
| 1 | claude | This plan: written, independently reviewed, amended, submitted (`draft → active`) | this plan |
| 2 | claude | A re-read at `wingfoil/wingfoil@v0.3.0` and at UI's head, recorded in the Execution Notes: the live deduction of `iterate_over` (Sprints and releases side by side), how `limits` is enforced, whether a `custom/` workflow wins over a pack's of the same name, `not_applicable_allowed`, the built-in directive ids, UI's step keys | — |
| 3 | claude | A feasibility check outside the repository: a draft `scrum` (`sprint` type, `delivery`, `sprint`, `dev-loop`) composed with `--overlay` and validated on 0.3.0, never committed; its outcome recorded here. A failure of ruling 2 goes to the approver (dl-019) | — |
| 4 | claude, drafting for the product-owner | `pack-methodology-scrum`: `memory add --type pack --title Scrum --set axis=methodology --set name=scrum`, `pack_path` filled by hand; written from the rulings above, `software`'s `delivery` contract and the Scrum Guide 2020 | `docs/memory/pack/pack-methodology-scrum.md` |
| 5 | claude | an independent review of the charter (dl-017), amended while `draft`, re-reviewed when a fix changes a ruling; submitted (`draft → proposed`) | — |
| 6 | claude | push; the CI run's conclusion recorded here | — |
| 7 | approver | accepts the charter (`proposed → accepted`) from the command claude gives | — |
| 8 | claude | on the approver's OK, coordinated with plan-046's session: `--no-ff` merge into `main`, push, `main`'s CI conclusion read, the branch removed locally and remotely; the acceptance reported to UI's session and the coordinating session | — |

What the charter must hold, besides the rulings: Purpose; Ships (the `sprint` type with its
machine, gates, `limits`, id pattern, path and required frontmatter; the `task` tightening; the
workflows with phases, roles, actions, approvals, fallbacks and `produces`; directives; roles
assignments; parameters; the AGENTS.md section); Commitments to adopters (as `base`'s and
`software`'s, R1); Adoption; Out of scope (WingFoil's release-line loop, M3; Kanban's rules;
estimation techniques; a scaled framework); Compatibility (formats, `workflow-engine`, 0.3.0 the
oldest release of its matrix, no key newer than it); Acceptance (CB-1, CB-2 with ruling 10, CB-6
at its first tag; the exit criterion); the adaptations to the Guide the README lists; Open points.

## Handoff

- **claude:** steps 1–6 and 8, except the approver's gates.
- **Approver:** the rulings above (given); step 7; the merge OK.
- Done when `pack-methodology-scrum` is `accepted`, on `main`, pushed. The plan then goes
  `active → done` by a hand-written `wf(plan): finalize` commit.

## Execution Notes

- 2026-10-26: written; `workflow` and `phase` filled by editing the draft (W-02).
