---
id: task-016-line-policy-one-living-line-before-wingfoil-1.0-n-and-n-1-after-it
type: task
title: "Line policy: one living line before WingFoil 1.0, N and N-1 after it"
status: draft
pack: ""            # tooling task (sw-life-cycle › tooling, tooling-delivery)
depends_on: ["task-015-feedback-notes-on-publication-and-schema-change"]
tags: ["tooling","W7","F5.3"]
---

## Context

Task 13 of plan-015 (`sw-life-cycle` › `tooling`, wave W7, F5.3), the last of the tooling phase's
backlog. Tooling task, no pack. Below, "plan-015 task N" names a step of that plan, not a Memory
element.

It comes from:
- **F5.3 and dl-002** (ruled 2026-10-05): before WingFoil 1.0, one living line per pack, written in
  the newest formats; older versions stay tagged and listed, frozen, and get no further fix. From
  WingFoil 1.0, lines N and N-1 are maintained for a declared window of at least one WingFoil minor;
  N-1 gets fixes only;
- **`pack-semver`** (Lines and maintenance): N-1 lives on the branch
  `maint/<catalog pack id>/<major>.x` and receives fixes only, never features; a fix for both lines
  is made on N first, then backported, and the two `pack-release` elements cite each other;
- **spec-001 §4 and dl-004 3(b):** the maintenance branch name, from WingFoil 1.0 only; **§11:** a
  pack's `versions` are in ascending semver order;
- **task-014:** `publish:pack` today refuses any version that is not above every published version
  of the pack, which is the rule before WingFoil 1.0; the `pack-release` template's `line` field is
  `current`, or `<major>.x` for an N-1 line.

"From WingFoil 1.0" is read from `compat.yaml`: the policy of lines N and N-1 applies once it lists a
release `1.0.0` or later. Today it lists 0.2.2 only, so the single-line rule is the one in force;
the N-1 path is proven in the tests, on a fixture `compat.yaml` with a fictional `1.0.0` release,
as task-014 proved the publication path.

Not in scope: the length of the maintenance window and when an N-1 line freezes (dl-002 leaves the
window to be declared; it stays the approver's decision at each release); classifying a change's
bump (the `pack-release` element's `bump`, a review by `pack-semver`); backport tooling.

## Acceptance

Run from a clean clone of the task branch; Node.js 22.21 and the floor 22.12.0 as in task-001.

1. `npm ci`, `npm run build`, `npm test`, `npm run lint`, `npm run check:pins`,
   `npm run check:schemas` and `npm run check:packs` exit 0; no dependency is added; `npm test`
   needs no network.
2. **Before WingFoil 1.0** (no release `1.0.0` or later in `compat.yaml`): `publish:pack` keeps
   task-014's rule, a version above every published version of the pack, on any branch but a
   `maint/…` one, where it refuses (exit 1: "maintenance lines start with WingFoil 1.0").
3. **From WingFoil 1.0**, `publish:pack` decides the line from the version and the branch:
   - **current line (N):** a version above every published version of the pack, from any branch
     but a `maint/…` one, as before;
   - **N-1 line:** a version below the newest published one is accepted only when all hold:
     the checked-out branch is `maint/<catalog pack id>/<major>.x` with `<major>` the version's
     major; that major is the one just below the newest published major (N-1, not older); the
     version is a **patch** above the newest published version of that major (fixes only, never
     features); otherwise exit 1, naming the rule broken;
   - the Publication section prints `- Line: current` or `- Line: <major>.x`, the value of the
     `pack-release` element's `line` field.
4. **Catalog order:** `catalog-edit` inserts a version entry at its semver position among the pack's
   versions, so an N-1 patch published after a newer major keeps `versions` ascending (§11); the
   lint rules of task-012 and task-014 pass on the result.
5. **Tests** on scratch repositories (task-014's helpers): before 1.0, a `maint/` branch is refused;
   from 1.0 (a fixture `compat.yaml` listing a fictional release `1.0.0` with `format_key: true`,
   and its stub), `2.0.0` on the current line, then `1.0.1` on `maint/base/1.x` with its entry
   placed before `2.0.0`; refused: `1.1.0` on `maint/base/1.x` (a feature), `1.0.1` from the current
   branch, `1.0.1` on `maint/base/2.x`, an N-2 patch (`1.0.1` when `3.0.0` is the newest).
6. `npm audit` reports 0 vulnerabilities.

## Design

<!-- Filled at the start of the work. -->

## Execution Notes

<!-- Deviations, blockers, decisions taken, WingFoil friction. -->
