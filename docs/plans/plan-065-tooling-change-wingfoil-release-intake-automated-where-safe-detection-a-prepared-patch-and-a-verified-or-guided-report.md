---
id: plan-065-tooling-change-wingfoil-release-intake-automated-where-safe-detection-a-prepared-patch-and-a-verified-or-guided-report
type: plan
title: "tooling-change: wingfoil-release-intake automated where safe, detection, a prepared patch and a verified or guided report"
status: draft
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","ci","intake","wingfoil"]
---

## Context

The `deliver` phase of `tooling-change` for the automation of `wingfoil-release-intake` where it is
safe, asked by the approver on 2026-11-02 and placed on 2026-11-05 after WingFoil UI's feedback plan
(plan-064) and before the `tooling-change` plan of dl-024 and dl-025: the row
"`wingfoil-release-intake` automated where safe" of `docs/owed-items.md`. The aim: a new WingFoil
release reaches the packs' ranges without a hand-run intake when nothing changed for them.

**What exists** (`main`): every intake is started by hand; the CI has no schedule and does not read
npm; the 0.3.1 and 0.3.2 intakes each needed a hand-written task (task-059, task-074): the pin and
its lockfile, the `compat.yaml` row and its `notes`, the six ranges in `catalog.yaml`,
`npm run index`, spec-001 §12's example and the golden fixture's `compat.yaml` (dl-010), and the
tests that name real releases (`tests/validate.test.ts`, `matrix.test.ts`, `runs.test.ts`,
`range.test.ts`, `compat.test.ts`) re-derived. plan-060's scratch run on 0.3.2 was all green, what
an automatic check would have reported; plan-060's recheck confirmed it. WingFoil publishes its
CHANGELOG at the GitHub tag only, not in the npm tarball (plan-060).

**The request, in six parts**, each for this repository to design and rule:
1. **Detect:** a read-only scheduled workflow (daily and by hand, `contents: read`) listing the
   `wingfoil` versions on npm missing from `compat.yaml`, each classed patch, minor or major.
2. **Prepare and verify a patch:** a deterministic script (`npm run intake:prepare -- <version>`)
   writing `record`'s mechanical part (the pin and lockfile, the `compat.yaml` row with a
   placeholder `notes`, the recomputed ranges, the index); the job runs it in its workspace, then
   the CI's checks on the new release, and reports **verified** only when the checks are green, the
   release's CHANGELOG section has no Removed, Security, Deprecated or Breaking heading and no
   Upgrading line naming a file kind a pack ships, and no new `format:` value is accepted; otherwise
   **guided**, with what differed. By that bar 0.3.1 and 0.3.2 would both have been guided.
   WingFoil's v0.4 planning weighs two inputs that would make the bar mechanical (a `wingfoil
   capabilities --format json` query, and fixed CHANGELOG lines stating formats and capabilities);
   until they are ruled, the bar reads the CHANGELOG sections.
3. **No push from CI:** the job's summary is the report and, when verified, the prepared diff an
   artifact; claude applies it on a task branch, writes the `notes` sentence, and the approver
   merges as today.
4. **The release-pinned parts derived:** the tests that name real releases read `compat.yaml` or a
   fixture the script regenerates, and spec-001 §12 points to `compat.yaml`, dl-010's equality
   checked by a test. Optional: without it, parts 1 and 2 still give detection and a report.
5. **Minor or major:** the job's report (the CHANGELOG sections as a checklist, the checks on the
   new release, the packs and directives each item touches) is the input to the guided intake plan.
6. **`retrospective-start` for a verified patch:** the approver rules, once, whether a verified
   patch takes dl-029 T2's patch case by default.

**`main`'s CI before this plan** (dl-038 C3): plan-064's last push, its close, read here before
`submit`.

**Not in this plan:** any change to plan-060's record of 0.3.2 or to plan-061; the `tooling-change`
plan of dl-024 and dl-025 (after this one); WingFoil's own inputs (its capabilities query, its
CHANGELOG lines).

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **One `tooling-change` plan, four tasks**, one `tooling-delivery` v3 iteration each, under WIP 1,
   in this order (each depends on the one before):
   - (A) **detect**: `src/intake-detect.ts` and `npm run intake:detect`, reading the registry's
     version list (`npm view wingfoil versions --json`, its output injectable for the tests) and
     `compat.yaml`, printing the missing versions and their class (patch, minor, major against the
     newest recorded), and `.github/workflows/intake.yml` (schedule daily and `workflow_dispatch`,
     `permissions: contents: read`, actions pinned by SHA as `ci.yml`'s test asserts), its summary
     written to the job summary; red first with a test of the workflow file as `ci-workflow.test.ts`
     does, and of the script on fixture lists;
   - (B) **prepare**: `src/intake-prepare.ts` and `npm run intake:prepare -- <version>`, writing the
     pin folder (`package.json` with the exact version, the lockfile by `npm install
     --package-lock-only --ignore-scripts`), the `compat.yaml` row (`reads` and `capabilities`
     copied from the newest recorded release, `format_key: true`, `notes: "TO BE WRITTEN at the
     intake"`), the recomputed ranges in `catalog.yaml` (the code `check:packs`' `catalog-range`
     already uses), the golden fixture's `compat.yaml` (dl-010), and `npm run index`; deterministic
     (two runs byte-identical) and refusing a version already recorded; tested offline with a
     fixture tree;
   - (C) **verify and report**: the intake job runs (B) in its workspace, then the CI's checks on
     the new release (the matrix for it, `validate`, the golden step, the overlays, `check:runs`,
     `validate:publication`), reads the release's CHANGELOG section from the GitHub tag, and writes
     the report, **verified** or **guided**, with the prepared diff as an artifact
     (`actions/upload-artifact`, pinned); never a push, a pull request or a comment;
   - (D) **derived release-pinned parts** (part 4): the tests that name real releases read them
     from `compat.yaml` (or the fixture (B) regenerates), and spec-001 §12's example replaced by a
     pointer to `compat.yaml` with dl-010's equality checked by a test, an amendment of spec-001 in
     place approved by the task's merge OK, as task-059 and task-074 did for §12.
