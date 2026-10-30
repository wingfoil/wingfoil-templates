<!-- generated:begin title -->
# Kanban

Kanban after the Kanban Guide, May 2025: a continuous flow of work items pulled within WIP limits, carried by releases the Product Owner decides, each release ending with its retrospective, as the delivery of software's life cycle.

Axis: methodology
<!-- generated:end title -->

## When to use it

A software project governed by WingFoil that flows its work without timeboxes composes
`methodology/kanban` with `base` and `software`: it fills the life cycle's `delivery` with a
continuous flow of work items, each pulled from the backlog to done within explicit WIP limits, and
carried by releases the Product Owner decides, each release ending with a retrospective. It holds
the workflows `delivery`, `release-flow` and `work-item` and the `kanban` and
`definition-of-workflow` directives, adds a `release` field to `task`, and limits the tasks
`in-progress` and `in-review`. It serves a team or a solo developer with an agent who wants to
finish work before starting more and to measure its flow. A team that works in fixed-length
Sprints takes `methodology/scrum` instead. Limits per team, per person or per column of a board
are not expressible: a limit counts every task of the repository. It prescribes no event, no
timebox, no estimation and no class of service.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block][install] of the catalog.

[install]: https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install

Until WingFoil installs packs, a project adopts `methodology/kanban` by hand, together with `base`
and `software`, with a WingFoil release in the pack's range (see its catalog entry):

1. For a project that is already governed, compare its delivery workflows and phases with
   `kanban`'s (section "What it adds").
2. Compose `methodology/kanban` with `software` and `base` with the reference composer of
   wingfoil-templates, giving `base`'s four required parameters, its own limits and Service Level
   Expectation if not the defaults and, for a project that is already governed, its current values
   of the path and id parameters, so that no file moves.
3. Copy the composed `.wingfoil/` files into the project's `.wingfoil/`, keeping its `custom/`
   folders, then re-add the project's own entries: only what the project wrote itself, among them
   the `include` entries of the `custom/` workflows it wrote, never the Memory types, roles or
   workflows WingFoil's `init` scaffolded; copy the generated AGENTS.md region into its
   `AGENTS.md`. Remove the delivery workflow `init` scaffolded under `workflows/custom/`
   (`kanban-delivery` or `scrum-delivery`) with its `include` entry: `kanban`'s `delivery`
   replaces it. `base`'s and `software`'s step 4 remove the other workflows `init` scaffolded.
4. Bring every state within its limit before adopting: WingFoil refuses the next move into a state
   that is over it.
5. Give every open task a `release`, the version of the release that carries it, or
   `release: "n/a — <reason>"` until it is planned, before it is next submitted or amended.
6. Releases already `released` stay out of `delivery`; open releases join it with their tasks. If
   none is open, add the first with `delivery`'s `plan-release`.
7. Migrate by explicit commits the elements whose state has another name, and record an old → new
   key mapping for the workflows and phases the project renames; a project's own
   `kanban-delivery`, if kept, keeps its name beside `work-item`.
8. Record the adopted version of `methodology/kanban` in the project's own Memory.

<!-- generated:begin composition -->
## Composition

- **Requires:** `base@^2`, `software@^1`
- **Conflicts:** none
- **Formats:** `directive` 1, `memory` 1, `roles` 1, `workflow` 1
- **Requires capabilities:** `workflow-engine`
- **Declares:**
  - Memory types: `task`
  - roles: none
  - states: none
  - workflows: `delivery`, `release-flow`, `work-item`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `delivery` (sub)
  - `plan-release`, role `product-owner`
  - `releases`, includes `release-flow`
- `release-flow` (sub)
  - `work`, includes `work-item`
  - `release`, includes `release`
  - `retrospective`, includes `retrospective`
- `work-item` (sub)
  - `start`, role `developer`
  - `build`, role `developer`
  - `review`, role `reviewer`
  - `approve`, role `approver`, gate `approver`
  - `done`, role `developer`

### Memory types

- `task`: 

### Directives

- `definition-of-workflow`: `developer`, `qa`, `reviewer`
- `kanban`: `developer`, `facilitator`, `product-owner`

### Fragments

- `roles`

### Memory templates

None.
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `service_level_expectation` | string | `85% of work items finish within 10 days` | The Service Level Expectation: how long a work item should take, with its probability |
| `wip_in_progress` | integer | `2` | The most tasks in-progress at once, in the whole repository (a positive integer) |
| `wip_in_review` | integer | `1` | The most tasks in-review at once, in the whole repository (a positive integer) |
<!-- generated:end parameters -->

## Examples

### defaults

Fixture: tests/fixtures/examples/kanban/defaults/

Plover Board, a fictional accounting tool, composes `base`, `software` and `methodology/kanban` on
every default: at most two tasks in progress and one in review, and a Service Level Expectation of
85% of work items finishing within 10 days. When a developer starts a task in `work-item` ›
`start`, WingFoil moves it from `backlog` to `in-progress`, or refuses if two tasks are already in
progress; the task then waits in the backlog until one finishes.

### team-limits

Fixture: tests/fixtures/examples/kanban/team-limits/

Gannet Routes, a fictional delivery-routing service run by a team of four, composes the same packs
with wider limits (`wip_in_progress: 4`, `wip_in_review: 2`) and a shorter Service Level
Expectation (85% of work items within 7 days). Its Product Owner keeps the next release open:
when a release's last task is done, its release slot runs the checks, the approval and the
publication, then the release's retrospective, while the tasks of the next release flow.

## Sources and adaptations

- The Kanban Guide, May 2025 edition (v2025.5, kanbanguides.org): the three practices, the
  Definition of Workflow, the four flow measures and the Service Level Expectation.
- Adaptations to the Guide:
  - the approver's gates (`work-item` › `approve`, `base`'s and `software`'s gates) are
    WingFoil's governance, not Kanban's;
  - WIP is controlled by WingFoil's `limits` on two states of `task`, counted over the whole
    repository and every branch WingFoil sees (a task started on an unmerged branch holds its
    place, and a branch not fetched is not counted), not per column of a team's board; a reject is
    not checked against the limit, so the `kanban` directive brings a state a reject pushed over
    its limit back within it first;
  - the flow runs inside releases: a work item carries the release it is delivered in, by its
    version, and two releases of one version on two release lines are not told apart; a release
    moves to `releasing` only once its tasks are done or moved to the next release;
  - the flow needs one release `in-development`: with none, `delivery` completes and `end-of-life`
    becomes current until a new release is added;
  - releases after the first are added outside a step (`memory add`), WingFoil 0.3.x taking a
    completed step's evidence once;
  - the flow measures are read from Memory by hand: WingFoil computes none of them;
  - the workflow is improved at `base`'s `retrospective`, one per release, whose approval is not
    bound to the release: a released release's `retrospective` › `approve` step is listed again
    while a later release's retrospective decision-log is `in-discussion`, and `pending approvals`
    counts that one decision-log once per step; one approval clears them all, and nothing is
    reported `late`. Once a file is under the retrospective path, `explore` completes for every
    later release; the facilitator writes each release's own file;
  - the Guide defines no role: the pack uses `base`'s and `software`'s.
- The Service Level Expectation's default is a convention for new projects, not the Guide's: each
  project states its own.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-methodology-kanban)
