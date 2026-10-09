---
id: dl-011-an-initialization-template-one-guided-workflow-from-intent-to-a-reconfigured-wingfoil
type: decision-log
title: "An initialization template: one guided workflow from intent to a reconfigured WingFoil"
status: pending
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
  (`04_personas.md`, Persona 1, real from WingFoil v0.4); J6 starts a project **from a preset**,
  which presumes the adopter already knows which packs fit (`05_journeys.md`);
- WingFoil's `init` asks one question (feedback note F-006), and nothing updates the configuration
  after `init` (F-007; WingFoil dl-138 Q2). In 0.2.2 a project file in `custom/` overrides a pack
  file only for directives (F-007, WingFoil dl-037), and workflows cannot be patched (spec-001 O6).
  The reference composer composes packs but does not upgrade a project or merge with its own files
  (adr-001; spec-001 §1). This repository is not the CLI (`03_is-isnot.md`, IS NOT);
- the capability `pack-install` ("init, pack add and upgrade install packs from this repository")
  is in this repository's capability vocabulary (spec-001 §12); no released WingFoil provides it
  yet;
- the pack model has a `phase/<slot>` axis whose `inception` slot is filled by a phase pack shipping
  `workflows/inception.yaml` with `name: inception`, `kind: sub` (dl-001 D1, dl-003 D4 and D11;
  spec-001 §9). The first scope has one inception method, `lean-inception` (dl-001 D5), which frames
  a product but does not touch the governance;
- declaring which method a phase follows is pending (dl-007, F-016): a pack spells its method out
  in its own directives.

## Options

**Where the capability lives.**

- **(a) A phase pack filling the `inception` slot**, `phase/inception/guided-init`.
  - For: it uses mechanisms spec-001 already has (slot replacement, a Memory-type fragment,
    directives, parameters), so no format change and no schema change; the slot is the first phase
    of `sw-life-cycle`, so the phases after it (`specification`, `delivery`) are the **Execution**
    of the cycle, run under the configuration the pack produced; it is optional, as a method should
    be.
  - Against: the slot takes one pack, so it excludes `lean-inception` in the same composition (the
    Reconfigure phase can still recommend a product-framing method for later); it needs a
    methodology at `init` (cardinality exactly one), before the questions say which one fits (D6).
- **(b) The default `inception` of `base`.**
  - Against: `base` must stay minimal and names no method (dl-003 D2, D11); the capability would
    become mandatory for every project instead of a choice.
- **(c) A new axis or pack kind (`bootstrap`) outside the slots.**
  - Against: an axis is a choice between alternatives (dl-003, option 1); it needs a spec-001
    amendment and a schema change, hence a feedback note (wingfoil-cli rule 8), for no gain over
    (a).
- **(d) A WingFoil CLI feature only** (an `init` wizard, F-006).
  - Against: question logic and governance mapping are process content, which is this repository's
    product. The CLI wizard of F-006 and this pack are complementary: the wizard picks packs, the
    pack asks about the project.

**When the pack is published, given that Reconfigure WingFoil changes the pack set.**

- **(i) Version 1 requires the `pack-install` capability** and is published only once `compat.yaml`
  lists a released WingFoil that provides it. Reconfigure applies the pack set through the CLI's
  verbs.
  - For: it fits M3 ("ready when WingFoil v0.4 installs packs") and the Adopter's horizon; the pack
    ships no procedure that the CLI will replace.
  - Against: the pack waits for WingFoil; until then it lives only in fixtures.
- **(ii) Version 1 ships a recompose procedure** (rebuild `.wingfoil/` from the pack set and the
  parameters), and a later major adds the CLI path.
  - Against: a hand procedure in a pack that the CLI makes obsolete (`03_is-isnot.md`: not a
    manual); adding `requires_capabilities` later is a major bump (`pack-semver`).

## Decision

**Proposed: (a) with (i)**, captured with plan-020 on 2026-10-09; option (i) was chosen by the
approver in chat on 2026-10-09 after the independent review. The approver rules at
`memory approve`.

### D1 — The capability

A phase pack, catalog id **`phase/inception/guided-init`** (Memory element
`pack-phase-guided-init`; the name is the approver's to confirm), `requires: [base@^<major>]`,
`requires_capabilities: [pack-install]`. It ships:
- `workflows/inception.yaml`, **`name: inception`, `kind: sub`**, the single guided workflow;
- a `fragments/memory.yaml` defining the type **`project-definition`** (path and id pattern as
  parameters with defaults; states `draft → pending → approved`, gate on `pending`, reject to
  `draft`) and its Memory template;
- directives: the **method** (`guided-init-method`: coverage map, round rules, stop criteria, the
  Reconfigure rules of D5) and the **question bank** (`guided-init-questions`, D3), both bound to
  the role that runs the phases;
- `README.md` and `CHANGELOG.md`.

The workflow's phases, each with its `role`, `actions` and `produces` (`pack-authoring`: no empty
phase):

