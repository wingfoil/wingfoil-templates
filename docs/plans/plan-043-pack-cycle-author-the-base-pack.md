---
id: plan-043-pack-cycle-author-the-base-pack
type: plan
title: "pack-cycle author: the base pack"
status: draft
workflow: "pack-cycle"
phase: "author"
tags: ["packs","base","W8"]
---

## Context

The `author` phase of `pack-cycle` for `pack-foundation-base` (`accepted` on 2026-10-20, plan-041),
on the approver's request in chat on 2026-10-21, with priority over `software`: WingFoil UI asked to
adopt `base` before its own v0.3 planning, and WingFoil plans to adopt both foundation packs at its
patch v0.3.1 (WingFoil dl-186). This plan writes `packs/base` from the charter; publication is
`first-release` (W9), after it.

**Preconditions, met.** The charter is `accepted` and dl-023 and dl-015 are `approved` (plan-041);
spec-001 and spec-002 hold no open erratum but §8.3's `{release}` note, owned by W8 and folded back
at its close (plan-041); the tooling implements the foundation packs, the conditional part and the
memory keys (plan-039, plan-040); `compat.yaml` lists WingFoil 0.3.0 with `workflow-engine`, which
`base` requires, and the matrix runs it (plan-042).

**The approver's rulings** (2026-10-21):
1. three tasks, in order: task-037 (the pack's skeleton and data), task-038 (its workflows,
   directives and AGENTS.md section), task-039 (its exit criterion, dl-022 S6);
2. `base`'s README uses spec-002 §2.4's exemption while the tree holds no methodology; its
   examples come with W10, as the charter says;
3. `software`'s `author` follows this plan, as its own plan;
4. `base` is published on its own as soon as it is ready (`first-release`), without waiting for
   `software`.

**The tasks.** Each runs through `kanban-delivery` (`pack: pack-foundation-base`), on its own branch
`task/<task id>` from `main`, one after the other (its WIP limit is one task in progress):
- **task-037 — skeleton and data:** `packs/base/pack.yaml` (id `base`, no `axis`, `version: 1.0.0`,
  `formats`, `requires_capabilities: [workflow-engine]`, the charter's nine parameters, `contents`);
  `fragments/dna.yaml` (project, `modules`, `stacks`, the roles, the approver member, the agent
  with no email), `fragments/roles.yaml` and `fragments/memory.yaml` (`defaults`, `decision-log`,
  `task`, `plan` as the charter and dl-023 fix them); the three Memory templates; `CHANGELOG.md`;
  `README.md` per spec-002 §2, with section 3's hand-adoption steps (F6.1) and §2.4's exemption;
  `catalog.yaml`'s `base` entry, `planned`. The pack composes alone and passes the lint, with its
  workflows still to come in task-038 (the README and `contents` grow with it).
- **task-038 — workflows, directives, AGENTS.md:** `decision-log-ingest`, `governance-evolution`
  (`main`), `retrospective`, `retrospective-periodic`, each phase with its role, actions, approval,
  fallback and `produces` (R4); the directives `traceability`, `doc-versioning`, `security-secrets`,
  `claim-sources`; `agents/section.md`. It settles the charter's open point 0 (whether WingFoil
  0.3.0's `memory.add` sets the `retrospective` tag), in the task's Design.
- **task-039 — the exit criterion:** `base` composes and validates on WingFoil 0.3.0 with zero
  warnings with the parameters of every governed project: a generic, fictional non-software
  fixture under `tests/fixtures/`, the parameter sets of WingFoil, UI, Benchmark and this
  repository; and a check against the three private, non-software projects run outside this
  repository, which records only its outcome (dl-022 S6).

Not in this plan: `software`'s `author` (the next plan); `first-release` and the tag (`pack-release`,
W9), and the notices owed to the coordinating session and to WingFoil UI at the tag; this
repository's adoption (W9).

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`). A finding that changes a ruling goes to the approver.
2. **Each task**, in order, through `kanban-delivery`:
   1. `plan`: its body (Context, Acceptance), reviewed independently and amended while `pending`;
      the approver accepts it into the backlog;
   2. `design`: its Design committed on `main`, then `backlog → in-progress`;
   3. `build` on `task/<task id>`: the tests of the tooling that checks the pack first, where the
      pack's acceptance is a command (dl-018's exceptions name the pack content itself); the
      checks from a clean clone on Node.js 22.21 and 22.12.0 (`npm test`, `npm run lint`,
      `npm run check:pins`, `npm run check:schemas`, `npm run check:packs`,
      `npm run index -- --check`, `npm run validate`), the matrix on WingFoil 0.3.0 with no
      warning;
   4. `review`: an independent review of the branch, its findings fixed, a re-review when a fix
      changes behaviour; the branch pushed, the CI run's conclusion recorded,
      `in-progress → in-review`; the approver accepts it and gives the merge OK;
   5. `deliver`: `--no-ff` merge into `main`, `approved → done`, `main` pushed, the branch removed;
      this plan's Execution Notes record it.
3. **Close:** the charter's Execution Notes record the pack written; this plan goes
   `active → done`; `first-release` can start.

## Handoff

- **claude:** steps 1–3, except the approver's gates.
- **Approver:** each task's backlog acceptance, its acceptance after the build, its merge OK.
- Done when `packs/base` on `main` composes and validates on WingFoil 0.3.0 with the parameters of
  every governed project, pushed.

## Execution Notes

- 2026-10-21: written; `workflow` and `phase` filled by editing the draft (W-02). The approver gave
  the OK to the outline and rulings 1–4 in chat.
