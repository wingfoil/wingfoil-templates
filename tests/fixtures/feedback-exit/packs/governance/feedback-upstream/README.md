<!-- generated:begin title -->
# Feedback upstream fixture

A test fixture, never published: an upstream pack shipping the feedback channel of the fictional vendor Plover Vendor, so that the upstream-note route of governance/feedback can be driven.

Axis: governance
<!-- generated:end title -->

## When to use it

Never: a test fixture of wingfoil-templates, never published.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block][install] of the catalog.

[install]: https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install

It is not installed: it exists only under tests/fixtures/. A composition that composes it adds
`upstream:plover-vendor` to `feedback_targets` (spec-003 §5.3).

<!-- generated:begin composition -->
## Composition

- **Requires:** `base@^2`, `governance/feedback@^1`
- **Conflicts:** none
- **Formats:** `directive` 1, `roles` 1
- **Requires capabilities:** none
- **Declares:**
  - Memory types: none
  - roles: none
  - states: none
  - workflows: none
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

None.

### Memory types

None.

### Directives

- `plover-vendor-channel`: `facilitator`

### Fragments

- `roles`

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

None: written for this catalog.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-governance-feedback-upstream)
