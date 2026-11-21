---
id: dl-043-retrospective-pack-governance-feedback-2026-11-21
type: decision-log
title: "Retrospective pack-governance-feedback 2026-11-21"
status: draft
tags: ["process","retrospective","feedback"]
---

## Context

The `retrospective` phase of `pack-cycle` (v7) for `pack-governance-feedback`, whose cycle ran
alone: `charter` (plan-073), `design` (plan-074, spec-003), the tooling before `author` (plan-075),
`author` (plan-076), `first-release` and `activate` (plan-077). It runs under plan-078, asked by the
approver on 2026-11-19. It is not the periodic retrospective (plan-077 ruling 10): dl-029's trigger
has not come since 2026-11-04, and W10's stays at the end of the wave.

Its data is the friction inventory
`docs/retrospectives/2026-11-21-pack-governance-feedback-friction-inventory.md` (phase `explore`,
`d52fb173`, amended after an independent review of its citations in `47464429` and `1c56a16e`).
At the `additional-points` checkpoint the approver added P1 … P3 (`930d685d`): every
*(unrecorded)* candidate confirmed; GOV-1 … GOV-4 and WF-1 kept; no workflow ingests a new pack,
kept as GOV-6. Section and point numbers below (§1 … §9, WF-1 … WF-3, GOV-1 … GOV-6, P1 … P3) are
the inventory's.

## Options

A retrospective records what to keep and what to change; it has no alternatives of its own. Each
change of governance is a decision-log with its options, under `decision-log-ingest` until this
repository adopts `base` (dl-006 R2 as amended by dl-022). A WingFoil-side point is a feedback
note, not a decision.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.
Each change of governance takes effect only when its own decision-log is approved.

### Keep

- **K1 — The run on the engine before a charter's acceptance (dl-032 E2)** (§1): it settled the
  shape (required fields at `submit`, `where` as inclusion lists, the `bug` route's ownership) and
  found F-048 and F-049 before acceptance.
- **K2 — A `design` phase with its tech-spec before any task** (§2): spec-003 answered the
  charter's five Open points with no erratum, its probes giving the evidence of its rules.
- **K3 — Reviews before every gate, red first on every task with code, dl-039's order** (§3, §4,
  §5.1): ten of the cycle's twelve blockers found on text before code, two in a build review
  before the merge; no CI job over 25 minutes.
- **K4 — The publication rehearsal in a scratch clone before `prepare`** (§4): the first format-2
  manifest published with no break, one digest from the outline's dry run to the publication.
- **K5 — Findings to the approver when found** (§1 … §4), and ruling 7 applied with nothing run on
  the approver's behalf within its scope (§4).

### Change: governance, each by its own decision-log

- **C1 — dl-044** (GOV-1): `publish:pack` writes its report to a file the agent reads into the
  Publication; the agent pushes the approval commit (§4, §5.4).
- **C2 — dl-045** (GOV-2): `tooling-delivery` and `kanban-delivery` › `deliver` run a check the
  task names on `main` after the merge, before the close and `done` (§4).
- **C3 — dl-046** (GOV-3): the 100-character rule written in `repository-practice` and checked on
  the lines a change adds by a script, in CI and before a commit (§4, §5.3).
- **C4 — dl-047** (GOV-4): every review leaves its verdict, counts and what was applied in the
  element's notes; a claim found false is corrected by a note (§3, §5.1, §5.2).
- **C5 — dl-048** (GOV-6, P3): the path from a pack proposal to its charter written down, or a
  `pack-ingest` workflow, as the approver rules there.

### Change: WingFoil-side points, as feedback notes

- **W1 —** F-052, a `request`: should `workflow list` or `directives list` warn on a directive that
  no role binds and no step names (WF-1, P2)? Written by task-101, hosted by plan-078, reproduced
  with WingFoil alone on 0.3.0 and 0.3.2; it settles the row "A `custom/` directive no role binds".
  WingFoil's v0.4 release planning started on 2026-11-03 (dl-040) and no source records it closed:
  task-101's merge goes to `main` on its own, ahead of plan-078's branch, on the approver's OK,
  `--no-ff`. No notice (plan-078 ruling 6).
- **W2 —** No note for WF-2 (`base`'s gap, its row kept) or WF-3 (a second `submit` moves a plan
  forward by design; checked again at the pin bump). No note for what was seen again: W-02 (§6).

### Debts

- **D1 —** The register's table of §8 is approved as a backlog: the ten rows the cycle touched with
  their proposals; the row of this pack's retrospective moves to Closed at plan-078's close; the 44
  rows not touched kept with their owners and triggers.
- **D2 —** New rows: the charter text drift of `governance/feedback` (Compatibility's format 1,
  FA-5's parenthesis; owner W10, trigger G7); the placement scanner's known limit (a continuation
  line beginning with a quote, `[` or `{`; owner claude, trigger the next tooling task on the lint's
  scanner).
- **D3 —** One row added at plan-078's close: the dl actions of dl-044 … dl-048 (owner approver,
  trigger the approval of each, a rejected one dropping out; Source dl-043 D3), with one bump of
  `repository-practice` shared by dl-046 and dl-047.

### Observed, no change proposed

- **N1 —** GOV-5 (§1): six reviews missed the charter's format against spec-001 §5; one case, its
  text drift in D2.
- **N2 —** Slips of the work, confirmed by the approver (P1): a red commit amended before its push;
  claims corrected by a final check; `workflow list` with an option it lacks; the golden step in
  the wrong mode; a chained CI watch whose failure skipped the push after it; the floor Node.js
  found only in a local cache. C3 and C4 take the record and the check; the rest are evidence, not
  a change.
- **N3 —** A gendered pronoun for the approver in earlier texts (§4): new texts write "the
  approver"; the texts on `main` stay as written, the row's wording revisited when it next changes.
- **N4 —** Ruling 7's costs (§5.4): two more approver turns and commits waiting for the approver's
  push; C1 takes the record, the turns stay the rule's price.
- **N5 —** FA-6 is scripted in part (§3): `duplicate` and the governance route by the run by hand,
  as ruled at plan-076's close.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-21: written under plan-078 (`capture`), from the inventory and the approver's points
  P1 … P3.
