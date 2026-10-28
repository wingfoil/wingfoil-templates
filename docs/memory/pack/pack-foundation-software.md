---
id: pack-foundation-software
type: pack
title: "Software"
status: active
axis: "foundation"
name: "software"
slot: ""
pack_path: "packs/software"
requires: ["base@^2"]
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
release-line); plan-041 holds the approver's rulings it applies (R-1 … R-14, and two more given on
2026-10-20 at this charter's review, H and I below) and WingFoil's requests R1–R4.

## Ships

**Memory types** (`fragments/memory.yaml`; WingFoil's state names and gates, dl-015 C1, C2;
`waiting` only where WingFoil 0.3.0 drives the edge for every adopter, R-1).

| Type | Machine | Gates | `waiting` | `returns` | Id pattern | Path (parameter, default) | Required frontmatter |
|---|---|---|---|---|---|---|---|
| `adr` | `[draft, pending, accepted, superseded]` | `pending` → `draft` | `[accepted]` (`supersedes:`) | — | `adr-{n}-{slug}` | `adr_path`, `docs/memory/adr/{id}.md` | `title` |
| `tech-spec` | `[draft, pending, approved, superseded]` | `pending` → `draft` | `[approved]` (`supersedes:`) | — | `spec-{n}-{slug}` | `tech_spec_path`, `docs/memory/tech-spec/{id}.md` | `title` |
| `bug` | `[draft, open, triaged, planned, in-progress, in-review, resolved, closed]` | `open`, `triaged`, `planned` → `closed`; `in-review`, `resolved` → `in-progress` | — | `in-progress` → `planned` | `bug-{n}-{slug}` | `bug_path`, `docs/memory/bug/{id}.md` | `title` |
| `release-line` | `[draft, planning, active, done]` | `planning` → `draft` | — | — | `release_line_id`, default `rl-{version}` | `release_line_path`, `docs/memory/release-line/{id}.md` | `title`, `version` |
| `release` | `[draft, planning, in-development, releasing, released]` | — | — | — | `release_id`, default `rel-{version}` | `release_path`, `docs/memory/release/{release-line}/{id}.md` | `title`, `version`, `release-line` |

- **How the edges move.** With no `waiting` (R-1), an edge moves by `submit` or by `approve` from
  a gate; a `release` edge also by a workflow action that names its target state,
  `element.set_state(<state>)` (ruling H), which WingFoil 0.3.0 records as a commit and which needs
  no `waiting`.
- **The cost of R-1 on `bug`.** `triaged → planned` and `planned → in-progress`, and a resume after
  `memory park`, are `approve` edges that only the human approver takes (the agent has no approval
  authority). spec-001 O15 is the way back for a methodology that ships the driving workflows.
- **`release`** has no gate (as in WingFoil); its approval is the `approve-release` phase's. A
  later pack, or a project's own `memory.yaml`, adds fields to the required frontmatter (WingFoil's
  `kind`, `pillar`, …; its `bug` adds `severity`, its `tech-spec` `sard_ref` and `scope`).
- **Tokens and ids** (dl-015 C6, C10, R-3): `{release-line}` is the release's field of that name (a
  version such as `v1`), `{version}` the element's version, and `{release}` a task's `release`
  field, which a project may use in `base`'s `task_path` (WingFoil and UI:
  `docs/04_memory/{release}/{id}.md`; spec-001 §8.3), as WingFoil defines them. dl-015's `{line}`
  is dropped. WingFoil sets `release_id` to `{kind}-{version}` and its release folder to
  `rl-{release-line}`, which repeats the `rl-` prefix of the release-line id's default; UI uses
  `{release-line}` alone.
- `amendable: true` on `adr`, `tech-spec`, `bug` and `release`, `false` on `release-line`, as
  WingFoil. Memory templates: `adr`, `tech-spec`, `bug`, `release`, `release-line`, each declaring
  `format: 1`, at the format-1 path `memory/templates/built-in/<type>.md` (spec-001 §7.6, O13).

**Workflows** (`workflows/`). Each phase whose artefact is a file declares it in `produces` (R4),
`{ type, path }` with a `memory.add(type: T)` in the same phase for a Memory element. A phase whose
artefact is not a file (a check, a commit, a tag) declares none and is finalized by hand. An
approval in a sub-workflow selects its element (`where`), so WingFoil 0.3.0 can bind it.

