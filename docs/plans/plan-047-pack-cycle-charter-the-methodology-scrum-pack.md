---
id: plan-047-pack-cycle-charter-the-methodology-scrum-pack
type: plan
title: "pack-cycle charter: the methodology/scrum pack"
status: done
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
- dl-001 (axes), dl-003, dl-015, dl-022 S5 as `pack-foundation-software`'s Out of scope applies
  it (Kanban's or Scrum's rules and `limits` are a methodology's), dl-023, dl-017 … dl-020; the
  directives `pack-authoring`, `pack-semver`, `pack-compatibility`,
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
  template "Scrum" names Scrum among the methodologies of `dna.yaml` and writes a generic
  delivery workflow.
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
2. **The shape of `delivery`**, as amended after this plan's review (2026-10-26), and superseded
   by ruling 13 after steps 2–3 found it does not run on WingFoil 0.3.0:
   - a phase that creates a Sprint (`memory.add(type: sprint)`, with its `produces`) and one that
     creates a release and moves it to `in-development`, as the contract states;
   - a phase `sprint` (`iterate_over: sprint`, including a sub `sprint` bound to
     `element: sprint`: Sprint Planning → the Sprint Backlog's items → Sprint Review);
   - a phase `retrospective` in `delivery` itself, `iterate_over: sprint` with
     `include: retrospective`: one retrospective per Sprint. spec-001 §9 and the lint
     (`life-cycle-includes`) require `delivery` to include `retrospective` by name, so an include
     from inside the `sprint` sub would fail; the approver chose this over amending §9
     (2026-10-26). WingFoil 0.3.0 accepts it: `retrospective` binds no element;
   - a phase `release` (`iterate_over: release`, `where: { status: [in-development] }`,
     `include: release`), as the contract states.

   WingFoil 0.3.0 evaluates phases in their declared order: the first incomplete phase is current,
   and a later one waits unless it completes on its own. Steps 2 and 3 settle, before the charter
   is written: how Sprint n+1 and release n+1 come about in the single pass `sw-life-cycle` makes
   through `delivery`; when `delivery` completes; and whether `optional: true` on the iterate
   phases lets Sprints and releases advance side by side, so that an Increment can be released
   before a Sprint ends; whether Sprint n's retrospective runs before Sprint n+1 is created (if
   not, a `delivery` phase moves the Sprint to its closing state after the retrospective, or the
   charter records an adaptation); and how each phase of `retrospective` completes for a second
   Sprint (`explore`'s fixed-directory evidence, `approve`'s repository-wide selection, known
   from `base`). What 0.3.0 cannot express goes to the approver when found (dl-019), and
   the charter states it as an adaptation to the Guide.
3. **Roles:** no new role. Product Owner → `product-owner`, Scrum Master → `facilitator` (`base`),
   Developers → `developer` with `software`'s `architect`, `reviewer`, `qa` and `tech-lead`. The
   `approver`'s gates are an adaptation the README declares. The agent works as a Developer and
   holds no Scrum accountability.
4. **Events:** Sprint Planning and Sprint Review are phases of the `sprint` sub, the Retrospective
   a phase of `delivery` (ruling 2);
   the Daily Scrum is a rule of the `scrum` directive, with no phase, since it leaves no artefact;
   refinement is a rule too, not an event. The review's outcome is written in the sprint element's
   body: no new `produces`.
5. **Backlog and `task`:** the Product Backlog is the `task` elements in `backlog`; the Sprint
   Backlog is those whose `sprint` field names the Sprint. `scrum` tightens `task` with `sprint` in
   `template.frontmatter.required` and `not_applicable_allowed: [sprint]`, so an item not yet
   planned carries `n/a — <reason>`, the form WingFoil 0.3.0 accepts. The `sprint` sub iterates
   over its items with `iterate_over: task` and `where: { sprint: "{sprint.id}" }`. A task's link
   to a release stays the project's (WingFoil and UI already require `release` on `task`).
   `scrum` ships a thin sub `backlog-item` (`element: task`; `start` → `build` → `review` →
   `done`). Not `dev-loop`, as first proposed: WingFoil 0.3.0 refuses two workflows of one name
   (`E_WORKFLOW_DUPLICATE_NAME`) and lets a `custom/` file win only for directives, so a pack's
   `dev-loop` would collide with WingFoil's and UI's own; the approver chose the name (2026-10-26).
6. **`limits`:** `sprint` gets a limit of one on its active state (Sprints are sequential;
   WingFoil 0.3.0 enforces a limit at the transition); no WIP limit on `task` (Kanban's), none on
   `release`. The charter fixes the `sprint` machine (sequence and gates) this rests on.
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
    change (spec-002 §2.4). The charter puts them in `scrum`'s `author`: README examples of
    fictional projects only (spec-002 §2.4 names no real project), one on the parameters'
    defaults and one carrying values like UI's; and the exit criterion, apart from the examples
    as plan-046 keeps them apart: task-049's compositions redone with `scrum` in place of the
    fixture methodology, on WingFoil 0.3.0. `base`'s README then changes after 1.0.0, a patch
    under `pack-semver` (a README-only change); the charter records it and W9's plan rules it.
11. **Adoption:** the procedure for any project, then one known adopter, UI: one Sprint per release
    if it wishes, its own phases (`user-docs`, `e2e-smoke`) and its TDD `dev-loop` kept as its own,
    its step keys mapped old → new (WingFoil dl-187). The pack's `sprint` sub includes
    `backlog-item`, which UI cannot change, and the composed `workflows.yaml` lists only `built-in/`
    files: how UI's test-first steps live under `scrum` (a UI directive applied to `backlog-item` ›
    `build`, or a workflow UI includes by hand outside the composer's contract, as WingFoil's
    `custom/` delivery) is an Adoption open point of the charter. WingFoil keeps its `custom/`
    delivery (the methodology modelled on its loop is weighed in milestone M3, `software`'s R-11);
    Benchmark and this repository do not adopt `scrum`.
12. **Sequencer:** F4.3 (`scrum`) sits in W10; its charter now runs in W8 and its publication in
    W9. No decision-log now: W9's plan amends `07_sequencer.md`.

13. **The nested shape** (2026-10-26, after steps 2–3, dl-019; it replaces ruling 2's shape and
    rewords ruling 4): `delivery` holds a phase that adds the first Sprint and one phase
    `iterate_over: sprint` including `sprint`. The `sprint` sub, in order: `sprint-planning` →
    `plan-release` (optional) → `development` (optional, over the Sprint Backlog) → `release`
    (optional, `iterate_over: release`, `where: { status: [in-development] }`, `include: release`)
    → `sprint-review` → `retrospective`. To allow it, the approver chose option (a): `software`'s
    `delivery` contract, spec-001 §9 and the lint `life-cycle-includes` accept `release` and
    `retrospective` included by `delivery` **directly or through a sub-workflow the methodology
    ships**; `methodology/fixture` stays valid. Recorded as dl-026, under this plan; the lint
    change is a tooling task (from task-051) before `scrum`'s `author`. Rejected: (b) the contract
    as written, which on 0.3.0 gives a project one Sprint in its whole life; (c) waiting for
    WingFoil alone. A feedback note asks WingFoil anyway for an `iterate_over` phase that stays
    open to new candidates, so that Sprints and releases could later be two streams of `delivery`
    (approver, 2026-10-26).

14. **The `release` filter** (2026-10-26, after the second run, dl-019): `software`'s contract
    iterates over releases with `status: [in-development, releasing]`, scope keys allowed, in a
    decision-log of its own, dl-027, apart from dl-026; `methodology/fixture` follows it in
    task-051, coordinated with plan-046's session.
15. **A Sprint's releases** (2026-10-26): `scrum` tightens `software`'s `release` with a required
    `sprint`, and a Sprint's `release` phase adds `sprint: "{sprint.id}"` to its `where`; a release
    that spans Sprints has the field rewritten.

16. **Release after the Sprint Backlog** (2026-10-26, after the charter's review, dl-019): on
    WingFoil 0.3.0 a release completing while a Sprint's items are open closes `development` and
    leaves them `late`; the `sprint` sub runs `development` (not optional) before `plan-release`
    and `release`, which then run beside the Sprint Review. The Sprint moves with `memory.submit`,
    so the limit holds.

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
| 2 | claude | A re-read at `wingfoil/wingfoil@v0.3.0` and at UI's head, recorded in the Execution Notes: the phase order and live deduction of `iterate_over` (how Sprint n+1 and release n+1 arise in one pass through `delivery`, when `delivery` completes, `optional: true` on the iterate phases), the `sprint` machine under `limits`, `not_applicable_allowed`, UI's step keys. Already settled by this plan's review: a `custom/` workflow never replaces a pack's (ruling 5), the new directive ids equal no built-in | — |
| 3 | claude | A feasibility check outside the repository: a draft `scrum` (`sprint` type, `task` tightening, `delivery`, `sprint`, `backlog-item`) composed with `--overlay` and validated on 0.3.0, with a scripted run of two Sprints and two releases through `workflow` commands in a scratch repository; never committed; its outcome recorded here. What ruling 2 cannot do goes to the approver (dl-019), and an amendment of this active plan follows | — |
| 3a | claude, drafting for the approver | dl-026 (ruling 13): `memory add --type decision-log`; it amends `pack-foundation-software`'s `delivery` contract and spec-001 §9, and names the lint change and the feedback note; reviewed, amended while `draft`, submitted (`draft → in-discussion`). The contract's text and §9 are amended in place on this branch, each with an Execution Note citing dl-026, approved with dl-026 and by the merge OK (as plan-041 did for O15) | dl-026 |
| 3b | claude | the backlog that dl-026 implies, opened after the charter's acceptance with ids agreed with plan-046's session: a tooling task for `life-cycle-includes` (red first, dl-018) and a task for the feedback note; recorded here | — |
| 4 | claude, drafting for the product-owner | `pack-methodology-scrum`: `memory add --type pack --title Scrum --set axis=methodology --set name=scrum`, `pack_path` filled by hand; written from the rulings above, `software`'s `delivery` contract and the Scrum Guide 2020 | `docs/memory/pack/pack-methodology-scrum.md` |
| 5 | claude | an independent review of the charter (dl-017), amended while `draft`, re-reviewed when a fix changes a ruling; submitted (`draft → proposed`) | — |
| 6 | claude | push; the CI run's conclusion recorded here | — |
| 7 | approver | approves dl-026 and accepts the charter (`proposed → accepted`) from the commands claude gives | — |
| 8 | claude | on the approver's OK, coordinated with plan-046's session: `--no-ff` merge into `main`, push, `main`'s CI conclusion read, the branch removed locally and remotely; the acceptance reported to UI's session and the coordinating session | — |

What the charter must hold, besides the rulings: Purpose; Ships (the `sprint` type with its
machine, gates, `limits`, id pattern, path and required frontmatter; the `task` tightening; the
workflows with phases, roles, actions, approvals, fallbacks and `produces`; directives; roles
assignments; parameters; the AGENTS.md section); Commitments to adopters (R1's four points, as
`base`'s and `software`'s); every phase whose artefact is a file declaring it in `produces` (R4);
Adoption; Out of scope (WingFoil's release-line loop, milestone M3; Kanban's rules; estimation
techniques; a scaled framework); Compatibility (formats, `workflow-engine`, 0.3.0 the oldest
release of its matrix, no key newer than it, the WingFoil range computed and never written; the
provisional format-1 install mapping and lock, plan-041 ruling 9); Acceptance (CB-1, CB-2 with
ruling 10, CB-6 at its first tag; the exit criterion); the adaptations to the Guide the README
lists; Open points.

## Handoff

- **claude:** steps 1–6 and 8, except the approver's gates.
- **Approver:** the rulings above (given); step 7; the merge OK.
- Done when `pack-methodology-scrum` is `accepted`, on `main`, pushed. The plan then goes
  `active → done` by a hand-written `wf(plan): finalize` commit.

## Execution Notes

- 2026-10-26: written; `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-26: independent review: request changes, two blocking findings. `retrospective` included
  only from the `sprint` sub fails spec-001 §9 and the lint; nothing created the Sprints, and 0.3.0
  runs phases in order. The approver ruled the retrospective in `delivery`, one per Sprint, and the
  sub's name `backlog-item` (a pack's `dev-loop` would collide with the adopters' own). Also
  amended: `n/a — <reason>`, README examples of fictional projects only, the dl-022 S5 citation,
  the two meanings of "M3", the `init` template, the missing items of plan-041's list, steps 2
  and 3 widened. Focused re-review requested.
- 2026-10-26: focused re-review: approve after amendments, nothing blocking, no ruling changed.
  Amended: the retrospective's cadence against Sprint n+1 and its per-Sprint evidence added to
  ruling 2's questions; UI's test-first steps an Adoption open point (ruling 11); a wrap. Plan
  submitted.
- 2026-10-26, steps 2–3 (WingFoil 0.3.0, read at `v0.3.0` and run): a draft `scrum` (the `sprint`
  type, the `task` tightening, `delivery`, `sprint`, `backlog-item`, two directives) composed with
  `--overlay` and validated on 0.3.0 with no warning. `--overlay` takes only a directory under
  `tests/fixtures/`, so the draft sat there untracked, never committed, instead of outside the
  repository. Then a scratch repository ran `sw-life-cycle` through three Sprints and two releases
  with the `workflow` and `memory` commands:
  - **Ruling 2's shape fails on 0.3.0.** WingFoil evaluates phases in order, and a phase that
    completes other than vacuously closes every earlier `iterate_over` phase: its new candidates
    are reported `late` and never run. Once Sprint 1's retrospective (or a release) completed, a
    new Sprint was `late`. Two independent repeating streams, Sprints and releases, cannot both be
    phases of `delivery` in one pass, whatever `optional` says.
  - **A nested shape works:** `delivery` = `plan-sprint` (the first Sprint) and one phase
    `iterate_over: sprint` including `sprint`; the `sprint` sub (`element: sprint`) =
    `sprint-planning` → `plan-release` (optional) → `development` (optional, `iterate_over: task`,
    `where: { sprint: "{sprint.id}" }`) → `release` (optional, `iterate_over: release`, `where:
    { status: [in-development] }`, `include: release`) → `sprint-review` → `retrospective`. The
    optional phases run side by side with the review, so an Increment is released inside the
    Sprint and the review gates nothing. Sprint n+1, added by `memory add` (the completed
    `plan-sprint` step no longer takes evidence), joins the live iteration; with no Sprint open,
    `delivery` completes and `end-of-life` becomes current, and a new Sprint reopens `delivery`
    until `end-of-life` progresses. Its cost: `release` and `retrospective` are included by the
    methodology's `sprint` sub, not by `delivery` directly, against `software`'s `delivery`
    contract, spec-001 §9 and the lint `life-cycle-includes`; and the release phase passes once
    per Sprint. Taken to the approver (dl-019).
  - **For the charter:** `element.set_state` in the `sprint` sub moves the Sprint, so the release
    the sub adds moves with `memory.submit`; `memory add --set` fills only id and path tokens, so
    `goal` and a task's `sprint` are written by editing the draft; a task carrying
    `sprint: "n/a — <reason>"` passes `submit` and is left out of the iteration; a `{sprint.id}`
    token warns (`W_PHASE_TOKEN_OUT_OF_SCOPE`) unless the `sprint` template declares `id`; the
    limit of one active Sprint holds.
  - **Found in `base` 1.0.0, outside this plan** (reported to the approver, for plan-046's
    session): `workflow start` adds an instance's plan with `workflow` and `phase` empty, and
    `base`'s `plan` requires both, so the plan cannot be submitted without editing it; a `produces`
    path naming a directory counts on 0.3.0 only with a trailing `/`, so `retrospective` ›
    `explore` (`retrospective_path`, `docs/retrospectives`) is never satisfied by its default;
    and once any file is there, `explore` completes for every later Sprint.
  - Not settled by the run: a release that left `in-development` (`enter-releasing`) dropped from
    the frontier; whether that is the scratch run's driving (status commits instead of the
    `wf(release): start …` form the engine expects) or the contract's `where` is left to the
    charter's review, with `software`'s fixture as the reference.
- 2026-10-26: the approver ruled 13, option (a), with the feedback note of option (c). The two
  defects of `base` 1.0.0 and the ruling reported to plan-046's session, with a request for the
  bug and feedback-note numbers.
- 2026-10-26: dl-026 written, reviewed (approve after amendments), amended, re-reviewed (approve),
  submitted (`pending`); spec-001 §2, §9, §11, §18 and `pack-foundation-software`'s contract
  amended in place, pending its approval and the merge OK. plan-046's session opened bug-005 (the
  plan type's tokens: `workflow start` fills `workflow` and `phase` only when `plan_id` or
  `plan_path` declares them) and bug-006. `pack-methodology-scrum` added and written (step 4).
- 2026-10-26, a second run on WingFoil 0.3.0 of the charter's shape (`close` after the
  retrospective): the limit of one active Sprint holds (`submit` refused while Sprint 1 is
  `active`), and Sprint 2 starts after Sprint 1's `close`. Two findings on the release:
  - with the contract's `where: { status: [in-development] }`, a release stops after
    `enter-releasing`: in `releasing` it leaves the entry filter before any phase of `release`
    has completed (`submit` completes only at `approve-release`), so the candidate has not
    progressed and is skipped. With `[in-development, releasing]` it runs to `released`. This
    holds for any methodology, `methodology/fixture` included;
  - a released release counts as a complete candidate in every later Sprint's `release` phase,
    which then closes the Sprint's earlier optional phases (`plan-release`, `development`). A
    scope key naming the Sprint, `sprint: "{sprint.id}"`, with the release's `sprint` field,
    leaves the earlier releases out. Both go to the approver (dl-019).
- 2026-10-26: the approver ruled 14 and 15. dl-027 added (dl-024 and dl-025 stay reserved for the
  coordinating session's request) and written; `software`'s contract and spec-001 §9 amended in
  place with it; the charter follows both rulings. `main` merged into the branch after task-050
  (`17d6ac0`).
- 2026-10-26: the charter's review: request changes. A third run on WingFoil 0.3.0 (the scratch
  directory had been wiped by a session restart: a guarded script rebuilt it) reproduced the first
  blocking finding, a mid-Sprint release closing `development`, and ran the approver's ruling 16:
  Sprint 1 through its item, a release to `released`, the review, the retrospective and `close`,
  with no `late` element; `memory.submit` moved the Sprint, and `workflow start` ran with
  bug-005's workaround. Charter amended; focused re-review requested.
- 2026-10-26: the charter re-reviewed (approve after amendments: ruling 16 also a rule of the
  `scrum` directive), amended and submitted (`proposed`); dl-027 reviewed twice and submitted
  (`pending`). Step 6: branch pushed; CI run 40356879174 on `f6f2ce1`, conclusion `success`
  (`validate (22.12.0)` and `validate (22.21.0)` both `success`). Privacy: the diff names no local
  path, no private repository and no non-software project. Waiting for the approver's gates
  (step 7) and the merge OK.
- 2026-10-26, step 7: the approver approved dl-026 and dl-027 and accepted `pack-methodology-scrum`
  (`proposed → accepted`), with its open points as written; the merge OK in chat approves the
  in-place amendments of spec-001 and of `pack-foundation-software`.
- 2026-10-26, step 8: `--no-ff` merge into `main` (`49b1755`), pushed; `main`'s CI run 40360318802
  on `49b1755`, conclusion `success` (`validate (22.12.0)` and `validate (22.21.0)` both
  `success`), Pages run 40360318864 `success`; the branch removed locally and remotely. The merge
  reported to plan-046's session; the acceptance reported to UI's session and the coordinating
  session. `pack-methodology-scrum` is `accepted`, dl-026 and dl-027 `approved`. Next, outside
  this plan: task-051 (the lint `life-cycle-includes` after dl-026 D3 and dl-027 D3, and
  `methodology/fixture`'s `where`) and task-052 (F-037), then `scrum`'s `author`. This plan goes
  `active → done`.
