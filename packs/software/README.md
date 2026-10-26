<!-- generated:begin title -->
# Software

The software foundation layer: the Memory types, workflows and directive that software projects share and other governed projects do not use, above all the life cycle sw-life-cycle with its slots and their defaults.

Axis: foundation
<!-- generated:end title -->

## When to use it

Every software project governed by WingFoil composes `software` right after `base`, with one
methodology: it holds the adr, tech-spec, bug, release and release-line types, the life cycle
`sw-life-cycle` with its slots and their defaults (`inception`, `specification`, `release`,
`end-of-life`), the release workflows `release-submit` and `release-publishing`, the workflows
that capture an architecture decision (`adr-ingest`) and a bug (`bug-ingest`), the
`determinism` directive and the software roles (architect, developer, reviewer, qa, tech-lead).
The methodology fills `delivery`, which creates the releases and runs the `release` slot over
them. It serves every adoption profile of a software project (solo developer, code reviewer, team
developer, tech lead, non-technical manager, architect), since every software composition contains
it. A project that is not software, such as a choir or a book, takes `base` alone. Every phase
pack requires `software`.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block][install] of the catalog.

[install]: https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install

Until WingFoil installs packs, a project adopts `software` by hand, together with `base` and a
methodology, with a WingFoil release in the pack's range (see its catalog entry):

1. For a project that is already governed, compare its Memory types, states, workflows and phases
   with `software`'s (section "What it adds").
2. Compose `software` with `base` and a methodology with the reference composer of
   wingfoil-templates, giving `base`'s four required parameters and, for a project that is
   already governed, its current values of the path and id parameters, so that no file moves.
3. Copy the composed `.wingfoil/` files into the project's `.wingfoil/`, keeping its `custom/`
   folders, then re-add to `dna.yaml`, `memory.yaml`, `roles.yaml` and `workflows.yaml` the
   project's own entries; copy the generated AGENTS.md region into its `AGENTS.md`.
4. Remove the `determinism` directive WingFoil 0.3.0's `init` wrote under `directives/custom/`: a
   `custom/` file wins over the pack's.
5. Migrate by explicit commits the elements whose state has another name in `software` (for
   example a `bug` on the default machine: `pending` → `open`, `approved` → `planned`).
6. Record an old → new key mapping for the workflows and phases the project renames: a slot's
   filler carries the slot's name (an inception workflow becomes `inception`), and the phases of
   `release-submit` and `release-publishing` keep their names.
7. Record the adopted version of `software` in the project's own Memory.

<!-- generated:begin composition -->
## Composition

- **Requires:** `base@^1`
- **Conflicts:** none
- **Formats:** `directive` 1, `dna` 1, `memory` 1, `memory-template` 1, `roles` 1, `workflow` 1
- **Requires capabilities:** `workflow-engine`
- **Declares:**
  - Memory types: `adr`, `bug`, `release`, `release-line`, `tech-spec`
  - roles: `architect`, `developer`, `qa`, `reviewer`, `tech-lead`
  - states: `accepted`, `active`, `approved`, `closed`, `done`, `draft`, `in-development`, `in-progress`, `in-review`, `open`, `pending`, `planned`, `planning`, `released`, `releasing`, `resolved`, `superseded`, `triaged`
  - workflows: `adr-ingest`, `bug-ingest`, `end-of-life`, `inception`, `release`, `release-publishing`, `release-submit`, `specification`, `sw-life-cycle`
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

- `adr-ingest` (main)
  - `capture`, role `architect`
  - `approve`, role `approver`, gate `approver`
- `bug-ingest` (main)
  - `capture`, role `developer`
  - `triage`, role `tech-lead`, gate `approver`
- `end-of-life` (sub)
  - `announce`, role `product-owner`
  - `approve`, role `approver`, gate `approver`
  - `deprecate`, role `tech-lead`
  - `archive`, role `tech-lead`
- `inception` (sub)
  - `frame`, role `product-owner`
  - `approve`, role `approver`, gate `approver`
- `release` (sub)
  - `submit`, includes `release-submit`
  - `publishing`, includes `release-publishing`
