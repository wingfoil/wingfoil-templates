---
id: F-052
title: "A directive that no role binds and no step names raises no warning"
kind: request
status: open
wingfoil_version: 0.3.2
answered_by: []
---

New note (task-101). From this repository's task-099 (a run by hand of a pack's workflows on 0.3.2)
and its retrospective, plan-078: a custom directive that no role binds in `roles.yaml` and that is
not `global` reaches no step, since `workflow next` lists a step's directives from the role's entry
and `global` only (spec-017 §6.2), and nothing says so. `directives list` already shows it as
`"assignment": "unassigned"`, and the reverse case, a binding with no directive file, is warned of
at the step on both releases (`workflow next`'s `directiveWarnings`) and by `directives list` on
0.3.2; a step also warns on a role with no directive (`no directives assigned to role '<role>'`).
The request is the missing half: a warning on a directive nothing binds. Distinct from F-051 (a
phase cannot bind a directive), which asks for a binding, not for a warning on a missing one; from
F-041 (a phase role that no member holds and no agent executes is accepted silently), its neighbour
for roles; names F-034 (the command offered for a `memory.add` action drops its arguments), since an
`agent.execute` naming a directive is likewise read as text only.

## Observed

WingFoil 0.3.0 (`cc31d7a8`) and 0.3.2 (`6de2e13c`), each installed from npm, pinned by the
lockfiles `src/matrix/wingfoil-0.3.0/` and `src/matrix/wingfoil-0.3.2/`, each in a scratch project
of its own: `git init`, `wingfoil init --template Kanban --no-interactive`, then `wingfoil dna add
team.members --value "Tester" --entry-email tester@notes.example --entry-roles
approver,developer` (a fictional identity, also the git identity). On the fresh project, `directives
list --format json` has no entry with `"assignment": "unassigned"` and `"warnings": []`.

Excerpts from 0.3.2: long lines wrapped, a JSON output reduced to the fields named; every command
exits 0. 0.3.0 gives the same output except where marked.

```
$ wingfoil directive create --name route-rules      # commits it
$ wingfoil directives list --format json
  entry: {"path": "directives/custom/route-rules.md", "roles": [], "global": false,
          "assignment": "unassigned"}
  "warnings": []
$ wingfoil workflow list --format json
  "diagnostics": []
```

Then, written by hand and committed, `.wingfoil/workflows/custom/bug-route.yaml`, included in
`workflows.yaml` after `bug-ingest.yaml`:

```yaml
name: bug-route
kind: main
format: 1
description: "Route a bug"
phases:
  - name: route
    description: "Add the bug."
    role: developer
    actions:
      - 'memory.add(type: bug)'
```

```
$ wingfoil workflow start bug-route
started bug-route as bug-route-1-plan (active)
$ wingfoil workflow next
…
  role: developer — held by Tester
  directives: code-quality, determinism, doc-versioning, documentation, security,
    security-secrets, testing
…
$ wingfoil workflow next --format json
  "directiveWarnings": []
```

The reverse case, for comparison: `ghost` added under `developer` in `roles.yaml`, with no file,
committed, then reverted:

```
$ wingfoil directives list --format json
  "warnings": ["directive 'ghost' bound to role 'developer' has no directive file"]   # 0.3.2
  "warnings": []                                                                      # 0.3.0
$ wingfoil workflow next --format json
  "directiveWarnings": ["directive 'ghost' bound to role 'developer' has no directive file"]
```

So the step already warns on a binding with no file, on both releases; nothing warns on a file with
no binding.

A directive named in an action, the case a warning should spare: the phase's actions gain
`'agent.execute(directive: route-rules)'` before `memory.add`, committed:

```
$ wingfoil workflow next
…
  actions:
    - agent.execute(directive: route-rules) [agent: wingfoil agent execute
      --workflow bug-route-1-plan --step bug-route.route]
…
$ wingfoil workflow next --format json
  action: {"token": "agent.execute(directive: route-rules)", "unresolved": [],
           "binding": {"kind": "agent", "argv": ["wingfoil", "agent", "execute",
           "--workflow", "bug-route-1-plan", "--step", "bug-route.route"]}}
  "directiveWarnings": []
$ wingfoil directives list --format json
  "warnings": []
$ wingfoil workflow list --format json
  "diagnostics": []
```

With `no-such-directive` in place of `route-rules`, committed, `workflow next` prints that id the
same way and `workflow list` gives `"diagnostics": []`: neither release reads the argument.

What 0.3.2 does instead: the `assignment` field of `directives list`, which a reader must scan for
`unassigned`; no warning, diagnostic or exit code.

## Expected

A warning in `directives list`'s `warnings`, beside the dangling binding's, for a directive that no
role binds, that is not `global` and that no workflow action names (for example `directive
'route-rules' is bound to no role and named by no workflow`); or, as an alternative, the same in
`workflow list`'s `diagnostics`. None for a directive an `agent.execute(directive: <id>)` action
names, which needs the action's `directive:` argument read; once it is read, an id that names no
directive could be reported too. A fresh `init` of the `Kanban` template has no unassigned
directive, so the warning would not fire on a new project.
