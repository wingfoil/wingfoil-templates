---
id: plan-011-dl-actions-configuration-changes-implied-by-dl-002-dl-006
type: plan
title: "dl actions: configuration changes implied by dl-002..dl-006"
status: active
workflow: "decision-log-ingest"
phase: "rule"
tags: ["config"]
---

## Context

The approver approved dl-001…dl-006 and the inception phase on 2026-10-06, and asked for the
configuration changes these decision-logs imply before the specification phase. Each decision-log
lists its changes under "Configuration changes this decision implies".

No workflow phase hosts this work:
- the `rule` phase of `decision-log-ingest` ends at the approver's ruling, and this plan carries out
  its consequences;
- a task cannot be used, because the `tooling` loop that would host a task with no pack is itself one
  of the changes (dl-005 G7).

The changes are therefore applied as actions of the approved decision-logs, which the brief's rule 7
allows.

## Steps

All work happens on branch `config/dl-002-006-actions`, with one commit per decision-log. Every
changed file that has a `version:` key is bumped once. A file changed by several decision-logs is
bumped only once, in the first commit that touches it.

1. **dl-002, compatibility:**
   - `pack-compatibility`, `pack-semver`, `pack-authoring` (formats and capabilities);
   - the `pack-release` template (`wingfoil` computed, a new `line` field);
   - `pack-release-cycle`;
   - `dna.yaml`: the `compat` module, `paths.sources`, tech-lead, north star;
   - the new main `wingfoil-release-intake`, included in `workflows.yaml`;
   - `pack-cycle` charter wording: formats and capabilities instead of a minimum WingFoil version.
2. **dl-003, base:**
   - `pack-authoring`: foundation rule, slot rule with the dl-003 D11 list, AGENTS.md R1, install
     folder;
   - the `pack` template: slot list, `requires` with ranges.
3. **dl-004, identifiers:**
   - `pack-semver` and `pack-release-cycle`: tag `<catalog pack id>@<version>`, maintenance branch
     `maint/<catalog pack id>/<major>.x`;
   - `pack-authoring`: pack names unique across the catalog;
   - `memory.yaml` and the `pack` template: `foundation` reserved for `base`.
4. **dl-005 G7, tooling loop:**
   - a `tooling` phase in `sw-life-cycle`;
   - the new main `tooling-change`, included in `workflows.yaml`.
5. **dl-006, retrospective:**
   - `retrospective` (sub) and `retrospective-periodic` (main), included in `workflows.yaml`;
   - a phase in `pack-cycle` after `first-release`;
   - the `sw-life-cycle` header;
   - `docs/retrospectives` in `dna.yaml` `paths.governance`.
6. Validate on the branch: `workflow list`, `dna show`, `directives list`, each with exit 0 and no
   warning.
7. The approver reviews the branch. It is then merged into `main` with `--no-ff`, and this plan is
   closed.

## Handoff

- **claude:** steps 1–6.
- **Approver:** reviews the diff and authorizes the merge. An independent review by another session
  is offered.

## Execution Notes
- 2026-10-06: applied on `config/dl-002-006-actions`, one commit per decision-log:
  - dl-002: `4a5ea7b`;
  - dl-003: `ad5b1ee`;
  - dl-004: `6f0bf2a`;
  - dl-005 G7: `b56377c`;
  - dl-006: `9b6a1c6`.

  Versions went 1 → 2 once each: dna, memory, workflows, pack-cycle, pack-release-cycle,
  sw-life-cycle. The new workflows are at 1. `workflow list`, `dna show` and `directives list` exit
  0 with no warning.
- Independent review by another session: **approve with nits**, none blocking.
  - Fixed in `3150a11`: the foundation rule exempts `base`; the retrospective's `approve` phase runs
    as product-owner.
  - Recorded only:
    - the dl-004 commit also edited the `memory.yaml` comment and bumped it 1 → 2. This follows from
      option 1(a)'s own text, although the decision-log listed `memory.yaml` changes only under
      1(b)/1(c);
    - step 1 of this plan did not list the `pack` template, which the dl-002 commit changed
      (Compatibility comment).
  - Left for a later configuration change, with no decision-log source today: the `packs` module
    description in `dna.yaml` does not name the `governance` axis.
  - Untested: WingFoil 0.2.2 parses `where: { pack: "" }`, but without a workflow engine nobody
    knows whether it selects tasks with an empty `pack`.
  - Also seen: `workflow list` passed while `pack-cycle` included a workflow not yet declared.
    That is WingFoil bug-145, already known, so no new note was written.
- 2026-10-06: the approver authorized the merge. Merged into `main` with `--no-ff`.
