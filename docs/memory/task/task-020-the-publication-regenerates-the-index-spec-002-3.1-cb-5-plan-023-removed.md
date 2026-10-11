---
id: task-020-the-publication-regenerates-the-index-spec-002-3.1-cb-5-plan-023-removed
type: task
title: "The publication regenerates the index (spec-002 §3.1, CB-5; the plan-023 skip removed)"
status: pending
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
  (task-019's Execution Notes: the first review's blocking point on the inputs of an N-1
  regeneration); per-version fields are still read at each version's tag;
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
3. **One index computation.** The index is computed through one function over a `TreeSource` (the
   working tree, or a commit with `catalog.yaml` overlaid); `npm run index` behaves as before: the
   files under `tests/fixtures/index/expected/` and the committed root outputs are unchanged, byte
   for byte, and `tests/index.test.ts`, `tests/index-model.test.ts`, `tests/index-render.test.ts`
   and `tests/readme-generate.test.ts` pass unmodified. `publish:pack` computes only `CATALOG.md`
   and `catalog-index.json`.
4. **The current line.** The catalog commit of `npm run publish:pack` holds `catalog.yaml`,
   `CATALOG.md` and `catalog-index.json`, the last two exactly what `npm run index` writes for the
   tree with the edited `catalog.yaml`; after it, `npm run index -- --check` exits 0 and the
   working tree is clean.
5. **An N-1 line.** The catalog commit on `main` holds the same three files, its index computed
   from `main`'s commit (its `compat.yaml`, `presets/`, `transitions/`) with the edited
   `catalog.yaml` and the repository's tags, per-version fields still read at each tag; the
   maintenance branch, its head and its working tree are untouched. A test makes `main` and the
   maintenance branch differ in a file both hold (a preset whose title differs), checks `main` out
   after the publication and shows `npm run index -- --check` exits 0, so the outputs provably come
   from `main`.
6. **`--dry-run`** leaves the repository as it was (head, tags, `main`, working tree) on both
   lines, and its report names the regenerated files as a real run does.
7. **The report.** The skip line of plan-023 (`CATALOG.md and catalog-index.json not
   regenerated …`) is gone; the Publication section gains `- Index: CATALOG.md, catalog-index.json`
   after the catalog commit line, with ` (on main)` on an N-1 line as that line has. A failure while
   computing the index after the tag is handled as the other failures after the tag: the tag is
   removed and the branch (and `main` on an N-1 line) reset (task-014's rollback), exit 1 when a
   file the index reads cannot be used (task-019's input errors: it does not parse, is not a
   mapping, is missing, or `catalog.yaml` fails its schema), 2 for a git, tag or I/O error.
8. **CB-5, a publication changes no file under `packs/`.** On the current line,
   `git diff --name-only <tag> <catalog commit>` lists exactly `CATALOG.md`, `catalog-index.json`
   and `catalog.yaml`; with `--bundled`, `git diff --name-only <tag> HEAD` adds only the feedback
   note (task-015). On an N-1 line, `git diff --name-only <catalog commit>^ <catalog commit>` lists
   exactly the same three files. `llms.txt` is never listed.
9. **The workflow and the source comments.** `pack-release-cycle` › `publish` drops the three
   plan-023 sentences and names `npm run publish:pack` as the command that makes the tag and the
   catalog commit with the regenerated index; its `version:` goes 4 → 5 (`doc-versioning`). The
   includes are checked by hand (`wingfoil-cli` W-08); `npm run -s wingfoil -- workflow list` exits
   0 and prints nothing on stderr beyond the known W-01 warnings. `wingfoil-release-intake` is
   unchanged. The source comments that describe the plan-023 skip or name plan-024 task 2b as
   pending (`src/publish.ts`, `src/index-source.ts`) are updated.
10. **The interim test refreshes are removed.** `reindex` is no longer called after a publication
    in `tests/publish.test.ts`; `bump()` keeps running the index before its release commit (the
    README sections follow a change of `pack.yaml`) and its comment no longer names a stale index.
    `publishByHand` (`tests/support/published-repo.ts`) writes the regenerated index into its
    catalog commit, as `publish:pack` does, so that no test refreshes the index after it. The
    `reindex` calls that follow `publishByHand` in `tests/validate.test.ts` and
    `tests/support/index-catalog.ts` go; `reindex` stays only for commits that are not a
    publication (its comment no longer names plan-024 task 2b); the edit that adds
    `stage/production`'s transition digests keeps its refresh. Existing assertions on the catalog
    commit's files change only to name the two index files.
11. **Tests,** red first: acceptance 3–8, each on its own; the N-1 case of acceptance 5; the
    rollback of acceptance 7 on an N-1 line whose `main` holds a preset file that does not parse
    (exit 1; the guard on the maintenance branch cannot see it) and one where a tag named by
    `main`'s `catalog.yaml`, other than the line's own tags (for example `base@2.0.0`), is missing
    (exit 2); in both, the tag is gone and `main`, the branch
    and the working tree are as before.
12. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
    conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-11: independent review of the body (a subagent with its own context): approve after
  amendments; one blocking point (the CB-5 diff of acceptance 8 on an N-1 line and with
  `--bundled`), six should-fix (missing interim call sites, the one index computation over a
  `TreeSource`, the rollback's error classes and triggers, a non-public label, the title, stale
  source comments) and four nits, all applied while `pending`. Re-review: approve; its
  should-fix (the missing tag of the rollback test is not one of the line's own tags, which the
  line check reads before tagging) and nits applied.
