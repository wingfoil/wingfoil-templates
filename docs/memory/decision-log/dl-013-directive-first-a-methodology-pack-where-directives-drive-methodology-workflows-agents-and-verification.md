---
id: dl-013-directive-first-a-methodology-pack-where-directives-drive-methodology-workflows-agents-and-verification
type: decision-log
title: "Directive First: a methodology pack where directives drive methodology, workflows, agents and verification"
status: pending
tags: ["packs","scope","methodology","directives"]
---

## Context

On 2026-10-09 the approver asked, in chat, for a template that lets a project follow the
**Directive First** methodology, and gave its definition. In short:

- **Principle.** Intent precedes implementation: Intent → Directive → Methodology → Workflow →
  Execution → Software, instead of Requirement → Design → Tasks → Code → Test. The project's main
  point of reference is no longer the code but the **Directive**, an explicit representation of the
  intent the software must satisfy, at a level above tasks, code, tools and agents.
- **A Directive** is a persistent instruction that states *what* must be obtained and under which
  conditions, leaving the *how* to the methodology. Where applicable it states: intent, objective,
  scope, constraints, expected behaviour, quality criteria, dependencies, authority, verification,
  life cycle. It does not describe the implementation prematurely ("when the user confirms an
  order, the order is validated before it is shown as confirmed" is a directive; "in
  `OrderController` call `validateOrder()` before `save()`" is an implementation).
- **Source of truth, as a hierarchy:** project intent → strategic → domain → feature →
  implementation directives → tasks → code, configuration, tests. Each level is coherent with the
  one above: an implementation is correct when it realizes the directive, not merely when it works.
- **Directive First, not Directive Only:** requirements, design, tasks, issues, code, tests,
  documentation, architecture and tools stay, as the means that materialize a directive.
- **Directive → Methodology → Workflow.** The methodology says how a *category* of directive turns
  into work (a UI directive: UX analysis → UI design → interaction → implementation → integration →
  validation; a cloud directive: architecture → security → infrastructure → deployment →
  verification → monitoring). The workflow is its executable form and keeps the reference to the
  directive that generated it: it knows why its tasks exist.
- **Agents and tools are the execution layer.** They execute the methodology and do not define it.
  The work is defined first; agent, model, tools, autonomy, data and directives to apply are chosen
  afterwards, from the task's complexity, risk and required capabilities. Changing model or agent
  does not change the project's intent.
- **Inheritance:** a child directive inherits, specializes, restricts or extends its parent, and
  never violates a higher one without an explicit change by the higher authority.
- **Conflict:** an agent never resolves a conflict between directives on its own; the system
  determines which has more authority, which scope applies, which is more recent, whether one
  legitimately specializes the other, and whether a human decision is needed.
- **Verification** belongs to each directive (expected outcome → verification criteria → tests,
  checks, review); a verifier asks "does the implementation satisfy the directive?", not only "does
  it work?".
- **Feedback loop:** Intent → Directive → Methodology → Execution → Result → Verification →
  Feedback → Directive refinement; feedback may change or create a directive, change a methodology
  or a workflow, improve the agent selection, or consolidate a solution.
- **From AI behaviour to deterministic software:** a function first realized by an agent may,
  once stable, frequent and validated, be formalized as ordinary software.
- **The UI as intent generator:** a user's interaction expresses an intent resolved into
  directives, workflows and agent execution; UI and backend are two ends of one intentional model.
- **WingFoil's role:** a methodological substrate. WingFoil provides the mechanism, the project the
  directives; agents execute, workflows coordinate, checks verify, Memory keeps context and
  history. The definition suggests a `.wingfoil/` with `directives/`, `methodologies/`,
  `workflows/`, `agents/`, `checks/`, `memory/`, `project/`, the exact structure left to the
  implementation.
- **What the template initializes:** five levels — governance (hierarchy, authority, conflicts,
  approvals, changes, compliance), methodology (classifying directives, which workflows they
  activate, roles, verifications), workflow (sequence, conditions, handoffs between agents,
  checkpoints, verifications, escalation), agents and tools (which, capabilities, when, models,
  tools), Memory (why a directive exists, decisions, what was implemented, results, feedback).
- **Most important principle:** structure + rules + mechanisms, never a rigid semantics or a
  bureaucracy of predefined documents; the project defines its own directives, terminology,
  artifacts and specific methodology.
- **Definition:** "Directive First is a software development methodology in which intent is
  formalized into Directives before implementation, and Directives guide methodology, workflows,
  agents, tools and verification until the software is realized." Operating principle: *Define the
  intent. Direct the work. Orchestrate the execution. Verify the outcome. Evolve the directive.*

What already exists, and constrains the placement:
- the pack model: `methodology` has cardinality exactly one and fills the `delivery` slot; no other
  pack may ship a workflow named after a slot (spec-001 §9); a methodology that is structurally
  different is a methodology of its own (dl-001 D2);
- the composition order is `base`, methodology, phases, blueprints, governance, team-mode, stage,
  and a `requires` that points later in this order is an error (spec-001 §7.1);
- a pack ships only `pack.yaml`, README, CHANGELOG, `dna`/`roles`/`memory` fragments, directives,
  workflows, Memory templates and an AGENTS.md section (spec-001 §6.1); it writes only `built-in/`,
  never `custom/` (§7.6). WingFoil 0.2.2 has no `methodologies/`, `agents/`, `checks/` or `project/`
  folder, and the layout of `.wingfoil/` is WingFoil's (`03_is-isnot.md`; dl-001 D6);
- a **WingFoil directive** is today a Markdown rule file bound to roles (`roles.yaml`), with no life
  cycle, no authority, no parent and no verification; a project's `custom/` directive overrides a
  pack directive with the same id (WingFoil dl-037). The Directive of this methodology is broader:
  it has a life cycle and an authority, so it is closer to a Memory element;
- WingFoil 0.2.2 checks only that required frontmatter fields are present (and non-empty) at
  `submit`; nothing evaluates a workflow's `checks` strings or `where:` (W-09, F-018); there is no
  workflow engine;
- format 1 has scalar parameter types only (spec-001 §8.1);
- `team-mode/agent-first` (F4.4) depends on WingFoil's agent work (F-009); `dna.yaml` declares
  agents with `executes_as` and `approval_authority` only;
- dl-011 (initialization template) starts from intent; dl-012 (feedback pack) provides the
  feedback loop.

## Options

**Where the methodology lives.**

- **(a) A methodology pack, `methodology/directive-first`.** It fills `delivery` with a
  directive-driven flow: each directive is classified by type and runs the workflow its type maps
  to; continuous flow, no timebox.
  - For: the definition is a delivery model (how work is derived and coordinated), structurally
    different from Scrum and Kanban (dl-001 D2); one pack carries all five levels; it composes with
    every other axis.
  - Against: cardinality one excludes `scrum` and `kanban` in the same project.
- **(b) A governance pack, `governance/directive-first`, over any methodology.**
  - For: Scrum or Kanban keep the cadence; the pack adds hierarchy, authority, conflict and
    verification.
  - Against: the methodology level of the definition (classifying directives, activating workflows
    per type) *is* the delivery, and only the methodology may ship `delivery` (spec-001 §9); the
    defining step — directive → methodology → workflow — would be missing.
- **(c) Split: (a) plus a later `governance/directive-hierarchy`** holding hierarchy, authority,
  inheritance, conflict and verification, reusable by Scrum and Kanban projects. Because governance
  is composed after the methodology, `directive-first` cannot require it: the two would be combined
  by a preset, or spec-001 §7.1 amended.

**What a Directive is, in WingFoil's files.**

- **(i) A new Memory type (life cycle, authority, parent, verification), the source of truth;**
  active directives that constrain how agents work are **materialized by the project** as WingFoil
  directive files in its `custom/`, bound to roles. WingFoil's directive files stay what WingFoil
  reads; the Memory element holds the rest.
- **(ii) WingFoil directive files with extra frontmatter.** Against: no life cycle, no approval, no
  history; fields WingFoil ignores today (and may warn about).
- **(iii) Wait for WingFoil to make directives first-class.** Against: the project can follow the
  methodology only after an unscheduled WingFoil change.

## Decision

**Proposed: (a) now, with (i); (c) as a possible later evolution**, captured with plan-020 on
2026-10-09. The approver rules at `memory approve`.

### D1 — The pack

`methodology/directive-first` (Memory element `pack-methodology-directive-first`),
**`requires: [base@^<major>]`** only (spec-001 §7.1: it cannot require `governance/feedback`,
which is composed later); `conflicts` none (the axis's cardinality excludes the other
methodologies). The feedback loop is provided by the **`directive-first` preset** (D11), which
combines the pack with `governance/feedback` (dl-012) and sets its parameters. The README opens
with the summary of `pack.yaml` and puts the definition and the operating principle, verbatim, at
the head of "When to use it" (dl-014 D1). The method is declared as a house method, "Directive
First, the approver's definition of 2026-10-09", with its sources and adaptations (dl-007,
pending). Per dl-001 D7 the pack enters the official catalog only with a maintained line; the
approver confirms the commitment at the charter, or places it in the community catalog.