- `release-publishing` (sub)
  - `release-commit`, role `tech-lead`
  - `staging-rehearsal`, role `qa`
  - `tag`, role `tech-lead`
  - `publish`, role `tech-lead`, gate `approver`
  - `mark-released`, role `tech-lead`
- `release-submit` (sub)
  - `pre-release-checks`, role `qa`
  - `enter-releasing`, role `tech-lead`
  - `approve-release`, role `approver`, gate `approver`
- `specification` (sub)
  - `specify`, role `architect`
  - `approve`, role `approver`, gate `approver`
- `sw-life-cycle` (main)
  - `inception`, includes `inception`
  - `specification`, includes `specification`
  - `delivery`, includes `delivery`
  - `end-of-life`, includes `end-of-life`

### Memory types

- `adr`: `draft` → `pending` → `accepted` → `superseded`; gates `pending` (reject → `draft`)
- `bug`: `draft` → `open` → `triaged` → `planned` → `in-progress` → `in-review` → `resolved` → `closed`; gates `in-review` (reject → `in-progress`), `open` (reject → `closed`), `planned` (reject → `closed`), `resolved` (reject → `in-progress`), `triaged` (reject → `closed`)
- `release`: `draft` → `planning` → `in-development` → `releasing` → `released`
- `release-line`: `draft` → `planning` → `active` → `done`; gates `planning` (reject → `draft`)
- `tech-spec`: `draft` → `pending` → `approved` → `superseded`; gates `pending` (reject → `draft`)

### Directives

- `determinism`: `architect`, `developer`, `reviewer`

### Fragments

- `dna`
- `roles`

### Memory templates

- `adr`
- `bug`
- `release`
- `release-line`
- `tech-spec`
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `adr_path` | path | `docs/memory/adr/{id}.md` | The adr type's path; only letters, digits and . _ / { } - |
| `bug_path` | path | `docs/memory/bug/{id}.md` | The bug type's path; only letters, digits and . _ / { } - |
| `inception_path` | path | `docs/inception.md` | The document the default inception produces: the project's purpose and scope; only letters, digits and . _ / { } - |
| `release_id` | pattern | `rel-{version}` | The release type's id pattern, {version} being the element's version |
| `release_line_id` | pattern | `rl-{version}` | The release-line type's id pattern, {version} being the element's version |
| `release_line_path` | path | `docs/memory/release-line/{id}.md` | The release-line type's path; only letters, digits and . _ / { } - |
| `release_path` | path | `docs/memory/release/{release-line}/{id}.md` | The release type's path, {release-line} being the release's field of that name; only letters, digits and . _ / { } - |
| `tech_spec_path` | path | `docs/memory/tech-spec/{id}.md` | The tech-spec type's path; only letters, digits and . _ / { } - |
<!-- generated:end parameters -->

## Examples

None yet: no methodology pack is published.

## Sources and adaptations

- WingFoil's own configuration, as of 0.3.0: the state names and gates of `adr`, `tech-spec`, `bug`,
  `release` and `release-line`. `software` keeps `waiting` only where WingFoil 0.3.0 drives the
  edge for every project (`supersedes:`), so `bug` moves with `submit` and `approve`.
- WingFoil's `release-submit` and `release-publishing`, as of 0.3.0: their eight phase names and
  their order; the phases whose work is the project's own (checks, commit, rehearsal, tag) run as
  agent work, and a project that runs its own commands there gives those phases its own tokens and
  binds them in its `workflows/bindings.yaml`.
- WingFoil's `end-of-life`, as of 0.3.0: its three phases, with an `approve` phase after
  `announce` that moves the decision-log to `ready`, as `base`'s `decision-log-ingest` does; its
  software life cycle's `sunset` is `end-of-life` here.
- WingFoil's `adr-ingest` and `bug-ingest`, as of 0.3.0: their phases and step keys, unchanged.
- wingfoil-templates' own `inception` and `specification` defaults: minimal, naming no method,
  for a phase pack to replace.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry](https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-software)
