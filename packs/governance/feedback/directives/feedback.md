---
id: feedback
name: feedback
type: directive
kind: built-in
format: 1
title: "Feedback"
---

# Feedback

Feedback is any observation about the project or its governance that someone wants acted on: a
defect, a gap, a request, a remark from a person, a role, an agent, a check or a channel. It is
captured as a `feedback` element, triaged by the approver, routed into the governance the project
already has, and closed once the routed element is named. Feedback the project keeps elsewhere (an
issue tracker, notes, a channel) stays there until it is to be triaged.

## Fields

- `kind`, `target`, `source` and `context` are required: WingFoil refuses a `submit` without them.
  - `kind` is one of: {{feedback_kinds}}.
  - `target` is one of: {{feedback_targets}}.
  - `source` names who or what produced the feedback.
  - `context` holds at least one reference to what produced it, separated by commas: a Memory
    element id, a workflow and phase (`<workflow>.<phase>`), a commit or a version.
- `outcome` is one of the outcomes `feedback-review` routes: {{feedback_outcomes}}, plus those a
  directive tagged `feedback-route` allows. A project never adds `bug` to that list: `bug` exists
  only where a directive tagged `feedback-route` allows it.
- `resulting` names the routed element: its id or path, or `n/a — <reason>` for an item declined
  or a duplicate.
- WingFoil checks no value of these fields: write only a listed value in `kind`, `target` and
  `outcome`, and nothing else.

## Classification

- `defect`: something that does not work as the project or its governance says it should.
- `gap`: something the project or its governance does not cover and should.
- `request`: a change someone asks for.
- `observation`: a remark with no change asked for yet.
- `product`: about what the project makes; `governance`: about how it is governed (its workflows,
  directives, roles, Memory); `upstream:<name>`: about something an upstream owns, when the
  project composes that upstream's pack.
- A project that adds a kind or a target defines it here, in a directive of its own that overrides
  this one.

## Triage

- The facilitator proposes the outcome before the triage, in `outcome`, and submits the item
  (`draft → pending`) once its source and context are recorded.
- The approver triages (`pending → triaged`): the classification confirmed and the outcome
  decided. The approver rejects the item to `draft` when its `outcome` is empty or not allowed.
- An item that would be a `bug` where no directive tagged `feedback-route` allows `bug` is
  proposed as `decision-log`, its body and the decision-log naming what it would have been.

## Routes

Each target is added outside the pack's step, citing the item, by the role its own workflow binds
or with `memory add` for a type with no workflow of its own; then the facilitator writes
`resulting` and records the route step with `workflow finalize`.

| Outcome | Route |
|---|---|
| `decision-log` | a decision-log through `decision-log-ingest`; a change of the governance through `governance-evolution`, whose decision-log the configuration change cites |
| `task` | a `task` in `draft`, citing the item |
| `upstream-note` | a note through the channel that serves the item's `target` |
| `declined`, `duplicate` | closed with the reason in `resulting` (`n/a — <reason>`) and in the body |
| any other allowed outcome | a decision-log naming the outcome |

## Directives this one reads

- **`feedback-route`:** whenever you propose an outcome, and at every route step, read every
  directive tagged `feedback-route`: it may allow more outcomes and route them. At a route step,
  read the step with `workflow next` and follow the directive its action names.
- **`feedback-channel`:** for an `upstream-note` item, read the directive tagged
  `feedback-channel` whose line "Serves the target `upstream:<name>`." names the item's
  `target`. When none does, route the item to a decision-log naming the target. When two do,
  route nothing and raise it to the approver.

## The trace both ways

- Every closed item names its routed element in `resulting`.
- That element cites the item back: through its `reported_by` field where its template has one,
  otherwise in its body, naming the feedback id. An upstream note cites it in its body.

## Closing and the review

- The facilitator closes an item (`triaged → closed`) once `resulting` is written.
- `memory deprecate` withdraws an item captured by mistake.
- `feedback-review` is started at the cadence the project chooses. A completed run still takes an
  item triaged after it, so end it (`workflow end`) once the project has reviewed.

## The agent

The agent captures and routes as the facilitator. It never approves: it hands the approver the
exact command.
