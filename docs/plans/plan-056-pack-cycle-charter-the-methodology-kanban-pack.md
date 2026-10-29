---
id: plan-056-pack-cycle-charter-the-methodology-kanban-pack
type: plan
title: "pack-cycle charter: the methodology/kanban pack"
status: draft
workflow: "pack-cycle"
phase: "charter"
tags: ["packs","kanban","methodology","W10"]
---

## Context

The `charter` phase of `pack-cycle` for `methodology/kanban`, the first step of W10 (sequencer:
F4.3 `kanban`, F2.6 presets, F4.2 `governance/wingfoil-dogfood`, then this repository's adoption,
its WingFoil pin and the first inbox sync). Asked by the approver on 2026-10-29 ("prepare the plan,
then we run it from a new session").

**Why now.** W9 is closed (plan-052: `base`, `software` and `methodology/scrum` published), and
the retrospective of the period is closed with its actions applied (plan-054, plan-055). This
repository adopts at W10 with `methodology/kanban`, since its delivery is Kanban and `software`
composes only with a methodology (plan-052 ruling 7, dl-003's note); the presets need a pack per
methodology. So `kanban` comes first in W10.

**Hosting**, the two deviations plan-041 and plan-047 accepted, for the same reasons:
`sw-life-cycle` › `pack-delivery` iterates over packs already `accepted`, while `charter` creates
and accepts one (a row of `docs/owed-items.md`, plan-041 › Context); and no workflow engine runs
this repository's plans (it pins WingFoil 0.2.2). The plan runs on branch
`pack/methodology-kanban-charter`, from `main` at the commit that submits it. It is the first
charter under `pack-cycle` v6 and dl-032: a run on the real engine before acceptance (E2), and
`activate` at the first tag with the retrospective after (dl-033), both later phases' concern
except E2.

**Preconditions, met.** `base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0 published,
their charters `active`; `software`'s `delivery` contract as dl-026 D1 amends it (a methodology's
`delivery` includes `release` and `retrospective` directly or through its own subs; where
`release` is included, the phase iterates over `release` with `where: { status: [in-development]
}`); the lint `life-cycle-includes` checks it (task-051); `check:runs` (task-053, task-058) and the
adoption run (task-060) exist.

**Inputs the new session reads first.**
- This plan; `pack-cycle.yaml` v6; dl-032 (E2, E4) and dl-033; `docs/owed-items.md` (the rows with
  trigger W10, the `pack-delivery` selection row).
- The model: `pack-methodology-scrum` (its sections, Adaptations, Adoption, Acceptance) and
  plan-047 with its Execution Notes (the engine's phase order: two repeating streams cannot both be
  phases of `delivery` in one pass; the nested shape that works; `memory add --set` fills only id
  and path tokens, F-034).
- spec-001 §3, §6.3, §6.5, §7.5 (`limits`, `template.frontmatter.required`,
  `not_applicable_allowed`), §9, §10, §12, §18; spec-002 §2 (README, CB-1 … CB-6).
- dl-001 (axes), dl-003 (D4, D10, D11 and their notes), dl-006 (Context: "Kanban has no sprint
  end"), dl-022 S5, dl-026, dl-027, dl-017 … dl-020; the directives `pack-authoring`,
  `pack-semver`, `pack-compatibility`, `traceability`, `repository-practice`.
- The golden tree's `methodology/kanban` (`tests/fixtures/compose/tree/`), the fixture
  methodology of task-047, and this repository's own `kanban-delivery.yaml` and `dna.yaml` (WIP
  limits by hand, continuous flow).
- **The method's source:** the Kanban Guide (kanbanguides.org), its current edition read and cited
  with its date in the README, as `scrum` cites the Scrum Guide 2020.
- **How the governed repositories that run Kanban work:** this repository, and WingFoil Benchmark
  (read at a commit recorded here); WingFoil 0.3.1's `init` template "Kanban".

## Proposed outline (ruled by the approver before `submit`)

1. **The source is the Kanban Guide.** Its practices (visualise the workflow, limit work in
   progress, actively manage items in the workflow, improve it) and its four flow measures (WIP,
   throughput, work item age, cycle time) are the pack's rules. The Kanban Method's wider
   practices and service-delivery roles are out of scope, a later minor if asked.
2. **No timebox and no new Memory type.** A work item is `software`'s `task`; the board's columns
   are the task machine's states. No `sprint`-like element: Kanban has none. Any field the pack
   adds to `task` (a class of service, for example) is decided by the engine run (step 2), not
   assumed.
3. **WIP limits through `limits`** on the `task` type's working states (WingFoil enforces a limit
   at the transition, as `scrum`'s `sprint` uses it), each value a parameter. Defaults proposed in
   the charter after step 2, checked against this repository's own (one task in progress and one in
   review per pack, today by hand).
4. **The shape of `delivery`** is settled by step 2, not here. The question: how a continuous
   stream of tasks, releases taken when the approver decides, and a retrospective with no Sprint
   end fit one pass of `sw-life-cycle`, given that WingFoil runs phases in order. The candidate,
   from plan-047's nested shape: `delivery` iterates over `release` (`where: { status:
   [in-development] }`), through a sub bound to the release that runs its tasks (`iterate_over:
   task`), the release and a `retrospective` per release. Alternatives the run must compare: a
   retrospective on a cadence parameter, or every N releases. What 0.3.x cannot express goes to the
   approver when found (dl-019) and becomes an Adaptation in the charter.
5. **Names that collide with no adopter.** The pack's sub for one work item is not
   `kanban-delivery`: this repository and Benchmark have a custom workflow of that name, and
   WingFoil refuses two workflows of one name (`E_WORKFLOW_DUPLICATE_NAME`; bug-007's pattern, P3).
   Proposed: `work-item`, as `scrum` named `backlog-item`. Every name the pack ships is checked
   against WingFoil's built-ins and both adopters' `custom/` files.
6. **Roles:** no new role (the Guide defines none); `base`'s and `software`'s roles, the agent a
   developer with no approval authority. The `approver`'s gates are an Adaptation the README
   declares.
7. **Directives:** `kanban` (the practices, WIP limits and pull, the flow measures, replenishment
   and the retrospective's cadence as step 2 settles them) and a `definition-of-done`, generic, as
   `scrum`'s (the two packs never compose together: at most one methodology); ids checked against
   WingFoil's built-ins.
8. **Parameters:** the WIP limits; nothing else until needed.
9. **AGENTS.md section:** level 2, `## Kanban`: pull within the limits, one item's flow, releases
   when the approver decides, the agent never approving; it names `delivery`.
10. **Examples and exit criterion** (`author`'s, recorded in the charter): README examples of
    fictional projects only (spec-002 §2.4), one on the defaults and one with other limits; the
    exit criterion includes, per dl-032 E4, a run of the pack's workflows through `release` to
    `released` at least once, by hand where `check:runs` cannot drive it, and `check:runs`
    scenarios that start `sw-life-cycle` with `kanban` (as task-058 does for `scrum`).
11. **Adoption:** the procedure for any project, then two known adopters: this repository (W10:
    its `kanban-delivery` and `tooling-delivery` mapped to the pack's workflows, its custom
    `sw-life-cycle` against `software`'s, its `tech-lead` holder; the rows of P3 in
    `docs/owed-items.md`), and Benchmark, described from its repository, not changed by this
    repository. The adoption itself is W10's later plan, not this charter's.
12. **Compatibility:** the v0.3 formats, every WingFoil release `compat.yaml` lists from 0.3.0;
    requires `base@^2` and `software@^1`.

## Steps

On branch `pack/methodology-kanban-charter`; one commit per step that writes. Before every commit,
the privacy check (`repository-practice` rule 2).

1. **Read and research.** The inputs above; the Kanban Guide's current edition; Benchmark at a
   commit recorded in the notes. Findings that change a point of the outline go to the approver
   before step 2.
2. **The run on the engine (dl-032 E2).** A draft `kanban` (types tightened, `delivery` and its
   subs, directives) composed with `base` and `software` as an overlay under `tests/fixtures/`,
   untracked, never committed (plan-047's precedent), validated with no warning on 0.3.0 and
   0.3.1. Then, in a scratch repository on 0.3.1 (the newest release `compat.yaml` lists, or 0.3.2
   if it is listed by then), `sw-life-cycle` driven with the `workflow` and `memory` commands
   through every phase the pack adds: every loop at least once around, each `iterate_over` with
   two candidates driven to the end of its sub through every state they take, in their `where` and
   out of it, and a candidate spanning two iterations of an enclosing loop (a task across two
   releases); the `limits` refusing a transition over the limit; a release to `released`.
   Recorded here with commands and exit codes. Its findings settle outline points 2 … 4 and 7 with
   the approver (dl-019).
3. **The charter.** `npm run -s wingfoil -- memory add --type pack --title "methodology/kanban"`
   (check the printed id, W-14: expected `pack-methodology-kanban`); body as `pack-methodology-
   scrum`'s sections (Purpose, Ships, Adaptations to the Kanban Guide, Commitments to adopters,
   Adoption, Out of scope, Compatibility, Acceptance, Open points), with step 2's run cited;
   required frontmatter filled by editing the draft (W-02).
4. **Independent review** of the charter by a subagent (dl-017), amended while `draft`/`proposed`;
   a re-review when a fix changes a ruling. Then `memory submit` (draft → proposed).
5. **The approver's gate.** The approver accepts the charter (proposed → accepted) with
   `npm run -s wingfoil -- memory approve pack-methodology-kanban --reason "…"`, run by the
   approver, or sends it back.
6. **Branch close:** from a clean clone on Node.js 22.21.0 and 22.12.0, the two test suites one
   after the other: `npm ci`, `npm test`, `npm run lint`, `check:packs`, `validate`, `index --
   --check`, `check:runs` and `workflow list` exit 0; push, the real CI conclusion recorded here;
   the privacy check of the branch's diff recorded; on the approver's OK, `--no-ff` merge into
   `main`, push, `main`'s CI read (`repository-practice` rule 3), the branch removed. Every item
   left owed gets its row in `docs/owed-items.md` with the note that leaves it (rule 4).

**Not in this plan:** the pack's tasks (`author`, the next plan), its first release, the presets
(F2.6), `governance/wingfoil-dogfood` (F4.2), this repository's adoption, pin and inbox sync;
dl-013 (`pending`, another methodology); dl-024 and dl-025 (`pending`).

## Handoff

- **claude (product-owner, facilitator):** steps 1 … 4 and 6, except the approvals and the merge
  OK. It never runs `memory approve` or `memory reject`. No pull request. Files staged by name;
  `docs/notes/` and `.idea/` stay untracked. Repository texts follow `repository-practice`.
- **Approver:** this plan's outline before `submit`; any finding of steps 1 … 2 that changes a
  point; the charter's acceptance; the merge OK.
- **Start:** a new session, asked by the approver on 2026-10-29, reads this plan and its inputs,
  asks the approver to rule the outline, and submits this plan (`draft → active`).
- Done when `pack-methodology-kanban` is `accepted` on `main`, with step 2's run recorded, its
  review applied, and the CI of the branch and of `main` read `success`. The plan then goes
  `active → done`.

## Execution Notes

- 2026-10-29: written as asked by the approver on 2026-10-29, after plan-055's close; `workflow`
  and `phase` filled by editing the draft (W-02). Next free numbers when written: plan-057,
  task-066, dl-034, bug-009, prel-006, F-042.
