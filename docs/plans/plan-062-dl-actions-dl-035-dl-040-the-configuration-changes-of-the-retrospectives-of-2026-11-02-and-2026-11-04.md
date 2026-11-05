---
id: plan-062-dl-actions-dl-035-dl-040-the-configuration-changes-of-the-retrospectives-of-2026-11-02-and-2026-11-04
type: plan
title: "dl actions: dl-035 … dl-040, the configuration changes of the retrospectives of 2026-11-02 and 2026-11-04"
status: active
workflow: "decision-log-ingest"
phase: "rule"
tags: ["process","dl-actions","retrospective","ci"]
---

## Context

The `rule` phase of `decision-log-ingest` for the governance decision-logs of the retrospectives of
2026-11-02 (plan-059, dl-034) and 2026-11-04 (plan-061, dl-038), all approved: their configuration
changes, applied here as each decision-log's last point says ("applied after approval by a dl
actions plan"). It is row 15 of `docs/owed-items.md` (row 16 in the numbering of dl-038 D1 and of
the inventory of 2026-11-04 §8), placed by dl-038 D1 first of the three plans after plan-061 (this
row, then row 5, then row 43). Row numbers below are the register's at this plan's writing, each
with its item. Asked by the approver on 2026-11-04.

- **dl-035** (A1 … A4): the root's audit gate on the runtime tree; an advisory reaching only
  development dependencies writes a `::warning::` and opens a bug within a day; the matrix
  lockfiles stay blocking. A tooling task (`ci.yml`, `tests/ci-workflow.test.ts`, red first) and
  `repository-practice` rule 3;
- **dl-036** (R1 … R6): "the next retrospective" is the next periodic one; a ruling's row; a
  reopened row; a row asked outside any element; a notice's recipients by project;
  `repository-practice` rules 4 and 2 and the register's header;
- **dl-037** (E1 … E3): a run by hand reaches the charter before it is accepted, and what it
  records: `pack-cycle` v7, `pack-compatibility`;
- **dl-038** C3 and D3: `repository-practice` rule 3 gains a sentence on a plan's close; the notes
  on dl-017, dl-026 and dl-029, dl-030's "actions applied" note;
- **dl-039** (R1 … R4): a tooling or pack task's checks run on the branch CI with a short local
  list, in the approver's order; `tooling-delivery` v3 and `kanban-delivery` v5; G12's row;
- **dl-040** (D1 … D4): the intake's retrospective deadline when WingFoil's release planning has
  started; `wingfoil-release-intake` v6.

`repository-practice` 1.1 → 1.2 is one bump shared by dl-035 A4, dl-036 R6 and dl-038 C3.

**Register rows this plan settles:** 1 (CI policy for advisories, by the tooling task, dl-035 A4),
10 (G12, dl-039 R3), 15 (this plan's own), 16 (dl-030's "actions applied" note, dl-038 D2), 39
(dl-029 T2's gap, dl-040 D4) and 42 (dl-026's stale Consequences). Row 14 (`pack-cycle` v6 or v7
on the engine) stays open as it is, trigger the pin bump (W10).

**`main`'s CI before this plan** (dl-038 C3): plan-061's last push, `40e3f4f` (its close and `active
→ done`), CI run 41907871950 `success` (jobs: Node.js 22.21.0 17 min 17 s, 22.12.0 20 min 35 s),
read here; no plan had read it.

**Not in this plan:** dl-024 and dl-025 (row 5, the next plan); WingFoil UI's feedback (row 43, the
plan after); `pack-cycle` v7 on the engine (row 14, W10); the publication checks on branches
(dl-039 option 3, a decision of its own); the `minimatch` override's rows (dl-035 A4 keeps them);
amending any approved body (each change is an Execution Note).

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **One plan, one branch.** Recommended: this plan on `main`; the work on
   `dl/dl-035-dl-040-actions` from `main` at the commit that submits this plan; one commit per row
   (Steps); the tooling task on its own branch from it, merged into it (point 3); at the close, on
   the approver's OK, one `--no-ff` merge into `main`.
2. **The rows and their order** (the table in Steps). Recommended: row 1 first, the two delivery
   workflows (dl-039), so that the tooling task of row 2 is born under `tooling-delivery` v3; row 2
   the tooling task (dl-035 A1); row 3 `repository-practice` 1.2 after it, so that rule 3
   describes a step that exists; then `pack-cycle`, `pack-compatibility`,
   `wingfoil-release-intake`, and the notes last, citing the commits.
