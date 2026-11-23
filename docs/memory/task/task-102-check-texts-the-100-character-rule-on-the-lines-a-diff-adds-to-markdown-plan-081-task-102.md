---
id: task-102-check-texts-the-100-character-rule-on-the-lines-a-diff-adds-to-markdown-plan-081-task-102
type: task
title: "check:texts, the 100-character rule on the lines a diff adds to Markdown (plan-081 task-102)"
status: draft
pack: ""            # tooling task (tooling-delivery v5), plan-081 task-102
depends_on: []
tags: ["tooling","texts","ci"]
---

## Context

plan-081 hosts this task (row 2 of its Steps, point 3 of its outline, ruled on 2026-11-23). It is a
tooling task under `tooling-delivery` v5 (plan-081 row 1, `496af112`), and it comes before
`repository-practice` 1.3 (row 3), so that the rule describes a check that exists.

**Why.** dl-046 (approved 2026-11-22) makes a rule of the 100-character lines that repository texts
have followed by hand, and asks for a check (P2): `npm run check:texts` reads the lines a diff adds
and exits 1 on a breach, naming the file, the line and its length. Its P1 sets what counts: a line a
change adds to a Markdown file of this repository is at most 100 characters (counted as characters,
not bytes), except a frontmatter line, a table row, a link reference line and a line inside a fenced
code block; out of its scope `tests/fixtures/`, `CATALOG.md` and the regions between a
`generated:begin` and a `generated:end` marker. P3: the existing long lines are left as they are, so
the check reads added lines only, never whole files. P2's run on the staged diff before every
commit, beside the privacy check, is a rule of `repository-practice` 1.3 (plan-081 row 3), not of
this task.

