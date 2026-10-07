---
id: F-004
title: "Remote content conflicts with dl-031 (\"no digest, no manifest\")"
kind: gap
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T4.

## Observed

`src/core/init.ts:134-135` applies `dl-031-req-sec-10-integrity-depth`: the integrity check on
built-in templates is schema validation only, with "no digest, no manifest, no checksum". That was
right for assets compiled into the package. It is not enough for content downloaded from a network.

## Expected

- a `catalog.yaml`/manifest with a digest per pack version;
- verification before anything is written;
- schema validation and the secret scan (task-135) applied to downloaded packs exactly as to
  built-ins;
- the official repository as the only source by default (third-party sources are a later
  decision).

Open question (planning, 5): third-party or private pack sources — dl-138 opens WingFoil to them,
with an allowlist (its Q4). Are they in v0.4, or only the official source first?

Related: WingFoil dl-138 Q4 (trust: allowlist, schema check, secret scan). Suggested kind in
WingFoil: decision-log that extends or supersedes dl-031 for remote packs.
