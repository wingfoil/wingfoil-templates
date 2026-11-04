---
id: plan-061-retrospective-periodic-retrospective-from-plan-054-s-close-to-wingfoil-0.3.2-s-intake
type: plan
title: "retrospective-periodic retrospective: from plan-054's close to WingFoil 0.3.2's intake"
status: done
workflow: "retrospective-periodic"
phase: "retrospective"
tags: ["process","retrospective","periodic"]
---

## Context

The periodic retrospective (dl-006 R3) that WingFoil 0.3.2's intake starts at its close
(`wingfoil-release-intake` v5 › `retrospective-start`, dl-029 T1), as plan-060 ruled (ruling 6):
none has closed since 0.3.2 was published (plan-059's inventory has the scope
`pack-methodology-kanban`), and the patch case of T2 was not taken. Its first run started by an
intake's close. The workflow is `retrospective-periodic` v2, which includes `retrospective` v5
(`explore`, `additional-points`, `capture`, `approve`); until this repository adopts `base` (W10),
a change of governance is a point, ruled by its own decision-log under `decision-log-ingest` and
applied by a dl actions plan (dl-006 R2 as amended by dl-022); a WingFoil defect is a feedback
note (`wingfoil-cli`), not a decision.

**The model** is plan-054 (the periodic retrospective of 2026-10-28, its inventory
`docs/retrospectives/2026-10-28-periodic-friction-inventory.md`, its decision-log dl-028), with
plan-059's inventory (`2026-11-02-pack-methodology-kanban-friction-inventory.md`, dl-034) for the
part of the period it already covers.

**Deadline** (plan-060 ruling 6): WingFoil's v0.4 release planning started on 2026-11-03, before
the intake closed, a case dl-029 T2 does not cover; the approver ruled that the WingFoil-side
notes reach `main` as soon as possible while v0.4's planning is still running, so that WingFoil
can still read them there, and that this retrospective closes within seven days of plan-060's
close. No work of this repository waits for v0.4's planning to end.

