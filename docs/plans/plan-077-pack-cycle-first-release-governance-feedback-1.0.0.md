---
id: plan-077-pack-cycle-first-release-governance-feedback-1.0.0
type: plan
title: "pack-cycle first-release: governance/feedback 1.0.0"
status: active
workflow: "pack-cycle"
phase: "first-release"
tags: ["packs","feedback","governance","W10"]
---

## Context

The `first-release` phase of `pack-cycle` (v7) for `pack-governance-feedback`, `accepted` under
plan-073 and authored on `main` by plan-076 (done on 2026-11-18). Asked by the approver on
2026-11-18. This plan publishes `governance/feedback` 1.0.0 through `pack-release-cycle` (v8:
`prepare`, `validate`, `approve-publication`, `publish`) with its `pack-release`, prel-007, then
runs `pack-cycle` › `activate` (`accepted → active`) at the first tag, as dl-033 O1 orders. The
`retrospective` follows `activate`, and its form is ruled here (dl-033 O2).

W10's order (`docs/01_vision/07_sequencer.md`) puts this release before
`governance/wingfoil-dogfood`, the pack release round and this repository's adoption, which are
later plans.

**Preconditions, met.**
- `packs/governance/feedback` is on `main`, `version: 1.0.0`, its `CHANGELOG.md` holding the `1.0.0`
  entry. It requires `base@^2`, published as 2.0.1, and `requires_capabilities: [workflow-engine]`.
  Its entry `with: software@^1` names `software` 1.0.0, published.
- The exit criterion is met but for what this phase owes (plan-076's close, the charter's note of
  2026-11-18):
  - the overlay `tests/fixtures/feedback-exit/`, 22 compositions and 44 runs with the tree's own,
    0 failed, `tolerance applied: none`;
  - `check:runs`, 84 runs, with `feedback.yaml`, `feedback-upstream.yaml` and
    `adoption-feedback.yaml`, the adoption once per `init` template (dl-032 E3);
  - task-099's run by hand on WingFoil 0.3.2 (dl-032 E4), composed from `52d125c2`.
- `compat.yaml` lists 0.2.2 … 0.3.2. The pack's matrix is 0.3.0, 0.3.1 and 0.3.2; the matrix
  selects 0.3.0 and 0.3.2.
- spec-001, spec-002 and spec-003 hold no open erratum: the approver ruled that nothing of plan-076
  folds back (dl-020 R2).

**`main`'s CI before this plan** (dl-038 C3): run 44341242362 on `5acb386c` (plan-076's close and
submit), `success`: jobs `validate (22.12.0, 1)` 12 min 25 s, `(22.12.0, 2)` 7 min 9 s,
`(22.21.0, 1)` 19 min 22 s, `(22.21.0, 2)` 7 min 8 s; none over dl-039 R3's 25 minutes.

**Reads made for this outline** (2026-11-18, `main` at `5acb386c`):
- **The first pack at format 2.** The four published packs are at `pack.yaml` format 1, and
  `governance/feedback` is at format 2 (spec-003 §9). `catalog.yaml` is at format 2 (plan-066), but
  no version published so far comes from a format-2 manifest.
- **The dry run** (`npm run publish:pack -- --pack governance/feedback --dry-run`, in a scratch
  clone, nothing pushed): exit 0; the publication matrix 14 compositions, 28 runs, 0 failed,
  `tolerance applied: none`; the range `>=0.3.0 <=0.3.2`; the digest
  `sha256:6a43f01564c217f4ae1a31df162c262b81d7ca721155409ce7e5f8d42bd4a1f4`.
- **The tag's annotation.** `src/publish.ts` takes the first line of `CHANGELOG.md` that starts
  with the version: "1.0.0: first version: feedback captured, triaged by the approver and routed
  into the governance." It is a complete sentence.
- **The run by hand still stands:** `git diff 52d125c2 HEAD -- packs/ tests/fixtures/feedback-exit
  tests/fixtures/examples/feedback` is empty.
- **WingFoil's newest release** is 0.3.2 (npm `latest`), and `intake.yml`'s last scheduled run is
  `success`.
- **An owed row falls due here:** "`feedback-exit` in the intake's `verify` job" (task-097), trigger
  this pack's `first-release`.

## Proposed outline (ruled by the approver before `submit`)

Each point has a recommendation, or is proposed as written.

