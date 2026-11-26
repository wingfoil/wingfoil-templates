---
id: task-106-npm-run-check-release-a-pack-release-s-clean-clone-checks-run-by-one-committed-command-plan-089-task-106
type: task
title: "npm run check:release, a pack-release's clean-clone checks run by one committed command (plan-089 task-106)"
status: in-progress
pack: ""            # tooling task (tooling-delivery v5), plan-089 task-106
depends_on: []
tags: ["tooling","pack-release","validation"]
---

## Context

plan-089 hosts this task (row 1 of its Steps, points 2 and 3 of its outline, ruled on
2026-11-26). It is a tooling task under `tooling-delivery` v5, and it comes before
`pack-release-cycle` 10 (row 2), whose `validate` phase names the command.

**Why.** dl-054 (approved 2026-11-26) P1: `npm run check:release` runs a pack-release's
clean-clone list in its order, stops at the first non-zero exit and says which, writes its report
on a non-zero exit too, refuses a report path inside the repository and a dirty tree, and leaves
the working tree as it was; the agent runs it at `validate` and records the report's lines in the
Validation. Today the list is in the records only (prel-007, prel-008 › Validation) and is written
as a script for each release, outside the repository; at prel-008 its first pass ran
`validate:publication -- --evidence` before the build and audited the local matrix cache instead
of `src/matrix/wingfoil-*/`, and at task-100 a list written per run ran the golden step in the
wrong mode first (dl-054 › Context).

**The list** (dl-054 › Context, Option 2), from a clone of the tree's `HEAD` outside the tree,
its remote removed, the WingFoil matrix cache copied from the tree (`.cache/wingfoil-matrix`):
`npm ci`; `npm run build`; `npm test`; `npm run lint`; `npm run check:pins`; `npm run
check:schemas`; `npm run check:packs`; `npm run index -- --check`; `npm run validate`; the golden
step `npm run validate -- --tree tests/fixtures/compose/tree --param project_name=Golden`; the four
overlays `npm run validate -- --overlay tests/fixtures/<x>` for `software-exit`, `scrum-exit`,
`kanban-exit` and `feedback-exit`; `npm run -s wingfoil -- workflow list`; `npm run check:runs`;
`npm audit --omit=dev` in the root; `npm audit` in each `src/matrix/wingfoil-*/`; on each Node.js
given. On the first only: `npm run validate:publication -- --evidence` after the build, and
`npm run publish:pack -- --pack <id> --dry-run` in a clone of its own. The commands are written
as the records wrote them.

**What exists today** (the plan's branch at `8dc1485c`):
- `src/publish.ts`: `reportPath` (not exported) refuses a report path inside the repository, as
  written or through symbolic links, and a dangling link (dl-044 P1), with `within`; its tests in
  `tests/publish.test.ts`.
- `src/git.ts`: `runGit`, `gitEnvironment`; the CLIs are `src/*-cli.ts` over a module that returns
  `{ code, lines }` (`runPublish`), exit codes 0, 1 a check, 2 an I/O or git error, 3 bad usage.
- No command clones the tree and runs the list; the CI runs most of it per job, not in one place.

## Acceptance

`npm run build` precedes the commands.
1. **The command.** `npm run check:release -- --pack <id> --report <path> --node <bin> [--node
   <bin> …] [--tree <dir>]` (`src/check-release-cli.ts` over `src/check-release.ts`, the script in
   `package.json`, one line in README.md's main commands). `--pack` and `--report` are required,
   given once; `--node` names the directory holding a Node.js's `node` and `npm`, given once or
   more, the legs in the order given; `--tree` defaults to the working directory and must be a
   repository's top level (a linked worktree's included). A missing, empty or repeated `--pack` or
   `--report`, no `--node`, an unknown option: exit 3 before anything runs.
2. **The refusals,** before any clone, in this order after the arguments: `--tree` not a
   repository's top level, exit 3; a `--node` directory with no `node` or no `npm` in it, exit 3;
   the report's path inside the repository, by the rule of `publish:pack --report` (dl-044 P1: as
   written or through symbolic links, a dangling link refused), exit 3, one line naming the path,
   dl-044 and dl-054; then the report's file created (a failure to create it, exit 2, one line, no
   report); a working tree not clean (`git status --porcelain` not empty), exit 1; no
   `.cache/wingfoil-matrix` in the tree, exit 1 (the records always copied it; without it the matrix
   would install the releases from the network). Only the last two write a report. The rule of the
   path moves, with `within`, to a module that throws a neutral error carrying the path;
   `publish:pack` maps it to today's `PublishError`, its lines and exit codes byte-identical,
   `tests/publish.test.ts` not in the diff.
