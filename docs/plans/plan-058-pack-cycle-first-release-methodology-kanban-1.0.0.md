---
id: plan-058-pack-cycle-first-release-methodology-kanban-1.0.0
type: plan
title: "pack-cycle first-release: methodology/kanban 1.0.0"
status: active
workflow: "pack-cycle"
phase: "first-release"
tags: ["packs","kanban","methodology","W10"]
---

## Context

The `first-release` phase of `pack-cycle` (v6) for `pack-methodology-kanban`, `accepted` on
2026-10-30 (plan-056) and authored on `main` by plan-057 (done on 2026-11-02). Asked by the
approver on 2026-11-02. This plan publishes `methodology/kanban` 1.0.0 through
`pack-release-cycle` (v8: `prepare`, `validate`, `approve-publication`, `publish`) with its
`pack-release`, prel-006; then runs `pack-cycle` › `activate` (`accepted → active`) at the first
tag, as dl-033 O1 orders; the `retrospective` follows `activate` and its form is ruled here
(dl-033 O2). This repository's adoption of the packs, its WingFoil pin (0.2.2), the presets and
`governance/wingfoil-dogfood` are later W10 plans.

**Preconditions, met.**
- `packs/methodology/kanban` is on `main` (task-067, `88468b2`), `version: 1.0.0`, its
  `CHANGELOG.md` holding the `1.0.0` entry; it requires `base@^2` and `software@^1`, both
  published (`base` 2.0.1, `software` 1.0.0, plan-052), and `requires_capabilities:
  [workflow-engine]`.
- The exit criterion is met (plan-057, the charter's note of 2026-11-02): the overlay
  `tests/fixtures/kanban-exit/` (13 compositions, 26 runs on 0.3.0 and 0.3.1, 0 failed, no
  warning) and its CI step; `check:runs` 46 runs, with `tests/fixtures/runs/kanban.yaml`
  (`sw-life-cycle`'s start on `kanban`'s README examples) and `adoption-kanban.yaml` (dl-032 E3,
  the adoption once per `init` template, Scrum and Kanban, prepared by task-068 and run in CI since);
  task-069's run by hand on WingFoil 0.3.1 (dl-032 E4: two releases to `released`, nothing
  `late`).
