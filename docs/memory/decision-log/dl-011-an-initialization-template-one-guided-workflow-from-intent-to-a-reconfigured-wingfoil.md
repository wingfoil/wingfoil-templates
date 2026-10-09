---
id: dl-011-an-initialization-template-one-guided-workflow-from-intent-to-a-reconfigured-wingfoil
type: decision-log
title: "An initialization template: one guided workflow from intent to a reconfigured WingFoil"
status: draft
tags: ["packs","scope","inception","adoption"]
---

## Context

On 2026-10-09 the approver asked, in chat, for a new capability of this repository: an
**initialization template** for the guided bootstrap of new WingFoil projects. The request, in
short:
- **one single guided workflow**, starting from the user's intent;
- questions asked progressively, **adapted to the answers already collected**, not a rigid,
  universal questionnaire;
- the information collected covers at least: intent and goals; users and scenarios; business
  logic; features; policies and regulations; development method and process; team and roles;
  technology stack; architecture; infrastructure and tools; QA, testing and validation; expected
  results; success criteria; constraints and dependencies;
- the workflow produces a **structured initial project definition**;
- its **last step is explicitly "Reconfigure WingFoil"**: the definition is used to configure the
  project's governance (agents and roles, directives, workflows, checks and gates, tools, QA and
  validation, any other element the governance needs);
- the template must **demonstrate the cycle Intent → Questions → Project Definition → WingFoil
  Configuration → Execution**, and the resulting configuration must not be a rigid method: it lets
  WingFoil adapt to the nature of the project.

The approver asked that the request enter the normal governance processes (plan-020) and that no
software be implemented in this step.

What already exists:
- the Adopter's goal is "a working process in one `init` that fits the team and the project"
  (`04_personas.md`, Persona 1); J6 starts a project **from a preset**, which presumes the adopter
  already knows which packs fit (`05_journeys.md`);
- WingFoil's `init` asks one question (feedback note F-006), and nothing updates the configuration
  after `init` (F-007; WingFoil dl-138 Q2). Both are WingFoil's to solve: this repository is not the
  CLI (`03_is-isnot.md`, IS NOT);
- the pack model has a `phase/<slot>` axis whose `inception` slot is filled by a phase pack shipping
  a workflow named `inception` (dl-001 D1, dl-003 D4 and D11; spec-001). The first scope has one
  inception method, `lean-inception` (dl-001 D5), which frames a product but does not touch the
  governance;
- declaring which method a phase follows is deferred (dl-007, F-016): a pack spells its method out
  in its own directives and templates.

## Options

**Where the capability lives.**

- **(a) A phase pack filling the `inception` slot**, e.g. `phase/inception/guided-init`.
  - For: it uses a mechanism spec-001 already has (slot replacement), so no format change and no
    schema change; the slot is the first phase of `sw-life-cycle`, so the phases after it
    (`specification`, `delivery`) are the **Execution** of the cycle, run under the configuration
    the pack produced; it is optional, as a method should be.
  - Against: the slot takes one pack, so it excludes `lean-inception` in the same composition
    (the Reconfigure phase can still recommend a product-framing method for later); it needs a
    methodology at `init` (cardinality exactly one), before the questions say which one fits (see
    the bootstrap preset below).
- **(b) The default `inception` of `base`.**
  - For: every project gets it.
  - Against: `base` must stay minimal and names no method (dl-003 D2, D11); it waits for the v0.3
    formats (dl-003 D9), so the capability would wait for the same gate and grow `base`'s first
    release.
- **(c) A new axis or pack kind (`bootstrap`) outside the slots.**
  - Against: an axis is a choice between alternatives (dl-003, option 1); it needs a spec-001
    amendment and a schema change, hence a feedback note (wingfoil-cli rule 8), for no gain over
    (a).
- **(d) A WingFoil CLI feature only** (an `init` wizard, F-006).
  - Against: question logic and governance mapping are process content, which is this repository's
    product; the CLI wizard of F-006 and this pack are complementary: the wizard picks packs, the
    pack asks about the project.

**How Reconfigure WingFoil changes the configuration** before the CLI can.

- **(i) Through the CLI verbs when they exist** (`pack add`, `pack remove`, `upgrade`, F-007,
  WingFoil v0.4) and, until then, by a reconfiguration plan applied by hand in the project's
  `.wingfoil/` (`custom/`, `dna.yaml`, `roles.yaml`, `workflows.yaml`), validated with the pinned
  WingFoil. The pack ships the procedure, not the tool.
- **(ii) A reconfiguration script in the pack.** Against: a pack ships no executable logic (IS NOT:
  the CLI, the resolver, the installer).

## Decision

**Proposed: option (a) with (i)**, captured as proposed with plan-020 on 2026-10-09. The approver
rules at `memory approve`.

### D1 — The capability

