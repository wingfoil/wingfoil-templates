---
id: task-025-the-feedback-inbox-cites-as-wingfoil-does-the-full-service-id-and-the-full-sha
type: task
title: "The feedback inbox cites as WingFoil does: the full service id and the full sha"
status: in-progress
pack: ""            # tooling task (tooling-change › deliver, tooling-delivery)
depends_on: ["task-017-record-the-wingfoil-source-key-svc-018-in-the-feedback-inbox"]
tags: ["tooling","W14","feedback"]
---

## Context

A request of the session that coordinates WingFoil's consumers, confirmed by the approver in chat
on 2026-10-11, to be done at the end of wave W14 through this repository's own workflow and a
Memory element; hosted by plan-024 after its last task, as task-017 was hosted by plan-015 at the
end of W7. Tooling task, no pack.

It comes from:
- **WingFoil's citation form**, settled in its `COLLABORATION.md` › `## Credit` (WingFoil
  task-271): a note is cited as `<service id>/F-<nnn>@<sha>`, with the **full** service id and the
  **full** sha of the consumer commit WingFoil read;
- **task-017:** `docs/wingfoil-feedback/README.md` records the source key `svc-018` and says
  "WingFoil cites a note as `<source key>/F-<nnn>@<sha>`", which reads as the short key;
- **the inbox README's own rule:** "If WingFoil's `COLLABORATION.md` refines the format, the next
  sync follows it".

The `wingfoil-cli` directive (rule 6) already says `<service id>/F-<nnn>@<sha>`; it does not change.

This repository's full service id, as WingFoil registered it:
`svc-018-github-repository-wingfoil-templates-a-consumer-project-and-its-feedback-inbox`.

Not in scope: the notes and the ledger; the sync; the directive; CB-8: `catalog.yaml`,
`compat.yaml` and `schema/` do not change.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added.
2. **CB-8.** `git diff --exit-code origin/main...HEAD -- catalog.yaml compat.yaml schema/` exits 0
   on the task branch.
3. **The README.** In `docs/wingfoil-feedback/README.md`, the source-key paragraph keeps its
   `**Source key:**` label (`tests/support/inbox.ts` reads it) and becomes:

   > **Source key:** `svc-018` — the `svc-NNN` id WingFoil assigns when it registers this repository
   > as a feedback source (WingFoil task-269); its full service id is
   > `svc-018-github-repository-wingfoil-templates-a-consumer-project-and-its-feedback-inbox`.
   > WingFoil cites a note as `<service id>/F-<nnn>@<sha>`, with the full service id and the full
   > sha of the commit it read (WingFoil `COLLABORATION.md` › Credit, task-271), for example
   > `svc-018-github-repository-wingfoil-templates-a-consumer-project-and-its-feedback-inbox/F-001@<full sha>`.

   No other paragraph of the README changes.
4. **Nothing else changes:** `git diff --name-only origin/main...HEAD` on the task branch lists only
   `docs/wingfoil-feedback/README.md` and this element; the ledger and its tests are untouched.
5. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
   conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.
6. **The reply.** After the delivery, the coordinating session gets this element's id, the commit
   sha of the change on `main` and the push state, as it asked; the reply is recorded here.

## Design

Branch `task/task-025-citation`, run through `tooling-delivery` as `developer` (`documentation`).
One paragraph of `docs/wingfoil-feedback/README.md` is replaced by the target text of acceptance
3; no code and no new test: `tests/wingfoil-feedback.test.ts` and `tests/support/inbox.ts` already
read the README (the ledger and the `**Source key:**` label) and must pass unchanged.

## Execution Notes

- 2026-10-12: independent review of the body (a subagent with its own context; WingFoil's
  repository checked public, its `COLLABORATION.md` › Credit and task-271 read, the full service id
  matched to WingFoil's service element): approvable as written; two should-fix (diffs against the
  merge base; the label the tests read, one paragraph only) and nits (the target sentence, the
  wave tag), applied while `pending`. Unlike task-017, which was committed on `main`, this task
  runs on its own branch, as every task does.
- 2026-10-12, build on `task/task-025-citation` (`8b0c028`): the paragraph of acceptance 3; no
  test changed (the inbox tests read the ledger and the `**Source key:**` label, and pass).
  `git diff --name-only origin/main...HEAD` lists `docs/wingfoil-feedback/README.md` only.
- 2026-10-12: independent review of the build (a subagent with its own context; the paragraph
  compared with the target text, the full service id with WingFoil's service element): approve.
- 2026-10-12: Acceptance 1–2 on Node.js 22.21.0 and 22.12.0: 803 tests pass; `lint`,
  `check:pins`, `check:schemas` and `check:packs` exit 0; CB-8 holds; no dependency added.
- 2026-10-12, CI (acceptance 5): run 38222096312 on `8b0c028`, conclusion `success` for
  `validate (22.12.0)` and `validate (22.21.0)`.
