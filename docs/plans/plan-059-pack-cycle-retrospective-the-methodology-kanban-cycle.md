---
id: plan-059-pack-cycle-retrospective-the-methodology-kanban-cycle
type: plan
title: "pack-cycle retrospective: the methodology/kanban cycle"
status: draft
workflow: "pack-cycle"
phase: "retrospective"
tags: ["process","retrospective","kanban","W10"]
---

## Context

The `retrospective` phase of `pack-cycle` (v6) for `pack-methodology-kanban`, `active` since
2026-11-02 (plan-058 › step 7). Asked by the approver on 2026-11-02. `pack-cycle` v6 runs
`retrospective` after `activate` (dl-033 O1); `kanban`'s cycle ran alone (plan-056 `charter`,
plan-057 `author`, plan-058 `first-release` and `activate`), so the retrospective is its own: no
other pack shares it (dl-033 O2). It is **not** the periodic retrospective: plan-058 ruling 5
(option (b) of its point 8) leaves the periodic one to dl-029's trigger, the close of the WingFoil
0.3.2 intake. This plan settles the row "`kanban`'s own `pack-cycle` retrospective" of
`docs/owed-items.md` (plan-058 ruling 5; dl-033 O2).

It is the first cycle run wholly under the rules of the retrospective of 2026-10-28 (dl-028):
dl-030's directive `repository-practice` (rules 1 … 3), dl-031's register (rule 4), dl-032's runs
on the real engine (E2 at `charter`, E4 at `author`, E3 at `first-release`) and dl-033's order
(`activate`, then `retrospective`). The inventory says how each held.

The workflow is `retrospective` v5 (`explore`, `additional-points`, `capture`, `approve`), included
by `pack-cycle` v6. Until this repository adopts `base` (W10), a change of governance is a point,
ruled by its own decision-log under `decision-log-ingest` and applied by a dl actions plan (dl-006
R2 as amended by dl-022); a WingFoil defect is a feedback note (`wingfoil-cli`), not a decision.

**The model** is plan-054 (the shared retrospective of `base`, `software` and `methodology/scrum`,
also periodic), its inventory `docs/retrospectives/2026-10-28-periodic-friction-inventory.md` and
its decision-log dl-028, for one pack and a period of four days.

**Preconditions, met.**
- `methodology/kanban` 1.0.0 published (prel-006; tag `methodology/kanban@1.0.0` at `31102df`,
  catalog commit `3e5d773`), the charter `active` (`7fc293a`).
- plan-056, plan-057 and plan-058 `done`; their tasks (task-066 … task-072), bug-009 and prel-006
  closed as their plans record.
