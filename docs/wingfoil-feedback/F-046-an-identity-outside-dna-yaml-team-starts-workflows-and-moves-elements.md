---
id: F-046
title: "An identity outside dna.yaml's team starts workflows and moves elements"
kind: request
status: open
wingfoil_version: 0.3.2
answered_by: []
---

New note (task-077). From this repository's plan-064: WingFoil UI reported, on adopting this
repository's packs, that a non-approver identity can start workflows and complete their non-approval
steps. WingFoil requires a git identity for every commit (REQ-SEC-01) and checks roles for approvals
(REQ-SEC-03); nothing checks that the identity is a member of `team` at all. The request: membership
checked for every command that commits. Distinct from F-041 (a role no member holds).

## Observed

WingFoil 0.3.2 (`6de2e13c`), installed from npm, pinned by the lockfile
`src/matrix/wingfoil-0.3.2/`, in a scratch project: `git init`, `wingfoil init --template Kanban
--no-interactive`, then `wingfoil dna add team.members --value "Tester" --entry-email
tester@notes.example --entry-roles approver,developer` (a fictional identity, also the git identity
unless said otherwise).

Then the git identity is changed to `Visitor <visitor@notes.example>`, which no `team.members` entry
holds:

Excerpts: omitted lines shown as `…`, long lines wrapped; every command exits 0 unless noted.

```
$ wingfoil workflow start bug-ingest                    # exit 0
started bug-ingest as bug-ingest-1-plan (active)
$ wingfoil memory add --type bug --title "A bug" --workflow bug-ingest-1-plan --step bug-ingest.capture
$ wingfoil memory submit bug-001-a-bug                  # draft → pending, exit 0
$ wingfoil workflow status
open workflows: 1
* bug-ingest-1-plan (bug-ingest) — active
    element: bug:bug-001-a-bug (pending)
    phases: capture complete, approve current
    …
pending approvals: 1
    …
$ wingfoil memory approve bug-001-a-bug --reason x
error: user not authorized to approve type 'bug'        # exit 1
$ git log --format='%an <%ae> %s'
Visitor <visitor@notes.example> wf(bug): submit bug-001-a-bug
Visitor <visitor@notes.example> wf(bug): add bug-001-a-bug
Visitor <visitor@notes.example> wf(plan): submit bug-ingest-1-plan
Visitor <visitor@notes.example> wf(plan): add bug-ingest-1-plan
Tester <tester@notes.example> wf(dna): add team.members Tester
```

Only the approval is refused: an identity outside the team starts a workflow, creates an element and
completes a phase with it, each committed under its name.

## Expected

Every command that commits checks that the git identity is a member of `team.members` (or an agent
of `team.agents`, through its trailer), and refuses otherwise, for example `error: Visitor
<visitor@notes.example> is not a member of the team (dna.yaml team.members)`; a project that wants
open contribution says so in `dna.yaml` (an explicit opt-out). Approvals keep their role check.
