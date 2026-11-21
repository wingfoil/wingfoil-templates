---
id: plan-078-pack-cycle-retrospective-the-governance-feedback-cycle
type: plan
title: "pack-cycle retrospective: the governance/feedback cycle"
status: active
workflow: "pack-cycle"
phase: "retrospective"
tags: ["process","retrospective","feedback","governance","W10"]
---

## Context

The `retrospective` phase of `pack-cycle` (v7) for `pack-governance-feedback`, `active` since
2026-11-19 (plan-077 › step 8). Asked by the approver on 2026-11-19. `pack-cycle` runs
`retrospective` after `activate` (dl-033 O1). plan-077 ruling 10 made it this pack's own, in the
plan right after plan-077, covering plan-073 … plan-077: no other pack's cycle ran with it, so no
other pack shares it (dl-033 O2). It is **not** the periodic retrospective: dl-029's trigger, the
close of a WingFoil release intake, has not come since the periodic one of 2026-11-04 (plan-061,
dl-038), and W10's periodic retrospective stays at the end of the wave (plan-077 point 10). This
plan settles the row "`governance/feedback`'s own `pack-cycle` retrospective" of
`docs/owed-items.md` (plan-077 ruling 10; dl-033 O1, O2).

The cycle: plan-073 `charter` (2026-11-14), plan-074 `design` (spec-003), plan-075 a
tooling-change before `author` (task-092 … task-094), plan-076 `author` (task-095 … task-099),
plan-077 `first-release` and `activate` (task-100, prel-007), closed on 2026-11-19. It is the first
cycle with a `design` phase producing a tech-spec, the first pack at `pack.yaml` format 2 with a
conditional part, and the first whose publication and activation the approver ran (plan-077
ruling 7).

The workflow is `retrospective` v5 (`explore`, `additional-points`, `capture`, `approve`), included
by `pack-cycle` v7. Until this repository adopts `base` (W10), a change of governance is a point
ruled by its own decision-log under `decision-log-ingest` and applied by a dl actions plan (dl-006
R2 as amended by dl-022); a WingFoil defect is a feedback note (`wingfoil-cli`), not a decision.

