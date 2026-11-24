<!-- generated:begin title -->
# WingFoil dogfood

The channel back to WingFoil for any project that uses it: a feedback item routed to upstream:wingfoil becomes a note in WingFoil's format in the project's inbox, and the rules of running the project's pinned WingFoil CLI and keeping its known behaviours.

Axis: governance
<!-- generated:end title -->

## When to use it

A project that uses WingFoil, software or not, and wants what it finds about WingFoil to reach
WingFoil composes `governance/wingfoil-dogfood` with `base` and `governance/feedback`: a feedback
item whose target is `upstream:wingfoil` and whose outcome is `upstream-note` becomes a note in
WingFoil's format in the project's inbox, which WingFoil reads and answers. Its `wingfoil-cli`
directive holds the rules of running the project's pinned WingFoil CLI, of keeping the known
behaviours of that WingFoil, and of syncing the inbox with WingFoil's answers; its
`wingfoil-channel` directive is the channel `governance/feedback` looks up for the target. It adds
no workflow, no Memory type and no methodology, and serves a solo maintainer with an agent as well
as a team. A project that sends nothing back to WingFoil, or reports to WingFoil another way, does
not need it.

## Install and update

> **Temporary:** these hand steps are replaced by WingFoil's commands once a release provides them.

See the [Install block][install] of the catalog.

[install]: https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#install

Until WingFoil installs packs, a project adopts `governance/wingfoil-dogfood` by hand, together
with `base` and `governance/feedback` (and `software` and a methodology, if it has them), with a
WingFoil release in the pack's range (see its catalog entry):

1. A project that keeps a `wingfoil-cli` directive of its own removes it in the same change, or
   gives it another id: a composition holds one directive per id.
2. Compose the pack with `base` and `governance/feedback` with the reference composer of
   wingfoil-templates, giving `base`'s four required parameters, `upstream:wingfoil` added to
   `feedback_targets`, and the command that runs the project's pinned WingFoil CLI as
   `wingfoil_command`, its trailing `--` included; a project that keeps its notes or its known
   behaviours elsewhere gives their paths, so that no file moves.
3. Copy the composed `.wingfoil/` files into the project's `.wingfoil/`, keeping its `custom/`
   folders, then re-add the project's own entries: only what the project wrote itself, never the
   Memory types, roles or workflows WingFoil's `init` scaffolded; copy the generated AGENTS.md
   region into its `AGENTS.md`.
4. Create the inbox's `README.md` in the folder `wingfoil_inbox_path` names, with:
   - a title and a line saying the folder holds the project's notes to WingFoil, which WingFoil
     reads and answers in its own repository;
   - a `## Rules` section: one file per note, `F-<nnn>-<slug>.md`, never deleted and never
     renumbered, in WingFoil's note format; how notes are written, when the sync runs and what
     WingFoil cites are the rules of the pack's `wingfoil-cli` directive;
   - the line `**Source key:**`, empty until WingFoil registers the project as a feedback source;
     then the `svc-NNN` id WingFoil assigns is written after the label;
   - the line `**Last sync:**`, with the date and what the sync read, or `none.`;
   - a `## Ledger` section holding a table with the columns Note, Title, Kind, Status and Answered
     by, one row per note;
   - a `## Context` section saying what the project is and which WingFoil it pins.
5. Create the file `wingfoil_known_behaviours_path` names, outside the inbox, with the line
   *Checked against:* naming the pinned WingFoil and the empty table the `wingfoil-cli` directive
   describes.
6. Record the adopted version of `governance/wingfoil-dogfood` in the project's own Memory.

<!-- generated:begin composition -->
## Composition

- **Requires:** `base@^2`, `governance/feedback@^1`
- **Conflicts:** none
- **Formats:** `directive` 1, `roles` 1
- **Requires capabilities:** none
- **Declares:**
  - Memory types: none
  - roles: none
  - states: none
  - workflows: none
<!-- generated:end composition -->

<!-- generated:begin what-it-adds -->
## What it adds

### Workflows

None.

### Memory types

None.

### Directives

- `wingfoil-channel`: `facilitator`
- `wingfoil-cli`: global

### Fragments

- `roles`

### Memory templates

None.
<!-- generated:end what-it-adds -->

<!-- generated:begin parameters -->
## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `wingfoil_command` | string | required | The command that runs the project's pinned WingFoil CLI, its trailing -- included |
| `wingfoil_inbox_path` | path | `docs/wingfoil-feedback` | The folder of the project's notes to WingFoil and of the inbox's README.md |
| `wingfoil_known_behaviours_path` | path | `docs/wingfoil-known-behaviours.md` | The file of the project's known behaviours of its pinned WingFoil, outside the inbox |
<!-- generated:end parameters -->

## Examples

### defaults

Fixture: tests/fixtures/examples/wingfoil-dogfood/defaults/

Shearwater Docs, a fictional documentation site, composes `base`, `governance/feedback` and the
pack on every default path, with no methodology and no `software`, and adds `upstream:wingfoil` to
`feedback_targets`. A writer finds that a WingFoil command refuses a flag its help lists; the item
is captured as a `defect` on `upstream:wingfoil` with the outcome `upstream-note`, the approver
triages it, and `feedback-review` routes it through `wingfoil-channel`: the note
`docs/wingfoil-feedback/F-001-<slug>.md` cites the item, its row joins the inbox's ledger, and the
item is closed with `resulting` naming the note.

### with-software

Fixture: tests/fixtures/examples/wingfoil-dogfood/with-software/

Fulmar Tickets, a fictional ticketing service flowing its work with Kanban, composes `software`,
`methodology/kanban`, `governance/feedback` and the pack, and keeps its notes to WingFoil in
`docs/upstream/wingfoil` and its known behaviours in `docs/upstream/wingfoil-known-behaviours.md`.
A gap found while running the pinned CLI gets an entry in the known behaviours and an
`observation` item on `upstream:wingfoil`; the channel writes its note as a `request`, in
`docs/upstream/wingfoil/`.

## Sources and adaptations

- WingFoil-Templates' dl-012 D3 (the channel back to WingFoil and the CLI rules as a pack) and
  dl-051 (its request, ruled through `pack-ingest`), and spec-003 §5 (the upstream channels).
- The rules come from wingfoil-templates' own `wingfoil-cli` directive (1.6), generalised only by
  their parameters, by the references to the entries file and by "the project" for "this
  repository".
- Adaptations:
  - the known behaviours are the project's, not the pack's: each project pins its own WingFoil;
  - the inbox skeleton is install text, since a pack ships no file outside `.wingfoil/`;
  - the source key is read from the inbox's **Source key** line, not from a parameter, so that the
    key has one source and the rule reads whole before WingFoil registers the project.

## Versions

- [Changelog](CHANGELOG.md)
- [Catalog entry][catalog-entry]

[catalog-entry]: https://github.com/wingfoil/wingfoil-templates/blob/main/CATALOG.md#pack-governance-wingfoil-dogfood
