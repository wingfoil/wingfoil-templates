---
id: task-099-the-run-by-hand-of-governance-feedback-on-wingfoil-0.3.2-with-and-without-software-plan-076-task-099
type: task
title: "The run by hand of governance/feedback on WingFoil 0.3.2, with and without software (plan-076 task-099)"
status: in-progress
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

- 2026-11-18, **the run**, on WingFoil 0.3.2, composed from `52d125c2`, in two scratch repositories
  (criterion 1): Sandpiper Tickets (`with-software`) and Dunlin Notes (`without-software`). All 136
  WingFoil commands exited 0, with nothing on stderr and no `diagnostics` or `warnings` entry; two
  `workflow start` outputs carry the advice quoted under criterion 7.
  Between the commands, the driver wrote the fields and bodies, and committed them. Each `memory
  approve` ran under the repository's fictional approver. 141 commits in `with-software`, 56 in
  `without-software`, each working tree clean.
- 2026-11-18, **driven twice.** The independent review of the first run found that its custom
  directive was bound to no role and that its upstream note named a version it was not observed on.
  Both repositories were composed again from `52d125c2` and every route driven again. These notes
  record the second run.
- 2026-11-18, **`with-software`, the routes** (criterion 2). The tables leave out each command's
  `--format json` and each approval's `--reason`.

  | Route | Item | Outcome | `resulting` | Final state | Cited back |
  |---|---|---|---|---|---|
  | decision | `feedback-001-keep-closed-tickets-for-a-year` | `decision-log` | `dl-001-how-long-closed-tickets-are-kept` | `closed` | yes |
  | governance | `feedback-002-two-people-triage-one-report` | `decision-log` | `dl-002-one-person-triages-a-report` | `closed` | yes |
  | task | `feedback-003-reply-macros` | `task` | `task-001-reply-macros` | `closed` | yes |
  | declined | `feedback-004-a-phone-line` | `declined` | `n/a — outside the desk's scope` | `closed` | the reason, in `resulting` and the body |
  | duplicate | `feedback-005-a-phone-line-again` | `duplicate` | `n/a — the same report as feedback-004-a-phone-line` | `closed` | the reason, in `resulting` and the body |
  | added outcome | `feedback-006-offline-tickets` | `deferred` | `dl-003-offline-tickets-deferred` | `closed` | yes |
  | bug | `feedback-007-the-export-crashes` | `bug` | `bug-001-the-export-crashes` | `closed` | yes |
  | upstream note | `feedback-008-the-vendor-export-leaves-tickets-out` | `upstream-note` | `docs/upstream/plover/feedback-008-the-vendor-export-leaves-tickets-out.md` | `closed` | yes |

  | Route | The WingFoil commands, in order; each exit 0 |
  |---|---|
  | decision | `workflow start feedback-ingest`; `memory add --type feedback --title Keep closed tickets for a year --workflow feedback-ingest-1-plan --step feedback-ingest.capture`; `memory submit feedback-001-keep-closed-tickets-for-a-year`; `memory approve feedback-001-keep-closed-tickets-for-a-year`; `workflow end feedback-ingest-1-plan`; `workflow start decision-log-ingest`; `memory add --type decision-log --title How long closed tickets are kept --workflow decision-log-ingest-1-plan --step decision-log-ingest.capture`; `memory submit dl-001-how-long-closed-tickets-are-kept`; `memory approve dl-001-how-long-closed-tickets-are-kept`; `workflow end decision-log-ingest-1-plan`; `workflow start feedback-review`; `workflow finalize feedback-review-1-plan --step feedback-item.route@feedback:feedback-001-keep-closed-tickets-for-a-year`; `memory submit feedback-001-keep-closed-tickets-for-a-year`; `workflow end feedback-review-1-plan` |
  | governance | `workflow start feedback-ingest`; `memory add --type feedback --title Two people triage one report --workflow feedback-ingest-1-2-plan --step feedback-ingest.capture`; `memory submit feedback-002-two-people-triage-one-report`; `memory approve feedback-002-two-people-triage-one-report`; `workflow end feedback-ingest-1-2-plan`; `workflow start governance-evolution`; `workflow finalize governance-evolution-1-plan --step governance-evolution.assess`; `memory add --type decision-log --title One person triages a report --workflow governance-evolution-1-plan --step governance-evolution.propose`; `memory submit dl-002-one-person-triages-a-report`; `memory approve dl-002-one-person-triages-a-report`; `workflow end governance-evolution-1-plan`; `workflow start feedback-review`; `workflow finalize feedback-review-1-2-plan --step feedback-item.route@feedback:feedback-002-two-people-triage-one-report`; `memory submit feedback-002-two-people-triage-one-report`; `workflow end feedback-review-1-2-plan` |
  | task | `workflow start feedback-ingest`; `memory add --type feedback --title Reply macros --workflow feedback-ingest-1-3-plan --step feedback-ingest.capture`; `memory submit feedback-003-reply-macros`; `memory approve feedback-003-reply-macros`; `workflow end feedback-ingest-1-3-plan`; `workflow start feedback-review`; `memory add --type task --title Reply macros`; `workflow finalize feedback-review-1-3-plan --step feedback-item.route@feedback:feedback-003-reply-macros`; `memory submit feedback-003-reply-macros`; `workflow end feedback-review-1-3-plan` |
  | declined | `workflow start feedback-ingest`; `memory add --type feedback --title A phone line --workflow feedback-ingest-1-4-plan --step feedback-ingest.capture`; `memory submit feedback-004-a-phone-line`; `memory approve feedback-004-a-phone-line`; `workflow end feedback-ingest-1-4-plan`; `workflow start feedback-review`; `workflow finalize feedback-review-1-4-plan --step feedback-item.route@feedback:feedback-004-a-phone-line`; `memory submit feedback-004-a-phone-line`; `workflow end feedback-review-1-4-plan` |
  | duplicate | `workflow start feedback-ingest`; `memory add --type feedback --title A phone line again --workflow feedback-ingest-1-5-plan --step feedback-ingest.capture`; `memory submit feedback-005-a-phone-line-again`; `memory approve feedback-005-a-phone-line-again`; `workflow end feedback-ingest-1-5-plan`; `workflow start feedback-review`; `workflow finalize feedback-review-1-5-plan --step feedback-item.route@feedback:feedback-005-a-phone-line-again`; `memory submit feedback-005-a-phone-line-again`; `workflow end feedback-review-1-5-plan` |
  | added outcome | `workflow start feedback-ingest`; `memory add --type feedback --title Offline tickets --workflow feedback-ingest-1-6-plan --step feedback-ingest.capture`; `memory submit feedback-006-offline-tickets`; `memory approve feedback-006-offline-tickets`; `workflow end feedback-ingest-1-6-plan`; `workflow start decision-log-ingest`; `memory add --type decision-log --title Offline tickets, deferred --workflow decision-log-ingest-1-2-plan --step decision-log-ingest.capture`; `memory submit dl-003-offline-tickets-deferred`; `memory approve dl-003-offline-tickets-deferred`; `workflow end decision-log-ingest-1-2-plan`; `workflow start feedback-review`; `workflow finalize feedback-review-1-6-plan --step feedback-item.route@feedback:feedback-006-offline-tickets`; `memory submit feedback-006-offline-tickets`; `workflow end feedback-review-1-6-plan` |
  | bug | `workflow start feedback-ingest`; `memory add --type feedback --title The export crashes --workflow feedback-ingest-1-7-plan --step feedback-ingest.capture`; `memory submit feedback-007-the-export-crashes`; `memory approve feedback-007-the-export-crashes`; `workflow end feedback-ingest-1-7-plan`; `workflow start bug-ingest`; `memory add --type bug --title The export crashes --workflow bug-ingest-1-plan --step bug-ingest.capture`; `memory submit bug-001-the-export-crashes`; `memory approve bug-001-the-export-crashes`; `workflow end bug-ingest-1-plan`; `workflow start feedback-bug-route`; `workflow finalize feedback-bug-route-1-plan --step feedback-bug-item.bug@feedback:feedback-007-the-export-crashes`; `memory submit feedback-007-the-export-crashes`; `workflow end feedback-bug-route-1-plan` |
  | upstream note | `workflow start feedback-ingest`; `memory add --type feedback --title The vendor export leaves tickets out --workflow feedback-ingest-1-8-plan --step feedback-ingest.capture`; `memory submit feedback-008-the-vendor-export-leaves-tickets-out`; `memory approve feedback-008-the-vendor-export-leaves-tickets-out`; `workflow end feedback-ingest-1-8-plan`; `workflow start feedback-review`; `workflow finalize feedback-review-1-7-plan --step feedback-item.route@feedback:feedback-008-the-vendor-export-leaves-tickets-out`; `memory submit feedback-008-the-vendor-export-leaves-tickets-out`; `workflow end feedback-review-1-7-plan` |
  | final read | `workflow list`; `directives list` |

  In the governance route, two commits that are no WingFoil command fall between `memory approve` of
  the decision-log and `workflow end`, in this order: `AGENTS.md` copied from the composed
  `AGENTS.region.md`; then `.wingfoil/directives/custom/one-triager.md`, with `one-triager` added by
  hand under `facilitator` in `.wingfoil/roles.yaml`; `wingfoil directive assign` would do the same.
