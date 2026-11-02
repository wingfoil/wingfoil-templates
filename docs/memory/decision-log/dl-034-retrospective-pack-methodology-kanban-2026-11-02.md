---
id: dl-034-retrospective-pack-methodology-kanban-2026-11-02
type: decision-log
title: "Retrospective pack-methodology-kanban 2026-11-02"
status: draft
tags: ["process","retrospective","kanban"]
---

## Context

The `retrospective` phase of `pack-cycle` (v6) for `pack-methodology-kanban`, whose cycle ran alone:
`charter` (plan-056), `author` (plan-057), `first-release` and `activate` (plan-058). It runs under
plan-059, asked by the approver on 2026-11-02. It is not the periodic retrospective (plan-058
ruling 5): that one stays at dl-029's trigger.

Its data is the friction inventory
`docs/retrospectives/2026-11-02-pack-methodology-kanban-friction-inventory.md` (phase `explore`,
`46254d0`, amended after two independent reviews of its citations in `d10714a`). At the
`additional-points` checkpoint the approver added P1 … P3 (`071e27c`): a feedback note for WF-1,
the three candidate rows of the register, and the reading of the governance candidates. Section and
point numbers below (§1 … §9, WF-1, WF-2, GOV-1 … GOV-8, P1 … P3) are the inventory's.

WingFoil 0.3.2 was published on 2026-11-02, after the period (§5): its intake is now due, and its
close starts the periodic retrospective (dl-029 T1). WingFoil's v0.4 release planning starts not
before 2026-11-06 (WingFoil's timing as of 2026-10-28).

## Options

A retrospective records what to keep and what to change; it has no alternatives of its own. Each
change of governance is a decision-log with its options, under `decision-log-ingest` until this
repository adopts `base` (dl-006 R2 as amended by dl-022). A WingFoil-side point is a feedback
note, not a decision.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.
Each change of governance takes effect only when its own decision-log is approved.

### Keep

- **K1 — The run on the engine before a charter's acceptance (dl-032 E2)** (§1): it settled
  `delivery`'s shape, the task's link to its release and the limits, found the `{release.id}` scope
  token, the reject past a full limit and the over-wide `releases` filter, all before acceptance;
  task-069's run (E4) then changed nothing.
- **K2 — The publication rehearsal on a scratch clone before `prepare`** (§3), and the evidence
  chain of prel-006: one digest from rehearsal to publication, CB-6 live.
- **K3 — Reviews, re-reviews after a fix that changes a decision, every blocking finding before code
  or acceptance** (§4.1); red-first on every tooling task (§2).
- **K4 — Findings to the approver when found** (§1, §2): every unplanned task and the bug went to the
  approver before it opened.
- **K5 — dl-030 (rules 1 … 3) and dl-033 O1 held in their first cycle** (§5); dl-031 held partly,
  its gaps in C2.

### Change: governance, each by its own decision-log

- **C1 — dl-035** (GOV-1): an advisory that reaches only a development dependency of the root
  lockfile gives a visible warning and a bug opened within a day; the audit gate stays blocking on
  the runtime dependencies and on every matrix lockfile (§4.4).
- **C2 — dl-036** (GOV-2, GOV-4, GOV-7): `repository-practice` 1.2: "the next retrospective" is the
  next periodic one; rule 4's three gaps (a ruling's row, a reopened row, a row asked by the approver
  outside any element); the recipients of an outgoing notice named by project (§4.3, §5, §8).
- **C3 — dl-037** (GOV-5, GOV-6): a run's findings reach a charter before it is accepted; what a run
  by hand records as evidence (§4.5).

### Change: WingFoil-side points, as feedback notes

- **W1 —** F-042, a `request`: should `memory reject` warn when it leaves a state over its `limits`
  (WF-1, P1)? Written by task-073, hosted by plan-059 (the inbox test requires a note's first line to
  name a task or a pack-release), reproduced with WingFoil alone on 0.3.0 and 0.3.1, on `main`
  before WingFoil's v0.4 release planning.
- **W2 —** No note for WF-2 (the limits count holders on every ref WingFoil sees): WingFoil's refusal
  states where it counted (§6).

### Debts

- **D1 —** The register's table of §8 is approved as a backlog: every open row kept with its owner
  and trigger, with the evidence §8 adds (G12, the per-pack WIP rule) and the flags it raises (dl-024
  and dl-025, due at WingFoil v0.4's planning; WingFoil UI's feedback, the next plan, beside
  WingFoil 0.3.2's intake, now due; `scrum`'s open point 1, whose trigger looks met). The row
  "`kanban`'s own `pack-cycle` retrospective" moves to Closed at plan-059's close.
- **D2 —** New rows (P2): `kanban`'s open point 2 (owner W10, trigger the adoption); `kanban`'s open
  point 3 (owner approver, trigger a `software` whose `release` template declares `id`, or the first
  adopter with parallel release lines); `kanban`'s charter text drift, Ships and Acceptance naming
  the composer's warning (owner approver, trigger the next retrospective); open point 4 named in
  `scrum`'s open point 2 row.
- **D3 —** Rows the governance decision-logs leave for their dl actions plan are written by that
  plan's elements, not here.

### Observed, no change proposed

- **N1 —** GOV-3 (§4.2): the order of a tooling task found inside a pack plan took a ruling each
  time; the cost was one message per ruling, and the adoption (W10) changes the flow.
- **N2 —** GOV-8 (§4.3), a lesson: a defect of the tooling is described by the command and the
  output that show it, its cause named only once located; a claim that a site is "the only" one is
  checked by a sweep of the call sites before a fix is scoped.
- **N3 —** Three slips of scripts that drove the runs by hand (§4.5): evidence for the row of the
  scripted full runs, not a change.
- **N4 —** `main` red for about one day (§4.4), reported and ruled the same day; six cancelled runs,
  each superseded by a `success` (rule 3 foresees it).

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-02: written under plan-059 (`capture`), from the inventory and the approver's points
  P1 … P3.
