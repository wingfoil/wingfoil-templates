---
id: task-099-the-run-by-hand-of-governance-feedback-on-wingfoil-0.3.2-with-and-without-software-plan-076-task-099
type: task
title: "The run by hand of governance/feedback on WingFoil 0.3.2, with and without software (plan-076 task-099)"
status: backlog
pack: "pack-governance-feedback"
depends_on: ["task-097", "task-098"]
tags: ["packs","feedback","governance"]
---

## Context

plan-076 (`pack-cycle › author` of `pack-governance-feedback`), point 6 and its ruling. The
charter's exit criterion (dl-032 E4) asks for a run of the pack's workflows through every route at
least once, with and without `software`. `check:runs` (task-097) drives seven routes by script,
each in a repository of its own. This task drives the routes by hand on the engine, several in one
repository, as plan-073 step 2 did on the draft. It adds what no script drives as a route: a
`duplicate`, and a governance change through `governance-evolution`.

The approver ruled WingFoil 0.3.2 only (plan-076 point 6): 0.3.0 is covered by the matrix and by
`check:runs`.

**A reading for the approver to rule at this task's backlog acceptance: the approvals of the run.**
plan-076's Handoff says the agent never runs `memory approve`. The triage of each item, each
decision-log and the bug each need one, and WingFoil refuses the agent's identity. As `check:runs`
does, the agent runs `memory approve` in the two scratch repositories only, under each repository's
fictional approver, on fixture data. The agent runs no `memory approve` in this repository.

## Acceptance

1. **The two scratch repositories,** outside this repository, never committed to it. Each is
   composed from `main` at the commit this task's branch starts from (or from the commit of a fix,
   criterion 7), with fictional values and `.example` addresses, its `.wingfoil/` committed, and
   driven by WingFoil 0.3.2 as the matrix installs it:

   | Repository | Packs | Parameters beyond `base`'s four | Tree |
   |---|---|---|---|
   | `with-software` | `software@^1`, `methodology/kanban@^1`, `governance/feedback@^1`, `governance/feedback-upstream@^1` | `upstream:plover-vendor` added to `feedback_targets`, `deferred` added to `feedback_outcomes` | a copy of the composed commit's tree, with `feedback-exit`'s packs merged into `packs/` |
   | `without-software` | `base@^2`, `governance/feedback@^1` | none | the composed commit's tree |
2. **The routes of `with-software`,** each on an item of its own:

   | Route | Outcome | Driven through |
   |---|---|---|
   | a decision | `decision-log` | `decision-log-ingest` |
   | a governance change | `decision-log`, the item's `target` being `governance` | `governance-evolution`: `AGENTS.md` committed from the composed `AGENTS.region.md`, and a change under `.wingfoil/directives/custom/` committed with a message citing the decision-log |
   | a task | `task` | a `task` in `draft`, added outside the step |
   | declined | `declined` | `resulting` and the body holding the reason |
   | a duplicate | `duplicate` | `resulting` and the body holding the reason |
   | the added outcome | `deferred` | a decision-log naming the outcome |
   | a bug | `bug` | `bug-ingest`, then `feedback-bug-route` |
   | an upstream note | `upstream-note` | a note where the channel directive says, in its format |
3. **The routes of `without-software`,** each on an item of its own: `decision-log` through
   `decision-log-ingest`; `task`; and the would-be `bug`, proposed as `decision-log`, the item and
   the decision-log both naming it.
4. **Each route, end to end,** one route at a time:
   - the item is captured through `feedback-ingest`, submitted, and triaged by the fictional
     approver;
   - it is routed as the `feedback` directive says, and `resulting` is written;
   - the route step is recorded with `workflow finalize`: `feedback-item.route@feedback:<id>`, or
     `feedback-bug-item.bug@feedback:<id>` for a bug, whose reviewing main is `feedback-bug-route`;
   - the item goes `triaged → closed`;
   - every main the route started is ended with `workflow end`, the reviewing main before the next
     item is captured.
5. **What is read at the end,** in each repository, and recorded:
   - every item is `closed`, with its `outcome` and `resulting`;
   - every routed element or note cites the item back;
   - in `with-software`, the commit of the `custom/` change cites the governance route's
     decision-log, which WingFoil does not check;
   - `workflow list` and `directives list` exit 0 with no diagnostic and no warning.
6. **The Execution Notes record:**
   - each commit composed and the WingFoil release;
   - the commands of each route, in order, and each exit code;
   - one row per route: the item's id, its outcome, its `resulting` and its final state;
   - every refusal, warning or surprise, quoted, with what was done about it.
7. **A finding:**
   - a fact that shows the charter's shape does not hold goes to the approver when found (dl-019),
     and the work on it waits;
   - a small defect of the pack is fixed in this task and reviewed, the repositories it touches are
     composed again from the fix's commit, and every route of those repositories is driven again;
   - a larger one goes through plan-076's gate;
   - friction in WingFoil itself gets a row in `docs/owed-items.md` (`repository-practice` rule 4).
8. **What does not change,** unless criterion 7 fixes a defect: no file under `src/`, `packs/`,
   `tests/`, `.github/` or `.wingfoil/`. The scratch repositories and their logs are not committed,
   and are kept until the review of criterion 9 ends.
9. **Checks** (`kanban-delivery` › `review`, dl-039):
   - first, an independent review of the notes against the scratch repositories and of any fix of
     criterion 7, and its amendments;
   - then, once, on the frozen commit: the branch CI `success`, its run id and every job's duration
     recorded (a job over 25 minutes goes to the approver, R3);
   - dl-039's local list on Node.js 22.21.0, from a clean working tree after `npm ci` and
     `npm run build`: `npm run validate:publication`, the golden tree in publication mode and
     `npm run -s wingfoil -- workflow list`, each exit 0.
10. **Delivery:**
    - the branch `task/task-099-run-by-hand` from `main`, in a worktree of its own;
    - after `approve`, a `--no-ff` merge on the approver's OK, `main` pushed, its CI read, and
      `approved → done`;
    - the privacy check of the branch's diff recorded (`repository-practice` rule 2): the notes name
      no local or scratch path.

## Design

Branch `task/task-099-run-by-hand` from `main` at `52d125c2`, in a worktree of its own.

- **The trees:** `git archive` of `52d125c2` for `without-software`; the same tree with
  `tests/fixtures/feedback-exit/packs/` merged into `packs/` for `with-software`.
- **The projects,** fictional: Sandpiper Tickets (`with-software`) and Dunlin Notes
  (`without-software`), each with a lead and an agent at a `.example` address.
- **The driver:** a script outside the repository runs each WingFoil command in order, stops at the
  first command that fails, and logs every command with its exit code. It sets the git identity in
  the scratch repository only: the agent's for every command, the fictional approver's for each
  `memory approve`. The Execution Notes are written from its log.
- **The order:** the routes of criterion 2 and then of criterion 3, one at a time, each item's
  reviewing main ended before the next capture.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
