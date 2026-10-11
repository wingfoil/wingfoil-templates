---
id: task-021-the-agent-path-the-procedure-in-catalog.md-and-llms.txt-tested-offline-spec-002-4-cb-6
type: task
title: "The agent path: the procedure in CATALOG.md and llms.txt, tested offline (spec-002 §4, CB-6)"
status: done
pack: ""            # tooling task (tooling-change › deliver, tooling-delivery)
depends_on: ["task-020-the-publication-regenerates-the-index-spec-002-3.1-cb-5-plan-023-removed"]
tags: ["tooling","W14","F2.8"]
---

## Context

Task 3 of plan-024 (`tooling-change` › `deliver`, wave W14, F2.8). Tooling task, no pack. Below,
"plan-024 task N" names a step of that plan, not a Memory element.

It comes from:
- **dl-014 D3 and D7 T4:** the agent path, documented in `CATALOG.md` and `llms.txt` and tested
  offline;
- **spec-002 §4** (no server: the index at `main`, a local filter over it by axis, slot, profile,
  status and text, then one pack's README and `pack.yaml` pinned to its tag; raw files may be up to
  5 minutes stale; the REST API and code search are not part of the path), **§3.2 item 7** and
  **§3.4** (where the files list it), and **§6 CB-6** (offline, the tests check the URL patterns
  the three files emit);
- **task-019:** `src/index-urls.ts` builds every URL, and `URL_PATTERNS` (`src/index-render.ts`)
  lists them in `CATALOG.md` › "For agents" and in `llms.txt` › "Reading a pack". Today both list
  the patterns without the procedure that joins them.

The live part of CB-6 (an anonymous fetch from `llms.txt` to the index, a filter, and one pack's
README and `pack.yaml` at its tag) is recorded as evidence in `base`'s first `pack-release`
(spec-002 §6, dl-014 CB-6), wave W9: it needs the first tag on github.com. No charter or workflow
carries it yet (dl-014 D7 puts only CB-1 and CB-2 in the charters), so this task records in
plan-024's Execution Notes that `base`'s charter must list CB-6 with CB-1 and CB-2.

Not in scope: the Pages URLs of §4 (plan-024 task 6); examples (task 4); the root `README.md`
(task 5); CB-8: `catalog.yaml`, `compat.yaml` and `schema/` do not change; the format of
`catalog-index.json` (`format: 1`) does not change.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network. `npm run validate` exits 0, and so does
   `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden`.
2. **CB-8.** `git diff --exit-code origin/main -- catalog.yaml compat.yaml schema/` exits 0 on the
   task branch.
3. **The procedure (§4).** `CATALOG.md` › "For agents" and `llms.txt` give the same numbered
   steps, generated from one list. In `llms.txt` they come right after the blockquote, before
   `## Index`, as the convention's detail block (no heading); the three sections of §3.4 are
   unchanged. The steps:
   1. fetch the index at `main`;
   2. filter its `packs` locally by `axis`, `slot`, `profiles`, `status`, or text over `title`,
      `description` and `excerpt` (the step advises a case-insensitive substring match, as is);
   3. take the chosen pack's `latest`, the entry of `versions` whose `version` equals it, and that
      entry's `readme_url` and `manifest_url`;
   4. fetch them: they are pinned to the version's tag and never change;
   5. for resolution and compatibility, fetch `catalog.yaml` and `compat.yaml` at `main`; a preset
      or a transition at its `url` field (§3.3).

   They also say that the files are anonymous and CORS-enabled, may be up to 5 minutes stale, that
   no server, REST API or code search is needed, and that the tag is written as is in a URL (`/`
   and `@` included). No WingFoil CLI command appears, checked with the detector of task-018's
   `readme-command` rule over the code spans and code lines of both files.
4. **Offline URL checks (CB-6).**
   - **What a URL is:** in `catalog-index.json`, every string value starting with `https://`; in
     `CATALOG.md` and `llms.txt`, every Markdown link target and every code span starting with
     `https://`. A relative link target (`[llms.txt](llms.txt)`) must name a file at the tree's
     root. A test shows that the extraction finds each placeholder URL whole.
   - **Matching:** `src/index-urls.ts` gains a parser returning the URL's form, tag and path, or
     nothing; a URL matches when it parses and the builder of its form rebuilds it byte for byte.
     The forms are those of task-019 acceptance 9, plus `<raw>/main/CATALOG.md` and the github.com
     links at `main` of `llms.txt` › Specifications (task-019 acceptance 8). In a tag the version
     follows the `@`, and the tag ends at the first `/` after it; for a README or a `pack.yaml`, the
     pack id in the tag equals the one in `packs/<id>/`. Every URL found is checked: one that
     matches no form fails the test.
   - **Resolving:** a URL at `main` resolves to the file in the working tree of the tree that
     emitted it, after its outputs are written, except the github.com links at `main`, which
     resolve in this repository's working tree whichever tree emitted them; a URL at a tag resolves
     to `git show <tag>:<path>`. The file must exist.
   - **Placeholders:** a placeholder URL (with `<catalog pack id>`, `<version>` or `<id>`) is
     filled with every pack version, preset and transition of the fixture catalog with tags
     (task-019) and resolved in that tree. In this repository's files the URLs must only match a
     form: the text of `llms.txt` and "For agents" does not depend on the catalog, and this
     repository has no tag yet.
   The checks run on the fixture catalog with tags and on this repository.
