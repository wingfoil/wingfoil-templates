---
id: task-007-composer-output-assets-workflows.yaml-agents-region-compose-command
type: task
title: "Composer output: assets, workflows.yaml, AGENTS region, compose command"
status: approved
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-006-fragment-merge-add-or-tighten-and-parameters"]
tags: ["tooling","W5","F3.2"]
---

## Context

Task 6 of plan-015 (`sw-life-cycle` › `tooling`, wave W5, F3.2). Tooling task, no pack. It ends
the reference composer of adr-001: after it, a composition becomes files.

It comes from:
- **spec-001 §7.6:** asset files copied whole after substitution, to
  `.wingfoil/directives/built-in/<id>.md`, `.wingfoil/workflows/built-in/<name>.yaml`,
  `.wingfoil/memory/templates/built-in/<type>.md`; one owner per file, the slot workflow the only
  exception; a Memory template shipped by the pack that defines its type, whose `template.file` is
  `memory/templates/built-in/<type>.md`; a directive id equal to a WingFoil built-in is an error;
- **spec-001 §7.7:** `workflows.yaml` generated, `format: 1` and `version: 1`, one `include` entry
  per composed workflow in composition order then each pack's `contents.workflows` order; a slot
  workflow once, at the position of the pack whose file is used;
- **spec-001 §9:** a phase pack's slot workflow replaces `base`'s default;
- **spec-001 §10:** the AGENTS.md generated region, a separate output: the provisional markers,
  the sections in composition order separated by one blank line; `base`'s section opens with a
  level-1 heading, every other with a level-2 heading and no level-1 heading; no markers inside;
- **spec-001 §5 and §6.1:** every directive, workflow and Memory template declares `format:`,
  equal to its pack's `formats` entry, and every file of one kind in one pack has the same format;
  an asset's identifier equals its file stem: a directive's `id`, a workflow's `name`, a Memory
  template's type. spec-001 does not name the template's field; every Memory template of WingFoil
  and of this repository carries a frontmatter `type:`, WingFoil's element-type field, so `type` is
  read as §6.1's identifier. task-006 gave these checks to this task; task 9's lint reuses them.
  Formats are not required to agree across packs for assets (only fragments merge into one file,
  §7.2); a mix is the computed range's concern (§12);
- **spec-001 §17 step 6:** `.wingfoil/` written with UTF-8, `LF` and a final newline;
- **adr-003:** the generated YAML files (`dna.yaml`, `roles.yaml`, `memory.yaml`, `workflows.yaml`)
  go through one function with fixed stringify options (`lineWidth: 0`, two-space indent, no
  document markers), pinned by golden-file tests. Asset files are copied whole (§7.6), comments and
  their own `version:` included.

Derived from spec-001, and marked so:
- a type whose `template.file` is under `memory/templates/built-in/` with no pack shipping that
  template fails: the `built-in/` folder belongs to packs (§7.6), and a template is shipped by the
  pack that defines its type, so such a reference would dangle;
- a composition in which no pack ships a fragment of `dna`, `roles` or `memory` fails: WingFoil
  reads all three (§12 `kinds`), and `base` ships them;
- the AGENTS region is written to `<out>/AGENTS.region.md`, the composer's own name for §10's
  "separate output", outside `.wingfoil/`; with no section it holds the two markers alone.

WingFoil's own built-in directives (`architecture`, …, which `roles.yaml` may assign, task-006) are
not written by the composer: whether a composed `.wingfoil/` holds them is spec-001 O12, open.
Tasks 7 and 8 run WingFoil on a composed configuration and rely on WingFoil's built-ins being
available as `wingfoil init` provides them.