3. **The runs.** For each leg, in order: a clone of the tree (`git clone --no-local`, on the tree's
   branch when its `HEAD` is not detached, as `publish:pack --dry-run` does) into a new temporary
   directory outside the tree, its `HEAD` checked equal to the tree's `HEAD`, a local `main` made
   from `origin/main` when it has none, every tag kept, then its remote removed, the tree's matrix
   cache copied into its `.cache/` (the same cache for every leg); then the list in the order of the
   Context, each command run in the clone with the leg's directory first on `PATH` and
   `npm_config_update_notifier=false` in its environment; on the first leg,
   `validate:publication -- --evidence` right after `npm run build`. After the first leg's list, the
   dry run: a second clone as above, `npm ci`, `npm run build`,
   `npm run publish:pack -- --pack <id> --dry-run` (`publish:pack` clones again, and its matrix
   installs into that clone). Each command's output (its standard output and standard error) is
   streamed to the terminal as it runs and kept in full for the report, with no size limit and no
   timeout. The run stops at the first non-zero exit or the first command ended by a signal; the
   clones are removed at the end, on a failure too. The tree's working tree, `HEAD`, branches and
   tags are as before the run.
4. **The report,** written to the path on every exit after its creation, and its lines printed: the
   tree's commit (`HEAD`, full) and the pack; per leg, `node --version` and `npm --version`, then
   one line per command (the command as run, its directory when not the clone's root, its exit
   code), followed by its counts' lines, read from its output (standard output and standard error):
   for `npm test`, its `# tests`, `# pass` and `# fail` lines (the TAP reporter's, its output not a
   terminal); for `validate:publication -- --evidence`, the whole `## Validation` section it prints;
   for every other command, its last non-empty line, standard output's if it has one, else standard
   error's, not counting npm's run header (`> <package>@<version> <script>` and `> <command>`,
   absent with `-s`) nor npm's `npm warn` and `npm notice` lines, or `(no output)`; and per leg,
   after the list, `git status --short`'s line count in the clone. The last line is
   `check:release: pass`, `check:release: fail at <command> (exit <n>)` or
   `check:release: fail at <command> (signal <name>)`. The exit code is 0 on a pass, 1 when a
   command of the list fails or is ended by a signal, 2 on an I/O or git error of the command
   itself. If the report's final write fails, one line names the I/O error and a 0 becomes a 2 (a 1
   stays a 1); a clone that cannot be removed is named in a line, and a 0 becomes a 2.
5. **Red first** (dl-018). Before criteria 1 … 4 are built, new tests in
   `tests/check-release.test.ts` fail and the red run's command and failing count are recorded. No
   real install, no network and no WingFoil in `npm test`: git runs for real on a small test
   repository the test makes (as in `tests/publish.test.ts`), and an injected runner replaces every
   `npm` and `node` command. They cover: the commands and their order on one leg and on two, the
   first leg's evidence right after the build and its dry run in a clone of its own; the golden
   step's and the overlays' exact arguments; the audits in each `src/matrix/wingfoil-*/` of the
   clone, not `.cache/`; each leg's `PATH`; the clone at the tree's `HEAD` on the tree's branch,
   with a local `main`, every tag and no remote; the stop at the first non-zero exit and at a
   signal, the failing command named; the report written on a pass and on a failure, with the fields
   of criterion 4, a command with no output, one with npm's run header and one without (`-s`), one
   whose last line is an `npm notice`, and the evidence's section included; a failing final write; a
   clone that cannot be removed; a report that cannot be created; each refusal of criteria 1 and 2
   (the report's path relative, absolute, through `..` and through a symbolic link inside the
   repository; a dirty tree; a missing cache; a `--node` with no `node`, and one with no `npm`), the
   report written only where criterion 2 says; the clones removed and the tree unchanged after a
   pass and after a failure.
