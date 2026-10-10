# Inputs for regenerating the base pack

> **Branch note (2026-10-05).** This note was written on a first attempt that skipped phases of
> this repository's own `sw-life-cycle`. That attempt is kept on the branch
> `archive/draft-2026-10-05`, and `main` restarts from the WingFoil configuration commit
> (`539e943`). The ids cited below exist only on that branch, as unapproved drafts:
> `dl-001`, `dl-002`, `dl-003`, `spec-001`, `pack-*`, `task-001`, `prel-001`. So do
> `catalog.yaml`, `compat.yaml`, `schema/` and `packs/`. On `main` they are recreated through the
> workflows, and their ids may differ.

**Status:** working note, not Memory. Read it when `packs/base` is regenerated. That happens after
WingFoil2 v0.3 finishes its format changes, expected around the end of wave 3. Roberto's decision
of 2026-10-05: `base` 0.1.0 is **not** published as it is, and the repository is frozen until he
reviews its history. This note changes no element state. Once the regeneration has applied an
input, record it in the regenerated version's `pack-release` and delete it from here.

## 1. Every file declares `format:` (WingFoil dl-149)

Requested by Roberto, 2026-10-05. Checked in the WingFoil2 repository: `dl-149` is `ready`;
`task-251-add-the-format-key-to-the-config-workflow-directive-and-template-schemas-…` is `done`
(v0.3).

- Every fragment, workflow, directive and Memory template of `base` carries the `format:` key from
  the start.
- The rule (dl-149):
  - each file kind has its own counter, separate from `version:`, which stays the content revision;
  - an absent key reads as `format: 1`;
  - the counter goes up only on a backward-incompatible change.
- Where the key goes:
  - at the top of `dna.yaml`, `memory.yaml`, `roles.yaml`, `workflows.yaml` and every workflow
    file;
  - in the frontmatter of directives and Memory templates;
  - adapter manifests under `.wingfoil/agents/` already carry it (task-177).
- Open in WingFoil2, to re-check when regenerating:
  - `workflows/bindings.yaml` is not one of dl-149's kinds and has no `format` key (task-251,
    "Layer 3").
  - `memory add` copies `format: 1` from the template into the elements. This is decision 4 of
    task-251, which awaits Roberto's ruling.
- Not decided by dl-149: whether this repository's own files (`pack.yaml`, `catalog.yaml`,
    presets, transitions) follow the same rule. That is for spec-001 of WingFoil-Templates; the
    likely answer is yes.
- Consequences here:
  - `pack.yaml` `formats` gets real values, the format each kind has after v0.3;
  - `compat.yaml` gains the v0.3 release, with the formats it reads;
  - the provisional note in `compat.yaml` ("WingFoil has no format-version key yet") goes.

## 2. Inputs from the base 0.1.0 review (2026-10-05)

From the evaluation sent to the session "Stato progetti wingfoil" and from the conformance check of
this repository's history.

- **Per-type path parameters**, each with a default:
  - WingFoil2 and UI use a path per type: `design/adrs`, `design/dls`, `design/specs` and `bugs`
    under `docs/04_memory`, and tasks under `{release}`.
  - Plans live under `docs/05_plans/{scope}/`, with id `{workflow}-{phase}-plan`.
  - The single `{{memory_root}}/<type>/` of 0.1.0 does not cover them.
- **`{release}` and `{scope}` tokens:** accepted as values of the path and id parameters. The
  project provides them.
- **`paths.governance`:** in 0.1.0, governance means Memory and plans, and config means `.wingfoil`.
  WingFoil2 and UI declare `governance: ['.wingfoil/']`. Check what reads it before fixing one
  meaning.
- **Name clash `service`:** WingFoil2 and UI use `service` for external accounts and services
  (WingFoil dl-088). The `blueprint/web-service` type must take another name.
- **Bug state `fixed`:** Benchmark implemented it (task-058). It is not absorbed, so base takes it
  into account in the bug life cycle.
- **`waiting` states:** absent in 0.x. The v0.3 workflow engine decides whether the regenerated base
  can declare them (capability `workflow-engine`, dl-002) and in which version WingFoil2 adopts it.
- **Agent name and roles:** pick one `agent_name` for the four repositories. WingFoil2 and UI use
  "AI agent (Claude/Cursor/etc.)", Benchmark "Claude Code". Also align `executes_as`.
- **AGENTS.md markers:** realign to the dl-137 part-(b) tech-spec, or to WingFoil2's `AGENTS.md`
  if it lands first (notes T14).

## 3. Process for the regeneration

This follows the conformance check of the repository's history: the first base skipped
specification, plans and task acceptance.

1. A `plan` for the specification phase, then `spec-001`, written against the final v0.3 formats
   and approved before any pack content.
2. Charter `pack-foundation-base` accepted, and a task accepted into the backlog.
3. Work on a `task/<id>` branch, reviewed by a session other than the author's, merged `--no-ff`.
4. `pack-release` with the validation evidence, then the approver's publication gate.
