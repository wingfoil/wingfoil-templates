---
id: task-005-eslint-set-up-type-aware-and-determinism-rules
type: task
title: "ESLint set-up: type-aware and determinism rules"
status: draft
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-004-pack-resolution-ranges-requires-and-conflicts-cardinalities-slots-inventories-order-real-catalog"]
tags: ["tooling","W5","lint"]
---

## Context

Task 4b of plan-015 (`sw-life-cycle` › `tooling`), inserted on 2026-10-07 between task 4 and task
5 so that the fragment merge is written under lint. Tooling task, no pack. Its element id is
task-005, the next free number; the plan's numbering (4b) is the backlog position.

It comes from:
- **adr-004:** `eslint` 10.12.0, `@eslint/js` 10.0.1, `typescript-eslint` 8.71.1, development
  dependencies pinned exact; `@eslint/js` `recommended` and `typescript-eslint`
  `recommendedTypeChecked` with the project service; determinism rules in `src/` (`Date.now()`,
  `new Date()` and `Date()` with no argument, `Math.random()`, `performance.now()`,
  `process.hrtime`, `crypto.randomUUID`, `crypto.randomBytes`); `describe` and `it` of `node:test`
  as known-safe calls; no style rules; `npm run lint` is `eslint --max-warnings 0 .`; the lint runs
  on the newest Node.js 22.x, and on the floor `npm ci` warns `EBADENGINE` and exits 0;
- **the `code-quality` directive:** "the linter reports no errors";
- **the `determinism` directive:** no wall-clock or randomness in the tooling.

Configuration change, sourced from adr-004 and this task: `dna.yaml` `stacks.technologies` gains
ESLint and `typescript-eslint` (version 4 → 5).

## Acceptance

Run from a clean clone of the task branch.

1. `package.json` `devDependencies` gain exactly `eslint` 10.12.0, `@eslint/js` 10.0.1 and
   `typescript-eslint` 8.71.1; the lockfile is committed; `npm run check:pins` exits 0;
   `npm audit` reports 0 vulnerabilities and `npm audit signatures` exits 0.
2. `eslint.config.mjs` holds the rule sets and options of adr-004 and nothing else: no stylistic
   rule, no formatter. It ignores `dist/`, `node_modules/`, `.cache/` and `tests/fixtures/`.
3. On Node.js 22.21: `npm run lint` exits 0 on the repository, with no error and no warning;
   `npm run build`, `npm test`, `npm run check:schemas` exit 0.
4. **Determinism rules:** a test lints a probe source as if it were under `src/`, through the
   ESLint Node API and this repository's configuration, and gets one error for each of the eight
   forms of adr-004; the same probe as if under `tests/` gets none of them.
5. **Known-safe calls:** `describe` and `it` of `node:test` raise no `no-floating-promises`, and
   another unawaited promise in a test file does (a probe, as in 4).
6. **Floor:** on Node.js 22.12.0 / npm 10.9.0, `npm ci` exits 0 (its `EBADENGINE` warnings are
   recorded in the Execution Notes), and `npm run build`, `npm test`, `npm run check:pins` exit 0.
7. `dna.yaml` has `version: 5` and lists ESLint 10.12.0 and `typescript-eslint` 8.71.1;
   `npx wingfoil workflow list`, `dna show` and `directives list` exit 0 with empty stderr.
8. Existing code changes only where a rule reports a real defect; each such change is listed in the
   Execution Notes. No rule is disabled inline.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
