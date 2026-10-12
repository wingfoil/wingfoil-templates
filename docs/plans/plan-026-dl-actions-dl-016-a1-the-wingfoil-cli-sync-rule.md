---
id: plan-026-dl-actions-dl-016-a1-the-wingfoil-cli-sync-rule
type: plan
title: "dl actions: dl-016 A1, the wingfoil-cli sync rule"
status: draft
workflow: "decision-log-ingest"
phase: "rule"
tags: ["config","retrospective"]
---

## Context

Action A1 of dl-016 (the periodic retrospective of 2026-10-12, `approved`), applied on the
approver's request in chat on 2026-10-12. Like plan-011, no workflow phase hosts this work: the
change is an action of an approved element.

Rule 7 of the `wingfoil-cli` directive (version 1.2) reads: "Run `wingfoil-sync` at every
`release-planning` and at every pin bump, and record the sync in `docs/wingfoil-feedback/README.md`".
No workflow of this repository is named `wingfoil-sync`, and none has a `release-planning` phase
(task-010 and plan-020 › Execution Notes; inventory §7). The text came word for word from the shared
directive text task-010's Acceptance 6 required, written for consumers whose own release cycle has a
`release-planning` phase. The inbox README still says "Last sync: none".

dl-016 A1: a correction of names that do not exist in the configuration; if choosing where the
sync runs changes when it runs, that choice is a decision-log of its own (dl-006 R2). What a sync
does is already fixed by rule 6 and the README: it sets `answered_by` and every status other than
`open` "only … from what WingFoil published".

Options for the wording, to be chosen by the approver when this plan is presented:
- **(a) Keep the cadence (recommended).** `release-planning` is read as WingFoil's release
  planning, the moment dl-006 R3 and dl-001 D6 already tie this inbox to: "7. Sync the inbox at
  every release planning of WingFoil and at every bump of the WingFoil pin: read what WingFoil
  published about this repository's notes (source key `svc-018`), set `status` and `answered_by`
  from it (rule 6), and record the sync under **Last sync** in `docs/wingfoil-feedback/README.md`."
  No name that does not exist; no new cadence; no decision-log.
- **(b) Tie the sync to this repository's workflows.** A `sync` step in `wingfoil-release-intake`
  (at each WingFoil release) and at every pin bump. It moves the sync from WingFoil's planning to
  its release, a change of cadence: a decision-log first (dl-016 A1), then the change.

## Steps

All on the branch `config/dl-016-actions`, from `main` at `274dd76`, shared with plan-027.

1. **claude:** rule 7 of `.wingfoil/directives/custom/wingfoil-cli.md` reworded as the approver
   chose; the directive's version 1.2 → 1.3, dated the day of the change; *Checked against* stays
   `wingfoil@0.2.2`. One commit. With option (b), this step waits for the decision-log's approval.
2. **claude:** checks: `npm run -s wingfoil -- directives list` exits 0 with no warning; `npm test`
   (the inbox tests read the directive's table) and `npm run lint` exit 0.
3. **claude:** an independent review of the change (dl-017 R1), its findings fixed.
4. **Branch close,** with plan-027: push, the real CI run's conclusion recorded here; on the
   approver's OK, `--no-ff` merge into `main`, push, the branch removed.

## Handoff

- **claude:** steps 1–4, except the merge OK. It never runs `memory approve` or `memory reject`.
- **Approver:** the choice of wording (a) or (b) when this plan is presented; the merge OK.
- Done when the reworded rule is on `main`, pushed. The plan then goes `active → done`.

## Execution Notes
