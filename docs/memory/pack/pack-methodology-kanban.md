---
id: pack-methodology-kanban
type: pack
title: "Kanban"
status: draft
axis: "methodology"
name: "kanban"
slot: ""
pack_path: "packs/methodology/kanban"
requires: ["base@^2", "software@^1"]
conflicts: []
---

## Purpose

`methodology/kanban` is the Kanban methodology for software projects governed by WingFoil, after the
Kanban Guide, May 2025 edition (v2025.5, kanbanguides.org). It fills the `delivery` slot of
`software`'s `sw-life-cycle` (spec-001 §3, §9) with a continuous flow of work items under explicit
WIP limits, pulled one at a time from the backlog to done, and released when the Product Owner
decides. It applies the Guide's three practices (defining and visualizing the workflow, actively
managing the items in it, improving it) and its Definition of Workflow, and prescribes nothing the
Guide leaves open: no timebox, no role, no event, no cadence of meetings. Its catalog pack id is
`methodology/kanban`, its directory `packs/methodology/kanban`. It requires `base@^2` and
`software@^1`, so it ships `delivery` in `contents` and carries no conditional part (spec-001
§6.5); a composition with `software` holds exactly one methodology, so it excludes the others by
cardinality, with no `conflicts`. plan-056 holds the approver's rulings this charter applies
(1 … 13) and the run on WingFoil 0.3.1 they rest on (dl-032 E2).

## Ships

