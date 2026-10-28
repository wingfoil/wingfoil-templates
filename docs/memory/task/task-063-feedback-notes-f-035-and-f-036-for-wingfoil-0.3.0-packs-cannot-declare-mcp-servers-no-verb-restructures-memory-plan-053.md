---
id: task-063-feedback-notes-f-035-and-f-036-for-wingfoil-0.3.0-packs-cannot-declare-mcp-servers-no-verb-restructures-memory-plan-053
type: task
title: "Feedback notes F-035 and F-036 for WingFoil 0.3.0: packs cannot declare MCP servers, no verb restructures Memory (plan-053)"
status: draft
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

The same task records W-14 in the `wingfoil-cli` directive: WingFoil 0.2.2's `memory add` numbers
a `{n}` id by count (1 + the files of the type), not by the first free number; plan-053 step 2
moved dl-026 and dl-027 aside to get dl-024 and dl-025 (rule 4). Whether it also needs a feedback
note is decided by the retrospective after re-checking it on 0.3.1 (plan-053 step 4).

## Acceptance

`npm run build` precedes the commands.

1. **Two notes**, `docs/wingfoil-feedback/F-035-packs-cannot-declare-mcp-servers.md` and
   `F-036-no-verb-restructures-memory.md`, each the received text: the six fields in order (`id`,
   `title`, `kind: request`, `status: open`, `wingfoil_version: 0.3.0`, `answered_by: []`), a body
   opening with `New note (task-063).` followed by the received provenance, `## Observed` and
   `## Expected`; no `## Replies`. Prose over 100 characters is rewrapped with no word changed;
   code blocks are kept. F-035's "(proposed, not yet ruled)" stays even if dl-024 is ruled first.
2. **Reproduced with WingFoil alone**: each `## Observed` command re-run in a scratch project
   (`git init`, WingFoil installed with `npm ci` from `src/matrix/wingfoil-0.3.0/`, then
   `wingfoil init --template Kanban --no-interactive`); its output matches the note's, where a
   difference beyond hashes or paths goes to the approver before the note is changed (dl-019). The
   same commands on `src/matrix/wingfoil-0.3.1/`: the result recorded in the Execution Notes; a
   difference goes to the approver.
3. **No private content:** no note names or describes a private project, a local path or a
   non-public repository; WingFoil references are public ids, tags or commits.
4. **The ledger** in `docs/wingfoil-feedback/README.md` gains one row per note, in order (5 cells
   equal to the frontmatter, `answered_by` empty); `Last sync` unchanged.
5. **W-14** in `.wingfoil/directives/custom/wingfoil-cli.md`, after W-13: the behaviour (`memory
   add` numbers a `{n}` id as 1 + the count of the type's files, so a gap is never filled and a
   number on another branch is reused) and how to work with it (move the higher-numbered files out
   of the repository for the command and back, or a placeholder for a number held elsewhere; check
   the id before going on); `Note` and `WingFoil element` empty. The directive's Version 1.4 → 1.5
   and its Date. No W-entry for the notes' 0.3.0 and 0.3.1 behaviours: they are recorded when the
   governance pin moves (rule 5), as task-041.
6. **Tests and checks:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`
   (the inbox checks included, numbering contiguous from F-001), `npm run lint`,
   `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check` and
   `npm run -s wingfoil -- workflow list` exit 0. No file changes outside
   `docs/wingfoil-feedback/`, the `wingfoil-cli` directive and this task's file. The CI run on the
   branch is `success` and recorded.

## Design

- **Red steps:** none of code. The change is content (notes, a directive entry), dl-018 R2's named
  exception; the inbox test already covers it, checked by mutation: a note numbered F-037, a ledger
  row with a wrong cell, an opening naming another task, each making `npm test` fail, listed in the
  Execution Notes.
- **The scratch projects**, in the session's scratchpad and never committed: one per WingFoil
  version, `git init`, `npm ci` from the version's lockfile, `wingfoil init --template Kanban
  --no-interactive`, a commit; the notes' commands run there, output and exit codes compared with
  the notes'.
- **The notes** copied from the received text, the opening's task number replaced, the wrap
  checked word by word against the received text; the ledger rows appended; W-14 written.
- **Commits** on `task/task-063-feedback-notes`, from plan-053's branch: the two notes and the
  ledger (one commit), W-14 (one commit), then this task's notes.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
