---
id: F-042
title: "memory reject leaves a state over its WIP limit, and nothing says so"
kind: request
status: open
wingfoil_version: 0.3.1
answered_by: []
---

New note (task-073). From this repository's `methodology/kanban` pack (plan-056's run on the
engine, step 4; task-069): its `task` declares `limits` on `in-progress` and `in-review`, and a
review sending a task back with `memory reject` left `in-progress` holding more tasks than its
limit, silently. WingFoil exempts `reject` and `park` from the WIP check by design (WingFoil dl-156
Q2 (i), task-274: "the approver's verdict and a scheduling step are not capped by a capacity rule",
in its `memory-transition` module and in the schema's comment on `limits`; WingFoil's README lists
work-in-progress limits without the exemption). This note does not ask to refuse the move: it asks
the move to say what it did. No earlier note covers WIP limits.

## Observed

WingFoil 0.3.1 (`870bd440`) and 0.3.0 (`cc31d7a8`), installed from npm, pinned by the lockfiles
`src/matrix/wingfoil-0.3.1/` and `src/matrix/wingfoil-0.3.0/`, in a scratch project (`git init`,
`wingfoil init --template Kanban --no-interactive`). `init` gives `task` the `defaults.states`
machine (`draft → pending → approved`, no limit), so `task` gets a machine of its own, written by
hand in `.wingfoil/memory.yaml`, and `dna.yaml` gets one member holding `approver` (the git
identity `Tester <tester@plover.example>`), both committed:

```yaml
# .wingfoil/memory.yaml, under types.task
    states:
      sequence: [ draft, backlog, in-progress, in-review, done ]
      gates:
        in-review: { reject: in-progress }
      limits:
        in-progress: 1
```

```yaml
# .wingfoil/dna.yaml, team
  members:
    - name: Tester
      email: tester@plover.example
      roles: [approver, developer]
```

`workflow list --format json` reports `"diagnostics":[]` (exit 0). Three tasks are added (`memory
add --type task`) and moved to `backlog` (`memory submit`, each exit 0). Then both releases give the
same result (each refusal is one line, wrapped here and shortened at `…`):

```
$ wingfoil memory submit task-001-task-a                   # backlog → in-progress; exit 0
$ wingfoil memory submit task-002-task-b
error: WIP limit reached for 'in-progress' on type 'task' (limit 1): held by task-001-task-a.
Move one of them out of 'in-progress', then retry. …                             # exit 1
$ wingfoil memory submit task-001-task-a                   # in-progress → in-review; exit 0
$ wingfoil memory submit task-002-task-b                   # backlog → in-progress; exit 0
$ wingfoil memory reject task-001-task-a --reason "Changes asked"
{
  "id": "task-001-task-a",
  "path": "docs/memory/task/task-001-task-a.md",
  "from": "in-review",
  "to": "in-progress",
  "reason": "Changes asked"
}                                                                                # exit 0
$ wingfoil memory submit task-003-task-c
error: WIP limit reached for 'in-progress' on type 'task' (limit 1): held by task-001-task-a,
task-002-task-b. Move one of them out of 'in-progress', then retry. …          # exit 1
```

After the reject, `in-progress` holds two tasks under a limit of 1; the reject prints nothing about
it, on stdout or stderr, and only the next forward move into the state shows it.

## Expected

The exemption kept, as dl-156 Q2 (i) rules it, and the move reported: when `reject` (or `park`, or
any exempt move) leaves its target state at more holders than its limit, the success carries a
warning naming the state, its limit and its holders, through the channel a success already uses when
a limit may be undercounted (`W_MEMORY_UNREADABLE`), for example `warning: 'in-progress' on type
'task' now holds 2 (limit 1): task-001-task-a, task-002-task-b; nothing else can move into it until
it is back below its limit`. A team then sees at once that its next step is to bring the state back
within its limit, instead of finding it out at a later refusal.
