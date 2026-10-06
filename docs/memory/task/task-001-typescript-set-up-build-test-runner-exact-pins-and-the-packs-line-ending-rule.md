---
id: task-001-typescript-set-up-build-test-runner-exact-pins-and-the-packs-line-ending-rule
type: task
title: "TypeScript set-up: build, test runner, exact pins and the packs line-ending rule"
status: pending
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

Run from a clean clone of the task branch.

1. `npm ci` exits 0; `package.json` lists exactly the dependencies of adr-003, plus the pinned
   `wingfoil` 0.2.2, every one as an exact version.
2. `npm run build` (`tsc`) exits 0 and writes only under `dist/`, which git ignores.
3. `npm test` runs the `node:test` suite on the compiled output and exits 0.
4. `npm run check:pins` exits 0 on this repository. Its tests cover at least: a range (`^`, `~`,
   `>=`, `*`, `x`, a tag such as `latest`) in any dependency field fails, naming the dependency; a
   lockfile entry whose version differs from `package.json` fails; a missing lockfile fails.
5. On the floor: with Node.js 22.12.0 installed in a local prefix
   (`N_PREFIX=$PWD/.cache/n n install 22.12.0`, `.cache/` is ignored), then
   `PATH=$PWD/.cache/n/bin:$PATH`, steps 1–4 pass and `node --version` prints `v22.12.0`.
6. `npm audit` reports 0 vulnerabilities.
7. `git check-attr text -- packs/x/pack.yaml` prints `text: unset`.
8. `npx wingfoil workflow list`, `dna show` and `directives list` exit 0 with empty stderr after
   the `dna.yaml` change, which has `version: 4`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
