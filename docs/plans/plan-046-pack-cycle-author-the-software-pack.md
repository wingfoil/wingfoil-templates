---
id: plan-046-pack-cycle-author-the-software-pack
type: plan
title: "pack-cycle author: the software pack"
status: draft
workflow: "pack-cycle"
phase: "author"
tags: ["packs","software","W8"]
---

## Context

The `author` phase of `pack-cycle` for `pack-foundation-software` (`accepted` on 2026-10-20,
plan-041, with its open points 1–3 as written), after `base`'s (plan-043) and its first release
(plan-044), as plan-043 ruling 4 set. WingFoil UI adopts `base`, `software` and a Scrum
methodology together, and WingFoil plans to adopt both foundation packs; this plan writes
`packs/software` from the charter. Publication is `first-release` (W9), after it.

**Preconditions, met.** The charter is `accepted`; `base` 1.0.0 is published (plan-044); plan-045
closed the follow-ups of that release, among them spec-001 §7.5's `template.frontmatter.required`,
which the merge now enforces on every type a pack defines, and the tests' isolation from the
environment. The tooling implements the foundation packs, the conditional part and the memory keys
(plan-039, plan-040); `compat.yaml` lists WingFoil 0.3.0 with `workflow-engine`, which `software`
requires, and the matrix runs it (plan-042). Only 0.3.0 is selected: 0.2.2 lacks `workflow-engine`.
spec-001 and spec-002 hold no open erratum but §8.3's `{release}` note, owned by W8 and folded back
at its close, which this plan is (step 4).

