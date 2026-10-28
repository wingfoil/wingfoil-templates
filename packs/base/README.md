<!-- generated:begin title -->
# Base

The core of every project governed by WingFoil, software or not: the Memory types, workflows, directives and DNA that all of them use, and nothing that only some use.

Axis: foundation
<!-- generated:end title -->

## When to use it

Every project governed by WingFoil, software or not, starts from `base`: it holds the decision-log,
task and plan types, the workflows that capture a decision, run a retrospective and change the
project's own governance, the generic directives and the DNA every project shares (one approver, one
agent without approval authority). Other packs only add to it or tighten it. It serves every
adoption profile (solo developer, code reviewer, team developer, tech lead, non-technical manager,
architect), since every composition contains it. It is not meant to be used alone by a software
project, which takes `software` on top of it for its life cycle and its software types.

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
   the `custom/` workflows the project wrote itself); copy the generated AGENTS.md region into its
   `AGENTS.md`.
4. Remove what WingFoil's `init` scaffolded under `custom/` and a composition replaces:
   - the directives with the ids of `base`'s directives (`traceability`, `doc-versioning`,
     `security-secrets`), since a `custom/` file wins over the pack's;
   - the workflows `decision-log-ingest`, which `base` ships, and `sw-life-cycle`, `adr-ingest`,
     `bug-ingest` and `scrum-delivery` or `kanban-delivery`, which need `software` and a
     methodology, whose packs ship or replace them, each with its `include` entry in
     `workflows.yaml`: a workflow named as a pack's makes every `workflow` command fail, and the
     others need roles and Memory types `base` alone does not define.
5. Migrate by explicit commits the elements whose state has another name in `base` (for example a
   `decision-log` on the default machine: `pending` → `in-discussion`, `approved` → `ready`), and
   record an old → new key mapping for the workflows and phases the project renames.
6. From then on, a plan started with `workflow start` is closed with `workflow end`, and a phase
   plan, which carries `parent`, with a hand-written `finalize` commit: `submit` no longer closes a
   plan.
7. Record the adopted version of `base` in the project's own Memory.

**Updating from 1.0.0.** A project that relied on 1.0.0's defaults and keeps its values states
them (`plan_id: plan-{n}-{slug}`). A `retrospective_path` that names a directory gains its
trailing `/`, which WingFoil needs to read it as one. A project that keeps a `plan_id` without
`{workflow}` and `{phase}` fills a started plan's `workflow` and `phase` by hand (the main's name
and the instance number, e.g. `1`) and submits it, or uses the new pattern for its new plans: ids
already given never change. Then it recomposes
`base` and copies the `.wingfoil/` files as in steps 2 and 3.

**Updating from 2.0.0.** Nothing to recompose. A project that kept and re-included the workflows
`init` scaffolded removes them with their `include` entries, as step 4 says.

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

- `decision-log-ingest` (main)
  - `capture`, role `product-owner`
  - `approve`, role `approver`, gate `approver`
- `governance-evolution` (main)
  - `assess`, role `facilitator`
  - `propose`, role `facilitator`
  - `approve`, role `approver`, gate `approver`
  - `apply`, role `facilitator`
- `retrospective` (sub)
  - `explore`, role `facilitator`
  - `additional-points`, role `approver`, gate `approver`
  - `capture`, role `facilitator`
  - `approve`, role `approver`, gate `approver`
- `retrospective-periodic` (main)
  - `retrospective`, includes `retrospective`

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
| `plan_id` | pattern | `{workflow}-{phase}-plan` | The plan type's id pattern. WingFoil's workflow start fills a started plan's workflow and phase only from the tokens the id pattern or the path declares; a pattern without {workflow} and {phase} leaves them to be filled by hand |
| `plan_path` | path | `docs/plans/{id}.md` | The plan type's path; only letters, digits and . _ / { } - |
| `project_name` | string | required | The project's name: dna.yaml project.name |
| `retrospective_path` | path | `docs/retrospectives/` | Where the retrospective's friction inventory goes: a directory, ending with /, by default (weak evidence: any file in it); a project may set a fixed file, with no trailing /. Only letters, digits and . _ / { } -, and no {...} token, since no element is in scope |
| `task_path` | path | `docs/memory/task/{id}.md` | The task type's path; only letters, digits and . _ / { } - |
<!-- generated:end parameters -->

## Examples

### core-records

Fixture: tests/fixtures/examples/base/core-records/

Harbour Choir, a fictional amateur choir, has no software life cycle: it keeps its decisions, its
tasks and its plans. It composes `base` alone and sets only its name, its director as the approver
and its assistant agent; the paths and ids keep their defaults (`docs/memory/<type>/`,
`docs/plans/`, `{workflow}-{phase}-plan`). When the choir decides to rehearse on Sundays, its
assistant runs `decision-log-ingest`: it captures a decision-log, and the director approves it.

### release-folders

Fixture: tests/fixtures/examples/base/release-folders/

Seabird Maps, a fictional mapping tool, composes `base` alone with its own path values: its tasks in
a folder per release (`docs/04_memory/{release}/`), its plans in a folder per scope
(`docs/05_plans/{scope}/`), its decision-logs under `docs/04_memory/design/dls/` and its
retrospective inventories under `docs/09_retrospectives/`. It keeps the default plan ids,
`{workflow}-{phase}-plan`, stated in its example as its own value. Its records land where its tools
already look, and no file moves. This example shows `base`'s parameters alone: a task's `release` is
given when the task is added, nothing in `base` fills it. When the team changes who may approve, it
runs `governance-evolution`: the assessment in the run's plan, a decision-log proposing the change,
the approver's ruling, then the change applied.

### release-folders-lean

Fixture: tests/fixtures/examples/base/release-folders-lean/

Lantern Notes, a fictional note-taking app, composes `base` alone and files its records by release
as Seabird Maps does, but keeps no retrospective folder of its own: `retrospective_path` keeps its
default. Its records stay where they are and no file moves. When it decides to drop a platform, it
runs `decision-log-ingest`: a decision-log under `docs/04_memory/design/dls/`, which the approver
rules.

## Sources and adaptations

- WingFoil 0.3.0's own configuration: the state names and gates of `decision-log`, `task` and
  `plan`, and the `waiting` edge that closes a plan. `base` keeps `waiting` only where WingFoil
  0.3.0 drives the edge for every project, so `task` moves with `submit` and `approve`.
- WingFoil's `retrospective`: its phases, without `collect-feedback`, which reads registered
  consumer inboxes, and without its `release` element; the approval selects the retrospective's
  decision-log by a tag. The selection is not bound to an iteration: under a methodology that
  includes `retrospective` in an iterated sub (a Sprint), a closed iteration's `approve` step is
  listed again while a later iteration's retrospective decision-log is `in-discussion`, and
  `pending approvals` counts that one decision-log once per step; one approval clears both, and
  nothing is reported `late`. A `retrospective-periodic` decision-log `in-discussion` has the same
  effect.
- wingfoil-templates' own `retrospective-periodic`: a thin main that starts the retrospective in a
  composition without a delivery workflow.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-base)
