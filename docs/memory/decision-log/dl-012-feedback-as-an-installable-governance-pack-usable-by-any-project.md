---
id: dl-012-feedback-as-an-installable-governance-pack-usable-by-any-project
type: decision-log
title: "Feedback as an installable governance pack, usable by any project"
status: draft
tags: ["packs","scope","governance","feedback-loop"]
---

## Context

On 2026-10-09 the approver asked, in chat, that the feedback mechanism conceived for the WingFoil
projects become an **installable pack**, usable by third-party projects too. Feedback must not be a
hard-coded capability of the official WingFoil projects. The request, in short:
- the pack gives the projects that install it a reusable, configurable capability to:
  - collect feedback;
  - structure and classify it;
  - make it available to the governance processes;
  - link it to the context that produced it;
  - use it as input for evolutions of the project and/or of its governance;
- it is installed and configured as a component of a WingFoil project, in a flow such as: project
  initialization → choice and configuration of the packs → install the feedback pack → collect
  feedback → processing and governance → evolution of the project;
- it is generic enough for different projects, with no assumption that every project has the same
  methodology or the same artifacts;
- the initialization template (dl-011) must consider installable packs as part of the initial
  configuration, and the feedback pack is the first concrete example of a governance capability
  distributed through a pack;
- no parallel methodology: the existing governance is reused.

The approver asked that the request enter the normal governance processes (plan-020) and that no
software be implemented in this step.

What already exists:
- **dl-003 D6** puts the feedback channel to WingFoil in `governance/wingfoil-dogfood`, because it
  serves only the repositories that dogfood WingFoil. That pack is specific: one target (WingFoil),
  one format, one direction;
