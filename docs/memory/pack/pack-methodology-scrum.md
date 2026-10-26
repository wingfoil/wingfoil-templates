---
id: pack-methodology-scrum
type: pack
title: "Scrum"
status: proposed
axis: "methodology"
name: "scrum"
slot: ""
pack_path: "packs/methodology/scrum"
requires: ["base@^1", "software@^1"]
conflicts: []
---

## Purpose

`methodology/scrum` is the Scrum methodology for software projects governed by WingFoil, after the
Scrum Guide, November 2020 edition (scrumguides.org). It fills the `delivery` slot of `software`'s
`sw-life-cycle` (spec-001 §3, §9) with repeated, fixed-length, sequential Sprints, each with its
Sprint Planning, Sprint Backlog, Sprint Review and Retrospective, and with releases that are
decided by the Product Owner and decoupled from the Sprint boundary, as the Guide allows. It
prescribes nothing the Guide leaves open: no user stories, story points, burn-downs or estimation
technique. Its catalog pack id is `methodology/scrum`, its directory `packs/methodology/scrum`. It
requires `base@^1` and `software@^1`, so it ships `delivery` in `contents` and carries no
conditional part (spec-001 §6.5); a composition with `software` holds exactly one methodology, so
it excludes the others by cardinality, with no `conflicts`. plan-047 holds the approver's rulings
this charter applies (1–16), and dl-026 and dl-027 the amendments of `software`'s `delivery`
contract it relies on.

## Ships

