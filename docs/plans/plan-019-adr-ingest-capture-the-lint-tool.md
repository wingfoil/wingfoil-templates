---
id: plan-019-adr-ingest-capture-the-lint-tool
type: plan
title: "adr-ingest capture: the lint tool"
status: active
workflow: "adr-ingest"
phase: "capture"
tags: ["architecture","adr","tooling"]
---

## Context

The `capture` phase of `adr-ingest`, run as architect from plan-015 (`sw-life-cycle` › `tooling`).
task-001 found that the `code-quality` directive asks that "the linter reports no errors", while
adr-003 chose no linter. On 2026-10-07 the approver weighed `tsc` alone against ESLint and chose
ESLint "in minimal form, as recommended": type-aware rules and determinism rules, no style rules,
set up in a task before the fragment merge (plan-015 task 5).

The `approve` phase that follows is the approver's.

## Steps

1. Trial in a scratch clone of `main`, on the Node.js floor 22.12.0 and on the current Node.js:
   versions, engines, transitive packages, `npm audit`, `npm audit signatures`, a first run on
   `src/` and `tests/`.
2. `npx wingfoil memory add --type adr --title "…"`, which creates adr-004 as `draft`.
3. Write Context, Decision, Alternatives and Consequences, with the trial's results.
4. Commit the body by hand, with the Co-Authored-By trailer, before `submit` (notes N13).
5. `npx wingfoil memory submit <id>` (`draft → pending`).

## Handoff

- **claude:** steps 1–5.
- **Approver:** the `approve` phase.
- A rejected ADR comes back to `draft`, is corrected under this plan and submitted again.

## Execution Notes

- 2026-10-07, step 1 (scratch clone of `main` at `ba4757d`):
  - `eslint` 10.12.0, `@eslint/js` 10.0.1, `typescript-eslint` 8.71.1 (peer `typescript >=4.8.4
    <6.1.0`, so 6.0.3 is supported): 85 packages on top of the current 104 (189 in all, counted in
    the lockfile); `npm audit` 0 vulnerabilities; registry signatures verified.
  - `eslint` 10 declares Node.js `^20.19.0 || ^22.13.0 || >=24`, and `typescript-eslint` 8.71.1
    pulls `eslint-visitor-keys` 5.0.1 with the same range, so even `eslint` 9.39.5 gives an
    `EBADENGINE` warning on 22.12.0. With `eslint` 9.39.5 on Node.js 22.12.0, `npm ci` warns but
    exits 0, and the lint runs.
  - First run with `recommendedTypeChecked`: 17 errors, all `no-floating-promises` on the
    `describe` and `it` calls of `node:test`; `src/` is clean.
  - The repository run was repeated with the decided versions (`eslint` 10.12.0): same result,
    `src/` clean, 17 `no-floating-promises` errors in `tests/`.
- 2026-10-07: adr-004 filled and submitted, `pending`. The package count was corrected from "about
  95" to 85 right after submit, before the approver's review.
- 2026-10-07: an independent review approved adr-004 with two should-fix, applied while `pending`
  before the approver's review: the floor claim, now tried with `eslint` 10.12.0 on Node.js 22.12.0
  / npm 10.9.0 (`npm ci` warns `EBADENGINE` and exits 0; build, 62 tests and the lint of `src/`
  pass), and `--max-warnings 0`.
