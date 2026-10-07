---
id: F-003
title: "Pack versioning and the \"advance bundled packs\" release step"
kind: request
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T3.

## Observed

WingFoil bundles its templates in the npm package and has no step that refreshes them from an
external source before a release.

## Expected

Packs are semver'd one by one; their compatibility is declared as formats + capabilities (F-012,
F-013) and the WingFoil range shown to users is computed from them. Before a WingFoil release, the
bundled base packs move to the newest published version on WingFoil-Templates that is compatible.
This mirrors `release-planning`'s `advance-pinned-build` (dl-095 Q3): forward only, published only,
one commit that touches only the vendored packs and their lock. Add a phase,
`advance-bundled-packs`, to `release-submit` (or `release-planning`); its post-check: every bundled
pack's version equals the newest compatible published version, and the full test suite passes on
the new packs.

Open question (planning, 1): how a published pack version is addressed — per-pack git tags
(`<axis>/<pack>@<semver>`), or a `catalog.yaml` mapping each version to a commit? This repository
uses both (spec-001 §4, §11): tags `<catalog pack id>@<version>` and a catalog entry with the
commit and digest.

Suggested kind in WingFoil: decision-log + a change to the `release-submit`/`release-planning`
workflow.
