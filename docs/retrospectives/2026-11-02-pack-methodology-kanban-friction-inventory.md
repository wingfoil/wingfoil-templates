# Friction inventory — pack-methodology-kanban, 2026-11-02

Phase `explore` of `pack-cycle` › `retrospective` (`retrospective` v5), under plan-059. It covers
the cycle of `methodology/kanban` alone (plan-058 ruling 5): `charter` (plan-056), `author`
(plan-057), `first-release` and `activate` (plan-058). It is not the periodic retrospective, which
stays at dl-029's trigger, the close of the WingFoil 0.3.2 intake.

- **Period:** 2026-10-29 (plan-056 written, after plan-055's close) → 2026-11-02 (plan-058 closed,
  `c316fe8`); `0162c90`, after it, read for §8 only.
- **Sources read:** plan-056, plan-057, plan-058 (outlines, rulings, Execution Notes, closes);
  task-066 … task-072 with their reviews; bug-009; prel-006; the charter `pack-methodology-kanban`
  (body, Open points, Execution Notes); dl-030 … dl-033 as `repository-practice` 1.1, `pack-cycle`
  v6, `pack-release-cycle` v8 and `pack-compatibility` write them; `docs/owed-items.md`; the git
  log and the public CI runs of the period; for §6, the WingFoil 0.3.0 and 0.3.1 packages this
  repository's matrix installs and the inbox F-001 … F-041.
- **Not sources:** plan-055 (cited only where a source cites it); WingFoil UI's adoption feedback
  (its own plan, after plan-059; its register row is in §8); dl-013, dl-024 and dl-025 (`pending`).
  No feedback note was added in the period.
- **Method:** three read-only strands (the charter; `author`; `first-release`, `activate` and the
  rules), merged here; plus one read for §6: WingFoil's own code and texts on WIP limits, in the
  0.3.0 and 0.3.1 packages.
- **Legend:** `+` went well · `−` friction · `?` not confirmed in the sources · `WF` WingFoil-side
  (candidate feedback note, §6) · `GOV` candidate change of this repository's governance (§7) ·
  `DEBT` an owed item (§8).

Each point cites its source as element id and section, a commit, or a CI run id. Candidate numbers
(`WF-n`, `GOV-n`) are this inventory's; `G7` … `G12` are the inventory of 2026-10-28's, as the
register cites them.

## 1. `charter` (plan-056)

The plan written 2026-10-29 (`b97e311`, `c9a147b`, `b76e6d9`), submitted 2026-10-30 (`96f791b`);
the charter accepted (`f3fce0d`) and merged into `main` (`c6ed1a0`) the same day.

