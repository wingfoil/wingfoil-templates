<!-- generated:begin title -->
# kanban

Golden fixture pack methodology/kanban.

Axis: methodology
<!-- generated:end title -->

## When to use it

A test fixture of the tooling; never adopted.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install) of the catalog.

<!-- generated:begin composition -->
## Composition

- **Requires:** `base@^1`
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

Placeholder until the examples are fixtures.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-methodology-kanban)
