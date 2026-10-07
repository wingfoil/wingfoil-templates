---
id: F-018
title: "where: on iterate_over is declared but nothing evaluates it"
kind: gap
status: open
wingfoil_version: 0.2.2
answered_by: []
---

Formerly T18.

## Observed

WingFoil 0.2.2 from npm, 2026-10-06. A phase with `iterate_over: task` and `where: { pack: "" }`:
`wingfoil workflow list` accepts the clause, with exit 0 and no warning. No command evaluates it:
`wingfoil memory search` filters only by `--type`, `--status`, `--tag` and a keyword, and does not
print the `pack` field; nothing lists the elements a phase iterates over. The iteration is followed
by hand, reading each task's frontmatter.

## Expected

A command that lists an iteration's elements (for example `wingfoil workflow elements <workflow>
<phase>`), or a `memory search --field pack=` filter, and a check that a `where` key is a field of
the iterated type.

Suggested kind in WingFoil: input to the workflow engine's tech-spec (v0.3).
