---
id: plan-056-pack-cycle-charter-the-methodology-kanban-pack
type: plan
title: "pack-cycle charter: the methodology/kanban pack"
status: done
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
their charters `active`; `software`'s `delivery` contract as dl-026 D1 and dl-027 D1 amend it (a
methodology's `delivery` includes `release` and `retrospective` directly or through its own subs;
the phase that includes `release` iterates over `release` with `where: { status: [in-development,
releasing] }`, scope keys allowed); the lint `life-cycle-includes` checks it (task-051), as the
golden tree's `methodology/kanban` does; `check:runs` (task-053, task-058) and the
adoption run (task-060) exist.

**Inputs the new session reads first.**
- This plan; `pack-cycle.yaml` v6; dl-032 (E2, E4) and dl-033; `docs/owed-items.md` (the rows with
  trigger W10, the `pack-delivery` selection row).
- The model: `pack-methodology-scrum` (its sections, Adaptations, Adoption, Acceptance) and
  plan-047 with its Execution Notes (the engine's phase order: two repeating streams cannot both be
  phases of `delivery` in one pass; the nested shape that works; `memory add --set` fills only id
  and path tokens, F-034).
- The 0.3.x behaviour recorded since: bug-005 … bug-008 (bug-008: a retrospective per iteration
  inside a sub, option (iii) as `base` 2.0.1's README gives it), F-037, F-039 (a closed
  iteration's step deduced again), F-040, F-041.
- spec-001 §3, §6.3, §6.5, §7.5 (`limits`, `template.frontmatter.required`,
  `not_applicable_allowed`), §9, §10, §12, §18; spec-002 §2 (README, CB-1 … CB-6).
- dl-001 (axes), dl-003 (D4, D10, D11 and their notes), dl-006 (Context: "Kanban has no sprint
  end"), dl-022 S5, dl-026, dl-027, dl-017 … dl-020; the directives `pack-authoring`,
  `pack-semver`, `pack-compatibility`, `traceability`, `repository-practice`.
- The golden tree's `methodology/kanban` (`tests/fixtures/compose/tree/`), the fixture
  methodology of task-047, and this repository's own `kanban-delivery.yaml` and `dna.yaml` (WIP
  limits by hand, continuous flow); WingFoil 0.3.1's `init --template Kanban` and the `custom/`
  files it writes (bug-007).
- **The method's source:** the Kanban Guide (kanbanguides.org), its current edition read and cited
  with its date in the README, as `scrum` cites the Scrum Guide 2020.
- **How the governed repositories that run Kanban work:** this repository, and WingFoil Benchmark
  (read at a commit recorded here).

## Proposed outline (ruled by the approver before `submit`)

1. **The source is the Kanban Guide.** Its three practices (defining and visualizing the
   workflow, actively managing items in the workflow, improving the workflow), its Definition of
   Workflow (WIP control among it, and the Service Level Expectation) and its four flow measures
   (WIP, throughput, work item age, cycle time) are the pack's rules. Whether the SLE is a
   parameter or directive text is a question for steps 1 … 2. The Kanban Method's wider practices
   and service-delivery roles are out of scope, a later minor if asked.
2. **No timebox and no new Memory type.** A work item is `software`'s `task`; the board's columns
   are the task machine's states. No `sprint`-like element: Kanban has none. Any field the pack
   adds to `task` (a class of service, for example) is decided by the engine run (step 2), not
   assumed.
3. **WIP limits through `limits`** on the `task` type's working states (WingFoil enforces a limit
   at the transition, as `scrum`'s `sprint` uses it), each value a parameter. Merged limits only go
   down (spec-001 §7.5). Step 2 settles whether a substituted integer parameter is accepted there
   (unquoted, spec-001 §8.2) and over what scope a limit counts (every `task` of the repository,
   tooling tasks included); how this repository's rule (one task in progress and one in review
   per pack, today by hand) maps to it is an Adoption point. Defaults proposed after step 2.
