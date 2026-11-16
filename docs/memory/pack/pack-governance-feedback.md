---
id: pack-governance-feedback
type: pack
title: "Feedback"
status: accepted
axis: "governance"
name: "feedback"
slot: ""
pack_path: "packs/governance/feedback"
requires: ["base@^2"]
conflicts: []
---

## Purpose

`governance/feedback` gives any project governed by WingFoil, software or not, an installable and
configurable way to collect feedback, structure and classify it, link it to the context that
produced it, have the approver triage it, and route it into the governance the project already has,
so that feedback becomes input for the evolution of the project and of its governance (dl-012). It
assumes no methodology, no upstream and no particular artefact; it adds no methodology of its own
and reuses `base`'s workflows, and `software`'s only in a composition with `software`. Its catalog
pack id is `governance/feedback`, its directory `packs/governance/feedback`. It requires `base@^2`
alone; what uses `software` is in one conditional entry, `with: software@^1` (spec-001 §6.5), so the
pack composes with or without `software`. The `governance` axis has cardinality "many": it composes
beside any other governance pack, with no `conflicts`. Upstreams (WingFoil, a library, a vendor, a
client) are added by their own governance packs, which require this one (dl-012 D3);
`governance/wingfoil-dogfood` is the first. plan-073 holds the approver's rulings this charter
applies and the run on WingFoil 0.3.2 they rest on (dl-032 E2).

## Ships

