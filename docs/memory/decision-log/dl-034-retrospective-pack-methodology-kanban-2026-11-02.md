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
close starts the periodic retrospective (dl-029 T1), unless the approver rules T2's patch case for
0.3.2 in the intake's plan; otherwise that retrospective closes before WingFoil's v0.4 release
planning (T2), which starts not before 2026-11-06 (WingFoil's timing as of 2026-10-28, not re-read
since).

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
  or acceptance** (§4.1); red-first on every tooling task (§2; task-071 by `npm audit` exit codes,
  `?`).
- **K4 — Findings to the approver when found** (§1, §2): every unplanned task and the bug went to the
  approver before it opened.
- **K5 — dl-030 (rules 1 … 3), dl-032 E2 … E4 (K1) and dl-033 O1 held in their first cycle** (§5);
  dl-031 held partly, its gaps in C2.

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
  before WingFoil's v0.4 release planning (which starts not before 2026-11-06); if plan-059's branch
  cannot close by 2026-11-05, task-073's merge goes to `main` on its own, on the approver's OK,
  `--no-ff`. Once the note is on `main`, a notice outside the repository names it and its commit,
  its text shown to the approver first (plan-059 point 6).
- **W2 —** No note for WF-2 (the limits count holders on every ref WingFoil sees): WingFoil's refusal
  states where it counted (§6). No note for what was seen again and is already noted: F-024, F-039
  with bug-008, F-034 and the F-037 family (§6).

### Debts

- **D1 —** The register's table of §8 is approved as a backlog. The row "`kanban`'s own `pack-cycle`
  retrospective" moves to Closed at plan-059's close; every other open row is kept with its owner and
  trigger (its item text amended only where D2 says), with the evidence §8 adds (G12, the per-pack
  WIP rule) and the flags it raises: dl-024 and dl-025, due at WingFoil v0.4's planning; `scrum`'s
  open point 1, whose trigger looks met, to be settled by the plan of WingFoil UI's feedback. Two
  questions §8 leaves to the approver, ruled with this element: G12 keeps its trigger W10, unless
  the approver sets the earlier one (the next CI step that adds runs); and the order of the next two
  plans, WingFoil UI's feedback (its row's trigger, met at plan-059's close) and WingFoil 0.3.2's
  intake (now due; the periodic retrospective it starts closes under T2's deadline, unless the
  patch case is ruled), is the approver's.
- **D2 —** New rows (P2): `kanban`'s open point 2, a holder on a second branch (owner W10, trigger
  the adoption); `kanban`'s open point 3, two releases of one version on two release lines (owner
  approver, trigger a `software` whose `release` template declares `id`, or the first
  adopter with parallel release lines); `kanban`'s charter text drift, Ships and Acceptance naming
  the composer's warning (owner approver, trigger the next retrospective); open point 4 named in
  `scrum`'s open point 2 row.
- **D3 —** One row added at plan-059's close: the dl actions of dl-035 … dl-037 (owner approver,
  trigger the approval of each, a rejected one dropping out; Source dl-034 D3), with the one bump of
  `repository-practice` that dl-035 and dl-036 share. The rows that plan's own elements leave are
  theirs (rule 4).

### Observed, no change proposed

- **N1 —** GOV-3 (§4.2): the order of a tooling task found inside a pack plan took a ruling each
  time, the three rulings not alike (ruling 6 required by dl-019, ruling 7 a choice between real
  options, ruling 8 an order). The adoption (W10) does not fix it; the approver chose at the
  checkpoint to observe it, with no decision-log (P3).
- **N2 —** GOV-8 (§4.3), a lesson: a defect of the tooling is described by the command and the
  output that show it, its cause named only once located; a claim that a site is "the only" one is
  checked by a sweep of the call sites before a fix is scoped.
- **N3 —** Three slips of scripts that drove the runs by hand (§4.5): evidence for the row of the
  scripted full runs, not a change.
- **N4 —** `main` red for about one day (§4.4), reported and ruled the same day; six cancelled runs,
  each superseded by a `success` (rule 3 foresees it); five successful runs read but cited by no
  element (§4.4, `?`).
- **N5 —** Smaller points with no change (§7, "Not changes"): dl-019 cited by analogy for a charter's
  findings (§1, `?`); task-071's red-first by `npm audit` exit codes (§2, `?`); the tooling WIP limit
  exceeded by hand, as evidence on the per-pack WIP row (D1).

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-02: written under plan-059 (`capture`), from the inventory and the approver's points
  P1 … P3.
- 2026-11-02: independent review: request changes, one blocking finding (D3 left the dl actions
  plan with no row, against rule 4); five should-fix (N1's claim and W10 reading, dl-029's
  exception and deadline, W1's fallback and notice, D1's two questions for the approver, the
  inventory's "Not changes"), six nits (D1's wording, D2's glosses, W2's notes seen again, K5's
  dl-032, the timing's date, dl-036's count); all applied. A re-review follows (D1 and D3 changed).
- 2026-11-02: re-review: approve after amendments, nothing blocking; applied: W1's date read the
  right way, D3's row covering each of dl-035 … dl-037 until its approval, "to be settled", T2's
  deadline on the periodic retrospective, not on the intake.
