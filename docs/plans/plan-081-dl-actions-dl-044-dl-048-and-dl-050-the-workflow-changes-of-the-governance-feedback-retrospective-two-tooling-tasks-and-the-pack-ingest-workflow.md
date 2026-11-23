---
id: plan-081-dl-actions-dl-044-dl-048-and-dl-050-the-workflow-changes-of-the-governance-feedback-retrospective-two-tooling-tasks-and-the-pack-ingest-workflow
type: plan
title: "dl actions: dl-044 … dl-048 and dl-050, the workflow changes of the governance/feedback retrospective, two tooling tasks and the pack-ingest workflow"
status: draft
workflow: "decision-log-ingest"
phase: "rule"
tags: ["process","dl-actions","retrospective","workflows"]
---

## Context

The `rule` phase of `decision-log-ingest` for the governance decision-logs of the
`governance/feedback` retrospective (plan-078, dl-043) and for dl-050, all approved: their actions,
applied here as each decision-log's last point says ("applied after approval by a dl actions
plan"). dl-044 … dl-047 were approved on 2026-11-22; dl-048 (option 3, as reshaped by dl-050 Q1 (a)) and dl-050 (D1, D3
and D4) on 2026-11-23 (`075e7fb3`, `8ce834d0`), both "applied by plan-081". Asked by the approver
on 2026-11-23.

- **dl-044** (P1 … P3): `publish:pack --report <path>`, a tooling task red first;
  `pack-release-cycle` 8 → 9 (`approve-publication`: the agent pushes the approval commit and
  reads `main`'s CI, no tag; `publish`: who runs what); `pack-cycle` 7 → 8 (`activate`: who runs
  what); the row "The engine way of working" extended, its "in his own shell" made "in the
  approver's own shell" (dl-043 N3);
- **dl-045** (P1, P2): `tooling-delivery` 4 → 5 and `kanban-delivery` 6 → 7, `deliver` with the
  check on `main` after the merge, before the close and `done`; a red check stops the close;
- **dl-046** (P1 … P3): the 100-character rule in `repository-practice`, and `npm run
  check:texts`, a tooling task red first with its CI step; the existing long lines left as they are;
- **dl-047** (P1, P2): dl-017 R3 restated, its record extended with what was applied or not and
  why, in every phase holding a review before a gate; `decision-log-ingest` 2 → 3, `adr-ingest`
  2 → 3, `bug-ingest` 3 → 4; the plan template's Handoff comment; the correction-note rule in
  `repository-practice`; a note on dl-017;
