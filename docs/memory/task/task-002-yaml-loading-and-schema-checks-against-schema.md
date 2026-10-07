---
id: task-002-yaml-loading-and-schema-checks-against-schema
type: task
title: "YAML loading and schema checks against schema/"
status: in-review
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
   mode and `allErrors`, capturing Ajv's `logger.warn`: no warning is logged.
4. **Fixtures** under `tests/fixtures/schema/<kind>/valid/` and `invalid/`, one file each:
   - valid: the examples of spec-001 §6.2 (`pack.yaml`), §11 (`catalog.yaml`, with a full 64-hex
     digest), §12 (`compat.yaml`), §14 (transition) and §15 (preset), and a `base` `pack.yaml`;
   - invalid, at least: an axis that does not match the id; a missing `base` requirement; slot
     `operations`; an `axis` on `base`; a pre-release version; a `..` path in a catalog
     `packs[].path`; a `status` in `pack.yaml`; an `active` catalog pack without versions; a
     hand-written open range; `compat.yaml` without `format_key`; a missing `format`.

   Every valid fixture passes. Every invalid fixture fails, and its test checks that the expected
   (schema keyword, instance path) pair is among the reported errors. The `if` meta-error that Ajv
   adds next to a failing `then` is folded into the error that caused it.
5. **Errors** are reported as `<file>:<line>:<column>: <instance path> <message>`, sorted by file,
   line and column. The position is the offending value's; for an error about a missing or extra
   key (`required`, `additionalProperties`), the mapping's; for an error at the root, `1:1`.
6. **`npm run check:schemas`** checks every file of a known kind in the repository:
   `packs/**/pack.yaml`, `catalog.yaml`, `compat.yaml`, `presets/*.yaml`, `transitions/*.yaml`, read
   in sorted order. It exits 0 on this repository and prints how many files it checked (0 today).
   Exit codes: 0 when every file passes; 1 when a file has a YAML syntax error, a duplicate key or
   a schema error; 2 when a file cannot be read or is not UTF-8. Tests run it on temporary trees:
   one invalid file gives exit 1 and the error line; a `catalog.yaml` that is a directory gives
   exit 2.
7. `npm audit` reports 0 vulnerabilities.

## Design

Branch `task/task-002-yaml-loading-and-schema-checks-against-schema`, run through
`tooling-delivery` as `developer` (`code-quality`, `testing`, `determinism`).

- **`src/yaml-load.ts`:**
  - `parseYaml(text, file)`: `parseAllDocuments` with `uniqueKeys: true` and a `LineCounter`. More
    than one document, or any parse error, throws a `YamlError` carrying file, line, column and a
    message; the first error, by position, is reported. Returns the `Document` (nodes, ranges and
    source text kept) and its plain data (`toJS()`).
  - `loadYamlFile(path)`: reads bytes, decodes with `TextDecoder('utf-8', { fatal: true })`; a
    decode failure is an encoding error (exit 2 in the command), a read failure an I/O error (exit
    2).
  - `positionOf(doc, lineCounter, pointer, { key })`: walks the JSON pointer through the document's
    nodes and returns the value's line and column, or, for key errors, the enclosing mapping's;
    the root, or a path it cannot walk, gives `1:1`.
- **`src/schemas.ts`:** one `Ajv2020` instance (`strict: true`, `allowUnionTypes: true`,
  `allErrors: true`, a `logger` whose warnings are collected), the five schemas read from `schema/`
  next to the package, compiled once. `validate(kind, data)` returns Ajv's errors with the `if`
  meta-errors dropped (the `then` error that caused each stays).
- **`src/check-schemas.ts`:** `findFiles(root)` lists `catalog.yaml`, `compat.yaml`,
  `packs/**/pack.yaml`, `presets/*.yaml`, `transitions/*.yaml`, sorting every directory listing, so
  the order never depends on the filesystem. `runCheckSchemas(root)` loads and validates each file
  and returns `{ code, messages, checked }`, messages formatted `<file>:<line>:<column>: <instance
  path> <keyword>: <message>` with the file relative to the root and sorted. `main` prints the
  messages on stderr and `checked N files` on stdout; script `check:schemas`.
- **Exit code:** the highest reached: 2 for an I/O or encoding error, otherwise 1 for a YAML or
  schema error, otherwise 0.
- **Tests,** red first: `tests/yaml-load.test.ts`, `tests/schemas.test.ts`,
  `tests/check-schemas.test.ts`, with the fixtures under
  `tests/fixtures/schema/<kind>/{valid,invalid}/` and, for invalid ones, the expected (keyword,
  instance path) in a `# expect: <keyword> <path>` first-line comment, read by the test.
- **Ajv import:** `ajv/dist/2020`, a CommonJS module, imported by its `default` export, as `tsc`
  compiles it under `module: Node16`.

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review
  (plan-015): `allErrors` and the captured Ajv warnings; the expected error is checked among all
  errors, with `if` meta-errors folded; positions of key and root errors; exit codes, and a
  deterministic unreadable case; the `..` case placed in the catalog. The review checked that every
  spec-001 example passes the schemas and every listed invalid case fails them.
- 2026-10-07, build on the task branch, as `developer`: `b5027ff` loader, `726a0c2` schemas and
  fixtures, `dd53a19` `check:schemas`, `638b823` review fixes.
  - Red first: with stubs, 18 of the new tests failed (the schema file failed as a whole, since
    `loadSchemas` threw at load); the implementation made them pass. Stubs never committed.
  - Fixtures: the spec-001 examples verbatim (the §11 digest made a full 64-hex value), a `base`
    `pack.yaml`, and fifteen invalid files: the eleven of Acceptance 4, plus a missing `format` for
    each of the five kinds. Each invalid file states its expected (keyword, path) on line 1.
  - Acceptance 1–7 pass from a clean clone at `638b823` on Node.js 22.21.0 / npm 11.6.2 and on the
    floor 22.12.0 / npm 10.9.0: 110 tests pass (none skipped), `check:pins` 0, `check:schemas`
    0 with `checked 0 files`, `npm audit` 0 vulnerabilities; the lockfile is unchanged.
- Deviations from the Design:
  - `positionOf` has no `key` option: Ajv's path for `required` and `additionalProperties` already
    names the mapping, so one rule serves both;
  - `prettyErrors: false`, for one-line parser messages; aliases are refused (`maxAliasCount: 0`),
    against expansion attacks, and reported at 1:1;
  - `YamlError.detail` carries the message without its position prefix;
  - discovery records a directory it cannot list (exit 2) and stops at a pack: a `pack.yaml`
    inside a pack is not another pack.
- Review (a subagent with its own context): request changes, one blocking (a root error was not
  at 1:1 after leading comments) and four should-fix (unreadable directories skipped, nested
  `pack.yaml` checked, a schema load failure exiting 1, weak syntax tests); all fixed in
  `638b823`, and the re-review approved.
- Left to the §18 layout lint (task 9), from the re-review: a directory named `presets/<x>.yaml` is
  skipped rather than reported, and a `packs/pack.yaml` at the top of `packs/` is checked as a pack.
- Lint preview (adr-004, in a scratch clone): `src/` is clean; the tests have the expected
  `no-floating-promises` on `describe` and `it`, for task 4b.