6. **The rehearsal** (plan-089 ruling 3), on the frozen commit, before `in-review`, the task
   worktree's `.cache/wingfoil-matrix` populated first by criterion 8's local list: from a local
   commit on a scratch branch over it, never pushed, that gives `governance/wingfoil-dogfood` the
   version 1.0.1 (`pack.yaml`, and `- 1.0.1: …` as the CHANGELOG's first entry; no change to
   `catalog.yaml` or the index); `npm run check:release -- --pack governance/wingfoil-dogfood
   --report <a path outside the repository> --node <the directory of Node.js 22.21.0> --node <the
   directory of Node.js 22.12.0>` exits 0; the report's lines in this task's notes, its commit the
   scratch commit and its parent the frozen commit, both recorded; the scratch branch deleted after
   the run.
7. **The rest unchanged.** The diff from the plan's branch touches only `src/check-release.ts`,
   `src/check-release-cli.ts`, the shared report-path module and `src/publish.ts`'s use of it,
   `package.json`'s `scripts`, README.md's main commands, `tests/check-release.test.ts`, this task
   and plan-089. No dependency is added (`package-lock.json` unchanged). `npm test`, `lint` and the
   other checks of the CI pass, read from the branch CI's jobs and dl-039's local list (criterion
   8), not run a second time; `npm run check:texts -- --base origin/main` exits 0 on the task's
   branch.
8. **dl-039's checks** on the frozen commit: the branch CI once, every job's duration recorded, and
   the local list on Node.js 22.21.0 from a clean tree after `npm ci` and the build.
9. **Delivery** (plan-089 ruling 2). The branch `task/task-106-…` from plan-089's branch, in a
   worktree; the privacy check of the diff recorded (`repository-practice` rule 2); on the
   approver's OK the merge `--no-ff` into plan-089's branch, a departure from `deliver` ("into
   main") recorded here, task-102 and task-103 as precedents. The task stays `approved`.
10. **The check on `main`** (dl-045, `tooling-delivery` v5 `deliver`): none beyond `main`'s CI (the
    command runs at a release, not in CI). After plan-089's merge into `main` is pushed, `main`'s
    CI on it read `success`, the run id recorded here and in plan-089; then the close commit and
    `approved → done`, pushed with plan-089's close (ruling 7). A red check stops the close: the
    task stays `approved`, the finding goes to the approver, and its fix is a task or a bug of its
    own.

## Design

- **`src/report-path.ts`** (new): `within(path, roots)` and `checkReportPath(report, top, tree)`,
  moved from `src/publish.ts` unchanged in behaviour; a refusal throws `ReportPathError` with its
  `kind` (`inside` or `dangling`) and the path; `publish.ts` catches it and throws today's
  `PublishError(3, …)` with today's two messages, so `tests/publish.test.ts` holds as it is.
- **`src/check-release.ts`** (new): `runCheckRelease(argv, options)`, async, returning `{ code,
  lines }`; `options.runner` runs one command (`(program, args, { cwd, env }) =>
  Promise<{ code, signal, stdout, stderr }>`), by default a `spawn` that streams both streams to
  the terminal and keeps them; `options.write` and `options.remove` (default `writeFileSync` and
  `rmSync`) let the tests make the final write and the clean-up fail. In order: `parse`
  (`parseArgs`, strict; `--node` and the others `multiple`, counted) → `topLevel` → each `--node`
  holds `node` and `npm` → `checkReportPath` → the report created → the clean tree → the cache;
  then the legs and the dry run; the report written; the clones removed.
- **The clone** (`cloneAt`): `git clone --quiet --no-local [--branch <tree's branch>]` into
  `<tmp>/leg-<n>` or `<tmp>/dry-run`; a detached tree's `HEAD` checked out `--detach`; its `HEAD`
  compared with the tree's (a difference is a git error, exit 2); a local `main` from
  `origin/main` when it has none; `git remote remove origin`; the cache copied with `cpSync`.
  Git through `src/git.ts`'s `runGit`, so the tooling's isolated environment.
- **The commands**, each with `program` the leg's `<bin>/npm` (or `<bin>/node` for `--version`),
  `PATH` the leg's directory then the caller's, `npm_config_update_notifier=false`: the Context's
  list; the audits over the clone's `src/matrix/` entries named `wingfoil-*` that are directories,
  sorted. The report shows each as `npm …`, its directory relative to the clone.
- **The counts' lines** (`countsOf(command, outcome)`): `npm test`, the lines `# tests`, `# pass`,
  `# fail` of standard output; the evidence, standard output from `## Validation` to its end; any
  other, the last line of standard output, else of standard error, among those not empty, not
  starting with `> ` and not starting with `npm warn` or `npm notice` (any case); else `(no
  output)`. Each written indented under its command.