1. **Version and range.** `1.0.0`, class `major`: a first version (`pack-semver`). `pack.yaml` and
   `CHANGELOG.md` stay as they are. `publish:pack` computes the range from `compat.yaml`: today
   `>=0.3.0 <=0.3.2`. If a newer WingFoil is published before `publish`, the approver is asked.
   *Recommended then:* publish on the releases `compat.yaml` lists, and let its intake extend the
   range. *Alternative:* the intake first, this plan waiting.

2. **The owed row on the intake, first.** *Recommended:* task-100, through `tooling-delivery` v4
   with `pack: ""`, before `prepare`:
   - `intake.yml`'s `verify` job runs `feedback-exit` after `kanban-exit`, its step and the inline
     `ids` list both changed, and `src/intake-report.ts`'s `CHECK_IDS` takes the id;
   - red first: `tests/intake-workflow.test.ts` and `tests/intake-report.test.ts` derive from
     `CHECK_IDS`, so a new assertion names `feedback-exit` literally;
   - the intake rehearsed on the branch before `in-review` (`gh workflow run intake.yml --ref
     <branch> -f rehearsal=true`), the `verify` jobs' durations recorded, and again on `main` after
     the merge, as plan-068 did for task-089.

   No file under `packs/` changes, so the digest does not move. *Alternative:* the row's trigger
   moved to the next intake, which leaves a WingFoil release able to be reported verified without
   this published pack's overlay.

3. **The tag's annotation.** *Recommended:* `CHANGELOG.md` as it is; the annotation is its complete
   first sentence. The owed row "A check of the CHANGELOG's first line" stays open, since this plan
   changes no `publish:pack` code.

4. **A rehearsal before `prepare`,** after task-100. *Recommended:* in a scratch clone of `main`,
   nothing pushed: `npm run publish:pack -- --pack governance/feedback` for real, then `npm test`,
   `check:schemas`, `check:packs`, `index -- --check`, `validate` and `check:runs` on the result. It
   matters more than for `kanban`: this is the first version published from a format-2 manifest. A
   failure caused by the new catalog entry becomes a tooling task before any element moves.
   *Alternative:* the dry run at `validate` only, which runs no test on the published catalog.

