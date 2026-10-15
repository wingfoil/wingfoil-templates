<!-- generated:begin title -->
# lean

Golden fixture pack phase/inception/lean.

Axis: phase · Slot: inception
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
- **Formats:** `workflow` 1
- **Requires capabilities:** none
- **Declares:**
  - Memory types: none
  - roles: none
  - states: none
  - workflows: `inception`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `inception` (sub)
  - `vision`
  - `features`

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

### new-product

Fixture: tests/fixtures/examples/lean/new-product/

A fictional startup, Orchard Notes, starts a product from an idea. It adds `phase/inception/lean` to kanban and gets the Lean Inception workflow in the inception slot; its first phase ends with a product brief.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-phase-inception-lean)
