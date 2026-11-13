---
id: task-091-the-matrix-lockfiles-of-wingfoil-0.2.2-0.3.0-and-0.3.1-and-the-root-lockfile-move-hono-and-hono-node-server-past-their-advisories-bug-016-plan-072-task-a
type: task
title: "The matrix lockfiles of WingFoil 0.2.2, 0.3.0 and 0.3.1 and the root lockfile move hono and @hono/node-server past their advisories (bug-016, plan-072 task A)"
status: approved
pack: ""            # tooling task (tooling-delivery v4), plan-072 task (A)
depends_on: []
tags: ["tooling","ci","dependencies"]
---

## Context

plan-072's only task (points 1 … 5, the approver's OK of 2026-11-13), fixing bug-016 (`major`):
the CI's "Audit every matrix release's lockfile" fails on every push since advisories on `hono`
(≤4.13.15) and `@hono/node-server` (2.0.0–2.1.5) were published (first red run 43390069004 on
`c7ea0e33`; the last green 43311916342 on `d9946a9d`).

What exists (`main` at plan-072's `submit`):
- `src/matrix/wingfoil-0.2.2/package-lock.json` (`hono` 4.13.13, `@hono/node-server` 2.1.4),
  `-0.3.0` (4.13.13, 2.1.5) and `-0.3.1` (4.13.14, 2.1.5): runtime dependencies of the pinned
  `wingfoil`, through `@modelcontextprotocol/sdk`; `npm audit` exits 1 in each. `-0.3.2` (4.13.16,
  2.1.6) passes.
- The root `package-lock.json` (4.13.13, 2.1.3), through `wingfoil@0.2.2`, a `devDependency`:
  `npm audit --omit=dev` passes, the whole-tree audit warns (dl-035 R1).
- The CI's matrix cache is keyed by `hashFiles('src/matrix/wingfoil-*/package-lock.json')`
  (`ci.yml`), so a changed matrix lockfile installs its release afresh.

## Acceptance

The change is a lockfile only, with no code and no test: dl-018 R1's test does not apply, since a
test asserting a transitive version would duplicate `npm audit`, which needs the network (the
`testing` directive keeps tests offline), and would go stale at the next advisory; `check:pins`
covers the pins only (as task-042). The red and green are `npm audit`'s exit codes, recorded with
the command and its summary line; the Design's red steps are those runs.

1. **Red** (recorded): on the branch before the fix, `npm audit` in `src/matrix/wingfoil-0.2.2`,
   `-0.3.0`, `-0.3.1` and in the root (after `npm ci`) exit 1 ("2 moderate severity
   vulnerabilities"); the CI's first red run, 43390069004, cited.
2. **The fix** (plan-072 point 1): `npm audit fix --package-lock-only` in the three matrix folders
   and the root; the fix commit's diff is the four `package-lock.json` files, moving only the
   `@hono/node-server` and `hono` entries (expected, not required: 2.1.8 and 4.13.18, as bug-016's
   reproduction found), the root's `dev` flags kept; every `package.json`, the
   pinned `wingfoil` versions, `.wingfoil/dna.yaml`, the root `overrides` and
   `src/matrix/wingfoil-0.3.2/` unchanged. If `audit fix` moves anything else, it goes to the
   approver (dl-019) before any other approach.
3. **adr-003's review, for the moved packages** (point 3): `npm audit` exits 0 in the root and in
   every `src/matrix/wingfoil-*/`; in the root, after `npm ci`, `npm audit signatures` verifies
   (its count recorded); the moved versions' licences, read from the lockfiles, unchanged (MIT).
   `npm run check:pins` passes.
4. **Checks on the frozen commit** (point 4, dl-039): the branch CI green, every job's duration
   recorded (R3, G12); from a clean worktree on Node 22.21.0, after `npm ci` and `npm run build`:
   `npm run validate:publication`, the golden tree in publication mode (`npm run
   validate:publication -- --tree tests/fixtures/compose/tree --param project_name=Golden`) and
   `npm run -s wingfoil -- workflow list`, each exit 0.
5. **After the merge** (point 5): `main`'s CI green, its run id and every job's duration recorded
   in bug-016's and plan-072's notes.

## Design

- **Red:** on the branch, before the fix, `npm audit` in each of the three matrix folders and in
  the root after `npm ci`, the exit codes and summary lines recorded.
- **Fix commit:** `npm audit fix --package-lock-only` in each folder; the diff checked to touch only
  the two packages' entries; one commit, `fix(deps): …`.
- **Green and adr-003's review:** `npm audit` in the root and in the four matrix folders; `npm ci`
  then `npm audit signatures` in the root; the licences read from the lockfiles; `check:pins`;
  the checks of Acceptance 4.
- **Branch:** `task/task-091-hono-lockfiles`.

## Execution Notes
- 2026-11-13: body review: approve, three nits applied: the diff "the two packages' entries"
  rather than three lines each, the expected versions cited, the root's `dev` flags kept.
- 2026-11-13, red (Acceptance 1): on the branch before the fix, `npm audit` exit 1, "2 moderate
  severity vulnerabilities", in `src/matrix/wingfoil-0.2.2`, `-0.3.0`, `-0.3.1` and in the root
  (after `npm ci`); exit 0, "found 0 vulnerabilities", in `-0.3.2`; the CI's first red run
  43390069004.
- 2026-11-13, fix (Acceptance 2, `247ced98`): `npm audit fix --package-lock-only --ignore-scripts`
  in the three matrix folders and the root; the diff is the four `package-lock.json` files (12
  lines in each matrix lockfile, 14 in the root), the `@hono/node-server` entry 2.1.3/2.1.4/2.1.5
  → 2.1.8 and the `hono` entry 4.13.13/4.13.14 → 4.13.18, as expected; in the root,
  `@hono/node-server`'s `peerDependencies` `hono: "^4"` → `"^4 || ^5.0.0-0"`, inside its own entry;
  the root's `dev` flags kept; no `package.json`, pin, `.wingfoil/dna.yaml`, `overrides` or
  `-0.3.2` change.
- 2026-11-13, green and adr-003's review (Acceptance 3): `npm audit` exit 0 in the root and in the
  four matrix folders; in the root, after `npm ci`, `npm audit signatures`: 190 packages with
  verified registry signatures, 43 with verified attestations; `hono` and `@hono/node-server`
  still MIT in the four lockfiles; `npm run check:pins` exit 0.
- 2026-11-13, build review: approve, two nits applied here: `--ignore-scripts` is a harmless
  addition to plan-072's `--package-lock-only` (no script runs without an install); the
  `peerDependencies` change shows in the root alone because the matrix lockfiles already held
  `hono: "^4 || ^5.0.0-0"`. The reviewer reran `npm audit` on copies (main red, the branch green)
  and matched both integrity values with the registry.
- 2026-11-13, checks on the frozen `1e597d7e` (Acceptance 4, dl-039): the branch CI, run
  43399534655, `success`: `validate (22.12.0, 1)` 7 min 1 s, `(22.12.0, 2)` 5 min 41 s,
  `(22.21.0, 1)` 7 min 52 s, `(22.21.0, 2)` 8 min 44 s, every job under 20 minutes (G12), the
  matrix releases installed afresh (the cache key moved with the lockfiles). From a clean worktree
  on Node 22.21.0, after `npm ci` and `npm run build`: `npm run validate:publication` exit 0
  (`matrix: publication, 22 runs, 0 failed`), the golden tree in publication mode exit 0 (26 runs,
  0 failed), `npm run -s wingfoil -- workflow list` exit 0. The privacy check of the branch's diff
  found no local or scratch path, no private project and no session.
