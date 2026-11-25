---
id: plan-088-pack-cycle-retrospective-the-governance-wingfoil-dogfood-cycle
type: plan
title: "pack-cycle retrospective: the governance/wingfoil-dogfood cycle"
status: draft
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

<!-- Recorded before `submit`. -->

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
