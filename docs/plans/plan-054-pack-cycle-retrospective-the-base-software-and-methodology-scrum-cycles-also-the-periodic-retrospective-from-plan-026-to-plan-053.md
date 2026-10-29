---
id: plan-054-pack-cycle-retrospective-the-base-software-and-methodology-scrum-cycles-also-the-periodic-retrospective-from-plan-026-to-plan-053
type: plan
title: "pack-cycle retrospective: the base, software and methodology/scrum cycles, also the periodic retrospective from plan-026 to plan-053"
status: active
workflow: "pack-cycle"
phase: "retrospective"
tags: ["process","retrospective","M2"]
---

## Context

The `retrospective` phase of `pack-cycle` (dl-006 R1), run once for the three cycles that reached
a first release: `base` (pack-foundation-base), `software` (pack-foundation-software) and
`methodology/scrum` (pack-methodology-scrum). dl-006's Execution Notes record why it runs once and
after `activate`: plan-044's ruling B (`base` activated at its first tag, one retrospective for
both foundation packs after `software`'s `first-release`) and plan-052's ruling 6 (`software` and
`methodology/scrum` activated at their first tag, one retrospective for the three cycles in its own
plan after plan-052). Asked by the approver on 2026-10-28, with its proposal (decisions 1–5,
below) approved.

**It is also the periodic retrospective (dl-006 R3).** The previous periodic one was plan-025
(closed 2026-10-12). Since then WingFoil released 0.3.0 and 0.3.1, and neither intake (plan-042,
plan-051) was followed by a periodic retrospective: R3 sets a cadence but no event that starts it,
so it was missed twice. One retrospective of `pack-cycle` inside the window counts as the periodic
one; the inventory's scope is therefore `periodic` (`retrospective.yaml` v4, phase `explore`),
with one section per pack.

