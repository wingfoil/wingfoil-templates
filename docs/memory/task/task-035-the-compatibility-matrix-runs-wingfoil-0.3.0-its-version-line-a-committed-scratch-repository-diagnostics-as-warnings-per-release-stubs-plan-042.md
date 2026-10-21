---
id: task-035-the-compatibility-matrix-runs-wingfoil-0.3.0-its-version-line-a-committed-scratch-repository-diagnostics-as-warnings-per-release-stubs-plan-042
type: task
title: "The compatibility matrix runs WingFoil 0.3.0: its version line, a committed scratch repository, diagnostics as warnings, per-release stubs (plan-042)"
status: backlog
pack: ""            # tooling task (wingfoil-release-intake › record, plan-042)
depends_on: []
tags: ["tooling","compat","matrix"]
---

## Context

The first of plan-042's two tasks (the approver's ruling K, 2026-10-20). WingFoil 0.3.0 is released
(`wingfoil/wingfoil@v0.3.0` = `cc31d7a8`, on npm), and task-036 records it in `compat.yaml`. Before
that, the compatibility matrix (`src/matrix.ts`, F3.3, `pack-compatibility`, dl-009) must be able to
run it; read at `v0.3.0`, it cannot:
- **the version line.** 0.3.0's `--version` prints `<semver> (<commit>)`, the commit being
  `[0-9a-f]{7,64}` with an optional `-dirty`, or `unknown`; `runRelease` requires the printed text
  to equal the release, so every run fails with "--version printed …";
- **`HEAD`.** 0.3.0 answers from what is committed at `HEAD`; the matrix copies the composed
  `.wingfoil/` into a scratch repository that is only `git init`ed, so `workflow list` sees no
  workflow (an empty snapshot, exit 0) and the check is vacuous;
- **what a warning is.** `judge` fails a command on its exit, any stderr line, and a stdout line
  starting `Warning:`. 0.3.0 writes its stderr warnings as `warning: …`, or `{"warning": …}` under
  `--format json` (any stderr line already fails), and also reports problems as data on stdout:
  `workflow list` returns `diagnostics` (`{code, severity: error|warning, file, path, message}`; an
  `error` one also makes the command exit 1), and `directives list` returns `{entries, warnings}` in
  both 0.2.2 and 0.3.0, 0.3.0 adding scope and `roles.yaml` disagreements. The approver ruled (L and
  M, 2026-10-20): a warning is any diagnostic of severity warning or error, on stderr or in
  `workflow list`'s `diagnostics`, and any entry of `directives list`'s `warnings`;
- **the tests.** The WingFoil stub (`tests/support/stub-wingfoil.ts`) answers one version for every
  release and looks commands up by their exact argument string, and `fixtureCompat()`
  (`tests/support/published-repo.ts`) appends the fictitious release 9.0.0 to the real
  `compat.yaml`, so the fixture ranges would move to `>=0.3.0 <=9.0.0` as soon as task-036 lists
  0.3.0.

WingFoil 0.2.2 accepts `--format json` on every command (a global option) and prints
`workflow list` as `{manifest, workflows}` with no `diagnostics`; its `format` warnings stay raw
lines on stderr, so the 0.2.2 tolerance (dl-009) still applies. The judge cannot tell an empty
snapshot from a pass; failing on it would go beyond rulings L and M, so criterion 7 records the
evidence instead.

The real `compat.yaml` is not touched here (ruling K): this task makes the matrix and its tests
ready for a second, real release, and proves a run of the real 0.3.0 on a temporary tree.

## Acceptance

Tests in `tests/matrix.test.ts` and `tests/validate.test.ts` unless named, run by `npm test`.

1. **The version line.** A release run accepts a `--version` line that is exactly the release, or
   the release, one space and a parenthesised commit as above: it accepts `0.3.0`,
   e.g. `0.3.0 (cc31d7a8)`, and `0.3.0 (unknown)`; it refuses `0.3.0 (`, `0.3.0  (x)`,
   `0.3.0 (x) y` and `0.3.1 (cc31d7a8)` with "--version printed …".
