---
id: task-065-the-repository-practice-directive-a-request-s-origin-the-privacy-check-and-main-s-ci-dl-030-plan-054
type: task
title: "The repository-practice directive: a request's origin, the privacy check and main's CI (dl-030, plan-054)"
status: approved
pack: ""            # tooling task (pack-cycle › retrospective, plan-054 step 5)
depends_on: []
tags: ["tooling","governance"]
---

## Context

plan-054 step 5 and dl-030 P4–P5 (approved 2026-10-29, P3 not struck, dl-030 P6): the rule on a
request's origin, the privacy check of every commit and the reading of `main`'s CI after every push
go into one directive read by every role, so that every session finds them. Asked by the approver on
2026-10-28 (P1, P2); P3 comes from the retrospective (dl-028 C2). P1 and P2 have applied since
2026-10-28; P3 since dl-030's approval on 2026-10-29. plan-054 proposed the name `repository-texts`;
dl-030 named it `repository-practice`, since it also holds `main`'s CI. dl-031 R6 later adds the
register of owed items to the same directive, in version 1.1, through the dl actions plan after
plan-054; this task writes version 1.0 only.

Today the practice lives in plan texts (the Handoff of plan-025, plan-053 and plan-054, the privacy
checks recorded at the closes of plan-038, plan-040, plan-052, plan-053). The `traceability`
directive is read only by the reviewer, architect, product-owner and facilitator, so a new custom
directive listed under `global:` in `.wingfoil/roles.yaml` is the place (dl-030 option 3).

## Acceptance

`npm run build` precedes the commands.

1. **The directive** `.wingfoil/directives/custom/repository-practice.md`, laid out as
   `wingfoil-cli`'s: frontmatter (`id: repository-practice`, `name` and `title` both the directive's
   title, `type: directive`, `kind: custom`, `tags`), the heading `# Directive — <title>`, the line
   `**Version:** 1.0 · **Date:** <date> · **Checked against:** \`wingfoil@0.2.2\``, a scope line
   (global, every role) citing dl-030, and a `## Rules` section with three numbered rules stating
   the rule of dl-030 P1, P2 and P3: their requirements, with P1's "text already on `main` is not
   rewritten", P2's checks and the record at a plan's or a task's close, P3 with bug-003 and bug-004
   as precedent, and the dates they apply from (P1 and P2 from 2026-10-28, P3 from 2026-10-29),
   without dl-030's provenance remarks. Nothing beyond P1 … P3.
2. **Listed under `global:`** in `.wingfoil/roles.yaml`, after `wingfoil-cli`; `roles.yaml`'s
   `version: 2 → 3`.
3. **WingFoil reads it:** `npm run -s wingfoil -- directives list --format json` exits 0 with
   `"warnings": []` and an entry with `path` `directives/custom/repository-practice.md`,
   `"global": true` and `"assignment": "global (all roles)"`, as `wingfoil-cli`'s; `workflow list`
   and `npm run lint` exit 0.
4. **No private content:** the directive, the branch's diff and its commit messages name no local
   path, private repository, private project, the maintainer's names or an intermediary session
   (dl-030 P1, P2).
5. **Tests and checks:** from clean clones on Node.js 22.21.0 and 22.12.0, `npm ci`, `npm test`,
   `npm run lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`, `index -- --check`,
   `check:runs` and `npm run -s wingfoil -- workflow list` exit 0. No file changes outside the
   directive, `.wingfoil/roles.yaml` and this task's file. The CI run on the branch is `success` and
   recorded.

If plan-054's branch cannot close by 2026-11-05, this task does not hold task-064's notes back: they
already sit on plan-054's branch, which then merges to `main` on its own (plan-054 step 4).

## Design

- **Red steps:** none of code. The change is configuration content, dl-018 R2's named exception;
  checked by `directives list` and by a mutation: with the `roles.yaml` entry removed, `directives
  list --format json` still exits 0 with `warnings: []`, but its `repository-practice` entry changes
  from `"global": true`, `"assignment": "global (all roles)"` to `"global": false`, `"assignment":
  "unassigned"`; recorded in the Execution Notes and reverted.
- **Written by hand**, as `wingfoil-cli` was (`830dccb`): `directive create` commits a scaffold on
  its own (frontmatter `name: <id>`, no tags, a placeholder body), which breaks the one-commit plan,
  and `directive assign` takes only `--role`, with no way to add to `global:`; recorded in the
  Execution Notes (`wingfoil-cli` rules 2 and 4).
- **The text** in English, lines of 100 characters at most.
- **Privacy:** before each commit, the added lines of the staged diff and the commit message are
  grepped for local paths (`/home/`, `/tmp/`), the maintainer's names and session or tool names, and
  read for private project or repository names; the branch diff's check is recorded in the
  Execution Notes.
- **Commits** on `task/task-065-repository-practice-directive`, from plan-054's branch: the
  directive and the `roles.yaml` entry in one commit, then this task's notes.

## Execution Notes

- 2026-10-29: written under plan-054 step 5, from dl-030 P4–P5; added after task-064 was merged into
  plan-054's branch (W-14).
- 2026-10-29: independent body review: approve after amendments, nothing blocking; applied: the
  mutation's observable (`global` and `assignment`, not a warning), Acceptance 3's exact check, why
  the files are written by hand, the privacy check of the branch's diff and commit messages, the
  rules without dl-030's provenance remarks, the layout pinned, the build step, P3 kept and the
  name.
- 2026-10-29, `build` (`backlog → in-progress`): the directive and the `roles.yaml` entry written by
  hand in one commit (`3b7aa96`), as the Design says (`wingfoil-cli` rules 2 and 4): `directive
  create` would commit a placeholder scaffold on its own, and `directive assign` cannot add to
  `global:`. Rule 2 also checks the commit message: dl-030 P1 counts it among the texts, and P2's
  "Texts cite only public elements" covers it. `directives list --format json` exits 0 with
  `"warnings": []` and lists `directives/custom/repository-practice.md` with `"global": true`,
  `"assignment": "global (all roles)"`; `workflow list` and `lint` exit 0. Mutation, reverted: with
  the `roles.yaml` entry removed, the command still exits 0 with `"warnings": []`, and the entry
  reads `"global": false`, `"assignment": "unassigned"`. Privacy grep of the commit: the only hit is
  the word "scratch" in rule 2's own text.
- 2026-10-29: independent build review: approve, three nits; applied the two on these notes: rule
  2's commit-message check explained by P1 and P2, and the CLI's `Approver:` trailer on the
  `wf(task): approve` commits (WingFoil writes it, established on `main`) as the only name in the
  branch's commit messages, outside Acceptance 4's scope. Rule 3's passive "is read" kept: the role
  that pushes reads it, as plan-045 and every close since.
- 2026-10-29: clean clones on Node.js 22.21.0 and 22.12.0, both at `3b7aa96`: `npm ci`, `npm test`
  (1027 of 1027), `lint`, `check:pins`, `check:schemas`, `check:packs`, `validate`, `index --
  --check`, `check:runs` and `workflow list` exit 0.
- 2026-10-29: CI run 40866324823 on `9932d70`, conclusion `success` (`validate (22.21.0)`, `validate
  (22.12.0)`). `in-progress → in-review`.
