---
id: dl-030-repository-texts-a-request-s-origin-is-the-approver-and-the-privacy-check-of-every-commit
type: decision-log
title: "Repository texts: a request's origin is the approver, and the privacy check of every commit"
status: draft
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

Today the privacy practice lives only in plan texts: "Repository texts cite only public elements"
in every plan's Handoff, and a privacy grep of the branch's diff recorded at some closes (plan-038,
plan-040, plan-052, plan-053). No directive holds it (inventory of 2026-10-28, §4.5). The
`traceability` directive is read only by the reviewer, architect, product-owner and facilitator,
while task bodies, feedback notes and commit messages are also written by the developer and the
pack author (`.wingfoil/roles.yaml`).

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
- **P2 — The privacy check.** Before every commit, the staged diff is checked: no local or scratch
  path, no private repository, no private project named or described (beyond "three private,
  non-software projects"), and no intermediary session (a session's or tool's name or title given
  as the origin or carrier of a request). Texts cite only public elements. A plan's or a task's
  close records the check of its branch's diff.
- **P3 — `main`'s CI.** After every push of `main`, the conclusion of the CI run that includes the
  push is read (a later push cancels an earlier run); a red conclusion is reported when found, and
  a red one caused by an npm advisory becomes a bug and a task (as bug-003).
- **P4 — Where (option 3).** A new directive `.wingfoil/directives/custom/repository-practice.md`
  (id `repository-practice`), Version 1.0, dated, "Checked against" the pin, listed under `global:`
  in `.wingfoil/roles.yaml`, holding P1 … P3.
- **P5 — Applied by task-065**, hosted by plan-054 once this element is approved
  (`tooling-delivery`, `pack: ""`): the directive, its `roles.yaml` entry, `directives list` exit 0
  with no warning. P1 and P2 apply from 2026-10-28, before the directive exists.

## Execution Notes
- 2026-10-29: written under plan-054 (`capture`, `decision-log-ingest` hosted there), cited by
  dl-028.
