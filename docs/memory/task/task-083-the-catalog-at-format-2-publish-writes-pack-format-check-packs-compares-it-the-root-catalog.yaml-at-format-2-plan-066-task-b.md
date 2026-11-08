---
id: task-083-the-catalog-at-format-2-publish-writes-pack-format-check-packs-compares-it-the-root-catalog.yaml-at-format-2-plan-066-task-b
type: task
title: "The catalog at format 2: publish writes pack_format, check:packs compares it, the root catalog.yaml at format 2 (plan-066 task B)"
status: done
pack: ""            # tooling task (tooling-delivery v3), plan-066 task (B)
depends_on: ["task-082-schemas-at-format-2-pack.yaml-catalog.yaml-and-the-index-format-1-frozen-validation-by-format-plan-066-task-a"]
tags: ["tooling","format","catalog"]
---

## Context

plan-066 (rulings 1, 3 and 9), its second task, after task-082 (the schemas at format 2, format 1
frozen, every file read against the schema its `format` names). spec-001 §11 at format 2: a
version entry records `pack_format`, the format of the published `pack.yaml`, "from
`catalog.yaml` format 2 on"; an absent `pack_format` reads as `1`, so no published entry is
edited. Today `publish` (`src/publish.ts`, `afterTag`) writes no `pack_format`, and
`check:packs`'s `catalog-manifest` rule (`src/tag-rules.ts`, `versionProblems`) compares
`version`, `formats`, `requires_capabilities`, `requires`, `conflicts` and `conditional` with the
tagged `pack.yaml`, not its format. The root `catalog.yaml` is at format 1, and
`tests/fixtures/catalog/catalog.yaml` is that file with no published pack, byte for byte
(`tests/catalog.test.ts`).

Ruling 3: the root `catalog.yaml` moves to `format: 2` in the commit with the code that writes
`pack_format`, no published entry edited (§11); the next version published carries
`pack_format: 1` for a format-1 pack; F-047 (task-082) covers the bump. No pack moves to format 2
(plan-063 ruling 3), and the index's `pack_format` is task (G)'s. A format-2 pack in a format-2
catalog is not refused here: spec-001 §5's temporary exception (plan-066 point 8's row) and
plan-063 ruling 3 govern it.

## Acceptance

`npm run build` precedes the commands.

1. **Red first** (dl-018): the tests of Acceptance 2 … 5 committed before the code, so that the
   build passes and they fail by assertion; the failing run recorded with its command and count.
2. **`publish` writes `pack_format`** (spec-001 §5, §11): in a catalog at format 2, the new
   version entry carries `pack_format`, equal to the published `pack.yaml`'s `format` (`1` for
   every pack today), the entry's keys in the order `version`, `commit`, `digest`, `formats`,
   `requires_capabilities`, `requires`, `conflicts`, `wingfoil`, `conditional` (when present),
   `pack_format`, `transitions` (when present); in a catalog at format 1 it carries none (format
   1's schema refuses it), and a pack at format 2 is refused there before the publication
   validation (nothing validated, nothing tagged), with a message naming the catalog's format (its
   entry could not record the format, which a reader would take as 1). The catalog's format is
   the one of the text the entry is added to: `main`'s `catalog.yaml` on a maintenance line. The
   test helper that publishes by hand (`tests/support/published-repo.ts`, `publishByHand`) writes
   it by the same rule and in the same order.
3. **`check:packs` compares it** (`catalog-manifest`, at `/pack_format`): an entry's `pack_format`,
   `1` when absent, equals the tagged `pack.yaml`'s `format`, when the tagged file is read (when it
   is not, the existing rule already reports each copied field); otherwise a problem naming the tag,
   the two values and the absent-reads-as-1 rule. Tested: an entry with `pack_format: 1`, one
   without (both with a format-1 tag), and one whose value differs from the tagged file (a
   fixture tag at format 2 with `pack_format: 1` or none, and a format-1 tag with
   `pack_format: 2`).
4. **The root `catalog.yaml` at `format: 2`**, every published entry unchanged (no `pack_format`
   added); `tests/fixtures/catalog/catalog.yaml` with it (its test unchanged); the golden tree's
   `tests/fixtures/compose/tree/catalog.yaml` stays at format 1, a format-1 catalog still read
   through `catalog.v1` (spec-001 §5). Every reader of the root catalog reads it at format 2 with
   no output changed, the evidence being: `npm run index -- --check` reports nothing out of date;
   `catalog-index.json`, `CATALOG.md` and `llms.txt` unchanged; `check:pins`, `check:schemas`,
   `check:packs` and `validate` exit 0 on the frozen commit (and in the branch CI).