5. **The path, simulated offline (CB-6).** A test plays an agent on the fixture catalog, the
   resolver of acceptance 4 standing for the network: it takes the `catalog-index.json` link under
   `llms.txt` › `## Index`, reads the index and filters it: axis `methodology` gives
   `[methodology/kanban]`; profile `small teams` gives `[methodology/kanban, phase/inception/lean]`;
   a text term found only in kanban's excerpt gives `[methodology/kanban]`. For
   `methodology/kanban` it takes `latest` (1.1.0) and that entry's `readme_url` and
   `manifest_url`, and reads them: the bytes equal `git show methodology/kanban@1.1.0:…`, and differ
   from the working tree's README and `pack.yaml`, which hold the unreleased 1.2.0.
6. **Determinism and freshness.** The committed outputs (this repository's root, the golden tree,
   `tests/fixtures/index/expected/`) are regenerated with `npm run index` and `npm run index --
   --check` exits 0 on each; the layouts are fixed by those expected files.
7. **Tests,** red first: acceptance 3–5.
8. **The live part, kept.** plan-024's and dl-014's Execution Notes record that `base`'s charter
   must list CB-6 with CB-1 and CB-2, so that its first `pack-release` records the live check.
9. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
   conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

Branch `task/task-021-agent-path`, run through `tooling-delivery` as `developer`
(`code-quality`, `testing`, `determinism`), under `npm run lint`. Tests first.

- **`src/index-urls.ts`:** `parseUrl(url)` returns `{ form, tag?, path }` for the forms `raw-main`
  (`<raw>/main/<path>`), `raw-tag` (`<raw>/refs/tags/<tag>/<path>`), `readme-github`
  (`https://github.com/…/blob/<tag>/packs/<id>/README.md`) and `github-main`
  (`https://github.com/…/blob/main/<path>`), or `undefined`; `buildUrl(parsed)` calls the builder
  of the form, so a URL matches when `buildUrl(parseUrl(url)) === url`. A tag ends at the first `/`
  after its `@`.
- **`src/index-render.ts`:** `AGENT_STEPS` (the five steps of acceptance 3) and `AGENT_NOTES` (the
  anonymous, CORS, staleness, no-server and tag sentences), rendered as a numbered list and a
  paragraph in `CATALOG.md` › "For agents" (before the URL patterns) and in `llms.txt` between the
  blockquote and `## Index`.
- **`src/readme-rules.ts`:** the command detector of `readme-command` is exported as
  `isCliCommand(text, codeLine)`, so the test of acceptance 3 runs the same rule over the two files.
- **Tests:** `tests/support/agent-urls.ts` holds the extraction (JSON strings, link targets and code
  spans through `scanMarkdown`) and the offline resolver of acceptance 4; `tests/agent-path.test.ts`
  holds acceptance 3–5 (the steps in both files, the command check, the extraction of placeholder
  URLs, every URL matched and resolved on the fixture catalog and on this repository, the simulated
  path); `tests/index-urls.test.ts` holds the parser (each form, a tag with `/` and `@`, a URL of no
  form).
- **Outputs:** the root, the golden tree and `tests/fixtures/index/expected/` are regenerated.
- **Acceptance 8:** one line in the Execution Notes of plan-024 and dl-014, committed on the
  branch.

## Execution Notes

- 2026-10-11: independent review of the body (a subagent with its own context): request changes;
  two blocking points (URLs `llms.txt` emits that no allowed form covered; a new level-2 section in
  `llms.txt` against spec-002 §3.4), six should-fix (the live part of CB-6 claimed for a charter
  that does not list it; URL extraction, matching, resolving and placeholders undefined; the
  simulated path's expected results; step 3's wording) and nits. For the second blocking point the
  layout of §3.4 is kept: the steps go in the convention's detail block. All applied while
  `pending`. Re-review: approve; its two optional nits (the advice in step 2; the reminder also in
  dl-014's Execution Notes) applied.
- 2026-10-11, build on `task/task-021-agent-path` (`532ae5c`): the tests of acceptance 3–5 were
  written first and run against empty stubs of `parseUrl`, `buildUrl`, `AGENT_STEPS` and
  `isCliCommand` (12 failures) before the code; code and tests share one commit. The review fixes
  were written test first (the parser's refusals failed before the whitelist). Acceptance 8:
  plan-024's and dl-014's Execution Notes say that `base`'s charter must list CB-6 (`52e2e79`).
- 2026-10-11: independent review of the build (a subagent with its own context): approve after
  fixes; nothing blocking; three should-fix (the parser accepted paths the index never emits,
  dot segments included; the text filter's term was also in the title; the notes were checked over
  the whole file) and nits (empty ids and versions, a guard that every `https://` of the Markdown
  files is extracted, the exact steps block and its place, a trailing blank line), applied in
  `18a0d9f`. Not re-reviewed: the fixes tighten the parser and the tests only.
- 2026-10-11: Acceptance 1–2 on Node.js 22.21.0 and 22.12.0: 752 tests pass; `lint`,
  `check:pins`, `check:schemas`, `check:packs`, `validate`, the golden `validate` and
  `npm run index -- --check` (root and golden tree) exit 0; CB-8 holds; no dependency added.
- 2026-10-11, CI (acceptance 9): run 38165921222 on `18a0d9f`, conclusion `success` for
  `validate (22.12.0)` and `validate (22.21.0)`.
- 2026-10-11: approved by the approver; CI run 38166061088 on the branch head `a7af90b` was
  `success`. Merged into `main` with `--no-ff` (`a199d3f`); the branch is removed. Next: plan-024
  task 4, examples as fixtures.
