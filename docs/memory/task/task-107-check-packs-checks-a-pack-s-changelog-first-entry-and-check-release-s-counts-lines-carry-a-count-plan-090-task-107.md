---
id: task-107-check-packs-checks-a-pack-s-changelog-first-entry-and-check-release-s-counts-lines-carry-a-count-plan-090-task-107
type: task
title: "check:packs checks a pack's CHANGELOG first entry, and check:release's counts' lines carry a count (plan-090 task-107)"
status: pending
pack: ""            # tooling task (tooling-delivery v5), plan-090 task-107
depends_on: []
tags: ["tooling","pack-release","validation"]
---

## Context

plan-090 hosts this task (its Steps 2; points 3, 6, 7 and 8 of its outline, ruled on 2026-11-27).
It is a tooling task under `tooling-delivery` v5, merged into `main` before any `prepare` of the
round, so that its check meets the CHANGELOG entries `prepare` writes and its counts' lines the
round's first `check:release` report.

**Why.** Two Open rows of `docs/owed-items.md`:
- "A check of the CHANGELOG's first line, which becomes the tag annotation" (dl-028 D1; plan-087
  point 2; dl-052 D2), its place ruled by plan-090 (point 6): `check:packs`. `publish:pack`
  annotates the tag with the first line of `CHANGELOG.md` that starts `- <version>`, alone
  (`changelogEntry`, `src/publish.ts`); at task-104 that line wrapped mid-sentence, which would
  have truncated `governance/wingfoil-dogfood@1.0.0`'s annotation, and only a reading by hand
  caught it (plan-087 point 2).
- "`npm run check:release`'s report: the counts' lines" (task-106's rehearsal; plan-089's close):
  for `npm run -s wingfoil -- workflow list` the report keeps the last line of its JSON (`}`), and
  for `publish:pack --dry-run` its last line ("- Not pushed: …"), neither a count (plan-090 point
  7).

**What exists today** (`main` at `4a7aab6b`):
- `check:packs` (`src/check-packs.ts`): the per-pack rules, `packProblems`; the layout rule
  already requires `CHANGELOG.md` in every pack (`src/layout-rules.ts`, `REQUIRED_FILES`, spec-001
  §6.1), and `resolve` applies the layout rule during composition (`src/resolve.ts`); nothing reads
  a CHANGELOG's content. The README rules check that section 9 links it (`src/readme-rules.ts`).
  `validate` and `publish:pack`'s publication validation run `check:packs` over the whole tree.
  spec-001 §18 says "the composer refuses what they reject"; a CHANGELOG is never composed.
