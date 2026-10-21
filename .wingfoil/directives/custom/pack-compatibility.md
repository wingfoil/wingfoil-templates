---
id: pack-compatibility
name: pack-compatibility
type: directive
kind: custom
title: "Pack compatibility"
tags: [packs, release, validation]
---

# Pack compatibility

Applies to every role that validates or publishes a pack of this repository's catalog (`packs/`).
The tooling's test fixtures (`tests/fixtures/`) are not catalog packs: their compositions are the
tooling's self-tests, run in the matrix's self-test mode (dl-009).

- The contract with WingFoil is what a pack declares in `pack.yaml`: the `formats` its content is
  written in and the `requires_capabilities` it needs (dl-002). Never write a WingFoil version
  range by hand: the range in `catalog.yaml` is computed from `compat.yaml` at publication.
- Before a version is published, compose every preset and every documented combination that
  contains the pack, with **the oldest and the newest** WingFoil release that `compat.yaml` lists as
  compatible (it reads every format, it provides every capability). Each
  composed `.wingfoil/`, committed in a scratch repository, must pass `wingfoil workflow list`,
  `wingfoil dna show` and `wingfoil directives list`, each run with `--format json`, with exit code
  0 and no warning: no stderr line, no `workflow list` diagnostic of severity warning or error, no
  `directives list` warning (plan-042, rulings L and M).
- A pack with a conditional part (spec-001 §6.5) is validated in compositions with and without
  `software`. `npm run validate` derives the other leg of each composition that holds one; the
  leg with `software` needs a methodology, so for a pack that is not one it comes from a
  documented combination (a README example or a preset) that holds a methodology, and a
  publication fails without a leg with `software` that ran (plan-039 R2, R6).
- Compose twice from a clean state: the two outputs must be byte-identical.
- Record the commands, the WingFoil versions and the exit codes in the `pack-release` element.
  A claim of "it validates" without the command and its result is not evidence.
- A pack that needs a WingFoil feature not yet published declares the capability; it is not
  published until `compat.yaml` lists a released WingFoil that provides it, and it is never
  published against an unreleased WingFoil build.
