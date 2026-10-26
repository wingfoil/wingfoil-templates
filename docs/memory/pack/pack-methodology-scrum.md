---
id: pack-methodology-scrum
type: pack
title: "Scrum"
status: draft
axis: "methodology"
name: "scrum"
slot: ""            # phase packs only: inception | specification | release | end-of-life (dl-003 D11)
pack_path: ""       # packs/<catalog pack id>: packs/base, packs/software, or packs/<axis>/[<slot>/]<name>
requires: []        # catalog pack ids with a semver range: base@^<major> for every pack but base (dl-003), software@^<major> for every phase pack (dl-022), plus any other
conflicts: []       # pack ids that cannot be composed with this one
---

## Purpose

<!-- What this pack is for, and for which projects. One paragraph. -->

## Ships

<!-- What the pack contributes to a project's .wingfoil/: dna/roles/memory fragments, directives,
     workflows (by name), Memory templates, parameters with their defaults. -->

## Out of scope

<!-- What it deliberately does not do, and which other pack does it. -->

## Compatibility

<!-- The file formats the pack is written in and the WingFoil capabilities it requires (dl-002);
     its WingFoil range is computed from compat.yaml, never written here. -->

## Execution Notes
