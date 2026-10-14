---
id: task-029-remove-publish-pack-bundled-and-feedback-note-published-the-bundled-pack-note-dl-021-r1
type: task
title: "Remove publish:pack --bundled and feedback:note --published, the bundled-pack note (dl-021 R1)"
status: draft
pack: ""            # tooling task (tooling-change › deliver, plan-035)
depends_on: []
tags: ["tooling","feedback"]
---

## Context

dl-021 R1 (`approved` 2026-10-13): no pack is bundled in WingFoil's npm package; WingFoil installs
packs from this repository through `pack-install`. dl-021 › Changes › Tooling asks to remove
`npm run publish:pack -- --bundled`, the bundled-pack note of `src/feedback-note.ts`
(`npm run feedback:note -- --published`) and their tests. The configuration already dropped the
note (plan-033), and the sequencer's W7 exit criterion now reads "a dry-run publication of a
fixture pack produces tag, catalog entry and digest, and a feedback note when it changes a schema"
(plan-034). Hosted by plan-035 (`tooling-change` › `deliver`). On the approver's rule that a plan's
work stays on its branch, it runs on `tooling/task-029-no-bundled`, which is also its `task/<id>`
equivalent; its `deliver` is that branch's merge. No pack.

What exists (task-014, task-015, task-016, task-020):
- `src/publish.ts`: options `--bundled` and `--from`, used only together; on a maintenance line
  `--bundled` is refused; after the catalog commit, a third commit with the note;
- `src/feedback-note.ts`: `--published <id>@<version>` writes the note "Pack `<id>@<version>`
  published, for the bundled copy"; `--schema` writes the schema-change note (rule 8), which
  stays;
- `src/feedback-note-cli.ts`: the usage comment names both;
- tests: `tests/feedback-note.test.ts` (`--published`; `publish:pack --bundled` as "the W7 exit
  criterion") and `tests/publish.test.ts` (`--bundled` refused on a maintenance line).

Not in scope: `feedback:note --schema`, the `schema-note` lint rule and the schema digest, which
stay; approved elements that mention `--bundled`; `schema/`, `catalog.yaml` and `compat.yaml`.

## Acceptance

Run from a clean clone of `tooling/task-029-no-bundled`; Node.js 22.21 and the floor 22.12.0.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check` and
   `npm run validate` exit 0; no dependency is added.
2. **`publish:pack`** has no `--bundled` and no `--from`: each is refused as an unknown option
   (exit 3); a publication writes the tag and the catalog commit only, as without `--bundled`
   today.
3. **`feedback:note`** takes only `--schema --from <task-nnn | prel-nnn> [--tree <dir>]`;
   `--published` is refused (exit 3); the usage comment and the error messages name only
   `--schema`.
4. **Tests:** the `--published` and `--bundled` tests are removed or turned into refusals; the W7
   exit criterion is tested as the sequencer now states it: a dry-run publication of a fixture
   pack produces tag, catalog entry and digest, and, when the fixture's `schema/` changes, the
   lint (`schema-note`) fails until `feedback:note --schema` writes the note, after which the
   publication passes.
5. `git diff --exit-code origin/main...HEAD -- schema/ catalog.yaml compat.yaml` exits 0.
6. **Nothing else changes:** `git diff --name-only` over the task's commits (listed in the
   Execution Notes) shows only this element, `src/publish.ts`, `src/feedback-note.ts`,
   `src/feedback-note-cli.ts` and the two test files; a grep of `src/` and `tests/` for
   `bundled` and `--published` gives no hit.
7. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
   `in-review`.

## Design

Filled at the start of the work.

## Execution Notes
