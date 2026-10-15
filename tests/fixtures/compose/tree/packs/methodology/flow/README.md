<!-- generated:begin title -->
# flow

Golden fixture pack methodology/flow.

Axis: methodology
<!-- generated:end title -->

## When to use it

A test fixture of the tooling; never adopted.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install) of the catalog.

<!-- generated:begin composition -->
## Composition

- **Requires:** `base@^1`, `software@^1`
- **Conflicts:** none
- **Formats:** `directive` 1, `roles` 1, `workflow` 1
- **Requires capabilities:** none
- **Declares:**
  - Memory types: none
  - roles: none
  - states: none
  - workflows: `delivery`, `replenishment`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `delivery` (sub)
  - `release`, includes `release`
  - `retrospective`, includes `retrospective`
- `replenishment` (sub)
  - `pick`

### Memory types

None.

### Directives

- `wip-limits`: `developer`

### Fragments

- `roles`

### Memory templates

None.
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `wip_limit` | integer | `3` | WIP limit of the in-progress column |
<!-- generated:end parameters -->

## Examples

### core-team

Fixture: tests/fixtures/examples/flow/core-team/

A fictional bakery, Lumen Bakery, pulls its work through one board with `flow` alone: it gets the `flow-board` workflow, and no `delivery`, since its composition holds no `software`.

### delivery-team

Fixture: tests/fixtures/examples/flow/delivery-team/

The same bakery composes `flow` with `software`: its conditional part adds `delivery` and `flow-delivery`, after `flow-board`.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-methodology-flow)