4. **The shape of `delivery`** is settled by step 2, not here. The question: how a continuous
   stream of tasks, releases taken when the approver decides, and a retrospective with no Sprint
   end fit one pass of `sw-life-cycle`, given that WingFoil runs phases in order. The candidate,
   from plan-047's nested shape: `delivery` iterates over `release` through a sub bound to the
   release that runs its tasks (`iterate_over: task`), the release and a `retrospective` per
   release; wherever the phase that includes `release` sits, inside that sub too, it keeps
   dl-027 D1's filter, with a scope key if needed. Its open question: with no release
   `in-development`, no task can be worked (plan-047: with no Sprint open, `delivery` completes).
   Alternatives the run compares: a flow element per period, as the golden tree's
   `replenishment`; a retrospective every N releases. The engine has no time trigger: a
   retrospective on a calendar cadence is kept by hand or by `base`'s `retrospective-periodic`
   (dl-029), and `delivery` still includes `retrospective` (the lint). What 0.3.x cannot express
   goes to the approver when found (dl-019) and becomes an Adaptation in the charter.
5. **Names that collide with no adopter.** The pack's sub for one work item is not
   `kanban-delivery`: this repository and Benchmark have a custom workflow of that name, and
   WingFoil refuses two workflows of one name (`E_WORKFLOW_DUPLICATE_NAME`; bug-007's pattern, P3).
   Proposed: `work-item`, as `scrum` named `backlog-item`. Every name the pack ships is checked
   against WingFoil's built-ins, the `custom/` files `init --template Kanban` writes (bug-007) and
   both adopters' `custom/` files.
6. **Roles:** no new role (the Guide defines none); `base`'s and `software`'s roles, the agent a
   developer with no approval authority. The `approver`'s gates are an Adaptation the README
   declares.
7. **Directives:** `kanban` (the practices, WIP limits and pull, the flow measures, replenishment
   the retrospective's cadence as step 2 settles them; "replenishment" only if the Guide uses
   it) and a `definition-of-done`, generic, as
   `scrum`'s (the two packs never compose together: at most one methodology); ids checked against
   WingFoil's built-ins.
8. **Parameters:** the WIP limits; nothing else until needed.
9. **AGENTS.md section:** level 2, `## Kanban`: pull within the limits, one item's flow, releases
   when the approver decides, the agent never approving; it names `delivery`.
10. **Examples and exit criterion** (`author`'s, recorded in the charter): README examples of
    fictional projects only (spec-002 §2.4), one on the defaults and one with other limits; the
    exit criterion includes, per dl-032 E4, a run of the pack's workflows through `release` to
    `released` at least once, by hand where `check:runs` cannot drive it, and `check:runs`
    scenarios that start `sw-life-cycle` with `kanban` (as task-058 does for `scrum`); every
    composition validated with no warning on every compatible release, with the governed
    repositories' parameters (as task-049 did); CB-1, CB-2, and CB-6 at the first tag. The
    adoption run of dl-032 E3, once per `init` template, is `first-release`'s; `author` prepares
    it.
11. **Adoption:** the procedure for any project, then two known adopters: this repository (W10:
    its `kanban-delivery` and `tooling-delivery` mapped to the pack's workflows, its custom
    `sw-life-cycle` against `software`'s, its `tech-lead` holder; the rows of P3 in
    `docs/owed-items.md`), and Benchmark, described from its repository, not changed by this
    repository. The adoption itself is W10's later plan, not this charter's.
12. **Identity and compatibility:** catalog id `methodology/kanban`, `axis: methodology`, `name:
    kanban`, `pack_path: packs/methodology/kanban`, element `pack-methodology-kanban`;
    `requires: [base@^2, software@^1]`, `conflicts: []`, `delivery` in `contents`,
    `requires_capabilities: [workflow-engine]`; the v0.3 formats by kind, 0.3.0 the oldest release
    of the matrix, the range computed from `compat.yaml`, never written; the provisional format-1
    install mapping (plan-041 ruling 9).

## The approver's rulings

Given on 2026-10-30, in chat: the outline is approved with the recommendations made after the
reads below, which settle points 1, 7 and 8; every other point stands as written.

**Reads before the rulings** (part of step 1):
- The Kanban Guide's current edition is v2025.5, May 2025 (kanbanguides.org). Its Definition of
  Workflow has six elements: the units of value (work items), their started and finished points,
  the defined states between them, how WIP is controlled, the explicit policies of each state, and a
  Service Level Expectation (a time and a probability). The four flow measures are required. WIP is
  controlled in any way the team chooses. The Guide defines no role, event or timebox, does not use
  the word "replenishment" and names no Definition of Done.
- WingFoil 0.3.1's `init --template Kanban` writes `custom/sw-life-cycle.yaml`,
  `custom/bug-ingest.yaml`, `custom/decision-log-ingest.yaml`, `custom/adr-ingest.yaml` and
  `custom/kanban-delivery.yaml`, and the custom directives `determinism`, `doc-versioning`,
  `security-secrets` and `traceability`; its built-in directives are `architecture`,
  `code-quality`, `code-review`, `documentation`, `security` and `testing`. None of them, and none
  of this repository's or Benchmark's `custom/` files, is named `kanban`, `work-item` or
  `definition-of-workflow`.
- WingFoil Benchmark, read at `wingfoil/wingfoil-benchmark@d2975efe`: its `kanban-delivery` (v6)
  allows one task `in-progress` and one `in-review` in the whole repository (one approver), checked
  by hand; this repository allows one of each per pack.

**Rulings:**
1. **Point 1:** the source is the Kanban Guide v2025.5. The Service Level Expectation is a
   parameter (a string; its default is the convention for new projects, as `scrum`'s
   `sprint_length`). The four flow measures are text of the `kanban` directive: WingFoil computes
   none of them.
2. **Point 2:** as written; the Guide's started and finished points are `task`'s `in-progress` and
   `done`.
3. **Point 3:** as written; the defaults are proposed after step 2.
4. **Point 4:** as written; step 2 tries first the shape nested by release, with one release always
   `in-development` as the open container of the flow, then the alternatives.
5. **Points 5, 6, 9 … 12:** as written; the AGENTS.md section also states the Service Level
   Expectation.
6. **Point 7:** the directives are `kanban` and **`definition-of-workflow`** (the project's
   Definition of Workflow: units of value, started and finished points, states, WIP limits,
   policies, Service Level Expectation), in place of a `definition-of-done`, which the Guide does
   not name; a project overrides it in `custom/` with the same id. "Replenishment" is not used.
7. **Point 8:** the parameters are the two WIP limits and the Service Level Expectation.

Given on 2026-10-30, in chat, after step 2's run (dl-019), as recommended:

8. **Point 4, the shape:** the run's. `delivery` = `plan-release` → `releases` (`iterate_over:
   release`, `include: release-flow`); `release-flow` (`element: release`) = `work` (over the tasks
   carrying the release, `include: work-item`) → `release` (the slot, over this release) →
   `retrospective`. A release is added outside a step after the first; with no release open,
   `delivery` completes, and a new release reopens it.
9. **Point 2, the task's link to its release:** `task` gains a required `release`
   (`not_applicable_allowed`), holding the release's `version`; the scope token is
   `{release.version}`, since `software`'s `release` template declares no `id`. Two releases of one
   version on two release lines are not told apart: an adaptation the charter states.
10. **Point 3, the limits:** they count every `task` of the repository, on every branch WingFoil
    sees; the defaults are `wip_in_progress: 2` and `wip_in_review: 1`. How this repository maps its
    rule per pack is its Adoption's.
11. **Point 7, a rule of the `kanban` directive:** a release moves to `releasing` only once its own
    tasks are done or moved to the next release (as `scrum`'s ruling 16): an empty `work` lets the
    release start at once, and a release that completes closes `work`, leaving its open tasks
    `late` (F-037).
12. **The retrospective, one per release;** a calendar cadence is `retrospective-periodic`'s. The
    README states bug-008's effect and `explore`'s weak evidence in one bullet of "Sources and
    adaptations" (the text given to the approver on 2026-10-30).
13. **Tooling:** the composer's Node.js warning on an unquoted integer parameter, from a parse
    before substitution, is a row of `docs/owed-items.md`, not this plan's.

## Steps

On branch `pack/methodology-kanban-charter`; one commit per step that writes. Before every commit,
the privacy check (`repository-practice` rule 2).

1. **Read and research.** The inputs above; the Kanban Guide's current edition; Benchmark at a
   commit recorded in the notes. Findings that change a point of the outline go to the approver
   before step 2.
2. **The run on the engine (dl-032 E2).** A draft `kanban` (types tightened, `delivery` and its
   subs, directives) composed with `base` and `software` as an overlay in a directory of its own
   under `tests/fixtures/` (not the golden tree's), untracked, never committed (plan-047's
   precedent), validated with no warning on 0.3.0 and 0.3.1. Every slot is filled or has a default,
   so no fixture pack is needed. Then, in a scratch repository on 0.3.1 (the newest release
   `compat.yaml` lists, or 0.3.2 if it is listed by then), `sw-life-cycle` driven with the
   `workflow` and `memory` commands through every phase the pack adds: every loop at least once
   around, each `iterate_over` with two candidates driven to the end of its sub through every state
   they take, in their `where` and out of it, and a candidate spanning two iterations of an
   enclosing loop (a task across two releases); the `limits` refusing a transition over the limit; a
   release to `released`; two retrospectives, one per release, checked for bug-008's and F-039's
   reopening. Recorded here with commands and exit codes, with no local or scratch path. Its
   findings settle outline points 2 … 4 and 7 with the approver (dl-019). The optional `design`
   phase is not expected, unless this run finds a new mechanism.
3. **The charter.** `npm run -s wingfoil -- memory add --type pack --title Kanban --set
   axis=methodology --set name=kanban` (check the printed id: `pack-methodology-kanban`);
   `pack_path` and the other required fields filled by editing the draft (W-02). Its sections as
   `pack-methodology-scrum`'s, each holding what scrum's holds (Purpose; Ships with phases, roles,
   actions, approvals, fallbacks and `produces`; Adaptations to the Kanban Guide; Commitments to
   adopters; Adoption; Out of scope; Compatibility; Acceptance; Open points), step 2's run cited.
4. **Independent review** of the charter by a subagent (dl-017), amended while `draft`/`proposed`;
   a re-review when a fix changes a ruling. Then `memory submit` (draft → proposed).
5. **The approver's gate.** The approver accepts the charter (proposed → accepted) with
   `npm run -s wingfoil -- memory approve pack-methodology-kanban --reason "…"`, run by the
   approver, or sends it back.
6. **Branch close:** from clean clones on Node.js 22.21.0 and 22.12.0, one after the other (run in
   parallel, the `check:runs` tests see each other's scratch repositories): `npm ci`, `npm test`,
   `npm run lint`, `check:packs`, `validate`, `index -- --check`, `check:runs` and `workflow list`
   exit 0; push, the real CI conclusion recorded here; the privacy check of the branch's diff
   recorded; on the approver's OK, `--no-ff` merge into `main`, push, `main`'s CI read
   (`repository-practice` rule 3), the branch removed. Every item left owed gets its row in
   `docs/owed-items.md` with the note that leaves it (rule 4).

**Not in this plan:** the pack's tasks (`author`, the next plan), its first release, the presets
(F2.6), `governance/wingfoil-dogfood` (F4.2), this repository's adoption, pin and inbox sync;
dl-013 (`pending`, another methodology); dl-024 and dl-025 (`pending`). The W10 rows of
`docs/owed-items.md` stay open: `pack-cycle` v6 on the engine (this charter follows v6 by hand
on the 0.2.2 pin), the W-01 … W-14 recheck, the W10 row.

## Handoff

- **claude (drafting for the product-owner; facilitator):** steps 1 … 4 and 6, except the approvals
  and the merge OK. It never runs `memory approve` or `memory reject`. No pull request. Files staged
  by name; `docs/notes/` and `.idea/` stay untracked. Repository texts follow `repository-practice`.
- **Approver:** this plan's outline before `submit`; any finding of steps 1 … 2 that changes a
  point; the charter's acceptance; the merge OK.
- **Start:** a new session, asked by the approver on 2026-10-29, reads this plan and its inputs,
  asks the approver to rule the outline, and submits this plan (`draft → active`).
- Done when `pack-methodology-kanban` is `accepted` on `main`, with step 2's run recorded, its
  review applied, the branch's privacy check and the owed rows recorded, and the CI of the branch
  and of `main` read `success`. The plan then goes `active → done` (`memory submit`).

## Execution Notes

- 2026-10-29: written as asked by the approver on 2026-10-29, after plan-055's close; `workflow`
  and `phase` filled by editing the draft (W-02). Next free numbers when written: plan-057,
  task-066, dl-034, bug-009, prel-006, F-042.
- 2026-10-29: independent review: approve after amendments, two blocking findings: the release
  filter (dl-027 D1's `[in-development, releasing]`, not dl-026's) and the `memory add` command
  for a `pack-{axis}-{name}` id. Applied with them: claude's roles, the Guide's three practices and
  Definition of Workflow, the questions on `limits`, the tasks-without-a-release question and
  `replenishment` as an alternative, the recorded 0.3.x behaviour among the inputs, `init`'s
  `custom/` names, the pack's identity, the exit criterion, the overlay's place, the owed rows left
  open, the close. Not applied: a hand-written `finalize` commit; a plan closes with `memory
  submit` (`active → done`), as plan-047 and plan-055 did.
- 2026-10-30: started as asked by the approver on 2026-10-29. `main` at `b76e6d9`, its CI run
  40941233845 `success`. The reads of step 1 that the rulings needed (the Guide's edition, `init`'s
  names, Benchmark) done and recorded in "The approver's rulings"; the outline ruled by the approver
  on 2026-10-30. Submitted (`draft → active`).
- 2026-10-30, step 2 (dl-032 E2). **The draft:** `kanban` written as an overlay under
  `tests/fixtures/`, untracked, never committed: `task` tightened with a required `release`
  (`not_applicable_allowed: [release]`) and `limits: { in-progress: {{wip_in_progress}},
  in-review: {{wip_in_review}} }`; `delivery` = `plan-release` (`memory.add(type: release)`, two
  `memory.submit`, `produces` the release) → `releases` (`iterate_over: release`, `where: { status:
  [in-development, releasing, released] }`, `include: release-flow`); `release-flow`
  (`element: release`) = `work` (`iterate_over: task`, `where: { status: [backlog, in-progress,
  in-review, approved], release: "{release.version}" }`, `include: work-item`) → `release`
  (`iterate_over: release`, `where: { status: [in-development, releasing], version:
  "{release.version}" }`, `include: release`) → `retrospective`; `work-item` (`element: task`) =
  `start` (`memory.submit`) → `build` → `review` → `approve` (gate, fallback `build`) → `done`; the
  directives `kanban` and `definition-of-workflow`; parameters `wip_in_progress` 2,
  `wip_in_review` 1, `service_level_expectation`. `npm run validate -- --overlay <draft>`: 16 runs,
  0 failed, tolerance none (WingFoil 0.3.0 and 0.3.1, no diagnostic).
  - **Scope token:** a first draft with `{release.id}` failed both releases with
    `W_PHASE_TOKEN_OUT_OF_SCOPE` (`software`'s `release` template declares no `id`, and a later
    pack cannot change it); `{release.version}` passes. A task's `release` field therefore holds the
    release's version, as Benchmark and UI already write it (`release: v0.1`).
  - **The integer parameters** in `limits`, unquoted, compose to YAML integers (`in-progress: 2`,
    `in-review: 1`); the composer prints a Node.js warning ("Keys with collection values will be
    stringified") from a parse of the fragment before substitution, with no failure.
- 2026-10-30, step 2, **the run** on WingFoil 0.3.1 (`870bd440`, the matrix's install), in a
  scratch repository outside this one: `base`, `software` and the draft composed (`npm run compose`,
  `main` at `96f791b`, fictional project Plover Board, `.example` addresses), `.wingfoil/`
  committed; `workflow list` exit 0, `"diagnostics": []`. 163 commands; each exits 0 except those
  named. `workflow start sw-life-cycle` exit 0 (`sw-life-cycle-1-plan (active)`); `inception` and
  `specification` passed (a document committed, `finalize --reason` on the gates, a tech-spec
  added, submitted, approved).
  - **The first release, `work` empty.** `rel-1.0.0` added at `delivery.plan-release` (`--set
    version=1.0.0 --set release-line=v1`), two `memory submit` → `in-development`. With no task
    carrying it, `work` completed at once and `release-submit.pre-release-checks@release:rel-1.0.0`
    became the next step. Four tasks added and approved to `backlog`, three with `release:
    "1.0.0"`, one with `release: "n/a — not planned yet"`: the three joined `work`
    (`work-item.start@task:…` on the frontier), the `n/a` one stayed out, and the release step left
    the frontier until `work` completed again.
  - **The limits hold, at the verb.** `memory submit` of a third task to `in-progress` exit 1:
    `WIP limit reached for 'in-progress' on type 'task' (limit 2): held by task-001-alpha,
    task-002-beta`; of a second to `in-review` exit 1, `(limit 1)`. WingFoil counts the holders at
    HEAD and on every local and remote-tracking branch that changed them since it forked from HEAD:
    a limit counts the whole repository, every branch included.
  - **A task spanning two releases.** `task-003-gamma`, started under `1.0.0`, had its `release`
    rewritten to `1.1.0` (a commit) after `rel-1.1.0` was added outside a step and moved to
    `in-development`; `rel-1.0.0`'s `release` phase then became current, and gamma stayed on the
    frontier under `rel-1.1.0`. `rel-1.0.0` went through `release-submit` and `release-publishing`
    (records by `finalize`, the moves by the commit forms `workflow next` prints) to `released`
    while gamma was `in-progress`: two releases live in one pass, nothing `late`. Gamma was
    reviewed, rejected (`memory reject` → `in-progress`, `build` re-entered), reviewed again,
    approved and done in `rel-1.1.0`.
  - **Out of the `where` and back.** `task-005-epsilon`, added during `rel-1.1.0`'s flow, joined
    `work`; started, then `memory park` → `backlog` (the step `start` offered again), restarted and
    done.
  - **Retrospectives.** `rel-1.0.0`'s: `explore` on `docs/retrospectives/rel-1.0.0.md`,
    `additional-points` finalized, `dl-001` tagged `retrospective` added at `capture`, submitted,
    approved. `rel-1.1.0`'s `explore` completed with no new file (`base`'s known weak evidence);
    its `capture` was finalized with a record and no decision-log, a slip of the driving script,
    and its `approve`, selecting nothing, completed: so the check of bug-008 ran on a third release.
    With no release open, `delivery` completed and `end-of-life.announce` became current;
    `rel-1.2.0` and a task added outside a step reopened `delivery` (`delivery current`), and the
    pair ran to `released`. When `rel-1.2.0`'s retrospective decision-log was `in-discussion`, the
    `retrospective.approve` steps of `rel-1.0.0` and `rel-1.1.0` returned to the frontier with
    `rel-1.2.0`'s (`pending approvals: 3`, one decision-log): bug-008 and F-039, as under `scrum`;
    its one approval cleared the three, and `delivery` completed.
  - No element reported `late` in the whole run. Not exercised: a release completing while a task
    of its own is still open (on 0.3.x it closes `work` and the task is `late`, F-037; a rule of the
    `kanban` directive, as `scrum`'s ruling 16). The approver's rulings on these findings follow.
- 2026-10-30: the approver ruled 8 … 13 on step 2's findings. Ruling 13's item is a new row of
  `docs/owed-items.md` (the composer's warning on an unquoted integer parameter).
- 2026-10-30, step 3: `npm run -s wingfoil -- memory add --type pack --title Kanban --set
  axis=methodology --set name=kanban` exit 0, id `pack-methodology-kanban` (`4454438`); the body
  written from rulings 1 … 13 and step 2 (`0db80bf`).
- 2026-10-30, step 4: independent review of the charter: approve after amendments; no blocker, ten
  should-fix, six nits. Two findings were checked on the engine before amending, in the same scratch
  repository (WingFoil 0.3.1), and in a second one composed with the change:
  - **A reject past the limit:** with `wip_in_progress: 2`, two tasks `in-progress` and a third
    `in-review`, `memory reject` of the third exit 0 (`in-review → in-progress`), leaving three
    tasks `in-progress`: a reject is not checked against the limit. The `kanban` directive adds a
    rule for it (worded at the re-review, below).
  - **A release already `released`:** a release moved to `released` by four `memory submit` outside
    the flow, with `delivery`'s `where` holding `released`, started a `release-flow` at once
    (`retrospective.additional-points@release:rel-0.5.0` on the frontier). With `where: { status:
    [in-development, releasing] }`, in a second scratch repository (46 commands, each exit 0), the
    same release added before `workflow start sw-life-cycle` stayed out, and `rel-1.0.0` driven
    with one task to `released` stayed in the iteration through its retrospective (`explore` on a
    committed file, `additional-points` finalized, a decision-log captured, submitted, approved);
    then `delivery` completed and `end-of-life.announce` was current. `delivery`'s filter is
    therefore `[in-development, releasing]`, the detail of ruling 8 this changes.
  - **Names:** `release-flow` and `work-item` equal no workflow of WingFoil 0.3.1's built-in
    directory (empty) or of `init --template Kanban`, of this repository's `custom/`, or of
    Benchmark's at `d2975efe`. Found while checking: this repository's `custom/` `retrospective`,
    `decision-log-ingest`, `bug-ingest` and `adr-ingest` share `base`'s and `software`'s names, a
    row of `docs/owed-items.md` for its adoption.
  - Amended: the limits' unexercised ref counting and the reject (S3 … S5); `delivery`'s filter and
    adoption with releases already `released` (S6); "replenishment" removed (S7); the names check
    (S8); claims carried from `scrum` or F-037 marked as not exercised, the heading "0.3.1" (S9);
    the flow stopping with no open release, an adaptation (S10); "no WingFoil diagnostic" and the
    composer's warning (S2); the four Adoption rows of this repository added to `docs/owed-items.md`
    (S1, N5); nits N1, N3, N4, N6. N2 (Product Owner or approver) kept as "Product Owner", the
    `product-owner` role; the draft's `pack.yaml` description is `author`'s. A re-review follows,
    since the `delivery` filter changes ruling 8's detail.
- 2026-10-30, step 4: focused re-review: approve after amendments; no blocker, two should-fix,
  three nits. The multi-release claims rested on step 2's run with the old filter, so the second
  scratch repository went on with `[in-development, releasing]`: `rel-1.1.0` and `rel-1.2.0` added
  outside a step and moved to `in-development`; `task-003-gamma` started under `1.1.0` and its
  `release` rewritten to `1.2.0`; `rel-1.1.0` driven to `released` while gamma was `in-progress`
  under `rel-1.2.0`; `rel-1.1.0`'s retrospective decision-log `in-discussion` brought back
  `retrospective.approve@release:rel-1.0.0` (`pending approvals: 2`), and `rel-1.2.0`'s brought back
  both earlier ones (`pending approvals: 3`); each approval cleared them; `delivery` completed and
  `end-of-life.announce` was current. That repository: 115 commands, each exit 0, nothing `late`.
  Amended: the steps cited (step 4, also in three rows of `docs/owed-items.md`); the coverage of
  the narrower filter stated; the reject rule worded as what the engine does not do (a state a
  reject pushed over its limit is brought back within it before anything else moves into it);
  wrapping. The filter's change of ruling 8's detail goes to the approver with the submit.
- 2026-10-30, step 4: `memory submit pack-methodology-kanban` (`draft → proposed`, `8abdd0e`);
  branch pushed; CI run 41048572300 on `8abdd0e`, conclusion `success`.
- 2026-10-30, step 5: the approver accepted `pack-methodology-kanban` (`proposed → accepted`,
  `f3fce0d`) and, in chat, `delivery`'s filter `[in-development, releasing]`.
- 2026-10-30, step 6: clean clones of the branch at `8abdd0e`, Node.js 22.21.0 then 22.12.0, one
  after the other: `npm ci`, `npm test` (1027 tests, 1027 pass, 0 fail), `npm run lint`,
  `check:packs`, `validate`, `index -- --check`, `check:runs` and `workflow list` exit 0 on both
  (`f3fce0d` changes only the charter's `status`). Privacy check of the branch's diff against
  `main`: no local or scratch path, no private repository or project, no intermediary session.
  Owed rows added by this plan: ruling 13's and the four of the charter's Adoption (step 4). The
  untracked draft of step 2 stays out of the repository.
- 2026-10-30, step 6: branch CI run 41053863479 on `881fa60`, conclusion `success` (`validate
  (22.12.0)` and `validate (22.21.0)` both `success`). On the approver's OK, `--no-ff` merge into
  `main` (`c6ed1a0`), pushed; `main`'s CI run 41075254260 on `c6ed1a0`, conclusion `success` (both
  jobs `success`), Pages run 41075253855 `success`; the branch removed locally and remotely.
  `pack-methodology-kanban` is `accepted` on `main`. Next, outside this plan: `kanban`'s `author`
  (the next plan), then its first release; the rest of W10. This plan goes `active → done`.
