---
id: F-043
title: "A frontmatter field cannot be declared a reference to an element of a type"
kind: request
status: open
wingfoil_version: 0.3.2
answered_by: []
---

New note (task-077). From this repository's plan-064: WingFoil UI reported it on adopting this
repository's `methodology/scrum` pack, whose `sprint` workflow selects a Sprint's tasks and releases
by their `sprint` field (`where: { …, sprint: "{sprint.id}" }`); a field naming no Sprint is
accepted, and the element is then never selected, silently (this repository's bug-015). A pack
cannot check the reference: a `checks.post` token resolves only through a project's
`workflows/bindings.yaml`, which packs do not ship. It builds on 0.3.2's required-fields check and
its `not_applicable_allowed` value (`"n/a — <reason>"`). Distinct from F-018 (`where:` on
`iterate_over`).

## Observed

WingFoil 0.3.2 (`6de2e13c`), installed from npm, pinned by the lockfile
`src/matrix/wingfoil-0.3.2/`, in a scratch project: `git init`, `wingfoil init --template Kanban
--no-interactive`, then `wingfoil dna add team.members --value "Tester" --entry-email
tester@notes.example --entry-roles approver,developer` (a fictional identity, also the git identity
unless said otherwise).

In `.wingfoil/memory.yaml`, written by hand and committed: `task`'s `template.frontmatter.required`
gains `sprint`, with `not_applicable_allowed: [sprint]`, and a type `sprint` (`path:
docs/memory/sprint/{id}.md`, `id_pattern: "sprint-{n}-{slug}"`). `workflow list --format json`
reports `"diagnostics":[]`. No Sprint exists (`memory search --type sprint`: no match). Three tasks
are added with `memory add --type task`; one is left without `sprint`, one gets `sprint:
sprint-099-does-not-exist`, one `sprint: "n/a — not planned in a Sprint"` (edited and committed):

Excerpts: omitted lines shown as `…`, long lines wrapped; every command exits 0 unless noted.

```
$ wingfoil memory submit task-003-three
error: missing required field on submit: sprint        # exit 1
$ wingfoil memory submit task-001-one                   # sprint: sprint-099-does-not-exist
{ … "from": "draft", "to": "pending" }                  # exit 0
$ wingfoil memory submit task-002-two                   # sprint: "n/a — not planned in a Sprint"
{ … "from": "draft", "to": "pending" }                  # exit 0
```

## Expected

A way to declare a frontmatter field a reference to an element of a type (for example `references: {
sprint: sprint }` beside `required`), checked where the required-fields check runs, at `memory
submit` (and reported by `workflow list` for the elements already holding a dangling value): a value
naming no element of that type is refused, `error: field 'sprint' names no sprint:
sprint-099-does-not-exist`; the not-applicable value `"n/a — <reason>"` stays accepted where the
type allows it; a value naming a `deprecated` element is reported, not refused. A `where` on a
reference field then never silently drops an element.
