<!-- generated:begin title -->
# Fixture

A test fixture, never published: the smallest methodology whose delivery follows software's contract, so that software composes and validates (dl-022 S6).

Axis: methodology
<!-- generated:end title -->

## When to use it

Never: a test fixture of wingfoil-templates, never published.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block][install] of the catalog.

[install]: https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install

It is not installed: it exists only under tests/fixtures/.

<!-- generated:begin composition -->
## Composition

- **Requires:** `base@^1`, `software@^1`
- **Conflicts:** none
- **Formats:** `workflow` 1
- **Requires capabilities:** `workflow-engine`
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
  - `plan-release`, role `tech-lead`
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

None: a test fixture.

## Sources and adaptations

None: written for this repository's tests.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-methodology-fixture)
