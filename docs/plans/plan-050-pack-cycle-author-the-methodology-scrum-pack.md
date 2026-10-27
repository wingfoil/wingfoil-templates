---
id: plan-050-pack-cycle-author-the-methodology-scrum-pack
type: plan
title: "pack-cycle author: the methodology/scrum pack"
status: active
workflow: "pack-cycle"
phase: "author"
tags: ["packs","scrum","methodology","W9"]
---

## Context

The `author` phase of `pack-cycle` for `pack-methodology-scrum`, accepted on 2026-10-26 under
plan-047 (rulings 1–16, open points 1–3 as written). WingFoil UI adopts `base`, `software` and
`methodology/scrum` together; `software` can be published only with a methodology in `packs/`
(plan-046 ruling 6). This plan writes `packs/methodology/scrum` from the charter. Publication is
`first-release` (W9), after it.

**Preconditions, met.**
- The charter is `accepted`; dl-026 and dl-027 are `approved`, and `software`'s `delivery` contract,
  spec-001 §2, §9, §11 and §18 are amended in place (plan-047).
- The lint and the composer follow dl-026 and dl-027 (task-051, plan-048, `done`): a methodology's
  `delivery` may reach `release` and `retrospective` through its own sub-workflows, and a phase
  including `release` iterates with `status: [in-development, releasing]`.
- `software` is written (plan-046, `done`); `base` 1.0.0 is published, and plan-049 (another
  session) is releasing `base` 2.0.0, the fixes of bug-005 and bug-006, before `software`'s and
  `scrum`'s first release (plan-049 ruling 5). The fixes are already on `main` (task-054,
  `52db4dc`), `base`'s `pack.yaml` still at 1.0.0 until plan-049's `prepare`.
- plan-047's runs on WingFoil 0.3.0 proved the charter's shape in a scratch repository (the draft
  stays untracked, never committed).

**The approver's rulings** (2026-10-27, the outline approved in chat, as recommended):
1. **`base@^1` now, `^2` by whoever comes second.** `scrum` is written on `base@^1`. plan-049's
   `prepare` moves every `base@^1` to `base@^2` (its ruling 3): if `packs/methodology/scrum` is on
   `main` by then, plan-049 moves it, and this plan records the move in the charter's Execution
   Notes and amends its `requires` and body (Purpose, Compatibility); otherwise the task that adds
   the pack writes `base@^2`. If `scrum` is first, the cascade also covers
   `packs/methodology/scrum/pack.yaml` and its README's Requires line (regenerated), any `base@^1`
   in `tests/fixtures/examples/{software,scrum}/` and `tests/fixtures/scrum-exit/`, and the charter;
   plan-049's session is told these sites. The order of the merges is agreed with that session.
2. **The exit criterion's compositions** live in a new overlay, `tests/fixtures/scrum-exit/`, with
   compositions only (no pack: `scrum` is in the tree), one per distinct parameter set of the four
   governed software repositories, as task-049 chose them in `tests/fixtures/software-exit/`; a CI
   step validates it. `software-exit` stays as it is, for `software` through its fixture
   methodology.
3. **The run on WingFoil 0.3.0** is by hand, recorded in its task's Execution Notes, as the
   charter's Acceptance says; extending plan-049's scripted-run tooling (its task-053) to `scrum` is
   a later tooling task, not this plan's.
4. **Publication** is W9's, with `software`, after `base` 2.0.0: not in this plan.