3. **The tooling task** (dl-035 A1, A4; `tooling-delivery`, `pack: ""`). Recommended: one task,
   added with `memory add` on the branch of this plan after row 1, no other task added on any branch
   meanwhile (W-14); on `task/<id>-<slug>` from this plan's branch and merged into it with
   `--no-ff`: a departure from `tooling-delivery` › `deliver` ("into main"), with task-064 under
   plan-054 as the precedent, recorded in the task's notes. Its Acceptance: "Audit the root
   lockfile" runs `npm audit --omit=dev`, blocking; a second step after it, on branches and tags (no
   `if`), no `continue-on-error`, runs `npm audit` on the whole root tree, writes a `::warning::`
   annotation naming the advisories when it finds any, and exits 0; both Node.js jobs run it, so a
   warning appears twice in a run (A1); when the audit cannot produce a report (a registry or
   network error), dl-035 A1's "never fails at the shell level" is read literally (b): a
   `::warning::` that the audit could not run, and exit 0; the alternative (a), failing the step as
   today, departs from A1 and is the approver's to rule (in practice the blocking step before it
   already fails on a registry outage); the matrix step unchanged. `tests/ci-workflow.test.ts`
   asserts all of it red first (dl-018), and also runs the second step's script against a stub `npm`
   on the `PATH` (exit 1 with an advisory; exit 1 with no report; exit 0) to check that it warns or
   stays silent and exits 0 in each case: the step's behaviour, not only its text. The task moves
   row 1 to Closed in its own commit (dl-035 A4). Today both `npm audit` and `npm audit --omit=dev`
   exit 0 in the root, so the first run of the new step is expected to write no warning.
4. **dl-039 applied to itself.** dl-039 is approved; a change of governance takes effect only when
   its decision-log is approved (dl-038, Change), and approved rules have been followed before being
   applied (dl-038 K4; dl-036's note of 2026-11-04). Its text reaches the workflows with row 1.
   Recommended: the checks of dl-039 R1 and R2 from now on, for the tooling task and, by this ruling
   (dl-039 names only tasks), for this plan's branch: the build review and its amendments first;
   then, once, on the frozen commit, the branch CI's `success` (both jobs, run id and durations
   recorded) and, from a clean working tree on Node.js 22.21.0 after `npm ci` and `npm run build`,
   `npm run validate:publication`, the golden tree in publication mode and `npm run -s wingfoil --
   workflow list`, each exit 0. No clean clones: the task does not change how the matrix installs a
   release (`src/matrix.ts`), dl-039 R1's exception. Since row 1 is on the branch before the task
   exists, the task follows the workflow it is born under, and no reading of "from when" is needed.
   The alternative, the clean clones on Node.js 22.21.0 and then 22.12.0, is kept only if the
   approver asks (dl-039 R1, last bullet).
5. **`repository-practice` 1.2** (one bump, its Date; row 3). Recommended content:
   - rule 2: dl-036 R5 (a notice's recipients named by project, never as a session; a request it
     carries written as "asked by the approver on <date>", addressed to the recipient project);
   - rule 3: "the conclusion and its warning annotations"; the precedent clause (bug-003, bug-004)
     limited to a red conclusion; dl-035 A2 in full (a warning read on `main`'s CI opens a bug
     within a day: severity from the advisory and the path, `minor` by default for a development
     dependency only, the CI staying green; fixed by moving the lockfile within the ranges when a
     fix exists, bug-003's and bug-004's precedent, otherwise by an exact override or the approver's
     ruling; no new bug for a warning whose advisories an open bug, or an approver's ruling recorded
     in it, covers; detection unchanged, the CI runs on every push); and dl-038 C3's sentence: a
     plan's close, the run of its last push (the close note and `active → done`) is read by the next
     plan, which cites it;
   - rule 4: dl-036 R1 … R4;
   - each new clause with its decision-log and "in force since" its approval date (dl-035 and dl-036
     2026-11-02; dl-038 2026-11-04); the title, scope and tags unchanged; `docs/owed-items.md`'s
     header (it paraphrases rule 4) in the same commit (dl-036 R6).
6. **The notes** (row 7). Recommended: an Execution Note on each of dl-017 (dl-039 R2's order beside
   its re-review rule), dl-026 (its Consequences' "reported `late` until it completes" superseded by
   plan-047 ruling 15 and task-057; WingFoil's side is F-036), dl-029 (T2 reads with dl-040 D1 … D3;
   T1's "as announced" also reads "or reported by the approver"), dl-030 (actions applied by
   task-065, `3b7aa96`; rule 2 with dl-036 R5; rule 3 with dl-035 A4 and dl-038 C3), dl-031 (its R1
   reads with dl-036 R1, its R2 with R2 … R4, its R3 with R1) and dl-032 (E2 reads with dl-037 E1
   and E2); and on dl-035 … dl-040 their actions applied, with the commits (dl-038 for C3 and D3).
   Bodies stay as approved. Optional, for the approver: a note on dl-034 (its D3 row settled
   here), as plan-055 wrote one on dl-028.
