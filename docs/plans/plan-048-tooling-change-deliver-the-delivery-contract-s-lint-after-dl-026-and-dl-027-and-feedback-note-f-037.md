---
id: plan-048-tooling-change-deliver-the-delivery-contract-s-lint-after-dl-026-and-dl-027-and-feedback-note-f-037
type: plan
title: "tooling-change deliver: the delivery contract's lint after dl-026 and dl-027, and feedback note F-037"
status: draft
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","W8"]
---

## Context

plan-047 (`pack-cycle › charter` of `methodology/scrum`, done 2026-10-26) accepted
`pack-methodology-scrum` and had the approver approve dl-026 and dl-027, which amend `software`'s
`delivery` contract, spec-001 §2, §9, §11 and §18, and `pack-foundation-software` in place. Two
items they name are owed before `scrum`'s `author` can put the pack in `packs/`:
- **dl-026 D3 and dl-027 D3, the lint.** `life-cycle-includes` (`src/workflow-rules.ts`) checks
  today that a methodology's `workflows/delivery.yaml` itself includes `release` and
  `retrospective`. `scrum`'s `delivery` includes them through its `sprint` sub, so the composer
  and the lint refuse the accepted charter's shape (plan-047's draft: "must include release by
  name"). The rule as amended walks the pack's own includes from `delivery` and also checks the
  part, cycles, and the `where` of every phase that includes `release`
  (`status: [in-development, releasing]`, each other key a field of the composed `release`).
- **dl-027 D5, `methodology/fixture`'s `where`.** `tests/fixtures/software-exit/packs/methodology/
  fixture/workflows/delivery.yaml` iterates over `status: [in-development]`, which stalls a release
  after `enter-releasing` on WingFoil 0.3.0. plan-046's session, which owned the fixture, agreed on
  2026-10-26 that this plan changes it: `npm run validate -- --overlay tests/fixtures/software-exit`
  stays at 7 runs, 0 failed, and the fixture README's generated sections stay in step.
- **dl-026 D5, feedback note F-037** (`wingfoil-cli` rule 3): on WingFoil 0.3.0 a phase that
  completes other than vacuously closes every earlier live phase, so an `iterate_over` phase does
  not take candidates added after a later phase progressed; the note asks for a phase that stays
  open to new candidates. Reproduced on 2026-10-26 with 0.3.0 alone, on `init --template Kanban`.

The approver's rulings (2026-10-26, in chat):
1. Proceed with task-051 and task-052, the ids agreed with plan-046's session (task-053 onwards,
   plan-049, dl-028, bug-007 and F-038 are reserved for the session that patches `base`).
2. **F-037 waits** (option (a) of the review): `assertNumbering` (`tests/support/inbox.ts`) requires
   the notes numbered with no gap, and F-035 and F-036 are reserved for the coordinating session's
   request (dl-024, dl-025), owed after W9. task-052's body is written, reviewed and accepted into
   the backlog here; its build starts only once F-035 and F-036 are on `main`, under the plan that
   writes them or the next `tooling-change` plan after it, which takes task-052 over. This plan
   closes on task-051. Rejected: renumbering the reservation (b), a test that admits reserved
   gaps (c).

Who runs what: claude drafts for the product-owner (`plan`) and is the developer of both tasks; the
reviewer is an independent subagent (dl-017), never the author's context; claude never runs
`memory approve` or `reject` and hands the approver the command.

Not in this plan: `scrum`'s `author` (a `pack-cycle` plan once this one is done); `base`'s patch
for bug-005 and bug-006 (plan-046's session); W9's publication; the `pack-authoring` directive's
slot rule (`.wingfoil/directives/custom/pack-authoring.md`), which still says `delivery` includes
`release` and `retrospective` "by name": its update to dl-026 and dl-027 is a configuration step of
`scrum`'s `author` plan, before its first task.

## Steps

On branch `plan/plan-048-lint-and-f-037` for this plan and both task bodies; each task's build on
its own branch `task/<id>`, from `main`, one after the other (WIP limit one).

1. **This plan and the two task bodies:** written, each independently reviewed (dl-017), amended,
   the plan submitted (`draft → active`), the tasks submitted (`draft → pending`); the branch
   pushed, its CI recorded, merged on the approver's OK; the approver accepts the tasks
   (`pending → backlog`).
2. **task-051, the lint** (`tooling-delivery`, `pack: ""`, red first, dl-018): `life-cycle-
   includes` after dl-026 D3 and dl-027 D3, its tests, `methodology/fixture`'s `where` (dl-027 D5),
   and the count of tests the change moves; `validate --overlay tests/fixtures/software-exit` at 7
   runs, 0 failed.
3. **task-052, F-037** (`tooling-delivery`, `pack: ""`): the note in `docs/wingfoil-feedback/`, in
   dl-163's format (`kind: request`), reproducible with WingFoil 0.3.0 alone, and its ledger row.
4. **Close:** at task-051's merge, the plan lists the wave's errata and rulings per
   tech-spec (dl-020; spec-001 is not changed by this plan, so nothing to fold back) and goes
   `active → done`; the merges reported to plan-046's session and to the coordinating session
   (F-037).

## Handoff

- **claude:** steps 1–4, except the approver's gates.
- **Approver:** the ruling (given); each task's backlog acceptance, `approve` at `in-review`, and
  the merge OK.
- Done when task-051 is `done` on `main`, pushed, and task-052 is in the backlog, handed over as
  ruling 2 says.

## Execution Notes

- 2026-10-26: written; `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-26: independent review of the plan and both task bodies: plan request changes (F-037
  cannot land while F-035 and F-036 are missing), tasks approve after amendments. The approver ruled
  2 (F-037 waits); amended: the dl-020 account at close, `pack-authoring`'s slot rule owned by
  `scrum`'s `author`, the task bodies (fixtures, the composed `release`'s fields, the composer,
  red first, F-018). Focused re-review requested.
