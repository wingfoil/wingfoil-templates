---
id: pack-foundation-software
type: pack
title: "Software"
status: draft
axis: "foundation"
name: "software"
slot: ""
pack_path: "packs/software"
requires: ["base@^1"]
conflicts: []
---

## Purpose

`software` is the software foundation layer (dl-022 S3): the Memory types, workflows and directive
that software projects share and other governed projects do not use, above all the life cycle
`sw-life-cycle` with its slots and their defaults. It is composed right after `base`, outside the
axes; it requires `base@^1` only. Every phase pack requires it, and so does every pack that uses
its types, workflows, directives or parameters outside a conditional part (spec-001 §3, §6.3,
§6.5). A composition with `software` holds exactly one methodology, which fills `delivery`
(spec-001 §3, §9). Its catalog pack id is `software`, its directory `packs/software`, with no
`axis` in `pack.yaml` or `catalog.yaml` (spec-001 §4). This charter rules, for `software`, dl-022
S3 and dl-015's points C1 (adr, tech-spec), C2, C5, C6 and C10 (adr, tech-spec, bug, release,
release-line); plan-041 holds the approver's rulings it applies (R-1 … R-14) and WingFoil's
requests R1–R4.

## Ships

**Memory types** (`fragments/memory.yaml`; WingFoil's state names and gates, dl-015 C1, C2;
`waiting` only where WingFoil 0.3.0 drives the edge for every adopter, R-1).

| Type | Machine | Gates | `waiting` | `returns` | Id pattern | Path (parameter, default) |
|---|---|---|---|---|---|---|
| `adr` | `[draft, pending, accepted, superseded]` | `pending` → `draft` | `[accepted]` (`supersedes:`) | — | `adr-{n}-{slug}` | `adr_path`, `docs/memory/adr/{id}.md` |
| `tech-spec` | `[draft, pending, approved, superseded]` | `pending` → `draft` | `[approved]` (`supersedes:`) | — | `spec-{n}-{slug}` | `tech_spec_path`, `docs/memory/tech-spec/{id}.md` |
| `bug` | `[draft, open, triaged, planned, in-progress, in-review, resolved, closed]` | `open`, `triaged`, `planned` → `closed`; `in-review`, `resolved` → `in-progress` | — | `in-progress` → `planned` | `bug-{n}-{slug}` | `bug_path`, `docs/memory/bug/{id}.md` |
| `release-line` | `[draft, planning, active, done]` | `planning` → `draft` | — | — | `release_line_id`, default `rl-{version}` | `release_line_path`, `docs/memory/release-line/{id}.md` |
| `release` | `[draft, planning, in-development, releasing, released]` | — | — | — | `release_id`, default `rel-{version}` | `release_path`, `docs/memory/release/{release-line}/{id}.md` |

- **The cost of R-1 on `bug`.** With no `waiting`, `triaged → planned` and `planned → in-progress`,
  and a resume after `memory park`, are `approve` edges that only the human approver takes (the
  agent has no approval authority). spec-001 O15 is the way back for a methodology that ships the
  driving workflows.
- **`release`** moves by `submit` only (it has no gate in WingFoil either); the approval of a
  release is the `approve-release` phase's. Its required frontmatter is `title`, `version` and
  `release-line`; a project adds its own fields (WingFoil's `kind`, `pillar`, …) by tightening
  (spec-001 §7.5).
- **Tokens and ids** (dl-015 C6, R-3): `{release-line}` is the release's field of that name (a
  version such as `v1`), `{version}` the element's version, as WingFoil defines them; dl-015's
  `{line}` is dropped. WingFoil sets `release_id` to `{kind}-{version}` and its release folder to
  `rl-{release-line}`, which repeats the `rl-` prefix of the release-line id's default; UI uses
  `{release-line}` alone.
- `amendable: true` on `adr`, `tech-spec`, `bug` and `release`, `false` on `release-line`, as
  WingFoil. Memory templates: `adr`, `tech-spec`, `bug`, `release`, `release-line`, each declaring
  `format: 1`, at the format-1 path `memory/templates/built-in/<type>.md` (spec-001 §7.6, O13).

