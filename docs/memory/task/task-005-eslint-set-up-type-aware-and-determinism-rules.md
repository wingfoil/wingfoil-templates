---
id: task-005-eslint-set-up-type-aware-and-determinism-rules
type: task
title: "ESLint set-up: type-aware and determinism rules"
status: pending
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

Run from a clean clone of the task branch. No `.npmrc` and no `engine-strict` setting is added:
adr-004's floor argument depends on it.

1. `package.json` `devDependencies` gain exactly `eslint` 10.12.0, `@eslint/js` 10.0.1 and
   `typescript-eslint` 8.71.1; the lockfile is committed; `npm run check:pins` exits 0;
   `npm audit` reports 0 vulnerabilities, `npm audit signatures` exits 0, and the licenses of the
   added tree are listed in the Execution Notes (adr-004 repeats adr-003's review).
2. `eslint.config.mjs` holds adr-004's rule sets and options, and only these additions, which a
   working configuration needs: `no-restricted-imports` for the named imports of the determinism
   forms; `disableTypeChecked` for `*.mjs` files, which `tsconfig.json` does not include; the
   `tests/**` override for the known-safe calls. No stylistic rule, no formatter. It ignores
   `dist/`, `node_modules/`, `.cache/` and `tests/fixtures/`.
3. `scripts.lint` is exactly `eslint --max-warnings 0 .`. On Node.js 22.21: `npm run lint` exits 0
   on the repository; `npm run build`, `npm test`, `npm run check:schemas` exit 0. A test shows that
   a probe raising only a warning makes the lint fail.
4. **Determinism rules:** a test lints a probe text as if it were `src/probe.ts`, through the ESLint
   Node API and this repository's configuration, overriding only
   `parserOptions.projectService.allowDefaultProject` (the probe is not on disk). The probe holds
   `Date.now()`, `new Date()`, `Date()`, `Math.random()`, `performance.now()`, `process.hrtime()`,
   `process.hrtime.bigint()`, `crypto.randomUUID()`, `crypto.randomBytes()`, and the named imports
   `randomUUID` and `randomBytes` from `node:crypto`, `hrtime` from `node:process`, `performance`
   from `node:perf_hooks`. Each form's line gets at least one determinism error, and no other rule
   reports. `new Date(0)` and `createHash` from `node:crypto` get none. The same probe as
   `tests/probe.ts` gets no determinism error. Not caught, and recorded:
   `globalThis.crypto.randomUUID()`.
5. **Known-safe calls:** in a probe as `tests/probe.test.ts`, `describe` and `it` of `node:test`
   raise no `no-floating-promises`, and another unawaited promise does.
6. **Floor:** on Node.js 22.12.0 / npm 10.9.0, `npm ci` exits 0 (its `EBADENGINE` warnings are
   recorded in the Execution Notes), and `npm run build`, `npm test`, `npm run check:pins` exit 0.
   `npm test` there runs the probe tests on ESLint below its declared engine; adr-004's trial found
   that it works, and the lint itself is run on the newest Node.js 22.x.
7. `dna.yaml` has `version: 5` and lists ESLint 10.12.0 and `typescript-eslint` 8.71.1;
   `npx wingfoil workflow list`, `npx wingfoil dna show` and `npx wingfoil directives list` exit 0
   with empty stderr.
8. Existing code changes only where a rule reports a real defect; each such change is listed in the
   Execution Notes. No rule is disabled inline.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review
  that tried the probe approach on ESLint 10.12.0: `allowDefaultProject` through `overrideConfig`,
  named imports caught by `no-restricted-imports`, the configuration additions a working setup
  needs, the exact lint script, the license check, the floor note, the full commands.
