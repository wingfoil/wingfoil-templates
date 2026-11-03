---
id: plan-060-wingfoil-release-intake-record-wingfoil-0.3.2
type: plan
title: "wingfoil-release-intake record: WingFoil 0.3.2"
status: draft
workflow: "wingfoil-release-intake"
phase: "record"
tags: ["wingfoil","intake","compat"]
---

## Context

WingFoil 0.3.2 was published on 2026-11-02 (npm, 17:12 UTC, dist-tag `latest`): tag `v0.3.2` on
`wingfoil/wingfoil`, build `6de2e13c`, a patch of the 0.3 line. `wingfoil-release-intake` v5
records it, asked by the approver on 2026-11-02 (plan-059's close: this intake first, with the
periodic retrospective its close starts, then the plan of WingFoil UI's feedback). The model is
plan-051 (the intake of 0.3.1).

The plan is filed under `record`, the phase that carries the work; it also records the outcome of
`recheck`, `plan-migrations` and `retrospective-start` (v5's last phase, dl-029 T1 and T2). Its
roles (tech-lead, reviewer, product-owner, facilitator) are run by claude; `record`'s
`approval: { by_role: approver }` is the approver's acceptance of the task and the merge OK.

**What 0.3.2 provides**, read in its CHANGELOG (`[0.3.2]`, at the tag) and checked by running it
(below): "a patch of the 0.3 line, mostly fixes"; a project initialised by 0.3.1 keeps working,
nothing needs migrating. No format version is named. Added: short element references
(`task-1`, a unique prefix) for the Memory commands and `--element`. Changed: `init`'s commit
subject. Fixed, among others, inputs now refused or treated differently: a `memory.yaml` type
`path` absolute or holding `.` or `..`, or a malformed `id_pattern` (`E_VALIDATION`); an extra
`paths` category of `dna.yaml` that is not a list of strings; a directive missing a required
header field; `directives list` exiting 1 on an unreadable `roles.yaml`; `directive remove` on an
uncommitted directive; `agent execute` printing the deduction's warnings; `init`'s scaffold
(commented `team.members` and `paths.health` examples; `contributor`, `credit`, `reported_by` in
the `adr`, `bug`, `decision-log` and `tech-spec` templates; `backlog_committed`, `waves` and a
`## Scope changes` table in `release`).

**Already run** (2026-11-03, outside the repository: a scratch clone of `main` at `b5b8bff` with
0.3.2 added to `compat.yaml`, its pin written as `src/matrix/wingfoil-0.3.2/` and the six published
ranges widened; not committed): the pin's lockfile `npm audit` 0 vulnerabilities; `--version`
prints `0.3.2 (6de2e13c004bbf419acfa7dc4d98d5a7468cd693)`, the form the matrix accepts;
`check:pins` and `check:packs` exit 0; the matrix's three commands on the nine README examples,
self-test (0.3.0 and 0.3.2) 18 runs and publication 18 runs, 0 failed; the overlays
`software-exit`, `scrum-exit` and `kanban-exit` 26 runs each, 0 failed; the golden tree 26 runs, 0
failed; `check:runs` 46 runs, 0 failed (the starts and the adoption runs, `init` on 0.3.2
included). The only failure, `index -- --check` in `validate`, came from the scratch edit itself
(`npm run index` not rerun). So no pack of `main` meets an input 0.3.2 now refuses; the recheck
(step 3) repeats this on the committed state.

**State at writing.** `main` at `b5b8bff`, CI run 41538621346 `success`. `compat.yaml` lists 0.2.2,
0.3.0 and 0.3.1. Published, each with the range `>=0.3.0 <=0.3.1`: `base` 1.0.0, 2.0.0, 2.0.1;
`software` 1.0.0; `methodology/scrum` 1.0.0; `methodology/kanban` 1.0.0. `main`'s `packs/` equals
the tags `base@2.0.1`, `software@1.0.0`, `methodology/scrum@1.0.0` and `methodology/kanban@1.0.0`
(`git diff` empty). This repository's own WingFoil stays 0.2.2 (W10).

**The CI's duration** (G12's row, its trigger W10 as the approver ruled on 2026-11-02). Measured on
`main`'s last three CI runs: the job lasts 12 min 13 s … 19 min 55 s of its 30-minute timeout
(`b5b8bff`: 19 min 19 s and 19 min 55 s), `npm test` 556 … 895 s of it, the six matrix steps
(`validate`, the golden tree, the three overlays, `check:runs`) 2 min 32 s … 4 min 25 s. The
spread is the runner's (the same commit's two jobs differ by up to 5 min). The matrix selects the
oldest and the newest compatible release (`src/matrix.ts`, `selectReleases`), so adding 0.3.2
replaces 0.3.1 as the newest and **the run counts do not grow** (validate 18, overlays 26 each,
golden 26, `check:runs` 46, as the scratch run shows); the cost is one install of 0.3.2 when the
matrix cache misses, and the tests the task adds.

