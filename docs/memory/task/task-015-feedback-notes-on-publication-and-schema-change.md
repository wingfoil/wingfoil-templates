---
id: task-015-feedback-notes-on-publication-and-schema-change
type: task
title: "Feedback notes on publication and schema change"
status: pending
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-014-release-evidence-publication-and-the-tag-dependent-catalog-rules-with-a-dry-run"]
tags: ["tooling","W7","F5.4"]
---

## Context

Task 12 of plan-015 (`sw-life-cycle` › `tooling`, wave W7, F5.4). Tooling task, no pack. With it,
wave W7's exit criterion is complete: "a dry-run publication of a fixture pack produces tag, catalog
entry, digest and note" (`07_sequencer.md`); task-014 delivered the tag, the catalog entry and the
digest. Below, "plan-015 task N" names a step of that plan, not a Memory element.

It comes from:
- **F5.4:** a feedback note for every schema change and for every published pack that WingFoil
  bundles;
- **`wingfoil-cli` rule 8:** a change to `schema/` (the contract with the WingFoil CLI) and the
  publication of a pack that WingFoil bundles each produce a note, so that WingFoil's release
  planning sees them;
- **dl-001:** WingFoil bundles some packs in its npm package and advances them before each of its
  releases; which packs it bundles is WingFoil's decision, still open. So this repository does not
  keep a list: whether a release's pack is bundled is stated at that release, as the
  `pack-release` template's "Publication" section already asks;
- **WingFoil dl-163 and task-010:** one file per note, `docs/wingfoil-feedback/F-<nnn>-<slug>.md`,
  with the frontmatter `id`, `title`, `kind`, `status`, `wingfoil_version`, `answered_by`, a body
  of what was observed and what is expected, and one row in the README's ledger; this repository
  writes `open`; `tests/wingfoil-feedback.test.ts` checks the inbox;
- **`pack-release-cycle` › `publish`** (v4): "If WingFoil bundles the pack, add a note to
  docs/wingfoil-feedback/ for WingFoil's advance-bundled-packs release step".

Not in scope: deciding which packs WingFoil bundles (WingFoil's); sending or syncing the inbox
(`wingfoil-cli` rule 7); the line policy (plan-015 task 13).

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network.
2. **`npm run feedback:note -- (--published <catalog pack id>@<version> | --schema)
   --from <element id> [--tree <dir>]`** writes the next note, `F-<n+1>-<slug>.md` after the
   highest existing number, and appends its row after the last row of the README's ledger, in the
   form `tests/wingfoil-feedback.test.ts` checks (ids in order with no gap, five cells, `\|`
   escaped in titles):
   - the frontmatter of dl-163 and task-010, the six keys in order: `kind: request`, `status: open`,
     `answered_by: []`, `wingfoil_version` the governance pin of `package.json`;
   - the body opens `New note (<element id>).`, the element that produced it: a `task-<nnn>` or,
     at a publication, the `pack-release` element `prel-<nnn>`; the inbox test's opening pattern is
     widened to accept `prel-<nnn>`; then `## Observed` and `## Expected`;
   - `--published`: the title "Pack `<id>@<version>` published, for the bundled copy", the slug
     `pack-<id with / as ->-<version>-published`; the body names the tag, the tagged commit (the
     catalog entry's `commit`), the digest and the computed range, read from `catalog.yaml`, and
     expects WingFoil's advance-bundled-packs step to consider it (dl-001). A version that
     `catalog.yaml` does not list is refused (exit 1);
   - `--schema`: the title "The pack schemas changed (sha256:<first 12 hex>)", the slug
     `schema-<first 12 hex>`; the body records `Schema digest: sha256:…` and, under it, the listing
     of `schema/` (spec-001 §13 applied to the files of `schema/` **in the working tree**, paths
     relative to it); the files that changed are the difference between that listing and the one
     the newest schema note records. It expects WingFoil to read the new contract (rule 8). When
     the digest equals the newest recorded one, nothing is written (exit 0, said so).

   A schema note is any note with a `Schema digest:` line; the newest is the one with the highest
   number. The command never edits an existing note and writes deterministic bytes (no date, no
   clock).
3. **A lint rule, `schema-note`,** in `npm run check:packs`: the digest of the tree's `schema/`, in
   the working tree as in acceptance 2, must equal the one the newest schema note records; a tree
   without `schema/` or without a feedback inbox is not checked. A change to `schema/` carries its
   note in the same change; until then `check:packs`, and so CI, fails: intended (rule 8).
   **Baseline:** F-017 ("The pack format and its schemas, format 1"), already the note about the
   current schemas, gains the `Schema digest:` line and the listing, as a hand edit (rule 2: no verb
   writes it), recorded in the Execution Notes; the README allows editing an open note and forbids
   only deleting and renumbering. A test changes a schema file and shows the rule failing until
   `feedback:note -- --schema` is run.
4. **`npm run publish:pack -- … --bundled --from prel-<nnn>`** (task-014): when the approver states
   that WingFoil bundles the pack, a third commit `feedback: F-<nnn> <id>@<version>` follows the
   catalog commit and adds the `--published` note; the Publication section lists `- Feedback note:
   F-<nnn>`. Without `--bundled` no note is written. On a failure after the catalog commit, the
   branch is reset to its head before the tag, and the tag removed, as task-014 does for a failure
   after the tag. `--dry-run` covers it.
5. **W7 exit criterion, in the tests:** the dry run of task-014 with `--bundled` produces the tag,
   the catalog entry, the digest and the note; the note's row is in the ledger, and
   `check:packs` and the inbox test pass on the result.
6. **Failure paths,** each with a test: an unknown option, both modes or neither, a missing
   `--from` (exit 3); a version not in the catalog (exit 1); a missing or malformed ledger, an
   unreadable inbox (exit 2).
7. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

- 2026-10-10: amended while `pending`, before the approver's review, after an independent review
  (a subagent with its own context): the notes' opening line from `--from` (a task or a
  `pack-release`), with the inbox test's pattern widened; the F-017 baseline stated as a hand edit;
  the schema listing recorded in each schema note and taken from the working tree; the slugs and
  the schema title; the rollback of a failure after the catalog commit; CI red on a schema change
  until its note, as rule 8 intends; more failure paths.
