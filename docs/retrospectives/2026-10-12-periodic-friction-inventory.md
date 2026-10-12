# Friction inventory — periodic retrospective, 2026-10-12

Phase `explore` of `retrospective-periodic` › `retrospective` (dl-006 R2), under plan-025. The
first periodic retrospective of this repository; it closes milestone M1 "Tooling" (W5, W6, W7 and
W14).

- **Period:** 2026-10-06 (plan-015 opened) → 2026-10-12 (W14 closed, plan-024 `done`).
- **Sources read:** the Execution Notes (and, where they record deviations or reviews, the Design
  and Acceptance) of plan-015 … plan-024; task-001 … task-025; dl-009, dl-010, dl-014; adr-003,
  adr-004; bug-001; spec-002; the Execution Notes of spec-001, dl-003 and dl-005 added in the
  period; the feedback inbox (`docs/wingfoil-feedback/`, F-001 … F-021) and the `wingfoil-cli`
  directive (rules 1–8, W-01 … W-12); the git log of those files.
- **Not sources:** elements still `pending` or `active` and M0's elements, read only where a source
  above cites them (plan-025 › Context).
- **Legend:** `+` went well · `−` friction · `?` relayed by the approver, not found in the sources
  · `WF` a WingFoil-side point (candidate for a feedback note) · `OUT` a known open item outside
  this retrospective, cited for completeness, not analysed here.

Each point cites its source as element id and section, a commit, or a note id. Quotes are short
extracts of this repository's own texts.

## 1. Independent reviews

- `+` Every task, decision-log and ADR of the period was reviewed by an independent subagent while `pending`, and
  amended rather than rejected: no `memory reject` and no revert in the period (git log). Examples:
  task-001 … task-008 each have an "amend … while pending (independent review)" commit (`ac70259`,
  `6819e25`, …); dl-009/dl-010 `4a9390f`; task-011 … task-016 (`067f519` … `21aa93a`); dl-011 …
  dl-014 (plan-020 › Execution Notes).
- `+` Body reviews caught design defects before any code. task-012: the stricter "no empty phase"
  reading "failed 34 of the 51 phases of this repository's own workflows" (task-012 › Execution
  Notes). W14: every task body had at least one should-fix, and task-018 … task-024 had one or
  two blocking points each (task-018 … task-024 › Execution Notes).
- `+` Build reviews found real defects that the tests had missed. Blocking: task-002 (error
  position after leading comments), task-003 (a decoy `GIT_DIR` changed the digest), task-004 (the
  order test could not tell Kahn's algorithm from a byte sort), task-007 (the missing-fragment test
  never reached its check), task-019 (an unknown marker pair crashed; a parse error exited 2).
  Others: task-012 (secret scan after substitution; `check:packs` passed schema-failing files),
  task-016 (a malformed `maint/` name taken as the current line), task-010 (the content of several
  notes "lost or changed in the split", restored in `59f6be9`).
- `+` The review method strengthened over the period: mutation testing from task-004, injected
  nondeterminism (task-008, locale and TMPDIR), an independent implementation on 2,000 seeded cases
  (task-006), live checks of the deployed site (task-024).
- `−` Re-reviews were needed and found new defects, not only confirmations: task-006 (a review fix
  broke §8.2, reverted in `c77a6f3`), task-007 (`--out` created 0700, `e9c14e0`), task-019 (a body
  re-review found 2 new blocking points; a build re-review found a regression fixed in `758c779`;
  three passes for both).
- `−` Uneven re-review rule: the build re-review was skipped for task-020, task-021 and task-023 as
  cleanups or tightening only (their Execution Notes), with no written criterion for when a
  re-review may be skipped.
- `−` Cost: about 12–15 commits per task (add, body, amendments, submits, design, build notes,
  delivered); task-019 has 13, including two line-wrap commits (`f8abe45`, `cf488b7`). See also §7
  (W-04, W-05).

## 2. Red-first testing