Scope: from `composeDocuments` (task-006) to files, and the `compose` command. Not in scope: the
determinism check and the one validation command (task 7); running WingFoil on the output (tasks 7
and 8); `custom/` and a project's own files, which the composer never touches (§17).

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins` and
   `npm run check:schemas` exit 0; no dependency is added.
2. **Golden output:** a fixture tree under `tests/fixtures/compose/` with `base`, a methodology, a
   phase pack filling a slot, a blueprint, a team-mode and a stage, each shipping fragments,
   workflows, directives, Memory templates and agents sections, composes to exactly the files of
   `tests/fixtures/compose/expected/` (byte for byte, the list of files included): `.wingfoil/`
   with `dna.yaml`, `roles.yaml`, `memory.yaml`, `workflows.yaml` (each starting with `format` and
   `version: 1`) and the three asset folders, and `AGENTS.region.md`.
3. **Assets (§7.6, §9):** each with a test: the three target folders; substituted text, copied
   whole; two packs shipping one directive id, workflow name or Memory template fail; a slot
   workflow of a phase pack replaces `base`'s default, and `base`'s file is not written; a slot
   workflow whose `kind` is not `sub` fails; a Memory template shipped by a pack that does not
   define its type fails; a type whose `template.file` is not `memory/templates/built-in/<type>.md`
   while its pack ships the template fails; a type whose `template.file` is under
   `memory/templates/built-in/` with no pack shipping it fails (derived); a directive id equal to a
   WingFoil built-in fails; a composition without a `dna`, `roles` or `memory` fragment fails
   (derived).
4. **Formats and identifiers (§5, §6.1):** each with a test: a workflow, a directive and a Memory
   template without `format:`, or with a format other than its pack's `formats` entry, fail; two
   files of one kind in one pack with different formats fail; two packs shipping one kind in two
   formats pass; a workflow whose `name`, a directive whose `id`, or a Memory template whose `type`
   differs from its file stem, or lacks it, fails.
5. **`workflows.yaml` (§7.7):** `format: 1`, `version: 1`, the include order of §7.7 tested with
   two packs shipping two workflows each, and the slot workflow at its filler's position.
6. **AGENTS region (§10):** the markers of spec-001 §10, the sections in composition order with one
   blank line between them. A section "opens with" its first non-blank line, outside fenced code;
   `#` inside fenced code is not a heading. Failing, each with a test: a `base` section not opening
   with a level-1 heading; another section with a level-1 heading, or not opening with a level-2
   heading; a section containing a marker after substitution. With no section, the region is the
   two markers alone.
7. **Bytes (§17):** every written file is UTF-8 without a byte order mark, has `LF` line endings
   and ends with a newline (one is added when missing, none removed); a pack file with `CRLF` is
   written with `LF`, and one with a BOM without it.
8. **`npm run compose -- --tree <dir> --out <dir> [--param <name>=<value>]… <entry>…`:** writes
   `<out>/.wingfoil/` and `<out>/AGENTS.region.md`; a value is read by its declared type (`integer`
   with the base-10 grammar of task-006, `boolean` `true`/`false`, otherwise text, so `007` stays
   text for a `string`). Exit 0; 1 on a composition or resolution error, or an undeclared
   parameter; 2 on an I/O error, or an `--out` that exists and is not empty; 3 on bad usage,
   including a `--param` without `=` and a parameter given twice. Tests run it on the fixture tree
   against the golden output, and once for each exit code.
9. `npm audit` reports 0 vulnerabilities.

## Design

Branch `task/task-007-output`, run through `tooling-delivery` as `developer` (`code-quality`,
`testing`, `determinism`), under `npm run lint`.

- **`src/formats.ts`:** the format checks shared by fragments (task-006) and assets: `format:`
  present, written as a positive YAML integer, equal to the pack's `formats.<kind>`.
- **`src/frontmatter.ts`:** a Markdown file's frontmatter (`---` lines) parsed with the task-002
  loader, positions kept.
- **`src/memory-merge.ts`:** also returns which pack defined each type, for the template rules.
- **`src/output.ts`:**
  - `checkAssets(composed, catalog)`: formats and identifiers (§5, §6.1), one owner per target with
    the slot exception and `kind: sub` (§7.6, §9), Memory templates and `template.file`, built-in
    directive ids, a fragment of each kind;
  - `workflowsYaml(composed, catalog)`: the include list of §7.7;
  - `agentsRegion(composed, catalog)`: §10, scanning lines outside fenced code;
  - `outputFiles(...)`: the list of `{ path, text }`, every text normalized (no BOM, `LF`, final
    newline);
  - `writeOutput(out, files)`: refuses an `--out` that exists and is not empty, then writes in
    sorted path order.
