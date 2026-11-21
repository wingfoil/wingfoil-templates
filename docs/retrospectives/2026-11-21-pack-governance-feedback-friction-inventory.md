# Friction inventory — pack-governance-feedback, 2026-11-21

Phase `explore` of `pack-cycle` › `retrospective` (`retrospective` v5), under plan-078. It covers
the cycle of `governance/feedback` alone (plan-077 ruling 10): `charter` (plan-073), `design`
(plan-074, spec-003), the tooling before `author` (plan-075), `author` (plan-076), `first-release`
and `activate` (plan-077). It is not the periodic retrospective: dl-029's trigger has not come
since 2026-11-04 (plan-061, dl-038), and W10's stays at the end of the wave.

- **Period:** 2026-11-14 (plan-073 written, `697a984d`) → 2026-11-19 (plan-077 `done`,
  `d3f3c6f3`).
- **Sources read:** plan-073 … plan-077 (outlines, rulings, Execution Notes, closes); task-092 …
  task-100 with their reviews; prel-007; spec-003; the charter `pack-governance-feedback` (body,
  Open points, Execution Notes); F-048 … F-051; `docs/owed-items.md`; the git log and the public CI
  and intake runs of the period.
- **Not sources:** plan-070 … plan-072, plan-071 included (plan-078 ruling 2); dl-012 and dl-013,
  cited where a source cites them; the pack release round and `governance/wingfoil-dogfood`
  (later plans).
- **Method:** three read-only strands (`charter` and `design`; the tooling and `author`;
  `first-release` and `activate`), merged here; plus the register's reading for §8.
- **Not observed in this cycle:** plan-078's candidate "the dry run refused again on a linked
  `node_modules`": no source of the period and no run of plan-077 shows it (the dry runs exited 0
  at once); it is left out.
- **Legend:** `+` went well · `−` friction · `WF` WingFoil-side (candidate feedback note, §6) ·
  `GOV` candidate change of this repository's governance (§7) · `DEBT` an owed item (§8) ·
  *(unrecorded)* observed during the work and written in no element: kept only if the approver
  confirms it at `additional-points` (plan-078 ruling 3).

Each point cites its source as element id and section, a commit, or a CI run id. Candidate numbers
(`WF-n`, `GOV-n`) are this inventory's.

## 1. `charter` (plan-073)

