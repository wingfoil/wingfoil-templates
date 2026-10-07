---
id: F-021
title: "WingFoil runs only at the root of a git repository"
kind: request
status: open
wingfoil_version: 0.2.2
answered_by: []
---

New note (task-007).

## Observed

WingFoil 0.2.2 from npm:

```
$ mkdir /tmp/x && cd /tmp/x && wingfoil workflow list
error: E_NO_GIT_ROOT: not inside a git repository          (exit 1)
$ git init -q && mkdir sub && cd sub && wingfoil workflow list
error: E_NOT_AT_GIT_ROOT: run wingfoil from the project root   (exit 1)
```

Every command, read-only ones included, needs the working directory to be the root of a git
repository. Checking a composed `.wingfoil/` therefore needs a throw-away `git init` around it, and
a command cannot be pointed at another project's directory.

## Expected

Read-only commands (`workflow list`, `dna show`, `directives list`, `paths`) accept a project
directory that is not a git root, or a `--project <dir>` option; or the requirement and its reason
are documented, with the `git init` pattern for tools.
