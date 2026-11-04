---
id: dl-038-retrospective-periodic-2026-11-04
type: decision-log
title: "Retrospective periodic 2026-11-04"
status: draft
tags: ["process","retrospective","periodic"]
---

## Context

The periodic retrospective (dl-006 R3) that WingFoil 0.3.2's intake (plan-060) started at its
close (dl-029 T1), run under plan-061 (`retrospective-periodic` v2, `retrospective` v5). Period:
2026-10-29 (plan-054's close, `f478934`) → 2026-11-04 (plan-060's close, `f01e53f`). Its
inventory is `docs/retrospectives/2026-11-04-periodic-friction-inventory.md`; the `kanban` cycle
inside the period is cited from the inventory of 2026-11-02 (dl-034), not mined again. The
approver's points at the checkpoint are the inventory's §11 (P1 … P3). Until this repository
adopts `base` (W10), a change of governance is ruled by its own decision-log (dl-006 R2 as amended
by dl-022), applied by a dl actions plan.

## Options

For each point: keep what held, change what did not (a change of governance only when the
adoption, W10, would not fix it: plan-054's P1, dl-028 N4), or observe with no change.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.
Each change of governance takes effect only when its own decision-log is approved.

### Keep

- **K1 — The intake's checks on the real engine** (inventory §1): task-074's check of 0.3.2 found
  bug-010, a latent defect of the matrix, before the record merged; the recheck matched plan-051's.
- **K2 — Every element reviewed, and a re-review when a fix changes a decision** (§2): the
  reviews found what the builder missed (task-074's install-failure test, `init`'s git identity,
  the scratch run's golden tree).
- **K3 — dl-019 the same day** (§1): bug-010 to the approver within minutes, ruled, fixed and
  merged the same day.
- **K4 — dl-029's `retrospective-start`** ran as written the first time (§1); **dl-030 rules 1 and
  2** and **dl-031's register** held (§3); the rules of 2026-11-02 were followed before they were
  applied (§4).

### Change: governance, each by its own decision-log

- **C1 — dl-039** (GOV-1 with GOV-2, P1): a tooling task's checks run on the branch CI, with a
  short local list, in the approver's order of 2026-11-03; G12's row ruled with it (§2, §5, §7).
- **C2 — dl-040** (GOV-3, P1): the intake's retrospective deadline when WingFoil's release planning
  starts before the intake closes (§1, §7).
- **C3 — GOV-4, no decision-log of its own** (P1): `repository-practice` rule 3 gains a sentence on
  a plan's close (the run of the last push, the note and `active → done`, is read by the next plan,
  which cites it), in the 1.2 bump of dl-035 A4 and dl-036 R6 (§3, §7).

### Change: WingFoil-side points

- **W1 —** No feedback note (§6, P3): F-038 … F-042 unchanged by 0.3.2; no task-076. F-019 gains
  facts for the first sync (a tool needs the built-in files, per release, through `init`), a row
  of `docs/owed-items.md` (D2).

### Debts

- **D1 —** The register's table (inventory §8) as P2 rules it is approved as a backlog: row 5 placed
  after the dl actions plan of row 16 and before WingFoil UI's feedback; row 12 dropped; row 22
  assigned to the pin bump (W10); row 40 to the next minor release of `base` and `software`; rows
  17, 20 and 24 to the owner W10; row 23 merged into G7 and row 25 into row 41 (both to Closed);
  rows 10 and 39 ruled with C1 and C2 (each moves to Closed when its decision-log is applied); every
  other row as §8 proposes.
- **D2 —** New rows: dl-030's missing "actions applied" note (owner approver, in the dl actions
  plan of row 16); the built-in ids each release's `init` writes compared with
  `src/wingfoil-builtins.ts` (W-11's copy) by the matrix (owner approver, trigger the next tooling
  task on `src/matrix.ts`); F-019's facts from bug-010 at the first sync (owner W10, trigger the
  first sync). The clean clones' durations need no row: C1 records the branch CI's instead.
- **D3 —** Row 16's dl actions plan also applies dl-039 and dl-040 (if approved), C3's sentence,
  dl-026's note (row 42) and dl-030's note (D2).

### Observed, no change proposed

- **N1 —** plan-022 stayed `active` fourteen days after its condition was met, its close bundled
  in one row with dl-024's and dl-025's ruling (§3).
- **N2 —** A lesson: a scratch run that adds a release edits every `compat.yaml` a validation
  reads (the golden tree reads its own), or runs the real commands on the committed change (§1).
- **N3 —** `main`'s runs cancelled by a later push, each superseded by a `success`, as rule 3
  foresees; several runs read and cited by no element (§3; dl-034 N4 again).

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-04: written under plan-061 (`capture`), with the inventory's §11.
