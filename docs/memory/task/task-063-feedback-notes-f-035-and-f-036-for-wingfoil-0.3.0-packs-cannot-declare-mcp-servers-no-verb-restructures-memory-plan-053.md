---
id: task-063-feedback-notes-f-035-and-f-036-for-wingfoil-0.3.0-packs-cannot-declare-mcp-servers-no-verb-restructures-memory-plan-053
type: task
title: "Feedback notes F-035 and F-036 for WingFoil 0.3.0: packs cannot declare MCP servers, no verb restructures Memory (plan-053)"
status: in-progress
pack: ""            # tooling task (decision-log-ingest › capture, plan-053 step 4)
depends_on: []
tags: ["tooling","feedback"]
---

## Context

plan-053 step 4: two feedback notes for WingFoil whose texts the approver ruled on 2026-10-24 that
this repository add after W9, relayed by the coordinating session with dl-024 and dl-025 (re-sent
unchanged on 2026-10-28). The texts are final; only the task number in their opening line changes.
- **F-035 (`request`): packs cannot declare MCP servers** for the agents WingFoil launches; from
  dl-024 (proposed, not yet ruled).
- **F-036 (`request`): no verb moves, renames or supersedes an element**, and nothing lists the
  elements that cite one.

The notes block the inbox's numbering (`tests/support/inbox.ts`: contiguous numbers), so task-052
(F-037) and the retrospective's notes wait for this task.

The same task records W-14 in the `wingfoil-cli` directive: WingFoil 0.2.2's `memory add` numbers a
`{n}` id by count (1 + the type's files in the working tree), so with a gap it gives a number
already in use, under another slug; plan-053 step 2 moved dl-026 and dl-027 aside to get dl-024 and
dl-025 (rule 4). Whether it also needs a feedback note is decided by the retrospective after
re-checking it on 0.3.1 (plan-053 step 4).

## Acceptance

`npm run build` precedes the commands.

1. **Two notes**, `docs/wingfoil-feedback/F-035-packs-cannot-declare-mcp-servers.md` and
   `F-036-no-verb-restructures-memory.md`, each the received text: the six fields in order (`id`,
   `title`, `kind: request`, `status: open`, `wingfoil_version: 0.3.0`, `answered_by: []`), a body
   opening with `New note (task-063).` followed by the received provenance, `## Observed` and
   `## Expected`; no `## Replies`. The text is kept byte for byte except the opening's task number
   (F-035's 114-character code line and F-036's 102-character title kept); `wingfoil_version:
   0.3.0` is the received value, written by hand: the governance pin is 0.2.2. F-035's "(proposed,
   not yet ruled)" stays even if dl-024 is ruled first.
2. **Reproduced with WingFoil alone**: each `## Observed` command re-run in a scratch project (`git
   init`, WingFoil installed with `npm ci` from `src/matrix/wingfoil-0.3.0/`, then `wingfoil init
   --template Kanban --no-interactive`); its output, and the exit codes the note shows, match the
   note's, where a difference beyond hashes or paths goes to the approver before the note is changed
   (dl-019). The same commands on `src/matrix/wingfoil-0.3.1/`: the result recorded in the Execution
   Notes; a difference goes to the approver.
3. **No private content:** no note names or describes a private project, a local path or a
   non-public repository; WingFoil references are public ids, tags or commits.
4. **The ledger** in `docs/wingfoil-feedback/README.md` gains one row per note, in order (5 cells
   equal to the frontmatter, `answered_by` empty); `Last sync` unchanged.
5. **W-14** in `.wingfoil/directives/custom/wingfoil-cli.md`, after W-13: the behaviour (`memory
   add` numbers a `{n}` id as 1 + the count of the type's files in the working tree, so with a gap
   it gives a number already in use, a second id with that number and another slug, which WingFoil
   does not refuse since it refuses only an identical path; and a number taken only on another
   branch is given again) and how to work with it (when the numbers below the wanted one have no
   gap, move the higher-numbered files out of the repository for the command and back; for a number
   held on another branch, a placeholder file in the type's directory named by the id pattern
   (`<prefix>-<n>-placeholder.md`), which raises the count by one, removed after the command and
   never committed; check the id before going on); `Note` and `WingFoil element` empty. The
   directive's Version 1.4 → 1.5 and its Date 2026-10-28; *Checked against* `wingfoil@0.2.2`
   unchanged (no pin move, rule 5). No W-entry for the notes' 0.3.0 and 0.3.1 behaviours: they are
   recorded when the governance pin moves (rule 5), as task-041.
