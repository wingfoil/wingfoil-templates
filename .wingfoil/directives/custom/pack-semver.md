---
id: pack-semver
name: pack-semver
type: directive
kind: custom
title: "Pack semantic versioning"
tags: [packs, release]
---

# Pack semantic versioning

Every pack has its own semver (dl-001). There is no repository-wide version.

- **major**: a project composed from the previous version changes behaviour or stops validating.
  Removing or renaming a directive id, a workflow name, a phase, a Memory type, a state, a role or a
  parameter; a new required parameter without a default; a requirement made stricter (a new gate, a
  required frontmatter field); narrowing the `wingfoil` compatibility range.
- **minor**: something added that an existing project can ignore. A new directive, workflow,
  optional phase, parameter with a default, Memory type; widening the `wingfoil` range.
- **patch**: no change in what a composed project contains, other than wording, comments, typos
  and the pack's own README.
- When a change is in doubt between two classes, take the higher one.
- The version is set in `pack.yaml` and recorded in a `pack-release` element; the tag is
  `<axis>/<name>@<version>`. A published tag is never moved or deleted.
- `0.x` versions are allowed only while spec-001 (the pack format) is not approved.
