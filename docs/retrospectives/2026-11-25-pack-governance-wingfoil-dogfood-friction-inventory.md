# Friction inventory — pack-governance-wingfoil-dogfood, 2026-11-25

Phase `explore` of `pack-cycle` › `retrospective` (`retrospective` v5), under plan-088. It covers
the cycle of `governance/wingfoil-dogfood` alone (plan-087 ruling 9): `pack-ingest` (plan-082 …
plan-084, dl-051), `charter` (plan-085), `author` (plan-086, task-104, task-105), `first-release`
and `activate` (plan-087, prel-008). It is not the periodic retrospective: dl-029's trigger has
not come since 2026-11-04 (plan-061, dl-038), and W10's stays at the end of the wave.

- **Period:** 2026-11-24 (plan-082 written, `f6d44f3b`) → 2026-11-25 (plan-087 `done`,
  `e08a53ab`).
- **Sources read:** plan-082 … plan-087 (outlines, rulings, Execution Notes, closes); dl-051;
  task-104 and task-105 with their reviews; prel-008; the charter `pack-governance-wingfoil-dogfood`
  (body, Open points, Execution Notes); dl-044's note of 2026-11-25; dl-048, dl-050 and
  `pack-ingest` v1, the rule this cycle's `pack-ingest` run is read against; `docs/owed-items.md`;
  the git log and the public CI and intake runs of the period (plan-088 ruling 2).
- **Not sources:** plan-079 … plan-081 (the `pack-ingest` workflow's capture and the actions of
  dl-044 … dl-050); dl-012, cited where a source cites it; the pack release round and this
  repository's adoption (later plans).
- **Method:** two read-only strands (`pack-ingest`, `charter` and `author`; `first-release` and
  `activate`), merged here; plus the register's reading for §8.
- **Not observed in this cycle:** plan-088's *(unrecorded)* candidates "a machine restart lost
  task-105's temporary worktree and the first rehearsal" and "lines over 100 characters after
  scripted edits" are in no element of the period; they stay *(unrecorded)* until the approver
  confirms them (§3, §4). No long line reached `main`: there is no rewrap commit in the period.
- **Legend:** `+` went well · `−` friction · `WF` WingFoil-side (candidate feedback note, §6) ·
  `GOV` candidate change of this repository's governance (§7) · `DEBT` an owed item (§8) ·
  *(unrecorded)* observed during the work and written in no element: kept only if the approver
  confirms it at `additional-points` (plan-088 ruling 3).

Each point cites its source as element id and section, a commit, or a CI run id. Times are commit
author times (+0100) unless marked UTC. Candidate numbers (`WF-n`, `GOV-n`) are this inventory's.

## 1. `pack-ingest` (plan-082 … plan-084, dl-051)

The first run started under `pack-ingest` v1: capture 09:40 → 10:10 (plan-082, `f6d44f3b` …
`878cbbf8`), rule 10:10 → 10:11 (plan-083), hand-off 10:10 → 10:20 (plan-084, `0df54778`, its final
submit), all on 2026-11-24: 40 minutes.

- `+` Capture to hand-off in 40 minutes, with dl-051's review (`5c92afc0`, 09:46), re-review
  (`ae80bc73`, 09:49) and approval (`bf29bbf2`, 10:09) inside it (plan-082 › Execution Notes).
- `+` Capture ran as `pack-ingest` v1 and dl-050 D1 describe it: `memory add` and `submit`, the
  body committed before `submit` (W-04; plan-082 step 2), the review amended while dl-051 was
  `pending`; dl-051 D1 records "No pack of this request is refused or deferred", as dl-048 P1 asks.
- `+` The rest as designed: `vision` skipped and the skip said in the plan, as v1's description
  asks (plan-083 step 2); `hand-off` named plan-085 before plan-085 was opened (`0d24de03` 10:11,
  `49dc34ea` 10:20), as dl-051 D4 says; the run recorded by hand in its plans, with no
  `check:runs` scenario, as dl-050 D3 says (plan-082 › Context).
