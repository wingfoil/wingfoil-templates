---
id: repository-practice
name: "Repository practice: a request's origin, the privacy check, main's CI"
type: directive
kind: custom
title: "Repository practice: a request's origin, the privacy check, main's CI"
tags: [custom, governance, privacy, ci]
---

# Directive — Repository practice: a request's origin, the privacy check, main's CI

**Version:** 1.0 · **Date:** 2026-10-29 · **Checked against:** `wingfoil@0.2.2`

Global. Applies to every role, human or agent, that writes text into this repository or pushes to
it (dl-030).

## Rules
1. **The origin of a request.** In a new text of this repository (a Memory element and its
   Execution Notes, a plan, a task, a feedback note, a commit message) the origin of a request is
   written "asked by the approver on <date>". The session or tool that carried the request, its
   name or its title, is never written. Text already on `main` is not rewritten. In force since
   2026-10-28.
2. **The privacy check.** Before every commit, the lines the staged diff adds, and the commit
   message, are checked: no local or scratch path, no private repository, no private project named
   or described (beyond "three private, non-software projects"), and no intermediary session (a
   session's or tool's name or title given as the origin or carrier of a request). Texts cite only
   public elements. A plan's or a task's close records the check of its branch's diff. In force
   since 2026-10-28.
3. **`main`'s CI.** After every push of `main`, the conclusion of the CI run that includes the push
   is read (a later push cancels an earlier run). A red conclusion is reported to the approver when
   found; the response follows the precedent of bug-003 and bug-004. In force since 2026-10-29.
