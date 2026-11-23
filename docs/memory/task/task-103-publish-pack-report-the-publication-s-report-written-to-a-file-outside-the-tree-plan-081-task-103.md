---
id: task-103-publish-pack-report-the-publication-s-report-written-to-a-file-outside-the-tree-plan-081-task-103
type: task
title: "publish:pack --report, the publication's report written to a file outside the tree (plan-081 task-103)"
status: approved
pack: ""            # tooling task (tooling-delivery v5), plan-081 task-103
depends_on: []
tags: ["tooling","publication","pack-release"]
---

## Context

plan-081 hosts this task (row 4 of its Steps, point 3 of its outline, ruled on 2026-11-23). It is a
tooling task under `tooling-delivery` v5, and it comes before `pack-release-cycle` 9 (row 6), whose
`publish` phase has the approver run `publish:pack` with `--report` and the agent read the report.

**Why.** dl-044 (approved 2026-11-22) P1: `publish:pack` takes `--report <path>` and writes the
report it prints (the validation's lines and the publication matrix's summary, the line, the tag
and its commit, the catalog commit, the digest, the transitions' digests, the range, "Not pushed")
to that file, on a non-zero exit too, so that a failure's reason reaches the record; it refuses a
path inside the repository, so the tree stays clean. The agent then records those values in the
pack-release's Publication and checks the digest and the range against the Validation's dry run.
Today the report reaches only the approver's shell (prel-007 › Execution Notes, `publish`).

**What exists today** (the plan's branch at `5f767b16`):
- `src/publish.ts`: `runPublish(argv, options)` returns `{ code, lines }`; the CLI
  (`src/publish-cli.ts`) prints the lines on standard output and exits with the code (0, 1 a
  check, 2 an I/O or git error, 3 bad usage). A failure's lines are the lines printed before it and
  its message (`PublishError.before`). `--dry-run` works in a temporary clone of the repository.
- `parse` reads the options with `node:util`'s `parseArgs`, `strict: true`; then
  `checkRepository` refuses a `--tree` that is not a repository's top level (exit 3) and a working
  tree not clean (exit 1). A failure after the tag removes it and resets the branch.
- `tests/publish.test.ts` runs `runPublish` on test repositories with a stub WingFoil.

## Acceptance

`npm run build` precedes the commands.

1. **The option.** `npm run publish:pack -- --pack <id> --report <path> …` (with or without
   `--dry-run`) writes to `<path>` exactly the lines the command prints on standard output, in
   their order, each followed by `\n`, whatever the exit code once the file exists (criterion 2):
   0, a check's 1 (a working tree not clean, the validation failed, the tag exists, …), a failure
   after the tag and its rollback (1 or 2), or a git error's 2. The lines printed and the exit code
   are those of the same run without `--report`, except as criterion 2 says of a final write that
   fails. `runPublish` writes the file; `PublishResult` is unchanged and
   the CLI only prints. Without `--report`, nothing changes. Out of scope: an exception
   `runPublish` does not catch today (neither `PublishError`, `GitError` nor `DigestError`), which
   stays a crash, and the CLI's own refusal of npm's `--dry-run` (exit 3 before `runPublish`), which
   writes no file.
2. **The path, and the order of the checks.** In this order, before anything else runs: the
   arguments parsed; the top level of the repository `--tree` names read (`git rev-parse
   --show-toplevel`, today's check that `--tree` is that top level kept); `<path>` checked; the
   file created (or emptied); then the clean-tree check and the rest, as today. `<path>` is resolved
   against the working directory and is inside the repository, at any depth and ignored or not
   (`.cache/` included), when it is inside its top level, or inside `--tree` as given (resolved
   against the working directory), as written or, with symbolic links resolved, the path itself
   when it exists, otherwise its parent directory when that exists (a link to a file or to a
   directory inside the repository counts as inside). A path that is itself a symbolic link
   (`lstat`) whose target does not exist is refused, exit 3. Inside is exit 3, one line naming the
   path and dl-044. A directory that does not exist or cannot be written, when the
   path is not inside, is exit 2 with the I/O error. Every exit 3 (usage, not a repository, not its
   top level, a path inside) and that exit 2 write no file and make no tag and no commit. An
   existing file is overwritten; at the end it is written by its path, not through a descriptor kept
   open since its creation. If the final write fails after the file was created (a tag and a
   commit possibly made), nothing is undone: the lines are printed as without `--report`, then one
   line naming the path and the write error, and the exit code is 2 when it would have been 0,
   otherwise unchanged.
3. **Usage.** An empty `--report` value, or `--report` given twice, is a usage error, exit 3,
   before anything runs (`parseArgs` in strict mode keeps the last of two values: the option is read
   with `multiple: true` and more than one value refused). `--report` with no value is already a
   usage error of strict mode. The header comment of `src/publish-cli.ts` names the option.
4. **Red first** (dl-018). Before criteria 1 … 3 are built, new tests in `tests/publish.test.ts`
   fail and the red run's command and failing count are recorded. They cover: a publication's report
   equal to its printed lines (the Publication section's lines included); a dry run's; a failed dry
   run's (no "Dry run: done" line, as printed); a failed validation's (exit 1, the validation's
   lines and the failure's message in the file); an existing tag's (exit 1); a working tree not
   clean (exit 1, the file written); a failure after the tag (the tag removed, the branch reset, the
   earlier lines and the message in the file), on the existing rollback fixture; a path inside the
   repository refused, given relative, absolute, through `..`, under an ignored directory, through a
   symbolic link to a directory inside it, as an existing symbolic link to a file inside it, and as
   a dangling symbolic link, each with no file written and no tag; a missing directory (exit 2, no
   tag); a final write that fails after the file was created (the publication kept, the extra line,
   exit 2; for instance the stub's `install` replacing the file with a directory during the
   validation); an existing file overwritten; an empty value, the option twice and the option with
   no value; no `--report`, unchanged output.
5. **The rest unchanged.** The diff from the plan's branch touches only `src/publish.ts`,
   `src/publish-cli.ts`, `tests/publish.test.ts`, this task and plan-081. No dependency is added
   (`package-lock.json` unchanged). `npm test`, `lint` and the other checks of the CI pass, read
   from the branch CI's jobs and dl-039's local list (criterion 6), not run a second time;
   `npm run check:texts -- --base origin/main` exits 0 on the task's branch.
6. **dl-039's checks** on the frozen commit: the branch CI once, every job's duration recorded, and
   the local list on Node.js 22.21.0 from a clean tree after `npm ci` and the build.
7. **Delivery** (plan-081 ruling 3). The branch `task/task-103-…` from plan-081's branch, in a
   worktree; the privacy check of the diff recorded (`repository-practice` rule 2); on the
   approver's OK the merge `--no-ff` into plan-081's branch, a departure from `deliver` ("into
   main") recorded here, task-102 and plan-062's task as precedents. The task stays `approved`.
8. **The check on `main`** (dl-045, `tooling-delivery` v5 `deliver`): none beyond `main`'s CI.
   After plan-081's merge into `main` is pushed, `main`'s CI on it read `success`, the run id
   recorded here and in plan-081; then the close commit and `approved → done`. A red check stops
   the close: the task stays `approved`, the finding goes to the approver, and its fix is a task or
   a bug of its own.

## Design

**Shape.** `runPublish` becomes three steps: the arguments and the repository's top level (today's
`checkRepository` split in two: `topLevel`, its exit 3 checks, and `checkClean`, its exit 1); then,
with `--report`, the path checked and the file created; then today's body, unchanged, returning
`{ code, lines }`, whose lines are written to the file before `runPublish` returns them. `parse`
reads `report` with `multiple: true`, refusing an empty value or two.

**The path check** (`reportPath`). The path resolved against the working directory; the roots: the
top level, `--tree` as given (resolved), and both with links resolved (`realpathSync`). Inside when
the path, as written, is a root or under one; else, when `lstat` finds a symbolic link whose target
does not exist, refused as dangling; else the path with links resolved (itself if it exists, its
parent's real path and its name if the parent exists) checked against the roots again. Each refusal
a `PublishError(3, …)` naming the path and dl-044.

**The writes.** The creation `writeFileSync(path, '')`, an error being `PublishError(2, …)`; the
final write by path, `writeFileSync(path, lines joined with \n, plus a final \n)`, its error
appending one line (`--report <path>: the report could not be written: <message>`) and turning a 0
into 2.

**Red steps.** (1) The tests of criterion 4 in `tests/publish.test.ts`, against today's code: the
option is unknown to strict mode, so every `--report` case fails (exit 3). (2) `parse`, the split,
the path check and the writes, until they pass; the header comment of `src/publish-cli.ts`.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-23: independent review of the body (dl-017, `1e6326fd`): approve after amendments; no
  blocker, six should-fix (a final write that fails after the tag; the write in `runPublish`; the
  order of the checks and every exit 3 without a file; a symbolic link at the file itself; a
  missing directory inside the repository; the missing cases: a failure after the tag, a tree not
  clean, a failed dry run, an ignored path) and five nits (`--report` twice under strict mode; the
  CLI's own refusal; `src/publish-cli.ts` beside row 4's files; the exceptions out of scope; the
  README needing no change), all applied but the last, which needs none; `src/publish-cli.ts`, for
  its header comment, read as within row 4 (`src/publish.ts`, `tests/`) and named when the row is
  recorded.
- 2026-11-23: re-review of the amendments (`3e282a0d`): approve after one should-fix (a dangling
  symbolic link at the path, whose create would follow it into the repository: refused, exit 3,
  and tested) and four nits (a failure after the tag 1 or 2; the final write by path, so that its
  failure can be tested; criterion 1's exception named; `--tree` as given compared too), all
  applied.
- 2026-11-23: design (`5282d0d7`), then `backlog → in-progress` on `task/task-103-…`, from
  plan-081's branch at `c790cf25`, in a worktree.
- 2026-11-23: red (dl-018), `97c6654f`, against today's code: `npm run build && node --test
  dist/tests/publish.test.js`, 9 failing of 38. The tenth new test (an empty value, the option
  twice, the option without a value: exit 3) already passed, strict mode refusing the unknown
  option; it pins that the option, once known, keeps those cases usage errors.
- 2026-11-23: green: `parse` with `report` (`multiple: true`), `checkRepository` split into
  `topLevel` and `checkClean`, `reportPath`, `createReport` and `writeReport`, `runPublish`
  wrapping today's body (`publishChecked`); 38 of 38, `npm run lint` exit 0; the header comment of
  `src/publish-cli.ts`.
- 2026-11-23: independent review of the build (dl-017, `1d1e1c52`): approve after one should-fix;
  red first verified (9 failing of 38 rebuilt from `97c6654f`); no blocker; one should-fix and six
  nits. Applied: the failure-after-the-tag test asserts the tag removed and the branch reset (the
  state and `main` unchanged), not only the message; the doc comment names the lexical
  normalisation of the path; the real paths by `realpathSync.native`, for a case-insensitive
  filesystem; every message names the path as given; one `failure` helper for both catches;
  `topLevel`'s comment; a test of `--tree` given through a symbolic link. Not applied: the final
  write's failure test comparing its earlier lines with a run without `--report`, since a second
  publication's tag and commit differ; that the lines are the run's own is pinned by the other
  tests. These amendments strengthen tests and refactor without a new behaviour, so no red run;
  39 of 39, `npm run lint` exit 0.
- 2026-11-23: re-review of the amendments (`a45a079f`): approve; the rollback test confirmed to
  catch a tag or a branch left behind; `realpathSync.native` with no regression on Linux, every
  earlier probe the same; the `failure` helper equivalent for both callers; the nit not applied
  agreed. Two nits, both applied: the `--tree`-symlink test given a path under a missing directory
  of `--tree` as given, the one case only that root refuses; the report's path and given form kept
  together in `runPublish`, so no condition is tested twice. 39 of 39, `npm run lint` exit 0.
- 2026-11-23: dl-039's checks on `4325a9fb`, the frozen code. The branch CI, run 45229832511:
  `success`; jobs (22.12.0, 1) 9 min 54 s, (22.21.0, 1) 9 min 43 s, (22.12.0, 2) 5 min 48 s,
  (22.21.0, 2) 5 min 52 s, none over 25 minutes; its "Texts, the lines this branch adds" step
  `success`. Locally, Node.js 22.21.0, a clean tree on `4325a9fb`: `npm ci`, `npm run build`,
  `npm run validate:publication` (28 runs, 0 failed), the golden tree in publication mode (26 runs,
  0 failed) and `npm run -s wingfoil -- workflow list`, each exit 0; the tree clean after them. The
  diff from plan-081's branch touches only criterion 5's files and `package-lock.json` is
  unchanged; the privacy check of the diff (`repository-practice` rule 2): no local path, no name
  outside this repository. This note is documentation only: no new run.
- 2026-11-23: accepted by the approver (`in-review → approved`, `e5be8033`); on the approver's OK,
  merged with `--no-ff` into plan-081's branch (`7a38f98e`), as ruled by plan-081 (ruling 3); on
  the merge, after the build, `tests/publish.test.ts` and `tests/check-texts.test.ts` 83 of 83
  (Node.js 24.22.3, the local default). It stays `approved` until its check on `main`
  (criterion 8).
