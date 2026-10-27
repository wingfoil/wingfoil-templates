<!-- generated:begin title -->
# software

Golden fixture pack software.

Axis: foundation
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
- **Formats:** `memory` 1, `memory-template` 1, `workflow` 1
- **Requires capabilities:** none
- **Declares:**
  - Memory types: `adr`, `release`
  - roles: none
  - states: none
  - workflows: `end-of-life`, `inception`, `release`, `specification`, `sw-life-cycle`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `end-of-life` (sub)
  - `default`
- `inception` (sub)
  - `default`
- `release` (sub)
  - `default`
- `specification` (sub)
  - `default`
- `sw-life-cycle` (main)
  - `inception`, includes `inception`
  - `specification`, includes `specification`
  - `delivery`, includes `delivery`
  - `end-of-life`, includes `end-of-life`

### Memory types

- `adr`: —
- `release`: —

### Directives

None.

### Fragments

None.

### Memory templates

- `adr`
- `release`
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `adr_path` | path | `docs/memory/adr/{id}.md` | Where ADRs live |
<!-- generated:end parameters -->

## Examples

### delivery-team

Fixture: tests/fixtures/examples/software/delivery-team/

A fictional bakery, Lumen Bakery, delivers its order tool through the software life cycle. It composes `software` with `methodology/kanban` and gets the life cycle, the slot defaults and the `adr` type; its inception phase runs `software`'s default workflow.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-software)