**What makes this plan differ from plan-043.** `software` cannot be composed without a methodology
(spec-001 §3), and `packs/` holds none. So even the smallest `software` WingFoil accepts needs the
exit criterion's fixture methodology (R-12): `sw-life-cycle` includes `delivery`, whose contract
includes `release` and `retrospective`. `npm test` runs WingFoil's stub; the real 0.3.0 runs only
in `npm run validate` and the CI. And `software`'s examples cannot live in this tree, where they
would compose a methodology that is not there (the charter's CB-2 exemption, examples due at W10).
A way to compose this tree's `base` and `software` with packs that exist only under
`tests/fixtures/`, and to run the result through 0.3.0 in the CI, comes first.

**The approver's rulings** (2026-10-24, the outline approved in chat, as recommended):
1. **An overlay for `validate`** (A): `npm run validate -- --overlay <dir>` composes this tree's
   packs together with the packs and examples of a directory under `tests/fixtures/`, and validates
   each composition in the matrix. An overlay is never publishable: `validate:publication` refuses
   it, and the index, the catalog and the publication ignore it. Rejected: a CI script assembling
   a temporary tree (no local check during the pack tasks), and git symlinks in the fixture (the
   digest and the lint read files).
2. **Tooling first, then three pack tasks** (B), each pack task leaving a `software` that WingFoil
   0.3.0 accepts through the overlay.
3. **One example per distinct parameter set** (C), as task-039: the four governed software
   repositories (WingFoil, UI, Benchmark, this repository) whose values coincide share one example;
   the count is confirmed at task-049's backlog acceptance.
4. **W8's close in this plan** (D): spec-001 §8.3's `{release}` fold-back, as its own task, and
   `pack-cycle`'s `activate` wording, as a configuration step, both before `software`'s
   `first-release`, which runs `activate`.
5. **`methodology/scrum`'s charter in parallel** (E): its own plan, plan-047
   (`pack-cycle › charter`), in another session on its own worktree; it depends only on the
   `delivery` contract of `software`'s accepted charter. This plan holds task-046 to task-050;
   numbers beyond them are agreed between the two sessions.
6. **W9, not decided here** (F): a tag of `software` runs `validate:publication`, which fails on a
   tree with no composition, and an overlay does not count; `software`'s `first-release` therefore
   needs a methodology in `packs/`. The recommendation, for W9's plan, is to publish `software` and
   `scrum` in the same wave, which matches WingFoil UI's adoption of the three together.

**The fixture methodology** (plan-041 ruling 12, on the model of the golden tree's
`methodology/flow`): `tests/fixtures/software-exit/packs/methodology/fixture/`, id
`methodology/fixture`, `requires: [software@^1]`, `delivery` in `contents` (spec-001 §6.5). Its
`delivery` follows the charter's contract: `kind: sub`, no `element`; a phase creates a `release`
and moves it to `in-development` (the type has no gate; how WingFoil 0.3.0 moves it is task-047's
Design); a phase includes `release` with `iterate_over: release` and
`where: { status: [in-development] }`; a phase includes `retrospective`. No catalog entry, no tag,
no publishable README: it exists only as a test fixture.

**The tasks.** Each runs through `kanban-delivery` (`pack: pack-foundation-software`), on its own
branch `task/<task id>` from `main`, one after the other (WIP limit one):
- **task-046 — the overlay (tooling, red first):** `--overlay <dir>` in `validate`, as ruling 1
  states, with its tests on WingFoil's stub and the golden tree, and `validate:publication`'s
  refusal; dl-018 R1–R3, the red run recorded. The CI step for `software` comes with task-047, when
  the pack exists.
- **task-047 — the smallest valid `software`:** `packs/software/pack.yaml` (id `software`, no
  `axis`, `version: 1.0.0`, `requires: [base@^1]`, `formats` for the kinds it ships,
  `requires_capabilities: [workflow-engine]`, the charter's eight parameters, `contents`);
  `fragments/dna.yaml`, `fragments/roles.yaml`, `fragments/memory.yaml` with the five types as the
  charter fixes them, each with `template.frontmatter.required`; the five Memory templates; the
  `determinism` directive; `sw-life-cycle` (`main`) and everything it reaches: the `inception`,
  `specification` and `end-of-life` defaults, `release`, `release-submit` and `release-publishing`;
  `CHANGELOG.md`; `README.md` per spec-002 §2, whose section 7 holds the CB-2 exemption line; the
  fixture methodology; and a CI step validating the overlay. It composes through the overlay,
  passes the lint, and WingFoil 0.3.0 accepts it with no warning. It is larger than task-037,
  because the main workflow reaches nearly every workflow; its Design may propose a split, the new task through `plan` and the approver's gate (dl-018 R3).
- **task-048 — the rest:** `adr-ingest`, `bug-ingest`, each phase with its role, actions,
  approval, fallback and `produces` (R4); `agents/section.md` (spec-001 §10, R-10).
- **task-049 — the exit criterion** (dl-022 S6): under the overlay, one example per distinct
  parameter set of WingFoil, UI, Benchmark and this repository (ruling 3), each a fictional project
  carrying the repository's real path and id values, `base`'s and `software`'s, copied from its
  public repository at a commit the Design names, with fictional approver and agent identities that
  WingFoil 0.3.0 accepts. Each composes and validates on 0.3.0 with no warning, through the overlay
  and the CI. Its Execution Notes record which example matches which repository. The Design checks
  first whether 0.3.0 accepts every value as given (for example WingFoil's `release_id`,
  `{kind}-{version}`, whose token is not in `software`'s required frontmatter); an exit criterion
  found unsatisfiable goes to the approver when it is found (dl-019).
- **task-050 — spec-001 §8.3's `{release}` fold-back** (dl-020): §8.3 cites, for the project
  tokens `{release}` and `{scope}`, a note this repository no longer holds (its Execution Notes' 2026-10-10
  entry); it is amended in place to state `{release}` as `software`'s charter defines it (a task's
  `release` field, as WingFoil does) and where `{scope}` is defined. Approved by the task's merge
  OK, as task-044.

`packs/software` moves the counts the tooling tests take on this repository (index, lint,
validate), as `packs/base` did in task-037; the task that moves them states it, under dl-018
R1–R3. Each task runs `npm run index`, so the README's generated sections are never written by
hand (`pack-authoring`). Section 3 ("Install and update") opens with spec-002 §2.3's temporary
mark, links `CATALOG.md#install`, and gives the hand-adoption steps (F6.1, the charter's Adoption)
with no WingFoil CLI command in code (CB-3).

Who runs what: claude drafts for the product-owner (`plan`) and is the pack-author (`design`,
`build`, `deliver`), and the developer for any change under `src/`, `tests/` or `.github/` and of
the configuration step; the reviewer is an independent subagent (dl-017), never the author's
context; claude never runs `memory approve` or `reject` and hands the approver the command.

Not in this plan: `software`'s `first-release`, its catalog entry and tag, and the notices owed to
the coordinating session and to WingFoil UI at the tag (W9, ruling 6); `methodology/scrum`'s
charter (plan-047, ruling 5); the foundation packs' `retrospective`, after `software`'s
`first-release`; this repository's adoption (W9); what is owed after W9 (plan-022's close, dl-024,
dl-025, F-035, F-036, the first sync of the feedback inbox).

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`). A finding that changes a ruling goes to the approver.
2. **Each task**, task-046 to task-050 in order, through `kanban-delivery`:
   1. `plan`: its body (Context, Acceptance), reviewed independently and amended while `pending`;
      the approver accepts it into the backlog;
   2. `design`: its Design committed on `main`, then `backlog → in-progress`;
   3. `build` on `task/<task id>`: pack content is checked by the lint, the composition and the
      matrix, not by red-first tests (dl-018, pack tasks); any change under `src/`, `tests/` or
      `.github/` follows dl-018 R1–R3, its red run recorded. The checks from a clean clone on
      Node.js 22.21 and 22.12.0: `npm ci`, `npm test`, `npm run lint`, `npm run check:pins`,
      `npm run check:schemas`, `npm run check:packs`, `npm run index -- --check`,
      `npm run validate` with the matrix on WingFoil 0.3.0 and no warning, from task-047 also
      `npm run validate -- --overlay tests/fixtures/software-exit`, and `workflow list`; the
      privacy grep of plan-041 on the diff;
   4. `review`: an independent review of the branch, its findings fixed, a re-review when a fix
      changes behaviour; the branch pushed, the CI run's conclusion recorded,
      `in-progress → in-review`; the approver accepts it and gives the merge OK;
   5. `deliver`: `--no-ff` merge into `main`, `approved → done`, `main` pushed and its CI's
      conclusion read (a red run from an advisory is a bug and a task, as bug-003), the branch
      removed; this plan's Execution Notes record it.
3. **Configuration** (ruling 4), after task-049: `pack-cycle`'s `activate` reads "First version
   published" and its pre-check names the pack's tag and its `catalog.yaml` entry, not a `released`
   `pack-release` (which since `memory.yaml` v6 means authorized); independent review, then a
   commit on `main`, `workflow list` with no warning.
4. **Close:** the charter's Execution Notes record the pack written and the exit criterion met;
   per tech-spec, the errata and rulings recorded in W8 and their fold-back (dl-020); this plan
   goes `active → done`; `first-release` can be planned.

## Handoff

- **claude:** steps 1–4, except the approver's gates.
- **Approver:** each task's backlog acceptance, its acceptance after the build, its merge OK; any
  ruling a review or the build finds needed (dl-019).
- Done when `packs/software` on `main` composes and validates on WingFoil 0.3.0 through the
  fixture methodology with an example for every distinct parameter set of the four governed
  software repositories, in the CI; spec-001 §8.3 is folded back; `pack-cycle`'s `activate` reads
  "published"; all pushed, `main`'s CI `success`.

## Execution Notes

- 2026-10-24: written; `workflow` and `phase` filled by editing the draft (W-02). The approver gave
  the OK to the outline in chat; rulings 1–6 as recommended.
