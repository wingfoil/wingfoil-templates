---
id: task-005-eslint-set-up-type-aware-and-determinism-rules
type: task
title: "ESLint set-up: type-aware and determinism rules"
status: done
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

Branch `task/task-005-eslint`, run through `tooling-delivery` as `developer` (`code-quality`,
`testing`, `determinism`).

- **`eslint.config.mjs`,** with `defineConfig` from `eslint/config`:
  - ignores `dist/`, `node_modules/`, `.cache/`, `tests/fixtures/`;
  - `@eslint/js` `recommended` and `typescript-eslint` `recommendedTypeChecked`, with
    `parserOptions.projectService: true` and `tsconfigRootDir`;
  - `src/**/*.ts`: the determinism rules, as `no-restricted-properties` (`Date.now`, `Math.random`,
    `performance.now`, `process.hrtime`, `crypto.randomUUID`, `crypto.randomBytes`),
    `no-restricted-syntax` (`Date` called or constructed with no argument) and
    `no-restricted-imports` (the same names from `node:crypto`, `crypto`, `node:process`,
    `node:perf_hooks`), each with a message citing the `determinism` directive;
  - `tests/**/*.ts`: `no-floating-promises` with `allowForKnownSafeCalls` for `describe` and `it`
    of `node:test`;
  - `**/*.mjs`: `disableTypeChecked`.
- **`package.json`:** the three packages pinned exact; `scripts.lint` is
  `eslint --max-warnings 0 .`.
- **`tests/lint.test.ts`:** the ESLint Node API with the repository's configuration, overriding only
  `projectService.allowDefaultProject` for the probe paths; the probes are inline strings. A warning
  probe uses a rule set to `warn` through the same override, run through the `--max-warnings 0`
  logic (the CLI's exit code), by spawning `eslint` on a temporary file outside the repository with
  the configuration given by `--config`.
- **Defects the lint finds** in the existing code are fixed in their own commit, each named in the
  Execution Notes.
- **`dna.yaml`** 4 → 5: ESLint and `typescript-eslint` in `stacks.technologies`.

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review
  that tried the probe approach on ESLint 10.12.0: `allowDefaultProject` through `overrideConfig`,
  named imports caught by `no-restricted-imports`, the configuration additions a working setup
  needs, the exact lint script, the license check, the floor note, the full commands.
- 2026-10-07, build on `task/task-005-eslint`, as `developer`: `6930f1e` ESLint, `a68c2cb`
  `dna.yaml` 5, `d249486` review fixes.
  - The existing code passed the lint unchanged: no code fix (Acceptance 8). 27 files are linted.
  - The probe tests were written after the configuration: they are characterization tests, not
    red-first. Their strength was checked by mutation instead (below).
  - Acceptance 1–8 pass from a clean clone at `d249486`: on Node.js 22.21.0 / npm 11.6.2, `npm ci`,
    build, 240 tests, `lint`, `check:pins`, `check:schemas`, `npm audit` (0) and `audit signatures`
    pass; on the floor 22.12.0 / npm 10.9.0 the same, `npm ci` exiting 0 with `EBADENGINE`
    warnings for `eslint` 10.12.0, `@eslint/js` 10.0.1, `@eslint/config-array` 0.23.5,
    `@eslint/config-helpers` 0.7.0, `@eslint/core` 1.2.1, `@eslint/object-schema` 3.0.5,
    `@eslint/plugin-kit` 0.7.3, `eslint-scope` 9.1.2, `eslint-visitor-keys` 5.0.1, `espree` 11.2.0.
    The lint also runs there. No `.npmrc` is added.
  - The 85 added packages: MIT 63, Apache-2.0 12, BSD-2-Clause 6, BSD-3-Clause 1, ISC 2,
    BlueOak-1.0.0 1 (`minimatch`), all permissive and compatible with this repository's MIT.
  - Not caught, as recorded in the Acceptance: `globalThis.crypto.randomUUID()`.
- Deviations from the Design: none beyond the review fixes; the configuration also covers `.mts`
  and `.cts`, and lints every `.js`, `.mjs` and `.cjs` file without type information.
- Review (a subagent with its own context): approve with two should-fix: the determinism test
  passed with the rules set to `warn`, and `.mts`/`.cts` files would escape them. Both fixed in
  `d249486`, with a probe for the bare `crypto` path and a test linting `eslint.config.mjs`. The
  re-review confirmed that each surviving mutation (rules at `warn`, the bare path removed,
  `disableTypeChecked` removed) now fails a test.
- 2026-10-07: approved by the approver; merged into `main` with `--no-ff` (`f1040d3`); on `main` `npm ci`, the 240 tests and `npm run lint` pass.
