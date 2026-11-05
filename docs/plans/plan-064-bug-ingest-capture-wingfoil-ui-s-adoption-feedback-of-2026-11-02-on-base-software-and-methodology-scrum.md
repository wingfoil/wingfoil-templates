---
id: plan-064-bug-ingest-capture-wingfoil-ui-s-adoption-feedback-of-2026-11-02-on-base-software-and-methodology-scrum
type: plan
title: "bug-ingest capture: WingFoil UI's adoption feedback of 2026-11-02 on base, software and methodology/scrum"
status: draft
workflow: "bug-ingest"
phase: "capture"
tags: ["process","bug","feedback","packs"]
---

## Context

The `capture` phase of `bug-ingest` for the feedback WingFoil UI sent on 2026-11-02 after adopting
`base` 2.0.1, `software` 1.0.0 and `methodology/scrum` 1.0.0 by hand on WingFoil 0.3.1. It is the
row "WingFoil UI's adoption feedback" of `docs/owed-items.md` (row 43 in dl-038 D1's numbering),
whose trigger is plan-063's close (plan-063 ruling 9), and it settles the row "`scrum` charter open
point 1 (UI's test-first steps)" (row 21 in that numbering), whose trigger is this plan. Asked by
the approver on 2026-11-02 (the row) and on 2026-11-04 (this order).

**The feedback**, as WingFoil UI wrote it (no reply asked; "take what is useful into your
process"):
1. **A proposal for `software`:** a gate on `release` at `releasing` (`reject: in-development`, the
   approver's `approve` after publication, `mark-released` approving instead of setting the state)
   and on `release-line` at `active` (`reject: planning`). Today every edge of `release` is a
   `memory submit`, so any member moves a release `releasing → released` with no approval, and a
   `release-line` closes with `submit` and no check of its releases. UI adopted both gates as local
   deviations. For consideration, not a proposal: UI dropped the gate on `bug` at `planned`.
2. **Gates offered out of phase:** with the `releasing` gate, the console and `workflow status` list
   the release's approval as soon as it is `releasing`, though no open step carries it until
   `mark-released`; an `active` release line is listed for its whole life. A gate bound to the phase
   that owns it would close both, likely a WingFoil engine point too.
3. **Also seen:** a `sprint` field naming a Sprint that does not exist is accepted at `submit`;
   `base`'s `security-secrets` forbids personal emails in files while `dna.yaml` must hold the
   approver's email for approval to work; the composer's AGENTS.md region hard-codes the agent's
   roles (four) and the `bug` gates, so a project whose DNA or `memory.yaml` differs corrects it
   outside the region; `governance-evolution` › `apply` asks for "AGENTS.md updated" while the
   region is generated; adopting an already-approved tech-spec closes `specification.approve`,
   whose `where: { status: [pending] }` then selects nothing; `workflow status` titles the elements
   waiting at a gate "ungated"; a non-approver identity can start workflows and finalize
   non-approval steps. The WingFoil-side points (hand-edited states, forged history, `memory
   deprecate` without approval, author-only approvals) WingFoil UI sends to WingFoil itself.

Checked on `main` before writing: `software`'s `release` declares no gates and its `release-line`
only `planning: { reject: draft }` (`packs/software/fragments/memory.yaml`); `bug` has a gate at
`planned`; `security-secrets` forbids "a personal email" in a file; `governance-evolution` ›
`apply` says "AGENTS.md updated".

**`main`'s CI before this plan** (dl-038 C3): plan-063's last push, `4b9cfc3` (its close and
`active → done`), CI run 42081846882, read and recorded here before `submit`.

**What it produces:** bugs (`bug-ingest`), each reviewed and ruled at `triage`, and the
decision-log a design choice needs (point 2), hosted here as plan-053 hosted task-063. It fixes
nothing: each fix is a pack release, owed in `docs/owed-items.md`.

**Not in this plan:** the fixes (pack releases of `base`, `software`, `methodology/scrum`); the
WingFoil-side points WingFoil UI sends itself; the intake's automation and the `tooling-change`
plan of dl-024 and dl-025, which follow it (the register).

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **The plan's workflow.** Recommended: `bug-ingest` › `capture`, since most points are defects of
   published packs, hosting one decision-log (point 2) as a stated deviation (`bug-ingest` produces
   bugs only), as plan-053 hosted a task. Alternative: two plans, one per workflow.
2. **The gates (feedback 1): a decision-log, not a bug.** Adding a gate is "a requirement made
   stricter (a new gate)", major in `pack-semver`: `software` 2.0.0, and `methodology/scrum` and
   `methodology/kanban` (which require `software@^1`) each a release; and the workflows that run
   `release` (`software`'s `release`, `kanban`'s `release-flow`) change with them. Recommended: one
   decision-log, "Gates on `release` and `release-line`" (options: (a) UI's gates as proposed,
   with `mark-released` approving; (b) the approval kept in the workflows' `approve-release` and
   `publish` phases, as today, with a documented note for a project not running the engine; (c)
   (a) for `release` only), with the `bug` `planned` gate as a point of its own (UI's consideration:
   any team identity starts a planned fix; the cost, no `planned → closed` exit); the approver rules
   it at `rule`, and its dl actions are a pack-cycle of `software` 2.0.0 with its dependants.
3. **The defects: one bug each**, severity proposed per the `bug` type, each reproduced first on the
   newest release `compat.yaml` lists (0.3.2) in a scratch repository with the composed packs, and
   only then captured (K1 of dl-038):
   - (a) `base` › `security-secrets` contradicts `dna.yaml`'s required approver email: the rule
     names the exception (`minor`);
   - (b) the AGENTS.md region hard-codes the agent's roles and the `bug` gates (`base` and
     `software` sections): the sections name the roles and gates by reference to `dna.yaml`,
     `roles.yaml` and `memory.yaml`, not by value (`major` for an adopter whose configuration
     differs, otherwise `minor`; the approver rules);
   - (c) `governance-evolution` › `apply` asks for "AGENTS.md updated": it asks for the region
     regenerated (pasted by hand until WingFoil exports it), and the rest of the file updated
     (`minor`);
   - (d) `scrum`: a `sprint` field naming no Sprint is accepted at `submit`: WingFoil checks no
     reference; the pack's workflow step that sets the field checks it (a description and a
     `checks.post` line), and a feedback note only if the pack cannot check it (`minor`).
4. **The points that are WingFoil's** (feedback 2; `specification.approve` closed by adoption;
   "ungated"; a non-approver starting workflows). Recommended: no note from this repository unless
   its own reproduction on 0.3.2 shows a case WingFoil UI's inbox does not carry: WingFoil UI sends
   the WingFoil-side points itself, and two notes on one defect would be duplicates. Recorded here
   as observed; feedback 2 also feeds point 2's decision (a gate whose approval is listed before its
   phase).