- **`src/check-release-cli.ts`**: awaits the run, prints the lines, sets the exit code;
  `package.json` `"check:release": "node dist/src/check-release-cli.js"`; README.md one line.

Red steps (dl-018): 1. `tests/check-release.test.ts` with the cases of criterion 5 against a stub
`src/check-release.ts` exporting `runCheckRelease` that returns `{ code: 99, lines: [] }`, and
`tests/report-path.test.ts` against the shared module's stub: red; 2. the shared module, publish's
use of it, `tests/publish.test.ts` green; 3. the command: green; 4. the CLI, the script and README.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-26: independent review of the body (dl-017, `f88fec22`): approve after amendments; no
  blocker, seven should-fix (a full clone with every tag, at the tree's `HEAD`; the `--node`
  check, with `npm`, before the report's path; the counts' lines read from both streams after
  npm's header, `(no output)`, the evidence's section, the TAP lines; output streamed and kept in
  full, a signal a failure, no timeout; the final write's and the clean-up's failures; the shared
  module's neutral error, `publish:pack` byte-identical; criterion 5's real git on a test
  repository and its new cases) and five nits (the cache's reason and its one copy; criterion 6's
  placeholders and the cache populated first; the dry run's own clone; the Context's commands as
  the records wrote them; README.md's line), all applied in the commit that records this note.
- 2026-11-26: re-review (dl-017, `921c2687`), the amendments having changed behaviour: approve
  after amendments; no blocker, two should-fix (the clone on the tree's branch with a local
  `main`, as `publish:pack --dry-run` reads them; the counts' line read from standard output
  first, npm's run header and its `warn` and `notice` lines not counted, the update notifier
  off) and three nits (the report's file that cannot be created; a clone that cannot be removed
  among the tests; dl-044 named beside dl-054 in the path's refusal), all applied in the commit
  that records this note.
- 2026-11-26: accepted into the backlog by the approver (`c9fbdd37`); the Design (`dc727805`'s
  parent); `backlog → in-progress` (`dc727805`).
- 2026-11-26: red run (dl-018), `18e3b0cd`: `node --test --test-reporter=tap
  dist/tests/check-release.test.js dist/tests/report-path.test.js` on the stubs, 15 tests, 15
  failing. Then the shared module and `publish.ts`'s use of it, the command, the CLI, the script and
  README.md's line (`8adc93f7`): the same run 15 of 15 passing. One test corrected on the way,
  before the build passed it: the clone test deleted the tree's `main`, so no `origin/main` could
  give the clone its local `main`; the tree keeps `main` and the clone is made on another branch,
  as criterion 3 asks (the assertion unchanged).
- 2026-11-26: `npm test` on `8adc93f7` (Node.js 24 of the developer's shell): 1519 tests, 1519
  passing, exit 0; `lint` exit 0. Node.js 24 prints the spec reporter's `ℹ tests` lines into a
  file too; the legs' Node.js 22 print TAP when not on a terminal (criterion 4), which the
  rehearsal (criterion 6) shows.
- 2026-11-26: independent review of the build (dl-017, `a7dd7332`): approve after amendments; no
  blocker, three should-fix (`--tree` and `--node` resolved, so that relative ones run; the
  scratch directory's removal guarded; the commit and pack line before the tree's checks, and the
  reading below) and six nits (the leg named on a version's failure, with its output; one
  formatting of how a command ended; a command that could not start named; a test of a detached
  tree; the spec reporter's `ℹ` lines of a later Node.js read too; a multi-line message split
  into lines), all applied in the commit that records this note, with five tests: 20 of 20
  passing. Red first checked: the one test corrected after the red run accepted.
- 2026-11-26: reading of criterion 4 (dl-019), the Acceptance text unchanged: its three last
  lines describe a run of the list; a refusal (a dirty tree, a missing cache) or an I/O or git
  error after the report's creation ends the report with its own line, its exit code as criteria
  2 and 4 give it. The `ℹ` lines are read as `npm test`'s counts' lines when no `#` line is
  printed (a Node.js after 22), so that a later leg's report is not empty there.
- 2026-11-26: re-review (dl-017, `69888299`): approve after amendments; one blocker (the reading
  of criterion 4 above needs the approver's ruling, criteria 2 and 4 not holding together as
  written, dl-019 R1 … R3), one should-fix (a dirty tree's report ended with its last status
  entry, not with the refusal's line: the entries now come first, then "the working tree is not
  clean (N entries)", asserted by the test) and four nits (the status entries untrimmed; the
  refused tree's report file checked; four test lines over 100 characters, not applied: the
  rule is the Markdown prose's, and 51 lines of `src/` and `tests/publish.test.ts` are longer;
  `tests/report-path.test.ts` outside criterion 7's list, a departure: it tests the shared module
  that criterion names), applied in the commit that records this note but the third. The note
  above's claim that a refusal ends the report with its own line was false for a dirty tree
  until this commit (rule 6). The blocker goes to the approver: the reading as a ruling.
- 2026-11-26: the approver's ruling (dl-019 R2), in chat: "sì, approvo la lettura". Criterion 4's
  three last lines describe a run of the list; a refusal (a dirty tree, a missing cache) or an I/O
  or git error after the report's creation ends the report with its own line, exit 1 for a
  refusal and 2 for an error, as criteria 2 and 4 give them; the `ℹ` lines count as `npm test`'s
  counts' lines when no `#` line is printed. The Acceptance text stays as approved.
- 2026-11-26: the frozen commit `5c3bc544` (the code at `29e9b9c6`, then this ruling's note).
  The rehearsal (criterion 6), from the scratch commit `154a4ae4` over it (`pack.yaml` 1.0.1 and
  `- 1.0.1: a rehearsal of check:release, never published.` as the CHANGELOG's first entry; no
  other file), never pushed: `npm run check:release -- --pack governance/wingfoil-dogfood --report
  <a path outside> --node <Node.js 22.21.0> --node <Node.js 22.12.0>` exit 0, its report's lines:
  - `check:release (dl-054): commit 154a4ae4660aed68039e4db3ab5f560414e75260, pack
    governance/wingfoil-dogfood`;
  - leg 1, node v22.21.0, npm 11.6.2: `npm ci` exit 0 ("found 0 vulnerabilities"); the build
    exit 0; `validate:publication -- --evidence` exit 0, its Validation section (the commit
    above, mode publication, 16 compositions composed twice byte-identical, "matrix:
    publication, 32 runs, 0 failed, tolerance applied: none"); `npm test` exit 0, "# tests 1524",
    "# pass 1524", "# fail 0"; `lint`, `check:pins` exit 0 (no output); `check:schemas` exit 0
    ("checked 10 files"); `check:packs` exit 0 ("lint: checked 101 files, 0 problems"); `index --
    --check` exit 0 ("index: checked 9 files, 0 not up to date"); `validate` exit 0 ("matrix:
    self-test, 32 runs, 0 failed"); the golden step exit 0 ("26 runs, 0 failed, tolerance
    applied: 0.2.2"); the four overlays exit 0 (40, 40, 40 and 48 runs, 0 failed); `workflow
    list` exit 0; `check:runs` exit 0 ("runs: 92 runs, 0 failed"); `npm audit --omit=dev` and the
    audits of `src/matrix/wingfoil-0.2.2`, `-0.3.0`, `-0.3.1`, `-0.3.2` exit 0 ("found 0
    vulnerabilities"); `git status --short`, 0 lines;
  - the dry run, node v22.21.0: `npm ci`, the build and `publish:pack -- --pack
    governance/wingfoil-dogfood --dry-run` exit 0;
  - leg 2, node v22.12.0, npm 10.9.0: the same list, each exit 0, with the same counts' lines;
    `git status --short`, 0 lines;
  - `check:release: pass`.
  The report's commit is the scratch commit, its parent the frozen commit `5c3bc544`. After the
  run the tree was clean and no clone was left; the scratch branch deleted. Two counts' lines say
  little, the rule followed as written: `workflow list`'s is `}` (it prints JSON) and the dry
  run's is "- Not pushed: …".
- 2026-11-26: dl-039's checks on `5c3bc544` (criterion 8). The branch CI, run 45826368002
  `success`, its jobs (22.12.0, 1) 12 min 13 s, (22.21.0, 1) 12 min 6 s, (22.12.0, 2) 6 min 50 s,
  (22.21.0, 2) 4 min 29 s, the step "Texts, the lines this branch adds" `success`. The local list
  on Node.js 22.21.0 from a clean tree: `npm ci`, the build, `npm test` (1524 tests, 1524
  passing), `lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`,
  `validate`, `check:runs`, `check:texts -- --base origin/main`, each exit 0, the tree clean
  after. The privacy check of the task's diff and commit messages: clean. This note's commit is
  documentation only and needs no new run (dl-039 R2).