- `+` **dl-032 E2 held, and paid off** (its findings reached the charter before it was written,
  earlier than E2's "while it is `proposed`"; GOV-5). The run on WingFoil 0.3.1, before acceptance,
  composed a draft overlay with `base` and `software` (no fixture pack needed) and drove every loop
  with two candidates, in and out of their `where`, and a task spanning two releases; 163 commands
  (plan-056 › step 2). It settled `delivery`'s shape (ruling 8), the task's link to its release
  (ruling 9) and the limits (ruling 10) before the charter was written (`1f9f7d2`).
- `+` **The `{release.id}` scope token found by validation**, before any text depended on it:
  `W_PHASE_TOKEN_OUT_OF_SCOPE` on both releases, `software`'s `release` template declaring no `id`;
  `{release.version}` passes (plan-056 › step 2 "Scope token"; ruling 9).
- `+` **Review findings checked on the engine before amending** (plan-056 › step 4, `06149a1`): a
  reject past a full limit exits 0 (a rule of the `kanban` directive followed); a release already
  `released` started a `release-flow` with `released` in `delivery`'s filter, so the filter became
  `[in-development, releasing]` (46, then 115 commands, each exit 0).
- `−` **`delivery`'s filter reworked after ruling 8.** Step 2's draft used `[in-development,
  releasing, released]`, a detail the outline did not cover and close in kind to the plan review's
  own blocking finding (dl-027 D1). Once step 4 changed it, the multi-release claims rested on a run
  with the old filter, and the re-review had them run again (`b6ed85a`); the change of ruling 8's
  detail was ruled at acceptance (step 5).
- `+` **The names check** (step 1, step 4): no WingFoil 0.3.1 built-in, `init --template Kanban`
  file, or `custom/` file here or in Benchmark (`d2975efe`) is named `kanban`, `work-item`,
  `definition-of-workflow` or `release-flow`. It also found this repository's custom
  `retrospective`, `decision-log-ingest`, `bug-ingest` and `adr-ingest` sharing `base`'s and
  `software`'s names (`DEBT`, a row since `06149a1`).
- `−` **A slip of the driving script** in step 2: `rel-1.1.0`'s `capture` finalized with a record and
  no decision-log, so the check of bug-008 and F-039 ran on a third release (plan-056 › step 2
  "Retrospectives"). Evidence for the scripted-run row (§4.5).
- `−` **The Node.js warning's cause named without being located** (§4.3): ruling 13, its owed row
  (`1f9f7d2`) and the charter's Ships and Acceptance name the composer.
- `?` **The charter still carries that cause.** Ships and Acceptance were not amended; plan-057's
  note on the charter corrects them ("was not the composer's … 'no warning' with no exception").
  Accepted text is corrected by notes (G7's row), but a reader of the `active` charter sees an
  exception to its exit criterion that no longer exists (`DEBT` candidate, §8).
- `−` A citation slip in three owed rows ("step 3's review" for step 4), corrected at the re-review
  (`06149a1` → `b6ed85a`).
- `+` Reviews: the plan's (two blocking findings before any work: the release filter, dl-027 D1; the
  `memory add` command for a `pack-{axis}-{name}` id), the charter's (no blocker, ten should-fix)
  and a focused re-review triggered by the filter change (plan-056 › Execution Notes).
- `+` Findings went to the approver when found: step 1's reads before step 2 (rulings 1 … 7), the
  run's findings before the charter (rulings 8 … 13), the filter at acceptance. `?` plan-056 cites
  dl-019 for this by analogy; dl-019 R1 speaks of a task's Acceptance, and neither `pack-cycle` nor
  dl-032 names the rule for a charter.
- `+` CI `success` throughout: `main` before the start (40941233845), the branch (41048572300,
  41053863479), `main` after the merge (41075254260) and Pages (41075253855); clean clones on
  22.21.0 then 22.12.0, 1027 of 1027 (step 6).

## 2. `author` (plan-057)

2026-10-30 → 2026-11-02; seven tasks and one bug delivered, each `main` CI `success` after its
delivery (plan-057 › step 3).

- `−` **Four tasks planned, seven done, and a bug** (§4.2): task-070 (ruling 6), bug-009 with
  task-071 (ruling 7), task-072 (ruling 8) joined task-066 … task-069. Each new task also needed its
  backlog acceptance, `approve` and merge OK; bug-009 its own `approve`.
- How each was found: task-070 by task-067's checks (the warning still printed by `npm run index`
  and every `validate`, `9508437`); bug-009 by task-070's branch CI (41198500589, 41200156986) and
  `main`'s (41196364111, 41198090730), an advisory published in the registry with no commit here
  causing it; task-072 by task-067's build review (the empty `Memory types` line, a row in the same
  commit as its note, `8cab3f6`).