- `+` Red runs recorded with counts: task-001 (51/54), task-002 (18), task-003 (30), task-004
  (66), task-006, task-008 (11), task-013 ("ran red first … then 9 of 9"), task-018 (15),
  task-022 (8), task-024 (failed to compile, then red). Stubs were never committed, so the red run
  exists only in the notes (task-001 › Execution Notes).
- `−` Not red-first, admitted in the element:
  - task-019: "drafted before its tests, a departure from red first; the red was then shown by
    mutation" (three mutations); "Later fixes were written test first" (task-019 › Execution
    Notes, build on `a7e5bfb`). **Relayed point confirmed.**
  - task-005: characterization tests written after the configuration;
  - task-007: the AGENTS region tests written after `agentsRegion`, checked by mutation;
  - task-010: the test written after the notes and the directive;
  - task-014: tests "written with each module rather than strictly before it";
  - task-020: unit tests of `overlay` and `compatFrom` written after their code.
- `−` Unverifiable: task-021 and task-023 put code and tests in one commit, with the red shown
  against stubs or a missing file; task-011, task-012, task-015 and task-016 plan "Tests, red
  first" in their Design, but their notes do not record a red run.
- Insight: red-first holds when the task is small and the stubs are cheap; it slips on large
  tasks (task-019) and on configuration or content work (task-005, task-010), where the natural
  test is a characterization. Mutation is used as the substitute, but no rule says when it is
  acceptable.

## 3. Deviations from the Acceptance, recorded afterwards

- `−` task-020 (**relayed point confirmed**): Acceptance 8 "exactly the same three files" "cannot
  hold as written" on an N-1 line (the test asserts two); Acceptance 3 said `tests/index.test.ts`
  stays unmodified, and it changes in one line; `compatFrom(data)` takes no label. The build review
  "accepted the three deviations above, asked for them to be recorded" (task-020 › Execution Notes).
- `−` task-022 (**relayed point confirmed**): Acceptance 9 said the expected files stay unchanged,
  and the fixture READMEs changed in section 7; the example rules skip packs with a broken schema
  or no README; `bump()` moves `base`'s example to the new major (task-022 › Execution Notes,
  "deviations, accepted by the review").
