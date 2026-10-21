---
id: plan-043-pack-cycle-author-the-base-pack
type: plan
title: "pack-cycle author: the base pack"
status: active
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
at its close; the tooling implements the foundation packs, the conditional part and the memory keys
(plan-039, plan-040); `compat.yaml` lists WingFoil 0.3.0 with `workflow-engine`, which `base`
requires, and the matrix runs it (plan-042). Only 0.3.0 is selected for `base`: 0.2.2 lacks
`workflow-engine`, so the oldest and the newest compatible release are the same one.

**The approver's rulings** (2026-10-21, the first outline amended after this plan's review):
1. **Three tasks, each leaving a pack WingFoil 0.3.0 accepts** (N): task-037, the smallest valid
   `base`; task-038, the rest of its workflows and its AGENTS.md section; task-039, its exit
   criterion. A `base` with no workflow is refused (`E_NO_MAIN_WORKFLOW`), and its `roles.yaml`
   names its directives, so both come in task-037.
2. **No `catalog.yaml` entry now** (O): `first-release` adds `base`'s entry; `catalog.yaml` and its
   tests stay as they are. The one tooling test that moves is the index's file count on this
   repository, which a pack README raises; it changes inside task-037 under dl-018 R1–R3.
3. **`base`'s README has examples** (P), replacing the first outline's use of spec-002 §2.4's
   exemption: task-039's generic, fictional non-software project becomes an example of the README
   (`tests/fixtures/examples/base/<example>/`), and so do the parameter sets of the governed
   software repositories (WingFoil, UI, Benchmark, this repository). Every example names a
   fictional project, as spec-002 §2.4 and `pack-authoring` require: an example carries a
   repository's real path and id values in a fictional situation (for example a project keeping
   its tasks in a folder per release), and task-039's Execution Notes record which example matches
   which public repository. `npm run validate` and the CI
   then compose and validate `base` on WingFoil 0.3.0 on every push, CB-2 holds in full, and the
   publication has a documented combination (`pack-compatibility`).
4. `software`'s `author` follows this plan, as its own plan.
5. `base` is published on its own as soon as it is ready (`first-release`), without waiting for
   `software`.
6. **`template.frontmatter`** (Q): WingFoil 0.3.0 refuses a Memory type without it, which spec-001
   §7.5 lets a pack omit; the rule (lint or spec) stays pending (plan-042), and `base`'s three types
   declare it.

**The tasks.** Each runs through `kanban-delivery` (`pack: pack-foundation-base`), on its own branch
`task/<task id>` from `main`, one after the other (its WIP limit is one task in progress):
- **task-037 — the smallest valid `base`:** `packs/base/pack.yaml` (id `base`, no `axis`,
  `version: 1.0.0`, `formats` for the kinds it ships, `requires_capabilities: [workflow-engine]`,
  the charter's parameters but `retrospective_path`, which task-038 adds with its workflow,
  `contents`); `fragments/dna.yaml` (project, `modules`, `stacks`,
  the roles, the approver member and the agent from parameters only, the agent with no email),
  `fragments/roles.yaml`, `fragments/memory.yaml` (`defaults`, `decision-log`, `task`, `plan` as
  the charter and dl-023 fix them, each with `template.frontmatter`); the three Memory templates;
  the four directives (`traceability`, `doc-versioning`, `security-secrets`, `claim-sources`);
  `governance-evolution` (`main`); `CHANGELOG.md`; `README.md` per spec-002 §2, whose section 7
  holds §2.4's exemption line until task-039 replaces it. It composes, passes the lint, and
  WingFoil 0.3.0 accepts it.
- **task-038 — the rest of the workflows and AGENTS.md:** `decision-log-ingest`, `retrospective`,
  `retrospective-periodic`, each phase with its role, actions, approval, fallback and `produces`
  (R4); `agents/section.md`. Its Design settles the charter's open point 0 (whether WingFoil 0.3.0's
  `memory.add` sets the `retrospective` tag); the outcome goes into the charter's Execution Notes,
  and a negative one, which changes the accepted charter, to the approver (dl-019).
- **task-039 — the exit criterion** (dl-022 S6): the README's examples, one per parameter set: a
  generic, fictional non-software project, and four fictional projects carrying the path and id
  values of WingFoil, UI, Benchmark and this repository (copied from their public repositories),
  with fictional approver and agent identities that WingFoil 0.3.0 accepts (no real address in this
  repository; the Design names the address checked against 0.3.0, which refuses empty and reserved
  ones). Each example and its `example.yaml` land in the same commit (CB-2), and section 7 then
  drops the exemption line. Each composes and validates on 0.3.0 with no warning, through plain
  `npm run validate` and the CI. The check against the
  three private, non-software projects is run by claude outside this repository; task-039's
  Execution Notes record only its outcome (date, `base`'s commit, the WingFoil version, the number
  of projects, the commands with their values redacted, the exit codes, the warning count), never a
  name, path or value; a failure goes to the approver (dl-019).

