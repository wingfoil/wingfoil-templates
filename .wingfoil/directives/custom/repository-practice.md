---
id: repository-practice
name: "Repository practice: a request's origin, the privacy check, main's CI, the owed items"
type: directive
kind: custom
title: "Repository practice: a request's origin, the privacy check, main's CI, the owed items"
tags: [custom, governance, privacy, ci, backlog]
---

# Directive — Repository practice: a request's origin, the privacy check, main's CI, the owed items

**Version:** 1.2 · **Date:** 2026-11-05 · **Checked against:** `wingfoil@0.2.2`

Global. Applies to every role, human or agent, that writes text into this repository or pushes to
it (dl-030); its rule 4, the register of owed items, to every role that leaves, settles or reads
one (dl-031).

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
   since 2026-10-28. The recipients of an outgoing notice, in a text that describes the notice, are
   named by project ("WingFoil UI", "WingFoil Benchmark"), never as a session; a request the notice
   carries (to pass it on) is written "asked by the approver on <date>", addressed to the recipient
   project (rule 1). In force since 2026-11-02 (dl-036 R5).
3. **`main`'s CI.** After every push of `main`, the conclusion of the CI run that includes the push
   and its warning annotations are read (a later push cancels an earlier run). A red conclusion is
   reported to the approver when found; the response to a red conclusion follows the precedent of
   bug-003 and bug-004. In force since 2026-10-29. A warning of the step that audits the whole root
   tree opens a bug within a day: its severity from the advisory and the path, `minor` by default
   for a development dependency only (the CI stays green); fixed by moving the lockfile within the
   ranges when a fix exists (bug-003's and bug-004's precedent), otherwise by an exact override or
   by the approver's ruling. A warning whose advisories are all covered by an open bug, or by an
   approver's ruling recorded in that bug, opens no new bug. Detection is unchanged: the CI runs on
   every push. In force since 2026-11-02 (dl-035 A2). At a plan's close, the run of its last push
   (the close note and `active → done`) is read by the next plan, which cites it. In force since
   2026-11-04 (dl-038 C3).
4. **The owed items.** `docs/owed-items.md` holds every open owed item, one row each: the item, its
   source (element and section), its owner and its trigger. An item without an owner names the
   approver; an item without a trigger takes "the next retrospective". A plan or a task adds the row
   in the same commit as the note that leaves the item; for a pack, a pack-release, a bug or a
   decision-log, at the latest by the close of the plan that hosts it. The note, or for a row added
   later the hosting plan's note, cites the row. The element that settles an item moves its row to
   the closed section, with its own id. Every retrospective reads the register in `explore` and
   proposes, for each row, keep, assign or drop; the retrospective's decision-log rules them. After
   the bump of the WingFoil pin no number is reserved in prose: a plan names a future element by its
   purpose, and its number is the one `memory add` gives; until then a reservation is written in the
   reserving plan and the `wingfoil-cli` W-14 workaround applies. In force since 2026-10-29
   (dl-031). "The next retrospective" is the next run of `retrospective-periodic`, or a
   retrospective that counts as periodic (dl-029 T1); a pack's own retrospective proposes keep,
   assign or drop for the rows its cycle touched and lists every other row as "not touched", which
   keeps it. A ruling that leaves an owed item adds its row in the commit that records the ruling in
   its plan, and the ruling cites the row. An item in the closed section found open again returns to
   the open section in the commit that records the finding, on `main` when the finding is a plan's
   ruling or note, its source extended with the element and section that reopened it; the element
   that settles it closes it again. A row asked by the approver outside any element has the source
   "asked by the approver on <date>" with what it concerns; the plan active on `main`, or the next
   plan if none is active, cites it in an Execution Note. In force since 2026-11-02 (dl-036 R1 …
   R4).
