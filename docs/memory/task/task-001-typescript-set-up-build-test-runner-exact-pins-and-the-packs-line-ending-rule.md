---
id: task-001-typescript-set-up-build-test-runner-exact-pins-and-the-packs-line-ending-rule
type: task
title: "TypeScript set-up: build, test runner, exact pins and the packs line-ending rule"
status: backlog
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

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-06: amended while `pending`, before the approver's review, after an independent review
  of the task: dependencies split by field, the lockfile tracked, `dist/` ignored, tests under
  `tests/`, the npm floor, the `dna show` check, exact audit output, script names.
