---
id: task-007-composer-output-assets-workflows.yaml-agents-region-compose-command
type: task
title: "Composer output: assets, workflows.yaml, AGENTS region, compose command"
status: pending
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
  equal to its pack's `formats` entry, one format per kind in a composition; an asset's identifier
  (a directive's `id`, a workflow's `name`, a Memory template's type) equals its file stem. task-006
  gave these checks to this task for the assets; task 9's lint reuses them;
- **spec-001 §17 step 6:** `.wingfoil/` written with UTF-8, `LF` and a final newline;
- **adr-003:** composed YAML through one function with fixed stringify options (`lineWidth: 0`,
  two-space indent, no document markers), pinned by golden-file tests.

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
   `tests/fixtures/compose/expected/` (byte for byte, the list of files included).
3. **Assets (§7.6):** each with a test: the three target folders; substituted text; two packs
   shipping one directive id, workflow name or Memory template fail; a slot workflow of a phase pack
   replaces `base`'s default, and `base`'s file is not written; a Memory template shipped by a pack
   that does not define its type fails; a type whose `template.file` is not
   `memory/templates/built-in/<type>.md` while its pack ships the template fails; a type whose
   `template.file` is under `memory/templates/built-in/` with no pack shipping it fails; a directive
   id equal to a WingFoil built-in fails.
4. **Formats and identifiers (§5, §6.1):** each with a test: a workflow, a directive and a Memory
   template without `format:`, or with a format other than its pack's `formats` entry, fail; two
   packs shipping one kind in two formats fail; a workflow whose `name`, or a directive whose
   `id`, differs from its file stem fails; a Memory template's frontmatter `type`, when present,
   must equal the stem.
5. **`workflows.yaml` (§7.7):** `format: 1`, `version: 1`, the include order of §7.7 tested with
   two packs shipping two workflows each, and the slot workflow at its filler's position.
6. **AGENTS region (§10):** the markers of spec-001 §10, the sections in composition order with one
   blank line between them; a `base` section without a level-1 heading fails; another section with a
   level-1 heading, or not opening with a level-2 heading, fails; a section containing a marker
   fails; no section gives the markers alone.
7. **Bytes (§17):** every written file is UTF-8, has `LF` line endings and ends with one newline; a
   pack file with `CRLF` is written with `LF`. YAML output goes through one function with the fixed
   options of adr-003.
8. **`npm run compose -- --tree <dir> --out <dir> [--param <name>=<value>]… <entry>…`:** writes
   `<out>/.wingfoil/` and `<out>/AGENTS.region.md`; values are read by their declared type
   (`integer` base-10, `boolean` `true`/`false`, otherwise text); exit 0, 1 on a composition or
   resolution error, 2 on an I/O error or an `--out` directory that exists and is not empty, 3 on
   bad usage. A test runs it on the fixture tree and compares with the golden output.
9. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
