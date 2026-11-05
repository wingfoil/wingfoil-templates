---
id: F-045
title: "workflow status heads elements waiting at a gate \"ungated elements\""
kind: request
status: open
wingfoil_version: 0.3.2
answered_by: []
---

New note (task-077). From this repository's plan-064: WingFoil UI reported the heading on adopting
this repository's packs. It follows WingFoil's spec-017 §5.1, where "ungated elements" are the
elements in a gated state that no pending approval of any open instance carries: the word means "not
carried by a workflow", while each element listed is waiting at a gate. F-044 is about which
elements the same list holds.

## Observed

WingFoil 0.3.2 (`6de2e13c`), installed from npm, pinned by the lockfile
`src/matrix/wingfoil-0.3.2/`, in a scratch project: `git init`, `wingfoil init --template Kanban
--no-interactive`, then `wingfoil dna add team.members --value "Tester" --entry-email
tester@notes.example --entry-roles approver,developer` (a fictional identity, also the git identity
unless said otherwise).

```
$ wingfoil memory add --type decision-log --title "A decision"
$ wingfoil memory submit dl-001-a-decision              # draft → pending (a gate), exit 0
$ wingfoil workflow status                              # exit 0
no open workflows
ungated elements: 1
  human needed: approve or reject dl-001-a-decision (decision-log, pending; no open workflow
  carries it) — routed to Tester <tester@notes.example>
```

## Expected

A heading that says what the list holds, for example "waiting at a gate, outside any workflow: 1"
(and the same name in `--format json` and in the documentation), so that a reader does not take
"ungated" for "with no gate".
