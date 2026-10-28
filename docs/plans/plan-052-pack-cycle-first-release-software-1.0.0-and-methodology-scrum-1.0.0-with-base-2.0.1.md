---
id: plan-052-pack-cycle-first-release-software-1.0.0-and-methodology-scrum-1.0.0-with-base-2.0.1
type: plan
title: "pack-cycle first-release: software 1.0.0 and methodology/scrum 1.0.0, with base 2.0.1"
status: draft
workflow: "pack-cycle"
phase: "first-release"
tags: ["packs","software","scrum","base","W9"]
---

## Context

The `first-release` phase of `pack-cycle` for `pack-foundation-software` and
`pack-methodology-scrum`, both `accepted`, both written on `main` (plan-046, plan-050) and not
published. `publish:pack` refuses a pack that no composition of the validation contains, and a
composition with `software` needs a methodology, so the two are published in the same wave
(plan-046 ruling 6). WingFoil UI adopts `base`, `software` and `methodology/scrum` together, and
WingFoil waits for `software` to adopt the foundation packs.

**Preconditions, met.**
- `base` 2.0.0 is published (plan-049: tag `base@2.0.0` at `6d04472`, catalog commit `16f53fa`);
  its charter `pack-foundation-base` is `active`. `software` requires `base@^2`;
  `methodology/scrum` requires `base@^2` and `software@^1`.
- WingFoil 0.3.1 is recorded (plan-051): `compat.yaml` lists 0.2.2, 0.3.0 and 0.3.1; `base`
  1.0.0's and 2.0.0's range is `>=0.3.0 <=0.3.1`. `check:runs` runs `base`'s workflows and the
  `sw-life-cycle` starts of `software`'s and `methodology/scrum`'s README examples on 0.3.0 and
  0.3.1, in the CI.
- The exit criteria are met: `tests/fixtures/software-exit` and `tests/fixtures/scrum-exit`, 22
  runs each, 0 failed; task-057's run of `sw-life-cycle` with `methodology/scrum` (two Sprints, two
  releases) on 0.3.0, rerun identical on 0.3.1 (plan-051).
- `packs/software` and `packs/methodology/scrum` read `version: 1.0.0` and `1.0.0: first
  version.` in their `CHANGELOG.md`.
- spec-001 and spec-002 hold no open erratum (plan-046's and plan-050's accounts per tech-spec).

**Not yet met: two approved bugs.**
- **bug-007** (major): step 3 of "Install and update" in the READMEs of `base`, `software` and
  `methodology/scrum` has the adopter re-include the `custom/` workflows `wingfoil init` (0.3.0 and
  0.3.1) writes under the packs' workflow names (`decision-log-ingest`; `sw-life-cycle`,
  `adr-ingest`, `bug-ingest`), plus its delivery workflow: every `workflow` command then fails with
  `E_WORKFLOW_DUPLICATE_NAME`. `software`'s step 4 names "WingFoil 0.3.0's `init`".
- **bug-008** (minor): `base`'s `retrospective` › `approve`, iterated per Sprint by
  `methodology/scrum`, selects every `in-discussion` decision-log tagged `retrospective`, so a
  closed Sprint's step returns to the frontier and `pending approvals` counts one decision-log
  twice; `pack-foundation-base`'s `retrospective` row says the opposite, and neither README states
  it.

**The approver's rulings** (2026-10-28, in chat, as recommended; decisions A–H):
1. **`base` 2.0.1 in this plan (A).** `base`'s published README is fixed by a patch, 2.0.1,
   released in the same round as `software` 1.0.0 and `methodology/scrum` 1.0.0, so that the three
   READMEs an adopter follows together agree. Its own `pack-release` runs through
   `pack-release-cycle` inside this plan, as task-040 ran inside plan-044: a stated deviation from
   the plan's `first-release` phase.
2. **bug-008 by the texts (B, option (ii)).** `pack-foundation-base`'s `retrospective` row is
   corrected (an Execution Note on the charter); `base`'s and `methodology/scrum`'s READMEs state
   the effect: under an iterated sub, a closed iteration's `approve` step is listed again while a
   later iteration's retrospective decision-log is `in-discussion`, and one `memory approve`
   clears both. Option (i), a retrospective sub of `scrum`'s own selecting on the Sprint, is not
   taken: it duplicates `base`'s four phases, needs a second tag passed by hand (the printed
   command already drops `--tags`, F-032) and changes the Ships table and UI's step-key mapping;
   it can return in a minor of `scrum` if WingFoil does not cover the case. Option (iii), a
   feedback note to WingFoil (a `where` key skipped when no element is in scope, or a closed
   iteration's steps not deduced again), is owed after this plan: it takes the number after F-038,
   once F-035 and F-036 exist.
3. **Numbers of the pack-releases (C):** `prel-003` `base` 2.0.1, `prel-004` `software` 1.0.0,
   `prel-005` `methodology/scrum` 1.0.0, in `prepare`'s order.
4. **An adoption scenario in `check:runs` (D)**, its own tooling task (task-060): a project
   initialised by `wingfoil init --template Scrum` and by `--template Kanban` on each release the
   matrix selects, adopting `base`, `software` and `methodology/scrum` by the READMEs' steps (the
   composed `.wingfoil/` copied, the `custom/` directives and workflows the steps name removed with
   their `include` entries); `workflow list` and `workflow next` exit 0 with no diagnostic. A
   scenario of the full scrum run (`memory park`, a field rewritten, `set_state`) is not in this
   plan: a later tooling task.
