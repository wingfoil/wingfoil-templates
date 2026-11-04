# Friction inventory — periodic, 2026-11-04

Phase `explore` of `retrospective-periodic` › `retrospective` (`retrospective` v5), under plan-061.
The periodic retrospective (dl-006 R3) that WingFoil 0.3.2's intake started at its close (dl-029
T1; plan-060 ruling 6), the first one an intake's close started.

- **Period:** 2026-10-29 (plan-054's close, `f478934`) → 2026-11-04 (plan-060's close, `f01e53f`).
- **Sources read:** plan-055 (the dl actions of dl-029, dl-031, dl-032 and dl-033); plan-059 as a
  run of the retrospective's rules (its outline, rulings, task-073, F-042, its close); plan-060
  with task-074, task-075 and bug-010; plan-022's close; dl-024 and dl-025 (their notes of
  2026-11-03 and approval); dl-029 … dl-033 with their notes and the texts they produced
  (`wingfoil-release-intake` v5, `retrospective-periodic` v2, `repository-practice` 1.1,
  `pack-compatibility`, `docs/owed-items.md`); dl-034 … dl-037 as ruled; the inbox F-019 and
  F-038 … F-042 against WingFoil 0.3.2's CHANGELOG (`[0.3.2]`, at the tag); the git log and the
  public CI runs of the period.
- **Cited, not mined again:** the `kanban` cycle (plan-056 … plan-058, task-066 … task-072,
  bug-009, prel-006), from `2026-11-02-pack-methodology-kanban-friction-inventory.md` (cited as
  "K-inventory §n").
- **Not sources:** WingFoil UI's adoption feedback (its own plan follows); dl-007, dl-011 …
  dl-013 (`pending`).
- **Method:** three read-only strands (plan-055 and the rules; plan-059's and plan-060's work; the
  register with the CI runs), merged here.
- **Legend:** `+` went well · `−` friction · `?` not confirmed in the sources · `WF` WingFoil-side
  (§6) · `GOV` candidate change of this repository's governance (§7) · `DEBT` an owed item (§8).

Each point cites its source as element id and section, a commit, or a CI run id. `GOV-n` numbers
are this inventory's; `G7` … `G12` are the inventory of 2026-10-28's, as the register cites them.

## 1. The intake of WingFoil 0.3.2 (plan-060) and bug-010

- `+` **dl-029's `retrospective-start` ran as written, the first time** (`wingfoil-release-intake`
  v5): the planning date recorded, the patch case of T2 not taken (the approver's order of
  2026-11-02), plan-061 added with `workflow: retrospective-periodic` (W-02 by hand), its deadline
  recorded (plan-060 point 6, ruling 6, note 2026-11-04 step 5); the approver ruled plan-061's
  outline as recommended on 2026-11-04 (plan-061 › rulings). T5's interim rule had ended as
  foreseen: v5 was on `main` (`5631052`, 2026-10-29) before 0.3.2 came out (2026-11-02).
- `−` **The next release planning started before the intake closed.** Its date was not announced:
  WingFoil's `main` of 2026-11-02 had no release-planning plan for v0.4 (WingFoil's dl-186: after
  the `v0.3.2` tag); the estimate of 2026-10-28 was "not before 2026-11-06"; the approver reported
  on 2026-11-03 that it started that day, before the intake closed. T2 has no case for it; the
  approver ruled the deadline (ruling 6), and the gap has its row (plan-060 › Context; `8a174de`)
  (GOV-3). `?` T1 records the date "as announced"; here it came from the approver's report.
- `+` **The real-engine check found bug-010 before the record merged.** task-074's Acceptance 6
  (`validate:publication` on the record's tree) gave the golden tree 26 runs, 13 failed: on 0.3.2,
  `directives list` warns on the bindings `security` and `testing` (task-074 › notes 2026-11-03,
  `7c6c70d`). The branch CI caught it too (run 41662060621, `failure`, the golden step), a run
  task-074's notes do not cite (`?`).
- `+` **dl-019 the same day:** the notes at 15:38 (`7c6c70d`), bug-010 added at 15:39 (`ff92d99`),
  the approver's option A (fix the matrix; a fixture change rejected, it would hide the defect),
  bug-010 triaged and task-075 accepted by 15:57 (`7f988b5`, `f29d7ce`), task-075 merged at 22:25
  (`04f96ff`) (plan-060 › note 2026-11-03).
- `−` **The defect was latent from the matrix's first version** (git log): `8f645c0` (2026-10-09,
  task-011) copied the composed `.wingfoil/` alone; task-035 (`21f9905`, 2026-10-21) kept it when it
  committed the scratch repository; the golden fixture has bound `security` and `testing` since
  `3b5a0e9` (2026-10-07). 0.3.0 and 0.3.1 warned only with `--role`, and spec-001 §7.4 allows the
  binding (bug-010 › Observed). The knowledge was on record in F-019 (built-in directives exist
  only in a project `init` created).