- **`src/yaml-write.ts`:** `toYaml(doc)`, the one stringify call with adr-003's named options.
- **`src/parameters.ts`:** `fromText(type, text)` reads a command-line value by its declared type.
- **`src/compose-cli.ts`:** `npm run compose`, arguments by `node:util` `parseArgs`; the catalog is
  the tree's `catalog.yaml`, so a fixture tree carries its own.
- **Tests,** red first: `tests/output.test.ts`, `tests/agents-region.test.ts`,
  `tests/compose-cli.test.ts`; the golden tree `tests/fixtures/compose/tree/` and its expected
  output `tests/fixtures/compose/expected/`, generated once by the composer, read line by line
  against spec-001 before it is committed, then compared byte for byte.

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review:
  the slot workflow's `kind: sub` (§9); the template `type` as a required identifier; formats
  agreeing per pack, not across packs, for assets; only generated files re-serialized; the
  composed documents and a missing fragment kind; O12 stated; derived rules marked; the AGENTS
  region's opening line, fenced code, markers after substitution, empty region; bytes and BOM;
  CLI exit codes for `--param`.
- 2026-10-07, build on `task/task-007-output`, as `developer`, under `npm run lint`: `391e48e`
  refactor (shared format check, frontmatter, type owners), `5949edf` and `5f68d2e` output plan,
  `4982426` AGENTS region tests (with the fix for leading blank lines), `8a189c6` values as text,
  `3b5a0e9` compose command and golden composition, `b5604d7` `.gitattributes` for fixtures,
  the catalog test CRLF fix, `482c00d` and `e9c14e0` review fixes.
  - Red first for the output plan (22 failing on a stub). The AGENTS region tests were written
    after `agentsRegion`: characterization tests, checked by mutation (each mutant killed); they
    found that blank lines before a section reached the region, now fixed.
  - The golden output was generated once by `npm run compose`, read file by file against spec-001
    §7.2–§7.7, §9, §10 and §17, then frozen. Its tree holds a file with a BOM and CRLF lines.
  - **WingFoil 0.2.2 on the golden output** (a `git init`ed copy; WingFoil runs only at a git
    root): `workflow list`, `dna show` and `directives list` exit 0, with only the warnings
    `unknown field(s) ignored: format` (spec-001 O10). Getting there needed the fixture's content
    to satisfy WingFoil's own schemas (`dna.yaml` `stacks`, `team.members`, `team.roles`; directive
    `name`, `type`, `kind`; agent roles declared) — inputs for `base`'s charter.
  - Acceptance 1–9 pass from a clean clone at `e9c14e0` on Node.js 22.21.0 / npm 11.6.2 and on the
    floor 22.12.0 / npm 10.9.0: 396 tests pass (none skipped), `lint`, `check:pins`,
    `check:schemas`, `npm audit` clean, dependencies unchanged; the tests also pass in a clone made
    with `core.autocrlf=true`.
- Deviations from the Design and choices:
  - `writeOutput` writes into a sibling staging directory and renames it onto `--out`, so a failed
    write leaves nothing half-written; `--out` as a symbolic link or as `.` is refused (exit 2);
  - `loadCatalog` throws a typed `CatalogError`;
  - `.gitattributes` also disables line-ending conversion under `tests/fixtures/`;
  - left as they are, from the review's nits: indented fences and setext headings in agents
    sections; frontmatter error lines counted from the frontmatter body.
- Review (a subagent with its own context): request changes, one blocking (the missing-fragment
  test stopped in the resolver and never reached its check) and five should-fix (a string-matched
  catalog error, missing CLI tests, a non-atomic write, no BOM test, a golden CRLF case that a
  rewrite of the file had silently lost). Fixed in `482c00d`; the re-review killed the earlier
  surviving mutants and found `--out` created 0700, fixed in `e9c14e0`.
- Commit hygiene, noted rather than rewritten: `5949edf` carries "(WIP)" in its subject and
  `5f68d2e` only wraps it; `4982426`, typed `test:`, also carries a `src/output.ts` fix.
