---
id: task-018-readme-lint-rules-the-sections-the-generated-markers-and-install-truth-spec-002-2-cb-1-cb-3
type: task
title: "README lint rules: the sections, the generated markers and install truth (spec-002 §2, CB-1, CB-3)"
status: draft
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

Today the lint only checks that a pack has a `README.md` (task-012, the §6.1 layout). Every README
of the fixture trees under `tests/fixtures/` is a one-line title, and `tests/support/pack-tree.ts`
writes the same; both are brought to the standard here, so that the existing tests keep passing.

Not in scope:
- the **content** of the generated sections (title, composition, what it adds, parameters): it is
  written and checked for freshness by `npm run index` (plan-024 task 2, CB-5). Here only their
  markers and headings are checked; the fixture READMEs carry hand-written placeholder content
  between the markers, which task 2 regenerates;
- **section 7, Examples** (CB-2): plan-024 task 4. Here only its heading is checked;
- the README hand steps against the `compat.yaml` of a release commit at `pack-release-cycle` ›
  `prepare` (CB-3's last part): a review step of that workflow, already in place (plan-021);
- the root `README.md` (plan-024 task 5) and every file outside `packs/`: they are not pack
  READMEs;
- CB-8: `catalog.yaml`, `compat.yaml` and `schema/` do not change.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network. `npm run validate` exits 0, and so does
   `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden`.
2. **Scope.** The rules apply to the `README.md` at the root of every pack directory under
   `packs/` whose `pack.yaml` passed its schema, in the working tree, in `check:packs`, `validate`
   and `validate:publication` alike; the composer refuses a pack it composes whose README fails
   them (spec-001 §18), through the same functions. The report keeps task-012's form
   (`<file>[:<line>:<col>]: <rule>: <message>`); the `<rule>` ids are fixed in the Design.
3. **Headings (CB-1).** A heading is an ATX heading (`#` to `######`, up to three spaces of
   indentation) or a setext heading (`===` or `---` underline), outside fenced and indented code
   blocks. The README fails when:
   - its level-1 and level-2 headings are not exactly the nine of spec-002 §2.1, in that order:
     one `# <text>` (any non-empty text), then `## When to use it`, `## Install and update`,
     `## Composition`, `## What it adds`, `## Parameters`, `## Examples`,
     `## Sources and adaptations`, `## Versions`; a missing, duplicated, misspelled or out-of-order
     heading, and any other level-1 or level-2 heading, is reported at its line;
   - content other than blank lines and generated markers comes before the level-1 heading.
4. **Generated markers (CB-1, §2.2).** A marker is a line `<!-- generated:begin <name> -->` or
   `<!-- generated:end <name> -->`. The README fails when:
   - one of the four generated sections (`title` for the level-1 heading, `composition`,
     `what-it-adds`, `parameters`) is not enclosed by its pair: the begin marker before the heading
     with only blank lines between them, the end marker after the section's content and before the
     next level-1 or level-2 heading;
   - a marker names another section, is duplicated, unpaired, nested, or encloses a written section;
   - a marker line is malformed (for example `<!--generated:begin x-->` or an unknown verb), when
     its text starts with `<!-- generated` or `<!--generated`.
5. **No WingFoil CLI command (CB-3, §2.3).** The README fails on any line of a fenced or indented
   code block, and any inline code span, whose text, after leading whitespace and an optional `$ `,
   starts with `wingfoil `, `npx wingfoil`, `npm exec wingfoil`, `npm run wingfoil` or
   `npm run -s wingfoil` (a command alone on a line, with no argument, counts too). Each finding
   names the line. The check covers the whole file, generated sections included.
6. **The temporary mark (CB-3, §2.3).** While no release of the tree's `compat.yaml` lists
   `pack-install` in its `capabilities`, the first non-blank line after `## Install and update`
   is exactly
   `> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.`;
   once such a release is listed, the mark is no longer required (nor forbidden). A tree with no
   readable `compat.yaml` is treated as listing none.
7. **Links (§2.1, §2.5).** The README fails when:
   - section 3 does not link `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install`;
   - section 9 does not link `CHANGELOG.md` relatively and
     `https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-<anchor>`, where
     `<anchor>` is the pack's catalog id with every `/` replaced by `-` (spec-002 §3.2);
   - any link anywhere in the README points to `CATALOG.md` relatively (a target that is, or
     ends with, `CATALOG.md`, with or without an anchor, and is not the absolute URL above).
8. **Fixtures.** Every rule of acceptance 3–7 has a passing and a failing test on a synthesized
   tree, and acceptance 6 a test on each side of the `pack-install` condition. Every pack README
   under `tests/fixtures/` and the one `tests/support/pack-tree.ts` writes conform; the expected
   output of the golden tree (`tests/fixtures/compose/expected`) is unchanged, since READMEs are
   not composed output, or regenerated and the difference stated in the Execution Notes.
9. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
   conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
