---
id: F-020
title: "A composed .wingfoil/ must satisfy WingFoil's own schemas, which nothing exposes"
kind: gap
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-007).

## Observed

WingFoil 0.2.2 from npm. In a scratch git repository after `wingfoil init --template Kanban
--no-interactive`, replace `.wingfoil/dna.yaml` with `version: 1`, `project: { name: x }`, then:

```
$ wingfoil dna show            # one line of output, wrapped here
error: E_VALIDATION modules (.../.wingfoil/dna.yaml): Invalid input: expected array, received undefined;
E_VALIDATION stacks (...): Invalid input: expected object, received undefined; E_VALIDATION team (...):
Invalid input: expected object, received undefined; E_VALIDATION paths (...): Invalid input: expected
object, received undefined
$ echo $?
1
```

Directive frontmatter is checked the same way (`name`, `type: directive` and `kind` required, as
`directives list` reports), and an agent's `executes_as` must name roles declared in `team.roles`.
These rules exist only inside WingFoil's loaders: no command or published file exposes them, so a
tool that writes a `.wingfoil/` (the WingFoil-Templates composer) learns them only by running
WingFoil on its output.

## Expected

WingFoil publishes the schemas of the files it reads (dna, roles, memory, workflows, workflow,
directive, Memory template), per format, as JSON Schema in the npm package or through a command, so
that a composer can validate what it writes before WingFoil reads it.
