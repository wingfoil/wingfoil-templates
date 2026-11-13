---
id: plan-072-tooling-change-bug-016-the-matrix-and-root-lockfiles-move-hono-and-hono-node-server-past-their-advisories
type: plan
title: "tooling-change: bug-016, the matrix and root lockfiles move hono and @hono/node-server past their advisories"
status: draft
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
   approver, dl-019); every `package.json`, the pinned `wingfoil` versions and
   `src/matrix/wingfoil-0.3.2/` unchanged.
2. **Red and green, as task-042:** a lockfile-only change, with no code and no test (a test of a
   transitive version would duplicate `npm audit`, which needs the network, and go stale): the red
   is `npm audit`'s exit 1 in the three matrix folders and the root, recorded with the CI's first
   red run; the green is its exit 0 there, and in `wingfoil-0.3.2`.
3. **adr-003's review of the moved packages:** `npm audit signatures` in the root after `npm ci`
   (its count recorded); the moved versions' licences read from the lockfiles.
4. **Checks** (dl-039): the branch CI green, every job's duration recorded (R3, G12); the CI's
   matrix cache is keyed by the matrix lockfiles, so the branch run installs the moved releases
   afresh; dl-039's local list on Node 22.21.0 from a clean worktree.
5. **After the merge:** `main`'s CI green, recorded in bug-016's and this plan's notes; plan-071
   resumes.

Not in this plan: any other dependency update (the rows of `docs/owed-items.md` on the next
dependency update: `check:pins` and `overrides`, the `minimatch` override); a change to dl-035's
rule.

## Steps

1. **This plan and bug-016:** independent reviews (dl-017); the approver triages bug-016 and gives
   the OK on the outline; `submit` (`draft → active`).
2. **task-091** (`tooling-delivery` v4, `pack: ""`): its body reviewed, `pending → backlog` by the
   approver, on its branch `task/task-091-hono-lockfiles`; design, build, build review, checks,
   `in-review`, the approver's approval and merge OK; merged `--no-ff`, `main`'s CI read.
3. **Close:** bug-016's notes, `active → done`.

## Handoff

- **The approver:** bug-016's triage; the OK on the outline; task-091's `backlog`, approval and
  merge OK.
- **Alone:** the task's body, design, build, checks and notes; the reviews by an independent
  reviewer (a subagent with no part in the text). No pull request; files staged by name.
- **Done when:** `npm audit` exits 0 in every matrix folder, `main`'s CI green, bug-016's notes
  name the fix.

## Execution Notes