**Memory type** (`fragments/memory.yaml`; WingFoil 0.3.0's keys, spec-001 §7.5) and its template
(`memory-templates/feedback.md`):

| Type | Path, id | Machine | Gates | Required frontmatter |
|---|---|---|---|---|
| `feedback` (new) | `{{feedback_path}}`, `{{feedback_id}}` | `draft → pending → triaged → closed` | `pending: { reject: draft }` | `title`, `kind`, `target`, `source`, `context` |

- **The states** (dl-012 D1; `base`'s names where they exist, no `waiting` state, dl-003 D3):
  `draft → pending` by `memory submit` (facilitator), once source and context are recorded and the
  outcome proposed; `pending → triaged` by `memory approve` (approver): the **triage**, the
  classification confirmed and the outcome decided; a `memory reject` sends the item back to
  `draft`; `triaged → closed` by `memory submit` (facilitator), once `resulting` names the routed
  element, or the outcome is `declined` or `duplicate` with its reason. `memory deprecate`
  withdraws an item captured by mistake (a `draft` item's capture run is then abandoned, plan-073
  step 2).
- **The fields** (dl-012 D2): `kind` (default `defect | gap | request | observation`), `target`
  (default `product | governance | upstream:<name>`), `source` (who or what produced it: a person,
  a role, an agent, a check, a channel) and `context` (at least one reference to what produced it:
  a Memory element id, a workflow and phase, a commit or a version) are required, so WingFoil
  refuses a `submit` without them (FA-3). `outcome` (default `bug | decision-log | task |
  upstream-note | declined | duplicate`; `bug` only with `software`) and `resulting` (the id or
  path of the routed element) are optional, written by the facilitator: the outcome proposed before
  the triage, `resulting` before the close (plan-073 ruling 2). WingFoil 0.3.2 checks required
  fields at `submit` only, not at `approve`, and closes an item whose `resulting` is empty
  (plan-073 step 2): the fixture-element checks (FA-6 [E], and a check of `outcome` on a `closed`
  item) catch what the engine does not.
- **The value lists** are text of the `feedback` directive and of the README; how a pack declares
  a configurable list of allowed values, who checks a value, and how the `outcome` default drops
  `bug` without `software` (fragments are never conditional, §6.5; a parameter has one default,
  §8.1) are the `design` phase's (dl-012 D8; Open points 1). Until then the unconditional
  `feedback` directive lists `outcome` without `bug`, and the entry's directive adds `bug` to it
  (isolation, §6.5: `software`'s type is named only in the entry's files).

**Workflows** (`workflows/`; each phase whose artefact is a file declares it in `produces`):

| Workflow | Kind | Phases (role) |
|---|---|---|
| `feedback-ingest` | main | `capture` (facilitator: `memory.add(type: feedback)`, `memory.submit`; produces `{ type: feedback, path: "{{feedback_path}}" }`) → `triage` (approver: `memory.approve`, approval by the approver, fallback `capture`) |
| `feedback-review` | main | `review` (`iterate_over: feedback`, `where: { status: [triaged], outcome: [decision-log, task, upstream-note, declined, duplicate] }`, `include: feedback-item`) |
| `feedback-item` | sub, `element: feedback` | `route` (facilitator: `agent.execute`, recorded with `workflow finalize`) → `close` (facilitator: `memory.submit`, `triaged → closed`) |
| `feedback-bug-route` (only with `software`) | main | `route-bugs` (`iterate_over: feedback`, `where: { status: [triaged], outcome: bug }`, `include: feedback-bug-item`) |
| `feedback-bug-item` (only with `software`) | sub, `element: feedback` | `bug` (facilitator: `agent.execute`, recorded with `workflow finalize` once `software`'s `bug-ingest` has captured the bug citing the item) → `close` (facilitator: `memory.submit`) |

- **How it runs on WingFoil 0.3.2** (plan-073 step 2; validated on 0.3.0 and 0.3.2). One
  `feedback-ingest` run captures one item: a second `memory add` at the same run's `capture` is
  refused, and each run adds a plan element (`base`'s `plan_id`). `feedback-review` is started at
  the cadence the project chooses; its `review` takes every `triaged` item whose outcome it routes,
  an item joining or leaving as its status or outcome changes while the review runs. A completed
  run takes a newly triaged item at once (a live query, observed on `feedback-bug-route`; F-039
  applies to both), so a project ends the run (`workflow end`) when it has reviewed.
- **The routes** (dl-012 D3; plan-073 ruling 3). The targets are `kind: main` workflows, which no
  step includes: the target is captured, citing the item, by the role its own workflow binds (as
  variant (a') below), or added outside a step for a type with no workflow of its own; then the
  facilitator writes `resulting` and records `route` with `workflow finalize`:
  - `decision-log` → a decision-log through `base`'s `decision-log-ingest` (`capture`,
    product-owner), for a decision that changes no governance; a change of the governance →
    `base`'s `governance-evolution` (`propose`), whose decision-log the configuration change cites
    (dl-022 S4). Step 2 added the decision-log outside a step and recorded the route; neither
    workflow was driven (not exercised);
  - `task` → a `task` (`base`'s type) in `draft`, citing the item (exercised, outside a step);
  - `upstream-note` → the channel an upstream pack declares (below; not exercised);
  - `declined`, `duplicate` → closed with the reason in `resulting` (`n/a — <reason>`) and in the
    body (exercised);
  - an outcome a project adds that has no route of its own → a decision-log naming the outcome:
    the rule of dl-012 D3, which `feedback-review`'s literal `where` does not yet carry (below).
- **Items no review selects** on 0.3.2: a triaged item whose `outcome` is empty (the field is
  optional, and `approve` checks nothing, step 2), is one a project added, or is `bug` without
  `software`, matches neither `where`. Until the `design` phase settles it (Open points 1), the
  `feedback` directive, bound to the facilitator, has the facilitator propose only a listed
  outcome that the composition routes: an outcome with no route in the composition (one a project
  added, a would-be `bug` without `software`, `upstream-note` with no upstream pack composed) is
  proposed as `decision-log`, naming what it would have been in the item's body and in the routed
  decision-log (dl-012 D3; an absent upstream by extension). The approver confirms the proposal,
  or rejects the item to `draft` when its `outcome` is empty, unlisted, or not one the composition
  routes; the hand-off to the approver says so.
- **The `bug` route, only with `software`** (variant (a'), plan-073 ruling 3): `software`'s
  `bug-ingest` captures and triages the bug, citing the item; `feedback-bug-item`'s `bug` step adds
  no bug and records the route. A bug added inside the pack's own step would be owned by its run,
  and `bug-ingest` could not adopt it on 0.3.2 (plan-073 step 2). No unconditional file names
  `bug-ingest` or the `bug` type (isolation, §6.5): `feedback-review`'s `where` leaves the `bug`
  items to `feedback-bug-route` by listing the other outcomes. Without `software` the default
  `outcome` list has no `bug`, and an item that would be a bug routes to a decision-log naming it.
- **Upstreams** (dl-012 D3). An upstream is added by its own governance pack that `requires`
  `governance/feedback` and ships its channel: the workflow or directive that turns a routed item
  into a note in the upstream's format, and the note's location. A routed item is mapped onto the
  upstream's kinds (for WingFoil, `observation` is not a dl-163 kind: such an item becomes
  `request`, or is not routed upstream). How the channel is declared to this pack is the `design`
  phase's (Open points 2).
- **The trace both ways** (FA-6): every `closed` item names its routed element in `resulting`, and
  that element cites the item back: in the body for an upstream note (dl-163 allows no extra
  frontmatter field); in frontmatter for `base`'s and `software`'s types, by a field the `design`
  phase settles, WingFoil 0.3.2's optional `reported_by` the candidate (plan-073 ruling 4).
- `base`'s `retrospective` is not changed: its exploration reads open feedback through the
  `feedback` directive, bound to `facilitator`; `governance-evolution`'s `assess` already takes
  feedback among its inputs (dl-022 S4).
- No workflow or directive name the pack ships equals a WingFoil 0.3.2 built-in, a `custom/` file
  of `init --template Scrum` or `--template Kanban`, or a `custom/` file of this repository or of
  Benchmark at `7d95901a` (plan-073 step 1).

**Directives** (`directives/`):
- `feedback` (unconditional): what counts as feedback; the required fields and the value lists
  (`outcome` without `bug`); the classification rules; the outcome proposed before the triage and
  confirmed by the approver or rejected to `draft`, the facilitator proposing only an outcome the
  composition routes
  (the rule above);
  the routing table above, without the `bug` route; the trace both ways; who may close an item
  (the facilitator, once `resulting` is written); how `feedback-review` is started and ended;
- `feedback-bug-route` (in the entry with `software`): `bug` added to the `outcome` list; an item
  whose outcome is `bug` goes through `bug-ingest`, the bug citing the item, and
  `feedback-bug-route` records it.

`roles.yaml` fragment: `assignments`: `facilitator: [feedback]`, the unconditional directive only
(spec-001 §7.4, §6.5). No `dna.yaml` fragment.

**Roles** (no new role; dl-012 D1): `facilitator` captures, routes and closes; `approver` triages
(`base`'s). The agent captures and routes as the facilitator and never approves: it hands the
approver the exact command.

**Parameters** (spec-001 §8; the defaults are the convention for new projects, R1):

| Name | Type | Default | Use |
|---|---|---|---|
| `feedback_path` | path | `docs/memory/feedback/{id}.md` | the `feedback` type's path; `produces` |
| `feedback_id` | pattern | `feedback-{n}-{slug}` | the `feedback` type's id pattern |

The value lists' parameters, if any, are the `design` phase's (Open points 1).

**AGENTS.md section** (`agents/section.md`): a level-2 section, `## Feedback`: capture with
source and context through `feedback-ingest`, one item per run; only the approver triages;
`feedback-review` routes and closes each item, the facilitator writing `resulting`; the agent
never approving. Being composed whether or not the entry is, it may name the entry's directive as
present only with `software` (spec-001 §10); whether that is how the directive reaches an agent is
the `design` phase's (Open points 4). No markers.

**`README.md` and `CHANGELOG.md`** (dl-012 D1): the README after spec-002 §2, its examples as
fixtures (§2.4); the CHANGELOG's first line the tag annotation.

## Adaptations

Listed in the README's "Sources and adaptations" (spec-002 §2):
- a capture run holds one item and adds a plan element (a project capturing often may add items
  outside a run, `memory add` then `submit`, the triage gate unchanged: not exercised);
- WingFoil checks required fields at `submit` only and evaluates no workflow `checks` string
  (plan-073 step 2), so `outcome`, `resulting` and the allowed values are checked by the directive's
  rules and the fixture-element checks, not by the engine;
- the routes add their targets outside the step and record it with `workflow finalize`, since a
  step cannot include a `main` workflow and a target added inside the pack's step would be owned by
  its run;
- a completed `feedback-review` takes a newly triaged item until the run is ended (F-039).

## Commitments to adopters

As `base`'s and the published packs' (plan-041, R1), binding on every version of
`governance/feedback`: the parameters' defaults are the convention for new projects; existing
adopters set their current values and move no file; ids are immutable; the Memory type, its state
names, workflow names and phase names are fixed, and a version that renames or restructures any of
them ships an old → new key mapping (WingFoil dl-187) and is a major (`pack-semver`). The pack
enters the official catalog with a maintained line (dl-001 D7, dl-012 D6), confirmed by the
approver at plan-073's outline (ruling of 2026-11-14).

## Adoption

**Any project.** A project with `base`, with or without `software` and with any methodology, adds
the pack on its defaults or on its own path and id pattern. Feedback it already keeps elsewhere (an
issue tracker, notes, a channel) stays where it is; an item is captured as a `feedback` element
when it is to be triaged, with `source` naming where it came from. A project that keeps a
`feedback` type, or a workflow or directive of one of the pack's names, of its own renames it or
maps it before it adopts (WingFoil refuses two workflows of one name, bug-007's pattern). The
README gives the procedure (F6.1, spec-002 §2.3).

**This repository** (W10, its adoption plan; not this charter's): it adopts the pack with `base`,
`software`, `methodology/kanban` and `governance/wingfoil-dogfood`, with dl-012 D6's knock-ons
(`wingfoil-cli` moving to the dogfood pack, `tests/wingfoil-feedback.test.ts`'s directive path, its
custom `retrospective` and `bug-ingest` giving way to `base`'s and `software`'s,
`docs/wingfoil-feedback/README.md`).

**guided-init** (dl-011 D4, W16): its Reconfigure WingFoil phase proposes the pack from the areas
users, policies, team and roles (who triages), QA, success criteria and dependencies (upstreams);
the commitment is recorded here, the work is W16's.

## Out of scope

- Everything of `base` and `software`; `software`'s `bug-ingest`, which the `bug` route uses.
- Any upstream's channel and format: each upstream's own pack; WingFoil's is
  `governance/wingfoil-dogfood` (W10's next plan).
- Executable logic: the pack ships no script; counting or reporting feedback is read from Memory.
- A methodology's own feedback events (a Sprint review, a replenishment): the methodology's.
- `base`'s `retrospective`, which no other pack may change (spec-001 §9, O6).

## Compatibility

- `pack.yaml` format 1: one conditional entry `with: software@^1`, which format 1 allows a pack
  that does not require `software` (spec-001 §6.5); format 2 only if the `design` phase needs a
  second entry.
- `formats`: `roles: 1`, `memory: 1`, `workflow: 1`, `directive: 1`, `memory-template: 1`.
  `requires: [base@^2]`, `conflicts: []`, `requires_capabilities: [workflow-engine]`
  (element-bound includes).
- The oldest release of its matrix is WingFoil 0.3.0; no workflow uses a key newer than it. The
  range is computed, never written here. plan-073's draft validated on 0.3.0 and 0.3.2 with no
  WingFoil diagnostic, with `base` alone, with `software` and `methodology/kanban`, and with
  `software` and `methodology/scrum` (28 runs, tolerance none). That draft's `feedback-bug-item` ›
  `bug` step still declared `memory.add(type: bug)` and `memory.submit`; ruling 3's
  `agent.execute` is validated again by `author`'s compositions.
- Install mapping and lock: the format-1 `built-in/` mapping, provisional (spec-001 O12, O13;
  plan-041 ruling 9).
- No feedback note to WingFoil for the pack's publication (dl-021 R1); a schema change the `design`
  phase makes still produces one (`wingfoil-cli` rule 8).

## Acceptance

dl-012 D5's criteria, each with its checker: **[V]** the validation command or a test under
`tests/`; **[E]** the fixture-element checks (a tooling task, below); **[A]** the approver.
Fixtures under `tests/fixtures/examples/feedback/<example>/` (spec-002 §2.4), README examples of
fictional projects only, run in the compatibility matrix on the releases `compat.yaml` lists.
- **FA-1 Installable [V]:** composes with `software` and each published methodology (the `bug`
  route present) and without `software` (`base` and the pack alone), with fixture packs for
  `team-mode/agent-first` and a blueprint until W11 and W12 publish them; each composition
  validates (F3.3) and composes deterministically (F3.4); `requires` names only `base@^2`,
  `conflicts` is empty.
- **FA-2 Reusable [V]:** no default, parameter value or rule assumes a specific upstream,
  methodology, project or person; every path, id pattern and value list is a parameter with a
  default; two fixtures with different parameter sets compose and validate; the F3.5 lint passes.
- **FA-3 Collect [V][E]:** `kind`, `target`, `source` and `context` in the type's
  `template.frontmatter.required` [V]; a fixture element missing one fails [E].
- **FA-4 Classify [V][E]:** the triage edge is the approver's gate [V]; a fixture element with a
  value outside the configured lists fails [E].
- **FA-5 Context [E]:** every fixture feedback element cites at least one context reference that
  resolves (an existing element id, a declared workflow and phase, or a version).
- **FA-6 Available to the governance [V][E]:** the review workflows route only into workflows the
  composition declares [V]: since every route is a recorded `agent.execute` step, [V] checks that
  the `feedback` directive's routing table names only `base`'s workflows, that `bug-ingest` is
  named only in the entry's files (the isolation lint and the review), and that `check:runs`
  drives each route; every `closed` item names its `resulting` element, and that element cites the
  item back [E].
- **FA-7 Evolution [E][A]:** a fixture shows both paths: feedback → `governance-evolution`'s
  decision-log citing it → a `custom/` change whose commit or element cites the decision-log
  (governance evolution); with `software`, feedback → bug citing it (product evolution); without
  it, feedback → a decision-log naming the would-be bug.
- **FA-8 Upstream [V][E]:** a fixture upstream pack requiring `governance/feedback` turns a routed
  item into a note with the dl-163 subset (six frontmatter fields with allowed values, `##
  Observed` and `## Expected`, no Replies section), checked by the checks of
  `tests/wingfoil-feedback.test.ts` that belong to dl-163, factored out so they run on the
  fixture (`tests/feedback-note.test.ts` and its support already factor part of them).
- **Exit criterion** (`pack-cycle` › `author`, dl-032 E4): a run of the pack's workflows through
  every route at least once, with and without `software`, as plan-073 step 2 did; `check:runs`
  scenarios starting every main the pack ships (`feedback-ingest`, `feedback-review`,
  `feedback-bug-route`) on the oldest and the newest release (dl-032 E3); every composition
  validated with no warning on every compatible release; CB-1, CB-2, and CB-6 at the first tag (CB-3
  … CB-5 are the catalog index's, as for `kanban`). The adoption run of dl-032 E3, once per `init`
  template, is `first-release`'s; `author` prepares it.
- **Proposed tasks** (`author`, `pack: pack-governance-feedback`; dl-012 D7): the type, its states
  and template (FA-3, FA-4); the capture workflow with the triage gate (FA-3 … FA-5); the review
  workflows and the routing table, the `bug` route in the entry (FA-6, FA-7); the directives,
  parameters and roles (FA-2); the upstream mechanism and the fixture upstream pack (FA-8); the
  composition and evolution fixtures (FA-1, FA-2, FA-7); the README with its examples as fixtures.
  Before them, the `design` phase and the fixture-element tooling task (`pack: ""`,
  `tooling-change`), shared with dl-011 and dl-013.

## Open points

For the `design` phase (required, dl-012 D8: one tech-spec, or an amendment of spec-001 through
one, answering them for dl-012 and dl-013):
1. **Configurable value lists:** a list type or a convention over `string`; how a preset sets it;
   who checks a value; how `outcome`'s default drops `bug` without `software`; how
   `feedback-review`'s `where` follows a project's added outcomes (today a literal list, which a
   scalar parameter cannot hold, §8.1); a triaged item with an empty, unlisted or unrouted
   `outcome`, which no review selects (the interim triage rule above); `bug` in the unconditional
   directive's text, today left to the entry's directive.
2. **An upstream's channel:** how an upstream pack declares it to this pack.
3. **The entry's shape:** settled by plan-073 ruling 3 for 0.3.2 (a main and its sub, recorded
   routes); WingFoil 0.3.2 evaluates no `checks` string, so no rule rests on one.
4. **How the entry's directive reaches an agent:** not through `roles.yaml` (isolation); the
   AGENTS.md section may name it as present only with `software` (§10); shared with dl-011's
   `guided-init-software`.
5. **The back-reference field** in `base`'s and `software`'s types (`reported_by`, plan-073 ruling
   4), with the pack release round's Memory template fields.

For WingFoil (plan-073 ruling 5, a task of its own): a later capture run's plan is named after the
previous item, its `element` field wrong; the refusal to adopt an element another run owns names
`workflow transfer`, which 0.3.2 does not have.

## Execution Notes

- 2026-11-16: written under plan-073 step 3 from its outline, its rulings and its step 2 run;
  `pack_path`, `requires` and `conflicts` filled by editing the draft (W-02).
- 2026-11-16: independent review (dl-017): approve after amendments; no blocker, six should-fix,
  four nits, all applied: the role that captures each target (its own workflow's), the routes not
  exercised by step 2 marked, the bug step's validation owed to `author`, the items no review
  selects with an interim triage rule, `bug` left out of the unconditional directive's `outcome`
  list and added by the entry's, FA-6 [V] made concrete; FA-5 and FA-7 as dl-012 writes them, the
  live query observed on `feedback-bug-route`, the untested adaptation marked, a `draft` item's
  deprecation, the pack's workflows, the README and CHANGELOG, CB-3 … CB-5. The triage rule and
  the directive's `outcome` list are new rules: re-review.
- 2026-11-16: re-review: approve after amendments; no blocker, three should-fix, two nits, all
  wording, applied: the interim rule addressed to the facilitator, whom the directive binds, the
  approver confirming or rejecting; an outcome with no route in the composition (added, a product
  defect without `software`, `upstream-note` with no upstream pack) proposed as `decision-log`
  naming it in the item and in the decision-log (dl-012 D3; an absent upstream by extension).
  Neither new rule contradicts dl-012 or plan-073's rulings; both go to the approver with the
  acceptance request.
- 2026-11-16: final check of the re-review's fixes: approve after one should-fix, applied: the
  approver also rejects an outcome the composition does not route; with the nits: "a would-be
  `bug`", D3's reach marked, the reject branch in the directive's bullet, Open points 1 "unrouted".
  Wording within the rule already reviewed: no further re-review.
