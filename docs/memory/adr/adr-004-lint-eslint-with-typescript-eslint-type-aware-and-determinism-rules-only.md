---
id: adr-004-lint-eslint-with-typescript-eslint-type-aware-and-determinism-rules-only
type: adr
title: "Lint: ESLint with typescript-eslint, type-aware and determinism rules only"
status: pending
tags: ["tooling","dependencies","lint"]
---

## Context

The `code-quality` directive asks that "the linter reports no errors". adr-003 chose the tooling
libraries and no linter, so after task-001 the only static check is `tsc` in strict mode with the
unused-code flags. `tsc` misses defects that matter for the composer (adr-001): promises left
unawaited, values typed `any` through casts or library returns, conditions that are always true.
It cannot enforce the `determinism` directive either: nothing stops `Date.now()` or
`Math.random()` in `src/`.

WingFoil lints with `eslint` 10 and `typescript-eslint` 8 (WingFoil2 `package.json`, read at
`ed4607a4`).

On 2026-10-07 the approver compared `tsc` alone with ESLint, and chose ESLint in a minimal form, set
up before the fragment merge (plan-015 task 5), so that the composer is written under lint.

Requirements implemented: the `code-quality` directive (linter), the `determinism` directive (no
wall-clock, no randomness in the tooling), adr-001 (a composer WingFoil's own lint accepts).

## Decision

**ESLint lints `src/` and `tests/`, with type-aware correctness rules and determinism rules, and
no style rules.**

| Package | Version |
|---|---|
| `eslint` | 10.12.0 |
| `@eslint/js` | 10.0.1 |
| `typescript-eslint` | 8.71.1 |

All three are development dependencies, pinned exact (adr-002); the runtime dependencies of
adr-003 do not change.

- **Rules:** `@eslint/js` `recommended`, and `typescript-eslint` `recommendedTypeChecked`, with the
  project service on `tsconfig.json`. No stylistic rule set and no formatter: layout is the
  reviewer's, as today.
- **Determinism rules in `src/`:** `Date.now()`, `new Date()` with no argument, `Math.random()`, and
  `performance.now()` are errors. Directory reads go through one sorted helper once the composer
  reads directories (its task names it).
- **Tests:** `describe` and `it` of `node:test` are known-safe calls for `no-floating-promises`
  (`allowForKnownSafeCalls`), rather than a `void` in front of each.
- **Script:** `npm run lint`, exit 0 with no error and no warning. It runs locally and in CI (task
  10), next to `build` and `test`.
- **The Node.js floor.** `eslint` 10 declares Node.js `^22.13.0`, above the floor of adr-002
  (22.12.0, WingFoil's), and `typescript-eslint` 8.71.1 does too through `eslint-visitor-keys` 5.
  The lint is static and its result does not depend on the Node.js running it, so it runs on the
  newest Node.js 22.x only. On the floor, `npm ci` prints `EBADENGINE` warnings for these
  development packages and exits 0; the build and the tests still run there. The floor stays
  WingFoil's.
- **Review.** Adding or upgrading these packages repeats the review of adr-003 (`security`
  directive).

**Trial** (plan-019, 2026-10-07, scratch clone of `main` at `ba4757d`):
- 85 packages added to the 104 of the lockfile (189 in all); `npm audit`: 0 vulnerabilities;
  registry signatures verified; licenses MIT;
- first run with `recommendedTypeChecked`: `src/` is clean; `tests/` has 17
  `no-floating-promises` errors, all on `describe` and `it`, which the known-safe-calls option
  covers.

## Alternatives

- **`tsc` only, with a decision-log reading the directive's "linter" as `tsc`.** Zero dependencies.
  Rejected by the approver: it leaves the type-aware defects and the determinism rules to review.
- **`eslint` 9.39.5.** Declares Node.js `>=21.1.0`, but `typescript-eslint` 8.71.1 still pulls
  `eslint-visitor-keys` 5 with `^22.13.0`, so the floor warning stays. Rejected: older than
  WingFoil's major, for no gain.
- **Raise the floor to 22.13.0.** Rejected: adr-002 ties the floor to WingFoil's.
- **A stylistic set or Prettier.** Rejected: a format to agree on and maintain, and diffs that
  change layout rather than behaviour.
- **Biome.** One binary, fast. Rejected: its type-aware rules are fewer, and WingFoil uses ESLint.

## Consequences

- A tooling task, before plan-015 task 5, adds the three packages, `eslint.config.mjs`, the `lint`
  script, the `dna.yaml` stack entries (version bump), and makes `npm run lint` pass on `src/` and
  `tests/`.
- From that task on, every tooling task's Acceptance includes `npm run lint`.
- The `tooling-delivery` review checks lint as part of `code-quality`.
- If `typescript-eslint` lags a TypeScript upgrade (for example to TypeScript 7), the upgrade waits
  for it or the lint is pinned to the previous TypeScript; that is decided in the upgrade's task.

## Execution Notes
