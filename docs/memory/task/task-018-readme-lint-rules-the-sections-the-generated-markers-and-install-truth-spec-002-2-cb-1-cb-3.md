---
id: task-018-readme-lint-rules-the-sections-the-generated-markers-and-install-truth-spec-002-2-cb-1-cb-3
type: task
title: "README lint rules: the sections, the generated markers and install truth (spec-002 §2, CB-1, CB-3)"
status: pending
pack: ""            # tooling task (tooling-change › deliver, tooling-delivery)
depends_on: []
tags: ["tooling","W14","F2.8"]
---

## Context

Task 1 of plan-024 (`tooling-change` › `deliver`, wave W14, F2.8). Tooling task, no pack. Below,
"plan-024 task N" names a step of that plan, not a Memory element.

It comes from:
- **dl-014 D7 T1:** the README lint rules (CB-1, CB-3). The other two parts of T1, the tech-spec
  (spec-002) and the `pack-authoring` rule, were applied by plan-021;
- **spec-002 §2.1** (the nine sections, their order and headings, no other level-1 or level-2
  heading), **§2.2** (the generated-section markers and their names), **§2.3** (the temporary mark
  and the rule against WingFoil CLI commands), **§2.5** (links to `CATALOG.md`), and **§6 CB-1,
  CB-3**, which extend the lint rules of spec-001 §18;
- **spec-001 §18** and task-012: the lint runs over the whole tree as `npm run check:packs` and as
  a step of `npm run validate` and `npm run validate:publication`; the composer refuses what the
  lint rejects, through the same functions.

Acceptance 7 enforces the links of spec-002 §2.1 (rows 3 and 9) and §2.5, which §6 does not list
as a check: they are normative ("must"), and the anchors the index writes (plan-024 task 2) depend
on them, so they are checked here rather than left to review.

Today the lint only checks that a pack has a `README.md` (task-012, the §6.1 layout). Every README
of the fixture trees under `tests/fixtures/` is a one-line title, and `tests/support/pack-tree.ts`
writes the same; both are brought to the standard here, so that the existing tests keep passing.
Tests that write a README of their own are brought to the standard too, and their assertions do not
change. Between the markers of the generated sections the fixtures carry hand-written placeholder
content, which plan-024 task 2 regenerates; section 7 holds a placeholder line that plan-024 task 4
replaces. The `pack-authoring` rule "generated sections are never written by hand" applies to the
catalog's packs, not to test fixtures.

Not in scope:
- the **content** of the generated sections (title, composition, what it adds, parameters): it is
  written and checked for freshness by `npm run index` (plan-024 task 2, CB-5). Here only their
  markers and headings are checked;