7. **The register.** Recommended: each row moves to Closed in the commit that settles it, with this
   plan's id or the task's: row 10 (G12) with row 1, row 1 (CI policy) in the task (row 2), row 39
   (T2's gap) with row 6, rows 16 (dl-030's note) and 42 (dl-026) with row 7, row 15 (this plan's)
   at the close; row 14 unchanged ("v6 or v7", as dl-038 D1 approved it). New rows only for items
   this plan leaves owed: in the commit of the note that leaves it, or of the ruling that leaves it
   (dl-036 R2).
8. **This plan's close and the pushes** (rule 3, dl-038 C3, dl-039 R3). Recommended: `main` is
   pushed at `submit` (its CI read and recorded, rule 3), at the merge, and once at the close (the
   close note with `active → done`); the close records `main`'s CI on the merge with its two jobs'
   durations (dl-039 R3, a job over 25 minutes to the approver), and leaves the run of its last push
   to the next plan (row 5's), which cites it.

## The approver's rulings

Given by the approver on 2026-11-05: every point of the outline as recommended.
1. **Point 1:** this plan on `main`; the work on `dl/dl-035-dl-040-actions`, one commit per row; one
   `--no-ff` merge at the close.
2. **Point 2:** the rows in the order of Steps.
3. **Point 3:** one tooling task, on its own branch from this plan's, merged into it (a departure
   from `deliver`, task-064's precedent); an audit that cannot produce a report writes a
   `::warning::` and exits 0 (option (b), dl-035 A1 read literally).
4. **Point 4:** dl-039 R1 and R2's checks from now on, for the task and for this plan's branch; no
   clean clones.
5. **Point 5:** `repository-practice` 1.2 as written, with the register's header.
6. **Point 6:** the notes as written; the optional note on dl-034 left to the approver at row 7.
7. **Point 7:** each row closed in the commit that settles it; row 14 unchanged.
8. **Point 8:** `main` pushed at `submit`, at the merge and once at the close.

## Steps

On the branch `dl/dl-035-dl-040-actions`, from `main` at the commit that submits this plan; one
commit per row. Before every commit, the privacy check of `repository-practice` rule 2; after every
commit under `.wingfoil/` or `docs/memory/`, `npm run -s wingfoil -- workflow list` and
`npm run lint` exit 0.

| # | File | Change | Source |
|---|---|---|---|
| 1 | `.wingfoil/workflows/custom/tooling-delivery.yaml` (2 → 3) and `kanban-delivery.yaml` (4 → 5), one commit | `review`'s description, beside the re-review rule of dl-017, for every task of the loop, a content-only task (a feedback note) included: before `in-review`, the branch CI's `success` on the frozen commit (or on a later head whose diff from it is documentation-only, when a push cancelled that run), each run id and its two jobs' durations in the notes; from a clean working tree on that commit, on Node.js 22.21.0 after `npm ci` and `npm run build`, `npm run validate:publication`, the golden tree in publication mode (`npm run validate:publication -- --tree tests/fixtures/compose/tree --param project_name=Golden`) and `npm run -s wingfoil -- workflow list` exit 0; a clean clone with an empty `.cache` only for a change to how the matrix installs or initialises a release with unchanged lockfiles, or at the approver's request; the order: the build review and its amendments, then these checks once on the frozen commit, a documentation-only commit after them needing no new run (said in the notes), a reviewer running only targeted tests meanwhile; a red branch CI is a finding of the build. The two files stay identical but for roles and descriptions. Row 10 (G12) to Closed | dl-039 R1, R2, R3, R4 |
| 2 | `.github/workflows/ci.yml`, `tests/ci-workflow.test.ts` | the tooling task of point 3, on its own branch, merged into this one; row 1 to Closed by the task | dl-035 A1, A4 |
| 3 | `.wingfoil/directives/custom/repository-practice.md` (1.1 → 1.2, Date) and `docs/owed-items.md`'s header | point 5 | dl-035 A2, A4; dl-036 R1 … R6; dl-038 C3 |
| 4 | `.wingfoil/workflows/custom/pack-cycle.yaml` (6 → 7) | `charter`'s description: a run's findings reach the charter before it is accepted: they settle the plan's rulings, then the charter's body while `draft`, or an amendment while `proposed` (E1); what a run by hand records, by reference to `pack-compatibility` (E2); `author`'s description: E2 for the exit criterion's run by hand, recorded in the task | dl-037 E1, E2, E3 |
| 5 | `.wingfoil/directives/custom/pack-compatibility.md` (no version line) | the evidence bullet extended for a run by hand: the WingFoil version and commit as `wingfoil version` prints them, the packs composed and the commit they come from (for an untracked draft, the base commit and that it cannot be repeated from the repository), the parameters that differ from the defaults, the count of commands and of exits 0, every non-zero exit with its command and whether expected or a slip of the driving script, the states and iterations reached; no local or scratch path; a scripted run records its command, exit code and run count | dl-037 E2, E3 |
| 6 | `.wingfoil/workflows/custom/wingfoil-release-intake.yaml` (5 → 6) | the header cites dl-040; `retrospective-start`'s description: D1 (a planning started and not ended before the close, or starting before the retrospective closes with its date recorded "not known" (or announced later than it turned out): the intake's plan, or the retrospective's from the day the start is announced or reported, records the start date; the WingFoil-side notes on `main` as soon as possible while the planning runs, the notes task, if any, merging into `main` alone ahead of the retrospective's branch; the retrospective closed within seven days of the intake's close; T2's patch case the same, its seven days from the close of the intake that started it; a date announced at the close and then missed is T2's case, ruled by the approver in the plan), D2 (the notes task's mechanics) and D3 (a planning ended before the close: the following one is T2's "next"); "as announced" also "or reported by the approver". Row 39 to Closed | dl-040 D1 … D4 |
| 7 | dl-017, dl-026, dl-029, dl-030, dl-031, dl-032; dl-035 … dl-040 | the Execution Notes of point 6. Rows 16 (dl-030's note) and 42 (dl-026) to Closed | dl-035 A4, dl-036 R6, dl-037 E3, dl-038 C3 and D3, dl-039 R4, dl-040 D4 |

Then, in dl-039 R2's order:
- **Leftovers:** a grep of `.wingfoil/`, `docs/` (outside `docs/memory/` except
  `docs/memory/tech-spec/`, outside `docs/plans/` and `docs/retrospectives/`) and the READMEs for
  "clean clone", "npm audit", "before it is accepted", "while it is proposed" and "the next
  retrospective": every hit that contradicts dl-035 … dl-040 outside the rows above goes to the
  approver, not edited here. Known and consistent: `wingfoil-release-intake`'s `npm audit` on the
  new matrix lockfile (the matrix stays blocking, dl-035 A1).
- **Review:** an independent review of the branch by a subagent (dl-017), each row checked against
  its decision-log; its findings fixed; a re-review when a fix changes a rule.
- **Checks** (point 4), once, on the branch's frozen head after the review's fixes: its CI `success`
  (both jobs, run id and durations) and the local list on Node.js 22.21.0 after `npm ci` and
  `npm run build`; `npm run -s wingfoil -- directives list --format json` exits 0 with
  `"warnings": []`, `repository-practice` global. The documentation-only commit that records them
  needs no new run (dl-039 R2).
- **Branch close:** push; the privacy check of the branch's diff recorded; the Checks' run cited;
  on the approver's OK, `--no-ff` merge into `main`, push, `main`'s CI on the merge read with its
  jobs' durations (point 8); the remote and local branches removed. Any item this plan leaves owed
  gets its row in `docs/owed-items.md` in the commit of its note or ruling (dl-036 R2).

## Handoff

- **claude (facilitator, and developer of the task):** every row and the branch close, except the
  approvals and the merge OK. It never runs `memory approve` or `memory reject`: it gives the
  approver the command, with `cd` and `--reason`. No pull request. Files staged by name;
  `docs/notes/` and `.idea/` stay untracked. Repository texts follow `repository-practice`.
- **Reviewers (subagents):** this plan; the task's body; the task's build; the branch; each
  re-review a fix that changes a decision needs (dl-017).
- **Approver:** the outline (before `submit`); the task's acceptance into the backlog and at
  `in-review`; any leftover that contradicts a decision; the merge OK.
- Done when rows 1 … 7 are on `main` with their checks, the review applied, the branch CI and
  `main`'s read `success`, dl-017, dl-026 and dl-029 … dl-032 carry their notes, dl-035 … dl-040
  record their actions applied, and rows 1, 10, 15, 16, 39 and 42 are Closed. The plan then goes
  `active → done`.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-04: written as asked by the approver on 2026-11-04, after plan-061's close; `workflow`
  and `phase` filled by editing the draft (W-02). Next free numbers when written: plan-063,
  task-076, dl-041, bug-011, prel-007, F-043.
- 2026-11-04: independent review: approve after amendments, one blocking finding (the register's
  rows 14 … 16 named by the inventory's numbering, one higher); applied with the others: row 14 left
  as dl-038 D1 approved it; dl-039 R1's content-only task and the golden command in row 1; dl-035 A2
  in full in point 5; dl-040 D1's missing clauses in row 6; the Steps in dl-039 R2's order; the
  departure from `deliver` stated; dl-038 K4 cited for point 4; the CI's job durations; the
  leftovers grep's scope as plan-055's; an audit that fails without advisories (a departure from
  A1 in the first amendment, put to the approver in point 3 after the re-review); dl-036 R2's ruling
  case; the Done criteria; the CI read after `submit`.
- 2026-11-04: re-review: approve after one amendment (the audit that cannot report: dl-035 A1 read
  literally as recommended, option (a) to the approver; a third stub case); applied.
- 2026-11-05: rulings recorded (`d2cae4f`); submitted (`74ddfcc`), `main` pushed; `main`'s CI on it,
  run 42000588568, `success` (jobs Node.js 22.12.0 19 min 46 s, 22.21.0 19 min 38 s). Branch
  `dl/dl-035-dl-040-actions` from it. Row 1: `ded156e` (row 10, G12, to Closed). Row 2: task-076,
  added at `8d747a1` (W-14: no other task added meanwhile), body reviewed and re-reviewed, accepted
  and approved by the approver, merged into this branch at `a886d8c` and done; it closed row 1 (CI
  policy) at `f538f6f`; its branch CI run 42001788548 `success` (22.12.0 11 min 41 s, 22.21.0
  20 min 47 s), its local list exit 0; details in its notes. The branch's CI on `62f8fb3`, run
  42001445073, `success`.
- 2026-11-05: asked by the approver on 2026-11-05: the feedback inbox's first sync stays at W10
  (plan-052 ruling 7, the register's W10 row), although `wingfoil-cli` rule 7 also names every
  WingFoil release planning and v0.4's started on 2026-11-03; no sync for v0.4's planning, no new
  row.
- 2026-11-05: the approver chose the optional note on dl-034 (ruling 6), asked by the approver on
  2026-11-05. Rows 3 … 7: `5a1ed4d`, `603c650`, `b6a1f9c`, `7d73ca4`, `1214437`; after each,
  `workflow list` and `npm run lint` exit 0, and the privacy check of the staged lines and the
  message found nothing. Rows closed: 10 (G12) with row 1, 1 (CI policy) by task-076, 39 (T2's gap)
  with row 6, 16 (dl-030's note) and 42 (dl-026) with row 7.
- 2026-11-05: leftovers grep (`.wingfoil/`, `docs/` outside `docs/memory/` except
  `docs/memory/tech-spec/`, outside `docs/plans/` and `docs/retrospectives/`, the READMEs and
  `packs/`): no hit contradicts dl-035 … dl-040. The hits are the rows applied here,
  `wingfoil-release-intake`'s `npm audit` of a new matrix lockfile (still blocking, dl-035 A1), and
  pack content with another meaning (`kanban`'s "next retrospective", `software`'s reviewer role).
- 2026-11-05: independent review of the branch (`1214437`): approve after amendments, nothing
  blocking; applied: rule 3's precedent clause limited to a red conclusion (dl-035 A4), the dl-034
  note's request origin, its rows and its tense, the register header's "on `main`" (dl-036 R3),
  these notes on rows 3 … 7.
- 2026-11-05: checks (point 4, dl-039 R1 and R2), once, on the frozen head `ffc9e02`: the branch CI,
  run 42051295330, `success`, jobs Node.js 22.21.0 20 min 30 s and 22.12.0 20 min 40 s (none over
  25 minutes), no warning annotation; from a clean working tree of `ffc9e02` on Node.js 22.21.0:
  `npm ci`, `npm run build`, `npm run validate:publication`, the golden tree in publication mode and
  `npm run -s wingfoil -- workflow list` exit 0; `directives list --format json` exits 0 with
  `"warnings": []`, `repository-practice` global. This commit changes only `docs/plans`, after the
  checks' head: no new run (dl-039 R2). Privacy check of the branch's diff (`74ddfcc...ffc9e02`)
  and messages: no local or scratch path, no private project, no intermediary session.
