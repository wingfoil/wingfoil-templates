---
id: F-019
title: "WingFoil's built-in directive ids cannot be read without a project"
kind: gap
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-006). Relates to F-017, which asks WingFoil to publish the reserved ids.

## Observed

WingFoil 0.2.2 from npm. In a scratch git repository:

```
$ git init -q && git commit -q --allow-empty -m init
$ wingfoil init --template Kanban --no-interactive
$ ls .wingfoil/directives/built-in/
architecture.md  code-quality.md  code-review.md  documentation.md  security.md  testing.md
$ wingfoil directives list    # lists them with "kind": "built-in"
```

The ids are readable only from a project that `wingfoil init` scaffolded; no command prints them
without one (`wingfoil --help` lists `init`, `mcp`, `directive`, `directives`, `dna`, `memory`,
`paths`, `workflow`). A tool that composes a `.wingfoil/` for a project not yet initialized must
know them to refuse a colliding pack directive (spec-001 §7.6) and to accept a `roles.yaml` that
assigns them (§7.4). WingFoil-Templates therefore keeps a copy of the six ids, read from
`node_modules/wingfoil/dist/storage/builtin-directives.js` (its `src/wingfoil-builtins.ts`), which
has to be re-checked at every pin bump.

## Expected

WingFoil publishes its built-in directive ids, per release, without a project: in the output of a
command (for example the `wingfoil capabilities` of F-013), or as data in the npm package.