- **section 7, Examples** (CB-2): plan-024 task 4. Here only its heading is checked;
- the README hand steps against the `compat.yaml` of a release commit at `pack-release-cycle` ›
  `prepare` (CB-3's last part): a review step of that workflow, already in place (plan-021);
- the root `README.md` (plan-024 task 5) and every file outside `packs/`: they are not pack
  READMEs.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network. `npm run validate` exits 0, and so does
   `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden`.
2. **CB-8.** `git diff --exit-code origin/main -- catalog.yaml compat.yaml schema/` exits 0 on the
   task branch.
3. **Scope and report.** The rules apply to the `README.md` at the root of every pack directory
   under `packs/` whose `pack.yaml` passed its schema, in the working tree, in `check:packs`,
   `validate` and `validate:publication` alike. They are skipped when the README is missing
   (task-012 already reports it as `layout`). The composer refuses a pack it composes whose README
   fails them (spec-001 §18), through the same functions. The report keeps task-012's form
   (`<file>[:<line>:<col>]: <rule>: <message>`), with the rule ids `readme-heading`,
   `readme-marker`, `readme-command`, `readme-install-mark` and `readme-link`.
   `npm run publish:pack` may report such a pack as covered by no composition (it skips refused
   compositions, task-014); `validate` and its lint name the README problem.
4. **Markdown, as the rules read it.** For headings and markers only top-level blocks count: nothing
   inside a block quote, a list item, an HTML comment or a code block. Code spans, code blocks
   (acceptance 7) and links (acceptance 9) are found at any depth, outside HTML comments; links
   only outside code. A fenced code block opens with three or more
   `` ` `` or `~` and closes on a fence of the same character at least as long, or at the end of
   the file. An indented code block (four or more spaces) starts only after a blank line or at the
   start of the file; an indented line after a paragraph line continues the paragraph. A heading
   is an ATX heading (`#` to `######`, up to three spaces of indentation) or a setext heading
   (`===` or `---` underline); its text is its content with the `#` markers, an optional closing
   `#` sequence and surrounding whitespace removed, compared byte for byte. A code span is a
   backtick string and the next backtick string of the same length on the same line, outside code
   blocks. A link is an inline link `[text](target)`, an autolink `<target>`, or a reference link
   whose definition gives the target; bare URLs and anything in code do not count; targets are
   compared exactly, after removing optional `<…>` around them and a title.
5. **Headings (CB-1, `readme-heading`).** The README fails when:
   - its level-1 and level-2 headings are not exactly these nine, in this order: one `# <text>`
     (any non-empty text), then `## When to use it`, `## Install and update`, `## Composition`,
     `## What it adds`, `## Parameters`, `## Examples`, `## Sources and adaptations`,
     `## Versions` (each may be ATX or setext). A duplicated, misspelled or out-of-order heading,
     and any other level-1 or level-2 heading, is reported at its line; a missing one at the line
     of the heading found in its place, or at the last line of the file when none follows;
   - content other than blank lines and generated markers comes before the level-1 heading.
6. **Generated markers (CB-1, §2.2, `readme-marker`).** A marker is a whole top-level line, with no
   indentation, `<!-- generated:begin <name> -->` or `<!-- generated:end <name> -->`, one space
   around each part; a marker-like line inside a code block is not a marker, so a README may quote
   the syntax. The README fails when:
   - one of the four generated sections (`title` for the level-1 heading, `composition`,
     `what-it-adds`, `parameters`) is not enclosed by its pair: the begin marker before the heading
     with only blank lines between them, the end marker after the section's content and followed by
     blank lines only up to the next level-1 or level-2 heading (or the end of the file);
   - a marker names another section, is duplicated, unpaired or nested, or encloses a written
     section's heading;
   - a top-level line outside code blocks starts with `<!-- generated` or `<!--generated` and is
     not a well-formed marker (for example `<!--generated:begin x-->` or an unknown verb).
7. **No WingFoil CLI command (CB-3, §2.3, `readme-command`).** The README fails on any line of a
   fenced or indented code block, and any inline code span, whose text, after leading whitespace
   and an optional `$ `, starts with `wingfoil `, `npx wingfoil`, `npm exec wingfoil`,
   `npm run wingfoil` or `npm run -s wingfoil`. A code-block line whose whole text is one of these
   forms with no argument (`wingfoil` included) counts too; an inline code span whose whole text is
   `wingfoil` names the program and passes. Each finding names the line. The check covers the whole
   file, generated sections included.
8. **The temporary mark (CB-3, §2.3, `readme-install-mark`).** While no release of the tree's
   `compat.yaml` lists `pack-install` in its `capabilities`, the first non-blank line after
   the section 3 heading is exactly
   `> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.`;
   once such a release is listed, the mark is no longer required (nor forbidden). A tree with no
   `compat.yaml`, or one that fails its schema, is treated as listing none.
9. **Links (§2.1, §2.5, `readme-link`).** The README fails when:
   - section 3 does not link `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install`;
   - section 9 does not link `CHANGELOG.md` (or `./CHANGELOG.md`) and
     `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-<anchor>`, where
     `<anchor>` is the pack's catalog id with every `/` replaced by `-` (spec-002 §3.2);
   - any link anywhere in the README has a target that is, or ends with, `CATALOG.md` (with or
     without an anchor) and is not
     `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#<anchor>`.
10. **Tests.** Every rule of acceptance 5–9 has a passing and a failing test on a synthesized tree,
    and each edge case of acceptance 4 a test of its own; acceptance 8 has a test on each side of
    the `pack-install` condition; one composition (`npm run validate` or `compose` on a synthesized
    tree) refuses a pack whose README fails, with the lint's message. Every pack README under
    `tests/fixtures/` and the one `tests/support/pack-tree.ts` writes conform; the expected output
    of the golden tree (`tests/fixtures/compose/expected`) is unchanged.
11. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
    conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-11: independent review of the body (a subagent with its own context): approve after
  amendments; one blocking point (CB-8 missing from the Acceptance), nine should-fix and five nits,
  all applied while `pending`. Re-review by the same reviewer: every finding resolved; two
  should-fix (links and code found at any depth, not only top level; CB-8 diffed against
  `origin/main`, which a clean clone of the task branch has) and one nit (the section 3 heading may
  be setext), applied. The review's hint for the Design: one exported README parser, which
  plan-024 task 2 reuses to rewrite between the same markers the lint checks.
