---
id: F-050
title: "A frontmatter field cannot declare the values it allows"
kind: request
status: open
wingfoil_version: 0.3.2
answered_by: []
---

New note (task-092). From this repository's spec-003 (S3-O1): a pack declares a list of values,
for example the outcomes a triaged item may take, as a parameter the project configures; the
types' frontmatter fields that hold one of those values cannot say so in `memory.yaml`, so a value
outside the list is accepted and only a pack's own lint, outside WingFoil, could catch it. It
builds on 0.3.2's required-fields check at `memory submit` and on `template.frontmatter`'s keys
(`required`, `not_applicable_allowed`, `lists`, `exempt`). The request: an allowed-values key for a
field, checked where the required-fields check runs; once a release has it, a pack may write its
list there from the parameter (spec-003 §3.3). Distinct from F-043 (a field as a reference to an
element of a type), which asks for a check of the same kind, and from F-018 (`where:` on
`iterate_over`), which F-043 cites.

## Observed

WingFoil 0.3.2 (`6de2e13c`), installed from npm, pinned by the lockfile
`src/matrix/wingfoil-0.3.2/`, in a scratch project: `git init`, `wingfoil init --template Kanban
--no-interactive`, then `wingfoil dna add team.members --value "Tester" --entry-email
tester@notes.example --entry-roles approver,developer` (a fictional identity, also the git
identity).

In `.wingfoil/memory.yaml`, written by hand and committed, `bug`'s template gains a required
`severity` and a would-be key for its values (the name `allowed` is this note's, not 0.3.2's):

```yaml
    template:
      file: memory/templates/bug.md
      frontmatter:
        required: [id, type, title, status, severity]
        allowed:
          severity: [low, high]
```

Excerpts: a command's output left out where none is shown, omitted lines within shown output as
`…`; every command exits 0 unless noted.

```
$ wingfoil memory add --type bug --title "A bug"
{ "id": "bug-001-a-bug", "path": "docs/memory/bug/bug-001-a-bug.md" }
$ # severity: critical written in the bug's frontmatter by hand
$ wingfoil memory submit bug-001-a-bug
{ …, "from": "draft", "to": "pending" }
$ wingfoil memory add --type bug --title "Empty"        # severity left empty
$ wingfoil memory submit bug-002-empty
error: missing required field on submit: severity        # exit 1
$ wingfoil workflow list --format json
{ …, "diagnostics": [] }
$ wingfoil directives list --format json
{ …, "warnings": [] }
```

`severity: critical`, a value outside the list, passes `memory submit`. 0.3.2's
`template.frontmatter` schema knows `required`, `not_applicable_allowed`, `lists` and `exempt`
and passes other keys through, so `allowed` loads and is ignored; no command printed a warning for
it. What 0.3.2 offers instead is the required-fields check: an empty `severity` is refused, any
non-empty value accepted.

## Expected

A key of `template.frontmatter` (for example `allowed: { <field>: [<value>, …] }`) that lists the
values a field may hold, checked at `memory submit` where the required-fields check runs, with an
error naming the field, the value and the list (for example `error: bug-001-a-bug: severity
"critical" is not one of low, high (memory.yaml bug.template.frontmatter.allowed)`); a field with
`not_applicable_allowed` keeps its not-applicable value; and an unknown key of
`template.frontmatter` warned about at load, as spec-009 §2 describes for unknown fields.
