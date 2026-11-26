---
id: plan-089-dl-actions-dl-053-and-dl-054-the-approval-commit-pushed-by-the-approver-and-npm-run-check-release
type: plan
title: "dl actions: dl-053 and dl-054, the approval commit pushed by the approver and npm run check:release"
status: draft
workflow: "decision-log-ingest"
phase: "rule"
tags: ["process","dl-actions","retrospective","workflows","tooling"]
---

## Context

The `rule` phase of `decision-log-ingest` for the two governance decision-logs of
`governance/wingfoil-dogfood`'s retrospective (plan-088, dl-052 C1, C2), both approved on
2026-11-26 (`6184fb59`, `ce583664`): their actions, applied here as each one's P2 says ("applied
after approval by a dl actions plan"). Named as the next plan by plan-088's close.

- **dl-053** (P1, P2): when the approver approves a pack-release (`releasing → released`), the
  approver pushes that commit (no tag), and the agent reads `main`'s CI on it and hands over the
  publication's commands only after its `success`; dl-044 P2's first two sentences replaced, the
  rest of P2 standing. Actions: `pack-release-cycle` › `approve-publication`; the row "The engine
  way of working", its phrase "the agent pushes a pack-release's approval commit, which carries no
  tag (dl-044 P1, P2)" replaced by "the approver pushes a pack-release's approval commit, which
  carries no tag, and the agent reads `main`'s CI on it (dl-044 P1, dl-053 P1)", its Source
  extended with dl-053; a note on dl-044 recording the application.