- `−` **plan-060's scratch run edited the root `compat.yaml` only**, so the golden tree, which
  reads its own, ran on 0.2.2 and 0.3.1; its "0 failed" would have hidden bug-010. The plan's
  independent review caught it (plan-060 › Context "Already run"; note 2026-11-03).
- `+` **The recheck matched plan-051's:** `base@1.0.0`'s `check:runs` 18 runs, 14 failed (7 per
  release, bug-005 and bug-006); everything else 0 failed; an independent check reproduced it
  (plan-060 › notes 2026-11-04).
- `DEBT` **The packs' Memory templates lack the optional fields 0.3.2's `init` adds** (the
  recheck; register row 40).
- `+` **F-042 reached `main` before v0.4's planning** (`51c74d7`, 2026-11-02; plan-059 › close;
  dl-034 W1).

## 2. Reviews, red-first and the checks of a tooling task

- `+` **Every element reviewed** (dl-017), about ten reviews in about thirty hours: plan-060 (nine
  should-fix, six nits) and its re-review after rulings 6 and 7; task-074's body, re-review and
  build; task-075's body, re-review and build; bug-010; the recheck; plan-061 (six and six).
- `+` **Findings that mattered:** task-074's body missed the install-failure test naming the newest
  release (blocking); task-075's reviewer ran the fix as a patch and found `init` exiting 1, "git
  identity not configured", under the matrix's git environment (WingFoil's own `git commit` reads
  no `-c`): fixed by a local scratch configuration, with a test; task-075's build: the scratch path
  hidden and an I/O-failure test, each checked by mutation (task-074, task-075 › notes 2026-11-03).
- `+` **Red-first held:** task-074, 9 failing as its Design named (`25b62f7`); task-075, 4 + 1
  failing, the two passing at red named in advance, the overwrite mutation recorded (`8d93af4`,
  `91c6007`).
- `DEBT` **A review suggestion left out:** comparing each release's built-in ids with
  `src/wingfoil-builtins.ts` (W-11's hand copy), now that the matrix reads them per release
  (task-075 › notes, "Not applied"). No row.
- `−` **The clean clones' cost.** Three rounds on both Node.js versions in about fifteen hours
  (task-075 at `3c89e70`; task-074 merged with task-075 in scratch; task-074 at `5c5d047`), 1051 of
  1051 each; from commit times, about three hours for task-075's two rounds (`3c89e70` 16:44 →
  `26f7c04` 19:51, both recorded there) and overnight for task-074 (`5c5d047` 23:00 → `1c8a8fe`
  07:53). `?` A first run of task-075, on an earlier commit, stopped when its build review's fixes
  landed (no source records it). In plan-059, task-073 ran full clones for a content-only note and
  ran them again after its review's amendment (task-073 › notes 2026-11-02, `95abe15`, `0bbe924`).
  The notes record counts and order, not durations
  (`DEBT`: no local figure to set against the CI's). Earlier, plan-055's two suites run in parallel
  failed on each other's scratch repositories (plan-055 › note 2026-10-29, checks).
- `+` **The approver's order of checks of 2026-11-03:** the build review and its amendments first;
  the clean clones once, on the frozen commit; documentation-only commits after them need no new
  run, said in the task's notes (task-059's precedent, its notes of 2026-10-27); no heavy reviewer
  run beside the clones. task-074 applied
  it (note 2026-11-04). It is written only in plan-060's note (`bf24c88`) (GOV-2).

## 3. The rules of 2026-10-28 in application

- `+` **plan-055** applied its twelve rows in one day, one commit each (`08ceb72` … `1c1722b`):
  reviewed (one blocking finding, fixed), re-reviewed, clean clones, branch CI run 40896323377,
  merged `5631052`, `main`'s CI run 40928296206 `success`; each of dl-029, dl-031, dl-032, dl-033
  carries its "actions applied" note (plan-055 › notes 2026-10-29).
