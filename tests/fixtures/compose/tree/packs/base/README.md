<!-- generated:begin title -->
# base

Golden fixture pack base.

Axis: foundation
<!-- generated:end title -->

## When to use it

A test fixture of the tooling; never adopted.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install) of the catalog.

<!-- generated:begin composition -->
## Composition

- **Requires:** none
- **Conflicts:** none
- **Formats:** `directive` 1, `dna` 1, `memory` 1, `memory-template` 1, `roles` 1, `workflow` 1
- **Requires capabilities:** none
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `governance-evolution` (main)
  - `assess`
- `retrospective` (sub)
  - `review`

### Memory types

- `task`: `draft` → `pending` → `backlog` → `in-progress` → `in-review` → `approved` → `done`; gates `in-review` (reject → `in-progress`), `pending` (reject → `draft`)

### Directives

- `base-rules`: `developer`

### Fragments

- `dna`
- `roles`

### Memory templates

- `task`
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `project_name` | string | required | The project name, dna.yaml project.name |
<!-- generated:end parameters -->

## Examples

### kanban-team

Fixture: tests/fixtures/examples/base/kanban-team/

A fictional bakery, Lumen Bakery, keeps its order tool in one repository with a small team. It composes `base` with `methodology/kanban` and gets the Memory types and the roles every pack builds on.

### core-only

Fixture: tests/fixtures/examples/base/core-only/

The same bakery keeps its tasks without a life cycle: `base` alone, with no methodology and no `software`.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-base)