- **WingFoil dl-163** (consumer projects' feedback sources) fixes the format of a note sent to
  WingFoil: one file per note, exactly six frontmatter fields, statuses other than `open` set only
  by a sync from what WingFoil published. This repository applies it in `docs/wingfoil-feedback/`
  with the `wingfoil-cli` directive (task-010);
- `base` ships the capture workflows (`bug-ingest`, `decision-log-ingest`, …) and the
  retrospective (dl-003 D2), which are where feedback turns into change;
- the `governance` axis has cardinality "many" (dl-003 D6), so a feedback pack composes with any
  other governance pack.

## Options

- **(a) Status quo.** Feedback stays inside `governance/wingfoil-dogfood`.
  - Against: it is exactly the hard-coded, WingFoil-only capability the request rules out.
- **(b) A generic `governance/feedback` pack; `governance/wingfoil-dogfood` builds on it.**
  - For: one mechanism for every project; WingFoil becomes one configured *upstream* target among
    others (an upstream library, a vendor, a client); the dogfood pack shrinks to its configuration
    and the known behaviours of the pinned CLI; uses only mechanisms spec-001 has (Memory-type
    fragment, workflows, directives, parameters).
  - Against: one more pack in the first scope; `wingfoil-dogfood` gains a `requires`.
- **(c) Feedback in `base`.**
  - For: every project has it.
  - Against: it would no longer be installable or optional; `base` grows and waits for the v0.3
    formats (dl-003 D9); dl-003 D6 already ruled the WingFoil channel out of `base`.
- **(d) Per-methodology feedback** (e.g. in Scrum's sprint review).
  - Against: it assumes a methodology, which the request rules out.

## Decision

**Proposed: option (b)**, captured as proposed with plan-020 on 2026-10-09. The approver rules at
`memory approve`.

### D1 — The capability

A governance pack, proposed name **`governance/feedback`** (pack id `pack-governance-feedback`; the
name is the approver's to confirm), required by nothing but `base`. It ships:

- a **Memory type for feedback** (Memory-type fragment, `memory.yaml`), proposed `feedback`, path
  and id pattern as parameters with defaults. Its state machine has no `waiting` state (dl-003 D3)
  and moves only with the verbs the pinned WingFoil has; proposed:
  `draft → open → triaged (gate: approver) → closed`, the outcome recorded in a field (see D2);
- a **capture workflow** (proposed `feedback-ingest`): record the feedback with its source and
  context, submit it;
- a **triage step** with an approver gate: classify it (D2) and decide the outcome;
- a **review workflow** (proposed `feedback-review`), startable on its own or at the project's
  retrospective: lists triaged feedback and routes each item into the **existing** governance —
  `bug-ingest`, `decision-log-ingest`, a task of the project's methodology, or a note to an
  upstream (D3) — or declines it with a reason;
- a **directive** (proposed `feedback`) with the rules: what counts as feedback, the required
  fields, the trace both ways, who may close an item; bound by a roles fragment to the role that
  captures and to the role that triages;
- a **README** saying what the pack adds and how to adopt it by hand until WingFoil installs packs
  (F6.1).

It ships no executable logic and names no methodology.

### D2 — Structure and classification

Each feedback element records, in frontmatter, with the allowed values as parameters with
defaults:
- `kind` — default `defect | gap | request | observation`;
- `target` — what it is about: default `product | governance | upstream:<name>`;
- `source` — who or what produced it (a person, a role, an agent, a check, a channel);
- `context` — at least one reference to what produced it: a Memory element id, a workflow and
  phase, a commit or a version;
- `outcome` — set at triage or review: `bug | decision-log | task | upstream-note | declined |
  duplicate`, with `resulting` naming the element created.

### D3 — Upstream targets

A project may declare upstream targets (a parameter: name, inbox path, note template). A feedback
item routed to an upstream becomes a note in that upstream's format; the upstream's own rules on
statuses apply to the note. **`governance/wingfoil-dogfood`** becomes `governance/feedback`
configured with the upstream `wingfoil` (WingFoil dl-163 format, `docs/wingfoil-feedback/`, the
`wingfoil-cli` directive) plus the known behaviours of the pinned CLI. The dl-163 format is not
changed: upstream notes and internal feedback elements are distinct files.

### D4 — Relation with the initialization template (dl-011)

`phase/inception/guided-init`'s Reconfigure WingFoil phase treats installable governance packs as
part of the initial configuration. The feedback pack is the first one: the areas QA (A11), success
criteria (A13), users (A2) and constraints and dependencies (A14) decide whether it is proposed,
with which kinds, targets and upstreams. Feedback collected afterwards is an input of later
reconfigurations: that closes the flow initialization → packs → feedback → governance → evolution.

### D5 — Acceptance criteria of the capability

Carried into the pack charter and the tasks of D7. Checked on fixtures under `tests/fixtures/` by
the validation command, or by the approver where stated.

- **FA-1 Installable.** `base` + `governance/feedback` composes with each first-scope methodology
  (`scrum`, `kanban`; fixture methodologies until they are published), with and without
  `team-mode/agent-first` and a blueprint; each composition validates with the pinned WingFoil, exit
  0 and no warning (F3.3), and composes deterministically (F3.4). `requires` names only
  `base@^<major>`; `conflicts` is empty.
- **FA-2 Reusable.** No pack file names WingFoil, a methodology, a project or a person; every path,
  id pattern, kind, target and upstream is a parameter with a default; two fixtures with different
  parameter sets compose and validate (lint F3.5 passes).
- **FA-3 Collect.** The capture workflow creates a feedback element whose required frontmatter
  (`kind`, `target`, `source`, `context`) is enforced by `memory.yaml` and by a workflow `checks`
  entry.
- **FA-4 Classify.** Triage has an approver gate; allowed values come from the parameters; a
  fixture element with a value outside them fails the check.
- **FA-5 Context.** Every feedback element cites at least one context reference that resolves (an
  existing element id, a declared workflow and phase, or a version).
- **FA-6 Available to the governance.** The review workflow routes only into workflows the
  composition declares (`base`'s capture workflows, the methodology's task flow, an upstream); every
  routed item names its `resulting` element, and that element cites the feedback id back
  (`traceability`).
- **FA-7 Evolution.** A fixture shows both paths end to end: feedback → decision-log → a
  configuration change (governance evolution), and feedback → bug or task (product evolution).
- **FA-8 Upstream.** A fixture configures an upstream with the dl-163 note format; the note it
  produces passes the same checks as `tests/wingfoil-feedback.test.ts`. The charter of
  `governance/wingfoil-dogfood` is written as a configuration of this pack.
- **FA-9 With the initialization template.** In at least one dl-011 fixture scenario, Reconfigure
  WingFoil proposes and installs `governance/feedback`, with parameters traced to the project
  definition.

### D6 — Amendments this decision implies

Applied after approval, under the same follow-up plan as dl-011's, each document bumped per
`doc-versioning`:
- **dl-001 D5 / dl-003 D7, first scope:** gains `governance/feedback`; **dl-003 D6** is refined:
  the WingFoil channel stays in `governance/wingfoil-dogfood`, which requires `governance/feedback`
  (recorded by this decision-log; dl-001 and dl-003 stay as approved);
- **`06_features.md`:** a feature **F4.9**, "`governance/feedback`: installable, configurable
  feedback capture, triage and routing into the governance" (journeys J5 and J10; Value H, Effort M,
  Uncertainty M); F4.2's description gains "built on F4.9";
- **`07_sequencer.md`:** F4.9 joins **W9** (dogfood and adoption), before F4.2 which requires it;
  W9 then holds three features, none of high uncertainty, within the sequencer's rules;
- **`08_mvp-canvas.md`:** the MVP's content gains `governance/feedback`;
- **`03_is-isnot.md`:** "Reports to WingFoil" stays; the feedback pack makes the same mechanism
  available to any project, so no IS NOT entry changes.

Configuration changes of this repository's `.wingfoil/`: none now. This repository adopts the pack
with `base` (dl-003 D10), at which point `docs/wingfoil-feedback/` and `wingfoil-cli` are the
configured upstream `wingfoil`; that adoption is planned in W9.

### D7 — Elements opened later

Through `sw-life-cycle` › `pack-delivery` › `pack-cycle`, when the sequencer reaches the pack:
- **pack charter** `pack-governance-feedback` (`charter` phase), with D1–D5 as scope and
  acceptance. No `design` phase: a Memory-type fragment, workflows, directives and parameters are
  spec-001 mechanisms. If the charter finds that routing to "the methodology's task flow" needs a
  name every methodology provides, that is a spec-001 question and opens the `design` phase;
- **tasks** (`author` phase, `pack: pack-governance-feedback`), proposed:
  1. the `feedback` Memory-type fragment, its state machine and its template (FA-3, FA-4);
  2. the capture and triage workflow, with its checks and the approver gate (FA-3, FA-4, FA-5);
  3. the review workflow and its routing into the existing governance (FA-6, FA-7);
  4. the `feedback` directive and the roles fragment; parameters with defaults (FA-2);
  5. upstream targets and the dl-163 upstream fixture (FA-8);
  6. the composition fixtures across methodologies and parameter sets, and the evolution fixture
     (FA-1, FA-2, FA-7);
  7. the pack README (F6.1);
- **`governance/wingfoil-dogfood`'s charter** declares `requires: [base@^<major>,
  feedback@^<major>]` and the upstream `wingfoil` (FA-8);
- **dl-011's fixture scenario** that installs the pack (FA-9), a task of `pack-phase-guided-init`.

## Execution Notes

- Captured 2026-10-09 under plan-020, on the approver's request in chat; no implementation in this
  step.
- Open for the approver at the ruling: the pack name; the state machine of D1 (an alternative keeps
  the outcome as states rather than a field); W9 or a later wave.