5. **`software`'s agent keeps `executes_as: [developer, reviewer, qa, architect]` (E).** WingFoil,
   Benchmark and UI all leave `tech-lead` to a person, and the charter lists those four on purpose;
   `software`'s README says that the `tech-lead` phases (`release-submit`, `release-publishing`,
   `end-of-life`, `bug-ingest` › `triage`) are a person's unless the project adds `tech-lead` to its
   agent's `executes_as`. plan-051's annotation is closed by it.
6. **The retrospective after this plan (F).** `software`'s and `methodology/scrum`'s charters go
   `accepted → active` right after their tags (as plan-044 ruling B); `pack-cycle`'s
   `retrospective` runs once for the three cycles (`base`, `software`, `methodology/scrum`) in its
   own plan, right after this one. dl-006's Execution Notes record the deviation from R1's order.
7. **This repository's adoption moves to W10 (G)**, with `methodology/kanban`: this repository's
   delivery is Kanban, `software` composes only with a methodology, and no Kanban pack exists. Its
   WingFoil pin (`devDependencies.wingfoil` 0.2.2) and the first `wingfoil-sync` of the feedback
   inbox, ruled earlier for W9 with the pin's raise, move with it. dl-003 D10 (as amended by
   dl-022) puts this repository first among the adopters; the order changes: WingFoil UI and
   WingFoil may adopt before it. Recorded by an Execution Note on dl-003, as plan-049 ruling 6
   recorded dl-015 C7's change; no new decision-log. The sequencer is amended (step 2).
8. **No decision-log (H).** `pack-semver` classifies the releases; rulings 2 and 7 are recorded by
   Execution Notes.

**The classes.**

| Pack | Version | Bump | Why |
|---|---|---|---|
| `base` | 2.0.1 | patch | only the pack's own README changes (`pack-semver`); the charter is not in the pack |
| `software` | 1.0.0 | major | a first version (`pack-semver`, plan-044 ruling F) |
| `methodology/scrum` | 1.0.0 | major | a first version |

Each `pack-release` carries the computed range, today `>=0.3.0 <=0.3.1`, and `line: current`.

Who runs what: claude drafts for the product-owner (`plan`), is the pack-author of task-061 and
task-062, the developer of task-060, the tech-lead of `prepare` and `publish`; the reviewer is an
independent subagent (dl-017), never the author's context; claude never runs `memory approve` or
`reject` and hands the approver the command.