- `+` **The run on the engine before acceptance settled the shape** (dl-032 E2; plan-073 ›
  Execution Notes 2026-11-14, step 2, `b8e35733`). A draft overlay validated with `base` alone and
  with `software` and each methodology on 0.3.0 and 0.3.2 (28 runs, 0 failed); about 100 commands
  on 0.3.2 found that required fields are checked at `submit` only (ruling 2: `outcome` and
  `resulting` optional), that `where` takes inclusion lists only, that 0.3.2 evaluates no `checks`
  string, and that the `bug` route's first variant left the bug owned by the route's run (variant
  (a'), ruling 3).
- `+`/`WF` **Two WingFoil defects found by that run** became F-048 (a later capture run's plan named
  after the previous item) and F-049 (the refusal naming `workflow transfer`), by ruling 5 a task of
  their own (task-092).
- `+` **Every review before acceptance** (plan-073 › Execution Notes; the charter › Execution
  Notes): the plan 0 blockers, 5 should-fix, 5 nits, then 0/3/3 and 0/2/2; the charter 0/6/4,
  0/3/2 and 0/1/4.
- `−` **The charter chose `pack.yaml` format 1 against spec-001 §5** ("a new pack is written at
  format 2", repeated in `pack-authoring`), and none of six reviews of the plan and the charter
  caught it; plan-074's Context did, and its point 8 ruled format 2. The charter's Compatibility
  still reads format 1, superseded only by an Execution Note (`ec70a9ee`); FA-5's parenthesis is
  the same pattern (a later reading in a note). `DEBT`: charter text drift (§8); `GOV-5` (§7).
- `−` **The interim triage rule lived less than a day.** It came out of the charter's review, was
  ruled at acceptance, and spec-003 §4.3 replaced it the same day, but for a would-be `bug` without
  `software` (the charter › Execution Notes 2026-11-16).
- `−` **A plan moved to `done` by a second `memory submit`** sent by mistake (`425046c0`, after the
  approver's `637d9949`), reverted on the approver's OK (`61bc7836`), "no CLI verb moves a plan
  back" (plan-073 › Execution Notes 2026-11-14).

## 2. `design` (plan-074, spec-003)

- `+` **The first `design` phase producing a tech-spec answered all five Open points with no
  erratum** (spec-003 §1, §12; the charter › Execution Notes 2026-11-16): list parameters, the
  `bug` outcome and the triage rule (§3, §4), an upstream's channel (§5), the entry's shape (§6),
  how the entry's directive reaches an agent (§7), `reported_by` (§8), the format (§9). Written,
  reviewed twice, approved and folded back into spec-001 and `pack-authoring` in one day
  (`170413c5`, `e44ee8af`, `ec70a9ee`). Later plans ruled readings only, none folded back (dl-020
  R2; plan-075 and plan-076 › close).
- `+` **The probes confirmed point 2's item rule against today's composer** (plan-074 › Execution
  Notes 2026-11-16, step 2; `992170fd`): a list value `x], kind: [defect` exited 0 and rewrote a
  `where`; the evidence for spec-003's item rule and its composer check. The same probes drove the
  `upstream-note` route to `closed`, which plan-073 had left unexercised.
- `−` **Rules ruled up to three times** (plan-074 › The approver's rulings, three paragraphs,
  `46b9633e`, `cde3c985`): points 2 and 5 on the outline, after the plan's reviews and after
  spec-003's; blockers on substance (the list parameter changes format rules, not the schema; the
  unquoted rule limited to `string`, `kanban`'s `{{wip_in_progress}}` being an `integer`; the
  entry-directive rule narrowed for a methodology's `delivery` and the bridges). The plan's
  reviews 2/8/7, 1/6/4, 1/3/3; spec-003's 1/9/7 and 1/4/5: every blocker on text, none in code.
- `−`/`DEBT` **`agent execute` unusable on a composed project** (plan-074 › step 2; spec-003 §12
  S3-O3): `--dry-run` exited 1, "no agent in dna.yaml with an adapter executes as role
  'facilitator'"; spec-003 §7.2 rests on the `feedback` directive and `workflow next`; S3-O3 is held
  by the row "The engine way of working".
- `WF` **A contrast case for WF-1** (plan-074 › step 2, "Listing"): `directives list` showed the
  entry's `feedback-bug-route` `unassigned` while `workflow list` gave `"diagnostics": []`; it is
  unassigned by design, a step's `agent.execute` naming it (spec-003 §7), so the note excludes a
  directive a step names (§6).

## 3. The tooling and `author` (plan-075, plan-076)

- `+` **task-092: four notes, each reproduced with WingFoil alone** on 0.3.2, one commit per note
  (`68e6aa80`, `5babb242`, `f5bf5605`, `ff917ccb`), red by mutation (dl-018 R2); the reproduction
  found F-049 stronger than its Design and went to the approver (dl-019); F-048's kind ruled `gap`
  (task-092 › Execution Notes 2026-11-16).
- `+` **Reviews before code on every plan and on task-093 … task-096's bodies** (their Execution
  Notes): plan-075 0/8/9 then 0/3/6; plan-076 2/9/5, 1/6/5, 0/1/1, its blockers being that point
  2's steps could not drive a route and that `check:runs` had no `overlay:` key; task-096's body
  1/6/7 (the FA-6 test asked the directive to name no `bug`, which criterion 4 requires).
- `−`/`GOV-4` **task-097 … task-099's body reviews recorded no findings** (their Execution Notes;
  the commits `650298e3`, `82e520cf`, `b629ba5d` say "body, reviewed"); task-093 … task-096 record
  the counts of each round, so the habit lapsed.
- `+` **Build reviews caught design defects** (each task › Execution Notes): task-093 2/4/6 (no
  shared placement case table across the lint and the composer; the lint's channel set not
  composed by `runCompose`), a re-review and a focused re-review of the YAML scanner; task-094
  surviving mutants killed; task-095 the `.git` refusal after token expansion; task-096 a
  project's own kinds in a `custom/` directive, not in an override of `feedback`.
- `+` **Red first on every tooling and pack task with code** (task-093 four type errors, then 5, 1
  and 1 failing; task-094 9 of 13; task-095 13 of 64, `9f3e522d`; task-096 10 of 10, `4e9a77e6`;
  task-097 14 of 102 and 1 of 1, `6d69139d`; task-098 27 of 29, `6418f3c9`), with departures:
  task-093's item rule wired before its composer test, checked by mutation; task-097's and
  task-098's red counts include failures of their own test helpers, fixed in the build.
- `−` **Slips recorded in task-093** (› Execution Notes): `npm test` started while `dist/` was
  rebuilt failed 51 tests (rerun 1330 passing); a build-note claim corrected (`validate --param`
  exits 1 on `main` too).
- `+` **`check:runs` drives a route** (task-095): several mains in one repository, labelled
  elements, field and file writes, a composition filter and an overlay; 46 runs unchanged on its
  commit, 84 after task-097, as plan-076's re-review foresaw ("about 19 per release").
- `−` **FA-6 is scripted in part**: seven routes by `check:runs`; `duplicate` and `decision-log`
  through `governance-evolution` by the run by hand only, a reading ruled at plan-076's close.
- `+` **Rulings asked when found** (plan-075 › steps 3, 4; plan-076 › rulings and close; task-098
  › Context; task-099 › Context): a built-in directive in an entry's `agent.execute` (task-093); a
  `commit` reference kind (task-094, FA-5's reading of 2026-11-17); FA-6's `n/a — <reason>`
  excluded from the generic checks, since spec-001 §18 allows `not_applicable_allowed` only on a
  required field (2026-11-18, dl-019); the agent's `memory approve` only in task-099's scratch
  repositories.
- `−` **task-099's first run, re-driven** (› Execution Notes; `345d0dd8`): its review (0/3/3) found
  the `custom/` directive bound to no role and an upstream note naming a release it was not seen
  on; both repositories composed again from `52d125c2` and all 11 routes driven again, 136 commands
  exit 0.
- `−` **task-097's probe named a repository that did not exist**, so its commands ran in the
  worktree; WingFoil refused each, nothing changed (task-097 › Execution Notes, the empty
  frontiers).
- `−`/`GOV-4` **Claims corrected by a final check, not recorded as corrections**: `8c31df80` said
  "no refusal, no warning" and `345d0dd8` "no command assigns one"; `a46d70e6` replaced them with
  `wingfoil directive assign` and the `directiveWarnings` advice, and rewrote the owed row. The
  task's notes say only that a final check covers the second run.
- `−` *(unrecorded)* **A red commit amended before its push** (task-098, `6418f3c9`: a compound
  command committed code an edit had not fixed). The commit's author and committer times differ,
  which fits an amend; no element records it.
- `+` **CI under dl-039 R3's 25 minutes** (each task › checks): the longest branch job 16 min 46 s
  (task-097, run 44274431167); `main`'s longest jobs 9 … 14 min in plan-075 and plan-076, and
  18 min 5 s in the cycle (task-100's merge, run 44488635424, plan-077 › step 2). dl-039's order
  held on every task, each frozen commit named.
- `DEBT` **Two known limits with no row**: `includeList`'s `include === null`, unreachable and left
  in place (task-095 › Execution Notes); the placement scanner's continuation line beginning with
  a quote, `[` or `{` (task-093 › re-reviews), recorded as a comment in the scanner.
- `−` **WingFoil 0.3.1 read by hand twice** (task-096 criterion 9; task-097 criterion 3): the
  matrix selects only the oldest and the newest release of `compat.yaml`.

## 4. `first-release` and `activate` (plan-077, task-100, prel-007)

- `+` **One day from the ruled outline to `done`** (2026-11-18 evening → 2026-11-19), as plan-058's
  release: task-100, the rehearsal, `prepare`, `validate`, the approval, the publication,
  `activate` and the close.
- `+` **task-100** (› Acceptance, Execution Notes): red first (51 tests, 4 failing, `68d26a0c`),
  71 of 71 after the build (`8bb60540`); the mirror test keeping `verify`'s overlays equal to
  ci.yml's, mutation-tested four ways by the build review, tightened in `e0301d43`; the intake
  rehearsed on the branch (run 44485593008) and on `main` (run 44488679681), both `rehearsal of
  0.3.2 guided: 7 reasons`. `GOV-2`: criterion 9 put the rehearsal on `main` before the close
  commit and `done`, an order plan-077 step 2's wording did not give.
- `−` **The intake's report text is not served by the API**; it was rebuilt by `intake:report` from
  the run's artifacts to check criterion 6 (task-100 › Execution Notes).
- `−` **dl-039's local list run wrong first** (task-100 › Execution Notes): the golden step in
  self-test mode, rerun in publication mode; *(unrecorded)* `workflow list` with an option it does
  not have (exit 2), rerun, only the exit 0 recorded.
- `+` **The rehearsal with the first format-2 manifest** (plan-077 › step 3): a real `publish:pack`
  in a scratch clone with no remote, 28 runs, the entry `pack_format: 2` and `conditional`, then
  1432 of 1432 tests and every check on the result; no tooling task needed.
- `+` **The Validation on two Node.js releases** (prel-007 › Validation): clean clones on 22.21.0
  then 22.12.0, every command exit 0; the skipped leg `defaults[+software]` explained (the format
  forbids a `software` without a methodology; the review corrected its citation to task-087
  ruling 3). *(unrecorded)*: the floor Node.js 22.12.0 was found only in a git-ignored cache of the
  repository; prel-007 does not say where it came from.
- `+` **Ruling 7 applied** (plan-077 › steps 6 … 8; prel-007 › Publication): the approver ran
  `publish:pack`, the atomic push and the activation from the commands claude handed over; claude
  read the tag, the three runs and CB-6; for `activate`, claude's two commits first, the
  approver's `memory submit` and push carrying them. *(unrecorded)*: the commands were four,
  numbered, each with its expected output, and a stop condition.
- `−`/`GOV-1` **What claude could not see**: `publish:pack`'s output printed in the approver's
  shell; prel-007 reads its success from the catalog commit and the tag's CI (prel-007 › Execution
  Notes, `publish`). Claude pushed the approval commit `84cb0858`, which ruling 7 does not name
  (prel-007 › Execution Notes, `approve-publication`). *(unrecorded)*: two more approver turns
  than plan-058, and claude's two `activate` commits waiting for the approver's push.
- `DEBT` **Who ran what is not visible in git**: every commit has one author; claude's non-`wf`
  commits carry `Co-Authored-By`, the `wf(...)` commits never do, whoever ran them; the approver's
  steps are told apart only by the records (task-100's `a81a0984`, `b540d243`; prel-007's
  `84cb0858`; the catalog commit `977cc087` and the tag; the charter's `4a9d46fe`). The row "The
  engine way of working" holds the credit question.
- `−`/`GOV-3` **A line over 100 characters in prel-007**, fixed in `66bc66a7`. The 100-character
  rule is written in no directive and checked by no lint (`lint` is ESLint only).
  *(unrecorded)*: the amending command's length check printed the line but did not stop the
  commit, the submit and the push that followed, so the line reached `main`.
- `−` *(unrecorded)* **A network failure in a chained CI watch** skipped the push that followed it;
  found as `main` ahead by one, re-read and pushed by hand; later watches retry. The CI runs on
  `e85533a5` and `66bc66a7` are not recorded (plan-077 step 5 says only "its CI read").
- `+` **Reviews before each gate** (their Execution Notes): plan-077 6 should-fix and 6 nits, then
  4 and 3; task-100's body 4/5 then 3/3, its build 0/2; prel-007 1/3 at `prepare`, 1/3 at
  `validate`; the close's review.
- `DEBT` **The sequencer left stale**: `docs/01_vision/07_sequencer.md` W10 still reads F4.9 "not
  started"; the first pack release since its "State of the waves" (plan-069), and no step of a
  release updates it (a row, plan-077 › close).
- `−` **A gendered pronoun for the approver in earlier texts**: "on his OK" (plan-076 › Execution
  Notes; task-098 › Execution Notes) and "in his own shell" (the row "The engine way of working").
  The approver's pronouns are stated nowhere in the repository; "the approver" reads the same
  everywhere. Proposed: new texts write "the approver"; the texts on `main` stay as written
  (`repository-practice` rule 1), the row's wording revisited when the row is next changed.

## 5. Cross-cutting themes

### 5.1 Reviews (dl-017)

Every element was reviewed before its gate. The cycle's twelve blockers: four in plan-074's
three reviews, two in spec-003's, three in plan-076's, one in task-096's body, all found on text
before code; two in task-093's build review, found before the merge. Two gaps: six reviews missed
the charter's format against spec-001 §5 (§1); three task bodies recorded no counts (§3).

### 5.2 The record of a run by hand

task-099's notes grew by replacement: two claims later found false ("no warning", "no command
assigns") were rewritten by a final check without a correction note (§3). The run's facts are
right on `main`; the history of how they were found is in the commits only.

### 5.3 Checks that report and do not gate

The line-length check printed and the command went on (§4, *(unrecorded)*); the chained CI watch
failed and the push after it was skipped silently (§4, *(unrecorded)*). In each case the next step
was not tied to the check's exit.

### 5.4 The approver at the publication

Ruling 7 worked as written (§4). Its costs: the publication's own output is not in the record, two
more turns, and commits waiting for the approver's push. The adoption (W10) makes the rule
permanent ("an agent never runs `publish:pack`", the row "The engine way of working"), so these
costs stay unless a rule says how the output reaches the record.

## 6. WingFoil-side candidates (feedback notes)

- **WF-1 — a `custom/` directive no role binds raises no warning** in `directives list` or
  `workflow list` on 0.3.2 (task-099 › Execution Notes, criterion 7; the owed row "A `custom/`
  directive no role binds", which asks for a note). Adjacent, not the same: F-051 (a phase cannot
  bind a directive) and F-041 (an unheld role accepted silently). Excluded from it: a directive a
  step names in its `agent.execute`, unassigned by design (plan-074 step 2, §2). **Proposed: a
  note** (`request`: should `workflow list` or `directives list` warn on a directive that no role
  binds and no step names?), reproduced on 0.3.0 and 0.3.2, by task-101 (plan-078 point 6); it
  settles the row.
- **WF-2 — `base` composed without `software`: `decision-log-ingest`'s `product-owner` has no
  directive** (task-099 › criterion 7). WingFoil's warning is right: the gap is `base`'s.
  **Proposed: no note**; the row on `base` stays.
- **WF-3 — a second `memory submit` moves a plan `active → done`, and no verb moves it back**
  (plan-073 › Execution Notes 2026-11-14). It ran on the 0.2.2 pin; `submit` moves a document one
  step forward by design; F-025 and F-033 (no verb leaves or reverses a state) are its neighbours.
  **Proposed: no note**; checked again at the pin bump (the row "Recheck W-01 … W-14").
- Seen again, already noted: fields filled by editing the draft (W-02); F-048 and F-049, written in
  the period.
- **Timing** (plan-078 point 6): WingFoil's v0.4 release planning started on 2026-11-03 (dl-040).
  No source in this repository records it closed, so task-101's merge goes to `main` on its own,
  ahead of the branch, on the approver's OK.

## 7. Candidate changes of governance

Each is a point, ruled by a decision-log under `decision-log-ingest` if kept (dl-006 R2 as amended
by dl-022). The column W10 applies plan-078 point 5's test (the inventory of 2026-10-28, P1): does
this repository's adoption of the packs fix it?

| Id | Candidate | W10 fixes it? | Proposed |
|---|---|---|---|
| GOV-1 | A pack-release's Publication when the approver runs `publish:pack`: its output reaches the record (the approver saves it, or `publish:pack` writes its report to a file the agent reads), and who pushes the approval commit | no: the adoption makes ruling 7 permanent | a decision-log |
| GOV-2 | A tooling task with a check on `main` after its merge (an intake rehearsal): the check before the close commit and `done`, as task-100 criterion 9 | no: `tooling-delivery` has no slot for it, and the row "The engine way of working" says nothing of it | a decision-log |
| GOV-3 | The 100-character rule for repository texts written in a directive and checked by a script, so a commit or push stops on it | no | a decision-log, its check a tooling task |
| GOV-4 | A review's counts recorded in the element's Execution Notes (blockers, should-fix, nits), and a claim found false recorded as a correction, not overwritten | no: the row's "dl-017's reviewer as the checker before every gate" holds today and says nothing of the record | a decision-log |
| GOV-5 | A charter's review checks it against the format spec-001 currently requires | no | none: one case; the charter drift row (§8) |

## 8. The register

`docs/owed-items.md` at `33260fd2`, 54 open rows. Following plan-078 ruling 4 and dl-036 R1: one
line for each row this cycle touched, with its proposal; every other row "not touched", kept.

| Item (short) | Proposal | Reason |
|---|---|---|
| `check:runs` scenarios of the full scrum and kanban runs | keep | narrowed by task-095 to `memory park`, `memory reject`, `set_state` and a refusal expected; trigger unchanged |
| The packs' Memory templates (`reported_by`) | keep | extended by plan-074 point 6 (spec-003 S3-O4); the pack release round |
| A check of the CHANGELOG's first line | keep | plan-077 ruling 3; `publish:pack` unchanged |
| The private projects' check scripted | keep | plan-077 ruling 6; no release needed it |
| The engine way of working | keep | opened in the period (2026-11-16); ruling 7 applied its publication part early; holds S3-O3 and the credit question (§4) |
| `governance/feedback`'s own retrospective | closed at plan-078's close | this retrospective (dl-043) |
| The sequencer's W10 state | keep | opened at plan-077's close; the next sequencer update |
| A `custom/` directive no role binds | settled by WF-1's note if kept | its owed note (§6) |
| `base` composed without `software` | keep | `base`'s next minor release (WF-2) |
| W10: presets, `governance/wingfoil-dogfood`, the adoption, its pin, the first inbox sync | keep | read at plan-077's close and left as it is: it does not name this pack; its "presets" part is done (plan-070), for the periodic retrospective |
| *(new)* Charter text drift of `governance/feedback`: Compatibility's format 1, FA-5's parenthesis | add: owner W10, trigger G7 (in-place amendment) | §1; as `kanban`'s and `software`'s drift rows |
| *(new)* The placement scanner's known limit (a continuation line beginning with a quote, `[` or `{`) | add: owner claude, trigger the next tooling task on the lint's scanner | §3; a comment only today |
| *(new)* GOV-2 and GOV-4, if kept as rows | add: owner approver, trigger the adoption | §7 |

Closed in the period, for the record: `governance/feedback`'s `design` phase (spec-003); two
feedback notes to WingFoil (task-092); the fixture-element checks (task-093, task-094); their
bindings (task-098); `feedback-exit` in the intake (task-100). Not proposed: a row for
`includeList`'s unreachable `null` comparison (§3), harmless and tested by another mutation.

The other 44 open rows, not touched, kept: `check:pins` covering `overrides`; the `minimatch`
override removed; bug-011's … bug-015's fixes (five rows); Recheck W-01 … W-14; the `mcp` kind's
tooling; the `Precedence:` lines of `base`, `software`, `methodology/scrum` and
`methodology/kanban` (four rows); dl-025 D4's two halves; G7; G8; G9; G11; this repository's
custom `sw-life-cycle`; `software`'s `tech-lead` holder; `pack-cycle` v6 or v7 on the engine; the
built-in directive ids compared by the matrix; F-019's facts from bug-010; dl-041 G1's later
part; dl-041 G3 in `pack-semver`; the charter drift of `software`; `kanban`'s open points 2 and 3
(two rows); the charter drift of `kanban`; `scrum`'s open point 2; `pack-delivery`'s selection;
`plan-{n}-{slug}` or `{workflow}-{phase}-plan`; Check 0.3.1's `COLLABORATION.md`; README step 3
"own entries"; the per-pack WIP rule; how tasks carry a `release`; the custom workflows sharing
`base`'s and `software`'s names; `pack-author`'s phases under `work-item`; the notice to WingFoil
UI; the weekly reading of `intake.yml`'s runs; the reply's later part; the two rows of the first
`stage/*` charter.

## 9. What went well, in short

- Charter to published and active in five days, through the first `design` phase with a
  tech-spec, the first pack at format 2 with a conditional part, and every gate of `pack-cycle`
  and `pack-release-cycle`.
- dl-032's runs on the engine found the shape's points and two WingFoil defects before
  acceptance; the rehearsal found no break with the first format-2 manifest.
- Every plan, spec and body blocker found on text before code, the two build blockers before the
  merge; every unplanned point sent to the approver when found.
- Red first on every task with code; dl-039's order on every task; `main` green after every
  delivery; no CI job over 25 minutes.
- Ruling 7 applied with nothing run on the approver's behalf within its scope.

## Points to analyse (additional-points)

None added yet.
