---
id: task-081-intake-verify-a-prepared-release-checked-and-reported-verified-or-guided-by-intake.yml-plan-065-task-c
type: task
title: "Intake verify: a prepared release checked and reported verified or guided by intake.yml (plan-065 task C)"
status: done
pack: ""            # tooling task (tooling-delivery v3), plan-065 task (C)
depends_on: []
tags: ["tooling","intake","ci"]
---

## Context

plan-065's task (C) (rulings 1 to 3, 6 and 7), the last of its four, after task-078 (detect),
task-079 (the release-pinned parts derived) and task-080 (`intake:prepare`): `intake.yml` prepares
the lowest missing WingFoil version, verifies the prepared tree on the new release and reports it
**verified** or **guided**, never pushing. dl-042 (approved 2026-11-05) rules what the report is
for: I1, a verified patch's intake applies the artifact on a task branch, its sha256s checked on
apply, the lockfile never regenerated, only on an unmoved base, a rehearsal report never for
intake; I2, the carry-forward of `reads` and `capabilities` that task-080 writes, any change the
bar flags making the report guided. `wingfoil-release-intake` v7 (dl-042 I5) is applied by
plan-065's dl actions row after this task; until then a report feeds v6's hand-run `record`.

What exists on `main`: `intake.yml`'s one `detect` job (daily and by hand, `contents: read`,
actions pinned, no cache), red with an `::error` per missing version (plan-065 point 5);
`intake:detect` (`src/intake-detect.ts`), its lines `<version> <class> (against <v>)` or
`<version> backport (below <v>)`; `intake:prepare` (`src/intake-prepare.ts`), writing exactly the
allowlist below and nothing on a refusal; `ci.yml`'s self-test checks and its `::warning` escape
(`%`, CR, LF). WingFoil's CHANGELOG is at its GitHub tag only (plan-060), Keep a Changelog 1.1.0:
a section `## [X.Y.Z] - <date>` per release, `### Added`, `### Changed`, `### Fixed`, `### Removed`,
`### Security`, `### Upgrading from <v>`, `### For contributors`, some with `####` sub-headings;
a tag not yet pushed answers 404.

## Acceptance