- The six published packs' CHANGELOGs pass the rule of criterion 1 today: each first entry
  `- <version>` with its `pack.yaml`'s version, its first line a sentence ending with `.`, at most
  98 characters (`base`'s file has no heading, the others `# Changelog`).
- Under `tests/fixtures/`, 33 pack CHANGELOGs (and `intake/report`'s, not a pack): a heading only
  in `merge/example-1`, `merge/example-2` and `resolve/full`; in the golden tree
  (`compose/tree`), five bare `- 1.0.0` (`blueprint/web-service`, `methodology/kanban`,
  `phase/inception/lean`, `stage/production`, `team-mode/agent-first`), the others a sentence.
  Generated trees: `tests/support/pack-tree.ts`'s `writePack` writes `# <id>` alone (23 test files
  use it); `tests/publish.test.ts`'s `repository()` appends `- 1.0.0: first version.` and its
  `bump()` appends the new version's entry after the existing one. No recorded digest covers a
  CHANGELOG (`tests/digest.test.ts` uses its own inline files).
- `src/check-release.ts`: `countsOf` reads a command's last non-empty line, except `npm test`'s
  counts and the evidence's `## Validation` section. The dry run prints the Publication's lines
  (`- Tag: …`, `- Catalog commit: …`, `- Digest: …`, `- WingFoil range: …`, then "- Not pushed").
  `workflow list` prints one JSON object whose `workflows` array lists the workflows (16 on
  `main`).

## Acceptance

`npm run build` precedes the commands.
1. **The rule** (`check:packs`, plan-090 point 6), in a module of its own called from
   `packProblems` (not from `packLayoutProblems`, so the composer does not run it), for every pack
   of the tree whose `pack.yaml` passes its schema (a pack that fails it has no `version` to
   compare and is not checked), on its `CHANGELOG.md`:
   - lines before the first entry are blank or a heading (a line starting `#`), nothing else;
   - the first entry is the first line starting `- `, and runs up to the next line starting `- `
     or the end of the file; only the first entry is checked;
   - it starts `- <version>` followed by `:` or a space, `<version>` equal to `pack.yaml`'s
     `version`;
   - its first line is a whole sentence: it ends with `.` and is at most 100 characters counted
     in code points, the `- ` included (as `check:texts` counts, dl-046; the line `publish:pack`
     reads into the tag annotation);
   - its later lines are each blank or indented by at least two spaces.

   A file with no entry (empty, or a heading only) fails, its problem on line 1. Each failure is
   one problem, rule `changelog`, the file and its line, a message naming the pack, what was found
   and what is expected, and dl-028 D1 as its source. A missing file stays the layout rule's
   problem, not a second one.
2. **spec-001 §18** gains the rule as one bullet under "`pack.yaml` and the pack directory",
   saying the composer does not apply it (a CHANGELOG is never composed); amended in place under
   plan-090 (point 6, ruling 6), the approver's OK at this task's backlog gate approving the rule
   and the merge OK approving the text, with a dated Execution Note on spec-001.
3. **The test trees,** each CHANGELOG passing criterion 1 where a test runs the lint over it, its
   entry a sentence and its version its `pack.yaml`'s:
   - `compose/tree` (run by `check:packs`, by CI's `validate --tree`, and read by `index` and the
     README generation): its five bare entries made sentences;
   - `merge/example-1`, `merge/example-2`, `resolve/full`: an entry added to each pack (no test
     lints them; plan-090 point 6 asks for it);
   - `software-exit` and `feedback-exit`: already passing, unchanged;
   - `writePack` (`tests/support/pack-tree.ts`): `# <id>`, then `- <version>: first version.`
     (the line `tests/publish.test.ts` expects in the tag annotation); `tests/publish.test.ts`'s
     `bump()` writes the new version's entry first; the appends of `- 1.0.0: first version.` in
     `tests/publish.test.ts`'s `repository()` and in `tests/feedback-note.test.ts` dropped as
     redundant;
   - `intake/report`: not a pack, unchanged.

   A test that expects a tree to fail for another reason keeps failing for that reason only. Any
   index, report or output expectation the edit changes is re-recorded and listed in the Design.
   The six published packs' CHANGELOGs are not changed.
4. **The counts' lines** (`check:release`, plan-090 point 7): for `npm run -s wingfoil --
   workflow list`, the line `workflows: <n>`, `<n>` the length of the `workflows` array of its
   standard output parsed as JSON (not JSON, or no such array: the last-line rule as today); for
   the dry run's `publish:pack --dry-run`, its `- Tag: …` and `- Catalog commit: …` lines (either
   missing: the last-line rule as today). Every other command's counts' lines as task-106
   criterion 4 wrote them.
5. **Red first** (dl-018). Before criteria 1, 3 and 4 are built, new tests fail and the red run's
   command and failing count are recorded: in a test file of the rule's own (or
   `tests/check-packs.test.ts`), a pack whose first entry names another version; one whose first
   line wraps mid-sentence (no final `.`); one over 100 characters; an empty file; one with a
   heading only; one with text other than a heading before the first entry; one with a bare
   `- <version>`; one whose entry's later line is not indented; in `tests/check-release.test.ts`,
   the two new counts' lines and their fallbacks. Regression guards that pass at the red run (a
   passing file with a heading and one without; a missing file reported once, by the layout rule)
   are not part of its failing count.
6. **The rest unchanged.** The diff touches only the rule's module and `src/check-packs.ts`'s
   use of it, `src/check-release.ts`, their tests, the fixture CHANGELOGs, the test helpers of
   criterion 3 (`tests/support/pack-tree.ts`, `tests/publish.test.ts`,
   `tests/feedback-note.test.ts`) and the expectations it lists, spec-001, this task and plan-090.
   No workflow or directive text changes (`pack-release-cycle` › `prepare` says "write the
   CHANGELOG.md entry"; the rule's message teaches the shape). No dependency is added
   (`package-lock.json` unchanged).
   `npm test`, `lint` and the other checks of the CI pass, read from the branch CI's jobs and
   dl-039's local list (criterion 7), not run a second time; `npm run check:texts -- --base
   origin/main` exits 0 on the task's branch.
7. **dl-039's checks** on the frozen commit: the branch CI once, every job's duration recorded, and
   the local list on Node.js 22.21.0 from a clean tree after `npm ci` and the build.
8. **Delivery** (`tooling-delivery` v5 `deliver`; plan-090 point 3). The branch
   `task/task-107-…` from `main`, in a worktree; the privacy check of the diff recorded
   (`repository-practice` rule 2); on the approver's OK the merge `--no-ff` into `main`, pushed by
   the approver (plan-090 ruling 13, where `deliver` says "and push"; recorded here).
9. **The check on `main`** (dl-045): `npm run check:packs` exits 0 on `main` after the merge, read
   from `main`'s CI on the merge, its run id recorded here and in plan-090; then the close commit
   and `approved → done`. A red check stops the close: the task stays `approved`, the finding goes
   to the approver, and its fix is a task or a bug of its own.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019).
     An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->

- 2026-11-27: independent review of the body (dl-017): approve after amendments; one blocker, five
  should-fix, six nits, all applied in the next commit. **Blocker:** the generated test trees
  (`writePack`'s `# <id>` alone; `bump()` appending the new entry second) would turn the suite
  red outside the allowed diff: criterion 3 names them, criterion 6 allows their helpers.
  **Should-fix:** criterion 3 lists the trees by name; criterion 2's amendment path as spec-001's
  precedents (backlog OK for the rule, merge OK for the text) and the composer not applying it;
  the §18 citation and the rule's module outside `packLayoutProblems`; where the first entry ends,
  a pack failing its schema not checked; the empty file in the red list, the passing guards out of
  its count. **Nits:** the fixture counts and the five bare entries; code points, the `- `
  included; `#` headings, dl-028 D1 as source, line 1; standard output as JSON; ruling 13 in
  criterion 8; no workflow or directive text changes.
- 2026-11-27: re-review: approve after amendments; one should-fix, one nit, both applied in the
  submit's commit (`ba110496`). **Should-fix:** `writePack`'s line fixed as `- <version>: first
  version.`, the line `tests/publish.test.ts` expects in the tag annotation (`changelogEntry`
  takes the first match), the redundant appends dropped. **Nit:** `tests/feedback-note.test.ts`
  named in criterion 6.
- 2026-11-27: correction: the re-review's amendment was meant for a commit of its own before
  `submit`; its `check:texts` failed (one line of 113 characters in criterion 6), and the `memory
  submit` that followed committed the amendment with that line in `ba110496` (`draft → pending`).
  The line is reflowed in the next commit; the Acceptance's text is unchanged.