A phase pack, proposed name **`phase/inception/guided-init`** (pack id `pack-phase-guided-init`;
the name is the approver's to confirm). It ships **one workflow, `inception`**, whose phases run in
this order:

1. **`intent`** — the user states the intent in their own words; the agent restates goal, scope
   and the first assumptions; the approver confirms the restatement.
2. **`discover`** — adaptive questioning, in rounds. A **coverage map** lists the areas of D2; each
   round picks the next questions from what is already known (rules of D3), records answers,
   assumptions and open questions, and updates the map. It ends when every area is *covered* or
   *not applicable, with a reason*, and no open question blocks the definition.
3. **`define`** — the agent writes the **project definition** (D4); the approver approves it
   (gate) or sends it back to `discover`.
4. **`reconfigure-wingfoil`** — **Reconfigure WingFoil**, always the last phase. From the approved
   definition the agent derives a **reconfiguration proposal**: every configuration change, each
   traced to the definition item that motivates it (D5). The proposal is recorded as a
   decision-log in the project's own Memory, the approver approves it (gate), the agent applies it
   and validates the result with the pinned WingFoil. The workflow then hands off to the next phase
   of the project's `sw-life-cycle`, which runs under the new configuration: that is the
   **Execution** step of the cycle.

The method (how questions are chosen, when an area counts as covered) is spelled out in a directive
of the pack, bound to the role that runs the phases, until WingFoil lets a phase declare its method
(dl-007, F-016).

### D2 — The areas the questions cover

At least these fourteen, each with its purpose and the configuration elements it can change:

| # | Area | Feeds (examples) |
|---|---|---|
| A1 | Intent and goals | `dna.yaml` `project.description`, `north_star` |
| A2 | Users and scenarios | journeys, acceptance style of tasks |
| A3 | Business logic | domain Memory types, domain directives |
| A4 | Features | first backlog, blueprint choice |
| A5 | Policies and regulations | `governance` packs (by geographic area, dl-001 D8), compliance gates |
| A6 | Development method and process | `methodology`, `phase/<slot>` packs, `stage` |
| A7 | Team and roles | `dna.yaml` `team` (members, roles, agents and their `executes_as`), `team-mode`, approval roles |
| A8 | Technology stack | `dna.yaml` `stacks`, `blueprint` |
| A9 | Architecture | `dna.yaml` `modules`, architecture directives, ADR use |
| A10 | Infrastructure and tools | `dna.yaml` `stacks` (tools), CI expectations, `stage` |
| A11 | QA, testing and validation | testing and review directives, workflow `checks`, gates |
| A12 | Expected results | release slot, success metrics in the definition |
| A13 | Success criteria | gates and acceptance criteria, retrospective inputs |
| A14 | Constraints and dependencies | `requires`/`conflicts` of chosen packs, risks, external dependencies |

Areas are not asked in a fixed order and not every question applies to every project.

### D3 — Adaptive questioning

The pack ships a **question bank**, generic and free of project values: per area, its purpose, seed
questions, and for each question when to ask it, when to skip it and when to go deeper, stated as
conditions on earlier answers (for example: a solo developer skips approval-delegation questions; a
regulated domain opens the policies area in depth; "no automated tests yet" opens the QA area).
The agent may ask questions that are not in the bank when the answers call for them, and records
them in the definition. The bank and the rules are content, not code.

### D4 — The project definition

One document in the project, from a template the pack ships (path a parameter with a default), with
one section per area of D2 (content, or *not applicable* with the reason), the assumptions, the
open questions with their owner, and a traceability table answer → section. It is the input of
`reconfigure-wingfoil` and the first approved artifact of the project.

### D5 — Reconfigure WingFoil

The reconfiguration proposal covers, as the definition requires:
- the **packs**: one per axis where an axis applies (methodology, team-mode, phase slots,
  blueprints, stage, governance), their parameters, and installable governance packs such as the
  feedback pack (dl-012); the **initialization template treats installable packs as part of the
  initial configuration**;
- **agents and roles** (`dna.yaml` `team`, `roles.yaml` assignments), with agents never holding
  approval authority;
- **directives** (project `custom/` directives for domain rules), **workflows** and their
  **checks and gates**, **tools** (`dna.yaml` `stacks`), **QA and validation**;
- for every change, the definition item it traces to, and what was *not* configured and why.

Rules:
- the result only **adds to or tightens** what `base` and the chosen packs ship (dl-003 D1); the
  project's own changes go to `custom/`, never to `built-in/` (`pack-authoring`);
- no fixed methodology: the methodology is a choice the answers lead to, among the catalog's;
- before WingFoil installs packs (v0.4), packs are added by hand following the pack READMEs (F6.1)
  and the reference composer; from v0.4, through the CLI verbs (F-007). The pack never ships
  executable logic;
- the reconfigured `.wingfoil/` validates as the compatibility matrix defines it: `workflow list`,
  `dna show` and `directives list`, exit 0 and no warning (F3.3).

### D6 — The bootstrap preset

`init` needs exactly one methodology before the questions run. Proposed: a preset **`bootstrap`**
= `base` + `methodology/kanban` + `phase/inception/guided-init`. Reconfigure WingFoil may then keep
Kanban or replace it. Open for the approver: this preset, or a different default methodology.

### D7 — Acceptance criteria of the capability

Carried into the pack charter and the tasks of D9. Each is checked on fixtures under
`tests/fixtures/` (dna.yaml `paths.tests`) by the validation command, or by the approver where
stated.

- **AC-1 One workflow.** The pack ships exactly one workflow, `inception`, with the phases
  `intent`, `discover`, `define`, `reconfigure-wingfoil` in this order; `reconfigure-wingfoil` is the
  last phase and its description names "Reconfigure WingFoil". Composed with `base` and a
  methodology it validates with the pinned WingFoil (F3.3) and composes deterministically (F3.4).
- **AC-2 Coverage.** The question bank has an entry for each of A1–A14; every entry has a purpose,
  seed questions and the configuration elements it feeds; a check fails if an area is missing.
- **AC-3 Adaptivity.** At least two fixture scenarios with different intents (proposed: a solo
  developer's CLI library; a team's regulated web service) follow the method and ask **different
  question sets**: each records which questions were asked, skipped or added, and why.
- **AC-4 Definition.** For each scenario the project definition has a section for every area,
  filled or *not applicable* with a reason, and every section traces to answers. The `define`
  phase has an approver gate.
- **AC-5 Reconfigure WingFoil.** For each scenario the reconfiguration proposal lists every change
  with its trace to the definition, and covers packs, agents and roles, directives, workflows,
  checks and gates, tools, QA and validation (or says why an element is unchanged). The phase has an
  approver gate before anything is applied.
- **AC-6 Adapted, not rigid.** The two scenarios end in **different** configurations (at least a
  different methodology or team mode, and different directives or gates), both validating with exit
  0 and no warning, both only adding to or tightening `base`.
- **AC-7 Execution.** For each scenario the first plan of the next `sw-life-cycle` phase is written
  under the reconfigured configuration and names it: the fixture shows Intent → Questions →
  Project Definition → WingFoil Configuration → Execution end to end.
- **AC-8 No project values, no code.** The pack carries no project's names, paths, people or
  versions (parameters only) and no executable logic; lint (F3.5) passes.
- **AC-9 Approval.** Every gate is the approver's; no phase lets an agent approve.

### D8 — Amendments this decision implies

Applied after approval, under a follow-up plan, each document bumped per `doc-versioning`:
- **dl-001 D5 / dl-003 D7, first scope:** gains `phase/inception/guided-init` (recorded by this
  decision-log; dl-001 and dl-003 stay as approved);
- **`06_features.md`:** a feature **F4.8**, "`phase/inception/guided-init`: one guided workflow
  from intent to a reconfigured WingFoil" (journey J10; Value H, Effort M, Uncertainty **H**: the
  adaptive method and the reconfiguration before the CLI installs packs); the bootstrap preset
  joins F2.6;
