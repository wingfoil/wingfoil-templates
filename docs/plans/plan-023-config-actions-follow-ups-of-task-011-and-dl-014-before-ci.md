---
id: plan-023-config-actions-follow-ups-of-task-011-and-dl-014-before-ci
type: plan
title: "config actions: follow-ups of task-011 and dl-014 before CI"
status: active
workflow: "sw-life-cycle"
phase: "tooling"
tags: ["config"]
---

## Context

Configuration follow-ups owed before plan-015 task 10 (CI), as the approver asked on 2026-10-10.
Like plan-018 and plan-021, no workflow phase hosts this work: the changes are actions of approved
elements.

Sources, all `done` or `approved`:
- **task-011** (the compatibility matrix) left two follow-ups in its Context and Execution Notes:
  `wingfoil-cli` W-12 names the governance pin, while the matrix runs its own releases, each pinned
  by a committed lockfile under `src/matrix/`; and `wingfoil-release-intake` › `record` must add
  that lockfile for every new release;
- **dl-014 / plan-021:** `pack-release-cycle` › `publish` now regenerates `CATALOG.md` and
  `catalog-index.json` with `npm run index`, a command that only wave W14 delivers, after
  plan-015. A publication before W14 (the dry run of plan-015 task 11, and `base`'s first release
  if it came first) would meet a step it cannot run. The approver chose option (a): until the
  command exists, `publish` skips the regeneration and records the skip.

## Steps

All work happens on branch `config/pre-ci-followups`, one commit per step.

1. **`pack-release-cycle`** (`version:` 3 → 4), `publish`: the regeneration runs once `npm run
   index` exists (wave W14); until then the step records, in the `pack-release` element's
   Execution Notes, that `CATALOG.md` and `catalog-index.json` were not regenerated, and they are
   not listed among the files the step changes.
2. **`wingfoil-cli`** (1.0 → 1.1): W-12's "How to work with it" names the matrix's releases, each
   installed from its committed lockfile under `src/matrix/wingfoil-<version>/` (task-011), rather
   than the governance pin.
3. **`wingfoil-release-intake`** (`version:` 2 → 3), `record`: commit
   `src/matrix/wingfoil-<version>/package.json` and its lockfile (`npm install --package-lock-only
   --ignore-scripts`, exact pin), so that the matrix can install the new release; `npm run
   check:pins` checks them. It also produces those files.
4. **Checks:** `npm run -s wingfoil -- workflow list`, `dna show` and `directives list` exit 0 with
   no warning; the includes are checked by hand (`wingfoil-cli` W-08); `npm test`, `npm run
   check:packs` and `npm run validate` exit 0.
5. **Review and merge:** an independent review by another context; the approver approves the merge
   in chat; `--no-ff` into `main`; this plan goes `active → done`.

## Handoff

- **claude:** steps 1–4, the review hand-off, the merge once approved.
- **Approver:** the merge of `config/pre-ci-followups`, in chat.
- Done when the branch is merged and pushed; plan-015 task 10 follows.

## Execution Notes

<!-- Filled while the plan runs: deviations, blockers, decisions taken, WingFoil friction
     (also recorded in docs/wingfoil-feedback/). -->
