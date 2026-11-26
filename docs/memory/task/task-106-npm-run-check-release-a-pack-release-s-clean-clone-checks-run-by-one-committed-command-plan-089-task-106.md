---
id: task-106-npm-run-check-release-a-pack-release-s-clean-clone-checks-run-by-one-committed-command-plan-089-task-106
type: task
title: "npm run check:release, a pack-release's clean-clone checks run by one committed command (plan-089 task-106)"
status: draft
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
`npm run publish:pack -- --pack <id> --dry-run` in a clone of its own.

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
   `package.json`). `--pack` and `--report` are required, given once; `--node` names the directory
   holding a Node.js's `node` and `npm`, given once or more, the legs in the order given; `--tree`
   defaults to the working directory and must be a repository's top level. A missing, empty or
   repeated `--pack` or `--report`, no `--node`, an unknown option: exit 3 before anything runs.
2. **The refusals,** before any clone, in this order after the arguments: `--tree` not a
   repository's top level, exit 3; the report's path inside the repository, by the rule of
   `publish:pack --report` (dl-044 P1: as written or through symbolic links, a dangling link
   refused), exit 3, one line naming the path and dl-054; a working tree not clean (`git status
   --porcelain` not empty), exit 1; a `--node` directory with no `node` in it, exit 3; no
   `.cache/wingfoil-matrix` in the tree, exit 1. None writes a report but the dirty tree's and the
   missing cache's, which the report's file, created after the path check, receives. The rule is
   one function both commands use (`publish:pack`'s behaviour and tests unchanged).
3. **The runs.** For each leg, in order: a clone of the tree's `HEAD` into a new temporary
   directory outside the tree, its remote removed, the matrix cache copied into its `.cache/`; then
   the list in the order of the Context, each command run in the clone with the leg's directory
   first on `PATH`; on the first leg, `validate:publication -- --evidence` right after `npm run
   build`. After the first leg's list, the dry run: a second clone as above, `npm ci`, `npm run
   build`, `npm run publish:pack -- --pack <id> --dry-run`. The run stops at the first non-zero
   exit; the clones are removed at the end, on a failure too. The tree's working tree, `HEAD`,
   branches and tags are as before the run.
4. **The report,** written to the path on every exit after its creation, and its lines printed:
   the tree's commit (`HEAD`, full) and the pack; per leg, `node --version` and `npm --version`,
   then one line per command (the command as run, its directory when not the clone's root, its
   exit code), followed by its counts' lines: for `npm test`, its `# tests`, `# pass` and `# fail`
   lines; for every other command, its last non-empty output line; and per leg, after the list,
   `git status --short`'s line count in the clone. The last line is `check:release: pass` or
   `check:release: fail at <command> (exit <n>)`. The exit code is 0 on a pass, 1 when a command of
   the list fails, 2 on an I/O or git error of the command itself.
5. **Red first** (dl-018). Before criteria 1 … 4 are built, new tests in
   `tests/check-release.test.ts` fail and the red run's command and failing count are recorded.
   They run `src/check-release.ts` with an injected runner (no real clone, install or WingFoil in
   `npm test`) and cover: the commands and their order on one leg and on two, the first leg's
   evidence right after the build and its dry run in a clone of its own; the golden step's and the
   overlays' exact arguments; the audits in each `src/matrix/wingfoil-*/` of the clone, not
   `.cache/`; each leg's `PATH`; the stop at the first non-zero exit, the failing command named; the
   report written on a pass and on a failure, with the fields of criterion 4; each refusal of
   criteria 1 and 2 (the report's path relative, absolute, through `..` and through a symbolic link
   inside the repository; a dirty tree; a missing cache; a `--node` with no `node`); the clones
   removed and the tree unchanged after a pass and after a failure, on a test repository.
6. **The rehearsal** (plan-089 ruling 3), on the frozen commit, before `in-review`: from a local
   commit on a scratch branch over it, never pushed, that gives `governance/wingfoil-dogfood`
   the version 1.0.1 (`pack.yaml`, and `- 1.0.1: …` as the CHANGELOG's first entry; no change to
   `catalog.yaml` or the index); `npm run check:release -- --pack governance/wingfoil-dogfood
   --report <path outside> --node <22.21.0> --node <22.12.0>` exits 0; the report's lines in this
   task's notes, its commit the scratch commit and its parent the frozen commit, both recorded; the
   scratch branch deleted after the run.
7. **The rest unchanged.** The diff from the plan's branch touches only `src/check-release.ts`,
   `src/check-release-cli.ts`, the shared report-path module and `src/publish.ts`'s use of it,
   `package.json`'s `scripts`, `tests/check-release.test.ts`, this task and plan-089. No dependency
   is added (`package-lock.json` unchanged). `npm test`, `lint` and the other checks of the CI pass,
   read from the branch CI's jobs and dl-039's local list (criterion 8), not run a second time;
   `npm run check:texts -- --base origin/main` exits 0 on the task's branch.
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

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
