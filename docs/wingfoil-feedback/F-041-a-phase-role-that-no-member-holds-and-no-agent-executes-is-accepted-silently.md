---
id: F-041
title: "A phase role that no member holds and no agent executes is accepted, and nothing says so"
kind: gap
status: open
wingfoil_version: 0.3.1
answered_by: []
---

New note (task-064). From this repository's `software` pack (plan-051's recheck, plan-052 ruling
5): its workflows give eight phases to `tech-lead`, a role a composition's DNA may declare while no
member holds it and no agent executes as it; WingFoil runs those phases with no word about it. For
an approval role it does report the gap (`no approver found for role 'approver' in dna.yaml`,
spec-017 §5.1). Distinct from F-020 (`executes_as` must name declared roles) and F-026 (one role per
phase).

## Observed

WingFoil 0.3.1 (`870bd440`) and 0.3.0 (`cc31d7a8`), installed from npm, pinned by the lockfiles
`src/matrix/wingfoil-0.3.1/` and `src/matrix/wingfoil-0.3.0/`, in a scratch project (`git init`,
`wingfoil init --template Kanban --no-interactive`; `dna.yaml` declares the role `tech-lead`, its
only member `Tester` holds `[approver, developer]`, `team.agents` is empty), with one custom
workflow included in `workflows.yaml` and committed:

```yaml
# .wingfoil/workflows/custom/tag.yaml
name: tag
kind: main
description: "Tag a release"
version: 1
format: 1
phases:
  - name: tag
    description: "Push the tag."
    role: tech-lead
    produces:
      - "docs/tag.md"
```

Both releases give the same result:

```
$ wingfoil workflow list --format json                     # excerpt
"diagnostics":[]                                                                 # exit 0
$ wingfoil workflow start tag                              # excerpt
next step: tag.tag
  role: tech-lead
  evidence missing: produces                                                     # exit 0
$ wingfoil workflow status                                 # excerpt
    frontier:
      - tag.tag (tech-lead; missing: produces)                                   # exit 0
$ git add docs/tag.md && git commit -m tag                 # docs/tag.md written first
$ wingfoil workflow next
no next step: workflow 'tag' is complete                                         # exit 0
$ wingfoil workflow end tag-1-plan
ended tag (tag-1-plan)                                                           # exit 0
```

For a role a member holds, `workflow next` prints `role: approver — held by Tester`; for
`tech-lead` it prints the role alone.

## Expected

The step says that nobody holds its role, as an approval's routing error does: `workflow next` and
`workflow status` print `held by nobody` (and `--format json` carries it) for a role that no member
holds and no agent executes as; or `workflow list` warns once per such role used by a phase. A fresh
`init` declares roles before anyone holds them, so a warning at the step is less noisy than one at
load.