`npm run build` precedes the commands. The allowlist of version `<v>` is `src/matrix/wingfoil-<v>/`
(its `package.json` and `package-lock.json`), `compat.yaml`, `catalog.yaml`, `CATALOG.md`,
`catalog-index.json` and `tests/fixtures/compose/tree/compat.yaml` (task-080's files).

1. **The workflow's shape** (`.github/workflows/intake.yml`, `on` unchanged plus one
   `workflow_dispatch` input `rehearsal`, boolean, default `false`; `permissions: contents: read`
   for the whole workflow and no job's own; `concurrency` unchanged): four jobs.
   - `detect`: a step with an `id` and `continue-on-error: true` runs `intake:detect --github
     --github-output "$GITHUB_OUTPUT"` (plus `--rehearsal` only when the input, read through
     `env`, equals `true`: on `schedule` it is empty); the job's `outputs` `version` and `class`
     map to that step's outputs; a last step fails the job when that step's `outcome` is not
     `success`, so the job stays red while a version is missing (plan-065 point 5). `version` is
     the lowest missing version above the newest recorded, `class` its class (`patch`, `minor`,
     `major`; detect's `minor, breaking in 0.x` written `minor`), both empty when none is (a
     backport alone prepares nothing: dl-042 I1, task-080's refusal). In a rehearsal, `version` is
     the newest recorded release and `class` its class against its predecessor, mapped the same
     way.
   - `prepare`, `needs: detect`, `if: ${{ !cancelled() && needs.detect.outputs.version != '' }}`
     (it runs after a red `detect`); Node.js 22.21.0; no WingFoil release run; in a rehearsal it
     first runs `intake:rehearse` (Acceptance 4); then `intake:prepare`, then `intake:collect`
     (Acceptance 2) to `$RUNNER_TEMP/intake`, then `actions/upload-artifact` of that directory
     (`path: ${{ runner.temp }}/intake`, as in every `with:`, where `$RUNNER_TEMP` is not expanded),
     named `intake-<version>`, `retention-days: 14`, `if-no-files-found: error`.
   - `verify`, `needs: [detect, prepare]`, `if: ${{ !cancelled() && needs.prepare.result ==
     'success' }}`, on Node.js 22.12.0 and 22.21.0 (`fail-fast: false`): `actions/download-artifact`
     of that name to `$RUNNER_TEMP/intake`, `intake:apply` (Acceptance 3) on its checkout, then
     every check of `ci.yml`'s self-test, in its order: `npm test`, `npm run lint`, `npm run
     check:pins`, `npm run check:schemas`, `npm run check:packs`, the search page (`npm run site`,
     which reads the ranges), `npm audit --omit=dev`, `npm audit` in every pin folder (the new
     lockfile with the others), `npm run validate` (the matrix, the new release its newest), the
     golden fixture's and the three overlays' `validate` runs, `npm run check:runs`; and `npm run
     validate:publication` (dl-009's zero-warning run, confirming the row's provisional
     `format_key: true`). Each check a step with a fixed `id` and `continue-on-error: true`, so
     that all of them run; the set-up, install, build, download and apply steps are not, and fail
     the job at once. Three last steps, in this order, none needing `always()` since the checks are
     `continue-on-error`: a `run` step writes each check's outcome to the job summary and to
     `$RUNNER_TEMP/checks.json` (the node version, the fixed ids and their outcomes); a pinned
     `actions/upload-artifact` step uploads it as `verify-<node>` (`retention-days: 14`); a `run`
     step fails the job when an outcome is not `success`. No `actions/cache`, no save and no
     restore, stricter than the plan's "no save" at no cost: `ci.yml`'s key hashes every pin
     lockfile, so a new lockfile always misses.
   - `report`, `needs: [detect, prepare, verify]`, `if: ${{ !cancelled() &&
     needs.detect.outputs.version != '' }}`: downloads `intake-<v>` with `if: ${{
     needs.prepare.result == 'success' }}` to `${{ runner.temp }}/intake`, and the checks by
     `pattern: verify-*` (one subfolder per artifact) to `${{ runner.temp }}/checks`, that step
     `continue-on-error: true` (a pattern matching nothing does not make `report` red); then runs
     `intake:report` (Acceptance 5), which reads the CHANGELOG and writes the report to the job
     summary; it ends green for either verdict and red only when no report could be written.
   `prepare` and `verify` check out with `fetch-depth: 0` and `fetch-tags: true`, as `ci.yml` does
   (spec-002 §3.1: the index reads published versions at their tags); `report` reads only
   `compat.yaml` and `catalog.yaml` and checks out shallow. Every action pinned to a full commit SHA
   with its version as a comment (`upload-artifact` and `download-artifact` resolved at build);
   `actions/checkout` with `persist-credentials: false`; each job `runs-on: ubuntu-24.04` with a
   `timeout-minutes` (`prepare` 15, `verify` 40, `report` 10); a job output or an input reaches a
   `run` only through `env` (never `${{ }}` inside `run`), and each script validates the version as
   strict `X.Y.Z` again. No push, pull request, comment, token or secret: no `secrets.`,
   `github.token` or `GITHUB_TOKEN` in the file. `ci.yml` unchanged.
2. **`npm run intake:collect -- <version> --out <dir> [--tree <dir>]`** (`src/intake-artifact.ts`,
   its CLI): refuses (exit 1, writing nothing under `--out`) a version not strict, an `--out`
   inside the tree or existing and not empty, a `git status --porcelain --untracked-files=all` of
   the tree naming any path outside the allowlist, or a missing allowlisted file; otherwise copies
   each allowlisted file whose text differs from `HEAD` (the pin's two files always) to
   `<out>/files/<path>`, and writes `<out>/SHA256SUMS` (`<sha256>  <path>` per file, in byte
   order, `sha256sum -c`'s format) and `<out>/BASE` (the tree's `HEAD` commit, 40 hex). Exit 0
   printing the SHA256SUMS lines; 2 on a wrong command line.
3. **`npm run intake:apply -- <dir> --version <v> [--tree <dir>]`** (same module, its CLI), for
   `verify` and for the intake (dl-042 I1, `--version` from the report): refuses (exit 1, writing
   nothing) a version not strict; a `BASE` not 40 hex; a `SHA256SUMS` line malformed, naming a
   path outside `<v>`'s allowlist (a pin folder of another version included), `..` or an absolute
   path, or whose file is missing or whose sha256 differs; the pin's two files not both listed; a
   file under `files/` that `SHA256SUMS` does not list; a symbolic link under `files/` or at a
   target path (`lstat`); an allowlisted path with uncommitted changes in the tree; and a `BASE`
   that is not the tree's `HEAD` when any allowlisted path differs between `BASE` and `HEAD`
   (`git diff --name-only BASE HEAD -- <allowlist>`; a `BASE` unknown to the tree refuses too);
   otherwise writes every listed file into the tree, byte for byte, and prints one `applied
   <path>` line per file. Exit 2 on a wrong command line.
4. **`npm run intake:rehearse -- [--tree <dir>]`** (`src/intake-rehearsal.ts`, its CLI): removes
   the newest release from the tree, so that `intake:prepare` can prepare it again: its row from
   `compat.yaml` and from the golden fixture's (every other byte kept), its pin folder, the
   `catalog.yaml` ranges recomputed by `computeRange` from the reduced `compat.yaml` (quoting
   kept), `CATALOG.md` and `catalog-index.json` by `rootOutputs`, all computed in memory first, as
   task-080 does. Refused, writing nothing: a tree `intake:prepare` would refuse for its
   consistency (task-080 Acceptance 1, the version checks aside), or a `compat.yaml` with fewer
   than two releases. The result passes `npm run index -- --check` and `check:packs`, and
   `intake:prepare` of the removed version on it exits 0. The rehearsal re-verifies the newest
   release only, a narrowing of plan-065 (C)'s "the newest by default": an older one would be a
   backport, which `intake:prepare` refuses.
5. **`npm run intake:report -- <version> --class <class> --prepare <result> --verify <result>
   [--artifact <dir>] [--checks <file>]... [--rehearsal] --summary <file> [--tree <dir>]`**
   (`src/intake-report.ts`, its CLI): a pure `report(input)` (the CHANGELOG fetched by an injected
   function) and the CLI, which fetches
   `https://raw.githubusercontent.com/wingfoil/wingfoil/v<version>/CHANGELOG.md` (the owner, the
   repository and the path fixed in code, never read from the registry or the input; HTTPS, no
   token, `redirect: 'error'`, a 30-second timeout, the 1 MiB bound applied while reading),
   appends the report to `--summary` (the job's `$GITHUB_STEP_SUMMARY`) and prints one `::notice`
   line (`verified`) or `::warning` line (`guided`, the reasons' count) built from fixed text and
   the validated version only. The section is the lines from `## [<version>]` (the version's dots
   matched literally) up to the next line starting `## `, its preamble included. The verdict is
   **verified** only when none of these holds, each one a reason listed (plan-065 ruling 2, dl-042):
   - `--prepare` or `--verify` other than `success` (a refusal, a red check, an advisory, or
     `validate:publication` not confirming `format_key`);
   - a class other than `patch`;
   - the CHANGELOG not fetched (any status but 200, a redirect, a timeout, over 1 MiB), or no
     section for the version;
   - a `###` heading other than `Added`, `Changed`, `Fixed`, `Upgrading from` followed by any
     text, and `For contributors` (so `Removed`, `Security`, `Deprecated` and any heading not
     known), or a heading (`###` or `####`) containing `Breaking` (case-insensitive);
   - any `Added` or `Changed` entry, an entry being any non-blank line under that heading,
     its `####` sub-headings included: read conservatively as "an entry naming a command or a
     feature" (dl-042 I2), since each such entry describes one;
   - any line of the section (the "Upgrading line" of the request read as any line) matching
     `\bformats?\b` (`format:` and `--format` included) or naming a kind of `compat.yaml`'s
     `kinds`, case-insensitive: a backtick span equal to the key (`` `dna` ``; a key inside a longer
     span, as in `` `memory history` ``, is a command, not a kind); for a value ending in `.yaml` (a
     path), its file name as a whole word (`dna.yaml`); for any other value (a description), the
     value without a leading `a `, `an ` or `the `, as a substring, plural included (`directive
     file`, `Memory template`).
   The report, Markdown: a first line `Rehearsal of <version>: never for intake (dl-042 I1)` in a
   rehearsal; the verdict and the version, its class, the run's `BASE` (`unknown` without an
   artifact); each reason with the section's line number (no CHANGELOG text in a reason);
   `prepare`'s result and each `verify` leg's checks by Node.js version from `--checks` (`no
   checks` for a leg without one, or whose `checks.json` is not valid: its node not one of the two
   named versions, an id not of the fixed set, or an outcome not `success`, `failure`, `cancelled`
   or `skipped`), for `recheck` to cite (dl-042 I1); the artifact's `SHA256SUMS`
   lines (`no artifact` without one); for each kind a line names, the `catalog.yaml` packs whose
   versions declare that kind in `formats`; then the section as a checklist for a guided intake
   (plan-065 point 5). The directives an item touches are left to the guided intake: no mechanical
   mapping from a CHANGELOG line to a directive exists. The section's text, its CRLF made LF and
   its control characters other than tab removed, is written verbatim inside a fenced block whose
   fence is longer than any backtick run in it: a departure from the plan's "escaped as `ci.yml`
   escapes", whose `%`, CR and LF escape is for workflow commands, not Markdown; a fence that
   cannot be closed early renders the text as text only, and no CHANGELOG text reaches stdout or
   an annotation. Exit 0 with either verdict; 1 when the summary cannot be written; 2 on a wrong
   command line or a version not strict.
6. **Offline tests** (the `testing` directive), `tests/intake-artifact.test.ts`,
   `intake-rehearsal.test.ts`, `intake-report.test.ts`, `intake-detect.test.ts` (its two options)
   and `intake-workflow.test.ts` extended: trees as task-080's tests build them (a temporary git
   repository, `FROZEN_COMPAT` or a frozen copy, never this repository's `compat.yaml` or
   `catalog.yaml`, task-045's rule); synthetic CHANGELOG fixtures under
   `tests/fixtures/intake/report/` (no copy of WingFoil's text), each rule of Acceptance 5 tested
   alone, the verified case, the fence, the control characters, `checks.json`'s validation, the
   subfolders the checks pattern downloads and a leg missing, a 404, a redirect, a timeout and
   the size bound through the injected fetch; every refusal of Acceptance 2 to 4 tested and
   writing nothing; a collect then apply round trip byte-identical, and rehearse then prepare
   giving back the removed release's row (its `notes` the placeholder) and ranges; the workflow
   file's shape (Acceptance 1, the three `if`s, the checkouts' depth and tags, the `env` rule)
   asserted as task-078's tests do. The CLIs' exit codes and lines; the report CLI's fetch never
   reaches the network in a test (the module's fetch injected; the CLI's URL asserted as a
   constant).
7. **No other file changes** than the new sources, `src/intake-detect-cli.ts` (the job outputs, by a
   `--github-output <file>` option, and a `--rehearsal` option for the rehearsal's version; its
   lines and exit codes unchanged), `src/intake-prepare.ts` only for a refactor into a shared helper
   (its behaviour unchanged, its tests unchanged and passing), `package.json`'s four scripts,
   `intake.yml`, the tests and their fixtures, this task and `docs/owed-items.md`.
8. **The checks** (`tooling-delivery` v3 › `review`, dl-039, plan-065 rulings 6 and 7): the build
   review and its amendments first; then once on the frozen commit the branch CI `success` (both
   jobs, run id and durations), dl-039's local list on Node.js 22.21.0, `npm run lint` 0; and
   `intake.yml` dispatched on the task branch with `rehearsal: true` (`gh workflow run intake.yml
   --ref task/<id> -f rehearsal=true`, run by claude with the approver's OK each time): `detect`
   green with no missing version (or red naming only versions above 0.3.2, its outputs still
   naming 0.3.2), `prepare`, `verify` (both jobs) and `report` run, the report labelled a rehearsal
   of 0.3.2 and **guided** (its CHANGELOG has `Added` and `Changed` entries, plan-065 ruling 2),
   each job's duration recorded (G12, ruling 7). The path of a real intake (`detect` red, its
   outputs reaching `prepare`) is covered by the workflow test's `if` and `outputs` assertions and
   first runs at the first real missing version, recorded by plan-065's close. A `verify` red on
   the rehearsal is recorded with its cause, and blocks the task unless the cause is outside it.
   The privacy check of the branch's diff recorded.

## Design

Branch `task/task-081-intake-verify` from `main` at this task's add. `src/intake-artifact.ts`
exports the allowlist of a version (shared by collect, apply and the workflow test),
`collectArtifact` and `applyArtifact`; `src/intake-rehearsal.ts` exports `removeNewest(tree)`,
reusing task-080's consistency checks and its in-memory writes (moved to a shared helper if needed,
`intake:prepare`'s behaviour unchanged); `src/intake-report.ts` exports `report(input)` and the
bar's rules, the fetch injected; each CLI as `intake-prepare-cli.ts`. Red steps: (1) the tests of
Acceptance 6 and the modules' signatures with no body: red, the failing count; (2) the modules,
their CLIs and `intake.yml`: green; (3) the rehearsal dispatch (Acceptance 8).

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->

- 2026-11-06: added on `main` (`ed00855`) after task-080's merge and done (W-14). Body review:
  approve after amendments, 2 blocking, 9 should-fix, 7 nits; applied: the `if`s of `prepare`,
  `verify` and `report` (a red `detect` no longer skips them), the checkouts with every tag (the
  index reads them), `detect`'s step split, the artifacts under `$RUNNER_TEMP`, `intake:apply`'s
  `--version` and its further refusals (symbolic links, uncommitted changes), the bar's rules made
  exact (unknown headings, entries, `formats?`, the kind matches, the section's bounds), each
  check's outcome per Node.js version in the report and the packs per kind, the directives left
  to the guided intake, the fence stated as a departure from the plan's escape, the search page
  among the checks, the refactor of `intake-prepare.ts` allowed, the fetch's redirect refused.
- 2026-11-06: re-review: approve after small amendments, no blocking; applied: `verify`'s last
  steps split (summary, upload, fail), `report`'s downloads (the artifact by `if`, the checks by
  pattern, `continue-on-error`), `checks.json` validated, `${{ runner.temp }}` in `with:`, the
  kinds' path and description rule, `Upgrading from` any text, the real intake's path covered by
  the workflow test and first run recorded at plan-065's close.
- 2026-11-06: accepted by the approver (`19ac2b5`, pending → backlog); started on
  `task/task-081-intake-verify` (`eee0202`). Red: the tests of Acceptance 6 with the modules'
  signatures and no body, `intake.yml` as on `main`: `node --test` of the five intake test files,
  99 tests, 75 failing; passing, task-078's 19 tests of `intake:detect`, four workflow assertions
  today's one-job file already meets (permissions, concurrency, pins, `env`), and `--rehearsal`'s
  refusal (an unknown option today). `src/intake-prepare.ts` refactored first (its checks and
  writes exported for the rehearsal), its 23 tests unchanged and passing. Green (`5668027`): the
  modules, their CLIs, the four scripts and `intake.yml` (`upload-artifact` v7.0.2 `cf430e0`,
  `download-artifact` v8.0.2 `9000827`, both published 2026-10-07); the intake's six test files,
  123 tests, 0 failing; `npm run lint` 0. One test changed while green: the rehearsal's round
  trip compares a plain `wingfoil: 9.0.0` of the fixture's catalog with the double-quoted one
  task-080 writes, and the "no pin folder" case starts from the recorded tree, since the fixture
  with 9.0.0 removed keeps no release that base's range meets (refused, a test of its own).
- 2026-11-06: the full suite on the green commit: `npm test`, 1179 tests, 0 failing. Build
  review: approve after amendments, no blocking; the real 0.3.2 CHANGELOG reported guided (its
  `Added` and `Changed` entries, the word format, five kinds), 0.3.1 and 0.3.0 guided too; applied
  (`c272c3b`): `intake:apply`'s uncommitted check with the allowlist as pathspec (a staged `git mv`
  was missed), both symbolic-link tests made to reach the link check and assert its message, a
  test running verify's two inline scripts with a fake `STEPS` (a `conclusion` read for `outcome`
  would have shown every check green) and asserting both checks layouts, a `## ` bound test, the
  summary's class mapped, `--out` compared by real path, `jobClass` dropped. Each surviving mutant
  of the review then caught (one failing test each). Re-review: approve, three nits applied
  (`28ca167`, the frozen commit): a comment put back on `GOLDEN_COMPAT`, a change outside the
  allowlist shown not to block apply, the summary row's outcome asserted. Intake tests 127, 0
  failing; `npm run lint` 0.