**The model** is plan-059 (`kanban`'s own retrospective), its inventory
`docs/retrospectives/2026-11-02-pack-methodology-kanban-friction-inventory.md` and its
decision-log dl-034, with dl-036 R1's rule for a pack's own retrospective: it proposes keep,
assign or drop only for the register's rows its cycle touched, and lists the others as "not
touched", which keeps them.

**Preconditions, met.**
- `governance/feedback` 1.0.0 published (prel-007; tag `governance/feedback@1.0.0` at `84cb0858`,
  catalog commit `977cc087`), the charter `active` (`4a9d46fe`).
- plan-073 … plan-077 `done`; their tasks (task-092 … task-100) and prel-007 closed as their plans
  record.
- `main` at `5c9cfadf` (this plan's `memory add`) over `d3f3c6f3`, plan-077's submit, whose CI run
  44547780549 is `success`.

**Deviations from the workflows,** as plan-059 recorded its own:
- `retrospective` v5's `capture` produces decision-logs only; a feedback note, if one is kept, is
  written by a task hosted by this plan (the inbox's first line names a task or a pack-release);
- a governance decision-log, if one is kept, runs `decision-log-ingest`'s `capture` inside this
  plan, with no plan of its own, and its `rule` alongside the retrospective's `approve`.

**Numbers** (next free on `main` at `5c9cfadf`): plan-078 (this plan), dl-043 (the
retrospective's decision-log), task-101 (the notes task, if any), F-052 (the first note, if any),
bug-017 (a defect of this repository found here, if any). A governance decision-log takes the
number `memory add` gives after dl-043. The WingFoil pin is 0.2.2, so `memory add` numbers by
count (`wingfoil-cli` W-14): elements of one type are added in order, each printed id checked, and
none is added on this plan's branch while another branch holds a new element of the same type.

## Proposed outline (ruled by the approver before `submit`)

Each point has a recommendation.

1. **Scope, period and names.** *Recommended:* the scope is the pack id,
   `pack-governance-feedback`, as plan-059's. The inventory is
   `docs/retrospectives/<YYYY-MM-DD>-pack-governance-feedback-friction-inventory.md`, dated the day
   it is committed; the decision-log dl-043 "Retrospective pack-governance-feedback <YYYY-MM-DD>".
   The period runs from 2026-11-14 (plan-073 written) to 2026-11-19 (plan-077 `done`,
   `d3f3c6f3`).

2. **The sources.** *Recommended:*
   - plan-073 … plan-077, with their outlines, rulings, Execution Notes and closes;
   - task-092 … task-100 with their reviews, prel-007, spec-003, the charter
     `pack-governance-feedback` with its Execution Notes and Open points, F-048 … F-051;
   - `docs/owed-items.md`: its rows added, changed or closed in the period;
   - the git log and the public CI and intake runs of the period.

   Not sources: plan-070 … plan-072 (before the charter), dl-012 and dl-013 (cited where a source
   cites them), the pack release round and `governance/wingfoil-dogfood` (later plans).
   *Alternative:* plan-071 (the vision amendment that placed F4.9 in W10) as a source too.

3. **The candidates** the inventory starts from (from this plan's reads; `explore` confirms,
   corrects or drops each, citing its source, and adds what it finds in plan-073 … plan-075 and
   elsewhere), what went well beside what went wrong (dl-006 R5). A candidate marked
   *(unrecorded)* was observed during the work and is written in no element: `explore` keeps it
   only if the approver confirms it at `additional-points`, citing this plan as its source:
   - went well (`+`): independent reviews found should-fix points before code in every element;
     red first held in every tooling task (task-093, task-094, task-095, task-097, task-098,
     task-100); `check:runs` extended to drive a
     route across several mains (task-095), so FA-6 is scripted; the publication rehearsal in a
     scratch clone found no break with the first format-2 manifest (plan-077 step 3); task-100's
     mirror test, which keeps the intake's overlays equal to ci.yml's; plan-077 ruling 7 applied
     with commands handed over, and nothing run on the approver's behalf; charter to published and
     active in five days;
   - friction (`−`): a probe named a repository that did not exist, so WingFoil commands ran in the
     worktree (task-097; all refused, nothing changed); task-099's first run left the custom
     directive unbound and an upstream note with a wrong version, so all routes were re-driven;
     task-100's local list ran the golden step in self-test mode first; a line over 100 characters
     in prel-007 found after its commit (`66bc66a7`); the intake rehearsal's report text not served
     by the API, rebuilt locally (task-100); *(unrecorded)*: a compound command committed unfixed
     code (task-098's red commit, amended before push); claims corrected after verification
     (task-099: "no command assigns a directive", "no warning"); the dry run refused again on a
     linked `node_modules` (plan-058's slip repeated); `workflow list` run with an option it
     lacks; the floor Node.js 22.12.0 found only in a local tool cache, not on the PATH;
   - WingFoil-side (`WF`): a `custom/` directive no role binds raises no warning in WingFoil 0.3.2
     (task-099; the owed row asks for a feedback note); `base` composed without `software`: the
     warning on `decision-log-ingest`'s `product-owner` (task-099; a row on `base`, not WingFoil's);
   - governance (`GOV`): who writes a pack-release's Publication when the approver runs
     `publish:pack` and its output is not seen (plan-077 ruling 7, prel-007's note); the order of a
     tooling task's rehearsal on `main` against its `done` (task-100 criterion 9 read plan-077
     step 2 more precisely); the line-length rule checked by hand, not by the lint, for Memory
     documents; others only as `explore` finds them.

   *Alternative:* no list here, `explore` starting from the sources alone.

4. **The register** (dl-031 R3, dl-036 R1). *Recommended:* the inventory holds a table with one
   line for each open row this cycle touched, each with its proposal and its own reason: among them
   "A `custom/` directive no role binds", "`base` composed without `software`", "The packs' Memory
   templates", the scripted full run, "The engine way of working" (ruling 7 applied part of it
   early), the sequencer's W10 state, "A check of the CHANGELOG's first line" and "The private
   projects' check scripted"; every other open row listed as "not touched", kept. The row of this
   pack's retrospective moves to Closed at this plan's close, settled by plan-078 (dl-043).
   dl-043 rules the table (its Debts).

5. **Changes of governance.** *Recommended:* the test of the inventory of 2026-10-28, P1 (dl-028
   N4): a `GOV` candidate becomes a decision-log only if this repository's adoption of the packs
   (W10) would not fix it; otherwise it is a row of the register with the trigger W10. Each kept
   candidate is one decision-log under `decision-log-ingest`, numbered after dl-043, captured and
   ruled in this plan, applied later by a dl actions plan (none applied here). The approver decides
   at `additional-points` which candidates are kept.

6. **WingFoil-side points.** *Recommended:* only as feedback notes in the inbox, each reproduced
   with WingFoil alone on 0.3.0 and 0.3.2 before it is written; written by task-101
   (`tooling-delivery` v4, `pack: ""`) on a branch of its own from this plan's branch, numbered from
   F-052, first line `New note (task-101).`, one ledger row each, `Last sync` unchanged; a
   `wingfoil-cli` entry only if a kept note needs one; no task if no candidate survives `explore`
   and the approver's checkpoint. The candidate on the unbound `custom/` directive settles its owed
   row if kept.
   - **Timing:** WingFoil's v0.4 release planning started on 2026-11-03 (dl-040); `explore` reads
     its state again. While it is open, task-101's merge goes to `main` on its own, ahead of this
     plan's branch, on the approver's OK, `--no-ff`, as plan-059 provided.
   - **No notice** once the notes are on `main`, as plan-075 for F-048 … F-051: the inbox is
     synced at this repository's adoption (W10).

   *Alternative:* the note left to the next periodic retrospective, the row's trigger (dl-036 R1);
   or a notice, its recipients and text given by the approver.

7. **The close's notes.** *Recommended:* one Execution Note on `pack-governance-feedback`, added
   when dl-043 is approved and citing it, completing `retrospective`; no note on dl-006 or dl-033
   (no shared retrospective, R1's order followed as written).

8. **Where the work runs.** *Recommended:* this plan's document on `main`; the inventory, the
   approver's points, dl-043, any governance decision-log and task-101's merge on the branch
   `retro/<YYYY-MM-DD>-pack-governance-feedback` from `main` after `submit`; at the close, on the
   approver's OK, `--no-ff` into `main`. No release of a pack, no change of a tech-spec, no change
   under `src/`, `packs/` or `.wingfoil/` (except a `wingfoil-cli` entry a kept note needs, inside
   task-101).

## The approver's rulings

Given on 2026-11-21, in chat: the outline is approved as recommended. Points 1 … 8 stand as
written:
- the scope `pack-governance-feedback`, the period 2026-11-14 … 2026-11-19, the inventory and
  dl-043 named as written (point 1);
- the sources as written; plan-071 not a source (point 2);
- the candidates as the inventory's starting list, an *(unrecorded)* one kept only if the
  approver confirms it at `additional-points` (point 3);
- one line per open row the cycle touched, the others "not touched" and kept; the row of this
  pack's retrospective closed at this plan's close (point 4);
- a governance decision-log only for a candidate the adoption (W10) would not fix (point 5);
- notes only after reproduction on 0.3.0 and 0.3.2, by task-101, its merge to `main` on its own
  while WingFoil's v0.4 planning is open, and no notice (point 6);
- one note on the charter citing dl-043, none on dl-006 or dl-033 (point 7);
- this plan on `main`, the work on `retro/<YYYY-MM-DD>-pack-governance-feedback` (point 8).

## Steps

Before every commit, the privacy check (`repository-practice` rule 2: no local or scratch path, no
private repository or project, no intermediary session); after every push to `main`, its CI read
(rule 3); after every commit under `docs/memory/`, `docs/plans/` or `.wingfoil/`,
`npm run -s wingfoil -- workflow list` and `npm run lint` exit 0. Files staged by name.

1. **This plan** (product-owner): `memory add` (`5c9cfadf`), body, an independent review (dl-017),
   amended; the outline ruled by the approver; `submit` (`draft → active`); `main` pushed and its
   CI read.
2. **`explore`** (facilitator, read-only on Memory), on the branch of point 8:
   - three read-only subagents, one per strand, each returning points with their sources, what went
     well beside what went wrong, and the `WF`, `GOV` and `DEBT` marks:
     a. `charter` and `design`: plan-073, plan-074, spec-003, the charter's body and notes;
     b. the tooling and `author`: plan-075, plan-076, task-092 … task-099 with their reviews;
     c. `first-release`: plan-077, task-100, prel-007, the rehearsal, the publication and
        `activate`;
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
   - dl-043 "Retrospective pack-governance-feedback <YYYY-MM-DD>" (`memory add --type
     decision-log`, the printed id checked, body by hand, `submit`, `draft → pending`): Keep,
     Change (governance, each by its own decision-log; WingFoil-side, as notes), Debts (the
     register's table, point 4), Observed; each point tied to the inventory;
   - each governance decision-log kept (point 5), under `decision-log-ingest`, cited by dl-043;
   - task-101 if a note is kept (point 6), through `tooling-delivery` v4: its body reviewed and
     accepted into the backlog by the approver; each note reproduced with WingFoil alone from
     `src/matrix/`; dl-039's checks (the branch CI once, the local list on Node.js 22.21.0); an
     independent build review; `in-review`, the approver's approval; `--no-ff` into this plan's
     branch, `done`;
   - every element reviewed independently, amended while `pending`; a fix that changes a decision
     reviewed again (dl-017).
5. **`approve`** (held by the approver): claude hands the approver each command,
   `npm run -s wingfoil -- memory approve <id> --reason "…"`, with its `cd`; a rejection sends the
   element back to `capture`. dl-043 must be ruled for this plan to close; a governance
   decision-log may stay `pending`.
6. **Close:**
   - the account per tech-spec (dl-020): none amended, unless a step of this plan amends one;
   - the charter's note (point 7), once dl-043 is approved;
   - `docs/owed-items.md`: dl-043's Debts applied, the row of this pack's retrospective moved to
     Closed (plan-078, dl-043), every item this plan leaves owed given its row (rule 4);
   - the reserved numbers left unused released; the privacy check of the branch's diff and of its
     commit messages recorded; the branch pushed, its CI conclusion recorded;
   - on the approver's OK, `--no-ff` merge into `main`, push, `main`'s CI read, the branch removed
     locally and on origin; the next plan named;
   - `active → done` after `main`'s CI on the closing head.

**Not in this plan:** the periodic retrospective; `governance/wingfoil-dogfood`; the pack release
round; this repository's adoption, its pin and its inbox sync; the dl actions of any decision-log
this plan captures.

## Handoff

- **claude:** product-owner of this plan's draft, facilitator of `explore` and `capture`, developer
  of task-101. It never runs `memory approve` or `memory reject`: it hands the approver the
  command. No pull request.
- **Reviewer:** an independent subagent for this plan, the inventory, dl-043, each governance
  decision-log, task-101 and the close (dl-017).
- **The approver** rules this outline, adds points at `additional-points`, accepts and approves
  task-101, approves dl-043 and each governance decision-log, and gives the OK to merge.
- **Done when** the inventory and dl-043 are on `main`, dl-043 `approved`, its Debts applied to the
  register, the charter's note recorded, and the row of this pack's retrospective in Closed.

## Execution Notes

- 2026-11-19: written as the approver asked on 2026-11-19, after plan-077's close. `workflow`,
  `phase` and `tags` were filled by editing the draft (W-02). `main` was at `5c9cfadf`.
- 2026-11-19: independent review (dl-017): approve after amendments; no blocker, five should-fix
  and five nits, applied but one: the candidates written in no element marked *(unrecorded)*, to
  be confirmed by the approver; a local tool path removed; point 6's timing against WingFoil's
  v0.4 planning and the notice ruled; the `wingfoil-cli` exception in point 8; five days, not
  six; W-14's branch clause, the red-first tasks, the probe's wording and plan-077 point 10
  cited. Not applied: a candidate on earlier texts' pronoun for the approver, left to `explore`.
- 2026-11-21: step 1, the outline ruled by the approver, submitted (`33260fd2`); `main` pushed, its
  CI run 44907146720 `success` (longest job 11 min 18 s).
- 2026-11-21: step 2, `explore`, on `retro/2026-11-21-pack-governance-feedback`: three read-only
  strands merged into the inventory
  `docs/retrospectives/2026-11-21-pack-governance-feedback-friction-inventory.md` (`d52fb173`).
  Independent review: approve after amendments; no blocker, nine should-fix and seven nits, all applied (`47464429`): the blockers' tally and where each was found; the durations; the
  triage rule's day; the probes' reading; WF-1's contrast case; claims written in no element marked
  *(unrecorded)*; the `node_modules` candidate as not observed; the W10 row and the 44 rows not
  touched listed; the drift row's owner; the v0.4 timing; the pronoun point; GOV-2 and GOV-4 as
  decision-logs; the marks aligned. Next: step 3, `additional-points`.
