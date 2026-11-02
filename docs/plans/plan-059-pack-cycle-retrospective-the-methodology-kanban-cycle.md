---
id: plan-059-pack-cycle-retrospective-the-methodology-kanban-cycle
type: plan
title: "pack-cycle retrospective: the methodology/kanban cycle"
status: active
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
(`activate`, then `retrospective`). The inventory says how each held. dl-029 (the periodic
retrospective at an intake's close) did not run in this cycle: no WingFoil release was taken in.

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
- `main` at `3803673` (this plan's `memory add`) over `0162c90`, the last push, whose Pages run
  41483587206 is `success`; its CI run 41483587039 is recorded in the Execution Notes once
  concluded.

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
   `docs/retrospectives/<YYYY-MM-DD>-pack-methodology-kanban-friction-inventory.md`, dated the day
   it is committed; the decision-log dl-034 "Retrospective pack-methodology-kanban <YYYY-MM-DD>"
   (`capture`'s title). The period runs from 2026-10-29 (plan-056 written, after plan-055's close)
   to 2026-11-02 (plan-058 closed, `c316fe8`); `0162c90`, after it, is read for point 4 only.
   Alternative: the catalog id `methodology/kanban` slugged (`methodology-kanban`); not
   recommended, because `retrospective` v5's "pack id" reads as the Memory element id, the
   charter's (dl-004 keeps the two apart).
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
     to published 1.0.0 in four days, every gate of `pack-cycle` and `pack-release-cycle` passed;
     the first `pack-cycle` v6 order kept as written; a CI run cancelled by the next push handled
     as `repository-practice` rule 3 foresees (plan-058 › step 3);
   - friction (`−`): the Node.js warning's cause named wrongly (the charter and the owed row said
     the composer; task-066 fixed one site and its review missed the second, so task-070 followed);
     three tooling tasks and one bug outside the outline (task-070, task-071, task-072, bug-009),
     each needing a ruling (plan-057 rulings 6 … 8); `main` red for about one day on an advisory in
     a development dependency (2026-10-31 → 2026-11-01, runs 41196364111 … 41298773055; bug-009;
     the CI-policy row of `docs/owed-items.md`, met again); the CI job at 19 min 26 s of its
     30-minute timeout (G12's row); the dry run's first attempt failing on the checking script's
     own `node_modules` link (plan-058 › step 4); the driving scripts' slips in the runs by hand
     (plan-056 › step 2's `capture`; task-069's non-zero exits), evidence for the scripted-run row;
     open points 2 and 3 of the charter not exercised; bug-008 still bringing back closed
     retrospectives' `approve` steps;
   - WingFoil-side (`WF`): `memory reject` moves a task into a state over its `limits` with no
     refusal (plan-056 › step 4; task-069; observed on 0.3.1 only). No note covers it; the pack
     states it and works around it (the `kanban` directive, the charter), so a note would be a
     `request` (should `reject` refuse, or warn, past a limit?), not an undocumented defect;
     `explore` reads WingFoil's texts for it;
   - governance (`GOV`): whether a defect of the tooling found inside a pack plan may open a
     tooling task with no ruling of its own (rulings 6 … 8 each asked the approver); whether
     dl-031 R1's default trigger "the next retrospective" means the next retrospective of any kind
     or the next periodic one (point 4; `repository-practice` survives W10, so the adoption does
     not settle it); others only as `explore` finds them.
   Alternative: no list here, `explore` starting from the sources alone.
4. **The register** (dl-031 R3: every retrospective proposes keep, assign or drop for each row).
   Recommended: the inventory holds a table with one line per open row, each with its proposal and
   its own reason;
   - rows of this cycle (bug-009's two rows and the CI-policy row; the scripted full run; the
     "own entries" row; the charter's Adoption rows; G12) are proposed on their merits;
   - rows with the trigger "the next retrospective" that this cycle did not touch are proposed
     **keep**, row by row, their trigger unchanged, nothing in the period bearing on them, until
     the `GOV` candidate on dl-031 R1's default trigger (point 3) is ruled; no trigger is rewritten
     in this table;
   - rows with the trigger W10, the adoption or the pin bump: keep, unless a source of the period
     settles them;
   - every other row: keep, its trigger unchanged, unless a source of the period settles it; among
     them, WingFoil UI's feedback row (its trigger, "after the plan of `kanban`'s own
     retrospective", is met at this plan's close: the next plan) and the dl-024/dl-025 row (its
     trigger, WingFoil v0.4's planning, is close: about 2026-11-06), both named for the approver;
   - the row "`kanban`'s own `pack-cycle` retrospective" moves to Closed at this plan's close,
     settled by plan-059 (dl-034).
   dl-034 rules the table (its Debts). Alternative: every row ruled on its merits here; the
   periodic retrospective still proposes for every row (dl-031 R3), citing this ruling as its
   reason where nothing changed.
5. **Changes of governance.** Recommended: the test of the inventory of 2026-10-28, P1 (dl-028
   N4): a `GOV` candidate becomes a decision-log only if this repository's adoption of the packs
   and its pin at 0.3.1 (W10) would not fix it; otherwise it is a row of the register with the
   trigger W10. Each kept candidate is one decision-log under `decision-log-ingest`, numbered after
   dl-034, captured and ruled in this plan, applied later by a dl actions plan (none applied here).
   The approver decides at `additional-points` which candidates are kept.
6. **WingFoil-side points.** Recommended: only as feedback notes in the inbox (`svc-018`), each
   reproduced with WingFoil alone on 0.3.0 and 0.3.1 before it is written; written by task-073
   (`tooling-delivery`, `pack: ""`), hosted by this plan on a branch of its own from this plan's
   branch, numbered from F-042, first line `New note (task-073).`, one ledger row each,
   `Last sync` unchanged; a `wingfoil-cli` entry only if a kept note needs one; no task if no
   candidate survives `explore` and the approver's checkpoint. The inbox has never been synced
   (`Last sync: none`), so once the notes are on `main` a short notice outside the repository,
   carrying no WingFoil point, names their ids and the commit, as plan-054's step 6; its text is
   shown to the approver before it is sent.
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
   no change of a tech-spec, no change under `src/`, `packs/` or `.wingfoil/` (except a
   `wingfoil-cli` entry a kept note needs, inside task-073).

## The approver's rulings

Given on 2026-11-02, in chat: every point of the outline as recommended.
1. **Point 1:** the scope `pack-methodology-kanban`; the inventory and dl-034 named as written; the
   period 2026-10-29 … 2026-11-02 (`c316fe8`), `0162c90` read for point 4 only.
2. **Point 2:** the sources as written; plan-055 and WingFoil UI's feedback not sources.
3. **Point 3:** the candidates as the inventory's starting list, `explore` confirming, correcting
   or dropping each.
4. **Point 4:** one line per open row; rows of this cycle on their merits; the others kept, their
   triggers unchanged; the row of `kanban`'s retrospective closed at this plan's close.
5. **Point 5:** a governance decision-log only for a candidate the adoption (W10) would not fix.
6. **Point 6:** notes only after reproduction on 0.3.0 and 0.3.1, by task-073, on `main` before
   WingFoil's v0.4 release planning, with the 2026-11-05 fallback and the notice.
7. **Point 7:** one note on the charter citing dl-034; none on dl-006 or dl-033.
8. **Point 8:** this plan on `main`; the work on `retro/<YYYY-MM-DD>-pack-methodology-kanban`.

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
   - dl-034 "Retrospective pack-methodology-kanban <YYYY-MM-DD>" (`npm run -s wingfoil -- memory
     add --type decision-log --title "Retrospective pack-methodology-kanban <YYYY-MM-DD>"`, the
     printed id checked, body by hand, `submit`, `draft → pending`): Keep, Change (governance, each
     by its own decision-log; WingFoil-side, as notes), Debts (the register's table, point 4),
     Observed; each point tied to the inventory;
   - each governance decision-log kept (point 5), under `decision-log-ingest`, cited by dl-034;
   - task-073 if a note is kept (point 6), through `tooling-delivery` as task-064: `plan` (its body
     reviewed and amended, `submit`, the approver's backlog acceptance), `build` (each note
     reproduced with WingFoil alone on 0.3.0 and 0.3.1 from `src/matrix/`; the privacy check,
     intermediary sessions included; `npm ci`, `npm test`, `lint`, `check:pins`, `check:schemas`,
     `check:packs`, `validate`, `index -- --check`, `check:runs` and `workflow list` exit 0 from
     clean clones on Node.js 22.21.0, then 22.12.0, one after the other; the branch's CI read),
     `review` (an independent build review, `in-review`, the approver's approval), `deliver`
     (`--no-ff` into this plan's branch, `done`);
   - every element reviewed independently, amended while `pending`; a fix that changes a decision
     reviewed again (dl-017).
5. **`approve`** (product-owner, held by the approver): claude hands the approver each command,
   `npm run -s wingfoil -- memory approve <id> --reason "…"`, from the repository root, the `cd`
   included in the command handed over in chat; a rejection sends the element back to `capture`.
   dl-034 must be ruled for this plan to close; a governance decision-log may stay `pending` (its
   `rule` has no deadline).
6. **Close:**
   - the account per tech-spec (dl-020): none amended, unless a step of this plan amends one;
   - the charter's note (point 7), once dl-034 is approved;
   - the notice of point 6, if task-073 opened;
   - `docs/owed-items.md`: dl-034's Debts applied (rows kept, reassigned, dropped to Closed with
     dl-034's id, a trigger changed only where dl-034 rules it for that row), the row of `kanban`'s
     retrospective moved to Closed (plan-059, dl-034), every item this plan leaves owed given its
     row (rule 4);
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
  acceptance and approval; the ruling of dl-034 and of each governance decision-log; the notice's
  text, if task-073 opens; the merge OK.
- Checkpoints: the plan, the inventory, dl-034 (and any governance decision-log), task-073 and its
  notice, the merge.
- Done when the inventory is committed; dl-034 is `approved` and every governance decision-log is
  ruled or left `pending` by the approver; task-073, if opened, is `done` and its notes on `main`
  before WingFoil's v0.4 release planning; the charter's note and the register's changes are
  written; the notice sent, if task-073 opened; the branch is merged and removed. The plan then
  goes `active → done`.

## Execution Notes

- 2026-11-02: written as asked by the approver on 2026-11-02, after plan-058's close; `workflow`
  and `phase` filled by editing the draft (W-02). `main` at `3803673` over `0162c90`.
- 2026-11-02: independent review: approve after amendments, nothing blocking; ten should-fix, seven
  nits, all applied: `main` red about one day, not two; the register's table one line per row, a
  bucket for every other trigger, the UI-feedback and dl-024/dl-025 rows named, the Alternative
  consistent with dl-031 R3; the rewrite of "the next retrospective" dropped from the table and
  listed as a `GOV` candidate; `main`'s CI in the Preconditions; the notice after task-073's notes;
  a `wingfoil-cli` entry allowed inside task-073; task-073's checks listed; the `WF` candidate
  observed on 0.3.1 only and already stated by the pack (a `request`); the cancelled run moved to
  `+`; P1 cited from the inventory; the period's end and `0162c90`; the slugged-id alternative;
  the approval command with no path; the full `memory add` command; the account per tech-spec;
  dl-029 not exercised; "every gate" made precise; the driving-script slips.
- 2026-11-02: re-review (dl-017, point 4's recommendation changed): approve after amendments,
  nothing blocking; applied: the notice in the Handoff, the Checkpoints and "Done when"; point 4's
  reason no longer presumes the `GOV` candidate's answer; step 6's triggers changed only row by
  row; the lines re-wrapped.
- 2026-11-02: `main`'s CI on `0162c90` (the last push before this plan), run 41483587039,
  `success`; Pages run 41483587206 `success`.
- 2026-11-02: the approver ruled the outline (every point as recommended); submitted
  (`draft → active`).
- 2026-11-02, `explore`: plan submitted `active` (`ba8f8fe`), pushed; the branch
  `retro/2026-11-02-pack-methodology-kanban` from it. Three read-only subagents mined the strands
  (the charter; `author`; `first-release`, `activate` and the rules with the register); WingFoil's
  WIP check read in the 0.3.0 and 0.3.1 packages the matrix installs: `reject` and `park` exempt by
  WingFoil's dl-156 Q2 (i), so no note is proposed for the reject past a limit and task-073 is not
  opened unless the approver adds a note. The inventory committed alone (`46254d0`), checked by two
  independent reviews (header and §1 … §3; §4 … §9; every commit and CI run cited, approve after
  amendments, one blocking finding: WingFoil 0.3.2 was published on 2026-11-02 after the period, so
  its intake is now due) and amended (`d10714a`). Next: the approver's checkpoint
  (`additional-points`).
- 2026-11-02, `capture`: the approver's points P1 … P3 added to the inventory (`071e27c`). `memory
  add` gave dl-034 … dl-037 in order (`8cb0f1c` … `3239549`), each id checked: dl-034 the
  retrospective, dl-035 a CI policy for advisories in development dependencies (GOV-1), dl-036
  `repository-practice` 1.2 (GOV-2, GOV-4, GOV-7), dl-037 runs by hand (GOV-5, GOV-6). Each
  reviewed independently (dl-034: request changes, one blocking finding, its dl actions plan with
  no row; dl-035 … dl-037: approve after amendments), amended, dl-034 re-reviewed (approve after
  amendments), submitted `pending` (`f77eb01` … `5e0ac53`). `main`'s CI on `ba8f8fe` (the submit),
  run 41488143638, `success`. task-073 (F-042, P1) on `task/task-073-feedback-note-f-042`: body
  reviewed (one blocking finding: `init`'s `task` has no state to hold a limit, so the reproduction
  writes a `states:` block by hand, with a fictional approver), re-reviewed (approve), submitted
  `pending` (`9d6a1e1`).
- 2026-11-02, `approve`: the approver approved dl-034 … dl-037 (`2ddb65c` … `d5bf821`) and accepted
  task-073 into the backlog (`9b5c745`). On dl-034 D1's two questions, the approver ruled: G12 keeps
  its trigger W10; WingFoil 0.3.2's intake comes first, with its periodic retrospective (dl-029),
  and the plan of WingFoil UI's feedback after them (its row's trigger moved at this plan's close).
- 2026-11-02, task-073 (hosted): F-042 (`request`: `memory reject` leaves a state over its WIP limit
  with no word) reproduced with WingFoil alone on 0.3.1 and 0.3.0, identical; body reviewed (one
  blocking finding, fixed) and re-reviewed; build reviewed (approve after amendments, the reviewer
  reproducing the note); clean clones on both Node.js versions at `0bbe924`, 1043 of 1043, every
  check exit 0; branch CI `success` (run 41514272824); approved, merged into this branch
  (`8a5b6c6`), `done` (`0b33bfa`).
- Step 6, the close:
  - **The account per tech-spec (dl-020):** this plan amended neither spec-001 nor spec-002 and
    recorded no erratum of theirs; nothing to fold back.
  - **The charter's note:** on `pack-methodology-kanban`, completing `retrospective` and citing
    dl-034, approved (point 7); no note on dl-006 or dl-033.
  - **The owed rows** (dl-034 D1 … D3, rule 4): the row of `kanban`'s own retrospective moved to
    Closed, settled by this plan (dl-034); new rows for `kanban`'s open points 2 and 3, for
    `kanban`'s charter text drift, and for the dl actions of dl-035 … dl-037; `scrum`'s open point 2
    row naming `kanban`'s open point 4; WingFoil UI's feedback row's trigger moved after WingFoil
    0.3.2's intake and its periodic retrospective (the approver's ruling of 2026-11-02, above); G12
    kept at W10. Every other row kept as dl-034 D1 rules.
  - **Numbers:** plan-059, dl-034 … dl-037, task-073 and F-042 used; bug-010 reserved for a finding,
    unused and released.
  - **Privacy:** every commit of this plan and of task-073 checked before it was made; the branch's
    diff against `main` and its commit messages checked: no local or scratch path, no private
    repository or project, no intermediary session; the only name is the CLI's `Approver:` trailer
    on the approval commits, as on `main`. Request origins written "asked by the approver on
    <date>".
  - **Next plans,** in the approver's order: WingFoil 0.3.2's intake, with the periodic
    retrospective its close starts (dl-029); then WingFoil UI's feedback; the dl actions of dl-035 …
    dl-037 placed by the approver (their row).
