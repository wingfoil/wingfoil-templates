---
id: adr-003-tooling-libraries-yaml-ajv-semver-and-the-node.js-test-runner
type: adr
title: "Tooling libraries: yaml, Ajv, semver and the Node.js test runner"
status: draft
tags: ["tooling","dependencies"]
---

## Context

adr-002 fixes the tooling language (TypeScript on Node.js ≥ 22.12, compiled with `tsc`, every
dependency pinned exact with a committed lockfile) and leaves the libraries to the tooling tasks.
Task 1 of plan-015 sets up the build, so they are chosen now. They matter beyond this repository:
adr-001 proposes the composer to WingFoil, so what it depends on becomes WingFoil's question too.

What the tooling needs from them:
- **YAML:** parse every file of this repository and of a pack; tell `1.0` from `1`, which spec-001
  §18 requires and JSON Schema cannot (`format` and integer values); reject duplicate keys; keep key
  order for the merge (§7.2); write composed files deterministically, UTF-8 and `LF` (§17 step 6).
- **JSON Schema 2020-12:** validate against `schema/*.schema.json`, the contract with WingFoil,
  unchanged (adr-002).
- **Semver:** compare versions and evaluate the range subset of spec-001 §6.3.
- **Tests:** a deterministic runner with no reliance on the network or the clock (`testing`
  directive).

WingFoil (WingFoil2 `package.json`, read at `ed4607a4`) uses `js-yaml`, `zod`, `jest` and
TypeScript 6.

Requirements implemented: F3.1–F3.5, spec-001 §6.3, §7, §17, §18; the `security`, `determinism` and
`testing` directives.

## Decision

**Runtime dependencies:**

| Library | Version | Use |
|---|---|---|
| `yaml` | 2.9.1 | Parsing with source positions and source text, duplicate-key errors, deterministic output. |
| `ajv` | 8.20.0 | `Ajv2020`, `strict: true`, `allowUnionTypes: true`, as plan-012 checked the schemas. No `ajv-formats`: no schema uses `format`. |
| `semver` | 7.8.5 | Version parsing and comparison, and range satisfaction. |

**Development dependencies:** `typescript` 6.0.3, `@types/node` 22.20.5, `@types/semver` 7.8.0.

**Test runner:** `node:test` and `node:assert`, built into Node.js 22. No test library.

Rules:
- Every version is pinned exact in `package.json` and locked in `package-lock.json` (adr-002).
- **The range subset is parsed by the tooling, not by `semver`.** spec-001 §6.3 allows carets,
  tildes, exact versions and space-separated comparators, and forbids `||`, hyphen ranges, `x`
  wildcards and pre-releases. The tooling rejects anything outside the subset first, then hands the
  range to `semver` to evaluate. `semver` alone would accept the forbidden forms.
- **No CLI framework.** The few commands of the tooling (`compose`, `validate`, `digest`, …) parse
  their arguments with `node:util` `parseArgs`.
- Adding, removing or upgrading a dependency is a tooling change that repeats the review below
  (`security` directive), and updates `dna.yaml` `stacks.technologies`.

**Vulnerability review** (plan-017, 2026-10-06, Node.js 22.21.0, npm 11.6.2):
- `npm audit`: 0 vulnerabilities;
- `npm audit signatures`: 11 packages with verified registry signatures, one verified attestation;
- runtime tree: 7 packages. `yaml` and `semver` have no dependencies; `ajv` brings
  `fast-deep-equal`, `fast-uri`, `json-schema-traverse` and `require-from-string`;
- licenses: ISC (`yaml`, `semver`), MIT (`ajv` and its dependencies), Apache-2.0 (`typescript`),
  all compatible with this repository's MIT;
- checked behaviour: `yaml` reads `format: 1.0` as the number 1 with source text `1.0`, and reports
  `DUPLICATE_KEY`; Ajv2020 compiles the five schemas in strict mode.

## Alternatives

- **`js-yaml` (WingFoil's parser).** Rejected: it returns `1.0` as the number 1 with no trace of the
  source, so the §18 check is impossible, and it has no source positions for lint messages. Using
  the same parser as WingFoil would ease adoption of the composer (adr-001). The difference is
  reported to WingFoil in feedback note T15, since a composer moving into WingFoil brings `yaml`
  with it.
- **`jest` (WingFoil's runner).** Rejected: about three hundred packages in the development tree,
  for features `node:test` covers. Aligning with WingFoil does not matter for tests, which do not
  move with the composer.
- **`vitest`.** Rejected for the same reason.
- **`zod` (WingFoil's runtime schemas).** Rejected by adr-002: the contract stays JSON Schema
  2020-12.
- **`@hyperjump/json-schema`.** A complete 2020-12 implementation, but Ajv is the validator the
  schemas were checked with in plan-012, and is the most used.
- **TypeScript 7.0.2**, the latest release (published 2026-10-06), a native port distributed as
  platform binaries. Rejected for now: WingFoil uses 6.x, and 7.0 is days old. Moving to 7 is a
  later tooling change.
- **`@types/node` 26.x.** Rejected: the types must match the Node.js floor, 22.

## Consequences

- `package.json` gains three runtime and three development dependencies, all exact; the lockfile is
  committed in task 1 of plan-015.
- The composer's dependencies are `yaml`, `ajv` and `semver`. If WingFoil adopts it (adr-001), it
  either takes `yaml` or rewrites the §18 integer check; feedback note T15 says so.
- `dna.yaml` `stacks.technologies` declares TypeScript and these libraries in the configuration
  follow-ups of plan-015 step 2, with a `version:` bump.
- Upgrades follow the same review, as tooling changes (`tooling-change`).

## Execution Notes
