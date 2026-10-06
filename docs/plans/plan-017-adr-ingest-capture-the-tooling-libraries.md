---
id: plan-017-adr-ingest-capture-the-tooling-libraries
type: plan
title: "adr-ingest capture: the tooling libraries"
status: active
workflow: "adr-ingest"
phase: "capture"
tags: ["architecture","adr","tooling"]
---

## Context

The `capture` phase of `adr-ingest`, run as architect from step 1 of plan-015 (`sw-life-cycle` ›
`tooling`). adr-002 fixes the language (TypeScript on Node.js ≥ 22.12, `tsc`, exact pins) and leaves
the libraries to the tooling tasks. They are chosen once, before task 1 sets up the build, because
they shape the composer that adr-001 proposes to WingFoil.

The approver agreed on 2026-10-06 that the ADR is captured with the recommendations presented with
plan-015, the alternatives staying recorded. The `security` directive asks for a vulnerability
review of every dependency before it is added. The `approve` phase that follows is the approver's.

## Steps

1. Review the candidates in a scratch directory: versions, licenses, transitive dependencies,
   `npm audit`, `npm audit signatures`; check the properties the specification needs (spec-001 §18:
   telling `1.0` from `1`; duplicate keys; the five schemas compile in strict mode).
2. `npx wingfoil memory add --type adr --title "…"`, which creates adr-003 as `draft`.
3. Write Context, Decision, Alternatives and Consequences, with the requirements it implements and
   the review's results.
4. Commit the body by hand, with the Co-Authored-By trailer, before `submit` (notes N13).
5. `npx wingfoil memory submit <id>` (`draft → pending`).

## Handoff

- **claude:** steps 1–5.
- **Approver:** the `approve` phase, in the chained command handed with plan-015 step 1.
- A rejected ADR comes back to `draft`, is corrected under this plan and submitted again. The plan
  stays `active` until adr-003 is approved.

## Execution Notes

- 2026-10-06, step 1, in a scratch directory (Node.js 22.21.0, npm 11.6.2): `yaml` 2.9.1, `ajv`
  8.20.0, `semver` 7.8.5, `typescript` 6.0.3, `@types/node` 22.20.5, `@types/semver` 7.8.0.
  - `npm audit`: 0 vulnerabilities; `npm audit signatures`: 11 verified registry signatures, one
    verified attestation.
  - Runtime tree: 7 packages (`yaml` and `semver` have no dependencies; `ajv` brings four).
  - `yaml` keeps the source text of a scalar (`1.0` reads as the number 1 with source `1.0`) and
    reports duplicate keys (`DUPLICATE_KEY`). Ajv2020 (`strict`, `allowUnionTypes`) compiles the
    five schemas. No schema uses the `format` keyword, so `ajv-formats` is not needed.
- 2026-10-06: adr-003 filled and submitted (`b083d4a`, `54b74cc`), `pending`. Its "about three
  hundred packages" for `jest` was checked afterwards in a scratch directory: `jest` 30 installs 316
  packages. Feedback note T15 names adr-003 and the `yaml`/`js-yaml` difference (uncommitted).
- 2026-10-06: adr-003 amended while `pending` at the approver's request, after the independent
  review (plan-015); the same reviewer re-reviewed the amendment and approved it.
