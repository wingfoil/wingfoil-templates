---
id: task-010-wingfoil-feedback-inbox-one-file-per-note-ledger-and-the-wingfoil-cli-directive
type: task
title: "WingFoil feedback inbox: one file per note, ledger, and the wingfoil-cli directive"
status: in-review
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-009-version-the-wingfoil-feedback-inbox"]
tags: ["governance","feedback-loop"]
---

## Context

Step M1, S4a and S4b, of the WingFoil feedback loop, between wave W5 and wave W6 of plan-015.
Tooling task, no pack: it changes this repository's governance and its `.wingfoil/` configuration.

It comes from **WingFoil dl-163** ("Consumer projects' feedback sources and the feedback loop",
read in WingFoil2 at `ed4607a4` and later, ratified 2026-10-07), applied **strictly, with no local
extension**, as the approver chose on 2026-10-07 (relayed by the session coordinating the loop).
Where it differs from this task's first draft, dl-163
wins:
- **R4, minimal format:** one file per note, `docs/wingfoil-feedback/F-<nnn>-<slug>.md`, whose
  frontmatter has exactly `id`, `title`, `kind` (`defect | gap | request`), `status`
  (`open | needs-info | captured | resolved | declined | duplicate`), `wingfoil_version` (the build
  the note was observed on) and `answered_by` (the WingFoil element ids, filled only by this
  repository's sync); the body states what was observed and what was expected, reproducible with
  WingFoil alone (command, output, version). No other field and no Replies section. If WingFoil's
  `COLLABORATION.md` (its v0.3 user-docs phase) refines the format, the next sync follows it;
- **R2:** WingFoil cites a note as `<service id>/F-<nnn>@<sha>`; the source key of this repository
  is the `svc-NNN` id WingFoil gives it when it registers it (its task-269), written in the README once
  known;
- **the directive** `wingfoil-cli` follows the shared skeleton, with rule 5 (no `verified`
  status: a shipped answer stays `resolved`) and rule 6 (only the sync sets `answered_by` and the
  statuses other than `open`) adjusted to dl-163.

New notes owed by this phase: task-006 (a copy of WingFoil's built-in directive ids) and task-007
(a composed `.wingfoil/` must satisfy WingFoil's own schemas; WingFoil runs only at a git root).

Approved texts that cite `wingfoil-feedback` (spec-001, dl-005, dl-006, adr-001, the vision) are
left as they are: they record what was true when approved, and the rule they cite survives in
`wingfoil-cli` (rule 8). dl-005 G3 ("notes stay out of git") is lifted only for
`docs/wingfoil-feedback/` (task-009, plan-015). dl-003 plans for `base` to ship
`wingfoil-feedback`; `base` will ship `wingfoil-cli` and the README skeleton instead, which its
charter records. The five `schema/*.schema.json` cite `wingfoil-feedback` in a `$comment`; they
are left unchanged here, since any edit to the contract with WingFoil produces a note; the next
schema change updates them.

**Kept alike across the feedback sources** (the coordinating session compares WingFoil-UI,
WingFoil2-Benchmark and this repository): the dl-163 note format exactly; rules 1–7 of the
directive word for word, this repository's own rules from 8 on; the directive frontmatter and tags;
the README's rules, source key, last sync line and ledger columns; `W-nn` entry ids with a
*Note* column.

## Acceptance

1. **Notes:** `F-001` … `F-018` hold T1 … T18, `F-019` … `F-021` the new notes. Each frontmatter has
   exactly the six fields of dl-163 R4: `kind` `request`, `gap` or `defect`, as fits;
   `status: open`; `wingfoil_version`: the build observed (`0.2.2`, or the development commit the
   note was written from, e.g. `0.2.2-1778-g30f06016`); `answered_by: []`.
2. **Bodies:** the first line of a migrated note is "Formerly T<n>.", followed by the ids that
   exist only on `archive/draft-2026-10-05`, qualified so; then what was observed and what was
   expected, with command, output and version wherever the note is about WingFoil's behaviour. The
   open questions go into the notes they concern (1 → T3, 2 → T8, 3 → D4 in the README, 4 → T5,
   5 → T4, 6 → the README, 7 → T7). T12's body says WingFoil already has dl-149 and task-251;
   T4, T5 and T7 name dl-138; `answered_by` stays empty.
3. **The three new notes** are reproducible with WingFoil 0.2.2 alone (command, output, version,
   run in a scratch directory): F-019 the copy of WingFoil's built-in directive ids in
   `src/wingfoil-builtins.ts`, citing F-017, which already asks WingFoil to publish the reserved
   ids; F-020 a composed `.wingfoil/` must satisfy WingFoil's own schemas, which nothing exposes;
   F-021 WingFoil runs only at a git root.
4. **README:** `docs/wingfoil-feedback/README.md` holds the short rules (pointing to
   `wingfoil-cli`), the source key ("to be set: the `svc-NNN` WingFoil assigns when it registers
   this repository, WingFoil task-269"), "Last sync: none", a Context section with the decisions
   D1–D6 and the old header (branch note, analysis at WingFoil `30f06016`), and the ledger
   Note | Title | Kind | Status | Answered by, one row per note. `tests/wingfoil-feedback.test.ts`
   checks that every note has exactly the six fields with allowed values, that ids are unique and
   sequential and match the file names, that the ledger rows match the files (id, title, kind,
   status, answered by), and that every *Note* of the directive's table names an existing note.
5. **Old file:** `X_wingfoil-templates-notes.md` is deleted in its own commit, after the ledger
   matches; `git log --follow --oneline -- docs/wingfoil-feedback/X_wingfoil-templates-notes.md`
   lists the task-009 commit and the deletion.
6. **Directive:** `.wingfoil/directives/custom/wingfoil-cli.md`: the shared frontmatter and tags;
   version 1.0, date, *Checked against* `wingfoil@0.2.2`; the shared rules 1–4 and 7 word for word,
   rule 5 "when the pin advances, re-check every entry and remove the fixed ones; a note whose
   answer has shipped stays `resolved`", rule 6 "`answered_by` and every status other than `open`
   are set only by the sync, from what WingFoil published; WingFoil cites a note as
   `<service id>/F-<nnn>@<sha>`"; rule 8 kept from `wingfoil-feedback` (a change to `schema/` and
   the publication of a pack WingFoil bundles each produce a note); the table "Known behaviours
   (0.2.2)" (#, Behaviour, How to work with it, Note, WingFoil element), seeded with the surprises
   met so far: W-01 the `format` warning (spec-001 O10), then `memory add --set` filling only id
   tokens, `approve` requiring `--reason`, `submit` committing uncommitted body edits, two
   `submit`s giving one commit subject, "illegal transition" for a wrong target state, no verb
   leaving a `waiting` state, `workflow list` not checking includes (WingFoil bug-145), `where:`
   not evaluated, WingFoil running only at a git root.
7. **Configuration:** `wingfoil-feedback.md` is removed; `roles.yaml` binds `wingfoil-cli` globally
   instead (1 → 2); the comments that cite the directive by name, or say the notes stay out of git,
   name `wingfoil-cli`: `memory.yaml` (3 → 4), `bug-ingest` (1 → 2), `sw-life-cycle` (3 → 4),
   `templates-inception` (1 → 2), `retrospective` (1 → 2). Comments citing only the folder
   `docs/wingfoil-feedback/` stay.
8. `npm run -s wingfoil -- directives list` lists `wingfoil-cli` as global and no
   `wingfoil-feedback`; `workflow list`, `dna show` and `directives list` exit 0 with empty stderr;
   `npm test`, `npm run lint` and `npm run validate` exit 0.

## Design

Branch `task/task-010-feedback-notes`, run through `tooling-delivery` as `developer`.

- **Note body:** a first line "Formerly T<n>." (with the archive-only ids, qualified), then
  `## Observed` and `## Expected`, carrying the old note's text: what WingFoil does or lacks, and
  what this repository needs or proposes. A note about the CLI's behaviour gives the command, its
  output and the version.
- **Kinds:** `defect` for wrong behaviour (T11); `gap` for a missing capability (T1, T4, T6, T7,
  T16, T18, F-019, F-020); `request` for a proposal or a dependency (T2, T3, T5, T8, T9, T10, T12,
  T13, T14, T15, T17, F-021).
- **`wingfoil_version`:** `0.2.2-1778-g30f06016` for the notes written from the analysis at that
  commit (T1–T10, T12–T14), `0.2.2` for those observed on the released CLI (T11, T15–T18, F-019 to
  F-021).
- **Order of commits:** the 21 notes and the README with its ledger; the test; the directive and
  the configuration; the deletion of the old file, last.
- The README's Context section takes D1–D6, the old header, dl-138's mapping and open question 6.

## Execution Notes

- 2026-10-07: amended while `pending`, before the approver's review, after an independent review:
  every configuration file and version named, the schemas excluded with the reason; the kept rule
  as rule 8; the archive-id rule; a value rule for each field; dl-138 counterparts and the
  mapping of the seven open questions; the old header in F-019; F-020 citing F-017; the seeded
  behaviours with `W-nn` ids linked both ways; the test file; the cross-repository alignment.

- 2026-10-07: amended again while `pending`, before the approver's review: the approver had WingFoil
  dl-163 applied strictly in place of the first draft's note format (six frontmatter fields, kinds
  `defect | gap | request`, no Replies, the old id on the body's first line, D1–D6 as README
  context, source key `svc-NNN` once registered, rules 5 and 6 adjusted). The new notes are
  F-019 … F-021.
- 2026-10-07, build on `task/task-010-feedback-notes`, as `developer`: `376cd3d` the 21 notes and
  the README with its ledger; `830dccb` the `wingfoil-cli` directive and the configuration;
  `4fb9ee6` the test; `f839ea8` the deletion of the old file; `59f6be9` review fixes.
  - The three new notes were reproduced with WingFoil 0.2.2 alone in a scratch git repository
    (`init --template Kanban --no-interactive`, `directives list`, a minimal `dna.yaml`, a command
    outside a repository and in a subdirectory).
  - The test was written after the notes: a characterization test, checked by mutation (a status
    outside dl-163, an extra field, a wrong ledger title, a missing Expected, a behaviour naming
    F-099, a missing first line), each caught.
  - Acceptance 1–8 pass from a clean clone of the branch on Node.js 22.21.0 and on the floor
    22.12.0: 430 tests, `lint`, `validate`; `npm run -s wingfoil -- directives list` shows
    `wingfoil-cli` global and no `wingfoil-feedback`; the three WingFoil commands exit 0 with empty
    stderr; `git log --follow` on the old file lists `434d342` (task-009) and `f839ea8`.
- Deviations: the directive and configuration were committed before the test, which reads the
  directive's table; rule 7 of `wingfoil-cli` leaves out a section reference that does not
  resolve here; the table has twelve entries (W-11 and W-12 added for F-019 and
  F-020). `wingfoil-sync`, named by rule 7, is not defined in this repository: reported to the
  session coordinating the loop.
- Review (a subagent with its own context): request changes, no blocking: content of T2, T8, T9,
  T11, T13, T15, T16, T18 and of the old header had been lost or changed in the split. Restored in
  `59f6be9`, with T9's original wording kept beside its restatement; the re-review approved.
