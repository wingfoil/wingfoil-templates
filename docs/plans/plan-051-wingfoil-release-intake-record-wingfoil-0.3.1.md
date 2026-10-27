---
id: plan-051-wingfoil-release-intake-record-wingfoil-0.3.1
type: plan
title: "wingfoil-release-intake record: WingFoil 0.3.1"
status: active
workflow: "wingfoil-release-intake"
phase: "record"
tags: ["wingfoil","intake","compat"]
---

## Context

WingFoil 0.3.1 was released on 2026-10-27: tag `v0.3.1` on `wingfoil/wingfoil@870bd440`, on npm
as `latest`. `wingfoil-release-intake` records it, on the approver's request in chat on
2026-10-27, before the first release of `software` and `methodology/scrum` (W9): recorded first,
both are validated on 0.3.0 and 0.3.1 before they are published, and a defect 0.3.1 shows in them
is fixed before their 1.0.0. `compat.yaml` lists 0.2.2 and 0.3.0; `base` 1.0.0 and 2.0.0 are
published with the range `0.3.0`.

The plan is filed under `record`, the phase that carries the work; it also records the outcome of
`recheck` and `plan-migrations`. Its roles (tech-lead, reviewer, product-owner) are run by claude;
`record`'s `approval: { by_role: approver }` is the approver's acceptance of the tasks and the
merge OK.

**What 0.3.1 provides**, read in its CHANGELOG (`[0.3.1]`) and to be checked by running it: a
patch of the 0.3 line, "nothing breaks" from 0.3.0. Added: `workflow adopt`, `workflow rekey`,
a check bound `manual: true` in `workflows/bindings.yaml` (0.3.0 refuses it). Changed: every
command that writes a configuration file raises its `version:`. Fixed: `init`'s scaffold
guidable by the engine, `workflow finalize --dry-run`, a `cadence` key's message under zod 4.6.
No format version is named; `reads` and `format_key` are verified by running it, as for 0.3.0.

**Already run** (2026-10-27, outside the repository, 0.3.1 installed in a scratch folder: 0
vulnerabilities; `--version` prints `0.3.1 (870bd440…)`, the form the matrix accepts):
- the matrix's three commands on the seven README examples (`base` 3, `software` 2,
  `methodology/scrum` 2), composed from `main` at `1039c23`: each pass, no warning;
- `check:runs`' scenario of `base` on 0.3.1: 9 runs, 0 failed;
- a scenario starting `sw-life-cycle` on the README examples of `software` and of
  `methodology/scrum`: 4 runs, 0 failed on 0.3.0 and on 0.3.1.

