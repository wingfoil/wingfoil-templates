---
id: dl-054-a-pack-release-s-clean-clone-checks-run-by-one-committed-command
type: decision-log
title: "A pack-release's clean-clone checks run by one committed command"
status: draft
tags: ["process","publication","tooling"]
---

## Context

`pack-release-cycle` › `validate` names the matrix, `check:runs` and the adoption run, and asks
for commands and exit codes; the clean-clone list comes from the plans (plan-077 point 5, plan-087
point 4) and the records (prel-007, prel-008 › Validation): from clean clones of the submitted
head, the WingFoil matrix cache copied from the checkout after `npm ci`, on Node.js 22.21.0 then
22.12.0, `npm ci`, the build, `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`,
`index -- --check`, `validate`, the golden step, the four overlays, `workflow list`, `check:runs`,
`npm audit --omit=dev` in the root and `npm audit` in `src/matrix/wingfoil-*/`; and on 22.21.0
only, `validate:publication -- --evidence` and the dry run of `publish:pack` in a clone with its
remote removed. No command runs that list: it is written as a script for each release, outside
the repository. At prel-008 its first pass ran `validate:publication` before the build and
audited the local matrix cache instead of `src/matrix/wingfoil-*/` (prel-008 › Execution Notes,
`validate`); at task-100 a list written per run, dl-039's, ran the golden step in the wrong mode
first (the inventory of 2026-11-21, §4). dl-039 (R1, R2) names a task's checks, not how they
run. The adoption (W10) ships no such command. Candidate
GOV-3 of the inventory of 2026-11-25 (dl-052 C2).

## Options

1. **As today:** a script written for each release. Rejected: a list written per run erred at
   task-100 and at prel-008, and the list is in the records only.
2. **One committed command** (`npm run check:release`, its options the tooling task's): it clones
   HEAD into a directory outside the tree, refusing a dirty tree; copies the matrix cache as the
   records did; runs the list in its order on each Node.js given, the evidence and the dry run on
   the first; and writes one report (the commit, `node --version` per leg, each command, its exit
   code, the counts' lines) to a path outside the repository, read into the Validation as dl-044
   P1's report is.
3. **The CI only:** `main`'s CI on the submitted head as the clean-clone evidence. Rejected: the
   CI runs no `publish:pack` and no `validate:publication -- --evidence` (`ci.yml` runs plain
   `validate:publication` on a tag only, after the publication), whose report the Validation
   records, and a CI log is kept for a limited time.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **P1 — Option 2.** `npm run check:release` runs the list above in that order, stops at the first
  non-zero exit and says which, and writes its report on a non-zero exit too; it refuses a report
  path inside the repository and a dirty tree; it leaves the working tree as it was. The agent
  runs it at `validate` and records the report's lines in the Validation, a failed run's report
  beside the rerun's; a release whose list changes changes the command, not the record.
- **P2 — Applied after approval** by a dl actions plan: a tooling task (`tooling-delivery`) for the
  command and its tests, red first (dl-018); `pack-release-cycle` 9 → 10 (`validate`: the
  clean-clone checks by `npm run check:release`), in one bump with dl-053's.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-25: written under plan-088 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-052, as the approver kept it at the checkpoint (the inventory of 2026-11-25, P2).
- 2026-11-25: independent review (dl-017, `89390b99`): approve after amendments; no blocker, four
  should-fix (the list's source the plans and records, not `validate`; the evidence and the dry
  run on 22.21.0 only, the cache step named; task-100, not prel-007, for the earlier error; the
  report's commit and Node versions, a dirty tree refused, the cache rule, the flags left to the
  task) and two nits (`ci.yml`'s tag-only `validate:publication`; both reports recorded), all
  applied in the commit that records this note.
