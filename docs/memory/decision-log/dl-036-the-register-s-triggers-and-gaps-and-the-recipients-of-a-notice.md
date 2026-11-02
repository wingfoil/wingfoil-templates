---
id: dl-036-the-register-s-triggers-and-gaps-and-the-recipients-of-a-notice
type: decision-log
title: "The register's triggers and gaps and the recipients of a notice"
status: approved
tags: ["process","backlog","privacy"]
---

## Context

`repository-practice` 1.1 (dl-030, dl-031) ran its first full cycle with `methodology/kanban`
(plan-056 … plan-058). The retrospective dl-034 found four gaps of rule 4 and one of rule 2 (the
inventory of 2026-11-02, §4.3, §5, §8):

1. **"The next retrospective."** dl-031 R1 makes it the default trigger of a row with none; ten
   open rows carry it. plan-058 ruling 5 made `kanban`'s the first pack retrospective not held as
   the periodic one, and the rule does not say which of the two the trigger names. plan-059 ruling 4
   kept the ten rows, their triggers unchanged, until this candidate is ruled (GOV-2).
2. **A row left by a ruling** is added "in the same commit as the note that leaves the item" (rule
   4), but rulings are recorded in a plan's rulings section, not always in a note: plan-058 ruling 5's
   row was added only at the close (`d319cb3`), asked by the close review, and plan-057 ruling 5's
   widening at the close (`d311722`) (GOV-4).
3. **A closed row whose item reopens.** task-066 closed the warning's row; plan-057 ruling 6 found a
   second site, and the row was rewritten on task-070's branch (`2592c6a`), reaching `main` at its
   merge (`50b9af9`): for about a day `main`'s register showed as settled an item that was open again.
   Rule 4 has no case for it (GOV-4).
4. **A row asked by the approver outside any element.** `0162c90` added WingFoil UI's feedback row
   after plan-058's close and before plan-059 existed; its Source names no element, and no note
   cited it until plan-059's Context. dl-031 R1 asks for a source as element and section (GOV-4).

And one gap of rule 2: plan-058 describes the two recipients of its notices as sessions, one of
them asked to pass the notices on, so it carried an onward request; rule 2 forbids naming a session
as the origin or carrier of a request and says nothing of a notice's recipients (GOV-7).

`repository-practice` survives this repository's adoption of `base` (dl-031 R6), so W10 fixes none
of these. Candidates GOV-2, GOV-4 and GOV-7 of the retrospective dl-034 (C2).

## Options

For gap 1: (a) any retrospective, which then rules every row on its merits; (b) the next periodic
retrospective, a pack's own retrospective proposing only for the rows its cycle touched and keeping
the others. For gaps 2 … 4: rule 4 completed, or the cases left to each plan's judgement (rejected:
each case cost a review finding or a day of a wrong register). For rule 2: recipients named by
project, or rule 2 left as it is (rejected: a notice asking its recipient to pass it on is a request
carried by a session).

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **R1 — "The next retrospective" is the next periodic one** (option (b)): the default trigger
  (dl-031 R1) names the next run of `retrospective-periodic`, or a retrospective that counts as
  periodic (dl-029 T1). A pack's own retrospective reads the whole register (dl-031 R3) and
  proposes keep, assign or drop for the rows its cycle touched; it lists every other row as "not
  touched", which keeps it. The rows that carry the trigger keep it, now read this way.
- **R2 — A ruling's row.** A ruling that leaves an owed item adds its row in the commit that records
  the ruling in its plan, and the ruling cites the row.
- **R3 — A reopened row.** When an item moved to Closed is found open again, its row returns to Open
  in the commit that records the finding, on `main` when the finding is a plan's ruling or note, its
  Source extended with the element and section that reopened it (for example "plan-057 ruling 6");
  the element that settles it closes it again.
- **R4 — A row asked by the approver outside any element.** Its Source is "asked by the approver on
  <date>" with what it concerns; the plan active on `main`, or the next plan if none is active,
  cites it in an Execution Note.
- **R5 — The recipients of an outgoing notice**, in a repository text that describes the notice
  (rule 2's scope), are named by project ("WingFoil UI", "WingFoil Benchmark"; "the coordination of
  the WingFoil projects" if the approver keeps it), never as a session; a request the notice carries
  (to pass it on) is written as "asked by the approver on <date>", addressed to the recipient
  project (rule 1).
- **R6 — Where:** `repository-practice` 1.1 → 1.2, its date, one bump with dl-035 A4: rule 4 with
  R1 … R4, rule 2 with R5; the header of `docs/owed-items.md` (its bullets paraphrase rule 4) in the
  same change; an Execution Note on dl-031 (its R1 reads with R1 here, its R2 with R2 … R4, its R3
  with R1) and on dl-030 (rule 2 with R5). Applied after approval by a dl actions plan, whose row is
  dl-034 D3's. Text already on `main` is not rewritten (rule 1's clause).

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-02: written under plan-059 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-034, as the approver chose at the checkpoint (inventory P3).
- 2026-11-02: independent review: approve after amendments, nothing blocking; applied: R5 by
  project with the onward request under rule 1 and rule 2's scope, R6's header of the register, the
  note on dl-031 covering R1 … R3, the shared bump with dl-035, R3 on `main` and its source as
  element and section, gap 1's wording, "the rows", dl-029 T1, "the plan active on `main`", the
  count of gaps.