### D2 — Mapping the five levels onto WingFoil's files

| Level | What the pack ships (WingFoil 0.2.2 file kinds) |
|---|---|
| Governance | the Memory type for directives (D3), the `directive-governance` directive (hierarchy, inheritance, authority, conflict procedure, changes, compliance, materialization and traceability rules), approver gates in the directive life cycle |
| Methodology | the `directive-methodology` directive: classification of directives by type, the type → workflow map (D5), roles needed, verifications required per type |
| Workflow | `delivery` (the slot), the `directive-dispatch` sub-workflow and the type workflows, with conditions, handoffs, checkpoints, verification phases and escalation to the approver (D5, D7) |
| Agents & tools | `dna.yaml` and `roles.yaml` fragments (roles: directive owner, implementer, verifier), the `agent-selection` directive and task fields (D6) |
| Memory | the directive type, a `directive` field on `task` (D6), decision-logs for conflicts and authority changes, verification evidence in the task (D7), feedback through dl-012 |

The `.wingfoil/` layout the definition suggests (`methodologies/`, `agents/`, `checks/`,
`project/`) is WingFoil's to decide: it goes to WingFoil as a feedback note (D10), and the pack maps
each level onto the existing files until then. When WingFoil adds those kinds, a new major of the
pack moves to them.

