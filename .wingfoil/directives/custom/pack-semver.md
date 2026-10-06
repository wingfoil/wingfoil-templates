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
  required frontmatter field); moving content to a new format version (`formats`); adding a
  `requires_capabilities` entry. Both drop the WingFoil releases that cannot read or provide them
  (dl-002).
- **minor**: something added that an existing project can ignore. A new directive, workflow,
  optional phase, parameter with a default, Memory type; removing a `requires_capabilities` entry.
- **patch**: no change in what a composed project contains, other than wording, comments, typos
  and the pack's own README.
- When a change is in doubt between two classes, take the higher one.
- The version is set in `pack.yaml` and recorded in a `pack-release` element; the tag is
  `<axis>/<name>@<version>`. A published tag is never moved or deleted.
- `0.x` versions are allowed only while spec-001 (the pack format) is not approved.

## Lines and maintenance (dl-002)

- **Before WingFoil 1.0:** one living line per pack, written in the newest formats. Older versions
  stay tagged and listed in the catalog, frozen: a project on an older WingFoil resolves the newest
  version it can read, and that version gets no further fix.
- **From WingFoil 1.0:** the current format generation (N) and the previous one (N-1) are maintained
  for a declared window (at least one WingFoil minor after N ships). N-1 lives on a maintenance
  branch and receives fixes only, never features. After the window it is frozen.
- A fix that applies to both lines is made on N first, then backported; the two pack-release
  elements cite each other.
