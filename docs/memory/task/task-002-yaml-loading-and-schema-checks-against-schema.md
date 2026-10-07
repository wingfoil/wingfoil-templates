---
id: task-002-yaml-loading-and-schema-checks-against-schema
type: task
title: "YAML loading and schema checks against schema/"
status: pending
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-001-typescript-set-up-build-test-runner-exact-pins-and-the-packs-line-ending-rule"]
tags: ["tooling","W5","F3.1"]
---

## Context

Task 2 of plan-015 (`sw-life-cycle` › `tooling`, wave W5, F3.1). Tooling task, no pack.

It comes from:
- **spec-001 §17 step 2:** the composer "validates every `pack.yaml`, and the files of this
  repository, against `schema/`"; §5 and §6 define what the schemas check, and §18 what they cannot;
- **spec-001 §11, §12, §14, §15:** `catalog.yaml`, `compat.yaml`, transitions and presets, with
  their schemas under `schema/` (the contract with WingFoil);
- **adr-003:** `yaml` 2.9.1 (source positions, duplicate keys) and `ajv` 8.20.0 (`Ajv2020`,
  `strict: true`, `allowUnionTypes: true`, no `ajv-formats`);
- **F3.1:** the one validation command runs the schema checks; it is assembled in task 7. This task
  delivers the loader and the schema check it will call.

Scope: loading YAML with positions, and checking files against the five schemas. Not in scope: the
§18 lint rules (task 9; the loader keeps the source text they need), the real `catalog.yaml`
(task 4, dl-010) and `compat.yaml` (task 8). The fixtures replace the 33 scratch samples of
plan-012, which were never committed.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test` and `npm run check:pins` exit 0; no dependency is added.
2. **Loader.** Tests show that loading a YAML file:
   - returns the data and keeps, for every value, its line and column and its source text
     (`format: 1.0` keeps `1.0`);
   - fails with `<file>:<line>:<column>` on a syntax error and on a duplicate key;
   - fails on a file that is not UTF-8, and on a multi-document file.
3. **Schemas.** A test compiles each of the five `schema/*.schema.json` with `Ajv2020` in strict
   mode, with no warning.
4. **Fixtures** under `tests/fixtures/schema/<kind>/valid/` and `invalid/`, one file each:
   - valid: the examples of spec-001 §6.2 (`pack.yaml`), §11 (`catalog.yaml`, with a full 64-hex
     digest), §12 (`compat.yaml`), §14 (transition) and §15 (preset), and a `base` `pack.yaml`;
   - invalid, at least: an axis that does not match the id; a missing `base` requirement; slot
     `operations`; an `axis` on `base`; a pre-release version; a `..` path; a `status` in
     `pack.yaml`; an `active` catalog pack without versions; a hand-written open range;
     `compat.yaml` without `format_key`; a missing `format`.

   Every valid fixture passes; every invalid fixture fails, and its test names the expected schema
   keyword and instance path.
5. **Errors** are reported as `<file>:<line>:<column>: <instance path> <message>`, the position
   being the offending value's, sorted by file, line and column.
6. **`npm run check:schemas`** checks every file of a known kind in the repository:
   `packs/**/pack.yaml`, `catalog.yaml`, `compat.yaml`, `presets/*.yaml`, `transitions/*.yaml`, read
   in sorted order. It exits 0 on this repository and prints how many files it checked (0 today).
   A test runs it on a temporary tree with one invalid file: exit 1 and the error line.
   Unreadable files exit 2.
7. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