6. **Tests and checks:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`
   (the inbox checks included, numbering contiguous from F-001), `npm run lint`,
   `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check` and
   `npm run -s wingfoil -- workflow list` exit 0. No file changes outside
   `docs/wingfoil-feedback/`, the `wingfoil-cli` directive and this task's file. The CI run on the
   branch is `success` and recorded.

## Design

- **Red steps:** none of code. The change is content (notes, a directive entry), dl-018 R2's named
  exception; the inbox test already covers it, checked by mutation: a note numbered F-037, a ledger
  row with a wrong cell, an opening not in the form (`New note task-063.`), `F-099` in W-14's
  `Note` cell, each making `npm test` fail, listed in the Execution Notes. The task number of the
  opening, which the test does not check, is checked by a diff against the received text.
- **The scratch projects**, in the session's scratchpad and never committed: one per WingFoil
  version, `git init`, `npm ci` from the version's lockfile, `wingfoil init --template Kanban
  --no-interactive`, a commit; the notes' commands run there, output and exit codes compared with
  the notes'.
- **The notes** copied from the received text, the opening's task number replaced, the diff against
  the received text showing that line only; the ledger rows appended; W-14 written.
- **Privacy:** a grep of the two notes and W-14 for local paths (`/home/`, `/tmp/`), and a read
  for private project or repository names.
- **Commits** on `task/task-063-feedback-notes`, from plan-053's branch: the two notes and the
  ledger (one commit), W-14 (one commit), then this task's notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-28: independent review of the body: approve after amendments, two blocking findings:
  the mutation "an opening naming another task" cannot fail the inbox test (any number passes), so
  it is replaced by an opening not in the form and an unknown note in W-14's `Note` cell, with the
  task number checked by a diff; W-14's behaviour stated exactly (with a gap, `memory add` gives a
  number already in use under another slug, refused only for an identical path). Applied with the
  others: `wingfoil_version` written by hand; the placeholder workaround spelled out and the
  move-aside's no-gap condition; the Date and *Checked against*; the text kept byte for byte (no
  prose line of the notes is over 100 characters); the privacy grep; the exit codes compared.
- 2026-10-28: re-review: approve; two nits applied (the placeholder's name, a ragged wrap).
- 2026-10-28, build (`backlog → in-progress`): scratch projects in the session's scratchpad, one per
  version (`npm ci` from `src/matrix/wingfoil-0.3.0/` and `wingfoil-0.3.1/`, `git init`, `wingfoil
  init --template Kanban --no-interactive`). Every `## Observed` command of F-035 and F-036 gives
  the notes' output and exit codes on 0.3.0 (`cc31d7a8`) and, identically, on 0.3.1 (`870bd440`):
  `--help` excerpts, the two built-in adapters and their `mcp:` blocks, `custom/` empty, `memory
  move` and `rename` exit 2, `memory search`'s three filters, `grep -c superseded` 0. No
  difference to bring to the approver.
- The notes (`c6e9bf4`): the received files with the opening's task number replaced; `diff` against
  the received text shows that line only. Two ledger rows. W-14 and the directive's 1.5
  (`e9297c4`). Privacy grep (`/home/`, `/tmp/`, the maintainer's names) on the notes and the
  directive: no match.
- Mutations (dl-018 R2), `node --test dist/tests/wingfoil-feedback.test.js
  dist/tests/feedback-note.test.js`, 13 of 13 pass unmutated: F-036 renumbered F-037 → 3 fail; a
  ledger row's `kind` changed → 2 fail; the opening `New note task-063.` → 2 fail; `F-099` in
  W-14's `Note` cell → 1 fail. Each reverted.
- Clean clones of `e9297c4` on Node.js 22.21.0 and 22.12.0: `npm ci`, `npm test` 1027 of 1027,
  `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check`,
  `check:runs` and `workflow list` exit 0. Files changed: the two notes, the ledger, the
  directive, this file. CI run 40719699764 on `e9297c4`: `success`.
- 2026-10-28: independent build review: approve; every Acceptance criterion checked, the notes'
  commands re-run on fresh 0.3.0 and 0.3.1 installs, W-14 checked against 0.2.2's code, F-035's
  requests matched to dl-024 D3. Applied (wording only, no behaviour, test or Acceptance command
  changed, so no re-review, dl-017): W-14 says a number after a gap is not the next one and is
  usually in use (with files 1 and 5 it gives a free 3), and the row is shorter. Two points for
  dl-024's review note, outside this task: D3 5 to say "install or update", as F-035 and D4 do;
  F-035's "only by" sentence stays accurate (a custom copy under its own name), the received
  text unchanged. The inbox tests 13 of 13, `lint` and `workflow list` exit 0 after the change.
