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
  skeleton" instead of the old `wingfoil-feedback` directive;
- **WingFoil dl-163** (consumer projects' feedback sources) fixes the format of a note sent to
  WingFoil: one file per note, exactly six frontmatter fields, statuses other than `open` set only
  by a sync from what WingFoil published. This repository applies it in `docs/wingfoil-feedback/`
  with the `wingfoil-cli` directive, whose rules 1–7 are kept word for word across the feedback
  sources (task-010);
- `base` ships the capture workflows (`bug-ingest`, `decision-log-ingest`, …) and `retrospective`
  (dl-003 D2), which are where feedback turns into change. `retrospective` is not a slot and no
  other pack may change it (spec-001 §9, O6);
- the `governance` axis has cardinality "many" (dl-003 D6) and is composed after the methodology,
  the phase and the blueprint packs (spec-001 §7.1), so only `governance`, `team-mode` and `stage`
  packs may require a governance pack;
- spec-001 format 1 has scalar parameter types only (`string`, `integer`, `boolean`, `path`,
  `pattern`, §8.1), each parameter declared by one pack and set only by a default, a preset or the
  composition; `memory.yaml` has no allowed-values key (§7.5); WingFoil 0.2.2 checks only that
  required frontmatter fields are present at `submit`, and nothing evaluates a workflow's `checks`
  strings. The validation command checks packs and compositions, not Memory elements.

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
the name is the approver's to confirm). It **requires nothing but `base`**; `conflicts` is empty.
It ships:
- a `fragments/memory.yaml` defining the type **`feedback`** (path and id pattern as parameters
  with defaults) and its Memory template. States, with `base`'s names (dl-003 D2) and no `waiting`
  state (dl-003 D3):
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
  classification rules, the routing table, the trace both ways, who may close an item;
- `README.md` and `CHANGELOG.md`.

Roles: the pack uses roles `base` ships (expected: a facilitator captures and closes, the approver
triages); if `base`'s charter names them differently, role names are `string` parameters
(spec-001 §8.2). It ships no executable logic and names no methodology.

### D2 — Structure and classification

Each feedback element records, in frontmatter:
- `kind` — default `defect | gap | request | observation`;
- `target` — what it is about: default `product | governance | upstream:<name>`;
- `source` — who or what produced it (a person, a role, an agent, a check, a channel);
- `context` — at least one reference to what produced it: a Memory element id, a workflow and
  phase, a commit or a version;
- `outcome` — set at triage: default `bug | decision-log | upstream-note | declined | duplicate`;
- `resulting` — the id or path of the element the item was routed to, set before `closed`.

The allowed values are configurable per project. How a pack declares a configurable list of values,
and who checks that a value is allowed, is a question for the design phase (D8): format 1 has no
list type.

### D3 — Routing into the existing governance

The review workflow routes only into what the composition is sure to have — `base`'s capture
workflows and types — or into an upstream channel:
- `bug` → `bug-ingest`; `decision-log` → `decision-log-ingest` (a decision-log is also the path for
  a change of the governance: a configuration change cites it);
- a task: only if `base` defines a `task` type, which `base`'s charter confirms; otherwise a
  decision-log that asks the methodology's owner to open one;
- `upstream-note` → the channel an **upstream pack** declares (below);
- an outcome a project adds (D2) and that has no route of its own becomes a decision-log naming the
  outcome, so nothing is lost.

`base`'s `retrospective` is not changed by this pack. Reading open feedback in the retrospective's
exploration, generically, is an input to `base`'s charter, recorded here for it.

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

`phase/inception/guided-init`'s Reconfigure WingFoil phase treats installable governance packs as
part of the initial configuration. The feedback pack is the first one: the areas users (A2),
policies (A5), team and roles (A7: who triages), QA (A11), success criteria (A13) and dependencies
(A14: upstreams) decide whether it is proposed and with which kinds, targets and upstreams. Feedback
collected afterwards reaches the configuration through a decision-log (D3) that a later
reconfiguration follows (dl-011 D5): that closes the flow initialization → packs → feedback →
governance → evolution. The scenario that shows it is dl-011 AC-10.

### D5 — Acceptance criteria of the capability

Each criterion says who checks it: **[V]** the validation command or a test under `tests/`;
**[E]** the fixture-element checks of D8; **[A]** the approver. Fixtures live under
`tests/fixtures/examples/feedback/<example>/` (dl-014) and run in the matrix's self-test mode
(dl-009) while no released WingFoil accepts the `format:` key.

- **FA-1 Installable [V].** `base` + `governance/feedback` composes with each first-scope
  methodology (fixture methodologies until they are published), with and without
  `team-mode/agent-first` and a blueprint; each composition validates (F3.3) and composes
  deterministically (F3.4). `requires` names only `base@^<major>`; `conflicts` is empty.
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
- **FA-7 Evolution [E][A].** A fixture shows both paths: feedback → decision-log citing it → a
  `custom/` change whose commit or element cites the decision-log (governance evolution); feedback
  → bug citing it (product evolution).
- **FA-8 Upstream [V][E].** A fixture upstream pack that requires `governance/feedback` turns a
  routed item into a note with the dl-163 subset: exactly the six frontmatter fields with allowed
  values, `## Observed` and `## Expected`, no Replies section. The checks of
  `tests/wingfoil-feedback.test.ts` that belong to dl-163, rather than to this repository's ledger
  and first-line conventions, are factored out so they run on the fixture.

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
- **`06_features.md`:** feature **F4.9**, "`governance/feedback`: installable, configurable feedback
  capture, triage and routing into the governance" (journeys J5, and J10 if dl-011 is approved;
  Value H, Effort M, Uncertainty **H**: the format extensions of D8); F4.2's description gains
  "built on F4.9";