- `+` plan-084 added a review that `hand-off` does not require (plan-084 step 2): 2 should-fix.
- `−` **dl-050 D3 and D4 do not read true after the run.** D3 names "its first run (dl-049, D4)" and
  D4 "dl-049 is its first request"; the first run to reach a charter was dl-051's. dl-049 is still
  `pending` and plan-079 `active`: dl-049's `rule`, `vision` and `hand-off` moved into the
  adoption with the sequencer 1.8 (`07_sequencer.md` › "W10's order"; dl-051 › Context), as
  dl-050's note of plan-081 records ("D4: W10's order in the sequencer 1.8", `620e3ed0`); D3's
  wording, naming dl-049's run as the first, is not corrected (GOV-5).
- `−` **The `rule` ruling came before its plan.** The approver approved dl-051 at 10:09
  (`bf29bbf2`) while plan-082 was open; plan-083, the plan of `rule`, was written afterwards and
  records the ruling (five commits, 10:10–10:11). plan-082 step 5 had placed the command "in the
  plan of `rule`".
- `−` plan-083's Context cited `80d42ae1` as `main`'s last CI, not the last push `ae80bc73`;
  plan-084's review caught it and plan-084 corrected it by a note (rule 6; plan-084 › Execution
  Notes 2026-11-24, second note). plan-083's close left its `check:texts` and privacy checks
  unsaid (plan-084's review, a nit).
- `−` **`vision` is optional in prose only.** dl-050 D1 rules "Q4 optional"; `pack-ingest` v1's
  `vision` has no `optional` key, its description saying it is skipped "(the pinned WingFoil has
  no skip)", while `pack-cycle` v8's `design` carries `optional: true` on the same pin. No source
  records whether the 0.2.2 engine honours the key (GOV-5).
- Observed: one run took three plans for four phases, plan-083 one minute long.

## 2. `charter` (plan-085)

10:20 → 13:08 on 2026-11-24 (`49dc34ea` … `52cc6bea`): the charter added at 10:43 (`4eeab360`),
accepted at 11:05 (`7b68ddef`), the branch checks at 11:21 (`46b5920c`), merged at 12:46
(`93a74b6f`).

- `+` The outline's review found the cycle's only blocker before acceptance: `pack.yaml` format 1
  against spec-001 §5 (plan-085 › Execution Notes, first note). The same review raised the two
  departures from dl-051, which its two reviews had not: the CLI command can have no default
  (spec-002 §2.3), and the source key's default (plan-085 point 4).
- `+` The re-review added and set aside option (c), the bare default `wingfoil`, which the lint
  lets pass (plan-085 › Execution Notes, `5c51323f` review).
- `+` The names check found no clash across 0.2.2 … 0.3.2, the catalog and the fixtures (plan-085
  › step 1; the charter › Names).
- `+` `pack-cycle` v8's `charter` started "from the request `pack-ingest` ruled and handed off" for
  the first time, as written (plan-085 › Context).
- `−` The charter was amended while `draft`, then submitted (`60320b13`, `17ae4415`, both 10:50);
  `pack-cycle` v8's `charter` says "amended while proposed".
- `−` A ruling was given a reading by note: plan-085 point 8 "rule 8 kept in `custom/`", read at
  step 3 as "under another id (one id per composition)" (plan-085 › Execution Notes, step 3; the
  charter › Adoption).