**Memory types** (`fragments/memory.yaml`; WingFoil 0.3.0's keys, spec-001 §7.5). No new type: a
work item is `base`'s `task`, and the board's columns are its states.

| Type | Machine | Gates | `limits` | Required frontmatter |
|---|---|---|---|---|
| `task` (`base`'s, tightened) | unchanged | unchanged | `in-progress: {{wip_in_progress}}`, `in-review: {{wip_in_review}}` | adds `release`, with `not_applicable_allowed: [release]` |
| `release` (`software`'s) | unchanged | unchanged | — | unchanged |

- **`task`** is the work item. The backlog is the tasks in `backlog`; the Guide's started point is
  `in-progress` and its finished point `done`. A task carries the release it is delivered in, in a
  required `release` field holding that release's `version` (plan-056 ruling 9), as Benchmark and
  UI already write it (`release: v0.1`); a task not yet assigned to a release carries
  `release: "n/a — <reason>"`, the form WingFoil 0.3.0 accepts at `submit`, and stays out of the
  flow until it is assigned. `base`'s template has no `release` field (a later pack cannot change
  a template file), so the field is written by editing the draft; `memory add --set` fills only id
  and path tokens (F-034).
- **The WIP limits** sit on `in-progress` and `in-review`, each value a parameter (an integer,
  unquoted, spec-001 §8.2). WingFoil enforces a limit inside its verbs: `memory submit` over the
  limit exits 1 (`WIP limit reached for 'in-progress' on type 'task' (limit 2): held by …`), so the
  workflows move a task with `memory.submit`, never with `element.set_state`. A limit counts every
  `task` of the repository, whatever its release or workflow, at HEAD and on every local and
  remote-tracking branch that changed a holder since it forked from HEAD (plan-056, step 2): a task
  started on its own branch holds its place before it is merged, and the count follows the refs
  last fetched. Merged limits only go down (spec-001 §7.5); a project sets its own values through
  the parameters.
- **`release`**, `software`'s, is unchanged: its `version` is the value tasks carry.

**Workflows** (`workflows/`; each phase whose artefact is a file declares it in `produces`, R4;
`software`'s contract as dl-026 and dl-027 amend it).

| Workflow | Kind | Phases (role) |
|---|---|---|
| `delivery` | sub, no `element` | `plan-release` (product-owner: `memory.add(type: release)`, then `memory.submit` twice, to `planning` and `in-development`, the verbs binding to the release just added; produces `{ type: release, path: "{{release_path}}" }`) → `releases` (`iterate_over: release`, `where: { status: [in-development, releasing, released] }`, `include: release-flow`) |
| `release-flow` | sub, `element: release` | `work` (`iterate_over: task`, `where: { status: [backlog, in-progress, in-review, approved], release: "{release.version}" }`, `include: work-item`) → `release` (`iterate_over: release`, `where: { status: [in-development, releasing], version: "{release.version}" }`, `include: release`, dl-027) → `retrospective` (`include: retrospective`, `base`'s) |
| `work-item` | sub, `element: task` | `start` (developer: `memory.submit` `backlog → in-progress`, within the limit) → `build` (developer: `agent.execute`, to the Definition of Workflow's finished point) → `review` (reviewer: `memory.submit` `in-progress → in-review`, within the limit) → `approve` (approver: `memory.approve` `in-review → approved`, approval by the approver, fallback `build`) → `done` (developer: `memory.submit` `approved → done`) |

- **How it runs on WingFoil 0.3.x** (plan-056 rulings 8 and 11, step 2). WingFoil evaluates a
  workflow's phases in order, and a phase that completes closes every earlier live phase, whose new
  candidates are reported `late` (F-037). So the releases are the one stream of `delivery`, and the
  flow of work items nests in each release: `release-flow` runs the release's tasks, then the
  release slot over that release alone, then its retrospective, which dl-026 allows. The first
  release is added by `plan-release`; each later one by `memory add` outside a step (the completed
  `plan-release` takes no more evidence), and it joins the live iteration. Several releases are
  live at once: one may be `releasing` while the next is `in-development` and its tasks flow. With
  no release open, `delivery` completes and `end-of-life` becomes current; a new release reopens
  `delivery` until `end-of-life` progresses.
- **The open release.** The flow needs a release `in-development` to carry its tasks: a project
  keeps one open, the next release, and adds it before the current one leaves `in-development`.
  A task joins `work` when its `release` names an open release and it reaches `backlog`; it leaves
  the `where` at `done`, and returns to the start when parked (`memory park`, `in-progress →
  backlog`) or rejected (`in-review → in-progress`, the fallback re-entering `build`).
- **A release after its tasks** (ruling 11). With no task carrying it, `work` completes at once and
  the release's first step is offered; a release that completes closes `work`, and its tasks still
  open are reported `late`. So the `kanban` directive adds the rule: a release moves to `releasing`
  only once its own tasks are done or moved to the next release, by rewriting their `release`
  field. A task may so span two releases: started under one, finished under the next, with nothing
  `late` (plan-056, step 2).
- **The retrospective, one per release** (ruling 12). Improving the workflow is the Guide's third
  practice at no fixed cadence; `release-flow` ends with `base`'s `retrospective`, and a project
  that wants a calendar cadence runs `base`'s `retrospective-periodic` besides (dl-029); `delivery`
  still includes `retrospective`, as the lint `life-cycle-includes` requires. `base`'s
  `retrospective` › `approve` selects any `in-discussion` decision-log tagged `retrospective`, so a
  released release's step returns to the frontier while a later release's decision-log waits, and
  one approval clears them all (bug-008, F-039; plan-056 step 2); once a file is under
  `retrospective_path`, `explore` completes for every later release.
- **Not a phase:** replenishment, the flow measures and the daily management of the board: the
  Guide prescribes no event, and they leave no artefact of their own. They are rules of the
  `kanban` directive.
- `delivery`'s name, `kind: sub` and no `element` are `software`'s contract; `release-flow` and
  `work-item` are owned by this pack only (spec-001 §7.6). Neither is named `kanban-delivery`:
  WingFoil 0.3.x refuses two workflows of one name (`E_WORKFLOW_DUPLICATE_NAME`), and WingFoil
  0.3.1's `init --template Kanban`, this repository and Benchmark each have a `custom/` workflow of
  that name (plan-056 ruling 5, bug-007). No name the pack ships equals a WingFoil built-in, a
  `custom/` file of `init --template Kanban`, or a `custom/` file of either adopter.

**Directives** (`directives/`; their ids equal no WingFoil built-in id and no `custom/` directive
`init` writes):
- `kanban`: the Guide's three practices; pull within the WIP limits, never past them; the four flow
  measures (WIP, throughput, work item age, cycle time), read from the tasks' history in Memory,
  since WingFoil computes none of them; the Service Level Expectation, `{{service_level_expectation}}`,
  and an item older than it handled first; one release kept open to carry the flow, and a release
  moved to `releasing` only once its tasks are done or moved (ruling 11); the workflow improved at
  each release's retrospective; releases decided by the Product Owner; the agent never approving;
- `definition-of-workflow`: a generic Definition of Workflow (plan-056 ruling 6): the units of value
  are tasks; the started point is `in-progress` and the finished point `done`; the states are the
  task machine's; WIP is controlled by the limits `{{wip_in_progress}}` in progress and
  `{{wip_in_review}}` in review; each state's policies (pull from the backlog only within the limit,
  a review by someone other than the author, the approver's approval, done when integrated and
  verified as the project requires); the Service Level Expectation. A project overrides it in
  `custom/` with the same id (WingFoil dl-037).

`roles.yaml` fragment: `assignments`: `product-owner: [kanban]`, `facilitator: [kanban]`,
`developer: [kanban, definition-of-workflow]`, `reviewer: [definition-of-workflow]`,
`qa: [definition-of-workflow]`. No `dna.yaml` fragment: no new role, no member.

**Roles** (plan-056 point 6; no new role, the Guide defines none): the releases are decided by
`product-owner`; `facilitator` keeps the board's policies and runs the retrospective (`base`); the
work is done by `developer`, with `architect`, `reviewer`, `qa` and `tech-lead` (`software`). The
agent works as a developer and has no approval authority (`base`).

**Parameters** (spec-001 §8; the defaults are the convention for new projects, R1):

| Name | Type | Default | Use |
|---|---|---|---|
| `wip_in_progress` | integer | `2` | `task`'s limit on `in-progress`; the directives and the AGENTS.md section |
| `wip_in_review` | integer | `1` | `task`'s limit on `in-review`; the directives and the AGENTS.md section |
| `service_level_expectation` | string | `85% of work items finish within 10 days` | the directives and the AGENTS.md section |

The limits' defaults suit one approver and a small team with an agent (ruling 10): one item in
review at a time, and one item in progress beside another waiting. The Service Level
Expectation's default is a convention, not the Guide's: each project states its own.

**AGENTS.md section** (`agents/section.md`): a level-2 section, `## Kanban`: the flow pulled within
the limits (`{{wip_in_progress}}` in progress, `{{wip_in_review}}` in review), one item's flow
through `work-item`, the Service Level Expectation, a task's `release` field, releases decided by
the Product Owner and moved to `releasing` only once their tasks are done or moved, the agent never
approving. It names `delivery`, always present since the pack requires `software`. No markers
(spec-001 §10, plan-041 ruling 10).

## Adaptations to the Kanban Guide

Listed in the README's "Sources and adaptations" (spec-002 §2):
- the approver's gates (`work-item` › `approve`, `base`'s and `software`'s gates) are not Kanban's;
  they are WingFoil's governance;
- WIP is controlled by WingFoil's `limits` on two states of `task`, counted over the whole
  repository and every branch WingFoil sees, not per column of a team's board;
- the flow runs inside releases: a work item carries the release it is delivered in, by its
  version, and two releases of one version on two release lines are not told apart; a release
  moves to `releasing` only once its tasks are done or moved to the next release (WingFoil 0.3.x,
  ruling 11);
- releases after the first are added outside a step (`memory add`), WingFoil 0.3.x taking a
  completed step's evidence once;
- the flow measures are read from Memory by hand: WingFoil computes none of them;
- the workflow is improved at `base`'s `retrospective`, one per release, whose approval is not bound
  to the release: a released release's `retrospective` › `approve` step is listed again while a
  later release's retrospective decision-log is `in-discussion`, and `pending approvals` counts that
  one decision-log once per step; one approval clears them all, and nothing is reported `late`. Once
  a file is under `retrospective_path`, `explore` completes for every later release; the
  facilitator writes each release's own file (ruling 12);
- the Guide defines no role: the pack uses `base`'s and `software`'s.

## Commitments to adopters

As `base`'s, `software`'s and `methodology/scrum`'s (plan-041, R1), binding on every version of
`methodology/kanban`: the parameters' defaults are the convention for new projects; existing
adopters set their current values and move no file; ids are immutable; Memory types, state names,
workflow names and phase names are fixed, and a version that renames or restructures any of them
ships an old → new key mapping (WingFoil dl-187) and is a major (`pack-semver`).

## Adoption

**Any project.** A software project with `base` and `software` adopts `methodology/kanban` on the
parameters' defaults, or on its own limits: it adds its first open release with `plan-release`,
then writes that release's version in the `release` field of the tasks it carries. Its existing
open tasks get a `release` (or `release: "n/a — <reason>"`) before they are next submitted or
amended. A project already over a limit moves tasks out of the state before it adopts, since
`memory submit` refuses the next move into it. A project with a delivery of its own compares its
workflows and phases with the pack's, removes the `kanban-delivery` that `init --template Kanban`
writes under `workflows/custom/` (bug-007), migrates by explicit commits the elements whose state
has another name, and records an old → new key mapping for its renamed workflows and phases. The
README gives the procedure (F6.1, spec-002 §2.3).

**This repository** (W10, its adoption plan; not this charter's). It runs Kanban by hand today, on
the WingFoil 0.2.2 pin: `kanban-delivery` (one iteration per pack task, included by `pack-cycle` ›
`author`) and `tooling-delivery` (tooling tasks, the same loop), both `custom/`, with one task in
progress and one in review per pack, checked by hand. Its step keys map as follows (old → new,
WingFoil dl-187), the exact list being its adoption plan's:

| This repository today | `methodology/kanban` |
|---|---|
| `kanban-delivery.plan`, `tooling-delivery.plan` (a task added, submitted, accepted into `backlog`) | none: a task enters `backlog` outside the flow; `work` takes it from there |
| `kanban-delivery.design`, `tooling-delivery.design` (`backlog → in-progress`) | `work-item.start` |
| `kanban-delivery.build`, `tooling-delivery.build` | `work-item.build` |
| `kanban-delivery.review`, `tooling-delivery.review` (`in-progress → in-review → approved`) | `work-item.review`, `work-item.approve` |
| `kanban-delivery.deliver`, `tooling-delivery.deliver` (merge, `approved → done`) | `work-item.done` |

Its open points, rows of `docs/owed-items.md` with trigger W10: its custom `sw-life-cycle` shares
`software`'s name; `software`'s `tech-lead` needs a holder in its DNA; its per-pack rule cannot be a
`limits` value, which counts the whole repository (a total limit, or the rule kept by hand in a
`custom/` directive over a looser limit); its packs are released per pack (`pack-release-cycle`),
not through `software`'s `release`, so how its tasks carry a `release` is the adoption's.

**Benchmark** (WingFoil Benchmark, read at `wingfoil/wingfoil-benchmark@d2975efe`; described here,
not changed by this repository). Its `custom/` `kanban-delivery` (version 6) runs each task through
`plan`, `design`, `build`, `review`, `deliver` and an optional `real-agent-check`, with an
independent read-only review recorded in the task, and allows one task in progress and one in review in the whole repository, checked by hand:
`wip_in_progress: 1` and `wip_in_review: 1` express its rule. Its tasks already carry
`release: v0.N`, and its `release` type requires a `version`: a task matches the release whose
`version` holds the same value. Its other `custom/` workflows
(`release-cycle`, `campaign-cycle`, `scenario-authoring`, its own `sw-life-cycle`) stay its own; its
adoption, if it adopts, is its own plan.

## Out of scope

- Everything of `base` and `software`; `software`'s release phases, which `kanban` only includes.
- The Kanban Method's wider practices (service-delivery roles and cadences, classes of service,
  upstream Kanban): a later minor if asked (plan-056 point 1).
- Computing the flow measures: WingFoil has no verb for it; a project reads them from Memory.
- Timeboxes, Sprints and Scrum's events: `methodology/scrum`, excluded by cardinality.
- A calendar cadence for the retrospective: `base`'s `retrospective-periodic` (dl-029).
- Directive First (dl-013, `pending`): another methodology, excluded by cardinality.

## Compatibility

- `formats`: `roles: 1`, `memory: 1`, `workflow: 1`, `directive: 1`. `requires: [base@^2,
  software@^1]`. `requires_capabilities: [workflow-engine]`, as `base`, `software` and `scrum`
  (element-bound includes, `limits`).
- The oldest release of its matrix is WingFoil 0.3.0; no workflow uses a key newer than it. The
  range is computed, never written here. The draft of plan-056 step 2 validated on 0.3.0 and 0.3.1
  with no warning.
- Install mapping and lock: the format-1 `built-in/` mapping, provisional (spec-001 O12, O13;
  plan-041 ruling 9).

## Acceptance

- spec-002's CB-1 and CB-2: the README examples are of fictional projects only (spec-002 §2.4),
  one on the parameters' defaults and one with other limits; CB-6's live part at its first tag.
- **Exit criterion** (`pack-cycle` › `author`, dl-032 E4): the compositions of task-049's four
  governed software repositories' parameter sets, with `methodology/kanban` as the methodology,
  compose and validate with no warning on every release `compat.yaml` lists as compatible;
  `check:runs` scenarios start `sw-life-cycle` with `kanban` on every selected release, as task-058
  does for `scrum`; and a run of `sw-life-cycle` through `delivery`, recorded in the `author`'s
  Execution Notes, takes two releases to `released`, one task spanning both, a limit refusing a move,
  and two retrospectives, as plan-056 step 2 did, by hand where `check:runs` cannot drive it. The
  adoption run of dl-032 E3, once per `init` template, is `first-release`'s; `author` prepares it.

## Open points

For the approver's acceptance:
1. **The Service Level Expectation's default** is a convention for new projects, not the Guide's;
   it becomes fixed with the first version (R1), as the other defaults.
2. **A limit counts the refs WingFoil sees**: a holder on a branch not fetched is not counted, and
   one on a merged branch is counted until that branch moves it out. The README states it; nothing
   in the pack can change it.
3. **Two releases of one version** on two release lines carry their tasks indistinctly (ruling 9);
   a project with parallel release lines gives its releases distinct versions, or waits for a
   `software` whose `release` template declares `id`.
4. **The retrospective per release** shares `scrum`'s open point 2 (`explore`'s weak evidence) and
   bug-008's effect; `kanban` adds nothing until `base` changes.

## Execution Notes

- 2026-10-30: written under plan-056 (step 3), from its rulings 1 … 13, step 2's run on WingFoil
  0.3.1, dl-026, dl-027 and the Kanban Guide v2025.5.