- `−` The same pattern before W14: task-012 (five deviations, among them Acceptance 2's "silently"
  turned into failing closed), task-014 (Acceptance 5: exit 1, not 2; `transition-stages` relaxed
  because "the stricter reading made such a publication impossible"), task-016 (Acceptance 3),
  task-015 (rollback beyond task-014's).
- `+` Every deviation is written down, reviewed and accepted before `in-review`; none was silent.
- Insight: the Acceptance is fixed at `backlog`, before the Design meets the code; when it turns
  out unsatisfiable, the only path is a deviation note. No step lets the Acceptance be amended
  between `backlog` and `in-review`.

## 4. Specifications, errata and decisions taken mid-course

- `−` spec-002 errata found during delivery and recorded, not applied (**relayed point
  confirmed**): §3.1 the tag is derived as `<catalog pack id>@<version>`, `catalog.yaml` has no
  such field (task-019 › Execution Notes); §2.4 the CB-2 exemption holds only while the tree holds
  no methodology (task-022, the approver's ruling). spec-002 stays `approved` with the errata and
  the P1–P3 rulings only in its Execution Notes (`b000e9d`; plan-024 › wave close). `OUT`: the
  amendment of spec-002.
- `−` Decisions taken in the course of the wave (**relayed point confirmed**):
  - the split of dl-014 D7 T2 into task 2 and task 2b, proposed by task-019's body review; the plan
    grew from six to seven tasks (plan-024, 2026-10-11; `6d90b9c`);
  - the CB-2 exemption read as "the tree holds no methodology", with a cost recorded: `base`
    needs a version with examples at W10 (task-022);
  - the root README names no published state of its own, which settled two blocking review points
    (task-023 › Context);
  - spec-002 P1–P3 (no third-party search library, excerpt = first paragraph, the site command),
    ruled when plan-024 was presented;
  - the CATALOG README column links github.com at the tag (task-019 › Context).
- `−` Earlier in the period: ESLint was not in adr-003 although `code-quality` asks for a linter;
  task-001 found the gap, and plan-019, adr-004 and a new task 4b (task-005) followed (plan-015,
  2026-10-07). Stop after W5, the feedback-loop tasks task-009/task-010 inserted, W6 held then
  resumed (plan-015).
- `−` Small wording slips in approved elements: task-022 › Context calls the chosen reading "the
  first", its Execution Notes "the second"; plan-015's fixture path `test/fixtures/` (fixed,
  `d8d6e54`); adr-004's package count corrected after submit (`a037ac7`); bug-001 names
  `pack-cycle` › `deliver` for `author` (`OUT`, plan-018).
- `+` Every mid-course decision was taken by the approver in chat, recorded in the element that
  needed it with the date, and none reversed an approved decision.
- Insight: the specs were written before the tooling and met their first implementation in the
  tasks; most errata are of that kind (a field assumed, an exemption too broad). They accumulate
  in Execution Notes, with no trigger to fold them back.

## 5. Plans and backlog drift

- `−` plan-015 ended out of date with its own text: the phase gate lists "superseded wording above,
  kept as written", among which the tasks ran through `tooling-delivery` (bug-001), not
  `kanban-delivery`; the backlog grew from 13 to 17 elements (plan-015 › phase gate).
- `−` plan-020 captured four decision-logs under a title that names two ("The plan's title still
  names the first two", plan-020 › Execution Notes).
- `−` Hosted work outside a plan's backlog: task-017 committed on `main` without a branch (approved
  by its Design, plan-015 gate); task-025 hosted by plan-024 after its last task, at the
  coordinating session's request (plan-024, 2026-10-11, 2026-10-12); bug-001 captured under
  plan-015 without its own `bug-ingest` plan.
- `−` Id collision between parallel sessions: plan-022 was first created on `main` and withdrawn,
  because the dl-015 branch already held plan-022 (plan-023 › Execution Notes); plan-020 had
  warned that parallel `memory add` "would collide".
- `+` Separate worktrees for parallel capture work (plan-020, plan-022) avoided interfering with the
  delivery session on `main`.

## 6. Reporting accuracy and process slips

- `−` A CI result reported wrongly: task-014's notes first recorded as a success a run that ended
  in **failure** on both jobs (ISO dates `Z` on the runner, `+00:00` locally); corrected in
  `f3eebc5` (task-014 › Execution Notes). From then on every task records run ids and their
  conclusion (task-018 … task-025: all `success`).
- `−` An untracked working note committed by mistake inside an Execution Notes commit (`8b7f782`,
  a broad `git add`), against dl-005 G3; removed in `1aa50c3`, readable in the history because
  `main`'s protection forbids rewriting it (plan-022). Since then files are staged by name.
- `?` The GitHub Pages confirmation first made on the wrong repository (relayed by the approver):
  not recorded in any element. task-024 records only the check of this repository's Pages
  settings (`build_type: workflow`, `https_enforced: true`); no commit message names another
  repository.
- `−` Scope creep in a configuration commit: `b0291ad` added a `tooling` module beyond plan-018's
  scope, found by its review (plan-018).
- `−` Commit hygiene: a "(WIP)" subject (`5949edf`) and a `test:` commit carrying a fix
  (`4982426`) in task-007; adr-004 and task-002 amended in one commit (`ab39f37`); line-wrap and
  wording fixes as separate commits (`fb63ee1`, `7b495aa`, `f8abe45`, `cf488b7`).
- `−` Pushes from the agent session were blocked by its permissions on 2026-10-06; the approver
  pushed (plan-015). Resolved from 2026-10-07.
- `+` Acceptance re-run from a clean clone on Node 22.21 and on the floor 22.12.0 for every task;
  network-free tests verified with `unshare -rn` (task-011); a publication dry run (task-014); the
  deployed site checked live (task-024: HTTP 200, CORS `*`).

## 7. WingFoil CLI 0.2.2

State of each known behaviour of the `wingfoil-cli` directive and of the related notes:

| Entry | Behaviour | First recorded | Note | Reproducible with WingFoil alone |
|---|---|---|---|---|
| W-01 | `format:` warning | spec-001, task-007 | F-017 (a format request, not the warning) | warning not filed as such; expected until v0.3 |
| W-02 | `memory add --set` fills only id tokens | plan-001, dl-004; again plan-025 | F-011 | yes |
| W-03 | `approve`/`reject` need `--reason` | plan-009 | none | behaviour, not a defect |
| W-04 | `submit` commits uncommitted body edits | plan-009 | **none** | `WF` candidate |
| W-05 | two `submit`s give the same commit subject | task-010 (entry seeded) | **none** | `WF` candidate: 100 `wf(task): submit` commits, one subject for four transitions |
| W-06 | `illegal transition` when the target is not the next state | task-010 (entry seeded) | **none** | `WF` candidate (message does not name the expected state) |
| W-07 | no verb leaves a `waiting` state | dl-003 D3 | **none** | `WF` candidate |
| W-08 | `workflow list` does not check `include`s | plan-018 | none | WingFoil bug-145 already open |
| W-09 | `where:` on `iterate_over` not evaluated | plan-015 (2026-10-06) | F-018 | partly: commands in prose, no output block |
| W-10 | runs only at a git root | task-007 | F-021 | yes |
| W-11 | built-in directive ids not readable | task-006 | F-019 | yes |
| W-12 | validation rules only in the loaders | task-007; pin fixed by plan-023 (`ffed728`) | F-020 | yes |

- `WF` A phase has one role in WingFoil 0.2.2, so a workflow cannot run tooling tasks as developer
  and pack tasks as pack-author in one phase; `tooling-delivery` duplicates `kanban-delivery` for
  that (bug-001 › fix options). No note.
- `−` Our side: rule 7 of `wingfoil-cli` names `wingfoil-sync` and `release-planning`, which no
  workflow of this repository defines (task-010 and plan-020 › Execution Notes); the inbox README
  still says "Last sync: none". It came in with the shared text task-010's Acceptance 6 required
  word for word.
- `−` Our side: the ledger title of F-012 is truncated ("Format key distinct from version:",
  `docs/wingfoil-feedback/README.md`).
- `−` F-018's evidence is weaker than the inbox format asks (dl-163 R4: command, output, version):
  no output block.
- `+` The period mostly catalogued friction met earlier and made it actionable: task-010 seeded
  W-01 … W-12, every new note was "reproduced with WingFoil 0.2.2 alone in a scratch git
  repository" (task-010), and task-025 aligned the inbox citation with WingFoil's
  (`<full service id>/F-<nnn>@<full sha>`).
- `+` Workarounds are named in the directive and in the elements that used them (rule 4): W-02 in
  plan-025 itself, W-10 in task-011's scratch `git init`, W-11 in `src/wingfoil-builtins.ts`.

## 8. Divergences with WingFoil's plans (relayed 2026-10-12)

Relayed by the approver from WingFoil's estimates of 2026-10-12 (v0.3 on npm about 2026-10-20;
v0.4, early to mid November, with reference templates and `pack-install`, WingFoil dl-137 and
dl-138; v1.0 later). WingFoil's dl-138 is not in this repository: its content below is as relayed,
not verified here. **Mapped, not decided:** their decision-log is separate work (plan-025 ›
Context).

