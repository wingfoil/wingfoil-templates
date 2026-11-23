---
id: task-103-publish-pack-report-the-publication-s-report-written-to-a-file-outside-the-tree-plan-081-task-103
type: task
title: "publish:pack --report, the publication's report written to a file outside the tree (plan-081 task-103)"
status: draft
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
- `parse` reads the options with `node:util`'s `parseArgs`, `strict: true`.
- `tests/publish.test.ts` runs `runPublish` on test repositories with a stub WingFoil.

## Acceptance

`npm run build` precedes the commands.

1. **The option.** `npm run publish:pack -- --pack <id> --report <path> …` (with or without
   `--dry-run`) writes to `<path>` exactly the lines the command prints on standard output, in
   their order, each followed by `\n`, whatever the exit code once the arguments are parsed: 0, a
   check's 1 (the validation failed, the tag exists, …) or a git error's 2. The lines printed and
   the exit code are those of the same run without `--report`. Without `--report`, nothing changes.
2. **The path.** `<path>` is resolved against the working directory. A path inside the repository
   that `--tree` names (its top level, by `git rev-parse --show-toplevel`; its parent directory
   read with symbolic links resolved, so a link into the repository counts as inside) is refused
   before anything runs: exit 3, one line naming the path and dl-044, no file written, no tag, no
   commit. A path whose directory does not exist or cannot be written is refused before anything
   runs too: exit 2 with the I/O error, no tag, no commit; to that end the file is created (or
   emptied) before the publication starts, then written in full at the end. An existing file is
   overwritten.
3. **Usage.** An empty `--report` value, or `--report` given twice, is a usage error, exit 3,
   before anything runs. The header comment of `src/publish-cli.ts` names the option.
4. **Red first** (dl-018). Before criteria 1 … 3 are built, new tests in `tests/publish.test.ts`
   fail and the red run's command and failing count are recorded. They cover: a publication's
   report equal to its printed lines (the Publication section's lines included); a dry run's; a
   failed validation's (exit 1, the validation's lines and the failure's message in the file); an
   existing tag's (exit 1); a path inside the repository refused, given relative, absolute, through
   `..` and through a symbolic link to a directory inside it, each with no file and no tag; a
   missing directory (exit 2, no tag); an existing file overwritten; an empty value and the option
   twice; no `--report`, unchanged output.
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

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
