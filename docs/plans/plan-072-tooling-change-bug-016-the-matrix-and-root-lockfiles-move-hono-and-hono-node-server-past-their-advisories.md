---
id: plan-072-tooling-change-bug-016-the-matrix-and-root-lockfiles-move-hono-and-hono-node-server-past-their-advisories
type: plan
title: "tooling-change: bug-016, the matrix and root lockfiles move hono and @hono/node-server past their advisories"
status: active
workflow: "tooling-change"
phase: "deliver"
tags: ["tooling","ci","dependencies"]
---

## Context

bug-016 (`major`, tooling): since advisories on `hono` (≤4.13.15) and `@hono/node-server`
(2.0.0–2.1.5) were published, the CI's "Audit every matrix release's lockfile" step fails on
every push, `main` included (first red run 43390069004 on `c7ea0e33`, both shard-1 jobs), in the
lockfiles of WingFoil 0.2.2, 0.3.0 and 0.3.1; the root lockfile holds them too, through
`wingfoil@0.2.2`, a development dependency, so its whole-tree audit warns (dl-035 R1). No change
merges with a green CI until the matrix lockfiles are fixed, and plan-071's `submit` waits for
`main`'s CI (dl-038 C3). The approver chose on 2026-11-13 a `tooling-change` with one task, as
bug-003 was fixed by task-042 (plan-045).

**`main`'s CI before this plan** (dl-038 C3): run 43390069004 on `c7ea0e33` (plan-070's close and
plan-071's body), `failure` in the matrix audit step only, bug-016's subject; recorded in the
Execution Notes.

## Proposed outline (ruled by the approver before `submit`)

1. **The fix:** `npm audit fix --package-lock-only` in `src/matrix/wingfoil-0.2.2`, `-0.3.0`,
   `-0.3.1` and in the root; the diff is the four `package-lock.json` files, moving
   `@hono/node-server` and `hono` (and nothing else; anything else `audit fix` moves goes to the
   approver, dl-019); every `package.json`, the pinned `wingfoil` versions, `.wingfoil/dna.yaml`,
   the root `overrides` and `src/matrix/wingfoil-0.3.2/` unchanged.
2. **Red and green, as task-042:** a lockfile-only change, with no code and no test (a test of a
   transitive version would duplicate `npm audit`, which needs the network, and go stale): the red
   is `npm audit`'s exit 1 in the three matrix folders and the root (after `npm ci`), on the branch
   before the fix, its summary line per folder recorded with the CI's first red run; the green is
   its exit 0 there, and in `wingfoil-0.3.2`.
3. **adr-003's review of the moved packages:** `npm audit signatures` in the root after `npm ci`
   (its count recorded); the moved versions' licences read from the lockfiles.
4. **Checks** (dl-039): the branch CI green, every job's duration recorded (R3, G12); the CI's
   matrix cache is keyed by the matrix lockfiles, so the branch run installs the moved releases
   afresh; dl-039's local list on Node 22.21.0 from a clean worktree, after `npm ci` and `npm run
   build`: `validate:publication`, the golden tree in publication mode, `workflow list`.
5. **After the merge:** `main`'s CI green, its run id and every job's duration recorded in
   bug-016's and this plan's notes (dl-039 R3); plan-071 resumes.

Not in this plan: any other dependency update; a change to dl-035's rule. The rows of
`docs/owed-items.md` due at "the next dependency update" (`check:pins` and `overrides`, the
`minimatch` override) stay open: a lockfile-only move of transitive dependencies, with no
`package.json` change, is not that trigger (for the approver at the outline's OK).

## Steps

1. **This plan and bug-016:** independent reviews (dl-017); the approver triages bug-016 and gives
   the OK on the outline; `submit` (`draft → active`).
2. **task-091** (`tooling-delivery` v4, `pack: ""`): its body reviewed, `pending → backlog` by the
   approver, on its branch `task/task-091-hono-lockfiles`; design, build, build review, checks,
   `in-review`, the approver's approval and merge OK; merged `--no-ff`, `main`'s CI read.
3. **Close:** bug-016's notes (the fix commit, the branch and `main` runs; bug-016 stays
   `approved`); dl-020: the errata and rulings per tech-spec listed (none expected), the
   approver's ruling recorded; this plan `active → done`.

## Handoff

- **The approver:** bug-016's triage; the OK on the outline; task-091's `backlog`, approval and
  merge OK.
- **Alone:** the task's body, design, build, checks and notes; the reviews by an independent
  reviewer (a subagent with no part in the text). No pull request; files staged by name.
- **Done when:** `npm audit` exits 0 in every matrix folder and in the root, `main`'s CI green with
  its jobs' durations recorded, bug-016's notes name the fix.

## Execution Notes
- 2026-11-13: review: approve after amendments, no blocking finding; the nits applied: dl-020 at
  the close, `main`'s job durations, the owed rows on the next dependency update kept open with
  the reason, the local list named, `.wingfoil/dna.yaml` and the root `overrides` unchanged, the
  close step's wording, the red on the branch with its summary lines.
- 2026-11-13: `main`'s CI before this plan (dl-038 C3): run 43390069004 on `c7ea0e33`, `failure`:
  `validate (22.12.0, 1)` and `(22.21.0, 1)` failing in "Audit every matrix release's lockfile"
  (bug-016), `(22.12.0, 2)` and `(22.21.0, 2)` `success`. The approver triaged bug-016 (`major`,
  `approved`) and gave the OK on points 1 … 5, the owed rows on the next dependency update kept
  open.
- 2026-11-13, close: task-091 approved, merged `--no-ff` at `c2f455c8` on the approver's OK, pushed,
  the branch removed, `approved → done`. `main`'s CI on the merge: run 43456315209 on `c2f455c8`,
  `success`: `validate (22.12.0, 1)` 7 min 30 s, `(22.12.0, 2)` 6 min 56 s, `(22.21.0, 1)` 7 min 9
  s, `(22.21.0, 2)` 9 min 4 s; every job under 20 minutes (G12); the matrix audit step green again.
  bug-016's notes name the fix (bug-016 stays `approved`). dl-020: no tech-spec erratum or ruling in
  this wave (a lockfile-only change), so nothing to fold back, for the approver to confirm. `active
  → done`; the run of this close's push is left to the next plan (dl-038 C3).
