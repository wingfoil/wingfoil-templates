---
id: task-001-typescript-set-up-build-test-runner-exact-pins-and-the-packs-line-ending-rule
type: task
title: "TypeScript set-up: build, test runner, exact pins and the packs line-ending rule"
status: in-review
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: []
tags: ["tooling","W5"]
---

## Context

First task of `sw-life-cycle` › `tooling` (plan-015, task 1, wave W5). Tooling task, no pack.

It comes from:
- **adr-002:** TypeScript on Node.js ≥ 22.12, compiled with `tsc`, every dependency pinned exact
  with a committed lockfile. Its Consequences name this task: "sets up `tsconfig`, the build, the
  test runner and the lockfile as its first tooling task";
- **adr-003:** `yaml` 2.9.1, `ajv` 8.20.0, `semver` 7.8.5; `typescript` 6.0.3, `@types/node`
  22.20.5, `@types/semver` 7.8.0; `node:test`. The Node.js floor (22.12.0, npm 10.9.0) is tested
  here, not only the local Node.js;
- **spec-001 §13 step 2:** `.gitattributes` disables line-ending conversion under `packs/`
  (`packs/** -text`), "the tooling phase adds it".

It ships no composer logic. It ends with an empty but working toolchain that the next tasks fill,
and with one real check, the exact-pin check that adr-002 requires.

Configuration change, sourced from this task once accepted: `dna.yaml` gains the `tooling` module
at `src` and `src` in `paths.sources` (version 3 → 4). It was left out of plan-018 because no
approved element fixed the path (plan-018 Execution Notes).

## Acceptance

Run from a clean clone of the task branch. The scripts are named `build`, `test` and `check:pins`.

1. `npm ci` exits 0. `package.json` pins every entry to an exact version:
   - `dependencies`: `yaml` 2.9.1, `ajv` 8.20.0, `semver` 7.8.5;
   - `devDependencies`: `typescript` 6.0.3, `@types/node` 22.20.5, `@types/semver` 7.8.0, `wingfoil`
     0.2.2;
   - `engines.node` stays `>=22.12.0`.

   `git ls-files package-lock.json` prints the file.
2. `npm run build` (`tsc`) exits 0 and compiles `src/` and the tests, which live under `tests/`
   (`dna.yaml` `paths.tests`), into `dist/`. Afterwards `git check-ignore -q dist/x` exits 0 and
   `git status --porcelain` prints nothing.
3. `npm test` runs `node --test` on the compiled tests, given as explicit globs, and exits 0.
4. `npm run check:pins` exits 0 on this repository. Its tests cover at least: a range (`^`, `~`,
   `>=`, `*`, `x`, a tag such as `latest`) in any dependency field fails, naming the dependency; a
   lockfile entry whose version differs from `package.json` fails; a missing lockfile fails.
5. On the floor. Prerequisite: `n` (here `/usr/local/bin/n`). With Node.js 22.12.0 installed in a
   local prefix (`N_PREFIX=$PWD/.cache/n n install 22.12.0`; `.cache/` is ignored), then
   `PATH=$PWD/.cache/n/bin:$PATH`: `node --version` prints `v22.12.0`, `npm --version` prints
   `10.9.0`, and steps 1–4 pass.
6. `npm audit` exits 0 and prints `found 0 vulnerabilities`; `npm audit signatures` exits 0.
7. `git check-attr text -- packs/x/pack.yaml` prints `packs/x/pack.yaml: text: unset`.
8. `dna.yaml` has `version: 4`; `npx wingfoil dna show` lists the module `tooling` at `src`, and
   `paths.sources` contains `src`. `npx wingfoil workflow list`, `dna show` and `directives list`
   exit 0 with empty stderr.

## Design

Branch `task/task-001-typescript-set-up-build-test-runner-exact-pins-and-the-packs-line-ending-rule`,
run through `tooling-delivery` as `developer` (`code-quality`, `testing`, `determinism`).

- **Module system: CommonJS, `module: Node16`,** as WingFoil (WingFoil2 `tsconfig.json`, no
  `"type": "module"`), so the composer can move there without a conversion (adr-001).
- **`tsconfig.json`:** `target` ES2022, `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`,
  `noUnusedParameters`, `exactOptionalPropertyTypes`, `rootDir: "."`, `outDir: "dist"`, `include:
  ["src", "tests"]`, `types: ["node"]`. Sources compile to `dist/src/`, tests to `dist/tests/`.