### 8.1 Base packs bundled in WingFoil's npm package

WingFoil dl-138 (Action 3), as relayed: packs are template-repository content, not npm content;
bundled base packs are not planned. This repository assumes the opposite in:
- dl-001 D4 ("The base packs stay bundled in WingFoil's npm package as offline fallback") and its
  Execution Notes; dl-003 D7 (`base` is bundled); dl-012 (a bundling note for the feedback pack);
- the vision: `01_product-brief.md` (purpose 2, success signals), `02_product-vision.md`,
  `03_is-isnot.md`, `04_personas.md` (the WingFoil maintainer), `05_journeys.md` (all of J3),
  `06_features.md` F5.4, `08_mvp-canvas.md` (an MVP success metric);
- the inbox: F-001, F-003 (the whole note, `advance-bundled-packs`), F-005 (`--offline`), README
  decision D3 and its open question;
- the configuration: `wingfoil-cli` rule 8, `dna.yaml` (project description),
  `pack-release-cycle` › publish, the `pack-release` template;
- the tooling: `publish:pack --bundled` (`src/publish.ts`), its tests (W7's exit criterion,
  task-015, task-016, task-020); spec-001 (which packs WingFoil bundles is WingFoil's call).
- Waves affected: W7 (done; F5.4), W8/W9 (`base` bundled), W10 ("the bundled methodologies").

### 8.2 `wingfoil stage set`

Not planned in WingFoil, as relayed. This repository names it in `01_product-brief.md`,
`04_personas.md`, `05_journeys.md` (J8), F-008 (`wingfoil stage set <stage>` runs a transition this
repository defines), spec-001 §14 and the `stage-transitions` capability in `compat.yaml`, and
`dna.yaml`. dl-001 D1/D3 speak of transitions without naming the command. Wave affected: W12 (F4.7
stages and transitions).

### 8.3 dl-138's `remote` asset class against dl-003

dl-003 (install folder: "`built-in/` today, `remote/` if ratified", after WingFoil dl-138 Q3),
`pack-authoring` (packs write only `built-in/`, or `remote/` if ratified), spec-001 (the install
mapping; a `remote` class "changes the composer", not the format), F-007, F-005 (a lock, vendored
and pinned) and journeys J2/J7 assume packs install into `built-in/` until WingFoil rules. Relayed:
dl-138 introduces `remote` (vendored and pinned `pack-install`) for v0.4. Waves affected: W8/W9
(`base`'s install folder), M3 (J6–J7, waiting on v0.4).

Also relayed: `wingfoil capabilities` is not planned; F-013, dl-002 and spec-001's capability
vocabulary (`requires_capabilities`, `compat.yaml` › `capabilities`) assume a command or a published
vocabulary (W4's open point in `08_mvp-canvas.md`).

## 9. Debts carried past M1

`OUT` each, cited for completeness:
- `base`'s charter must list CB-6 with CB-1 and CB-2 (plan-024, task-021);
- `base` needs a version with examples when the first methodology enters the tree (W10, task-022);
- the spec-002 amendment (errata, P1–P3);
- the unused `0.x` clauses of `pack-semver` and `pack-cycle`, and bug-001's `deliver`/`author`
  slip (plan-018; plan-015 phase gate);
- the `LICENSE` file (`package.json` says MIT, no file);
- dl-007, dl-011 … dl-013, dl-015 waiting for stable WingFoil contracts or `base`'s charter;
  `validate:publication` failing until a release reads the `format:` key (dl-009).

## 10. What went well, in short

- M1 delivered in seven days: W5 in two (task-001 … task-008, 62 → 424 tests), W6–W7 between 2026-10-09
  and 2026-10-10, W14 in two, with a phase gate approved at the first review (plan-015, clean clone at `21dc7dc`).
- No element rejected; every review finding fixed or written down; no CI failure left unexplained.
- One merge discipline throughout: task branch, real CI run recorded, approver's OK, `--no-ff`
  merge, push, branch removed.
- The feedback loop with WingFoil exists and is aligned with its format and citation (task-009,
  task-010, task-017, task-025), in time for WingFoil's v0.3 retrospective.

## Points to analyse (additional-points)

Filled after the approver's checkpoint.
