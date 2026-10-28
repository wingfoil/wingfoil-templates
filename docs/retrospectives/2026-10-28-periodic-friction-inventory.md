# Friction inventory — periodic retrospective, 2026-10-28

Phase `explore` of `pack-cycle` › `retrospective` (dl-006 R1, R2), under plan-054. It covers the
three pack cycles that reached a first release (`base`, `software`, `methodology/scrum`) and counts
as the periodic retrospective of dl-006 R3 for the period.

- **Period:** 2026-10-12 (plan-025 closed) → 2026-10-28 (plan-053 closed).
- **Sources read:** plan-026 … plan-053; task-027 … task-063; dl-017 … dl-027 (dl-024 and dl-025
  `pending`, read only as sources); bug-002 … bug-008 (bug-002 already in plan-025's close);
  prel-001 … prel-005; the charters pack-foundation-base, pack-foundation-software and
  pack-methodology-scrum with their Execution Notes; the feedback inbox (F-027 … F-037, README and
  ledger); the `wingfoil-cli` directive (1.3 → 1.5, W-14); the Execution Notes added in the period
  to dl-003, dl-006, spec-001, spec-002 and the sequencer; dl-016 … dl-020 for §5; the git log and
  the public CI runs.
- **Not sources:** dl-007, dl-011 … dl-013, plan-010, plan-020, plan-022, read only where a source
  cites them.
- **Method:** five read-only strands (governance and dl actions; the `base` cycle; the `software`
  cycle; `methodology/scrum` and W9; intake and inbox), merged here; plus one check run for this
  inventory: `memory add`'s numbering (W-14) on WingFoil 0.3.0 and 0.3.1 in a scratch project.
- **Legend:** `+` went well · `−` friction · `?` not confirmed in the sources · `WF` WingFoil-side
  (candidate feedback note, §6) · `GOV` candidate change of this repository's governance (§7) ·
  `DEBT` an owed item (§8).

Each point cites its source as element id and section, a commit, or a note id.

## 1. The `base` cycle

Charter (plan-041, closed 2026-10-20, shared with `software`) → author (plan-043, 2026-10-21) →
1.0.0 (plan-044, prel-001, 2026-10-22) → follow-ups (plan-045, 2026-10-22 … 24) → 2.0.0 (plan-049,
prel-002, 2026-10-27) → 2.0.1 (plan-052, prel-003, 2026-10-28). Three releases in seven days, two of
them `major`.

- `−` **1.0.0 shipped two defects no check could see: no check ran the engine.** prel-001's matrix
  ran only `workflow list`, `dna show` and `directives list` ("3 runs, 0 failed", prel-001 ›
  Validation); plan-043 › Steps 2.3 checks pack content "by the lint, the composition and the
  matrix, not by red-first tests". bug-005 (`workflow start` leaves a plan's `workflow`/`phase`
  empty) and bug-006 (a directory in `produces` without a trailing slash is never satisfied) were
  found by the scrum charter's run on 0.3.0 (plan-047), four days after the tag.
- `−` **The risk was visible at the charter.** plan-041 › Execution Notes (step 2): the packs "would
  be the first configuration the engine can drive"; the charter's `plan_id` row already lists
  `{workflow}-{phase}-plan` for two adopters next to the default `plan-{n}-{slug}`
  (pack-foundation-base › Parameters). Reviews read WingFoil's source; none ran it.
- `+` **The fix came with a guard.** task-053 added `npm run check:runs` (red by design: 7 of 9 runs
  failed on 1.0.0, 0 of 9 after task-054); task-058 extended it to every release and to `software`'s
  and `methodology/scrum`'s starts (plan-051).
- `−` `GOV` **`check:runs` is not in the publication rule.** It runs in CI and in each release's
  evidence, but the `pack-compatibility` directive still requires only the three load commands.