- `−` **dl-030 has no "actions applied" note:** task-065 (plan-054) applied it, but dl-030's notes
  stop at its re-review (`git log` of dl-030 after `dd6c90d`). `DEBT`.
- `+` **The leftovers of plan-055** (F3.3, F5.2 of `06_features.md`) went to the approver, not
  edited; their row's trigger was set on 2026-11-01 (`3be4f38`); still open (row 34).
- `+` **dl-030 rule 1:** plan-060 and plan-061 write "asked by the approver on <date>"; the v0.4
  date is "as the approver reported", a fact. **Rule 2:** every commit checked; plan-060's close
  records its diff since `b5b8bff` checked; a sweep of `f478934..main` found no path and no
  intermediary session.
- `+` **Rule 3 on red:** the period's only red stretch (four `failure` runs on 2026-10-31,
  bug-009) was reported and fixed (`a2e0555`, run 41298773055 `success`; K-inventory §4.4).
- `−` **Rule 3, cancelled runs:** of the period's 57 runs on `main`, 40 `success`, 12 `cancelled`,
  4 `failure`, 1 in progress at reading. On 2026-11-03, six cancelled by the next push (41644476861,
  41645928408, 41646728487, 41647576221, 41647679672, 41658704239), each superseded by a `success`
  (41648157457, 41658816665), as rule 3 foresees; none is cited by an element, nor are five
  successes of plan-060's window (41604549667, 41648157457, 41658816665, 41799359136,
  41802814475) (`?` read but uncited; dl-034 N4 again).
