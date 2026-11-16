---
id: F-051
title: "A workflow phase cannot bind a directive"
kind: request
status: open
wingfoil_version: 0.3.2
answered_by: []
---

New note (task-092). From this repository's spec-003 (S3-O2): a pack adds a workflow, and a
directive that governs one of its steps, only when another pack is also present; the directive
must reach the agent at that step and no other. `workflow next` lists a step's directives from
`roles.yaml` only, the role's entry and `global` (spec-017 §6.2), so a directive that belongs to
one phase either reaches every step of its role, in every workflow, or reaches none and is named
only in an action's text. The request: a phase that binds directives, listed by `workflow next` at
its steps beside the role's; once a release has it, such a workflow may bind its directive instead
of naming it in an `agent.execute` action (spec-003 §7.2). Distinct from F-016 (a phase cannot
declare the method it follows), which asks for the method, not its directives; and from F-026 (a
phase has one role, so the role cannot depend on the element), whose directives per role are
today's only binding.

## Observed

WingFoil 0.3.2 (`6de2e13c`), installed from npm, pinned by the lockfile
`src/matrix/wingfoil-0.3.2/`, in a scratch project: `git init`, `wingfoil init --template Kanban
--no-interactive`, then `wingfoil dna add team.members --value "Tester" --entry-email
tester@notes.example --entry-roles approver,developer` (a fictional identity, also the git
identity). Then `wingfoil directive create --name route-rules` (a custom directive, assigned to no
role and not `global`, so neither source of §6.2 lists it) and, written by hand and committed,
`.wingfoil/workflows/custom/bug-route.yaml`, a main workflow (`format: 1`, no `element`) with one
phase `route` (role `developer`, action `'memory.add(type: bug)'`), included in `workflows.yaml`.

Excerpts: long lines wrapped; every command exits 0.

```
$ wingfoil workflow start bug-route
started bug-route as bug-route-1-plan (active)
$ wingfoil workflow next
workflow: bug-route (bug-route-1-plan)
next step: bug-route.route
  trail: bug-route.route
  scope: (none)
  role: developer — held by Tester
  directives: code-quality, determinism, doc-versioning, documentation, security,
    security-secrets, testing
  actions:
    - memory.add(type: bug) [wingfoil: wingfoil memory add --type bug --title <title>
      --workflow bug-route-1-plan --step bug-route.route]
  evidence missing: record (finalizable)
```

Then the phase's actions gain `'agent.execute(directive: route-rules)'` before `memory.add`,
committed:

```
$ wingfoil workflow next
…
  directives: code-quality, determinism, doc-versioning, documentation, security,
    security-secrets, testing
  actions:
    - agent.execute(directive: route-rules) [agent: wingfoil agent execute
      --workflow bug-route-1-plan --step bug-route.route]
    - memory.add(type: bug) [wingfoil: wingfoil memory add --type bug --title <title>
      --workflow bug-route-1-plan --step bug-route.route]
…
```

`route-rules` is in no `directives:` line: named in an action, it is printed as that action's text,
and the command offered for it does not carry it (as F-034 notes for `memory.add`'s arguments).
What 0.3.2 offers instead: that action text, or `wingfoil directive assign` to the role in
`roles.yaml`, which lists the directive at every step the role holds, in every workflow.

## Expected

A phase key (for example `directives: [route-rules]`) whose ids `workflow next` lists at that
phase's steps with the role's, marked by their source (for example `directives: … (role),
route-rules (phase)`), and passes to an agent the step launches like the role's; `workflow list`
reports an id that names no directive.