### D3 — The Directive element

A Memory type, proposed name **`intent-directive`**, ids `drv-{n}-{slug}` (the name avoids
WingFoil's `type: directive`; it is checked against WingFoil's reserved names in the design phase,
as `service` was). Frontmatter, all required:
- `level` (default levels `project | strategic | domain | feature | implementation`);
- `parent` — the directive it derives from, or the sentinel **`root`** at the top level (WingFoil
  refuses an empty required field at `submit`);
- `dtype` — its category (D5);
- `authority` — the role that owns it and may change it;
- `supersedes` is optional.

Body sections, each "where applicable": intent, objective, scope (in / out), constraints, expected
behaviour, quality criteria, dependencies, verification. Authority is in the frontmatter, and the
life cycle is the type's state machine: `draft → proposed (gate: approver) → active → retired`,
`deprecated` via `memory deprecate`; no `waiting` state (dl-003 D3). The template states the "what,
not how" rule with the order example of the Context.

Levels, types, section names and terminology are configurable per project: the pack fixes only the
mechanism (a parent, an authority, a verification, a life cycle). How a list of levels or types is
declared as a parameter is a design-phase question (D11), shared with dl-012.

**Materialization.** When a directive that constrains how agents work becomes `active`, the
**project's agent** (never the pack) writes a WingFoil directive file in `custom/` whose id is the
element id, bound to the roles concerned, citing the element. The id is checked not to equal a
WingFoil built-in directive id (W-11, F-019) or a directive id of the composition (spec-001 §7.6,
O5). When the element is `retired` or `deprecated`, the file and its `roles.yaml` binding are
removed. `directive-governance` states the rule that every materialized file cites an `active`
element, so drift is visible.

