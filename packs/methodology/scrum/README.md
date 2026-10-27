<!-- generated:begin title -->
# Scrum

Scrum after the Scrum Guide, November 2020: repeated fixed-length Sprints, each with its planning, its Sprint Backlog, its review and its retrospective, and releases decided by the Product Owner inside the Sprints, as the delivery of software's life cycle.

Axis: methodology
<!-- generated:end title -->

## When to use it

A software project governed by WingFoil that works in Sprints composes `methodology/scrum` with
`base` and `software`: it fills the life cycle's `delivery` with repeated, fixed-length Sprints,
one at a time, each with its planning, its Sprint Backlog, its review and its retrospective, and
lets the Product Owner release an Increment inside a Sprint. It holds the `sprint` type, the
workflows `delivery`, `sprint` and `backlog-item`, and the `scrum` and `definition-of-done`
directives, and it adds a `sprint` field to `task` and to `release`. It serves a team or a solo
developer with an agent that wants Scrum's cadence and accountabilities; a project that flows work
without timeboxes takes another methodology. It prescribes no estimation technique, no user stories
and no burn-down charts.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block][install] of the catalog.

[install]: https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install

Until WingFoil installs packs, a project adopts `methodology/scrum` by hand, together with `base`
and `software`, with a WingFoil release in the pack's range (see its catalog entry):

1. For a project that is already governed, compare its delivery workflows and phases with
   `scrum`'s (section "What it adds").
2. Compose `methodology/scrum` with `software` and `base` with the reference composer of
   wingfoil-templates, giving `base`'s four required parameters and, for a project that is
   already governed, its current values of the path and id parameters, so that no file moves.
3. Copy the composed `.wingfoil/` files into the project's `.wingfoil/`, keeping its `custom/`
   folders and re-adding its own entries; copy the generated AGENTS.md region into its `AGENTS.md`.
4. Give every open task `sprint: "n/a — <reason>"` until a Sprint selects it, and every existing
   release a `sprint` (or list it in the project's own `exempt`), before they are next submitted
   or amended.
5. Migrate by explicit commits the elements whose state has another name, and record an old → new
   key mapping for the workflows and phases the project renames; a project's own `dev-loop` keeps
   its name beside `backlog-item`.
6. Add the first Sprint with `delivery`'s `plan-sprint`, then write its id in the `sprint` field of
   the tasks it selects.
7. Record the adopted version of `methodology/scrum` in the project's own Memory.

<!-- generated:begin composition -->
## Composition

- **Requires:** `base@^1`, `software@^1`
- **Conflicts:** none
- **Formats:** `directive` 1, `memory` 1, `memory-template` 1, `roles` 1, `workflow` 1
- **Requires capabilities:** `workflow-engine`
- **Declares:**
  - Memory types: `release`, `sprint`, `task`
  - roles: none
  - states: `active`, `done`, `draft`, `planned`
  - workflows: `backlog-item`, `delivery`, `sprint`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `backlog-item` (sub)
  - `start`, role `developer`
  - `build`, role `developer`
  - `review`, role `reviewer`
  - `approve`, role `approver`, gate `approver`
  - `done`, role `developer`
- `delivery` (sub)
  - `plan-sprint`, role `product-owner`
  - `sprints`, includes `sprint`
- `sprint` (sub)
  - `sprint-planning`, role `product-owner`
  - `development`, includes `backlog-item`
  - `plan-release`, role `product-owner`
  - `release`, includes `release`
  - `sprint-review`, role `product-owner`
  - `retrospective`, includes `retrospective`
  - `close`, role `facilitator`

### Memory types

- `release`: —
- `sprint`: `draft` → `planned` → `active` → `done`
- `task`: —

### Directives

- `definition-of-done`: `developer`, `qa`, `reviewer`
- `scrum`: `developer`, `facilitator`, `product-owner`

### Fragments

- `roles`

### Memory templates

- `sprint`
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `sprint_id` | pattern | `sprint-{n}` | The sprint type's id pattern |
| `sprint_length` | string | `2 weeks` | The Sprints' fixed length, at most one month |
| `sprint_path` | path | `docs/memory/sprint/{id}.md` | The sprint type's path; only letters, digits and . _ / { } - |
<!-- generated:end parameters -->

## Examples

### defaults

Fixture: tests/fixtures/examples/scrum/defaults/

Puffin Tickets, a fictional ticketing service, composes `base`, `software` and `methodology/scrum`
on every default: Sprints of two weeks, its sprints under `docs/memory/sprint/`. When a Sprint
starts, its Product Owner runs `sprint-planning`: the Sprint Goal is written in the sprint, the
tasks it selects get its id in their `sprint` field, and the Sprint moves to `active`.

### release-folders-lean

Fixture: tests/fixtures/examples/scrum/release-folders-lean/

Otter Ledger, a fictional bookkeeping app, files its records by release under `docs/04_memory/`
and works in one-week Sprints, its sprints under `docs/04_memory/sprints/`. It releases once its
Sprint Backlog is done: the Product Owner adds the release in `plan-release`, and the release slot
runs its checks, approval and publication inside the Sprint, beside the Sprint Review.

## Sources and adaptations

- The Scrum Guide, November 2020 edition (scrumguides.org): the accountabilities, the events and
  their timeboxes, the artefacts and their commitments.
- Adaptations to the Guide:
  - the approver's gates (`backlog-item` › `approve`, `base`'s and `software`'s gates) are
    WingFoil's governance, not Scrum's;
  - the Daily Scrum and refinement have no phase: they leave no artefact;
  - an Increment is released only once the Sprint Backlog is done or moved, and a release passes
    through one Sprint's `release` phase at a time; a release that spans Sprints has its `sprint`
    rewritten and its recorded steps recorded again;
  - the next Sprint and further releases are added outside a step (`memory add`), WingFoil 0.3.0
    taking a completed step's evidence once;
  - the Scrum Master is `base`'s facilitator, and the Developers are `software`'s roles.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-methodology-scrum)
