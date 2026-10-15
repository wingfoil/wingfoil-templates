<!-- generated:begin title -->
# Kanban (unreleased)

Kanban, 1.2.0. A pull system with WIP limits.

Axis: methodology
<!-- generated:end title -->

## When to use it

Not released yet.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install) of the catalog.

<!-- generated:begin composition -->
## Composition

- **Requires:** `base@^1`, `software@^1`
- **Conflicts:** none
- **Formats:** `workflow` 1
- **Requires capabilities:** none
- **Declares:**
  - Memory types: none
  - roles: none
  - states: none
  - workflows: `delivery`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `delivery` (sub)
  - `release`, includes `release`
  - `retrospective`, includes `retrospective`

### Memory types

None.

### Directives

None.

### Fragments

None.

### Memory templates

None.
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

None.
<!-- generated:end parameters -->

## Examples

### basic

Fixture: tests/fixtures/examples/kanban/basic/

A fictional team adopts the pack with kanban.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-methodology-kanban)