### D4 — Hierarchy, inheritance and conflict

Rules of `directive-governance`:
- every directive below the top level has a `parent` at a higher level; a task names the directive
  it materializes (D6); a child inherits its ancestors and may specialize, restrict or extend them,
  never violate them;
- a change that would violate an ancestor is a change of the ancestor, by its authority;
- **when two directives seem to conflict**, in order:
  1. **specialization** — if one inherits, specializes, restricts or extends the other, there is no
     conflict;
  2. **hierarchy** — if one is an ancestor of the other, the ancestor wins; changing it is its
     authority's decision;
  3. **authority** — between directives that are not ancestors of each other, the one whose
     `authority` role ranks higher (a rank the project declares) wins;
  4. **scope**, then **recency** — each only when nothing above decides;
  5. otherwise **the agent stops and the conflict becomes a decision-log for the approver**. An
     agent never resolves a conflict by choosing.

`level` (where a directive sits in the hierarchy) and `authority` (who owns it) stay separate.

### D5 — Directive → methodology → workflow

- `delivery` has **one** `iterate_over` phase over active directives of the levels that produce
  work. It includes the **`directive-dispatch`** sub-workflow, whose agent step reads `dtype` and
  runs the workflow the type map names (selection by frontmatter, W-09): one continuous flow.
- The type map lives in the `directive-methodology` directive. A project adds a type by
  overriding that directive in `custom/` with the same id (WingFoil dl-037) and adding its type
  workflow in `custom/` under a new name, included from `workflows.yaml`; no pack file changes.
- The pack ships a **default type** (`general`: analysis → design → implementation → verification)
  and two worked types from the definition, `ui` and `infrastructure`, as examples a project keeps,
  changes or removes.
