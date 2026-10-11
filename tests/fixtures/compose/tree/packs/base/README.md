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

- `end-of-life` (sub)
  - `default`
- `inception` (sub)
  - `default`
- `release` (sub)
  - `default`
- `retrospective` (sub)
  - `review`
- `specification` (sub)
  - `default`
- `sw-life-cycle` (main)
  - `inception`, includes `inception`
  - `specification`, includes `specification`
  - `delivery`, includes `delivery`
  - `end-of-life`, includes `end-of-life`

### Memory types

- `adr`: defaults, `draft` → `pending` → `approved`; gates `pending` (reject → `draft`)
- `task`: `draft` → `pending` → `backlog` → `in-progress` → `in-review` → `approved` → `done`; gates `in-review` (reject → `in-progress`), `pending` (reject → `draft`)

### Directives

- `base-rules`: `developer`

### Fragments

- `dna`
- `roles`

### Memory templates

- `adr`
- `task`
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `adr_path` | path | `docs/memory/adr/{id}.md` | Where ADRs live |
| `project_name` | string | required | The project name, dna.yaml project.name |
<!-- generated:end parameters -->

## Examples

Placeholder until the examples are fixtures.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-base)
