---
id: dl-013-directive-first-a-methodology-pack-where-directives-drive-methodology-workflows-agents-and-verification
type: decision-log
title: "Directive First: a methodology pack where directives drive methodology, workflows, agents and verification"
status: draft
tags: ["packs","scope","methodology","directives"]
---

## Context

On 2026-10-09 the approver asked, in chat, for a template that lets a project follow the
**Directive First** methodology, and gave its definition. In short:

- **Principle.** Intent precedes implementation: Intent → Directive → Methodology → Workflow →
  Execution → Software, instead of Requirement → Design → Tasks → Code → Test. The project's main
  point of reference is no longer the code but the **Directive**, an explicit representation of the
  intent the software must satisfy.
- **A Directive** is a persistent instruction that states *what* must be obtained and under which
  conditions, leaving the *how* to the methodology. Where applicable it states: intent, objective,
  scope, constraints, expected behaviour, quality criteria, dependencies, authority, verification,
  life cycle. It does not describe the implementation prematurely ("when the user confirms an
  order, the order is validated before it is shown as confirmed" is a directive; "in
  `OrderController` call `validateOrder()` before `save()`" is an implementation).
- **Source of truth, as a hierarchy:** project intent → strategic → domain → feature →
  implementation directives → tasks → code, configuration, tests. Each level is coherent with the
  one above: an implementation is correct when it realizes the directive, not merely when it works.
- **Directive First, not Directive Only:** requirements, design, tasks, code, tests, documentation,
  architecture and tools stay, as the means that materialize a directive.
- **Directive → Methodology → Workflow.** The methodology says how a *category* of directive turns
  into work (a UI directive: UX analysis → UI design → interaction → implementation → integration →
  validation; a cloud directive: architecture → security → infrastructure → deployment →
  verification → monitoring). The workflow is its executable form and keeps the reference to the
  directive that generated it.
- **Agents and tools are the execution layer.** They do not define the methodology. The work is
  defined first; agent, model, tools, autonomy, data and directives to apply are chosen afterwards,
  from the task's complexity, risk and required capabilities.
- **Inheritance:** a child directive inherits, specializes, restricts or extends its parent, and
  never violates a higher one without an explicit change by the higher authority.
- **Conflict:** an agent never resolves a conflict between directives on its own; the system
  determines authority, scope, recency, legitimate specialization, and whether a human decision is
  needed.
- **Verification** belongs to each directive (expected outcome → verification criteria → tests,
  checks, review); a verifier asks "does the implementation satisfy the directive?", not only "does
  it work?".
- **Feedback loop:** Intent → Directive → Methodology → Execution → Result → Verification →
  Feedback → Directive refinement; feedback may change a directive, a methodology, a workflow, the
  agent selection, or consolidate a solution.
- **From AI behaviour to deterministic software:** a function first realized by an agent may,
  once stable and validated, be formalized as ordinary software.
- **The UI as intent generator:** a user's interaction expresses an intent resolved into
  directives and workflows.
- **WingFoil's role:** a methodological substrate. WingFoil provides the mechanism, the project the
  directives; agents execute, workflows coordinate, checks verify, Memory keeps context and
  history. The definition suggests a `.wingfoil/` with `directives/`, `methodologies/`,
  `workflows/`, `agents/`, `checks/`, `memory/`, `project/`, the exact structure left to the
  implementation.
- **What the template initializes:** five levels — governance (hierarchy, authority, conflicts,
  approvals, changes, compliance), methodology (classifying directives, which workflows they
  activate, roles, verifications), workflow (sequence, conditions, handoffs, checkpoints,
  verifications, escalation), agents and tools (which, capabilities, when, models, tools), Memory
  (why a directive exists, decisions, what was implemented, results, feedback).
- **Most important principle:** structure + rules + mechanisms, never a rigid semantics or a
  bureaucracy of predefined documents; the project defines its own directives, terminology,
  artifacts and specific methodology.
- **Definition:** "Directive First is a software development methodology in which intent is
  formalized into Directives before implementation, and Directives guide methodology, workflows,
  agents, tools and verification until the software is realized." Operating principle: *Define the
  intent. Direct the work. Orchestrate the execution. Verify the outcome. Evolve the directive.*

What already exists, and constrains the placement:
- the pack model: `methodology` has cardinality exactly one and fills the `delivery` slot; overlays
  only add or tighten (dl-001 D1, dl-003 D1, D4); a methodology that is structurally different is a
  methodology of its own (dl-001 D2);
- a pack writes only WingFoil's file kinds (spec-001 §5, §8): `dna.yaml`, `roles.yaml`,
  `memory.yaml`, `workflows.yaml` fragments, workflows, directives, Memory templates. WingFoil 0.2.2
  has no `methodologies/`, `agents/`, `checks/` or `project/` folder, and the layout of `.wingfoil/`
  is WingFoil's (`03_is-isnot.md`: not a place to change WingFoil; dl-001 D6);
- a **WingFoil directive** is today a Markdown rule file bound to roles (`roles.yaml`), with no life
  cycle, no authority, no parent and no verification. The Directive of this methodology is broader:
  it has a life cycle and an authority, so it is closer to a Memory element;
- `where:` on `iterate_over` is not evaluated (W-09, F-018), and there is no workflow engine:
  dispatch by a field is done by the agent reading the frontmatter, as in this repository;
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
    different from Scrum and Kanban (dl-001 D2); one pack carries all five levels coherently; it
    composes with every other axis.
  - Against: cardinality one excludes `scrum` and `kanban` in the same project. A team that wants
    sprints over directives cannot have both until the governance part is split out (option b).
- **(b) A governance overlay, `governance/directive-first`, over any methodology.**
  - For: Scrum or Kanban keep the cadence, the overlay adds hierarchy, authority, conflict and
    verification.
  - Against: the methodology level of the definition (classifying directives, activating workflows
    per type) *is* the delivery; an overlay cannot replace `delivery` (only add or tighten), so the
    defining step — directive → methodology → workflow — would be missing.
- **(c) Split: (a) plus a later `governance/directive-hierarchy`** that holds hierarchy, authority,
  inheritance, conflict and verification, required by `directive-first` and reusable by Scrum and
  Kanban projects.
  - For: the best long-term shape; matches dl-012's pattern (generic governance pack, specific pack
    built on it).
  - Against: two packs to charter before the first one is usable; the split is easier once the
    first pack exists.