2. **The bar of "verified"** (part 2). Recommended as the request writes it, read conservatively:
   the CHANGELOG section's headings `Removed`, `Security`, `Deprecated` or one containing
   `Breaking`, and any `Upgrading` line naming a file kind of `compat.yaml`'s `kinds`, make it
   guided, as does a red check, a missing or unreadable CHANGELOG section, a minor or a major, or a
   `format:` value the release accepts beyond those recorded (read from the matrix's run on it);
   the report lists each reason. A verified report is a proposal, never a record: the intake plan
   still writes `notes` and the approver merges.
3. **Network access.** Recommended: only the detect and verify job reads the network (the npm
   registry, the GitHub tag's CHANGELOG over HTTPS, no token); `ci.yml` stays as it is; tests stay
   offline (the `testing` directive), with the registry's and the CHANGELOG's responses as
   fixtures.
4. **The intake for a verified patch** (part 3 and part 6). Recommended: a governance decision-log
   of its own, hosted here (`decision-log-ingest` › `capture`, then the approver's `rule`), for
   `wingfoil-release-intake` v7: a verified patch's intake runs its phases on the prepared diff
   (`record` applied from the artifact, `recheck` read from the report, `plan-migrations` empty by
   the bar, `notify` as today), and part 6, whether a verified patch takes dl-029 T2's patch case by
   default in `retrospective-start` (recommended: yes, the retrospective covering it closing before
   WingFoil's next release planning, as T2's patch case says, so the automatic path is not held by
   a hand-run phase); applied by this plan's last row after its ruling.
5. **The checks** (dl-039): each task's build review first, then once on its frozen commit its
   branch CI and the local list; the intake workflow's first real run (`workflow_dispatch` on `main`
   after the merge) recorded at the close, with no missing version expected (0.3.2 is the newest).
6. **G12** (dl-039 R3): the intake job is separate from `ci.yml` and runs only when a version is
   missing, so the CI's duration is unchanged; the intake job's duration recorded at its first run
   with a version (or at the close for a no-op run).
7. **The reply about this plan**, as asked by the approver on 2026-11-05: this plan's id and its
   `submit` commit once filed, and the plan id of the first automated intake later; its text shown
   to the approver first; nothing of it written here beyond this point.

## The approver's rulings

<!-- Filled when the approver rules the outline. -->

## Steps

<!-- Written after the rulings: the four tasks in order (each added only after the one before is
     done, W-14), the decision-log of point 4 and its row, the workflow change after its ruling,
     the close. -->

## Handoff

- **claude (facilitator, developer):** the tasks, the decision-log's text and the close, except the
  approvals and the merge OK. It never runs `memory approve` or `memory reject`: it gives the
  approver the command, with `cd` and `--reason`. No pull request. Files staged by name.
- **Reviewers (subagents):** this plan; each task's body and build; the decision-log; re-reviews
  when a fix changes a decision (dl-017).
- **Approver:** the outline (before `submit`); each task's gates; the decision-log's ruling; the
  merge OKs; the reply's text.
- Done when the four tasks are done and merged into `main`, the decision-log ruled and applied, the
  intake workflow's first run read, the register's row Closed, the reply sent, and `main`'s CI read.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written as asked by the approver on 2026-11-02 and 2026-11-05, after plan-064's
  merge; `workflow` and `phase` filled by editing the draft (W-02). Next free numbers when written:
  plan-066, task-078, dl-042, bug-016, prel-007, F-047.