**The configuration step, before the first task** (plan-048's handover): the `pack-authoring`
directive's slot rule says `delivery` includes `release` and `retrospective` "by name"; it is
brought to dl-026 and dl-027 (directly or through the methodology's own sub-workflows; the phase
including `release` iterates with `status: [in-development, releasing]`; the directive carries no
version field to bump), reviewed independently, and committed on this plan's branch; `npm run -s
wingfoil -- directives list` with no warning after it.

**The tasks.** task-055 and task-056 run through `kanban-delivery` (`pack:
pack-methodology-scrum`, pack-author); task-057 too, being a check of the pack. Each on its own
branch `task/<task id>` from `main`, one after the other (WIP limit one); task-058, task-059 and
dl-029 are reserved for a split or a ruling (agreed with plan-049's session).
- **task-055 — the pack and the examples now due:** `packs/methodology/scrum` as the charter fixes
  it: `pack.yaml` (`methodology/scrum`, `requires: [base@^1, software@^1]` or `^2` by ruling 1,
  `formats`, `requires_capabilities: [workflow-engine]`, the parameters `sprint_length`,
  `sprint_path`, `sprint_id`, `contents`); `fragments/roles.yaml`; `fragments/memory.yaml` (the
  `sprint` type with `limits: { active: 1 }`, the `task` and `release` tightenings); the `sprint`
  Memory template (declaring `id`); the workflows `delivery`, `sprint`, `backlog-item`; the
  directives `scrum` and `definition-of-done`; `agents/section.md`; `CHANGELOG.md`; `README.md` per
  spec-002 §2, with the Scrum Guide 2020 and the adaptations in "Sources and adaptations". Since
  `packs/` then holds a methodology, CB-2's exemption line falls (spec-002 §2.4,
  `src/example-rules.ts`: the line is refused once a `methodology/*` pack loads): the same change
  brings README examples, fictional projects only, under
  `tests/fixtures/examples/software/<example>/` and `tests/fixtures/examples/scrum/<example>/`, each
  pack getting one on its parameters' defaults and one carrying values like UI's; `software`'s
  section 7 is rewritten from the exemption line to its examples. `base`'s README and examples do
  not change: its examples compose `base` alone, with no methodology, and its section 7 holds no
  exemption line; this departs from the charter's "`base`'s README then changes", recorded in its
  Execution Notes at close. The lint, the index and `npm run validate` pass; WingFoil 0.3.0 accepts
  every composition with no warning.
- **task-056 — the exit criterion** (the charter's Acceptance; dl-022 S6 for `software`, now with
  a real methodology): `tests/fixtures/scrum-exit/compositions/<set>/example.yaml`, one per
  distinct parameter set of WingFoil, UI, Benchmark and this repository, the values copied from
  `tests/fixtures/software-exit/compositions/` (task-049) with `methodology/scrum` in place of
  `methodology/fixture`; `npm run validate -- --overlay tests/fixtures/scrum-exit` with no failed
  run and no warning on 0.3.0 (`tolerance applied: none`), and its CI step, the test that pins the
  CI's overlay commands (`tests/ci-workflow.test.ts`) extended red first (dl-018), a developer
  change under `tests/` and `.github/` inside a pack task, as task-047's. Its Execution Notes state
  which repository each composition matches, from task-049's. Exit-criterion compositions, not
  README examples.
- **task-057 — the run on 0.3.0** (the charter's Acceptance): a scratch repository, `base`,
  `software` and `scrum` composed from `main` and committed, WingFoil 0.3.0 driving
  `sw-life-cycle` through two Sprints and two releases, one release spanning both Sprints and
  completing in Sprint 2 only after its Sprint Backlog is done or moved, with no `late` element.
  `base` composed from `main` carries the fixes of bug-005 and bug-006 (task-054): the run records
  the commit it composed, and uses the workarounds only if it composes the tag `base@1.0.0`. The
  commands, their output and exit codes recorded in the task's Execution Notes; nothing committed
  but the task's notes. A finding that the charter's shape does not hold goes to the approver
  (dl-019); a defect of the pack it finds is fixed in task-057 itself if small, or in task-058
  through the plan's gate.

`packs/methodology/scrum` moves the counts the tooling tests take on this repository (index, lint,
validate), as `packs/software` did in task-047; the task that moves them states it (dl-018). Each
task runs `npm run index`, so the README's generated sections are never written by hand
(`pack-authoring`). Section 3 ("Install and update") opens with spec-002 §2.3's temporary mark and
gives the hand-adoption steps of the charter's Adoption, with no WingFoil CLI command in code
(CB-3).

Who runs what: claude drafts for the product-owner (`plan`) and is the pack-author of the tasks
and the developer of the configuration step and of any change under `src/`, `tests/` or
`.github/`; the reviewer is an independent subagent (dl-017), never the author's context; claude
never runs `memory approve` or `reject` and hands the approver the command.

Not in this plan: `scrum`'s and `software`'s first release and the sequencer's amendment (W9);
`base` 2.0.0 (plan-049); task-052 (F-037, waiting for F-035 and F-036); the charter's open points
(UI's adoption plan decides open point 1; `base`'s patch settles open point 2).

## Steps

On branch `plan/plan-050-scrum-author` for this plan and the configuration step; each task on its
own branch.

1. **This plan:** an independent review (dl-017), amended, submitted (`draft → active`).
2. **The configuration step** above: `pack-authoring`'s slot rule, reviewed independently.
3. The branch pushed, its CI recorded, merged on the approver's OK (coordinated with plan-049's
   session).
4. **task-055, task-056, task-057**, each: body written, reviewed, submitted (`draft → pending`),
   accepted into the backlog by the approver, Design, build, review, `in-review`, approved, merged,
   `done`, each merge coordinated with plan-049's session.
5. **Close:** the account per tech-spec (dl-020) for this plan, reported to W9's plan, which takes
   up `scrum`'s publication (W8 was closed by plan-046): "none amended" if no tech-spec changes;
   the charter's Execution Notes (the pack written, task-056's run counts, task-057's summary and
   commit, `base`'s README unchanged, any move to `base@^2` with its `requires` and body amended);
   the plan `active → done`; the merges reported to plan-049's
   session, UI's session and the coordinating session.

## Handoff

- **claude:** steps 1–5, except the approver's gates.
- **Approver:** the rulings 1–4 (given); each task's backlog acceptance, its `approve` at
  `in-review` and its merge OK; the merge OK of step 3.
- Done when task-055, task-056 and task-057 are `done` on `main`, pushed.

## Execution Notes

- 2026-10-27: written; `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-27: the configuration step (`1560d66`). Independent review of the plan and the step:
  plan approve after amendments (one blocking: task-056 must ask for no warning, as the charter),
  step approve after amendments. Amended: the base fixes already on `main`, the examples' layout and
  `base`'s unchanged README, the cascade's sites, the CI test, the matching notes, the account,
  where a defect found by task-057 is fixed; the directive's wording. Focused re-review requested.
- 2026-10-27: focused re-review: approve (plan and directive); tagged `W9`, the wave its account
  reports to (W8 closed with plan-046). Plan submitted.
