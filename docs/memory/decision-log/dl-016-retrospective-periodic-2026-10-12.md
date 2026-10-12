---
id: dl-016-retrospective-periodic-2026-10-12
type: decision-log
title: "Retrospective periodic 2026-10-12"
status: draft
tags: ["process","retrospective"]
---

## Context

The first periodic retrospective of this repository (`retrospective-periodic` › `retrospective`,
dl-006 R1, R3), run under plan-025 on 2026-10-12. It closes milestone M1 "Tooling": waves W5, W6,
W7 (plan-015) and W14 (plan-024), from 2026-10-06 to 2026-10-12.

Its data is the friction inventory `docs/retrospectives/2026-10-12-periodic-friction-inventory.md`
(phase `explore`, `62616d4`, amended after its independent review in `dfeb614`). The approver added
no point at the `additional-points` checkpoint. Section numbers below (§1 … §10) are the
inventory's.

dl-006 R3 asks that the WingFoil-side points reach the feedback inbox before WingFoil's release
planning. WingFoil v0.3 is expected on npm around 2026-10-20, and its retrospective reads this
repository's inbox (`svc-018`).

## Options

A retrospective records what to keep and what to change; it has no alternatives of its own. Each
change of process is a decision-log with its options (dl-017 … dl-020). A WingFoil defect or gap is
a feedback note, not a decision (dl-006 R2).

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.
Each change of process takes effect only when its own decision-log is approved.

### Keep

- **K1 — Independent reviews before every gate**, and amending while `pending` instead of
  rejecting (§1): they found blocking defects the tests had missed, and no element was rejected.
- **K2 — Red runs recorded with their failure count** (§2), and mutation testing in build reviews
  (§1).
- **K3 — Every deviation, mid-course ruling and erratum written into the element that needed it**,
  with its date (§3, §4).
- **K4 — The real CI run of the pushed branch read and recorded with its conclusion before a
  gate**, a practice adopted after task-014's misreported run (§6).
- **K5 — Acceptance re-run from a clean clone on the current Node and on the floor 22.12.0** (§6).
- **K6 — One merge discipline:** a branch per unit of work, the approver's OK, `--no-ff` merge,
  push, branch removed; separate worktrees for parallel capture work (§5, §10).
- **K7 — The feedback loop with WingFoil**: notes reproduced with WingFoil alone, in WingFoil's
  format and citation (§7).

### Change: process, each through its own decision-log

- **C1 — dl-017:** every element this repository creates is reviewed independently, and a build
  fix that changes behaviour, a test or an Acceptance command is re-reviewed (§1).
- **C2 — dl-018:** red first by default, characterization tests only for named kinds of work and
  checked by mutation, a task too large for red-first split at design (§2).
- **C3 — dl-019:** an Acceptance criterion found unsatisfiable during the build goes to the approver
  when it is found, not to the build review afterwards (§3).
- **C4 — dl-020:** the errata of an approved specification are listed at wave close and folded back
  before the next wave that builds on it (§4).

### Change: WingFoil-side points, as feedback notes

- **W1 —** Five new notes, each reproduced with WingFoil 0.2.2 alone, written by task-026 (hosted
  by plan-025; the inbox's rule that a new note names the task it comes from):
  - F-022 — `memory submit` commits uncommitted body edits in its transition commit (W-04);
  - F-023 — the `submit` commit subject does not name the transition (W-05);
  - F-024 — the illegal-transition error does not name the expected verb or state (W-06);
  - F-025 — no verb leaves a `waiting` state except `deprecate` (W-07; dl-003 D3);
  - F-026 — a phase has one role, so the role cannot depend on the element (bug-001; a new entry
    W-13 in `wingfoil-cli`).
- **W2 —** The same task fixes two notes before WingFoil reads them: the truncated ledger title of
  F-012, and an output block for F-018's evidence (WingFoil dl-163 R4).
- **W3 —** task-026 is merged and pushed to `main` before 2026-10-20 (dl-006 R3).

### Change: this repository's configuration, as actions

- **A1 —** `wingfoil-cli` rule 7 names `wingfoil-sync` and `release-planning`, which no workflow of
  this repository defines (§7); the inbox README still says "Last sync: none". The rule is reworded
  to name where this repository syncs (for example `wingfoil-release-intake` and every pin bump)
  and what a sync does. Applied through its own element.
- **A2 —** The configuration changes of dl-017 … dl-020, once approved, applied through one
  configuration-actions plan.

### Observed, no change proposed

- **N1 —** Plans that drift from their own text (plan-015's superseded wording, plan-020's title):
  the Execution Notes record the drift, which is enough (§5).
- **N2 —** The id collision between parallel sessions (plan-022, §5): it happened once, and the
  worktree practice (K6) already avoids it.
- **N3 —** About 12–15 commits per task (§1): mostly the hand body commits and the `submit`s of
  W-04 and W-05, now reported to WingFoil (F-022, F-023).
- **N4 —** The GitHub Pages confirmation first made on the wrong repository, relayed by the
  approver: no element records it (§6); no action.

### Outside this retrospective

- **O1 —** The three divergences between this repository and WingFoil's plans (§8: base packs
  bundled in WingFoil's npm package; `wingfoil stage set`; dl-138's `remote` asset class against
  dl-003; also `wingfoil capabilities`) are mapped, not decided. Their decision-log is separate
  work, opened by the approver. It touches `base` (dl-003 D7, its install folder), so it is
  relevant before W8's charter.
- **O2 —** The debts carried past M1 (§9) stay with their owners or with the approver: `base`'s
  charter lists CB-6; `base`'s examples at W10; the spec-002 amendment (C4 covers the rule, not
  this amendment); the `0.x` clauses and bug-001's `deliver`/`author` slip (plan-018); the
  `LICENSE` file.

## Execution Notes
