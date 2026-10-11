---
id: task-021-the-agent-path-the-procedure-in-catalog.md-and-llms.txt-tested-offline-spec-002-4-cb-6
type: task
title: "The agent path: the procedure in CATALOG.md and llms.txt, tested offline (spec-002 §4, CB-6)"
status: pending
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
README and `pack.yaml` at its tag, recorded as evidence) belongs to `base`'s first
`pack-release` (wave W9): it needs the first tag on github.com. This task does not change that
release's workflow; `base`'s charter carries CB-6 with CB-1 and CB-2 (dl-014 D7).

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
3. **The procedure (§4).** `CATALOG.md` › "For agents" and `llms.txt` (a new section
   `## Finding a pack`, between `## Index` and `## Specifications`) give the same numbered steps,
   generated from one list:
   1. fetch the index at `main`;
   2. filter its `packs` locally by `axis`, `slot`, `profiles`, `status`, or text over `title`,
      `description` and `excerpt`;
   3. take the chosen pack's `latest`, and that version's `readme_url` and `manifest_url`;
   4. fetch them: they are pinned to the version's tag and never change;
   5. for resolution and compatibility, fetch `catalog.yaml` and `compat.yaml` at `main`; a preset
      or a transition by its `url`.

   They also say that the files are anonymous and CORS-enabled, may be up to 5 minutes stale, that
   no server, REST API or code search is needed, and that the tag is written as is in a URL (`/`
   and `@` included). No WingFoil CLI command appears.
4. **Offline URL checks (CB-6).** A test reads every URL in `catalog-index.json`, `CATALOG.md` and
   `llms.txt` of the fixture catalog with tags (task-019), and of this repository, and checks
   each one:
   - its pattern is one of acceptance 9 of task-019, through the helpers of `src/index-urls.ts`;
   - it resolves offline to a file that exists: a `…/main/<path>` URL to `<path>` in the working
     tree, a `…/refs/tags/<tag>/<path>` or `…/blob/<tag>/<path>` URL to `git show <tag>:<path>`, a
     `…/blob/main/<path>` URL to `<path>` in the working tree; a placeholder pattern (with
     `<catalog pack id>`, `<version>` or `<id>`) is checked once filled with a pack of the fixture
     catalog.
   Every URL found is checked: one that matches no pattern fails the test.
5. **The path, simulated offline (CB-6).** A test plays an agent on the fixture catalog, with the
   URL resolver of acceptance 4 standing for the network: from `llms.txt` it takes the index URL,
   reads `catalog-index.json`, filters it by axis, by profile and by text as acceptance 3 says,
   takes a pack's `readme_url` and `manifest_url` and reads them; the bytes equal the README and
   `pack.yaml` at that version's tag, and the README is the tag's, not the working tree's.
6. **Determinism and freshness.** The committed outputs (this repository's root, the golden tree,
   `tests/fixtures/index/expected/`) are regenerated with `npm run index` and `npm run index --
   --check` exits 0 on each; the layouts are fixed by those expected files.
7. **Tests,** red first: acceptance 3–5.
8. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
   conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