- `+` **Red-first (dl-018) held on every tooling task**, each red commit and count recorded: task-066
  `3ac0b7e`; task-070 `3b1bd06`, again at `fa19ac4`; task-072 `7ea8b27` (its count recorded, the
  commit not named in its notes); and task-068, a pack task, red first anyway (`bb6727a`). `?` task-071
  was dependency-only: its red and green are `npm audit` exit codes, with task-043 cited as
  precedent; dl-018 R2 names test-after exceptions (its nearest, "configuration of a third-party
  tool"), not a change with no test.
- `+` **Every blocking finding came before code**, in a plan or body review: plan-057's lint count
  (61 → 74, not 72); task-066's in-process test; task-071's override range against adr-002's exact
  pins ("request changes"); task-072's order against ruling 8. No build review had a blocking
  finding. Every count the plan predicted held as measured (lint 74, index 7, `validate` 18 runs,
  overlays 26, `check:runs` 34 → 46).
- `−` Small slips in the records, each caught by its review (task-068 "six test cases, not seven";
  task-069 "three of the five non-zero exits"; task-070's second red count). One not caught:
  task-067's notes date its Design, `backlog → in-progress` and `9508437` to 2026-10-31, while
  `6ebe4f0` and `9508437` are dated 2026-10-30, late evening.
- `−` **The tooling WIP limit exceeded by hand, briefly.** `tooling-delivery` allows one task
  `in-progress`; task-070 and task-071 were both `in-progress` from `0300167` to `29ebbcf` (both
  2026-10-31, about 40 minutes), with no overlap `in-review`. Ruling 7's order ("before task-070's
  gate") allowed it in effect, but neither the plan nor the tasks record it as an exception. On the
  0.2.2 pin the limits are kept by hand (plan-057 › Steps); at W10 this repository's per-pack rule
  cannot be a `limits` value, which counts the whole repository (the charter › Adoption; a row of
  §8, evidence added).
- `−` **Waiting and rework:** task-067 waited on its branch over a day for task-070 and task-071,
  then resumed after merging `main` (`499395a`); task-070's red CLI test first set its limit on the
  golden `software`'s `release`, which moved a generated README, and was moved to `base`'s `task`
  (`fa19ac4`).
- `+` / `?` **task-069's run by hand (dl-032 E4) changed nothing**: composed from `6d260b9`, 118
  steps, two releases to `released`, a task spanning both, both limits refusing, a reject past a full
  limit brought back by a park, nothing `late` ("no finding for the approver"). Of its five non-zero
  exits two were the expected refusals and three a driving-script slip (a `sed` breaking on the `/`
  of `n/a`, then the dependent `submit` and `approve`; §4.5). task-067's review had found the shipped
  workflows structurally identical to the draft run under E2; whether E4 adds evidence when E2 ran
  on an identical draft is `?`.
- `+` Clean clones on Node.js 22.21.0 then 22.12.0, one after the other, and the branch CI
  `success`, for every task with code or tests: task-066 41111485611, task-071 41220906494,
  task-070 41298805927, task-067 41325925866, task-068 41340400993, task-072 41354951330; task-069
  notes only (41351653544).

## 3. `first-release` and `activate` (plan-058)

2026-11-02, one day: rulings, rehearsal, `prepare`, `validate`, the approval, `publish`,
`activate`, the notices, the close.

- `+` **The rehearsal before `prepare`** (ruling 3): a real `publish:pack` on a scratch clone at
  `9f040ce`, then `npm test` 1043 of 1043, `check:schemas`, `check:packs`, `index -- --check`,
  `validate` and `check:runs` (46), each exit 0: no test or check breaks with a fourth pack, so no
  tooling task. Its digest equals the dry run's and the publication's (plan-058 › step 2; prel-006).
- `+` **The evidence chain** (prel-006 › Validation): 9 compositions, 18 runs, 0 failed, tolerance
  none; `check:runs` 46 runs, `kanban`'s 12; three overlays and the golden step; clean clones on
  both Node.js versions with `npm audit` in the root and the three matrix folders;
  `git diff 6d260b9 -- packs/` letting task-069's run be cited, not rerun. Two reviews of prel-006,
  nits only.
- `−` **The dry run's first attempt exited 1**: the checking script outside the repository linked
  `node_modules` into the temporary clone, an untracked entry `publish:pack`'s clean-tree check
  refuses; redone, passed (prel-006 › Validation; plan-058 › step 4). `+` the guard worked as
  designed. Another driving-script slip (§4.5).
- `+` **The publication was exact**: the tag `methodology/kanban@1.0.0` on the approval's commit
  `31102df` (`main` CI 41449241609), the catalog commit `3e5d773`, an atomic push; CI on the tag
  (41452326966, publication mode), on `main` (41452325673) and Pages (41452325745) `success`;
  CB-6's live check, the second of a tag holding a slash, every URL 200 (prel-006 › Publication).
- `?` `DEBT` **The CHANGELOG's first line held by reading only**: `publish:pack` keeps the first
  `- 1.0.0` line of a three-line entry; plan-058's reads found it, ruling 2 kept the entry. The owed
  row stays open (trigger: the next `publish:pack` change).
- `+` **`activate` right after the tag** (dl-033 O1): the push, then `accepted → active`
  (`7fc293a`) with both of `pack-cycle` v6's checks met and open point 1 recorded settled; this
  retrospective's plan added after plan-058's close (`3803673`).
- Ruling 5 was the outline's one point ruled against its recommendation: `kanban`'s own
  retrospective (option (b)), not one held also as the periodic one (option (a)) (plan-058 ›
  point 8, ruling 5).
- `+` **The notices** sent only after the approver's OK on their text, to the recipients the
  approver chose, nothing to WingFoil (ruling 6, step 8).
- `+` Numbers under W-14: task-073, dl-034, bug-010 and F-042 reserved for a finding, released
  unused at plan-058's close, taken up by plan-059; no collision.

## 4. Cross-cutting themes

### 4.1 Reviews (dl-017)

- `+` Every element and every build reviewed; re-reviews when a fix changed a decision (plan-056's
  filter); all blocking findings before code or before acceptance (§1, §2); prel-006's two reviews
  nits only (§3). No rejection, no revert in the cycle.
- `−` No review caught a claim of scope made in a plan's reads (§4.3).

### 4.2 Unplanned tooling work inside a pack plan

- `−` Three tooling tasks and a bug outside the outline, each with a ruling (plan-057 rulings 6 …
  8), on top of tooling-delivery's own backlog gate. The rulings were not alike: ruling 6 was
  required by dl-019 (task-067's Acceptance "no warning" could not hold); ruling 7 chose between
  real options (an override or a CI policy); ruling 8 was mostly about order (before the first tag,
  after task-068 and task-069). plan-057 point 2 had let claude decide task-066 under the
  approver's allowance.
- `GOV` Whether, within the backlog acceptance tooling-delivery already asks, claude may set the
  order of such a task against the pack's tasks, as plan-057 point 2 did (GOV-3).

### 4.3 The Node.js warning's cause

- `−` The warning ("Keys with collection values will be stringified") was named as the composer's
  in plan-056 (ruling 13, its owed row, the charter's Ships and Acceptance) without its source being
  located. plan-057's reads located one site (the secret rules), stating it was "the only YAML parse
  made before substitution", from a trace taken only on paths that read overlays or scratch copies;
  the README index reads only `packs/`, where the draft never was, so `npm run index` never ran on
  the pack before task-067. task-066's body inherited the claim, its scratch check ran `check:packs`
  only (Acceptance 5), and its build review compared `secretProblems` on 28 inputs without looking
  for other parse sites. task-070's body review was the first to sweep every YAML parse in `src/`:
  two sites (plan-057 › Context; task-066 › Acceptance 5, notes; task-070 › Context, review).
- `−` The closed row was rewritten on task-070's branch (`2592c6a`) and reached `main` at its merge
  (`50b9af9`): for about a day `main`'s register showed as settled an item that was open again
  (§5, rule 4).
- Lesson (`GOV`, `?`): a defect of the tooling is recorded by the command and the output that show
  it, and its cause named only once located; a claim that a site is "the only" one is checked by a
  sweep of the call sites before a fix is scoped (GOV-8).

### 4.4 CI

- `−` **`main` red for about one day** on an advisory in a development dependency: runs 41196364111
  (`77510f3`, 2026-10-31), 41198090730, 41212381234, 41220802703, then `success` at 41298773055
  (`a2e0555`, 2026-11-01); the last green before, 41136522706 (`074fa07`). `+` Reported and ruled
  the same day (plan-057 ruling 7), answered by bug-009 and task-071 on bug-003's and bug-004's
  precedent; most of the red time was waiting for the next day's gate.
- `−` `DEBT` `GOV` **The CI-policy row met a third time** (bug-003, bug-004, bug-009). bug-009 ›
  Observed records that `npm audit --omit=dev` exits 0. The override answered it and opened two rows
  (`check:pins` and `overrides`; the override's removal, impossible while `eslint` 10.14.0 requires
  `minimatch ^10.2.6`, read 2026-11-02). The adoption (W10) does not settle the policy (GOV-1).
- `−` `DEBT` **The CI job's duration** (G12): task-068 recorded 19 min 26 s on 22.21.0 from one run
  (41340400993); `main`'s jobs in the cycle ran 11 … 22 minutes, 22.12.0 not always the shorter:
  11 min 1 s at 41110627604, 21 min 14 s at 41323565997 (before `kanban` landed), 21 min 55 s at
  41478783428 (plan-058's close, documentation only), about 21 min at 41483587039 (`0162c90`). A
  margin of about 8 minutes against `timeout-minutes: 30`, with a spread of about 11; the 5-minute
  threshold plan-057 set (point 4, task-068, dl-019) not crossed. One run understates it;
  task-068's first local timings ran beside a clean-clone suite and were measured again.
- `+` **Cancelled runs** handled as rule 3 foresees: six on `main` (41100831777, 41326856512,
  41327182140, 41336397512, 41408955746, 41482521398), each followed by a `success`; plan-058
  recorded its own (41408955746, covered by 41410811662).
- `?` **Every push read, not every run recorded**: successful runs on `main` cited by no element
  (41038873700 on `96f791b`, 41102153202, 41110627604, 41327196202, 41405976975). Rule 3 asks for
  the run to be read, so no breach; the record cannot show every read.

### 4.5 Runs by hand and their driving scripts

- `−` Three slips of scripts written outside the repository to drive WingFoil or the checks:
  plan-056's `capture` with no decision-log (§1), task-069's `sed` on `n/a` (§2), the dry run's
  `node_modules` link (§3). None changed a result; each cost a rerun or a third release. Evidence
  for the row of the scripted full runs (plan-050 ruling 3, widened to `kanban` by plan-057
  ruling 5), still without a tooling task on `runs.ts`.
- `?` **What a run by hand records as evidence.** plan-056 › step 2 records representative commands,
  counts ("each exits 0 except those named") and the exceptions, not every command; the draft
  overlay was untracked by design and deleted after task-067, so the charter's run cannot be
  reproduced from the repository. dl-032 E2 asks for the run "recorded with commands and exit
  codes" (`pack-compatibility`'s evidence rule); whether a summary meets it for a run by hand is
  unsettled (GOV-6).
- `?` dl-032 E2's text says the run's findings "go to the charter while it is `proposed`"; in
  practice the run comes before the charter exists (plan-056 › step 2, then `memory add` at step 3)
  and step 4's checks ran while it was `draft` (GOV-5).

### 4.6 The charter's open points

- `+` Open point 1 settled at the first version (plan-058 › step 7; the charter's note).
- `?` `DEBT` Open points 2 (a limit counts the refs WingFoil sees) and 3 (two releases of one version
  on two release lines) were exercised nowhere in the cycle: point 2 rests on the refusal message,
  every run on one branch; point 3 is inferred from the filter. Neither has a row in
  `docs/owed-items.md`, while `scrum`'s open points have rows; open point 4 shares `scrum`'s open
  point 2 row without being named in it. WingFoil documents point 2's counting (§6).
- `−` bug-008 still brings back closed retrospectives' `approve` steps under `kanban` (plan-056 ›
  step 2; task-069): the charter's open point 4, stated in the README, F-039 on the WingFoil side.

## 5. The rules of 2026-10-28 in their first cycle

| Rule | Held? | Evidence |
|---|---|---|
| dl-030 P1, `repository-practice` rule 1 (a request's origin) | held | plan-056 … plan-059 and task-070, task-072 write "asked by the approver on <date>"; elsewhere the origin is inherited from a plan's ruling (task-067 … task-069) or worded otherwise (task-066 "under the approver's allowance", task-071 "the approver ruled"); `3be4f38`'s message carries the formula. No session or tool named as an origin in the period's added lines or messages |
| dl-030 P2, rule 2 (the privacy check) | held | recorded at every branch close (plan-056 step 6, task-066 … task-072) and, for the plans on `main`, as "every commit … checked" (plan-057, plan-058); prel-006 checks the element and the pack. `?` plan-058 describes the two recipients of its notices as sessions, one of them asked to pass the notices on: so it carried an onward request, while plan-058's review note says "no session named"; rule 2 does not say whether a recipient or the carrier of a notice falls under it (GOV-7) |
| dl-030 P3, rule 3 (`main`'s CI after every push) | held | every push followed by a run, every cancelled run superseded by a `success`, the red day reported the same day (§4.4); five successful runs read but not cited |
| dl-031, rule 4 (the register) | held partly | rows in the same commit as their note: `1f9f7d2`, `06149a1`, `8cab3f6`, `96aa5f6`; settled rows closed with their element (task-066 and task-070, task-072, plan-058). Deferred to a close: plan-058 ruling 5's row (`6bc17bc` → `d319cb3`, asked by the close review), plan-057 ruling 5's widening (`7df3692` → `d311722`). A closed row whose item reopened (§4.3): rule 4 has no case for it. An approver-originated row whose Source is no element (`0162c90`, WingFoil UI's feedback), cited by no note until plan-059; `3be4f38`'s trigger changes, by contrast, cited by plan-057's note. R3 exercised for the first time here; R5 held (§3) |
| dl-032 E2 (a run before a charter's acceptance) | held; `?` on the record (GOV-6) | plan-056 › step 2 and step 4 (§1); the record gives counts and exceptions (§4.5) |
| dl-032 E3 (before publication) | held | `check:runs` with `kanban.yaml` (4 runs) and `adoption-kanban.yaml` (8 runs) on 0.3.0 and 0.3.1, cited in prel-006; `kanban` ships no `main` and `check:runs` cannot drive into `delivery`, so the workflows are E4's |
| dl-032 E4 (the exit criterion runs the workflows) | held | task-069 on 0.3.1 (§2), cited at `validate` behind the `git diff` guard; 0.3.0 by the matrix and `check:runs` only (plan-057 ruling 4) |
| dl-033 O1 (`activate` at the first tag, `retrospective` after) | held | `7fc293a` minutes after the push; this plan after plan-058's close |
| dl-033 O2 (a shared retrospective) | not exercised | plan-058 ruling 5 (b) |
| dl-029 (the periodic retrospective at an intake's close) | not exercised | no WingFoil release taken in during the period. WingFoil 0.3.2 was published on 2026-11-02 (npm, 17:12 UTC), after the period: its intake is now due, and its close starts the periodic retrospective (dl-029 T1, unless T2's patch case is ruled) |

## 6. WingFoil-side candidates (feedback notes)

- **WF-1 — `memory reject` moves a task into a state at or over its `limits`, with exit 0**
  (plan-056 › step 4; task-069; observed on 0.3.1). Read for this inventory in the 0.3.0 and 0.3.1
  packages (WingFoil's module `memory-transition`, the same on both): `reject` and `park` are exempt
  from the WIP check by design ("the approver's verdict and a scheduling step are not capped by a
  capacity rule"), citing WingFoil's dl-156 Q2 (i). Under `kanban`, `park` returns a task to
  `backlog`, which has no limit, so only `reject` matters. The exemption is stated in the code's
  comments, not in WingFoil's README. **Proposed: no note**: a design WingFoil's approver ruled, and
  the pack states it and keeps its own rule for it (the `kanban` directive; the charter's
  Adaptations). Alternative: a `request` note (should `reject` warn when it leaves a state over its
  limit?).
- **WF-2 — the limits count holders on every ref WingFoil sees** (the charter's open point 2). The
  same code ends every WIP refusal with where the holders were counted, citing WingFoil's dl-156
  Q1 (a) and task-274. **Proposed: no note**; the open point is a matter of this repository's
  evidence (§4.6), not of WingFoil's.
- Seen again, already noted: `memory approve`'s `illegal transition draft -> (none)` (F-024); a closed
  retrospective's `approve` back on the frontier (F-039, bug-008); a task's `release` written by
  editing the draft (F-034); a release added outside a step (the F-037 family). Not a defect:
  `W_PHASE_TOKEN_OUT_OF_SCOPE` for `{release.id}` (the template declares no `id`).

With no note proposed, task-073 is not opened (plan-059 point 6), unless the approver adds one.

## 7. Candidate changes of governance

Each is a point, ruled by a decision-log under `decision-log-ingest` if kept (dl-006 R2 as amended
by dl-022). The column W10 applies the test of plan-059 point 5 (the inventory of 2026-10-28, P1):
does this repository's adoption of the packs and its pin at 0.3.1 fix it?

| # | Candidate | Inventory | W10 fixes it? |
|---|---|---|---|
| GOV-1 | A CI policy for advisories in development dependencies (the third bug of the kind; `npm audit --omit=dev` exits 0) | §4.4 | no |
| GOV-2 | What dl-031 R1's default trigger "the next retrospective" means: the next retrospective of any kind, or the next periodic one (ten rows carry it; plan-059 ruling 4 keeps them, triggers unchanged) | §8 | no (`repository-practice` survives W10) |
| GOV-3 | A tooling defect found inside a pack plan: within tooling-delivery's backlog acceptance, claude sets the task's order against the pack's tasks, as plan-057 point 2 did; a ruling only where dl-019 requires one or real options exist | §4.2 | no (the ordering question survives; at W10 a task enters `backlog` outside the flow, so it is worded on `pack-cycle`'s side) |
| GOV-4 | Rule 4's gaps: a row left by a ruling added with the ruling's note, not at the close; a closed row whose item reopens; a row asked by the approver outside any element (its Source and the note that cites it) | §5 | no |
| GOV-5 | dl-032 E2's wording: the run's findings go to the charter "before it is accepted", not "while it is `proposed`" | §4.5 | no (`pack-cycle` is this repository's own) |
| GOV-6 | What a run by hand records as evidence: a summary with counts and exceptions, or the full log kept reproducible | §4.5 | no |
| GOV-7 | Whether rule 2 covers the recipients of an outgoing notice, or only the carrier of a request | §5 | no |
| GOV-8 | A tooling defect recorded by its command and output, its cause named only once located; a claim of "the only site" checked by a sweep of the call sites | §4.3 | no |

Not changes: dl-019 cited by analogy for a charter's findings (§1, `?`); task-071's red-first by
`npm audit` exit codes (§2, `?`); the tooling WIP limit exceeded by hand (§2, evidence on the
per-pack WIP row of §8).

## 8. The register

`docs/owed-items.md` at `0162c90`, 38 open rows, each with a proposal (dl-031 R3), following plan-059
ruling 4: rows this cycle touched on their merits; rows with the trigger "the next retrospective"
it did not touch kept, triggers unchanged (GOV-2); rows of W10, the adoption or the pin bump kept
unless settled; every other row kept unless settled.

| Item (short) | Proposal | Reason |
|---|---|---|
| CI policy for advisories in transitive dependencies | keep; GOV-1 | met a third time (bug-009, `main` red about one day); trigger unchanged until GOV-1 is ruled |
| `check:pins` covering `overrides` | keep | opened in the cycle (task-071); no dependency update since |
| The `minimatch` override removed | keep | `eslint` 10.14.0, `@eslint/config-array` 0.23.5 and `@typescript-eslint/typescript-estree` still require `minimatch` 10 (read 2026-11-02) |
| Recheck W-01 … W-14 and the open notes against 0.3.x | keep | the pin is still 0.2.2; 0.3.2, published after the period, joins the releases to recheck |
| G7 in-place amendment | keep | W10; §1's charter text adds a case |
| G8 dl-017 R2 for documents and configuration | keep | W10; not settled |
| G9 the inbox's first line, reserved gaps | keep | W10; no note in the period |
| G11 a terminal state for a fixed bug | keep | W10; bug-009 is still `approved` after its fix, the same symptom |
| G12 the suite's duration against the CI timeout | keep, evidence added | §4.4: up to about 22 of 30 minutes on `main`, a spread of about 11; the approver may set an earlier trigger (the next CI step that adds runs) |
| A check of the CHANGELOG's first line | keep | held by reading at prel-006 (§3); no `publish:pack` change |
| A "known defects" marker in `catalog.yaml` | keep | not touched |
| Custom `sw-life-cycle` shares `software`'s name | keep | the adoption |
| `software`'s `tech-lead` needs a holder | keep | the adoption |
| `pack-cycle` v6 checked on the engine | keep | v6 followed by hand for `kanban`; O2's completion by reference not exercised |
| `software` charter text drift | keep | not touched |
| `scrum` open point 1 | keep; **flag** | its trigger, UI's adoption, looks met (the WingFoil UI row, `0162c90`): to be settled by the plan of WingFoil UI's feedback |
| `scrum` open point 2 (`explore`'s weak evidence) | keep | seen again under `kanban` (§4.6); `kanban`'s open point 4 shares it |
| A decision-log making in-place amendment general | keep | not touched |
| `pack-delivery`'s selection over `accepted` packs | keep | plan-056 accepted the hosting deviation again; not settled |
| `--param` on an `entries` composition only | keep | not touched |
| `pack-semver` rule for fixes and changed defaults | keep | `kanban`'s defaults fixed at 1.0.0 (prel-006) settle nothing of the rule |
| `plan-{n}-{slug}` or `{workflow}-{phase}-plan` | keep | the adoption |
| `check:runs` scenarios of the full scrum and kanban runs | keep | widened to `kanban` (plan-057 ruling 5); three driving-script slips add evidence (§4.5) |
| 0.3.1's `COLLABORATION.md` inbox text | keep | no sync |
| README step 3 "own entries" | keep | answered for `kanban` (task-067); `base`'s, `software`'s, `scrum`'s open |
| Sequencer: W8 has four features | keep | no sequencer review |
| dl-012's F4.9 placement | keep | dl-012 `pending` |
| W10: presets, `governance/wingfoil-dogfood`, the adoption, the pin, the first sync | keep | `kanban`'s part closed by plan-058 (`d319cb3`); the rest open |
| dl-024 and dl-025 ruled; plan-022 closed | keep; **flag** | trigger WingFoil v0.4's planning, not before 2026-11-06 (WingFoil's timing as of 2026-10-28; 0.3.2 now published): due within days |
| `06_features.md` 1.5 → 1.6 | keep | no plan has changed the documentation since |
| Per-pack WIP rule under `kanban` | keep, evidence added | the adoption; plan-057's brief overlap of task-070 and task-071 under `tooling-delivery`'s limit, not recorded as an exception (§2) |
| Tasks carrying a `release` under `kanban` | keep | the adoption |
| Custom workflows sharing `base`'s and `software`'s names | keep | the adoption |
| `pack-author` phases mapped to `developer` | keep | the adoption |
| `kanban`'s own `pack-cycle` retrospective | close at plan-059's close | settled by plan-059 (dl-034) |
| The private projects' check scripted | keep | not touched (prel-006 needed no private check) |
| dl-026's stale Consequences | keep | not touched |
| WingFoil UI's adoption feedback | keep; **flag** | its trigger is met at plan-059's close: the next plan; its Source is no element (GOV-4). WingFoil 0.3.2's intake is due too (§5): which comes first is the approver's |

Candidate new rows (`DEBT`), for the approver:
- `kanban`'s open point 2 exercised (a holder on a second branch), owner W10, trigger the
  adoption, where this repository's per-pack rule meets the whole-repository count;
- `kanban`'s open point 3 exercised (two releases of one version on two release lines), owner
  approver, trigger a `software` whose `release` template declares `id`, or the first adopter with
  parallel release lines (this repository's packs are released per pack, not through `release`);
- open point 4 named in `scrum`'s open point 2 row (§4.6);
- `kanban` charter text drift: Ships and Acceptance name the composer's warning, corrected only by a
  note (§1), owner approver, trigger the next retrospective (with `software`'s drift row).

## 9. What went well, in short

- Charter to published 1.0.0 in four days, every gate of `pack-cycle` and `pack-release-cycle`
  passed, the publication byte-exact and CB-6 live.
- dl-032's first full use: E2 settled three points of the shape before acceptance; E4 then found
  nothing, and the rehearsal found no break with a fourth pack.
- Reviews and re-reviews everywhere; every blocking finding before code or acceptance; every count
  the plans predicted held.
- Red-first on every tooling task; clean clones on both Node.js versions, one after the other, on
  every code task; `main` green after every delivery, the one red day reported and fixed in a day.
- Every unplanned item went to the approver when found, and every item a task left got its row.
- dl-030 and dl-033 held in their first cycle; dl-031 held partly (§5).

## Points to analyse (additional-points)

<!-- Added by the approver at the checkpoint. -->
