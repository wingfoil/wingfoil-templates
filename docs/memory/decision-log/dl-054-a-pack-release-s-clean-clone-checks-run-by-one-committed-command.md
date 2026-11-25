---
id: dl-054-a-pack-release-s-clean-clone-checks-run-by-one-committed-command
type: decision-log
title: "A pack-release's clean-clone checks run by one committed command"
status: draft
tags: ["process","publication","tooling"]
---

## Context

`pack-release-cycle` › `validate` records the clean-clone checks in the Validation: from clean
clones of the submitted head, on Node.js 22.21.0 then 22.12.0, `npm ci`, the build, `npm test`,
`lint`, `check:pins`, `check:schemas`, `check:packs`, `index -- --check`, `validate`,
`validate:publication -- --evidence`, the golden step, the four overlays, `workflow list`,
`check:runs`, `npm audit --omit=dev` in the root and `npm audit` in `src/matrix/wingfoil-*/`, and
the dry run of `publish:pack` in a clone with its remote removed (prel-007, prel-008 ›
Validation). No command runs that list: it is written as a script for each release, outside the
repository. At prel-008 its first pass ran `validate:publication` before the build and audited the
local matrix cache instead of `src/matrix/wingfoil-*/` (prel-008 › Execution Notes, `validate`);
at prel-007 dl-039's local list ran the golden step in the wrong mode first (the inventory of
2026-11-21, §4). dl-039 (R1, R2) names a task's checks; `pack-release-cycle` › `validate` and the
records name a release's, not how they run. The adoption (W10) ships no such command. Candidate
GOV-3 of the inventory of 2026-11-25 (dl-052 C2).

## Options

1. **As today:** a script written for each release. Rejected: its errors repeat (prel-007,
   prel-008), and its list is in the records only.
2. **One committed command**, `npm run check:release -- --pack <id> --node <path> … --report
   <path>`: it clones the current commit into a directory outside the tree, runs the list in its
   order on each Node.js given, the dry run in a clone with its remote removed, and writes one
   report (each command, its exit code, the counts' lines) to a path outside the repository, read
   into the Validation as dl-044 P1's report is.
3. **The CI only:** `main`'s CI on the submitted head as the clean-clone evidence. Rejected: the
   CI runs no `publish:pack --dry-run` and no `validate:publication -- --evidence`, whose report
   the Validation records, and a CI log is kept for a limited time.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **P1 — Option 2.** `npm run check:release` runs the list above in that order, stops at the first
  non-zero exit and says which, and writes its report on a non-zero exit too; it refuses a report
  path inside the repository; it leaves the working tree as it was. The agent runs it at
  `validate` and records the report's lines in the Validation; a release whose list changes
  changes the command, not the record.
- **P2 — Applied after approval** by a dl actions plan: a tooling task (`tooling-delivery`) for the
  command and its tests, red first (dl-018); `pack-release-cycle` 9 → 10 (`validate`: the
  clean-clone checks by `npm run check:release`), in one bump with dl-053's.

## Execution Notes

<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-25: written under plan-088 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-052, as the approver kept it at the checkpoint (the inventory of 2026-11-25, P2).
