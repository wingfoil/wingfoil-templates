---
id: plan-055-dl-actions-dl-029-dl-031-dl-032-and-dl-033-the-configuration-changes-of-the-retrospective-of-2026-10-28
type: plan
title: "dl actions: dl-029, dl-031, dl-032 and dl-033, the configuration changes of the retrospective of 2026-10-28"
status: draft
workflow: "decision-log-ingest"
phase: "rule"
tags: ["process","dl-actions","retrospective"]
---

## Context

The `rule` phase of `decision-log-ingest` for four decision-logs of the retrospective of
2026-10-28 (plan-054, dl-028 C1, C3 … C5), all approved on 2026-10-29: their configuration changes,
applied here as each decision-log's last point says ("applied after approval by the dl actions plan
after plan-054"). Asked by the approver on 2026-10-29 ("prepare the plan, then we start it from a
new session").

- **dl-029** (T1 … T5): the periodic retrospective starts at the close of every
  `wingfoil-release-intake`, with the next planning date recorded and a seven-day bound when it is
  not known;
- **dl-031** (R1 … R6): one register of owed items, `docs/owed-items.md`, its rules in the
  directive `repository-practice`, its first content dl-028's debts backlog (D1, D2);
- **dl-032** (E1 … E5): runs on the real engine before a workflow-bearing charter is accepted, in a
  pack's exit criterion and before publication;
- **dl-033** (O1 … O4): `pack-cycle` activates a pack at its first tag and runs its `retrospective`
  after; a shared retrospective completes the phase by reference.

dl-030 is already applied (task-065, the directive `repository-practice` 1.0, `3b7aa96`); dl-028
has no configuration of its own beyond the register's content (D1, D2), which dl-031 R4 carries.

**Why now.** The decision-logs are approved; until dl-029 is applied, every intake's close must say
by hand whether a periodic retrospective is due (dl-029 T5). WingFoil's 0.3.2 may be released before
this plan closes: its intake applies T1 … T2 by hand if `wingfoil-release-intake` v5 is not on
`main` yet.

**Not in this plan:** dl-024 and dl-025 (`pending`); W10 (`methodology/kanban`, the adoption of the
packs, the WingFoil pin, the first inbox sync), where several register rows have their trigger; the
tooling task for the scripted full scrum run (dl-032 E5, a register row); amending any approved
body (each change is an Execution Note, the body stays as approved).

## Steps

On the branch `dl/dl-029-dl-033-actions`, from `main` at the commit that submits this plan; one
commit per row. Before every commit, the privacy check of `repository-practice` rule 2; after every
commit under `.wingfoil/` or `docs/memory/`, `npm run -s wingfoil -- workflow list` and
`npm run lint` exit 0.

