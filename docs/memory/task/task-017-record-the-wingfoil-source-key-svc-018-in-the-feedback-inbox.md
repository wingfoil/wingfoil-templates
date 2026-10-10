---
id: task-017-record-the-wingfoil-source-key-svc-018-in-the-feedback-inbox
type: task
title: "Record the WingFoil source key svc-018 in the feedback inbox"
status: in-progress
pack: ""            # no pack: the feedback inbox
depends_on: ["task-016-line-policy-one-living-line-before-wingfoil-1.0-n-and-n-1-after-it"]
tags: ["W7","feedback"]
---

## Context

The feedback inbox's README (`docs/wingfoil-feedback/README.md`, task-010) leaves the **source key**
"to be set": the `svc-NNN` id WingFoil assigns when it registers this repository as a feedback
source (WingFoil task-269). WingFoil cites a note as `<source key>/F-<nnn>@<sha>`.

WingFoil registered this repository as the source `svc-018`. The coordinating session reported it
and asked that the key be recorded at the end of wave W7; the approver confirmed it on 2026-10-10.
After the change, the coordinating session is told the task id, the commit and whether it was
pushed.

Not in scope: the sync (`wingfoil-cli` rule 7) and the `Last sync:` line; the notes and the ledger.

## Acceptance

1. In `docs/wingfoil-feedback/README.md`, the line `**Source key:** to be set — …` reads
   ``**Source key:** `svc-018` — …``, keeping the explanation of the key and of WingFoil's
   citation form; no other line of the README changes.
2. `npm test` (the inbox checks of `tests/wingfoil-feedback.test.ts`) and `npm run check:packs`
   exit 0.
3. The change is on `main`, pushed, and CI on it succeeds.

## Design

A one-line edit of `docs/wingfoil-feedback/README.md`, committed on `main` (no code, no branch),
then pushed; CI runs on the pushed `main`.

## Execution Notes

- 2026-10-10: `d4013c2` sets the source key to `svc-018` in the inbox README, on `main`, pushed;
  611 tests and `check:packs` pass. CI on `main`,
  https://github.com/wingfoil/wingfoil-templates/actions/runs/38079807906: `success`, both jobs.
