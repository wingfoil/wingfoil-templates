<!-- generated:begin title -->
# agent-first

Golden fixture pack team-mode/agent-first.

Axis: team-mode
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
- **Formats:** `dna` 1, `memory` 1
- **Requires capabilities:** none
- **Declares:**
  - Memory types: `task`
  - roles: `reviewer`
  - states: `approved`, `backlog`, `done`, `draft`, `in-progress`, `in-review`, `pending`, `ready`
  - workflows: none
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

None.

### Memory types

- `task`: `draft` → `pending` → `backlog` → `ready` → `in-progress` → `in-review` → `approved` → `done`; gates `ready` (reject → `backlog`)

### Directives

None.

### Fragments

- `dna`

### Memory templates

None.
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

None.
<!-- generated:end parameters -->

## Examples

### agent-team

Fixture: tests/fixtures/examples/agent-first/agent-team/

A fictional research lab, Quill Lab, lets agents do most of the work. It adds `team-mode/agent-first` to kanban and gets the reviewer role and its agent; every change is reviewed before it is accepted.

## Sources and adaptations

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-team-mode-agent-first)