1. **`intent`** — the user states the intent in their own words; the agent restates goal, scope and
   first assumptions and opens the `project-definition` element in `draft` with them. The
   approver's confirmation of the restatement is recorded in the element; it is not a gate.
2. **`discover`** — adaptive questioning, in rounds (D3). The **coverage map** (one row per area of
   D2: covered / not applicable with reason / open) and the **question log** (asked, skipped, added,
   and why) are sections of the draft definition. The phase ends when every area is covered or not
   applicable, and no open question blocks the definition.
3. **`define`** — the agent completes the project definition (D4) and submits it; **gate**: the
   approver approves it (`pending → approved`) or rejects it back to `draft` and `discover`.
4. **`reconfigure-wingfoil`** — **Reconfigure WingFoil**, always the last phase (D5). The
   reconfiguration proposal is a `decision-log` (a `base` type) whose required sections the method
   directive states; **gate**: the approver approves it; the agent applies it and validates the
   result. The workflow then hands off to the next phase of the project's `sw-life-cycle`, which
   runs under the new configuration: the **Execution** step of the cycle.

Roles: the phases use roles `base` ships (expected: a facilitator role runs them, the approver gates
them); if `base`'s charter names them differently, the pack takes role names as `string`
parameters (spec-001 §8.2). The method is declared as a house method in the README until WingFoil
lets a phase declare it (dl-007, F-016), with the README listing its sources and adaptations.

### D2 — The areas the questions cover

At least these fourteen, each with its purpose and the configuration elements it can change:

| # | Area | Feeds (examples) |
|---|---|---|
| A1 | Intent and goals | `dna.yaml` `project.description`, `north_star` |
| A2 | Users and scenarios | journeys, acceptance style of tasks |
| A3 | Business logic | domain Memory types, domain directives |
| A4 | Features | first backlog, blueprint choice |
| A5 | Policies and regulations | `governance` packs (by geographic area, dl-001 D8), compliance gates |
| A6 | Development method and process | `methodology`, `phase/<slot>` packs |
| A7 | Team and roles | `dna.yaml` `team` (members, roles, agents and their `executes_as`), `team-mode`, approval roles |
| A8 | Technology stack | `dna.yaml` `stacks`, `blueprint` |
| A9 | Architecture | `dna.yaml` `modules`, architecture directives, ADR use |
| A10 | Infrastructure and tools | `dna.yaml` `stacks` (tools), CI expectations |
| A11 | QA, testing and validation | testing and review directives, Memory gates, governance packs such as feedback (dl-012) |
| A12 | Expected results and maturity | the project's maturity and horizon → `stage`; the release slot |
| A13 | Success criteria | gates and acceptance criteria, retrospective inputs |
| A14 | Constraints and dependencies | `requires`/`conflicts` of chosen packs, risks, external dependencies |

Areas are not asked in a fixed order and not every question applies to every project.

### D3 — Adaptive questioning

The question bank is a directive, generic and free of project values: per area, its purpose, seed
questions, and for each question when to ask it, when to skip it and when to go deeper, stated as
conditions on earlier answers (for example: a solo developer skips approval-delegation questions; a
regulated domain opens the policies area in depth; "no automated tests yet" opens the QA area). The
agent may ask questions that are not in the bank when the answers call for them, and logs them. The
bank and the rules are content, not code.

### D4 — The project definition

A `project-definition` element (D1), from the pack's template, with one section per area of D2
(content, or *not applicable* with the reason), the coverage map, the question log, the
assumptions, the open questions with their owner, and a traceability table answer → section. It is
the input of `reconfigure-wingfoil` and the first approved artifact of the project.

### D5 — Reconfigure WingFoil

**What it decides.** From the approved definition, the proposal records:
- the **pack set**: one pack per axis where an axis applies (methodology, team-mode, phase slots,
  blueprints, stage, governance), installable governance packs such as `governance/feedback`
  (dl-012) — **installable packs are part of the initial configuration** — and every pack's
  **parameter values**. This set and these values are the record of how the configuration was made
  (a lock substitute until WingFoil has one, F-005);
- **agents and roles** (`dna.yaml` `team`, `roles.yaml` assignments), agents never holding approval
  authority;
- **directives** (project directives for domain rules), **workflows**, **Memory types, states and
  gates**, **checks**, **tools** (`dna.yaml` `stacks`), **QA and validation**;