5. **The tests** (`tests/publish.test.ts`, `tests/tag-rules.test.ts`, `tests/catalog.test.ts`,
   offline): Acceptance 2's two catalogs, each test writing its catalog's `format:` line itself
   (the fixture's text with that line replaced), so that the root's move changes none of them:
   format 2 with `pack_format: 1` written and the key order asserted; format 1 with none, and its
   refusal of a format-2 pack, nothing validated or tagged; a maintenance line whose branch's
   `catalog.yaml` is at format 1 and `main`'s at format 2, the entry committed on `main` carrying
   `pack_format: 1`; Acceptance 3's cases; the root catalog at format 2: `tests/catalog.test.ts`
   › "the real catalog.yaml" asserts `format` 2 (red until Design step 3), its other tests
   unchanged; no other test reads the root catalog (task-040, `tests/catalog-fixture.test.ts`).
6. **Nothing else moves:** `check:pins`, `check:schemas`, `check:packs`, `validate`, the golden
   trees and the generated root files unchanged; `npm test` and `npm run lint` exit 0. No new
   schema change, so no schema note (`schema-note` stays green).
7. **The checks** (`tooling-delivery` v3 › `review`, dl-039): the build review and its amendments
   first; then once on the frozen commit the branch CI `success`, both jobs, run id and durations,
   and dl-039's local list on Node.js 22.21.0. The privacy check of the branch's diff recorded.

## Design

Branch `task/task-083-catalog-format-2` from `main` at this task's add. Red steps: (1) the tests
of Acceptance 2, 3 and 5, in `tests/publish.test.ts`, `tests/tag-rules.test.ts` and
`tests/catalog.test.ts` (red by assertion: no `pack_format` written, none compared, the format-1
refusal absent, the root at format 1); (2) `publish`, `publishByHand` and `versionProblems` by
the rule (green but for the root's format), committed; (3) the root `catalog.yaml` and the
fixture catalog at `format: 2`, with the index check and the golden trees read unchanged, and
every publish test that uses the fixture catalog checked (each now writes `pack_format: 1`; no
assertion compares a whole entry), committed. The catalog's format read from `catalogText`, the
text `addVersion` edits (`main`'s on a maintenance line), never from `loadCatalog`'s
working-tree file. No new dependency.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-08: written as plan-066 task (B), after task-082's merge; `pack` and `depends_on` filled
  by editing the draft (W-02).
- 2026-11-08: independent review: approve after amendments, two blocking (the root catalog's test
  in `tests/catalog.test.ts`, the only file allowed to read it, task-040; the maintenance line's
  rule tested); applied with the others: the entry's key order spelled out and tested, the
  format-1 refusal before the publication validation, the catalog's format read from the text the
  entry is added to, each test writing its catalog's format itself, a format-2 pack in a format-2
  catalog left to §5's exception, Acceptance 3's "when the tagged file is read", Acceptance 4's
  evidence named.
- 2026-11-08: re-review: approve, nothing blocking.
- 2026-11-08: started (`backlog → in-progress`) on `task/task-083-catalog-format-2`. Red
  (dl-018), step (1): the tests of Acceptance 2, 3 and 5; `npm run build` and `npm run lint` exit
  0; `node --test dist/tests/publish.test.js dist/tests/tag-rules.test.js
  dist/tests/catalog.test.js`: 46 tests, 7 failing, each by assertion (no `pack_format` written,
  none compared, the format-1 refusal absent, the root catalog at format 1).
- 2026-11-08: steps (2) and (3) green, each committed; after (3) `npm test` 1219 tests, 0
  failing; `validate`, `check:schemas`, `check:packs`, `check:pins` exit 0; `npm run index --
  --check` 0 not up to date; the tree unchanged.
- 2026-11-08: independent build review: approve, nothing blocking; applied: the format-1
  refusal's message says why (an absent pack_format reads as 1), `packFormatFor`'s signature
  wrapped as the file's others, a tagged pack.yaml with no `format` read as 1 by the tag rule too.
  A deviation from Acceptance 3's letter, kept: a mismatch with `pack_format` absent is reported at
  the version entry, not at `/pack_format`, since a missing key has no position of its own (it
  would fall back to line 1); a present one is reported at `/pack_format`. No decision changed,
  so no re-review.
- 2026-11-08: the checks (dl-039), once on the frozen commit `d1b38cd`: the branch CI run
  42461942893 `success` (22.12.0 20 min 22 s, 22.21.0 22 min 21 s, under G12's 25 minutes, the
  margin narrow); dl-039's local list on Node.js 22.21.0 on a clean worktree of `d1b38cd`: `npm
  ci`, `npm run build`, `npm run validate:publication` (18 runs, 0 failed), the golden tree in
  publication (26 runs, 0 failed), `workflow list`, `directives list --format json` (`warnings
  []`), each exit 0; `npm run lint` 0. The privacy check of the branch's diff: no local or
  scratch path, no private project. This note is documentation-only (dl-039 R2).