5. **`scrum` charter open point 1** (UI's test-first steps; "UI's adoption plan decides"). WingFoil
   UI adopted `scrum` by hand and its feedback does not name the point. Recommended: settled on UI's
   side by its adoption, recorded by an Execution Note on `pack-methodology-scrum`, the row moved to
   Closed; a question to WingFoil UI only if the approver wants the choice recorded here.
6. **The fixes owed.** Recommended: each bug's fix a row of `docs/owed-items.md` (owner approver,
   trigger the next release of its pack, or a `pack-release` plan of its own for a `major`), added
   at `triage` with the bug's ruling (dl-036 R2); the decision-log's dl actions a row at its ruling.
7. **A notice to WingFoil UI.** Recommended: none at capture (no reply asked); one when the first
   fix is published, named by project (dl-036 R5).
8. **Branch, checks and pushes.** Recommended: this plan on `main`; the work on
   `bug/ui-feedback-2026-11-02`; no tooling change, so per commit `workflow list` and `npm run lint`
   exit 0, and the branch CI read on the frozen head; `main` pushed at `submit`, at the merge and
   once at the close.

## The approver's rulings

<!-- Filled when the approver rules the outline. -->

## Steps

<!-- Written after the rulings: reproduction, one row per bug and for the decision-log, each with
     its review (dl-017) and the approver's triage or rule, the charter note, the register. -->

## Handoff

- **claude (facilitator):** the reproductions, every element and the branch close, except the
  approvals and the merge OK. It never runs `memory approve` or `memory reject`: it gives the
  approver the command, with `cd` and `--reason`. No pull request. Files staged by name;
  `docs/notes/` and `.idea/` stay untracked. Repository texts follow `repository-practice`;
  WingFoil UI is named by project.
- **Reviewers (subagents):** this plan; each bug and the decision-log (dl-017).
- **Approver:** the outline (before `submit`); each bug's triage; the decision-log's ruling; the
  merge OK.
- Done when the bugs and the decision-log are on `main` with their rulings, their fixes owed in
  rows of their own, the charter note written, the branch CI and `main`'s run read `success`, and
  the register's rows of WingFoil UI's feedback and of `scrum`'s open point 1 are Closed.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written as asked by the approver on 2026-11-04, after plan-063's close; `workflow`
  and `phase` filled by editing the draft (W-02). The feedback's text read from the message
  WingFoil UI sent on 2026-11-02, which the register's row summarises. Next free numbers when
  written: plan-065, task-077, dl-041, bug-011, prel-007, F-043.