**What a Directive is, in WingFoil's files.**

- **(i) A new Memory type (life cycle, authority, parent, verification), the source of truth;**
  approved directives that constrain how agents work are **materialized** as WingFoil directive files
  in the project's `custom/`, citing the element id, and bound to roles. WingFoil's directive files
  stay what WingFoil reads; the Memory element holds the rest.
- **(ii) WingFoil directive files with extra frontmatter.** Against: no life cycle, no approval, no
  history; fields WingFoil ignores today (and may warn about).
- **(iii) Wait for WingFoil to make directives first-class** (hierarchy, authority, life cycle).
  Against: the project can follow the methodology only after an unscheduled WingFoil change.

## Decision

**Proposed: (a) now, with (i); (c) as the planned evolution**, captured as proposed with plan-020
on 2026-10-09. The approver rules at `memory approve`.

### D1 — The pack

`methodology/directive-first` (pack id `pack-methodology-directive-first`), `requires:
[base@^<major>, feedback@^<major>]` (dl-012: the feedback loop is part of the method, not an
option); `conflicts` none (the axis's cardinality excludes the other methodologies). Its README
opens with the definition and the operating principle of the Context, verbatim.

### D2 — Mapping the five levels onto WingFoil's files

| Level | What the pack ships (WingFoil 0.2.2 file kinds) |
|---|---|
| Governance | a Memory type for directives (D3), the `directive-governance` directive (hierarchy, inheritance, authority, conflict procedure, changes, compliance), approver gates in the directive life cycle |
| Methodology | the `directive-methodology` directive: classification of directives by type, the type → workflow map (D5), roles needed, verifications required per type |
| Workflow | the delivery workflow and one sub-workflow per directive type, with checkpoints, verification phases, escalation to the approver (D5, D7) |
| Agents & tools | `dna.yaml` and `roles.yaml` fragments (roles: directive-owner, implementer, verifier), the `agent-selection` directive and task fields for complexity, risk and required capabilities (D6) |
| Memory | the directive type, a `directive` link field added to `task` (tightening, spec-001 §7.5), decision-logs for conflicts and authority changes, feedback through dl-012 |

The `.wingfoil/` layout the definition suggests (`methodologies/`, `agents/`, `checks/`,
`project/`) is WingFoil's to decide: it goes to WingFoil as a feedback note (D9), and the pack maps
each level onto the existing files until then. When WingFoil adds those kinds, a new major of the
pack moves to them.

### D3 — The Directive element

A Memory type (proposed name **`intent-directive`**, ids `drv-{n}-{slug}`; the name avoids
WingFoil's `type: directive` and is checked against WingFoil's reserved names, as `service` was).
Frontmatter: `level` (parameter list, default `project | strategic | domain | feature |
implementation`), `parent` (the directive it derives from; empty only at the top level),
`dtype` (its category, D5), `authority` (the role that owns it), `supersedes`. Body sections, each
optional "where applicable": intent, objective, scope (in / out), constraints, expected behaviour,
quality criteria, dependencies, verification, life cycle. Life cycle: `draft → proposed (gate:
the authority's approver) → active → retired`, `deprecated` via `memory deprecate`; no `waiting`
state (dl-003 D3). The template states the "what, not how" rule with the order example of the
Context.

Levels, types, section names and terminology are **parameters with defaults**: the project
renames, removes or adds them; the pack fixes only the mechanism (a parent, an authority, a
verification, a life cycle).

### D4 — Hierarchy, inheritance and conflict

Rules of `directive-governance`:
- every directive below the top level has a `parent` at a higher level; a task names the directive
  it materializes; a child inherits its ancestors and may specialize, restrict or extend them,
  never violate them;
- a change that would violate an ancestor is a change of the ancestor, by its authority;
- **conflict procedure**, in order: authority (higher level wins), scope (the narrower scope
  applies inside it), recency (where both have the same authority and scope), legitimate
  specialization; if none settles it, **the agent stops and the conflict becomes a decision-log for
  the approver**. An agent never resolves a conflict by choosing.

### D5 — Directive → methodology → workflow

- The delivery workflow iterates over active directives of the lowest level that produces work;
  each is classified (`dtype`) and runs the sub-workflow its type maps to, one `iterate_over` phase
  per type (selection by frontmatter, W-09).
- The pack ships a **default type** (`general`: analysis → design → implementation → verification)
  and two worked types from the definition, `ui` and `infrastructure`, as examples a project keeps,
  changes or removes. A project adds its own types as workflows in `custom/` plus an entry in the
  type map.
- Every workflow, task and artifact keeps the reference to the directive that generated it
  (`traceability`): a task without a `directive` fails the check.

### D6 — Agents and tools as the execution layer

- The work is defined before the agent: each task records `complexity`, `risk` and
  `capabilities` (parameter lists); the `agent-selection` directive chooses agent, model, tools,
  autonomy level, context data and directives to apply from them, and records the choice in the
  task's Execution Notes.
- No pack file names an agent product or a model; the project declares its agents in `dna.yaml`.
  Agents never hold approval authority. The verifier of a task is not its implementer.
- Richer agent descriptions (capabilities, models, tools) wait for WingFoil (F-009) and overlap
  `team-mode/agent-first`; D9 notes them.

### D7 — Verification and the feedback loop

- Every directive that produces work states its verification criteria before work starts (a check
  on the `proposed → active` gate); every type workflow ends with a verification phase run by the
  verifier role, which answers "does the result satisfy the directive?" with evidence per
  criterion.
- Results, failed verifications and observations become feedback (dl-012), whose outcomes gain
  `directive-refinement` (a new or changed directive), `methodology-change` (a type map or workflow
  change) and `agent-selection-change`, through dl-012's parameters, not a fork.
- **Formalization (AI → deterministic software):** a directive may record `realization: agent |
  software`; a recurring, validated agent-realized behaviour can be proposed, through feedback, as
  a new implementation directive whose realization is software.

### D8 — Out of scope of the pack

- **The UI as intent generator** (§14 of the definition) is an architecture of the adopter's
  software, not process content: candidate for a later `blueprint`, and an input for WingFoil-UI.
- Any WingFoil engine behaviour (automatic dispatch, conflict detection, agent/model routing): the
  pack gives rules the agent follows and the approver checks; WingFoil may automate them later
  (D9).

### D9 — Acceptance criteria of the capability

Checked on fixtures under `tests/fixtures/` by the validation command, or by the approver where
stated.

- **DF-1 Installable.** `base` + `governance/feedback` + `methodology/directive-first` composes
  deterministically and validates with the pinned WingFoil (F3.3, F3.4), with and without a
  blueprint and `team-mode/agent-first`.
- **DF-2 Five levels.** The composition contains, for each level of D2, the files listed there; a
  check fails if one is missing.
- **DF-3 Directive element.** The directive type enforces `level`, `parent`, `dtype`, `authority`;
  its template has the ten sections of the definition and the "what, not how" rule.
- **DF-4 Hierarchy.** A fixture project with a five-level chain validates; a fixture with a
  directive whose parent is at a lower or equal level, or missing, fails the check.
- **DF-5 Conflict.** A fixture with two conflicting directives of equal authority and scope shows
  the procedure ending in a decision-log for the approver, with no agent choice.
- **DF-6 Dispatch.** Directives of types `general`, `ui` and `infrastructure` run their own
  workflows; a project-defined type added in `custom/` runs without changing pack files.
- **DF-7 Traceability.** Every task and verification in the fixtures names its directive; a task
  without one fails the check.
- **DF-8 Agent selection.** Fixture tasks record complexity, risk and capabilities and the agent
  choice derived from them; the verifier differs from the implementer.
- **DF-9 Verification.** Every type workflow ends with a verification phase against the directive's
  criteria; a directive without criteria cannot reach `active`.
- **DF-10 Feedback loop.** A fixture shows result → failed verification → feedback → directive
  refinement → new task, through dl-012's workflows.
- **DF-11 Not rigid.** A second fixture renames the levels and types and drops two optional
  sections, using parameters and `custom/` only, and still validates; no pack file names a
  project, a person, an agent product or a model (lint F3.5).
- **DF-12 With the initialization template.** In a dl-011 scenario, Reconfigure WingFoil selects
  `methodology/directive-first` and seeds the project-intent and first strategic directives from
  the project definition.

### D10 — Amendments this decision implies

Applied after approval, under the same follow-up plan as dl-011's and dl-012's, each document
bumped per `doc-versioning`:
- **dl-001 D5, first scope:** gains `methodology/directive-first` (recorded here; dl-001 stays as
  approved);
- **`06_features.md`:** feature **F4.10**, "`methodology/directive-first`: directives drive
  methodology, workflows, agents and verification" (journeys J5, J10; Value H, Effort H,
  Uncertainty **H**: hierarchy and dispatch without a workflow engine, the directive type's name);
- **`07_sequencer.md`:** F4.10 joins **W10** (methodologies), after `governance/feedback` (W9) which
  it requires; W10 then holds three features with one of high uncertainty. Alternative for the
  approver: dl-011, dl-012 and dl-013 together in a wave after M3, which leaves the MVP as approved;
- **`08_mvp-canvas.md`:** the MVP content gains the pack, if it joins W10;
- **feedback notes** to WingFoil (`wingfoil-cli` rule 3), written when the charter is accepted:
  (1) directives as first-class elements: hierarchy, inheritance, authority, life cycle,
  verification, conflict detection; (2) the `.wingfoil/` layout of the definition (`methodologies/`,
  `agents/`, `checks/`, `project/`); (3) dispatch of a workflow by an element field (relates
  F-018); (4) agent and model selection from task complexity, risk and capabilities (relates F-009).
  WingFoil decides through its own process (dl-001 D6).

Configuration changes of this repository's `.wingfoil/`: none. This repository does not adopt the
methodology; its `methodology` stays Kanban.

### D11 — Elements opened later

Through `sw-life-cycle` › `pack-delivery` › `pack-cycle`:
- **pack charter** `pack-methodology-directive-first`, with D1–D9 as scope and acceptance;
- **`design` phase: required.** A tech-spec (or a spec-001 amendment) for the directive model: the
  type's fields and name, the hierarchy and conflict rules as checkable properties, the type → workflow
  map, the materialization of active directives into WingFoil directive files;
- **tasks** (`author` phase, `pack: pack-methodology-directive-first`), proposed:
  1. the directive Memory type, its life cycle and template (DF-3);
  2. `directive-governance`: hierarchy, inheritance, authority, conflict procedure (DF-4, DF-5);
  3. `directive-methodology` and the type map; the delivery workflow and the `general`, `ui`,
     `infrastructure` type workflows (DF-6);
  4. the `task` tightening (`directive`, `complexity`, `risk`, `capabilities`) and the traceability
     checks (DF-7);
  5. `agent-selection` and the roles fragment (implementer, verifier, directive owner) (DF-8);
  6. verification phases and the gate on criteria (DF-9);
  7. the feedback outcomes through dl-012's parameters (DF-10);
  8. fixtures: five-level chain, conflict, dispatch, renamed terminology (DF-1, DF-2, DF-4 … DF-11);
  9. the README with the definition and the operating principle, and the adoption by hand (F6.1);
- **a preset** `directive-first` (F2.6): `base` + `governance/feedback` +
  `methodology/directive-first` (+ `phase/inception/guided-init` if dl-011 is approved, whose intent
  phase becomes the project-intent directive, DF-12);
- **later, option (c):** a `governance/directive-hierarchy` pack split out of this one, when a
  Scrum or Kanban project asks for the governance level alone;
- **the feedback notes** of D10.

## Execution Notes

- Captured 2026-10-09 under plan-020, on the approver's request in chat; no implementation in this
  step.
- Open for the approver at the ruling: option (a) vs (c) now; the directive type's name; whether
  feedback is required (D1) or only recommended; W10 or a wave after M3.
