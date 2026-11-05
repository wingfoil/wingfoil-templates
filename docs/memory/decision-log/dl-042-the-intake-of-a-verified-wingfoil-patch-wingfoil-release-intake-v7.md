---
id: dl-042-the-intake-of-a-verified-wingfoil-patch-wingfoil-release-intake-v7
type: decision-log
title: "The intake of a verified WingFoil patch: wingfoil-release-intake v7"
status: draft
tags: ["process","intake","wingfoil","ci"]
---

## Context

plan-065 automates `wingfoil-release-intake` where it is safe (asked by the approver on 2026-11-02;
plan-065 rulings of 2026-11-05): a daily read-only detection of the `wingfoil` versions on npm
missing from `compat.yaml`, a deterministic `intake:prepare` for a patch, and a verify job that
reports **verified** or **guided** with the prepared diff as an artifact, never a push. The workflow
(`wingfoil-release-intake` v6: `record`, `recheck`, `plan-migrations`, `notify`,
`retrospective-start`) is run by hand today. Three things shape what an automatic path can do:

- dl-021 R4: a release is recorded as providing a capability "only when its CHANGELOG names the
  feature or command behind it" (restated by spec-001 §12 and v6 `record`). 0.3.1 and 0.3.2 carried
  `workflow-engine` forward from 0.3.0 by the approver's rulings (plan-051 ruling 1, with ruling 2's
  "no new capability"; plan-060 ruling 1), with no CHANGELOG line naming it again. A prepared row
  must carry capabilities forward, or no patch reaches the packs' ranges, since the published packs
  require `workflow-engine`;
- dl-029 T2's patch case: the approver may rule in the intake's plan that a patch starts no
  retrospective, the one started at the previous intake, or the next one, covering both windows; a
  verified patch held for that ruling would wait on a hand-run phase;
- each intake also writes spec-001 §12's example and prose and an Execution Note on dl-009
  (task-059, task-074), which task (D) of plan-065 replaces: §12's prose by `compat.yaml`'s `notes`,
  and dl-009's note per release by one last note (I5).