5. **The Validation evidence** (`pack-release-cycle` › `validate`, `pack-compatibility`, dl-032
   E3), recorded in prel-007 with commands and exit codes:
   - `npm run validate:publication -- --evidence`: every README example on 0.3.0 and 0.3.2, each
     composition twice byte-identical. No preset holds the pack, so its documented combinations are
     its three README examples; `feedback-exit`'s eight compositions are additional self-test
     evidence;
   - **the conditional part,** the first a published pack carries (`pack-compatibility`):
     `with-software` and `added-outcome` compose the entry `with: software@^1`, and `defaults`
     leaves it out; the output line `matrix
     tests/fixtures/examples/feedback/defaults/example.yaml[+software]: skipped, no methodology` is
     explained in prel-007;
   - `npm run check:runs` on the same two releases, naming the runs of `feedback.yaml`,
     `feedback-upstream.yaml` and `adoption-feedback.yaml`;
   - the overlays `software-exit`, `scrum-exit`, `kanban-exit` and `feedback-exit`, and the golden
     step;
   - task-099's run by hand, cited and not rerun, with the empty diff above checked again;
   - `npm run publish:pack -- --pack governance/feedback --dry-run` in a temporary clone of the
     submitted head: the tag, the range and the digest;
   - the clean-clone checks on Node.js 22.21.0, then 22.12.0, one after the other: `npm ci`,
     `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
     `validate`, the overlays, the golden step, `workflow list`, `check:runs`, and `npm audit` in
     the root and in every matrix folder;
   - `main`'s CI on the submitted head, and the privacy check of the element and of the pack's
     files.

   An independent review of prel-007 (dl-017), its findings fixed, then `validating → releasing`.

6. **The private projects' check.** `base`'s releases ran one, against three private, non-software
   projects. This pack also composes without `software`. *Recommended:* none: the pack is optional,
   no private project composes it, and a release of it changes nothing they compose. prel-007 says
   so, and the owed row "The private projects' check scripted" stays untriggered. *Alternative:* the
   check run outside this repository before `approve-publication`.

7. **Who runs `publish:pack` and `activate`.** The way of working the approver ruled for this
   repository's adoption (the owed row "The engine way of working") says an agent never runs
   `publish:pack`, a pack's activation or a command whose commit or tag carries the approver's
   identity. It is adopted later in W10, and plan-058's agent ran them. *Recommended:* apply it now
   to the publication on `main` (`publish:pack`, the atomic push) and to the activation only. Every
   other commit stays as today until the adoption, and claude's runs in a scratch clone, with
   nothing pushed (points 4 and 5), stay claude's. claude prepares and checks, and hands the
   approver the exact commands. For `activate`, claude commits the charter's note first, the
   approver runs `memory submit` and pushes, and claude reads the CI. *Alternative:* as plan-058,
   claude runs them after the approver's approval of prel-007.

8. **`publish` and CB-6's live part.** On Node.js 22.21.0, a clean tree, HEAD the approval's commit,
   `main`'s CI `success`: `npm ci`, `npm run build`, `npm run publish:pack -- --pack
   governance/feedback`, and `git push --atomic origin governance/feedback@1.0.0 main`. The CI on
   the tag (publication mode), on `main` and Pages read. CB-6's live check as prel-006's: `llms.txt`
   answers 200; `catalog-index.json` (raw and Pages), filtered to `governance/feedback`, shows
   `status: active`, `latest: 1.0.0` and the range, and the version's `readme_url` and
   `manifest_url` at the tag each answer 200, recorded in prel-007's Publication. A failure there is
   a bug fixed forward: a published tag never moves.

9. **`activate`** right after the push: `pack-governance-feedback` `accepted → active` once
   `pack-cycle` › `activate`'s two checks hold, its Execution Note recording the version, the tag
   and the catalog commit, and CB-1, CB-2 and CB-6 at the first tag.

10. **The retrospective** (dl-033 O1, O2), after `activate`, in a plan of its own. *Recommended:*
    the pack's own `pack-cycle` retrospective right after this plan, as `kanban`'s was (plan-059),
    covering plan-073 … this plan; W10's periodic retrospective stays at the end of the wave. The
    row for the open retrospective is added in the commit that records the ruling
    (`repository-practice` rule 4). *Alternative:* shared with `governance/wingfoil-dogfood`, whose
    cycle has not started: O2 shares a retrospective among cycles that ran together, so this departs
    from dl-033 and needs an Execution Note on dl-033 and dl-006.

11. **No notice.** *Recommended:* none at this tag: no project has adopted the pack, and
    `governance/wingfoil-dogfood` and this repository's adoption are its first users. *Alternative:*
    a notice whose recipients and text the approver gives, sent after the approver's OK.

12. **Nothing else ships.** No release of `base` or `software`, no decision-log and no tech-spec
    change. Reserved for this plan: task-100 (point 2), prel-007; for a finding only: task-101,
    dl-043, bug-017, F-052. Unused numbers are released at the close.

## The approver's rulings

Given on 2026-11-18, in chat: the outline is approved as recommended. Points 1 … 12 stand as
written:
- `1.0.0`, class `major`, the range computed by `publish:pack`; if a newer WingFoil is published
  before `publish`, the approver is asked, the recommendation being to publish on the releases
  `compat.yaml` lists (point 1);
- task-100 before `prepare`, with the intake rehearsed on its branch and on `main` (point 2);
- `CHANGELOG.md` as it is for the tag's annotation (point 3);
- the rehearsal in a scratch clone of `main`, after task-100, nothing pushed (point 4);
- the Validation evidence as listed (point 5);
- no private projects' check, prel-007 saying so (point 6);
- the approver runs `publish:pack`, the atomic push, the charter's `memory submit` and its push;
  claude prepares and checks, hands over the exact commands, commits the charter's note first and
  reads the CI; its runs in a scratch clone stay its own (point 7);
- `publish` and CB-6's live check, then `activate`, as written (points 8 and 9);
- the pack's own `pack-cycle` retrospective in a plan right after this one, covering plan-073 …
  this plan, its row added to `docs/owed-items.md` in this commit (point 10);
- no notice at this tag (point 11);
- nothing else ships, and the reserved numbers stand (point 12).

## Steps

Before every commit, the privacy check (`repository-practice` rule 2). After every push to `main`,
its CI is read (rule 3). Files are staged by name. The release work runs on `main`, as plan-058's;
task-100 runs on its own branch.

1. **This plan** (product-owner): an independent review (dl-017), amended; the outline ruled by the
   approver; submitted (`draft → active`).
2. **task-100** (point 2, if ruled): its body reviewed and accepted into the backlog, built red
   first on its branch, reviewed, the intake rehearsed, dl-039's checks, approved, merged `--no-ff`
   on the approver's OK, `done`, and the intake rehearsed on `main`.
3. **The rehearsal** (point 4, if ruled), recorded here. A failure: a tooling task first.
4. **`prepare`** (tech-lead): prel-007 added, its fields and Changes written, the README's "Install
   and update" checked against `compat.yaml` (CB-3: the temporary mark kept, since no release
   provides `pack-install`), an independent review, `draft → validating`.
5. **`validate`** (reviewer): the evidence of point 5 on the submitted head, recorded in prel-007,
   reviewed independently, `validating → releasing`; `main` pushed and its CI read.
6. **`approve-publication`:** the approver approves prel-007 (`releasing → released`), which
   authorizes the tag, or rejects it back to `validating`. No tag and no tag push before it. The
   approval's commit is pushed and `main`'s CI read.
7. **`publish`** (point 8), by whom point 7 rules; claude reads the CI and Pages and runs CB-6's
   live check; prel-007's Publication written after the push.
8. **`activate`** (point 9), by whom point 7 rules: the charter's note committed first, then the
   `memory submit` and its push; claude reads the CI.
9. **Close:** the account per tech-spec (dl-020); the owed rows; the reserved numbers released; the
   privacy checks recorded; the retrospective's plan named (point 10); `active → done`.

**Not in this plan:** the retrospective itself; `governance/wingfoil-dogfood`; the pack release
round (`reported_by`, bug-011 … bug-015's fixes, the `Precedence:` lines); this repository's
adoption, its WingFoil pin and its inbox sync.

## Handoff

- **claude:** product-owner of this plan's draft, developer of task-100, and tech-lead of the
  rehearsal and `prepare`; it runs the `validate` evidence. If point 7 is ruled as recommended, it
  hands the approver the commands of `publish:pack`, the atomic push and the activation. It never
  runs `memory approve` or `memory reject`: it hands the approver the command. No pull request. No
  tag and no tag push before the approver's approval of prel-007.
- **Reviewer:** an independent subagent for this plan, task-100, prel-007 at `prepare` and at
  `validate`, and the close (dl-017).
- **The approver** rules this outline, accepts and approves task-100, and approves prel-007, which
  authorizes the tag and its push. If point 7 is ruled as recommended, the approver runs
  `publish:pack`, the atomic push, and the charter's `memory submit` and its push.
- **Done when** `governance/feedback@1.0.0` is tagged and pushed, `catalog.yaml` on `main` lists it
  with the CI `success` on the tag, on `main` and on Pages, CB-6's live check is recorded, prel-007
  is `released` with its Validation and Publication, the charter is `active`, and the
  retrospective's plan is named.

## Execution Notes

- 2026-11-18: written as the approver asked on 2026-11-18, after plan-076's close. `workflow`,
  `phase` and `tags` were filled by editing the draft (W-02). `main` was at `5acb386c`.
- 2026-11-18: independent review (dl-017): approve after amendments; no blocker, six should-fix, six
  nits, all applied. A real `publish:pack` in a scratch clone, followed by the test suite and every
  check, breaks nothing with the first format-2 manifest. **Should-fix:** point 7's limits and who
  pushes after the activation; `npm ci` and the build before `publish:pack`; the intake rehearsal
  and a literal assertion in task-100; the evidence of the conditional part; the clean-clone checks
  listed; the shared retrospective marked as a departure from dl-033.
- 2026-11-18: re-review: approve after amendments; no blocker, four should-fix and three nits, all
  applied: point 7 limited to the publication on `main`, so the scratch-clone runs stay claude's;
  `llms.txt` checked for its answer only; the evidence's output line quoted; the push after the
  activation named in Step 8 and the Handoff.
- 2026-11-19: step 2, task-100 merged at `80358fbc`; `main`'s CI, run 44488635424, `success`
  (longest job 18 min 5 s). The intake rehearsed on `main`, run 44488679681, all jobs `success`,
  `feedback-exit` `success` on both Node.js versions, `rehearsal of 0.3.2 guided: 7 reasons`.
  Step 2 read in task-100's criterion 9 order: the rehearsal on `main` before the close and
  `done`. The owed row "`feedback-exit` in the intake's `verify` job" moved to Closed.
- 2026-11-19: task-100 `done` (`08086737`), `main` pushed; its CI, run 44491466307, `success`:
  jobs 11 min 27 s, 6 min 6 s, 11 min 8 s, 5 min 50 s. Next: step 3, the rehearsal of
  `publish:pack` in a scratch clone.
- 2026-11-19: step 3, the rehearsal (point 4), in a scratch clone of `main` at `6c252e14`, its
  remote removed, nothing pushed, on Node.js 22.21.0 after `npm ci` and the build:
  `npm run publish:pack -- --pack governance/feedback` exit 0, the publication matrix 28 runs,
  0 failed, `tolerance applied: none`; the tag `governance/feedback@1.0.0` annotated at
  `6c252e14` with the CHANGELOG's line; the catalog commit touching `catalog.yaml`,
  `catalog-index.json` and `CATALOG.md`; the digest
  `sha256:6a43f01564c217f4ae1a31df162c262b81d7ca721155409ce7e5f8d42bd4a1f4`, as the outline's
  dry run; the range `>=0.3.0 <=0.3.2`; the entry `status: active`, `pack_format: 2`,
  `conditional: [with: software@^1]`. On the result, after the build: `npm test` 1432 tests,
  1432 pass; `check:schemas`, `check:packs`, `index -- --check` exit 0; `validate` 28 runs,
  0 failed, `tolerance applied: none`; `check:runs` 84 runs, 0 failed; the tree clean. No
  failure from the first format-2 entry: no tooling task. Next: step 4, `prepare` (prel-007).
- 2026-11-19: step 4, `prepare`: prel-007 added, its fields and Changes written, CB-3 checked (the
  temporary mark kept), reviewed independently (approve after amendments; one should-fix, the
  private projects' check stated, and three nits, applied), submitted `draft → validating` at
  `b03e5393`. Next: step 5, `validate`, on the submitted head.
- 2026-11-19: step 5, `validate`: the evidence of point 5 on `f64436c4` recorded in prel-007
  (clean clones on Node.js 22.21.0 and 22.12.0, every command exit 0; the dry run's tag, range and
  digest as the rehearsal's; `main`'s CI run 44505683283 `success`), reviewed independently
  (approve after amendments; one should-fix and three nits, applied), submitted
  `validating → releasing`.
- 2026-11-19: step 6, prel-007 approved by the approver (`releasing → released`, `84cb0858`),
  pushed, `main`'s CI run 44525905868 `success`. Step 7, `publish`, run by the approver (ruling
  7): the tag `governance/feedback@1.0.0` at `84cb0858`, the catalog commit `977cc087`, pushed
  together; the CI on the tag (44531452267), on `main` (44531451955) and Pages (44531451866)
  `success`; CB-6's live check passed; prel-007's Publication written. Next: step 8, `activate`.
- 2026-11-19: step 8, `activate`: the charter's note committed first (`47d4bd43`), then
  `pack-governance-feedback` `accepted → active` (`4a9d46fe`), the `memory submit` and its push
  run by the approver (ruling 7); the tag on origin and `catalog.yaml` on `origin/main` listing
  1.0.0. `main`'s CI on `4a9d46fe`, run 44542032610, `success` (longest job 11 min 24 s).
- Step 9, the close:
  - **The account per tech-spec (dl-020):** this plan amended neither spec-001, spec-002 nor
    spec-003 and recorded no erratum of theirs; nothing to fold back.
  - **The owed rows:** "`feedback-exit` in the intake's `verify` job" moved to Closed by task-100;
    the row for this pack's own retrospective, added with the rulings, stays open until its plan
    runs; one new row: the sequencer's W10 state, which still reads `governance/feedback` "not
    started"; the rows "A check of the CHANGELOG's first line" (ruling 3) and "The private
    projects' check scripted" (ruling 6) stay open, untriggered; "The engine way of working"
    stays open, ruling 7 having applied only its part on publication and activation, early. The
    W10 row (plan-052 ruling 7) does not name this pack and is left as it is.
  - **Numbers:** task-100 and prel-007 used; task-101, dl-043, bug-017 and F-052, reserved for a
    finding, unused and released.
  - **Privacy:** every commit of this plan checked before it was made (no local or scratch path,
    no private repository or project, no intermediary session); the request origins written
    "asked by the approver on <date>".
  - **The retrospective** (ruling 10): `governance/feedback`'s own `pack-cycle` retrospective,
    covering plan-073 … plan-077, in the plan right after this one, not held as the periodic one.
    Until it runs, `pack-cycle` › `retrospective` is open for `pack-governance-feedback`.
  - **No notice** at this tag (ruling 11).
  - Done: `governance/feedback@1.0.0` tagged and pushed, listed in `catalog.yaml` on `main`, the CI
    `success` on the tag, on `main` and on Pages, CB-6's live check recorded, prel-007 `released`
    with its Validation and Publication, the charter `active`, and the retrospective's plan named.
  - `main`'s CI on the closing head read before `active → done`.
- 2026-11-19: independent review of the close: approve after amendments, nothing blocking. Applied:
  the closing head's CI before `active → done`; the sequencer row's Source and a latest trigger;
  the engine way of working's row named; a note's date form.
