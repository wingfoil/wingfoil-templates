---
id: dl-012-feedback-as-an-installable-governance-pack-usable-by-any-project
type: decision-log
title: "Feedback as an installable governance pack, usable by any project"
status: pending
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
  serves only the repositories that dogfood WingFoil: one target (WingFoil), one format, one
  direction. task-010 (approved) later recorded that "`base` will ship `wingfoil-cli` and the README
  skeleton" instead of the old `wingfoil-feedback` directive; dl-022 S5 settled it: the WingFoil
  CLI rules and the feedback inbox stay in `governance/wingfoil-dogfood`;
- **WingFoil dl-163** (consumer projects' feedback sources) fixes the format of a note sent to
  WingFoil: one file per note, exactly six frontmatter fields, statuses other than `open` set only
  by a sync from what WingFoil published. This repository applies it in `docs/wingfoil-feedback/`
  with the `wingfoil-cli` directive, whose rules 1–7 are kept word for word across the feedback
  sources (task-010);
- `base` ships `decision-log-ingest`, `retrospective` and `governance-evolution`, the last for any
  change of the project's governance (dl-022 S2, S4); `bug-ingest` and `adr-ingest` are
  `software`'s (dl-022 S3), present only in a composition with `software`. These are where
  feedback turns into change. `retrospective` is not a slot and no other pack may change it
  (spec-001 §9, O6);
- the `governance` axis has cardinality "many" (dl-003 D6) and is composed after `software`, the
  methodology, the phase and the blueprint packs (spec-001 §7.1), so only `governance`,
  `team-mode` and `stage` packs may require a governance pack (only `team-mode` and `stage` may
  name one in a conditional entry's `with`, §6.5); a pack that does not require `software` may
  carry an entry `with: software@^1` (§6.5);
- the parameter types are scalar only (`string`, `integer`, `boolean`, `path`, `pattern`, §8.1),
  in format 2 of `pack.yaml` as in format 1, each parameter declared by one pack and set only by a
  default, a preset or the composition; `memory.yaml` has `fields`, `lists` and
  `not_applicable_allowed` (§7.5) but no allowed-values key; WingFoil 0.3.2 executes workflows
  (`compat.yaml`: `workflow-engine`) and checks required frontmatter fields at `submit`; whether it
  evaluates a workflow's `checks` strings is re-checked in the design phase (D8). The validation
  command checks packs and compositions, not Memory elements.

## Options

- **(a) Status quo.** Feedback stays inside `governance/wingfoil-dogfood`.
  - Against: it is exactly the hard-coded, WingFoil-only capability the request rules out.
- **(b) A generic `governance/feedback` pack; `governance/wingfoil-dogfood` requires it and adds
  the WingFoil channel.**
  - For: one mechanism for every project; WingFoil becomes one *upstream* among others (an upstream
    library, a vendor, a client), each added by its own pack; the dogfood pack shrinks to the
    WingFoil channel and the known behaviours of the pinned CLI.
  - Against: one more pack in the first scope; the format needs a few extensions (D8 design phase).
- **(c) Feedback in `base`.**
  - Against: it would no longer be installable or optional; dl-003 D6 already ruled the WingFoil
    channel out of `base`; `base` must stay minimal.
- **(d) Per-methodology feedback** (e.g. in Scrum's sprint review).
  - Against: it assumes a methodology, which the request rules out.

## Decision

**Proposed: option (b)**, captured as proposed with plan-020 on 2026-10-09. The approver rules at
`memory approve`.

### D1 — The capability

A governance pack, catalog id **`governance/feedback`** (Memory element `pack-governance-feedback`;
the name is the approver's to confirm). It **requires nothing but `base`** (`base@^2`, with
`requires_capabilities: [workflow-engine]` as every published pack); `conflicts` is empty. What
uses `software` is in one conditional entry, `with: software@^1` (spec-001 §6.5; D3). It ships:
- a `fragments/memory.yaml` defining the type **`feedback`** (path and id pattern as parameters
  with defaults) and its Memory template. States, with `base`'s names where they exist (dl-022 S2,
  dl-015: the default machine `draft → pending → approved`) and no `waiting` state (dl-003 D3):
  - `sequence: [draft, pending, triaged, closed]`, `gates: { pending: { reject: draft } }`;
  - `draft → pending`: `submit` by the capturing role, once source and context are recorded;
  - `pending → triaged`: `approve` by the approver — the **triage**: classification confirmed and
    outcome decided (D2);
  - `triaged → closed`: `submit` by the facilitating role, once the routed element exists and is
    named in `resulting` (D3), or the outcome is `declined` / `duplicate` with its reason;
  - `memory deprecate` withdraws an item captured by mistake;
- a **capture workflow** (proposed `feedback-ingest`): capture → triage gate;
- a **review workflow** (proposed `feedback-review`), startable on its own at the cadence the
  project chooses: lists triaged items and routes each one (D3), then closes it;
- a **directive** (proposed `feedback`): what counts as feedback, the required fields, the
  classification rules, the routing table, the trace both ways, who may close an item. Being
  unconditional, it never names `bug-ingest` or another `software` file: the `bug` route is in the
  entry (D3; spec-001 §6.5, isolation);
- `README.md` and `CHANGELOG.md`.

Roles: the pack uses roles `base` ships: `facilitator` captures and closes, `approver` triages
(`base`'s roles fragment and workflows). It ships no executable logic and names no methodology.

### D2 — Structure and classification

Each feedback element records, in frontmatter:
- `kind` — default `defect | gap | request | observation`;
- `target` — what it is about: default `product | governance | upstream:<name>`;
- `source` — who or what produced it (a person, a role, an agent, a check, a channel);
- `context` — at least one reference to what produced it: a Memory element id, a workflow and
  phase, a commit or a version;
- `outcome` — set at triage: default `bug | decision-log | task | upstream-note | declined |
  duplicate`;
- `resulting` — the id or path of the element the item was routed to, set before `closed`.

The allowed values are configurable per project. How a pack declares a configurable list of values,
and who checks that a value is allowed, is a question for the design phase (D8): format 2, like
format 1, has no list type (spec-001 §8.1), and `memory.yaml` no allowed-values key (§7.5).
Without `software` the default `outcome` list has no `bug` (D3).

### D3 — Routing into the existing governance

The review workflow routes only into what the composition is sure to have — `base`'s workflows
and types, and `software`'s only through the conditional entry — or into an upstream channel:
- `decision-log` → `decision-log-ingest`, for a decision that changes no governance; a change of
  the governance → `base`'s `governance-evolution`, whose decision-log the configuration change
  cites (dl-022 S4);
- `bug` → `software`'s `bug-ingest`, **only in a composition with `software`**: the route (its
  directive or workflow) ships in the entry `with: software@^1` (spec-001 §6.5), so the pack still
  requires only `base`; no unconditional file names it. Without `software`, the default `outcome`
  list has no `bug`, and an item that would be a bug routes to a decision-log naming it;
- `task` → a `task` element (`base`'s type, `base` 2.0.1), created in `draft` and cited back;
- `upstream-note` → the channel an **upstream pack** declares (below);
- an outcome a project adds (D2) and that has no route of its own becomes a decision-log naming the
  outcome, so nothing is lost.

`base`'s `retrospective` is not changed by this pack. Its exploration reads open feedback through
the pack's `feedback` directive, bound to `facilitator`; `governance-evolution`'s `assess` already
takes feedback among its inputs (dl-022 S4).

**Upstreams.** An upstream is added by its own governance pack that `requires` this one and ships
its channel: the workflow or directive that turns a routed item into a note in the upstream's
format, and the note's location. A routed item is mapped onto the upstream's kinds (for WingFoil,
`observation` is not a dl-163 kind: such an item becomes `request`, or is not routed upstream).

**`governance/wingfoil-dogfood`** becomes such an upstream pack: `requires: [base@^<major>,
governance/feedback@^<major>]`; it ships the `wingfoil-cli` directive and the
`docs/wingfoil-feedback/` README skeleton, the WingFoil channel and the known behaviours of the
pinned CLI. This sets the owner that dl-003 D6 and task-010 described differently: `wingfoil-cli`
is WingFoil-specific, so it belongs to the dogfood pack, not to `base` (which names no upstream).
Rules 1–7 of `wingfoil-cli` and the dl-163 note format **do not change**, and stay aligned with the
other feedback sources; a note may still be written directly (rule 3), and a note that comes from a
feedback element cites it in its body (dl-163 allows no extra frontmatter field) and is added to the
ledger like any other.

### D4 — Relation with the initialization template (dl-011)

`governance/guided-init`'s Reconfigure WingFoil phase treats installable governance packs as part
of the initial configuration. The feedback pack is the first one: the areas users (A2), policies
(A5), team and roles (A7: who triages), QA (A11), success criteria (A13) and dependencies (A14:
upstreams) decide whether it is proposed and with which kinds, targets and upstreams. Feedback
collected afterwards reaches the configuration through `governance-evolution` (D3), which a later
reconfiguration follows (dl-011 D5): that closes the flow initialization → packs → feedback →
governance → evolution. The scenario that shows it is dl-011 AC-10.

### D5 — Acceptance criteria of the capability

Each criterion says who checks it: **[V]** the validation command or a test under `tests/`;
**[E]** the fixture-element checks of D8; **[A]** the approver. Fixtures live under
`tests/fixtures/examples/feedback/<example>/` (spec-002 §2.4) and run in the compatibility matrix
on the released WingFoils `compat.yaml` lists (spec-001 O10: WingFoil 0.3.0 accepts the `format:`
key). Before the charter is accepted and before a version is published, the pack's workflows are
run on the real engine (dl-032 E2, E3: `check:runs`, a scenario starting `feedback-ingest` and
`feedback-review`).

- **FA-1 Installable [V].** `governance/feedback` composes with `software` and each published
  methodology (`methodology/scrum`, `methodology/kanban`; the `bug` route present), and without
  `software` (`base` and the pack alone); with fixture packs for `team-mode/agent-first` and a
  blueprint until W11 and W12 publish them; each composition validates (F3.3) and composes
  deterministically (F3.4). `requires` names only `base@^2`; `conflicts` is empty.
- **FA-2 Reusable [V].** No default, parameter value or rule assumes a specific upstream,
  methodology, project or person; every path, id pattern and value list is a parameter with a
  default; two fixtures with different parameter sets compose and validate; the F3.5 lint rules
  pass.
- **FA-3 Collect [V][E].** `kind`, `target`, `source` and `context` are in the type's
  `template.frontmatter.required` [V], so WingFoil refuses a `submit` without them; a fixture
  element missing one fails [E].
- **FA-4 Classify [V][E].** The triage edge is the approver's gate [V]; a fixture element with a
  value outside the configured lists fails [E].
- **FA-5 Context [E].** Every fixture feedback element cites at least one context reference that
  resolves (an existing element id, a declared workflow and phase, or a version).
- **FA-6 Available to the governance [V][E].** The review workflow routes only into workflows the
  composition declares [V]; every closed item names its `resulting` element, and that element cites
  the feedback id back — in frontmatter for `base`'s types, in the body for an upstream note [E].
- **FA-7 Evolution [E][A].** A fixture shows both paths: feedback → `governance-evolution`'s
  decision-log citing it → a `custom/` change whose commit or element cites the decision-log
  (governance evolution); with `software`, feedback → bug citing it (product evolution); without
  it, feedback → a decision-log naming the would-be bug.
- **FA-8 Upstream [V][E].** A fixture upstream pack that requires `governance/feedback` turns a
  routed item into a note with the dl-163 subset: exactly the six frontmatter fields with allowed
  values, `## Observed` and `## Expected`, no Replies section. The checks of
  `tests/wingfoil-feedback.test.ts` that belong to dl-163, rather than to this repository's ledger
  and first-line conventions, are factored out so they run on the fixture (the charter checks what
  `tests/feedback-note.test.ts` and its support already factor).

FA-9 of the first capture moved to dl-011 (AC-10).

### D6 — Amendments this decision implies

Applied after approval, under the follow-up plan of plan-020, each document bumped per
`doc-versioning`:
- **dl-001 D5 / dl-003 D7, first scope:** gains `governance/feedback`. **dl-003 D6** is refined: the
  WingFoil channel stays in `governance/wingfoil-dogfood`, which requires `governance/feedback` and
  ships `wingfoil-cli` (D3); the directive name dl-003 D6 gives (`wingfoil-feedback`) is the old
  one. Recorded by this decision-log; dl-001 and dl-003 stay as approved. Per dl-001 D7 the pack
  enters the official catalog with a maintained line; the approver confirms the commitment at the
  charter;
- **`06_features.md`** (1.6 → 1.7): feature **F4.9**, "`governance/feedback`: installable,
  configurable feedback capture, triage and routing into the governance" (journeys J5, and J10 of
  dl-011, ruled after this element; Value H, Effort M, Uncertainty **H**: the design questions of
  D8); F4.2's description gains "built on F4.9";
- **`07_sequencer.md`** (1.6 → 1.7): F4.9 joins **W10** (Kanban, presets, dogfood and adoption),
  before F4.2 which requires it. W10 then holds **four features** (F4.3 `kanban`, F2.6, F4.2,
  F4.9) with one of high uncertainty: one over the rule of three, accepted by the approver on
  2026-11-12 and recorded as an exception, like W8's. W10's state row, its "Ends with"
  (`governance/feedback` published) and its order (F4.9 before F4.2) follow; the M3 row's feature
  count goes 7 → 8;
- **`08_mvp-canvas.md`** (1.4 → 1.5): the MVP content (proposal list and features) gains
  `governance/feedback`; the feature count 35 → 36; the main-uncertainty list gains W10;
- **`docs/owed-items.md`:** the row "dl-012's F4.9 placement" closes with this ruling;
- no feedback note of its own when the pack is published: no pack is bundled in WingFoil
  (dl-021 R1, F5.4); a change to `schema/` that the design phase makes still produces one
  (`wingfoil-cli` rule 8).

Configuration changes of this repository's `.wingfoil/`: none now. This repository adopts the pack
in W10, with `base`, `software`, `methodology/kanban` and `governance/wingfoil-dogfood`. The
sequencer 1.6 orders W10 as its remaining features (the presets, `governance/feedback`,
`governance/wingfoil-dogfood`), then a pack release round, then the periodic retrospective; the
approver chose on 2026-11-12 (option (a)) that the adoption comes last, after the pack release
round (dl-003 D10 as plan-052 ruling 7 reorders it). That adoption plan lists the
knock-on effects: `wingfoil-cli` moves from `custom/` to the dogfood pack (composed into
`built-in/` in format 1, into the `remote` class once WingFoil fixes it, dl-021 R3), and
`tests/wingfoil-feedback.test.ts`'s directive path with it; this repository's own
`retrospective.yaml` and `bug-ingest.yaml`, whose comments name the feedback inbox, give way to
`base`'s and `software`'s; `docs/wingfoil-feedback/README.md`.

### D7 — Elements opened later

Through `sw-life-cycle` › `pack-delivery` › `pack-cycle`, when the sequencer reaches the pack:
- **pack charter** `pack-governance-feedback` (`charter` phase), with D1–D5 as scope and acceptance;
  its README follows spec-002 §2; accepted after the run of dl-032 E2;
- **`design` phase: required** (D8);
- **tasks** (`author` phase, `pack: pack-governance-feedback`), proposed:
  1. the `feedback` Memory-type fragment, its states and its template (FA-3, FA-4);
  2. the capture workflow with the triage gate (FA-3, FA-4, FA-5);
  3. the review workflow and the routing table into `base`'s workflows, the `bug` route in the
     entry `with: software@^1` (FA-6, FA-7);
  4. the `feedback` directive; parameters with defaults; roles (FA-2);
  5. the upstream mechanism and the fixture upstream pack (FA-8);
  6. composition fixtures across methodologies and parameter sets, and the evolution fixture (FA-1,
     FA-2, FA-7);
  7. the pack README, with its examples as fixtures (spec-002 §2.4);
- **`governance/wingfoil-dogfood`'s charter** written as an upstream pack (D3);
- **the tooling task of D8** (fixture-element checks).

### D8 — Design phase and shared tooling

**Design (a tech-spec, or an amendment of spec-001 through one).** Its questions:
- a parameter that holds a list of allowed values (a list type, or a convention over `string`), and
  how a preset sets it; format 2 has none (spec-001 §8.1); `memory.yaml`'s `fields`, `lists` and
  `not_applicable_allowed` (§7.5) and WingFoil's lack of typed references (F-043) are inputs;
- how an upstream pack declares its channel to the feedback pack;
- the shape of the entry `with: software@^1` that carries the `bug` route (D3), and whether
  WingFoil 0.3.2 evaluates any `checks` string the workflows would rely on;
- how an entry's directive reaches an agent: no unconditional roles assignment may name it
  (spec-001 §6.5 isolation, §7.4), so for example through the always-composed AGENTS.md section
  (§10). The answer serves dl-011's `guided-init-software` too.

The same questions arise for dl-013 (directive levels and types, task fields); one tech-spec answers
them for both, opened by this pack, the first of the two the sequencer reaches (W10).

**Fixture-element checks (tooling).** A tooling capability, outside any pack: a test helper that
reads the Memory elements of a fixture project and checks required fields, allowed values,
references that resolve and back-references. It is opened as a tooling task (`pack: ""`) through
`tooling-change` before the first pack that uses it, and serves dl-011, dl-012 and dl-013 (their
**[E]** criteria).

## Execution Notes

- Captured 2026-10-09 under plan-020, on the approver's request in chat; no implementation in this
  step.
- Open for the approver at the ruling: the pack name; the state machine of D1. The owner of
  `wingfoil-cli` (D3) is settled by dl-022 S5.
- Ruling order: dl-012 first, then dl-011 (which cites it in AC-10), then dl-013 (its preset).
- 2026-10-09: amended while `pending` after an independent review, as the approver asked: design
  phase required and its questions listed, "uses only spec-001 mechanisms" removed (review N1);
  routing limited to `base`'s workflows and upstream packs, retrospective left to `base`'s charter
  (N2); acceptance criteria tagged by checker and the shared fixture-element checks (N3); FA-8 and
  FA-6 aligned with dl-163 and the existing test (N4); owner of `wingfoil-cli`, rules 1–7 unchanged,
  direct notes still allowed, adoption knock-ons (N5); FA-9 moved to dl-011 (N6); exact state
  machine (N7); `requires` syntax and who may require the pack (N8); outcome list and default route
  (N9); kind mapping for upstreams (N10); complete amendments, Uncertainty H (N11); FA wording and
  self-test mode (N12); roles (N13); wording fixes (N14).
- 2026-10-09: the approver deferred the ruling, in chat: dl-011, dl-012 and dl-013 are ruled once
  WingFoil has released stable configuration contracts (at least v0.3, preferably later); dl-014 may
  be ruled earlier. The element stays `pending` until then (precedent: dl-007). At the ruling, the
  text is re-checked against the formats that WingFoil release defines.
- 2026-10-14, plan-034: the line "the feedback note owed to WingFoil when the pack is published is
  the one `wingfoil-cli` rule 8 already requires for a pack WingFoil bundles" is superseded by
  dl-021 R1: no pack is bundled in WingFoil's npm package, so the publication of
  `governance/feedback` owes WingFoil no note of its own. The text is re-checked at the ruling, as
  the note of 2026-10-09 says; the element stays `pending`.
- 2026-11-12: re-checked against WingFoil 0.3.2 and the repository at `0dc03bc2` before the ruling
  (plan-020), amended while `pending`: `base`'s workflows and roles as published (dl-022 S2, S4),
  `bug-ingest` being `software`'s (S3); governance changes routed to `governance-evolution`;
  `task` confirmed as `base`'s type; the owner of `wingfoil-cli` settled (dl-022 S5); format 2
  read (still no list type; the conditional entry); self-test mode dropped (spec-001 O10) and the
  runs of dl-032 added; FA-1 against the published methodologies, with and without `software`;
  README per spec-002; the bundling line folded in (dl-021 R1); W9 → W10, M2 → M3, the adoption at
  the end of W10; amendments retargeted (features 1.7, sequencer 1.7, canvas 1.5, owed row). The
  approver's rulings of 2026-11-12 recorded: the `bug` route ships in an entry
  `with: software@^1`, without `software` a would-be bug routes to a decision-log, the pack still
  requiring only `base`; W10 holds four features (F4.3, F2.6, F4.2, F4.9) as a recorded exception;
  ruling order dl-012, dl-011, dl-013. Review of the amendment: approve after amendments, applied:
  FA-1's compositions (with `software` and each published methodology, without it, fixture packs
  until W11 and W12); the unconditional directive never naming `bug-ingest`; the design question
  on how an entry's directive reaches an agent, shared with dl-011; `task` in the default
  outcomes; W10's order cited as the sequencer 1.6 writes it, with the approver's choice of the
  adoption last.