- `−` **Rule 3 at a plan's close:** a close reads the CI of its "closing head", then pushes its last
  note and `active → done`; the run of that last push is read only by the next plan (plan-059:
  `b5b8bff`'s run 41538621346 cited in plan-060 › note 2026-11-03; plan-060: `f01e53f`'s run
  41850628713, in progress when this inventory was committed, read by plan-061's close) (GOV-4).
- `+` **dl-031's register (rule 4):** plan-060's rows added in the commits that record them (ruling
  8's in `5cc430a`, the recheck's in `38a30d5`, dl-024/dl-025's dl actions in `46c1528`); the
  dl-024/dl-025 row moved to Closed by plan-022's close (`adad7a0`).
- `−` **Ruling 6's row came one commit late:** not in `5cc430a`, which records the ruling, but in
  `8a174de`, asked by the re-review: the case dl-036 R2 now covers.
- `+` **dl-032 E3** (`check:runs`, the matrix) found bug-010 and reproduced `base@1.0.0`'s failures
  (§1); E2, E4 and dl-033 O1 held in the `kanban` cycle (K-inventory §5; dl-034 K1, K5).
- `−` **plan-022 stayed `active` fourteen days after its condition was met** (dl-015 approved
  2026-10-20, `4dbc9ef`; closed 2026-11-03, `adad7a0`): a register row tracked its close, bundled
  with dl-024's and dl-025's ruling, so it waited for them (plan-022 › note 2026-11-03).
- **plan-059 as a run of the rules:** `+` its register read under dl-036 R1's "not touched" before
  that rule was approved, every other row kept (plan-059 ruling 4); `+` its notice to the
  coordination of the WingFoil projects, recipients named by project (plan-059 › close); `−` its
  close review counted the register's open rows as 37 against 38 at `0162c90` and 41 then (plan-059
  › note 2026-11-02, close review); `−` task-073's full clean clones for a content-only note (§2).

## 4. The rules of 2026-11-02 revisited (dl-034 … dl-037)

Approved on 2026-11-02 (`2ddb65c`, `bf39d5c`, `49acf67`, `d5bf821`), not yet applied:
`repository-practice` is still 1.1 (their dl actions plan comes after this one, plan-060 ruling 8).

- `+` **Followed before being applied:** dl-036 R2 (plan-060 ruling 8's rows), R1 (plan-060 point 6,
  plan-061 point 4), R5 (plan-060's notices "named by project"; plan-061 point 6).
- `−` **The cost of rules approved and not applied:** plan-060 and plan-061 each say that dl-036 is
  not yet in `repository-practice` and read R1 and R5 from the decision-log (plan-060 point 6;
  plan-061 point 4). The dl actions plan's row is open (row 16).
- `?` dl-036 R3 (a reopened row) and R4 (a row asked outside any element) not exercised; dl-035 (no
  advisory since its approval: every `npm audit` 0) and dl-037 (no run by hand) not exercised.

## 5. CI and G12

The CI job `validate`, timeout 30 minutes (`.github/workflows/ci.yml`), the successful runs from
plan-059's last push that the elements or this inventory cite (minutes:seconds):

| Run | Commit | 22.21.0 | 22.12.0 | Note |
|---|---|---|---|---|
| 41538621346 | `b5b8bff` | 19:19 | 19:55 | plan-059's closing push |
| 41604549667 | `41001f9` | 12:50 | 16:11 | |
| 41648157457 | `e6d913f` | 19:48 | 19:25 | |
| 41658816665 | `f29d7ce` | 19:22 | 19:45 | |
| 41662051334 | `f99bf89` | 13:00 | 20:57 | task-075, branch |
| 41667034563 | `3c89e70` | 12:33 | 20:41 | task-075, branch |
| 41697840507 | `8ca062d` | 20:15 | 22:47 | task-075, branch: the period's maximum, `npm test` 1019 s |
| 41721858295 | `e86b988` | 20:04 | 13:32 | task-075's merge |
| 41726970835 | `5c5d047` | 12:50 | 16:38 | task-074, branch: `npm test` 582/743 s, matrix steps 161/223 s |
| 41799359136 | `bf24c88` | 18:18 | 13:12 | task-074's merge and notes |
| 41802814475 | `7748405` | 20:24 | 20:14 | plan-061's body |
| 41846894761 | `ecd7e4d` | 12:51 | 21:04 | plan-060's closing head |

- `−` **The maximum is 22 min 47 s, 76 % of the timeout**; the same commit's two jobs differ by up
  to 8 min 13 s (`ecd7e4d`), the runner's spread; the run counts did not grow with 0.3.2 (plan-060 ›
  Context), and task-075's seeding added no visible time (run 41721858295).
- `+` **The branch CI runs the clean clones' checks but `validate:publication` (of this
  repository and of the golden tree: the CI's publication step runs on tags only) and `workflow
  list`**, on both Node.js versions, and caught bug-010 on its own (run 41662060621) (GOV-1).

## 6. WingFoil-side points

Read against 0.3.2's CHANGELOG; reproduction on 0.3.2 belongs to the notes task (plan-061 ruling 6).

- **F-038** (`workflow start` fills `workflow` and `phase`): unchanged; 0.3.2's short references
  for `--element` do not touch it.
- **F-039** (a completed iteration's step returns): unchanged.
- **F-040** (`produces` naming a directory without `/`): unchanged.
- **F-041** (a phase role nobody holds, accepted silently): unchanged for `workflow next`, `status`
  and `list`; 0.3.2's `agent execute` now prints the deduction's diagnostics (task-330), to read
  if the note is next revisited.
- **F-042** (`memory reject` past a WIP limit): unchanged.
- **F-019** (built-in directive ids readable only from a project): unchanged; 0.3.2 reinforces
  `init` as the only source ("can be copied from a project `wingfoil init` creates"). bug-010 adds
  facts, not a new note: a tool now needs the files, not just the ids, since 0.3.2 warns on a
  binding with no file (task-310); their content is per release (0.3.x adds `format: 1`); getting
  them means running `init` in a scratch repository with a local identity (task-075). For the
  first sync, beside F-019's ledger row.
- **No note proposed** for 0.3.2's `directives list` warning (a documented fix, task-310), for
  `init` failing with no git identity under a closed global configuration (git's own behaviour),
  or for the unannounced planning date (a coordination point). `WF` candidates: none.

## 7. Candidate changes of governance

The test of plan-054's P1 (dl-028 N4; plan-061 point 5): a decision-log only if this repository's
adoption of the packs and its pin at 0.3.1 or later (W10) would not fix it.

- **GOV-1 — The branch CI in place of the local clean clones** (asked by the approver on
  2026-11-03; §2, §5). Locally only `validate:publication`, the golden tree in publication mode,
  `index -- --check` and `workflow list` (`index -- --check` already runs in the CI inside
  `validate`, so the list could be three); the branch CI's conclusion as today. For: the CI runs the
  same checks on both Node.js versions and caught bug-010 alone; the clones cost hours. Against:
  the CI at 76 % of its timeout (G12), and a red branch CI found later than a local run. W10 does
  not fix it (`tooling-delivery` is this repository's own). Ruled with G12's row (§8).
- **GOV-2 — The approver's order of checks of 2026-11-03 written down** (§2): in `tooling-delivery`
  or `repository-practice`; part of it superseded if GOV-1 is kept; it extends to content-only
  tasks (task-073's full clones for a feedback note, §2). W10 does not fix it: both homes are this
  repository's own (`tooling-delivery`, which `methodology/kanban`'s adoption maps but does not
  replace, row 38; `repository-practice`, dl-031 R6).
- **GOV-3 — dl-029 T2's missing case** (§1): a planning that starts before the intake's close
  (a date never announced is T2's "not known" case); which deadline applies then.
  `wingfoil-release-intake` is this repository's own and survives W10 (dl-029 T3). W10 does not fix
  it. Register row 39.
- **GOV-4 — Rule 3 at a plan's close** (§3): who reads the run of the last push (the note and
  `active → done`). `repository-practice` survives W10 (dl-031 R6). Small: possibly a sentence in
  the 1.2 bump of dl-035 and dl-036's dl actions rather than a decision-log of its own.
- Observed, no change proposed: plan-022's fourteen days (§3, tracked by a bundled row); W-02
  (`workflow` and `phase` filled by hand) and a plan's `phase` frozen while it runs later phases on
  the 0.2.2 pin, both fixed by W10.

## 8. The register

`docs/owed-items.md` at `f01e53f`: 43 open rows, 13 with the trigger "the next retrospective" (NR),
which fall due here (dl-036 R1) and are proposed on their merits. Proposals: **keep** (trigger
unchanged), **assign** (owner or trigger changed), **drop** (to Closed). Rows in the register's
order.

| # | Item | Trigger | Proposal | Reason |
|---|---|---|---|---|
| 1 | CI policy for advisories (NR) | the next retrospective | assign: "the tooling task of dl-035 A4" | dl-035 approved; A4's task closes the row; not applied |
| 2 | `check:pins` covering `overrides` | the next dependency update | keep | no change to `package.json`'s dependencies or `overrides` since `e765b03` (`c2744ba` adds a matrix lockfile only) |
| 3 | The `minimatch` override removed | the next dependency update | keep | no upstream accepts `minimatch` 11 (`npm view`, 2026-11-04) |
| 4 | Recheck W-01 … W-14 and F-003, F-005, F-012, F-017 | the pin bump | keep | the pin is 0.2.2; 0.3.2 joins the releases to recheck |
| 5 | The dl actions of dl-024 and dl-025 | the approval of both; the approver places the plan | assign: placed by the approver (approvals met 2026-11-03) | the order of the next plans is the approver's |
| 6 | G7 in-place amendment | W10 | keep | W10 not started |
| 7 | G8 dl-017 R2 for documents and configuration | W10 | keep | W10 not started |
| 8 | G9 the inbox's first line, reserved gaps | W10 | keep | W10 not started |
| 9 | G11 a terminal state for a fixed bug | W10 | keep, evidence added | bug-010 `approved` after its fix, as bug-009 |
| 10 | G12 the suite's duration against the CI timeout | W10 | ruled with GOV-1: if GOV-1 is kept, assign to its decision-log, applied beside dl-035 A4's change to `ci.yml`; otherwise keep | maximum 22 min 47 s (§5) |
| 11 | A check of the CHANGELOG's first line | the next `publish:pack` change | keep | `src/publish*.ts` unchanged in the period |
| 12 | A "known defects" marker in `catalog.yaml` (NR) | the next retrospective | for the approver: assign to W10 (with F-005) or drop as moot | plan-060 ruling 2 widened `base` 1.0.0 knowing its runs fail; ranges are computed from formats (spec-001 §12) |
| 13 | Custom `sw-life-cycle` name clash | the adoption | keep | W10 not started |
| 14 | `software`'s `tech-lead` holder | the adoption | keep | W10 not started |
| 15 | `pack-cycle` v6 checked on the engine | the pin bump (W10) | assign (text): "v6 or v7" | dl-037 E3 raises `pack-cycle` to v7 |
| 16 | The dl actions of dl-035 … dl-037 | right after this retrospective (plan-060 ruling 8) | keep | its trigger already names this retrospective's governance decision-logs; met at this plan's close |
| 17 | `software`'s charter text drift (NR) | the next retrospective | assign: owner W10, trigger G7 | a correction needs an amendment; rule 1 keeps text on `main` |
| 18 | `kanban` open point 2 | the adoption | keep | W10 not started |
| 19 | `kanban` open point 3 | a `software` `release` with `id`, or parallel release lines | keep | neither happened |
| 20 | `kanban`'s charter text drift (NR) | the next retrospective | assign: owner W10, trigger G7 | as row 17; plan-057's note records the fix |
| 21 | `scrum` open point 1 (UI's test-first steps) | UI's adoption | assign: "the plan of WingFoil UI's feedback" | UI adopted by hand (row 43); dl-034 D1 |
| 22 | `scrum` open point 2 and `kanban` open point 4 (`explore`'s weak evidence) (NR) | the next retrospective | for the approver: assign to the pin bump (W10) or keep | it depends on `base` 1.0.0's bug-006 (the charter); not met again here |
| 23 | A decision-log making in-place amendment general (NR) | the next retrospective | drop: merged into G7 (row 6) | the same item; W10 decides the model |
| 24 | `pack-delivery`'s selection over `accepted` packs (NR) | the next retrospective | assign: owner W10, trigger the adoption | this repository's own workflow, read again at the adoption |
| 25 | `--param` applies to an `entries` composition only (NR) | the next retrospective | drop: merged into row 41 | met only in the private projects' check |
| 26 | `pack-semver` rule for fixes and changed defaults (NR) | the next retrospective | assign: "the next pack release that is a fix or changes a default" | no such release in the period |
| 27 | `plan-{n}-{slug}` or `{workflow}-{phase}-plan` | the adoption | keep | W10 not started |
| 28 | `check:runs` full-run scenarios | the next tooling task on `runs.ts` | keep | `runs.ts` untouched since 2026-10-28 |
| 29 | 0.3.1's `COLLABORATION.md` inbox text | the first sync | keep | "Last sync: none" |
| 30 | README step 3 "own entries" | the next README pass | keep | only `kanban`'s README touched (`fd195c5`) |
| 31 | Sequencer: W8 has four features | the sequencer's next review | keep | not reviewed in the period |
| 32 | dl-012's F4.9 placement | dl-012's ruling | keep | dl-012 `pending` |
| 33 | W10 | W10 | keep | not started |
| 34 | `06_features.md` 1.5 → 1.6 | the next plan that changes the documentation | keep | no plan changed `docs/01_vision` in the period |
| 35 | Per-pack WIP rule under `kanban` | the adoption | keep | W10 not started |
| 36 | Tasks carrying a `release` under `kanban` | the adoption | keep | W10 not started |
| 37 | Custom workflows sharing `base`'s and `software`'s names | the adoption | keep | W10 not started |
| 38 | `pack-author` phases mapped to `developer` | the adoption | keep | W10 not started |
| 39 | dl-029 T2's missing case (NR) | the next retrospective | ruled with GOV-3: drop to Closed by its decision-log if kept; otherwise assign | §1 |
| 40 | The packs' templates without 0.3.2's optional fields (NR) | the next retrospective | for the approver: assign to the next minor release of `base` and `software`, or to the pin bump (W10) | optional fields; nothing fails (plan-060 › recheck) |
| 41 | The private projects' check scripted (NR) | the next retrospective | assign: "the next pack release that needs a private check", absorbing row 25 | prel-006 needed none |
| 42 | dl-026's stale Consequences (NR) | the next retrospective | assign: an Execution Note on dl-026 in the dl actions plan of row 16 | rule 1: a note, not a rewrite |
| 43 | WingFoil UI's adoption feedback | after this retrospective and row 16's plan | keep | not yet met |

New items this inventory finds (`DEBT`, rows to add at the close if dl-038 keeps them): dl-030's
missing "actions applied" note (§3); the built-in ids compared with W-11's copy (§2); the clean
clones' durations recorded (§2, if GOV-1 is not kept).

NR rows: 1, 12, 17, 20, 22, 23, 24, 25, 26, 39, 40, 41, 42 — assign 1, 17, 20, 24, 26, 41, 42;
drop 23, 25 (merged); for the approver or ruled with a candidate 12, 22, 39, 40. None kept by
default.

## 9. What went well, in short (dl-006 R5)

The intake's checks on the real engine found a latent defect of this repository's tooling before
it reached `main`, and the approver ruled it within the hour; every element was reviewed and the
reviews found what the builder missed; dl-029's new phase ran as written the first time; the rules
of 2026-11-02 were followed before they were applied.

## 10. For the approver at `additional-points`

- GOV-1 with G12 (row 10), GOV-2, GOV-3 with row 39, GOV-4: which become decision-logs.
- Rows 5, 12, 22 and 40, and the owner changes of rows 17, 20 and 24 (approver → W10).
- No `WF` note proposed: task-076 opens only if the approver adds one.