**What exists today** (the plan's branch at `bd4cd635`):
- `src/markdown-lines.ts` classifies Markdown lines (`fence`, `code`, `comment`, …) for the README
  rules; `src/git.ts` runs git with a clean environment (`runGit`).
- `ci.yml` checks out with `fetch-depth: 0` and every tag; its checks run in shard 1 only
  (`if: matrix.shard == 1`, task-089), as `tests/ci-workflow.test.ts` asserts for every step but
  checkout, Node.js setup, `npm ci`, the build and the shard's tests. This repository pushes
  branches and `main` and opens no pull request.
- The `generated:begin <name>` / `generated:end <name>` markers are HTML comments on lines of their
  own (`packs/governance/feedback/README.md`).

## Acceptance

`npm run build` precedes the commands.

1. **The command.** `npm run check:texts` reads one diff, by its arguments:
   - none: the staged diff (`git diff --cached`), the files read from the index, whatever the
     working tree holds;
   - `-- --base <ref>`: the diff from the merge base of `<ref>` and `HEAD` to `HEAD`, the files read
     from `HEAD`;
   - `-- --range <a>..<b>`: the diff from `<a>` to `<b>`, the files read from `<b>`.

   Renames are detected (`-M`): a renamed file reads only the lines its change adds. Any other
   argument, two modes at once, a range with three dots, a ref git cannot resolve or an `<a>` of
   forty zeros is a usage error: exit 2 with one line on standard error naming it. Known limits,
   accepted: a `main` force-pushed or recreated (its `before` unreachable or forty zeros) and a run
   on `main` cancelled by a later push (whose range does not read the earlier one); a red step from
   a force-push or a recreated `main` is exit 2, not a breach, and goes to the approver.
2. **What counts** (dl-046 P1). Only the lines the diff adds (its `+` lines) to files ending in
   `.md`, a new file reading all its lines, a deleted file none, git's `\ No newline at end of
   file` marker not a line; each line's length is its count of Unicode code points without its line
   ending (`\r\n` or `\n`). A line over 100 is a breach unless it is:
   - a frontmatter line: the file's first line is `---` and the line is up to the next `---` line,
     both included; a `---` below line 1 opens no frontmatter;
   - a table row: its first non-blank character, after any `>` markers of a block quote, is `|` (a
     table without a leading pipe is not exempt, a narrowing of P1 kept on purpose: this
     repository's tables all have one);
   - a link reference line: up to three spaces, then `[label]:` and a destination;
   - a `fence` line, or a `code` line between an opening and a closing `fence` line, as
     `src/markdown-lines.ts` classifies them, with the frontmatter lines blanked (their numbers
     kept) before the scan; an indented code block is not exempt; either fence character (backticks
     or tildes) counts;
   - a line from a `<!-- generated:begin <name> -->` line to the matching `<!-- generated:end <name>
     -->` line, both included; a `begin` with no matching `end` runs to the end of the file;
   - in a file under `tests/fixtures/`, or the file `CATALOG.md` at the root.

   Each exemption is read from the whole file as the diff's side holds it, not from the added lines
   alone (a fence opened above the hunk counts).
3. **The report.** Exit 0 and no output when nothing breaches; otherwise exit 1 and one line per
   breach on standard output, `<path>:<line>: <length> characters (at most 100, dl-046)`, `<line>`
   the line's 1-based number in the file as the diff's side holds it, sorted by path and line, then
   a last line `check:texts: <n> lines over 100 characters`. A git failure is exit 2 with git's
   message.
4. **The CI.** `ci.yml` gains two steps right after "Lint (ESLint)", neither with
   `continue-on-error`:
   - "Texts, the lines this branch adds (dl-046)", `if: matrix.shard == 1 && github.ref_type !=
     'tag' && github.ref != 'refs/heads/main'`, running `npm run check:texts -- --base origin/main`;
   - "Texts, the lines this push adds to main (dl-046)", `if: matrix.shard == 1 && github.ref ==
     'refs/heads/main'`, running `npm run check:texts -- --range "$BEFORE..$AFTER"` with
     `env` holding `BEFORE: ${{ github.event.before }}` and `AFTER: ${{ github.sha }}`
     (block mapping, as the test step's `SHARD`).

   `package.json` gains `"check:texts": "node dist/src/check-texts-cli.js"`.
5. **Red first** (dl-018). Before criteria 1 … 4 are built, `tests/check-texts.test.ts` and new
   assertions in `tests/ci-workflow.test.ts` fail, and the red run's command and failing count are
   recorded. The tests build throw-away git repositories under the system's temporary directory and
   cover: each mode of criterion 1 and each usage error; a breach at 101 code points and none at
   100, with a line of multi-byte characters under 100 code points and over 100 bytes passing; each
   exemption of criterion 2, a fence opened above the hunk and a tilde fence included, and an
   indented code block, a `---` below line 1 and an unmatched `generated:begin` as criterion 2 reads
   them; a long line already in a file and not added passing; a new file; a rename with a long line
   it does not add passing; CRLF line endings; a file without a trailing newline; staged mode
   reading the index while the working tree differs; the report's format, line numbers, order and
   exit codes. In `ci-workflow.test.ts`: both steps, their `if`, their commands and env, their place
   right after the lint step.
6. **The rest unchanged.** The diff from the plan's branch touches only `src/check-texts.ts`,
   `src/check-texts-cli.ts`, `package.json`, `.github/workflows/ci.yml`,
   `tests/check-texts.test.ts`, `tests/ci-workflow.test.ts`, this task and plan-081. No dependency
   is added (`package-lock.json` unchanged). `npm test`, `lint` and the other checks of the CI pass,
   read from the branch CI's jobs and dl-039's local list (criterion 7), not run a second time; on
   the task's branch `npm run check:texts -- --base origin/main` exits 0.
7. **dl-039's checks** on the frozen commit: the branch CI once, every job's duration recorded (its
   branch step of criterion 4 `success`), and the local list on Node.js 22.21.0 from a clean tree
   after `npm ci` and the build.
8. **Delivery** (plan-081 ruling 3). The branch `task/task-102-…` from plan-081's branch, in a
   worktree; the privacy check of the diff recorded (`repository-practice` rule 2); on the
   approver's OK the merge `--no-ff` into plan-081's branch, a departure from `deliver` ("into
   main") recorded here, task-064 and plan-062's task as precedents. The task stays `approved`.
9. **The check on `main`** (dl-045, `tooling-delivery` v5 `deliver`). After plan-081's merge into
   `main` is pushed: `main`'s CI on it read, its step "Texts, the lines this push adds to main"
   `success`, the run id recorded here and in plan-081; then the close commit and `approved → done`.
   A red check stops the close: the task stays `approved`, the finding goes to the approver, and its
   fix is a task or a bug of its own.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-23: independent review of the body (dl-017): approve after amendments; no blocker, five
  should-fix (indented code not exempt; the CI bullet's exempted steps; renames read with `-M`; the
  edge cases' tests; the report's line number) and six nits (where each mode reads the files and
  three dots; the known limits on `main`; the frontmatter blanked before the fence scan, a `---`
  below line 1 and an unmatched `begin`; the table rule's narrowing stated; P2's run before a commit
  left to `repository-practice` 1.3; the env values), all applied.
- 2026-11-23: re-review of the amendments (`5edf50dc`): approve after one should-fix (the `env` as a
  block mapping, not a flow mapping that YAML would not parse) and three nits ("the first" named;
  the fence clause; a short line rewrapped), all applied.
