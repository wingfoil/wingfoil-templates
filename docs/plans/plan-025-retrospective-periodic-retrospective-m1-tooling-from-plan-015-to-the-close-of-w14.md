---
id: plan-025-retrospective-periodic-retrospective-m1-tooling-from-plan-015-to-the-close-of-w14
type: plan
title: "retrospective-periodic retrospective: M1 Tooling, from plan-015 to the close of W14"
status: active
workflow: "retrospective-periodic"
phase: "retrospective"
tags: ["process","retrospective","M1"]
---

## Context

The first periodic retrospective of this repository (dl-006 R1, R3), started on 2026-10-12 on the
approver's request in chat. It closes milestone M1 "Tooling" (`docs/01_vision/07_sequencer.md`):
waves W5, W6 and W7 (plan-015, `sw-life-cycle` › `tooling`, `done`, approved on 2026-10-10) and W14
(plan-024, `tooling-change` › `deliver`, `done`, closed by the approver on 2026-10-12).

**Why now (dl-006 R3).** At least one periodic retrospective runs between two WingFoil releases,
before WingFoil's release planning, so that the WingFoil-side points it finds reach the feedback
notes in time (dl-001 D6). WingFoil v0.3 is expected on npm around 2026-10-20 (relayed by the
approver), and WingFoil's v0.3 retrospective, which precedes its v0.4 release planning, reads this
repository's feedback inbox (source key `svc-018`). The WingFoil-side points of this retrospective
must therefore be in `docs/wingfoil-feedback/` on `main` before WingFoil's release planning, and in
practice before 2026-10-20.

**Period.** From the start of the tooling phase (plan-015, 2026-10-06) to the close of W14
(2026-10-12), as the approver set it. It covers:
- the plans plan-015 … plan-024, read whatever their state;
- the elements closed in the period: task-001 … task-025 (`done`); dl-009, dl-010 and dl-014
  (`approved`); adr-003 and adr-004 (`approved`); bug-001 (`approved`); spec-002 (`approved`);
- the Execution Notes added in the period to elements closed earlier (for example dl-003, dl-005,
  spec-001), when they record friction;
- the feedback notes added in the period (F-001 … F-021, versioned and split by task-009 and
  task-010; F-001 … F-018 were T1 … T18 of the old notes file, F-019 … F-021 are new) and the
  `wingfoil-cli` directive's known behaviours W-01 … W-12.

Elements still `pending` or `active` (dl-007, dl-011 … dl-013, dl-015; plan-010, plan-020,
plan-022) are not closed and are read only where a closed element cites them. The elements closed
before plan-015 (inception and specification, M0: dl-001 … dl-006, dl-008, adr-001, adr-002,
spec-001, plan-001 … plan-014) are outside the period and are read the same way: this first
retrospective covers M1, and M0's friction enters only where M1's sources show it.

**Inputs relayed by the approver** (2026-10-12), each to be verified on its sources before it enters
the inventory: the review loops (body, build, re-review) and what they found; red-first not always
kept (task-019 written before its tests, red shown by mutation); deviations from the Acceptance
recorded afterwards (task-020, task-022); spec-002's errata and the decisions taken mid-course (the
split of task 2b, the CB-2 exemption, the root README); friction with the WingFoil 0.2.2 CLI
(`wingfoil-cli` W-01 … W-12, F-011, F-018 … F-021); the GitHub Pages confirmation first made on the
wrong repository; and WingFoil's estimates of 2026-10-12 with the three divergences they reveal:
- the base packs shipped in the npm package, which this repository's dl-001, product brief, F-003
  and the `--bundled` note assume, while WingFoil's dl-138 (Action 3) says packs are template-repo
  content, not npm content;
- `wingfoil stage set`, which WingFoil does not plan;
- dl-138's `remote` asset class against this repository's dl-003.

The three divergences go into the inventory as points; their decision-log is separate work, opened
later at the approver's request. This retrospective does not decide them. WingFoil's estimates and
its dl-138 are not in this repository: the inventory cites them as relayed by the approver on
2026-10-12, with the WingFoil element ids, and marks what it could not verify.

**Produces** (the `retrospective` sub-workflow, v2):
- `docs/retrospectives/2026-10-12-periodic-friction-inventory.md` (phase `explore`, outside every
  Memory path, dl-006 R4);
- a decision-log "Retrospective periodic 2026-10-12" (phase `capture`), one decision-log per change
  of process, and one feedback note per WingFoil defect or gap not yet in the inbox.

Out of scope, each waiting for the approver: the decision-log on the three divergences; the unused
`0.x` clauses of `pack-semver` and `pack-cycle` and the `deliver`/`author` slip of bug-001
(plan-018); the amendment of spec-002 (errata and P1–P3, recorded in its Execution Notes); the
`LICENSE` file; M2 (W8, `base`), which starts when the approver confirms the v0.3 formats final. The
retrospective may cite them as friction, but opens no element for them.

## Steps

