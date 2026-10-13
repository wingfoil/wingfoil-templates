---
id: plan-028-config-actions-the-license-file-and-the-plan-018-leftovers
type: plan
title: "config actions: the LICENSE file and the plan-018 leftovers"
status: draft
workflow: "sw-life-cycle"
phase: "tooling"
tags: ["config"]
---

## Context

Two follow-ups with no owner, opened on the approver's request in chat on 2026-10-13. Like plan-018,
plan-021 and plan-023, no workflow phase hosts this work: the changes are configuration and
documents, no tooling task.

1. **The `LICENSE` file.** `package.json` and `dna.yaml` declare MIT, `dna.yaml` lists `LICENSE`
   among the governance paths, and the root README's "License" section says "MIT, as
   `package.json` declares" (task-023, which left the file out of its scope). No `LICENSE` file
   exists, so the license text is not in the public repository and GitHub detects none. The
   approver ruled on 2026-10-13: MIT, copyright holder Roberto Pompermaier, aligned with WingFoil.
   WingFoil's own `LICENSE` (public repository `wingfoil/wingfoil`, the same text in its npm
   package `wingfoil@0.2.2`) is the standard MIT text with "Copyright (c) 2026 Roberto
   Pompermaier"; GitHub detects it as MIT.
2. **The plan-018 leftovers** (plan-018 › Execution Notes, review nits; plan-015's phase gate;
   dl-016 O2):
   - `pack-semver` says "`0.x` versions are allowed only while spec-001 (the pack format) is not
     approved", and `pack-cycle` › `first-release` "normally 1.0.0, or 0.x while spec-001 is a
     draft". spec-001 is `approved` (2026-10-06), and fixes the rule itself: "the first published
     version of every pack is `1.0.0` or later" (§4) and a lint check "`version` ≥ 1.0.0" (§18).
     The two clauses are replaced by that rule, cited from spec-001, not dropped, so that no text
     reads as allowing `0.x`;
   - bug-001's Observed names `pack-cycle` › `deliver`; the phase is `author`. bug-001 is
     `approved`, so its body stays as approved (precedent: plan-022) and an Execution Note
     records the slip.

Not in this plan: spec-001's own §4 sentence on `0.x`, which is part of an approved specification
(an amendment of its own); the spec-002 amendment; the decision-log on the WingFoil divergences.

## Steps

On the branch `config/license-and-plan-018-leftovers`, from `main` at `caff542`; one commit per
step.

1. **`LICENSE`** at the repository root: the MIT text, word for word as WingFoil's, with
   "Copyright (c) 2026 Roberto Pompermaier". The root README's "License" section links it: "MIT,
   see [`LICENSE`](LICENSE)." (no email address, task-023).
2. **`pack-semver`:** the `0.x` line becomes "A pack's versions are `1.0.0` or later (spec-001 §4,
   §18)." Directives carry no version key: nothing is bumped.
3. **`pack-cycle`** (`version` 3 → 4) › `first-release`: "Publish the pack's first version, `1.0.0`
   or later (spec-001 §4)."
4. **bug-001:** an Execution Note: the Observed's `pack-cycle` › `deliver` is `pack-cycle` ›
   `author` (plan-018 › Execution Notes; plan-028).
5. **Checks:** `npm run -s wingfoil -- workflow list` and `directives list` exit 0 with no warning;
   `npm test` (`tests/root-readme.test.ts` checks the README's links), `npm run lint`,
   `npm run check:packs` and `npm run validate` exit 0; after the merge,
   `gh api repos/wingfoil/wingfoil-templates/license` reports MIT.
6. **Review:** an independent review of the change (dl-017), its findings fixed, a re-review when a
   fix changes a rule.
7. **Branch close:** push, the real CI run's conclusion recorded here; on the approver's OK,
   `--no-ff` merge into `main`, push, the branch removed.

## Handoff

- **claude:** steps 1–7, except the merge OK. It never runs `memory approve` or `memory reject`.
- **Approver:** the license choice (given in chat on 2026-10-13); the merge OK.
- Done when the changes are on `main`, pushed, and GitHub reports the license. The plan then goes
  `active → done`.

## Execution Notes

- 2026-10-13: the approver asked in chat for the `LICENSE` file (MIT, their name, aligned with
  WingFoil) and the plan-018 leftovers, and gave the choices above; `memory add --set` not used
  (W-02), `workflow` and `phase` filled by editing the draft.
