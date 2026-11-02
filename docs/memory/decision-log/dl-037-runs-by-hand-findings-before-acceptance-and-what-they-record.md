---
id: dl-037-runs-by-hand-findings-before-acceptance-and-what-they-record
type: decision-log
title: "Runs by hand: findings before acceptance and what they record"
status: draft
tags: ["process","packs","evidence"]
---

## Context

dl-032 E2 asks a charter of a pack that ships workflows to record in its plan a run on the real
engine, "recorded with commands and exit codes (`pack-compatibility`'s evidence rule)", and says its
findings "go to the charter while it is `proposed`"; `pack-cycle` v6 › `charter` says the same.
plan-056, the first charter under E2, showed two gaps (the inventory of 2026-11-02, §1, §4.5):

1. **When.** The run came before the charter existed (plan-056 › step 2, then `memory add` at step
   3): its findings settled rulings 8 … 13 (`1f9f7d2`) before the charter was written, and step 4's
   checks of the review's findings ran while it was `draft`; it was submitted at `8abdd0e`. The
   wording names a state the findings never reached it in (GOV-5).
2. **What is recorded.** plan-056 › step 2 records the composition, representative commands,
   counts ("163 commands; each exits 0 except those named") and every exception, not each command;
   task-069 likewise, with 118 steps. The draft overlay was untracked by design and deleted after
   task-067, so the charter's run cannot be repeated from the repository. `pack-compatibility`'s
   rule ("the commands, the WingFoil versions and the exit codes") is written for a `pack-release`'s
   automated checks; for a run of a hundred commands by hand, whether a summary meets it is unsettled
   (GOV-6).

`pack-cycle` and `pack-compatibility` are this repository's own and survive W10. Candidates GOV-5
and GOV-6 of the retrospective dl-034 (C3).

## Options

For gap 1: keep the wording, or "before it is accepted". For gap 2: (a) a summary with every
non-zero exit and its command, the commit composed and the WingFoil release; (b) (a) with the full
log kept outside the repository; (c) the log committed; (d) a charter's draft committed on the
plan's branch, so the run can be repeated. (b) keeps what nobody else can read; (c) puts scratch
logs, with their local paths, into the history (rule 2 forbids those paths); (d) commits a pack's
content before its charter is accepted, outside the reviews its `author` tasks give it (plan-047 ›
Execution Notes, steps 2–3: the draft is never committed), and once the pack is authored it is a
second copy an overlay run would read beside it (plan-057 › step 4).

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **E1 — When:** a run's findings reach the charter **before it is accepted**: they settle the
  plan's rulings, then the charter's body while `draft`, or an amendment while `proposed`.
- **E2 — What a run by hand records** (option (a)), in the plan for a charter's run and in the task
  for an exit criterion's (task-069's precedent): the WingFoil version and commit as `wingfoil
  version` prints them, the packs composed and the commit they were composed from (for an untracked
  draft, the base commit, and that the draft is untracked and cannot be repeated from the
  repository), the parameters that differ from the defaults, the count of commands and how many
  exited 0, every non-zero exit with its command and whether it was expected (a refusal the run
  seeks) or a slip of the driving script, and the states and iterations the run reached. No local or
  scratch path. A scripted run (`check:runs`) records its command, its exit code and its run count,
  as today.
- **E3 — Where:** `pack-cycle` v6 → v7, `charter`'s description (E1, and E2 by reference) and
  `author`'s (E2 for E4's run by hand); `pack-compatibility`'s evidence bullet extended with E2 for
  a run by hand; an Execution Note on dl-032 (E2 reads with E1 and E2 here; the body stays as
  approved). Applied after approval by a dl actions plan. The scripted full runs stay a row of
  `docs/owed-items.md`.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-02: written under plan-059 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-034, as the approver chose at the checkpoint (inventory P3).
- 2026-11-02: independent review: approve after amendments, nothing blocking; applied: an untracked
  draft's record and option (d) with its reason, E1's wording, the WingFoil version as printed, where
  each run's record lives; the dl actions plan's row is dl-034 D3's.
- 2026-11-02: re-review (with dl-034's): applied the citation of plan-047's Execution Notes.