- Type workflows create `task` elements (`base`'s type) and use their states as the task flow.
- `delivery` includes `release` and `retrospective` by name (spec-001 §9): `release` when a
  directive the project marks as releasable reaches its verification, and `retrospective` when a
  top-level directive's work is verified, or at a cadence the project sets.
- Every task and verification keeps the reference to the directive that generated it.

### D6 — Agents and tools as the execution layer

- `task` is tightened (spec-001 §7.5) with **one** required field, `directive`: the directive the
  task materializes, or `none` with a reason ("Directive First, not Directive Only": bugs and other
  captured work may have none).
- The work is defined before the agent: before a task moves to `in-progress`, it records
  `complexity`, `risk` and `capabilities` (a workflow check the agent follows); the `agent-selection`
  directive chooses agent, model, tools, autonomy level, context data and directives to apply from
  them, and records the choice in the task.
- No pack file names an agent product or a model; the project declares its agents in `dna.yaml`.
  Agents never hold approval authority. **Separation of duties:** the verification is done by a
  different agent run or a human than the implementation (a parameter sets which), so that a solo
  developer with one agent can still apply it.
- Richer agent descriptions (capabilities, models, tools) wait for WingFoil (F-009) and overlap
  `team-mode/agent-first`; D10 notes them.

### D7 — Verification and the feedback loop

- Every directive that produces work states its verification criteria before work starts (a check
  on the `proposed → active` gate, judged by the approver); every type workflow ends with a
  verification phase run by the verifier, which answers "does the result satisfy the directive?"
  with evidence per criterion, recorded in a verification section of the task.
- Results, failed verifications and observations become feedback (dl-012). The `directive-first`
  preset sets dl-012's outcome list to include `directive-refinement`, `methodology-change` and
  `agent-selection-change`; with no route of their own they become decision-logs (dl-012 D3), which
  the directive's authority or the approver acts on.
- **Formalization (AI → deterministic software):** a directive may record `realization: agent |
  software`; a recurring, validated agent-realized behaviour can be proposed, through feedback, as
  a new implementation directive whose realization is software.

### D8 — Out of scope of the pack

- **The UI as intent generator** (the definition's §14) is an architecture of the adopter's
  software, not process content: a candidate for a later `blueprint`, and an input for WingFoil-UI.
  Open for the approver.
- Any WingFoil engine behaviour (automatic dispatch, conflict detection, agent/model routing): the
  pack gives rules the agent follows and the approver checks; WingFoil may automate them later
  (D10).

### D9 — Acceptance criteria of the capability

Each criterion says who checks it: **[V]** the validation command or a test under `tests/`;
**[E]** the fixture-element checks of dl-012 D8; **[A]** the approver. Fixtures live under
`tests/fixtures/examples/directive-first/<example>/` (dl-014) and run in the matrix's self-test mode
(dl-009) while no released WingFoil accepts the `format:` key.

- **DF-1 Installable [V].** The `directive-first` preset (`base` + `methodology/directive-first` +
  `governance/feedback`) composes deterministically and validates (F3.3, F3.4), with and without a
  blueprint and `team-mode/agent-first`; the pack alone with `base` also validates.
- **DF-2 Five levels [V].** The composition contains, for each level of D2, the files listed there;
  a test fails if one is missing.
- **DF-3 Directive element [V].** The directive type requires `level`, `parent`, `dtype`,
  `authority`; its template has the body sections intent, objective, scope, constraints, expected
  behaviour, quality criteria, dependencies and verification, and the "what, not how" rule.
- **DF-4 Hierarchy [E].** A fixture project with a five-level chain passes; a fixture with a
  directive whose parent is at a lower or equal level, or does not resolve, fails.
- **DF-5 Conflict [A].** A fixture with two conflicting directives of equal authority and scope
  records the procedure of D4 ending in a decision-log for the approver, with no agent choice.
- **DF-6 Dispatch [V][A].** Directives of types `general`, `ui` and `infrastructure` run their own
  workflows through `directive-dispatch`; a fixture project adds a type by a `custom/` override of
  `directive-methodology` and a `custom/` workflow, and validates without changing pack files.
- **DF-7 Traceability [V][E].** `directive` is required on `task` [V]; every fixture task and
  verification names a directive or `none` with a reason [E].
- **DF-8 Agent selection [E][A].** Fixture tasks record complexity, risk and capabilities and the
  agent choice derived from them; the verification is by a different run or a human.
- **DF-9 Verification [V][A].** Every type workflow ends with a verification phase against the
  directive's criteria [V]; a directive without criteria is not approved to `active` [A].
- **DF-10 Feedback loop [E][A].** Under the preset, a fixture shows result → failed verification →
  feedback → directive refinement (a decision-log) → a changed directive → a new task.
- **DF-11 Not rigid [V].** A second fixture renames the levels and types and drops two optional
  sections, through parameters and `custom/` only, and still validates; no pack file names a
  project, a person, an agent product or a model (F3.5 lint rules).
- **DF-12 With the initialization template [E][A].** In a dl-011 scenario, Reconfigure WingFoil
  selects `methodology/directive-first` and, as its initial elements (dl-011 D5), creates the
  project-intent directive and the first strategic directives from the approved project
  definition; they are the first step of Execution.

### D10 — Amendments this decision implies

Applied after approval, under the follow-up plan of plan-020, each document bumped per
`doc-versioning`:
- **dl-001 D5, first scope:** not changed — the pack is planned after the first catalog (below);
- **`06_features.md`:** feature **F4.10**, "`methodology/directive-first`: directives drive
  methodology, workflows, agents and verification" (journeys J5, J6; J10 if dl-011 is approved;
  Value H, Effort H, Uncertainty **H**);
- **`07_sequencer.md`:** F4.10 in **a wave of its own after M3** (chosen by the approver in chat on
  2026-10-09), with the `directive-first` preset; proposed id **W15**, in a milestone between M3 and
  M4 (ids assigned at the amendment). It follows W9 (`governance/feedback`) and W11 (`guided-init`,
  for DF-12). The MVP (M3) is unchanged;
- **feedback notes** to WingFoil (`wingfoil-cli` rule 3), written when the charter is accepted:
  (1) directives as first-class elements: hierarchy, inheritance, authority, life cycle,
  verification, conflict detection; (2) the `.wingfoil/` layout of the definition
  (`methodologies/`, `agents/`, `checks/`, `project/`); (3) dispatch of a workflow by an element
  field (relates F-018); (4) agent and model selection from task complexity, risk and capabilities
  (relates F-009). WingFoil decides through its own process (dl-001 D6).

Configuration changes of this repository's `.wingfoil/`: none. This repository does not adopt the
methodology; its `methodology` stays Kanban.

### D11 — Elements opened later

Through `sw-life-cycle` › `pack-delivery` › `pack-cycle`:
- **pack charter** `pack-methodology-directive-first`, with D1–D9 as scope and acceptance; its README
  follows dl-014 D1 if approved;
- **`design` phase: required.** A tech-spec for the directive model: the type's fields and name,
  the hierarchy and conflict rules as checkable properties, the type map and its override, the
  materialization rule. It shares with dl-012 D8 the question of list-valued parameters (levels,
  types, task fields) and how a preset sets them;
- **tasks** (`author` phase, `pack: pack-methodology-directive-first`), proposed:
  1. the directive Memory type, its life cycle and template (DF-3);
  2. `directive-governance`: hierarchy, inheritance, authority, conflict procedure, materialization
     (DF-4, DF-5);
  3. `directive-methodology` and the type map; `delivery`, `directive-dispatch` and the `general`,
     `ui`, `infrastructure` type workflows, with `release` and `retrospective` (DF-6);
  4. the `task` tightening and the traceability rules (DF-7);
  5. `agent-selection` and the roles fragment (implementer, verifier, directive owner) (DF-8);
  6. verification phases and the criteria gate (DF-9);
  7. the pack-specific tests (DF-2, DF-3, DF-6, DF-9, DF-11);
  8. fixtures: five-level chain, conflict, dispatch, renamed terminology, feedback loop (DF-1,
     DF-4 … DF-11);
  9. the README with the definition and the operating principle, its examples as fixtures
     (dl-014 D1);
- **the `directive-first` preset** (F2.6): `base` + `methodology/directive-first` +
  `governance/feedback`, with the outcome values of D7;
- **later, option (c):** a `governance/directive-hierarchy` pack, if a Scrum or Kanban project asks
  for the governance level alone;
- **the feedback notes** of D10.

## Execution Notes

- Captured 2026-10-09 under plan-020, on the approver's request in chat; no implementation in this
  step.
- To be ruled after dl-012 (preset, outcomes) and dl-011 (DF-12).
- Open for the approver at the ruling: the directive type's name; option (c) later or never; the UI
  point (D8); official or community catalog.
- 2026-10-09: amended while `pending` after an independent review, as the approver asked: `requires`
  only `base`, feedback through the preset (review N1); one dispatch sub-workflow and a type map a
  project overrides in `custom/` (N2); `parent: root` at the top level (N3); acceptance criteria
  tagged by checker (N4); list-valued parameters as a shared design question (N5); conflict
  procedure reordered, `level` and `authority` kept apart (N6); `release`, `retrospective`, task
  flow and the method declaration (N7); a wave of its own after M3, chosen by the approver in chat,
  and dl-001 D7 (N8); initial directives created by Reconfigure (N9); Context and option (b)
  corrected (N10); body sections listed (N11); materialization rules (N12); one required task field,
  separation of duties as a parameter (N13); README per dl-014 (N14); conditions, handoffs, evidence,
  the UI point and journeys (N15).
- 2026-10-09: the approver deferred the ruling, in chat: dl-011, dl-012 and dl-013 are ruled once
  WingFoil has released stable configuration contracts (at least v0.3, preferably later); dl-014 may
  be ruled earlier. The element stays `pending` until then (precedent: dl-007). At the ruling, the
  text is re-checked against the formats that WingFoil release defines.
