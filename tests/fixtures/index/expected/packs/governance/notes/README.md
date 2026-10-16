<!-- generated:begin title -->
# governance/notes

Test pack governance/notes.

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
  - workflows: `notes`
  - only with `software`: `notes-rules`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `notes` (sub)

### Memory types

None.

### Directives

- `notes-rules`: —, only with `software`

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

Fixture: tests/fixtures/examples/notes/basic/

A fictional team adopts the pack with kanban.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-governance-notes)