- **dl-048** (P2 under option 3) **and dl-050** (D1, D3, D4): the workflow
  `.wingfoil/workflows/custom/pack-ingest.yaml` (`capture`, `rule`, `vision`, `hand-off`), its
  include among the startable mains, `sw-life-cycle` 5 → 6 (its header naming `pack-ingest` as the
  entry of a new pack) and `pack-cycle` 7 → 8 (`charter`'s description naming it), `workflow list`
  on the pinned CLI as the check (`wingfoil-cli` W-08), no `check:runs` scenario of its own; the
  row "The engine way of working" naming `pack-ingest` among the mains whose engine runs come
  first, in the same commit. The row "`pack-delivery`'s selection over `accepted` packs" stays with
  its owner (W10).

One `version` bump per file across the approved decision-logs (dl-043 D3): `repository-practice`
1.2 → 1.3 (dl-046, dl-047); `tooling-delivery` and `kanban-delivery` (dl-045, dl-047);
`pack-release-cycle` (dl-044, dl-047); `pack-cycle` (dl-044, dl-047, dl-048 and dl-050);
`sw-life-cycle` (dl-047, dl-048 and dl-050).

**dl-049 and W10's order** (the approver, 2026-11-23). dl-049 stays `pending`; the approver rules
it after reading this plan. Its path follows `pack-ingest` (dl-050 D4), placed in W10 after the
`wingfoil-release-intake` that raises this repository's pin: plan-080's close, then dl-049's
`rule`, `vision` and `hand-off` under `pack-ingest` (plan-079 closing with its `capture` done and
recording the move), then the two pull-request packs' cycles. The pin's bump stays where the
sequencer has it (W10, this repository's adoption).

**Register rows this plan settles:** "dl-044's actions" … "dl-048's actions" (five rows, dl-043
D3), each to Closed in the commit that settles it; "The engine way of working" extended, not
closed (its trigger stays the adoption).

**`main`'s CI before this plan** (`repository-practice` rule 3): plan-078's last push,
`c9b1d4b0` (`active → done`), run 45155163960 `success`, read here.

**Not in this plan:** dl-049's ruling and its path (above); the pin's bump and the adoption (W10);
`pack-delivery`'s selection over `accepted` packs (W10); the long lines already in the repository
(dl-046 P3); amending any approved body (each change is an Execution Note).

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **One plan, one branch.** Recommended: this plan on `main`; the work on
   `dl/dl-044-dl-050-actions` from `main` at the commit that submits this plan; one commit per row
   (Steps); each tooling task on its own branch from this plan's, merged into it with `--no-ff`
   (point 3); at the close, on the approver's OK, one `--no-ff` merge into `main`.
2. **The rows and their order** (the table in Steps). Recommended: the two delivery loops first
   (dl-045, dl-047), so that both tooling tasks are born under `tooling-delivery` v5; then the
   `check:texts` task (dl-046), so that `repository-practice` 1.3 describes a check that exists and
   the later rows are checked by it; then `repository-practice` 1.3; then the `publish:pack
   --report` task (dl-044); then the ingest workflows, `pack-release-cycle`, `pack-ingest` with
   `pack-cycle` and `sw-life-cycle`; the sequencer's W10 line; the notes last, citing the commits.
3. **The two tooling tasks** (`tooling-delivery` v5, `pack: ""`). Recommended: task-102 (`npm run
   check:texts`, dl-046 P2) and task-103 (`publish:pack --report`, dl-044 P1), each added with
   `memory add` on this plan's branch when its row starts, no other task added on any branch
   meanwhile (W-14); each on `task/<id>-<slug>` from this plan's branch, merged into it with
   `--no-ff`: a departure from `deliver` ("into main"), task-064 under plan-054 and plan-062's
   task as precedents, recorded in the task's notes. dl-045's check on `main`: each task's
   Acceptance names what runs on `main` (task-102: `check:texts` on the pushed range in `main`'s
   CI; task-103: none beyond `main`'s CI); since the tasks reach `main` only with this plan's
   merge, each stays `approved` until that merge's CI and its check are read, then its close and
   `approved → done` (dl-045 read for a task merged into its plan's branch). The alternative, each
   task from `main` and merged into `main` alone (dl-040 D2's practice, task-101), splits the plan
   into three merges.
4. **Checks** (dl-039 R1 … R3, as `tooling-delivery` v5 states them). Recommended: for each task,
   the build review and its amendments, then once on its frozen commit the branch CI and the local
   list on Node.js 22.21.0; for this plan's branch, the same once on its frozen head after the
   branch review; no clean clones (no row changes how the matrix installs a release); a job over
   25 minutes goes to the approver.
5. **`repository-practice` 1.3** (one bump, its Date). Recommended content: a rule 5, the
   100-character rule of dl-046 P1 with its exceptions and its scope, and the check of P2 (the
   staged diff before every commit, beside rule 2; CI on branches against the merge base and on
   `main` on the pushed range); a rule 6, the correction-note rule of dl-047 P1 (a claim of an
   Execution Note found false is corrected by a new dated note naming the claim and the correction,
   the earlier note left as written), applying from 1.3's date; each with its decision-log and "in
   force since" its approval date (2026-11-22); the title extended, the tags unchanged.
6. **dl-017 R3 restated** (dl-047 P1 option 2). Recommended: in the review's sentence of each phase
   option 2 lists (`plan` of both delivery loops; `capture` of `decision-log-ingest`, `adr-ingest`
   and `bug-ingest`; `pack-cycle` › `charter`; `pack-release-cycle` › `validate`; `sw-life-cycle`
   › `inception`, `specification` and `sunset`), and in `pack-ingest` › `capture` and `vision`,
   born with it: "its record (dl-017 R3): the verdict, the count per severity, what was applied, or
   not and why"; the plan template's Handoff comment naming R3 beside R1.
7. **`pack-ingest`** (dl-050 D1, D3). Recommended: `kind: main`, version 1, four phases as D1 lists
   them, with their roles, approvals and fallbacks (`rule` back to `capture`; `vision` skipped
   when every pack already has its row, as its description, since the pinned 0.2.2 has no skip);
   its header citing dl-048 and dl-050, and the deviation `hand-off` leaves (a charter plan hosted
   as plan-073 was, until the owed item on `pack-delivery`'s selection is settled); its include in
   `.wingfoil/workflows.yaml`. The check: `npm run -s wingfoil -- workflow list` exit 0 with
   `pack-ingest` listed, its include checked by hand (W-08).
8. **The sequencer** (`docs/01_vision/07_sequencer.md` 1.7 → 1.8). Recommended: W10's order line
   only, as the approver ruled on 2026-11-23 (after the intake that raises the pin: plan-080's
   close, dl-049's path under `pack-ingest`, the two pull-request packs' cycles), with its
   amendment line; the features list untouched (dl-049's `vision` step adds the rows, D9); an
   independent review of the amendment with the branch's. The alternative: the line written by
   dl-049's `vision` step, W10's order recorded meanwhile only in this plan and in dl-049's note.
9. **The notes** (the last row). Recommended: an Execution Note on dl-017 (R3's wider placement,
   dl-047 P2); on dl-044 … dl-048 and dl-050 their actions applied, with the commits; on dl-049
   the order ruled for its path (point 8); on plan-079 and plan-080 the same, so that each says
   where its next step is. Bodies stay as approved.
10. **The register.** Recommended: each of the five rows to Closed in the commit that settles it
    (dl-044's with task-103 and its workflow rows, the last of them); "The engine way of working"
    extended in `pack-ingest`'s commit; new rows only for items this plan leaves owed, in the
    commit of the note or ruling that leaves them (dl-036 R2).
11. **The pushes** (rule 3, dl-039 R3). Recommended: `main` pushed at `submit` (with the two
    approvals of 2026-11-23 not yet pushed, its CI read), at the merge (its CI read with its jobs'
    durations, then each task's check on `main` and its `done`), and once at the close (`active →
    done`), the run of the last push left to the next plan.

## The approver's rulings

<!-- Filled from the approver's ruling of the outline, before `submit`. -->

## Steps

On the branch `dl/dl-044-dl-050-actions`, from `main` at the commit that submits this plan; one
commit per row. Before every commit, the privacy check of `repository-practice` rule 2 and, from
row 2, `npm run check:texts` on the staged diff; after every commit under `.wingfoil/` or
`docs/memory/`, `npm run -s wingfoil -- workflow list` and `npm run lint` exit 0.

| # | File | Change | Source |
|---|---|---|---|
| 1 | `.wingfoil/workflows/custom/tooling-delivery.yaml` (4 → 5) and `kanban-delivery.yaml` (6 → 7), one commit | `deliver`: dl-045 P1's text; `plan`'s review: R3's record (point 6); the two files identical but for roles and descriptions. Row "dl-045's actions" to Closed | dl-045 P1, P2; dl-047 P1, P2 |
| 2 | `src/` (the `check:texts` script), `package.json`, `tests/`, `.github/workflows/ci.yml` | task-102 (point 3), on its own branch, merged into this one | dl-046 P2, P3 |
| 3 | `.wingfoil/directives/custom/repository-practice.md` (1.2 → 1.3, Date) | point 5. Row "dl-046's actions" to Closed | dl-046 P1, P3; dl-047 P1, P2 |
| 4 | `src/publish.ts`, `tests/` | task-103 (point 3), on its own branch, merged into this one | dl-044 P1, P3 |
| 5 | `.wingfoil/workflows/custom/decision-log-ingest.yaml` (2 → 3), `adr-ingest.yaml` (2 → 3), `bug-ingest.yaml` (3 → 4), `.wingfoil/memory/templates/plan.md`, one commit | `capture`'s review: R3's record; the template's Handoff comment (point 6) | dl-047 P1, P2 |
| 6 | `.wingfoil/workflows/custom/pack-release-cycle.yaml` (8 → 9) | `validate`'s review: R3's record; `approve-publication`: the agent pushes the approval commit and reads `main`'s CI, no tag, before handing over the publication's commands; `publish`: the approver runs `publish:pack` with `--report`, the agent reads the report into the Publication and checks the digest and the range against the Validation's dry run, a missing or different value to the approver before CB-6 | dl-044 P1 … P3; dl-047 P2 |
| 7 | `.wingfoil/workflows/custom/pack-ingest.yaml` (new, 1), `.wingfoil/workflows.yaml`, `pack-cycle.yaml` (7 → 8), `sw-life-cycle.yaml` (5 → 6), `docs/owed-items.md`, one commit | point 7; `pack-cycle`: `charter`'s description naming `pack-ingest` as the path a pack's proposal took, its review with R3's record, `activate`'s who runs what (dl-044 P2); `sw-life-cycle`: its header naming `pack-ingest` as the entry of a new pack, `inception`, `specification` and `sunset` with R3's record; the row "The engine way of working" extended (dl-044, `pack-ingest`, "the approver's own shell"). Rows "dl-044's actions" and "dl-048's actions" to Closed | dl-044 P2, P3; dl-047 P2; dl-048 P2; dl-050 D1, D3 |
| 8 | `docs/01_vision/07_sequencer.md` (1.7 → 1.8) | point 8 | the approver, 2026-11-23; dl-050 D4 |
| 9 | dl-017; dl-044 … dl-050; plan-079, plan-080 | the Execution Notes of point 9. Row "dl-047's actions" to Closed | dl-047 P2; dl-050 D4 |

Then, in dl-039 R2's order:
- **Leftovers:** a grep of `.wingfoil/`, `docs/` (outside `docs/memory/` except
  `docs/memory/tech-spec/`, outside `docs/plans/` and `docs/retrospectives/`) and the READMEs for
  "publish:pack", "in his own shell", "approved → done" and "a new pack": every hit that contradicts
  dl-044 … dl-050 outside the rows above goes to the approver, not edited here.
- **Review:** an independent review of the branch by a subagent (dl-017), each row checked against
  its decision-log; its record as R3 says, extended (dl-047); a re-review when a fix changes a rule.
- **Checks** (point 4), once, on the branch's frozen head after the review's fixes: its CI `success`
  (its jobs, run id and durations) and the local list on Node.js 22.21.0 after `npm ci` and
  `npm run build`; `npm run -s wingfoil -- directives list --format json` exits 0 with
  `"warnings": []`. The documentation-only commit that records them needs no new run (dl-039 R2).
- **Branch close:** push; the privacy check of the branch's diff recorded; on the approver's OK,
  `--no-ff` merge into `main`, push, `main`'s CI on the merge read with its jobs' durations; each
  task's check on `main`, then its close and `approved → done` (point 3); the remote and local
  branches removed.

## Handoff

- **claude (facilitator, and developer of the tasks):** every row and the branch close, except
  the approvals and the merge OK. It never runs `memory approve` or `memory reject`: it gives the
  approver the command, with `cd`, `--reason` and the full id (the pinned 0.2.2 resolves no short
  reference). No pull request. Files staged by name. Repository texts follow `repository-practice`.
- **Reviewers (subagents):** this plan; each task's body; each task's build; the branch; each
  re-review a fix that changes a decision needs (dl-017), each record with what was applied, or not
  and why (dl-047).
- **Approver:** the outline (before `submit`); each task's acceptance into the backlog and at
  `in-review`; any leftover that contradicts a decision; the merge OK; dl-049's ruling, at the
  approver's choice of time.
- Done when rows 1 … 9 are on `main` with their checks, the review applied, the branch CI and
  `main`'s read `success`, task-102 and task-103 `done`, dl-017 carries its note, dl-044 …
  dl-048 and dl-050 record their actions applied, and the five rows of dl-043 D3 are Closed. The
  plan then goes `active → done`.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
