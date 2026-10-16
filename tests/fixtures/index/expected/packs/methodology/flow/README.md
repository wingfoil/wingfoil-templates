<!-- generated:begin title -->
# methodology/flow

Test pack methodology/flow.

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
- **Formats:** `directive` 1, `workflow` 1
- **Requires capabilities:** none
- **Declares:**
  - Memory types: none
  - roles: none
  - states: none
  - workflows: `flow-board`
  - workflows only with `software`: `delivery`, `flow-delivery`
  - directives only with `software`: `flow-limits`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `flow-board` (sub)
- `delivery` (sub), only with `software`
  - `release`, includes `release`
  - `retrospective`, includes `retrospective`
- `flow-delivery` (sub), only with `software`

### Memory types

None.

### Directives

- `flow-limits`: —, only with `software`

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

Fixture: tests/fixtures/examples/flow/basic/

A fictional team adopts the pack with kanban.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-methodology-flow)
