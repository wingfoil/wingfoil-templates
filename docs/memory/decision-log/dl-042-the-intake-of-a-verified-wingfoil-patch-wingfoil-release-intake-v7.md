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
`retrospective-start`) is run by hand today, and two of its rules shape what an automatic path can
do:

- dl-021 R4: a release is recorded as providing a capability "only when its CHANGELOG names the
  feature or command behind it". 0.3.1 and 0.3.2 carried `workflow-engine` forward from 0.3.0, each
  by the approver's ruling (plan-051 ruling 2, plan-060 ruling 1), with no CHANGELOG line naming it
  again. A prepared row must carry capabilities forward, or no patch is ever verified;
- dl-029 T2's patch case: the approver may rule in the intake's plan that a patch starts no
  retrospective, the one started at the previous intake, or the next one, covering both windows; a
  verified patch held for that ruling would wait on a hand-run phase.
- Each intake also writes spec-001 §12's example and prose and an Execution Note on dl-009
  (task-059, task-074), which task (D) of plan-065 replaces by `compat.yaml`'s `notes`.

The bar of "verified" (plan-065 point 2) is conservative: a red check or an advisory; a minor, a
major or a backport; a CHANGELOG section missing or unreadable; a heading `Removed`, `Security`,
`Deprecated` or containing `Breaking`; any line naming `format`, `format:` or a kind; any `Added` or
`Changed` entry naming a command or a feature, each makes the report guided. Asked by the approver
on 2026-11-05: this decision is ruled before plan-065's task (D).

## Options

- **(a) No workflow change.** The verified report only feeds today's hand-run `record`. Against:
  every patch still needs the whole intake by hand, the request's aim missed.
- **(b) `wingfoil-release-intake` v7:** a verified patch's intake applies the artifact in `record`,
  reads `recheck` from the report, has `plan-migrations` empty by the bar and `notify` as today; a
  guided report starts the intake as today, the report its input.
- **(c) A separate patch-intake workflow.** Against: two workflows for one record, kept in step by
  hand.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **I1 — Option (b), `wingfoil-release-intake` v7.** For a **verified** patch: `record` applies the
  artifact of the verify run as it is (its files the allowlist's, each sha256 checked on apply, the
  lockfile never regenerated), then writes the row's `notes` sentence by hand; `recheck` cites the
  report's checks on the new release; `plan-migrations` is empty by the bar; `notify` as v6. For a
  **guided** report, v6's phases as today, the report (the CHANGELOG sections as a checklist, the
  checks, the packs and directives each item touches) their input. The intake's plan cites the run
  id of the report it acts on.
- **I2 — dl-021 R4 read as a carry-forward:** a release's `capabilities` are its predecessor's
  unless its CHANGELOG removes the feature or command behind one (a `Removed` heading, which makes
  the report guided); a new capability is recorded only from a CHANGELOG entry naming it, an `Added`
  entry, which makes the report guided too. `reads` carries forward likewise, a format change being
  guided by the bar.
- **I3 — The facts of each release in its `notes`:** spec-001 §12 points to `compat.yaml` (plan-065
  task (D)); the intake no longer writes an Execution Note on dl-009 for each release (task-059's
  and task-074's practice ends with v7); 0.2.2's row stays as it is.
- **I4 — `retrospective-start` for a verified patch:** T2's patch case applies by default, no ruling
  needed in the intake's plan, only while a retrospective covering the patch's window is open or
  due, for at most three verified patches or 14 days after the intake that started it, whichever
  comes first, and never extending that retrospective's own deadline (T2's seven days when the
  planning date is not known; dl-040 D1 … D3). Past either bound, or for a guided report, v6's rule:
  the intake's plan records the retrospective and its deadline.
- **I5 — Where:** `wingfoil-release-intake` v6 → v7 (its header, `record`, `recheck`,
  `plan-migrations`, `retrospective-start`), applied by plan-065's dl actions row after plan-065's
  tasks (C) is done; an Execution Note on dl-021 (R4 read with I2) and on dl-029 (T2 read with I4);
  a departure from a separate dl actions plan (plan-062's practice), since the change belongs with
  the tooling it serves.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written under plan-065 (point 4; `decision-log-ingest` › `capture`, hosted there), on
  `main` before task (D), as the plan's rulings ask.