**The approver's rulings** (2026-10-27, in chat, as recommended):
1. **Two tasks**, through `tooling-delivery` as `developer`, red first (dl-018), in order:
   - **task-058 — `check:runs` on every selected release, and 0.3.1's pin:** today `check:runs`
     takes the newest compatible release only (`realCompose` returns one), so with 0.3.1 listed it
     would leave 0.3.0; the `Compose` result carries every release the matrix selects (the oldest
     and the newest) and each scenario runs on each, its report line naming the release. Two
     scenario files join `tests/fixtures/runs/`: `software.yaml` and `scrum.yaml`, starting
     `sw-life-cycle` on each README example (the existing `start` step). The pin
     `src/matrix/wingfoil-0.3.1/` (`package.json` pinning exactly 0.3.1, its lockfile, `npm audit`
     0, `check:pins`) comes here, as plan-042 moved 0.3.0's pin into task-035, so that the task
     proves a real two-release run: on a scratch copy of the tree whose `compat.yaml` adds 0.3.1,
     `check:runs` runs 2 × (9 + 4) = 26 runs, 0 failed. `compat.yaml` itself is not touched; on
     `main` the command still runs 0.3.0 alone until task-059. Also: `runs.ts`'s header, the
     `base.yaml` header, the CI step's name (`ci-workflow.test` finds steps by command).
   - **task-059 — record 0.3.1** (as task-036 did for 0.3.0):
     - `compat.yaml`: release 0.3.1 with `format_key: true`, `reads` at format 1 for the seven
       kinds, `capabilities: [workflow-engine]` and `notes` ("accepts the `format:` key; format 1;
       no new capability (ruling 2, dl-021 R4); a fresh 0.3.0 install resolving zod 4.6 shows
       zod's bare message on a refused `cadence`, fixed in 0.3.1 (bug-415)"), as verified by
       running it;
     - spec-001, amended in place (the merge OK approves the text, as task-036): §12's example and
       the golden fixture's `compat.yaml` equal to the real file (dl-010); §12's prose gaining
       0.3.1's check (date, commands, result); an Execution Note; dl-009's Execution Note for
       0.3.1 (its note on publication mode running 0.3.0 alone goes stale);
     - in the same commit as `compat.yaml` (or `check:packs`' `catalog-range` fails in between):
       `catalog.yaml`'s `wingfoil` field of `base` 1.0.0 and 2.0.0 edited by hand to
       `">=0.3.0 <=0.3.1"`, quoted as `toYaml` writes it; no tool recomputes a published entry
       (`addVersion` writes only at publication), `catalog-range` is the guard, and spec-001 §11
       and §12 allow the edit (`catalog-manifest` skips `wingfoil`; the digest does not cover
       `catalog.yaml`); `npm run index` then changes the root `CATALOG.md` and
       `catalog-index.json`, the fixture trees' outputs byte-unchanged, `install` empty;
     - the tests, each expectation re-derived: the golden fixture's packs require no capability,
       so its self-test selects 0.2.2 and 0.3.1 and no longer 0.3.0 (acceptable under the
       oldest-and-newest rule: 0.3.0 stays covered by the real packs, the overlays and publication
       mode), its publication 0.3.0 and 0.3.1 (13 runs → 26); the real packs require
       `workflow-engine`, so this repository's `validate` 7 → 14 runs, the overlays
       `software-exit` and `scrum-exit` 11 → 22 each, `validate:publication` 7 → 14; a 0.3.1 stub
       printing `0.3.1 (870bd440)` for `validate.test`'s `byRelease`; in `validate.test.ts` the
       golden self-test lines, the "0.3.0 warning" test (retargeted), and every label's release;
       in `compat.test.ts` the real releases, the range (`>=0.3.0 <=0.3.1`), the sample release
       after 0.3.1, the repeated case; unchanged: the tests on `fixtureCompat` (the fictitious
       9.0.0 is built on `FROZEN_COMPAT`), `range.test`, `matrix.test`;
     - `.github/workflows/ci.yml`: its header and step names, if they name a release.
2. **No new capability** for `workflow adopt`, `workflow rekey` or the manual checks: no pack
   requires them, and the vocabulary records a capability a pack needs (dl-021 R4).
3. **The run of `sw-life-cycle` with `methodology/scrum` on 0.3.1** (task-057's, two Sprints and
   two releases) is run again by hand in a scratch repository outside this one, its outcome in
   this plan's notes; making it a `check:runs` scenario needs step kinds the command lacks
   (`memory park`, a field rewritten, `set_state`), proposed for W9.
4. **Not in this plan:** this repository's own WingFoil (`devDependencies.wingfoil: 0.2.2`), which
   belongs to its adoption of the packs (W9); the feedback note F-038; 0.3.1's `COLLABORATION.md`
   feedback-inbox text (bug-408) and the `version:` raise on configuration writes (the matrix and
   `check:runs` write no configuration).

**`recheck`'s wording.** `wingfoil-release-intake` › `recheck` says a pack "only gains the release
in its computed range at its next publication", while `record`, spec-001 §12 and `catalog-range`
recompute the published versions at intake: this plan follows `record`; the wording is a
follow-up for the workflow's next version.

**Numbers.** plan-050 closed without task-058, task-059 and dl-029, which it held for a split; this
plan takes task-058 and task-059.

## Steps

1. **This plan:** an independent review by a subagent (dl-017), amended, then submitted
   (`draft → active`). A finding that changes a ruling goes to the approver.
2. **Each task**, task-058 then task-059, through `tooling-delivery` v2: its body reviewed and
   accepted into the backlog, its Design on `main`, the build on `task/<task id>`, red first, an
   independent review, the checks from clean clones on Node.js 22.21 and 22.12.0 (`npm ci`,
   `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
   `validate`, the overlays `software-exit` and `scrum-exit`, the golden step, `workflow list`,
   `check:runs`, `npm audit` in the root and in every matrix folder), the branch CI's conclusion
   in its notes, `in-review`, the approver's acceptance
   and merge OK, a `--no-ff` merge, `main`'s CI read, `done`.
3. **`recheck`** (reviewer), after task-059 on `main`:
   - the matrix of the active pack, `base`, on 0.3.0 and 0.3.1: `npm run validate:publication` on
     the tree, whose `packs/base` equals `base@2.0.0`'s (stated with the diff), and `check:runs`;
     `base@1.0.0` on a scratch copy whose `packs/base` holds the tag's content, as plan-049's red
     run did: on 0.3.1 its matrix passes and `check:runs` fails as bug-005 and bug-006 say
     (0.3.1 kept the behaviour behind both); `base` 2.0.0 passes;
   - this repository's self-test and the overlays `software-exit` and `scrum-exit` on both
     releases (the golden tree's self-test runs 0.2.2 and 0.3.1); `check:runs` on `main`: 26
     runs, 0 failed;
   - ruling 3's run of `sw-life-cycle` with `methodology/scrum` on 0.3.1;
   - the install steps of the READMEs of `base`, `software` and `methodology/scrum` on a project
     initialised by 0.3.1: its `init` writes guidable `workflows/custom/` files (`sw-life-cycle`,
     `bug-ingest`, `decision-log-ingest`) and the same `directives/custom/` stubs as 0.3.0, and
     its "Upgrading from 0.3.0" copies those `custom/` workflows, which would shadow the packs'
     workflows of the same name; a text to fix in `software` or `methodology/scrum` is a W9 item,
     `base`'s published README is frozen until its next version.
   A defect of `software` or `methodology/scrum` the recheck finds is a bug and a task, fixed
   before W9.
4. **`plan-migrations`:** recorded as empty unless `recheck` finds a format 0.3.1 reads
   differently.
5. **Close:** `pack-foundation-base`'s Execution Notes record the recomputed range (its notes say
   `0.3.0`); WingFoil UI's session and the coordinating session are told the intake's outcome and
   the range; this plan goes `active → done`; W9 can start.

## Handoff

- **claude:** every step but the approver's gates.
- **Approver:** each task's backlog acceptance, its acceptance after the build and its merge OK.
- Done when `compat.yaml` lists 0.3.1, `base`'s published versions carry the recomputed range,
  `check:runs` runs on 0.3.0 and 0.3.1 with `software`'s and `methodology/scrum`'s starts, the
  recheck and ruling 3's run recorded, and `main`'s CI `success`.

## Execution Notes

- 2026-10-27: written. The approver gave the OK to the outline in chat; rulings 1–4 as
  recommended (decisions A–D). The session running plan-050 is archived; the numbers were read
  from `main`. `workflow` and `phase` filled by editing the draft (W-02).
- 2026-10-27: independent review: approve after amendments, three findings to amend before
  `active`, none changing a ruling's aim: task-059's tests listed expectation by expectation, as
  task-036 did; the catalog's published ranges edited by hand, guarded by `catalog-range`; 0.3.1's
  pin moved into task-058 so that it proves a real two-release run (confirmed by the approver
  in chat, 2026-10-27). Applied with the non-blocking ones: spec-001's and dl-009's texts; `recheck`'s
  wording; the recheck's targets (`base@1.0.0` on a scratch copy of its tag); the install steps on
  a project initialised by 0.3.1; the outcome to UI's session and the charter's note; `npm audit`;
  the `compat` tag; what 0.3.1 changes that this plan does not act on.
- 2026-10-27: re-review: approve; its three nits applied. Submitted (`draft → active`).
- 2026-10-27: task-058 `done` (merged `00c0eaa`; `main`'s CI on `cdb81f9`, run 40571686917,
  `success`): `check:runs` on every selected release, `software`'s and `methodology/scrum`'s starts,
  0.3.1's pin. task-059 `done` (merged `609127e`; run 40585068798 `success`): 0.3.1 recorded,
  spec-001 §12, the golden fixture, `base` 1.0.0's and 2.0.0's range `>=0.3.0 <=0.3.1`.
- 2026-10-27, step 3, `recheck`:
  - `base` 2.0.0: `main`'s `packs/base` equals `base@2.0.0`'s (`git diff` empty);
    `npm run validate:publication` 14 runs, 0 failed (0.3.0 and 0.3.1); `check:runs` 26 runs, 0
    failed; this repository's self-test 14 runs, the overlays `software-exit` and `scrum-exit` 22
    each, the golden tree 26 (0.2.2 tolerated and 0.3.1), each 0 failed (task-059's notes).
  - `base@1.0.0`, on a scratch copy of its tag with `main`'s `compat.yaml`: the matrix's three
    commands pass on 0.3.0 and 0.3.1 for its three README examples (its range holds);
    `check:runs`: 18 runs, 14 failed, 7 of 9 on each release, as bug-005 and bug-006 say (0.3.1
    kept the behaviour behind both).
  - Ruling 3's run, on 0.3.1 (`870bd440`), `base`, `software` and `methodology/scrum` composed from
    `609127e` in a scratch repository outside this one: `sw-life-cycle` with two Sprints and two
    releases to `delivery complete, end-of-life current`, nothing reported `late`, the Sprint
    limit refusing a second active Sprint as on 0.3.0; task-057's Findings 1 and 2 hold unchanged;
    every commit of the run replayed on 0.3.0 and 0.3.1 gave byte-identical `workflow status` and
    `workflow next --format json`; no command wrote configuration (0.3.1's `version:` raise
    unused). Seen on both releases: `base`'s `retrospective` › `approve` lists a closed Sprint's
    step while the next Sprint's decision-log is `in-discussion` (bug-008); the agent's
    `executes_as` lacks `tech-lead`, which `software`'s release phases name, and WingFoil does not
    refuse it (a W9 item for `software`'s DNA); `retrospective.capture`'s printed command omits
    `--tags retrospective` (known, F-032).
  - The install steps on a project initialised by 0.3.1 (and by 0.3.0, the same): `init` writes
    `custom/` workflows named as the packs' (`decision-log-ingest`, `sw-life-cycle`,
    `adr-ingest`, `bug-ingest`) and its delivery workflow; the READMEs' step 3, re-including them,
    fails `workflow list` with `E_WORKFLOW_DUPLICATE_NAME` (bug-007, triaged `approved`);
    `software`'s and `methodology/scrum`'s READMEs fixed before W9, `base`'s in a patch.
- 2026-10-27, step 4, `plan-migrations`: empty: 0.3.1 reads every format as 0.3.0 does.
- 2026-10-27, step 5, close: bug-007 triaged `approved` (`6a641c8`), bug-008 submitted (`pending`,
  the approver's triage); `pack-foundation-base`'s notes record the 0.3.1 range. The notices
  (0.3.1 recorded, the range `>=0.3.0 <=0.3.1` of `base` 1.0.0 and 2.0.0, the recheck, bug-007's
  adoption note) sent to WingFoil UI's session and to the coordinating session. Owed, outside this
  plan: bug-007's fix (`software`'s and `methodology/scrum`'s READMEs before W9, `base`'s in a
  patch); bug-008 after its triage; `software`'s agent `executes_as` without `tech-lead` (W9);
  `wingfoil-release-intake` › `recheck`'s wording (its next version); a `check:runs` scenario of
  the full scrum run (W9). `active → done`; W9 can start.
