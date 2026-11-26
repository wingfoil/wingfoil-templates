---
id: plan-088-pack-cycle-retrospective-the-governance-wingfoil-dogfood-cycle
type: plan
title: "pack-cycle retrospective: the governance/wingfoil-dogfood cycle"
status: done
workflow: "pack-cycle"
phase: "retrospective"
tags: ["process","retrospective","feedback","governance","wingfoil","dogfood","W10"]
---

## Context

The `retrospective` phase of `pack-cycle` (v8) for `pack-governance-wingfoil-dogfood`, `active`
since 2026-11-25 (plan-087 › step 8). Ruled by the approver on 2026-11-25 (plan-087 ruling 9): this
pack's own retrospective, in the plan right after plan-087, covering plan-082 … plan-087, from
`pack-ingest`'s capture to the activation; no other pack's cycle ran with it, so no other pack
shares it (dl-033 O2). It is **not** the periodic retrospective: dl-029's trigger, the close of a
WingFoil release intake, has not come since the periodic one of 2026-11-04 (plan-061, dl-038),
and W10's periodic retrospective stays at the end of the wave. This plan settles the row
"`governance/wingfoil-dogfood`'s own `pack-cycle` retrospective" of `docs/owed-items.md` (plan-087
ruling 9; dl-033 O1, O2).

The cycle: plan-082 `pack-ingest` capture, plan-083 its rule (dl-051), plan-084 its hand-off,
plan-085 `charter`, plan-086 `author` (task-104, task-105), plan-087 `first-release` and
`activate` (prel-008); written on 2026-11-24, closed on 2026-11-25. It is the first run started
under `pack-ingest` (dl-050), the first pack with no workflow and an empty capability list, the
first that serves a target of `governance/feedback`'s channel (spec-003 §5), and the first
publication with `publish:pack --report` read into the Publication (dl-044 P1).

The workflow is `retrospective` v5 (`explore`, `additional-points`, `capture`, `approve`), included
by `pack-cycle` v8. Until this repository adopts `base` (W10), a change of governance is a point
ruled by its own decision-log under `decision-log-ingest` and applied by a dl actions plan (dl-006
R2 as amended by dl-022); a WingFoil defect is a feedback note (`wingfoil-cli`), not a decision.