- **`05_journeys.md`:** a journey **J10, "Bootstrap a project from intent"** (Adopter; also the
  non-technical-manager profile), next to J6;
- **`07_sequencer.md`:** F4.8 joins **W11** (phases and blueprints), which then holds three
  features with one of high uncertainty, within the sequencer's rules. Alternative for the
  approver: a wave of its own after M3;
- **`08_mvp-canvas.md`:** the MVP proposal gains the pack and the `bootstrap` preset, if it joins
  W11;
- **feedback note** to WingFoil (`wingfoil-cli` rule 3): the CLI's `init` wizard (F-006) can hand
  over to this workflow, and Reconfigure WingFoil needs the explicit update verbs of F-007; written
  when the charter is accepted.

Configuration changes of this repository's `.wingfoil/`: none.

### D9 — Elements opened later

Through `sw-life-cycle` › `pack-delivery` › `pack-cycle`, when the sequencer reaches the pack:
- **pack charter** `pack-phase-guided-init` (`charter` phase), with D1–D7 as its scope and
  acceptance; `requires: [base@^<major>]`; `conflicts` none (the slot excludes other inception
  packs by itself). No `design` phase: the pack uses only mechanisms spec-001 has (slot workflow,
  directives, Memory templates, parameters);
- **tasks** (`author` phase, `pack: pack-phase-guided-init`), proposed:
  1. the `inception` workflow with its four phases, roles, gates and `produces` (AC-1, AC-9);
  2. the method directive: coverage map, round rules, stop criteria (AC-3);
  3. the question bank for A1–A14 with its conditions (AC-2);
  4. the project-definition template (AC-4);
  5. Reconfigure WingFoil: the mapping area → configuration element, the reconfiguration
     decision-log template, the procedure before and after v0.4, the validation commands (AC-5);
  6. the two end-to-end fixture scenarios and their checks (AC-3 … AC-7);
  7. the pack README (what it adds, how to adopt it by hand, F6.1);
- **the `bootstrap` preset** (F2.6), with the methodology presets of W10;
- **the feedback note** of D8.

## Execution Notes

- Captured 2026-10-09 under plan-020, on the approver's request in chat; no implementation in this
  step.
- Depends on `base` (requires) and on the methodology packs (bootstrap preset); its fixtures can
  use fixture packs before those are published.
- Related: dl-012 (the feedback pack), the first installable governance pack the Reconfigure phase
  can select.
