---
id: determinism
name: determinism
type: directive
kind: custom
title: "Determinism"
---

# Determinism

The same packs, versions and parameters must produce byte-identical files.

- No wall-clock, randomness or filesystem-dependent ordering in pack content or in the tooling that
  composes and validates it.
- Prefer declared configuration (pack.yaml parameters with defaults) over inference.
- Pin every tool used in validation to an exact version (the WingFoil CLI is pinned in
  `package.json`).
