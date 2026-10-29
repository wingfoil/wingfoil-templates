---
id: dl-028-retrospective-periodic-2026-10-28
type: decision-log
title: "Retrospective periodic 2026-10-28"
status: draft
tags: ["process","retrospective"]
---

## Context

The retrospective of `pack-cycle` for the three pack cycles that reached a first release (`base`,
`software`, `methodology/scrum`), run once for the three after their activation (dl-006's notes of
plan-044 and plan-052), and also the periodic retrospective of dl-006 R3 for the period from
2026-10-12 (plan-025 closed) to 2026-10-28 (plan-053 closed). It runs under plan-054, asked by the
approver on 2026-10-28.

Its data is the friction inventory `docs/retrospectives/2026-10-28-periodic-friction-inventory.md`
(phase `explore`, `de025fa`, amended after two independent reviews of its citations in `bfd8a9c`).
At the `additional-points` checkpoint the approver added P1–P3 (`e1f54c8`): read the candidate
changes against this repository's adoption of the packs and its WingFoil pin at 0.3.1 (W10), and
keep as decision-logs now only those the adoption would not fix. Section and point numbers below
(§1 … §9, G1 … G12, P1 … P3) are the inventory's.

dl-006 R3 asks that the WingFoil-side points reach the feedback inbox before WingFoil's release
planning; WingFoil's v0.4 planning starts not before 2026-11-06.

## Options

A retrospective records what to keep and what to change; it has no alternatives of its own. Each
change of governance is a decision-log with its options, under `decision-log-ingest` until this
repository adopts `base` (dl-006 R2 as amended by dl-022). A WingFoil defect or gap is a feedback
note, not a decision.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.
Each change of governance takes effect only when its own decision-log is approved.

### Keep

- **K1 — Independent reviews, re-reviews after a fix, amendment while `pending`** (§4.1): no
  rejection and no revert in the period; reviews caught design defects before code and before
  publication.
- **K2 — Running a method on the real engine before and during authoring** (§3): plan-047's runs and
  task-057's full run found dl-026, dl-027, bug-005, bug-006 and two charter errors after its
  reviews.
- **K3 — The guards that followed each escape:** `check:runs` (task-053, task-058), the adoption run
  of `init` (task-060), the publication rehearsal in a scratch clone (plan-052 step 3) (§1 … §3).
- **K4 — The publication mechanics:** dry run, atomic push of tag and `main`, CI on both, the live
  CB-6 check, evidence redone after each review (prel-002 … prel-005) (§1).
- **K5 — Rulings given with the outline, and every deviation recorded in its plan** (§3, §9).
- **K6 — Intakes closed within two days of a WingFoil release; advisories fixed within a day**
  (§4.5, §4.6).
- **K7 — dl-016's keep and change mostly held** (§5): K3, K4, K5, K6, K7, C3 and C4 held; K1, K2, C1
  and C2 held partly, their gaps recorded below (N1); A1 held in letter and broke in effect: the
  inbox was never synced (C1, §4.7).

### Change: governance, each by its own decision-log

- **C1 — dl-029** (G1): the periodic retrospective starts at the close of every
  `wingfoil-release-intake`, closed before WingFoil's next release planning (§4.6). R3 was missed
  once, between 0.3.0 and 0.3.1, and nothing would have caught it. The inbox sync is not tied to the
  intake: it stays with rule 7 until W10 (dl-029 T4).
- **C2 — dl-030** (G3 with G5): a request's origin in repository texts, the privacy check of every
  commit and the reading of `main`'s CI after every push, in one directive read by every role
  (§4.5; asked by the approver on 2026-10-28).
- **C3 — dl-031** (G2, owed items only): one register of owed items with owner and trigger (§8;
  two items fell out of every closing list). Number reservations need no register once the pin is
  0.3.x (§4.4).
- **C4 — dl-032** (G4 with G10): a run on the real engine before a workflow-bearing charter is
  accepted and before a pack is published (§1 … §3).
- **C5 — dl-033** (G6): `pack-cycle` activates a pack at its first tag and runs its retrospective
  after, as all three cycles did (§4.3).

### Change: WingFoil-side points, as feedback notes

