---
id: plan-022-decision-log-ingest-capture-the-conventions-the-base-pack-fixes-and-the-end-of-the-base-notes-file
type: plan
title: "decision-log-ingest capture: the conventions the base pack fixes, and the end of the base notes file"
status: active
workflow: "decision-log-ingest"
phase: "capture"
tags: ["process","decision-log","base"]
---

## Context

The `capture` phase of `decision-log-ingest`, started on 2026-10-10 on the approver's request in
chat. Two inputs for `base`'s charter (dl-003) have no Memory element:
- section 2 of the working note `docs/notes/base-regeneration-inputs.md` (the review of the first
  attempt's `base` 0.1.0, 2026-10-05): per-type paths, the meaning of `paths.governance`, the bug
  state `fixed`, the agent name;
- eight naming points relayed on 2026-10-09 by the session bootstrapping a new consumer project
  on WingFoil 0.2.2, which aligns with `base` before `base` exists and had to choose where the
  governed repositories diverge.

The note was meant to stay out of git (dl-005 G3), but commit `8b7f782` (2026-10-10) added it to
`main`. The approver chose to move what matters in it into the corresponding Memory elements,
update the references, and delete the file.

What the note holds, and where it goes:
- §1, the `format:` key (WingFoil dl-149): already in spec-001 (§5, O4, O11, `compat.yaml`'s
  `format_key`). Nothing to move;
- §2, the review of `base` 0.1.0: the `{release}`/`{scope}` tokens are in spec-001 §8.3; the
  `service` clash in `06_features.md` F4.6; `waiting` states in dl-003 D3; the AGENTS.md markers in
  dl-003 D8 and F-014. The rest (per-type paths, `paths.governance`, bug `fixed`, agent name) goes
  to dl-015;
- §3, the regeneration process: superseded by the workflows (`sw-life-cycle` › specification,
  `pack-cycle`, `pack-release-cycle`). Nothing to move.

## Steps

1. **claude (facilitator):** dl-015 (`memory add`, then body): the conventions `base` fixes, one
   point per convention, each with the alternatives found in the governed repositories, this
   repository's current value, the consumer's provisional choice and the proposal. Commit the body,
   then `submit` (`draft → pending`).
2. **claude:** an Execution Note in each element that cites the note — dl-003, dl-005, spec-001,
   task-009, plan-001, plan-008, plan-012 — pointing to where its content now lives. Approved and
   done bodies stay as written: they record what was true when approved (precedent: task-010).
3. **claude:** delete `docs/notes/base-regeneration-inputs.md`, in its own commit.
4. **claude:** this plan's Execution Notes; `submit` (`draft → active`).

## Handoff

- **claude:** steps 1–4, on the branch `dl/dl-015-base-conventions`, from `main` at `d911417`, in a
  separate worktree so as not to interfere with the session that drives `main`.
- **Approver:** the merge of the branch; the ruling of dl-015, which can wait for `base`'s charter
  (M2), as dl-011…dl-013 wait for stable WingFoil contracts.
- The plan stays `active` until dl-015 is ruled, then `done`.

## Execution Notes

- 2026-10-10: dl-015 filled (`6646b94`) and submitted, `pending` (`140dd13`): C1–C11, the
  conventions `base` fixes, each with the governed repositories' values, this repository's, the
  consumer's provisional choice and the proposal. Its ruling waits for `base`'s charter (M2).
- 2026-10-10: Execution Notes added to dl-003, dl-005, spec-001, task-009, plan-001, plan-008 and
  plan-012, pointing to dl-015 and spec-001 (`7b495aa`, wording fixed afterwards); their bodies stay
  as approved. `docs/notes/base-regeneration-inputs.md` removed (`1aa50c3`); it stays readable in
  the history (`8b7f782`), which `main`'s protection does not allow to rewrite. The plan stays
  `active` until dl-015 is ruled.