Not in this plan: this repository's adoption, pin and inbox sync (ruling 7, W10); F-4.2
`governance/wingfoil-dogfood` (dl-012 pending); task-052 (F-037), F-038 and bug-008's note, after
F-035 and F-036; dl-024, dl-025 and plan-022's close; `wingfoil-release-intake` › `recheck`'s
wording (its next version); a `pack-semver` rule for fixes and changed defaults; the full scrum run
as a `check:runs` scenario.

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`). A finding that changes a ruling goes to the approver.
2. **The sequencer** (product-owner, on `main`, with this plan's commits or right after):
   `docs/01_vision/07_sequencer.md` 1.4 → 1.5. W9 becomes the first publication of `software` and
   `methodology/scrum` (F4.8 published, F4.3 `scrum`, F6.1 hand-adoption steps); W10 holds F4.3
   `kanban`, F2.6 presets, F4.2 `governance/wingfoil-dogfood` and this repository's adoption with
   its pin and inbox sync (ruling 7). dl-003's Execution Note for ruling 7. An independent review;
   the merge OK approves the text (as plan-034).
3. **Rehearsal of the publication** (tech-lead), before any `prepare`: on a scratch clone, the
   three `publish:pack` runs simulated in order (tags and catalog commits, nothing pushed), then
   the whole suite and `check:packs`, `index -- --check`, `validate`. A failure caused by the new
   catalog entries (as the 91 tests of plan-044) becomes a tooling task, task-063, through
   `tooling-delivery`, before `prepare`.
4. **task-061 — `base`'s README** (`kanban-delivery`, pack-author, `pack-foundation-base`):
   step 3 keeps only the project's own `custom/` workflows; step 4 also removes the
   `decision-log-ingest` workflow `init` wrote under `workflows/custom/`, with its `include` entry;
   the sentence of ruling 2; the charter's `retrospective` row corrected, with an Execution Note;
   bug-007's and bug-008's Execution Notes record the fix. Ships in 2.0.1.
5. **task-062 — `software`'s and `methodology/scrum`'s READMEs** (`kanban-delivery`, pack-author,
   `pack-methodology-scrum`, as task-055 touched both): `software` removes `init`'s
   `sw-life-cycle`, `adr-ingest` and `bug-ingest` workflows with their entries, its step 4 names
   `init` with no release, and ruling 5's sentence; `methodology/scrum` removes `init`'s delivery
   workflow (`scrum-delivery` or `kanban-delivery`) with its entry, the methodology's `delivery`
   replacing it, and ruling 2's sentence; `pack-methodology-scrum`'s Execution Notes record open
   point 2 resolved by `base` 2.0.0 and open point 3's names fixed by 1.0.0. No release of its own:
   both packs are unpublished.
6. **task-060 — the adoption scenario** (`tooling-delivery`, developer, `pack: ""`, ruling 4): red
   first (dl-018) with the steps as written before task-061 and task-062 (re-included `custom/`
   workflows: `E_WORKFLOW_DUPLICATE_NAME`), recorded on its branch; merged after both, so that
   `main` is never red; its CI step and `tests/ci-workflow.test.ts`. `tooling-delivery`'s WIP limit
   holds.
   Each task (steps 4–6): its body reviewed and accepted into the backlog, its Design on `main`, the
   build on `task/<task id>`, red first, an independent review, the checks from clean clones on
   Node.js 22.21 and 22.12.0 (`npm ci`, `npm test`, `lint`, `check:pins`, `check:schemas`,
   `check:packs`, `index -- --check`, `validate`, the overlays `software-exit` and `scrum-exit`, the
   golden step, `workflow list`, `check:runs`, `npm audit` in the root and in every matrix folder),
   the branch CI's conclusion in its Execution Notes, `in-review`, the approver's acceptance and
   merge OK, a `--no-ff` merge, `main`'s CI read, `done`.
7. **`prepare`** (tech-lead, on `main`), `prel-003`, `prel-004`, `prel-005` in order (the gap
   rule's placeholder if needed), each with `pack`, `version`, `bump`, `wingfoil` and `line` filled
   (W-02); Changes: for `base` the two README fixes and the class, for `software` and
   `methodology/scrum` the first version with the tasks it ships (`traceability`); `base`'s
   `CHANGELOG.md` 2.0.1 entry (its first line the tag's annotation) and `pack.yaml`'s `version`;
   the README's "Install and update" checked against `compat.yaml` (CB-3); each submitted
   (`draft → validating`).
8. **`validate`** (reviewer), for each: `npm run validate:publication -- --evidence` (0.3.0 and
   0.3.1, no warning, two compositions byte-identical), its `## Validation` section copied into the
   element; the overlays; `check:runs` with task-060's scenario; the clean-clone checks of step 6;
   `npm run publish:pack -- --pack <id> --dry-run`; for `base`, the check against the three private,
   non-software projects, run outside this repository, its outcome only recorded; the privacy check
   of the elements and of the packs. An independent review of each pack-release, its findings
   fixed, then `validating → releasing`; `main` pushed and its CI read.
9. **`approve-publication`** (approver): `memory approve` of each element (`releasing →
   released`), which authorizes its tag (plan-044 ruling C), or a rejection back to `validating`.
   A rejected `software` holds `methodology/scrum`; a rejected `base` 2.0.1 holds neither.
10. **`publish`** (tech-lead): `npm run build`, a clean tree, HEAD the last approval's commit with
    `main`'s CI `success`; `npm run publish:pack` for `base`, then `software`, then
    `methodology/scrum` (it requires `software@^1` in the catalog), each a tag and a catalog commit;
    `git push --atomic origin base@2.0.1 software@1.0.0 methodology/scrum@1.0.0 main`; the CI on each
    tag, on `main` and the Pages run read; CB-6's live check for each (`catalog-index.json` filtered
    to the pack, its README and `pack.yaml` at the tag); all recorded in each element's Publication
    section.
11. **`activate`** (ruling 6): `pack-foundation-software` and `pack-methodology-scrum`
    `accepted → active`, their Execution Notes recording the published version; `base`'s charter
    records 2.0.1; dl-006's Execution Note.
12. **Notices**, at the tags: to WingFoil UI's session and to the coordinating session, the tags,
    the date, the range, what changes for an adopter (bug-007's removal list, bug-008's note,
    `tech-lead`); to WingFoil, through the coordinating session, `software`'s new step
    `end-of-life.approve` with the key mapping (`pack-foundation-software`'s notes).
13. **Close:** the account per tech-spec (dl-020); the owed items; `active → done`.

## Handoff

- **claude:** every step but the approver's gates.
- **Approver:** the sequencer's merge OK (step 2); each task's backlog acceptance, its acceptance
  after the build and its merge OK; each pack-release's approval (step 9), which authorizes its
  tag.
- Done when `base@2.0.1`, `software@1.0.0` and `methodology/scrum@1.0.0` are tagged and pushed,
  `catalog.yaml` lists them on `main` with the CI `success` on the tags and on `main`, CB-6's live
  checks recorded, bug-007 and bug-008 noted fixed, the two charters `active`, the sequencer
  amended and the notices sent.

## Execution Notes

- 2026-10-28: written. The approver gave the OK to the outline in chat; decisions A–H as
  recommended, G with adoption, pin and inbox sync at W10 with `methodology/kanban` (ruling 7).
  `workflow` and `phase` filled by editing the draft (W-02).
