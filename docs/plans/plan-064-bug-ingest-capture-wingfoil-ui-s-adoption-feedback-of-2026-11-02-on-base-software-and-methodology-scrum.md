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

**What it produces:** bugs (`bug-ingest`), each reviewed and ruled at `triage`, and the decision-log
a design choice needs (point 2), and the feedback notes of points 3(d) and 4, written by one
content-only task (`tooling-delivery`, dl-039 R1) on a branch of its own cut from this plan's and
merged into it, all hosted here as plan-053 hosted task-063. It fixes nothing: each fix is a pack
release, owed in `docs/owed-items.md`.

**Not in this plan:** the fixes (pack releases of `base`, `software`, `methodology/scrum`); the
WingFoil-side points WingFoil UI sends itself; the intake's automation and the `tooling-change`
plan of dl-024 and dl-025, which follow it (the register).

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **The plan's workflow.** Recommended: `bug-ingest` › `capture`, since most points are defects of
   published packs, hosting one decision-log (point 2) that runs its own `decision-log-ingest`
   instance (`capture`, then `rule`), as plan-053 hosted task-063 and its `tooling-delivery` loop;
   a stated deviation (`bug-ingest` produces bugs only). Alternative: two plans, one per workflow.
2. **The gates (feedback 1): a decision-log, not a bug.** Adding a gate is "a requirement made
   stricter (a new gate)", major in `pack-semver`: `software` 2.0.0. Its dependants,
   `methodology/scrum` and `methodology/kanban` (`requires: software@^1`), moved to `^2`, give an
   upgrading project the new gate, a behaviour change: major for each by `pack-semver`'s first line
   ("in doubt, take the higher"); `pack-semver` has no rule for a `requires` range moved, which the
   decision-log rules (beside the register's row on `pack-semver`'s rule for fixes and changed
   defaults). What the gates touch: `software`'s `release-submit` › `approve-release` and
   `release-publishing` › `publish` and `mark-released` (today `element.set_state(released)`); the
   phases that include `release` (`software`'s `release`, `scrum`'s `sprint` › `release`,
   `kanban`'s `release-flow`); `end-of-life` › `deprecate`, which selects releases in `releasing`;
   no workflow moves a `release-line`, so its gate binds no step (feedback 2's "listed for its whole
   life"). Recommended: one decision-log, "Gates on `release` and `release-line`", with the options
   (a) UI's gates as proposed, `mark-released` approving, saying which of today's approvals
   (`approve-release`, `publish`) it removes so a release is not approved three times; (b) the
   approval kept in the workflows, as today, with a documented note for a project not running the
   engine; (c) (a) for `release` only; (d) (b) until WingFoil binds a gate's approval to the phase
   that owns it (feedback 2), then (a); (e) the `release-line` gate only; and the `bug` `planned`
   gate as a point of its own (UI's consideration: any team identity starts a planned fix; the cost,
   no `planned → closed` exit). The approver rules it at `rule`; its dl actions are a release of
   `software` 2.0.0 with its dependants.
3. **The defects: one bug each**, severity proposed per the `bug` type, each reproduced first on the
   newest release `compat.yaml` lists (0.3.2) in a scratch repository with the composed packs, and
   only then captured (the practice of dl-038 K1):
   - (a) `base` › `security-secrets` contradicts `dna.yaml`'s required approver email: the rule
     names the exception (`minor`);
   - (b) `software`'s AGENTS.md section hard-codes the agent's four roles (developer, reviewer, qa,
     architect, copied from `executes_as`) and the `bug` gates, and `scrum`'s hard-codes the
     Developers' role mapping: the sections name them by reference to `dna.yaml`, `roles.yaml` and
     `memory.yaml`, as prose (spec-001 §10), or through a parameter with a default; one bug per pack
     (the template's one `pack` field), `minor` each;
   - (c) `base`'s `governance-evolution` › `apply` asks for "AGENTS.md updated": the generated
     region changes only with a pack version or a parameter, not with a local governance change, so
     `apply` updates AGENTS.md outside the region (`minor`);
   - (d) `scrum`: a `sprint` field naming no Sprint is accepted at `submit`. WingFoil 0.3.2 checks
     no reference, and a pack cannot add one: a `checks.post` token resolves only through a
     project's `bindings.yaml`, which packs do not ship (spec-001 O4), and an unbound token is a
     `workflow list` warning `pack-compatibility` refuses; the field is written by editing
     (`sprint-planning`, `plan-release`), no action sets it. The risk: a task or a release with a
     wrong `sprint` is never selected by `development` or `release`, silently. Recommended: a
     feedback note to WingFoil (reference-typed frontmatter fields) as the main outcome, by a
     content-only task hosted here (task-063's precedent: `tooling-delivery`, its own branch from
     this plan's, merged into it), the one task carrying every note of 3(d) and point 4, and
     `scrum`'s descriptions naming the risk, a `minor` bug.
4. **The points WingFoil UI does not send to WingFoil itself** (UI's list is hand-edited states,
   forged history, `memory deprecate` without approval, author-only approvals). Feedback 2 (gates
   listed out of phase), "ungated" in `workflow status`, and a non-approver identity starting
   workflows and finalizing non-approval steps are not in it, and no note of this inbox covers them.
   Recommended: each reproduced on 0.3.2; each that holds, a feedback note from this repository, by
   the content-only task of 3(d); one that does not, recorded here. `specification.approve` closing
   after an adopted tech-spec is as designed ("the step closes once none is pending"): no defect,
   recorded here.
5. **`scrum` charter open point 1** (UI's test-first steps; "UI's adoption plan decides"). WingFoil
   UI's feedback asks no pack change for it. Recommended: closed as "UI's to decide outside the
   pack; its adoption feedback of 2026-11-02 asks no change of `scrum`", by an Execution Note on
   `pack-methodology-scrum` and the row moved to Closed; what UI chose, a question in point 7's
   notice if the approver wants it recorded.
6. **The fixes owed.** Recommended: each bug's fix a row of `docs/owed-items.md` (owner approver,
   trigger the next release of its pack, or a `pack-release` plan of its own for a `major`), added
   in the commit that records its triage (dl-036 R2); the decision-log's dl actions a row at its
   ruling.
7. **A notice to WingFoil UI.** Recommended: none at capture (no reply asked); one when the first
   fix is published, named by project (dl-036 R5), with point 5's question if wanted.
8. **Branch, checks and pushes.** Recommended: this plan on `main`; the work on
   `bug/ui-feedback-2026-11-02`; per commit `workflow list` and `npm run lint` exit 0; the hosted
   content-only task checked by dl-039 R1; the branch CI read on the frozen head; `main` pushed at
   `submit`, at the merge and once at the close.

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
- **Reviewers (subagents):** this plan; each bug and the decision-log; the notes task's body and its
  build, with its notes (dl-017).
- **Approver:** the outline (before `submit`); each bug's triage; the decision-log's ruling; the
  notes task's acceptance into the backlog and its approval at `in-review` (`tooling-delivery`); the
  merge OK.
- Done when the bugs, the decision-log and the feedback notes are on `main` with their rulings, the
  fixes owed in rows of their own, the charter note written, the branch CI and `main`'s run read
  `success`, the branch's privacy check recorded, the register's rows of WingFoil UI's feedback
  and of `scrum`'s open point 1 Closed (which meets the trigger of the intake automation's row),
  and the plan `active → done`.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-05: written as asked by the approver on 2026-11-04, after plan-063's close; `workflow`
  and `phase` filled by editing the draft (W-02). The feedback's text read from the message
  WingFoil UI sent on 2026-11-02, which the register's row summarises. Next free numbers when
  written: plan-065, task-077, dl-041, bug-011, prel-007, F-043.
- 2026-11-05: independent review: request changes, two blocking findings (3(d)'s fix by a pack
  check, which WingFoil cannot run without a project's `bindings.yaml`; point 4's premise, since
  UI's list does not carry those points); applied with the others: point 2's semver for the
  dependants and the `requires` range, the workflows the gates touch, options (d) and (e), the
  approvals (a) removes; 3(b) on `software` and `scrum`; 3(c) consistent with 3(b); point 5 without
  inferring UI's choice; `specification.approve` as designed; the hosted decision-log's own
  instance; the Done criteria.
- 2026-11-05: re-review: approve after amendments, nothing blocking; applied: what the plan
  produces names the notes and their task, the task's workflow and branch, the Handoff's reviews and
  gates for it, one task for every note.
