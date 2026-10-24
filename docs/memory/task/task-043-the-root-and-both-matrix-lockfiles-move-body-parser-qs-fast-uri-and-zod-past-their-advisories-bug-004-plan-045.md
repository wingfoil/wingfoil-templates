---
id: task-043-the-root-and-both-matrix-lockfiles-move-body-parser-qs-fast-uri-and-zod-past-their-advisories-bug-004-plan-045
type: task
title: "The root and both matrix lockfiles move body-parser, qs, fast-uri and zod past their advisories (bug-004, plan-045)"
status: draft
pack: ""            # tooling task (bug-004; tooling-change › deliver, plan-045)
depends_on: []
tags: ["tooling","ci","dependencies"]
---

## Context

bug-004 (approved 2026-10-24): six advisories on `body-parser`, `zod` (high) and `fast-uri`
(moderate), all transitive, turn every CI run red at "Audit the root lockfile" since `main`'s run
40071365400 (`1dd597b`), the day after task-042 fixed bug-003. `body-parser` and `zod` come with
`wingfoil@0.2.2` (development-only in the root, runtime inside the matrix installs); `fast-uri`
with `ajv`, the tooling's runtime dependency that adr-003 reviewed. The approver ruled
(2026-10-24): this task, as task-042 for bug-003, before `template.frontmatter`.

## Acceptance

As task-042, a lockfile-only change, with no code and no test: dl-018 R1's test does not apply,
since a test asserting a transitive version would duplicate `npm audit`, which needs the network
(the `testing` directive keeps tests offline), and would go stale at the next advisory;
`check:pins` covers direct pins only. The red and green are `npm audit`'s exit codes, recorded
with the command and its output; the Design's red steps (R3) are those runs.

1. **Red** (recorded): on `main`, `npm audit` in the root ("3 vulnerabilities (1 moderate, 2
   high)"), in `src/matrix/wingfoil-0.2.2` and in `src/matrix/wingfoil-0.3.0` exit 1, with bug-004's
   six advisories, each summary line recorded; the CI's first red run, 40071365400 (`1dd597b`), is
   cited.
2. **The fix:** `npm audit fix --package-lock-only` in the three folders; the fix commit's diff is
   the three `package-lock.json` files (15, 15 and 6 lines): in the root and in 0.2.2,
   `body-parser` 2.3.0 → 2.4.0, `qs` 6.16.0 → 6.16.1 (`body-parser` 2.4.0 requires `^6.16.1`),
   `fast-uri` 3.1.8 → 3.1.9, `zod` 4.6.5 → 4.6.7; in 0.3.0, `body-parser` only. Every
   `package.json` and `.wingfoil/dna.yaml` are unchanged. If `audit fix` moves anything else, or
   to other versions, it goes to the approver (dl-019) before any other approach.
3. **adr-003's review, for `fast-uri`** (the moved package in its runtime tree): `npm audit` exits 0
   in the root and in every `src/matrix/wingfoil-*/`; in the root, after `npm ci`,
   `npm audit signatures` verifies (its count recorded); `fast-uri` 3.1.9's licence is still
   BSD-3-Clause, as 3.1.8's was; adr-003 records `ajv`'s dependencies as MIT, an inaccuracy
   corrected by a follow-up noted in plan-045, not here. The other moved packages' licences are
   recorded unchanged (`body-parser` and `zod` MIT, `qs` BSD-3-Clause).
4. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`,
   `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check` and
   `workflow list` exit 0; the CI run on the branch is `success`, both jobs, its matrix audit step
   run and passed, and recorded.
5. **After the merge:** `main`'s CI is `success` and recorded in bug-004's and plan-045's notes.

## Design

- **Red:** on the branch, before the fix, `npm audit` in the three folders (the root after
  `npm ci`), exit codes and summary lines recorded.
- **Fix commit:** `npm audit fix --package-lock-only` in each folder; the diff checked against
  Acceptance 2; one commit, `fix(deps): …`.
- **Green and adr-003's review:** `npm audit` in the three folders; `npm ci` then
  `npm audit signatures` in the root; `fast-uri`'s licence read from the lockfile; the clean-clone
  checks on both Node.js versions; the CI.
- **Branch:** `task/task-043-lockfiles-advisories`.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-24: independent review of the body: approve after amendments. Applied: the dl-018 reasons
  and R3's link as in task-042; the diff's size and why `qs` moves; other versions go to the
  approver too; the red's summary lines; adr-003's licence record, a follow-up; the matrix audit
  step in the green CI.

