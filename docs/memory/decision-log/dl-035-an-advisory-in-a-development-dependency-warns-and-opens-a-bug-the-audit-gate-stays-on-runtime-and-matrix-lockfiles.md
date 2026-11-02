---
id: dl-035-an-advisory-in-a-development-dependency-warns-and-opens-a-bug-the-audit-gate-stays-on-runtime-and-matrix-lockfiles
type: decision-log
title: "An advisory in a development dependency warns and opens a bug, the audit gate stays on runtime and matrix lockfiles"
status: draft
tags: ["process","ci","dependencies"]
---

## Context

The CI's step "Audit the root lockfile" runs `npm audit` on the whole root tree, and fails on any
advisory at any severity; "Audit every matrix release's lockfile" does the same for each
`src/matrix/wingfoil-*/` lockfile (`.github/workflows/ci.yml`). An advisory published in the
registry turns every branch and `main` red with no commit of this repository causing it, and no
change can merge with a green CI until a bug and its task fix it. Three times so far:
- bug-003 (`ip-address`, 2026-10-22): a development dependency of the root, through the WingFoil
  pin, and the 0.2.2 matrix lockfile;
- bug-004 (`body-parser`, `qs`, `zod`, `fast-uri`): development dependencies of the root, except
  `fast-uri` in the runtime tree adr-003 reviewed, and both matrix lockfiles;
- bug-009 (`minimatch`, 2026-10-31): development dependencies of the lint only; `npm audit
  --omit=dev` exits 0 and the matrix lockfiles audit clean. `main` was red for about one day (runs
  41196364111 … 41298773055); task-070 waited, task-067 waited over a day. No fixed version existed
  within the ranges, so the answer was an exact npm override (task-071), which left two rows of
  `docs/owed-items.md`.

The row "CI policy for advisories in transitive dependencies" (bug-004's note; bug-009) asks for a
rule. Candidate GOV-1 of the retrospective dl-034 (C1); the inventory of 2026-11-02, §4.4. This
repository's adoption of the packs (W10) does not change its CI.

## Options

1. **Keep the gate as it is**, a bug per advisory. Rejected: `main` red for a day for a defect no
   published pack or runtime path carries, three times in ten days.
2. **The root's gate on the runtime tree only; an advisory reaching only development dependencies
   gives a visible warning and a bug within a day; the matrix lockfiles stay blocking.**
3. **An allowlist of advisories with an expiry date** (an `audit-ci`-style file). Rejected for now:
   a new tool or script to maintain (adr-003's dependency rule), and every advisory still blocks
   until someone writes its entry.
4. **No audit of development dependencies.** Rejected: the lint and the WingFoil pin run in CI and
   on every contributor's machine; a defect there should still be fixed.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **A1 — Option 2.** The step "Audit the root lockfile" runs `npm audit --omit=dev` and stays
  blocking. A second step runs `npm audit` on the whole root tree, does not fail the job, and writes
  a warning annotation naming the advisories when it finds any. "Audit every matrix release's
  lockfile" is unchanged and blocking: those lockfiles are the WingFoil installs every validation
  and run uses.
- **A2 — The bug.** A warning of the second step, read on `main`'s CI after a push
  (`repository-practice` rule 3), opens a bug within a day: severity from the advisory and the path
  (a development dependency only: at most `major`), fixed by moving the lockfile within the ranges
  when a fix exists (bug-003's and bug-004's precedent), otherwise by an exact override or by the
  approver's ruling. The warning stays until the bug's fix is merged.
- **A3 — What it would have changed:** bug-009 alone; bug-003 and bug-004 also reached a matrix
  lockfile, and `fast-uri` the runtime tree, so they would have blocked as before.
- **A4 — Applied after approval** by a dl actions plan: a tooling task (`tooling-delivery`) changing
  `.github/workflows/ci.yml` and `tests/ci-workflow.test.ts`, red first (dl-018); the rule written in
  the directive `repository-practice` beside rule 3; the row "CI policy for advisories in transitive
  dependencies" moved to Closed by that task. The override's rows stay as they are.

## Execution Notes
<!-- An owed item gets its row in docs/owed-items.md (repository-practice rule 4). -->
- 2026-11-02: written under plan-059 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-034, as the approver chose at the checkpoint (inventory P3).