- `−` The charter's four proposed tasks could not work under the layout and README rules (a pack
  directory without its README fails the lint, `src/layout-rules.ts`): found at `author`'s Reads;
  plan-086 point 1 made them two (the charter's note of plan-086).

## 3. `author` (plan-086, task-104, task-105)

13:16 → 21:29 on 2026-11-24 (`987bd6f7` … `5ca10d55`): task-104 13:33 → 17:25, task-105 17:26 →
21:29.

- `+` plan-086's Reads, verified by its review, found no change under `src/` needed; none followed
  (task-104 criterion 9; task-105's build note).
- `+` Red first in both tasks: task-104 8 tests, 8 failing (`2bae0a88`); task-105 7 tests, 6
  failing (`23bfc97c`).
- `+` The counts measured, not assumed: lint 93 → 101, `validate` 14 → 16 compositions (task-104);
  `check:runs` 84 → 92 (task-105). `main`'s CI on task-105's merge, longest job 17 min 6 s (run
  45477886787), under dl-039 R3's 25 minutes.
- `+` The build reviews caught text errors in fixtures: the `with-software` example taught the
  wrong kind (task-104, `409d3828`); the note's `## Observed` pointed falsely at the item's context
  (task-105, `d8c3a4cc`).
- `+` WD-6 read by the review against custom 1.6: thirteen differences, each allowed (task-104 ›
  build review).
- `−` **task-104's Acceptance 6 unmet:** the CHANGELOG's first line ended mid-sentence ("… into
  a"), and that line alone becomes the tag's annotation (`src/publish.ts` › `changelogEntry`). Of
  task-104's three reviews (body `f8964e69`, re-review `996dcb42`, build `a8785db6`), only the
  build review came after the CHANGELOG was written, and it did not check it; plan-087's outline
  found it after the close (task-104 › Execution Notes 2026-11-25). The
  third occurrence: the inventory of 2026-10-28 §1 records it at prel-002 and prel-003, where
  review caught it (GOV-2, §8).
- `−` **The source key ruled twice.** plan-085 ruled Open point 2 as option (a), a parameter with
  the default `""`; plan-086 point 2 reversed it to option (b), no parameter, on reasons the
  charter's Open point 2 already listed (the empty substitution, the generator's bare backticks).
  The departure from dl-051 Q3 (a) and from the accepted charter is recorded by notes only (dl-051's
  note of plan-086, the charter's note of plan-086); the charter's body, now `active`, still lists
  `wingfoil_source_key` in Parameters and says "Rule 7 applies when a source key is set" (the
  charter › Ships, Parameters) (`DEBT`, §8).
- `−` task-104 criterion 8's "WD-3 green when written" did not hold literally: WD-3's two tests
  were red on the missing files, and the note records a reading (task-104 › red note).
- *(unrecorded)* A machine restart lost task-105's temporary worktree; it was recreated from the
  pushed branch, nothing lost.

## 4. `first-release` and `activate` (plan-087, prel-008)

plan-087: 2026-11-24 21:47 (`8bfa1a05`) → 2026-11-25 20:40 (`e08a53ab`), 22 h 53 min, as
plan-077's 22 h 37 min. prel-008: added 10:24 (`5b17c724`), `released` 12:13 (`687f6899`),
published 14:05 (`f32aa8c2`).

- `+` **The CHANGELOG's truncation found at the outline,** by reading `changelogEntry`, before any
  element moved; the fix (`5e0408e6`, 94 characters) came before the rehearsal, so the rehearsal,
  the dry run and the report share one digest (plan-087 point 2, Step 2).
- `+` **The rehearsal** (plan-087 Step 3): a real `publish:pack --report` in a clone, nothing
  pushed: 32 runs, `git tag -n99` reading the whole first line, the first index entry with
  `workflows: []` and `requires_capabilities: []`; every check green on the result (1504 tests,
  `check:runs` 92). It repeats plan-077's step 3.
- `+` **dl-044 P1 worked at its first use:** the report read into prel-008 › Publication (32 runs,
  16 compositions, the tag, the catalog commit, the digest `sha256:7c4b949f…`, the range) and
  checked against the dry run, no difference (dl-044's note of 2026-11-25). It answers the
  inventory of 2026-11-21's GOV-1, "what claude could not see": the main gain on prel-007.
- `+` The first pack with no workflow and an empty capability list published with no tooling task
  and no change under `src/` (the last `src/publish.ts` change is task-103's, `4325a9fb`).
- `+` CB-6's live check and the CI on the tag (45620253148, publication mode), on `main`
  (45620253208) and Pages (45620253490) `success` (prel-008 › Publication).
- `+` The clean-clone evidence recorded with its first pass's errors, not only the final exit 0;
  the `validate` review checked every count (16, 32, 92 as 84 + 8, the overlays 40/40/40/48)
  (prel-008 › Execution Notes). The inventory of 2026-11-21 §4 had left a like error
  *(unrecorded)*.
- `−` **dl-044 P2 not applied.** Ruling 6 had the agent push the approval's commit `687f6899`; its
  push of `main` was not permitted in its environment, and the approver pushed it about 1 h 33 min
  after the commit (plan-087 › step 6 and the close; prel-008 › `approve-publication`; dl-044's
  note). On 2026-11-19 the agent had pushed prel-007's approval `84cb0858`. In plan-087 every other
  push of `main` was already the approver's; P2's was the only one ruled for the agent. The
  departure's owed row came only from the close's review (should-fix 1, `bec125db`) (GOV-1).
- `−` **The approver's first `push --atomic` did not reach the remote,** found by reading the remote
  after it; the second did (prel-008 › `publish`). Its output and exit code are not recorded; both
  attempts fall within 53 s (the catalog commit at 13:05:45 UTC, the three runs created at
  13:06:38 UTC). Observed: one case, the check after the push worked.
- `−` **The clean-clone evidence's first pass** ran `validate:publication -- --evidence` before the
  build (exit 1, no `dist/`) and audited the local matrix cache (`.cache/wingfoil-matrix/0.3.1`,
  hono 4.13.14, two moderate advisories) instead of `src/matrix/wingfoil-*/`; both reran to exit 0
  in the same clones (prel-008 › Execution Notes, `validate`). The same kind as plan-077's local
  list run first in self-test mode (inventory of 2026-11-21 §4): the script is written per release
  and has no committed form (GOV-3).
- `−` **Commits waiting for the approver's push:** `bae27c7a` and `f98a5cc1`, the agent's two
  commits before `activate`, waited about 5 h 29 min (`f98a5cc1` 14:29 → `561befd6` 19:58); for
  prel-007 the same wait was 40 minutes. With P2's 1 h 33 min (§5.2).
- *(unrecorded)* The machine restart also lost the first rehearsal's clone; it was rerun from
  `main`, with the same result.

## 5. Cross-cutting themes

### 5.1 Reviews (dl-017)

Seventeen reviews: thirteen first reviews and four re-reviews; every verdict "approve after
amendments"; one blocker (plan-085's outline, the format), 47 should-fix, 75 nits.

| Element | Review (blocker / should-fix / nit; the fixing commit) | Re-review |
|---|---|---|
| dl-051 | 0 / 5 / 7 (`5c92afc0`) | 0 / 1 / 2 (`ae80bc73`) |
| plan-084 (with plan-082's close and plan-083) | 0 / 2 / 4, one should-fix kept (`e33daaa2`) | none |
| plan-085's outline | 1 / 6 / 7 (`5c51323f`) | 0 / 3 / 3 (`d9a2b40e`) |
| the charter | 0 / 3 / 6 (`60320b13`) | none |
| plan-086's outline | 0 / 7 / 7 (`f34ba616`) | 0 / 2 / 2 (`6fcf299c`) |
| task-104's body | 0 / 4 / 8 (`996dcb42`) | 0 / 1 / 4 (`b5af396c`) |
| task-104's build | 0 / 2 / 7, one nit kept (`409d3828`) | none |
| task-105's body | 0 / 1 / 3 (`8c633fbd`) | none |
| task-105's build | 0 / 1 / 2 (`d8c3a4cc`) | none |
| plan-087's outline | 0 / 4 / 5 (`563f7b5c`) | none |
| prel-008 at `prepare` | 0 / 1 / 4 (`d8391b38`) | none |
| prel-008 at `validate` | 0 / 1 / 2, one nit kept (`fd934d77`) | none |
| plan-087's close | 0 / 3 / 2 (`bec125db`) | none |

plan-082 and plan-083 had no review of their own (plan-084's covers them). Two gaps: three reviews
of task-104 missed Acceptance 6 (§3); the departure from P2 got its owed row only at the close's
review (§4). Compared with prel-007: 1 / 3 at `prepare` and 1 / 3 at `validate`; here 1 / 4 and
1 / 2.

### 5.2 The approver's waits

The outline's ruling waited overnight (plan-087: `6a2fed81` 21:57 → `1ec2cd88` 09:23); the task
gates up to about two hours (task-104's acceptance 2 h 18 min; task-105's approval 2 h 05 min);
the activation 5 h 29 min, with two of the agent's commits waiting for the push; the approval's
push 1 h 33 min. The approval itself came 7 minutes after `main`'s CI ended (prel-008), the
publication 5 minutes after the approval's CI. Since plan-087 every push of `main` is the
approver's (plan-088 point 8), so each commit on `main` waits for one.

### 5.3 Scripts written per run

The clean-clone evidence was written for this release, as plan-077's local list was; its first
pass erred (§4). Nothing in the repository holds it; `pack-release-cycle` › `validate` and the
records (prel-008 › Validation) name the release's checks, not a command that runs them (dl-039
R1, R2 is the task side's counterpart). *(unrecorded)* The CI
watch, too, is written per run.

### 5.4 Departures recorded by notes

Three in the cycle: the source key (dl-051 Q3 (a), the accepted charter; §3), P2 (dl-044; §4),
and dl-050 D3's wording after the run (§1). The first two are recorded by Execution Notes only,
the third not at all; the bodies stay as they were, so the charter now `active` describes a
parameter its pack does not ship. Rule 6 corrects a false claim of a note; no rule says how a
body that a later ruling departs from is kept true.

## 6. WingFoil-side candidates (feedback notes)

None in the period. Seen again, already noted: fields filled by editing the draft (W-02, F-011:
prel-008 › `prepare`, plan-085 step 2); the body committed before `submit` (W-04); the transition
commits' subjects (W-05, F-023). The skipped `[+software]` leg in the matrix is the format's rule
(`src/resolve.ts` › `forbiddenBy`), not WingFoil's (prel-008 › Validation). Whether the 0.2.2
engine honours a phase's `optional: true` is not recorded (§1); it is a question for GOV-5, not a
note. **Proposed: no note, no task-106** (plan-088 point 6). WingFoil's v0.4 release planning
(started 2026-11-03, dl-040): no source of the period records it closed; with no note proposed,
its state decides nothing here.

## 7. Candidate changes of governance

Each is a point, ruled by a decision-log under `decision-log-ingest` if kept (dl-006 R2 as amended
by dl-022). The column W10 applies plan-088 point 5's test (the inventory of 2026-10-28, P1): does
this repository's adoption of the packs fix it?

| Id | Candidate | W10 fixes it? | Proposed |
|---|---|---|---|
| GOV-1 | Who pushes a pack-release's approval commit (dl-044 P2): the agent's push of `main` is not permitted in its environment; the approver pushes every `main` since plan-087 | no: the adoption does not change who may push `main`, and the row "The engine way of working" quotes P2 | a decision-log changing P2 (the approver pushes the approval's commit, the agent reads its CI); the P2 row (§8), which falls due here (plan-088 ruling 4), moves to it |
| GOV-2 | A check of the CHANGELOG's first line: a whole sentence within 100 characters, in `check:packs` where `author` meets it, not only in `publish:pack` | no, but the pack release round before it already lists "the CHANGELOG's first line checked" (the sequencer › "W10's order") | none, the approver's choice at `additional-points`: the row "A check of the CHANGELOG's first line" given the round as its trigger, the round's plan ruling where the check goes (this inventory recommends `check:packs`, where `author` meets it) (three occurrences; the row's trigger missed by task-083 and task-103) |
| GOV-3 | The clean-clone evidence as a committed script: the `validate` step's local list (Node.js 22.21.0 then 22.12.0, `npm ci`, the checks, the audits of `src/matrix/wingfoil-*/`) run by one command | no: the adoption ships no such command, and `pack-release-cycle` › `validate` names the checks, not how they run | a decision-log, its script a tooling task; or a row, owner approver, trigger the next pack release |
| GOV-4 | A departure from an approved decision-log or an accepted charter: the body amended, or only a note (today, a note) | yes: G7 (in-place amendment), owner and trigger W10 | none: the charter's drift as a row (§8), trigger G7 |
| GOV-5 | `pack-ingest` v1 read against its run: the `vision` phase carrying the `optional` key, as dl-050 D1 rules the step optional; dl-050 D3's wording, which names dl-049's run as the first | no: `pack-ingest` is this repository's own (no pack ships one) | none now, the approver's choice at `additional-points`: a row, owner approver, trigger the next change of `pack-ingest` or dl-049's `rule` at the adoption, whichever first; a change of D3 then by its decision-log |

Observed, not proposed: the `rule` approval before its plan (§1, one case); the charter amended
while `draft` (§2); the atomic push not landing at first (§4, one case, the check after it worked).

## 8. The register

`docs/owed-items.md` at `920a8091`, 58 open rows. Following plan-088 ruling 4 and dl-036 R1: one
line for each row this cycle touched, with its proposal; every other row "not touched", kept.

| Item (short) | Proposal | Reason |
|---|---|---|
| `governance/wingfoil-dogfood`'s own retrospective | closed at plan-088's close | this retrospective (dl-052) |
| dl-044 P2 not applied at prel-008 | ruled by dl-052: its trigger moved to GOV-1's decision-log, the row closed when that decision-log is approved | it falls due here (plan-088 ruling 4); GOV-1 changes P2 |
| A check of the CHANGELOG's first line | its trigger "the pack release round (the sequencer › W10's order)", the check placed in `check:packs` by the round's plan (GOV-2) | met at task-104 (§3); trigger missed twice |
| The private projects' check scripted | keep | plan-087 ruling 5; no release needed it |
| The sequencer's W10 state | keep | extended by plan-087's close, the duplicate merged; the next sequencer update, at the latest W10's close |
| The engine way of working | keep | it follows GOV-1's ruling on P2 |
| W10: presets, `governance/wingfoil-dogfood`, the adoption, its pin, the first inbox sync | keep | its `governance/wingfoil-dogfood` part settled by plan-087, its presets by plan-070; the adoption, the pin and the sync remain |
| `pack-delivery`'s selection over `accepted` packs | keep | cited by dl-051 D4, plan-084 and plan-085 as the hosting deviation; W10 |
| Recheck W-01 … W-14 | keep, its Source extended with this inventory | the row cites `wingfoil-cli` rule 5; custom 1.6's rule 5 bumps this directive's version and *Checked against*, the pack's bumps the entries file's *Checked against*; after the adoption the row reads the pack's rule |
| *(new)* Charter text drift of `governance/wingfoil-dogfood`: Ships and Parameters still list `wingfoil_source_key` and "Rule 7 applies when a source key is set" | add: owner W10, trigger G7 (in-place amendment) | §3, GOV-4; as `governance/feedback`'s, `kanban`'s and `software`'s drift rows |
| *(new)* `pack-ingest` v1 read against its run: `vision`'s `optional` key; dl-050 D3's wording | add: owner approver, trigger the next change of `pack-ingest` or dl-049's `rule` at the adoption | §1, GOV-5 |
| *(new)* GOV-3, if kept as a row | add: owner approver, trigger the next pack release | §5.3, GOV-3 |

Closed in the period, for the record: none.

The other 49 open rows, not touched, kept: `check:pins` covering `overrides`; the `minimatch`
override removed; bug-011's … bug-015's fixes (five rows); the `mcp` kind's tooling; the
`Precedence:` lines of `base`, `software`, `methodology/scrum` and `methodology/kanban` (four rows);
dl-025 D4's two halves; G7; G8; G9; G11; this repository's custom `sw-life-cycle`; `software`'s
`tech-lead` holder; `pack-cycle` v6 or v7 on the engine; the built-in directive ids compared by the
matrix; F-019's facts from bug-010; dl-041 G1's later part; dl-041 G3 in `pack-semver`; the charter
drift of `governance/feedback`; the placement scanner's known limit; the charter drift of
`software`; `kanban`'s open points 2 and 3 (two rows); the charter drift of `kanban`; `scrum`'s open
point 2; dl-007's ruling; the `pack-semver` rule for fixes and changed defaults; `plan-{n}-{slug}`
or `{workflow}-{phase}-plan`; the `check:runs` scenarios of the full scrum and kanban runs; Check
0.3.1's `COLLABORATION.md`; README step 3 "own entries"; the per-pack WIP rule; how tasks carry a
`release`; the custom workflows sharing `base`'s and `software`'s names; `pack-author`'s phases
under `work-item`; the packs' Memory templates; the notice to WingFoil UI; the weekly reading of
`intake.yml`'s runs; the reply's later part; the two rows of the first `stage/*` charter; `base`
composed without `software`; `src/markdown-lines.ts` reading a nested fence.

## 9. What went well, in short

- Charter to published and active in about 33 hours (`4eeab360` → `561befd6`), from the first run
  started under `pack-ingest`, through every gate of `pack-cycle` and `pack-release-cycle`.
- `pack-ingest` v1 ran as designed, capture to hand-off in 40 minutes.
- The cycle's one blocker found on text before acceptance; the CHANGELOG's truncation found at
  plan-087's outline, before any element moved.
- dl-044 P1 at its first use: the report in the record, its digest and range as the dry run's.
- Red first in both tasks; dl-039's order in both; `main` green after every push; no CI job over
  25 minutes (the longest 17 min 6 s, `main`'s CI on task-105's merge, run 45477886787; plan-087's
  16 min 36 s, run 45620253208, up from prel-007's 11 min 33 s).

## Points for the approver (additional-points)

- **The *(unrecorded)* candidates** (§3, §4, §5.3): the machine restart, the long lines after
  scripted edits, and the CI watch written per run: confirmed or dropped.
- **GOV-1 … GOV-5** (§7): which are kept; GOV-2 and GOV-5 proposed as rows, not decision-logs, and
  GOV-3 as a decision-log or a row.
- **The dl-044 P2 row** (§8, plan-088 ruling 4): GOV-1's decision-log, captured and ruled in this
  plan; or, if GOV-1 is declined, P2 kept with dl-052's reason, which must answer the
  environment's refusal of the agent's push.
- **No note, no task-106** (§6).

Given by the approver on 2026-11-25, at the checkpoint, in chat: "tutti come raccomandato":

- **P1 — The *(unrecorded)* candidates confirmed**: the machine restart that lost task-105's
  temporary worktree and the first rehearsal's clone, both redone from what was pushed or
  committed (§3, §4); the lines over 100 characters after scripted edits, each stopped by
  `check:texts` before its commit; the CI watch written per run (§5.3). This plan is their source.
- **P2 — GOV-1 kept,** a decision-log changing dl-044 P2, captured and ruled in plan-088; it takes
  the P2 row (§8, ruling 4). **GOV-3 kept,** a decision-log, its script a tooling task.
- **P3 — GOV-2, GOV-4 and GOV-5 as rows**, not decision-logs, as §7 proposes: the CHANGELOG row's
  trigger the pack release round; the charter's text drift under G7; `pack-ingest` v1's two
  points.
- **P4 — No note, no task-106** (§6). No point added.
