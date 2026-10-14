---
id: task-029-remove-publish-pack-bundled-and-feedback-note-published-the-bundled-pack-note-dl-021-r1
type: task
title: "Remove publish:pack --bundled and feedback:note --published, the bundled-pack note (dl-021 R1)"
status: in-review
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
(plan-034). Hosted by plan-035 (`tooling-change` › `deliver`). As task-026 … task-028, on the
approver's rule that a plan's work stays on its branch, it runs on `tooling/task-029-no-bundled`,
not on `task/<id>`: its `done` commit lands there and its `deliver` is that branch's merge. No
pack.

What exists (task-014, task-015, task-016, task-020):
- `src/publish.ts`: the header comment and the `Args` doc comments; options `--bundled` and
  `--from`, used only together; on a maintenance line `--bundled` is refused with a message that
  points to `feedback:note -- --published`; after the catalog commit, a third commit with the
  note, and a rollback that cleans the inbox when that step fails;
- `src/feedback-note.ts`: the header comment ("Whether a pack is bundled is WingFoil's decision");
  `--published <id>@<version>` writes the note "Pack `<id>@<version>` published, for the bundled
  copy"; `--schema` writes the schema-change note (rule 8), which stays, with `fromElement`;
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
   today; no message names `feedback:note -- --published`.
3. **`feedback:note`** takes only `--schema --from <task-nnn | prel-nnn> [--tree <dir>]`;
   `--published` is refused (exit 3); the usage comment and the error messages name only
   `--schema`.
4. **Tests:** the `--published` and `--bundled` tests are removed or turned into refusals; the W7
   exit criterion is tested as the sequencer now states it, with a publication in a fixture
   repository that holds this repository's inbox (as task-014 and task-015 do, since `--dry-run`
   leaves nothing to inspect): it produces the tag, the catalog entry and the digest; when the
   fixture's committed `schema/` changes, the publication fails on the lint (`schema-note`) until
   `feedback:note --schema` writes the note and the note is committed, after which it passes. The
   rollback after a failure past the tag stays covered by an existing test, named in the Execution
   Notes.
5. `git diff --exit-code origin/main...HEAD -- schema/ catalog.yaml compat.yaml` exits 0.
6. **Nothing else changes:** `git diff --name-only` over the task's commits (listed in the
   Execution Notes) shows only this element, `src/publish.ts`, `src/feedback-note.ts`,
   `src/feedback-note-cli.ts` and the two test files (and `tests/support/` if a helper only those
   tests used goes); a grep of `src/` and `tests/` for `bundled` and `--published` gives no hit;
   no import, export, parameter or helper is left unused (for example `writePublishedNote`, the
   `only` parameter of `fromElement`, `publishByHand`).
7. **CI:** the pushed branch's real run conclusion, for both Node.js versions, recorded before
   `in-review`.

## Design

On `tooling/task-029-no-bundled` (Context), through `tooling-delivery` v2 as `developer`
(`code-quality`, `testing`, `determinism`).

Red steps (dl-018 R1):
1. The tests first: `publish:pack` with `--bundled` or `--from`, and `feedback:note --published`,
   expected to exit 3 as unknown or refused options; they fail against today's code (red,
   counted). The W7 test (a publication in a fixture repository with this repository's inbox;
   a committed `schema/` change fails it on `schema-note` until the note is written and
   committed) is new as a whole but checks behaviour that exists: a characterization test
   (dl-018 R2, the `testing` directive), checked by mutation (the `schema-note` rule switched off
   makes it fail).
2. The code: `src/publish.ts` without `--bundled`, `--from`, the note commit, the inbox clean-up
   of the rollback and their imports; `src/feedback-note.ts` without `--published`,
   `writePublishedNote`, `fromElement`'s `only` and the imports they alone used; the usage and
   header comments. Green.
3. `npm run lint` catches any unused import or helper; `publishByHand` goes if no other test uses
   it.

One commit for the tests, one for the code; the Execution Notes list them.

## Execution Notes
- 2026-10-14, design written, task started (backlog → in-progress).
- 2026-10-14, build, red: the tests first (`a1f32f9`): 30 tests, 28 pass, 2 fail (the refusal of
  `feedback:note --published`; the refusal of `publish:pack --bundled` and `--from`). The W7 test
  passed at once, a characterization (dl-018 R2): with the `schema-note` rule switched off it
  fails (mutation, 1 of 1). Green after the code (`68f8ed2`): 30 of 30, `lint` 0.
- 2026-10-14, the rollback after a failure past the tag stays covered by "removes the tag and
  restores catalog.yaml when a step after the tag fails (exit 2)" in `tests/publish.test.ts`. The
  removed test was the only one failing after the catalog commit; no step can fail there any
  more.
- 2026-10-14, **Acceptance 6, raised when found (dl-019 R1):** its grep of `src/` and `tests/` for
  `bundled` and `--published` cannot give no hit, since Acceptance 2–4 test their refusal. The
  approver ruled on 2026-10-14: no occurrence outside the refusal tests. `src/` has none; `tests/`
  only in the refusal tests of `tests/feedback-note.test.ts`.
- 2026-10-14, build review (independent subagent): approve after amendments, 0 blocking, 3 minor
  (unused exports `fromElement` and `FeedbackNoteError`; a dead `bump` step left by the removed
  maintenance-line refusal; the W7 test to check the catalog entry and its digest explicitly),
  fixed in `2eea798`; re-review (dl-017 R2, a test and an export changed): approve.
- 2026-10-14, Acceptance from a clean clone at `68f8ed2`, on Node.js 22.21.0 and 22.12.0: `npm ci`,
  `build`, `test` (802 of 802), `lint`, `check:pins`, `check:schemas`, `check:packs`,
  `index -- --check`, `validate` exit 0; `schema/`, `catalog.yaml` and `compat.yaml` unchanged;
  besides this element and plan-035, only `src/publish.ts`, `src/feedback-note.ts`,
  `src/feedback-note-cli.ts`, `tests/feedback-note.test.ts` and `tests/publish.test.ts` change.
- Task commits: `a1f32f9` (tests), `68f8ed2` (code), `2eea798` (review fixes).
- 2026-10-14, CI (Acceptance 7): run 38621778153 on `2eea798`, conclusion `success` for
  `validate (22.21.0)` and `validate (22.12.0)`. Submitted `in-review`.