The bar of "verified" (plan-065 point 2, and (B)'s `format_key`) is conservative: a red check or an
advisory; a minor, a major or a backport; a CHANGELOG section missing or unreadable, or a tag not
yet published; a heading `Removed`, `Security`, `Deprecated` or containing `Breaking`; any line
naming `format`, `format:` or a kind of `compat.yaml`'s `kinds`; any `Added` or `Changed` entry
naming a command or a feature; a `format_key` the zero-warning publication run does not confirm.
Each makes the report guided. Asked by the approver on 2026-11-05: this decision is ruled before
plan-065's task (D).

## Options

- **(a) No workflow change.** The verified report only feeds today's hand-run `record`. For: nothing
  to change. Against: every patch still needs the whole intake by hand, the request's aim missed.
- **(b) `wingfoil-release-intake` v7:** a verified patch's intake applies the artifact in `record`,
  reads `recheck` from the report, has `plan-migrations` empty by the bar and `notify` as today; a
  guided report starts the intake as today, the report its input. For: one record, one workflow.
  Against: v7 grows, and it depends on the artifact being current.
- **(c) A separate patch-intake workflow.** Against: two workflows for one record, kept in step by
  hand.
- For `retrospective-start`: keep the per-intake ruling as v6 does, or make T2's patch case the
  default for a verified patch (I4).

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **I1 — Option (b), `wingfoil-release-intake` v7.** For a **verified** patch, the intake's plan
  cites the run id of the report it acts on, and claude applies the artifact on a task branch (a
  task of the intake, as task-059 and task-074): its files the allowlist's, each sha256 checked on
  apply, the lockfile never regenerated; it applies only when its base commit is `main`'s head at
  apply, or when no allowlisted file changed on `main` since, otherwise (C) is run again. Then
  claude writes the row's `notes` sentence; `recheck` cites the report's checks on the new release;
  `plan-migrations` is empty by the bar; `notify` as v6; the task branch passes its branch CI
  (dl-039); `record`'s approval by the approver and the merge stay as today. A sha256 mismatch, a
  moved base, an expired artifact, a new advisory, a red branch CI or a rehearsal report makes the
  intake guided (or the report run again). For a **guided** report, v6's phases as today, the report
  (the CHANGELOG sections as a checklist, the checks, the packs and directives each item touches)
  their input. Several missing versions: one intake per version, in ascending order, (C) preparing
  only the lowest missing version, each prepared only after the one before is merged. A verified
  report is a proposal, never a record.
- **I2 — A carry-forward for a patch, an amendment in effect of dl-021 R4** (its body stays as
  approved): a verified patch's `capabilities` are its predecessor's unless the bar flags a change
  (a `Removed`, `Deprecated` or `Breaking` heading, a `Changed` or `Added` entry naming a command or
  a feature) or a check that exercises the capability is red; a capability no check exercises
  (`pack-install`, `mcp-servers` when recorded) is carried only when the predecessor has it and the
  bar flags nothing, otherwise the report is guided. A new capability is recorded only from a
  CHANGELOG entry naming it, which makes the report guided. `reads` (from v6 `record` and spec-001
  §12, not R4) carries forward the same way, the safe direction: a format dropped for a kind a pack
  ships turns the matrix or `validate` red, and a newly accepted format is only under-stated; a kind
  no pack ships is not exercised. Task (D) amends spec-001 §12's `capabilities` bullet to read with
  I2.
- **I3 — The facts of each release in its `notes`:** spec-001 §12 points to `compat.yaml` (plan-065
  task (D)); §12's prose per release for 0.3.0 … 0.3.2 (the check dates, commands and commits) is
  kept as history in spec-001's Execution Notes, moved there by task (D), and the recorded rows'
  `notes` are not rewritten; 0.2.2's row stays as it is. The intake no longer writes an Execution
  Note on dl-009 per release from task (D) on (I5).
- **I4 — `retrospective-start` for a verified patch:** T2's patch case applies by default, with no
  ruling in the intake's plan, only while a retrospective covering the patch's window is open
  (started, not closed), for at most three patches (verified or guided) after the intake that
  started it (that intake's own release not counted) or 14 days after its close, whichever comes
  first, and never extending that retrospective's own deadline (T2's seven days when the planning
  date is not known; dl-040 D1 … D3). A guided patch counts toward the three, unless its intake
  starts a retrospective of its own, which restarts the count; a guided patch for which the approver
  rules T2's patch case counts as one. Even by default the intake's plan records T1's planning date,
  the covering retrospective, its deadline and the count reached. Past either bound, or for a guided
  report, the approver rules in the intake's plan (T2), as v6.
- **I5 — Where:** `wingfoil-release-intake` v6 → v7 (its header, `record`, `recheck`,
  `plan-migrations`, `retrospective-start`), applied by plan-065's dl actions row after its task (C)
  is done; until then a report from `intake.yml` feeds v6's hand-run `record` (option (a)'s
  behaviour). An Execution Note on dl-021 (R4 read with I2), on dl-029 (T2 read with I4) and a last
  one on dl-009 (the matrix's selection is the oldest and newest release of `compat.yaml`, so no
  note per release from task (D) on). A departure from a separate dl actions plan (plan-062's
  practice), since the change belongs with the tooling it serves.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written under plan-065 (point 4; `decision-log-ingest` › `capture`, hosted there), on
  `main` before task (D), as the plan's rulings ask.
- 2026-11-05: independent review: approve after amendments, one blocking finding (the artifact's
  base and what an apply that fails does); applied with the others: plan-051 ruling 1 cited, I2 as
  an amendment in effect of R4 with what covers a removal and an unexercised capability, `reads`'
  source and safe direction, I1's task branch, notes, approval and merge, I4's bounds (open, the
  count, a guided patch, several versions, what the plan records), §12's history and dl-009's last
  note, the options' For and Against, the Context's bar, I5's interim.
- 2026-11-05: re-review: approve; its should-fix and nits applied (I4's count of patches
  verified or guided, the several-versions rule moved to I1, dl-009's stop from task (D) on).