**The model** is plan-078 (`governance/feedback`'s own retrospective), its inventory
`docs/retrospectives/2026-11-21-pack-governance-feedback-friction-inventory.md` and its
decision-log dl-043, with dl-036 R1's rule for a pack's own retrospective: it proposes keep,
assign or drop only for the register's rows its cycle touched, and lists the others as "not
touched", which keeps them.

**Preconditions, met.**
- `governance/wingfoil-dogfood` 1.0.0 published (prel-008; tag `governance/wingfoil-dogfood@1.0.0`
  at `687f6899`, catalog commit `f32aa8c2`), the charter `active` (`561befd6`).
- plan-082 … plan-087 `done`; their tasks (task-104, task-105), dl-051 and prel-008 closed as their
  plans record.
- `main` at `bfba78d4` (this plan's `memory add`) over `e08a53ab`, plan-087's submit, whose CI is
  recorded in the Execution Notes before `submit` (rule 3).

**Deviations from the workflows,** as plan-078 recorded its own:
- `retrospective` v5's `capture` produces decision-logs only; a feedback note, if one is kept, is
  written by a task hosted by this plan (the inbox's first line names a task or a pack-release);
- a governance decision-log, if one is kept, runs `decision-log-ingest`'s `capture` inside this
  plan, with no plan of its own, and its `rule` alongside the retrospective's `approve`.

**Numbers** (next free on `main` at `bfba78d4`): plan-088 (this plan), dl-052 (the
retrospective's decision-log), task-106 (the notes task, if any), F-053 (the first note, if any),
bug-017 (a defect of this repository found here, if any). A governance decision-log takes the
number `memory add` gives after dl-052. The WingFoil pin is 0.2.2, so `memory add` numbers by
count (`wingfoil-cli` W-14): elements of one type are added in order, each printed id checked, and
none is added on this plan's branch while another branch holds a new element of the same type.

## Proposed outline (ruled by the approver before `submit`)

Each point has a recommendation.

1. **Scope, period and names.** *Recommended:* the scope is the pack id,
   `pack-governance-wingfoil-dogfood`, as plan-078's. The inventory is
   `docs/retrospectives/<YYYY-MM-DD>-pack-governance-wingfoil-dogfood-friction-inventory.md`, dated
   the day it is committed; the decision-log dl-052 "Retrospective pack-governance-wingfoil-dogfood
   <YYYY-MM-DD>". The period runs from 2026-11-24 (plan-082 written, `f6d44f3b`) to 2026-11-25
   (plan-087 `done`, `e08a53ab`).

2. **The sources.** *Recommended:*
   - plan-082 … plan-087, with their outlines, rulings, Execution Notes and closes;
   - dl-051, task-104 and task-105 with their reviews, prel-008, the charter
     `pack-governance-wingfoil-dogfood` with its Execution Notes and Open points, and dl-044's
     note of 2026-11-25;
   - the rule this cycle, the first run started under `pack-ingest`, is read against: dl-048,
     dl-050 (D1, D3) and `.wingfoil/workflows/custom/pack-ingest.yaml` v1;
   - `docs/owed-items.md`: its rows added, changed or closed in the period, and the row "Recheck
     W-01 … W-14" against the `wingfoil-cli` rules the pack ships;
   - the git log and the public CI and intake runs of the period (the scheduled intake runs of
     2026-11-24 and 2026-11-25, `success`).

   Not sources: plan-079 … plan-081 (the `pack-ingest` workflow's capture and the actions of dl-044
   … dl-050, plan-081, before this pack's capture), dl-012 (cited where a source cites it), the pack
   release round and this repository's adoption (later plans). *Alternative:* plan-080 (the capture
   of the `pack-ingest` workflow) as a source too.

3. **The candidates** the inventory starts from (from this plan's reads; `explore` confirms,
   corrects or drops each, citing its source, and adds what it finds in plan-082 … plan-086 and
   elsewhere), what went well beside what went wrong (dl-006 R5). A candidate marked
   *(unrecorded)* was observed during the work and is written in no element: `explore` keeps it
   only if the approver confirms it at `additional-points`, citing this plan as its source:
   - went well (`+`): the first run started under `pack-ingest`, capture to hand-off on 2026-11-24
     between `f6d44f3b` (09:40) and `0df54778` (plan-084's final submit, 10:20), dl-051's review,
     re-review and approval inside it (plan-082 … plan-084); independent reviews found should-fix
     points before the gates they checked (`explore` counts each: among them dl-051, plan-084,
     plan-085 with one blocker, `pack.yaml` at format 1, the charter, plan-086, task-104, task-105,
     plan-087's outline, prel-008 twice and plan-087's close; plan-083 had no review of its own);
     the publication rehearsal in a scratch clone before prel-008 moved (plan-087 step 3), its
     digest equal to the dry run's and to the report's; `publish:pack --report` read into the
     Publication with no difference (dl-044 P1's first use); the first pack with no workflow
     published with no change under `src/`; charter to published and active in about 33 hours
     (`4eeab360`, 2026-11-24, to `561befd6`, 2026-11-25);
   - friction (`−`): task-104's Acceptance 6 (the CHANGELOG's first line a whole sentence) unmet,
     found after its close by plan-087's outline, no review having claimed it (task-104's note of
     2026-11-25); the agent's push of `main` with the approval's commit not permitted in its
     environment, the approver pushing it (dl-044 P2's owed row); the approver's first `push
     --atomic` did not reach the remote, found by reading it (prel-008's note); the first pass of
     the clean-clone evidence ran `validate:publication` before the build and audited the local
     matrix cache, not the committed lockfiles (prel-008's note); *(unrecorded)*: a machine
     restart lost the temporary worktree of task-105 and the first rehearsal, both redone from
     what was pushed or committed; lines over 100 characters after scripted edits, found by
     `check:texts` before each commit, several times;
   - WingFoil-side (`WF`): none recorded in the period; `explore` checks the notes and the
     `wingfoil-cli` rules this cycle ran against;
   - governance (`GOV`): who pushes a pack-release's approval commit (dl-044 P2's row, which falls
     due here, point 4); the first run started under `pack-ingest`, against dl-050; a check of
     the CHANGELOG's first line, now met once (its row, plan-087 point 2): in `publish:pack`, as
     the row says, or in `check:packs`, where `author` would meet it; the clean-clone evidence run
     by a script each time, with no committed form; others only as `explore` finds them.

   *Alternative:* no list here, `explore` starting from the sources alone.

4. **The register** (dl-031 R3, dl-036 R1). *Recommended:* the inventory holds a table with one
   line for each open row this cycle touched, each with its proposal and its own reason: among them
   "A check of the CHANGELOG's first line", "dl-044 P2 … not applied at prel-008", "The private
   projects' check scripted", the sequencer's W10 state (with the duplicate dl-051's review added,
   `5c92afc0`, merged into it by plan-087's close), "The engine way of working", the W10 row
   (plan-052 ruling 7), "`pack-delivery`'s selection over `accepted` packs" (dl-051 D4, plan-085's
   Context), "Recheck W-01 … W-14", and any other row plan-082 … plan-086 added or changed; every
   other open row listed as "not touched", kept. The row of this pack's retrospective moves to
   Closed at this plan's close, settled by plan-088 (dl-052). dl-052 rules the table (its Debts).
   **The dl-044 P2 row falls due here** (its trigger: at the latest this retrospective): dl-052
   rules it, not keeps it: P2 kept, with a reason in dl-052 that answers the environment's refusal
   of the agent's push, or changed (for instance, that push handed to the approver) by a governance
   decision-log of its own (point 5); "The engine way of working", which quotes P2, follows the
   outcome.

5. **Changes of governance.** *Recommended:* the test of the inventory of 2026-10-28, P1 (dl-028
   N4): a `GOV` candidate becomes a decision-log only if this repository's adoption of the packs
   (W10) would not fix it; otherwise it is a row of the register with the trigger W10. Each kept
   candidate is one decision-log under `decision-log-ingest`, numbered after dl-052, captured and
   ruled in this plan, applied later by a dl actions plan (none applied here). The approver decides
   at `additional-points` which candidates are kept. A change of an approved ruling, such as
   dl-044 P2, is a decision-log in any case; the test confirms it for P2, since the adoption (W10)
   does not change who may push `main`.

6. **WingFoil-side points.** *Recommended:* only as feedback notes in the inbox, each reproduced
   with WingFoil alone on 0.3.0 and 0.3.2 before it is written; written by task-106
   (`tooling-delivery` v5, `pack: ""`) on a branch of its own, numbered from F-053, first line
   `New note (task-106).`, one ledger row each, `Last sync` unchanged; a `wingfoil-cli` entry only
   if a kept note needs one; no task if no candidate survives `explore` and the approver's
   checkpoint. `explore` reads the state of WingFoil's v0.4 release planning again (started
   2026-11-03, dl-040; no source records it closed); while it is open, task-106's branch starts
   from `main` and merges into `main` on its own, on the approver's OK, `--no-ff` (dl-040 D2's
   practice, as plan-078's task-101). No notice: the inbox is synced at this repository's adoption
   (W10). *Alternative:* a note left to the next periodic retrospective.

7. **The close's notes.** *Recommended:* one Execution Note on `pack-governance-wingfoil-dogfood`,
   added when dl-052 is approved and citing it, completing `retrospective`; one on dl-044 recording
   how dl-052 ruled its P2 row; one on dl-050 only if dl-052 or a governance decision-log changes
   it (dl-050 D3 records a run in its plan, and dl-033 had none for `pack-cycle`'s first run); no
   note on dl-006 or dl-033 (no shared retrospective, R1's order followed as written).

8. **Where the work runs.** *Recommended:* this plan's document on `main`; the inventory, the
   approver's points, dl-052 and any governance decision-log on the branch
   `retro/<YYYY-MM-DD>-pack-governance-wingfoil-dogfood` from `main` after `submit`; at the close,
   on the approver's OK, `--no-ff` into `main`. Every push of `main` is the approver's (the agent's
   is not permitted in its environment); the agent pushes the branch. No release of a pack, no
   change of a tech-spec, no change under `src/`, `packs/` or `.wingfoil/` (except a `wingfoil-cli`
   entry a kept note needs, inside task-106).

## The approver's rulings

Given on 2026-11-25, in chat: "tutti come raccomandato". Points 1 … 8 stand as recommended:
- the scope `pack-governance-wingfoil-dogfood`, the period 2026-11-24 … 2026-11-25, the inventory
  and dl-052 named as written (point 1);
- the sources as written, with dl-048, dl-050 and `pack-ingest` v1; plan-080 not a source (point
  2);
- the candidates as the inventory's starting list, an *(unrecorded)* one kept only if the
  approver confirms it at `additional-points` (point 3);
- one line per open row the cycle touched, the others "not touched" and kept; the dl-044 P2 row
  ruled by dl-052; the row of this pack's retrospective closed at this plan's close (point 4);
- a governance decision-log only for a candidate the adoption (W10) would not fix, and for any
  change of an approved ruling (point 5);
- notes only after reproduction on 0.3.0 and 0.3.2, by task-106 from `main`, merged into `main` on
  its own, and no notice (point 6);
- the notes on the charter and on dl-044, one on dl-050 only if it changes (point 7);
- this plan on `main`, the work on `retro/<YYYY-MM-DD>-pack-governance-wingfoil-dogfood`, every
  push of `main` the approver's (point 8).

## Steps

Before every commit, the privacy check and `check:texts` (`repository-practice` rules 2 and 5: no
local or scratch path, no private repository or project, no intermediary session); after every
push to `main`, its CI read (rule 3); after every commit under `docs/memory/`, `docs/plans/` or
`.wingfoil/`, `npm run -s wingfoil -- workflow list` and `npm run lint` exit 0. Files staged by
name.

1. **This plan** (product-owner): `memory add` (`bfba78d4`), body, an independent review (dl-017),
   amended; the outline ruled by the approver; `submit` (`draft → active`); `main` pushed by the
   approver and its CI read.
2. **`explore`** (facilitator, read-only on Memory), on the branch of point 8:
   - two read-only subagents, one per strand, each returning points with their sources, what went
     well beside what went wrong, and the `WF`, `GOV` and `DEBT` marks:
     a. `pack-ingest`, `charter` and `author`: plan-082 … plan-086, dl-051, dl-048, dl-050 and
        `pack-ingest` v1, the charter's body and notes, task-104 and task-105 with their reviews;
     b. `first-release`: plan-087, prel-008, the rehearsal, the publication and `activate`, dl-044's
        note;
   - claude reads the register (point 4) and, for each `WF` candidate, WingFoil's documentation and
     whether a note already covers it; merges the strands and builds the inventory: a section per
     phase, the cross-cutting themes, the candidate notes (`WF`), the candidate changes (`GOV`), the
     register's table, what went well;
   - committed alone; an independent review checks every citation against its source; amended.
3. **`additional-points`** (approver): the inventory shown in chat; the approver adds points. A
   checkpoint, no commit.
4. **`capture`** (facilitator):
   - the approver's points added to the inventory in their own commit (or a line saying none were
     added);
   - dl-052 "Retrospective pack-governance-wingfoil-dogfood <YYYY-MM-DD>" (`memory add --type
     decision-log`, the printed id checked, body by hand, `submit`, `draft → pending`): Keep,
     Change (governance, each by its own decision-log; WingFoil-side, as notes), Debts (the
     register's table, point 4), Observed; each point tied to the inventory;
   - each governance decision-log kept (point 5), under `decision-log-ingest`, cited by dl-052;
   - task-106 if a note is kept (point 6), through `tooling-delivery` v5: its body reviewed and
     accepted into the backlog by the approver; each note reproduced with WingFoil alone from
     `src/matrix/` on 0.3.0 and 0.3.2; dl-039's checks; the build reviewed; `in-review`, approved
     by the approver; merged as point 6 says;
   - an independent review of dl-052 and of each governance decision-log, amended; each record
     (dl-017 R3) the verdict, the count per severity, the fixing commit and what was applied, or
     not and why; a re-review when a fix changes a decision.
5. **`approve`** (held by the approver): claude hands the approver each command,
   `npm run -s wingfoil -- memory approve <id> --reason "…"`, with its `cd`; a rejection sends the
   element back to `capture`. dl-052 must be ruled for this plan to close; a governance
   decision-log may stay `pending`.
6. **Close:**
   - the account per tech-spec (dl-020): none amended, unless a step of this plan amends one;
   - the notes of point 7, once dl-052 is approved;
   - `docs/owed-items.md`: dl-052's Debts applied, the row of this pack's retrospective moved to
     Closed (plan-088, dl-052), every item this plan leaves owed given its row (rule 4);
   - the reserved numbers left unused released; the privacy check of the branch's diff and of its
     commit messages recorded; the branch pushed, its CI on the frozen head recorded (dl-039 R1);
   - on the approver's OK, `--no-ff` merge into `main`, pushed by the approver, `main`'s CI read,
     the branch removed locally and on origin; the next plan named;
   - an independent review of the close; `active → done` after `main`'s CI on the closing head.

**Not in this plan:** the periodic retrospective; the pack release round; this repository's
adoption, its pin and its inbox sync; the dl actions of any decision-log this plan captures.

## Handoff

- **Agent:** product-owner of this plan, facilitator of `explore` and `capture`, developer of
  task-106 if there is one; it never runs
  `memory approve` or `memory reject`, never pushes `main`, and merges only on the approver's OK.
  No pull request.
- **Reviewer:** an independent subagent for this plan, the inventory, dl-052, each governance
  decision-log, task-106 and the close (dl-017).
- **The approver** rules this outline, adds points at `additional-points`, accepts and approves
  task-106, approves dl-052 and each governance decision-log, pushes `main` and gives the merge's
  OK.
- **Done when** the inventory and dl-052 are on `main`, dl-052 `approved`, its Debts applied to the
  register (the dl-044 P2 row ruled), the notes of point 7 recorded, and the row of this pack's
  retrospective in Closed.

## Execution Notes

<!-- Filled while the plan runs: deviations, blockers, decisions taken, WingFoil friction
     (also recorded in docs/wingfoil-feedback/). At wave close: per tech-spec, the errata and
     rulings recorded in the wave, and the element the approver names to fold them back, or the
     ruling that none is needed (dl-020).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-25: independent review of the outline (dl-017, `b9bc9ed8`): approve after amendments; no
  blocker, six should-fix (the row "`pack-delivery`'s selection over `accepted` packs" and the
  merged sequencer duplicate added to point 4; the dl-044 P2 row falling due here, ruled by dl-052
  and tested by point 5, its dl-044 note made unconditional; the reviews' candidate completed and
  "every gate" qualified; "about 33 hours", not "two days"; dl-048, dl-050 and `pack-ingest` v1 as
  sources, with a note on dl-050; the Steps and Handoff restored from plan-078: task-106's path,
  dl-017 R3's record, the close's items, the predecessor's CI) and six nits (task-106 from `main`,
  dl-040 D2; v0.4's state read again; the hand-off's window; "no change under `src/`"; rules 2 and
  5; "Not in this plan", the rejection's return and dl-052 required; the intake runs and the
  W-01 … W-14 row), all applied in the commit that records this note, with `tooling-delivery`
  v5 for v4. No re-review: the amendments complete the outline and correct facts; no
  recommendation changes but point 7's dl-044 note, now unconditional, which point 4's trigger
  already required.
- 2026-11-25: the note above's claim "No re-review: … no recommendation changes but point 7's
  dl-044 note" found false: the amendments also changed points 4, 5, 6 and 7 (the dl-050 note).
  Re-review (dl-017, `a37d2064`): approve after amendments; no blocker, three should-fix (point 4's
  options aligned with point 5, a change of P2 being a decision-log, keeping it needing a reason
  that answers the refusal; the dl-050 note made conditional, with no precedent on dl-033 and
  dl-050 D3 recording a run in its plan, and "the first run started under `pack-ingest`" for
  "its first run"; this note) and two nits (plan-084's final submit; the not-sources line naming
  dl-044 … dl-050's actions), all applied in the commit that records this note.
- 2026-11-25: `main`'s CI before `submit`: the push of `e08a53ab` (plan-087's submit), run
  45687654016 `success`, its jobs (22.12.0, 1) 10 min 41 s, (22.21.0, 1) 10 min 29 s, (22.12.0,
  2) 5 min 42 s, (22.21.0, 2) 5 min 36 s, the step "Texts, the lines this push adds to main"
  `success`; Pages, run 45687653932, `success`.
- 2026-11-25: step 2, `explore`, on `retro/2026-11-25-pack-governance-wingfoil-dogfood` from
  `920a8091`: two read-only strands merged into
  `docs/retrospectives/2026-11-25-pack-governance-wingfoil-dogfood-friction-inventory.md`
  (`6d0510e6`). Independent review (dl-017): approve after amendments; no blocker, seven
  should-fix (58 open rows, not 57, the `check:pins` row added; the CI watch marked
  *(unrecorded)* and G12 replaced; the CI durations' runs named; GOV-4's W10 answer; GOV-5 made
  a row, dl-050's note of plan-081 acknowledged, §5.4 reworded; the P2 row's trigger moved to
  GOV-1's decision-log; GOV-2 given the pack release round of the sequencer's W10 order) and
  eight nits, all applied (`fa66b26b`). Re-review, the proposals having changed: approve after
  amendments; one should-fix (the release's checks named by `pack-release-cycle` › `validate`,
  not dl-039) and three nits (GOV-2 and GOV-5 as rows the approver's choice; P2's alternative
  shown to the approver), applied with the points for the approver (`eb1d9416`). The branch
  pushed.
- 2026-11-25: step 3, `additional-points`: the inventory shown in chat; the approver's points
  P1 … P4 ("tutti come raccomandato"): every *(unrecorded)* candidate confirmed; GOV-1 and GOV-3
  kept as decision-logs; GOV-2, GOV-4 and GOV-5 as rows; no note to WingFoil. Added to the
  inventory in their own commit (`8a784b32`).
- 2026-11-25: step 4, `capture`: dl-052 "Retrospective pack-governance-wingfoil-dogfood
  2026-11-25" (`6214ab1e`), dl-053 (GOV-1, `251e70bf`) and dl-054 (GOV-3, `d4576cd1`) added in
  order, each printed id checked; bodies `89390b99`. Independent review of the three (dl-017):
  approve after amendments; no blocker, nine should-fix (dl-052 three, dl-053 two, dl-054 four)
  and nine nits (four, three, two), all applied (`327b6b4e`). Re-review, decisions having
  changed: dl-052 approve after amendments, dl-053 approve, one should-fix they share (the P2
  row's case of dl-053 still `pending` at the close) and one nit each; dl-054 approve, no
  finding; all applied (`2f37edfa`). Each element's own notes hold its record. Submitted
  `draft → pending` (`85090c16`, `5753b3be`, `125d9f4d`). No task-106: no WingFoil-side candidate
  (dl-052 W1).
- 2026-11-26: step 5, `approve`: the approver approved dl-053 (`6184fb59`), dl-054 (`ce583664`)
  and dl-052 (`f7f2d332`), on the branch.
- 2026-11-26: step 6, close, on the branch (`d87d4f87`): dl-052's Debts applied to
  `docs/owed-items.md` (D1 … D4): the row of this pack's retrospective moved to Closed (plan-088,
  dl-052); the row "dl-044 P2 … not applied at prel-008" moved to Closed, settled by dl-053; the
  CHANGELOG row's trigger set to the pack release round, its Source and the Recheck row's
  extended; four rows added (the charter drift, `pack-ingest` v1, dl-053's and dl-054's actions).
  The notes of point 7: on `pack-governance-wingfoil-dogfood` and on dl-044; none on dl-050,
  unchanged. No tech-spec amended (dl-020). Released unused: task-106, F-053, bug-017. The
  privacy check of the branch's diff and its commit messages: clean. The next plan: plan-089,
  the dl actions of dl-053 and dl-054 (`pack-release-cycle` 9 → 10 in one bump, the tooling task
  for `npm run check:release`, the row "The engine way of working" reworded, the note on dl-044).
- 2026-11-26: independent review of the close (dl-017, `d87d4f87` and this plan's notes): approve
  after amendments; no blocker, two should-fix (dl-053's re-review verdict, "approve", corrected
  in the note above; the branch's push and its CI on the frozen head, recorded below) and one nit
  (this record), all applied in the commit that records this note.
- 2026-11-26: the branch pushed, its CI on the frozen head `d87d4f87` (dl-039 R1): run
  45796224491 `success`, its jobs (22.12.0, 1) 13 min 30 s, (22.21.0, 1) 10 min 48 s, (22.12.0,
  2) 5 min 36 s, (22.21.0, 2) 9 min 10 s, the step "Texts, the lines this branch adds" `success`.
- 2026-11-26: on the approver's OK, `retro/2026-11-25-pack-governance-wingfoil-dogfood` merged
  `--no-ff` into `main` (`873e16ff`), pushed by the approver; `main`'s CI on it: run 45799589287
  `success`, its jobs (22.12.0, 1) 10 min 57 s, (22.21.0, 1) 17 min 18 s, (22.12.0, 2) 9 min
  13 s, (22.21.0, 2) 9 min 0 s, the step "Texts, the lines this push adds to main" `success`;
  Pages, run 45799589156, `success`. The branch removed locally and on origin. Done: the
  inventory and dl-052 on `main`, dl-052 `approved`, its Debts applied (the dl-044 P2 row ruled by
  dl-053), the notes of point 7 recorded, the row of this pack's retrospective in Closed. The
  next plan: plan-089, the dl actions of dl-053 and dl-054. `active → done`.
