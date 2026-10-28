---
id: pack-foundation-base
type: pack
title: "Base"
status: active
axis: "foundation"
name: "base"
slot: ""
pack_path: "packs/base"
requires: []
conflicts: []
---

## Purpose

`base` is the core of every project governed by WingFoil, software or not (dl-022 S1): the Memory
types, workflows, directives and DNA that all of them use, and nothing that only some use. Every
other pack requires it and only adds to it or tightens it (dl-003 D1, spec-001 §3). Its catalog
pack id is `base`, its directory `packs/base`, and it has no `axis` in `pack.yaml` or
`catalog.yaml` (spec-001 §4). This charter rules, for `base`, dl-022 S2 and S4 as dl-023 amends
them, and dl-015's points C1 (decision-log), C3, C4, C7, C8, C9, C10 (decision-log, task, plan) and
C11; plan-041 holds the approver's rulings it applies (numbered R-1 … R-16 below as in plan-041;
15 and 16 are `software`'s).

## Ships

**Memory types** (`fragments/memory.yaml`; WingFoil's state names, dl-015 C1). `base` defines
`defaults` and every type below; states and gates are WingFoil 0.3.0's, and `waiting` stands only
where 0.3.0 drives the edge for every adopter (R-1).

| Type | Machine | Gates | `waiting` | `returns` | Id pattern | Path (parameter, default) |
|---|---|---|---|---|---|---|
| `defaults` | `[draft, pending, approved]` | `pending` → `draft` | — | — | — | — |
| `decision-log` | `[draft, in-discussion, ready]` | `in-discussion` → `draft` | — | — | `dl-{n}-{slug}` | `decision_log_path`, `docs/memory/decision-log/{id}.md` |
| `task` | `[draft, pending, backlog, in-progress, in-review, approved, done]` | `pending` → `draft`; `in-review` → `in-progress` | — | `in-progress` → `backlog` | `task-{n}-{slug}` | `task_path`, `docs/memory/task/{id}.md` |
| `plan` | `[draft, active, done]` | — | `[active]` | — | `plan_id`, default `plan-{n}-{slug}` | `plan_path`, `docs/plans/{id}.md` |

- No `parked` state (dl-023 D1). A plan that is an instance started by `workflow start` is closed
  by `workflow end`; a phase plan, which is not a complete instance, by a hand-written
  `wf(plan): finalize <id> [active → done]` commit. A phase plan carries a non-empty `parent`
  (`<workflow>.<phase>`), or WingFoil 0.3.0 deduces it as an instance.
- `task` moves `backlog → in-progress` and `approved → done` with `submit`; `memory park` takes
  it back to `backlog`. No `limits`: a methodology adds them (spec-001 §7.5). For WingFoil, whose
  `task` has `waiting: [backlog, approved]` driven by its `dev-loop`, those two edges become
  `submit` edges (R-1); spec-001 O15 is the way back.
- `amendable: true` on the three types, as WingFoil. Required frontmatter: `decision-log` and
  `task` require `title`; `plan` requires `title`, `workflow` and `phase`, and its template also
  carries `element` and `parent`. A later pack adds fields (WingFoil's `task` adds `release` and
  `kind`, which cannot be `base`'s).
- Memory templates (`memory-templates/`): `decision-log`, `task`, `plan`, each declaring `format: 1`
  (spec-001 §5), at the format-1 path `memory/templates/built-in/<type>.md` (spec-001 §7.6, O13).

**Workflows** (`workflows/`). Each phase whose artefact is a file declares it in `produces` (R4):
`{ type, path }` for a Memory element, with a `memory.add(type: T)` action in the same phase
(WingFoil 0.3.0 requires it), a path for a document.

| Workflow | Kind | Phases (role) | Notes |
|---|---|---|---|
| `decision-log-ingest` | main | `capture` (product-owner: add, submit; produces the decision-log) → `approve` (approver: `memory.approve`, approval by the approver, fallback `capture`) | dl-015 C3: `approve`, as WingFoil and UI; for decisions that change no governance (dl-022 S4) |
| `governance-evolution` | main | `assess` (facilitator: `agent.execute`, the assessment written into the run's plan, which `workflow start` created and made `active`; its inputs are Execution Notes, retrospective points, feedback notes and the approver's requests; no `memory.add` and no `produces`, the plan being the instance's record) → `propose` (facilitator: a decision-log saying what changes in `.wingfoil/`, `AGENTS.md`, the roles and the Memory types, and why; add, submit; produces it) → `approve` (approver: `memory.approve`, approval by the approver, fallback `propose`) → `apply` (facilitator: the change applied, CLI verbs first, version bumps, `AGENTS.md` updated; produces `.wingfoil` and `AGENTS.md`, evidence that is always satisfied, the directory existing); the plan is then closed by `workflow end` | dl-022 S4: no `waiting` state; a change too large for one session becomes tasks, run through the composition's delivery workflow when it has one, otherwise one at a time under the plan. Other packs tighten it with directives (`software`: an `adr` or a tech-spec amendment for an architectural change; `stage/production`: application only through a task, with CI and a reviewer). Its `main` also keeps a `base`-only composition valid on WingFoil, which refuses a composition with no `main` workflow |
| `retrospective` | sub | `explore` (facilitator: the friction inventory, read-only; produces `{{retrospective_path}}`) → `additional-points` (approver: a checkpoint) → `capture` (facilitator: a decision-log tagged `retrospective`; a change of governance is listed as a point, ruled by `governance-evolution`, one plan per point; a WingFoil defect is a feedback note; produces the decision-log) → `approve` (approver: `memory.approve` on `where: { type: decision-log, status: [in-discussion], tags: [retrospective] }`, so that WingFoil 0.3.0 binds it in a sub to the retrospective's decision-log only (`capture` tags it), approval by the approver, fallback `capture`) | dl-015 C4: the approval phase is the approver's; dl-006 R2 as dl-022 amends it. `software`'s `delivery` includes it at its own cadence |
| `retrospective-periodic` | main | `retrospective` (includes `retrospective`) | What runs `retrospective` in a composition without `software` (spec-001 §9), as this repository's own: a `main` cannot be included, so a thin `main` includes the sub (open point 2) |

**Directives** (`directives/`; none equals a WingFoil built-in id, R-6):
- `traceability`: generic; each project or pack names its own chain (dl-022 S2);
- `doc-versioning`; `security-secrets`, written as real rules;
- `claim-sources`: the generic rule on the sources of claims, which `software` and other packs
  tighten with directives of their own (WingFoil's and UI's `claim-evidence` stays theirs).

`roles.yaml` fragment: `global: [doc-versioning, security-secrets, claim-sources]`;
`assignments.facilitator: [traceability]` (dl-015 C8, as WingFoil, Benchmark and this repository).

**DNA** (`fragments/dna.yaml`):
- `project.name` from `project_name`; `modules: []` and `stacks: { technologies: [],
  methodologies: [] }`, which WingFoil 0.3.0's schema requires, so that `base` validates alone;
- `team.roles`: `approver`, `facilitator`, `product-owner`, with their descriptions;
- `team.members`: one member, `{{approver_name}}` with `email: "{{approver_email}}"` and the role
  `approver` (dl-023 D3; WingFoil grants approval by the member's email);
- `team.agents`: one agent, `{{agent_name}}`, `executes_as: [facilitator, product-owner]`,
  `approval_authority: false`, no `email` (dl-023 D2): a project whose agent has an `adapter` adds
  the email in its own `dna.yaml`;
- `paths.config: [.wingfoil]`; `paths.governance` means the Memory and the plans (dl-015 C11), and
  its values are the project's (open point 3). As dl-015 asked, what reads it was checked: no
  behaviour of WingFoil 0.3.0 depends on it (only its schema, the `paths` query and the agent
  context use it). WingFoil puts `.wingfoil/` there today, so `base`'s `config` entry adds to its
  set at adoption.

**Parameters** (spec-001 §8; the defaults are the convention for new projects, R1):

| Name | Type | Default | Use |
|---|---|---|---|
| `project_name` | string | — (required) | `dna.yaml` `project.name`, the AGENTS.md heading |
| `approver_name` | string | — (required) | the approver member's name |
| `approver_email` | string | — (required) | the approver member's email, matched by WingFoil to grant approval |
| `agent_name` | string | — (required) | the agent's name (dl-015 C9; no default, never an agent product in pack content) |
| `decision_log_path` | path | `docs/memory/decision-log/{id}.md` | `decision-log` `path` |
| `task_path` | path | `docs/memory/task/{id}.md` | `task` `path`; a project may use `{release}` (spec-001 §8.3) |
| `plan_path` | path | `docs/plans/{id}.md` | `plan` `path`; a project may use `{scope}` |
| `plan_id` | pattern | `plan-{n}-{slug}` | `plan` `id_pattern` (dl-015 C7; WingFoil and UI set `{workflow}-{phase}-plan`) |
| `retrospective_path` | path | `docs/retrospectives` | `retrospective` › `explore`'s `produces`: the inventory's directory (weak evidence; a project may set a fixed file) |

**AGENTS.md section** (`agents/section.md`): opens with the file's level-1 heading,
`# {{project_name}}`; states the governance every project shares: the approver approves, the agent
never does and hands the approver the exact command; Memory changes only through the WingFoil CLI;
the workflows above and when to use each. No markers in the section; the composer's region uses
WingFoil task-252's provisional markers (spec-001 §10, R-10).

## Commitments to adopters

Agreed with WingFoil (plan-041, R1), and binding on every version of `base`:
1. The parameters' defaults are the convention for new projects.
2. Existing adopters set their current parameter values (paths and ids) and move no file. What an
   adoption still changes is listed under Adoption below.
3. Ids are immutable: a new id pattern applies to new elements only.
4. Memory types, state names, workflow names and phase names are fixed; a version that renames or
   restructures any of them ships an old → new key mapping (WingFoil dl-187) and is a major
   (`pack-semver`).

## Adoption

**Any project.** A new project, or one with no WingFoil configuration of its own, adopts `base` on
the parameters' defaults: nothing to map. A project that already has its own configuration follows
the same procedure, whoever it is: it sets the parameters to its current values, so no file moves;
it compares its types, states, workflows and phases with `base`'s; it migrates by explicit commits
the elements whose state has another name; and it records an old → new key mapping for its renamed
workflows and phases. `base`'s README gives the procedure (F6.1, spec-002 §2.3).

**What it changes for the known adopters** (plan-041; dl-023 D1; dl-015's list for this
repository):
- `plan`: plans close with `workflow end` or a hand-written `finalize` commit, never `submit`; a
  phase plan carries `parent`; a project holding `parked` plans moves them back to `active` by a
  hand-written status commit before installing the composed configuration;
- the phase and role names above where a project's differ (this repository: `decision-log-ingest`
  › `rule` becomes `approve`, the retrospective's approval role becomes `approver`);
- WingFoil 0.3.0's `init` stubs in `custom/` with the ids of `base`'s directives are removed;
- `decision-log` on the default machine (this repository, Benchmark) migrates by explicit commits:
  `draft → draft`, `pending → in-discussion`, `approved → ready`; the projects whose `task` or
  `plan` machine differs from `base`'s map them in their own adoption plan.

## Out of scope

- Everything of `software` (dl-022 S3): `adr`, `tech-spec`, `bug`, `release`, `release-line`,
  `adr-ingest`, `bug-ingest`, `sw-life-cycle` and its slots, `determinism`, the release ids.
- A delivery workflow for tasks, and `limits`: a methodology's (dl-022 S5: Kanban's work rules are
  `methodology/kanban`'s).
- The WingFoil CLI rules and the feedback inbox: `governance/wingfoil-dogfood` (dl-003 D6).
- A blueprint and a `governance`-axis pack for needs the software repositories do not have
  (dl-022 S5).
- `parked` in `plan` until WingFoil's engine can suspend an instance (dl-023 D1); the agent's
  email (dl-023 D2).
- Changes other repositories must also make (dl-022 S4).

## Compatibility

- `formats`: `dna: 1`, `roles: 1`, `memory: 1`, `workflow: 1`, `directive: 1`,
  `memory-template: 1`. `requires: []`. `requires_capabilities: [workflow-engine]`, from the
  provisional vocabulary (dl-021 R4, O3): `base`'s `plan` has a `waiting` edge that `workflow end`
  closes, as dl-003 D3 asks of a `base` with `waiting` (its first version is 1.0.0, the later
  major D3 allows); the intake of WingFoil 0.3.0 records whether 0.3.0
  provides it (its CHANGELOG names `workflow start`, `end`, `next` and `finalize`). Publication
  (W9) waits for that intake: until a release listed in `compat.yaml` provides `workflow-engine`,
  the computed range is empty and no version is published (spec-001 §12); if the intake does not
  record it, the approver rules again before `first-release`.
- The oldest release of its matrix is WingFoil 0.3.0: it uses `returns`, `amendable` and the plan
  `waiting` edge of 0.3.0's engine, which 0.2.2 lacks; no workflow uses a key newer than 0.3.0.
  The WingFoil range is computed from `compat.yaml`, never written here.
- A `path` parameter used in a `produces` takes only `[A-Za-z0-9._/{}-]` (WingFoil 0.3.0 refuses
  any other character there, `E_PHASE_PRODUCES_NOT_A_PATH`), and no token where no element is in
  scope.
- Install mapping and lock: the format-1 `built-in/` mapping (spec-001 §7.6), provisional until
  WingFoil dl-138's tech-spec (O12, O13). WingFoil 0.3.0's `init` writes `custom/` directives with
  the ids `traceability`, `doc-versioning` and `security-secrets`, which win over `base`'s: an
  adopter removes those stubs.

## Acceptance

- spec-002's CB-1 (README standard) and CB-2 (examples as fixtures, with its exemption while the
  tree holds no methodology; `base`'s examples are due with W10, although a `base`-only example
  now composes and could double as the generic non-software fixture); CB-6's live part at the
  first tag (plan-024).
- **Exit criterion** (dl-022 S6): `base` composes and validates with the parameters of every
  governed project, software or not; the non-software ones through a generic non-software fixture
  in `tests/fixtures/`, and a check against the real projects run outside this repository that
  records only its outcome.

## Open points

For the approver's acceptance:
0. **The `retrospective` tag.** `retrospective` › `approve` selects the retrospective's
   decision-log by a `retrospective` tag that `capture` sets; the `author` phase checks that
   WingFoil 0.3.0's `memory.add` action can set it. If it cannot, the selection keeps type and
   status only, and the charter states the effect: the step proposes every decision-log
   `in-discussion`, the approver approves only the retrospective's, and the step closes once none
   is left.
1. **`retrospective`'s phases.** `base` takes WingFoil's phases without `collect-feedback`, which
   reads registered consumer inboxes (WingFoil dl-163) and is WingFoil's own; WingFoil's
   `retrospective` is also bound to a `release` element, which `base` has not. WingFoil keeps its
   own version, or maps it, at its adoption; a `custom/` workflow of the same name as `base`'s is
   left to WingFoil dl-138's install rules, as for directives.
2. **`retrospective-periodic`.** A thin `main` (this repository's pattern), rather than declaring
   `retrospective` with WingFoil 0.3.0's `startable: true, includable: true` and no `kind`.
3. **`paths.governance`.** Its meaning is fixed (dl-015 C11); the fragment writes no value, since a
   directory list cannot be derived from path parameters.

## Execution Notes

- 2026-10-20: independent review: request changes, two blocking findings, both textual: a `*` in a
  `produces` path is a load error in WingFoil 0.3.0 (`retrospective_path`'s default and `apply`'s
  `.wingfoil/**`), and the DNA fragment lacked `modules` and `stacks`, which 0.3.0 requires.
  Amended, with `assess`, the required frontmatter, commitment 2 scoped to parameter values and an
  Adoption section, WingFoil's `task` verbs, dl-022 S4's third rule, C11's check, open points 1–2,
  CB-2. Focused re-review requested.
- 2026-10-20: the review of `pack-foundation-software` found that an untargeted `memory.approve`
  in a sub-workflow warns on WingFoil 0.3.0: `retrospective` › `approve` selects its decision-log.
  The Adoption section now opens with the procedure for any project (the approver's question).
- 2026-10-20: focused re-review: approve after amendments, nothing blocking; all twelve findings
  resolved. Amended: the `retrospective` › `approve` selection narrowed by a tag (open point 0),
  `apply`'s evidence, the ruling range.
- 2026-10-20: from `pack-foundation-software`'s re-review: the `decision-log` migration of the
  projects on the default machine added to the Adoption section.
- 2026-10-20: `requires_capabilities: [workflow-engine]`, as dl-003 D3 asks of a `base` with
  `waiting` states (the approver's ruling J, 2026-10-20; found at the review of dl-015's note).
- 2026-10-21, task-038 (plan-043): open point 0 settled by the approver's ruling S (2026-10-21),
  which replaces its fallback. Read at `wingfoil/wingfoil@v0.3.0`: a phase's `where` matches a
  list field by a shared element, so `retrospective` › `approve` selects a decision-log tagged
  `retrospective`; but the command WingFoil offers for `memory.add` reads only its `type`, so the
  facilitator passes `--tags retrospective` by hand (`capture`'s description says so); if the tag
  is forgotten, the selection matches nothing and the step reads as complete. The selection is
  repository-wide. A feedback note (F-032) asks WingFoil to pass an action's
  arguments. `retrospective_path`'s default is the directory `docs/retrospectives`. The lint's
  `empty-phase` accepts `additional-points`, an approval checkpoint (ruling R).
- 2026-10-21, task-039 (plan-043): the exit criterion (dl-022 S6) met at `6c68f08` on WingFoil
  0.3.0 with no warning: the README's three examples (the defaults, release folders, release
  folders without a retrospective folder) carry the parameters of the four governed software
  repositories and a generic non-software project, validated by `npm run validate` and the CI on
  every push; the check against the three private, non-software projects, run outside this
  repository, passed for all three. Branch head `8b803ab`: clean-clone checks on Node.js 22.21.0 and
  22.12.0 exit 0, CI run 39631782206 `success`.
- 2026-10-22, plan-044: `base` 1.0.0 published (`prel-001-base-1.0.0`): tag `base@1.0.0` at
  `3f34dfc`, catalog commit `429cf8f`, range `0.3.0`, CI on the tag and on `main` `success`, CB-6's
  live check passed. Activated (`accepted → active`) before `pack-cycle`'s `retrospective`, which
  runs once for both foundation packs after `software`'s `first-release` (plan-044 ruling B).

- 2026-10-26, plan-049, task-054 (for `base` 2.0.0; bug-005, bug-006): on WingFoil 0.3.0 a
  `produces` names a directory only with a trailing slash, and `workflow start` fills a plan's
  `workflow` and `phase` only from the tokens its id pattern or path declares. So:
  - Ships, `governance-evolution` › `apply`: it produces `.wingfoil/` and `AGENTS.md`; with
    `.wingfoil` its evidence was never satisfied, not "always satisfied". It now is once
    `AGENTS.md` exists, `.wingfoil/` always holding files (weak evidence).
  - Parameters: `plan_id`'s default is `{workflow}-{phase}-plan` (dl-015 C7 replaced, plan-049
    ruling 6); `retrospective_path`'s is `docs/retrospectives/`, a directory ending with `/`, a
    fixed file having none.
  - Adoption: a project that keeps `plan-{n}-{slug}` (this repository and Benchmark) states it
    (commitment 2) and, after each `workflow start`, fills the plan's `workflow` and `phase` by
    hand (the main's name and, as WingFoil itself writes them, the instance number, e.g. `1`) and
    submits it; or it uses `{workflow}-{phase}-plan` for its new plans (commitment 3).
    A `retrospective_path` naming a directory gains its trailing `/`.
- 2026-10-27, plan-049: `base` 2.0.0 published (`prel-002-base-2.0.0`, `major`): tag `base@2.0.0`
  at `6d04472`, catalog commit `16f53fa`, range `0.3.0`, CI on the tag and on `main` `success`,
  CB-6's live check passed. It fixes bug-005 and bug-006; 1.0.0 stays listed, frozen.
- 2026-10-27, plan-051: WingFoil 0.3.1 recorded (task-059); the published versions' computed range
  is `>=0.3.0 <=0.3.1` for 1.0.0 and 2.0.0 (`catalog.yaml`). 1.0.0 still meets bug-005 and bug-006
  on 0.3.1. Found by the recheck: bug-007 (the README's install step 3 and `init`'s `custom/`
  workflows), bug-008 (`retrospective` › `approve` in an iterated retrospective).
- 2026-10-28, plan-052 (ruling 2), task-061: the Ships table's `retrospective` row says the tag lets
  WingFoil 0.3.0 bind `approve` "in a sub to the retrospective's decision-log only". That holds for
  one instance only: the selection is not bound to an iteration, so under a methodology that
  includes `retrospective` in an iterated sub (`methodology/scrum`'s Sprint), a closed iteration's
  `approve` step is listed again while a later iteration's retrospective decision-log is
  `in-discussion`, `pending approvals` counting it once per step; one approval clears both
  (bug-008). The README says so in "Sources and adaptations"; its "Install and update" removes
  every workflow `init` scaffolded under `custom/` (bug-007). The body stays as approved.
- 2026-10-28, plan-052: **`base` 2.0.1 published** (patch, the README: bug-007 and bug-008): tag
  `base@2.0.1` at `abc36c0`, catalog commit `8d4adb3`, range `>=0.3.0 <=0.3.1`, CI on the tag and
  on `main` `success`, CB-6's live check passed (prel-003). 1.0.0 and 2.0.0 stay listed, frozen.