- `−` `?` **A version listed as compatible while known to fail.** After the 0.3.1 intake,
  `base@1.0.0` carries the range `>=0.3.0 <=0.3.1` (catalog.yaml) while `check:runs` fails 14 of 18
  on it (plan-051 › recheck): ranges are computed from formats and capabilities only. Whether a
  "known defects" marker is wanted is open.
- `+` **Publication mechanics held every time:** dry run in a temporary clone, atomic push of tag
  and `main`, CI on both, Pages, the live CB-6 check (prel-001 … prel-003 › Publication); for 2.0.1,
  tag and published content shown byte-identical (prel-003 › Validation). The cascade of the major
  held: every `base@^1` moved to `base@^2` in the `prepare` commit (plan-049 ruling 3, `975399e`).
- `−` **`pack-semver` has gaps.** No rule for a first version until plan-044 ruling F (`86c01cc`);
  still none for a fix that changes a default, so the defaults fix became `major` by "take the
  higher class" (plan-049 ruling 2: "a `minor` could be argued"). `DEBT`.
- `−` `GOV` **The tag annotation was caught by review twice.** The CHANGELOG's first line becomes
  the annotation; it was fixed after review in prel-002 and, blocking, in prel-003. A lint or
  `publish:pack` check would catch it.
- `−` **The private projects' check is ad hoc**, and failed at its first run each time, never
  because of the projects: task-039 (index outputs missing), prel-002 (scratch tree not a git
  repository), prel-003 (`--param` overrode the examples). Candidate tooling task.
- `−` **Hosting deviations.** One plan hosted two charters, and `pack-delivery` iterates only over
  `accepted` packs while `charter` creates them (plan-041 › Context); the selection is still
  `where: { status: [accepted] }`. Not in any later closing list (§8).

## 2. The `software` cycle

Charter accepted 2026-10-20 (plan-041 step 10, `386e3c5`) → author (plan-046, task-046 … task-050,
2026-10-24 … 26) → lint follow-up (plan-048, task-051) → 1.0.0 with `methodology/scrum`
(plan-052, prel-004, tag at `8d4adb3`, 2026-10-28).

- `+` **Fast and in order:** one task at a time, every close with "Done when" met and `main`'s CI
  `success` (40216101348, 40288258413, 40300623927, 40323263272, 40352496784). plan-046 ruling 6
  (publish with a methodology) was followed by plan-052, and a publication rehearsal of the three
  packs in a scratch clone made the reserved tooling task unnecessary (plan-052 step 3).
- `−` **"Cannot be composed without a methodology" (plan-041 rulings 11–12) drove the cost:** the
  overlay, a fixture methodology, README examples deferred under CB-2, publication held for W9.
- `+`/`−` **The overlay** (task-046, `2edc17d`) gave a local and CI check of a pack that cannot
  compose alone, reused for `scrum`'s exit (two CI overlay steps, 22 runs each by plan-052). It was
  also the cycle's most reviewed task: four blocking findings in the body review, tests added after
  the code at the review's request (dl-018 R2), 19 commits.
- `−` `GOV` **The exit criterion was static and was met against a broken contract.** task-049
  (`babf1e9`) validated four compositions (7 runs, 0 failed), but with `where: [in-development]` a
  release stops after `enter-releasing` at run time (dl-027 › Context), found by the parallel scrum
  work, not by the exit criterion; the charter says it was "met … against the `delivery` contract
  before dl-027". Fixed by task-051 (`ac12de6`).
- `−` **The README's adoption steps were never run on a project made by `wingfoil init`.** bug-007
  (major, `E_WORKFLOW_DUPLICATE_NAME`) was found by plan-051's `recheck` on 2026-10-27; it was in
  `base@1.0.0`'s README already and was published again in 2.0.0 (tagged at `6d04472` the same
  afternoon). `+` Fixed by task-061/task-062 with hand reproductions on both releases and both
  templates; guarded since by task-060's adoption run (`d542f30`, red 8 of 8 first).