**Workflows** (`workflows/`). Each phase whose artefact is a file declares it in `produces` (R4),
`{ type, path }` with a `memory.add(type: T)` in the same phase for a Memory element.

| Workflow | Kind | Phases (role) |
|---|---|---|
| `sw-life-cycle` | main | `inception` (includes `inception`) → `specification` (includes `specification`) → `delivery` (includes `delivery`) → `end-of-life` (includes `end-of-life`) |
| `inception` (slot default) | sub | `frame` (product-owner: the project's purpose and scope; produces `{{inception_path}}`) → `approve` (approver) |
| `specification` (slot default) | sub | `specify` (architect: a tech-spec, add, submit; produces it) → `approve` (approver: `memory.approve`, fallback `specify`) |
| `release` (slot default) | sub | `submit` (includes `release-submit`) → `publishing` (includes `release-publishing`) |
| `release-submit` | sub, `element: release` | `pre-release-checks` (qa) → `enter-releasing` (tech-lead: `submit`, `in-development → releasing`) → `approve-release` (approver: approval, fallback `pre-release-checks`) |
| `release-publishing` | sub, `element: release` | `release-commit` (tech-lead) → `staging-rehearsal` (qa: rehearse the publication without making it public) → `tag` (tech-lead) → `publish` (tech-lead, approval by the approver) → `mark-released` (tech-lead: `submit`, `releasing → released`) |
| `end-of-life` (slot default) | sub | `announce` (product-owner, approval by the approver) → `deprecate` (tech-lead: `memory.deprecate` of the selected releases) → `archive` (tech-lead) |
| `adr-ingest` | main | `capture` (architect: add, submit; produces the adr) → `approve` (approver: `memory.approve`, fallback `capture`) |
| `bug-ingest` | main | `capture` (developer: add, submit `draft → open`; produces the bug) → `triage` (tech-lead, approval by the approver: `approve` `open → triaged`; a reject closes it) |

- **The `release` contract** (R-2, R3, dl-015 C5). The slot `release` is thin: it includes
  `release-submit` and `release-publishing`, which carry WingFoil's eight phase names. Both are
  owned by `software` only (spec-001 §7.6), reusable by a phase pack's `release`, and composed
  even when a phase pack's `release` does not include them. Neither names a branch: where to tag
  (WingFoil's integration branch, `main` for a minor or `release/X.Y` for a patch) is the
  project's.
- **The `delivery` contract** (R2, R-11). `delivery` is the methodology's (spec-001 §9): its name,
  `kind: sub`, and `release` and `retrospective` (`base`'s) included by name at its own cadence. A
  methodology that does not require `software` ships it in its conditional part, one that does in
  `contents` (spec-001 §6.5).
- **WingFoil's loop** (R2, R-11). WingFoil's `sw-life-cycle` is inception → specification → `init`
  → `seed-first-release-line` → `release-line-cycle` (→ `release-cycle`) → `sunset`. Mapped: its
  `inception` and `specification` are the slots, filled by its own phase workflows; `init`,
  `seed-first-release-line` and the two-level loop are its `delivery`, filled by its `custom/`
  workflows while it adopts by hand, outside the composer's contract, until a methodology
  modelled on the loop exists (weighed in M3); `sunset` maps to `end-of-life`.

**Mapping for WingFoil's adoption** (R3; old → new step keys, WingFoil dl-187):

| WingFoil today | `software` |
|---|---|
| `release-submit.{pre-release-checks, enter-releasing, approve-release}` | unchanged |
| `release-publishing.{release-commit, staging-rehearsal, tag, publish, mark-released}` | unchanged |
| `release-cycle.submit` → `release-submit`; `release-cycle.publishing` → `release-publishing` | `release.submit`, `release.publishing` (WingFoil's `release-cycle` stays its `delivery`'s) |
| `sw-life-cycle.sunset` | `sw-life-cycle.end-of-life` |
| `sw-life-cycle.{init, seed-first-release-line, release-line-cycle}` | inside its `delivery` |
| `adr-ingest.{capture, approve}`, `bug-ingest.{capture, triage}` | unchanged |

R-1 also changes WingFoil's verbs on unchanged states: `bug`'s `triaged`/`planned` and the
`release` and `release-line` states lose their `waiting`, so their edges move by `approve` or
`submit`. No element moves: its states and ids are unchanged (R1).

**Directive:** `determinism` (`directives/`), assigned to `developer` and `reviewer`.

**Roles and DNA** (`fragments/roles.yaml`, `fragments/dna.yaml`): `team.roles` adds `architect`,
`developer`, `reviewer`, `qa` and `tech-lead`; `base`'s agent (`{{agent_name}}`) adds
`executes_as: [developer, reviewer, qa, architect]`. No member, no email.

**Parameters** (spec-001 §8; the defaults are the convention for new projects, R1):

| Name | Type | Default | Use |
|---|---|---|---|
| `adr_path` | path | `docs/memory/adr/{id}.md` | `adr` `path` |
| `tech_spec_path` | path | `docs/memory/tech-spec/{id}.md` | `tech-spec` `path` |
| `bug_path` | path | `docs/memory/bug/{id}.md` | `bug` `path` |
| `release_line_path` | path | `docs/memory/release-line/{id}.md` | `release-line` `path` |
| `release_path` | path | `docs/memory/release/{release-line}/{id}.md` | `release` `path` |
| `release_line_id` | pattern | `rl-{version}` | `release-line` `id_pattern` |
| `release_id` | pattern | `rel-{version}` | `release` `id_pattern` |
| `inception_path` | path | `docs/inception.md` | `inception` › `frame`'s `produces` |

**AGENTS.md section:** a level-2 section on the life cycle, the slots and the release, naming
`delivery` as the methodology's; no markers (spec-001 §10).

## Commitments to adopters

As `base`'s, agreed with WingFoil (plan-041, R1), binding on every version of `software`:
defaults are the convention for new projects; existing adopters set their current values and move
nothing; ids are immutable, a new id pattern applying to new elements only; Memory types, state
names, workflow names and phase names are fixed, and a version that renames or restructures any of
them ships an old → new key mapping (WingFoil dl-187) and is a major (`pack-semver`).

## Out of scope

- Everything of `base` (dl-022 S2).
- A methodology and its `delivery`; Kanban's or Scrum's rules; `limits` (dl-022 S5).
- A methodology modelled on WingFoil's release-line loop (M3, R-11).
- Branch and registry conventions of a release (WingFoil's integration branch, npm staging).
- WingFoil's `service` and `change-proposal` types, its `release-health`, `user-docs` and
  `e2e-smoke` phases: WingFoil's own.

## Compatibility

- `formats`: `dna: 1`, `roles: 1`, `memory: 1`, `workflow: 1`, `directive: 1`,
  `memory-template: 1`. `requires: [base@^1]`. `requires_capabilities`: none expected; the intake
  of WingFoil 0.3.0 decides (dl-021 R4, O3).
- The oldest release of its matrix is WingFoil 0.3.0 (`returns`, `amendable`, `supersedes:` with
  `waiting`); no workflow uses a key newer than 0.3.0. The range is computed, never written here.
- Install mapping and lock: the format-1 `built-in/` mapping, provisional (O12, O13). WingFoil
  0.3.0's `init` writes a `custom/` `determinism` directive, which wins over `software`'s: an
  adopter removes the stub.

## Acceptance

- spec-002's CB-1 and CB-2 (with its exemption while the tree holds no methodology); CB-6's live
  part at `base`'s first tag.
- **Exit criterion** (dl-022 S6): `software` composes and validates with the parameters of the four
  governed software repositories, through a methodology that exists only as a test fixture on the
  model of the golden tree's `methodology/flow`, never published (R-12; `software` cannot be
  composed without a methodology, spec-001 §3).

## Open points

For the approver's acceptance:
1. **The `inception` and `specification` defaults' phases** (`frame`/`approve`, `specify`/`approve`):
   minimal, naming no method (dl-003 D11); their names become fixed with the first version (R1).
2. **`inception_path`**, a parameter for the one document the default `inception` produces.
3. **`release`'s required frontmatter** (`title`, `version`, `release-line`): the minimum WingFoil,
   UI and Benchmark share; Benchmark's releases have no `release-line` field today.

## Execution Notes