Each task runs `npm run index`, so the README's generated sections are never written by hand
(`pack-authoring`). Section 3 ("Install and update") opens with spec-002 §2.3's temporary mark,
links `CATALOG.md#install`, and gives the hand-adoption steps (F6.1, the charter's Adoption) with no
WingFoil CLI command in code (CB-3).

Who runs what: claude drafts for the product-owner (`plan`) and is the pack-author (`design`,
`build`, `deliver`), and the developer for any change under `src/`, `tests/` or `.github/`; the
reviewer is an independent subagent (dl-017), never the author's context; claude never runs
`memory approve` or `reject` and hands the approver the command.

Not in this plan: `software`'s `author` (the next plan); `first-release`, the catalog entry and the
tag (`pack-release`, W9), with the confirmation of `CHANGELOG.md` and `version: 1.0.0` at its
`prepare`, and the notices owed to the coordinating session and to WingFoil UI at the tag; this
repository's adoption (W9); spec-001 §8.3's `{release}` fold-back, at W8's close after `software`'s
`author`.

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`). A finding that changes a ruling goes to the approver.
2. **Each task**, in order, through `kanban-delivery`:
   1. `plan`: its body (Context, Acceptance), reviewed independently and amended while `pending`;
      the approver accepts it into the backlog;
   2. `design`: its Design committed on `main`, then `backlog → in-progress`;
   3. `build` on `task/<task id>`: pack content is checked by the lint, the composition and the
      matrix, not by red-first tests (dl-018, pack tasks); any change under `src/`, `tests/` or
      `.github/` follows dl-018 R1–R3, its red run recorded. The checks from a clean clone on
      Node.js 22.21 and 22.12.0: `npm test`, `npm run lint`, `npm run check:pins`,
      `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check`, and
      `npm run validate` with the matrix on WingFoil 0.3.0 and no warning (from task-039 the
      README's examples; before it, `npm run validate -- base` with the four required parameters,
      its matrix lines recorded in the task's Execution Notes, since the CI composes nothing for
      `base` until the examples exist); the privacy grep of plan-041 on the diff;
   4. `review`: an independent review of the branch, its findings fixed, a re-review when a fix
      changes behaviour; the branch pushed, the CI run's conclusion recorded,
      `in-progress → in-review`; the approver accepts it and gives the merge OK;
   5. `deliver`: `--no-ff` merge into `main`, `approved → done`, `main` pushed, the branch removed;
      this plan's Execution Notes record it.
3. **Close:** the charter's Execution Notes record the pack written and open point 0's outcome; this
   plan goes `active → done`; `first-release` can start.

## Handoff

- **claude:** steps 1–3, except the approver's gates.
- **Approver:** each task's backlog acceptance, its acceptance after the build, its merge OK.
- Done when `packs/base` on `main` composes and validates on WingFoil 0.3.0 with the README's
  examples for every governed software repository and the fictional non-software project, and
  task-039 records the outcome of the private projects' check, pushed.

## Execution Notes

- 2026-10-21: written; `workflow` and `phase` filled by editing the draft (W-02). The approver gave
  the OK to the outline and its rulings in chat.
- 2026-10-21: independent review: request changes. As first outlined, task-037 would not pass the
  lint (its `roles.yaml` named directives from task-038) nor be accepted by WingFoil (no `main`
  workflow), nothing ran `base` through the matrix, a `planned` catalog entry broke tooling tests,
  and the README's exemption left the publication without a documented combination. The approver
  ruled N, O, P and Q (rulings 1, 2, 3 and 6 above); the rest applied. Re-review requested.
- 2026-10-21: re-review: approve after amendments. Applied: the examples name fictional projects
  carrying the repositories' real values (spec-002 §2.4, `pack-authoring`; no ruling needed);
  section 7's exemption line until task-039; each example lands with its README entry; the local
  `validate -- base` evidence before task-039; the fictional address checked in task-039's Design.
  Plan submitted.
- 2026-10-21, task-037's review: `packs/base` moves four assertions in three tooling tests (index,
  lint and validate counts on this repository), not ruling 2's one; the ruling's substance (no
  catalog entry) is unchanged. `retrospective_path` comes with task-038.
- 2026-10-21: task-037 `done`, merged (`b6e9755`): `packs/base` in its smallest valid form (14
  files), accepted by WingFoil 0.3.0 with no warning (`validate -- base …`: 1 run, 0 failed). CI run
  39590724856 `success`. task-038 next.
- 2026-10-21, task-038's review: the approver ruled R (the lint accepts an approval checkpoint
  phase, `pack-authoring` reworded, in task-038) and S (the `retrospective` tag selection kept,
  with its condition). Owed: feedback note **F-032** for WingFoil, after this plan, as its own
  task: suspending an instance (`parked`, dl-023 D1), closing a plan that is not an instance, and
  passing an action's arguments to its command (`memory.add`'s `tags`). WingFoil's v0.3
  retrospective (`19a66000`) covers none of them.
- 2026-10-21: task-038 `done`, merged (`c3af634`): `base`'s other workflows, its AGENTS.md section, the
  lint accepting an approval checkpoint (ruling R), open point 0 settled (ruling S). WingFoil 0.3.0
  accepts the full `base` with no warning. CI run 39624093976 `success`. task-039 next.
- 2026-10-21, task-039's review: three examples instead of plan-043's five (Benchmark's and this
  repository's sets equal the defaults; UI's differs from WingFoil's only by the retrospective
  folder), to be confirmed by the approver at the backlog acceptance. From task-039 on,
  `validate -- base --param …` on this repository is refused (the examples set those parameters):
  `software`'s author plan validates other values on a scratch tree, or a tooling follow-up lets
  `--param` apply to an `entries` composition only.
- 2026-10-21: task-039 `done`, merged (`ccc0bbb`): the README's three examples (the defaults, release
  folders, release folders without a retrospective folder), each composed and validated on
  WingFoil 0.3.0 with no warning by `npm run validate` and the CI; the private projects' check
  passed for all three. The CI's first run failed on an evidence test that relied on this
  repository's publication failing; it now uses a fixture tree. CI run 39633841077 `success`.
- 2026-10-21: closed. `packs/base` on `main` composes and validates on WingFoil 0.3.0 with the
  README's examples; the charter's Execution Notes record the pack written, open point 0's outcome
  (task-038, ruling S) and the exit criterion met (task-039). Owed after this plan: `first-release`
  of `base` (W9), feedback note F-032 as its own task, `software`'s `author`, and the
  `template.frontmatter` rule (lint or spec).