**Why now.** WingFoil 0.3.2 is a patch with no retrospective of its own; its results flow into
v0.4's, and v0.4's release planning starts after 0.3.2's release and release-health, not before
2026-11-06 … 11 (WingFoil's timing as of 2026-10-28). The WingFoil-side points of this
retrospective must be feedback notes on `main` before 2026-11-06.

**Period.** From 2026-10-12 (plan-025 closed) to 2026-10-28 (plan-053 closed). Sources:
- the plans plan-026 … plan-053, their Execution Notes and closing notes, with what each records as
  owed;
- the tasks task-027 … task-063 (task-052 included, built under plan-053), with their reviews;
- the decision-logs dl-017 … dl-027 (dl-024 and dl-025 `pending`, read as sources of the period,
  not ruled or amended here);
- bug-002 … bug-008 (bug-002 already in plan-025's close: read for what follows it);
  prel-001 … prel-005;
- the three charters and their Execution Notes;
- the feedback notes F-027 … F-037, `docs/wingfoil-feedback/README.md`, and the `wingfoil-cli`
  directive's entries W- added or changed in the period (up to W-14, version 1.5);
- the Execution Notes added in the period to elements closed earlier (dl-003, dl-006, spec-001,
  spec-002, the sequencer), when they record friction;
- for the section "dl-016 revisited": dl-016 (keep K1–K7, change C1–C4, actions A1–A2, notes
  W1–W4) and dl-017 … dl-020.
Elements still `pending` or `active` outside the period (dl-007, dl-011 … dl-013; plan-010,
plan-020, plan-022) are read only where a source above cites them.

**Decisions approved with the proposal** (approver, 2026-10-28):
1. One plan and one inventory: `docs/retrospectives/<YYYY-MM-DD>-periodic-friction-inventory.md`,
   dated the day it is committed; a section per pack, the cross-cutting themes, and a section
   "dl-016 revisited" (did dl-016's keep/change/actions and the rules of dl-017 … dl-020 hold?).
2. `workflow: pack-cycle`, `phase: retrospective`. At close, an Execution Note on dl-006 records R1
   met for the three packs and R3 for the period.
3. WingFoil-side points go **only** as feedback notes in the inbox (source key `svc-018`, read by
   WingFoil at its sync); a message outside the inbox only for something urgent. The notes are
   numbered contiguously (`tests/support/inbox.ts`): F-038 `workflow start` filling a plan's
   `workflow` and `phase` (a `request`, owed by plan-049), F-039 bug-008's option (iii) (plan-052's
   ruling 2), then the new points of this retrospective, then W-14's note if one is decided.
   Whether `wingfoil-cli` W-14 (`memory add` numbers by count) needs a note is
   decided after re-checking it on 0.3.1 (plan-053's step 4). The notes are written by task-064,
   hosted by this plan, as task-026 was by plan-025 and task-063 by plan-053 (the inbox test
   requires a note's first line to name a task or a pack-release).
4. The debts carried by plan-052 and by plan-043, plan-045, plan-046, plan-048 and plan-049 are not
   points one by one: they form a table "Debts" in the inventory, each with an owner and a trigger,
   approved as a backlog by the retrospective's decision-log. The phenomenon itself is a point
   (debts live only in closing notes, with no register): a candidate change of governance, with
   its own decision-log if kept.
5. Re-align R3: a decision-log (dl-029, under `decision-log-ingest`) ties the periodic
   retrospective to the close of every `wingfoil-release-intake`, to be closed before WingFoil's
   next release planning; a `pack-cycle` retrospective inside the window counts as the periodic
   one. It is applied later by a dl actions plan (`wingfoil-release-intake.yaml` v4 → v5,
   `retrospective-periodic.yaml`'s header, a note on dl-006).

**Governance changes are points, not rulings of `capture`** (`retrospective.yaml` v4, dl-006 R2 as
amended by dl-022): until this repository adopts `base` (W10), each is a decision-log under
`decision-log-ingest`, captured here and applied by a dl actions plan. A WingFoil defect is a
feedback note.

**A change of governance added by the approver** (asked by the approver on 2026-10-28, to run
inside this retrospective): in new repository texts (Memory elements and their Execution Notes,
plans, tasks, feedback notes, commit messages) the origin of a request is written "asked by the
approver on <date>", never naming the session or tool that carried it; text already on `main` is
not rewritten; the privacy check of a task's or plan's diff also checks that the added lines name
no intermediary session (a session's or tool's name or title given as the origin or carrier of a
request). The rule applies from now, this plan included. It is recorded as dl-030, under
`decision-log-ingest`, which names where sessions will read it: proposed, a new directive
`.wingfoil/directives/custom/repository-texts.md`, global in `.wingfoil/roles.yaml`, holding this
rule, the privacy check and "cite only public elements" (today only in plan texts), unless dl-030's
review names another element. Once dl-030 is approved, task-065, hosted by this plan, applies it.

**Deviations from the workflows**, as plan-025 and plan-053 recorded theirs:
- the order: `retrospective` runs after `activate` (dl-006's notes, above);
- `retrospective.yaml` v4's `capture` produces decision-logs only; the feedback notes are written by
  task-064, hosted by this plan, because the inbox test requires a note's first line to name a task
  or a pack-release;
- the governance decision-logs run `decision-log-ingest`'s `capture` inside this plan, with no plan
  of their own, and its `rule` alongside the retrospective's `approve` (step 5).

**Produces:**
- the inventory (phase `explore`, outside every Memory path, dl-006 R4);
- dl-028 "Retrospective periodic <YYYY-MM-DD>" (phase `capture`): keep, change and the debts
  backlog, each tied to the inventory;
- dl-029 (R3's trigger), dl-030 (the rule on a request's origin) and one decision-log per other
  change of governance, from dl-031;
- task-064 and its notes F-038 onward, with their ledger rows;
- task-065, which applies dl-030.

**Out of scope:** ruling or amending dl-024 and dl-025 (cited as sources only); applying any
approved action except dl-030's (each later, through its own element, unless the approver says
otherwise; dl-029's and the others' by a dl actions plan after this one); the
debts themselves (only their table); W10 (`methodology/kanban`, presets,
`governance/wingfoil-dogfood`, this repository's adoption of the packs, the WingFoil pin and the
first inbox sync).

**Numbers.** Next free on `main` at `58e5d34`: dl-028 (reserved by plan-049, unused), dl-029
(reserved by plan-050, released per plan-051), dl-030, task-064, F-038 (also plan-055, bug-009,
prel-006). WingFoil 0.2.2's `memory add` numbers by count (W-14): the decision-logs are added in
order (dl-028, dl-029, dl-030, …), each printed id checked before going on, and no element of a
type is added on this branch while another branch holds a new element of the same type.

## Steps

All on the branch `retro/2026-10-28-pack-cycle`, from `main` at `58e5d34`. Before every commit,
the privacy grep of the staged diff (no local or scratch path, private repository, private project
or intermediary session); after every commit under `docs/memory/`, `docs/plans/` or `.wingfoil/`,
`npm run -s wingfoil -- workflow list` and `npm run lint` exit 0.

1. **This plan** (claude): `memory add` (`a642d45`), body, an independent review (dl-017), amended;
   the approver's OK; `submit` (`draft → active`).
2. **explore** (facilitator, read-only on Memory):
   - five read-only subagents, one per strand, each returning points with their sources and what
     went well alongside what went wrong (dl-006 R5):
     a. governance and dl actions: plan-026 … plan-040, with "dl-016 revisited" (dl-016 …
        dl-020) and the period's notes on dl-003, dl-006, spec-001, spec-002 and the sequencer;
     b. the `base` cycle: plan-041, plan-043, plan-044, plan-045, plan-049;
     c. the `software` cycle: plan-046, plan-048, with `software`'s part of plan-041 (charter) and
        of plan-052 (first release);
     d. `methodology/scrum` and W9: plan-047, plan-050, plan-052, dl-026, dl-027;
     e. intake and inbox: plan-042, plan-051, plan-053, F-027 … F-037, the `wingfoil-cli` entries;
     each reads its plans' tasks, decision-logs, bugs, pack-releases and charter notes; claude
     merges the overlaps when building the inventory;
   - claude re-runs W-14 on WingFoil 0.3.1 in a scratch project outside the repository (a type with
     a gap in its numbers), for decision 3;
   - claude builds the inventory: a section per pack, the cross-cutting themes, "dl-016 revisited",
     the table "Debts" (item, source, owner, trigger), the candidate feedback notes marked `WF`, the
     candidate governance changes marked `GOV`. Committed alone (privacy grep as above); then an
     independent review checks every citation against its source, and the inventory is amended.
3. **additional-points** (approver): the inventory is shown in chat; the approver adds points. A
   checkpoint, no commit.
4. **capture** (facilitator):
   - the approver's points added to the inventory, in their own commit (or, if none, that none
     were added);
   - dl-028 "Retrospective periodic <YYYY-MM-DD>" (`memory add`, body by hand, `submit`): keep,
     change, the debts backlog (decision 4), each point tied to the inventory;
   - dl-029 (decision 5), dl-030 (the rule on a request's origin) and one decision-log per other
     change of governance, under `decision-log-ingest`, cited by dl-028; once dl-030 is submitted,
     a first reply outside the repository names it and its commit;
   - task-064 (`tooling-delivery`, `pack: ""`, on `task/task-064-<slug>` from this branch), as
     task-063 in plan-053:
     1. `plan` (claude as product-owner): its body (Context, Acceptance, Design) reviewed
        independently and amended, `submit` (`draft → pending`); the approver accepts it into the
        backlog (`pending → backlog`); `design` is the body's Design section;
     2. `build` (claude as developer, `submit`, `backlog → in-progress`): the notes from F-038 in
        the inbox format, first line `New note (task-064).`, each with its `wingfoil_version`,
        reproduced with WingFoil alone on 0.3.0 and 0.3.1 (`src/matrix/`; for bug-008's note a
        minimal hand-written `iterate_over`/`where` configuration, not the packs), a difference on
        0.3.1 going to the approver; one ledger row each, `Last sync` unchanged; a `wingfoil-cli`
        change only if a note needs one (rule 3); the privacy grep, intermediary sessions
        included; `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`,
        `index -- --check`, `check:runs` and `workflow list` exit 0 from clean clones on Node.js
        22.21.0 and 22.12.0; the branch's CI conclusion recorded;
     3. `review`: an independent build review; `submit` (`in-progress → in-review`); the approver's
        approval (`in-review → approved`);
     4. `deliver`: `--no-ff` merge into this branch; `submit` (`approved → done`).

   If this branch cannot close by 2026-11-05, task-064's merge (the notes and their ledger rows)
   goes to `main` on its own, on the approver's OK, `--no-ff`, with `main`'s CI read.
   Every element gets its own independent review, amended while `pending`; a fix that changes a
   decision is reviewed again (dl-017).
5. **approve** (product-owner, held by the approver): the approver rules dl-028 and each governance
   decision-log; claude hands over each command
   (`npm run -s wingfoil -- memory approve <id> --reason "…"`, from the repository root). A
   rejection sends the element back to `capture`. dl-028 and dl-030 must be ruled for this plan to
   close; the other governance decision-logs may instead stay `pending` (their phase `rule` has no
   deadline).
   Once dl-030 is approved, **task-065** (`tooling-delivery`, `pack: ""`, on
   `task/task-065-<slug>` from this branch, the same loop phases and checks as task-064, added only
   after task-064 is merged into this branch, W-14): the element dl-030 names (for a directive: its
   entry in `.wingfoil/roles.yaml`, its header with Version 1.0, Date and "Checked against" the
   pin); `directives list` exits 0 with no warning, `workflow list` and `lint` exit 0, the
   clean-clone checks and the branch's CI conclusion. Its Design states how dl-018's red-first
   applies to a content change (checked by `directives list` and by a mutation that removes the
   `roles.yaml` entry). Then a second reply outside the repository names the commit.
6. **Branch close:** an Execution Note on dl-006 (decision 2) and one on each of the three charters
   (their `retrospective` phase ran here); push; the privacy check of the branch's diff (no local
   path, private repository, private project or intermediary session) and the real CI conclusion
   recorded here; on the approver's OK, `--no-ff` merge into `main`, push, `main`'s CI conclusion
   read (the run that includes the merge); the remote and the local branch removed. A short
   notice outside the repository, carrying no WingFoil point: the notes' ids and the commit on
   `main`.

## Handoff

- **claude (facilitator):** steps 1, 2, 4 and 6, and in step 5 the commands it hands over and
  task-065, except the approvals and the merge OK. It never
  runs `memory approve` or `memory reject`. No pull request. Files staged by name; `docs/notes/`
  and `.idea/` stay untracked. Repository texts cite only public elements.
- **Approver:** this plan before `submit`; the additional points (step 3); task-064's and
  task-065's backlog acceptance and approval; the ruling of dl-028 and of each governance
  decision-log (step 5); the merge OK.
- Checkpoints: the plan, the inventory, the decision-logs, task-064 and task-065, the merge.
- Done when the inventory is committed; dl-028 and dl-030 are `approved` and every other governance
  decision-log is ruled or left `pending` by the approver; task-064 is `done` and its notes are on
  `main`, pushed, before 2026-11-06; task-065 is `done`; dl-006's and the charters' notes are
  written; the branch is merged and removed; the notices outside the repository (dl-030's two
  replies, the close's notice) are sent. The plan then goes `active → done`.

## Execution Notes

- 2026-10-28: written as asked by the approver on 2026-10-28, with the proposal (decisions 1–5)
  already approved. `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-28: the rule on a request's origin (asked by the approver on 2026-10-28) applied to this
  draft; the approver chose to record it inside this retrospective, as dl-030.
- 2026-10-28: independent review: approve after amendments, twelve findings, none blocking (the
  deadline fallback, the notes' order, the deviations, privacy and configuration checks at every
  step, the strands' coverage, task-064's full loop, the numbers' reservations and add order, and
  nits); all applied.
- 2026-10-28: re-review (dl-017, the rule added a decision): approve after amendments, one blocking
  finding: dl-030 could stay `pending` and never be registered; now dl-030 must be ruled for the
  close and task-065, hosted here, applies it (the approver's request allows a task), with a second
  reply naming the directive's commit. Applied with it: the privacy grep before every commit,
  "intermediary session" defined, the proposed directive `repository-texts`, R3's wording,
  indentation.
- 2026-10-28: third review (task-065 is a new decision): approve after amendments, nothing
  blocking; applied: claude's step-5 work in the Handoff, task-065's `directives list` check and
  directive header, its red-first in Design, wording nits.
- 2026-10-28: the approver gave the OK in chat; submitted.
- 2026-10-28, `explore`: plan submitted `active` (`5423caa`), branch pushed. Five read-only
  subagents mined the strands; W-14 re-run on 0.3.0 and 0.3.1 in a scratch project outside the
  repository: both number after the highest id and do not reuse a number taken on another branch,
  so W-14 is 0.2.2's alone and needs no note (decision 3). The inventory was committed alone
  (`de025fa`), checked by two independent reviews (header and §1–§3; §4–§8; about 215 citations,
  approve after amendments, 28 findings, none blocking) and amended (`bfd8a9c`). One finding
  corrects this plan's Context: R3 asks for a run between two WingFoil releases, so it was missed
  once (between 0.3.0 and 0.3.1), not twice; neither intake close had a hook to it. The Context
  stays as written; the inventory (§4.6) and dl-029 carry the corrected reading. Next: the
  approver's checkpoint (`additional-points`).
- 2026-10-29, `additional-points`: the approver asked to read the candidates against this
  repository's adoption of the packs and its WingFoil pin at 0.3.1 (W10) and to keep as
  decision-logs only those the adoption would not fix; recorded as P1–P3 in the inventory
  (`e1f54c8`).
- 2026-10-29, `capture`: `memory add` gave dl-028 … dl-033 in order (`0956450` … `3492d68`), each id
  checked; bodies `c1a0757`: dl-028 the retrospective, dl-029 R3's trigger (G1), dl-030 a request's
  origin, the privacy check and `main`'s CI (G3 with G5), dl-031 a register of owed items (G2),
  dl-032 runs on the real engine (G4 with G10), dl-033 `pack-cycle`'s order (G6). The directive of
  dl-030 is named `repository-practice`, not `repository-texts` as the Context proposed, because it
  also holds `main`'s CI (G5); dl-031 puts its rules there too, so that they survive the adoption.
  Each reviewed independently: approve after amendments, one blocking finding (dl-029's skip
  condition); amended (`939e1a5`); re-reviews running. task-064's body written on
  `task/task-064-feedback-notes` (`2a86e01`, `0682032`), its review running.
