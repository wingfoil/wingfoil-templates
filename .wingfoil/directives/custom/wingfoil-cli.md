---
id: wingfoil-cli
name: "Using the pinned WingFoil CLI"
type: directive
kind: custom
title: "Using the pinned WingFoil CLI"
tags: [custom, wingfoil, cli, governance]
---

# Directive — Using the pinned WingFoil CLI

**Version:** 1.5 · **Date:** 2026-10-28 · **Checked against:** `wingfoil@0.2.2`

Global. Applies to every role, human or agent, that runs the WingFoil CLI in this repository.

## Rules
1. Run the pinned CLI (`npm run -s wingfoil -- …`); never a global `wingfoil` of another version.
2. Every governance change goes through a CLI verb when one exists; hand edits only where an entry says so.
3. A wrong, missing or surprising behaviour gets an entry below. If it is a WingFoil defect or gap,
   also write a note in `docs/wingfoil-feedback/` (evidence: command, output, version, commit).
4. Do not work around silently: a workaround goes in the entry and in the Execution Notes of the
   element being worked on.
5. When the pin advances: re-check every entry, remove the fixed ones, bump this directive's version
   and *Checked against*. A note whose answer has shipped stays `resolved`; there is no `verified`
   status (WingFoil dl-163).
6. `answered_by` and the statuses `needs-info`, `captured`, `resolved`, `declined` and `duplicate`
   are set only by the sync, from what WingFoil published, never by judgement. WingFoil cites a note
   as `<service id>/F-<nnn>@<sha>`.
7. Sync the inbox at every release planning of WingFoil and at every bump of the WingFoil pin:
   read what WingFoil published about this repository's notes (source key `svc-018`), set `status`
   and `answered_by` from it (rule 6), and record the sync under **Last sync** in
   `docs/wingfoil-feedback/README.md`.
8. A change to `schema/` (the contract with the WingFoil CLI) produces a note, so that WingFoil's
   release planning sees it. Packs reach WingFoil projects from this repository through
   `pack-install`, not through WingFoil's npm package (dl-021 R1).

## Known behaviours (0.2.2)

| # | Behaviour | How to work with it | Note | WingFoil element |
|---|-----------|---------------------|------|------------------|
| W-01 | A file with a `format:` key gives `unknown field(s) ignored: format` (exit 0) in `workflow list`, `dna show` and `directives list`. | Expected until a release reads the key; `compat.yaml` marks 0.2.2 `format_key: false` (spec-001 O10), and the matrix tolerates the warning in self-test mode only (dl-009). | F-017 | dl-149, task-251 |
| W-02 | `memory add --set` fills only tokens of the id pattern; other required fields cannot be set at creation. | Fill them by editing the draft, and commit before `submit`. | F-011 | |
| W-03 | `memory approve` and `memory reject` require `--reason`. | Every command handed to the approver carries `--reason "…"`. | | |
| W-04 | `memory submit` commits edits of the element's body that were not committed. | Commit the body by hand, with its own message, before `submit`. | F-022 | |
| W-05 | Two consecutive `submit`s of one element produce commits with the same subject. | Read the state from the frontmatter or from `memory history`, not from the subject. | F-023 | |
| W-06 | `illegal transition` is printed when the requested target state is not the next one. | Check the type's sequence in `memory.yaml`; `submit` moves one step. | F-024 | |
| W-07 | No verb leaves a `waiting` state except `deprecate`. | Do not declare `waiting` states until the workflow engine handles them. | F-025 | |
| W-08 | `workflow list` does not check that every `include` names a declared workflow. | After a workflow change, check the includes by hand (plan-018). | | bug-145 |
| W-09 | `where:` on an `iterate_over` phase is accepted but nothing evaluates it. | Select the iterated elements by reading their frontmatter. | F-018 | |
| W-10 | Every command needs the working directory to be the root of a git repository (`E_NO_GIT_ROOT`, `E_NOT_AT_GIT_ROOT`). | Run from the repository root; around a composed `.wingfoil/`, `git init` a scratch directory first. | F-021 | |
| W-11 | WingFoil's built-in directive ids are readable only from a project `wingfoil init` scaffolded. | `src/wingfoil-builtins.ts` keeps a copy; re-check it at every pin bump. | F-019 | |
| W-12 | The validation rules of the files WingFoil reads live only in its loaders. | Run the real WingFoil on every composed configuration: the compatibility matrix installs each release it selects from its committed lockfile under `src/matrix/wingfoil-<version>/` (task-011), never the governance pin. | F-020 | |
| W-13 | A phase has one `role` (a string); a list is refused with `E_VALIDATION`. | A loop whose role depends on the element exists once per role: `tooling-delivery` beside `kanban-delivery` (bug-001), checked against each other at every change. | F-026 | |
| W-14 | `memory add` numbers a `{n}` id as 1 + the count of the type's files in the working tree: with a gap it gives a number already in use (a second id with that number and another slug; only an identical path is refused), and a number taken only on another branch is given again. | Check the id it prints before going on. When the numbers below the wanted one have no gap, move the higher-numbered files out of the repository for the command and back (plan-053); for a number held on another branch, add a placeholder file named by the id pattern (`<prefix>-<n>-placeholder.md`) in the type's directory for the command, then remove it, never committed. | | |
