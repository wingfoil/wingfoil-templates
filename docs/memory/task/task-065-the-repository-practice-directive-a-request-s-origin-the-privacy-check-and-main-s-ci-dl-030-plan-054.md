---
id: task-065-the-repository-practice-directive-a-request-s-origin-the-privacy-check-and-main-s-ci-dl-030-plan-054
type: task
title: "The repository-practice directive: a request's origin, the privacy check and main's CI (dl-030, plan-054)"
status: draft
pack: ""            # tooling task (pack-cycle › retrospective, plan-054 step 5)
depends_on: []
tags: ["tooling","governance"]
---

## Context

plan-054 step 5 and dl-030 P4–P5 (approved 2026-10-29): the rule on a request's origin, the privacy
check of every commit and the reading of `main`'s CI after every push go into one directive read by
every role, so that every session finds them. Asked by the approver on 2026-10-28 (P1, P2); P3 comes
from the retrospective (dl-028 C2). P1 and P2 have applied since 2026-10-28; P3 applies since
dl-030's approval. dl-031 R6 later adds the register of owed items to the same directive, in version
1.1, through the dl actions plan after plan-054; this task writes version 1.0 only.

Today the practice lives in plan texts (the Handoff of plan-025, plan-053 and plan-054, the privacy
checks recorded at the closes of plan-038, plan-040, plan-052, plan-053). The `traceability`
directive is read only by the reviewer, architect, product-owner and facilitator, so a new custom
directive listed under `global:` in `.wingfoil/roles.yaml` is the place (dl-030 option 3).

## Acceptance

1. **The directive** `.wingfoil/directives/custom/repository-practice.md`: frontmatter as
   `wingfoil-cli`'s (`id: repository-practice`, `name`, `type: directive`, `kind: custom`, `title`,
   `tags`), a heading, the line `**Version:** 1.0 · **Date:** <date> · **Checked against:**
   \`wingfoil@0.2.2\``, a short purpose citing dl-030, and three numbered rules stating dl-030 P1,
   P2 and P3 in their approved wording (the privacy check naming what it checks and that a plan's or
   a task's close records it; P3 naming bug-003 and bug-004 as precedent). Nothing beyond P1 … P3.
2. **Listed under `global:`** in `.wingfoil/roles.yaml`, after `wingfoil-cli`; `roles.yaml`'s
   `version: 2 → 3`.
3. **WingFoil reads it:** `npm run -s wingfoil -- directives list` exits 0 with no warning and lists
   `repository-practice` as assigned to every role; `workflow list` and `npm run lint` exit 0.
4. **No private content:** the directive names no local path, private repository, private project
   or intermediary session (it applies its own P2).
5. **Tests and checks:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`,
   `npm run lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check`,
   `check:runs` and `npm run -s wingfoil -- workflow list` exit 0. No file changes outside the
   directive, `.wingfoil/roles.yaml` and this task's file. The CI run on the branch is `success` and
   recorded.

## Design

- **Red steps:** none of code. The change is configuration content, dl-018 R2's named exception;
  checked by `directives list` and by a mutation: with the `roles.yaml` entry removed, `directives
  list --format json` no longer assigns `repository-practice` to any role (and, as WingFoil 0.2.2
  reports, may list it as unassigned), recorded in the Execution Notes and reverted.
- **The text** follows `wingfoil-cli`'s layout (frontmatter, heading, version line, short sections),
  in English, lines of 100 characters at most.
- **Commits** on `task/task-065-repository-practice-directive`, from plan-054's branch: the
  directive and the `roles.yaml` entry in one commit, then this task's notes.

## Execution Notes

- 2026-10-29: written under plan-054 step 5, from dl-030 P4–P5; added after task-064 was merged into
  plan-054's branch (W-14).