- `−` `WF` **A phase role nobody holds is accepted.** The composed DNA gives `tech-lead` to no one
  while nine phases need it; WingFoil does not refuse it (plan-051 › recheck); settled by README
  text only (plan-052 ruling 5, a blocking finding of plan-052's review).
- `−` `GOV` **The accepted charter differs from the pack and is reconciled only by notes:**
  `requires: [base@^1]` read as `^2` (plan-049's note), the `end-of-life` row and step-key table
  without `approve` ("not amended mid-task", task-047), Adoption "W9" read as W10 (plan-052's
  note). Two rulings given in chat during task-047's build reviews (2026-10-25) were applied as
  "read with" corrections; the same pattern appears in task-048 and task-050.
- `+` **Parallel work in a second worktree was clean in scope:** `scrum`'s charter depended only on
  `software`'s accepted `delivery` contract (plan-046 ruling 5); edits to the shared charter were
  sequenced (plan-046 › step 4 waited for `49b1755`); and that work found dl-027's stall and
  bug-005/006.
- `−` **Citation slip:** plan-051 (recheck) and plan-052 ruling 2 attribute the dropped `--tags` to
  F-032; it is F-034. Reviews missed both.

## 3. The `methodology/scrum` cycle and W9

Charter (plan-047, 2026-10-26, rulings 1–16, dl-026, dl-027) → author (plan-050, task-055 …
task-057, 2026-10-27) → 1.0.0 (plan-052, prel-005, 2026-10-28; first tag with a slash).

- `+` **One day per phase**, each plan reviewed, re-reviewed and closed with "Done when" met;
  rulings given up front as outlines and none rejected (plan-047 1–16, plan-050 1–4, plan-052 1–8).
  plan-050 ruling 1 ("`base@^1` now, `^2` by whoever comes second") absorbed the parallel major
  (`2d13c49`).
- `+` **Running the method by hand on the real engine before authoring paid off.** Three scripted
  runs on 0.3.0 (plan-047 › steps 2–3) broke ruling 2's shape, found the nested Sprint shape (ruling
  13, dl-026), the release filter defect that held for any methodology (ruling 14, dl-027), the
  scope key (15) and the release order (16), and bug-005/006 as a by-product. task-057's full run
  (two Sprints, two releases, one spanning) still found two charter-text errors after its reviews,
  fixed in-task under dl-019 (`b6dc551`).
- `−` **Its cost:** a ruling superseded inside an active plan; plan-047 runs to about 3,950 words;
  `--overlay` accepts only a directory under `tests/fixtures/`, so the draft sat untracked inside
  the repository; a session restart wiped the scratch draft (plan-047 › charter review); the run is
  recorded in prose only, not scripted (plan-050 ruling 3, `DEBT`).
- `GOV` **A scripted run on the real engine before a charter is accepted**, for packs that carry
  workflows: today it is plan-047's own choice, not a `pack-cycle` step.
- `+` **The publication rehearsal** (plan-052 step 3): three `publish:pack` runs in order, 1010 of
  1010 tests, every check exit 0; contrast plan-044's 91 failing tests on a simulated catalog
  commit.
- `−` **bug-008** (minor): `base`'s `retrospective` `approve` re-lists a closed Sprint's step once
  the next Sprint's decision-log is `in-discussion` (bug-008 › Observed; identical on 0.3.0 and
  0.3.1). Fixed by texts, option (ii) (plan-052 ruling 2); option (iii), a feedback note, owed (§6).
- `−` **Stale approved text:** dl-026's Consequences ("reported `late` until it completes") no
  longer hold after ruling 15 and task-057, left as approved (task-057 › notes); the WingFoil side
  is F-036.