**Next release planning of WingFoil** (for `retrospective-start`): not announced. On WingFoil's
`main` (2026-11-02, the merge forward of 0.3.2), `minor-v0.4` is `planning` with no
release-planning plan yet; WingFoil's dl-186 has v0.4's planning start after the `v0.3.2` tag. The
estimate given on 2026-10-28 was "not before 2026-11-06".

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **One task, task-074 "record WingFoil 0.3.2"** (`tooling-delivery`, `pack: ""`, as `developer`,
   red first, dl-018), as task-059 did for 0.3.1; plan-051's task-058 is not needed again, since
   `check:runs` already runs every selected release. Its content:
   - `src/matrix/wingfoil-0.3.2/`: `package.json` pinning exactly 0.3.2, its lockfile
     (`npm install --package-lock-only --ignore-scripts`), `npm audit` 0, `check:pins`;
   - `compat.yaml`: release 0.3.2, `format_key: true`, `reads` at format 1 for the seven kinds,
     `capabilities: [workflow-engine]`, and `notes`: format 1; no new capability (short references
     are needed by no pack, dl-021 R4); the inputs 0.3.2 refuses (`memory.yaml` paths and
     `id_pattern`, `dna.yaml` extra `paths`, a directive's header) met by no pack (the matrix);
   - in the same commit (`check:packs`' `catalog-range` fails in between): `catalog.yaml`'s
     `wingfoil` field of the six published versions edited by hand to `">=0.3.0 <=0.3.2"`, as
     plan-051 ruled (spec-001 §11 and §12 allow it; `addVersion` writes only at publication);
     `npm run index` regenerates `CATALOG.md` and `catalog-index.json`;
   - spec-001 amended in place (the merge OK approves the text, as task-059): §12's example and
     the golden fixture's `compat.yaml` equal to the real file (dl-010), §12's prose gaining
     0.3.2's check, an Execution Note; dl-009's Execution Note for 0.3.2 (its 0.3.1 note goes
     stale: the selections become 0.3.0 and 0.3.2, the golden tree 0.2.2 and 0.3.2);
   - the tests re-derived, each expectation stated in the task's Design: `compat.test.ts` (the real
     releases, the range, the sample release after the newest), `validate.test.ts` (the releases
     each label names, a 0.3.2 stub printing `0.3.2 (6de2e13c)`), `runs.test.ts` and
     `matrix.test.ts` where they name the newest release; unchanged where a test builds on
     `FROZEN_COMPAT` or a fixture's own `compat.yaml`;
   - `.github/workflows/ci.yml`: its header and step names if they name a release.
   Alternative: two tasks (the pin first, then the record), as plan-051; not recommended, the pin
   alone proves nothing new.
2. **The recomputed ranges:** every published version takes `">=0.3.0 <=0.3.2"`: `base` 1.0.0, 2.0.0,
   2.0.1, `software` 1.0.0, `methodology/scrum` 1.0.0, `methodology/kanban` 1.0.0. `base` 1.0.0 is
   widened like the others, as plan-051 did: its matrix passes, its `check:runs` fails as bug-005
   and bug-006 say (the row "known defects" marker in `catalog.yaml` stays open for the periodic
   retrospective). Alternative: leave `base` 1.0.0 at `<=0.3.1`; not recommended, the range is
   computed from formats and capabilities (spec-001 §12), not from known defects.
3. **Who runs `recheck`:** claude as reviewer, after task-074 is on `main`, then an independent
   subagent (dl-017) checks the recorded results against the logs and repeats a sample (one pack's
   matrix and the `base@1.0.0` scratch run). What it covers, as plan-051 step 3:
   - every active pack on 0.3.0 and 0.3.2: `validate:publication` and `check:runs` on `main`
     (whose packs equal their tags, stated with the diff), the self-test, the golden tree and the
     three overlays;
   - `base@1.0.0` on a scratch copy of its tag with `main`'s `compat.yaml`: the matrix passes,
     `check:runs` fails as bug-005 and bug-006 say;
   - the install steps of the four READMEs on a project initialised by 0.3.2 (the adoption runs of
     `check:runs` cover `init` and `workflow list`; the recheck also reads 0.3.2's new `init`
     scaffold, the templates' fields and the `dna.yaml` examples, against what the READMEs tell an
     adopter to copy or replace, and records any text to fix; a published README is frozen until
     its pack's next version).
   Not rerun: task-057's scrum run and task-069's kanban run by hand. The engine's behaviour
   changed only in `agent execute`'s warnings and the Memory commands' short references, which
   those runs do not use; their scripted form stays an owed row. Alternative: rerun both by hand on
   0.3.2 (about an hour each, recorded as dl-037 E2 says).
   A defect a pack shows on 0.3.2 is a bug (bug-010) and a task.
4. **The CI's duration:** no CI change in this plan: the run counts stay as they are (Context), and
   G12 keeps its trigger W10 (the approver's ruling of 2026-11-02). task-074's notes record its
   branch CI's job durations, and this plan's close `main`'s, beside the figures above, as G12's
   evidence. 0.3.1 leaves the CI's selection (oldest and newest); it stays in `compat.yaml` and in
   every range. Alternative: an earlier trigger for G12 (a job over 25 minutes reported to the
   approver at once); for the approver, not recommended now.
5. **`plan-migrations`:** recorded as empty unless `recheck` finds a format 0.3.2 reads differently.
6. **`retrospective-start`** (dl-029 T1, T2): a periodic retrospective **starts** at this intake's
   close: since 0.3.2 was published none has closed (plan-059's inventory has the scope
   `pack-methodology-kanban`, not `periodic`), and the patch case of T2 is not taken (the
   approver's order of 2026-11-02). Its plan (plan-061, `workflow: retrospective-periodic`, phase
   `retrospective`, filled by editing the draft, W-02) follows plan-054's shape (explore,
   additional-points, capture, approve):
   - **period:** from 2026-10-29 (plan-054's close, `f478934`) to this intake's close;
   - **sources:** what the inventory of 2026-11-02 (`pack-methodology-kanban`) did not read:
     plan-055 (the dl actions of dl-029 … dl-033), plan-059 itself, this plan and task-074, the
     owed rows added since, F-042, and the rules of 2026-10-28 as they ran in those plans; the
     `kanban` cycle (plan-056 … plan-058) is **cited from that inventory, not mined again**, its
     points carried over only where the periodic view changes them; WingFoil UI's adoption
     feedback is not a source (its own plan follows);
   - **the register:** every open row of `docs/owed-items.md` with keep, assign or drop (dl-031 R3);
     the rows whose trigger is "the next retrospective" fall due here (dl-036 R1: the next
     periodic one) and each gets its own proposal, none kept by default;
   - **deadline:** the WingFoil-side points are feedback notes on `main` before WingFoil's v0.4
     release planning; its date is not known, so the approver asks the coordination of the WingFoil
     projects for it; until it is known, the notes are on `main` by **2026-11-05** (if the
     retrospective's branch cannot close by then, its notes task merges into `main` alone, on the
     approver's OK, as plan-054 and plan-059 provided), and the retrospective closes within seven
     days of this intake's close (T2's bound), before v0.4's planning if that comes first;
   - numbers: dl-038 its decision-log, F-043 its first note, written by a hosted task (task-075).
   Alternative: the approver rules T2's patch case (no retrospective here; the next intake's
   covers both windows); not recommended, it would leave the period's points out of v0.4's
   planning.
7. **The row of dl-024 and dl-025** (trigger WingFoil v0.4's planning): the periodic
   retrospective's `approve` checkpoint hands the approver dl-024 and dl-025 as well, with their
   review findings already in their Execution Notes, so that they are ruled before v0.4's
   planning; if they are not, the retrospective's decision-log sets the row's new trigger. Not in
   this intake.
8. **The dl actions of dl-035 … dl-037** (their row, owner the approver): one dl actions plan right
   after the periodic retrospective, also applying any governance decision-log that retrospective
   approves, before the plan of WingFoil UI's feedback: `repository-practice` 1.2 changes the
   register's rules and the notices that plan will use, and the retrospective will propose on the
   CI-policy row that dl-035 A4 closes. Alternative: after WingFoil UI's feedback, as the approver's
   order of 2026-11-02 left it.
9. **Not in this plan:** this repository's pin and adoption (W10); short references and the other
   0.3.2 features no pack needs; any change to a published pack (a defect found is bug-010 and a
   task, for the approver to place).

**Numbers** (next free on `main` at `4554de6`): plan-060 (this plan), task-074, bug-010 (a defect
the recheck finds, if any), plan-061 and dl-038 (the periodic retrospective), F-043 and task-075
(its notes, if any); prel-007 unused (no publication). WingFoil 0.2.2's `memory add` numbers by
count (W-14): elements of one type are added in order, each printed id checked, none added on a
branch while another branch holds a new element of the same type.

## Steps

Before every commit, the privacy check (`repository-practice` rule 2: no local or scratch path, no
private repository or project, no intermediary session); after every push to `main`, its CI read
(rule 3); after every commit under `docs/memory/`, `docs/plans/` or `.wingfoil/`,
`npm run -s wingfoil -- workflow list` and `npm run lint` exit 0. Files staged by name.

1. **This plan:** an independent review by a subagent (dl-017), amended; the approver's rulings on
   the outline, recorded here; a re-review if a ruling changes a decision; `submit`
   (`draft → active`).
2. **`record`, task-074** through `tooling-delivery` v2: its body reviewed and accepted into the
   backlog, its Design on `main`, the build on `task/task-074-<slug>`, red first, an independent
   review, the checks from clean clones on Node.js 22.21.0 and 22.12.0, **one after the other**, on
   the same commit (`npm ci`, `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`,
   `index -- --check`, `validate`, the golden step, the overlays `software-exit`, `scrum-exit` and
   `kanban-exit`, `workflow list`, `check:runs`, `validate:publication`, `npm audit` in the root and
   in every matrix folder), the branch CI's conclusion and job durations in its notes, `in-review`,
   the approver's acceptance and merge OK, a `--no-ff` merge, `main`'s CI read, `done`.
3. **`recheck`** (reviewer), after task-074 on `main`, as point 3; its results and the
   independent check in this plan's notes.
4. **`plan-migrations`** (product-owner): as point 5.
5. **`retrospective-start`** (facilitator), at the close: WingFoil's next release planning date as
   then known; plan-061 added (`memory add`, W-02), with the period, sources and deadline of
   point 6, its outline ruled in its own plan.
6. **Close:** `pack-foundation-base`'s and the other active charters' Execution Notes record the
   recomputed range; the notices of the outcome (0.3.2 recorded, the ranges, the recheck) to
   WingFoil UI and to the coordination of the WingFoil projects, named by project (dl-036 R5),
   their text shown to the approver first; `docs/owed-items.md`: a row for every item this plan
   leaves owed (rule 4); the account per tech-spec (dl-020): spec-001 amended in place by task-074,
   nothing else to fold back; the reserved numbers left unused released; `main`'s CI on the closing
   head; `active → done`.

## Handoff

- **claude:** every step but the approver's gates. It never runs `memory approve` or
  `memory reject`: it hands the approver each command, the `cd` to the repository root and
  `--reason` included. No pull request. Memory is changed only through `npm run -s wingfoil --
  memory add|submit` and by editing an element's body. `docs/notes/` and `.idea/` stay untracked.
- **Reviewer:** an independent subagent for this plan, task-074's body and build, the recheck and
  the close (dl-017).
- **Approver:** the outline before `submit`; task-074's backlog acceptance, its approval and merge
  OK; the notices' text; WingFoil's v0.4 planning date, asked of the coordination of the WingFoil
  projects.
- Done when `compat.yaml` lists 0.3.2, the six published versions carry `">=0.3.0 <=0.3.2"`,
  `check:runs` runs on 0.3.0 and 0.3.2, the recheck is recorded and checked, plan-061 is added, the
  notices are sent and `main`'s CI is `success`.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-03: written as asked by the approver on 2026-11-02; `workflow` and `phase` filled by
  editing the draft (W-02). `main` at `4554de6` over `b5b8bff`, whose CI run 41538621346 is
  `success`.
