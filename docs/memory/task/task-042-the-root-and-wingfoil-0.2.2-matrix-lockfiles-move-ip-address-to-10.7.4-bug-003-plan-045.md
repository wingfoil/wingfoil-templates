---
id: task-042-the-root-and-wingfoil-0.2.2-matrix-lockfiles-move-ip-address-to-10.7.4-bug-003-plan-045
type: task
title: "The root and WingFoil 0.2.2 matrix lockfiles move ip-address to 10.7.4 (bug-003, plan-045)"
status: in-progress
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

The change is a lockfile only, with no code and no test: dl-018 R1's test does not apply, since a
test asserting a transitive version would duplicate `npm audit`, which needs the network (the
`testing` directive keeps tests offline), and would go stale at the next advisory; `check:pins`
covers direct pins only. The red and green are `npm audit`'s exit codes, recorded with the command
and its output; the Design's red steps (R3) are those runs.

1. **Red** (recorded): on `main`, `npm audit` in the root and in `src/matrix/wingfoil-0.2.2` exit 1
   with GHSA-rxp7-6hxx-x8q5 ("1 moderate severity vulnerability"); the CI's first red run,
   39831936093 (`4d84334`), is cited.
2. **The fix:** `npm audit fix --package-lock-only` in the root and in `src/matrix/wingfoil-0.2.2`;
   the fix commit's diff is the two `package-lock.json` files, three lines in each, `ip-address`
   10.7.3 → 10.7.4 (`version`, `resolved`, `integrity`). `src/matrix/wingfoil-0.3.0/`'s lockfile,
   every `package.json` and `.wingfoil/dna.yaml` are unchanged: no direct dependency moves. If
   `audit fix` moves anything else, it goes to the approver (dl-019) before any other approach.
3. **adr-003's review, for the moved package:** `npm audit` exits 0 in the root and in every
   `src/matrix/wingfoil-*/`; in the root, after `npm ci`, `npm audit signatures` verifies (its
   count recorded); `ip-address` 10.7.4's licence is still MIT.
4. **Green:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`, `lint`,
   `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check` and
   `workflow list` exit 0; the CI run on the branch is `success`, both jobs, and recorded.
5. **After the merge:** `main`'s CI is `success` and recorded in bug-003's and plan-045's notes.

## Design

- **Red:** on the branch, before the fix, `npm audit` in the root (after `npm ci`) and in
  `src/matrix/wingfoil-0.2.2`, their exit codes and summary lines recorded.
- **Fix commit:** `npm audit fix --package-lock-only` in each folder; the diff checked to be the six
  lines of `ip-address`; one commit, `fix(deps): …`.
- **Green and adr-003's review:** `npm audit` in the root and in both matrix folders; `npm ci` then
  `npm audit signatures` in the root; `ip-address` 10.7.4's licence read from the lockfile; the
  clean-clone checks on both Node.js versions; the CI.
- **Branch:** `task/task-042-lockfiles-ip-address`.

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. In a tooling task, each red run: the
     command and its failing count (dl-018). An Acceptance criterion that cannot hold: why, the
     proposed reading and the approver's ruling with its date; the Acceptance text stays as
     approved (dl-019). -->
- 2026-10-23: independent review of the body: approve after amendments. Applied: why no test (a
  lockfile-only change; the red and green are the audit's exit codes); adr-003's review for the
  moved package; the fix commit's diff and what stays unchanged; the red run's id; the Node.js
  versions.
- 2026-10-23, red (on the branch, before the fix, Node.js 22.21.0): `npm audit` after `npm ci` in
  the root, exit 1, "1 moderate severity vulnerability" (GHSA-rxp7-6hxx-x8q5, `ip-address
  <=10.7.3`); in `src/matrix/wingfoil-0.2.2`, exit 1, the same. The CI's first red run:
  39831936093 (`4d84334`).
- 2026-10-23, fix (`8c90270`): `npm audit fix --package-lock-only` in each folder, exit 0; the diff
  is the two lockfiles, three lines each; the new integrity equals the 0.3.0 lockfile's.
- 2026-10-23, green and adr-003's review: `npm audit` "found 0 vulnerabilities" in the root and in
  both matrix folders; in the root after `npm ci`, `npm audit signatures`: 189 packages with
  verified registry signatures, 41 with verified attestations; `ip-address` 10.7.4's licence MIT.
  From clean clones of `8c90270` on Node.js 22.21.0 and 22.12.0: `npm ci`, `npm test` (941 of
  941), `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check` and
  `workflow list` exit 0. Independent review of the branch: approve. CI run 39909017029:
  `success`, both jobs.

