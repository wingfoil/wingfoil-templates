---
id: task-086-the-waiver-heuristic-a-review-list-in-check-packs-for-an-overlay-s-or-a-stage-pack-s-directives-bridges-exempt-plan-066-task-e
type: task
title: "The waiver heuristic: a review list in check:packs for an overlay's or a stage pack's directives, bridges exempt (plan-066 task E)"
status: draft
pack: ""            # tooling task (tooling-delivery v3), plan-066 task (E)
depends_on: ["task-085-the-lint-per-entry-the-conditional-entries-and-tensions-rules-by-format-parameter-scopes-per-entry-the-mcp-refusal-plan-066-task-d"]
tags: ["tooling","lint","directives"]
---

## Context

plan-066 (point 4 and its ruling, a departure), its fifth task, after task-085 (the lint per
entry). spec-001 §18: "a directive of an overlay or a `stage/*` pack that uses waiver wording
("skip", "not required", "optional", "ignore") about something the pack does not ship is reported
for review, a heuristic, not a refusal; a directive of a conditional entry whose `with` pack
declares a tension naming this pack (a bridge) is exempt (dl-025 D1, finding 6)". The ruling of
point 4: a keyword match on the text of those directives, printed by `check:packs` as a review list
with its exit unchanged; whether a hit concerns something the pack does not ship is the reviewer's
to judge, read at `pack-release-cycle` › `prepare`, where the `pack-release` element's review
records each hit with its verdict; (E) adds that sentence to `pack-authoring`.

What exists: `check:packs` has no tier besides problems: every line after its summary is a
problem, and `validate` (`src/validate.ts`) fails on each of them. `pack-authoring`'s "Conflicts
between packs" bullet (`.wingfoil/directives/custom/pack-authoring.md`) already states the
heuristic (dl-025's amendments, `196e21b`), not where its hits are read. No published pack is an
overlay or a `stage/*` pack; the golden tree's `stage/*` and `team-mode/*` fixture packs use none
of the four words, so no report of today changes.

Not here: D6's coverage (task F); the `mcp` kind's tooling; plan-066 point 7's open points (the
check before the swap reading directives' `tags`, a bridge whose `with` is a common pack the
stricter packs require: their rows, owner the approver, trigger the first `stage/*` charter).

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 2 … 6 committed before the code, so that the
   build passes and they fail by assertion, except any already green on `main` (recorded as such);
   the failing run recorded with its command and count.
2. **Which directives** (spec-001 §18): every directive file of a pack whose `axis` is an axis of
   `catalog.yaml` marked `overlay: true` (today `team-mode` and `stage`), or whose id starts with
   `stage/` when `catalog.yaml` does not load, listed in its `contents` or in any conditional entry,
   whatever the pack's format; a pack whose `pack.yaml` fails its schema is not read (as every rule
   of the lint). **Exempt** (a bridge): a directive listed only in a conditional entry whose `with`
   pack, loaded, declares in `tensions` an entry naming this pack's id, whatever its range.
3. **The match** (the approver's ruling, point 1 below): on the directive's body after its
   frontmatter, line by line, case-insensitive, whole words: `skip`, `skips`, `skipped`,
   `skipping`, `not required`, `optional`, `optionally`, `ignore`, `ignores`, `ignored`,
   `ignoring`. One hit per line holding any of them, at the line and column of the first, its
   message `<pack>: <path> uses waiver wording (<words>): review whether it waives a rule of a pack
   it does not ship (spec-001 §18, dl-025 D1)`, `<words>` the line's distinct words in the order
   they appear, each quoted.
4. **The review list** (rule `waiver`): `runCheckPacks` returns the hits in a new field,
   `reviews`, sorted as problems are; `problems`, `code` and `lines` unchanged by them, so the exit
   is unchanged and `validate` neither prints nor fails on them (the approver's ruling, point 2
   below). `npm run check:packs` prints, after its report, one line per hit, `review: ` followed by
   the hit as a problem line (`<file>:<line>:<column>: waiver: <message>`); no line when there is
   no hit. A hit makes no pack "troubled" for the overlay lint's compositions.
5. **`pack-authoring`**: the "Conflicts between packs" bullet of `pack-authoring` (its file
   under `.wingfoil/directives/custom/`) gains the sentence of the ruling: `npm run check:packs`
   prints these hits as `review:` lines, its exit unchanged, and at `pack-release-cycle` ›
   `prepare` the `pack-release` element's review records each hit with its verdict.
   `README.md`'s line on `npm run check:packs` names the review lines.
6. **The tests** (offline; `tests/check-packs.test.ts` and, for the printing, the CLI on a fixture
   tree): a format-2 fixture tree with a `stage/*` pack and a `team-mode/*` pack whose directives
   hit (`contents` and a non-bridge entry), each hit asserted by file, line, column and message;
   a bridge exempt; a `blueprint/*` pack with the same words, no hit; a word in the frontmatter or
   inside another word (`skipper`, `optionality`) no hit; case and inflections; `check:packs` exit
   0 with the `review:` lines printed; `validate` on a tree with a hit and no problem exit 0; a
   `stage/*` pack's hit without `catalog.yaml` (Acceptance 2's fallback).
7. **Nothing else moves:** the four published packs, the golden trees, `validate`, `check:packs`,
   `check:schemas` and the generated root files unchanged; `npm test` and `npm run lint` exit 0.
   No schema change, so no schema note.
8. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations
   (G12's 25 minutes), and dl-039's local list on Node.js 22.21.0. The privacy check of the branch's
   diff recorded.

**For the approver's ruling before `backlog`:**
1. **The match** (Acceptance 3): the four phrases of §18 and their inflections as whole words, on
   the body only, one hit per line. Recommended as written: §18 names the words, the inflections
   keep "skipped" and "ignored" from slipping through, the whole-word match keeps "skipper" out.
   Alternative: the four phrases exactly as §18 writes them, no inflection.
2. **Where the list is printed** (Acceptance 4): by `check:packs` only, `validate` leaving it out,
   since every line `validate` reads after the summary is a failure and the ruling of point 4 reads
   the list at `prepare`, where `check:packs` runs. Recommended as written. Alternative: `validate`
   prints the same `review:` lines in a block of their own, never failing on them.

## Design

Branch `task/task-086-waiver-heuristic` from `main` at this task's add. A new module
`src/waiver-rules.ts`, `waiverReviews(context: LintContext): Problem[]`, reading the directives of
the packs Acceptance 2 names from `context.files` (filled by `packProblems`, parameters
substituted; a substitution adds no line, so lines and columns hold) and the `with` packs'
`tensions` from `context.packs`; `runCheckPacks` calls it after the groups and returns `reviews`;
`src/check-packs-cli.ts` prints them. The heuristic is its own module, not a group of `GROUPS`,
since a group's result is problems. Red steps: (1) the tests of Acceptance 2 … 6, with
`waiverReviews`' signature and no body (it throws), uncalled, and `reviews` typed on
`CheckPacksResult` and set to `[]`; (2) the code; (3) `pack-authoring` and `README.md`, committed
apart (`wf(config)`, `docs`). No new dependency.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-08: written as plan-066 task (E), after task-085's merge; `pack` and `depends_on` filled
  by editing the draft (W-02).