**Memory types** (`fragments/memory.yaml`; WingFoil 0.3.0's keys, spec-001 §7.5).

| Type | Machine | Gates | `waiting` | `limits` | Id pattern | Path (parameter, default) | Required frontmatter |
|---|---|---|---|---|---|---|---|
| `sprint` (defined) | `[draft, planned, active, done]` | — | — | `active: 1` | `sprint_id`, default `sprint-{n}` | `sprint_path`, `docs/memory/sprint/{id}.md` | `title`, `goal` |
| `task` (`base`'s, tightened) | unchanged | unchanged | — | — | unchanged | unchanged | adds `sprint`, with `not_applicable_allowed: [sprint]` |
| `release` (`software`'s, tightened) | unchanged | unchanged | — | — | unchanged | unchanged | adds `sprint` |

- **`sprint`** holds the Sprint's timebox and its Sprint Goal (`goal`), and its body the Sprint
  Review's outcome. `amendable: true`, so the review is recorded after the Sprint starts. Every
  edge moves with `memory.submit` (`draft → planned → active → done`): no gate and no `waiting`
  (plan-041 ruling 1). `limits: { active: 1 }`: Sprints are sequential; WingFoil 0.3.0 enforces
  the limit inside its verbs (`submit`), not on a hand-written state commit, which is why the
  workflows move the Sprint with `memory.submit` and never with `element.set_state`; so Sprint n+1
  starts only once Sprint n is `done`. Its Memory
  template (`memory-templates/sprint.md`, `format: 1`, at `memory/templates/built-in/sprint.md`)
  declares `id`, `title` and `goal`: WingFoil 0.3.0 warns on a `{sprint.id}` token unless the
  template declares `id` (plan-047 steps 2–3).
- **`task`**, `base`'s, is the Product Backlog item. The Product Backlog is the tasks in
  `backlog`; the Sprint Backlog is those whose `sprint` field names the Sprint. An item not yet in
  a Sprint carries `sprint: "n/a — <reason>"`, the form WingFoil 0.3.0 accepts at `submit`.
  `base`'s template has no `sprint` field (a later pack cannot change a template file), so the
  field is written by editing the draft; `memory add --set` fills only id and path tokens. A
  task's link to a release stays the project's (WingFoil and UI already require `release` on
  `task`). No `limits` on `task`: WIP limits are Kanban's. At `close`, an unfinished item of the
  Sprint has its `sprint` rewritten, to the next Sprint or to `n/a — <reason>` (back to the Product
  Backlog, as the Guide does), with `memory park` (`in-progress → backlog`) where it was started.
- **`release`**, `software`'s, gains a required `sprint`: the Sprint whose `release` phase carries
  it (plan-047 ruling 15). Without it, a released release is a complete candidate in every later
  Sprint's `release` phase, which then closes that Sprint's earlier phases (`development`,
  `plan-release`) on WingFoil 0.3.0. Every release belongs to a Sprint: there is no `n/a` form, so a
  hotfix is added to the current Sprint. A release still open when its Sprint closes has its
  `sprint` rewritten to the next Sprint (`amendable: true`, `software`'s), an adaptation the README
  states. `version` and `release-line` are given with `--set` (F-034), being path and id tokens;
  `sprint` is no token, so it is written by editing the draft.

**Workflows** (`workflows/`; each phase whose artefact is a file declares it in `produces`, R4;
`software`'s contract as dl-026 amends it).

| Workflow | Kind | Phases (role) |
|---|---|---|
| `delivery` | sub, no `element` | `plan-sprint` (product-owner: `memory.add(type: sprint)`, `memory.submit` `draft → planned`; produces `{ type: sprint, path: "{{sprint_path}}" }`) → `sprints` (`iterate_over: sprint`, `where: { status: [planned, active, done] }`, `include: sprint`) |
| `sprint` | sub, `element: sprint` | `sprint-planning` (product-owner: the Sprint Goal, the Sprint Backlog selected by writing `sprint` on its tasks, how the work is done; `memory.submit` `planned → active`) → `development` (`iterate_over: task`, `where: { status: [backlog, in-progress, in-review, approved], sprint: "{sprint.id}" }`, `include: backlog-item`; not optional) → `plan-release` (product-owner, `optional: true`: `memory.add(type: release)`, then `memory.submit` twice, to `planning` and `in-development`, the verbs binding to the release just added; produces `{ type: release, path: "{{release_path}}" }`) → `release` (`optional: true`, `iterate_over: release`, `where: { status: [in-development, releasing], sprint: "{sprint.id}" }`, `include: release`, dl-027) → `sprint-review` (product-owner: the Increment inspected with the stakeholders, the outcome written in the Sprint's body; `agent.execute`) → `retrospective` (`include: retrospective`, `base`'s) → `close` (facilitator: unfinished items moved, see `task`; `memory.submit` `active → done`) |
| `backlog-item` | sub, `element: task` | `start` (developer: `element.set_state(in-progress)`) → `build` (developer: `agent.execute`, to the Definition of Done) → `review` (reviewer: `memory.submit` `in-progress → in-review`) → `approve` (approver: `memory.approve` `in-review → approved`, approval by the approver, fallback `build`) → `done` (developer: `memory.submit` `approved → done`) |

- **How it runs on WingFoil 0.3.0** (plan-047 ruling 13, steps 2–3). WingFoil evaluates a
  workflow's phases in order, and a phase that completes closes every earlier live phase, whose
  new candidates are reported `late`. So the Sprints are the one stream of `delivery`, and
  everything else nests in the Sprint: `release` and `retrospective` are included by the `sprint`
  sub, which dl-026 allows. The first Sprint is added by `plan-sprint`; Sprint n+1 by `memory add`
  outside a step (the completed `plan-sprint` takes no more evidence), and it joins the live
  iteration. With no Sprint open, `delivery` completes and `end-of-life` becomes current; a new
  Sprint reopens `delivery` until `end-of-life` progresses.
- **Releases** (plan-047 ruling 16). An Increment is released inside the Sprint, once its Sprint
  Backlog is done or moved. On WingFoil 0.3.0 a release completing while items are open closes
  `development` and leaves them `late`, wherever `release` sits; so `development` is not optional
  and comes before `plan-release`, and the `scrum` directive adds the rule: no release of the Sprint
  is approved or published before its Sprint Backlog is done or moved. The rule covers what the
  order cannot: a release added outside the step, one spanning from the previous Sprint, and a
  hotfix, which first moves the Sprint's open items or waits for the next Sprint. The optional
  release phases then run side by side with the Sprint Review, which gates no release. Each Sprint's
  `release` phase is one pass over its own releases in `in-development` or `releasing` (dl-027); it
  closes once a later phase of the Sprint completes. A release still open then moves to the next
  Sprint by its `sprint` field, so a release may span Sprints; its record-based steps
  (`pre-release-checks`, `release-commit`, `staging-rehearsal`, `tag`) are recorded again under the
  new Sprint, WingFoil keying a step's record by its scope. A release may also be added outside the
  step, as a Sprint is.
- **The Retrospective concludes the Sprint.** `close` moves the Sprint to `done` after the
  `retrospective`, so the limit keeps Sprint n+1 from starting before Sprint n's Retrospective.
  `base`'s `retrospective` › `approve` selects any `in-discussion` decision-log tagged
  `retrospective`, so one from `retrospective-periodic` or a later Sprint can satisfy or hold
  Sprint n's step; the facilitator keeps one pending at a time.
- **Not a phase:** the Daily Scrum (the `scrum` directive: 15 minutes, the Developers, progress
  toward the Sprint Goal), and Product Backlog refinement (a continuous activity, in the
  directive).
- `delivery`'s name, `kind: sub` and no `element` are `software`'s contract; `sprint` and
  `backlog-item` are owned by this pack only (spec-001 §7.6). Neither is named `dev-loop`: WingFoil
  0.3.0 refuses two workflows of one name and lets a `custom/` file win only for directives, so a
  pack's `dev-loop` would collide with WingFoil's and UI's own (plan-047 ruling 5).

**Directives** (`directives/`; their ids equal no WingFoil built-in id):
- `scrum`: the empiricism and the values; the three accountabilities as the roles below; the
  events and their timeboxes, the Sprint lasting `{{sprint_length}}` and at most one month; the
  artefacts and their commitments (Product Goal, Sprint Goal, Definition of Done); the Daily Scrum;
  refinement; one Sprint at a time; releases decided by the Product Owner, never gated by the
  review, and none approved or published before the Sprint Backlog is done or moved (ruling 16);
- `definition-of-done`: a generic Definition of Done (the work meets the project's quality
  measures, is integrated, and is verified as the project requires), which a project overrides in
  `custom/` with the same id (WingFoil dl-037).

`roles.yaml` fragment: `assignments`: `product-owner: [scrum]`, `facilitator: [scrum]`,
`developer: [scrum, definition-of-done]`, `reviewer: [definition-of-done]`,
`qa: [definition-of-done]`. No `dna.yaml` fragment: no new role, no member.

**Roles** (ruling 3; no new role): Product Owner → `product-owner` (`base`); Scrum Master →
`facilitator` (`base`); Developers → `developer`, with `architect`, `reviewer`, `qa` and
`tech-lead` (`software`). The agent works as a Developer and holds no Scrum accountability, as AI
agents are treated in practice: a tool of the Developers, never a fourth accountability; it has no
approval authority (`base`).

**Parameters** (spec-001 §8; the defaults are the convention for new projects, R1):

| Name | Type | Default | Use |
|---|---|---|---|
| `sprint_length` | string | `2 weeks` | the `scrum` directive and the AGENTS.md section; at most one month |
| `sprint_path` | path | `docs/memory/sprint/{id}.md` | `sprint` `path`, `plan-sprint`'s `produces` |
| `sprint_id` | pattern | `sprint-{n}` | `sprint` `id_pattern` |

**AGENTS.md section** (`agents/section.md`): a level-2 section, `## Scrum`: Sprints of
`{{sprint_length}}`, one at a time; the role mapping; the Sprint Backlog as tasks whose `sprint`
names the Sprint; the Definition of Done; releases decoupled from Sprints; the agent never
approving and never holding a Scrum accountability. It names `delivery`, always present since the
pack requires `software`. No markers (spec-001 §10, plan-041 ruling 10).

## Adaptations to the Scrum Guide

Listed in the README's "Sources and adaptations" (spec-002 §2):
- the approver's gates (`backlog-item` › `approve`, `base`'s and `software`'s gates) are not
  Scrum's; they are WingFoil's governance;
- the Daily Scrum and refinement have no phase: they leave no artefact;
- an Increment is released only once the Sprint Backlog is done or moved, not at any moment of the
  Sprint (WingFoil 0.3.0, ruling 16); a release passes through one Sprint's `release` phase at a
  time, and one that spans Sprints has its `sprint` field rewritten by hand and its record-based
  steps recorded again;
- Sprint n+1 and further releases are added outside a step (`memory add`), WingFoil 0.3.0 taking a
  completed step's evidence once;
- the Scrum Master is `base`'s facilitator, and Developers are `software`'s roles.

## Commitments to adopters

As `base`'s and `software`'s (plan-041, R1), binding on every version of `methodology/scrum`: the
parameters' defaults are the convention for new projects; existing adopters set their current
values and move no file; ids are immutable, a new id pattern applying to new elements only; Memory
types, state names, workflow names and phase names are fixed, and a version that renames or
restructures any of them ships an old → new key mapping (WingFoil dl-187) and is a major
(`pack-semver`).

## Adoption

**Any project.** A software project with `base` and `software` adopts `methodology/scrum` on the
parameters' defaults: it adds its first Sprint with `plan-sprint`, then writes `sprint` on the
tasks it selects. Its existing open tasks get `sprint: "n/a — <reason>"`, and its existing
releases a `sprint` (or the project's own `exempt`), before they are next submitted or amended. A
project with a delivery of its own compares its workflows and phases with the
pack's, migrates by explicit commits the elements whose state has another name, and records an old
→ new key mapping for its renamed workflows and phases. The README gives the procedure (F6.1,
spec-002 §2.3).

**The known adopter: WingFoil UI** (it adopts `base`, `software` and `methodology/scrum`
together). UI's delivery today is WingFoil's release-line loop, with no timebox and a
retrospective per release. Under `scrum` it may run one Sprint per release, which the Guide
allows. Its step keys map as follows (old → new, WingFoil dl-187), the exact list being its
adoption plan's:

| UI today | `methodology/scrum` |
|---|---|
| `sw-life-cycle.init` (`wingfoil-init`) | none: UI's own, outside `sw-life-cycle` (as `software`'s table leaves WingFoil's) |
| `sw-life-cycle.{seed-first-release-line, release-line-cycle}` | `sw-life-cycle.delivery` (`delivery.plan-sprint`, `delivery.sprints`) |
| `release-line-cycle.{approve, initial-design, delivery, plan-next-release-line}` | none: the release line is managed outside `delivery` (`initial-design` and line planning stay UI's) |
| `release-cycle.planning` | `sprint.sprint-planning` and `sprint.plan-release` |
| `release-cycle.implementation` (over `dev-loop`) | `sprint.development` (over `backlog-item`) |
| `release-cycle.{user-docs, e2e-smoke}` | none: UI's own gates (open point 1) |
| `release-cycle.{submit, publishing}` | `sprint.release` (`release.submit`, `release.publishing`) |
| `release-cycle.retrospective` | `sprint.retrospective` |
| `dev-loop.{start, design, red, green, refactor, review, done}` | `backlog-item.{start, build, review, approve, done}` |

UI's `user-docs` and `e2e-smoke` gates and its test-first steps stay its own: the pack's `sprint`
includes `backlog-item`, which UI cannot change, and the composed `workflows.yaml` lists only
`built-in/` files (open point 1). WingFoil keeps its `custom/` delivery (a methodology modelled on
its loop is weighed in milestone M3, `software`'s R-11); Benchmark (Kanban) and this repository do
not adopt `scrum`.

## Out of scope

- Everything of `base` and `software`; `software`'s release phases, which `scrum` only includes.
- WingFoil's release-line loop (milestone M3).
- Kanban's rules, WIP limits on `task`.
- Estimation techniques, user stories, story points, burn-downs: the Guide prescribes none.
- A scaled framework (several teams on one product, a release train).
- Directive First (dl-013, `pending`): another methodology, excluded by cardinality.

## Compatibility

- `formats`: `roles: 1`, `memory: 1`, `workflow: 1`, `directive: 1`, `memory-template: 1`.
  `requires: [base@^1, software@^1]`. `requires_capabilities: [workflow-engine]`, as `base` and
  `software` (element-bound includes, `element.set_state`, `limits`).
- The oldest release of its matrix is WingFoil 0.3.0; no workflow uses a key newer than it. The
  range is computed, never written here. A `path` parameter used in a `produces` takes only
  `[A-Za-z0-9._/{}-]`.
- Install mapping and lock: the format-1 `built-in/` mapping, provisional (spec-001 O12, O13;
  plan-041 ruling 9).
- It relies on dl-026 and dl-027: until the lint `life-cycle-includes` follows them (task-051),
  `packs/` cannot hold the pack; its `author` starts after task-051.

## Acceptance

- spec-002's CB-1 and CB-2; CB-6's live part at its first tag. When `packs/methodology/scrum`
  enters the tree, CB-2's exemption line falls for `base` and `software` too (spec-002 §2.4): the
  `author` of `scrum` brings the README examples of all three, fictional projects only (spec-002
  §2.4 names no real project), one on the parameters' defaults and one carrying values like UI's.
  `base`'s README then changes after 1.0.0, a patch under `pack-semver`, which W9's plan rules.
- **Exit criterion:** task-049's compositions of the four governed software repositories'
  parameters, redone with `methodology/scrum` in place of `methodology/fixture`, compose and
  validate on WingFoil 0.3.0 with no warning; and a by-hand run, recorded in the `author`'s
  Execution Notes, takes `sw-life-cycle` through two Sprints and two releases on 0.3.0, one of them
  spanning both Sprints, as plan-047 steps 2–3 did; the spanning release completes in Sprint 2 only
  after its Sprint Backlog is done or moved, with no `late` element. Until `base`'s patch for
  bug-005 and bug-006, the run uses their workarounds (`plan_id` carrying `{workflow}` and
  `{phase}`, `retrospective_path: docs/retrospectives/`), recorded in those notes.

## Open points

For the approver's acceptance:
1. **UI's test-first steps** under `scrum`: a UI directive applied to `backlog-item` › `build`, or
   a workflow UI includes by hand outside the composer's contract; UI's adoption plan decides.
2. **The retrospective per Sprint** depends on bug-006 of `base` 1.0.0: `retrospective` ›
   `explore`'s directory evidence needs a trailing `/`; and, `base`'s known weak evidence, once a
   file is there `explore` completes for every later Sprint. `scrum` adds nothing until `base`'s
   patch.
3. **The Sprint machine's names** (`planned`, `active`, `done`) become fixed with the first
   version (R1).

## Execution Notes

- 2026-10-26: written under plan-047 (step 4), from its rulings 1–13, dl-026 and the Scrum Guide
  2020.
- 2026-10-26: a second run on WingFoil 0.3.0 (plan-047): the limit of one active Sprint holds, and
  `close` after the retrospective keeps Sprint n+1 waiting. `release` gains `sprint` and the
  `release` phase its scope key (ruling 15); the `where` follows dl-027 (ruling 14), which resolves
  the point on a release leaving `in-development`.
- 2026-10-26: independent review: request changes, two blocking findings: a release completing
  mid-Sprint closes `development` on WingFoil 0.3.0 (reproduced; the approver ruled 16: the release
  phases after a non-optional `development`, run and passing), and the limit holds only through
  `memory.submit` (the Sprint now moves with it). Also amended: unfinished items at `close`, every
  release in a Sprint, a spanning release's records, Adoption of existing tasks and releases, UI's
  table, the retrospective's selection, open point 2's bug, the exit run's workarounds.
- 2026-10-26: focused re-review: approve after amendments, nothing blocking. Ruling 16 stated as a
  rule of the `scrum` directive too, since the order alone does not stop a release added outside
  the step, a spanning one or a hotfix from closing `development`; ruling 15's wording; the exit
  run covers the spanning release. Submitted.
