---
id: task-009-version-the-wingfoil-feedback-inbox
type: task
title: "Version the WingFoil feedback inbox"
status: approved
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: []
tags: ["governance","feedback-loop"]
---

## Context

Step M1, S1, of the WingFoil feedback loop, run between wave W5 and wave W6 of plan-015
(`sw-life-cycle` › `tooling`). Tooling task, no pack: it changes this repository's governance.

It comes from `wingfoil/wingfoil` dl-163,
ruling **R1** (2026-10-07): the consumer inboxes are versioned on `main`, now that a method defines
them. WingFoil registers this repository as a feedback source, key `templates`, only once its inbox
is versioned. The approver confirmed it here on 2026-10-07, lifting for this folder his rule of
2026-10-05 ("non committare le note", dl-005 G3).

Scope: the inbox as it is today, one file, committed on its own. Not in scope: the split into one
file per note, the ledger and the `wingfoil-cli` directive (task-010);
`docs/notes/base-regeneration-inputs.md`, which stays untracked.

## Acceptance

1. One commit adds exactly `docs/wingfoil-feedback/X_wingfoil-templates-notes.md`
   (`git show --stat` lists that file alone); its bytes equal the working copy's before the
   commit (same sha256, recorded in the Execution Notes).
2. `git ls-files docs/notes .idea` prints nothing.
3. The file holds no secret (`security-secrets`):
   `grep -niE 'token|secret|password|passwd|api[_-]?key|BEGIN .*PRIVATE KEY|gh[pousr]_[A-Za-z0-9]{20}|AKIA[0-9A-Z]{16}' docs/wingfoil-feedback/X_wingfoil-templates-notes.md`
   finds no credential: every match, if any, is prose about the concept, listed in the Execution
   Notes.
4. `npm test`, `npm run lint` and `npm run validate` still exit 0.

## Design

Branch `task/task-009-inbox`, run through `tooling-delivery` as `developer`. The sha256 of the file
is taken before the commit and compared with the committed blob (`git cat-file blob HEAD:<path>`);
the secret search of Acceptance 3 runs on the committed file. Nothing else is staged: the file is
added by name.

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review:
  the secret check names its command.
- 2026-10-07, on `task/task-009-inbox`: commit `434d342` adds
  `docs/wingfoil-feedback/X_wingfoil-templates-notes.md` alone (520 lines).
  - Acceptance 1: sha256 before the commit and of the committed blob, both
    `8b484510cd731a4e03e60182e3c5242328644e8e01e198ad56bdd38df4df3a2f`.
  - Acceptance 2: `git ls-files docs/notes .idea` prints nothing.
  - Acceptance 3: the search matches lines 22 and 132 ("secret scan", WingFoil dl-138 Q4 and
    task-135) and 257, 263, 264 ("id tokens" of `memory add --set`): prose, no credential.
  - Acceptance 4: 424 tests, `lint` and `validate` exit 0.
- Review (a subagent with its own context): approve. It read the whole file for anything unfit for
  a public repository and found none. Its nit, the open questions numbered 5, 7, 6, is left to the
  split of task-010, since this commit keeps the file byte-identical.
