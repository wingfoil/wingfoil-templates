---
id: task-025-the-feedback-inbox-cites-as-wingfoil-does-the-full-service-id-and-the-full-sha
type: task
title: "The feedback inbox cites as WingFoil does: the full service id and the full sha"
status: pending
pack: ""            # tooling task (tooling-change › deliver, tooling-delivery)
depends_on: ["task-017-record-the-wingfoil-source-key-svc-018-in-the-feedback-inbox"]
tags: ["tooling","feedback"]
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
2. **CB-8.** `git diff --exit-code origin/main -- catalog.yaml compat.yaml schema/` exits 0 on the
   task branch.
3. **The README.** In `docs/wingfoil-feedback/README.md`, the source-key paragraph:
   - keeps `svc-018` as the short key and names next to it the full service id
     `svc-018-github-repository-wingfoil-templates-a-consumer-project-and-its-feedback-inbox`;
   - says that WingFoil cites a note as `<service id>/F-<nnn>@<sha>`, with the full service id and
     the full sha of the commit it read, citing WingFoil's `COLLABORATION.md` › `## Credit`
     (task-271), with the example
     `svc-018-github-repository-wingfoil-templates-a-consumer-project-and-its-feedback-inbox/F-001@<full sha>`.
4. **Nothing else changes:** `git diff --name-only origin/main` on the task branch lists only
   `docs/wingfoil-feedback/README.md` and this element; the ledger and its tests are untouched.
5. **CI.** The pushed branch `task/<id>` runs `.github/workflows/ci.yml`; its real run's
   conclusion, for both Node.js versions, is recorded in the Execution Notes before `in-review`.
6. **The reply.** After the delivery, the coordinating session gets this element's id, the commit
   sha of the change on `main` and the push state, as it asked; the reply is recorded here.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
