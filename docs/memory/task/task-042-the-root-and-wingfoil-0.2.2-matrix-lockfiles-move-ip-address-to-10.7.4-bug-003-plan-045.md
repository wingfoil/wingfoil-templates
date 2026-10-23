---
id: task-042-the-root-and-wingfoil-0.2.2-matrix-lockfiles-move-ip-address-to-10.7.4-bug-003-plan-045
type: task
title: "The root and WingFoil 0.2.2 matrix lockfiles move ip-address to 10.7.4 (bug-003, plan-045)"
status: draft
pack: ""            # tooling task (bug-003; tooling-change › deliver, plan-045)
depends_on: []
tags: ["tooling","ci","dependencies"]
---

## Context

bug-003 (approved 2026-10-23): advisory GHSA-rxp7-6hxx-x8q5 (moderate) on `ip-address` 10.7.3
turns every CI run red at "Audit the root lockfile", `main` included, since run 39831936093
(`4d84334`). `ip-address` is a transitive development dependency (`wingfoil@0.2.2` →
`@modelcontextprotocol/sdk` → `express-rate-limit` → `ip-address`), in the root lockfile and in
`src/matrix/wingfoil-0.2.2/package-lock.json`; 10.7.4 fixes it, and
`src/matrix/wingfoil-0.3.0/` already holds it. The approver ruled (2026-10-23) that this task
comes first in plan-045: task-041's branch then merges `main` and runs the CI again.

## Acceptance

1. **Red** (dl-018, recorded): on `main`, `npm audit` in the root and in
   `src/matrix/wingfoil-0.2.2` exit 1 with GHSA-rxp7-6hxx-x8q5; the CI's red run is cited.
2. **The fix:** `npm audit fix --package-lock-only` in the root and in `src/matrix/wingfoil-0.2.2`;
   the diff is the two `package-lock.json` files only, `ip-address` 10.7.3 → 10.7.4 (version,
   `resolved`, `integrity`); no `package.json` and no direct dependency changes (adr-003).
3. **Green:** `npm audit` exits 0 in the root and in every `src/matrix/wingfoil-*/`;
   `npm audit signatures` verifies; from clean clones on Node.js 22.21 and 22.12.0, `npm ci`,
   `npm test`, `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`,
   `index -- --check` and `workflow list` exit 0; the CI run on the branch is `success`, both jobs,
   and recorded.
4. **After the merge:** `main`'s CI is `success` and recorded in bug-003's and plan-045's notes.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