- 2026-11-06: the checks on the frozen commit `28ca167` (dl-039; after it only these notes, docs
  only). Branch CI run 42257607151 on `1525044`, `success`: 22.21.0 13 min 23 s, 22.12.0 13 min
  54 s. dl-039's local list on Node.js 22.21.0 on a clean worktree of `28ca167`: `npm ci`, `npm
  run build`, `npm run validate:publication`, the golden fixture's publication run, `workflow
  list`, `directives list --format json`, each exit 0, `warnings []`; `npm run lint` 0. The
  rehearsal, dispatched with the approver's OK (`gh workflow run intake.yml --ref
  task/task-081-intake-verify -f rehearsal=true`), run 42259278303 on `1525044`, `success`:
  `detect` 18 s (no missing version), `prepare` 25 s, `verify` 22.21.0 13 min 1 s and 22.12.0
  18 min 24 s (every one of the 15 checks `success` on both, the `verify-<node>` artifacts read),
  `report` 17 s; the whole run 19 min 33 s, `ci.yml` unchanged (G12). The report: `::warning`
  "rehearsal of 0.3.2 guided: 7 reasons" (`Added` and `Changed` entries, the word format, the
  kinds `directive`, `roles`, `memory`, `dna`, `memory-template`), as Acceptance 8 expects. The
  artifact `intake-0.3.2`, its BASE `1525044`: four files differ from `HEAD`, as expected of a
  rehearsal: `compat.yaml` and the golden fixture's (0.3.2's `notes` now the placeholder, sha256
  equal), the pin's `package.json` (the fixed description, without task-074's id) and its
  lockfile, resolved afresh (ip-address 10.7.5 → 10.7.6, two `peer` flags dropped), audited
  green in `audit-pins`; the ranges, `CATALOG.md` and `catalog-index.json` came back unchanged.
  The path of a real intake (`detect` red) first runs at the first real missing version, recorded
  at plan-065's close. Privacy check of the branch's diff: no local or scratch path, no private
  project, no intermediary session.