- `main` at `3803673` (this plan's `memory add`) over `0162c90`.

**After this plan, not in it:** the plan that captures WingFoil UI's feedback after adopting
`base`, `software` and `methodology/scrum` by hand (the row of `docs/owed-items.md` whose trigger is
"after the plan of `kanban`'s own retrospective"). This retrospective may cite that row; it does not
capture the feedback.

**Deviations from the workflows**, as plan-054 recorded its own:
- `retrospective` v5's `capture` produces decision-logs only; a feedback note, if one is kept, is
  written by a task hosted by this plan (the inbox test requires a note's first line to name a task
  or a pack-release), as task-064 was by plan-054;
- a governance decision-log, if one is kept, runs `decision-log-ingest`'s `capture` inside this
  plan, with no plan of its own, and its `rule` alongside the retrospective's `approve`.

**Numbers** (next free on `main` at `3803673`): plan-059 (this plan), dl-034 (the retrospective's
decision-log), task-073 (the notes task, if any), F-042 (the first note, if any), bug-010 (a defect
of this repository found here, if any). A governance decision-log takes the number `memory add`
gives after dl-034. The WingFoil pin is 0.2.2, so `memory add` numbers by count (`wingfoil-cli`
W-14): elements of one type are added in order, each printed id checked, and none is added on this
plan's branch while another branch holds a new element of the same type.

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **Scope, period and names.** Recommended: the scope is the pack id, `pack-methodology-kanban`
   (`retrospective` v5 › `explore`: "the pack id or `periodic`"). The inventory is
   `docs/retrospectives/<YYYY-MM-DD>-pack-methodology-kanban-friction-inventory.md`, dated the day it
   is committed; the decision-log dl-034 "Retrospective pack-methodology-kanban <YYYY-MM-DD>"
   (`capture`'s title). The period runs from 2026-10-29 (plan-056 written, after plan-055's close)
   to 2026-11-02 (plan-058 closed, `c316fe8`). Alternative: the catalog id `methodology/kanban`,
   which holds a slash and cannot name a file.
2. **The sources.** Recommended:
   - plan-056, plan-057 and plan-058, with their outlines, rulings, Execution Notes and closes;
   - task-066 … task-072 with their reviews, bug-009, prel-006, the charter
     `pack-methodology-kanban` with its Execution Notes and Open points;
   - for a section "The rules of 2026-10-28 in their first cycle": dl-030 … dl-033 as
     `repository-practice` 1.1, `pack-cycle` v6, `pack-release-cycle` v8 and `pack-compatibility`
     write them, read against what the three plans did;
   - `docs/owed-items.md`: its rows added or changed in the period (plan-056, plan-057, plan-058,
     `3be4f38`, `0162c90`), and every open row for point 4;
   - the git log and the public CI runs of the period (`main`'s red runs of bug-009 included).
   Not sources: plan-055 (the dl actions of dl-029 … dl-033, closed on 2026-10-29: the periodic
   retrospective's, cited only where a source cites it); WingFoil UI's adoption feedback (its own
   plan, after this one); dl-013, dl-024 and dl-025 (`pending`). No feedback note was added in the
   period (the inbox ends at F-041). Alternative: plan-055 as a source too, since it wrote the rules
   this cycle ran under; then the inventory overlaps the next periodic one.
3. **The candidates** the inventory is built around (from this plan's reads; `explore` confirms,
   corrects or drops each, citing its source, and adds what it finds), what went well beside what
   went wrong (dl-006 R5):
   - went well (`+`): the run on the engine before the charter's acceptance (dl-032 E2) changed
     `delivery`'s filter, found the reject past a full limit and the `{release.id}` scope token
     before acceptance (plan-056 › step 2, step 4); task-069's run by hand changed nothing in the
     shape; the publication rehearsal on a scratch clone found no break with a fourth pack
     (plan-058 › step 2); reviews found blocking defects before code (plan-056: the release filter,
     the `memory add` command; plan-057: the lint count; task-066: its in-process test); charter
     to published 1.0.0 in four days, every gate passed; the first `pack-cycle` v6 order kept as
     written;
   - friction (`−`): the Node.js warning's cause named wrongly (the charter and the owed row said
     the composer; task-066 fixed one site and its review missed the second, so task-070 followed);
     three tooling tasks and one bug outside the outline (task-070, task-071, task-072, bug-009),
     each needing a ruling (plan-057 rulings 6 … 8); `main` red for about two days on an advisory in
     a development dependency (bug-009; the CI-policy row of `docs/owed-items.md`, met again); the
     CI job at 19 min 26 s of its 30-minute timeout (G12's row); a run cancelled by the next push
     (plan-058's submit); the dry run's first attempt failing on the checking script's own
     `node_modules` link (plan-058 › step 4); open points 2 and 3 of the charter not exercised;
     bug-008 still bringing back closed retrospectives' `approve` steps;
   - WingFoil-side (`WF`): `memory reject` moves a task into a state over its `limits` with no
     refusal (plan-056 › step 4; task-069): a candidate note, if `explore` finds no WingFoil text
     documenting it;
   - governance (`GOV`): whether a defect of the tooling found inside a pack plan may open a
     tooling task with no ruling of its own (rulings 6 … 8 each asked the approver); others only as
     `explore` finds them.
   Alternative: no list here, `explore` starting from the sources alone.
4. **The register** (dl-031 R3: every retrospective proposes keep, assign or drop for each row).
   Recommended: the inventory holds a table of every open row with the proposal and its reason;
   - rows of this cycle (bug-009's two rows and the CI-policy row; the scripted full run; the
     "own entries" row; the charter's Adoption rows; G12) are proposed on their merits;
   - rows with the trigger "the next retrospective" that this cycle did not touch are proposed
     **keep**, their trigger rewritten to "the periodic retrospective (dl-029)", so that a
     retrospective of one pack does not rule the repository's whole backlog;
   - rows with the trigger W10, the adoption or the pin bump: keep, unless a source of the period
     settles them;
   - the row "`kanban`'s own `pack-cycle` retrospective" moves to Closed at this plan's close,
     settled by plan-059 (dl-034).
   dl-034 rules the table (its Debts). Alternative: every row ruled on its merits here, the
   periodic retrospective then re-reading only the rows added after it.
5. **Changes of governance.** Recommended: plan-054's test (its P1): a `GOV` candidate becomes a
   decision-log only if this repository's adoption of the packs and its pin at 0.3.1 (W10) would
   not fix it; otherwise it is a row of the register with the trigger W10. Each kept candidate is
   one decision-log under `decision-log-ingest`, numbered after dl-034, captured and ruled in this
   plan, applied later by a dl actions plan (none applied here). None is expected from the reads so
   far; the approver decides at `additional-points`.
6. **WingFoil-side points.** Recommended: only as feedback notes in the inbox (`svc-018`), each
   reproduced with WingFoil alone on 0.3.0 and 0.3.1 before it is written; written by task-073
   (`tooling-delivery`, `pack: ""`), hosted by this plan on a branch of its own from this plan's
   branch, numbered from F-042, first line `New note (task-073).`, one ledger row each,
   `Last sync` unchanged; no task if no candidate survives `explore` and the approver's checkpoint.
   WingFoil's v0.4 release planning starts not before 2026-11-06 (WingFoil's timing as of
   2026-10-28, read again at `explore`): task-073's notes are on `main` before it; if this plan's
   branch cannot close by 2026-11-05, task-073's merge goes to `main` on its own, on the
   approver's OK, `--no-ff`, as plan-054 provided.
7. **The close's notes.** Recommended: one Execution Note on `pack-methodology-kanban`, added when
   dl-034 is approved and citing it, completing `retrospective` (the request); no note on dl-006
   (R1's order is `pack-cycle` v6's, followed as written, with nothing to record) and none on
   dl-033 (no shared retrospective). Alternative: a note on dl-006 recording R1 met for `kanban`,
   as plan-054 did for the three packs.
8. **Where the work runs.** Recommended: this plan's document on `main` (as plan-056 … plan-058);
   the inventory, the approver's points, dl-034, any governance decision-log and task-073's merge
   on the branch `retro/<YYYY-MM-DD>-pack-methodology-kanban` from `main` after `submit`; at the
   close, on the approver's OK, `--no-ff` into `main`. No WingFoil UI capture, no release of a pack,
   no change of a tech-spec, no change under `src/`, `packs/` or `.wingfoil/`.

## The approver's rulings

<!-- Recorded when given. -->

## Steps

Before every commit, the privacy check (`repository-practice` rule 2: no local or scratch path, no
private repository or project, no intermediary session); after every push to `main`, its CI read
(rule 3); after every commit under `docs/memory/`, `docs/plans/` or `.wingfoil/`,
`npm run -s wingfoil -- workflow list` and `npm run lint` exit 0. Files staged by name.

1. **This plan** (product-owner): `memory add` (`3803673`), body, an independent review (dl-017),
   amended; the outline ruled by the approver; `submit` (`draft → active`); `main` pushed and its
   CI read.
2. **`explore`** (facilitator, read-only on Memory), on the branch of point 8:
   - three read-only subagents, one per strand, each returning points with their sources, what went
     well beside what went wrong, and the `WF`, `GOV` and `DEBT` marks:
     a. the charter: plan-056 (its reads, the run on the engine of step 2 and step 4, the
        rulings), the charter's body and notes;
     b. `author`: plan-057, task-066 … task-072 with their reviews, bug-009, `main`'s CI in the
        period;
     c. `first-release` and the rules: plan-058, prel-006, the rehearsal, `activate`, the notices;
        the section on dl-030 … dl-033 in their first cycle;
   - claude reads the register (point 4) and, for each `WF` candidate, WingFoil's documentation and
     whether a note already covers it; merges the strands and builds the inventory: a section per
     phase of the cycle, the cross-cutting themes, the section on the rules of 2026-10-28, the
     candidate notes (`WF`), the candidate changes (`GOV`), the register's table, what went well;
   - committed alone; an independent review checks every citation against its source; amended.
3. **`additional-points`** (approver): the inventory shown in chat; the approver adds points. A
   checkpoint, no commit.
4. **`capture`** (facilitator):
   - the approver's points added to the inventory in their own commit (or a line saying none were
     added);
   - dl-034 "Retrospective pack-methodology-kanban <YYYY-MM-DD>" (`memory add --type
     decision-log`, body by hand, `submit`, `draft → pending`): Keep, Change (governance, each by
     its own decision-log; WingFoil-side, as notes), Debts (the register's table, point 4),
     Observed; each point tied to the inventory;
   - each governance decision-log kept (point 5), under `decision-log-ingest`, cited by dl-034;
   - task-073 if a note is kept (point 6), through `tooling-delivery` as task-064: `plan` (its body
     reviewed and amended, `submit`, the approver's backlog acceptance), `build` (each note
     reproduced with WingFoil alone on 0.3.0 and 0.3.1 from `src/matrix/`; the checks from clean
     clones on Node.js 22.21.0, then 22.12.0, one after the other; the branch's CI read),
     `review` (an independent build review, `in-review`, the approver's approval), `deliver`
     (`--no-ff` into this plan's branch, `done`);
   - every element reviewed independently, amended while `pending`; a fix that changes a decision
     reviewed again (dl-017).
5. **`approve`** (product-owner, held by the approver): claude hands the approver each command,
   `cd /path/to/the/repository && npm run -s wingfoil -- memory approve <id> --reason "…"`, written
   out in full; a rejection sends the element back to `capture`. dl-034 must be ruled for this plan
   to close; a governance decision-log may stay `pending` (its `rule` has no deadline).
6. **Close:**
   - the charter's note (point 7), once dl-034 is approved;
   - `docs/owed-items.md`: dl-034's Debts applied (rows kept, reassigned, dropped to Closed with
     dl-034's id, triggers rewritten), the row of `kanban`'s retrospective moved to Closed (plan-059,
     dl-034), every item this plan leaves owed given its row (rule 4);
   - the reserved numbers left unused released; the privacy check of the branch's diff and of its
     commit messages recorded; the branch pushed, its CI conclusion recorded;
   - on the approver's OK, `--no-ff` merge into `main`, push, `main`'s CI read (the run that
     includes the merge), the branch removed locally and on origin; the next plan named (WingFoil
     UI's feedback);
   - `active → done` after `main`'s CI on the closing head.

## Handoff

- **claude (facilitator; product-owner's drafts):** steps 1, 2, 4 and 6, and in step 5 the
  commands it hands over; task-073's work if it opens. It never runs `memory approve` or
  `memory reject`. No pull request. Memory is changed only through `npm run -s wingfoil -- memory
  add|submit` and by editing an element's body. `docs/notes/` and `.idea/` stay untracked.
- **Reviewer:** an independent subagent for this plan, for the inventory, for dl-034, for each
  governance decision-log, for task-073's body and build, and for the close (dl-017).
- **Approver:** this outline before `submit`; the additional points (step 3); task-073's backlog
  acceptance and approval; the ruling of dl-034 and of each governance decision-log; the merge OK.
- Checkpoints: the plan, the inventory, dl-034 (and any governance decision-log), task-073, the
  merge.
- Done when the inventory is committed; dl-034 is `approved` and every governance decision-log is
  ruled or left `pending` by the approver; task-073, if opened, is `done` and its notes on `main`
  before WingFoil's v0.4 release planning; the charter's note and the register's changes are
  written; the branch is merged and removed. The plan then goes `active → done`.

## Execution Notes

- 2026-11-02: written as asked by the approver on 2026-11-02, after plan-058's close; `workflow`
  and `phase` filled by editing the draft (W-02). `main` at `3803673` over `0162c90`.