- **W1 —** Written by task-064, hosted by plan-054 (the inbox test requires a note's first line to
  name a task or a pack-release), numbered contiguously from F-038, each reproduced with WingFoil
  alone on 0.3.0 and 0.3.1:
  - F-038 — `workflow start` fills a plan's `workflow` and `phase` only from tokens of the type's
    `id_pattern` or `path` (`request`; plan-049, bug-005);
  - F-039 — under an iterated sub, a closed iteration's step is deduced again by a `where` with no
    relation to the scope (`request`; bug-008 option (iii), plan-052 ruling 2);
  - F-040 — a directory in `produces` without a trailing `/` is never satisfied, with no diagnostic
    (`gap`; bug-006);
  - F-041 — a phase role that no member or agent holds is accepted (`gap`; plan-051, plan-052
    ruling 5).
- **W2 —** The three `?` rows of §6 (a candidate leaving the `where` before any phase completes; the
  `{sprint.id}` warning; 0.3.1 refusing what 0.3.0 accepted with `base` alone) become notes only if
  task-064's reproduction shows a defect and not a documented behaviour; otherwise its Execution
  Notes say why not.
- **W3 —** No note for W-14: WingFoil 0.3.0 and 0.3.1 number after the highest id and do not reuse a
  number taken on another branch (§4.4); the entry retires at the pin bump. No note for `init`'s
  `custom/` workflows colliding with the packs': F-007 covers it.
- **W4 —** task-064 is `done` and on `main` before 2026-11-06 (dl-006 R3).

### Debts

- **D1 —** The table of §8, with the rows added by P2, is approved as a backlog: each row keeps its
  owner and trigger, and goes into dl-031's register when that is approved. The rows P2 adds, owner
  W10 and trigger "W10": G7 (in-place amendment: the `pack` type `amendable`, the rulings held in
  plans, a rule on amend versus note), G8 (dl-017 R2 for documents and configuration), G9 (the
  inbox's first line and reserved gaps), G12 (the suite's duration), and G11 (a fixed bug's terminal
  state), fixed by `software`'s `bug` type at the adoption. Two more rows, owner none (the approver,
  dl-031 R1): a check of the CHANGELOG's first line, the tag annotation, caught by review twice (§1;
  trigger: the next `publish:pack` change); and whether a version known to fail its runs needs a
  \"known defects\" marker in `catalog.yaml` (§1, open; trigger: the next retrospective).
- **D2 —** P3's two risks go to the adoption's plan: this repository's custom `sw-life-cycle` shares
  its name with `software`'s, and `software`'s `tech-lead` needs a holder in this repository's DNA.
  Until that plan exists, they are rows of D1 (owner W10, trigger the adoption).

### Observed, no change proposed

- **N1 —** Partial holds of dl-016 (§5): two plans without a plan-level review (plan-031,
  plan-034), red runs not on a commit (task-027, task-028, task-030), a notes task with no red step
  (task-041). Each is a slip of an existing rule, not a gap in it.
- **N2 —** The F-032/F-034 slip in plan-051 and plan-052 (§2): new texts cite F-034; approved text
  is not rewritten.
- **N3 —** Parallel lines clashing on one worktree's `dist/` (§4.4): a worktree per line of work, as
  plan-034 did. CI runs cancelled by the other line's pushes: observed, no remedy beyond reading the
  run that includes the push (dl-030 P3).
- **N4 —** Fixed by the adoption (P1): W-14, G11, W-02 for plans if the repository takes
  `{workflow}-{phase}-plan`, the dl actions plans (`governance-evolution`); G7 partly (D1).
- **N5 —** Smaller points with no change: work landing directly on `main` with no decision recording
  it (§4.5, `?`), the empty Execution Notes of dl-016 … dl-020 (§4.8), line-wrap commits (§4.1).

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`), from the inventory and the approver's points
  P1–P3.
- 2026-10-29: independent review: approve after amendments, nothing blocking; applied: A1 and the
  inbox sync in K7 and C1, N3 limited to `dist/`, the tag-annotation check and the "known defects"
  question as D1 rows, the adoption's fixes as N4, the minor points as N5, citations of K2, K4, K5,
  D1's owner and D2's holder.