**Asked by the approver** on 2026-11-03 (plan-060 › Execution Notes): a candidate `GOV` to read
here: the branch CI in place of the local clean clones of a tooling task, keeping locally only
`validate:publication`, the golden tree in publication mode, `index -- --check` and
`workflow list`; linked to G12 (the suite's duration against the CI timeout).

**Deviations from the workflows**, as plan-054 and plan-059 recorded theirs:
- `retrospective` v5's `capture` produces decision-logs only; the feedback notes, if any, are
  written by task-076, hosted by this plan (the inbox test requires a note's first line to name a
  task or a pack-release);
- the governance decision-logs run `decision-log-ingest`'s `capture` inside this plan, with no plan
  of their own, and its `rule` alongside `approve` (step 5);
- new here: task-076 starts from `main` and merges into `main` alone, not into this plan's branch,
  so that its notes reach WingFoil as soon as possible (plan-060 ruling 6).

**After this plan** (plan-060 ruling 8): one dl actions plan for dl-035 … dl-037 and the
governance decision-logs this retrospective approves; then the plan of WingFoil UI's feedback.
The dl actions of dl-024 and dl-025 have their own row, placed by the approver.

**Numbers** (next free on `main` when this plan was added): plan-061 (this plan), dl-038 (the
retrospective's decision-log), then the governance decision-logs in order, task-076 (the notes
task, if any), F-043 (its first note), bug-011, prel-007. The WingFoil pin is 0.2.2, so `memory
add` numbers by count (`wingfoil-cli` W-14): elements of one type added in order, each printed id
checked, none added on this plan's branch while another branch holds a new element of the same
type.

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **Scope, period and names.** Recommended: the scope `periodic`; the inventory
   `docs/retrospectives/<YYYY-MM-DD>-periodic-friction-inventory.md`, dated the day it is
   committed; dl-038 "Retrospective periodic <YYYY-MM-DD>". The period runs from 2026-10-29
   (plan-054's close, `f478934`) to plan-060's close.
2. **The sources.** Recommended:
   - mined here: plan-055 (the dl actions of dl-029, dl-031, dl-032 and dl-033; dl-030 was applied
     by task-065 under plan-054), plan-059 (the `kanban`
     retrospective as a run of the rules: its register, its candidates, task-073 and F-042),
     plan-060 with task-074, task-075 and bug-010, plan-022's close and the ruling of dl-024 and
     dl-025 (2026-11-03), the decision-logs dl-034 … dl-037 as written, the rows added to
     `docs/owed-items.md` since `f478934`, and the git log and the public CI runs of the period
     (G12's evidence, the runs cancelled by a later push);
   - **cited, not mined again:** the `kanban` cycle (plan-056 … plan-058, task-066 … task-072,
     bug-009, prel-006), from the inventory of 2026-11-02, its points carried over only where the
     periodic view changes them (for example a point seen again in plan-060);
   - not sources: WingFoil UI's adoption feedback (its own plan follows); dl-007, dl-011 … dl-013
     (`pending`).
   Alternative: mine the `kanban` cycle again; not recommended, it doubles the 2026-11-02 work.
3. **The candidates** the inventory starts from (`explore` confirms, corrects or drops each, citing
   its source, and adds what it finds), what went well beside what went wrong (dl-006 R5):
   - `+`: dl-029's `retrospective-start` ran as written for the first time; the intake's check of
     0.3.2 on the real engine found bug-010 before the record merged, and dl-019 took it to the
     approver the same day; the recheck matched plan-051's (`base@1.0.0`'s 14 of 18 failures);
     every element reviewed, the reviews finding a missed test (task-074's body) and the golden
     tree's untested release (plan-060's scratch run);
   - `−`: the matrix modelled a project without `init`'s built-in directive files, latent until
     0.3.2 (bug-010; since when, `explore` establishes); plan-060's scratch run edited the root
     `compat.yaml` only, so the golden tree's run was not on 0.3.2; the local clean clones' cost,
     the source of the approver's rules of 2026-11-03 (its figures established by `explore` from
     task-074's and task-075's notes); `main`'s CI runs cancelled by the next push, several on
     2026-11-03 (rule 3 foresees it); WingFoil's v0.4 planning date not announced, then started
     before the intake closed (dl-029 T2's gap, its row);
   - `WF`: none known; `explore` reads F-038 … F-042 against 0.3.2's CHANGELOG (a point 0.3.2
     fixed is not sent again, its note's ledger row says so), checks whether 0.3.2's warning on a
     binding with no file deserves a note (it is a documented fix: probably not), and reads F-019
     (built-in directive ids readable only from a project) against 0.3.2 and bug-010, for a fact to
     add at the next sync rather than a new note;
   - `GOV`: the branch CI in place of the local clean clones (asked by the approver, G12); the
     approver's order of checks of 2026-11-03 (the review and its amendments first, the clean
     clones once on the frozen code, documentation-only commits after them needing no new run, no
     heavy reviewer run beside them), which lives only in plan-060's note: where it is written
     (`repository-practice` or `tooling-delivery`), ruled with the branch-CI candidate, which would
     supersede part of it; dl-029 T2's case of a planning that starts before the intake's close;
     others only as `explore` finds them.
4. **The register** (dl-031 R3, dl-036 R1). Recommended: one line per open row (43 on `main` at
   `6e0c685`, recounted in `explore`), each with keep, assign or drop and its reason; the rows whose
   trigger is "the next retrospective" fall due here (dl-036 R1: this periodic one, so the "not
   touched" reading of a pack's retrospective does not apply): each is proposed on its merits, not
   kept by default. dl-036 is approved but not yet applied (`repository-practice` is still 1.1), so
   R1 and R5 are read from the decision-log. G12's line is ruled together with the branch-CI
   candidate (G12 kept at W10 on 2026-11-02 and by plan-060 ruling 4; its evidence now includes
   task-075's merge, a job of 20 min 04 s, run 41721858295); if that candidate is kept, its
   decision-log is applied by ruling 8's plan beside dl-035 A4's change to `ci.yml`. dl-038's Debts
   rule the table; `docs/owed-items.md` is changed at this plan's close.
5. **Changes of governance.** Recommended: the test of plan-054's P1 (dl-028 N4): a `GOV`
   candidate becomes a decision-log only if this repository's adoption of the packs and its pin at
   0.3.1 or later (W10) would not fix it; otherwise a row with the trigger W10. Each kept candidate
   is one decision-log under `decision-log-ingest`, numbered after dl-038, captured and ruled here,
   applied by the dl actions plan of ruling 8 (none applied here).
6. **WingFoil-side points.** Recommended: only as feedback notes in the inbox (`svc-018`), each
   reproduced with WingFoil alone on 0.3.0, 0.3.1 and 0.3.2, its `wingfoil_version` the newest
   release it reproduces on, written by task-076 (`tooling-delivery`, `pack: ""`), hosted by this
   plan on `task/task-076-<slug>` from `main` (task-076 added with `memory add` on that branch, no
   other task added on any branch meanwhile, W-14), numbered from F-043, first line `New note
   (task-076).`, one ledger row each, `Last sync` unchanged; its body cites the inventory by its
   path and date and the candidates' ids, since the inventory and dl-038 are not on `main` when it
   merges, and this plan's close adds the cross-references; opened right after the
   `additional-points` checkpoint, beside dl-038; merged into `main` alone, on the approver's OK, as
   soon as it is done (ruling 6's "as soon as possible"), before this plan's branch closes; a notice
   to the coordination of the WingFoil projects, recipients named by project (dl-036 R5), its text
   shown to the approver first. No task if no note survives `explore` and the checkpoint.
7. **The close's notes.** Recommended: an Execution Note on dl-006 (R3 met for the period), one on
   dl-029 (the first run of `retrospective-start`, and T2's gap with its row) and one on dl-036
   (R1's first periodic application, before its dl actions); none on the charters (no pack's cycle
   ran in the period beyond `kanban`'s, closed by plan-059).
8. **Where the work runs.** Recommended: this plan on `main`; the inventory, the approver's points,
   dl-038 and any governance decision-log on the branch `retro/<YYYY-MM-DD>-periodic` from `main`
   after `submit`; task-076 on its own branch, merged into `main` alone (point 6); at the close, on
   the approver's OK, `--no-ff` into `main`. No change under `src/`, `packs/` or `.wingfoil/` except
   a `wingfoil-cli` entry a kept note needs, inside task-076.

## The approver's rulings

Given by the approver on 2026-11-04: every point of the outline as recommended.
1. **Point 1:** the scope `periodic`; the inventory and dl-038 named as written; the period from
   2026-10-29 (`f478934`) to plan-060's close.
2. **Point 2:** the sources as written; the `kanban` cycle cited from the inventory of 2026-11-02.
3. **Point 3:** the candidates as the inventory's starting list, `explore` confirming, correcting
   or dropping each.
4. **Point 4:** one line per open row, each on its merits; G12 ruled with the branch-CI candidate.
5. **Point 5:** a governance decision-log only for a candidate the adoption (W10) would not fix.
6. **Point 6:** notes only after reproduction on 0.3.0, 0.3.1 and 0.3.2, by task-076 from `main`,
   merged alone as soon as done, then the notice.
7. **Point 7:** notes on dl-006, dl-029 and dl-036 at the close.
8. **Point 8:** this plan on `main`; the work on `retro/<YYYY-MM-DD>-periodic`.

## Steps

Before every commit, the privacy check (`repository-practice` rule 2: no local or scratch path, no
private repository or project, no intermediary session); after every push to `main`, its CI read
(rule 3); after every commit under `docs/memory/`, `docs/plans/` or `.wingfoil/`,
`npm run -s wingfoil -- workflow list` and `npm run lint` exit 0. Files staged by name. Tooling
checks follow the approver's order of 2026-11-03 (the review and its amendments, then the clean
clones once on the frozen code; no heavy reviewer run beside them).

1. **This plan:** an independent review (dl-017), amended; the approver's rulings on the outline,
   recorded here (a ruling that leaves an owed item adds its row in the same commit, dl-036 R2);
   `submit` (`draft → active`).
2. **`explore`** (facilitator, read-only on Memory): read-only subagents, one per strand (plan-055
   and the rules' application; plan-059 and plan-060 with their tasks and bug; the register and the
   CI runs), each returning points with their sources; claude builds the inventory: themes, the
   `+`/`−`/`WF`/`GOV` candidates, "The rules of 2026-11-02 revisited" (dl-034 … dl-037 as ruled,
   not yet applied), and the register's table (point 4); committed alone, then an independent
   review checks every citation, and the inventory is amended.
3. **`additional-points`** (approver): the inventory shown in chat; the approver adds points. A
   checkpoint, no commit.
4. **`capture`** (facilitator): the approver's points in their own commit; dl-038 and each kept
   governance decision-log (`memory add`, body, independent review, `submit`). In parallel, right
   after the checkpoint, task-076 if a note is kept (point 6), through `tooling-delivery` as
   plan-054's task-064: its body (Context, Acceptance, Design) reviewed and amended, `submit`, the
   approver's backlog acceptance; the build (each note reproduced with WingFoil alone on 0.3.0,
   0.3.1 and 0.3.2, a difference going to the approver); the build review and its amendments, then
   the checks from clean clones once on the frozen commit, on Node.js 22.21.0 and 22.12.0 one after
   the other (the approver's order of 2026-11-03); the branch CI's conclusion; `in-review`, the
   approver's approval and merge OK, `--no-ff` into `main`, `main`'s CI read, `done`; the notice.
5. **`approve`** (product-owner, held by the approver): claude hands each command
   (`npm run -s wingfoil -- memory approve <id> --reason "…"`, with the `cd` to the repository
   root); a rejection sends the element back to `capture`. dl-038 must be ruled for this plan to
   close; a governance decision-log may stay `pending`.
6. **Close:** the notes of point 7; `docs/owed-items.md` per dl-038's Debts (rows kept, reassigned,
   dropped to Closed with dl-038's id; new rows with their sources); the account per tech-spec
   (dl-020); the reserved numbers left unused released; the privacy check of the branch's diff and
   commit messages recorded; on the approver's OK, `--no-ff` merge, push, `main`'s CI read, the
   branch removed; `active → done` within seven days of plan-060's close.

## Handoff

- **claude (facilitator; product-owner's drafts):** steps 1, 2, 4 and 6, the commands of step 5
  and task-076's work. It never runs `memory approve` or `memory reject`. No pull request. Memory is
  changed only through `npm run -s wingfoil -- memory add|submit` and by editing an element's body.
- **Reviewer:** an independent subagent for this plan, the inventory, dl-038, each governance
  decision-log, task-076's body and build, and the close (dl-017).
- **Approver:** the outline before `submit`; the additional points; task-076's acceptance, approval
  and merge OK; the ruling of dl-038 and of each governance decision-log; the notice's text; the
  merge OK.
- Done when the inventory is committed; dl-038 is `approved` and every governance decision-log is
  ruled or left `pending`; task-076, if opened, is `done` and its notes on `main`; the notes on
  dl-006 and dl-029 and the register's changes are written; the notice sent if task-076 opened; the
  branch merged and removed; within seven days of plan-060's close.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-04: added by plan-060's `retrospective-start` (dl-029 T1); `workflow` and `phase` filled
  by editing the draft (W-02).
- 2026-11-04: independent review: approve after amendments, nothing blocking; six should-fix and
  six nits, all applied: the deviations from the workflows stated; task-076's branch from `main`,
  its `memory add` there and its citations of the inventory; task-076 opened after the checkpoint,
  beside dl-038, its loop and the approver's order of checks; that order as a `GOV` candidate; G12's
  line ruled with the branch-CI candidate, its new evidence; the clean clones' figures left to
  `explore`; the register's count as of `6e0c685`; plan-055's actions; F-019 to read; the origin of
  bug-010's defect left to `explore`; dl-036 not yet applied; a note on dl-036 at the close.
- 2026-11-04: the approver ruled the outline (every point as recommended); submitted
  (`draft → active`).
- 2026-11-04, `explore`: plan submitted `active` (`ecd7e4d`); the branch `retro/2026-11-04-periodic`
  from `main` at `f01e53f` (plan-060's close; `main`'s CI on it, run 41850628713, `success`). Three
  read-only subagents mined the strands; the inventory committed alone (`e87fff0`), checked by an
  independent review (every citation and CI figure; approve after amendments, nothing blocking) and
  amended (`8b14afe`).
- 2026-11-04, `additional-points`: the approver ruled the checkpoint as the inventory's §10
  recommends, adding no point; recorded as P1 … P3 (`973af08`).
- 2026-11-04, `capture`: `memory add` gave dl-038 … dl-040 in order (`ede7cfb` … `7d947a9`), each id
  checked: dl-038 the retrospective, dl-039 the branch CI in place of the clean clones with the
  order of checks and G12 (GOV-1, GOV-2), dl-040 dl-029 T2's missing case (GOV-3); GOV-4 a sentence
  of `repository-practice` 1.2. Each reviewed independently (approve after amendments, nothing
  blocking), amended, re-reviewed together (dl-039 approve; dl-038 and dl-040 approve after
  amendments), amended; submitted `pending` (`3568d14` … `283a1c6`); dl-040's re-review amendments
  landed after its submit, by a slip of the script, and were applied while `pending` (`6e5110a`).
  No feedback note (P3): task-076 not opened.
- 2026-11-04, `approve`: the approver approved dl-038, dl-039 (with its departure from the local
  list: `index -- --check` left to the CI's `validate`) and dl-040 (`0dedcff`, `0130bde`,
  `e3c7491`).
- Step 6, the close:
  - **The notes:** on dl-006 (R3 met for the period), dl-029 (`retrospective-start`'s first run and
    T2's case, made general by dl-040) and dl-036 (R1's first periodic application).
  - **The register** (`docs/owed-items.md`, dl-038 D1 … D3): rows reassigned as D1 rules (rows 1, 5,
    10, 15, 17, 20, 21, 22, 24, 26, 39, 40, 41, 42, 43); three to Closed (the "known defects"
    marker dropped; the general in-place amendment merged into G7; `--param` merged into the
    private projects' check); three new (dl-030's note, the built-in ids compared, F-019's facts);
    row 16 widened to dl-039, dl-040, rule 3's sentence and the notes (D3). 43 open rows.
  - **The account per tech-spec (dl-020):** none amended or erratum recorded here.
  - **Numbers:** plan-061, dl-038 … dl-040 used; task-076 and F-043 not used (P3), released, with
    bug-011 and prel-007.
  - **Privacy:** every commit checked before it was made; the branch's diff against `main` and its
    commit messages checked: no local or scratch path, no private repository or project, no
    intermediary session; the only name is the CLI's `Approver:` trailer on the approval commits,
    as on `main`.
  - **Next plans:** the dl actions plan of dl-035 … dl-040 (row 16), then that of dl-024 and dl-025
    (row 5), then WingFoil UI's feedback (row 43).
  - Still to do before `active → done`: the branch CI's conclusion; on the approver's OK, the
    `--no-ff` merge into `main`, `main`'s CI read, the branch removed; within seven days of
    plan-060's close (by 2026-11-11).
- 2026-11-04, branch close: CI run 41900866759 on `d16aa10`, `success` (`validate (22.21.0)`,
  `validate (22.12.0)`, 15 min 49 s each). The approver gave the merge OK; `--no-ff` merge into
  `main`.
- 2026-11-04, close: merged into `main` (`de61bed`), pushed, the branch removed locally and on
  origin; `main`'s CI on `de61bed`, run 41903963273, `success`. Done: the inventory committed;
  dl-038, dl-039 and dl-040 approved; no task-076 (no note kept); the notes on dl-006, dl-029 and
  dl-036 and the register's changes written; the branch merged and removed; within seven days of
  plan-060's close. The run of this note's push and of `active → done` is read by the next plan
  (dl-038 C3). `active → done`.