- `compat.yaml` lists 0.2.2, 0.3.0 and 0.3.1; 0.3.0 and 0.3.1 read every format of the pack and
  provide `workflow-engine`. WingFoil 0.3.2 is not published (read on 2026-11-02: npm `latest`
  0.3.1, no `v0.3.2` tag on WingFoil's repository).
- `main` at `b6be9e2` (this plan's `memory add`) over `9862a43`, whose CI run 41395616888 is
  `success`; spec-001 and spec-002 hold no open erratum (plan-057's account per tech-spec: none).

**The model** is plan-052 (`software` 1.0.0 and `methodology/scrum` 1.0.0, with `base` 2.0.1) and
its pack-releases prel-004 and prel-005, for one pack and with no task to open first: `kanban`'s
README needs no fix before its first tag (bug-007's removal is in it, task-067), and no approved
bug is open on the packs it composes with.

**Reads made for this outline** (2026-11-02, `main` at `9862a43`):
- `src/publish.ts` › `changelogEntry` takes the first line of `CHANGELOG.md` that starts
  `- 1.0.0`, and `publish:pack` writes the tag's annotation as the tag's name, a blank line and that
  line. `kanban`'s entry is three lines; its first, `- 1.0.0: first version: a flow of work items
  under two WIP limits, carried by releases.`, is a complete sentence and becomes the annotation;
  the two lines after it (the workflows, the directives, the Service Level Expectation) do not.
- The publication validation takes the README examples of every pack in the tree: nine
  compositions (`base` 3, `software` 2, `scrum` 2, `kanban` 2), 18 runs on 0.3.0 and 0.3.1;
  `kanban`'s two are its own `defaults` and `team-limits` (spec-002 §2.4).
- `.github/workflows/ci.yml` runs publication mode on a tag matching `**@*`, which matches
  `methodology/kanban@1.0.0` (its comment: `*` does not match `/`); `methodology/scrum@1.0.0`'s
  tag ran it (run 40697577767).

## Proposed outline (ruled by the approver before `submit`)

Each point with a recommendation.

1. **Version and range.** `1.0.0`, class `major`: a first version (`pack-semver`, plan-044
   ruling F); `pack.yaml` and `CHANGELOG.md` unchanged. The range is computed from `compat.yaml`
   by `publish:pack`, never written by hand: today `>=0.3.0 <=0.3.1`, confirmed by the dry run at
   `validate` and written in prel-006's `wingfoil` field from it. **If WingFoil 0.3.2 is published
   before `publish`**, the approver is asked whether its intake comes first. Recommended then:
   publish on the releases `compat.yaml` lists, and let the 0.3.2 intake extend the range of every
   published version, as plan-051 did for `base` 1.0.0 and 2.0.0; alternative: the intake first,
   this plan waiting.
2. **The tag's annotation.** Recommended: `CHANGELOG.md` as it is; the annotation is its complete
   first sentence, and the CHANGELOG keeps the detail. prel-006's Publication quotes the
   annotation. Alternative: the entry folded into one line before `prepare` (a change under
   `packs/`, so the evidence is taken after it). The owed row "A check of the CHANGELOG's first
   line, which becomes the tag annotation" stays open: this plan changes no tooling, and its trigger
   is the next `publish:pack` change.
3. **A rehearsal of the publication before `prepare`** (as plan-052 step 3, for one pack).
   Recommended: on a scratch clone of `main`, nothing pushed: `npm run publish:pack -- --pack
   methodology/kanban` for real (the tag and the catalog commit made locally), then on the result
   `npm test`, `check:schemas`, `check:packs`, `index -- --check`, `validate` and `check:runs`. It shows whether a
   test or a check reads the real catalog and breaks with a fourth pack, before any element moves;
   a failure caused by the new catalog entry becomes a tooling task (`tooling-delivery`, the number
   reserved below), before `prepare`. Alternative: the dry run at `validate` only, which runs the
   publication validation but no test on the published catalog.
4. **The Validation evidence** (`pack-release-cycle` › `validate`, `pack-compatibility`, dl-032
   E3), recorded in prel-006 with commands and exit codes:
   - `npm run validate:publication -- --evidence`: nine compositions on 0.3.0 and 0.3.1, 18 runs,
     0 failed, `tolerance applied: none`, each composition twice byte-identical; its `## Validation`
     section copied into the element; with the line "Presets: none" (`catalog.yaml` `presets: []`),
     the documented combinations being the nine README examples, as prel-005's;
   - `npm run check:runs` on the same two releases: 46 runs, 0 failed, naming the runs of
     `kanban.yaml` (the `sw-life-cycle` starts) and of `adoption-kanban.yaml` (the adoption once
     per `init` template), which the CI has run on every push since task-068. `kanban` ships no
     `main`: the scenario is the composition's `main` that reaches its workflows (dl-032 E3,
     `pack-compatibility`), `software`'s `sw-life-cycle`, which includes `delivery`; `check:runs`
     only starts it and cannot drive into `delivery` (the owed row of the scripted full run), so
     the workflows themselves are covered by task-069's run by hand (E4, below). prel-006's
     Validation says so, for `validate`'s `checks.post`;
   - the overlays `software-exit`, `scrum-exit` and `kanban-exit` (26 runs each, 0 failed) and the
     golden step;
   - task-069's run by hand on WingFoil 0.3.1 (dl-032 E4), cited, not rerun: the pack's files have
     not changed since the commit it composed (`6d260b9`) other than by task-072's generated README
     line in `kanban`'s README, which the step checks with `git diff 6d260b9 -- packs/` (the run
     composed `base`, `software` and `kanban`);
   - `npm run publish:pack -- --pack methodology/kanban --dry-run` in a temporary clone of the
     submitted head: the tag, the range, the digest;
   - the clean-clone checks on Node.js 22.21.0, then 22.12.0, one after the other (`npm ci`,
     `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
     `validate`, the overlays, the golden step, `workflow list`, `check:runs`, `npm audit` in the
     root and in every matrix folder);
   - `main`'s CI on the submitted head; the privacy check of the element and of the pack's files.
   No private check: `kanban` requires `software` and composes in no non-software project.
   An independent review of prel-006 (dl-017), its findings fixed, then `validating → releasing`.
5. **The charter's open point 1 at the first version.** The Service Level Expectation's default
   (`85% of work items finish within 10 days`), with the limits' defaults (2 and 1), becomes fixed
   with 1.0.0 (the Commitments to adopters, R1): prel-006's Changes say so, and the charter's note
   at `activate` records open point 1 settled. Open points 2 … 4 stay as written (the README states
   them; nothing in the pack can change them).
6. **`publish` and CB-6's live part.** `npm run build`, a clean tree, HEAD the approval's commit
   with `main`'s CI `success`; `npm run publish:pack -- --pack methodology/kanban` (the tag at the
   approval's commit, then the catalog commit with `CATALOG.md` and `catalog-index.json`);
   `git push --atomic origin methodology/kanban@1.0.0 main`; the CI on the tag (publication mode),
   on `main` and Pages read. CB-6's live check as prel-005's, the second tag holding a slash:
   `llms.txt`, `catalog-index.json` (raw and Pages) filtered to `methodology/kanban` (`status:
   active`, `latest: 1.0.0`, its range), the version's `readme_url` and `manifest_url` at
   `refs/tags/methodology/kanban@1.0.0`, each 200, recorded in prel-006's Publication. A failure
   there is a bug fixed forward: a published tag never moves.
7. **`activate`** right after the push: `pack-methodology-kanban` `accepted → active` by
   `memory submit` once `pack-cycle` › `activate`'s two checks hold (the tag on origin,
   `catalog.yaml` on origin/main listing 1.0.0), its Execution Note recording the version, the
   tag, the catalog commit and open point 1 (point 5).
8. **The retrospective** (dl-033 O1, O2; dl-029), after `activate`, in a plan of its own, not this
   one. Recommended: `kanban`'s own `pack-cycle` retrospective, its cycle having run alone (plan-056,
   plan-057, this plan), held also as the periodic retrospective for the period after plan-054's
   (plan-055 … plan-058), as plan-054 was for the three earlier cycles; its plan opens right after
   this one closes; its inventory's scope is `periodic` and covers the whole period since
   plan-054's, the condition of dl-029 Option 3 (a pack-cycle retrospective counting as the
   periodic one).
   Alternatives: (b) `kanban` alone, not periodic, the periodic left to dl-029's trigger (the
   close of the 0.3.2 intake). Two more depart from dl-033 and would need an Execution Note on
   dl-033 and dl-006, as plan-044's and plan-052's rulings had: (c) no `kanban` retrospective of
   its own, the periodic one at the 0.3.2 intake covering it and the charter completing
   `retrospective` by reference: O2 defines that completion for a retrospective shared by packs,
   not for a periodic one covering a single pack, and the wait on an unscheduled WingFoil release
   is close to dl-033's rejected Option 4; (d) shared with a later W10 pack
   (`governance/wingfoil-dogfood`): O2 shares a retrospective among packs whose cycles ran
   together and has it ruled by the plan that closes the last of them, while that pack's cycle has
   not started and waits on dl-012 (`pending`).
9. **The notices** at the tag. The text: the element id (prel-006), the tag
   `methodology/kanban@1.0.0`, its commit, the catalog commit, the range and the date, with the
   adoption by hand from the README at the tag (bug-007's removal list as in `kanban`'s README).
   The recipients are the approver's choice; WingFoil and UI run no Kanban (plan-057), and
   Benchmark's delivery is the Kanban the charter's Adoption describes. Recommended: as for
   `scrum` (plan-052 step 12), WingFoil UI's session and the coordinating session, the latter
   asked to pass it on to Benchmark; alternatives: the coordinating session only; or both, with
   nothing for Benchmark. Nothing is due to WingFoil itself: `kanban` adds no step key to a
   workflow WingFoil runs (plan-052's third notice was `software`'s `end-of-life.approve`). The
   text is shown to the approver and sent only after the approver's OK.
10. **Nothing else ships.** No release of `base` or `software`, no decision-log (unless (c) or (d)
    of point 8 is ruled), no change to a tech-spec. Reserved for a finding of this plan only: task-073 (the rehearsal's tooling task,
    point 3), dl-034, bug-010, F-042; unused numbers are released at the close.

## The approver's rulings

Given on 2026-11-02, in chat: every point of the outline as recommended, except point 8.
1. **Point 1:** 1.0.0, `major`, the range computed; if WingFoil 0.3.2 is published before
   `publish`, the approver is asked, the recommendation being to publish and let its intake extend
   the range.
2. **Point 2:** `CHANGELOG.md` as it is; the owed row on its first line stays open.
3. **Point 3:** the rehearsal before `prepare`.
4. **Points 4 … 7:** the evidence, open point 1, `publish` with CB-6's live part and `activate` as
   written.
5. **Point 8, option (b):** `kanban`'s own `pack-cycle` retrospective, in its own plan right after
   this one, not held as the periodic one; the periodic retrospective is left to dl-029's trigger,
   the close of the WingFoil 0.3.2 intake.
6. **Point 9:** the notices to WingFoil UI's session and to the coordinating session, the latter
   asked to pass them on to Benchmark; nothing to WingFoil; the text shown to the approver before
   it is sent.
7. **Point 10:** nothing else ships; task-073, dl-034, bug-010, F-042 reserved for a finding.

## Steps

Before every commit, the privacy check (`repository-practice` rule 2); after every push to `main`,
its CI read (rule 3). Files staged by name. The work runs on `main`, as plan-052's `prepare`,
`validate` and `publish`; no branch is needed unless a tooling task opens.

1. **This plan** (product-owner): an independent review (dl-017), amended; the outline ruled by the
   approver; submitted (`draft → active`).
2. **The rehearsal** (tech-lead; point 3, if ruled), in a scratch clone outside the repository,
   nothing pushed; its result recorded here. A failure: the tooling task first.
3. **`prepare`** (tech-lead): prel-006 added by `memory add --type pack-release`, its `pack`,
   `version`, `bump`, `wingfoil` and `line` written by editing the draft (W-02); its Changes: the
   first version, the tasks it ships (task-067 the pack, its README and examples; task-068 the exit
   criterion, `kanban.yaml` and `adoption-kanban.yaml`; task-069 the run by hand; task-072 the
   README's generated `Memory types` line), the tooling it depends on (task-066, task-070), no bug
   fix (the README applies bug-007's removal list from its first version), the
   class, the computed range, open point 1 (point 5), the annotation (point 2); the README's
   "Install and update" checked against `compat.yaml` (CB-3: the temporary mark kept, no release
   provides `pack-install`); an independent review; submitted (`draft → validating`).
4. **`validate`** (reviewer): claude runs the evidence of point 4 on the submitted head and records
   it in prel-006; the reviewer is the independent subagent (dl-017), its findings fixed (a
   re-review when a fix changes a decision); `validating → releasing`; `main` pushed and its CI
   read.
5. **`approve-publication`** (the phase's role, tech-lead, hands the approver the `memory approve`
   command, with its `cd` and `--reason`; the approver approves): `releasing → released`, which
   authorizes the tag (plan-044 ruling C), or a rejection back to `validating`. The approval's
   commit pushed and `main`'s CI read (rule 3). No tag and no tag push before it.
6. **`publish`** (tech-lead; point 6): the tag, the catalog commit, the atomic push, the CI and
   Pages read, CB-6's live check; prel-006's Publication written after the push.
7. **`activate`** (tech-lead; point 7): the charter `accepted → active`, its note.
8. **The notices** (point 9), after the approver's OK on their text.
9. **Close:** the account per tech-spec (dl-020); the owed rows: `methodology/kanban` taken out of
   the row "W10: `methodology/kanban`, presets, …" (plan-052 ruling 7), citing this plan and
   prel-006; any new row; the reserved numbers released; the privacy checks recorded; the retrospective's plan named (point 8);
   `active → done` after `main`'s CI on the closing head.

**Not in this plan:** the retrospective itself (point 8, its own plan); this repository's adoption,
its WingFoil pin 0.2.2, the first inbox sync, the presets (F2.6) and `governance/wingfoil-dogfood`
(F4.2), with the owed rows of trigger W10; the owed row on the CHANGELOG's first line (point 2);
dl-013, dl-024 and dl-025 (`pending`).

## Handoff

- **claude:** product-owner for this plan's draft; tech-lead of the rehearsal, `prepare`,
  `publish` and `activate`; it runs the `validate` evidence and drafts the notices. It never runs
  `memory approve` or `memory reject`: it hands the approver the command. No pull request; no tag
  and no tag push before the approver's approval of prel-006.
- **Reviewer:** an independent subagent for this plan, for prel-006 at `prepare` and at
  `validate`, and for the close (dl-017).
- **Approver:** this outline; prel-006's approval (`approve-publication`), which authorizes the tag
  and its push; the notices' text.
- Done when `methodology/kanban@1.0.0` is tagged and pushed, `catalog.yaml` on `main` lists it
  with the CI `success` on the tag, on `main` and on Pages, CB-6's live check recorded, prel-006
  `released` with its Validation and Publication, the charter `active`, the notices sent and the
  retrospective's plan named.

## Execution Notes

- 2026-11-02: written as asked by the approver on 2026-11-02, after plan-057's close; `workflow`
  and `phase` filled by editing the draft (W-02). `main` at `9862a43`, CI run 41395616888
  `success`.
- 2026-11-02: independent review: approve after amendments, nothing blocking; six should-fix, five
  nits. Applied: the notices' recipients left to the approver (WingFoil and UI run no Kanban,
  Benchmark does), with nothing due to WingFoil, and no session named; point 8's (c) and (d) marked
  as departures from dl-033 needing a note, (a) tied to dl-029 Option 3; `kanban` ships no `main`,
  so `sw-life-cycle` is E3's scenario and task-069 covers the workflows; the diff over `packs/`;
  the W10 owed row updated at the close and prel-006 shipping no bug fix; the 0.3.2 question until
  `publish`; the presets line; the approval's commit pushed and its CI read; `check:schemas` in
  the rehearsal; who runs `validate` and `approve-publication`.
- 2026-11-02: the approver ruled the outline (rulings 1 … 7; point 8 as option (b)); submitted
  (`draft → active`).
- 2026-11-02, step 2, the rehearsal (ruling 3; Node.js 22.21.0, a scratch clone of `main` at
  `9f040ce`, outside the repository, nothing pushed): `npm ci` and `npm run build` exit 0;
  `npm run publish:pack -- --pack methodology/kanban` exit 0: its publication matrix 9
  compositions, 18 runs, 0 failed, tolerance none; the tag `methodology/kanban@1.0.0` at `9f040ce`,
  annotated with its name and `- 1.0.0: first version: a flow of work items under two WIP limits,
  carried by releases.` (ruling 2); a catalog commit; the range `>=0.3.0 <=0.3.1`; the digest
  `sha256:44f5a854af4170ac61eb214f4efe47fdd777836f2a97c00ef89177a9f90979fa`. On the result, each
  exit 0: `npm test` 1043 of 1043; `check:schemas` 6 files; `check:packs` 74 files, 0 problems;
  `index -- --check` 7 files, 0 not up to date; `validate` 9 compositions, 18 runs, 0 failed;
  `check:runs` 46 runs, 0 failed. No test or check breaks with a fourth pack in the catalog: no
  tooling task (task-073 not opened). `prepare` next.
