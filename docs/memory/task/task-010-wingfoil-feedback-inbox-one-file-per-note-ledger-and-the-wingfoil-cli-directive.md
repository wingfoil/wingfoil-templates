---
id: task-010-wingfoil-feedback-inbox-one-file-per-note-ledger-and-the-wingfoil-cli-directive
type: task
title: "WingFoil feedback inbox: one file per note, ledger, and the wingfoil-cli directive"
status: pending
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-009-version-the-wingfoil-feedback-inbox"]
tags: ["governance","feedback-loop"]
---

## Context

Step M1, S4a and S4b, of the WingFoil feedback loop, between wave W5 and wave W6 of plan-015.
Tooling task, no pack: it changes this repository's governance and its `.wingfoil/`
configuration.

It comes from `wingfoil/wingfoil` dl-163:
- **R4:** one file per note, `docs/wingfoil-feedback/F-nnn-<slug>.md`, with the
  frontmatter of Acceptance 1 and the sections Observation, Impact here, Proposed, Replies; a
  `README.md` with the short rules, the source key `templates`, the last sync and the ledger;
  notes never deleted;
- **Migration:** `legacy_id` kept; known counterparts written as a proposal, never in the
  WingFoil-owned fields; ids of `archive/draft-2026-10-05` only in `legacy_id` and
  Observation; the old file deleted only once the ledger lists every note;
- **S3e:** the global directive `wingfoil-cli`, rules 1–7, replacing `wingfoil-feedback`,
  whose own rule ("a change to `schema/` and the publication of a pack WingFoil bundles both
  produce a note") is kept; a table of known behaviours of the pinned CLI.

New notes owed by this phase: task-006 (a copy of WingFoil's built-in directive ids) and task-007
(a composed `.wingfoil/` must satisfy WingFoil's own schemas; WingFoil runs only at a git root).

Approved texts that cite `wingfoil-feedback` (spec-001, dl-005, dl-006, adr-001, the vision) are
left as they are: they record what was true when they were approved.

## Acceptance

1. **Notes:** `F-001` … `F-018` hold T1 … T18 (`legacy_id: T<n>`), `F-019` holds the
   decisions D1–D6 (`kind: proposal`, `legacy_id: D1-D6`), `F-020` … `F-022` the three new
   notes. Each file has every note field: `status: open`; `wingfoil_version: 0.2.2`;
   `triaged_in`, `decision`, `wingfoil_elements`, `target_release`, `resolved_in` and
   `verified_in` empty; the four sections in order. Each open question of the old file is attached
   to the note it concerns; T12's counterparts (WingFoil dl-149, task-251) appear only in Proposed.
2. **The three new notes** are reproducible with WingFoil 0.2.2 alone: Observation holds the
   command, its output and the version, run in a scratch directory, not this repository's
   configuration.
3. **Ledger:** `docs/wingfoil-feedback/README.md` holds the short rules (pointing to
   `wingfoil-cli`), the source key `templates`, "Last sync: none", and one ledger row per note
   with the columns Note, Title, Kind, Status, WingFoil elements, Target, Resolved in, Verified in.
   A test checks that every note has all its fields, that ids are unique and sequential, and that
   the ledger rows match the files (id, title, kind, status).
4. **Old file:** `X_wingfoil-templates-notes.md` is deleted in its own commit, after the ledger
   matches; `git log --follow` keeps its history.
5. **Directive:** `.wingfoil/directives/custom/wingfoil-cli.md` contains (frontmatter, version
   1.0, date, *Checked against* `wingfoil@0.2.2`, rules 1–7, the kept rule, the table "Known
   behaviours (0.2.2)" with the columns #, Behaviour, How to work with it, Note, WingFoil element,
   its first entry the `format` warning of spec-001 O10). `wingfoil-feedback.md` is removed;
   `roles.yaml` binds `wingfoil-cli` globally instead (version bumped); the workflow comments that
   cite the old directive or say the notes stay out of git are updated (versions bumped).
6. `npx wingfoil directives list` lists `wingfoil-cli` as global and no `wingfoil-feedback`;
   `npx wingfoil workflow list`, `dna show` and `directives list` exit 0 with empty stderr;
   `npm test`, `npm run lint` and `npm run validate` exit 0.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes
