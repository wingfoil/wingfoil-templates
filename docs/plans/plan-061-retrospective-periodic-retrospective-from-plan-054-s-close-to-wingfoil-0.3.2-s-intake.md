---
id: plan-061-retrospective-periodic-retrospective-from-plan-054-s-close-to-wingfoil-0.3.2-s-intake
type: plan
title: "retrospective-periodic retrospective: from plan-054's close to WingFoil 0.3.2's intake"
status: draft
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
   - mined here: plan-055 (the dl actions of dl-029 … dl-033), plan-059 (the `kanban`
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
   - `−`: the matrix modelled a project without `init`'s built-in directive files since task-035,
     latent until 0.3.2 (bug-010); plan-060's scratch run edited the root `compat.yaml` only, so the
     golden tree's run was not on 0.3.2; the local clean clones' cost (a full rerun after task-075's
     review fixes, `npm test` from 20 min to hours on a loaded machine), the source of the
     approver's rules of 2026-11-03; `main`'s CI runs cancelled by the next push, several on
     2026-11-03 (rule 3 foresees it); WingFoil's v0.4 planning date not announced, then started
     before the intake closed (dl-029 T2's gap, its row);
   - `WF`: none known; `explore` reads F-038 … F-042 against 0.3.2's CHANGELOG (a point 0.3.2
     fixed is not sent again, its note's ledger row says so) and checks whether 0.3.2's warning on a
     binding with no file deserves a note (it is a documented fix: probably not);
   - `GOV`: the branch CI in place of the local clean clones (asked by the approver, G12);
     dl-029 T2's case of a planning that starts before the intake's close; others only as
     `explore` finds them.
4. **The register** (dl-031 R3, dl-036 R1). Recommended: one line per open row (43 at plan-060's
   close), each with keep, assign or drop and its reason; the rows whose trigger is "the next
   retrospective" fall due here (dl-036 R1: this periodic one, so the "not touched" reading of a
   pack's retrospective does not apply): each is proposed on its merits, not kept by default.
   dl-038's Debts rule the table; `docs/owed-items.md` is changed at this plan's close.
5. **Changes of governance.** Recommended: the test of plan-054's P1 (dl-028 N4): a `GOV`
   candidate becomes a decision-log only if this repository's adoption of the packs and its pin at
   0.3.1 or later (W10) would not fix it; otherwise a row with the trigger W10. Each kept candidate
   is one decision-log under `decision-log-ingest`, numbered after dl-038, captured and ruled here,
   applied by the dl actions plan of ruling 8 (none applied here).
6. **WingFoil-side points.** Recommended: only as feedback notes in the inbox (`svc-018`), each
   reproduced with WingFoil alone on 0.3.0, 0.3.1 and 0.3.2, written by task-076
   (`tooling-delivery`, `pack: ""`), hosted by this plan on a branch of its own, numbered from
   F-043, first line `New note (task-076).`, one ledger row each, `Last sync` unchanged; merged into
   `main` alone, on the approver's OK, as soon as it is done (ruling 6's "as soon as possible"),
   before this plan's branch closes; a notice to the coordination of the WingFoil projects,
   recipients named by project (dl-036 R5), its text shown to the approver first. No task if no
   note survives `explore` and the checkpoint.
7. **The close's notes.** Recommended: an Execution Note on dl-006 (R3 met for the period) and one
   on dl-029 (the first run of `retrospective-start`, and T2's gap with its row); none on the
   charters (no pack's cycle ran in the period beyond `kanban`'s, closed by plan-059).
8. **Where the work runs.** Recommended: this plan on `main`; the inventory, the approver's points,
   dl-038 and any governance decision-log on the branch `retro/<YYYY-MM-DD>-periodic` from `main`
   after `submit`; task-076 on its own branch, merged into `main` alone (point 6); at the close, on
   the approver's OK, `--no-ff` into `main`. No change under `src/`, `packs/` or `.wingfoil/` except
   a `wingfoil-cli` entry a kept note needs, inside task-076.

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
   governance decision-log (`memory add`, body, independent review, `submit`); task-076 if a note
   is kept (point 6).
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