- 2026-11-18, **`without-software`, the routes** (criterion 3):

  | Route | Item | Outcome | `resulting` | Final state | Cited back |
  |---|---|---|---|---|---|
  | decision | `feedback-001-keep-notes-for-a-year` | `decision-log` | `dl-001-how-long-notes-are-kept` | `closed` | yes |
  | task | `feedback-002-note-templates` | `task` | `task-001-note-templates` | `closed` | yes |
  | would-be bug | `feedback-003-a-note-is-saved-twice` | `decision-log` | `dl-002-a-note-saved-twice` | `closed` | yes |

  | Route | The WingFoil commands, in order; each exit 0 |
  |---|---|
  | decision | `workflow start feedback-ingest`; `memory add --type feedback --title Keep notes for a year --workflow feedback-ingest-1-plan --step feedback-ingest.capture`; `memory submit feedback-001-keep-notes-for-a-year`; `memory approve feedback-001-keep-notes-for-a-year`; `workflow end feedback-ingest-1-plan`; `workflow start decision-log-ingest`; `memory add --type decision-log --title How long notes are kept --workflow decision-log-ingest-1-plan --step decision-log-ingest.capture`; `memory submit dl-001-how-long-notes-are-kept`; `memory approve dl-001-how-long-notes-are-kept`; `workflow end decision-log-ingest-1-plan`; `workflow start feedback-review`; `workflow finalize feedback-review-1-plan --step feedback-item.route@feedback:feedback-001-keep-notes-for-a-year`; `memory submit feedback-001-keep-notes-for-a-year`; `workflow end feedback-review-1-plan` |
  | task | `workflow start feedback-ingest`; `memory add --type feedback --title Note templates --workflow feedback-ingest-1-2-plan --step feedback-ingest.capture`; `memory submit feedback-002-note-templates`; `memory approve feedback-002-note-templates`; `workflow end feedback-ingest-1-2-plan`; `workflow start feedback-review`; `memory add --type task --title Note templates`; `workflow finalize feedback-review-1-2-plan --step feedback-item.route@feedback:feedback-002-note-templates`; `memory submit feedback-002-note-templates`; `workflow end feedback-review-1-2-plan` |
  | would-be bug | `workflow start feedback-ingest`; `memory add --type feedback --title A note is saved twice --workflow feedback-ingest-1-3-plan --step feedback-ingest.capture`; `memory submit feedback-003-a-note-is-saved-twice`; `memory approve feedback-003-a-note-is-saved-twice`; `workflow end feedback-ingest-1-3-plan`; `workflow start decision-log-ingest`; `memory add --type decision-log --title A note saved twice --workflow decision-log-ingest-1-2-plan --step decision-log-ingest.capture`; `memory submit dl-002-a-note-saved-twice`; `memory approve dl-002-a-note-saved-twice`; `workflow end decision-log-ingest-1-2-plan`; `workflow start feedback-review`; `workflow finalize feedback-review-1-3-plan --step feedback-item.route@feedback:feedback-003-a-note-is-saved-twice`; `memory submit feedback-003-a-note-is-saved-twice`; `workflow end feedback-review-1-3-plan` |
  | final read | `workflow list`; `directives list` |

