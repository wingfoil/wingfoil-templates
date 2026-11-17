<!-- generated:begin title -->
# Feedback

Feedback for any project governed by WingFoil: capture each item with its source and context, have the approver triage it, and route it into the governance the project already has, so that it becomes input for the evolution of the project and of its governance.

Axis: governance
<!-- generated:end title -->

## When to use it

A project governed by WingFoil, software or not, that wants feedback to become input for its own
evolution composes `governance/feedback` with `base`: each item is captured with its source and
context, triaged by the approver, and routed into the governance the project already has (a
decision-log, a task, a change of the governance, a note to an upstream), then closed once the
routed element is named. It holds the `feedback` Memory type, the workflows `feedback-ingest`,
`feedback-review` and `feedback-item`, the `feedback` directive and, in a composition with
`software`, the `bug` route (`feedback-bug-route`, `feedback-bug-item` and its directive). It
serves a solo maintainer with an agent as well as a team, with any methodology or none. It adds no
methodology of its own and no upstream: an upstream (a library, a vendor, a client) is added by its
own governance pack, which requires this one. A project whose feedback needs no triage, or that
keeps it entirely in an issue tracker it does not want mirrored in Memory, does not need it.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block][install] of the catalog.

[install]: https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install

Until WingFoil installs packs, a project adopts `governance/feedback` by hand, together with `base`
(and `software`, for the `bug` route), with a WingFoil release in the pack's range (see its catalog
entry):

1. For a project that is already governed, compare its Memory types, workflows and directives with
   the pack's (section "What it adds"). A project that keeps a `feedback` type, or a workflow or
   directive of one of the pack's names, renames it or maps it first: WingFoil refuses two
   workflows of one name.
2. Compose `governance/feedback` with `base` (and `software`) with the reference composer of
   wingfoil-templates, giving `base`'s four required parameters, its own path and id pattern for
   feedback if not the defaults and, for a project that is already governed, its current values of
   the path and id parameters, so that no file moves. A project that composes an upstream's pack
   adds `upstream:<name>` to `feedback_targets`, as that pack's README says.
3. Copy the composed `.wingfoil/` files into the project's `.wingfoil/`, keeping its `custom/`
   folders, then re-add the project's own entries: only what the project wrote itself, among them
   the `include` entries of the `custom/` workflows it wrote, never the Memory types, roles or
   workflows WingFoil's `init` scaffolded; copy the generated AGENTS.md region into its
   `AGENTS.md`.
4. Feedback the project already keeps elsewhere (an issue tracker, notes, a channel) stays where it
   is: an item is captured as a `feedback` element when it is to be triaged, its `source` naming
   where it came from.
5. Record the adopted version of `governance/feedback` in the project's own Memory.

<!-- generated:begin composition -->
## Composition

- **Requires:** `base@^2`
- **Conflicts:** none
- **Formats:** `directive` 1, `memory` 1, `memory-template` 1, `roles` 1, `workflow` 1
- **Requires capabilities:** `workflow-engine`
- **Declares:**
  - Memory types: `feedback`
  - roles: none
  - states: `closed`, `draft`, `pending`, `triaged`
  - workflows: `feedback-ingest`, `feedback-item`, `feedback-review`
  - workflows only with `software`: `feedback-bug-item`, `feedback-bug-route`
  - directives only with `software`: `feedback-bug-route`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `feedback-ingest` (main)
  - `capture`, role `facilitator`
  - `triage`, role `approver`, gate `approver`
- `feedback-item` (sub)
  - `route`, role `facilitator`
  - `close`, role `facilitator`
- `feedback-review` (main)
  - `review`, includes `feedback-item`
- `feedback-bug-item` (sub), only with `software`
  - `bug`, role `facilitator`
  - `close`, role `facilitator`
- `feedback-bug-route` (main), only with `software`
  - `route-bugs`, includes `feedback-bug-item`

### Memory types

- `feedback`: `draft` → `pending` → `triaged` → `closed`; gates `pending` (reject → `draft`)

### Directives

- `feedback`: `facilitator`
- `feedback-bug-route`: —, only with `software`

### Fragments

- `roles`

### Memory templates

- `feedback`
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `feedback_id` | pattern | `feedback-{n}-{slug}` | The feedback type's id pattern |
| `feedback_kinds` | string | `defect, gap, request, observation` | List of the allowed values of a feedback item's kind |
| `feedback_outcomes` | string | `decision-log, task, upstream-note, declined, duplicate` | List of the outcomes feedback-review routes; never bug, which the software entry adds |
| `feedback_path` | path | `docs/memory/feedback/{id}.md` | The feedback type's path; only letters, digits and . _ / { } - |
| `feedback_targets` | string | `product, governance` | List of the allowed values of a feedback item's target, upstream:<name> included |
<!-- generated:end parameters -->

## Examples

### defaults

Fixture: tests/fixtures/examples/feedback/defaults/

Plover Desk, a fictional help desk, composes `base` and `governance/feedback` on every default,
with no methodology and no `software`. A user's remark that the escalation rule skips the night
shift is captured in `feedback-ingest` › `capture` as a `gap` on `governance`, its context the
workflow and phase that missed it, and its outcome proposed as `decision-log`; once the approver
triages it, `feedback-review` routes it to a decision-log through `decision-log-ingest`, and the
item is closed with `resulting` naming that decision-log.

### with-software

Fixture: tests/fixtures/examples/feedback/with-software/

Tern Ledger, a fictional bookkeeping service run in Sprints, composes `software`,
`methodology/scrum` and the pack: the `bug` route is present. A crash a customer reports is
captured as a `defect` on `product` with the outcome `bug`; after the triage, `bug-ingest` captures
the bug citing the item, and `feedback-bug-route` records the route and closes the item.

### added-outcome

Fixture: tests/fixtures/examples/feedback/added-outcome/

Skua Maps, a fictional mapping tool flowing its work with Kanban, composes `software`,
`methodology/kanban` and the pack, keeps its feedback under `docs/feedback/` with ids
`fb-{n}-{slug}`, and adds the outcome `deferred` to `feedback_outcomes`. An item triaged as
`deferred` is selected by `feedback-review` and, having no route of its own, becomes a
decision-log naming the outcome.

## Sources and adaptations

- WingFoil-Templates' dl-012 (the installable, configurable feedback pack) and spec-003 (the value
  lists, the upstream channels and the entry's directive).
- Adaptations to WingFoil 0.3.x:
  - a capture run holds one item and adds a plan element; a project capturing often may add items
    outside a run (`memory add`, then `submit`), the triage gate unchanged (not exercised);
  - WingFoil checks required fields at `submit` only and evaluates no workflow `checks` string, so
    `outcome`, `resulting` and the allowed values are checked by the `feedback` directive's rules
    and by this repository's fixture checks, not by the engine;
  - the routes add their targets outside the step and record it with `workflow finalize`, since a
    step cannot include a `main` workflow and a target added inside the pack's step would be owned
    by its run;
  - a completed `feedback-review` (or `feedback-bug-route`) takes a newly triaged item until the
    run is ended;
  - the routed elements cite the item in their body until `base` and `software` ship the optional
    `reported_by` field in their templates.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-governance-feedback)