| # | File | Change | Source |
|---|---|---|---|
| 1 | `.wingfoil/workflows/custom/wingfoil-release-intake.yaml` (4 → 5) | a last phase `retrospective-start` (role facilitator, no actions, as `recheck`): at the intake's close, the plan records WingFoil's next release planning date or "not known", and starts a periodic retrospective (on the 0.2.2 pin: adds its plan, `workflow: retrospective-periodic`) unless one, or one that counts as periodic, has closed since the release taken in, or the approver rules the patch case; its deadline (before the planning, else seven days after the close); `recheck`'s wording aligned with `record`, which recomputes the ranges at intake | dl-029 T1 … T3 |
| 2 | `.wingfoil/workflows/custom/retrospective-periodic.yaml` (1 → 2) | the header comment names T1's trigger and the counting rule (a `pack-cycle` retrospective with a `periodic` inventory) | dl-029 T1, T3 |
| 3 | `.wingfoil/workflows/custom/pack-cycle.yaml` (5 → 6, one bump for rows 3 and 4) | the phase order `charter`, `design`, `author`, `first-release`, `activate`, `retrospective`; `retrospective`'s description names the shared case and cites dl-033 O2 (the phase stays required; a covered pack completes it with its charter's note citing the approved decision-log) | dl-033 O1, O2, O4 |
| 4 | the same file | `charter`'s description: the run on the real engine before acceptance (E2); `author`'s: the exit criterion includes a run of the pack's workflows (E4) | dl-032 E2, E4, E5 |
| 5 | `.wingfoil/workflows/custom/pack-release-cycle.yaml` (7 → 8) | `validate`'s description and its `checks.post` line cite `check:runs` and the adoption run in the Validation section | dl-032 E3, E5 |
| 6 | `.wingfoil/directives/custom/pack-compatibility.md` (no version line) | the load-commands bullet extended: `check:runs` exits 0 on the oldest and newest compatible releases, a scenario per shipped `main` (or one reaching the pack's workflows), and the adoption run per `init` template for a pack whose README has install steps | dl-032 E3 |
| 7 | `.wingfoil/workflows/custom/retrospective.yaml` (4 → 5) | the header comment: "included by pack-cycle after a pack's activation" | dl-033 O4 |
| 8 | `docs/owed-items.md` (new) | the register: an open table (item, source, owner, trigger; rows sorted by source id) and a closed section; first content the inventory of 2026-10-28 §8 with dl-028 D1 and D2's rows; F-038, F-039 and the `finalize --dry-run` note in the closed section; plus the rows this plan's decision-logs name (the `pack-cycle` v6 check on the engine at the pin bump, dl-033 O4; the scripted full scrum run, dl-032 E5) | dl-031 R1, R4, dl-028 D1, D2 |
| 9 | `.wingfoil/directives/custom/repository-practice.md` (1.0 → 1.1, Date) | a rule 4 for the register: R1 (owner and trigger defaults), R2 (who writes a row and when; the note cites it), R3 (every retrospective reads it in `explore`), R5's rule after the pin bump (no number reserved in prose) | dl-031 R1 … R3, R5, R6 |
| 10 | `.wingfoil/dna.yaml` (10 → 11) | `docs/owed-items.md` added to `paths.governance` | dl-031 R6 |
| 11 | `.wingfoil/memory/templates/` `plan.md`, `task.md`, `pack.md`, `pack-release.md`, `bug.md`, `decision-log.md` | one line in each Execution Notes comment: an owed item gets its row in `docs/owed-items.md` (`repository-practice` rule 4) | dl-031 R6 |
| 12 | dl-006, dl-029, dl-031, dl-032, dl-033 | an Execution Note each: dl-006 for R3's trigger (dl-029 T3) and R1's order (dl-033 O3, superseding the notes of plan-044 ruling B and plan-052 ruling 6 as the reading of R1; those notes stay); the four others record their actions applied, with the commits. Bodies stay as approved | dl-029 T3, dl-033 O3 |

Then:
- **Checks:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `npm run
  lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check`, `check:runs`
  and `npm run -s wingfoil -- workflow list` exit 0; `npm run -s wingfoil -- directives list
  --format json` exits 0 with `"warnings": []`, `repository-practice` global.
- **Leftovers:** a grep of `.wingfoil/`, `docs/` (outside `docs/memory/` and `docs/plans/`) and the
  READMEs for "after `first-release`", "before `activate`" and the three load commands: every hit
  that contradicts dl-029 … dl-033 outside the rows above goes to the approver, not edited here.
- **Review:** an independent review of the branch by a subagent (dl-017), each row checked against
  its decision-log; its findings fixed; a re-review when a fix changes a rule.
- **Branch close:** push; the real CI conclusion recorded here; the privacy check of the branch's
  diff recorded; on the approver's OK, `--no-ff` merge into `main`, push, `main`'s CI conclusion
  read (the run that includes the merge, `repository-practice` rule 3), the remote and local branch
  removed. Any item this plan leaves owed gets its row in `docs/owed-items.md` before the close.

## Handoff

- **claude (facilitator):** every row and the branch close, except the approvals and the merge OK.
  It never runs `memory approve` or `memory reject`. No pull request. Files staged by name;
  `docs/notes/` and `.idea/` stay untracked. Repository texts follow `repository-practice`.
- **Approver:** this plan before `submit`; any leftover that contradicts a decision; the merge OK.
- **Start:** a new session, asked by the approver on 2026-10-29, reads this plan, dl-029 … dl-033,
  dl-028 (D1, D2), the inventory of 2026-10-28 (§8, P1 … P3) and `repository-practice`, then asks
  the approver's OK and submits this plan (`draft → active`).
- Done when rows 1 … 12 are on `main` with their checks, the review applied, the CI of the branch
  and of `main` read `success`, and the four decision-logs record their actions applied. The plan
  then goes `active → done`.

## Execution Notes

- 2026-10-29: written as asked by the approver on 2026-10-29, after plan-054's close;
  `workflow` and `phase` filled by editing the draft (W-02). Next free numbers when written:
  plan-056, task-066, dl-034, bug-009, prel-006, F-042.
