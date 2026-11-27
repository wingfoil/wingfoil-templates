---
id: task-107-check-packs-checks-a-pack-s-changelog-first-entry-and-check-release-s-counts-lines-carry-a-count-plan-090-task-107
type: task
title: "check:packs checks a pack's CHANGELOG first entry, and check:release's counts' lines carry a count (plan-090 task-107)"
status: draft
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
  §6.1); nothing reads its content. The README rules check that section 9 links it
  (`src/readme-rules.ts`). The composer does not read a CHANGELOG, so the new rule is the lint's
  only (spec-001 §17's "the composer refuses what the lint rejects" concerns composed content).
- The six published packs' CHANGELOGs: each first entry `- <version>` with its `pack.yaml`'s
  version, its first line a sentence ending with `.` within 100 characters (`base`'s file has no
  heading, the others `# Changelog`).
- 34 fixture CHANGELOGs under `tests/fixtures/`: some a heading only (`merge/example-1`,
  `merge/example-2`, `resolve/full`), some `- 1.0.0` alone (the golden tree's
  `methodology/kanban`), some a sentence.
- `src/check-release.ts`: `countsOf` reads a command's last non-empty line, except `npm test`'s
  counts and the evidence's `## Validation` section. The dry run prints the Publication's lines
  (`- Tag: …`, `- Catalog commit: …`, `- Digest: …`, `- WingFoil range: …`, then "- Not pushed").
  `workflow list` prints one JSON object whose `workflows` array lists the workflows (16 on
  `main`).

## Acceptance

`npm run build` precedes the commands.
1. **The rule** (`check:packs`, plan-090 point 6), for every pack of the tree, on its
   `CHANGELOG.md`: lines before the first entry may be blank or a heading (`# …`), nothing else;
   the first entry is the first line starting `- `; it starts `- <version>` followed by `:` or a
   space, `<version>` equal to `pack.yaml`'s `version`; that first line is a whole sentence: it ends
   with `.` and is at most 100 characters; the entry's further lines, if any, are indented. A file
   with no entry fails. Each failure is one problem, rule `changelog`, the file and its line, a
   message naming the pack, what was found and what is expected, and plan-090 or dl-028 as its
   source. A missing file stays the layout rule's problem, not a second one.
2. **spec-001 §18** gains the rule as one bullet under "`pack.yaml` and the pack directory",
   amended in place with a dated Execution Note on spec-001 (dl-020), the approver's OK being this
   task's acceptance into the backlog.
3. **The fixtures.** Every fixture tree that a test expects to pass `check:packs`, or that a
   composition, `publish:pack` or the index reads with the lint, gets CHANGELOGs that pass
   criterion 1 (a sentence entry for each pack, its version its `pack.yaml`'s); a tree that a
   test expects to fail for another reason keeps failing for that reason only. Any digest,
   index or report expectation the edit changes is re-recorded, and each such change is listed in
   the Design. The six published packs' CHANGELOGs are not changed.
4. **The counts' lines** (`check:release`, plan-090 point 7): for `npm run -s wingfoil --
   workflow list`, the line `workflows: <n>`, `<n>` the length of its JSON's `workflows` array
   (its output not JSON, or no such array: the last-line rule as today); for the dry run's
   `publish:pack --dry-run`, its `- Tag: …` and `- Catalog commit: …` lines (either missing: the
   last-line rule as today). Every other command's counts' lines as task-106 criterion 4 wrote
   them.
5. **Red first** (dl-018). Before criteria 1, 3 and 4 are built, new tests fail and the red run's
   command and failing count are recorded: in `tests/check-packs.test.ts` (or a test file of the
   rule's own), a pack whose first entry names another version; one whose first line wraps
   mid-sentence (no final `.`); one over 100 characters; one with a heading only; one with text
   other than a heading before the first entry; one with a bare `- <version>`; a passing file
   with a heading and one without; a missing file reported once; in
   `tests/check-release.test.ts`, the two new counts' lines and their fallbacks.
6. **The rest unchanged.** The diff touches only the rule's module and `src/check-packs.ts`'s
   use of it, `src/check-release.ts`, their tests, the fixture CHANGELOGs and the expectations
   criterion 3 lists, spec-001, this task and plan-090. No dependency is added (`package-lock.json`
   unchanged). `npm test`, `lint` and the other checks of the CI pass, read from the branch CI's
   jobs and dl-039's local list (criterion 7), not run a second time; `npm run check:texts --
   --base origin/main` exits 0 on the task's branch.
7. **dl-039's checks** on the frozen commit: the branch CI once, every job's duration recorded, and
   the local list on Node.js 22.21.0 from a clean tree after `npm ci` and the build.
8. **Delivery** (`tooling-delivery` v5 `deliver`; plan-090 point 3). The branch
   `task/task-107-…` from `main`, in a worktree; the privacy check of the diff recorded
   (`repository-practice` rule 2); on the approver's OK the merge `--no-ff` into `main`, pushed by
   the approver.
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