- **dl-054** (P1, P2): `npm run check:release` runs a pack-release's clean-clone list in its
  order (dl-054 › Context: `npm ci`, the build, `npm test`, `lint`, `check:pins`,
  `check:schemas`, `check:packs`, `index -- --check`, `validate`, the golden step, the four
  overlays, `workflow list`, `check:runs`, the two audits, on each Node.js given; the evidence
  and the dry run of `publish:pack` on the first), from a clone of `HEAD` outside the tree, the
  matrix cache copied as the records did; it stops at the first non-zero exit and says which,
  writes its report (the commit, `node --version` per leg, each command, its exit code, the
  counts' lines) on a non-zero exit too, to a path outside the repository; it refuses a report
  path inside the repository and a dirty tree, and leaves the working tree as it was. Actions: a
  tooling task through `tooling-delivery` for the command and its tests, red first (dl-018);
  `pack-release-cycle` › `validate` naming it.

One `version` bump across both (dl-052 D4): `pack-release-cycle` 9 → 10. `pack-cycle` and
`pack-release` include it by name and change in nothing (no bump).

**Register rows this plan settles:** "dl-053's actions" and "dl-054's actions" (dl-052 D4), each
to Closed in the commit that settles it; "The engine way of working" reworded, not closed (its
trigger stays the adoption).

**`main`'s CI before this plan** (`repository-practice` rule 3): plan-088's last push,
`ca252b89` (`active → done`), run 45803631548 `success`, its jobs (22.12.0, 1) 10 min 34 s,
(22.21.0, 1) 10 min 50 s, (22.12.0, 2) 6 min 22 s, (22.21.0, 2) 8 min 55 s; Pages, run
45803631489, `success`.

**Numbers** (next free on `main` at this plan's `memory add`): plan-089 (this plan), task-106
(the `check:release` task), bug-017 (a defect of this repository found here, if any). The pin is
0.2.2, so `memory add` numbers by count (`wingfoil-cli` W-14): task-106 is added on this plan's
branch, its printed id checked, no other task added on any branch meanwhile.

**Not in this plan:** a pack release (the next one, the pack release round, is the first to run
`pack-release-cycle` 10); the pin's bump and the adoption (W10); amending any approved body (each
change is an Execution Note); the other rows dl-052 D2 and D3 left open.

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **One plan, one branch.** Recommended: this plan on `main`; the work on
   `dl/dl-053-dl-054-actions` from `main` at the commit that submits this plan; one commit per row
   (Steps); task-106 on its own branch from this plan's, merged into it with `--no-ff` (point 2);
   at the close, on the approver's OK, one `--no-ff` merge into `main`, pushed by the approver.
2. **task-106** (`tooling-delivery` v5, `pack: ""`). Recommended: "`npm run check:release`: a
   pack-release's clean-clone checks run by one committed command (plan-089, task-106)", added
   with `memory add` on this plan's branch at row 1; on `task/task-106-<slug>` from this plan's
   branch, merged into it with `--no-ff`, a departure from `deliver` ("into main") as task-102
   and task-103 under plan-081, recorded in its notes; its body reviewed and accepted into the
   backlog by the approver, its build reviewed, `in-review` approved by the approver. Its
   Acceptance names no check on `main` beyond `main`'s CI (the command runs at a release, not in
   CI); it stays `approved` until this plan's merge and `main`'s CI on it, then its close and
   `approved → done`. The Design settles, with their red tests: the options (the report path,
   the Node.js legs, the clone's directory, a `--keep` of it or not), how it finds each Node.js,
   the cache copy, and the counts' lines it records. The alternative, task-106 from `main` and
   merged into `main` alone (dl-040 D2's practice), splits the plan into two merges.
3. **Its tests.** Recommended: unit tests of the plan of commands (order, the first leg's extra
   steps, the stop at the first non-zero exit, the report written on failure, a report path inside
   the repository refused, a dirty tree refused) with an injected runner, no real clone or
   install in `npm test`; one rehearsal of the real command on this plan's branch head, on Node.js
   22.21.0 then 22.12.0, its report's lines recorded in task-106's notes (its first use; dl-054's
   records start at the next release).
4. **`pack-release-cycle` 10** (row 2, after task-106's merge, so that the workflow names a
   command that exists). Recommended: `validate`: "the clean-clone checks run by `npm run
   check:release` from the submitted head, its report outside the repository read into the
   Validation, a failed run's report beside the rerun's (dl-054 P1)", its check's text unchanged;
   `approve-publication`: "The approver authorizes the publication (releasing → released) or sends
   it back, and pushes the approval commit (no tag); the agent reads main's CI on it and hands
   over the publication's commands only after its success (dl-053 P1)"; the header unchanged;
   `npm run -s wingfoil -- workflow list` and `npm run check:runs` exit 0.
5. **The register and the notes** (row 3). Recommended: the row "The engine way of working"
   reworded as dl-053 P2 says, its Source extended with dl-053; "dl-053's actions" and "dl-054's
   actions" to Closed in that commit (dl-054's with task-106 merged and row 2); a note on dl-044
   (P2's first two sentences replaced, applied in row 2, the commits), one on dl-053 and one on
   dl-054 (their actions applied, the commits). A row closed before task-106's `done` stays closed
   if `main`'s CI is red: the fix gets a new row, with the task or bug that carries it.
6. **Checks** (dl-039 R1 … R3, as `tooling-delivery` v5 states them). Recommended: for task-106,
   the build review and its amendments, then once on its frozen commit the branch CI and the local
   list on Node.js 22.21.0; for this plan's branch, the same once on its frozen head after the
   branch review; no clean clones (no row changes how the matrix installs a release); a job over
   25 minutes goes to the approver.
7. **The pushes** (rule 3). Recommended: every push of `main` the approver's (dl-053's own
   reason); `main` pushed at `submit`, its CI read; at the merge, its CI read with its jobs'
   durations, then task-106's close and `done`; once at the close (`active → done`), its run read
   by the next plan. The agent pushes the branches.

## Steps

On the branch `dl/dl-053-dl-054-actions`, from `main` at the commit that submits this plan; one
commit per row. Before every commit, the privacy check (`repository-practice` rule 2) and `npm run
check:texts` on the staged diff (rule 5); after every commit under `.wingfoil/` or `docs/memory/`,
`npm run -s wingfoil -- workflow list` and `npm run lint` exit 0, and after every commit under
`.wingfoil/workflows/`, `npm run check:runs` too. Files staged by name.

| # | File | Change | Source |
|---|---|---|---|
| 1 | `src/` (the `check:release` script), `package.json`, `tests/` | task-106 (points 2, 3), on its own branch, merged into this one | dl-054 P1, P2 |
| 2 | `.wingfoil/workflows/custom/pack-release-cycle.yaml` (9 → 10) | point 4 | dl-053 P1, P2; dl-054 P1, P2; dl-052 D4 |
| 3 | `docs/owed-items.md`; dl-044, dl-053, dl-054 | point 5: the row "The engine way of working" reworded; rows "dl-053's actions" and "dl-054's actions" to Closed; the three notes | dl-053 P2; dl-054 P2; dl-052 D4 |

Then, in dl-039 R2's order:
- **Leftovers:** a grep of `.wingfoil/`, `docs/` (outside `docs/memory/` except
  `docs/memory/tech-spec/`, outside `docs/plans/` and `docs/retrospectives/`) and the READMEs for
  "approval commit", "pushes the approval" and "clean clone": every hit that contradicts dl-053 or
  dl-054 outside the rows above goes to the approver, not edited here.
- **Review:** an independent review of the branch by a subagent (dl-017), each row checked against
  its decision-log; its record (dl-017 R3); a re-review when a fix changes a rule.
- **Checks** (point 6), once, on the branch's frozen head after the review's fixes: its CI
  `success` (its jobs, run id and durations) and the local list on Node.js 22.21.0 after `npm ci`
  and `npm run build`. The documentation-only commit that records them needs no new run (dl-039
  R2).
- **Branch close:** push; the privacy check of the branch's diff and its commit messages recorded;
  on the approver's OK, `--no-ff` merge into `main`, pushed by the approver, `main`'s CI on the
  merge read with its jobs' durations; task-106's close and `approved → done`; the remote and
  local branches removed; the next plan named.

## Handoff

- **claude (facilitator, and developer of task-106):** every row and the branch close, except the
  approvals, the pushes of `main` and the merge OK. It never runs `memory approve` or `memory
  reject`: it gives the approver the command, with `cd`, `--reason` and the full id (the pinned
  0.2.2 resolves no short reference). No pull request. Repository texts follow
  `repository-practice`.
- **Reviewers (subagents):** this plan; task-106's body; its build; the branch; each re-review a
  fix that changes a decision needs (dl-017), each record (dl-017 R3) the verdict, the count per
  severity, the fixing commit, what was applied, or not and why.
- **Approver:** the outline (before `submit`); task-106's acceptance into the backlog and at
  `in-review`; any leftover that contradicts a decision; every push of `main`; the merge OK.
- Done when rows 1 … 3 are on `main` with their checks, the review applied, the branch CI and
  `main`'s read `success`, task-106 `done`, dl-044, dl-053 and dl-054 carry their notes, and the
  two rows of dl-052 D4 are Closed. The plan then goes `active → done`.

## Execution Notes

<!-- Filled while the plan runs: deviations, blockers, decisions taken, WingFoil friction
     (also recorded in docs/wingfoil-feedback/). At wave close: per tech-spec, the errata and
     rulings recorded in the wave, and the element the approver names to fold them back, or the
     ruling that none is needed (dl-020).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
