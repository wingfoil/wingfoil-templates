---
id: task-007-composer-output-assets-workflows.yaml-agents-region-compose-command
type: task
title: "Composer output: assets, workflows.yaml, AGENTS region, compose command"
status: backlog
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

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review:
  the slot workflow's `kind: sub` (§9); the template `type` as a required identifier; formats
  agreeing per pack, not across packs, for assets; only generated files re-serialized; the
  composed documents and a missing fragment kind; O12 stated; derived rules marked; the AGENTS
  region's opening line, fenced code, markers after substitution, empty region; bytes and BOM;
  CLI exit codes for `--param`.
