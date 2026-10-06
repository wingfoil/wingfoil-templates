---
id: adr-002-repository-tooling-in-typescript-on-node.js-22.12-or-later
type: adr
title: "Repository tooling in TypeScript on Node.js 22.12 or later"
status: approved
tags: ["tooling"]
---

## Context

The repository tooling is:
- the reference composer (adr-001);
- the one validation command: schema checks, composition, the compatibility matrix, determinism;
- the lint rules;
- CI.

`dna.yaml` already declares Node.js ≥ 22.12, and `package.json` pins the WingFoil CLI 0.2.2 as a
devDependency. WingFoil itself is TypeScript on Node.js ≥ 22.12, compiled with `tsc` (WingFoil2
`package.json`, read at `7f13f77f`).

The features review asked which language the tooling uses (`06_features.md`, open question 2). The
approver ruled on 2026-10-06: TypeScript on Node.js ≥ 22.12, as WingFoil. dl-005's Execution Notes
route that ruling to an ADR.

Requirements implemented: F3.1–F3.6 (validation tooling), and adr-001, which proposes the composer
to WingFoil.

## Decision

**The repository tooling is written in TypeScript and runs on Node.js ≥ 22.12, as WingFoil.**

- **Same toolchain as WingFoil.** One runtime and one language across the two repositories. The
  composer can then move into WingFoil, or become a package WingFoil depends on (adr-001), without
  a rewrite.
- **Compiled.** The sources are compiled with `tsc` and run as JavaScript. Node.js 22.12 runs
  TypeScript only behind an experimental flag, so the tooling does not rely on it.
- **Pinned.** Every dependency is pinned to an exact version and a lockfile is committed
  (`determinism` directive), as the WingFoil CLI already is.
- **The schemas stay JSON Schema 2020-12.** The tooling validates the files of this repository
  against `schema/*.schema.json`, the contract with WingFoil. They are not rewritten as TypeScript
  types or as a runtime schema library.

The libraries (YAML parser, JSON Schema validator, test runner) are chosen by the tooling tasks.
They are not fixed here.

## Alternatives

- **Shell scripts around the WingFoil CLI.** Rejected: fragment merge and digests need a real
  language, and shell tooling cannot be offered to WingFoil.
- **Another language (Python, Go).** Rejected: a second runtime in CI, and a composer WingFoil
  cannot adopt as it is.

## Consequences

- The tooling phase (sequencer M1) sets up `tsconfig`, the build, the test runner and the lockfile
  as its first tooling task.
- `package.json` gains the tooling's dependencies, all pinned exact.
- The Node.js floor follows WingFoil's. If WingFoil raises it, this repository follows in a tooling
  change (`tooling-change`).

## Execution Notes