- `−` **The charter predicted a change that never came** ("`base`'s README then changes after
  1.0.0"), recorded as a departure in its note of 2026-10-27.

## 4. Cross-cutting themes

### 4.1 Reviews (dl-017)

- `+` Every element of the period was reviewed independently and amended while `pending`; no
  `memory reject`, no revert in the git log. Reviews caught design defects before code: 0.3.0
  breaks `parked` and `approver_email` was needed (plan-041); a simulated catalog commit fails 91
  tests (plan-044 → task-040); a run with nothing to run passed (task-053's build); the composer let
  a slot through without `software` (task-032's build, fixed red first in `3940021`/`00eafa5`); a
  reflow merged J2 of `05_journeys.md` into one paragraph (plan-038's branch re-review).
- `−` plan-031 and plan-034 went `active` without a plan-level review (add, body and submit within
  minutes: `de01551` → `b79d6d6`; `aa1bf89` → `dd8bc48`), and neither records the departure.
- `−` `GOV` dl-017 R2 ("behaviour, a test or an Acceptance command") gives no criterion for a fix to
  a document or configuration: plan-034 applied six should-fix changes to the vision unreviewed,
  "the fixes follow the review's own wording".
- `−` Line-wrap commits continue: 51 of the period's 1153 commits are wraps or rewraps, and one
  reflow damaged content (plan-038).

### 4.2 Red-first (dl-018)

- `+` Red runs on a commit with counts in task-029, task-031 … task-034 and in every task of the
  pack cycles (e.g. task-046 11 of 12, task-053 7 of 9); characterizations checked by mutation.
- `−` task-027, task-028 and task-030 record a red run with the test and the change in one commit
  (`00bb6f9`, `d0b873b`, `405c9af`), the "unverifiable" pattern of the previous inventory's §2.
- `−` task-041 (feedback-note tooling) lists no red step in its Design and records neither red run
  nor mutation; its review did not report it (dl-018 R2–R4).
- `−` task-051's first red count was wrong (one test red on `main` for another reason); targeted
  runs missed four count expectations that only the clean-clone suite found.

### 4.3 Approved texts changed by notes

- `−` `GOV` **Approved decision-logs are changed by approver rulings recorded as notes** ("The body
  stays as approved"): dl-006 R1's order twice (plan-044 ruling B, plan-052 ruling 6), dl-003 D10's
  order (plan-052 ruling 7). dl-003 now carries four dated notes, dl-006 four; neither reads
  correctly without them. dl-006 R2 and dl-020 make such a change a decision-log of its own.
- `−` `GOV` **Amending an approved specification in place became the rule without a decision-log.**
  plan-031 chose it "for this amendment" and said a general rule "would be a decision-log of its
  own"; since then spec-001 carries ten such notes and spec-002 three, each approved by a merge OK.
  WingFoil 0.3.x has `memory amend` (adoption item, W10).
- `−` The same for charters (§2) and for about 40 rulings taken in chat across the `base` plans and
  held only in plan texts (plan-041 1–17, plan-043 N–S, plan-044 A–F, plan-045 G–I, plan-049 1–6;
  plan-041: "no element holds them yet").
- `−` `GOV` **`pack-cycle`'s order was never followed:** activation at the first tag for all three
  packs (plan-044 ruling B, plan-052 ruling 6), the retrospective batched after; `pack-cycle` v5
  still places `retrospective` before `activate`.

### 4.4 Parallel work, numbers and the inbox's numbering

- `−` **Number reservations live only in plan prose:** dl-024/dl-025 held for a request written
  outside the repository (plan-047); plan-048 ruling 1 (plan-049, dl-028, bug-007, F-038);
  plan-049 › Handoff (plan-050, task-055 … task-059, dl-029); plan-050 (task-058, task-059, dl-029
  "for a split"); task-063 reserved by plan-052 step 3 and used by plan-053; dl-028 still reserved
  and unused; task-052 titled "(plan-048)" but built under plan-053.
- `−` **W-14** (`memory add` numbers by count, WingFoil 0.2.2) was hit on 2026-10-26 (plan-049: an
  untracked placeholder) and 2026-10-28 (plan-053: dl-026/dl-027 moved aside); its entry was written
  only on 2026-10-28 (task-063, `e9297c4`), two days after the first hit (rule 3).
- `+` **W-14 on 0.3.x, checked for this inventory** (scratch project, `init --template Kanban`,
  three decision-logs, the second removed and committed, then one more; then one on another branch
  and one back on the first): 0.3.0 and 0.3.1 both gave `dl-004` after the gap (the highest number +
  1, not the count) and `dl-006` after `dl-005` was taken only on the other branch. The defect is
  0.2.2's; it ends with the pin bump (W10). No feedback note is needed.
- `−` **The inbox test made reservations block work:** `assertNumbering` requires contiguous notes,
  so task-052 (F-037), accepted on 2026-10-26, waited for F-035/F-036 until 2026-10-28; F-038/F-039
  still wait (plan-049, plan-052 closes). plan-048 rejected renumbering and a test admitting
  reserved gaps. `assertOpenings` accepts only `New note (task-…)` or `(prel-…)`, so plan-053 and
  plan-054 each host a task just to write notes. `GOV`.
- `−` **Clashes between parallel lines:** a concurrent build rebuilt `dist/` in the same worktree
  (task-056's first run printed `compositions: 10`); CI runs on branches and on merge commits were
  cancelled by the other line's pushes (task-055, task-056; plan-048 steps 1–2; plan-052 steps 4–5);
  `main` was held on request while waiting for a tag.
- `+` Merge order agreed and kept (task-056/057 waited for `base@2.0.0`); fixture ownership
  respected (plan-048 › Context); plan-034's separate worktree had "no file in common" with
  plan-033.

### 4.5 CI and `main`

- `−` `GOV` **`main` went red unseen.** CI stayed red from `4d84334` (2026-10-22, bug-003) because
  "`main`'s runs … were not read at their push"; found through task-041's CI run. plan-045 then
  wrote "From now on `main`'s CI is read after every push", but no workflow or directive says it
  (dl-016 K4 covered branches only).
- `+` bug-003 and bug-004 (npm advisories in the pin's and the matrix's lockfiles) were fixed within
  a day each with lockfile-only changes (task-042 `c5fc052`, task-043 `f5f084b`); adr-003's licence
  record corrected (`bab09ff`). `−` A CI policy for transitive advisories "may come later" (bug-004
  › note 2026-10-24): `DEBT`.
- `−` `GOV` **The suite's duration is not tracked:** branch runs went from 8.6 min (plan-041) to
  13–16 (task-046 … task-050) to 17–20 (plan-052, e.g. 40671477070), against `timeout-minutes: 30`;
  no element records a duration.
- `−` `?` **K6 and work on `main`:** 438 non-merge first-parent commits landed on `main` in the
  period against 50 merges (Memory transitions, bodies, release steps); consistent with
  `tooling-delivery` v2 (a branch opens at `in-progress`) and plan-044's "on `main`", but no
  decision records it.

### 4.6 Intake and R3

- `+` **Both intakes were fast:** 0.3.0 released 2026-10-19, intake closed 2026-10-21 (task-035
  `26bc8c4`, task-036 `fc9e2dc`); 0.3.1 released and closed on 2026-10-27 (task-058 `00c0eaa`,
  task-059 `609127e`). Their plan reviews found the breakage before code (plan-042 rulings K–M;
  plan-051 moved the pin into task-058). plan-051's `recheck` replayed the whole scrum run
  byte-identically on both releases.
- `−` Both intake plans are filed under `record` and also carry `recheck` and `plan-migrations`
  (plan-042, plan-051 › Context); `recheck`'s text says a pack gains a release "at its next
  publication" while `record` recomputes ranges at intake (plan-051): `DEBT`.
- `−` `GOV` **R3 was missed twice.** No periodic retrospective followed plan-042 (closed 2026-10-21)
  or plan-051 (2026-10-27); neither close mentions it. `wingfoil-release-intake.yaml` v4 has no
  phase pointing to it, and `retrospective-periodic.yaml` v1 carries the cadence in a comment only.
  → dl-029 (plan-054 decision 5).
- `−` 0.3.1 refuses `init`'s software workflows with `base` alone (`E_PHASE_ROLE_UNKNOWN`) while
  0.3.0 accepts them; found by task-061's body review in plan-052, not by the intake's `recheck`.
  `?` whether 0.3.1's changelog states it.

### 4.7 The inbox and the feedback loop

- `+` The inbox rules held: every new note has the six dl-163 fields, a first line naming its task,
  one ledger row; the inbox tests caught mutations (task-052 13 of 13; task-063); the evidence of
  F-035 … F-037 re-ran identically on 0.3.0 and 0.3.1.
- `−` `GOV` **The inbox was never synced.** "Last sync: none" 23 days after it opened; all 37 notes
  `open`, `answered_by` empty. The first sync moved from "after W9" (plan-045, plan-046) to W10
  (plan-052 ruling 7, dl-003's note of 2026-10-28). Rule 7 fires at WingFoil's release planning or
  a pin bump; the pin stayed at 0.2.2 and this repository cannot see WingFoil's planning. plan-026
  chose option (a) and named its cost: "'Last sync' can stay stale". Option (b) was a `sync` step in
  the intake.
- `−` **The inbox lags reality:** 0.3.0 accepts the `format:` key (`compat.yaml`, `format_key:
  true`), what F-012 and F-017 asked for, yet both are `open` and W-01 is listed; dl-021's note of
  2026-10-13 records F-003 and F-005 superseded, yet both read `open`; the directive still says
  "Checked against: `wingfoil@0.2.2`". Rule 5 rechecks only at a pin bump.
- `−` 0.3.1 ships an inbox text in WingFoil's `COLLABORATION.md` (WingFoil bug-408); plan-051 ruling
  4 left it out of scope and no element owns the check (`DEBT`).

### 4.8 Process overhead

- `+` dl actions were quick: dl-021 captured to fully applied in two days through seven plans
  (plan-029 … plan-036), dl-022 in three days through four (plan-037 … plan-040).
- `−` 8 of the 15 governance plans are "dl actions" plans hosted on `decision-log-ingest` › `rule`
  with no phase of their own (plan-026 › Context); `base`'s `governance-evolution` covers this at
  W10.
- `−` dl-016 and dl-017 … dl-020 have empty Execution Notes: nothing records that plan-026/plan-027
  applied A1, A2 and C1–C4 (dl-021 and dl-022 do record theirs).
- `−` `workflow` and `phase` filled by hand (W-02) in 24 plans of the period; this repository still
  governs itself on WingFoil 0.2.2 while publishing packs for 0.3.x (dl-003 D10's "adopts first"
  moved to W10).
- `−` bug-003 … bug-008 stay `approved` after their fix: the `bug` type has no terminal state, so a
  fixed bug reads like an open one. `?` `GOV`.

## 5. dl-016 revisited

| Item | Verdict | Evidence |
|---|---|---|
| K1 reviews before every gate | partly | all elements reviewed, no rejection; plan-031 and plan-034 submitted without a plan review (§4.1) |
| K2 red counts, mutation | partly | held in most tasks; red not on a commit in task-027/028/030; task-041 has neither (§4.2) |
| K3 deviations written into the element | held | rulings, errata and dates recorded everywhere; but rulings now live in plan prose (§4.3) |
| K4 CI read before a gate | partly | held on branches; `main` red unread 2026-10-22 … 23 (§4.5) |
| K5 clean clones on both Node.js versions | held | every task; documentation plans rely on CI's two jobs |
| K6 merge discipline | held, `?` | `--no-ff`, OK, branch removed every time; much work directly on `main` (§4.5) |
| K7 feedback loop | partly | notes reproduced with WingFoil alone; the inbox never synced (§4.7) |
| C1 dl-017 | partly | 17 re-reviews in the governance strand alone; R2 unclear for documents (§4.1) |
| C2 dl-018 | partly | see K2; departures not reported by reviews |
| C3 dl-019 | held, mostly | task-029 raised when found; task-031 only at the gate; later Acceptances build it in |
| C4 dl-020 | held | plan-031, plan-039/040, plan-041, plan-046, plan-048, plan-052 account per tech-spec |
| A1 rule 7 renamed (`4d1819a`) | held in letter, broke in effect | "Last sync: none" (§4.7) |
| A2 configuration of dl-017 … dl-020 | held | plan-027: `tooling-delivery` v2, `kanban-delivery` v4, templates, `traceability` |
| W1 … W3 notes F-022 … F-026 before 2026-10-20 | held | task-026 merged `274dd76` on 2026-10-12 |
| W4 no new note for W-01, W-03, W-08 | held | none added |

## 6. WingFoil-side candidates (feedback notes, task-064)

| # | Point | Kind | Existing note | Source |
|---|---|---|---|---|
| F-038 | `workflow start` fills a plan's `workflow`/`phase` only from tokens the type's `id_pattern` or `path` declares; otherwise the plan is committed `draft` with both empty, a type requiring them fails the automatic submit, and `--set workflow=…` is refused at start (exit 2); `phase` gets the instance number `1` | request | none (same family as F-011, W-02, another verb) | plan-049; bug-005; plan-051 › recheck (unchanged on 0.3.1) |
| F-039 | under an iterated sub, a step selected by a `where` with no relation to the scope (`base`'s `retrospective` `approve`) is deduced again for a closed iteration; ask: a `where` key skipped when no element is in scope, or no re-deduction of a closed iteration's steps | request | none (distinct from F-037, F-018, F-034) | bug-008 option (iii); plan-052 ruling 2 |
| new | a directory in `produces` without a trailing `/` is read as a file and never satisfied, with no diagnostic at load; `finalize --step` and `workflow end` refuse | gap | none | bug-006 › Observed |
| new | a phase role that no member or agent holds is accepted at load and at run | gap | none | plan-051 › recheck; plan-052 ruling 5 |
| ? | a candidate that leaves the `where` before any of its phases completes is skipped | ? | none (maybe by design; evidence for F-037?) | dl-027 › Context |
| ? | a `{sprint.id}` token warns `W_PHASE_TOKEN_OUT_OF_SCOPE` unless the template declares `id` | ? | none | plan-047 › notes |
| — | `init` writes `custom/` workflows under the packs' names (`E_WORKFLOW_DUPLICATE_NAME`) | — | F-007 (precedence over workflows); bug-007 is new evidence | bug-007 |
| — | W-14 | — | none needed: fixed in 0.3.0 and 0.3.1 (§4.4) | this inventory's check |

## 7. Candidate changes of governance

Each is a point, ruled by a decision-log under `decision-log-ingest` (dl-006 R2 as amended by
dl-022) if kept.

| # | Candidate | Inventory |
|---|---|---|
| G1 | Tie R3 to the close of every `wingfoil-release-intake` (dl-029, plan-054 decision 5); consider the inbox sync at the same event (plan-026 option (b)) | §4.6, §4.7 |
| G2 | A register of debts and number reservations, one place with holder, owner and trigger (plan-054 decision 4) | §4.4, §8 |
| G3 | The origin of a request and the privacy check in a directive (dl-030, asked by the approver on 2026-10-28) | plan-054 |
| G4 | A behavioural run (`check:runs`, an `init`-based adoption, a run through `release`) required by `pack-compatibility`, `pack-release` › `validate` and a pack's exit criterion | §1, §2, §3 |
| G5 | `main`'s CI read after every push, written into the governance | §4.5 |
| G6 | `pack-cycle`'s order: activate at the tag, retrospective after (or batched explicitly) | §4.3 |
| G7 | Approved texts changed by notes: a rule for in-place amendment of specs, decision-logs and charters, or a "current reading" section | §2, §4.3 |
| G8 | dl-017 R2 for documents and configuration | §4.1 |
| G9 | The inbox's first line may name a plan or a decision-log; reserved gaps revisited | §4.4 |
| G10 | A scripted run on the real engine before a workflow-bearing charter is accepted | §3 |
| G11 | A terminal state for a fixed bug | §4.8 |
| G12 | The suite's duration tracked against the CI timeout | §4.5 |

## 8. Debts

Open owed items found in closing notes and Execution Notes, with their status at 2026-10-28. Owner
"none" means no element names one.

| Item | Source | Owner | Trigger |
|---|---|---|---|
| F-038 `workflow start` fills `workflow`/`phase` | plan-049 › close | plan-054 (task-064) | now |
| F-039 bug-008 option (iii) | plan-052 ruling 2, close | plan-054 (task-064) | now |
| `pack-semver` rule for fixes and changed defaults | plan-049, plan-052 › close | none | none |
| `check:runs` scenario of the full scrum run (`memory park`, a field rewritten, `set_state`) and the `include:` null branch test | plan-050 ruling 3; plan-052 › close | none | next tooling task on `runs.ts` |
| `recheck`'s wording in `wingfoil-release-intake` | plan-051, plan-052 › close | none | the workflow's next version (with dl-029) |
| README step 3 "own entries" for Memory types and roles `init` scaffolded | plan-052 › close (task-061's review) | none | next README pass |
| Sequencer: W8 has four features | plan-052 › step 2, close | none | the sequencer's next review |
| dl-012's F4.9 placement | plan-052 › step 2, close | approver | dl-012's ruling |
| W10: `methodology/kanban`, presets, `governance/wingfoil-dogfood`, this repository's adoption, its pin, the first inbox sync | plan-052 ruling 7 | W10 | W10 |
| dl-024 and dl-025 ruled; plan-022 closed | plan-052, plan-053 › close | approver | none |
| This repository keeps `plan-{n}-{slug}` or takes `{workflow}-{phase}-plan` | plan-049 › close; pack-foundation-base › Adoption | W10 | adoption |
| `pack-delivery`'s selection over `accepted` packs | plan-041 › Context | none | none (in no later closing list) |
| `--param` applies to an `entries` composition only | plan-043 › note (task-039's review) | none | none (hit again at prel-003) |
| Charter text drift of `software` (`base@^1`, `end-of-life` row, step-key table, W9) | pack-foundation-software › Execution Notes | none | none |
| dl-026's stale Consequences | task-057 › notes | none | none |
| CI policy for advisories in transitive dependencies | bug-004 › note 2026-10-24 | approver | none |
| Check 0.3.1's `COLLABORATION.md` inbox text | plan-051 ruling 4; inbox README › Rules | none | the first sync |
| Recheck W-01 … W-14 and the open notes against 0.3.x (F-003, F-005, F-012, F-017) | `wingfoil-cli` rule 5; dl-021's note | W10 | the pin bump |
| A decision-log making in-place amendment general | plan-031 › Context | none | none |
| `scrum` charter open points 1 (UI's test-first steps) and 2 (`explore`'s weak evidence) | pack-methodology-scrum › Open points, note 2026-10-28 | UI's adoption; none | UI's adoption; none |
| The private projects' check scripted | prel-001 … prel-003 | none | none |
| The note on 0.3.0's `finalize --dry-run` | plan-045, plan-046 › close | none | moot: fixed in 0.3.1 (plan-051 › Context); to close |

Two items (`pack-delivery`'s selection, `--param`) appear in no later closing list: they were lost.
That is the evidence for G2.

## 9. What went well, in short

- Reviews, re-reviews and amendment while `pending` everywhere; no rejection, no revert.
- Three pack cycles from charter to published 1.0.0 in nine days, every release gate passed,
  publication mechanics byte-exact.
- Running the method on the real engine before authoring (plan-047, task-057), and the guards that
  followed (`check:runs`, the adoption run).
- Rulings given up front with the outline; every deviation recorded in its plan.
- Intakes closed within two days of each WingFoil release; advisories fixed within a day.
- dl-020's fold-back ran as designed through five plans.

## Points to analyse (additional-points)

Filled at the approver's checkpoint.
