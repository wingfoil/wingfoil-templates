---
id: task-020-the-publication-regenerates-the-index-spec-002-3.1-cb-5-plan-023-removed
type: task
title: "The publication regenerates the index (spec-002 §3.1, CB-5; plan-023 removed)"
status: draft
pack: ""            # tooling task (tooling-change › deliver, tooling-delivery)
depends_on: ["task-019-the-index-command-catalog.md-catalog-index.json-llms.txt-and-the-readme-generated-sections-spec-002-3-cb-4-cb-5"]
tags: ["tooling","W14","F2.8"]
---

## Context

Task 2b of plan-024 (`tooling-change` › `deliver`, wave W14, F2.8). Tooling task, no pack. Below,
"plan-024 task N" names a step of that plan, not a Memory element.

It comes from:
- **the approver's ruling of 2026-10-11** on task-019's review: dl-014 D7 T2 runs as two tasks;
  task-019 delivered the index command, this task the publication;
- **dl-014 D2 and D6, spec-002 §3.1:** `pack-release-cycle` › `publish` and
  `wingfoil-release-intake` regenerate `CATALOG.md` and `catalog-index.json`; **§6 CB-5:**
  publishing a version changes no file under `packs/`;
- **plan-023:** until `npm run index` existed, `publish:pack` and `pack-release-cycle` ›
  `publish` (v4) left `CATALOG.md` and `catalog-index.json` unchanged and recorded the skip;
  "Task 2b removes that rule" (plan-024);
- **task-014** (`npm run publish:pack`: the guard, the tag, the catalog commit, `--dry-run` in a
  temporary clone) and **task-016** (the line policy: on an N-1 line the tag goes on
  `maint/<id>/<major>.x` and the catalog commit on `main`, made with plumbing so that the
  maintenance working tree is untouched);
- **task-019:** `buildIndex`, the renderers and the interim test refreshes this task removes
  (`tests/publish.test.ts` and `tests/support/published-repo.ts`, its Execution Notes).

Facts the Acceptance relies on:
- the tag precedes its catalog entry (spec-001 §11), so the index of the catalog commit can read
  every tag it names, the new one included;
- on an N-1 line the maintenance branch's `catalog.yaml`, `compat.yaml`, `presets/` and
  `transitions/` may differ from `main`'s; the index of the catalog commit on `main` is computed
  from `main`'s commit with the edited `catalog.yaml`, never from the maintenance working tree
  (task-019's review, B1);
- a publication changes no README: the generated sections come from the pack's own files only
  (spec-002 §2.2), and the guard (`validate:publication`, with `index --check`) has already found
  them fresh; `llms.txt` does not depend on the catalog (task-019 acceptance 8);
- `wingfoil-release-intake` (v3) already names `npm run index` in `record` and needs no change.

Not in scope: the agent path (plan-024 task 3), examples (task 4), the root `README.md` (task 5),
the search page (task 6); pushing (the tool never pushes, task-014); CB-8: `catalog.yaml`'s format,
`compat.yaml` and `schema/` do not change.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network. `npm run validate` exits 0, and so does
   `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden`.
2. **CB-8.** `git diff --exit-code origin/main -- catalog.yaml compat.yaml schema/` exits 0 on the
   task branch.
3. **The current line.** The catalog commit of `npm run publish:pack` holds `catalog.yaml`,
   `CATALOG.md` and `catalog-index.json`, the last two exactly what `npm run index` writes for the
   tree with the edited `catalog.yaml`; after it, `npm run index -- --check` exits 0 and the
   working tree is clean.
4. **An N-1 line.** The catalog commit on `main` holds the same three files, its index computed
   from `main`'s commit (its `compat.yaml`, `presets/`, `transitions/`) with the edited
   `catalog.yaml` and the repository's tags; the maintenance branch, its head and its working tree
   are untouched. A test makes `main` and the maintenance branch differ (a preset only on `main`),
   checks `main` out after the publication and shows `npm run index -- --check` exits 0.
5. **`--dry-run`** leaves the repository as it was (head, tags, `main`, working tree) on both
   lines, and its report names the regenerated files as a real run does.
6. **The report.** The skip line of plan-023 (`CATALOG.md and catalog-index.json not
   regenerated …`) is gone; the Publication section gains `- Index: CATALOG.md, catalog-index.json`
   after the catalog commit line. A failure while computing the index after the tag is handled as
   the other failures after the tag: the tag is removed and the branch (and `main` on an N-1 line)
   reset, exit 1 for an index input error and 2 otherwise (task-014's rollback).
7. **CB-5, a publication changes no file under `packs/`.** On both lines, `git diff --name-only
   <tag> <catalog commit>` lists exactly `CATALOG.md`, `catalog-index.json` and `catalog.yaml`
   (and the feedback note with `--bundled`, task-015), and never `llms.txt`.
8. **The workflow.** `pack-release-cycle` › `publish` drops the plan-023 sentences and says that
   `npm run publish:pack` makes the catalog commit with the regenerated index; its `version:` goes
   4 → 5 (`doc-versioning`). The includes are checked by hand (`wingfoil-cli` W-08);
   `npm run -s wingfoil -- workflow list` exits 0 and prints nothing on stderr beyond the known
   W-01 warnings. `wingfoil-release-intake` is unchanged.
9. **The interim test refreshes are removed.** `reindex` is no longer called after a publication
   in `tests/publish.test.ts`; `bump()` keeps running the index before its release commit (the
   README sections follow a change of `pack.yaml`) and its comment no longer names a stale index.
   `publishByHand` (`tests/support/published-repo.ts`) writes the regenerated index into its
   catalog commit, as `publish:pack` does, so that no test refreshes the index after it. Existing
   assertions on the catalog commit's files change only to name the two index files.
10. **Tests,** red first: acceptance 3–7, each on its own; the N-1 case of acceptance 4; the
    rollback of acceptance 6 with an index failure after the tag.
11. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
    conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