- **`07_sequencer.md`:** F4.9 joins **W9** (dogfood and adoption), before F4.2 which requires it;
  W9 then holds three features with one of high uncertainty, within the sequencer's rules. The M2
  row follows: goal "`base`, `governance/feedback` and `governance/wingfoil-dogfood` published",
  feature count 5 → 6, and W9's "Ends with";
- **`08_mvp-canvas.md`:** the MVP content (proposal list and features) gains `governance/feedback`;
- the feedback note owed to WingFoil when the pack is published is the one `wingfoil-cli` rule 8
  already requires for a pack WingFoil bundles; no other note now.

Configuration changes of this repository's `.wingfoil/`: none now. This repository adopts the pack
with `base` in W9 (dl-003 D10); that adoption plan lists the knock-on effects: `wingfoil-cli` moves
from `custom/` to the dogfood pack's `built-in/` (and `tests/wingfoil-feedback.test.ts`'s directive
path with it), the comments that name the feedback inbox in `retrospective.yaml` and
`bug-ingest.yaml`, and `docs/wingfoil-feedback/README.md`.

### D7 — Elements opened later

Through `sw-life-cycle` › `pack-delivery` › `pack-cycle`, when the sequencer reaches the pack:
- **pack charter** `pack-governance-feedback` (`charter` phase), with D1–D5 as scope and acceptance;
  its README follows dl-014 D1 if approved, otherwise spec-001 §6.1;
- **`design` phase: required** (D8);
- **tasks** (`author` phase, `pack: pack-governance-feedback`), proposed:
  1. the `feedback` Memory-type fragment, its states and its template (FA-3, FA-4);
  2. the capture workflow with the triage gate (FA-3, FA-4, FA-5);
  3. the review workflow and the routing table into `base`'s workflows (FA-6, FA-7);
  4. the `feedback` directive; parameters with defaults; roles (FA-2);
  5. the upstream mechanism and the fixture upstream pack (FA-8);
  6. composition fixtures across methodologies and parameter sets, and the evolution fixture (FA-1,
     FA-2, FA-7);
  7. the pack README, with its examples as fixtures (dl-014 D1);
- **`governance/wingfoil-dogfood`'s charter** written as an upstream pack (D3);
- **the tooling task of D8** (fixture-element checks).

### D8 — Design phase and shared tooling

**Design (a tech-spec, or an amendment of spec-001 through one).** Its questions:
- a parameter that holds a list of allowed values (a list type, or a convention over `string`), and
  how a preset sets it;
- how an upstream pack declares its channel to the feedback pack;
- whether `base`'s charter defines `task` (D3).

The same questions arise for dl-013 (directive levels and types, task fields); one tech-spec answers
them for both, opened by the first of the two packs the sequencer reaches.

**Fixture-element checks (tooling).** A tooling capability, outside any pack: a test helper that
reads the Memory elements of a fixture project and checks required fields, allowed values,
references that resolve and back-references. It is opened as a tooling task (`pack: ""`) through
`tooling-change` once plan-015 is `done`, before the first pack that uses it, and serves dl-011,
dl-012 and dl-013 (their **[E]** criteria).

## Execution Notes

- Captured 2026-10-09 under plan-020, on the approver's request in chat; no implementation in this
  step.
- Open for the approver at the ruling: the pack name; the state machine of D1; the owner of
  `wingfoil-cli` (D3), to be aligned with the other feedback sources.
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