- **Scripts:**
  - `clean`: removes `dist/` with `node:fs` (no shell `rm`), so a build never keeps stale files;
  - `build`: `clean`, then `tsc -p tsconfig.json`;
  - `test`: `build`, then `node --test "dist/tests/**/*.test.js"`;
  - `check:pins`: `node dist/src/check-pins.js`.
- **`src/check-pins.ts`:** a pure function `checkPins(manifest, lockfile)` returning a sorted list
  of problems, and a small `main` that reads `package.json` and `package-lock.json` from the
  working directory, prints the problems and exits 1 if there are any (2 if a file is missing or
  not JSON).
  - Exact means `MAJOR.MINOR.PATCH` with no range operator, wildcard, tag or URL; an npm alias
    `npm:<name>@<exact>` is accepted, since the compatibility matrix (task 8) may pin several
    WingFoil releases that way.
  - Fields checked: `dependencies`, `devDependencies`, `optionalDependencies`,
    `peerDependencies`.
  - Each direct dependency's `node_modules/<name>` entry in the lockfile must have the same
    version.
- **Tests:** `tests/check-pins.test.ts`, red first for each rule in Acceptance 4, plus the happy
  path and the real repository's files.
- **Static checks:** `tsc` in strict mode with the unused-code flags is the only static check. The
  `code-quality` directive mentions a linter; adr-003 chose none, and adding ESLint would be a new
  dependency set needing its own review. Recorded for the approver, not added here.
- **`.gitattributes`:** `packs/** -text` (spec-001 §13). **`.gitignore`:** `dist/`.
- **`dna.yaml` (3 → 4):** module `tooling` at `src` ("the reference composer and the validation
  command, adr-001, adr-002"), and `src` in `paths.sources`.
- **Floor run:** Acceptance 5 is run with `n`; the results go in the Execution Notes.

## Execution Notes

- 2026-10-06: amended while `pending`, before the approver's review, after an independent review
  of the task: dependencies split by field, the lockfile tracked, `dist/` ignored, tests under
  `tests/`, the npm floor, the `dna show` check, exact audit output, script names.
- 2026-10-06/07, build on the task branch, as `developer`:
  - `d963eff` `.gitattributes`; `e1671fe` toolchain and `check:pins`; `38803e0` `dna.yaml` v4;
    `9a2fabc` and `4687218` review fixes.
  - Red first: with a stub `checkPins`, 51 of 54 tests failed; the implementation made them pass.
    The stub was never committed, so the red run is recorded here only.
  - Acceptance 1–8 pass from a clean clone of the branch at `4687218`, on Node.js 22.21.0 / npm
    11.6.2 and on the floor, Node.js 22.12.0 / npm 10.9.0 installed with `n` in `.cache/n`: 62 tests
    pass, `check:pins` exits 0, `npm audit` finds 0 vulnerabilities and `audit signatures` exits 0,
    `packs/x/pack.yaml: text: unset`, the three WingFoil commands exit 0 with empty stderr.
    `npm ci` with npm 10.9.0 accepts the lockfile written by npm 11.
- Deviations from the Design, all small:
  - `tsconfig.json` also sets `lib`, `moduleResolution: Node16`, `forceConsistentCasingInFileNames`
    and `skipLibCheck`, as WingFoil does. `skipLibCheck` skips type errors inside `@types`; the
    pinned versions compile clean either way;
  - `check:pins` prints its problems on stderr, and needs a prior `npm run build`, like every
    script running `dist/`;
  - prereleases and build metadata (`1.2.3-rc.1`, `1.2.3+b`) are refused on purpose: exact means
    `MAJOR.MINOR.PATCH`, the form `pack-semver` allows too;
  - `runCheckPins` exits 2 on a `package.json` that is not an object and on a lockfile without
    `packages` (lockfileVersion 1), so that malformed input never passes.
- **Linter, for the approver.** The `code-quality` directive asks that "the linter reports no
  errors". adr-003 chose no linter, so `tsc` strict with the unused-code flags is the only static
  check. Adding ESLint means a new dependency set with its own security review: an amendment of
  adr-003 or a new ADR, if the approver wants it.
- Review (a subagent with its own context, `tooling-delivery` › `review`): approve with four
  should-fix (input validation, a test tied to the working directory, missing edge-case tests, the
  prerelease rule) and nits; all should-fix applied in `9a2fabc`, the wrapping in `4687218`.
