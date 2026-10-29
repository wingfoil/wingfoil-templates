---
id: dl-030-repository-texts-a-request-s-origin-is-the-approver-and-the-privacy-check-of-every-commit
type: decision-log
title: "Repository texts: a request's origin is the approver, and the privacy check of every commit"
status: pending
tags: ["process","privacy","directive"]
---

## Context

Asked by the approver on 2026-10-28: in this repository's new texts, the origin of a request is
written "asked by the approver on <date>", and the session or tool that carried the request is not
named. The approver set four points: the rule applies to new texts (Memory elements and their
Execution Notes, plans, tasks, feedback notes, commit messages); text already on `main` is not
rewritten; the privacy check of a task's or a plan's diff also checks that the added lines name no
intermediary session; and the rule is recorded where every session reads it. It has applied since
2026-10-28, plan-054 included.

Today the privacy practice lives only in plan texts: "Repository texts cite only public elements" in
the Handoff of plan-025, plan-053 and plan-054, and a privacy grep of the branch's diff recorded at
some closes (plan-038, plan-040, plan-052, plan-053). No directive in `.wingfoil/directives/custom/`
holds it (inventory of 2026-10-28, §7, G3). The `traceability` directive is read only by the
reviewer, architect, product-owner and facilitator, while task bodies, feedback notes and commit
messages are also written by the developer and the pack author (`.wingfoil/roles.yaml`).

The retrospective dl-028 adds one practice of the same kind (G5): `main`'s CI is read after every
push. CI stayed red from `4d84334` (2026-10-22, bug-003) because `main`'s runs were not read;
plan-045 wrote "From now on `main`'s CI is read after every push", but no workflow or directive
says it (§4.5).

## Options

1. **A section in `security-secrets`** (already global). Rejected: it mixes origin and privacy of
   texts with secrets.
2. **A section in `traceability`.** Rejected: its roles do not include the developer and the pack
   author.
3. **A new custom directive `repository-practice`, global in `.wingfoil/roles.yaml`**, holding the
   rule, the privacy check and the reading of `main`'s CI.
4. **Plan texts only, as today.** Rejected: the approver asked for a place every session reads.

## Decision

The points below are **proposed**; they become rulings when the approver approves this element.

- **P1 — The origin of a request.** In a new text of this repository (a Memory element and its
  Execution Notes, a plan, a task, a feedback note, a commit message) the origin of a request is
  written "asked by the approver on <date>". The session or tool that carried it, its name or its
  title, is never written. Text already on `main` is not rewritten.
- **P2 — The privacy check.** Before every commit, the lines the staged diff adds are checked (the
  practice of plan-054's Steps, wider than the approver's request, which named task and plan diffs):
  no local or scratch path, no private repository, no private project named or described (beyond
  "three private, non-software projects"), and no intermediary session (a session's or tool's name
  or title given as the origin or carrier of a request). Texts cite only public elements. A plan's
  or a task's close records the check of its branch's diff.
- **P3 — `main`'s CI.** After every push of `main`, the conclusion of the CI run that includes the
  push is read (a later push cancels an earlier run); a red conclusion is reported to the approver
  when found; the response follows the precedent of bug-003 and bug-004. P3 writes down a practice
  in use since plan-045's "From now on" (2026-10-23); as a rule it applies once this element is
  approved.
- **P4 — Where (option 3).** A new directive `.wingfoil/directives/custom/repository-practice.md`
  (id `repository-practice`), with the frontmatter of `wingfoil-cli` (id, name, type, `kind:
  custom`, title, tags), Version 1.0, dated, "Checked against" the pin, listed under `global:` in
  `.wingfoil/roles.yaml`, holding P1 … P3; dl-031 R6, if approved, adds its rules in a later
  version.
- **P5 — Applied by task-065**, hosted by plan-054 once this element is approved
  (`tooling-delivery`, `pack: ""`), as plan-054 step 5 sets. P1 and P2 apply from 2026-10-28, before
  the directive exists.
- **P6 — P3 is the retrospective's** (dl-028 C2, G5), not the approver's request: the approver may
  strike it, and P1, P2, P4 and P5 stand without it (the directive then holds P1 and P2).

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-028.
- 2026-10-29: independent review: approve after amendments, nothing blocking; applied: the Handoff
  line's actual plans, §7 G3 as the source, P2 checks the added lines and is credited to plan-054's
  practice, P3 without a new advisory policy and with its start date, the directive's frontmatter,
  task-065 as plan-054 step 5 sets, P6 (P3 separable). The title predates G5: P3 is the reading of
  `main`'s CI, which the title does not name.
- 2026-10-29: re-review: approve after amendments, nothing blocking; applied: P3's start (a
  practice since 2026-10-23, a rule at approval), P4 notes dl-031 R6's later addition.
