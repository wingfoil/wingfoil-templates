---
id: F-008
title: "No lifecycle stage: moving from demo to production is manual"
kind: request
status: open
wingfoil_version: 0.2.2-1778-g30f06016
answered_by: []
---

Formerly T8.

## Observed

There is no config key for the project's maturity. Stage exists only as workflow position and
element state (release states, `sunset`/`end-of-life`). Moving a project from prototype to
production, or from pre-public-release to post-public-release, changes what the process should
demand — approval gates, a semver and breaking-change policy, `CHANGELOG`, a deprecation policy,
global security directives, coverage thresholds — and nothing models that change.

## Expected

- stage is a pack axis, and the current stage is recorded in the lock and in `dna.yaml`
  (`project.stage`, new key);
- `wingfoil stage set <stage>` runs a **transition** that WingFoil-Templates defines (for example
  `transitions/prototype-to-mvp.yaml`, `mvp-to-production.yaml`), with **pre-checks** (an approver
  exists — relates to dl-071, where init seeds no approver —, CI is green, no open critical bug),
  **actions** (swap the stage overlay, enable gates, create a `decision-log` element that records
  the transition) and **one commit** (`wf(stage): mvp → production [...]`). The transition is
  traceable in Memory, like every other mutation.

Open question (planning, 2): where the current stage lives — the lock only, or `dna.yaml`
`project.stage` too?

Related: dl-105 (phase `cadence: once|recurring`), dl-132 (changing the vision after inception),
task-183 (`version:` bump check on the config files, which an upgrade or transition must honour).
This repository specifies transitions in spec-001 §14. Suggested kind in WingFoil: decision-log
(stage model + transitions) + tech-spec + tasks.
