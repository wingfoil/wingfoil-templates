---
id: task-009-version-the-wingfoil-feedback-inbox
type: task
title: "Version the WingFoil feedback inbox"
status: pending
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

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review:
  the secret check names its command.