All on the branch `retro/2026-10-12-periodic`, from `main` at `62979cd`.

1. **explore** (facilitator, read-only on Memory): read the Execution Notes of every element in the
   period and the feedback notes; build the friction inventory grouped by theme, each point citing
   its source (element id and section, commit, or note id), with what went well alongside what
   went wrong (Derby & Larsen's "gather data" and "generate insights", dl-006 R5). Each relayed
   input is confirmed, corrected or marked "not found in the sources". Commit the inventory alone;
   an independent review (a subagent with its own context) checks every citation against its
   source before the inventory is shown.
2. **additional-points** (approver): the inventory is shown in chat; the approver adds the points to
   analyse. A checkpoint, no commit.
3. **capture** (facilitator):
   - first, the approver's additional points are added to the inventory, in their own commit (the
     checkpoint itself commits nothing);
   - a decision-log "Retrospective periodic 2026-10-12" (`memory add`, body committed by hand, then
     `memory submit`): what to keep and what to change, each point tied to the inventory;
   - one decision-log per change of process the retrospective proposes, cited by the retrospective
     decision-log;
   - one feedback note per WingFoil defect or gap not yet in the inbox, in the inbox format
     (README, WingFoil dl-163 R4), `status: open`, cited in repository texts as
     `<full service id>/F-<nnn>`, per the README. Its ledger row in
     `docs/wingfoil-feedback/README.md` and, where it applies, a known-behaviour entry in the
     `wingfoil-cli` directive go with it (`wingfoil-cli` rule 3). A WingFoil defect is a note, not a
     decision.
   Every decision-log gets an independent review and is amended while `pending`.
4. **approve** (product-owner, held by the approver): the approver rules the retrospective
   decision-log and each process decision-log; claude hands over, for each, the command
   `npm run -s wingfoil -- memory approve <id> --reason "…"`, run from the repository root
   (`wingfoil-cli` W-03, W-10).
   The approved actions are applied later, each through its own element, not under this plan
   unless the approver says so. A rejection sends the element back to `capture` (the phase's
   fallback).
5. **Branch close**: push the branch; read the real CI result of the pushed branch (its
   `conclusion`, not only its status) and record it in these Execution Notes; on the approver's
   OK, merge `--no-ff` into `main` locally, push `main`, delete the remote and the local branch.

## Handoff

- **claude (facilitator):** steps 1, 3 and 5 except the merge OK. It never runs `memory approve` or
  `memory reject`. No pull request. Files are staged by name; `docs/notes/` and `.idea/` stay
  untracked. Repository texts cite only public elements.
- **Approver:** this plan before it is submitted; the additional points (step 2); the ruling of
  every decision-log (step 4); the merge OK.
- Checkpoints: the plan (before `explore`), the inventory (step 2), the decision-logs (step 4), the
  merge.
- Done when the inventory is committed; the retrospective decision-log is `approved` and every
  process decision-log is ruled (approved, or rejected and back to `capture`, or withdrawn by the
  approver); its WingFoil-side notes are in `docs/wingfoil-feedback/` on `main` and pushed before
  WingFoil's release planning; and the branch is merged and removed. The plan then goes
  `active → done`.

## Execution Notes

- 2026-10-12: `memory add --set workflow=… --set phase=…` refused (`wingfoil-cli` W-02, F-011);
  `workflow` and `phase` filled by editing the draft.
- 2026-10-12: independent review of this plan (approve after amendments, eleven findings), amended
  before the body commit; presented to the approver, who approved it in chat and asked to submit
  it and start `explore`.
- 2026-10-12, `explore`: plan submitted `active` (`7be574e`). Four read-only subagents mined the
  sources (W5; W6–W7 and the inbox; W14 and spec-002; the three divergences); the inventory was
  committed (`62616d4`), checked by an independent review (about 60 citations, approve after
  amendments, eleven findings) and amended. Every relayed input was confirmed on its sources except
  the GitHub Pages confirmation on the wrong repository, which no element records (marked `?`).
  Next: the approver's checkpoint (`additional-points`).
- 2026-10-12, `additional-points`: the approver added no point; recorded in the inventory
  (`8ccf70f`).
- 2026-10-12, `capture`: dl-016 (the retrospective) and dl-017 … dl-020 (one per change of
  process) added, bodies committed (`2cf6dfc`), each reviewed independently (approve after
  amendments) and amended (`e4ef8bf`, and the commit after it). **Deviation from step 3:** the five
  new feedback notes F-022 … F-026 are not written in `capture` but by task-026, hosted by this
  plan: `tests/support/inbox.ts` requires a new note's first line to name a task or a
  pack-release, and the approver chose on 2026-10-12 a task of its own over a change of that rule.
  task-026 also fixes F-012's title and F-018's evidence (dl-016 W2); its body was reviewed
  independently and amended. A first draft of the notes, written before that choice and parked
  outside the repository, was lost when the session restarted; the notes are written again in
  task-026's build.
