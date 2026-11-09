---
id: pack-compatibility
name: pack-compatibility
type: directive
kind: custom
title: "Pack compatibility"
tags: [packs, release, validation]
---

# Pack compatibility

Applies to every role that validates or publishes a pack of this repository's catalog (`packs/`).
The tooling's test fixtures (`tests/fixtures/`) are not catalog packs: their compositions are the
tooling's self-tests, run in the matrix's self-test mode (dl-009).

- The contract with WingFoil is what a pack declares in `pack.yaml`: the `formats` its content is
  written in and the `requires_capabilities` it needs (dl-002). Never write a WingFoil version
  range by hand: the range in `catalog.yaml` is computed from `compat.yaml` at publication.
- Before a version is published, compose every preset and every documented combination that
  contains the pack, with **the oldest and the newest** WingFoil release that `compat.yaml` lists as
  compatible (it reads every format, it provides every capability). Each
  composed `.wingfoil/`, committed in a scratch repository with the release's own built-in
  directive files, as its `init` writes them (bug-010), must pass `wingfoil workflow list`,
  `wingfoil dna show` and `wingfoil directives list`, each run with `--format json`, with exit code
  0 and no warning: no stderr line, no stdout line starting `Warning:`, no `workflow list`
  diagnostic of severity warning or error, no `directives list` warning (plan-042, rulings L and
  M). With them, on the same two releases (the releases the matrix selects), `npm run check:runs`
  exits 0 with a scenario that starts every `main` the pack ships (for a pack that ships none, a
  `main` of the composition that reaches its workflows, where the tooling can); and, for a pack
  whose README carries install steps, the adoption run on a composition that holds the pack, once
  per `init` template (Scrum and Kanban today), exits 0 (dl-032 E3).
- A pack with a conditional part (spec-001 §6.5) is validated in the composition with every
  entry's pack and in each with one entry's pack left out in turn. `npm run validate` derives
  these legs (`[+<pack>]`, `[-<pack>]`) from each composition that holds it, and skips with its
  line a leg the format forbids or that lacks a parameter's value; a leg adding `software` needs a
  methodology, so for a pack that is not one it comes from a documented combination (a README
  example or a preset) that holds a methodology, and a publication fails when an entry's pack is
  held by no composition with the pack that ran (plan-039 R2, R6). `npm run check:packs` composes,
  besides, a pack declaring `tensions` with each pack they name and every pack with each `stage/*`
  overlay (dl-025 D6).
- Compose twice from a clean state: the two outputs must be byte-identical.
- Record the commands, the WingFoil versions and the exit codes in the `pack-release` element.
  A claim of "it validates" without the command and its result is not evidence.
- A run by hand (a charter's run in its plan, an exit criterion's in its task) records: the
  WingFoil version and commit as `wingfoil version` prints them; the packs composed and the commit
  they were composed from (for an untracked draft, the base commit, and that the draft is untracked
  and cannot be repeated from the repository); the parameters that differ from the defaults; the
  count of commands and how many exited 0; every non-zero exit with its command and whether it was
  expected (a refusal the run seeks) or a slip of the driving script; the states and iterations
  the run reached. No local or scratch path. A scripted run (`check:runs`) records its command,
  its exit code and its run count (dl-037 E2).
- A pack that needs a WingFoil feature not yet published declares the capability; it is not
  published until `compat.yaml` lists a released WingFoil that provides it, and it is never
  published against an unreleased WingFoil build.
