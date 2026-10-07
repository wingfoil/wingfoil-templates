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
left as they are: they record what was true when approved, and the rule they cite survives in
`wingfoil-cli` (rule 8). dl-005 G3 ("notes stay out of git") is lifted only for
`docs/wingfoil-feedback/` (task-009, plan-015). dl-003 plans for `base` to ship
`wingfoil-feedback`; `base` will ship `wingfoil-cli` and the README skeleton instead, which
its charter records. The five `schema/*.schema.json` cite `wingfoil-feedback` in a `$comment`; they
are left unchanged here, since any edit to the contract with WingFoil produces a note; the next
schema change updates them.

**Kept alike across the feedback sources** (the coordinating session compares WingFoil-UI,
WingFoil2-Benchmark and this repository): rules 1–7 of the directive word for word, this
repository's own rules from 8 on; the directive frontmatter and tags; the note frontmatter,
sections and life cycle, `kind: positive` allowed; the ledger columns and the "Last sync" line;
`W-nn` entry ids with a *Note* column, linked both ways through `directive_entry`; the source key
`templates`.

## Acceptance

1. **Notes:** `F-001` … `F-018` hold T1 … T18 (`legacy_id: T<n>`); `F-019` holds the decisions D1–D6
   and the old header (the branch note and the analysis at WingFoil `30f06016`), `kind: proposal`,
   `legacy_id: D1-D6`; `F-020` … `F-022` are the new notes. Every file has every note field and
   the four sections in order, with these values:
   - `status: open`; `triaged_in`, `decision`, `wingfoil_elements`, `target_release`, `resolved_in`,
     `verified_in` empty;
   - `kind` from the note's content (defect, gap, friction, request, proposal, positive);
   - `need_by: before-v1.0`, unless the note says otherwise;
   - `found`: the date the note was first written, from its text;
   - `found_in`: the element on `main` whose work found it, or empty when the note predates the
     elements on `main`; F-020 `task-006`, F-021 and F-022 `task-007`;
   - `wingfoil_version: 0.2.2`; `wingfoil_commit: 30f06016` for the notes written from the analysis
     of WingFoil at that commit, empty otherwise;
   - `directive_entry`: the `W-nn` of `wingfoil-cli` when the note has one.
2. **Migration:** the original text is kept in Observation, Impact here and Proposed. Ids that
   exist only on `archive/draft-2026-10-05` appear only in `legacy_id` and Observation, qualified
   `(archive/draft-2026-10-05)`, since `spec-001`, `dl-001`… and `task-001` also exist on `main`.
   Known counterparts go in Proposed only, as a suggestion: T12 → WingFoil dl-149, task-251; dl-138
   ↔ T4, T5, T7. The seven open questions are attached: 1 → F-003 (T3), 2 → F-008 (T8), 3 → F-019
   (D4), 4 → F-005 (T5), 5 → F-004 (T4), 6 → F-019 (dl-138 Q5), 7 → F-007 (T7).
3. **The three new notes** are reproducible with WingFoil 0.2.2 alone (command, output, version, run
   in a scratch directory): F-020 the copy of WingFoil's built-in directive ids in
   `src/wingfoil-builtins.ts`, citing F-017, which already asks WingFoil to publish the reserved
   ids; F-021 a composed `.wingfoil/` must satisfy WingFoil's own schemas, which nothing exposes;
   F-022 WingFoil runs only at a git root.
4. **Ledger:** `docs/wingfoil-feedback/README.md` holds the short rules (pointing to
   `wingfoil-cli`), the source key `templates`, "Last sync: none", and one row per note with the
   columns Note, Title, Kind, Status, WingFoil elements, Target, Resolved in, Verified in.
   `tests/wingfoil-feedback.test.ts` checks that every note has all its fields (`legacy_id` read as
   a string), that ids are unique and sequential, that the ledger rows match the files (id, title,
   kind, status), and that every `directive_entry` names an entry of `wingfoil-cli` whose *Note*
   column names the note back.
5. **Old file:** `X_wingfoil-templates-notes.md` is deleted in its own commit, after the ledger
   matches; `git log --follow --oneline -- docs/wingfoil-feedback/X_wingfoil-templates-notes.md`
   lists the task-009 commit and the deletion.
6. **Directive:** `.wingfoil/directives/custom/wingfoil-cli.md`: frontmatter and tags
   alike, version 1.0, date, *Checked against* `wingfoil@0.2.2`, rules 1–7 word for word, rule 8
   kept from `wingfoil-feedback` (a change to `schema/` and the publication of a pack WingFoil
   bundles each produce a note), and the table "Known behaviours (0.2.2)" (#, Behaviour, How to work
   with it, Note, WingFoil element), seeded with the surprises met so far: W-01 the `format` warning
   (spec-001 O10), then `memory add --set` filling only id tokens, `approve` requiring `--reason`,
   `submit` committing uncommitted body edits, two `submit`s giving one commit subject, "illegal
   transition" for a wrong target state, no verb leaving a `waiting` state, `workflow list` not
   checking includes (WingFoil bug-145), `where:` not evaluated, WingFoil running only at a git
   root.
7. **Configuration:** `wingfoil-feedback.md` is removed; `roles.yaml` binds `wingfoil-cli` globally
   instead (1 → 2); the comments that cite the directive by name, or say the notes stay out of git,
   name `wingfoil-cli`: `memory.yaml` (3 → 4), `bug-ingest` (1 → 2), `sw-life-cycle` (3 → 4),
   `templates-inception` (1 → 2), `retrospective` (1 → 2). Comments citing only the folder
   `docs/wingfoil-feedback/` stay.
8. `npm run -s wingfoil -- directives list` lists `wingfoil-cli` as global and no
   `wingfoil-feedback`; `workflow list`, `dna show` and `directives list` exit 0 with empty stderr;
   `npm test`, `npm run lint` and `npm run validate` exit 0.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review:
  every configuration file and version named, the schemas excluded with the reason; the kept rule
  as rule 8; the archive-id rule; a value rule for each field; dl-138 counterparts and the
  mapping of the seven open questions; the old header in F-019; F-020 citing F-017; the seeded
  behaviours with `W-nn` ids linked both ways; the test file; the cross-repository alignment.
