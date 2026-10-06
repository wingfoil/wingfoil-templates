---
id: dl-004-pack-identifiers-version-tags-and-the-catalog-digest
type: decision-log
title: "Pack identifiers, version tags and the catalog digest"
status: draft
tags: ["packs","conventions"]
---

## Context

Four conventions have to be fixed before spec-001. In the first attempt they were chosen by the
agent and reached only commits (`4e22350`, `a5e2eb2`). The approver never discussed them. The session
"WingFoil-Templates repository planning" confirmed this on 2026-10-05. Each one is therefore a
proposal here, with its options.

1. **The id of a `pack` Memory element.** The configuration confirmed on 2026-10-06 has
   `id_pattern: "pack-{axis}-{name}"`. `memory add --set` fills only id tokens (feedback notes T11),
   so a field required at creation must be an id token. Two cases do not fit cleanly:
   - a phase pack loses its slot: `phase/inception/lean-inception` becomes
     `pack-phase-lean-inception`;
   - `base` has no axis (dl-003 D1), and the first attempt used a fictitious axis, `foundation`.
2. **The tag of a published version.** It addresses a version in git, for WingFoil's resolver
   (notes T3).
3. **The name of an N-1 maintenance branch** (dl-002, from WingFoil 1.0).
4. **The catalog digest.** Only its format, `sha256:<64 hex>`, was drafted. No procedure was ever
   agreed.

   The hash recorded in the first attempt's `prel-001` was not a pack digest. It was the hash of a
   composed tree, from the determinism check.

## Options

**1. Pack element id.**
- (a) `pack-{axis}-{name}`, as configured. Pack names must be unique across the whole catalog, and a
  lint rule checks it. `base` is the element `pack-foundation-base`: `foundation` is a reserved value
  of the element's `axis` field only, while in `catalog.yaml` `base` stays outside the axes.
- (b) `pack-{axis}-{name}` with the slot folded into the name: `pack-phase-inception-lean-inception`
  (`name: inception-lean-inception`). It is unique without a lint rule, but the element name no
  longer equals the pack's directory name.
- (c) `pack-{name}`, with `axis` and `slot` filled by hand before `submit`. Ids are short, but the
  required fields are filled by hand (notes T11, N13).

**2. Tag.**
- (a) `<catalog pack id>@<version>`: `base@0.1.0`, `methodology/kanban@1.0.0`,
  `phase/inception/lean-inception@1.0.0`.
- (b) `<axis>/<name>@<version>`. It loses the slot of phase packs and has no form for `base`.

**3. Maintenance branch.**
- (a) `<axis>/<name>/<major>.x`, as drafted. Its names overlap the tags' namespace visually.
- (b) `maint/<catalog pack id>/<major>.x`, for example `maint/methodology/kanban/1.x`. The prefix
  separates branches from tags.

**4. Digest.**
- (a) sha256 over a canonical listing of every file in the pack directory at the tag: relative
  path and content hash, sorted by path. Bytes are hashed as committed (no line-ending rewrite) and
  no file is excluded. What is tagged is what is hashed.
- (b) Like (a), but excluding `README.md` and `CHANGELOG.md`, so that documentation fixes do not
  change the digest.
- (c) The git tree id of the pack directory. It is free to compute, but it is SHA-1, git-specific,
  and cannot be checked without git.

## Decision

Proposed, for the approver to rule. Recommended: **1(a), 2(a), 3(b), 4(a).**

- **1(a)** keeps the configured pattern working with the CLI as it is. Unique pack names are a
  sensible catalog rule anyway.
- **2(a)** is the only option that addresses every pack, `base` and phase packs included.
- **3(b)** separates branches from tags at a glance.
- **4(a)** makes the digest a function of exactly what was published.

spec-001 fixes the byte-level procedure of the digest: listing format, path normalization, sort
order.

Configuration changes, depending on the ruling. Each is applied after approval and bumps `version:`:
- 2(a): `pack-semver` and `pack-release-cycle` state the tag as `<catalog pack id>@<version>`, and
  the `pack-release` template's Publication comment names it;
- 3(b): `pack-semver` names the maintenance branch;
- 1(b) or 1(c): `memory.yaml` and the `pack` template change. This would go through a later commit,
  because the configuration commit can no longer be amended.

## Execution Notes