- the **initial Memory elements** the selected packs' READMEs ask for (for example the first
  directives of `methodology/directive-first`, dl-013);
- for every change, the definition item it traces to; and what was *not* configured, and why.

**How it is applied.** Through the CLI's verbs for the pack set (option (i)). The project's own
additions use only what WingFoil defines for project files: directives in `custom/` (which override
a pack directive with the same id), new workflows in `custom/` under new names, included from
`workflows.yaml`, and the project values of `dna.yaml` and `roles.yaml`. Nothing in `built-in/` is
edited. What cannot be configured this way while WingFoil lacks a general `custom/` precedence (for
example a tighter gate on a pack's workflow) is listed in the proposal as *not configured*, and in
the feedback note of D8.

**Rules.**
- The result only adds to or tightens what `base` and the chosen packs ship (dl-003 D1).
- No fixed methodology: the methodology is a choice the answers lead to, among the catalog's.
- A change of a Memory path parameter keeps or moves the elements already written under the
  bootstrap paths (the definition and the proposal).
- `guided-init` stays in the composition: `inception` has run, and the method directive is what
  later reconfigurations follow. Later reconfigurations (for example from feedback, dl-012) run
  through `base`'s `decision-log-ingest`, by the same rules; `inception` is not re-run.
- The pack ships no executable logic.

### D6 — The bootstrap preset

`init` needs exactly one methodology before the questions run. Proposed: a preset **`bootstrap`**
= `base` + `methodology/kanban` + `phase/inception/guided-init`; Reconfigure WingFoil may keep
Kanban or replace it. The preset is part of F4.8 and is delivered with the pack in W11 (it cannot
be validated before the pack exists, spec-001 §15). Open for the approver: this preset, or another
default methodology.

### D7 — Acceptance criteria of the capability

Each criterion says who checks it: **[V]** the validation command or a test under `tests/` (the
pack-specific tests are owned by the pack's tasks); **[E]** the fixture-element checks of dl-012 D8
(a tooling capability shared with dl-012 and dl-013); **[A]** the approver. Fixtures live under
`tests/fixtures/examples/guided-init/<scenario>/` (dl-014) and run in the matrix's self-test mode
(dl-009) while no released WingFoil accepts the `format:` key.

- **AC-1 One workflow [V].** The pack ships exactly one workflow, `inception` (`kind: sub`), with the
  phases `intent`, `discover`, `define`, `reconfigure-wingfoil` in this order, each with role,
  actions and produces; `reconfigure-wingfoil` is last and its description names "Reconfigure
  WingFoil". Composed with `base` and a methodology it validates (F3.3) and composes
  deterministically (F3.4).
- **AC-2 Coverage [V].** The question bank has an entry for each of A1–A14, each with a purpose,
  seed questions and the configuration elements it feeds; a test fails if an area is missing.
- **AC-3 Adaptivity [A].** Two scenarios with different intents (proposed: a solo developer's CLI
  library; a team's regulated web service) are each run live once, following the method; the
  recorded question logs show different questions asked, skipped or added, with reasons; the
  approver reviews both runs. A WingFoil2-Benchmark scenario may later measure this.
- **AC-4 Definition [E][A].** Each scenario's definition has a section for every area, filled or
  *not applicable* with a reason [E]; its traces to answers are judged by the approver [A]; the
  `define` gate is the approver's.
- **AC-5 Reconfigure WingFoil [E][A].** Each scenario's proposal lists the pack set and parameter
  values, every change with its trace, and covers packs, agents and roles, directives, workflows,
  Memory types and gates, checks, tools, QA and validation, initial elements, or says why an element
  is unchanged [E]; the approver approves it before anything is applied [A].
- **AC-6 Adapted, not rigid [V].** The two scenarios end in **different** configurations (at least
  a different methodology or team mode, and different directives or gates). For each, the test
  recomposes from the recorded pack set and parameters, diffs the result against the fixture's
  `.wingfoil/`, and allows only the project additions D5 permits; both validate.
- **AC-7 Execution [A].** For each scenario the first plan of the next `sw-life-cycle` phase is
  written under the reconfigured configuration and cites the approved proposal and the pack set it
  runs under: Intent → Questions → Project Definition → WingFoil Configuration → Execution end to
  end.
- **AC-8 No project values, no code [V].** The pack carries no project's names, paths, people or
  versions (parameters only) and no executable logic; the F3.5 lint rules pass.
- **AC-9 Approval [V].** Every gate of the workflow and of `project-definition` is the approver's;
  no phase lets an agent approve.
- **AC-10 With the feedback pack [E][A].** One scenario's Reconfigure proposes and installs
  `governance/feedback` (dl-012), with parameters traced to the definition (formerly dl-012 FA-9).
  Verified at `guided-init`'s first release, since the feedback pack is published earlier (W9).

### D8 — Amendments this decision implies

Applied after approval, under the follow-up plan of plan-020, each document bumped per
`doc-versioning`:
- **dl-001 D5 / dl-003 D7, first scope:** gains `phase/inception/guided-init` (recorded by this
  decision-log; dl-001 and dl-003 stay as approved). Per dl-001 D7 the pack enters the official
  catalog with a maintained line; the approver confirms the commitment at the charter;
- **`06_features.md`:** feature **F4.8**, "`phase/inception/guided-init`: one guided workflow from
  intent to a reconfigured WingFoil, with the `bootstrap` preset" (journey J10; Value H, Effort M,
  Uncertainty **H**: the adaptive method and the reconfiguration);
- **`05_journeys.md`:** journey **J10, "Bootstrap a project from intent"** (Adopter; also the
  non-technical-manager profile; priority v0.4), next to J6;
- **`07_sequencer.md`:** F4.8 joins **W11** (phases and blueprints), which then holds three features
  with one of high uncertainty, within the sequencer's rules; the M3 row's feature count follows;
- **`08_mvp-canvas.md`:** the MVP proposal gains the pack and the `bootstrap` preset; the feature
  count (32) and the "Main uncertainty" list (W11) follow;
- **feedback note** to WingFoil (`wingfoil-cli` rule 3), written when the charter is accepted: the
  CLI's `init` wizard (F-006) can hand over to this workflow; Reconfigure WingFoil needs the
  explicit update verbs of F-007 and a `custom/` precedence beyond directives; the list of what
  cannot be configured today (D5).

Configuration changes of this repository's `.wingfoil/`: none.

### D9 — Elements opened later

Through `sw-life-cycle` › `pack-delivery` › `pack-cycle`, when the sequencer reaches the pack:
- **pack charter** `pack-phase-guided-init` (`charter` phase), with D1–D7 as scope and acceptance;
  its README follows dl-014 D1 if approved, otherwise spec-001 §6.1. No `design` phase: a slot
  workflow, a Memory-type fragment, directives and parameters are spec-001 mechanisms;
- **tasks** (`author` phase, `pack: pack-phase-guided-init`), proposed:
  1. the `inception` workflow with its four phases, roles, actions, gates and `produces` (AC-1,
     AC-9);
  2. the `project-definition` type, its states and template (AC-4);
  3. the method directive: coverage map, question log, round rules, stop criteria, Reconfigure rules
     and the required sections of the proposal (AC-3, AC-5);
  4. the question bank directive for A1–A14 with its conditions (AC-2);
  5. the pack-specific tests (AC-1, AC-2, AC-6, AC-8, AC-9);
  6. the two scenarios as fixtures, their live runs and records, including the feedback-pack
     scenario (AC-3 … AC-7, AC-10);
  7. the `bootstrap` preset (D6);
  8. the pack README, whose examples are the scenarios (dl-014 D1);
- **the feedback note** of D8.

## Execution Notes

- Captured 2026-10-09 under plan-020, on the approver's request in chat; no implementation in this
  step.
- Depends on `base` (requires) and on `methodology/kanban` (preset); published only when a released
  WingFoil provides `pack-install` (option (i)). Its fixtures can use fixture packs before then.
- Related: dl-012 (the feedback pack, AC-10), dl-013 (initial directives seeded by Reconfigure),
  dl-014 (README standard, fixture layout).
- 2026-10-09: amended while `pending` after an independent review, as the approver asked:
  Reconfigure WingFoil defined as a pack set plus parameters applied through the CLI, with project
  additions limited to what WingFoil 0.2.2 defines (review N1); publication gated on
  `pack-install`, option (i), chosen by the approver in chat (N2); the `project-definition` type,
  the question bank as a directive and the proposal as `base`'s `decision-log` (N3); acceptance
  criteria tagged by checker, self-test mode, the AC-6 recompose-and-diff check (N4); the bootstrap
  preset moved to W11 (N5); Memory types, gates and initial elements in Reconfigure (N6); later
  reconfigurations and the pack's place after `inception` (N7); phase declarations and roles (N8);
  option (b)'s argument corrected (N9); citations, dl-007 house method and dl-001 D7 (N10); AC-10
  moved here from dl-012 FA-9 (N11); maturity → `stage` (N12); `kind: sub`, AC-7, MVP canvas and J10
  priority (N13).