- 2026-11-18, **what was read at the end** (criterion 5), by a script of its own over the files:
  - all 11 items are `closed`, with their `outcome` and `resulting`;
  - each routed element and the upstream note cites its item; the declined and the duplicate items
    hold their reason in `resulting` and in the body;
  - the commit of the `custom/` directive reads "Name who triages a report, as
    dl-002-one-person-triages-a-report decided", and `directives list` reports that directive
    assigned to `facilitator`;
  - in both repositories `workflow list` and `directives list` exit 0 with no diagnostic and no
    warning, and `workflow status` reports no open workflow.
- 2026-11-18, **one observation on the bug:** `workflow status` in `with-software` says "human
  needed: approve or reject bug-001-the-export-crashes (bug, triaged; no open workflow carries it)".
  `bug-ingest` owns the bug after its triage, and the feedback route only records it, as the
  `feedback-bug-route` directive says.
- 2026-11-18, **criterion 7:** no fact against the charter's shape and no defect of this pack, so
  nothing under `packs/` changed. Two facts are owed, each with a row in `docs/owed-items.md`:
  - **WingFoil 0.3.2:** a `custom/` directive that no role binds raises no warning in `directives
    list` or `workflow list`.
  - **`base` without `software`:** in `without-software`, `workflow start decision-log-ingest` twice
    reports `directiveWarnings: ["no directives assigned to role 'product-owner'"]`. The role of
    `decision-log-ingest` › `capture` has no directive when `base` is composed without `software`.
    The run went on: the step needs none, and the advice comes from `base`, not from this pack.
- 2026-11-18, **the review of the run** (dl-017): approve after amendments; no blocker, three
  should-fix and three nits, all applied: the re-drive above, the two commits of the governance
  route named, the bug's status quoted, the tables' omissions stated, and stdout read for
  diagnostics. The second run changes only the governance route's directive binding and the note's
  version, each of which a final check of these notes covers.
- 2026-11-18, **the privacy check** of the branch's diff (`repository-practice` rule 2): no local or
  scratch path, no private project.