2. **A committed scratch repository.** Before any WingFoil command, the scratch repository holds one
   commit of the copied `.wingfoil/`, added with `git add --force` (no exclude file drops a file)
   and committed with a fixed identity on the command line (`-c user.name=… -c user.email=…`; the
   matrix's git environment carries none, `src/git.ts`). Tested: when the commands run,
   `git ls-tree -r HEAD` lists every copied file and `git status --porcelain` is empty.
3. **Warnings as data (rulings L, M).** The three commands run with `--format json`. A run fails
   when the stdout of `workflow list` parses as JSON holding a `diagnostics` array with an item of
   severity `warning` or `error` (the latter defensive, since 0.3.0 already exits 1), or when the
   stdout of `directives list` parses as JSON holding a non-empty `warnings` array; each item is a
   reason naming it. A stdout that is not JSON, or JSON without those arrays (0.2.2's
   `{manifest, workflows}`), is judged as before; stderr lines and `Warning:` lines are judged as
   before. Tested with stub outputs: no diagnostics; a warning; an error; a `directives list`
   warning; 0.2.2's JSON shape with its tolerated stderr `format` warning; non-JSON.
4. **The report and 0.2.2 unchanged.** Report lines keep the command labels `workflow list`,
   `dna show`, `directives list` (the flag is not in them); the stub matches a command with or
   without the flag; every existing matrix, validate, publish and evidence test passes with 0.2.2's
   behaviour: its tolerated `format` warning, its exact version line.
5. **Per-release stubs and a stable fixture.** The tests install one stub per version (`install:
   (version) => …`), each answering its own version. `fixtureCompat()` builds its file from a
   frozen 0.2.2-only header rather than from the real `compat.yaml`; a test holds the header a byte
   prefix of the real `compat.yaml` (true before and after task-036, which appends). The fixture
   ranges stay `9.0.0`: the `publish`, `feedback-note`, `index`, `tag-rules` and `validate`
   (`treeRepo`) tests and `tests/fixtures/index/expected/` pass unchanged.
6. **A two-release run with stubs.** A `validate` test on a tree whose `compat.yaml` lists 0.2.2 and
   0.3.0, in self-test mode: 0.2.2 passes with its tolerance; 0.3.0's stub prints
   `0.3.0 (<hex>)` and JSON with empty `diagnostics` and `warnings`, and passes; a 0.3.0
   diagnostic of severity `warning` fails that run.
7. **A real 0.3.0 run.** After `npm run build`, with network access for the matrix to install
   0.3.0 into `.cache/wingfoil-matrix`, on a temporary copy of the golden tree
   (`tests/fixtures/compose/tree`) whose `compat.yaml` appends a 0.3.0 entry (`format_key: true`,
   reads at 1, `capabilities: [workflow-engine]`): `npm run validate -- --tree <copy>
   --param project_name=Golden` exits 0, every `wingfoil@0.3.0` line `pass (self-test)` and the
   summary `matrix: self-test, 26 runs, 0 failed, tolerance applied: 0.2.2`. The Execution Notes
   record the summary, the actual `--version` line, and one composed output's 0.3.0
   `workflow list --format json` listing `governance-evolution` with a `baseline` naming the scratch
   commit. A warning 0.3.0 raises on a fixture is fixed in the fixture (and this task's tests); one
   that needs a rule changed goes to the approver (dl-019).
8. **0.3.0's pin.** `src/matrix/wingfoil-0.3.0/package.json` mirrors 0.2.2's
   (`name: wingfoil-matrix-0.3.0`, `private`, its `description`) and pins `wingfoil` exactly to
   `0.3.0`, with its lockfile from `npm install --package-lock-only --ignore-scripts`;
   `npm run check:pins` exits 0; `(cd src/matrix/wingfoil-0.3.0 && npm audit)` reports 0
   vulnerabilities (any other result goes to the approver, dl-019). No dependency of this
   repository is added (adr-003); the CI already audits and caches every `src/matrix/wingfoil-*/`.
9. **Checks** from a clean clone on Node.js 22.21 and 22.12.0: `npm test`, `npm run lint`,
   `npm run check:pins`, `npm run check:schemas`, `npm run check:packs`,
   `npm run index -- --check` and `npm run validate` exit 0; the CI run on the pushed branch
   concludes `success`.
10. **Docs in step.** `src/matrix.ts`'s header and `pack-compatibility`'s wording name the
    `--format json` flag and rulings L and M; spec-001 is not changed by this task (task-036 amends
    §12 and O10).

## Design

Written 2026-10-21, before the build. Branch `task/task-035-matrix-wingfoil-0.3.0` from `main`.

**`src/matrix.ts`**
- `versionMatches(printed, release)`: `printed === release`, or `printed` matches
  `^<release, escaped> \((?:[0-9a-f]{7,64}(?:-dirty)?|unknown)\)$`. `runRelease` uses it; the
  failure message stays "--version printed …, not <release>" (criterion 1).
- `COMMANDS` becomes a list of `{ label, args }`: the labels `workflow list`, `dna show`,
  `directives list` (the report and the outcomes keep them, criterion 4), the arguments each
  followed by `--format json` (criterion 3).
- The scratch commit (criterion 2), after `git init`: `git add --force -- .wingfoil`, then
  `git -c user.name=wingfoil-templates-matrix -c user.email=matrix@wingfoil-templates.invalid
  commit --quiet --no-gpg-sign -m "composed .wingfoil"`, through `runGit` (its environment closes
  the system and global configuration; `--force` makes no exclude file drop a file).
- `judge(output, tolerate, wingfoilDir, label)` gains the data warnings (rulings L, M): when
  `stdout.trim()` parses as JSON, `workflow list`'s `diagnostics` items of severity `warning` or
  `error` become reasons `diagnostic <code>: <message>`, and `directives list`'s `warnings` items
  become reasons `warning: <item>`; anything else on stdout (not JSON, or no such array) is judged
  as before. The tolerance of 0.2.2's stderr `format` warning is unchanged.
- The header comment names `--format json`, the scratch commit and rulings L and M (criterion 10).

**`.wingfoil/directives/custom/pack-compatibility.md`**: the validation sentence names
`--format json` and what counts as a warning (L, M); no `version` field to bump (directives carry
none).

**Tests (red first, dl-018)**, written and committed before the code, the red counted:
- `tests/support/stub-wingfoil.ts`: the stub looks a command up with or without a trailing
  `--format json` (criterion 4); an option `snapshot` makes it write, at each command, the output
  of `git ls-tree -r --name-only HEAD` and `git status --porcelain` in its working directory to a
  file of the stub's directory, which a test reads after the run (criterion 2); a helper
  `stubsPerRelease(versions, behaviour)` returns one stub per version and an `install` function
  (criteria 5, 6).
- `tests/matrix.test.ts`: the version cases of criterion 1; the snapshot of criterion 2; the data
  warnings of criterion 3 (no diagnostics; a warning; an error; a `directives list` warning;
  0.2.2's `{manifest, workflows}` with its tolerated stderr warning; non-JSON); the labels of
  criterion 4.
- `tests/support/published-repo.ts`: `FROZEN_COMPAT` holds today's `compat.yaml` text (0.2.2 only)
  and `fixtureCompat()` appends to it; `tests/compat.test.ts` gains the check that `FROZEN_COMPAT`
  is a byte prefix of the real file (criterion 5).
- `tests/validate.test.ts`: a tree copy whose `compat.yaml` appends a 0.3.0 entry, validated with
  `stubsPerRelease(['0.2.2', '0.3.0'], …)`: both pass, 26 runs; a 0.3.0 `warning` diagnostic
  fails its run (criterion 6).

**The pin** (criterion 8): `src/matrix/wingfoil-0.3.0/package.json` as 0.2.2's, its lockfile by
`npm install --package-lock-only --ignore-scripts` in that folder, `npm audit` there.

**The real run** (criterion 7) by hand after the build, on a copy of the golden tree in the
scratchpad; its output recorded in the Execution Notes.

Red-first exceptions (dl-018): the pin (configuration), the directive and header wording
(documentation), the real run (a manual check).

## Execution Notes

- 2026-10-20: written; independent review: approve after amendments (0.2.2's JSON shape, the
  report labels and the stub keys, a two-release stub test, a complete scratch commit, the empty
  snapshot, `directives list`'s warnings, the version cases). The approver ruled M (2026-10-20):
  `directives list`'s `warnings` count. Amended.
- 2026-10-20: re-review: approve (ruling M implementable on both releases; criterion 7's summary
  line matches `src/validate.ts`); two wording nits applied. Submitted.
