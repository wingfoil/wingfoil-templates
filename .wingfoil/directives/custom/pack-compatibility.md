---
id: pack-compatibility
name: pack-compatibility
type: directive
kind: custom
title: "Pack compatibility"
tags: [packs, release, validation]
---

# Pack compatibility

Applies to every role that validates or publishes a pack.

- Every pack declares a `wingfoil` compatibility range in `pack.yaml`.
- Before a version is published, compose every preset and every documented combination that
  contains the pack, with **the lowest and the newest** WingFoil version of the range. Each
  composed `.wingfoil/` must pass `wingfoil workflow list`, `wingfoil dna show` and
  `wingfoil directives list` with exit code 0 and no warning.
- Compose twice from a clean state: the two outputs must be byte-identical.
- Record the commands, the WingFoil versions and the exit codes in the `pack-release` element.
  A claim of "it validates" without the command and its result is not evidence.
- A pack that needs a WingFoil feature not yet published raises its range lower bound to the first
  version that ships it; it is not published against an unreleased WingFoil build.
