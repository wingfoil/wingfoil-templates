---
id: plan-065-tooling-change-wingfoil-release-intake-automated-where-safe-detection-a-prepared-patch-and-a-verified-or-guided-report
type: plan
title: "tooling-change: wingfoil-release-intake automated where safe, detection, a prepared patch and a verified or guided report"
status: active
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
its lockfile, the `compat.yaml` row and its `notes`, the six ranges in `catalog.yaml`, `npm run
index`, spec-001 §12's example and the golden fixture's `compat.yaml` (dl-010), and the two tests
that name real releases (`tests/compat.test.ts`, `tests/validate.test.ts`) re-derived; `matrix`,
`runs` and `range` tests use synthetic releases. plan-060's scratch run on 0.3.2 was all green, what
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

**`main`'s CI before this plan** (dl-038 C3): plan-064's last push, its close, pushed with this
plan's `submit`: that run is read and recorded in the Execution Notes.

**Not in this plan:** any change to plan-060's record of 0.3.2 or to plan-061; the `tooling-change`
plan of dl-024 and dl-025 (after this one); WingFoil's own inputs (its capabilities query, its
CHANGELOG lines).

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **One `tooling-change` plan, four tasks**, one `tooling-delivery` v3 iteration each, under WIP 1,
   each added only after the one before is done (W-14), in this order:
   - (A) **detect**: `src/intake-detect.ts` and `npm run intake:detect`, reading the registry's
     version list (`npm view wingfoil versions time --json`, injectable for the tests) and
     `compat.yaml`; ignoring pre-releases and unpublished versions; each missing version validated
     as strict `X.Y.Z` before it reaches a path or a shell, classed against its predecessor (patch;
     minor or major, a 0.x minor counting as breaking); a version below the newest recorded (a
     backport) reported guided, never prepared; several missing versions listed and prepared one at
     a time. `.github/workflows/intake.yml`: `schedule` daily and `workflow_dispatch`, `permissions:
     contents: read`, actions pinned by SHA, `concurrency` with no cancel of a running verify,
     `timeout-minutes`; its signal (point 5). Merged first, so that the file exists on `main` for
     `workflow_dispatch`;
   - (D) **the release-pinned parts derived**, second, so that a prepared diff passes `npm test`
     without hand edits: task-045's rule kept (only `tests/compat.test.ts` and
     `compat-fixture.test.ts` read the real `compat.yaml`, every other test takes `FROZEN_COMPAT`);
     `tests/validate.test.ts`'s stubs, keyed today by each real release (`'0.3.2 (6de2e13c)'`),
     derived for every release the file lists; spec-001 §12's example and its prose per release
     replaced by a pointer to `compat.yaml` (each release's facts in its `notes`; §12 keeps the
     vocabulary and the rules that `record` and dl-021 cite; 0.2.2's row unchanged, so
     `FROZEN_COMPAT`'s prefix test holds), the spec half of `compat.test.ts`'s dl-010 equality
     dropped and the fixture half kept, an amendment of spec-001 in place approved by the task's
     merge OK (as task-059 and task-074 did for §12); dl-009's Execution Note per intake stopped
     (point 4's decision);
   - (B) **prepare**: `src/intake-prepare.ts` and `npm run intake:prepare -- <version>`, writing the
     pin folder (`package.json` with the exact version and a fixed description naming no task, the
     lockfile by `npm install --package-lock-only --ignore-scripts` with the job's named Node.js and
     npm), the `compat.yaml` row (`reads` and `capabilities` carried from the newest recorded
     release under point 4's reading of dl-021 R4, `format_key: true` written provisionally and
     confirmed by verify's zero-warning publication run, a mismatch making the report guided,
     `notes` a placeholder), the recomputed ranges in `catalog.yaml` (the code `check:packs` uses,
     in `src/tag-rules.ts`), the golden fixture's `compat.yaml` (dl-010), and `npm run index`;
     deterministic for a given lockfile (two runs byte-identical, tested offline with an injected
     resolver and a fixture tree); refusing a version already recorded;
   - (C) **verify and report**, two jobs: **prepare** runs (B) and runs no WingFoil release, then
     uploads the diff (`actions/upload-artifact`, pinned, `retention-days` set), restricted to an
     allowlist (`src/matrix/wingfoil-<v>/`, `compat.yaml`, `catalog.yaml`, `CATALOG.md`,
     `catalog-index.json`, the fixture's `compat.yaml`), each file's sha256 in the report;
     **verify** downloads it and runs the checks on the new release (`npm test`, the matrix for it,
     `validate`, the golden step, the overlays, `check:runs`, `validate:publication`, `check:pins`,
     `npm audit` on the new lockfile) on Node.js 22.21.0 and 22.12.0, with no `actions/cache` save;
     reads the CHANGELOG section from a URL fixed in code (`wingfoil/wingfoil`, tag `v<version>`,
     never the registry's `repository` field), its text written only to the job summary, escaped as
     `ci.yml` escapes; writes the report, **verified** or **guided** (point 2). Never a push, a pull
     request or a comment. The verified lockfile is the artifact's, applied as is at the intake,
     never regenerated, the sha256s checked on apply, before the intake writes `notes`. A
     `workflow_dispatch` input re-verifies a recorded version (the newest by default) against a tree
     with that release removed, its report labelled a rehearsal, never for intake: the way (C) is
     tried on its branch and its durations measured.
2. **The bar of "verified".** Recommended, read conservatively; any of these makes it guided, each
   reason listed: a red check or an advisory; a minor, a major or a backport; a CHANGELOG section
   missing or unreadable, or a tag not yet published; a heading `Removed`, `Security` or
   `Deprecated`, or one containing `Breaking`; any line naming `format`, `format:` or a kind of
   `compat.yaml`'s `kinds`; any `Added` or `Changed` entry naming a command or a feature (a possible
   capability, dl-021 R4). `format_key: true` is measured, by publication mode's zero-warning run.
   No probe of unknown `format:` values (WingFoil's refusal of one is not established). Measured
   against 0.3.1 and 0.3.2, both would have been guided: their CHANGELOGs add commands and
   features. A verified report is a proposal, never a record.
3. **Network access.** The only new endpoints are the npm registry's version list and the GitHub
   tag's CHANGELOG, over HTTPS, with no token; `ci.yml` is unchanged; tests stay offline (the
   `testing` directive), the responses as fixtures. `--before=<publish time>` for the lockfile is
   not used (it would freeze older, possibly vulnerable, dependencies); the audit decides.
4. **A governance decision-log**, hosted here (`decision-log-ingest` › `capture`, then the
   approver's `rule`), for `wingfoil-release-intake` v7, with the options (a) no workflow change,
   the report feeding today's hand-run `record`; (b) v7: a verified patch's intake applies the
   artifact in `record`, reads `recheck` from the report, `plan-migrations` empty by the bar,
   `notify` as today; (c) a separate patch-intake workflow. Recommended (b), with: dl-021 R4 read as
   a carry-forward (a capability carries over unless the CHANGELOG removes it; a new one only from
   an `Added` entry, which makes the report guided); dl-009's note per intake stopped (§12's facts
   in `notes`); part 6, a verified patch takes dl-029 T2's patch case by default only while a
   retrospective covering its window is open or due, at most three patches or 14 days after the
   intake that started it, whichever comes first, never extending the covering retrospective's own
   deadline (T2's seven days when the planning date is not known; dl-040 D1 … D3). Captured and
   ruled before (D) starts, since (D) and (B) rely on its reading of dl-021 R4 and on dl-009's note
   stopped; only `wingfoil-release-intake` v7 is applied by a dl actions row of this plan at the
   end: a departure from the separate dl actions plan of plan-062, stated, since the change belongs
   with the tooling it serves.
5. **Detection's signal.** A green scheduled run nobody reads is no signal. Recommended: a run that
   finds a missing version ends red, with an `::error::` naming it (GitHub notifies the workflow's
   last editor), and stays red daily until the intake records it (the reminder that a guided intake
   is due; repository-practice rule 3 covers `ci.yml`'s runs of `main`, not this workflow); GitHub
   notifies whoever last edited the schedule, the approver's identity, which pushes `main`; the
   register's row "the intake workflow read" asks the approver to read its runs weekly, since GitHub
   disables a scheduled workflow after 60 days without repository activity.
6. **The checks** (dl-039): each task's build review first, then once on its frozen commit its
   branch CI and the local list. (C)'s jobs are tried on its branch by `gh workflow run intake.yml
   --ref task/<id>` (`actions: write`, run by claude with the approver's OK each time), with the
   rehearsal input; the workflow's first run on `main` after the last merge recorded at the close, a
   rehearsal of 0.3.2 and a scheduled run with no missing version.
7. **G12** (dl-039 R3): `intake.yml` is separate from `ci.yml` and verifies only when a version is
   missing, so the CI's duration is unchanged; its jobs' durations recorded from the rehearsal.
8. **The reply about this plan**, as asked by the approver on 2026-11-05: this plan's id and its
   `submit` commit once filed, its text shown to the approver first; the plan id of the first
   automated intake later, a row of `docs/owed-items.md` at the close; nothing of the requester
   written here or in that row.

## The approver's rulings

Given by the approver on 2026-11-05: every point of the outline as recommended.
1. **Point 1:** four tasks in the order (A), (D), (B), (C), each added after the one before is done.
2. **Point 2:** the bar of "verified" as written, conservative; no format probe.
3. **Point 3:** the registry and the tag's CHANGELOG the only new endpoints; tests offline; no
   `--before`.
4. **Point 4:** the decision-log for `wingfoil-release-intake` v7, option (b) proposed, captured and
   ruled before (D).
5. **Point 5:** a red run while a version is missing; a register row for the weekly reading.
6. **Point 6:** dl-039's checks; (C) tried by dispatch with the approver's OK each time.
7. **Point 7:** durations from the rehearsal.
8. **Point 8:** the reply after `submit`, its text shown first; a row for its later part.

## Steps

1. **This plan:** `submit` (`draft → active`), `main` pushed with plan-064's close; `main`'s CI
   read.
2. **The reply** (point 8): its text shown to the approver, then sent.
3. **The decision-log** (point 4; `decision-log-ingest` › `capture`, hosted here): written on `main`
   (its `memory add` there, W-14), reviewed and re-reviewed, `submit`, the approver's `rule`; its
   rows (dl-036 R2).
4. **Task (A)**, then **(D)**, then **(B)**, then **(C)**: each `memory add` on `main` when the one
   before is done (W-14), its `tooling-delivery` v3 loop (body review, the approver's acceptance,
   design with its red steps, build test first, build review, dl-039's checks on the frozen commit,
   the approver's approval, `--no-ff` merge into `main`, `main`'s CI read), the register's rows
   with their notes.
5. **The dl actions row:** `wingfoil-release-intake` v7 as ruled, on a branch of its own, reviewed,
   merged on the approver's OK.
6. **Close:** the workflow's first runs on `main` (a rehearsal of 0.3.2, a scheduled run with no
   missing version) and their durations; the rows (the weekly reading, the reply's later part); the
   register's row of this request to Closed; `main`'s CI on the last merge read; `active → done`.

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
- 2026-11-05: independent review: approve after amendments, three blocking (task-045's rule for
  (D); the format clause not measurable; copying capabilities against dl-021 R4); applied with the
  others: (D) second, the two jobs and the artifact's allowlist and sha256, the lockfile applied as
  is, the missing checks, detection's signal and edge cases, the CHANGELOG's fixed source, the
  branch runs by dispatch, point 4's options and bounds, the reply's later part as a row.
- 2026-11-05: re-review: approve after small amendments; applied: the Context's test list, the
  decision-log ruled before (D), a rehearsal input for (C), `format_key` provisional and confirmed,
  the bound's "whichever first" and the covering deadline, rule 3's scope, 0.2.2's row unchanged,
  the sha256s checked before `notes`, the pin's fixed description.
- 2026-11-05: submitted (`4a16fe5`), pushed with plan-064's close; `main`'s CI on it, run
  42119230419, `success`, jobs Node.js 22.12.0 12 min 30 s and 22.21.0 15 min 46 s (none over 25
  minutes). Step 2: the reply about this plan, its text shown to the approver first, sent on
  2026-11-05 with this plan's id and its `submit` commit. Step 3: the decision-log added (dl-042).
- 2026-11-06: step 4, task (A): task-078 accepted, built test first, reviewed and re-reviewed,
  approved by the approver, merged into `main` (`0d0603b`) and done; its branch CI run 42126405576
  `success` (16 min 25 s, 19 min 57 s); `intake.yml` dispatched once, run 42177750411 `success` in
  13 s, `no missing version`; the weekly reading's row added (ruling 5, dl-036 R2). Next, task (D).
- 2026-11-06: step 4, task (D): task-079 approved by the approver, merged into `main` (`972dc3e`)
  and done; `main`'s CI run on the merge cancelled by the next push, run 42224371231 on
  `bfbf08c` (docs only after the merge) `success` (22.21.0 20 min 51 s, 22.12.0 16 min 25 s).
- 2026-11-06: step 4, task (B): task-080 accepted, built test first, reviewed and re-reviewed,
  approved by the approver, merged into `main` (`dfd14a9`) and done; its branch CI run
  42227582673 `success` (22.12.0 20 min 21 s, 22.21.0 20 min 17 s); a scratch clone's 0.3.3
  prepared by `intake:prepare` touched only (C)'s seven files, 1103 of 1103 tests passing with
  `check:pins`, `index --check` and `check:packs` green. `main`'s CI on this push is read by
  the next note. Next, task (C).
- 2026-11-07: `main`'s CI on the previous note's push (`9606fed`), run 42247880434, `success`
  (22.21.0 19 min 34 s, 22.12.0 17 min 29 s). Step 4, task (C): task-081 accepted, built test
  first, reviewed and re-reviewed, approved by the approver, merged into `main` (`650a064`) and
  done; its branch CI run 42257607151 `success` (13 min 23 s, 13 min 54 s); the rehearsal of
  0.3.2, dispatched on its branch with the approver's OK, run 42259278303 `success`, its report
  guided with 7 reasons as expected, every check of `verify` green on both Node.js versions, the
  run 19 min 33 s (`verify` 13 min 1 s and 18 min 24 s; `ci.yml` unchanged, G12). The four tasks
  are done; next, the dl actions row (step 5), then the close (step 6). `main`'s CI on this push
  is read by the next note.
- 2026-11-07: `main`'s CI on the previous note's push (`af17a18`), run 42349907172, `success`
  (22.21.0 18 min 10 s, 22.12.0 20 min 57 s). Step 5, the dl actions row: on
  `dl/dl-042-actions`, `wingfoil-release-intake` v7 (`befee13`, dl-042 I1 … I4) and the notes on
  dl-009, dl-021, dl-029 and dl-042 (`11dbb53`); reviewed: approve after amendments, no blocking,
  applied (`6bf447b`: the directives left to the guided intake, a guided intake checking what
  `intake:prepare` carries forward, T2's seven days cited, wording and wraps); WingFoil reads v7
  with no diagnostic; its branch CI run 42350312944 `success` (18 min 32 s, 20 min 1 s); merged
  on the approver's OK (`efe2526`). Next, the close (step 6).