| Workflow | Kind | Phases (role) |
|---|---|---|
| `sw-life-cycle` | main | `inception` (includes `inception`) → `specification` (includes `specification`) → `delivery` (includes `delivery`) → `end-of-life` (includes `end-of-life`) |
| `inception` (slot default) | sub | `frame` (product-owner: the project's purpose and scope; produces `{{inception_path}}`) → `approve` (approver: approval, fallback `frame`) |
| `specification` (slot default) | sub | `specify` (architect: a tech-spec, add, submit; produces it) → `approve` (approver: `memory.approve` on `where: { type: tech-spec, status: [pending] }`, which selects every pending tech-spec: the approver rules the one `specify` submitted, and the step closes once none is pending; fallback `specify`) |
| `release` (slot default) | sub, `element: release` | `submit` (includes `release-submit`) → `publishing` (includes `release-publishing`) |
| `release-submit` | sub, `element: release` | `pre-release-checks` (qa) → `enter-releasing` (tech-lead: `element.set_state(releasing)`) → `approve-release` (approver: approval, fallback `pre-release-checks`) |
| `release-publishing` | sub, `element: release` | `release-commit` (tech-lead) → `staging-rehearsal` (qa: rehearse the publication without making it public) → `tag` (tech-lead) → `publish` (tech-lead, approval by the approver) → `mark-released` (tech-lead: `element.set_state(released)`) |
| `end-of-life` (slot default) | sub | `announce` (product-owner: a decision-log, add, submit; produces `{ type: decision-log, path: "{{decision_log_path}}" }`, `base`'s parameter; approval by the approver) → `deprecate` (tech-lead: `memory.deprecate` on `where: { type: release, status: [draft, planning, in-development, releasing] }`, the unreleased ones, as WingFoil) → `archive` (tech-lead) |
| `adr-ingest` | main | `capture` (architect: add, submit; produces the adr) → `approve` (approver: `memory.approve`, fallback `capture`) |
| `bug-ingest` | main | `capture` (developer: add, submit `draft → open`; produces the bug) → `triage` (tech-lead, approval by the approver: `approve` `open → triaged`; a reject closes it) |

- **The `release` contract** (R-2, R3, dl-015 C5). The slot `release` is thin and bound to
  `element: release`: WingFoil 0.3.0 refuses an include of an element-bound sub from a workflow
  that is not bound to the same element or iterating over it. It includes `release-submit` and
  `release-publishing`, which carry WingFoil's eight phase names. A phase pack's `release` that
  reuses them declares `element: release` too. Both subs are owned by `software` only (spec-001
  §7.6), reusable by a phase pack's `release`, and composed even when a phase pack's `release` does
  not include them. `pre-release-checks`, `staging-rehearsal`, `release-commit`, `tag` and `publish`
  produce no file in the default. Neither names a branch: where to tag (WingFoil's integration
  branch, `main` for a minor or `release/X.Y` for a patch) is the project's.
- **The `delivery` contract** (R2, R-11). `delivery` is the methodology's (spec-001 §9): its name,
  `kind: sub`, no `element` (`sw-life-cycle` includes it without iterating), and `release` and
  `retrospective` (`base`'s) included by name at its own cadence, directly or through sub-workflows
  the same methodology ships, at any depth, each in the same part as `delivery` (dl-026); the phase
  that includes `release` iterates over `release` with a `where` whose `status` is
  `[in-development, releasing]`, scope keys allowed, each a field of the composed `release`
  (dl-027), and the methodology creates its releases and moves them to `in-development`, which no
  `software` workflow does. A methodology that does not require `software` ships `delivery` in its
  conditional part, one that does in `contents` (spec-001 §6.5).
- **WingFoil's loop** (R2, R-11). WingFoil's `sw-life-cycle` is inception → specification → `init`
  → `seed-first-release-line` → `release-line-cycle` (→ `release-cycle`) → `sunset`. Its
  `inception` and `specification` are the slots, filled by its own phase workflows renamed after
  the slots (spec-001 §9); `init`, `seed-first-release-line` and the two-level loop are its
  `delivery`, filled by its `custom/` workflows while it adopts by hand, outside the composer's
  contract, until a methodology modelled on the loop exists (weighed in M3); `sunset` maps to
  `end-of-life`.

**Directive:** `determinism` (`directives/`), assigned to `developer`, `reviewer` and `architect`.

**Roles and DNA** (`fragments/roles.yaml`, `fragments/dna.yaml`): `team.roles` adds `architect`,
`developer`, `reviewer`, `qa` and `tech-lead`, with their descriptions; `base`'s agent
(`{{agent_name}}`) adds `executes_as: [developer, reviewer, qa, architect]`, with
`approval_authority: false` (spec-001 §7.3). No member, no email.

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
`delivery` as the methodology's; no markers in the section, the composer's region using WingFoil
task-252's provisional markers (spec-001 §10, R-10).

## Commitments to adopters

As `base`'s, agreed with WingFoil (plan-041, R1), binding on every version of `software`: the
parameters' defaults are the convention for new projects; existing adopters set their current
parameter values (paths and ids) and move no file; ids are immutable, a new id pattern applying to
new elements only; Memory types, state names, workflow names and phase names are fixed, and a
version that renames or restructures any of them ships an old → new key mapping (WingFoil dl-187)
and is a major (`pack-semver`).

## Adoption

**Any project.** A new project, or one with no WingFoil configuration of its own, adopts
`software` with `base` and a methodology, on the parameters' defaults: nothing to map. A project
that already has its own configuration follows the same procedure, whoever it is: it sets the
parameters to its current values, so no file moves; it compares its types, states, workflows and
phases with the packs'; it migrates by explicit commits the elements whose state has another
name; and it records an old → new key mapping for its renamed workflows and phases. The packs'
READMEs give the procedure (F6.1, spec-002 §2.3).

**The known adopters**, as applications of it:

| Project | What changes |
|---|---|
| WingFoil | the step keys below; its verbs on unchanged states (`bug`'s `triaged`/`planned`, the `release` and `release-line` states lose their `waiting`; `base`'s `task` too) |
| UI | as WingFoil; its `release-commit` moves from `release-submit` to `release-publishing`, and it gains `staging-rehearsal` (a new step key) |
| Benchmark | its `bug` `[draft, pending, approved, fixed]` migrates to `software`'s: `draft → draft`, `pending → open`, `approved → planned`, `fixed → resolved` (ruling I, dl-015 C2; `closed` if Benchmark reads "fixed" as closed); its `adr` and `tech-spec` on the default machine keep `draft` and `pending` and migrate `approved → accepted` and `approved`; its `release-line` migrates `pending → planning`, `approved → active`; its releases gain a `release-line` field (open point 3) |
| this repository | its `adr` and `tech-spec` on the default machine migrate as Benchmark's; its `bug` on the default machine migrates by default as Benchmark's (`pending → open`, `approved → planned`), or to `closed` for a bug already fixed; its adoption plan (W9) decides |

**WingFoil's step keys** (R3; old → new, WingFoil dl-187):

| WingFoil today | `software` |
|---|---|
| `release-submit.{pre-release-checks, enter-releasing, approve-release}` | unchanged, actions included |
| `release-publishing.{release-commit, staging-rehearsal, tag, publish, mark-released}` | unchanged, actions included |
| `release-cycle.{submit, publishing}` | one phase of WingFoil's `release-cycle` (its name WingFoil's) including `release`, i.e. `release.submit` and `release.publishing` |
| `lean-inception.*`, `specification-downcast.*` | `inception.*`, `specification.*` (slot fillers carry the slot's name) |
| `sw-life-cycle.sunset` | `sw-life-cycle.end-of-life` |
| `sw-life-cycle.{init, seed-first-release-line, release-line-cycle}` | inside its `delivery` |
| `end-of-life.{announce, deprecate, archive}`, `adr-ingest.{capture, approve}`, `bug-ingest.{capture, triage}` | unchanged |

## Out of scope

- Everything of `base` (dl-022 S2).
- A methodology and its `delivery`; Kanban's or Scrum's rules; `limits` (dl-022 S5).
- A methodology modelled on WingFoil's release-line loop (M3, R-11).
- Branch and registry conventions of a release (WingFoil's integration branch, npm staging).
- WingFoil's `service` and `change-proposal` types, its `release-health`, `user-docs` and
  `e2e-smoke` phases: WingFoil's own.

## Compatibility

- `formats`: `dna: 1`, `roles: 1`, `memory: 1`, `workflow: 1`, `directive: 1`,
  `memory-template: 1`. `requires: [base@^1]`. `requires_capabilities: [workflow-engine]`, as
  `base` (dl-003 D3; its workflows rely on the engine: element-bound includes and
  `element.set_state`); the intake of WingFoil 0.3.0 records whether 0.3.0 provides it (dl-021
  R4, O3). Publication (W9) waits for that intake: until then the computed range is empty
  (spec-001 §12); if the intake does not record it, the approver rules again before
  `first-release`.
- The oldest release of its matrix is WingFoil 0.3.0 (`returns`, `amendable`, `supersedes:` with
  `waiting`, element-bound includes); no workflow uses a key newer than 0.3.0. The range is
  computed, never written here. A `path` parameter used in a `produces` takes only
  `[A-Za-z0-9._/{}-]` (WingFoil 0.3.0).
- Install mapping and lock: the format-1 `built-in/` mapping, provisional (O12, O13). WingFoil
  0.3.0's `init` writes a `custom/` `determinism` directive, which wins over `software`'s: an
  adopter removes the stub.

## Acceptance

- spec-002's CB-1 and CB-2 (with its exemption while the tree holds no methodology; `software`'s
  examples are due once a methodology exists, W10); CB-6's live part at `base`'s first tag.
- **Exit criterion** (dl-022 S6): `software` composes and validates on WingFoil 0.3.0 with the
  parameters of the four governed software repositories, through a methodology that exists only as
  a test fixture, never published (R-12; `software` cannot be composed without a methodology,
  spec-001 §3). The fixture tree lives under `tests/fixtures/` with `base`, `software`, that
  methodology (whose `delivery` follows the contract above) and one parameter set per repository,
  and a test composes and validates each; the matrix needs WingFoil 0.3.0 in `compat.yaml`, which
  the intake after plan-041 adds. While `packs/` holds no methodology the tree-wide lint does not
  compose `software`; the fixture test does.

## Open points

For the approver's acceptance:
1. **The `inception` and `specification` defaults' phases** (`frame`/`approve`,
   `specify`/`approve`): minimal, naming no method (dl-003 D11); their names become fixed with the
   first version (R1).
2. **`inception_path`**, a parameter for the one document the default `inception` produces.
3. **`release`'s required frontmatter** (`title`, `version`, `release-line`): the minimum WingFoil,
   UI and Benchmark share; Benchmark's releases have no `release-line` field today.

## Execution Notes

- 2026-10-20: independent review: request changes, three blocking findings: the thin `release`
  must be bound to `element: release` (WingFoil 0.3.0 refuses the include otherwise); `submit` on
  `enter-releasing` and `mark-released` misfires after a reject; the exit criterion did not say
  where the fixture lives, and an untargeted `approve` warns. The approver ruled H
  (`element.set_state`, as WingFoil) and I (Benchmark's `bug` mapping), 2026-10-20. Amended, with
  the `delivery` contract, `{release}`, an Adoption section (any project, then the known ones), the
  step-key mapping completed, the required frontmatter, `end-of-life`'s `produces`, roles and
  markers. Focused re-review requested.
- 2026-10-20: focused re-review: approve after amendments, nothing blocking; every finding of the
  first review resolved, rulings H and I applied. Amended: `deprecate`'s selection, the migration
  rows of Benchmark, UI and this repository, `specification` › `approve`'s selection stated, ruling
  H scoped to `release`, a wrap.
- 2026-10-20: `requires_capabilities: [workflow-engine]`, as `base` (dl-003 D3; the approver's
  ruling J, 2026-10-20).
- 2026-10-26: the `delivery` contract amended in place by dl-026 (plan-047 ruling 13): `release`
  and `retrospective` may be included through sub-workflows the methodology ships, because WingFoil
  0.3.0 closes an earlier `iterate_over` phase once a later one completes, so a methodology with
  repeated Sprints nests its releases and retrospectives in its Sprint sub. No type, state,
  workflow or phase of `software` changes. The text stays unapproved until dl-026 is approved and
  the merge OK is given.
- 2026-10-26: the `delivery` contract's `where` amended in place by dl-027 (plan-047 ruling 14):
  `status: [in-development, releasing]`, scope keys allowed (each a field of the composed
  `release`), because on WingFoil 0.3.0 a release stopped after `enter-releasing` under
  `[in-development]`. The text stays unapproved until dl-027 is approved and the merge OK is given.
- 2026-10-26: written by plan-046 (`pack-cycle` › `author`): `packs/software`, 22 files, on `main`
  through task-047 (`0214cc0`: the five types, templates, roles and DNA, `determinism`,
  `sw-life-cycle` and its defaults, `release`, `release-submit`, `release-publishing`) and task-048
  (`a264f9f`: `adr-ingest`, `bug-ingest`, the AGENTS.md section). Not published: its catalog entry
  and tag come with `first-release`, which needs a methodology in `packs/` (plan-046 ruling 6).
- 2026-10-26: the exit criterion (dl-022 S6) met by task-049 (`babf1e9`), against the `delivery`
  contract before dl-027, read as plan-046's rulings 1 and 3 give it: `base` and `software` stay in
  `packs/`; the overlay `tests/fixtures/software-exit` holds the fixture methodology
  (`methodology/fixture`, never published, R-12) and one composition per distinct parameter set of
  the four governed software repositories (`defaults` this repository's, `flat-releases`
  Benchmark's, `release-folders` WingFoil's, `release-folders-lean` UI's, at the commits task-049
  names), coinciding sets sharing one; the check is `npm run validate -- --overlay
  tests/fixtures/software-exit` on every branch push by the CI (task-046's overlay, task-047's
  step), since `npm test` runs WingFoil's stub: 7 runs, 0 failed, no warning, on WingFoil 0.3.0.
  The fixture's `where` follows dl-027's `[in-development, releasing]` with plan-047's task-051.
- 2026-10-26: what the pack does beyond this charter's text. The approver's rulings in chat
  (2026-10-25, task-047): `end-of-life` gains an `approve` phase after `announce` (approver,
  `memory.approve` on `where: { type: decision-log, status: [in-discussion], tags: [end-of-life]
  }`, `fallback: { step: announce }`), as `base`'s `decision-log-ingest`, and `announce` tags its
  decision-log `end-of-life`, as `base`'s `retrospective`; so the Ships table's `end-of-life` row
  reads with it, and WingFoil's step-key table gains a new key, `end-of-life.approve`
  (`end-of-life.{announce, deprecate, archive}` unchanged). From task-047's review: the five phases
  with no artefact and no other action (`pre-release-checks`, `release-commit`,
  `staging-rehearsal`, `tag`, `archive`) declare `agent.execute`, their step keys unchanged; a
  project binds its own commands to them. Owed: WingFoil is told of `end-of-life.approve` with the
  key mapping, at `software`'s tag.
- 2026-10-27, plan-049 (ruling 3), `base` 2.0.0's `prepare`: `requires` is `base@^2` (the
  frontmatter above and `packs/software/pack.yaml`); where this charter's Purpose and
  Compatibility say `base@^1`, they read `base@^2`. `software` is not published, so no release of
  its own follows.
- 2026-10-28, plan-052 (`first-release`): **`software` 1.0.0 published**: tag `software@1.0.0` at
  `8d4adb3`, catalog commit `6373282`, range `>=0.3.0 <=0.3.1`, CI on the tag and on `main`
  `success`, CB-6's live check passed (prel-004). The README's adoption steps fixed before it
  (bug-007, task-062) and who holds `tech-lead` stated (plan-052 ruling 5: the agent's
  `executes_as` unchanged). With the first version, open point 1's phase names (`frame`/`approve`,
  `specify`/`approve`) are fixed; open points 2 (no `inception_path`) and 3 (`release`'s required
  `title`, `version`, `release-line`) stand as written. The Adoption table's "its adoption plan
  (W9)" for this repository reads W10 (plan-052 ruling 7, with `methodology/kanban`). `accepted →
  active` (plan-052 step 11, as plan-044 ruling B); the `retrospective` of `pack-cycle` runs after
  this plan, for the three cycles.
