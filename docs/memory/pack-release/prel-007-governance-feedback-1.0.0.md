---
id: prel-007-governance-feedback-1.0.0
type: pack-release
title: "governance/feedback 1.0.0"
status: draft
pack: "pack-governance-feedback"            # the pack element id (pack-<axis>-<name>)
version: "1.0.0"         # the semver being published
bump: "major"            # major | minor | patch (pack-semver directive)
wingfoil: ">=0.3.0 <=0.3.2"        # COMPUTED from compat.yaml (formats + capabilities), e.g. ">=0.4.0 <0.6.0"; never chosen by hand (dl-002)
line: "current"            # the maintained line: current, or <major>.x for an N-1 maintenance line (dl-002)
tags: ["packs","feedback","governance"]
---

## Changes

The first version of `governance/feedback` (plan-073's `charter`, plan-074's `design` with
spec-003, plan-075's tooling, plan-076's `author`, plan-077's `first-release`), shipping:
- task-096: the pack: the `feedback` Memory type and its template, the roles fragment, the
  directive `feedback`, the workflows `feedback-ingest`, `feedback-review` and `feedback-item`,
  the AGENTS.md section, the parameters (`feedback_path`, `feedback_id` and the value lists
  `feedback_kinds`, `feedback_targets` and `feedback_outcomes`), and the conditional entry
  `with: software@^1` (the workflows `feedback-bug-route` and `feedback-bug-item`, the directive
  `feedback-bug-route`); its README and the examples `defaults`, `with-software` and
  `added-outcome`;
- task-097: the exit criterion, `tests/fixtures/feedback-exit` and its CI step, the `check:runs`
  scenarios `feedback.yaml`, `feedback-upstream.yaml` and `adoption-feedback.yaml` (the adoption
  once per `init` template, dl-032 E3), and the fixture upstream pack;
- task-098: the fixture projects of `governance/feedback` and the bindings of the fixture-element
  checks (FA-3 … FA-6);
- task-099: the run by hand on WingFoil 0.3.2, with and without `software` (dl-032 E4),
  composed from `52d125c2`, with nothing to fix in the pack.

It depends on four tooling tasks, which ship nothing in the pack: plan-075's task-093 (spec-003's
composer and lint checks) and task-094 (the fixture-element checks), plan-076's task-095
(`check:runs` driving a route) and plan-077's task-100 (`feedback-exit` in the intake's `verify`
job). It ships no bug fix.

Requires `base@^2`, published as 2.0.1, and `requires_capabilities: [workflow-engine]`; its
conditional entry names `software@^1`, published as 1.0.0. It is the first version published from
a `pack.yaml` at format 2 (spec-003 §9), and the first published pack that carries a conditional
part (`pack-compatibility`). The defaults of its five parameters become fixed with this version,
the convention for new projects (the charter's Commitments to adopters).

**Class: `major`**: a first version (`pack-semver`; plan-077 ruling 1). `pack.yaml` reads
`version: 1.0.0` and `CHANGELOG.md` holds its `1.0.0` entry, both unchanged. The entry's first
line, `- 1.0.0: first version: feedback captured, triaged by the approver and routed into the
governance.`, is the tag's annotation (`publish:pack` takes that line only; plan-077 ruling 3).

`pack.yaml`'s `formats`, `requires` and `requires_capabilities` give the range computed from
`compat.yaml`: `>=0.3.0 <=0.3.2`, the releases that read every format and provide
`workflow-engine`; 0.2.2 provides no `workflow-engine` (plan-077's rehearsal; to be confirmed by
the dry run at `validate`). The README's "Install and update" keeps spec-002 §2.3's temporary
mark: no release in `compat.yaml` provides `pack-install` (CB-3).

No private projects' check (plan-077 ruling 6): the pack is optional, no private project composes
it, and its release changes nothing they compose; the owed row "The private projects' check
scripted" stays untriggered. No notice at this tag (plan-077 ruling 11).

At `publish`, `publish:pack` adds `governance/feedback` with its first version in `catalog.yaml`
and regenerates `CATALOG.md` and `catalog-index.json`; the approver runs it and the atomic push
(plan-077 ruling 7). CB-6's live check then reads `latest: 1.0.0` and the pack's README and
`pack.yaml` at `refs/tags/governance/feedback@1.0.0` (plan-077 point 8).

## Validation

Recorded at `validate` (plan-077 step 5).

## Publication

Recorded at `publish` (plan-077 step 7).

## Execution Notes

- 2026-11-19, `prepare` (plan-077 step 4): added by `memory add`; `pack`, `version`, `bump`,
  `wingfoil` and `line` filled by editing the draft (W-02); Changes written; the CHANGELOG entry
  as task-096 wrote it, unchanged (plan-077 ruling 3); the README's "Install and update" checked
  against `compat.yaml` (CB-3: the temporary mark kept, no release provides `pack-install`).
- 2026-11-19: independent review (dl-017): approve after amendments; no blocker, one should-fix
  and three nits, all applied: the private projects' check stated (ruling 6); the tooling tasks'
  plans named; why 0.2.2 is out of the range; no notice (ruling 11). Submitted
  (`draft → validating`).
