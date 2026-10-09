---
id: plan-020-decision-log-ingest-capture-the-initialization-template-and-the-installable-feedback-pack
type: plan
title: "decision-log-ingest capture: the initialization template and the installable feedback pack"
status: draft
workflow: "decision-log-ingest"
phase: "capture"
tags: ["process","decision-log","packs","scope"]
---

## Context

The `capture` phase of `decision-log-ingest`, started on 2026-10-09 on two requests of the approver
in chat. Each adds a capability to the catalog:
- **dl-011, an initialization template.** One guided workflow that starts from the user's intent,
  asks questions that adapt to the answers already collected, writes a structured project
  definition, and ends with an explicit **Reconfigure WingFoil** phase that adapts the project's
  governance (agents and roles, directives, workflows, gates, tools, QA) to what was learned. It
  demonstrates the cycle Intent → Questions → Project Definition → WingFoil Configuration →
  Execution.
- **dl-012, an installable feedback pack.** The feedback mechanism, today conceived only for the
  repositories that dogfood WingFoil (dl-003 D6, `governance/wingfoil-dogfood`; WingFoil dl-163),
  becomes a generic, configurable pack that any project can install: collect feedback, classify it,
  link it to the context that produced it, make it available to the governance, and turn it into
  evolutions of the project or of its governance. The initialization template must be able to
  select installable packs in its configuration, and the feedback pack is the first concrete
  example of a governance capability distributed as a pack.

The approver asked that both requests enter the normal governance processes rather than become
notes or TODOs, that no parallel methodology be invented, and that no software be implemented in
this step.

Why decision-logs first:
- both change the catalog scope: dl-001 D5 and dl-003 D7 fix the first scope, and
  `06_features.md`, `07_sequencer.md` and `08_mvp-canvas.md` are approved;
- where each sits in the pack model (axis, slot, `base`, or the WingFoil CLI) is a pack-model
  ruling;
- the `traceability` directive requires the chain decision → pack charter → task → pack-release.
  Pack charters and their tasks are opened only by `pack-cycle` (`sw-life-cycle` › `pack-delivery`),
  so this plan does not open them: dl-011 and dl-012 name them, with their acceptance criteria and
  their proposed tasks, so that `pack-cycle` opens them.

Preconditions: none. The capture does not touch plan-015 (`tooling`, W6), which goes on in its own
session; it runs on the branch `dl/dl-011-initialization-template`, from `main` at `706adeb`.

## Steps

For each decision-log, in order (dl-011, then dl-012, which cites dl-011):

1. **claude (facilitator):** `npm run -s wingfoil -- memory add --type decision-log --title "…"`,
   which creates the `draft`.
2. **claude (facilitator):** write Context, Options (each with what speaks for and against it),
   Decision (the proposal, ruled at `approve`): the capability's definition, its acceptance
   criteria, the vision-document amendments and the configuration changes it implies, and the
   elements it opens later (pack charter, tasks, preset, feedback note).
3. **claude:** commit the body by hand, with the Co-Authored-By trailer, before `submit` (W-04).
4. **claude:** `npm run -s wingfoil -- memory submit <id>` (`draft → pending`).

Then commit this plan's Execution Notes and `submit` it (`draft → active`).

## Handoff

- **claude:** steps 1–4. claude never approves (dna.yaml: `approval_authority: false`).
- **Approver:** an independent review if wanted, then the `rule` phase for each:
  `npm run -s wingfoil -- memory approve <id> --reason "…"` (W-03), or `memory reject` back to
  `capture`. The approver also rules the points each decision-log leaves open (pack names, waves,
  bootstrap preset, feedback state machine).
- **After approval**, a follow-up plan (pattern of plan-011 and plan-018) applies the
  vision-document amendments both decision-logs list. The pack charters and their tasks are opened
  when `pack-delivery` reaches each pack, in the order the sequencer sets.
- A rejected decision-log comes back to `draft`, is corrected under this plan and submitted again.
  The plan stays `active` until both are approved, then `done`.
- The branch is merged into `main` by the approver, or on the approver's word.

## Execution Notes

- 2026-10-09: run from a separate worktree so as not to interfere with the session working on
  task-011 (plan-015 W6) in the main checkout. plan-020, dl-011 and dl-012 were the next free ids
  on `main` at `706adeb`; a parallel `memory add` of the same types on another branch would collide,
  to be checked at merge.
- 2026-10-09: the second request (feedback pack) arrived while the plan was being opened; the plan
  was re-created with a title covering both captures before any body was committed.
- 2026-10-09: dl-011 (`3fda19e`, `0e15766`) and dl-012 (`042743c`, `33d5900`) filled and submitted,
  both `pending`, each with its proposal, its acceptance criteria (AC-1…AC-9, FA-1…FA-9), the
  amendments it implies and the charter and tasks it opens later. Waiting for the approver's ruling.
