<!-- generated:begin title -->
# governance/checks

Test pack governance/checks.

Axis: governance
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
  - workflows: `checks-gate`
  - workflows only with `software`: `checks-flow`
  - directives only with `methodology/flow`: `checks-rule`
- **Combines with care:**
  - `stage/mvp@^1`: Checks run lightly in an MVP.
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `checks-gate` (sub)
- `checks-flow` (sub), only with `software`

### Memory types

None.

### Directives

- `checks-rule`: —, only with `methodology/flow`

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

Fixture: tests/fixtures/examples/checks/basic/

A fictional team adopts the pack with kanban.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-governance-checks)
