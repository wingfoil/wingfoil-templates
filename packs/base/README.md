<!-- generated:begin title -->
# Base

The core of every project governed by WingFoil, software or not: the Memory types, workflows, directives and DNA that all of them use, and nothing that only some use.

Axis: foundation
<!-- generated:end title -->

## When to use it

Every project governed by WingFoil, software or not, starts from `base`: it holds the decision-log,
task and plan types, the workflow that changes the project's own governance, the generic directives
and the DNA every project shares (one approver, one agent without approval authority). Other packs
only add to it or tighten it. It serves every adoption profile (solo developer, code reviewer,
team developer, tech lead, non-technical manager, architect), since every composition contains it.
It is not meant to be used alone by a software project, which takes `software` on top of it for its
life cycle and its software types.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block][install] of the catalog.

[install]: https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install

Until WingFoil installs packs, a project adopts `base` by hand, with a WingFoil release in the
pack's range (see its catalog entry):

1. For a project that is already governed, compare its Memory types, states, workflows and phases
   with `base`'s (section "What it adds"), and move any `parked` plan back to `active` by a
   hand-written status commit, since `base`'s `plan` has no such state.
2. Compose `base` with the reference composer of wingfoil-templates, giving the four required
   parameters (`project_name`, `approver_name`, `approver_email`, `agent_name`) and, for a project
   that is already governed, its current values of the path and id parameters, so that no file
   moves.
3. Copy the composed `.wingfoil/` files into the project's `.wingfoil/`, keeping its `custom/`
   folders, then re-add to `dna.yaml`, `memory.yaml`, `roles.yaml` and `workflows.yaml` the
   project's own entries (its members, modules, stacks, Memory types and the `include` entries of
   its `custom/` workflows); copy the generated AGENTS.md region into its `AGENTS.md`.
4. Remove the directives WingFoil's `init` wrote under `directives/custom/` with the ids of
   `base`'s directives (`traceability`, `doc-versioning`, `security-secrets`): a `custom/` file
   wins over the pack's.
5. Migrate by explicit commits the elements whose state has another name in `base` (for example a
   `decision-log` on the default machine: `pending` → `in-discussion`, `approved` → `ready`), and
   record an old → new key mapping for the workflows and phases the project renames.
6. From then on, a plan started with `workflow start` is closed with `workflow end`, and a phase
   plan, which carries `parent`, with a hand-written `finalize` commit: `submit` no longer closes a
   plan.
7. Record the adopted version of `base` in the project's own Memory.

<!-- generated:begin composition -->
## Composition

- **Requires:** none
- **Conflicts:** none
- **Formats:** `directive` 1, `dna` 1, `memory` 1, `memory-template` 1, `roles` 1, `workflow` 1
- **Requires capabilities:** `workflow-engine`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `governance-evolution` (main)
  - `assess`, role `facilitator`
  - `propose`, role `facilitator`
  - `approve`, role `approver`, gate `approver`
  - `apply`, role `facilitator`

### Memory types

- `decision-log`: `draft` → `in-discussion` → `ready`; gates `in-discussion` (reject → `draft`)
- `plan`: `draft` → `active` → `done`
- `task`: `draft` → `pending` → `backlog` → `in-progress` → `in-review` → `approved` → `done`; gates `in-review` (reject → `in-progress`), `pending` (reject → `draft`)

### Directives

- `claim-sources`: global
- `doc-versioning`: global
- `security-secrets`: global
- `traceability`: `facilitator`

### Fragments

- `dna`
- `roles`

### Memory templates

- `decision-log`
- `plan`
- `task`
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `agent_name` | string | required | The name of the agent in dna.yaml team.agents |
| `approver_email` | string | required | The approver's email, which WingFoil matches to the git user to grant approval |
| `approver_name` | string | required | The name of the approver, the team member who approves |
| `decision_log_path` | path | `docs/memory/decision-log/{id}.md` | The decision-log type's path; only letters, digits and . _ / { } - |
| `plan_id` | pattern | `plan-{n}-{slug}` | The plan type's id pattern |
| `plan_path` | path | `docs/plans/{id}.md` | The plan type's path; only letters, digits and . _ / { } - |
| `project_name` | string | required | The project's name: dna.yaml project.name |
| `task_path` | path | `docs/memory/task/{id}.md` | The task type's path; only letters, digits and . _ / { } - |
<!-- generated:end parameters -->

## Examples

None yet: no methodology pack is published.

## Sources and adaptations

- WingFoil 0.3.0's own configuration: the state names and gates of `decision-log`, `task` and
  `plan`, and the `waiting` edge that closes a plan. `base` keeps `waiting` only where WingFoil
  0.3.0 drives the edge for every project, so `task` moves with `submit` and `approve`.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-base)
